import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);

  getCategories() {
    return this.http.get(
      `${environment.API_ENDPOINT}${environment.METHODS.GET_ALL_CATEGORIES}`
    );
  }
}
