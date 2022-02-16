import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateLeadComponent } from './pages/create-lead/create-lead.component';
import { LeadsDetailsLandingComponent } from './pages/leads-landing/leads-details-landing/leads-details-landing.component';
import { LeadDetailsComponent } from './pages/leads-landing/leads-details-landing/tabs/lead-details/lead-details.component';
import { LeadHistoryComponent } from './pages/leads-landing/leads-details-landing/tabs/lead-history/lead-history.component';
import { LeadScoreComponent } from './pages/leads-landing/leads-details-landing/tabs/lead-score/lead-score.component';
import { LeadMoreViewComponent } from './pages/leads-landing/leads-landing-tabs/lead-more-view/lead-more-view.component';
import { GenericProspectAccount } from '@app/shared/components/generic-prospect-account/generic.prospect.account';

const routes: Routes = [
  {
    path: '',
    loadChildren: './pages/leads-landing/leads-list.module#LeadsListModule'
  },
  {
    path: 'leadMoreView',
    component: LeadMoreViewComponent
  },
  {
    path: 'createlead',
    component: CreateLeadComponent
  },
  { path: 'prospectAccount', component: GenericProspectAccount },
  {
    path: 'leadDetails',
    component: LeadsDetailsLandingComponent,
    children: [
      { path: '', redirectTo: 'leadDetailsInfo', pathMatch: 'full' },
      { path: 'leadDetailsInfo', component: LeadDetailsComponent },
      { path: 'leadHistory', component: LeadHistoryComponent },
      { path: 'leadScore', component: LeadScoreComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadsRoutingModule { }
