import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewOpportunityComponent} from './pages/new-opportunity/new-opportunity.component';
import { RenewalOpportunityComponent} from './pages/renewal-opportunity/renewal-opportunity.component';
import { IncrementalOpportunityComponent } from './pages/incremental-opportunity/incremental-opportunity.component';
import {  OpportunityFinderComponent } from './pages/opportunity-finder/opportunity-finder.component';


const routes: Routes = [
    // { path: 'newopportunity', component: NewOpportunityComponent },
    { path: 'renewal', component: RenewalOpportunityComponent },
    { path: 'incremental', component: IncrementalOpportunityComponent },
    { path: 'opportunityfinder', component: OpportunityFinderComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class createOppRoutingModule { }
