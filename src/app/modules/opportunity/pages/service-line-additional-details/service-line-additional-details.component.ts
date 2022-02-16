
import { Component, OnInit } from '@angular/core';
import { DataCommunicationService } from '@app/core';
import { OpportunitiesService } from '@app/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/';
import { OpenipDeletecomponent } from '../ip-additional-details/ip-additional-details.component';
import { EncrDecrService } from '@app/core/services/encr-decr.service';



@Component({
  selector: 'app-service-line-additional-details',
  templateUrl: './service-line-additional-details.component.html',
  styleUrls: ['./service-line-additional-details.component.scss']
})
export class ServiceLineAdditionalDetailsComponent implements OnInit {
  Competitortab = true;
  Teambuildingtab = false;
  wiproDatabsebtn: boolean;
  dDatabasebtn: boolean;
  additionServicelineDetails: any = {};
  serviceLineCloud_data: any = [];
  serviceProvider: any = [];
  Sltcvinput;
  cloudTCV = 0;
  finalTCVValue;
  SLTCV;
  serviceLineObj: any = {};
  saveServiceLineInput: any = [{
    "OppServiceLineId": "",
    "SLTCVInput": ""
  }];
  disableAccessPermission: boolean = true
  disableAccessPermissionCloud: boolean = true
  userAccessRightsFromAPI: any = {}
  slbdmOwnerCheck: boolean = false;
  isTeamBuilderUser: boolean = false;
  fullAccessSessionCheck: boolean = false;
  showSaveButton: boolean = false;
  slbdmId;
  userGuid;
  FunctionList: any = [];
  CategoryList: any = [];
  ServiceProviderList: any = [];
  TechnologyList: any = [];
  opportunityName;

  
  
  constructor(public service: DataCommunicationService, private EncrDecr: EncrDecrService, public projectService: OpportunitiesService, public dialog: MatDialog) {   
  }

  ngOnInit() {
    debugger;
    this.opportunityName = this.projectService.getSession('opportunityName');
    this.dDatabasebtn = false;
    this.wiproDatabsebtn = true;
  this.serviceLineObj = this.projectService.getSession('SLObjForCloud');
    console.log("this.serviceLineObj", this.serviceLineObj)
    let sltcvValue=this.serviceLineObj.OverAllTCV;
    this.SLTCV=sltcvValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    let obj = {
      "Guid": this.serviceLineObj.Details.WiproOpportunityServicelineDetailId
    }
    this.projectService.getAdditionalSolutionDetails(obj).subscribe(solutionData => {
      if (!solutionData.IsError){
      this.additionServicelineDetails = solutionData.ResponseObject ? solutionData.ResponseObject : {};
      this.Sltcvinput = solutionData.ResponseObject.ServiceLineAdditionalDtls.length > 0 ? solutionData.ResponseObject.ServiceLineAdditionalDtls[0].WiproSltcvinput : "";
    }
    else{
      this.projectService.displayMessageerror(solutionData.Message);
    }
    },
           err => {
     this.projectService.displayerror(err.status);
  }
    )
    this.slbdmId = this.serviceLineObj.Details.WiproServicelineidValue;
    this.userGuid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
    if (this.slbdmId == this.userGuid) {
      this.slbdmOwnerCheck = true;
      this.disableAccessPermission = false;
        this.showSaveButton = true;
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
   saveAdditionalSolutionDetails() {
    debugger;
    if (this.wiproDatabsebtn == true) {
      this.projectService.saveServiceLineDetail(this.saveServiceLineInput).subscribe(serviceLineData => {
        if (serviceLineData.IsError == false) {
          this.projectService.displayMessageerror("Data saved successfully!!")
          this.ngOnInit();
        }
        else {
          this.projectService.displayMessageerror("Error in saving Data")
        }
      },
             err => {
     this.projectService.displayerror(err.status);
  })
    }
     else {
      let modifiedDataforSave = this.serviceLineCloud_data.filter(x => x.modifiedData == true)
      let isValid = this.serviceLineCloud_data.filter(x => x.isValid == true)
      if (modifiedDataforSave.length == isValid.length) {
        let saveIpObject = modifiedDataforSave.map(data => {
          return {
            "Category": data.WiproCategory,
            "Function": data.WiproFunction,
            "IsOpenSource": data.WiproOpensource != "" ? data.WiproOpensource : false,
            "Opportunityipidodata": null,
            "OppServiceLineId": this.serviceLineObj.Details.WiproOpportunityServicelineDetailId,
            "Remarks": data.WiproRemarks,
            "ServiceProvider": data.WiproServiceprovider,
            "Technology": data.WiproTechnology,
            "Value": data.WiproValue,
             "CloudDetailsId": data.WiproOpportunityCloudDetailid ? data.WiproOpportunityCloudDetailid : ""
          }
        })
        //callipcloudsavemethod
        this.projectService.saveIpCloudDetails(saveIpObject).subscribe(res => {
           if (res.IsError == false) {
             this.projectService.displayMessageerror("Data saved successfully!!")
          this.getCloudValue();
        }
        else {
          this.projectService.displayMessageerror("Error in saving Data")
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
calculateCloudValue(disableShow) {
  debugger;
  this.cloudTCV = 0;
  this.finalTCVValue=0;
  for (let i = 0; i < this.serviceLineCloud_data.length; i++) {
      const tcvValue = Number(this.serviceLineCloud_data[i].WiproValue);
      if (tcvValue) {
        this.cloudTCV += tcvValue;
      }
    }
    //  this.cloudTCV = parseFloat(this.cloudTCV).toFixed(2);
    if(!disableShow){
    this.finalTCVValue=this.cloudTCV.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
  goBack() {
    window.history.back();
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
    this.showSaveButton = false;
    this.wiproDatabsebtn = true;
    this.dDatabasebtn = false;
    if (this.slbdmId == this.userGuid) {
      this.showSaveButton = true;
    }
  }
 getCloudValue() {
    this.dDatabasebtn = true;
    this.wiproDatabsebtn = false;
    this.userAccessRightsFromAPI = this.projectService.getSession('accessData') || {}
    this.fullAccessSessionCheck = this.projectService.getSession('FullAccess') || false;
    console.log("this.userAccessRightsFromAPI", this.userAccessRightsFromAPI)
    if (this.userAccessRightsFromAPI.PartialAccess && this.userAccessRightsFromAPI.IsTeamBuilderSection) {
      this.isTeamBuilderUser = true;
    }
    if (this.userAccessRightsFromAPI.FullAccess || this.slbdmOwnerCheck || this.isTeamBuilderUser || this.fullAccessSessionCheck) {
      this.disableAccessPermissionCloud = false;
      this.showSaveButton = true;
    }
    let obj = {
      "Guid": this.serviceLineObj.Details.WiproOpportunityServicelineDetailId
    }
    this.projectService.getServiceLineCloud(obj).subscribe(cloudData => {
      if (!cloudData.IsError){
      if (cloudData.ResponseObject) {
        this.serviceLineCloud_data = cloudData.ResponseObject;
      }
    this.serviceLineCloud_data.unshift(
        {
          createNew: true,
          WiproCategory: "",
          WiproFunction: "",
          WiproOpensource: "",
          WiproRemarks: "",
          WiproServiceprovider: "",
          WiproTechnology: "",
          WiproValue: "",
          modifiedData: false,
          WiproOpportunityCloudDetailid: ""
        }
      )
this.calculateCloudValue(false);
    }
    else{
      this.projectService.displayMessageerror(cloudData.Message);
    }
},
       err => {
     this.projectService.displayerror(err.status);
  })
  }
ngOnDestroy() {
  // this.projectService.clearSession('SLObjForCloud')
}
 deleteServiceLineCloudRecord(index) {
       let data = this.serviceLineCloud_data[index];
    if (data.createNew) {
      // delete the row from ui since the condition states this is newly created data
      this.serviceLineCloud_data.splice(index, 1)
      this.calculateCloudValue(false)
      this.projectService.displayMessageerror("Data deleted successfully!!")
    } else {
      // the data needs to deleted through api since the same is fetched from server
        let obj = {
          "SearchText": "cloud",
          "Guid": this.serviceLineCloud_data[index].WiproOpportunityCloudDetailid

        }
        this.projectService.deleteIpAdditionDetails(obj).subscribe(res => {
          if (res.IsError == false) {
            this.projectService.displayMessageerror("Data deleted successfully!!")
            this.getCloudValue()
          }
          else{
            this.projectService.displayMessageerror("Unable to delete data please try again");
          }
        },
               err => {
     this.projectService.displayerror(err.status);
  })
    }
 }
  updateServiceLineData(e) {
    this.Sltcvinput = e.target ? e.target.value : "";
    this.saveServiceLineInput[0].SLTCVInput = this.Sltcvinput;
    this.saveServiceLineInput[0].OppServiceLineId = this.serviceLineObj.Details.WiproOpportunityServicelineDetailId

  }
    checkDecimalValue(data,index,keyName){
    debugger;
    // return event.charCode >= 46
    //        && event.charCode <= 57
  // let num=Number(data)
  // let num1=this.decimalPipe.transform(num, '1.0-2');
  // data=num1;
  //let valueCheck=String(data).match(/^[0-9]+(\.[0-9]*){0,1}$/g)
  if(data){
    let updatedValue = data.toString().split('.');
    if(updatedValue.length > 2){
      data = '';
    } else if(updatedValue[1]){
      let decimalValue = updatedValue[1].substring(0, 2);
      data = `${updatedValue[0]}.${decimalValue}`;
      if(decimalValue.length > 1){
        return parseFloat(data).toFixed(2);
      }
    } else if(updatedValue.length > 1){
      data = `${updatedValue[0]}.`;
      return data;
    }
    return data;
  }
return '';
  //let wiproValue: any = String(data).match(/^[0-9]+(\.[0-9]*){0,1}$/g);
  //this.serviceLineCloud_data[index][keyName] =parseFloat(data).toFixed(2).toString();
  //this.updateCloudValue(index,e,'WiproValue')
  }
 updateCloudValue(index, e, keyName) {
      debugger;
       let updatedValue
      if(e.target){
        updatedValue= JSON.parse(JSON.stringify(e.target.value));
      } else {
        updatedValue= e.checked;
      }
    if(keyName == 'WiproValue') {
      let slTcv=Number(this.serviceLineObj.OverAllTCV);
      if(!slTcv){
       this.serviceLineCloud_data[index][keyName] = "";
       this.projectService.displayMessageerror("Cloud TCV value cannot be greater than SL TCV value")
        this.serviceLineCloud_data[index].modifiedData = true;
        this.serviceLineCloud_data[index].isValid = this.validateMandatoryFields(this.serviceLineCloud_data[index]);
          return;
      }
       this.calculateCloudValue(true); 
        if(slTcv < this.cloudTCV  ) {
           this.serviceLineCloud_data[index][keyName] = "";
           this.projectService.displayMessageerror("Cloud TCV value cannot be greater than SL TCV value")
           this.calculateCloudValue(false); 
           this.serviceLineCloud_data[index].modifiedData = true;
           this.serviceLineCloud_data[index].isValid = this.validateMandatoryFields(this.serviceLineCloud_data[index]);
          return;
        };
      
      this.serviceLineCloud_data[index][keyName] = updatedValue;
      this.calculateCloudValue(false); 
    }
    let data = this.serviceLineCloud_data[index];
    this.serviceLineCloud_data[index][keyName] = updatedValue;
    this.serviceLineCloud_data[index].modifiedData = true;
    this.serviceLineCloud_data[index].isValid = this.validateMandatoryFields(this.serviceLineCloud_data[index]);
  }
   validateMandatoryFields(data) {
    let validData = true;
    let mandatoryFields = [
      "WiproCategory", "WiproFunction", "WiproServiceprovider",
      "WiproTechnology", "WiproValue"];
    if (data.WiproOpensource) {
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
    addServiceLineCloud() {
    this.serviceLineCloud_data.unshift(
      {
        createNew: true,
        WiproCategory: "",
        WiproFunction: "",
        WiproOpensource: "",
        WiproRemarks: "",
        WiproServiceprovider: "",
        WiproTechnology: "",
        WiproValue: "",
        modifiedData: false
      }
    )
  }
   confirmdelete(index) {

    const dialogRef = this.dialog.open(OpenipDeletecomponent,
      {
        width: '350px'
      });
      dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.deleteServiceLineCloudRecord(index)
      }
      })
  }


}