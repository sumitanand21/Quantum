import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApprovalTaskComponent } from './approval-task.component';
import { ApprovalComponent } from './tabs/approval/approval.component';
import { TaskComponent } from './tabs/task/task.component';

const routes: Routes = [
  {
    path: '',
    component: ApprovalTaskComponent,
    children: [
      { path: 'approval', component: ApprovalComponent },
      { path: 'task', component: TaskComponent },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalTaskRoutingModule { }
