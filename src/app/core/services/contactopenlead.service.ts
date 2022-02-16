import { Injectable } from '@angular/core';

import { JsonApiService } from './json-api.service';
import { Observable, of } from 'rxjs';

import { contactopenlead } from '../models/contactopenlead.model';
import { ApiService } from './api.service';

const routes = {
    contactopenleads: '/contactopenlead',
    contactopenlead: (id: number) => `/contactopenlead/${id}`
};

export const contactopenleadheader: any[] = [
    { id: 1, isFilter:false, name: 'Name', isFixed: true, order: 1, title: 'Name', className:'noLink', SortId:0 },
    // { id: 2, isFilter:false, name: 'ida', isFixed: false, order: 2, title: 'ID', hideFilter: true },
    // { id: 2, isFilter:false, name: 'score', isFixed: false, order: 2, title: 'Score', hideFilter: true, displayType: 'number'},
    { id: 2, isFilter:false, name: 'owner', isFixed: false, order: 2, title: 'Owner', SortId:6 , displayType: 'name' },
    { id: 3, isFilter:false, name: 'created', isFixed: false, order: 3, title: 'Created on',SortId: 3 , displayType: 'date', dateFormat:'dd-MMM-yyyy' },
    { id: 4, isFilter:false, name: 'account', isFixed: false, order: 4, title: 'Account', SortId:2 },
    { id: 5, isFilter:false, name: 'activitygroup', isFixed: false, order: 5, title: 'Activitygroup ' , isModal: true, displayType: 'capsFirstCase', SortId:0},
    { id: 6, isFilter:false, name: 'source', isFixed: false, order: 6, title: 'Source ', SortId:5, displayType: 'capsFirstCase' },
    { id: 7, isFilter:false, name: 'status', isFixed: false, order: 7, title: 'Status ',isStatus : true , SortId:7, displayType: 'capsFirstCase'},
]

@Injectable({
    providedIn: 'root'
})
export class contactopenleadService {
    cachedArray = [];
    constructor(
        private jsonApiService: JsonApiService,
        private apiService: ApiService) { }

    getAll(): Observable<contactopenlead[]> {
        return this.apiService.get(routes.contactopenleads);
    }

    getSingle(id: number): Observable<contactopenlead> {
        return this.apiService.get(routes.contactopenlead(id));
    }
    getParentHeaderData(): Observable<any[]> {
        return of(contactopenleadheader);
    }

}
