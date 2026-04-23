import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/reports';

  sendReport(reportData: any): Observable<any> {
    return this.http.post(this.apiUrl, reportData);
  }

  getReports(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}