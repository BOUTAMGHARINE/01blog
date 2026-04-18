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
import com.example.blog.entities.Notification;
import com.example.blog.entities.Post;
import com.example.blog.entities.User;
import com.example.blog.repository.NotificationRepository;
import com.example.blog.repository.PostRepository;
import com.example.blog.repository.UserRepository;


@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
 private NotificationRepository notificationRepository; //

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
        // 1. Détection du type MIME réel avec Tika
        Tika tika = new Tika();
        String mimeType = tika.detect(file.getBytes());
        System.out.println("MimeType détecté : " + mimeType);

        List<String> allowedImageTypes = List.of("image/jpeg", "image/png", "image/gif");
        List<String> allowedVideoTypes = List.of("video/mp4", "video/avi", "video/mov", "video/webm", "application/x-matroska");

        if (allowedImageTypes.contains(mimeType)) {
            post.setMediaType("IMAGE");
        } else if (allowedVideoTypes.contains(mimeType)) {
            post.setMediaType("VIDEO");
        } else {
            throw new RuntimeException("Type de fichier non autorisé: " + mimeType);
        }

        // 2. Vérification de la taille (40 Mo comme configuré dans ton code)
        long maxSize = 40 * 1024 * 1024; 
        if (file.getSize() > maxSize) {
            throw new RuntimeException("Fichier trop volumineux. Max 40 Mo.");
        }

        // 3. Nettoyage du nom de fichier (Supprime les ":" et les espaces)
        String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
        // On remplace tout ce qui n'est pas lettre, chiffre ou point par "_"
        String cleanName = originalName.replaceAll("[^a-zA-Z0-9.]", "_");
        String fileName = System.currentTimeMillis() + "_" + cleanName;

        // 4. Sauvegarde physique sur le disque
        Files.createDirectories(Paths.get(UPLOAD_DIR));
        Path filePath = Paths.get(UPLOAD_DIR, fileName);
        Files.write(filePath, file.getBytes());

        // 5. On stocke UNIQUEMENT le nom du fichier en base de données
        post.setMediaUrl(fileName);
    }
    Post savedPost = postRepository.save(post);

    // 2. LOGIQUE DES NOTIFICATIONS
    // On parcourt la liste des followers de l'auteur
    if (author.getFollowers() != null) {
        for (User follower : author.getFollowers()) {
            Notification notification = new Notification();
            notification.setRecipient(follower);
            notification.setPostId(savedPost.getId());
            notification.setCreatedAt(LocalDateTime.now());
            // Message en anglais comme demandé précédemment
            notification.setMessage(author.getUsername() + " published a new post");
            
            notificationRepository.save(notification);
        }
    }

    return savedPost;

}
}
