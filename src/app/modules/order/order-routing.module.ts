import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderLandingComponent } from './pages/order-landing/order-landing.component';
import { OrderListBfmChildComponent } from './pages/order-list-bfm-child/order-list-bfm-child.component';
import { SystemChecksComponent } from './pages/order-list-bfm-child/tabs/system-checks/system-checks.component';
// import { UserDeclarationsComponent } from './pages/order-list-bfm-child/tabs/user-declarations/user-declarations.component';
import { ManualChecksComponent } from './pages/order-list-bfm-child/tabs/manual-checks/manual-checks.component';
import { OrderListComponent } from './pages/order-list/order-list.component';
import { OrderListAdhChildComponent } from './pages/order-list-adh-child/order-list-adh-child.component';
// import { OrderDetailsComponent } from './pages/order-list-bfm-child/left_nav/order-details/order-details.component';
import { CreateAmendmentComponent } from './pages/create-amendment/create-amendment.component';
import { CreateAmendmentChildComponent } from './pages/create-amendment-child/create-amendment-child.component';
// import { OverviewComponent } from '../opportunity/pages/opportunity-view/tabs/overview/overview.component';
// import { BusinessSolutionComponent } from '../opportunity/pages/opportunity-view/tabs/business-solution/business-solution.component';
// import { CompetitorComponent } from '../opportunity/pages/opportunity-view/tabs/competitor/competitor.component';
// import { ContractsComponent } from '../opportunity/pages/opportunity-view/tabs/contracts/contracts.component';
// import { DealComponent } from '../opportunity/pages/opportunity-view/tabs/deal/deal.component';
// import { TeamComponent } from '../opportunity/pages/opportunity-view/tabs/team/team.component';
// import { ClosereasonComponent } from '../opportunity/pages/opportunity-view/tabs/closereason/closereason.component';
// import { LossreasonComponent } from '../opportunity/pages/opportunity-view/tabs/lossreason/lossreason.component';

// import { OBDistributionComponent } from '../opportunity/pages/opportunity-view/tabs/ob-distribution/ob-distribution.component';
// import { OrderComponent } from '../opportunity/pages/opportunity-view/tabs/order/order.component';
import { OrderMoreViewComponent } from './pages/order-more-view/order-more-view.component';

const routes: Routes = [
  {
    path: '', component: OrderLandingComponent,
  },
  {
    path: 'createamendment', component: CreateAmendmentComponent,
  },
  {
    path: 'createamendmentchild', component: CreateAmendmentChildComponent,
  },
  // {
  //   path: 'orderdetails', component: OrderDetailsComponent,
  //   children:[
  //   {path: 'overview', component: OverviewComponent },
  //   {path: 'businesssolution', component: BusinessSolutionComponent },
  //   {path: 'competitor', component: CompetitorComponent },
  //   {path: 'contracts', component: ContractsComponent },
  //   {path: 'deal', component: DealComponent },
  //   {path: 'team', component: TeamComponent },
  //   {path:'obdistribution', component:OBDistributionComponent},
  //   {path:'closereason', component:ClosereasonComponent},
  //   {path:'lossreasons', component:LossreasonComponent},
  //   {path: 'order', component: OrderComponent},
  //   // {path: 'orderpage', component: OrderpageComponent}

  //   ]
  // },
  {path: 'moreviews', component: OrderMoreViewComponent },
  {
    path: 'orderlistbfmchild', component: OrderListBfmChildComponent,
    children:[
      {
        path: 'systemchecks', component: SystemChecksComponent,
      },
      // {
      //   path: 'userdeclarations', component: UserDeclarationsComponent,
      // },
      {
        path: 'manualchecks', component: ManualChecksComponent,
      }
    ]
  },
  
  {
    path: 'orderchild', component: OrderListComponent,
    children:[
    ]
  },
  {
    path: 'orderchildadh', component: OrderListAdhChildComponent,
    children:[
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class OrderRoutingModule { }
