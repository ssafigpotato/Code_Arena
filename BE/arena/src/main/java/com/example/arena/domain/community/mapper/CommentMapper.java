package com.example.arena.domain.community.mapper;

import org.springframework.stereotype.Component;

import com.example.arena.domain.community.dto.request.CommentResponse;
import com.example.arena.domain.community.entity.Comment;

@Component
public class CommentMapper {
	public CommentResponse entityToReponse(Comment comment) {
		return new CommentResponse(comment.getId(), comment.getMemberId(), comment.getBoardId(), comment.getContent(),
				comment.getLikes(), comment.isSecret());
	}
}
