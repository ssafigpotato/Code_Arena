package com.example.arena.domain.member.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRequest {
    private String curNickname;
    private String changeNickname;
    private String changeImage;
}
