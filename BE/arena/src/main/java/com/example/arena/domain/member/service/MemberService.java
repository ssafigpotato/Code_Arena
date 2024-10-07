package com.example.arena.domain.member.service;

import com.example.arena.domain.member.dto.CustomUserDetails;
import com.example.arena.domain.member.dto.request.SignUpRequest;
import com.example.arena.domain.member.dto.request.UpdateRequest;
import com.example.arena.domain.member.dto.response.MemberResponse;
import com.example.arena.domain.member.entity.Member;
import com.example.arena.domain.member.entity.RefreshToken;
import com.example.arena.domain.member.entity.RefreshTokenRedis;
import com.example.arena.domain.member.entity.Role;
import com.example.arena.domain.member.jwt.JWTUtil;
import com.example.arena.domain.member.mapper.MemberMapper;
import com.example.arena.domain.member.repository.MemberRepository;
import com.example.arena.domain.member.repository.RefreshTokenRedisRepository;
import com.example.arena.domain.member.repository.RefreshTokenRepository;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class MemberService {
    private final MemberRepository memberRepository;
    private final MemberMapper memberMapper;
//    private final RefreshTokenRepository refreshTokenRepository;
    private final RefreshTokenRedisRepository refreshTokenRedisRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final JWTUtil jwtUtil;

    public MemberService(MemberRepository memberRepository, MemberMapper memberMapper, RefreshTokenRedisRepository refreshTokenRedisRepository, BCryptPasswordEncoder bCryptPasswordEncoder, JWTUtil jwtUtil){
        this.memberRepository = memberRepository;
        this.memberMapper = memberMapper;
        this.refreshTokenRedisRepository = refreshTokenRedisRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public MemberResponse signUpMember(SignUpRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();

        // 처리 관련 로직 수정 필요
        if (memberRepository.existsByEmail(email)) {
            // 일단 임시 에러 띄우는 코드
            throw new IllegalArgumentException("The email already enrolled");
        };

        request.setPassword(bCryptPasswordEncoder.encode(password));
        Member member = memberRepository.save(memberMapper.dtoToMemberEntity(request));

        return memberMapper.entityToDto(member);
    }

    /* 24-07-23 @glenn-syj
     * 구체적인 비즈니스 로직 논의 필요
     */
    @Transactional
    public MemberResponse updateMember(UpdateRequest update){
        Member curMember = getMemberValue();
        curMember.updateNicknameImage(update.getChangeNickname(), update.getChangeImage());
        memberRepository.save(curMember);

        return memberMapper.entityToDto(curMember);
    }

    @Transactional
    public void deleteMember() {
        Member member = getMemberValue();
        member.softDelete();
    }

    public MemberResponse searchMember() {
        System.out.println(getIdValue());
        System.out.println(getMemberValue().getId());
        return memberMapper.entityToDto(getMemberValue());
    }

    public Member searchMemberById(UUID id){
        return memberRepository.findById(id).orElseThrow(EntityNotFoundException::new);
    }

    public UUID getIdValue(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getId();
    }

    public Member getMemberValue() {
        System.out.println("TMP : "+getIdValue());
        return memberRepository.findById(getIdValue()).orElseThrow(EntityNotFoundException::new);
    }

    @Transactional
    public ResponseEntity<?> reissueMember(HttpServletRequest request, HttpServletResponse response){
        String refresh = request.getHeader("refresh");

        if (refresh == null) return new ResponseEntity<>("refresh token null", HttpStatus.BAD_REQUEST);

        //expired check
        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {
            //response status code
            return new ResponseEntity<>("refresh token expired", HttpStatus.BAD_REQUEST);
        }

        //DB에 저장되어 있는지 확인
        Boolean isExist = refreshTokenRedisRepository.existsById(refresh);
        if (!isExist) {
            //response body
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        String username = jwtUtil.getUsername(refresh);
        Role role = jwtUtil.getRole(refresh);
        UUID id = jwtUtil.getId(refresh);

        //make new JWT
        String newAccess = jwtUtil.createJwt("access", username, String.valueOf(role), id, 600000L);
        String newRefresh = jwtUtil.createJwt("refresh", username, String.valueOf(role), id, 86400000L);

        deleteAndSaveToken(refresh, username, newAccess, newRefresh, response);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    public void deleteAndSaveToken(String refresh, String username, String newAccess, String newRefresh, HttpServletResponse response){
        //Refresh 토큰 저장 DB에 기존의 Refresh 토큰 삭제 후 새 Refresh 토큰 저장
        refreshTokenRedisRepository.deleteById(refresh);

        RefreshTokenRedis refreshTokenRedis = RefreshTokenRedis.builder()
                .tokenKey(username)
                .tokenValue(newRefresh)
                .build();
        refreshTokenRedisRepository.save(refreshTokenRedis);

        //response
        response.setHeader("access", newAccess);
        response.setHeader("refresh",newRefresh);
    }

}
