package com.example.blog.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.*;

import com.example.blog.entities.Notification;
import com.example.blog.repository.NotificationRepository;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private NotificationRepository notificationRepository;

    public NotificationController (NotificationRepository notificationRepository){
        this.notificationRepository = notificationRepository;
    }

    @PostMapping

    public Notification saveNotification(@RequestBody Notification notification){
        notificationRepository.save(notification);
        return notification;

    }

}
