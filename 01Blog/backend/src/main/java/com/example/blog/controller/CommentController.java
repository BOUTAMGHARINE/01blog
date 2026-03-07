package com.example.blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;

import com.example.blog.dto.CommentDto;
import com.example.blog.entities.Comment;
import com.example.blog.entities.Post;
import com.example.blog.entities.User;
import com.example.blog.repository.CommentRepository;
import com.example.blog.repository.PostRepository;import com.example.blog.repository.UserRepository;
;
@RestController
@RequestMapping("/api/comments")

public class CommentController {
    @Autowired
    private CommentRepository commentRepository ;
    @Autowired
    private PostRepository  postRepository;
    @Autowired
    private  UserRepository userRepository;
     
    @PostMapping("/addcomment")
public Comment addComment(@RequestBody CommentDto dto) {
    Post post = postRepository.findById(dto.getPostId())
            .orElseThrow(() -> new RuntimeException("Post non trouvé"));

    Comment comment = new Comment();
      User user = userRepository.findById(dto.getUserId())
            .orElseThrow(() -> new RuntimeException("User non trouvé"));
    comment.setContent(dto.getContent());
    comment.setPost(post);
    comment.setUser(user);

    return commentRepository.save(comment);

}
@DeleteMapping("/{id}")
public void deleteComment(@PathVariable Long id) {
    // On vérifie si le commentaire existe avant de tenter la suppression
    if (!commentRepository.existsById(id)) {
        throw new RuntimeException("Commentaire non trouvé avec l'id : " + id);
    }
    commentRepository.deleteById(id);
}



}
