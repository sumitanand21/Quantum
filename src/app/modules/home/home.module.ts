import { NgModule } from '@angular/core';



import { HomeComponent, FeedbackComponent, OpenConfirmApproval, OpenApproveComments, OpenRejectComments } from './pages/home.component';
import { HomeRoutingModule } from './home.routing';

import { SharedModule } from '@app/shared';
import { NgSlimScrollModule } from 'ngx-slimscroll';

// custome date format start
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HomeReducer } from '@app/core/state/reducers/home/home.reducer';
import { TaskReducer } from '@app/core/state/reducers/home/task.reducer';
import { ApprovalReducer } from '@app/core/state/reducers/home/approval.reducer';
import { TaskEffects } from '@app/core/state/effects/home/task.effects';
import { ApprovalEffects } from '@app/core/state/effects/home/approval.effects';
import { NavigationComponent } from './pages/navigation/navigation.component';
import { AllActivityReducer } from '@app/core/state/reducers/activity/activity.reducer';
import { ContactReducer } from '@app/core/state/reducers/contact-reducer';
import { ContactEffects } from '@app/core/state/effects/contact/contact.effect';
import { ActionEffects } from '@app/core/state/effects/activity/activity.effects';
import { UnqualifiedReducer } from '@app/core/state/reducers/unqualified.reducer';
import { LeadEffect } from '@app/core/state/effects/lead/lead.effects';
import { AllCampaignreducer } from '@app/core/state/reducers/campaign/Campaign-AllList.reducer';
import { Campaigneffects } from '@app/core/state/effects/campaign/Campaign-List.effects';
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
const popupHome = [FeedbackComponent, OpenConfirmApproval, OpenApproveComments, OpenRejectComments]
@NgModule({
    declarations: [
        HomeComponent,
        NavigationComponent,
        popupHome
    ],
    imports: [
        SharedModule,
        HomeRoutingModule,
        NgSlimScrollModule,
        StoreModule.forFeature('HomeList', HomeReducer),
        StoreModule.forFeature('TaskList', TaskReducer),
        StoreModule.forFeature('ApprovalList', ApprovalReducer),
        StoreModule.forFeature('AllActivity', AllActivityReducer),
        StoreModule.forFeature('LoadAllContacts', ContactReducer),
        StoreModule.forFeature('UnqualifiedLead', UnqualifiedReducer),
        StoreModule.forFeature('AllCampaign', AllCampaignreducer),
        EffectsModule.forFeature(
            [TaskEffects, ApprovalEffects, ActionEffects, ContactEffects, LeadEffect, Campaigneffects])
    ],
    exports: [],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
    ],
    entryComponents: popupHome
})
export class HomeModule { }
