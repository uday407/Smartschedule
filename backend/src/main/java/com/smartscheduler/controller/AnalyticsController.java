package com.smartscheduler.controller;

import com.smartscheduler.entity.Schedule;
import com.smartscheduler.entity.User;
import com.smartscheduler.repository.ScheduleRepository;
import com.smartscheduler.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/api/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        List<Schedule> allSchedules = scheduleRepository.findAll();

        Map<String, Long> dayStats = new HashMap<>();
        for (Schedule s : allSchedules) {
            String day = (s.getDay() != null) ? s.getDay().trim() : "Other";
            dayStats.put(day, dayStats.getOrDefault(day, 0L) + 1);
        }

        Map<String, Long> groupStats = new HashMap<>();
        for (Schedule s : allSchedules) {
            String group = (s.getGroupName() != null) ? s.getGroupName() : "Unassigned";
            groupStats.put(group, groupStats.getOrDefault(group, 0L) + 1);
        }

        Map<String, Long> subjectStats = new HashMap<>();
        for (Schedule s : allSchedules) {
            String subject = (s.getSubject() != null) ? s.getSubject().trim() : "Other";
            subjectStats.put(subject, subjectStats.getOrDefault(subject, 0L) + 1);
        }

        List<User> profs = userRepository.findByRole("PROFESSOR");

        Map<String, Object> response = new HashMap<>();
        response.put("totalSchedules", (long) allSchedules.size());
        response.put("totalProfessors", (long) profs.size());
        response.put("dayStats", dayStats);
        response.put("groupStats", groupStats);
        response.put("subjectStats", subjectStats);

        return ResponseEntity.ok(response);
    }
}
