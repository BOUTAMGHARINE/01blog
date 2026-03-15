import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  FormBuilder, 
  ReactiveFormsModule, 
  Validators, 
  FormGroup, 
  AbstractControl, 
  ValidationErrors, 
  ValidatorFn 
} from '@angular/forms';

// Angular Material
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Validateur personnalisé pour comparer les deux mots de passe
 */
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const newPassword = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');

  if (!newPassword || !confirmPassword) return null;

  return newPassword.value === confirmPassword.value 
    ? null 
    : { mismatch: true };
};

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './change-password-dialog.html',
  styleUrl: './change-password-dialog.css'
})
export class ChangePasswordDialog {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ChangePasswordDialog>);

  // Définition du formulaire réactif
  passwordForm = this.fb.group({
    oldPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { 
    validators: passwordMatchValidator 
  });

  onSubmit(): void {
    if (this.passwordForm.valid) {
      // On récupère les valeurs
      const result = {
        oldPassword: this.passwordForm.value.oldPassword,
        newPassword: this.passwordForm.value.newPassword
      };
      
      // On renvoie les données au composant parent (ProfileComponent)
      this.dialogRef.close(result);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}