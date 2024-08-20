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
      import('./pages/admin/login/login.component').then(
        (c) => c.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/admin/register/register.component').then(
        (c) => c.RegisterComponent
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('./pages/admin/layout/layout.component').then(
        (c) => c.LayoutComponent
      ),
    canActivate: [authGuard],
    children: [
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/admin/products/products.component').then(
            (c) => c.ProductsComponent
          ),
      },
    ],
  },
];
