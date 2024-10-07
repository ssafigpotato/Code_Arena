package com.example.arena.domain.member.mapper;

import com.example.arena.domain.member.dto.request.SignUpRequest;
import com.example.arena.domain.member.dto.response.MemberResponse;
import com.example.arena.domain.member.entity.Member;
import com.example.arena.domain.member.entity.Role;
import org.springframework.stereotype.Component;

@Component
public class MemberMapper {
    public Member dtoToAdminEntity(SignUpRequest requestDto){
        Member build = Member.builder()
                .email(requestDto.getEmail())
                .password(requestDto.getPassword())
                .name(requestDto.getName())
                .nickname(requestDto.getNickname())
                .birth(requestDto.getBirth())
                .role(Role.ROLE_ADMIN)
                .image(requestDto.getImage())
                .build();

        return build;
    }

    public Member dtoToMemberEntity(SignUpRequest requestDto){
        Member build = Member.builder()
                .email(requestDto.getEmail())
                .password(requestDto.getPassword())
                .name(requestDto.getName())
                .nickname(requestDto.getNickname())
                .birth(requestDto.getBirth())
                .role(Role.ROLE_USER)
                .image(requestDto.getImage())
                .build();

        return build;
    }

    public MemberResponse entityToDto(Member member){
        MemberResponse build = MemberResponse.builder()
                .id(member.getId())
                .email(member.getEmail())
                .name(member.getName())
                .nickname(member.getNickname())
                .birth(member.getBirth())
                .role(member.getRole())
                .image(member.getImage())
                .build();

        return build;
    }

}
