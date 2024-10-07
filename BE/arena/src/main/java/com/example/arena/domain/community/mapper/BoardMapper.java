package com.example.arena.domain.community.mapper;

import org.springframework.stereotype.Component;

import com.example.arena.domain.community.dto.request.PostBoardRequest;
import com.example.arena.domain.community.dto.response.BoardResponse;
import com.example.arena.domain.community.dto.response.DetailBoardResponse;
import com.example.arena.domain.community.dto.response.PostBoardResponse;
import com.example.arena.domain.community.dto.response.SearchBoardResponse;
import com.example.arena.domain.community.dto.response.UpdateBoardReponse;
import com.example.arena.domain.community.entity.Board;
import com.example.arena.domain.member.entity.Member;

@Component
public class BoardMapper {
	public Board postBoardRequestToEntity(PostBoardRequest boardRequest) {
		return new Board(boardRequest.getTitle(), boardRequest.getContent(), boardRequest.getType());
	}

//	public List<BoardResponse> entityToBoardReponseList(List<Board> boards, String memberNickName) {
//		return boards.stream().map(board -> entityToBoardResponse(board, memberNickName)).collect(Collectors.toList());
//	}

	public BoardResponse entityToBoardResponse(Board board, Member member) {
		return new BoardResponse(new Board(board.getId(), board.getTitle(), board.getContent(), board.getBoardType(),
				board.getViews(), board.getLikes(), member), member.getNickname());
	}

	public UpdateBoardReponse entityToUpdateBoardResponse(Board board) {
		return new UpdateBoardReponse(board.getId(), board.getTitle(), board.getContent());
	}

	public PostBoardResponse entityToPostBoardResponse(Board board) {
		return new PostBoardResponse(board.getId(), board.getTitle(), board.getContent(), board.getBoardType());
	}

	public SearchBoardResponse entityToSearchBoardResponse(Board board, long comments) {
		return new SearchBoardResponse(board.getId(), board.getTitle(), board.getMember().getNickname(), comments,
				board.getLikes(), board.getViews(), board.getContent(), board.getMember().getImage(),
				board.getCreatedAt(), board.getBoardType());
	}

	public DetailBoardResponse entityToDetailBoardResponse(Board board, Member member, long count) {
		return new DetailBoardResponse(board, member.getNickname(), count, member.getId());
	}
}
