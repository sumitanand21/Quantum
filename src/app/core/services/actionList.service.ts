import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { JsonApiService } from './json-api.service';
import { ApiService } from './api.service';
import { ActionList, CommentList, OptionList } from '@app/core/models/actionList.model';
import { UpdateAction, GetUpdateAction } from '../interfaces/get-update-action';
import { GetCloseAction } from '../interfaces/get-close-action';
import { GetUpdateActionDetails } from '../interfaces/get-update-action-details';
import { GetSearchAction } from '../interfaces/get-search-action';
import { OfflineService } from './offline.services'
import { GetCommentsOnAction } from '../interfaces/get-comments-action';
import { GetDelinkComments } from '../interfaces/get-delink-comments';
import { switchMap } from 'rxjs/operators';
import { MasterApiService } from './master-api.service';
import { DatePipe } from '@angular/common';
import { DataCommunicationService } from './global.service';
import { DateModifier } from './date-modifier';

const routes = {
    actionList: '/ExpandActionList',
    user: (id: number) => `/ExpandActionList/${id}`,
    getOwnerSystemUserId: 'v1/AccountManagement/GetOwnerSystemUserId',
    getActionDetails: 'v1/ActionManagement/GetActionDetails',
    updateAction: '/v1/MeetingManagement/Action_Comment',
    closeAction: 'v1/ActionManagement/CloseActionsMultiple',
    updateActionDetails: 'v1/ActionManagement/UpdateAction',
    searchAction: 'v1/ActionManagement/SearchAction',
    getCommentsOnAction: 'v1/ActionManagement/GetCommentsOnConversationAction',
    delinkCommentOnAction: 'Conversation/DelinkCommentOnAction',
    delinkActionOwner: 'v1/MeetingManagement/DelinkActionOwner',
    searchMeetingType: 'v1/MeetingManagement/SearchBasedOnParentActivity',
    DelinkMeetingAction: 'v1/MeetingManagement/DelinkMeetingFromAction',
    FilteredApi: 'v1/ActionManagement/FilterList',
    GetActionNames: 'v1/ActionManagement/SearchActionName',
    ActionOwnerValidation : 'v1/AccountManagement/CheckAccountAccessOverUser',

    //list columnfilterapi's
    GetFilterListColumnName: 'v1/ActionManagement/FilterListColumnName',
    GetFilterListColumnActionOwners: 'v1/ActionManagement/FilterListColumnActionOwners',
    GetFilterListColumnActionPriorityCode: 'v1/ActionManagement/FilterListColumnActionPriorityCode',
    GetFilterListColumnActionStatusCode: 'v1/ActionManagement/FilterListColumnActionStatusCode'
};
export const ExpandHeader: any[] = [
    { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Name', routerLink: '/activites/actiondetails', selectName: "Action", SortId: 0,  },
    { id: 2, isFilter: false, name: 'Owner', isFixed: false, order: 2, title: 'Action owners', isModal: true, SortId: 6 },
    { id: 3, isFilter: false, name: 'Duedate', isFixed: false, order: 3, title: 'Due date', isHideColumnSearch: true, SortId: 15, displayType: 'date', dateFormat: 'dd-MMM-yyyy' },
    { id: 4, isFilter: false, name: 'Priority', isFixed: false, order: 4, title: 'Priority', isStatus: true, SortId: 16 },
    { id: 5, isFilter: false, name: 'Status', isFixed: false, order: 5, title: 'Status', SortId: 7 },
];

export const ActionOwnerAdvnHeader: any[] = [
    { name: 'Name', title: 'Name' },
    { name: 'Email', title: 'Email id' }
]

export const ActionHeaders = {
    'actionOwneSearch': ActionOwnerAdvnHeader,
}

export const ActionAdvnNames = {
    'actionOwneSearch': { name: 'Action Owner', isCheckbox: true, isAccount: false },
}

@Injectable({
    providedIn: 'root'
})
export class actionListService {
    selArray = [];
    cachedArray = [];
    details: any;
    constructor(
        private jsonApiService: JsonApiService,
        private masterApi: MasterApiService,
        private apiService: ApiService,
        private offlineServices: OfflineService,
        public datepipe: DatePipe) { }
        public readonly ActionConvChacheType = {
        Table: "Table",
        Details: "Details",
        MeetingTypes: "MeetingTypes"
    }
    getSingle(id: number): Observable<ActionList> {
        return this.apiService.get(routes.user(id));
    }
    getParentHeaderData(): Observable<any[]> {
        return of(ExpandHeader);
    }
    getOwnerSystemUserId(searchText, requestBody?): Observable<any> {
        let body = {
            "SearchText": searchText,
            "PageSize": 10,
            "OdatanextLink": "",
            "RequestedPageNumber": 1
        }
        return this.apiService.post(routes.getOwnerSystemUserId, (requestBody) ? requestBody : body);
    }
    getActionOwnerValidation(actionguid, userguid): Observable<any>{
        let body = {"AccountGuid":actionguid, "UserGuid":userguid}
        return this.apiService.post(routes.ActionOwnerValidation, body);

    }
    getActionDetails(object): Observable<any> {
        let body = { "ActionId": object }
        return this.apiService.post(routes.getActionDetails, body);
    }
    getUpdateAction(object: {}): Observable<GetUpdateAction> {
        return this.apiService.post(routes.updateAction, object);
    }
    getCloseAction(object: any): Observable<GetCloseAction> {
        return this.apiService.post(routes.closeAction, object);
    }
    updateActionDetails(object: {}): Observable<GetUpdateActionDetails> {
        return this.apiService.post(routes.updateActionDetails, object);
    }
    searchAction(searchText, id: any): Observable<any> {
        let body = {
            "PageSize": 10,
            "SearchText": searchText,
            "Guid": id,
            "OdatanextLink": ""
        }
        return this.apiService.post(routes.searchAction, body);
    }

    getActionNames(convGuid, searchText, body?): Observable<any> {
        let reqbody = {
            "Guid": 1,
            "PageSize": 10,
            "Conversation_Guid": convGuid,
            "RequestedPageNumber": 1,
            "OdatanextLink": "",
            "SearchText": searchText
        }
        return this.apiService.post(routes.GetActionNames, (body) ? body : reqbody)
    }
    getCommentsOnAction(object: {}): Observable<GetCommentsOnAction> {
        let body = { "ActivityId": object, }
        return this.apiService.post(routes.getCommentsOnAction, body);
    }
    delinkCommentOnAction(object: {}): Observable<GetDelinkComments> {
        let body = { "Id": object, }
        return this.apiService.post(routes.delinkCommentOnAction, body);
    }
    delinkActionOwner(object: {}): Observable<any> {
        return this.apiService.post(routes.delinkActionOwner, object);
    }
    getMeetingType(id: string, searchText: any): Observable<any> {
        let body = {
            "Guid": id,
            "SearchText": searchText
        }
        return this.apiService.post(routes.searchMeetingType, body);
    }
    async getCachedActionConversationDetails(requestdata) {
        const ConvDetailsData = await this.offlineServices.getActConverastionDetailsData(requestdata)
        if (ConvDetailsData.length > 0) {
            return ConvDetailsData[0]
        } else {
            return null
        }
    }

    async getCacheActivityActionListById(id: any) {

        const ActionListData = await this.offlineServices.getActivityActionById(id)

        if (ActionListData.length > 0) {
            console.log('ActionListData', ActionListData)
            return ActionListData[0]
        } else {
            return null
        }

    }

    delinkMeetingAction(activityId: any, actionId: any) {
        var body = {
            "ActivityId": activityId,
            "ActionId": actionId
        }
        return this.apiService.post(routes.DelinkMeetingAction, body)
    }

    // meeting details save
    get meetingDetailsInfo() {
        return this.details
    }

    set meetingDetailsInfo(val) {
        this.details = val
    }


    //handels pagination,search,filterlookup
    getLookUpFilterData(data): Observable<any> {

        debugger
        switch (data.controlName) {
            case 'actionOwneSearch':
                return this.getActionOwnerdata(data)
            default:
                return of([])
        }

    }

    getActionOwnerdata(data): Observable<any> {
        if (data.isService) {

            let requestparam = {
                "SearchText": data.useFullData.searchVal,
                "PageSize": data.useFullData.recordCount,
                "OdatanextLink": data.useFullData.OdatanextLink,
                "RequestedPageNumber": data.useFullData.pageNo
            }

            return this.getOwnerSystemUserId('', requestparam).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnActionowner(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterAdvnActionowner(data.data))
        }
    }

    filterAdvnActionowner(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        ...x,
                        'Name': (x.FullName) ? x.FullName : 'NA',
                        'Email': (x.Email) ? x.Email : 'NA',
                        "Id": (x.ownerId) ? x.ownerId : ''
                    }
                })
            } else {
                return of([])
            }
        } else {
            return of([])
        }

    }

    // ----------------------------------------------------------Table Filter Logic----------------------------------------------------

    //   Name: this.getNameFilterData(),
    //   Owner: {},
    //   Duedate: {},
    //   Priority: {},
    //   Status: {},

    getFilterListColumnName(body): Observable<any> {
        return this.apiService.post(routes.GetFilterListColumnName, body);
    }

    getFilterColumnActionOwners(body): Observable<any> {
        return this.apiService.post(routes.GetFilterListColumnActionOwners, body);
    }

    getFilterColumnActionPriorityCode(body): Observable<any> {
        return this.apiService.post(routes.GetFilterListColumnActionPriorityCode, body);
    }

    getFilterColumnActionStatusCode(body): Observable<any> {
        return this.apiService.post(routes.GetFilterListColumnActionStatusCode, body);
    }

    pluckParticularKey(array, key) {
        return array.map(function (item) { return (item[key]) });
    }

    GetAppliedFilterData(data) {
        return {
          "ColumnSearchText":(data.filterData) ? data.filterData.columnSerachKey : '',
          "ActivityGroupGuids": [data.useFulldata.Conversation_Guid],
          "Name":(data.filterData) ?  this.pluckParticularKey(data.filterData.filterColumn['Name'], 'name') : [],
          "ProirityCodes":(data.filterData) ?  this.pluckParticularKey(data.filterData.filterColumn['Priority'], 'id') : [],
          "StatusIds":(data.filterData) ?  this.pluckParticularKey(data.filterData.filterColumn['Status'], 'id') : [],
          "DueDateList": [],
          "OwnerGuids": (data.filterData) ? this.pluckParticularKey(data.filterData.filterColumn['Owner'], 'id') : [],
          "SearchText":(data.filterData) ?  data.filterData.globalSearch : '',
          "PageSize": data.useFulldata.pageSize,
          "OdatanextLink": "",
          "RequestedPageNumber": data.useFulldata.pageNo,
          "IsDesc": true,
          "StartDate": (data.filterData) ? (data.filterData.filterColumn['Duedate'][0].filterStartDate!=='') ? this.dateModifier(data.filterData.filterColumn['Duedate'][0].filterStartDate):"":"",
          "EndDate":(data.filterData) ? (data.filterData.filterColumn['Duedate'][0].filterEndDate!=='') ? this.dateModifier(data.filterData.filterColumn['Duedate'][0].filterEndDate):"":"",
          "SortBy":(data.filterData) ?  this.pluckParticularKey(ExpandHeader.filter(x => x.name == data.filterData.sortColumn), 'SortId')[0] : []
        }
      }

      dateModifier(dateConvert) {
        let dataModifier = new DateModifier();
        return dataModifier.modifier(dateConvert)
     }

    getActionListConfigData(data): Observable<any> {

        debugger
        switch (data.filterData.headerName) {
            case 'Name':
                return this.getNameColumnFilterData(data)
            case 'Owner':
                return this.getOwnerColumnFilterData(data)
            // case 'Duedate':
            //     return this.getDuedateColumnFilterData(data)
            case 'Priority':
                return this.getPriorityColumnFilterData(data)
            case 'Status':
                return this.getStatusColumnFilterData(data)
            default:
                return of([])
        }

    }

    getNameColumnFilterData(data): Observable<any> {
        let reqbody = this.GetAppliedFilterData({ ...data})
        return this.getFilterListColumnName(reqbody).pipe(switchMap(res => {
            debugger
            return of((!res.IsError) ? { ...res, ResponseObject: this.filterNameColumndata(res.ResponseObject) } : { ...res })
        }))
    }

    getStatusColumnFilterData(data: any): Observable<any> {
        let reqbody = this.GetAppliedFilterData({ ...data})
        return this.getFilterColumnActionStatusCode(reqbody).pipe(switchMap(res => {
            console.log(res)
            return of((!res.IsError) ? { ...res, ResponseObject: this.filterStatusColumndata(res.ResponseObject) } : { ...res })

        }))
    }
    getOwnerColumnFilterData(data: any): Observable<any> {
        let reqbody = this.GetAppliedFilterData({ ...data})
        return this.getFilterColumnActionOwners(reqbody).pipe(switchMap(res => {
            console.log(res)
            return of((!res.IsError) ? { ...res, ResponseObject: this.filterActionOwnerdata(res.ResponseObject) } : { ...res })
        }))
    }

    getPriorityColumnFilterData(data: any): Observable<any> {
        let reqbody = this.GetAppliedFilterData({ ...data})
        return this.getFilterColumnActionPriorityCode(reqbody).pipe(switchMap(res => {
            console.log(res)
            return of((!res.IsError) ? { ...res, ResponseObject: this.filterPriorityColumndata(res.ResponseObject) } : { ...res })
        }))
    }

    getAppliedFilterActionData(body) {
        return this.apiService.post(routes.FilteredApi, body)
    }

    // getDuedateColumnFilterData(data: any): Observable<any> {
    //     let reqbody = {
    //         "Guid": 1,
    //         "Conversation_Guid": data.useFulldata.parentId,
    //         "SearchText": data.useFulldata.searchVal,
    //         "PageSize": data.useFulldata.pageSize,
    //         "OdatanextLink": data.useFulldata.nextLink,
    //         "RequestedPageNumber": data.useFulldata.pageNo
    //     }

    //     return this.getActionNames('', '', reqbody).pipe(switchMap(res => {
    //         debugger
    //         return of((!res.IsError) ? { ...res, ResponseObject: this.filterDueDateColumndata(res.ResponseObject) } : { ...res })
    //     }))
    // }

    filterNameColumndata(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {

                        id: x.ActionId,
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

    // filterDueDateColumndata(data) {
    //     if (data) {
    //         if (data.length > 0) {
    //             return data.map(x => {
    //                 return {

    //                     id: x.ActionId,
    //                     name: (x.DueDate) ? this.datepipe.transform(x.DueDate) : '',
    //                     dueDate: (x.DueDate) ? x.DueDate : '',
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


    filterActionOwnerdata(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {

                        id: (x.Owner.SysGuid) ? x.Owner.SysGuid : '',
                        name: (x.Owner.FName) ? x.Owner.FName : '',
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

    filterPriorityColumndata(data) {

        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {

                        id: ((x.PriorityCode) || x.PriorityCode == 0) ? x.PriorityCode  : '',
                        name: (x.Name) ? x.Name : '',
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

    filterStatusColumndata(data) {

        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {

                        id: (x.StatusCode) ? x.StatusCode : '',
                        name: (x.Name) ? x.Name : '',
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