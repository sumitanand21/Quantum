import { Injectable } from '@angular/core';
import { JsonApiService } from './json-api.service';
import { Observable, of } from 'rxjs';
import { contactcampaign } from '../models/contactcampaign.model';
import { ApiService } from './api.service';
import { DateModifier } from './date-modifier';
import { completedcampaignheader } from './campaign.service';
import { switchMap } from 'rxjs/operators';

const routes = {
    contactcampaigns: '/contactcampaign',
    contactcampaign: (id: number) => `/contactcampaign/${id}`,
    FilterList: 'v1/CampaignManagement/FilterList',

      //list Columnfilter api's
      getFilterListColumnName: 'v1/CampaignManagement/FilterListColumnName',
      getFilterListColumnCode: 'v1/CampaignManagement/FilterListColumnCode',
      getFilterListColumnOwner: 'v1/CampaignManagement/FilterListColumnOwner',
      getFilterListColumnStatus: 'v1/CampaignManagement/FilterListColumnStatus',
      getFilterListColumnStartDate: 'v1/CampaignManagement/FilterListColumnScheduleStart',
      getFilterListColumnEndDate: 'v1/CampaignManagement/FilterListColumnScheduleEnd',
};
export const contactCampaignheader: any[] = [
    { id: 1, isFilter:false, name: 'Name', isFixed: true, order: 1, title: 'Campaign name', className:'noLink' },
    { id: 2, isFilter:false, name: 'campaign', isFixed: false, order: 2, title: 'Campaign ID', displayType: 'upperCase' },
    { id: 3, isFilter:false, name: 'owner', isFixed: false, order: 3, title: 'Owner', displayType: 'name' },
    // { id: 4, isFilter:false, name: 'team', isFixed: false, order: 4, title: 'Owner Team', displayType: 'capsFirstCase' },
    { id: 4, isFilter:false, name: 'status', isFixed: false, order: 4, title: 'Status', isStatus : true, displayType: 'capsFirstCase' },
    // { id: 6, isFilter:false, name: 'origin', isFixed: false, order: 6, title: 'Origin', displayType: 'capsFirstCase' },
    { id: 5, isFilter:false, name: 'startdate', isFixed: false, order: 5, title: 'Start Date ', displayType: 'date' , dateFormat:'dd-MMM-yyyy' },
    { id: 6, isFilter:false, name: 'enddate', isFixed: false, order: 6, title: 'End Date ', displayType: 'date' , dateFormat:'dd-MMM-yyyy' },
]
@Injectable({
    providedIn: 'root'
})
export class ContactcampaignService {
    cachedArray = [];
    constructor(
        private jsonApiService: JsonApiService,
        private apiService: ApiService) { }
    getAll(): Observable<contactcampaign[]> {
        return this.apiService.get(routes.contactcampaigns);
    }
    getSingle(id: number): Observable<contactcampaign> {
        return this.apiService.get(routes.contactcampaign(id));
    }
    getParentHeaderData(): Observable<any[]> {
        return of(contactCampaignheader);
    }

    //-------Filter start ---------

    getFilterList(body) {
        return this.apiService.post(routes.FilterList, body)
    }
    GetFilterListColumnName(value: any): Observable<any> {
        return this.apiService.post(routes.getFilterListColumnName, value);
    }
    GetFilterListColumnCode(value: any): Observable<any> {
        return this.apiService.post(routes.getFilterListColumnCode, value);
    }
    GetFilterListColumnOwner(value: any): Observable<any> {
        return this.apiService.post(routes.getFilterListColumnOwner, value);
    }
    GetFilterListColumnStatus(value: any): Observable<any> {
        return this.apiService.post(routes.getFilterListColumnStatus, value);
    }

    getNameColumnFilterData(data) {
        let reqBody = this.GetAppliedFilterData({ ...data });
        return this.GetFilterListColumnName(reqBody).pipe(switchMap(res => {
            return of((!res.IsError) ? { ...res, ResponseObject: this.filterNameColumndata(res.ResponseObject) } : { ...res })
        }))
    }

    getCampaignIDColumnFilterData(data) {
        let reqBody = this.GetAppliedFilterData({ ...data });
        return this.GetFilterListColumnCode(reqBody).pipe(switchMap(res => {
            return of((!res.IsError) ? { ...res, ResponseObject: this.filterCampaignIDColumndata(res.ResponseObject) } : { ...res })
        }))
    }

    getOwnerFilterData(data): Observable<any> {
        let reqBody = this.GetAppliedFilterData({ ...data });
        return this.GetFilterListColumnOwner(reqBody).pipe(switchMap(res => {
            return of((!res.IsError) ? { ...res, ResponseObject: this.filterOwnerColumndata(res.ResponseObject) } : { ...res })
        }))
    }

    GetCampaignStatus(data) {
        let reqBody = this.GetAppliedFilterData({ ...data });
        return this.GetFilterListColumnStatus(reqBody).pipe(switchMap(res => {
            return of((!res.IsError) ? { ...res, ResponseObject: this.filterCampaignStatus(res.ResponseObject) } : { ...res })
        }))
    }

    filterNameColumndata(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        id: x.Id,
                        name: x.Name,
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

    filterCampaignIDColumndata(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        id: x.Id,
                        name: x.Name,
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
                        id: x.Owner.ownerId,
                        name: x.Owner.FullName,
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

    filterCampaignStatus(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        id: x.StatusCode,
                        name: x.CampaignStatus,
                        isDatafiltered: false,
                    }
                })
            } else {
                return []
            }
        } else {
            return []
        }
    }

    statusFilter(data) {
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


    getFilterCampaignSwitchListData(data) {
        debugger
        switch (data.filterData.headerName) {
            case 'Name': return this.getNameColumnFilterData(data)
            case 'campaign': return this.getCampaignIDColumnFilterData(data)
            case 'owner': return this.getOwnerFilterData(data)
            // case 'startDate': return this.GetStartDateColumnFilterSearch(data)
            // case 'endDate': return this.GetEndDateColumnFilterSearch(data)
            case 'status': return this.GetCampaignStatus(data)
            default:
                return of([])
        }
    }

    GetAppliedFilterData(data) {
        debugger
        return {
            "ColumnSearchText": (data.filterData) ? (data.filterData.columnSerachKey) ? data.filterData.columnSerachKey : "" : "",
            "PageSize":  data.useFulldata.pageSize,
            "RequestedPageNumber": data.useFulldata.pageNo,
            "SearchText": (data.filterData) ? (data.filterData.globalSearch) ? data.filterData.globalSearch : "" : "",
            "IsDesc": (data.filterData) ? (data.filterData.sortColumn != '') ? !data.filterData.sortOrder : false : false,
            "Name": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['Name'], 'name') : [] : [],
            "OwnerGuids":(data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['owner'], 'id') : [] : [],
            // "CampaignGuids": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['campaign'], 'name') : [] : [],
            "OdatanextLink": "",
            "StatusIds": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['status'], 'id') : [] : [],
            "FromStartDate": [],
            "ToEndDate": [],
            "OrderGuids": [],
            "CustomerContactGuids":[data.useFulldata.contactParentId],
            "SortBy": (data.filterData) ? (data.filterData.sortColumn) ?  this.pluckParticularKey(completedcampaignheader.filter(x => x.name == data.filterData.sortColumn), 'SortId')[0] : [] : [],
            "CampaignType": data.useFulldata.CampaignType,
            "StartDate":(data.filterData) ? (data.filterData.filterColumn['startdate'][0].filterStartDate!=='') ? this.dateModifier(data.filterData.filterColumn['startdate'][0].filterStartDate):"":"",
            "EndDate":(data.filterData) ? (data.filterData.filterColumn['startdate'][0].filterEndDate!=='') ? this.dateModifier(data.filterData.filterColumn['startdate'][0].filterEndDate):"":"",
            "CMPStartDate":(data.filterData) ? (data.filterData.filterColumn['enddate'][0].filterStartDate!=='') ? this.dateModifier(data.filterData.filterColumn['enddate'][0].filterStartDate):"":"",
            "CMPEndDate":(data.filterData) ? (data.filterData.filterColumn['enddate'][0].filterEndDate!=='') ? this.dateModifier(data.filterData.filterColumn['enddate'][0].filterEndDate):"":"",
        }
    }
    pluckParticularKey(array, key) {
        return array.map(function (item) { return (item[key]) });
    }
    dateModifier(dateConvert) {
        let dataModifier = new DateModifier();
        return dataModifier.modifier(dateConvert)
     }






}
