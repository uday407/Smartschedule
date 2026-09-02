package com.smartscheduler;

import com.smartscheduler.entity.Schedule;
import com.smartscheduler.entity.User;
import com.smartscheduler.repository.ScheduleRepository;
import com.smartscheduler.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner initDatabase(UserRepository userRepository, ScheduleRepository scheduleRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword("admin123");
                admin.setFullName("Head of Department");
                admin.setRole("HOD");
                userRepository.save(admin);

                User prof1 = new User();
                prof1.setUsername("uday");
                prof1.setPassword("123");
                prof1.setFullName("Dr. Uday Kumar");
                prof1.setRole("PROFESSOR");
                userRepository.save(prof1);

                User prof2 = new User();
                prof2.setUsername("sri");
                prof2.setPassword("123");
                prof2.setFullName("Prof. Srikanth");
                prof2.setRole("PROFESSOR");
                userRepository.save(prof2);

                System.out.println("✅ Auto Setup: Seeded admin (admin/admin123) and professors (uday/123, sri/123)!");
            }

            if (scheduleRepository.count() == 0) {
                createSchedule(scheduleRepository, "Dr. Uday Kumar", "Data Structures & Algorithms", "Monday", "09:00 AM", "Group A", "Room 101", "PUBLISHED");
                createSchedule(scheduleRepository, "Dr. Uday Kumar", "Database Management Systems", "Tuesday", "10:00 AM", "Group B", "Lab A", "PUBLISHED");
                createSchedule(scheduleRepository, "Prof. Srikanth", "Operating Systems", "Wednesday", "11:00 AM", "Group A", "Room 102", "PUBLISHED");
                createSchedule(scheduleRepository, "Prof. Srikanth", "Computer Networks", "Thursday", "02:00 PM", "Group C", "Lab B", "PUBLISHED");
                createSchedule(scheduleRepository, "Dr. Uday Kumar", "Artificial Intelligence", "Friday", "03:00 PM", "Group A", "Room 201", "PENDING_APPROVAL");
                createSchedule(scheduleRepository, "Prof. Srikanth", "Cloud Computing", "Friday", "09:00 AM", "Group B", "Room 101", "PENDING_APPROVAL");

                System.out.println("✅ Auto Setup: Seeded default initial timetable schedules!");
            }
        };
    }

    private void createSchedule(ScheduleRepository repo, String prof, String subject, String day, String time, String group, String room, String status) {
        Schedule s = new Schedule();
        s.setProfessorName(prof);
        s.setSubject(subject);
        s.setDay(day);
        s.setTime(time);
        s.setGroupName(group);
        s.setRoomNumber(room);
        s.setStatus(status);
        s.setCreatedBy("System Seeder");
        repo.save(s);
    }
}

