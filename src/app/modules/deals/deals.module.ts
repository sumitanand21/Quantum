import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ValidateforNullnUndefined } from "@app/core/services/validateforNULLorUndefined.service";
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from "@ngrx/store";
import { DealsLandingComponent } from "./pages/deals-landing/deals-landing.component";
import { DealsRoutingModule } from "@app/modules/deals/deals-routing.module";
import { TaggedOpportunitiesComponent } from "./pages/deals-landing/tabs/tagged-opportunities/tagged-opportunities.component";
import {
  ExistingDealsComponent,
  cancelConfirmationComponent
} from "./pages/deals-landing/tabs/existing-deals/existing-deals.component";
import {
  TaggedDealSummaryComponent,
  DealCreate,
  uploadtagPop,
  AttachDealRFPComponent
} from "./pages/tagged-deal-summary/tagged-deal-summary.component";
import {
  CreateDealComponent,
  DealConfirm,
  uploadPop,
} from "./pages/create-deal/create-deal.component";
import {
  ExistingDealDetailsComponent,
  assignpopComponent,
} from "./pages/existing-deal-details/existing-deal-details.component";
import { DealTeamComponent } from "./pages/existing-deal-details/tabs/deal-team/deal-team.component";
import {
  DealModuleComponent,
  coOwnerspopComponent,
  ModulepopComponent,
  modulePopUpComponent
} from "./pages/existing-deal-details/tabs/deal-module/deal-module.component";
// import { DealCommercialsComponent } from './pages/existing-deal-details/tabs/deal-commercials/deal-commercials.component';
import {
  DealTechSolutionComponent,
  previewDoc
} from "./pages/existing-deal-details/tabs/deal-tech-solution/deal-tech-solution.component";
import {
  DealCalendarComponent,
  approveActionComponent
} from "./pages/existing-deal-details/tabs/deal-calendar/deal-calendar.component";
import { DealOverviewComponent, alertPopUpComponent } from "./pages/existing-deal-details/tabs/deal-overview/deal-overview.component";
import {
  CreateNewDocumentComponent,
  uploadPopup,
} from "./pages/create-new-document/create-new-document.component";
import { SharedModule } from "@app/shared";
// import { UploadProgressComponent } from '@app/shared/upload-progress/upload-progress.component';
import { DealsReducer } from "@app/core/state/reducers/deals/tagged-deals.reducers";
// custome date format start
import * as _moment from "moment";
import { default as _rollupMoment } from "moment";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material/core";
import { ScheduleModule } from "@syncfusion/ej2-angular-schedule";
import {
  ScheduleAllModule,
  RecurrenceEditorAllModule
} from "@syncfusion/ej2-angular-schedule";
import { DialogModule } from "@syncfusion/ej2-angular-popups";
import { PopoverModule } from "ngx-bootstrap";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AttachDocumentsComponent } from "./pages/attach-documents/attach-documents.component";
import { CreateActionComponent } from "./pages/create-action/create-action.component";
import { DealDropdownService } from "@app/core/services/deals/deal-dropdown.service";
import { PastDealsComponent } from "./pages/past-deals/past-deals.component";
import { RlsViewComponent } from "./pages/rls-view/rls-view.component";
import { ExistingDealsReducer } from "@app/core/state/reducers/deals/existing-deals.reducers";
import { modulesReducer } from "@app/core/state/reducers/deals/deal-module.reducers";
import { EffectsModule } from "@ngrx/effects";
import { RLSViewReducer } from "@app/core/state/reducers/deals/deal-rlsview.reducers";
import { DealJsonService } from "@app/core/services/deals/dealjsonservice";
import { PastDealReducer } from "@app/core/state/reducers/deals/pastdeal.reducers";
import { ReportsReducer } from "@app/core/state/reducers/deals/deal-reports.reducers";
import { CreateNewActionComponent } from "./pages/create-new-action/create-new-action.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DealOverviewReducer } from "@app/core/state/reducers/deals/deal-overview.reducers";
import { DealTechSolutionReducers } from "@app/core/state/reducers/deals/deal-tech-solution.reducers";
import { CreateActionReducer } from "@app/core/state/reducers/deals/create-action.reducers";
import { UploadRLSListReducer } from "@app/core/state/reducers/deals/upload-rls.reducer";
import { DealParameterReducer } from "@app/core/state/reducers/deals/deal-parameter.reducers";
import { DealCriteriaReducer } from "@app/core/state/reducers/deals/deal-criteria.reducers";
import { CalculateReducer } from "@app/core/state/reducers/deals/calculate.reducer";
import { milestoneReducer } from "@app/core/state/reducers/deals/milestone.reducers";
import { UploadRLSEffects } from "@app/core/state/effects/deals/upload-rls.effects";
import { ExistingDealsEffects } from "@app/core/state/effects/deals/existing-deals.effects";
import { TaggedDealsEffects } from "@app/core/state/effects/deals/tagged-deals.effects";
import { DealOverviewEffects } from "@app/core/state/effects/deals/deal-overview.effects";
import { CalculateEffects } from "@app/core/state/effects/deals/calculate.effects";
import { CalenderActionListReducer } from "@app/core/state/reducers/deals/calender-list.reducers";
//import { ActionListEffects } from '@app/core/state/effects/deals/actionList.effects';
import { DealTechSoluctionEffects } from "@app/core/state/effects/deals/deal-tech-solution.effects";
import { ActionListEffects } from "@app/core/state/effects/action-list.effects";
import { RLSViewEffects } from "@app/core/state/effects/deals/rls-view.effects";
import { ModuleListEffects } from "@app/core/state/effects/deals/module-list.effects";
import { AttachDocumentsReducer } from "@app/core/state/reducers/deals/attach-documents.reducers";
import { MilestoneListEffects } from "@app/core/state/effects/deals/milestone.effects";
import {
  EditDocumentComponent,
  ConfirmationPopup
} from "./pages/edit-document/edit-document.component";
import { TrackerEditPageComponent } from "./pages/tracker-edit-page/tracker-edit-page.component";
import { AttachDocumentEffects } from "@app/core/state/effects/deals/attach-document.effects";
import { RLSListReducer } from "@app/core/state/reducers/deals/deal-rls.reducers";
import { PassListReducer } from "@app/core/state/reducers/deals/deal-passthrough.reducers";
import { SafePipe } from "@app/core/pipes/safe.pipe";
import { MessageService } from "@app/core/services/deals/deals-observables.service";
import {
  saveAlert,
  PullRLSPopup
} from "./pages/existing-deal-details/tabs/deal-commercials/tabs/view-edit/tabs/deal-criteria/deal-criteria.component";
import { DealParamasEffects } from "@app/core/state/effects/deals/deal-params.effects";
import { DealAccessReducer } from "@app/core/state/reducers/deals/deal-access.reducers";
import { DealCoOwnersReducer } from "@app/core/state/reducers/deals/dealCoOwners-list.reducer";
import { OrderrByPipe } from "./pages/tagged-deal-summary/currencypipe";
import { CustomErrorComponent } from "./pages/existing-deal-details/tabs/deal-commercials/tabs/calculate/calculate.component";
import { ServiceByPipe } from "./pages/existing-deal-details/tabs/deal-module/servicelinespipe";
export const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: "LL"
  },
  display: {
    dateInput: "DD-MMM-YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};
// custome date format ends
@NgModule({
  declarations: [
    DealsLandingComponent,
    uploadPopup,
    saveAlert,
    PullRLSPopup,
    TaggedOpportunitiesComponent,
    ExistingDealsComponent,
    TaggedDealSummaryComponent,
    CreateDealComponent,
    ExistingDealDetailsComponent,
    DealTeamComponent,
    DealModuleComponent,
    // DealCommercialsComponent,
    DealTechSolutionComponent,
    DealCalendarComponent,
    DealOverviewComponent,
    CreateNewDocumentComponent,
    coOwnerspopComponent,
    ModulepopComponent,
    AttachDocumentsComponent,
    DealConfirm,
    uploadPop,
    assignpopComponent,
    CreateActionComponent,
    DealCreate,
    uploadtagPop,
    PastDealsComponent,
    RlsViewComponent,
    CreateNewActionComponent,
    modulePopUpComponent,
    EditDocumentComponent,
    ConfirmationPopup,
    TrackerEditPageComponent,
    cancelConfirmationComponent,
    previewDoc,
    SafePipe,
    approveActionComponent,
    AttachDealRFPComponent,
    OrderrByPipe,
    CustomErrorComponent,
    alertPopUpComponent,
    ServiceByPipe
  ],
  imports: [
    CommonModule,
    DealsRoutingModule,
    SharedModule,
    ScheduleModule,
    ScheduleAllModule,
    RecurrenceEditorAllModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    PopoverModule,
    StoreModule.forFeature("TaggedDeals", DealsReducer),
    StoreModule.forFeature("ExistingDeals", ExistingDealsReducer),
    StoreModule.forFeature("CreateAction", CreateActionReducer),
    StoreModule.forFeature("modules", modulesReducer),
    StoreModule.forFeature("dealoverview", DealOverviewReducer),
    StoreModule.forFeature("RLSView", RLSViewReducer),
    StoreModule.forFeature("PastDeal", PastDealReducer),
    StoreModule.forFeature("Reports", ReportsReducer),
    StoreModule.forFeature("UploadRLS", UploadRLSListReducer),
    StoreModule.forFeature("DealTechSolution", DealTechSolutionReducers),
    StoreModule.forFeature("dealAccess", DealAccessReducer),
    // StoreModule.forFeature('ModuleList',DealCurrencyReducer),
    StoreModule.forFeature("dealparameter", DealParameterReducer),
    StoreModule.forFeature("dealCriteria", DealCriteriaReducer),
    StoreModule.forFeature("calenderActionList", CalenderActionListReducer),
    StoreModule.forFeature("Calculate", CalculateReducer),
    StoreModule.forFeature("AttachDocuments", AttachDocumentsReducer),
    // EffectsModule.forFeature([UploadRLSEffects, ExistingDealsEffects,CalculateEffects, TaggedDealsEffects,DealOverviewEffects,ActionListEffects, DealTechSoluctionEffects]),
    StoreModule.forFeature("milestone", milestoneReducer),
    StoreModule.forFeature("RLSList", RLSListReducer),
    StoreModule.forFeature("PassList", PassListReducer),
    StoreModule.forFeature("dealCoOwners", DealCoOwnersReducer),
    EffectsModule.forFeature([
      UploadRLSEffects,
      ExistingDealsEffects,
      CalculateEffects,
      TaggedDealsEffects,
      DealParamasEffects,
      DealOverviewEffects,
      ActionListEffects,
      DealTechSoluctionEffects,
      RLSViewEffects,
      ModuleListEffects,
      MilestoneListEffects,
      AttachDocumentEffects
    ]),
    NgbModule
  ],
  entryComponents: [
    uploadPopup,
    DealConfirm,
    saveAlert,
    uploadPop,
    ModulepopComponent,
    coOwnerspopComponent,
    assignpopComponent,
    DealCreate,
    PullRLSPopup,
    uploadtagPop,
    modulePopUpComponent,
    ConfirmationPopup,
    cancelConfirmationComponent,
    previewDoc,
    approveActionComponent,
    AttachDealRFPComponent,
    CustomErrorComponent,
    alertPopUpComponent,
    
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ValidateforNullnUndefined,
    DealDropdownService,
    DealJsonService,
    MessageService,
   
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
  ]
})
export class DealsModule {}
