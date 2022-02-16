import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataCommunicationService } from '@app/core';
@Component({
  selector: 'app-helpdesk-nav',
  templateUrl: './helpdesk-nav.component.html',
  styleUrls: ['./helpdesk-nav.component.scss']
})
export class HelpdeskNavComponent implements OnInit {
  showorderlinks: boolean = true;
  showopplinks: boolean = true;
  showaccountlinks: boolean = true;
  searchhelpdesk: string = '';
  helpdesknavorder = [
    {
      "id": 1,
      "router": "helpdesk/orderBookings/manualPath",
      "name": "Manual push to CPRO",
    },
    {
      "id": 2,
      "router": "helpdesk/orderBookings/SLBDM",
      "name": "Transfer of SL BDM",
    },
    {
      "id": 3,
      "router": "helpdesk/orderBookings/orderTransfer",
      "name": "Order amendment transfer",
    },
    {
      "id": 4,
      "router": "helpdesk/orderBookings/trackOrder",
      "name": "Track order number (Retagged)",
    },
    {
      "id": 5,
      "router": "helpdesk/orderBookings/orderOwnerChange",
      "name": "Change vertical owner for order",
    },
    {
      "id": 6,
      "router": "helpdesk/orderBookings/CRM_Ref",
      "name": "Get CRM refernece no. from order no.",
    }

  ]
  helpdesknavaccounts = [
    {
      "id": 1,
      "router": "accounts/helpdeskaccountcreation",
      "name": "Account creation",
    },
    {
      "id": 2,
      // "router": "accounts/accountmodification/modificationactiverequest",
      "router": "/accounts/accountlist/farming",
      "name": "Account modification",
    },
    {
      "id": 3,
      "router": "helpdesk/accActions/accountmerge",
      "name": "Account merge",
    },
    {
      "id": 4,
      "router": "helpdesk/accActions/accountdelivery",
      "name": "Account delivery manager change",
    }

  ]

  helpdesknavopp = [
    {
      "id": 1,
      "router": "opportunity/allopportunity",
      "name": "Stage rollback",
    },
    {
      "id": 2,
      "router": "helpdesk/oppActions/ownerChange",
      "name": "Change vertical owner for opportunity",
    },
    {
      "id": 3,
      "router": "helpdesk/oppActions/trackOpp",
      "name": "Track opportunity number (Retagged)",
    }
  ]

  constructor(private router: Router,public service: DataCommunicationService) { }

  ngOnInit() {
  }

  
  navigate(nav){
    this.router.navigateByUrl(nav.router);
    this.service.hidehelpdesknav = false;
    this.service.hidehelpdeskmain = true;
  }
  navigateopp(navopp){
    this.router.navigateByUrl(navopp.router);
    this.service.hidehelpdesknav = false;
    this.service.hidehelpdeskmain = true;

  }
  navigateaccount(navaccount){
    this.router.navigateByUrl(navaccount.router);
    this.service.hidehelpdesknav = false;
    this.service.hidehelpdeskmain = true;
  }


}
