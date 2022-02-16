import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OppactionsRoutingModule } from './oppactions-routing.module';
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
// import { EndSalesCycleComponent } from './pages/end-sales-cycle/end-sales-cycle.component';
import { PopoverModule } from 'ngx-smart-popover';
import { SharedModule } from '@app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ClickOutsideModule } from 'ng-click-outside';
import { FileUploadModule } from 'ng2-file-upload';
import { OpportunityModalModule } from './opportunity-modal.module';


@NgModule({


  declarations: [
    AddServiceLineComponent,
    AddIpComponent,
    AddAllianceComponent,
    NewAgeBusinessPartnerComponent,
    OpportunityInsightComponent,
    OpportunityGuidelineComponent,
    DealDashboardReportComponent,
    DealSnapshotComponent,
    CommitmentRegisterComponent,
    CommitmentRegisterDetailsComponent,
    //uploadPopup,
    // EndSalesCycleComponent 
        
  ],
  imports: [
    CommonModule,
    OppactionsRoutingModule,
    PopoverModule,
       SharedModule,
       FormsModule,
       ReactiveFormsModule,
       PerfectScrollbarModule,
       Ng2SearchPipeModule,
       DragDropModule,
       ClickOutsideModule,
       FileUploadModule,
       OpportunityModalModule
  ],
  entryComponents:[
    //uploadPopup
  ]
})
export class OppactionsModule { }
