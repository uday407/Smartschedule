package com.smartscheduler.controller;

import com.smartscheduler.dto.AIGenerateRequest;
import com.smartscheduler.dto.ApiResponse;
import com.smartscheduler.entity.AuditLog;
import com.smartscheduler.entity.Notification;
import com.smartscheduler.service.AIGeneratorService;
import com.smartscheduler.service.AuditService;
import com.smartscheduler.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class AuditController {

    @Autowired
    private AuditService auditService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AIGeneratorService aiGeneratorService;

    @GetMapping("/api/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(auditService.getRecentLogs());
    }

    @GetMapping("/api/notifications")
    public ResponseEntity<List<Notification>> getNotifications(@RequestParam(defaultValue = "admin") String username) {
        return ResponseEntity.ok(notificationService.getNotificationsForUser(username));
    }

    @PutMapping("/api/notifications/{id}/read")
    public ResponseEntity<ApiResponse> markNotificationRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(new ApiResponse(true, "Notification marked as read"));
    }

    @PostMapping("/api/ai/generate-timetable")
    public ResponseEntity<Map<String, Object>> generateAITimetable(@RequestBody(required = false) AIGenerateRequest req,
                                                                   Principal principal) {
        if (req == null) {
            req = new AIGenerateRequest();
        }
        String actor = principal != null ? principal.getName() : "admin";
        Map<String, Object> result = aiGeneratorService.generateConflictFreeTimetable(req, actor);
        return ResponseEntity.ok(result);
    }
}
