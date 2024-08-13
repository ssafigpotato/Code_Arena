package com.example.arena.domain.report.mapper;

import org.springframework.stereotype.Component;

import com.example.arena.domain.code.dto.request.ProblemDto;
import com.example.arena.domain.report.dto.response.ReportResponse;
import com.example.arena.domain.report.entity.Report;

@Component
public class ReportMapper {

	public ReportResponse entityToReportResponse(Report report, ProblemDto problem, String examples) {
		return new ReportResponse(report,problem,examples);
	}
	
}
