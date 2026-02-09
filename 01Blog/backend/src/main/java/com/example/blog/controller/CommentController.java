package com.example.blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;

import com.example.blog.dto.CommentDto;
import com.example.blog.entities.Comment;
import com.example.blog.entities.Post;
import com.example.blog.repository.CommentRepository;
import com.example.blog.repository.PostRepository;;
@RestController
@RequestMapping("/api")

public class CommentController {
    @Autowired
    private CommentRepository commentRepository ;
    @Autowired
    private PostRepository  postRepository;
     
    @PostMapping("/addcomment")
public Comment addComment(@RequestBody CommentDto dto) {
    Post post = postRepository.findById(dto.getPostId())
            .orElseThrow(() -> new RuntimeException("Post non trouvé"));

    Comment comment = new Comment();
    comment.setContent(dto.getContent());
    comment.setPost(post);

    return commentRepository.save(comment);
}



}
