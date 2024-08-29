import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../layout/admin/services/user.service';
import Swal from 'sweetalert2';

export const adminGuard: CanActivateFn = (route, state) => {
  const userSvc = inject(UserService);
  const router = inject(Router);

  // If the user is an administrator, the page is displayed
  if (userSvc.role === 'ADMIN_ROLE') {
    return true;
  }
  Swal.fire(
    'Error',
    'You do not have permissions to access this page',
    'error'
  );

  // If the user is not an administrator, the dashboard is displayed
  router.navigateByUrl('/dashboard');
  return false;
};
