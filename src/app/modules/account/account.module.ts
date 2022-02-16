import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'ng2-file-upload';

import { AccountRoutingModule } from '@app/modules/account/account-routing.module';
import { AccountListLandingComponent } from '@app/modules/account/pages/account-list-landing/account-list-landing.component';
// import { AccountCreationComponent } from './pages/account-creation/account-creation.component';
// import { AssignmentRef } from './pages/assingment-ref/assingment-ref.component';
// import { CreateNewAccountComponent,Prospectaccount } from './pages/create-new-account/create-new-account.component';
// import { ReviewNewAccountComponent, OpenReworkComments, OpenSubmitComments, OpenApproveComments, OpenRejectComments, openActivate,OpenSubmitrework } from './pages/review-new-account/review-new-account.component';
import { FarmingComponent, SavePopup } from './pages/account-list-landing/tabs/farming/farming.component';
import { ReserveComponent, RequestAccespopup } from './pages/account-list-landing/tabs/reserve/reserve.component';
import { AllianceComponent } from './pages/account-list-landing/tabs/alliance/alliance.component';

import { SharedModule } from '../../shared/shared.module';
// import { ActiveRequestsComponent } from './pages/account-creation/tabs/active-requests/active-requests.component';
// import { CreationHistoryComponent } from './pages/account-creation/tabs/creation-history/creation-history.component';
// import { CreateProspectAccountComponent, ProspectSubmit, ProspectSubmitPopup, OpenProspectAccountOwner,  cancelpopComponent } from './pages/create-prospect-account/create-prospect-account.component';
// import { CreateAssignmentReferenceComponent, OpenAccountOwner1, ConfirmSubmit1 } from './pages/create-assignment-reference/create-assignment-reference.component';
// import { AccountModificationComponent } from './pages/account-modification/account-modification.component';
// import { AccountDetailsComponent, CommentBoxComponent, Helpline, OpenAccountOwnerdetails, OpensaveComments,OpenrejectCBUpopupcomponent, RequestActivated, OpenaddAlliancepopupcomponent, OpenaddActivepopupcomponent, OpenaddCBUpopupcomponent ,OpenAddStandbypopupcomponent,OpenaddAdvisorypopupcomponent, DeactiveReferencePopup} from './pages/account-details/account-details.component';
// import { ModificationActiveRequestsComponent } from './pages/account-modification/tabs/modification-active-requests/modification-active-requests.component';
// import { ModificationHistoryComponent } from './pages/account-modification/tabs/modification-history/modification-history.component'
import { LoginComponent } from './pages/login/login.component';
import { AccountMoreViewsComponent, SaveviewPopup } from './pages/account-more-views/account-more-views.component';
import { MaterialModule } from '@app/shared/material.module';
import { NgSlimScrollModule } from 'ngx-slimscroll';
import { MoreviewComponent } from './pages/account-list-landing/tabs/moreview/moreview.component';

import { PopoverModule } from "ngx-smart-popover";
import {
  MatExpansionModule
} from '@angular/material';
// import { ViewModificationDetailsComponent } from './pages/view-modification-details/view-modification-details.component';
import { AccountFinderComponent, RequestAccesspopup } from './pages/account-finder/account-finder.component';

// custome date format start
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
// import { AccountContractsComponent, NoteComponent } from './pages/account-contracts/account-contracts.component';
// import { PendingRequestsComponent, ContractRequestAccesspopup } from './pages/account-contracts/tabs/pending-requests/pending-requests.component';
// import { ContractRepositoryComponent} from './pages/account-contracts/tabs/contract-repository/contract-repository.component';
// import { AccountContactsComponent } from './pages/account-contacts/account-contacts.component';
// import { SubAccounts } from './pages/account-teams/account-teams.component';
// import { AccountManagementLogComponent, uploadPopup } from './pages/account-management-log/account-management-log.component';
// import { AccountContactsTabComponent } from './pages/account-contacts/tabs/account-contacts-tab/account-contacts-tab.component';
// import { RelationshipSuiteTabComponent } from './pages/account-contacts/tabs/relationship-suite-tab/relationship-suite-tab.component';
// import { RelationshipPlanTabComponent } from './pages/account-contacts/tabs/relationship-plan-tab/relationship-plan-tab.component';
import { AccountTransitionComponent, Openownertransition } from './pages/account-transition/account-transition.component';
// import { AddRelationshipPlanComponent } from './pages/add-relationship-plan/add-relationship-plan.component';
// import { IncentiveComponent } from './pages/account-teams/tabs/incentive/incentive.component';
// import { NonIncentiveComponent } from './pages/account-teams/tabs/non-incentive/non-incentive.component';
// import { ManagementLogTableComponent } from './pages/management-log-table/management-log-table.component';
// import { AddBulkTeamMemberComponent } from './pages/add-bulk-team-member/add-bulk-team-member.component';
// import { AssignmentRef } from './pages/assingment-ref/assingment-ref.component';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { StoreModule } from '@ngrx/store';
import * as fromCreatehistoryReducer from '@app/core/state/reducers/account/Create-HistoryList.reducer';
import * as fromActiverequestReducer from '@app/core/state/reducers/account/ActiveRequestsList.reducer'
import * as fromFarmingRequestReducer from '@app/core/state/reducers/account/farmingAccountList.reducer';
import { Accounteffects } from '@app/core/state/effects/accounts/Account-List.effects';
import * as fromReserveRequestReducer from '@app/core/state/reducers/account/reserveAccountList.reducer';
import * as fromAllianceRequestReducer from '@app/core/state/reducers/account/allianceAccountList.reducer';
import * as fromRelationShipPlanRequestReducer from '@app/core/state/reducers/account/relationshipPlanList.reducer';
import * as fromModificationActiveListReducer from '@app/core/state/reducers/account/modificationActiveList.reducer';
import * as fromModificationHistoryListReducer from '@app/core/state/reducers/account/modificationHistoryList.reducer';
import * as fromAssignmentHistoryHistoryListReducer from '@app/core/state/reducers/account/assignmentRef.reducer';

// import { DashboardDetailsComponent } from './pages/dashboard-details/dashboard-details.component';
// import { AddContractComponent } from './pages/add-contract/add-contract.component';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime'; //chethana june 14 timepicker
// import { AssigActiveRequestsComponent } from './pages/assingment-ref/tabs/assig-active-requests/assig-active-requests.component';
// import { AssigCreationHistoryComponent } from './pages/assingment-ref/tabs/assig-creation-history/assig-creation-history.component';
import { AnalystAdvisorComponent } from './pages/account-list-landing/tabs/analyst-advisor/analyst-advisor.component';
import { EditReferenceComponent, Opensavereference } from './pages/edit-reference/edit-reference.component';
// // import { Tree } from './pages/tree/tree.component';
// import { Node } from './pages/tree/node/node.component';
// import { NodesListService } from './pages/tree/services/nodesList.service';
// import { ProspectAccountCreationComponent } from './pages/prospect-account-creation/prospect-account-creation.component';
// import { ConfirmProspectComponent } from './pages/prospect-account-creation/confirm-prospect/confirm-prospect.component';
import { AccountOwnershipHistoryComponent } from './pages/account-ownership-history/account-ownership-history.component';
// import { AddSecondaryOwnersComponent } from './pages/account-details/modals/add-secondary-owners/add-secondary-owners.component';
// import { RetagOpportunityComponent } from './pages/account-details/modals/retag-opportunity/retag-opportunity.component';
// import { MultipleReferenceViewComponent } from './pages/account-details/modals/multiple-reference-view/multiple-reference-view.component';
// import { SavereferencePopupComponent } from './pages/edit-reference/savereference-popup/savereference-popup.component';
// import { AccountDetailsTwoComponent } from './pages/account-details-two/account-details-two.component';
// import { OwnershipHistoryListComponent } from './pages/ownership-history-list/ownership-history-list.component';
// import { HelpdeskAccountCreationComponent } from './pages/helpdesk-account-creation/helpdesk-account-creation.component';
// import { CBUActivateComponent } from './pages/helpdesk-account-creation/modals/cbu-activate/cbu-activate.component';
// import { AllianceAddComponent } from './pages/helpdesk-account-creation/modals/add-alliance/add-alliance.component';
// import { AddActiveCompetitorComponent } from './pages/helpdesk-account-creation/modals/add-active-competitor/add-active-competitor.component';
// import { AddAnalystRelationsComponent } from './pages/helpdesk-account-creation/modals/add-analyst-relations/add-analyst-relations.component';
// import { RequestSapCodeComponent } from './pages/helpdesk-account-creation/modals/request-sap-code/request-sap-code.component';
import { AllActiveAccountsComponent } from './pages/account-list-landing/tabs/all-active-accounts/all-active-accounts.component';
// import { AccountSapUploadComponent } from './pages/account-details/modals/account-sap-upload/account-sap-upload.component';
// import { NewsWidgetComponent } from './pages/news-widget/news-widget.component';
// import { AccountContractsComponent, NoteComponent } from './pages/account-contracts/account-contracts.component';
// import { PendingRequestsComponent, ContractRequestAccesspopup } from './pages/account-contracts/tabs/pending-requests/pending-requests.component';
// import { ContractRepositoryComponent } from './pages/account-contracts/tabs/contract-repository/contract-repository.component';
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
// AssignmentRef, AssigActiveRequestsComponent,AssigCreationHistoryComponent, OpenAccountOwner1,ConfirmSubmit1, CreateAssignmentReferenceComponent, 
// AccountContractsComponent, PendingRequestsComponent, ContractRepositoryComponent, NoteComponent,ContractRequestAccesspopup,
@NgModule({
  declarations: [EditReferenceComponent, Opensavereference, AccountTransitionComponent, Openownertransition, RequestAccespopup, AccountListLandingComponent, FarmingComponent, ReserveComponent, AccountFinderComponent, AccountMoreViewsComponent, SaveviewPopup, SavePopup, LoginComponent, AllianceComponent, MoreviewComponent, RequestAccesspopup, AnalystAdvisorComponent, AccountOwnershipHistoryComponent, AllActiveAccountsComponent],

  imports: [
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CommonModule,
    AccountRoutingModule,
    SharedModule,
    MaterialModule,
    MatExpansionModule,
    NgSlimScrollModule,
    PopoverModule,
    FileUploadModule,
    TimepickerModule.forRoot(),
    StoreModule.forFeature('CreationHistory', fromCreatehistoryReducer.CreationHistoryreducer),
    StoreModule.forFeature('ActiveRequest', fromActiverequestReducer.ActiveRequestreducer),
    StoreModule.forFeature('FarmingRequest', fromFarmingRequestReducer.FarmingAccountReducer),
    EffectsModule.forFeature([Accounteffects]),
    StoreModule.forFeature('ReserveRequest', fromReserveRequestReducer.ReserveAccountReducer),
    StoreModule.forFeature('AllianceRequest', fromAllianceRequestReducer.AllianceAccountReducer),
    StoreModule.forFeature('RelationPlanRequest', fromRelationShipPlanRequestReducer.RelationShipPlanReducer),
    StoreModule.forFeature('modificationActiveRequest', fromModificationActiveListReducer.ModificationActiveReducer),
    StoreModule.forFeature('modificationHistoryRequest', fromModificationHistoryListReducer.ModificationHistoryReducer),
    StoreModule.forFeature('CreationHistoryAssignmentRef', fromAssignmentHistoryHistoryListReducer.AssignmentRefreducer),
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }

    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
  ],
  // OpenAccountOwner1, ConfirmSubmit1,
  entryComponents: [Opensavereference, Openownertransition, SavePopup, RequestAccesspopup, RequestAccespopup]
})
export class AccountModule { }
