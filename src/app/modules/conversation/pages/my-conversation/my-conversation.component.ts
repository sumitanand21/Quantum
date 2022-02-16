import { ClearMeetingDetails } from './../../../../core/state/actions/activities.actions';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DataCommunicationService, OfflineService, ConversationService, ErrorMessage, OnlineOfflineService, ArchivedConversationService, conversationheader } from '@app/core/services'
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { LoaderService } from '@app/core/services/loader.service';
import { newConversationService } from '@app/core/services/new-conversation.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { ActivityService } from '@app/core/services/activity.service';
import { LoadMyActivity, ClearActivity } from '@app/core/state/actions/activities.actions';
import { getMyActivity, getMyActivityListById } from '@app/core/state/selectors/activity/activity.selector';
import { MeetingService } from '@app/core/services/meeting.service';
import { ActivityGroupListService } from '@app/core/services/activity-group-lists.service';
@Component({
  selector: 'app-my-conversation',
  templateUrl: './my-conversation.component.html',
  styleUrls: ['./my-conversation.component.scss']
})
export class MyConversationComponent implements OnInit, OnDestroy {

  UserGuid: string;
  pivotalObject: object = {};
  isLoading: boolean = false;
  tableTotalCount: number;
  public MyActivityList = [];
  myActivityListSub$: Subscription
  MyActivityRequestbody = {
    "Guid": "",
    "PageSize":  50,
    "RequestedPageNumber":  1,
    "OdatanextLink": "",
    "FilterData":  []
  };
  filterConfigData = {
    Name: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Account: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Meetings: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Actions: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Orders: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Owner: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Leadname: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Linkedopp: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    isFilterLoading: false
  };
  ownerSend = [];

  constructor(
    private DataCommunication: DataCommunicationService,
    private encrDecrService: EncrDecrService,
    private conversationService: ConversationService,
    private offlineService: OfflineService,
    private globalServe: DataCommunicationService,
    private conversation: ConversationService,
    public activityService: ActivityService,
    private router: Router,
    public loaderService: LoaderService,
    public archiveService: ArchivedConversationService,
    private newConversationService: newConversationService,
    private meetingService: MeetingService,
    public errorMessage: ErrorMessage,
    private store: Store<AppState>,
    private ActivityGroupListService: ActivityGroupListService,
    private readonly OnlineOfflineService: OnlineOfflineService) { }

  async ngOnInit() {
    this.newConversationService.sendConfigData = []
    this.UserGuid = this.encrDecrService.get("EncryptionEncryptionEncryptionEn", localStorage.getItem("userID"), 'DecryptionDecrip')
    this.MyActivityRequestbody.Guid = this.UserGuid
    let owner = {
      "id": this.UserGuid,
      "name": 'User',
      "isDatafiltered": false
    }
    this.ownerSend.push(owner)
    this.conversation.getThreadTrue = false;
    this.conversation.conversationTrues = true;
    this.globalServe.archiveTag = false
    this.isLoading = true
    sessionStorage.setItem('navigation', JSON.stringify(1))
    sessionStorage.setItem('actlist', JSON.stringify(1))
    this.myActivityListSub$ = this.store.pipe(select(getMyActivity)).subscribe(res => {
      this.isLoading = false
      if (res) {
        if (res.ids.length > 0) {
          this.isLoading = false
          this.MyActivityList = this.ActivityGroupListService.activityListData(Object.values(res.entities))
          this.tableTotalCount = res.count;
          this.MyActivityRequestbody.OdatanextLink = res.nextlink
        } else {
          this.isLoading = true
          this.getMyActivitiesList(this.MyActivityRequestbody, true, false);
        }
      } else {
        this.isLoading = true
        this.getMyActivitiesList(this.MyActivityRequestbody, true, false);
      }
    })

    if (!this.OnlineOfflineService.isOnline) {
      const CacheResponse = await this.conversationService.getMyConversationCacheData()
      if (CacheResponse) {
        if (CacheResponse.data.length > 0) {
          this.isLoading = false
          this.MyActivityList = this.ActivityGroupListService.activityListData(CacheResponse.data)
          this.tableTotalCount = CacheResponse.count
          this.MyActivityRequestbody.OdatanextLink = CacheResponse.nextlink
        }
        else {
          this.isLoading = true
          this.getMyActivitiesList(this.MyActivityRequestbody, true, false)
        }
      } else {
        this.isLoading = true
        this.getMyActivitiesList(this.MyActivityRequestbody, true, false)
      }
    }
  }

  getMyActivitiesList(reqBody, isConcat, isSearch) {
    console.log(reqBody)
    let useFulldata ={
      pageNo:this.MyActivityRequestbody.RequestedPageNumber,
      ActivityGroupType:0, 
      pageSize:this.MyActivityRequestbody.PageSize,
      // track: this.Track
    }
    let reqparam = this.conversationService.GetAppliedFilterData({ ...reqBody, useFulldata: useFulldata})
    this.conversationService.getFilterList(reqparam).subscribe(res => {
      console.log("sprint 3",reqparam)
    //  this.activityService.GetMyActivities(reqBody).subscribe(res => {
      this.isLoading = false;
      if (!res.IsError) {
        if (res.ResponseObject.length > 0) {
          const ImmutabelObj = Object.assign({}, res)
          const perPage = this.MyActivityRequestbody.PageSize;
          const start = ((this.MyActivityRequestbody.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;
          res.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          })
          if (res.OdatanextLink) {
            this.MyActivityRequestbody.OdatanextLink = res.OdatanextLink
          }
          if (isConcat) {
            let spliceArray = [];
            this.MyActivityList.map((res) => {
              if (res.index >= start && res.index <= end) {
                spliceArray.push(res);
              }
            });
            spliceArray.map(res => {
              this.MyActivityList.splice(this.MyActivityList.indexOf(res), 1);
            })
            if (!isSearch) {
              ImmutabelObj.ResponseObject.map(x => x.id = x.Guid)
              const MyActivityAction = {
                myactivity: ImmutabelObj.ResponseObject,
                count: ImmutabelObj.TotalRecordCount,
                nextlink: this.MyActivityRequestbody.OdatanextLink
              }
              this.store.dispatch(new LoadMyActivity({ myactivity: MyActivityAction }))
            } 
            else {
              this.MyActivityList = this.MyActivityList.concat(this.ActivityGroupListService.activityListData(res.ResponseObject))
            }
          } else {
            this.MyActivityList = this.ActivityGroupListService.activityListData(res.ResponseObject)
          }
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.MyActivityList = [{}]
        }
      } else {
        this.MyActivityList = [{}];
        this.tableTotalCount = 0;
        this.isLoading = false;
        this.errorMessage.throwError(res.Message);
      }
    },
      error => {
        this.isLoading = false;
        this.tableTotalCount = 0;
        this.MyActivityList = [{}];
      })
  }

  onPagination(event) {
    if (event.action == 'pagination') {
      if (this.MyActivityRequestbody.PageSize == event.itemsPerPage) {
        this.MyActivityRequestbody.PageSize = event.itemsPerPage;
        this.MyActivityRequestbody.RequestedPageNumber = event.currentPage;
        this.getMyActivitiesList(event, true, true);
      }
      else {
        this.MyActivityRequestbody.PageSize = event.itemsPerPage;
        this.MyActivityRequestbody.RequestedPageNumber = event.currentPage;
        this.getMyActivitiesList(event, false, true);
      }
    }
  }

  onSearchListData(data): void {
    this.MyActivityRequestbody.RequestedPageNumber = 1
    this.MyActivityRequestbody.OdatanextLink = ""
    if (data != "") {
      if (data.objectRowData != "" && data.objectRowData != undefined) {
        // let MyActivitySearch = {
        //   "SearchText": data.objectRowData,
        //   "PageSize": this.MyActivityRequestbody.PageSize,
        //   "Guid": this.UserGuid
        // }
        // this.activityService.MyActiviySearch(MyActivitySearch).subscribe(res => {
          let useFulldata ={
            pageNo:this.MyActivityRequestbody.RequestedPageNumber,
            ActivityGroupType:0,
            pageSize:this.MyActivityRequestbody.PageSize
          }
          let reqparam = this.conversationService.GetAppliedFilterData({ ...data, useFulldata: useFulldata})
          this.conversationService.getFilterList(reqparam).subscribe(res => {
          if (!res.IsError) {
            if (res.ResponseObject.length > 0) {
              let i = 1;
              res.ResponseObject.map(res => {
                res.index = i;
                i = i + 1;
              })
              this.MyActivityList = this.ActivityGroupListService.activityListData(res.ResponseObject)
              this.MyActivityRequestbody.OdatanextLink = res.OdatanextLink
              this.tableTotalCount = res.TotalRecordCount
            } else {
              this.MyActivityList = [{}]
              this.tableTotalCount = 0;
            }
          } else {
            this.isLoading = false;
            this.MyActivityList = [{}]
            this.tableTotalCount = 0;
            this.errorMessage.throwError(res.Message)
          }
        }, error => { this.isLoading = false; this.MyActivityList = [{}]; this.tableTotalCount = 0; })
      } else {
        this.getMyActivitiesList(this.MyActivityRequestbody, false, false)
      }
    }
  }

  performListActions(childActionRecieved) {
    if (childActionRecieved) {
      (childActionRecieved.parentData) ? this.tableTotalCount = childActionRecieved.parentData.totalCount : this.tableTotalCount = this.tableTotalCount
    }
    sessionStorage.setItem('archivedStatus', "false");
    var actionRequired = childActionRecieved;
    console.log('List action', actionRequired.action)
    switch (actionRequired.action) {
      case 'AddMeeting': {
        this.formeetingCreation(childActionRecieved);
        if (sessionStorage.getItem('selAccountObj')) {  
          localStorage.setItem('AccountModuePopulateData',JSON.stringify(true))
        }
        this.newConversationService.conversationAppointId = undefined;
        this.newConversationService.conversationFiledInformation = undefined;
        this.meetingService.meetingDetails = undefined;
        this.meetingService.createdMeetingGuid = "";
        this.newConversationService.attachmentList = [];
        this.globalServe.TempEditLeadDetails();
        this.router.navigate(['/activities/newmeeting'])
        break;
      }
      case 'otheractivity': {
        this.formeetingCreation(childActionRecieved);
        if (sessionStorage.getItem('selAccountObj')) {  
          localStorage.setItem('AccountModuePopulateData',JSON.stringify(true))
        }
        this.Navigate(childActionRecieved, 'otheractivity')
        this.router.navigateByUrl('/activities/otheractivity');
        break;
      }
      case 'viewaction': {
        this.formeetingCreation(childActionRecieved);
        this.Navigate(childActionRecieved, 'viewaction')
        this.router.navigateByUrl('/activities/newaction');
        break;
      }
      case 'Name': {
        sessionStorage.removeItem('actlist')
        if (sessionStorage.getItem('selAccountObj')) {  
          localStorage.setItem('AccountModuePopulateData',JSON.stringify(true))
        }
        this.conversation.sendPageNumber = childActionRecieved.pageData.currentPage
        this.conversation.sendPageSize = childActionRecieved.pageData.itemsPerPage
        this.conversation.sendConfigData = childActionRecieved.configData.filterData
        this.Navigate(childActionRecieved, "link")
        break;
      }
      case 'search': {
        this.onSearchListData(childActionRecieved)
        break;
      }
      case 'replicate': {
        this.onReplicateActivity(childActionRecieved)
        break;
      }
      case 'mularchive': {
        this.onMultipleArchive(childActionRecieved)
        break;
      }
      case 'tabNavigation': {
        this.ActivityGroupListService.onTabNavigation(childActionRecieved.objectRowData[0])
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
        this.MyActivityRequestbody.OdatanextLink = ''
        this.MyActivityRequestbody.RequestedPageNumber = 1
        this.CallListDataWithFilters(childActionRecieved)
        break;
      }
    }
  }

  clearallFilter(){
    this.MyActivityRequestbody = {
      "Guid": "",
      "PageSize":  this.MyActivityRequestbody.PageSize,
      "RequestedPageNumber":  1,
      "OdatanextLink": "",
      "FilterData":  []
    };
    this.getMyActivitiesList(this.MyActivityRequestbody, false, false)
  }

  GetColumnFilters(data) {
    if (data.filterData) {
      if (!data.filterData.isApplyFilter) {
        let headerName = data.filterData.headerName;
        this.filterConfigData[headerName].data = [];
        this.filterConfigData[headerName].PageNo = 1
        this.filterConfigData[headerName].NextLink = ''
        this.generateFilterConfigData(data, headerName, false, this.ActivityGroupListService.CheckFilterServiceFlag(data, headerName,this.filterConfigData))
      } else {
        if (data.filterData.isApplyFilter && this.DataCommunication.CheckFilterFlag(data)) {
          this.MyActivityRequestbody.OdatanextLink = ''
          this.MyActivityRequestbody.RequestedPageNumber = 1
          this.CallListDataWithFilters(data)
        } else if (data.filterData.isApplyFilter && data.filterData.globalSearch != ""){
          this.CallListDataWithFilters(data)
        } else {
          this.store.dispatch(new ClearActivity())
          this.MyActivityRequestbody.OdatanextLink = ''
          this.MyActivityRequestbody.RequestedPageNumber = 1
          this.getMyActivitiesList(this.MyActivityRequestbody, false, true)
        }
      }
    }
  }

  GetColumnSearchFilters(data) {
    let headerName = data.filterData.headerName
    this.MyActivityRequestbody.OdatanextLink = ''
    this.filterConfigData[headerName].PageNo = 1
    this.filterConfigData[headerName].NextLink = ''
    this.generateFilterConfigData(data, headerName, false, true)
  }

  LoadMoreColumnFilter(data) {
    let headerName = data.filterData.headerName
    this.filterConfigData[headerName].PageNo = this.filterConfigData[headerName].PageNo + 1
    this.generateFilterConfigData(data, headerName, true, true)
  }

  generateFilterConfigData(data, headerName, isConcat, isServiceCall?) {
    if (isServiceCall) {
      let useFulldata = {
        headerName: headerName,
        searchVal: data.filterData.columnSerachKey,
        pageNo: this.filterConfigData[headerName].PageNo,
        pageSize: 10,
        nextLink: this.filterConfigData[headerName].NextLink,
        ActivityGroupType:0,
      }
      this.conversationService.getFilterSwitchListData({ ...data, useFulldata: useFulldata}).subscribe(res => {
        this.filterConfigData.isFilterLoading = false;
          if (!res.IsError) { 
            this.filterConfigData[headerName] = {
              data: (isConcat) ? this.filterConfigData[headerName]["data"].concat(res.ResponseObject) : res.ResponseObject,
              recordCount: res.TotalRecordCount,
              NextLink: res.OdatanextLink,
              PageNo: res.CurrentPageNumber
            }
            //display the selected value in filter list
            data.filterData.filterColumn[headerName].forEach(res => {
              let index = this.filterConfigData[headerName].data.findIndex(x => x.id == res.id)
              if (index !== -1) {
                this.filterConfigData[headerName].data[index].isDatafiltered = true
              }
            });
          } else {
            if (this.filterConfigData[headerName].PageNo > 1) {
              this.filterConfigData[headerName].PageNo = Number(this.filterConfigData[headerName].PageNo) - 1;
            }
            this.errorMessage.throwError(res.Message)
          }
      }, error => {
        console.log("eroor")
        this.filterConfigData.isFilterLoading = false
        if (this.filterConfigData[headerName].PageNo > 1) {
          this.filterConfigData[headerName].PageNo = Number(this.filterConfigData[headerName].PageNo) - 1;
        }
      })
    } else {
      this.filterConfigData.isFilterLoading = false;
      if (data.filterData.filterColumn[headerName].length > 0) {
        this.filterConfigData[headerName]["data"] = this.ActivityGroupListService.RemoveSelectedItems(this.filterConfigData[headerName]["data"], data.filterData.filterColumn[headerName], 'id').concat(data.filterData.filterColumn[headerName])
      }
    }
  }

  CallListDataWithFilters(data) {
    let useFulldata ={
      pageNo:this.MyActivityRequestbody.RequestedPageNumber,
      ActivityGroupType:0, 
      pageSize:this.MyActivityRequestbody.PageSize
    }
    let reqparam = this.conversationService.GetAppliedFilterData({ ...data, useFulldata: useFulldata})
    this.conversationService.getFilterList(reqparam).subscribe(res => {
      if (!res.IsError) {
        if (res.ResponseObject.length > 0) {
          const perPage = this.MyActivityRequestbody.PageSize;
          const start = ((this.MyActivityRequestbody.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          res.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          })
          this.MyActivityList = this.ActivityGroupListService.activityListData(res.ResponseObject)
          this.MyActivityRequestbody.OdatanextLink = res.OdatanextLink
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.MyActivityList = [{}]
          this.tableTotalCount = 0
        }
      } else {
        this.MyActivityList = [{}]
        this.tableTotalCount = 0
        this.errorMessage.throwError(res.Message)
      }
    })
  }

  Navigate(data, route): void {
    let encId
    if (route == "link") {
      
      encId = this.encrDecrService.set("EncryptionEncryptionEncryptionEn", data.objectRowData[0].id, "DecryptionDecrip");
      this.DataCommunication.convActionTag = false;
      sessionStorage.setItem('tableName', JSON.stringify('conversation'));
      let reqObject = {...data.objectRowData[0] , isAccountPopulate : true};
      sessionStorage.setItem("RequestCampaign", JSON.stringify(reqObject));
      //sessionStorage.setItem("RequestCampaign", JSON.stringify(data.objectRowData[0]));
      sessionStorage.setItem('AccountNameForChildConversation', data.objectRowData[0].Account)
      sessionStorage.setItem('AccountDetailsForChildConversation', JSON.stringify({ sysGuid: data.objectRowData[0].accountSysGuid, isProspect: data.objectRowData[0].Isprospect }))
      sessionStorage.setItem('ActivityGroupName', data.objectRowData[0].Name)
      this.newConversationService.setActivityGroupName(data.objectRowData[0].Name)
      this.DataCommunication.serviceSearchItem = "";
      this.DataCommunication.archiveTag = false
      this.store.pipe(select(getMyActivityListById((data.objectRowData[0].id)))).subscribe(x => {
        if (x !== undefined) {
          localStorage.setItem('forMeetingCreation', JSON.stringify(x))
        } else {
          let json = {
            Guid: data.objectRowData[0].id,
            Name: data.objectRowData[0].Name,
            Account: {
              Name: data.objectRowData[0].Account,
              SysGuid: data.objectRowData[0].AccountSysGuid,
              isProspect: data.objectRowData[0].isProspect
            }
          }
          localStorage.setItem('forMeetingCreation', JSON.stringify(json))
        }
      })
      sessionStorage.setItem("ActivityListRowId", JSON.stringify(encId))
        this.router.navigate(['/activities/activitiesthread']);
    } else if (route == 'replicate') {
      this.conversationService.conversationId = data.objectRowData.data[0].id;
      encId = this.encrDecrService.set("EncryptionEncryptionEncryptionEn", data.objectRowData.data[0].id, "DecryptionDecrip");
      localStorage.setItem('replicateId', encId)
      if (this.router.url.includes('/accounts/accountactivities')) {
        this.router.navigateByUrl('/accounts/accountactivities/myactivities')
      } else {
        this.router.navigateByUrl('activities/myactivities')
      }
    } else if (route == "campaign") {
      sessionStorage.setItem('tableName', JSON.stringify('conversation'));
      this.conversationService.setCampaignIconToSend = event
      this.router.navigateByUrl('/campaign/RequestCampaign')
    } else if (route == 'createLead') {
      this.router.navigate(['/leads/createlead'])
    }
    else if (route == "otheractivity") {
      let parentId = data.objectRowData[0].id;
      encId = this.encrDecrService.set("EncryptionEncryptionEncryptionEn", parentId, "DecryptionDecrip");
      sessionStorage.setItem('ActivityListRowId', JSON.stringify(encId))
      sessionStorage.setItem('tableName', JSON.stringify("childs"));
      this.store.pipe(select(getMyActivityListById((data.objectRowData[0].id)))).subscribe(x => {
        if (x !== undefined) {
          localStorage.setItem('forMeetingCreation', JSON.stringify(x))
        } else {
          let json = {
            Guid: data.objectRowData[0].id,
            Name: data.objectRowData[0].Name,
            Account: {
              Name: data.objectRowData[0].Account,
              SysGuid: data.objectRowData[0].AccountSysGuid,
              isProspect: data.objectRowData[0].isProspect
            }
          }
          localStorage.setItem('forMeetingCreation', JSON.stringify(json))
        }
      })
      sessionStorage.setItem("otheractivity", JSON.stringify("createother"));
    } else if (route == "viewaction") {
      let parentId = data.objectRowData[0].id;
      encId = this.encrDecrService.set("EncryptionEncryptionEncryptionEn", parentId, "DecryptionDecrip");
      sessionStorage.setItem('ActivityListRowId', JSON.stringify(encId))
    }
  }

  formeetingCreation(data) {
    var isSprintThreeAccountModule : Boolean = false;
    if (this.router.url.includes('/accounts/accountactivities')) {
      isSprintThreeAccountModule = true
    } else {
      isSprintThreeAccountModule = false
    }
    let json = {
      Guid: data.objectRowData[0].id,
      Name: data.objectRowData[0].Name,
      Account: {
        Name: data.objectRowData[0].Account,
        SysGuid: data.objectRowData[0].AccountSysGuid,
        isProspect: data.objectRowData[0].isProspect
      },
      AccountType :data.objectRowData[0].AccountType,
      isSprintThreeAccountModule : isSprintThreeAccountModule
    }
    localStorage.setItem('forMeetingCreation', JSON.stringify(json))
  }

  onReplicateActivity(data) {
    const body = {
      "Name": data.objectRowData.comment,
      "Account": { "SysGuid": data.objectRowData.data[0].SysGuid, "Name": data.objectRowData.data[0].Account, "isProspect": data.objectRowData.data[0].isProspect },
    }
    this.newConversationService.getCreateActivityGroup(body).subscribe(res => {
      if (!res.IsError) {
        this.getMyActivitiesList(data, false , false)
        // this.store.dispatch(new ClearActivity())
        let Message = "Replicated successfully"
        this.errorMessage.throwError(Message)
      } else {
        this.errorMessage.throwError(res.Message)
      }
    })
  }

  onMultipleArchive(data) {
    this.isLoading = true;
    let Guid: Array<any> = data.objectRowData.data.map((x) => {
      return {
        Guid: (x.id),
        ArchiveRemarks: data.objectRowData.comment
      }
    });
    this.archiveService.archievedConversation(Guid).subscribe(async res => {
      this.isLoading = false;
      if (res.IsError === false) {
        await this.offlineService.ClearArchivedConvIndexTableData()
        this.errorMessage.onSuccessMessage(res.Message).afterDismissed().subscribe(()=>{ 
          this.store.dispatch(new ClearActivity());
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
    },() => {
      this.isLoading = false;
    })
  }

  ngOnDestroy() {
    this.myActivityListSub$.unsubscribe()
  }
}
