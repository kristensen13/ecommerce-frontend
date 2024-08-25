import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AdminTypes } from '../../../enums/admin';
import { User } from '../../../models/user.model';

const base_url = environment.BASE_URL;
@Injectable({
  providedIn: 'root',
})
export class SearchesService {
  private http = inject(HttpClient);

  get headers() {
    return {
      'x-token': localStorage.getItem('token') || '',
    };
  }
  get token(): string {
    return localStorage.getItem('token') || '';
  }

  private transformUsers(results: any[]): User[] {
    return results.map(
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
  }

  search(type: AdminTypes, term: string) {
    const url = `${base_url}/todo/collection/${type}/${term}`;
    return this.http.get<any[]>(url, { headers: this.headers }).pipe(
      map((resp: any) => {
        switch (type) {
          case AdminTypes.users:
            return this.transformUsers(resp.results);
          default:
            return [];
        }
      })
    );
  }
}
