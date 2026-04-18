package com.example.blog.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.blog.entities.Notification;






public interface NotificationRepository extends JpaRepository<Notification,Long> {

 boolean existsById(long id);
 List<Notification> findByRecipientIdOrderByCreatedAtDesc(Long userId);
}
