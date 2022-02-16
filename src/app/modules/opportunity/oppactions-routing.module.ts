


import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddServiceLineComponent } from './pages/add-service-line/add-service-line.component';
import { AddIpComponent } from './pages/add-ip/add-ip.component';
import { AddAllianceComponent } from './pages/add-alliance/add-alliance.component';
import { NewAgeBusinessPartnerComponent } from './pages/new-age-business-partner/new-age-business-partner.component';
import { OpportunityInsightComponent } from './pages/opportunity-insight/opportunity-insight.component';
import { OpportunityGuidelineComponent } from './pages/opportunity-guideline/opportunity-guideline.component';
import { DealDashboardReportComponent } from './pages/deal-dashboard-report/deal-dashboard-report.component';
import { DealSnapshotComponent } from './pages/deal-snapshot/deal-snapshot.component';
import { CommitmentRegisterComponent } from './pages/commitment-register/commitment-register.component';
import { CommitmentRegisterDetailsComponent } from './pages/commitment-register-details/commitment-register-details.component';

const routes: Routes = [


  { path: 'addserviceline', component: AddServiceLineComponent },
  { path: 'addip', component: AddIpComponent },
  { path: 'addalliance', component: AddAllianceComponent },
   { path: 'newagebusinesspartner', component: NewAgeBusinessPartnerComponent },
    { path: 'opportunityinsight', component: OpportunityInsightComponent },
    { path: 'opportunityguideline', component: OpportunityGuidelineComponent },
    { path: 'dealdashboardreport', component: DealDashboardReportComponent },
    { path: 'dealsnapshot', component: DealSnapshotComponent },
    { path: 'commitmentregister', component: CommitmentRegisterComponent },
    { path: 'commitmentregisterdetails', component: CommitmentRegisterDetailsComponent }
    

];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OppactionsRoutingModule { }
