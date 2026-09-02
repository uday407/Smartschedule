package com.smartscheduler.controller;

import com.smartscheduler.dto.ApiResponse;
import com.smartscheduler.dto.ApprovalRequest;
import com.smartscheduler.entity.Schedule;
import com.smartscheduler.service.ConflictService;
import com.smartscheduler.service.ScheduleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@CrossOrigin(origins = "*")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private ConflictService conflictService;

    @GetMapping
    public ResponseEntity<List<Schedule>> getAllSchedules() {
        return ResponseEntity.ok(scheduleService.getAllSchedules());
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<Schedule>> getSchedulesPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String professor,
            @RequestParam(required = false) String day,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String subject) {
        Page<Schedule> pagedResult = scheduleService.getSchedulesPaged(page, size, professor, day, status, subject);
        return ResponseEntity.ok(pagedResult);
    }

    @GetMapping("/published")
    public ResponseEntity<List<Schedule>> getPublishedSchedules() {
        return ResponseEntity.ok(scheduleService.getPublishedSchedules());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Schedule>> getPendingApprovalSchedules() {
        return ResponseEntity.ok(scheduleService.getPendingApprovalSchedules());
    }

    @PostMapping("/check-conflicts")
    public ResponseEntity<ApiResponse> checkConflicts(@RequestBody Schedule schedule) {
        List<String> conflicts = conflictService.detectConflicts(schedule, schedule.getId());
        if (conflicts.isEmpty()) {
            return ResponseEntity.ok(new ApiResponse(true, "✅ No conflicts detected! Slot is available."));
        } else {
            return ResponseEntity.ok(new ApiResponse(false, String.join(" | ", conflicts)));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createSchedule(@Valid @RequestBody Schedule schedule,
                                                       @RequestParam(defaultValue = "admin") String username,
                                                       @RequestParam(defaultValue = "HOD") String role) {
        Schedule created = scheduleService.createSchedule(schedule, username, role);
        return ResponseEntity.ok(new ApiResponse(true, "Schedule submitted successfully! Status: " + created.getStatus(), created));
    }

    @PutMapping("/{id}/approval")
    public ResponseEntity<ApiResponse> handleApproval(@PathVariable Long id,
                                                       @Valid @RequestBody ApprovalRequest request,
                                                       Principal principal) {
        String actor = principal != null ? principal.getName() : "admin";
        String newStatus = "APPROVE".equalsIgnoreCase(request.getAction()) ? "PUBLISHED" : "REJECTED";
        Schedule updated = scheduleService.updateScheduleStatus(id, newStatus, request.getReason(), actor);
        return ResponseEntity.ok(new ApiResponse(true, "Schedule request " + newStatus, updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteSchedule(@PathVariable Long id, Principal principal) {
        String actor = principal != null ? principal.getName() : "admin";
        scheduleService.deleteSchedule(id, actor);
        return ResponseEntity.ok(new ApiResponse(true, "Schedule deleted successfully!"));
    }
}
