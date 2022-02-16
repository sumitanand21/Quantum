import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import {PopoverModule} from "ngx-smart-popover";
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from '@app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { SharePopupComponent } from './pages/landing-opportunity/tabs/all-opportunities/share-popup/share-popup.component';
import { SowMapPopupComponent } from './pages/opportunity-view/modals/sow-map-popup/sow-map-popup.component';
import { SearchpoaHoldersComponent } from './pages/searchpoa-holders/searchpoa-holders.component';
import { suspendedpopComponent } from '@app/shared/modals/suspend-popup/suspend-popup.component';
import { OpenipDeletecomponent, additionalipDeletecomponent } from './pages/ip-additional-details/ip-additional-details.component';
import { NewresidualComponent, residualcreatedpopup } from './pages/opportunity-view/modals/newresidual/newresidual.component';
import { ContractExecutionComponent } from './pages/opportunity-view/modals/contract-execution/contract-execution.component';
import { CreateamendmentComponent } from './pages/opportunity-view/modals/createamendment/createamendment.component';
import { assignpopComponent } from '@app/shared/modals/assign-popup/assign-popup.component';

import { OrderOpenServiceline,OrderOpenIP, OrderdealRegisteredYesPopup, OrderdealRegisteredNoPopup } from './pages/opportunity-view/tabs/order/order.component';
import { deleteIP1,deleteserviceLine1, Openciopopupcomponent, OpenTcvpopupcomponent, OpenIP, OpenServiceline, dealRegisteredNoPopup, dealRegisteredYesPopup } from './pages/opportunity-view/tabs/business-solution/business-solution.component';

import { uploadPopup } from'./pages/commitment-register-details/commitment-register-details.component';




@NgModule({
  declarations: [
    OrderOpenServiceline, 
    OrderOpenIP,
    OrderdealRegisteredYesPopup,
    OrderdealRegisteredNoPopup,
    deleteIP1, deleteserviceLine1, Openciopopupcomponent,
     OpenTcvpopupcomponent, OpenIP, OpenServiceline,
     dealRegisteredYesPopup, dealRegisteredNoPopup,
    SharePopupComponent,
    SowMapPopupComponent,
    SearchpoaHoldersComponent,
    suspendedpopComponent,
    OpenipDeletecomponent,
    additionalipDeletecomponent,
    NewresidualComponent,
    ContractExecutionComponent,
    residualcreatedpopup,
    CreateamendmentComponent,
    assignpopComponent,
    deleteserviceLine1,
    deleteIP1,
    uploadPopup
  ],
  exports: [SharePopupComponent,
    SowMapPopupComponent,
    SearchpoaHoldersComponent,
    suspendedpopComponent,
    OpenipDeletecomponent,
    additionalipDeletecomponent,
    NewresidualComponent,
    ContractExecutionComponent,
    residualcreatedpopup,
    CreateamendmentComponent,
    assignpopComponent,
    deleteserviceLine1,
    deleteIP1,
    OrderOpenServiceline, 
    OrderOpenIP,
    OrderdealRegisteredYesPopup,
    OrderdealRegisteredNoPopup,
    deleteIP1, deleteserviceLine1, Openciopopupcomponent,
     OpenTcvpopupcomponent, OpenIP, OpenServiceline,uploadPopup,
     dealRegisteredYesPopup,
     dealRegisteredNoPopup
],

  imports: [
    // AccountModule,
 PopoverModule,
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    Ng2SearchPipeModule,
    DragDropModule,
    ClickOutsideModule,
    RouterModule
  ],
  entryComponents: [
    SharePopupComponent,
    SowMapPopupComponent,
    SearchpoaHoldersComponent,
    suspendedpopComponent,
    OpenipDeletecomponent,
    additionalipDeletecomponent,
    NewresidualComponent,
    ContractExecutionComponent,
    residualcreatedpopup,
    CreateamendmentComponent,
    assignpopComponent,
    deleteserviceLine1,
    deleteIP1,
    OrderOpenServiceline,
    dealRegisteredYesPopup,
    dealRegisteredNoPopup, 
    OrderOpenIP,
    OrderdealRegisteredYesPopup,
    OrderdealRegisteredNoPopup,
    deleteIP1, deleteserviceLine1, Openciopopupcomponent,
     OpenTcvpopupcomponent, OpenIP, OpenServiceline,
     uploadPopup
     ],
  providers: [
  ]

})
export class OpportunityModalModule { }
