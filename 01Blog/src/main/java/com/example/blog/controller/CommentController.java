package com.example.blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;

import com.example.blog.repository.CommentRepository;
import com.example.blog.entitys.Comment;;
@RestController
@RequestMapping("/api/comments")

public class CommentController {
    @Autowired
    private CommentRepository commentRepository ;
    @PostMapping

    public Comment savecomment(@RequestBody Comment comment){

     commentRepository.save(comment);
     return comment;

    }




}
