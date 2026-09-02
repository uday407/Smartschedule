package com.smartscheduler.dto;

import java.util.List;

public class AIGenerateRequest {
    private List<String> subjects;
    private List<String> professors;
    private List<String> groups;
    private List<String> rooms;
    private List<String> days;
    private List<String> timeSlots;

    public AIGenerateRequest() {}

    public List<String> getSubjects() { return subjects; }
    public void setSubjects(List<String> subjects) { this.subjects = subjects; }

    public List<String> getProfessors() { return professors; }
    public void setProfessors(List<String> professors) { this.professors = professors; }

    public List<String> getGroups() { return groups; }
    public void setGroups(List<String> groups) { this.groups = groups; }

    public List<String> getRooms() { return rooms; }
    public void setRooms(List<String> rooms) { this.rooms = rooms; }

    public List<String> getDays() { return days; }
    public void setDays(List<String> days) { this.days = days; }

    public List<String> getTimeSlots() { return timeSlots; }
    public void setTimeSlots(List<String> timeSlots) { this.timeSlots = timeSlots; }
}
