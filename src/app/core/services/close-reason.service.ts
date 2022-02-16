import { Injectable } from '@angular/core';
import { ApiServiceOrder, ApiServiceOpportunity } from './api.service';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class CloseReasonService {

  constructor(
    private apiService: ApiServiceOrder, private apiServiceOpportunity: ApiServiceOpportunity) { }
  //getWinCategoryOptionList
  getWinCategoryOptionSet(): Observable<any> {
    return this.apiService.post("OrderBookingOpportunityClosure/GetWinCategoryOptionSet");
  }
  //getWinReasonOptionSet
  getWinReasonOptionSet(payload): Observable<any> {
    return this.apiService.post("OrderBookingOpportunityClosure/GetWinReasonOptionSet", payload);
  }
  //getWinReasonInformationSource
  getWinReasonInformationSource() {
    return this.apiServiceOpportunity.post("v1/MasterManagement/GetInformationSourceOptionSet");
  }
  //saveWinReasonDetails
  saveWinReasonDetails(payload): Observable<any> {
    return this.apiService.post("OrderBookingOpportunityClosure/CreateUpdateWinDetails", payload);
  }
  //saveadditionalWinReasonDetails
  // saveadditionalWinReasonDetails(payload): Observable<any> {
  //   return this.apiService.post("OrderBookingOpportunityClosure/CreateUpdateWinReasonDetails", payload);
  // }
  // Create/Update win reason details
  saveWinReasonData(payload):Observable<any>{
     return this.apiService.post("OrderBookingOpportunityClosure/CreateUpdateWinReasonDetails", payload);
  }
  //retrive win details
  retrieveWinDetails(payload):Observable<any>{
     return this.apiService.post("OrderBookingOpportunityClosure/GetActiveOpportunityWinDetails", payload);
  }
  //retrive reason details
  retrieveWinReasonDetails(payload):Observable<any>{
     return this.apiService.post("OrderBookingOpportunityClosure/GetActiveOpportunityWinReasonDetails", payload);
  }
}
