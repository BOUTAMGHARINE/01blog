package com.example.blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;


import com.example.blog.entitys.Post;
import com.example.blog.repository.PostRepository;








@RestController
@RequestMapping("/api/posts")
public class PostController {
    @Autowired
    private PostRepository postRepository;

   @PostMapping
   public Post savePost(@RequestBody Post post){
    postRepository.save(post);
    return post;
   }
}
