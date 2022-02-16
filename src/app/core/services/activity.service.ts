import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { DatePipe } from '@angular/common';
import { OfflineService } from './offline.services';
import { Observable, of } from 'rxjs';
import { ActivityDetailsOfflineService } from './offline/activity/activityDetails.offlineService';
import { newConversationService } from './new-conversation.service';
import { switchMap } from 'rxjs/operators';
import { S3MasterApiService } from './master-api-s3.service';
import { ErrorMessage } from './error.services';


const routes = {
  GetAllActivity: 'v1/ActivityGroupManagement/List',
  GetMyActivity: 'v1/ActivityGroupManagement/MyList',
  ActivitySearch: 'v1/ActivityGroupManagement/SearchList',
  MyActivitySearch: 'v1/ActivityGroupManagement/MySearchList',
  MyActivity: 'v1/MeetingManagement/MyMeetingList',
  MyMeetingActivitySearch: 'v1/MeetingManagement/SearchMyMeeting',
  GetActivityDetails: 'v1/ActivityGroupManagement/Details',
  GetCountryCode: 'v1/MasterManagement/GetCountryCode',
  SearchAccountInDNB: 'v3/DNBController/SearchAccountInDNB',
  DNBDetailsByDunsId:'v3/DNBController/DNBDetailsByDunsId'
};

export const Navigationroutes = {
  1: '/activities/myactivities',
  2: '/activities/list',
  3: '/activities/Archivedlist',
  4: '/activities/activitiesthread/meetingList',
  5: '/contacts/contactconversation',
  7:'/home/dashboard',
  8:'/home/approvaltask/task',
  L1:'/leads/createlead',
  L2:'/leads/leadDetails'
}

export const AccountNavigationroutes = {
  1: '/accounts/accountactivities/myactivities',
  2: '/accounts/accountactivities/list',
  3: '/accounts/accountactivities/Archivedlist',
  4: '/accounts/accountactivities/activitiesthread/meetingList',
}

export const AccountAdvnHeader: any[] = [

  { name: 'Name', title: 'Name' },
  { name: 'Ownername', title: 'Account Owner' },
  { name: 'AccType', title: 'Account Type' },
  {name : "Geo", title: 'Geo'},
  {name: "Region", title: "Region"},
  { name: "AccId", title: 'Account Number' },
]


export const DnBAccountHeader: any[] = [

  { name: 'Name', title: 'Name' },
  { name: "Duns", title: 'Duns Id' },
  { name: 'Region', title: 'Region' },
  { name: 'Industry', title: 'Industry' }
]


export const activityAdvnHeaders = {
  'accountSearch': AccountAdvnHeader,
  'DnBAccountHeader':DnBAccountHeader
}

export const activityAdvnNames = {
  'accountSearch': { name: 'Account', isCheckbox: false, isAccount: true },
}

@Injectable({
  providedIn: 'root'
})

export class ActivityService {
  public readonly ActivityChacheType = {
    Table: "Table",
    Details: "Details",
    MeetingTypes: "MeetingTypes"
  }
  public readonly ActivityTableIdentify = {
    conversation: 1,
    archived: 2,
    childConversation: 3

  }
  constructor(
    private apiService: ApiService,
    private ActivityDetailsOffline: ActivityDetailsOfflineService,
    private newconversationService: newConversationService,
    public datepipe: DatePipe,
    private offlineServices: OfflineService,
    private S3MasterApiService : S3MasterApiService,
    public errorMessage: ErrorMessage
  ) { }

  GetAllActivities(postBody: any): Observable<any> {
    return this.apiService.post(routes.GetAllActivity, postBody)
  }

  GetMyActivities(postBody: any): Observable<any> {
    return this.apiService.post(routes.GetMyActivity, postBody)
  }

  GetMyActivity(object: any): Observable<any> {
    return this.apiService.post(routes.MyActivity, object)
  }

  async getCachedActivity() {
    const TablePageData = await this.offlineServices.getActivityIndexCacheData()
    if (TablePageData.length > 0) {
      return TablePageData[0]
    } else {
      console.log("else condinti")
      return null
    }
  }

  ActivitySearch(postBody: any): Observable<any> {
    return this.apiService.post(routes.ActivitySearch, postBody)
  }

  MyActiviySearch(postBody): Observable<any> {
    return this.apiService.post(routes.MyActivitySearch, postBody)
  }

  MyMeetingActivitySearch(postBody: any): Observable<any> {
    return this.apiService.post(routes.MyMeetingActivitySearch, postBody)
  }

  GetActivityDetailsById(postbody): Observable<any> {
    return this.apiService.post(routes.GetActivityDetails, postbody)
  }

  GetCountryCode(postbody): Observable<any> {
    return this.apiService.post(routes.GetCountryCode, postbody)
  }
  DNBDetailsByDunsId(postbody): Observable<any> {
    return this.apiService.post(routes.DNBDetailsByDunsId, postbody)
  }

  async getCachedConversationType(id: number) {
    const ConvDetailsData = await this.offlineServices.getConverastionDetailsType(id)
    console.log("got ten types asa")
    console.log(ConvDetailsData)
    if (ConvDetailsData.length > 0) {
      return ConvDetailsData[0]
    } else {
      return null
    }
  }

  async getCacheActivityDetailsById(id: any) {
    let body = { ParentId: id }
    const ConvDetailsData = await this.offlineServices.getConverastionDetailsData(body)
    console.log("the cacahed con data")
    console.log(ConvDetailsData)
    if (ConvDetailsData.length > 0) {
      return ConvDetailsData[0]
    } else {
      return null
    }
  }

  async getActivityDetailsOfflineById(id: any) {
    const DetailsData = await this.ActivityDetailsOffline.getActivityDetailsindexCacheData(id)
    if (DetailsData.length > 0) {
      return { ...DetailsData[0], data: this.offlineServices.DecryptOfflineData(DetailsData[0].data) }
    } else {
      return null
    }
  }

  async getCachedMyActivity() {
    const TablePageData = await this.offlineServices.getMyActivityIndexCacheData()
    if (TablePageData.length > 0) {
      return TablePageData[0]
    } else {
      console.log("else condinti")
      return null
    }

  }

  //handels pagination,search,filterlookup
  getLookUpFilterData(data): Observable<any> {
    switch (data.controlName) {
      case 'accountSearch':
        return this.getAccoutdata(data)
      default:
        return of([])
    }
  }

  getCountryData(data: any): Observable<any> {
      let body = {
        "SearchText": data.searchKey
      }
      return this.GetCountryCode(body).pipe(switchMap(res => {
          return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterCountry(res.ResponseObject) : [] } : this.errorMessage.advanceLookupErr(res))
      }))
  }

  getSearchAccountInDNB(data: any): Observable<any> {
      return this.S3MasterApiService.SearchAccountInDNB(data.body).pipe(switchMap(res => {
          return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterSearchAccount(res.ResponseObject) : [] } :  this.errorMessage.advanceLookupErr(res))
      }))
  }

  filterSearchAccount(data) {
    if (data) {
      if (data.length > 0) {
        return data.map(x => {
          return {
            ...x,
            'Name': (x.Name) ? x.Name : 'NA',
            'Id': (x.Duns) ? x.Duns : 'NA',
            'Duns' : (x.Duns) ? x.Duns : 'NA',
            'Region' : (x.Region) ? x.Region : 'NA',
            'Industry' : (x.Industry) ? x.Industry : 'NA'
          }
        })
      } else {
        return []
      }
    } else {
      return []
    }
  }

  filterCountry(data) {
    if (data) {
      if (data.length > 0) {
        return data.map(x => {
          return {
            ...x,
            'name': (x.Desc) ? x.Desc : 'NA',
            'id': (x.Value) ? x.Value : 'NA',
            'Duns' : (x.Duns) ? x.Duns : 'NA',
            'Region' : (x.Region) ? x.Region : 'NA',
            'Industry' : (x.Industry) ? x.Industry : 'NA'
          }
        })
      } else {
        return []
      }
    } else {
      return []
    }
  }

  getAccoutdata(data: any): Observable<any> {
    if (data.isService) {
      let body = {
        "SearchText": data.useFullData.searchVal,
        "PageSize": data.useFullData.recordCount,
        "OdatanextLink": data.useFullData.OdatanextLink,
        "RequestedPageNumber": data.useFullData.pageNo
      }
      debugger
      return this.newconversationService.getsearchAccountCompany('', body).pipe(switchMap(res => {
        debugger
        if (res) {
          return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnAcc(res.ResponseObject) : [] } : [])
        } else {
          return of([])
        }
      }))
    } else {
      return of(this.filterAdvnAcc(data.data))
    }
  }

  filterAdvnAcc(data) {
    debugger
    if (data) {
      if (data.length > 0) {
        return data.map(x => {
          return {
            ...x,
            'Name': (x.Name) ? x.Name : 'NA',
            'Id': (x.SysGuid) ? x.SysGuid : 'NA',
            'AccId': (x.Number) ? x.Number : 'NA',
            'Ownername': (x.Owner) ? (x.Owner.FullName) ? x.Owner.FullName : "NA" : 'NA',
            'AccType': (x.Type) ? (x.Type.Value) ? x.Type.Value : 'NA' : 'NA',
            'Geo': x.Address.Geo.Name,
            'Region': x.Address.Region.Name,
          }
        })
      } else {
        return []
      }
    } else {
      return []
    }
  }

}
