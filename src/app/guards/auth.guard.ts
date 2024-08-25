import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { UserService } from '../layout/admin/services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.validateToken().pipe(
    tap((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigateByUrl('/login');
      }
    })
  );
};
