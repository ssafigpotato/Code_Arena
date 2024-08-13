package com.example.arena.domain.code.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TestCase implements Serializable {
	private int id;
	private String in;
	private String out;
}