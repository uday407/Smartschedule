package com.smartscheduler;

import com.smartscheduler.entity.Schedule;
import com.smartscheduler.repository.ScheduleRepository;
import com.smartscheduler.service.ConflictService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ConflictServiceTest {

    @Mock
    private ScheduleRepository scheduleRepository;

    @InjectMocks
    private ConflictService conflictService;

    @Test
    public void testNoConflictsDetected() {
        Schedule s = new Schedule();
        s.setProfessorName("Dr. Uday Kumar");
        s.setDay("Monday");
        s.setTime("10:00 AM");
        s.setRoomNumber("Room 101");
        s.setGroupName("Group A");

        when(scheduleRepository.findProfessorConflicts(anyString(), anyString(), anyString(), any())).thenReturn(Collections.emptyList());
        when(scheduleRepository.findRoomConflicts(anyString(), anyString(), anyString(), any())).thenReturn(Collections.emptyList());
        when(scheduleRepository.findSectionConflicts(anyString(), anyString(), anyString(), any())).thenReturn(Collections.emptyList());

        List<String> conflicts = conflictService.detectConflicts(s, null);
        assertTrue(conflicts.isEmpty(), "Should have 0 conflicts for free slot");
    }

    @Test
    public void testProfessorConflictDetected() {
        Schedule s = new Schedule();
        s.setProfessorName("Dr. Uday Kumar");
        s.setSubject("Operating Systems");
        s.setDay("Monday");
        s.setTime("10:00 AM");
        s.setGroupName("Group B");

        Schedule existing = new Schedule();
        existing.setProfessorName("Dr. Uday Kumar");
        existing.setSubject("Java");
        existing.setGroupName("Group A");

        when(scheduleRepository.findProfessorConflicts(eq("Dr. Uday Kumar"), eq("Monday"), eq("10:00 AM"), any()))
                .thenReturn(List.of(existing));

        List<String> conflicts = conflictService.detectConflicts(s, null);
        assertFalse(conflicts.isEmpty(), "Should detect professor conflict");
        assertTrue(conflicts.get(0).contains("PROFESSOR CLASH"), "Conflict message should contain PROFESSOR CLASH");
    }
}
