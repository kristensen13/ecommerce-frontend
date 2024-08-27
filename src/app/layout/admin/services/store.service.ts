import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { Store } from '../../../models/store.model';
import { User } from '../../../models/user.model';
import { ChargeStoresResponse } from '../../../interfaces/charge-stores.interface';

const base_url = environment.BASE_URL;

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private http = inject(HttpClient);
  public user?: User;

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.user?.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  loadStores() {
    //TODO: Implementar la paginación en el backend
    const url = `${base_url}/stores`;
    return this.http
      .get<ChargeStoresResponse>(url, this.headers)
      .pipe(map((resp: { ok: boolean; stores: Store[] }) => resp.stores));
  }

  createStore(name: string) {
    const url = `${base_url}/stores`;
    return this.http.post(url, { name }, this.headers);
  }

  updateStore(_id: string, name: string) {
    const url = `${base_url}/stores/${_id}`;
    return this.http.put(url, { name }, this.headers);
  }

  deleteStore(_id: string) {
    const url = `${base_url}/stores/${_id}`;
    return this.http.delete(url, this.headers);
  }
}
