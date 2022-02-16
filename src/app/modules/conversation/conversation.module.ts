import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { NewConversationComponent, activitypop, createConversationpopComponent, cancelpop, cancelpopeditComponent, deleteAttachPopUp } from '@app/modules/conversation/pages/new-conversation/new-conversation.component';
import { ConversationComponent, activitypop1 } from '@app/modules/conversation/pages/conversation.component';
import { ConversationRoutingModule } from '@app/modules/conversation/conversation.routing';
import { DetailsListComponent, genericpopupcomponent,detailsCancelpop } from './pages/conversation-thread/tabs/details-list/details-list.component';
import { ChildDetailsComponent, cancelpopComponent1, meetingeditactivitypop, deleteeditAttachPopUp, opportunityconvercomponent } from './pages/child-details/child-details.component';
import { ConversationShareComponent, cancelpopComponent2 } from './pages/conversation-share/conversation-share.component';
import { NewActionComponent, Statuscomponent,cancelpopactionComponent } from './pages/new-action/new-action.component';
import { ConversationListComponent } from './pages/conversation-list/conversation-list.component';
import { ActiontabDetailsComponent, cancelactionComponent } from './pages/actiontab-details/actiontab-details.component';
import { popupComponent } from '../conversation/pages/new-action/new-action.component';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MyConversationComponent } from './pages/my-conversation/my-conversation.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LeadReducer } from '@app/core/state/reducers/action-reducer.reducer';
import { ActionReducer } from '@app/core/state/reducers/action-list.reducer';
import * as fromAllActivityReducer from '@app/core/state/reducers/activity/activity.reducer';
import * as fromMyActivityReducer from '@app/core/state/reducers/activity/my-activity.reducer';
import * as fromActivityDetailsReducer from '@app/core/state/reducers/activity/activity.details.reducer'
import * as fromOtherActivityDetailsReducer from '@app/core/state/reducers/OtherActivity/OtherActivity-List.reducer'
import { SyncActivityModule } from '@app/modules/sync-activity/sync-activity.module';
import { CreateOtherComponent, cancelpopotherComponent } from './pages/create-other/create-other.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule, } from 'ng-pick-datetime';
import { ActionEffects } from '@app/core/state/effects/activity/activity.effects';
import { OtherDetailsComponent, genericpopupcomponentother, cancelpopotherComponent1 } from './pages/other-details/other-details.component';
import { MeetingListReducer } from '@app/core/state/reducers/activity/meetings/meeting.reducer';
import { ArchivedConversationComponent } from './pages/archived-conversation/archived-conversation.component';
import { ArchiveActivityReducer } from '@app/core/state/reducers/activity/archive-activity.reducer';
import { ActionListReducer } from '@app/core/state/reducers/activity/actions/action.reducer';
import { OtherListReducer } from '@app/core/state/reducers/activity/OthersLists/OtherList.reducer';
import { MeetingDetailsReducer } from '@app/core/state/reducers/activity/meetings/meeting.details.reducer';
import { ActivityListComponent } from './pages/conversation-thread/tabs/activity-list/activity-list.component';
import { ActivityMoreViewComponent } from './pages/activity-more-view/activity-more-view.component';
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

const popupsComponent = [
    cancelactionComponent,
    genericpopupcomponentother,
    genericpopupcomponent,
    cancelpopComponent2,
    cancelpopeditComponent,
    deleteAttachPopUp,
    deleteeditAttachPopUp,
    meetingeditactivitypop,
    cancelpopotherComponent,
    cancelpopotherComponent1,
    cancelpopactionComponent,
    Statuscomponent,
    activitypop,
    activitypop1,
    cancelpop,
    detailsCancelpop,
    popupComponent,
    createConversationpopComponent,
    cancelpopComponent1,
    opportunityconvercomponent
]
@NgModule({
    declarations: [
        ActivityListComponent,
        ConversationComponent,
        NewConversationComponent,
        DetailsListComponent,
        ChildDetailsComponent,
        ConversationShareComponent,
        NewActionComponent,
        ConversationListComponent,
        ArchivedConversationComponent,
        ActiontabDetailsComponent,
        MyConversationComponent,
        CreateOtherComponent,
        OtherDetailsComponent,
        ActivityMoreViewComponent,
        popupsComponent
    ],
    imports: [
        SyncActivityModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        SharedModule,
        ConversationRoutingModule,
        StoreModule.forFeature('action', LeadReducer),
        StoreModule.forFeature('actionList', ActionReducer),
        StoreModule.forFeature('AllActivity', fromAllActivityReducer.AllActivityReducer),
        StoreModule.forFeature('ActivityDetails', fromActivityDetailsReducer.ActivityDetailsReducer),
        StoreModule.forFeature('OtherActivityList', fromOtherActivityDetailsReducer.OtherActivityListreducer),
        StoreModule.forFeature('MyActivityList', fromMyActivityReducer.MyActivityReducer),
        StoreModule.forFeature('ActivityMeetingList', MeetingListReducer),
        StoreModule.forFeature('ArchiveActivityList', ArchiveActivityReducer),
        StoreModule.forFeature('ActivityActionList', ActionListReducer),
        StoreModule.forFeature('OtherActivityList', OtherListReducer),
        StoreModule.forFeature('MeetingDetails', MeetingDetailsReducer),
        EffectsModule.forFeature([ActionEffects]),
    ],
    exports: [],

    entryComponents: popupsComponent,
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ]
})
export class ConversationModule { }