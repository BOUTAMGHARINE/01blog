package com.example.blog.security;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.blog.entities.User;

public class CustomUserDetails implements UserDetails {

    private Long id;
    private String username;
    private String role;
    private String password;
    private  boolean  islocked;

    public CustomUserDetails(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.role = user.getRole();
        this.password = user.getPassword();
        this.islocked = user.getIsBlocked();
    }

    public Long getId() { return id; }

    public String getRole() { return role; }

    @Override
    public String getUsername() { return username; }

    @Override
    public String getPassword() { return password; }
    
    public void  setIslocked( boolean value){
        this.islocked =value;
    }

    // autres méthodes obligatoires...
    
    @Override
    public boolean isAccountNonLocked() { 
        return !islocked;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}