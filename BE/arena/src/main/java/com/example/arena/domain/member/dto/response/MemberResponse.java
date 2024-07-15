package com.example.arena.domain.member.dto.response;

import com.example.arena.domain.member.entity.Role;
import lombok.Builder;
import lombok.Getter;

import java.util.Date;
import java.util.UUID;

@Getter
@Builder
public class MemberResponse {
    private UUID id;
    private String email;
    private String name;
    private String nickname;
    private Date birth;
    private Role role;
    private String image;
}
