import { Component, OnInit, EventEmitter, ViewChild, Inject } from '@angular/core';
import { DataCommunicationService, campaignHeaders, campaignNames } from '@app/core/services/global.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/';
import { OpportunitiesService, ThemeService, teamService } from '@app/core/services';
import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { EIO } from 'constants';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { DigitalAssistantService } from '@app/core/services/digital-assistant/digital-assistant.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';



@Component({
  selector: 'app-deal',
  templateUrl: './deal.component.html',
  styleUrls: ['./deal.component.scss']
})
export class DealComponent implements OnInit {
  panelOpenState3 = true;
//   table_data = [
//     {
//       "influencingunit":"Alliance",
//       "eventtype":"Event type/name 1",
//       "eventdetails":"Event details goes here",
//       "endorsementtype":"Event type 1",
//       "alliancebdm":"Radhika verma",
//       "deliverylead":"Radhika verma",
//       "comments":"Lorem Ipsum is simply dummy text of the"
//   },
//   {
//     "influencingunit":"Alliance",
//     "eventtype":"Event type/name 1",
//     "eventdetails":"Event details goes here",
//     "endorsementtype":"Event type 1",
//     "alliancebdm":"Radhika verma",
//     "deliverylead":"Radhika verma",
//     "comments":"Lorem Ipsum is simply dummy text of the"
// },
// {
//   "influencingunit":"Alliance",
//   "eventtype":"Event type/name 1",
//   "eventdetails":"Event details goes here",
//   "endorsementtype":"Event type 1",
//   "alliancebdm":"Radhika verma",
//   "deliverylead":"Radhika verma",
//   "comments":"Lorem Ipsum is simply dummy text of the"
// },
// {
//   "influencingunit":"Alliance",
//   "eventtype":"Event type/name 1",
//   "eventdetails":"Event details goes here",
//   "endorsementtype":"Event type 1",
//   "alliancebdm":"Radhika verma",
//   "deliverylead":"Radhika verma",
//   "comments":"Lorem Ipsum is simply dummy text of the"
// }
// ]
  @ViewChild('myForm') public userFrm: NgForm;
  selectedAll:boolean;
  panelOpenState2:boolean=true;
  constructor(public dialog: MatDialog, public service: DataCommunicationService, public projectService: OpportunitiesService, public teamService: teamService, public daService: DigitalAssistantService ,  private EncrDecr: EncrDecrService) {
    this.saveRecord = this.saveRecord.bind(this);
    this.eventSubscriber(this.service.subscription, this.saveRecord);

   this.ngOnInit = this.ngOnInit.bind(this);
    this.eventSubscriber1(this.projectService.subscriptionMoreOptions, this.ngOnInit);
}

  opportunityId;
  accessData;
  fullAccess;
  partialAccess;
  disableFields = false;
  dealInfluencerAccess;
  dealData:any = [];
  fullAccessFromCreatePage;

  eventTypeEntityName = [];
  influencingUnit = [];

  eventTypeEntityName1 = [];
  influencingUnit1 = [];
  endorsementType = [];
  opportunityStatusCheck;
  disableEventDetails = false;
  disableEventTypeName = false;
  disableDeliveryLed = false;
  disableAllianceBdm = false;
  isSearchLoaderForOrder = false;
  orderCreatedFlag = false;
  sbuId = "";
  serviceLineData = [];
  roleObj;
url = "";
userId="";
decr;
superCentralMarketingRole = false;

getSymbol(data) {
  data = this.escapeSpecialChars(data);
  return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
}

escapeSpecialChars(jsonString) {
  return jsonString.replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t")
      .replace(/\f/g, "\\f");

}
  ngOnInit() {
    // this.daService.iframePage = 'DEAL_INFLUENCER';
    // let bodyDA = {
    //   page: 'DEAL_INFLUENCER',
    //   opportunityId: this.projectService.getSession('opportunityId')
    // };
    // this.daService.postMessageData = bodyDA;
    // this.daService.postMessage(bodyDA);
    // console.log("Init of deal comp ts");
    this.disableEventDetails = true;
    this.disableEventTypeName = true;
    this.disableDeliveryLed = true;
    this.disableAllianceBdm = true;
    this.orderCreatedFlag = false;
    this.superCentralMarketingRole = false;
    this.opportunityId = this.projectService.getSession('opportunityId');
    this.sbuId = this.projectService.getSession('sbuId')
   debugger;
    console.log("this.opportunityId: ", this.opportunityId);
    console.log("sbu Id: ", this.sbuId);

    this.decr = localStorage.getItem('userID');
    this.userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');

    console.log("UserId: ", this.userId);
    this.disableFields = false;


   // this.accessData = this.projectService.getSession('accessData');
  //  console.log(" this.accessData: ",  this.accessData);
    this.fullAccessFromCreatePage = this.projectService.getSession('FullAccess');
    console.log("fullAccessFromCreatePage:", this.fullAccessFromCreatePage);
    this.opportunityStatusCheck = this.projectService.getSession('opportunityStatus');

    this.orderCreatedFlag = this.projectService.getSession('ordercreated');
    this.roleObj = this.projectService.getSession('roleObj');
    console.log("Role obj: ",this.roleObj);
  //  // this.roleObj = this.projectService.getSession('roleType');
  //   console.log("roleType: ", this.projectService.getSession('roleType'));
  //   console.log("roleType: ", this.projectService.getSession('roleType'));


   // this.opportunityStatusCheck = 2;
    if (this.opportunityStatusCheck == 1 && this.orderCreatedFlag == false && this.projectService.getSession('IsAppirioFlag') == false) {
      if (this.fullAccessFromCreatePage == true) {
          this.disableFields = false;
      }
      else if(this.roleObj && this.roleObj.FullAccess == true) {
        this.disableFields = false;
      }
      else if(this.roleObj && this.roleObj.PartialAccess == true) {
        this.disableFields = false;
      }
      else {
        console.log( "IsSuperCentralMarketingManagerRole: " , this.roleObj.UserRoles.IsSuperCentralMarketingManagerRole);
        if(this.roleObj.UserRoles.IsSuperCentralMarketingManagerRole == true){
          this.superCentralMarketingRole = true;
          // this.disableFields = false;
        }
        else{
          this.disableFields = true;
        }
    }
  }
    else {
      this.disableFields = true;
    }



    //    ************************optionSets*************************************
    this.service.loaderhome = true;
    this.service.eventTypeEntityNameOptionSet().subscribe(res => {
      this.service.loaderhome = false;
      debugger;
      if ((res.IsError) == false) {
        if (res.ResponseObject != null && res.ResponseObject.length != 0) {
          console.log("reasonOptionSet: ",res);
          this.eventTypeEntityName= [];
          this.eventTypeEntityName1= [];

      // if( ){

        //  if(this.roleObj.UserRoles.IsSuperCentralMarketingManagerRole && this.roleObj.UserRoles.IsSuperCentralMarketingManagerRole == false){


        //         for(var i=0; i<res.ResponseObject.length; i++){
        //           var obj= {};

        //           if( res.ResponseObject[i].Value== "Other Marketing-Activities"){
        //             Object.assign(obj, {Value: res.ResponseObject[i].Id});
        //             Object.assign(obj, {Label: res.ResponseObject[i].Name});
        //             this.eventTypeEntityName.push(obj);
        //             break;
        //           }
        //         }
        //           console.log("this.eventTypeEntityName: ",this.eventTypeEntityName);
        //      // }
        //     }
        //     else{

                for(var i=0; i<res.ResponseObject.length; i++){
                  var obj= {};
                    Object.assign(obj, {Value: res.ResponseObject[i].Id});
                    Object.assign(obj, {Label: res.ResponseObject[i].Name});
                    this.eventTypeEntityName.push(obj);

                    if(res.ResponseObject[i].Value== "Other Marketing-Activities"){
                      this.eventTypeEntityName1.push(obj);
                    }
                  }
                  console.log("this.eventTypeEntityName: ",this.eventTypeEntityName);
                  console.log("this.eventTypeEntityName1: ",this.eventTypeEntityName1);
              }

            }
        //  }
          // else{
          //   this.projectService.displayMessageerror("Unable to get data.");
          // }

    },
    err => {
      this.service.loaderhome = false;
      this.projectService.displayerror(err.status);
      //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});
      }
    )

    this.service.loaderhome = true;
    this.service.getInfluencingUnitOptionSet().subscribe(res=>{
      this.service.loaderhome = false;
      debugger;
      if((res.IsError)== false){
        if(res.ResponseObject !=null && res.ResponseObject.length !=0){
       //   console.log("this.roleObj.UserRoles.IsSuperCentralMarketingManagerRole: ",this.roleObj.UserRoles.IsSuperCentralMarketingManagerRole);
          this.influencingUnit =[];
          this.influencingUnit1 =[];


            // if(this.roleObj.UserRoles.IsSuperCentralMarketingManagerRole && this.roleObj.UserRoles.IsSuperCentralMarketingManagerRole == false){
          //     for(var i=0; i<res.ResponseObject.length; i++){
          //       var obj= {};

          //         if( res.ResponseObject[i].Name== "Marketing"){
          //               Object.assign(obj, {Value: res.ResponseObject[i].Id});
          //               Object.assign(obj, {Label: res.ResponseObject[i].Name});
          //               this.influencingUnit.push(obj);
          //               break;
          //           }
          //       }
          //       console.log("this.influencingUnit: ",this.influencingUnit);

          // }
       //   else{
            for(var i=0; i<res.ResponseObject.length; i++){
              var obj= {};
                Object.assign(obj, {Value: res.ResponseObject[i].Id});
                Object.assign(obj, {Label: res.ResponseObject[i].Name});
                this.influencingUnit.push(obj);
               // this.influencingUnit1.push(obj);
               if(res.ResponseObject[i].Name== "Marketing"){
                this.influencingUnit1.push(obj);
               }
              }
              console.log("this.influencingUnit: ",this.influencingUnit);
              console.log("this.influencingUnit1: ",this.influencingUnit1);

        //  }
         }
        }
        else{
          this.projectService.displayMessageerror("Unable to get data.");

          //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});
        }

    },
    err => {
      this.service.loaderhome = false;
      this.projectService.displayerror(err.status);
      //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});
      }
    )

    this.service.loaderhome = true;
    this.service.endrosementTypeOptionSet().subscribe(res=>{
      this.service.loaderhome = false;
      debugger;
      if((res.IsError)== false){
        if(res.ResponseObject !=null && res.ResponseObject.length !=0){
         // console.log("reasonOptionSet: ",res);

         for(var i=0; i<res.ResponseObject.length; i++){
          var obj= {};
             Object.assign(obj, {Value: res.ResponseObject[i].Id});
             Object.assign(obj, {Label: res.ResponseObject[i].Name});
             this.endorsementType.push(obj);
          }
          console.log("this.endorsementType: ",this.endorsementType);
        }
        else{
          this.projectService.displayMessageerror("Unable to get data.");

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



    // this.service.loaderhome = true;
    // this.service.getServiceLineLookup(this.sbuId).subscribe(res=>{
    //   this.service.loaderhome = false;
    //   debugger;
    //   if((res.IsError)== false){
    //     if(res.ResponseObject !=null && res.ResponseObject.length !=0){
    //       console.log("service line lookup data: ",res);

    //       this.serviceLineData = res.ResponseObject;

    //     }
    //     else{
    //       this.projectService.displayMessageerror("Unable to get data.");

    //       //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});
    //     }

    //   }
    // },
    // err => {
    //   this.service.loaderhome = false;
    //   this.projectService.displayerror(err.status);
    //   //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});
    //   }
    // )
////////////////////////////////////

// this.service.getAccount().subscribe(res=>{
//   this.service.loaderhome = false;
//   debugger;
//   console.log(res);

// },
// err => {
//   this.service.loaderhome = false;
//   this.projectService.displayerror(err.status);
//   //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});
//   }
// );

////////////////////////

    this.getDealInfluencerData();

    // this.projectService.getsaveCliked().subscribe(res => {
    //   //  alert("save of team trigerred");
    //   // debugger;
    //     this.saveRecord();
    //   });
  }

  ngAfterViewChecked() {
    console.log("dirty flag",this.service.dirtyflag);
     if(this.userFrm.dirty){
      this.service.dirtyflag = true;
    }
    else{
     this.service.dirtyflag = false;
    }
  }

  subscription;
  subscriptionMoreOptions;
  eventSubscriber(action: Subject<any>, handler: () => void, off: boolean = false) {
    if (off && this.subscription) {
      this.subscription.unsubscribe();
    } else {
      this.subscription = action.subscribe(() => handler());
    }
  }

  eventSubscriber1(action: Subject<any>, handler: () => void, off: boolean = false) {
    if (off && this.subscriptionMoreOptions) {
      this.subscriptionMoreOptions.unsubscribe();
    } else {
      this.subscriptionMoreOptions = action.subscribe(() => handler());
    }
  }

  ngOnDestroy(): void {
    this.eventSubscriber(this.service.subscription, this.saveRecord, true);
  this.eventSubscriber1(this.projectService.subscriptionMoreOptions , this.ngOnInit, true);
}

    addcompetitor()
    {
      this.dealData.push(
        // {
        //   "WiproOpportunityId": this.opportunityId,
        //   "OpportunityDealInfluencersId": "",
        //   "WiproInfluencingUnit": "",
        //   "WiproEventtypeentityName": "",
        //   "WiproEventDetails": "",
        //   "WiproEndorsementType": "",
        //   "WiproComments": "",
        //   "WiproEndorsementTypeValue": "",
        //   "WiproEventDetailsId": "",
        //   "WiproEventTypeEntityNameValue": "",
        //   "WiproInfluencingunitValue": "" ,
        //   "appendCalled": 0,
        //   "apppendForOtherThanMarketing": 0,
        //   "appendCalledDeliveryLed": 0,
        //   "appendCalledAllianceBdm": 0,
        //   "isMandatoryIU": false,
        //   "isMandatoryEventName": false,
        //   "isMandatoryEventDetails": false,
        //   "isMandatoryEndrosmentType": false,
        //   "isMandatoryDeliveryLed" : false,
        //   "isMandatoryAllianceBdm" : false,
        //   "Id" : "",
        //   "allianceBdm": "",
        //   "allianceBdmId": "",
        //   "WiproDeliveryName": "",
        //   "WiproDeliveryId": "",
        //   // "OldWiproInfluencingUnit" : "",
        //   // "OldWiproEventtypeentityName": "",
        //   // "OldWiproEventDetailsId":"",
        //   // "OldAllianceBdmId": "",
        //   // "OldWiproDeliveryId": ""

        // }


        {
          "WiproOpportunityId": this.opportunityId,
          "OpportunityDealInfluencersId": "",
          "WiproInfluencingUnit": "",
          "WiproEventtypeentityName": "",
          "WiproEventDetails": "",
          "WiproEndorsementType": "",
          "WiproComments": "",
          "WiproEndorsementTypeValue": "",
          "WiproEventDetailsId": "",
          "WiproEventTypeEntityNameValue": "",
          "WiproInfluencingunitValue": "" ,
          "appendCalled": 0,
          "apppendForOtherThanMarketing": 0,
          "appendCalledDeliveryLed": 0,
          "appendCalledAllianceBdm": 0,
          "isMandatoryIU": false,
          "isMandatoryEventName": false,
          "isMandatoryEventDetails": false,
          "isMandatoryEndrosmentType": false,
          "isMandatoryDeliveryLed" : false,
          "isMandatoryAllianceBdm" : false,
          "Id" : "",
          "AllianceBdmId": "",
          "AllianceBdm": "",
          "WiproDeliveryName": "",
          "WiproDeliveryId": "",

          // "WiproDeliveryLEDId": "",
          // "WiproDeliveryLEDIdName": "",
          "DeliveryLeadNameText": "",
          "DeliveryLedEmail": ""


          // "OldWiproInfluencingUnit" : "",
          // "OldWiproEventtypeentityName": "",
          // "OldWiproEventDetailsId":"",
          // "OldAllianceBdmId": "",
          // "OldWiproDeliveryId": ""

        }
      );

          //  if(this.roleObj.UserRoles.IsSuperCentralMarketingManagerRole && this.roleObj.UserRoles.IsSuperCentralMarketingManagerRole == true){
          //        // this.eventTypeEntityName = [];
          //         for(var i=0; i<this.eventTypeEntityName.length; i++){
          //           var obj= {};

          //           if(this.eventTypeEntityName[i].Value!= "Other Marketing-Activities"){

          //             delete this.eventTypeEntityName[i].Value;
          //             delete this.eventTypeEntityName[i].Label;

          //            // break;
          //           }
          //         }
          //           console.log("this.eventTypeEntityName: ",this.eventTypeEntityName);
          //      // }
          //     }
          //     // else{
          //     //   this.eventTypeEntityName
          //     // }

          //   //this.influencingUnit =[];
          //     if(this.roleObj.UserRoles.IsSuperCentralMarketingManagerRole && this.roleObj.UserRoles.IsSuperCentralMarketingManagerRole == true){
          //       for(var i=0; i<this.influencingUnit.length; i++){
          //         var obj= {};
          //       //  this.influencingUnit =[];
          //           if( this.influencingUnit[i].Name!= "Marketing"){
          //             delete this.influencingUnit[i].Value;
          //             delete this.influencingUnit[i].Label;
          //             }
          //         }
          //         console.log("this.influencingUnit: ",this.influencingUnit);
          //   }
    }

    deleteMsg;
    deleteResponse;

    deleteRow(data,dealInfluencerId, index){
    
     const dialogRef = this.dialog.open(deleteLineItem,
        {
          width: '390px',
          disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result=="yes") {
           console.log("Result: ",result);

    
       if(dealInfluencerId == ""){
        debugger;

         console.log("index: ", index);
          this.dealData.splice(index, 1);
          this.projectService.displayMessageerror("Record deleted successfully.");

       }
       else{
           
            this.service.loaderhome= true;
            this.service.deleteRow(dealInfluencerId).subscribe(res => {
              this.service.loaderhome= false;
              this.deleteResponse= res;
            if ( this.deleteResponse.IsError==false){
                this.deleteMsg = this.deleteResponse.Message;

                  console.log(this.deleteMsg);
                  if(this.deleteMsg.toUpperCase()== "SUCESS"){
                        console.log("delete successful");
                        this.getDealInfluencerData();

                        this.projectService.displayMessageerror("Record deleted successfully.");

                  }
                  else{
                    console.log("Record cannot be deleted.");
                    this.projectService.displayMessageerror("Record couldn't be deleted.");
                  }
                  }
                  else{
                    this.projectService.displayMessageerror("Record could't be deleted.");
              }
          },
          err => {
            this.service.loaderhome= false;
            this.projectService.displayerror(err.status);
          }
        );
      }
    }
  });



    }

    deletecompetitor(data,dealInfluencerId, index)
    {
      if(data.WiproInfluencingunitValue.toUpperCase()== "ALLIANCE"){
       
         if( this.projectService.getSession('dealOppOwnerId')!= this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')){
         this.projectService.displayMessageerror("Only opportunity owner can delete alliance account.")
        }
        else{
          this.deleteRow(data,dealInfluencerId, index)
        }
       
      }

      else{
      this.deleteRow(data,dealInfluencerId, index)
    }
}


/****************************** Delivery Led */


deliveryLedclose(data) {

  data.delieveryLedSwitch = false;
  if(data.appendCalledDeliveryLed== 0){
    data.DeliveryLeadNameText="";
    data.WiproDeliveryId = "";
    data.DeliveryLedEmail= "";
    data.WiproDeliveryName = "";
    console.log("this.selectedDeliveryLed: ",this.selectedDeliveryLed);
  }
}

//allianceBdmName: string = "";
delieveryLedSwitch: boolean = true;
appendDeliveryLed(item,data) {
  debugger;
  this.selectedDeliveryLed= [];
  console.log("data : ",data);
  console.log("item : ",item);

  console.log("new delivery Led: ", this.deliveryLedData);
  console.log("eventCapaignId: ", item.SysGuid);
  data.appendCalledDeliveryLed= 1;
  item.Id = item.ownerId;
  data.WiproDeliveryName = item.FullName;
  data.WiproDeliveryId = item.ownerId;
  data.DeliveryLedEmail = item.Email;
  data.DeliveryLeadNameText = item.DisplayName;
  data.isMandatoryDeliveryLed = false;


  // item.Email
  this.selectedDeliveryLed.push(item);
  console.log("this.selectedDeliveryLed: ",this.selectedDeliveryLed);
}

deliverytype: any = [];
deliveryLedData;
selectedDeliveryLed = [];

getDeliveryLed(data){
  debugger;

  this.deliverytype= [  ];
  // this.selectedDeliveryLed = [];
  //data.appendCalled=0;
  //console.log("this.url: ", this.url);
  console.log( " this.deliverytype", this.deliverytype.length);

  this.isSearchLoaderForOrder=true;

  if(data.DeliveryLeadNameText == null){
    data.DeliveryLeadNameText = "";
    data.WiproDeliveryName = "";
    data.WiproDeliveryId= "";
    data.DeliveryLedEmail= "";

  }

  // this.service.getDeliveryLed( data.WiproDeliveryName ).subscribe(res => {
    this.teamService.getActiveEmployees( data.DeliveryLeadNameText ).subscribe(res => {
  debugger;
    this.isSearchLoaderForOrder=false;
    this.deliveryLedData = res;
    // this.lookupdata.TotalRecordCount =  res.TotalRecordCount;
    // this.lookupdata.nextLink = res.OdatanextLink;
    console.log("campaign Data: " , this.deliveryLedData);

  if (this.deliveryLedData.IsError == false) {
    this.deliveryLedData = res;

    this.isSearchLoaderForOrder=false;
    this.deliverytype = this.deliveryLedData.ResponseObject;
    // for(var i= 0; i< this.deliveryLedData.ResponseObject.length; i++){
    //     this.deliverytype.push(this.deliveryLedData.ResponseObject[i]);
    //   }
      console.log("deliverytype : " , this.deliverytype);
    }
  else{
    this.isSearchLoaderForOrder=false;
    this.projectService.displayMessageerror("Error in getting the list.");
  }
  },
    err => {
      this.isSearchLoaderForOrder=false;
      //this.service.loaderhome= false;
      this.projectService.displayerror(err.status);

    }
  );
}

//*************************************** Delivery Led end */

///*********************************** ALLIANCE BDM */
allianceBdmclose(data) {

  data.allianceBdmSwitch = false;

  if(data.appendCalledAllianceBdm== 0){
    data.AllianceBdm="";
    data.AllianceBdmId = "";
    console.log("this.selectedAlliance: ",this.selectedAlliance);
  }
  // if(data.appendCalledAllianceBdm== 0){
  //   //data.WiproEventDetails="";
  //    this.selectedAlliance[0];
  //   }
}

//allianceBdmName: string = "";
allianceBdmSwitch: boolean = true;
appendAllianceBdm(item,data) {
  debugger;
  this.selectedAlliance= [];
  console.log("data : ",data);
  console.log("item : ",item);

  console.log("new Deal data: ", this.dealData);
  console.log("eventCapaignId: ", item.SysGuid);
  data.appendCalledAllianceBdm= 1;
  data.AllianceBdm = item.Name;
   data.AllianceBdmId = item.SysGuid;
  this.selectedAlliance.push(item);
  data.isMandatoryAllianceBdm = false;
  //this.selectedAlliance[0].Id  =
  console.log("this.selectedAlliance: ",this.selectedAlliance);
}

allianceBdmType:any = [];
allianceBdmData;
selectedAlliance= [];

getAllianceBdm(data){
  debugger;

  this.allianceBdmType= [  ];
  // this.selectedAlliance = [];
 // data.appendCalledAllianceBdm= 0;
  //data.appendCalled=0;
  //console.log("this.url: ", this.url);
  console.log( " this.allianceBdmType", this.allianceBdmType.length);

  this.isSearchLoaderForOrder=true;

  if(data.AllianceBdm== null ){
    data.allianceBdmData= "";
  }
  if( data.WiproEventtypeentityName == null ){
    data.WiproEventtypeentityName = "";
  }

  this.service.getAllianceBdm(data.AllianceBdm, data.WiproEventtypeentityName).subscribe(res => {
   this.isSearchLoaderForOrder=false;
    // this.allianceBdmData = res;

    // this.lookupdata.TotalRecordCount =  res.TotalRecordCount;
    // this.lookupdata.nextLink = res.OdatanextLink;
    console.log("campaign Data: " , this.allianceBdmData);

  if(res.IsError == false){
    this.allianceBdmData = res;
    this.allianceBdmType= [  ];
    this.isSearchLoaderForOrder=false;
    for(var i= 0; i< this.allianceBdmData.ResponseObject.length; i++){

      //  var obj= {};

      //  Object.assign(obj, {index: i});
      //  Object.assign(obj, {maintitle: this.campaignData.ResponseObject[i].Name});
      //  Object.assign(obj, {eventCampaignId: this.campaignData.ResponseObject[i].SysGuid});
      //  Object.assign(obj, {ownerName: this.campaignData.ResponseObject[i].OwnerIdODataFormattedValue});
      //  Object.assign(obj, {code: this.campaignData.ResponseObject[i].CodeName});

      this.allianceBdmData.ResponseObject[i].Id = this.allianceBdmData.ResponseObject[i].SysGuid;
        this.allianceBdmType.push(this.allianceBdmData.ResponseObject[i]);
      }
      console.log("allianceBdmType : " , this.allianceBdmType);
    }
  else{
    this.isSearchLoaderForOrder=false;
    this.projectService.displayMessageerror("Error in getting the list.");
  }
  },
    err => {
      this.isSearchLoaderForOrder=false;
      //this.service.loaderhome= false;
      this.projectService.displayerror(err.status);

    }
  );
}

///*********************************** ALLIANCE BDM  ends*/
  // event type autocomplete starts here
  eventtypeName: string = "";
  eventtypeNameSwitch: boolean = true;

  deliveryLeadOutside(data){
 
    debugger
    console.log(this.deliverytype)
    // var filterDelivery =  this.deliverytype.filter((it)=> it.CampaignId == data.WiproEventDetailsId &&  it.Name == data.WiproEventDetails)
    
    // filterDelivery.length==0?data.WiproEventDetails='':data.WiproEventDetails
    // filterDelivery.length==0?data.WiproEventDetailsId='':data.WiproEventDetailsId
    
    
      // this.lookupdata.inputValue =data.WiproEventTypeEntityNameValue;
      
      var filterDelivery =  this.deliverytype.filter((it)=> it.Email == data.DeliveryLedEmail &&  it.DisplayName == data.DeliveryLeadNameText)
      
      filterDelivery.length==0?data.DeliveryLedEmail='':data.DeliveryLedEmail
      filterDelivery.length==0?data.DeliveryLeadNameText='':data.DeliveryLeadNameText
      
      filterDelivery.length==0?this.selectedDeliveryLed=[]:this.selectedDeliveryLed
      
    
    }
allianceBdmOutside(data){
  console.log(this.allianceBdmType)
  
this.lookupdata.inputValue =data.AllianceBdm;
var filterAllianceBdm =  this.allianceBdmType.filter((it)=> it.SysGuid == data.AllianceBdmId &&  it.Name == data.AllianceBdm)

filterAllianceBdm.length==0?data.AllianceBdmId='':data.AllianceBdmId
filterAllianceBdm.length==0?data.AllianceBdm='':data.AllianceBdm

filterAllianceBdm.length==0?this.selectedAlliance=[]:this.selectedAlliance
}


eventDetailsOutside(data){
  console.log(this.wiproeventtype)
this.lookupdata.inputValue =data.WiproEventDetails;
var filterDetails =  this.wiproeventtype.filter((it)=> it.CampaignId == data.WiproEventDetailsId &&  it.Name == data.WiproEventDetails)

filterDetails.length==0?data.WiproEventDetails='':data.WiproEventDetails
filterDetails.length==0?data.WiproEventDetailsId='':data.WiproEventDetailsId

filterDetails.length==0?this.selectedeventtype=[]:this.selectedeventtype
}

eventTypeOutside(data){
this.lookupdata.inputValue =data.WiproEventTypeEntityNameValue;
var filterAlliance =  this.wiproevent.filter((it)=> it.sysGuid == data.WiproEventtypeentityName &&  it.title == data.WiproEventTypeEntityNameValue)

filterAlliance.length==0?data.WiproEventtypeentityName='':data.WiproEventtypeentityName
filterAlliance.length==0?data.WiproEventTypeEntityNameValue='':data.WiproEventTypeEntityNameValue

filterAlliance.length==0?this.selectedevent=[]:this.selectedevent

   filterAlliance.length==0?data.AllianceBdm = "":data.AllianceBdm;
   filterAlliance.length==0?data.AllianceBdmId = "":data.AllianceBdmId;

      filterAlliance.length==0?data.WiproEventDetails = "":data.WiproEventDetails;
   filterAlliance.length==0? data.WiproEventDetailsId = "":data.WiproEventDetailsId;

     
}
  eventtypeNameclose(data) {
    //debugger;
    console.log('wiproevent',this.wiproevent)
    data.eventtypeNameSwitch = false;
    if(data.appendCalled== 0 && (data.WiproInfluencingunitValue.toUpperCase() != "PE OWNED ENTITY") ){
      data.WiproEventDetails="";
      data.WiproEventDetailsId = "";
      console.log("this.selectedeventtype: ",this.selectedeventtype);
      // if(this.selectedeventtype.length >0 ){
      //   delete this.selectedeventtype[0].Id;
      // 
    //  delete this.selectedeventtype[0].Id;
    }
  }
  appendeventtype(item,data) {
    debugger;
    this.selectedeventtype= [];
    console.log("data : ",data);
    console.log("item : ",item);

    console.log("new Deal data: ", this.dealData);
    console.log("eventCapaignId: ", item.CampaignId);
    data.appendCalled= 1;
    data.WiproEventDetails = item.Name;
     data.WiproEventDetailsId = item.CampaignId;
     data.isMandatoryEventDetails= false;
    //this.selectedeventtype.push(item.eventCampaignId);
    this.selectedeventtype.push(item);
    console.log("this.selectedeventtype: ",this.selectedeventtype);
  }

  wiproeventtype:any = [];
 // selectedeventtype: {}[] = [];
  selectedeventtype = [];
  dealInfluencerData;
  //dealData;

  totalRecords;
  campaignData;
  campaignEvent(data){
    debugger;
    if(data.WiproEventTypeEntityNameValue.toUpperCase()=="CAMPAIGN"){
      this.url = "Deal_Influencer/GetCampaign";
    }
    if(data.WiproEventTypeEntityNameValue.toUpperCase()=="EVENT"){
      this.url = "Deal_Influencer/GetEvents";
    }

    console.log("get campaign/event", data.WiproEventDetails);
    this.wiproeventtype= [ ];
    // this.selectedeventtype= [];
   // data.appendCalled=0;
   console.log("this.selectedeventtype: ",this.selectedeventtype);
   console.log("this.url: ", this.url);
    console.log( " this.wiproeventtype", this.wiproeventtype.length);

    // if(this.selectedeventtype.length> 0){
    //   data.appendCalled=1;
    // }
    // else{
    //   data.appendCalled=0;
    // }

    this.isSearchLoaderForOrder=true;
     if(data.WiproEventDetails == null){
      data.WiproEventDetails = "";
    }

    if( data.WiproInfluencingunitValue.toUpperCase() == "MARKETING" ){
    this.service.getCampaignData(data.WiproEventDetails, this.url).subscribe(res => {
     this.isSearchLoaderForOrder=false;
      this.campaignData = res;

      console.log("campaign Data: " , this.campaignData);

    if(this.campaignData.IsError == false){
      this.campaignData = res;

      this.isSearchLoaderForOrder=false;
      this.wiproeventtype =[]
      for(var i= 0; i< this.campaignData.ResponseObject.length; i++){

        //  var obj= {};

        //  Object.assign(obj, {index: i});
        //  Object.assign(obj, {maintitle: this.campaignData.ResponseObject[i].Name});
        //  Object.assign(obj, {eventCampaignId: this.campaignData.ResponseObject[i].SysGuid});
        //  Object.assign(obj, {ownerName: this.campaignData.ResponseObject[i].OwnerIdODataFormattedValue});
        //  Object.assign(obj, {code: this.campaignData.ResponseObject[i].CodeName});

        this.campaignData.ResponseObject[i].Id = this.campaignData.ResponseObject[i].CampaignId;
          this.wiproeventtype.push(this.campaignData.ResponseObject[i]);
        }
        console.log("wiproeventtype : " , this.wiproeventtype);
      }
    else{
      this.isSearchLoaderForOrder=false;
      this.projectService.displayMessageerror("Error in getting the list.");
    }
    },
      err => {
        this.isSearchLoaderForOrder=false;
        //this.service.loaderhome= false;
        this.projectService.displayerror(err.status);

      });
      }
      else if( data.WiproInfluencingunitValue.toUpperCase() == "PE OWNED ENTITY" ){
        this.service.getPEOwnedDetails(data.WiproEventDetails, data.WiproEventTypeEntityNameValue).subscribe(res => {
          this.isSearchLoaderForOrder=false;
            this.campaignData = res;

            console.log("campaign Data: " , this.campaignData);
            console.log("this.wiproeventtype: ", this.wiproeventtype);

          if(this.campaignData.IsError == false){
            this.campaignData = res;

            this.isSearchLoaderForOrder=false;

            if( this.campaignData.length == 0){
              data.WiproEventDetails= "";
            }
            else{

              if( this.campaignData.ResponseObject.length>0 ){
                if( this.campaignData.ResponseObject[0].PrivateEquityAccountFormatName && this.campaignData.ResponseObject[0].PrivateEquityAccountValue ){
                  data.WiproEventDetails = this.campaignData.ResponseObject[0].PrivateEquityAccountFormatName;
                  data.WiproEventDetailsId = this.campaignData.ResponseObject[0].PrivateEquityAccountValue;
                }
              }

            }
            // for(var i= 0; i< this.campaignData.ResponseObject.length; i++){

            //     this.campaignData.ResponseObject[i].Id = this.campaignData.ResponseObject[i].CampaignId;
            //    // this.wiproeventtype.push(this.campaignData.ResponseObject[i]);
            //     data.WiproEventDetails = this.campaignData.ResponseObject[0].Name;
            //   }
              //console.log("wiproeventtype : " , this.wiproeventtype);
            }
          else{
            this.isSearchLoaderForOrder=false;
            this.projectService.displayMessageerror("Error in getting the list.");
          }
          },
            err => {
              this.isSearchLoaderForOrder=false;
              //this.service.loaderhome= false;
              this.projectService.displayerror(err.status);
          });
      }

}

getInfluencerLength = 0;

      getDealInfluencerData(){
        this.dealData=[];
       // debugger;
        console.log( "get function" );

        this.service.loaderhome= true;
       //this.isSearchLoaderForOrder=true;
        this.service.getDealInfluencerData(this.opportunityId).subscribe(res => {
          this.service.loaderhome= false;
          this.userFrm.form.markAsPristine();
          this.service.dirtyflag = false;
          
         this.dealInfluencerData = res;

         this.getInfluencerLength = 0;
          console.log("res : ",res.ResponseObject);
          console.log("res : ",res.IsError);


     

            if (this.dealInfluencerData.IsError==false){
              res= res.ResponseObject
             // debugger;
            // this.isSearchLoaderForOrder=false;
            this.getInfluencerLength = this.dealInfluencerData.ResponseObject.length;
              if(this.dealInfluencerData.ResponseObject.length >0){

                  for(var i =0; i< this.dealInfluencerData.ResponseObject.length ; i++){
                   debugger;
                    this.dealInfluencerData.ResponseObject[i].WiproOpportunityId = this.opportunityId;

                    if(this.dealInfluencerData.ResponseObject[i].WiproInfluencingunitValue.toUpperCase() =="MARKETING" && (this.dealInfluencerData.ResponseObject[i].WiproEventTypeEntityNameValue.toUpperCase() =="EVENT" || this.dealInfluencerData.ResponseObject[i].WiproEventTypeEntityNameValue.toUpperCase() =="CAMPAIGN") && (this.dealInfluencerData.ResponseObject[i].WiproEventDetails !="" ||this.dealInfluencerData.ResponseObject[i].WiproEventDetails !=undefined || this.dealInfluencerData.ResponseObject[i].WiproEventDetails != null )){
                        this.dealInfluencerData.ResponseObject[i].appendCalled = 1;
                        if(this.dealInfluencerData.ResponseObject[i].WiproEventTypeEntityNameValue.toUpperCase()== "EVENT"){
                          this.url = "Deal_Influencer/GetEvents";
                        }
                        else if(this.dealInfluencerData.ResponseObject[i].WiproEventTypeEntityNameValue.toUpperCase()== "CAMPAIGN"){
                          this.url = "Deal_Influencer/GetCampaign";
                        }
                        this.disableEventTypeName= false;
                        this.disableEventDetails = false;
                    }

                    else if(this.dealInfluencerData.ResponseObject[i].WiproInfluencingunitValue.toUpperCase() =="MARKETING" && (this.dealInfluencerData.ResponseObject[i].WiproEventTypeEntityNameValue.toUpperCase() !="EVENT" || this.dealInfluencerData.ResponseObject[i].WiproEventTypeEntityNameValue.toUpperCase() !="CAMPAIGN") ){
                          //this.dealInfluencerData.ResponseObject[i].appendCalled = 1;

                          this.disableEventTypeName= false;
                          this.disableEventDetails = true;
                    }
                    else if(this.dealInfluencerData.ResponseObject[i].WiproInfluencingunitValue.toUpperCase() !="MARKETING" && (this.dealInfluencerData.ResponseObject[i].WiproEventTypeEntityNameValue !="" ||this.dealInfluencerData.ResponseObject[i].WiproEventTypeEntityNameValue !=undefined || this.dealInfluencerData.ResponseObject[i].WiproEventTypeEntityNameValue != null )){
                      this.dealInfluencerData.ResponseObject[i].apppendForOtherThanMarketing = 1;
                      this.disableEventTypeName = false;
                    }
                    else if(this.dealInfluencerData.ResponseObject[i].WiproInfluencingunitValue.toUpperCase() =="DELIVERY LED"){
                      this.disableEventTypeName = true;
                      this.disableDeliveryLed = false;
                   }

                    else {
                      this.dealInfluencerData.ResponseObject[i].appendCalled = 0;
                      this.dealInfluencerData.ResponseObject[i].apppendForOtherThanMarketing = 0;
                    }
                    this.dealInfluencerData.ResponseObject[i].Id =  this.dealInfluencerData.ResponseObject[i].WiproEventDetailsId;

                    if( this.dealInfluencerData.ResponseObject[i].WiproEndorsementTypeValue== null ){
                      this.dealInfluencerData.ResponseObject[i].WiproEndorsementTypeValue="";
                      this.dealInfluencerData.ResponseObject[i].WiproEndorsementType= "";
                    }
              }
              this.dealData = this.dealInfluencerData.ResponseObject;
                   this.dealData = this.dealData.map(addColumn => {
                let newColumn = Object.assign({}, addColumn);
                 if( addColumn.WiproInfluencingunitValue?addColumn.WiproInfluencingunitValue.toUpperCase()=='BUSINESS ENABLEMENT':false ){
                   newColumn.businessEnableFlag =true
                  }
                else{
                  newColumn.businessEnableFlag= false
                  }
                   return newColumn;
                  });
              console.log(this.dealData);
            }
            else{
            // this.projectService.displayMessageerror("No data found.");
            }
          }
          else{
           // this.isSearchLoaderForOrder=false;
            this.projectService.displayMessageerror("Error in fetching details.");
          }
          
        
      },
        err => {
          // this.isSearchLoaderForOrder=false;
          this.service.loaderhome= false;
          this.projectService.displayerror(err.status);
          }
        );
      }



//*************************************************** */

// eventtypeName: string = "";
   eventtypeSwitch: boolean = true;

  eventtypeclose(data) {

    data.eventtypeSwitch = false;
    if(data.apppendForOtherThanMarketing== 0){
      data.WiproEventTypeEntityNameValue="";
      data.WiproEventtypeentityName = "";
      data.WiproEventDetailsId = "";
      data.WiproEventDetails = "";
    }
  }
  appendevent(item, data) {
    debugger;
    this.selectedevent = [];
    console.log("data : ", data);
    console.log("item: ", item);
    data.apppendForOtherThanMarketing = 1;
    data.WiproEventTypeEntityNameValue = item.title;
    data.WiproEventtypeentityName = item.sysGuid;
    data.isMandatoryEventName = false;

    this.selectedevent.push(item);

    // data.AllianceBdm = "";
    // data.AllianceBdmId = "";
    // this.selectedAlliance = [];


    this.service.getAllianceBdm(data.AllianceBdm, data.WiproEventtypeentityName).subscribe(res => {
      if (res.IsError == false) {
        if (res.ResponseObject.length == 1) {
          // this.allianceBdmData = res;
          // this.allianceBdmType = [];
          // this.allianceBdmData.ResponseObject[0].Id = this.allianceBdmData.ResponseObject[0].SysGuid;
          // this.allianceBdmType.push(this.allianceBdmData.ResponseObject[0]);
          // data.AllianceBdm=this.allianceBdmData.ResponseObject[0].Name;
          // data.AllianceBdmId=this.allianceBdmData.ResponseObject[0].SysGuid;
          // this.selectedAlliance=this.allianceBdmData.ResponseObject[0];
          if(data.WiproInfluencingunitValue!="PE owned entity")
         {
            this.appendAllianceBdm(res.ResponseObject[0], data);
          console.log("Inside event alliance check", res.ResponseObject[0]);
          console.log("Inside event alliance check2", data);
        }
        else{
          data.AllianceBdm = "";
          data.AllianceBdmId = "";
          this.selectedAlliance = [];
       
        }
        }
        else {
          data.AllianceBdm = "";
          data.AllianceBdmId = "";
          this.selectedAlliance = [];
        }
      }
      else {
        this.isSearchLoaderForOrder = false;
        this.projectService.displayMessageerror("Error in getting the list.");
      }
    },
      err => {
        this.isSearchLoaderForOrder = false;
        this.projectService.displayerror(err.status);
      }
    );
    this.campaignEvent(data);
  }

  wiproevent:any= []
  selectedevent:any= [];

  eventData;
  eventTypeName(data){
    debugger;
    console.log(data);
    console.log("get event", data.WiproEventTypeEntityNameValue);
    this.wiproevent= [  ];
    this.isSearchLoaderForOrder=true;
    // data.apppendForOtherThanMarketing= 0;
 

    if(data.WiproInfluencingunitValue.toUpperCase()== "SERVICE LINE"){
 
      this.isSearchLoaderForOrder=true;
      this.service.getServiceLineLookup(this.sbuId, data.WiproEventTypeEntityNameValue).subscribe(res=>{

        this.eventData = res;
        console.log("event Data: " , this.eventData);
        this.isSearchLoaderForOrder=false;

        if((res.IsError)== false){
          if(res.ResponseObject !=null && res.ResponseObject.length !=0){
            console.log("service line lookup data: ",res);

            this.serviceLineData = res.ResponseObject;
             this.wiproevent = []
            for(var i=0; i<res.ResponseObject.length; i++){
                var obj= {};

                Object.assign(obj, {index: i});
                Object.assign(obj, {title: this.serviceLineData[i].Name});
                Object.assign(obj, {sysGuid: this.serviceLineData[i].SysGuid});

                this.wiproevent.push(obj);
              }
              
          }
          else{
            this.projectService.displayMessageerror("Unable to get data.");
          }
        }
        else{
          this.isSearchLoaderForOrder=false;
          this.projectService.displayMessageerror("Error in getting the list.");
        }
        },
          err => {
            this.isSearchLoaderForOrder=false;
            this.projectService.displayerror(err.status);
          }
      );

  }
  else if( data.WiproInfluencingunitValue.toUpperCase()== "ALLIANCE" ||  data.WiproInfluencingunitValue.toUpperCase()== "ANALYST" ){
    if( data.WiproInfluencingunitValue.toUpperCase()== "ALLIANCE"){
      if(!data.WiproEventTypeEntityNameValue) {
        data.AllianceBdm = "";
        data.AllianceBdmId = "";
        this.selectedAlliance = [];
      }
      this.searchType = "6";
    }
    else if( data.WiproInfluencingunitValue.toUpperCase()== "ANALYST"){
      this.searchType = "10";
    }

    this.service.getAccountCategory(this.searchType, data.WiproEventTypeEntityNameValue, "", this.userId).subscribe(res => {
     // this.service.loaderhome= false;

      this.eventData = res;
      console.log("event Data: " , this.eventData);

    if(this.eventData.IsError == false){
      this.eventData = res;
      this.isSearchLoaderForOrder=false;
      this.wiproevent = []
      for(var i= 0; i< this.eventData.ResponseObject.length; i++){

         var obj= {};

         Object.assign(obj, {index: i});
         Object.assign(obj, {title:   this.eventData.ResponseObject[i].Name? this.getSymbol(this.eventData.ResponseObject[i].Name):'-'  });
         Object.assign(obj, {mapName: this.eventData.ResponseObject[i].MapName});
         Object.assign(obj, {mapGuid: this.eventData.ResponseObject[i].MapGuid});
         Object.assign(obj, {sysNumber: this.eventData.ResponseObject[i].SysNumber? this.eventData.ResponseObject[i].SysNumber: "" });
         Object.assign(obj, {sysGuid: this.eventData.ResponseObject[i].SysGuid});

          this.wiproevent.push(obj);
        }
         }
    else{
      this.isSearchLoaderForOrder=false;
      this.projectService.displayMessageerror("Error in getting the list.");
    }
    },
      err => {
        this.isSearchLoaderForOrder=false;
        //this.service.loaderhome= false;
        this.projectService.displayerror(err.status);
      }
    );
  }
  else if( data.WiproInfluencingunitValue.toUpperCase()== "PE OWNED ENTITY" ){

    this.searchType = "10";
    this.service.getPeOwnedAccount( data.WiproEventTypeEntityNameValue).subscribe(res => {
      //this.service.loaderhome= false;
this.isSearchLoaderForOrder=false;
      this.eventData = res;
      console.log("event Data: " , this.eventData);

    if(this.eventData.IsError == false){
      this.eventData = res;
this.isSearchLoaderForOrder=false;
this.wiproevent = []
      for(var i= 0; i< this.eventData.ResponseObject.length; i++){

         var obj= {};
         Object.assign(obj, {index: i});
         Object.assign(obj, {title: this.eventData.ResponseObject[i].Name});
         Object.assign(obj, {sysGuid: this.eventData.ResponseObject[i].AccountId});
         Object.assign(obj, {mapName: this.eventData.ResponseObject[i].OwnerName});
         Object.assign(obj, {mapGuid: this.eventData.ResponseObject[i].OwnerId});


          this.wiproevent.push(obj);
        }
       }
    else{
      this.isSearchLoaderForOrder=false;
      this.projectService.displayMessageerror("Error in getting the list.");
    }
    },
      err => {
       // this.service.loaderhome= false;
       this.isSearchLoaderForOrder=false;
        this.projectService.displayerror(err.status);
      }
    );
  }
}

searchType;
//************************************************************************* */

        eventDetailsFlag= 0;
        endrosementTypeFlag = 0;

        emptyFields = "";
        saveResponse;
        flag=0;
        duplicateCheck;
        breakCheck;
        arrayOfDeal;
        array;

        saveRecord(){

          // if(this.dealData.length ==0){
          //   this.projectService.displayMessageerror("No record is present.");
          // }
          // else{
            this.flag = 0;
            this.arrayOfDeal=JSON.stringify(this.dealData);
            this.array = JSON.parse(this.arrayOfDeal);

            console.log( this.dealData.length, "length");
            console.log("Inside saveResponse : " , this.dealData);
            var loop=0;


              for(var i=0; i< this.dealData.length; i++){
                this.dealData[i].isMandatoryIU = false;
                this.dealData[i].isMandatoryEventName = false;
                this.dealData[i].isMandatoryEventDetails = false;
                this.dealData[i].isMandatoryEndrosmentType = false;
                loop= i+1;
              debugger;
              //this.flag= 0;
              if(this.dealData[i].OldAllianceBdmId== null){
                this.dealData[i].OldAllianceBdmId= "";
              }
              if(this.dealData[i].OldWiproDeliveryId == null){
                this.dealData[i].OldWiproDeliveryId= "";
              }
              if(this.dealData[i].OldWiproEventDetailsId == null){
                this.dealData[i].OldWiproEventDetailsId= "";
              }
              if(this.dealData[i].OldWiproEventtypeentityName == null){
                this.dealData[i].OldWiproEventtypeentityName= "";
              }
              if(this.dealData[i].OldWiproInfluencingUnit == null){
                this.dealData[i].OldWiproInfluencingUnit= "";
              }
              if(this.dealData[i].WiproEventtypeentityName == null){
                this.dealData[i].WiproEventtypeentityName = "";
              }
              if(this.dealData[i].WiproEventTypeEntityNameValue == null){
                this.dealData[i].WiproEventTypeEntityNameValue = "";
              }
              if(this.dealData[i].WiproEventDetails == null){
                this.dealData[i].WiproEventDetails = "";
              }
              if(this.dealData[i].WiproEventDetailsId == null){
                this.dealData[i].WiproEventDetailsId = "";
              }
              if(this.dealData[i].WiproComments == null){
                this.dealData[i].WiproComments = "";
              }

              // if(this.dealData[i].WiproDeliveryLEDId == null){
              //   this.dealData[i].WiproDeliveryLEDId = "";
              // }
              // if(this.dealData[i].WiproDeliveryLEDIdName == null){
              //   this.dealData[i].WiproDeliveryLEDIdName = "";
              // }
              if(this.dealData[i].AllianceBdmId == null){
                this.dealData[i].AllianceBdmId = "";
              }
              if(this.dealData[i].AllianceBdm == null){
                this.dealData[i].AllianceBdm = "";
              }
              if(this.dealData[i].AllianceBdm == null){
                this.dealData[i].AllianceBdm = "";
              }
              if(this.dealData[i].WiproEndorsementTypeValue == null){
                this.dealData[i].WiproEndorsementTypeValue = "";
              }
              if(this.dealData[i].WiproEndorsementType == null){
                this.dealData[i].WiproEndorsementType = "";
              }
              if(this.dealData[i].WiproDeliveryId == null){
                this.dealData[i].WiproDeliveryId = "";
              }
              if(this.dealData[i].WiproDeliveryName == null){
                this.dealData[i].WiproDeliveryName = "";
              }
              if(this.dealData[i].DeliveryLeadNameText == null){
                this.dealData[i].DeliveryLeadNameText = "";
              }
              if(this.dealData[i].DeliveryLedEmail == null){
                this.dealData[i].DeliveryLedEmail = "";
              }


            //  console.log("this.dealData[i].WiproEventTypeEntityNameValue.length",this.dealData[i].WiproEventTypeEntityNameValue.length);
                if(this.dealData[i].WiproInfluencingunitValue=="" || this.dealData[i].WiproInfluencingunitValue==undefined || this.dealData[i].WiproInfluencingunitValue==null){
                //  this.projectService.displayMessageerror("Select influencing Unit in row "+ loop +".");
                  this.flag= 1;
                  this.dealData[i].isMandatoryIU = true;
                //  break;
                }
               if (this.dealData[i].WiproInfluencingunitValue.toUpperCase()!= "BUSINESS ENABLEMENT"  && (this.dealData[i].WiproInfluencingunitValue.length> 0 ) && this.dealData[i].WiproInfluencingunitValue.toUpperCase()!= "DELIVERY LED" && (this.dealData[i].WiproEventTypeEntityNameValue=="" || this.dealData[i].WiproEventTypeEntityNameValue==undefined || this.dealData[i].WiproEventTypeEntityNameValue==null) ){
                //  this.projectService.displayMessageerror("Select event type/name in row "+ loop +".");
                  this.flag= 1;
                  this.dealData[i].isMandatoryEventName = true;
               //   break;
                }
               if(this.dealData[i].WiproInfluencingunitValue.toUpperCase()== "MARKETING" && (this.dealData[i].WiproEventTypeEntityNameValue.toUpperCase() == "CAMPAIGN" || this.dealData[i].WiproEventTypeEntityNameValue.toUpperCase() == "EVENT") && ( this.dealData[i].WiproEventDetails== "" || this.dealData[i].WiproEventDetails== undefined || this.dealData[i].WiproEventDetails== null ) ){
                 // this.projectService.displayMessageerror("Enter event details in row "+ loop +".");
                  this.flag= 1;
                  this.dealData[i].isMandatoryEventDetails = true;
                //  break;
                }

                if( this.dealData[i].WiproInfluencingunitValue.toUpperCase() =="MARKETING" && (this.dealData[i].WiproEventTypeEntityNameValue.toUpperCase() =="EVENT" || this.dealData[i].WiproEventTypeEntityNameValue.toUpperCase() =="CAMPAIGN") && this.dealData[i].appendCalled==0 ){
               //   this.projectService.displayMessageerror("Select a value from the search list for Event details in row "+ loop +".");
                  this.flag= 1;
                  this.dealData[i].isMandatoryEventDetails = true;
               //   break;
              }

              if(this.dealData[i].WiproInfluencingunitValue.toUpperCase()== "DELIVERY LED"  && (this.dealData[i].DeliveryLeadNameText== null || this.dealData[i].DeliveryLeadNameText== undefined || this.dealData[i].DeliveryLeadNameText== "" )){
                //this.dealData[i].isMandatoryEventName = false;
             //   this.projectService.displayMessageerror("Select a value from the search list for delivery led in row "+ loop +".");
                this.flag= 1;
                this.dealData[i].isMandatoryDeliveryLed = true;
             //   break;
            }
               // else{
                  if(this.dealData[i].WiproInfluencingunitValue == "Alliance"){

                    if(this.dealData[i].WiproEndorsementTypeValue=="" || this.dealData[i].WiproEndorsementTypeValue== undefined || this.dealData[i].WiproEndorsementTypeValue== null){
                        this.flag= 1;
                        this.dealData[i].isMandatoryEndrosmentType = true;
                 //       this.projectService.displayMessageerror("Select endrosement type in row "+ loop +".");
                  //    break;
                    }
                    if(this.dealData[i].WiproEventTypeEntityNameValue.length >0 && (this.dealData[i].AllianceBdm=="" || this.dealData[i].AllianceBdm== null || this.dealData[i].AllianceBdm== undefined) ){
                      this.flag= 1;
                      this.dealData[i].isMandatoryAllianceBdm = true;
                  //    this.projectService.displayMessageerror("Select alliance BDM in row "+ loop +".");
                  //    break;
                  }
                  
                  for (let x = 0; x < this.dealData.length; x++) {
                    var flag1 = 0;
                    for (let y = x + 1; y < this.dealData.length; y++) {
                      console.log("check val", this.dealData[x].WiproEndorsementTypeValue);
                      if (this.dealData[x].WiproEndorsementTypeValue === this.dealData[y].WiproEndorsementTypeValue && (this.dealData[x].WiproEndorsementTypeValue) && (this.dealData[y].WiproEndorsementTypeValue)) {
                        flag1 = 1;
                        break;
                      }
                    }
                    if (flag1 == 1) {
                      this.flag=1;
                      this.projectService.displayMessageerror("'"+this.dealData[x].WiproEndorsementTypeValue+"'"+" combination already exists for endorsement type. Duplicate entries are not allowed. Please select different combination.");
                      break;
                    }
                  }
                }

                  if( this.dealData[i].WiproEndorsementTypeValue== null || this.dealData[i].WiproEndorsementTypeValue== "" ){
                      delete this.array[i].WiproEndorsementTypeValue;
                      delete this.array[i].WiproEndorsementType;
                  }
                  if( this.dealData[i].AllianceBdm == null || this.dealData[i].AllianceBdm == "" ){
                    delete this.array[i].AllianceBdm;
                    delete this.array[i].AllianceBdmId;
                  }
                  if( this.dealData[i].WiproEventDetails == null || this.dealData[i].WiproEventDetails
                  == "" ){
                    delete this.array[i].WiproEventDetails;
                    delete this.array[i].WiproEventDetailsId;
                }
                if( this.dealData[i].DeliveryLeadNameText == null || this.dealData[i].DeliveryLeadNameText
                  == "" ){
                    delete this.array[i].DeliveryLeadNameText;
                    delete this.array[i].WiproDeliveryName;
                    delete this.array[i].WiproDeliveryId;
                    delete this.array[i].DeliveryLedEmail;
                   // delete this.array[i].WiproDeliveryLEDId;
                   // delete this.array[i].WiproDeliveryLEDIdName;
                  }
                  if(this.dealData[i].WiproInfluencingunitValue.toUpperCase()== "DELIVERY LED" && (this.dealData[i].WiproEventTypeEntityNameValue== null || this.dealData[i].WiproEventTypeEntityNameValue== "") ){
                    delete this.array[i].WiproEventTypeEntityNameValue;
                    delete this.array[i].WiproEventtypeentityName;
                  }

                  delete this.array[i].Id;
                  delete this.array[i].WiproComments;
                  delete this.array[i].OpportunityDealInfluencersId;
                  delete this.array[i].WiproOpportunityId;
                  delete this.array[i].appendCalled;
                  delete this.array[i].apppendForOtherThanMarketing;
                  delete this.array[i].appendCalledDeliveryLed;
                  delete this.array[i].appendCalledAllianceBdm;
                  delete this.array[i].isMandatoryIU;
                  delete this.array[i].isMandatoryEndrosmentType;
                  delete this.array[i].isMandatoryEventDetails;
                  delete this.array[i].isMandatoryEventName;
                  delete this.array[i].isMandatoryDeliveryLed;
                  delete this.array[i].isMandatoryAllianceBdm;

                  delete this.array[i].eventtypeSwitch;
                  delete this.array[i].eventtypeNameSwitch;
                  delete this.array[i].delieveryLedSwitch;
                  delete this.array[i].allianceBdmSwitch;
                  delete this.array[i].WiproDeliveryName;

                  delete this.array[i].OldAllianceBdmId;
                  delete this.array[i].OldWiproDeliveryId;
                  delete this.array[i].OldWiproEventDetailsId;
                  delete this.array[i].OldWiproEventtypeentityName;
                  delete this.array[i].OldWiproInfluencingUnit;

                  delete this.array[i].WiproAccountid;
                  delete this.array[i].WiproServicelineId;
                  delete this.array[i].WiproDeliveryId;
              //  }
                  console.log("arrayOfDeal: ",this.array);
                  console.log("deal ", this.dealData);
              }
             // var arrforData;
              this.duplicateCheck= 0;
              this.breakCheck= 0;
                if(this.flag == 0){
                  //debugger;

                  for( var i= 0;i< this.dealData.length-1; i++ ){

                      for( var j= i+1; j< this.dealData.length; j++ ){
                        
                        if( JSON.stringify(this.array[i]) === JSON.stringify(this.array[j])){
                          this.duplicateCheck= 1;
                          debugger;
                          //arrforData.push(this.dealData);
                          if( (this.dealData[i].WiproEventDetails== "" || this.dealData[i].WiproEventDetails== null || this.dealData[i].WiproEventDetails== undefined ) && (this.dealData[i].WiproEndorsementTypeValue== "" || this.dealData[i].WiproEndorsementTypeValue== null || this.dealData[i].WiproEndorsementTypeValue== undefined) ){
                            this.projectService.displayMessageerror(this.dealData[i].WiproInfluencingunitValue+", "+this.dealData[i].WiproEventTypeEntityNameValue +" combination already exists. Duplicate entries are not allowed. Please select different combination.");
                          }
                          else if( (this.dealData[i].WiproEventDetails!= "" || this.dealData[i].WiproEventDetails!= null || this.dealData[i].WiproEventDetails!= undefined ) && ( this.dealData[i].WiproEndorsementTypeValue == "" || this.dealData[i].WiproEndorsementTypeValue== null || this.dealData[i].WiproEndorsementTypeValue== undefined) ){
                            this.projectService.displayMessageerror(this.dealData[i].WiproInfluencingunitValue+", "+this.dealData[i].WiproEventTypeEntityNameValue+", "+ this.dealData[i].WiproEventDetails+ " combination already exists. Duplicate entries are not allowed. Please select different combination.");
                          }
                          else if( ( this.dealData[i].WiproEventDetails== "" || this.dealData[i].WiproEventDetails== null || this.dealData[i].WiproEventDetails== undefined ) && ( this.dealData[i].WiproEndorsementTypeValue!= "" || this.dealData[i].WiproEndorsementTypeValue!= null || this.dealData[i].WiproEndorsementTypeValue!= undefined ) ){
                            this.projectService.displayMessageerror(this.dealData[i].WiproInfluencingunitValue+", "+this.dealData[i].WiproEventTypeEntityNameValue+", "+ this.dealData[i].WiproEndorsementTypeValue+", "+ this.dealData[i].AllianceBdm+ " combination already exists. Duplicate entries are not allowed. Please select different combination.");
                          }
                          else if( ( this.dealData[i].WiproEventTypeEntityNameValue== "" || this.dealData[i].WiproEventTypeEntityNameValue== null || this.dealData[i].WiproEventTypeEntityNameValue== undefined )  ){
                            this.projectService.displayMessageerror(this.dealData[i].WiproInfluencingunitValue+", "+this.dealData[i].DeliveryLeadNameText+ " combination already exists. Duplicate entries are not allowed. Please select different combination.");
                          }

                          this.breakCheck= 1;
                          break;
                        }

                        if(this.array[i].WiproInfluencingunitValue == "Business Enablement"  ){
 
                        if(this.array[i].WiproInfluencingunitValue == this.array[j].WiproInfluencingunitValue ){
                          this.duplicateCheck= 1;
                            this.projectService.displayMessageerror(this.dealData[i].WiproInfluencingunitValue+", "+this.dealData[i].WiproEventTypeEntityNameValue +" combination already exists. Duplicate entries are not allowed. Please select different combination.");
                          break;
                        }
                      }

                        if(this.array[i].WiproInfluencingunitValue == "PE owned entity"  ){
 
                        if(this.array[i].WiproEventTypeEntityNameValue == this.array[j].WiproEventTypeEntityNameValue ){
                          this.duplicateCheck= 1;
                            this.projectService.displayMessageerror(this.dealData[i].WiproInfluencingunitValue+", "+this.dealData[i].WiproEventTypeEntityNameValue +" combination already exists. Duplicate entries are not allowed. Please select different combination.");
                          break;
                        }
                      }
                       if(this.array[i].WiproInfluencingunitValue == "Analyst"  ){
//  
                        if(this.array[i].WiproEventTypeEntityNameValue == this.array[j].WiproEventTypeEntityNameValue ){
                          this.duplicateCheck= 1;
                            this.projectService.displayMessageerror(this.dealData[i].WiproInfluencingunitValue+", "+this.dealData[i].WiproEventTypeEntityNameValue +" combination already exists. Duplicate entries are not allowed. Please select different combination.");
                          break;
                        }
                      }

                      }
                      if(this.breakCheck== 1){
                        break;
                      }
                  }



                  if( this.duplicateCheck== 0){
                  console.log("Api called: " , this.dealData);

                //  this.saveApiCall(this.dealData);

                  if(this.superCentralMarketingRole == true){
                    if( this.dealData.length > this.getInfluencerLength){
                      this.saveApiCall(this.dealData);
                    }
                  }
                  else{
                    this.saveApiCall(this.dealData);
                  }
                }
              }


       // }
      }

          saveApiCall(dealData){
           if(dealData.length==0){
             this.projectService.displayMessageerror("Please add deal influencer.");
           }
            else{
            this.service.loaderhome= true;

            this.service.saveDeal(dealData).subscribe(res => {
                this.service.loaderhome= false;

                debugger;
             this.saveResponse = res;
            console.log("saveResponse : " , this.saveResponse);

           if(this.saveResponse.IsError == false){
              this.saveResponse = res;

               console.log("saveResponse : " , this.saveResponse.Message);
               if (this.saveResponse.ResponseObject.toUpperCase() == "SUCESS")  {
                console.log(" Records saved ");
                this.getDealInfluencerData();
                this.projectService.displayMessageerror("Data saved successfully.");
              }
            }

            if(this.saveResponse.IsError == true){
              this.projectService.displayMessageerror("Error in saving data. Try after sometime.");
              console.log("Error in saving data: ",this.saveResponse.Message);
            }
           },
             err => {
              this.service.loaderhome= false;
              this.projectService.displayerror(err.status);
             }
           );
        }
}
        allianceSelected= 0;
        deliveryledSelected=0;
     
        influencingUnitChange(data){
          data.businessEnableFlag = false;
         if(data.WiproInfluencingunitValue.toUpperCase() == "BUSINESS ENABLEMENT"){
          data.businessEnableFlag = true;
         } 
          debugger;
          data.isMandatoryIU=false;
          data.isMandatoryEventName= false;
          data.isMandatoryEndrosmentType = false;
          data.isMandatoryEventDetails= false;
          data.isMandatoryDeliveryLed= false;
          data.isMandatoryAllianceBdm= false;
          this.selectedevent= [];

          this.disableEventTypeName= false;
          this.disableEventDetails = true;
          this.disableDeliveryLed = true;
          this.allianceSelected= 0;
          this.deliveryledSelected = 0;
          data.appendCalled= 0;
          console.log(data);
          data.WiproEventTypeEntityNameValue= "";
          data.WiproEventtypeentityName= "";
          data.WiproEndorsementType= "";
          data.WiproEventDetails = "";
          data.WiproEventDetailsId= "";
          data.WiproEndorsementTypeValue= "";
          data.WiproComments = "";
          data.AllianceBdm = "";
          data.AllianceBdmId = "";
          data.WiproDeliveryId = "";
          data.DeliveryLeadNameText = "";
          data.DeliveryLedEmail = "";
          data.WiproDeliveryName= "";

          console.log("data.isMandatoryIU", data.isMandatoryIU)
          if(data.OldAllianceBdmId== null){
            data.OldAllianceBdmId= "";
          }
          if(data.OldWiproDeliveryId == null){
            data.OldWiproDeliveryId= "";
          }
          if(data.OldWiproEventDetailsId == null){
            data.OldWiproEventDetailsId= "";
          }
          if(data.OldWiproEventtypeentityName == null){
            data.OldWiproEventtypeentityName= "";
          }
          if(data.OldWiproInfluencingUnit == null){
            data.OldWiproInfluencingUnit= "";
          }

          if(data.WiproInfluencingunitValue.toUpperCase() != "ALLIANCE"){
              data.WiproEndorsementTypeValue="";
              data.WiproEndorsementType= "";
              data.AllianceBdm = "";
              data.AllianceBdmId = "";
              data.WiproComments = "";
              // data.WiproDeliveryId = "";
              // data.WiproDeliveryName = "";
              this.deliveryledSelected = 2;
              data.WiproDeliveryId = "";
              data.DeliveryLeadNameText = "";
              data.DeliveryLedEmail = "";
              data.WiproDeliveryName= "";


              if(data.WiproInfluencingunitValue.toUpperCase() == "DELIVERY LED"){
                  this.deliveryledSelected = 1;
              }
          }
          else{
            this.allianceSelected= 1;
            this.deliveryledSelected = 2;

            // this.disableAllianceBdm = false;
          }

          for(var i = 0; i< this.influencingUnit.length; i++){
            if(this.influencingUnit[i].Label == data.WiproInfluencingunitValue){
              data.WiproInfluencingUnit= this.influencingUnit[i].Value;
            }
          }

            if(this.superCentralMarketingRole == true){
              debugger;
              if(data.WiproInfluencingunitValue.toUpperCase() != "MARKETING"){
                data.WiproInfluencingunitValue= "";
                data.WiproInfluencingUnit = "";
                this.projectService.displayMessageerror("You can only select Marketing as influencing type.");

              }
            }

           // if(data.WiproInfluencingunitValue.toUpperCase()== "DELIVERY LED"){
          //   this.disableDeliveryLed = false;
          //   this.disableEventTypeName = true;
          // }

          // if( data.WiproInfluencingunitValue.toUpperCase()== "ALLIANCE" ||  data.WiproInfluencingunitValue.toUpperCase()== "ANALYST" ||  data.WiproInfluencingunitValue.toUpperCase()== "PE OWNED ACCOUNTS" || data.WiproInfluencingunitValue.toUpperCase()== "SERVICE LINE" ){
          //   this.disableEventDetails = false;
          // }
          // else{
          //   this.disableEventDetails = true;
          // }


        }

        eventDetailsMandatory = 0;
        eventTypeChange(data){
          console.log(data);
          this.eventDetailsMandatory = 0;
          data.isMandatoryEventName= false;
          data.isMandatoryEventDetails = false;

          data.WiproEventDetails = "";
          data.WiproEventDetailsId= "";
          for(var i = 0; i< this.eventTypeEntityName.length; i++){
            if(this.eventTypeEntityName[i].Label == data.WiproEventTypeEntityNameValue){
              data.WiproEventtypeentityName= this.eventTypeEntityName[i].Value.toString();
            }
          }

          if( data.WiproInfluencingunitValue.toUpperCase()== "MARKETING" && ( data.WiproEventTypeEntityNameValue.toUpperCase()== "EVENT" ||  data.WiproEventTypeEntityNameValue.toUpperCase()== "CAMPAIGN" ) ){
            this.eventDetailsMandatory = 1;
            if(data.WiproEventTypeEntityNameValue.toUpperCase()== "EVENT"){
              this.url = "Deal_Influencer/GetEvents";
            }
            else if(data.WiproEventTypeEntityNameValue.toUpperCase()== "CAMPAIGN"){
              this.url = "Deal_Influencer/GetCampaign";
            }
            this.disableEventDetails = false;
          }
          else{
            debugger;
            if(this.superCentralMarketingRole == true){
                if( data.WiproInfluencingunitValue.toUpperCase()== "MARKETING" && data.WiproEventTypeEntityNameValue.toUpperCase()!= "OTHER MARKETING-ACTIVITIES" ){
                  data.WiproEventTypeEntityNameValue= "";
                  data.WiproEventtypeentityName = "";
                  this.projectService.displayMessageerror("You can only select Other Marketing-Activities as event type/name.");
                }
                else{
            this.disableEventDetails = true;
          }
        }

      }
    }

        endrosementTypeChange(data){
          console.log(data);
          data.isMandatoryEndrosmentType = false;

          for(var i = 0; i< this.endorsementType.length; i++){
            if(this.endorsementType[i].Label == data.WiproEndorsementTypeValue){
              data.WiproEndorsementType= this.endorsementType[i].Value;
            }
          }
        }

         // Advance lookup ************

         selectedLookupData(controlName) {
          console.log("this.selectedevent: ", this.selectedevent);
          switch(controlName) {
            case  'Campaign Event' : {
              return (this.selectedeventtype.length > 0) ? this.selectedeventtype : []
            }
            case  'Alliance Bdm' : {
              return (this.selectedAlliance.length > 0) ? this.selectedAlliance : []
            }
            case  'Delivery lead' : {
              return (this.selectedDeliveryLed.length > 0) ? this.selectedDeliveryLed : []
            }
            case  'Event type' : {
              return (this.selectedevent.length > 0) ? this.selectedevent : []
            }
            case  'Service line' : {
              return (this.selectedevent.length > 0) ? this.selectedevent : []
            }
          }
       }

      IdentifyAppendFunc ={
        'Campaign Event' : (data, rowData )=>{this.appendeventtype(data, rowData)},
        'Alliance Bdm' : (data, rowData )=>{this.appendAllianceBdm(data, rowData)},
        'Delivery lead' : (data, rowData )=>{this.appendDeliveryLed(data, rowData)},
        'Event type' : (data, rowData )=>{this.appendevent(data, rowData)},
        'Service line' : (data, rowData )=>{this.appendevent(data, rowData)},
      }

      // ********advance look up

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
          isLoader:false,
          nextLink: "",
          pageNo:1,
        };

        resp;
        isAccount=true;
        openadvancetabs(controlName, initialLookupData, value, rowData): void {
          debugger;
        
          console.log("this.selectedeventtype: ",this.selectedeventtype);
          console.log("this.selectedeventtype: ",this.selectedAlliance);
        
          console.log("controlName: ", controlName);

         // rowData.WiproEventDetails="";
          this.lookupdata.controlName = controlName;
          this.lookupdata.headerdata = campaignHeaders[controlName];
          this.lookupdata.lookupName= campaignNames[controlName]['name'];
          this.lookupdata.isCheckboxRequired =  campaignNames[controlName]['isCheckbox'];
          this.lookupdata.Isadvancesearchtabs = campaignNames[controlName]['isAccount'];
          // if(controlName!='Event type'){
          //  this.lookupdata.inputValue = value
          // }
       
          if(value == ""){
            this.selectedevent = [];
          }
          if(controlName== "Campaign Event"){

            console.log("rowdata: ",rowData);
            console.log(" this.wiproeventtype: " ,this.wiproeventtype);
            console.log("this.campaignData :",this.campaignData);
            this.resp =  this.service.filterCampaignEvent(this.wiproeventtype);

            if(this.resp.length==1){
               if(rowData.WiproEventDetails.length == this.resp[0].Name.length && rowData.appendCalled ==1){
                
                // this.selectedeventtype.push({'Id':rowData.WiproEventDetailsId});
                //this.lookupdata.inputValue = "";
               }
               else if(rowData.WiproEventDetails.length == this.resp[0].Name.length && rowData.appendCalled ==0){
                // this.selectedeventtype= [];
               }

               if(this.selectedeventtype.length>0){
                this.selectedeventtype[0].Id = rowData.WiproEventDetailsId 
                }
          
            }
            else if ( this.resp.length> 1 ) {

                if(rowData.appendCalled ==0){
                  //  this.selectedeventtype= [];
                }
                else if(rowData.appendCalled ==1){
                  // this.selectedeventtype= [];
                }
                if(this.selectedeventtype.length>0){
                  this.selectedeventtype[0].Id = rowData.WiproEventDetailsId 
                  }
            }

           this.lookupdata.tabledata= this.resp;
            console.log('this.lookupdata.tabledata : ', this.lookupdata.tabledata);
            this.lookupdata.TotalRecordCount =   this.campaignData.TotalRecordCount;
            this.lookupdata.nextLink =  this.campaignData.OdatanextLink;
            console.log('this.lookupdata.TotalRecordCount : ', this.lookupdata.TotalRecordCount);
            console.log('this.lookupdata.nextLink : ', this.lookupdata.nextLink);

              // if(rowData.appendCalled ==1){
              //   this.selectedeventtype= [];
              //   this.lookupdata.inputValue= "";
              //   this.selectedeventtype.push({'Id':rowData.WiproEventDetailsId});
              // }
              // else{
              //   this.lookupdata.inputValue = value;
              //   if(this.selectedeventtype.length >0 ){
              //     delete this.selectedeventtype[0].Id;
              //   }
              // }
            }
            if(controlName== "Alliance Bdm"){

              // if(rowData.apppendForOtherThanMarketing ==1){
              //   this.lookupdata.inputValue= "";
              // }
              // else{
              //   this.lookupdata.inputValue = value;
              // }
              console.log("rowdata: ",rowData);
              console.log(" this.allianceBdmType: " ,this.allianceBdmType);
              console.log("this.allianceBdmData :",this.allianceBdmData);
              this.resp =  this.service.filterAllianceBdm(this.allianceBdmType);

              if(this.resp.length==1){

                 if(rowData.AllianceBdm.length == this.resp[0].Name.length && rowData.appendCalledAllianceBdm ==1){
                 
                  // this.selectedAlliance.push({'Id':rowData.AllianceBdmId});
                  //this.lookupdata.inputValue = "";
                 }
                 else if(rowData.AllianceBdm.length == this.resp[0].Name.length && rowData.appendCalledAllianceBdm ==0){
                  // this.selectedAlliance= [];
                 }
                 if(this.selectedAlliance.length>0){
                  this.selectedAlliance[0].Id = rowData.AllianceBdmId ;
                 }
             
                }
              else if ( this.resp.length> 1 ) {
                  if(rowData.appendCalledAllianceBdm ==0){
                    //  this.selectedAlliance= [];
                  }
                  else if(rowData.appendCalledAllianceBdm ==1){
                    // this.selectedAlliance= [];
                  }
             
                  if(this.selectedAlliance.length>0){
                    this.selectedAlliance[0].Id = rowData.AllianceBdmId ;
                   }
                }

             this.lookupdata.tabledata= this.resp;
              console.log('this.lookupdata.tabledata : ', this.lookupdata.tabledata);
              this.lookupdata.TotalRecordCount =   this.allianceBdmData.TotalRecordCount;
              this.lookupdata.nextLink =  this.allianceBdmData.OdatanextLink;
              console.log('this.lookupdata.TotalRecordCount : ', this.lookupdata.TotalRecordCount);
              console.log('this.lookupdata.nextLink : ', this.lookupdata.nextLink);
            }

            if(controlName== "Delivery lead"){
              // this.selectedAlliance.push({'Id':rowData.allianceBdmId});
             // this.lookupdata.inputValue= "";

             console.log("rowdata: ",rowData);
             console.log(" this.deliverytype: " ,this.deliverytype);
             console.log("this.deliveryLedData :",this.deliveryLedData);
             this.resp =  this.service.filterDeliveryLed(this.deliverytype);

             if(this.resp.length==1){
                if(rowData.DeliveryLeadNameText.length == this.resp[0].Name.length && rowData.appendCalledDeliveryLed ==1){
                 this.selectedDeliveryLed.push({'Id':rowData.WiproDeliveryId});
                 //this.lookupdata.inputValue = "";
                }
                else if(rowData.DeliveryLeadNameText.length == this.resp[0].Name.length && rowData.appendCalledDeliveryLed ==0){
                 this.selectedDeliveryLed= [];
                }
             }
             else if ( this.resp.length> 1 ) {
                 if(rowData.appendCalledDeliveryLed ==0){
                    this.selectedDeliveryLed= [];
                 }
                 else if(rowData.appendCalledDeliveryLed ==1){
                   this.selectedDeliveryLed= [];
                 }
             }

            this.lookupdata.tabledata= this.resp;
             console.log('this.lookupdata.tabledata : ', this.lookupdata.tabledata);
             this.lookupdata.TotalRecordCount =   this.deliveryLedData.TotalRecordCount;
             this.lookupdata.nextLink =  this.deliveryLedData.OdatanextLink;
             console.log('this.lookupdata.TotalRecordCount : ', this.lookupdata.TotalRecordCount);
             console.log('this.lookupdata.nextLink : ', this.lookupdata.nextLink);
            }

            if(controlName== "Event type"  || controlName== "Service line"){
            
             console.log("rowdata: ",rowData);
              console.log("this.deliveryLedData :",this.eventData);
             if(controlName== "Service line"){
              this.resp =  this.service.filterServiceLine(this.wiproevent);
             }
             if(controlName== "Event type"){
              this.resp =  this.service.filterEventType(this.wiproevent);
             }
             console.log("this.resp: ", this.resp);

            if(this.selectedevent.length>0){

            this.selectedevent[0].Id = rowData.WiproEventtypeentityName ;
             
              // this.selectedevent.push({'Id':rowData.WiproEventtypeentityName});

            }
            this.lookupdata.tabledata= this.resp;
             console.log('this.lookupdata.tabledata : ', this.lookupdata.tabledata);
             this.lookupdata.TotalRecordCount =   this.eventData.TotalRecordCount;
             this.lookupdata.nextLink =  this.eventData.OdatanextLink;
             console.log('this.lookupdata.TotalRecordCount : ', this.lookupdata.TotalRecordCount);
             console.log('this.lookupdata.nextLink : ', this.lookupdata.nextLink);
            }


          this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName );
          console.log("this.lookupdata.selectedRecord: ", this.lookupdata.selectedRecord);
            debugger;
        //  this.service.getLookUpFilterData({ data:initialLookupData , controlName: controlName, isService: false, useFullData: null , url: this.url, sysGuid: rowData.WiproEventtypeentityName}).subscribe(res => {
        //    debugger;
        //    this.lookupdata.tabledata = res;
        //    //rowData.appendCalled= 0;
        //    //this.lookupdata.TotalRecordCount =  res.TotalRecordCount;
        //    console.log("Table Data: ",this.lookupdata.tabledata);

        //  })

          const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
            width: this.service.setHeaderPixes(this.lookupdata.headerdata.length,this.lookupdata.Isadvancesearchtabs),
            data:this.lookupdata,
            disableClose: true
          });

          // dialogRef.componentInstance.modelEmiter.subscribe((x) => {
          //   console.log(x);
          //   let dialogData = {
          //     searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
          //     recordCount: this.lookupdata.recordCount,
          //     OdatanextLink: this.lookupdata.nextLink,// need to handel the pagination and search!
          //     pageNo: x.currentPage//need to handel from pagination
          //   }

          //   this.service.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: {...dialogData } , url: this.url}).subscribe(res => {
          //     debugger;
          //     console.log(res, "res:");
          //     this.lookupdata.isLoader=false;
          //     this.lookupdata.nextLink = res.OdatanextLink;
          //     this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          //     if(x.action=="loadMore")
          //     {
          //       this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
          //     }
          //     else
          //     {
          //       this.lookupdata.tabledata = res.ResponseObject;
          //     }

          //   })

          // });


          dialogRef.componentInstance.modelEmiter.subscribe((x) => {

            debugger
            console.log(x)
            if(x.action=='loadMore'){

                  let dialogData = {
                      searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
                    //  recordCount: this.lookupdata.recordCount,
                    recordCount: 10,
                      OdatanextLink: this.lookupdata.nextLink,// need to handel the pagination and search!
                    // pageNo: this.lookupdata.pageNo//+1//need to handel from pagination
                      pageNo:  x.currentPage
                  }

            this.service.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...dialogData },  url: this.url, sysGuid: rowData.WiproEventtypeentityName, rowData: rowData , userId: this.userId , sbuId: this.sbuId}).subscribe(res => {
  
              this.lookupdata.isLoader=false;
                  this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
                  this.lookupdata.pageNo = res.CurrentPageNumber;
                  this.lookupdata.nextLink = res.OdatanextLink
                //  this.lookupdata.recordCount = res.PageSize
                 this.lookupdata.TotalRecordCount = res.TotalRecordCount

            })

            }else if(x.action=='search'){

                  this.lookupdata.tabledata = []
                  this.lookupdata.nextLink =''
                  this.lookupdata.pageNo = 1

                  let dialogData = {
                  searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
                  recordCount: this.lookupdata.recordCount,
                  OdatanextLink: this.lookupdata.nextLink,// need to handel the pagination and search!
                 // pageNo: this.lookupdata.pageNo//+1//need to handel from pagination
                  //pageNo: this.lookupdata.pageNo
                  pageNo:  x.currentPage
                 // RequestedPageNumber:
                }

                this.service.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...dialogData } , url: this.url, sysGuid: rowData.WiproEventtypeentityName, rowData: rowData, userId: this.userId, sbuId: this.sbuId }).subscribe(res => {
                  this.lookupdata.isLoader=false;
                  console.log(res);
                  console.log(res.ResponseObject);
                      this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
                      this.lookupdata.pageNo = res.CurrentPageNumber;
                      this.lookupdata.nextLink = res.OdatanextLink
                     // this.lookupdata.recordCount = res.PageSize
                      this.lookupdata.TotalRecordCount = res.TotalRecordCount
                    })
                  }
            });

          dialogRef.afterClosed().subscribe(result => {
            debugger
            if (result) {
              console.log(result)
              this.AppendParticularInputFun(result.selectedData,result.controlName, rowData)
            }
          });

        }

        AppendParticularInputFun(selectedData,controlName, rowData) {
          debugger;
          console.log(selectedData);
          switch(controlName) {
            case  'Campaign Event' : {this.wiproeventtype = []}

            case  'Alliance Bdm' : {this.selectedAlliance = []}
            case  'Delivery lead' : {this.selectedDeliveryLed = []}
            case  'Event type' : {this.selectedevent = []}
            case  'Service line' : {this.selectedevent = []}
          }

          if(selectedData){
            if(selectedData.length>0){
              console.log(selectedData);
              selectedData.forEach(( data) => {
                this.IdentifyAppendFunc[controlName](data,rowData)
              });
            }
          }
        }

        // LeadGuid : any;
        // getCommonData() {
        //   return {
        //     // guid: this.accountDetails.SysGuid,
        //     // isProspect: this.accountDetails.isProspect,
        //   }
        // }
//************************************** */
}
@Component({
  selector: 'deleteLineItem',
  templateUrl: './deleteLineItem-popup.html',
})
export class deleteLineItem {

  constructor(public dialog:MatDialog,public dialogRef: MatDialogRef<deleteLineItem>,
    @Inject(MAT_DIALOG_DATA) public data:any, private opportunityService : OpportunitiesService) {
     }

  displayMsg(){
    this.dialogRef.close("yes");
  }

}
