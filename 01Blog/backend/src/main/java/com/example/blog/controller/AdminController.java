package  com.example.blog.controller;
import java.util.List;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.example.blog.entities.Post;
import  com.example.blog.repository.*;

import com.example.blog.entities.User;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = {
    RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, 
    RequestMethod.DELETE, RequestMethod.PATCH, RequestMethod.OPTIONS
})
public class AdminController {


    private final UserRepository userRepository ;
    private final PostRepository postRepository ;

    // ---------------------------
    // Utilisateurs
    // ---------------------------

    // Lister tous les utilisateurs
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Supprimer un utilisateur
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("This user has been deleted");
    }

    // ---------------------------
    // Posts
    // ---------------------------

    // Lister tous les posts
    @GetMapping("/posts")
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // Cacher un post (mettre hidden = true)
@PatchMapping("/posts/{id}/toggle-hide")
public ResponseEntity<String> toggleHidePost(@PathVariable Long id) {
    Post post = postRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Post not found"));
    
    // Inverse the state
    boolean newStatus = !post.isHidden();
    post.setHidden(newStatus);
    postRepository.save(post);
    
    // English messages
    String message = newStatus ? "Post hidden successfully" : "Post is now visible";
    return ResponseEntity.ok(message);
}

    // Supprimer un post
    @DeleteMapping("/posts/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id) {
        postRepository.deleteById(id);
        return ResponseEntity.ok("The post has been deleted");
    }
    // @PostMapping("/bantoggele/{id}")
    // public ResponseEntity<>
}