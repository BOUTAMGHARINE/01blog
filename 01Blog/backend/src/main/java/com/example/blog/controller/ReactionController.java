package com.example.blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.blog.entities.Reaction;
import com.example.blog.repository.ReactionRepository;
@RestController
@RequestMapping("/api/reactions")


public class ReactionController {
    @Autowired
    private ReactionRepository reactionRepository;
    @PostMapping
    public ResponseEntity<String> savereaction(@RequestBody Reaction reaction){
        reactionRepository.save(reaction);
    return ResponseEntity.ok("Reaction enregistrée");

    }



}
