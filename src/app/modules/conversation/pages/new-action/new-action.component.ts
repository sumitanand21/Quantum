import { isError } from 'util';
import { Component, OnInit, Inject, OnDestroy, ElementRef } from '@angular/core';
import { MasterApiService } from '@app/core/services/master-api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { ConversationService, actionListService, DataCommunicationService, threadListService, OnlineOfflineService, OfflineService, routes, ErrorMessage, ActionHeaders, ActionAdvnNames } from '@app/core/services'
import { RoutingState } from '@app/core/services/navigation.service';
import { selectedContact } from '@app/modules/leads/pages/create-lead/create-lead.component';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { removeSpaces, checkLimit } from '@app/shared/pipes/white-space.validator';
import { ClearActionList, ClearActivity, ClearActivityDetails } from '@app/core/state/actions/activities.actions';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { ClearTaskList } from '@app/core/state/actions/home.action';
import { CacheDataService } from '@app/core/services/look-up-cache-data/cache-data.serive';
@Component({
  selector: 'app-new-action',
  templateUrl: './new-action.component.html',
  styleUrls: ['./new-action.component.scss'],
})
export class NewActionComponent implements OnInit, OnDestroy {
  status: any;
  getPriority: any;
  getPriorityType: any[];
  statusCode = [];
  newActionForm: FormGroup;
  name: any;
  id: any;
  routerLink: any
  ownerSystemValue: Array<any> = [];
  state: any;
  stateCode: any[];
  selectedContact: Array<any> = [];
  Owners: Array<any> = [];
  sysGuid: any;
  isLoading: boolean = false;
  postObj1: { "Id": any; };
  object1: any;
  contact: selectedContact[] = [];
  today = new Date();
  showContact: boolean = false;
  contactName: string = "";
  contactNameSwitch: boolean = false;
  parenSystemId: string = "";
  showTag: boolean = false;
  contactTag: string;
  contactTagSwitch: boolean = false;
  selectedTag: {}[] = [];
  postObj = {};
  clicked: boolean = false;
  meetingSubjectSearch: any = []
  selectedMeetingSubject: string = ""
  selectedMeetingSubjectId: string = '';
  isActionOwnersSearchLoading: boolean = false;
  isMeetingSubjectSearchLoading: boolean = false;
  disabled: boolean = false;
  meetingValueCheck: any;
  StartDate: any;
  sixMonthDate: any;
  childdetailsList: any;
  arrowkeyLocation = 0;
  yearDateValidation: any;
  TagContact: {}[] = [];
  messageShowPopUp: any;
  ActivityMeetingReqBody = {
    Guid: 1,
    PageSize: 10,
    Conversation_Guid: "",
    RequestedPageNumber: 1,
    OdatanextLink: ""
  }
  get f() {
    return this.newActionForm.controls
  }
  //------------------------------------advance lookup ts file starts--------------------------------//
  lookupdata = {
    tabledata: [],
    recordCount: 10,
    headerdata: [],
    Isadvancesearchtabs: false,
    controlName: 'account',
    lookupName: '',
    isCheckboxRequired: false,
    inputValue: '',
    TotalRecordCount: 0,
    selectedRecord: [],
    isLoader: false,
    nextLink: '',
    errorMsg: {
      isError: false,
      message: ""
    },
    otherDbData: {
      countryvalue: [],
      isLoader: false,
    }
  };
  IdentifyAppendFunc = {
    'actionOwneSearch': (data) => { this.appendcontact(data, 0) }
  }
  selectedLookupData(controlName) {
    switch (controlName) {
      case 'actionOwneSearch': return (this.sendToAdvanceLookUp.length > 0) ? this.sendToAdvanceLookUp : []
    }
  }
  emptyArray(controlName) {
    switch (controlName) {
      case 'actionOwneSearch': { this.sendToAdvanceLookUp = []; this.selectedContact = []; this.Owners = [] }
    }
  }
  //---------------------------------advance lookup ts file ends-------------------------------//
  constructor(
    private router: Router,
    public el: ElementRef,
    public service: DataCommunicationService,
    public actionListService: actionListService,
    private masterApi: MasterApiService,
    private fb: FormBuilder,
    private conversationService: ConversationService,
    public dialog: MatDialog,
    public matSnackBar: MatSnackBar,
    private encrDecrService: EncrDecrService,
    private routingState: RoutingState,
    private offlineService: OfflineService,
    private onlineofflineService: OnlineOfflineService,
    public errorMessage: ErrorMessage,
    public store: Store<AppState>,
    private route: ActivatedRoute,
    private threadListService: threadListService,
    private cacheDataService: CacheDataService
  ) { }
  ngOnInit() {
    this.yearDateValidation = new Date(1980, 1, 1)
    this.newActionFormGroup();
    this.getMasterAPI();
    
    this.name = sessionStorage.getItem('ActivityGroupName');
    let parent = sessionStorage.getItem('ActivityListRowId');
    this.id = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', JSON.parse(parent), 'DecryptionDecrip')
    this.clicked = false;
    if (JSON.parse(sessionStorage.getItem('tableName')) == "childInfo") {
      debugger
      var shareConversation = JSON.parse(sessionStorage.getItem("shareConversation"))
      this.newActionForm.patchValue({
        meetingSubject: shareConversation.Name
      })
      this.meetingValueCheck = shareConversation.Name;
      this.selectedMeetingSubjectId = shareConversation.Guid;
      this.ConversationNameSwitch = false;
      this.disabled = true;
    }
    this.StartDate = new Date()
    var month = (this.StartDate.getMonth() + 3);
    var date = this.StartDate.getDate();
    var year = this.StartDate.getFullYear();
    this.sixMonthDate = new Date(year, month, date)
    this.ActivityMeetingReqBody.Guid = this.id;
    this.singleActionDataBind();
    this.autoPopulateFromDetailChild();
    this.autoSaveForm();
  }

  autoPopulateFromDetailChild() {
    if(sessionStorage.getItem('shareConversation')) {
      var data = JSON.parse(sessionStorage.getItem('shareConversation')) 
        if (data.detailChild) {
          if (data.detailChild == true) {
            this.selectedMeetingSubjectId = data.SysGuid;
            this.meetingValueCheck = data.Name;
            this.newActionForm.patchValue({
              meetingSubject: data.Name
            })
          }
        }
    }
  }
  singleActionDataBind() {
    let reqBody = {"Guid": this.id,"PageSize":50,"Conversation_Guid":"","RequestedPageNumber":1,"OdatanextLink":""}
    let useFulldata = {
      pageNo: this.ActivityMeetingReqBody.RequestedPageNumber,
      id: this.id,
      pageSize: 50
    }
    let reqparam =this.threadListService.GetAppliedFilterData({ ...reqBody, useFulldata: useFulldata})
    this.threadListService.getAppliedFilterMeetingData(reqparam).subscribe(res => {
      if (res.IsError == false) {
        console.log("action list api", res.ResponseObject)
        if (res.ResponseObject.length === 1) {
          this.newActionForm.patchValue({
            meetingSubject: res.ResponseObject[0].Subject
          })
          this.selectedMeetingSubjectId = res.ResponseObject[0].Guid
          this.meetingValueCheck = res.ResponseObject[0].Subject
          this.ConversationNameSwitch = false;
        }
      } else {

      }
    })
  }


  //--------------- Auto save functionality start ----------------

  autoSaveChangedData(validity: boolean) {
    if(validity){
      let body = {
        "newActionAutosetdata": {...this.newActionForm.value, actionOwner : (this.selectedContact.length > 0) ? this.selectedContact : [] }
      }
      console.log("newActionSetCache form",body);
      this.service.SetRedisCacheData(body, 'L2O_CREATENEWACTION').subscribe(res=>{
        console.log("newActionSetCache service",res);
      });

    }

  }

  TempGetCacheNewActionCreate: any;
  autoSaveForm(){
    this.service.GetRedisCacheData('L2O_CREATENEWACTION').subscribe(res=>{
      console.log("Get Redis CacheData contact", res);
      this.isLoading = false
      if (!res.IsError) {
        if (!this.isEmpty(res.ResponseObject)) {
          this.TempGetCacheNewActionCreate = JSON.parse(res.ResponseObject)
          console.log("tem data", (this.TempGetCacheNewActionCreate));
          if (res.ResponseObject != 'empty') {
            this.cacheDataPatchValuesForAutoSaved();
          }
        }
      }
    })
  }
  cacheDataPatchValuesForAutoSaved() {
    this.newActionForm.patchValue({
      actionName: this.TempGetCacheNewActionCreate['newActionAutosetdata'].actionName,
      priority: this.TempGetCacheNewActionCreate['newActionAutosetdata'].priority,
      dueDate: this.TempGetCacheNewActionCreate['newActionAutosetdata'].dueDate,
      status: this.TempGetCacheNewActionCreate['newActionAutosetdata'].status,
      state: this.TempGetCacheNewActionCreate['newActionAutosetdata'].state,
      description: this.TempGetCacheNewActionCreate['newActionAutosetdata'].description,
      // meetingSubject: this.TempGetCacheNewActionCreate['newActionAutosetdata'].meetingSubject,
    });
    this.otherActivityGroupName = this.TempGetCacheNewActionCreate['newActionAutosetdata'].actionName;
    let temp = this.TempGetCacheNewActionCreate['newActionAutosetdata']
    console.log("cacheDataPatchValuesForAutoSaved patch value",temp);
   if (this.TempGetCacheNewActionCreate['newActionAutosetdata'].actionOwner.length > 0) {
    this.TempGetCacheNewActionCreate['newActionAutosetdata'].actionOwner.forEach(element => {
      let json = { FullName: element.FullName, SysGuid: element.SysGuid, Id: element.SysGuid, MapGuid: "" };
      this.selectedContact.push(json);
      this.sendToAdvanceLookUp.push(json);
    });
   }

  }
  
  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }
  //----------------Auto save end--------------------------------
  getMasterAPI() {
    this.masterApi.getPriority().subscribe(res => {
      this.offlineService.addMasterApiCache(routes.priority, res)
      this.getPriorityType = res.ResponseObject;
    })
    this.postObj1 = JSON.parse(this.newActionForm.value.state)
    this.masterApi.getNewStatusCode().subscribe(res => {
      this.offlineService.addMasterApiCache(routes.status, res)
      this.statusCode = res.ResponseObject
    })
  }
  navTo() {
    this.routingState.backClicked();
  }
  OnError(message) {
    let action;
    this.matSnackBar.open(message, action, {
      duration: 2000
    });
  }
  scrollTo(element: Element) {
    if (element) {
      window.scroll({
        behavior: 'smooth',
        left: 0,
        top: element.getBoundingClientRect().top + window.scrollY - 150
      });
    }
  }
  otherActivityGroupName : string = '';
  inputChange(event) {
    this.otherActivityGroupName = event.target.value;
  }
  newActionFormGroup() {
    this.newActionForm = this.fb.group({
      actionName: ['', Validators.compose([Validators.required, removeSpaces, checkLimit(101)])],
      actionOwner: ['', Validators.required],
      priority: ['', Validators.required],
      dueDate: ['', Validators.required],
      status: ['', Validators.required],
      state: ['0'],
      description: [''],
      meetingSubject: ['']
    });
    this.newActionForm.get('actionOwner').valueChanges.subscribe(res => {
      if (this.newActionForm.get('actionOwner').dirty && this.contactNameSwitch) {
        this.isActionOwnersSearchLoading = true;
        this.ownerSystemValue = []
        this.actionListService.getOwnerSystemUserId(res).subscribe(value => {
          this.isActionOwnersSearchLoading = false;
          if (!value.IsError) {
            this.ownerSystemValue = value.ResponseObject;
            this.lookupdata.TotalRecordCount = value.TotalRecordCount;
            this.lookupdata.nextLink = (value.OdatanextLink) ? value.OdatanextLink : '';
          } else {
            this.OnError(res.Message);
            this.ownerSystemValue = []
          }
        }, error => {
          this.isActionOwnersSearchLoading = false;
          this.ownerSystemValue = []
        })
      }
      // if (res == "") {
      //   if (this.cacheDataService.cacheDataGet('actionOwner').length > 0) {
      //     this.ownerSystemValue = this.cacheDataService.cacheDataGet('actionOwner')
      //     this.isActionOwnersSearchLoading = false;
      //   }
      // }
    })
    this.newActionForm.controls['meetingSubject'].valueChanges.subscribe(res => {
      if (this.newActionForm.get('meetingSubject').dirty && this.ConversationNameSwitch) {
        this.isMeetingSubjectSearchLoading = true;
        this.meetingSubjectSearch = []
        this.actionListService.getMeetingType(this.id, res).subscribe(value => {
          this.isMeetingSubjectSearchLoading = false;
          if (!value.IsError) {
            this.meetingSubjectSearch = value.ResponseObject
          } else {
            this.OnError(res.Message);
            this.meetingSubjectSearch = []
          }
        }, error => {
          this.isMeetingSubjectSearchLoading = false;
          this.meetingSubjectSearch = []
        })
      }
      // if (res == "") {
      //   if (this.cacheDataService.cacheDataGet('meetingSubject').length > 0) {
      //     this.isMeetingSubjectSearchLoading = false;
      //     this.meetingSubjectSearch = this.cacheDataService.cacheDataGet('meetingSubject')
      //   }
      // }
    })
  }

  clickMeetingSubject() {
    this.newActionForm.patchValue({
      meetingSubject: ''
    })
    this.isMeetingSubjectSearchLoading = true;
    this.meetingSubjectSearch = [];
    // if (this.cacheDataService.cacheDataGet('meetingSubject').length > 0) {
    //   this.meetingSubjectSearch = this.cacheDataService.cacheDataGet('meetingSubject')
    //   this.isMeetingSubjectSearchLoading = false;
    // } else {
      this.actionListService.getMeetingType(this.id, '').subscribe(value => {
        this.isMeetingSubjectSearchLoading = false;
        if (!value.IsError) {
          this.meetingSubjectSearch = value.ResponseObject;
          // this.cacheDataService.cacheDataSet("meetingSubject", value.ResponseObject)
        } else {
          this.OnError(value.Message);
          this.meetingSubjectSearch = [];
          this.cacheDataService.cacheDataReset("meetingSubject")
        }
      }, error => {
        this.isMeetingSubjectSearchLoading = false;
        this.meetingSubjectSearch = [];
        this.cacheDataService.cacheDataReset("meetingSubject")
      });
    // }
  }

  clickActionOwner() {
    this.newActionForm.patchValue({
      actionOwner: ''
    })
    this.isActionOwnersSearchLoading = true;
    this.ownerSystemValue = [];
    // if (this.cacheDataService.cacheDataGet('actionOwner').length > 0) {
    //   this.ownerSystemValue = this.cacheDataService.cacheDataGet('actionOwner')
    //   this.isActionOwnersSearchLoading = false;
    // } else {
      this.actionListService.getOwnerSystemUserId('').subscribe(value => {
        this.isActionOwnersSearchLoading = false;
        if (!value.IsError) {
          this.ownerSystemValue = value.ResponseObject;
          this.lookupdata.TotalRecordCount = value.TotalRecordCount;
          this.lookupdata.nextLink = (value.OdatanextLink) ? value.OdatanextLink : '';
          // this.cacheDataService.cacheDataSet("actionOwner", value.ResponseObject)
        } else {
          this.OnError(value.Message);
          this.ownerSystemValue = [];
          this.cacheDataService.cacheDataReset("actionOwner")
        }
      }, error => {
        this.isActionOwnersSearchLoading = false;
        this.ownerSystemValue = [];
        this.cacheDataService.cacheDataReset("actionOwner")
      })
    // }
  }
  /****************** Conversation Name autocomplete code start ****************** */

  showConversation: boolean = false;
  Conversation: string = "";
  ConversationNameSwitch: boolean = false;

  ConversationNameclose() {
    debugger
    this.ConversationNameSwitch = false;
    if (this.selectedMeetingSubjectId == '') {
      this.newActionForm.patchValue({
        meetingSubject: ""
      })
    } else {
      this.newActionForm.patchValue({
        meetingSubject: this.meetingValueCheck
      })
    }
  }
  appendConversation(item) {
    debugger
    this.meetingValueCheck = item.Subject
    this.selectedMeetingSubject = item.Subject
    this.selectedMeetingSubjectId = item.Guid
    this.newActionForm.patchValue({
      meetingSubject: item.Subject
    })
    this.ConversationNameSwitch = false;
    this.autoSaveChangedData(this.newActionForm.get('meetingSubject').valid);
  }

  clearMeetingSubject() {
    this.newActionForm.patchValue({
      meetingSubject: ''
    });
    this.meetingValueCheck = ''
    this.selectedMeetingSubject = ''
    this.selectedMeetingSubjectId = ''
  }
  selectedConversation: {}[] = [];
  /****************** Conversation Name autocomplete code end ****************** */
  /****************** action contact autocomplete code start ****************** */
  contactNameclose() {
    this.contactNameSwitch = false;
    this.newActionForm.patchValue({
      actionOwner: ''
    });
  }

  sendToAdvanceLookUp = []
  appendcontact(item, i) {
     if (localStorage.getItem('forMeetingCreation')) {
      var accountGuid = JSON.parse(localStorage.getItem('forMeetingCreation'))
    }
    this.actionListService.getActionOwnerValidation(accountGuid.Account.SysGuid,item.SysGuid).subscribe(res => {
      console.log("getActionOwnerValidation",res);
      if (res.IsError == false) {
        if (res.ResponseObject.Name.includes('ReadAccess')) {
          if (i > this.ownerSystemValue.length) {
            this.openadvancetabs('actionOwneSearch', this.ownerSystemValue, this.newActionForm.get('Linkedleads').value)
          } else {
            console.log(item);
            let json = { FullName: item.FullName, SysGuid: item.SysGuid, Id: item.SysGuid, MapGuid: "" }
            this.contactName = item.FullName;
            this.sysGuid = item.SysGuid;
            this.selectedContact.push(json);
            this.Owners.push(item);
            this.contact = [item];
            console.log('---->appending', item)
            let beforeLength = this.selectedContact.length
            this.selectedContact = this.service.removeDuplicates(this.selectedContact, "SysGuid");
            let afterLength = this.selectedContact.length
            console.log(beforeLength, afterLength)
            if (beforeLength == afterLength) {
              this.sendToAdvanceLookUp.push(json)
            }
            if (beforeLength !== afterLength) {
              this.errorMessage.throwError('Selected user already exists')
              this.newActionForm.patchValue({
                actionOwner: ''
              });
            }
            if (this.selectedContact.length > 0) {
              this.newActionForm.controls.actionOwner.clearValidators();
              this.newActionForm.controls.actionOwner.updateValueAndValidity();
            } else if (this.selectedContact.length === 0) {
              this.newActionForm.controls.actionOwner.setValidators(Validators.required);
            }
            this.newActionForm.patchValue({
              actionOwner: ''
            });
          }
          this.autoSaveChangedData(this.newActionForm.get('actionOwner').valid);
        }  else {
          this.errorMessage.throwError('The selected user does not have access on the account tagged to this activity group. Kindly add users who have access to the account');
        }
      } 
    });

    this.contactNameSwitch = false;
  }
  // Function for Deleting the contact
  deleteContact(item) {
    this.selectedContact = this.selectedContact.filter(res => res.SysGuid !== item.SysGuid)
    this.sendToAdvanceLookUp = this.sendToAdvanceLookUp.filter(x => x.SysGuid !== item.SysGuid)
    this.Owners = this.Owners.filter(res => res.SysGuid !== item.SysGuid)
    this.newActionForm.get('actionOwner').clearValidators();
    this.newActionForm.get('actionOwner').updateValueAndValidity();
    this.autoSaveChangedData(this.newActionForm.get('actionOwner').valid);
    console.log('-->',this.selectedContact, item)
    if (this.selectedContact.length == 0) {
      this.newActionForm.get('actionOwner').setValidators([Validators.required])
      this.newActionForm.get('actionOwner').markAsTouched();
      this.newActionForm.get('actionOwner').updateValueAndValidity();
    }
  }
  /****************** action contact autocomplete code end ****************** */
  /******************Tag Contacts  autocomplete code start ****************** */
  contactTagclose() {
    this.contactTagSwitch = false;
  }
  appendTag(value: string, i) {
    this.contactTag = value;
    this.selectedTag.push(this.TagContact[i])
    this.contactTagSwitch = false;
  }

  create() {
    if (this.otherActivityGroupName.trim() === '') {
      this.newActionForm.patchValue({actionName :''});
      this.newActionForm.controls['actionName'].setValidators(Validators.required);
      this.newActionForm.controls['actionName'].markAsTouched();
      this.newActionForm.controls['actionName'].updateValueAndValidity();
    }
    if (this.newActionForm.value.dueDate != '' && this.newActionForm.valid) {
      var getDates = new Date(this.newActionForm.value.dueDate)
      if ((getDates.getTime() > (this.StartDate).getTime()) && Number(this.newActionForm.value.status) === 5) {
        this.openstauspop();
        return
      }
    }
    console.log(this.newActionForm);
    if (this.newActionForm.valid) {
      console.log('>>>>>', this.Owners);
      let newArray = this.Owners.map((element) => {
        return {
          MapGuid: element.MapGuid,
          parenSystemId: element.SysGuid
        };
      });
      if (this.Owners.length === 0) {
        let message = "Action Owners is a mandatory field!";
        let action;
        this.matSnackBar.open(message, action, {
          duration: 2000
        });
        this.newActionForm.controls['actionOwner'].updateValueAndValidity();
        return false;
      }
      if (this.Owners.length >= 0) {
        this.clicked = true;
        this.isLoading = true
        this.postObj = {
          "Conversation": { "Name": this.name },
          "Subject": this.otherActivityGroupName.trim(),
          "ActivityId": this.selectedMeetingSubjectId,
          "PriorityCode": JSON.parse(this.newActionForm.value.priority),
          "StatusCode": JSON.parse(this.newActionForm.value.status),
          "StateCode": JSON.parse(this.newActionForm.value.state),
          "DueDate": this.service.dateModifier(this.newActionForm.value.dueDate),
          "Description": this.newActionForm.value.description,
          "ActivityGroup": { "Guid": this.id },
          "Owners": newArray
        }
        console.log("object", this.postObj);
        this.conversationService.postNewAction(this.postObj).subscribe(async res => {
          console.log('Action res-->', res)
          if (res.IsError === true) {
            this.errorMessage.throwError(res.Message)
            this.clicked = false;
            this.isLoading = false
            return false;
          } else {
            this.messageShowPopUp = res.Message;
            this.isLoading = false;
            this.clicked = true;
            console.log("success", res);
            this.ClearRedisCache();
            this.store.dispatch(new ClearActivityDetails())
            this.store.dispatch(new ClearActionList({ clearaction: this.id }))
            this.store.dispatch(new ClearActivity())
            this.store.dispatch(new ClearTaskList())
            this.cacheDataService.cacheDataMultiReset(['actionOwner','meetingSubject']);
            await this.offlineService.ClearActivityIndexTableData()
            await this.offlineService.ClearArchivedConvIndexTableData()
            await this.offlineService.ClearTablesdata(this.onlineofflineService.isOnline)
            let forMeetingCreation = JSON.parse(localStorage.getItem('forMeetingCreation'))
            let json = {
              Guid: res.ResponseObject.ActivityGroup.Guid,
              Name: res.ResponseObject.ActivityGroup.Name,
              Account: forMeetingCreation.Account,
            }
            let json1 = {
              Account: forMeetingCreation.Account.Name,
              AccountSysGuid: forMeetingCreation.Account.SysGuid,
              isProspect: forMeetingCreation.Account.isProspect,
              isAccountPopulate: true
            }
            localStorage.setItem("forMeetingCreation", JSON.stringify(json))
            sessionStorage.setItem("RequestCampaign", JSON.stringify(json1));
            sessionStorage.setItem('AccountNameForChildConversation', forMeetingCreation.Account)
            sessionStorage.setItem('ActivityGroupName', res.ResponseObject.ActivityGroup.Name)
            if(sessionStorage.getItem('shareConversation')) { 
              var data = JSON.parse(sessionStorage.getItem('shareConversation'))
              if (data.detailChild) {
                data.detailChild = false;
                sessionStorage.setItem('shareConversation',JSON.stringify({...data}))
              }   
            }
            this.errorMessage.onSuccessMessage(this.messageShowPopUp).afterDismissed().subscribe(()=>{
              this.router.navigate(['/activities/activitiesthread/actionList']);
            })
          }
        }, error => {
          this.clicked = false;
          this.isLoading = false
        });
      }
    } else {
      this.service.validateAllFormFields(this.newActionForm)
      let invalidElements = this.el.nativeElement.querySelectorAll('#validatescroll .ng-invalid');
      if (invalidElements.length) {
        this.scrollTo(invalidElements[0]);
        this.service.validationErrorMessage();
      }
      // return
    }
  }

  ClearRedisCache() {
    this.service.SetRedisCacheData("empty", 'L2O_CREATENEWACTION').subscribe(res => console.log("Clear Autosave Cache",res))
  }

  ngOnDestroy() {
    this.actionListService.meetingDetailsInfo = undefined;
    this.disabled = false
  }

  opencreate() {
    const dialogRef = this.dialog.open(popupComponent,
      {
        width: '396px',
        disableClose: true
      });
    dialogRef.componentInstance.data = this.newActionForm.value.actionName;
    dialogRef.componentInstance.Message = this.messageShowPopUp
    dialogRef.afterClosed().subscribe(async res => {
      await this.offlineService.ClearTablesdata(this.onlineofflineService.isOnline)
      this.errorMessage.throwError(this.messageShowPopUp)

    })
  }
  /****************** Tag Contacts  autocomplete code end ****************** */
  opencancelpop(): void {
    const dialogRef = this.dialog.open(cancelpopactionComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == "OK") {
        this.ClearRedisCache();
      }
    })
  }
  openstauspop(): void {
    const dialogRef = this.dialog.open(Statuscomponent, {
      width: '400px',
    });
  }
  //-------------------------------------advance seach pop up start--------------------------------------------------------//

  openadvancetabs(controlName, initalLookupData, value) {
    this.lookupdata.controlName = controlName
    this.lookupdata.headerdata = ActionHeaders[controlName]
    this.lookupdata.lookupName = ActionAdvnNames[controlName]['name']
    this.lookupdata.isCheckboxRequired = ActionAdvnNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = ActionAdvnNames[controlName]['isAccount']
    this.lookupdata.inputValue = value;
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.actionListService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
      this.lookupdata.isLoader = false;
      console.log("res > res > res > res >" ,res);
      this.lookupdata.tabledata = res
    })
    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.service.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });
    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
      if (x['objectRowData'].searchKey != '' && x.currentPage == 1) {
        this.lookupdata.nextLink = ''
      }
      let dialogData = {
        searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
        recordCount: this.lookupdata.recordCount,
        OdatanextLink: this.lookupdata.nextLink,// need to handel the pagination and search!
        pageNo: x.currentPage//need to handel from pagination
      }
      this.actionListService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(), ...dialogData } }).subscribe(res => {
        this.lookupdata.isLoader = false;
        if (res.IsError == false) {
          this.lookupdata.errorMsg.isError = false;
          this.lookupdata.errorMsg.message = ''
          if (x.action == "loadMore") {
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
            this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
            this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          } else if (x.action == "search") {
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
            this.lookupdata.tabledata = res.ResponseObject;
            this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          }
          else if (x.action == "tabSwich") {
            if (x.objectRowData.wiprodb) {
              this.lookupdata.TotalRecordCount = res.TotalRecordCount;
              this.lookupdata.tabledata = res.ResponseObject;
              this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
            }
          }
        } else {
          this.lookupdata.errorMsg.isError = true;
          this.lookupdata.errorMsg.message = JSON.stringify(res.Message)
        }
      }, error => {
        this.lookupdata.isLoader = false;
        this.lookupdata.otherDbData.isLoader = false;
      })
    });
    dialogRef.afterClosed().subscribe(result => {
      debugger
      if (result) {
        this.emptyArray(result.controlName)
        console.log(result)
        this.AppendParticularInputFun(result.selectedData, result.controlName)
      }
      this.contactNameSwitch = false;
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
  // if based on account select search lookup
  getCommonData() {
    return {
      guid: "",
      isProspect: "",
    }
  }
  //-------------------------------------End advance seach pop up--------------------------------------------------------//
}
@Component({
  selector: 'create-pop',
  templateUrl: './create-pop.html',
})
export class popupComponent {
  Message: any;
  constructor(
    public actionListService: actionListService,
    public router: Router,
    public dialogRef: MatDialogRef<popupComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
  }
  async redirect() {
    this.router.navigate(['/activities/activitiesthread/actionList']);
    this.dialogRef.close();
  }
}
@Component({
  selector: 'app-cancel-pop',
  templateUrl: './cancel-pop-action.html',
  styleUrls: ['./new-action.component.scss'],

})
export class cancelpopactionComponent {

  constructor(
    public router: Router,
    public dialogRef: MatDialogRef<cancelpopactionComponent>,
    private cacheDataService: CacheDataService,
    public actionListService: actionListService) { }
  navTo(event) {
    this.cacheDataService.cacheDataMultiReset(['actionOwner','meetingSubject']);
    if(sessionStorage.getItem('shareConversation')) { 
      var data = JSON.parse(sessionStorage.getItem('shareConversation'))
      if (data.detailChild) {
        data.detailChild = false;
        sessionStorage.setItem('shareConversation',JSON.stringify({...data}))
      }   
    }
    if (sessionStorage.getItem('selAccountObj')) {
      this.accountSprintThreeModuleBack(event)
  } else {
    this.activityModuleBack(event);
  }

    this.actionListService.meetingDetailsInfo = undefined
  }

  accountSprintThreeModuleBack(event) {
    if (sessionStorage.getItem('actlist')) {
      let data = JSON.parse(sessionStorage.getItem('actlist'))
      if (data == 1) {
        this.router.navigate(['/accounts/accountactivities/myactivities']);
      } else if (data == 2) {
        this.router.navigate(['/accounts/accountactivities/list']);
      } else if (data == 10) {
        this.router.navigate(['/activities/meetingInfo'])
      }
    } else {
      this.router.navigate(['/activities/activitiesthread/actionList']);
    }
    this.dialogRef.close(event);
  }
  activityModuleBack(event) {
    if (sessionStorage.getItem('actlist')) {
      let data = JSON.parse(sessionStorage.getItem('actlist'))
      if (data == 1) {
        this.router.navigate(['/activities/myactivities']);
      } else if (data == 2) {
        this.router.navigate(['/activities/list']);
      } else if (data == 10) {
        this.router.navigate(['/activities/meetingInfo'])
      }
    } else {
      this.router.navigate(['/activities/activitiesthread/actionList']);
    }
    this.dialogRef.close(event);
  }

}
@Component({
  selector: 'app-status',
  templateUrl: './status.html',
})
export class Statuscomponent {
  constructor() { }
}