package com.example.arena.domain.member.dto.response;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TokenResponse {
    @NotBlank
    private String accessToken;
    @NotBlank
    private String refreshToken;
}
