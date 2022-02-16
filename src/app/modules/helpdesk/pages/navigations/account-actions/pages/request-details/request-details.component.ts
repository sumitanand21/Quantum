import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { AccountListService } from '@app/core/services/accountList.service';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { MatDialog } from '@angular/material/dialog';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.scss']
})
export class RequestDetailsComponent implements OnInit {
  reqDetailForm = this._fb.group({
    requestedBy: [''],
    mergeReqName: [''],
    description: [''],
  })
  reqDetailsData:any;
  reqMergeDetails:any;
  constructor(public master3Api: S3MasterApiService, private _fb: FormBuilder, public accountListServ: AccountListService, public dialog: MatDialog,) { }

  ngOnInit() {
    let reqSysGuid = localStorage.getItem("accSysGuid");
    this.reqDetails(reqSysGuid);
  }
  reqDetails(reqSysGuid) {
    if (reqSysGuid) {
      let payload = { SysGuid: reqSysGuid }
      this.accountListServ.getMergeDetails(payload).subscribe(async (details) => {
        if (!details.IsError && details.ResponseObject) {
          this.reqMergeDetails = details.ResponseObject;
          this.reqDetailForm.controls['requestedBy'].setValue(this.reqMergeDetails.RequestedBy.FullName);
          this.reqDetailForm.controls['mergeReqName'].setValue(this.reqMergeDetails.Name);
          this.reqDetailForm.controls['description'].setValue(this.reqMergeDetails.Description);
          this.reqDetailsData = {
            mergeName:this.reqMergeDetails.Name,
            mergeDesc:this.reqMergeDetails.Description,
            RequestStage:this.reqMergeDetails.RequestStage
          }
          localStorage.setItem("mergeDataSave", JSON.stringify(this.reqDetailsData));
          localStorage.setItem("requestedBy", this.reqMergeDetails.RequestedBy.SysGuid);
          // this.accountListServ.changeSourceData(reqDetailsData);
        }
      })
    } else {
      console.log("SysGuid not available");
    }
  }

  goback() {
    console.log("go back");
  }

  // request by data start 
  arrowkeyLocation = 0;
  requestedSwitch:boolean;
  isActivityGroupSearchLoading:boolean;
  requestDetails = []

  appendRequest(item){
    this.reqDetailForm.controls['requestedBy'].setValue(item.FullName);
    if(item.SysGuid){
      localStorage.setItem("requestedBy", item.SysGuid);      
    }
  }
  getaccountowner() {
    console.log(this.reqDetailForm.controls['requestedBy'].value)
    const OwnerSearch = this.master3Api.AccountOwnerSearch(this.reqDetailForm.controls['requestedBy'].value);
    OwnerSearch.subscribe((res: any) => {
      console.log("owner", res.ResponseObject);

      if (!res.IsError && res.ResponseObject) {
        this.requestDetails = res.ResponseObject;
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        // if (event !== '') {
        //   this.customerContact = res.ResponseObject;
        // } else {
        //   this.customerContact = this.getTenRecords(res.ResponseObject);
        // }
        // if (res.ResponseObject.length == 0) {
        //   this.OwnDetailsForm.controls['owner'].setValue('');
        //   // this.financialyeardata['message'] = 'No record found';
        // }
      } else {
        this.reqDetailForm.controls['requestedBy'].setValue('');
        //this.financialyeardata['message'] = 'No record found';
      }
    });
  }
  getTenRecords(res) {
    const resdata = res.slice(0, 9);
    return resdata;
  }
  lookupdata = {
    tabledata: [
      {Name:'Sub Vertical'},
      {Name:'Kanika Tuteja'},
      {Name:'Kanika Tuteja'},
      {Name:'Kanika Tuteja'},
      {Name:'Sub Vertical'},
      {Name:'Sub Vertical'},

    ],
    recordCount: 10,
    headerdata: [{title:'Name',name:'Name'}],
    Isadvancesearchtabs: false,
    controlName: '',
    lookupName: 'Requested by',
    isCheckboxRequired: false,
    inputValue: '',
    TotalRecordCount: 0,
    selectedRecord: [],
    isLoader: false,
    nextLink: ''
  };

   // width: this.userdat.setHeaderPixes(this.lookupdata.headerdata.length ? this.lookupdata.headerdata.length : 0, this.lookupdata.Isadvancesearchtabs),
  openadvancetabs(){
    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
            width: '450px',
            data: this.lookupdata
    });
  }
  // request by data end 
}
