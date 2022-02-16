import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountCreationComponent } from './account-creation.component';
import { ActiveRequestsComponent } from './tabs/active-requests/active-requests.component';
import { CreationHistoryComponent } from './tabs/creation-history/creation-history.component';
import { CreateNewAccountComponent } from '../create-new-account/create-new-account.component';
import { CreateProspectAccountComponent } from '../create-prospect-account/create-prospect-account.component';
import { ProspectAccountCreationComponent } from '../prospect-account-creation/prospect-account-creation.component';
import { ReviewNewAccountComponent } from '../review-new-account/review-new-account.component';
// import { HelpdeskAccountCreationComponent } from '../helpdesk-account-creation/helpdesk-account-creation.component';


const routes: Routes = [
  {
    path: '', component: AccountCreationComponent,
    children: [
      { path: 'activerequest', component: ActiveRequestsComponent },
      { path: 'creationhistory', component: CreationHistoryComponent },
    ]
  },
  {
    path: 'createnewaccount', component: CreateNewAccountComponent
  },
  {
    path: 'createprospectaccount', component: CreateProspectAccountComponent
  },
  {
    path: 'createProspect', component: ProspectAccountCreationComponent
  },
  {
    path: 'reviewnewaccount', component: ReviewNewAccountComponent
  },
  // {

  //   path: 'helpdeskaccountcreation', component: HelpdeskAccountCreationComponent

  // },
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountCreationRoutingModule { }
