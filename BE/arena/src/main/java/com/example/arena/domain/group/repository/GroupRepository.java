package com.example.arena.domain.group.repository;

import com.example.arena.domain.group.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


import java.util.List;
import java.util.UUID;

public interface GroupRepository extends JpaRepository<Group, UUID> {

    @Query(value = "SELECT g FROM Group g JOIN FETCH g.leader")
    List<Group> findAllWithLeader();
}
