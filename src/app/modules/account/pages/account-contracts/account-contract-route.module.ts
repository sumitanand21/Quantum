import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountContractsComponent } from './account-contracts.component';
import { PendingRequestsComponent } from './tabs/pending-requests/pending-requests.component';
import { ContractRepositoryComponent } from './tabs/contract-repository/contract-repository.component';
import { AddContractComponent } from '../add-contract/add-contract.component';


const routes: Routes = [
  {
    path: '', component: AccountContractsComponent,
    children: [
      { path: 'pendingrequests', component: PendingRequestsComponent },
      { path: 'contractrepository', component: ContractRepositoryComponent },

    ]
  },
  { path: 'addcontract', component: AddContractComponent },

   
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountContractRoutingModule { }
