import { Injectable } from '@angular/core';

import { JsonApiService } from './json-api.service';
import { Observable, of } from 'rxjs';

import { UnqualifiedLeads } from '../models/UnqualifiedLeads.model';
import { ApiService } from './api.service';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { OfflineService } from './offline.services'

const routes = {



    GetOpenLeads:"v1/LeadManagement/ByStatus",
    OpenleadSeacrch:"v1/LeadManagement/Search",

    Qualifyleads: 'v1/LeadManagement/Qualify',

    DisQualifyleads: 'v1/LeadManagement/Disqualify',

    NurtureLeads:'v1/LeadManagement/Nurture',

    ArchieveLeads: 'v1/LeadManagement/ArchiveQualified',

};


// export const myopenleaddheader: any[] = [
//     { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Name' },
//     { id: 2, isFilter: false, name: 'Id', isFixed: false, order: 2, title: 'ID' },
//     { id: 3, isFilter: false, name: 'Score', isFixed: false, order: 3, title: 'Score' },
//     { id: 4, isFilter: false, name: 'Owner', isFixed: false, order: 4, title: 'Owner' },
//     { id: 5, isFilter: false, name: 'Createdon', isFixed: false, order: 5, title: 'Created on' },
//     { id: 6, isFilter: false, name: 'Account', isFixed: false, order: 6, title: 'Account' },
//     { id: 7, isFilter: false, name: 'Source', isFixed: false, order: 7, title: 'Source' },
//     { id: 8, isFilter: false, name: 'Status', isFixed: false, order: 8, title: 'Status' },
//     { id: 9, isFilter: false, name: 'Activitygroup', isFixed: false, order: 9, title: 'Activity group' },

// ]

@Injectable({
    providedIn: 'root'
})
export class OpenLeadsService {
    cachedArray = [];
    constructor(
        private jsonApiService: JsonApiService,
        private apiService: ApiService,
        public datepipe: DatePipe, private offlineServices: OfflineService) { }
        public readonly LeadsChacheType = {
            Table: "Table",
            Details: "Details",
            MeetingTypes: "MeetingTypes"
          }
 
    getOpenLeads(reqBody):Observable<any>{
        return this.apiService.post(routes.GetOpenLeads,reqBody)
    }
    OpenLeadSearch(reqBody):Observable<any>{
        return this.apiService.post(routes.OpenleadSeacrch,reqBody)
    }

    QyalifyLeads(obj): Observable<any> {
        return this.apiService.post(routes.Qualifyleads, obj);
    }

    DisqualifyLead(obj): Observable<any> {
        return this.apiService.post(routes.DisQualifyleads, obj);
    }

    NurtureLead(obj): Observable<any> {
        return this.apiService.post(routes.NurtureLeads, obj);
    }

    ArchiveLeads(obj): Observable<any> {
        return this.apiService.post(routes.ArchieveLeads, obj);
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
