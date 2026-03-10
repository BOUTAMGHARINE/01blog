import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/profile';

  getMyProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }

  getUserPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/posts`);
  }

  // Si tu ajoutes la suppression côté utilisateur
  deleteMyPost(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/posts/${id}`, { responseType: 'text' });
  }
}