package com.example.arena.domain.community.service;

import static org.mockito.Mockito.when;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.arena.domain.community.dto.request.PostBoardRequest;
import com.example.arena.domain.community.dto.response.BoardResponse;
import com.example.arena.domain.community.entity.Board;
import com.example.arena.domain.community.mapper.BoardMapper;
import com.example.arena.domain.community.repository.BoardRepository;
import com.example.arena.domain.member.entity.Member;
import com.example.arena.domain.member.entity.Role;
import com.example.arena.domain.member.repository.MemberRepository;

@ExtendWith(MockitoExtension.class)
public class BoardServiceTest {
	@Mock
	private BoardRepository boardRepository;

	@Mock
	private MemberRepository memberRepository;

	@Mock
	private BoardMapper boardMapper;

	@InjectMocks
	private BoardService boardService;

//	@Test
//	public void BoardService_CreateBoard_ReturnBoardDto() {
//		UUID memberId = UUID.randomUUID();
//		Board board = new Board(memberId, "제목1", "내용1", "타입1");
//		PostBoardRequest boardDto = new PostBoardRequest(memberId, "제목1", "내용1", "타입1");
//		when(boardMapper.postBoardRequestToEntity(boardDto)).thenReturn(board);
//		when(boardRepository.save(Mockito.any(Board.class))).thenReturn(board);
//		when(memberRepository.findById(memberId)).thenReturn(Optional.of(new Member("별명1","비번1","이름1","별명1",new Date(),Role.ROLE_ADMIN,"이미지1")));
//		BoardResponse savedBoard = boardService.createBoard(boardDto);
//		Assertions.assertThat(savedBoard);
//	}
}
