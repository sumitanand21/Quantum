import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { JsonApiService } from './json-api.service';
import { ApiService } from './api.service';
import { OtherList } from '@app/core/models/others-list.model';
import { OfflineService } from './offline.services';
import { newConversationService } from './new-conversation.service';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { MeetingService } from './meeting.service';
import { DatePipe } from '@angular/common';
import { DateModifier } from './date-modifier';
const routes = {
  otherList: '/OtherConvoList',
  user: (id: number) => `/OtherConvoList/${id}`,
  OtherActivityList: 'v1/OtherActivityManagement/List',
  CreateOtherActivity: 'v1/OtherActivityManagement/Create',
  getOtherActivityDetails: 'v1/OtherActivityManagement/Details',
  SearchOtherActivityList: 'v1/OtherActivityManagement/Search',
  // EditOtherActivity: 'v1/OtherActivityManagement/Edit'
  EditOtherActivity: 'v1/OtherActivityManagement/Edit_V1',
  FilterList: 'v1/OtherActivityManagement/FilterList',
  FilterSearchName: 'v1/OtherActivityManagement/FilterSearchName',
  SearchLeads: 'v1/MeetingManagement/SearchLeads',
  SearchOpportunity: 'v1/MeetingManagement/SearchOpportunity_V1',
  wiproContactSearchUser: 'v1/SearchManagement/SearchUser',
  FilterSearchDuration: 'v1/OtherActivityManagement/FilterSearchDuration',
  //list columnfilterApi's
  getFilterListColumnName: 'v1/OtherActivityManagement/FilterListColumnName',
  getFilterListColumnDuration: 'v1/OtherActivityManagement/FilterListColumnDuration',
  getFilterListColumnWiproParticipants: 'v1/OtherActivityManagement/FilterListColumnWiproParticipants',
  getFilterListColumnLeads: 'v1/OtherActivityManagement/FilterListColumnLeads',
  getFilterListColumnOpportunityOrOrders: 'v1/OtherActivityManagement/FilterListColumnOpportunityOrOrders'

};
export const ExpandHeaderOthers: any[] = [
  { id: 1, isFilter: false, name: 'name', isFixed: true, order: 1, title: 'Name', selectName: "Other activitie", SortId: 0, },
  { id: 2, isFilter: false, name: 'date', isFixed: false, order: 2, title: 'Date created', isHideColumnSearch: true, SortId: 3, displayType: 'date', dateFormat: 'dd-MMM-yyyy' },
  { id: 3, isFilter: false, name: 'duration', isFixed: false, order: 3, title: 'Duration', isHideColumnSearch: true, SortId: 0, displayType: 'capsFirstCase' },
  { id: 4, isFilter: false, name: 'participants', isFixed: false, order: 4, title: 'Participants', isModal: true, SortId: 0 },
  { id: 5, isFilter: false, name: 'leads', isFixed: false, order: 4, title: 'Linked leads', isModal: true, SortId: 0},
  { id: 6, isFilter: false, name: 'opportunities', isFixed: false, order: 5, title: 'Linked opportunities', isModal: true, SortId: 0},
];

export const ActivityLinkedLeads: any[] = [
  { name: 'LeadName', title: 'Lead Name' },
  { name: 'Leadowner', title: 'Lead owner' },
  { name: 'Account', title: 'Account Name' }
]

export const ActivityLinkedOpportunity: any[] = [
  { name: 'OpportunityName', title: 'Opportunity Name' },
  { name: 'Opportunityowner', title: 'Opportunity owner' },
  { name: 'OpportunityNumber', title: 'Opportunity Number' }
]

export const ActivityParticipants: any[] = [
  { name: 'Name', title: 'Name' },
  { name: 'Email', title: 'Email id' }
]

export const otherActivityAdvnHeaders = {
  'activityGroup': '',
  'participants': ActivityParticipants,
  'linkedLeads': ActivityLinkedLeads,
  'linkedOpportunityOrder': ActivityLinkedOpportunity,
  'linkedMarketingTraining': ''
}

export const otherActivityAdvnNames = {
  'activityGroup': { name: 'Activity group', isCheckbox: false, isAccount: false },
  'participants': { name: 'Participants', isCheckbox: true, isAccount: false },
  'linkedLeads': { name: 'Linked leads', isCheckbox: true, isAccount: false },
  'linkedOpportunityOrder': { name: 'Linked opportunities', isCheckbox: true, isAccount: false },
  'linkedMarketingTraining': { name: 'Linked marketing/training', isCheckbox: true, isAccount: false }
}

@Injectable({
  providedIn: 'root'
})
export class OthersListService {
  selArray = [];
  cachedArray = [];
  public readonly OtherListConvChacheType = {
    Table: "Table",
    Details: "Details",
    MeetingTypes: "MeetingTypes"
  }
  constructor(
    private apiService: ApiService,
    private offlineServices: OfflineService,
    public newconversationService: newConversationService,
    public datepipe: DatePipe,
    private meetingService: MeetingService, ) { }

  getLookUpFilterData(data): Observable<any> {
    switch (data.controlName) {
      case 'activityGroup':
        return this.getActivityGroupData(data);
      case 'participants':
        return this.getParticipantsData(data);
      case 'linkedLeads':
        return this.getLinkedLeadsData(data);
      case 'linkedOpportunityOrder':
        return this.getLinkedOpportunityOrder(data);
      case 'linkedMarketingTraining':
        return this.getLinkedMarketingTraining(data);
    }
  }

  getActivityGroupData(data): Observable<any> {
    return data
  }

  getParticipantsData(data): Observable<any> {
    if (data.isService) {
      let body = {
        "SearchText": data.useFullData.searchVal,
        "PageSize": data.useFullData.recordCount,
        "OdatanextLink": data.useFullData.OdatanextLink,
        "RequestedPageNumber": data.useFullData.pageNo
      }
      return this.newconversationService.searchUser('', body).pipe(switchMap(res => {
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
            'Name': (x.FullName) ? x.FullName : 'NA',
            'Email': (x.Email) ? x.Email : 'NA',
            'Id': (x.SysGuid) ? x.SysGuid : '',
          }
        })
      } else {
        return of([])
      }
    } else {
      return of([])
    }
  }

  getLinkedLeadsData(data): Observable<any> {
    if (data.isService) {
      let body = {
        "SearchText": data.useFullData.searchVal,
        "Guid": data.useFullData.guid,
        "SearchType": 3,
        "isProspect": data.useFullData.isProspect,
        "PageSize": data.useFullData.recordCount,
        "OdatanextLink": data.useFullData.OdatanextLink,
        "RequestedPageNumber": data.useFullData.pageNo
      }
      return this.meetingService.SearchLeadBasedOnAccount(null, null, null, body).pipe(switchMap(res => {
        return of((!res.IsError) ? { ...res, ResponseObject: this.filterLinkLeads(res.ResponseObject) } : { ...res })
      }))

    } else {
      return of(this.filterLinkLeads(data.data))
    }
  }

  filterLinkLeads(data): Observable<any> {
    if (data) {
      if (data.length > 0) {
        return data.map(x => {
          return {
            ...x,
            'LeadName': (x.Name) ? x.Name : 'NA',
            'Leadowner': (x.Owner) ? (x.Owner.FullName) ? x.Owner.FullName : 'NA' : 'NA',
            'Account': (x.Account) ? (x.Account.Name) ? x.Account.Name : 'NA' : 'NA',
            'Id': (x.LeadGuid) ? x.LeadGuid : '',
          }
        })
      } else {
        return of([])
      }
    } else {
      return of([])
    }
  }

  getLinkedOpportunityOrder(data): Observable<any> {
    if (data.isService) {
      let body = {
        "SearchText": data.useFullData.searchVal,
        "Guid": data.useFullData.guid,
        "isProspect": data.useFullData.isProspect,
        "PageSize": data.useFullData.recordCount,
        "OdatanextLink": data.useFullData.OdatanextLink,
        "RequestedPageNumber": data.useFullData.pageNo
      }
      return this.meetingService.SearchOrderAndOppBasedOnAccount(null, null, null, body).pipe(switchMap(res => {
        return of((!res.IsError) ? { ...res, ResponseObject: this.filterLinkedOpportunity(res.ResponseObject) } : { ...res })
      }))
    } else {
      return of(this.filterLinkedOpportunity(data.data))
    }
  }

  filterLinkedOpportunity(data): Observable<any> {
    debugger
    if (data) {
      if (data.length > 0) {
        return data.map(x => {
          return {
            ...x,
            'OpportunityName': (x.Title) ? x.Title : 'NA',
            'Opportunityowner': (x.OwnerName) ? x.OwnerName : 'NA',
            'OpportunityNumber': (x.Code) ? x.Code : 'NA',
            'Id': (x.Guid) ? x.Guid : '',
          }
        })
      } else {
        return of([])
      }
    } else {
      return of([])
    }
  }

  getLinkedMarketingTraining(data): Observable<any> {
    return data
  }
  getAll(): Observable<OtherList[]> {
    return this.apiService.get(routes.otherList);
  }
  getSingle(id: number): Observable<OtherList> {
    return this.apiService.get(routes.user(id));
  }
  getParentHeaderData(): Observable<any[]> {
    return of(ExpandHeaderOthers);
  }
  OtherActivityList(postBody: any): Observable<any> {
    return this.apiService.post(routes.OtherActivityList, postBody);
  }
  getAppliedOtherListFilterData(FilterList) {
    return this.apiService.post(routes.FilterList, FilterList);
  }

  async getCachedOtherActivityList() {
    const TablePageData = await this.offlineServices.getOtherActivityTableIndexCacheData()
    console.log("service ginthe quetry data")
    console.log(TablePageData)
    if (TablePageData.length > 0) {
      return TablePageData[0]
    } else {
      console.log("else condinti")
      return null
    }
  }
  async getCacheOtherActivityListById(id: any) {
    const otherListsData = await this.offlineServices.getOtherActivityById(id)
    if (otherListsData.length > 0) {
      return otherListsData[0]
    } else {
      return null
    }
  }
  CreateOtherActivity(postBody: any): Observable<any> {
    return this.apiService.post(routes.CreateOtherActivity, postBody);
  }
  getOtherActivityDetails(postBody: any) {
    var body = {
      "Guid": postBody
    }
    return this.apiService.post(routes.getOtherActivityDetails, body);
  }
  searchOtherActivityList(postBody: any) {
    return this.apiService.post(routes.SearchOtherActivityList, postBody);
  }
  EditOtherActivity(postBody: any) {
    return this.apiService.post(routes.EditOtherActivity, postBody);
  }

  getOtherListNames(convGuid, searchText, body?): Observable<any> {
    let reqbody = {
      "Guid": convGuid,
      "PageSize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": "",
      "SearchText": searchText
    }
    return this.apiService.post(routes.FilterSearchName, (body) ? body : reqbody)
  }

  getOtherLinkedLeads(searchText, body?): Observable<any> {
    let reqbody = {
      "PageSize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": "",
      "SearchText": searchText
    }
    return this.apiService.post(routes.SearchLeads, (body) ? body : reqbody)
  }

  getOtherLinkedOpportunity(searchText, body?): Observable<any> {
    let reqbody = {
      "PageSize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": "",
      "SearchText": searchText
    }
    return this.apiService.post(routes.SearchOpportunity, (body) ? body : reqbody)
  }

  FilterSearchDuration(Guid, searchText, body?) {
    let reqbody = {
      "Guid": Guid,
      "PageSize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": "",
      "SearchText": searchText
    }
    return this.apiService.post(routes.FilterSearchDuration, (body) ? body : reqbody)
  }

  getOtherParticipants(searchText, body?): Observable<any> {
    let reqbody = {
      "PageSize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": "",
      "SearchText": searchText
    }
    return this.apiService.post(routes.wiproContactSearchUser, (body) ? body : reqbody)
  }

  getOtherListConfigData(data): Observable<any> {
    switch (data.filterData.headerName) {
      case 'name':
        return this.getNameColumnFilterData(data)
      // case 'date':
      //   return this.getMeetingDateColumnFilterData(data)
      case 'duration':
        return this.getDurationColumnFilterData(data)
      case 'participants':
        return this.getParticipantsFilterData(data)
      case 'leads':
        return this.getLinkedLeadsFilterData(data)
      case 'opportunities':
        return this.getOpportunitiesFilterData(data)
      default:
        return of([])
    }
  }

  pluckParticularKey(array, key) {
    return array.map(function (item) { return (item[key]) });
  }

  GetAppliedFilterData(data) {
    return {
      "ColumnSearchText":(data.filterData) ? data.filterData.columnSerachKey : '',
      "PageSize":  data.useFulldata.pageSize,
      "RequestedPageNumber": data.useFulldata.pageNo,
      "SearchText":(data.filterData) ? data.filterData.globalSearch : '',
      "IsDesc": true,
      "ActivityGroupGuids": [data.useFulldata.Guid],
      "Name":(data.filterData) ? this.pluckParticularKey(data.filterData.filterColumn['name'], 'name'):[],
      "OpportunityGuids":(data.filterData) ? this.pluckParticularKey(data.filterData.filterColumn['opportunities'], 'id'):[],
      "LeadGuids":(data.filterData) ? this.pluckParticularKey(data.filterData.filterColumn['leads'], 'id'):[],
      "AccountGuids": [],
      "CampaignGuids": [],
      "OwnerGuids": [],
      "ProspectGuids": [],
      "OrderGuids": [],
      "SolutionsGuids": [],
      "TaggedUsersGuids": [],
      "MeetingType": [],
      "Durations":(data.filterData) ? this.pluckParticularKey(data.filterData.filterColumn['duration'], 'Duration'):[],
      "OdatanextLink": "",
      "WiproParticipantsGuids":(data.filterData) ? this.pluckParticularKey(data.filterData.filterColumn['participants'], 'id'):[],
      "DueDateList":[],
      "StartDate": (data.filterData) ? (data.filterData.filterColumn['date'][0].filterStartDate!=='') ? this.dateModifier(data.filterData.filterColumn['date'][0].filterStartDate):"":"",
      "EndDate":(data.filterData) ? (data.filterData.filterColumn['date'][0].filterEndDate!=='') ? this.dateModifier(data.filterData.filterColumn['date'][0].filterEndDate):"":"",
      "SortBy":(data.filterData) ? this.pluckParticularKey(ExpandHeaderOthers.filter(x => x.name == data.filterData.sortColumn), 'SortId')[0]:[]
    }
  }

  dateModifier(dateConvert) {
    let dataModifier = new DateModifier();
    return dataModifier.modifier(dateConvert)
 }
 
  GetFilterListColumnName(postBody){
    return this.apiService.post(routes.getFilterListColumnName, postBody);
  }

  GetListColumnDuration(postBody){
    return this.apiService.post(routes.getFilterListColumnDuration, postBody);
  }

  GetListColumnWiproParticipants(postBody){
    return this.apiService.post(routes.getFilterListColumnWiproParticipants, postBody);
  }

  GetListColumnLeads(postBody){
    return this.apiService.post(routes.getFilterListColumnLeads, postBody);
  }

  GetColumnOpportunityOrOrders(postBody){
    return this.apiService.post(routes.getFilterListColumnOpportunityOrOrders, postBody);
  }

  // getMeetingDateColumnFilterData(data): Observable<any> {
  //   return this.getOtherListNames(data.ActivityGuid, data.filterData.columnSerachKey).pipe(switchMap(res => {
  //     return of((!res.IsError) ? { ...res, ResponseObject: this.filterMeetingDateColumndata(res.ResponseObject) } : { ...res })
  //   }))
  // }

  getDurationColumnFilterData(data): Observable<any>  {
    let reqBody = this.GetAppliedFilterData({ ...data})
    return this.GetListColumnDuration(reqBody).pipe(switchMap(res => {
      return of((!res.IsError) ? { ...res, ResponseObject: this.filterDurationColumndata(res.ResponseObject) } : { ...res })
    }))
  }

  getNameColumnFilterData(data): Observable<any> {
    let reqBody = this.GetAppliedFilterData({ ...data})
    return this.GetFilterListColumnName(reqBody).pipe(switchMap(res => {
      return of((!res.IsError) ? { ...res, ResponseObject: this.filterNameColumndata(res.ResponseObject) } : { ...res })
    }))
  }

  getParticipantsFilterData(data): Observable<any> {
    let reqBody = this.GetAppliedFilterData({ ...data})
    return this.GetListColumnWiproParticipants(reqBody).pipe(switchMap(res => {
      return of((!res.IsError) ? { ...res, ResponseObject: this.filterParticipantColumndata(res.ResponseObject) } : { ...res })
    }))
  }
  
  getLinkedLeadsFilterData(data): Observable<any> {
    let reqBody = this.GetAppliedFilterData({ ...data})
    return this.GetListColumnLeads(reqBody).pipe(switchMap(res => {
      return of((!res.IsError) ? { ...res, ResponseObject: this.filterLinkedLeadsColumndata(res.ResponseObject) } : { ...res })
    }))
  }

  getOpportunitiesFilterData(data): Observable<any> {
    let reqBody = this.GetAppliedFilterData({ ...data})
    return this.GetColumnOpportunityOrOrders(reqBody).pipe(switchMap(res => {
      return of((!res.IsError) ? { ...res, ResponseObject: this.filterLinkedOpportunityColumndata(res.ResponseObject) } : { ...res })
    }))
  }

  filterNameColumndata(data) {
    if (data) {
      if (data.length > 0) {
        return data.map(x => {
          return {
            id: x.Guid,
            name: x.Subject,
            isDatafiltered: false
          }
        })
      } else {
        return []
      }
    } else {
      return []
    }
  }

  // filterMeetingDateColumndata(data) {
  //   if (data) {
  //     if (data.length > 0) {
  //       return data.map(x => {
  //         return {
  //           id: x.Guid,
  //           name: this.datepipe.transform(x.CreatedOn, 'd-MMM-y'),
  //           isDatafiltered: false,
  //           CreatedOn: x.CreatedOn
  //         }
  //       })
  //     } else {
  //       return []
  //     }
  //   } else {
  //     return []
  //   }
  // }

  filterDurationColumndata(data) {
    if (data) {
      if (data.length > 0) {
        return data.map(x => {
          return {
            id: x.Guid,
            name: this.durationModifier(x.Duration),
            isDatafiltered: false,
            Duration: x.Duration
          }
        })
      } else {
        return []
      }
    } else {
      return []
    }
  }

  filterParticipantColumndata(data) {
    if (data) {
      if (data.length > 0) {
        return data.map(x => {
          return {
            id: x.WiproAttendee.SysGuid,
            name: x.WiproAttendee.FName,
            isDatafiltered: false
          }
        })
      } else {
        return []
      }
    } else {
      return []
    }
  }

  filterLinkedLeadsColumndata(data) {
    if (data) {
      debugger;
      if (data.length > 0) {
        return data.map(x => {
          return {
            id: x.LeadColumn.SysGuid,
            name: x.LeadColumn.Title,
            isDatafiltered: false
          }
        })
      } else {
        return []
      }
    } else {
      return []
    }
  }

  filterLinkedOpportunityColumndata(data) {
    if (data) {
      if (data.length > 0) {
        return data.map(x => {
          return {
            id: x.Guid,
            name: x.Title,
            isDatafiltered: false
          }
        })
      } else {
        return []
      }
    } else {
      return []
    }
  }

  durationModifier(data) {
    if (data == "NA") {
      return "NA"
    }
    if (Number(data) !== 0) {
      var min = (data)
      var days = Math.floor(min / 1440);
      var hours = Math.floor((min % 1440) / 60);
      var mins = Math.floor(min % 60)
      var dayns = '';  var minutens = '';  var hourns = '';
      if (Number(days) > 0) {
        if (Number(days) == 1) { 
          dayns = days + ' ' + "Day ";
        } else {
          dayns = days + ' ' + "Days ";
        }
      }
      if (Number(hours) > 0) {
        if (Number(hours) == 1) {  
          hourns = hours + ' ' + "Hour ";
        } else {
          hourns = hours + ' ' + "Hours ";
        }
      }
      if (Number(mins) > 0) {
        if (Number(mins) == 1) {  
          minutens = mins + ' ' + "Minute ";
        } else {
          minutens = mins + ' ' + "Minutes ";
        }
      }
      return dayns + hourns + minutens;
    }
    else if (Number(data) == 0) {
      return "00";
    }
    console.log("days", days, " hours ", hours, " minutes ", mins)
  }
  SearchMeetingActionOrders(data) {
    if (data.filterData.columnSerachKey != '') {
      data.filterConfigData[data.headerName] = {
        data: data.res.ResponseObject.filter(s => s.name.toLowerCase().includes((data.filterData.columnSerachKey).toLowerCase())),
        recordCount: data.res.TotalRecordCount,
        NextLink: data.res.OdatanextLink,
        PageNo: data.res.CurrentPageNumber
      }
    } else {
      data.filterConfigData[data.headerName] = {
        data: data.res.ResponseObject,
        recordCount: data.res.TotalRecordCount,
        NextLink: data.res.OdatanextLink,
        PageNo: data.res.CurrentPageNumber
      }
    }
  }

}
