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
            if (!userRepository.existsByUsername("admin")) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword("admin123");
                admin.setFullName("Head of Department (CS)");
                admin.setRole("HOD");
                admin.setDepartment("Computer Science");
                admin.setEmailVerified(true);
                userRepository.save(admin);
            }

            if (!userRepository.existsByUsername("uday")) {
                User uday = new User();
                uday.setUsername("uday");
                uday.setPassword("123");
                uday.setFullName("Dr. Uday Kumar");
                uday.setRole("PROFESSOR");
                uday.setDepartment("Computer Science");
                uday.setEmailVerified(true);
                userRepository.save(uday);
            }

            if (!userRepository.existsByUsername("n.udaykumar2005@gmail.com")) {
                User prof1 = new User();
                prof1.setUsername("n.udaykumar2005@gmail.com");
                prof1.setPassword("123");
                prof1.setFullName("Dr. Uday Kumar");
                prof1.setRole("PROFESSOR");
                prof1.setDepartment("Computer Science");
                prof1.setEmailVerified(true);
                userRepository.save(prof1);
            }

            if (!userRepository.existsByUsername("srikanth.prof@university.edu")) {
                User prof2 = new User();
                prof2.setUsername("srikanth.prof@university.edu");
                prof2.setPassword("123");
                prof2.setFullName("Prof. Srikanth");
                prof2.setRole("PROFESSOR");
                prof2.setDepartment("Computer Science");
                prof2.setEmailVerified(true);
                userRepository.save(prof2);
            }

            if (!userRepository.existsByUsername("anitha.sharma@university.edu")) {
                User prof3 = new User();
                prof3.setUsername("anitha.sharma@university.edu");
                prof3.setPassword("123");
                prof3.setFullName("Dr. Anitha Sharma");
                prof3.setRole("PROFESSOR");
                prof3.setDepartment("Information Technology");
                prof3.setEmailVerified(true);
                userRepository.save(prof3);
            }

            if (!userRepository.existsByUsername("rajesh.verma@university.edu")) {
                User prof4 = new User();
                prof4.setUsername("rajesh.verma@university.edu");
                prof4.setPassword("123");
                prof4.setFullName("Dr. Rajesh Verma");
                prof4.setRole("PROFESSOR");
                prof4.setDepartment("Artificial Intelligence");
                prof4.setEmailVerified(true);
                userRepository.save(prof4);
            }

            System.out.println("✅ Auto Setup: Seeded default accounts (admin/admin123, uday/123, n.udaykumar2005@gmail.com/123)!");

            if (scheduleRepository.count() <= 6) {
                scheduleRepository.deleteAll();

                createSchedule(scheduleRepository, "Dr. Uday Kumar", "n.udaykumar2005@gmail.com", "Data Structures & Algorithms", "Monday", "09:00 AM", "Group A", "Room 101", "PUBLISHED");
                createSchedule(scheduleRepository, "Dr. Uday Kumar", "n.udaykumar2005@gmail.com", "Database Management Systems", "Tuesday", "10:00 AM", "Group B", "Lab A", "PUBLISHED");
                createSchedule(scheduleRepository, "Prof. Srikanth", "srikanth.prof@university.edu", "Operating Systems", "Wednesday", "11:00 AM", "Group A", "Room 102", "PUBLISHED");
                createSchedule(scheduleRepository, "Prof. Srikanth", "srikanth.prof@university.edu", "Computer Networks & Security", "Thursday", "02:00 PM", "Group C", "Lab B", "PUBLISHED");
                createSchedule(scheduleRepository, "Dr. Anitha Sharma", "anitha.sharma@university.edu", "Advanced Machine Learning", "Monday", "11:00 AM", "Group B", "Room 201", "PUBLISHED");
                createSchedule(scheduleRepository, "Dr. Anitha Sharma", "anitha.sharma@university.edu", "Deep Learning & Neural Nets", "Wednesday", "09:00 AM", "Group C", "Lab A", "PUBLISHED");
                createSchedule(scheduleRepository, "Dr. Rajesh Verma", "rajesh.verma@university.edu", "Web Architecture & Microservices", "Tuesday", "02:00 PM", "Group A", "Room 101", "PUBLISHED");
                createSchedule(scheduleRepository, "Dr. Rajesh Verma", "rajesh.verma@university.edu", "Cloud Computing & DevOps", "Thursday", "10:00 AM", "Group B", "Room 102", "PUBLISHED");
                createSchedule(scheduleRepository, "Dr. Uday Kumar", "n.udaykumar2005@gmail.com", "Artificial Intelligence Capstone", "Friday", "03:00 PM", "Group A", "Room 201", "PENDING_APPROVAL");
                createSchedule(scheduleRepository, "Prof. Srikanth", "srikanth.prof@university.edu", "Distributed Systems Lab", "Friday", "09:00 AM", "Group B", "Lab B", "PENDING_APPROVAL");

                System.out.println("✅ Auto Setup: Seeded rich mock timetable dataset (10 class schedules)!");
            }
        };
    }

    private void createSchedule(ScheduleRepository repo, String prof, String email, String subject, String day, String time, String group, String room, String status) {
        Schedule s = new Schedule();
        s.setProfessorName(prof);
        s.setProfessorEmail(email);
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

