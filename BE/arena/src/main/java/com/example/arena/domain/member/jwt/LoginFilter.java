package com.example.arena.domain.member.jwt;

import com.example.arena.domain.member.dto.request.LoginRequest;
import com.example.arena.domain.member.dto.response.AfterLoginResponse;
import com.example.arena.domain.member.dto.response.MemberResponse;
import com.example.arena.domain.member.dto.response.TokenResponse;
import com.example.arena.domain.member.entity.Member;
import com.example.arena.domain.member.entity.RefreshToken;
import com.example.arena.domain.member.entity.RefreshTokenRedis;
import com.example.arena.domain.member.mapper.MemberMapper;
import com.example.arena.domain.member.repository.MemberRepository;
import com.example.arena.domain.member.repository.RefreshTokenRedisRepository;
import com.example.arena.domain.member.repository.RefreshTokenRepository;
import com.example.arena.global.error.ErrorResponse;
import com.example.arena.global.error.ErrorType;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.aspectj.lang.annotation.After;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;

public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    private final ObjectMapper objectMapper;
    private Logger logger = LoggerFactory.getLogger(LoginFilter.class);
//    private RefreshTokenRepository refreshRepository;
    private RefreshTokenRedisRepository refreshTokenRedisRepository;
    private MemberRepository memberRepository;

    public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil, ObjectMapper objectMapper, RefreshTokenRedisRepository refreshTokenRedisRepository, MemberRepository memberRepository) {

        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.objectMapper = objectMapper;
        this.refreshTokenRedisRepository = refreshTokenRedisRepository;
        this.memberRepository = memberRepository;
	setFilterProcessesUrl("/api/v1/login");
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

        try {
            LoginRequest loginRequest = objectMapper.readValue(request.getInputStream(), LoginRequest.class);

            //스프링 시큐리티에서 username과 password를 검증하기 위해서는 token에 담아야 함
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(), loginRequest.getPassword());

            // token에 담은 검증을 위한 AuthenticationManager로 전달
            return authenticationManager.authenticate(authToken);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }

    //로그인 성공시 실행하는 메소드 (여기서 JWT를 발급하면 됨)
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException {
        //유저 정보
        String username = authentication.getName();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        //로그인하기전 uuid몰라서 name으로 find
        Member member = memberRepository.findByEmail(username).orElseThrow(EntityNotFoundException::new);

        //토큰 생성
        String access = jwtUtil.createJwt(
                "access",
                member.getEmail(),
                String.valueOf(role),
                member.getId(),
                1800000L
        );

        String refresh = jwtUtil.createJwt(
                "refresh",
                member.getEmail(),
                String.valueOf(role),
                member.getId(),
                86400000L
        );

        //Refresh 토큰 저장
        addRefreshEntity(username, refresh);

        TokenResponse tokenDto = new TokenResponse(access, refresh);
        MemberResponse memberDto = new MemberMapper().entityToDto(member);

        AfterLoginResponse jsonResponse = new AfterLoginResponse(memberDto, tokenDto);

//        response.setHeader("access", "Bearer " + access);
        response.setHeader("access", access);
//        response.setHeader("refresh", "Bearer " + refresh);
        response.setHeader("refresh", refresh);

        //응답 설정
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        response.setStatus(HttpStatus.OK.value());

        response.getWriter().write(objectMapper.writeValueAsString(jsonResponse));
    }

    private void addRefreshEntity(String username, String refresh) {

//        RefreshToken refreshToken = RefreshToken.builder()
//                .tokenKey(username)
//                .tokenValue(refresh)
//                .build();
//
//        refreshRepository.save(refreshToken);
        RefreshTokenRedis refreshTokenRedis = RefreshTokenRedis.builder()
                .tokenKey(username)
                .tokenValue(refresh)
                .build();

        refreshTokenRedisRepository.save(refreshTokenRedis);
    }

    //로그인 실패시 실행하는 메소드
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException {

        ErrorResponse errorResponse = new ErrorResponse(
                ErrorType.USER_UNAUTHENTICATED.code,
                "유저 로그인에 실패했습니다.");

        response.setStatus(401);
        response.setHeader("Arena-Error-Code", ErrorType.USER_UNAUTHENTICATED.name());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}
