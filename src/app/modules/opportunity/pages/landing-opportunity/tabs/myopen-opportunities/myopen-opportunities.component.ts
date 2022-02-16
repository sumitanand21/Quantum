import { Component, OnInit } from '@angular/core';
import { allopportunityService, DataCommunicationService } from '@app/core';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-myopen-opportunities',
  templateUrl: './myopen-opportunities.component.html',
  styleUrls: ['./myopen-opportunities.component.scss']
})
export class MyopenOpportunitiesComponent implements OnInit {
  tableTotalCount: number;
  constructor(private allopportunities: allopportunityService, private router: Router,public service: DataCommunicationService) { }
  openopportunity = [];
  ngOnInit() {
    var orginalArray = this.allopportunities.getOpenOpportunity();
    orginalArray.subscribe((x: any[]) => {
      this.openopportunity = x;
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
         if(actionRequired.objectRowData[0].statusText == 'Nurtured'){
          this.service.leadNuture = true;
      }
      else{
        this.service.leadNuture = false;
      }
      
      }
    }
  }
  /************Select Tabs dropdown code starts */
selectedTabValue: string = "My open";
appendConversation(e) {
    this.selectedTabValue = e.name;
    if (e.router) {
        this.router.navigate([e.router]);
    }
}
tabList: {}[] = [
{
    view: 'System views',
    groups: [{ name: 'My owned', router: 'opportunity/allopportunity' },
    { name: 'My open', router: 'opportunity/myopenopportunity' },
    { name: 'Won', router: 'opportunity/allopportunity' },
    { name: 'Lost', router: 'opportunity/allopportunity' },
    { name: 'Inavtive', router: 'opportunity/allopportunity' },
    { name: 'Create new view', router: 'opportunity/allopportunityview',showView:true },
    { name: 'Show all opportunity views', router: 'opportunity/showOpportunity',showAllView:true }
    ]
},
// {
//     view: 'Custom views',
//     groups: [{ name: 'Wipro mobility conversation groups' },
//     { name: 'Wipro commerce conversation groups' }
//     ]
// }

]
/************Select Tabs dropdown code ends */
}
