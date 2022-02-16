import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssignmentRef } from './assingment-ref.component';
import { AssigActiveRequestsComponent } from './tabs/assig-active-requests/assig-active-requests.component';
import { AssigCreationHistoryComponent } from './tabs/assig-creation-history/assig-creation-history.component';
import { CreateAssignmentReferenceComponent } from '../create-assignment-reference/create-assignment-reference.component';
// import { AccountContractsComponent } from './account-contracts.component';
// import { PendingRequestsComponent } from './tabs/pending-requests/pending-requests.component';
// import { ContractRepositoryComponent } from './tabs/contract-repository/contract-repository.component';
// import { AddContractComponent } from '../add-contract/add-contract.component';


const routes: Routes = [
  {
    path: '', component: AssignmentRef,
    children: [
      { path: 'assigactiverequest', component: AssigActiveRequestsComponent },
      { path: 'assigcreationhistory', component: AssigCreationHistoryComponent },
    ]
  },
  {
    path: 'createassignmentreference/:id', component: CreateAssignmentReferenceComponent
  },
  {
    path: 'createassignmentreference', component: CreateAssignmentReferenceComponent
  },

   
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountAssignementRoutingModule { }
