package com.jobportal2.security;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private static final String SECRET =
            "jobportal2_secret_key_jobportal2_secret_key"; // >= 32 chars

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    // ✅ GENERATE TOKEN
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)
                )
                .signWith(key)
                .compact();
    }

    // ✅ EXTRACT ALL CLAIMS
    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // ✅ EXTRACT EMAIL (SUBJECT)
    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    // ✅ EXTRACT ROLE
    public String extractRole(String token) {
        return extractClaims(token).get("role", String.class);
    }
}

