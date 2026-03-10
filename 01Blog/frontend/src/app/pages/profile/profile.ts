import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

// Services et Composants
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post';
import { PostItemComponent } from '../post/post'; // 👈 Assure-toi que le chemin est correct

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatSnackBarModule,
    MatDividerModule,
    PostItemComponent // 👈 Obligatoire pour utiliser <app-post-item>
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  // Injection des services
  private authService = inject(AuthService);
  private postService = inject(PostService);
  private snackBar = inject(MatSnackBar);

  // Signals pour la réactivité
  user = signal<any>(null);
  posts = signal<any[]>([]);

  ngOnInit(): void {
    this.loadUserData();
    this.loadUserPosts();
  }

  /**
   * Récupère les informations de l'utilisateur connecté
   */
  loadUserData(): void {
    const userData = this.authService.currentUser(); // Ou une méthode similaire de ton AuthService
    this.user.set(userData);
  }

  /**
   * Récupère uniquement les posts de l'utilisateur
   */
  loadUserPosts(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      // Si tu as une méthode spécifique getUserPosts(userId), utilise-la.
      // Sinon, on filtre tous les posts par l'ID de l'auteur.
      this.postService.getAllPosts().subscribe({
        next: (allPosts) => {
          const userPosts = allPosts.filter((p: any) => p.author?.id === userId);
          this.posts.set(userPosts);
        },
        error: (err) => console.error("Erreur chargement posts profil", err)
      });
    }
  }

  /**
   * Action déclenchée quand un post est supprimé via le composant enfant
   */
  onDeleteSuccess(postId: number): void {
    // Mise à jour du signal pour retirer le post de la liste
    this.posts.update(currentPosts => 
      currentPosts.filter(p => p.id !== postId)
    );
    
    this.snackBar.open('Post supprimé avec succès', 'Fermer', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Redirection ou logique pour l'édition du profil
   */
  onEditProfile(): void {
    console.log("Édition du profil pour :", this.user()?.username);
    // Ici, tu peux ouvrir un Dialog ou naviguer vers une page settings
    this.snackBar.open('Fonctionnalité d\'édition bientôt disponible', 'OK');
  }
}