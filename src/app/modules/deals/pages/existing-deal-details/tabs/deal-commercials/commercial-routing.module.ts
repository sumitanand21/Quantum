import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DealCommercialsComponent } from './deal-commercials.component';
import { UploadRlsComponent } from '@app/modules/deals/pages/existing-deal-details/tabs/deal-commercials/tabs/upload-rls/upload-rls.component';
import { ViewEditComponent } from '@app/modules/deals/pages/existing-deal-details/tabs/deal-commercials/tabs/view-edit/view-edit.component';
import { CalculateComponent } from '@app/modules/deals/pages/existing-deal-details/tabs/deal-commercials/tabs/calculate/calculate.component';
import { MilestoneComponent } from '@app/modules/deals/pages/existing-deal-details/tabs/deal-commercials/tabs/milestone/milestone.component';
import { DealAggregatorComponent } from './tabs/view-edit/tabs/deal-aggregator/deal-aggregator.component';
import { ReportsComponent } from './tabs/view-edit/tabs/reports/reports.component';
import { DealCriteriaComponent } from './tabs/view-edit/tabs/deal-criteria/deal-criteria.component';

const routes: Routes = [



  {
    path: '', children: [
      {
        path: 'commlanding', component: DealCommercialsComponent,

        children: [
          { path: '', redirectTo:'uploadRLS', pathMatch:'full'},
          { path: 'uploadRLS', component: UploadRlsComponent },

          { path: 'viewEdit', component: ViewEditComponent,

            children: [
              { path: '', redirectTo:'dealCriteria', pathMatch:'full'},
              { path: 'dealCriteria', component: DealCriteriaComponent },
              { path: 'reports', component: ReportsComponent },
              { path: 'dealAggregator', component: DealAggregatorComponent },
            ]
          },
          { path: 'calculate', component: CalculateComponent },
          { path: 'milestone', component: MilestoneComponent },
        ]
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommercialRoutingModule { }
