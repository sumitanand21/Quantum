import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { PendingRequestsComponent, ContractRequestAccesspopup } from './tabs/pending-requests/pending-requests.component';
import {AccountContractsComponent, NoteComponent  } from './account-contracts.component';
import { ContractRepositoryComponent } from './tabs/contract-repository/contract-repository.component';
import { AddContractComponent } from '../add-contract/add-contract.component';
import { AccountContractRoutingModule } from './account-contract-route.module';
import { OwlDateTimeModule,OwlNativeDateTimeModule } from 'ng-pick-datetime';
@NgModule({
  declarations: [AccountContractsComponent, PendingRequestsComponent, ContractRepositoryComponent, AddContractComponent,NoteComponent,ContractRequestAccesspopup],
  imports: [
    CommonModule,
    AccountContractRoutingModule,
    SharedModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  entryComponents: [NoteComponent,ContractRequestAccesspopup],
  exports: [],
  providers: []
})
export class AccountContractModule {
}
