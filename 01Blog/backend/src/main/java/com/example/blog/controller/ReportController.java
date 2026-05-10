package com.example.blog.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.blog.dto.ReportResponseDto;
import com.example.blog.entities.*;
import com.example.blog.repository.ReportRepository;
import com.example.blog.repository.UserRepository;



@RestController
@RequestMapping("/api/reports")
public class ReportController {
    
    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private UserRepository userRepository;

    // Tout le monde peut envoyer un rapport
    @PostMapping
    public ResponseEntity<Report> createReport(@RequestBody Report report) {
        return ResponseEntity.ok(reportRepository.save(report));
    }

   // Seul l'admin peut voir la liste
   @GetMapping
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public List<ReportResponseDto> getAllReports() {
    List<Report> reports = reportRepository.findAllByOrderByTimestampDesc();

    return reports.stream()
            .map(report -> ReportResponseDto.from(
                    report,
                    findUserById(report.getReporterId()),
                    findUserById(report.getReportedProfileId())))
            .toList();
}

@DeleteMapping("/{id}")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public ResponseEntity<String> deleteReport(@PathVariable Long id) {
    if (!reportRepository.existsById(id)) {
        return ResponseEntity.notFound().build();
    }

    reportRepository.deleteById(id);
    return ResponseEntity.ok("Report dismissed");
}

private User findUserById(Long userId) {
    return userId == null ? null : userRepository.findById(userId).orElse(null);
}
 }
