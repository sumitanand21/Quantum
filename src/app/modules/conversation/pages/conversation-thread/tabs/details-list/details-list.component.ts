import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ContactleadService } from '@app/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { DataCommunicationService } from '@app/core/services/global.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { newConversationService } from '@app/core/services/new-conversation.service';
import { OfflineService, OnlineOfflineService, ErrorMessage } from '@app/core';
import { ActivityService } from '@app/core/services/activity.service'
import { AppState } from '@app/core/state';
import { Store, select } from '@ngrx/store';
import { LoadActivityDetailsById, UpdateActivityGroupEditById, ClearActivity, ClearMeetingDetails, ClearMeetingList } from '@app/core/state/actions/activities.actions';
import { getActivityDetailsById } from '@app/core/state/selectors/activity/activity.selector';
import { removeSpaces } from '@app/shared/pipes/white-space.validator';

@Component({
  selector: 'app-details-list',
  templateUrl: './details-list.component.html',
  styleUrls: ['./details-list.component.scss']
})
export class DetailsListComponent implements OnInit, OnDestroy {

  id: any
  noneditpart = true;
  editpart = false;
  activityGroupDetailsForm: FormGroup;
  SysGuid: any;
  isLoading: boolean = false;
  isFormSaved: boolean = false;
  IsPrivate: boolean = false;
  IsArchived: boolean;
  ActivityDetails: any;
  acivityOwnersearch: any = [];
  activityGrpGuid: any;
  activtOwnerSwitch: boolean = true;
  activityOwnerId: string = ''
  archived: any;
  isActivityOwnerSearchLoading: boolean = false;
  activityDetailsSubscription: Subscription;
  activityOwnerName: string = ''
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    public service: DataCommunicationService,
    private contactLeadService: ContactleadService,
    private encrDecrService: EncrDecrService,
    public matSnackBar: MatSnackBar,
    private router: Router,
    private newconversationService: newConversationService,
    private offlineService: OfflineService,
    private onlineOfflineservice: OnlineOfflineService,
    private errPopup: ErrorMessage,
    private activityService: ActivityService,
    private store: Store<AppState>) {
    if (sessionStorage.getItem("ActivityListRowId")) {
      this.id = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', JSON.parse(sessionStorage.getItem("ActivityListRowId")), 'DecryptionDecrip');
    }
    this.createActivityGroupForm();
  }

  async ngOnInit() {
    this.archived = sessionStorage.getItem('archivedStatus')
    if (this.archived == "true") {
      this.service.archiveTag = true
    } else {
      this.service.archiveTag = false
    }
    this.getActivityDetailsById(this.id)
    // this.activityDetailsSubscription = this.store.pipe(select(getActivityDetailsById(this.id))).subscribe(res => {
    //   if (res) {
    //     this.ActivityDetails = res
    //   } else {
    //     this.getActivityDetailsById(this.id)
    //   }
    // });
    // if (!this.onlineOfflineservice.isOnline) {
    //   const cacheDetailsData = await this.activityService.getCacheActivityDetailsById(this.id);
    //   if (cacheDetailsData != null) {
    //     this.ActivityDetails = cacheDetailsData.data
    //   } else {
    //     this.getActivityDetailsById(this.id)
    //   }
    // }
  }

  getActivityDetailsById(id) {
    let Activitdetailspost = {
      Guid: (id) ? id : ""
    }
    this.isLoading = true;
    this.activityService.GetActivityDetailsById(Activitdetailspost).subscribe(res => {
      this.isLoading = false;
      if (res.IsError == false) {
      this.ActivityDetails = {...res.ResponseObject, Account : {
        Name : decodeURIComponent(res.ResponseObject.Account.Name),
        SysGuid : res.ResponseObject.Account.SysGuid,
        isProspect : res.ResponseObject.Account.isProspect
      }
    }
        const ImmutabelObj = { ...res.ResponseObject, id: res.ResponseObject.Guid, parentid: this.id }
        this.store.dispatch(new LoadActivityDetailsById({ activityDetails: ImmutabelObj }))
      } else {
        this.errPopup.throwError(res.Message)
      }
    }, error => { this.isLoading = false; })
  }

  createActivityGroupForm() {
    this.activityGroupDetailsForm = this.fb.group({
      activityGroup: ['', Validators.compose([Validators.required, removeSpaces])],
      activityOwner: ['', Validators.required],
      accountName: new FormControl({ value: 'Account Name', disabled: true }),
      dateCreated: new FormControl({ value: 'dateCreated', disabled: true }),
      noOfMeetings: new FormControl({ value: 'noOfMeetings', disabled: true }),
      noOfActions: new FormControl({ value: 'noOfActions', disabled: true }),
      noOfOthers: new FormControl({ value: 'noOfOthers', disabled: true }),
      potentialWiprosolution: new FormControl({ value: '', disabled: true }),
      linkCampaign: new FormControl({ value: '', disabled: true }),
      linkLeads: new FormControl({ value: '', disabled: true }),
      linkOpportunity: new FormControl({ value: '', disabled: true })
    });
    this.onChanges()
  }

  get f() {
    return this.activityGroupDetailsForm.controls
  }

  onChanges() {
    this.activityGroupDetailsForm.get('activityOwner').valueChanges.subscribe(val => {
      if (this.activityGroupDetailsForm.get('activityOwner').dirty) {
        this.isActivityOwnerSearchLoading = true;
        this.acivityOwnersearch = []
        this.contactLeadService.getsearchLeadOwner(val).subscribe(res => {
          this.isActivityOwnerSearchLoading = false;
          if (!res.IsError) {
            this.acivityOwnersearch = res.ResponseObject;
          } else {
            this.errPopup.throwError(res.Message)
            this.acivityOwnersearch = []
          }
        }, error => {
          this.isActivityOwnerSearchLoading = false;
          this.acivityOwnersearch = []
        })
      }
    })
  }
  activityGroupName : string = '';
  inputChange(event) {
     this.activityGroupName = event.target.value;
  }

  patchActivityGroupDetailsForm() {
    this.activityGroupDetailsForm.patchValue({
      activityGroup: this.ActivityDetails.Name,
      activityOwner: this.ActivityDetails.Owner.FullName,
      accountName: this.service.getSymbol(this.ActivityDetails.Account.Name),
      dateCreated: this.ActivityDetails.CreatedOn,
      noOfMeetings: this.ActivityDetails.MeetingCount,
      noOfOthers: this.ActivityDetails.OthersCount,
      noOfActions: this.ActivityDetails.Actioncount
    })
    this.activityGrpGuid = this.ActivityDetails.Guid;
    this.activityOwnerId = this.ActivityDetails.Owner.SysGuid
    this.activityOwnerName = this.ActivityDetails.Owner.FullName;
    this.activityGroupName = this.ActivityDetails.Name;
  }

  onClickEdit() {
      this.editpart = true;
      this.noneditpart = false;
      this.patchActivityGroupDetailsForm()
  }

  onClickCancel() {
    const dialogRef = this.dialog.open(detailsCancelpop, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == 'OK') {
        this.editpart = false;
        this.noneditpart = true;
      }
    })
  }

  onClickSave() {
    if (this.activityGroupName.trim() === '') {
      this.activityGroupDetailsForm.patchValue({activityGroup :''});
      this.activityGroupDetailsForm.controls['activityGroup'].setValidators(Validators.required);
      this.activityGroupDetailsForm.controls['activityGroup'].markAsTouched();
      this.activityGroupDetailsForm.controls['activityGroup'].updateValueAndValidity();
    }
    if (this.activityGroupDetailsForm.valid) {
      var body = {
        "Name": this.activityGroupName.trim(),
        "Guid": this.activityGrpGuid,
        "ActivityType": {
          "Id": 0
        },
        "Account": this.ActivityDetails.Account,
        "Owner": {
          "SysGuid": this.activityOwnerId
        }
      }
      this.isLoading = true;
      this.newconversationService.updateActivityGroupEdit(body).subscribe(
        async res => {
          if (res.IsError === false) {
            this.isLoading = false;
            this.errPopup.throwError(res.Message)
            await this.offlineService.ClearTablesdata(this.onlineOfflineservice.isOnline)
            sessionStorage.setItem('ActivityGroupName', res.ResponseObject.Name)
            this.newconversationService.setActivityGroupName(res.ResponseObject.Name)
            localStorage.removeItem('forMeetingCreation')
            let json = {
              Guid: res.ResponseObject.Guid,
              Name: res.ResponseObject.Name,
              Account: res.ResponseObject.Account
            }
            localStorage.setItem('forMeetingCreation', JSON.stringify(json))
            const changes = res.ResponseObject
            let updateleadDetails = {
              id: res.ResponseObject.Guid,
              changes
            }
            this.store.dispatch(new UpdateActivityGroupEditById({ UpdateActivity: updateleadDetails }))
            this.isFormSaved = true;
            this.noneditpart = true;
            this.editpart = false;
            
            this.store.dispatch(new ClearMeetingDetails())
            this.store.dispatch(new ClearActivity())
            this.store.dispatch(new ClearMeetingList({ cleardetails: res.ResponseObject.Guid }))
            this.getActivityDetailsById(this.activityGrpGuid)
          } else {
            this.isLoading = false;
            this.errPopup.throwError(res.Message)
          }
        }, error => {
          this.isLoading = false;
        })
    }
    else {
      this.service.validateAllFormFields(this.activityGroupDetailsForm);
    }
  }

  ActivityOwnerclose() {
    this.activtOwnerSwitch = false;
    if (this.activityOwnerId === '') {
      this.activityGroupDetailsForm.patchValue({
        activityOwner: ""
      })
    } else {
      this.activityGroupDetailsForm.patchValue({
        activityOwner: this.activityOwnerName
      })
    }
  }

  appendActivityOwner(value: string, item) {
    this.activityGroupDetailsForm.patchValue({
      activityOwner: value
    })
    this.activityOwnerId = item.ownerId;
    this.activityOwnerName = item.FullName;
    this.activtOwnerSwitch = true;
  }

  openGenricPopup(action) {
    let wholeObj
    let header
    switch (action) {
      case 'solutions': {
        wholeObj = this.ActivityDetails.WiproPotentials;
        header = 'Potential wipro solution';
        break;
      }
      case 'campaigns': {
        wholeObj = this.ActivityDetails.Campaigns;
        header = 'Linked campaigns';
        break;
      }
      case 'leads': {
        wholeObj = this.ActivityDetails.Leads;
        header = 'Linked leads';
        break;
      }
      case 'opp': {
        wholeObj = this.ActivityDetails.OpportunityOrOrders;
        header = 'linked opportunities/order';
        break;
      }
    }
    const dialogRef = this.dialog.open(genericpopupcomponent, {
      width: '405px',
      data:
      {
        'allData': this.ActivityDetails,
        'wholeobj': wholeObj,
        'Header': header
      }
    });
  }

  navBackTo() {
    if (sessionStorage.getItem('TempEditLeadDetails')) {
      this.router.navigate(['/leads/leadDetails'])
    } else if (sessionStorage.getItem('TempLeadDetails')) {
      this.router.navigate(['/leads/createlead'])
    }
    else {
      this.router.navigate(['/activities/activitiesthread/meetingList'])
    }
  }

  ngOnDestroy() {
    //this.activityDetailsSubscription.unsubscribe()
  }
}

@Component({
  selector: 'cancel-pop',
  templateUrl: './cancel-pop.html',
  styleUrls: ['./details-list.component.scss']

})
export class detailsCancelpop {

  constructor(public dialogRef: MatDialogRef<detailsCancelpop>, ) {

  }

  closeallpop(value) {
    this.dialogRef.close(value);
  }

}


@Component({
  selector: 'generic-popup',
  templateUrl: './generic-popup.html',
  styleUrls: ['./details-list.component.scss'],
})
export class genericpopupcomponent implements OnInit {
  Name: string;
  Data: any;
  Header: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }
  ngOnInit() {
    this.Name = this.data.allData.Name
    this.Data = this.data.wholeobj
    this.Header = this.data.Header;
  }
}

