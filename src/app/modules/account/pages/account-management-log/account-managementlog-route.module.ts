import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountManagementLogComponent } from './account-management-log.component';
import { ManagementLogTableComponent } from '../management-log-table/management-log-table.component';


const routes: Routes = [
  {
    path: 'managementlogCreate', component: AccountManagementLogComponent // added managementlog creation component
  },
  {
    path: '', component: ManagementLogTableComponent // Updated management log with table list data
  },

   
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountManagementRoutingModule { }
