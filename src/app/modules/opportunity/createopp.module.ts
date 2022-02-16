import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PopoverModule } from 'ngx-smart-popover';
import { SharedModule } from '@app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ClickOutsideModule } from 'ng-click-outside';
import { FileUploadModule } from 'ng2-file-upload';

// import { NewOpportunityComponent,attachpop ,ConvertNormalDealPopup} from './pages/new-opportunity/new-opportunity.component';
import { RenewalOpportunityComponent,createpopupcomponent } from './pages/renewal-opportunity/renewal-opportunity.component';
import { IncrementalOpportunityComponent,createpopupcomponent2 } from './pages/incremental-opportunity/incremental-opportunity.component';
import { createOppRoutingModule } from './createopp-routing.module';
import { GainAccess, OpportunityFinderComponent } from './pages/opportunity-finder/opportunity-finder.component';




@NgModule({
  declarations: [
    // NewOpportunityComponent,
    RenewalOpportunityComponent,
    IncrementalOpportunityComponent,
    GainAccess,
    OpportunityFinderComponent,
    createpopupcomponent,
createpopupcomponent2,
// ConvertNormalDealPopup,
// attachpop
    
  ],
  imports: [
    CommonModule,
    createOppRoutingModule,
    PopoverModule,
       SharedModule,
       FormsModule,
       ReactiveFormsModule,
       PerfectScrollbarModule,
       Ng2SearchPipeModule,
       DragDropModule,
       ClickOutsideModule,
       FileUploadModule
  ],
  entryComponents: [
    GainAccess,
    createpopupcomponent,
createpopupcomponent2,
// ConvertNormalDealPopup,
// attachpop
  ]
})
export class createoppModule { }
