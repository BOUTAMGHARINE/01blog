import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/';

  // On utilise un signal pour stocker l'utilisateur connecté
  currentUser = signal<any>(this.getSavedUser());
  private getSavedUser() {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  }

  constructor(private http: HttpClient) { }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}signin`, data).pipe(
      tap((response : any) => {
        console.log(response,"--------------------------------------------------------");
        
        // On stocke la réponse (qui contient l'ID, le username, etc.)
        this.currentUser.set(response.user);
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
    console.log(this.currentUser,"ghgjhgjgjgjggh");
    
    return user ? user.id : null;
  }
  getUserRole():String | null{
    const user = this.currentUser();
    return user ? user.role :null;
  }
}