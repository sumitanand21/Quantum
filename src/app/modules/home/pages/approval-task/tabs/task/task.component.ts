import { Component, OnInit } from '@angular/core';

import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog} from '@angular/material/dialog';
import { taskService, DataCommunicationService, ErrorMessage, taskheader } from '@app/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { LoadTaskTableList, ClearTaskList } from '@app/core/state/actions/home.action';
import { selectTaskTable } from '@app/core/state/selectors/home/task.selector';
import { DatePipe } from '@angular/common';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { environment as env } from '@env/environment';
import { HomeService } from '@app/core/services/home.service';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;
@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})

export class TaskComponent implements OnInit {
  TaskListRequestbody = {
    PageSize: 50,
    RequestedPageNumber: 1,
    OdatanextLink: "",
    Guid: this.encrDecrService.get('EncryptionEncryptionEncryptionEn', (localStorage.getItem("userID")), 'DecryptionDecrip')
  }
  tableTotalCount: any;
  tasklistUserGuid: any;
  isLoading: boolean;
  taskTable = [];
  UserId: any;
  constructor(
    public homeService: HomeService,
    private taskService: taskService,
    public service: DataCommunicationService,
    public encrDecrService: EncrDecrService,
    public errorMessage: ErrorMessage,
    private router: Router,
    public dialog: MatDialog,
    private store: Store<AppState>,
    public datePipe: DatePipe,public envr : EnvService) { }

  ngOnInit() {
    // let Userguid = (localStorage.getItem("userID"))
    //  this.tasklistUserGuid = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', Userguid, 'DecryptionDecrip');
    this.UserId = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', (localStorage.getItem("userID")), 'DecryptionDecrip')
    this.store.pipe((select(selectTaskTable))).subscribe(res => {
      console.log("task list response----->")
      console.log(res)
      if (res) {
        if (res.ids.length > 0) {
          this.taskTable = this.filterTableData(Object.values(res.entities))
          this.tableTotalCount = res.count;
          this.TaskListRequestbody.OdatanextLink = res.nextlink
        } else {
          this.isLoading = true;
          this.getTaskList(this.TaskListRequestbody, true, false, true)
        }
      }
      else {
        this.isLoading = true;
        this.getTaskList(this.TaskListRequestbody, true, false, true)
      }
    })
  }

  getTaskList(reqBody, isConcat, isSearch, isLoader) {
    (reqBody.RequestedPageNumber == 1 && isLoader) ? this.isLoading = true : this.isLoading = false;
    // this.taskService.getTaskList(reqBody).subscribe(res => {
      let useFulldata = {
        pageNo: this.TaskListRequestbody.RequestedPageNumber,
        pageSize: this.TaskListRequestbody.PageSize,
        nextLink: this.TaskListRequestbody.OdatanextLink,
        userId: this.UserId
      },
      reqparam = this.taskService.GetAppliedFilterData({...reqBody, useFulldata:useFulldata})
      this.taskService.getAppliedFilterTaskData(reqparam).subscribe(res => {
      console.log(res)
      this.isLoading = false;
      if (!res.IsError) {
        if (res.ResponseObject.length > 0) {
          const ImmutabelObj = Object.assign({}, res)
          const perPage = reqBody.PageSize;
          const start = ((reqBody.RequestedPageNumber - 1) * perPage) + 1;
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
            this.TaskListRequestbody.OdatanextLink = res.OdatanextLink
          }
          if (isConcat) {
            let spliceArray = [];
            this.taskTable.map((res) => {
              if (res.index >= start && res.index <= end) {
                spliceArray.push(res);
              }
            });
            spliceArray.map(res => {
              this.taskTable.splice(this.taskTable.indexOf(res), 1);
            })
            if (!isSearch) {
              ImmutabelObj.ResponseObject.map(x => x.id = x.ActivityId)
              const TaskListAction = {
                tasklistdata: ImmutabelObj.ResponseObject,
                count: ImmutabelObj.TotalRecordCount,
                nextlink: ImmutabelObj.OdatanextLink
              }
              this.store.dispatch(new LoadTaskTableList({ taskList: TaskListAction }))
            } else {
              this.taskTable = this.taskTable.concat(this.filterTableData(res.ResponseObject))
            }
          } else {
            this.taskTable = this.filterTableData(res.ResponseObject)
          }
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.taskTable = [{}]
          this.tableTotalCount = 0;
        }
      } else {
        this.taskTable = [{}]
        this.tableTotalCount = 0;
        this.isLoading = false;
      }
    })
  }

  SearchTable(data): void {
    console.log("serach!@##$$")
    console.log(data)
    this.TaskListRequestbody.RequestedPageNumber = 1
    this.TaskListRequestbody.OdatanextLink = ""
    if (data != "") {
      if (data.objectRowData != "" && data.objectRowData != undefined) {
        let TaskSearch = {
          "SearchText": data.objectRowData,
          "PageSize": this.TaskListRequestbody.PageSize,
          "Id": "",// by default we shd ask 5 data on search
          "Guid": this.UserId
        }
        this.taskService.getSearchTask(TaskSearch).subscribe(res => {
          if (!res.IsError) {
            if (res.ResponseObject.length > 0) {
              let i = 1;
              res.ResponseObject.map(res => {
                res.number = i
                res.index = i;
                i = i + 1;
              })
              this.taskTable = this.filterTableData(res.ResponseObject)
              this.TaskListRequestbody.OdatanextLink = res.OdatanextLink
              this.tableTotalCount = res.TotalRecordCount
            } else {
              this.taskTable = [{}]
              this.tableTotalCount = 0;
            }
          }
        })
      } else {
        this.getTaskList(this.TaskListRequestbody, false, false, false)
      }
    }
  }

  getNewTableData(event) {
    if (event.action == 'pagination') {
      this.TaskListRequestbody.PageSize = event.itemsPerPage;
      this.TaskListRequestbody.RequestedPageNumber = event.currentPage;
      this.getTaskList(event, true, false, true)
    }
  }

  filterTableData(data) {
    if (data.length > 0) {
      return data.map((res, i) => {
        return {
          activityId: res.ActivityId,
          number: (res.number) ?  (res.number).toString() : "NA",
          desc: (res.Description) ? res.Description : "NA",
          priority: (res.Priority) ? res.Priority : "NA",
          date: (res.DueDate) ? res.DueDate : "NA",
          index: res.index,
          id: res.index,
          Subject: res.Subject,
          RegardingobjectId: res.RegardingobjectId,
          statusclass: res.Priority == 'High' ? 'high' : '' || res.Priority == 'Low' ? 'low' : '' || res.Priority == 'Normal' ? 'normal' : ''
        }
      })
    } else {
      this.tableTotalCount = 0
      return [{}]
    }
  }

  performTableChildAction(childActionRecieved): Observable<any> {
    this.isLoading = false;
    var actionRequired = childActionRecieved;
    console.log(actionRequired.action);
    switch (actionRequired.action) {
      case 'Name': {
        return of('Name Trigger');
      }
      case 'search': {
        this.SearchTable(childActionRecieved)
        return
      }
      case 'desp': {
        this.viewTaskDetails(childActionRecieved)
        return
      }
      case 'DownloadCSV': {
        console.log("downloafing")
        this.downloadList(childActionRecieved);
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
      case 'sortHeaderBy':{
        this.TaskListRequestbody.OdatanextLink=''
        this.TaskListRequestbody.RequestedPageNumber=1
        this.CallListDataWithFilters(childActionRecieved);
        return
      }
      case "Ticked" : {
        this.GetStatusComplete(actionRequired);
        console.log("Approve","Approve")
        return
      }
      case 'ClearAllFilter': {
        this.clearallFilter();
        break;
      }
    }
  }

  clearallFilter(){
    this.getTaskList(this.TaskListRequestbody, false, false, true)
  }

  GetStatusComplete(actionRequired) {
    this.isLoading = true;
     let Id = actionRequired['objectRowData'][0]['activityId'];
    this.homeService.getStatusComplete(Id).subscribe(async res => {
      this.isLoading = false;
      if (res.IsError === false) { 
        this.errorMessage.throwError(res.Message);
        this.store.dispatch(new ClearTaskList())
      } else {
        this.errorMessage.throwError(res.Message);
      }
    },error => {
      this.isLoading = false;
    })
     console.log(actionRequired['objectRowData'][0]['activityId'])
  }

  downloadList(data): void {
    this.isLoading = true
      let useFulldata = {
        pageNo: this.TaskListRequestbody.RequestedPageNumber,
        pageSize: this.TaskListRequestbody.PageSize,
        nextLink: this.TaskListRequestbody.OdatanextLink,
        userId: this.UserId
      }
      let reqparam = this.taskService.GetAppliedFilterData({ ...data, useFulldata: useFulldata})
      this.taskService.downloadLeadList(reqparam).subscribe(res => {
      if (!res.IsError) {
        this.isLoading = false
        if (this.envr.envName === 'MOBILEQA') {
          this.downloadListMobile(res.ResponseObject)
        } else {
          window.open(res.ResponseObject.Url, "_blank");
        }
      } else {
        this.isLoading = false
        this.errorMessage.throwError(res.Message)
      }
    }, error => {
      this.isLoading = false
    })
  }

  downloadListMobile(fileInfo) {
    var fileTransfer = new FileTransfer();
    var newUrl = fileInfo.url.substr(0, fileInfo.Url.indexOf("?"))
    var uri = encodeURI(newUrl);
    var fileURL = "///storage/emulated/0/DCIM/" + fileInfo.Name;
    this.errorMessage.throwError(`${fileInfo.Name} downloaded`)
    fileTransfer.download(
      uri, fileURL, function (entry) {
        console.log("download complete: " + entry.toURL());
      },
      function (error) {
        console.log("download error source " + error.source);
        console.log("download error target " + error.target);
        console.log("download error code" + error.code);
      },
      null, {
        //     "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
        //  } headers: {
        // 
      }
    );
  }

  GetColumnSearchFilters(data) {
    let headerName = data.filterData.headerName
    this.TaskListRequestbody.OdatanextLink = ''
    this.filterConfigData[headerName].PageNo = 1
    this.filterConfigData[headerName].NextLink = ''
    this.generateFilterConfigData(data, headerName, false, true)
  }
  LoadMoreColumnFilter(data) {
    let headerName = data.filterData.headerName
    this.filterConfigData[headerName].PageNo = this.filterConfigData[headerName].PageNo + 1
    this.generateFilterConfigData(data, headerName, true, true)
  }

  // ------------------------------------------------table filter start------------------------------------------------------------------
  filterConfigData = {
    number: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    desc: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    priority: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    date: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    isFilterLoading: false
  };

  GetColumnFilters(data) {
    if (data.filterData) {
      if (!data.filterData.isApplyFilter) {
        let headerName = data.filterData.headerName
        this.filterConfigData[headerName].data = [];
        this.filterConfigData[headerName].PageNo = 1;
        this.generateFilterConfigData(data, headerName, false, this.CheckFilterServiceFlag(data, headerName))
      } else {
        if (data.filterData.isApplyFilter && this.service.CheckFilterFlag(data)) {
          this.TaskListRequestbody.OdatanextLink = ''
          this.TaskListRequestbody.RequestedPageNumber = 1
          this.CallListDataWithFilters(data)
        } else if (data.filterData.isApplyFilter && data.filterData.globalSearch != "") {
          this.CallListDataWithFilters(data)
        } else {
          this.TaskListRequestbody.OdatanextLink = ''
          this.TaskListRequestbody.RequestedPageNumber = 1
          this.getTaskList(this.TaskListRequestbody, true, false, false)
        }
      }
    }
  }

  generateFilterConfigData(data, headerName, isConcat, isServiceCall?) {
    debugger
    if (isServiceCall) {
      // let headerName = data.filterData.headerName
      let useFulldata = {
        headerName: headerName,
        searchVal: data.filterData.columnSerachKey,
        pageNo: this.filterConfigData[headerName].PageNo,
        pageSize: 10,
        nextLink: this.filterConfigData[headerName].NextLink,
        userId: this.UserId
      }
      this.taskService.getActionListConfigData({ ...data, useFulldata: useFulldata }).subscribe(res => {
        this.filterConfigData.isFilterLoading = false;
        this.filterConfigData[headerName] = {
          data: (isConcat) ? this.filterConfigData[headerName]["data"].concat(res.ResponseObject) : res.ResponseObject,
          recordCount: res.TotalRecordCount,
          NextLink: res.OdatanextLink,
          PageNo: res.CurrentPageNumber
        }
      })
    } else {
      this.filterConfigData.isFilterLoading = false;
      if (data.filterData.filterColumn[headerName].length > 0) {
        this.filterConfigData[headerName]["data"] = this.RemoveSelectedItems(this.filterConfigData[headerName]["data"], data.filterData.filterColumn[headerName], 'id').concat(data.filterData.filterColumn[headerName])
      }
    }
  }

  CheckFilterServiceFlag(data, headerName): boolean {
    if (data) {
      if (data.action == "columnFilter" && data.filterData.columnSerachKey == '' && this.filterConfigData[headerName]["data"].length <= 0) {
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
  /**
     * 
     * @param array1 from where
     * @param array2 which al 
     * @param key key
     */
  RemoveSelectedItems(array1, array2, key) {
    return array1.filter(item1 =>
      !array2.some(item2 => (item2[key] === item1[key])))
  }

  CallListDataWithFilters(data) {
    console.log(data)
    let useFulldata = {
      pageNo: this.TaskListRequestbody.RequestedPageNumber,
      pageSize: this.TaskListRequestbody.PageSize,
      nextLink: this.TaskListRequestbody.OdatanextLink,
      userId: this.UserId
    }
    let reqparam = this.taskService.GetAppliedFilterData({ ...data , useFulldata:useFulldata})
    this.taskService.getAppliedFilterTaskData(reqparam).subscribe(res => {
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
          this.taskTable = this.filterTableData(res.ResponseObject)
          this.TaskListRequestbody.OdatanextLink = res.OdatanextLink
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.taskTable = [{}]
          this.tableTotalCount = 0
        }
      } else {
        this.taskTable = [{}]
        this.tableTotalCount = 0
        this.errorMessage.throwError(res.Message)
      }
    })
  }
// ------------------------------------------------table filter end------------------------------------------------------------------

viewTaskDetails(task) {
  console.log('task', task)
  if (task.objectRowData[0].Subject == 'Meeting Enrichment' && task.objectRowData[0].RegardingobjectId != "") {
    let encId = this.encrDecrService.set("EncryptionEncryptionEncryptionEn", task.objectRowData[0].RegardingobjectId, "DecryptionDecrip");
    sessionStorage.setItem("MeetingListRowId", JSON.stringify(encId))
    sessionStorage.setItem('navigationfromMeeting',JSON.stringify(8))
    this.router.navigate(['/activities/meetingInfo']);
  }
  else if (task.objectRowData[0].Subject == 'Contact Enrichment' && task.objectRowData[0].RegardingobjectId != "") {
    localStorage.setItem("contactEditId", JSON.stringify(task.objectRowData[0].RegardingobjectId));
    this.router.navigate(['/contacts/Contactdetailslanding/contactDetailsChild']);
  }
  else {
    sessionStorage.setItem("ActivityId", JSON.stringify({id:task.objectRowData[0].activityId,navigation:this.router.url}));
    this.router.navigate(['/activities/actiondetails']);
  }
  // if (task.objectRowData[0].Subject != 'Meeting Enrichment' && task.objectRowData[0].Subject != 'Contact Enrichment' && task.objectRowData[0].Subject != 'action account')
  // {
  //   return false
  // }  
}
}
