package com.example.arena.domain.community.dto.response;

import java.util.UUID;

import com.example.arena.domain.community.entity.Board;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Setter
public class DetailBoardResponse {
	private Board board;
	private String memberNickname;
	private long comments;
	private UUID memberId;
	// memberid
}
