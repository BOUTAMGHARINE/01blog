package com.example.blog.entities;



import com.fasterxml.jackson.annotation.JsonIgnore;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;

import jakarta.validation.constraints.Email;

import java.util.HashSet;

import java.util.List;

import java.util.Set;

import lombok.Data;















@Entity
@Table(name = "users")
@Data
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
    
    @Column(nullable=false)
        boolean  isBlocked = false;
    
    // --- Relations avec les contenus ---

    // Ajout de orphanRemoval = true pour supprimer les posts si l'user est supprimé
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore 
    private List<Post> posts;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Comment> comments;

    // IMPORTANT : Ajoute cette liste pour gérer les réactions (l'erreur venait d'ici !)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Reaction> reactions;

    // --- Relations Auto-référencées (Follow System) ---

    // REMARQUE : On retire CascadeType.ALL ici. 
    // Si tu supprimes un utilisateur, tu ne veux pas supprimer les gens qu'il suit !
    @ManyToMany
    @JoinTable(
        name = "user_subscriptions",
        joinColumns = @JoinColumn(name = "follower_id"),
        inverseJoinColumns = @JoinColumn(name = "following_id")
    )
    @JsonIgnoreProperties({"following", "followers", "posts", "comments"})
    private Set<User> following = new HashSet<>();

    @ManyToMany(mappedBy = "following")
    @JsonIgnoreProperties({"following", "followers", "posts", "comments"})
    private Set<User> followers = new HashSet<>();

    // --- Méthodes de cycle de vie (PreRemove) ---
    
    /**
     * Cette méthode s'exécute juste avant la suppression de l'utilisateur.
     * Elle est CRUCIALE pour nettoyer les tables de jointure ManyToMany 
     * et éviter les violations de clés étrangères.
     */
    @PreRemove
    private void removeUserFromSubscriptions() {
        // On retire cet utilisateur de la liste "following" de tous ses followers
        for (User follower : followers) {
            follower.getFollowing().remove(this);
        }
        // On vide ses propres listes
        this.following.clear();
        this.followers.clear();
    }

    // ... tes méthodes toString, equals et hashCode restent identiques

   
    // Getter pour les abonnements
public Set<User> getFollowing() {
    return following;
}

// Setter pour les abonnements
public void setFollowing(Set<User> following) {
    this.following = following;
}

// Getter pour les abonnés
public Set<User> getFollowers() {
    return followers;
}

// Setter pour les abonnés
public void setFollowers(Set<User> followers) {
    this.followers = followers;
}
// public  boolean  getIsBlocked(){
//     return  isBlocked;
// }
// public void  setIsLocked() {
//     this.isBlocked =  true;
// }

    public boolean getIsBlocked() {
        return  this.isBlocked;
    }
}