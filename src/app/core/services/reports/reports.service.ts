import { Injectable } from '@angular/core';

//Reports
export const AvailableReportsHeader: any[] = [
  { id: 1, isFilter: false, hideFilter: true, name: "ReportName", isFixed: true, order: 1, title: 'Report name', isSortDisable: false},
  { id: 2, isFilter: false, hideFilter: true, name: "Description", isFixed: false, order: 2, title: 'Description', isSortDisable: true }
  
];

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor() { }
}
