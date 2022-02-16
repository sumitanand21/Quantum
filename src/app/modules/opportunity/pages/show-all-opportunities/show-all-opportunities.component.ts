import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DataCommunicationService, allopportunityService} from '@app/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-show-all-opportunities',
  templateUrl: './show-all-opportunities.component.html',
  styleUrls: ['./show-all-opportunities.component.scss']
})
export class ShowAllOpportunitiesComponent implements OnInit {
  tableTotalCount: number;

  constructor(public dialog: MatDialog,public service: DataCommunicationService,public router: Router,public allOpportunity: allopportunityService) { }
  AllOpportunityTable = [];
  ngOnInit() {

    var orginalArray = this.allOpportunity.getAllOpportunities();
    orginalArray.subscribe((x: any[]) => {
      this.AllOpportunityTable = x;
      this.tableTotalCount = x.length;
    });
  }

  goBack() {
    window.history.back();
  }

  paginationPageNo = {
    "PageSize": 10,
    "RequestedPageNumber": 1,
    "OdatanextLink": ""
  }
  
  openSaveViewModal() {
    
    const dialogRef = this.dialog.open(SaveViewComponent,
      {
        width: '511px'
      });
  }


  // custom -tab-select-dropdown start 

    // {name:'My owned',router:'conversations/mylist'},
    tabList:{}[] =[
      { Listitem:'repeating',
      content:[
      {view:'System views',
       groups:[{name:'My owned'},
               {name:'My open '},
               {name:'Won'},
               {name:'Lost'},
               {name:'Inactive'}
              ]
       },
      {view:'System views',
      groups:[{name:'Wipro Mobility'},
              {name:'Wipro Commerce'}
             ]
      },
      
    ]
  },{

      Listitem:'fixed',
      content:[
        {groups:[{name:'Create new view ',className:'mdi mdi-eye-plus-outline',router:'opportunity/allopportunityview'},
                {name:'Show all opportunity views',className:'mdi mdi-eye-settings-outline',router:'opportunity/showOpportunity'}]
      }

      ]


  }




  ]

  selectedTabValue: string = "My Open";

  tabNameSwitch;
  ind:boolean;
  
  openTabDrop() {
      this.tabNameSwitch = !this.tabNameSwitch;
  }

  closeTabDrop(){
      this.tabNameSwitch = false;
  }
  appendConversation(e) {
    console.log(">>>>>>>>>>>>>"+ JSON.stringify(e));
    console.log(">>>>>>>>>>>>>"+ e.view);
    if(e.view == 'System views'){
      this.selectedTabValue = e.name;
    }
      if(e.router){
      this.router.navigate([e.router]);
      }
    
  }  

  // custom tab-select-dropdown end 



    // table selector event emitters

    performTableChildAction(childActionRecieved): Observable<any> {
      var actionRequired = childActionRecieved;
     
   
      switch (actionRequired.action) {
  
        case 'share': {
          this.router.navigateByUrl('/conversations/childInfo');
          return of('share Trigger');
        }
       
        case 'Name':{
          console.log(actionRequired)
          this.router.navigate(['/conversations/conversationthread/ReimagineProcurementprocess1/childthreadtab']);
          return of('Name Trigger'); 
        }
  
        
      }
    }
  


}


@Component({
  selector: 'app-save-view',
  templateUrl: './save-view-popup.html',
  styleUrls: ['./show-all-opportunities.component.scss']
})

export class SaveViewComponent { }