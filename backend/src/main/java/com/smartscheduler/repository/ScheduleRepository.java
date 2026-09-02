package com.smartscheduler.repository;

import com.smartscheduler.entity.Schedule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    List<Schedule> findByStatus(String status);
    List<Schedule> findByProfessorName(String professorName);
    List<Schedule> findByGroupName(String groupName);
    List<Schedule> findByRoomNumber(String roomNumber);

    Optional<Schedule> findByProfessorNameAndDayAndTime(String professorName, String day, String time);
    Optional<Schedule> findByRoomNumberAndDayAndTime(String roomNumber, String day, String time);
    Optional<Schedule> findByGroupNameAndDayAndTime(String groupName, String day, String time);

    @Query("SELECT s FROM Schedule s WHERE " +
           "(:prof IS NULL OR :prof = '' OR LOWER(s.professorName) LIKE LOWER(CONCAT('%', :prof, '%'))) AND " +
           "(:day IS NULL OR :day = '' OR LOWER(s.day) = LOWER(:day)) AND " +
           "(:status IS NULL OR :status = '' OR s.status = :status) AND " +
           "(:subject IS NULL OR :subject = '' OR LOWER(s.subject) LIKE LOWER(CONCAT('%', :subject, '%')))")
    Page<Schedule> searchSchedulesPaged(@Param("prof") String professor,
                                         @Param("day") String day,
                                         @Param("status") String status,
                                         @Param("subject") String subject,
                                         Pageable pageable);

    @Query("SELECT s FROM Schedule s WHERE s.professorName = :prof AND s.day = :day AND s.time = :time AND (:id IS NULL OR s.id != :id)")
    List<Schedule> findProfessorConflicts(@Param("prof") String professorName, @Param("day") String day, @Param("time") String time, @Param("id") Long excludeId);

    @Query("SELECT s FROM Schedule s WHERE s.roomNumber = :room AND s.day = :day AND s.time = :time AND (:id IS NULL OR s.id != :id)")
    List<Schedule> findRoomConflicts(@Param("room") String roomNumber, @Param("day") String day, @Param("time") String time, @Param("id") Long excludeId);

    @Query("SELECT s FROM Schedule s WHERE s.groupName = :group AND s.day = :day AND s.time = :time AND (:id IS NULL OR s.id != :id)")
    List<Schedule> findSectionConflicts(@Param("group") String groupName, @Param("day") String day, @Param("time") String time, @Param("id") Long excludeId);
}
