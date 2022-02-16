import { Injectable } from '@angular/core';
import { EnvService } from './env.service';
import { environment } from '../../../environments/environment';
import { AuthConfig } from 'angular-oauth2-oidc';
@Injectable({
  providedIn: 'root'
})
export class NewAuthConfigService {

  constructor(private envr: EnvService) {

  }

  authConfig() {
    return   {
      // Url of the Identity Provider
      issuer: this.envr.authConfig.domainUrl,
      // Login Url of the Identity Provider
      loginUrl: this.envr.authConfig.loginUrl,
      // Login Url of the Identity Provider
      logoutUrl: this.envr.authConfig.logoutUrl,
      // URL of the SPA to redirect the user to after login
      redirectUri: this.envr.authConfig.redirectUrl,
      // The SPA's id. The SPA is registerd with this id at the auth-server
      clientId: this.envr.clientIdAuthConfig,
      // set the scope for the permissions the client should request
      // The first three are defined by OIDC. The 4th is a usecase-specific one
      scope: '',
      resource: this.envr.authConfig.resource,
      responseType: this.envr.authConfig.responseType
    };
  }
}

