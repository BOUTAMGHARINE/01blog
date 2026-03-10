package com.example.blog.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.blog.entities.User;
import com.example.blog.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.example.blog.entities.Post;
import com.example.blog.repository.PostRepository;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ProfileController {
   @Autowired
    private  UserRepository userRepository;
    @Autowired
    private PostRepository postRepository;

    // 1. Récupérer les infos de l'utilisateur connecté

@GetMapping("/me")
public ResponseEntity<User> getMyProfile(Principal principal) {
    if (principal == null) {
        return ResponseEntity.status(401).build();
    }
    
    // principal.getName() retourne le username stocké dans le JWT
    User user = userRepository.findByUsername(principal.getName());
           
            
    user.setPassword(null);
    return ResponseEntity.ok(user);
}

    // 2. Mettre à jour le profil (Bio, Email, etc.)
    // @PutMapping("/update")
    // public ResponseEntity<?> updateProfile(
    //         @AuthenticationPrincipal UserDetails currentUser,
    //         @RequestBody User updatedData) {
        
    //     return userRepository.findByUsername(currentUser.getUsername())
    //         .map(user -> {
    //             user.setEmail(updatedData.getEmail());
    //             user.setPassword(updatedData.getPassword());
    //             user.setUsername(updatedData.getUsername());
    //             // Ajoute ici d'autres champs modifiables (bio, avatar, etc.)
    //             userRepository.save(user);
    //             return ResponseEntity.ok("Profile updated successfully!");
    //         })
    //         .orElse(ResponseEntity.notFound().build());
    // }

    @GetMapping("/posts")
public ResponseEntity<List<Post>> getMyPosts(Principal principal ) {
     if (principal == null) {
        return ResponseEntity.status(401).build();
    }
    
    // On utilise le username extrait du Token JWT pour filtrer
    List<Post> myPosts = postRepository.findByAuthorUsername(principal.getName()); 
    return ResponseEntity.ok(myPosts);
}
}
