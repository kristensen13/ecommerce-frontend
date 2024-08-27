import { Employee } from '../models/employee.model';

export interface ChargeEmployeesResponse {
  ok: boolean;
  employees: Employee[];
}

export interface ChargeEmployeeResponse {
  ok: boolean;
  employee: Employee;
}
