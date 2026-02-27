package com.example.blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.blog.service.*;

import com.example.blog.dto.PostRequestDTO;
import com.example.blog.entities.Post;
import com.example.blog.entities.User;
import com.example.blog.repository.PostRepository;
import com.example.blog.repository.UserRepository;
import com.example.blog.service.PostService;
import java.util.Collections;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PostService postService;

        @PostMapping(
        value = "/addpost",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Post> savePost(
            @ModelAttribute PostRequestDTO dto,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws IOException {
        Post post = postService.createPost(dto, file);
        if (post.getMediaUrl() != null) {
            post.setMediaUrl("http://localhost:8080/" + post.getMediaUrl());

        }
        return ResponseEntity.ok(post);
    }

@GetMapping("getposts")
public List<Post> getPosts() {
    List<Post> posts = postRepository.findByHidden(false);
    Collections.reverse(posts);

    System.out.println(".(hahowa dkhel)");

    posts.forEach(post -> {

        if (post.getMediaUrl() != null) {
            post.setMediaUrl("http://localhost:8080/" + Paths.get(post.getMediaUrl()).getFileName());
        }
    });

    return posts;
}


    @DeleteMapping("/deletepost/{postId}")
    public ResponseEntity<String> deletePost(
            @PathVariable Long postId,
            @RequestParam Long authorId) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getAuthor().getId().equals(authorId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You are not allowed to delete this post");
        }

        postRepository.delete(post);
        return ResponseEntity.ok("Post deleted successfully");
    }

    @PutMapping("editpost/{id}")
    public ResponseEntity<String> updatePost(
            @PathVariable Long id,
            @RequestBody PostRequestDTO dto) {

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getAuthor().getId().equals(dto.getAuthorId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You are not allowed to edit this post");
        }

        post.setContent(dto.getContent());
        post.setHidden(dto.isHidden());

        postRepository.save(post);

        return ResponseEntity.ok("Post updated successfully");
    }
}
