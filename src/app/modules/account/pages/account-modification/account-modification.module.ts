import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { AccountModificationComponent } from './account-modification.component';
import { ModificationActiveRequestsComponent } from './tabs/modification-active-requests/modification-active-requests.component';
import { ModificationHistoryComponent } from './tabs/modification-history/modification-history.component';
import { AccountModificatioRoutingModule } from './account-modification-route.module';
import { ViewModificationDetailsComponent } from '../view-modification-details/view-modification-details.component';
@NgModule({
  declarations: [AccountModificationComponent,ModificationActiveRequestsComponent,ModificationHistoryComponent,ViewModificationDetailsComponent],
  imports: [
    CommonModule,
    AccountModificatioRoutingModule,
    SharedModule,   
  ],
  entryComponents: [],
  exports: [],
  providers: []
})
export class AccountModificationModule { }
