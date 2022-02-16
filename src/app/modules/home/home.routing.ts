import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { NavigationComponent } from './pages/navigation/navigation.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: HomeComponent
      },
      {
        path: 'approvaltask',
        loadChildren: './pages/approval-task/approval-task.module#ApprovalTaskModule'
      },
    ]
  }, {
    path: 'navigation/:module/:sysid',
    component: NavigationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
