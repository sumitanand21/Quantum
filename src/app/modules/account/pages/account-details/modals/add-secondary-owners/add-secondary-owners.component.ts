import { Component, OnInit, Inject,HostListener } from '@angular/core';
import { AccountListService } from '../../../../../../core/services/accountList.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatExpansionModule,
  MatSnackBar
} from '@angular/material';
import { AccountNameListAdvnHeaders, AccountAdvnNames } from '@app/core/services/account.service';
import { FormGroup } from '@angular/forms';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-secondary-owners',
  templateUrl: './add-secondary-owners.component.html',
  styleUrls: ['./add-secondary-owners.component.scss']
})
export class AddSecondaryOwnersComponent implements OnInit {
  IsModuleSwitch: boolean;
  showFirstForm: boolean;
  ownerAccountSelected: any;
  accountOwner : any;
  isActivityGroupSearchLoading: boolean;

  constructor(private accountListServ: AccountListService, @Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialog,
    private snackBar: MatSnackBar, private dialogRef: MatDialogRef<AddSecondaryOwnersComponent>, private router: Router) {
    if (data) {
      console.log("assignment data", data);
      this.assignmentData = data.assignData;
      this.accountName = this.accountListServ.getSymbol(data.accountName);
      this.accountOwner = data.accountOwner;
    }
  }
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
    pageNo: 1,
    nextLink: '',
    TotalRecordCount: 0,
    selectedRecord: [],
    isLoader: false,
    Guid: '',
    casesensitive: true

  };
  OwnDetailsForm: FormGroup;
  accountCreationObj = {};
  sendOwnerToAdvance: any = [];
  prospectAccForm: FormGroup;
  assignmentData: any;
  contactName2: string;
  contactNameSwitch2: boolean;
  accountName: string = "";
  selectedOwner = [];
  valSelected = [];
  // wiproContact2: {index:number,contact:string,designation:string,initials:string,value:boolean}[]= []
  wiproContact2 = [];
  appendOwner(item) {
    // this.selectedOwner.push(this.wiproContact2.find((val) => val.index == index ));
    this.selectedOwner.push(item);
    item.LinkActionType = 1;
    this.valSelected.push(item);
    this.contactNameSwitch2 = false;
  }

  contactNameclose2() {
    this.contactNameSwitch2 = false;
  }

  removeOwner(item, i) {
    // this.selectedOwner =  
    this.selectedOwner.splice(i, 1);
    this.valSelected.splice(i, 1);
    // if (item.MapGuid && item.MapGuid !== '') {
    //   this.valSelected[i].LinkActionType = 3;
    //   this.selectedOwner = this.selectedOwner.filter(res => res.MapGuid !== item.MapGuid);
    // } else {
    //   this.selectedOwner = this.selectedOwner.filter(res => res.SysGuid !== item.SysGuid)
    // } 
  }
  // getdecodevalue(data) {
  //   return this.accountListServ.getSymbol(data);
  // }
  adjustHeight() {
    if (this.contactNameSwitch2) {
      switch (this.selectedOwner.length) {
        case 0:
          return 'mb-186'

        case 1:
          return 'mb-110'

        case 2:
          return 'mb-55'

        default:
          return ''
      }
    }
  }
  // accountOwnerSearch(data) {
  //   let payload = { "SearchText": data ? data : '', "PageSize": 10, "RequestedPageNumber": 1, "OdatanextLink": "" }
  //   this.accountListServ.getSsecondAccountOwnerData(payload).subscribe((resp) => {
  //     console.log("data for secondary", resp);
  //     this.wiproContact2 = this.getFilterOwnerData(resp.ResponseObject);
  //   })
  // }
  getFilterOwnerData(res) {
    if (res.length != 0) {
      return res.map((data) => {
        let initials = data.FullName.split(" ");
        return {
          initials: initials.length == 1 ? initials[0].charAt(0) : initials[0].charAt(0) + initials[1].charAt(0),
          Name: data.FullName,
          SysGuid: data.SysGuid,
          designation: data.Designation
        }
      })
    }else{
      return [];
    }
  }
  addSecondOwner() {
    let payload = {
      "SysGuid": this.assignmentData.SysGuid,
      "MapGuid": this.assignmentData.MapGuid,
      "Name": this.accountName,
      "SecondaryOwnerList": this.valSelected
      // [ 
      //     { 
      //       "SysGuid":"07167f25-4c5f-e911-a830-000d3aa058cb",
      //       "LinkActionType":1
      //     },
      //     { 
      //       "SysGuid":"07167f25-4c5f-e911-a830-000d3aa058cb",
      //       "MapGuid":"c084c914-d415-ea11-a83c-000d3aa058cb",
      //       "LinkActionType":3
      //     }
      // ]
    }
    this.accountListServ.addsecondAccountOwnerData(payload).subscribe((resp) => {
      console.log("add for secondary", resp);
      if (!resp.IsError) {
        this.snackBar.open("Secondary owner added successfully", '', {
          duration: 3000
        })
        this.dialogRef.close('success');
      }
    })
  }
  remove_duplicates_Accounts_Advance(b, a) {
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < b.length; j++) {
        if (a[i].Name == b[j].Name) {
          a.splice(i, 1);
        }
      }
    }
    return a;
  }
  remove_duplicates_Accounts(b, a) {
    console.log(b);
    console.log(a);
      for (let j = 0; j < b.length; j++) {
        for (let i = 0; i < a.length; i++) {
        // if (a[i].SysGuid == b[j].SysGuid) {
        if (b[j].SysGuid == a[i].SysGuid) {
          a.splice(i, 1);
          console.log("after splice", a, i, j, b);
          // break;
        }
      }
    }
    return a;
  }
  accountOwnerSearch(data) {
    let payload = { "SearchText": data ? data : '', "PageSize": 10, "RequestedPageNumber": 1, "OdatanextLink": "" }
    this.wiproContact2 = [];
    let res2;
    let ownerList = [];
    this.isActivityGroupSearchLoading = true;
    this.accountListServ.getSsecondAccountOwnerData(payload).subscribe((res) => {
      this.isActivityGroupSearchLoading = false;
      if (!res.IsError && res.ResponseObject) {
        res2 = Object.assign({}, ...res);
        res.ResponseObject.filter(listitem => {
          if (listitem.FullName != this.accountOwner) {
            ownerList.push(listitem);
          };
        });
        res2.ResponseObject = ownerList;
        console.log(res2);
      }
      if(!res2.IsError && res2.ResponseObject){
        this.lookupdata.TotalRecordCount = res2.TotalRecordCount;
        this.lookupdata.nextLink = (res2.OdatanextLink) ? res2.OdatanextLink : '';
        if (this.assignmentData.SecondaryOwnerList.length > 0 && res2.ResponseObject.length > 0) {
        
          const accountName = this.remove_duplicates_Accounts(this.assignmentData.SecondaryOwnerList, res2.ResponseObject);
          // this.lookupdata.TotalRecordCount = res2.TotalRecordCount - this.advisoryData.length;
          if (this.selectedOwner.length > 0)
            this.wiproContact2 = this.getFilterOwnerData(this.remove_duplicates_Accounts(this.selectedOwner, accountName));
            // this.wiproContact2 = this.remove_duplicates_Advisory(this.selectedOwner, accountName);
            console.log(this.wiproContact2);            
          // this.lookupdata.TotalRecordCount = res2.TotalRecordCount - this.selectedOwner.length;
          if (this.selectedOwner.length === 0)
            this.wiproContact2 = this.getFilterOwnerData(accountName);
            // this.wiproContact2 = accountName;
          // this.lookupdata.TotalRecordCount = res2.TotalRecordCount;
        } else {
          if (this.selectedOwner.length > 0) {
            this.wiproContact2 = this.getFilterOwnerData(this.remove_duplicates_Accounts(this.selectedOwner, res2.ResponseObject));
            // this.wiproContact2 = this.remove_duplicates_Advisory(this.selectedOwner, res2.ResponseObject);
            // this.lookupdata.TotalRecordCount = res2.TotalRecordCount - this.selectedOwner.length;
          } else {
            this.wiproContact2 = this.getFilterOwnerData(res2.ResponseObject);
            // this.wiproContact2 = res2.ResponseObject;
            // this.lookupdata.TotalRecordCount = res2.TotalRecordCount;
          }
        }
      }

    })
  }
  openadvancetabs(controlName, initalLookupData, value, index?, headerdata?, line?): void {
    // debugger
    // AccountAdvnNames,AccountNameListAdvnHeaders
    // console.log("this.prospectAccForm.value.parentaccount--" + this.prospectAccForm.value.parentaccount);
    if (!value) {
      this.emptyArray(controlName);
      // this.AppendParticularInputFun(result.selectedData, result.controlName);
    }
    this.lookupdata.controlName = controlName;
    this.lookupdata.headerdata = AccountNameListAdvnHeaders[controlName];
    this.lookupdata.lookupName = AccountAdvnNames[controlName]['name'];
    this.lookupdata.isCheckboxRequired = AccountAdvnNames[controlName]['isCheckbox'];
    this.lookupdata.Isadvancesearchtabs = AccountAdvnNames[controlName]['isAccount'];

    // this.lookupdata.inputValue = this.selectedLookupName(this.lookupdata.controlName);
    // const Guid = this.accountCreationObj[controlName] ? this.accountCreationObj[controlName] : '';
    // this.lookupdata.Guid = this.accountCreationObj[controlName] ?  this.accountCreationObj[controlName]  : '';
    // this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.accountListServ.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null, rowData: headerdata, rowIndex: index, rowLine: line }).subscribe(res => {
      this.lookupdata.tabledata = res;
    });
    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      disableClose: true,
      width: this.accountListServ.setHeaderPixes(this.lookupdata.headerdata.length ? this.lookupdata.headerdata.length : 0, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });
    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
      // console.log(x)
      if (x['objectRowData'].searchKey !== '' && x.currentPage === 1) {
        this.lookupdata.nextLink = '';
      }
      const dialogData = {
        searchVal: (x['objectRowData'].searchKey !== '') ? x['objectRowData'].searchKey : '',
        recordCount: this.lookupdata.recordCount,
        OdatanextLink: this.lookupdata.nextLink,// need to handel the pagination and search!
        pageNo: x.currentPage//need to handel from pagination
      };
      // debugger
      this.accountListServ.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(), ...dialogData }}).subscribe(res => {
        // debugger
        this.lookupdata.isLoader = false;
        // console.log("resresresresresresresresresresresresresresresresresres", res)
        if (x.action === 'loadMore') {
          // debugger;
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        } else if (x.action === 'search') {
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          // this.lookupdata.tabledata = res.ResponseObject;
          if (this.assignmentData.SecondaryOwnerList.length > 0 && res.ResponseObject.length > 0) {
        
            const accountName = this.remove_duplicates_Accounts(this.assignmentData.SecondaryOwnerList, res.ResponseObject);
            // this.lookupdata.TotalRecordCount = res2.TotalRecordCount - this.advisoryData.length;
            if (this.selectedOwner.length > 0)
            this.lookupdata.tabledata = this.getFilterOwnerData(this.remove_duplicates_Accounts(this.selectedOwner, accountName));
              // this.wiproContact2 = this.remove_duplicates_Advisory(this.selectedOwner, accountName);
              this.lookupdata.TotalRecordCount = this.lookupdata.tabledata.length;
              console.log(this.wiproContact2);            
            // this.lookupdata.TotalRecordCount = res2.TotalRecordCount - this.selectedOwner.length;
            if (this.selectedOwner.length === 0)
            this.lookupdata.tabledata = this.getFilterOwnerData(accountName);
              // this.wiproContact2 = accountName;
            this.lookupdata.TotalRecordCount = this.lookupdata.tabledata.length;
          } else {
            if (this.selectedOwner.length > 0) {
              this.lookupdata.tabledata = this.getFilterOwnerData(this.remove_duplicates_Accounts(this.selectedOwner, res.ResponseObject));
              // this.wiproContact2 = this.remove_duplicates_Advisory(this.selectedOwner, res2.ResponseObject);
              // this.lookupdata.TotalRecordCount = res2.TotalRecordCount - this.selectedOwner.length;
              this.lookupdata.TotalRecordCount = this.lookupdata.tabledata.length;
            } else {
              this.lookupdata.tabledata= this.getFilterOwnerData(res.ResponseObject);
              // this.wiproContact2 = res2.ResponseObject;
              // this.lookupdata.TotalRecordCount = res2.TotalRecordCount;
              this.lookupdata.TotalRecordCount = this.lookupdata.tabledata.length;
            }
          }
    
        } else if (x.action === 'tabSwich') {
          if (x.objectRowData.wiprodb) {
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
            this.lookupdata.tabledata = res.ResponseObject;
            this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          }
        }
      });
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // console.log(result)
        if (result.IsProspectAccount) {
          // this.accountListServ.sendProspectAccount = false;
          this.IsModuleSwitch = false;
          this.showFirstForm = true;
          sessionStorage.setItem('TempLeadDetails', JSON.stringify(this.createTempData()));
          this.router.navigateByUrl('/activities/prospectAccount');
        } else {
          this.emptyArray(result.controlName);
          this.AppendParticularInputFun(result.selectedData, result.controlName);
        }
      }
    });
  }
  emptyArray(controlName) {
    switch (controlName) {
      // case 'accountNameSource': {
      //   return this.AccountSelected = [], this.sendAccountNameToAdvance = []
      // }
      case 'secondaryowner': {
        return this.sendOwnerToAdvance = [], this.ownerAccountSelected = [];
      }

    }
  }
  // selectedLookupName(controlName) {
  //   switch (controlName) {
  //     //case 'parentaccount': { return this.prospectAccForm.value.parentaccount ? (this.prospectAccForm.value.parentaccount === this.ParentAccountSelected['Name']) ? '' : this.prospectAccForm.value.parentaccount : '' };
  //     // case 'ultimateparent': { return (this.sendUltimateAccountAdvance.length > 0) ? this.sendUltimateAccountAdvance : [] }
  //     case 'secondaryowner': { return (this.sendOwnerToAdvance.length > 0) ? this.sendOwnerToAdvance : [] }
  //     // case 'sbu': { return (this.sendSbuToAdvance.length > 0) ? this.sendSbuToAdvance : [] }
  //     // case 'vertical': { return (this.sendVerticalToAdvance.length > 0) ? this.sendVerticalToAdvance : [] }
  //     // case 'subvertical': { return (this.sendSubVerticaltoAdvance.length > 0) ? this.sendSubVerticaltoAdvance : [] }
  //     // case 'currencyaccount': { return (this.sendCurrencytoAdvance.length > 0) ? this.sendCurrencytoAdvance : [] }
  //     // case 'geography': { return (this.sendGeographytoAdvance.length > 0) ? this.sendGeographytoAdvance : [] }
  //     // case 'region': { return (this.sendRegiontoAdvance.length > 0) ? this.sendRegiontoAdvance : [] }
  //     // case 'country': { return (this.sendCountrytoAdvance.length > 0) ? this.sendCountrytoAdvance : [] }
  //     // case 'state': { return (this.sendSatetoAdvance.length > 0) ? this.sendSatetoAdvance : [] }
  //     // case 'city': { return (this.sendCitytoAdvance.length > 0) ? this.sendCitytoAdvance : [] }
  //     default: { return []; }
  //   }
  // }
  AppendParticularInputFun(selectedData, controlName) {
    // debugger
    if (selectedData) {
      if (selectedData.length > 0) {
        selectedData.forEach(data => {
          this.IdentifyAppendFunc[controlName](data);
        });
      }
    }
  }
  IdentifyAppendFunc = {
    // 'parentaccount': (data) => { this.appendparent(data) },
    // 'ultimateparent': (data) => { this.appendultimateparent(data) },
    'secondaryowner': (data) => { this.appendOwner(data) },
    // 'sbu': (data) => { this.appendcontactSBU(data), this.removeVerticalAndSbuverticalData('', true, data) },
    // 'vertical': (data) => { this.appendvertical(data, '', false) },
    // 'subvertical': (data) => { this.appendsubvertical(data, '', false) },
    // 'currencyaccount': (data) => { this.appendcurrency(data) },
    // 'geography': (data) => { this.appendgeo(data) },
    // 'region': (data) => { this.appendregion(data, '', false) },
    // 'country': (data) => { this.appendcountry1(data, '', false) },
    // 'state': (data) => { this.appendState(data, '', false) },
    // 'city': (data) => { this.appendcity1(data, '', false) },
    // 'altowner': (data) => { this.appendAltOwner(data) },
    // 'cluster': (data) => { this.appendcluster(data) },

  }
  // selectedLookupData(controlName) {
  //   switch (controlName) {
  //     // case 'parentaccount': { return (this.sendParentAccountNameToAdvance.length > 0) ? this.sendParentAccountNameToAdvance : []; }
  //     // case 'ultimateparent': { return (this.sendUltimateAccountAdvance.length > 0) ? this.sendUltimateAccountAdvance : []; }
  //     case 'secondaryowner': { return (this.sendOwnerToAdvance.length > 0) ? this.sendOwnerToAdvance : []; }
  //     // case 'sbu': { return (this.sendSbuToAdvance.length > 0) ? this.sendSbuToAdvance : []; }
  //     // case 'vertical': { return (this.sendVerticalToAdvance.length > 0) ? this.sendVerticalToAdvance : []; }
  //     // case 'subvertical': { return (this.sendSubVerticaltoAdvance.length > 0) ? this.sendSubVerticaltoAdvance : []; }
  //     // case 'currencyaccount': { return (this.sendCurrencytoAdvance.length > 0) ? this.sendCurrencytoAdvance : []; }
  //     // case 'geography': { return (this.sendGeographytoAdvance.length > 0) ? this.sendGeographytoAdvance : []; }
  //     // case 'region': { return (this.sendRegiontoAdvance.length > 0) ? this.sendRegiontoAdvance : []; }
  //     // case 'country': { return (this.sendCountrytoAdvance.length > 0) ? this.sendCountrytoAdvance : []; }
  //     // case 'state': { return (this.sendSatetoAdvance.length > 0) ? this.sendSatetoAdvance : []; }
  //     // case 'city': { return (this.sendCitytoAdvance.length > 0) ? this.sendCitytoAdvance : []; }
  //     // case 'altowner': { return (this.sendAltOwnerToAdvance.length > 0) ? this.sendAltOwnerToAdvance : []; }
  //     // case 'cluster': { return (this.clustertoAdvLookup.length > 0) ? this.clustertoAdvLookup : [] }
  //     default: { return []; }
  //   }
  // }
  getCommonData() {
    return {
      // guid: '11',
      // isProspect: '11',
      // stateId: this.accountCreationObj['state'] ? this.accountCreationObj['state'] : '',
      // countryId: this.accountCreationObj['country'] ? this.accountCreationObj['country'] : '',
      // regionId: this.accountCreationObj['region'] ? this.accountCreationObj['region'] : '',
      // geoId: this.accountCreationObj['geography'] ? this.accountCreationObj['geography'] : '',
      // verticalId: this.accountCreationObj['vertical'] ? this.accountCreationObj['vertical'] : '',
      // SbuId: this.accountCreationObj['sbu'] ? this.accountCreationObj['sbu'] : '',
      // clusterId : this.OwnDetailsForm.controls['sbu'].value ? this.OwnDetailsForm.controls['sbu'].value :''
    }
  }
  createTempData() {
    return {
      // parentaccount: this.ParentAccountSelected,
      // ultimateparent: this.ultimateParentAccountSelected,
      secondaryowner: this.ownerAccountSelected,
      // sbu: this.sbuAccountSelected,
      // vertical: this.verticalSelected,
      // subvertical: this.subVerticalSelected,
      // currencyaccount: this.currencySelected,
      // geography: this.geographySelected,
      // region: this.regionSelected,
      // country: this.countrySelected,
      // state: this.stateSelected,
      // city: this.citySelected,
      // altowner: this.altownerAccountSelected,
      // cluster: this.clusterSelected

    };
  }
}
