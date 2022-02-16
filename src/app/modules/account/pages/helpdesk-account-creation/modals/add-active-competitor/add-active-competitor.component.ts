import { Component, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';
import { AccountListService, AccountHeaders, AccountAdvNames } from '../../../../../../core/services/accountList.service';

@Component({
  selector: 'app-add-active-competitor',
  templateUrl: './add-active-competitor.component.html',
  styleUrls: ['./add-active-competitor.component.scss']
})
export class AddActiveCompetitorComponent {


  // CustomerContact: any = [
  //   { index: 0, FullName: 'Sub Vertical' },
  //   { index: 1, FullName: 'Kanika Tuteja' },
  //   { index: 2, FullName: 'Anubhav Jain ',},
  //   { index: 3, FullName: 'Kanika Tuteja'},
  // ];
  CompetitorName: string;


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
  linkedcampaignSwitch: boolean;
  linkedallinaceSwitch: boolean;
  alliancename: string;
  sendAllianceToAdvance = [];
  selectedcampaign: {}[] = [];
  AllianceToAdvanceSelected = [];
  CustomerContact: any;
  Competitorguid: any;
  competitor: any;
  allsubmitted;
  sendCompetitorToAdvance;
  // sendAllianceToAdvance = [];
  // selectedcampaign: {}[] = [];
  // AllianceToAdvanceSelected = [];
  constructor(public dialogRef: MatDialogRef<AddActiveCompetitorComponent>,
    public master3Api: S3MasterApiService,
    public dialog: MatDialog,
    public accountListService: AccountListService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  SearchCompetitor(value) {
    debugger
    let competitor = this.master3Api.SearchCompetitor(value)
    competitor.subscribe(result => {
      console.log("search competitor", result.ResponseObject)
      // this.CustomerContact = res.ResponseObject;
      this.CustomerContact = result.ResponseObject;
      this.lookupdata.TotalRecordCount = result.TotalRecordCount;
      this.lookupdata.nextLink = (result.OdatanextLink) ? result.OdatanextLink : '';
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
  onNoClick(): void {
    this.dialogRef.close([]);
  }


  appendcompetitor(item) {
    // debugger
    this.linkedcampaignSwitch = false;
    this.CompetitorName = item.Name
    this.Competitorguid = item.SysGuid
  }


  // width: this.userdat.setHeaderPixes(this.lookupdata.headerdata.length ? this.lookupdata.headerdata.length : 0, this.lookupdata.Isadvancesearchtabs),

  // openadvancetabs() {
  //   const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
  //     disableClose: true,
  //     width: '450px',
  //     data: this.lookupdata
  //   });
  // }

  addcompetitor() {
  
    if (this.Competitorguid && this.CompetitorName) {
      this.allsubmitted = false;
    this.competitor = { "LinkActionType": 1, "Competitor": { "SysGuid": this.Competitorguid }, "Name": this.CompetitorName }
    this.dialogRef.close(this.competitor)
    }else{
      this.allsubmitted = true;
    }
  }
  openadvancetabs(controlName, initalLookupData, value): void {
    if (!value) {
      this.emptyArray(controlName);
      // this.AppendParticularInputFun(result.selectedData, result.controlName);
    }
    this.lookupdata.controlName = controlName;
    this.lookupdata.headerdata = AccountHeaders[controlName];
    this.lookupdata.lookupName = AccountAdvNames[controlName]['name'];
    this.lookupdata.isCheckboxRequired = AccountAdvNames[controlName]['isCheckbox'];
    this.lookupdata.Isadvancesearchtabs = AccountAdvNames[controlName]['isAccount'];
    this.lookupdata.inputValue = value;
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.accountListService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
      console.log(res);

      if (res)
        this.lookupdata.tabledata = res;
    })

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
          // this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          // this.lookupdata.tabledata = [];
          // if (this.data.SeletectedData.record.length > 0 && res.ResponseObject.length > 0) {
          //   // this.lookupdata.tabledata = this.remove_duplicates(this.data.SeletectedData.record, res.ResponseObject);
          //   this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          //   this.lookupdata.TotalRecordCount = this.lookupdata.tabledata.length;
          // } else {
          //   this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          //   this.lookupdata.tabledata = res.ResponseObject;
          // }
          // this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
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
        this.emptyArray(result.controlName);
        this.AppendParticularInputFun(result.selectedData, result.controlName)
      }
    });
  }
  selectedLookupData(controlName) {
    switch (controlName) {
      case 'Competitor': { return (this.sendAllianceToAdvance.length > 0) ? this.sendAllianceToAdvance : [] }
    }
  }
  emptyArray(controlName) {
    switch (controlName) {
      case 'Competitor': {
        return this.sendCompetitorToAdvance = [], this.AllianceToAdvanceSelected = []
      }


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
    'Competitor': (data) => { this.appendcompetitor(data) },
  }

  getCommonData() {
    return {
      guid: '',
    }
  }
}
