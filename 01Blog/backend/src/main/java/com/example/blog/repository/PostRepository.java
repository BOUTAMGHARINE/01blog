package com.example.blog.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.blog.entities.Post;

import java.util.List;
import java.util.Optional;


public interface PostRepository extends JpaRepository <Post,Long> {

    List<Post> findByHidden(boolean hidden);
    Optional<Post> findById(Long id);
    List<Post> findByAuthorUsername(String username);

    

}
