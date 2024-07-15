package com.example.arena.domain.community.mapper;

import org.springframework.stereotype.Component;

import com.example.arena.domain.community.dto.response.LikeResponse;
import com.example.arena.domain.community.entity.BoardLike;

@Component
public class LikeMapper {

	public LikeResponse entityToResponse(BoardLike like, int likes) {
		return new LikeResponse(like.getBoardId(), like.getMemberId(), likes);
	}

}
