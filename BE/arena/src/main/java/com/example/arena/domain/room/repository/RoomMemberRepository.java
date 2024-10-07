package com.example.arena.domain.room.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.arena.domain.member.entity.Member;
import com.example.arena.domain.room.entity.Room;
import com.example.arena.domain.room.entity.RoomMember;

public interface RoomMemberRepository extends JpaRepository<RoomMember, UUID> {
    @Query("SELECT rm FROM RoomMember rm WHERE rm.member = :member AND rm.room = :room")
    Optional<RoomMember> findByRoomAndMember(@Param("room") Room room, @Param("member") Member member);
}
