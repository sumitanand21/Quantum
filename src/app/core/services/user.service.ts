
import { Injectable } from '@angular/core';
import { Observable,of } from'rxjs';
import { JsonApiService } from './json-api.service';
import { ApiService } from './api.service';
import { User } from '@app/core';

const routes = {
    users: '/users',
    conversations: '/conversations',
    user: (id: number) =>  `/users/${id}`
};

const header:any[]=[
   
      { id: 2, name: 'Type' ,isFixed:false,order:2, title: 'Type'},
      { id: 3, name: 'AccountName' ,isFixed:false,order:3, title: 'Account name'},
      { id: 4, name: 'CustomerContacts', isFixed:false,order:4, title: 'Customer contacts'},
      { id: 5, name: 'WiproAttendees' , isFixed:false,order:5, title: 'Wipro attendees'},
      { id: 6, name: 'DateCreated', isFixed:false,order:6, title: 'Date created' },
      { id: 7, name: 'Leadslinked', isFixed:false,order:7, title: 'Leads linked' },
      { id: 8, name: 'OppLinked', isFixed:false,order:8, title: 'Opp linked' },
]

@Injectable({
  providedIn: 'root'
})
export class UserService {
    selArray=[];
    cachedArray=[];
    constructor(
        private jsonApiService: JsonApiService,
        private apiService: ApiService) {}
  
      getAll(): Observable<User[]> {
        
          return this.apiService.get(routes.users);
      }
  
      getSingle(id: number): Observable<User> {
          return this.apiService.get(routes.user(id));
      }
      getParentHeaderData(): Observable<any[]> {
        return of (header);
    }
}