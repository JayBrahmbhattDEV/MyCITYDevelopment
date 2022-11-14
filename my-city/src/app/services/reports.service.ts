import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private api = environment.api;

  constructor(private http: HttpClient) {}

  getReports() {
    return this.http.get(`${this.api}/record`);
  }

  getReport(id: string) {
    return this.http.post(`${this.api}/record/${id}`, null);
  }

  addReport(report: any) {
    return this.http.post(`${this.api}/record/uploadRecord`, report);
  }

  getUserReport(){
    return this.http.get(`${this.api}/record/user`);
  }

  geRecentReports(){
    return this.http.get(`${this.api}/record/recentRecords`);
  }
}
