import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { APP_BASE_HREF, DecimalPipe } from '@angular/common';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { AppComponent, previewTemplateDoc,FeedbackComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DatePipe } from '@angular/common'
import { ContentLayoutComponent } from './layouts/content-layout/content-layout.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatBotComponent, chatBotSafePipe } from './layouts/chat-bot/chat-bot.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor, ErrorInterceptor } from '@app/core/interceptors';
import { OAuthModule } from 'angular-oauth2-oidc';
import { ErrorComponent } from './error/error.component';
import {StoreModule} from "@ngrx/store";
import { AppStateReducers, metaReducers } from '@app/core/state/index';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MsAdalAngular6Module } from 'microsoft-adal-angular6';
import { environment as env } from '@env/environment';
import { SafePipe } from './core/pipes/safe.pipe';
import { DigitalAssistantService} from './core/services/digital-assistant/digital-assistant.service'
import { EnvServiceProvider } from './core/services/env.service.provider';
import { EnvService } from './core/services/env.service';
import { DigitalAssistantModule } from './modules/digital-assistant/digital-assistant.module';

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

export function getAdalAADConfig() {
  return {
    instance: envADAL.outlookConfig.instance,
    tenant: envADAL.outlookConfig.tenant,
    clientId: envADAL.clientIdOutlookConfig,
    redirectUri: envADAL.outlookConfig.redirectUri,
    response_mode: "id_token+token",
    postLogoutRedirectUri : envADAL.syncredirect,
    endpoints: envADAL.outlookConfig.endpoints,
    navigateToLoginRequestUrl: envADAL.outlookConfig.navigateToLoginRequestUrl,
    //cacheLocation: 'sessionStorage',
  };
}

@NgModule({
  declarations: [
    AppComponent,
    ContentLayoutComponent,
    FooterComponent,
    AuthLayoutComponent,
    ChatBotComponent,
    ErrorComponent,
    chatBotSafePipe,
    previewTemplateDoc,
    FeedbackComponent
  ],
  imports: [
    BrowserModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    // AuthModule,//commented to remove the login page 
    CoreModule,
    SharedModule,
    AppRoutingModule,
    OAuthModule.forRoot(),
    BrowserAnimationsModule,
    StoreModule.forRoot(AppStateReducers, { metaReducers }),
    EffectsModule.forRoot([]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    MsAdalAngular6Module.forRoot(getAdalAADConfig),
    DigitalAssistantModule
  ],
  providers: [ 
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

  DatePipe, DecimalPipe,EnvServiceProvider],
  entryComponents: [ErrorComponent,previewTemplateDoc,FeedbackComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
