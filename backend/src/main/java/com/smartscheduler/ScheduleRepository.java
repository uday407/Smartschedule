package com.smartscheduler;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    Optional<Schedule> findByProfessorNameAndDayAndTime(String professorName, String day, String time);
}
