
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ContactClosedLeads } from '@app/core/models/contactclosedlead.model';
import { JsonApiService } from '../json-api.service';
import { ApiService } from '../api.service';


const routes = {
    ContactClosedLeads: '/contactclosedlead',
    ContactClosedlead: (id: number) => `/ContactClosedlead/${id}`
};

export const contactclosedleadheader: any[] = [
    { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Name', selectName:"My open lead",SortId:0},
    { id: 2, isFilter: false, name: 'owner', isFixed: false, order: 2, title: 'Owner',SortId:6, displayType: 'name' },
    { id: 3, isFilter: false, name: 'created', isFixed: false, isHideColumnSearch:true, order: 3, title: 'Created on',SortId: 3, displayType: 'date', dateFormat:'dd-MMM-yyyy' },
    { id: 4, isFilter: false, name: 'account', isFixed: false, order: 4, title: 'Account',SortId:2 },
    { id: 5, isFilter: false, name: 'activitygroup', isFixed: false, order: 5, title: 'Activity group',isModal: true, displayType: 'capsFirstCase' },
    { id: 6, isFilter: false, name: 'source', isFixed: false, order: 6, title: 'Source',SortId:5, displayType: 'capsFirstCase' },
    { id: 7, isFilter: false, name: 'status', isFixed: false, order: 7, title: 'Status',isStatus:true, isHideColumnSearch:true, SortId:7, displayType: 'capsFirstCase' },
    

]

@Injectable({
    providedIn: 'root'
})
export class contactclosedleadService {
    cachedArray = [];
    constructor(
        private jsonApiService: JsonApiService,
        private apiService: ApiService) { }

    getAll(): Observable<ContactClosedLeads[]> {
        return this.apiService.get(routes.ContactClosedLeads);
    }

    getSingle(id: number): Observable<ContactClosedLeads> {
        return this.apiService.get(routes.ContactClosedlead(id));
    }
    getParentHeaderData(): Observable<any[]> {
        return of(contactclosedleadheader);
    }

}