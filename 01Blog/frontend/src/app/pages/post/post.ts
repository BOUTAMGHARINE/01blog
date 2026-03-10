import { Component, Input, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { PostService } from '../../services/post';
import { ReactionService } from '../../services/reaction';
import { PostCommentsComponent } from '../post-comments/post-comments';

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
  private reactionService = inject(ReactionService);
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
    if (!newContent.trim()) return;
    this.postService.updatePost(post.id, newContent).subscribe({
      next: () => {
        this.post = { ...this.post, content: newContent, isEditing: false };
        this.cdr.detectChanges();
      }
    });
  }

  onDeletePost(postId: number): void {
    if (confirm('Voulez-vous supprimer ce post ?')) {
      this.postService.deletePost(postId).subscribe({
        next: () => this.postDeleted.emit(postId)
      });
    }
  }
}