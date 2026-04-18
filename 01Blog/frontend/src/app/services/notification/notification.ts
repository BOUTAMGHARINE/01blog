import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // N'oublie pas l'import !
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/notifications';

  /**
   * Récupère la liste des notifications pour un utilisateur spécifique
   */
  getNotifications(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  /**
   * Optionnel : Méthode pour marquer une notification comme lue
   */
  markAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${notificationId}/read`, {});
  }

  markAllAsRead(userId: number): Observable<void> {
   return this.http.put<void>(`${this.apiUrl}/user/${userId}/read-all`, {});
  }
}