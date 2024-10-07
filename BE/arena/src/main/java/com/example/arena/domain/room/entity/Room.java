package com.example.arena.domain.room.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import com.example.arena.domain.group.entity.GroupMember;
import com.github.f4b6a3.ulid.UlidCreator;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Room {
	@Id
	@Column(columnDefinition = "BINARY(16)")
	private UUID id = UlidCreator.getMonotonicUlid().toUuid();

	private String name;

	@Enumerated(EnumType.STRING)
	private RoomStatus status;

	private String password;

	private UUID testerId;

	@Enumerated(EnumType.STRING)
	private RoomLanguage roomLanguage;

	private Integer testTime;

	private Integer maxNum;

	private Integer curNum;

	private StartStatus startStatus;

	private LocalDateTime startTime;

	public Room(String name, RoomStatus status, String password, UUID testerId, RoomLanguage roomLanguage, Integer testTime, Integer maxNum, StartStatus startStatus) {
		this.name = name;
		this.status = status;
		this.password = password;
		this.testerId = testerId;
		this.roomLanguage = roomLanguage;
		this.testTime = testTime;
		this.maxNum = maxNum;
		this.curNum = 1;
		this.startStatus = startStatus;
		this.startTime = LocalDateTime.now();
	}

	public void updateStartStatus(StartStatus startStatus) {
		this.startStatus = startStatus;

		if(this.startStatus.equals(StartStatus.ON)) {
			this.startTime = LocalDateTime.now();
		}
	}

	@OneToMany(
			mappedBy = "room",
			cascade = {CascadeType.PERSIST,CascadeType.MERGE,CascadeType.REMOVE},
			orphanRemoval = true
	)
	private Set<RoomMember> members = new HashSet<>();

	public void addMember(RoomMember member) {
		this.members.add(member);
	}
}
