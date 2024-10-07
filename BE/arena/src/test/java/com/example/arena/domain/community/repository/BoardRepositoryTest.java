package com.example.arena.domain.community.repository;

import java.util.List;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.example.arena.domain.community.entity.Board;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class BoardRepositoryTest {
	@Autowired
	private BoardRepository boardRepository;

//	@Test
//	public void BoardRepository_GetAll_ReturnMoreThanBoard() {
//		for (int i = 0; i < 5; i++) {
//			Board board = new Board();
//			board.update("제목" + i, "내용" + i);
//			boardRepository.save(board);
//		}
//
//		List<Board> boardList = boardRepository.findAll();
//
//		Assertions.assertThat(boardList).isNotNull();
//		Assertions.assertThat(boardList.size()).isEqualTo(5);
//	}
//
//	@Test
//	public void BoardRepository_FindById_ReturnBoard() {
//		Board board = new Board();
//		board.update("제목1", "내용1");
//		boardRepository.save(board);
//		Board boardList = boardRepository.findById(board.getId()).get();
//		Assertions.assertThat(boardList).isNotNull();
//	}
	
	
}
