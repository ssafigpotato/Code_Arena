package com.example.arena.domain.member.service;

import com.example.arena.domain.config.MemberTestConfig;
import com.example.arena.domain.config.SecurityConfig;
import com.example.arena.domain.member.controller.MemberController;
import com.example.arena.domain.member.dto.CustomUserDetails;
import com.example.arena.domain.member.dto.request.SignUpRequest;
import com.example.arena.domain.member.dto.request.UpdateRequest;
import com.example.arena.domain.member.dto.response.MemberResponse;
import com.example.arena.domain.member.entity.Member;
import com.example.arena.domain.member.entity.Role;
import com.example.arena.domain.member.mapper.MemberMapper;
import com.example.arena.domain.member.repository.MemberRepository;
import com.example.arena.domain.member.repository.RefreshTokenRedisRepository;
import com.example.arena.domain.member.service.MemberService;
import com.example.arena.domain.member.jwt.JWTUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.sql.Timestamp;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@ActiveProfiles(value = "test")
@Import({SecurityConfig.class, MemberTestConfig.class})
@ExtendWith(MockitoExtension.class)
public class MemberServiceTest {

    private MockMvc mockMvc;

    @InjectMocks
    private MemberService memberService;

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private MemberMapper memberMapper;

    @Mock
    private RefreshTokenRedisRepository refreshTokenRedisRepository;

    @Mock
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Mock
    private JWTUtil jwtUtil;

    @Mock
    private CustomUserDetailsService customUserDetailsService;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    private SignUpRequest signUpRequest;
    private UpdateRequest updateRequest;
    private Member member;

    private CustomUserDetails customUserDetails;
    private UUID userId;

    @BeforeEach
    public void setUp() {
        signUpRequest = new SignUpRequest("test@example.com", "password", "name", "nickname", new Date(), null);
        updateRequest = new UpdateRequest("newNickname", "newImage");
        member = new Member("test@example.com", "password", "name", "nickname", new Timestamp(System.currentTimeMillis()), new Date(), Role.ROLE_USER, null);

        customUserDetails = new CustomUserDetails(member);

//        securityContext.setAuthentication(new Authentication("test@example.com", "password"));
        SecurityContextHolder.setContext(securityContext);


    }

    @Test
    public void signUpMember_ShouldReturnMemberResponse_WhenRequestIsValid() {
        // Given
        when(memberRepository.existsByEmail(anyString())).thenReturn(false);
        when(bCryptPasswordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(memberMapper.dtoToMemberEntity(any(SignUpRequest.class))).thenReturn(member);
        when(memberRepository.save(any(Member.class))).thenReturn(member);
        when(memberMapper.entityToDto(any(Member.class))).thenReturn(new MemberResponse());

        // When
        MemberResponse response = memberService.signUpMember(signUpRequest);

        // Then
        assertNotNull(response);
        verify(memberRepository, times(1)).existsByEmail(anyString());
        verify(bCryptPasswordEncoder, times(1)).encode(anyString());
        verify(memberRepository, times(1)).save(any(Member.class));
        verify(memberMapper, times(1)).entityToDto(any(Member.class));
    }

    @Test
    public void updateMember_ShouldReturnUpdatedMemberResponse_WhenUpdateIsValid() {
        // Given
        when(memberRepository.findById(any(UUID.class))).thenReturn(Optional.of(member));
        when(memberMapper.entityToDto(any(Member.class))).thenReturn(new MemberResponse());

        // When
        MemberResponse response = memberService.updateMember(updateRequest);

        // Then
        assertNotNull(response);
        verify(memberRepository, times(1)).findById(any(UUID.class));
        verify(memberRepository, times(1)).save(any(Member.class));
        verify(memberMapper, times(1)).entityToDto(any(Member.class));
    }
}
