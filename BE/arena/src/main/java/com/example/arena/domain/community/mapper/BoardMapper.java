package com.example.arena.domain.community.mapper;

import org.springframework.stereotype.Component;

import com.example.arena.domain.community.dto.request.BoardRequest;
import com.example.arena.domain.community.entity.Board;

@Component
public class BoardMapper {
	public Board boardRequestToEntity(BoardRequest boardRequest) {
		return new Board(boardRequest.getMemberId(), boardRequest.getTitle(), boardRequest.getContent(),
				boardRequest.getType());
	}

}
