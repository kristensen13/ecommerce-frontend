import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Employee } from '../../../../../models/employee.model';
import { delay, Subscription } from 'rxjs';
import { AdminTypes } from '../../../../../enums/admin';
import { ImageModalService } from '../../../../../services/image-modal.service';
import { SearchesService } from '../../../services/searches.service';
import { EmployeeService } from '../../../services/employee.service';
import Swal from 'sweetalert2';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImagePipe } from '../../../../../pipes/image.pipe';
import { PipesModule } from '../../../../../pipes/pipes.module';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [NgFor, FormsModule, PipesModule, ImagePipe, RouterLink],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css',
})
export class EmployeesComponent implements OnInit, OnDestroy {
  private searchesSvc = inject(SearchesService);
  private employeeSvc = inject(EmployeeService);
  private imageModalSvc = inject(ImageModalService);
  public imgSubs!: Subscription;
  public loading: boolean = true;
  public employees: Employee[] = [];
  public tempEmployees: Employee[] = [];
  public totalEmployees: number = 0;
  public imagePipeType: AdminTypes = AdminTypes.employees;

  ngOnInit(): void {
    this.loadEmployees();
    this.imgSubs = this.imageModalSvc.newImage
      .pipe(delay(100))
      .subscribe((img) => {
        this.loadEmployees();
      });
  }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  search(term: string) {
    if (term.length === 0) {
      this.employees = this.tempEmployees;
      return;
    }

    this.searchesSvc.search(AdminTypes.employees, term).subscribe({
      next: (results) => {
        this.employees = results as Employee[];
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  loadEmployees() {
    this.loading = true;
    this.employeeSvc.getEmployees().subscribe({
      next: (employees: Employee[]) => {
        this.employees = employees;
        this.tempEmployees = employees;
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // saveChanges(employee: Employee) {
  //   if (employee.id && employee.name) {
  //     this.employeeSvc.updateEmployee(employee).subscribe({
  //       next: (resp) => {
  //         Swal.fire('Updated', employee.name, 'success');
  //       },
  //       error: (err) => {
  //         Swal.fire('Error', err.error.msg, 'error');
  //       },
  //     });
  //   } else {
  //     Swal.fire('Error', 'Store name is required', 'error');
  //   }
  // }

  deleteEmployee(employee: Employee) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are going to delete ${employee.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this.employeeSvc.deleteEmployee(employee._id!).subscribe({
            next: (resp) => {
              // Swal.fire('Deleted', store.name, 'success');
              this.loadEmployees();
            },
            error: (err) => {
              Swal.fire('Error', err.error.msg, 'error');
            },
          });
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  async createEmployee() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Create a new employee',
      input: 'text',
      inputLabel: 'Enter employee name',
      inputPlaceholder: 'Name of the employee',
      showCancelButton: true,
      confirmButtonText: 'Create',
      cancelButtonText: 'Cancel',
      showLoaderOnConfirm: true,
      preConfirm: (name) => {
        return this.employeeSvc.createEmployee(name).subscribe({
          next: (resp) => {
            // Swal.fire(
            //   'Created',
            //   `${name} store created successfully`,
            //   'success'
            // );
            this.loadEmployees();
          },
          error: (err) => {
            Swal.showValidationMessage(`Request failed: ${err.error.msg}`);
          },
        });
      },
    });
  }

  openModal(employee: Employee) {
    console.log(employee);

    this.imageModalSvc.openModal(
      AdminTypes.employees,
      employee._id,
      employee.img
    );
  }
}
