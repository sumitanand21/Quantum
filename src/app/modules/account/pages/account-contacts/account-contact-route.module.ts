import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountContactsComponent } from './account-contacts.component';
import { AccountContactsTabComponent } from './tabs/account-contacts-tab/account-contacts-tab.component';
import { RelationshipPlanTabComponent } from './tabs/relationship-plan-tab/relationship-plan-tab.component';
import { RelationshipSuiteTabComponent } from './tabs/relationship-suite-tab/relationship-suite-tab.component';
import { AddRelationshipPlanComponent } from '../add-relationship-plan/add-relationship-plan.component';

const routes: Routes = [
  {
    path: '', component: AccountContactsComponent,
    children: [
      { path: 'accountcontacts', component: AccountContactsTabComponent },
      { path: 'relationshipplan', component: RelationshipPlanTabComponent },
      { path: 'relationshipsuite', component: RelationshipSuiteTabComponent }
    ]
  },
  {
    path: 'addrelationshipplan', component: AddRelationshipPlanComponent

  },
  { path: 'addrelationshipplan/:id', component: AddRelationshipPlanComponent },

   
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountContactRoutingModule { }
