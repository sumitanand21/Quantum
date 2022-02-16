import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelpdeskAccountCreationComponent } from './helpdesk-account-creation.component';
const routes: Routes = [    {
        path: '', component: HelpdeskAccountCreationComponent
      },   
  ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountHelpDeskCreationRoutingModule { }
