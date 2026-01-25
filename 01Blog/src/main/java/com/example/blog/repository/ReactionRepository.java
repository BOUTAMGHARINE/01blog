package com.example.blog.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.blog.entities.Reaction;

public interface ReactionRepository extends JpaRepository<Reaction,Long>{

    

}
