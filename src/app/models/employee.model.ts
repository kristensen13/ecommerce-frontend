import { Store } from './store.model';

interface _EmployeeUser {
  _id: string;
  name: string;
  img: string;
}

export class Employee {
  constructor(
    public name: string,
    public _id?: string,
    public img?: string,
    public user?: _EmployeeUser,
    public store?: Store
  ) {}
}
