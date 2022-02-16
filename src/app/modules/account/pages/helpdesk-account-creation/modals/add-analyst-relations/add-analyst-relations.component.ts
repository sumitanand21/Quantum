import { Component, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
// import { AccountListService } from '@app/core/services/accountList.service';
import { AccountListService, AccountHeaders, AccountAdvNames } from '../../../../../../core/services/accountList.service';
@Component({
  selector: 'app-add-analyst-relations',
  templateUrl: './add-analyst-relations.component.html',
  styleUrls: ['./add-analyst-relations.component.scss']
})
export class AddAnalystRelationsComponent {

  // InitiativeNameArray: any = [
  //   { index: 0, Name: 'Initiative Name 1' },
  //   { index: 1, Name: 'Initiative Name 2' },
  //   { index: 2, Name: 'Initiative Name 3',},
  //   { index: 3, Name: 'Initiative Name 4'},
  // ];
  Initiativename: string;
  InitiativeNameSwitch: boolean;
  InitiativeNameArray: any;
  Initiativguid: any;
  advisory: any = [];
  advisoryrequest = {
    "SearchText": "",
    "PageSize": 10,
    "OdatanextLink": "",
    "RequestedPageNumber": 1
  }
  appendadvisory(item) {
    debugger
    console.log("seleceted item", item)
    this.InitiativeNameSwitch = false;
    this.Initiativename = item.Name
    this.Initiativguid = item.SysGuid

  }

  CBUName: string;
  CBUNameSwitch: boolean;
  CBUdetails = [
    { index: 0, Name: 'Sub Vertical' },
    { index: 1, Name: 'Kanika Tuteja' },
    { index: 2, Name: 'Anubhav Jain ', },
    { index: 3, Name: 'Kanika Tuteja' },

  ]
  appendCBU(item) {
    this.CBUNameSwitch = false;
    this.CBUName = item.Name
  }

  description: string;

  contactTarget: string;
  TargetContactSwitch: boolean;

  TargetContactArray: any = [
    { index: 0, contact: 'Sub Vertical', designation: 'manager' },
    { index: 1, contact: 'Kanika Tuteja', designation: 'manager' },
    { index: 2, contact: 'Anubhav Jain ', designation: 'manager' },
    { index: 3, contact: 'Kanika Tuteja', designation: 'manager' },
  ];

  appendTarget(item) {
    this.TargetContactSwitch = false;
    this.contactTarget = item.contact
  }
  customerContactName: string;
  alliance: boolean = false;

  isActivityGroupSearchLoading: boolean = false;

  lookupdata = {
    tabledata: [
      { Name: '14 Nov Account Request', Number: 'ACC000023826' },
      { Name: 'acc modif flow test 4:06PM kkn', Number: 'ACC000001007' },
      { Name: 'ACC000001007', Number: 'ACC000001007' },
      { Name: 'ACC000001007', Number: 'ACC000001007' },
      { Name: 'ACC000001007', Number: 'ACC000001007' },
      { Name: 'ACC000001007', Number: 'ACC000001007' },

    ],
    recordCount: 10,
    headerdata: [{ title: 'Name', name: 'Name' }, { title: 'Number', name: 'Number' }],
    Isadvancesearchtabs: false,
    controlName: '',
    lookupName: '',
    isCheckboxRequired: false,
    inputValue: '',
    TotalRecordCount: 0,
    selectedRecord: [],
    isLoader: false,
    nextLink: ''
  };
  allsubmitted;
  sendAdvisoryToAdvance;
  AdvisoryToAdvanceSelected;
  constructor(public dialogRef: MatDialogRef<AddAnalystRelationsComponent>,
    public accountListService: AccountListService,

    public dialog: MatDialog,

    @Inject(MAT_DIALOG_DATA) public data: any) {
  }


  getAdvisoryAnalyst(event) {
    this.advisoryrequest.SearchText = event
    let advisoryData = this.accountListService.getAdvisoryAnalyst(this.advisoryrequest)
    advisoryData.subscribe(res => {
      console.log("advisory data", res)
      

      if (!res.IsError && res.ResponseObject) {
       this.InitiativeNameArray = res.ResponseObject;
       this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
       this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        // this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        // if (this.data.length > 0 && res.ResponseObject.length > 0) {
        //   const CBUContact = this.remove_duplicates_Advisory(this.data, res.ResponseObject);
        //   // this.lookupdata.TotalRecordCount = CBUContact.length;
        //   // this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        //   this.lookupdata.TotalRecordCount = res.TotalRecordCount - this.data.length;
        //   if (this.advisory.length > 0)
        //     this.InitiativeNameArray = this.remove_duplicates_Advisory(this.advisory, CBUContact);
        //   // this.lookupdata.TotalRecordCount = this.CBUContact.length;
        //   // this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        //   this.lookupdata.TotalRecordCount = res.TotalRecordCount - this.advisory.length;
        //   if (this.advisory.length === 0)
        //     this.InitiativeNameArray = CBUContact;
        //   this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        // } else {
        //   this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        //   if (this.advisory.length > 0) {
        //     this.InitiativeNameArray = this.remove_duplicates_Advisory(this.advisory, res.ResponseObject);
        //     // this.lookupdata.TotalRecordCount = this.CBUContact.length;
        //     // this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        //     this.lookupdata.TotalRecordCount = res.TotalRecordCount - this.advisory.length;
        //   } else {
        //     this.InitiativeNameArray = res.ResponseObject;
        //     this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        //   }
        // }
      }
    })
  }
  // remove_duplicates_Advisory(b, a) {
  //   for (let i = 0; i < a.length; i++) {
  //     for (let j = 0; j < b.length; j++) {
  //       if (a[i].Name == b[j].Name) {
  //         a.splice(i, 1);
  //       }
  //     }
  //   }
  //   return a;
  // }
  addadvisory() {
    if (this.Initiativguid && this.Initiativename) {
      this.allsubmitted = false;
      this.advisory = { "LinkActionType": 1, "SysGuid": this.Initiativguid, "Name": this.Initiativename }
      this.dialogRef.close(this.advisory)
    } else {
      this.allsubmitted = true;
    }

  }
  onNoClick(): void {
    this.dialogRef.close([]);
  }

  // width: this.userdat.setHeaderPixes(this.lookupdata.headerdata.length ? this.lookupdata.headerdata.length : 0, this.lookupdata.Isadvancesearchtabs),

  // openadvancetabs(){
  //   const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
  //           disableClose : true,
  //           width: '450px',
  //           data: this.lookupdata
  //   });
  // }
  getCommonData() {
    return {
      guid: '',
    }
  }
  openadvancetabs(controlName, initalLookupData, value): void {
    if (!value) {
      this.emptyArray(controlName);
      // this.AppendParticularInputFun(result.selectedData, result.controlName);
    }
    this.lookupdata.controlName = controlName
    this.lookupdata.headerdata = AccountHeaders[controlName]
    this.lookupdata.lookupName = AccountAdvNames[controlName]['name']
    this.lookupdata.isCheckboxRequired = AccountAdvNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = AccountAdvNames[controlName]['isAccount']
    this.lookupdata.inputValue = value;
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.accountListService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {

      this.lookupdata.tabledata = res
    });
    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      disableClose: true,
      width: this.accountListService.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });

    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
      console.log(x)
      if (x['objectRowData'].searchKey != '' && x.currentPage == 1) {
        this.lookupdata.nextLink = ''
      }
      const dialogData = {
        searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
        recordCount: this.lookupdata.recordCount,
        OdatanextLink: this.lookupdata.nextLink,// need to handel the pagination and search!
        pageNo: x.currentPage//need to handel from pagination
      };

      this.accountListService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(), ...dialogData } }).subscribe(res => {
        this.lookupdata.isLoader = false;
        console.log("resresresresresresresresresresresresresresresresresres", res)
        if (x.action == "loadMore") {
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';

        } else if (x.action == "search") {
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.tabledata = res.ResponseObject;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';

          // this.lookupdata.tabledata = [];
          // // this.lookupdata.tabledata = res.ResponseObject;
          // if (!res.IsError && res.ResponseObject) {
          //   if (this.data.length > 0 && res.ResponseObject.length > 0) {
          //     this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          //     const CBUContact = this.remove_duplicates_Advisory_Advance(this.data, res.ResponseObject);
          //     console.log("CBUContact", CBUContact)
          //     // this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          //     // this.lookupdata.TotalRecordCount = this.lookupdata.tabledata.length;
          //     this.lookupdata.TotalRecordCount = res.TotalRecordCount - this.data.length;
          //     // this.lookupdata.TotalRecordCount = res.TotalRecordCount.length - this.lookupdata.tabledata.length;
          //     if (this.advisory.length > 0) {
          //       this.lookupdata.tabledata = this.remove_duplicates_Advisory_Advance(this.advisory, CBUContact);
          //       // this.lookupdata.TotalRecordCount = this.lookupdata.tabledata.length;
          //       // this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          //       this.lookupdata.TotalRecordCount = res.TotalRecordCount - this.advisory.length;
          //       // this.lookupdata.TotalRecordCount = res.TotalRecordCount.length - this.lookupdata.tabledata.length;
          //     }
          //     if (this.advisory.length == 0) {
          //       this.lookupdata.tabledata = CBUContact;
          //       this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          //     }

          //   } else {
          //     // if (this.advisory.length > 0) {
          //     //   // this.lookupdata.tabledata = this.remove_duplicates_Advisory_Advance(this.advisory, res.ResponseObject);
          //     //   // this.lookupdata.TotalRecordCount = this.lookupdata.tabledata.length;
          //     //   this.lookupdata.TotalRecordCount = res.TotalRecordCount - this.advisory.length;
          //     //   // this.lookupdata.TotalRecordCount = res.TotalRecordCount.length - this.lookupdata.tabledata.length;
          //     // } else {
          //     //   this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          //     //   this.lookupdata.tabledata = res.ResponseObject;
          //     // }
          //   }
          // } else {
          //   this.lookupdata.TotalRecordCount = res.ResponseObject.length;
          // }
          // this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        } else if (x.action === "tabSwich") {
          if (x.objectRowData.wiprodb) {
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
            this.lookupdata.tabledata = res.ResponseObject;
            this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          }

        }

      })

    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        console.log(result)
        this.emptyArray(result.controlName);
        this.AppendParticularInputFun(result.selectedData, result.controlName)
      }
    });
  }
  AppendParticularInputFun(selectedData, controlName) {
    if (selectedData) {
      if (selectedData.length > 0) {
        selectedData.forEach(data => {
          this.IdentifyAppendFunc[controlName](data)
        });
      }
    }
  }
  IdentifyAppendFunc = {
    'AdvisoryAnalystSearch': (data) => { this.appendadvisory(data) }
  }
  emptyArray(controlName) {
    switch (controlName) {
      case 'AdvisoryAnalystSearch': {
        return this.sendAdvisoryToAdvance = [], this.AdvisoryToAdvanceSelected = []
      }
    }
  }
  createTempData() {
    return {
      accountDetailName: this.AdvisoryToAdvanceSelected,
    }
  }
  selectedLookupData(controlName) {
    switch (controlName) {
      case 'AdvisoryAnalystSearch': { return (this.sendAdvisoryToAdvance.length > 0) ? this.sendAdvisoryToAdvance : [] }
    }
  }
  remove_duplicates_Advisory_Advance(b, a) {
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < b.length; j++) {
        if (a[i].Name == b[j].Name) {
          a.splice(i, 1);
        }
      }
    }
    return a;
  }

}
