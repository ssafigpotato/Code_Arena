package com.example.arena.domain.room.controller;

import com.example.arena.domain.room.dto.request.*;
import com.example.arena.domain.room.dto.response.MakeRoomResponse;
import com.example.arena.domain.room.dto.response.RoomDetailResponse;
import com.example.arena.domain.room.dto.response.RoomMemberResponse;
import com.example.arena.domain.room.dto.response.RoomResponse;
import com.example.arena.domain.room.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/room")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping
    public ResponseEntity<MakeRoomResponse> makeRoom(@RequestBody MakeRoomRequest request) {
        return ResponseEntity.ok(roomService.makeRoom(request));
    }

    @PostMapping("/enter")
    public ResponseEntity<RoomMemberResponse> enterRoom(@RequestBody EnterRoomRequest request) {
        return ResponseEntity.ok(roomService.enterRoom(request));
    }

    @PostMapping("/invite")
    public ResponseEntity<RoomDetailResponse> inviteInterviewer(@RequestBody InviteInterviewerRequest request) {
        return ResponseEntity.ok(roomService.inviteInterviewer(request));
    }

    @PostMapping("/accept")
    public ResponseEntity<RoomMemberResponse> acceptInterviewer(@RequestBody AcceptInterviewerRequest request) {
        return ResponseEntity.ok(roomService.acceptInviteInterviewer(request));
    }

    @GetMapping
    public ResponseEntity<List<RoomResponse>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomDetailResponse> getRoomDetailById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(roomService.getRoomDetailById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoomById(@PathVariable("id") UUID id) {
        roomService.deleteRoomById(id);
        return ResponseEntity.noContent().build();
    }


    @PutMapping("/start/{id}")
    public ResponseEntity<RoomDetailResponse> startRoom(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(roomService.startRoom(id));
    }

    @PutMapping("/end/{id}")
    public ResponseEntity<RoomDetailResponse> endRoom(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(roomService.endRoom(id));
    }

    @PostMapping("/leave")
    public ResponseEntity<RoomDetailResponse> leaveRoom(@RequestBody LeaveRoomRequest request) {
        return ResponseEntity.ok(roomService.leaveRoom(request));
    }

    @PutMapping("/ready/{id}")
    public ResponseEntity<Void> readyRoom(@PathVariable("id") UUID roomMemberId) {
        roomService.updateReady(roomMemberId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/ready/{id}")
    public ResponseEntity<Boolean> isReady(@PathVariable("id") UUID roomId) {
        return ResponseEntity.ok(roomService.canStart(roomId));
    }
}
