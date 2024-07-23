package com.example.arena.domain.community.dto.response;

import com.example.arena.domain.community.entity.Board;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Setter
public class BoardResponse {
	private Board board;
	private String memberNickName;
}
