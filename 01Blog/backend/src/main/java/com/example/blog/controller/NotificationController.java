package com.example.blog.controller;

import com.example.blog.entities.Notification;
import com.example.blog.repository.NotificationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:4200") // Indispensable pour que le frontend puisse appeler l'API
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    /**
     * Récupère toutes les notifications d'un utilisateur spécifique.
     * Ton service Angular appelle : /api/notifications/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public List<Notification> getNotificationsByUserId(@PathVariable Long userId) {
        // Cette méthode doit être déclarée dans ton NotificationRepository
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Marquer une notification comme lue (Utile pour le badge de notification)
     */
    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    @PostMapping
    public Notification saveNotification(@RequestBody Notification notification) {
        return notificationRepository.save(notification);
    }

    @PutMapping("/user/{userId}/read-all")


    public void markAllAsRead(@PathVariable Long userId) {
    List<Notification> notifications = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
    notifications.forEach(n -> n.setRead(true));
    notificationRepository.saveAll(notifications);
}
}