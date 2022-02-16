import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { MaterialModule } from "./material.module";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgxMasonryModule } from "ngx-masonry";
import { library } from "@fortawesome/fontawesome-svg-core";

import { NgxPaginationModule } from "ngx-pagination";
import { FilterPipeModule } from "ngx-filter-pipe";
import { NgSlimScrollModule } from "ngx-slimscroll";

import {
  faAsterisk,
  faBars,
  faUserCircle,
  faPowerOff,
  faCog,
  faPlayCircle,
  faRocket,
  faPlus,
  faEdit,
  faTrash,
  faTimes,
  faCaretUp,
  faCaretDown,
  faExclamationTriangle,
  faFilter,
  faTasks,
  faCheck,
  faSquare,
  faLanguage,
  faPaintBrush,
  faLightbulb,
  faWindowMaximize,
  faStream,
  faBook
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faAsterisk,
  faBars,
  faUserCircle,
  faPowerOff,
  faCog,
  faRocket,
  faPlayCircle,
  faPlus,
  faEdit,
  faTrash,
  faTimes,
  faCaretUp,
  faCaretDown,
  faExclamationTriangle,
  faFilter,
  faTasks,
  faCheck,
  faSquare,
  faLanguage,
  faPaintBrush,
  faLightbulb,
  faWindowMaximize,
  faStream,
  faBook
);

import { ControlMessagesComponent } from "./components/control-messages/control-messages.component";
import { ControlSearchComponent } from "./components/control-search/control-search.component";
import { SpinnerComponent } from "./components/spinner/spinner.component";

import { restorepopleadComponent } from "@app/shared/modals/restore/restore-pop";
import {
  Delete,
  LeadsLinked,
  SingleTableComponent,
  NewConversationPopup,
  OpenCustomizeableTable,
  genericModal,
  ClosePopup,
  leadextendComponent,
  searchlinkComponent,
  leadrejectComponent,
  OpenConfirmApproval,
  OpenConfirmRejection,
  OpenRejectConfirm,
  OpenOverview,
  ConfirmApprovalWithSwap,
  OpenOverviewHistory,
  OpenHistory,
  assignDealpopComponent,
  DealReject
} from "./components/single-table/single-table.component";
import {
  SingleTableDragableComponent,
  Dactivate,
  lockPopup
} from "./components/single-table-dragable/single-table-dragable.component";
import { FirstWordPipe } from "./pipes/first-word.pipe";
import { CapitalizeFirstPipe } from "./pipes/capitalizefirst.pipe";
import { CustomPaginationPipe } from "./pipes/paginationCustom.pipe";
import { AccordianSelectorComponent } from "./components/accordian-selector/accordian-selector.component";
import { OverviewHistoryPopupComponent } from "@app/shared/components/single-table/Sprint3Models/overview-history-popup/overview-history-popup.component";
import { LeadRejectionSelectorComponent } from "./components/lead-rejection-selector/lead-rejection-selector.component";
import { CustomTabDropdownComponent } from "./components/custom-tab-dropdown/custom-tab-dropdown.component";
import { NavComponent } from "@app/layouts/nav/nav.component";
import { OtherNotesSelectorComponent } from "./components/other-notes-selector/other-notes-selector.component";
import {
  SyncEditableTableComponent,
  createActivityGroupModal
} from "@app/shared/components/sync-editable-table/sync-editable-table.component";
import { MyOpenLeadSelectorComponent } from "./components/my-open-lead-selector/my-open-lead-selector.component";
import { MultiValueFilterPipe } from "./pipes/multi-value-filter.pipe";
import { StoreModule } from "@ngrx/store";
import { singletableReducer } from "@app/core/state/reducers/singleTable/singleTable.reducer";

import { KeyListControlDirective } from "./directives/key-list-control.directive";
import { TooltipDirective } from "./directives/Tooltip.directive";


/**Sprint 3 */
import { SmallSpinnerComponent } from "./components/small-spinner/small-spinner.component";
// sprint 3 popup and selector imports starts here
import { ExistingAccountPopupComponent } from "@app/shared/modals/existing-account-popup/existing-account-popup.component";
import { SearchAccountPopupComponent } from "@app/shared/modals/search-account-popup/search-account-popup.component";
// DataBase popup starts
import { SearchAccountDataBasePopupComponent } from "@app/shared/modals/search-account-DataBase-popup/search-account-DataBase-popup.component";
import { SwapPopupComponent } from "@app/shared/modals/swap-popup/swap-popup.component";
import { AccountOwnerPopupComponent } from "@app/shared/modals/account-owner-popup/account-owner-popup.component";
import { SwapCreatePopupComponent } from "@app/shared/modals/swap-create-popup/swap-create-popup.component";
import { ConfirmSubmitPopupComponent } from "@app/shared/modals/confirm-submit-popup/confirm-submit-popup.component";
import { AddParametersComponent } from "@app/shared/modals/add-parameters/add-parameters.component";
import { ExistingReservePopupComponent } from "./modals/existing-reserve-popup/existing-reserve-popup.component";
import { DashboardPopupComponent } from "./modals/dashboard-popup/dashboard-popup.component";
// import { OverviewHistoryPopupComponent } from '@app/shared/components/single-table/Sprint3Models/overview-history-popup/overview-history-popup.component';
import { PerformanceQuarterSelectorComponent } from "./components/performance-quarter-selector/performance-quarter-selector.component";
import { ManagementLogSelectorComponent } from "./components/management-log-selector/management-log-selector.component";
// import { AccordianSelectorComponent } from './components/accordian-selector/accordian-selector.component';

import { CancelNoYesPopupComponent } from "./modals/cancel-no-yes-popup/cancel-no-yes-popup.component";
// sprint 3 popup and selector imports ends here
import {
  EditableExpansionTableComponent,
  AddingMembersPopup,
  RequestResourcePopup
} from "./components/editable-expansion-table/editable-expansion-table.component";
import { AccountOverviewSelectorComponent } from "./components/account-overview-selector/account-overview-selector.component";
import { TypeOfConversationComponent } from "./modals/type-of-conversation/type-of-conversation.component";

//  sprint 4 + sprint 7 starts here
// import { AddingMembersPopup, RequestResourcePopup } from './components/editable-expansion-table/editable-expansion-table.component';
import { AutoCompleteSelectComponent } from "./components/auto-complete-select/auto-complete-select.component";
import { MultiSelectCheckboxComponent } from "./components/multi-select-checkbox/multi-select-checkbox.component";
import {
  OrderRejectionSelectorComponent,
  ClosePopupOrder
} from "./components/order-rejection-selector/order-rejection-selector.component";
import { OpportunityExpansionTeamComponent } from "./components/opportunity-expansion-team/opportunity-expansion-team.component";
import { ReactivateopprtuntyComponent } from "./components/single-table/sprint4Modal/reactivateopprtunty/reactivateopprtunty.component";
import { OthercompetitorComponent } from "./components/single-table/sprint4Modal/othercompetitor/othercompetitor.component";
import { EditsolutionComponent } from "./components/single-table/sprint4Modal/editsolution/editsolution.component";
import { AddingmemberComponent } from "./components/single-table/sprint4Modal/addingmember/addingmember.component";
import { RequestresourceComponent } from "./components/single-table/sprint4Modal/requestresource/requestresource.component";
import { TableFilterComponent } from "./components/table-filter/table-filter.component";
import { CreateActivityGroupModelComponent } from "./modals/create-activity-group-model/create-activity-group-model.component";
import { cancelpopComponent } from "@app/modules/leads/pages/create-lead/create-lead.component";
import { OrderDecimalDirective } from "./directives/orderdecimal.directive";
// sprint 4 + sprint 7 ends here
//Sprint 5
import { TaggedDealsSelectorComponent } from "./components/tagged-deals-selector/tagged-deals-selector.component";
import { ExisingDealsSelectorComponent } from "./components/exising-deals-selector/exising-deals-selector.component";
import {
  FileExplorerComponent,
  DeletePop
} from "./components/file-explorer/file-explorer.component";
import { MovePopoverComponent } from "./components/file-explorer/move-popover/move-popover.component";
import { AlertpopupComponent } from "./components/single-table/sprint4Modal/alertpopup/alertpopup.component";
import { cancelConfirmationComponent } from "@app/modules/deals/pages/deals-landing/tabs/existing-deals/existing-deals.component";
import { PhoneNumberDirective } from "./directives/phonenumber.directive";
import {
  RLSEditableTableComponent,
  SelectPeriodPopup
} from "./components/rls-editable-table/rls-editable-table.component";
import { AdvancelookuptabsComponent } from "./modals/advancelookuptabs/advancelookuptabs.component";
import { MoreViewComponent } from "./components/more-view/more-view.component";
import { SpecialCharacterDirective } from "./directives/special-character.directive";
import { AssignpopupComponent } from "@app/modules/order/modal/assignpopup/assignpopup.component";
import {
  PerfectScrollbarConfigInterface,
  PERFECT_SCROLLBAR_CONFIG
} from "ngx-perfect-scrollbar";
import {
  CustomerpopupComponent,
  deleteImageComponent,
  replaceImageComponent,
  errorpopcomponentCustomer
} from "./components/customerpopup/customerpopup.component";
import { AccountAccessIssueComponent } from "./modals/account-access-issue/account-access-issue.component";
import { ProposalPopupComponent } from "./components/single-table/sprint4Modal/proposal-popup/proposal-popup.component";
import { RevokeaccessPopupComponent } from "./components/single-table/sprint4Modal/revokeaccess-popup/revokeaccess-popup.component";
import { ServicelinepopupComponent } from "./components/single-table/sprint4Modal/servicelinepopup/servicelinepopup.component";
import { StaffingInititatedPopupComponent } from "./components/single-table/sprint4Modal/staffing-inititated-popup/staffing-inititated-popup.component";
import { SapPopupComponent } from "./components/single-table/sprint4Modal/sap-popup/sap-popup.component";
import { LeadsourcePopupComponent } from "./components/single-table/sprint4Modal/leadsource-popup/leadsource-popup.component";
import { ShareopportunityPopupComponent } from "./components/single-table/sprint4Modal/shareopportunity-popup/shareopportunity-popup.component";
import { OrderBfmExpansionComponent } from './components/order-bfm-expansion/order-bfm-expansion.component';
import { CBUpopupComponent } from "./components/single-table/sprint4Modal/cbupopup/cbupopup.component";
import { RollbackcomponentComponent } from "./components/single-table/sprint4Modal/rollbackcomponent/rollbackcomponent.component";
import { SimpleScrollTableComponent } from './components/simple-scroll-table/simple-scroll-table.component';
import { ChangeTextDirective } from "./directives/sentence-case.directive";
import { SideNavComponent } from "./components/side-nav/side-nav.component";
import { GenericProspectAccount,cancelprospectComponent } from "./components/generic-prospect-account/generic.prospect.account";
import { OrderDecimalNewDirective } from "./directives/orderDecimalNew.directive";

// import { PullrequestComponent } from './components/pullrequest/pullrequest.component';
// import { PullrequestComponent } from './components/pull-refresh/pullrequest/pullrequest.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { MaintainanceComponent } from './components/maintainance/maintainance.component';

import { AlphaNumericDirective } from "./directives/alpha-numeric.directive";

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

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  minScrollbarLength: 84
};
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    FilterPipeModule,
    RouterModule,
    StoreModule.forFeature("Singletable", singletableReducer),
    NgbModule.forRoot(),
    FontAwesomeModule,
    MaterialModule,
    NgSlimScrollModule
  ],
  declarations: [
    SpecialCharacterDirective,
    ChangeTextDirective,
    PhoneNumberDirective,
    ControlMessagesComponent,
    ControlSearchComponent,
    SpinnerComponent,
    SmallSpinnerComponent,
    OpenCustomizeableTable,
    genericModal,
    ClosePopup,
    CreateActivityGroupModelComponent,
    restorepopleadComponent,
    CustomTabDropdownComponent,
    NavComponent,
    SingleTableComponent,
    NewConversationPopup,
    LeadsLinked,
    Delete,
    FirstWordPipe,
    CapitalizeFirstPipe,
    CustomPaginationPipe,
    AccordianSelectorComponent,
    leadextendComponent,
    searchlinkComponent,
    leadrejectComponent,
    OpenConfirmApproval,
    OpenConfirmRejection,
    OpenRejectConfirm,
    OpenOverview,
    ConfirmApprovalWithSwap,
    OpenOverviewHistory,
    OpenHistory,
    OverviewHistoryPopupComponent,
    LeadRejectionSelectorComponent,
    GenericProspectAccount,
    cancelprospectComponent,
    OtherNotesSelectorComponent,
    SyncEditableTableComponent,
    createActivityGroupModal,
    EditableExpansionTableComponent,
    MyOpenLeadSelectorComponent,
    MultiValueFilterPipe,
    KeyListControlDirective,
    TooltipDirective,
    AccountOverviewSelectorComponent,
    MultiValueFilterPipe,
    PerformanceQuarterSelectorComponent,
    ManagementLogSelectorComponent,
    DashboardPopupComponent,
    AssignpopupComponent,
    ExistingReservePopupComponent,
    AddParametersComponent,
    ConfirmSubmitPopupComponent,
    SwapCreatePopupComponent,
    AccountOwnerPopupComponent,
    SwapPopupComponent,
    SearchAccountPopupComponent,
    SearchAccountDataBasePopupComponent,
    CancelNoYesPopupComponent,
    ExistingAccountPopupComponent,
    MultiValueFilterPipe,
    TypeOfConversationComponent,
    AutoCompleteSelectComponent,
    ReactivateopprtuntyComponent,
    CBUpopupComponent,
    RollbackcomponentComponent,
    OthercompetitorComponent,
    EditsolutionComponent,
    AddingmemberComponent,
    RequestresourceComponent,
    MultiSelectCheckboxComponent,
    OrderRejectionSelectorComponent,
    TableFilterComponent,
    OpportunityExpansionTeamComponent,
    ClosePopupOrder,
    cancelpopComponent,
    assignDealpopComponent,
    DealReject,
    AddingmemberComponent,
    Dactivate,
    deleteImageComponent,
    replaceImageComponent,
    lockPopup,
    RequestresourceComponent,
    DashboardPopupComponent,
    ExisingDealsSelectorComponent,
    SelectPeriodPopup,
    RequestResourcePopup,
    AddingMembersPopup,
    SingleTableDragableComponent,
    TaggedDealsSelectorComponent,
    FileExplorerComponent,
    MovePopoverComponent,
    DeletePop,
    MovePopoverComponent,
    AlertpopupComponent,
    RLSEditableTableComponent,
    AdvancelookuptabsComponent,
    MoreViewComponent,
    CustomerpopupComponent,
    errorpopcomponentCustomer,
    AccountAccessIssueComponent,
    ProposalPopupComponent,
    RevokeaccessPopupComponent,
    ServicelinepopupComponent,
    StaffingInititatedPopupComponent,
    SapPopupComponent,
    ShareopportunityPopupComponent,
    LeadsourcePopupComponent,
    OrderBfmExpansionComponent,
    SimpleScrollTableComponent,
    SideNavComponent,
    OrderDecimalDirective,
    OrderDecimalNewDirective,
    MaintainanceComponent,
    AlphaNumericDirective
    // PullrequestComponent,
  ],
  exports: [
    CommonModule,
    deleteImageComponent,
    replaceImageComponent,
    FormsModule,
    ReactiveFormsModule,
    assignDealpopComponent,
    NgxPaginationModule,
    FilterPipeModule,
    RouterModule,
    NgSlimScrollModule,
    SyncEditableTableComponent,
    MaterialModule,
    NavComponent,
    NgbModule,
    FontAwesomeModule,
    NgxMasonryModule,
    CustomTabDropdownComponent,
    ControlMessagesComponent,
    ControlSearchComponent,
    SpinnerComponent,
    restorepopleadComponent,
    EditableExpansionTableComponent,
    SingleTableComponent,
    MoreViewComponent,
    LeadsLinked,
    errorpopcomponentCustomer,
    Delete,
    AssignpopupComponent,
    FirstWordPipe,
    CapitalizeFirstPipe,
    CustomPaginationPipe,
    AccordianSelectorComponent,
    MultiValueFilterPipe,
    KeyListControlDirective,
    TooltipDirective,
    SpecialCharacterDirective,
    ChangeTextDirective,
    SmallSpinnerComponent,
    AccountOverviewSelectorComponent,
    DashboardPopupComponent,
    ExistingReservePopupComponent,
    AddParametersComponent,
    ConfirmSubmitPopupComponent,
    SwapCreatePopupComponent,
    AccountOwnerPopupComponent,
    SwapPopupComponent,
    SearchAccountPopupComponent,
    SearchAccountDataBasePopupComponent,
    CancelNoYesPopupComponent,
    ExistingAccountPopupComponent,
    TypeOfConversationComponent,
    AutoCompleteSelectComponent,
    ReactivateopprtuntyComponent,
    CBUpopupComponent,
    RollbackcomponentComponent,
    OthercompetitorComponent,
    EditsolutionComponent,
    AddingmemberComponent,
    RequestresourceComponent,
    MultiSelectCheckboxComponent,
    OrderRejectionSelectorComponent,
    TableFilterComponent,
    OpportunityExpansionTeamComponent,
    ClosePopupOrder,
    CreateActivityGroupModelComponent,
    cancelpopComponent,
    SingleTableDragableComponent,
    TaggedDealsSelectorComponent,
    FileExplorerComponent,
    DeletePop,
    PhoneNumberDirective,
    RLSEditableTableComponent,
    AdvancelookuptabsComponent,
    AccountAccessIssueComponent,
    CustomerpopupComponent,
    ProposalPopupComponent,
    RevokeaccessPopupComponent,
    ServicelinepopupComponent,
    StaffingInititatedPopupComponent,
    SapPopupComponent,
    ShareopportunityPopupComponent,
    LeadsourcePopupComponent,
    SimpleScrollTableComponent,
    SideNavComponent,
    GenericProspectAccount,
    OrderDecimalDirective,
    OrderDecimalNewDirective,
    AlphaNumericDirective
  ],
  entryComponents: [
    restorepopleadComponent,
    OpenCustomizeableTable,
    genericModal,
    deleteImageComponent,
    replaceImageComponent,
    ClosePopup,
    LeadsLinked,
    NewConversationPopup,
    Delete,
    errorpopcomponentCustomer,
    leadextendComponent,
    searchlinkComponent,
    leadrejectComponent,
    OpenConfirmApproval,
    OpenConfirmRejection,
    OpenRejectConfirm,
    OpenOverview,
    ConfirmApprovalWithSwap,
    OpenOverviewHistory,
    assignDealpopComponent,
    OpenHistory,
    OverviewHistoryPopupComponent,
    createActivityGroupModal,
    DashboardPopupComponent,
    AssignpopupComponent,
    ExistingReservePopupComponent,
    AddParametersComponent,
    ConfirmSubmitPopupComponent,
    SwapCreatePopupComponent,
    AccountOwnerPopupComponent,
    SwapPopupComponent,
    SearchAccountPopupComponent,
    SearchAccountDataBasePopupComponent,
    CancelNoYesPopupComponent,
    ExistingAccountPopupComponent,
    CreateActivityGroupModelComponent,
    TypeOfConversationComponent,
    ExistingReservePopupComponent,
    CustomerpopupComponent,
    ClosePopupOrder,
    ReactivateopprtuntyComponent,
    CBUpopupComponent,
    RollbackcomponentComponent,
    OthercompetitorComponent,
    EditsolutionComponent,
    AddingmemberComponent,
    RequestresourceComponent,
    cancelpopComponent,
    DealReject,
    AddingMembersPopup,
    SelectPeriodPopup,
    lockPopup,
    RequestResourcePopup,
    MovePopoverComponent,
    DeletePop,
    SelectPeriodPopup,
    lockPopup,
    RequestResourcePopup,
    AlertpopupComponent,
    AdvancelookuptabsComponent,
    AccountAccessIssueComponent,
    ProposalPopupComponent,
    RevokeaccessPopupComponent,
    ServicelinepopupComponent,
    StaffingInititatedPopupComponent,
    SapPopupComponent,
    ShareopportunityPopupComponent,
    LeadsourcePopupComponent,
    cancelprospectComponent
  ],

  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class SharedModule {}
