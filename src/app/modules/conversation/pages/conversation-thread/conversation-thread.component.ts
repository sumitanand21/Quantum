import { ClearMeetingDetails } from './../../../../core/state/actions/activities.actions';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MeetingService } from '@app/core/services/meeting.service';
import { DataCommunicationService } from '@app/core/services/global.service';
import { ArchivedConversationService, ConversationService, threadListService, OfflineService, OnlineOfflineService, routes, ErrorMessage, actionListService } from '@app/core/services';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { Location, DatePipe } from '@angular/common';
import { RoutingState } from '@app/core/services/navigation.service';
import { newConversationService } from '@app/core/services/new-conversation.service';
import { AppState } from '@app/core/state';
import { Store } from '@ngrx/store';
import { ClearActivity, ClearActivityDetails } from '@app/core/state/actions/activities.actions';
import { removeSpaces, specialCharacter, checkLimit } from '@app/shared/pipes/white-space.validator';
import { ClearContactList, ClearRelationshipCount } from '@app/core/state/actions/contact.action';
import { Navigationroutes, AccountNavigationroutes } from '@app/core/services/activity.service';
@Component({
  selector: 'app-conversation-thread',
  templateUrl: './conversation-thread.component.html',
  styleUrls: ['./conversation-thread.component.scss']
})
export class ConversationThreadComponent implements OnInit {
  contactstab = true;
  suitetab = false;
  plantab = false;
  selectedAll: any;
  table_data;
  showmore: boolean = false;
  checkboxcounter: number = 0; selectedCount: any = [];
  name: string = "";
  private sub: any;
  headerArray1;
  headerArray2;
  headerArray;
  show;
  toggle;
  corr;
  expand = false;
  id: any;
  activate = false
  threadLink: any;
  detailLink: any;
  actionLink: any;
  archived: string;
  showContent: boolean = false;
  constructor(public dialog: MatDialog,
    private encrDecrService: EncrDecrService,
    private route: ActivatedRoute,
    public userdat: DataCommunicationService,
    public actionListService: actionListService,
    private conversationService: ConversationService,
    private router: Router,
    private routingState: RoutingState,
    private threadListService: threadListService,
    private newconversationService: newConversationService,
    public errorMessage: ErrorMessage,
    private meetingService: MeetingService,
    private store: Store<AppState>) {
    console.log("activated route", this.route.routeConfig);
    this.newconversationService.getActivityGroupName().subscribe(res => {
      this.name = res.name
    })
  }
  ngOnInit() {
    sessionStorage.setItem("routingstate", JSON.stringify(this.routingState.getPreviousUrl()));
    this.activate = true
    if (this.userdat.convActionTag) {
      this.plantab = this.userdat.convActionTag
      this.contactstab = false;
      this.suitetab = false;
    }
    this.id = sessionStorage.getItem("ActivityListRowId")
    this.id = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', JSON.parse(this.id), 'DecryptionDecrip');
    console.log("dec id", this.id);
    this.conversationService.conversationId = this.id;
    if (this.name === "") {
      this.newconversationService.setActivityGroupName(sessionStorage.getItem("ActivityGroupName"))
    }
    this.conversationService.conversationId = this.id;
    this.conversationService.conversationName = this.name;
    if (this.routingState.getPreviousUrl().includes('/campaign/RequestCampaign')) {
      this.contactstab = this.threadListService.threadValue;
      this.suitetab = this.threadListService.detailValue;
      this.plantab = this.threadListService.actionValue;
    }
    if (this.routingState.getPreviousUrl().includes('/activities/newmeeting')) {
      this.contactstab = this.threadListService.threadValue;
      this.suitetab = this.threadListService.detailValue;
      this.plantab = this.threadListService.actionValue;
    }
    if (this.routingState.getPreviousUrl().includes('/leads/createlead')) {
      this.contactstab = this.threadListService.threadValue;
      this.suitetab = this.threadListService.detailValue;
      this.plantab = this.threadListService.actionValue;
    }
    if (this.routingState.getPreviousUrl().includes('/activities/sharemeeting')) {
      this.contactstab = this.threadListService.threadValue;
      this.suitetab = this.threadListService.detailValue;
      this.plantab = this.threadListService.actionValue;
    }
    this.store.dispatch(new ClearActivityDetails())
  }

  additem(item) {
    this.showContent = false;
  }

  closeContent() {
    this.showContent = false;
  }

  toggleContent() {
    this.showContent = !this.showContent;
  }

  addNewMeeting() {
    this.newconversationService.conversationAppointId = undefined;
    this.meetingService.createdMeetingGuid = "";
    this.meetingService.meetingDetails = undefined;
    this.newconversationService.attachmentList = []
    this.newconversationService.conversationFiledInformation = undefined;
    this.userdat.TempEditLeadDetails();
    this.router.navigate(['/activities/newmeeting'])
  }

  navTo() {
    sessionStorage.removeItem('archivedStatus');
    this.actionListService.meetingDetailsInfo = undefined;
    this.archived = sessionStorage.getItem('archivedStatus')
    let routeId = JSON.parse(sessionStorage.getItem('navigation'));
    if (sessionStorage.getItem('selAccountObj')) {
      this.router.navigate([AccountNavigationroutes[routeId]]);
    } else {
      this.router.navigate([Navigationroutes[routeId]]);
    }
    
  }

  clickToCampaign() {
    if (JSON.parse(sessionStorage.getItem('RequestCampaign'))) {
      let data = JSON.parse(sessionStorage.getItem('RequestCampaign'))
      sessionStorage.setItem('RequestCampaign', JSON.stringify({ ...data, navigation: this.router.url }));
      sessionStorage.removeItem('campaignCacheData');
      this.router.navigateByUrl('/campaign/RequestCampaign');
    }
  }

  tabone() {
    this.contactstab = true;
    this.suitetab = false;
    this.plantab = false;
  }

  tabtwo() {
    this.contactstab = false;
    this.suitetab = true;
    this.plantab = false;
  }

  tabthree() {
    this.contactstab = false;
    this.suitetab = false;
    this.plantab = true;
  }

  onMoreDetails() {
    this.router.navigate(['activities/detailsList']);
  }

  openarchive() {
    const dialogRef = this.dialog.open(archiveconvercomponent,
      {
        width: '396px',
        height: 'auto',
        disableClose: true,
        data: { name: this.id }
      });
  }
  openrestore() {
    const dialogRef = this.dialog.open(restoreconversationcomponent,
      {
        width: '396px',
        height: 'auto',
        data: { name: this.id }
      });
    dialogRef.componentInstance.parentId = this.id
  }
  openopportunity() {
    const dialogRef = this.dialog.open(opportunityconvercomponent,
      {
        width: '396px',
        height: 'auto',
      });
  }
}
@Component({
  selector: 'archive-conversaion',
  templateUrl: './archive.html',
  styleUrls: ['./conversation-thread.component.scss']
})
export class archiveconvercomponent implements OnInit, OnDestroy {
  archiveForm: FormGroup;
  arcObject: any;
  name;
  today: Date;
  conversationTable = [];
  subscription: Subscription;
  sixMonthDate: any;
  StartDate: any;
  isLoading : boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data, private fb: FormBuilder,
    public archive: ArchivedConversationService,
    private route: ActivatedRoute,
    public conversationService: ConversationService,
    private router: Router,
    public dialogRef: MatDialogRef<archiveconvercomponent>,
    private routingState: RoutingState,
    public userdat: DataCommunicationService,
    public offlineService: OfflineService,
    private datepipe: DatePipe,
    public onlineOfflineService: OnlineOfflineService,
    public location: Location,
    public store: Store<AppState>,
    public errorMessage: ErrorMessage) { }
  ngOnInit() {
    history.pushState(null, null, window.location.href);
    this.subscription = <Subscription>this.location.subscribe((x) => {
      console.log(x)
      history.pushState(null, null, window.location.href);
    })
    this.archiveFormGroup();
    this.today = new Date()
    var month = (this.today.getMonth() + 3);
    var date = this.today.getDate();
    var year = this.today.getFullYear();
    this.sixMonthDate = new Date(year, month, date)
    this.name = sessionStorage.getItem('ActivityGroupName');
  }

  ngOnDestroy() {
    this.dialogRef.close()
    this.subscription.unsubscribe();
  }

  archiveFormGroup() {
    this.archiveForm = this.fb.group({
      date: ['', Validators.required],
      discard: [''],
      remarks: ['', Validators.compose([Validators.required, removeSpaces, checkLimit(2001)])],
    })
  }

  get f() {
    return this.archiveForm.controls;
  }

  get formError() {
    return this.archiveForm.controls;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  archivedConversation() {
    this.arcObject = [{
      "Guid": this.data.name,
      "ArchiveRemarks": this.archiveForm.value.remarks
    }]
    console.log("archived object---->", this.arcObject);
    if (this.archiveForm.valid) {
      this.isLoading = true;
      this.archive.archievedConversation(this.arcObject).subscribe(async (res) => {
        this.isLoading = false;
        if (res.IsError == false) {
          await this.offlineService.ClearArchivedConvIndexTableData();
          this.dialogRef.close();
          this.errorMessage.onSuccessMessage(res.Message).afterDismissed().subscribe(()=>{
            this.store.dispatch(new ClearActivity());
            this.store.dispatch(new ClearContactList())
            this.store.dispatch(new ClearRelationshipCount());
            this.store.dispatch(new ClearMeetingDetails())
            if (sessionStorage.getItem('selAccountObj')) {
              this.router.navigate(['/accounts/accountactivities/Archivedlist']);
            } else {
              this.router.navigate(['/activities/Archivedlist']);
            }
          })
        } else {
          this.errorMessage.throwError(res.Message)
        }
      }, () => {this.isLoading = false;});
    } else {
      this.userdat.validateAllFormFields(this.archiveForm);
    }
  }
}
@Component({
  selector: 'restore-conversation',
  templateUrl: './restore.html',
})
export class restoreconversationcomponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data,
    public restored: ArchivedConversationService,
    public converService: ConversationService,
    public dialogRef: MatDialogRef<archiveconvercomponent>,
    private router: Router,
    public offlineService: OfflineService,
    public errorMessage: ErrorMessage,
    public store: Store<AppState>) {
  }
  name;
  parentId: any;
  ngOnInit() {
    this.name = sessionStorage.getItem('ActivityGroupName')
  }
  resObject = {
    "Guid": this.data.name,
  }
  restoreSubmit() {
    this.restored.restoreConversation([this.resObject]).subscribe(async res => {
      if (res.IsError == false) {
        this.store.dispatch(new ClearActivity())
        await this.offlineService.ClearActivityIndexTableData();
        await this.offlineService.ClearArchivedConvIndexTableData();
        this.errorMessage.throwError(res.Message)
        this.dialogRef.close();
        this.router.navigate(['/activities/list'])
      } else {
        this.errorMessage.throwError(res.Message)
      }
    })
  }
}
@Component({
  selector: 'opportunity',
  templateUrl: './opportunity.html',
})
export class opportunityconvercomponent {

  createOpp() {

  }
}
