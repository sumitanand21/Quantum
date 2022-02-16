import { Component, OnInit } from '@angular/core';
import { DataCommunicationService } from '@app/core';
import { OrderService, OpportunitiesService } from '@app/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material/';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';

@Component({
    selector: 'app-manual-push',
    templateUrl: './manual-push.component.html',
    styleUrls: ['./manual-push.component.scss']
})
export class ManualPushComponent implements OnInit {
    ViewDetailsContent: Boolean = false;
    ManualContent: Boolean = true;
    tableCount = 30;
    // ris starts
    OpportunityIds: string = "";
    CrmNumbers: string = "";
    OrderNumbers: string = "";
    isSearchLoader = false;
    oppArray: any = [];
    oppArrayLength: number = 0;
    CRMArray: any = [];
    CRMArrayLength: number = 0;
    ordArray: any = [];
    ordArrayLength: number = 0;
    NoOpp: boolean = false;
    NoADDNL: boolean = false;
    NotCpro: boolean = true;
    process_table = [];
    owbs_table = [];
    budgetTable = [];
    itacTable = [];
    amendTable = [];
    ispricing: boolean = false;
    isItac: boolean = false;

    // Base Records
    BaseRecordTable: any = [{}];
    baseCrmrefArray: any = [];
    baseOpportunityId: any = [];
    baseOrderNumber: any = [];
    getCrmnum = "";
    getOppnum = "";
    getOrdernum = ""; 
    getusername="";
    getemailId="";

    // ViewDetails ADH/VDH/SDH

  AdhVdhSdhTable :any =[{}];
  acountNumber:any=[];
  getAccountnum="";
  toshowBASEtable: boolean = true;
  toshowADHtable: boolean = false;
  listofname ="";


    userArray = [
        { "index": 1, "Username": "Sandeep Sharma", "EmailId": "Satish.Kaushik@wipro.com", "Role": "Vertical delivery head", "Account": "NA", "Vertical": "Energy", "SBU": "NA", "Createdon": "23-dec-2019" },
        { "index": 2, "Username": "Sandeep Sharma", "EmailId": "Satish.Kaushik@wipro.com", "Role": "Vertical delivery head", "Account": "NA", "Vertical": "Energy", "SBU": "NA", "Createdon": "23-dec-2019" },
        { "index": 3, "Username": "Sandeep Sharma", "EmailId": "Satish.Kaushik@wipro.com", "Role": "Vertical delivery head", "Account": "NA", "Vertical": "Energy", "SBU": "NA", "Createdon": "23-dec-2019" },
        { "index": 4, "Username": "Sandeep Sharma", "EmailId": "Satish.Kaushik@wipro.com", "Role": "Vertical delivery head", "Account": "NA", "Vertical": "Energy", "SBU": "NA", "Createdon": "23-dec-2019" },
        { "index": 5, "Username": "Sandeep Sharma", "EmailId": "Satish.Kaushik@wipro.com", "Role": "Vertical delivery head", "Account": "NA", "Vertical": "Energy", "SBU": "NA", "Createdon": "23-dec-2019" }
    ];
    //  headernonsticky1 = [{ name: "Username",title:"Username" },
    //   { name: "EmailId",title:"Email Id" },
    //   { name: "Role",title:"Role" },
    //   { name: "Account",title:"Account" },
    //   { name: "Vertical",title:"Vertical" },
    //   { name: "SBU",title:"SBU" },
    //   { name: "Createdon",title:"Created on" },
    //   ];

    headerbaserecords = [{ name: "CRMReferenceNumber", title: "CRM reference number" },
    { name: "OpportunityNumber", title: "Opportunity number" },
    { name: "OrderNumber", title: "Order number" },
    ];

    headerAdhVdhSdh = [{ name: "username",title:"Username" },
    { name: "emailid",title:"EmailId" },
    { name: "role",title:"Role" },
    { name: "account",title:"Accountnumber" },
    { name: "vertical",title:"Vertical" },
    { name: "sbu",title:"Sbu" },
    //{ name: "createdon",title:"Createdon" },
    ];

    constructor(public service: DataCommunicationService, public orderService: OrderService, public projectService: OpportunitiesService) { }
    ShowManualPushContent() {
        this.ManualContent = true;
        this.ViewDetailsContent = false;
    }

    ShowViewDetailsContent() {
        this.ManualContent = false;
        this.ViewDetailsContent = true;
    }
    ngOnInit() {
    }

    goback() {
        this.service.hidehelpdesknav = true;
        this.service.hidehelpdeskmain = false;
    }



    //  { flag: '', oppnumber: '', message: ''},]
    // { flag: 'S', oppnumber: 'OP1234567890', message: 'Table data successfully'},
    // { flag: 'S', oppnumber: 'OP1234567890', message: 'Table data successfully'},
    // { flag: 'S', oppnumber: 'OP1234567890', message: 'Table data successfully'},
    // { flag: 'S', oppnumber: 'OP1234567890', message: 'Table data successfully'},
    // { flag: 'S', oppnumber: 'OP1234567890', message: 'Table data successfully'},
    // { flag: 'S', oppnumber: 'OP1234567890', message: 'Table data successfully'},
    // { flag: 'S', oppnumber: 'OP1234567890', message: 'Table data successfully'},
    // { flag: 'S', oppnumber: 'OP1234567890', message: 'Table data successfully'},
    // { flag: 'S', oppnumber: 'OP1234567890', message: 'Table data successfully'}  
    // ]


    //   { flag: 'S', oppnumber: '37847809', message: 'Table data successfully'},
    //   { flag: 'S', oppnumber: '37847809', message: 'Table data successfully'},
    //   { flag: 'S', oppnumber: '37847809', message: 'Table data successfully'}  
    // ]

    checkNumOfOpp(evt) {

        console.log("risOPP", evt.target.value);
        this.oppArrayLength = 0;
        this.oppArray = evt.target.value.split(',');
        this.oppArray = this.oppArray.filter(ris => (ris.length > 0 && ris != ','));
        this.oppArray = this.oppArray.map(it => it.trim());
        this.oppArrayLength = this.oppArray.length;

        console.log("opparr", this.oppArray);
        console.log("opparrLen", this.oppArrayLength);
    }

    checkNumOfCRM(evt) {
        this.CRMArrayLength = 0;
        this.CRMArray = evt.target.value.split(',');
        this.CRMArray = this.CRMArray.filter(ris => (ris.length > 0 && ris != ','));
        this.CRMArray = this.CRMArray.map(it => it.trim());
        this.CRMArrayLength = this.CRMArray.length;

        console.log("crmarr", this.CRMArray);
        console.log("crmarrLen", this.CRMArrayLength);
    }

    checkNumOfOrder(evt) {
        this.ordArrayLength = 0;
        this.ordArray = evt.target.value.split(',');
        this.ordArray = this.ordArray.filter(ris => (ris.length > 0 && ris != ','));
        this.ordArray = this.ordArray.map(it => it.trim());
        this.ordArrayLength = this.ordArray.length;

        console.log("opparr", this.ordArrayLength);
        console.log("opparr", this.ordArray);
    }



    doManualPush(push) {
        console.log("data1", this.CRMArray)
        console.log("data2", this.oppArray)
        console.log("data3", this.ordArray)
        this.isItac = true;
        if (push == 1) {
            this.NotCpro = true;
        }
        else if( push == 2) {
            this.ispricing = false;
            this.NotCpro = false;
        }
        else if (push == 3) {
            this.ispricing = true;
            this.NotCpro = false;
        }
        else {
        }
        this.process_table = [];
        this.amendTable = [];
        this.owbs_table= [];
        this.budgetTable = [];
        this.itacTable = [];
        let requestBody = {
            "Requests": this.CRMArray,
            "OpportunityIds": this.oppArray,
            "OrderNumbers": this.ordArray,
            "ManualPush": push,
        }
        console.log("payload", requestBody);
        try {
            this.service.loaderhome = true;
            this.orderService.getManualPush(requestBody).subscribe(
                (ris: any) => {
                    console.log("respo", ris)
                    if (!ris.IsError) {
                        if (push == 1) {
                            
                            this.NotCpro = true;
                            if (ris && ris.ResponseObject) {
                                if (ris.ResponseObject.CPRO && ris.ResponseObject.CPRO.length > 0) {
                                    this.NoOpp = true;
                                    let temp = ris.ResponseObject.CPRO.map((res) => {
                                        this.process_table.push({
                                            "flag":  res.Flag,
                                            "oppnumber": res && res.OppNumber ? res.OppNumber : '-',
                                            "Message": res && res.Message ? res.Message : '-',
                                            //   "crmreferencenumber": res.CrmReferenceNumber ? res.CrmReferenceNumber : '-',
                                        })
                                    })
                                }
                                else {
                                    this.NoOpp = false;
                                }
                                if (ris.ResponseObject.AmendmentPush && ris.ResponseObject.AmendmentPush.length > 0) {
                                    let temp = ris.ResponseObject.AmendmentPush.map((res) => {
                                        this.amendTable.push({
                                            "flag": res.Flag,
                                            "ordernumber": res && res.OrderNumber ? res.OrderNumber : '-',
                                            "Message": res && res.Message ? res.Message : '-',
                                        })
                                    })
                                }
                                if (ris.ResponseObject.ADDNL && ris.ResponseObject.ADDNL.length > 0) {
                                   
                                    this.NoADDNL = true;
                                    let temp = ris.ResponseObject.ADDNL.map((res) => {
                                        this.owbs_table.push({
                                            "flag": res.Flag,
                                            // "oppnumber": res && res.OppNumber ? res.OppNumber : '-',
                                            "Message": res && res.Message ? res.Message : '-',
                                            "crmreferencenumber": res.CrmNumber ? res.CrmNumber : '-',
                                        })
                                    })
                                }
                                else {
                                    this.NoADDNL = false;
                                }
                            }
                            else {
                                this.NoADDNL = false;
                            }
                        }
                        else if (push == 2) {
                            this.ispricing = false;
                            this.NotCpro = false;
                            if (ris && ris.ResponseObject) {
                                if (ris.ResponseObject.BudgetDetails && ris.ResponseObject.BudgetDetails.length > 0) {
                                    let temp = ris.ResponseObject.BudgetDetails.map((res) => {
                                        this.budgetTable.push({
                                            "flag": res.Flag,
                                            "ordernumber": res && res.OrderNumber ? res.OrderNumber : '-',
                                            "Message": res && res.Message ? res.Message : '-',
                                        })
                                    })
                                }

                            }
                            else {

                            }
                        }
                        else if (push == 3) {
                            this.ispricing = true;
                            this.NotCpro = false;
                            if (ris && ris.ResponseObject) {
                                if (ris.ResponseObject.PricingDetails && ris.ResponseObject.PricingDetails.length > 0) {
                                    let temp = ris.ResponseObject.PricingDetails.map((res) => {
                                        this.budgetTable.push({
                                            "flag": res.Flag,
                                            "ordernumber": res && res.OrderNumber ? res.OrderNumber : '-',
                                            "Message": res && res.Message ? res.Message : '-',
                                        })
                                    })
                                }
                            }
                            else {

                            }
                        }
                        else if (push == 4) {
                            if (ris && ris.ResponseObject) {

                            }
                            else {

                            }
                        }
                    }
                    else {
                        this.projectService.displayMessageerror(ris.Message);
                    }
                    this.service.loaderhome = false;
                })
        } catch (error) {
            this.service.loaderhome = false;
        }
        // finally {
            
        // }
    }

    doItacPush(push) {
        this.process_table = [];
        this.owbs_table= [];
        this.amendTable = [];
        this.budgetTable = [];
        this.itacTable = [];
        this.NotCpro = false;
        this.isItac = false;
        let requestBody = {
            "CRMRefrenceNumbers": this.CRMArray,
            "OpportunityIds": this.oppArray,
            "OrderNumbers": this.ordArray,
            "ManualPush": push,
        }
        
        console.log("payload", requestBody);
        try{
            this.service.loaderhome = true;
            this.orderService.getItacPush(requestBody).subscribe(
                (ris: any) => {
                    console.log("respo", ris)
                    if (!ris.IsError) {
                        if ( ris && ris.ResponseObject ) {
                            if ( ris.ResponseObject.ITACPushDetails && ris.ResponseObject.ITACPushDetails.length > 0)   {
                                let temp = ris.ResponseObject.ITACPushDetails.map((res) => {
                                    this.itacTable.push({
                                        "oppnumber": res && res.OppNumber ? res.OppNumber : '-',
                                        "ordernumber": res && res.OrderNumber ? res.OrderNumber : '-',
                                        "flag": res.Flag,
                                        "Message": res && res.Message,
                                    })
                                })
                            }    
                        }
                    }
                    else {                     
                        this.projectService.displayMessageerror(ris.Message);
                    }
                    this.service.loaderhome = false;
                })          
        }   catch(error) {
            this.service.loaderhome = false;
        }
        //finally {
            
        //}
    }
    //********** Base Records (View details) Start here*********

    getBaseCrmRef(data) {
        console.log("kirti");
        this.baseCrmrefArray = data.split(',');
        this.baseCrmrefArray = this.baseCrmrefArray.map(x => x.trim());
        this.baseCrmrefArray = this.baseCrmrefArray.filter(x => (x.length > 0 && x != ','));
    }

    getBaseOppNum(data) {
        this.baseOpportunityId = data.split(',');
        this.baseOpportunityId = this.baseOpportunityId.map(x => x.trim());
        this.baseOpportunityId = this.baseOpportunityId.filter(x => (x.length > 0 && x != ','));
    }

    getBaseOrderNum(data) {
        this.baseOrderNumber = data.split(',');
        this.baseOrderNumber = this.baseOrderNumber.map(x => x.trim());
        this.baseOrderNumber = this.baseOrderNumber.filter(x => (x.length > 0 && x != ','));
    }


    getAccountNum(data){
        this.acountNumber= data.split(',');
        this.acountNumber= this.acountNumber.map(x => x.trim());
        this.acountNumber=this.acountNumber.filter(x=> (x.length >0 && x != ','));
       }
    
    
        forBaseViewOrder(){
         this.toshowBASEtable =true;
         this.toshowADHtable =false;
         this.AdhVdhSdhTable =[{}];
        
          console.log("CrmArray",this.baseCrmrefArray);
          console.log("OppArray",this.baseOpportunityId);
          console.log("OrderArray",this.baseOrderNumber);
    
          this.getBaseCrmRef(this.getCrmnum);
          this.getBaseOppNum(this.getOppnum);
          this.getBaseOrderNum(this.getOrdernum);
    
          let payload={
           "CRMRefrenceNumbers": this.baseCrmrefArray,
           "OpportunityIds" : this.baseOpportunityId,
           "OrderNumbers": this.baseOrderNumber,
          }
          console.log("payload",payload);
    
          this.service.loaderhome = true;
          var saveBaseRecordData =[];
    
         this.orderService.getviewBaseRecords(payload).subscribe((res: any)=>
          {
            console.log("response",res);
    
          if(!res.IsError){
             if(res.ResponseObject && res.ResponseObject.length >0 ){
                   this.tableCount = res.TotalRecordCount;  //tablecount
                  let item = res.ResponseObject.map(data =>{
                    saveBaseRecordData.push({
                    "CRMReferenceNumber": data.CrmNumber ?data.CrmNumber :'-',
                    "OpportunityNumber": data.OppNumber?data.OppNumber:'-',
                    "OrderNumber": data.OrderNumber?data.OrderNumber:'-',
                    })
                  });
                  console.log("saveBaseRecordData",saveBaseRecordData);
              this.BaseRecordTable= [...saveBaseRecordData];
              console.log("BaseRecordTable", this.BaseRecordTable);
              
             }else{
              
              this.projectService.displayMessageerror("No record found.");
              this.BaseRecordTable=[{}];
              this.service.loaderhome = false;
             }
          }else{
           
            this.projectService.displayMessageerror("No data found.");
            this.BaseRecordTable=[{}];
            this.service.loaderhome = false;
           }
           this.service.loaderhome = false;
          })
        }
    
        resetvalues(){
          this.getCrmnum="";
          this.getOppnum="";
          this.getOrdernum="";
          this.getAccountnum="";
         this.getusername="";
         this.getemailId="";
         this.BaseRecordTable=[{}];
         this.AdhVdhSdhTable=[{}];
        }
    
    
      // **************BASE-RECORDS End here*************
    
      // ************** ViewDetails ADH/VDH/SDH Starts here*******
         
    
      forViewAdhVdhSdh(){
    
        
        this.toshowADHtable =true;
        this.toshowBASEtable=false;
        this.BaseRecordTable =[{}];
    
    
        this.getBaseCrmRef(this.getCrmnum);
        this.getBaseOppNum(this.getOppnum);
        this.getBaseOrderNum(this.getOrdernum);
        this.getAccountNum(this.getAccountnum);
    
       let dhpayload={
        "Requests": this.baseCrmrefArray,
        "OpportunityIds" : this.baseOpportunityId ,
        "OrderNumbers": this.baseOrderNumber,
        "AccountIds":this.acountNumber,
       }
         var adhvdharray=[];
        console.log("dhpayload",dhpayload);
        this.service.loaderhome = true;
        this.orderService.getviewAdhVdhSdh(dhpayload).subscribe((res:any) =>{
         console.log("seeresponse",res);
    
        if(!res.IsError){
          if(res.ResponseObject && res.ResponseObject.length >0){
            
           let temp= res.ResponseObject.map( mapdata => {
            adhvdharray.push({
    
                "username":  mapdata.UserName ? mapdata.UserName: '-',
                "emailid" : mapdata.EmailId ?  mapdata.EmailId :'-',
                 "role": mapdata.Role ? mapdata.Role : '-',
                 "account": mapdata.Account ? mapdata.Account : '-',
                 "vertical": mapdata.Vertical ? mapdata.Vertical : '-',
                 "sbu": mapdata.Sbu ? mapdata.Sbu : '-',
                 //"createdon": mapdata.CreatedOn ? mapdata.CreatedOn : '-',
               })
               this.service.loaderhome = false;
          });
           
           this.AdhVdhSdhTable =[...adhvdharray ];
           console.log("AdhVdhSdhTable",this.AdhVdhSdhTable);
    
          }else{
            this.projectService.displayMessageerror("No record found.");
            this.AdhVdhSdhTable=[{}];
            this.service.loaderhome = false;
          }
    
        }else{
            this.projectService.displayMessageerror("No data found.");
            this.AdhVdhSdhTable=[{}];
            this.service.loaderhome = false;
        }
        this.service.loaderhome = false;
      })
    
    }  
    
      // ************** ViewDetails ADH/VDH/SDH Ends here*******


}
