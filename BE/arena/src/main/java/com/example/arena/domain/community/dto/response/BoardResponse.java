package com.example.arena.domain.community.dto.response;

import com.example.arena.domain.community.entity.Board;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BoardResponse {
	private Board board;
	private String memberNickName;
}
