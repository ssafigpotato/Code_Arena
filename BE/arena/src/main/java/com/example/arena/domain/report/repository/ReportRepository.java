package com.example.arena.domain.report.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.arena.domain.report.entity.Report;

@Repository
public interface ReportRepository extends JpaRepository<Report, UUID> {

	List<Report> findByTesterId(UUID memberId);

}
