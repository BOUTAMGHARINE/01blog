import { Component, Input, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { PostService } from '../../services/post';
import { ReactionService } from '../../services/reaction';
import { PostCommentsComponent } from '../post-comments/post-comments';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReportService } from '../../services/report/report';
import { AdminService } from '../../services/admin/admin';

@Component({
  selector: 'app-post-item',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule, 
    MatMenuModule, 
    PostCommentsComponent,
    MatSnackBarModule // Ajouté pour garantir que le snackBar fonctionne
  ],
  templateUrl: './post.html',
  styleUrls: ['./post.css']
})
export class PostItemComponent {
  private postService = inject(PostService);
  private snackBar = inject(MatSnackBar);
  private reactionService = inject(ReactionService);
  private reportService = inject(ReportService);
  private adminService = inject(AdminService);
  private cdr = inject(ChangeDetectorRef);

  @Input({ required: true }) post: any;
  @Input() currentUserId: number | null = null;
  @Input() isAdmin: boolean = false;

  @Output() postDeleted = new EventEmitter<number>();

  checkIfUserLiked(post: any): boolean {
    if (!this.currentUserId || !post?.reactions) return false;
    return post.reactions.some((r: any) => r.user && r.user.id === this.currentUserId);
  }

  toggleLike(post: any): void {
    if (!this.currentUserId) return;
    this.reactionService.toggleLike(post.id, this.currentUserId).subscribe({
      next: (updatedReactions: any[]) => {
        this.post = { ...this.post, reactions: updatedReactions };
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * CORRECTION : handleNewComment
   * Ce composant représente UN SEUL post. On ajoute le commentaire 
   * directement à l'objet "post" reçu en @Input.
   */
 handleNewComment(newComment: any) {
  // 1. On s'assure que le tableau existe
  const currentComments = this.post.comments ? [...this.post.comments] : [];

  // 2. On crée une NOUVELLE référence de l'objet post avec le NOUVEAU tableau
  // C'est cette "immuabilité" qui force le compteur HTML à se rafraîchir
  this.post = {
    ...this.post,
    comments: [...currentComments, newComment]
  };

  // 3. On force manuellement la vérification des changements
  this.cdr.detectChanges();
  
  console.log('New comment added locally. New count:', this.post.comments.length);
}

  updatePost(post: any, newContent: string) {
    const content = newContent.trim();
    const authorId = post.author?.id || this.currentUserId;

    if (!content) {
      this.snackBar.open('Content cannot be empty', 'Close', { duration: 2000 });
      return;
    }

    this.postService.updatePost(post.id, content, authorId).subscribe({
      next: () => {
        // Mise à jour locale du contenu
        this.post.content = content; 
        this.post.isEditing = false;
        this.cdr.detectChanges();
        this.snackBar.open('Post updated successfully', 'Close', { duration: 2000 });
      },
      error: (err) => {
        console.error('Error during update', err);
        if (err.status === 403 || err.status === 401) {
          this.snackBar.open("You do not have permission to edit this post", 'Close', { duration: 3000 });
        } else {
          this.snackBar.open("Error while modifying the post", 'Close', { duration: 3000 });
        }
      }
    });
  }

  onDeletePost(post: any): void {
    const postId = post.id;
    if (!confirm('Do you want to delete this post?')) return;

    // Logique Admin
    if (this.isAdmin && post.author?.id !== this.currentUserId) {
      this.adminService.deletePost(postId).subscribe({
        next: () => {
          this.postDeleted.emit(postId);
          this.snackBar.open('Post deleted successfully', 'Close', { duration: 2000 });
        },
        error: (err) => {
          console.error('Admin delete error', err);
          this.snackBar.open('Error deleting post', 'Close', { duration: 3000 });
        }
      });
      return;
    }

    // Logique Auteur
    const authorId = post.author?.id || this.currentUserId;
    if (!authorId) return;

    this.postService.deletePost(postId, authorId).subscribe({
      next: () => {
        this.postDeleted.emit(postId);
        this.snackBar.open('Post deleted successfully', 'Close', { duration: 2000 });
      },
      error: (err) => {
        this.snackBar.open('You are not allowed to delete this post', 'Close', { duration: 3000 });
      }
    });
  }

  openReportDialog(author: any): void {
    const reason = prompt(`Reason for reporting ${author.username}:`);
    if (reason && reason.trim()) {
      const report = {
        reportedProfileId: author.id,
        reporterId: this.currentUserId,
        reason: reason,
        timestamp: new Date()
      };

      this.reportService.sendReport(report).subscribe({
        next: () => {
          this.snackBar.open('Report sent to administrators', 'Close', { duration: 3000 });
        },
        error: (err) => {
          console.error('Failed to send report', err);
          this.snackBar.open('Error sending report', 'Close', { duration: 3000 });
        }
      });
    }
  }
}