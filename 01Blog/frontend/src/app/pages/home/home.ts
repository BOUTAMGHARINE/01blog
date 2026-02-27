import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// Modules Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink,
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatListModule,
    MatToolbarModule,
    MatDividerModule
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {

  [x: string]: any;
  // Définition des Signals pour une réactivité immédiate
  posts = signal<any[]>([]);
  isExpanded = signal<boolean>(false);
  
  selectedFile: File | null = null;
  selectedMediaUrl: string | null = null;
  mediaType: 'image' | 'video' | null = null;

 constructor(
  private postService: PostService,
  private authService: AuthService // Injecte l'AuthService ici
) {}
  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getAllPosts().subscribe({
      next: (data) => {
        // Mise à jour du signal : l'affichage réagira instantanément
        this.posts.set(data);
      },
      error: (err) => console.error("Error loading posts", err)
    });
  }

  onFileSelected(event: any, type: 'image' | 'video'): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.mediaType = type;
      const reader = new FileReader();
      reader.onload = () => this.selectedMediaUrl = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  removeMedia(): void {
    this.selectedFile = null;
    this.selectedMediaUrl = null;
    this.mediaType = null;
  }

  cancelPost(input: HTMLTextAreaElement): void {
    input.value = '';
    this.removeMedia();
    this.isExpanded.set(false);
  }

  onPublish(input: HTMLTextAreaElement): void {
    
     const authorId = this.authService.getUserId();
     if (authorId === null || authorId === undefined) {
    console.error("Erreur : Impossible de trouver l'ID de l'auteur.",authorId);
    // Tu peux afficher une alerte ici pour dire à l'utilisateur de se reconnecter
    return;
  }

    const formData = new FormData();
    formData.append('authorId', authorId.toString()); // On ajoute l'ID ici
    formData.append('content', input.value);
    if (this.selectedFile) formData.append('file', this.selectedFile);

    this.postService.createPost(formData).subscribe({
      next: (newPost) => {
        // On ajoute le nouveau post en haut du signal
        this.posts.update(allPosts => [newPost, ...allPosts]);
        this.cancelPost(input);
      },
      error: (err) => console.error("Error publishing", err)
    });
  }

  toggleLike(post: any): void {
    // Logique locale pour le bouton like
    post.isLiked = !post.isLiked;
    post.likesCount = post.isLiked ? (post.likesCount || 0) + 1 : (post.likesCount || 0) - 1;
  }
}