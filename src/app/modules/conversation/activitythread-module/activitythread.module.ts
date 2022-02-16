import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivitythreadRoutingModule } from './activitythread-routing.module';
import { childList } from '../pages/conversation-thread/tabs/conversation-thread-tab/conversation-thread-tab.component';
import { ActionListComponent } from '../pages/conversation-thread/tabs/action-list/action-list.component';
import { OthersListComponent } from '../pages/conversation-thread/tabs/others-list/others-list.component';
import { SharedModule } from '@app/shared';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from '@app/modules/account/account.module';
import { ConversationThreadComponent, archiveconvercomponent, opportunityconvercomponent, restoreconversationcomponent } from '../pages/conversation-thread/conversation-thread.component';

const popupsComponents = [
  archiveconvercomponent,
  opportunityconvercomponent,
  restoreconversationcomponent
]
@NgModule({
  declarations: [
    childList,
    ActionListComponent,
    OthersListComponent,
    ConversationThreadComponent,
    popupsComponents
  ],
  imports: [
    CommonModule,
    SharedModule,
    ActivitythreadRoutingModule
  ],
  entryComponents: popupsComponents,
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class ActivitythreadModule { }
