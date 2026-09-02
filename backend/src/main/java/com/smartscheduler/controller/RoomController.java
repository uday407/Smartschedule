package com.smartscheduler.controller;

import com.smartscheduler.dto.ApiResponse;
import com.smartscheduler.entity.Room;
import com.smartscheduler.repository.RoomRepository;
import com.smartscheduler.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private AuditService auditService;

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        List<Room> rooms = roomRepository.findAll();
        if (rooms.isEmpty()) {
            // Seed standard classroom & lab facilities if empty
            List<Room> seedRooms = Arrays.asList(
                    new Room("Room 101", "CS Building", 60, "LECTURE"),
                    new Room("Room 102", "CS Building", 60, "LECTURE"),
                    new Room("Room 201", "IT Building", 75, "LECTURE"),
                    new Room("Lab A", "CS Building", 35, "LAB"),
                    new Room("Lab B", "IT Building", 35, "LAB"),
                    new Room("Auditorium 1", "Main Block", 150, "SEMINAR")
            );
            rooms = roomRepository.saveAll(seedRooms);
        }
        return ResponseEntity.ok(rooms);
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createRoom(@RequestBody Room room) {
        Room saved = roomRepository.save(room);
        auditService.logAction("ADMIN", "CREATE_ROOM", "Room", saved.getId(), "Added room facility: " + saved.getRoomNumber());
        return ResponseEntity.ok(new ApiResponse(true, "Room added successfully!", saved));
    }
}
