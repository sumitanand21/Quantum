import { AccountSapUploadComponent } from './../../../../../modules/account/pages/account-details/modals/account-sap-upload/account-sap-upload.component';
import { Component, OnInit, Inject, EventEmitter,HostListener, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material/';
import { DataCommunicationService } from '@app/core/services/global.service';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams, HttpBackend } from '@angular/common/http';
import { Router } from '@angular/router';
import { OpportunitiesService, CommitmentRegisterService,opportunityAdvnNames,opportunityAdvnHeaders} from '@app/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, UploadStatus } from 'ngx-uploader';
import { uploadPopup } from '@app/modules/opportunity/pages/commitment-register-details/commitment-register-details.component';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { FileUploadService } from '@app/core/services/file-upload.service';
@Component({
  selector: 'app-sap-popup',
  templateUrl: './sap-popup.component.html',
  styleUrls: ['./sap-popup.component.scss']
})
export class SapPopupComponent implements OnInit {
  selectedAdvisorName = [];
  selectedAdvisorOwnerObj = {};
  advisorOwner: any;
  companyentity = "";
  entityArray:any=[];
  isLoading;

  table_data = [{
    'label': 'Account name',
    'text': 'TSSC support and system sol',
  },
  {
    'label': 'Account number',
    'text': 'ACC0000123479',
  },
  {
    'label': 'Geography',
    'text': 'ZEUR',
  },
  {
    'label': 'Vertical',
    'text': 'Consumer goods',
  },
  {
    'label': 'Currency',
    'text': 'USD Dollar',
  },
  {
    'label': 'Account owner',
    'text': 'Sahil chaturvedy',
  },
  {
    'label': 'Address',
    'text': '26th Street, stweartﬁeld, Road',
  },
  {
    'label': 'Opportunity won',
    'text': 'No',
  }];

  AccountDetails: any = {
    "AccountNumber": "NA",
    "Name": "NA",
    "OwnerName": "NA",
    "TransactionCurrencyName": "NA",
    "GeoName": "NA",
    "VerticalName": "NA",
    "Address": "NA",
  };

  CountryList = [];
  RegionList = [];
  SAPCodeFileList = [];
  selectedCountry = "";
  selectedCountryName;
  selectedRegion = "";
  selectedRegionName = "";
  currencyName = "";
  verticalName = "";
  GeoName = "";
  customerName: string = "";
  cityName: string = "";
  address: string = "";
  customerNameFlag: boolean = false;
  addressFlag: boolean = false;
  cityFlag: boolean = false;
  countryFlag: boolean = false;
  isSearchLoader = false;
  dataHeader = { name: 'CompanyCode', Id: 'wipro_companycodesid' };
  entityName: string = "";
  companyName:string="";
  entityID: string = "";
  entityArrayForLookUp:any=[];
  route_from ='';
  constructor(public dialog: MatDialog, public service: DataCommunicationService,
    public dialogRef: MatDialogRef<SapPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public oppService: OpportunitiesService, public crser: CommitmentRegisterService ,public uploadService: FileUploadService,private el: ElementRef) {
    if (data) {
      console.log("sapdata", data)
      this.AccountDetails = data.sapCodeDetails.AccountAddressList;
      this.currencyName = data.curencyName;
      this.verticalName=data.vertical;
      this.route_from = data.route_from || '' ;
      console.log("this.currencyName", this.currencyName);
      if (this.AccountDetails.VerticalList && this.AccountDetails.VerticalList.length) {
        //this.verticalName = this.AccountDetails.VerticalList[0].VerticalName ? this.AccountDetails.VerticalList[0].VerticalName : '';
        this.GeoName = this.AccountDetails.VerticalList[0].GeographyName ? this.AccountDetails.VerticalList[0].GeographyName : '';
        this.selectedRegion = this.AccountDetails.VerticalList[0].RegionValue ? this.AccountDetails.VerticalList[0].RegionValue : '';
        this.selectedRegionName = this.AccountDetails.VerticalList[0].RegionName ? this.AccountDetails.VerticalList[0].RegionName : '';
        this.getCountry(this.selectedRegion)
      }
    }
  }
  // to close the dialog box if 'Esc' is pressed, Sprint 3 requirement
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  ngOnInit() {

  }
    lookupdata = {
    tabledata: [],
    recordCount: 10,
    headerdata: [],
    Isadvancesearchtabs: false,
    controlName: '',
    lookupName: '',
    isCheckboxRequired: false,
    inputValue: '',
    TotalRecordCount: 0,
    selectedRecord: [],
    pageNo: 1,
    nextLink: '',
    isLoader: false
  };
 getCompanyEntity(data){
debugger;
let searchText = data.searchValue ? data.searchValue : '';
let obj={
"SearchText":searchText,
"PageSize":10,
"RequestedPageNumber":1,
 "OdatanextLink": null
}
this.oppService.getCompanyEntity(obj).subscribe(result=>{
console.log(result,"entitydata")
this.entityArray=result.ResponseObject?result.ResponseObject:[];
this.lookupdata.TotalRecordCount = result.TotalRecordCount;
this.lookupdata.nextLink = result.OdatanextLink;
if (this.entityArray.length > 0) {
this.entityArray.map(data => {
data.Id = data.wipro_companycodesid;
})
}
console.log("entityArray",this.entityArray)
})
}
selectedEntityObj: any = { SysGuid: "", Name: "" };
selectedCompanyEntityObj(entityObject:Object){
  debugger;
    this.entityArrayForLookUp = [];
    this.selectedEntityObj = entityObject;
    if (entityObject && typeof entityObject === 'object' && Object.keys(entityObject).length) {
      this.entityName = this.selectedEntityObj.CompanyCode;
      this.entityID = this.selectedEntityObj.wipro_companycodesid;
      this.companyName=this.selectedEntityObj.CompanyName;
      this.selectedEntityObj.Id = this.selectedEntityObj.wipro_companycodesid;
    }
    else {
      this.entityName = "";
      this.entityID = "";
    }
    if (Object.keys(entityObject).length) {
      this.entityArrayForLookUp.push(this.selectedEntityObj);
    }
}
  showContent: Boolean = false;
  showAttach = false;
  yesChecked: boolean = false;
  noChecked: boolean = true;
  showhideattachbutton(event) {
    if (event.value == 'yes') {
      this.showAttach = true;
      this.showContent = false;
      this.yesChecked = true;
      this.noChecked = false;
    }
    else {
      this.showAttach = false;
      this.showContent = true;
      this.yesChecked = false;
      this.noChecked = true;
    }
    // this.showContent = this.showContent ? false : true;
  }

  dataValidation(data, name) {
    debugger;
    console.log("data", data)
    console.log("name", name)
    if (name == 'Customer') {
      if (data.length > 0) {
        this.customerNameFlag = false;
      }
    }
    else if (name == 'city') {
      if (data.length > 0) {
        this.cityFlag = false;
      }
    }
    else if (name == 'address') {
      if (data.length > 0) {
        this.addressFlag = false;
      }
    }
    else if (name == 'country') {
      if (data.length > 0) {
        this.countryFlag = false;
        this.CountryList.map(x=>{
        if(data==x.CountryId){
         this.selectedCountryName=x.Name;
        }
      })
      console.log(this.selectedCountryName,"countryname")
      }
    }

  }
  openAttachFilePopup(): void {
    if(this.route_from == 'accountDetails'){
      const dialogRef = this.dialog.open(AccountSapUploadComponent, {
        disableClose: true,
        width: '610px'
      });
      dialogRef.afterClosed().subscribe(result => {
        this.isLoading=true;
        var elmnt =  document.getElementById("scrollToAttachedFiles");
        elmnt.scrollIntoView();
         this.SAPCodeFileList = [];
        console.log("uploadedFiles",this.service.uploadedFiles);
        console.log("filelist",this.service.filesList);

        //for (let i = 0; i < this.service.filesList.length; i++) {
          this.uploadService.filesToUploadDocument64(this.service.filesList).subscribe(response => {
            this.isLoading=false;
            for (let i = 0; i < response.length; i++) {
              let obj = {
                "FileName": response[i].ResponseObject.Name,
                "FileURL": response[i].ResponseObject.Url,
                "UniqueKey": 755
              }
              this.SAPCodeFileList.push(obj);
            }
            console.log("finalfilelist",this.SAPCodeFileList);
          });
        //}
      })
    }
    else {
    const dialogRef = this.dialog.open(uploadPopup, {
      disableClose: true,
      width: '610px'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.isLoading=true;
        var elmnt =  document.getElementById("scrollToAttachedFiles");
        elmnt.scrollIntoView();
         this.SAPCodeFileList = [];
        console.log("uploadedFiles",this.service.uploadedFiles);
        console.log("filelist",this.service.filesList);

        //for (let i = 0; i < this.service.filesList.length; i++) {
          this.uploadService.filesToUploadDocument64(this.service.filesList).subscribe(response => {
            this.isLoading=false;
            for (let i = 0; i < response.length; i++) {
              let obj = {
                "FileName": response[i].ResponseObject.Name,
                "FileURL": response[i].ResponseObject.Url,
                "UniqueKey": 755
              }
              this.SAPCodeFileList.push(obj);
            }
            console.log("finalfilelist",this.SAPCodeFileList);
          });
        //}
      }
    })
  }
}
  // attach file pop up end 
  getCountry(data) {
    debugger;
    //var geography = '';
    //geography = this.CountryList.filter(it => it.CountryId == this.selectedCountry)[0].Geography;
    this.oppService.getCountryForSap(data).subscribe(result => {
      if (!result.IsError) {
        this.CountryList = result.ResponseObject ? result.ResponseObject : [];
        console.log(this.CountryList, "this.CountryList")
        if (this.CountryList.length == 1) {
          this.selectedCountry = this.CountryList[0].CountryId;
          this.selectedCountryName= this.CountryList[0].Name;
        }
      }
      else {
        this.oppService.displayMessageerror(result.Message);
      }
    },
      err => {
        this.oppService.displayerror(err.status);
      });
  }

  removeUploadFiles(index) {
    this.service.filesList.splice(index, 1);
    this.service.uploadedFiles.splice(index,1);
    this.SAPCodeFileList.splice(index,1);
  
 
  }
  selectedLookupData() {
    console.log("entityArrayForLookUp",this.entityArrayForLookUp)
    return (this.entityArrayForLookUp && this.entityArrayForLookUp.length > 0) ? this.entityArrayForLookUp : []
    }
advanceLookUpSearch(data){
  debugger;
  this.selectedEntityObj = data.selectedData;
  this.openadvancetabs('CompanyEntity', this.entityArray, data.inputVal)
}
  openadvancetabs(controlName, initalLookupData, value): void {
    debugger;
    this.lookupdata.controlName = controlName
    this.lookupdata.headerdata = opportunityAdvnHeaders[controlName]
    this.lookupdata.lookupName = opportunityAdvnNames[controlName]['name']
    this.lookupdata.isCheckboxRequired = opportunityAdvnNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = opportunityAdvnNames[controlName]['isAccount']
    this.lookupdata.inputValue = value;
    this.lookupdata.selectedRecord = this.selectedLookupData();
    this.oppService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
      this.lookupdata.tabledata = res
    })

    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.service.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });

    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
      let controlNameLoaded = x.objectRowData.controlName;
      debugger
      console.log(x)
      if (x.action == 'loadMore') {

        let dialogData = {
          searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
          recordCount: this.lookupdata.recordCount,
          OdatanextLink: this.lookupdata.nextLink,// need to handel the pagination and search!
          // pageNo: this.lookupdata.pageNo//+1//need to handel from pagination
          pageNo: x.currentPage,
        }

        this.oppService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...dialogData } }).subscribe(res => {
          this.lookupdata.isLoader = false;
          this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
          this.lookupdata.pageNo = res.CurrentPageNumber;
          this.lookupdata.nextLink = res.OdatanextLink;
          this.lookupdata.recordCount = res.PageSize;
          })

      } else if (x.action == 'search') {

        this.lookupdata.tabledata = []
        this.lookupdata.nextLink = ''
        this.lookupdata.pageNo = 1

        let dialogData = {
          searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
          recordCount: this.lookupdata.recordCount,
          OdatanextLink: this.lookupdata.nextLink,// need to handel the pagination and search!
          // pageNo: this.lookupdata.pageNo//+1//need to handel from pagination
          //pageNo: this.lookupdata.pageNo
          pageNo: x.currentPage,
        }

        this.oppService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...dialogData } }).subscribe(res => {
          this.lookupdata.isLoader = false;
          // this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
          this.lookupdata.tabledata = res.ResponseObject;
          this.lookupdata.pageNo = res.CurrentPageNumber;
          this.lookupdata.nextLink = res.OdatanextLink
          this.lookupdata.recordCount = res.PageSize
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        })
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      debugger;
      if (result) {
        console.log(result)
        this.AppendParticularInputDataFun(result.selectedData, result.controlName)
      }
    });
  }

    AppendParticularInputDataFun(selectedData, controlName) {
    debugger;
    if (selectedData) {
      if (selectedData.length > 0) {
          this.selectedEntityObj = selectedData[0];
          this.entityName = this.selectedEntityObj.CompanyCode;
          this.entityID = this.selectedEntityObj.wipro_companycodesid;
          this.entityArrayForLookUp = [];
          this.selectedEntityObj.Id = this.selectedEntityObj.SysGuid;
          this.entityArrayForLookUp.push(this.selectedEntityObj);
        }}}
  onSubmit() {
    debugger;
    const invalidElements = this.el.nativeElement.querySelector('.ng-invalid');
      if(invalidElements){
      invalidElements.scrollIntoView({ behavior: 'smooth', block: 'center' });
      invalidElements.focus();
      }

    if (!this.customerName) {
      this.customerNameFlag = true;
    }
    if (!this.selectedCountry) {
      this.countryFlag = true;
    }
    if (!this.address) {
      this.addressFlag = true;
    }
    if (!this.cityName) {
      this.cityFlag = true;
    }
    if (this.customerName && this.selectedCountry && this.address && this.cityName && this.selectedRegionName && this.verticalName) {
      if (this.showAttach && this.service.filesList.length == 0 && this.route_from != 'accountDetails') {
        this.oppService.displayMessageerror('Please upload document(s)');
      }
      else{
        let obj = {
          accountDetails: this.AccountDetails,
          fileList: this.SAPCodeFileList,
          selectedCountry: this.selectedCountryName,
          selectedRegion: this.selectedRegion,
          companyName:this.companyName,
          companyCode:this.entityName,
          address:this.address.concat(" ",this.cityName),
          customerName:this.customerName, //for Sprint3 team
          addressOnly : this.address, // for Sprint3 team
          zipcode : this.cityName , // for Sprint3 team
          IsSignedMSA : this.yesChecked ? true : false// for Sprint3 team
        }
        this.dialogRef.close(obj);
      }

    }
    else {
      this.oppService.displayMessageerror("Kindly enter the mandatory field")
    }
  }
}
