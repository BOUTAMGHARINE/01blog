package com.example.blog.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import org.apache.tika.Tika;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.blog.dto.PostRequestDTO;
import com.example.blog.entities.Post;
import com.example.blog.entities.User;
import com.example.blog.repository.PostRepository;
import com.example.blog.repository.UserRepository;


@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    private final String UPLOAD_DIR = "uploads";

    public Post createPost(PostRequestDTO dto, MultipartFile file) throws IOException {
        User author = userRepository.findById(dto.getAuthorId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = new Post();
        post.setContent(dto.getContent());
        post.setHidden(dto.isHidden());
        post.setAuthor(author);
        post.setCreatedAt(LocalDateTime.now());

      if (file != null && !file.isEmpty()) {
    String contentType = file.getContentType();
    if (contentType == null) {
        throw new RuntimeException("Impossible de détecter le type de fichier");
    }
    Tika tika = new Tika();
   String mimeType = tika.detect(file.getBytes()); // détecte le type réel


    List<String> allowedImageTypes = List.of("image/jpeg", "image/png", "image/gif");
    List<String> allowedVideoTypes = List.of("video/mp4", "video/avi", "video/mov");

    if (allowedImageTypes.contains(mimeType)) {
        post.setMediaType("IMAGE");
    } else if (allowedVideoTypes.contains(mimeType)) {
        post.setMediaType("VIDEO");
    } else {
        throw new RuntimeException("Type de fichier non autorisé: " + mimeType);
    }

    long maxSize = 10 * 1024 * 1024; // 10 Mo
    if (file.getSize() > maxSize) {
        throw new RuntimeException("Fichier trop volumineux. Max 10 Mo.");
    }

    Files.createDirectories(Paths.get(UPLOAD_DIR));
    String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
    Path filePath = Paths.get(UPLOAD_DIR, fileName);
    Files.write(filePath, file.getBytes());
    post.setMediaUrl(filePath.toString());
}

        return postRepository.save(post);
    }
}
