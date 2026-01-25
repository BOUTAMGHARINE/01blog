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

@Entity
@AllArgsConstructor @NoArgsConstructor @Data


@Table(name = "reports")
public class Report {
  @Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;
    private Long reporter_id;
    private String reason;

    private  Long reported_id ;
    private LocalDateTime createdAt;

     @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

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