package com.example.arena.domain.community.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.arena.domain.community.dto.request.BoardLikeRequest;
import com.example.arena.domain.community.dto.request.PostBoardRequest;
import com.example.arena.domain.community.dto.request.SearchType;
import com.example.arena.domain.community.dto.request.UpdateBoardRequest;
import com.example.arena.domain.community.dto.response.BoardResponse;
import com.example.arena.domain.community.dto.response.DetailBoardResponse;
import com.example.arena.domain.community.dto.response.LikeResponse;
import com.example.arena.domain.community.dto.response.SearchBoardResponse;
import com.example.arena.domain.community.dto.response.UpdateBoardReponse;
import com.example.arena.domain.community.entity.Board;
import com.example.arena.domain.community.entity.BoardLike;
import com.example.arena.domain.community.entity.BoardType;
import com.example.arena.domain.community.mapper.BoardMapper;
import com.example.arena.domain.community.mapper.LikeMapper;
import com.example.arena.domain.community.repository.BoardLikeRepository;
import com.example.arena.domain.community.repository.BoardRepository;
import com.example.arena.domain.community.repository.CommentRepository;
import com.example.arena.domain.member.entity.Member;
import com.example.arena.domain.member.repository.MemberRepository;
import com.example.arena.domain.member.service.MemberService;
import com.example.arena.global.exception.ResourceNotFoundException;
import com.example.arena.global.exception.UnauthorizedException;

import jakarta.persistence.EntityNotFoundException;

@Service
public class BoardService {
	@Autowired
	private MemberService memberService;

	@Autowired
	private BoardRepository boardRepository;

	@Autowired
	private MemberRepository memberRepository;

	@Autowired
	private BoardLikeRepository likeRepository;

	@Autowired
	private CommentRepository commentRepository;

	@Autowired
	private BoardMapper boardMapper;

	@Autowired
	private LikeMapper likeMapper;

	@Autowired
	private RedisTemplate<String, Object> redisTemplate;

	private static final String LIKED_HLL_KEY_PREFIX = "post:likes:hll:";

	@Transactional
	public BoardResponse createBoard(PostBoardRequest request) {
		Board board = boardMapper.postBoardRequestToEntity(request);
		Member curMember = memberService.getMemberValue();
		board.setMember(curMember);
		boardRepository.save(board);
		return boardMapper.entityToBoardResponse(board, curMember);
	}

	@Transactional
	public void deleteBoard(UUID boardId) {
		Board board = boardRepository.findById(boardId).orElseThrow(EntityNotFoundException::new);
		board.softDelete();
	}

//	public List<BoardResponse> getAllBoards() {
//		List<Board> boards = boardRepository.findAll();
//		if (boards.isEmpty())
//			throw new ResourceNotFoundException("게시글이 없습니다.");
//		return boards.stream().map(board -> {
//			Member member = board.getMember();
//			return boardMapper.entityToBoardResponse(board, member);
//		}).collect(Collectors.toList());
//	}

	@Transactional
	public DetailBoardResponse getBoard(UUID boardId) {
		Board board = boardRepository.findById(boardId)
				.orElseThrow(() -> new ResourceNotFoundException("게시글이 존재하지 않습니다."));
		board.updateView();
		int likeCount = getLikeCount(boardId);
		board.update(likeCount);
		System.out.println(board);
		long count = commentRepository.countByBoardId(board.getId());
		return boardMapper.entityToDetailBoardResponse(board, board.getMember(), count);
	}

	@Transactional
	public UpdateBoardReponse updateBoard(UpdateBoardRequest request) {
		Board board = boardRepository.findById(request.getBoardId())
				.orElseThrow(() -> new ResourceNotFoundException("게시글이 존재하지 않습니다."));
		Member curMember = memberService.getMemberValue();
		if (!curMember.equals(board.getMember())) {
			throw new UnauthorizedException("게시글 작성자가 아닙니다.");
		}
		board.update(request.getTitle(), request.getContent());
		return boardMapper.entityToUpdateBoardResponse(board);
	}

	@Transactional
	public LikeResponse likeBoard(UUID boardId, UUID userId) {

		String redisKey = LIKED_HLL_KEY_PREFIX + boardId.toString();

		redisTemplate.opsForHyperLogLog().add(redisKey, userId.toString());

		int likeCount = getLikeCount(boardId);
		return new LikeResponse(boardId, userId, likeCount);
	}

	public int getLikeCount(UUID boardId) {
		long count = redisTemplate.opsForHyperLogLog().size(LIKED_HLL_KEY_PREFIX + boardId.toString());
		return (int) Math.min(count, Integer.MAX_VALUE);
	}

	// method 1
	// 좋아요가 이미 있으면 테이블 삭제 후 좋아요?
	// 좋아요가 없으면 테이블 생성 후 좋아요?
	// method 2
	// 좋아요 테이블이 존재하지않을때 좋아요버튼 -> 좋아요 테이블 생성후 좋아요 1로 설정
	// 좋아요 테이블이 존재하지만 좋아요가 0이면 -> 좋아요 테이블에서 좋아요을 1로 설정
	// 좋아요 테이블이 존재하는데 좋아요 1이면 -> 좋아요 테이블에서 좋아요를 0으로 설정
	@Transactional
	public LikeResponse updateLikeBoard(BoardLikeRequest request) {
		Optional<BoardLike> likeOptional = likeRepository.findByMemberIdAndBoardId(request.getMemberId(),
				request.getBoardId());
		BoardLike like;
		Board board;
		if (!likeOptional.isPresent()) {
			// 좋아요 테이블 생성 후 좋아요 1로 설정
			like = new BoardLike(request.getBoardId(), request.getMemberId(), true);
			likeRepository.save(like);
			board = boardRepository.findById(request.getBoardId())
					.orElseThrow(() -> new ResourceNotFoundException("1게시글이 존재하지 않습니다."));
			board.update(board.getLikes() + 1);
		} else {
			like = likeOptional.get();
			board = boardRepository.findById(request.getBoardId())
					.orElseThrow(() -> new ResourceNotFoundException("2게시글이 존재하지 않습니다."));
			if (like.isLiked()) {
				// 좋아요가 1이면 좋아요를 0으로 설정
				like.update(false);
				board.update(board.getLikes() - 1);
			} else {
				// 좋아요가 0이면 좋아요를 1로 설정
				like.update(true);
				board.update(board.getLikes() + 1);
			}
		}
		boardRepository.save(board);
		return likeMapper.entityToResponse(like, board.getLikes());
	}

	public List<SearchBoardResponse> searchByKeyword(SearchType searchType, String keyword) {
		List<Board> boards = new ArrayList<>();
		switch (searchType) {
		case WHOLE -> boards = boardRepository.findWHOLEByKeyword(keyword);
		case TITLE -> boards = boardRepository.findByTitleContainingOrderByCreatedAtDesc(keyword);
		case CONTENT -> boards = boardRepository.findByContentContainingOrderByCreatedAtDesc(keyword);
		case BOTH -> boards = boardRepository.findBOTHByKeyword(keyword);
		case WRITER -> {
			// 없으면 예외가 아닌 null을 반환
			Member member = memberRepository.findByNickname(keyword).orElse(null);
			if (member != null) {
				boards = boardRepository.findByMemberId(member.getId());
			}
		}
		}
		return boards.stream().map(board -> {
			long comments = commentRepository.countByBoardId(board.getId());
			return boardMapper.entityToSearchBoardResponse(board, comments);
		}).collect(Collectors.toList());
	}

	public List<DetailBoardResponse> getTypeBoards(String str) {
		BoardType boardType = null;
		switch (str) {
		case "groups" -> boardType = boardType.GROUPS;
		case "questions" -> boardType = boardType.QUESTIONS;
		case "feedbacks" -> boardType = boardType.FEEDBACKS;
		}
		List<Board> boards = boardRepository.findByBoardTypeOrderByCreatedAtDesc(boardType);
		return boards.stream().map(board -> {
			Member member = board.getMember();
			long count = commentRepository.countByBoardId(board.getId());
			return boardMapper.entityToDetailBoardResponse(board, member, count);
		}).collect(Collectors.toList());
	}

}
