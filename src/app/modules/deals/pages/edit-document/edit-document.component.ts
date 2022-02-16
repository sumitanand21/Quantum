import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { DataCommunicationService, ErrorMessage } from '@app/core';
import { dealService } from '@app/core/services/deals.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { NewDocStatusService } from '@app/core/services/datacomm/data-comm.service';
import { alphaNumericDot, checkLimit } from '@app/shared/pipes/white-space.validator';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { DealRoleService } from '@app/core/services/deals/deals-role.service';

const config = {
  generalErrMsg: 'Oops! There seems to be some technical snag! Could you raise a Helpline ticket?'
}

@Component({
  selector: 'app-edit-document',
  templateUrl: './edit-document.component.html',
  styleUrls: ['./edit-document.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class EditDocumentComponent implements OnInit {

  adid: any;
  deal: any;
  user: any;
  proposalForm: FormGroup;
  isLoading: boolean = false;
  editData: any;
  minDate = new Date();
  userInfo: any;

  constructor(public fb: FormBuilder,
    public dealService: dealService,
    public router: Router,
    public _error: ErrorMessage,
    private encrDecrService: EncrDecrService,
    public service: DataCommunicationService,
    public dialog: MatDialog,
    private dealRoleService: DealRoleService,
    public newDocStatusService: NewDocStatusService) {
    let userInfo = this.encrDecrService.get(
      "EncryptionEncryptionEncryptionEn",
      sessionStorage.getItem('userInfo'),
      "DecryptionDecrip");
    this.userInfo = JSON.parse(userInfo);
    this.proposalFormInit();
  }

  ngOnInit() {
    this.isLoading = true;
    this.user = localStorage.getItem('upn');
    this.adid = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('adid'), 'DecryptionDecrip');
    this.deal = JSON.parse(this.encrDecrService.get("EncryptionEncryptionEncryptionEn", sessionStorage.getItem('Dealoverview'), "DecryptionDecrip"));
    this.editData = JSON.parse(sessionStorage.getItem('proposalEditData'));
    //this.editData = JSON.parse(localStorage.getItem('proposalEditData'));
    console.log("Edit Proposal: ", this.editData);
    this.proposalFormPatch();
    this.userSearchMembers();
    this.isLoading = false;
  }

  proposalFormInit(): void {
    this.proposalForm = this.fb.group({
      Id: ['', Validators.compose([Validators.required])],
      Name: ['', Validators.compose([Validators.required, alphaNumericDot, checkLimit(100)])],
      SubmissionDate: ['', Validators.compose([Validators.required])],
      TemplateType: ['', Validators.compose([Validators.required])],
      Template: ['', Validators.compose([Validators.required])],
      Path: ['', Validators.compose([Validators.required])],
      ModifiedBy: ['', Validators.compose([Validators.required])],
      UserID: ['', Validators.compose([Validators.required])],
      IsTemplateModified: [false],
      Approver: ['', Validators.compose([Validators.required])],
    })
  }

  approver: any;
  proposalFormPatch() {
    console.log(this.editData)
    this.proposalForm.patchValue({
      'Name': this.editData.indxparent,
      'SubmissionDate': this.editData.submissionDate,
      'Id': this.editData.id,
      'TemplateType': this.editData.templateType,
      'Template': this.editData.template,
      'Path': this.editData.path,
      'ModifiedBy': this.adid + '|' + this.user,
      'UserID': this.adid,
      'Approver': this.editData.approverData[0].AdId,
    });

    this.Approver.valueChanges.subscribe(val => {
      this.approver = val;
    })
  }

  get Name(): FormControl {
    return this.proposalForm.get('Name') as FormControl;
  }

  get SubmissionDate(): FormControl {
    return this.proposalForm.get('SubmissionDate') as FormControl;
  }

  get Approver(): FormControl {
    return this.proposalForm.get('Approver') as FormControl;
  }

  saveData(payload: FormGroup) {
    let FullName:any;
    this.approvarArr.map(item=>{
      if(item.AdId == payload.value.Approver){
        FullName = item.FullName;
      }
    });

    payload.patchValue({
      'Approver': [{
        "Employee":
        {
          "Adid": payload.value.Approver,
          "FullName": FullName,
        }
      }]
    });
    console.log(payload.value)
    this.isLoading = true;
    this.dealService.editDocument(payload.value)
      .subscribe((res) => {
        if (!res.IsError) {
          this.isLoading = false;
          this.newDocStatusService.setBehaviorView(true);
          localStorage.setItem("propUpdate", "1");
          this.router.navigate(['deals/existingTabs/techSolution']);
          this._error.throwError(res.Message);
          localStorage.removeItem('proposalEditData');
        } else {
          this.isLoading = false;
          this._error.throwError(config.generalErrMsg);
        }
      }, error => {
        this.isLoading = false;
        this._error.throwError(config.generalErrMsg);
      });

  }

  onSubmit(data: FormGroup): void {
    let approverValue = this.editData;    
    // data.patchValue({
    //   'Approver': [{
    //     "Employee":
    //     {
    //       "Adid": this.approverData[0].AdId,
    //       "FullName": this.approverData[0].FullName,
    //     }
    //   }]
    // });
    console.log("Here")
    console.log(data)
    if (data.invalid) {
      this.service.validateAllFormFields(this.proposalForm)
      return;
    }
    let submissionDate = moment(this.SubmissionDate.value).toDate()
    if (moment(this.editData.submissionDate).isSame(this.SubmissionDate.value)) {
      this.saveData(data);
    } else {
      this.openDialog(data);
    }
  }

  routerTab() {
    console.log("Router Link:")
    if (sessionStorage.getItem('routingTab') == '1') {
      this.router.navigate(['/deals/existingTabs/calendar']);
      sessionStorage.setItem('routingTab', '0');
    } else {
      this.router.navigate(['/deals/existingTabs/techSolution']);
      sessionStorage.setItem('routingTab', '0');
    }
  }

  openDialog(data: FormGroup): void {
    const dialogRef = this.dialog.open(ConfirmationPopup, {
      width: '380px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveData(data);
      }
    });
  }


  Actions: any = [];
  approvarArr: any[] = [];
  isDealOwnersSearchLoading: boolean = false;
  userSearchMembers(event?) {
    this.isLoading = true;
    let input = {
      "Id": this.deal.id
    }
    this.dealService.searchApprover(input).subscribe(res => {
      console.log(res)
      if (!res.IsError) {
        this.approvarArr = res.ResponseObject;
        this.isLoading = false;
      } else {
        this.isLoading = false;
        this._error.throwError(res.Message);
      }
    })
  }

  approverData(data){
    console.log(data);
  }



}




@Component({
  selector: 'confirmationPopup',
  templateUrl: './confirmation-popup.html',
  styleUrls: ['./edit-document.component.scss']
})
export class ConfirmationPopup implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ConfirmationPopup>, public userdat: DataCommunicationService) {
  }

  ngOnInit() {

  }
  onCancel(): void {
    this.dialogRef.close(false);

  }
  onSubmit(): void {
    this.dialogRef.close(true);
  }

}
