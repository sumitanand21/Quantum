import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { HelpdeskAccountCreationComponent } from './helpdesk-account-creation.component';
import { CBUActivateComponent } from './modals/cbu-activate/cbu-activate.component';
import { AccountHelpDeskCreationRoutingModule } from './account-helpdesk-creation-route.module';
import { AllianceAddComponent } from './modals/add-alliance/add-alliance.component';
import { AddActiveCompetitorComponent } from './modals/add-active-competitor/add-active-competitor.component';
import { AddAnalystRelationsComponent } from './modals/add-analyst-relations/add-analyst-relations.component';
import { RequestSapCodeComponent } from './modals/request-sap-code/request-sap-code.component';
import { PopoverModule } from "ngx-smart-popover";
@NgModule({
  declarations: [HelpdeskAccountCreationComponent, CBUActivateComponent, AllianceAddComponent, AddActiveCompetitorComponent, AddAnalystRelationsComponent, RequestSapCodeComponent],
  imports: [
    CommonModule,
    AccountHelpDeskCreationRoutingModule,
    SharedModule,
    PopoverModule,
  ],
  entryComponents: [CBUActivateComponent, AllianceAddComponent, AddActiveCompetitorComponent, AddAnalystRelationsComponent, RequestSapCodeComponent],
  exports: [],
  providers: []
})
export class AccountHelpDeskCreationModule {
}
