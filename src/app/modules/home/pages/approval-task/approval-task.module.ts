import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovalTaskRoutingModule } from './approval-task-routing.module';
import { ApprovalTaskComponent } from './approval-task.component';
import { ApprovalComponent } from './tabs/approval/approval.component';
import { TaskComponent } from './tabs/task/task.component';
import { SharedModule } from '@app/shared';

@NgModule({
  declarations: [
    ApprovalTaskComponent,
    ApprovalComponent,
    TaskComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ApprovalTaskRoutingModule
  ]
})
export class ApprovalTaskModule { }
