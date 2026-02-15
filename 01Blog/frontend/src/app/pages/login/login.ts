import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router'; // Assure-toi que 'Router' est bien là// Modules Material
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
  templateUrl: './login.html', // Doit correspondre exactement au nom de ton fichier
  styleUrls: ['./login.css']    // Doit correspondre exactement au nom de ton fichier
})
export class LoginComponent implements OnInit { 
  loginForm!:FormGroup;
  errorMessage : string | null = null;
constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService:AuthService
  ) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loginForm = this.fb.group({
      username:[``,[Validators.required,Validators.minLength(3),Validators.maxLength(40)]],
      password:[``,[Validators.required,Validators.minLength(3),Validators.maxLength(45)]]
    });
   
    
  }
   //lorsque clique sur le button
    onSubmit(): void{
      if (this.loginForm.valid){
        const loginData = this.loginForm.value;
       console.log('Attempting login with:', loginData);   
       this.authService.login(loginData).subscribe({
        next: (response) => {
       
          if (response.token) {
            localStorage.setItem('token',JSON.stringify(response.token))
          }
          console.log('Login successful!', response);
          this.router.navigate(['home']);
          
        },
      error: (err) => {
  console.log('Contenu de l erreur:', err);
  
  // On vérifie si le backend a envoyé un message précis, sinon on met un message par défaut
  if (err.error && err.error.details) {
    this.errorMessage = err.error.details; // Affiche 'Bad credentials'
  } else {
    this.errorMessage = 'An unexpected error occurred. Please try again.';
  }

  // Très important : forcer la détection de changement si ça ne s'affiche pas
  //this.cdr.detectChanges(); 
}
       })      // this.router("/")

      }else {
        console.error('invalide data:',this.loginForm.value );
            
      }

    }
  }
 // Exportation correcte pour le Router