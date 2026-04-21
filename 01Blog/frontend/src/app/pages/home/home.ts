import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // Ajout de Router
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';   // <--- AJOUTE CECI
import { MatBadgeModule } from '@angular/material/badge'; // <--- AJOUTE CECI
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post';
import { PostItemComponent } from '../post/post';
import { UserService } from '../../user/user';
import { NotificationService } from '../../services/notification/notification';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatSnackBarModule, PostItemComponent,MatMenuModule,MatBadgeModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  private postService = inject(PostService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  posts = signal<any[]>([]);
  isExpanded = signal<boolean>(false);
  notifications = signal<any[]>([]);
  
  // Logic Recherche
  searchQuery = signal<string>('');
  allUsers = signal<any[]>([]); // Liste chargée au init

  // 3. Propriété calculée pour le badge (matBadge)
  unreadCount = computed(() => 
    this.notifications().filter(n => !n.read).length
  );


  loadNotifications(userId: number): void {
  this.notificationService.getNotifications(userId).subscribe({
    next: (data : any) => {
      console.log('Format reçu du serveur :', data[0]); // <--- REGARDE ICI
      this.notifications.set(data);
    },
    error: (err : any) => console.error('Error:', err)
  });
}


  // Fonction appelée quand on ouvre le menu
onMenuOpened(): void {
  const userId = this.authService.getUserId();
  
  if (userId && this.unreadCount() > 0) {
    // Mise à jour LOCALE
    this.notifications.update(currentNotifs => 
      currentNotifs.map(n => ({
        ...n, 
        read: true // On utilise 'read' ici au lieu de 'isRead'
      }))
    );

    // Mise à jour SERVEUR
    this.notificationService.markAllAsRead(userId).subscribe();
  }
}



  // 5. Gérer le clic sur une notification
  goToPost(postId: number): void {
    if (postId) {
      console.log("Navigating to post ID:", postId);
      this.router.navigate(['/post', postId]);
      // Optionnel : marquer comme lu ici
    }
  }
  
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
    if (this.currentUserId ==  null){
      this.router.navigate(['login']);
      return;
      
    }
      this.loadNotifications(this.currentUserId);
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
       if (this.currentUserId ==  null){
      this.router.navigate(['login']);
      return;
      
    }
    console.log('---------------------------------------------',this.currentUserId);
    
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

  onLogout(): void {
  // 1. Appel du logout (nettoyage localStorage/Session)
  this.authService.logout();
  
  // 2. Notification optionnelle
  this.snackBar.open('Logged out successfully', 'Close', { duration: 2000 });
  
  // 3. Redirection vers la page de login
  this.router.navigate(['/login']);
}
}