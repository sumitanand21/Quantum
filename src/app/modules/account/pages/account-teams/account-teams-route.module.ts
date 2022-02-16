import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountTeamsComponent } from './account-teams.component';
import { IncentiveComponent } from './tabs/incentive/incentive.component';
import { NonIncentiveComponent } from './tabs/non-incentive/non-incentive.component';


const routes: Routes = [
  {
    path: '', component: AccountTeamsComponent,
    children: [
      { path: 'incentive', component: IncentiveComponent },
      { path: 'nonincentive', component: NonIncentiveComponent }
    ]
  },

   
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountTeamsRoutingModule { }
