package com.example.arena.domain.room.entity;

import com.example.arena.domain.member.entity.Member;
import com.github.f4b6a3.ulid.UlidCreator;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Objects;
import java.util.UUID;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RoomMember {
    @Id
    @Column(columnDefinition = "BINARY(16)")
    private UUID id = UlidCreator.getMonotonicUlid().toUuid();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @Enumerated(EnumType.STRING)
    private InterviewerType interviewerType;

    @Enumerated(EnumType.STRING)
    private RoomMemberStatus status;

    private Boolean isReady;

    public RoomMember(Room room, Member member, InterviewerType interviewerType,RoomMemberStatus status, Boolean isReady) {
        this.room = room;
        this.member = member;
        this.interviewerType = interviewerType;
        this.status = status;
        this.isReady = isReady;
    }

    public void updateStatus(RoomMemberStatus status) {
        this.status = status;
    }

    public void updateReady() {
        this.isReady = !this.isReady;
    }

    @Override
    public int hashCode() {
        return Objects.hash(room.getId(), member.getId());
    }

    @Override
    public boolean equals(Object obj) {
        RoomMember other = (RoomMember) obj;
        return other.getMember().getId().equals(this.getMember().getId()) && other.getRoom().getId().equals(this.getRoom().getId());
    }
}
