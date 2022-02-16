import { Injectable } from '@angular/core';
import { JsonApiService } from './json-api.service';
import { Observable, of } from 'rxjs';
import { task } from '../models/task.model';
import { ApiService } from './api.service';
import { OfflineService } from './offline.services';
import { switchMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { DateModifier } from './date-modifier';

const routes = {
    Gettasks: 'v1/NotificationManagement/GetTaskList',
    SearchTask:'v1/NotificationManagement/SearchTaskList',
    getTaskFilteredList: "v1/NotificationManagement/FilterTaskList",
    getDeacfilterlist: "v1/NotificationManagement/SearchTaskColumnDescription",
    getPriorityfilterlist: "v1/NotificationManagement/SearchTaskColumnPriority",
    getDueDatefilterlist:"v1/NotificationManagement/SearchTaskColumnDueDate",
    getTasklistDownload:"v1/NotificationManagement/DownloadTaskList",
    task: (id: number) => `/task/${id}`
}

export const taskheader: any[] = [
    // { id: 1, isFilter: false, name: 'number', isFixed: true, order: 1, title: 'No.' },
    { id: 1, isFilter: false, name: 'desc', isFixed: true, order: 1, title: 'Description', SortId:29 },
    { id: 2, isFilter: false, name: 'priority', isFixed: false, order: 2, title: 'Priority', isHideColumnSearch:true, isStatus: true, SortId:16, displayType: 'capsFirstCase'},
    { id: 3, isFilter: false, name: 'date', isFixed: false, order: 3,  isHideColumnSearch:true, title: 'Due date',  SortId:15, displayType: 'date', dateFormat:'dd-MMM-yyyy'  },

]

@Injectable({
    providedIn: 'root'
})
export class taskService {
    cachedArray = [];
    public readonly TaskCacheType = {
        Table: "Table",
        Details: "Details",
        MeetingTypes: "MeetingTypes"
    }
    //static json
    constructor(
        private jsonApiService: JsonApiService,
        private apiService: ApiService,
        public datepipe: DatePipe,
        private offlineServices: OfflineService) { }

    getAll(): Observable<task[]> {
        return of ()
        // return this.apiService.get(routes.tasks);
    }

    getSingle(id: number): Observable<task> {
        return this.apiService.get(routes.task(id));
    }
    getParentHeaderData(): Observable<any[]> {
        return of(taskheader);
    }

    downloadLeadList(reqBody):Observable<any>{
        return this.apiService.post(routes.getTasklistDownload,reqBody)
    }

   getTaskList(reqBody):Observable<any>{
    return this.apiService.post(routes.Gettasks,reqBody)
   }
   getSearchTask(reqBody):Observable<any>{
    return this.apiService.post(routes.SearchTask,reqBody)
   }

   getTaskFilterDesc(reqBody):Observable<any>{
    return this.apiService.post(routes.getDeacfilterlist,reqBody)
   }

   getTaskFilterPriority(reqBody):Observable<any>{
    return this.apiService.post(routes.getPriorityfilterlist,reqBody)
   }
   
   getTaskFilteDueDate(reqBody):Observable<any>{
    return this.apiService.post(routes.getDueDatefilterlist,reqBody)
   }

  async getCachedTaskList() {
    const TablePageData = await this.offlineServices.getTaskListIndexCacheData()
    if (TablePageData.length > 0) {
      return TablePageData[0]
    } else {
      console.log("else condinti")
      return null
    }
  }

      //////////////   Task module Table Filter //////////////////////////////
      getAppliedFilterTaskData(body) {
        return this.apiService.post(routes.getTaskFilteredList, body)
    }

    GetAppliedFilterData(data) {
        return {
          "ColumnSearchText": (data.filterData) ? (data.filterData.columnSerachKey) ? data.filterData.columnSerachKey : "" : "",
          "SearchText": (data.filterData) ? (data.filterData.globalSearch) ? data.filterData.globalSearch : "" : "",
          "ProirityCodes": (data.filterData)? (data.filterData.filterColumn)? this.pluckParticularKey(data.filterData.filterColumn['priority'], 'id'):[]:[],
          "Descriptions":(data.filterData)? (data.filterData.filterColumn)? this.pluckParticularKey(data.filterData.filterColumn['desc'], 'name'):[]:[],
          "OwnerGuids": [data.useFulldata.userId],
          "PageSize": data.useFulldata.pageSize,
          "RequestedPageNumber": data.useFulldata.pageNo,
          "IsDesc":(data.filterData)? (data.filterData.sortColumn!='')?!data.filterData.sortOrder:true:true,
          "SortBy":(data.filterData) ? (data.filterData.filterColumn)?this.checkFilterListApiCall(data)?this.pluckParticularKey(taskheader.filter(x=>x.name==data.filterData.sortColumn),'SortId')[0]:["15"]:["15"]:["15"],
          "StartDate": (data.filterData) ? (data.filterData.filterColumn['date'][0].filterStartDate !== '') ? this.dateModifier(data.filterData.filterColumn['date'][0].filterStartDate) : "" : "",
          "EndDate": (data.filterData) ? (data.filterData.filterColumn['date'][0].filterEndDate !== '') ? this.dateModifier(data.filterData.filterColumn['date'][0].filterEndDate) : "" : ""
        }
    }
    checkFilterListApiCall(data) {
        if (data.filterData.order.length > 0 || data.filterData.sortColumn != "") {
            return true;
        }else {
            return false
        }
    }
    pluckParticularKey(array, key) {
        return array.map(function (item) { return (item[key]) });
    }

    dateModifier(dateConvert) {
        let dataModifier = new DateModifier();
        return dataModifier.modifier(dateConvert)
      }
      getActionListConfigData(data): Observable<any> {
        debugger
        switch (data.filterData.headerName) {
            case 'desc':
                return this.getdescColumnFilterData(data)
            case 'priority':
                return this.getpriorityColumnFilterData(data)
            default:
                return of([])
        }
    }

    getpriorityColumnFilterData(data: any): Observable<any> {
        if (data) {
            let body = this.GetAppliedFilterData({...data})
            return this.getTaskFilterPriority(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterTaskPriorityColumn(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))
        }
    }

    filterTaskPriorityColumn(data){
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        id: (x.PriorityCode) ? x.PriorityCode : '',
                        name: (x.Priority) ? x.Priority : '',
                        isDatafiltered: false
                    }
                })
            } else {
                return []
            }
        } else {
            return []
        } 
    }
    
    getdescColumnFilterData(data: any): Observable<any> {
        if (data) {
            let body = this.GetAppliedFilterData({...data})
            return this.getTaskFilterDesc(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterTaskDescColumn(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))
        }
    }

    filterTaskDescColumn(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        id:  (x.Description) ? x.Description : '',
                        name: (x.Description) ? x.Description : '',
                        isDatafiltered: false
                    }
                })
            } else {
                return []
            }
        } else {
            return []
        }
    }

}
