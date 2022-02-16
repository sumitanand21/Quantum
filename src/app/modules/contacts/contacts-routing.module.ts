import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactsLandingComponent } from './pages/contacts-landing/contacts-landing.component';
import { CreateContactComponent } from './pages/contacts-landing/create-contact/create-contact.component';
import { ContactLeadComponent } from './pages/contact-lead/contact-lead.component';
import { ContactConversationComponent } from './pages/contact-conversation/contact-conversation.component';
import { ContactCampaignComponent } from './pages/contact-campaign/contact-campaign.component';
import { ContactOpenleadComponent } from './pages/contact-openlead/contact-openlead.component';
import { ContactArchiveleadComponent } from './pages/contact-archivelead/contact-archivelead.component';
import { ContactCompletecampaignComponent } from './pages/contact-completecampaign/contact-completecampaign.component';
import { ContactOpportunityComponent } from './pages/contact-opportunity/contact-opportunity.component';
import { DeactivatedContactsComponent } from './pages/deactivate-contact/deactivated-contacts/deactivated-contacts.component';
import { ContactMoreViewComponent } from './pages/contact-more-view/contact-more-view/contact-more-view.component';
import { ContactClosedleadComponent } from './pages/contact-closedlead/contact-closedlead.component';
import { GenericProspectAccount } from '@app/shared/components/generic-prospect-account/generic.prospect.account';
import { ContactAllcampaignComponent } from './pages/contact-allcampaign/contact-allcampaign.component';


const routes: Routes = [

  { path: '', component: ContactsLandingComponent },
  { path: 'contactconversation', component: ContactConversationComponent },
  { path: 'CreateContactComponent', component: CreateContactComponent },
  { path: 'contactcampaign', component: ContactCampaignComponent },
  { path: 'contactlead', component: ContactLeadComponent },
  { path: 'contactopenlead', component: ContactOpenleadComponent },
  { path: 'contactarchivelead', component: ContactArchiveleadComponent },
  { path: 'contactclosedlead', component: ContactClosedleadComponent },
  { path: 'contactcompletecampaign', component: ContactCompletecampaignComponent },
  { path: 'contactallcampaign', component: ContactAllcampaignComponent },
  { path: 'contactopportunity', component: ContactOpportunityComponent },
  { path: 'deactivatedcontacts', component: DeactivatedContactsComponent },
  { path: 'contactmoreviewcontacts', component: ContactMoreViewComponent },
  { path: 'prospectAccount', component: GenericProspectAccount },
  {
    path: 'Contactdetailslanding', 
    loadChildren :  './contact-detail-landing-module/contact-detail-landing-module.module#ContactDetailLandingModuleModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactsRoutingModule { }
