import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../../../environments/environment';
import { EnvService } from './env.service';

const envADAL = new EnvService();

// Read environment variables from browser window

const browserWindow = window || {};
const browserWindowEnv = browserWindow['__env'] || {};

// Assign environment variables from browser window to env
// In the current implementation, properties from env.js overwrite defaults from the EnvService.

// If needed, a deep merge can be performed here to merge properties instead of overwriting them.

for (const key in browserWindowEnv) {
  if (browserWindowEnv.hasOwnProperty(key)) {

    envADAL[key] = window['__env'][key];
  }
}
export const authConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: envADAL.authConfig.domainUrl,
  // Login Url of the Identity Provider
  loginUrl: envADAL.authConfig.loginUrl,
  // Login Url of the Identity Provider
  logoutUrl: envADAL.authConfig.logoutUrl,
  // URL of the SPA to redirect the user to after login
  redirectUri: envADAL.authConfig.redirectUrl,
  // The SPA's id. The SPA is registerd with this id at the auth-server
  // clientId: environment.authConfig.clientId,
  // set the scope for the permissions the client should request
  // The first three are defined by OIDC. The 4th is a usecase-specific one
  scope: '',
  resource: envADAL.authConfig.resource,
  responseType: envADAL.authConfig.responseType
};
export const powerBIConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: 'https://wipfsuat.wipro.com/adfs',
  // Login Url of the Identity Provider
  loginUrl: 'https://wipfsuat.wipro.com/adfs/oauth2/token',
  // Login Url of the Identity Provider
  // logoutUrl: 'https://wipfsuat.wipro.com/adfs/oauth2/authorize',
  // URL of the SPA to redirect the user to after login
  redirectUri: 'http://localhost:4200/auth/login',
  // The SPA's id. The SPA is registerd with this id at the auth-server
  clientId: 'ef6d9135-e4d0-4e4b-acbb-fd81e5e45cf9',
  // set the scope for the permissions the client should request
  // The first three are defined by OIDC. The 4th is a usecase-specific one
  scope: '',
  resource: 'https://quantumd.wipro.com/api/data/v8.2/',
  responseType: 'code',
  oidc: true,
  tokenEndpoint: 'https://wipfsuat.wipro.com/adfs/oauth2/token',
  requestAccessToken: true,
  dummyClientSecret: 'CCFy9MhRr9umpZGOeGzFeLsgsuDI8syFK2-FLzdp',
  options: [
    {grant_type: 'authorization_code'},
    {client_secret: 'CCFy9MhRr9umpZGOeGzFeLsgsuDI8syFK2-FLzdp'}
  ]
};
