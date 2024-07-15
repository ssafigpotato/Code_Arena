package com.example.arena.domain.member.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AfterLoginResponse {
    private SignStatus signStatus;
    private TokenResponse tokenDto;
}
