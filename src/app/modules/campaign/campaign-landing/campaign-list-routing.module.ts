import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CampaignLandingComponent } from './campaign-landing.component';
import { AllCampaignsComponent } from './tabs/all-campaigns/all-campaigns.component';
import { ActiveCampaignsComponent } from './tabs/active-campaigns/active-campaigns.component';
import { CompletedCampaignsComponent } from './tabs/completed-campaigns/completed-campaigns.component';
import { MyactiveCampaignsComponent } from './tabs/myactive-campaigns/myactive-campaigns/myactive-campaigns.component';

const routes: Routes = [
  {
    path: '',
    component: CampaignLandingComponent,
    children: [
      {
        path: '',
        redirectTo: 'ActiveCampaigns',
        pathMatch: 'full'
      },
      {
        path: 'AllCampaigns',
        component: AllCampaignsComponent
      },
      {
        path: 'ActiveCampaigns',
        component: ActiveCampaignsComponent
      },
      {
        path: 'CompletedCampaigns',
        component: CompletedCampaignsComponent
      },
      // {
      //   path: 'myactiveCampaigns',
      //   component: MyactiveCampaignsComponent
      // },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampaignListRoutingModule { }
