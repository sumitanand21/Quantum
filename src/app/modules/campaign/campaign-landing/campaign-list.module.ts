import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CampaignListRoutingModule } from './campaign-list-routing.module';
import { AllCampaignsComponent } from './tabs/all-campaigns/all-campaigns.component';
import { ActiveCampaignsComponent } from './tabs/active-campaigns/active-campaigns.component';
import { CompletedCampaignsComponent } from './tabs/completed-campaigns/completed-campaigns.component';
import { MyactiveCampaignsComponent } from './tabs/myactive-campaigns/myactive-campaigns/myactive-campaigns.component';
import { SharedModule } from '@app/shared';
import { CampaignLandingComponent } from './campaign-landing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CampaignLandingComponent,
    AllCampaignsComponent,
    ActiveCampaignsComponent,
    CompletedCampaignsComponent,
    MyactiveCampaignsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CampaignListRoutingModule
  ]
})
export class CampaignListModule { }
