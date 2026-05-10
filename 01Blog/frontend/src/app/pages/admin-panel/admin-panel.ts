import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../services/admin/admin';
import { ReportService } from '../../services/report/report';
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
  private reportService = inject(ReportService);
  private snackBar = inject(MatSnackBar);

  selectedTabIndex = signal(0);
  users = signal<any[]>([]);
  posts = signal<any[]>([]);
  reports = signal<any[]>([]);

  ngOnInit(): void {
    this.loadUsers();
    this.loadAllPosts();
    this.loadReports();
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

  loadReports() {
    this.reportService.getReports().subscribe({
      next: (data) => this.reports.set(data),
      error: (err) => console.error("Erreur chargement reports", err)
    });
  }

  openReportsTab(): void {
    this.selectedTabIndex.set(2);
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

  deleteReportedUser(report: any): void {
    const reportedUser = report.reportedProfile;
    const reportedUserId = report.reportedProfileId;
    const username = reportedUser?.username || `#${reportedUserId}`;

    if (!reportedUserId || !confirm(`Delete reported user ${username}? This action is permanent.`)) return;

    this.adminService.deleteUser(reportedUserId).subscribe({
      next: (response) => {
        this.users.update(users => users.filter(user => user.id !== reportedUserId));
        this.reports.update(reports => reports.filter(item => item.reportedProfileId !== reportedUserId));
        this.snackBar.open(response, 'Close', { duration: 3000 });
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error deleting reported user', 'Close', { duration: 3000 });
      }
    });
  }

  toggleReportedUserBan(report: any): void {
    const reportedUser = report.reportedProfile;
    const reportedUserId = report.reportedProfileId;
    const isBlocked = !!reportedUser?.isBlocked;
    const newStatus = !isBlocked;
    const username = reportedUser?.username || `#${reportedUserId}`;
    const actionLabel = newStatus ? 'ban' : 'unban';

    if (!reportedUserId || !confirm(`Are you sure you want to ${actionLabel} ${username}?`)) return;

    this.adminService.updateUserStatus(reportedUserId, newStatus).subscribe({
      next: () => {
        this.users.update(users =>
          users.map(user => user.id === reportedUserId ? { ...user, isBlocked: newStatus } : user)
        );
        this.reports.update(reports =>
          reports.map(item =>
            item.reportedProfileId === reportedUserId
              ? {
                  ...item,
                  reportedProfile: item.reportedProfile
                    ? { ...item.reportedProfile, isBlocked: newStatus }
                    : item.reportedProfile
                }
              : item
          )
        );

        this.snackBar.open(
          `Reported user ${username} ${newStatus ? 'banned' : 'unbanned'} successfully`,
          'Close',
          { duration: 3000 }
        );
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error updating reported user status', 'Close', { duration: 3000 });
      }
    });
  }

  dismissReport(reportId: number): void {
    if (!confirm('Dismiss this report?')) return;

    this.reportService.deleteReport(reportId).subscribe({
      next: (response) => {
        this.reports.update(reports => reports.filter(report => report.id !== reportId));
        this.snackBar.open(response, 'Close', { duration: 3000 });
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error dismissing report', 'Close', { duration: 3000 });
      }
    });
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
