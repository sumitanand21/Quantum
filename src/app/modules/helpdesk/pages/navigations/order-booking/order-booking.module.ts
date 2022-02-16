import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualPushComponent } from './manual-push/manual-push.component';
import { TransferSLBDMComponent } from './transfer-slbdm/transfer-slbdm.component';
import { OrderAMDTransferComponent } from './order-amd-transfer/order-amd-transfer.component';
import { TrackOrderComponent } from './track-order/track-order.component';
import { VerticalOwnerChangeComponent } from './vertical-owner-change/vertical-owner-change.component';
import { CRMReferenceComponent } from './crm-reference/crm-reference.component';
import { SharedModule } from '@app/shared';

@NgModule({
  declarations: [ManualPushComponent, TransferSLBDMComponent, OrderAMDTransferComponent, TrackOrderComponent, VerticalOwnerChangeComponent, CRMReferenceComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    ManualPushComponent
  ]
})
export class OrderBookingModule { }
