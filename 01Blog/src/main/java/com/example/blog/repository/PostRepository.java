package com.example.blog.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.blog.entitys.Post;


public interface PostRepository extends JpaRepository <Post,Long> {


    

}
