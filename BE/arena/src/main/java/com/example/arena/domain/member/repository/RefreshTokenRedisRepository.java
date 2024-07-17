package com.example.arena.domain.member.repository;

import com.example.arena.domain.member.entity.RefreshTokenRedis;
import jakarta.transaction.Transactional;
import org.springframework.data.repository.CrudRepository;

public interface RefreshTokenRedisRepository extends CrudRepository<RefreshTokenRedis, String> {
//    Boolean existsByTokenValue(String tokenValue);
//
//    @Transactional
//    void deleteByTokenValue(String tokenValue);
}
