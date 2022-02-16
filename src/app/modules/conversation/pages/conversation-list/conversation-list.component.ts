import { ClearMeetingDetails } from './../../../../core/state/actions/activities.actions';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DataCommunicationService, OfflineService, ConversationService, ErrorMessage, CampaignService, OnlineOfflineService, ArchivedConversationService, actionListService, conversationheader } from '@app/core/services';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { newConversationService } from '@app/core/services/new-conversation.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { ActivityService } from '@app/core/services/activity.service';
import { LoadAllActivity, ClearActivity } from '@app/core/state/actions/activities.actions';
import { getAllActivity, getActivityListById } from '@app/core/state/selectors/activity/activity.selector';
import { MeetingService } from '@app/core/services/meeting.service';
import { ActivityGroupListService } from '@app/core/services/activity-group-lists.service';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.scss']
})
export class ConversationListComponent implements OnInit, OnDestroy {

  public activityList = []
  tableTotalCount: number = 0;
  allActivityState: Subscription;
  isLoading: boolean = false;
  // Track: Array<any> = []
  AllActivityRequestBody = {
    "PageSize":  50,
    "RequestedPageNumber": 1,
    "OdatanextLink": "",
    "FilterData": []
  };
  filterConfigData = {
    Name: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },   //,trackName: 'ActivityGroupGuids'
    Account: { data: [], recordCount: 0, PageNo: 1, NextLink: ''},   // ,trackName: 'AccountGuids'
    Meetings: { data: [], recordCount: 0, PageNo: 1, NextLink: ''},    //,trackName: 'MeetingCount'
    Actions: { data: [], recordCount: 0, PageNo: 1, NextLink: ''},    // ,trackName: 'ActionCount'
    Orders: { data: [], recordCount: 0, PageNo: 1, NextLink: ''},   // ,trackName: 'OtherActivityCount'
    Owner: { data: [], recordCount: 0, PageNo: 1, NextLink: ''},   // , trackName: 'OwnerGuids'
    Leadname: { data: [], recordCount: 0, PageNo: 1, NextLink: ''},   // ,trackName: 'LeadGuids'
    Linkedopp: { data: [], recordCount: 0, PageNo: 1, NextLink: ''},   // ,trackName: 'OpportunityGuids'
    isFilterLoading: false
  };

  constructor(private DataCommunication: DataCommunicationService,
    private encrDecrService: EncrDecrService,
    private conversationService: ConversationService,
    private offlineService: OfflineService,
    private globalServe: DataCommunicationService,
    private conversation: ConversationService,
    private router: Router,
    private newConversationService: newConversationService,
    public errorMessage: ErrorMessage,
    private campaignService: CampaignService,
    private store: Store<AppState>,
    private readonly OnlineOfflineService: OnlineOfflineService,
    private activityService: ActivityService,
    private meetingService: MeetingService,
    private ActivityGroupListService: ActivityGroupListService,
    public actionListService: actionListService,
    public archiveService: ArchivedConversationService,
  ) { }

  async ngOnInit() {
    this.newConversationService.sendConfigData = []
    sessionStorage.removeItem("routingstate");
    sessionStorage.setItem('navigation', JSON.stringify(2))
    sessionStorage.setItem('actlist', JSON.stringify(2))
    this.conversation.getThreadTrue = false;
    this.conversation.conversationTrues = true;
    this.globalServe.archiveTag = false
    this.isLoading = true
    this.allActivityState = this.store.pipe(select(getAllActivity)).subscribe(res => {
      if (res) {
        if (res.ids.length > 0) {
          this.isLoading = false
          this.activityList = this.ActivityGroupListService.activityListData(Object.values(res.entities))
          this.tableTotalCount = res.count;
          this.AllActivityRequestBody.OdatanextLink = res.nextlink
        } else {
          this.isLoading = true
          this.getAllActivitiesList(this.AllActivityRequestBody, true, false)
        }
      }
      else {
        this.isLoading = true
        this.getAllActivitiesList(this.AllActivityRequestBody, true, false)
      }
    });
    if (!this.OnlineOfflineService.isOnline) {
      const CacheResponse = await this.activityService.getCachedActivity()
      if (CacheResponse) {
        if (CacheResponse.data.length > 0) {
          this.isLoading = false
          this.activityList = this.ActivityGroupListService.activityListData(CacheResponse.data)
          this.tableTotalCount = CacheResponse.count
          this.AllActivityRequestBody.OdatanextLink = CacheResponse.nextlink
        }
      } else {
        this.isLoading = true
        this.getAllActivitiesList(this.AllActivityRequestBody, true, false)
      }
    }
  }

  getAllActivitiesList(reqBody, isConcat, isSearch) {
    console.log(reqBody)
    // this.activityService.GetAllActivities(reqBody).subscribe(res => {
      let useFulldata ={
        pageNo:this.AllActivityRequestBody.RequestedPageNumber,
        ActivityGroupType:1, 
        pageSize:this.AllActivityRequestBody.PageSize,
        // track: this.Track
      }
      let reqparam = this.conversationService.GetAppliedFilterData({ ...reqBody, useFulldata: useFulldata})
      this.conversationService.getFilterList(reqparam).subscribe(res => {
      this.isLoading = false;
      if (!res.IsError) {
        if (res.ResponseObject.length > 0) {
          const ImmutabelObj = Object.assign({}, res)
          const perPage = this.AllActivityRequestBody.PageSize;
          const start = ((this.AllActivityRequestBody.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;
          res.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          })
          if (res.OdatanextLink) {
            this.AllActivityRequestBody.OdatanextLink = res.OdatanextLink
          }
          if (isConcat) {
            let spliceArray = [];
            this.activityList.map((res) => {
              if (res.index >= start && res.index <= end) {
                spliceArray.push(res);
              }
            });
            spliceArray.map(res => {
              this.activityList.splice(this.activityList.indexOf(res), 1);
            })
            if (!isSearch) {
              ImmutabelObj.ResponseObject.map(x => x.id = x.Guid)
              const ActivityAction = {
                allactivity: ImmutabelObj.ResponseObject,
                count: ImmutabelObj.TotalRecordCount,
                nextlink: this.AllActivityRequestBody.OdatanextLink
              }
              this.store.dispatch(new LoadAllActivity({ activity: ActivityAction }))
            } else {
              this.activityList = [...this.activityList , ...this.ActivityGroupListService.activityListData(res.ResponseObject)]
              //this.activityList = this.activityList.concat(this.ActivityGroupListService.activityListData(res.ResponseObject))
            }

          } else {
            // need to handle the search when api is ready!
            this.activityList = this.ActivityGroupListService.activityListData(res.ResponseObject)
          }
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.activityList = [{}]
        }
      } else {
        this.errorMessage.throwError(res.Message)
        this.activityList = [{}]
        this.isLoading = false;
      }
    },
      error => {
        this.activityList = [{}]
        this.isLoading = false;
      })
  }

  onPagination(event) {
    if (event.action == 'pagination') {
      if (this.AllActivityRequestBody.PageSize == event.itemsPerPage) {
        this.AllActivityRequestBody.PageSize = event.itemsPerPage;
        this.AllActivityRequestBody.RequestedPageNumber = event.currentPage;
        this.getAllActivitiesList(event, true, true);
      }
      else {
        this.AllActivityRequestBody.PageSize = event.itemsPerPage;
        this.AllActivityRequestBody.RequestedPageNumber = event.currentPage;
        this.getAllActivitiesList(event, false, true);
      }
    }
  }

  onSearchListData(data): void {
    this.AllActivityRequestBody.RequestedPageNumber = 1
    this.AllActivityRequestBody.OdatanextLink = ""
    if (data != "") {
      if (data.objectRowData !== "" && data.objectRowData !== undefined) {
        let useFulldata ={
          pageNo:this.AllActivityRequestBody.RequestedPageNumber,
          ActivityGroupType:1, 
          pageSize:this.AllActivityRequestBody.PageSize,
          // track: this.Track
        }
        let reqparam = this.conversationService.GetAppliedFilterData({ ...data, useFulldata: useFulldata})
        this.conversationService.getFilterList(reqparam).subscribe(res => {
        // let ActivitySearch = {
        //   "SearchText": data.objectRowData,
        //   "PageSize": this.AllActivityRequestBody.PageSize,
        //   "Id": ""// by default we shd ask 5 data on search
        // }
        // this.activityService.ActivitySearch(ActivitySearch).subscribe(res => {
          if (!res.IsError) {
            if (res.ResponseObject.length > 0) {
              let i = 1;
              res.ResponseObject.map(res => {
                res.index = i;
                i = i + 1;
              })
              this.activityList = this.ActivityGroupListService.activityListData(res.ResponseObject)
              this.AllActivityRequestBody.OdatanextLink = res.OdatanextLink
              this.tableTotalCount = res.TotalRecordCount
            } else {
              this.activityList = [{}]
              this.tableTotalCount = 0;
            }
          } else {
            this.isLoading = false;
            this.activityList = [{}]
            this.tableTotalCount = 0;
            this.errorMessage.throwError(res.Message)
          }
        }, error => { this.isLoading = false; this.activityList = [{}]; this.tableTotalCount = 0; })
      } else {
        this.getAllActivitiesList(data, false, false)
      }
    }
  }

  performListActions(childActionRecieved) {
    if (childActionRecieved) {
      (childActionRecieved.parentData) ? this.tableTotalCount = childActionRecieved.parentData.totalCount : this.tableTotalCount = this.tableTotalCount
    }
    var actionRequired = childActionRecieved;
    sessionStorage.setItem('archivedStatus', "false");
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
        this.newConversationService.sendPageNumber = childActionRecieved.pageData.currentPage
        this.newConversationService.sendPageSize = childActionRecieved.pageData.itemsPerPage
        this.newConversationService.sendConfigData = childActionRecieved.configData.filterData
        this.Navigate(childActionRecieved, "link")
        break;
      }
      case 'search': {
        console.log("search",childActionRecieved)
        this.onSearchListData(childActionRecieved)
        break;
      }
      case 'replicate': {
        this.onReplicateActivity(childActionRecieved)
        break;
      }
      case 'mularchive': {
        this.onMultipleArchive(actionRequired)
        break;
      }
      case 'tabNavigation': {
        this.ActivityGroupListService.onTabNavigation(childActionRecieved.objectRowData[0])
        break;
      }
      case "columnFilter": {
        console.log("filter",childActionRecieved)
        this.GetColumnFilters(childActionRecieved);
        break;
      }
      case "columnSearchFilter": {
        this.GetColumnSearchFilters(childActionRecieved)
        break
      }
      case 'loadMoreFilterData': {
        this.LoadMoreColumnFilter(childActionRecieved)
        break;
      }
      case 'ClearAllFilter': {
        this.clearallFilter();
        return;
      }
      case 'sortHeaderBy': {
        this.AllActivityRequestBody.OdatanextLink = ''
        this.AllActivityRequestBody.RequestedPageNumber = 1
        this.CallListDataWithFilters(childActionRecieved);
        break;
      }
    }
  }

  clearallFilter(){
    this.AllActivityRequestBody = {
      "PageSize": this.AllActivityRequestBody.PageSize,
      "RequestedPageNumber": 1,
      "OdatanextLink": "",
      "FilterData": []
    }

    this.getAllActivitiesList(this.AllActivityRequestBody, false, false)
  }

  GetColumnFilters(data) {
    if (data.filterData) {
      if (!data.filterData.isApplyFilter) {
        let headerName = data.filterData.headerName;
        this.filterConfigData[headerName].data = []
        this.filterConfigData[headerName].PageNo = 1
        this.filterConfigData[headerName].NextLink = ''
        this.generateFilterConfigData(data, headerName, false, this.ActivityGroupListService.CheckFilterServiceFlag(data, headerName, this.filterConfigData))
      } else {
        if (data.filterData.isApplyFilter && this.DataCommunication.CheckFilterFlag(data)) {
          this.AllActivityRequestBody.OdatanextLink = ''
          this.AllActivityRequestBody.RequestedPageNumber = 1
          this.CallListDataWithFilters(data)
        } else if (data.filterData.isApplyFilter && data.filterData.globalSearch != "") {
          this.CallListDataWithFilters(data)
        } else {
          this.store.dispatch(new ClearActivity())
          this.AllActivityRequestBody.OdatanextLink = ''
          this.AllActivityRequestBody.RequestedPageNumber = 1
          this.getAllActivitiesList(this.AllActivityRequestBody, false, true)
        }
      }
    }
  }

  GetColumnSearchFilters(data) {
    let headerName = data.filterData.headerName
    this.AllActivityRequestBody.OdatanextLink = ''
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
        ActivityGroupType: 1,
        // track: this.Track
      }
      this.conversationService.getFilterSwitchListData({ ...data, useFulldata: useFulldata}).subscribe(res => {
        this.filterConfigData.isFilterLoading = false;
          if (!res.IsError) {
            this.filterConfigData[headerName] = {
              data: (isConcat) ? this.filterConfigData[headerName]["data"].concat(res.ResponseObject) : res.ResponseObject,
              recordCount: res.TotalRecordCount,
              NextLink: res.OdatanextLink,
              PageNo: res.CurrentPageNumber,
              // trackName: this.filterConfigData[headerName].trackName
            }
            //display the selected value in filter list
            
            data.filterData.filterColumn[headerName].forEach(res => {
              let index = this.filterConfigData[headerName].data.findIndex(x => x.id == res.id)
              debugger
              console.log("res,id",res.id,index)
              // console.log(this.filterConfigData[headerName].data);
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
        this.filterConfigData.isFilterLoading = false
        if (this.filterConfigData[headerName].PageNo > 1) {
          this.filterConfigData[headerName].PageNo = Number(this.filterConfigData[headerName].PageNo) - 1;
        }
      })
    } else {
      this.filterConfigData.isFilterLoading = false;
      if (data.filterData.filterColumn[headerName].length > 0) {
        //isDatafiltered
        this.filterConfigData[headerName]["data"] = this.ActivityGroupListService.RemoveSelectedItems(this.filterConfigData[headerName]["data"], data.filterData.filterColumn[headerName], 'id').concat(data.filterData.filterColumn[headerName])
      }
    }
  }

  CallListDataWithFilters(data) {
    // if(data.filterData.order.length>0) {
    //   this.Track=[]
    //   data.filterData.order.forEach((res, i) => {
    //     console.log(this.filterConfigData[res])
    //      this.Track[i]= this.filterConfigData[res]['trackName']
    //    })
    // } else {
    //   this.Track = []
    // }
  
    // console.log(this.Track)
    let useFulldata = {
      pageNo: this.AllActivityRequestBody.RequestedPageNumber,
      ActivityGroupType: 1, 
      pageSize:50, 
      // track: this.Track
    }
    let reqparam = this.conversationService.GetAppliedFilterData({ ...data, useFulldata: useFulldata})
    this.conversationService.getFilterList(reqparam).subscribe(res => {
      if (!res.IsError) {
        if (res.ResponseObject.length > 0) {
          const perPage = reqparam.PageSize;
          const start = ((reqparam.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          res.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          })
          this.activityList = this.ActivityGroupListService.activityListData(res.ResponseObject)
          this.AllActivityRequestBody.OdatanextLink = res.OdatanextLink
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.activityList = [{}]
          this.tableTotalCount = 0
        }
      } else {
        this.activityList = [{}]
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
      let reqObject = {...data.objectRowData[0] , isAccountPopulate : true};
      sessionStorage.setItem("RequestCampaign", JSON.stringify(reqObject));
      // sessionStorage.setItem("RequestCampaign", JSON.stringify(data.objectRowData[0]));
      sessionStorage.setItem('AccountNameForChildConversation', data.objectRowData[0].Account)
      sessionStorage.setItem('AccountDetailsForChildConversation', JSON.stringify({ sysGuid: data.objectRowData[0].accountSysGuid, isProspect: data.objectRowData[0].Isprospect }))
      sessionStorage.setItem('conversationParentId', data.objectRowData[0].id)
      sessionStorage.setItem('ActivityGroupName', data.objectRowData[0].Name)
      this.newConversationService.setActivityGroupName(data.objectRowData[0].Name)
      this.DataCommunication.serviceSearchItem = "";
      this.DataCommunication.archiveTag = false
      this.meetingService.createdMeetingGuid = "";
      this.meetingService.meetingDetails = undefined
      this.newConversationService.attachmentList = []
      this.store.pipe(select(getActivityListById((data.objectRowData[0].id)))).subscribe(x => {
        if (x !== undefined) {
          localStorage.setItem('forMeetingCreation', JSON.stringify(x))
        } else {
          if (sessionStorage.getItem('selAccountObj')) {  
            localStorage.setItem('AccountModuePopulateData',JSON.stringify(true))
          }
          let json = {
            Guid: data.objectRowData[0].id,
            Name: data.objectRowData[0].Name,
            Account: {
              Name: data.objectRowData[0].Account,
              SysGuid: data.objectRowData[0].AccountSysGuid,
              isProspect: data.objectRowData[0].isProspect
            },
            AccountType :data.objectRowData[0].AccountType
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
        this.router.navigateByUrl('/accounts/accountactivities/list')
      } else {
        this.router.navigateByUrl('activities/list')
      }
    } else if (route == "campaign") {
      let reqObject = {...data.objectRowData[0] , isAccountPopulate : true};
      sessionStorage.setItem("RequestCampaign", JSON.stringify(reqObject));
      //sessionStorage.setItem("RequestCampaign", JSON.stringify(data.objectRowData[0]));
      this.conversationService.setCampaignIconToSend = event
      this.campaignService.setCampaignTabChanges(true);
      this.router.navigateByUrl('/campaign/RequestCampaign')
    } else if (route == 'createLead') {
      this.router.navigate(['/leads/createlead'])
    }
    else if (route == "otheractivity") {
      let parentId = data.objectRowData[0].id;
      encId = this.encrDecrService.set("EncryptionEncryptionEncryptionEn", parentId, "DecryptionDecrip");
      sessionStorage.setItem('ActivityListRowId', JSON.stringify(encId))
      this.store.pipe(select(getActivityListById((data.objectRowData[0].id)))).subscribe(x => {
        if (x !== undefined) {
          localStorage.setItem('forMeetingCreation', JSON.stringify(x))
        } else {
          if (sessionStorage.getItem('selAccountObj')) {  
            localStorage.setItem('AccountModuePopulateData',JSON.stringify(true))
          }
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
    }
    else if (route == "viewaction") {
      let parentId = data.objectRowData[0].id;
      encId = this.encrDecrService.set("EncryptionEncryptionEncryptionEn", parentId, "DecryptionDecrip");
      sessionStorage.setItem('ActivityListRowId', JSON.stringify(encId))
      sessionStorage.setItem('ActivityGroupName', data.objectRowData[0].Name)
      this.actionListService.meetingDetailsInfo = undefined
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
        this.getAllActivitiesList(data, false, false)
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
        await this.offlineService.ClearActivityIndexTableData()
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

  ngOnDestroy(): void {
    this.allActivityState.unsubscribe()
  }
}
