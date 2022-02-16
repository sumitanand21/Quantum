import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderRoutingModule } from './order-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { OrderLandingComponent, retagTracePopup, ReminderPopup, ApproverAssignmentPopup, ReschedulePopup } from './pages/order-landing/order-landing.component';
// import { OrderLandingComponent,  } from './pages/order-landing/order-landing.component';
import { OrderListBfmChildComponent } from './pages/order-list-bfm-child/order-list-bfm-child.component';
import { SystemChecksComponent } from './pages/order-list-bfm-child/tabs/system-checks/system-checks.component';
import { ManualChecksComponent } from './pages/order-list-bfm-child/tabs/manual-checks/manual-checks.component';
import { OrderListComponent } from './pages/order-list/order-list.component';
import { OrderListAdhChildComponent } from './pages/order-list-adh-child/order-list-adh-child.component';
import {PopoverModule} from "ngx-smart-popover";
// import { AssignpopupComponent } from './modal/assignpopup/assignpopup.component';
import { RejectpopupComponent } from './modal/rejectpopup/rejectpopup.component';
import { OnholdpopupComponent } from './modal/onholdpopup/onholdpopup.component';
import { ApprovepopupComponent } from './modal/approvepopup/approvepopup.component';
// import { OrderDetailsComponent } from './pages/order-list-bfm-child/left_nav/order-details/order-details.component';
import { CreateAmendmentComponent } from './pages/create-amendment/create-amendment.component';
import { CreateAmendmentChildComponent } from './pages/create-amendment-child/create-amendment-child.component';
import { CreateAmendmentPopupComponent } from './modal/create-amendment-popup/create-amendment-popup.component';
import { OpportunityModule } from '../opportunity/opportunity.module';
import { OpportunityRoutingModule } from '../opportunity/opportunity-routing.module';
import { ApprovebfmComponent } from './modal/approvebfm/approvebfm.component';
import { OrderMoreViewComponent } from './pages/order-more-view/order-more-view.component';


@NgModule({
  declarations: [OrderLandingComponent,retagTracePopup,ReminderPopup, ApproverAssignmentPopup,ReschedulePopup, OrderListBfmChildComponent, SystemChecksComponent, ManualChecksComponent, OrderListComponent, OrderListAdhChildComponent, RejectpopupComponent, OnholdpopupComponent, ApprovepopupComponent, CreateAmendmentComponent, CreateAmendmentChildComponent, CreateAmendmentPopupComponent, ApprovebfmComponent, OrderMoreViewComponent],
  imports: [
    CommonModule,
    OrderRoutingModule,
    SharedModule,
    PopoverModule,
    OpportunityModule,
    OpportunityRoutingModule
   
  ],
  entryComponents:[RejectpopupComponent,OnholdpopupComponent,ApprovepopupComponent,CreateAmendmentPopupComponent,ApprovebfmComponent,retagTracePopup,ReminderPopup,ApproverAssignmentPopup,ReschedulePopup]
})
export class OrderModule { }
