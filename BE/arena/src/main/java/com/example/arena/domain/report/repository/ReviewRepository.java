package com.example.arena.domain.report.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.arena.domain.report.entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {

}
