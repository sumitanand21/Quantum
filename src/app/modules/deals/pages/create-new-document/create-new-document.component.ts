import { Component, OnInit, HostListener, Inject, DoCheck, Output, EventEmitter } from '@angular/core';
import { DataCommunicationService, ErrorMessage } from '@app/core';
import { dealService } from '@app/core/services/deals.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatRadioChange } from '@angular/material/';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { removeSpaces, checkLimit, alphaNumericDot, DateValidator } from '@app/shared/pipes/white-space.validator';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { IfStmt } from '@angular/compiler';
import { NewDocStatusService } from '@app/core/services/datacomm/data-comm.service';
import { Popup } from '@syncfusion/ej2-popups';
import { DigitalAssistantService } from '@app/core/services/digital-assistant/digital-assistant.service';
import { environment } from '@env/environment';
import { environment as env } from '@env/environment';
import * as moment from 'moment';
declare let FileTransfer: any;
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DealRoleService } from '@app/core/services/deals/deals-role.service';
import { EnvService } from '@app/core/services/env.service';

const wpTemplatePayLoad = {
  "docTypes": [
    "Templates"],
  "fields": [
    {
      "objectName": "Deal"
    }
  ]
}
const config = {
  generalErrMsg: 'Oops! There seems to be some technical snag! Could you raise a Helpline ticket?'
}

@Component({
  selector: 'app-create-new-document',
  templateUrl: './create-new-document.component.html',
  styleUrls: ['./create-new-document.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class CreateNewDocumentComponent implements OnInit, DoCheck {

  isLoading: boolean;
  toggleUpload = false;
  proposalCreateForm: FormGroup;
  showStatus: boolean;
  wpListTemplate: any;
  adid: any;
  deal: any;
  user: any;
  pathReq: boolean;
  minDate = new Date();
  hostData: any[];
  attachmentDetails: any;

  // daData = environment.wittyParrotIframe;

  fileData: any;
  fileName: string;
  navigateBack: boolean = false;

  statusArray = [
    { id: 1, name: 'Wipro' },
    { id: 2, name: 'Customer' },
    { id: 3, name: 'Custom' }
  ];


  constructor(public service: DataCommunicationService,
    public envr : EnvService,
    public dialog: MatDialog,
    public fb: FormBuilder,
    private dealService: dealService,
    public router: Router,
    public _error: ErrorMessage,
    public activatedRoute: ActivatedRoute,
    private encrDecrService: EncrDecrService,
    public newDocStatusService: NewDocStatusService,
    private dalisten: DigitalAssistantService,
    public dealRoleService: DealRoleService,
    public daService: DigitalAssistantService) {
    this.user = localStorage.getItem('upn');
    this.adid = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('adid'), 'DecryptionDecrip');
    this.deal = JSON.parse(this.encrDecrService.get("EncryptionEncryptionEncryptionEn", sessionStorage.getItem('Dealoverview'), "DecryptionDecrip"));
    this.proposalCreateFormInit();
    //this.service.sideTrans = false;
  }

  ngOnInit() {
    this.toggleView();
    this.userSearchMembers();
    // this.getCache();
    //this.getWpListTemplateInfo();
  }

  ngDoCheck() {
    //let msg = this.daService.getAllData();
    // this.sendMessageToChild()
    // this.proposalCreateForm.patchValue({
    //   'SubmissionDate': moment(this.SubmissionDate.value, 'DD-MMM-YYYY'),
    // });


  }

  /** starts here */


  /**
   * Author: Jithendra R
   * Date: 24-06-2019
   * Modified: 24-06-2019
   * 
   */
  proposalCreateFormInit() {
    console.log("Yes is am calling method")
    this.proposalCreateForm = this.fb.group({
      Name: ['', Validators.compose([Validators.required, alphaNumericDot, checkLimit(100)])],
      SubmissionDate: ['', Validators.compose([Validators.required])],
      TemplateType: [1, Validators.compose([Validators.required])],
      Template: ['', Validators.compose([Validators.required])],
      Path: ['null', Validators.compose([Validators.required])],
      Deal: [{ 'Id': this.deal.id }],
      CreatedBy: [this.adid + "|" + this.user],
      UserID: [this.adid],
      SPUniqueId: [''],
      Approver: ['']
    });
    this.templateChange()
    // this.proposalCreateForm.valueChanges.subscribe(val => {
    //   this.setCache(val);
    // });
    // this.TemplateType.valueChanges.subscribe(val => {

    // });

    this.Template.valueChanges.subscribe(val => {
      this.attachmentDetails = val;
    });


  }
  templateChange() {
    const val = this.proposalCreateForm.controls.TemplateType.value
    console.log(val)
    if (val != 1) {
      this.Template.patchValue(null);
      this.service.chatBot = false;
      // this.service.chatbotDA = false;
      // this.service.sideTrans = false;
      this.toggleUpload = true;
      this.daService.iframePage = 'OPPORTUNITY_DEALS';
      let bodyDA = {
        wipro: false,
        page: 'OPPORTUNITY_DEALS'
      };
      this.daService.postMessageData = bodyDA;
      console.log(bodyDA, "bodyDA is working..")
      this.daService.postMessage(bodyDA);
    } else {
      this.service.chatBot = true
      console.log(this.service.chatBot, "this.service.chatBot")
      this.toggleUpload = false;
      this.daService.iframePage = 'OPPORTUNITY_DEALS';
      let bodyDA = {
        wipro: true,
        page: 'OPPORTUNITY_DEALS'
      };
      this.daService.postMessageData = bodyDA;
      this.daService.postMessage(bodyDA);
    }
    this.proposalCreateForm.updateValueAndValidity();
  }
  get TemplateType(): FormControl {
    return this.proposalCreateForm.get('TemplateType') as FormControl;
  }

  get Path(): FormControl {
    return this.proposalCreateForm.get('Path') as FormControl;
  }

  get Template(): FormControl {
    return this.proposalCreateForm.get('Template') as FormControl;
  }

  get Name(): FormControl {
    return this.proposalCreateForm.get('Name') as FormControl;
  }

  get Approver(): FormControl {
    return this.proposalCreateForm.get('Approver') as FormControl;
  }

  get SubmissionDate(): FormControl {
    return this.proposalCreateForm.get('SubmissionDate') as FormControl;
  }

  fileUpload(event?: any) {
    let fileList: FileList = event.target.files;

    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      if (!this.validateFile(file.name)) {
        this._error.throwError('Unsupported file format');
        return false;
      }
      formData.append("file", file, file.name);
      this.fileName = file.name;
      this.fileData = formData;
      this.proposalCreateForm.patchValue({ 'Template': this.fileName });
    }
  }

  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() == 'docx' || ext.toLowerCase() == 'pptx') {
      return true;
    }
    else {
      return false;
    }
  }



  toggleView(): void {
    if (this.router.url === '/deals/editDocument') {
      this.showStatus = true;
    } else {
      this.showStatus = false;
    }

  }




  // templateChanged(event: MatRadioChange): void {
  //   if (event.value == '1') {
  //     this.showTemplate = true;
  //     const path = this.proposalCreateForm.get('Path');
  //     path.clearValidators();
  //     this.Template.setValidators(Validators.required);
  //   } else {
  //     this.showTemplate = false;
  //     this.Template.clearValidators();
  //     const path = this.proposalCreateForm.get('Path');
  //     path.setValidators(Validators.required);      
  //   }
  // }


  // onTemplateChange(): string {
  //   console.log(this.Template.value);
  //   if (this.Template.value != undefined || this.Template.value !=  null) {
  //     return 'C:\\WittyParrot'
  //   } else {
  //     return this.Template.value;
  //   }
  // }

  async uploadDocument() {
    try {
      this.isLoading = true;
      if (this.fileData) {
        console.log()
        
        this.dealService.uploadProposalTemplate(this.fileData)
          .subscribe(res => {
            if (!res.IsError) {
              this.isLoading = false;
              this._error.throwError('Proposal created');
              this.newDocStatusService.setBehaviorView(true);
              this.router.navigate(['deals/existingTabs/techSolution']);
            } else {
              this.isLoading = false;
              this._error.throwError(res.Message)
            }
          }, err => {
            this.isLoading = false;
            this._error.throwError(config.generalErrMsg);
          })
      }
    } catch {
      this.isLoading = false;
      this._error.throwError(config.generalErrMsg);
      return false;
    }
  }


  /**
   * Author: Jithendra R
   * Date: 24-06-2019
   * Modified: 24-06-2019
   * 
   */

  onCancle() {
    this.service.chatBot = false;
    this.service.chatbotDA = false;
    this.service.sideTrans = false;
    this.router.navigate(['/deals/existingTabs/techSolution']);
  }

  onCreate(data: FormGroup): void {
    this.service.chatBot = true;
    this.service.chatbotDA = true;
    this.service.sideTrans = true;
    console.log("Create Proposal")
    if (this.attachmentDetails !== undefined) {
      if (this.attachmentDetails instanceof Object) {
        data.patchValue({
          'Path': this.attachmentDetails.thirdPartyUrl,
          'Template': this.attachmentDetails.fileName,
        });
      }
      if (this.Approver.value !== "") {
        let approverValue = this.Approver.value;
        data.patchValue({
          'Approver': [{
            "Employee":
            {
              "Adid": approverValue.AdId,
              "FullName": approverValue.FullName,
            }
          }]
        });
      } else {
        data.patchValue({
          'Approver': [{
            "Employee":
            {
              "Adid": this.adid,
              "FullName": this.user
            }
          }]
        });
      }
      data.patchValue({
        'Deal': { 'Id': this.deal.id },
        'CreatedBy': this.adid + "|" + this.user,
        'UserID': this.adid,
      });
    } else {
      this.service.validateAllFormFields(data);
      this.isLoading = false;
      return;
    }
    this.isLoading = true;
    if (data.valid) {
      if (this.dealRoleService.dealTeam.IsRoleMappedToUser || this.dealRoleService.dealOwner.IsRoleMappedToUser) {
        try {
          this.dealService.createDocument(data.value)
            .subscribe(async res => {
              console.log("Form data: ", data.value)
              console.log("Response data: ", res)
              if (!res.IsError) {
                if (this.TemplateType.value != 1) {
                  localStorage.setItem('propId', res.ResponseObject.Id);
                  localStorage.setItem('actnId', res.ResponseObject.ProposalActions[0].Id);
                  localStorage.setItem("propUpdate", "1");
                  localStorage.setItem("proSubDate", new Date(data.controls.SubmissionDate.value).toISOString());
                  await this.uploadDocument();
                  console.log("if create")
                } else {
                  this.isLoading = false;
                  this.newDocStatusService.setBehaviorView(true);
                  localStorage.setItem("propUpdate", "1");
                  this._error.throwError(res.Message);
                  console.log("else create")
                  this.service.chatBot = false;
                  this.router.navigate(['deals/existingTabs/techSolution']);
                }
                this.service.chatBot = false;
                this.daService.iframePage = 'OPPORTUNITY_DEALS';
                let bodyDA = {
                  SubVerticalAndFunction:"",
                  page:'OPPORTUNITY_DEALS',
                  wipro:true,
                };
                this.daService.postMessageData = bodyDA;
                this.daService.postMessage(bodyDA);
                this.deleteCache();
              } else {
                this.isLoading = false;
                this._error.throwError(res.Message);
              }

            }, err => {
              this.isLoading = false;
              this._error.throwError(config.generalErrMsg);
            });
        } catch {
          this.isLoading = false;
          this._error.throwError(config.generalErrMsg);
        }
      } else {
        this.isLoading = false;
        this._error.throwError("You don't have sufficient permissions");
        return;
      }
    } else {
      this.service.validateAllFormFields(data);
      this.isLoading = false;
      return;
    }



  }

  getWpListTemplateInfo() {
    this.isLoading = true;
    try {
      this.dealService.wpListTemplateInfo(wpTemplatePayLoad)
        .subscribe((res: any) => {
          this.isLoading = false;
          this.wpListTemplate = res.Templates;
          console.log(this.wpListTemplate, "this.wpListTemplate")
        }, err => {
          this.isLoading = false;
          this._error.throwError('Oops! Failed to fetch data');
        });
    } catch {
      this.isLoading = false;
      this._error.throwError(config.generalErrMsg);
    }

  }


  getCache() {
    console.log("yes ia m in cache")
    let uniqueId = moment().format("DDMMYYYYHHmmss");
    let key = "CreateProposal" + "|" + this.deal.id;
    this.service.GetRedisCacheData(key).subscribe(res => {
      console.log(res, "res ..")
      if (!res.IsError) {
        if (res.ResponseObject) {
          let response: any = JSON.parse(res.ResponseObject);
          this.proposalCreateForm.patchValue({
            Name: response.Name,
            SubmissionDate: response.SubmissionDate,
            TemplateType: response.TemplateType,
            Template: response.Template,
            Path: response.Path,
            Deal: response.Deal,
            CreatedBy: response.CreatedBy,
            UserID: response.UserID,
            SPUniqueId: ['']
          });
          this.proposalCreateForm.controls.TemplateType.setValue(response.TemplateType)
          this.templateChange()
        }

      }

    });

  }

  setCache(formValues) {
    let uniqueId = moment().format("DDMMYYYYHHmmss");
    let key = "CreateProposal" + "|" + this.deal.id;
    this.service.deleteRedisCacheData(key).subscribe(res => {
      if (!res.IsError) {
        this.service.SetRedisCacheData(formValues, key).subscribe(res => {
          console.log("SetRedisCacheData", res);
        })
      }
    });
  }

  deleteCache() {
    let uniqueId = moment().format("DDMMYYYYHHmmss");
    let key = "CreateProposal" + "|" + this.deal.id;
    this.service.deleteRedisCacheData(key).subscribe();
  }






  /** ends here */


  /****************** action owner autocomplete code start ****************** */

  showAction: boolean = false;
  Action: string = "";
  ActionOwnerSwitch: boolean = true;

  ActionOwnerclose() {



    this.ActionOwnerSwitch = false;
  }

  isOwnerChanged: boolean = false;
  appendAction(item) {
    console.log("Owner Change: ", this.isOwnerChanged);
    console.log("appendAction function item", item)
    this.Approver.setValue(item);
    // this.createAction.controls.actionOwnerSysGuid.setValue(item.SysGuid);
    // this.createAction.controls.actionOwnerAdId.setValue(item.AdId);

    this.ActionOwnerSwitch = true;
    this.isOwnerChanged = true;
  }



  selectedAction: {}[] = [];


  /****************** action owner autocomplete code end ****************** */

  /******************Potential wipro solutions  autocomplete code start ****************** */

  showdependent: boolean = false;
  dependent: string;
  dependentSwitch: boolean = true;

  dependentclose() {
    this.dependentSwitch = false;
  }
  appenddependent(value: string, i) {

    this.dependent = value;
    this.selecteddependent.push(this.dependentArr[i])
  }

  dependentArr: {}[] = [

    { index: 0, contact: 'Solution 1', initials: 'SL', value: true },
    { index: 1, contact: 'Solution 2', initials: 'SL', value: false },
    { index: 3, contact: 'Solution 3', initials: 'SL', value: false },
    { index: 4, contact: 'Solution 4', initials: 'SL', value: false },
    { index: 5, contact: 'Solution 5', initials: 'SL', value: false },
    { index: 6, contact: 'Solution 6', initials: 'SL', value: false },

  ]

  selecteddependent: {}[] = [];


  /****************** Potential wipro solutions autocomplete code end ****************** */

  /****************** escalation autocomplete code start ****************** */

  showEscalation: boolean = false;
  Escalation: string = "";
  escalationSwitch: boolean = true;

  escalationclose() {
    this.escalationSwitch = false;
  }

  appendEscalation(value: string) {
    this.Escalation = value;
    this.escalationSwitch = true;
  }

  Escalations: {}[] = [

    { index: 0, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ]

  selectedEscalation: {}[] = [];


  /****************** escalation autocomplete code end ****************** */
  openAttachFilePopup(): void {
    const dialogRef = this.dialog.open(uploadPopup, {
      width: '610px'

    });

  }

  @Output() onFilter: EventEmitter<any> = new EventEmitter();

  @HostListener('window:message', ['$event'])
  onMessage(e) {
    e.preventDefault();
    console.log(e.preventDefault(), 'e.preventDefault()')
    console.log('onMessage', e)
    if (e.origin != this.envr.daCommunicationUrl) {
      return false;
    }
    switch (e.data.selectedContent) {
      case 'true': {
        console.log('yes is true')
        this.Template.setValue(e.data.attachmentDetails[0])
      }
        break
      default:
        break;
    }
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
      if (!res.IsError) {
        this.approvarArr = res.ResponseObject;
        this.isLoading = false;
      } else {
        this.isLoading = false;
        this._error.throwError(res.Message);
      }
    })
  }



}








/****************   upload popup start        **************/

@Component({
  selector: 'upload-popup',
  templateUrl: './upload_popup.html',

})

export class uploadPopup {
  constructor(public dialogRef: MatDialogRef<uploadPopup>, ) { }
}

