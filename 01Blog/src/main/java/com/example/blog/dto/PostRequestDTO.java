package com.example.blog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor

public class PostRequestDTO {
     private String content;
    private String image;
    private Long authorId;  // <-- Ici tu mets juste l'ID
    // getters & setters

}
