import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { 
  ReactiveFormsModule, 
  FormBuilder, 
  FormGroup, 
  Validators, 
  FormControl, 
  FormGroupDirective, 
  NgForm, 
  AbstractControl, 
  ValidationErrors 
} from '@angular/forms';

// Material Modules
import { ErrorStateMatcher } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../services/auth.service';

/** Matcher pour afficher l'erreur de confirmation uniquement au bon moment */
export class ConfirmPasswordMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    const controlTouched = !!(control && control.touched);
    const mismatch = !!(form && form.hasError('mismatch'));
    return !!(control && control.invalid && controlTouched) || (mismatch && controlTouched) || !!(isSubmitted && mismatch);
  }
}

/** Validateur anti-espaces */
const noWhitespaceValidator = (control: AbstractControl): ValidationErrors | null => {
  const isWhitespace = (control.value || '').trim().length === 0;
  return !isWhitespace ? null : { 'required': true };
};

/** Validateur de correspondance des mots de passe */
const passwordMatchValidator = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confPassword = control.get('confPassword');
  if (!password?.value || !confPassword?.value) return null;
  return password.value !== confPassword.value ? { mismatch: true } : null;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatCardModule, MatFormFieldModule, 
    MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  confirmMatcher = new ConfirmPasswordMatcher();
  hidePassword = true; // Pour afficher/masquer le mot de passe
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [noWhitespaceValidator, Validators.minLength(6), Validators.maxLength(40)]],
      email: ['', [noWhitespaceValidator, Validators.email]],
      password: ['', [noWhitespaceValidator, Validators.minLength(8)]],
      confPassword: ['', [noWhitespaceValidator]]
    }, { validators: passwordMatchValidator });
  }

  onSubmit(): void {
  // On réinitialise le message d'erreur à chaque tentative
  this.errorMessage = null;

  if (this.registerForm.valid) {
    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        console.log("Success", res);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error("Backend Error:", err);
        // Si ton backend renvoie un message précis (ex: "Email already exists")
        // On vérifie si c'est du texte brut ou un objet JSON
        this.errorMessage = typeof err.error === 'string' ? err.error : "An error occurred during registration.";
          console.error("errzeizudu:", this.errorMessage);
      }
    });
  }
}
}