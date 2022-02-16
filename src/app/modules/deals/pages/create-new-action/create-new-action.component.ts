import { Component, OnInit } from '@angular/core';
import { DataCommunicationService } from '@app/core';
import { dealService } from '@app/core/services/deals.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ErrorMessage } from '@app/core/services/error.services';
import { Router } from '@angular/router';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { GetSetMethod } from '@app/core/services/deals/deal-setget.service';
import { DomSanitizer } from '@angular/platform-browser';
import { approveActionComponent } from '../existing-deal-details/tabs/deal-calendar/deal-calendar.component';
import { MatDialog } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { newConversationService } from '@app/core/services/new-conversation.service';
import { environment as env } from '@env/environment';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;

@Component({
  selector: 'app-create-new-action',
  templateUrl: './create-new-action.component.html',
  styleUrls: ['./create-new-action.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class CreateNewActionComponent implements OnInit {
  collebration: FormGroup;
  selEscalationcontact='';
  selOwnerName='';
  actionType: any;
  arrowkeyLocation = 0;
  actionModule: any = [];
  userSearch: any;
  templateType: boolean = true;
  Actions: any = [];
  Escalations: {}[] = [];
  approvarArr: {}[] = [];
  membersArr: {}[] = [];
  dependentArr: {}[] = []
  createAction: FormGroup;
  dealOverview: any;
  editActionId: any;
  minDate: Date = new Date();
  wiptoTemplateArray: any = [];
  checkDate: boolean = false;
  isLoading: boolean = false;
  isDealOwnersSearchLoading: boolean = false;
  sendActionFields: any = false;
  approvarArray: any = [];
  documentDetails: any = [];
  rollAccess: boolean = false;
  collebrationURL: any;
  firstTimeNot: any = true;
  adid: any;
  createrId: any;
  moduleName;
  dataForApprover;
  formData: any;
  templateURL: any;
  isOwnerChanged: boolean = false;
  documentChange: boolean = false;
  fileSize: boolean = false;
  listOfEmails = [];
  approvarCheck: any;
  salutationId: any;
  salutaionName: any;
  selectactionType: any = 'Select action type';
  appendmoduleType: any = 'Select Module';
  selecttemplateType: any = 'Select Template';
  actionTypeNameProposal: any;
  actionName: any;
  esclationContactADID:any;

  constructor(
    public service: DataCommunicationService,
    private dealService: dealService,
    private formBuilder: FormBuilder,
    private _error: ErrorMessage,
    public router: Router,
    private encrDecrService: EncrDecrService,
    private getSetData: GetSetMethod,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    public newconversationService: newConversationService,
    public envr : EnvService
  ) {
    this.collebration = this.formBuilder.group({
      token: [''],
    })

    this.createAction = this.formBuilder.group({
      actionType: ['', Validators.required],
      actionName: ['', Validators.required],
      actionModule: [''],
      actionOwner: [''],
      actionOwnerSysGuid: [''],
      actionOwnerAdId: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      templateType: [],
      attachTemplate: [''],
      documentName: [],
      templateTypeWipro: [''],
      templateTypeWiproName: [''],
      approval: [''],
      approvar: [''],
      description: [''],
      member: [],
      addMember: [''],
      escalationcontact: [],
      memberarr: this.formBuilder.array([]),
      actiondependent: [],
      actiondependentarr: this.formBuilder.array([]),
      ProposalStatus: [1]
    })

    //this.isLoading = true;
    this.dealOverview = JSON.parse(this.encrDecrService.get("EncryptionEncryptionEncryptionEn", sessionStorage.getItem('Dealoverview'), "DecryptionDecrip"));
    this.createrId = (this.encrDecrService.get("EncryptionEncryptionEncryptionEn", localStorage.getItem('userID'), "DecryptionDecrip"));
    this.adid = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('adid'), 'DecryptionDecrip');
  }

  clearFormAutoData() {
    console.log("Clear Data:")
    this.service.deleteRedisCacheData('CreateActionForm').subscribe(res => { });
  }

  appendActionType(event) {
    console.log("appendActionType", event);
    this.actionType.map(item => {
      if (event == item.Id) {
        this.salutaionName = item.Name
        this.selectactionType = 'Selected' + this.salutaionName;
      }
    })
  }
  getEscNames(value) {
    debugger
    console.log("getEscNames")
  }
  appendModuleType(event) {
    console.log("appendModuleType", event);
    console.log("Action Module List: ", this.actionModule);
    this.actionModule.map(item => {
      if (event == item.ModuleId) {
        var value = item.ModuleName;
        this.appendmoduleType = 'Selected' + value;
      }
    })
    console.log(this.appendmoduleType);
  }

  appendTemplateType(event) {
    console.log("appendTemplateType", event);
    console.log("Action Module List: ", this.wiptoTemplateArray);
    this.wiptoTemplateArray.map(item => {
      if (event == item.fileURL) {
        var value = item.fileNmae;
        this.selecttemplateType = 'Selected' + value;
      }
    })
    console.log(this.selecttemplateType);
  }

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }
  clearEsclations() {
    this.createAction.patchValue({
      escalationcontact: '',
    })
  }
  clearActionOwner() {
    this.createAction.patchValue({
      actionOwner: '',
    })
  }
  checkWiproTemplate(data) {
    console.log("Hello")
    console.log("This is change dropdown values: ", data)
    this.templateURL = data.fileURL;
    this.createAction.patchValue({ 'templateTypeWipro': data.fileURL });
    this.createAction.patchValue({ 'templateTypeWiproName': data.fileNmae });
    this.documentChange = true;
  }

  checkWiproTemplateMobile(url) {
    console.log("This is change dropdown values: ", url);
    this.templateURL = url;
    this.wiptoTemplateArray.map(item => {
      if (item.fileURL == url) {
        this.createAction.patchValue({ 'templateTypeWipro': item.fileURL });
        this.createAction.patchValue({ 'templateTypeWiproName': item.fileNmae });
      }
    })
    this.documentChange = true;
  }


  fileUpload(event?: any) {
    this.documentChange = true;
    let fileList: FileList = event.target.files;

    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      if (!this.validateFile(file.name)) {
        this._error.throwError('Unsupported file format');
        return false;
      }
      console.log(fileList)
      let fileSize = fileList[0].size / 1024 / 1024;
      if (fileSize < 100) {
        formData.append("file", file, file.name);
        this.createAction.patchValue({ 'documentName': event.target.files[0].name });
        this.createAction.patchValue({ 'attachTemplate': event.target.files[0].name });
        this.formData = formData;
      }
      else {
        this.fileSize = true;;
      }
      console.log(formData)
      //this.uploadDocument(formData);
    }
  }

  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() != 'exe') {
      return true;
    }
    else {
      return false;
    }
  }

  uploadDocument(formData) {
    console.log(formData)
    //this.isLoading = true;
    if (formData) {
      this.dealService.uploadActionTemplate(formData)
        .subscribe(res => {
          console.log(res)
          //this.createAction.patchValue({ 'attachTemplate': res.ResponseObject.Path });
          if (!res.IsError) {
            this._error.throwError(res.Message);
            //this.isLoading = false;
          } else {
            this._error.throwError(res.Message);
            //this.isLoading = false;
          }
          this.router.navigate(['deals/existingTabs/calendar']);
        }, err => {
          this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
          //this.isLoading = false;
        })
    }
  }

  checkDates() {
    let first = this.createAction.controls.startDate.value;
    let second = this.createAction.controls.endDate.value;
    console.log("First Date:", first, "Second Date:", second, "Current Date: ", new Date());
    this.minDate = new Date(first);
    if (this.minDate > new Date()) {
      this.minDate = this.minDate;
    }
    else {
      this.minDate = new Date();
    }

    if (first + 1 > second) {
      this.checkDate = true;
    }
    else {
      this.checkDate = false;
      console.log("Right");
    }
  }

  templateName(name) {
    console.log(name)
  }

  logMethod(actionId, actionName) {
    console.log("logMethod Called")
    //JWT Token Decrypt
    const base64Url = localStorage.getItem('token').split('.')[1];
    const base64 = (base64Url.replace('-', '+')).replace('_', '/');
    const decodedToken = JSON.parse(window.atob(base64));
    let collebrationActionId;

    if (this.listOfEmails) {
      collebrationActionId = {
        "environment": "QA",
        "hostApplication": "L2O",
        "appSecret": "da3068e9-e480-4a0c-aae4-00e0a9d014b9",
        "viewMode": "embeded",
        "parentObjectId": actionId,
        "parentObjectName": actionName + actionId,
        "authToken": localStorage.getItem('token'),
        "memberlist": this.listOfEmails
      }
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl('./assets/l2o.html#' + btoa(JSON.stringify(collebrationActionId)));
  }

  onSubmit() {
    console.log(this.dealOverview.id)
    let createrName = localStorage.getItem('upn');
    let createrId = (this.encrDecrService.get("EncryptionEncryptionEncryptionEn", localStorage.getItem('userID'), "DecryptionDecrip"));
    var data = this.createAction.value;
    console.log(data)
    console.log()

    if (this.createAction.valid && !this.checkDate && this.editActionId && !this.sendActionFields) {
      console.log("Edit Action for users................");
      console.log(this.createAction.value)
      let data = this.createAction.value;
      console.log("Form Date: ", data);
      let documentName;
      let documentUrl;
      let approval;
      let approvar;
      let actionType;
      if (this.actionTypeNameProposal > 0) {
        console.log(this.dataForApprover);
        let preValues = this.dataForApprover;
        let data = this.createAction.value;
        console.log(data)
        let status;
        let actionOwner = '';
        let actionOwnerAdId = '';
        let actionOwnerSysGuid = '';
        if (data.ProposalStatus == undefined) {
          status = '1'
        } else {
          status = data.ProposalStatus;
        }

        if(data.actionOwner != '' && data.actionOwnerAdId != ''){
          actionOwner = data.actionOwner;
          actionOwnerAdId = data.actionOwnerAdId;
          actionOwnerSysGuid = data.actionOwnerSysGuid;
        } else {
          actionOwner = preValues.Owner.FullName;
          actionOwnerAdId = preValues.Owner.AdId;
          actionOwnerSysGuid = preValues.Owner.SysGuid;
        }
        console.log("hello: ",data.actionModule);

        let input = {
          "UserID": this.adid,
          "ID": this.editActionId,
          "Name": preValues.Name,
          "Document": { "Name": this.removeUnUsedData(preValues.Document.Name), "Url": preValues.Document.Url },
          "Deal": { "Id": this.dealOverview.id },
          "ActionType": { "Id": preValues.ActionType.Id },
          "Module": { "Id": data.actionModule, "ModuleName": data.actionModule != '' ? this.moduleName : '' },
          "Owner": { "FullName": actionOwner, "SysGuid": actionOwnerSysGuid, "AdId":actionOwnerAdId },
          "StartDate": preValues.StartDate,
          "EndDate": data.endDate,
          "Escalation": preValues.Escalation,
          "TemplateType": preValues.TemplateType,
          "TemplateUrl": this.removeUnUsedData(preValues.TemplateUrl),
          "Description": preValues.Description,
          "Template": this.removeUnUsedData(preValues.Document.Name),
          "Status": status,
          "CustomerContact": this.selectedmembers,
          "DependentActions": this.selecteddependent,
          "CreatedBy": preValues.CreatedBy,
          "Approver": preValues.Approver,
          "IsApprovalRequired": preValues.IsApprovalRequired,
          "IsTemplateModified": preValues.IsTemplateModified,
          //"isOwnerChanged":this.isOwnerChanged,
        }

        console.log(input);
        this.editProAndCusAction(input);
        this.editDocument(preValues, data);
      } else {
        if (data.templateType == 1) {
          documentName = data.templateTypeWiproName;
          documentUrl = data.templateTypeWipro;
        }
        else {
          documentName = data.documentName;
          documentUrl = data.attachTemplate;
          if (documentName === documentUrl) {
            documentUrl = data.templateTypeWipro;
          }
        }

        if (data.approval) { approval = true }
        else { approval = false }
        if (this.approvarArray != undefined) { approvar = this.approvarArray }
        else {
          approvar = {
            "SysGuid": "",
            "FullName": "",
            "AdId": ""
          }
        }
        console.log("hello: ",data.actionModule);
        let input1 = {
          "UserID": this.adid,
          "ID": this.editActionId,
          "Name": data.actionName,
          "Document": { "Name": documentName, "Url": documentUrl },
          "Deal": { "Id": this.dealOverview.id },
          "ActionType": { "Id": data.actionType },
          "Module": { "Id": data.actionModule, "ModuleName": data.actionModule != undefined ? this.moduleName : '' },
          "Owner": { "FullName": data.actionOwner, "SysGuid": data.actionOwnerSysGuid, "AdId": data.actionOwnerAdId },
          "StartDate": data.startDate,
          "EndDate": data.endDate,
          "EscalationDetails": {"FullName":data.escalationcontact, "ADID":this.esclationContactADID},
          "TemplateType": data.templateType,
          "TemplateUrl": this.templateURL,
          "Description": data.description,
          "Template": documentName,
          "Status": data.ProposalStatus,
          "CustomerContact": this.selectedmembers,
          "DependentActions": this.selecteddependent,
          "CreatedBy": { "SysGuid": createrId, "FullName": createrName, "AdId": this.adid },
          "Approver": approvar,
          "IsApprovalRequired": approval,
          "IsTemplateModified": this.documentChange,
          //"isOwnerChanged":this.isOwnerChanged,
        }
        console.log(input1)
        this.editProAndCusAction(input1);
      }
    }
    else if (this.createAction.valid && this.createAction.controls.approvar.valid) {
      console.log("Send for approver");
      console.log(this.dataForApprover);
      let preValues = this.dataForApprover;
      let documentName;
      let documentUrl;
      let approvar;
      console.log(data.templateTypeWiproName)
      if (data.templateType == 1) {
        console.log("Inside Wipro Template")
        documentName = data.templateTypeWiproName;
        documentUrl = data.templateTypeWipro;
      }
      else {
        console.log("Document Template")
        documentName = data.documentName;
        documentUrl = data.attachTemplate;
      }

      if (this.approvarArray != undefined) {
        approvar = this.approvarArray
      }
      else {
        approvar = {
          "SysGuid": "",
          "FullName": "",
          "AdId": ""
        }
      }
      console.log(preValues.Owner);
      console.log("Document Name:", documentName, "Document URL: ", documentUrl)
      let input = {
        "UserID": this.adid,
        "ID": this.editActionId,
        "Name": preValues.Name,
        "Document": { "Name": preValues.Document.Name, "Url": preValues.Document.Url },
        "Deal": { "Id": this.dealOverview.id },
        "ActionType": { "Id": preValues.ActionType.Id },
        "Module": { "Id": data.actionModule, "ModuleName": data.actionModule != '' ? this.moduleName : '' },
        "Owner": { "FullName": preValues.Owner.FullName, "SysGuid": preValues.Owner.SysGuid, "AdId": preValues.Owner.AdId },
        "StartDate": preValues.StartDate,
        "EndDate": preValues.EndDate,
        "EscalationDetails": {"FullName":preValues.escalationcontact, "ADID":this.esclationContactADID},
        "TemplateType": preValues.TemplateType,
        "TemplateUrl": preValues.TemplateUrl,
        "Description": preValues.Description,
        "Template": preValues.Document.Name,
        "Status": '4',
        "CustomerContact": preValues.CustomerContact,
        "DependentActions": preValues.DependentActions,
        "CreatedBy": { "SysGuid": createrId, "FullName": createrName, "AdId": this.adid },
        "Approver": approvar,
        "IsApprovalRequired": data.approval,
        "IsTemplateModified": this.documentChange,
        //"isOwnerChanged":this.isOwnerChanged,
      }
      console.log(input)
      this.isLoading = true;
      this.dealService.editAction(input).subscribe(res => {
        console.log(res)
        if (!res.IsError) {
          this.service.deleteRedisCacheData('CreateActionForm').subscribe(res => { });
          this._error.throwError(res.Message);
          localStorage.setItem('checkAction', '1');
          localStorage.setItem('actionID', this.editActionId);
          this.uploadDocument(this.formData);
          this.wittyAPI(res.ResponseObject.Id, res.Message);
          this.router.navigate(['deals/existingTabs/calendar']);
          this.isLoading = false;
        }
        else {
          this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
          this.isLoading = false;
        }
      }, err => {
        this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
        this.isLoading = false;
      })
    }
    else {
      if (this.sendActionFields) {
        this.approvarCheck = true;
        this.service.validateAllFormFields(this.createAction.controls.approvar.valid);
        return;
      }
      else {
        this.service.validateAllFormFields(this.createAction)
        return;
      }
    }
    //}
    // else {
    //   this.service.validateAllFormFields(this.createAction)
    //   return;
    // }
  }

  removeUnUsedData(data) {
    if (data.includes("???")) {
      return this.templateURL.replace("???", "–").replace("???", "–");
    }
    else {
      return this.templateURL.replace(/[?]/g, "–");
    }
  }

  editProAndCusAction(input1) {
    console.log(input1)
    this.isLoading = true;
    this.dealService.editAction(input1).subscribe(res => {
      console.log(res)
      if (!res.IsError) {
        this.service.deleteRedisCacheData('CreateActionForm').subscribe(res => { });
        console.log(res)
        if (!res.ResponseObject.IsValidPlanDate) {
          this.openApprove("Action Name", res.Message, 'edit');
          this.isLoading = false;
        }
        else {
          this._error.throwError(res.Message);
          localStorage.setItem('checkAction', '1');
          localStorage.setItem('actionID', this.editActionId);
          this.wittyAPI(res.ResponseObject.Id, res.Message);
          if (this.formData) {
            this.uploadDocument(this.formData);
            //this.isLoading = false;
          }
          else {
            this.router.navigate(['deals/existingTabs/calendar']);
            this.isLoading = false;
          }
        }
      }
      else {
        this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
        this.isLoading = false;
      }
    }, err => {
      this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
      this.isLoading = false;
    });
  }

  editDocument(preValues, updateData) {
    console.log("Prev Data: ", preValues);
    console.log("Update Data: ", updateData);
    let input = {
      "Id": this.actionTypeNameProposal,
      "Name": preValues.Name,
      "SubmissionDate": updateData.endDate,
      "TemplateType": preValues.TemplateType,
      "Template": this.removeUnUsedData(preValues.Document.Name),
      "Path": this.removeUnUsedData(preValues.Document.Url),
      "ModifiedBy": this.adid + "|" + localStorage.getItem('upn'),
      "UserID": this.adid,
      "IsTemplateModified": false
    }
    console.log("Proposal Input: ", input);

    this.dealService.editDocument(input).subscribe(res => {
      console.log(res);
    })
  }

  autoSaveFormData() {
    console.log("Auto save form");
    this.service.deleteRedisCacheData('CreateActionForm').subscribe(res => { });
    this.service.SetRedisCacheData(this.createAction.value, 'CreateActionForm').subscribe(res => {
      console.log("Set Value:", res);
    })
  }

  autoSavePreData() {
    this.service.GetRedisCacheData('CreateActionForm').subscribe(res => {
      console.log("Pre Data: ", res);
      if (res != '' || res != null || res != undefined) {
        let data: any = JSON.parse(res.ResponseObject);
        this.cacheDataPatchValuesForAutoSaved(data)
      }
    });
  }

  cacheDataPatchValuesForAutoSaved(data) {
    console.log("My Data: ", data);
    this.createAction.controls.actionOwner.setValue(data.actionOwner);
    this.createAction.controls.actionOwnerAdId.setValue(data.actionOwnerAdId);
    this.createAction.patchValue({
      "actionType": data.actionType,
      "actionName": data.actionName,
      "actionModule": data.actionModule,
      "startDate": data.startDate,
      "endDate": data.endDate,
      "escalationcontact": data.escalationcontact,
      "templateType": data.templateType,
      "attachTemplate": data.attachTemplate,
      "approvar": data.approvar,
      "approval": data.approval,
      "description": data.description,
      "actiondependentarr": data.actiondependentarr,
      "ProposalStatus": data.ProposalStatus,
      "memberarr": data.memberarr
    });

    data.actiondependentarr.map(item => {
        item.Id = item.Id,
        item.contact = item.Name,
        item.Name = item.Name
    });
    this.selecteddependent = data.actiondependentarr;

    data.memberarr.map((item, index) => {
      item.index = index,
        item.contact = item.FullName,
        item.initials = item.FullName
    })
    this.selectedmembers = data.memberarr;

    console.log(this.selectedmembers);
  }

  onCreateAction() {
    console.log("OnCreate Method")
    console.log('form value', this.createAction.value)
    let createrName = localStorage.getItem('upn');
    let createrId = (this.encrDecrService.get("EncryptionEncryptionEncryptionEn", localStorage.getItem('userID'), "DecryptionDecrip"));
    let data = this.createAction.value;
    console.log(this.createAction)
    console.log(this.checkDate)
    console.log(this.createAction.valid)
    console.log(data)
    if (this.createAction.valid && !this.checkDate) {
      console.log("Validation Complete.");
      var documentName;
      var documentUrl;
      let approval;
      let approvar;
      let actionOwner;
      let actionOwnerAdId;
      let actionOwnerSysGuid;
      console.log(this.approvarArray)
      console.log(this.approvarArray.length)
      console.log(data.templateType)
      if (data.templateType == 1) {
        console.log("Inside Wipro Template")
        documentName = data.templateTypeWiproName;
        documentUrl = data.templateTypeWipro;
      }
      else {
        console.log("Document Template")
        documentName = data.documentName;
        documentUrl = data.attachTemplate;
      }
      if (data.approval) {
        approval = true
      }
      else {
        approval = true
      }
      if (data.actionOwner == '' && data.actionOwnerAdId == '') {
        actionOwnerAdId = this.adid;
        actionOwner = createrName;
        actionOwnerSysGuid = createrId;
      }
      else {
        actionOwnerAdId = data.actionOwnerAdId;
        actionOwner = data.actionOwner;
        actionOwnerSysGuid = data.actionOwnerSysGuid;
      }

      console.log(approvar)
      var input = {
        "UserID": this.adid,
        "Name": data.actionName,
        "Document": { "Name": documentName, "Url": documentUrl },
        "Deal": { "Id": this.dealOverview.id },
        "ActionType": { "Id": data.actionType },
        "Module": { "Id": data.actionModule, "ModuleName": this.moduleName },
        "Owner": { "FullName": actionOwner, "SysGuid": actionOwnerSysGuid, "AdId": actionOwnerAdId },
        "CreatedBy": { "SysGuid": createrId, "FullName": createrName, "AdId": this.adid },
        "StartDate": data.startDate,
        "EndDate": data.endDate,
        "EscalationDetails": {"FullName":data.escalationcontact, "ADID":this.esclationContactADID},
        "TemplateType": data.templateType,
        "TemplateUrl": data.templateTypeWipro,
        "Description": data.description,
        "Template": documentName,
        "Status": data.ProposalStatus,
        "CustomerContact": this.selectedmembers,
        "DependentActions": this.selecteddependent,
        "Approver": { "SysGuid": actionOwnerSysGuid, "FullName": actionOwner , "AdId": this.adid},
        "IsApprovalRequired": approval,
      }
      console.log(input)
      this.isLoading = true;
      this.dealService.createAction(input).subscribe(res => {
        console.log(res)
        if (!res.IsError) {
          this.service.deleteRedisCacheData('CreateActionForm').subscribe(res => { });
          this._error.throwError(res.Message);
          localStorage.setItem('actionID', res.ResponseObject.Id);
          localStorage.setItem('checkAction', '1');
          this.wittyAPI(res.ResponseObject.Id, res.Message);
          if (this.formData) {
            this.uploadDocument(this.formData);
            //this.isLoading = false;
          }
          else {
            this.router.navigate(['deals/existingTabs/calendar']);
            this.isLoading = false;
          }
        }
        else {
          this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
          this.isLoading = false;
        }
      }, err => {
        this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
        this.isLoading = false;
      });
    }
    else {
      console.log("Else Part");
      this.service.validateAllFormFields(this.createAction);
      return;
    }
  }

  oneDateExtra(date) {
    let ms = new Date(date).getTime() + 86400000;
    let tomorrow = new Date(ms);
    return tomorrow;
  }

  moduleMethod(data) {
    console.log("Hello", data);
    this.actionModule.map(item=>{
      if(item.ModuleId == data){
        this.moduleName = item.ModuleName;
      }
    });
  }

  wittyAPI(id, message) {
    let input = {
      "parentObjectId": id,
      "appSecret": "da3068e9-e480-4a0c-aae4-00e0a9d014b9",
      "subject": "Deal",
      "body": message
    }
    this.dealService.wittyAfterAction(input).subscribe(res => {
      console.log(res)
    })
  }

  templateTypeRadio(event) {
    if (event.value == 1) {
      console.log("wipro selected")
      this.templateType = true;
      this.createAction.get('templateTypeWipro').setValidators([Validators.required]);
      this.createAction.get('templateTypeWipro').updateValueAndValidity();

      this.createAction.get('attachTemplate').clearValidators();
      this.createAction.get('attachTemplate').updateValueAndValidity();
    }
    else {
      this.templateType = false;
      console.log("wipro not selected")
      this.createAction.get('attachTemplate').setValidators([Validators.required]);
      this.createAction.get('attachTemplate').updateValueAndValidity();

      this.createAction.get('templateTypeWipro').clearValidators();
      this.createAction.get('templateTypeWipro').updateValueAndValidity();
    }
  }

  /****************** action owner autocomplete code start ****************** */

  showAction: boolean = false;
  Action: string = "";
  ActionOwnerSwitch: boolean = false;

  ActionOwnerclose() {
    console.log("Closing")
    this.ActionOwnerSwitch = false;
  }

  appendAction(item) {
    console.log("Owner Change: ", this.isOwnerChanged);
    console.log("appendAction function item", item)
    this.createAction.controls.actionOwner.setValue(item.contact);
    this.createAction.controls.actionOwnerSysGuid.setValue(item.SysGuid);
    this.createAction.controls.actionOwnerAdId.setValue(item.AdId);

    this.ActionOwnerSwitch = true;
    this.isOwnerChanged = true;
  }

  selectedAction: {}[] = [];


  /****************** action owner autocomplete code end ****************** */

  /****************** Escalation contact autocomplete code start ****************** */

  showAEscalation: boolean = false;
  Escalation: string = "";
  EscalationSwitch: boolean = false;

  Escalationclose() {
    this.EscalationSwitch = false;
  }

  appendEscalation(item) {
    console.log("appendAction function item", item)
    this.createAction.controls.escalationcontact.setValue(item.contact);
    this.esclationContactADID = item.AdId;
    this.EscalationSwitch = true;
    this.autoSaveFormData();
    this.Escalationclose();
  }

  selectedEscalation: {}[] = [];
  showOwner: boolean = false;


  /****************** Escalation contact autocomplete code end ****************** */
  /****************** approvar contact autocomplete code start ****************** */

  showApprovar: boolean = false;
  approvar: string = "";
  ApprovarSwitch: boolean = false;


  appendApprovar(item) {
    let approvar = [];
    console.log("appendAction function item", item)
    approvar.push({
      "FullName": item.contact,
      "SysGuid": item.SysGuid,
      "AdId": item.AdId
    })
    console.log(approvar)
    this.approvarArray = approvar[0];
    console.log(this.approvarArray)
    this.approvarCheck = false;
    this.createAction.controls.approvar.setValue(item.contact);
    this.ApprovarSwitch = false;
  }

  selectedApprovar: {}[] = [];


  /****************** approvar contact autocomplete code end ****************** */

  /******************Potential wipro solutions  autocomplete code start ****************** */

  showdependent: boolean = false;
  dependent: string;
  dependentSwitch: boolean = false;

  dependentclose() {
    this.dependentSwitch = false;
  }

  appenddependent(value) {
    console.log('values', value);
    console.log("Selected Array: ", this.selecteddependent);
    //const control = <FormArray>this.createAction.controls.actiondependentarr;
    if(this.selecteddependent.length > 0){
      let temArray:any = [];
      this.selecteddependent.map(item=>{
        temArray.push(item.Id)
      });
      if(temArray.indexOf(value.Id) != -1){
        
      } else {
        this.selecteddependent.push({
          Id: value.Id,
          Name: value.contact,
          LinkActionType: 1
        });
      }
    } else {
      this.selecteddependent.push({
        Id: value.Id,
        Name: value.contact,
        LinkActionType: 1
      });
    }
    this.createAction.get('actiondependent').setValue('');
  }

  deleteMethod(value) {
    console.log(value)
    console.log(this.selecteddependent)
    console.log(this.createAction.controls.actiondependentarr.value);
    for(let j=0; j < this.selecteddependent.length; j++){
      if(this.selecteddependent[j].Id == value.Id){
        this.selecteddependent.splice(j, 1);
        //this.createAction.controls.actiondependentarr.value.splice(j, 1);
        break;
      }
    }
  }
  selecteddependent:any=[];


  /****************** Potential wipro solutions autocomplete code end ****************** */

  /******************add members  autocomplete code start ****************** */

  showmembers: boolean = false;
  members: string;
  membersSwitch: boolean = false;

  membersclose() {
    this.membersSwitch = false;
  }

  selectedmembers:any = [];
  appendmembers(value) {
    console.log(value)
    if(this.selectedmembers.length > 0){
      let temArray:any = [];
      this.selectedmembers.map(item=>{
        temArray.push(item.Guid)
      });
      if(temArray.indexOf(value.AdId) == -1){
        this.selectedmembers.push({
          Guid: value.AdId,
          FullName: value.contact,
          LinkActionType: 1
        });
      } 
    } else {
      this.selectedmembers.push({
        Guid: value.AdId,
        FullName: value.contact,
        LinkActionType: 1
      });
    }
    this.createAction.get('member').setValue('');
  }

  deleteMember(value) {
    console.log(value)
    for(let j=0; j < this.selectedmembers.length; j++){
      if(this.selectedmembers[j].Guid == value.Guid){
        this.selectedmembers.splice(j, 1);
        break;
      }
    }
  }

  /****************** add members autocomplete code end ****************** */

  rollForUser() {
    let enpData = JSON.parse(this.encrDecrService.get("EncryptionEncryptionEncryptionEn", sessionStorage.getItem('userInfo'), "DecryptionDecrip"));
    console.log(enpData.EmployeeId)
    let checkAccess: any;
    let input = {
      "AdId": enpData.EmployeeId,
    }
    //this.isLoading = true;
    this.dealService.rollForUser(input).subscribe(res => {
      console.log(res);
      if (res.ReturnFlag == 'S') {
        let rollOpportunity;
        let rollDealTeamMember;
        let rollModuleTeamMember;
        let rollDealOwner;
        let rollModuleOwner;
        res.Output.map(item => {
          //console.log("Roll ID: ", item.RoleID, "Check Roll", item.IsRoleMappedToUser);
          if (item.RoleID == 16) {
            rollDealTeamMember = item.IsRoleMappedToUser;
          }
          else if (item.RoleID == 17) {
            rollModuleTeamMember = item.IsRoleMappedToUser;
          }
          else if (item.RoleID == 10119) {
            rollOpportunity = item.IsRoleMappedToUser;
          }
          else if (item.RoleID == 1) {
            rollDealOwner = item.IsRoleMappedToUser;
          }
          else if (item.RoleID == 4) {
            rollModuleOwner = item.IsRoleMappedToUser;
          }
        });

        if (rollDealTeamMember || rollModuleTeamMember || rollOpportunity || rollDealOwner || rollModuleOwner) {
          console.log("Access: ", "true")
          this.rollAccess = true;
          this.getActionType();
          this.getActionModule();
          this.emailList();
          this.documentHistory();
          //this.wiproTemplate();
          //this.isLoading = false;
        }
        else {
          this.rollAccess = false;
          console.log("Not Access: ", "False")
        }
      }
    }, err => {
      this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
      //this.isLoading = false;
    })
  }

  emailList() {
    let userInfo = this.encrDecrService.get(
      "EncryptionEncryptionEncryptionEn",
      sessionStorage.getItem("userInfo"),
      "DecryptionDecrip"
    );

    let userInfo1 = JSON.parse(userInfo);
    console.log(userInfo1);
    console.log(userInfo1.EmployeeMail);

    let input = {
      "DealId": this.dealOverview.id,
      "TeamType": "DEALOWNERTEAMMODULETEAM"
    }
    //this.isLoading = true;
    this.dealService.emailList(input).subscribe(res => {
      console.log(res)
      this.listOfEmails.push(userInfo1.EmployeeMail);
      res.Output.EmployeeList.map(item => {
        this.listOfEmails.push(
          item.EmployeeMail
        )
      })
      //this.isLoading = false;
    }, err => {
      this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
      //this.isLoading = false;
    })

    console.log(this.listOfEmails)
  }

  checkApproval(id) {
    console.log("Check Approve: ", id);
    if (id == '1') {
      this.createAction.controls['approvar'].enable();
    }
    else {
      this.createAction.controls['approvar'].disable();
    }
  }

  ngOnInit() {
    this.autoSavePreData();
    this.rollForUser();

    if (localStorage.getItem("send")) {
      this.sendActionFields = true;
      console.log("Send for approver")

      this.createAction.get('approval').setValidators([Validators.required]);
      this.createAction.get('approval').updateValueAndValidity();

      this.createAction.get('approvar').setValidators([Validators.required]);
      this.createAction.get('approvar').updateValueAndValidity();

      localStorage.removeItem("send");
    }

    // this.createAction.get('templateTypeWipro').setValidators([Validators.required]);
    // this.createAction.get('templateTypeWipro').updateValueAndValidity();
  }

  documentHistory() {
    //this.isLoading = true;
    let id = this.getSetData.getData();
    console.log(id)
    let input = { "ID": id, "UserID": this.adid }

    this.dealService.documentHistory(input).subscribe(res => {
      console.log(res);
      if (!res.IsError) {
        //this.documentDetails = res.ResponseObject;
        console.log(this.documentDetails);
        //this.isLoading = false;
      }
    }, err => {
      this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
      //this.isLoading = false;
    })
  }

  downloadDocument(url: any) {
    console.log("hello Download", url);

    let input = { "Path": url }
    this.isLoading = true;
    this.dealService.downloadDocument(input).subscribe(res => {
      let downloadUrls = [];
      var binary_string = window.atob(res.ResponseObject.Base64String);
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      const blob = new Blob([bytes.buffer]);
      let Filename = res.ResponseObject.FileName;
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = Filename;

      if (this.envr.envName === 'MOBILEQA') {
        console.log("Inside the mobile View");
        // this.newconversationService.attachmentList.forEach(item => {
        //   downloadUrls.push({ Url: url, Name: item.Name })
        // })
        //this.downloadAllInMobile(downloadUrls)
        this.downloadFile(url, Filename);
        return;
      } else {
        console.log("Inside the desktop View");
        link.click();
        window.URL.revokeObjectURL(link.href);
        this._error.throwError("File downloaded successfully.");
      }
      this.isLoading = false;
    }, error => {
      this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
      this.isLoading = false;
    })
  }

  downloadFile(url, filename) {
    console.log("Mobile download method");
    var fileTransfer = new FileTransfer();
    var uri = encodeURI(url);
    var fileURL = "///storage/emulated/0/Download/" + filename;
    fileTransfer.download(uri, fileURL,
      function (entry) {
        console.log("download complete: " + entry.toURL());
        this._error.throwError("File downloaded successfully.")
      },
      function (error) {
        console.log("download error source " + error.source);
        console.log("download error target " + error.target);
        console.log("download error code" + error.code);
      },
      null,
      {})
  }

  downloadAllInMobile(fileInfo) {
    fileInfo.forEach(function (value, idx) {
      const response = value;
      setTimeout(() => {
        var fileTransfer = new FileTransfer();
        var uri = encodeURI(response.Url);
        var fileURL = "///storage/emulated/0/DCIM/" + response.Name;

        fileTransfer.download(
          uri, fileURL, function (entry) {
            console.log("download complete: " + entry.toURL());
          },

          function (error) {
            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("download error code" + error.code);
          },

          null, {
          //     "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
          //  } headers: {
          // 
        }
        );
      }, idx * 2500)
    });
  }

  sendForRework() {
    let input = {
      "Id": this.editActionId,
      "Guid": this.createrId
    }
    this.isLoading = true;
    this.dealService.reWorkAction(input).subscribe(res => {
      console.log(res)
      this._error.throwError(res.Message);
      localStorage.setItem('checkAction', '1');
      this.router.navigate(['deals/existingTabs/calendar']);
      this.isLoading = false;
    }, error => {
      this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
      this.isLoading = false;
    })
  }

  approvarAction() {
    let input = { "Id": this.editActionId, "UserID": this.adid }
    this.isLoading = true;
    this.dealService.approvarAction(input).subscribe(res => {
      console.log(res);
      if (!res.IsError) {
        if (res.ResponseObject.IsPresentDealDependetAction) {
          this.openApprove("Action Name", res.Message, 'close');
          localStorage.setItem('checkAction', '1');
          this.router.navigate(['deals/existingTabs/calendar']);
          this.isLoading = false;
        }
        else {
          localStorage.setItem('checkAction', '1');
          this.router.navigate(['deals/existingTabs/calendar']);
          this._error.throwError(res.Message);
          this.isLoading = false;
        }
      }
    }, error => {
      this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
      this.isLoading = false;
    })
  }

  openApprove(actionName, actionMessage, actionMode): void {
    const dialogRef = this.dialog.open(approveActionComponent, {
      width: '400px',
      data: { 'actionName': actionName, 'message': actionMessage, 'mode': actionMode }
    });

    dialogRef.afterClosed().subscribe(res => {
      localStorage.setItem('checkAction', '1');
      this.router.navigate(['deals/existingTabs/calendar']);
    })
  }

  getActionModule() {
    var input = {
      "DealHeaderID": this.dealOverview.id
    };
    //this.isLoading = true;
    this.dealService.actionModule(input).subscribe(res => {
      console.log(res)
      this.actionModule = res.Output.AssignDealsDealControls;
      console.log(this.actionModule)

      //Calling Action Edit Method
      this.editActionId = this.getSetData.getData();
      if (this.editActionId) {
        this.editActon(this.getSetData.getData());
        this.getSetData.setData(false);
        console.log(this.editActionId)
      }
      //this.isLoading = false;
    }, err => {
      this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
      //this.isLoading = false;
    });
  }

  getActionType() {
    this.isLoading = true;
    var input = {};
    this.dealService.actionType(input).subscribe(res => {
      this.isLoading = false;
      console.log(res)
      this.actionType = res.ResponseObject;
    }, err => {
      this.isLoading = false;
      this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
    });
  }

  wiproTemplate() {
    //this.isLoading = true;
    var input = {
      "docTypes": [
        "Templates"],
      "fields": [
        {
          "objectName": "Deal"
        }
      ]
    }

    this.dealService.wpListTemplateInfo(input).subscribe((res: any) => {
      if (res) {
        //this.templateWipro(res);
      }
      //this.isLoading = false;
    }, error => {
      console.log(error)
      this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
      //this.isLoading = false;
    });
  }

  templateWipro(response) {
    console.log(response.Templates);
    let input = { "Input": response.Templates }
    console.log(input);
    //this.isLoading = true;
    this.dealService.wiproTemplate(input).subscribe((res: any) => {
      console.log(res.length);
      let template: any = [];
      res.map(item => {
        console.log(item)
        item.attachmentDetails.map(items => {
          var obj: any = {}
          this.wiptoTemplateArray.push({
            "fileNmae": items.fileName,
            "fileURL": items.thirdPartyUrl
          })
        })
      })
      console.log(this.wiptoTemplateArray);
      //this.isLoading = false;
    })

    var template: any = [];
    //this.templateWipro(res.Template)
    //   res.Templates.map(item => {
    //     console.log(item.attachmentDetails)
    //     console.log(item.attachmentDetails[0].fileName)
    //     item.attachmentDetails.map(items => {
    //       var obj: any = {}
    //       this.wiptoTemplateArray.push({
    //         "fileNmae": items.fileName,
    //         "fileURL": items.thirdPartyUrl
    //       })
    //     })
    //   })
    //   this.templateWipro();
  }

  editActon(inputId) {
    this.isLoading = true;
    this.dealService.detailsAction({ "Id": inputId, "UserID": this.adid }).subscribe(res => {
      if (!res.IsError) {
        let templateURL;
        this.dataForApprover = res.ResponseObject;
        this.templateURL = res.ResponseObject.TemplateUrl;
        if (this.templateURL != '') {
          if (this.templateURL.includes("???")) {
            templateURL = this.templateURL.replace("???", "–").replace("???", "–");
          }
          else {
            templateURL = this.templateURL.replace(/[?]/g, "–");
          }
          console.log(templateURL);
        }
        else {
          templateURL = res.ResponseObject.Document.Url;
        }
        this.collebrationURL = this.logMethod(inputId, res.ResponseObject.Name);
        this.appendTemplateType(templateURL);
        if (res.ResponseObject.TemplateType == 1) {
          this.templateType = true;
          this.createAction.patchValue({
            "templateTypeWiproName": res.ResponseObject.Document.Name,
          })
        }
        else {
          this.templateType = false;
          this.createAction.patchValue({
            "documentName": res.ResponseObject.Document.Name
          })
        }
        
        this.selectedmembers = res.ResponseObject.CustomerContact;
        res.ResponseObject.DependentActions.map(item=>{
          this.selecteddependent.push({
            Id: item.Id,
            Name: item.Name,
            LinkActionType: 1
          });
        });
        console.log(this.selecteddependent)
        this.approvarArray = res.ResponseObject.Approver;
        this.createAction.controls.actionOwnerSysGuid.setValue(res.ResponseObject.Owner.SysGuid);
        this.createAction.controls.actionOwnerAdId.setValue(res.ResponseObject.Owner.AdId);
        console.log(res.ResponseObject.Module.Id)
        res.ResponseObject.Module.Id != -1 ? this.moduleName = res.ResponseObject.Module.Value : this.moduleName = '';
        //this.moduleName = res.ResponseObject.Module.Value;
        this.appendActionType(res.ResponseObject.ActionType.Id);
        this.appendModuleType((res.ResponseObject.Module.Id).toString());
        this.actionName = res.ResponseObject.Name;
        this.esclationContactADID = res.ResponseObject.EscalationDetails.ADID;
        this.createAction.patchValue({
          "actionType": res.ResponseObject.ActionType.Id,
          "actionName": res.ResponseObject.Name,
          "actionModule": (res.ResponseObject.Module.Id).toString(),
          "actionOwner": res.ResponseObject.Owner.FullName,
          "startDate": res.ResponseObject.StartDate,
          "endDate": res.ResponseObject.EndDate,
          "escalationcontact": res.ResponseObject.EscalationDetails.FullName,
          "templateType": res.ResponseObject.TemplateType,
          "attachTemplate": res.ResponseObject.Document.Name,
          "templateTypeWipro": templateURL,
          "approvar": res.ResponseObject.Approver.FullName,
          "approval": res.ResponseObject.IsApprovalRequired,
          "description": res.ResponseObject.Description,
          "ProposalStatus": res.ResponseObject.Status,
        });

        if (this.sendActionFields) {
          this.createAction.disable();
          this.createAction.controls['approval'].enable();
        }

        if (res.ResponseObject.ProposalId != -1) {
          this.createAction.disable();
          this.actionTypeNameProposal = res.ResponseObject.ProposalId;
          this.createAction.controls['actionOwner'].enable();
          this.createAction.controls['actionOwnerAdId'].enable();
          this.createAction.controls['actionOwnerSysGuid'].enable();
          this.createAction.controls['endDate'].enable();
          this.createAction.controls['actiondependent'].enable();
          this.createAction.controls['member'].enable();
        }
      } else {
        this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
      }
      this.isLoading = false;
    }, err => {
      this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
      this.isLoading = false;
    });
  }

  dependentSearchMethod(event) {
    console.log("In hit")
    console.log(this.createAction.controls.actiondependent.value)
    let inValue = this.createAction.controls.actiondependent.value;
    this.dependentArr = [];
    this.isDealOwnersSearchLoading = true;
    let input = {
      "Id": this.dealOverview.id,
      "SearchText": inValue == null ? '' : inValue,
      "UserID": this.adid
    }
    this.dealService.searchDependent(input).subscribe(res => {
      this.isDealOwnersSearchLoading = false;
      console.log(res)
      if (res.ResponseObject.length > 0) {
        res.ResponseObject.forEach((element, index) => {
          this.dependentArr.push({
            Id: element.Id,
            contact: element.Name,
            initials: element.Name,
            value: true
          })
        })
      }
      console.log(this.dependentArr)
    }, err => {
      this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
      //this.isLoading = false;
    })
  }

  userSearchMethod(event, searchField) {
    console.log("Hello")
    let searchChar: any = 'a';
    this.Actions = [];
    this.Escalations = [];
    this.membersArr = [];
    this.approvarArr = []

    console.log(searchField);
    if (searchField == 1) {
      searchChar = this.createAction.controls.actionOwner.value;
    }
    if (searchField == 2) {
      searchChar = this.createAction.controls.escalationcontact.value;
    }
    if (searchField == 3) {
      searchChar = this.createAction.controls.member.value;
    }
    if (searchField == 4) {
      searchChar = this.createAction.controls.approvar.value;
    }
    
    if(searchChar == null || searchChar == ''){
      searchChar = 'a';
    }
    
    console.log(searchChar);
    this.isDealOwnersSearchLoading = true;
    var input = {
      "AdId ": this.adid,
      "SearchText": searchChar,
      "PageSize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": ""
    }
    console.log("i am inside method...")
    // if (searchChar !== '') {
      this.dealService.searchUser(input).subscribe(res => {
        console.log(res);
        this.isDealOwnersSearchLoading = false;
        if (!res.IsError) {
          if (res.ResponseObject.length > 0) {
            //console.log("1st stage")
            console.log(res)
            if (searchField == 1) {
              this.Actions = [];
              console.log("1st stage", res.ResponseObject)
              res.ResponseObject.forEach((element, index) => {
                this.Actions.push({
                  index: index,
                  contact: element.FullName,
                  designation: element.Designation,
                  initials: element.FullName,
                  SysGuid: element.SysGuid,
                  AdId: element.AdId,
                  value: true
                })
              })
              console.log(this.Actions)
            }
            else if (searchField == 2) {
              this.Escalations = [];
              console.log("2st stage")
              res.ResponseObject.forEach((element, index) => {
                this.Escalations.push({
                  index: index,
                  contact: element.FullName,
                  designation: element.Designation,
                  initials: element.FullName,
                  SysGuid: element.SysGuid,
                  AdId: element.AdId,
                  value: true
                })
              })
              console.log(this.Escalations)
            }
            else if (searchField == 3) {
              this.membersArr = [];
              console.log("3st stage")
              res.ResponseObject.forEach((element, index) => {
                this.membersArr.push({
                  index: index,
                  contact: element.FullName,
                  initials: element.FullName,
                  AdId: element.AdId,
                  value: true
                })
              })
            }
            else if (searchField == 4) {
              this.approvarArr = [];
              console.log("4st stage")
              res.ResponseObject.forEach((element, index) => {
                this.approvarArr.push({
                  index: index,
                  contact: element.FullName,
                  designation: element.Designation,
                  initials: element.FullName,
                  SysGuid: element.SysGuid,
                  AdId: element.AdId,
                  value: true
                })
              })
              console.log(this.approvarArr)
            }
          } else {
            console.log("5st stage")
          }
        }
      }, err => {
        //this.isLoading = false;
        this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
      });
    // }
  }

  userSearchMembers(event) {
    let SearchText: any;
    this.Actions = [];
    this.approvarArr = [];
    this.isDealOwnersSearchLoading = true;
    if (event == 1) {
      SearchText = this.createAction.controls.actionOwner.value
    } else {
      SearchText = this.createAction.controls.approvar.value
    }
    let input = {
      "Id": this.dealOverview.id,
      "SearchText": SearchText
    }
    this.dealService.searchApprover(input).subscribe(res => {
      console.log("Owners: ", res);
      this.isDealOwnersSearchLoading = false;
      if (!res.IsError) {
        if (event == 2) {
          this.approvarArr = [];
          res.ResponseObject.forEach((element, index) => {
            this.approvarArr.push({
              index: index,
              contact: element.FullName,
              AdId: element.AdId,
              value: true
            })
          })
        }
        if (event == 1) {
          this.Actions = [];
          res.ResponseObject.forEach((element, index) => {
            this.Actions.push({
              index: index,
              contact: element.FullName,
              AdId: element.AdId,
              value: true
            })
          })
        }
      }
    })
  }

  summary = [
    // { label: 'Action type*', content: 'Tech solution' },
  ]

  // MORE ACTION STARTS **************
  showContent: any = -1;

  closeContent() {
    this.showContent = -1;
  }

  toggleContent(id: any) {
    this.showContent = id;
  }
  // MORE ACTION ENDS *******************


}
