import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ErrorMessage } from '../services/error.services';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        public router: Router,
        private error:ErrorMessage,
        private oauthService: AuthService
    ) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        const authToken = localStorage.getItem('token')


        if ( authToken && this.isRoutePermited(route)) {

            return true

        } else {
            //debugger;
            this.error.throwError("Access is denied. User is unauthorized or has limited rights")
            return false;
           
        }

    }

    isRoutePermited(route: ActivatedRouteSnapshot):boolean{

        if(localStorage.getItem('routes')){

            let permitedRoutes = JSON.parse(localStorage.getItem('routes'))
            return permitedRoutes.some(x=>x.RoutePath == route.routeConfig.path)

        }else{
            return false
        }
       
    }
 // setTimeout(() => {
            //     this.oauthService.logoff()    
            // }, 1500);
}
