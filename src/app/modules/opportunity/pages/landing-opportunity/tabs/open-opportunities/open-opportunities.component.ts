import { Component, OnInit } from '@angular/core';
import { allopportunityService, DataCommunicationService } from '@app/core';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-open-opportunities',
  templateUrl: './open-opportunities.component.html',
  styleUrls: ['./open-opportunities.component.scss']
})
export class OpenOpportunitiesComponent implements OnInit {
  tableTotalCount: number;

  constructor(private allopportunities: allopportunityService, private router: Router,public service: DataCommunicationService) { }
  allopportunity = [];
  ngOnInit() {
    var orginalArray = this.allopportunities.getAll();
    orginalArray.subscribe((x: any[]) => {
      this.allopportunity = x;
      this.tableTotalCount = x.length;
    });
  }
  paginationPageNo = {
    "PageSize": 10,
    "RequestedPageNumber": 1,
    "OdatanextLink": ""
  }
  performTableChildAction(childActionRecieved): Observable<any> {
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {

      case 'convertOpportunity': {
        return of('nurture Trigger');
      }

      case 'OpportunityName': {
         this.router.navigate(['/opportunity/opportunityview/overview']);
      
      }
    }
  }
  /************Select Tabs dropdown code starts */
  selectedTabValue: string = "Won";
  appendConversation(e) {
    this.selectedTabValue = e.name;
    if (e.router) {
      this.router.navigate([e.router]);
    }
  }
  tabList: {}[] = [
    {
      view: 'System views',
      groups: [{ name: 'My owned', router: 'opportunity/openopportunity' },
      { name: 'My open', router: 'opportunity/myopenopportunity' },
      { name: 'Won', router: 'opportunity/allopportunity' },
      { name: 'Lost', router: 'opportunity/openopportunity' },
      { name: 'Inavtive', router: 'opportunity/openopportunity' }
      ]
    },
    // {
    //   view: 'Custom views',
    //   groups: [{ name: 'Wipro mobility conversation groups' },
    //   { name: 'Wipro commerce conversation groups' }
    //   ]
    // }

  ]
  /************Select Tabs dropdown code ends */
}
