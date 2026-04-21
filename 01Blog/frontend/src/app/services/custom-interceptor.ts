import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem("token");
  const router = inject(Router); // On injecte le Router pour la redirection
  const authService = inject(AuthService);

  let authReq = req;
  
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si le serveur renvoie 401, cela signifie généralement que le JWT est expiré ou invalide
      if (error.status === 401) {
       console.warn("Session expired or invalid. Redirecting to login...");
        
        // 1. Nettoyer le localStorage
         authService.logout();
        // 2. Rediriger vers la page de login
        router.navigate(['/login']);
      }
      
      return throwError(() => error);
    })
  );
};