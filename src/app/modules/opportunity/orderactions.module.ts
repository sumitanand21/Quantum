import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderactionsRoutingModule } from './orderactions-routing.module';
import { OrderBookingComponent } from './pages/order-booking/order-booking.component';
import { OrderAuditComponent } from './pages/order-audit/order-audit.component';
import { OrderHierarchyComponent } from './pages/order-hierarchy/order-hierarchy.component';
import { OrderSitemapComponent } from './pages/order-sitemap/order-sitemap.component';
import { ViewindentComponent, FeedbackPopup } from './pages/viewindent/viewindent.component';
import { EmailhistoryComponent } from './pages/emailhistory/emailhistory.component';
import { ModifyorderComponent, openSubmitPopup, modifiedpodetailspopup, openImpactPopup } from './pages/modifyorder/modifyorder.component';
import { KnowledgemanagementComponent } from './pages/knowledgemanagement/knowledgemanagement.component';
import { RetagOrderComponent, ConfirmPopUp, SubmitPopUp } from './pages/retag-order/retag-order.component';
import { EmailLandingPageComponent } from './pages/email-landing-page/email-landing-page.component';
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
    OrderBookingComponent,
    OrderAuditComponent,
    OrderHierarchyComponent,
    OrderSitemapComponent,
    ViewindentComponent,
    FeedbackPopup,
    EmailhistoryComponent,
    ModifyorderComponent,
    openSubmitPopup,
    openImpactPopup,
    modifiedpodetailspopup,
    KnowledgemanagementComponent,
    RetagOrderComponent,
    ConfirmPopUp,
    SubmitPopUp,
    EmailLandingPageComponent 
    
    
  ],
  imports: [
    CommonModule,
    OrderactionsRoutingModule,
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
  entryComponents: [
    modifiedpodetailspopup,
    openSubmitPopup,
     FeedbackPopup,
      openImpactPopup,
      ConfirmPopUp,
    SubmitPopUp
  ],
  exports:[ConfirmPopUp]
})
export class OrderactionsModule { }
