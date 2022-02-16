import { Component, OnInit, EventEmitter, ViewChild, ElementRef, Input, Output, HostListener, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { ValidationService } from '@app/shared/services/validation.service';
import { FileUploader } from 'ng2-file-upload';
import { DataCommunicationService, ErrorMessage } from '@app/core';
import { AccountListService, AccountHeaders, AccountAdvNames, manageLogHeaders, manageLogNames } from '@app/core/services/accountList.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatDatepickerInputEvent } from '@angular/material';
import { environment as env } from '@env/environment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, UploadStatus } from 'ngx-uploader';
import { CommitmentRegisterService } from '@app/core/services/commitmentregister.service';
import { ContactleadService } from '@app/core/services/contactlead.service';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { FileUploadService } from '@app/core/services/file-upload.service';
import moment from 'moment';
const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

@Component({
  selector: 'app-account-management-log',
  templateUrl: './account-management-log.component.html',
  styleUrls: ['./account-management-log.component.scss']
})
export class AccountManagementLogComponent implements OnInit {
  FormSubmitted: boolean = false;
  table_data: any;
  secondareatext: string;
  firstareatext: string;
  isEdit: boolean;
  tempId: number;
  submitted;
  accountName;
  accOwnerSwap;
  timeZones: Array<any> = [];
  meetingType: Array<any> = [];
  meetingStage: Array<any> = [];
  participants: Array<any> = [];
  mytime;
  showHideTime: boolean;
  animateWorkflow: boolean;
  reviewSysGuid: string;
  reviewSysName: string;
  manageLogData: any;
  SysGuidid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip'); //localStorage.getItem('accountSysId');
  ownerSysGuidid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('accountOwnerGuid'), 'DecryptionDecrip'); //localStorage.getItem('accountSysId');
  manageEditVal: string;
  managementDetails: any;
  selectedopportunity = [];
  valueForSelected = [];
  valueForSelected1 = [];
  attachListData = [];
  isLoading: boolean = false;
  meetingTypeValue: string = '';
  meetingStageValue: string = '';
  emailFormat = '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[A-Za-z]{2,3}';
  disableFields: boolean = false;
  currentDate: any = new Date();
  arrowkeyLocation = 0;
  @Output() dateChange: EventEmitter<MatDatepickerInputEvent<any>>;
  TextInputs = false;
  lookupdata = {
    tabledata: [],
    recordCount: 10,
    headerdata: [],
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
  getCommonData() {
    return {
      guid: '',
    };
  }
  addManageForm = this._fb.group({
    SysGuid: [''],
    CustomerAccount: [''],
    MeetingDate: ['', Validators.required],
    StartTime: ['', Validators.required],
    Duration: [''],
    Meeting: this._fb.group({
      MeetingType: this._fb.group({
        Id: ['', Validators.required],
      }),
      Stage: this._fb.group({
        Id: ['', Validators.required],
      }),
    }),
    ReviewChairpersonCoach: this._fb.group({
      SysGuid: [''],
    }),
    ReviewChairpersonCoach1: this._fb.group({
      SysGuid: [''],
    }),
    NonTraceUsers: [''],
    Attachments: [[
      {
        'Name': 'Attachment 1',
        'Url': 'https://commonstorageqa.blob.core.windows.net/l2ofiles/TestFile.txt_ec4bd46cB1e70B4bf4B8a99Be3cf9831bf67',
        'LinkActionType': 1
      }]],
    TimeZone: this._fb.group({
      Id: [''],
    }),
    CommentandConclusion: ['']

  });
  isActivityGroupSearchLoading: boolean;
  advacelookupreviewContacts = [];
  selectedreviewContacts = [];
  advacelookupopportunityContact1 = [];
  opportunityContact1Selected = [];
  ReviewChairPersonName;
  ParticipantsName;
  constructor(public dialog: MatDialog, private el: ElementRef, public validate: ValidationService,private fileService: FileUploadService,
    public service: DataCommunicationService, private snackBar: MatSnackBar, private route: ActivatedRoute, private EncrDecr: EncrDecrService, private _fb: FormBuilder, public location: Location, public userdat: DataCommunicationService, public accountListServ: AccountListService, private router: Router, private errorMessage: ErrorMessage) {
  }


  get addmanageForm() { return this.addManageForm.controls; }

  ngOnInit() {
    this.getManageAutoSaveData();
    this.accountName = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountName'), 'DecryptionDecrip');
    this.manageEditVal = localStorage.getItem('manageEdit');
    this.table_data = [];
    this.accountListServ.attachmentListView = [];
    this.accountListServ.getTimeZones().subscribe((res) => {
      this.timeZones = res.ResponseObject;
    });
    this.accountListServ.getMeetingTypes().subscribe((res) => {
      this.meetingType = res.ResponseObject;
    });
    this.getMeetingStage();
    this.userdat.getManageLog().subscribe((res) => {
      this.manageLogData = res;
    }, (error) => {
      console.log('Error in getting managed log ', error);
    });
    if (this.manageEditVal === 'edit' || this.manageEditVal === 'view') {
      this.isLoading = true;
      this.accountListServ.getManagementLog(this.manageLogData.resData.objectRowData[0].id).subscribe((res: any) => {
        this.managementDetails = res.ResponseObject;
        this.isLoading = false;
        if (this.managementDetails) {
          const rowData = this.managementDetails;
          // console.log('management log details', this.managementDetails);
          this.assignPatchValues(rowData);
          this.selectedopportunity1 = [...rowData.NonTraceUsers];
          this.valueForSelected1 = [...rowData.NonTraceUsers];
          this.table_data = [...rowData.CommentandConclusion];
          this.accountListServ.attachmentList = this.getMultileAttachment(rowData.Attachments);
          this.reviewSysGuid = rowData.ReviewChairpersonCoach.SysGuid;

          this.accountListServ.attachmentListView = this.getMultileAttachment(rowData.Attachments);
          if ((this.manageEditVal === 'edit' && (this.managementDetails.Meeting.Stage.Id == 1 || this.managementDetails.Meeting.Stage.Id == 3)) || this.manageEditVal == 'view') {
            this.disableFields = true;
          }
        }
      });

    }

  }
  assignPatchValues(rowData){
    let srtTime = new Date(rowData.StartTime);
    this.addManageForm.patchValue({
      SysGuid: rowData.SysGuid,
      CustomerAccount: { SysGuid: this.SysGuidid },
      MeetingDate: new Date(rowData.MeetingDate),
      StartTime: srtTime,
      Duration: rowData.Duration,
      Meeting: {
        MeetingType: {
          Id: rowData.Meeting.MeetingType.Id,
        },
        Stage: {
          Id: rowData.Meeting.Stage.Id,
        },
      },
      ReviewChairpersonCoach: {
        SysGuid: rowData.ReviewChairpersonCoach.SysGuid,
      },
      ReviewChairpersonCoach1: {
        SysGuid: rowData.ReviewChairpersonCoach.FullName,
      },
      NonTraceUsers: rowData.NonTraceUsers,
      // Attachments: rowData.Attachments,
      Attachments: this.getMultileAttachment(rowData.Attachments),
      TimeZone: {
        Id: rowData.TimeZone.Id,
      },
    });
  }
  getMultileAttachment(rowData) {
    if (rowData.length !== 0) {
      return rowData.map((data) => {
        return {
          'Name': data.Name,
          'Url': data.Url,
          'DownloadName': data.DownloadName,
          'MapGuid': data.Guid,
          'LinkActionType': 2
        };
      });
    } else {
      return []
    }
    // return{
    //   {
    //     'Name': rowData.Attachments.Name,
    //     'Url': rowData.Attachments.Url,
    //     'MapGuid': rowData.Attachments.Guid,
    //     'LinkActionType': 2
    //   }

  }
  scrollTo(el: Element) {
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
  downloadList(data): void {
    this.isLoading = true;
    const reqparam = this.GetAppliedFilterData({ ...data });
    reqparam['IsFilterApplied'] = this.userdat.checkFilterListApiCall(data) ? true : false;
    this.accountListServ.getFilterList(reqparam, true).subscribe(res => {

      if (!res.IsError) {
        this.isLoading = false;
        this.userdat.Base64Download(res.ResponseObject);
        // window.open(res.ResponseObject.Url, '_blank');
      } else {
        this.isLoading = false;
      }
    }, error => {
      this.isLoading = false;
    });

  }
  GetAppliedFilterData(data) {
    return {
      'SortBy': this.getNumericsOnColumn(data.filterData.sortColumn),
      'IsDesc': data.filterData.sortOrder,
      'PageSize': 10,
      'SearchText': data.filterData.globalSearch,
      'Meetingtype': this.userdat.pluckParticularKey(data.filterData.filterColumn['Meetingtype'], 'name'),
      'Meetingstage': this.userdat.pluckParticularKey(data.filterData.filterColumn['Meetingstage'], 'name'),
      'Createdby': this.userdat.pluckParticularKey(data.filterData.filterColumn['Createdby'], 'name'),

    };
  }
  getSymbol(data) {
    // console.log(data)
    return this.accountListServ.getSymbol(data);
  }
  getNumericsOnColumn(columName) {
    switch (columName) {
      case 'Duration':
        return 10;
      case 'Meetingtype':
        return 12;
      case 'Meetingstage':
        return 13;
      case 'Chairpersoncoach':
        return 14;
      case 'Mom':
        return 15;
      case 'Starttime':
        return 9;
      default:
        return '';
    }
  }
  getMeetingStage() {
    this.accountListServ.getMeetingStage().subscribe((res) => {
      this.meetingStage = res.ResponseObject;
      this.meetingStage.map((stages) => {
        if (stages.Id === 2) {
          this.addManageForm.patchValue({
            Meeting: {
              Stage: {
                Id: stages.Id,
              },
            }
          });
        }
      });

      if (this.manageEditVal !== 'edit') {
        this.meetingStage.splice(0, 1);
      }
    });
  }

  openAttachFilePopup(): void {
    const dialogRef = this.dialog.open(uploadPopup, {
      disableClose: true,
      width: '610px',
      data: []
    });
    // dialogRef.componentInstance.modelEmiter.subscribe((x) => {
    //   if (x.loader) {
    //     this.isLoading = true;
    //   } else {
    //     this.isLoading = false;
    //   }
    // });
    dialogRef.afterClosed().subscribe(res => {
      let attachments = res;
      let tempData = [];
      // this.accountListServ.attachmentList = [];
      if (attachments.length > 0) {

        attachments.forEach(file => {
          // if (file.response !== undefined) {
          //   if (file.response.Message === undefined) {
          let urlresponse = file.file.ResponseObject;
          tempData.push(
            {
              'Name': file.name,
              'Url': urlresponse.Url,
              'DownloadName' : urlresponse.Name,
              // 'Base64String': urlresponse.Base64String,
              'MapGuid': '',
              'LinkActionType': 1,
              'Comments': [
                {
                  'Description': ''
                }
              ]
            }
          );
          // }

          // }
        });
        this.accountListServ.attachmentList = [...this.accountListServ.attachmentList, ...tempData];
        this.accountListServ.attachmentListView = [...this.accountListServ.attachmentList];
        this.manageAutoSave();
      }
    });
  }
  // attach file pop up end 

  ngOnDestroy() {
    localStorage.removeItem('manageEdit');
  }
  specCharRestrict(event) {
    // if ([69, 187, 188, 189, 190].includes(e.keyCode)) {
    //   e.preventDefault();
    // }
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  hideOverlyTime() {
    this.showHideTime = false;
  }
  changeShowStatus2() {
    this.showHideTime = !this.showHideTime;
  }
  participantChange(event, data) {
    this.reviewContacts = [];
    this.opportunityContact = [];
    this.isActivityGroupSearchLoading = true;
    this.accountListServ.getParticipants(event).subscribe((res) => {
      this.isActivityGroupSearchLoading = false;
      this.lookupdata.TotalRecordCount = res.TotalRecordCount;
      this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
      if (data === 'participant') {
        // this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        this.opportunityContact = res.ResponseObject;
      } else {
        // this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        this.reviewContacts = res.ResponseObject;
      }

    }, error => {
      this.isActivityGroupSearchLoading = false;
      this.opportunityContact = [];
      this.reviewContacts = [];
    })

  }
  goBack() {
    this.clearAutoSaveDate();
    this.router.navigate(['/accounts/managementlog']);
    // this.location.back();
  }
  meetStageChange() {
    const mDate = new Date(this.addManageForm.value.MeetingDate);
    const mTime = new Date(this.addManageForm.value.StartTime);
    let prevDay;
    if (this.addManageForm.value.Meeting.Stage.Id == '3') {
      if (mDate > this.currentDate) {
        this.snackBar.open('You cannot select future date for completed stage', '', {
          duration: 3000
        });
        this.addManageForm.patchValue({
          MeetingDate: '',
        });
      }
      const date = new Date();
      if (mTime > date) {
        this.snackBar.open('You cannot select future time for completed stage', '', {
          duration: 3000
        });
        this.addManageForm.patchValue({
          StartTime: '',
        });
      }
    }
    if (this.addManageForm.value.Meeting.Stage.Id === '2') {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      if (mDate < d) {
        this.snackBar.open('You cannot select previous date for planned stage', '', {
          duration: 3000
        });
        this.addManageForm.patchValue({
          MeetingDate: '',
        });
      }
      const date = new Date();
      if (mTime < date) {
        this.snackBar.open('You cannot select previous time for planned stage', '', {
          duration: 3000
        });
        this.addManageForm.patchValue({
          StartTime: '',
        });
      }
    }
  }
  /****************** State autocomplete code start ****************** */

  showContact4: boolean = false;
  contactName4: string = '';
  contactNameSwitch4: boolean = true;

  contactNameclose4() {
    this.contactNameSwitch4 = false;
  }
  appendcontact4(value) {
    this.contactName4 = value.FullName;
    this.reviewSysName = value.FullName;
    this.reviewSysGuid = value.SysGuid;
    this.selectedContact4.push(value);
    this.advacelookupreviewContacts.push({ ...value, Id: value.Id ? value.Id : value.SysGuid });
    this.selectedreviewContacts = value;
    this.manageAutoSave();
  }
  wiproContact4: {}[] = [

    { index: 0, contact: 'London', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ]

  selectedContact4: {}[] = [];

  /****************** State  autocomplete code end ****************** */

  /****************** created by autocomplete code start ****************** */

  showCreatedBy: boolean = false;
  createdByName: string = '';
  CreatedBySwitch: boolean = true;

  createdByclose() {
    this.CreatedBySwitch = false;
  }
  appendcreatedBy(value, i) {
    this.createdByName = value.FullName;
    this.reviewSysName = value.FullName;
    this.selectedContact4.push(value);
    this.reviewSysGuid = value.SysGuid;
  }
  createdbyArr: {}[] = [

    { index: 0, contact: 'London', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ]

  selectedCreatedBy: {}[] = [];

  /****************** created by  autocomplete code end ****************** */

  /******************Participants  autocomplete code start ****************** */

  showopportunity: boolean = false;
  contactopportunity: string;
  contactopportunitySwitch: boolean = true;

  contactopportunityclose() {
    this.contactopportunity = '';
    this.opportunityContact = [];
    this.contactopportunitySwitch = false;
  }

  duplicateParticipantMsg = 'you are entering duplicate participant!!';

  appendopportunity(value, i) {
    this.contactopportunity = '';
    if (this.selectedopportunity.filter(x => { return x.FullName == value.FullName }).length == 0) {
      this.selectedopportunity.push(value);
      this.valueForSelected.push({ 'SysGuid': value.SysGuid, LinkActionType: 1 });
    }
    else {
      this.snackBar.open(this.duplicateParticipantMsg, '', {
        duration: 3000
      });
    }

  }

  // downloadsingle(i) {
    // this.accountListServ.attachListView[i]
    // const response = {
      // file: this.accountListServ.attachListView[i].Url,
      // file: this.accountListServ.attachListView[i].Url,
    // };
    // this.userdat.Base64Download(this.accountListServ.attachListView[i].Base64String);
    // const a = document.createElement('a');
    // a.href = response.file;
    // a.download = response.file;
    // document.body.appendChild(a);
    // a.click();
    // console.log(i, this.accountListServ.attachListView);
  // }
  downloadsingle(i) {
    let body = [{
        "Name": this.accountListServ.attachListView[i].DownloadName
    }]
      
    this.isLoading = true;
    this.fileService.filesToDownloadDocument64(body).subscribe((res) =>{
      this.isLoading = false;
      if(!res.IsError) {
        res.ResponseObject.forEach(res => {
          this.userdat.Base64Download(res);
        })
      } else {
         this.errorMessage.throwError(res.Message);
      }
      console.log(res);
    },() =>{this.isLoading = false;})
  }

  removeParticipants(item, i) {
    if (item.MapGuid && item.MapGuid !== '') {
      this.valueForSelected[i].LinkActionType = 3;
      this.selectedopportunity = this.selectedopportunity.filter(res => res.MapGuid !== item.MapGuid);
    } else {
      this.selectedopportunity = this.selectedopportunity.filter(res => res.SysGuid !== item.SysGuid)
    }
  }

  opportunityContact = [];
  reviewContacts = [];
  /******************Participants autocomplete code end ****************** */

  /******************Participants ( Non-trace users)  autocomplete code start ****************** */

  showopportunity1: boolean = false;
  contactopportunity1: string;
  contactopportunitySwitch1: boolean = true;

  contactopportunityclose1() {
    this.contactopportunity1 = '';
    this.opportunityContact1 = [];
    this.contactopportunitySwitch1 = false;
  }

  removeParticipants1(item, i) {
    if (item.MapGuid && item.MapGuid !== '') {
      this.valueForSelected1[i].LinkActionType = 3;
      this.selectedopportunity1 = this.selectedopportunity1.filter(res => res.MapGuid !== item.MapGuid);
    } else {
      this.selectedopportunity1 = this.selectedopportunity1.filter(res => res.FullName !== item.FullName);
      this.valueForSelected1.splice(i, 1);
    }
  }
  appendopportunity1(value) {
    this.contactopportunity1 = '';
    this.opportunityContact = [];
    this.opportunityContact1Selected = value;
    this.advacelookupopportunityContact1.push({ ...value, Id: value.AdId });
    if (this.selectedopportunity1.filter(x => { return x.FullName === value.FullName }).length === 0) {
      this.selectedopportunity1.push(value);
      value.LinkActionType = 1;
      this.valueForSelected1.push(value);
      this.manageAutoSave();
    }
    else {
      this.snackBar.open(this.duplicateParticipantMsg, '', {
        duration: 3000
      });
    }
  }
  nonTraceUsers(event) {

    if (event) {

      this.isActivityGroupSearchLoading = true;
      this.accountListServ.getParticipantsNontrace(event).subscribe((res) => {
        this.isActivityGroupSearchLoading = false;
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        if (res.IsError) {
          this.isActivityGroupSearchLoading = false;
          this.opportunityContact1 = [];
        } else {
          this.opportunityContact1 = [];
          console.log('non trace users', res, this.opportunityContact1);
          res.ResponseObject.map(data => {
            this.opportunityContact1.push({ 'Id': data.AdId, 'AdId': data.AdId, 'Email': data.Email, 'FullName': data.FullName });
          });
        }
      }, error => {
        this.isActivityGroupSearchLoading = false;
        this.opportunityContact1 = [];
      });
    } else {
      this.contactopportunitySwitch1 = false;
      this.opportunityContact1 = [];
    }

  }

  opportunityContact1 = [];

  selectedopportunity1 = [];


  /******************Participants ( Non-trace users) autocomplete code end ****************** */

  addrow() {
  }

  clearData() {
    this.tempId = -1;
    this.firstareatext = '';
    this.secondareatext = '';
    this.isEdit = false;
    this.manageAutoSave();
  }
  appenddata() {
    if (this.firstareatext.length !== 0 && this.secondareatext.length > 0) {
      if (this.isEdit) {
        this.table_data.map((x, index) => {
          if (index === this.tempId) {
            x.Comment = this.firstareatext;
            x.ActionIdentified = this.secondareatext;
            x.LinkActionType = 4;
          }
          return x;
        });
        this.TextInputs = false;
      }

      else {
        this.table_data.push(
          {
            id: this.table_data.length + 1,
            Comment: this.firstareatext,
            ActionIdentified: this.secondareatext,
            LinkActionType: 1
          }
        );
      }
    }
    this.clearData();
  }

  Openeditarea(item, index) {
    this.isEdit = true;
    this.firstareatext = item.Comment;
    this.secondareatext = item.ActionIdentified;
    this.tempId = index;
  }

  discarddata() {
  }

  deleterow(item) {
    this.table_data = this.table_data.filter(x => x.id !== item.id);
    if (item.MapGuid) {
      this.accountListServ.commentsNConclusionDelete(item.MapGuid).subscribe(res => {
        if (!res.IsError && res.ResponseObject) {
          this.table_data = this.table_data.filter(x => x.id !== item.id);
          this.snackBar.open(res['Message'], '', {
            duration: 3000
          });
        } else {
          this.snackBar.open(res['Message'], '', {
            duration: 3000
          });
        }
      })
    }
  }


  // file upload functionality starts from here

  public uploader: FileUploader = new FileUploader({ url: URL });
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  arr = [];

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }
  addToArray(array: string) {
    this.arr.push('array' + this.arr.length);
  }
  remove(i: number) {
    this.arr.splice(i, 1);

  }
  deLinkAttach(item, i) {
    if (this.manageEditVal === 'edit' && item.LinkActionType === 2) {
      this.accountListServ.attachmentList[i].LinkActionType = 3;
      this.accountListServ.attachListView.splice(i, 1);
      this.service.filesList.splice(i, 1);
    } else {
      this.accountListServ.attachListView.splice(i, 1);
      this.accountListServ.attachmentList.splice(i, 1);
      this.service.filesList.splice(i, 1);
    }
  }
  // file upload functionality ends here
  checkValidDate() {
    let mDate = new Date(this.addManageForm.value.MeetingDate);
    let mTime = new Date(this.addManageForm.value.StartTime);
    if (this.addManageForm.value.Meeting.Stage.Id == '2') {
      var d = new Date();
      d.setDate(d.getDate() - 1);
      let date = new Date();
      if (mDate < d) {
        this.snackBar.open('You cannot select previous date for planned stage', '', {
          duration: 3000
        });

      } else if ((mDate < date) && (mTime < date)) {
        this.snackBar.open('You cannot select previous time for planned stage', '', {
          duration: 3000
        });

      }
    }
  }
  //save functionality starts
  saveManagementLog() {
    console.log('submit===> ', this.addManageForm.invalid);

    this.FormSubmitted = true;
    let startTime = new Date(this.addManageForm.value.StartTime + 'UTC');
    //let requiredDate = this.addManageForm.value.StartTime;
    this.addManageForm.patchValue({
      CommentandConclusion: this.table_data,
      CustomerAccount: { SysGuid: this.SysGuidid },
      ReviewChairpersonCoach: { SysGuid: this.reviewSysGuid },
      NonTraceUsers: this.valueForSelected1,
      Attachments: this.accountListServ.attachmentList.length > 0 ? this.accountListServ.attachmentList : [],
      // StartTime : moment(requiredDate).local().format()
      StartTime: startTime.toISOString()
    });
    console.log(this.addManageForm.value);

    if (this.manageEditVal === 'edit') {
      if (this.addManageForm.invalid) {
        this.checkValidDate();
        const invalidElements = this.el.nativeElement.querySelector('select.ng-invalid, input.ng-invalid');
        invalidElements.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        this.isLoading = true;
        this.accountListServ.manageLogEdit(this.addManageForm.value).subscribe((res) => {
          this.isLoading = false;
          if (!res.IsError && res.ResponseObject) {
            this.accountListServ.attachmentListView = [];
            this.service.filesList = [];
            this.snackBar.open(res['Message'], '', {
              duration: 3000
            });
            this.clearAutoSaveDate();
            this.router.navigate(['/accounts/managementlog']);
          } else {
            this.snackBar.open(res['Message'], '', {
              duration: 3000
            });
          }
        }, error => {
          this.isLoading = false;
        });
      }
    }

    if (this.manageEditVal !== 'edit') {

      if (this.addManageForm.invalid) {
        const invalidElements = this.el.nativeElement.querySelector('select.ng-invalid, input.ng-invalid');
        invalidElements.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        this.isLoading = true;
        this.accountListServ.manageLogAdd(this.addManageForm.value).subscribe((res) => {
          this.isLoading = false;
          if (!res.IsError && res.ResponseObject) {
            this.accountListServ.attachmentListView = [];
            this.service.filesList = [];
            this.snackBar.open(res['Message'], '', {
              duration: 3000
            });
            this.clearAutoSaveDate();
            this.router.navigate(['/accounts/managementlog']);
          } else {

            this.snackBar.open(res['Message'], '', {
              duration: 3000
            });
          }
        }, error => {
          this.isLoading = false;
        });
      }
    }
  }

  openadvancetabs(controlName, initalLookupData, value, index?, headerdata?, line?): void {
    if (!value) {
      this.emptyArray(controlName);
    }
    this.lookupdata.controlName = controlName;
    this.lookupdata.headerdata = manageLogHeaders[controlName];
    this.lookupdata.lookupName = manageLogNames[controlName]['name'];
    this.lookupdata.isCheckboxRequired = manageLogNames[controlName]['isCheckbox'];
    this.lookupdata.Isadvancesearchtabs = manageLogNames[controlName]['isAccount'];
    this.lookupdata.inputValue = value;
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.accountListServ.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null, rowData: headerdata, rowIndex: index, rowLine: line, Guid: '' }).subscribe(res => {

      this.lookupdata.tabledata = res
    })

    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      disableClose: true,
      width: this.userdat.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });

    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
      console.log(x)
      if (x['objectRowData'].searchKey !== '' && x.currentPage === 1) {
        this.lookupdata.nextLink = '';
      }
      const dialogData = {
        searchVal: (x['objectRowData'].searchKey !== '') ? x['objectRowData'].searchKey : '',
        recordCount: this.lookupdata.recordCount,
        OdatanextLink: this.lookupdata.nextLink,// need to handel the pagination and search!
        pageNo: x.currentPage//need to handel from pagination
      }

      this.accountListServ.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(), ...dialogData } }).subscribe(res => {
        this.lookupdata.isLoader = false;
        if (x.action === 'loadMore') {
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';

        } else if (x.action === 'search') {
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.tabledata = res.ResponseObject;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        }
        else if (x.action === 'tabSwich') {
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
    'ChairPersonSearch': (data) => { this.appendcontact4(data) },
    'NonTraceUsers': (data) => { this.appendopportunity1(data) },
  }
  emptyArray(controlName) {
    switch (controlName) {
      case 'ChairPersonSearch': {
        return this.advacelookupreviewContacts = [], this.selectedreviewContacts = []
      }
      case 'NonTraceUsers': {
        return this.advacelookupopportunityContact1 = [], this.opportunityContact1Selected = []
      }
    }

  }
  selectedLookupData(controlName) {
    switch (controlName) {
      case 'ChairPersonSearch': { return (this.advacelookupreviewContacts.length > 0) ? this.advacelookupreviewContacts : [] }
      case 'NonTraceUsers': { return (this.advacelookupopportunityContact1.length > 0) ? this.advacelookupopportunityContact1 : [] }
    }
  }
  cacheIdName:any = `${this.SysGuidid + "_" + this.ownerSysGuidid + "_manageLogForm"}`;
  manageAutoSave() {

    let obj = {
      contactName4: this.contactName4,
      reviewSysGuid: this.reviewSysGuid,
      selectedopportunity1: this.selectedopportunity1,
      firstareatext: this.firstareatext,
      secondareatext: this.secondareatext,
      valueForSelected1: (this.valueForSelected1 && this.valueForSelected1.length>0)?this.valueForSelected1:[],
      table_data: (this.table_data && this.table_data.length>0)?this.table_data:[],
      attachList: (this.accountListServ.attachmentList && this.accountListServ.attachmentList.length>0) ? this.accountListServ.attachmentList:[],
      attachListView: (this.accountListServ.attachListView && this.accountListServ.attachListView.length>0) ? this.accountListServ.attachListView:[]
    }
    
  this.service.SetRedisCacheData({...this.addManageForm.value, ...obj}, this.cacheIdName).subscribe(res => {
      if (!res.IsError) {
        // console.log("SUCESS FULL AUTO SAVE")
      }
    }, error => {
      console.log(error);
    });
  }
  getManageAutoSaveData() {
    this.service.GetRedisCacheData(this.cacheIdName).subscribe(res => {
      this.isLoading = false;
      if (!res.IsError) {
        if (res.ResponseObject) {
          if (res.ResponseObject !== '') {
            let TempCacheDetails = JSON.parse(res.ResponseObject);
            console.log("get auto save data", TempCacheDetails);            
            this.assignPatchValues(TempCacheDetails);
            this.contactName4 = TempCacheDetails.contactName4;
            this.selectedopportunity1 = TempCacheDetails.selectedopportunity1;
            this.valueForSelected1 = (TempCacheDetails.valueForSelected1 && TempCacheDetails.valueForSelected1.length>0) ? TempCacheDetails.valueForSelected1:[];              
            this.accountListServ.attachmentList = (TempCacheDetails.attachList && TempCacheDetails.attachList.length>0) ? TempCacheDetails.attachList:[];
            this.accountListServ.attachListView = (TempCacheDetails.attachListView && TempCacheDetails.attachListView.length>0) ? TempCacheDetails.attachListView:[];
            if(TempCacheDetails.firstareatext || TempCacheDetails.secondareatext || TempCacheDetails.table_data){
              this.TextInputs = true;
              this.firstareatext = TempCacheDetails.firstareatext ? TempCacheDetails.firstareatext:"";
              this.secondareatext = TempCacheDetails.secondareatext ? TempCacheDetails.secondareatext:"";
              this.table_data = (TempCacheDetails.table_data && TempCacheDetails.table_data.length>0) ? TempCacheDetails.table_data:[];              
            }else{
              this.TextInputs = false;              
            }
          } else {
          }
        } else {
        }
      }

    })
  }
  clearAutoSaveDate() {
    this.service.deleteRedisCacheData(this.cacheIdName).subscribe(res => {

      if (!res.IsError) {
        // console.log("SUCESSFULLY DELETED AUTO SAVE")
      }
    }, error => {
      // console.log(error)
    });
  }

}

// /****************   upload popup start        **************/

@Component({
  selector: 'upload-popup',
  templateUrl: './upload.html',
  styleUrls: ['./account-management-log.component.scss']
})

export class uploadPopup {
  onCancel(): void {
    this.dialogRef.close(false);
  }
  fileResult: FileList[] = [];
  // regData: any = {};
  formData: FormData;
  // files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  // humanizeBytes: Function;
  // dragOver: boolean;
  options: UploaderOptions;
  // fileExtension: any;
  // action: any;
  // filetoadd = [];
  // @Output() UploadOutput = new EventEmitter<string>();
  // @ViewChild('uploader') uploaderInput: ElementRef;
  // isLoading;
  files = [];
  // show50;
  // @Output() modelEmiter = new EventEmitter<{ loader: boolean }>();
  accept = ['application/pdf', 'text/xml', 'application/jpg', 'application/xml', 'application/zip', 'application/octet-stream', 'audio/mp3', 'audio/mp4', 'image/jpeg', 'image/png', 'text/plain', 'image/gif', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'application/msexcel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/doc', 'application/docx', 'video/mp4', 'audio/mpeg', 'application/x-zip-compressed', 'application/mspowerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
  // alloewedFileTypes = ['txt', 'pdf', 'jpg', 'png', 'docx', 'xlsx', 'jpeg', 'TXT', 'PDF', 'JPG', 'PNG', 'DOCX', 'JPEG', 'XLSX'];

  constructor(private leadservice: ContactleadService, public dialogRef: MatDialogRef<uploadPopup>, public service: DataCommunicationService, public registerService: CommitmentRegisterService, public snackBar: MatSnackBar, public accountListServ: AccountListService, private errorMessage: ErrorMessage, private fileService: FileUploadService, @Inject(MAT_DIALOG_DATA) public data: any) {
    // this.options = { concurrency: 1, maxUploads: 3 };

    this.uploadInput = new EventEmitter<UploadInput>();
    // this.humanizeBytes = humanizeBytes;
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  ngOnInit() {
    // this.files = this.data.length ? this.data : [];
    if (this.data.length) {
      this.data.forEach(element => {
        this.files.push({
          'name': element.Name,
          'sub': element.Name,
          'percentage': 100,
          'file': element.Url


          // }
        });
      });
    } else {
      this.files = [];
    }

  }

  // BASE_URL = this.accountListServ.uploadDocumentUrl();
  // BASE_URL = 'https://quapi-dev.wipro.com/L2O.Sprint1_2.Api/api/Storage/UploadDocument';

  onNoClick(): void {
    // console.log(this.service.filesList);
    // var Attach = []
    // this.accountListServ.attachmentList = []
    // this.dialogRef.close(this.service.filesList);
    this.dialogRef.close(this.files);

  }

  onUploadOutput(e) {
    const files = [].slice.call(e.target.files);
    const uploadingFileList = [];
    let fileNames;
    if (files.length > 0) {
      files.forEach(res => {
        const file: File = res;
        const canditionAction = this.fileValidation(file);
        switch (canditionAction) {
          case 'FileSize': {
            this.errorMessage.throwError('Not able to upload the file because filesize is greater than 5mb.');
            break;
          }
          case 'InvalidFormat': {
            this.errorMessage.throwError('File format not supported!')
            break;
          }
          case 'FileExist': {
            this.errorMessage.throwError('File is already exist!')
            break;
          }
          case 'Upload': {
            const fd: FormData = new FormData();
            fd.append('file', file);
            fileNames = file.name;
            uploadingFileList.push(fd);
            break;
          }
        }
      });
      this.fileUplaod(uploadingFileList, e);
    }
  }

  fileValidation(file) {
    let returnType;
    if (file.size > 5242880) {
      returnType = 'FileSize';
    }
    if (!this.accept.includes(file.type)) {
      returnType = 'InvalidFormat';
    }

    if (this.files.length === 0) {
      if (this.accept.includes(file.type)) {
        returnType = 'Upload';
      } else {
        returnType = 'InvalidFormat';
      }
    } else {
      const index = this.files.findIndex(k => k.name === file.name);
      if (index === -1) {
        if (this.accept.includes(file.type)) {
          returnType = 'Upload';
        } else {
          returnType = 'InvalidFormat';
        }
      } else {
        returnType = 'FileExist';
      }
    }
    if (this.accountListServ.attachmentList.length === 0) {
      if (this.accept.includes(file.type)) {
        returnType = 'Upload';
      } else {
        returnType = 'InvalidFormat';
      }
    } else {
      const index = this.accountListServ.attachmentList.findIndex(k => k.Name === file.name);
      if (index === -1) {
        if (this.accept.includes(file.type)) {
          returnType = 'Upload';
        } else {
          returnType = 'InvalidFormat';
        }
      } else {
        returnType = 'FileExist';
      }
    }

    return returnType;
  }


  fileUplaod(fileList, fileData) {
    if (fileList.length > 0) {


      let fileResult = fileData.target.files;
      for (let i = 0; i < fileResult.length; i++) {
        this.files.push({
          'name': fileResult[i].name,
          'sub': fileResult[i].name.split('.')[1].trim(),
          // 'sub': fileResult[i].name,
          'percentage': 25,
          'file': '',        // }
        });
        // console.log(this.fileResult[i]);
      }

      this.fileService.filesToUploadDocument64(fileList).subscribe((res) => {
        if (res) {
          this.files.forEach(function (item, key) {
            console.log('item---' + item + '----' + key);
            item.file = res[key];
            item.percentage = 100;
          });

        } else {
          this.errorMessage.throwError('Something went wrong');

        }

      }, error => {
        this.errorMessage.throwError('Something went wrong');

      }


      );
    }
  }

  // onUploadOutput(output: UploadOutput): void {
  //   let checkDuplicate = false;
  //   if (output.file) {
  //     checkDuplicate = this.fileDuplicate(output);
  //     this.uploaderInput.nativeElement.value = '';
  //     if (output.type === 'done') {
  //       this.count = 0;
  //       this.fileCount = 0;
  //       this.leadCount = 0;
  //     }
  //   } else {
  //     checkDuplicate = false;
  //   }

  //   if (checkDuplicate === false) {
  //     switch (output.type) {
  //       case 'allAddedToQueue':
  //         this.fileCount = 0;
  //         // uncomment this if you want to auto upload files when added
  //         const event: UploadInput = {
  //           type: 'uploadAll',
  //           url: `${this.BASE_URL}`,
  //           method: 'POST',
  //           data: { foo: 'bar' }
  //         };
  //         this.uploadInput.emit(event);
  //         break;
  //       case 'addedToQueue':
  //         this.fileCount = 0;
  //         if (typeof output.file !== 'undefined') {
  //           this.files.push(output.file);
  //           this.service.filesList.push(output.file);
  //           this.registerService.fileListToInsert.push(output.file.nativeFile);
  //         }
  //         break;
  //       case 'start':
  //         this.fileCount = 0;
  //         break;
  //       case 'uploading':
  //         this.fileCount = 0;
  //         if (typeof output.file !== 'undefined') {
  //           // update current data in files array for uploading file
  //           const index = this.files.findIndex((file) => typeof output.file !== 'undefined' && file.id === output.file.id);
  //           this.files[index] = output.file;
  //         }
  //         break;
  //       case 'dragOver':
  //         this.fileCount = 0;
  //         this.dragOver = true;
  //         break;
  //       case 'dragOut':
  //         this.fileCount = 0;
  //       case 'drop':
  //         this.fileCount = 0;
  //         this.dragOver = false;
  //         break;
  //       case 'rejected':
  //         let message = 'File format not supported!';
  //         let action;
  //         this.snackBar.open(message, action, {
  //           duration: 2000
  //         });
  //         break;
  //     }
  //     this.service.filename = output.file.name;
  //     this.fileExtension = this.service.filename.split('.').pop();
  //     output.file.sub = this.fileExtension;
  //   } else {
  //     return;
  //   }

  // }
  // count: number = 0;
  // leadCount: number = 0;
  // fileCount: number = 0;
  // fileDuplicate(output: UploadOutput) {
  //   let status = false;
  //   let filefilter;
  //   if (this.accountListServ.attachmentList.length > 0) {
  //     filefilter = this.accountListServ.attachmentList.filter(data => data.Name === output.file.name)
  //     if (filefilter.length > 0) {
  //       filefilter.forEach(element => {
  //         if (element.Name === output.file.name) {
  //           this.count++;
  //           if (this.count === 1) {
  //             let message = 'File is already exist!';
  //             let action;
  //             this.snackBar.open(message, action, {
  //               duration: 2000
  //             });
  //           }
  //         }
  //       });
  //       status = true;
  //     }
  //   }

  //   if (this.leadservice.attachList.length > 0) {
  //     let leadfilefilter;
  //     leadfilefilter = this.leadservice.attachList.filter(data => data.Name === output.file.name)
  //     if (leadfilefilter.length > 0) {
  //       leadfilefilter.forEach(element => {
  //         if (element.Name === output.file.name) {
  //           this.leadCount++;
  //           if (this.leadCount === 1) {
  //             let message = 'File is already exist!';
  //             let action;
  //             this.snackBar.open(message, action, {
  //               duration: 2000
  //             });
  //           }
  //         }
  //       });
  //       status = true;
  //     }
  //   }

  //   if (this.files.length > 0) {
  //     let filefilters;
  //     filefilters = this.files.filter(data => data.name === output.file.name)
  //     if (filefilters.length > 0) {
  //       this.files.forEach(element => {
  //         if (element.name === output.file.name) {
  //           // this.fileCount++
  //           // if (this.fileCount === 0) {
  //           //   let message = 'File is already exist!'
  //           //   let action
  //           //   this.matSnackBar.open(message, action, {
  //           //     duration: 2000
  //           //   })
  //           // }
  //           console.log('duplicate 123', this.files);
  //         }
  //       });
  //       status = true;
  //     }
  //   }
  //   return status;
  // }
  // checkType(file) {

  //   if (file === 'pdf') {
  //     return 'bluetype';
  //   }
  //   if (file === 'PDF') {
  //     return 'bluetype';
  //   }
  //   if (file === 'xlsx') {
  //     return 'extension';
  //   }
  //   else {
  //     return 'orange';
  //   }
  // }
  // startUpload(): void {
  //   const event: UploadInput = {
  //     type: 'uploadAll',
  //     url: 'https://l2o-api.azurewebsites.net/api/Storage/UploadDocument',
  //     method: 'POST',
  //     data: { foo: 'bar' }
  //   };
  // }
  // cancelUpload(id: string): void {
  //   this.uploadInput.emit({ type: 'cancel', id: id });
  // }
  // removeFile(id: string): void {
  //   this.uploadInput.emit({ type: 'remove', id: id });
  // }
  // removeAllFiles(): void {
  //   this.uploadInput.emit({ type: 'removeAll' });
  // }
  deleteUploadedFile(event) {
    this.files.splice(event, 1);
    // this.service.filesList.splice(event, 1);
  }
}


// /****************** upload popup END  */