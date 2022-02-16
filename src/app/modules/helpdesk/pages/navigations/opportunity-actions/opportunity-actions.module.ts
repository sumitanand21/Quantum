import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { OwnerChangeOppComponent } from './owner-change-opp/owner-change-opp.component';
import { TrackOpportunityComponent } from './track-opportunity/track-opportunity.component';
import { SharedModule } from '@app/shared';

@NgModule({
  declarations: [ TrackOpportunityComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
  
})
export class OpportunityActionsModule { }
