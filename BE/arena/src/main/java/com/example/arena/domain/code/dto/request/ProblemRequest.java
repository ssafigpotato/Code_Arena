package com.example.arena.domain.code.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProblemRequest {
    private UUID roomId;
    private String description;
    private String[] inputCondition;
    private String[] outputCondition;
    private TestCase[] examples;
    private TestCase[] testcases;
}