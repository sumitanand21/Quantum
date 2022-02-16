import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadsLandingComponent } from './leads-landing.component';
import { QualifiedLeadsComponent } from './leads-landing-tabs/qualified-leads/qualified-leads.component';
import { UnqualifiedLeadsComponent } from './leads-landing-tabs/unqualified-leads/unqualified-leads.component';
import { DisqualifiedLeadsComponent } from './leads-landing-tabs/disqualified-leads/disqualified-leads/disqualified-leads.component';
import { ArchivedLeadsComponent } from './leads-landing-tabs/archived-leads/archived-leads.component';

const routes: Routes = [
  {
    path: '',
    component: LeadsLandingComponent,
    children: [
      {
        path: '',
        redirectTo: 'unqalified',
        pathMatch: 'full'
      },
      {
        path: 'qualified',
        component: QualifiedLeadsComponent
      },
      {
        path: 'unqalified',
        component: UnqualifiedLeadsComponent
      },
      {
        path: 'diqualified',
        component: DisqualifiedLeadsComponent
      },
      {
        path: 'archived',
        component: ArchivedLeadsComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadsListRoutingModule { }
