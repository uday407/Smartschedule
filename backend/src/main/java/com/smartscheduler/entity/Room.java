package com.smartscheduler.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String roomNumber; // e.g. "Room 101", "Lab 2"

    private String building; // e.g. "CS Block"
    private Integer capacity; // e.g. 60
    private String roomType; // "LECTURE", "LAB", "SEMINAR"
    private Boolean isAvailable = true;

    public Room() {}

    public Room(String roomNumber, String building, Integer capacity, String roomType) {
        this.roomNumber = roomNumber;
        this.building = building;
        this.capacity = capacity;
        this.roomType = roomType;
        this.isAvailable = true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public String getBuilding() { return building; }
    public void setBuilding(String building) { this.building = building; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
}
