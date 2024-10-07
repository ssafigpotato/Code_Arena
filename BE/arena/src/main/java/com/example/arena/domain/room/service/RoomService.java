package com.example.arena.domain.room.service;

import com.example.arena.domain.member.entity.Member;
import com.example.arena.domain.member.service.MemberService;
import com.example.arena.domain.room.dto.request.*;
import com.example.arena.domain.room.dto.response.RoomDetailResponse;
import com.example.arena.domain.room.dto.response.RoomMemberResponse;
import com.example.arena.domain.room.dto.response.MakeRoomResponse;
import com.example.arena.domain.room.dto.response.RoomResponse;
import com.example.arena.domain.room.entity.*;
import com.example.arena.domain.room.mapper.RoomMapper;
import com.example.arena.domain.room.repository.RoomMemberRepository;
import com.example.arena.domain.room.repository.RoomRepository;
import com.example.arena.global.exception.ResourceNotFoundException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class RoomService {
    private final RoomRepository roomRepository;
    private final RoomMemberRepository roomMemberRepository;
    private final MemberService memberService;
    private final RoomMapper roomMapper;

    public RoomService(RoomRepository roomRepository, RoomMemberRepository roomMemberRepository, MemberService memberService, RoomMapper roomMapper) {
        this.roomRepository = roomRepository;
        this.roomMemberRepository = roomMemberRepository;
        this.memberService = memberService;
        this.roomMapper = roomMapper;
    }

    @Transactional
    public MakeRoomResponse makeRoom(MakeRoomRequest request) {
        Member tester = memberService.getMemberValue();
        Room room = roomMapper.toRoomEntity(request, tester.getId());
        RoomMember roomMember = new RoomMember(room,tester, InterviewerType.TESTER,RoomMemberStatus.ACCEPT,Boolean.FALSE);
        room.addMember(roomMember);
        roomRepository.save(room);
        return roomMapper.toMakeRoomResponse(room, roomMember);
    }

    @Transactional
    public RoomMemberResponse enterRoom(EnterRoomRequest request) {
        Room room = getRoomById(request.getRoomId());
        Member curMember = memberService.getMemberValue();

        if(room.getMembers().size() - 1 <= room.getMaxNum()) {
            RoomMember roomMember = new RoomMember(room,curMember,request.getType(),RoomMemberStatus.ACCEPT,Boolean.FALSE);
            room.addMember(roomMember);

            return roomMapper.toRoomMemberResponse(roomMember);
        }

        return new RoomMemberResponse(UUID.randomUUID(),room.getId(),curMember.getId(),curMember.getNickname(),request.getType(),RoomMemberStatus.FULL,room.getRoomLanguage(),room.getTestTime());
    }

    @Transactional
    public RoomDetailResponse leaveRoom(LeaveRoomRequest request) {
        Room room = getRoomById(request.getRoomId());
        Member member = memberService.searchMemberById(request.getUserId());
        RoomMember roomMember = getRoomMemberByMemberId(room, member);
        room.getMembers().remove(roomMember);
        return roomMapper.toRoomDetailResponse(room);
    }

    private RoomMember getRoomMemberByMemberId(Room room, Member member) {
        for(RoomMember roomMember : room.getMembers()) {
            if(roomMember.getMember().getId().equals(member.getId())) {
                return roomMember;
            }
        }

        throw new ResourceNotFoundException("No Room Member");
    }


    @Transactional
    public RoomDetailResponse inviteInterviewer(InviteInterviewerRequest request) {
        Room curRoom = getRoomById(request.getRoomId());
        Member interviewer = memberService.searchMemberById(request.getInterviewerId());
        RoomMemberStatus status = alreadyInRoom(curRoom,interviewer);

        if(status.equals(RoomMemberStatus.INVITE)) {
            RoomMember roomMember = new RoomMember(curRoom, interviewer, InterviewerType.INTERVIEWER,RoomMemberStatus.INVITE,Boolean.FALSE);
            curRoom.addMember(roomMember);
        }

        return roomMapper.toRoomDetailResponse(curRoom);
    }

    @Transactional
    public RoomMemberResponse acceptInviteInterviewer(AcceptInterviewerRequest request) {
        Room curRoom = getRoomById(request.getRoomId());
        Member interviewer = memberService.searchMemberById(request.getInterviewerId());
        RoomMember roomMember = roomMemberRepository.findByRoomAndMember(curRoom,interviewer).orElseThrow(EntityNotFoundException::new);
        roomMember.updateStatus(RoomMemberStatus.ACCEPT);

        return roomMapper.toRoomMemberResponse(roomMember);
    }


    private RoomMemberStatus alreadyInRoom(Room room, Member interviewer) {
        if(room.getMembers().size() >= 4)
            return RoomMemberStatus.FULL;

        for(RoomMember roomMember : room.getMembers()) {
            if(roomMember.getMember().getId().equals(interviewer.getId())) {
                return RoomMemberStatus.ALREADY;
            }
        }

        return RoomMemberStatus.INVITE;
    }

    public Room getRoomById(UUID id) {
        return roomRepository.findById(id).orElseThrow(EntityNotFoundException::new);
    }

    public List<RoomResponse> getAllRooms() {
        return roomRepository.findAll().stream().map(roomMapper::toRoomResponse).toList();
    }

    public RoomDetailResponse getRoomDetailById(UUID id) {
        return roomMapper.toRoomDetailResponse(getRoomById(id));
    }

    public void deleteRoomById(UUID id) {
        roomRepository.deleteById(id);
    }

    @Transactional
    public RoomDetailResponse startRoom(UUID roomId) {
        Room room = getRoomById(roomId);
        room.updateStartStatus(StartStatus.ON);

        return roomMapper.toRoomDetailResponse(room);
    }

    @Transactional
    public RoomDetailResponse endRoom(UUID roomId) {
        Room room = getRoomById(roomId);
        room.updateStartStatus(StartStatus.END);

        return roomMapper.toRoomDetailResponse(room);
    }


    @Transactional
    public void updateReady(UUID roomMemberId) {
        RoomMember roomMember = roomMemberRepository.findById(roomMemberId).orElseThrow(EntityNotFoundException::new);
        roomMember.updateReady();
    }

    @Transactional
    public Boolean canStart(UUID roomId) {
        Room room = getRoomById(roomId);

        for(RoomMember roomMember : room.getMembers()) {

            if(roomMember.getMember().getId().equals(room.getTesterId()))
                continue;

            if(!roomMember.getIsReady())
                return Boolean.FALSE;
        }

        return Boolean.TRUE;
    }
}
