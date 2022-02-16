import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssistantHomeComponent } from './assistant-home/assistant-home.component';
import { AssistantAccountListComponent } from './assistant-account-list/assistant-account-list.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar'
import { NgSlimScrollModule } from 'ngx-slimscroll';
import { AssistantCollaborationComponent } from './assistant-collaboration/assistant-collaboration.component';
import {
  MatExpansionModule,
  MatSelectModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatInputModule,
  MatTabsModule,
  MatRadioModule
} from '@angular/material';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ClickOutsideModule } from 'ng-click-outside';
import { FilterPipe } from './filter.pipe';
import { RouterModule } from '@angular/router';
import { AssistantAccountDetailsComponent } from './assistant-account-details/assistant-account-details.component';
import { AssistantOpportunityListComponent } from './assistant-opportunity-list/assistant-opportunity-list.component';
import { AssistantMeetingDetailsComponent } from './assistant-meeting-details/assistant-meeting-details.component';
import { AssistantLeadDeatilsComponent } from './assistant-lead-deatils/assistant-lead-deatils.component';
import { AssistantOpportunityOverviewComponent } from './assistant-opportunity-overview/assistant-opportunity-overview.component';
import { AssistantOrderDetailsComponent } from './assistant-order-details/assistant-order-details.component';
import { AssistntDefultMessageComponent } from './assistnt-defult-message/assistnt-defult-message.component';
@NgModule({
  declarations: [
    AssistantHomeComponent, 
    AssistantAccountListComponent, 
    AssistantCollaborationComponent,
    FilterPipe,
    AssistantAccountDetailsComponent,
    AssistantOpportunityListComponent,
    AssistantMeetingDetailsComponent,
    AssistantLeadDeatilsComponent,
    AssistantOpportunityOverviewComponent,
    AssistantOrderDetailsComponent,
    AssistntDefultMessageComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    PerfectScrollbarModule,
    NgSlimScrollModule,
    ClickOutsideModule,
    MatExpansionModule,
    MatSelectModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatInputModule,
    MatTabsModule,
    MatRadioModule,
    NgCircleProgressModule
  ],
  exports: [
    AssistantHomeComponent
  ]
})
export class DigitalAssistantModule { }
