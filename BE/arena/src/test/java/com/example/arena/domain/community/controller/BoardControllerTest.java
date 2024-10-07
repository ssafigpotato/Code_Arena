package com.example.arena.domain.community.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.example.arena.domain.community.dto.request.PostBoardRequest;
import com.example.arena.domain.community.dto.response.BoardResponse;
import com.example.arena.domain.community.entity.Board;
import com.example.arena.domain.community.service.BoardService;
import com.example.arena.domain.config.SecurityConfig;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(BoardController.class)
@Import(SecurityConfig.class)
class BoardControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@MockBean
	private BoardService boardService;

	@Autowired
	private WebApplicationContext context;

//	@BeforeEach
//	void setup() {
//		mockMvc = MockMvcBuilders.webAppContextSetup(context).apply(SecurityMockMvcConfigurers.springSecurity())
//				.build();
//	}
//
//	@Test
//	void testCreateBoard() throws Exception {
//		UUID memberId = UUID.randomUUID();
//		PostBoardRequest request = new PostBoardRequest(memberId, "Test Title", "Test Content", "General");
//
//		Board board = new Board(UUID.randomUUID(), memberId, "Test Title", "Test Content", "General", 0, 0);
//		BoardResponse response = new BoardResponse(board, "Test Nickname");
//
//		when(boardService.createBoard(any(PostBoardRequest.class))).thenReturn(response);
//
//		mockMvc.perform(post("/api/v1/board/").contentType(MediaType.APPLICATION_JSON)
//				.content(objectMapper.writeValueAsString(request))).andExpect(status().isOk())
//				.andExpect(content().json(objectMapper.writeValueAsString(response)));
//
//		Mockito.verify(boardService, Mockito.times(1)).createBoard(any(PostBoardRequest.class));
//	}
}
