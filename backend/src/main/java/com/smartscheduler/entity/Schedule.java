package com.smartscheduler.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "schedules", indexes = {
    @Index(name = "idx_schedule_prof", columnList = "professorName, schedule_day, time"),
    @Index(name = "idx_schedule_room", columnList = "roomNumber, schedule_day, time"),
    @Index(name = "idx_schedule_status", columnList = "status"),
    @Index(name = "idx_schedule_day_time", columnList = "schedule_day, time")
})
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String professorName;

    @Column(nullable = false)
    private String subject;

    @Column(name = "schedule_day", nullable = false)
    private String day; // "Monday", "Tuesday", etc.

    @Column(nullable = false)
    private String time; // "10:00 AM"

    private String groupName; // e.g. "Group A"
    private String roomNumber = "Room 101"; // e.g. "Room 204"

    // Timetable Approval Workflow: DRAFT, PENDING_APPROVAL, PUBLISHED, REJECTED
    @Column(nullable = false)
    private String status = "PUBLISHED"; 

    private String rejectionReason;
    private String createdBy;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Schedule() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProfessorName() { return professorName; }
    public void setProfessorName(String professorName) { this.professorName = professorName; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getDay() { return day; }
    public void setDay(String day) { this.day = day; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getGroupName() { return groupName; }
    public void setGroupName(String groupName) { this.groupName = groupName; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
