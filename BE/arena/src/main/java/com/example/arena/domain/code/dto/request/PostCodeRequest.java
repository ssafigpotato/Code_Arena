package com.example.arena.domain.code.dto.request;

import java.util.UUID;

import com.example.arena.domain.code.entity.Language;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PostCodeRequest {
	private UUID roomId;
	private String problem;
	private Language language;
	private String content;
}
