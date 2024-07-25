package com.example.arena.domain.member.dto.response;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenResponse {
    @NotBlank
    private String accessToken;
    @NotBlank
    private String refreshToken;
}