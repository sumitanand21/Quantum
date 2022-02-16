import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingOpportunityComponent } from './pages/landing-opportunity/landing-opportunity.component';
import { AllOpportunitiesComponent } from './pages/landing-opportunity/tabs/all-opportunities/all-opportunities.component';
// import { OpenOpportunitiesComponent } from './pages/landing-opportunity/tabs/open-opportunities/open-opportunities.component';
// import { MyopenOpportunitiesComponent } from './pages/landing-opportunity/tabs/myopen-opportunities/myopen-opportunities.component';
import { NewOpportunityComponent } from './pages/new-opportunity/new-opportunity.component';
import { RenewalOpportunityComponent } from './pages/renewal-opportunity/renewal-opportunity.component';
import { IncrementalOpportunityComponent } from './pages/incremental-opportunity/incremental-opportunity.component';
// import { PaidPocComponent } from './pages/paid-poc/paid-poc.component';
// import { WinLossReasonsComponent } from './pages/win-loss-reasons/win-loss-reasons.component';

import { ShowAllOpportunitiesComponent } from './pages/show-all-opportunities/show-all-opportunities.component';
import { OpportunityFinderComponent } from './pages/opportunity-finder/opportunity-finder.component';
import { AllOpportunityComponent } from './pages/all-opportunity/all-opportunity.component';
// import { AddServiceLineComponent } from './pages/add-service-line/add-service-line.component';
// import { AddIpComponent } from './pages/add-ip/add-ip.component';
// import { AddAllianceComponent } from './pages/add-alliance/add-alliance.component';
// import { NewAgeBusinessPartnerComponent } from './pages/new-age-business-partner/new-age-business-partner.component';
// import { OpportunityGuidelineComponent } from './pages/opportunity-guideline/opportunity-guideline.component';
// import { OpportunityInsightComponent } from './pages/opportunity-insight/opportunity-insight.component';
// import { DealDashboardReportComponent } from './pages/deal-dashboard-report/deal-dashboard-report.component';
// import { DealSnapshotComponent } from './pages/deal-snapshot/deal-snapshot.component';
// import { CommitmentRegisterDetailsComponent } from './pages/commitment-register-details/commitment-register-details.component';
import { ChangeOpportunityComponent } from './pages/change-opportunity/change-opportunity.component';
// import { CommitmentRegisterComponent } from './pages/commitment-register/commitment-register.component';
import { BusinessSolutionSearchComponent } from './pages/business-solution-search/business-solution-search.component';
// import { EndSalesCycleComponent } from './pages/end-sales-cycle/end-sales-cycle.component';
import { IpAdditionalDetailsComponent } from './pages/ip-additional-details/ip-additional-details.component';
import { ServiceLineAdditionalDetailsComponent } from './pages/service-line-additional-details/service-line-additional-details.component';
// import { ReopenApprovalsComponent } from './pages/reopen-approvals/reopen-approvals.component';
import { KnowledgemanagementComponent } from './pages/knowledgemanagement/knowledgemanagement.component';
import { NewcontractComponent } from './pages/opportunity-view/tabs/contracts/newcontract/newcontract.component';
import { ServicelineClouddetailsComponent } from './pages/serviceline-clouddetails/serviceline-clouddetails.component';
import { OrderBookingComponent } from './pages/order-booking/order-booking.component';
import { OrderAuditComponent } from './pages/order-audit/order-audit.component';
import { OrderHierarchyComponent } from './pages/order-hierarchy/order-hierarchy.component';
import { OrderSitemapComponent } from './pages/order-sitemap/order-sitemap.component';
import { ViewindentComponent } from './pages/viewindent/viewindent.component';
import { ModifyorderComponent } from './pages/modifyorder/modifyorder.component';
import { EmailhistoryComponent } from './pages/emailhistory/emailhistory.component';
import { EmailLandingPageComponent } from './pages/email-landing-page/email-landing-page.component';
import { SearchpoaHoldersComponent } from './pages/searchpoa-holders/searchpoa-holders.component';
import { RevokeAccessComponent } from './pages/revoke-access/revoke-access.component';
import { RetagOrderComponent } from './pages/retag-order/retag-order.component';
import { OBforecastComponent } from './pages/obforecast/obforecast.component';



const routes: Routes = [
  {
    path: '', component: LandingOpportunityComponent,


    children: [
      { path: 'allopportunity', component: AllOpportunitiesComponent },

      // extra
      // { path: 'openopportunity', component: OpenOpportunitiesComponent },
      // { path: 'myopenopportunity', component: MyopenOpportunitiesComponent },
      // { path: 'ReopenApprovals', component: ReopenApprovalsComponent }

    ]
  },
  // { path: '', loadChildren: './pages/landing-opportunity/landing-opportunity.module#LandingOpportunityModule'},
  { path: 'opportunityview', loadChildren: './opportunity-view.module#OpportunityViewModule',data: {preload: true} },
  { path: 'oppactions', loadChildren: './oppactions.module#OppactionsModule' },
  { path: 'orderactions', loadChildren: './orderactions.module#OrderactionsModule' },
  { path: 'createopp', loadChildren: './createopp.module#createoppModule' },
  { path: 'newopportunity', component: NewOpportunityComponent},
    
  // { path: 'changeOpportunity', component: ChangeOpportunityComponent },

  // extra
  // { path: 'winLossReasons', component: WinLossReasonsComponent },
  { path: 'allopportunityview', component: AllOpportunityComponent },
  { path: 'showOpportunity', component: ShowAllOpportunitiesComponent },

  // sprint 4  added new end




  // { path: 'addserviceline', component: AddServiceLineComponent },
  // { path: 'addip', component: AddIpComponent },
  // { path: 'addalliance', component: AddAllianceComponent },


  // { path: 'searchpoaheaders', component: SearchpoaHoldersComponent },


  // { path: 'orderbooking', component: OrderBookingComponent },
  // { path: 'orderaudit', component: OrderAuditComponent },
  // { path: 'orderhierarchy', component: OrderHierarchyComponent },
  // { path: 'ordersite', component: OrderSitemapComponent },
  // { path: 'viewindent', component: ViewindentComponent },
  // { path: 'emailhistory', component: EmailhistoryComponent },
  // { path: 'emaillandingpage', component: EmailLandingPageComponent },
  // { path: 'modifyorder', component: ModifyorderComponent },
  // { path: 'newagebusinesspartner', component: NewAgeBusinessPartnerComponent },
  // { path: 'opportunityinsight', component: OpportunityInsightComponent },
  // { path: 'opportunityguideline', component: OpportunityGuidelineComponent },
  // { path: 'dealdashboardreport', component: DealDashboardReportComponent },
  // { path: 'dealsnapshot', component: DealSnapshotComponent },
  // { path: 'commitmentregister', component: CommitmentRegisterComponent },
  // { path: 'commitmentregisterdetails', component: CommitmentRegisterDetailsComponent },
  { path: 'businesssolutionsearch', component: BusinessSolutionSearchComponent },
  // { path: 'opportunityendsalescycle', component: EndSalesCycleComponent },
  // { path: 'revokeaccess', component: RevokeAccessComponent },
  // { path: 'obforecast', component: OBforecastComponent },
  // { path: 'ipadditionaldetails', component: IpAdditionalDetailsComponent },
  // { path: 'servicelineadditionaldetails', component: ServiceLineAdditionalDetailsComponent },
  // { path: 'servicelineclouddetails', component: ServicelineClouddetailsComponent },
  // { path: 'knowledgemanagement', component: KnowledgemanagementComponent },
  // { path: 'newcontract', component: NewcontractComponent },
  // { path: 'retagOrder', component: RetagOrderComponent },

{ path: 'extra', loadChildren: './extra-component.module#ExtraComponentModule'}




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpportunityRoutingModule { }
