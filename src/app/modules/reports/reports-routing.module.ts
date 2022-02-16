import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsLandingComponent } from './pages/reports-landing/reports-landing.component';
import { ReportsListingLandingComponent } from './pages/reports-listing-landing/reports-listing-landing.component';
import { AvailableReportsComponent } from './pages/reports-listing-landing/tabs/available-reports/available-reports.component';

const routes: Routes = [
    
    { path: '', component:ReportsLandingComponent },
    { path: 'moreRecords', component: ReportsListingLandingComponent,
      children: [
        {path:'availableRecords',component:AvailableReportsComponent}
    ]
    } 
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ReportsRoutingModule { }