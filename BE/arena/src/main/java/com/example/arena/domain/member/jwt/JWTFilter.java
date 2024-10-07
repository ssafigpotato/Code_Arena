package com.example.arena.domain.member.jwt;

import com.example.arena.domain.member.dto.CustomUserDetails;
import com.example.arena.domain.member.entity.Member;
import com.example.arena.domain.member.entity.Role;
import com.example.arena.domain.member.repository.MemberRepository;
import com.example.arena.global.error.ErrorResponse;
import com.example.arena.global.error.ErrorType;
import com.example.arena.global.exception.InvalidJwtTokenException;
import com.example.arena.global.exception.UserNotFoundException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;

public class JWTFilter extends OncePerRequestFilter {
    private final JWTUtil jwtUtil;
    private final MemberRepository memberRepository;
    private final ObjectMapper objectMapper;


    public JWTFilter(JWTUtil jwtUtil, MemberRepository memberRepository, ObjectMapper objectMapper) {
        this.jwtUtil = jwtUtil;
        this.memberRepository = memberRepository;
        this.objectMapper = objectMapper;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // 현재 개발 진행에서 토큰이 존재해도 회원가입이 가능하도록 검증 생략
        String requestPath = request.getRequestURI();
        
        if ("/member/signup".equals(requestPath)) {
            filterChain.doFilter(request, response);
            return;
        }

        // 헤더에서 access키에 담긴 토큰을 꺼냄
        String accessToken = request.getHeader("access");

        // 토큰이 없다면 다음 필터로 넘김
        try {
            if (accessToken == null) {
                filterChain.doFilter(request, response);
                return;
            }
        } catch (IOException | ServletException e) {
            throw new RuntimeException(e);
        }

        // 토큰 만료 여부 확인, 만료시 다음 필터로 넘기지 않음
        try {
            jwtUtil.isExpired(accessToken);
        } catch (ExpiredJwtException e) {
            setUnauthorizedJsonResponseDetail(response, ErrorType.USER_JWT_EXPIRED, e.getMessage());
            return;
        }

        // 토큰이 access인지 확인 (발급시 페이로드에 명시)
        try {
            String tokenType = jwtUtil.getTokenType(accessToken);
            if (!tokenType.equals("access")) {
                throw new InvalidJwtTokenException();
            }
        } catch (InvalidJwtTokenException e) {
            setUnauthorizedJsonResponseDetail(response, ErrorType.USER_INVALID_JWT, e.getMessage());
            return;
        }

        // username, role 값을 획득
        // 여기에 검증 로직을 만들어야 함
        try {
            String email = jwtUtil.getUsername(accessToken);
            Role role = jwtUtil.getRole(accessToken);

            // role 일치 여부 검증
            Member userEntity = memberRepository
                    .findByEmail(email)
                    .orElseThrow(UserNotFoundException::new);

            if (userEntity.getRole() != role) {
                throw new InvalidJwtTokenException();
            }

            CustomUserDetails customUserDetails = new CustomUserDetails(userEntity);
            Authentication authToken = new UsernamePasswordAuthenticationToken(
                    customUserDetails,
                    null,
                    customUserDetails.getAuthorities()
            );

            SecurityContextHolder.getContext().setAuthentication(authToken);
        } catch (UserNotFoundException e) {
            setUnauthorizedJsonResponseDetail(response, ErrorType.USER_NOT_FOUND, e.getMessage());
        } catch (InvalidJwtTokenException e) {
            setUnauthorizedJsonResponseDetail(response, ErrorType.USER_INVALID_JWT, e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private void setUnauthorizedJsonResponseDetail(HttpServletResponse response, ErrorType errorType, String message) throws IOException {
        SecurityContextHolder.clearContext();

        ErrorResponse errorResponse = new ErrorResponse(errorType.code, message);

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setHeader("Arena-Error-Code", errorType.name());
        response.setContentType("application/json");
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
        response.getWriter().flush();
    }
}