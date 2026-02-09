package com.example.blog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data @AllArgsConstructor @NoArgsConstructor
@Getter @Setter
public class PostRequestDTO {
     private String content;
     private String image;
     private Long authorId;  // <-- Ici tu mets juste l'ID
     private boolean hidden;
    // getters & setters

}
