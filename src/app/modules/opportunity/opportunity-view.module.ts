import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { confirmPopUp,integratedDealPopup,ReopenOpportunityPopComponentt,Leadspopup,OpportunityViewComponent, dealQualifierpopup, manualprobabilitypopup, estimtedclosuredate, UserTargetsPopup, ProceedtoQualifypopup, proceedwithoutnurturepopup, LinkLeadspopup,Pursuitpopup, securedealpopup, ConfirmSaveComponent, OnHoldPopComponent, RejectPopComponent, omchangepopup,Approveopportunitypopup } from './pages/opportunity-view/opportunity-view.component';
import { UserDeclarationsComponent,poNumberPopup } from '../order/pages/order-list-bfm-child/tabs/user-declarations/user-declarations.component';
import { OverviewComponent} from './pages/opportunity-view/tabs/overview/overview.component';
// import { BusinessSolutionComponent,OpenBusinessSolution, OpenTcvpopupcomponent, Openciopopupcomponent, deleteIP1, deleteserviceLine1,OpenIP,OpenServiceline, OrderrByIndexPipe} from './pages/opportunity-view/tabs/business-solution/business-solution.component';
import { BusinessSolutionComponent,OpenBusinessSolution,  OrderrByIndexPipe} from './pages/opportunity-view/tabs/business-solution/business-solution.component';
import { CompetitorComponent } from './pages/opportunity-view/tabs/competitor/competitor.component';
import { DealComponent ,deleteLineItem} from './pages/opportunity-view/tabs/deal/deal.component';
import { TeamComponent ,DeleteTeamMember} from './pages/opportunity-view/tabs/team/team.component';
import { OBDistributionComponent } from './pages/opportunity-view/tabs/ob-distribution/ob-distribution.component';
import { ClosereasonComponent } from './pages/opportunity-view/tabs/closereason/closereason.component';
import { LossreasonComponent } from './pages/opportunity-view/tabs/lossreason/lossreason.component';
import { OrderComponent, UploadSOWPopup, UploadDocumentPopup, LinkActivityPopup, SubmitOrderPopup, OrderApprovalPopup,UploadLOIPopup, ContractPopup, Requestpopup, Requestinvoicepopup, poDetailspopup, ReSubmissionOrderPopup, delaypopcomponent, UploadContractpopComponent,reminderCommentPopup } from './pages/opportunity-view/tabs/order/order.component';
import { OpportunityRoutingModule } from './opportunity-routing.module';
import { PopoverModule } from 'ngx-smart-popover';
import { SharedModule } from '@app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ClickOutsideModule } from 'ng-click-outside';
import { FileUploadModule } from 'ng2-file-upload';
import { OpportunityModule } from './opportunity.module';
import { OpportunityModalModule } from './opportunity-modal.module';
import { OrderapprovepopupComponent } from './pages/opportunity-view/orderapprovepopup/orderapprovepopup.component';
import { OpportunityViewRoutingModule } from './opportunity-view-routing.module';
import { EndSalesCycleComponent } from './pages/end-sales-cycle/end-sales-cycle.component';
import { ChangeOpportunityComponent ,SuccessOpportunityComponent} from './pages/change-opportunity/change-opportunity.component';
import { CancelPopupComponent } from './pages/opportunity-view/modals/cancel-popup/cancel-popup.component';
import { RemindbfmPopupComponent } from './pages/opportunity-view/modals/remindbfm-popup/remindbfm-popup.component';
import { InitiatestaffingComponent,StaffInitiatedPopup } from './pages/opportunity-view/modals/initiatestaffing/initiatestaffing.component';
import { OrderRejectmodifiedPopupComponent } from './pages/opportunity-view/modals/order-rejectmodified-popup/order-rejectmodified-popup.component';



 

 
@NgModule({
  declarations: [
    OrderRejectmodifiedPopupComponent,
    InitiatestaffingComponent, 
    StaffInitiatedPopup,
    RemindbfmPopupComponent,
    CancelPopupComponent,
    ChangeOpportunityComponent,
    SuccessOpportunityComponent,
    OnHoldPopComponent,
    UserDeclarationsComponent,
    delaypopcomponent,
    RejectPopComponent,
    OpportunityViewComponent,
    OverviewComponent,
    BusinessSolutionComponent,
    CompetitorComponent,
    DealComponent,
    deleteLineItem,
    OverviewComponent,
    TeamComponent,
    OpenBusinessSolution,
    
    // deleteIP1,
    // deleteserviceLine1,
     dealQualifierpopup,
     manualprobabilitypopup,
     estimtedclosuredate,
     UserTargetsPopup,
     ProceedtoQualifypopup,
    proceedwithoutnurturepopup,
    LinkLeadspopup,
    Leadspopup,
    ReopenOpportunityPopComponentt,
    confirmPopUp,
    integratedDealPopup,
    Pursuitpopup,
    OBDistributionComponent,
    ClosereasonComponent,
    OrderComponent,
    UploadSOWPopup,
    UploadDocumentPopup,
    LinkActivityPopup,
    reminderCommentPopup,
    SubmitOrderPopup,
    OrderApprovalPopup,
    UploadLOIPopup,
    DeleteTeamMember,
    securedealpopup,
    ContractPopup,
    ConfirmSaveComponent,
    Requestpopup,
    Requestinvoicepopup,
    poDetailspopup,
   
   
    LossreasonComponent,
    ReSubmissionOrderPopup,
    poNumberPopup,
    UploadContractpopComponent,
    omchangepopup,
    Approveopportunitypopup,
    OrderrByIndexPipe,
    OrderapprovepopupComponent,
    EndSalesCycleComponent
   

  ],
  imports: [
    CommonModule,
    OpportunityViewRoutingModule,
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
    OrderRejectmodifiedPopupComponent,
    InitiatestaffingComponent, 
    StaffInitiatedPopup,
    CancelPopupComponent,
    RemindbfmPopupComponent,
    SuccessOpportunityComponent,
    OnHoldPopComponent,
    delaypopcomponent,
    UploadContractpopComponent,
    RejectPopComponent,
    OpenBusinessSolution,
    
    // deleteIP1,
    // deleteserviceLine1,
    dealQualifierpopup,
    manualprobabilitypopup,
    estimtedclosuredate,
    UserTargetsPopup,
    ProceedtoQualifypopup,
    proceedwithoutnurturepopup,
    LinkLeadspopup,
    Leadspopup,
    ReopenOpportunityPopComponentt,
    confirmPopUp,
    integratedDealPopup,
    Pursuitpopup,
    UploadSOWPopup,
    UploadDocumentPopup,
    LinkActivityPopup,
    reminderCommentPopup,
    SubmitOrderPopup,
    OrderApprovalPopup,
    UploadLOIPopup,
    DeleteTeamMember,
    securedealpopup,
    ContractPopup,
    ConfirmSaveComponent,
    Requestpopup,
    Requestinvoicepopup,
    poDetailspopup,
    deleteLineItem,
    
    ReSubmissionOrderPopup,
    poNumberPopup,
    omchangepopup,
    Approveopportunitypopup,
    OrderapprovepopupComponent
    

  ]
})
export class OpportunityViewModule { }
