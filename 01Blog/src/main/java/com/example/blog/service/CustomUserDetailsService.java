package com.example.blog.service;

import java.util.Collection;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.blog.entities.*;

import com.example.blog.repository.UserRepository;

@Service 

public class CustomUserDetailsService implements UserDetailsService{
    

    private UserRepository userRepository;

    @Autowired

    public CustomUserDetailsService (UserRepository userRepository){
        this.userRepository =userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userRepository.findByUsername(username);
        
        if (user ==  null ){
            throw new UsernameNotFoundException("User not fond with username :" +username);
        }

        return new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
            Collections.EMPTY_LIST

        );
        
        
        
       
    }

    



}
