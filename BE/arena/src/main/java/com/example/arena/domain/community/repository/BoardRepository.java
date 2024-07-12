package com.example.arena.domain.community.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.arena.domain.community.entity.Board;

@Repository
public interface BoardRepository extends JpaRepository<Board, UUID>{

}
