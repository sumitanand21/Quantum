import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelpdeskLandingComponent } from './pages/helpdesk-landing/helpdesk-landing.component';
import { ManualPushComponent } from './pages/navigations/order-booking/manual-push/manual-push.component';
import { OrderBookingModule } from './pages/navigations/order-booking/order-booking.module';
import { TransferSLBDMComponent } from './pages/navigations/order-booking/transfer-slbdm/transfer-slbdm.component';
import { OrderAMDTransferComponent } from './pages/navigations/order-booking/order-amd-transfer/order-amd-transfer.component';
import { TrackOrderComponent } from './pages/navigations/order-booking/track-order/track-order.component';
import { VerticalOwnerChangeComponent } from './pages/navigations/order-booking/vertical-owner-change/vertical-owner-change.component';
import { CRMReferenceComponent } from './pages/navigations/order-booking/crm-reference/crm-reference.component';
import { OpportunityActionsModule } from './pages/navigations/opportunity-actions/opportunity-actions.module';
import { OwnerChangeOppComponent } from './pages/navigations/opportunity-actions/owner-change-opp/owner-change-opp.component';
import { TrackOpportunityComponent } from './pages/navigations/opportunity-actions/track-opportunity/track-opportunity.component';
import { AccountMergeComponent } from './pages/navigations/account-actions/account-merge/account-merge.component';
import { AccDelMgrChangeComponent } from './pages/navigations/account-actions/acc-del-mgr-change/acc-del-mgr-change.component';
import { AccountMergeLandingComponent } from './pages/navigations/account-actions/pages/account-merge-landing/account-merge-landing.component';
import { ResultComponent } from './pages/navigations/account-actions/pages/result/result.component';
import { MergeSummaryComponent } from './pages/navigations/account-actions/pages/merge-summary/merge-summary.component';
import { PreviewTargetComponent } from './pages/navigations/account-actions/pages/preview-target/preview-target.component';
import { TargetAccountComponent } from './pages/navigations/account-actions/pages/target-account/target-account.component';
import { SourceAccountComponent } from './pages/navigations/account-actions/pages/source-account/source-account.component';
import { RequestDetailsComponent } from './pages/navigations/account-actions/pages/request-details/request-details.component';

const routes: Routes = [
  {
    path: '', component: HelpdeskLandingComponent,
    children: [
      { path: '', redirectTo: 'orderBookings', pathMatch: 'full' },
      {
        path: 'orderBookings',
        loadChildren: './pages/navigations/order-booking/order-booking.module#OrderBookingModule',
        children: [
          { path: '', redirectTo: 'manualPath', pathMatch: 'full' },
          { path: 'manualPath', component: ManualPushComponent },
          { path: 'SLBDM', component: TransferSLBDMComponent },
          { path: 'orderTransfer', component: OrderAMDTransferComponent },
          { path: 'trackOrder', component: TrackOrderComponent },
          { path: 'orderOwnerChange', component: VerticalOwnerChangeComponent },
          { path: 'CRM_Ref', component: CRMReferenceComponent },
        ]
      },
      {
        path: 'oppActions',
        loadChildren: './pages/navigations/opportunity-actions/opportunity-actions.module#OpportunityActionsModule',
        children: [
          { path: '', redirectTo: 'ownerChange', pathMatch: 'full' },
          { path: 'ownerChange', component: OwnerChangeOppComponent },
          { path: 'trackOpp', component: TrackOpportunityComponent },
        ]
      },
      {
        path: 'accActions',
        loadChildren: './pages/navigations/account-actions/account-actions.module#AccountActionsModule',
        children: [
          { path: '', redirectTo: 'accountmerge', pathMatch: 'full' },
          {
            path: 'accountmerge', component: AccountMergeComponent
          },

          {
            path: 'mergelanding', component: AccountMergeLandingComponent,
            children: [
              { path: 'requestdetails', component: RequestDetailsComponent },
              { path: 'sourceaccount', component: SourceAccountComponent },
              { path: 'targetaccount', component: TargetAccountComponent },
              { path: 'previewaccount', component: PreviewTargetComponent },
              { path: 'mergesummary', component: MergeSummaryComponent },
              { path: 'results', component: ResultComponent },
            ]

          },

      { path: 'accountdelivery', component: AccDelMgrChangeComponent },


    ]
  },

  //     children: [

  //         { path: 'tagged', component: TaggedOpportunitiesComponent },
  //         { path: 'existing', component: ExistingDealsComponent },
  //     ]
  // },
  // {
  //     path: 'existingTabs', component: ExistingDealDetailsComponent,
  //     children: [
  //         { path: 'overview', component: DealOverviewComponent },
  //         { path: 'team', component: DealTeamComponent },
  //         { path: 'module', component: DealModuleComponent },
  //         {
  //             path: 'commercial',
  //             loadChildren: './pages/existing-deal-details/tabs/deal-commercials/commercial.module#CommercialModule'
  //         },
  //         { path: 'techSolution', component: DealTechSolutionComponent },
  //         { path: 'calendar', component: DealCalendarComponent }
  //     ]
  // },
  // { path: 'attachedDocs', component: AttachDocumentsComponent },
  // { path: 'createDeal', component: CreateDealComponent },
  // { path: 'taggedSummary', component: TaggedDealSummaryComponent },
  // { path: 'createDocument', component: CreateNewDocumentComponent },
  // { path: 'editDocument', component: EditDocumentComponent },
  // { path: 'createAction', component: CreateActionComponent },
  // { path: 'pastDeal', component: PastDealsComponent },
  // { path: 'rlsView', component: RlsViewComponent },
  // { path: 'createNewAction', component: CreateNewActionComponent },
  // { path: 'TrackerEditPage', component: TrackerEditPageComponent }

]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    OrderBookingModule,
    OpportunityActionsModule
  ],
  exports: [RouterModule]
})
export class HelpdeskRoutingModule { }
