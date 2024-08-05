package com.example.arena.domain.code.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TestCaseRequest {
    private String roomId;
    private TestCase[] testcases;
}

@Getter
@NoArgsConstructor
@AllArgsConstructor
class TestCase {
    private int id;
    private String in;
    private String out;
}