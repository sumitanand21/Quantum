import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeadsRoutingModule } from './leads-routing.module';
import { CreateLeadComponent, deleteAttachPopUp } from './pages/create-lead/create-lead.component';
import { LeadsDetailsLandingComponent, qualifypopComponent, archivepopComponent, opportunitypopComponent, disqualifypopComponent, assignpopComponent, nuturepopComponent, restorepopComponent } from './pages/leads-landing/leads-details-landing/leads-details-landing.component';
import { LeadDetailsComponent, cancelleadComponent, activitypop, cancelpopcommentComponent, deleteAttachPopUp1 } from './pages/leads-landing/leads-details-landing/tabs/lead-details/lead-details.component';
import { LeadScoreComponent } from './pages/leads-landing/leads-details-landing/tabs/lead-score/lead-score.component';
import { LeadHistoryComponent } from './pages/leads-landing/leads-details-landing/tabs/lead-history/lead-history.component';
import { SharedModule } from '@app/shared/shared.module';
// custome date format start
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { StoreModule } from '@ngrx/store';
import * as fromUnqualified from '../../core/state/reducers/unqualified.reducer';
import * as fromQualified from '../../core/state/reducers/qualified.reducer';
import * as fromArchived from '../../core/state/reducers/leads/ArchivedLeads/archiveliead.list.reducer';
import { EffectsModule } from '@ngrx/effects';
import { MyOpenLeadsListReducer } from '@app/core/state/reducers/leads/myOpenLeads/myopenlead.list.reducer';
import { LeadEffect } from '@app/core/state/effects/lead/lead.effects';
import { OpenLeadsListReducer } from '@app/core/state/reducers/leads/openLeads/openlead.list.reducer';
import { LeadDetailsReducer } from '@app/core/state/reducers/leads/leadDetails/leadDetails.reducer';
import { LeadHistoryReducer } from '@app/core/state/reducers/leads/leadHistory/leadHistory.reducer';
import { DecimalNumberDirective } from '@app/shared/directives/decimalnumber.directive';
import { LeadMoreViewComponent } from './pages/leads-landing/leads-landing-tabs/lead-more-view/lead-more-view.component';
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
const popupsComponentsLeads = [
  archivepopComponent,
  opportunitypopComponent,
  disqualifypopComponent,
  nuturepopComponent,
  assignpopComponent,
  qualifypopComponent,
  cancelpopcommentComponent,
  deleteAttachPopUp1,
  cancelleadComponent,
  restorepopComponent,
  activitypop,
  deleteAttachPopUp,
]
@NgModule({
  declarations: [
    CreateLeadComponent,
    LeadsDetailsLandingComponent,
    LeadDetailsComponent,
    LeadScoreComponent,
    LeadHistoryComponent,
    DecimalNumberDirective,
    LeadMoreViewComponent,
    popupsComponentsLeads
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    LeadsRoutingModule,
    StoreModule.forFeature('UnqualifiedLead', fromUnqualified.UnqualifiedReducer),
    StoreModule.forFeature('QualifiedLead', fromQualified.QualifiedReducer),
    StoreModule.forFeature('ArchivedLead', fromArchived.ArchivedReducer),
    StoreModule.forFeature('MyOpenleadList', MyOpenLeadsListReducer),
    StoreModule.forFeature('OpenleadList', OpenLeadsListReducer),
    StoreModule.forFeature('LeadDetails', LeadDetailsReducer),
    StoreModule.forFeature('LeadHistory', LeadHistoryReducer),
    EffectsModule.forFeature([LeadEffect]),
  ],
  entryComponents: popupsComponentsLeads,
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class LeadsModule { }
