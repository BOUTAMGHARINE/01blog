package com.example.blog.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.blog.entities.Post;
import com.example.blog.entities.User;
import com.example.blog.repository.PostRepository;
import com.example.blog.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PostRepository postRepository;


    public User LoadUserByUsername(String username) {
        User user = userRepository.findByUsername(username);
        return user;
    }

    public  List<Post> posts(){
        List<Post> posts =  postRepository.findAll();
        return posts;
    }
    
}
