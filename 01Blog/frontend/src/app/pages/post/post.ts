import { Component, Input, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { PostService } from '../../services/post';
import { ReactionService } from '../../services/reaction';
import { PostCommentsComponent } from '../post-comments/post-comments';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Importe le service et le module
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
    PostCommentsComponent
  ],
  templateUrl: './post.html',
  styleUrls: ['./post.css']
})
export class PostItemComponent {
  private postService = inject(PostService);
  private snackBar = inject(MatSnackBar);
  private reactionService = inject(ReactionService);
  private reportService = inject(ReportService)
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
        // Mise à jour immuable pour forcer le changement de couleur du bouton
        this.post = { ...this.post, reactions: updatedReactions };
        this.cdr.detectChanges();
      }
    });
  }

  // Cette fonction incrémente le compteur automatiquement
  handleNewComment(newComment: any): void {
    const updatedComments = this.post.comments ? [...this.post.comments, newComment] : [newComment];
    // On remplace l'objet post pour que {{ post.comments?.length }} se mette à jour
    this.post = { ...this.post, comments: updatedComments };
    this.cdr.detectChanges();
  }

  updatePost(post: any, newContent: string) {
    const content = newContent.trim();
    const authorId = post.author?.id || this.currentUserId;
    if (!content || !authorId) return;

    console.log('Updating post', {
      postId: post.id,
      postAuthorId: post.author?.id,
      currentUserId: this.currentUserId,
      sentAuthorId: authorId
    });

    this.postService.updatePost(post.id, content, authorId).subscribe({
      next: () => {
        this.post = { ...this.post, content, isEditing: false };
        this.cdr.detectChanges();
        this.snackBar.open('Post updated successfully', 'Close', { duration: 2000 });
      },
      error: (err) => {
        console.error('Error updating post', err);
        this.snackBar.open('You are not allowed to edit this post', 'Close', { duration: 3000 });
      } 
    });
  }

  onDeletePost(post: any): void {
    const postId = post.id;
    const authorId = post.author?.id || this.currentUserId;

    if (confirm('Voulez-vous supprimer ce post ?')) {
      if (this.isAdmin && post.author?.id !== this.currentUserId) {
        this.adminService.deletePost(postId).subscribe({
          next: () => {
            this.postDeleted.emit(postId);
            this.snackBar.open('Post deleted successfully', 'Close', { duration: 2000 });
          },
          error: (err) => {
            console.error('Error deleting post as admin', err);
            this.snackBar.open('Error deleting post', 'Close', { duration: 3000 });
          }
        });
        return;
      }

      if (!authorId) return;

      this.postService.deletePost(postId, authorId).subscribe({
        next: () => {
          this.postDeleted.emit(postId);
          this.snackBar.open('Post deleted successfully', 'Close', { duration: 2000 });
        },
        error: (err) => {
          console.error('Error deleting post', err);
          this.snackBar.open('You are not allowed to delete this post', 'Close', { duration: 3000 });
        }
      });
    }
  }

  /****************************************************Report**********************************************************/

 openReportDialog(author: any): void {
  const reason = prompt(`Reason for reporting ${author.username}:`);
  
  if (reason && reason.trim()) {
    const report = {
      reportedProfileId: author.id,
      reporterId: this.currentUserId, // Assure-toi d'avoir récupéré l'ID de l'utilisateur courant
      reason: reason,
      timestamp: new Date()
    };

    this.reportService.sendReport(report).subscribe({
      next: () => {
        // Maintenant, cette ligne fonctionnera parfaitement !
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
