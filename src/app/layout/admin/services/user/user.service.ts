import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { catchError, map, tap } from 'rxjs/operators';
import { RegisterForm } from '../../../../interfaces/register-form.interface';
import { LoginForm } from '../../../../interfaces/login-form.interface';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../../../../models/user.model';

declare const google: any;
const base_url = environment.BASE_URL;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private router = inject(Router);
  public user!: User;

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.user.uid || '';
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');

    google.accounts.id.revoke('2bitstechnology@gmail.com', () => {
      this.router.navigateByUrl('/login');
    });
  }

  validateToken(): Observable<boolean> {
    return this.http
      .get(`${base_url}/login/renew`, {
        headers: {
          'x-token': this.token || '',
        },
      })
      .pipe(
        map((resp: any) => {
          const { name, email, img = '', role, google, uid } = resp.user;
          this.user = new User(name, email, '', img, role, google, uid);
          localStorage.setItem('token', resp.token);
          return true;
        }),
        catchError(() => {
          // localStorage.removeItem('token');
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

  updateProfile(data: { name: string; email: string; role?: string }) {
    data = {
      ...data,
      role: this.user.role,
    };

    return this.http.put(`${base_url}/users/${this.uid}`, data, {
      headers: {
        'x-token': this.token || '',
      },
    });
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
