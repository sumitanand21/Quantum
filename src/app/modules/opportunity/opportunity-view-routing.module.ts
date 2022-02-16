import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OpportunityViewComponent } from './pages/opportunity-view/opportunity-view.component';
import { UserDeclarationsComponent } from '../order/pages/order-list-bfm-child/tabs/user-declarations/user-declarations.component';
import { OverviewComponent } from './pages/opportunity-view/tabs/overview/overview.component';
import { BusinessSolutionComponent } from './pages/opportunity-view/tabs/business-solution/business-solution.component';
import { CompetitorComponent } from './pages/opportunity-view/tabs/competitor/competitor.component';
import { DealComponent } from './pages/opportunity-view/tabs/deal/deal.component';
import { TeamComponent } from './pages/opportunity-view/tabs/team/team.component';
import { OBDistributionComponent } from './pages/opportunity-view/tabs/ob-distribution/ob-distribution.component';
import { ClosereasonComponent } from './pages/opportunity-view/tabs/closereason/closereason.component';
import { LossreasonComponent } from './pages/opportunity-view/tabs/lossreason/lossreason.component';
import { OrderComponent } from './pages/opportunity-view/tabs/order/order.component';
import { EndSalesCycleComponent } from './pages/end-sales-cycle/end-sales-cycle.component';
import { ChangeOpportunityComponent } from './pages/change-opportunity/change-opportunity.component';


const routes: Routes = [


  
  { path: '', component: OpportunityViewComponent,


    children: [
      
      { path: 'overview', component: OverviewComponent },
      {path: 'userdeclarations', component: UserDeclarationsComponent},
      
      { path: 'businesssolution', component: BusinessSolutionComponent },

      { path: 'competitor', component: CompetitorComponent },

     
      { path: 'deal', component: DealComponent },

      { path: 'team', component: TeamComponent },

      { path: 'obdistribution', component: OBDistributionComponent },
      { path: 'closereason', component: ClosereasonComponent },
      { path: 'lossreasons', component: LossreasonComponent },

      { path: 'order', component: OrderComponent },

    
]  
  
},
  { path: 'opportunityendsalescycle', component: EndSalesCycleComponent },
  { path: 'changeOpportunity', component: ChangeOpportunityComponent }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpportunityViewRoutingModule { }
