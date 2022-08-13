import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
  } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { Observable } from 'rxjs';
  import { AccountService } from '../services/account.service';
  @Injectable({
    providedIn: 'root',
  })
  export class TokenInterceptor implements HttpInterceptor {
    constructor(public accountService: AccountService) {}
    intercept(
      request: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>> {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.accountService.token}`,
        },
      });
      return next.handle(request);
    }
  }