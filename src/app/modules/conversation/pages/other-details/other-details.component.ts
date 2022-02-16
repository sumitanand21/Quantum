import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { ErrorMessage, SyncActivityService, MasterApiService } from '@app/core';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DataCommunicationService } from '@app/core/services/global.service';
import { MeetingService } from '@app/core/services/meeting.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { newConversationService } from '@app/core/services/new-conversation.service';
import { OthersListService, otherActivityAdvnHeaders, otherActivityAdvnNames } from '@app/core/services/others-list.service';
import { DatePipe } from '@angular/common';
import { checkLimit } from '@app/shared/pipes/white-space.validator';
import { EditOtherActivity, ClearOtherListdata, ClearActivityDetails, ClearActivity } from '@app/core/state/actions/activities.actions';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { CacheDataService } from '@app/core/services/look-up-cache-data/cache-data.serive';
import moment from 'moment';
@Component({
  selector: 'app-other-details',
  templateUrl: './other-details.component.html',
  styleUrls: ['./other-details.component.scss']
})
export class OtherDetailsComponent implements OnInit {
  activityTypeList: any;
  participants: any;
  linkedLeads: any;
  linkedOpportunity: any;
  searchActivityGroupList: any;
  contactaccount: string;
  contactconversationtag: string = "";
  customerName: string = "";
  contactName: string = "";
  contactlead: string;
  contactleadcamp: string;
  contactopportunity: string;
  consent: boolean = false;
  noneditpart: boolean = true;
  editpart: boolean = false;
  customerNameSwitch: boolean = false;
  contactaccountSwitch: boolean = false;
  contactconversationtagSwitch: boolean = false;
  contactNameSwitch: boolean = false;
  contactleadSwitch: boolean = false;
  contactleadSwitchcamp: boolean = false;
  showopportunity: boolean = false;
  contactopportunitySwitch: boolean = false;
  endStartDatesFirst: boolean = false;
  endStartTimes: boolean = false;
  accountContact: {}[] = [];
  selectedaccount: {}[] = [];
  customerContact: {}[] = [];
  selectedCustomer: {}[] = [];
  selectedContact: string = '';
  selectedopportunity: any = [];
  selectedlead: any = [];
  selectedParticipant: any = [];
  createOtherActivityForm: FormGroup;
  hideIf = false;
  bindDetailLists: any;
  sendSelectedLeadGuid: any = [];
  bindObjects: any;
  isLoading: boolean = false;
  sendSelectedAccountSysGuid: any;
  sendSelectedOpporGuid: any = [];
  sendSelectedParticipantSysGuid: any = [];
  participantMessage: string;
  parentId: any;
  durationToBind: any = "00";
  totalMinutesToSend: any;
  archived: string;
  saveDisabled: boolean = false;
  linkedMarketing: any;
  ActivityId: any;
  accountDetails: any;
  isActivityGroupSearchLoading: boolean = false;
  isParticipantsSearchLoading: boolean = false;
  isLinkedLeadsSearchLoading: boolean = false;
  isLinkedOpportunitiesSearchLoading: boolean = false;
  isLinkedMarketingTrainingSearchLoading: boolean = false;
  arrowkeyLocation = 0;
  yearDateValidation: any;
  newStartDateToValidate: any;
  newEndDateToValidate: any;
  selectStartTime: boolean = false;
  startChangeDateSelected: any;
  constStartDate: any;
  selectEndTime: boolean = false;
  endChangeDateSelected: any;
  constEndDate: any;
  endDateTimeGreater: boolean = false;
  editEndDateTime: string;
  isDateValidationTrue: boolean = false;
  linkCampaign = [];
  linkMarketing = [];
  linkWiproEvent = [];
  accountValidation: boolean = false;
  activitygrpChanged: any;
  selectedLeadMarketing: any = [];
  sendSelectedLeadMarketing: any;
  maxDate: any;
  constructor(
    public el: ElementRef,
    public dialog: MatDialog,
    public service: DataCommunicationService,
    private fb: FormBuilder,
    private router: Router,
    private meetingService: MeetingService,
    private masterApiService: MasterApiService,
    public newconversationService: newConversationService,
    private OthersListService: OthersListService,
    private errorMessage: ErrorMessage,
    public datepipe: DatePipe,
    private store: Store<AppState>,
    private encrdecr: EncrDecrService,
    private syncActivity: SyncActivityService,
    private cacheDataService: CacheDataService
  ) { }
  ngOnInit() {
    this.yearDateValidation = new Date(1980, 1, 1);
    var date = new Date();
    var year = date.getFullYear();
    var currentDate = date.getDate();
    var month = date.getMonth();
    this.maxDate = new Date(year + 1, month, currentDate);
    this.ActivityId = this.encrdecr.get('EncryptionEncryptionEncryptionEn', JSON.parse(sessionStorage.getItem("ActivityListRowId")), 'DecryptionDecrip')
    this.otherActivityForm();
    this.parentId = sessionStorage.getItem('conversationParentId');
    this.archived = sessionStorage.getItem('archivedStatus')
    if (this.archived === "true") {
      this.service.archiveTag = true
    } else {
      this.service.archiveTag = false
    }
    this.getActivityApi();
    this.detailListShowPage();
  }
  otherActivityGroupName: string = '';
  inputChange(event) {
    this.otherActivityGroupName = event.target.value;
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
  getActivityApi() {
    this.masterApiService.getActivity().subscribe(res => {
      this.isLoading = false;
      this.activityTypeList = res.ResponseObject.map(x => x = { ...x, Name: this.getSymbol(x.Name) });
    })
  }
  activityTypeName: any;
  activitySelectWeb(event) {
    this.activityTypeValidation(event.value);
    this.activityTypeList.filter(val => {
      if (val.Id === event.value) {
        this.activityTypeName = val.Name;
      }
    })
  }
  activitySelect(event) {
    this.activityTypeValidation(event.target.value);
  }
  activityTypeValidation(id) {
    if (id != '') {
      this.newconversationService.GetValidations(id).subscribe(res => {
        this.isLoading = false;
        if (!res.IsError) {
          this.EnableValidations(res.ResponseObject)
        } else {
          this.errorMessage.throwError(res.Message)
        }
      })
    }
  }
  IsLeadreq: boolean = false;
  IsOpporeq: boolean = false;
  EnableValidations(data) {
    if (data.IsLeadReq) {
      this.IsLeadreq = true
      if (this.selectedlead.length > 0) {
        this.removeLeadValidators()
      } else {
        this.setLeadValidators()
      }
    } else {
      this.IsLeadreq = false
      this.removeLeadValidators()
    }
    if (data.IsOpportunityReq) {
      this.IsOpporeq = true
      if (this.selectedopportunity.length > 0) {
        this.removeOppoValidators()
      } else {
        this.setOppoValidators()
      }
    } else {
      this.IsOpporeq = false
      this.removeOppoValidators()
    }
  }
  setLeadValidators() {
    this.createOtherActivityForm.controls['Linkedleads'].setValidators([Validators.required]);
    this.createOtherActivityForm.controls['Linkedleads'].markAsTouched();
    this.createOtherActivityForm.controls['Linkedleads'].updateValueAndValidity();
  }
  removeLeadValidators() {
    this.createOtherActivityForm.controls['Linkedleads'].markAsUntouched();
    this.createOtherActivityForm.controls['Linkedleads'].clearValidators();
    this.createOtherActivityForm.controls['Linkedleads'].updateValueAndValidity();
  }
  setOppoValidators() {
    this.createOtherActivityForm.controls['LinkedOpportunity'].setValidators([Validators.required]);
    this.createOtherActivityForm.controls['LinkedOpportunity'].markAsTouched();
    this.createOtherActivityForm.controls['LinkedOpportunity'].updateValueAndValidity();
  }
  removeOppoValidators() {
    this.createOtherActivityForm.controls['LinkedOpportunity'].markAsUntouched();
    this.createOtherActivityForm.controls['LinkedOpportunity'].clearValidators();
    this.createOtherActivityForm.controls['LinkedOpportunity'].updateValueAndValidity();
  }
  getSymbol(data) {
    return unescape(JSON.parse('"' + data + '"')).replace(/\?/g, '-');
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
    }
  };
  resetCacheData() {
    this.cacheDataService.cacheDataMultiReset(['activityGroup', 'wiproParticipants', 'linkedLeads', 'linkedOpportunitiesOrder', 'linkedMarketingTraining'])
  }
  IdentifyAppendFunc = {
    'participants': (data) => { this.appendconversationtag(data, 0) },
    'linkedLeads': (data) => { this.appendlead(data, 0) },
    'linkedOpportunityOrder': (data) => { this.appendopportunity(data, 0) },
  }
  selectedLookupData(controlName) {
    switch (controlName) {
      case 'participants': { return (this.selectedParticipant.length > 0) ? this.selectedParticipant : [] }
      case 'linkedLeads': { return (this.selectedlead.length > 0) ? this.selectedlead : [] }
      case 'linkedOpportunityOrder': { return (this.selectedopportunity.length > 0) ? this.selectedopportunity : [] }
    }
  }
  emptyArray(controlName) {
    switch (controlName) {
      case 'participants': { return this.selectedParticipant = [], this.sendSelectedParticipantSysGuid = []; }
      case 'linkedLeads': { return this.selectedlead = [], this.sendSelectedLeadGuid = []; }
      case 'linkedOpportunityOrder': { return this.selectedopportunity = [], this.sendSelectedOpporGuid = [] }
    }
  }
  /****************Advance search popup starts**********************/
  openadvancetabs(controlName, initalLookupData, value): void {
    this.lookupdata.controlName = controlName
    this.lookupdata.headerdata = otherActivityAdvnHeaders[controlName]
    this.lookupdata.lookupName = otherActivityAdvnNames[controlName]['name']
    this.lookupdata.isCheckboxRequired = otherActivityAdvnNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = otherActivityAdvnNames[controlName]['isAccount']
    this.lookupdata.inputValue = value;
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.OthersListService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
      this.lookupdata.isLoader = false;
      this.lookupdata.tabledata = res
    })
    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.service.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });
    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
      if (x['objectRowData'].searchKey != '' && x.currentPage == 1) { this.lookupdata.nextLink = '' }
      let dialogData = {
        searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
        recordCount: this.lookupdata.recordCount,
        OdatanextLink: this.lookupdata.nextLink,// need to handel the pagination and search!
        pageNo: x.currentPage//need to handel from pagination
      }
      this.OthersListService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(), ...dialogData } }).subscribe(res => {
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
      })
    });
    dialogRef.afterClosed().subscribe(result => {
      debugger
      if (result) {
        this.emptyArray(result.controlName)
        console.log(result)
        this.AppendParticularInputFun(result.selectedData, result.controlName)
      }
      this.contactconversationtagSwitch = false;
      this.contactleadSwitch = false;
      this.contactopportunitySwitch = false;
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
  LeadGuid: any;
  getCommonData() {
    return {
      guid: (this.accountDetails) ? (this.accountDetails.SysGuid) ? this.accountDetails.SysGuid : '' : '',
      isProspect: (this.accountDetails) ? (this.accountDetails.isProspect) ? this.accountDetails.isProspect : '' : '',
    }
  }
  /*****************Advance search popup ends*********************/
  otherActivityForm() {
    this.createOtherActivityForm = this.fb.group({
      OtherName: ['', Validators.compose([Validators.required, checkLimit(101)])],
      ActivityGroup: ['', Validators.required],
      ActivityType: ['', Validators.required],
      AccountName: ['', Validators.required],
      Duration: ['00'],
      StartDate: ['', Validators.required],
      startTime: ['', Validators.required],
      EndDate: ['', Validators.required],
      endTime: ['', Validators.required],
      Notes: [''],
      Participants: ['', Validators.required],
      Linkedleads: [''],
      LinkedOpportunity: [''],
      LinkedMarketing: ['']
    }, { validator: this.dateLessThan('StartDate', 'EndDate', 'startTime', 'endTime') });
    this.createOtherActivityForm.controls.Duration.disable();
    this.createOtherActivityForm.get('OtherName').valueChanges.subscribe(val => {
      if (val.trim() === "") {
        this.createOtherActivityForm.get('OtherName').patchValue('', { emitEvent: false })
      }
    })
    this.searchApi();
  }
  clickActivityGroupData() {
    this.createOtherActivityForm.patchValue({
      ActivityGroup: ''
    })
    this.isActivityGroupSearchLoading = true;
    this.searchActivityGroupList = [];
    if (this.cacheDataService.cacheDataGet('activityGroup').length > 0) {
      this.searchActivityGroupList = this.cacheDataService.cacheDataGet('activityGroup')
      this.isActivityGroupSearchLoading = false;
    } else {
      this.meetingService.searchActivityGroup("").subscribe(res => {
        this.isActivityGroupSearchLoading = false;
        if (!res.IsError) {
          this.searchActivityGroupList = res.ResponseObject;
          this.cacheDataService.cacheDataSet("activityGroup", res.ResponseObject)
        } else {
          this.errorMessage.throwError(res.Message);
          this.searchActivityGroupList = []
          this.selectedlead = [];
          this.selectedopportunity = [];
          this.sendSelectedAccountSysGuid = undefined;
          this.cacheDataService.cacheDataReset("activityGroup")
        }
      }, error => {
        this.isActivityGroupSearchLoading = false;
        this.searchActivityGroupList = [];
        this.selectedlead = [];
        this.selectedopportunity = [];
        this.sendSelectedAccountSysGuid = undefined;
        this.cacheDataService.cacheDataReset("activityGroup")
      })
    }
  }

  clickParticipantData() {
    this.createOtherActivityForm.patchValue({
      Participants: ''
    })
    this.isParticipantsSearchLoading = true;
    this.participants = [];
    if (this.cacheDataService.cacheDataGet('wiproParticipants').length > 0) {
      this.participants = this.cacheDataService.cacheDataGet('wiproParticipants')
      this.isParticipantsSearchLoading = false;
    } else {
      this.newconversationService.searchUser("").subscribe(res => {
        this.isParticipantsSearchLoading = false;
        if (!res.IsError) {
          this.participants = res.ResponseObject;
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          this.cacheDataService.cacheDataSet("wiproParticipants", res.ResponseObject)
        } else {
          this.errorMessage.throwError(res.Message);
          this.participants = [];
          this.cacheDataService.cacheDataReset("wiproParticipants")
        }
      }, error => {
        this.isParticipantsSearchLoading = false;
        this.participants = [];
        this.cacheDataService.cacheDataReset("wiproParticipants")
      })
    }
  }

  clickLinkLeadsData() {
    this.createOtherActivityForm.patchValue({
      Linkedleads: ''
    })
    this.isLinkedLeadsSearchLoading = true;
    this.linkedLeads = [];
    if (this.cacheDataService.cacheDataGet('linkedLeads').length > 0) {
      this.linkedLeads = this.cacheDataService.cacheDataGet('linkedLeads')
      this.isLinkedLeadsSearchLoading = false;
    } else {
      this.meetingService.SearchLeadBasedOnAccount(this.accountDetails.SysGuid, "", this.accountDetails.isProspect).subscribe(res => {
        this.isLinkedLeadsSearchLoading = false;
        if (!res.IsError) {
          this.linkedLeads = res.ResponseObject;
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          this.cacheDataService.cacheDataSet("linkedLeads", res.ResponseObject)
        } else {
          this.errorMessage.throwError(res.Message);
          this.linkedLeads = [];
          this.cacheDataService.cacheDataReset("linkedLeads")
        }
      }, error => {
        this.isLinkedLeadsSearchLoading = false;
        this.linkedLeads = [];
        this.cacheDataService.cacheDataReset("linkedLeads")
      })
    }
  }

  clickLinkedOpportunityData() {
    this.createOtherActivityForm.patchValue({
      LinkedOpportunity: ''
    })
    this.isLinkedOpportunitiesSearchLoading = true;
    this.linkedOpportunity = [];
    if (this.cacheDataService.cacheDataGet('linkedOpportunitiesOrder').length > 0) {
      this.linkedOpportunity = this.cacheDataService.cacheDataGet('linkedOpportunitiesOrder');
      this.isLinkedOpportunitiesSearchLoading = false;
    } else {
      this.meetingService.SearchOrderAndOppBasedOnAccount(this.sendSelectedAccountSysGuid, "", this.accountDetails.isProspect).subscribe(res => {
        this.isLinkedOpportunitiesSearchLoading = false;
        if (res.IsError === false) {
          this.linkedOpportunity = res.ResponseObject;
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          this.cacheDataService.cacheDataSet("linkedOpportunitiesOrder", res.ResponseObject)
        } else {
          this.errorMessage.throwError(res.Message);
          this.linkedOpportunity = [];
          this.cacheDataService.cacheDataReset("linkedOpportunitiesOrder")
        }
      }, error => {
        this.isLinkedOpportunitiesSearchLoading = false;
        this.linkedOpportunity = [];
        this.cacheDataService.cacheDataReset("linkedOpportunitiesOrder")
      })
    }
  }

  clickLinkedMarketTraining() {
    this.createOtherActivityForm.patchValue({
      LinkedMarketing: ''
    })
    this.isLinkedMarketingTrainingSearchLoading = true;
    this.linkedMarketing = [];
    if (this.cacheDataService.cacheDataGet('linkedMarketingTraining').length > 0) {
      this.linkedMarketing = this.cacheDataService.cacheDataGet('linkedMarketingTraining')
      this.isLinkedMarketingTrainingSearchLoading = false;
    } else {
      this.syncActivity.searchMarketingTraining("").subscribe(res => {
        this.isLinkedMarketingTrainingSearchLoading = false;
        if (res.IsError === false) {
          this.linkedMarketing = res.ResponseObject;
          this.cacheDataService.cacheDataSet("linkedMarketingTraining", res.ResponseObject)
          console.log("linked marketing", this.linkedMarketing)
        } else {
          this.errorMessage.throwError(res.Message);
          this.linkedMarketing = [];
          this.cacheDataService.cacheDataReset("linkedMarketingTraining")
        }
      }, error => {
        this.isLinkedMarketingTrainingSearchLoading = false;
        this.linkedMarketing = [];
        this.cacheDataService.cacheDataReset("linkedMarketingTraining")
      })
    }
  }

  searchApi() {
    this.createOtherActivityForm.get('ActivityGroup').valueChanges.subscribe(val => {
      if (this.createOtherActivityForm.get('ActivityGroup').dirty && this.contactNameSwitch) {
      if (this.contactNameSwitch === true) {
        if (this.createOtherActivityForm.get('ActivityGroup').dirty) {
          this.isActivityGroupSearchLoading = true;
          this.searchActivityGroupList = []
          this.meetingService.searchActivityGroup(val).subscribe(res => {
            this.isActivityGroupSearchLoading = false;
            if (!res.IsError) {
              this.searchActivityGroupList = res.ResponseObject;
            } else {
              this.errorMessage.throwError(res.Message)
              this.searchActivityGroupList = []
            }
          }, error => {
            this.isActivityGroupSearchLoading = false;
            this.searchActivityGroupList = []
          })
        } else if (val === "") {
          this.createOtherActivityForm.patchValue({
            AccountName: "",
          })
          this.selectedlead = [];
          this.selectedopportunity = [];
          this.sendSelectedAccountSysGuid = undefined;
        }
      }
    }
    })
    this.createOtherActivityForm.get('Participants').valueChanges.subscribe(val => {
      if (this.createOtherActivityForm.get('Participants').dirty && this.contactconversationtagSwitch) {
        this.isParticipantsSearchLoading = true;
        this.participants = []
        this.newconversationService.searchUser(val).subscribe(res => {
          this.isParticipantsSearchLoading = false;
          if (!res.IsError) {
            this.participants = res.ResponseObject;
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
            this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          } else {
            this.errorMessage.throwError(res.Message);
            this.participants = []
          }
        }, error => {
          this.isParticipantsSearchLoading = false;
          this.participants = []
        })
      }
      if (val == "") {
        if (this.cacheDataService.cacheDataGet('wiproParticipants').length > 0) {
          this.participants = this.cacheDataService.cacheDataGet('wiproParticipants');
          this.isParticipantsSearchLoading = false;
        }
      }
    })
    this.createOtherActivityForm.get('Linkedleads').valueChanges.subscribe(val => {
      if (this.createOtherActivityForm.get('Linkedleads').dirty && this.contactleadSwitch) {
        this.isLinkedLeadsSearchLoading = true;
        this.linkedLeads = []
        this.meetingService.SearchLeadBasedOnAccount(this.sendSelectedAccountSysGuid, val, this.accountDetails.isProspect).subscribe(res => {
          this.isLinkedLeadsSearchLoading = false;
          if (!res.IsError) {
            this.linkedLeads = res.ResponseObject;
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
            this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          } else {
            this.errorMessage.throwError(res.Message);
            this.linkedLeads = []
          }
        }, error => {
          this.isLinkedLeadsSearchLoading = false;
          this.linkedLeads = []
        })
      }
      if (val == "") {
        if (this.cacheDataService.cacheDataGet('linkedLeads').length > 0) {
          this.linkedLeads = this.cacheDataService.cacheDataGet('linkedLeads')
          this.isLinkedLeadsSearchLoading = false;
        }
      }
    })
    this.createOtherActivityForm.get('LinkedOpportunity').valueChanges.subscribe(val => {
      if (this.createOtherActivityForm.get('LinkedOpportunity').dirty && this.contactopportunitySwitch) {
        this.isLinkedOpportunitiesSearchLoading = true;
        this.linkedOpportunity = []
        this.meetingService.SearchOrderAndOppBasedOnAccount(this.sendSelectedAccountSysGuid, val, this.accountDetails.isProspect).subscribe(res => {
          this.isLinkedOpportunitiesSearchLoading = false;
          if (res.IsError === false) {
            this.linkedOpportunity = res.ResponseObject;
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
            this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          } else {
            this.errorMessage.throwError(res.Message);
            this.linkedOpportunity = []
          }
        }, error => {
          this.isLinkedOpportunitiesSearchLoading = false;
          this.linkedOpportunity = []
        })
      }
      if (val == "") {
        if (this.cacheDataService.cacheDataGet('linkedOpportunitiesOrder').length > 0) {
          this.linkedOpportunity = this.cacheDataService.cacheDataGet('linkedOpportunitiesOrder');
          this.isLinkedOpportunitiesSearchLoading = false;
        }
      }
    });
    this.createOtherActivityForm.get('LinkedMarketing').valueChanges.subscribe(val => {
      if (this.createOtherActivityForm.get('LinkedMarketing').dirty && this.contactleadSwitchcamp) {
        this.isLinkedMarketingTrainingSearchLoading = true;
        this.linkedMarketing = []
        this.syncActivity.searchMarketingTraining(val).subscribe(res => {
          this.isLinkedMarketingTrainingSearchLoading = false;
          if (res.IsError === false) {
            this.linkedMarketing = res.ResponseObject;
            console.log("linked marketing", this.linkedMarketing)
          } else {
            this.errorMessage.throwError(res.Message);
            this.linkedMarketing = []
          }
        }, error => {
          this.isLinkedMarketingTrainingSearchLoading = false;
          this.linkedMarketing = []
        })
      }
      if (val == "") {
        if (this.cacheDataService.cacheDataGet('linkedMarketingTraining').length > 0) {
          this.linkedMarketing = this.cacheDataService.cacheDataGet('linkedMarketingTraining')
          this.isLinkedMarketingTrainingSearchLoading = false;
        }
      }
    });
  }
  sendFinalStartDate: any;
  sendFinalEndDate: any;
  dateConverterValues(srartDateValue, endDateValue) {
    var finalStartDate = moment(srartDateValue).local().format();
    var finalEndDate = moment(endDateValue).local().format();
    // var finalStartDate = this.service.dateModifier(srartDateValue);
    // var finalEndDate = this.service.dateModifier(endDateValue);
    this.startChangeDateSelected = finalStartDate;
    this.endChangeDateSelected = finalEndDate;
    this.sendFinalStartDate = srartDateValue;
    this.sendFinalEndDate = endDateValue;
    var date1 = new Date(finalEndDate)
    var date2 = new Date(finalStartDate)
    var difference = Math.abs(date1.getTime() - date2.getTime()) / 1000;
    var diffSeconds = Math.floor(difference) % 60 < 10 ? "0" + Math.floor(difference) % 60 : Math.floor(difference) % 60;
    var diffMinutes = Math.floor(difference / 60) % 60 < 10 ? "0" + Math.floor(difference / 60) % 60 : Math.floor(difference / 60) % 60;
    var diffHours = Math.floor(difference / 3600) % 24 < 10 ? "0" + Math.floor(difference / 3600) % 24 : Math.floor(difference / 3600) % 24;
    var diffDays = Math.floor(difference / 86400) < 10 ? "0" + Math.floor(difference / 86400) : Math.floor(difference / 86400);
    
    this.durationToBind = this.service.getDuration(diffDays,diffHours,diffMinutes)
    if (this.durationToBind == '') {
      this.durationToBind = "00"
    }
    //converting days hours and minutes ends
    //converting total minutes to days hours and minutes starts
    var today = new Date(finalStartDate);
    var Christmas = new Date(finalEndDate);
    var diffMs = (Christmas.getTime() - today.getTime()) / 1000;
    diffMs /= 60;
    var minutesese = Math.abs(Math.round(diffMs));
    var minToDays = Math.floor(minutesese / 1440);
    var minToHours = Math.floor((minutesese % 1440) / 60);
    var minToMins = Math.floor(minutesese % 60)
    //converting total minutes to days hours and minutes ends
    debugger;
    this.totalMinutesToSend = minutesese;
  }
  dateLessThan(from: string, to: string, startT: string, endT: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let startDate = group.controls[from];
      let enDate = group.controls[to];
      let starTime = group.controls[startT];
      let endTime = group.controls[endT];
      if (startDate.value != '' && enDate.value != '' && starTime.value != '' && endTime.value != '') {
        let srartDateValue = this.service.mergeDateTimeModifier(startDate.value, starTime.value);
        let endDateValue = this.service.mergeDateTimeModifier(enDate.value, endTime.value);
        this.dateConverterValues(srartDateValue, endDateValue)
        if (new Date(srartDateValue).getTime() > new Date(endDateValue).getTime()) {
          this.durationToBind = "00";
          return { 'endDate': 'End date time should be greater than start date time' }
        }
      }
    }
  }
  focusOutFunctionForStartDate(event) {
    this.createOtherActivityForm.patchValue({ Duration: this.durationToBind })
  }
  focusOutFunctionForEndDate(event) {
    this.createOtherActivityForm.patchValue({ Duration: this.durationToBind })
  }
  focusOutFunctionForStartTime(event) {
    this.createOtherActivityForm.patchValue({ Duration: this.durationToBind })
  }
  focusOutFunctionForEndTime(event) {
    this.createOtherActivityForm.patchValue({ Duration: this.durationToBind })
  }
  ngOnChanges() {
    this.createOtherActivityForm.patchValue({ Duration: this.durationToBind })
  }
  detailListShowPage() {
    this.isLoading = true;
    var id = JSON.parse(sessionStorage.getItem("OtherDetailsEditPage"));
    this.OthersListService.getOtherActivityDetails(id.Id).subscribe(res => {
      this.isLoading = false;
      if (!res.IsError) {
        console.log("other details", JSON.stringify(res.ResponseObject))
        this.bindDetailLists = res.ResponseObject;
        this.selectedContact = res.ResponseObject.ActivityGroup.Guid;
        this.contactName = res.ResponseObject.ActivityGroup.Name;
        this.startChangeDateSelected = res.ResponseObject.ScheduleStart;
        this.endChangeDateSelected = res.ResponseObject.EndDate;
        this.accountDetails = { Name: decodeURIComponent(res.ResponseObject.Account.Name), SysGuid: res.ResponseObject.Account.SysGuid, isProspect: res.ResponseObject.isProspect }
        if (this.bindDetailLists.Lead.length > 0) {
          this.bindDetailLists.Lead.forEach(element => {
            let myObj1 = { "Title": element.Title, "LeadGuid": element.LeadGuid, "MapGuid": element.MapGuid, "isExists": true, "LinkActionType": element.LinkActionType, Id: element.LeadGuid }
            let myObj = { "LeadGuid": element.LeadGuid, "MapGuid": element.MapGuid, "isExists": true, "LinkActionType": element.LinkActionType }
            this.selectedlead.push(myObj1)
            this.sendSelectedLeadGuid.push(myObj)
          });
        } else {
          this.selectedlead = [];
        }
        if (this.bindDetailLists.OpportunitiesOrOrders.length > 0) {
          this.bindDetailLists.OpportunitiesOrOrders.forEach(element => {
            let myObj1 = { "Title": element.Name, "SysGuid": element.SysGuid, "MapGuid": element.MapGuid, "isExists": true, "Type": element.Type, "LinkActionType": element.LinkActionType, Id: element.SysGuid }
            let myObj = { "SysGuid": element.SysGuid, "MapGuid": element.MapGuid, "isExists": true, "Type": element.Type, "LinkActionType": element.LinkActionType }
            this.selectedopportunity.push(myObj1)
            this.sendSelectedOpporGuid.push(myObj)
          });
        } else {
          this.selectedopportunity = [];
        }
        if (this.bindDetailLists.WiproParticipant.length > 0) {
          this.bindDetailLists.WiproParticipant.forEach(element => {
            let myObj1 = { "FullName": element.FullName, "SysGuid": element.SysGuid, "MapGuid": element.MapGuid, "isExists": true, "LinkActionType": element.LinkActionType, Id: element.SysGuid }
            let myObj = { "SysGuid": element.SysGuid, "MapGuid": element.MapGuid, "isExists": true, "LinkActionType": element.LinkActionType }
            this.selectedParticipant.push(myObj1)
            this.sendSelectedParticipantSysGuid.push(myObj)
          });
        } else {
          this.selectedParticipant = [];
        }
        if (!this.isEmpty(this.bindDetailLists.MarketingEvent)) {
          if (this.bindDetailLists.MarketingEvent.marketing.length > 0) {
            this.bindDetailLists.MarketingEvent.marketing.forEach(element => {
              let myObj = { "MarketingGuid": element.MarketingGuid, LinkActionType: 2, "MapGuid": element.MapGuid }
              let json = { Name: element.Name, SysGuid: element.MarketingGuid, "MapGuid": element.MapGuid, LinkActionType: 2 }
              this.linkMarketing.push(myObj);
              this.selectedLeadMarketing.push(json)
            })
          }
          if (this.bindDetailLists.MarketingEvent.campaign.length > 0) {
            this.bindDetailLists.MarketingEvent.campaign.forEach(element => {
              let myObj = { "Id": element.Id, LinkActionType: 2, "MapGuid": element.MapGuid }
              let json = { Name: element.Name, SysGuid: element.Id, "MapGuid": element.MapGuid, LinkActionType: 2 }
              this.linkCampaign.push(myObj);
              this.selectedLeadMarketing.push(json)
            })
          }
        }
        if (this.selectedParticipant.length > 0) {
          this.createOtherActivityForm.get('Participants').clearValidators();
          this.createOtherActivityForm.get('Participants').updateValueAndValidity();
        }
        this.dateConverterValues(this.bindDetailLists.ScheduleStart, this.bindDetailLists.EndDate);
        this.sendSelectedAccountSysGuid = this.bindDetailLists.Account.SysGuid;
        this.bindObjects = {
          Name: (this.bindDetailLists.Subject !== undefined) ? this.bindDetailLists.Subject : "NA",
          ActivityGroup: (this.bindDetailLists.ActivityGroup.Name !== undefined) ? this.bindDetailLists.ActivityGroup.Name : "NA",
          ActivityType: (this.bindDetailLists.ActivityGroup.ActivityType.Name !== undefined) ? this.bindDetailLists.ActivityGroup.ActivityType.Name : "NA",
          AccountName: (this.bindDetailLists.Account.Name !== undefined) ? decodeURIComponent(this.bindDetailLists.Account.Name) : "NA",
          Duration: (this.durationToBind === undefined) ? "NA" : this.durationToBind,
          Notes: (this.bindDetailLists.Description !== undefined && this.bindDetailLists.Description !== "") ? this.bindDetailLists.Description : "NA",
          StartDateTime: this.bindDetailLists.ScheduleStart ? this.utcToLocalDate(this.bindDetailLists.ScheduleStart) : "NA",
          startTime: this.bindDetailLists.ScheduleStart ? this.UtcToLocalTime(this.bindDetailLists.ScheduleStart) : "NA",
          EndDateTime: this.bindDetailLists.EndDate ? this.utcToLocalDate(this.bindDetailLists.EndDate) : "NA",
          endTime: this.bindDetailLists.EndDate ? this.UtcToLocalTime(this.bindDetailLists.EndDate) : "NA",
        }
        this.patchDetailsForEdit(res.ResponseObject, this.durationToBind);
      } else {
        this.errorMessage.throwError(res.Message)
      }
    }, error => {
      this.isLoading = false;
    })
  }

  utcToLocalDate(data) {
    return this.datepipe.transform(moment(data).local().format().toString(), 'dd-MMM-y')
  }

  UtcToLocalTime(data) {
    return moment(data).local().format("hh:mm A")
  }

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }
  patchDetailsForEdit(VALUES: any, duration) {
    this.activityTypeValidation(VALUES.ActivityGroup.ActivityType.Id);
    this.accountValidation = VALUES.isUserCanEdit;
    this.otherActivityGroupName = VALUES.Subject;
    let accountName = decodeURIComponent(VALUES.Account.Name)
    this.createOtherActivityForm.patchValue({
      OtherName: VALUES.Subject,
      ActivityGroup: VALUES.ActivityGroup.Name,
      ActivityType: VALUES.ActivityGroup.ActivityType.Id,
      AccountName: accountName,
      Duration: duration,
      StartDate: moment(this.bindDetailLists.ScheduleStart).local().format(),
      startTime: moment(this.bindDetailLists.ScheduleStart).local().format(),
      EndDate: moment(this.bindDetailLists.EndDate).local().format(),
      endTime: moment(this.bindDetailLists.EndDate).local().format(),
      Notes: VALUES.Description,
    })
    this.contactNameSwitch = false;
    this.activitygrpChanged = VALUES.ActivityGroup.Name;
  }
  get f() {
    return this.createOtherActivityForm.controls
  }
  editdetails() {
    this.editpart = true;
    this.noneditpart = false;
    this.saveDisabled = false;
  }
  noneditdetails() {
    this.selectedlead = []; this.selectedopportunity = []; this.selectedParticipant = [];
    this.sendSelectedLeadGuid = []; this.sendSelectedOpporGuid = []; this.sendSelectedParticipantSysGuid = [];
    this.selectedLeadMarketing = [];
    this.detailListShowPage();
    this.noneditpart = true;
    this.editpart = false;
  }
  noneditdetailssave() {
    this.noneditpart = false;
    this.editpart = true;
  }
  /****************** customer contact autocomplete code start ****************** */
  customerNameclose() {
    this.customerNameSwitch = false;
  }
  appendcustomer(value: string, i) {
    this.customerName = value;
    this.selectedCustomer.push(this.customerContact[i])
  }
  /****************** customer contact autocomplete code end ****************** */
  /****************** wipro contact autocomplete code start ****************** */

  contactNameclose() {
    this.contactNameSwitch = false;
    if (this.sendSelectedAccountSysGuid == undefined) {
      this.createOtherActivityForm.patchValue({ ActivityGroup: "" })
    } else {
      this.createOtherActivityForm.patchValue({ ActivityGroup: this.activitygrpChanged })
    }
  }

  appendcontact(item) {
    // this.newconversationService.ValidateAccount(item.Account.SysGuid, item.Account.isProspect, 0).subscribe(res => {
    //   if (res.IsError) {
    //     this.accountValidation = true;
    //     this.sendSelectedAccountSysGuid = undefined;
    //     this.createOtherActivityForm.patchValue({
    //       ActivityGroup: "",
    //       AccountName: "",
    //     })
    //   } else {
    this.accountValidation = false;
    this.activitygrpChanged = item.Name;
    this.createOtherActivityForm.patchValue({
      ActivityGroup: item.Name,
      AccountName: this.service.getSymbol(item.Account.Name)
    })
    this.sendSelectedAccountSysGuid = item.Account.SysGuid
    this.accountDetails = item.Account
    this.contactName = item.Name;
    this.selectedContact = item.Guid;
    this.selectedlead = [];
    this.selectedopportunity = [];
    this.sendSelectedLeadGuid = [];
    this.sendSelectedOpporGuid = [];
    this.selectedLeadMarketing = [];
    // }
    // })
    this.contactNameSwitch = false;
  }

  clearActivityGroup() {
    this.createOtherActivityForm.patchValue({
      ActivityGroup: "",
      AccountName: ""
    });
    this.contactName = '';
    this.selectedContact = '';
    this.activitygrpChanged = '';
    this.sendSelectedAccountSysGuid = '';
    this.accountDetails = '';
    this.createOtherActivityForm.get('ActivityGroup').setValidators([Validators.required])
    this.createOtherActivityForm.get('ActivityGroup').markAsTouched()
    this.createOtherActivityForm.get('ActivityGroup').updateValueAndValidity();
    this.selectedlead = [];
    this.selectedopportunity = [];
    this.sendSelectedLeadGuid = [];
    this.sendSelectedOpporGuid = [];
    this.selectedLeadMarketing = [];
  }
  onClickLinkedLeads() {
    if (this.sendSelectedAccountSysGuid == undefined) {
      this.errorMessage.throwError('Select activity group')
    }
  }
  /****************** wipro contact autocomplete code end ****************** */
  /******************Link leads  autocomplete code start ****************** */
  contactleadclose() {
    this.contactleadSwitch = false;
    if (this.createOtherActivityForm.get('Linkedleads').dirty) {
      this.createOtherActivityForm.controls.Linkedleads.reset()
    }
  }
  appendlead(item, i) {
    if (i > this.linkedLeads.length) {
      this.openadvancetabs('linkedLeads', this.linkedLeads, this.createOtherActivityForm.get('Linkedleads').value)
    } else {
      this.contactlead = item;
      let myObj1 = { "Title": item.Title, "LeadGuid": item.LeadGuid, "MapGuid": "", "isExists": false, "LinkActionType": 1, Id: item.LeadGuid }
      let myObj = { "LeadGuid": item.LeadGuid, "MapGuid": "", "isExists": false, "LinkActionType": 1 }
      this.selectedlead.push(myObj1)
      let beforeLength = this.selectedlead.length;
      this.selectedlead = this.service.removeDuplicates(this.selectedlead, "LeadGuid");
      let afterLength = this.selectedlead.length;
      if (beforeLength === afterLength) {
        console.log(this.selectedlead)
        this.sendSelectedLeadGuid.push(myObj)
      } else {
        this.errorMessage.throwError("Selected linked leads already exists")
      }
      this.createOtherActivityForm.patchValue({ Linkedleads: '' });
      if (this.selectedlead.length > 0 && this.IsLeadreq) {
        this.removeLeadValidators();
      }
    }
    this.contactleadSwitch = false;
  }
  delinkLead(id, i) {
    if (id.MapGuid !== "") {
      this.selectedlead = this.selectedlead.filter(res => res.MapGuid !== id.MapGuid)
      let index = this.sendSelectedLeadGuid.findIndex(k => k.MapGuid === id.MapGuid)
      this.sendSelectedLeadGuid[index].LinkActionType = 3;
      console.log("lead", this.selectedlead, this.sendSelectedLeadGuid)
      if (this.selectedlead.length == 0 && this.IsLeadreq) {
        this.setLeadValidators()
      }
      return;
    } else {
      this.selectedlead = this.selectedlead.filter(res => res.LeadGuid !== id.LeadGuid)
      this.sendSelectedLeadGuid = this.sendSelectedLeadGuid.filter(res => res.LeadGuid !== id.LeadGuid)
      console.log("lead", this.selectedlead, this.sendSelectedLeadGuid)
      if (this.selectedlead.length == 0 && this.IsLeadreq) {
        this.setLeadValidators()
      }
      return;
    }
  }
  /****************** Link leads  autocomplete code end ****************** */
  /******************Link campaign  autocomplete code start ****************** */
  contactleadclosecamp() {
    this.contactleadSwitchcamp = false;
    if (this.createOtherActivityForm.get('LinkedMarketing').dirty) {
      this.createOtherActivityForm.patchValue({ LinkedMarketing: "" })
    }
  }

  appendleadcamp(item, i) {
    this.selectedLeadMarketing.push(item);
    let beforeLength = this.selectedLeadMarketing.length;
    this.selectedLeadMarketing = this.service.removeDuplicates(this.selectedLeadMarketing, "SysGuid");
    let afterLength = this.selectedLeadMarketing.length;
    if (beforeLength === afterLength) {
      if (item.Type === "Campaign") {
        let campaign = { "Id": item.SysGuid, LinkActionType: 1 };
        this.linkCampaign.push(campaign);
      } else if (item.Type === "Marketing") {
        let marketing = { "MarketingGuid": item.SysGuid, LinkActionType: 1 };
        this.linkMarketing.push(marketing);
      }
    } else {
      this.errorMessage.throwError("Selected linked marketing already exists")
    }
    this.contactleadSwitchcamp = false;
    this.createOtherActivityForm.patchValue({ LinkedMarketing: "" })
  }

  dlinkLadMarketing(id) {
    if (id.MapGuid !== "") {
      this.selectedLeadMarketing = this.selectedLeadMarketing.filter(res => res.MapGuid !== id.MapGuid);
      if (this.linkCampaign.length > 0) {
        let campIndex = this.linkCampaign.findIndex(k => k.MapGuid === id.MapGuid)
        this.linkCampaign[campIndex].LinkActionType = 3;
      }
      if (this.linkMarketing.length > 0) {
        let markIndex = this.linkMarketing.findIndex(k => k.MapGuid === id.MapGuid)
        this.linkMarketing[markIndex].LinkActionType = 3;
      }
      console.log(this.linkCampaign, this.linkMarketing)
      return;
    } else {
      this.selectedLeadMarketing = this.selectedLeadMarketing.filter(res => res.SysGuid !== id.SysGuid);
      this.linkCampaign = this.linkCampaign.filter(res => res.Id !== id.SysGuid);
      this.linkMarketing = this.linkMarketing.filter(res => res.MarketingGuid !== id.SysGuid);
      return;
    }
  }
  /****************** Link campaign  autocomplete code end ****************** */
  /******************Link opportunity  autocomplete code start ****************** */
  contactopportunityclose() {
    this.contactopportunitySwitch = false;
    if (this.createOtherActivityForm.get('LinkedOpportunity').dirty) {
      this.createOtherActivityForm.patchValue({ LinkedOpportunity: '' })
    }
  }
  appendopportunity(item, i) {
    if (i > this.linkedOpportunity.length) {
      this.openadvancetabs('linkedOpportunityOrder', this.linkedOpportunity, this.createOtherActivityForm.get('LinkedOpportunity').value)
    } else {
      this.contactopportunity = item;
      let myObj1 = { "Title": item.Title, "SysGuid": item.Guid, "MapGuid": "", "isExists": false, "Type": item.Type, "LinkActionType": 1, Id: item.Guid }
      let myObj = { "SysGuid": item.Guid, "MapGuid": "", "isExists": false, "Type": item.Type, "LinkActionType": 1 }
      this.selectedopportunity.push(myObj1)
      let beforeLength = this.selectedopportunity.length;
      this.selectedopportunity = this.service.removeDuplicates(this.selectedopportunity, "SysGuid");
      let afterLength = this.selectedopportunity.length;
      if (beforeLength === afterLength) {
        this.sendSelectedOpporGuid.push(myObj)
      } else {
        this.errorMessage.throwError("Selected linked opportunity already exists")
      }
      this.createOtherActivityForm.patchValue({ LinkedOpportunity: '' })
      if (this.selectedopportunity.length > 0 && this.IsOpporeq) {
        this.removeOppoValidators();
      }
    }
    this.contactopportunitySwitch = false;
  }
  delinkOpportunity(id, i) {
    console.log(id, this.selectedopportunity)
    if (id.MapGuid !== "") {
      debugger
      this.selectedopportunity = this.selectedopportunity.filter(res => res.MapGuid !== id.MapGuid)
      let index = this.sendSelectedOpporGuid.findIndex(k => k.MapGuid === id.MapGuid)
      this.sendSelectedOpporGuid[index].LinkActionType = 3
      console.log("oppr", this.sendSelectedOpporGuid, this.selectedopportunity)
      if (this.selectedopportunity.length == 0 && this.IsOpporeq) {
        this.setOppoValidators();
      }
      return;
    } else {
      this.selectedopportunity = this.selectedopportunity.filter(res => res.SysGuid !== id.SysGuid)
      this.sendSelectedOpporGuid = this.sendSelectedOpporGuid.filter(res => res.SysGuid !== id.SysGuid)
      console.log("oppr", this.sendSelectedOpporGuid, this.selectedopportunity)
      if (this.selectedopportunity.length == 0 && this.IsOpporeq) {
        this.setOppoValidators();
      }
      return;
    }
  }
  /****************** Link opportunity  autocomplete code end ****************** */
  /******************account  autocomplete code start ****************** */
  contactaccountclose() {
    this.contactaccountSwitch = false;
  }
  appendaccount(value: string, i) {
    this.contactaccount = value;
    this.selectedaccount.push(this.accountContact[i])
  }
  /****************** Account name  autocomplete code end ****************** */
  /****************** Tag contacts to view conversation autocomplete code start ****************** */
  contactconversationtagclose() {
    this.contactconversationtagSwitch = false;
    if (this.createOtherActivityForm.get('Participants').dirty) {
      this.createOtherActivityForm.patchValue({ Participants: '' })
    }
  }
  appendconversationtag(item, i) {
    if (i > this.participants.length) {
      this.openadvancetabs('participants', this.participants, this.createOtherActivityForm.get('Participants').value)
    } else {
      let myObj = { "SysGuid": item.SysGuid, "MapGuid": "", "isExists": false, "LinkActionType": 1 }
      let myObj1 = { "FullName": item.FullName, "SysGuid": item.SysGuid, "MapGuid": "", "isExists": false, "LinkActionType": 1, Id: item.SysGuid }
      this.selectedParticipant.push(myObj1)
      this.hideIf = false;
      this.contactconversationtag = item.FullName;
      let beforeLength = this.selectedParticipant.length;
      this.selectedParticipant = this.service.removeDuplicates(this.selectedParticipant, "SysGuid");
      let afterLength = this.selectedParticipant.length;
      if (beforeLength === afterLength) {
        this.sendSelectedParticipantSysGuid.push(myObj)
      } else {
        this.errorMessage.throwError("Selected participant already exists")
      }
      if (this.selectedParticipant.length > 0) {
        this.createOtherActivityForm.get('Participants').clearValidators();
        this.createOtherActivityForm.get('Participants').updateValueAndValidity();
      }
      this.createOtherActivityForm.patchValue({ Participants: '' })
    }
    this.contactconversationtagSwitch = false;
  }
  delinkWiproParticipant(id, i) {
    console.log(id, this.selectedParticipant)
    if (id.MapGuid === "") {
      this.selectedParticipant = this.selectedParticipant.filter(res => res.SysGuid !== id.SysGuid)
      this.sendSelectedParticipantSysGuid = this.sendSelectedParticipantSysGuid.filter(res => res.SysGuid !== id.SysGuid)
      if (this.selectedParticipant.length == 0) {
        this.createOtherActivityForm.get('Participants').setValidators([Validators.required])
        this.createOtherActivityForm.get('Participants').markAsTouched()
        this.createOtherActivityForm.get('Participants').updateValueAndValidity()
      }
      return;
    }
    if (id.MapGuid !== "") {
      this.selectedParticipant = this.selectedParticipant.filter(res => res.SysGuid !== id.SysGuid)
      let index = this.sendSelectedParticipantSysGuid.findIndex(k => k.MapGuid === id.MapGuid)
      this.sendSelectedParticipantSysGuid[index].LinkActionType = 3
      if (this.selectedParticipant.length == 0) {
        this.createOtherActivityForm.get('Participants').setValidators([Validators.required])
        this.createOtherActivityForm.get('Participants').markAsTouched()
        this.createOtherActivityForm.get('Participants').updateValueAndValidity()
      }
      return;
    }
  }
  /****************** Tag contacts to view conversation autocomplete code end ****************** */
  navTo() {
    this.router.navigate(['/activities/activitiesthread/othersList'])
  }
  Save() {
    if (this.otherActivityGroupName.trim() === '') {
      this.createOtherActivityForm.patchValue({ OtherName: '' });
      this.createOtherActivityForm.controls['OtherName'].setValidators(Validators.required);
      this.createOtherActivityForm.controls['OtherName'].markAsTouched();
      this.createOtherActivityForm.controls['OtherName'].updateValueAndValidity();
    }
    if (this.createOtherActivityForm.valid === false) {
      this.service.validateAllFormFields(this.createOtherActivityForm)
      this.saveDisabled = false;
    }
    if (this.sendSelectedParticipantSysGuid.length === 0) {
      this.hideIf = true;
      this.participantMessage = "Select participants";
    } else {
      this.participantMessage = null;
      this.hideIf = false;
    }
    if (this.createOtherActivityForm.valid === true && this.sendSelectedParticipantSysGuid.length > 0 && this.isDateValidationTrue === false && this.createOtherActivityForm.get('OtherName').errors == null) {
      var objectValue = {
        "Guid": this.bindDetailLists.Guid,
        "Name": this.otherActivityGroupName.trim(),
        "Owner": { "AdId": "PA32258T" },
        "Duration": this.totalMinutesToSend.toString(),
        "ScheduleStart": this.UtcConversation((this.sendFinalStartDate).toString()),
        "Description": this.createOtherActivityForm.value.Notes,
        "Account": this.accountDetails,
        "Potential": { "SysGuid": "" },
        "Conversation": { "Type": "" },
        "EndDate":this.UtcConversation((this.sendFinalEndDate).toString()),
        "MOM": "",
        "MeetingType": { "Id": Number(this.createOtherActivityForm.value.ActivityType) },
        "ActivityGroup": (this.selectedContact !== '') ? { "Guid": this.selectedContact } : "",
        "Lead": (this.sendSelectedLeadGuid.length > 0) ? this.sendSelectedLeadGuid : [],
        "OpportunitiesOrOrders": (this.sendSelectedOpporGuid.length > 0) ? this.sendSelectedOpporGuid : [],
        "Marketing": [{ "SysGuid": "" }],
        "MarketingEvent": { "marketing": (this.linkMarketing.length > 0) ? this.linkMarketing : [], "campaign": (this.linkCampaign.length > 0) ? this.linkCampaign : [] },
        "Participant": (this.sendSelectedParticipantSysGuid.length > 0) ? this.sendSelectedParticipantSysGuid : []
      }
      this.saveDisabled = true;
      this.isLoading = true;
      this.OthersListService.EditOtherActivity(objectValue).subscribe(res => {
        this.isLoading = false;
        if (!res.IsError) {
          this.saveDisabled = true;
          let InsertAction = {
            parentId: this.parentId,
            id: this.bindDetailLists.Guid,
            data: res.ResponseObject
          }
          this.store.dispatch(new EditOtherActivity({ EditOther: InsertAction }))
          this.store.dispatch(new ClearOtherListdata({ clearotherlist: this.ActivityId }))
          this.store.dispatch(new ClearActivityDetails());
          this.store.dispatch(new ClearActivity());
          let id = this.encrdecr.set("EncryptionEncryptionEncryptionEn", this.selectedContact, "DecryptionDecrip");
          sessionStorage.setItem("ActivityListRowId", JSON.stringify(id));
          sessionStorage.setItem("ActivityGroupName", this.contactName);
          let json1 = {
            Guid: res.ResponseObject.ActivityGroup.Guid,
            Name: res.ResponseObject.ActivityGroup.Name,
            Account: {
              Name: res.ResponseObject.Account.Name,
              SysGuid: res.ResponseObject.Account.SysGuid,
              isProspect: res.ResponseObject.Account.isProspect
            },
          }
          localStorage.setItem("forMeetingCreation", JSON.stringify(json1));
          this.newconversationService.setActivityGroupName(this.contactName);
          this.errorMessage.throwError(res.Message)
          this.selectedlead = []; this.selectedopportunity = []; this.selectedParticipant = [];
          this.sendSelectedLeadGuid = []; this.sendSelectedOpporGuid = []; this.sendSelectedParticipantSysGuid = [];
          this.selectedLeadMarketing = [];
          this.resetCacheData();
          this.detailListShowPage();
          this.noneditpart = true;
          this.editpart = false;
        } else {
          this.saveDisabled = false;
          this.errorMessage.throwError(res.Message)
        }
      }, error => {
        this.isLoading = false;
        this.saveDisabled = false;
      });
    } else {
      this.service.validateAllFormFields(this.createOtherActivityForm)
      let invalidElements = this.el.nativeElement.querySelectorAll('#validatescroll .ng-invalid');
      if (invalidElements.length) {
        this.scrollTo(invalidElements[0]);
        this.service.validationErrorMessage();
      }
      return;
    }
  }

  UtcConversation(data) {
    return moment( data.split(':00')[0], "YYYY-MM-DDTHH:mm:mm").utc()
  }

  opengenricpopup(status) {
    if (status == "leads") {
      const dialogRef = this.dialog.open(genericpopupcomponentother, {
        width: '396px',
        data:
        {
          'allData': this.bindDetailLists,
          'wholeobj': this.bindDetailLists.Lead,
          'Header': 'Linked leads'
        }
      });
    }
    if (status == "opp") {
      const dialogRef = this.dialog.open(genericpopupcomponentother, {
        width: '396px',
        data:
        {
          'allData': this.bindDetailLists,
          'wholeobj': this.bindDetailLists.OpportunitiesOrOrders,
          'Header': 'Linked opportunities/order'
        }
      });
    }
    if (status == 'marketing') {
      const dialogRef = this.dialog.open(genericpopupcomponentother, {
        width: '396px',
        data:
        {
          'allData': this.bindDetailLists,
          'wholeobj': this.selectedLeadMarketing,
          'Header': 'Linked opportunities/order'
        }
      });
    }
  }
  opencancelpop(): void {
    const dialogRef = this.dialog.open(cancelpopotherComponent1, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.OK == true) {
        this.noneditdetails();
      } else {
      }
    })
  }
}
@Component({
  selector: 'generic-popup',
  templateUrl: './generic-popup.html',
})
export class genericpopupcomponentother implements OnInit {
  Name: string;
  Data: any;
  Header: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }
  ngOnInit() {
    this.Name = this.data.allData.Subject
    this.Data = this.data.wholeobj
    this.Header = this.data.Header;
    console.log('linked pop up', this.data)
  }
}
@Component({
  selector: 'app-cancel-pop',
  templateUrl: './cancel-pop-other.html',
  styleUrls: ['./other-details.component.scss']

})
export class cancelpopotherComponent1 {
  constructor(public dialog: MatDialogRef<cancelpopotherComponent1>, private cacheDataService: CacheDataService) { }
  nav() {

    this.dialog.close({ OK: false })
  }
  navTo() {
    this.cacheDataService.cacheDataMultiReset(['activityGroup', 'wiproParticipants', 'linkedLeads', 'linkedOpportunitiesOrder', 'linkedMarketingTraining'])
    this.dialog.close({ OK: true })
  }
}
