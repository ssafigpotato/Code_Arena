package com.example.arena.domain.report.entity;

import java.util.UUID;

import org.hibernate.annotations.SQLRestriction;

import com.example.arena.domain.member.entity.Member;
import com.github.f4b6a3.ulid.UlidCreator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
public class Review {
	public Review(int score, String title, String content) {
		this.score = score;
		this.title = title;
		this.content = content;
	}

	@Id
	@Column(columnDefinition = "BINARY(16)")
	private UUID id = UlidCreator.getMonotonicUlid().toUuid();

	private int score;
	private String title;
	private String content;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id")
	private Member member;

	public void setMember(Member curMember) {
		this.member = curMember;
	}

	public Review(Member member) {
		this.member = member;
	}

}
