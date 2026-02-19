import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
// Modules Material
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm, AbstractControl, ValidationErrors } from '@angular/forms'; // 1. Importe ReactiveFormsModuleimport { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';






export class ConfirmPasswordMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    const controlTouched = !!(control && control.touched);
    const controlInvalid = !!(control && control.invalid);
    const mismatch = !!(form && form.hasError('mismatch'));

    // On affiche en rouge UNIQUEMENT si :
    // - Le champ lui-même est invalide (ex: vide) ET touché
    // - OU s'il y a un mismatch ET que l'utilisateur a fini de taper (touched)
    // - OU si le bouton submit a été cliqué
    return (controlInvalid && controlTouched) || (mismatch && controlTouched) || !!(isSubmitted && mismatch);
  }
}


















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
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.html', // Doit correspondre à ton fichier register.html
  styleUrls: ['./register.css']    // Doit correspondre à ton fichier register.css
})



export class RegisterComponent implements OnInit{ 

  confirmMatcher = new ConfirmPasswordMatcher();
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
    username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confPassword: ['', [Validators.required]]
  }, { 
    validators: passwordMatchValidator // <-- AJOUTE CETTE LIGNE ICI
  });
}
  


  onSubmit():void {
    console.log("Tentative de soumission..."); // <--- AJOUTE ÇA
    if ( this.registerForm.valid){
      const registerData = this.registerForm.value;

     // console.log('Attempting login with:', registerData);
      this.authService.register(registerData).subscribe({
        next: (res : any)=>{
          console.log("response",res);
          this.router.navigate(["login"])

        },
        error : (err:any)=>{
          console.log("error    ",err);
          
        }
      })
  


    }
} // Exportation correcte pour le Router

// Fonction pour comparer les mots de passe

}



// conf password
const passwordMatchValidator = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confPassword = control.get('confPassword');

  // Si l'un des deux n'a pas encore été touché ou est vide, on ne renvoie pas d'erreur 'mismatch'
  if (!password?.value || !confPassword?.value) {
    return null;
  }

  return password.value !== confPassword.value ? { mismatch: true } : null;
};