import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';


import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordDialog } from '../change-password-dialog/change-password-dialog';
// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

// Services et Composants
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post';
import { PostItemComponent } from '../post/post';
import { UserService } from '../../user/user';

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
    PostItemComponent
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  public authService = inject(AuthService);
  private postService = inject(PostService);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);
private dialog = inject(MatDialog);
  // --- SIGNALS ---
  user = signal<any>(null); // Le profil affiché à l'écran
  posts = signal<any[]>([]);

  // --- COMPUTED ---
  // Ce signal se met à jour TOUT SEUL dès que 'user' ou 'authService.currentUser' change.
  isFollowingUser = computed(() => {
    const targetId = this.user()?.id;
    if (!targetId || targetId === this.authService.getUserId()) return false;
    return this.authService.isFollowing(targetId);
  });

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userIdFromUrl = params['id'];
      if (userIdFromUrl) {
        this.loadOtherUserProfile(Number(userIdFromUrl));
      } else {
        this.loadMyProfile();
      }
    });
  }

  loadMyProfile(): void {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.user.set(currentUser);
      this.loadUserPosts(currentUser.id);
    }
  }

  loadOtherUserProfile(userId: number): void {
    this.userService.getUserById(userId).subscribe({
      next: (userData) => {
        this.user.set(userData);
        this.loadUserPosts(userId);
      },
      error: () => this.snackBar.open('Utilisateur introuvable', 'Fermer', { duration: 3000 })
    });
  }

  loadUserPosts(userId: number): void {
    this.postService.getAllPosts().subscribe({
      next: (allPosts) => {
        const userPosts = allPosts.filter((p: any) => p.author?.id === userId);
        this.posts.set(userPosts);
      },
      error: (err) => console.error("Erreur chargement posts", err)
    });
  }

  onToggleFollow(): void {
    const targetUser = this.user();
    const currentUserId = this.authService.getUserId();

    if (!targetUser || !currentUserId) return;

    this.authService.toggleFollow(targetUser.id).subscribe({
      next: () => {
        // 1. On rafraîchit le profil visité (pour le compteur followers)
        this.userService.getUserById(targetUser.id).subscribe(updatedTarget => {
          this.user.set(updatedTarget);
        });

        // 2. On rafraîchit l'utilisateur connecté (pour le bouton follow via computed)
        // La méthode refreshCurrentUser doit être dans ton AuthService
        this.authService.refreshCurrentUser();

        this.snackBar.open("Mise à jour réussie", 'OK', { duration: 2000 });
      },
      error: (err) => {
        console.error("Erreur toggle follow", err);
        this.snackBar.open("Erreur de synchronisation", "OK");
      }
    });
  }

  onDeleteSuccess(postId: number): void {
    this.posts.update(currentPosts => currentPosts.filter(p => p.id !== postId));
  }

  onEditProfile(): void {
    this.snackBar.open('Édition bientôt disponible', 'OK', { duration: 2000 });
  }

  openChangePasswordDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialog, {
      width: '400px',
      disableClose: true 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        
        // 'result' contient { oldPassword, newPassword }
        console.log('Données reçues du dialogue:', result);
       this.updateUserPassword(result);
      }
    });

  }

  updateUserPassword(passwords: any): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.snackBar.open('Erreur : Utilisateur non identifié', 'OK');
      return;
    }

    // On prépare l'objet à envoyer au serveur
    const payload = {
      userId: userId,
      oldPassword: passwords.oldPassword,
      newPassword: passwords.newPassword
    };
  

    // On appelle le service (assure-toi que cette méthode existe dans ton UserService)
    this.userService.updatePassword(payload).subscribe({
      next: (response) => {
        this.snackBar.open('Password updated successfully!', 'Fermer', { duration: 3000 });
      },
      error: (err) => {
        console.log('Erreur backend:', err);
    
    // Récupère le message du backend ou utilise un message par défaut
      const message = err.error?.message || 'Incorrect current password !!!';
        this.snackBar.open(message, 'Fermer', { duration: 3000 });
      }
    });
  }



  // Delete account 

onDeactivateAccount(): void {
  const confirmDeletion = confirm('Are you sure you want to deactivate your account? This action is permanent.');
  
  if (confirmDeletion) {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.snackBar.open('Account deactivated successfully.', 'Close', { duration: 3000 });
        // Déconnexion automatique après suppression
       // this.authService.logout(); 
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error deactivating account.', 'Close', { duration: 3000 });
      }
    });
  }
}


  }