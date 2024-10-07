package com.example.arena.domain.code.entity;

import java.util.UUID;

import com.example.arena.domain.member.entity.Member;
import com.github.f4b6a3.ulid.UlidCreator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Code {
	@Id
	@Column(columnDefinition = "BINARY(16)")
	private UUID id = UlidCreator.getMonotonicUlid().toUuid();

	private UUID roomId; // 미팅방 아이디
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id", nullable = false)
	private Member member; // 작성자 아이디
	private String problem; // 코드 문제
	@Enumerated(EnumType.STRING)
	private Language language; // 무슨 언어
	private String content; // 코드 내용

	public void setMember(Member curMember) {
		this.member = curMember;
	}

	public Code(UUID roomId, String problem, Language language, String content) {
		this.roomId = roomId;
		this.problem = problem;
		this.language = language;
		this.content = content;
	}

}
