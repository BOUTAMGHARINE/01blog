import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './not-found.html', // Assure-toi que le nom du fichier est correct
  styleUrls: ['./not-found.css']    // Assure-toi que le nom du fichier est correct
})
export class NotFound {
  // La classe était manquante ici !
}