package com.example.arena.domain.group.service;

import com.example.arena.domain.group.entity.Group;
import com.example.arena.domain.group.repository.GroupRepository;
import org.springframework.stereotype.Service;

@Service
public class GroupService {
    private final GroupRepository groupRepository;

    public GroupService(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }
}
