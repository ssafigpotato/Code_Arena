package com.example.arena.domain.report.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.example.arena.domain.code.dto.request.ProblemDto;
import com.example.arena.domain.code.entity.Code;
import com.example.arena.domain.member.entity.Member;
import com.example.arena.domain.report.dto.response.DetailReportResponse;
import com.example.arena.domain.report.dto.response.Interviewee;
import com.example.arena.domain.report.dto.response.ListReportResponse;
import com.example.arena.domain.report.entity.Report;
import com.example.arena.domain.room.entity.Room;

@Component
public class ReportMapper {

	public DetailReportResponse entityToReportResponse(Report report, ProblemDto problem, String examples,
			Member member, List<Interviewee> interviewees, int corrects) {
		String code = report.getCode();
		return new DetailReportResponse(report.getName(), report.getLanguage(), report.getCreatedAt(), problem,
				examples, member.getNickname(), member.getName(), member.getImage(), interviewees, code, corrects);
	}

	public ListReportResponse entityToListReportResponse(Report report, int corrects, double average) {
		return new ListReportResponse(report.getId(), report.getName(), report.getCreatedAt(), report.getLanguage(),
				corrects, average);
	}

}
