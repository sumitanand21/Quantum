import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderBookingComponent } from './pages/order-booking/order-booking.component';
import { OrderAuditComponent } from './pages/order-audit/order-audit.component';
import { OrderHierarchyComponent } from './pages/order-hierarchy/order-hierarchy.component';
import { OrderSitemapComponent } from './pages/order-sitemap/order-sitemap.component';
import { ViewindentComponent } from './pages/viewindent/viewindent.component';
import { EmailhistoryComponent } from './pages/emailhistory/emailhistory.component';
import { EmailLandingPageComponent } from './pages/email-landing-page/email-landing-page.component';
import { ModifyorderComponent } from './pages/modifyorder/modifyorder.component';
import { KnowledgemanagementComponent } from './pages/knowledgemanagement/knowledgemanagement.component';
import { RetagOrderComponent } from './pages/retag-order/retag-order.component';

const routes: Routes = [
    { path: 'orderbooking', component: OrderBookingComponent },
    { path: 'orderaudit', component: OrderAuditComponent },
    { path: 'orderhierarchy', component: OrderHierarchyComponent },
    { path: 'ordersite', component: OrderSitemapComponent },
    { path: 'viewindent', component: ViewindentComponent },
    { path: 'emailhistory', component: EmailhistoryComponent },
    { path: 'emaillandingpage', component: EmailLandingPageComponent },
    { path: 'modifyorder', component: ModifyorderComponent },
    { path: 'knowledgemanagement', component: KnowledgemanagementComponent },
    { path: 'retagOrder', component: RetagOrderComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderactionsRoutingModule { }
