import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import {AuthenticationService} from '@app/_services';
import {map} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {NotificacionesService} from "@app/_services/notificaciones.service";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private dialog:MatDialog,
    private authenticationService: AuthenticationService,
    private notificacionesService:NotificacionesService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.authenticationService.userValue;
    this.notificacionesService.noLeidas()
    return this.authenticationService.info().pipe(map(ok => {
      if (ok.active) {
        // check if route is restricted by role
        if (route.data.roles && route.data.roles.indexOf(ok.role) === -1) {
          // role not authorised so redirect to home page
          this.router.navigate(['/']);
          return false;
        }

        // authorised so return true
        return true;
      } else {
        // not logged in so redirect to login page with the return url
        this.dialog.closeAll()
        this.authenticationService.logout()
        this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
        return false;
      }
    }))

  }

}
