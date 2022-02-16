import { Injectable } from '@angular/core';
import { JsonApiService } from './json-api.service';
import { Observable, of } from 'rxjs';
import { contactcompletecampaign } from '../models/contactcompletecampaign.model';
import { ApiService } from './api.service';
const routes = {
    contactcompletecampaigns: '/contactcompletecampaign',
    contactcompletecampaign: (id: number) => `/contactcompletecampaign/${id}`
};
export const contactcompletecampaignheader: any[] = [
    { id: 1, isFilter:false, name: 'Name', isFixed: true, order: 1, title: 'Campaign name', className:'noLink' },
    { id: 2, isFilter:false, name: 'campaign', isFixed: false, order: 2, title: 'Campaign ID', displayType: 'upperCase' },
    { id: 3, isFilter:false, name: 'owner', isFixed: false, order: 3, title: 'Owner', displayType: 'name' },
    { id: 4, isFilter:false, name: 'status', isFixed: false, order: 4, title: 'Status', isStatus : true , displayType: 'capsFirstCase'},
    { id: 5, isFilter:false, name: 'startdate', isFixed: false, order: 5, title: 'Start Date ', displayType: 'date', dateFormat:'dd-MMM-yyyy'  },
    { id: 6, isFilter:false, name: 'enddate', isFixed: false, order: 6, title: 'End Date ', displayType: 'date', dateFormat:'dd-MMM-yyyy'  },
]

export const contactallcampaignheader: any[] = [
    { id: 1, isFilter:false, name: 'Name', isFixed: true, order: 1, title: 'Campaign name', className:'noLink' },
    { id: 2, isFilter:false, name: 'campaign', isFixed: false, order: 2, title: 'Campaign ID', displayType: 'upperCase' },
    { id: 3, isFilter:false, name: 'owner', isFixed: false, order: 3, title: 'Owner', displayType: 'name' },
    { id: 4, isFilter:false, name: 'status', isFixed: false, order: 4, title: 'Status', isStatus : true , displayType: 'capsFirstCase'},
    { id: 5, isFilter:false, name: 'startdate', isFixed: false, order: 5, title: 'Start Date ', displayType: 'date', dateFormat:'dd-MMM-yyyy'  },
    { id: 6, isFilter:false, name: 'enddate', isFixed: false, order: 6, title: 'End Date ', displayType: 'date', dateFormat:'dd-MMM-yyyy'  },
]

@Injectable({
    providedIn: 'root'
})
export class contactcompletecampaignService {
    cachedArray = [];
    constructor(
        private jsonApiService: JsonApiService,
        private apiService: ApiService) { }
    getAll(): Observable<contactcompletecampaign[]> {
        return this.apiService.get(routes.contactcompletecampaigns);
    }
    getSingle(id: number): Observable<contactcompletecampaign> {
        return this.apiService.get(routes.contactcompletecampaign(id));
    }
    getParentHeaderData(): Observable<any[]> {
        return of(contactcompletecampaignheader);
    }
}
