import { Injectable } from '@angular/core';
import { JsonApiService } from './json-api.service';
import { Observable, of } from 'rxjs';
import { contactarchive } from '../models/contactarchive.model';
import { ApiService } from './api.service';
const routes = {
    contactarchives: '/contactarchive',
    contactarchive: (id: number) => `/contactarchive/${id}`
};
export const contactarchiveheader: any[] = [
    { id: 1, isFilter: false, name: 'activitygroupName', isFixed: true, order: 1, title: 'Activity group',className:'noLink', displayType: 'capsFirstCase' },
    // { id: 2, isFilter: false, name: 'activityType', isFixed: false, order: 2, title: 'Activity Type', displayType: 'capsFirstCase' },
    { id: 2, isFilter: false, name: 'account', isFixed: false, order: 2, title: 'Account/Company' },
    { id: 3, isFilter: false, name: 'owner', isFixed: false, order: 3, title: 'Activity Owner', displayType: 'name' },
    { id: 4, isFilter: false, name: 'meeting', isFixed: false, order: 4, title: 'Meeting', displayType: 'number' },
    { id: 5, isFilter: false, name: 'created', isFixed: false, order: 5, title: 'Created on', displayType: 'date', dateFormat:'dd-MMM-yyyy'  },
    { id: 6, isFilter: false, name: 'linkedleads', isFixed: false, order: 6, title: 'Linked leads', displayType: 'capsFirstCase', isModal:true },
    { id: 7, isFilter: false, name: 'linkedOpportunity', isFixed: false, order: 7, title: 'Linked opportunities/Orders', displayType: 'capsFirstCase', isModal:true },
]
@Injectable({
    providedIn: 'root'
})
export class contactarchiveService {
    cachedArray = [];
    constructor(
        private jsonApiService: JsonApiService,
        private apiService: ApiService) { }
    getAll(): Observable<contactarchive[]> {
        return this.apiService.get(routes.contactarchives);
    }
    getSingle(id: number): Observable<contactarchive> {
        return this.apiService.get(routes.contactarchive(id));
    }
    getParentHeaderData(): Observable<any[]> {
        return of(contactarchiveheader);
    }
}
