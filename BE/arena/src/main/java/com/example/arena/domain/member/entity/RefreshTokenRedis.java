package com.example.arena.domain.member.entity;

import com.github.f4b6a3.ulid.UlidCreator;
import jakarta.persistence.Column;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.io.Serializable;
import java.util.UUID;

@Data
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@RedisHash(value = "refreshToken", timeToLive = 86400)
public class RefreshTokenRedis implements Serializable {

    private static final long serialVersionUID = -214490344996507077L;

    private String tokenKey;
    @Id
    private String tokenValue;
}
