import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router'; // Pour les liens routerLink

// Modules Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar'; // Ajouté
import { MatDividerModule } from '@angular/material/divider'; // Ajouté

import { PostService } from '../../services/post';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, // Ajouté pour les menus
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatListModule,
    MatToolbarModule, // Ajouté
    MatDividerModule  // Ajouté
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  posts: any[] = [];
  isExpanded = false; // Ajouté : gère l'affichage des boutons de création

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getAllPosts().subscribe({
      next: (data) => {
        console.log("datadatadatadata",data);
        
        this.posts = data;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des posts", err);
      }
    });
  }
}