package com.example.blog.dto;

import java.util.Comparator;
import java.util.List;
import java.util.Set;

import com.example.blog.entities.User;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponseDto {
    private Long id;
    private String username;
    private String email;
    private String role;

    @JsonProperty("isBlocked")
    private boolean blocked;

    private List<UserSummaryDto> following;
    private List<UserSummaryDto> followers;

    public static UserResponseDto from(User user) {
        return new UserResponseDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getIsBlocked(),
                toSummaries(user.getFollowing()),
                toSummaries(user.getFollowers()));
    }

    private static List<UserSummaryDto> toSummaries(Set<User> users) {
        if (users == null) {
            return List.of();
        }

        return users.stream()
                .map(UserSummaryDto::from)
                .sorted(Comparator.comparing(
                        UserSummaryDto::getUsername,
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)))
                .toList();
    }
}
