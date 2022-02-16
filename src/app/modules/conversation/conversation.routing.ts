import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConversationComponent } from './pages/conversation.component';
import { NewConversationComponent } from '@app/modules/conversation/pages/new-conversation/new-conversation.component';
import { DetailsListComponent } from '@app/modules/conversation/pages/conversation-thread/tabs/details-list/details-list.component';
import { ChildDetailsComponent } from '@app/modules/conversation/pages/child-details/child-details.component';
import { ConversationShareComponent } from '@app/modules/conversation/pages/conversation-share/conversation-share.component';
import { NewActionComponent } from '@app/modules/conversation/pages/new-action/new-action.component';
import { ConversationListComponent } from '@app/modules/conversation/pages/conversation-list/conversation-list.component';
import { ArchivedConversationComponent } from '@app/modules/conversation/pages/archived-conversation/archived-conversation.component';
import { ActiontabDetailsComponent } from './pages/actiontab-details/actiontab-details.component';
import { MyConversationComponent } from './pages/my-conversation/my-conversation.component';
import { ActivityComponent } from '@app/modules/sync-activity/activity/activity.component';
import { CreateOtherComponent } from './pages/create-other/create-other.component';
import { OtherDetailsComponent } from './pages/other-details/other-details.component';
import { ActivityMoreViewComponent } from './pages/activity-more-view/activity-more-view.component';
import { GenericProspectAccount } from '@app/shared/components/generic-prospect-account/generic.prospect.account';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ConversationComponent,
        children: [
          { path: '', redirectTo: 'myactivities', pathMatch: 'full' },
          { path: 'myactivities', component: MyConversationComponent },
          { path: 'list', component: ConversationListComponent },
          { path: 'Archivedlist', component: ArchivedConversationComponent }
        ]
      },
      { path: 'activitymoreview', component: ActivityMoreViewComponent },
      { path: 'newmeeting', component: NewConversationComponent },
      { path: 'syncActivity', component: ActivityComponent },
      { path: 'prospectAccount', component: GenericProspectAccount },
      {
        path: 'activitiesthread', 
        loadChildren: './activitythread-module/activitythread.module#ActivitythreadModule'
      },
      { path: 'detailsList', component: DetailsListComponent, },
      { path: 'meetingInfo', component: ChildDetailsComponent },
      { path: 'newaction', component: NewActionComponent },
      { path: 'otheractivity', component: CreateOtherComponent },
      { path: 'otherdetails', component: OtherDetailsComponent },
      { path: 'sharemeeting', component: ConversationShareComponent },
      { path: 'actiondetails', component: ActiontabDetailsComponent },
    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConversationRoutingModule { }
