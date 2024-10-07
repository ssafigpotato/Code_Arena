package com.example.arena.domain.config;

import com.example.arena.domain.member.repository.MemberRepository;
import com.example.arena.domain.member.repository.RefreshTokenRedisRepository;
import com.example.arena.domain.member.jwt.JWTUtil;
import com.example.arena.domain.member.mapper.MemberMapper;
import com.example.arena.domain.member.service.MemberService;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@TestConfiguration
public class MemberTestConfig {

    @Bean
    MemberService memberService() {
        return Mockito.mock(MemberService.class);
    }

    @Bean
    public MemberRepository memberRepository() {
        return Mockito.mock(MemberRepository.class);
    }

    @Bean
    public RefreshTokenRedisRepository refreshTokenRedisRepository() {
        return Mockito.mock(RefreshTokenRedisRepository.class);
    }

    @Bean
    @Primary
    public JWTUtil jwtUtil() {
        return Mockito.mock(JWTUtil.class);
    }

    @Bean
    public MemberMapper memberMapper() {
        return Mockito.mock(MemberMapper.class);
    }

}