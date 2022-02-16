import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { AccountCreationComponent } from './account-creation.component';
import { ActiveRequestsComponent } from './tabs/active-requests/active-requests.component';
import { CreationHistoryComponent } from './tabs/creation-history/creation-history.component';
import { CreateNewAccountComponent,Prospectaccount } from '../create-new-account/create-new-account.component';
import { CreateProspectAccountComponent,ProspectSubmit, ProspectSubmitPopup, OpenProspectAccountOwner,  cancelpopComponent } from '../create-prospect-account/create-prospect-account.component';
import { ProspectAccountCreationComponent } from '../prospect-account-creation/prospect-account-creation.component';
// import { ReviewNewAccountComponent } from 
import { ReviewNewAccountComponent, OpenReworkComments, OpenSubmitComments, OpenApproveComments, OpenRejectComments, openActivate,OpenSubmitrework } from '../review-new-account/review-new-account.component';
import { ConfirmProspectComponent } from '../prospect-account-creation/confirm-prospect/confirm-prospect.component';
import { PopoverModule } from "ngx-smart-popover";
import { AccountCreationRoutingModule } from './account-creation-route.module';
// import { GenericProspectAccount } from '@app/shared/components/generic-prospect-account/generic.prospect.account';
@NgModule({
  declarations: [ProspectAccountCreationComponent ,ConfirmProspectComponent,ProspectSubmit, ProspectSubmitPopup, OpenProspectAccountOwner,  cancelpopComponent,AccountCreationComponent,ActiveRequestsComponent,CreationHistoryComponent,CreateNewAccountComponent,CreateProspectAccountComponent,ProspectAccountCreationComponent,ReviewNewAccountComponent,Prospectaccount,OpenSubmitComments, OpenApproveComments, OpenRejectComments,OpenSubmitrework, OpenReworkComments, openActivate],
  imports: [
    CommonModule,
    AccountCreationRoutingModule,
    SharedModule,  
    PopoverModule 
  ],
  entryComponents: [ProspectAccountCreationComponent,ConfirmProspectComponent,ProspectSubmit, ProspectSubmitPopup, OpenProspectAccountOwner,  cancelpopComponent,Prospectaccount, OpenReworkComments, OpenSubmitComments, OpenApproveComments, OpenRejectComments, openActivate,OpenSubmitrework ],
  exports: [],
  providers: []
})
export class AccountCreationgModule { }
