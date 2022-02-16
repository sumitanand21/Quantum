import { Component, OnInit } from '@angular/core';
import { DataCommunicationService,OpportunitiesService,OrderService } from '@app/core';

@Component({
  selector: 'app-crm-reference',
  templateUrl: './crm-reference.component.html',
  styleUrls: ['./crm-reference.component.scss']
})
export class CRMReferenceComponent implements OnInit {
 // just a format 
  tableCount=30;
  data: string = "add what to u to copy here" ;
  userArray = [
    { "index":1, "Name": "Loss category*", "Kushal Shah": "Connection", "Messageone": "Connection", "Rakesh Sharma": "Connection", "Messagetwo": "Connection", "Harsha Patel": "Connection", "Messagethree": "Connection" },
    { "index":2,"Name": "Loss category*", "Kushal Shah": "Alignment with Decision Process", "Messageone": "Alignment with Decision Process", "Rakesh Sharma": "Alignment with Decision Process", "Messagetwo": "Alignment with Decision Process", "Harsha Patel": "Alignment with Decision Process", "Messagethree": "Alignment with Decision Process" },
    { "index":3,"Name": "Loss category*", "Kushal Shah": "Customer Feedback", "Messageone": "Customer Feedback", "Rakesh Sharma": "Customer Feedback", "Messagetwo": "Customer Feedback", "Harsha Patel": "Customer Feedback", "Messagethree": "Customer Feedback" },
    { "index":4,"Name": "Loss category*", "Kushal Shah": "Customer Feedback", "Messageone": "Customer Feedback", "Rakesh Sharma": "Customer Feedback", "Messagetwo": "Customer Feedback", "Harsha Patel": "Customer Feedback", "Messagethree": "Customer Feedback" },
    {"index":5, "Name": "Loss category*", "Kushal Shah": "Sarthak Das", "Messageone": "Sarthak Das", "Rakesh Sharma": "Vidyut Kumar", "Messagetwo": "Vidyut Kumar", "Harsha Patel": "Arjun Kumar", "Messagethree": "Arjun Kumar" }
  ];
   headernonsticky1 = [
     { name: 'Name' },
    { name: "Kushal Shah" },
    { name: "Messageone" },
    { name: "Rakesh Sharma" },
    { name: "Messagetwo" },
    { name: "Harsha Patel" },
    { name: "Messagethree" },
    ];// format ends 

     Order='';
     // Response Object 
     defaultCrmResponse: any = {
      OrderNumber: '',
      AccountNumber: '',
      AccountName: '',
      OpportunityForecastName: '',
      OpportunityName: '',
      OpportunityNumber: '' ,
      CRMReference: '',
      ProjectFlag: '',
    }

    // reference object for response obj
    CrmRefObject  : any = Object.assign({}, this.defaultCrmResponse )

  constructor(public service: DataCommunicationService, public orderservice: OrderService,
    public projectService: OpportunitiesService ) {
  }


  ngOnInit() {
  }
  goback() {
    this.service.hidehelpdesknav = true;
    this.service.hidehelpdeskmain = false;
  }
  // copy to clip-board
  copyCRM(val) {

let selBox:any = document.createElement("textarea");
selBox.value = val;
document.body.appendChild(selBox);
selBox.select();
document.execCommand('copy');
 document.body.removeChild(selBox);
this.projectService.displayMessageerror("Copied to clipboard ");
// document.execCommand('copy');
// this.projectService.displayMessageerror("Copied to clipboard ");
  }

  // main function for api call and value binding
  searchCrm() {

    let crmdata =
    {
    OrderNumber: this.Order
    }
    this.service.loaderhome = true;
    this.orderservice.getCrmReferenceDetails(crmdata).subscribe(
      (data: any) => {
        
          this.service.loaderhome = false;
          console.log("data",crmdata);
          // order number

          if (data && data.ResponseObject)
          {
            this.CrmRefObject.OrderNumber = data.ResponseObject.OrderNumber ? data.ResponseObject.OrderNumber : '';
            this.CrmRefObject.OpportunityNumber= data.ResponseObject.OpportunityNumber ? data.ResponseObject.OpportunityNumber : '';
            this.CrmRefObject.OpportunityName = data.ResponseObject.OpportunityName? data.ResponseObject.OpportunityName:'';
            this.CrmRefObject.OpportunityForecastName= data.ResponseObject.OpportunityForecast && data.ResponseObject.OpportunityForecast.Name ? data.ResponseObject.OpportunityForecast.Name: '';
            this.CrmRefObject.ProjectFlag=data.ResponseObject.ProjectFlag ? data.ResponseObject.ProjectFlag: '';
            this.CrmRefObject.AccountNumber=data.ResponseObject.Account && data.ResponseObject.Account.AccountNumber? data.ResponseObject.Account.AccountNumber:'';
            this.CrmRefObject.AccountName=data.ResponseObject.Account && data.ResponseObject.Account.AccountName ? data.ResponseObject.Account.AccountName:'';
            this.CrmRefObject.CRMReference = data.ResponseObject.CRMReference ? data.ResponseObject.CRMReference : '';
          }

          else
          {
            this.CrmRefObject = Object.assign({}, this.defaultCrmResponse )
          }
        },
        err => {
          this.CrmRefObject = Object.assign({}, this.defaultCrmResponse )
          this.service.loaderhome = false;
        }            
        );

  }
}

