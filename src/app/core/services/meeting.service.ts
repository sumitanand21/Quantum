import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { env } from 'process';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { map } from 'rxjs/operators';

// const BASE_URL = env.l2oBaseUrl;
const routes = {
  ActivityGroupSearch: 'v1/ActivityGroupManagement/Search',
  SearchActivityGroupBasedOnAccount :'v1/ActivityGroupManagement/SearchActivityGroupBasedOnAccount',
  CreateMeeting: 'v1/MeetingManagement/Create',
  EditMeeting: 'v1/MeetingManagement/Edit',
  CreateMeetingCampaign: 'v1/MeetingManagement/CreateMeetingCampaign',
  DelinkMeetingCampaign: 'v1/MeetingManagement/DelinkMeetingCampaign',
  CreatePotential: 'v1/MeetingManagement/LinkPotentialSolution',
  DelinkPotential: 'v1/MeetingManagement/DelinkPotentialSolution',
  SearchOpportunityOrder: 'v1/MeetingManagement/SearchBothOpportunityAndOrders',
  CreateOpportunityOrder: 'v1/OrderManagement/LinkOrder',
  DelinkOpportunityOrder : 'v1/OrderManagement/DeleteOrder',
  LinkOpportunityOrder:'v1/MeetingManagement/LinkOpportunityAndOrder',
  DelinkOpportunityAndOrder:'v1/MeetingManagement/DeLinkOpportunityAndOrder',
  CommentList:'Attachment/GetAttachmentCommentList',
  searchCustomerparticipants: 'v1/AccountManagement/SearchAccountCustomerContact',
  SearchOrderAndOppBasedOnAccount:'v1/MeetingManagement/SearchBothOpportunityAndOrdersBasedOnAccount',
  SearchLeadBasedOnAccount:'v1/LeadManagement/SearchBasedOnAccount',
  DelinkMultipleAppointmentCustomerContact: 'v1/MeetingManagement/DelinkMultipleAppointmentCustomerContact',
  DeLinkMultipleOpportunityAndOrder:'v1/MeetingManagement/DeLinkMultipleOpportunityAndOrder',
  DelinkMultipleAppointmentlead: 'v1/MeetingManagement/DelinkMultipleAppointment_n_Lead',
  campaignBasedOnAccount : 'v1/CampaignManagement/SmallSearchByName'     //campaign based on account
}


export interface meetingInfo {
  activityGroupId: string
  conversationName?: string,
  conversationType?: any,
  activityType: any,
  meetingDate?: Date,
  access: boolean,
  meetingSubject?: string,
  MoM: string,
  accountDetails: { SysGuid: string, Name: string },
  selectedCustomer: any,
  selectedContact: any,
  selectedTag: any
  selectedsolution: any
  selectedcampaign: any
  selectedLinkedLeads: any
  selectedLinkedOpp: any
  HasConsentToRecord: boolean,
  // activityTypeList: any
}

export interface MeetingEdit {
  conversationName?: string,
  conversationType?: any,
  accntCompanyDetails: any
  activityGroupId: string
  meetingSubject?: string,
  MoM: string,
  access: boolean,
  meetingDate?: Date,
  activityType: any,
  // activityTypeList: any
  selectedCustomer:any;
  editedCustomerContact: any
  selectedContact: any
  editedWiproParticiapnt:any
  selectedTag: any;
  editedTagUser: any;
  selectedcampaign: any;
  editedCampaign:any;
  selectedLinkedLeads: any;
  editedLead: any;
  selectedLinkedOpp: any
  editOppOrder: any
  selectedsolution: any
  editedWiproSolution: any
}
@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  meetingGuid: string = ""
  details: meetingInfo;
  meetingEditDetails: MeetingEdit;
  accountInfoForContact: any;
  constructor(private apiService: ApiService, private encService : EncrDecrService) { }


  activityGroupBasedOnAccount(val,searchText,accountorlead) {
   if (accountorlead == 'account') {
    var body = { "Guid" : val.SysGuid, "SearchText": searchText, "RequestedPageNumber":1, "PageSize":10, "OdatanextLink":"", "isProspect": val.isProspect }
   } else {
    var body = { "Guid" : val.Account.SysGuid, "SearchText": searchText, "RequestedPageNumber":1, "PageSize":10, "OdatanextLink":"", "isProspect": val.Account.isProspect }
   }
    return this.apiService.post(routes.SearchActivityGroupBasedOnAccount, body).pipe(
      map(res =>{if(!res.IsError){
          return {
              ...res,
              ResponseObject : res.ResponseObject.map(res1 =>{
                  return {
                      ...res1,
                      Account :{
                        "SysGuid": res1.Account.SysGuid,
                        "Name": decodeURIComponent(res1.Account.Name),
                        "isProspect":res1.Account.isProspect
                     },
                  }
              })
          }
      }else{
          return res
      }
      })
  );
  }

  activityGroup(searchText) {
    var body = {
      "SearchText": searchText,
      "RequestedPageNumber":1,
      "PageSize":10,
      "OdatanextLink":""
    }
    return this.apiService.post(routes.ActivityGroupSearch, body)
    .pipe(
      map(res =>{if(!res.IsError){
          return {
              ...res,
              ResponseObject : res.ResponseObject.map(res1 =>{
                  return {
                      ...res1,
                      Account :{
                        "SysGuid": res1.Account.SysGuid,
                        "Name": decodeURIComponent(res1.Account.Name),
                        "isProspect":res1.Account.isProspect
                     },
                  }
              })
          }
      }else{
          return res
      }
      })
  );
  }

  searchActivityGroup(searchText: string) {
    if (sessionStorage.getItem('selAccountObj')) { 
      let selAccountObj = JSON.parse(this.encService.get("EncryptionEncryptionEncryptionEn", sessionStorage.getItem('selAccountObj'), "DecryptionDecrip"));
      return this.activityGroupBasedOnAccount(selAccountObj,searchText,'account');
    } else {
      let lead = JSON.parse(sessionStorage.getItem('TempEditLeadDetails'));
      if (lead) {
        if (lead.isMeetingCreate && lead.isMeetingCreate == true) {
          return this.activityGroupBasedOnAccount(lead,searchText,'lead');
        } else {
          return this.activityGroup(searchText);
        }
      } else {
        return this.activityGroup(searchText);
      }
    }
  }

  createMeeting(body) {
  let token= localStorage.getItem('token').toString()
  debugger
   let en = this.encService.set(token.substring(0,32), JSON.stringify(body), "DecryptionDecrip");
   console.log("fcgvhbjnm", en)
   let dc = this.encService.get(token.substring(0,32),en , 'DecryptionDecrip');
   console.log(JSON.parse(dc))

    return this.apiService.post(routes.CreateMeeting, body)
  }

  editMeeting(body) {
    return this.apiService.post(routes.EditMeeting, body)
  }

  CreateCampaign(guId, campaignId) {
    var body = {
      "Guid": guId,
      "Campaign": [{ "Id": campaignId }]
    }
    return this.apiService.post(routes.CreateMeetingCampaign, body)
  }

  DelinkCampaign(id) {
    var body = { MapGuid: id }
    return this.apiService.post(routes.DelinkMeetingCampaign, body)
  }

  createPotential(guId, SysGuid) {
    var body = {
      "Guid": guId,
      "WiproPotentialSolution": [
        {
          "SysGuid": SysGuid
        }
      ]
    }
    return this.apiService.post(routes.CreatePotential, body)
  }

  delinkPotential(id) {
    var body = {
      "MapGuid": id
    }
    return this.apiService.post(routes.DelinkPotential, body)
  }

  searchOpportunityOrder(searchText) {
    var body = { "SearchText": searchText }
    return this.apiService.post(routes.SearchOpportunityOrder, body)
  }

  createOpportunityOrder(guId, orderGuId) {
    var body = {
      "Guid": guId,
      "Orders": [
        { "Guid": orderGuId }
      ]
    }
    return this.apiService.post(routes.CreateOpportunityOrder, body)
  }

  linkOpportunityAndOrder(sysGuid, mapGuid, activityGuid, type) {
    var body =[{"SysGuid":sysGuid,"MapGuid": mapGuid,"ActivityGuid": activityGuid,"Type": type}]
    return this.apiService.post(routes.LinkOpportunityOrder, body)
  }


  dealinkOpportunityAndOrder(sysGuid, mapGuid, type) {
    var body = {"SysGuid":sysGuid,"MapGuid": mapGuid,"Type": type}
    return this.apiService.post(routes.DelinkOpportunityAndOrder, body)
  }
  
  delinkOpportunityOrder(id) {
    var body = {"Orders":[{"MapGuid":id}]}
    return this.apiService.post(routes.DelinkOpportunityOrder, body)
  }

  getComments(id) {
    var body= {"Id":id}
    return this.apiService.post(routes.CommentList, body)
  }

  searchCustomerparticipants(searchText, Guid, isProspect, Serviceparam?) {
   var body=  {
      "SearchText": searchText,
      "Guid": Guid, 
      "isProspect":isProspect,
      "RequestedPageNumber":1,
      "PageSize":10,
      "OdatanextLink":""
  }
    return this.apiService.post(routes.searchCustomerparticipants, (Serviceparam) ? Serviceparam : body)
  }

  SearchOrderAndOppBasedOnAccount(Guid, searchText,isProspect, Serviceparam?) {
   var body= {
     "Guid": Guid,
     "SearchText":searchText,
     "isProspect": isProspect,
     "PageSize": 10,
     "OdatanextLink": '',
     "RequestedPageNumber": 1
    }
   return this.apiService.post(routes.SearchOrderAndOppBasedOnAccount, (Serviceparam) ? Serviceparam : body)
  }

  SearchLeadBasedOnAccount(Guid, searchText, isProspect, Serviceparam?) {

    var body = {
      "SearchText":searchText,
      "SearchType":3,
      "Guid":Guid,
      "isProspect": isProspect,
      "PageSize": 10,
      "OdatanextLink": '',
      "RequestedPageNumber": 1
    }
    return this.apiService.post(routes.SearchLeadBasedOnAccount, (Serviceparam) ? Serviceparam : body)
  }

  DelinkMultipleAppointmentCustomerContact(customerData) {
    var body = customerData
    return this.apiService.post(routes.DelinkMultipleAppointmentCustomerContact,body)
  }
  DeLinkMultipleOpportunityAndOrder(oppOrderData) {
    var body = oppOrderData;
    return this.apiService.post(routes.DeLinkMultipleOpportunityAndOrder, body)
  }

  DelinkMultipleAppointmentlead(leadData) {
    var body = leadData;
    return this.apiService.post(routes.DelinkMultipleAppointmentlead, body)
  }
  // meeting Guid
  get createdMeetingGuid() {
    return this.meetingGuid
  }

  set createdMeetingGuid(value) {
    this.meetingGuid = value
  }

  // meeting deatils save
  get meetingDetails() {
    return this.details
  }

  set meetingDetails(val) {
    this.details = val
  }
// meeting edit
  get meetingEditDetailsInfo() {
    return this.meetingEditDetails
  }

  set meetingEditDetailsInfo(val) {
    this.meetingEditDetails = val
  }
  // For Customer Contact 
  set customerContactAccountFromMeeting (value) {
    this.accountInfoForContact = value
  }

  get customerContactAccountFromMeeting() {
    return this.accountInfoForContact
  }
 
  campaignBasedOnAccount(Search,Guid,isProspect) {
    var body = {
      "Searchtext":Search,
      "SearchType":1,
      "Guid": Guid,
      "isProspect":isProspect,
      "PageSize":10,
      "OdatanextLink":"",
      "RequestedPageNumber":1
    }
    return this.apiService.post(routes.campaignBasedOnAccount, body)
  }

}
