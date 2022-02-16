import { Injectable } from '@angular/core';
import { ApiServiceUI  } from './api.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';


const routes = {
  pendingRequest: '/pendingRequest',
  ContractRepository:'/contractRepository'
  
};

export const PendingRequestHeader: any[] = [
  { id: 1, isFilter:false, name: 'Action', isFixed: true, order: 1, title: 'Action'},
  { id: 2, isFilter:false, name: 'RequestCode', isFixed: false, order: 3, title: 'Request code'},  
  { id: 3, isFilter:false, name: 'RequestName', isFixed: false, order: 3, title: 'Request name' },
  { id: 4, isFilter:false, name: 'CreatedBy', isFixed: false, order: 2, title: 'Created by' },
  { id: 5, isFilter:false, name: 'status', isFixed: false, order: 5, title: 'status',className:"approvalstatus" }
  
]

export const ContractRepositoryHeader: any[] = [
  { id: 1, isFilter:false, name: 'Action', isFixed: true, order: 1, title: 'Action'},
  { id: 2, isFilter:false, name: 'AgreementName', isFixed: false, order: 3, title: 'Agreement name'},  
  { id: 3, isFilter:false, name: 'AgreementCode', isFixed: false, order: 3, title: 'Agreement code' },
  { id: 4, isFilter:false, name: 'CreatedDate', isFixed: false, order: 2, title: 'Created Date' },
  { id: 5, isFilter:false, name: 'CreatedBy', isFixed: false, order: 2, title: 'Created by' },
  { id: 6, isFilter:false, name: 'status', isFixed: false, order: 5, title: 'Status',className:"Won" }
  
]


@Injectable({
  providedIn: 'root'
})

export class ContractsService {

  
    constructor(
               private apiService: ApiServiceUI) { }

    getPendingRequest(): Observable<any> {
        return this.apiService.get(routes.pendingRequest);
    }

    getContractRepository(): Observable<any> {
      return this.apiService.get(routes.ContractRepository);
  }
  

 
}
