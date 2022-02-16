import { Component, OnInit } from '@angular/core';
import { DataCommunicationService } from '@app/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/';
import { Router } from '@angular/router';
import { OpportunitiesService } from '@app/core';

@Component({
  selector: 'app-ip-additional-details',
  templateUrl: './ip-additional-details.component.html',
  styleUrls: ['./ip-additional-details.component.scss']
})
export class IpAdditionalDetailsComponent implements OnInit {
  Competitortab = true;
  Teambuildingtab = false;
  wiproDatabsebtn: boolean;
  dDatabasebtn: boolean;
  ipCloud_data: any = [];
  additionalIpData: any = [];
  serviceProvider: any = [];
  cloudDetailsIp: any = [];
  additionalIpDataForTable: any = {};
  cloudTCV = 0;
  ipObj:any={}
  userAccessAPI:any={}
  disableUserAccessIP:boolean=true;
  fullAccessSessionCheck:boolean=false;
  showSaveButton:boolean=false;
  FunctionList: any = [];
  CategoryList: any = [];
  ServiceProviderList: any = [];
  TechnologyList: any = [];
  opportunityName;
  finalTCVValue;
  IPTCV;

  // table_data[];


  constructor(public dialog: MatDialog, public service: DataCommunicationService, public projectService: OpportunitiesService) {
  }

  table_data = [
    { first_data: "IP", second_data: "" },
    { first_data: "Module", second_data: "" },
    { first_data: "TCV ($)", second_data: "" },
    { first_data: "IP TCV ($)", second_data: "" },
    { first_data: "Est license value($)", second_data: "" },
    { first_data: "Est AMC Value ($)", second_data: "" },
    { first_data: "Owner", second_data: "" },
    { first_data: "Module contact", second_data: "" }
  ]

  ngOnInit() {
    this.opportunityName = this.projectService.getSession('opportunityName');
    this.ipObj=this.projectService.getSession('IPObjForCloud')
    console.log("this.ipObj",this.ipObj)
    let IPtcvValue=this.ipObj.OverAllTCV;
    this.IPTCV=IPtcvValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    this.dDatabasebtn = false;
    this.wiproDatabsebtn = true;
    this.additionalIpData = {
      "WiproImplementationValue": "",
      "WiproImplementationComments": "",
      "WiproCustomizationValue": "",
      "WiprocustomizationComments": "",
      "WiproProfessionalServicesValue": "",
      "WiproProfessionaServicesComments": "",
      "WiproadditionalValueOfTCV": false,
      "WiproadditionalSolutionValue": "",
      "WiproAbsolutevalue": "",
      "AdditionalDetailsID": "",
      "OpportunityipId":this.ipObj.Details.WiproOpportunityIpId,
    }
    
    console.log("this.ipObj",this.ipObj)
    let obj = {
      "Guid": this.ipObj.Details.WiproOpportunityIpId

    }
    this.projectService.getAdditionalIpDetails(obj).subscribe(detailsIP => {
      debugger;
      if(!detailsIP.IsError){
      this.additionalIpDataForTable = detailsIP.ResponseObject ? detailsIP.ResponseObject : {};
      if (this.additionalIpDataForTable && typeof this.additionalIpDataForTable === 'object' && Object.keys(this.additionalIpDataForTable).length ){
      let additionalIpObj = detailsIP.ResponseObject.IpAdditiondetails[0] ? detailsIP.ResponseObject.IpAdditiondetails[0] : {};
      this.additionalIpData = { ...this.additionalIpData, ...additionalIpObj };
      console.log("this.additionalIpData", this.additionalIpData)
      this.table_data[0].second_data = this.additionalIpDataForTable.Ip;
      this.table_data[1].second_data = this.additionalIpDataForTable.Module;
      this.table_data[2].second_data = this.additionalIpData.TCV;
      this.table_data[3].second_data = this.additionalIpDataForTable.IPTCV;
      this.table_data[4].second_data = this.additionalIpDataForTable.EstLicenceValue;
      this.table_data[5].second_data = this.additionalIpDataForTable.EstAmcValue;
      this.table_data[6].second_data = this.additionalIpDataForTable.OwnerName;
      this.table_data[7].second_data = this.additionalIpDataForTable.ModuleContact;
    }
    else{
      this.projectService.displayMessageerror(detailsIP.Message)
    }
    }
    else{
      this.projectService.displayMessageerror(detailsIP.Message);
    }
  },      
  err => {
     this.projectService.displayerror(err.status);
  })
    this.userAccessAPI=this.projectService.getSession('accessData') || {}
    this.fullAccessSessionCheck=this.projectService.getSession('FullAccess') || false;
    if(this.userAccessAPI.FullAccess || this.userAccessAPI.PartialAccess || this.fullAccessSessionCheck){
      this.disableUserAccessIP=false;
      this.showSaveButton=true;
    }
      //Drop Down API call
    this.projectService.getFunction().subscribe(FunctionData => {
      if (!FunctionData.IsError){
      this.FunctionList = FunctionData.ResponseObject;
    }
    else{
      this.projectService.displayMessageerror(FunctionData.Message);
    }
    },
          err => {
     this.projectService.displayerror(err.status);
  })


    this.projectService.getCategory().subscribe(CategoryData => {
      if (!CategoryData.IsError){
      this.CategoryList = CategoryData.ResponseObject;
    }
    else{
      this.projectService.displayMessageerror(CategoryData.Message);
    }
    },
           err => {
     this.projectService.displayerror(err.status);
  })


    this.projectService.getServiceProvider().subscribe(ServiceProviderData => {
      if (!ServiceProviderData.IsError){
      this.ServiceProviderList = ServiceProviderData.ResponseObject;
    }
    else{
      this.projectService.displayMessageerror(ServiceProviderData.Message);
    }

    },
           err => {
     this.projectService.displayerror(err.status);
  })
    this.projectService.getTechnology().subscribe(TechnologyData => {
      if (!TechnologyData.IsError){
      this.TechnologyList = TechnologyData.ResponseObject;
    }
    else{
      this.projectService.displayMessageerror(TechnologyData.Message);
    }

    },
           err => {
     this.projectService.displayerror(err.status);
  })
  }

  goBack() {
    window.history.back();
  }
  callSaveMethod() {
    if (this.wiproDatabsebtn == true) {
      debugger;
      this.additionalIpData.AdditionalDetailsID=this.additionalIpData.WiproOpportunityIpAdditionaInfoid;
      this.additionalIpData.OpportunityipId=this.ipObj.Details.WiproOpportunityIpId;
      //callipsavemethod
      this.projectService.saveAdditionalIpDetails(this.additionalIpData).subscribe(res => {
        console.log("saveresIP", res)
        if (res.IsError == false) {
          this.projectService.displayMessageerror("Data saved successfully!")
          this.ngOnInit();
        }
        else{
          this.projectService.displayMessageerror("Error! Unable to save data")
        }
      },
           err => {
     this.projectService.displayerror(err.status);
  }
      )
    }
    else {
      debugger;
      let modifiedDataforSave = this.ipCloud_data.filter(x => x.modifiedData == true)
      let isValid = this.ipCloud_data.filter(x => x.isValid == true)
      if (modifiedDataforSave.length == isValid.length) {
        let saveIpObject = modifiedDataforSave.map(data => {
          return {
            "Category": data.WiproCategory,
            "Function": data.WiproFunction,
            "IsOpenSource": data.WiproOpenSource != "" ? data.WiproOpenSource : false,
            "Opportunityipidodata": this.ipObj.Details.WiproOpportunityIpId,
            "Remarks": data.WiproRemarks,
            "ServiceProvider": data.WiproServiceProvider,
            "Technology": data.WiproTechnology,
            "Value": data.WiproValue,
            "CloudDetailsId": data.WiproOpportunityCloudDetailid ? data.WiproOpportunityCloudDetailid : ""
          }
        })
        //callipcloudsavemethod
        this.projectService.saveIpCloudDetails(saveIpObject).subscribe(res => {
          console.log("saveresIP", res)
          if (res.IsError == false) {
            this.projectService.displayMessageerror("Data saved successfully!!")
            this.getCloudValue();
          }
          else{
            this.projectService.displayMessageerror("Error! Unable to save data")
          }
        },
                err => {
     this.projectService.displayerror(err.status);
  })
      }
      else {
        this.projectService.displayMessageerror("Please fill the mandatory fields");
      }
    }
  }
  tabone() {
    this.Competitortab = true;
    this.Teambuildingtab = false;
  }
  tabtwo() {
    this.Competitortab = false;
    this.Teambuildingtab = true;
  }

  additionalInfo() {
    this.wiproDatabsebtn = true;
    this.dDatabasebtn = false;
     if(this.userAccessAPI.FullAccess || this.userAccessAPI.PartialAccess || this.fullAccessSessionCheck){
      this.disableUserAccessIP=false;
      this.showSaveButton=true;
    }
  }
  getCloudValue() {
     if(this.userAccessAPI.FullAccess || this.userAccessAPI.PartialAccess || this.fullAccessSessionCheck){
      this.disableUserAccessIP=false;
      this.showSaveButton=true;
    }
    this.dDatabasebtn = true;
    this.wiproDatabsebtn = false;
    let obj = {
      "Guid": this.ipObj.Details.WiproOpportunityIpId
    }
    this.projectService.getCloudDetailsIp(obj).subscribe(cloudData => {
      console.log("cloudData", cloudData.ResponseObject)
      this.ipCloud_data=[];
      if (!cloudData.IsError){
      if (cloudData.ResponseObject) {
        this.ipCloud_data = cloudData.ResponseObject;
      }
      console.log("this.ipCloud_data", this.ipCloud_data)
      this.ipCloud_data.unshift(
        {
          createNew: true,
          WiproCategory: "",
          WiproFunction: "",
          WiproOpenSource: "",
          WiproRemarks: "",
          WiproServiceProvider: "",
          WiproTechnology: "",
          WiproValue: "",
          modifiedData: false,
          WiproOpportunityCloudDetailid: ""
        }
      )


  this.calculateCloudValue();
    }
    else{
      this.projectService.displayMessageerror(cloudData.Message);
    }
    
    },
         err => {
     this.projectService.displayerror(err.status);
  })
  }

calculateCloudValue(){
  this.cloudTCV = 0;
  this.finalTCVValue=0;
  for(let i=0;i<this.ipCloud_data.length;i++){
        const tcvValue = Number(this.ipCloud_data[i].WiproValue);
        if(tcvValue){
          this.cloudTCV += tcvValue;
          this.finalTCVValue=this.cloudTCV.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
        }
      }
}

  addIpCloud() {
    this.ipCloud_data.unshift(
      {
        createNew: true,
        WiproCategory: "",
        WiproFunction: "",
        WiproOpenSource: "",
        WiproRemarks: "",
        WiproServiceProvider: "",
        WiproTechnology: "",
        WiproValue: "",
        modifiedData: false
      }
    )
  }

  deleteIpCloudRecord(index) {
    debugger;
    let data = this.ipCloud_data[index];
    if (data.createNew) {
      // delete the row from ui since the condition states this is newly created data
      this.ipCloud_data.splice(index, 1)
      this.projectService.displayMessageerror("Data deleted successfully!!")
      this.calculateCloudValue()
    } else {
      // the data needs to deleted through api since the same is fetched from server
      let obj = {
        "SearchText": "cloud",
        "Guid": this.ipCloud_data[index].WiproOpportunityCloudDetailid

      }
      this.projectService.deleteIpAdditionDetails(obj).subscribe(res => {
        if (res.IsError==false) {
          this.projectService.displayMessageerror("Data deleted successfully!!")
          this.getCloudValue()
        }
        else{
          this.projectService.displayMessageerror("Unable to delete data please try again")
        }
      },
             err => {
     this.projectService.displayerror(err.status);
  })
    }
  }

  confirmdelete(index) {

    const dialogRef = this.dialog.open(OpenipDeletecomponent,
      {
        width: '350px'
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.deleteIpCloudRecord(index)
      }
    })
  }

  ipadditionaldelete() {
    debugger;
    const dialogRef = this.dialog.open(additionalipDeletecomponent,
      {
        width: '350px'
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        if (this.additionalIpData.WiproOpportunityIpAdditionaInfoid) {
          let obj = {
            "SearchText": "additionalip",
            "Guid": this.additionalIpData.WiproOpportunityIpAdditionaInfoid
          }
          this.projectService.deleteIpAdditionDetails(obj).subscribe(res => {
            if (res.IsError == false) {
              this.projectService.displayMessageerror("Data deleted successfully")
              this.ngOnInit()
            }
            else{
               this.projectService.displayMessageerror("Unable to delete data please try again")
            }
          },
     err => {
     this.projectService.displayerror(err.status);
  })
        }
        else{
        this.ngOnInit()
        }
      }
    })
  }
  updateIpAdditionalDetails(e, keyName) {
    debugger;
    this.additionalIpData[keyName] = e.target ? e.target.value : e.checked;
    console.log("this.additionalIpData", this.additionalIpData)
  }

  updateCloudValue(index, e, keyName) {
    debugger;
    if(keyName == 'WiproValue') {
      let slTcv=Number(this.ipObj.OverAllTCV);
      if(!slTcv){
       this.ipCloud_data[index][keyName] = "";
       this.projectService.displayMessageerror("Cloud TCV value cannot be greater than SL TCV value")
        this.ipCloud_data[index].modifiedData = true;
        this.ipCloud_data[index].isValid = this.validateMandatoryFields(this.ipCloud_data[index]);
          return;
      }
      console.log("value",e.target.value)
        let num=this.cloudTCV + Number(e.target.value)
        if(slTcv < num  ) {
           this.ipCloud_data[index][keyName] = "";
           this.projectService.displayMessageerror("Cloud TCV value cannot be greater than SL TCV value")
           this.calculateCloudValue(); 
           this.ipCloud_data[index].modifiedData = true;
           this.ipCloud_data[index].isValid = this.validateMandatoryFields(this.ipCloud_data[index]);
          return;
        };
      
      this.ipCloud_data[index][keyName] = e.target.value;
      this.calculateCloudValue(); 
    }
    let data = this.ipCloud_data[index];
    this.ipCloud_data[index][keyName] = e.target ? e.target.value : e.checked;
    this.ipCloud_data[index].modifiedData = true;
    this.ipCloud_data[index].isValid = this.validateMandatoryFields(this.ipCloud_data[index]);;
   
  }

  validateMandatoryFields(data) {
    debugger;
    let validData = true;
    let mandatoryFields = [
      "WiproCategory", "WiproFunction", "WiproServiceProvider",
      "WiproTechnology", "WiproValue"];
    if (data.WiproOpenSource) {
      validData = data.WiproRemarks ? true : false;
    }

    if (validData) {
      for (let i = 0; i < mandatoryFields.length; i++) {
        if (!data[mandatoryFields[i]]) {
          validData = false;
          break;
        }
      }
    }

    return validData;
  }
}



@Component({
  selector: 'deletepopup',
  templateUrl: './delete-popup.html',
})

export class OpenipDeletecomponent {
  constructor(public router: Router, public dialogRef: MatDialogRef<OpenipDeletecomponent>, public dialog: MatDialog,
  ) {

  }
  ngOnInit() {
  }
  onNoClick() {
    this.dialogRef.close(true);
  }
}

@Component({
  selector: 'delete-ip-popup',
  templateUrl: './delete-Ip-additional.html',
})

export class additionalipDeletecomponent {
  constructor(public router: Router, public dialogRef: MatDialogRef<additionalipDeletecomponent>, public dialog: MatDialog,
  ) {

  }
  ngOnInit() {
  }
  onNoClick() {
    this.dialogRef.close(true);
  }
}