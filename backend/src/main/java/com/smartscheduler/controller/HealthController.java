package com.smartscheduler.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> rootHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "SmartScheduler-Plus Enterprise Backend");
        response.put("swaggerUi", "/swagger-ui/index.html");
        response.put("apiDocs", "/v3/api-docs");
        return ResponseEntity.ok(response);
    }

    @Autowired
    private com.smartscheduler.service.EmailService emailService;

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, Object>> apiHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/test-email")
    public ResponseEntity<Map<String, Object>> testEmail() {
        emailService.sendScheduleNotification("n.udaykumar2005@gmail.com", 
            "⚡ SmartScheduler-Plus Live Test Notification", 
            "Great news! Your SmartScheduler-Plus email notification engine is 100% active, verified, and sending real-time alerts to your Gmail inbox!");
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "Test email dispatched to n.udaykumar2005@gmail.com!");
        return ResponseEntity.ok(response);
    }
}
