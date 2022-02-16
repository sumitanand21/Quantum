import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { JsonApiService } from "./json-api.service";
import { ApiServiceUI, ApiService } from "./api.service";
import { syncActivity } from "@app/core/models/sync-activity.model";
import { switchMap, map } from "rxjs/operators";

const routes = {
  SyncActivity: "/syncActivity",
  UnsyncActivity: "v1/ActivityGroupManagement/UnSyncList",
  UnsyncActivitySearch: "v1/ActivityGroupManagement/SearchUnSyncList",
  UnsyncActivityEdit: "v1/ActivityGroupManagement/UnsyncActivityEdit",
  MakeSync: "v1/ActivityGroupManagement/MakeSync_V1",
  copy: "v1/ActivityGroupManagement/ActivityGroupManifest",
  SearchOpportunityAndLeads:
    "v1/MeetingManagement/SearchBothOpportunityAndLeads",
  LeadCreate: "v1/ActivityGroupManagement/WiproContacttoLeadUnsynchActivity",
  OpportunityCreate:
    "v1/ActivityGroupManagement/WiproContacttoOpportunityUnsynchActivity",
  WiproContactCreate:
    "v1/ActivityGroupManagement/WiproContacttoUnsynchActivity",
  SearchMarketingTraining: "v1/OtherActivityManagement/SearchMarketingTraining",
  searchLeads: "v1/LeadManagement/SearchBasedOnAccount",
  searchOpportunities: "v1/MeetingManagement/SearchOpportunity",
  searchMarketing:"v1/OtherActivityManagement/SearchMarketing",
  searchTraining:"v1/OtherActivityManagement/SearchTraining",
  activityGroupSearchBasedOnUser:"v1/ActivityGroupManagement/SearchBasedOnUser",
  searchBasedOnUserandAccount:'v1/ActivityGroupManagement/SearchBasedOnUserandAccount',
  searchCampaignBasedOnAccount: 'v1/CampaignManagement/SmallSearchByName',
  searchAccountCompany: 'v1/LeadManagement/AccountnProspect_V1',
  user: (id: number) => `/syncActivity/${id}`
};

export const ExpandHeaderSync: any[] = [
  {
    id: 1,
    hideFilter: true,
    name: "Subject",
    isFixed: true,
    order: 1,
    title: "Subject",
    controltype: "text",
    columnDisable: true
  },
  {
    id: 2,
    hideFilter: true,
    name: "Date",
    isFixed: false,
    order: 2,
    title: "Date & Time",
    controltype: "text",
    columnDisable: true
  },
  {
    id: 3,
    hideFilter: true,
    name: "ActivityGroup",
    isFixed: false,
    order: 3,
    title: "Activity group *",
    controltype: "smartautocomplete",
    closePopUp: false,
    popUp:"@ActivityGroup",
    allias: "_ActivityGroup",
    relationship: "Meeting",
    cascade:"$ActivityGroup",
    isRequired: "true",
    Error: "Please select Activity",  
    validation: "&ActivityGroup",
    ErrorMessage: '#ActivityGroup', ValidMsg: ["Please select Activity"] 
  },
  {
    id: 4,
    hideFilter: true,
    name: "ActivateType",
    isFixed: false,
    order: 4,
    isRequired: "true",
    relationship: "Meeting",
    title: "Activity type *",   
    controltype: "select",
    subReqCol:['&Participant','&Opportunity','&Marketing'],
    validation: "&ActivateType",
    ErrorMessage: '#ActivateType', ValidMsg: ["Please select activity type"] 
  },
  {
    id: 5,
    hideFilter: true,
    name: "Account",
    isFixed: false,
    relationship: "Meeting",
    order: 5,
    allias: "_Account",
    title: "Account *",
    cascade:"$Account",
    popUp:"@Account",
    controltype: "cascadeAutocomplete",
    isRequired: "true",
    Error: "Please select Account",  
    validation: "&Account",
    advanceLookUpEnable:true,
    ErrorMessage: '#Account', ValidMsg: ["Please select Account"] 
  },
  {
    id: 6,
    name: "Meeting",
    isFixed: false,
    order: 6,
    title: "Private",
    controltype: "switch",
    closePopUp: false
  },
  // {
  //   id: 6,
  //   isFilter: false,
  //   name: "Private",
  //   isFixed: false,
  //   order: 6,
  //   title: "Private",
  //   controltype: "switch"
  // },
  {
    id: 7,
    hideFilter: true,
    name: "MeetingType",
    isFixed: false,
    order: 7,
    title: "Meeting type",
    relationship: "Meeting",
    controltype: "select"
  },
  {
    id: 8,
    hideFilter: true,
    name: "Participant",
    isFixed: false,
    order: 8,
    title: "Participant",
    relationship: "Meeting",
    controltype: "popupAutocomplete",
    allias: "_Participant",
    isRequired: "true",
    validation: "&Participant",
    reqStatus:"isParticipantRequired",
    ErrorMessage: '#Participant', ValidMsg: ["Please select participant"]
  }, 
  {
    id: 9,
    hideFilter: true,
    name: "Opportunity",
    isFixed: false,
    order: 9,
    relationship: "Meeting",
    title: "Opportunity/Lead",
    controltype: "popupAutocomplete",
    allias: "_Opportunity",
    isRequired: "true",
    validation: "&Opportunity",
    reqStatus:"isLeadRequired",
    ErrorMessage: '#Opportunity', ValidMsg: ["Please select Opportunity/Lead"]
  },
  {
    id: 10,
    hideFilter: true,
    name: "Marketing",
    isFixed: false,
    order: 10,
    title: "Marketing/Training",
    relationship: "Meeting",
    controltype: "autocomplete",
    closePopUp: false,
    isRequired: "true",
    popUp:"@Marketing",
    allias: "_Marketing",
    validation: "&Marketing",
    reqStatus:"isMarketingRequired",
    ErrorMessage: '#Marketing', ValidMsg: ["Please select campaign"]
  }
];

export const SyncAccount: any[] = [
  { name: 'Name', title: 'Name' },
  { name: 'Owner', title: 'Account Name' },
  { name: 'type', title: 'Account Type' },
   { name : "Geo", title: 'Geo'},
    { name: "Region", title: "Region"},
    { name: "accnumber", title: 'Account Number' }
]

export const DnbSyncAccountHeader: any[] = [

  { name: 'Name', title: 'Name' },
  { name: "Duns", title: 'Duns Id' },
  { name: 'Region', title: 'Region' },
  { name: 'Industry', title: 'Industry' }
]

export const accountHeader = { 'AccountSearch': SyncAccount }

export const SyncAdvNames = {
  'AccountSearch': { name: 'Account', isCheckbox: false, isAccount: true }
}

@Injectable({
  providedIn: "root"
})
export class SyncActivityService {
  selArray = [];
  cachedArray = [];
  constructor(
    private jsonApiService: JsonApiService,
    private apiService: ApiServiceUI,
    private apiServiceFE: ApiService
  ) {}

  getAll(): Observable<syncActivity[]> {
    return this.apiService.get(routes.SyncActivity);
  }

  getSingle(id: number): Observable<syncActivity> {
    return this.apiService.get(routes.user(id));
  }
  getParentHeaderData(): Observable<any[]> {
    return of(ExpandHeaderSync);
  }

  getUnsyncActivity(body) {
    return this.apiServiceFE.post(routes.UnsyncActivity, body);
  }

  searchUnsync(body) {
    return this.apiServiceFE.post(routes.UnsyncActivitySearch, body);
  }

  UnsyncActivityEdit(body) {
    return this.apiServiceFE.post(routes.UnsyncActivityEdit, body);
  }

  activityGroupSearchBasedOnUser(searchText: string) {
    var body = {
      "SearchText": searchText
    }
    return this.apiServiceFE.post(routes.activityGroupSearchBasedOnUser, body)
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

  searchBasedOnUserandAccount(searchText, accountGuid) {
    var body = {
      "SearchText": searchText,
      "AccountGuid": accountGuid
    }
    return this.apiServiceFE.post(routes.searchBasedOnUserandAccount, body)
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

  searchCampaignBasedOnAccount(searchText, AccountGuid, isProspect) {
    var body = 
      {
      "Searchtext": searchText,
      "SearchType":1,
      "Guid": AccountGuid,
      "isProspect":isProspect,
      "PageSize":10,
      "OdatanextLink":"",
      "RequestedPageNumber":1
    }
    return this.apiServiceFE.post(routes.searchCampaignBasedOnAccount, body)
  }

  makeSync(body) {
    // var body = [
    //   {
    //     ActivityGroup: [{ Guid: Guid }]
    //   }
    // ];
    return this.apiServiceFE.post(routes.MakeSync, body);
  }

  copy(body) {
    return this.apiServiceFE.post(routes.copy, body);
  }

  SearchOpportunityAndLeads(searchText) {
    var body = { SearchText: searchText };
    return this.apiServiceFE.post(routes.SearchOpportunityAndLeads, body);
  }

  appointmentLeadCreate(id, data) {
    var body = {
      Guid: id,
      Lead: data
    };
    return this.apiServiceFE.post(routes.LeadCreate, body);
  }

  appointmentOpportunityCreate(id, data) {
    var body = {
      Guid: id,
      Opportunity: data
    };
    return this.apiServiceFE.post(routes.OpportunityCreate, body);
  }

  appointmentWiproContactCreate(id, data) {
    var body = {
      Guid: id,
      WiproParticipant: data
    };
    return this.apiServiceFE.post(routes.WiproContactCreate, body);
  }

  searchMarketingTraining(searchText) {
    var body = { 
      SearchText: searchText,
      "PageSize":10,
      "OdatanextLink":"",
      "RequestedPageNumber":1
     };
    return this.apiServiceFE.post(routes.SearchMarketingTraining, body);
  }

  searchLeads(searchText, accountGuid, isProspect) {
     var body = {
       "SearchText": searchText,
       "SearchType":3,
       "Guid": accountGuid,
       "isProspect":isProspect
      }
    // var body = { SearchText: searchText };
    return this.apiServiceFE.post(routes.searchLeads, body);
  }

  SearchOpportunity(searchText, accountGuid, isProspect) {
    var body = {"Guid": accountGuid,"SearchText": searchText,"isProspect":isProspect}
    return this.apiServiceFE.post(routes.searchOpportunities, body);
  }

  searchMarketing(searchText) {
    var body = { SearchText: searchText };
    return this.apiServiceFE.post(routes.searchMarketing, body);
  }

  searchTraining(searchText) {
    var body = { SearchText: searchText };
    return this.apiServiceFE.post(routes.searchTraining, body);
  }

  getLookUpFilterData(data): Observable<any> {
    switch (data.controlName) {
        case 'AccountSearch': return this.getCampaignAccountData(data);
    }
}
getsearchAccountCompany(body, Serviceparam?): Observable<any> {
  var bodys = {
      "SearchText": body,
      "PageSize": 10,
      "OdatanextLink": '',
      "RequestedPageNumber": 1
  }
  return this.apiServiceFE.post(routes.searchAccountCompany, (Serviceparam) ? Serviceparam : bodys).pipe(
    map(res =>{if(!res.IsError){
        return {
            ...res,
            ResponseObject : res.ResponseObject.map(res1 =>{
                return {
                    ...res1,
                    Name : decodeURIComponent(res1.Name)
                }
            })
        }
    }else{
        return res
    }
    })
);
}
getCampaignAccountData(data): Observable<any> {
  debugger
    if (data.isService) {
        let body = {
            "SearchText": data.useFullData.searchVal,
            "PageSize": data.useFullData.recordCount,
            "OdatanextLink": data.useFullData.OdatanextLink,
            "RequestedPageNumber": data.useFullData.pageNo
        }
        return this.getsearchAccountCompany('', body).pipe(switchMap(res => {
            return of((!res.IsError) ? { ...res, ResponseObject: this.filterAdvnAdvisor(res.ResponseObject) } : { ...res })
        }))
    } else {
        return of(this.filterAdvnAdvisor(data.data))
    }
}

filterAdvnAdvisor(data): Observable<any> {
    if (data) {
        if (data.length > 0) {
            return data.map(x => {
                return {
                    ...x,
                    'Name': (x.Name) ? x.Name : 'NA',
                    'Owner': (x.Owner) ? x.Owner.FullName : 'NA',
                    'Id': (x.SysGuid) ? x.SysGuid : 'NA',
                    'accnumber': (x.Number) ? x.Number : 'NA',
                    'type': (x.Type) ? (x.Type.Value) ? x.Type.Value : 'NA' : 'NA',
                    'Geo': x.Address.Geo.Name,
                    'Region': x.Address.Region.Name,
                }
            })
        } else {
            return of([])
        }
    } else {
        return of([])
    }
}
}
