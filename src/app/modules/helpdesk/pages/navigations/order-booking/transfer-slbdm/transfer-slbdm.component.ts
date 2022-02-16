import { Component, OnInit } from '@angular/core';
import { DataCommunicationService } from '@app/core';
import { OpportunitiesService, OrderService } from '@app/core';
import { Observable } from 'rxjs';
import { isError } from 'util';

@Component({
  selector: 'app-transfer-slbdm',
  templateUrl: './transfer-slbdm.component.html',
  styleUrls: ['./transfer-slbdm.component.scss']
})
export class TransferSLBDMComponent implements OnInit {

  OldSLBDMEamilId: string = '';
  NewSLBHMEmailId: string = '';
  //Service Line
  serviceLineArray = [];
  serviceLineSysGuid: string = '';

  //practise
  practicearray = [];
  practiceSysGuid: string = '';

  //Subpractice
  subPracticeArray = [];
  subPracticeSysGuid: string = '';

  selectedModule: string = '';
  isSearchLoader: boolean = false;
  searchDisabled: boolean = false;

  Opportunity: any = [{}];
  status = '';
  selectedData: any = [];
  primaryRecordId: string = '';
  recordOpp: any = [];
  recordOrd: any = [];

  //order
  OrderSearchTable: any = [{}];

  companyentity1;
  practice;
  ViewDetailsContent: Boolean = false;
  ManualContent: Boolean = true;
  tableCount = 0;
  showtable: boolean = false;

  userArray = [
    { "index": 1, "Username": "Sandeep Sharma", "Email Id": "Satish.Kaushik@wipro.com", "Role": "Vertical delivery head", "Account": "NA", "Vertical": "Energy", "SBU": "NA", "Created on": "23-dec-2019" },
    { "index": 2, "Username": "Sandeep Sharma", "Email Id": "Satish.Kaushik@wipro.com", "Role": "Vertical delivery head", "Account": "NA", "Vertical": "Energy", "SBU": "NA", "Created on": "23-dec-2019" },
    { "index": 3, "Username": "Sandeep Sharma", "Email Id": "Satish.Kaushik@wipro.com", "Role": "Vertical delivery head", "Account": "NA", "Vertical": "Energy", "SBU": "NA", "Created on": "23-dec-2019" },
    { "index": 4, "Username": "Sandeep Sharma", "Email Id": "Satish.Kaushik@wipro.com", "Role": "Vertical delivery head", "Account": "NA", "Vertical": "Energy", "SBU": "NA", "Created on": "23-dec-2019" },
    { "index": 5, "Username": "Sandeep Sharma", "Email Id": "Satish.Kaushik@wipro.com", "Role": "Vertical delivery head", "Account": "NA", "Vertical": "Energy", "SBU": "NA", "Created on": "23-dec-2019" }
  ];


  headernonstickyOpp = [{ name: "Ordernumber", title: "Order Number" },
  { name: "OpportunityNumber", title: "Opportunity Number"},
  { name: "Vertical" , title: "Vertical"},
  { name: "Accountname", title: "Account Name"},
  { name: "Opportunityname", title: "Opportunity Name" },
  { name: "Serviceline", title: "Service line" },
  { name: "Practice", title: "Practice" },
  { name: "Subpractice", title: "Sub Practice" },
  { name: "ServicelineSLBDM", title: "Serviceline SLBDM" },
  { name: "CreatedOn", title: "Created On" },
  ];

  headernonstickyOrd = [{ name: "Ordernumber", title: "Order Number" },
  { name: "OpportunityNumber", title: "Opportunity Number"},
  { name: "Vertical" , title: "Vertical"},
  { name: "Accountname", title: "Account Name"},
  { name: "Opportunityname", title: "Opportunity Name" },
  { name: "ServicelineSLBDM", title: "SLBDM Name" },
  { name: "Practice", title: "Practice Name" },
  { name: "Subpractice", title: "Sub Practice Name" },
  ];

  constructor(public service: DataCommunicationService, public orderService: OrderService, public projectService: OpportunitiesService) { }

  ngOnInit() {
    this.getServiceLineData();
  }
  selected = '';

  goback() {
    this.service.hidehelpdesknav = true;
    this.service.hidehelpdeskmain = false;
  }

  checkEmail(){
    this.serviceLineSysGuid='';
    this.practiceSysGuid='';
    this.subPracticeSysGuid='';
    this.selectedModule='';
    this.selected = '';
  }
// emailcheck: boolean=false;
//   checkEmailId(email){
//     console.log("email", email);
//       if(email.match('^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$')){
//          this.emailcheck = true;      
//         }else{
//         this.emailcheck = false;
//       }
//   }

  ValidationOnSearch() {
    if (this.selectedModule == 'Opportunities') {
      if (this.OldSLBDMEamilId && this.serviceLineSysGuid && this.practiceSysGuid && this.selectedModule && this.status) {  
        return false;
      } else {
        return true;
      }
    } else {
      if (this.OldSLBDMEamilId && this.serviceLineSysGuid && this.practiceSysGuid && this.selectedModule) {
        return false;
      } else {
        return true;
      }
    }
  }
  validatesearch(){
    this.searchDisabled=false;
    this.selectedData=[];
    this.NewSLBHMEmailId='';
  }

  getselectedModule() {
    this.searchDisabled=false;
    if (this.selectedModule == 'Opportunities') {
      this.searchDisabled=true;
      this.getOpportunityData();
      
    } else {
      this.searchDisabled=true;
      this.getOrderSLTransferSearch();
    }
  }

  getServiceLine(serviceline){
    
    if( serviceline ){
      return (serviceline.Code?serviceline.Code + ' - ' : '') + (serviceline.Name?serviceline.Name: '')
    }
    else{
      return [];
    }
    
    
    }
    

  getServiceLineData() {
    this.isSearchLoader = true;
    this.orderService.getAllActiveServiceLine().subscribe((res: any) => {
      if (!res.isError) {
        if (res.ResponseObject) {
          this.serviceLineArray = (res.ResponseObject) ? res.ResponseObject : [];
        }
      }
    })
    console.log("serviceLineSysGuid", this.serviceLineSysGuid);
    this.isSearchLoader = false;
  }

  practiceTransferBdm() {
    this.isSearchLoader = true;
    let practicedata = {
      "GUID": this.serviceLineSysGuid
    }
    this.orderService.getPractiseSlBdm(practicedata).subscribe((res: any) => {
      if (!res.IsError) {
        if (res.ResponseObject) {
          this.practicearray = (res.ResponseObject) ? res.ResponseObject : [];

        }
      }
    })

    console.log("practiseSysGuid", this.practiceSysGuid);
    this.isSearchLoader = false;
  }

  getSubPracticeSLBDMData() {
    console.log("serviceLineSysGuid", this.serviceLineSysGuid);
    console.log("practiseSysGuid", this.practiceSysGuid);
    this.isSearchLoader = true;
    let data = {
      "PracticeId": this.practiceSysGuid
    }
    this.orderService.getSubPracticeSLBDM(data).subscribe((res: any) => {
      if (!res.IsError) {
        if (res.ResponseObject) {
          this.subPracticeArray = (res.ResponseObject) ? res.ResponseObject : [];
          this.subPracticeArray.map(data => {
            data.Name = unescape(JSON.parse('"' + data.Name + '"')).replace(/\+/g, ' ');
          })
        }
      }

    })
    this.isSearchLoader = false;
  }


  getOpportunityData() {
    this.isSearchLoader = true;
    let tempOppoTable = [];
    let data = {
      "RequestedPageNumber": 1,
      "PageSize": 2000,
      "Email": (this.OldSLBDMEamilId) ? this.OldSLBDMEamilId : '',
      "ServiceLineID": (this.serviceLineSysGuid) ? this.serviceLineSysGuid : '',
      "PracticeID": (this.practiceSysGuid) ? this.practiceSysGuid : '',
      "SubPracticeID": (this.subPracticeSysGuid) ? this.subPracticeSysGuid : '',
      "StateCode": this.status
    }
    this.orderService.getOpportunity(data).subscribe((data: any) => {
      console.log("respone", data);
      if (!data.isError) {
        if (data.ResponseObject) {
          this.tableCount = data.TotalRecordCount;
          let OppoObj = data.ResponseObject.map((oppo, index) => {
            tempOppoTable.push({
              "index": index + 1,
              "Ordernumber": (oppo.OppOrderNumber) ? oppo.OppOrderNumber : '-',
              "OpportunityNumber": (oppo.OpportunityNumber) ? oppo.OpportunityNumber : '-',
              "Vertical": (oppo.VerticalName) ? oppo.VerticalName : '-',
              "Accountname": (oppo.Account.Name) ? oppo.Account.Name : '-',
              "Opportunityname": (oppo.OpportunityName) ? oppo.OpportunityName : '-',
              "Serviceline": (oppo.ServiceLineData.ServicelineIdName) ? oppo.ServiceLineData.ServicelineIdName : '-',
              "Practice": (oppo.ServiceLineData.PracticeIdName) ? oppo.ServiceLineData.PracticeIdName : '-',
              "Subpractice": (oppo.ServiceLineData.SubPracticeIdName) ? oppo.ServiceLineData.SubPracticeIdName : '-',
              "ServicelineSLBDM": (oppo.ServiceLineData.ServicelineBDMName) ? oppo.ServiceLineData.ServicelineBDMName : '-',
              "CreatedOn": (oppo.ServiceLineData.CreatedOn) ? oppo.ServiceLineData.CreatedOn : '-',
              "SLCAID": (oppo.ServiceLineData.SLCAID) ? oppo.ServiceLineData.SLCAID : '-'
            })
          });

          this.Opportunity = [...tempOppoTable]
        } else {
          this.Opportunity = [{}];
        }

      } else {
        this.Opportunity = [{}];
      }
    })
  }


  getOrderSLTransferSearch() {
    let orderdata = {
      "RequestedPageNumber": 1,
      "PageSize":2000,
      "Email": (this.OldSLBDMEamilId)? this.OldSLBDMEamilId:'',
      "ServiceLineID": (this.serviceLineSysGuid) ? this.serviceLineSysGuid : '',          
      "PracticeID": (this.practiceSysGuid) ? this.practiceSysGuid : '',              
      "SubPracticeID": (this.subPracticeSysGuid) ? this.subPracticeSysGuid : '',           
    }
    console.log("orderpayload", orderdata);
    this.orderService.getOrderSLBDMSearch(orderdata).subscribe((res: any) => {
      var OrderSearchTableObj = [];
      if (!res.isError) {
        if (res.ResponseObject) {
          console.log("orderpayload", res);
          this.tableCount = res.TotalRecordCount;
          console.log("id1",res.ResponseObject[0].CreditAllocationDetails[0].PracticeDisplay);
          let temp = res.ResponseObject.map((vso, index) => {
            OrderSearchTableObj.push({
              "index": index + 1,
              "Ordernumber": (vso.OrderNumber) ? vso.OrderNumber : '-',
              "OpportunityNumber": (vso.OpportunityNumber) ? vso.OpportunityNumber : '-',
              "Vertical": (vso.Vertical) ? vso.Vertical : '-',
              "Accountname": (vso.Account.Name) ? vso.Account.Name : '-',
              "Opportunityname": (vso.OpportunityName) ? vso.OpportunityName : '-',
              "ServicelineSLBDM": (vso.CreditAllocationDetails[0].ServicelineBDMName) ? vso.CreditAllocationDetails[0].ServicelineBDMName : '-',
              "Practice": (vso.CreditAllocationDetails[0].PracticeDisplay) ? vso.CreditAllocationDetails[0].PracticeDisplay : '-',
              "Subpractice": (vso.CreditAllocationDetails[0].SubPracticeDisplay)? vso.CreditAllocationDetails[0].SubPracticeDisplay:'-',
              "CreditAlloactionId": (vso.CreditAllocationDetails[0].CreditAlloactionId) ? vso.CreditAllocationDetails[0].CreditAlloactionId : '-'
              
            })
          });
          console.log("OrderSearchTableObj", OrderSearchTableObj);
          this.OrderSearchTable = [...OrderSearchTableObj]

          console.log("OrderSearchTable", this.OrderSearchTable);
        }else {
          this.OrderSearchTable = [{}];
          
        }

      }else {
        this.OrderSearchTable = [{}];
      }
    })

  }


  //check box for autocomplete starts
  performTableChildAction(childActionRecieved): Observable<any> {
    if (this.selectedModule == 'Opportunities') {
      switch (childActionRecieved.action) {
        case 'checkbox': {
          this.selectedOppName(childActionRecieved.action);
          return
        }
        case 'selectAll': {
          this.selectedOppName(childActionRecieved.action);
          return
        }
      }
    } else {
      switch (childActionRecieved.action) {
        case 'checkbox': {
          this.selectedOrdName(childActionRecieved.action);
          return
        }
        case 'selectAll': {
          this.selectedOrdName(childActionRecieved.action);
          return
        }
      }

    }
  }
  
  selectedOrdName(action) {
    this.selectedData = this.OrderSearchTable.filter((it) => (it.isCheccked ? 'true' : 'false') == 'true')
    if (action == 'selectAll') {
      //this.selectedData = this.OrderSearchTable;
      console.log("selectredoo",this.selectedData);
      this.recordOrd = this.selectedData.map((recordord) => {
        return recordord.CreditAlloactionId;
      })
      console.log("singeoo",this.recordOrd);
    } else {
      //this.selectedData = this.OrderSearchTable.filter(it => it.isCheccked)
      console.log("singeoo",this.selectedData);
      this.recordOrd = this.selectedData.map((recordord)=> {
        return recordord.CreditAlloactionId;
        })
      console.log("singeoo",this.selectedData[0].CreditAlloactionId);
    }

  }


  selectedOppName(action) {
    this.selectedData = this.Opportunity.filter((it) => (it.isCheccked ? 'true' : 'false') == 'true')
    if (action == 'selectAll') {
      //this.selectedData = this.Opportunity;
      console.log("selectred", this.selectedData);
      this.recordOpp = this.selectedData.map(recordopp => {
        return recordopp.SLCAID;
      })
    }
    else {
      //this.selectedData = this.Opportunity.filter(it => it.isCheccked)
      console.log("singe", this.selectedData);
      this.recordOpp = this.selectedData.map(recordopp => {
        return recordopp.SLCAID;
      })
    }
  }

  clickOnTransferBtn() {
    if (this.selectedModule === 'Opportunities') {
      this.transferForOpp();
    } else {
      this.transferForOrd();
    }
  }

  transferForOpp() {
    console.log("opprecord", this.recordOpp.toString());
    let SLTransfer = {
      "ConversionType": 1,
      "PrimaryRecordId": this.recordOpp.toString(),
      "OldEmail": this.OldSLBDMEamilId,
      "NewEmail": this.NewSLBHMEmailId
    }
    this.orderService.getTransferData(SLTransfer).subscribe((data: any) => {
      if (!data.IsError) {
        if (data.ResponseObject) {
          this.projectService.displayMessageerror(data.Message);
          this.service.loaderhome = true;
          this.OldSLBDMEamilId='';
          this.serviceLineSysGuid ='';
          this.practiceSysGuid ='';
          this.subPracticeSysGuid ='';
          this.selectedModule = '';
          this.selected = '';
          this.Opportunity = [];
          this.status='';
          this.selectedData =[];
          this.OrderSearchTable = [];
          this.NewSLBHMEmailId ='';
          this.showtable=false;
          this.service.loaderhome = false;
        } else {
          this.projectService.displayMessageerror("SLBDM role is not mapped to this user, please map accordingly");
          this.NewSLBHMEmailId ='';
        }
      }
    }),err => {
      this.projectService.displayerror(err.status);
    }

  }

  transferForOrd() {
    console.log("orderrecord", this.recordOrd.toString());
    let SLTransfer = {
      "ConversionType": 2,
      "PrimaryRecordId": this.recordOrd.toString(),
      "OldEmail": this.OldSLBDMEamilId,
      "NewEmail": this.NewSLBHMEmailId
    }
    this.orderService.getTransferData(SLTransfer).subscribe((data: any) => {
      if (!data.IsError) {
        if (data.ResponseObject) {
          this.projectService.displayMessageerror(data.Message);
          this.service.loaderhome = true;
          this.OldSLBDMEamilId='';
          this.serviceLineSysGuid ='';
          this.practiceSysGuid ='';
          this.subPracticeSysGuid ='';
          this.selectedModule = '';
          this.selected = '';
          this.Opportunity = [];
          this.status='';
          this.selectedData =[];
          this.OrderSearchTable = [];
          this.NewSLBHMEmailId ='';
          this.showtable=false;
          this.service.loaderhome = false;
        } else {
          this.projectService.displayMessageerror("SLBDM role is not mapped to this user, please map accordingly");
          this.NewSLBHMEmailId ='';
        }
      }
    }),err => {
      this.projectService.displayerror(err.status);
    }

  }

}



