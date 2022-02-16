import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataCommunicationService } from '@app/core';
import { ContactleadService } from '@app/core';
import { RoutingState } from '@app/core/services/navigation.service';
import { MyOpenLeadsService } from '@app/core/services/myopenlead.service';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { ClearArchivedLeadState, ClearOpenLeadState, ClearMyopenlead, ClearAllLeadDetails } from '@app/core/state/actions/leads.action';
import { EncrDecrService } from '@app/core/services/encr-decr.service';

@Component({
  selector: 'app-leads-landing',
  templateUrl: './leads-landing.component.html',
  styleUrls: ['./leads-landing.component.scss']
})
export class LeadsLandingComponent implements OnInit {
  Unqualified_lead: boolean;
  Qualified_lead: boolean;
  Archived_lead: boolean;
  sidebar:boolean;
  Orinator : any;
  constructor(public router: Router, public service: DataCommunicationService,
    private store: Store<AppState>,
    private EncrDecr: EncrDecrService,
    public contactLeadService: ContactleadService,
    private myOpenLeadsService: MyOpenLeadsService,
    public userdat: DataCommunicationService,
    private routingstate : RoutingState,
    ) { 
      this.store.dispatch(new ClearArchivedLeadState())
      this.store.dispatch(new ClearOpenLeadState())
      this.store.dispatch(new ClearMyopenlead())
      this.store.dispatch(new ClearAllLeadDetails())
    }
  ngOnInit() {
    if (this.router.url.includes('/leads/')) {
      this.sidebar=true;
  }
  if (!this.router.url.includes('/accounts/accountleads')) { 
    sessionStorage.removeItem('selAccountObj');
  }
  //Rudra jan 28
    // this.callloader();
  }
  callloader() {
    // this.service.loadconver()
  }
  unqalified() {
    this.Unqualified_lead = true;
    this.Qualified_lead = false;
    this.Archived_lead = false;
  }
  Qualified() {
    this.Unqualified_lead = false;
    this.Qualified_lead = true;
    this.Archived_lead = false;
  }
  Archived() {
    this.Unqualified_lead = false;
    this.Qualified_lead = false;
    this.Archived_lead = true;
  }
  createlead() {
    this.contactLeadService.LeadguidId =undefined
    this.myOpenLeadsService.clearLeadAddContactSessionStore();
    if (this.router.url.includes('/accounts/accountleads')) { 
      let accountInfo = JSON.parse(this.EncrDecr.get("EncryptionEncryptionEncryptionEn", sessionStorage.getItem('selAccountObj'), "DecryptionDecrip"));
      sessionStorage.setItem('TempLeadDetails', JSON.stringify(this.createLeadTempDetails(accountInfo)));
    } else {
      sessionStorage.removeItem('selAccountObj');
    }
    this.router.navigateByUrl('/leads/createlead');
  }

  createLeadTempDetails(accountInfo) {
    this.Orinator = localStorage.getItem('upn')
    console.log("seeing ten lead deatusl!!!")
    console.log(accountInfo)
    return {
      leadName: null,
      leadSource: null,
      accountName: { Name: accountInfo.Name, SysGuid: accountInfo.SysGuid, isProspect: accountInfo.isProspect },
      sbu: null,
      vertical: null,
      alliance: null,
      advisor: null,
      enquirytype: null,
      country: null,
      serviceLineToggle: false,
      WiproSolutionToggle: false,
      desc: null,
      id: "",
      links: {
        wiprosolution: null,
        activitygroup: null,
        campaign: (accountInfo.LinkedCampaign) ? accountInfo.LinkedCampaign : null,
        opportunity: null,
        agp: null
      },
      leadInfo: {
        dealValue: null,
        currency: null,
        timeline: null
      },
      ownerDetails: {
        originator: this.Orinator,
        oiginatorlist: null,
        owner: null,
        customers: null
      },
      serviceline: null,
      attachments: null,
      finalActivityGroup: null,
      finalCampaignGroup: null,
      finalOpportunityGroup: null,
      finalCustomerGroup: null,
      moduleSwitch: true,
      moduletype: {
        name: "account",
        data: {
          Activityid: ''
        },
        Moduleroute: this.router.url
      }
    }
  }

  download(){
    console.log("clcikded downlaod now")
    console.log(this.router)

    //filename
    var Filename = "my csv"
    //headers
    var headers = ["Holiday ID", "Holiday Date", "Holiday Comment", "Holiday Status"]
    //data
    var data  =[
      {"id": 101, "Holiday_Date": "21/02/2019", "Holiday_Comment": "company holiday calendar of 2019. ", "Holiday_Status": "Active"},
      {"id": 102, "Holiday_Date": "22/02/2019", "Holiday_Comment": "company holiday calendar of 2019.", "Holiday_Status": "Active"},
      {"id": 103, "Holiday_Date": "23/02/2019", "Holiday_Comment": "company holiday calendar of 2019.", "Holiday_Status": "Pending"},
      {"id": 104, "Holiday_Date": "24/02/2019", "Holiday_Comment": "company holiday calendar of 2019.", "Holiday_Status": "Active"},
      {"id": 105, "Holiday_Date": "25/02/2019", "Holiday_Comment": "company holiday calendar of 2019.", "Holiday_Status": "NotActive"},
      {"id": 106, "Holiday_Date": "26/02/2019", "Holiday_Comment": "company holiday calendar of 2019.", "Holiday_Status": "Active"},
      {"id": 107, "Holiday_Date": "27/02/2019", "Holiday_Comment": "company holiday calendar of 2019.", "Holiday_Status": "Pending"},
      {"id": 108, "Holiday_Date": "28/02/2019", "Holiday_Comment": "company holiday calendar of 2019.", "Holiday_Status": "Active"},
      {"id": 109, "Holiday_Date": "02/03/2019", "Holiday_Comment": "company holiday calendar of 2019.", "Holiday_Status": "NotActive"},
      {"id": 110, "Holiday_Date": "03/04/2019", "Holiday_Comment": "company holiday calendar of 2019.", "Holiday_Status": "Active"},
      {"id": 111, "Holiday_Date": "21/05/2019", "Holiday_Comment": "company holiday calendar of 2019.", "Holiday_Status": "Active"}
    ];

      
  
  }
}
