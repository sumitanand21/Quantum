import { Component, OnInit } from '@angular/core';
import { DataCommunicationService, OpportunitiesService ,  opportunityHeaders, opportunityNames } from '@app/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatSnackBar } from '@angular/material/';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-end-sales-cycle',
  templateUrl: './end-sales-cycle.component.html',
  styleUrls: ['./end-sales-cycle.component.scss'],
  providers: [DatePipe]
})
export class EndSalesCycleComponent implements OnInit {
  error_validation=false;
  saveClicked = false;
  runCompetitor = 0;


nthingSelected:boolean= false;
  wiproExcludedReason: boolean = true;
  GetLossCategories = [];
  lossReasonarray = [];
  EndSalesCycleReasonsarray1 = [];
  EndSalesCycleReasonsarray2 = [];
  showradiobtn: boolean = false;
  showtable: boolean = false;
  autocomplete: boolean;
  dDatabasebtn: boolean = true;
  selectedAll: boolean;
  opportunityname:boolean=false;
  GetLossCategoriesd: string;
  lossReasons: string;
  currentStory: boolean = true;
  decisionbywipro:any;
  LossCategoryId: any;
  reasonValue: string;
  data1:boolean=true;
  categoryId:any;
  tempdown = [];
  tempup = [];
  CompetitorData = [];
  CompetitorEnable = [];
  CompetitorDisable=[];
  wiprocompetitorData=[];
  SoleSourceOpp: boolean;
  wiprocompetitorDataInitial=[];
  pursuitStage:boolean;
  secureStage:boolean;
  markingOppWon:boolean;
  markingOppLost:boolean;
  errorborder_condition:boolean;
  errortext_condition:boolean;
  accountID;
  validClicked:boolean=false;
  //enableCompSoleNo:boolean=false;
  isSearchLoaderForOrder=false;

  currentStage="";
  opportunityId;
  creationDate;
  stateCode;
  opportunityName;
  flag1;
  getReasonValue= [];
  getInformationSource = [];
  wiproStages= [];
  wentWellOptionSet= [];
  wiproCustomer=[];
  stateOptionSet=[];
  opportunityStatusOptionSet= [];
  disableFields;
  disableReason;
  reasonSelected=0;
  wiproExcludedArray= [];
  wiproExcludedName="";

  wentWellValue;
  wentWrongValue;
  ofiValue;

  accessData;
  fullAccess;
 // partialAccess;
  writeAccess= true;
  disableCompetitor= false;
  fullAccessFromCreatePage;
  isSimpleOpportunity= false;
  opportunityStatusCheck;
  opportunitySelectedFromLookUp = 0;
  wiproExcludedValue= null;
  isAppirioFromSession = this.projectService.getSession('IsAppirioFlag');
 // orderCreatedFlag= false;

  status;
  constructor(private snackBar: MatSnackBar,public dialog: MatDialog,private router: Router, public projectService: OpportunitiesService, public service: DataCommunicationService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.errortext_condition=false;
    this.errorborder_condition=false;
    this.pursuitStage=false;
    this.secureStage=false;
    this.markingOppWon=false;
    this.markingOppLost=false;

     // this.stateCode =0;
     this.flag1=2;
     this.disableFields= false;
     this.disableReason = true;
     this.reasonSelected=0;

     this.runCompetitor=0;
     this.disableCompetitor= false;
     this.isSimpleOpportunity = false;
     this.opportunitySelectedFromLookUp = 0;
     this.opporId = "";
     this.status = "";
     this.wiproExcludedValue= null;

  console.log("this.isSimpleOpportunity", this.isSimpleOpportunity);
  this.isSimpleOpportunity = this.projectService.getSession('isSimpleOpportunity');
  console.log("this.isSimpleOpportunity", this.isSimpleOpportunity);
  //this.isSimpleOpportunity = true;

  this.currentStage = this.projectService.getSession('currentState');
  //this.currentStage = "184450000";
  console.log("this.currentStage", this.currentStage);

  //this.opportunityId = "a297b805-748e-e911-a834-000d3aa058cb";
  this.opportunityId =  this.projectService.getSession('opportunityId');

  this.creationDate = this.projectService.getSession('createdDate');
  console.log("this.creationDate: ", this.creationDate);

  this.stateCode = this.projectService.getSession('statecode');
  console.log("this.stateCode: ", this.stateCode);


  // this.projectService.opportunityName=this.overviewDetailData.name;
  this.opportunityName = this.projectService.getSession('opportunityName');
  //this.accessData = this.projectService.getSession('accessData');
  this.fullAccessFromCreatePage = this.projectService.getSession('FullAccess');
  console.log("fullAccessFromCreatePage: ", this.fullAccessFromCreatePage);
  this.opportunityStatusCheck= this.projectService.getSession('opportunityStatus');

  this.accountID=this.projectService.getSession('accountid');
  console.log("Account ID: ",this.accountID);


console.log("ensales from order",this.projectService.getSession('endsalesfromorder'));
console.log("Is simple opportunity",this.isSimpleOpportunity);
  // this.orderCreatedFlag= this.projectService.getSession('ordercreated');

  // && this.orderCreatedFlag == false
  if(this.opportunityStatusCheck == 1 && this.projectService.getSession('endsalesfromorder') != true){
    if(this.fullAccessFromCreatePage == true ){
        this.disableFields = false;
    }
    else {
      this.disableFields = true;
      this.disableCompetitor= true;
    }
  }
  else{
    if(this.projectService.getSession('endsalesfromorder') == true) {
        this.disableFields = false;
    }
    else {
      this.disableFields = true;
      this.disableCompetitor= true;
    }
  }

    //this.stateCode = 2;


    if(this.stateCode == 2 || this.stateCode == 1){
      console.log(this.stateCode);
      if(this.projectService.getSession('endsalesfromorder') == true) {
        this.disableFields = false;
        this.disableCompetitor= false;
    }
    else {
      this.disableFields = true;
      this.disableCompetitor= true;
    }
      
    }

    if(this.isSimpleOpportunity== true){
      this.disableCompetitor= false;
    }

    //Based on status -- if lost/terminated disable editing field
    if(this.projectService.getSession('opportunityStatus') == 5 || this.projectService.getSession('opportunityStatus') == 184450000){
      this.disableFields = true;
      this.disableCompetitor= true;
    }

  debugger;

      this.endSalesData =
                {
                  "AwardedtoAnotherParty": {
                    "SysGuid": "0",
                    "MapGuid": null,
                    "Name": "",
                    "ParentId": null,
                    "Type": null,
                    "ActivityGuid": null,
                    "LeadGuid": null,
                    "SysNumber": null,
                    "MapName": null,
                    "LinkActionType": 0
                  },
                  "DecisionBy": {
                    "SysGuid": "0",
                    "MapGuid": null,
                    "Name": "",
                    "ParentId": null,
                    "Type": null,
                    "ActivityGuid": null,
                    "LeadGuid": null,
                    "SysNumber": null,
                    "MapName": null,
                    "LinkActionType": 0
                  },
                  "Description": "",
                  "DuplicateOpportunityId": "",
                  "DuplicateOpportunityName": "",
                  "EndSalesCycleId": "",
                  "Name": "",
                  "OpportunityId": "",
                  "Reason": {
                    "SysGuid": "", // customer
                   // "SysGuid": "e461fb76-3b5c-e911-a830-000d3aa058cb", // wipro   duplicate entry
                  //  "SysGuid": "55545f67-3b5c-e911-a830-000d3aa058cb",  // wipro without opportunity input
                    "MapGuid": null,
                    "Name": null,
                    "ParentId": null,
                    "Type": null,
                    "ActivityGuid": null,
                    "LeadGuid": null,
                    "SysNumber": null,
                    "MapName": null,
                    "LinkActionType": 0
                  },
                  "Stage": {
                    "SysGuid": "",
                    "MapGuid": null,
                    "Name": null,
                    "ParentId": null,
                    "Type": null,
                    "ActivityGuid": null,
                    "LeadGuid": null,
                    "SysNumber": null,
                    "MapName": null,
                    "LinkActionType": 0
                  },
                  "DecisionTaken": "",
                  "AdditionalComments": {
                      "WentWell": [
                                    {
                                        "Comments": "",
                                        "EndSalesCycleAdditionalCommentId": "",
                                        "Name": "",
                                        "Type": "",
                                        "TypeName": ""
                                    },
                                    {
                                      "Comments": "",
                                      "EndSalesCycleAdditionalCommentId": "",
                                      "Name": "",
                                      "Type": "",
                                      "TypeName": ""
                                  }
                                  ],
                      "WentWrong": [
                        {
                          "Comments": "",
                          "EndSalesCycleAdditionalCommentId": "",
                          "Name": "",
                          "Type": "",
                          "TypeName": ""
                      }
                      ],
                      "OFI": [
                        {
                          "Comments": "",
                          "EndSalesCycleAdditionalCommentId": "",
                          "Name": "",
                          "Type": "",
                          "TypeName": ""
                      }
                      ]
                  },
                  "LossReasonDetails": []
                }

                console.log("this.end sales empty data: ", this.endSalesData);

                this.endSales(this.endSalesData);


  //***************************** Option Sets **************************************** */
  this.service.loaderhome = true;
  this.projectService.opportunityStatusOptionSet().subscribe(res=>{ // status of opportunity, (won, lost, terminated, suspended, open)
    this.service.loaderhome = false;

    if((res.IsError)== false){
      if(res.ResponseObject !=null && res.ResponseObject.length !=0){
       // console.log("reasonOptionSet: ",res);

       for(var i=0; i<res.ResponseObject.length; i++){
        var obj= {};
           Object.assign(obj, {Value: res.ResponseObject[i].Id});
           Object.assign(obj, {Label: res.ResponseObject[i].Name});
           this.opportunityStatusOptionSet.push(obj);
        }
        console.log("this.opportunityStatusOptionSet: ",this.opportunityStatusOptionSet);
      }
      else{
        this.projectService.displayMessageerror("Unable to get data");

        //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});
      }

    }
  },
  err => {
    this.service.loaderhome = false;
    this.projectService.displayerror(err.status);
    //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});
    }
  )

  this.service.loaderhome = true;
  this.projectService.stateOptionSet().subscribe(res=>{    // state of opp : open , won,lost
    this.service.loaderhome = false;
    if((res.IsError)== false){
      if(res.ResponseObject !=null && res.ResponseObject.length !=0){
        // console.log("reasonOptionSet: ",res);
        for(var i=0; i<res.ResponseObject.length; i++){
          var obj= {};
             Object.assign(obj, {Value: res.ResponseObject[i].Id});
             Object.assign(obj, {Label: res.ResponseObject[i].Name});
             this.stateOptionSet.push(obj);
          }
          console.log("this.stateOptionSet: ",this.stateOptionSet);
      }
      else{
        this.projectService.displayMessageerror("Unable to get data");
        //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});
      }
    }
  },
  err => {
    this.service.loaderhome = false;
    this.projectService.displayerror(err.status);
    //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});
    }
  )

  this.service.loaderhome = true;
  this.projectService.decisionTakenOptionSet().subscribe(res=>{  // decision taken by:  customer, wipro
    this.service.loaderhome = false;
    if((res.IsError)== false){
      if(res.ResponseObject !=null && res.ResponseObject.length !=0){
        // console.log("reasonOptionSet: ",res);


        for(var i=0; i<res.ResponseObject.length; i++){
          var obj= {};
             Object.assign(obj, {Value: res.ResponseObject[i].Id});
             Object.assign(obj, {Label: res.ResponseObject[i].Name});
             this.wiproCustomer.push(obj);
          }
          console.log("this.wiproCustomer: ",this.wiproCustomer);
      }
      else{
        this.projectService.displayMessageerror("Unable to get data");
        //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});
      }
    }
  },
  err => {
    this.service.loaderhome = false;
    this.projectService.displayerror(err.status);
    //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});
    }
  )

  this.service.loaderhome = true;
  this.projectService.informationSourceOptionSet().subscribe(res=>{  // for customer and yes, for filling loss reason in table, last drop down is information source
    this.service.loaderhome = false;
    if((res.IsError)== false){
      if(res.ResponseObject !=null && res.ResponseObject.length !=0){
        // console.log("reasonOptionSet: ",res);
        for(var i=0; i<res.ResponseObject.length; i++){
          var obj= {};
             Object.assign(obj, {Value: res.ResponseObject[i].Id});
             Object.assign(obj, {Label: res.ResponseObject[i].Name});
             this.getInformationSource.push(obj);
          }
          console.log("this.getInformationSource: ",this.getInformationSource);
      }
      else{
        this.projectService.displayMessageerror("Unable to get data");
        //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});
      }
    }
  },
  err => {
    this.service.loaderhome = false;
    this.projectService.displayerror(err.status);
    //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});
    }
  )

  this.service.loaderhome = true;
  this.projectService.reasonValuesOptionSet().subscribe(res=>{  // when wipro is selected, this is the main reasons dropdown
    this.service.loaderhome = false;
    if((res.IsError)== false){
      if(res.ResponseObject !=null && res.ResponseObject.length !=0){
        // console.log("reasonOptionSet: ",res);
        for(var i=0; i<res.ResponseObject.length; i++){
          var obj= {};
             Object.assign(obj, {Value: res.ResponseObject[i].Id});
             Object.assign(obj, {Label: res.ResponseObject[i].Name});
             this.getReasonValue.push(obj);
          }
          console.log("this.getReasonValue: ",this.getReasonValue);
      }
      else{
        this.projectService.displayMessageerror("Unable to get data");
       // this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});
      }
    }
  },
  err => {
    this.service.loaderhome = false;
    this.projectService.displayerror(err.status);
    //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});
    }
  )

  this.service.loaderhome = true;
  this.projectService.stageOptionSet().subscribe(res=>{   // stages of an opp: create, qualify, pursue, secure and close
    this.service.loaderhome = false;
    if((res.IsError)== false){
      if(res.ResponseObject !=null && res.ResponseObject.length !=0){
        console.log("Stage option response: ",res);
        for(var i=0; i<res.ResponseObject.length; i++){
          var obj= {};
             Object.assign(obj, {Value: res.ResponseObject[i].Id});
             Object.assign(obj, {Label: res.ResponseObject[i].Name});
             this.wiproStages.push(obj);
          }
          console.log("this.wiproStages: ",this.wiproStages);
      }
      else{
        this.projectService.displayMessageerror("Unable to get data");
        //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});
      }
    }
  },
  err => {
    this.service.loaderhome = false;
    this.projectService.displayerror(err.status);
    //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});
    }
  )

  this.service.loaderhome = true;
  this.projectService.wiproExcludedStageOptionSet().subscribe(res=>{   //when customer and yes, at what stage wipro excluded frpm further bidding.
    this.service.loaderhome = false;
    if((res.IsError)== false){
      if(res.ResponseObject !=null && res.ResponseObject.length !=0){
        console.log("Stage option response: ",res);
        for(var i=0; i<res.ResponseObject.length; i++){
          var obj= {};
             Object.assign(obj, {Value: res.ResponseObject[i].Id});
             Object.assign(obj, {Label: res.ResponseObject[i].Name});
             this.wiproExcludedArray.push(obj);
          }
          console.log("this.wiproExcluded: ",this.wiproExcludedArray);
      }
      else{
        this.projectService.displayMessageerror("Unable to get data");
        //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});
      }
    }
  },
  err => {
    this.service.loaderhome = false;
    this.projectService.displayerror(err.status);
    //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});
    }
  )

  this.service.loaderhome = true;
  this.projectService.commentTypeOptionSet().subscribe(res=>{  //comment option set: went well, went wrong and ofi.
    this.service.loaderhome = false;
    if((res.IsError)== false){
      if(res.ResponseObject !=null && res.ResponseObject.length !=0){
        // console.log("reasonOptionSet: ",res);\
        for(var i=0; i<res.ResponseObject.length; i++){
          var obj= {};
          Object.assign(obj, {Value: res.ResponseObject[i].Id});
          Object.assign(obj, {Label: res.ResponseObject[i].Name});

          if(  res.ResponseObject[i].Name.toUpperCase()=="WENT WELL"){
            this.wentWellValue=  res.ResponseObject[i].Id;
          }
          if(  res.ResponseObject[i].Name.toUpperCase()=="WENT WRONG"){
            this.wentWrongValue=  res.ResponseObject[i].Id;
          }
          if(  res.ResponseObject[i].Name.toUpperCase()=="OFI"){
            this.ofiValue=  res.ResponseObject[i].Id;
          }
          this.wentWellOptionSet.push(obj);
       }
       console.log("this.wentWellOptionSet: ",this.wentWellOptionSet);
      }
      else{
        this.projectService.displayMessageerror("Unable to get data");
        //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});
      }
    }
  },
  err => {
    this.service.loaderhome = false;
    this.projectService.displayerror(err.status);
    //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});
    }
   )

   this.endSalesCycleOppportunity();  // get api call end sales
}


duplicateId;
//disableReasonDropdown= true;

endSales(endSales){  // data binding function

  debugger;
            //this.disableReasonDropdown = true;
              this.endSalesData = endSales;
              console.log("this.endSalesData inside endSales function: ",this.endSalesData);

              this.decisionTaken = this.endSalesData.DecisionTaken;  // date when decision is taken
              console.log("this.decisionTaken inside endSales function: ",this.decisionTaken);

                this.decisionBy = this.endSalesData.DecisionBy.Name; // wipro, cuatomer
                this.description =this.endSalesData.Description;   // description box data
                this.duplicateId= this.endSalesData.DuplicateOpportunityId;

                this.contactcampaign = this.endSalesData.DuplicateOpportunityName;   // opportunity field name
                console.log("this.contactcampaign : ",this.contactcampaign );
                this.linkedcampaignSwitch = false;
                //  this.opportunityId = this.endSalesData.OpportunityId; // id // come from global variable
              console.log("this.flag1: ", this.flag1);

              if(this.flag1 == 0 ){    // when flag1 is 0, to display all the five rows as data is not present for loss category reasons
                debugger;
                for(var i= 0; i< 5; i++){
                  this.competitorObj= {};
                  // this.lossCategoryId = this.endSalesData.LossReasonDetails[i].LossCategoryValue;
                  // console.log("Loss reason id: ", this.endSalesData.LossReasonDetails[i].LossReasonDetailId);
                  console.log("i: ",i);
                  Object.assign(this.competitorObj, {Id: ""});
                  Object.assign(this.competitorObj, {lossReasonarray: []});
                  Object.assign(this.competitorObj, {reasonId: ""});

                  Object.assign(this.competitorObj, {AdditionalDetails: ""});
                  Object.assign(this.competitorObj, {InformationSource: ""});
                  Object.assign(this.competitorObj, {disableLR: true});

                  this.competitor_data1.push(this.competitorObj);
                }
                  console.log(" this.competitor_data1: ", this.competitor_data1)
              }
            if(this.flag1 == 1){   //  when flag1 is 1, we have data present for loss category reasons and we need to display some the rest of the rows out of 5.
              debugger;
              for(var i=0; i< this.endSalesData.LossReasonDetails.length; i++ ){// for binding the data present in the get api for loss reson details
               // this.disableReasonDropdown = true;
                this.competitorObj= {};
                this.lossCategoryId = this.endSalesData.LossReasonDetails[i].LossCategoryValue;
                console.log("Loss reason id: ", this.endSalesData.LossReasonDetails[i].LossReasonValue);
                console.log("i: ",i);
                Object.assign(this.competitorObj, {Id: this.lossCategoryId});
                Object.assign(this.competitorObj, {lossReasonarray: []});
                Object.assign(this.competitorObj, {reasonId: ""});

                Object.assign(this.competitorObj, {AdditionalDetails: this.endSalesData.LossReasonDetails[i].AdditionalDetails});
                //Object.assign(this.competitorObj, {InformationSource: ""});
                Object.assign(this.competitorObj, {InformationSource: this.endSalesData.LossReasonDetails[i].InformationSource});
                Object.assign(this.competitorObj, {disableLR: true});

                this.competitor_data1.push(this.competitorObj);

                if(this.lossCategoryId){  // if loss category is there, then call the loss reason api
                  debugger;
                    //this.disableReasonDropdown = true;

                   // this.lossReasonMethod(this.lossCategoryId, i, this.competitor_data1[i]);
                   this.lossReasonMethod(this.lossCategoryId, i, this.competitor_data1[i]);

                   // this.competitor_data1.push(this.competitorObj);
                }

              }
              if(this.competitor_data1.length <5){
                for(var i= this.competitor_data1.length; i< 5 ; i++){  // for displaying the remaing rows for which data is not present.
                  this.competitorObj= {};
                  // this.lossCategoryId = this.endSalesData.LossReasonDetails[i].LossCategoryValue;
                  // console.log("Loss reason id: ", this.endSalesData.LossReasonDetails[i].LossReasonDetailId);
                  console.log("i: ",i);
                  Object.assign(this.competitorObj, {Id: ""});
                  Object.assign(this.competitorObj, {lossReasonarray: []});
                  Object.assign(this.competitorObj, {reasonId: ""});

                  Object.assign(this.competitorObj, {AdditionalDetails: ""});
                  Object.assign(this.competitorObj, {InformationSource: ""});
                  Object.assign(this.competitorObj, {disableLR: true});

                  this.competitor_data1.push(this.competitorObj);
                }
              }

            }
              console.log("Competitor data: ",this.competitor_data1);

                //***** Additional Comments */
                this.wentWell1 ="";
                this.wentWell2 ="";
                this.wentWell3 ="";

                var wentWellLength= this.endSalesData.AdditionalComments.WentWell.length;
                if(wentWellLength != 0){  // binding of went well array
                  for(var i=0; i< wentWellLength; i++){
                    if(wentWellLength == 3){
                       this.wentWell1 = this.endSalesData.AdditionalComments.WentWell[i].Comments;
                       this.wentWell2 = this.endSalesData.AdditionalComments.WentWell[i].Comments;
                       this.wentWell3 = this.endSalesData.AdditionalComments.WentWell[i].Comments;
                    }
                    if(wentWellLength == 2){
                      this.wentWell1 = this.endSalesData.AdditionalComments.WentWell[i].Comments;
                       this.wentWell2 = this.endSalesData.AdditionalComments.WentWell[i].Comments;
                    }
                    if(wentWellLength == 1){
                      this.wentWell1 = this.endSalesData.AdditionalComments.WentWell[i].Comments;
                    }
                  }
                  console.log("this.wentWell1: ", this.wentWell1);
                  console.log("this.wentWell1: ", this.wentWell2);
                  console.log("this.wentWell1: ", this.wentWell3);
                }

                this.wentWrong1= "";
                this.wentWrong2= "";
                this.wentWrong3= "";

                var wentWrongLength= this.endSalesData.AdditionalComments.WentWrong.length;
                if(wentWrongLength != 0){   // binding for went wrong array
                  for(var i=0; i< wentWrongLength; i++){
                    if(wentWrongLength == 3){
                       this.wentWrong1 = this.endSalesData.AdditionalComments.WentWrong[i].Comments;
                       this.wentWrong2 = this.endSalesData.AdditionalComments.WentWrong[i].Comments;
                       this.wentWrong3 = this.endSalesData.AdditionalComments.WentWrong[i].Comments;
                    }
                    if(wentWrongLength == 2){
                      this.wentWrong1 = this.endSalesData.AdditionalComments.WentWrong[i].Comments;
                       this.wentWrong2 = this.endSalesData.AdditionalComments.WentWrong[i].Comments;
                    }
                    if(wentWrongLength == 1){
                      this.wentWrong1 = this.endSalesData.AdditionalComments.WentWrong[i].Comments;
                    }
                  }
                  console.log("this.wentWrong: ", this.wentWrong1);
                  console.log("this.wentWrong: ", this.wentWrong2);
                  console.log("this.wentWrong: ", this.wentWrong3);
                }

                this.ofi1="";
                this.ofi2="";
                this.ofi3="";
                var ofiLength= this.endSalesData.AdditionalComments.OFI.length;
                if(ofiLength != 0){ // binding for ofi array
                  for(var i=0; i< ofiLength; i++){
                    if(ofiLength == 3){
                       this.ofi1 = this.endSalesData.AdditionalComments.OFI[i].Comments;
                       this.ofi2 = this.endSalesData.AdditionalComments.OFI[i].Comments;
                       this.ofi3 = this.endSalesData.AdditionalComments.OFI[i].Comments;
                    }
                    if(ofiLength == 2){
                      this.ofi1 = this.endSalesData.AdditionalComments.OFI[i].Comments;
                       this.ofi2 = this.endSalesData.AdditionalComments.OFI[i].Comments;
                    }
                    if(ofiLength == 1){
                      this.ofi1 = this.endSalesData.AdditionalComments.OFI[i].Comments;
                    }
                  }
                    console.log("this.ofi: ", this.ofi1);
                    console.log("this.ofi: ", this.ofi2);
                    console.log("this.ofi: ", this.ofi3);
                }

                //*********** Additional Comments END  */

                if(this.decisionBy.toUpperCase() == "WIPRO"){

                  debugger;
                  var data= true;
                  this.GetEndSalesCycleReason(data);  // reasons drop down for wipro
                //  this.reasonId= this.endSalesData.Reason.SysGuid;
                this.reasonId= this.endSalesData.Reason.Name;  //binding reason
                  this.Getoppertunity(this.reasonId);  // to check if selected reason is duplicate entry, incorporated in another opp
                  this.showradiobtn = false; // for show hide radio buttons yes/no
                  this.wiproExcludedReason=false;
                //  this.nthingSelected=false;
                }

                if(this.decisionBy.toUpperCase() == "CUSTOMER"){
                  this.showradiobtn = true;  // for show hide radio buttons yes/no

                  var data= false;
                  this.GetEndSalesCycleReason(data); // reasons drop down for customer
                  this.opportunityname=false; // for hideshow opportunity fields
                  this.wiproExcludedReason=true;   // when wipro was excluded from further bidding show/hide
                  this.nthingSelected=false;  // yes/no selected flag
                      if(this.endSalesData.AwardedtoAnotherParty.Name.toUpperCase()== "YES"){
                      //  this.reasonId= this.endSalesData.Reason.SysGuid;
                        this.reasonId= this.endSalesData.Reason.Name;
                        this.wiproExcludedReason=true;
                        this.nthingSelected=true;
                        this.showtable = true;  // to display loss reason table, went well table, competitor
                        this.wiproExcludedName= this.endSalesData.Stage.Name;
                       //this.wiproExcludedName= "Last Six";

                        console.log("this.wiproExcludedName in end sales(): ",this.wiproExcludedName);
                        this.losscategory();   // drop down for loss category
                        this.Getoppertunity(this.reasonId); // to check if selected reason is duplicate entry, incorporated in another opp
                      }
                      else{
                        //this.reasonId= this.endSalesData.Reason.SysGuid;
                        this.reasonId= this.endSalesData.Reason.Name;
                        this.wiproExcludedReason=false;
                        this.nthingSelected=false;

                        this.showtable = false;

                        this.Getoppertunity(this.reasonId);
                      }
                }
 }


  wiproExc(value){
    this.wiproExcludedFlag = 0;
    console.log("wipro excluded: ", value);
    for(var i =0; i< this.wiproExcludedArray.length; i++){
      if(value.toUpperCase()== this.wiproExcludedArray[i].Label.toUpperCase() ){
        this.wiproExcludedValue = this.wiproExcludedArray[i].Value;
        console.log("wipro excluded: ", this.wiproExcludedValue);
        break;
      }
    }
  }

  dateSelected(date){
    debugger;
      console.log("Date: ", date);
      this.dateFlag = 0;
  }

losscategory(){
  this.service.loaderhome = true;
  this.projectService.GetLossCategories().subscribe((res) => {  // api call to get loss reason drop down
    this.service.loaderhome = false;
    if((res.IsError)== false){
        if(res.ResponseObject!= null && res.ResponseObject.length!=0){
        this.GetLossCategories = res.ResponseObject;
        console.log("GetLossCategories " ,this.GetLossCategories);

      }
      else{
        if(this.opportunityStatusCheck == 1){
          this.projectService.displayMessageerror("Error. Try after sometime!");
        }
        //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});
      }
    }
      else if((res.IsError)== true) {
        if(this.opportunityStatusCheck == 1){
          this.projectService.displayMessageerror("Error. Try after sometime!");
        }
      }
  },
  err => {
    this.service.loaderhome = false;
    this.projectService.displayerror(err.status);
    //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});
  }
  );
}


lossReason;
  lossReasonMethod(data2,i, item) {   //ṭo get the data for corresponding selected loss category
    debugger;
    console.log("data2: ",data2);
    console.log("i: ", i);
    this.tableFlag = 0;
    this.tableFlagId = 0;
    this.tableFlagIdC=0;
    this.service.loaderhome = true;
   // this.disableLossReason = false;
    item.disableLR = false;
    console.log("Before change",this.competitor_data1[i].reasonId);
    this.competitor_data1[i].reasonId="";
    this.competitor_data1[i].lossReasonarray=[];
    if( this.competitor_data1[i].Id==""|| item.Id==""){
      this.competitor_data1[i].disableLR=true;
      item.disableLR=true;
    }
    
    console.log("lossReasonarray", this.competitor_data1[i].lossReasonarray);
    console.log("After change",this.competitor_data1[i].reasonId);

    var data;
    if(data2.srcElement != undefined){
      item.category = data2.srcElement.selectedOptions[0].innerText;
      data = data2.target.value;
    }
    else{
      data = data2;
    }

    console.log("item: ", item);
 
    this.projectService.lossReason(data).subscribe((res) => {  // api call
      this.service.loaderhome = false;
      debugger;
      this.lossReason = res;
      if((this.lossReason.IsError)== false){
        if(res.ResponseObject!= null && res.ResponseObject.length!=0){

         // this.disableReasonDropdown = false;
         console.log("competitor data: " ,this.endSalesData.LossReasonDetails[i]);

        if(this.endSalesData.LossReasonDetails.length> 0){
          this.competitor_data1[i].reasonId= this.endSalesData.LossReasonDetails[i].LossReasonValue;  // storing the corresponding reason value
        }
        console.log("competitor data: " ,this.endSalesData);
          this.competitor_data1[i].lossReasonarray = this.lossReason.ResponseObject;// storing loss reason object

            console.log("competitor data: " ,this.competitor_data1[i].lossReasonarray);
        }
        else{
            //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});
            if(this.opportunityStatusCheck == 1){
              this.projectService.displayMessageerror("Error. Try after sometime!");
            }
        }
      }
      else if((this.lossReason.IsError)== true) {
        if(item.Id!=""){
          if(this.opportunityStatusCheck == 1){
            this.projectService.displayMessageerror("Error. Try after sometime!");
          }
        }
      }
    },
    err => {
      this.service.loaderhome = false;
      if(this.opportunityStatusCheck == 1){
        this.projectService.displayerror(err.status);
      }
    }
    );
  }

  selectReason( event, data ){
    debugger;
    console.log("event: ", event.srcElement.selectedOptions[0].innerText);
    data.reason = event.srcElement.selectedOptions[0].innerText;
    console.log("Reason: ", data.reason);
    this.tableFlag = 0;
    this.tableFlagReason = 0;
    this.tableFlagReasonC=0;
  }
  enterAdditionalDetails(){
    this.tableFlag =0;
    this.tableFlagAdditionalDetails= 0;
    this.tableFlagAdditionalDetailsC=0;
  }

  enterComments( event , data){
    console.log("event: ", event.srcElement.selectedOptions[0].innerText);
    data.infoSource = event.srcElement.selectedOptions[0].innerText;
    this.tableFlag = 0;
    this.tableFlagComments = 0;
    this.tableFlagCommentsC=0;
    console.log("data: ", data);
  }
  wentWellUpdated(){
    this.wentWellFlag = 0;
  }
  wentWrongUpdated(){
    this.wentWrongFlag=0;
  }

  ofiUpdated(){
    this.OFIFlag= 0;
  }


  GetEndSalesCycleReason(data) {  // reason for wipro/ customer,no
    console.log("data: ", data);
    this.service.loaderhome = true;
    this.projectService.GetEndSalesCycleReason1(data).subscribe((res) => {
      this.service.loaderhome = false;
      debugger;
      if(res.IsError == false){
        if(res.ResponseObject!= null && res.ResponseObject.length!=0){
          this.EndSalesCycleReasonsarray1 = res.ResponseObject;
          console.log("res.ResponseObject.Name",this.EndSalesCycleReasonsarray1);
      }
      else{
        if(this.opportunityStatusCheck == 1){
          this.projectService.displayMessageerror("Error. Try after sometime!");
        }
        ///this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});
      }
    }
    else if((res.IsError)== true) {
        this.projectService.displayMessageerror("Error. Tru after sometime!");
      }
  },
      err => {
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
        //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});

      }
    )
}

  Getoppertunity(data){  // for enabling disabling opportunity field
    debugger;
    // if(data=="5d3c8c4f-3b5c-e911-a830-000d3aa058cb"||data=="f0f2936f-3b5c-e911-a830-000d3aa058cb"|| data=="e461fb76-3b5c-e911-a830-000d3aa058cb"){
      if( data=="Incorporated in another Opportunity"||data=="Duplicate Entry"  || data== "Incorporated in other Opportunity"){
        this.opportunityname=true;
        this.reasonSelected= 1;
      }
      else{
        this.opportunityname=false;
      }
  }

statusName= "";

  errorInGetStatus = 0;
reasonIdFromGetStatus;
  getStatus(reasonName, reasonId ){  // for getting the status of opportunity: list/terminated based on matrix
    let reasonNamedata=reasonName.source?reasonName.source._value:reasonName
    this.reasonFlag = 0;
    this.opportunityFlag = 0;
    this.contactcampaign="";
    this.status = "";
    this.reasonSelected= 0;
   //  var stageValue= 184450000;
   var stageValue = this.currentStage;
   // var reasonValue;
   // var reasonValue= reasonId;
    var guid; // will come from wiproCustomer
    this.errorInGetStatus = 0;

    debugger;
    console.log("Reason: ",reasonName);
     //console.log("Reason: ",reasonName.source._value);

     for(var i =0; i< this.EndSalesCycleReasonsarray1.length; i++){
      //  reasonValue= 184450014;
          if(reasonNamedata.toUpperCase() ==  this.EndSalesCycleReasonsarray1[i].Name.toUpperCase()){  // to get the id for cooresponding selected reason
            this.reasonIdFromGetStatus = this.EndSalesCycleReasonsarray1[i].EndSalesCycleReasonId;
            console.log("this.EndSalesCycleReasonsarray1[i].EndSalesCycleReasonId: ",this.EndSalesCycleReasonsarray1[i].EndSalesCycleReasonId);
            console.log("reasonValue: ", this.reasonIdFromGetStatus);
            break;
          }
      }


    for(var i=0; i< this.wiproCustomer.length; i++){  // to get id for customer/wipro
        if(this.decisionBy.toUpperCase()==  this.wiproCustomer[i].Label.toUpperCase()){
          guid = this.wiproCustomer[i].Value;
          break;
        }
    }

    this.service.loaderhome = true;
    debugger;
    this.projectService.getOpportunityStatus(stageValue, this.reasonIdFromGetStatus, guid).subscribe(res => {  // status api call
      this.service.loaderhome = false;
      debugger;
      if(res.IsError== false){
        if(res.ResponseObject!= null && res.ResponseObject.length!=0){

            this.status = res.ResponseObject[0].OpportunityStatus;   // lost / terminated status
            this.statusName = res.ResponseObject[0].OpportunityStatusFormattedValue;
            console.log("Opportunity Status: " ,res.ResponseObject[0].OpportunityStatus);
            console.log("status: ", this.status);
            this.Getoppertunity(reasonNamedata)
          }
          else{
            this.errorInGetStatus = 1;
            this.projectService.displayMessageerror("No data found for reason");
            this.opportunityname= false;
            //this.snackBar.open("Error!! Try after some time.", this.action, { duration:3000});
          }
      }
      else{
        this.errorInGetStatus = 1;
        this.projectService.displayMessageerror("Error. Try after sometime");
        this.opportunityname= false;
        //this.snackBar.open("Error!! Try after some time.", this.action, { duration:3000});
      }
    },
    err => {
      this.service.loaderhome = false;
      this.projectService.displayerror(err.status);
      this.opportunityname= false;
      //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});

      }
    );

  }


  
  goBack() {
    //window.history.back();
    this.router.navigate(['/opportunity/opportunityview/overview']);
  }


  onemoreradio(event) {  // customer / wipro selected
    console.log(event.value);
    this.whoTookDecisionFlag =0;
    this.reasonFlag = 0;
    this.awardedToAnotherPartyFlag = 0;
    this.wiproExcludedFlag=0;
    this.tableFlag=0;
    this.wentWellFlag = 0;
    this.wentWrongFlag = 0;
    this.OFIFlag = 0;
    this.opportunityFlag= 0;

    if (event.value.toUpperCase() == "CUSTOMER" ) {
       // this.endSalesData.AwardedtoAnotherParty.Name ="No";

       this.data1=false;
      this.showradiobtn = true; // yes/no
      this.opportunityname=false;  // opp field
     this.wiproExcludedReason=true;  // wipro excluded
     this.nthingSelected=false;  // yes /no flag
     this.contactcampaign="";  // opportunity field var
     this.wiproExcludedName="";  // wipro excluded : last six, last two, last four, early elimination
     this.wiproExcludedValue = null;
     this.disableReason = true;

     if(this.endSalesData.AwardedtoAnotherParty.Name.toUpperCase()=="YES"){

      this.disableReason = true;
      this.showtable = true;
      this.wiproExcludedReason= true;
      this.nthingSelected=true;

      this.losscategory();
      this.opportunityname=false;
      this.contactcampaign="";

    }
    else if(this.endSalesData.AwardedtoAnotherParty.Name.toUpperCase()=="NO"){
      this.wiproExcluded = "";
      this.wentWell1="";
      this.wentWell2="";
      this.wentWell3="";
      this.wentWrong1="";
      this.wentWrong2="";
      this.wentWrong3="";
      this.ofi1="";
      this.ofi2="";
      this.ofi3="";
      this.disableReason = false;

      this.wiproExcludedName="";
      this.wiproExcludedValue = null;

      this.competitor_data1= [];
      for(var i= 0 ; i< 5 ; i++){
        this.competitorObj= {};
        console.log("i: ",i);
        Object.assign(this.competitorObj, {Id: ""});
        Object.assign(this.competitorObj, {lossReasonarray: []});
        Object.assign(this.competitorObj, {reasonId: ""});

        Object.assign(this.competitorObj, {AdditionalDetails: ""});
        Object.assign(this.competitorObj, {InformationSource: ""});
        Object.assign(this.competitorObj, {disableLR: true});

        this.competitor_data1.push(this.competitorObj);
      }

      this.disableReason = false;
      this.showtable = false;
      this.wiproExcludedReason= false;
      this.nthingSelected=false;
      //this.reasonId= this.endSalesData.Reason.SysGuid;
      this.reasonId= this.endSalesData.Reason.Name;
      this.wiproExcludedName = this.endSalesData.Stage.Name;
      this.opportunityname=false;
      this.contactcampaign="";
      //this.Getoppertunity(this.reasonId);
     }
    }
    else if (event.value.toUpperCase() == "WIPRO") {
       //  this.endSalesData.AwardedtoAnotherParty.Name ="No";
       this.endSalesData.AwardedtoAnotherParty.Name ="";
      this.contactcampaign="";
      this.wiproExcludedName="";
      this.wiproExcludedValue = null;
      this.nthingSelected=false;

      this.wiproExcluded = "";
      this.wentWell1="";
      this.wentWell2="";
      this.wentWell3="";
      this.wentWrong1="";
      this.wentWrong2="";
      this.wentWrong3="";
      this.ofi1="";
      this.ofi2="";
      this.ofi3="";
    //  this.disableLossReason = true;

      this.competitor_data1= [];
      for(var i= 0 ; i< 5 ; i++){
        this.competitorObj= {};
        console.log("i: ",i);
        Object.assign(this.competitorObj, {Id: ""});
        Object.assign(this.competitorObj, {lossReasonarray: []});
        Object.assign(this.competitorObj, {reasonId: ""});

        Object.assign(this.competitorObj, {AdditionalDetails: ""});
        Object.assign(this.competitorObj, {InformationSource: ""});
        Object.assign(this.competitorObj, {disableLR: true});

        this.competitor_data1.push(this.competitorObj);
      }
      this.disableReason = false;
      this.data1=true;
      this.showradiobtn = false;
      this.showtable = false;//sunita added
      this.reasonId= this.endSalesData.Reason.Name;
      this.wiproExcludedName = this.endSalesData.Stage.Name;
      this.wiproExcludedReason=false;
      this.Getoppertunity(this.reasonId);

    }
    this.GetEndSalesCycleReason(this.data1) //

  }
  secondradio(event) {  // YES/NO RADIO BTN
    this.wiproExcludedFlag=0;
    this.tableFlag=0;
    this.wentWellFlag = 0;
    this.wentWrongFlag = 0;
    this.OFIFlag = 0;
    this.opportunityFlag= 0;
    this.reasonFlag =0;
    //this.enableCompSoleNo=false;

    this.awardedToAnotherPartyFlag = 0;
    if (event.value.toUpperCase() == "YES") {
      //this.enableCompSoleNo=true;
      this.showtable = true;
   //   this.disableLossReason = true;

    this.losscategory();
    //this.getopertunity();
    this.wiproExcludedReason=true;
    this.nthingSelected=true;
    this.opportunityname=false;
    this.disableReason = true;
    this.contactcampaign="";
   // this.wiproExcludedName="Last Six";
    }
    else if(event.value.toUpperCase() == "NO") {
      this.showtable = false;
    //  this.disableLossReason = true;
      this.wiproExcludedReason=false;
      this.nthingSelected=false;
      this.disableReason = false;
      this.contactcampaign="";
      this.wiproExcludedName="";
      this.wiproExcludedValue = null;

      this.wiproExcluded = "";
      this.wentWell1="";
      this.wentWell2="";
      this.wentWell3="";
      this.wentWrong1="";
      this.wentWrong2="";
      this.wentWrong3="";
      this.ofi1="";
      this.ofi2="";
      this.ofi3="";

      this.reasonId= this.endSalesData.Reason.Name;

      this.competitor_data1= [];
      for(var i= 0 ; i< 5 ; i++){
        this.competitorObj= {};
        console.log("i: ",i);
        Object.assign(this.competitorObj, {Id: ""});
        Object.assign(this.competitorObj, {lossReasonarray: []});
        Object.assign(this.competitorObj, {reasonId: ""});

        Object.assign(this.competitorObj, {AdditionalDetails: ""});
        Object.assign(this.competitorObj, {InformationSource: ""});
        Object.assign(this.competitorObj, {disableLR: true});

        this.competitor_data1.push(this.competitorObj);
      }
    }
  }




  /******************Opportunity autocomplete code start ****************** */

  contactcampaign: string;

  linkedcampaignSwitch: boolean= true;
  campaignContact: {}[] = [];
  selectedcampaign= [];

  campaignData;
  campaignId;

  linkedcampaignClose() {
    this.linkedcampaignSwitch = false;
 
    if(this.opportunitySelectedFromLookUp== 0){
      this.contactcampaign=="";
      console.log("this.selectedcampaign: ",this.selectedcampaign);
    }
  }
  opporId;
  appendcampaign(value, i) {
    this.opportunityFlag = 0;
    console.log(value);
    debugger;
    this.selectedcampaign = [];
    if(value.Name== null){
      value.Name = "-";
    }
    this.contactcampaign = value.Name;
    //this.contactcampaign = value.OwnerIdName;
    // this.selectedcampaign.push(this.campaignContact[i]);
    this.opporId = value.OpportunityId
    this.selectedcampaign.push(value);
    this.opportunitySelectedFromLookUp= 1;
  }




   //******************************** */

   //opportunityData;
  getCampaignData(data){  // for opportunity field

    debugger;
    //this.opportunitySelectedFromLookUp= 0;
    this.campaignContact= [  ];
    this.selectedcampaign= [];
   // this.opportunityData = data;

    this.isSearchLoaderForOrder = true;
  
   console.log("data: ", data);
    this.projectService.getCampaign(data,this.accountID,this.opportunityId).subscribe(res => {
      this.isSearchLoaderForOrder= false;

      this.campaignData = res;


      if(this.campaignData.IsError == false){

        if(res.ResponseObject!= null ) { //&& res.ResponseObject.length!=0
            for(var i= 0; i< this.campaignData.ResponseObject.length; i++){

            

                if( this.campaignData.ResponseObject[i].OpportunityId== null || this.campaignData.ResponseObject[i].OpportunityId== "" || this.campaignData.ResponseObject[i].OpportunityId== undefined ){
                  this.campaignData.ResponseObject[i].OpportunityId = "-";
                }

                if( this.campaignData.ResponseObject[i].OwnerIdName== null || this.campaignData.ResponseObject[i].OwnerIdName== "" || this.campaignData.ResponseObject[i].OwnerIdName== undefined ){
                  this.campaignData.ResponseObject[i].OwnerIdName = "-";
                }
                if( this.campaignData.ResponseObject[i].Name== null || this.campaignData.ResponseObject[i].Name== "" || this.campaignData.ResponseObject[i].Name== undefined ){
                  this.campaignData.ResponseObject[i].Name = "-";
                }



                
                this.campaignData.ResponseObject[i].Id =  this.campaignData.ResponseObject[i].OpportunityId;
                this.campaignContact.push(this.campaignData.ResponseObject[i]);
              }


              console.log("campaignContact : " , this.campaignContact);
              }
          }
      },
        err => {
          this.isSearchLoaderForOrder = false;
          this.projectService.displayerror(err.status);
          //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});

      }
    );
  }

  action:any;

  wiproExcluded= "";
  decisionTaken="";
  decisionBy="";
  reasonId= "";
  description= "";
 //opportunityId= "";

  lossReasonId;
  lossCategoryId='';
  additionalDetailId="";
  additionalDetailsComments="";

wentWell1="";
wentWell2="";
wentWell3="";
wentWrong1="";
wentWrong2="";
wentWrong3="";
ofi1="";
ofi2="";
ofi3="";

lossCategory;
endSalesData;
endSalesOpportunity;

competitor_data1= [];
competitorObj;

minDate;
maxDate = new Date();

  endSalesCycleOppportunity(){ // end sales get api funtion
    debugger
    this.minDate= this.creationDate;
    console.log("maxdate: ", this.maxDate);
    console.log("mindate: ", this.minDate);



    console.log("End sales cycle");
      this.service.loaderhome = true;
     this.projectService.getEndSalesOpportuity(this.opportunityId).subscribe(res => { // get api call
        this.service.loaderhome = false;

          if(res.ResponseObject!= null && res.ResponseObject.length!=0){
          this.endSalesOpportunity = res;
          console.log("end sales oppor: ", this.endSalesOpportunity);

          if(this.endSalesOpportunity.IsError == false){

            this.endSalesOpportunity.ResponseObject[0].Id= this.endSalesOpportunity.ResponseObject[0].duplicateId; // opportunity field when reson is selected as duplicate entry or incorporated in another opportunity.
                this.endSalesData = this.endSalesOpportunity.ResponseObject[0];  // storing the response obj
                console.log("this.endSalesData: ", this.endSalesData);

                this.flag1 = 1;   // when data is coming from get api
                this.endSales(this.endSalesData); // function to evalute the data and bind it to the repective elements

          }
          else{
            this.projectService.displayMessageerror("Error. Try after sometime");
            //this.snackBar.open("Error!! Try after sometime.", this.action, { duration:3000});
          }
        }
        else{
          // this.projectService.displayMessageerror("Error. Try after sometime.");
          this.flag1=0;
          this.endSales(this.endSalesData);
          //this.snackBar.open("Error!! Try after sometime.", this.action, { duration:3000});
          }
        },
        err => {
            this.service.loaderhome = false;
            this.projectService.displayerror(err.status);
            //this.snackBar.open("Error!! Try after sometime.", this.action, { duration:3000 });
        }
    );
  }


dateFlag=0;
whoTookDecisionFlag = 0;
awardedToAnotherPartyFlag=0;
reasonFlag = 0;
opportunityFlag=0;
tableFlag = 0;
tableFlagId = 0;
tableFlagReason = 0;
tableFlagAdditionalDetails = 0;
tableFlagComments = 0;
checkNonTableflag=0;
indexHigh=0;
tableFlagC = 0;
tableFlagIdC = 0;
tableFlagReasonC = 0;
tableFlagAdditionalDetailsC = 0;
tableFlagCommentsC = 0;
wentWellFlag =0;
wentWrongFlag = 0;
OFIFlag =0;
wiproExcludedFlag= 0;
compSuccess;
breakCheck= 0;
flagAddComments=0;

winLossArray=[];

  onSubmit() {
    this.runCompetitor= 0;
    this.dateFlag=0;
    this.whoTookDecisionFlag = 0;
    this.reasonFlag = 0;
    this.checkNonTableflag=0;
    this.tableFlag= 0;
    this.tableFlagId = 0;
    this.tableFlagReason = 0;
    this.tableFlagAdditionalDetails = 0;
    this.tableFlagComments = 0;

    this.tableFlagC = 0;
    this.tableFlagIdC = 0;
    this.tableFlagReasonC = 0;
    this.tableFlagAdditionalDetailsC = 0;
    this.tableFlagCommentsC = 0;

    this.wentWellFlag =0;
    this.wentWrongFlag = 0;
    this.OFIFlag =0;
    this.wiproExcludedFlag = 0;
    this.compSuccess=true;

    var decisionByBoolean= false;
    var awardedToAnotherParty = false;
    var duplicateId= this.duplicateId;
    var additonalDetails;
    var description;
    var reasonId;

    var lossCategoryIdInSave;
    var lossReasonIdInSave;
    var informationSource;
    var additionalDetails= [];
    var obj;

    if( this.decisionTaken == null || this.decisionTaken == undefined || this.decisionTaken=="" ){
     // this.projectService.displayMessageerror(" Select the date");
      this.dateFlag=1;
    }
    if( this.decisionBy== null || this.decisionBy== undefined  || this.decisionBy== "" ){
     // this.projectService.displayMessageerror("Select who took the decision");
     this.whoTookDecisionFlag = 1;
    }
  //  else{

    debugger;

    console.log(this.endSalesData.Reason.Name);
    console.log(this.decisionTaken);
    console.log("Contact camppaign value in save: ",this.contactcampaign);

    if(this.decisionBy.toUpperCase()=="WIPRO"){
      this.awardedToAnotherPartyFlag =0;
      this.reasonFlag =0;
      this.opportunityFlag =0;
      this.dateFlag = 0;
      this.whoTookDecisionFlag = 0;


      decisionByBoolean= true;
      awardedToAnotherParty= null;
      lossCategoryIdInSave= null;
      lossReasonIdInSave= null;
      informationSource= null;
      additonalDetails= null;

      this.wentWell1= null;
      this.wentWell2= null;
      this.wentWell3= null;
      this.wentWrong1= null;
      this.wentWrong2= null;
      this.wentWrong3= null;
      this.ofi1= null;
      this.ofi2= null;
      this.ofi3= null;

      var tableIdFlag=0;
      var tableReasonFlag= 0;
      var tableAdditionalDetailsFlag =0;
      var tableCommentsFlag = 0;

      var lossCategoryArray=[];

      debugger;

      for(var i=0; i< this.endSalesData.LossReasonDetails.length; i++ ){
        lossCategoryObj={};

        lossCategoryIdInSave= null;
        lossReasonIdInSave=null;
        additonalDetails= null;
        informationSource = null;

      Object.assign(lossCategoryObj, {LossCategoryId: lossCategoryIdInSave});
      Object.assign(lossCategoryObj, {LossReason: lossReasonIdInSave});
      Object.assign(lossCategoryObj, {AdditionalDetails: additonalDetails});
      Object.assign(lossCategoryObj, {InformationSource: informationSource});

      console.log("lossCategoryObj: ", lossCategoryObj);
      console.log("lossCategoryArray: ", lossCategoryArray);


     // obj.EndSalesCycleLossReasons.push(lossCategoryObj);
      console.log("lossCategoryArray: ", lossCategoryArray);
      lossCategoryArray.push(lossCategoryObj);

     }

      // if(this.status==184450000 ) {
      //   duplicateId = "";
      // }
      if(this.reasonSelected == 1){
        if(this.selectedcampaign.length!=0){
            duplicateId = this.selectedcampaign[0].OpportunityId;
        }
        else{
          duplicateId = null;
        }
     }
     else{
        if((this.duplicateId!= undefined || this.duplicateId != null) && this.duplicateId == "00000000-0000-0000-0000-000000000000" ){
          duplicateId = this.duplicateId;
        }
     }

      if(this.description=="" || this.description==undefined){
        description= null;
      }
      else{
        description= this.description;
      }

      if(this.reasonId=="" || this.reasonId==undefined){
        reasonId= null;
      }else{
        reasonId= this.reasonIdFromGetStatus;
      }

      if(this.wiproExcludedValue == "" || this.wiproExcludedValue== undefined){
        this.wiproExcludedValue = null;
      }

      if(reasonId == null || reasonId== "" || reasonId == undefined) {
        //this.projectService.displayMessageerror(" Select the reason");
          this.reasonFlag= 1;
      }
      if( this.decisionTaken == null || this.decisionTaken == undefined || this.decisionTaken=="" ){
        this.dateFlag = 1;
       // this.projectService.displayMessageerror(" Select the date");
      }
      if( decisionByBoolean== null || decisionByBoolean== undefined  ){
        this.whoTookDecisionFlag = 1;
      //  this.projectService.displayMessageerror("Select who took the decision");
      }
      if( this.reasonSelected == 1  && (duplicateId== "" || duplicateId== undefined || duplicateId== null )){
        // this.projectService.displayMessageerror("Select the opportunity");
        this.opportunityFlag = 1;
       }
      if( this.reasonSelected == 1 && ( this.contactcampaign == "" || this.contactcampaign == undefined || this.contactcampaign == null ) && (duplicateId== "" || duplicateId== undefined || duplicateId== null )){
       // this.projectService.displayMessageerror("Select the opportunity");
       this.opportunityFlag = 1;
      }
      debugger;
      obj= {
        "Reason": reasonId,
        "DecisionBy": decisionByBoolean,
        "DecisionTakentoEndSalesCycle": this.datePipe.transform(this.decisionTaken, 'yyyy-MM-ddTHH:mm:ss Z'),//this.decisionTaken,
        "Name":"Opp End Sales cycle",  //////static only
         "OpportunityId": this.opportunityId,  // the selected opportunity value
         "DuplicateOppId": duplicateId,  //optional
         "AwardedToAnotherParty": awardedToAnotherParty, //this.endSalesData.AwardedtoAnotherParty.Name
         "Description":  description,
         "Stage": this.wiproExcludedValue

      };


      //else{

      if(this.reasonFlag == 0 && this.dateFlag==0 && this.whoTookDecisionFlag ==0 && this.opportunityFlag ==0){
        this.saveOthers(obj);
      }

      //}
    }


    if(this.decisionBy.toUpperCase()=="CUSTOMER"){
      decisionByBoolean= false;

      this.awardedToAnotherPartyFlag =0;
      this.reasonFlag =0;
      this.opportunityFlag =0;
      this.dateFlag = 0;
      this.whoTookDecisionFlag = 0;
      this.wiproExcludedFlag = 0;

      if(this.reasonId=="" || this.reasonId==undefined){
        reasonId= null;
      }else{
        reasonId= this.reasonIdFromGetStatus;
      }
    debugger;
      if(reasonId == null || reasonId== "" || reasonId == undefined) {
        //this.projectService.displayMessageerror(" Select the reason");
        this.reasonFlag= 1;
      }
      if( this.endSalesData.AwardedtoAnotherParty.Name == null || this.endSalesData.AwardedtoAnotherParty.Name== undefined || this.endSalesData.AwardedtoAnotherParty.Name== "" ){
        //this.projectService.displayMessageerror("Select if the opportunity is awarded to another party");
        this.awardedToAnotherPartyFlag = 1;
       // this.reasonFlag= 1;
      }
      if( this.decisionTaken == null || this.decisionTaken == undefined || this.decisionTaken=="" ){
        this.dateFlag = 1;
       // this.projectService.displayMessageerror(" Select the date");
      }

     // else{
      if(this.endSalesData.AwardedtoAnotherParty.Name.toUpperCase()=="NO"){
        awardedToAnotherParty= false;
        this.opportunityFlag =0;
        this.wiproExcludedFlag=0;
        this.tableFlag=0;
        this.tableFlagId = 0;
        this.tableFlagReason = 0;
        this.tableFlagAdditionalDetails = 0;
        this.tableFlagComments = 0;

        this.wentWellFlag = 0;
        this.wentWrongFlag = 0;
        this.OFIFlag = 0;

        this.wentWell1= null;
        this.wentWell2= null;
        this.wentWell3= null;
        this.wentWrong1= null;
        this.wentWrong2= null;
        this.wentWrong3= null;
        this.ofi1= null;
        this.ofi2= null;
        this.ofi3= null;

        var lossCategoryArray=[];

        if(this.reasonId=="" || this.reasonId==undefined){
          reasonId= null;
        }else{
          reasonId= this.reasonIdFromGetStatus;
        }

        if(this.reasonSelected == 1){
          if(this.selectedcampaign.length!=0){
            duplicateId = this.selectedcampaign[0].OpportunityId;
          }
         else{
            duplicateId = null;
          }
         }
         else{
            if((this.duplicateId!= undefined || this.duplicateId != null) && this.duplicateId == "00000000-0000-0000-0000-000000000000" ){
              duplicateId = this.duplicateId;
            }
            else{
              duplicateId = null;
            }
         }

        if(this.description=="" || this.description==undefined){
          description= null;
        }
        else{
          description= this.description;
        }

        if(this.wiproExcludedValue == "" || this.wiproExcludedValue== undefined){
          this.wiproExcludedValue = null;
        }

        // validations for customer and no  *********************

        if(reasonId == null || reasonId== "" || reasonId == undefined) {
            //this.projectService.displayMessageerror(" Select the reason");
            this.reasonFlag= 1;
          }
          if( this.decisionTaken == null || this.decisionTaken == undefined || this.decisionTaken=="" ){
            this.dateFlag = 1;
           // this.projectService.displayMessageerror(" Select the date");
          }
          if( awardedToAnotherParty == null || awardedToAnotherParty == undefined ){
            this.awardedToAnotherPartyFlag = 1;
           // this.projectService.displayMessageerror(" Select if opportunity will be awatded to another party");
          }
           if( decisionByBoolean== null || decisionByBoolean== undefined  ){
            this.whoTookDecisionFlag = 1;
            //this.projectService.displayMessageerror("Select who took the decision");
          }
          if( this.reasonSelected == 1 && ( duplicateId== "" || duplicateId== undefined || duplicateId== null ) ){
            this.opportunityFlag = 1;
          //   //this.projectService.displayMessageerror("Select the opportunity");
          }
          if( this.reasonSelected == 1 && ( this.contactcampaign == "" || this.contactcampaign == undefined || this.contactcampaign == null ) && (duplicateId== "" || duplicateId== undefined || duplicateId== null )){
            this.opportunityFlag = 1;
            //this.projectService.displayMessageerror("Select the opportunity");
          }

           // validations for customer and no  END  *********************

          obj= {
            "Reason": reasonId,
            "DecisionBy": decisionByBoolean,
            "DecisionTakentoEndSalesCycle": this.datePipe.transform(this.decisionTaken, 'yyyy-MM-ddTHH:mm:ss Z'),//this.decisionTaken,
            "Name":"Opp End Sales cycle",  //////static only
             "OpportunityId": this.opportunityId,  // the selected opportunity value
             "DuplicateOppId": duplicateId,  //optional
             "AwardedToAnotherParty": awardedToAnotherParty, //this.endSalesData.AwardedtoAnotherParty.Name
             "Description":  description,
            //  "Stage": this.currentStage
              "Stage": this.wiproExcludedValue

          };

          if( this.reasonFlag == 0 && this.dateFlag==0 && this.whoTookDecisionFlag ==0 && this.opportunityFlag ==0 && this.awardedToAnotherPartyFlag == 0 ){
            this.saveOthers(obj);
          }
      }

      else if(this.endSalesData.AwardedtoAnotherParty.Name.toUpperCase()=="YES"){
        awardedToAnotherParty= true;
        this.statusName = "Lost";
         duplicateId= null;
         description= null;
         reasonId= null;
         this.runCompetitor= 1;
         this.reasonFlag =0;
         this.compSuccess=true;
         this.checkNonTableflag=0;
         tableIdFlag = 0;
         tableReasonFlag = 0;
         tableAdditionalDetailsFlag = 0;
         tableCommentsFlag = 0;
         this.indexHigh=0;
         this.tableFlagC = 0;
         this.tableFlagIdC = 0;
         this.tableFlagReasonC = 0;
         this.tableFlagAdditionalDetailsC = 0;
         this.tableFlagCommentsC = 0;
         this.validClicked=false;
         this.breakCheck= 0;
         this.flagAddComments=0;
         this.winLossArray= [];
        // var winLossArray=[];
         //winLossArray = JSON.parse(JSON.stringify(this.competitor_data1));

        debugger;



        if (this.runCompetitor == 1) {
            this.validClicked=true;
            console.log("Valid Clicked ESC", this.validClicked);
            this.countComp = this.countComp + 1;
            this.parentSubject.next(this.countComp);
        }
        console.log("this.competitor_data1 : ",this.competitor_data1);
        console.log("winLossArray : ", this.winLossArray);

        
        for(var i=0; i<this.competitor_data1.length; i++ ){
          if(this.competitor_data1[i].AdditionalDetails.length > 0 && this.competitor_data1[i].AdditionalDetails.length < 10){
            //this.competitor_data1[i].AdditionalDetails="";
            this.flagAddComments=1;
          }
        }
        if(this.flagAddComments==1){
          this.snackBar.open("Additional details should be more than 10 characters", this.action, { duration: 5000});
        }

        debugger;
         for(var i=0; i<1; i++ ){
          if(  ( this.competitor_data1[i].Id== "" || this.competitor_data1[i].Id==undefined ) && ( this.competitor_data1[i].reasonId== "" || this.competitor_data1[i].reasonId==undefined ) &&  ( this.competitor_data1[i].AdditionalDetails=="" || this.competitor_data1[i].AdditionalDetails==undefined ) && ( this.competitor_data1[i].InformationSource=="" || this.competitor_data1[i].InformationSource==undefined ) ){
           // this.projectService.displayMessageerror("Mandatory to fill first row of loss reason details");
           this.tableFlag = 1;
          }

          if( this.competitor_data1[i].Id== "" || this.competitor_data1[i].Id==undefined  ){
            // this.projectService.displayMessageerror("Mandatory to fill first row of loss reason details");
            this.tableFlagId = 1;
           }
           else{
             tableIdFlag = 1;

           }
           if( this.competitor_data1[i].reasonId== "" || this.competitor_data1[i].reasonId==undefined ){
            // this.projectService.displayMessageerror("Mandatory to fill first row of loss reason details");
            this.tableFlagReason = 1;
           }
           else{
              tableReasonFlag = 1;
           }
           if( this.competitor_data1[i].AdditionalDetails=="" || this.competitor_data1[i].AdditionalDetails==undefined  ){
            // this.projectService.displayMessageerror("Mandatory to fill first row of loss reason details");
            this.tableFlagAdditionalDetails = 1;
           }
           else{
             tableAdditionalDetailsFlag = 1;
           }
           if( this.competitor_data1[i].InformationSource=="" || this.competitor_data1[i].InformationSource==undefined ){
            // this.projectService.displayMessageerror("Mandatory to fill first row of loss reason details");
            this.tableFlagComments = 1;
           }
           else{
               tableCommentsFlag = 1;
           }
          }
        
        if(this.tableFlagReason==1 || this.tableFlagId==1 || this.tableFlagAdditionalDetails==1 ||this.tableFlagComments==1){
          this.tableFlag=1;
        }

        for(var i =1; i<this.competitor_data1.length; i++ ){
          if(this.competitor_data1[i].Id != ""){
            if(this.competitor_data1[i].reasonId== ""){
              this.tableFlagReasonC=1;
            }
            if(this.competitor_data1[i].AdditionalDetails==""){
              this.tableFlagAdditionalDetailsC = 1;
            }
            if(this.competitor_data1[i].InformationSource==""){
              this.tableFlagCommentsC = 1;
            }
            this.indexHigh=i;
          }

          else if(this.competitor_data1[i].reasonId != ""){
            if(this.competitor_data1[i].Id== ""){
              this.tableFlagIdC=1;
            }
            if(this.competitor_data1[i].AdditionalDetails==""){
              this.tableFlagAdditionalDetailsC = 1;
            }
            if(this.competitor_data1[i].InformationSource==""){
              this.tableFlagCommentsC = 1;
            }
            this.indexHigh=i;
          }

          else if(this.competitor_data1[i].AdditionalDetails != ""){
            if(this.competitor_data1[i].Id== ""){
              this.tableFlagIdC=1;
            }
            if(this.competitor_data1[i].reasonId==""){
              this.tableFlagReasonC = 1;
            }
            if(this.competitor_data1[i].InformationSource==""){
              this.tableFlagCommentsC = 1;
            }
            this.indexHigh=i;
          }

          else if(this.competitor_data1[i].InformationSource != ""){
            if(this.competitor_data1[i].Id== ""){
              this.tableFlagIdC=1;
            }
            if(this.competitor_data1[i].reasonId==""){
              this.tableFlagReasonC = 1;
            }
            if(this.competitor_data1[i].AdditionalDetails==""){
              this.tableFlagAdditionalDetailsC = 1;
            }
            this.indexHigh=i;
          }
        }

        if(this.tableFlagReasonC==1 || this.tableFlagIdC==1 || this.tableFlagAdditionalDetailsC==1 ||this.tableFlagCommentsC==1){
          this.checkNonTableflag=1;
        }

        for(var i=0; i<this.competitor_data1.length; i++ ){
          if( this.competitor_data1[i].Id== "" || this.competitor_data1[i].Id==undefined  ){
            console.log("winLossArray: ", this.winLossArray);
          }
          else{
             this.winLossArray.push(JSON.parse(JSON.stringify(this.competitor_data1[i])) );
             console.log("winloss array: ", this.winLossArray);
          }
        }

        console.log("comp : ", this.competitor_data1);
        console.log("winLossArray : ", this.winLossArray);
        for(var i =0; i< this.winLossArray.length; i++){
              delete this.winLossArray[i].disableLR;
              delete this.winLossArray[i].lossReasonarray;

             console.log("comp : ", this.competitor_data1);
        console.log("winLossArray : ", this.winLossArray);
          }

        console.log("winLossArray : ", this.winLossArray);
         for(var i =0; i< this.opportunityStatusOptionSet.length; i++){
            if(this.opportunityStatusOptionSet[i].Label.toUpperCase()== "LOST"){
              this.status = this.opportunityStatusOptionSet[i].Value;
              console.log("this. status: ", this.status);
            }
          }

         var lossCategoryArray=[];
          var lossCategoryObj;

        if (this.winLossArray.length > 1) {
          for (var i = 0; i < this.winLossArray.length - 1; i++) {

            for (var j = i + 1; j < this.winLossArray.length; j++) {

              if (JSON.stringify(this.winLossArray[i].category) === JSON.stringify(this.winLossArray[j].category) && JSON.stringify(this.winLossArray[i].reason) === JSON.stringify(this.winLossArray[j].reason) ) {
                //this.projectService.displayMessageerror(this.winLossArray[i].category + " combination already exists for Loss Category. Duplicate entries are not allowed. Please select different combination.");
                this.snackBar.open(this.winLossArray[i].category+", "+this.winLossArray[i].reason+ " combination already exists for Loss Category and Loss Reason. Duplicate entries are not allowed. Please select different combination.", this.action, { duration:7000});
                this.breakCheck = 1;
                break;
              }
            }
              if (this.breakCheck == 1) {
                break;
              }
            }
          }

          

           if( this.decisionTaken == null || this.decisionTaken == undefined || this.decisionTaken=="" ){
             this.dateFlag = 1;
            //this.projectService.displayMessageerror(" Select the date");
            }
            if( decisionByBoolean== null || decisionByBoolean== undefined  ){
            //  this.projectService.displayMessageerror("Select who took the decision");
             this.whoTookDecisionFlag = 1;
            }

            if( awardedToAnotherParty == null || awardedToAnotherParty == undefined ){
             //this.projectService.displayMessageerror(" Select if opportunity will be awatded to another party");
             this.awardedToAnotherPartyFlag = 1;
            }
            if (this.wiproExcludedName== "" || this.wiproExcludedName== undefined || this.wiproExcludedName== null){
              this.wiproExcludedFlag = 1;
            }


            if( tableIdFlag == 1 &&  tableReasonFlag==1  && tableAdditionalDetailsFlag == 1 && tableCommentsFlag ==1){
              this.tableFlagId = 0;
              this.tableFlagReason = 0;
              this.tableFlagAdditionalDetails = 0;
              this.tableFlagComments = 0;
              this.tableFlag = 0;
            }
            console.log("this.competitor_data1: ", this.competitor_data1);

            if( (this.wentWell1 == "" || this.wentWell1 ==null) && (this.wentWell2 == "" || this.wentWell2 ==null) && (this.wentWell3 == "" || this.wentWell3 ==null) ){
             // this.projectService.displayMessageerror("Mandatory to fill what went well");
              this.wentWellFlag = 1;
             }
              if( (this.wentWrong1 == "" || this.wentWrong1 == null) && (this.wentWrong2 == "" || this.wentWrong2 == null) && (this.wentWrong3 == "" || this.wentWrong3 == null) ){
              //this.projectService.displayMessageerror("Mandatory to fill what did not go well");
              this.wentWrongFlag = 1;
             }
                if( (this.ofi1 == "" || this.ofi1 == null) && (this.ofi2 == "" || this.ofi2 == null) && (this.ofi3 == "" || this.ofi3 == null) ){
             // this.projectService.displayMessageerror("Mandatory to suggest opportunity for improvement (OFIs) based on the learnings");
              this.OFIFlag = 1;
             }
            //  this.competitor_data1.length >0

          //  else{
           if(this.OFIFlag ==0 && this.wentWrongFlag ==0 && this.wentWellFlag ==0 && this.tableFlag==0 && this.awardedToAnotherPartyFlag ==0 && this.wiproExcludedFlag == 0 && this.whoTookDecisionFlag==0 && this.dateFlag ==0 && this.flagAddComments==0 && this.breakCheck==0 && this.checkNonTableflag==0){
                debugger;
              for(var i=0; i< this.competitor_data1.length; i++ ){
                debugger;
                lossCategoryObj={};

            if(this.competitor_data1[i].Id== "" || this.competitor_data1[i].Id==undefined){
              lossCategoryIdInSave=null;
            }
            else{
              lossCategoryIdInSave= this.competitor_data1[i].Id;
            }

            if(this.competitor_data1[i].reasonId== "" || this.competitor_data1[i].reasonId==undefined){
              lossReasonIdInSave=null;
            }
            else{
              lossReasonIdInSave= this.competitor_data1[i].reasonId;
            }

            if(this.competitor_data1[i].AdditionalDetails=="" || this.competitor_data1[i].AdditionalDetails==undefined){
              additonalDetails= null;
            }
            else{
              additonalDetails = this.competitor_data1[i].AdditionalDetails;
            }

            if(this.competitor_data1[i].InformationSource=="" || this.competitor_data1[i].InformationSource==undefined){
              informationSource=null;
            }
            else{
              informationSource = this.competitor_data1[i].InformationSource;
            }

            Object.assign(lossCategoryObj, {LossCategoryId: lossCategoryIdInSave});
            Object.assign(lossCategoryObj, {LossReason: lossReasonIdInSave});
            Object.assign(lossCategoryObj, {AdditionalDetails: additonalDetails});
            Object.assign(lossCategoryObj, {InformationSource: informationSource});

            debugger;
            if(lossCategoryObj.LossCategoryId== null){
              continue;
            }
            lossCategoryArray.push(lossCategoryObj);
           }

           console.log("obj.EndSalesCycleLossReasons: ",lossCategoryArray);

           var additionalCommentsArray= [];
           var additionalComments= {};

          if(this.wentWell1 != "" && this.wentWell1 !=null){
            debugger;
             additionalComments= {};
              Object.assign(additionalComments, {AdditionalCommentName: "End Sales Cycle Addition Details" });
              Object.assign(additionalComments, {AdditionalCommentType: this.wentWellValue });
              Object.assign(additionalComments, {AdditionalComments: this.wentWell1});
              additionalCommentsArray.push(additionalComments);
          }

          if(this.wentWell2 != "" && this.wentWell2 != null){
            additionalComments= {};
             Object.assign(additionalComments, {AdditionalCommentName: "End Sales Cycle Addition Details" });
             Object.assign(additionalComments, {AdditionalCommentType: this.wentWellValue });
             Object.assign(additionalComments, {AdditionalComments: this.wentWell2});
             additionalCommentsArray.push(additionalComments);
          }
          if(this.wentWell3 != "" && this.wentWell3 != null){
            additionalComments= {};
            Object.assign(additionalComments, {AdditionalCommentName: "End Sales Cycle Addition Details" });
            Object.assign(additionalComments, {AdditionalCommentType: this.wentWellValue });
            Object.assign(additionalComments, {AdditionalComments: this.wentWell3});
            additionalCommentsArray.push(additionalComments);
          }
         if(this.wentWrong1 != "" && this.wentWrong1 != null){
            additionalComments= {};
            Object.assign(additionalComments, {AdditionalCommentName: "End Sales Cycle Addition Details" });
            Object.assign(additionalComments, {AdditionalCommentType: this.wentWrongValue });
            Object.assign(additionalComments, {AdditionalComments: this.wentWrong1});
            additionalCommentsArray.push(additionalComments);
            }
          if(this.wentWrong2 != "" && this.wentWrong2 != null){
            additionalComments= {};
            Object.assign(additionalComments, {AdditionalCommentName: "End Sales Cycle Addition Details" });
            Object.assign(additionalComments, {AdditionalCommentType: this.wentWrongValue });
            Object.assign(additionalComments, {AdditionalComments: this.wentWrong2});
            additionalCommentsArray.push(additionalComments);
          }
          if(this.wentWrong3 != "" && this.wentWrong3 != null){
            additionalComments= {};
            Object.assign(additionalComments, {AdditionalCommentName: "End Sales Cycle Addition Details" });
            Object.assign(additionalComments, {AdditionalCommentType: this.wentWrongValue });
            Object.assign(additionalComments, {AdditionalComments: this.wentWrong3});
            additionalCommentsArray.push(additionalComments);
          }
          if(this.ofi1 != "" && this.ofi1 != null){
            additionalComments= {};
            Object.assign(additionalComments, {AdditionalCommentName: "End Sales Cycle Addition Details" });
            Object.assign(additionalComments, {AdditionalCommentType: this.ofiValue });
            Object.assign(additionalComments, {AdditionalComments: this.ofi1});
            additionalCommentsArray.push(additionalComments);
            }
            if(this.ofi2 != "" && this.ofi2 !=null){
              additionalComments= {};
              Object.assign(additionalComments, {AdditionalCommentName: "End Sales Cycle Addition Details" });
              Object.assign(additionalComments, {AdditionalCommentType:  this.ofiValue });
              Object.assign(additionalComments, {AdditionalComments: this.ofi2});
              additionalCommentsArray.push(additionalComments);
            }
            if(this.ofi3 != "" && this.ofi3 !=null){
              additionalComments= {};
              Object.assign(additionalComments, {AdditionalCommentName: "End Sales Cycle Addition Details" });
              Object.assign(additionalComments, {AdditionalCommentType:  this.ofiValue });
              Object.assign(additionalComments, {AdditionalComments: this.ofi3});
              additionalCommentsArray.push(additionalComments);
            }

            console.log("additionalCommentsArray: ",additionalCommentsArray);


            obj= {
              "Reason": reasonId,
              "DecisionBy": decisionByBoolean,
              "DecisionTakentoEndSalesCycle": this.datePipe.transform(this.decisionTaken, 'yyyy-MM-ddTHH:mm:ss Z'),//this.decisionTaken,
              "Name":"Opp End Sales cycle",  //////static only
              "OpportunityId": this.opportunityId,  // the selected opportunity value
              "DuplicateOppId": duplicateId,  //optional
              "AwardedToAnotherParty": awardedToAnotherParty, //this.endSalesData.AwardedtoAnotherParty.Name
              "Description":  description,
              //  "Stage": this.currentStage,
                "Stage": this.wiproExcludedValue,
              "EndSalesCycleAdditionalComments": additionalCommentsArray ,
              "EndSalesCycleLossReasons": lossCategoryArray
            };
            debugger;
            if(this.compSuccess){
              this.save(obj);
            }
            console.log("Comp Success : ", this.compSuccess);
             
            //this.save(obj);
          }
          else{
            console.log("this.competitor_data1: ", this.competitor_data1);
         
          }
       }
     }
}

checkValidComp(validCompFlag){
  this.compSuccess=validCompFlag;
}


saveCompDone;
public getData(checkUselessFlag:boolean){   //to enable competitor validations before end sales cycle save.
this.saveCompDone=checkUselessFlag;
  this.service.loaderhome = true;
  this.projectService.createEndSalesRecord(this.saveObj).subscribe(res => { // SAVE API CALLED
      this.service.loaderhome = false;
      debugger;
      if(res.IsError == false){
         if(res.ResponseObject != null ){
          if(res.ResponseObject == true){
              this.snackBar.open("This opportunity will be considered as "+this.statusName+"." , this.action, { duration:7000 });
              console.log("Data saved successfully");
              this.disableFields= true;
              console.log("status: ", this.status);
              this.projectService.setSession('opportunityStatus', this.status);
             //this.projectService.setSession('opportunityStatus', this.status);
              //if(this.runCompetitor ==1){
                //   this.saveClicked = true;
              //}

          this.service.loaderhome = true;
          this.projectService.updateLossOpportunity(this.status, this.opportunityId).subscribe(response => {
               this.service.loaderhome = false;

                 if(response.IsError == false){
                  if(response.ResponseObject == true ) {
                    console.log(response);
                   }
                   else{
                     if(this.opportunityStatusCheck == 1){
                      this.projectService.displayMessageerror("Error. Try saving after sometime!");
                     }
                      //this.snackBar.open("Error in saving data. Try after sometime!!", this.action, { duration:3000 });
                    }
                  }
                  else{
                     if(this.opportunityStatusCheck == 1){
                      this.projectService.displayMessageerror("Error. Try saving after sometime!");
                     }
                    //this.snackBar.open("Error in saving data. Try after sometime!!", this.action, { duration:3000 });
                  }
              },
              err => {
                    this.service.loaderhome = false;
                    this.projectService.displayerror(err.status);
                    //this.snackBar.open("Error in saving data. Try after sometime!!", this.action, { duration:3000 });
                      }
                );

                this.service.loaderhome = true;
                this.projectService.updateOpporStatus(this.opportunityId).subscribe(response => {
                    this.service.loaderhome = false;
                        if(response.IsError == false){
                         // if(response.ResponseObject == true ){
                            if(response.ResponseObject ){
                              console.log(response);
                              console.log(response.ResponseObject);
                            //  this.projectService.setSession('opportunityStatus', response.ResponseObject.StatusCode);
                            //window.history.back();
                            setTimeout(() => {
                              this.router.navigate(['/opportunity/opportunityview/overview']);
                          }, 2500);  
                          }
                          else{
                            this.projectService.displayMessageerror("Error in saving data. Try after sometime!");
                            //this.snackBar.open("Error in saving data. Try after sometime!!", this.action, { duration:3000 });
                          }
                        }
                        else{
                          this.projectService.displayMessageerror("Error in saving data. Try after sometime!");
                          //this.snackBar.open("Error in saving data. Try after sometime!!", this.action, { duration:3000 });
                          }
                          
                      },
                        err => {
                            this.service.loaderhome = false;
                            this.projectService.displayerror(err.status);
                            //this.snackBar.open("Error in saving data. Try after sometime!!", this.action, { duration:3000 });
                        }
                    );
            }
          else{
            this.projectService.displayMessageerror("Error in saving data. Try after sometime!");
            //this.snackBar.open("Error in saving data. Try after sometime!!", this.action, { duration:3000 });
            }

          }
          else{
            this.projectService.displayMessageerror("Error in saving data. Try after sometime!");
            //this.snackBar.open("Error in saving data. Try after sometime!!", this.action, { duration:3000 });
            }
        }
        else{
           console.log("Error in saving data. Try after sometime!");
          //this.projectService.displayMessageerror("Error in saving data. Try after sometime!");
          //this.snackBar.open("Error in saving data. Try after sometime!!", this.action, { duration:3000 });
        }
       
      },
      err => {
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
        //this.snackBar.open("Error in saving data. Try after sometime!!", this.action, { duration:3000 });
      }
    );
   
    
}

saveObj;
countComp=0;
parentSubject:Subject<number> = new Subject();

save(obj) {   //to save the data after validations are successful
  this.saveObj = obj;  //to access the obj in getData()
  if (this.errorInGetStatus == 0) {
      if (!this.compSuccess) {
        // if (this.runCompetitor == 1) {
        //   this.saveClicked = true;
        // }
        this.saveOthers(obj);
      }
    //   else {
    //     this.countComp = this.countComp + 1;
    //     this.parentSubject.next(this.countComp);
    //     debugger;
    // }
  }
  else {
    this.projectService.displayMessageerror("Error: Failed to save data!");
  }
}

saveOthers(obj) {   //to save the data after validations are successful
  if(this.errorInGetStatus == 0 )
  {
     this.service.loaderhome = true;

     this.projectService.createEndSalesRecord1(obj).subscribe(res => { // SAVE API CALLED
         this.service.loaderhome = false;
         debugger;
         if(res.IsError == false){

            if(res.ResponseObject != null ){
             if(res.ResponseObject == true){

                 this.snackBar.open("This opportunity will be considered as "+this.statusName+"." , this.action, { duration:3000 });
                 console.log("Data saved successfully");
                 this.disableFields= true;
                 console.log("status: ", this.status);
                 this.projectService.setSession('opportunityStatus', this.status);

        
             this.service.loaderhome = true;
            this.projectService.updateLossOpportunity(this.status, this.opportunityId).subscribe(response => {
                this.service.loaderhome = false;
                    if(response.IsError == false){
                     if(response.ResponseObject == true ) {
                       console.log(response);
                      }
                      else{
                         if(this.opportunityStatusCheck == 1){
                          this.projectService.displayMessageerror("Error. Try saving after sometime!");
                         }
                         //this.snackBar.open("Error in saving data. Try after sometime!!", this.action, { duration:3000 });
                       }
                     }
                     else{
                       if(this.opportunityStatusCheck == 1){
                        this.projectService.displayMessageerror("Error. Try saving after sometime!");
                       }
                       //this.snackBar.open("Error in saving data. Try after sometime!!", this.action, { duration:3000 });
                    }
                 },
                 err => {
                       this.service.loaderhome = false;
                       this.projectService.displayerror(err.status);
                       //this.snackBar.open("Error in saving data. Try after sometime!!", this.action, { duration:3000 });
                         }
                   );

                   this.service.loaderhome = true;
                   this.projectService.updateOpporStatus(this.opportunityId).subscribe(response => {
                       this.service.loaderhome = false;
                           if(response.IsError == false){
                            // if(response.ResponseObject == true ){
                               if(response.ResponseObject ){
                                 console.log(response);
                                 console.log(response.ResponseObject);
                               //  this.projectService.setSession('opportunityStatus', response.ResponseObject.StatusCode);
                               //window.history.back();
                               setTimeout(() => {
                                this.router.navigate(['/opportunity/opportunityview/overview']);
                              }, 2000); 
                               
                             }
                             else{
                               this.projectService.displayMessageerror("Error in saving data. Try after sometime!");
                               //this.snackBar.open("Error in saving data. Try after sometime!!", this.action, { duration:3000 });
                             }
                          }
                           else{
                             this.projectService.displayMessageerror("Error in saving data. Try after sometime!");
                             //this.snackBar.open("Error in saving data. Try after sometime!!", this.action, { duration:3000 });
                            }
                            
                         },
                           err => {
                               this.service.loaderhome = false;
                              this.projectService.displayerror(err.status);
                              //this.snackBar.open("Error in saving data. Try after sometime!!", this.action, { duration:3000 });
                          }
                      );
               }
             else{
               this.projectService.displayMessageerror("Error in saving data. Try after sometime!");
               //this.snackBar.open("Error in saving data. Try after sometime!!", this.action, { duration:3000 });
               }

             }
             else{
               this.projectService.displayMessageerror("Error in saving data. Try after sometime!");
               //this.snackBar.open("Error in saving data. Try after sometime!!", this.action, { duration:3000 });
               }
           }
           else{
             console.log("Error in saving data. Try after sometime!");
             //this.snackBar.open("Error in saving data. Try after sometime!!", this.action, { duration:3000 });
           }
          
         },
         err => {
          this.service.loaderhome = false;
           this.projectService.displayerror(err.status);
           //this.snackBar.open("Error in saving data. Try after sometime!!", this.action, { duration:3000 });
         }
      );
    }
    else{
      this.projectService.displayMessageerror("Error: Failed to save data!");
    }
    
  }
   /// ************ adavance lookup


   selectedLookupData(controlName) {
    console.log(controlName);
    switch(controlName) {
      case  'opportunity' : {
        return (this.selectedcampaign.length > 0) ? this.selectedcampaign : []
      }

    }
}

  IdentifyAppendFunc ={
    'opportunity' : (data, index)=>{this.appendcampaign(data, index)},
  }

  lookupdata={
    tabledata: [],
    recordCount: 10,
    headerdata:[],
    Isadvancesearchtabs: true,
    isCheckboxRequired:false,
    controlName: "",
    lookupName: "",
    inputValue: "",
    TotalRecordCount :0,
    selectedRecord:[],
    nextLink: "",
    isLoader:false,
    pageNo : 1,
  };

  resp;
  isAccount=true;
  openadvancetabs(controlName, initialLookupData, value ): void {
    debugger;
    this.lookupdata.controlName = controlName;
    this.lookupdata.headerdata = opportunityHeaders[controlName];
    this.lookupdata.lookupName= opportunityNames[controlName]['name'];
    this.lookupdata.isCheckboxRequired =  opportunityNames[controlName]['isCheckbox'];
    this.lookupdata.Isadvancesearchtabs = opportunityNames[controlName]['isAccount'];
    this.lookupdata.inputValue = value;

    console.log(" this.campaignContact: " ,this.campaignContact);
    console.log("this.campaignData :",this.campaignData);
    this.resp =  this.projectService.filterCampaignEvent(this.campaignContact);

    if(this.resp.length==1){
       if(this.contactcampaign.length == this.resp[0].Name.length && this.opportunitySelectedFromLookUp ==1){
         this.selectedcampaign.push({'Id':this.opporId, 'Name':this.contactcampaign});
        //this.lookupdata.controlName=;
        //this.lookupdata.inputValue = ;
       }
       else if(this.contactcampaign.length == this.resp[0].Name.length && this.opportunitySelectedFromLookUp ==0){
        this.selectedcampaign= [];
       }
    }
    else if ( this.resp.length> 1 ) {
        if(this.opportunitySelectedFromLookUp ==0){
           this.selectedcampaign= [];
        }
        else if(this.opportunitySelectedFromLookUp ==1){
          this.selectedcampaign= [];
        }
    }

   this.lookupdata.tabledata= this.resp;
   console.log("this.selectedcampaign", this.selectedcampaign);
    console.log('this.lookupdata.tabledata : ', this.lookupdata.tabledata);
    this.lookupdata.TotalRecordCount =   this.campaignData.TotalRecordCount;
    this.lookupdata.nextLink =  this.campaignData.OdatanextLink;
    console.log('this.lookupdata.TotalRecordCount : ', this.lookupdata.TotalRecordCount);
    console.log('this.lookupdata.nextLink : ', this.lookupdata.nextLink);

    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    console.log("this.controlName", this.lookupdata.controlName);
    console.log("this.selectedRecord", this.lookupdata.selectedRecord);

    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.service.setHeaderPixes(this.lookupdata.headerdata.length,this.lookupdata.Isadvancesearchtabs),
      data:this.lookupdata,
      disableClose: true
    });

  dialogRef.componentInstance.modelEmiter.subscribe((x) => {

    debugger
    console.log(x)
    if(x.action=='loadMore'){

          let dialogData = {
          searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
          recordCount: this.lookupdata.recordCount,
          OdatanextLink: this.lookupdata.nextLink,// need to handel the pagination and search!
         // pageNo: this.lookupdata.pageNo//+1//need to handel from pagination
          pageNo: x.currentPage,
          Guid: this.accountID
          }

    this.projectService.getLookUpFilterData({oppID:this.opportunityId, accID:this.accountID, data: null, controlName: controlName, isService: true, useFullData: { ...dialogData } }).subscribe(res => {
      this.lookupdata.isLoader=false;
          this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
          this.lookupdata.pageNo = res.CurrentPageNumber;
          this.lookupdata.nextLink = res.OdatanextLink
          //this.lookupdata.recordCount = res.PageSize

    })

    }else if(x.action=='search'){

          //this.lookupdata.tabledata = []
          this.lookupdata.nextLink =''
          this.lookupdata.pageNo = 1
          let dialogData = {
          searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
          recordCount: this.lookupdata.recordCount,
          OdatanextLink: this.lookupdata.nextLink,// need to handel the pagination and search!
         // pageNo: this.lookupdata.pageNo//+1//need to handel from pagination
          //pageNo: this.lookupdata.pageNo
          pageNo:  x.currentPage
        }

        this.projectService.getLookUpFilterData({oppID:this.opportunityId, accID:this.accountID, data: null, controlName: controlName, isService: true, useFullData: { ...dialogData } }).subscribe(res => {
          this.lookupdata.isLoader=false;
          console.log("res: ", res);
              this.lookupdata.tabledata = res.ResponseObject;
              this.lookupdata.pageNo = res.CurrentPageNumber;
              this.lookupdata.nextLink = res.OdatanextLink
              //this.lookupdata.recordCount = res.PageSize
              this.lookupdata.TotalRecordCount = res.TotalRecordCount
            })
          }
    });

  dialogRef.afterClosed().subscribe(result => {
    debugger
    if (result) {
      console.log("result.selectedData", result.selectedData);
      this.AppendParticularInputFun(result.selectedData,result.controlName)
    }
  });

}


  AppendParticularInputFun(selectedData,controlName) {
    debugger;
    console.log("selectedData", selectedData);
    console.log("controlName", controlName);
    switch(controlName) {
      case  'opportunity' : {this.campaignContact = []}

    }

    if(selectedData){
      if(selectedData.length>0){
        console.log(selectedData);
        selectedData.forEach((data,i)  => {
          console.log(data);
          this.IdentifyAppendFunc[controlName](data,i);
        });
      }
    }
  }
/// ********************************

}

  ////////*********************************** */
