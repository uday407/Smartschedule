package com.smartscheduler;

import com.smartscheduler.entity.User;
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
    public CommandLineRunner initDatabase(UserRepository userRepository) {
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
        };
    }
}

