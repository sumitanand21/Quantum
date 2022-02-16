import { Injectable } from '@angular/core';

import { JsonApiService } from './json-api.service';
import { Observable, of } from 'rxjs';

import { qualifiedLeads } from '../models/qualifiedLeads.model';
import { ApiService } from './api.service';
import { OfflineService } from './offline.services';

const routes = {
    qualifiedLeads: '/qualifiedLeads',
    searchqualifiedleads: 'lead/SearchLead',
    // gotodisqualifyleads :'Lead/DisqualifyLead',
    goto_qualifyleads: 'v1/LeadManagement/Qualify',
    nurtureleads: 'v1/LeadManagement/Nurture',
    //gotodisqualifyleads :'Lead/DisqualifyLead',
   // gotodisqualifyleads:'v1/LeadManagement/Qualify',
    qualifiedLead: (id: number) => `/qualifiedLeads/${id}`
};



export const headerQualified: any[] = [
    
    { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Name' , selectName:"Open lead", SortId:0},
    // { id: 2, isFilter: false, hideFilter:true, name: 'Id', isFixed: false, order: 2, title: 'ID' },
    // { id: 2, isFilter: false, name: 'Score', isFixed: false, order: 3, title: 'Score' },
    { id: 3, isFilter: false, name: 'Owner', isFixed: false, order: 4, title: 'Owner', SortId:6, displayType: 'name'},
    { id: 4, isFilter: false, name: 'Createdon', isFixed: false, isHideColumnSearch:true, order: 5, title: 'Created on',SortId: 3, displayType: 'date', dateFormat:'dd-MMM-yyyy'  },
    { id: 5, isFilter: false, name: 'Account', isFixed: false, order: 6, title: 'Account', SortId:2 },
    { id: 6, isFilter: false, name: 'Source', isFixed: false, order: 7, title: 'Source', SortId:5 , displayType: 'capsFirstCase'},
    { id: 7, isFilter: false, name: 'Status', isFixed: false, order: 8, title: 'Status',isStatus:true, isHideColumnSearch:true, SortId:7, displayType: 'capsFirstCase' },
    { id: 8, isFilter: false, name: 'Activitygroup', isFixed: false, order: 9, title: 'Activity group', isModal: true,  displayType: 'capsFirstCase' },
]

export const accountheaderQualified: any[] = [
    
    { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Name' , selectName:"Open lead", SortId:0},
    // { id: 2, isFilter: false, hideFilter:true, name: 'Id', isFixed: false, order: 2, title: 'ID' },
    // { id: 2, isFilter: false, name: 'Score', isFixed: false, order: 3, title: 'Score' },
    { id: 3, isFilter: false, name: 'Owner', isFixed: false, order: 4, title: 'Owner', SortId:6, displayType: 'name'},
    { id: 4, isFilter: false, name: 'Createdon', isFixed: false, isHideColumnSearch:true, order: 5, title: 'Created on',SortId: 3, displayType: 'date', dateFormat:'dd-MMM-yyyy'  },
    // { id: 5, isFilter: false, name: 'Account', isFixed: false, order: 6, title: 'Account', SortId:2 },
    { id: 6, isFilter: false, name: 'Source', isFixed: false, order: 7, title: 'Source', SortId:5 , displayType: 'capsFirstCase'},
    { id: 7, isFilter: false, name: 'Status', isFixed: false, order: 8, title: 'Status',isStatus:true, isHideColumnSearch:true, SortId:7, displayType: 'capsFirstCase' },
    { id: 8, isFilter: false, name: 'Activitygroup', isFixed: false, order: 9, title: 'Activity group', isModal: true,  displayType: 'capsFirstCase' },
]


@Injectable({
    providedIn: 'root'
})
export class QualifiedLeadsService {

    public readonly  leadlistTableIdentity={
  
        qualifiedleads:3,
        unqualifiedlead:1,
        archieveleadsearch:184450013
      
      }

    cachedArray = [];
    constructor(
        private jsonApiService: JsonApiService,
        private apiService: ApiService,
        private offlineServices:OfflineService) { }

    getAll(): Observable<qualifiedLeads[]> {
        return this.apiService.get(routes.qualifiedLeads);
    }

    getSingle(id: number): Observable<qualifiedLeads> {
        return this.apiService.get(routes.qualifiedLead(id));
    }
    getParentHeaderData(): Observable<any[]> {
        return of(headerQualified);
    }
    getnurtureleadS(obj: {}): Observable<any> {
        return this.apiService.post(routes.nurtureleads, obj);
    }

    getQyalifyLeads(obj: {}): Observable<any> {
        return this.apiService.post(routes.goto_qualifyleads, obj);
    }


    // gotoqualified(requestData: Getunqyalified): Observable<any> {
    //     return this.apiService.post(routes.gotodisqualifyleads, requestData)
    // // }

    //     getqualifiedleadsearch():Observable<any>{
    // return this.apiService.post(routes.searchqualifiedleads);
    //     }

    getqualifiedleadsearch(searchText, searchType, pageSize:number,childId:any): Observable<any> {
        let search = {
            "Searchtext": searchText,
            "SearchType": searchType,
            "PageSize": pageSize ,// by default we shd ask 5 data on search
            "Guid": childId
        }
        return this.apiService.post(routes.searchqualifiedleads, search)
    }
 

}

