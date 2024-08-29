import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { StoreService } from '../../../services/store.service';
import { Store } from '../../../../../models/store.model';
import { NgFor } from '@angular/common';
import { AdminTypes } from '../../../../../enums/admin';
import { PipesModule } from '../../../../../pipes/pipes.module';
import { ImagePipe } from '../../../../../pipes/image.pipe';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../../../models/employee.model';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, PipesModule, ImagePipe],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
})
export class EmployeeComponent implements OnInit {
  private fb = inject(FormBuilder);
  private storeSvc = inject(StoreService);
  private employeeSvc = inject(EmployeeService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  public selectedEmployee: Employee | undefined;
  public employeeForm: FormGroup = new FormGroup({});
  public stores: Store[] = [];
  public selectedStore: Store | undefined;
  public imagePipeTypeEmployees: AdminTypes = AdminTypes.employees;
  public imagePipeTypeStores: AdminTypes = AdminTypes.stores;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => this.loadEmployee(id));

    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      store: ['', Validators.required],
    });
    this.loadStores();
    this.employeeForm.get('store')?.valueChanges.subscribe({
      next: (storeId) => {
        this.selectedStore = this.stores.find((store) => store._id === storeId);
      },
      error: (err) => {
        console.error('Error', err);
      },
    });
  }

  loadEmployee(id: string) {
    if (id === 'new') {
      return;
    }
    this.employeeSvc
      .getEmployeeById(id)
      .pipe(delay(100))
      .subscribe({
        next: (employee) => {
          this.selectedEmployee = employee;

          this.employeeForm.setValue({
            name: employee.name,
            store: employee.store ? employee.store._id : null,
          });
        },
        error: () => {
          this.router.navigateByUrl('/dashboard/maintenances/employees');
        },
      });
  }

  loadStores() {
    this.storeSvc.loadStores().subscribe({
      next: (stores: Store[]) => {
        this.stores = stores;
      },
      error: (err) => {
        console.error('Error', err);
      },
    });
  }

  saveEmployee() {
    if (this.employeeForm.invalid) {
      return;
    }
    const { name } = this.employeeForm.value;
    if (this.selectedEmployee) {
      const data = {
        ...this.employeeForm.value,
        _id: this.selectedEmployee._id,
      };
      this.employeeSvc.updateEmployee(data).subscribe((resp) => {
        Swal.fire('Success', `Employee ${name} has been updated`, 'success');
        this.router.navigateByUrl(
          `/dashboard/maintenances/employee/${data._id}`
        );
      });
    } else {
      this.employeeSvc.createEmployee(this.employeeForm.value).subscribe({
        next: (resp: any) => {
          console.log(resp);
          Swal.fire('Success', `Employee ${name} has been created`, 'success');
          this.router.navigateByUrl(
            `/dashboard/maintenances/employee/${resp.employee._id}`
          );
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
}
