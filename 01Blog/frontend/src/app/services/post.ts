import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  // L'URL de ton API Spring Boot
  private apiUrl = 'http://localhost:8080/api/posts';

  constructor(private http: HttpClient) { }

  // 1. Récupérer tous les posts (le Feed)
  getAllPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getposts`);
  }

  // 2. Récupérer un post spécifique par ID
  getPostById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // 3. Créer un nouveau post
  // Utilise FormData si tu envoies une image/vidéo
  createPost(postData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addpost`, postData);
  }

  // 4. Supprimer un post
  deletePost(id: number, authorId: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}?authorId=${authorId}`, { responseType: 'text' });
  }

  // 5. Mettre à jour un post
  updatePost(id: number, content: string, authorId: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, { content, authorId }, { responseType: 'text' });
  }
}
