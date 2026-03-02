import { Component, Input, OnInit, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field'; // Import obligatoire
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
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
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './post-comments.html',
  styleUrls: ['./post-comments.css']
})
export class PostCommentsComponent implements OnInit {
  @Input() postId!: number;
  
  // On utilise un setter pour transformer l'input en Signal dès qu'il arrive
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
    // Initialisation sécurisée de l'ID utilisateur
    this.currentUserId = this.authService.getUserId();
  }

  submitComment(input: HTMLInputElement): void {
    const text = input.value.trim();
    
    if (!text) return;

    if (!this.currentUserId) {
      console.error("Utilisateur non connecté");
      return;
    }

    this.commentService.addComment(this.postId, this.currentUserId, text).subscribe({
      next: (newComment) => {
        // Mise à jour réactive : on ajoute le nouveau commentaire à la liste
        this.commentsSignal.update(list => [...list, newComment]);
        input.value = ''; // On vide le champ de saisie
      },
      error: (err) => {
        console.error("Erreur lors de l'envoi du commentaire", err);
      }
    });
  }
}