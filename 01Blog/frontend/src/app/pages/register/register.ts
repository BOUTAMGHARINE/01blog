import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
// Modules Material
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // 1. Importe ReactiveFormsModuleimport { Router } from '@angular/router';
//import { FormGroup } from '@angular/forms';
import { email } from '@angular/forms/signals';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './register.html', // Doit correspondre à ton fichier register.html
  styleUrls: ['./register.css']    // Doit correspondre à ton fichier register.css
})
export class RegisterComponent implements OnInit{ 
  registerForm!:FormGroup;
  errMessage : string | null =null;


  errorMessage : string | null = null;
  constructor(
    private fb:FormBuilder,
    private authService:AuthService,
    private router: Router
  ){}
  ngOnInit(): void {
         this.registerForm = this.fb.group({
  username: ['', [
    Validators.required, 
    Validators.minLength(3), 
    Validators.maxLength(40)
  ]],
  email: ['', [
    Validators.required, 
    Validators.email 
  ]],
  password: ['', [
    Validators.required, 
    Validators.minLength(8), // Plus sécurisé pour un register
    Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/) // Optionnel: force Majuscule + Chiffre
  ]],
  confirmPassword: ['', [Validators.required]]
}, );
  }
  


  onSubmit():void {
    if ( this.registerForm.valid){
      const registerData = this.registerForm.value;
      console.log('Attempting login with:', registerData);
      this.authService.register(registerData).subscribe({
        next: (res : any)=>{
          console.log("response",res);

        },
        error : (err:any)=>{
          console.log("error    ",err);
          
        }
      })
  


  }
} // Exportation correcte pour le Router
}