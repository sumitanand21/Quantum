import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestCampaignComponent } from './request-campaign/request-campaign.component';
import { CampaignMoreViewComponent } from './campaign-landing/tabs/campaign-more-view/campaign-more-view.component';
import { GenericProspectAccount } from '@app/shared/components/generic-prospect-account/generic.prospect.account';
const routes: Routes = [
  {
    path: '',
    loadChildren: './campaign-landing/campaign-list.module#CampaignListModule'
  },
  {
    path: 'CampaignMoreView',
    component: CampaignMoreViewComponent
  },
  {
    path: 'RequestCampaign',
    component: RequestCampaignComponent
  },
  { path: 'prospectAccount', component: GenericProspectAccount },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampaignRoutingModule { }
