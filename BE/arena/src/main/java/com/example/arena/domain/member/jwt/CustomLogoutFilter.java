package com.example.arena.domain.member.jwt;

import com.example.arena.domain.member.repository.RefreshTokenRedisRepository;
import com.example.arena.domain.member.repository.RefreshTokenRepository;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;

public class CustomLogoutFilter extends GenericFilterBean {

    private final JWTUtil jwtUtil;
//    private final RefreshTokenRepository refreshRepository;
    private final RefreshTokenRedisRepository refreshTokenRedisRepository;

    public CustomLogoutFilter(JWTUtil jwtUtil, RefreshTokenRedisRepository refreshTokenRedisRepository) {

        this.jwtUtil = jwtUtil;
        this.refreshTokenRedisRepository = refreshTokenRedisRepository;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        doFilter((HttpServletRequest) request, (HttpServletResponse) response, chain);
    }

    private void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {

        //path and method verify
        String requestUri = request.getRequestURI();
        if (!requestUri.matches("^\\/logout$")) {

            filterChain.doFilter(request, response);
            return;
        }
        String requestMethod = request.getMethod();
        if (!requestMethod.equals("POST")) {

            filterChain.doFilter(request, response);
            return;
        }

        //get refresh token
        String refresh = request.getHeader("refresh");

        //refresh null check
        if (refresh == null) {

            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        //expired check
        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {

            //response status code
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // 토큰이 refresh인지 확인 (발급시 페이로드에 명시)
        String tokenType = jwtUtil.getTokenType(refresh);
        if (!tokenType.equals("refresh")) {

            //response status code
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        //DB에 저장되어 있는지 확인
//        Boolean isExist = refreshTokenRedisRepository.existsByTokenValue(refresh);
        Boolean isExist = refreshTokenRedisRepository.existsById(refresh);
        if (!isExist) {

            //response status code
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        //로그아웃 진행
        //Refresh 토큰 DB에서 제거
//        refreshTokenRedisRepository.deleteByTokenValue(refresh);
        refreshTokenRedisRepository.deleteById(refresh);

        //Refresh 토큰 Cookie 값 0
//        Cookie cookie = new Cookie("refresh", null);
//        cookie.setMaxAge(0);
//        cookie.setPath("/");
//
//        response.addCookie(cookie);
        response.setStatus(HttpServletResponse.SC_OK);
    }
}