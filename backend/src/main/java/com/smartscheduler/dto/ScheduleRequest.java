package com.smartscheduler.dto;

import jakarta.validation.constraints.NotBlank;

public class ScheduleRequest {
    @NotBlank(message = "Professor name is required")
    private String professorName;

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Day is required")
    private String day;

    @NotBlank(message = "Time is required")
    private String time;

    @NotBlank(message = "Group/Section name is required")
    private String groupName;

    private String roomNumber = "Room 101";

    public ScheduleRequest() {}

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
}
