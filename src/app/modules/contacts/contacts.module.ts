import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactsRoutingModule } from './contacts-routing.module';
import { ContactsLandingComponent, deletepopComponent } from './pages/contacts-landing/contacts-landing.component';
import { CreateContactComponent, errorpopcomponent, deleteprofilecontactComponent, cancelpopComponent, copyAddressComponent, replaceImgComponentcontact, deleteImgComponentcontact, socialpopComponent, createpopComponent } from './pages/contacts-landing/create-contact/create-contact.component';
import { ContactLeadComponent, deletepopComponentlead, } from './pages/contact-lead/contact-lead.component';
import { ContactConversationComponent, deletepopComponentcon, } from './pages/contact-conversation/contact-conversation.component';
import { ContactCampaignComponent, deletepopComponentcamp, } from './pages/contact-campaign/contact-campaign.component';
import { SharedModule } from '@app/shared';
import { NguCarouselModule } from '@ngu/carousel';
// custome date format start
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { StoreModule } from '@ngrx/store';
import { ContactReducer } from '@app/core/state/reducers/contact-reducer';
import { EffectsModule } from '@ngrx/effects';
import { ContactDetailsReducer } from '@app/core/state/reducers/contact/contact.details.reducer';
import { ContactOpenleadComponent } from './pages/contact-openlead/contact-openlead.component';
import { ContactArchiveleadComponent } from './pages/contact-archivelead/contact-archivelead.component';
import { ContactCompletecampaignComponent } from './pages/contact-completecampaign/contact-completecampaign.component';
import { ContactOpportunityComponent } from './pages/contact-opportunity/contact-opportunity.component';
import { ContactEffects } from '@app/core/state/effects/contact/contact.effect';
import { MarketInfoDetailsReducer } from '@app/core/state/reducers/contact/marketInfo.details.reducer';
import { RelationshipLogDetailsReducer } from '@app/core/state/reducers/contact/relationShip.details.reducer';
import { DeactivatedContactsComponent } from './pages/deactivate-contact/deactivated-contacts/deactivated-contacts.component';
import { InActivateContactReducer } from '@app/core/state/reducers/inActivateContact-reducer';
import { ContactMoreViewComponent } from './pages/contact-more-view/contact-more-view/contact-more-view.component';
import { ContactClosedleadComponent } from './pages/contact-closedlead/contact-closedlead.component';
import { ContactAllcampaignComponent } from './pages/contact-allcampaign/contact-allcampaign.component';
export const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

const popupsComponentsContacts = [
  socialpopComponent,
  deleteprofilecontactComponent,
  replaceImgComponentcontact,
  deleteImgComponentcontact,
  cancelpopComponent,
  deletepopComponent,
  deletepopComponentlead,
  deletepopComponentcon,
  deletepopComponentcamp,
  createpopComponent,
  errorpopcomponent,
  copyAddressComponent
]
@NgModule({
  declarations: [
    ContactsLandingComponent,
    CreateContactComponent,
    ContactLeadComponent,
    ContactConversationComponent,
    ContactCampaignComponent,
    ContactOpenleadComponent,
    ContactArchiveleadComponent,
    ContactCompletecampaignComponent,
    ContactOpportunityComponent,
    DeactivatedContactsComponent,
    ContactMoreViewComponent,
    popupsComponentsContacts,
    ContactClosedleadComponent,
    ContactAllcampaignComponent
  ],
  imports: [
    CommonModule,
    ContactsRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    StoreModule.forFeature('LoadAllContacts', ContactReducer),
    StoreModule.forFeature('LoadAllDeActivateContacts', InActivateContactReducer),
    StoreModule.forFeature('ContactDetails', ContactDetailsReducer),
    StoreModule.forFeature('MarketDetails', MarketInfoDetailsReducer),
    StoreModule.forFeature('RelationshipLogDetails', RelationshipLogDetailsReducer),
    EffectsModule.forFeature([ContactEffects]),
    // StoreModule.forFeature('MarketDetails',MarketInfoDetailsReducer)
  ],
  entryComponents: popupsComponentsContacts,
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ContactsModule { }
