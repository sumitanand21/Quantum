import { Injectable } from "@angular/core";
import { Observable, ReplaySubject, BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class MessageService {
  subject = new ReplaySubject();
  Modulesubject = new ReplaySubject();
  Rolesubject = new ReplaySubject();
  CoOwnerSubject = new ReplaySubject();
  pastDealsEnableSubject = new BehaviorSubject<any>({originUrl:'/deals/deal/existing'});
  sendMessage(message: boolean) {
    this.subject.next(message);
  }
  sendModuleMessage(message: boolean) {
    this.Modulesubject.next(message);
  }
  sendRole(roles: any) {
    this.Rolesubject.next(roles);
  }
  sendDealCoOwnerMessage(message: boolean) {
    this.CoOwnerSubject.next(message);
  }
  sendPastDealEnable(message: any) {
    this.pastDealsEnableSubject.next(message);
  }
  clearMessage() {
    this.subject.next();
    this.Modulesubject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
  getModuleMessage(): Observable<any> {
    return this.Modulesubject.asObservable();
  }
  getRole(): Observable<any> {
    return this.Rolesubject.asObservable();
  }
  getDealCoOwnerMessage(): Observable<any> {
    return this.CoOwnerSubject.asObservable();
  }
  getPastDealEnable(): Observable<any> {
    return this.pastDealsEnableSubject.asObservable();
  }
}
