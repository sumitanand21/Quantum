import { Injectable } from '@angular/core';

import { JsonApiService } from './json-api.service';
import { Observable, of } from 'rxjs';

import { ApiService } from './api.service';
import { ArchivedConversation } from '@app/core';
import { OnlineOfflineService } from './online-offline.service';
import {OfflineService} from './offline.services'
import { DatePipe } from '@angular/common';
import { map, tap } from 'rxjs/operators';
const routes = {
    conversations: 'archivedConversation',
    archieved: 'v1/ActivityGroupManagement/Archive',
    restore: 'v1/ActivityGroupManagement/Restore',
    getArchivedConversation: 'v1/ActivityGroupManagement/ArchivedList',
    archivedSearch: 'v1/ActivityGroupManagement/SearchArchivedList',
    conversation: (id: number) => `/archivedConversation/${id}`
};

export const archivedheader: any[] = [

    { id: 1, isFilter:false, name: 'Name', isFixed: true, order: 1, title: 'Activity group', selectName:"Archived activitie", displayType: 'capsFirstCase'},

    // { id: 2, isFilter:false, name: 'ActivityType', isFixed: false, order: 3, title: 'Activity type'}, 

    { id: 2, isFilter:false, name: 'Account', isFixed: false, order: 2, title: 'Account name' ,className:"approvalstatus"},

    { id: 3, isFilter:false, name: 'Owner', isFixed: false, order: 3, title: 'Activity owner' , displayType: 'name'},

    { id: 4, isFilter:false, name: 'Meetings', isFixed: false, order: 4, title: 'Meetings(#)' , displayType: 'number'},

    { id: 5, isFilter:false, name: 'Actions', isFixed: false, order: 5, title: 'Actions(#)', displayType: 'number' },

    { id: 6, isFilter:false, name: 'Orders', isFixed: false, order: 6, title: 'Other activities(#)' , displayType: 'number'},

    // { id: 7, isFilter:false, name: 'Leadname', isFixed: false, order: 7, title: 'Linked leads',isModal:true, className:"approvalstatus", displayType: 'capsFirstCase' },

    // { id: 8, isFilter:false, name: 'Linkedopp', isFixed: false, order: 8, title: 'Linked opportunities/orders',isModal:true, className:"approvalstatus", displayType: 'capsFirstCase' },

]

export const accountarchivedheader: any[] = [

    { id: 1, isFilter:false, name: 'Name', isFixed: true, order: 1, title: 'Activity group', selectName:"Archived activitie", displayType: 'capsFirstCase'},

    // { id: 2, isFilter:false, name: 'ActivityType', isFixed: false, order: 3, title: 'Activity type'}, 

    // { id: 2, isFilter:false, name: 'Account', isFixed: false, order: 2, title: 'Account name' ,className:"approvalstatus"},

    { id: 3, isFilter:false, name: 'Owner', isFixed: false, order: 3, title: 'Activity owner' , displayType: 'name'},

    { id: 4, isFilter:false, name: 'Meetings', isFixed: false, order: 4, title: 'Meetings(#)' , displayType: 'number'},

    { id: 5, isFilter:false, name: 'Actions', isFixed: false, order: 5, title: 'Actions(#)', displayType: 'number' },

    { id: 6, isFilter:false, name: 'Orders', isFixed: false, order: 6, title: 'Other activities(#)' , displayType: 'number'},

    // { id: 7, isFilter:false, name: 'Leadname', isFixed: false, order: 7, title: 'Linked leads',isModal:true, className:"approvalstatus", displayType: 'capsFirstCase' },

    // { id: 8, isFilter:false, name: 'Linkedopp', isFixed: false, order: 8, title: 'Linked opportunities/orders',isModal:true, className:"approvalstatus", displayType: 'capsFirstCase' },

]

@Injectable({
    providedIn: 'root'
})
export class ArchivedConversationService {
    cachedArray = [];
    public readonly ArchivedChacheType = {
        Table: "Table",
        Details: "Details",
        MeetingTypes: "MeetingTypes"
      }
    constructor(
        private jsonApiService: JsonApiService,public datepipe: DatePipe,
        private apiService: ApiService,private readonly onlineOfflineService: OnlineOfflineService,private offlineService:OfflineService) { }

    getAll(): Observable<ArchivedConversation[]> {
        return this.apiService.get(routes.conversations);
    }

    getSingle(id: number): Observable<ArchivedConversation> {
        return this.apiService.get(routes.conversation(id));
    }
    getParentHeaderData(): Observable<any[]> {
        return of(archivedheader);
    }

    archievedConversation(obj: {}): Observable<any> {
        return this.apiService.post(routes.archieved, obj);
    }

    restoreConversation(obj: {}): Observable<any> {
        return this.apiService.post(routes.restore, obj);
    }
     // Archived conversation list
     getAllArchivedConversations(requestData): Observable<any> {
        return this.apiService.post(routes.getArchivedConversation, requestData)
    }

    ArchivedSearch(requestData): Observable<any> {
        return this.apiService.post(routes.archivedSearch, requestData)
    }

    async getArchivedCachedConvesartion()
    {
     
      const TablePageData =  await this.offlineService.getArchivedTableIndexCacheData()
        console.log("archived table data-->")
        console.log(TablePageData)
      if (TablePageData.length>0 ){
         return TablePageData[0]
      }else{
          console.log("else condition-->")
       return [{}] 
     }
     
    }

    getimmutableObj(data):Object{
        const newPerson = {
            ...data
          }
          return newPerson
    }

    // Getting the current page number
    sendPageNumber: number;

    set sendPageNumberData(value: number) {
        this.sendPageNumber = value;
    }

    get sendPageNumberData() {
        return this.sendPageNumber
    }

    // Getting the current page size

    sendPageSize: number;

    set sendPageSizeData(value: number) {
        this.sendPageSize = value;
    }

    get sendPageSizeData() {
        return this.sendPageSize
    }

    // Getting the config data 

    configData = []

    set sendConfigData(value) {
        this.configData = value;
    }

    get sendConfigData() {
        return this.configData
    }

}
// --------------------------------------------service interfaces---------------------------------------
interface GetAllArchivedConversation {
    PageSize?: number,
    RequestedPageNumber?: number,
    OdatanextLink?: string
}