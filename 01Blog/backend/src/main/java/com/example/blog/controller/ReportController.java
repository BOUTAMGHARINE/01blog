package com.example.blog.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.blog.entities.*;
import com.example.blog.repository.ReportRepository;
import com.example.blog.dto.ReportDto;



@RestController
@RequestMapping("/api/reports")
public class ReportController {
    
    @Autowired
    private ReportRepository reportRepository;

    // Tout le monde peut envoyer un rapport
    @PostMapping
    public ResponseEntity<Report> createReport(@RequestBody Report report) {
        return ResponseEntity.ok(reportRepository.save(report));
    }

   // Seul l'admin peut voir la liste
    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<Report> getAllReports() {
        return reportRepository.findAllByOrderByTimestampDesc();
    }
 }