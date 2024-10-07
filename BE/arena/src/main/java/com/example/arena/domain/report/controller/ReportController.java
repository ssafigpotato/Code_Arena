package com.example.arena.domain.report.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.arena.domain.report.dto.request.ReportRequest;
import com.example.arena.domain.report.dto.request.ReviewRequest;
import com.example.arena.domain.report.dto.response.DetailReportResponse;
import com.example.arena.domain.report.dto.response.ListReportResponse;
import com.example.arena.domain.report.service.ReportService;

@RestController
@RequestMapping("/api/v1/report")
public class ReportController {
	@Autowired
	private ReportService reportService;

	@PutMapping("/review")
	public ResponseEntity<Void> updateReview(@RequestBody ReviewRequest request) {
		reportService.updateReview(request);
		return ResponseEntity.ok().build();
	}

	@GetMapping("/detail/{reportId}")
	public ResponseEntity<DetailReportResponse> getReportByRoomId(@PathVariable(name = "reportId") UUID reportId) {
		return ResponseEntity.ok(reportService.getReportByReportId(reportId));
	}

	@GetMapping("/list/{memberId}")
	public ResponseEntity<List<ListReportResponse>> getReportsByMemberId(
			@PathVariable(name = "memberId") UUID memberId) {
		return ResponseEntity.ok(reportService.getReportsByMemberId(memberId));
	}

	@PostMapping("")
	public ResponseEntity<Void> createReport(@RequestBody ReportRequest request) {
		reportService.createReport(request);
		return ResponseEntity.ok().build();
	}

}
