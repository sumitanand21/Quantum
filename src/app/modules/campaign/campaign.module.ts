import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CampaignRoutingModule } from './campaign-routing.module';
import { RequestCampaignComponent, createpopComponent, cancelpopComponent } from './request-campaign/request-campaign.component';
import { SharedModule } from '@app/shared/shared.module';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { StoreModule } from '@ngrx/store';
import * as fromCampaignReducer from '@app/core/state/reducers/campaign/Campaign-AllList.reducer';
import * as FromActiveCampaignReducer from '@app/core/state/reducers/campaign/Campaign-ActiveList.reducer';
import * as FromCompletedCampaignReducer from '@app/core/state/reducers/campaign/Campaign-CompletedList.reducer';
import { EffectsModule } from '@ngrx/effects';
import { Campaigneffects } from '@app/core/state/effects/campaign/Campaign-List.effects';
import { CampaignMoreViewComponent } from './campaign-landing/tabs/campaign-more-view/campaign-more-view.component';
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

const popupsComponents = [createpopComponent, cancelpopComponent]
// custome date format ends
@NgModule({
  declarations: [
    RequestCampaignComponent,
    CampaignMoreViewComponent,
    popupsComponents
  ],
  imports: [
    CommonModule,
    CampaignRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    StoreModule.forFeature('AllCampaign', fromCampaignReducer.AllCampaignreducer),
    StoreModule.forFeature('ActiveCampaign', FromActiveCampaignReducer.ActiveCampaignreducer),
    StoreModule.forFeature('CompletedCampaign', FromCompletedCampaignReducer.CompletedCampaignreducer),
    EffectsModule.forFeature([Campaigneffects])
  ],
  entryComponents: popupsComponents,
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class CampaignModule { }
