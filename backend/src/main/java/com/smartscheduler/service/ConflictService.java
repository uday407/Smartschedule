package com.smartscheduler.service;

import com.smartscheduler.entity.Schedule;
import com.smartscheduler.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ConflictService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    public List<String> detectConflicts(Schedule schedule, Long excludeId) {
        List<String> conflicts = new ArrayList<>();

        // 1. Professor Conflict
        List<Schedule> profConflicts = scheduleRepository.findProfessorConflicts(
                schedule.getProfessorName(), schedule.getDay(), schedule.getTime(), excludeId);
        if (!profConflicts.isEmpty()) {
            conflicts.add("❌ PROFESSOR CLASH: " + schedule.getProfessorName() +
                    " already has class '" + profConflicts.get(0).getSubject() +
                    "' for " + profConflicts.get(0).getGroupName() +
                    " at " + schedule.getDay() + " " + schedule.getTime());
        }

        // 2. Room Conflict
        if (schedule.getRoomNumber() != null && !schedule.getRoomNumber().isEmpty()) {
            List<Schedule> roomConflicts = scheduleRepository.findRoomConflicts(
                    schedule.getRoomNumber(), schedule.getDay(), schedule.getTime(), excludeId);
            if (!roomConflicts.isEmpty()) {
                conflicts.add("❌ ROOM CLASH: " + schedule.getRoomNumber() +
                        " is already booked by " + roomConflicts.get(0).getProfessorName() +
                        " for '" + roomConflicts.get(0).getSubject() +
                        "' at " + schedule.getDay() + " " + schedule.getTime());
            }
        }

        // 3. Section/Group Conflict
        if (schedule.getGroupName() != null && !schedule.getGroupName().isEmpty()) {
            List<Schedule> groupConflicts = scheduleRepository.findSectionConflicts(
                    schedule.getGroupName(), schedule.getDay(), schedule.getTime(), excludeId);
            if (!groupConflicts.isEmpty()) {
                conflicts.add("❌ SECTION CLASH: " + schedule.getGroupName() +
                        " already has class '" + groupConflicts.get(0).getSubject() +
                        "' with " + groupConflicts.get(0).getProfessorName() +
                        " at " + schedule.getDay() + " " + schedule.getTime());
            }
        }

        return conflicts;
    }
}
