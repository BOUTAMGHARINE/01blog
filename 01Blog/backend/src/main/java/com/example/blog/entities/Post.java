package com.example.blog.entities;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
import lombok.ToString;
import jakarta.persistence.CascadeType;


@Entity
@NoArgsConstructor @AllArgsConstructor @Data

@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private String mediaUrl; // image ou vidéo
    private String mediaType; // IMAGE ou VIDEO
    @JsonIgnore
    private boolean hidden;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author_id", nullable = true   , referencedColumnName = "id")
    private User author;
    @OneToMany(mappedBy="post",cascade=CascadeType.ALL)
    private List<Comment> comments;
    @JsonManagedReference
    @OneToMany(mappedBy="post",cascade=CascadeType.ALL)
    private List<Reaction> reactions;


}
