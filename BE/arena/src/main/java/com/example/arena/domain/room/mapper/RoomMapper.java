package com.example.arena.domain.room.mapper;

import com.example.arena.domain.room.dto.request.MakeRoomRequest;
import com.example.arena.domain.room.dto.response.MakeRoomResponse;
import com.example.arena.domain.room.dto.response.RoomDetailResponse;
import com.example.arena.domain.room.dto.response.RoomMemberResponse;
import com.example.arena.domain.room.dto.response.RoomResponse;
import com.example.arena.domain.room.entity.Room;
import com.example.arena.domain.room.entity.RoomMember;
import com.example.arena.domain.room.entity.RoomStatus;
import com.example.arena.domain.room.entity.StartStatus;
import com.example.arena.global.exception.ResourceNotFoundException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
public class RoomMapper {
    public Room toRoomEntity(MakeRoomRequest request, UUID testerId) {
        return new Room(
                request.getRoomName(),
                request.getRoomStatus(),
                request.getPassword(),
                testerId,
                request.getRoomLanguage(),
                request.getTestTime(),
                request.getMaxNum(),
                StartStatus.OFF
        );
    }

    public MakeRoomResponse toMakeRoomResponse(Room room, RoomMember tester) {
        return new MakeRoomResponse(
                room.getId(),
                room.getName(),
                room.getPassword(),
                toRoomMemberResponse(tester),
                room.getStatus(),
                room.getRoomLanguage(),
                room.getTestTime(),
                room.getMaxNum(),
                room.getMembers().size(),
                room.getStartStatus()
        );
    }

    public RoomDetailResponse toRoomDetailResponse(Room room) {
        return new RoomDetailResponse(
                room.getId(),
                room.getName(),
                room.getPassword(),
                room.getStatus(),
                room.getRoomLanguage(),
                room.getTestTime(),
                room.getMaxNum(),
                room.getMembers().size(),
                room.getStartStatus(),
                toTesterResponse(room),
                room.getStartTime(),
                toRoomMembersResponse(room)
        );
    }

    public RoomResponse toRoomResponse(Room room) {
        return new RoomResponse(
                room.getId(),
                room.getName(),
                room.getPassword(),
                room.getStatus(),
                room.getRoomLanguage(),
                room.getTestTime(),
                room.getMaxNum(),
                room.getMembers().size(),
                room.getStartStatus(),
                toTesterResponse(room),
                room.getStartTime()
        );
    }

    public List<RoomMemberResponse> toRoomMembersResponse(Room room) {
        List<RoomMemberResponse> roomMembers = new ArrayList<>();

        for(RoomMember roomMember : room.getMembers()) {
            roomMembers.add(toRoomMemberResponse(roomMember));
        }

        return roomMembers;
    }

    public RoomMemberResponse toRoomMemberResponse(RoomMember roomMember) {
        return new RoomMemberResponse(
                roomMember.getId(),
                roomMember.getRoom().getId(),
                roomMember.getMember().getId(),
                roomMember.getMember().getNickname(),
                roomMember.getInterviewerType(),
                roomMember.getStatus(),
                roomMember.getRoom().getRoomLanguage(),
                roomMember.getRoom().getTestTime()
        );
    }

    public RoomMemberResponse toTesterResponse(Room room) {
        for(RoomMember roomMember : room.getMembers()) {
            if(roomMember.getMember().getId().equals(room.getTesterId())) {
                return toRoomMemberResponse(roomMember);
            }
        }

        throw new ResourceNotFoundException("No Tester");
    }
}
