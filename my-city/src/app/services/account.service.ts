import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  api = environment.api
  constructor(private http: HttpClient) { }

  register<T>(user) {
    const api = `${this.api}/user/register`
    return this.http.post<T>(api, user);
  }

  login<T>(user) {
    const api = `${this.api}/user/login`
    return this.http.post<T>(api, user);
  }

}
