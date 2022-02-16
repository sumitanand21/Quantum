import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContactService, OnlineOfflineService, ErrorMessage } from '@app/core';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { getRelationshipLogById } from '@app/core/state/selectors/contact-list.selector';
import { LoadAllRelationshipCount } from '@app/core/state/actions/contact.action';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-relation-log',
  templateUrl: './relation-log.component.html',
  styleUrls: ['./relation-log.component.scss']
})
export class RelationLogComponent implements OnInit 
{
  noneditpart = true;
  Conversationdata:any;
  Leadsdata:any;
  relationShipLog: any;
  ContactEditID:any;
  isLoading : boolean = false;
  Campaigndata:any;
  Opportunitydata:any;
  userguid:any;
  relationshipArrayData:any;
  TabNav$:Subscription

  constructor(
    private router: Router, private contactService: ContactService,
    private EncrDecr: EncrDecrService,
    public store: Store<AppState>,
    private onlineOfflineservice: OnlineOfflineService,
    private errorMessage: ErrorMessage,
    public matSnackBar: MatSnackBar,
    ) { 
      this.TabNav$ = this.contactService.contactNavFrom().subscribe(res => {
        console.log("flag we got to nav is!")
        console.log(res)
        if (res) {
          if (res.navEnum == 1) {
            this.router.navigate(['/contacts/Contactdetailslanding/contactDetailsChild'])
          }else if (res.navEnum==2){
            this.router.navigate(['/contacts/Contactdetailslanding/marketInfo'])
          }
        }
      });
    }
 
  ngOnInit() {
    this.isLoading = true;
    this.userguid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
    console.log("user guid",this.userguid);
    this.ContactEditID = JSON.parse(localStorage.getItem("contactEditId"));
    console.log("Contact Edit ID ",this.ContactEditID);
    //State management for relationship log tab
   this.store.pipe(select(getRelationshipLogById(this.ContactEditID))).subscribe(res => {
    console.log("got response from selector details");
    console.log("pipeeeeeeee",res);
    this.isLoading = false;
    if (res!=null) {
      this.relationShipLog = res
      this.UpdateRelationDetailsToDom()
    } else {
      this.relationShiplogAlldata();
    }
  });

  //offline service 
  if (!this.onlineOfflineservice.isOnline) {
    const cacheDetailsData =  this.contactService.getCacheRelationshipDetailsById(this.ContactEditID);
    console.log("got the cache data")
    console.log(cacheDetailsData)
    if (cacheDetailsData != null) {
      this.relationShipLog = cacheDetailsData
      this.UpdateRelationDetailsToDom()
    } else {
      this.relationShiplogAlldata()
    }
  }
  }

  relationShiplogAlldata(){
    this.isLoading = true
    this.contactService.getRelationshiplog(this.ContactEditID,this.userguid).subscribe(res => {
      if (res.IsError === false) {
        this.isLoading = false;
        this.relationShipLog = res.ResponseObject;
        console.log("relationship log data",this.relationShipLog);

        const ImmutabelObj = { ...res.ResponseObject, id: this.ContactEditID}
        this.store.dispatch(new LoadAllRelationshipCount({ AllRelationshiplogCount: ImmutabelObj }))
  
        this.UpdateRelationDetailsToDom();
      }
      else{
        this.isLoading = false;
        this.errorMessage.throwError(res.Message);
      }
  });
}

  UpdateRelationDetailsToDom() {

   this.Conversationdata = [{ header: "Meetings",
   activeAppoinnments:this.relationShipLog.AcivityGroups.ActiveActivities,
   totalCount: this.relationShipLog.AcivityGroups.TotalActivities }];

   this.Leadsdata = [{ header: "Leads",
   unqualifiedleads:this.relationShipLog.Leads.MyOpenLeads,
   qualifiedleads:this.relationShipLog.Leads.OpenLeads,
   archivedleads:this.relationShipLog.Leads.ArchivedLeads,                      //Archieved lead means All leads
   closedleads:this.relationShipLog.Leads.ClosedLeads,
   totalleads: this.relationShipLog.Leads.TotalLeads },];

    this.Campaigndata = [{ header: "Campaigns",
    activeCampaign: this.relationShipLog.Campaigns.MyActiveCampaigns,
    completeCampaign: this.relationShipLog.Campaigns.CompletedCampaigns,
    allCampaign: this.relationShipLog.Campaigns.AllCampaigns,
    totalCampaign: this.relationShipLog.Campaigns.TotalCampaigns },];

    this.Opportunitydata= [{ header: "Opportunities",
    openOpportunities: this.relationShipLog.Opportunities.OpenOpportunities,
    suspendedOpportunities: this.relationShipLog.Opportunities.SuspendedOpportunities,
    wonOpportunities: this.relationShipLog.Opportunities.WonOpportunities,
    terminatedOpportunities: this.relationShipLog.Opportunities.TerminatedOpportunities,
    lostOpportunities: this.relationShipLog.Opportunities.LostOpportunities,
    totalOpportunities: this.relationShipLog.Opportunities.TotalOpportunities,
    allOpportunity : this.relationShipLog.Opportunities.AllOpportunities,
    myOpenOpportunity : this.relationShipLog.Opportunities.MyOpenOpportunities,
    ownedOpportunity : this.relationShipLog.Opportunities.MyOwnedOpportunities,
    overDueOpportunity : this.relationShipLog.Opportunities.OverDueOpportunities,

  }];
 
  }

  //Activity search type
  OnclickLinksSearchType(searchType){
    if(searchType ===1) {
      console.log("conversation contact links for Activity");
      this.router.navigate(['/contacts/contactconversation']);
    }
  }

  //Lead search type
  OnclickLeadsSearchType(searchType){
    if(searchType === 2){
      console.log("archive lead contact");
      this.router.navigate(['/contacts/contactarchivelead']);
    }
     if (searchType === 3){
      console.log("qualified contact, open leads");
      this.router.navigate(['/contacts/contactopenlead']);
    }
    if(searchType === 4) {
      console.log("unqualified contact, my open leads");
      this.router.navigate(['/contacts/contactlead']);
    }
    if(searchType === 5) {
      console.log("Closed lead contact, closed lead");
      this.router.navigate(['/contacts/contactclosedlead']);
    }
  }

  //Campaign search type
  OnclickCampaignSearchType(searchType){
    if(searchType === 1){
      console.log("My active campaign");
      this.router.navigate(['/contacts/contactcampaign']);
    }
    if(searchType === 2){
      console.log("Completed campaign");
      this.router.navigate(['/contacts/contactcompletecampaign']);
    }
    if(searchType === 3){
      console.log("All campaign");
      this.router.navigate(['/contacts/contactallcampaign']);
    }
  }

  OnclickOpportunitiesSearchType(statusCode){
    if(statusCode === 4){
      localStorage.setItem('searchText',statusCode);
      console.log("Open Opportunities");
      this.router.navigate(['/opportunity/allopportunity']);
    }
    if(statusCode === 8){
      localStorage.setItem('searchText',statusCode);
      console.log("Suspended Opportunities");
      this.router.navigate(['/opportunity/allopportunity']);
    }
    if(statusCode === 6){
      localStorage.setItem('searchText',statusCode);
      console.log("Won Opportunities")
      this.router.navigate(['/opportunity/allopportunity']);
    }
    if(statusCode === 5){
      localStorage.setItem('searchText',statusCode);
      console.log("Terminated Opportunities")
      this.router.navigate(['/opportunity/allopportunity']);
    }
    if(statusCode === 7){
      localStorage.setItem('searchText',statusCode);
      console.log("Lost Opportunities")
      this.router.navigate(['/opportunity/allopportunity']);
    }

    if(statusCode === 1){
      sessionStorage.setItem('searchText',statusCode);
      console.log("All Opportunities")
      this.router.navigate(['/opportunity/allopportunity']);
    }
    if(statusCode === 2){
      sessionStorage.setItem('searchText',statusCode);
      console.log("My Owned Opportunities")
      this.router.navigate(['/opportunity/allopportunity']);
    }
    if(statusCode === 3){
      sessionStorage.setItem('searchText',statusCode);
      console.log("My open Opportunities")
      this.router.navigate(['/opportunity/allopportunity']);
    }
    if(statusCode === 9){
      sessionStorage.setItem('searchText',statusCode);
      console.log("Over Due Opportunities")
      this.router.navigate(['/opportunity/allopportunity']);
    }
  }

  OnError(message) {
    let action;
    this.matSnackBar.open(message, action, {
      duration: 1000
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.TabNav$.unsubscribe()
  }

}
