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
  // Dans auth.service.ts
toggleFollow(targetUserId: number): Observable<any> {
  const currentUserId = this.getUserId();
return this.http.post(`http://localhost:8080/api/users/${targetUserId}/follow?currentUserId=${currentUserId}`, {});}

// Optionnel : Vérifier si on suit déjà quelqu'un
isFollowing(targetUserId: number): boolean {
  const user = this.currentUser();
  if (!user || !user.following) return false;
  
  // Utilise == au lieu de === pour éviter les conflits Type String/Number
  return user.following.some((u: any) => u.id == targetUserId);
}

// Dans auth.service.ts

// Ajoute cette méthode pour synchroniser le signal avec le serveur
refreshCurrentUser(): void {
  const userId = this.getUserId();
  if (userId) {
    this.http.get(`http://localhost:8080/api/users/${userId}`).subscribe(updatedUser => {
      this.currentUser.set(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser)); // Optionnel: garde le localstorage à jour
    });
  }
}

//change password


}