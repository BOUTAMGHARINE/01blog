import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
}