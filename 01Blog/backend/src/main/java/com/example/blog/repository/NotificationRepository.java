package com.example.blog.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.blog.entities.Notification;






public interface NotificationRepository extends JpaRepository<Notification,Long> {

 boolean existsById(long id);
}
