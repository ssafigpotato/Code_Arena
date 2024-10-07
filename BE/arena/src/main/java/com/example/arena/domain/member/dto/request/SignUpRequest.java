package com.example.arena.domain.member.dto.request;

import com.example.arena.domain.member.entity.Role;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SignUpRequest {

    @NotBlank(message = "Email is mandatory")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password is mandatory")
    @Size(min = 8, message = "Password should be at least 8 characters")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$",
            message = "Password must contain a number, a letter, and a special character")
    private String password;

    @NotBlank(message = "Name is mandatory")
    @Size(min = 3, max = 20, message = "Name should be between 3 and 20 characters")
    private String name;

    @NotBlank(message = "Nickname is mandatory")
    @Size(min = 3, max = 20, message = "Nickname should be between 3 and 20 characters")
    private String nickname;

    @Past
    private Date birth;

    private String image;
}
