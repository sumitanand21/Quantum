import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '@env/environment';
import { Observable ,  from as fromPromise ,  of } from 'rxjs';
import { SearchCustomerOrCompanyContact } from '@app/core/interfaces/search-customer-or-company-contact';
import { SearchCompanyOrAccountName } from '@app/core/interfaces/search-company-or-account-name';
import { WiproContacts } from '@app/core/interfaces/wipro-contacts';
import { GetFunction } from '@app/core/interfaces/get-function';
import { GetSubPurpose } from '@app/core/interfaces/get-sub-purpose';
import { GetSubActivity } from '@app/core/interfaces/get-sub-activity';
import { GetCampaignType } from '@app/core/interfaces/get-campaign-type';
import { GetChannel } from '@app/core/interfaces/get-channel';
import { GetPlatform } from '@app/core/interfaces/get-platform';
import { GetActivity } from '@app/core/interfaces/get-activity';
import { GetRelationship } from '@app/core/interfaces/get-relationship';
import { GetSalutation } from '@app/core/interfaces/get-salutation';
import { GetLeadSource } from '@app/core/interfaces/get-lead-source';
import { GetEnquiryType } from '@app/core/interfaces/get-enquiry-type';
import { GetStatusCode } from '@app/core/interfaces/get-status-code';
import { GetPriorityCode } from '@app/core/interfaces/get-priority-code';
import { GetCountryByName } from '@app/core/interfaces/get-countryname';
import { GetReportingManager } from '@app/core/interfaces/get-reportingmanager';
import { GetCityByName } from '@app/core/interfaces/get-city-by-name';
import { GetSearchAccountCompany } from '@app/core/interfaces/get-search-accont-company'
import { GetStateCode } from '../interfaces/get-state-code';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { OfflineService } from './offline.services'
import { GetActivityType } from '../interfaces/get-activity-type';
import { ApiService } from '@app/core/services/api.service';
import { EnvService } from './env.service';

//two api added below
// const  cacheResponse ={
//   getMasterActivity:async (key)=>await this.offlineService.getMasterDataCache
// };
const envADAL = new EnvService();

// Read environment variables from browser window

const browserWindow = window || {};
const browserWindowEnv = browserWindow['__env'] || {};

// Assign environment variables from browser window to env
// In the current implementation, properties from env.js overwrite defaults from the EnvService.

// If needed, a deep merge can be performed here to merge properties instead of overwriting them.

for (const key in browserWindowEnv) {
  if (browserWindowEnv.hasOwnProperty(key)) {

    envADAL[key] = window['__env'][key];
  }
}

const BASE_URL = envADAL.l2oBaseUrl;
const L3_BASE_URL = envADAL.l3oBaseUrl;
export const routes = {
  customerContact: 'v1/AccountManagement/SearchCustomerCompanyContact',
    companyContact: 'v1/SearchManagement/SearchAccount',
    contactSearch: 'v1/SearchManagement/SearchUser',
    function: 'v1/MasterManagement/Function',
    purpose: 'v1/MasterManagement/SubPurpose',
    subActivity: 'v1/MasterManagement/SubActivity',
    campaignType: 'v1/MasterManagement/CampaignType',
    channelType: 'v1/MasterManagement/Channel',
    platform: 'v1/MasterManagement/Platform',
    activity: 'v1/MasterManagement/Type',
    relationship: 'v1/MasterManagement/Relationship',
    categoryapi: 'v1/MasterManagement/GetCategory',
    contactReferenceType  :'v1/MasterManagement/ContactReferenceType',
    contactReferenceMode:'v1/MasterManagement/ContactReferenceMode',
    salutation: 'v1/MasterManagement/Saluation',
    leadSource: 'v1/LeadManagement/Source',
    enquirytype: 'v1/MasterManagement/EnquiryType',
    state: 'v1/MasterManagement/ActionStateCode',
    status: 'v1/MasterManagement/StatusValueBasedOnState',
    priority: 'v1/MasterManagement/GetPriorityCode',
    CountryByName: 'v1/AccountManagement/CountryName',
    ReportingManager: 'v1/EmployeeManagement/ManagerSearch',
    city: 'v1/AccountManagement/CityName',
    searchAccountCompany: 'v1/LeadManagement/AccountnProspect_V1',
    GetActivities: 'v1/campaignManagement/Activities',
    GetSubActivities: 'v1/CampaignManagement/SubActivities',
    GetConversationType: 'v1/MasterManagement/ConversationType',
    getProspectType: 'v1/MasterManagement/ProspectType',
    getProspectRequestType: 'v1/MasterManagement/ProspectRequest',
    getProspectStatusCode: 'v1/MasterManagement/ProspectStatusCode',
    getProspectOwnerShipType: 'v1/MasterManagement/ProspectOwnership',
    getContactType: 'v1/MasterManagement/ContactType',
    meetingFrequency: 'v1/MasterManagement/MeetingFrequency',
    getCurrency: 'v1/MasterManagement/Cuurency',
    SearchSBUByname: 'v1/CampaignManagement/SBUByName',
    SearchVerticalByname: 'v1/CampaignManagement/VerticalByName',
    ActivityType: 'v1/MasterManagement/Type ',
    SaveAccountRE: 'v3/CustomerManagement_Sprint3Controller/Account/AccountRE/Edit',
    SearchSwapAccounts: 'v3/CustomerManagement_Sprint3Controller/SearchSwapAccounts',
    SaveAccountOverview: 'v3/CustomerManagement_Sprint3Controller/Account/Overview/Edit',
    SaveRelationShips: 'v3/CustomerManagement_Sprint3Controller/Account/RelationShips/Edit',
    SaveCustomerDetails: 'v3/CustomerManagement_Sprint3Controller/Account/CustomerDetails/Edit',
    AddCBU: 'v3/CustomerManagement_Sprint3Controller/Account/AddCBU',
    ActivateorDeActivateAccountCBU: 'v3/CustomerManagement_Sprint3Controller/Account/ActivateorDeActivateAccountCBU',
    SearchAllianceAccounts: 'v3/CustomerManagement_Sprint3Controller/Account/SearchAllianceAccounts',
    TransitionChecklist:"v1/MasterManagement/TransitionOperationCheckList",
    KTChecklist:"v1/MasterManagement/KTCheckList",
    TransitionResponsibility:"v1/MasterManagement/Responsibility",
    GetGrowthCategory: 'v1/MasterManagement/GrowthCategory',
    GetCoverageLevel: 'v1/MasterManagement/CoverageLevel',
    GetRevenueCategory: 'v1/MasterManagement/RevenueCategory',
    RegionByGeo: 'v3/CustomerManagement_Sprint3Controller/RegionByGeo',
    CityByState: 'v3/CustomerManagement_Sprint3Controller/CityByState',
    StateByCountry: 'v3/CustomerManagement_Sprint3Controller/StateByCountry',
    CountryByGeo: 'v3/CustomerManagement_Sprint3Controller/CountryByGeo',
    CountryByRegion: 'v3/CustomerManagement_Sprint3Controller/CountryByRegion',
    AccountAttributeComment: 'v3/CustomerManagement_Sprint3Controller/AccountAttributeComment',
    // getProspectOwnerShipType: 'v3/CustomerManagement_Sprint3Controller/Master/GetProspectOwnerShipType',
    UltimateParentAccount: 'v3/CustomerManagement_Sprint3Controller/GetBothAccountProspectIdByName',
    SearchCBU: 'v3/CustomerManagement_Sprint3Controller/SearchCBU',
    SBUByName: 'v1/CampaignManagement/SBUByName',
    GetVerticalbySBUID: 'v1/CampaignManagement/GetVerticalbySBUID',
    SubVerticalByVertical: 'v3/CustomerManagement_Sprint3Controller/SubVerticalByVertical',
    FinancialYear: 'v3/CustomerManagement_Sprint3Controller/FinancialYear',
    ParentAccount: 'v1/AccountManagement/SearchAccount',
    Accountowner: 'Search/SearchUser',
    SearchUser: 'v1/SearchManagement/SearchUser',
    GetSBUbyVertical: 'v1/CampaignManagement/GetSBUbyVertical',
    GetVerticalBySubVertical: 'v1/CampaignManagement/GetVerticalBySubVertical',
    SubVerticalName: 'v1/AccountManagement/SubVerticalName',
    VerticalByName: 'v1/CampaignManagement/VerticalByName',
    GetAccountRelationShipType: 'v1/MasterManagement/AccountRelationShipType',
    GetAccountType: 'v1/MasterManagement/AccountType',
    GetProposedAccountType: 'v1/MasterManagement/ProposedAccountType',
    GetAccountClassification: 'v1/MasterManagement/AccountClassification',
    GetProposedAccountClassification: 'v1/MasterManagement/ProposedAccountClassification',
    SearchAccount: 'v1/AccountManagement/SearchAccount',
    VerticalandSBU: 'v3/CustomerManagement_Sprint3Controller/VerticalandSBU',
    GetGeoByName: 'v1/AccountManagement/GetGeographyByName',
    GetAccountCategory: 'v1/MasterManagement/AccountCategory',
    GetAccountLifeCycleStage: 'v1/MasterManagement/AccountLifeCycleStage',
    GetAccountRelationShipStatus: 'v1/MasterManagement/AccountRelationShipStatus',
    SearchCustomerCompanyContact: 'v1/AccountManagement/SearchCustomerCompanyContact',
    GetGeographyByName: 'v1/AccountManagement/GetGeographyByName',
    getEntityType: 'v1/MasterManagement/EntityType',
    GetRouteRoles:'v1/EmployeeManagement/RoleEntityPermission',
    MasterManagementStatusCode: 'v1/MasterManagement/StatusCode'
} 
@Injectable({
  providedIn: 'root'
})
export class MasterApiService {
  MaterApiCache: any;

  constructor(private http: HttpClient,
    private apiService: ApiService,
    private offlineService: OfflineService,
    ) { }
    getActivityType() {
      return this.apiService.get(routes.ActivityType);
    }
  
  getCustomerContactSearch(){
    return this.apiService.post(routes.customerContact, {});
  }

  getcompanyContactSearch(){
    return this.apiService.post(routes.companyContact, {});
  }

  getRouteRoles(userId){
    return this.apiService.post(routes.GetRouteRoles,{SysGuid:userId})
  }
  getWiproContact(){
    return this.apiService.post(routes.contactSearch, {});
  }

  getFunction() {

    return fromPromise(this.getMasterCache(routes.function)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of (cacheresult)
        } else {
          return this.apiService.post(routes.function, {});
        }
      }), catchError(err => {
        return []
      })
      
    )
   
  }

  getPurpose() {
    // return this.apiService.post<GetSubPurpose>(BASE_URL + routes.purpose, {});
    return fromPromise(this.getMasterCache(routes.purpose)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of (cacheresult)
        } else {
          return this.apiService.post(routes.purpose, {})
        }
      }), catchError(err => {
        return []
      })
      
    )
  }

  getSubActivity() {
    // return this.apiService.post<GetSubActivity>(BASE_URL + routes.subActivity, {});
    return fromPromise(this.getMasterCache(routes.GetSubActivities)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of (cacheresult)
        } else {
          return this.apiService.post(routes.GetSubActivities, {})
        }
      }), catchError(err => {
        return []
      })
      
    )
  }

  getCampaignType() {

    return fromPromise(this.getMasterCache(routes.campaignType)).pipe(
      switchMap(cacheresult => {
        if (cacheresult) {
          return of (cacheresult)
        } else {
          return this.apiService.post( routes.campaignType, {});
        }
      }), catchError(err => {
        return []
      })
      
    )
  
  }

  getChannelType(): Observable<GetChannel> {
    return fromPromise(this.getMasterCache(routes.channelType)).pipe(
      switchMap(cacheresult => {
        if (cacheresult) {
          return of (cacheresult)
        } else {
          return this.apiService.post( routes.channelType, {})
        }
      }), catchError(err => {
        return []
      })
      
    )
    
    // return this.apiService.post<GetChannel>(BASE_URL + routes.channelType, {})
  }

  

  getPlatofrm(): Observable<GetPlatform> {

    return fromPromise(this.getMasterCache(routes.platform)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of (cacheresult)
        } else {
          return this.apiService.post(routes.platform, {});
        }
      }), catchError(err => {
        return []
      })
      
    )
    
  }

  getActivity() {
      return this.apiService.post(routes.activity, {})
  }

  getRelationship() {
    // return this.apiService.post<GetRelationship>(BASE_URL + routes.relationship, {});
    return fromPromise(this.getMasterCache(routes.relationship)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of (cacheresult)
        } else {
          return this.apiService.post( routes.relationship, {})
        }
      }), catchError(err => {
        return []
      })
      
    )
  }

  getCategory() {
    return fromPromise(this.getMasterCache(routes.categoryapi)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of (cacheresult)
        } else {
          return this.apiService.post( routes.categoryapi, {})
        }
      }), catchError(err => {
        return []
      })
      
    )
  }

  getSalutation() {
    // return this.apiService.post<GetSalutation>(BASE_URL + routes.salutation, {});
    return fromPromise(this.getMasterCache(routes.salutation)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of (cacheresult)
        } else {
          return this.apiService.post( routes.salutation, {})
        }
      }), catchError(err => {
        return []
      })
      
    )
  }
  
  getContactReferenceType() {
    return fromPromise(this.getMasterCache(routes.contactReferenceType)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of (cacheresult)
        } else {
          return this.apiService.post( routes.contactReferenceType, {})
        }
      }), catchError(err => {
        return []
      })
      
    )
  }
  
  getContactReferenceMode() {
    return fromPromise(this.getMasterCache(routes.contactReferenceMode)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of (cacheresult)
        } else {
          return this.apiService.post( routes.contactReferenceMode, {})
        }
      }), catchError(err => {
        return []
      })
      
    )
  }

  getLeadSource() {
    return this.apiService.post( routes.leadSource, {});
  }

  getEnquiryType() {

    return fromPromise(this.getMasterCache(routes.enquirytype)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of (cacheresult)
        } else {
          return this.apiService.post( routes.enquirytype, {});
        }
      }), catchError(err => {
        return []
      })
      
    )  
  }

  getStateCode() {
    return fromPromise(this.getMasterCache(routes.state)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of (cacheresult)
        } else {
          return this.apiService.post( routes.state, {});
        }
      }), catchError(err => {
        return []
      })
    )
  }

  getStatusCode() {
    return fromPromise(this.getMasterCache(routes.status)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of (cacheresult)
        } else {
          return this.apiService.post( routes.status, {})
        }
      }), catchError(err => {
        return []
      })
    )}

    getNewStatusCode() {
      return this.apiService.post( routes.MasterManagementStatusCode, {})
    }

  getPriority() {

    return fromPromise(this.getMasterCache(routes.priority)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of (cacheresult)
        } else {
          return this.apiService.post( routes.priority, {})
        }
      }), catchError(err => {
        return []
      })
      
    )

    // return this.apiService.post<GetPriorityCode>(BASE_URL + routes.priority, {})

  }
  getEntityType(): Observable<any> {

    return fromPromise(this.getMasterCache(routes.getEntityType)).pipe(
      switchMap(cacheresult => {
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.http.post(BASE_URL + routes.getEntityType, {});
        }
      }), catchError(err => {
        return []
      })

    )

  }
  getGeo(value): Observable<any> {

    return this.http.post(BASE_URL + routes.GetGeoByName, { "SearchText": value });

  }
  SearchCBU(value): Observable<any> {
    return this.http.post<any>(L3_BASE_URL + routes.SearchCBU, { "SearchText": value });
  }
  getCountry() {
    return this.apiService.post(routes.CountryByName, {});
  }
  getReportingManager(): Observable<GetReportingManager> {
    return this.apiService.post(routes.ReportingManager, {});
  }
  getCity(): Observable<GetCityByName> {
    return this.apiService.post(routes.city, {});
  }

  getsearchAccountCompany() {

    return this.apiService.post(routes.searchAccountCompany, {});
  }

  getActivities(): Observable<any> {
    // return this.apiService.post(BASE_URL + routes.GetActivities, {});
    return fromPromise(this.getMasterCache(routes.GetActivities)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of (cacheresult)
        } else {
          return this.apiService.post(routes.GetActivities, {})
        }
      }), catchError(err => {
        return []
      })
      
    )
  }

  getSubActivities(){
    // return this.apiService.post(BASE_URL + routes.GetSubActivities, {});
    return fromPromise(this.getMasterCache(routes.GetSubActivities)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of (cacheresult)
        } else {
          return this.apiService.post(routes.GetSubActivities, {})
        }
      }), catchError(err => {
        return []
      })
      
    )
  }

  getSubActivitiesBasedOnActivity(Guid){

    var body = {
        "Guid" : Guid
        }
          return this.apiService.post(routes.GetSubActivities, body)

  }

  getConversationType() {

    return fromPromise(this.getMasterCache(routes.GetConversationType)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of (cacheresult)
        } else {
          return this.apiService.post(routes.GetConversationType, {});
        }
      }), catchError(err => {
        return []
      })
      
    )
   
  }

  //prospect account master 
  getProspectType() {
    // return this.apiService.post(BASE_URL + routes.getProspectType, {});
    return fromPromise(this.getMasterCache(routes.getProspectType)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of (cacheresult)
        } else {
          return this.apiService.post(routes.getProspectType, {})
        }
      }), catchError(err => {
        return []
      })
      
    )
  }

  getProspectRequestType() {
    // return this.apiService.post(BASE_URL + routes.getProspectRequestType, {});
    return fromPromise(this.getMasterCache(routes.getProspectRequestType)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of (cacheresult)
        } else {
          return this.apiService.post(routes.getProspectRequestType, {})
        }
      }), catchError(err => {
        return []
      })
      
    )
  }

  getProspectStatusCode() {
    // return this.apiService.post(BASE_URL + routes.getProspectStatusCode, {});
    return fromPromise(this.getMasterCache(routes.getProspectStatusCode)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of (cacheresult)
        } else {
          return this.apiService.post(routes.getProspectStatusCode, {})
        }
      }), catchError(err => {
        return []
      })
      
    )
  }

  getProspectOwnerShipType() {
    return this.apiService.post(routes.getProspectOwnerShipType, {});
    // return fromPromise(this.getMasterCache(routes.getProspectOwnerShipType)).pipe(
    //   switchMap(cacheresult => {
    //     console.log(cacheresult)
    //     if (cacheresult) {
    //       return of (cacheresult)
    //     } else {
    //       return this.apiService.post(routes.getProspectOwnerShipType, {})
    //     }
    //   }), catchError(err => {
    //     return []
    //   })
    // )
  }

  getContactType() {

    return fromPromise(this.getMasterCache(routes.getContactType)).pipe(
      switchMap(cacheresult => {
        if (cacheresult) {
          return of (cacheresult)
        } else {
          return this.apiService.post(routes.getContactType, {});
        }
      }), catchError(err => {
        return []
      })
      
    )
  
  }
  getMeetingFrequency() {

    return fromPromise(this.getMasterCache(routes.meetingFrequency)).pipe(
      switchMap(cacheresult => {
        if (cacheresult) {
          return of (cacheresult)
        } else {
          return this.apiService.post(routes.meetingFrequency, {});
        }
      }), catchError(err => {
        return []
      })
      
    )
   
  }
  getCurrency() {

    return fromPromise(this.getMasterCache(routes.getCurrency)).pipe(
      switchMap(cacheresult => {
        if (cacheresult) {
          return of (cacheresult)
        } else {
          return this.apiService.post(routes.getCurrency, {});
        }
      }), catchError(err => {
        return []
      })
      
    )

   
  }

  addMasterCache(key: string, data?: any) {
    this.offlineService.addMasterApiCache(key, data)
  }
  async getMasterCache(key: string) {
    // return true
    const CacheRes = await this.offlineService.getMasterDataCache(key)
    console.log("got cache respo se master")
    console.log(CacheRes)
    // return []
    if (CacheRes) {
       
      return CacheRes.data
    } else {
      this.MaterApiCache = null
      return null
    }
  }
  SaveAccountRE(data) {
    return this.http.post(L3_BASE_URL + routes.SaveAccountRE, data);
  }
  SaveAccountOverview(data) {
    return this.http.post(L3_BASE_URL + routes.SaveAccountOverview, data);
  }
  SaveCustomerDetails(data) {
    return this.http.post(L3_BASE_URL + routes.SaveCustomerDetails, data);
  }
  SaveRelationShips(data) {
    return this.http.post(L3_BASE_URL + routes.SaveRelationShips, data);
  }
  ActivateorDeActivateAccountCBU(id, IsActivate) {
    console.log(id, IsActivate);

    return this.http.post(L3_BASE_URL + routes.ActivateorDeActivateAccountCBU, { 'MapGuid': id, IsActivate: IsActivate });
  }
  // HuntingCount(id) {
  //   return this.http.post(L3_BASE_URL + routes.HuntingCount, { 'Guid': id });
  // }
  /* End of Kunal..*/
  // GetRevenueCategory(): Observable<any> {
  //   return this.http.post<any>(L3_BASE_URL + routes.GetRevenueCategory, {});
  // }
  // GetGrowthCategory(): Observable<any> {
  //   return this.http.post<any>(L3_BASE_URL + routes.GetGrowthCategory, {});
  // }
  // GetCoverageLevel(): Observable<any> {
  //   return this.http.post<any>(L3_BASE_URL + routes.GetCoverageLevel, {});
  // }
  // GetAccountLifeCycleStage(): Observable<any> {
  //   return this.http.post<any>(L3_BASE_URL + routes.GetAccountLifeCycleStage, {});
  // }
  // GetAccountRelationShipStatus(): Observable<any> {
  //   return this.http.post<any>(L3_BASE_URL + routes.GetAccountRelationShipStatus, {});
  // }
  // GetProspectOwnerShipType(): Observable<any> {
  //   return this.http.post<any>(L3_BASE_URL + routes.GetProspectOwnerShipType, {});
  // }

  //Ishant
  transitionOperationChecklistMaster(reqBody): Observable<any> {
    return this.http.post(BASE_URL + routes.TransitionChecklist, reqBody);
  }

  getKTCheckListMaster(reqBody): Observable<any> {
    return this.http.post(BASE_URL + routes.KTChecklist, reqBody);
  }

  getResponsibilityMaster(): Observable<any> {
    let reqBody = {};
    return this.http.post(BASE_URL + routes.TransitionResponsibility, reqBody);
  }
  GetGrowthCategory(): Observable<any> {
    // return this.http.post(BASE_URL + routes.getProspectOwnerShipType, {});
    return fromPromise(this.getMasterCache(routes.GetGrowthCategory)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.http.post(BASE_URL + routes.GetGrowthCategory, {})
        }
      }), catchError(err => {
        return []
      })

    )
  }
  GetCoverageLevel(): Observable<any> {
    // return this.http.post(BASE_URL + routes.getProspectOwnerShipType, {});
    return fromPromise(this.getMasterCache(routes.GetCoverageLevel)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.http.post(BASE_URL + routes.GetCoverageLevel, {})
        }
      }), catchError(err => {
        return []
      })

    )
  }
  GetRevenueCategory(): Observable<any> {
    // return this.http.post(BASE_URL + routes.getProspectOwnerShipType, {});
    return fromPromise(this.getMasterCache(routes.GetRevenueCategory)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.http.post(BASE_URL + routes.GetRevenueCategory, {})
        }
      }), catchError(err => {
        return []
      })

    )
  }
  GetAccountRelationShipType(): Observable<any> {
    // return this.http.post(BASE_URL + routes.getProspectOwnerShipType, {});
    return fromPromise(this.getMasterCache(routes.GetAccountRelationShipType)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.http.post(BASE_URL + routes.GetAccountRelationShipType, {})
        }
      }), catchError(err => {
        return []
      })
    )
  }
  GetAccountType(): Observable<any> {
    // return this.http.post(BASE_URL + routes.getProspectOwnerShipType, {});
    return fromPromise(this.getMasterCache(routes.GetAccountType)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.http.post(BASE_URL + routes.GetAccountType, {"SearchText":""})
        }
      }), catchError(err => {
        return []
      })
    )
  }
  GetProposedAccountType(): Observable<any> {
    // return this.http.post(BASE_URL + routes.getProspectOwnerShipType, {});
    return fromPromise(this.getMasterCache(routes.GetProposedAccountType)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.http.post(BASE_URL + routes.GetProposedAccountType, {})
        }
      }), catchError(err => {
        return []
      })
    )
  }
  GetAccountClassification(): Observable<any> {
    // return this.http.post(BASE_URL + routes.getProspectOwnerShipType, {});
    return fromPromise(this.getMasterCache(routes.GetAccountClassification)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.http.post(BASE_URL + routes.GetAccountClassification, {"SearchText":""})
        }
      }), catchError(err => {
        return []
      })
    )
  }
  GetProposedAccountClassification(): Observable<any> {
    // return this.http.post(BASE_URL + routes.getProspectOwnerShipType, {});
    return fromPromise(this.getMasterCache(routes.GetProposedAccountClassification)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.http.post(BASE_URL + routes.GetProposedAccountClassification, {})
        }
      }), catchError(err => {
        return []
      })
    )
  }
  GetAccountCategory(): Observable<any> {
    // return this.http.post(BASE_URL + routes.getProspectOwnerShipType, {});
    return fromPromise(this.getMasterCache(routes.GetAccountCategory)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.http.post(BASE_URL + routes.GetAccountCategory, {})
        }
      }), catchError(err => {
        return []
      })
    )
  }
  GetAccountLifeCycleStage(): Observable<any> {
    // return this.http.post(BASE_URL + routes.getProspectOwnerShipType, {});
    return fromPromise(this.getMasterCache(routes.GetAccountLifeCycleStage)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.http.post(BASE_URL + routes.GetAccountLifeCycleStage, {})
        }
      }), catchError(err => {
        return []
      })

    )
  }
  GetAccountRelationShipStatus(): Observable<any> {
    // return this.http.post(BASE_URL + routes.getProspectOwnerShipType, {});
    return fromPromise(this.getMasterCache(routes.GetAccountRelationShipStatus)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.http.post(BASE_URL + routes.GetAccountRelationShipStatus, {})
        }
      }), catchError(err => {
        return []
      })

    )
  }
  getSearchCustomerCompanyContact(keyword): Observable<any> {
    return this.http.post<any>(BASE_URL + routes.SearchCustomerCompanyContact, { "SearchText": keyword });
  }
  SearchAccount(keyword): Observable<any> {
    return this.http.post<any>(BASE_URL + routes.SearchAccount, { "SearchText": keyword });
  }
  SeachVerticalandSBU(keyword): Observable<any> {
    return this.http.post<any>(L3_BASE_URL + routes.VerticalandSBU, { "SearchText": keyword });
  }
  SearchAllianceAccounts(keyword): Observable<any> {
    return this.http.post<any>(L3_BASE_URL + routes.SearchAllianceAccounts, { "SearchText": keyword });
  }
  GetGeographyByName(keyword): Observable<any> {
    return this.http.post<any>(BASE_URL + routes.GetGeographyByName, { "SearchText": keyword });
  }
  RegionByGeo(Guid, keyword): Observable<any> {
    return this.http.post<any>(L3_BASE_URL + routes.RegionByGeo, { "Guid": Guid, "SearchText": keyword });
  }
  SearchAccountOwner(keyword): Observable<any> {
    return this.http.post<any>(L3_BASE_URL + routes.SearchUser, { "SearchText": keyword });
  }
  
  getregionbygeo(id, value): Observable<any> {
    return this.http.post(L3_BASE_URL + routes.RegionByGeo, { "Guid": id, "SearchText": value });
  }

  getCityByState(id, value): Observable<any> {
    return this.http.post(L3_BASE_URL + routes.CityByState, { "Guid": id, "SearchText": value })
  }
  CityByState(id, value): Observable<any> {
    return this.http.post<any>(L3_BASE_URL + routes.CityByState, { 'Guid': id, 'SearchText': value });
  }
  // CountryByRegion  getcountrybygeo

  CountryByRegion(id, value) {
    return this.http.post(L3_BASE_URL + routes.CountryByRegion, { "Guid": id, "SearchText": value })
  }
  getStateByCountry(id, value) {
    return this.http.post(L3_BASE_URL + routes.StateByCountry, { "Guid": id, "SearchText": value })
  }
  UltimateParentAccount(value): Observable<any> {
    return this.http.post<any>(L3_BASE_URL + routes.UltimateParentAccount, { 'SearchText': value });
  }
  getSBUByName(value) {
    return this.http.post(BASE_URL + routes.SBUByName, { "SearchText": value })
  }
  getVerticalbySBUID(id, value) {
    return this.http.post(BASE_URL + routes.GetVerticalbySBUID, { "Guid": id, "SearchText": value })
  }
  getSubVerticalByVertical(id, value) {
    return this.http.post(L3_BASE_URL + routes.SubVerticalByVertical, { "Guid": id, "SearchText": value })
  }
  getFinancialYear(value) {
    return this.http.post(L3_BASE_URL + routes.FinancialYear, { "SearchText": value })
  }
  getparentaccount(value) {
    return this.http.post(BASE_URL + routes.ParentAccount, { "SearchText": value })
  }
  getaccountowner(value) {
    return this.http.post(BASE_URL + routes.Accountowner, { "SearchText": value })
  }
  SearchUser(value) {
    return this.http.post<any>(BASE_URL + routes.SearchUser, { "SearchText": value });
  }
  GetSBUbyVertical(id, value) {
    return this.http.post(BASE_URL + routes.GetSBUbyVertical, { "Guid": id, "SearchText": value })
  }
  GetVerticalBySubVertical(id, value) {
    return this.http.post(BASE_URL + routes.GetVerticalBySubVertical, { "Guid": id, "SearchText": value })
  }
  SubVerticalName(value) {
    return this.http.post<any>(BASE_URL + routes.SubVerticalName, { "SearchText": value });
  }
  VerticalByName(value) {
    return this.http.post<any>(BASE_URL + routes.VerticalByName, { "SearchText": value });
  }
  getswapaccount(id) {
    return this.http.post(L3_BASE_URL + routes.SearchSwapAccounts, { "Guid": id })
  }
  AddCBU(data) {
    return this.http.post(L3_BASE_URL + routes.AddCBU, data);
  }

}
