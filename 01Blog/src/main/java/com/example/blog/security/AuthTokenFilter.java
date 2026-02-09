package com.example.blog.security;

import com.example.blog.security.JwtUtils;
import com.example.blog.service.CustomUserDetailsService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.parameters.P;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;

@Component
@Slf4j
public class AuthTokenFilter extends OncePerRequestFilter {

    public static final String BEARER_ = "Bearer ";
    @Autowired
    private JwtUtils jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {


                
        try {
                        System.out.println("JWT ==========================-------------------=== " );

            String jwt = parseJwt(request);
                                    System.out.println("JWT ============rrrrrrrrrrrrr==============-------------------=== " );

            if (jwt != null && jwtUtil.validateJwtToken(jwt)) {
                                        System.out.println("JWT ============hhhhhhhhhhhhhhhhh==============-------------------=== " );

                final String username = jwtUtil.getUserFromToken(jwt);
                final UserDetails userDetails =
                        userDetailsService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities());
                authenticationToken.setDetails(new WebAuthenticationDetailsSource()
                        .buildDetails(request));
                SecurityContextHolder.getContext()
                        .setAuthentication(authenticationToken);
            }
        } catch (Exception e) {
                                    System.out.println("JWTUUUUUUUUUUUUUUUUUu ==========================-------------------=== " );

            log.error("Cannot set user authentication: {}", e);
        }
        filterChain.doFilter(request, response); // needed for the next filter in the chain
    }

    private String parseJwt(HttpServletRequest request) {
                                System.out.println("JWT =========================uuuuuuuuuuuuuuuuuuu=-------------------=== " );

        String headerAuth = request.getHeader("Authorization");
        if (headerAuth != null && headerAuth.startsWith(BEARER_)) {
            return headerAuth.substring(BEARER_.length());
        }
                                        System.out.println("JWT =================11111111111111111111=-------------------=== " );

        return null;
    }
@Override
protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getServletPath();
    return path.equals("/api/signin") || path.equals("/api/signup") || path.equals("/swagger-ui");
}


}
