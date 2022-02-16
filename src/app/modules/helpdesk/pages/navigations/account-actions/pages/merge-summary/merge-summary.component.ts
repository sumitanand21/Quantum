import { Component, OnInit } from '@angular/core';
import { DataCommunicationService } from '@app/core';
import { Subscription } from 'rxjs';
import { AccountListService } from '@app/core/services/accountList.service';
import { SecondaryOwnerViewComponent } from '../secondary-owner-view/secondary-owner-view.component';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatExpansionModule,
  MatSnackBar
} from '@angular/material';
@Component({
  selector: 'app-merge-summary',
  templateUrl: './merge-summary.component.html',
  styleUrls: ['./merge-summary.component.scss']
})
export class MergeSummaryComponent implements OnInit {
  ViewDetailsContent: Boolean = false;
  ManualContent: Boolean = true;
  tableCount = 30;
  subscription: Subscription;
  sourceData: any;
  ownerSysGuid: string = "";
  summaryData: any;
  srcAccountData = [];
  targetAccountData = [];
  secondaryOwners = [];
  // secondaryOwners = [{
  //   SysGuid:"1", FullName:"aaa"
    
  // },{SysGuid:"2", FullName:"bbb"}];
  userArray1 = [
    { "index": 1, "AccountNumber": "AC000017567", "AccountName": "AC0000263739", "AccountOwner": "Shiv Kumar", "SBU": "Test", "Vertical": "Product" },
    { "index": 2, "AccountNumber": "AC000017567", "AccountName": "AC0000263739", "AccountOwner": "Shiv Kumar", "SBU": "Test", "Vertical": "Product" },
    { "index": 3, "AccountNumber": "AC000017567", "AccountName": "AC0000263739", "AccountOwner": "Shiv Kumar", "SBU": "Test", "Vertical": "Product" },
    { "index": 4, "AccountNumber": "AC000017567", "AccountName": "AC0000263739", "AccountOwner": "Shiv Kumar", "SBU": "Test", "Vertical": "Product" },

  ];
  headernonsticky1 = [{ name: "AccountNumber",title:"Account Number" },
  { name: "AccountName" ,title:"Account Name"},
  { name: "AccountOwner",title:"Account Owner" },
  { name: "SBU",title:"SBU" },
  { name: "Vertical",title:"Vertical" },
  ];
  userArray2 = [
    { "index": 1, "AccountNumber": "AC000017567", "AccountName": "AC0000263739", "AccountOwner": "Shiv Kumar", "SBU": "Test", "Vertical": "Product" },

  ];
  headernonsticky2 = [{ name: "AccountNumber",title:"Account Number" },
  { name: "AccountName",title:"Account Name" },
  { name: "AccountOwner",title:"Account Owner" },
  { name: "SBU",title:"SBU" },
  { name: "Vertical",title:"Vertical" },
  ];


  summary_table = [
    { slNo: '1.', briefSummary: "Total contacts of source accounts to be merged", noOfRecord: '0' },
    { slNo: '2.', briefSummary: "Total opportunities of source accounts to be merged", noOfRecord: '0' },
    { slNo: '3.', briefSummary: "Total orders of source accounts to be merged", noOfRecord: '0' },
    { slNo: '4.', briefSummary: "Total leads of source accounts to be merged", noOfRecord: '0' },
    { slNo: '5.', briefSummary: "Total phone call of source accounts to be merged", noOfRecord: '0' },
    { slNo: '6.', briefSummary: "Total appointment of source accounts to be merged", noOfRecord: '0' },
    { slNo: '7.', briefSummary: "Total task of source accounts to be merged", noOfRecord: '0' },
    { slNo: '8.', briefSummary: "Total email of source accounts to be merged", noOfRecord: '0' },
    { slNo: '9.', briefSummary: "Total SAP code of the source accounts to be merged", noOfRecord: '0' },
    { slNo: '10.', briefSummary: "Secondary account owner for Target account (AC000043512)", noOfRecord: "Vishal Kumar" },
  ]
  constructor(public service: DataCommunicationService, private accountListService: AccountListService, public dialog:MatDialog) { }

  ngOnInit() {
    let reqSysGuid = localStorage.getItem("accSysGuid");
    // this.subscription = this.accountListService.targetAccData.subscribe((res) => {
    //   this.sourceData = res;
    //   this.ownerSysGuid = (this.sourceData && this.sourceData.vertical) ? this.sourceData.vertical.Id : "";
    //   if (this.sourceData && this.sourceData.checkedData) {
    //     console.log(this.sourceData);
    //     this.getSummaryData(reqSysGuid);
    //   }
    // });
    this.reqDetails(reqSysGuid);
  }
  getSummaryData(reqSysGuid) {
    let srcSysGuid = [];
    this.srcAccountData.map((res)=>{
      if(res.SysGuid){srcSysGuid.push(res.SysGuid)}
    })
    let payload = {
      "SysGuid": reqSysGuid,
      "SourceGuids": srcSysGuid
    }
    this.accountListService.mergeSummary(payload).subscribe((res) => {
      if (!res.IsError && res.ResponseObject) {
        console.log(res);
        this.summaryData = res.ResponseObject.Summary;
        this.secondaryOwners = this.summaryData.SecondaryOwners;
        this.summary_table.map((res, index) => {
          switch (index) {
            case 0: res.noOfRecord = this.summaryData.ContactsCount; break;
            case 1: res.noOfRecord = this.summaryData.OpportunitiesCount; break;
            case 2: res.noOfRecord = this.summaryData.OrdersCount; break;
            case 3: res.noOfRecord = this.summaryData.LeadsCount; break;
            case 4: res.noOfRecord = this.summaryData.PhoneCallCount; break;
            case 5: res.noOfRecord = this.summaryData.AppointmentCount; break;
            case 6: res.noOfRecord = this.summaryData.TaskCount; break;
            case 7: res.noOfRecord = this.summaryData.EmailCount; break;
            case 8: res.noOfRecord = this.summaryData.SapCode; break;
            case 9: res.briefSummary = `Secondary account owner for Target account (${this.targetAccountData[0].AccountNumber})`; break;
          }
        })
      }
    })
  }
  
  openMultipleReferencePopup(data) {
    const dialogRef = this.dialog.open(SecondaryOwnerViewComponent,
      {
        width: '400px',
        data: data
      });
  }
  reqDetails(reqSysGuid) {
    if (reqSysGuid) {
      let payload = { SysGuid: reqSysGuid }
      this.accountListService.getMergeDetails(payload).subscribe(async (details) => {
        if (!details.IsError && details.ResponseObject) {
          
          if (details.ResponseObject.SourceAccounts) {
            this.srcAccountData = this.getTableFilterData(details.ResponseObject.SourceAccounts);
            // this.accountListService.sourceAccountData = this.srcAccountData;
            this.accountListService.changeSourceData(this.srcAccountData)
            this.getSummaryData(reqSysGuid);
          }
          if (details.ResponseObject.TargetAccount) {
            this.targetAccountData = this.getTableFilterData([details.ResponseObject.TargetAccount]);
            localStorage.setItem("mergeDataSave", JSON.stringify({targetId: this.targetAccountData[0].SysGuid}));
          }
          localStorage.setItem("verticalDataId", JSON.stringify(details.ResponseObject.Vertical.Id));         
        }
      })
    } else {
      console.log("SysGuid not available");
    }
  }
  getTableFilterData(tableData): Array<any> {
    if (tableData) {
      if (tableData.length > 0) {
        return tableData.map(((accData, index) => {
          return {
            index: index,
            AccountNumber: accData.Number || '',
            AccountName: accData.Name || '',
            AccountOwner: (accData.Owner && accData.Owner.FullName) ? accData.Owner.FullName : '',
            SBU: (accData.SBU && accData.SBU.Name) ? accData.SBU.Name : '',
            Vertical: (accData.Vertical && accData.Vertical.Name) ? accData.Vertical.Name : '',
            SysGuid: accData.SysGuid,
            isCheccked: true
          };
        }));
      } else {
        return [{}];
      }
    } else {
      return [{}];
    }
  }
  performTableChildAction(childActionRecieved) {
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {
      case 'delete': {
        this.srcAccountData.splice(actionRequired.objectRowData.index, 1);
        // this.accountListService.sourceAccountData = this.srcAccountData;
        this.accountListService.changeSourceData(this.srcAccountData)
        break;
      }
    }
  }
}
