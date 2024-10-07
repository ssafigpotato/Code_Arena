package com.example.arena.domain.member.service;

import com.example.arena.domain.member.dto.CustomUserDetails;
import com.example.arena.domain.member.entity.Member;
import com.example.arena.domain.member.repository.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final MemberRepository userRepository;

    public CustomUserDetailsService(MemberRepository userRepository) {

        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // DB에서 조회 -- 이미 ENFE를 반환하므로 null 처리가 필요 없음
        Member userData = userRepository.findByEmail(username).orElseThrow(EntityNotFoundException::new);

        // AuthenticationManager or Authentication Provider에서 해당 메소드를 이용해 검증함
        // 이후 SecurityContextHolder에 등록되어 이용됨
        return new CustomUserDetails(userData);

    }
}