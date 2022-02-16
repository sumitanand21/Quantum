import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { contactconversation } from '../models/contactconversation.model';
import { ApiService } from './api.service';
import { ConversationService } from './conversation.service';
import { switchMap, map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

const routes = {
    contactconversation: (id: number) => `/contactconversation/${id}`,
    FilteredrealtionShipMeetingApi: "v1/MeetingManagement/FilterList",
     //list columnfilter Api
     GetRelationShipLogFilterColumnName:'v1/MeetingManagement/FilterColumnName',
     GetRelationShipLogFilterColumnMeetingType:'v1/MeetingManagement/FilterColumnMeetingType',
     GetRelationShipLogFilterColumnAccountOrProsepct:'v1/MeetingManagement/FilterColumnAccountOrProsepct',
     GetRelationShipLogFilterColumnCustomerContacts:'v1/MeetingManagement/FilterColumnCustomerContacts',
     GetRelationShipLogFilterColumnWiproAttendees:'v1/MeetingManagement/FilterColumnWiproAttendees',
     GetRelationShipLogFilterColumnLinkLeads:'v1/MeetingManagement/FilterColumnLinkLeads',
     GetRelationShipLogFilterColumnLinkOpportunities:'v1/MeetingManagement/FilterColumnLinkOpportunities',
     relationshipLogMeetingListDownload:'v1/MeetingManagement/DownloadReleationShipList'

};
export const contactConversationheader: any[] = [

    { id: 1, isFilter: false, name: 'Agenda', isFixed: true, order: 1, title: 'Meeting subject', selectName: "Meeting",SortId:0 },
    { id: 2, isFilter: false, name: 'MeetingType', isFixed: false, order: 2, title: ' Meeting type',SortId:14, displayType: 'capsFirstCase' },
    { id: 3, isFilter: false, name: 'AccountName', isFixed: false, order: 3, title: 'Account name',SortId:2 },
    { id: 5, isFilter: false, name: 'WiproAttendees', isFixed: false, order: 5, title: 'Wipro attendees', isModal: true,SortId:0 , displayType: 'name'},
    { id: 6, isFilter: false, name: 'DateCreated', isFixed: false, order: 6, title: 'Date created', isHideColumnSearch:true, SortId:3, displayType: 'date', dateFormat:'dd-MMM-yyyy'  },
    { id: 7, isFilter: false, name: 'Leadslinked', isFixed: false, order: 7, title: 'Linked leads', isModal: true,SortId:0, displayType: 'capsFirstCase' },
    { id: 8, isFilter: false, name: 'OppLinked', isFixed: false, order: 8, title: 'Linked opportunities ', isModal: true,SortId:0, displayType: 'capsFirstCase' },

]

@Injectable({
    providedIn: 'root'
})
export class ContactconversationService {
    cachedArray = [];
    ContactParentId: any;

    constructor(
        public ConversationService: ConversationService,
        public datepipe: DatePipe,
        public apiService: ApiService,
        ) {}

    getSingle(id: number): Observable<contactconversation> {
        return this.apiService.get(routes.contactconversation(id));
    }
    getParentHeaderData(): Observable<any[]> {
        return of(contactConversationheader);
    }

    pluckParticularKey(array, key) {
        return array.map(function (item) { return (item[key]) });
    }

    checkFilterListApiCall(data) {
        if (data.filterData.order.length > 0 || data.filterData.sortColumn != "") {
            return true;
        }
        else {
            return false
        }
    }

    downRelationshipMeetingList(req): Observable<any> {
        return this.apiService.post(routes.relationshipLogMeetingListDownload, req)
    }

    getRelationShipLogMeetingFilterList(body) {
        return this.apiService.post(routes.FilteredrealtionShipMeetingApi, body)
    }

    getFilterColumnName(body) {
        return this.apiService.post(routes.GetRelationShipLogFilterColumnName, body)
    }

    getColumnMeetingType(body) {
        return this.apiService.post(routes.GetRelationShipLogFilterColumnMeetingType, body)
    }

    getColumnAccountOrProsepct(body): Observable<any> {
        return this.apiService.post(routes.GetRelationShipLogFilterColumnAccountOrProsepct, body).pipe(
            map(res =>{if(!res.IsError){
                return {
                    ...res,
                    ResponseObject : res.ResponseObject.map(data =>{
                        return {
                            ...data,
                            ActivityGroup: {
                                Account: {
                                    SysGuid: data.ActivityGroup.Account.SysGuid,
                                    Name: data.ActivityGroup.Account.Name ? decodeURIComponent(data.ActivityGroup.Account.Name)  : "NA",
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
        return this.apiService.post(routes.GetRelationShipLogFilterColumnCustomerContacts, body)
    }

    getColumnWiproAttendees(body) {
        return this.apiService.post(routes.GetRelationShipLogFilterColumnWiproAttendees, body)
    }

    getColumnLinkLeads(body) {
        return this.apiService.post(routes.GetRelationShipLogFilterColumnLinkLeads, body)
    }

    getColumnLinkOpportunities(body) {
        return this.apiService.post(routes.GetRelationShipLogFilterColumnLinkOpportunities, body)
    }

        GetAppliedFilterData(data) {
            return {
              "ColumnSearchText":(data.filterData) ? data.filterData.columnSerachKey : '',
              "ActivityGroupGuids": [],
              'RequestedPageNumber': data.useFulldata.pageNo,
              "Name": (data.filterData) ?  this.pluckParticularKey(data.filterData.filterColumn['Agenda'], 'name') : [],
              "AccountGuids":(data.filterData) ? this.pluckParticularKey(data.filterData.filterColumn['AccountName'].filter(x => !x.isProspect), 'id'): [],
              "ProspectGuids":(data.filterData) ? this.pluckParticularKey(data.filterData.filterColumn['AccountName'].filter(x => x.isProspect), 'id'): [],
              "LeadGuids":(data.filterData) ? this.pluckParticularKey(data.filterData.filterColumn['Leadslinked'], 'id'): [],
              "DueDateList":[],
              "MeetingType":(data.filterData) ? this.pluckParticularKey(data.filterData.filterColumn['MeetingType'], 'id'): [],
              "CustomerContactGuids":[data.useFulldata.id],
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
              "SortBy":(data.filterData) ? this.pluckParticularKey(contactConversationheader.filter(x => x.name == data.filterData.sortColumn), 'SortId')[0]: [],
            }
          }

    getFilterSwitchListData(data): Observable<any> {
        switch (data.filterData.headerName) {
                    case 'Agenda':
                        return this.getRelationShipLogMeetingSubjectColumnFilterData(data)
                    case 'MeetingType':
                        return this.getRelationShipLogMeetingTypeColumnFilterData(data)
                    case 'AccountName':
                        return this.getRelationShipLogAccountNameColumnFilterData(data)
                    case 'WiproAttendees':
                        return this.getRelationShipLogWiproAttendeesFilterData(data)
                    case 'DateCreated':
                        return this.getRelationShipLogDateCreatedFilterData(data)
                    case 'Leadslinked':
                        return this.getRelationShipLogLeadslinkedFilterData(data)
                    case 'OppLinked':
                        return this.getRelationShipLogOppLinkedFilterData(data)
                    default:
                        return of([])
        }
    }

    getRelationShipLogMeetingSubjectColumnFilterData(data: any): Observable<any> {
        if (data) {
            let body = this.GetAppliedFilterData({ ...data})
            return this.getFilterColumnName(body).pipe(switchMap(res => {
                    return of((!res.IsError) ? { ...res, ResponseObject: this.filterRelationShipLogMeetingNameColumndata(res.ResponseObject) } : { ...res })
            }))
        }
    }

    getRelationShipLogMeetingTypeColumnFilterData(data: any): Observable<any> {
        let body = this.GetAppliedFilterData({ ...data})
        return this.getColumnMeetingType(body).pipe(switchMap(res => {
                return of((!res.IsError) ? { ...res, ResponseObject: this.filterRelationShipLogMeetingTypeColumndata(res.ResponseObject) } : { ...res })
        }))
    }

    getRelationShipLogAccountNameColumnFilterData(data: any): Observable<any> {
        let body = this.GetAppliedFilterData({ ...data})
        return this.getColumnAccountOrProsepct(body).pipe(switchMap(res => {
                return of((!res.IsError) ? { ...res, ResponseObject: this.filterRelationShipLogAccountColumndata(res.ResponseObject) } : { ...res })
        }))
    }

    getRelationShipLogWiproAttendeesFilterData(data: any): Observable<any> {
        let reqbody = this.GetAppliedFilterData({ ...data})
        return this.getColumnWiproAttendees(reqbody).pipe(switchMap(res => {
                return of((!res.IsError) ? { ...res, ResponseObject: this.filterRelationShipLogOwnerColumndata(res.ResponseObject) } : { ...res })
        }))
    }

    getRelationShipLogDateCreatedFilterData(data: any): Observable<any> {
        if (data) {
            let body = this.GetAppliedFilterData({ ...data})
            return this.getColumnLinkLeads(body).pipe(switchMap(res => {
                    return of((!res.IsError) ? { ...res, ResponseObject: this.filterRelationShipLogMeetingDateColumndata(res.ResponseObject)  } : { ...res })
            }))
        }
    }

    getRelationShipLogLeadslinkedFilterData(data: any): Observable<any> {
        let reqbody = this.GetAppliedFilterData({ ...data})
        return this.getColumnLinkLeads(reqbody).pipe(switchMap(res => {
                return of((!res.IsError) ? { ...res, ResponseObject : this.filterRelationShipLoglinkedLeadColumndata(res.ResponseObject)  } : { ...res })
        }))
    }

    getRelationShipLogOppLinkedFilterData(data: any): Observable<any> {
        let reqbody = this.GetAppliedFilterData({ ...data})
        return this.getColumnLinkOpportunities(reqbody).pipe(switchMap(res => {
                return of((!res.IsError) ? { ...res, ResponseObject: this.filterRelationShipLoglinkedOppColumndata(res.ResponseObject)  } : { ...res })
        }))
    }

    filterRelationShipLogMeetingNameColumndata(data) {
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

    filterRelationShipLogMeetingDateColumndata(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {

                        name: (x.MeetingDate)? this.datepipe.transform(x.MeetingDate, 'd-MMM-yyyy'):'',
                        meetingDate: (x.MeetingDate)? x.MeetingDate:'',
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

    filterRelationShipLogMeetingTypeColumndata(data) {
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

    filterRelationShipLogOwnerColumndata(data) {
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

    filterRelationShipLogAccountColumndata(data) {
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

    filterRelationShipLoglinkedLeadColumndata(data) {
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

    filterRelationShipLoglinkedOppColumndata(data) {
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
