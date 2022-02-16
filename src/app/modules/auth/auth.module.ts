import { NgModule } from '@angular/core';
import { LoginComponent } from './pages/login/login.component';
import { AuthRoutingModule } from './auth.routing';
import { RedirectComponent } from './pages/redirect/redirect.component';

@NgModule({
  declarations: [
    LoginComponent,
    RedirectComponent
  ],
  imports: [
    AuthRoutingModule,
  ]
})
export class AuthModule { }
