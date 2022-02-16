import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactDetailLandingComponent } from '../pages/contacts-landing/contact-detail-landing/contact-detail-landing.component';
import { RelationLogComponent } from '../pages/contacts-landing/contact-detail-landing/tabs/relation-log/relation-log.component';
import { MarketInfoComponent } from '../pages/contacts-landing/contact-detail-landing/tabs/market-info/market-info.component';
import { ContactDetailsChildComponent } from '../pages/contacts-landing/contact-detail-landing/tabs/contact-details-child/contact-details-child.component';
import { ContactHistoryComponent } from '../pages/contacts-landing/contact-detail-landing/tabs/contact-history/contact-history.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ContactDetailLandingComponent,
        children: [
          {
            path: '', redirectTo: 'contactDetailsChild', pathMatch:'full'
          },
          { 
            path: 'contactDetailsChild', component: ContactDetailsChildComponent 
          },
          { 
            path: 'marketInfo', component: MarketInfoComponent 
          },
          { 
            path: 'relationLog', component: RelationLogComponent
           },
          { 
            path: 'history', component: ContactHistoryComponent 
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactDetailLandingModuleRoutingModule { }
