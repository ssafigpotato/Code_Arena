package com.example.arena.domain.community.entity;

import java.util.UUID;

import org.hibernate.annotations.SQLRestriction;

import com.example.arena.domain.member.entity.Member;
import com.example.arena.global.entity.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.github.f4b6a3.ulid.UlidCreator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@SQLRestriction("deleted_at is null")
public class Board extends BaseEntity {
	@Id
	@Column(columnDefinition = "BINARY(16)")
	private UUID id = UlidCreator.getMonotonicUlid().toUuid();
	private String title;
	private String content;
	@Enumerated(EnumType.STRING)
	private BoardType boardType;
	@Column(columnDefinition = "int default 0")
	private int views;
	@Column(columnDefinition = "int default 0")
	private int likes;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id", nullable = false)
	private Member member;

	public Board(Member member, String title, String content, BoardType boardType) {
		this.member = member;
		this.title = title;
		this.content = content;
		this.boardType = boardType;
	}

	public void update(String title, String content) {
		this.title = title;
		this.content = content;
	}

	public void update(int likes) {
		this.likes = likes;
	}

	public void updateView() {
		this.views++;
	}

	public void setMember(Member curMember) {
		this.member = curMember;
	}

	public Board(String title, String content, BoardType boardType) {
		this.title = title;
		this.content = content;
		this.boardType = boardType;
	}
}
