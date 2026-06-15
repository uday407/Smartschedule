package com.smartscheduler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
public class MainController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    // Create initial admin user
    @GetMapping("/api/setup")
    public String setup() {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword("admin123");
            admin.setFullName("Head of Department");
            admin.setRole("HOD");
            userRepository.save(admin);
            return "✅ Setup done! User: admin / admin123";
        }
        return "✅ Already setup!";
    }

    // Simple Login
    @PostMapping("/api/login")
    public Map<String, String> login(@RequestBody Map<String, String> data) {
        String user = data.get("username");
        String pass = data.get("password");

        Optional<User> foundUser = userRepository.findByUsername(user);
        if (foundUser.isPresent() && foundUser.get().getPassword().equals(pass)) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("role", foundUser.get().getRole());
            response.put("fullName", foundUser.get().getFullName());
            
            String mobile = foundUser.get().getMobile();
            if (mobile != null) {
                response.put("mobile", mobile);
            } else {
                response.put("mobile", "");
            }
            
            String dept = foundUser.get().getDepartment();
            if (dept != null) {
                response.put("department", dept);
            } else {
                response.put("department", "");
            }
            return response;
        }
        
        Map<String, String> failResponse = new HashMap<>();
        failResponse.put("status", "fail");
        failResponse.put("message", "Login Failed");
        return failResponse;
    }

    // Get all schedules
    @GetMapping("/api/schedules")
    public List<Schedule> getSchedules() {
        return scheduleRepository.findAll();
    }

    // Add schedule WITH CONFLICT CHECK
    @PostMapping("/api/schedules")
    public Map<String, String> addSchedule(@RequestBody Schedule s) {
        Optional<Schedule> conflict = scheduleRepository.findByProfessorNameAndDayAndTime(
            s.getProfessorName(), s.getDay(), s.getTime()
        );
        
        Map<String, String> response = new HashMap<>();
        if (conflict.isPresent()) {
            response.put("message", "❌ CONFLICT: Professor already has a class at this time!");
            return response;
        }
        
        scheduleRepository.save(s);
        response.put("message", "✅ Schedule added!");
        return response;
    }

    // Delete Feature
    @DeleteMapping("/api/schedules/{id}")
    public Map<String, String> deleteSchedule(@PathVariable Long id) {
        scheduleRepository.deleteById(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "🗑️ Schedule deleted!");
        return response;
    }
    
    // Get all professors
    @GetMapping("/api/professors")
    public List<User> getProfessors() {
        return userRepository.findByRole("PROFESSOR");
    }

    @PostMapping("/api/register")
    public Map<String, String> register(@RequestBody User user) {
        user.setRole("PROFESSOR");
        if (user.getImageUrl() == null || user.getImageUrl().isEmpty()) {
            user.setImageUrl("https://ui-avatars.com/api/?name=" + user.getFullName());
        }
        userRepository.save(user);
        Map<String, String> response = new HashMap<>();
        response.put("message", "✅ Professor registered!");
        return response;
    }

    // Simple Analytics
    @GetMapping("/api/analytics")
    public Map<String, Object> getAnalytics() {
        List<Schedule> allSchedules = scheduleRepository.findAll();
        
        // Count per day using standard for loop
        Map<String, Long> dayStats = new HashMap<>();
        for (int i = 0; i < allSchedules.size(); i++) {
            Schedule s = allSchedules.get(i);
            String day = "Other";
            if (s.getDay() != null) {
                day = s.getDay().trim();
            }
            
            if (!day.equals("Other") && day.length() > 0) {
                String firstLetter = day.substring(0, 1).toUpperCase();
                String restOfWord = day.substring(1).toLowerCase();
                day = firstLetter + restOfWord;
            }
            
            if (dayStats.containsKey(day)) {
                long count = dayStats.get(day);
                dayStats.put(day, count + 1);
            } else {
                dayStats.put(day, 1L);
            }
        }
        
        // Count per group using standard for loop
        Map<String, Long> groupStats = new HashMap<>();
        for (int i = 0; i < allSchedules.size(); i++) {
            Schedule s = allSchedules.get(i);
            String group = "Unassigned";
            if (s.getGroupName() != null) {
                group = s.getGroupName();
            }
            
            if (groupStats.containsKey(group)) {
                long count = groupStats.get(group);
                groupStats.put(group, count + 1);
            } else {
                groupStats.put(group, 1L);
            }
        }

        // Count per subject using standard for loop (Job Unique Feature)
        Map<String, Long> subjectStats = new HashMap<>();
        for (int i = 0; i < allSchedules.size(); i++) {
            Schedule s = allSchedules.get(i);
            String subject = "Other";
            if (s.getSubject() != null) {
                subject = s.getSubject().trim();
            }
            
            if (subjectStats.containsKey(subject)) {
                long count = subjectStats.get(subject);
                subjectStats.put(subject, count + 1);
            } else {
                subjectStats.put(subject, 1L);
            }
        }

        // Get total professors
        List<User> profs = userRepository.findByRole("PROFESSOR");
        long totalProfs = profs.size();

        Map<String, Object> response = new HashMap<>();
        response.put("totalSchedules", (long) allSchedules.size());
        response.put("totalProfessors", totalProfs);
        response.put("dayStats", dayStats);
        response.put("groupStats", groupStats);
        response.put("subjectStats", subjectStats);
        
        return response;
    }

    // Test endpoint
    @GetMapping("/api/test")
    public String test() {
        System.out.println(">>> HIT: /api/test called!");
        return "✅ Backend API is active at /api/test";
    }

    // Demo Data Seeder
    @GetMapping("/api/demo")
    public String seedData() {
        System.out.println(">>> HIT: /api/demo called! Seeding data...");
        scheduleRepository.deleteAll();
        userRepository.deleteAll();
        setup();

        // 1. Professors
        User p1 = new User();
        p1.setFullName("Dr. Uday Kumar");
        p1.setUsername("uday");
        p1.setPassword("123");
        p1.setRole("PROFESSOR");
        p1.setDepartment("CSE");
        p1.setMobile("9885012345");
        userRepository.save(p1);

        User p2 = new User();
        p2.setFullName("Prof. Srikanth");
        p2.setUsername("sri");
        p2.setPassword("123");
        p2.setRole("PROFESSOR");
        p2.setDepartment("ECE");
        p2.setMobile("9944055667");
        userRepository.save(p2);

        // 2. Schedules
        String[] days = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday"};
        String[] subjects = {"Java", "OS", "Python", "DBMS", "DS"};
        
        for (int i = 0; i < days.length; i++) {
            String d = days[i];
            
            Schedule sA = new Schedule();
            sA.setProfessorName("Dr. Uday Kumar");
            sA.setSubject(subjects[i % subjects.length]);
            sA.setDay(d);
            sA.setTime("10:00 AM");
            sA.setGroupName("Group A");
            scheduleRepository.save(sA);
            
            Schedule sB = new Schedule();
            sB.setProfessorName("Prof. Srikanth");
            sB.setSubject(subjects[(i + 1) % subjects.length]);
            sB.setDay(d);
            sB.setTime("11:00 AM");
            sB.setGroupName("Group B");
            scheduleRepository.save(sB);
            
            Schedule sC = new Schedule();
            sC.setProfessorName("Dr. Uday Kumar");
            sC.setSubject(subjects[(i + 2) % subjects.length]);
            sC.setDay(d);
            sC.setTime("02:00 PM");
            sC.setGroupName("Group C");
            scheduleRepository.save(sC);
        }

        return "✅ Heavy Demo Data Loaded! Visit /api/schedules to check.";
    }

    // Change Password Endpoint (Job Unique Feature)
    @PostMapping("/api/change-password")
    public Map<String, String> changePassword(@RequestBody Map<String, String> data) {
        String username = data.get("username");
        String oldPassword = data.get("oldPassword");
        String newPassword = data.get("newPassword");

        Optional<User> foundUser = userRepository.findByUsername(username);
        Map<String, String> response = new HashMap<>();
        
        if (foundUser.isPresent() && foundUser.get().getPassword().equals(oldPassword)) {
            User userObj = foundUser.get();
            userObj.setPassword(newPassword);
            userRepository.save(userObj);
            response.put("status", "success");
            response.put("message", "✅ Password changed successfully!");
            return response;
        }

        response.put("status", "fail");
        response.put("message", "❌ Incorrect current password!");
        return response;
    }
}
