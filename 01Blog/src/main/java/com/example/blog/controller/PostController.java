package com.example.blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import com.example.blog.entitys.Post;
import com.example.blog.repository.PostRepository;
import com.example.blog.dto.*;
import com.example.blog.repository.*;
import com.example.blog.entitys.*;








@RestController
@RequestMapping("/api/posts")
public class PostController {
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private UserRepository userRepository;

   @PostMapping
public Post savePost(@RequestBody PostRequestDTO dto){
    User author = userRepository.findById(dto.getAuthorId())
                                .orElseThrow(() -> new RuntimeException("User not found"));
    System.out.println("----------------------------------------."+author);
    Post post = new Post();
    post.setContent(dto.getContent());
    post.setImage(dto.getImage());
    post.setAuthor(author);  // <-- L'objet complet
    return postRepository.save(post);
}

}
