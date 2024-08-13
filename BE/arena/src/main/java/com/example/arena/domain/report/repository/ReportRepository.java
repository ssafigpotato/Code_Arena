package com.example.arena.domain.report.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.arena.domain.report.entity.Report;

public interface ReportRepository extends JpaRepository<Report, UUID>{

	Report findByRoomId(UUID roomId);

}
