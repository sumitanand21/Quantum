import { Component, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';
import { AccountListService, AccountHeaders, AccountAdvNames } from '../../../../../../core/services/accountList.service';

@Component({
  selector: 'app-add-alliance',
  templateUrl: './add-alliance.component.html',
  styleUrls: ['./add-alliance.component.scss']
})
export class AllianceAddComponent {


  CustomerContact: any = [
    { index: 0, FullName: 'Sub Vertical' },
    { index: 1, FullName: 'Kanika Tuteja' },
    { index: 2, FullName: 'Anubhav Jain ', },
    { index: 3, FullName: 'Kanika Tuteja' },
  ];
  customerContactName: string;
  alliance: boolean = false;

  isActivityGroupSearchLoading: boolean = false;
  // allAlliance: any = [
  //   {id:0 , Name:'ACC000001007 '},
  //   {id:1 , Name:'14 Nov Account Request'},
  //   {id:2 , Name:'ACC000001017'},
  //   {id:3 , Name:'ACC000001003'},
  //   {id:4 , Name:'ACC000001068'}
  // ];
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
  linkedcampaignSwitch: boolean;
  linkedallinaceSwitch: boolean;
  alliancename: string;
  sendAllianceToAdvance = [];
  selectedcampaign: {}[] = [];
  AllianceToAdvanceSelected = [];
  allAlliance: any;
  customerguid: any;
  allianceaccount: any;
  allianceguid: any;
  allsubmitted;
  constructor(public dialogRef: MatDialogRef<AllianceAddComponent>,
    public dialog: MatDialog,
    public master3Api: S3MasterApiService,
    public accountListService: AccountListService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }


  onNoClick(): void {
    this.dialogRef.close([]);
  }


  SearchAllianceAccounts(event) {
    // debugger
    let alliancename = this.master3Api.SearchAllianceAccounts(event)
    alliancename.subscribe(res => {
      console.log("alliancename", res.ResponseObject)
      // this.allAlliance = this.remove_duplicates(this.data.SeletectedData, res.ResponseObject);
      this.allAlliance = res.ResponseObject;
      this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
      this.lookupdata.TotalRecordCount = res.TotalRecordCount;
    })
  }
  // remove_duplicates(b, a) {
  //   for (var i = 0; i < a.length; i++) {
  //     for (var j = 0; j < b.length; j++) {
  //       if (a[i].Name == b[j].Name) {
  //         a.splice(i, 1);
  //       }
  //     }
  //   }
  //   return a;
  //   // console.log(b);
  //   // console.log(a);

  // }
  appendcampaign(item) {
    this.linkedcampaignSwitch = false;
    this.customerContactName = item.FullName
  }

  appendalliance(value: any) {
    debugger
    this.alliancename = value.Name;
    this.allianceguid = value.SysGuid
  }
  // width: this.userdat.setHeaderPixes(this.lookupdata.headerdata.length ? this.lookupdata.headerdata.length : 0, this.lookupdata.Isadvancesearchtabs),

  // openadvancetabs() {
  //   const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
  //     disableClose: true,
  //     width: '450px',
  //     data: this.lookupdata
  //   });
  // }

  addAlliance() {

    if (this.allianceguid && this.alliancename) {
      this.allianceaccount = { "LinkActionType": 1, "SysGuid": this.allianceguid, "Name": this.alliancename }
      this.allsubmitted = false;
      this.dialogRef.close(this.allianceaccount)
    } else {
      this.allsubmitted = true;
    }
  }
  openadvancetabs(controlName, initalLookupData, value): void {
    if (!value) {
      this.emptyArray(controlName);
      // this.AppendParticularInputFun(result.selectedData, result.controlName);
    }
    // let initalLookupData;
    // initalLookupData = this.remove_duplicates_From_Advanced_Lookup(this.data.SeletectedData, rowinitalLookupData);
    this.lookupdata.controlName = controlName;
    this.lookupdata.headerdata = AccountHeaders[controlName];
    this.lookupdata.lookupName = AccountAdvNames[controlName]['name'];
    this.lookupdata.isCheckboxRequired = AccountAdvNames[controlName]['isCheckbox'];
    this.lookupdata.Isadvancesearchtabs = AccountAdvNames[controlName]['isAccount'];
    this.lookupdata.inputValue = value;
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.accountListService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
      this.lookupdata.tabledata = res;
    })

    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      disableClose: true,
      width: this.accountListService.setHeaderPixes(this.lookupdata.headerdata.length ? this.lookupdata.headerdata.length : 0, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });

    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
      console.log(x)
      if (x['objectRowData'].searchKey != '' && x.currentPage == 1) {
        this.lookupdata.nextLink = ''
      }
      let dialogData = {
        searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
        recordCount: this.lookupdata.recordCount,
        OdatanextLink: this.lookupdata.nextLink,// need to handel the pagination and search!
        pageNo: x.currentPage//need to handel from pagination
      }

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
        }
        else if (x.action == "tabSwich") {
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
        this.emptyArray(controlName);
        this.AppendParticularInputFun(result.selectedData, result.controlName)
        // this.addAlliance();
      }
    });
  }
  emptyArray(controlName) {
    switch (controlName) {
      case 'AllianceContactSearch': {
        return this.AllianceToAdvanceSelected = [], this.sendAllianceToAdvance = []
      }

    }
  }
  getCommonData() {
    return {
      guid: '',
    }
  }
  selectedLookupData(controlName) {
    switch (controlName) {
      case 'AllianceContactSearch': { return (this.sendAllianceToAdvance.length > 0) ? this.sendAllianceToAdvance : [] }
    }
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
    'AllianceContactSearch': (data) => { this.appendalliance(data) },
  }

  // remove_duplicates_From_Advanced_Lookup(b, a) {
  //   for (var i = 0; i < a.length; i++) {
  //     for (var j = 0; j < b.length; j++) {
  //       if (a[i].Name == b[j].contact) {
  //         a.splice(i, 1);
  //       }
  //     }
  //   }
  //   return a;
  //   // console.log(b);
  //   // console.log(a);

  // }
}
