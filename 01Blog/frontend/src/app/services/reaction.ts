import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {
  private baseUrl = 'http://localhost:8080/api/reaction';

  constructor(private http: HttpClient) { }

  // On envoie le postId et l'userId au backend
  toggleLike(postId: number, userId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}`, { postId, userId });
  }
}