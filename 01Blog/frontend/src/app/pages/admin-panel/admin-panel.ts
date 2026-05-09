import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../services/admin/admin';
@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule, 
    MatTabsModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    MatSnackBarModule, 
    RouterLink
  ],
  templateUrl: './admin-panel.html',
  styleUrls: ['./admin-panel.css']
})
export class AdminPanelComponent implements OnInit {
  // On utilise inject() ou le constructeur, mais restons cohérents avec ton service
  private adminService = inject(AdminService);
  private snackBar = inject(MatSnackBar);

  users = signal<any[]>([]);
  posts = signal<any[]>([]);

  ngOnInit(): void {
    this.loadUsers();
    this.loadAllPosts();
  }

  loadUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (data) => this.users.set(data),
      error: (err) => console.error("Erreur chargement users", err)
    });
  }

  loadAllPosts() {
    this.adminService.getAllPosts().subscribe({
      next: (data) => this.posts.set(data),
      error: (err) => console.error("Erreur chargement posts", err)
    });
  }

  deleteUser(userId: number) {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      this.adminService.deleteUser(userId).subscribe({
        next: (response) => {
          this.users.update(u => u.filter(user => user.id !== userId));
          this.snackBar.open(response, 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  onToggleHide(post: any) {
  this.adminService.toggleHidePost(post.id).subscribe({
    next: (response) => {
      this.posts.update(allPosts => 
        allPosts.map(p => p.id === post.id ? { ...p, hidden: !p.hidden } : p)
      );
      this.snackBar.open(response, 'OK', { duration: 3000 });
    },
    error: (err) => console.error("Erreur toggle hide", err)
  });
}

  deletePost(postId: number) {
    if (confirm('Supprimer ce contenu définitivement ?')) {
      this.adminService.deletePost(postId).subscribe({
        next: (response) => {
          this.posts.update(p => p.filter(post => post.id !== postId));
          this.snackBar.open(response, 'OK', { duration: 3000 });
        }
      });
    }
  }


  // Ton signal qui contient la liste des utilisateurs

toggleBan(user: any): void {
    const newStatus = !user.isBlocked;
    const actionLabel = newStatus ? 'ban' : 'unban';

    // Confirmation dialog
    if (confirm(`Are you sure you want to ${actionLabel} user ${user.username}?`)) {
      
      this.adminService.updateUserStatus(user.id, newStatus).subscribe({
        next: () => {
          // Reactive update of the signal
          this.users.update(allUsers => 
            allUsers.map(u => u.id === user.id ? { ...u, isBlocked: newStatus } : u)
          );

          this.snackBar.open(
            `User ${user.username} ${newStatus ? 'banned' : 'unbanned'} successfully`, 
            'Close', 
            { duration: 3000 }
          );
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open("Error updating user status", "Close", { duration: 3000 });
        }
      });
    }
  }
}


