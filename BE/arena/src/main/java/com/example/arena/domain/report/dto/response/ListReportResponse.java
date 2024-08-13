package com.example.arena.domain.report.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import com.example.arena.domain.room.entity.RoomLanguage;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ListReportResponse {
	private UUID reportId;
	private String title;
	private LocalDateTime startTime;
	private RoomLanguage language;
	private int corrects;
}
