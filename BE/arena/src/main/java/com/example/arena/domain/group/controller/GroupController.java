package com.example.arena.domain.group.controller;

import com.example.arena.domain.group.dto.request.*;
import com.example.arena.domain.group.dto.response.GroupDetailResponse;
import com.example.arena.domain.group.dto.response.GroupMemberResponse;
import com.example.arena.domain.group.dto.response.GroupResponse;
import com.example.arena.domain.group.service.GroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/group")
public class GroupController {
    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @PostMapping
    public ResponseEntity<GroupResponse> makeGroup(@RequestBody MakeGroupRequest request) {
        return ResponseEntity.ok(groupService.makeGroup(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupDetailResponse> getGroup(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(groupService.getGroup(id));
    }

    @GetMapping("/my")
    public ResponseEntity<List<GroupDetailResponse>> getMyGroups() {
        return ResponseEntity.ok(groupService.getMyGroups());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable("id") UUID id) {
        groupService.deleteGroup(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping
    public ResponseEntity<GroupResponse> updateGroup(@RequestBody UpdateGroupRequest request) {
        return ResponseEntity.ok(groupService.updateGroup(request));
    }

    @PostMapping("/invite")
    public ResponseEntity<GroupMemberResponse> inviteGroup(@RequestBody GroupInviteRequest request) {
        return ResponseEntity.ok(groupService.inviteGroup(request));
    }

    @PostMapping("/invite/apply")
    public ResponseEntity<GroupMemberResponse> acceptGroup(@RequestBody GroupAcceptRequest request) {
        return ResponseEntity.ok(groupService.applyInvite(request));
    }

    @GetMapping("/invite/{groupId}")
    public ResponseEntity<List<GroupMemberResponse>> getInviteInformation(@PathVariable("groupId") UUID groupId) {
        return ResponseEntity.ok(groupService.getCurInviteInformation(groupId));
    }

    @PostMapping("/change")
    public ResponseEntity<GroupDetailResponse> changeLeader(@RequestBody ChangeLeaderRequest request) {
        return ResponseEntity.ok(groupService.changeLeader(request));
    }

    @GetMapping("/all")
    public ResponseEntity<List<GroupResponse>> getAllGroups() {
        return ResponseEntity.ok(groupService.getAllGroups());
    }

    @PostMapping("/apply")
    public ResponseEntity<GroupDetailResponse> applyGroup(@RequestBody ApplyGroupRequest request) {
        return ResponseEntity.ok(groupService.applyGroup(request));
    }

    @PostMapping("/accept")
    public ResponseEntity<GroupDetailResponse> acceptGroup(@RequestBody AcceptGroupRequest request) {
        return ResponseEntity.ok(groupService.acceptGroup(request));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<GroupDetailResponse> withdrawGroup(@RequestBody WithDrawGroupRequest request) {
        return ResponseEntity.ok(groupService.withDrawGroup(request));
    }
}
