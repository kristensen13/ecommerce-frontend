import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AdminTypes } from '../../../enums/admin';
import { User } from '../../../models/user.model';
import { Store } from '../../../models/store.model';
import { Product } from '../../../models/product.model';
import { Employee } from '../../../models/employee.model';
import { Category } from '../../../models/category.model';

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

  private transformStores(results: any[]): Store[] {
    return results.map(
      (store) => new Store(store.name, store.id, store.img, store.user)
    );
  }

  private transformEmployees(results: any[]): Employee[] {
    return results.map(
      (employee) =>
        new Employee(
          employee.name,
          employee.id,
          employee.img,
          employee.user,
          employee.store
        )
    );
  }

  private transformProducts(results: any[]): Product[] {
    return results.map(
      (product) =>
        new Product(
          product.id,
          product.title,
          product.price,
          product.description,
          product.images,
          product.creationAt,
          product.updatedAt,
          product.category
        )
    );
  }

  private transformCategories(results: any[]): Category[] {
    return results.map(
      (category) =>
        new Category(
          category.id,
          category.name,
          category.image,
          category.creationAt,
          category.updatedAt
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
          case AdminTypes.stores:
            return this.transformStores(resp.results);
          case AdminTypes.employees:
            return this.transformEmployees(resp.results);
          case AdminTypes.products:
            return this.transformProducts(resp.results);
          case AdminTypes.categories:
            return this.transformCategories(resp.results);
          default:
            return [];
        }
      })
    );
  }
}
