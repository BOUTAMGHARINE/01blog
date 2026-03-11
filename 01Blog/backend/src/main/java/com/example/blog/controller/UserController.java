package com.example.blog.controller;

import com.example.blog.entities.*;
import com.example.blog.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200") // ✅ Permet à Angular d'accéder à l'API
public class UserController {

    @Autowired
    private UserRepository userRepository;

    /**
     * ✅ Requis par UserService.getAllUsers()
     * Retourne la liste de tous les utilisateurs pour la recherche
     */
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * ✅ Requis par UserService.getUserById(id)
     * Retourne un utilisateur spécifique pour afficher son profil
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Inscription / Enregistrement
     */
    @PostMapping("/signup")
    public ResponseEntity<User> saveUser(@RequestBody User user) {
        User savedUser = userRepository.save(user);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    /**
     * Logique Follow / Unfollow
     */
    @PostMapping("/{targetId}/follow")
    public ResponseEntity<?> toggleFollow(
            @PathVariable Long targetId, 
            @RequestParam Long currentUserId) {
        
        // On récupère les deux utilisateurs
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Utilisateur actuel non trouvé"));
        User targetUser = userRepository.findById(targetId)
                .orElseThrow(() -> new RuntimeException("Utilisateur cible non trouvé"));

        // On ne peut pas se suivre soi-même
        if (currentUserId.equals(targetId)) {
            return ResponseEntity.badRequest().body("On ne peut pas se suivre soi-même");
        }

        // Logique de bascule (Toggle)
        if (currentUser.getFollowing().contains(targetUser)) {
            currentUser.getFollowing().remove(targetUser);
        } else {
            currentUser.getFollowing().add(targetUser);
        }
        
        userRepository.save(currentUser);
        return ResponseEntity.ok().body("{\"message\": \"Success\"}");
    }
}