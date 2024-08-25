import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

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
    path: '',
    loadComponent: () =>
      import('./layout/layout.component').then((c) => c.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./layout/admin/pages/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./layout/shared/profile/profile.component').then(
            (c) => c.ProfileComponent
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./layout/admin/pages/products/products.component').then(
            (c) => c.ProductsComponent
          ),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./layout/admin/pages/categories/categories.component').then(
            (c) => c.CategoriesComponent
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./layout/admin/pages/users/users.component').then(
            (c) => c.UsersComponent
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./layout/admin/pages/orders/orders.component').then(
            (c) => c.OrdersComponent
          ),
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./layout/admin/pages/customers/customers.component').then(
            (c) => c.CustomersComponent
          ),
      },

      // Maintenances
      {
        path: 'maintenances/users',
        loadComponent: () =>
          import(
            './layout/admin/pages/maintenances/users/users.component'
          ).then((c) => c.UsersComponent),
      },
      {
        path: 'maintenances/stores',
        loadComponent: () =>
          import(
            './layout/admin/pages/maintenances/stores/stores.component'
          ).then((c) => c.StoresComponent),
      },
      {
        path: 'maintenances/employees',
        loadComponent: () =>
          import(
            './layout/admin/pages/maintenances/employees/employees.component'
          ).then((c) => c.EmployeesComponent),
      },
    ],
  },
];
