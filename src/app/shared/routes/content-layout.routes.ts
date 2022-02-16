import { Routes } from '@angular/router';
import { AuthGuard} from '../../core/guards/auth.guard'
import { ReportsLandingComponent } from '@app/modules/reports/pages/reports-landing/reports-landing.component';
import { MoreViewComponent } from '@app/shared/components/more-view/more-view.component';
import { MaintainanceComponent } from '../components/maintainance/maintainance.component';


export const CONTENT_ROUTES: Routes = [
  
  {
    path : 'maintainance', component : MaintainanceComponent
  },
  {
    path: 'home',
    loadChildren: './modules/home/home.module#HomeModule',
    data: {preload: true},
   
  },
  {
    path: 'activities',
    loadChildren:'./modules/conversation/conversation.module#ConversationModule',
    data: {preload: true},
    canActivate:[AuthGuard]
  },
 // sprint 3 navigation to account module starts here
 {
  path: 'accounts',
  loadChildren: './modules/account/account.module#AccountModule'
},
{
  path: 'accounts/accountleads',
  loadChildren: './modules/leads/leads.module#LeadsModule'
},
{
  path: 'accounts/accountactivities',
  loadChildren:'./modules/conversation/conversation.module#ConversationModule',
},
  {
    path: 'contacts',
    loadChildren: './modules/contacts/contacts.module#ContactsModule',
    data: {preload: true},
    canActivate:[AuthGuard]
    },
    {
    path: 'campaign',
    loadChildren: './modules/campaign/campaign.module#CampaignModule',
    data: {preload: true},
    canActivate:[AuthGuard]
    },
  {
    path: 'leads',
    loadChildren: './modules/leads/leads.module#LeadsModule',
    data: {preload: true},
    canActivate:[AuthGuard]
  },
    // sprint 4 + sprint 7 starts here
    {
      path: 'opportunity',
      loadChildren: './modules/opportunity/opportunity.module#OpportunityModule',
      data: {preload: true}
     },
    {
      path: 'order',
      loadChildren: './modules/order/order.module#OrderModule'
    },
    {
      path: 'accounts/accountorders',
      loadChildren: './modules/order/order.module#OrderModule'
    },
    
      // sprint 4 + sprint 7 ends here
      // sprint 5
   {
    path: 'deals',
    loadChildren: './modules/deals/deals.module#DealsModule',
    canActivate:[AuthGuard]
  },
  {
    path: 'helpdesk',
    loadChildren: './modules/helpdesk/helpdesk.module#HelpdeskModule'
  },
  {
    path : 'reports',
    loadChildren: './modules/reports/reports.module#ReportsModule'
  },
  {
    path : 'moreview', component : MoreViewComponent
  }
];

