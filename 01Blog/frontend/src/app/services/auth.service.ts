import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/';

  // On utilise un signal pour stocker l'utilisateur connecté
  currentUser = signal<any>(null);

  constructor(private http: HttpClient) { }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}signin`, data).pipe(
      tap(response => {
        console.log(response,"ghjhfhgfjh");
        
        // On stocke la réponse (qui contient l'ID, le username, etc.)
        this.currentUser.set(response);
        console.log("Utilisateur connecté :", response);
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}signup`, data);
  }

  // Méthode pour récupérer l'ID facilement
  getUserId(): number | null {
    const user = this.currentUser();
    console.log(this.currentUser);
    
    return user ? user.id : null;
  }
}