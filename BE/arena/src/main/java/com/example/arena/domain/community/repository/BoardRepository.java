package com.example.arena.domain.community.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.arena.domain.community.entity.Board;

public interface BoardRepository extends JpaRepository<Board, UUID>{

}
