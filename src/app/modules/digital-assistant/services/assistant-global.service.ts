import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

interface faqChat {
  userType: string; // User' & 'Bot' are the 2 values
  displayName: string;
  dateTime: Date;
  data: string;
  qId: string;
  isHelpLine: boolean;
  isSession: boolean
}
@Injectable({
  providedIn: 'root'
})
export class AssistantGlobalService {

  public postMessageBody: any;
  public chatList: faqChat[] = [];
  public userName: string = ''
  public questions = [];
  public adid: string = ''
  private isCollaborateTabActive = new Subject<{ active: false }>();
  private meetingDetails = new Subject<{ meetingId: string, accountId: string }>();
  private leadDeatils = new Subject<{accountGuid: string,verticalId: string, verticalName: string}>();
  private EmailIds = new Subject<{page: any , emails: any, id: any}>();
  constructor() {

  }
  setCollaborateTabActive(active) {
    this.isCollaborateTabActive.next({ active: active });
  }

  getCollaborateTabActive(): Observable<any> {
    return this.isCollaborateTabActive.asObservable();
  }

  setMeetingDetails(details) {
    this.meetingDetails.next({ meetingId: details.meetingGuid, accountId: details.accountId });
  }

  getMeetingDetails(): Observable<any> {
    return this.meetingDetails.asObservable();
  }
  
  clearMeetingDetails() {
    this.meetingDetails.next();
  }

  setLeadDetails(details) {
    this.leadDeatils.next({ accountGuid: details.accountGuid, verticalId: details.verticalId, verticalName: details.verticalName });
  }

  getLeadDetails(): Observable<any> {
    return this.leadDeatils.asObservable();
  }

  setEmails(details) {
    this.EmailIds.next({page: details.page, emails : details.emailListArray, id: details.id});
  }

  getEmails(): Observable<any> {
    return this.EmailIds.asObservable();
  }

  clearEmail() {
    this.EmailIds.next();
  }

}
