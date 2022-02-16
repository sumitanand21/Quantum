import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { DataCommunicationService } from '@app/core/services/global.service';
import { RoutingState } from '@app/core/services/navigation.service';
import { DatePipe } from '@angular/common';
import { OfflineService, ErrorMessage, ArchivedLeadsService, ContactleadService, UnqualifiedLeadsService, LeadListOfflineService } from '@app/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { newConversationService } from '@app/core/services/new-conversation.service';
import { MyOpenLeadsService, LeadCustomErrorMessages } from '@app/core/services/myopenlead.service';
import { Update } from '@ngrx/entity';
import { LeadNurture, ClearArchivedLeadState, ClearOpenLeadState, ClearMyopenlead, LeadQualify, ArchivedRestore, UpdateLeadOwner, UpdateHistoryflag, LeadDisQualify, ClearAllLeadDetails } from '@app/core/state/actions/leads.action';
import { getLeadsDetails } from '@app/core/state/selectors/lead/lead.selector';
import { select, Store } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { removeSpaces, checkLimit } from '@app/shared/pipes/white-space.validator';
import { Subscription } from 'rxjs';
import { ClearContactList, ClearRelationshipCount } from '@app/core/state/actions/contact.action';
import { DigitalAssistantService } from '@app/core/services/digital-assistant/digital-assistant.service';
import { AssistantGlobalService } from '@app/modules/digital-assistant/services/assistant-global.service';
const ArchivedStatus = ['Archived', 'Disqualified', 'Rejected']
enum IdentifyLeadstype {
  "unqualified" = 1,
  "qualified" = 3,
  "unqualifiedName" = "Unqualified",
  "qualifiedName" = "Qualified",
  "archivedStatusName" = "Archived"
}
@Component({
  selector: 'app-leads-details-landing',
  templateUrl: './leads-details-landing.component.html',
  styleUrls: ['./leads-details-landing.component.scss']
})

export class LeadsDetailsLandingComponent implements OnInit {
  details: boolean;
  score: boolean;
  history: boolean;
  showmore: boolean = false;
  tableName: any;
  leadName: any;
  data: any;
  name: string = "";
  isLoading: boolean = false;
  Lead_details: boolean;
  Lead_score: boolean;
  Lead_history: boolean;
  id: any;
  leadType: any
  nurtureVisibility: boolean = false;
  isNurtureVisibility: boolean = true
  LeadStateDetails
  LeadDetailsActionButtons
  leadIdentityFrom: number
  showArchivedRestoreIcon: boolean = true
  showmoreOptions: boolean = false
  LeadCancelSave$: Subscription
  showCancelSave: boolean = true
  isAssignbuttonShow: boolean
  showEditbutton: boolean = true
  leadhistoryName: any
  isHistory: boolean;
  userID: any
  enquiryType: any;
  isMoreAction: boolean;

  constructor(
    public router: Router,
    public dialog: MatDialog,
    public contactleadservice: ContactleadService,
    public service: DataCommunicationService,
    public routingState: RoutingState,
    public snackBar: MatSnackBar,
    private encrDecrService: EncrDecrService,
    public store: Store<AppState>,
    private myOpenLeadsService: MyOpenLeadsService,
    public errorMessage: ErrorMessage,
    public daService: DigitalAssistantService,
    public assistantGlobalService: AssistantGlobalService) {

    this.service.getLeadCancelSave().subscribe(res => {
      if (res !== null && res !== undefined) {
        // if(!this.showCancelSave){
        this.showCancelSave = res
        // }
      }
    })
  }

  ngOnInit() {
    this.id = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', JSON.parse(sessionStorage.getItem('LeadId')), 'DecryptionDecrip')
    this.userID = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
    this.store.pipe(select(getLeadsDetails(this.id))).subscribe(res => {
      if (res) {
        console.log(res);
        // this.daService.iframePage = 'SALES_LEAD_OWNER_ID';
        let bodyDA = {
          page: 'SALES_LEAD_OWNER_ID',
          accountGuid: res.Account ? res.Account.SysGuid : null,
          verticalId: res.Vertical.Id,
          verticalName: res.Vertical.Name,
          userID: this.encrDecrService.get("EncryptionEncryptionEncryptionEn", localStorage.getItem("userID"), 'DecryptionDecrip')
        };
        this.assistantGlobalService.setLeadDetails(bodyDA)
        // this.daService.postMessageData = bodyDA;
        // this.daService.postMessage(bodyDA);
        //Hide & show - moreoptions,archive/restore,qualify,disqualify
        this.decideShowMoreArchivedRestore(res)
        //show restore button only when status is archived and it shd be from archived list's
        this.showArchivedRestoreIcon = (this.isLeadFromArchivedList(res) && this.isRestoreicon(res)) ? true : false
        this.LeadStateDetails = res
        this.isHistory = res.isHistory
        this.LeadDetailsActionButtons = {
          nurture: (res.isAcceptable) ? false : (res.IsNurture && res.isUserCanEdit == true) ? true : false,
          disqualify: (res.isAcceptable) ? false : (res.Status) ? (res.Status.Id != undefined) ? (res.Status.Id == IdentifyLeadstype.qualified && res.isUserCanEdit == true) ? true : false : false : false,
          qualify: (res.isAcceptable) ? false : (res.Status) ? (res.Status.Id != undefined) ? (res.Status.Id == IdentifyLeadstype.unqualified && res.isUserCanEdit == true) ? true : false : false : false,
          archive: (res.isAcceptable) ? null : (res.Status) ? (res.Status.Id != undefined) ? ((res.Status.Id == IdentifyLeadstype.unqualified || res.Status.Id == IdentifyLeadstype.qualified) && (res.isUserCanEdit == true)) ? true : false : false : false,
          opportunity: (res.isAcceptable) ? false : (res.Status) ? (res.Status.Id != undefined) ? (res.Status.Id == IdentifyLeadstype.qualified && res.isOpportunityCreated == false && res.isUserCanEdit == true) ? true : false : false : false,
          restore: this.isRestoreicon(res)
        }
        this.decideShowEditButton(res)
        this.moreActionButton(res)
      }
    })

  }

  decideShowMoreArchivedRestore(res) {

    if (this.isLeadFromArchivedList(res)) { // hide all options if details from archived list's status
      this.showArchivedRestoreIcon = false
      this.showmoreOptions = false
    } else { // show details page options
      this.showArchivedRestoreIcon = true
      this.showmoreOptions = true
    }

  }

  isLeadFromArchivedList(res: any): boolean {

    return ArchivedStatus.some(x => x == res.Status.status)
  }

  isRestoreicon(res) {

    return (res.Status) ? (res.Status.status) ? ((res.Status.status == IdentifyLeadstype.archivedStatusName) && res.isUserCanEdit) ? true : false : false : false
  }

  // Enable the lead owner if lead owner is originator
  decideShowEditButton(res) {
    if (res) {
      if (res.isUserCanEdit != null && res.isUserCanEdit != undefined) {
        if (res.isUserCanEdit) {
          this.showEditbutton = this.isLeadFromArchivedList(res) ? false : true
          this.isAssignbuttonShow = true
        } else {
          this.showEditbutton = false
          this.isAssignbuttonShow = false
        }
      }
    }
  }

  moreActionButton(res) {
    if (res) {
      if (res.isUserCanEdit != null && res.isUserCanEdit != undefined) {
        if (res.isUserCanEdit == false || res.Status.status == "Disqualified") {
          this.isMoreAction = false
        } else {
          this.isMoreAction = true
        }
      }
    }
  }

  ngOnDestroy(): void {
    // sessionStorage.removeItem("navigation")
  }

  QualifyLead() {
    const dialogRef = this.dialog.open(qualifypopComponent,
      {
        width: '396px',
        data: this.LeadStateDetails
      });
  }

  // MORE ACTION STARTS **************
  showContent: boolean = false;
  contentArray = [
    { className: 'mdi mdi-close', value: 'Disqualify' },
    { className: 'mdi mdi-crop-square', value: 'Nurture' },
    // { className: 'mdi mdi-bullhorn', value: 'Request campaign' }
  ]

  additem(item) {
    this.showContent = false;
  }

  closeContent() {
    this.showContent = false;
  }

  toggleContent() {
    this.showContent = !this.showContent;
  }
  // MORE ACTION ENDS *******************
  Details() {
    this.Lead_details = true;
    this.Lead_score = false;
    this.Lead_history = false;
  }
  Score() {
    this.Lead_details = false;
    this.Lead_score = true;
    this.Lead_history = false;
  }
  History() {
    this.Lead_details = false;
    this.Lead_score = false;
    this.Lead_history = true;
  }
  tabone() {
    this.details = true;
    this.score = false;
    this.history = false;
  }
  tabtwo() {
    this.details = false;
    this.score = true;
    this.history = false;
  }
  tabthree() {
    this.details = false;
    this.score = false;
    this.history = true;
  }

  openassign() {
    const dialogRef = this.dialog.open(assignpopComponent,
      {
        width: '396px',
        data: this.LeadStateDetails
      });
  }
  opennurture() {
    const dialogRef = this.dialog.open(nuturepopComponent,
      {
        width: '396px',
        data: this.LeadStateDetails
      });
  }
  opendisqualify() {
    const dialogRef = this.dialog.open(disqualifypopComponent,
      {
        width: '396px',
        data: this.LeadStateDetails
      });
  }
  openopportunity() {
    const dialogRef = this.dialog.open(opportunitypopComponent,
      {
        width: '396px',
        data: this.LeadStateDetails
      });
    dialogRef.afterClosed().subscribe(res => {
      console.log('res', res)
      if (res !== undefined && res != '') {
        if (res.includes('prospectAccount')) {
          localStorage.setItem('prospectaccountid', this.LeadStateDetails.Account.SysGuid)
          // this.groupData();
        }
        // else if(res.includes('overview')){
        // } 
        else {
          sessionStorage.setItem('CreateOpportunityFromLead', JSON.stringify(this.LeadStateDetails));
          if (this.data) {
            if (this.data.isHistory) {
              this.myOpenLeadsService.setSession('path', '/leads/leadDetails/leadHistory');
            } else {
              this.myOpenLeadsService.setSession('path', '/leads/leadDetails/leadDetailsInfo');
            }
          }
        }
        this.router.navigateByUrl(res)
      }
    })
  }

  groupData() {
    var object = {
      activityGroupName: "",
      account: {
        Name: this.LeadStateDetails.Account.Name,
        Id: this.LeadStateDetails.Account.SysGuid,
        Industry: "",
        Region: ""
      },
      model: 'Create lead',
      route: 'leads/leadDetails/leadDetailsInfo'
    }
    sessionStorage.setItem('CreateActivityGroup', JSON.stringify(object))
  }

  openarchive() {
    const dialogRef = this.dialog.open(archivepopComponent,
      {
        width: '396px',
        data: this.LeadStateDetails
      });
  }

  openrestore() {
    const dialogRef = this.dialog.open(restorepopComponent,
      {
        width: '396px',
        data: this.LeadStateDetails
      });
  }

  navTo() {
    if (sessionStorage.getItem('selAccountObj')) {
      this.accountleadSprintThreeModuleBack()
    } else {
      this.leadModuleBack();
    }
  }

  accountleadSprintThreeModuleBack() {
    this.leadIdentityFrom = JSON.parse(sessionStorage.getItem('navigationfromlist'))
    if (this.isHistory) {
      this.router.navigate(['leads/leadDetails'])
      this.myOpenLeadsService.updateHistoryFlag(this.id, false)
    } else if (this.leadIdentityFrom == 2) {
      this.router.navigate(['accounts/accountleads/unqalified'])
    } else if (this.leadIdentityFrom == 1) {
      this.router.navigate(['accounts/accountleads/qualified'])
    } else if (this.leadIdentityFrom == 3) {
      this.router.navigate(['accounts/accountleads/archived'])
    } else if (this.leadIdentityFrom == 4) {
      this.router.navigate(['accounts/accountleads/diqualified'])
    } else if (this.leadIdentityFrom == 7) {
      this.router.navigate(['/contacts/contactopenlead']);
    } else if (this.leadIdentityFrom == 6) {
      this.router.navigate(['/contacts/contactlead']);
    } else if (this.leadIdentityFrom == 8) {
      this.router.navigate(['/contacts/contactarchivelead']);
    }else if (this.leadIdentityFrom == 9) {
      this.router.navigate(['/contacts/contactclosedlead']);
    }
    this.isLoading = true
  }

  leadModuleBack() {
    this.leadIdentityFrom = JSON.parse(sessionStorage.getItem('navigationfromlist'))
    if (this.isHistory) {
      this.router.navigate(['leads/leadDetails'])
      this.myOpenLeadsService.updateHistoryFlag(this.id, false)
    } else if (this.leadIdentityFrom == 2) {
      this.router.navigate(['leads/unqalified'])
    } else if (this.leadIdentityFrom == 1) {
      this.router.navigate(['leads/qualified'])
    } else if (this.leadIdentityFrom == 3) {
      this.router.navigate(['leads/archived'])
    } else if (this.leadIdentityFrom == 4) {
      this.router.navigate(['leads/diqualified'])
    } else if (this.leadIdentityFrom == 7) {
      this.router.navigate(['/contacts/contactopenlead']);
    } else if (this.leadIdentityFrom == 6) {
      this.router.navigate(['/contacts/contactlead']);
    } else if (this.leadIdentityFrom == 8) {
      this.router.navigate(['/contacts/contactarchivelead']);
    }else if (this.leadIdentityFrom == 9) {
      this.router.navigate(['/contacts/contactclosedlead']);
    }
    this.isLoading = true
  }

  navigateToHistory() {
    let changes = { isHistory: true }
    const historyChange = {
      id: this.id,
      changes
    }
    this.store.dispatch(new UpdateHistoryflag({ Historyflag: historyChange }))
    this.router.navigate(['leads/leadDetails/leadHistory'])
  }

  emitActions(flag, action) {
    if (flag == true) {
      this.service.sendLeadParentActionBtn(action)
    }
  }
}
@Component({
  selector: 'nurture-pop',
  templateUrl: './nuture-pop.html',
})
export class nuturepopComponent implements OnInit {
  nurtureForm: FormGroup
  leadName: string
  Dateinvalid: boolean
  RemarksInvalid: boolean
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public datepipe: DatePipe,
    public offlineService: OfflineService,
    public snackBar: MatSnackBar,
    public errorMessage: ErrorMessage,
    public formBuilder: FormBuilder,
    public routingState: RoutingState,
    private myOpenLeadsService: MyOpenLeadsService,
    public store: Store<AppState>,
    private service: DataCommunicationService,
    public dialogRef: MatDialogRef<nuturepopComponent>) {
  }

  ngOnInit() {
    this.nurtureFormGroup();
    console.log('----->', this.data.statusText);
    this.leadName = this.data.Title;
    console.log("the dat is ")
    console.log(this.data)
  }

  get f() {
    return this.nurtureForm.controls
  }

  clickedDate() {
    console.log("clciked nurture!!")
    this.Dateinvalid = false
  }

  opennurture() {
    if (this.nurtureForm.valid) {
      this.dialogRef.close()
      let nurtureleadObject = {
        "LeadGuid": this.data.LeadGuid,
        "wipro_nurture": true,
        "wipro_nurtureremarks": encodeURIComponent(this.nurtureForm.value.nurtureRemarks)
      }
      this.myOpenLeadsService.NurtureLead([nurtureleadObject]).subscribe(async res => {
        if (res.IsError == false) {
          this.errorMessage.throwError(res.Message)
          const changes = { IsNurture: true, wipro_nurtureremarks: this.nurtureForm.value.nurtureRemarks };                            //state management for edit 
          const NurtureChange: Update<any>[] = [{
            id: this.data.LeadGuid,
            changes
          }]
          if (this.data.isHistory == true) {
            this.service.sendLeadHistry(this.data.isHistory);
          }
          this.store.dispatch(new LeadNurture({ updateurture: NurtureChange }))
        } else {
          this.errorMessage.throwError(res.Message)
        }
      })
    } else {
      if (this.nurtureForm.value.nurtureDeadline == null && this.nurtureForm.value.nurtureRemarks == null) {
        this.Dateinvalid = true
        this.RemarksInvalid = true
      } else if (this.nurtureForm.value.nurtureDeadline == null) {
        this.Dateinvalid = true
      } else if (this.nurtureForm.value.nurtureRemarks == null) {
        this.RemarksInvalid = true
      }
    }
  }

  clickedRemarks() {
    this.RemarksInvalid = false
  }

  nurtureFormGroup() {
    this.nurtureForm = this.formBuilder.group({
      nurtureRemarks: [null, Validators.compose([Validators.required, removeSpaces, checkLimit(2500)])]
    })
  }
}
@Component({
  selector: 'archive-pop',
  templateUrl: './archive.html',
})
export class archivepopComponent implements OnInit {
  archievedForm: FormGroup
  leadName: string
  Dateinvalid: boolean;
  RemarksInvalid: boolean;
  Sucess: boolean
  mindate: any;
  isLoading: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public datepipe: DatePipe,
    public offlineService: OfflineService,
    public archivelead: ArchivedLeadsService,
    public router: Router,
    public snackBar: MatSnackBar,
    public errorMessage: ErrorMessage,
    public formBuilder: FormBuilder,
    public service: DataCommunicationService,
    private myOpenLeadsService: MyOpenLeadsService,
    public store: Store<AppState>,
    public dialogRef: MatDialogRef<nuturepopComponent>,
    private leadListOfflineService: LeadListOfflineService) {
    this.mindate = new Date()
  }
  ngOnInit() {
    this.archievedFormGroup()
    this.leadName = this.data.Title;
  }

  get f() {
    return this.archievedForm.controls
  }

  openarchived() {
    this.isLoading = true;
    if (this.archievedForm.valid) {
      this.dialogRef.close()
      let Archiveformdata = this.archievedForm.value
      let arcihveReqBody = {
        LeadGuid: this.data.LeadGuid,
        wipro_archivingpromptdate: this.datepipe.transform(new Date(Archiveformdata.archievedDate), 'yyyy-MM-dd'),
        remarks: encodeURIComponent(Archiveformdata.archievedRemarks),
        OldStatusReasonGuid: this.data.OldStatusReasonGuid,
        OldStatusGuid: this.data.OldStatusGuid
      }
      this.myOpenLeadsService.ArchiveLeads([arcihveReqBody]).subscribe(async res => {
        if (res.IsError == false) {
          this.isLoading = false
          this.Sucess = true
          this.leadListOfflineService.ClearEntireLeadIndexTableData()
          let leadGuidArray = []
          leadGuidArray.push(this.data.LeadGuid)
          this.store.dispatch(new ClearAllLeadDetails())
          this.store.dispatch(new ClearArchivedLeadState())
          this.store.dispatch(new ClearOpenLeadState())
          this.store.dispatch(new ClearMyopenlead())
          this.store.dispatch(new ClearContactList())
          this.store.dispatch(new ClearRelationshipCount());
          this.store.dispatch(new ArchivedRestore({ ids: leadGuidArray }))
          if (this.data.isHistory == true) {
            this.service.sendLeadHistry(this.data.isHistory);
          }
          if (this.data.Status.status == "Qualified") {
            this.isLoading = false
            this.errorMessage.throwError(res.Message)
          } else if (this.data.Status.status == "Unqualified") {
            this.isLoading = false
            this.errorMessage.throwError(LeadCustomErrorMessages.UnqualifiedArchive)
          }
        } else {
          this.isLoading = false
          this.errorMessage.throwError(res.Message)
        }
      })
    }
    else {
      this.service.validateAllFormFields(this.archievedForm);
    }
  }

  archievedFormGroup() {
    this.archievedForm = this.formBuilder.group({
      archievedDate: [null, Validators.required],
      archievedRemarks: [null, Validators.compose([Validators.required, removeSpaces, checkLimit(2500)])]
    })
  }
}
@Component({
  selector: 'opportunity-pop',
  templateUrl: './opportunity-pop.html',
})

export class opportunitypopComponent {
  oppPopDataIndex = 0;
  oppPopData = []
  AccountName: any;
  constructor(public dialogRef: MatDialogRef<opportunitypopComponent>, @Inject(MAT_DIALOG_DATA) public data, public globalService: DataCommunicationService) {
    this.AccountName = decodeURIComponent(data.Account.Name)
    data.AccountType === 'Prospect' ? this.oppPopDataIndex = 1 : (data.AccountType === 'Reserve') ? this.oppPopDataIndex = 2 : this.oppPopDataIndex = 0
    this.oppPopData = this.globalService.leadToOpp();
    this.oppPopData[this.oppPopDataIndex].name = this.data.Title
  }

  Createopp() {
    if (this.oppPopData[this.oppPopDataIndex].routerLink != '') {
      this.dialogRef.close(this.oppPopData[this.oppPopDataIndex].routerLink)
    } else {
      this.dialogRef.close()
    }
  }
}
@Component({
  selector: 'qualify-pop',
  templateUrl: './qualify-pop.html',
})
export class qualifypopComponent {
  isLoading: boolean
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public store: Store<AppState>,
    private myOpenLeadsService: MyOpenLeadsService,
    private service: DataCommunicationService,
    public errorMessage: ErrorMessage) { }

  leadQualify() {
    let qualifiedleadObjects =
    {
      "LeadGuid": this.data.LeadGuid,//data.objectRowData.data[0].ID,
      "CreateAccount": false,
      "CreateContact": false,
      "CreateOpportunity": false,
      "statuscode": 3
    }
    this.isLoading = true
    this.myOpenLeadsService.QyalifyLeads([qualifiedleadObjects]).subscribe(async res => {
      if (res.IsError == false) {
        this.isLoading = false
        const changes = {
          Status: {
            Id: IdentifyLeadstype.qualified,
            status: IdentifyLeadstype.qualifiedName
          }
        };                            //state management for edit 
        const QualifyChange: Update<any>[] = [{
          id: this.data.LeadGuid,
          changes
        }]
        if (this.data.isHistory == true) {
          this.service.sendLeadHistry(this.data.isHistory);
        } else {
          this.myOpenLeadsService.updateHistoryFlag(this.data.LeadGuid, false)
        }
        this.errorMessage.onSuccessMessage(res.Message).afterDismissed().subscribe(() => {
          this.store.dispatch(new LeadDisQualify({ ids: [this.data.LeadGuid] }))
          this.store.dispatch(new LeadQualify({ updatequalify: QualifyChange }))
          this.store.dispatch(new ClearArchivedLeadState())
          this.store.dispatch(new ClearOpenLeadState())
          this.store.dispatch(new ClearMyopenlead())
          this.store.dispatch(new ClearAllLeadDetails())
        })
      } else {
        this.errorMessage.throwError(res.Message)
        this.isLoading = false
      }
    })
  }
}
@Component({
  selector: 'disqalify-pop',
  templateUrl: './disqualify-pop.html',
})
export class disqualifypopComponent implements OnInit {
  LeadName: string;
  disqualifyForm: FormGroup;
  RemarksInvalid: boolean;
  DisqualifyReasonarr: any = []
  disqualifyStatusGuid: any;
  disqualifyReasonId: any;
  StatusGuid: any;
  DisSysGuid: any;
  DisStatusGuid: any;
  disqualifySysGuid: any;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.disqualifiedFormGroup();
    this.LeadName = this.data.Title;
    this.getDisqualifyReason()
  }

  get f() {
    return this.disqualifyForm.controls
  }

  maxlength(event) {
    if (event.target.value.length > 2000) {
      return true
    }
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public unqualifiedLeads: UnqualifiedLeadsService,
    public offlineService: OfflineService,
    public router: Router,
    public formBuilder: FormBuilder,
    public matSnackBar: MatSnackBar,
    public errorMessage: ErrorMessage,
    private myOpenLeadsService: MyOpenLeadsService,
    public store: Store<AppState>,
    public dialogRef: MatDialogRef<nuturepopComponent>,
    private leadListOfflineService: LeadListOfflineService,
    private service: DataCommunicationService) { }

  clickedRemark() {
    this.RemarksInvalid = false
  }

  getDisqualifyReason() {
    this.unqualifiedLeads.disqualifyLeadReason().subscribe(res => {
      if (!res.IsError) {
        res.ResponseObject.forEach(element => {
          let json = {
            SysGuid: element.SysGuid,
            Name: (element.Name) ? element.Name.replace(/\?/g, '-') : "",
            StatusGuid: element.StatusGuid
          }
          this.DisqualifyReasonarr.push(json)
        });
      } else {
        this.errorMessage.throwError(res.Message)
      }
    })
  }

  appendDisqualifyReasonMob(event) {
    this.disqualifySysGuid = event.target.value
    this.DisqualifyReasonarr.forEach(element => {
      if (element.SysGuid == this.disqualifySysGuid) {
        this.DisSysGuid = element.SysGuid
        this.DisStatusGuid = element.StatusGuid
      }
      this.disqualifyReasonId = { SysGuid: this.DisSysGuid, StatusGuid: this.DisStatusGuid }
    })
  }

  appendDisqualifyReason(event) {
    this.disqualifyReasonId = event.value
  }

  disqualify() {
    this.isLoading = true
    if (this.disqualifyForm.valid) {
      this.dialogRef.close()
      let Req = {
        "LeadGuid": this.data.LeadGuid,
        "statecode": 2,
        "statuscode": 184450007,
        "remarks": encodeURIComponent(this.disqualifyForm.value.remarks),
        "StatusReason": {
          "StatusGuid": this.disqualifyReasonId.StatusGuid,
          "SysGuid": this.disqualifyReasonId.SysGuid
        }
      }
      this.myOpenLeadsService.DisqualifyLead([Req]).subscribe(async res => {
        if (res.IsError == false) {
          this.isLoading = false;
          this.errorMessage.onSuccessMessage(res.Message).afterDismissed().subscribe(() => {
            this.leadListOfflineService.ClearEntireLeadIndexTableData()
            const changes = res.ResponseObject
            this.store.dispatch(new ClearArchivedLeadState())
            this.store.dispatch(new ClearOpenLeadState())
            this.store.dispatch(new ClearMyopenlead())
            this.store.dispatch(new ClearAllLeadDetails())
            this.store.dispatch(new LeadDisQualify({ ids: [this.data.LeadGuid] }))
            if (sessionStorage.getItem('selAccountObj')) {
              this.router.navigateByUrl('accounts/accountleads/diqualified');
            } else {
              this.router.navigateByUrl('leads/diqualified');
            }
          })
        } else {
          this.isLoading = false;
          this.errorMessage.throwError(res.Message)
        }
      })
    } else {
      this.isLoading = false;
      this.service.validateAllFormFields(this.disqualifyForm);
    }
  }

  disqualifiedFormGroup() {
    this.disqualifyForm = this.formBuilder.group({
      remarks: [null, Validators.compose([Validators.required, removeSpaces, checkLimit(2500)])],
      disqualfyreason: ['', Validators.required]
    })
  }
}
@Component({
  selector: 'restore-pop',
  templateUrl: './restore-pop.html',
})

export class restorepopComponent implements OnInit {
  leadName: string;
  isLoader: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public store: Store<AppState>,
    private archivelead: ArchivedLeadsService,
    public errorMessage: ErrorMessage,
    private leadListOfflineService: LeadListOfflineService,
    private service: DataCommunicationService,
    private myOpenLeadsService: MyOpenLeadsService
  ) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.leadName = this.data.Title
  }

  restoreClicked(): void {
    this.isLoader = true;
    this.leadName = this.data.Title
    let restorelead = {
      "LeadGuid": this.data.LeadGuid,
      "statecode": 0,
      "statusreason": 1,
      "OldStatusReasonGuid": this.data.OldStatusReasonGuid,
      "OldStatusGuid": this.data.OldStatusGuid
    }
    this.archivelead.restorelead([restorelead]).subscribe(async res => {
      if (res.IsError == false) {
        await this.leadListOfflineService.ClearLeadListIndexTableData(this.leadListOfflineService.LeadTableIdentity.OpenLead)
        await this.leadListOfflineService.ClearLeadListIndexTableData(this.leadListOfflineService.LeadTableIdentity.MyOpenLead)
        if (this.data.isHistory == true) {
          this.service.sendLeadHistry(this.data.isHistory);
        } else {
          this.myOpenLeadsService.updateHistoryFlag(this.data.LeadGuid, false)
        }
        this.errorMessage.onSuccessMessage(res.Message).afterDismissed().subscribe(() => {
          this.store.dispatch(new ArchivedRestore({ ids: [this.data.LeadGuid] }))
          this.store.dispatch(new ClearAllLeadDetails())
          this.store.dispatch(new ClearOpenLeadState())
          this.store.dispatch(new ClearMyopenlead())
        })
      } else {
        this.isLoader = false;
        this.errorMessage.throwError(res.Message)
      }
    }, error => {
      this.isLoader = false
    })
  }
}
@Component({
  selector: 'assign-pop',
  templateUrl: './assign-pop.html',
  styleUrls: ['./leads-details-landing.component.scss']
})
export class assignpopComponent implements OnInit {
  AcssignForm: FormGroup;
  create: boolean = false;
  OwnerArray: any = [];
  selectedsolution: {}[] = [];
  detailsLeadName: any;
  detailsLeadGuid: any;
  id: any;
  LeadOwnerName: any;
  invalidlead: boolean;
  isLoading: boolean = false
  isAssignLeadLoading = false;
  arrowkeyLocation = 0;

  /******************Potential wipro solutions  autocomplete code start ****************** */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public fb: FormBuilder,
    public matSnackBar: MatSnackBar,
    public service: DataCommunicationService,
    public dialog: MatDialog,
    public contactleadService: ContactleadService,
    public newconversationService: newConversationService,
    public offlineService: OfflineService,
    public store: Store<AppState>,
    private erroPopUp: ErrorMessage,
    private leadListOfflineService: LeadListOfflineService,
    public router: Router,
    private myOpenLeadsService: MyOpenLeadsService,
    public dialogRef: MatDialogRef<assignpopComponent>) {
  }

  ngOnInit() {
    this.CreateAssignLead();
    this.detailsLeadGuid = this.data.LeadGuid
    this.detailsLeadName = this.data.Title
    this.LeadOwnerName = sessionStorage.getItem('LeadownerName')
  }

  CreateAssignLead() {
    this.AcssignForm = this.fb.group({
      owner: [''],
    })
    this.OnChanges()
  }

  CreateActivity() {
    this.isLoading = true
    if (this.AcssignForm.valid === false) {
      this.service.validateAllFormFields(this.AcssignForm);
    }
    if (this.AcssignForm.valid === true && this.selectedsolution.length > 0) {
      this.dialogRef.close()
      this.create = true;
      const body = {
        "LeadGuid": this.detailsLeadGuid,
        "Owner": { "SysGuid": this.ownerSysGuid, "FullName": this.LeadOwnerName },
      }
      this.isLoading = true
      this.contactleadService.getAssignleads(body).subscribe(async res => {
        if (res.IsError === false) {
          this.isLoading = false
          const changes = {
            Owner: {
              FullName: res.ResponseObject.Owner.FullName,
              ownerId: res.ResponseObject.Owner.SysGuid
            }
          }
          const updateleadOwnerbody = {
            id: res.ResponseObject.LeadGuid,
            changes
          }
          await this.leadListOfflineService.ClearLeadListIndexTableData(this.leadListOfflineService.LeadTableIdentity.OpenLead)
          await this.leadListOfflineService.ClearLeadListIndexTableData(this.leadListOfflineService.LeadTableIdentity.MyOpenLead)
          this.erroPopUp.onSuccessMessage(res.Message).afterDismissed().subscribe(() => {
            this.store.dispatch(new UpdateLeadOwner({ updateOwner: updateleadOwnerbody }))
            this.store.dispatch(new ClearOpenLeadState())
            this.store.dispatch(new ClearMyopenlead())
            if (sessionStorage.getItem('selAccountObj')) {
              this.router.navigate(['/accounts/accountleads/archived']);
            } else {
              this.router.navigate(['/leads/archived'])
            }
          })
        } else {
          this.isLoading = false
          this.erroPopUp.throwError(res.Message)
        }
      }, error => {
        this.isLoading = false;
        this.onError("User doesn't have sufficient permissions to complete the task")
      })
    } else {
      this.invalidlead = true
    }
  }

  OnChanges() {
    this.AcssignForm.get('owner').valueChanges.subscribe(val => {
      this.isAssignLeadLoading = true;
      this.OwnerArray = [];
      this.contactleadService.getsearchLeadOwner(val).subscribe(
        data => {
          this.isAssignLeadLoading = false;
          if (data.IsError === false) {
            this.OwnerArray = data.ResponseObject;
          } else {
            this.onError(data.Message);
            this.isAssignLeadLoading = false;
          }
        }, error => {
          this.isAssignLeadLoading = false;
          this.OwnerArray = [];
        })
    })
  }

  callTempAssignleadSearch() {
    this.contactleadService.getsearchLeadOwner("").subscribe(
      data => {
        this.isAssignLeadLoading = false;
        if (data.IsError === false) {
          this.OwnerArray = data.ResponseObject;
        } else {
          this.onError(data.Message);
          this.isAssignLeadLoading = false;
        }
      }, error => {
        this.isAssignLeadLoading = false;
        this.OwnerArray = [];
      }
    )
  }

  delinkAssign(i) {
    this.selectedsolution.splice(i)
  }

  showsolution: boolean = false;
  solution: string;
  solutionSwitch: boolean = true;
  ownerSysGuid: any;

  solutionleadclose() {
    this.solutionSwitch = false;
    if (this.ownerSysGuid === undefined) {
      this.AcssignForm.patchValue({
        owner: ''
      })
    }
  }

  appendsolution(value: string, item, i) {
    this.ownerSysGuid = item.ownerId
    this.LeadOwnerName = item.FullName
    this.selectedsolution = [{ FullName: item.FullName, ownerId: item.ownerId }];
    let beforeLength = this.selectedsolution.length
    this.selectedsolution = this.service.removeDuplicates(this.selectedsolution, "ownerId");
    let afterLength = this.selectedsolution.length
    if (beforeLength === afterLength) {
      this.AcssignForm.patchValue({
        owner: ""
      });
    }
  }

  onError(message) {
    let action;
    this.matSnackBar.open(message, action, {
      duration: 1000
    });
  }
  /****************** Potential wipro solutions autocomplete code end ****************** */
}