package com.example.blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.blog.dto.SignupRequest;
import com.example.blog.entities.User;
import com.example.blog.repository.UserRepository;
import com.example.blog.security.JwtUtils;

import jakarta.validation.Valid;

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


    @PostMapping("/signup")
   public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already in use");
    }
        if (userRepository.existsByUsername(request.getUsername())) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already in use");
    }

    if (!request.getPassword().equals(request.getConfPassword())){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The password confirmation is incorrect");
    }

    User user = new User();
    user.setEmail(request.getEmail().trim().toLowerCase());
    user.setUsername(request.getUsername());
    user.setPassword(encoder.encode(request.getPassword()));
    user.setRole("user");

    userRepository.save(user);

    return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully!");
}


}