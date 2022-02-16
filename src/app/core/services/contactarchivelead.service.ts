import { Injectable } from '@angular/core';
import { JsonApiService } from './json-api.service';
import { Observable, of } from 'rxjs';
import { contactarchivelead } from '../models/contactarchivelead.model';
import { ApiService } from './api.service';
const routes = {
    contactarchiveleads: '/contactarchivelead',
    contactarchivelead: (id: number) => `/contactarchivelead/${id}`
};
export const contactarchiveleadheader: any[] = [
    
    { id: 1, name: 'Name', isFixed: true, order: 1, title: 'Name', isFilter: false , className:'noLink', SortId:0 },
    // { id: 2, name: 'ida', isFixed: false, order: 2, title: 'ID', isFilter: false ,  hideFilter: true},
    // { id: 2, name: 'score', isFixed: false, order: 2, title: 'Score', isFilter: false ,  hideFilter: true, displayType: 'number'},
    { id: 2, name: 'owner', isFixed: false, order: 2, title: 'Owner', isFilter: false, SortId:6, displayType: 'name'},
    { id: 3, name: 'created', isFixed: false, order: 3, title: 'Created on', isFilter: false,  SortId: 3, displayType: 'date', dateFormat:'dd-MMM-yyyy'  },
    { id: 4, name: 'account', isFixed: false, order: 4, title: 'Account', isFilter: false, SortId:2 },
    { id: 5, name: 'activitygroup', isFixed: false, order: 5, title: 'Activitygroup', isFilter: false , isModal: true, displayType: 'capsFirstCase',  SortId:0},
    { id: 6, name: 'source', isFixed: false, order: 6, title: 'Source', isFilter: false , SortId:5, displayType: 'capsFirstCase'},
    { id: 7, name: 'status', isFixed: false, order: 7, title: 'Status', isFilter: false,isStatus:true, SortId:7, displayType: 'capsFirstCase' }
]
@Injectable({
    providedIn: 'root'
})
export class contactarchiveleadService {
    cachedArray = [];
    constructor(
        private jsonApiService: JsonApiService,
        private apiService: ApiService) { }
    getAll(): Observable<contactarchivelead[]> {
        return this.apiService.get(routes.contactarchiveleads);
    }
    getSingle(id: number): Observable<contactarchivelead> {
        return this.apiService.get(routes.contactarchivelead(id));
    }
    getParentHeaderData(): Observable<any[]> {
        return of(contactarchiveleadheader);
    }
}
