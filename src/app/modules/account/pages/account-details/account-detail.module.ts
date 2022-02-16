import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
// import { EditReferenceComponent,Opensavereference } from '../edit-reference/edit-reference.component';
import { AccountDetailsTwoComponent } from '../account-details-two/account-details-two.component';
import { OwnershipHistoryListComponent } from '../ownership-history-list/ownership-history-list.component';
import { DashboardDetailsComponent } from '../dashboard-details/dashboard-details.component';
// import { AccountTransitionComponent ,Openownertransition  } from '../account-transition/account-transition.component';
import { AccountDetailRoutingModule } from './account-detail-route.module';
import { AccountDetailsComponent, CommentBoxComponent, Helpline, OpenAccountOwnerdetails, OpensaveComments,OpenrejectCBUpopupcomponent, RequestActivated, OpenaddAlliancepopupcomponent, OpenaddActivepopupcomponent, OpenaddCBUpopupcomponent ,OpenAddStandbypopupcomponent,OpenaddAdvisorypopupcomponent, DeactiveReferencePopup} from './account-details.component';
import { AccountSapUploadComponent } from './modals/account-sap-upload/account-sap-upload.component';
import { MultipleReferenceViewComponent } from './modals/multiple-reference-view/multiple-reference-view.component';
import { RetagOpportunityComponent } from './modals/retag-opportunity/retag-opportunity.component';
import { AddSecondaryOwnersComponent } from './modals/add-secondary-owners/add-secondary-owners.component';
import { PopoverModule } from "ngx-smart-popover";
import { NewsWidgetComponent } from '../news-widget/news-widget.component';
import { NodesListService } from '../tree/services/nodesList.service';
import { Tree } from '../tree/tree.component';
import { Node } from '../tree/node/node.component';
import { FileUploadModule } from 'ng2-file-upload';
import { AddBulkTeamMemberComponent } from '../add-bulk-team-member/add-bulk-team-member.component';
@NgModule({
  declarations: [AddBulkTeamMemberComponent,Tree,Node,NewsWidgetComponent,MultipleReferenceViewComponent,RetagOpportunityComponent,AddSecondaryOwnersComponent,AccountSapUploadComponent,CommentBoxComponent, Helpline, OpenAccountOwnerdetails, OpensaveComments,OpenrejectCBUpopupcomponent, RequestActivated, OpenaddAlliancepopupcomponent, OpenaddActivepopupcomponent, OpenaddCBUpopupcomponent ,OpenAddStandbypopupcomponent,OpenaddAdvisorypopupcomponent, DeactiveReferencePopup ,AccountDetailsTwoComponent,AccountDetailsComponent,AccountDetailsTwoComponent,OwnershipHistoryListComponent,DashboardDetailsComponent],
  imports: [
    CommonModule,
    AccountDetailRoutingModule,
    SharedModule, 
    PopoverModule ,
    FileUploadModule, 
  ],
  entryComponents: [MultipleReferenceViewComponent,RetagOpportunityComponent,AddSecondaryOwnersComponent,AccountSapUploadComponent,CommentBoxComponent, Helpline, OpenAccountOwnerdetails, OpensaveComments,OpenrejectCBUpopupcomponent, RequestActivated, OpenaddAlliancepopupcomponent, OpenaddActivepopupcomponent, OpenaddCBUpopupcomponent ,OpenAddStandbypopupcomponent,OpenaddAdvisorypopupcomponent, DeactiveReferencePopup],
  exports: [],
  providers: [NodesListService]
})
export class AccountDetailModule { }
