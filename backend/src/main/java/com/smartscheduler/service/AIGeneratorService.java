package com.smartscheduler.service;

import com.smartscheduler.dto.AIGenerateRequest;
import com.smartscheduler.entity.Schedule;
import com.smartscheduler.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AIGeneratorService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private ConflictService conflictService;

    @Autowired
    private AuditService auditService;

    public Map<String, Object> generateConflictFreeTimetable(AIGenerateRequest req, String actorUsername) {
        List<String> days = (req.getDays() != null && !req.getDays().isEmpty()) ? req.getDays() :
                Arrays.asList("Monday", "Tuesday", "Wednesday", "Thursday", "Friday");

        List<String> timeSlots = (req.getTimeSlots() != null && !req.getTimeSlots().isEmpty()) ? req.getTimeSlots() :
                Arrays.asList("09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM");

        List<String> rooms = (req.getRooms() != null && !req.getRooms().isEmpty()) ? req.getRooms() :
                Arrays.asList("Room 101", "Room 102", "Room 201", "Lab A");

        List<String> profs = (req.getProfessors() != null && !req.getProfessors().isEmpty()) ? req.getProfessors() :
                Arrays.asList("Dr. Uday Kumar", "Prof. Srikanth", "Dr. Ramesh", "Prof. Sneha");

        List<String> subjects = (req.getSubjects() != null && !req.getSubjects().isEmpty()) ? req.getSubjects() :
                Arrays.asList("Java Programming", "Operating Systems", "Python for ML", "Database Systems", "Data Structures");

        List<String> groups = (req.getGroups() != null && !req.getGroups().isEmpty()) ? req.getGroups() :
                Arrays.asList("Group A", "Group B", "Group C");

        List<Schedule> generatedSchedules = new ArrayList<>();
        int generatedCount = 0;

        for (String group : groups) {
            for (int i = 0; i < subjects.size(); i++) {
                String subject = subjects.get(i);
                String professor = profs.get(i % profs.size());

                boolean placed = false;
                for (String day : days) {
                    if (placed) break;
                    for (String time : timeSlots) {
                        if (placed) break;
                        for (String room : rooms) {
                            Schedule candidate = new Schedule();
                            candidate.setProfessorName(professor);
                            candidate.setSubject(subject);
                            candidate.setGroupName(group);
                            candidate.setDay(day);
                            candidate.setTime(time);
                            candidate.setRoomNumber(room);
                            candidate.setStatus("PUBLISHED");
                            candidate.setCreatedBy("AI_ENGINE");

                            List<String> conflicts = conflictService.detectConflicts(candidate, null);
                            if (conflicts.isEmpty()) {
                                Schedule saved = scheduleRepository.save(candidate);
                                generatedSchedules.add(saved);
                                generatedCount++;
                                placed = true;
                                break;
                            }
                        }
                    }
                }
            }
        }

        auditService.logAction(actorUsername, "AI_GENERATE_TIMETABLE", "AI_ENGINE", null,
                "AI Timetable Generator automatically generated " + generatedCount + " conflict-free class slots.");

        Map<String, Object> response = new HashMap<>();
        response.put("generatedCount", generatedCount);
        response.put("schedules", generatedSchedules);
        response.put("message", "🤖 AI Timetable Engine generated " + generatedCount + " conflict-free classes successfully!");

        return response;
    }
}
