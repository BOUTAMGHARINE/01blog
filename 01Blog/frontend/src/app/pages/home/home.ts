import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

// Modules Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';

import { PostService } from '../../services/post';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink,
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatListModule,
    MatToolbarModule,
    MatDividerModule
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  posts: any[] = [];
  
  // Variables pour la création de post
  isExpanded = false;
  selectedFile: File | null = null;
  selectedMediaUrl: string | null = null;
  mediaType: 'image' | 'video' | null = null;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getAllPosts().subscribe({
      next: (data) => {
        this.posts = data;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des posts", err);
      }
    });
  }

  // Gère la sélection de l'image ou de la vidéo
  onFileSelected(event: any, type: 'image' | 'video'): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.mediaType = type;

      // Création de la prévisualisation
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedMediaUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // Supprimer le média sélectionné
  removeMedia(): void {
    this.selectedFile = null;
    this.selectedMediaUrl = null;
    this.mediaType = null;
  }

  // Annuler la création
  cancelPost(input: HTMLTextAreaElement): void {
    input.value = '';
    this.removeMedia();
    this.isExpanded = false;
  }

  // Envoyer le post au backend
  onPublish(input: HTMLTextAreaElement): void {
    if (!input.value && !this.selectedFile) return;

    const formData = new FormData();
    formData.append('content', input.value);
    
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.postService.createPost(formData).subscribe({
      next: (newPost) => {
        // Ajouter le nouveau post en haut de la liste
        this.posts.unshift(newPost);
        // Réinitialiser le formulaire
        this.cancelPost(input);
      },
      error: (err) => console.error("Erreur lors de la publication", err)
    });
  }
}