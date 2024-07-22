package com.example.arena.domain.room.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.arena.domain.room.entity.Room;

public interface RoomRepository extends JpaRepository<Room, UUID>{

}
