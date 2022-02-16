import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountModificationComponent } from './account-modification.component';
import { ModificationActiveRequestsComponent } from './tabs/modification-active-requests/modification-active-requests.component';
import { ModificationHistoryComponent } from './tabs/modification-history/modification-history.component';
import { ViewModificationDetailsComponent } from '../view-modification-details/view-modification-details.component';

const routes: Routes = [
    {
      path: '', component: AccountModificationComponent,
            children: [
          { path: 'modificationactiverequest', component: ModificationActiveRequestsComponent },
          { path: 'modificationcreationhistory', component: ModificationHistoryComponent },      
        ]
      },
      { path: 'viewmodificationdetails/:name/:id', component: ViewModificationDetailsComponent },
      {path: 'viewmodificationdetails', component: ViewModificationDetailsComponent },
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountModificatioRoutingModule { }
