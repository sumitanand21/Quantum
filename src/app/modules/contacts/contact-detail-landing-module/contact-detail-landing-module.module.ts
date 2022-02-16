import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactDetailLandingModuleRoutingModule } from './contact-detail-landing-module-routing.module';
import { ContactDetailLandingComponent, deleteprofileComponent, activatecontactpopComponent } from '../pages/contacts-landing/contact-detail-landing/contact-detail-landing.component';
import { ContactDetailsChildComponent, replaceImg1ComponentChild, deleteImg1ComponentChild, socialpopupComponent } from '../pages/contacts-landing/contact-detail-landing/tabs/contact-details-child/contact-details-child.component';
import { MarketInfoComponent } from '../pages/contacts-landing/contact-detail-landing/tabs/market-info/market-info.component';
import { RelationLogComponent } from '../pages/contacts-landing/contact-detail-landing/tabs/relation-log/relation-log.component';
import { SharedModule } from '@app/shared';
import { ContactHistoryComponent } from '../pages/contacts-landing/contact-detail-landing/tabs/contact-history/contact-history.component';

const popupsComponent = [ 
  deleteprofileComponent,
  activatecontactpopComponent,
  replaceImg1ComponentChild,
  deleteImg1ComponentChild,
  socialpopupComponent
]
@NgModule({
  declarations: [
    ContactDetailLandingComponent,
    ContactDetailsChildComponent,
    MarketInfoComponent,
    RelationLogComponent,
    ContactHistoryComponent,
    popupsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ContactDetailLandingModuleRoutingModule,
  ],
  entryComponents: popupsComponent
})
export class ContactDetailLandingModuleModule { }
