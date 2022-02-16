import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DealsLandingComponent } from './pages/deals-landing/deals-landing.component';
import { TaggedOpportunitiesComponent } from '@app/modules/deals/pages/deals-landing/tabs/tagged-opportunities/tagged-opportunities.component';
import { ExistingDealsComponent } from '@app/modules/deals/pages/deals-landing/tabs/existing-deals/existing-deals.component';
import { ExistingDealDetailsComponent } from '@app/modules/deals/pages/existing-deal-details/existing-deal-details.component';
import { DealOverviewComponent } from '@app/modules/deals/pages/existing-deal-details/tabs/deal-overview/deal-overview.component';
import { DealTeamComponent } from '@app/modules/deals/pages/existing-deal-details/tabs/deal-team/deal-team.component';
import { DealModuleComponent } from '@app/modules/deals/pages/existing-deal-details/tabs/deal-module/deal-module.component';
// import { DealCommercialsComponent } from '@app/modules/deals/pages/existing-deal-details/tabs/deal-commercials/deal-commercials.component';
import { DealTechSolutionComponent } from '@app/modules/deals/pages/existing-deal-details/tabs/deal-tech-solution/deal-tech-solution.component';
import { DealCalendarComponent } from '@app/modules/deals/pages/existing-deal-details/tabs/deal-calendar/deal-calendar.component';
import { CreateDealComponent } from '@app/modules/deals/pages/create-deal/create-deal.component';
import { TaggedDealSummaryComponent } from '@app/modules/deals/pages/tagged-deal-summary/tagged-deal-summary.component';
import { CreateNewDocumentComponent } from '@app/modules/deals/pages/create-new-document/create-new-document.component';
import { AttachDocumentsComponent } from './pages/attach-documents/attach-documents.component';
import { CreateActionComponent } from './pages/create-action/create-action.component';
import { PastDealsComponent } from './pages/past-deals/past-deals.component';
import { RlsViewComponent } from './pages/rls-view/rls-view.component';
import { CreateNewActionComponent } from './pages/create-new-action/create-new-action.component';
import { EditDocumentComponent } from './pages/edit-document/edit-document.component';
import { TrackerEditPageComponent } from './pages/tracker-edit-page/tracker-edit-page.component';

const routes: Routes = [
    {
        path: '', children: [
            {
                path: 'deal', component: DealsLandingComponent,
                children: [

                    { path: 'tagged', component: TaggedOpportunitiesComponent, data: { hasChild: true, isTab: true } },
                    { path: 'existing', component: ExistingDealsComponent, data: { hasChild: true, isTab: true } },
                ]
            },
            {
                path: 'existingTabs', component: ExistingDealDetailsComponent,
                children: [
                    { path: 'overview', component: DealOverviewComponent, data: { hasChild: false, isTab: true } },
                    { path: 'team', component: DealTeamComponent, data: { hasChild: false, isTab: true } },
                    { path: 'module', component: DealModuleComponent, data: { hasChild: false, isTab: true } },
                    // { path: 'commercial', component: DealCommercialsComponent },
                    {
                        path: 'commercial',
                        loadChildren: './pages/existing-deal-details/tabs/deal-commercials/commercial.module#CommercialModule'
                    },
                    { path: 'techSolution', component: DealTechSolutionComponent, data: { hasChild: false, isTab: true } },
                    { path: 'calendar', component: DealCalendarComponent, data: { hasChild: false, isTab: true } }
                ]
            },
            { path: 'attachedDocs', component: AttachDocumentsComponent, data: { hasChild: false, isTab: true } },
            { path: 'createDeal', component: CreateDealComponent, data: { hasChild: false, isTab: true } },
            { path: 'taggedSummary', component: TaggedDealSummaryComponent, data: { hasChild: false, isTab: true } },
            { path: 'createDocument', component: CreateNewDocumentComponent, data: { hasChild: false, isTab: true } },
            { path: 'editDocument', component: EditDocumentComponent, data: { hasChild: false, isTab: true } },
            { path: 'createAction', component: CreateActionComponent, data: { hasChild: false, isTab: true } },
            { path: 'pastDeal', component: PastDealsComponent, data: { hasChild: false, isTab: true } },
            { path: 'rlsView', component: RlsViewComponent, data: { hasChild: false, isTab: true } },
            { path: 'createNewAction', component: CreateNewActionComponent, data: { hasChild: false, isTab: true } },
            { path: 'TrackerEditPage', component: TrackerEditPageComponent, data: { hasChild: false, isTab: true } }

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],

    exports: [RouterModule]
})
export class DealsRoutingModule { }
