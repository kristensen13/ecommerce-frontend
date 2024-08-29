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
import { LocalStorageService } from './local-storage.service';
import { ChargeUserResponse } from '../../../interfaces/charge-users.interface';

declare const google: any;
const base_url = environment.BASE_URL;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private localStorageSvc = inject(LocalStorageService);
  public user!: User;
  private googleEmail = '';

  get token(): string {
    return this.localStorageSvc.getItem('token') || '';
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.user.role! || 'USER_ROLE';
  }

  get uid(): string {
    return this.user.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  saveLocalStorage(token: string, menu: any) {
    this.localStorageSvc.setItem('token', token);
    this.localStorageSvc.setItem('menu', JSON.stringify(menu));
  }

  logout() {
    //TODO: delete menu
    if (this.user.google === true) {
      this.googleEmail = this.user.email;
      google.accounts.id.revoke(this.googleEmail, () => {
        this.localStorageSvc.removeItem('token');
        this.localStorageSvc.removeItem('menu');
        this.router.navigateByUrl('/login');
      });
    } else {
      this.localStorageSvc.removeItem('token');
      this.localStorageSvc.removeItem('menu');
      this.router.navigateByUrl('/login');
    }
  }

  validateToken(): Observable<boolean> {
    return this.http.get(`${base_url}/login/renew`, this.headers).pipe(
      map((resp: any) => {
        const { name, email, img = '', google, role, uid } = resp.user;
        this.user = new User(name, email, '', img, google, role, uid);
        this.saveLocalStorage(resp.token, resp.menu);
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
        this.saveLocalStorage(resp.token, resp.menu);
      })
    );
  }

  updateProfile(data: { name: string; email: string; role?: string }) {
    data = { ...data, role: this.user.role };
    return this.http.put(`${base_url}/users/${this.uid}`, data, this.headers);
  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap((resp: any) => {
        this.saveLocalStorage(resp.token, resp.menu);
      })
    );
  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      tap((resp: any) => {
        this.saveLocalStorage(resp.token, resp.menu);
      })
    );
  }

  loadUsers(from: number = 0) {
    const url = `${base_url}/users?from=${from}`;
    return this.http.get<LoadUsers>(url, this.headers).pipe(
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
    return this.http.delete(url, this.headers);
  }

  saveUser(user: User) {
    const url = `${base_url}/users/${user.uid}`;
    return this.http.put(url, user, this.headers);
  }
}
