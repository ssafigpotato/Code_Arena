DROP TABLE IF EXISTS BoardLike;
DROP TABLE IF EXISTS Comment;
DROP TABLE IF EXISTS CommentLike;
DROP TABLE IF EXISTS Board;
DROP TABLE IF EXISTS Member;


CREATE TABLE board_like (
    id BINARY(16) NOT NULL,
    member_id BINARY(16) NOT NULL,
    board_id BINARY(16) NOT NULL,
    is_liked BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (id)
);

CREATE TABLE comment (
    id BINARY(16) NOT NULL,
    member_id BINARY(16) NOT NULL,
    board_id BINARY(16) NOT NULL,
    content VARCHAR(255) NOT NULL,
    likes INT DEFAULT 0,
    is_secret BOOLEAN NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE comment_like (
    id BINARY(16) NOT NULL,
    comment_id BINARY(16) NOT NULL,
    member_id BINARY(16) NOT NULL,
    board_id BINARY(16) NOT NULL,
    is_liked BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (id)
);

CREATE TABLE board (
    id BINARY(16) NOT NULL,
    member_id BINARY(16) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE TABLE member (
	id Binary(16) not null,
    nick_name VARCHAR(255) NOT NULL
);
