import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { ReportsRoutingModule } from '@app/modules/reports/reports-routing.module';
import { ReportsLandingComponent } from '@app/modules/reports/pages/reports-landing/reports-landing.component';
import { ReportsListingLandingComponent } from './pages/reports-listing-landing/reports-listing-landing.component';
import { AvailableReportsComponent } from './pages/reports-listing-landing/tabs/available-reports/available-reports.component';


@NgModule({
  declarations: [
    ReportsLandingComponent,
    ReportsListingLandingComponent,
    AvailableReportsComponent
  ],
  
  imports: [
    CommonModule,
    SharedModule,
    ReportsRoutingModule
   
  ]
})
export class ReportsModule { }
