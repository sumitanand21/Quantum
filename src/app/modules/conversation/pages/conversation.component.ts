import { ClearActivityDetails } from './../../../core/state/actions/activities.actions';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Conversation, OfflineService, ArchivedConversationService, ErrorMessage, ContactService, } from '@app/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ConversationService } from '../../../core/services/conversation.service'
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataCommunicationService } from '@app/core';
import { newConversationService } from '@app/core/services/new-conversation.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ClearActivity } from '@app/core/state/actions/activities.actions';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { removeSpaces, checkLimit } from '@app/shared/pipes/white-space.validator';
import { MeetingService } from '@app/core/services/meeting.service';
import { PlatformLocation, Location } from '@angular/common';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { activityAdvnHeaders, activityAdvnNames, ActivityService } from '@app/core/services/activity.service';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {
  userArray: Conversation[];
  headerData;
  showmore: boolean = false;
  sidebar:boolean;
  constructor(
    private router: Router,
    public service: DataCommunicationService,
    public userdat: DataCommunicationService,
    private newconversationService: newConversationService,
    private meetingService: MeetingService,
    private store: Store<AppState>,
    public dialog: MatDialog) {
      this.store.dispatch(new ClearActivity())
  }
  async ngOnInit() {
    this.store.dispatch(new ClearActivityDetails())
    this.service.converArchive = false;
    let currentRoute = (this.router.url).substring(15);
    if (currentRoute == "Archivedlist") {
      this.service.converArchive = true;
    }
    if(!this.router.url.includes('/accounts/accountactivities')) {
      sessionStorage.removeItem('selAccountObj');
      localStorage.removeItem('AccountModuePopulateData');
    }
    if (this.router.url.includes('/activities/')) {
      this.sidebar=true;
  }
  this.fixed.addEventListener('touchmove', function(e) {

    e.preventDefault();
    console.log("scrollableHeader")

}, false);
  //Rudra jan 30
  }
 fixed = document.getElementById('scrollableHeader');



  openactivitypop(): void {
    sessionStorage.setItem('archivedStatus', "false");
    const dialogRef = this.dialog.open(activitypop1, {
      disableClose: true,
      width: '500px',
    });
  }
  openaddmeeting(data) {
    console.log("mobile");
    this.newconversationService.conversationAppointId = undefined;
    this.meetingService.createdMeetingGuid = ""
    this.newconversationService.attachmentList = []
    this.meetingService.meetingDetails = undefined;
    this.newconversationService.conversationFiledInformation = undefined;
    this.service.TempEditLeadDetails();
      localStorage.removeItem('AccountModuePopulateData');
      localStorage.removeItem('forMeetingCreation');
      sessionStorage.setItem('archivedStatus', "false");
    this.router.navigate(['/activities/newmeeting'])
  }

  routeToOther(data) {
      localStorage.removeItem('AccountModuePopulateData');
      localStorage.removeItem('forMeetingCreation');
    sessionStorage.setItem('tableName', JSON.stringify("Other Activity"));
    sessionStorage.setItem('archivedStatus', "false");
    this.router.navigate(['/activities/otheractivity'])
  }
}

@Component({
  selector: 'activity-pop',
  templateUrl: './activity-pop.html',
  styleUrls: ['./conversation.component.scss']
})

export class activitypop1 implements OnInit, OnDestroy {
  arrowkeyLocation = 0;
  ActivityTypeForm: FormGroup;
  companyDetails: any = [];
  isLoading: boolean;
  AccountSysGuid: string = '';
  activityId: any;
  Name: any;
  AccName: string = '';
  isvalidation: boolean = false;
  create: boolean = false;
  isProspect: boolean = false
  isAccountNameSearchLoading: boolean = false;
  subscription: Subscription
  sendAccountToAdvance: any = []
  AccountSelected: any = []
  @ViewChild('accountlist')
  acc: ElementRef;
  companyName: string = '';
  showCompany: boolean;
  showCompanySwitch: boolean = false;
  ValidateAccount: boolean = true;
  constructor(
    public dialogRef: MatDialogRef<activitypop1>,
    public fb: FormBuilder,
    public newconversationService: newConversationService,
    public conversationService: ConversationService,
    public archivedService: ArchivedConversationService,
    public router: Router,
    public matSnackBar: MatSnackBar,
    public service: DataCommunicationService,
    public dialog: MatDialog,
    public location1: Location,
    private encrDecrService: EncrDecrService,
    private errorMessage: ErrorMessage,
    public offlineservices: OfflineService,
    public location: PlatformLocation,
    private activityService: ActivityService,
    private S3MasterApiService: S3MasterApiService,
    public contactService: ContactService,
    public store: Store<AppState>) {
    this.CreateActivityType();
  }
  //------------------------------------advance lookup ts file starts--------------------------------//

  lookupdata = {
    tabledata: [],
    recordCount: 10,
    headerdata: [],
    Isadvancesearchtabs: false,
    controlName: '',
    lookupName: '',
    isCheckboxRequired: false,
    IsProspectAccount : true,
    inputValue: '',
    pageNo: 1,
    nextLink: '',
    TotalRecordCount: 0,
    selectedRecord: [],
    isBackbuttonrequired: false,
    isLoader: false,
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
    'accountSearch': (data) => { this.appendAccontName(data,0) },
  }

  selectedLookupData(controlName) {
    switch (controlName) {
      case 'accountSearch': { return (this.sendAccountToAdvance.length > 0) ? this.sendAccountToAdvance : [] }
    }
  }
  // duplicates removed from advance lookup
  emptyArray(controlName) {
    switch (controlName) {
      case 'accountSearch': {
        return this.AccountSelected = [], this.sendAccountToAdvance = []
      }
    }
  }
  //---------------------------------advance lookup ts file ends-------------------------------//
  ngOnInit(): void {
    debugger
    this.create = false;
    history.pushState(null, null, window.location.href);
    this.subscription = <Subscription>this.location1.subscribe((x) => {
      history.pushState(null, null, window.location.href);
    })
    if (JSON.parse(sessionStorage.getItem('CreateActivityGroup'))) { 
      this.prospectAccountNavigation();
    } else {
      this.autoSaveForm();
    }
      this.S3MasterApiService.getdnbtoken('code').subscribe(res => {
        localStorage.setItem('dNBToken', res.ResponseObject.access_token)
      })
      //Fatching Account name from Account module (FSD 3)
      if (this.router.url.includes('/accounts/accountactivities')) {
        this.fromAccountModule();
      }
  }
  fromAccountModule() {
    if (sessionStorage.getItem('selAccountObj')) {
      let accountInfo = JSON.parse(this.encrDecrService.get("EncryptionEncryptionEncryptionEn", sessionStorage.getItem('selAccountObj'), "DecryptionDecrip"))
      console.log('account details from Account FSD3', accountInfo)
          this.ActivityTypeForm.patchValue({
            accountName: this.getSymbol(accountInfo.Name)
          });
          this.ActivityTypeForm.controls['accountName'].disable();
          this.AccName = accountInfo.Name;
          this.AccountSysGuid = accountInfo.SysGuid
          this.isProspect = accountInfo.isProspect
    }
  }
  getSymbol(data) {
    return unescape(JSON.parse('"' + data + '"')).replace(/\?/g, '/');
  }

  ClearRedisCache() {
    this.service.SetRedisCacheData("empty", 'L2O_CREATEACTIVITYGROUP').subscribe(res => console.log(res))
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  prospectAccountNavigation() {
    if (JSON.parse(sessionStorage.getItem('CreateActivityGroup'))) {
      var sessiondata = JSON.parse(sessionStorage.getItem('CreateActivityGroup'))
      this.ActivityTypeForm.patchValue({ newActivityGroup: sessiondata.activityGroupName, })
      if (sessiondata.account) {
        this.ActivityTypeForm.patchValue({ accountName: sessiondata.account.Name })
        this.AccountSysGuid = sessiondata.account.SysGuid;
        this.AccName = sessiondata.account.Name;
        this.isProspect = sessiondata.account.isProspect;
        this.companyName = sessiondata.account.Name;
        this.activityGroupName = sessiondata.activityGroupName;
        this.companyNameClose();
        this.autoSaveChangedData(true);
      } else {
        this.clearAccountName();
        this.isProspect = false;

      }
    } else {
      this.showCompanySwitch = false;
    }
  }

  onNoClick(): void {
    this.ClearRedisCache();
    sessionStorage.removeItem('CreateActivityGroup')
  }

  prospectClickClose() {
    this.dialogRef.close();
  }

  get f() {
    return this.ActivityTypeForm.controls
  }

  CreateActivityType() {
    this.ActivityTypeForm = this.fb.group({
      newActivityGroup: ['', Validators.compose([Validators.required, removeSpaces, checkLimit(101)])],
      accountName: ['', Validators.required]
    })
    this.ActivityTypeForm.get('accountName').valueChanges.subscribe(val => {
      if (this.showCompanySwitch && this.ActivityTypeForm.get('accountName').dirty) { 
        this.isAccountNameSearchLoading = true;
        this.companyDetails = []
        this.newconversationService.getsearchAccountCompany(val).subscribe(res => {
          this.isAccountNameSearchLoading = false;
          this.isLoading = false;
          if (res.IsError === false) {
            this.companyDetails = res.ResponseObject;
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
            this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          } else {
            this.errorMessage.throwError(res.Message);
            this.companyDetails = []
          }
        }, error => {
          this.isAccountNameSearchLoading = false;
          this.companyDetails = []
        });
      } else {
        this.showCompanySwitch = false;
        this.companyDetails = [];
      }
    })
  }
    //--------------- Auto save functionality start ----------------
    autoSaveChangedData(validity: boolean) {
      if(validity){
        let JSONDATA = {
          Name : (this.activityGroupName.trim() != "") ? this.activityGroupName.trim() : "",
          Account : {
            Name : (this.AccName != "") ? this.AccName : "",
           isProspect : (this.isProspect) ? this.isProspect : false,
           SysGuid : (this.AccountSysGuid != "") ? this.AccountSysGuid : ""
            }
        }
        let body = {
          "CreateActivityGroupAutosetdata": {...JSONDATA }
        }
        console.log("CreateActivityGroupAutosetdata form",body);
        this.service.SetRedisCacheData(body, 'L2O_CREATEACTIVITYGROUP').subscribe(res=>{
          console.log("SetRedisCacheData",res);
        });
      }
    }
  
    autoSaveForm(){
      this.service.GetRedisCacheData('L2O_CREATEACTIVITYGROUP').subscribe(res=>{
        console.log("Get Redis CacheData contact", res);
        this.isLoading = false
        if (!res.IsError) {
          if (!this.isEmpty(res.ResponseObject)) {
            if (res.ResponseObject != 'empty') {
              this.cacheDataPatchValuesForAutoSaved(JSON.parse(res.ResponseObject));
            }
          }
        }
      })
    }
    cacheDataPatchValuesForAutoSaved(data) {
      this.ActivityTypeForm.patchValue({
        newActivityGroup: data['CreateActivityGroupAutosetdata'].Name,
        accountName: data['CreateActivityGroupAutosetdata'].Account.Name,
      });
      this.AccountSysGuid = data['CreateActivityGroupAutosetdata'].Account.SysGuid;
      this.AccName = data['CreateActivityGroupAutosetdata'].Account.Name;
      this.isProspect = data['CreateActivityGroupAutosetdata'].Account.isProspect;
      this.companyName = data['CreateActivityGroupAutosetdata'].Account.Name;
      this.AccountSelected = data['CreateActivityGroupAutosetdata'].Account
      this.activityGroupName = data['CreateActivityGroupAutosetdata'].Name
      console.log("this.activityGroupName",this.activityGroupName);
    }
    
    isEmpty(obj) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key))
          return false;
      }
      return true;
    }
    
    //----------------Auto save end--------------------------------
  clickAccountData() {
      this.isAccountNameSearchLoading = true;
      this.companyDetails = []
      this.newconversationService.getsearchAccountCompany('').subscribe(res => {
        this.isAccountNameSearchLoading = false;
        this.isLoading = false;
        if (res.IsError === false) {
          this.companyDetails = res.ResponseObject;
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        } else {
          this.errorMessage.throwError(res.Message);
          this.companyDetails = []
        }
      }, error => {
        this.isAccountNameSearchLoading = false;
        this.companyDetails = []
      });
  }
  activityGroupName : string = '';
  inputChange(event) {
    console.log(event.target.value);
    this.activityGroupName = event.target.value;
    this.autoSaveChangedData(true);
  }

  CreateActivity() {
    if (this.activityGroupName.trim() === '') {
      this.ActivityTypeForm.patchValue({newActivityGroup :''});
      this.ActivityTypeForm.controls['newActivityGroup'].setValidators(Validators.required);
      this.ActivityTypeForm.controls['newActivityGroup'].markAsTouched();
      this.ActivityTypeForm.controls['newActivityGroup'].updateValueAndValidity();
    }
    if (this.AccName != this.ActivityTypeForm.value.accountName) { this.companyNameClose() }
    document.getElementsByTagName('body')[0].classList.remove("active");
    if (this.ActivityTypeForm.valid === false) { this.service.validateAllFormFields(this.ActivityTypeForm); }
    if (this.ActivityTypeForm.valid === true && this.ActivityTypeForm.get('newActivityGroup').errors == null) {
      this.create = true;
      this.isLoading = true;
      const body = {
        "Name": this.activityGroupName.trim(),
        "ActivityType": { "Id": 0 },
        "Account": { "SysGuid": this.AccountSysGuid, "Name": this.AccName, "isProspect": this.isProspect },
      }
      this.newconversationService.getCreateActivityGroup(body).subscribe(async res => {
        this.service.archiveTag = false;
        this.isLoading = false
        if (res.IsError === false) {
          this.isvalidation = false;
          let json = {
            Guid: res.ResponseObject.Guid,
            Name: res.ResponseObject.Name,
            Account: {
              Name: res.ResponseObject.Account.Name,
              SysGuid: res.ResponseObject.Account.SysGuid,
              isProspect: res.ResponseObject.Account.isProspect
            },
            AccountType: res.ResponseObject.AccountType
          }
          let json1 = {
            Name : res.ResponseObject.Name,
            Account: res.ResponseObject.Account.Name,
            AccountSysGuid: res.ResponseObject.Account.SysGuid,
            isProspect: res.ResponseObject.Account.isProspect,
           isAccountPopulate : true
          }
          debugger;
          sessionStorage.removeItem('archivedStatus');
          sessionStorage.setItem("ActivityListRowId", JSON.stringify(this.encrDecrService.set("EncryptionEncryptionEncryptionEn", res.ResponseObject.Guid, "DecryptionDecrip")))
          sessionStorage.setItem('tableName', JSON.stringify('conversation'));
          sessionStorage.setItem("RequestCampaign", JSON.stringify(json1));
          sessionStorage.setItem('AccountNameForChildConversation', res.ResponseObject.Account);
          sessionStorage.setItem('ActivityGroupName', res.ResponseObject.Name);
          this.newconversationService.setActivityGroupName(res.ResponseObject.Name);
          this.service.serviceSearchItem = "";
          this.service.archiveTag = false;
          sessionStorage.removeItem('CreateActivityGroup');
          let data = JSON.parse(sessionStorage.getItem('CreateActivityGroup'));
          sessionStorage.removeItem('actlist');
          // this.errorMessage.throwError(res.Message);\
          await this.offlineservices.ClearActivityIndexTableData()
          await this.offlineservices.ClearMyactivityIndexTableData()
          this.ClearRedisCache();
          localStorage.setItem('forMeetingCreation', JSON.stringify(json))
          this.dialogRef.close();
          this.errorMessage.onSuccessMessage(res.Message).afterDismissed().subscribe(() => {
            this.store.dispatch(new ClearActivity())
            this.router.navigate(['/activities/activitiesthread/meetingList']);
          });
        }
        if (res.IsError === true) {
          this.create = false;
          this.errorMessage.throwError(res.Message);
        }
      }, error => {
         this.isLoading = false; this.create = false; })
    }
  }

  appendActivityType(event: Event) {
    let selectElementValue = event.target['options']
    [event.target['options'].selectedIndex].text;
    let selectElementId = event.target['options']
    [event.target['options'].selectedIndex].value;
    this.activityId = +selectElementId;
    this.Name = selectElementValue
  }

  appendActivityWebType(event) {
    this.activityId = event.value;
    this.Name = event.triggerValue
  }

  companyNameClose() {
    this.showCompanySwitch = false;
    if (this.AccName === '') { this.ActivityTypeForm.patchValue({ accountName: '' }) }
    if (this.AccName != '') { this.ActivityTypeForm.patchValue({ accountName: this.AccName }) }
  }

  appendAccontName(item,i) {
    // this.newconversationService.ValidateAccount(item.SysGuid, item.isProspect, 0).subscribe(res => {
    //   if (res.IsError) {
    //     this.errorMessage.throwError(res.Message)
    //     this.AccountSysGuid = '';
    //     this.ActivityTypeForm.patchValue({ accountName: "" })
    //     this.acc.nativeElement.value = ''
    //   } else {
        let json = { "Name": item.Name, "isProspect": item.isProspect, "SysGuid": item.SysGuid, "Id": item.SysGuid }
        this.sendAccountToAdvance[0] = json;
        this.AccountSysGuid = item.SysGuid;
        this.AccName = item.Name;
        this.isProspect = item.isProspect;
        this.companyName = item.Name;
        this.AccountSelected = item
        this.ActivityTypeForm.patchValue({ accountName: this.companyName })
        this.showCompanySwitch = false
        this.autoSaveChangedData(this.ActivityTypeForm.get('accountName').valid);
    //   }
    // }, error => {
    //   this.companyDetails = []
    //   this.clearAccountName();
    // })
    this.showCompanySwitch = true;
  }

  clearAccountName() {
    this.AccountSysGuid = '';
    this.AccName = '';
    this.companyName = '';
    this.ActivityTypeForm.patchValue({ accountName: "" })
    this.autoSaveChangedData(true);
  }

  lookUpColumn(controlName,value) {
    this.lookupdata.isBackbuttonrequired = true;
    this.lookupdata.controlName = controlName;
    this.lookupdata.headerdata = activityAdvnHeaders[controlName];
    this.lookupdata.lookupName = activityAdvnNames[controlName]['name'];
    this.lookupdata.isCheckboxRequired = activityAdvnNames[controlName]['isCheckbox'];
    this.lookupdata.Isadvancesearchtabs = activityAdvnNames[controlName]['isAccount'];
    this.lookupdata.inputValue = value;
  }
  /****************Advance search popup starts**********************/
  openadvancetabs(controlName, initalLookupData, value): void {
    this.lookUpColumn(controlName,value)
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.activityService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
      this.lookupdata.isLoader = false;
      this.lookupdata.tabledata = res
    })
    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.service.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });
    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
      console.log("wipro db", x)
      if (x['objectRowData'].searchKey != '' && x.currentPage == 1) {
        this.lookupdata.nextLink = ''
      }
      let dialogData = {
        searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
        recordCount: this.lookupdata.recordCount,
        OdatanextLink: this.lookupdata.nextLink,// need to handel the pagination and search!
        pageNo: x.currentPage//need to handel from pagination
      }
      if (x.objectRowData.wiprodb) {
        this.lookUpColumn(controlName,value)
        this.activityService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(), ...dialogData } }).subscribe(res => {
          this.lookupdata.isLoader = false;
          if (res.IsError == false) {
            this.lookupdata.errorMsg.isError = false;
            this.lookupdata.errorMsg.message = ''
            if (x.action == "loadMore") {
              debugger
              this.lookupdata.TotalRecordCount = res.TotalRecordCount;
              this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
              this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
            } else if (x.action == "search") {
              this.lookupdata.TotalRecordCount = res.TotalRecordCount;
              this.lookupdata.tabledata = res.ResponseObject;
              this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
            }
            else if (x.action == "tabSwich") {
              console.log("xxxxxxxxxxxxxxxxx", x)
              // if (!x.objectRowData.wiprodb) {
                this.lookupdata.TotalRecordCount = res.TotalRecordCount;
                this.lookupdata.tabledata = res.ResponseObject;
                this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
              // }
            }
          } else {
            this.lookupdata.errorMsg.isError = true;
            this.lookupdata.errorMsg.message = JSON.stringify(res.Message)
          }
        }, error => {
          this.lookupdata.isLoader = false;
        })
      } else {
        this.lookupdata.controlName = controlName
        this.lookupdata.headerdata = activityAdvnHeaders['DnBAccountHeader']
        this.lookupdata.lookupName = activityAdvnNames[controlName]['name']
        this.lookupdata.isCheckboxRequired = activityAdvnNames[controlName]['isCheckbox']
        this.lookupdata.Isadvancesearchtabs = activityAdvnNames[controlName]['isAccount']
        this.lookupdata.inputValue = value;
        this.dnBDataBase(x);
      }
    });
    setTimeout(() => {
      this.dialogRef.close();
    }, 100)
    dialogRef.afterClosed().subscribe(result => {
      if (result != 'backclicked') {
        if (result.wiprodb == false) {
          console.log("result 1", result)
          this.service.sendProspectAccount = true;
          this.groupData(result);
          this.router.navigateByUrl('/activities/prospectAccount');
        } else {
          this.populateActivityCreate(result.selectedData[0].Name,result.selectedData[0].SysGuid,result.selectedData[0].isProspect)
          this.emptyArray(result.controlName);
          this.AppendParticularInputFun(result.selectedData, result.controlName)
        }
      }
      if(result == 'backclicked' ) {
        this.populateActivityCreate(this.AccName,this.AccountSysGuid,this.isProspect)
      }
      if (result == "") {
        sessionStorage.removeItem('CreateActivityGroup');
      }
    });
  }
  populateActivityCreate(accntName,sysGuid,isProspect) {
    var object = {
      activityGroupName: this.activityGroupName,
      account: {
        Name: (accntName) ? accntName == undefined ? "" : accntName : "",
        SysGuid: (sysGuid) ? sysGuid == undefined ? "" : sysGuid : "",
        isProspect: (isProspect) ? this.isProspect : false
      },
      model: 'Create activity',
      route: 'activities/activitiesthread/meetingList'
    }
    sessionStorage.setItem('CreateActivityGroup', JSON.stringify(object))
    this.dialog.open(activitypop1, {
      disableClose: true,
      width: '500px',
    });
  }

  dnBDataBase(action) {
    if (action.action == "dbAutoSearch") {
      this.lookupdata.otherDbData.isLoader = true;
      this.activityService.getCountryData({ isService: true, searchKey: action.objectRowData.searchKey }).subscribe(res => {
        this.lookupdata.otherDbData.isLoader = false;
        this.lookupdata.isLoader = false;
        if (res.IsError == false) {
          this.lookupdata.errorMsg.isError = false;
          this.lookupdata.errorMsg.message = ''
          this.lookupdata.otherDbData.countryvalue = res.ResponseObject;
        }
      }, error => {
        this.lookupdata.isLoader = false;
        this.lookupdata.otherDbData.isLoader = false;
      })
    }
    if (action.action == "dbSearch") {
      let body = {
        "CustomerAccount": {
          "Name": action.objectRowData.dbSerachData.accountname.value,
          "Address": { "CountryCode": action.objectRowData.dbSerachData.countryvalue.id }
        }
      }
      this.lookupdata.otherDbData.isLoader = true;
      this.activityService.getSearchAccountInDNB({ isService: true, body: body }).subscribe(res => {
        this.lookupdata.otherDbData.isLoader = false;
        this.lookupdata.isLoader = false;
        if (res.IsError == false) {
          this.lookupdata.errorMsg.isError = false;
          this.lookupdata.errorMsg.message = ''
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.tabledata = res.ResponseObject;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        }
        if (res.IsError == true) {
          this.lookupdata.tabledata = [];
          this.lookupdata.TotalRecordCount = 0;
          this.lookupdata.nextLink = ''
        }
      }, error => {
        this.lookupdata.isLoader = false;
        this.lookupdata.otherDbData.isLoader = false;
      })
    }
  }

  groupData(result) {
    console.log("prospect account", result)
    var object = {
      activityGroupName: this.activityGroupName,
      account: {
        Name: (result.selectedData.length != 0) ? (result.selectedData[0].Name) ? result.selectedData[0].Name : "" : "",
        Id: (result.selectedData != 0) ? (result.selectedData[0].Id) ? result.selectedData[0].Id : "" : "",
        Industry: (result.selectedData != 0) ? (result.selectedData[0].Industry) ? result.selectedData[0].Industry : "" : "",
        Region: (result.selectedData != 0) ? (result.selectedData[0].Region) ? result.selectedData[0].Region : "" : ""
      },
      model: 'Create activity',
      route: 'activities/activitiesthread/meetingList'
    }
    sessionStorage.setItem('CreateActivityGroup', JSON.stringify(object))
  }

  AppendParticularInputFun(selectedData, controlName) {
    debugger
    if (selectedData) {
      if (selectedData.length > 0) {
        selectedData.forEach(data => {
          this.IdentifyAppendFunc[controlName](data)
        });
      }
    }
  }

  getCommonData() {
    return {
      isProspect: this.isProspect,
    }
  }
  /*****************Advance search popup ends*********************/
}
