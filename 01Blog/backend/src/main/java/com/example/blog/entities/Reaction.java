package com.example.blog.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor @AllArgsConstructor @Data
@Table(
    name = "reactions",
    uniqueConstraints = @UniqueConstraint(columnNames = {"post_id", "user_id"})
)

public class Reaction {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(name = "post_id", nullable = false  , referencedColumnName = "id")
    @JsonBackReference
    private Post post;
    @ManyToOne(cascade=CascadeType.ALL)
    @JoinColumn(name="user_id",nullable = false ,referencedColumnName = "id") 
    private User user;
}
