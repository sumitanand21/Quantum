import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DataCommunicationService } from '@app/core/services/global.service';
import { OthersListService, ExpandHeaderOthers } from '@app/core/services/others-list.service';
import { DatePipe } from '@angular/common';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { OnlineOfflineService } from '@app/core/services/online-offline.service';
import { getOtherActivityListByParentIdActivity } from '@app/core/state/selectors/activity/activity.selector';
import { LoadOtherActivityListByParentId, ClearOtherListdata } from '@app/core/state/actions/activities.actions';
import { RoutingState } from '@app/core/services/navigation.service';
import { ErrorMessage } from '@app/core/services/error.services';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
@Component({
  selector: 'app-others-list',
  templateUrl: './others-list.component.html',
  styleUrls: ['./others-list.component.scss']
})

export class OthersListComponent implements OnInit {
  othersTable = [];
  conversationTable = [];
  isLoading: boolean = false;
  AllOtherActivityRequestBody = {
    "PageSize": 50,
    "RequestedPageNumber": 1,
    "OdatanextLink": "",
    "Guid": ""
  };
  tableTotalCount: number = 0;
  paginationPageNo: any;
  selectedTabValue = "";
  id: any;
  name: any;
  ActivityId;
  archived: any;
  duration: any;
  durationToBind: any;
  parentId: any;
  filterConfigData = {
    name: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    date: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    duration: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    participants: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    leads: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    opportunities: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    isFilterLoading: false
  };
  constructor(private OthersListService: OthersListService,
    private router: Router,
    public datepipe: DatePipe,
    private store: Store<AppState>,
    private onlineService: OnlineOfflineService,
    public service: DataCommunicationService,
    public routingState: RoutingState,
    private PopUp: ErrorMessage,
    private encrDecrService: EncrDecrService,
    private route: ActivatedRoute) { }

  async ngOnInit() {
    this.parentId = JSON.parse(localStorage.getItem("forMeetingCreation"));
    this.name = this.route.snapshot.parent.paramMap.get('name');
    this.isLoading = true;
    this.ActivityId = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', JSON.parse(sessionStorage.getItem("ActivityListRowId")), 'DecryptionDecrip')
    this.AllOtherActivityRequestBody.Guid = this.ActivityId
    if (sessionStorage.getItem('archivedStatus')) {
      this.archived = JSON.parse(sessionStorage.getItem('archivedStatus'))
      this.service.archiveTag = this.archived;
    }
    if (!this.onlineService.isOnline) {
      const CacheResponse = await this.OthersListService.getCacheOtherActivityListById(this.AllOtherActivityRequestBody.Guid);
      if (CacheResponse) {
        if (CacheResponse.data.length > 0) {
          this.isLoading = false;
          this.othersTable = this.filterTableData(CacheResponse.data)
          this.tableTotalCount = CacheResponse.count
          this.AllOtherActivityRequestBody.OdatanextLink = CacheResponse.nextlink
        }
      } else {
        this.getAllOtherLists(this.AllOtherActivityRequestBody, true, false);
      }
    }
    this.store.pipe(select(getOtherActivityListByParentIdActivity(this.AllOtherActivityRequestBody.Guid))).subscribe(res => {
      this.isLoading = false;
      if (res) {
        if (res.list) {
          if (res.list.data.length > 0) {
            this.othersTable = this.filterTableData(res.list.data);
            this.othersTable.map((res, index) => {
              res.index = index + 1;
            });
            this.AllOtherActivityRequestBody.OdatanextLink = res.list.nextlink
            this.tableTotalCount = res.list.count;
          } else {
            this.getAllOtherLists(this.AllOtherActivityRequestBody, true, false);
          }
        } else {
          this.getAllOtherLists(this.AllOtherActivityRequestBody, true, false);
        }
      } else {
        this.getAllOtherLists(this.AllOtherActivityRequestBody, true, false);
      }
    });
  }

  getAllOtherLists(reqBody, isConcat, isSearch) {
    this.isLoading = true;

    // this.OthersListService.OtherActivityList(reqBody).subscribe(res => {
      let useFulldata={
        pageSize: 50,
        pageNo: this.AllOtherActivityRequestBody.RequestedPageNumber,
        Guid: this.AllOtherActivityRequestBody.Guid
      }
      let reqparam = this.OthersListService.GetAppliedFilterData({ ...reqBody, useFulldata:useFulldata })
      this.OthersListService.getAppliedOtherListFilterData(reqparam).subscribe(res => {
      if (!res.IsError) {
        this.isLoading = false;
        if (res.ResponseObject.length > 0) {
          const ImmutableData = Object.assign({}, res)
          const perPage = this.AllOtherActivityRequestBody.PageSize;
          const start = ((this.AllOtherActivityRequestBody.RequestedPageNumber - 1) * perPage) + 1;
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
            this.AllOtherActivityRequestBody.OdatanextLink = res.OdatanextLink
          }
          if (isConcat) {
            let spliceArray = [];
            this.othersTable.map((res) => {
              if (res.index >= start && res.index <= end) {
                spliceArray.push(res);
              }
            });
            spliceArray.map(res => {
              this.othersTable.splice(this.othersTable.indexOf(res), 1);
            })
            if (!isSearch) {
              ImmutableData.ResponseObject.map(x => x.id = x.Guid)
              const otherActivityList = {
                parentId: this.AllOtherActivityRequestBody.Guid,
                list: {
                  data: ImmutableData.ResponseObject,
                  count: ImmutableData.TotalRecordCount,
                  // nextlink: ImmutableData.OdatanextLink
                  nextlink: this.AllOtherActivityRequestBody.OdatanextLink
                }
              }
              debugger;;
              this.othersTable = this.othersTable.concat(this.filterTableData(res.ResponseObject))
              this.store.dispatch(new LoadOtherActivityListByParentId({ others: otherActivityList }))
            } else {
              this.othersTable = this.othersTable.concat(this.filterTableData(res.ResponseObject))
            }
          } else {
            // need to handle the search when api is ready!
            this.othersTable = this.filterTableData(res.ResponseObject)
          }
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.othersTable = [{}]
        }
      } else {
        this.othersTable = [{}]
        this.isLoading = false;
        this.PopUp.throwError(res.Message)
      }
    },error => {
      this.othersTable = [{}]
      this.isLoading = false;
    })
  }

  filterTableData(data: Array<any>) {
    if (data) {
      return data.map(res => {
        try {
          const Leads = [];
          const Opportunity = [];
          const participants = [];
          if (res.Lead.length > 0) {
            res.Lead.forEach(element => {
              Leads.push(element.Title)
            });
          }
          if (res.Opportunity.length > 0) {
            res.Opportunity.forEach(element => {
              Opportunity.push(element.Title)
            });
          }
          if (res.WiproParticipant.length > 0) {
            res.WiproParticipant.forEach(element => {
              participants.push(element.FullName)
            });
          }
          return {
            ID: res.Guid,
            name: res.Subject ? res.Subject : "NA",
            date: res.CreatedOn ? res.CreatedOn : "NA",
            duration: (res.Duration) ? this.OthersListService.durationModifier(res.Duration) : "NA",
            participants: (participants.length > 0) ? participants : ["NA"],
            leads: (Leads.length > 0) ? Leads : ["NA"],
            opportunities: (Opportunity.length > 0) ? Opportunity : ["NA"],
            EndDate: res.EndDate ? res.EndDate : "NA",
            Description: res.Description ? res.Description : "NA",
            index: res.index,
          }
        } catch (error) {
          return this.SampleRow()
        }
      })
    } else {
      return [{}]
    }
  }

  onPagination(event) {
    console.log("search event form harin function!@@@@")
    console.log(event)
    debugger;
    if (event.action == 'pagination') {
      this.AllOtherActivityRequestBody.PageSize = event.itemsPerPage;
      this.AllOtherActivityRequestBody.RequestedPageNumber = event.currentPage;
      //if search with pagination!
      this.getAllOtherLists(event, true, false);
      // if (this.service.checkFilterListApiCall(event)) {
      //   this.CallListDataWithFilters(event);
      // } else {
      //   this.getAllOtherLists(this.AllOtherActivityRequestBody, true, false);
      // }
    }
  }

  onSearchListData(data) {
    this.AllOtherActivityRequestBody.RequestedPageNumber = 1
    this.AllOtherActivityRequestBody.OdatanextLink = ""
    if (data != '') {
      if (data.objectRowData != "" && data.objectRowData != undefined) {
        // let ActivitySearch = {
        //   "SearchText": data.objectRowData,
        //   "PageSize": this.AllOtherActivityRequestBody.PageSize,
        //   "Guid": this.encrDecrService.get('EncryptionEncryptionEncryptionEn', JSON.parse(sessionStorage.getItem("ActivityListRowId")), 'DecryptionDecrip')
        // }
        // console.log('ActivitySearch-->', ActivitySearch);
        // this.OthersListService.searchOtherActivityList(ActivitySearch).subscribe(res => {
          let useFulldata={
            pageSize: 50,
            pageNo: this.AllOtherActivityRequestBody.RequestedPageNumber,
            Guid: this.AllOtherActivityRequestBody.Guid
          }
          let reqparam = this.OthersListService.GetAppliedFilterData({ ...data, useFulldata:useFulldata })
          this.OthersListService.getAppliedOtherListFilterData(reqparam).subscribe(res => {
          if (!res.IsError) {
            if (res.ResponseObject.length > 0) {
              let i = 1;
              res.ResponseObject.map(res => {
                res.index = i;
                i = i + 1;
              })
              this.othersTable = this.filterTableData(res.ResponseObject)
              this.AllOtherActivityRequestBody.OdatanextLink = res.OdatanextLink
              this.tableTotalCount = res.TotalRecordCount
            } else {
              this.othersTable = [{}]
              this.tableTotalCount = 0;
            }
          } else {
            this.isLoading = false;
            this.othersTable = [{}];
            this.tableTotalCount = 0;
            this.PopUp.throwError(res.Message)
          }
        }, error => {
          this.isLoading = false;
          this.tableTotalCount = 0;
          this.othersTable = [{}]
        })
      } else {
        this.getAllOtherLists(event, false, false);
        //this.store.dispatch(new ClearOtherListdata({ clearotherlist: this.ActivityId }))
      }
    }
  }

  performListActions(childActionRecieved): Observable<any> {
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {
      case 'name': {
        this.detailsPage(actionRequired);
        this.router.navigateByUrl('/activities/otherdetails');
        return
      }
      case 'search': {
        this.onSearchListData(actionRequired)
        return
      }
      case "columnFilter":
        console.log(JSON.stringify(childActionRecieved))
        this.GetColumnFilters(childActionRecieved);
        return
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
        this.AllOtherActivityRequestBody.OdatanextLink = ''
        this.AllOtherActivityRequestBody.RequestedPageNumber = 1
        this.CallListDataWithFilters(childActionRecieved);
        return
      }
    }
  }

  clearallFilter(){
    this.getAllOtherLists(this.AllOtherActivityRequestBody, false, false)
  }

  GetColumnSearchFilters(data) {
    let headerName = data.filterData.headerName
    this.AllOtherActivityRequestBody.OdatanextLink = ''
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
        this.generateFilterConfigData(data, headerName, false, this.CheckFilterServiceFlag(data, headerName))
      } else {
        if (data.filterData.isApplyFilter && this.service.CheckFilterFlag(data)) {
          this.AllOtherActivityRequestBody.OdatanextLink = ''
          this.AllOtherActivityRequestBody.RequestedPageNumber = 1
          this.CallListDataWithFilters(data)
        } else if (data.filterData.isApplyFilter && data.filterData.globalSearch != ""){
          this.CallListDataWithFilters(data)
        } else {
          this.store.dispatch(new ClearOtherListdata({ clearotherlist: this.ActivityId }))
          this.AllOtherActivityRequestBody.OdatanextLink = ''
          this.AllOtherActivityRequestBody.RequestedPageNumber = 1
          this.getAllOtherLists(this.AllOtherActivityRequestBody, true, false);
        }
      }
    }
  }

  generateFilterConfigData(data, headerName, isConcat, isServiceCall?) {
    debugger;
    if (isServiceCall) {
      let useFulldata = {
        headerName: headerName,
        searchVal: data.filterData.columnSerachKey,
        pageNo: this.filterConfigData[headerName].PageNo,
        pageSize: 10,
        nextLink: this.filterConfigData[headerName].NextLink,
        Guid: this.AllOtherActivityRequestBody.Guid
      }
      this.OthersListService.getOtherListConfigData({ ...data, ActivityGuid: this.AllOtherActivityRequestBody.Guid, useFulldata: useFulldata }).subscribe(res => {
        this.filterConfigData.isFilterLoading = false;
        if (!res.IsError) {  
          this.filterConfigData[headerName] = {
            data: (isConcat) ? this.filterConfigData[headerName]["data"].concat(res.ResponseObject) : res.ResponseObject,
            recordCount: res.TotalRecordCount,
            NextLink: res.OdatanextLink,
            PageNo: res.CurrentPageNumber
          }
          //display the selected value in filter list
          if (data.filterData.headerName != 'date')  { 
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
          this.PopUp.throwError(res.Message)
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

  RemoveSelectedItems(array1, array2, key) {
    return array1.filter(item1 =>
      !array2.some(item2 => (item2[key] === item1[key])))
  }

  CallListDataWithFilters(data) {
    let useFulldata={
      pageSize: 50,
      pageNo: this.AllOtherActivityRequestBody.RequestedPageNumber,
      Guid: this.AllOtherActivityRequestBody.Guid
    }
    let reqparam = this.OthersListService.GetAppliedFilterData({ ...data, useFulldata:useFulldata })
    this.OthersListService.getAppliedOtherListFilterData(reqparam).subscribe(res => {
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
          this.othersTable = this.filterTableData(res.ResponseObject)
          this.AllOtherActivityRequestBody.OdatanextLink = res.OdatanextLink
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.othersTable = [{}]
          this.tableTotalCount = 0
        }
      } else {
        this.othersTable = [{}]
        this.tableTotalCount = 0
        this.PopUp.throwError(res.Message)
      }
    })
  }

  CheckFilterServiceFlag(data, headerName): boolean {
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

  detailsPage(actionRequired) {
    let OtherDetailsEditPage = { Id: actionRequired.objectRowData[0].ID, EditPage: true, Name: actionRequired.objectRowData[0].Name };
    sessionStorage.setItem("OtherDetailsEditPage", JSON.stringify(OtherDetailsEditPage));
    this.router.navigateByUrl('/activities/otheractivity');
  }
  
  SampleRow() {
    return [{}]
  }
}
