package com.example.arena.domain.report.dto.response;

import com.example.arena.domain.code.dto.request.ProblemDto;
import com.example.arena.domain.report.entity.Report;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {
	private Report report;
	private ProblemDto problem;
	private String examples;
}
