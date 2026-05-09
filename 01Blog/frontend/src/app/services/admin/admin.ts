import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  deleteUser(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/users/${id}`, { responseType: 'text' });
  }

  getAllPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/posts`);
  }

 toggleHidePost(id: number): Observable<string> {
  return this.http.patch(`${this.apiUrl}/posts/${id}/toggle-hide`, {}, { responseType: 'text' });
}

  deletePost(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/posts/${id}`, { responseType: 'text' });
  }

  

  updateUserStatus(userId: number, isBlocked: boolean): Observable<void> {
    // On passe le booléen en paramètre de requête (?block=true)
    const params = new HttpParams().set('block', isBlocked);
    
    return this.http.put<void>(`${this.apiUrl}/users/${userId}/block`, {}, { params });
  }
}