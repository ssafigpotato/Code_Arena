package com.example.arena.domain.report.mapper;

import org.springframework.stereotype.Component;

import com.example.arena.domain.report.dto.request.ReviewRequest;
import com.example.arena.domain.report.entity.Review;

@Component
public class ReviewMapper {

	public Review reviewRequestToEntity(ReviewRequest request) {
		return new Review(request.getScore(), request.getTitle(), request.getContent());
	}

}
