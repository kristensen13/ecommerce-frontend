import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { LoadUsers } from '../../../interfaces/load-users.interface';
import { LoginForm } from '../../../interfaces/login-form.interface';
import { RegisterForm } from '../../../interfaces/register-form.interface';
import { User } from '../../../models/user.model';

declare const google: any;
const base_url = environment.BASE_URL;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private router = inject(Router);
  public user!: User;
  private googleEmail = '';

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.user.uid || '';
  }

  get headers() {
    return {
      'x-token': this.token,
    };
  }

  logout() {
    if (this.user.google === true) {
      this.googleEmail = this.user.email;
      google.accounts.id.revoke(this.googleEmail, () => {
        localStorage.removeItem('token');
        this.router.navigateByUrl('/login');
      });
    } else {
      localStorage.removeItem('token');
      this.router.navigateByUrl('/login');

      // google.accounts.id.revoke('2bitstechnology@gmail.com', () => {
      //   this.router.navigateByUrl('/login');
      // });
    }
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
    data = { ...data, role: this.user.role };
    return this.http.put(`${base_url}/users/${this.uid}`, data, {
      headers: this.headers,
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

  loadUsers(from: number = 0) {
    const url = `${base_url}/users?from=${from}`;
    return this.http.get<LoadUsers>(url, { headers: this.headers }).pipe(
      map((resp) => {
        const users = resp.users.map(
          (user) =>
            new User(
              user.name,
              user.email,
              '',
              user.img,
              user.google,
              user.role,
              user.uid
            )
        );
        return {
          total: resp.total,
          users,
        };
      })
    );
  }

  deleteUser(user: User) {
    const url = `${base_url}/users/${user.uid}`;
    return this.http.delete(url, { headers: this.headers });
  }

  saveUser(user: User) {
    const url = `${base_url}/users/${user.uid}`;
    return this.http.put(url, user, { headers: this.headers });
  }
}
