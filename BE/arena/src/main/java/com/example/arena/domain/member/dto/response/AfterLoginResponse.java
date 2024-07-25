package com.example.arena.domain.member.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AfterLoginResponse {

//    존재 이유를 모르겠음 (회원 가입시 바로 로그인 처리를 할 때 대비?)
//    private SignStatus signStatus;
    private MemberResponse memberDto;
    private TokenResponse tokenDto;
}
