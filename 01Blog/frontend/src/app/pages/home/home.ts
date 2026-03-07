import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// Modules Material
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post';
import { ReactionService } from '../../services/reaction';
import { PostCommentsComponent } from '../post-comments/post-comments';

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
    MatDividerModule,
    PostCommentsComponent,
    MatMenuModule
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
  currentUserId: number | null = null;

 constructor(
  private postService: PostService,
  private authService: AuthService, // Injecte l'AuthService ici
  private reactionService: ReactionService // Nouvel inject
) {}
  ngOnInit(): void {
    this.loadPosts();
    this.currentUserId = this.authService.getUserId();
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
// Récupère l'ID de l'utilisateur connecté au démarrage

/**
 * Vérifie si l'utilisateur actuel a liké ce post
 */
checkIfUserLiked(post: any): boolean {
  if (!this.currentUserId || !post.reactions) return false;
  
  // On cherche si un objet dans le tableau 'reactions' possède l'id de l'user actuel
  return post.reactions.some((reaction: any) => reaction.user.id === this.currentUserId);
}

/**
 * Action lors du clic sur le bouton Like
 */
// Récupère l'ID de l'utilisateur connecté au démarrage

/**
 * Vérifie si l'utilisateur actuel a liké ce post
 */

/**
 * Action lors du clic sur le bouton Like
 */
toggleLike(post: any): void {
  if (!this.currentUserId) return;

  this.reactionService.toggleLike(post.id, this.currentUserId).subscribe({
    next: (updatedReactions: any[]) => {
      // On met à jour le signal "posts" de manière réactive
      this.posts.update(allPosts => 
        allPosts.map(p => {
          if (p.id === post.id) {
            // On retourne une copie du post avec les nouvelles réactions envoyées par le serveur
            return { ...p, reactions: updatedReactions };
          }
          return p;
        })
      );
    },
    error: (err) => console.error("Erreur lors du like", err)
  });
}
// Active le mode édition pour un post précis
startEdit(post: any) {
  post.isEditing = true;
}

// Envoie la mise à jour au serveur
updatePost(post: any, newContent: string) {
  console.log("hahowa dkhel");
  
  if (!newContent.trim()) return;

  this.postService.updatePost(post.id, newContent).subscribe({
    next: (updatedPost) => {
      this.posts.update(allPosts => 
        allPosts.map(p => p.id === post.id ? { ...p, content: newContent, isEditing: false } : p)
      );
    },
    error: (err) => console.error("Update failed", err)
  });
}

// Ajoute cette méthode pour corriger l'erreur TS4111
  onDeletePost(postId: number): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(postId).subscribe({
        next: () => {
          // Mise à jour de la liste locale
          this.posts.update(list => list.filter(p => p.id !== postId));
        },
        error: (err) => console.error("Delete failed", err)
      });
    }
  }
}