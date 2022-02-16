import { Component, OnInit } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { Router } from '@angular/router';
import { map, filter, pluck, groupBy, mergeMap, toArray } from 'rxjs/operators';

import { OpportunitiesService, DataCommunicationService } from '@app/core';
import { OrderService } from '@app/core/services/order.service';

@Component({
  selector: 'app-create-amendment',
  templateUrl: './create-amendment.component.html',
  styleUrls: ['./create-amendment.component.scss']
})
export class CreateAmendmentComponent implements OnInit {
  more_clicked;
  showradiobtn: boolean=false;
  all_lead: boolean;
  open_lead: boolean;
  myopen_lead: boolean;
  allopportunity = [];
  toggleTransition: boolean = false;
  changedTxt: string = 'Show more';
  userArray: any[];
  countStored;
  showService:string;
  myFilter = [];

  // showcheck: boolean = false;
  selectedAll: any;
  showorder: boolean;
  showopportunity = true;
  createamendment: any[];
  tableTotalCount: number;
  constructor(
    private allopportunities: OpportunitiesService,
    private router: Router,
    public service: DataCommunicationService,
   public allorders:OrderService
  ) { }

  
  // auto complete service calls
  AccountnameArray = [];
  wiproLinkedAGP(data) {
    var orginalArray = this.allopportunities.getwiproLinkedAGP();
    orginalArray.subscribe((x: any[]) => {
      return this.AccountnameArray = x.filter(y => y.name.includes(data));
    });

  }
  paginationPageNo = {
    "PageSize": 10,
    "RequestedPageNumber": 1,
    "OdatanextLink": ""
  }
  

  myString;
  filterBox = {};
  isFilter?: boolean;

  //filter starts

  check: boolean = false;
  searchitem;
  headerData;
  headerName;
  //filter ends

  /** Filter logic ends */
  goBack() {
    window.history.back();
  }

  performTableChildAction(childActionRecieved): Observable<any> {
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {

      case 'convertOpportunity': {
        return of('nurture Trigger');
      }

      case 'Name': {
        this.router.navigate(['/opportunity/opportunityview']);
      }
      case 'OpportunityName':{
        this.router.navigate(['/order/createamendmentchild']);
        return;
      }
    }
  }

  ngOnInit() {

    var orginalOrderArray = this.allorders.getcreateamendment();
    orginalOrderArray.subscribe((x: any[]) => {
      this.createamendment = x;
      this.tableTotalCount = x.length;
    });
  }

  /************Select Tabs dropdown code starts */
  selectedTabValue: string = "All conversation group";
  appendConversation(e) {
    this.selectedTabValue = e.name;
    if (e.router) {
      this.router.navigate([e.router]);
    }
  }
  tabList = [
    {
      view: 'System views',
      groups: [{ name: 'My conversation group' },
      { name: 'All conversation group' },
      { name: 'Archived conversation group' }
      ]
    },

  ]
  /************Select Tabs dropdown code ends */

  
}
