import { Injectable } from '@angular/core';

import { JsonApiService } from './json-api.service';
import { Observable, of } from 'rxjs';

import { contact } from '../models/contact.model';
import { ApiService } from './api.service';

const routes = {
    deactivatedcontacts: '/deactivatedcontacts',

};

export const deactivatedcontactheader: any[] = [
    { id: 1, isFilter: false, name: 'FirstName', isFixed: true, order: 1, title: 'Name',selectName: "contact", routerLink: '/contacts/Contactdetailslanding/contactDetailsChild',  SortId:0, displayType: 'name' },
    { id: 2, isFilter: false, name: 'Jobtitle', isFixed: false, order: 2, title: 'Designation',  SortId:8, },
    { id: 3, isFilter: false, name: 'Email', isFixed: false, order: 3, title: 'Email',  SortId:9 },
    { id: 4, isFilter: false, name: 'Phone', isFixed: false, order: 4, title: 'Phone', isModal: true, SortId:10 , displayType: 'capsFirstCase'},
    { id: 5, isFilter: false, name: 'Account', isFixed: false, order: 5, title: 'Account',  SortId:2 },
    { id: 6, isFilter: false, name: 'Reportingmanager', isFixed: false, order: 6, title: 'Reporting manager' , SortId:11 ,},
    { id: 7, isFilter: false, name: 'keyContact', isFixed: false,  order: 7, title: 'Key contact',isHideColumnSearch:true, SortId:28 , displayType: 'capsFirstCase'},
    // { id: 8, isFilter: false, name: 'Modifiedon', isFixed: false, order: 8, title: 'Modified on', SortId:4 , displayType: 'date', dateFormat:'dd-MMM-yyyy' },
    { id: 8, isFilter: false, name: 'Relationship', isFixed: false, order: 8, title: 'Relationship' ,SortId:50, },
    { id: 9, isFilter: false, name: 'Category', isFixed: false, order: 9, title: 'Category' ,SortId:51, }
]

@Injectable({
    providedIn: 'root'
})
export class deactivatedContactService {
    cachedArray = [];
    constructor(
        private jsonApiService: JsonApiService,
        private apiService: ApiService) { }

    getAll(): Observable<contact[]> {
        return this.apiService.get(routes.deactivatedcontacts);
    }
    getParentHeaderData(): Observable<any[]> {
        return of(deactivatedcontactheader);
    }

}
