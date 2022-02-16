import { Injectable } from '@angular/core';

import { JsonApiService } from './json-api.service';
import { Observable, of } from 'rxjs';

import { archivedLeads } from '../models/archivedLeads.model';
import { ApiService } from './api.service';

const routes = {
    // disqualifiedlead: '/archivedLedisqualifiedleadads',
    GetDisQualifiedLeads:"v1/LeadManagement/ByStatus",
    disqualifyleadSeacrch: "v1/LeadManagement/Search"
};

export const headerdisqualified: any[] = [
    { id: 1, name: 'Name', isFixed: true, order: 1, title: 'Name', isFilter: false, selectName: "Closed lead", SortId:0 },
    // { id: 2, name: 'ID', isFixed: false, hideFilter: true, order: 2, title: 'ID', isFilter: false },
    //  { id: 2, name: 'Score', isFixed: false, order: 3, title: 'Score', isFilter: false },
    { id: 2, name: 'Owner', isFixed: false, order: 2, title: 'Owner', isFilter: false ,SortId:6, displayType: 'name' },
    { id: 3, name: 'Createdon', isFixed: false, order: 3, title: 'Created on', isHideColumnSearch:true, isFilter: false ,SortId: 3, displayType: 'date', dateFormat:'dd-MMM-yyyy' },
    { id: 4, name: 'Account', isFixed: false, order: 4, title: 'Account', isFilter: false, SortId:2},
    { id: 5, name: 'Source', isFixed: false, order: 5, title: 'Source', isFilter: false, SortId:5 , displayType: 'capsFirstCase'},
    { id: 7, name: 'Status', isFixed: false, order: 8, title: 'Status', isFilter: false, isStatus: true, isHideColumnSearch:true, SortId:7},
    { id: 6, name: 'Activitygroup', isFilter: false, isFixed: false, order: 6, title: 'Activity group', isModal: true, displayType: 'capsFirstCase' },

]

export const accountheaderdisqualified: any[] = [
    { id: 1, name: 'Name', isFixed: true, order: 1, title: 'Name', isFilter: false, selectName: "Closed lead", SortId:0 },
    // { id: 2, name: 'ID', isFixed: false, hideFilter: true, order: 2, title: 'ID', isFilter: false },
    //  { id: 2, name: 'Score', isFixed: false, order: 3, title: 'Score', isFilter: false },
    { id: 2, name: 'Owner', isFixed: false, order: 2, title: 'Owner', isFilter: false ,SortId:6, displayType: 'name' },
    { id: 3, name: 'Createdon', isFixed: false, order: 3, title: 'Created on', isHideColumnSearch:true, isFilter: false ,SortId: 3, displayType: 'date', dateFormat:'dd-MMM-yyyy' },
    // { id: 4, name: 'Account', isFixed: false, order: 4, title: 'Account', isFilter: false, SortId:2},
    { id: 5, name: 'Source', isFixed: false, order: 5, title: 'Source', isFilter: false, SortId:5 , displayType: 'capsFirstCase'},
    { id: 7, name: 'Status', isFixed: false, order: 8, title: 'Status', isFilter: false, isStatus: true, isHideColumnSearch:true, SortId:7},
    { id: 6, name: 'Activitygroup', isFilter: false, isFixed: false, order: 6, title: 'Activity group', isModal: true, displayType: 'capsFirstCase' },

]

@Injectable({
    providedIn: 'root'
})
export class disqualifiedLeadsService {

    public readonly  leadlistTableIdentity={
  
        qualifiedleads:3,
        unqualifiedlead:1,
        archieveleadsearch:184450013,
        disqualifiedleadsearch:7
      
      }

    cachedArray = [];
    constructor(
        private jsonApiService: JsonApiService,
        private apiService: ApiService) { }

    // getAll(): Observable<archivedLeads[]> {
    //     return this.apiService.get(routes.disqualifiedlead);
    // }

    getParentHeaderData(): Observable<any[]> {
        return of(headerdisqualified);
    }

    getDisqualifiedLeads(reqBody):Observable<any>{
        return this.apiService.post(routes.GetDisQualifiedLeads,reqBody)
    }

    DisQualifyLeadSearch(searchText, searchType, pageSize: number, userId: any): Observable<any> {
        let reqBody = {
            "SearchText": searchText,
            "SearchType": searchType,
            "PageSize": pageSize,
            "Guid": userId
        }
        return this.apiService.post(routes.disqualifyleadSeacrch, reqBody)
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

