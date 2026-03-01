package com.example.blog.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.blog.entities.Reaction;

public interface ReactionRepository extends JpaRepository<Reaction,Long>{

  void deleteByUserIdAndPostId(Long userId, Long postId);
  boolean existsByUserIdAndPostId(Long userId, Long postId);
      List<Reaction> findByPostId(Long postId);

    

}
