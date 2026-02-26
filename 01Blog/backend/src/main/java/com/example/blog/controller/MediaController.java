package  com.example.blog.controller;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/uploads")
@CrossOrigin("*") // Pour Angular
public class MediaController {

    private final String UPLOAD_DIR = "uploads";

    @GetMapping("/{filename:.+}")
    public Resource getFile(@PathVariable String filename) {
        Path filePath = Paths.get(UPLOAD_DIR).resolve(filename);
        return new FileSystemResource(filePath);
    }
}