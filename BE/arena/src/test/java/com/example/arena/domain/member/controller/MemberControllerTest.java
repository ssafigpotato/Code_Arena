package com.example.arena.domain.member.controller;

import com.example.arena.domain.config.MemberTestConfig;
import com.example.arena.domain.config.SecurityConfig;
import com.example.arena.domain.member.WithCustomMockUser;
import com.example.arena.domain.member.dto.CustomUserDetails;
import com.example.arena.domain.member.dto.request.LoginRequest;
import com.example.arena.domain.member.dto.request.SignUpRequest;
import com.example.arena.domain.member.entity.Member;
import com.example.arena.domain.member.entity.Role;
import com.example.arena.domain.member.mapper.MemberMapper;
import com.example.arena.domain.member.repository.MemberRepository;
import com.example.arena.domain.member.repository.RefreshTokenRedisRepository;
import com.example.arena.domain.member.service.CustomUserDetailsService;
import com.example.arena.domain.member.service.MemberService;
import com.example.arena.domain.member.jwt.JWTUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import javax.inject.Inject;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MemberController.class)
@ActiveProfiles(value = "test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Import({SecurityConfig.class, MemberTestConfig.class})
@WebAppConfiguration
public class MemberControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MemberService memberService;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @MockBean
    private MemberRepository memberRepository;

//    @MockBean
//    private JWTUtil jwtUtil;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Test
    public void signUp_ShouldReturnOk_WhenRequestIsValid() throws Exception {
        // Given
        SignUpRequest request = new SignUpRequest("test@example.com", "password", "name", "nickname", new Date(), null);
        String jsonRequest = objectMapper.writeValueAsString(request);

        // When & Then
        mockMvc.perform(post("/member/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isOk());

        // Verify that the service method was called
        verify(memberService, times(1)).signUpMember(any(SignUpRequest.class));
    }

    @Test
//    @WithCustomMockUser
    public void login_ShouldReturnOk_WhenRequestIsValid() throws Exception {

        // Given
        Member member = new Member(
                "test@example.com",
                new BCryptPasswordEncoder().encode("password"),
                "name",
                "nickname",
                new Timestamp(System.currentTimeMillis()),
                new Date(),
                Role.ROLE_USER,
                null);
        CustomUserDetails customUserDetails = new CustomUserDetails(member);
        GrantedAuthority authority = new SimpleGrantedAuthority("USER");
        List<GrantedAuthority> grantedAuthorityList = new ArrayList<>();
        grantedAuthorityList.add(authority);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                member.getEmail(), member.getPassword()
        );
        Authentication authenticationAuthed = new UsernamePasswordAuthenticationToken(
                customUserDetails, authority
        );

        when(memberRepository.findByEmail(member.getEmail()))
                .thenReturn(Optional.of(member));

        when(customUserDetailsService.loadUserByUsername(member.getEmail()))
                .thenReturn(customUserDetails);

        SecurityContextHolder.getContext().setAuthentication(authenticationAuthed);

        LoginRequest request = new LoginRequest("test@example.com", "password");
        String jsonRequest = objectMapper.writeValueAsString(request);

        // When & Then
        mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isOk());
    }


    @Test
    public void login_ShouldReturn4xx_WhenRequestIsInvalid() throws Exception {

        // given
        Member member = new Member(
                "test@example.com",
                "password",
                "name",
                "nickname",
                new Timestamp(System.currentTimeMillis()),
                new Date(),
                Role.ROLE_USER,
                null);
        CustomUserDetails customUserDetails = new CustomUserDetails(member);
        GrantedAuthority authority = new SimpleGrantedAuthority("USER");
        List<GrantedAuthority> grantedAuthorityList = new ArrayList<>();
        grantedAuthorityList.add(authority);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                member.getEmail(), member.getPassword()
        );
        Authentication authenticationAuthed = new UsernamePasswordAuthenticationToken(
                customUserDetails, authority
        );

        LoginRequest request = new LoginRequest("test2@example.com", "password");
        String jsonRequest = objectMapper.writeValueAsString(request);

        // When & Then
        mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isUnauthorized());
    }
}