import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '@env/environment';
import { Observable, from as fromPromise, of, Subject } from 'rxjs';
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
import { GetSearchAccountCompany } from '@app/core/interfaces/get-search-accont-company';
import { GetStateCode } from '../interfaces/get-state-code';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { OfflineService } from './offline.services'
import { GetActivityType } from '../interfaces/get-activity-type';
import { GetAccountDetails } from "@app/core/interfaces/get-account-details";
import { ApiService } from './api.service';
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
const camunda_BASE_URL = envADAL.camunda_BASE_URL;
export const routes = {
  customerContact: 'Account/SearchCustomerOrCompanyContact',
  companyContact: 'Account/SearchCompanyOrAccountName',
  contactSearch: 'v1/SearchManagement/SearchUser',
  function: 'v1/MasterManagement/Function',
  purpose: 'v1/MasterManagement/SubPurpose',
  subActivity: 'v1/MasterManagement/SubActivity',
  campaignType: 'v1/MasterManagement/CampaignType',
  channelType: 'v1/MasterManagement/Channel',
  platform: 'v1/MasterManagement/Platform',
  activity: 'v1/MasterManagement/Activity',
  relationship: 'v1/MasterManagement/Relationship',
  salutation: 'v1/MasterManagement/Saluation',
  leadSource: 'Master/GetLeadSource',
  enquirytype: 'v1/MasterManagement/EnquiryType',
  state: 'v1/MasterManagement/ActionStateCode',
  status: 'Master/GetStatusValueBasedOnState',
  priority: 'v1/MasterManagement/GetPriorityCode',
  CountryByName: 'Account/GetCountryByName',
  ReportingManager: 'Employee/UserManagerSearch',
  city: 'Account/GetCityByName',
  searchAccountCompany: 'Lead/GetBothAccountProspectIdByName',
  GetActivities: 'Campaign/GetActivities',
  GetSubActivities: 'Campaign/GetSubActivities',
  GetConversationType: 'v1/MasterManagement/ConversationType',
  getProspectType: 'v1/MasterManagement/ProspectType',
  getProspectRequestType: 'v1/MasterManagement/ProspectRequest',
  getProspectStatusCode: 'v1/MasterManagement/ProspectStatusCode',
  getProspectOwnerShipType: 'v1/MasterManagement/ProspectOwnership',
  getContactType: 'v1/MasterManagement/ContactType',
  meetingFrequency: 'v1/MasterManagement/MeetingFrequency',
  // getCurrency: 'v1/MasterManagement/Cuurency_V1',
  getCurrency: 'v1/MasterManagement/Cuurency',
  // SearchSBUByname: 'Campaign/SearchSBUByname',
  SearchVerticalByname: 'Campaign/SearchVerticalByname',
  ActivityType: 'v1/MasterManagement/Type',
  AccountOverviewDetails: 'v3/CustomerManagement_Sprint3Controller/AccountDetails',
  AddAlliance: 'v3/CustomerManagement_Sprint3Controller/Account/AddAlliance',
  SearchCustomerCompanyContact: 'v1/AccountManagement/SearchCustomerCompanyContact',
  DeLinkAlliance: 'v3/CustomerManagement_Sprint3Controller/Account/DeLinkAlliance',
  AddCompetitor: 'v3/CustomerManagement_Sprint3Controller/Account/AddCompetitor',
  DeLinkCompetitor: 'v3/CustomerManagement_Sprint3Controller/Account/DeLinkCompetitor',
  SearchCompetitor: 'v3/CustomerManagement_Sprint3Controller/Account/SearchCompetitor',
  getEntityType: 'v1/MasterManagement/EntityType',
  GetGeographyByName: 'v1/AccountManagement/GetGeographyByName',
  GetStateByName: '/Account/GetStateByName',
  GetcityByName: 'Account/GetCityByName',
  GetCountryByName: 'Account/GetCountryByName ',
  GetVerticalandSBU: 'v3/CustomerManagement_Sprint3Controller/VerticalandSBU',
  CityByState: 'v3/CustomerManagement_Sprint3Controller/CityByState',
  StateByCountry: 'v3/CustomerManagement_Sprint3Controller/StateByCountry',
  CountryByGeo: 'v3/CustomerManagement_Sprint3Controller/CountryByGeo',
  CountryByRegion: 'v3/CustomerManagement_Sprint3Controller/CountryByRegion',
  SBUByName: 'v1/CampaignManagement/SBUByName',
  GetVerticalbySBUID: 'v1/CampaignManagement/GetVerticalbySBUID',
  SubVerticalByVertical: 'v3/CustomerManagement_Sprint3Controller/SubVerticalByVertical',
  FinancialYear: 'v3/CustomerManagement_Sprint3Controller/FinancialYear',
  ParentAccount: 'v3/CustomerManagement_Sprint3Controller/SearchAccounts',
  Currency: 'v1/MasterManagement/Currency_V2', //currency

  Accountowner: 'Search/SearchUser',
  GetRevenueCategory: 'v1/MasterManagement/RevenueCategory',
  GetGrowthCategory: 'v1/MasterManagement/GrowthCategory',
  GetCoverageLevel: 'v1/MasterManagement/CoverageLevel',
  GetAccountLifeCycleStage: 'v1/MasterManagement/AccountLifeCycleStage',
  GetAccountRelationShipStatus: 'v1/MasterManagement/AccountRelationShipStatus',
  SaveAccountRE: 'v3/CustomerManagement_Sprint3Controller/Account/AccountRE/Edit',
  SearchSwapAccounts: 'v3/CustomerManagement_Sprint3Controller/SearchSwapAccounts',
  SearchAltSwapAccounts : 'v3/CustomerManagement_Sprint3Controller/Alternate/SearchSwapAccounts',
  // Account overview 
  GetAccountType: 'v1/MasterManagement/AccountType',
  GetProposedAccountType: 'v1/MasterManagement/ProposedAccountType',
  GetAccountClassification: 'v1/MasterManagement/AccountClassification',
  GetProposedAccountClassification: 'v1/MasterManagement/ProposedAccountClassification',
  SearchAccount: 'v1/AccountManagement/SearchAccount',
  VerticalandSBU: 'v3/CustomerManagement_Sprint3Controller/VerticalandSBU',
  GetGeoByName: 'v1/AccountManagement/GetGeographyByName',
  RegionByGeo: 'v3/CustomerManagement_Sprint3Controller/RegionByGeo',
  SearchUser: 'v1/SearchManagement/SearchUser',
  SBUSearch: 'v1/CampaignManagement/SBUByName',
  VerticalSearch: 'v1/CampaignManagement/VerticalByName',
  SubVerticalSearch: 'v1/AccountManagement/SubVerticalName',
  GeoSearch: 'v3/CustomerManagement_Sprint3Controller/GeographyByName',
  AccountType: 'v1/MasterManagement/AccountType',
  AccountClassification: 'v1/MasterManagement/AccountClassification',
  AccountName: 'v3/CustomerManagement_Sprint3Controller/SearchAccountName',
  AccountNumber: 'v3/CustomerManagement_Sprint3Controller/SearchAccountNumber',

  GetAccountCategory: 'v1/MasterManagement/AccountCategory',
  SaveAccountOverview: 'v3/CustomerManagement_Sprint3Controller/Account/Overview/Edit',
  SaveRelationShips: 'v3/CustomerManagement_Sprint3Controller/Account/RelationShips/Edit',
  // 
  SaveCustomerDetails: 'v3/CustomerManagement_Sprint3Controller/Account/CustomerDetails/Edit',
  AddCBU: 'v3/CustomerManagement_Sprint3Controller/Account/AddCBU',
  ActivateorDeActivateAccountCBU: 'v3/CustomerManagement_Sprint3Controller/Account/ActivateorDeActivateAccountCBU',
  SearchAllianceAccounts: 'v3/CustomerManagement_Sprint3Controller/Account/SearchAllianceAccounts',
  GetAccountRelationShipType: 'v1/MasterManagement/AccountRelationShipType',
  AccountAttributeComment: 'v3/CustomerManagement_Sprint3Controller/AccountAttributeComment',
  // getProspectOwnerShipType: 'v3/CustomerManagement_Sprint3Controller/Master/GetProspectOwnerShipType',
  UltimateParentAccount: 'v3/CustomerManagement_Sprint3Controller/GetBothAccountProspectIdByName',
  SearchCBU: 'v3/CustomerManagement_Sprint3Controller/SearchCBU',
  /* Get current Hunting ratio for the employee, it is used in create new component */
  HuntingCount: 'v3/CustomerManagement_Sprint3Controller/HuntingCount',
  ExistingCount: 'v3/CustomerManagement_Sprint3Controller/ExistingCount',

  //duns number relate apis 
  SeachDunsNumberByName: 'v3/CustomerManagement_Sprint3Controller/SeachDunsNumberByName',
  ParentDunsIdByParentAccount: 'v3/CustomerManagement_Sprint3Controller/ParentDunsIdByParentAccount',
  UltimateParentDunsIdByUltimateParentAccount: 'v3/CustomerManagement_Sprint3Controller/UltimateParentDunsIdByUltimateParentAccount',
  AccountOwnerSearch: 'v3/CustomerManagement_Sprint3Controller/AccountOwnerSearch',
  AlternateOwnerSearch: 'v3/CustomerManagement_Sprint3Controller/Alternate/AccountOwnerSearch',
  StandByAccountOwnerSearch: 'v3/CustomerManagement_Sprint3Controller/StandByAccountOwnerSearch',
  SearchVerticalAndSBU: 'v3/CustomerManagement_Sprint3Controller/SearchVerticalAndSBU',
  SearchAllBySubVertical: 'v3/CustomerManagement_Sprint3Controller/SearchAllBySubVertical',
  privateequaitity : 'v3/HelpDeskController/Account/SearchPrivateEquity',


  ActiverequestsReview: 'v3/CustomerManagement_Sprint3Controller/ActiveRequestDetails',
  AssignmentReferenceReview: 'v3/CustomerManagement_Sprint3Controller/AssignmentReference/Review',
  ModificationActiveRequestDetails: 'v3/CustomerManagement_Sprint3Controller/ModificationActiveRequestDetails',

  GetSBUbyVertical: 'v1/CampaignManagement/GetSBUbyVertical',
  GetVerticalBySubVertical: 'v1/CampaignManagement/GetVerticalBySubVertical',
  SubVerticalName: 'v1/AccountManagement/SubVerticalName',
  VerticalByName: 'v1/CampaignManagement/VerticalByName',


  GeographyByName: "v3/CustomerManagement_Sprint3Controller/GeographyByName",
  //add relationship plan
  GetLevel: 'v1/MasterManagement/Level',
  GetRelationshipTheme: 'v1/MasterManagement/RelationshipTheme',
  GetEmployeeNCustomerBoth: 'v1/SearchManagement/GetEmployeeNCustomerBoth',
  GetMeetingFrequencyForRelationshipPlan: 'v1/MasterManagement/MeetingFrequencyForRelationshipPlan',

  //region api 
  RegionName: "v3/CustomerManagement_Sprint3Controller/RegionName",
  CountryName: "v3/CustomerManagement_Sprint3Controller/CountryName",
  StateName: "v3/CustomerManagement_Sprint3Controller/StateName",
  CityName: "v3/CustomerManagement_Sprint3Controller/CityName",

  StateByCity: "v3/CustomerManagement_Sprint3Controller/StateByCity",
  CountryByState: "v3/CustomerManagement_Sprint3Controller/CountryByState",
  RegionByCountry: "v3/CustomerManagement_Sprint3Controller/RegionByCountry",
  GeoByRegion: "v3/CustomerManagement_Sprint3Controller/GeoByRegion",
  Searchuser: "v1/SearchManagement/SearchUser",
  AccountTeamsFunction: "v1/MasterManagement/AccountTeamsFunction",
  //account transition
  TransitionChecklist: "v1/MasterManagement/TransitionOperationCheckList",
  KTChecklist: "v1/MasterManagement/KTCheckList",
  TransitionResponsibility: "v1/MasterManagement/Responsibility",
  username: 'v1/SearchManagement/SearchUser',

  GetAllByCity: 'v3/CustomerManagement_Sprint3Controller/GetAllByCity',
  GetAllByState: 'v3/CustomerManagement_Sprint3Controller/GetAllByState',
  GetAllByCountry: 'v3/CustomerManagement_Sprint3Controller/GetAllByCountry',
  GetAllByRegion: 'v3/CustomerManagement_Sprint3Controller/GetAllByRegion',

  UltimateParentByParent : 'v3/CustomerManagement_Sprint3Controller/Account/UltimateParentByParent',
  MarketRisk : 'v3/CustomerManagement_Sprint3Controller/Prospect/MarketRisk',
  AccountClassificationByType : 'v3/CustomerManagement_Sprint3Controller/AccountClassificationByType',
  CategoryByTypeNClassification : 'v3/CustomerManagement_Sprint3Controller/CategoryByTypeNClassification',
  //https://quapi-dev.wipro.com/L2O.Sprint3.Api/api/v3/CustomerManagement_Sprint3Controller/Account/UltimateParentByParent
 // https://quapi-dev.wipro.com/L2O.Sprint3.Api/api/v3/CustomerManagement_Sprint3Controller/Prospect/MarketRisk
  //DNB related apis 
  DNBToken: 'v3/DNBAuthController/DNBToken',
  //DNBToken       :  'v3/DNBController/DNBToken_Token',
  GetCountryCode: 'v1/MasterManagement/GetCountryCode',
  SearchAccountInDNB: 'v3/DNBController/SearchAccountInDNB',
  DNBDetailsByDunsId: 'v3/DNBController/DNBDetailsByDunsId',
  SearchCustomerContact: 'v3/CustomerManagement_Sprint3Controller/Account/CustomerContact',
  Cluster: 'v3/CustomerManagement_Sprint3Controller/Prospect/Cluster',
  NewAccountType:'v3/CustomerManagement_Sprint3Controller/AccountFinder/AccountType'
  //https://quapi-dev.wipro.com/L2O.Sprint1_2.Api/api/ADFS/DNBToken
  // https://quapi-dev.wipro.com/L2O.Sprint3.Api/api/v3/DNBController/DNBToken_V1
  // https://quapi-dev.wipro.com/L2O.Sprint1_2.Api/api/v1/MasterManagement/GetCountryCode
  //https://quapi-dev.wipro.com/L2O.Sprint3.Api/api/v3/DNBController/DNBDetailsByDunsId
  //https://quapi-dev.wipro.com/L2O.Sprint3.Api/api/v3/DNBController/SearchAccountInDNB

}
@Injectable({
  providedIn: 'root'
})
export class S3MasterApiService {

  MaterApiCache: any;

  constructor(private http: HttpClient,
    private offlineService: OfflineService,
    private apiService: ApiService
  ) { }

  getActivityType(): Observable<any> {
    return this.http.get<any>(BASE_URL + routes.ActivityType);
  }
  private standByOwner = new Subject<any>();

  sendMessage(standbyowner) {
    this.standByOwner.next({ 'Standbyowner': standbyowner });
  }

  getMessage(): Observable<any> {
    return this.standByOwner.asObservable();
  }
  getCustomerContactSearch(): Observable<SearchCustomerOrCompanyContact> {
    return this.http.post<SearchCustomerOrCompanyContact>(BASE_URL + routes.customerContact, {});
  }

  getcompanyContactSearch(): Observable<SearchCompanyOrAccountName> {
    return this.http.post<SearchCompanyOrAccountName>(BASE_URL + routes.companyContact, {});
  }

  getWiproContact(): Observable<WiproContacts> {
    return this.http.post<WiproContacts>(BASE_URL + routes.contactSearch, {});
  }

  getFunction(): Observable<GetFunction> {

    return fromPromise(this.getMasterCache(routes.function)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.http.post<GetFunction>(BASE_URL + routes.function, {});
        }
      }), catchError(err => {
        return []
      })

    )

  }

  getPurpose(): Observable<GetSubPurpose> {
    // return this.http.post<GetSubPurpose>(BASE_URL + routes.purpose, {});
    return fromPromise(this.getMasterCache(routes.purpose)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.http.post<GetSubPurpose>(BASE_URL + routes.purpose, {})
        }
      }), catchError(err => {
        return []
      })

    )
  }

  getSubActivity(): Observable<GetSubActivity> {
    // return this.http.post<GetSubActivity>(BASE_URL + routes.subActivity, {});
    return fromPromise(this.getMasterCache(routes.GetSubActivities)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.http.post<GetSubActivity>(BASE_URL + routes.GetSubActivities, {})
        }
      }), catchError(err => {
        return []
      })

    )
  }

  getCampaignType(): Observable<GetCampaignType> {

    return fromPromise(this.getMasterCache(routes.campaignType)).pipe(
      switchMap(cacheresult => {
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.http.post<GetCampaignType>(BASE_URL + routes.campaignType, {});
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
          return of(cacheresult)
        } else {
          return this.http.post<GetChannel>(BASE_URL + routes.channelType, {})
        }
      }), catchError(err => {
        return []
      })

    )

    // return this.http.post<GetChannel>(BASE_URL + routes.channelType, {})
  }



  getPlatofrm(): Observable<GetPlatform> {

    return fromPromise(this.getMasterCache(routes.platform)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.http.post<GetPlatform>(BASE_URL + routes.platform, {});
        }
      }), catchError(err => {
        return []
      })

    )

  }

  getActivity(): Observable<GetActivity> {
    if (this.getMasterCache(routes.activity)) {

    } else {
      return this.http.post<GetActivity>(BASE_URL + routes.activity, {})
    }

  }

  getRelationship(): Observable<GetRelationship> {
    // return this.http.post<GetRelationship>(BASE_URL + routes.relationship, {});
    return fromPromise(this.getMasterCache(routes.relationship)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.http.post<GetRelationship>(BASE_URL + routes.relationship, {})
        }
      }), catchError(err => {
        return []
      })

    )
  }

  getSalutation(): Observable<GetSalutation> {
    // return this.http.post<GetSalutation>(BASE_URL + routes.salutation, {});
    return fromPromise(this.getMasterCache(routes.salutation)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.http.post<GetSalutation>(BASE_URL + routes.salutation, {})
        }
      }), catchError(err => {
        return []
      })

    )
  }

  getLeadSource(): Observable<GetLeadSource> {
    return this.http.post<GetLeadSource>(BASE_URL + routes.leadSource, {});
  }

  getEnquiryType(): Observable<GetEnquiryType> {

    return fromPromise(this.getMasterCache(routes.enquirytype)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.http.post<GetEnquiryType>(BASE_URL + routes.enquirytype, {});
        }
      }), catchError(err => {
        return []
      })

    )
  }

  getStateCode(): Observable<GetStateCode> {
    return fromPromise(this.getMasterCache(routes.state)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.http.post<GetStateCode>(BASE_URL + routes.state, {});
        }
      }), catchError(err => {
        return []
      })
    )
  }

  getStatusCode(object: {}): Observable<GetStatusCode> {
    let body = {
      Id: object
    }
    return this.http.post<GetStatusCode>(BASE_URL + routes.status, body);
  }

  getPriority(): Observable<GetPriorityCode> {

    return fromPromise(this.getMasterCache(routes.priority)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.http.post<GetPriorityCode>(BASE_URL + routes.priority, {})
        }
      }), catchError(err => {
        return []
      })

    )

    // return this.http.post<GetPriorityCode>(BASE_URL + routes.priority, {})

  }

  getCountry(): Observable<GetCountryByName> {
    return this.apiService.post(routes.CountryByName, {});
  }
  getReportingManager(): Observable<GetReportingManager> {
    return this.http.post<GetReportingManager>(BASE_URL + routes.ReportingManager, {});
  }
  getCity(): Observable<GetCityByName> {
    return this.apiService.post(routes.city, {});
  }

  getsearchAccountCompany(): Observable<GetSearchAccountCompany> {

    return this.http.post<GetSearchAccountCompany>(BASE_URL + routes.searchAccountCompany, {});
  }

  getActivities(): Observable<any> {
    // return this.http.post(BASE_URL + routes.GetActivities, {});
    return fromPromise(this.getMasterCache(routes.GetActivities)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.apiService.post(routes.GetActivities, {})
        }
      }), catchError(err => {
        return []
      })

    )
  }

  getSubActivities(): Observable<any> {
    // return this.http.post(BASE_URL + routes.GetSubActivities, {});
    return fromPromise(this.getMasterCache(routes.GetSubActivities)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.apiService.post(routes.GetSubActivities, {})
        }
      }), catchError(err => {
        return []
      })

    )
  }

  getConversationType(): Observable<any> {

    return fromPromise(this.getMasterCache(routes.GetConversationType)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.apiService.post(routes.GetConversationType, {});
        }
      }), catchError(err => {
        return []
      })

    )

  }

  //prospect account master 
  getProspectType(): Observable<any> {
    // return this.http.post(BASE_URL + routes.getProspectType, {});
    return fromPromise(this.getMasterCache(routes.getProspectType)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.apiService.post(routes.getProspectType, {})
        }
      }), catchError(err => {
        return []
      })

    )
  }

  getProspectRequestType(): Observable<any> {
    // return this.http.post(BASE_URL + routes.getProspectRequestType, {});
    return fromPromise(this.getMasterCache(routes.getProspectRequestType)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.apiService.post(routes.getProspectRequestType, {})
        }
      }), catchError(err => {
        return []
      })

    )
  }

  getProspectStatusCode(): Observable<any> {
    // return this.http.post(BASE_URL + routes.getProspectStatusCode, {});
    return fromPromise(this.getMasterCache(routes.getProspectStatusCode)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.apiService.post(routes.getProspectStatusCode, {})
        }
      }), catchError(err => {
        return []
      })

    )
  }

  getProspectOwnerShipType(): Observable<any> {
    // return this.http.post(BASE_URL + routes.getProspectOwnerShipType, {});
    return fromPromise(this.getMasterCache(routes.getProspectOwnerShipType)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of(cacheresult)
        } else {
          //return this.http.post(BASE_URL + routes.getProspectOwnerShipType, {})
          return this.apiService.post(routes.getProspectOwnerShipType, {})
        }
      }), catchError(err => {
        return []
      })

    )
  }

  getContactType(): Observable<any> {

    return fromPromise(this.getMasterCache(routes.getContactType)).pipe(
      switchMap(cacheresult => {
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.apiService.post(routes.getContactType, {});
        }
      }), catchError(err => {
        return []
      })

    )

  }
  getMeetingFrequency(): Observable<any> {
    return fromPromise(this.getMasterCache(routes.meetingFrequency)).pipe(
      switchMap(cacheresult => {
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.apiService.post(routes.meetingFrequency, {});
        }
      }), catchError(err => {
        return []
      })
    )
  }

  ////////////////==============================================================api intervdgd==========
  getCurrency(): Observable<any> {
    return fromPromise(this.getMasterCache(routes.getCurrency)).pipe(
      switchMap(cacheresult => {
        if (cacheresult) {
          return of(cacheresult)
        } else {
          // return this.http.post(BASE_URL + routes.getCurrency, {});
          return this.apiService.post(routes.getCurrency, {})
        }
      }), catchError(err => {
        return []
      })
    )
  }

  getEntityType(): Observable<any> {
    return fromPromise(this.getMasterCache(routes.getEntityType)).pipe(
      switchMap(cacheresult => {
        if (cacheresult) {
          return of(cacheresult)
        } else {
          // return this.http.post(BASE_URL + routes.getEntityType, {});
          return this.apiService.post(routes.getEntityType, {})
        }
      }), catchError(err => {
        return []
      })
    )
  }
  getGeo(value): Observable<any> {
    return this.apiService.post(routes.GetGeoByName, { "SearchText": value });
  }
  getStateByName(value): Observable<any> {
    return fromPromise(this.getMasterCache(routes.GetStateByName)).pipe(
      switchMap(cacheresult => {
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.apiService.post(routes.GetStateByName, { "SearchText": value });
        }
      }), catchError(err => {
        return []
      })

    )

  }

  getcountrybyname(value): Observable<any> {

    return fromPromise(this.getMasterCache(routes.GetCountryByName)).pipe(
      switchMap(cacheresult => {
        if (cacheresult) {
          return of(cacheresult)
        } else {
          return this.apiService.post(routes.GetCountryByName, { "SearchText": value });
        }
      }), catchError(err => {
        return []
      })

    )

  }
  getcitybyname(value): Observable<any> {

    return this.apiService.post(routes.GetcityByName, { "SearchText": value });

  }
  getsbuandvertical(value): Observable<any> {

    return fromPromise(this.getMasterCache(routes.GetVerticalandSBU)).pipe(
      switchMap(cacheresult => {
        if (cacheresult) {
          return of(cacheresult)
        } else {
          //  return this.http.post(L3_BASE_URL + routes.GetVerticalandSBU, { "SearchText": value });
          return this.apiService.post(routes.GetVerticalandSBU, { "SearchText": value })
        }
      }), catchError(err => {
        return []
      })

    )
  }
  ////--------------------region by geo===========================================
  // getregionbygeo
  getregionbygeo(id, value): Observable<any> {
    //return this.http.post(L3_BASE_URL + routes.RegionByGeo, { "Guid": id, "SearchText": value });
    return this.apiService.post(routes.RegionByGeo, { "Guid": id, "SearchText": value })
  }
  SearchVerticalAndSBU(value): Observable<any> {
    //return this.http.post(L3_BASE_URL + routes.RegionByGeo, { "Guid": id, "SearchText": value });
    return this.apiService.post(routes.SearchVerticalAndSBU, { "SearchText": value })
  }
  SearchAllBySubVertical(value): Observable<any> {
    let obj = {
      "SearchText": value,
      "PageSize": 10,
      "OdatanextLink": "",
      "RequestedPageNumber": 1
    }
    //return this.http.post(L3_BASE_URL + routes.RegionByGeo, { "Guid": id, "SearchText": value });
    return this.apiService.post(routes.SearchAllBySubVertical, obj)
  }


  getCityByState(id, value): Observable<any> {
    // return this.http.post(L3_BASE_URL + routes.CityByState, { "Guid": id, "SearchText": value })
    return this.apiService.post(routes.CityByState, { "Guid": id, "SearchText": value })
  }
  CityByState(id, value): Observable<any> {
    return this.apiService.post(routes.CityByState, { 'Guid': id, 'SearchText': value });
  }
  // CountryByRegion  getcountrybygeo

  CountryByRegion(id, value) {
    //return this.http.post(L3_BASE_URL + routes.CountryByRegion, { "Guid": id, "SearchText": value })
    return this.apiService.post(routes.CountryByRegion, { "Guid": id, "SearchText": value })
  }
  getStateByCountry(id, value) {
    //return this.http.post(L3_BASE_URL + routes.StateByCountry, { "Guid": id, "SearchText": value })
    return this.apiService.post(routes.StateByCountry, { "Guid": id, "SearchText": value })
  }
  UltimateParentAccount(value): Observable<any> {
    return this.apiService.post(routes.UltimateParentAccount, { 'SearchText': value });
  }
  getSBUByName(value) {
    // return this.http.post(BASE_URL + routes.SBUByName, { "SearchText": value })
    return this.apiService.post(routes.SBUByName, { "SearchText": value })
  }
GetMarketRisk()
{
  return this.apiService.post(routes.MarketRisk,{})
}
GetAccountClassificationByType(id,value)
{
  return this.apiService.post(routes.AccountClassificationByType,{"Id":id,"SearchText":value})
}
getCategoryByTypeandClassification(id,value,classificationid)
{
  return this.apiService.post(routes.CategoryByTypeNClassification,{"Id":id,"SearchText":value,"Classification":classificationid})
}
  getVerticalbySBUID(id, value) {
    // return this.http.post(BASE_URL + routes.GetVerticalbySBUID, { "Guid": id, "SearchText": value })
    return this.apiService.post(routes.GetVerticalbySBUID, { "Guid": id, "SearchText": value })
  }
  getSubVerticalByVertical(id, value) {
    // return this.http.post(L3_BASE_URL + routes.SubVerticalByVertical, { "Guid": id, "SearchText": value })
    return this.apiService.post(routes.SubVerticalByVertical, { "Guid": id, "SearchText": value })
  }
  getcluster(id,value)
  {
    return this.apiService.post(routes.Cluster,{"Id" : id,"SearchText":value,})
  }
  getFinancialYear(value) {
    // return this.http.post(L3_BASE_URL + routes.FinancialYear, { "SearchText": value })
    return this.apiService.post(routes.FinancialYear, { "SearchText": value })
  }
  getparentaccount(value) {
    //return this.http.post(BASE_URL + routes.ParentAccount, { "SearchText": value })
    return this.apiService.post(routes.ParentAccount, { "SearchText": value })
  }
  getcurrencyaccount(value) {
    //return this.http.post(BASE_URL + routes.ParentAccount, { "SearchText": value })
    return this.apiService.post(routes.Currency, { "SearchText": value })
  }
  getaccountowner(value) {
    return this.apiService.post(routes.Accountowner, { "SearchText": value })
  }
  SearchUser(value) {
    // return this.http.post<any>(BASE_URL + routes.SearchUser, { "SearchText": value });
    return this.apiService.post(routes.SearchUser, { "SearchText": value });
  }
  GetSBUbyVertical(id, value) {
    return this.apiService.post(routes.GetSBUbyVertical, { "Guid": id, "SearchText": value })
  }
  GetVerticalBySubVertical(id, value) {
    return this.apiService.post(routes.GetVerticalBySubVertical, { "Guid": id, "SearchText": value })
  }
  SubVerticalName(value) {
    return this.apiService.post(routes.SubVerticalName, { "SearchText": value });
  }
  VerticalByName(value) {
    return this.apiService.post(routes.VerticalByName, { "SearchText": value });
  }
  getswapaccount(id, CountryGuid) {
    //return this.http.post(L3_BASE_URL + routes.SearchSwapAccounts, { "Guid": id })
    return this.apiService.post(routes.SearchSwapAccounts, { "Guid": id, "CountryGuid": CountryGuid })
  }

  getaltswapaccount(id, CountryGuid , sbuGuid) {
    //return this.http.post(L3_BASE_URL + routes.SearchSwapAccounts, { "Guid": id })
    return this.apiService.post(routes.SearchAltSwapAccounts, { "Guid": id, "CountryGuid": CountryGuid , "Id": sbuGuid })
  }

  getdunsnumber(value) {
    return this.apiService.post(routes.SeachDunsNumberByName, { "SearchText": value })
  }

  getparentsdnusid(id) {
    return this.apiService.post(routes.ParentDunsIdByParentAccount, { "Guid": id })
  }
  getultimateparentsdnusid(id) {
    return this.apiService.post(routes.UltimateParentDunsIdByUltimateParentAccount, { "Guid": id })
  }
  getUltimateParentByParent(id)
  {
    return this.apiService.post(routes.UltimateParentByParent,{"Guid" :id})
  }


  ///================================ADD relation ship API calls ===============================

  getLevel() {
    // return this.http.post(BASE_URL + routes.GetLevel, {})
    return this.apiService.post(routes.GetLevel, {})
  }
  getRelationshipTheme() {
    // return this.http.post(BASE_URL + routes.GetRelationshipTheme, {})
    return this.apiService.post(routes.GetRelationshipTheme, {})
  }
  getcontactname(value) {
    return this.http.post(BASE_URL + routes.GetEmployeeNCustomerBoth, { "SearchText": value })
  }

  // =================region by name ,country,state,city ===============================

  getregionByName(value) {
    // return this.http.post(L3_BASE_URL + routes.RegionName, { "SearchText": value })
    return this.apiService.post(routes.RegionName, { "SearchText": value })
  }
  getcountryByName(value) {
    // return this.http.post(L3_BASE_URL+routes.CountryName,{"SearchText": value}
    return this.apiService.post(routes.CountryName, { "SearchText": value })
  }
  getstateByName(value) {
    // return this.http.post(L3_BASE_URL+routes.StateName,{"SearchText": value})
    return this.apiService.post(routes.StateName, { "SearchText": value })
  }
  getcityByName(value) {
    // return this.http.post(L3_BASE_URL+routes.CityName,{"SearchText": value})

    return this.apiService.post(routes.CityName, { "SearchText": value })
  }

  //============  //reverse hierarchy for geo, region, country, state, city ======================


  getstateByCity(id) {
    // return this.http.post(L3_BASE_URL+routes.StateByCity,{"Guid" : id})
    return this.apiService.post(routes.StateByCity, { "Guid": id })
  }
  getcountryByState(id) {
    // return this.http.post(L3_BASE_URL+routes.CountryByState,{"Guid" : id})
    return this.apiService.post(routes.CountryByState, { "Guid": id })
  }
  getregionbycountry(id) {
    //return this.http.post(L3_BASE_URL+routes.RegionByCountry,{"Guid" : id})
    return this.apiService.post(routes.RegionByCountry, { "Guid": id })
  }

  getgeobyregion(id) {
    //return this.http.post(L3_BASE_URL+routes.GeoByRegion,{"Guid" : id})
    return this.apiService.post(routes.GeoByRegion, { "Guid": id })
  }
  getgeobyname(value) {
    // return this.http.post(L3_BASE_URL+routes.GeographyByName,{"SearchText": value})
    return this.apiService.post(routes.GeographyByName, { "SearchText": value })
  }


  //search user ========

  Searchuser(value) {
    return this.apiService.post(routes.Searchuser, { "SearchText": value });
  }
  //===========AccountTeamsFunction=============

  getaccountfunction() {
    return this.apiService.post(routes.AccountTeamsFunction, {})
  }
  getusername(value) {
    return this.apiService.post(routes.username, { "SearchText": value })

  }
  // =========================D & B related apis ===========================
  getdnbtoken(val): Observable<any> {
    // debugger;
    console.log("ddsfsfffffffffffffffffffffffffff");
    console.log("dnbtoken url", L3_BASE_URL + routes.DNBToken, { code: val });
    return this.http.post(L3_BASE_URL + routes.DNBToken, { code: val })
    // return this.apiService.post(L3_BASE_URL+routes.DNBToken, {code: val})
  }


  getcountrycode(value) {
    return this.apiService.post(routes.GetCountryCode, { "SearchText": value })
  }
  SearchAccountInDNB(reqBody) {

    return this.apiService.post(routes.SearchAccountInDNB, reqBody)
  }
  DNBDetailsByDunsId(id) {
    return this.apiService.post(routes.DNBDetailsByDunsId, { "Id": id })
  }
  addMasterCache(key: string, data?: any) {
    this.offlineService.addMasterApiCache(key, data)
  }
  getMeetingFrequencyForRelationshipPlan() {
    // return this.http.post(BASE_URL + routes.GetMeetingFrequencyForRelationshipPlan, {})
    return this.apiService.post(routes.GetMeetingFrequencyForRelationshipPlan, {})
  }

  //Ak : -Assignment reference details start from here
  // searchSBU(value) {
  //   return this.http.post<any>(L3_BASE_URL + routes.VerticalandSBU, { "SearchText": value });
  // }
  // VerticalandSBU(id, value) {
  //   return this.http.post<any>(L3_BASE_URL + routes.VerticalandSBU, { 'Guid': id, 'SearchText': value });
  // }
  // SubVerticalByVertical(id, value): Observable<any> {
  //   return this.http.post<any>(L3_BASE_URL + routes.SubVerticalByVertical, { 'Guid': id, 'SearchText': value });//not
  // }
  SearchCBU(value): Observable<any> {
    return this.apiService.post(routes.SearchCBU, value);
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
  /* kunal start */
  // getAccountOverviewDetails(id): Observable<GetAccountDetails> {
  //   return this.apiService.post(routes.AccountOverviewDetails, { "SysGuid": id });   
  //  // return this.http.post<GetAccountDetails>(L3_BASE_URL + routes.AccountOverviewDetails, { "SysGuid": id });
  // }
  AddAlliance(data) {
    return this.apiService.post(routes.AddAlliance, data);
  }
  DeLinkAlliance(guid) {
    return this.apiService.post(routes.DeLinkAlliance, { "MapGuid": guid });
  }
  AddCompetitor(data) {
    return this.apiService.post(routes.AddCompetitor, data);
  }
  AccountAttributeComment(data) {
    return this.apiService.post(routes.AccountAttributeComment, data);
  }
  DeLinkCompetitor(guid) {
    return this.apiService.post(routes.DeLinkCompetitor, { "MapGuid": guid });
  }
  SearchCompetitor(keyword): Observable<any> {
    return this.apiService.post(routes.SearchCompetitor, { "SearchText": keyword });
  }
  getSearchCustomerCompanyContact(keyword, Guid?, type?): Observable<any> {
    // debugger;
    // return this.http.post<any>(BASE_URL + routes.SearchCustomerCompanyContact, { "SearchText": keyword });
    if (type === 'CustomerContact') {
      return this.apiService.post(routes.SearchCustomerContact, {
        "SearchText": keyword, "Guid": Guid ? Guid : '',
        "PageSize": 10,
        "OdatanextLink": "",
        "RequestedPageNumber": 1
      });

    } else {
      return this.apiService.post(routes.SearchCustomerCompanyContact, { "SearchText": keyword });
    }
  }
  getSearchCustomerCompanyContactRE(body): Observable<any> {
    console.log('in master s3', body);
    // return this.http.post<any>(BASE_URL + routes.SearchCustomerCompanyContact, { "SearchText": keyword });
    // return this.apiService.post(routes.SearchCustomerCompanyContact, body); // it will return all data
    return this.apiService.post(routes.SearchCustomerContact, body);
  }
  SearchAccount(keyword): Observable<any> {
    return this.apiService.post(routes.SearchAccount, { "SearchText": keyword });
  }
  SeachVerticalandSBU(keyword): Observable<any> {
    return this.apiService.post(routes.VerticalandSBU, { "SearchText": keyword });
  }
  // GetSubVerticalbyVertical(Guid, keyword): Observable<any> {
  //   return this.http.post<any>(L3_BASE_URL + routes.VerticalandSBU, { "Guid": Guid, "SearchText": keyword });
  // }
  GetGeographyByName(keyword): Observable<any> {
    return this.apiService.post(routes.GetGeographyByName, { "SearchText": keyword });
  }
  RegionByGeo(Guid, keyword): Observable<any> {
    return this.apiService.post(routes.RegionByGeo, { "Guid": Guid, "SearchText": keyword });
  }
  SearchAccountOwner(keyword): Observable<any> {
    return this.apiService.post(routes.SearchUser, { "SearchText": keyword });
  }
  SearchAllianceAccounts(keyword): Observable<any> {
    return this.apiService.post(routes.SearchAllianceAccounts, { "SearchText": keyword });
  }
  AddCBU(data) {
    return this.apiService.post(routes.AddCBU, data);
  }

  // ActiverequestsReview(id) {
  //     return this.http.post(L3_BASE_URL + routes.ActiverequestsReview, { "SysGuid": id });
  //   }
  //   ModificationActiveRequestDetails(id) {
  //     return this.http.post(L3_BASE_URL + routes.ModificationActiveRequestDetails, { "SysGuid": id });
  //   }
  //   AssignmentReferenceReview(id) {
  //     return this.http.post(L3_BASE_URL + routes.AssignmentReferenceReview, { "SysGuid": id });
  //   }

  GetRevenueCategory(): Observable<any> {
    // return this.http.post(BASE_URL + routes.getProspectOwnerShipType, {});
    return fromPromise(this.getMasterCache(routes.GetRevenueCategory)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of(cacheresult)
        } else {
          // return this.http.post(BASE_URL + routes.GetRevenueCategory, {})
          return this.apiService.post(routes.GetRevenueCategory, {})
        }
      }), catchError(err => {
        return []
      })

    )
  }

  GetGrowthCategory(): Observable<any> {
    // return this.http.post(BASE_URL + routes.getProspectOwnerShipType, {});
    return fromPromise(this.getMasterCache(routes.GetGrowthCategory)).pipe(
      switchMap(cacheresult => {
        console.log(cacheresult)
        if (cacheresult) {
          return of(cacheresult)
        } else {
          //  return this.http.post(BASE_URL + routes.GetGrowthCategory, {})
          return this.apiService.post(routes.GetGrowthCategory, {})
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
          //return this.http.post(BASE_URL + routes.GetCoverageLevel, {})
          return this.apiService.post(routes.GetCoverageLevel, {})
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
          return this.apiService.post(routes.GetAccountLifeCycleStage, {})
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
          return this.apiService.post(routes.GetAccountRelationShipStatus, {})
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
          return this.apiService.post(routes.GetAccountType, { "SearchText": "" })
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
          return this.apiService.post(routes.GetProposedAccountType, {})
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
          return this.apiService.post(routes.GetAccountClassification, { "SearchText": "" })
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
          return this.apiService.post(routes.GetProposedAccountClassification, {})
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
          return this.apiService.post(routes.GetAccountCategory, {})
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
          return this.apiService.post(routes.GetAccountRelationShipType, {})
        }
      }), catchError(err => {
        return []
      })
    )
  }
  SaveAccountRE(data) {
    return this.apiService.post(routes.SaveAccountRE, data);
  }
  SaveAccountOverview(data) {
    return this.apiService.post(routes.SaveAccountOverview, data);
  }
  SaveCustomerDetails(data) {
    return this.apiService.post(routes.SaveCustomerDetails, data);
  }
  SaveRelationShips(data) {
    return this.apiService.post(routes.SaveRelationShips, data);
  }
  ActivateorDeActivateAccountCBU(id, IsActivate) {
    console.log(id, IsActivate);

    return this.apiService.post(routes.ActivateorDeActivateAccountCBU, { 'MapGuid': id, IsActivate: IsActivate });
  }
  HuntingCount(id, CountryGuid) {
    //return this.http.post(L3_BASE_URL + routes.HuntingCount, { 'Guid': id });
    return this.apiService.post(routes.HuntingCount, { "Guid": id, "CountryGuid": CountryGuid });
  }
  ExistingCount(id){
    return this.apiService.post(routes.ExistingCount, { "Guid": id});
  }
  AccountOwnerSearch(keyword): Observable<any> {
    //  return this.http.post<any>(L3_BASE_URL + routes.AccountOwnerSearch, { "SearchText": keyword });
    return this.apiService.post(routes.AccountOwnerSearch, { "SearchText": keyword })
  }


privateequaitity(data)
{
  return  this.apiService.post(routes.privateequaitity,data)
}

  AlternateOwnerSearch(reqbody) : Observable<any> {
    //  return this.http.post<any>(L3_BASE_URL + routes.AccountOwnerSearch, { "SearchText": keyword });
    return this.apiService.post(routes.AlternateOwnerSearch, reqbody)
  }

  StandByAccountOwnerSearch(keyword, id): Observable<any> {
    return this.apiService.post(routes.StandByAccountOwnerSearch, { "SearchText": keyword, "Guid": id })
  }

  AccountOwnerSearchRE(body): Observable<any> {
    //  return this.http.post<any>(L3_BASE_URL + routes.AccountOwnerSearch, { "SearchText": keyword });
    return this.apiService.post(routes.AccountOwnerSearch, body)
  }
  GetAllByCity(value) {
    // return this.http.post(L3_BASE_URL+routes.GeographyByName,{"SearchText": value})
    return this.apiService.post(routes.GetAllByCity, { "SearchText": value })
  }
  GetAllByState(value) {
    // return this.http.post(L3_BASE_URL+routes.GeographyByName,{"SearchText": value})
    return this.apiService.post(routes.GetAllByState, { "SearchText": value })
  }
  GetAllByCountry(value) {
    // return this.http.post(L3_BASE_URL+routes.GeographyByName,{"SearchText": value})
    return this.apiService.post(routes.GetAllByCountry, { "SearchText": value })
  }
  GetAllByRegion(value) {
    // return this.http.post(L3_BASE_URL+routes.GeographyByName,{"SearchText": value})
    return this.apiService.post(routes.GetAllByRegion, { "SearchText": value })
  }
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
    return this.apiService.post(routes.TransitionChecklist, reqBody);
  }

  getKTCheckListMaster(reqBody): Observable<any> {
    return this.apiService.post(routes.KTChecklist, reqBody);
  }

  getResponsibilityMaster(): Observable<any> {
    let reqBody = {};
    return this.apiService.post(routes.TransitionResponsibility, reqBody);
  }

  //////account finder
  accountOwnerSearch(reqBody): Observable<any> {
    return this.apiService.post(routes.SearchUser, reqBody);
  }

  sbuSearch(reqBody): Observable<any> {
    return this.apiService.post(routes.SBUSearch, reqBody);
  }

  verticalSearch(reqBody): Observable<any> {
    return this.apiService.post(routes.VerticalSearch, reqBody);
  }

  subVerticalSearch(reqBody): Observable<any> {
    return this.apiService.post(routes.SubVerticalSearch, reqBody);
  }

  geoSearch(reqBody): Observable<any> {
    return this.apiService.post(routes.GeoSearch, reqBody);
  }

  accountType(reqBody): Observable<any> {
    // routes.AccountType
    return this.apiService.post(routes.NewAccountType, reqBody);
  }

  accountClassification(reqBody): Observable<any> {
    return this.apiService.post(routes.AccountClassification, reqBody);
  }

  accountNameSearch(reqBody): Observable<any> {
    return this.apiService.post(routes.AccountName, reqBody);
  }

  accountNumberSearch(reqBody): Observable<any> {
    return this.apiService.post(routes.AccountNumber, reqBody);
  }

}
