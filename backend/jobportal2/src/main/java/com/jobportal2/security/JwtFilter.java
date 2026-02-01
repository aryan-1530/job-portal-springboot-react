package com.jobportal2.security;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        // ✅ ACCEPT ONLY CORRECT FORMAT
        if (header != null && header.startsWith("Bearer ")) {

            String token = header.substring(7).trim();

            // ✅ HARD VALIDATION: JWTs NEVER contain spaces
            if (!token.contains(" ")) {
                try {
                    String email = jwtUtil.extractEmail(token);

                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(
                                    email,
                                    null,
                                    null
                            );

                    auth.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    SecurityContextHolder.getContext().setAuthentication(auth);

                } catch (Exception e) {
                    System.out.println("Invalid JWT: " + e.getMessage());
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
