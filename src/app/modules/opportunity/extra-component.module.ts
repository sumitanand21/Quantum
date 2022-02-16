import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewcontractComponent, ExecuteContractPopup } from './pages/opportunity-view/tabs/contracts/newcontract/newcontract.component';
import { MyopenOpportunitiesComponent } from './pages/landing-opportunity/tabs/myopen-opportunities/myopen-opportunities.component';
import { OpenOpportunitiesComponent } from './pages/landing-opportunity/tabs/open-opportunities/open-opportunities.component';
import { ContractsComponent, AccessRequestedPopup, UploadContractPopup } from './pages/opportunity-view/tabs/contracts/contracts.component';
import { ContractRepoComponent, Notepop } from './pages/opportunity-view/tabs/contracts/tabs/contract-repository/contract-repository.component';
import { PendingComponent, NotepopPending } from './pages/opportunity-view/tabs/contracts/tabs/pending-requests/pending-requests.component';
import { PaidPocComponent } from './pages/paid-poc/paid-poc.component';
import { ReopenApprovalsComponent } from './pages/reopen-approvals/reopen-approvals.component';
import { WinLossReasonsComponent } from './pages/win-loss-reasons/win-loss-reasons.component';
import { OrderDetailsComponent } from '../order/pages/order-list-bfm-child/left_nav/order-details/order-details.component';
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
    NewcontractComponent,
    ExecuteContractPopup,
    MyopenOpportunitiesComponent,
    OpenOpportunitiesComponent,
    ContractsComponent,
    AccessRequestedPopup,
    UploadContractPopup,
    ContractRepoComponent,
    Notepop,
    PendingComponent,
    NotepopPending,
    PaidPocComponent,
    ReopenApprovalsComponent,
    WinLossReasonsComponent,
    OrderDetailsComponent
   ],
  exports: [],

  imports: [
    CommonModule,
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
   ],
  providers: [
   ]

})
export class ExtraComponentModule { }
