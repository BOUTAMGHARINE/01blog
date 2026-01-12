package com.example.blog.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.blog.entitys.Notification;

public interface NotificationRepository extends JpaRepository<Notification,Long> {


}
