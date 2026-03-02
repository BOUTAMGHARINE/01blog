import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = 'http://localhost:8080/api/comments';

  constructor(private http: HttpClient) { }

  // Ajouter un commentaire
  addComment(postId: number, userId: number, content: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, { postId, userId, content });
  }

  // Si tu veux charger les commentaires seulement à l'ouverture (plus performant)
  getCommentsByPost(postId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/post/${postId}`);
  }
}