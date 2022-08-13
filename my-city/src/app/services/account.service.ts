import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  api = environment.api;
  private user$ = new Subject();
  token: any;
  constructor(private http: HttpClient) {}

  register<T>(user) {
    const api = `${this.api}/user/register`;
    return this.http.post<T>(api, user);
  }

  login<T>(user) {
    const api = `${this.api}/user/login`;
    return this.http.post<T>(api, user);
  }

  set userDetails(details: any) {
    this.user$.next(details);
  }

  get userDetails() {
    return this.user$.asObservable();
  }
}
