import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit { 
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  hidePassword = true; // <--- AJOUTÉ : Pour gérer l'affichage du mot de passe

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(45)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.errorMessage = null; // Reset de l'erreur au début
      const loginData = this.loginForm.value;
      
      this.authService.login(loginData).subscribe({
        next: (response) => {
          if (response.token) {
            // Bonne pratique : stocker le token en string pure (le backend renvoie souvent déjà un string)
            localStorage.setItem('token', response.token);
            localStorage.setItem('user',JSON.stringify(response.user));
          }
          console.log('Login successful!');
          this.router.navigate(['home']);
        },
        error: (err) => {
          console.error('Login error:', err);
          // Gestion dynamique du message d'erreur backend
          if (err.error && err.error.details) {
            this.errorMessage = err.error.details;
          } else if (err.status === 401) {
            this.errorMessage = 'Identifiants incorrects.';
          } else {
            this.errorMessage = 'Une erreur est survenue lors de la connexion.';
          }
        }
      });
    }
  }
}