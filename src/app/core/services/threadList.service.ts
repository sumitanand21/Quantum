import { EncrDecrService } from './encr-decr.service';

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { ThreadList } from '@app/core/models/threadList.model';
import { OfflineService } from './offline.services';
import { switchMap, map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { DateModifier } from './date-modifier';
import { Router } from '@angular/router';

const routes = {
    threadList: '/threadList',
    user: (id: number) => `/users/${id}`,
    GetActivityMeeting: 'v1/MeetingManagement/List_V1',
    ActivityMeetingSearch: 'v1/MeetingManagement/SearchMeeting',
    MeetingDetails: "v1/MeetingManagement/Details",
    FilteredMeetingApi: "v1/MeetingManagement/FilterList",
    GetMeetingSubject: "v1/MeetingManagement/SearchMeetingName",
    searchMeetingType: "v1/MeetingManagement/SearchBasedOnParentActivity",
    GetLinkedLeads: 'v1/MeetingManagement/SearchLeads',
    GetLinkedOpp: 'v1/MeetingManagement/SearchOpportunity_V1',
    GetCustomerContact: 'v1/AccountManagement/SearchContactName',
    GetAccountGuidsapi: 'v1/LeadManagement/AccountnProspect_V1',


    //list columnfilter Api
    GetFilterColumnName:'v1/MeetingManagement/FilterColumnName',
    GetFilterColumnMeetingType:'v1/MeetingManagement/FilterColumnMeetingType',
    GetFilterColumnAccountOrProsepct:'v1/MeetingManagement/FilterColumnAccountOrProsepct',
    GetFilterColumnCustomerContacts:'v1/MeetingManagement/FilterColumnCustomerContacts',
    GetFilterColumnWiproAttendees:'v1/MeetingManagement/FilterColumnWiproAttendees',
    GetFilterColumnLinkLeads:'v1/MeetingManagement/FilterColumnLinkLeads',
    GetFilterColumnLinkOpportunities:'v1/MeetingManagement/FilterColumnLinkOpportunities',
};

export const childConversationheader: any[] = [

    { id: 1, isFilter: false, name: 'Agenda', isFixed: true, order: 1, title: 'Meeting subject', selectName: "Meeting",SortId:0, },
    { id: 2, isFilter: false, name: 'MeetingType', isFixed: false, order: 2, title: ' Meeting type',SortId:14 },
    { id: 3, isFilter: false, name: 'AccountName', isFixed: false, order: 3, title: 'Account name',SortId:2 },
    { id: 4, isFilter: false, name: 'CustomerContacts', isFixed: false, order: 4, title: 'Customer contacts', isModal: true,SortId:0 },
    { id: 5, isFilter: false, name: 'WiproAttendees', isFixed: false, order: 5, title: 'Wipro attendees', isModal: true,SortId:0 },
    { id: 6, isFilter: false, name: 'DateCreated', isFixed: false, order: 6, title: 'Date created', isHideColumnSearch:true, SortId:3, displayType: 'date', dateFormat:'dd-MMM-yyyy'  },
    { id: 7, isFilter: false, name: 'Leadslinked', isFixed: false, order: 7, title: 'Linked leads', isModal: true,SortId:0 },
    { id: 8, isFilter: false, name: 'OppLinked', isFixed: false, order: 8, title: 'Linked opportunities ', isModal: true,SortId:0 },

]

@Injectable({
    providedIn: 'root'
})
export class threadListService {

    selArray = [];
    cachedArray = [];

    public readonly ActivityMeetingChacheType = {
        Table: "Table",
        Details: "Details",
        MeetingTypes: "MeetingTypes"
    }
    constructor(
        private apiService: ApiService,
        private offlineServices: OfflineService,
        private EncrDecr: EncrDecrService,
        private router: Router,
        public datepipe: DatePipe) { }

    getAll(): Observable<ThreadList[]> {

        return this.apiService.get(routes.threadList);
    }

    getSingle(id: number): Observable<ThreadList> {
        return this.apiService.get(routes.user(id));
    }
    getParentHeaderData(): Observable<any[]> {
        return of(childConversationheader);
    }

    thread: any;
    detail: any;
    action: any;

    set threadValue(value) {
        this.thread = value
    }

    get threadValue() {
        return this.thread
    }

    set detailValue(value) {
        this.detail = value
    }

    get detailValue() {
        return this.detail
    }

    set actionValue(value) {
        this.action = value
    }

    get actionValue() {
        return this.action
    }

    // Getting the current page number
    sendPageNumber: number;

    set sendPageNumberData(value: number) {
        this.sendPageNumber = value;
    }

    get sendPageNumberData() {
        return this.sendPageNumber
    }

    // Getting the current page size

    sendPageSize: number;

    set sendPageSizeData(value: number) {
        this.sendPageSize = value;
    }

    get sendPageSizeData() {
        return this.sendPageSize
    }

    getActivityMeetings(reqBody): Observable<any> {
        return this.apiService.post(routes.GetActivityMeeting, reqBody)
    }

    async getCacheActivityMeetingListById(id: any) {

        const MeetingsData = await this.offlineServices.getActivityMeetingById(id)

        if (MeetingsData.length > 0) {
            return MeetingsData[0]
        } else {
            return null
        }

    }

    ActivityMeeting(reqBody): Observable<any> {
        return this.apiService.post(routes.ActivityMeetingSearch, reqBody)
    }

    GetMeetingDetails(reqBody): Observable<any> {

        return this.apiService.post(routes.MeetingDetails, reqBody)
    }

    getAppliedFilterMeetingData(body) {

        return this.apiService.post(routes.FilteredMeetingApi, body)

    }

    pluckParticularKey(array, key) {
        return array.map(function (item) { return (item[key]) });
    }


    // ----------------------------------------------------------Table Filter Logic----------------------------------------------------

    GetAppliedFilterData(data) {
        debugger
        return {
          "ColumnSearchText":(data.filterData) ? data.filterData.columnSerachKey : '',
          "ActivityGroupGuids":  [data.useFulldata.id],
          'RequestedPageNumber': data.useFulldata.pageNo,
          "Name": (data.filterData) ?  this.pluckParticularKey(data.filterData.filterColumn['Agenda'], 'name') : [],
          "AccountGuids": (data.filterData) ? this.pluckParticularKey(data.filterData.filterColumn['AccountName'].filter(x => !x.isProspect), 'id'): [],
          "ProspectGuids": (data.filterData) ? this.pluckParticularKey(data.filterData.filterColumn['AccountName'].filter(x => x.isProspect), 'id'): [],
          "LeadGuids":(data.filterData) ? this.pluckParticularKey(data.filterData.filterColumn['Leadslinked'], 'id'): [],
        //   "DueDateList":(data.filterData) ? this.pluckParticularKey(data.filterData.filterColumn['DateCreated'], 'meetingDate'): [],
          "DueDateList": [],
          "MeetingType":(data.filterData) ? this.pluckParticularKey(data.filterData.filterColumn['MeetingType'], 'id'): [],
          "CustomerContactGuids":(data.filterData) ? this.pluckParticularKey(data.filterData.filterColumn['CustomerContacts'], 'id'): [],
          "OpportunityGuids":(data.filterData) ? this.pluckParticularKey(data.filterData.filterColumn['OppLinked'], 'id'): [],
          "WiproParticipantsGuids":(data.filterData) ? this.pluckParticularKey(data.filterData.filterColumn['WiproAttendees'], 'id'): [],
          "OwnerGuids": [],
          "OrderGuids": [],
          "SolutionsGuids": [],
          "TaggedUsersGuids": [],
          "CampaignGuids": [],
          "SearchText":(data.filterData) ? data.filterData.globalSearch : '',
          "PageSize":data.useFulldata.pageSize,
          "OdatanextLink": "",
          "IsDesc": true,
          "StartDate": (data.filterData) ? (data.filterData.filterColumn['DateCreated'][0].filterStartDate!=='') ? this.dateModifier(data.filterData.filterColumn['DateCreated'][0].filterStartDate):"":"",
          "EndDate":(data.filterData) ? (data.filterData.filterColumn['DateCreated'][0].filterEndDate!=='') ? this.dateModifier(data.filterData.filterColumn['DateCreated'][0].filterEndDate):"":"",
          "SortBy":(data.filterData) ? this.pluckParticularKey(childConversationheader.filter(x => x.name == data.filterData.sortColumn), 'SortId')[0]: [],
        }
      }

    dateModifier(dateConvert) {
       let dataModifier = new DateModifier();
       return dataModifier.modifier(dateConvert)
    }

    getMeetingSubject(convGuid, searchText, body?) {
        let reqbody = {
            "SearchText": searchText,
            "Guid": convGuid,
            "OdatanextLink": "",
            "RequestedPageNumber": 1,
            "PageSize": 10,
        }
        return this.apiService.post(routes.GetMeetingSubject, (body) ? body : reqbody)
    }

    getLinkedLeads(searchText, body?) {
        let reqbody = {
            "SearchText": searchText,
            "OdatanextLink": "",
            "RequestedPageNumber": 1,
            "PageSize": 10,
        }
        return this.apiService.post(routes.GetLinkedLeads, (body) ? body : reqbody)
    }

    getlinkedOpp(searchText, body?) {
        let reqbody = {
            "SearchText": searchText,
            "OdatanextLink": "",
            "RequestedPageNumber": 1,
            "PageSize": 10,
        }
        return this.apiService.post(routes.GetLinkedOpp, (body) ? body : reqbody)

    }

    getCustomerContacts(searchText, body?) {
        let reqbody = {
            "SearchText": searchText,
            "OdatanextLink": "",
            "RequestedPageNumber": 1,
            "PageSize": 10,
        }
        return this.apiService.post(routes.GetCustomerContact, (body) ? body : reqbody)
    }

    getAccountGuidsapi(searchText, body?) {
        let reqbody = {
            "PageSize": 10,
            "RequestedPageNumber": 1,
            "OdatanextLink": "",
            "SearchText": searchText
        }
        return this.apiService.post(routes.GetAccountGuidsapi, (body) ? body : reqbody).pipe(
            map(res =>{if(!res.IsError){
                return {
                    ...res,
                    ResponseObject : res.ResponseObject.map(res1 =>{
                        return {
                            ...res1,
                            Name : res1.Name? decodeURIComponent(res1.Name): "NA"
                        }
                    })
                }
            }else{
                return res
            }
            })
        );
    }

    getMeetingListConfigData(data): Observable<any> {
        switch (data.filterData.headerName) {
            case 'Agenda':
                return this.getMeetingSubjectColumnFilterData(data)
            case 'MeetingType':
                return this.getMeetingTypeColumnFilterData(data)
            case 'AccountName':
                return this.getAccountNameColumnFilterData(data)
            case 'CustomerContacts':
                return this.getCustomerContactsColumnFilterData(data)
            case 'WiproAttendees':
                return this.getWiproAttendeesFilterData(data)
            // case 'DateCreated':
            //     return this.getDateCreatedFilterData(data)
            case 'Leadslinked':
                return this.getLeadslinkedFilterData(data)
            case 'OppLinked':
                return this.getOppLinkedFilterData(data)
            default:
                return of([])
        }
    }
    
    getFilterColumnName(body) {
        return this.apiService.post(routes.GetFilterColumnName, body)
    }

    getColumnMeetingType(body) {
        return this.apiService.post(routes.GetFilterColumnMeetingType, body)
    }

    getColumnAccountOrProsepct(body) {
        return this.apiService.post(routes.GetFilterColumnAccountOrProsepct, body).pipe(
            map(res =>{if(!res.IsError){
                return {
                    ...res,
                    ResponseObject : res.ResponseObject.map(data =>{
                        return {
                            ...data,
                            ActivityGroup: {
                                Account: {
                                    SysGuid: data.ActivityGroup.Account.SysGuid,
                                    Name: decodeURIComponent(data.ActivityGroup.Account.Name),
                                    isProspect: data.ActivityGroup.Account.isProspect
                                  }
                            }
                        }
                    })
                }
            }else{
                return res
            }
            })
        ); 
    }

    getColumnCustomerContacts(body) {
        return this.apiService.post(routes.GetFilterColumnCustomerContacts, body)
    }

    getColumnWiproAttendees(body) {
        return this.apiService.post(routes.GetFilterColumnWiproAttendees, body)
    }

    getColumnLinkLeads(body) {
        return this.apiService.post(routes.GetFilterColumnLinkLeads, body)
    }

    getColumnLinkOpportunities(body) {
        return this.apiService.post(routes.GetFilterColumnLinkOpportunities, body)
    }

    getMeetingSubjectColumnFilterData(data: any): Observable<any> {
        if (data) {
            let body = this.GetAppliedFilterData({ ...data})
            return this.getFilterColumnName(body).pipe(switchMap(res => {
                    return of((!res.IsError) ? { ...res, ResponseObject: this.filterMeetingNameColumndata(res.ResponseObject) } : { ...res })
            }))
        }
    }

    getMeetingTypeColumnFilterData(data: any): Observable<any> {
        let body = this.GetAppliedFilterData({ ...data})
        return this.getColumnMeetingType(body).pipe(switchMap(res => {
                return of((!res.IsError) ? { ...res, ResponseObject: this.filterMeetingTypeColumndata(res.ResponseObject) } : { ...res })
        }))
    }

    getAccountNameColumnFilterData(data: any): Observable<any> {
        let body = this.GetAppliedFilterData({ ...data})
        return this.getColumnAccountOrProsepct(body).pipe(switchMap(res => {
                return of((!res.IsError) ? { ...res, ResponseObject: this.filterAccountColumndata(res.ResponseObject) } : { ...res })
        }))
    }

    getCustomerContactsColumnFilterData(data: any): Observable<any> {
        let reqbody = this.GetAppliedFilterData({ ...data})
        return this.getColumnCustomerContacts(reqbody).pipe(switchMap(res => {
                return of((!res.IsError) ? { ...res, ResponseObject: this.filterCustomerColumndata(res.ResponseObject) } : { ...res })
        }))
    }

    getWiproAttendeesFilterData(data: any): Observable<any> {
        let reqbody = this.GetAppliedFilterData({ ...data})
        return this.getColumnWiproAttendees(reqbody).pipe(switchMap(res => {
                return of((!res.IsError) ? { ...res, ResponseObject: this.filterOwnerColumndata(res.ResponseObject) } : { ...res })
        }))
    }

    // getDateCreatedFilterData(data: any): Observable<any> {
    //     if (data) {
    //         let body = this.GetAppliedFilterData({ ...data})
    //         return this.getColumnLinkLeads(body).pipe(switchMap(res => {
    //                 return of((!res.IsError) ? { ...res, ResponseObject: this.filterMeetingDateColumndata(res.ResponseObject)  } : { ...res })
    //         }))
    //     }
    // }

    getLeadslinkedFilterData(data: any): Observable<any> {
        let reqbody = this.GetAppliedFilterData({ ...data})
        return this.getColumnLinkLeads(reqbody).pipe(switchMap(res => {
                return of((!res.IsError) ? { ...res, ResponseObject : this.filterlinkedLeadColumndata(res.ResponseObject)  } : { ...res })
        }))
    }

    getOppLinkedFilterData(data: any): Observable<any> {
        let reqbody = this.GetAppliedFilterData({ ...data})
        return this.getColumnLinkOpportunities(reqbody).pipe(switchMap(res => {
                return of((!res.IsError) ? { ...res, ResponseObject: this.filterlinkedOppColumndata(res.ResponseObject)  } : { ...res })
        }))
    }

    filterMeetingNameColumndata(data) {
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
    //     if (data) {
    //         if (data.length > 0) {
    //             return data.map(x => {
    //                 return {

    //                     name: (x.MeetingDate)? this.datepipe.transform(x.MeetingDate, 'd-MMM-yyyy'):'',
    //                     meetingDate: (x.MeetingDate)? x.MeetingDate:'',
    //                     isDatafiltered: false
    //                 }
    //             })
    //         } else {
    //             return []
    //         }
    //     } else {
    //         return []
    //     }
    // }

    filterMeetingTypeColumndata(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {

                        id: x.MeetingType.Id,
                        name: x.MeetingType.Value,
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

    filterOwnerColumndata(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {

                        id: x.WiproAttendee.SysGuid,
                        name: x.WiproAttendee.FullName,
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

    filterAccountColumndata(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {

                        id: x.ActivityGroup.Account.SysGuid,
                        name: x.ActivityGroup.Account.Name,
                        isProspect: x.ActivityGroup.Account.isProspect,
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


    filterCustomerColumndata(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {

                        id: x.CustomerContact.Guid,
                        name: x.CustomerContact.Name,
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

    filterlinkedLeadColumndata(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {

                        id: x.LeadColumn.SysGuid,
                        name: x.LeadColumn.Name,
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

    filterlinkedOppColumndata(data) {
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
}