import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProfileService } from '../../services/profile/profile';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  private profileService = inject(ProfileService);
  private snackBar = inject(MatSnackBar);

  user = signal<any>(null);
  posts = signal<any[]>([]);

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    // On récupère le profil
    this.profileService.getMyProfile().subscribe({
      next: (u) => this.user.set(u),
      error: () => this.snackBar.open('Error loading profile', 'OK')
    });

    // On récupère les posts
    this.profileService.getUserPosts().subscribe({
      next: (p) => this.posts.set(p),
      error: () => this.snackBar.open('Error loading posts', 'OK')
    });
  }

  onDeletePost(id: number) {
    if (confirm('Permanently delete this post?')) {
      this.profileService.deleteMyPost(id).subscribe({
        next: () => {
          this.posts.update(list => list.filter(p => p.id !== id));
          this.snackBar.open('Post deleted', 'OK', { duration: 2000 });
        }
      });
    }
  }

  onEditProfile() {
    // Logique pour ouvrir un formulaire d'édition
    this.snackBar.open('Edit Profile is not implemented yet', 'OK');
  }
}