package com.example.arena.domain.report.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import com.example.arena.domain.code.entity.Language;

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
	private Language language;
	private int corrects;
	private double average; // 면접관들 점수 평균
}
