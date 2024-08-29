import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then(
        (c) => c.RegisterComponent
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./layout/admin/pages/dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
    canActivate: [authGuard],
    children: [
      // {
      //   path: 'dashboard',
      //   data: { title: 'Dashboard' },
      //   loadComponent: () =>
      //     import('./layout/admin/pages/dashboard/dashboard.component').then(
      //       (c) => c.DashboardComponent
      //     ),
      // },
      {
        path: 'search/:term',
        data: { title: 'Search' },
        loadComponent: () =>
          import('./layout/admin/pages/search/search.component').then(
            (c) => c.SearchComponent
          ),
      },
      {
        path: 'profile',
        data: { title: 'Profile' },
        loadComponent: () =>
          import('./layout/shared/profile/profile.component').then(
            (c) => c.ProfileComponent
          ),
      },
      {
        path: 'products',
        data: { title: 'Products' },
        loadComponent: () =>
          import('./layout/admin/pages/products/products.component').then(
            (c) => c.ProductsComponent
          ),
      },
      {
        path: 'categories',
        data: { title: 'Categories' },
        loadComponent: () =>
          import('./layout/admin/pages/categories/categories.component').then(
            (c) => c.CategoriesComponent
          ),
      },
      {
        path: 'users',
        data: { title: 'Users' },
        loadComponent: () =>
          import('./layout/admin/pages/users/users.component').then(
            (c) => c.UsersComponent
          ),
      },
      {
        path: 'orders',
        data: { title: 'Orders' },
        loadComponent: () =>
          import('./layout/admin/pages/orders/orders.component').then(
            (c) => c.OrdersComponent
          ),
      },
      {
        path: 'customers',
        data: { title: 'Customers' },
        loadComponent: () =>
          import('./layout/admin/pages/customers/customers.component').then(
            (c) => c.CustomersComponent
          ),
      },

      // Maintenances

      {
        path: 'maintenances/stores',
        data: { title: 'Stores maintenance' },
        loadComponent: () =>
          import(
            './layout/admin/pages/maintenances/stores/stores.component'
          ).then((c) => c.StoresComponent),
      },
      {
        path: 'maintenances/employees',
        data: { title: 'Employees maintenance' },
        loadComponent: () =>
          import(
            './layout/admin/pages/maintenances/employees/employees.component'
          ).then((c) => c.EmployeesComponent),
      },
      {
        path: 'employee/:id',
        data: { title: 'Employee maintenance' },
        loadComponent: () =>
          import(
            './layout/admin/pages/maintenances/employees/employee.component'
          ).then((c) => c.EmployeeComponent),
      },

      // Admin routes
      {
        path: 'maintenances/users',
        canActivate: [adminGuard],
        data: { title: 'Users maintenance' },
        loadComponent: () =>
          import(
            './layout/admin/pages/maintenances/users/users.component'
          ).then((c) => c.UsersComponent),
      },
    ],
  },
];
