package com.example.blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.blog.entities.*;
import com.example.blog.repository.ReportRepository;
import com.example.blog.dto.ReportDto;

@RestController
@RequestMapping("/api")


public class ReportController {

    @Autowired
    private ReportRepository reportRepository;
    // @Autowired
    // private Report report;

   @PostMapping("/newReport")
    public Report savereport(@RequestBody ReportDto dto){
      Report report = new Report();
      report.setReporter_id(dto.getReporterId());
      report.setReason(dto.getReason());
      report.setReported_id(dto.getReportedId());
        
        reportRepository.save(report);
        return report;
    }

/*   private Long reporterId;
    private String reason;
    private Long reportedId; */


}
