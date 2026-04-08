package com.example.blog.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @Email(message = "Invalid email format")
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private String role;

    // --- Relations avec les contenus ---

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL)
    @JsonIgnore 
    private List<Post> posts;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Comment> comments;

    // --- Relations Auto-référencées (Follow System) ---

    // Les personnes que l'utilisateur suit
    @ManyToMany(cascade=CascadeType.ALL)
    @JoinTable(
        name = "user_subscriptions",
        joinColumns = @JoinColumn(name = "follower_id"),
        inverseJoinColumns = @JoinColumn(name = "following_id")
        
    )
    @JsonIgnoreProperties({"following", "followers", "posts", "comments"})
    private Set<User> following = new HashSet<>();

    // Les personnes qui suivent l'utilisateur
    @ManyToMany(mappedBy = "following",cascade=CascadeType.ALL)
    @JsonIgnoreProperties({"following", "followers", "posts", "comments"})
    private Set<User> followers = new HashSet<>();

    // --- Sécurité Anti-Boucle Infinie ---

    /**
     * Surcharge manuelle du toString pour éviter que Lombok 
     * ne parcoure les listes circulaires (Set<User>).
     */
    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                '}';
    }

    /**
     * equals et hashCode manuels basés uniquement sur l'ID 
     * pour éviter les ConcurrentModificationException lors du rendu JSON.
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User user = (User) o;
        return id != null && id.equals(user.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}