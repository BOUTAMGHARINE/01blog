package com.example.blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.blog.entities.*;
import com.example.blog.repository.ReportRepository;;

@RestController
@RequestMapping("/api")


public class ReportController {

    @Autowired
    private ReportRepository reportRepository;
    // @Autowired
    // private Report report;

   @PostMapping("/newReport")
    public Report savereport(@RequestBody ReportDto report){
        Report report = new Report();
        
        reportRepository.save(report);
        return report;
    }




}
