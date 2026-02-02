package com.example.blog.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignupRequest {
    @NotBlank
    @Email
    @Size(min =7,max=100)
    @NotBlank(message = "Email is required")

    private String email;

    @NotBlank(message ="username id required")
    @Size(min = 6,max = 20)
    private String username;

    @NotBlank(message = "password is required")
    @Size(min = 6 , max = 100)
    private String password;

    @NotBlank
    @Size(min = 6, max = 100)
    private String confPassword;
    private String role;

    // getters / setters
}
