import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { AccountManagementLogComponent, uploadPopup } from './account-management-log.component';
import { ManagementLogTableComponent } from '../management-log-table/management-log-table.component';
import { AccountManagementRoutingModule } from './account-managementlog-route.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
@NgModule({
  declarations: [AccountManagementLogComponent, ManagementLogTableComponent, uploadPopup],
  imports: [
    CommonModule,
    AccountManagementRoutingModule,
    SharedModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  entryComponents: [uploadPopup],
  exports: [],
  providers: []
})
export class AccountManagementModule {
}
