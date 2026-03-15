import { Injectable, inject } from '@angular/core'; // ✅ Importé depuis @angular/coreimport { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'; // ✅ HttpClient reste ici

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/users'; // Ajuste l'URL selon ton Backend

  /**
   * Récupère tous les utilisateurs (pour la recherche)
   */
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  /**
   * Récupère un utilisateur spécifique par son ID
   * @param id L'identifiant de l'utilisateur à afficher
   */
  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  /**
   * Met à jour les informations du profil (bio, avatar, etc.)
   */
  updateProfile(userId: number, userData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${userId}`, userData);
  }

  /**
   * Recherche des utilisateurs par nom (Optionnel si tu préfères filtrer en Frontend)
   */
  searchUsers(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search?q=${query}`);
  }
  updatePassword(data: any): Observable<any> {
  console.log("pppppppppppppppppppppppppppppppppppppppppppppppppppppp");
  
  return this.http.post('http://localhost:8080/api/users/change-password', data);
}
}
