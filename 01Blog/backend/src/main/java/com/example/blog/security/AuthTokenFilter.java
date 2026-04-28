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
import static java.lang.Math.log;
import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.example.blog.entities.User;
import com.example.blog.repository.UserRepository;

@Component
@Slf4j
public class AuthTokenFilter extends OncePerRequestFilter {

    public static final String BEARER_ = "Bearer ";
    @Autowired
    private JwtUtils jwtUtil;
@Autowired
    private CustomUserDetailsService userDetailsService;
    // @Autowired
    @Autowired
    private UserRepository userRepository;


//  @Autowired
//  private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

                if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
        response.setStatus(HttpServletResponse.SC_OK);
        return; // On s'arrête ici pour les requêtes de pré-vérification
    }


        try {
    String jwt = parseJwt(request);

    if (jwt != null && jwtUtil.validateJwtToken(jwt)) {
        final String username = jwtUtil.getUserFromToken(jwt);
        
        // On charge l'objet User de Spring
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        // Spring vérifie automatiquement la valeur de accountNonLocked
        if (!userDetails.isAccountNonLocked()) {
            System.out.println("Tentative de connexion sur un compte bloqué : {}"+ username);
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");
            response.getWriter().write("{\"message\": \"Your account is blocked\"}");
            return;
        }

//System.out.println(username+ "nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");


    // Extraire le rôle directement depuis le token
    final String role = jwtUtil.getRoleFromToken(jwt); // à créer
    List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role));

    UsernamePasswordAuthenticationToken authenticationToken =
            new UsernamePasswordAuthenticationToken(
                    username, // tu peux mettre username ici, pas besoin de UserDetails
                    null,
                    authorities);

    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
}
        } catch (Exception e) {

        }
        filterChain.doFilter(request, response); // needed for the next filter in the chain
    }

    private String parseJwt(HttpServletRequest request) {
                                // Remplace ton code de test par celui-ci temporairement :
java.util.Enumeration<String> headerNames = request.getHeaderNames();
while (headerNames.hasMoreElements()) {
    String name = headerNames.nextElement();
}

        String headerAuth = request.getHeader("authorization");//authorization
        if (headerAuth != null && headerAuth.startsWith(BEARER_)) {
            return headerAuth.substring(BEARER_.length());
        }

        return null;
    }
@Override
protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getServletPath();
    return path.equals("/api/signin") || path.equals("/api/signup") || path.equals("/swagger-ui");
}


}
