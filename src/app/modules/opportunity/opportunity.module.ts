import { NgModule } from '@angular/core';
// import { GainAccess } from './pages/opportunity-finder/opportunity-finder.component';
// import { assignpopComponent } from '@app/shared/modals/assign-popup/assign-popup.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import {PopoverModule} from "ngx-smart-popover";

import { OpportunityRoutingModule } from './opportunity-routing.module';
import { LandingOpportunityComponent } from './pages/landing-opportunity/landing-opportunity.component';
import { AllOpportunitiesComponent,modifypopComponent,ReopenOpportunityPopComponent } from './pages/landing-opportunity/tabs/all-opportunities/all-opportunities.component';
// import { OpenOpportunitiesComponent } from './pages/landing-opportunity/tabs/open-opportunities/open-opportunities.component';
// import { MyopenOpportunitiesComponent } from './pages/landing-opportunity/tabs/myopen-opportunities/myopen-opportunities.component';
import { NewOpportunityComponent, attachpop, ConvertNormalDealPopup } from './pages/new-opportunity/new-opportunity.component';
// import { RenewalOpportunityComponent, createpopupcomponent } from './pages/renewal-opportunity/renewal-opportunity.component';
// import { IncrementalOpportunityComponent,createpopupcomponent2 } from './pages/incremental-opportunity/incremental-opportunity.component';
// import { PaidPocComponent } from './pages/paid-poc/paid-poc.component';

import { OrderModule } from 'ngx-order-pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from '@app/shared/shared.module';


// import { ContractsComponent, AccessRequestedPopup, UploadContractPopup } from '@app/modules/opportunity/pages/opportunity-view/tabs/contracts/contracts.component';
// import { suspendedpopComponent } from '@app/shared/modals/suspend-popup/suspend-popup.component';

// custome date format start
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
// import { OpportunityFinderComponent } from './pages/opportunity-finder/opportunity-finder.component';
import { ShowAllOpportunitiesComponent,SaveViewComponent } from './pages/show-all-opportunities/show-all-opportunities.component';
import { AllOpportunityComponent } from './pages/all-opportunity/all-opportunity.component';

// import { NewAgeBusinessPartnerComponent } from './pages/new-age-business-partner/new-age-business-partner.component';
// import { AddAllianceComponent } from './pages/add-alliance/add-alliance.component';
// import { AddServiceLineComponent } from './pages/add-service-line/add-service-line.component';
// import { AddIpComponent } from './pages/add-ip/add-ip.component';
// import { OpportunityGuidelineComponent } from './pages/opportunity-guideline/opportunity-guideline.component';
// import { OpportunityInsightComponent } from './pages/opportunity-insight/opportunity-insight.component';
// import { DealDashboardReportComponent } from './pages/deal-dashboard-report/deal-dashboard-report.component';
// import { DealSnapshotComponent } from './pages/deal-snapshot/deal-snapshot.component';
// import { ChangeOpportunityComponent, SuccessOpportunityComponent } from './pages/change-opportunity/change-opportunity.component';

// import { CommitmentRegisterComponent } from'./pages/commitment-register/commitment-register.component';
// import { CommitmentRegisterDetailsComponent,uploadPopup } from'./pages/commitment-register-details/commitment-register-details.component';
import { BusinessSolutionSearchComponent } from './pages/business-solution-search/business-solution-search.component';
// import { EndSalesCycleComponent } from './pages/end-sales-cycle/end-sales-cycle.component';

// import { PendingComponent,NotepopPending } from './pages/opportunity-view/tabs/contracts/tabs/pending-requests/pending-requests.component';
// import { ContractRepoComponent,Notepop } from './pages/opportunity-view/tabs/contracts/tabs/contract-repository/contract-repository.component';
import { IpAdditionalDetailsComponent} from './pages/ip-additional-details/ip-additional-details.component';
// OpenipDeletecomponent, additionalipDeletecomponent  
import { ServiceLineAdditionalDetailsComponent } from './pages/service-line-additional-details/service-line-additional-details.component';
// import { ReopenApprovalsComponent } from './pages/reopen-approvals/reopen-approvals.component';
// import { RiskregisterComponent } from './pages/riskregister/riskregister.component';
// import { KnowledgemanagementComponent } from './pages/knowledgemanagement/knowledgemanagement.component';
// import { NewcontractComponent, ExecuteContractPopup } from './pages/opportunity-view/tabs/contracts/newcontract/newcontract.component';
// import { NewresidualComponent, residualcreatedpopup } from './pages/opportunity-view/modals/newresidual/newresidual.component';
// import { ContractExecutionComponent } from './pages/opportunity-view/modals/contract-execution/contract-execution.component';
import { FileUploadModule } from 'ng2-file-upload';
import { ServicelineClouddetailsComponent } from './pages/serviceline-clouddetails/serviceline-clouddetails.component';
// import { CreateamendmentComponent } from './pages/opportunity-view/modals/createamendment/createamendment.component';
// import { OrderAuditComponent } from './pages/order-audit/order-audit.component';
// import { OrderBookingComponent } from './pages/order-booking/order-booking.component';
// import { OrderHierarchyComponent } from './pages/order-hierarchy/order-hierarchy.component';
import { TreeviewComponent } from './pages/order-hierarchy/tree-view/tree-view.component';

// import { OrderSitemapComponent } from './pages/order-sitemap/order-sitemap.component';
// import { ViewindentComponent, FeedbackPopup } from './pages/viewindent/viewindent.component';
// import { EmailhistoryComponent} from './pages/emailhistory/emailhistory.component';
// import { ModifyorderComponent, openSubmitPopup, openImpactPopup ,modifiedpodetailspopup} from './pages/modifyorder/modifyorder.component';
// import { SearchpoaHoldersComponent } from './pages/searchpoa-holders/searchpoa-holders.component';
// import { CancelPopupComponent } from './pages/opportunity-view/modals/cancel-popup/cancel-popup.component';
// import { RemindbfmPopupComponent } from './pages/opportunity-view/modals/remindbfm-popup/remindbfm-popup.component';
// import { EmailLandingPageComponent } from './pages/email-landing-page/email-landing-page.component';
// import { InitiatestaffingComponent, StaffInitiatedPopup } from './pages/opportunity-view/modals/initiatestaffing/initiatestaffing.component';
// import { OrderRejectmodifiedPopupComponent } from './pages/opportunity-view/modals/order-rejectmodified-popup/order-rejectmodified-popup.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RevokeAccessComponent } from './pages/revoke-access/revoke-access.component';
// import { RetagOrderComponent, ConfirmPopUp, SubmitPopUp } from './pages/retag-order/retag-order.component';
import { OBforecastComponent } from './pages/obforecast/obforecast.component';
import { RejectpopupComponent } from '../order/modal/rejectpopup/rejectpopup.component';
// import { WinLossReasonsComponent } from './pages/win-loss-reasons/win-loss-reasons.component';
// import { AccountModule } from '../account/account.module';
// import { OrderapprovepopupComponent } from './pages/opportunity-view/orderapprovepopup/orderapprovepopup.component';
import { OpportunityModalModule } from './opportunity-modal.module';
// import { SharePopupComponent } from './pages/landing-opportunity/tabs/all-opportunities/share-popup/share-popup.component';
// import { SowMapPopupComponent } from './pages/opportunity-view/modals/sow-map-popup/sow-map-popup.component';
export const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
// custome date format ends

@NgModule({
  declarations: [
    TreeviewComponent,
      // OrderapprovepopupComponent,


    // GainAccess,
    // suspendedpopComponent,
    ReopenOpportunityPopComponent,
    // CommitmentRegisterComponent,
    modifypopComponent,
    // assignpopComponent,
    // CommitmentRegisterDetailsComponent,
    // uploadPopup,
    LandingOpportunityComponent,
    AllOpportunitiesComponent,
    // OpenOpportunitiesComponent,
    // MyopenOpportunitiesComponent,
    NewOpportunityComponent,
    // RenewalOpportunityComponent,
    // IncrementalOpportunityComponent,
    // PaidPocComponent,
   
    SaveViewComponent,
   
    // ContractsComponent,
    
    attachpop,
    // print 4 added new start
    ShowAllOpportunitiesComponent,
    // OpportunityFinderComponent,
    AllOpportunityComponent,
   
    // NewAgeBusinessPartnerComponent,
    // AddAllianceComponent,
    // AddServiceLineComponent,
    // AddIpComponent,
    // OpportunityGuidelineComponent,
    // OpportunityInsightComponent,
    // DealDashboardReportComponent,
    // DealSnapshotComponent,
    // ChangeOpportunityComponent,
    BusinessSolutionSearchComponent,
    // EndSalesCycleComponent,
    // PendingComponent,
    // ContractRepoComponent,
    // Notepop,
    // NotepopPending,
    IpAdditionalDetailsComponent,
    ServiceLineAdditionalDetailsComponent,
    ConvertNormalDealPopup,
    // OpenipDeletecomponent,
    //  additionalipDeletecomponent,
     
    //  createpopupcomponent,
    //  createpopupcomponent2,
    //  ReopenApprovalsComponent,
   
    //  SuccessOpportunityComponent,

    
    
    //  NewcontractComponent,
    //  NewresidualComponent,
    //  ContractExecutionComponent,
     ServicelineClouddetailsComponent,
    //  modifiedpodetailspopup,
    //  residualcreatedpopup,
    //  CreateamendmentComponent,
    //  AccessRequestedPopup,
    //  UploadContractPopup,
    //  ExecuteContractPopup,
    //  OrderAuditComponent,
    // OrderBookingComponent,
    // OrderHierarchyComponent,
    // OrderSitemapComponent,
    // ViewindentComponent,
    // EmailhistoryComponent,
    // ModifyorderComponent,
    // openSubmitPopup,
    // FeedbackPopup,
    // SearchpoaHoldersComponent,
    // openImpactPopup,
    // CancelPopupComponent,
    // RemindbfmPopupComponent,
    // EmailLandingPageComponent,
  
    // InitiatestaffingComponent,
    // StaffInitiatedPopup,
    // OrderRejectmodifiedPopupComponent,
    RevokeAccessComponent,
    // RetagOrderComponent,
    OBforecastComponent,
    // ConfirmPopUp,
    // SubmitPopUp,
  
    // WinLossReasonsComponent,
   
    // SharePopupComponent,
   
    // SowMapPopupComponent,
    // sprint 4 added new end
    
  ],
  exports: [],

  imports: [
    // AccountModule,
 PopoverModule,
    CommonModule,
    SharedModule,
    OrderModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    Ng2SearchPipeModule,
    DragDropModule,
    ClickOutsideModule,
    OpportunityRoutingModule,
    FileUploadModule,
    OpportunityModalModule
  ],
  entryComponents: [
    TreeviewComponent,
    // SharePopupComponent,
    // OrderapprovepopupComponent,

    
  
    
    // GainAccess,
    // suspendedpopComponent,
    modifypopComponent,
    // assignpopComponent,
    ReopenOpportunityPopComponent,
    SaveViewComponent,
    attachpop,
   
    // Notepop,
    // NotepopPending,
    ConvertNormalDealPopup,
    // OpenipDeletecomponent,
    //  additionalipDeletecomponent,
    //  createpopupcomponent,
    //  createpopupcomponent2,
    //  SuccessOpportunityComponent,
    //  NewresidualComponent,
    //  ContractExecutionComponent,
    //  modifiedpodetailspopup,
    //  residualcreatedpopup,
    //  CreateamendmentComponent,
    //  AccessRequestedPopup,
    //  UploadContractPopup,
    //  ExecuteContractPopup,
    //  openSubmitPopup,
    //  FeedbackPopup,
    //   openImpactPopup,
    //  CancelPopupComponent,
    //  RemindbfmPopupComponent,
    // InitiatestaffingComponent,
    //  StaffInitiatedPopup,
    //  OrderRejectmodifiedPopupComponent,
    //  ConfirmPopUp,SubmitPopUp,
    //  SowMapPopupComponent

  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }

    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
  ]

})
export class OpportunityModule { }
