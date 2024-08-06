package com.example.arena.domain.community.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
//Request : 검색 타입 / 키워드
public class SearchBoardRequest {
	private SearchType searchType;
	private String keyword;
}
