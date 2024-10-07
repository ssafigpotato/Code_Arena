package com.example.arena.domain.report.entity;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.hibernate.annotations.SQLRestriction;

import com.example.arena.domain.code.entity.Language;
import com.example.arena.domain.member.entity.Member;
import com.example.arena.global.entity.BaseEntity;
import com.github.f4b6a3.ulid.UlidCreator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@SQLRestriction("deleted_at is null")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Report extends BaseEntity {
	@Id
	@Column(columnDefinition = "BINARY(16)")
	private UUID id = UlidCreator.getMonotonicUlid().toUuid();

	private UUID roomId;

	private UUID testerId;

	private String name;

	@Enumerated(EnumType.STRING)
	private Language language;

	@OneToMany(fetch = FetchType.LAZY)
	@JoinColumn(name = "review_id")
	private Set<Review> reviews; // 면접관들

	@OneToMany(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id")
	private Set<Member> members = new HashSet<>();

	private String code;

	public Report(UUID roomId, UUID testerId, Set<Review> reviews, String code) {
		this.roomId = roomId;
		this.testerId = testerId;
		this.reviews = reviews;
		this.code = code;
	}

}
