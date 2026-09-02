package com.smartscheduler;

import com.smartscheduler.entity.Schedule;
import com.smartscheduler.exception.ConflictException;
import com.smartscheduler.exception.ResourceNotFoundException;
import com.smartscheduler.repository.ScheduleRepository;
import com.smartscheduler.service.AuditService;
import com.smartscheduler.service.ConflictService;
import com.smartscheduler.service.EmailService;
import com.smartscheduler.service.NotificationService;
import com.smartscheduler.service.ScheduleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ScheduleServiceTest {

    @Mock
    private ScheduleRepository scheduleRepository;

    @Mock
    private ConflictService conflictService;

    @Mock
    private AuditService auditService;

    @Mock
    private NotificationService notificationService;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private ScheduleService scheduleService;

    private Schedule sampleSchedule;

    @BeforeEach
    public void setUp() {
        sampleSchedule = new Schedule();
        sampleSchedule.setId(1L);
        sampleSchedule.setProfessorName("Dr. Uday Kumar");
        sampleSchedule.setSubject("Database Systems");
        sampleSchedule.setDay("Tuesday");
        sampleSchedule.setTime("11:00 AM");
        sampleSchedule.setRoomNumber("Lab 2");
        sampleSchedule.setGroupName("Group CS-A");
        sampleSchedule.setStatus("PUBLISHED");
    }

    @Test
    public void testGetAllSchedules() {
        when(scheduleRepository.findAll()).thenReturn(List.of(sampleSchedule));
        List<Schedule> list = scheduleService.getAllSchedules();
        assertEquals(1, list.size());
        assertEquals("Database Systems", list.get(0).getSubject());
    }

    @Test
    public void testCreateScheduleHodRoleSuccess() {
        when(conflictService.detectConflicts(any(Schedule.class), any())).thenReturn(Collections.emptyList());
        when(scheduleRepository.save(any(Schedule.class))).thenReturn(sampleSchedule);

        Schedule created = scheduleService.createSchedule(sampleSchedule, "admin", "HOD");
        assertNotNull(created);
        assertEquals("PUBLISHED", created.getStatus());
        verify(scheduleRepository, times(1)).save(sampleSchedule);
        verify(auditService, times(1)).logAction(eq("admin"), eq("CREATE_SCHEDULE"), eq("Schedule"), eq(1L), anyString());
        verify(emailService, times(1)).sendScheduleNotification(anyString(), anyString(), anyString());
    }

    @Test
    public void testCreateScheduleThrowsConflict() {
        when(conflictService.detectConflicts(any(Schedule.class), any()))
                .thenReturn(List.of("PROFESSOR CLASH: Dr. Uday Kumar is busy at Tuesday 11:00 AM"));

        assertThrows(ConflictException.class, () -> scheduleService.createSchedule(sampleSchedule, "admin", "HOD"));
        verify(scheduleRepository, never()).save(any());
    }

    @Test
    public void testUpdateScheduleStatusSuccess() {
        when(scheduleRepository.findById(1L)).thenReturn(Optional.of(sampleSchedule));
        when(scheduleRepository.save(any(Schedule.class))).thenReturn(sampleSchedule);

        Schedule updated = scheduleService.updateScheduleStatus(1L, "APPROVED", "Looks good", "admin");
        assertNotNull(updated);
        assertEquals("APPROVED", updated.getStatus());
        verify(auditService, times(1)).logAction(eq("admin"), eq("APPROVED_SCHEDULE"), eq("Schedule"), eq(1L), anyString());
        verify(emailService, times(1)).sendScheduleNotification(anyString(), anyString(), anyString());
    }

    @Test
    public void testDeleteScheduleSuccess() {
        when(scheduleRepository.findById(1L)).thenReturn(Optional.of(sampleSchedule));
        doNothing().when(scheduleRepository).deleteById(1L);

        scheduleService.deleteSchedule(1L, "admin");
        verify(scheduleRepository, times(1)).deleteById(1L);
        verify(auditService, times(1)).logAction(eq("admin"), eq("DELETE_SCHEDULE"), eq("Schedule"), eq(1L), anyString());
    }

    @Test
    public void testDeleteScheduleNotFoundThrowsException() {
        when(scheduleRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> scheduleService.deleteSchedule(99L, "admin"));
    }
}
