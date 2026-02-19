package com.example.blog.entities;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.*;

import org.hibernate.annotations.EmbeddableInstantiator;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;


@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data 
@ToString(exclude = "posts")

@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
     @JsonProperty(access =  JsonProperty.Access.WRITE_ONLY)

    private Long id;
    private String username;
    @Email(message = "Invalid email format")
    private String email;
    @JsonProperty(access =  JsonProperty.Access.WRITE_ONLY)
    private String password;
    private String role;
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL)
    
    @JsonIgnore
    private List<Post> posts;

} 
