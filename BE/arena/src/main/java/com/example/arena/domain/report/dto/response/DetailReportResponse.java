package com.example.arena.domain.report.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.example.arena.domain.code.dto.request.ProblemDto;
import com.example.arena.domain.code.entity.Language;
import com.example.arena.domain.room.entity.RoomLanguage;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class DetailReportResponse {
	private String roomName; // room.name
	private Language language; //code.language
	private LocalDateTime testDate; // createdAt
	private ProblemDto problem;
	private String examples;
	private String nickname; // member.nickname
	private String interviewerName; // member.name
	private String image; // member.image
	private List<Interviewee> interviewees; //
	private String codeContent; // code.content
	private int corrects;
}
