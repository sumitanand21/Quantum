import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConversationThreadComponent } from '../pages/conversation-thread/conversation-thread.component';
import { childList } from '../pages/conversation-thread/tabs/conversation-thread-tab/conversation-thread-tab.component';
import { ActionListComponent } from '../pages/conversation-thread/tabs/action-list/action-list.component';
import { OthersListComponent } from '../pages/conversation-thread/tabs/others-list/others-list.component';

const routes: Routes = [
  {
    path: '',
    component: ConversationThreadComponent,
    children: [
      {
        path: '', redirectTo: 'meetingList', pathMatch: ' full'
      },
      {
        path: 'meetingList', component: childList
      },
      {
        path: 'actionList', component: ActionListComponent
      },
      {
        path: 'othersList',
        component: OthersListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivitythreadRoutingModule { }
