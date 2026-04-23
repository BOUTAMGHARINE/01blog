package com.example.blog.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.*;

import jakarta.persistence.Column;

@Entity
@AllArgsConstructor @NoArgsConstructor @Data


@Table(name = "reports")
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long reportedProfileId; // L'ID de l'utilisateur signalé
    private Long reporterId;        // L'ID de celui qui signale
    
    @Column(nullable = false)
    private String reason;          // Motif du signalement
    
    private LocalDateTime timestamp = LocalDateTime.now();
    
    private boolean processed = false; // Pour que l'admin puisse marquer comme "traité"
}
/*
@Entity
public class Report {

    @Id
    @GeneratedValue
    private Long id;

    private String reason;


    @ManyToOne
    private User reportedUser;

    @ManyToOne
    private User reporter;

} */