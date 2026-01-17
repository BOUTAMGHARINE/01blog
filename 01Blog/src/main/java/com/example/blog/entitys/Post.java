package com.example.blog.entitys;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.CascadeType;


@Entity
@NoArgsConstructor @AllArgsConstructor @Data
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String content;
    private String image;
    private boolean hidden;
    @ManyToOne
    @JoinColumn(name = "author_id", nullable = true   , referencedColumnName = "id")
    private User author;
    @OneToMany(mappedBy="post",cascade=CascadeType.ALL)
    private List<Comment> comments;


}
