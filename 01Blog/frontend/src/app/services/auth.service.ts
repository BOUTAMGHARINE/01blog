import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Cela rend le service disponible dans toute l'application
})
export class AuthService {

  // L'URL de ton backend Spring Boot (à ajuster selon ton projet)
  private baseUrl = 'http://localhost:8080/api/';

  constructor(private http: HttpClient) { }

  // Cette méthode envoie le username et le password au backend
  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}signin`, data);
  }
  //register
  register(data:any): Observable<any>{
    return this.http.post(`${this.baseUrl}sigup`,data);
  }
}