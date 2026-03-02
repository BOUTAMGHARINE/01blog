import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules Angular Material complets
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AuthService } from '../../services/auth.service';
import { CommentService } from '../../services/comment';

@Component({
  selector: 'app-post-comments',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    MatDividerModule, 
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './post-comments.html',
  styleUrls: ['./post-comments.css']
})
export class PostCommentsComponent implements OnInit {
  @Input() postId!: number;
  
  @Input() set comments(value: any[]) {
    this.commentsSignal.set(value || []);
  }

  commentsSignal = signal<any[]>([]);
  currentUserId: number | null = null;

  constructor(
    private commentService: CommentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserId();
  }

  submitComment(input: HTMLInputElement): void {
    const text = input.value.trim();
    if (!text || !this.currentUserId) return;

    this.commentService.addComment(this.postId, this.currentUserId, text).subscribe({
      next: (newComment) => {
        this.commentsSignal.update(list => [...list, newComment]);
        input.value = ''; 
      },
      error: (err) => console.error("Erreur commentaire", err)
    });
  }
}