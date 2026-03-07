import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  // Utilise une URL générale pour la ressource "comments"
  private baseUrl = 'http://localhost:8080/api/comments';

  constructor(private http: HttpClient) { }

  // POST : http://localhost:8080/api/comments
  addComment(postId: number, userId: number, content: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/addcomment`, { postId, userId, content });
  }

  // GET : http://localhost:8080/api/comments/post/123
  getCommentsByPost(postId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/post/${postId}`);
  }

  // DELETE : http://localhost:8080/api/comments/45
  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${commentId}`);
  }
}