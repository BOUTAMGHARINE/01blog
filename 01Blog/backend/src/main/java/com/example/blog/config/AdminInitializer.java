package com.example.blog.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.blog.entities.User;
import com.example.blog.repository.UserRepository;

@Configuration
public class AdminInitializer {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initAdmin() {
        return new CommandLineRunner() {
            @Override
            public void run(String[] args) throws Exception {
                if (userRepository.findByUsername("admin2") == null) {
                    
                    User admin = new User();
                    admin.setUsername("admin2");
                    admin.setPassword(passwordEncoder.encode("admin123"));
                    admin.setRole("ROLE_ADMIN");
                    admin.setEmail("admin2@gmail.com");
                            
                            userRepository.save(admin);
                }
            }
        };
    }
}