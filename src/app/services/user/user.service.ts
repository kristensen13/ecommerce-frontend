import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { catchError, map, tap } from 'rxjs/operators';
import { RegisterForm } from '../../interfaces/register-form.interface';
import { LoginForm } from '../../interfaces/login-form.interface';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

declare const google: any;
const base_url = environment.BASE_URL;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private router = inject(Router);

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');

    google.accounts.id.revoke('2bitstechnology@gmail.com', () => {
      this.router.navigateByUrl('/login');
    });
  }

  validateToken(): Observable<boolean> {
    const token = localStorage.getItem('token');
    return this.http
      .get(`${base_url}/login/renew`, {
        headers: {
          'x-token': token ?? '',
        },
      })
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
        }),
        map((resp: any) => true),
        catchError(() => {
          localStorage.removeItem('token');
          return of(false);
        })
      );
  }

  getUsers() {
    return this.http.get(
      `${environment.API_ENDPOINT}${environment.METHODS.GET_ALL_USERS}`
    );
  }

  createUser(formData: RegisterForm) {
    return this.http.post(`${base_url}/users`, formData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }
}
