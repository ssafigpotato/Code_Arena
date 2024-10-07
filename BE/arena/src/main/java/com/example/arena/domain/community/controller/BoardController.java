package com.example.arena.domain.community.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.arena.domain.community.dto.request.BoardLikeRequest;
import com.example.arena.domain.community.dto.request.PostBoardRequest;
import com.example.arena.domain.community.dto.request.SearchType;
import com.example.arena.domain.community.dto.request.UpdateBoardRequest;
import com.example.arena.domain.community.dto.response.BoardResponse;
import com.example.arena.domain.community.dto.response.DetailBoardResponse;
import com.example.arena.domain.community.dto.response.LikeResponse;
import com.example.arena.domain.community.dto.response.SearchBoardResponse;
import com.example.arena.domain.community.dto.response.UpdateBoardReponse;
import com.example.arena.domain.community.service.BoardService;

@RestController
@RequestMapping("/api/v1/board")
@CrossOrigin(origins = "http://localhost:3000")
public class BoardController {
	@Autowired
	private BoardService boardService;

	/**
	 * 게시글 등록
	 * 
	 * @param request 게시글 등록 요청 객체
	 * @return 등록된 게시글 응답 객체
	 */
	@PostMapping("")
	public ResponseEntity<BoardResponse> crateBoard(@RequestBody PostBoardRequest request) {
		return ResponseEntity.ok(boardService.createBoard(request));
	}

	/**
	 * 게시글 삭제
	 * 
	 * @param boardId 게시글 ID
	 * @return HTTP 상태 코드 204 No Content
	 */
	@DeleteMapping("/{boardId}")
	public ResponseEntity<Void> deleteBoard(@PathVariable(name = "boardId") UUID boardId) {
		boardService.deleteBoard(boardId);
		return ResponseEntity.noContent().build();
	}

	/**
	 * 게시글 리스트 조회
	 * 
	 * @return 모든 게시글의 리스트 응답 객체
	 */
	@GetMapping("/type/{boardType}")
	public ResponseEntity<List<DetailBoardResponse>> getBoardsByType(
			@PathVariable(name = "boardType") String boardType) {
		return ResponseEntity.ok(boardService.getTypeBoards(boardType));
	}

	/**
	 * 게시글 상세보기
	 * 
	 * @param boardId 게시글 ID
	 * @return 특정 게시글의 응답 객체
	 */
	@GetMapping("/{boardId}")
	public ResponseEntity<DetailBoardResponse> viewBoard(@PathVariable(name = "boardId") UUID boardId) {
		return ResponseEntity.ok(boardService.getBoard(boardId));
	}

	/**
	 * 게시글 수정
	 * 
	 * @param request 게시글 수정 요청 객체
	 * @return 수정된 게시글의 응답 객체
	 */
	@PutMapping("")
	public ResponseEntity<UpdateBoardReponse> updateBoard(@RequestBody UpdateBoardRequest request) {
		return ResponseEntity.ok(boardService.updateBoard(request));
	}

	@GetMapping("/liked/{boardId}")
	public ResponseEntity<?> getLikedFromBoard(@PathVariable(name = "boardId") UUID boardId) {
		return ResponseEntity.ok(boardService.getLikeCount(boardId));
	}

	/**
	 * 게시글 좋아요 업데이트 (좋아요가 된 상태면 좋아요 -1, 아니라면 +1) redis로 캐싱 전략 써보는 것 추천
	 * 
	 * @param request 좋아요 업데이트 요청 객체
	 * @return 좋아요 업데이트 응답 객체
	 */
//	@PutMapping("/like")
//	public ResponseEntity<LikeResponse> updateLikeBoard(@RequestBody BoardLikeRequest request) {
//		return ResponseEntity.ok(boardService.updateLikeBoard(request));
//	}

	@PutMapping("/like")
	public ResponseEntity<LikeResponse> updateBoardLiked(@RequestBody BoardLikeRequest request) {
		return ResponseEntity.ok(boardService.likeBoard(request.getBoardId(), request.getMemberId()));
	}

	/**
	 * Request : 검색 타입 / 키워드 Response : 제목 / 닉네임 / 작성일 / 추천 / 댓글 수
	 */
	@GetMapping("/search/{searchType}/{keyword}")
	public ResponseEntity<List<SearchBoardResponse>> searchByKeyword(
			@PathVariable(name = "searchType") SearchType searchType, @PathVariable(name = "keyword") String keyword) {
		return ResponseEntity.ok(boardService.searchByKeyword(searchType, keyword));
	}

}
