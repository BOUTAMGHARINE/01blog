
package com.example.blog.dto;

import jakarta.annotation.Nonnull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;




@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class ReactionDto {
   
    @NonNull
    private long postId;
    
    @NonNull
    private  long userId;


}
