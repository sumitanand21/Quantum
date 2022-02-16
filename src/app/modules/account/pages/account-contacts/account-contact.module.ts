import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { AccountContactsComponent } from './account-contacts.component';
import { AccountContactsTabComponent } from './tabs/account-contacts-tab/account-contacts-tab.component';
import { RelationshipPlanTabComponent } from './tabs/relationship-plan-tab/relationship-plan-tab.component';
import { RelationshipSuiteTabComponent } from './tabs/relationship-suite-tab/relationship-suite-tab.component';
import { AddRelationshipPlanComponent } from '../add-relationship-plan/add-relationship-plan.component';
import { AccountContactRoutingModule } from './account-contact-route.module';
@NgModule({
  declarations: [AccountContactsComponent,AccountContactsTabComponent,RelationshipPlanTabComponent,RelationshipSuiteTabComponent,AddRelationshipPlanComponent,AddRelationshipPlanComponent],
  imports: [
    CommonModule,
    AccountContactRoutingModule,
    SharedModule,   
  ],
  entryComponents: [],
  exports: [],
  providers: []
})
export class AccountContactModule { }
