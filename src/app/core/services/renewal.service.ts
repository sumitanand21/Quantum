import { Injectable } from '@angular/core';

import { JsonApiService } from './json-api.service';
import { Observable, of } from 'rxjs';

import { renewal } from '../models/renewal.model';
import { ApiServiceUI } from './api.service';

const routes = {
    renewals: '/renewal',
    renewal: (id: number) => `/renewal/${id}`
};


export const renewalheader: any[] = [
    { SortId:42 ,id: 1, isFilter: false, name: 'Order', isFixed: true, order: 1, title: 'Order number' ,className:"notlinkcol black-text" },
    { SortId:"0" ,id: 2, isFilter: false, name: 'Name', isFixed: false, order: 2, title: ' Opportunity name', className:'approvalstatus',isLink:true },
    { SortId:23 ,id: 3, isFilter: false, name: 'OpportunityID', isFixed: false, order: 3, title: 'Opportunity ID',displayType:"upperCase" },
    { SortId:6 ,id: 4, isFilter: false, name: 'Owner', isFixed: false, order: 4, title: 'Order owner' , isStatus: true, displayType:"name" },
    { SortId:43 ,id: 5, isFilter: false, name: 'Pricingtype', isFixed: false, order: 5, title: 'Pricing type' , isStatus: true,isHideColumnSearch: true},
    { SortId:44 ,id: 6, isFilter: false, name: 'Sap', isFixed: false, order: 6, title: 'SAP code' },
    { SortId:18 ,id: 7, isFilter: false, name: 'Startdate', isFixed: false, order: 7, title: 'Start date',isHideColumnSearch: true, displayType:"date", dateFormat: 'dd-MMM-yyyy'  },
    { SortId:19 ,id: 8, isFilter: false, name: 'enddate', isFixed: false, order: 8, title: 'End date',isHideColumnSearch: true, displayType:"date", dateFormat: 'dd-MMM-yyyy'  },
    { SortId:38 ,id: 9, isFilter: false, name: 'ProposalType', isFixed: false, order: 9, title: 'Proposal Type',isHideColumnSearch: true },
]

@Injectable({
    providedIn: 'root'
})
export class renewalService {
    cachedArray = [];
    constructor(
        private jsonApiService: JsonApiService,
        private apiService: ApiServiceUI) { }

    getAll(): Observable<renewal[]> {
        return this.apiService.get(routes.renewals);
    }

    getSingle(id: number): Observable<renewal> {
        return this.apiService.get(routes.renewal(id));
    }
    getParentHeaderData(): Observable<any[]> {
        return of(renewalheader);
    }

}
