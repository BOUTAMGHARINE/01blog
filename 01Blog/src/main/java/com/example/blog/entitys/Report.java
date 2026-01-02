package com.example.blog.entitys;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor @NoArgsConstructor @Data
@Table(name = "reports")
public class Report {
  @Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;
    private Long reporter_id;
    private  long report ;
    private String content;


}
