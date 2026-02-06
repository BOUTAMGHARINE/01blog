package com.example.blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.blog.dto.*;
import com.example.blog.entities.*;
import com.example.blog.repository.*;

import java.time.LocalDateTime;
import java.util.List;








@RestController
@RequestMapping("/api/posts")
public class PostController {
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private UserRepository userRepository;

   @PostMapping("addpost")
public Post savePost(@RequestBody PostRequestDTO dto){
    User author = userRepository.findById(dto.getAuthorId())
                                .orElseThrow(() -> new RuntimeException("User not found"));
    System.out.println("----------------------------------------."+author);
    Post post = new Post();
    post.setCreatedAt(LocalDateTime.now());
    post.setHidden(dto.isHidden());
    post.setContent(dto.getContent());
    post.setImage(dto.getImage());
    post.setAuthor(author);  // <-- L'objet complet
    return postRepository.save(post);
}
@GetMapping("getposts")
public List<Post> getPosts(){
    List<Post> post = postRepository.findByHidden(false);
    //System.out.println("--------"+post.toString());

    return post;

}
@DeleteMapping("/deletepost/{postId}")
public ResponseEntity<String> deletePost(
        @PathVariable Long postId,
        @RequestParam Long authorId) { 

    // Vérifie si le post existe
    Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));

    if (!post.getAuthor().getId().equals(authorId)) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("You are not allowed to delete this post");
    }

    // Supprime le post
    postRepository.delete(post);
    return ResponseEntity.ok("Post deleted successfully");
}
@PutMapping("editpost/{id}")
public ResponseEntity<String> updatePost(
        @PathVariable Long id,
        @RequestBody PostRequestDTO dto) {

    Post post = postRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Post not found"));
    if (!post.getAuthor().equals(dto.getAuthorId())){
         return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("You are not allowed to edite this post");

    }

    post.setContent(dto.getContent());
    post.setImage(dto.getImage());
    post.setHidden(dto.isHidden());

    return ResponseEntity.ok("Post updated successfully");
}


}
