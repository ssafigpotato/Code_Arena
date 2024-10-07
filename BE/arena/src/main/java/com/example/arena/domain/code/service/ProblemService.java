package com.example.arena.domain.code.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.example.arena.domain.code.dto.request.ProblemDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ProblemService {

	@Autowired
	private RedisTemplate<String, Object> redisTemplate;

	@Autowired
	private ObjectMapper objectMapper;

	private final String PROBLEM_KEY = "problem:";

	public void saveProblem(ProblemDto problem) {
		redisTemplate.opsForValue().set(PROBLEM_KEY + problem.getRoomId(), problem);
	}

	public ProblemDto getProblem(UUID roomId) {
		ProblemDto problem = (ProblemDto) redisTemplate.opsForValue().get(PROBLEM_KEY + roomId.toString());
		if (problem == null) {
			throw new RuntimeException("Failed to parse JSON");
		}
		return problem;
	}

}
