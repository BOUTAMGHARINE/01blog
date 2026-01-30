package com.example.blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.blog.entities.User;
import com.example.blog.repository.UserRepository;
import com.example.blog.security.JwtUtils;

@RestController
@RequestMapping("/api")
public class AuthenticationController {

    private AuthenticationManager authenticationManager;
    private UserRepository userRepository;
    private PasswordEncoder encoder;
    private JwtUtils jwtUtils;

    @Autowired
    public AuthenticationController(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            PasswordEncoder encoder,
            JwtUtils jwtUtils
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
    }


    // @PostMapping("/api/signin")
    // public String authenticateUser(@RequestBody User user) {
    //     System.out.println("user =================================================================== " + user);
    //     Authentication authentication = authenticationManager.authenticate(
    //             new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
    //                     user.getUsername(),
    //                     user.getPassword()
    //             )
    //     );

    //     final UserDetails userDetails = (UserDetails) authentication.getPrincipal();
    //     return jwtUtils.generateToken(userDetails.getUsername());
    // }
    @PostMapping("/signin")
    public String authenticateUser() {
    System.out.println("CONTROLLER CALLED ✅");
    return "OK";
}


    // @PostMapping("/signup")
    // public String registerUser(@RequestBody User user) {
    //     if (userRepository.existsByUsername(user.getUsername())) {
    //         return "User already exists!";
    //     }

    //     final User newUser = new User(
    //             null,
    //             user.getUsername(),
    //             encoder.encode(user.getPassword())
    //     );
    //     userRepository.save(newUser);
    //     return "User registered successfully!";
    // }
}