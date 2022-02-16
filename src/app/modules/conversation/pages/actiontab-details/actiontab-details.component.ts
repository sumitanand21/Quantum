import { Component, OnInit, ElementRef } from '@angular/core';
import { DataCommunicationService, OnlineOfflineService, ErrorMessage, ActionHeaders, ActionAdvnNames } from '@app/core/services';
import { ConversationService, actionListService, OfflineService, routes } from '@app/core';
import { RoutingState } from '@app/core/services/navigation.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MasterApiService } from '@app/core/services/master-api.service';
import { newConversationService } from '@app/core/services/new-conversation.service';
import { DateAdapter, MAT_DATE_FORMATS, MatSnackBar, MatDialog, MatDialogRef } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from '@app/modules/date.format';
import { SharedModule } from '@app/shared';
import { DatePipe } from '@angular/common';
import { DASH } from '@angular/cdk/keycodes';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { ActionEdited, ActionSaved } from '@app/core/state/actions/actions.actions';
import { Update } from '@ngrx/entity';
import { ActionState } from '@app/core/state/state.models/action.interface';
import { removeSpaces, checkLimit, specialCharacter } from '@app/shared/pipes/white-space.validator';
import { EditAction, ClearActionList, ClearActivity, ClearActivityDetails } from '@app/core/state/actions/activities.actions';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { Router } from '@angular/router';
import { CacheDataService } from '@app/core/services/look-up-cache-data/cache-data.serive';


export interface WiproContact {
  FullName: string,
  Designation: string,
  MapGuid: string,
  SysGuid: string
}
@Component({
  selector: 'app-actiontab-details',
  templateUrl: './actiontab-details.component.html',
  styleUrls: ['./actiontab-details.component.scss'],
})
export class ActiontabDetailsComponent implements OnInit {
  noneditpart: boolean = true;
  editpart: boolean = false;
  items: any;
  lists: any;
  check: any;
  checking: any;
  listing: any;
  ActionTabForm: FormGroup;
  term;
  term1;
  term2;
  term3;
  term4;
  consent = false;
  agendaview = true;
  emailview = false;
  suggestion = false;
  suggestion1 = false;
  suggestion2 = false;
  suggestion3 = false;
  suggestion4 = false;
  id: any;
  conversationName: any;
  conversationId: any;
  activityDetails: any;
  activityOwner: Array<any>;
  activitySubject: any;
  activityDate: any;
  activityStatus: any;
  activityDescription: any;
  getPriorityType: any;
  statusCode: any;
  stateCode: any;
  wiproContactSearch: any;
  sysGuid: any;
  Owners: any;
  activityPriority: any;
  activityState: any;
  activityparenSystemId: any = [];
  selectedContact: WiproContact[] = [];
  object: {};
  activityId: any;
  activity: any;
  activityDateFormat: Date;
  activityPriorityCode: any;
  activityStateCode: any;
  activityStatusCode: any;
  activityDateChange: any;
  object1: { "Id": any; };
  object2: any;
  today = new Date();
  clicked: boolean = false;
  meetingActivityName: string = '';
  meetingSubjectSearch: any;
  selectedMeetingSubjectId: string = '';
  isMeetingChanged: boolean = false;
  newMeetingId: string = ''
  archived = '';
  status: boolean;
  isLoading: boolean = false;
  isMeetingSubjectSearchLoading: boolean = false;
  isActionOwnersSearchLoading: boolean = false;
  meetingActivityNameCheck: any;
  arrowkeyLocation=0;
  StartDate : any;
  sixMonthDate : any;
  yearDateValidation : any;
  editActionDetail : boolean = true;
     //------------------------------------advance lookup ts file starts--------------------------------//
 
     lookupdata = {
      tabledata: [],
      recordCount: 10,
      headerdata: [],
      Isadvancesearchtabs: false,
      controlName: 'account',
      lookupName:'',
      isCheckboxRequired : false,
      inputValue: '',
      TotalRecordCount :0,
      selectedRecord:[],
      isLoader : false,
      nextLink : '',
      errorMsg : {
        isError:false,
        message:""
      },
      otherDbData:{      
        countryvalue:[],
        isLoader:false,
      }
    };
  
    IdentifyAppendFunc ={
      'actionOwneSearch':(data)=>{this.appendcontact(data,0)}
    }
  
    selectedLookupData(controlName) {
      switch(controlName) {
        case 'actionOwneSearch' : return (this.sendToAdvanceLookUp.length > 0) ? this.sendToAdvanceLookUp : []
      }
    }

    emptyArray(controlName) {
      switch(controlName) {
        case 'actionOwneSearch' : {this.sendToAdvanceLookUp=[];this.selectedContact = [];this.activityparenSystemId = []}
      }
    }

    get f() {
      return this.ActionTabForm.controls
    }
  
    //---------------------------------advance lookup ts file ends-------------------------------//

  constructor(
    public el: ElementRef,
    public service: DataCommunicationService,
    private router:Router,
    private encrDecrService: EncrDecrService,
    private formBuilder: FormBuilder,
    public masterApi: MasterApiService,
    public newConversationService: newConversationService,
    public actionListService: actionListService,
    public matSnackBar: MatSnackBar,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    public offlineService: OfflineService,
    private PopUp: ErrorMessage,
    private cacheDataService: CacheDataService,
    public store: Store<AppState>) {}

  async ngOnInit() {
    this.yearDateValidation = new Date(1980 , 1, 1)
    if (JSON.parse(sessionStorage.getItem('ActivityId'))) {
      this.activityId = JSON.parse(sessionStorage.getItem('ActivityId'));
    } else {
      this.conversationName = localStorage.getItem('ActivityGroupName');
      let parent = JSON.parse(sessionStorage.getItem('ActivityListRowId'));
      console.log('parent', parent)
      this.id = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', parent, 'DecryptionDecrip');
      this.clicked = false;
    }
    this.newActionForm();
    this.getMasterApiData();
    this.getActionConvDetails();
    // Patching the conversation Name value in the formcontrol
    this.ActionTabForm.patchValue({
      conversationName: this.conversationName
    });
    this.StartDate = new Date()
    var month = (this.StartDate.getMonth() + 3);
    var date = this.StartDate.getDate();
    var year = this.StartDate.getFullYear();
    this.sixMonthDate = new Date(year, month, date)
  }

  otherActivityGroupName : string = '';
  inputChange(event) {
    this.otherActivityGroupName = event.target.value;
  }

  getMasterApiData() {
    //Calling Master Service for priority code  
    this.masterApi.getPriority().subscribe(res => {
      this.offlineService.addMasterApiCache(routes.priority, res)
      this.getPriorityType = res.ResponseObject;
    });
    //Calling Master Service for status code
    this.object1 = this.activityStateCode
    this.masterApi.getNewStatusCode().subscribe(res => {
      this.offlineService.addMasterApiCache(routes.status, res)
      this.statusCode = res.ResponseObject;
      this.activityStateCode = this.statusCode
    });
  }

  getActionConvDetails() {
    debugger
    let object = this.activityId.id
    this.isLoading = true;
    this.actionListService.getActionDetails(object).subscribe(async res => {
      if (!res.IsError) {
        this.isLoading = false
        console.log('Action Details Response-->', res)
        this.SyncActionDetailsData(res)
      } else {
        this.isLoading = false
        this.PopUp.throwError(res.Message)
      }
    })
  }

  scrollTo(element: Element) {
    if(element) {
    window.scroll({
    behavior: 'smooth',
    left: 0,
    top: element.getBoundingClientRect().top + window.scrollY - 150
    });
    }
    }
    closedRemarks : any;
    isArchived : boolean = false;
  SyncActionDetailsData(data) {
    if (data) {
      debugger
      this.activity = data.ResponseObject[0];
      if(JSON.parse(sessionStorage.getItem('ActivityId'))) {
        this.id = this.activity.ActivityGroup.Guid;
      }
      console.log('data--->', data)
      this.activityOwner = this.activity.Owners;
      this.activitySubject = this.activity.Subject;
      this.otherActivityGroupName = this.activity.Subject;
      this.activityDate = this.activity.DueDate;
      this.activityStatus = this.activity.Status;
      this.activityDescription = (this.activity.Description) ? this.activity.Description : undefined;
      this.activityState = this.activity.State;
      this.activityPriority = this.activity.Priority;
      this.activityStatusCode = this.activity.StatusCode;
      this.closedRemarks = this.activity.ClosedRemarks;
      this.archived = (sessionStorage.getItem('archivedStatus')) ? sessionStorage.getItem('archivedStatus') : '';
      if (this.archived == "true" || this.activityStatus == 'Closed') {
        this.editActionDetail = false;
      } 
      if (this.activity.IsArchived == true) {
        this.editActionDetail = false;
      }
      this.isArchived = this.activity.IsArchived; 
      let parenSystemId = this.activityOwner.map((element) => {
        return {
          MapGuid: element.MapGuid,
          parenSystemId: element.SysGuid
        };
      });
      if (this.activity.meetingActivity.Name !== undefined) {
        debugger
        this.meetingActivityNameCheck = this.activity.meetingActivity.Name
        this.meetingActivityName = this.activity.meetingActivity.Name
        this.newMeetingId = this.activity.meetingActivity.Guid
        this.selectedMeetingSubjectId = this.activity.meetingActivity.Guid
      }
      this.activityparenSystemId = parenSystemId;
      // var description = this.activityDescription
      let datemo = this.service.dateModifier(this.activityDate);
      this.activityDateFormat = new Date(datemo);
      this.activityDateFormat.setMinutes(this.activityDateFormat.getMinutes() + this.activityDateFormat.getTimezoneOffset());
      this.activityDateChange = this.datePipe.transform(this.activityDateFormat, 'dd-MMM-yyyy');
      this.activityPriorityCode = this.activity.PriorityCode;
      this.activityStateCode = this.activity.StateCode;
      this.otherActivityGroupName = this.activitySubject;
      this.ActionTabForm.patchValue({
        actionName : this.activitySubject,
        dateCreated : this.activityDateFormat,
        description : this.activityDescription,
        priority : this.activityPriorityCode,
        state : this.activityStateCode,
        status : this.activityStatusCode,
        meetingSubject : this.meetingActivityName
      })
      if (this.activity.Owners.length > 0) {
        this.activity.Owners.forEach(item => {
          var json = { FullName: item.FullName, Designation: item.Designation, SysGuid: item.SysGuid, MapGuid: item.MapGuid }
          let json1  = {FullName : item.FullName, SysGuid : item.SysGuid, Id : item.SysGuid , MapGuid: item.MapGuid , Designation: item.Designation }
          this.selectedContact.push(json);
          this.sendToAdvanceLookUp.push(json1)
        });
        this.ActionTabForm.get('wiproContacts').clearValidators();
        this.ActionTabForm.get('wiproContacts').updateValueAndValidity();
      }
    }
  }

  /****************** Conversation Name autocomplete code start ****************** */

  showConversation: boolean = false;
  Conversation: string = "";
  ConversationNameSwitch: boolean = false;

  conversationNameClose() {
    this.ConversationNameSwitch = false;
    if (this.newMeetingId == undefined) {
      this.ActionTabForm.patchValue({
        meetingSubject: ""
      })
    } else {
      this.ActionTabForm.patchValue({
        meetingSubject: this.meetingActivityNameCheck
      })
    }
  }

  appendConversation(item) {
    this.meetingActivityNameCheck = item.Subject
    this.meetingActivityName = item.Subject
    this.newMeetingId = item.Guid
    this.isMeetingChanged = true
    this.ActionTabForm.patchValue({
      meetingSubject: this.meetingActivityName
    })
    this.ConversationNameSwitch = false;
  }

  clearMeetingSubject() {
    this.ActionTabForm.patchValue({
      meetingSubject:''
    });
    this.meetingActivityNameCheck = '';
    this.meetingActivityName = '';
    this.newMeetingId = '';
  }

  selectedConversation: {}[] = [];

  /****************** Conversation Name autocomplete code end ****************** */
  OnError(message) {
    let action;
    this.matSnackBar.open(message, action, {
      duration: 5000
    });
  }

  value: any;
  newActionForm() {
    this.ActionTabForm = this.formBuilder.group({
      'conversationName': ['', { disabled: true }],
      'actionName': ['', Validators.compose([Validators.required, removeSpaces, checkLimit(100)])],
      'wiproContacts': [''],
      'priority': ['', Validators.required],
      'dateCreated': ['', Validators.required],
      'state': ['', Validators.required],
      'status': ['', Validators.required],
      'description': [''],
      'meetingSubject': ['']
    });
    this.ActionTabForm.controls['meetingSubject'].valueChanges.subscribe(res => {
      if (this.ActionTabForm.get('meetingSubject').dirty && this.ConversationNameSwitch) {
        this.isMeetingSubjectSearchLoading = true;
        this.actionListService.getMeetingType(this.id, res).subscribe(value => {
          this.isMeetingSubjectSearchLoading = false;
          if (!value.IsError) {
            this.meetingSubjectSearch = value.ResponseObject
          } else {
            this.OnError(value.Message);
            this.meetingSubjectSearch = []
          }

        }, error => {
          this.isMeetingSubjectSearchLoading = false;
          this.meetingSubjectSearch = []
        })
      } 
      // if (res == "" ) {
      //   if(this.cacheDataService.cacheDataGet('meetingSubject').length> 0) {
      //     this.isMeetingSubjectSearchLoading = false;
      //     this.meetingSubjectSearch = this.cacheDataService.cacheDataGet('meetingSubject')
      //   }
      // }
    })
        // Patching the value on changes
        this.ActionTabForm.get('wiproContacts').valueChanges.subscribe(val => {
          if (this.ActionTabForm.get('wiproContacts').dirty && this.contactNameSwitch) {
          this.wiproContactSearch = [];
          this.isActionOwnersSearchLoading = true;
          if (this.ActionTabForm.get('wiproContacts').dirty) {
            this.newConversationService.getOwnerSystemUserId(val).subscribe(data => {
              this.isActionOwnersSearchLoading = false;
              if (!data.IsError) {
                this.wiproContactSearch = data.ResponseObject;
                this.lookupdata.TotalRecordCount = data.TotalRecordCount;
                this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
                console.log('>>>>>>', this.wiproContactSearch);
              } else {
                this.OnError(data.Message);
                this.wiproContactSearch = []
              }
            }, error => {
              this.isActionOwnersSearchLoading = false;
              this.wiproContactSearch = []
            })
          } 
        }

        })
  }

  clickMeetingSubject() {
    this.ActionTabForm.patchValue({
      meetingSubject: ''
    })
    this.isMeetingSubjectSearchLoading = true;
    this.meetingSubjectSearch = [];
    // if(this.cacheDataService.cacheDataGet('meetingSubject').length> 0) {
    //   this.meetingSubjectSearch = this.cacheDataService.cacheDataGet('meetingSubject')
    //   this.isMeetingSubjectSearchLoading = false;
    // } else {   
      this.actionListService.getMeetingType(this.id, '').subscribe(value => {
        this.isMeetingSubjectSearchLoading = false;
        if (!value.IsError) {
          this.meetingSubjectSearch = value.ResponseObject
          // this.cacheDataService.cacheDataSet("meetingSubject",value.ResponseObject)
        } else {
          this.OnError(value.Message);
          this.meetingSubjectSearch = [];
          this.cacheDataService.cacheDataReset("meetingSubject")
        }
      }, error => {
        this.isMeetingSubjectSearchLoading = false;
        this.meetingSubjectSearch = [];
        this.cacheDataService.cacheDataReset("meetingSubject")
      })
    // }
  }

  clickActionOwner() {
    this.ActionTabForm.patchValue({
      wiproContacts: ''
    }) 
    this.isActionOwnersSearchLoading = true;
    this.wiproContactSearch = [];
    // if(this.cacheDataService.cacheDataGet('actionOwner').length> 0) {
    //   this.wiproContactSearch = this.cacheDataService.cacheDataGet('actionOwner')
    //   this.isActionOwnersSearchLoading = false;
    // } else {   
      this.newConversationService.getOwnerSystemUserId('').subscribe(data => {
        this.isActionOwnersSearchLoading = false;
        if (!data.IsError) {
          this.wiproContactSearch = data.ResponseObject;
          this.lookupdata.TotalRecordCount = data.TotalRecordCount;
          this.lookupdata.nextLink = (data.OdatanextLink) ? data.OdatanextLink : '';
          // this.cacheDataService.cacheDataSet("actionOwner",data.ResponseObject)
          console.log('>>>>>>', this.wiproContactSearch);
        } else {
          this.OnError(data.Message);
          this.wiproContactSearch = [];
          this.cacheDataService.cacheDataReset("actionOwner")
        }
      }, error => {
        this.isActionOwnersSearchLoading = false;
        this.wiproContactSearch = [];
        this.cacheDataService.cacheDataReset("actionOwner")
      })
    // }
  }

  navTo() {
    if(this.activityId.navigation) {
      sessionStorage.removeItem('ActivityId')
      this.router.navigate([this.activityId.navigation])
    } else {
      sessionStorage.removeItem('ActivityId')
      this.router.navigate(['/activities/activitiesthread/actionList'])
    }
    // this.routingState.backClicked();
  }
  opencancelpop(): void {
    const dialogRef = this.dialog.open(cancelactionComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(res=>{
      if(res.data == 'OK') {
        this.cacheDataService.cacheDataMultiReset(['actionOwner','meetingSubject']);
        this.noneditdetails()
      } 
    })
  }
  editdetails() {
    this.editpart = true;
    this.noneditpart = false;
  }
  noneditdetails() {
    this.noneditpart = true;
    this.editpart = false;
    this.selectedContact = [];
    this.sendToAdvanceLookUp = [];
    this.activityparenSystemId = []
    this.getActionConvDetails()
    // this.routingState.backClicked();
  }
  noneditdetailssave() {
    this.noneditpart = true;
    this.editpart = false;
  }
  custominputclose() {
    this.suggestion = false;
  }
  custominputclose1() {
    this.suggestion1 = false;
  }
  custominputclose2() {
    this.suggestion2 = false;
  }
  custominputclose3() {
    this.suggestion3 = false;
  }
  custominputclose4() {
    this.suggestion4 = false;
  }
  append(text) {
    this.term = text;
    this.suggestion = false;
  }
  append1(text) {
    this.term1 = text;
    this.suggestion1 = false;
  }
  append2(text) {
    this.term2 = text;
    this.suggestion2 = false;
  }
  append3(text) {
    this.term3 = text;
    this.suggestion3 = false;
  }
  append4(text) {
    this.term4 = text;
    this.suggestion4 = false;
  }
  consentStatus(e) {
    this.consent = e.checked;
  }
  save() {
    if (this.otherActivityGroupName.trim() === '') {
      this.ActionTabForm.patchValue({actionName :''});
      this.ActionTabForm.controls['actionName'].setValidators(Validators.required);
      this.ActionTabForm.controls['actionName'].markAsTouched();
      this.ActionTabForm.controls['actionName'].updateValueAndValidity();
    }
    console.log('Action Tab Form', this.ActionTabForm);
      if (this.ActionTabForm.valid) {
        this.clicked = true
        this.isLoading = true
        if (this.ActionTabForm.get('meetingSubject').value == '' && this.selectedMeetingSubjectId != '') {
          this.actionListService.delinkMeetingAction(this.selectedMeetingSubjectId, this.activityId.id).subscribe(res => {
            console.log("res", res)
            if (res.IsError == false) {
              this.meetingActivityName = ""
            }
          },
            error => {
              console.log("error")
            })
        }
        let meetingId = ''
        if (this.isMeetingChanged === false) {
          meetingId = this.selectedMeetingSubjectId
        }
        if (this.isMeetingChanged === true) {
          meetingId = this.newMeetingId
        }
        this.object = {
          "ActionId": this.activityId.id,
          "Conversation": {
            "Name": this.ActionTabForm.controls.conversationName.value
          },
          "Subject": this.otherActivityGroupName.trim(),
          "PriorityCode": JSON.parse(this.ActionTabForm.controls.priority.value),
          "StatusCode": JSON.parse(this.ActionTabForm.controls.status.value),
          "StateCode": JSON.parse(this.ActionTabForm.controls.state.value),
          "DueDate": this.service.dateModifier(this.ActionTabForm.controls.dateCreated.value),
          "Description": this.ActionTabForm.controls.description.value,
          "ActivityId": meetingId,
          "ActivityGroup": {
            "Guid": this.activity.ActivityGroup.Guid
          },
          "Owners": this.activityparenSystemId
        }
        this.actionListService.updateActionDetails(this.object).subscribe(async res => {
          if (res.IsError === false) {
            this.clicked = false
            this.store.dispatch(new ClearActionList({ clearaction: this.activity.ActivityGroup.Guid }));
            this.store.dispatch(new ClearActivity())
            this.store.dispatch(new ClearActivityDetails())
            await this.offlineService.ClearActConvDetailsIndexTableData()
            this.PopUp.throwError(res.Message);
            this.isLoading = false
            this.getActionConvDetails()
            this.editpart = false
            this.noneditpart = true
           
            this.selectedContact = [];
            this.activityparenSystemId = [];
            // sessionStorage.removeItem('ActivityId')
          } else {
            this.PopUp.throwError(res.Message);
            this.isLoading = false;
            this.clicked = false
            return false;
          }
        }, error=> {
          this.clicked = false
          this.isLoading = false;
        });
      }
      else {
        this.service.validateAllFormFields(this.ActionTabForm)
        let invalidElements = this.el.nativeElement.querySelectorAll('#validatescroll .ng-invalid');
        if (invalidElements.length) {
          this.scrollTo(invalidElements[0]);
          this.service.validationErrorMessage();
        }
        return
      }

  }
  /****************** wipro contact autocomplete code start ****************** */
  showContact: boolean = false;
  contactName: string = "";
  contactNameSwitch: boolean = false;
  wiproContact: {}[] = []
  contactNameclose() {
    this.contactNameSwitch = false;
    // this.ActionTabForm.controls['wiproContacts'].reset()
    this.ActionTabForm.patchValue({
      wiproContacts:''
    })
  }
  sendToAdvanceLookUp = []
  appendcontact(item,i) {
    if (localStorage.getItem('forMeetingCreation')) {
      var accountGuid = JSON.parse(localStorage.getItem('forMeetingCreation'))
    }
    this.actionListService.getActionOwnerValidation(accountGuid.Account.SysGuid,item.SysGuid).subscribe(res => { 
      if (res.IsError == false) { 
        if (res.ResponseObject.Name.includes('ReadAccess')) { 
          if(i> this.wiproContactSearch.length) {
            this.openadvancetabs('actionOwneSearch',this.wiproContactSearch,this.ActionTabForm.get('wiproContacts').value)
          } else { 
            if (!this.selectedContact.some(x => x.SysGuid == item.SysGuid)) {
              let json  = {FullName : item.FullName, SysGuid : item.SysGuid, Id : item.SysGuid , MapGuid : "" }
              this.selectedContact.push(item);
              this.sendToAdvanceLookUp.push(json);
            } else {
              this.PopUp.throwError('Selected contact already exists');
              this.ActionTabForm.patchValue({
                wiproContacts: ''
              });
            }
            if (this.selectedContact.length > 0) {
              this.ActionTabForm.get('wiproContacts').markAsTouched();
              this.ActionTabForm.get('wiproContacts').clearValidators();
              this.ActionTabForm.get('wiproContacts').updateValueAndValidity();
              let parenSystemId = this.selectedContact.map((element) => {
                return {
                  MapGuid: element.MapGuid,
                  parenSystemId: element.SysGuid
                };
              });
              this.activityparenSystemId = this.selectedContact == [] ? [] : parenSystemId;
              this.ActionTabForm.patchValue({
                wiproContacts: ''
              });
            } else {
              this.ActionTabForm.get('wiproContacts').updateValueAndValidity()
              this.ActionTabForm.patchValue({
                wiproContacts: ''
              });
            }
          }
        }else {
         this.PopUp.throwError('The selected user does not have access on the account tagged to this activity group. Kindly add users who have access to the account');
        }
      } 
    })

    this.contactNameSwitch = false;
  }
  deleteContact(item) {
    console.log('-->', item)
    if (item.MapGuid) {
      let object = {
        "MapGuid": item.MapGuid
      }
      this.actionListService.delinkActionOwner(object).subscribe(async res => {
        if (res.IsError === false) {
          console.log('success response ---->', res);
          await this.offlineService.ClearActConvDetailsIndexTableData()
          let message = res.Message
          let action
          this.matSnackBar.open(message, action, {
            duration: 2000
          })
          this.selectedContact = this.selectedContact.filter(x => x.SysGuid !== item.SysGuid)
          this.sendToAdvanceLookUp = this.sendToAdvanceLookUp.filter(x => x.SysGuid !== item.SysGuid)
          if (this.selectedContact.length === 0) {
            this.ActionTabForm.patchValue({
              wiproContacts : ""
            })
            this.ActionTabForm.get('wiproContacts').setValidators(Validators.required)
            this.ActionTabForm.get('wiproContacts').markAsTouched();
            this.ActionTabForm.get('wiproContacts').updateValueAndValidity();
          }
        } else {
          this.PopUp.throwError(res.Message)
        }
      },error=>{

      })
    } else {
      this.selectedContact = this.selectedContact.filter(x => x.SysGuid !== item.SysGuid)
      if (this.selectedContact.length === 0) {
        this.ActionTabForm.patchValue({
          wiproContacts : ""
        })
        this.ActionTabForm.get('wiproContacts').setValidators(Validators.required)
        this.ActionTabForm.get('wiproContacts').markAsTouched();
        this.ActionTabForm.get('wiproContacts').updateValueAndValidity();
      }
    }
   
   
  }
  /****************** wipro contact autocomplete code end ****************** */

   //-------------------------------------advance seach pop up start--------------------------------------------------------//

   openadvancetabs(controlName, initalLookupData, value){

    this.lookupdata.controlName = controlName
    this.lookupdata.headerdata = ActionHeaders[controlName]
    this.lookupdata.lookupName= ActionAdvnNames[controlName]['name']
    this.lookupdata.isCheckboxRequired= ActionAdvnNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = ActionAdvnNames[controlName]['isAccount']
    this.lookupdata.inputValue = value;
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.actionListService.getLookUpFilterData({ data:initalLookupData , controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
      this.lookupdata.isLoader=false;
        this.lookupdata.tabledata = res
    })

    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.service.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });

    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
      if(x['objectRowData'].searchKey != '' && x.currentPage == 1) {
        this.lookupdata.nextLink = ''
        }
      let dialogData = {
        searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
        recordCount: this.lookupdata.recordCount,
        OdatanextLink: '',// need to handel the pagination and search!
        pageNo: x.currentPage//need to handel from pagination
      }

      this.actionListService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(), ...dialogData } }).subscribe(res => {
        this.lookupdata.isLoader=false;
        if (res.IsError == false) {
          if(x.action=="loadMore")  
          {
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
            this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
            this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
           
          } else if(x.action=="search")   {
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
            this.lookupdata.tabledata = res.ResponseObject;
            this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          }
          else if(x.action =="tabSwich")
          {
            if(x.objectRowData.wiprodb)
            {
              this.lookupdata.TotalRecordCount = res.TotalRecordCount;
              this.lookupdata.tabledata = res.ResponseObject;
              this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
            }
         
          }
          this.lookupdata.errorMsg.isError = false;
          this.lookupdata.errorMsg.message = ''
        } else {
          this.lookupdata.errorMsg.isError = true;
          this.lookupdata.errorMsg.message = JSON.stringify(res.Message)
        }
      },error =>{
        this.lookupdata.isLoader = false;
        this.lookupdata.otherDbData.isLoader = false;
      })
    });

    dialogRef.afterClosed().subscribe(result => {
      debugger
      if (result) {
        console.log(result)
        this.emptyArray(result.controlName)
        this.AppendParticularInputFun(result.selectedData,result.controlName)
      }
    });
  }

  AppendParticularInputFun(selectedData,controlName){
    if(selectedData){
      if(selectedData.length>0){
        selectedData.forEach(data => {
          this.IdentifyAppendFunc[controlName](data)
        });
      }
    }
  }

  // if based on account select search lookup
  getCommonData(){
    return {
      guid: "",
      isProspect: "",

    }
  }

   //-------------------------------------End advance seach pop up--------------------------------------------------------//

}

@Component({
  selector: 'app-cancel-pop',
  templateUrl: './cancelaction-pop.html',

})
export class cancelactionComponent  {
  noneditpart: boolean = true;
  editpart: boolean = false;
  constructor( private routingState: RoutingState,private router:Router,public dialogRef: MatDialogRef<cancelactionComponent>) { }
  noneditdetails(data) {
    this.noneditpart = true;
    this.editpart = false;
    sessionStorage.removeItem('ActivityId')
    this.dialogRef.close({data : data})
    // this.router.navigate(['/activities/activitiesthread/actionList'])
  }
}
