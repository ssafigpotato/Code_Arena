package com.example.arena.domain.member.entity;
import com.example.arena.domain.group.entity.GroupMember;
import com.example.arena.domain.group.entity.GroupType;
import com.example.arena.domain.room.entity.RoomMember;
import com.example.arena.global.entity.BaseEntity;
import com.github.f4b6a3.ulid.UlidCreator;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;

import java.sql.Timestamp;
import java.util.*;

@Entity
@Getter
@Table(name = "`Member`")
@SQLRestriction("deleted_at is null")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member extends BaseEntity {

    @Id
    @Column(columnDefinition = "BINARY(16)")
    private UUID id = UlidCreator.getMonotonicUlid().toUuid();

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String nickname;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, name = "nickname_expire_date")
    private Date nicknameExpireDate;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date birth;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String image;

    @OneToMany(
            mappedBy = "member",
            cascade = {CascadeType.PERSIST,CascadeType.MERGE}
    )
    private Set<GroupMember> groups = new HashSet<>();

    @OneToMany(
            mappedBy = "member",
            cascade = {CascadeType.PERSIST,CascadeType.MERGE}
    )
    private Set<RoomMember> rooms = new HashSet<>();

    @Builder
    public Member(String email, String password, String name, String nickname, Timestamp nicknameExpireDate, Date birth, Role role, String image) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.nickname = nickname;
        this.nicknameExpireDate = new Date();
        this.birth = birth;
        this.role = role;
        this.image = image;
    }

    /* 2024-07-23 @glenn-syj
     * 비즈니스 로직 논의 필요
     */
    public void updateNicknameImage(String nickname, String image){
        this.nickname = nickname;
        this.image = image;
    }

    // 닉네임 업데이트 시 관련 로직 추가 필요
}
