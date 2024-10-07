package com.example.arena.domain.member.repository;

import com.example.arena.domain.member.entity.RefreshToken;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    Optional<RefreshToken> findByTokenKey(String tokenKey);

    Boolean existsByTokenValue(String tokenValue);

    @Transactional
    void deleteByTokenValue(String tokenValue);
}
