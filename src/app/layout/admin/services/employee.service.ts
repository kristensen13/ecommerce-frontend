import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Employee } from '../../../models/employee.model';
import { User } from '../../../models/user.model';
import {
  ChargeEmployeeResponse,
  ChargeEmployeesResponse,
} from '../../../interfaces/charge-employees.interface';

const base_url = environment.BASE_URL;

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
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

  getEmployees() {
    const url = `${base_url}/employees`;
    return this.http
      .get<ChargeEmployeesResponse>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean; employees: Employee[] }) => resp.employees)
      );
  }

  getEmployeeById(id: string) {
    const url = `${base_url}/employees/${id}`;
    return this.http
      .get<ChargeEmployeeResponse>(url, this.headers)
      .pipe(map((resp: { ok: boolean; employee: Employee }) => resp.employee));
  }

  createEmployee(employee: { name: string; store: string }) {
    const url = `${base_url}/employees`;
    return this.http.post(url, employee, this.headers);
  }

  updateEmployee(employee: Employee) {
    const url = `${base_url}/employees/${employee._id}`;
    return this.http.put(url, employee, this.headers);
  }

  deleteEmployee(_id: string) {
    const url = `${base_url}/employees/${_id}`;
    return this.http.delete(url, this.headers);
  }
}
