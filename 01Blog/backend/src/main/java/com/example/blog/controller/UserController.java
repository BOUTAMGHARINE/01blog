package com.example.blog.controller;

import com.example.blog.entities.*;
import com.example.blog.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.blog.dto.ChangePasswordRequest;
import com.example.blog.dto.UserResponseDto;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200") // ✅ Permet à Angular d'accéder à l'API
public class UserController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;


    /**
     * ✅ Requis par UserService.getAllUsers()
     * Retourne la liste de tous les utilisateurs pour la recherche
     */
    @GetMapping
    @Transactional(readOnly = true)
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponseDto::from)
                .toList();
    }

    /**
     * ✅ Requis par UserService.getUserById(id)
     * Retourne un utilisateur spécifique pour afficher son profil
     */
    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(UserResponseDto::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Inscription / Enregistrement
     */
    @PostMapping("/signup")
    @Transactional
    public ResponseEntity<UserResponseDto> saveUser(@RequestBody User user) {
        User savedUser = userRepository.save(user);
        return new ResponseEntity<>(UserResponseDto.from(savedUser), HttpStatus.CREATED);
    }

    /**
     * Logique Follow / Unfollow
     */
    @PostMapping("/{targetId}/follow")
    @Transactional
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

        boolean alreadyFollowing = currentUser.getFollowing().stream()
                .anyMatch(user -> targetId.equals(user.getId()));

        if (alreadyFollowing) {
            currentUser.getFollowing().removeIf(user -> targetId.equals(user.getId()));
            targetUser.getFollowers().removeIf(user -> currentUserId.equals(user.getId()));
        } else {
            currentUser.getFollowing().add(targetUser);
            targetUser.getFollowers().add(currentUser);
        }
        
        userRepository.save(currentUser);
        return ResponseEntity.ok(Map.of(
                "message", alreadyFollowing ? "Unfollowed" : "Followed",
                "currentUser", UserResponseDto.from(currentUser),
                "targetUser", UserResponseDto.from(targetUser)));
    }
    @PostMapping("/change-password")
public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
    // 1. Check if user exists
    Optional<User> userOptional = userRepository.findById(request.getUserId());
    
    if (userOptional.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                             .body("{\"message\": \"User not found\"}");
    } 

    User user = userOptional.get();

    // 2. Verify old password
    if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                             .body("{\"message\": \"Incorrect current password\"}");
    }

    // 3. Save new password
    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    userRepository.save(user);

    return ResponseEntity.ok()
                         .body("{\"message\": \"Password updated successfully\"}");
}

@DeleteMapping("/{id}")
public ResponseEntity<?> deleteUser(@PathVariable Long id) {
    // Vérifier si l'utilisateur existe
    if (!userRepository.existsById(id)) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                             .body("{\"message\": \"User not found\"}");
    }
     System.out.println(".(--------------------------------------------------------)"+id);
    // Suppression
    try {
        userRepository.deleteById(id);
        return ResponseEntity.ok().body("{\"message\": \"User deleted successfully\"}");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body("{\"message\": \"Error during deletion\"}");
    }
}



    
}
