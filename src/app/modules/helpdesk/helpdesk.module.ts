import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnerChangeOppComponent } from './pages/navigations/opportunity-actions/owner-change-opp/owner-change-opp.component';
import { HelpdeskRoutingModule } from './helpdesk-routing.module';
import { HelpdeskLandingComponent } from './pages/helpdesk-landing/helpdesk-landing.component';
import { HelpdeskNavComponent } from './pages/helpdesk-nav/helpdesk-nav.component';
import { SharedModule } from '@app/shared';
import { OrderBookingModule } from './pages/navigations/order-booking/order-booking.module';
import { AccountActionsModule } from './pages/navigations/account-actions/account-actions.module';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {OrderactionsModule} from '@app/modules/opportunity/orderactions.module';
import { ConfirmPopUp} from '@app/modules/opportunity/pages/retag-order/retag-order.component';

@NgModule({
  declarations: [HelpdeskLandingComponent, HelpdeskNavComponent,OwnerChangeOppComponent],
  imports: [
    CommonModule,
    HelpdeskRoutingModule,
    SharedModule,
    OrderBookingModule,
    AccountActionsModule,
    OrderactionsModule
  ],
  entryComponents:[OwnerChangeOppComponent,ConfirmPopUp],
   providers: [
    // { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    // { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DIALOG_DATA, useValue: {} },
   { provide: MatDialogRef, useValue: {} }]
})
export class HelpdeskModule { }
