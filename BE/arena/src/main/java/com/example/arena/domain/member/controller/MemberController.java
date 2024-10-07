package com.example.arena.domain.member.controller;

import com.example.arena.domain.member.dto.request.SignUpRequest;
import com.example.arena.domain.member.dto.request.UpdateRequest;
import com.example.arena.domain.member.dto.response.MemberResponse;
import com.example.arena.domain.member.jwt.JWTUtil;
import com.example.arena.domain.member.service.MemberService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/member")
@CrossOrigin(origins = "http://localhost:3000")
public class MemberController {

    private final MemberService memberService;
    private final JWTUtil jwtUtil;

    public MemberController(MemberService memberService, JWTUtil jwtUtil){
        this.memberService = memberService;
        this.jwtUtil = jwtUtil;
    }

    //AuthController
    @PostMapping("/signup")
    public ResponseEntity<Void> signUp(@RequestBody SignUpRequest request) {
        memberService.signUpMember(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response) {
        return memberService.reissueMember(request, response);
    }

    //MemberController
    @PutMapping("/")
    public ResponseEntity<MemberResponse> updateMember(@RequestBody UpdateRequest update) {
        return ResponseEntity.ok(memberService.updateMember(update));
    }

    @DeleteMapping("/")
    public ResponseEntity<Void> deleteMember() {
        memberService.deleteMember();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<MemberResponse> searchMember() {
        return ResponseEntity.ok(memberService.searchMember());
    }

    @GetMapping("/search/{memberId}")
    public ResponseEntity<String> fetchMemberNickname(@PathVariable (name = "memberId") UUID memberId) {
        String nickname = memberService.searchMemberById(memberId).getNickname();
        return ResponseEntity.ok(nickname);
    }

}