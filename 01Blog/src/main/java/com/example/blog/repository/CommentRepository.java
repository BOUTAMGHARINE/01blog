package com.example.blog.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.blog.entities.Comment;

public interface CommentRepository extends JpaRepository<Comment,Long>{
    

}
