import { Injectable } from '@angular/core';
import { JsonApiService } from './json-api.service';
import { Observable, of } from 'rxjs';
import { OfflineService } from './offline.services'
import { archivedLeads } from '../models/archivedLeads.model';
import { ApiService } from './api.service';
const routes = {
    archivedLeads: 'archivedLeads',
    archieveleads: 'v1/LeadManagement/ArchiveQualified',
    leadrestore: 'v1/LeadManagement/Restore',
    searchLead: 'v1/LeadManagement/Search',
    getLeadsbyStatus: 'v1/LeadManagement/ByStatus',
    archivedLead: (id: number) => `/archivedLead/${id}`
};
export const headerArchived: any[] = [
    { id: 1, name: 'Name', isFixed: true, order: 1, title: 'Name', isFilter: false, selectName: "lead", SortId:0 },
    // { id: 2, name: 'ID', isFixed: false, hideFilter: true, order: 2, title: 'ID', isFilter: false },
    // { id: 2, name: 'Score', isFixed: false, order: 3, title: 'Score', isFilter: false },
    { id: 3, name: 'Owner', isFixed: false, order: 4, title: 'Owner', isFilter: false, SortId:6, displayType: "name"},
    { id: 4, name: 'Createdon', isFixed: false, order: 5, title: 'Created on', isHideColumnSearch:true, isFilter: false, SortId: 3, displayType: "date", dateFormat:'dd-MMM-yyyy'},
    { id: 5, name: 'Account', isFixed: false, order: 6, title: 'Account', isFilter: false, SortId:2},
    { id: 6, name: 'Source', isFixed: false, order: 7, title: 'Source', isFilter: false, SortId:5,displayType: "capsFirstCase"  },
    { id: 7, name: 'Status', isFixed: false, order: 8, title: 'Status', isFilter: false, isStatus: true, isHideColumnSearch:true, SortId:7,displayType: "capsFirstCase" },
    { id: 8, name: 'Activitygroup', isFilter: false, isFixed: false, order: 9, title: 'Activity group', isModal: true, displayType: "capsFirstCase" },
]

export const accountheaderArchived: any[] = [
    { id: 1, name: 'Name', isFixed: true, order: 1, title: 'Name', isFilter: false, selectName: "lead", SortId:0},
    // { id: 2, name: 'ID', isFixed: false, hideFilter: true, order: 2, title: 'ID', isFilter: false },
    // { id: 2, name: 'Score', isFixed: false, order: 3, title: 'Score', isFilter: false },
    { id: 3, name: 'Owner', isFixed: false, order: 4, title: 'Owner', isFilter: false, SortId:6, displayType: "name"},
    { id: 4, name: 'Createdon', isFixed: false, order: 5, title: 'Created on', isHideColumnSearch:true, isFilter: false, SortId: 3, displayType: "date", dateFormat:'dd-MMM-yyyy'},
    // { id: 5, name: 'Account', isFixed: false, order: 6, title: 'Account', isFilter: false, SortId:2},
    { id: 6, name: 'Source', isFixed: false, order: 7, title: 'Source', isFilter: false, SortId:5,displayType: "capsFirstCase"  },
    { id: 7, name: 'Status', isFixed: false, order: 8, title: 'Status', isFilter: false, isStatus: true, isHideColumnSearch:true, SortId:7,displayType: "capsFirstCase" },
    { id: 8, name: 'Activitygroup', isFilter: false, isFixed: false, order: 9, title: 'Activity group', isModal: true, displayType: "capsFirstCase" },
]

export const ArchivedLeadHeaders = ['Name', 'ID', 'Score', 'Owner', 'Created on', 'Account', 'Source', 'Status', 'Activity group']

@Injectable({
    providedIn: 'root'
})
export class ArchivedLeadsService {
    public readonly leadlistTableIdentity = {
        qualifiedleads: 3,
        unqualifiedlead: 1,
        archieveleadsearch: 184450013
    }
    ArchivedLeadsService(arcleadObject: any): any {
        throw new Error("Method not implemented.");
    }
    //   restorelead(resObject: any): any {
    //     throw new Error("Method not implemented.");
    //   }
    cachedArray = [];
    constructor(
        private jsonApiService: JsonApiService,
        private apiService: ApiService,
        private offlimeService: OfflineService) { }
    getAll(): Observable<archivedLeads[]> {
        return this.apiService.get(routes.archivedLeads);
    }
    getSingle(id: number): Observable<archivedLeads> {
        return this.apiService.get(routes.archivedLead(id));
    }
    getParentHeaderData(): Observable<any[]> {
        return of(headerArchived);
    }
    archievedleadsConversation(obj: {}): Observable<any> {
        return this.apiService.post(routes.archieveleads, obj);
    }
    restorelead(obj): Observable<any> {
        return this.apiService.post(routes.leadrestore, obj);
    }
    archievleadss(obj: {}): Observable<any> {
        return this.apiService.post(routes.archieveleads, obj);
    }
    LeadSearch(searchText, searchType, pageSize: number, childId: any): Observable<any> {
        let search = {
            "SearchText": searchText,
            "SearchType": searchType,
            "PageSize": pageSize,
            "Guid": childId
        }
        return this.apiService.post(routes.searchLead, search)
    }
    getAllLeadsbyStatus(ReqBody: GetLeadList): Observable<any> {
        return this.apiService.post(routes.getLeadsbyStatus, ReqBody)
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
interface GetLeadList {
    PageSize?: number,
    RequestedPageNumber?: number,
    OdatanextLink?: string
}
