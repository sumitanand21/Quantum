import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityComponent, SyncMessageComponent } from './activity/activity.component';
import { SharedModule } from '@app/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { SyncgenericpopComponent } from './syncgenericpop/syncgenericpop.component';


@NgModule({
  declarations: [ActivityComponent, SyncMessageComponent, SyncgenericpopComponent],
  entryComponents: [SyncMessageComponent, SyncgenericpopComponent],
  imports: [
    CommonModule,
    SharedModule,
    BsDatepickerModule.forRoot()
  ]
})
export class SyncActivityModule { }
