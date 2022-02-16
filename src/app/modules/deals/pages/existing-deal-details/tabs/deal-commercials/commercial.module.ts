import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CommercialRoutingModule } from "./commercial-routing.module";
import {
  UploadRlsComponent,
  coOwnersPopupComponent,
  uploadConfirmationComponent
} from "./tabs/upload-rls/upload-rls.component";
import { ViewEditComponent } from "./tabs/view-edit/view-edit.component";
import {
  CalculateComponent,
  resetConfirmationComponent,
  dealSubPopup,
  appirioConfirmationComponent
} from "./tabs/calculate/calculate.component";
import {
  MilestoneComponent,
  uploadConfirmPop
} from "./tabs/milestone/milestone.component";
import {
  DealCriteriaComponent,
  coOwnersPopComponent
} from "./tabs/view-edit/tabs/deal-criteria/deal-criteria.component";
import { ReportsComponent } from "./tabs/view-edit/tabs/reports/reports.component";
import { DealAggregatorComponent } from "./tabs/view-edit/tabs/deal-aggregator/deal-aggregator.component";
import { DealCommercialsComponent } from "./deal-commercials.component";
import { SharedModule } from "@app/shared";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    DealCommercialsComponent,
    coOwnersPopComponent,
    coOwnersPopupComponent,
    UploadRlsComponent,
    ViewEditComponent,
    CalculateComponent,
    MilestoneComponent,
    DealCriteriaComponent,
    ReportsComponent,
    DealAggregatorComponent,
    uploadConfirmPop,
    uploadConfirmationComponent,
    resetConfirmationComponent,
    dealSubPopup,
    appirioConfirmationComponent
  ],
  imports: [
    CommonModule,
    CommercialRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ],
  entryComponents: [
    coOwnersPopupComponent,
    coOwnersPopComponent,
    uploadConfirmPop,
    uploadConfirmationComponent,
    resetConfirmationComponent,
    dealSubPopup,
    appirioConfirmationComponent
  ]
})
export class CommercialModule {}
