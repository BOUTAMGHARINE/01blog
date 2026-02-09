package com.example.blog.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentDto {
    private String content;
    private Long postId; // l'id du post auquel le commentaire appartient
}
