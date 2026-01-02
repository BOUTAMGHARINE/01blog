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
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "notification")
public class Notification {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long sender_id;
    private Long receiver_id;
    private String type;
}
