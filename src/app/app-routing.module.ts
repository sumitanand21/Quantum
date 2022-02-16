import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSerializer } from '@angular/router';
import { CONTENT_ROUTES } from '@app/shared';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { ContentLayoutComponent } from './layouts/content-layout/content-layout.component';
import { PreloadSelectedModulesList } from './preload_selected_modules_list';
import { NoAuthGuard } from '@app/core';
import { UrlSerializerService } from '@app/url-serializer.service';
import { environment as env } from '@env/environment';
//[{path:'l2o',component:HomeComponent}];

const routes: Routes = [
  {           //commented to remove the login page 
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'advancedSearch',
    loadChildren: './layouts/advanced-search/advanced-search.module#AdvancedSearchModule'
  },
  {           //commented to remove the login page 
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: './modules/auth/auth.module#AuthModule'
  },
  {
    path: '',
    component: ContentLayoutComponent,
    // canActivate: [NoAuthGuard], // Should be replaced with actual auth guard //commented to remove the login page 
    children: CONTENT_ROUTES
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: env.userHash, preloadingStrategy: PreloadSelectedModulesList, scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule],
  providers: [PreloadSelectedModulesList, {
    provide: UrlSerializer,
    useClass: UrlSerializerService
  }]
})
export class AppRoutingModule { }


