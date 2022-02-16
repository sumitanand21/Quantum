import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadsListRoutingModule } from './leads-list-routing.module';
import { LeadsLandingComponent } from './leads-landing.component';
import { QualifiedLeadsComponent } from './leads-landing-tabs/qualified-leads/qualified-leads.component';
import { UnqualifiedLeadsComponent } from './leads-landing-tabs/unqualified-leads/unqualified-leads.component';
import { DisqualifiedLeadsComponent } from './leads-landing-tabs/disqualified-leads/disqualified-leads/disqualified-leads.component';
import { ArchivedLeadsComponent } from './leads-landing-tabs/archived-leads/archived-leads.component';
import { SharedModule } from '@app/shared';

@NgModule({
  declarations: [
    LeadsLandingComponent,
    QualifiedLeadsComponent,
    UnqualifiedLeadsComponent,
    DisqualifiedLeadsComponent,
    ArchivedLeadsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    LeadsListRoutingModule
  ],
  entryComponents: [],
  exports: [],
  providers: []
})
export class LeadsListModule { }
