package com.example.arena.domain.community.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.arena.domain.community.dto.request.CommentLikeRequest;
import com.example.arena.domain.community.dto.request.CommentRequest;
import com.example.arena.domain.community.dto.request.UpdateCommentRequest;
import com.example.arena.domain.community.dto.response.CommentResponse;
import com.example.arena.domain.community.dto.response.LikeCommentResponse;
import com.example.arena.domain.community.entity.Board;
import com.example.arena.domain.community.entity.Comment;
import com.example.arena.domain.community.entity.CommentLike;
import com.example.arena.domain.community.mapper.CommentMapper;
import com.example.arena.domain.community.repository.BoardRepository;
import com.example.arena.domain.community.repository.CommentLikeRepository;
import com.example.arena.domain.community.repository.CommentRepository;
import com.example.arena.domain.member.entity.Member;
import com.example.arena.domain.member.repository.MemberRepository;
import com.example.arena.global.exception.ResourceNotFoundException;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class CommentService {
	@Autowired
	private CommentRepository commentRepository;

	@Autowired
	private CommentLikeRepository commentLikeRepository;

	@Autowired
	private MemberRepository memberRepository;

	@Autowired
	private BoardRepository boardRepository;

	@Autowired
	private CommentMapper commentMapper;

	public List<CommentResponse> getAllComments(UUID boardId) {
		List<Comment> comments = commentRepository.findByBoardIdOrderByCreatedAtAsc(boardId);
		return comments.stream().map(comment -> {
			Member member = memberRepository.findById(comment.getMemberId())
					.orElseThrow(() -> new ResourceNotFoundException("멤버가 없습니다."));
			return commentMapper.entityToReponse(comment, member);
		}).collect(Collectors.toList());
	}

	@Transactional
	public CommentResponse createComment(CommentRequest request) {
		Board board = boardRepository.findById(request.getBoardId()).orElseThrow(EntityNotFoundException::new);
		Comment comment = commentRepository.save(commentMapper.requestToEntity(request, board));
		Member member = memberRepository.findById(request.getMemberId())
				.orElseThrow(() -> new ResourceNotFoundException("멤버가 없습니다."));
		return commentMapper.entityToReponse(comment, member);
	}

	@Transactional
	public CommentResponse updateComment(UpdateCommentRequest request) {
		Comment comment = commentRepository.findById(request.getCommentId())
				.orElseThrow(() -> new ResourceNotFoundException("댓글이 존재하지 않습니다."));
		comment.update(request.getContent(), request.isSecret());
		Member member = memberRepository.findById(request.getMemberId())
				.orElseThrow(() -> new ResourceNotFoundException("멤버가 없습니다."));
		return commentMapper.entityToReponse(comment, member); // 매퍼로 뭘로 바꾸면 좋을지 생각해볼것
	}

	public void deleteComment(UUID commentId) {
		Comment comment = commentRepository.findById(commentId).orElseThrow(EntityNotFoundException::new);
		comment.softDelete();
	}

	public LikeCommentResponse updateLikeComment(CommentLikeRequest request) {
		Optional<CommentLike> likeOptional = commentLikeRepository.findByCommentIdAndBoardId(request.getCommentId(),
				request.getBoardId());
		CommentLike commentLike;
		Comment comment;
		if (!likeOptional.isPresent()) {
			// 좋아요 테이블 생성 후 좋아요 1로 설정
			commentLike = new CommentLike(request.getCommentId(),request.getBoardId(), request.getMemberId(), true);
			commentLikeRepository.save(commentLike);
			comment = commentRepository.findById(request.getCommentId())
					.orElseThrow(() -> new ResourceNotFoundException("댓글이 존재하지 않습니다."));
			comment.update(comment.getLikes() + 1);
			commentRepository.save(comment);
		} else {
			commentLike = likeOptional.get();
			comment = commentRepository.findById(request.getCommentId())
					.orElseThrow(() -> new ResourceNotFoundException("댓글이 존재하지 않습니다."));
			if (commentLike.isLiked()) {
				// 좋아요가 1이면 좋아요를 0으로 설정
				commentLike.update(false);
				comment.update(comment.getLikes() - 1);
			} else {
				// 좋아요가 0이면 좋아요를 1로 설정
				commentLike.update(true);
				comment.update(comment.getLikes() + 1);
			}
			commentRepository.save(comment);
		}
		return commentMapper.entityToResponse(commentLike, comment.getLikes());
	}

}
