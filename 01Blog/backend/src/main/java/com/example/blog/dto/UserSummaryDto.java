package com.example.blog.dto;

import com.example.blog.entities.User;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserSummaryDto {
    private Long id;
    private String username;
    private String email;
    private String role;

    @JsonProperty("isBlocked")
    private boolean blocked;

    public static UserSummaryDto from(User user) {
        return new UserSummaryDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getIsBlocked());
    }
}
