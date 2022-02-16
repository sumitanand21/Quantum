
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, from, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DataCommunicationService, OfflineService, ConversationService, ErrorMessage, CampaignService, OnlineOfflineService, ArchivedConversationService, conversationheader, headerArchived } from '@app/core/services';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { newConversationService } from '@app/core/services/new-conversation.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { LoadArchiveActivity, ClearActivity, ClearMeetingDetails } from '@app/core/state/actions/activities.actions';
import { getArchiveActivity, getArchivedActivityListById } from '@app/core/state/selectors/activity/activity.selector';
import { MeetingService } from '@app/core/services/meeting.service';
import { ClearArchivedLeadState } from '@app/core/state/actions/leads.action';
import { ActivityGroupListService } from '@app/core/services/activity-group-lists.service';
import { LeadListService } from '@app/core/services/lead-list-service';
import { MyOpenLeadsService } from '@app/core/services/myopenlead.service';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './archived-conversation.component.html',
  styleUrls: ['./archived-conversation.component.scss']
})
export class ArchivedConversationComponent implements OnInit, OnDestroy {
  archivedState: Subscription;
  public archivedTable = [];
  userGuid: any;
  isLoading: boolean = false;
  tableTotalCount: number = 0;
  allBtnsLable = ['restoreBtnVisibility']
  paginationPageNo = {
    "PageSize": this.archivedService.sendPageSize || 50,
    "RequestedPageNumber": this.archivedService.sendPageNumber || 1,
    "OdatanextLink": "",
    "FilterData": this.archivedService.sendConfigData || []
  };
  AllActivityRequestBody = {
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

  constructor(private DataCommunication: DataCommunicationService,
    private encrDecrService: EncrDecrService,
    private conversationService: ConversationService,
    private offlineService: OfflineService,
    private globalService: DataCommunicationService,
    private conversation: ConversationService,
    private router: Router,
    private newConversationService: newConversationService,
    public myopenLeadService: MyOpenLeadsService,
    public errorMessage: ErrorMessage,
    private store: Store<AppState>,
    private ActivityGroupListService: ActivityGroupListService,
    public OnlineOfflineService: OnlineOfflineService,
    public archivedService: ArchivedConversationService,
    public leadlistService: LeadListService,
    public meetingService: MeetingService
  ) { }

  async ngOnInit() {
    this.archivedService.sendConfigData = []
    this.conversation.getThreadTrue = false;
    this.conversation.conversationTrues = false;
    this.globalService.archiveTag = true
    sessionStorage.setItem('navigation', JSON.stringify(3))
    sessionStorage.setItem('actlist', JSON.stringify(4))
    let Userguid = (localStorage.getItem("userID"))
    this.userGuid = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', Userguid, 'DecryptionDecrip');
    this.archivedState = this.store.pipe(select(getArchiveActivity)).subscribe(res => {
      if (res) {
        if (res.ids.length > 0) {
          this.archivedTable = this.ActivityGroupListService.activityListData(Object.values(res.entities))
          this.tableTotalCount = res.count;
          this.AllActivityRequestBody.OdatanextLink = res.nextlink
        } else {
          this.isLoading = true
          this.getArchivedActivites(this.AllActivityRequestBody, true, false)
        }
      }
      else {
        this.isLoading = true
        this.getArchivedActivites(this.AllActivityRequestBody, true, false)
      }
    })
    // offline 
    if (!this.OnlineOfflineService.isOnline) {
      const CacheResponse = await this.archivedService.getArchivedCachedConvesartion()
      if (CacheResponse) {
        if (CacheResponse.data.length > 0) {
          this.isLoading = false
          this.archivedTable = this.ActivityGroupListService.activityListData(CacheResponse.data)
          this.tableTotalCount = CacheResponse.count
          this.AllActivityRequestBody.OdatanextLink = CacheResponse.nextlink
        }
      } else {
        this.isLoading = true
        this.getArchivedActivites(this.AllActivityRequestBody, true, false)
      }
    }
  }

  performTableChildAction(childActionRecieved): Observable<any> {
    console.log(childActionRecieved);
    if (childActionRecieved) {
      (childActionRecieved.parentData) ? this.tableTotalCount = childActionRecieved.parentData.totalCount : this.tableTotalCount = this.tableTotalCount
    }
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {
      case 'restore': {
        this.store.dispatch(new ClearMeetingDetails())
        this.restoreActivity(actionRequired)
        return;
      }
      case 'Name': {
        sessionStorage.setItem("navigation", JSON.stringify(3));
        console.log('actionRequired--->', actionRequired)
        this.archivedService.sendPageSize = actionRequired.pageData.itemsPerPage
        this.archivedService.sendPageNumber = actionRequired.pageData.currentPage
        this.archivedService.sendConfigData = actionRequired.configData.filterData
        this.Navigate(actionRequired, "link")
        return
      }
      case 'search': {
        this.SearchTable(actionRequired)
        return
      }
      case 'tabNavigation': {
        this.ActivityGroupListService.onTabNavigation(actionRequired.objectRowData[0])
        return
      }
      case "columnFilter": {
        this.GetColumnFilters(childActionRecieved);
        return
      }
      case "columnSearchFilter": {
        this.GetColumnSearchFilters(childActionRecieved);
        return
      }
      case 'loadMoreFilterData': {
        this.LoadMoreColumnFilter(childActionRecieved);
        return
      }
      case 'ClearAllFilter': {
        this.clearallFilter();
        return;
      }
      case 'sortHeaderBy': {
        this.AllActivityRequestBody.OdatanextLink = ''
        this.AllActivityRequestBody.RequestedPageNumber = 1
        this.CallListDataWithFilters(childActionRecieved);
        return
      }
    }
  }

  clearallFilter(){
    this.AllActivityRequestBody = {
      "PageSize":  this.AllActivityRequestBody.PageSize,
      "RequestedPageNumber":  1,
      "OdatanextLink": "",
      "FilterData":  []
    };
    this.getArchivedActivites(this.AllActivityRequestBody, false, false);
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
          this.AllActivityRequestBody.OdatanextLink = ''
          this.AllActivityRequestBody.RequestedPageNumber = 1
          this.CallListDataWithFilters(data)
        } else if (data.filterData.isApplyFilter && data.filterData.globalSearch != ""){
          this.CallListDataWithFilters(data)
        } else {
          this.store.dispatch(new ClearActivity())
          this.store.dispatch(new ClearArchivedLeadState())
          this.AllActivityRequestBody.OdatanextLink = ''
          this.AllActivityRequestBody.RequestedPageNumber = 1
          this.getArchivedActivites(this.AllActivityRequestBody, false, true)
        }
      }
    }
  }

  generateFilterConfigData(data, headerName, isConcat, isServiceCall?) {
    if (isServiceCall) {
      let useFulldata = {
        headerName: headerName,
        searchVal: data.filterData.columnSerachKey,
        pageNo: this.filterConfigData[headerName].PageNo,
        pageSize: 10,
        nextLink: this.filterConfigData[headerName].NextLink,
        ActivityGroupType:2
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
      },error =>{
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

    let useFulldata = {
      pageNo: this.AllActivityRequestBody.RequestedPageNumber,
      ActivityGroupType: 2, 
      pageSize:50, 
      userGuid: this.userGuid
    }

    let reqparam = this.conversationService.GetAppliedFilterData({ ...data, useFulldata: useFulldata })
    this.conversationService.getFilterList(reqparam).subscribe(res => {
      console.log(res)
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
          this.archivedTable = this.ActivityGroupListService.activityListData(res.ResponseObject)
          this.AllActivityRequestBody.OdatanextLink = res.OdatanextLink
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.archivedTable = [{}]
          this.tableTotalCount = 0
        }
      } else {
        this.archivedTable = [{}]
        this.tableTotalCount = 0
        this.errorMessage.throwError(res.Message)
      }
    })
  }

  Navigate(data, route): void {
    let encId
    if (route == "link") {
      sessionStorage.setItem('archivedStatus', "true");
      encId = this.encrDecrService.set("EncryptionEncryptionEncryptionEn", data.objectRowData[0].id, "DecryptionDecrip");
      this.DataCommunication.convActionTag = false;
      console.log("Account", data.objectRowData[0])
      let reqObject = {...data.objectRowData[0] , isAccountPopulate : true};
      sessionStorage.setItem("RequestCampaign", JSON.stringify(reqObject));
      sessionStorage.setItem('AccountNameForChildConversation', data.objectRowData[0].Account)
      sessionStorage.setItem('AccountDetailsForChildConversation', JSON.stringify({ sysGuid: data.objectRowData[0].accountSysGuid, isProspect: data.objectRowData[0].Isprospect }))
      sessionStorage.setItem('conversationParentId', data.objectRowData[0].id)
      sessionStorage.setItem('ActivityGroupName', data.objectRowData[0].Name)
      this.newConversationService.setActivityGroupName(data.objectRowData[0].Name)
      this.DataCommunication.serviceSearchItem = "";
      // this.DataCommunication.archiveTag = false
      this.meetingService.createdMeetingGuid = "";
      this.store.pipe(select(getArchivedActivityListById((data.objectRowData[0].id)))).subscribe(x => {
        console.log(x)
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
    }
  }

  restoreActivity(data) {
    console.log('restore details-->', data);
    
    let Guid: Array<any> = data.objectRowData.data.map((x) => {
      return {
        Guid: (x.id)
      }
    });
    console.log('Guids selected --->', Guid.map(x => x = x.Guid))
    const Guids: Array<string> = Guid.map(x => x = x.Guid)
    console.log('Guids-->', Guids)
    this.isLoading = true;
    this.archivedService.restoreConversation(Guid).subscribe(async res => {
      this.isLoading = false;
      if (res.IsError === false) {
        console.log('res->', res)
        await this.offlineService.ClearActivityIndexTableData()
        await this.offlineService.ClearArchivedConvIndexTableData()
        this.errorMessage.onSuccessMessage(res.Message).afterDismissed().subscribe(()=>{
          this.store.dispatch(new ClearActivity())
          if (this.router.url.includes('/accounts/accountactivities')) {
            this.router.navigateByUrl('/accounts/accountactivities/list')
          } else {
            this.router.navigateByUrl('activities/list')
          }
        })
      } else {
        this.errorMessage.throwError(res.Message)
      }
    },()=>{ this.isLoading = false;});
  }

  getNewTableData(event) {
    console.log("search event form harin function!@@@@")
    console.log(event)
    if (event.action == 'pagination') {
      // this.AllActivityRequestBody.PageSize = event.itemsPerPage;
      // this.AllActivityRequestBody.RequestedPageNumber = event.currentPage;
      // this.AllActivityRequestBody.FilterData = this.archivedService.sendConfigData || []
      // this.getArchivedActivites(event, true, false)
      if (this.AllActivityRequestBody.PageSize == event.itemsPerPage) {
        this.AllActivityRequestBody.PageSize = event.itemsPerPage;
        this.AllActivityRequestBody.RequestedPageNumber = event.currentPage;
        this.getArchivedActivites(event, true, true);
      }
      else {
        this.AllActivityRequestBody.PageSize = event.itemsPerPage;
        this.AllActivityRequestBody.RequestedPageNumber = event.currentPage;
        this.getArchivedActivites(event, false, true);
      }
    }
  }

  SearchTable(data): void {
    this.AllActivityRequestBody.RequestedPageNumber = 1
    this.AllActivityRequestBody.OdatanextLink = ""
    if (data != "") {
      if (data.objectRowData != "" && data.objectRowData != undefined) {

        // let ActivitySearch = {
        //   "SearchText": data.objectRowData,
        //   "PageSize": this.AllActivityRequestBody.PageSize,
        //   "RequestedPageNumber": 1,
        //   "OdatanextLink": ""// by default we shd ask 5 data on search
        // }
        //this.archivedService.ArchivedSearch(ActivitySearch)
        let useFulldata ={
          pageNo:this.AllActivityRequestBody.RequestedPageNumber,
          ActivityGroupType:2, 
          pageSize:this.AllActivityRequestBody.PageSize
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
              this.archivedTable = this.ActivityGroupListService.activityListData(res.ResponseObject)
              this.AllActivityRequestBody.OdatanextLink = res.OdatanextLink
              this.tableTotalCount = res.TotalRecordCount
            } else {
              this.archivedTable = [{}]
              this.tableTotalCount = 0;
            }
          } else {
            this.isLoading = false;
            this.archivedTable = [{}]
            this.tableTotalCount = 0;
            this.errorMessage.throwError(res.Message)
          }
        }, error => {
          this.isLoading = false;
          this.archivedTable = [{}];
          this.tableTotalCount = 0;
        })
      } else {
        this.getArchivedActivites(this.AllActivityRequestBody, false, false)
      }
    }
  }

  getArchivedActivites(reqBody, isConcat, isSearch) {
    let useFulldata ={
      pageNo:this.AllActivityRequestBody.RequestedPageNumber,
      ActivityGroupType:2, 
      pageSize:this.AllActivityRequestBody.PageSize
    }
    let reqparam = this.conversationService.GetAppliedFilterData({ ...reqBody, useFulldata: useFulldata})
    this.conversationService.getFilterList(reqparam).subscribe(res => {
    // this.archivedService.getAllArchivedConversations(reqBody).subscribe(res => {
      (reqBody.RequestedPageNumber == 1) ? this.isLoading = true : this.isLoading = false;
      if (!res.IsError) {
        this.isLoading = false;
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
            this.archivedTable.map((res) => {
              if (res.index >= start && res.index <= end) {
                spliceArray.push(res);
              }
            });
            spliceArray.map(res => {
              this.archivedTable.splice(this.archivedTable.indexOf(res), 1);
            })
            if (!isSearch) {
              ImmutabelObj.ResponseObject.map(x => x.id = x.Guid)
              let ActivityAction = {
                archiveActivity: ImmutabelObj.ResponseObject,
                count: ImmutabelObj.TotalRecordCount,
                nextlink: this.AllActivityRequestBody.OdatanextLink
              }
              this.store.dispatch(new LoadArchiveActivity({ archiveActivity: ActivityAction }))
            } else {
              this.archivedTable = this.archivedTable.concat(this.ActivityGroupListService.activityListData(res.ResponseObject))
            }
          } else {
            // need to handle the search when api is ready!
            this.archivedTable = this.ActivityGroupListService.activityListData(res.ResponseObject)
          }
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.archivedTable = [{}]
        }
      } else {
        this.isLoading = false;
        this.archivedTable = [{}];
        this.errorMessage.throwError(res.Message)
      }
    }, error => {
      this.isLoading = false;
      this.archivedTable = [{}]
    })
  }


  SampleRow() {
    return {} //need to send the empty object if errro haappend
  }


  ngOnDestroy() {
    this.archivedState.unsubscribe()
  }
}
