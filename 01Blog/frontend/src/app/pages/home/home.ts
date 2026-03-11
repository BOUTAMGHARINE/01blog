import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // Ajout de Router
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post';
import { PostItemComponent } from '../post/post';
import { UserService } from '../../user/user';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatSnackBarModule, PostItemComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  private postService = inject(PostService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  posts = signal<any[]>([]);
  isExpanded = signal<boolean>(false);
  
  // Logic Recherche
  searchQuery = signal<string>('');
  allUsers = signal<any[]>([]); // Liste chargée au init
  
  // Signal calculé pour filtrer les utilisateurs en direct
  filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return [];
    return this.allUsers().filter(user => 
      user.username.toLowerCase().includes(query) && user.id !== this.currentUserId
    );
  });

  selectedFile: File | null = null;
  selectedMediaUrl: string | null = null;
  mediaType: 'image' | 'video' | null = null;
  currentUserId: number | null = null;

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserId();
    this.loadPosts();
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(users => this.allUsers.set(users));
  }

  goToProfile(userId: number): void {
    this.searchQuery.set(''); // Ferme la recherche
    this.router.navigate(['/profile', userId]); // Redirige vers profile/ID
  }

  isAdmin = computed(() => this.authService.getUserRole() === 'ROLE_ADMIN');

  loadPosts(): void {
    this.postService.getAllPosts().subscribe({
      next: (data) => this.posts.set(data),
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
    if (!this.currentUserId) return;
    const formData = new FormData();
    formData.append('authorId', this.currentUserId.toString());
    formData.append('content', input.value);
    if (this.selectedFile) formData.append('file', this.selectedFile);

    this.postService.createPost(formData).subscribe({
      next: (newPost) => {
        this.posts.update(allPosts => [newPost, ...allPosts]);
        this.cancelPost(input);
        this.snackBar.open('Post publié !', 'Fermer', { duration: 2000 });
      }
    });
  }

  onDeleteSuccess(postId: number): void {
    this.posts.update(list => list.filter(p => p.id !== postId));
    this.snackBar.open('Post supprimé', 'Fermer', { duration: 2000 });
  }
}