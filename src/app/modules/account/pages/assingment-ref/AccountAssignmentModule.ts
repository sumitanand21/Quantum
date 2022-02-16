import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { AssigActiveRequestsComponent } from './tabs/assig-active-requests/assig-active-requests.component';
import { AssigCreationHistoryComponent } from './tabs/assig-creation-history/assig-creation-history.component';
import { CreateAssignmentReferenceComponent, OpenAccountOwner1, ConfirmSubmit1} from '../create-assignment-reference/create-assignment-reference.component';
import { AccountAssignementRoutingModule } from './account-assignment-route.module';
import { AssignmentRef } from './assingment-ref.component';
@NgModule({
  declarations: [CreateAssignmentReferenceComponent,AssigCreationHistoryComponent,AssigActiveRequestsComponent,OpenAccountOwner1, ConfirmSubmit1,AssignmentRef],
  imports: [
    CommonModule,
    AccountAssignementRoutingModule,
    SharedModule,
  ],
  entryComponents: [OpenAccountOwner1, ConfirmSubmit1],
  exports: [],
  providers: []
})
export class AccountAssignmentModule {
}
