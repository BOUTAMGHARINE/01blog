package com.example.blog.security;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

import java.nio.charset.StandardCharsets;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;

import lombok.extern.slf4j.Slf4j;

import java.util.*; 

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.blog.entities.User;

@Component
@Slf4j
public class JwtUtils  {

    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Value("${jwt.expiration}")
    private int Jwtexpiration;
    
    private SecretKey key ;
    
    @PostConstruct
    public void unit() {
     this.key =Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    } 

    public String generateToken(String username,User user){
    

        return Jwts.builder()
        .claim("role", user.getRole()) 
        .setSubject(username)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + Jwtexpiration)) // 1 jour
        .signWith(key, SignatureAlgorithm.HS256)
        .compact();

    }
    public String getRoleFromToken(String token) {
    return Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody()
            .get("role", String.class);
}
  

  public String getUserFromToken(String token) {
    return Jwts.parserBuilder()
            .setSigningKey(key)   
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
  }


 public boolean validateJwtToken(String token) {
    try {
        Jwts.parserBuilder()
            .setSigningKey(key)     // on passe la clé secrète ici
            .build()
            .parseClaimsJws(token); // si le token est invalide, ça throw une exception
        return true;
    } catch (Exception e) {
        log.error("JWT validation error: {}", e.getMessage());
    }
    return false;
}







}
