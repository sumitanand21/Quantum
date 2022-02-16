
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { JsonApiService } from './json-api.service';
import { ApiService } from './api.service';
import { ActivityList } from '@app/core/models/convoActivityList.model';

const routes = {
    activityList: '/activityList',
    user: (id: number) => `/users/${id}`
};

export const activityConversationheader: any[] = [

    { id: 1, isFilter: false, name: 'Subject', isFixed: true, order: 1, title: 'Subject' , routerLink:'/conversations/childInfo'},
    { id: 2, isFilter: false, name: 'Datetime', isFixed: false, order: 2, title: 'Date & Time' },
    { id: 3, isFilter: false, name: 'Conversationtype', isFixed: false, order: 3, title: 'Conversation type' },
    { id: 4, isFilter: false, name: 'Appointmenttype', isFixed: false, order: 4, title: 'Appointment type'},
    { id: 5, isFilter: false, name: 'Conversationname', isFixed: false, order: 5, title: 'Conversation name',className:"approvalstatus" },
    { id: 6, isFilter: false, name: 'Account', isFixed: false, order: 6, title: 'Account',className:"approvalstatus" },
    { id: 7, isFilter: false, name: 'Leadslinked', isFixed: false, order: 7, title: 'Leads linked' },
    { id: 8, isFilter: false, name: 'OppLinked', isFixed: false, order: 8, title: 'Opportunities linked'  },

]

@Injectable({
    providedIn: 'root'
})
export class convoActivityListService {
    selArray = [];
    cachedArray = [];
    constructor(
        private jsonApiService: JsonApiService,
        private apiService: ApiService) { }

    getAll(): Observable<any[]> {

        return this.apiService.get(routes.activityList);
    }

    getSingle(id: number): Observable<ActivityList> {
        return this.apiService.get(routes.user(id));
    }
    getParentHeaderData(): Observable<any[]> {
        return of(activityConversationheader);
    }
}