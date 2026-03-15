import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from './core/services/auth.service';

export const protectedRouteGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  if (!authService.hasRefreshToken()) {
    return router.createUrlTree(['/'], { queryParams: { redirect: state.url } });
  }

  return authService.refreshAccessToken().pipe(
    map(() => true),
    catchError(() => {
      authService.clearTokens();
      return of(router.createUrlTree(['/'], { queryParams: { redirect: state.url } }));
    })
  );
};
