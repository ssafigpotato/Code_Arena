package com.example.arena.global.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.Getter;
import lombok.Setter;

@MappedSuperclass
@Getter
@Setter
public abstract class BaseEntity {
	@Column(updatable = false)
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private LocalDateTime deletedAt;

	@PrePersist
	protected void onCreate() {
		this.createdAt = LocalDateTime.now();
		this.updatedAt = LocalDateTime.now();
	}

	@PreUpdate
	protected void onUpdate() {
		this.updatedAt = LocalDateTime.now();

	}

	// entity 소프트 딜리트
	public void softDelete() {
		this.deletedAt = LocalDateTime.now();
	}

	// 해당 entity가 삭제되었는지 반환
	public boolean isDeleted() {
		return this.deletedAt != null;
	}

	// 소프트 딜리트를 때린 entity 다시 복원
	public void restore() {
		this.deletedAt = null;
	}
}
