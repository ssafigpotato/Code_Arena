package com.example.arena.domain.community.mapper;

import org.springframework.stereotype.Component;

import com.example.arena.domain.community.dto.request.CommentRequest;
import com.example.arena.domain.community.dto.response.CommentResponse;
import com.example.arena.domain.community.dto.response.LikeCommentResponse;
import com.example.arena.domain.community.entity.Board;
import com.example.arena.domain.community.entity.Comment;
import com.example.arena.domain.community.entity.CommentLike;
import com.example.arena.domain.member.entity.Member;

@Component
public class CommentMapper {
	public CommentResponse entityToReponse(Comment comment, Member member) {
		return new CommentResponse(comment.getId(), comment.getContent(), comment.getLikes(), comment.isSecret(),
				member.getNickname(), comment.getCreatedAt(),member.getId());
	}

	public Comment requestToEntity(CommentRequest commentRequest, Board board) {
		return new Comment(commentRequest.getMemberId(), board, commentRequest.getContent(), commentRequest.isSecret());
	}

	public LikeCommentResponse entityToResponse(CommentLike commentLike, int likes) {
		return new LikeCommentResponse(commentLike.getCommentId(), commentLike.getMemberId(), commentLike.getBoardId(),
				likes);
	}
}
