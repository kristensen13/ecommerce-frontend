import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);

  getProducts() {
    return this.http.get(
      `${environment.API_ENDPOINT}${environment.METHODS.GET_ALL_PRODUCTS}`
    );
  }

  createProduct(product: any) {
    // const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(
      `${environment.API_ENDPOINT}${environment.METHODS.CREATE_PRODUCT}`,
      product
      // { headers }
    );
  }
}
