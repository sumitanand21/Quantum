// import { Routes } from '@angular/router';

import { AccountDetailsComponent } from './account-details.component';
// import { EditReferenceComponent } from '../edit-reference/edit-reference.component';
import { AccountDetailsTwoComponent } from '../account-details-two/account-details-two.component';
import { OwnershipHistoryListComponent } from '../ownership-history-list/ownership-history-list.component';
import { DashboardDetailsComponent } from '../dashboard-details/dashboard-details.component';
// import { AccountTransitionComponent } from '../account-transition/account-transition.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddBulkTeamMemberComponent } from '../add-bulk-team-member/add-bulk-team-member.component';
export const routes: Routes = [
  {
    path: '', component: AccountDetailsComponent
  },
 
  {
    path: 'accountdetailstwo', component: AccountDetailsTwoComponent
  },
  {
    path: 'ownershipHistoryList', component: OwnershipHistoryListComponent
  },
  {
    path: 'DashboardDetails', component: DashboardDetailsComponent
  },
   {
        path: 'bulkteammember', component: AddBulkTeamMemberComponent

      },
  // {
  //   path: 'accountdetails/:id', component: AccountDetailsComponent
  // },

   
  ];
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class AccountDetailRoutingModule {
  }



