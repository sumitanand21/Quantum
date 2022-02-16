import { Injectable } from '@angular/core';

import { JsonApiService } from './json-api.service';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { UnqualifiedLeads } from '../models/UnqualifiedLeads.model';
import { ApiService } from './api.service';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { OfflineService } from './offline.services'
import { EncrDecrService } from './encr-decr.service';
const routes = {
    UnqualifiedLeads: '/UnqualifiedLeads',
    gotodisqualifyleads: 'v1/LeadManagement/Disqualify',
    disqualificationreason: 'v1/LeadManagement/GetStatusReason',
    UnqualifiedLead: (id: number) => `/UnqualifiedLead/${id}`
};

export const unqualifiedheader: any[] = [
    { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Name', selectName:"My open lead",SortId:0},
    // { id: 2, isFilter: false, hideFilter:true, name: 'Id', isFixed: false, order: 2, title: 'ID' },
    // { id: 2, isFilter: false, name: 'Score', isFixed: false, order: 3, title: 'Score' },
    { id: 3, isFilter: false, name: 'Owner', isFixed: false, order: 4, title: 'Owner',SortId:6, displayType: 'name' },
    { id: 4, isFilter: false, name: 'Createdon', isFixed: false, isHideColumnSearch:true, order: 5, title: 'Created on',SortId: 3, displayType: 'date', dateFormat:'dd-MMM-yyyy' },
    { id: 5, isFilter: false, name: 'Account', isFixed: false, order: 6, title: 'Account',SortId:2 },
    { id: 6, isFilter: false, name: 'Source', isFixed: false, order: 7, title: 'Source',SortId:5, displayType: 'capsFirstCase' },
    { id: 7, isFilter: false, name: 'Status', isFixed: false, order: 8, title: 'Status',isStatus:true, isHideColumnSearch:true, SortId:7, displayType: 'capsFirstCase' },
    { id: 8, isFilter: false, name: 'Activitygroup', isFixed: false, order: 9, title: 'Activity group',isModal: true, displayType: 'capsFirstCase' },

]

export const accountunqualifiedheader: any[] = [
    { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Name', selectName:"My open lead",SortId:0},
    // { id: 2, isFilter: false, hideFilter:true, name: 'Id', isFixed: false, order: 2, title: 'ID' },
    // { id: 2, isFilter: false, name: 'Score', isFixed: false, order: 3, title: 'Score' },
    { id: 3, isFilter: false, name: 'Owner', isFixed: false, order: 4, title: 'Owner',SortId:6, displayType: 'name' },
    { id: 4, isFilter: false, name: 'Createdon', isFixed: false, isHideColumnSearch:true, order: 5, title: 'Created on',SortId: 3, displayType: 'date', dateFormat:'dd-MMM-yyyy' },
    // { id: 5, isFilter: false, name: 'Account', isFixed: false, order: 6, title: 'Account',SortId:2 },
    { id: 6, isFilter: false, name: 'Source', isFixed: false, order: 7, title: 'Source',SortId:5, displayType: 'capsFirstCase' },
    { id: 7, isFilter: false, name: 'Status', isFixed: false, order: 8, title: 'Status',isStatus:true, isHideColumnSearch:true, SortId:7, displayType: 'capsFirstCase' },
    { id: 8, isFilter: false, name: 'Activitygroup', isFixed: false, order: 9, title: 'Activity group',isModal: true, displayType: 'capsFirstCase' },

]


@Injectable({
    providedIn: 'root'
})
export class UnqualifiedLeadsService {
    cachedArray = [];
    constructor(
        private jsonApiService: JsonApiService,
        private apiService: ApiService,
        private router: Router,
        private EncrDecr: EncrDecrService,
        public datepipe: DatePipe, private offlineServices: OfflineService) { 
            
        }

    getAll(): Observable<UnqualifiedLeads[]> {
        return this.apiService.get(routes.UnqualifiedLeads);
    }

    getSingle(id: number): Observable<UnqualifiedLeads> {
        return this.apiService.get(routes.UnqualifiedLead(id));
    }

    getParentHeaderData(): Observable<any[]> {
        return of(unqualifiedheader);
    }
    gotodisqyalify(obj: {}): Observable<any> {
        return this.apiService.post(routes.gotodisqualifyleads, obj);
    }
    getAllunqualified(requestData: Getunqyalified): Observable<any> {
        return this.apiService.post(routes.gotodisqualifyleads, requestData)
    }
    disqualifyLead(obj: {}): Observable<any> {
        return this.apiService.post(routes.gotodisqualifyleads, obj);
    }
    
    disqualifyLeadReason(): Observable<any> {
        return this.apiService.post(routes.disqualificationreason, {"SearchText": "Disqualified"});
    }

    rejectedLeadReason(): Observable<any> {
        return this.apiService.post(routes.disqualificationreason, {"SearchText": "Rejected"});
    }

    // async getCachedUnqualifiedLeads() {

    //     const TablePageData = await this.offlineServices.getUnQualifiedLeadsData()

    //     if (TablePageData.length > 0) {
    //         return TablePageData[0]
    //     } else {
    //         console.log("else condinti")
    //         return null

    //     }
    // }
}

interface Getunqyalified {
    PageSize?: number,
    RequestedPageNumber?: number,
    OdatanextLink?: string
}