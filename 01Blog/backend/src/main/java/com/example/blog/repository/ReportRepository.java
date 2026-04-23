package com.example.blog.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.blog.entities.*;







public interface ReportRepository extends JpaRepository <Report,Long>{
  List<Report> findAllByOrderByTimestampDesc();

}
