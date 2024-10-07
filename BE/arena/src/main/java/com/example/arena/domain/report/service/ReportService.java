package com.example.arena.domain.report.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.arena.domain.code.dto.request.ProblemDto;
import com.example.arena.domain.code.entity.Code;
import com.example.arena.domain.code.repository.CodeRepository;
import com.example.arena.domain.member.entity.Member;
import com.example.arena.domain.member.repository.MemberRepository;
import com.example.arena.domain.member.service.MemberService;
import com.example.arena.domain.report.dto.request.ReportRequest;
import com.example.arena.domain.report.dto.request.ReviewRequest;
import com.example.arena.domain.report.dto.response.DetailReportResponse;
import com.example.arena.domain.report.dto.response.Interviewee;
import com.example.arena.domain.report.dto.response.ListReportResponse;
import com.example.arena.domain.report.entity.Report;
import com.example.arena.domain.report.entity.Review;
import com.example.arena.domain.report.mapper.ReportMapper;
import com.example.arena.domain.report.mapper.ReviewMapper;
import com.example.arena.domain.report.repository.ReportRepository;
import com.example.arena.domain.report.repository.ReviewRepository;
import com.example.arena.domain.room.entity.Room;
import com.example.arena.domain.room.entity.RoomMember;
import com.example.arena.domain.room.repository.RoomRepository;
import com.example.arena.global.exception.ResourceNotFoundException;

@Service
public class ReportService {

	@Autowired
	private MemberService memberService;

	@Autowired
	private ReviewMapper reviewMapper;

	@Autowired
	private ReportMapper reportMapper;

	@Autowired
	private ReviewRepository reviewRepository;

	@Autowired
	private ReportRepository reportRepository;

	@Autowired
	private RoomRepository roomRepository;

	@Autowired
	private MemberRepository memberRepository;

	@Autowired
	private RedisTemplate<String, Object> redisTemplate;

	private final String EXAMPLE_KEY = "examples:";

	private final String PROBLEM_KEY = "problem:";

	private final String TEST_CASE_CHECK_KEY = "testcasecheck:";

	private final String CODE_KEY = "code:";

	@Transactional
	public void updateReview(ReviewRequest request) {
		Review review = reviewMapper.reviewRequestToEntity(request);
		Member curMember = memberService.getMemberValue();
		review.setMember(curMember);
	}

	@Transactional
	public DetailReportResponse getReportByReportId(UUID reportId) {
		Report report = reportRepository.findById(reportId).orElse(null);
		Member curMember = memberRepository.findById(report.getTesterId()).orElse(null);
		ProblemDto problem = (ProblemDto) redisTemplate.opsForValue().get(PROBLEM_KEY + report.getRoomId().toString());
		String examples = (String) redisTemplate.opsForValue().get(EXAMPLE_KEY + report.getRoomId().toString());
		Set<Member> members = report.getMembers();
		List<Interviewee> interviewees = new ArrayList<>();
		for (Member member : members) {
			Review review = reviewRepository.findByMemberId(member.getId());
			Interviewee interviewee = new Interviewee(member.getNickname(), member.getName(), member.getImage(),
					review.getScore(), review.getTitle(), review.getContent());
			interviewees.add(interviewee);
		}
		int corrects = (int) redisTemplate.opsForValue().get(TEST_CASE_CHECK_KEY + report.getRoomId().toString());
		return reportMapper.entityToReportResponse(report, problem, examples, curMember, interviewees, corrects);
	}

	@Transactional
	public List<ListReportResponse> getReportsByMemberId(UUID memberId) {
		List<Report> reports = reportRepository.findByTesterId(memberId);

		return reports.stream().map(report -> {
			int corrects = (int) redisTemplate.opsForValue().get(TEST_CASE_CHECK_KEY + report.getRoomId().toString());
			double average = 0;
			for (Review review : report.getReviews()) {
				average += review.getScore();
			}
			average /= report.getReviews().size();
			return reportMapper.entityToListReportResponse(report, corrects, average);
		}).collect(Collectors.toList());
	}

	@Transactional
	public void createReport(ReportRequest request) {
		Room room = roomRepository.findById(request.getRoomId()).orElse(null);
		String code = (String) redisTemplate.opsForValue().get(CODE_KEY + request.getRoomId().toString());
		System.out.println("저장된 코드는 : " + code);
		Set<Review> reviews = new HashSet<>();
		for (RoomMember roomMember : room.getMembers()) {
			Member member = roomMember.getMember();
			Review review = new Review(member);
			System.out.println(review);
			reviewRepository.save(review);
			reviews.add(review);
		}
		Report report = new Report(request.getRoomId(), room.getTesterId(), reviews, code);
		reportRepository.save(report);
	}

}
