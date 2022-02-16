import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { AccountTeamsComponent ,SubAccounts} from './account-teams.component';
import { IncentiveComponent } from './tabs/incentive/incentive.component';
import { NonIncentiveComponent } from './tabs/non-incentive/non-incentive.component';
import { AccountTeamsRoutingModule } from './account-teams-route.module';
@NgModule({
  declarations: [AccountTeamsComponent,IncentiveComponent,NonIncentiveComponent,SubAccounts],
  imports: [
    CommonModule,
    AccountTeamsRoutingModule,
    SharedModule,   
  ],
  entryComponents: [SubAccounts],
  exports: [],
  providers: []
})
export class AccountTeamsModule { }
