import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  api = environment.api
  token = localStorage.getItem("token");
  private user$ = new Subject();
  constructor(private http: HttpClient) { }

  register<T>(user) {
    const api = `${this.api}/user/register`
    return this.http.post<T>(api, user);
  }

  login<T>(user) {
    const api = `${this.api}/user/login`
    return this.http.post<T>(api, user);
  }

  set userDetails (details:any) {
    this.user$.next(details);
  }

  get userDetails () {
    return this.user$.asObservable();
  }

  getProfile(){
    const api = `${this.api}/user/profile`
    return this.http.get(api);
  }

  updateProfile(data){
    const api = `${this.api}/user/updateProfile`
    return this.http.patch(api, data)
  }

  getAllUsers() {
    const api = `${this.api}/user/getAllUsers`
    return this.http.get(api);
  }

  deleteUser(_id: string) {
    const api = `${this.api}/user/deleteUser`;
    return this.http.delete(api + `?id=${_id}`);
  }

}
