import { Injectable } from '@angular/core';

import { JsonApiService } from './json-api.service';
import { Observable, of } from 'rxjs';

import { approval } from '../models/approval.model';
import { ApiService } from './api.service';
import { OfflineService } from './offline.services';
import { DatePipe } from '@angular/common';
import { switchMap } from 'rxjs/operators';
// import { ApiServiceUI } from './api.service';

const routes = {
    // approvals: '/approval',
    getApprovalList: 'v1/NotificationManagement/GetApprovalList',
    SearchApproval: 'v1/NotificationManagement/SearchApprovalList',
    getApprovalPriorityfilterlist:'v1/NotificationManagement/SearchApprovalColumnPriority',
    getApprovalDeacfilterlist:'v1/NotificationManagement/SearchApprovalColumnDescription',
    getApprovalDueDatefilterlist:'v1/NotificationManagement/SearchApprovalColumnDueDate',
    getApprovallistDownload:'v1/NotificationManagement/DownloadApprovalList',
    getApprovalFilteredList:'v1/NotificationManagement/FilterApprovalList',


    approval: (id: number) => `/approval/${id}`
};

export const approvalheader: any[] = [
    // { id: 1, isFilter: false, name: 'number', isFixed: true, order: 1, title: 'No.' },
    { id: 1, isFilter: false, name: 'desc', isFixed: true, order: 1, title: 'Description' , SortId:29},
    { id: 2, isFilter: false, name: 'priority', isFixed: false, order: 2, title: 'Priority', isStatus: true, isHideColumnSearch:true, SortId:16, displayType: 'capsFirstCase' },
    { id: 3, isFilter: false, name: 'dueDate', isFixed: false, order: 3, title: 'Due date', isHideColumnSearch:true, SortId:15 , displayType: 'date', dateFormat:'dd-MMM-yyyy' },

]

@Injectable({
    providedIn: 'root'
})
export class approvalService {
    cachedArray = [];
    public readonly approvalListCacheType = {
        Table: "Table",
        Details: "Details",
        MeetingTypes: "MeetingTypes"
    }
    constructor(
        private jsonApiService: JsonApiService,
        private apiService: ApiService,
        public offlineServices: OfflineService,
        public datepipe: DatePipe,
    ) { }

    // getAll(): Observable<approval[]> {
    //     return this.apiService.get(routes.approvals);
    // }

    getSingle(id: number): Observable<approval> {
        return this.apiService.get(routes.approval(id));
    }
    getParentHeaderData(): Observable<any[]> {
        return of(approvalheader);
    }
    getApprovalList(reqBody): Observable<any> {
         return this.apiService.post(routes.getApprovalFilteredList, reqBody);
        // return this.apiService.post(routes.getApprovalList, reqBody);
        // v1/NotificationManagement/FilterApprovalList
    }
    getSearchApproval(reqBody): Observable<any> {
        return this.apiService.post(routes.SearchApproval, reqBody)
    }

    // getApprovalFilterDesc(reqBody): Observable<any> {
    //     return this.apiService.post(routes.getApprovalDeacfilterlist, reqBody)
    // }

    // getApprovalFilterPriority(reqBody): Observable<any> {
    //     return this.apiService.post(routes.getApprovalPriorityfilterlist, reqBody)
    // }

    // getApprovalFilteDueDate(reqBody): Observable<any> {
    //     return this.apiService.post(routes.getApprovalDueDatefilterlist, reqBody)
    // }
    // downloadLeadList(reqBody):Observable<any>{
    //     return this.apiService.post(routes.getApprovallistDownload,reqBody)
    // }

    async getCachedApprovalList() {
        const TablePageData = await this.offlineServices.getApprovalListIndexCacheData()
        if (TablePageData.length > 0) {
            return TablePageData[0]
        } else {
            console.log("else condition-->")
            return null
        }
    }

    //////////////   Task module Table Filter //////////////////////////////

    // getAppliedFilterTaskData(body) {
    //     return this.apiService.post(routes.getApprovalFilteredList, body)
    // }

    // getActionListConfigData(data): Observable<any> {

    //     debugger
    //     switch (data.filterData.headerName) {
    //         case 'desc':
    //             return this.getdescColumnFilterData(data)
    //         case 'priority':
    //             return this.getpriorityColumnFilterData(data)
    //         case 'dueDate':
    //             return this.getdateColumnFilterData(data)
    //         default:
    //             return of([])
    //     }

    // }
    // getpriorityColumnFilterData(data: any): Observable<any> {
    //     if (data) {

    //         let body = {
    //             "SearchText": data.useFulldata.searchVal,
    //             "PageSize": data.useFulldata.pageSize,
    //             "Id": "",
    //             "Guid": data.useFulldata.userId
    //         }

    //         return this.getApprovalFilterPriority(body).pipe(switchMap(res => {
    //             if (res) {
    //                 return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterApprovalPriorityColumn(res.ResponseObject) : [] } : [])
    //             } else {
    //                 return of([])
    //             }
    //         }))

    //     }
    // }

    // filterApprovalPriorityColumn(data) {
    //     if (data) {
    //         if (data.length > 0) {
    //             return data.map(x => {
    //                 return {

    //                     id: (x.Id) ? x.Id : '',
    //                     name: (x.Name) ? x.Name : '',
    //                     isDatafiltered: false
    //                 }
    //             })
    //         } else {
    //             return []
    //         }
    //     } else {
    //         return []
    //     }
    // }

    // getdescColumnFilterData(data: any): Observable<any> {
    //     if (data) {

    //         let body = {
    //             "SearchText": data.useFulldata.searchVal,
    //             "PageSize": data.useFulldata.pageSize,
    //             "Id": "",
    //             "Guid": data.useFulldata.userId
    //         }

    //         return this.getApprovalFilterDesc(body).pipe(switchMap(res => {
    //             if (res) {
    //                 return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterApprovalDescColumn(res.ResponseObject) : [] } : [])
    //             } else {
    //                 return of([])
    //             }
    //         }))

    //     }
    // }

    // filterApprovalDescColumn(data) {

    //     if (data) {
    //         if (data.length > 0) {
    //             return data.map(x => {
    //                 return {

    //                     name: (x.Description) ? x.Description : '',
    //                     isDatafiltered: false
    //                 }
    //             })
    //         } else {
    //             return []
    //         }
    //     } else {
    //         return []
    //     }
    // }

    // getdateColumnFilterData(data: any): Observable<any> {
    //     if (data) {

    //         let body = {
    //             "SearchText": data.useFulldata.searchVal,
    //             "PageSize": data.useFulldata.pageSize,
    //             "Id": "",
    //             "Guid": data.useFulldata.userId
    //         }

    //         return this.getApprovalFilteDueDate(body).pipe(switchMap(res => {
    //             if (res) {
    //                 return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterApprovalDueDateColumn(res.ResponseObject) : [] } : [])
    //             } else {
    //                 return of([])
    //             }
    //         }))

    //     }
    // }

    // filterApprovalDueDateColumn(data) {
    //     if (data) {
    //         if (data.length > 0) {
    //             return data.map(x => {
    //                 return {

    //                     name: (x.DueDate) ? this.datepipe.transform(x.DueDate, 'd-MMM-yyyy') : '',
    //                     dueDate: (x.DueDate) ? x.DueDate : '',
    //                     isDatafiltered: false
    //                 }
    //             })
    //         } else {
    //             return []
    //         }
    //     } else {
    //         return []
    //     }
    // }

}
    
