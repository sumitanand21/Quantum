import { ResponseObject } from './../../../../core/state/state.models/action.interface';
import { filter, toArray } from 'rxjs/operators';
import { ContactleadService } from './../../../../core/services/contactlead.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommitmentRegisterService } from '@app/core/services/commitmentregister.service';
import { Inject } from '@angular/core';

import { Component, OnInit, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { DataCommunicationService } from '@app/core';
import { AccountListService } from '@app/core/services/accountList.service';
import { ActivatedRoute, Router } from '../../../../../../node_modules/@angular/router';
import { MatSnackBar } from '../../../../../../node_modules/@angular/material';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, UploadStatus } from 'ngx-uploader';

const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

@Component({
  selector: 'app-account-transition',
  templateUrl: './account-transition.component.html',
  styleUrls: ['./account-transition.component.scss']
})
export class AccountTransitionComponent implements OnInit {
  isCSO: boolean;
  checklistChange = false;
  checklistChange2 = false;
  IsAccountTransitionUpdated;
  AccountTransitionUpdated = false;
  incommingOwnerGuid;
  btnDisabled: boolean = false;
  checklistFilled: boolean = false;
  checklistCheckedArray = [];
  ChecklistActivity() {
    console.log("data array", this.table_dataalli);
    for (let i = 0; i <= this.table_dataalli.length; i++) {
      if (typeof this.table_dataalli[i].tabledata3 !== 'undefined') {
        if (this.table_dataalli[i].tabledata3) {
          this.btnDisabled = true;
          break
        } else {
          this.btnDisabled = false
        }
      } else {
        this.btnDisabled = false
      }
    }
    this.checklistChange = true;
    // checking whether all checkboxes are filled starts here
    if (this.table_dataalli) {
      this.checklistCheckedArray = [];
      this.table_dataalli.filter(ele => {
        this.checklistCheckedArray.push(ele.tabledata3);
      });
    }
    console.log('checklistCheckedArray', this.checklistCheckedArray);
    let countFalsies = 0;
    this.checklistCheckedArray.filter(ele => {
      if (!ele || ele === false) {
        countFalsies = countFalsies + 1;
      }
      console.log(ele, countFalsies);
    });
    if (countFalsies === 0) {
      this.checklistFilled = true;
    } else {
      this.checklistFilled = false;
    }
    console.log('this is checklistFilled value', this.checklistFilled);
    // checking whether all checkboxes are filled ends here
  }
  ChecklistActivity2() {
    this.checklistChange2 = true;
  }
  IsHelpDesk = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('IsHelpDesk'), 'DecryptionDecrip');
  userID = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem("userID"), 'DecryptionDecrip');
  roleType = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem("roleType"), 'DecryptionDecrip');
  transitionReqBody = {
    "SysGuid": "4bc3034f-2d86-e611-80d9-000d3a803bd6",
    "LoggedInUser": {
      "SysGuid": this.userID
    }
  }
  role;
  username;
  saveEnabled;
  submitEnabled;
  submitTransitionBody;
  submitKTBody;
  checklistrArray = [];
  ktChecklistArray = [];
  contactstabdownwhite = true;
  suitetabdownwhite = false;
  Account_number = '';
  Account_name = '';
  Account_owner = '';
  last_working_day = '';
  incoming_account_owner = '';
  reviewer_name_role = '';
  defaultTabledata2 = {
    Id: ''
  }
  table_headkey: any;
  table_dataalli: any;
  table_headalli: any;
  table_headalli2: any;
  table_dataalli2: any;
  transitionoperations = true;
  ktchecklist = false;
  table_dataalli3;
  responsibilityObj;
  SysGuidid: any;
  ktSubmitted: Boolean = false;
  isktSubmitted: Boolean
  transitionSubmitted: Boolean = false;
  istransitionSubmitted: Boolean
  saveTransitionBody;
  saveKTBody;
  isLoading: Boolean = false;
  spocs = [];
  readOnly = false;
  constructor(public location: Location,
    public userdat: DataCommunicationService, public accountListService: AccountListService,
    private route: ActivatedRoute, public MasterApiService: S3MasterApiService,
    private snackBar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private EncrDecr: EncrDecrService,
    public dialog: MatDialog
  ) {
    this.username = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('username'), 'DecryptionDecrip');
    // if (route && route.snapshot && route.snapshot.params && route.snapshot.params.id) {
    //   this.transitionReqBody.SysGuid = route.snapshot.params.id;
    // } 
    const paramsObj = this.accountListService.getSession('routeParamsTrasition');
    if (paramsObj && paramsObj['Id']) {
      this.transitionReqBody.SysGuid = paramsObj['Id'];
    }
    else {
      this.transitionReqBody.SysGuid = '4bc3034f-2d86-e611-80d9-000d3a803bd6';
    }
    this.table_headalli = [{
      'tablehead1': 'Task',
      'tablehead2': 'Responsibility',
      'tablehead3': 'Check',
      'tablehead4': 'Remarks'
    }]

    this.table_dataalli = [];
    this.responsibilityObj = [];
    // {
    //   'tabledata1': 'Has the cost center tagging been completed in SAP?',
    //   'tabledata2': 'HR',
    //   'tabledata3': 'checkbox',
    //   'tabledata4': 'Remarks'
    // },
    // {
    //   'tabledata1': 'Has the hierarchy been set for the user?',
    //   'tabledata2': 'HR',
    //   'tabledata3': 'checkbox',
    //   'tabledata4': 'Remarks'
    // },
    // {
    //   'tabledata1': 'Target assigned in IMS?',
    //   'tabledata2': 'Finance',
    //   'tabledata3': 'checkbox',
    //   'tabledata4': 'Remarks'
    // },
    // {
    //   'tabledata1': 'Has access ben provided to the user in Trace?',
    //   'tabledata2': 'SE SPOC',
    //   'tabledata3': 'checkbox',
    //   'tabledata4': 'Remarks'
    // },  {
    //   'tabledata1': 'Has the evenue storm certification completed?',
    //   'tabledata2': 'SE SPOC',
    //   'tabledata3': 'checkbox',
    //   'tabledata4': 'Remarks'
    // }


    this.table_headalli2 = [{
      'tablehead1': 'Task',
      'tablehead2': 'Responsibility',
      'tablehead3': 'Remarks',
      'tablehead4': ''
    }]

    this.table_dataalli2 = [];

    // {
    //   'tabledata1': 'Has the account profile information been communicated clearly?',
    //   'tabledata2': 'HR',
    //   'tabledata3': 'true',
    //   'tabledata4': 'Remarks'
    // },
    // {
    //   'tabledata1': 'Has the SWOT analysis of the account been clearly clearly understood?',
    //   'tabledata2': 'HR',
    //   'tabledata3': 'checkbox',
    //   'tabledata4': 'Remarks'
    // },
    // {
    //   'tabledata1': 'Has the key contacts and the account team details been shared?',
    //   'tabledata2': 'Finance',
    //   'tabledata3': 'checkbox',
    //   'tabledata4': 'Remarks'
    // },
    // {
    //   'tabledata1': 'Has there been a walkthrough of the history of activity in the account?',
    //   'tabledata2': 'SE SPOC',
    //   'tabledata3': 'checkbox',
    //   'tabledata4': 'Remarks'
    // },  {
    //   'tabledata1': 'Has there been a walkthrough of the account plan and strategy?',
    //   'tabledata2': 'SE SPOC',
    //   'tabledata3': 'checkbox',
    //   'tabledata4': 'Remarks'
    // },
    // {
    //   'tabledata1': 'Has the stage-wise pipeline and funnel details been shared?',
    //   'tabledata2': 'SE SPOC',
    //   'tabledata3': 'checkbox',
    //   'tabledata4': 'Remarks'
    // },
    // {
    //   'tabledata1': 'Has the forecast of plan vs achievement of the account been shared ?',
    //   'tabledata2': 'SE SPOC',
    //   'tabledata3': 'checkbox',
    //   'tabledata4': 'Remarks'
    // },
    // {
    //   'tabledata1': 'Has the list of deals coming up for renewal (both Wipro & competition) been shared?',
    //   'tabledata2': 'SE SPOC',
    //   'tabledata3': 'checkbox',
    //   'tabledata4': 'Remarks'
    // }];

  }

  ngOnInit() {
    console.log(this.roleType);
    if (this.roleType == '3') {
      this.isCSO = true;
    }
    else {
      this.isCSO = false;
    }
    // localStorage.getItem()?\
    this.table_dataalli = [];
    this.table_dataalli2 = [];

    this.isLoading = true;
    this.transitionCall();
  }

  transitionCall() {
    setTimeout(() => {    //<<<---    using ()=> syntax
      this.accountListService.accountTransition(this.transitionReqBody).subscribe((res) => {
        this.isLoading = false;
        if (!res) {
          this.snackBar.open(res['Message'], '', {
            duration: 3000
          });
        }

        this.IsAccountTransitionUpdated = res.ResponseObject.IsAccountTransitionUpdated;
        console.log('initial res', res);
        this.incommingOwnerGuid = res.ResponseObject.IncomingAccountOwner ? res.ResponseObject.IncomingAccountOwner.SysGuid : '';
        if (res.ResponseObject.SESPocs)
          this.spocs = [...res.ResponseObject.SESPocs];
        this.saveEnabled = res.ResponseObject["IsSaveCheckList"];
        this.submitEnabled = res.ResponseObject["IsSubmitCheckList"];
        if (this.saveEnabled == false && this.submitEnabled == false) {
          this.readOnly = true;
        }
        console.log('readonly', this.readOnly)

        this.Account_number = res.ResponseObject["Number"];
        this.Account_name = res.ResponseObject["Name"];
        this.Account_owner = res.ResponseObject.Owner.FullName;
        this.last_working_day = res.ResponseObject.LastWorkingDay ? res.ResponseObject.LastWorkingDay : "NA";
        this.istransitionSubmitted = res.ResponseObject["IstransitionListSubmitted"]
        this.isktSubmitted = res.ResponseObject["IsKTListSubmitted"]
        this.incoming_account_owner = res.ResponseObject.IncomingAccountOwner.FullName ? res.ResponseObject.IncomingAccountOwner.FullName : 'NA';
        this.reviewer_name_role = res.ResponseObject.Reviewer ? res.ResponseObject.Reviewer.FullName : 'NA';

        console.log('ghs', this.spocs);
        if (this.roleType == '2') {
          if (this.spocs.filter(x => { return x.FullName == this.reviewer_name_role }).length > 0) {
            // debugger;
            console.log("came here1");
            this.role = "(SBU SE-SPOC)";
          }
          else {
            console.log("username", this.username);
            this.reviewer_name_role = this.username;
            this.role = "(SBU SE-SPOC)";
          }
        }
        else {
          console.log("came here2")

          this.reviewer_name_role = '-';
          this.role = "";
        }

        this.MasterApiService.getResponsibilityMaster().subscribe((res) => {
          this.responsibilityObj = res.ResponseObject;
          console.log('dropdown ', this.responsibilityObj); 
        })
        if (res.ResponseObject.TransitionCheckList.length > 0) {
          console.log('response ', res);
          this.table_dataalli = this.filter(res.ResponseObject.TransitionCheckList);
          //this.ChecklistActivity();

        }
        else {
          //this.isLoading = true;
          this.MasterApiService.transitionOperationChecklistMaster({}).subscribe((res) => {
            console.log('transition matser', res);
            this.isLoading = false;
            this.table_dataalli = this.filter2(res.ResponseObject);
            console.log('first table data->', this.table_dataalli);
          });
        }
        if (res.ResponseObject.CheckList.length > 0) {
          console.log('kt checklist', res.ResponseObject.CheckList)
          this.table_dataalli2 = this.filter(res.ResponseObject.CheckList);
          console.log('table data 2->', this.table_dataalli2);
        }

        else {
          // this.isLoading = true;
          this.MasterApiService.getKTCheckListMaster({}).subscribe((res) => {
            this.isLoading = false;
            console.log("kt master response", res)
            this.table_dataalli2 = this.filterKT(res.ResponseObject);
            console.log('table data 2->', this.table_dataalli2);
          })
        }

      }, (err) => {
        this.isLoading = false;
      })
    }, 2000);
  }


  filterKT(data) {
    console.log('in kt filter', data);
    return data.map((res) => {
      return {
        tabledata1: res.Value,
        tabledata2: { Id: 0 },
        tabledata3: res.IsCheck,
        tabledata4: res.Remarks,
        MapGuid: res.MapGuid ? res.MapGuid : '',
        QuestionId: res.Id,
      }
    })
  }

  filter3(responsibility) {
    console.log('responsibility', responsibility);
    var c = this.responsibilityObj.filter(x => { return x.Id == responsibility })
    console.log('in filter 3', c);
    if (c.length > 0) {
      c = c[0].Value;
    }
    return { Id: responsibility, Value: c }
  }
  filter4(resp){
    console.log('responsibility123433', resp);
  if(!resp.Id){
    resp['Id'] = 0;
  }
    console.log(resp);
    return resp;
  }
  filter2(data) {
    console.log('data in filter2', data);
    return data.map((res) => {
      return {
        tabledata1: res.Question,
        tabledata2: this.filter3(res.Responsibility),
        tabledata3: res.IsCheck,
        tabledata4: res.Remarks,
        MapGuid: res.MapGuid ? res.MapGuid : '',
        QuestionId: res.QuestionId ? res.QuestionId : res.Id,
        IstransitionListSubmitted: res.IstransitionListSubmitted
      };
    });
  }
  getSymbol(data) {
    // console.log(data)
    return this.accountListService.getSymbol(data);
  }
  filter(data) {
    return data.map((res) => {
      return {
        tabledata1: res.Question,
        tabledata2: this.filter4(res.Responsibility),
        responsibilitySelected : res.Responsibility && !res.Responsibility.Id ? 0 :res.Responsibility.Id,
        tabledata3: res.IsCheck,
        tabledata4: res.Remarks,
        AttachmentUrl: res.AttachmentUrl ? res.AttachmentUrl : '',
        tabledata5: res.AttachmentUrl ? res.AttachmentUrl.toString().split('/').pop().toString().split('_').shift() : '',
        MapGuid: res.MapGuid ? res.MapGuid : '',
        QuestionId: res.QuestionId,
        IstransitionListSubmitted: res.IstransitionListSubmitted
      }
    })
  }

  isClicked: boolean = false;
  onTransitionSubmit(event) {

    this.isClicked = true;
    console.log("Click", event);
    console.log("Click", event.clicked);
    // debugger;
    this.isLoading = true;
    // if (this.istransitionSubmitted || this.transitionSubmitted) {
    //   this.isLoading = false
    //   return;
    // }
    this.table_dataalli.IstransitionListSubmitted = true;

    this.submitTransitionBody = {
      "SysGuid": this.transitionReqBody.SysGuid,
      "IsSubmit": true,
      "CheckList": this.createTransitionChecklistBody()
    }
    this.accountListService.createAccountTransitionCheckList(this.submitTransitionBody).subscribe((res) => {
      this.isLoading = false;

      if (res.IsError == false) {
        this.transitionSubmitted = !this.transitionSubmitted;
      }
      console.log('create transition checklist', res)
      this.snackBar.open(res['Message'], '', {
        duration: 3000
      });
      this.transitionCall();
      this.isClicked = false;
    }, (err) => {
      this.isClicked = false;
      this.isLoading = false;
    })
    this.responsibilityObj = [];
  }

  onTransitionSave() {
    if (!this.checklistChange) {

    }
    else {
      this.isLoading = true;
      // if (this.istransitionSubmitted) {
      //   this.isLoading = false;
      //   return;
      // }
      // this.table_dataalli.IstransitionListSubmitted = true;

      this.saveTransitionBody = {
        "SysGuid": this.transitionReqBody.SysGuid,
        "IsSubmit": false,
        "CheckList": this.createTransitionChecklistBody()
      }
      this.accountListService.createAccountTransitionCheckList(this.saveTransitionBody).subscribe((res) => {
        this.isLoading = false;
        this.checklistChange = false;

        console.log('create transition checklist', res)
        this.snackBar.open(res['Message'], '', {
          duration: 3000
        });
        this.transitionCall();

      }, (err) => {
        this.isLoading = false;
      })

    }
  }


  createTransitionChecklistBody() {
    this.checklistrArray = [];
    this.table_dataalli.map((item) => {
      this.checklistrArray.push({
        "MapGuid": item.MapGuid ? item.MapGuid : "",
        "QuestionId": item.QuestionId,
        "Question": item.tabledata1,
        "Responsibility": {
          "Id": item.tabledata2.Id
        },
        "IsCheck": item.tabledata3,
        "Remarks": item.tabledata4,
        "CustomerAccount": {
          "SysGuid": this.transitionReqBody.SysGuid
        }
      })
    })
    console.log("create body->", this.checklistrArray);
    return this.checklistrArray;
  }

  onKTSubmit() {

    this.isLoading = true
    // if (this.isktSubmitted || this.ktSubmitted) {
    //   this.isLoading = false
    //   return;
    // }
    console.log("tabledata2 for kt checklist", this.table_dataalli2.tabledata2);
    this.submitKTBody = {
      "SysGuid": this.transitionReqBody.SysGuid,
      "IsSubmit": true,
      "CheckList": this.createKTChecklistBody()
    }
    this.accountListService.createKTChecklist(this.submitKTBody).subscribe((res) => {
      this.isLoading = false;

      console.log('create kt checklist', res)
      if (res.IsError == false) {
        this.ktSubmitted = !this.ktSubmitted
      }
      this.snackBar.open(res['Message'], '', {
        duration: 3000
      });
      this.transitionCall();
    }, (err) => {
      this.isLoading = false;
    })


  }

  onKTSave() {
    // if (!this.checklistChange2) {

    // }
    // else {
    this.isLoading = true;
    // if (this.isktSubmitted) {
    //   this.isLoading = false;
    //   return;
    // }
    console.log("tabledata2 for kt checklist", this.table_dataalli2.tabledata2);
    this.saveKTBody = {
      "SysGuid": this.transitionReqBody.SysGuid,
      "IsSubmit": false,
      "CheckList": this.createKTChecklistBody()
    }
    console.log('kt save body', this.saveKTBody);
    this.accountListService.createKTChecklist(this.saveKTBody).subscribe((res) => {
      this.checklistChange2 = false;
      this.isLoading = false;
      console.log('create kt checklist', res)
      this.snackBar.open(res['Message'], '', {
        duration: 3000
      });
      this.transitionCall();
    }, (err) => {
      this.isLoading = false;
    })
  }
  // transition popup chethana Aug 29th starts
  // Openownertransition() {
  //   const dialogRef = this.dialog.open(Openownertransition, {
  //     width: '380px'
  //   });
  // }
  // transition popup chethana Aug 29th ends

  createKTChecklistBody() {
    this.ktChecklistArray = [];
    this.table_dataalli2.map((item) => {
      this.ktChecklistArray.push({
        "MapGuid": item.MapGuid ? item.MapGuid : "",
        "QuestionId": item.QuestionId,
        "Question": item.tabledata1,
        "Responsibility": {
          "Id": item.tabledata2.Id ? item.tabledata2.Id : '0',
        },
        "Remarks": item.tabledata4,
        "CustomerAccount": {
          "SysGuid": this.transitionReqBody.SysGuid
        },
        "AttachmentUrl": item.tabledata3 ? item.tabledata3 : (item.AttachmentUrl || '')
      })
    })
    console.log("create body 2->", this.ktChecklistArray);
    return this.ktChecklistArray;
  }

  onSubmit() {
    // this.isLoading=true;
    var updateTransitionBody = {
      "SysGuid": this.transitionReqBody.SysGuid,
      "IncomingAccountOwner": { "SysGuid": this.incommingOwnerGuid }
    }
    if (this.istransitionSubmitted || this.transitionSubmitted) {

      const dialogRef = this.dialog.open(Openownertransition,
        {
          disableClose: true,
          width: '380px',
          data: {
            'updateTransitionBody': updateTransitionBody,
            'owner1': this.Account_owner,
            'owner2': this.incoming_account_owner
          }
        });

      // this.accountListService.accountTransitionUpdate(updateTransitionBody).subscribe((res) => {
      //   this.AccountTransitionUpdated = true;
      //   this.isLoading=false;
      //   console.log('update transition ', res); // snackbar added
      //   this.snackBar.open(res['Message'], '', {
      //     duration: 3000
      //   });
      // },(err)=>{
      //   this.isLoading=false;
      // })
    }
    // var sysGuid = this.activatedRoute.snapshot.params.id;
    // console.log('params->', sysGuid);
    // this.router.navigateByUrl('/accounts/accountdetails');

  }
  goBack() {
   const  url = '/accounts/accountdetails';
    this.accountListService.goBack(url);
    // this.router.navigate(['/accounts/accountdetails']);
    // this.location.back();
  }
  tabdownonewhite() {
    this.contactstabdownwhite = true;
    this.suitetabdownwhite = false;
    this.transitionoperations = true;
    this.ktchecklist = false;
  }
  tabdowntwowhite() {
    this.contactstabdownwhite = false;
    this.suitetabdownwhite = true;
    this.transitionoperations = false;
    this.ktchecklist = true;
  }


  cardItems = [
    { index: '1', task: 'Account1', responsibility: 'Account number', check: 'yes', remarks: 'data' },
    { index: '2', task: 'Account2', responsibility: 'Account number', check: 'yes', remarks: 'data' },
    { index: '3', task: 'Account3', responsibility: 'Account number', check: 'yes', remarks: 'data' },
    { index: '4', task: 'Account4', responsibility: 'Account number', check: 'yes', remarks: 'data' },
    { index: '5', task: 'Account5', responsibility: 'Account number', check: 'yes', remarks: 'data' }
  ]


  // file upload functionality starts from here
  public uploader: FileUploader = new FileUploader({ url: URL });
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  arr = [];
  fileQueInd = 0;

  public fileOverBase(e: any, id): void {
    debugger;
    var file = this.uploader.queue[this.fileQueInd];
    //  debugger;

    this.table_dataalli2.filter(x => x.QuestionId == id)[0].tabledata3 = [this.uploader.queue[this.fileQueInd++]];

    console.log(this.table_dataalli2)
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }
  getFiles(): FileLikeObject[] {
    return this.uploader.queue.map((fileItem) => {
      return fileItem.file;
    });
  }
  fileName;
  upload(id) {
    this.checklistChange2 = false;

    this.isLoading = true;
    let files = this.getFiles();
    console.log(files);
    this.fileName = files[this.fileQueInd].name;
    console.log('filename', this.fileName);
    let requests = [];
    let fileSize = files[this.fileQueInd].size;
    console.log("sdbhsshvdh", fileSize);
    if (fileSize <= 1e+7) {
      this.generateURL(files[this.fileQueInd], id);
    } else {
      this.isLoading = false;
      this.snackBar.open('The file size should not exceed 10MB', '', {
        duration: 3000
      });
    }
  }
  generateURL(file, id) {
    console.log("sdvgdsgfg")
    let formData = new FormData();
    formData.append('file', file.rawFile, file.name);
    console.log(formData);
    this.accountListService.ktChecklistImg(formData).subscribe((res) => {
      console.log("image upload done from service", res);
      this.table_dataalli2.filter(x => x.QuestionId == id)[0].tabledata3 = res;
      this.table_dataalli2.filter(x => x.QuestionId == id)[0].AttachmentUrl = res;
      this.fileQueInd++;
      var name = res.toString().split('/').pop().toString().split('_').shift();
      console.log(name);
      this.table_dataalli2.filter(x => x.QuestionId == id)[0].tabledata5 = this.fileName;
      this.isLoading = false;

    });
    console.log('tabledatalli2', this.table_dataalli2);
  };
  addToArray(array: string) {
    this.arr.push("array" + this.arr.length);
  }
  remove(id: number) {
    this.isLoading = true;
    this.table_dataalli2.filter(x => x.QuestionId == id)[0].tabledata3 = '';
    this.table_dataalli2.filter(x => x.QuestionId == id)[0].AttachmentUrl = undefined;
    this.isLoading = false;
    console.log(this.table_dataalli2);
  }
  // file upload functionality ends here


  downloadFile(id) {
    var data = this.table_dataalli2.filter(x => x.QuestionId == id)[0].AttachmentUrl
    this.downloadAll(data);
  }
  downloadAll(data) {
    let downloadUrls = [];
    downloadUrls.push(data);
    // data.forEach(res => {
    // downloadUrls.push(res.Url);
    // })
    // For downloading multiple files
    downloadUrls.forEach(function (value, idx) {
      const response = {
        file: value,
      };
      setTimeout(() => {
        var a = document.createElement('a');
        a.href = response.file;
        a.download = response.file;
        document.body.appendChild(a);
        a.click();
      }, idx * 2500)
    });
  }

}
//transition popup chethana Aug 29th starts
@Component({
  selector: 'ownertransition',
  templateUrl: './ownertransitionpopup.html',
})
export class Openownertransition implements OnInit {
  updateTransitionBody;
  isLoading = false;
  owner1;
  owner2;
  accountSysId: any = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip'); // localStorage.getItem('accountSysId');
  constructor(public accservive: DataCommunicationService,
    public location: Location,
    public dialogRef: MatDialogRef<Openownertransition>,
    private snackBar: MatSnackBar,
    public accountListService: AccountListService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private EncrDecr: EncrDecrService,
  ) { }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.owner1 = this.data.owner1;
    this.owner2 = this.data.owner2;
  }

  goBack() {
    this.dialogRef.close('');
  }

  confirmUpdateTransition() {
    this.isLoading = true;

    this.updateTransitionBody = this.data.updateTransitionBody;

    this.accountListService.accountTransitionUpdate(this.updateTransitionBody).subscribe((res) => {
      // this.AccountTransitionUpdated = true;
      this.isLoading = false;
      console.log('update transition ', res); // snackbar added
      this.snackBar.open(res['Message'], '', {
        duration: 3000
      });
      // var sysGuid = this.activatedRoute.snapshot.params.id;
      console.log('params->', this.accountSysId);
      // let obj = { 'route_from': '', 'Id':  this.accountSysId };
      // localStorage.setItem('routeParams', this.EncrDecr.set('EncryptionEncryptionEncryptionEn', JSON.stringify(obj), 'DecryptionDecrip'))
      // this.accountListService.setUrlParamsInStorage('',this.accountSysId);
      this.accountListService.setSession('routeParams', { 'route_from': 'modif_req', 'Id': this.accountSysId });
      this.router.navigateByUrl('/accounts/accountdetails');
    }, (err) => {
      this.isLoading = false;
    })
    //   var sysGuid = this.activatedRoute.snapshot.params.id;
    // console.log('params->', sysGuid);
    // this.router.navigateByUrl('/accounts/accountdetails/' + sysGuid);
  }
}
  // transition popup chethana Aug 29th ends