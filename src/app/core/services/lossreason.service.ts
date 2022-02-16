import { Injectable } from '@angular/core';
import { ApiServiceOrder, ApiServiceOpportunity } from './api.service';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class LossreasonService {

  constructor( private apiService: ApiServiceOrder, private apiServiceOpportunity: ApiServiceOpportunity) { }
   //getLossCategoryOptionList
  getLossCategoryOptionSet(): Observable<any> {
    return this.apiService.post("OrderBookingOpportunityClosure/GetLossCategoryOptionSet");
  }
  //getLossReasonOptionSet
  getLossReasonOptionSet(WiproLossCategory): Observable<any> {
     return this.apiService.post("OrderBookingOpportunityClosure/GetLossReasonOptionSet", WiproLossCategory);
  }
  //getLossReasonInformationSource
  getLossReasonInformationSource() {
    return this.apiServiceOpportunity.post("v1/MasterManagement/GetInformationSourceOptionSet");
  }
  //saveLossReasonDetails
 saveLossDetails(payload): Observable<any>{
   return this.apiService.post("OrderBookingOpportunityClosure/CreateUpdateLossDetails", payload);
 }
 //save loss reason
saveLossReasonDetails(payload): Observable<any>{
   return this.apiService.post("OrderBookingOpportunityClosure/CreateUpdateLossReasonDetails", payload);
 }
//retrive loss details
retrieveLossDetails(payload): Observable<any>{
   return this.apiService.post("OrderBookingOpportunityClosure/GetActiveOpportunityLossDetails", payload);
 }
//
retriveLossReasonDetails(payload):Observable<any>{
   return this.apiService.post("OrderBookingOpportunityClosure/GetActiveOpportunityLossReasonDetails ", payload);
}
}
// OrderBookingOpportunityClosure/CreateUpdateLossDetails
