import { Injectable } from '@angular/core';

import { JsonApiService } from './json-api.service';
import { Observable, of } from 'rxjs';

import { Conversation, Customer } from '../models/conversation.model';
import { ApiService } from './api.service';
import { map, tap } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import { element } from '@angular/core/src/render3/instructions';
import { OnlineOfflineService } from './online-offline.service';
import { OfflineService } from './offline.services'
import Dexie from 'dexie';
import { EncrDecrService } from './encr-decr.service';
import { environment as env } from '@env/environment';

const routes = {
    GetTaskList: 'v1/NotificationManagement/GetTaskList',
    getApprovalList: 'v1/NotificationManagement/GetApprovalList',
    getStatus: 'v1/NotificationManagement/SetTasksCompleted',
    filterCritera: 'v1/MasterManagement/FilterCriteria',
    global: '/Global/GlobalSearch_V1',
    advanced: 'Global/AdvanceSearch_V1',
    getRole: 'v1/EmployeeManagement/RoleGuid',
    getBanners: 'v1/MasterManagement/GetBanner',
    goToWidget: 'v1/MasterManagement/QuickLink',
    getHelplineCount: 'v1/NotificationManagement/GetHelplineTicketStatus',
    getInsitesReport: 'v1/MasterManagement/GetReportInfo',
    // createHelpline: 'v1/NotificationManagement/CreateHelplineFeedback',
    createHelpline: 'v1/NotificationManagement/CreateHelplineFeedback_v1',
    FilteredApi: 'v1/NotificationManagement/FilterTaskList',
    FilterApprovalList:'v1/NotificationManagement/FilterApprovalList'
}


@Injectable({ providedIn: 'root' })
export class HomeService {

    public readonly homeTableIdentify = {
        Task: 1,
        Activity: 2
    }
    public readonly HomeChacheType = {
        Table: "Table",
        Details: "Details"
    }
    constructor(
        private jsonApiService: JsonApiService,
        private EncrDecr: EncrDecrService,
        private apiService: ApiService, private http: HttpClient,
        public datepipe: DatePipe, private readonly onlineOfflineService: OnlineOfflineService, private offlineServices: OfflineService
        )  { }

    getTasklist(postBody): Observable<any> {
        console.log("inside get task list")
        return this.apiService.post(routes.GetTaskList, postBody)
    }
    getApprovallist(postBody): Observable<any> {
        console.log("inside approval list")
        return this.apiService.post(routes.FilterApprovalList, postBody);
    }
  // Filter list data start
     sendPageSize: any;
     set sendPageSizeData(value: any) {
         this.sendPageSize = value;
     }
     get sendPageSizeData() {
         return this.sendPageSize
     }
    sendPageNumber: any;
    set sendPageNumberData(value: any) {
        this.sendPageNumber = value;
    }
    get sendPageNumberData() {
        return this.sendPageNumber
    }
    configData = []
    set sendConfigData(value) {
        this.configData = value;
    }
    get sendConfigData() {
        return this.configData
    }

    getAppliedFilterActionData(body){
        return this.apiService.post(routes.FilteredApi, body)
    }
    //Shiva
    GetAppliedFilterData(data) {
        console.log(data)
        return {
            "SearchText":(data.filterData) ? (data.filterData.globalSearch) ? data.filterData.globalSearch : "" : "",
            "ProirityCodes": [],
            "StartDate": "",
            "EndDate": "",
            "Descriptions": [],
            "OwnerGuids": data.useFulldata.Guid,
            "PageSize":  data.useFulldata.pageSize,
            "RequestedPageNumber":data.useFulldata.RequestedPageNumber,
            "IsDesc": (data.filterData) ? (data.filterData.sortColumn != '') ? !data.filterData.sortOrder : false : true,
            "SortBy": 15
          }
      }


    getStatusComplete(Id: any) {
        var body = {
            "ActivityId": Id
        }
        return this.apiService.post(routes.getStatus, body)
    }

    getRolesListComplete() {
        let userIdEncrypt = localStorage.getItem('userID');
        let userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', userIdEncrypt, 'DecryptionDecrip')
        var body = {
            "SysGuid": userId
        }
        return this.apiService.post(routes.getRole, body)
    }

    getBannersListComplete(roleId) {
        var body = {
            "RoleGuid": roleId
        }
        return this.apiService.post(routes.getBanners, body)
    }

    getGoToWidgetLinksComplete(roleId) {
        var body = {
            "RoleGuid": roleId
        }
        return this.apiService.post(routes.goToWidget, body)
    }

    getInsitesReportFunc(roleId) {
        var body = {
            "RoleGuid": roleId
        }
        return this.apiService.post(routes.getInsitesReport, body)
    }

    getHelplineCountFunc() {
        //let userIdEncrypt = 'ha40047948';
        let userIdEncrypt = localStorage.getItem('adid');
        let userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', userIdEncrypt, 'DecryptionDecrip');
        console.log("ADID", userId);
        var body = {
            "ADId": userId
        }
        console.log(body)
        return this.apiService.post(routes.getHelplineCount, body)
    }


    sendFeedbackFunc(body) {
        return this.apiService.post(routes.createHelpline, body)
    }



    getFilterCriteria(object: any): Observable<any> {
        return this.apiService.post(routes.filterCritera, object)
    }

    getGlobalSearch(object: string): Observable<any> {
        var body = {
            "SearchText": object
        }
        return this.apiService.post(routes.global, body)
    }

    getAdvancedSearch(body: object): Observable<any> {
        return this.apiService.post(routes.advanced, body)
    }

    async getCacheTaskList() {
        console.log("getig the ioffline task")
        const TablePageData = await this.offlineServices.getMyConversationTableIndexCacheData()
        console.log("got the repsonse form offlone")
        console.log(TablePageData)
        if (TablePageData.length > 0) {
            return TablePageData[0]
        } else {
            console.log("else condinti")
            return null

        }
    }
}
