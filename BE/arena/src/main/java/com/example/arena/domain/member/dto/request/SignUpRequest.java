package com.example.arena.domain.member.dto.request;

import com.example.arena.domain.member.entity.Role;
import lombok.*;

import java.util.Date;

@Getter
@Builder
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SignUpRequest {
    private String email;
    private String password;
    private String name;
    private String nickname;
    private Date birth;
    private Role role;
    private String image;
}
