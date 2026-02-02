package com.example.blog.controller;

import com.example.blog.entities.*;
import com.example.blog.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private  UserRepository userRepository;

    // public UserController(UserRepository userRepository) {
    //     this.userRepository = userRepository;
    // }

    @PostMapping("/signin")
    public User saveUser(@RequestBody User user) {
        
         userRepository.save(user);
         return user;
    }
}
