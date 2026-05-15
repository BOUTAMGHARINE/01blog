package com.example.blog.controller;

import jakarta.servlet.http.HttpServletRequest;
// LE SEUL IMPORT CORRECT POUR SPRING BOOT 3.x
import org.springframework.boot.web.servlet.error.ErrorController; 
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaErrorController implements ErrorController {

    @RequestMapping("/error")
    public ResponseEntity<Resource> handleError(HttpServletRequest request) {
        try {
                        System.out.println("------------------------------------------------------------------");

            // Tentative de chargement de l'index
            Resource index = new ClassPathResource("static/index.html");

            if (!index.exists()) {
                System.out.println("ERREUR : index.html introuvable dans static/");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            System.out.println("--- Route inconnue détectée : Renvoi de l'index avec statut 404 ---");
            
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .contentType(MediaType.TEXT_HTML)
                    .body(index);
        } catch (Exception e) {
            System.err.println("Exception dans SpaErrorController : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}