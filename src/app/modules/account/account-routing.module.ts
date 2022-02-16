import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountListLandingComponent } from '@app/modules/account/pages/account-list-landing/account-list-landing.component';
import { FarmingComponent } from './pages/account-list-landing/tabs/farming/farming.component';
import { ReserveComponent } from './pages/account-list-landing/tabs/reserve/reserve.component';
import { LoginComponent } from './pages/login/login.component';
import { AllianceComponent } from './pages/account-list-landing/tabs/alliance/alliance.component';
import { AccountFinderComponent } from './pages/account-finder/account-finder.component';
import { MoreviewComponent } from './pages/account-list-landing/tabs/moreview/moreview.component';
import { AccountTransitionComponent } from './pages/account-transition/account-transition.component';
import { AccountMoreViewsComponent } from './pages/account-more-views/account-more-views.component';
import { AnalystAdvisorComponent } from './pages/account-list-landing/tabs/analyst-advisor/analyst-advisor.component';
import { AccountOwnershipHistoryComponent } from './pages/account-ownership-history/account-ownership-history.component';
import { AllActiveAccountsComponent } from './pages/account-list-landing/tabs/all-active-accounts/all-active-accounts.component';
import { GenericProspectAccount } from '@app/shared/components/generic-prospect-account/generic.prospect.account';
import { EditReferenceComponent } from './pages/edit-reference/edit-reference.component';

const routes: Routes = [
  {
    path: '', children: [
      {
        path: 'accountlist', component: AccountListLandingComponent,
        children: [
          { path: 'farming', component: FarmingComponent },
          { path: 'moreview', component: MoreviewComponent },
          { path: 'reserve', component: ReserveComponent },
          { path: 'alliance', component: AllianceComponent },
          { path: 'AnalystAdvisor', component: AnalystAdvisorComponent },
          { path: 'allactiveaccounts', component: AllActiveAccountsComponent }
        ]
      },

      {
        path: 'accountcreation',
        loadChildren: './pages/account-creation/account-creation.module#AccountCreationgModule'
      },

      {
        path: 'assignmentRef',
        loadChildren: './pages/assingment-ref/AccountAssignmentModule#AccountAssignmentModule'
      },
      {
        path: 'accountmodification',
        loadChildren: './pages/account-modification/account-modification.module#AccountModificationModule'
      },

      {
        path: 'accountdetails',
        loadChildren: './pages/account-details/account-detail.module#AccountDetailModule'
      },
      {
        path: 'accountopportunity',
        loadChildren: '../opportunity/opportunity.module#OpportunityModule'
      },

      {
        path: 'login', component: LoginComponent
      },
      {
        path: 'accountsearch', component: AccountFinderComponent
      },

      {
        path: 'accountownershiphistory', component: AccountOwnershipHistoryComponent
      },

      {
        path: 'helpdeskaccountcreation',
        loadChildren: './pages/helpdesk-account-creation/AccountHelpDeskCreationModule#AccountHelpDeskCreationModule'
      },

      {
        path: 'contracts',
        loadChildren: './pages/account-contracts/AccountContractModule#AccountContractModule'
      },
      {
        path: 'contacts',
        loadChildren: './pages/account-contacts/account-contact.module#AccountContactModule'
      },
      {
        path: 'teams',
        loadChildren: './pages/account-teams/account-teams.module#AccountTeamsModule'
      },

      {
        path: 'managementlog',
        loadChildren: './pages/account-management-log/AccountManagementModule#AccountManagementModule'
      },

      {
        path: 'editreference', component: EditReferenceComponent
      },
      {
        path: 'accounttransition', component: AccountTransitionComponent
      },
      {
        path: 'accountmoreviews', component: AccountMoreViewsComponent

      },

      { path: 'prospectAccount', component: GenericProspectAccount },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
