package com.example.arena.domain.member.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRequest {

    @NotBlank(message = "Nickname is mandatory")
    @Size(min = 3, max = 20, message = "Nickname should be between 3 and 20 characters")
    private String changeNickname;

    private String changeImage;
}
