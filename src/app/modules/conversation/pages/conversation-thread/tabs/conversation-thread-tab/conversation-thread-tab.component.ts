import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConversationService } from '@app/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { DataCommunicationService, threadListService, OnlineOfflineService, ErrorMessage } from '@app/core/services';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { newConversationService } from '@app/core/services/new-conversation.service';
import { LoadMeetingsByParentId, MarkMeetingsFavorite, ClearMeetingList, ClearMeetingDetails } from '@app/core/state/actions/activities.actions';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { getMeetingListByParentIdActivity } from '@app/core/state/selectors/activity/activity.selector';
import { RoutingState } from '@app/core/services/navigation.service';
import { MeetingService } from '@app/core/services/meeting.service';
import { NewMeetingService } from '@app/core/services/new-meeting.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation-thread-tab.component.html',
  styleUrls: ['./conversation-thread-tab.component.scss']
})

export class childList implements OnInit, OnDestroy {

  isLoading: boolean = false;
  getMeetingListSub$: Subscription
  ActivityGuid: any
  id: any;
  parentId: any;
  sysGuidId: any;
  childConversationTable = [];
  name: any;
  tableTotalCount: number = 0
  ParentActivityId: any = []
  filterConfigData = {
    Agenda: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    MeetingType: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    AccountName: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    CustomerContacts: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    WiproAttendees: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    DateCreated: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Leadslinked: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    OppLinked: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    isFilterLoading: false
  };
  ActivityMeetingReqBody = {
    Guid: "",
    PageSize: 50,
    Conversation_Guid: "",
    RequestedPageNumber: 1,
    OdatanextLink: ""
  };
  meetingCollection = [];
  archived: any;
  status: boolean;
  allBtnsLable = ['favouriteBtnVisibility', 'unfavouriteBtnVisibility'];
  Orinator: any;
  userId: any;
  OriginatorDetails: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private encrDecrService: EncrDecrService,
    private conversationService: ConversationService,
    private service: DataCommunicationService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private store: Store<AppState>,
    private threadListService: threadListService,
    private onlineOfflineService: OnlineOfflineService,
    public routingState: RoutingState,
    public errorService: ErrorMessage,
    private newconversationService: newConversationService,
    private meetingService: MeetingService,
    private newMeetingService: NewMeetingService) { }

  async ngOnInit() {
    this.id = sessionStorage.getItem("ActivityListRowId")
    this.id = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', JSON.parse(this.id), 'DecryptionDecrip');
    this.Orinator = localStorage.getItem('upn')
    console.log("decrypted", this.id);
    this.ActivityGuid = this.id
    this.ActivityMeetingReqBody.Guid = this.ActivityGuid
    this.sysGuidId = this.id;
    this.name = this.route.snapshot.parent.paramMap.get('name');
    this.conversationService.conversationName = this.name;
    sessionStorage.setItem('conversationName', this.name);
    this.conversationService.sendConvToCampaignData = this.name
    this.conversationService.getThreadTrue = true;
    this.conversationService.conversationTrues = false;
    this.isLoading = true
    this.status = true
    if (sessionStorage.getItem('archivedStatus')) {
      this.archived = JSON.parse(sessionStorage.getItem('archivedStatus'))
      this.service.archiveTag = this.archived
    }
    //offline 
    if (!this.onlineOfflineService.isOnline) {
      const CacheResponse = await this.threadListService.getCacheActivityMeetingListById(this.ActivityMeetingReqBody.Guid)
      // console.log("got the dresomnse form offloine servoe!!@!@%%%%%%%%%%%%%%%%%")
      // console.log(CacheResponse)
      if (CacheResponse) {
        if (CacheResponse.data.length > 0) {
          this.isLoading = false
          this.meetingCollection = this.filterTableData(CacheResponse.data)
          this.tableTotalCount = CacheResponse.count
          this.ActivityMeetingReqBody.OdatanextLink = CacheResponse.nextlink
        }
      } else {
        this.isLoading = true
        this.getActivityMeetingsListById(this.ActivityMeetingReqBody, true, false);
      }
    }

    this.getMeetingListSub$ = this.store.pipe(select(getMeetingListByParentIdActivity(this.ActivityMeetingReqBody.Guid))).subscribe(res => {
      console.log(res)
      this.isLoading = false;
      if (res) {
        if (res.list) {
          if (res.list.data.length > 0) {
            this.ParentActivityId = res.parentId

            this.meetingCollection = this.filterTableData(res.list.data)
            this.ActivityMeetingReqBody.OdatanextLink = res.list.nextlink
            this.tableTotalCount = res.list.count
          } else {
            this.isLoading = true
            this.getActivityMeetingsListById(this.ActivityMeetingReqBody, true, false);
          }
        } else {
          this.isLoading = true
          this.getActivityMeetingsListById(this.ActivityMeetingReqBody, true, false);
        }
      } else {
        this.isLoading = true
        this.getActivityMeetingsListById(this.ActivityMeetingReqBody, true, false);
      }
    })
  }

  performTableChildAction(childActionRecieved) {
    console.log(childActionRecieved)
    if (childActionRecieved) {
      (childActionRecieved.parentData) ? this.tableTotalCount = childActionRecieved.parentData.totalCount : this.tableTotalCount = this.tableTotalCount
    }
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {
      case 'share': {
        sessionStorage.setItem('tableName', JSON.stringify("childs"));
        sessionStorage.setItem('shareConversation', JSON.stringify({ ...actionRequired.objectRowData[0], navigation: this.router.url }));
        this.router.navigateByUrl('/activities/sharemeeting');
        break;
      }
      case 'convertOpportunity': {
        this.Createopp(childActionRecieved)
        console.log('opportunity', childActionRecieved)
        break;
      }
      case 'Agenda': {
        this.Navigate(childActionRecieved, "Agenda")
        sessionStorage.setItem('shareConversation', JSON.stringify({ ...actionRequired.objectRowData[0], navigation: this.router.url,detailChild: true}));
        sessionStorage.setItem('navigationfromMeeting', JSON.stringify(4))
        break;
      }
      case 'search': {
        this.SearchTable(childActionRecieved)
        break;
      }
      case 'createLead': {
        console.log('childActionReceived-->', childActionRecieved)
        let LeadData = childActionRecieved.objectRowData[0]
        console.log('LeadData', childActionRecieved.objectRowData[0])
        sessionStorage.setItem('TempLeadDetails', JSON.stringify(this.createLeadTempDetails(childActionRecieved.objectRowData[0])))
        this.router.navigateByUrl("/leads/createlead")
        break;
      }
      case 'favorite': {
        if (childActionRecieved.objectRowData.length === 1) {
          this.FavAction(childActionRecieved)
        } else {
          this.MultiFavAction(childActionRecieved)
        }
        break;
      }
      case 'unfavorite': {
        if (childActionRecieved.objectRowData.length === 1) {
          this.FavAction(childActionRecieved)
        } else {
          this.MultiFavAction(childActionRecieved)
        }
        break;
      }
      case "columnFilter": {
        this.GetColumnFilters(childActionRecieved);
        break;
      }
      case "columnSearchFilter": {
        this.GetColumnSearchFilters(childActionRecieved);
        break;
      }
      case 'loadMoreFilterData': {
        this.LoadMoreColumnFilter(childActionRecieved);
        break;
      }
      case 'ClearAllFilter': {
        this.clearallFilter();
        return;
      }
      case 'sortHeaderBy': {
        this.ActivityMeetingReqBody.OdatanextLink = ''
        this.ActivityMeetingReqBody.RequestedPageNumber = 1
        this.CallListDataWithFilters(childActionRecieved);
        break;
      }
    }
  }

  clearallFilter(){
    this.getActivityMeetingsListById(this.ActivityMeetingReqBody, false, false)
  }

  GetColumnFilters(data) {
    if (data.filterData) {
      if (!data.filterData.isApplyFilter) {
        let headerName = data.filterData.headerName;
        this.filterConfigData[headerName].data = [];
        this.filterConfigData[headerName].PageNo = 1
        this.filterConfigData[headerName].NextLink = ''
        this.generateFilterConfigData(data, headerName, false, this.CheckFilterServiceFlag(data, headerName))
      } else {
        if (data.filterData.isApplyFilter && this.service.CheckFilterFlag(data)) {
          this.ActivityMeetingReqBody.OdatanextLink = ''
          this.ActivityMeetingReqBody.RequestedPageNumber = 1
          this.CallListDataWithFilters(data)
        } else if (data.filterData.isApplyFilter && data.filterData.globalSearch != ""){
          this.CallListDataWithFilters(data)
        } else {
          this.store.dispatch(new ClearMeetingList({ cleardetails: this.ActivityMeetingReqBody.Guid }))
          this.ActivityMeetingReqBody.OdatanextLink = ''
          this.ActivityMeetingReqBody.RequestedPageNumber = 1
          this.getActivityMeetingsListById(this.ActivityMeetingReqBody, true, false);
        }
      }
    }
  }

  GetColumnSearchFilters(data) {
    let headerName = data.filterData.headerName
    this.ActivityMeetingReqBody.OdatanextLink = ''
    this.filterConfigData[headerName].PageNo = 1
    this.filterConfigData[headerName].NextLink = ''
    this.generateFilterConfigData(data, headerName, false, true)
  }

  LoadMoreColumnFilter(data) {
    let headerName = data.filterData.headerName;
    this.filterConfigData[headerName].PageNo = this.filterConfigData[headerName].PageNo + 1;
    this.generateFilterConfigData(data, headerName, true, true);
  }

  generateFilterConfigData(data, headerName, isConcat, isServiceCall?) {
    if (isServiceCall) {
      let useFulldata = {
        headerName: headerName,
        searchVal: data.filterData.columnSerachKey,
        pageNo: this.filterConfigData[headerName].PageNo,
        pageSize: 10,
        parentId: this.ParentActivityId,
        nextLink: this.filterConfigData[headerName].NextLink,
        id: this.id,
      }
      this.threadListService.getMeetingListConfigData({ ...data, ActivityGuid: this.ParentActivityId, useFulldata: useFulldata }).subscribe(res => {
        this.filterConfigData.isFilterLoading = false;
        if (!res.IsError) {  
          this.filterConfigData[headerName] = {
            data: (isConcat) ? this.filterConfigData[headerName]["data"].concat(res.ResponseObject) : res.ResponseObject,
            recordCount: res.TotalRecordCount,
            NextLink: res.OdatanextLink,
            PageNo: res.CurrentPageNumber
          }
          //display the selected value in filter list
          console.log(data.filterData.headerName)
          if ( data.filterData.headerName !== "DateCreated")  {
            data.filterData.filterColumn[headerName].forEach(res => {
              let index = this.filterConfigData[headerName].data.findIndex(x => x.id == res.id)
              if (index !== -1) {
                this.filterConfigData[headerName].data[index].isDatafiltered = true
              }
            });
          }
         
        } else {
          if (this.filterConfigData[headerName].PageNo > 1) {
            this.filterConfigData[headerName].PageNo = Number(this.filterConfigData[headerName].PageNo) - 1;
          }
          this.errorService.throwError(res.Message)
        }
      },error =>{
        if (this.filterConfigData[headerName].PageNo > 1) {
          this.filterConfigData[headerName].PageNo = Number(this.filterConfigData[headerName].PageNo) - 1;
        }
      })
    } else {
      this.filterConfigData.isFilterLoading = false;
      if (data.filterData.filterColumn[headerName].length > 0) {
        this.filterConfigData[headerName]["data"] = this.RemoveSelectedItems(this.filterConfigData[headerName]["data"], data.filterData.filterColumn[headerName], 'id').concat(data.filterData.filterColumn[headerName])
      }
    }
  }

  CheckFilterServiceFlag(data, headerName) {
    if (data) {
      if (data.action != "columnFilter" && data.filterData.isApplyFilter) {
        return false
      } else if (data.action == "columnFilter" && data.filterData.columnSerachKey == '' && this.filterConfigData[headerName]["data"].length <= 0) {
        return true
      } else if (data.action == "columnFilter" && data.filterData.columnSerachKey != '' && !data.filterData.isApplyFilter) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  CallListDataWithFilters(data) {
    console.log(data)
  
    let useFulldata = {
      pageNo: this.ActivityMeetingReqBody.RequestedPageNumber,
      id: this.id,
      pageSize: 50
    }

    let reqparam =this.threadListService.GetAppliedFilterData({ ...data, useFulldata: useFulldata})
    this.threadListService.getAppliedFilterMeetingData(reqparam).subscribe(res => {
      console.log(res)
      if (!res.IsError) {
        if (res.ResponseObject.length > 0) {
          const ImmutabelObj = Object.assign({}, res)
          const perPage = reqparam.PageSize;
          const start = ((reqparam.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;
          res.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          })
          this.meetingCollection = this.filterTableData(res.ResponseObject)
          this.ActivityMeetingReqBody.OdatanextLink = res.OdatanextLink
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.meetingCollection = [{}]
          this.tableTotalCount = 0
        }
      } else {
        this.meetingCollection = [{}]
        this.tableTotalCount = 0
        this.errorService.throwError(res.Message)
      }
    })
  }

  RemoveSelectedItems(array1, array2, key) {
    return array1.filter(item1 =>
      !array2.some(item2 => (item2[key] === item1[key])))
  }

  MultiFavAction(data) {
    this.isLoading = true;
    let FavArray = []
    data.objectRowData.forEach(res => {
      FavArray.push({
        "Appointment_Guid": res.SysGuid,
        "IsPivotal": !res.isRowFavorite
      })
    });
    this.conversationService.MultipleMarkConversationAsPivotal(FavArray).subscribe(res => {
      if (!res.IsError) {
        this.isLoading = false;
        this.meetingCollection.map(x => {
          FavArray.forEach(data => {
            if ((x.SysGuid == data.Appointment_Guid)) {
              x.isRowFavorite = data.IsPivotal
            }
            let MarkFavAcion = {
              parentId: this.ActivityMeetingReqBody.Guid,
              childId: data.Appointment_Guid,
              Change: data.IsPivotal
            }
            this.store.dispatch(new MarkMeetingsFavorite({ markFav: MarkFavAcion }))
            let index = this.meetingCollection.findIndex(k => k.SysGuid === data.Appointment_Guid)
            this.meetingCollection = this.meetingCollection.map((x, i) => {
              if (i == index) {
                x.isRowFavorite = data.IsPivotal
                x.unfavouriteBtnVisibility = data.IsPivotal,
                  x.favouriteBtnVisibility = !data.IsPivotal
              }
              return x;
            });
          })
        })
        this.store.dispatch(new ClearMeetingDetails())
        let action
        this.snackBar.open(res.Message, action, {
          duration: 2500
        })
      }
      else {
        this.isLoading = false;
        let action
        this.snackBar.open(res.Message, action, {
          duration: 2500
        })
      }
    })
  }

  FavAction(data) {
    this.isLoading = true;
    let action;
    let favoriteReqObj = {
      "Appointment_Guid": data.objectRowData[0].SysGuid,
      "IsPivotal": (data.objectRowData[0].isRowFavorite) ? false : true
    }
    this.conversationService.markConversationAsPivotal(favoriteReqObj).subscribe((res) => {
      if (!res.IsError) {
        this.isLoading = false;
        console.log(favoriteReqObj)
        this.meetingCollection.map(x => {
          if ((x.SysGuid == favoriteReqObj.Appointment_Guid)) {
            x.isRowFavorite = favoriteReqObj.IsPivotal,
              x.unfavouriteBtnVisibility = favoriteReqObj.IsPivotal,
              x.favouriteBtnVisibility = !favoriteReqObj.IsPivotal
          }
        })
        let MarkFavAcion = {
          parentId: this.ActivityMeetingReqBody.Guid,
          childId: favoriteReqObj.Appointment_Guid,
          Change: favoriteReqObj.IsPivotal
        }
        this.store.dispatch(new MarkMeetingsFavorite({ markFav: MarkFavAcion }))
        let index = this.meetingCollection.findIndex(k => k.SysGuid === data.objectRowData[0].SysGuid)
        this.store.dispatch(new ClearMeetingDetails())
        this.meetingCollection = this.meetingCollection.map((x, i) => {
          if (i == index) {
            x.isRowFavorite = favoriteReqObj.IsPivotal
          }
          return x;
        });
        if (favoriteReqObj.IsPivotal) {
          let message: string = res.Message
          this.snackBar.open(message, action, {
            duration: 1000
          })
        } else {
          let message: string = res.Message
          this.snackBar.open(message, action, {
            duration: 1000
          })
        }
      } else {
        this.isLoading = false;
        this.snackBar.open(res.Message, action, {
          duration: 1000
        })
      }
    });
  }

  addNewMeeting() {
    this.newconversationService.conversationAppointId = undefined;
    this.meetingService.createdMeetingGuid = "";
    this.meetingService.meetingDetails = undefined;
    this.newconversationService.attachmentList = []
    this.newconversationService.conversationFiledInformation = undefined;
    this.service.TempEditLeadDetails();
    this.router.navigate(['/activities/newmeeting'])
  }

  Navigate(data, route): void {
    // console.log(data.objectRowData)
    console.log("we i nsid the navigate!!!")
    console.log(data)
    console.log(route)
    if (route == "Agenda") {
      this.meetingService.meetingEditDetailsInfo = undefined;
      this.newconversationService.attachmentList = [];
      this.newMeetingService.attachmentList = [];
      let encName = this.encrDecrService.set("EncryptionEncryptionEncryptionEn", data.objectRowData[0].SysGuid, "DecryptionDecrip");
      sessionStorage.setItem("MeetingListRowId", JSON.stringify(encName))
      this.router.navigate(['/activities/meetingInfo'])
    }
  }

  getNewTableData(event) {
    console.log("search event form harin function!@@@@")
    console.log(event)
    if (event.action == 'pagination') {
      this.ActivityMeetingReqBody.PageSize = event.itemsPerPage;
      this.ActivityMeetingReqBody.RequestedPageNumber = event.currentPage;
      //if search with pagination!
      this.getActivityMeetingsListById(event, true, false);
      // if (this.service.checkFilterListApiCall(event)) {
      //   this.CallListDataWithFilters(event);
      // } else {
      //   this.getActivityMeetingsListById(this.ActivityMeetingReqBody, true, false);
      // }
    }
  }

  SearchTable(data): void {
    this.ActivityMeetingReqBody.RequestedPageNumber = 1
    this.ActivityMeetingReqBody.OdatanextLink = ""
    if (data != "") {
      if (data.objectRowData != "" && data.objectRowData != undefined) {
        // let MeetingActivitySearch = {
        //   "SearchText": data.objectRowData,
        //   "PageSize": this.ActivityMeetingReqBody.PageSize,
        //   "Guid": this.ActivityMeetingReqBody.Guid
        // }
        // this.threadListService.ActivityMeeting(MeetingActivitySearch).subscribe(res => {
          let useFulldata = {
            pageNo: this.ActivityMeetingReqBody.RequestedPageNumber,
            id: this.id,
            pageSize: 50
          }
          let reqparam =this.threadListService.GetAppliedFilterData({ ...data, useFulldata: useFulldata})
          this.threadListService.getAppliedFilterMeetingData(reqparam).subscribe(res => {
          if (!res.IsError) {
            if (res.ResponseObject.length > 0) {
              let i = 1;
              res.ResponseObject.map(res => {
                res.index = i;
                i = i + 1;
              })
              this.meetingCollection = this.filterTableData(res.ResponseObject)
              this.ActivityMeetingReqBody.OdatanextLink = res.OdatanextLink
              this.tableTotalCount = res.TotalRecordCount
            } else {
              this.meetingCollection = [{}]
              this.tableTotalCount = 0;
            }
          } else {
            this.isLoading = false;
            this.meetingCollection = [{}]
            this.tableTotalCount = 0;
            this.errorService.throwError(res.Message)
          }
        },
          error => {
            this.isLoading = false;
            this.tableTotalCount = 0;
            this.meetingCollection = [{}]
          })
      } else {
        this.getActivityMeetingsListById(data, false, false);
      }
    }
  }

  getActivityMeetingsListById(reqBody, isConcat, isSearch) {
    console.log("meeting lists ", JSON.stringify(reqBody))
    let useFulldata = {
      pageNo: this.ActivityMeetingReqBody.RequestedPageNumber,
      id: this.id,
      pageSize: 50
    }
    let reqparam =this.threadListService.GetAppliedFilterData({ ...reqBody, useFulldata: useFulldata})
    this.threadListService.getAppliedFilterMeetingData(reqparam).subscribe(res => {
    // this.threadListService.getActivityMeetings(reqBody).subscribe(res => {
      // console.log("got the respionse formmeeting!!@@#")
      // console.log(res)
      this.isLoading = false;
      if (!res.IsError) {
        if (res.ResponseObject.length > 0) {
          const ImmutabelObj = Object.assign({}, res)
          const perPage = this.ActivityMeetingReqBody.PageSize;
          const start = ((this.ActivityMeetingReqBody.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;
          res.ResponseObject.map(res => {
            if (!res.index) {
              res.number = i
              res.index = i;
              i = i + 1;
            }
          })
          if (res.OdatanextLink) {
            this.ActivityMeetingReqBody.OdatanextLink = res.OdatanextLink
          }
          if (isConcat) {
            let spliceArray = [];
            this.meetingCollection.map((res) => {
              if (res.index >= start && res.index <= end) {
                spliceArray.push(res);
              }
            });
            spliceArray.map(res => {
              this.meetingCollection.splice(this.meetingCollection.indexOf(res), 1);
            })
            if (!isSearch) {
              ImmutabelObj.ResponseObject.map(x => {
                x.id = x.Guid,
                  x.isRowFavorite = (x.isRowFavorite) ? x.isRowFavorite : false
              })
              const MeetingActivityAction = {
                parentId: this.ActivityMeetingReqBody.Guid,
                list: {
                  data: ImmutabelObj.ResponseObject,
                  count: ImmutabelObj.TotalRecordCount,
                  //nextlink: ImmutabelObj.OdatanextLink
                  nextlink: this.ActivityMeetingReqBody.OdatanextLink
                }
              }
              this.meetingCollection = this.meetingCollection.concat(this.filterTableData(res.ResponseObject))
              // console.log("dispatching this action data->>>>")
              // console.log(MeetingActivityAction)
              // this.meetingCollection = this.filterTableData(res.ResponseObject)
              this.store.dispatch(new LoadMeetingsByParentId({ meetings: MeetingActivityAction }))
            } else {
              this.meetingCollection = this.meetingCollection.concat(this.filterTableData(res.ResponseObject))
            }

          } else {
            // need to handle the search when api is ready!
            this.meetingCollection = this.filterTableData(res.ResponseObject)
          }
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.tableTotalCount = 0
          this.meetingCollection = [{}]
        }
      } else {
        this.tableTotalCount = 0
        this.meetingCollection = [{}]
        this.errorService.throwError(res.Message)
      }
    },
      error => {
        this.isLoading = false;
        this.tableTotalCount = 0
        this.meetingCollection = [{}]
      }
    )
  }
  getSymbol(data) {
    // console.log(data)
    if (data) {
        return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
    } else {
        return '';
    }

}
  filterTableData(data: Array<any>) {
    if (data) {
      return data.map(res => {
        try {
          return {
            "Agenda": res.Subject ? res.Subject.trim() : "NA",
            "MeetingType": res.MeetingType ? res.MeetingType.Value ? res.MeetingType.Value : "NA" : "NA",
            "AccountName": res.ActivityGroup ? res.ActivityGroup.Account ? res.ActivityGroup.Account.Name ? this.getSymbol(res.ActivityGroup.Account.Name) : "NA" : "NA" : "NA",
            "CustomerContacts": res.CustomerContacts ? res.CustomerContacts.length > 0 ? this.contactsFilter(res.CustomerContacts) : ["NA"] : ["NA"],
            "WiproAttendees": res.WiproParticipant ? res.WiproParticipant.length > 0 ? this.wiproAttendesFilter(res.WiproParticipant) : ["NA"] : ["NA"],
            "TagUserToView": res.TagUserToView ? res.TagUserToView.length > 0 ? this.taggedToViewCustomerFilter(res.TagUserToView) : ["NA"] : ["NA"],
            "DateCreated": res.CreatedOn ? res.CreatedOn : "NA",
            "Leadslinked": res.Lead ? res.Lead.length > 0 ? this.leadsFilterName(res.Lead) : ["NA"] : ["NA"],
            "OppLinked": res.OrdersAndOpportunity ? res.OrdersAndOpportunity.length > 0 ? this.opportunityFiter(res.OrdersAndOpportunity) : ["NA"] : ["NA"],
            "isCheccked": res.isChecked ? res.isChecked : false,
            "SysGuid": res.Guid ? res.Guid : "NA",
            "MOM": (res.MOM) ? res.MOM : '',
            "unfavouriteBtnVisibility": res.IsPivotal,
            "favouriteBtnVisibility": !res.IsPivotal,
            "isRowFavorite": res.IsPivotal,
            "accountSysguid": res.ActivityGroup ? res.ActivityGroup.Account ? res.ActivityGroup.Account.SysGuid ? res.ActivityGroup.Account.SysGuid : "NA" : "NA" : "NA",
            "index": res.index,
            "CustomerContactsGuid": res.CustomerContacts ? res.CustomerContacts.length > 0 ? res.CustomerContacts : [] : [],
            "WiproAttendeesGuid": res.WiproParticipant ? res.WiproParticipant.length > 0 ? res.WiproParticipant : [] : [],
            "TagUserToViewGuid": res.TagUserToView ? res.TagUserToView.length > 0 ? res.TagUserToView : [] : [],
            "Attachments": res.Attachments ? res.Attachments.length > 0 ? res.Attachments : [] : [],
            "LinkedActivity": res.ActivityGroup ? res.ActivityGroup : null,
            "LinkedCampaign": res.Campaign ? res.Campaign : null,
            "LinkedCustomers": res.CustomerContacts ? res.CustomerContacts : null,
            "LinkedOpportunity": res.OrdersAndOpportunity ? res.OrdersAndOpportunity : null,
            "AccisProspect": res.ActivityGroup ? res.ActivityGroup.Account ? res.ActivityGroup.Account.isProspect != undefined ? res.ActivityGroup.Account.isProspect : false : false : false,
            "accountType": res.AccountType? res.AccountType : "",
            "AccountGuid":  res.ActivityGroup ? res.ActivityGroup.Account ? res.ActivityGroup.Account.SysGuid ? res.ActivityGroup.Account.SysGuid : "NA" : "NA" : "NA",
          }
        } catch (error) {
          return [{}]
        }
      })
    } else {
      return [{}]
    }
  }

  Createopp(data) {
    // console.log("data recevied", data);
    // this.router.navigate(['/opportunity/newopportunity']);
    console.log(JSON.stringify(data))
    this.isLoading = true
    if(data.objectRowData.data[0].accountType == "Prospect"){
      localStorage.setItem('prospectaccountid', data.objectRowData.data[0].AccountGuid)
      this.router.navigate(['/accounts/createnewaccount']);
    }else if(data.objectRowData.data[0].accountType == "Reserve"){
      this.isLoading = false
    }else{
          sessionStorage.setItem('CreateOpportunityFromLead', JSON.stringify(data.objectRowData.data[0]));
          this.router.navigate(['/opportunity/newopportunity']);
  }
}

  leadsFilterName(data): Array<any> {
    try {
      let leadArray = []
      data.map(x => leadArray.push(x.Title))
      return leadArray
    } catch (error) {
      return ["NA"]
    }
  }

  opportunityFiter(data): Array<any> {
    try {
      let Opportunity = []
      data.map(x => Opportunity.push(x.Name))
      return Opportunity
    } catch (error) {
      return ["NA"]
    }
  }

  contactsFilter(data): Array<any> {
    try {
      let contacts = []
      data.map(x => contacts.push(x.FullName))
      return contacts
    } catch (error) {
      return ["NA"]
    }
  }

  wiproAttendesFilter(data): Array<any> {
    try {
      let wiproAttribute = []
      data.map(x => wiproAttribute.push(x.FullName))
      return wiproAttribute
    } catch (error) {
      return ["NA"]
    }
  }

  taggedToViewCustomerFilter(data): Array<any> {
    try {
      let wiproAttribute = []
      data.map(x => wiproAttribute.push(x.FullName))
      return wiproAttribute
    } catch (error) {
      return ["NA"]
    }
  }

  createLeadTempDetails(data) {
    console.log("seeing ten lead deatusl!!!")
    console.log(data)
    return {
      leadName: null,
      leadSource: null,
      accountName: { Name: data.AccountName, SysGuid: data.accountSysguid, isProspect: data.AccisProspect },
      sbu: null,
      vertical: null,
      alliance: null,
      advisor: null,
      enquirytype: null,
      country: null,
      serviceLineToggle: false,
      WiproSolutionToggle: false,
      desc: null,
      id: "",
      links: {
        wiprosolution: null,
        activitygroup: this.filterActivitydata(data),
        campaign: (data.LinkedCampaign) ? data.LinkedCampaign : null,
        opportunity: this.filterOpportunitydata(data),
        agp: null
      },
      leadInfo: {
        dealValue: null,
        currency: null,
        timeline: null
      },
      ownerDetails: {
        originator: this.Orinator,
        oiginatorlist:null,
        owner: null,
        customers: this.filterCustomerdata(data)
      },
      serviceline: null,
      attachments: null,
      finalActivityGroup: null,
      finalCampaignGroup: null,
      finalOpportunityGroup: null,
      finalCustomerGroup: null,
      moduleSwitch: true,
      moduletype: {
        name: "Meeting",
        data: {
          Activityid: this.ActivityMeetingReqBody.Guid
        },
        Moduleroute: 'activities/activitiesthread/meetingList'
      }
    }
  }

  filterCustomerdata(data) {
    debugger
    if (data) {
      if (data.LinkedCustomers) {
        if (data.LinkedCustomers.length > 0) {
          return data.LinkedCustomers.map(x => x = { ...x, SysGuid: x.Guid, Guid: x.Guid })
        } else {
          return null
        }
      } else {
        return null
      }
    } else {
      return null
    }
  }

  filterOpportunitydata(data: any) {
    if (data.LinkedOpportunity) {
      if (data.LinkedOpportunity.length > 0) {
        return data.LinkedOpportunity.map(x => x = { ...x, Guid: x.SysGuid, Title: x.Name })
      } else {
        return null
      }
    } else {
      return null
    }
  }

  filterActivitydata(data: any) {
    if (data.LinkedActivity) {
      if (!this.isEmpty(data.LinkedActivity)) {
        return [{ Name: data.Agenda, Guid: data.SysGuid, SysGuid: data.SysGuid }]
      } else {
        return null
      }
    } else {
      return null
    }
  }

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  ngOnDestroy(): void {
    this.getMeetingListSub$.unsubscribe()
  }
}

