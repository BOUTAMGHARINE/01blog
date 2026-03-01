package com.example.blog.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.blog.dto.ReactionDto;
import com.example.blog.entities.Post;
import com.example.blog.entities.Reaction;
import com.example.blog.entities.User;
import com.example.blog.repository.PostRepository;
import com.example.blog.repository.ReactionRepository;
import com.example.blog.repository.UserRepository;
import com.example.blog.service.ReactionService;

import jakarta.transaction.Transactional;
@RestController


public class ReactionController {
    @Autowired
    private ReactionRepository reactionrepository;
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ReactionService reactionService;
   @PostMapping("/api/reaction")

@Transactional
public ResponseEntity<List<Reaction>> saveReaction(@RequestBody ReactionDto dto) {
    User user = userRepository.findById(dto.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));

    Post post = postRepository.findById(dto.getPostId())
            .orElseThrow(() -> new RuntimeException("Post not found"));

    if (reactionService.hasUserReactedToPost(post, user)) {
        reactionrepository.deleteByUserIdAndPostId(user.getId(), post.getId());
    } else {
        Reaction reaction = new Reaction();
        reaction.setPost(post);
        reaction.setUser(user);
        reactionrepository.save(reaction);
    }

    // --- LA MODIFICATION EST ICI ---
    // On récupère la liste fraîche des réactions pour CE post précis
    List<Reaction> updatedReactions = reactionrepository.findByPostId(post.getId());
    
    // On renvoie la liste au lieu d'une simple String
    return ResponseEntity.ok(updatedReactions);
}



}
