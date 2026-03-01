package  com.example.blog.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.blog.entities.Post;
import com.example.blog.entities.User;
import  com.example.blog.repository.ReactionRepository;

@Service
public class ReactionService {

    @Autowired
    private ReactionRepository reactionRepository;

    public boolean hasUserReactedToPost(Post post, User user) {
        return reactionRepository.existsByUserIdAndPostId(user.getId(), post.getId());
    }
}
