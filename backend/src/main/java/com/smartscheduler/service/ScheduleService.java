package com.smartscheduler.service;

import com.smartscheduler.entity.Schedule;
import com.smartscheduler.exception.ConflictException;
import com.smartscheduler.exception.ResourceNotFoundException;
import com.smartscheduler.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private ConflictService conflictService;

    @Autowired
    private AuditService auditService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EmailService emailService;

    @org.springframework.beans.factory.annotation.Value("${spring.mail.username:nudaykumar2005@gmail.com}")
    private String targetMailUsername = "nudaykumar2005@gmail.com";

    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    public Page<Schedule> getSchedulesPaged(int page, int size, String professor, String day, String status, String subject) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return scheduleRepository.searchSchedulesPaged(professor, day, status, subject, pageable);
    }

    public List<Schedule> getPublishedSchedules() {
        return scheduleRepository.findByStatus("PUBLISHED");
    }

    public List<Schedule> getPendingApprovalSchedules() {
        return scheduleRepository.findByStatus("PENDING_APPROVAL");
    }

    public Schedule createSchedule(Schedule s, String actorUsername, String userRole) {
        List<String> conflicts = conflictService.detectConflicts(s, null);
        if (!conflicts.isEmpty()) {
            throw new ConflictException(String.join(" | ", conflicts));
        }

        s.setCreatedBy(actorUsername);
        if ("HOD".equalsIgnoreCase(userRole) || "ADMIN".equalsIgnoreCase(userRole)) {
            s.setStatus("PUBLISHED");
        } else {
            s.setStatus("PENDING_APPROVAL");
        }

        Schedule saved = scheduleRepository.save(s);

        auditService.logAction(actorUsername, "CREATE_SCHEDULE", "Schedule", saved.getId(),
                "Created class '" + s.getSubject() + "' for " + s.getProfessorName() + " (" + s.getGroupName() + ") - Status: " + s.getStatus());

        if ("PENDING_APPROVAL".equals(s.getStatus())) {
            notificationService.sendNotification("admin", "New Schedule Pending Approval",
                    "Prof. " + s.getProfessorName() + " requested class '" + s.getSubject() + "' on " + s.getDay() + " @ " + s.getTime(), "APPROVAL");
        } else {
            notificationService.sendNotification("ALL", "New Class Scheduled",
                    "Class '" + s.getSubject() + "' assigned to " + s.getProfessorName() + " in " + s.getRoomNumber(), "TIMETABLE_CHANGE");
        }

        // Email Notification Dispatch
        emailService.sendScheduleNotification(
                targetMailUsername,
                "📅 SmartScheduler Alert: New Class Assigned - " + s.getSubject(),
                "Dear " + s.getProfessorName() + ",\n\nA new class session for '" + s.getSubject() +
                "' has been assigned to you on " + s.getDay() + " at " + s.getTime() + " in " + s.getRoomNumber() + ".\nStatus: " + s.getStatus()
        );

        return saved;
    }

    public Schedule updateScheduleStatus(Long id, String status, String reason, String actorUsername) {
        Schedule s = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id " + id));

        s.setStatus(status);
        if (reason != null) {
            s.setRejectionReason(reason);
        }

        Schedule updated = scheduleRepository.save(s);

        auditService.logAction(actorUsername, status + "_SCHEDULE", "Schedule", id,
                "Schedule ID " + id + " (" + s.getSubject() + ") updated status to " + status + (reason != null ? ". Reason: " + reason : ""));

        notificationService.sendNotification(s.getProfessorName(), "Schedule Status Update",
                "Your proposed class '" + s.getSubject() + "' status is now: " + status, "APPROVAL");

        // Email Status Update Alert
        emailService.sendScheduleNotification(
                targetMailUsername,
                "🔔 SmartScheduler Alert: Schedule Approval Status Updated - " + status,
                "Dear " + s.getProfessorName() + ",\n\nYour proposed class '" + s.getSubject() +
                "' for " + s.getDay() + " @ " + s.getTime() + " has been updated to: " + status +
                (reason != null ? "\nReason: " + reason : "")
        );

        return updated;
    }

    public void deleteSchedule(Long id, String actorUsername) {
        Schedule s = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id " + id));

        scheduleRepository.deleteById(id);

        auditService.logAction(actorUsername, "DELETE_SCHEDULE", "Schedule", id,
                "Deleted class '" + s.getSubject() + "' assigned to " + s.getProfessorName());
    }
}
