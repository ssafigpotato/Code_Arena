package com.example.arena.domain.community.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.arena.domain.community.dto.request.CommentLikeRequest;
import com.example.arena.domain.community.dto.request.CommentRequest;
import com.example.arena.domain.community.dto.request.UpdateCommentRequest;
import com.example.arena.domain.community.dto.response.CommentResponse;
import com.example.arena.domain.community.dto.response.LikeCommentResponse;
import com.example.arena.domain.community.service.CommentService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/comment")
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
public class CommentController {
	@Autowired
	private CommentService commentService;

	@GetMapping("/{boardId}")
	public ResponseEntity<List<CommentResponse>> viewAllComments(@PathVariable(name = "boardId") UUID boardId) {
		return ResponseEntity.ok(commentService.getAllComments(boardId));
	}

	@PostMapping("")
	public ResponseEntity<CommentResponse> createComment(@RequestBody CommentRequest commentRequest) {
		return ResponseEntity.ok(commentService.createComment(commentRequest));
	}

	@PutMapping("")
	public ResponseEntity<CommentResponse> updateComment(@RequestBody UpdateCommentRequest request) {
		return ResponseEntity.ok(commentService.updateComment(request));
	}

	@DeleteMapping("/{commentId}")
	public ResponseEntity<Void> deleteComment(@PathVariable(name = "commentId") UUID commentId) {
		commentService.deleteComment(commentId);
		return ResponseEntity.ok().build();
	}

	@PutMapping("/like/{commentId}")
	public ResponseEntity<LikeCommentResponse> updateLikeComment(@RequestBody CommentLikeRequest request,
			@PathVariable(name = "commentId") UUID commentId) {
		return ResponseEntity.ok(commentService.updateLikeComment(request));
	}
}
