import { Injectable } from '@angular/core';
import { Observable, of, Subject, from as fromPromise } from 'rxjs';
import { campaign } from '../models/campaign.model';
import { ApiService } from './api.service';
import { map } from 'rxjs/internal/operators/map';
import { DatePipe } from '@angular/common';
import { OfflineService } from './offline.services'
import { switchMap, catchError } from 'rxjs/operators';
import { DateModifier } from './date-modifier';
const routes = {
    campaigns: '/campaign',
    campaignsListApi: 'v1/CampaignMAnagement/Get',
    CompletedCampaign: 'v1/CampaignManagement/Completed',
    activeCampaign: 'v1/CampaignManagement/ActiveCampaign',
    MyActiveCampaign: 'v1/CampaignManagement/MyActiveCampaign',
    SearchIndustryByname: 'v1/CampaignManagement/IndustryByName',
    SearchInterestByname: 'v1/CampaignManagement/ProductIntrestByName',
    SearchSBUByname: 'v1/CampaignManagement/SBUByName',
    SearchVerticalByname: 'v1/CampaignManagement/VerticalByName',
    requestCampaign: 'v1/CampaignManagement/Create_V1',
    searchAccountCompany: 'v1/LeadManagement/AccountnProspect_V1',
    getSubVerticalIdByName: 'v1/AccountManagement/SubVerticalName',
    searchSicIndustry: 'v1/SearchManagement/SearchSicIndustry',
    campaignSearch: 'v1/CampaignManagement/SearchByName',
    campaign: (id: number) => `/campaign/${id}`,
    getCampaignDetails: 'v1/CampaignManagement/Details',
    updateCampaign: 'v1/CampaignManagement/Update_V1',
    deLinkCampaignInterest: 'v1/CampaignManagement/DelinkIntrest',
    deLinkCampaignIndustry: 'v1/CampaignManagement/DelinkIndustry',
    deLinkCampaignFunction: 'v1/CampaignManagement/Function',
    SearchFunction: 'v1/CampaignManagement/SearchFunction',
    deLinkCampaignAccount: 'v1/CampaignManagement/DelinkAccount',
    GetSBUandVerticalfromAccount: 'v1/CampaignManagement/GetSBUandVerticalfromAccount',
    GetVerticalbySBUID: 'v1/CampaignManagement/GetVerticalbySBUID',
    ProductIntrestByName: 'v1/CampaignManagement/ProductIntrestByName',
    VerticalBasedOnSBU: 'v1/CampaignManagement/VerticalBasedOnSBU',
    SBUByAccountOrProspect: 'v1/CampaignManagement/SBUByAccountOrProspect',
    downloadCampaignLists: 'v1/CampaignManagement/DownloadCampaignList',
    ValidateAccount: 'v1/AccountManagement/ValidAccount',
    SearchFilterByName: 'v1/CampaignManagement/SearchFilterByName',
    SearchFilterByCode: 'v1/CampaignManagement/SearchFilterByCode',
    FilterList: 'v1/CampaignManagement/FilterList',
    SearchOwner: 'v1/LeadManagement/SearchOwner',
    AutoPopulateIndustryByAccount: 'v1/CampaignManagement/AutoPopulateIndustryByAccount',
    GetCampaignStatus: 'v1/MasterManagement/GetCampaignStatus',


    //list Columnfilter api's
    getFilterListColumnName: 'v1/CampaignManagement/FilterListColumnName',
    getFilterListColumnCode: 'v1/CampaignManagement/FilterListColumnCode',
    getFilterListColumnOwner: 'v1/CampaignManagement/FilterListColumnOwner',
    getFilterListColumnStatus: 'v1/CampaignManagement/FilterListColumnStatus',
    getFilterListColumnStartDate: 'v1/CampaignManagement/FilterListColumnScheduleStart',
    getFilterListColumnEndDate: 'v1/CampaignManagement/FilterListColumnScheduleEnd'

};
export const campaignheader: any[] = [
    { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Campaign name', selectName: "Campaign", SortId: 0,  },
    { id: 2, isFilter: false, name: 'campaign', isFixed: false, order: 2, title: 'Campaign ID', SortId: 17, displayType: 'upperCase' },
    { id: 3, isFilter: false, name: 'owner', isFixed: false, order: 3, title: 'Owner', SortId: 6 },
    // { id: 4, isFilter: false, name: 'team', isFixed: false, order: 4, title: 'Owner team' },
    { id: 4, isFilter: false, name: 'status', isFixed: false, order: 5, title: 'Status', isStatus: true, SortId: 7 },
    // { id: 6, isFilter: false, name: 'origin', isFixed: false, order: 6, title: 'Origin' },
    { id: 5, isFilter: false, name: 'startDate', isFixed: false, order: 7, title: 'Scheduled start date', isHideColumnSearch: true, SortId: 18, displayType: 'date', dateFormat: 'dd-MMM-yyyy' },
    { id: 6, isFilter: false, name: 'endDate', isFixed: false, order: 8, title: ' End date', isHideColumnSearch: true, SortId: 19, displayType: 'date', dateFormat: 'dd-MMM-yyyy' },
]
export const activecampaignheader: any[] = [
    { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Campaign name', selectName: "Active campaign", SortId: 0,  },
    { id: 2, isFilter: false, name: 'campaign', isFixed: false, order: 2, title: 'Campaign ID', SortId: 17, displayType: 'upperCase' },
    { id: 3, isFilter: false, name: 'owner', isFixed: false, order: 3, title: 'Owner', SortId: 6 },
    // { id: 4, isFilter: false, name: 'team', isFixed: false, order: 4, title: 'Owner team' },
    { id: 4, isFilter: false, name: 'status', isFixed: false, order: 4, title: 'Status', isStatus: true, SortId: 7 },
    // { id: 6, isFilter: false, name: 'origin', isFixed: false, order: 6, title: 'Origin' },
    { id: 5, isFilter: false, name: 'startDate', isFixed: false, order: 5, title: 'Scheduled start date', isHideColumnSearch: true, SortId: 18, displayType: 'date', dateFormat: 'dd-MMM-yyyy' },
    { id: 6, isFilter: false, name: 'endDate', isFixed: false, order: 6, title: ' End date', isHideColumnSearch: true, SortId: 19, displayType: 'date', dateFormat: 'dd-MMM-yyyy' },
]
export const completedcampaignheader: any[] = [
    { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Campaign name', selectName: "Completed campaign", SortId: 0,  },
    { id: 2, isFilter: false, name: 'campaign', isFixed: false, order: 2, title: 'Campaign ID', SortId: 17, displayType: 'upperCase' },
    { id: 3, isFilter: false, name: 'owner', isFixed: false, order: 3, title: 'Owner', SortId: 6 },
    // { id: 4, isFilter: false, name: 'team', isFixed: false, order: 4, title: 'Owner team' },
    { id: 4, isFilter: false, name: 'status', isFixed: false, order: 4, title: 'Status', isStatus: true, SortId: 7 },
    // { id: 6, isFilter: false, name: 'origin', isFixed: false, order: 6, title: 'Origin' },
    { id: 5, isFilter: false, name: 'startDate', isFixed: false, order: 5, title: 'Scheduled start date', isHideColumnSearch: true, SortId: 18, displayType: 'date', dateFormat: 'dd-MMM-yyyy' },
    { id: 6, isFilter: false, name: 'endDate', isFixed: false, order: 6, title: ' End date', isHideColumnSearch: true, SortId: 19, displayType: 'date', dateFormat: 'dd-MMM-yyyy' },
]
export const myactivecampaignheader: any[] = [
    { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Campaign name', selectName: "Completed campaign", },
    { id: 2, isFilter: false, name: 'campaign', isFixed: false, order: 2, title: 'Campaign ID', displayType: 'UpperCase' },
    { id: 3, isFilter: false, name: 'owner', isFixed: false, order: 3, title: 'Owner' },
    // { id: 4, isFilter: false, name: 'team', isFixed: false, order: 4, title: 'Owner team' },
    { id: 4, isFilter: false, name: 'status', isFixed: false, order: 4, title: 'Status', isStatus: true},
    // { id: 6, isFilter: false, name: 'origin', isFixed: false, order: 6, title: 'Origin' },
    { id: 5, isFilter: false, name: 'startDate', isFixed: false, order: 5, title: 'Scheduled start date', isHideColumnSearch: true, displayType: 'date', dateFormat: 'dd-MMM-yyyy' },
    { id: 6, isFilter: false, name: 'endDate', isFixed: false, order: 6, title: ' End date', isHideColumnSearch: true, displayType: 'date', dateFormat: 'dd-MMM-yyyy' },
]

export const CampaignAccount: any[] = [
    { name: 'Name', title: 'Name' },
    { name: 'Ownername', title: 'Account Owner' },
    { name: 'AccType', title: 'Account Type' },
    { name : "Geo", title: 'Geo'},
    { name: "Region", title: "Region"},
    { name: "AccId", title: 'Account Number' },
]

export const DnBAccountHeader: any[] = [

    { name: 'Name', title: 'Name' },
    { name: "Duns", title: 'Duns Id' },
    { name: 'Region', title: 'Region' },
    { name: 'Industry', title: 'Industry' }
]


export const CampaignHeaders = { 'AccountSearch': CampaignAccount }

export const CampaignAdvNames = {
    'AccountSearch': { name: 'Account/Company name', isCheckbox: false, isAccount: true }
}

export const CampaignNav = {
    1: '/campaign/AllCampaigns',
    2: '/campaign/ActiveCampaigns',
    3: 'campaign/CompletedCampaigns',
    L1:'/leads/createlead',
    L2:'/leads/leadDetails'
}

@Injectable({
    providedIn: 'root'
})
export class CampaignService {
    cachedArray = [];
    Name: any;
    private subject = new Subject<{ name: string }>();
    private campaignTabChanges = new Subject<{ tabChange: boolean }>();
    public readonly CampaignChacheType = { Table: "Table", Details: "Details" }
    public readonly CampaignTableIdentify = {
        campaigns: 1,
        activecampaigns: 2,
        completedcampaigns: 3,
        myActiveCampaign: 4
    }
    constructor(
        private apiService: ApiService, private datepipe: DatePipe,
        private offlineServices: OfflineService
    ) { }
    AllCampaignpageNumber: any;
    AllCampaignpageSize: any;
    downloadCampaignLists(reqbody) {
        return this.apiService.post(routes.downloadCampaignLists, reqbody)
    }
    setAllCampaignpageNumber(pageNo: any) {
        this.AllCampaignpageNumber = pageNo;
    }
    getAllCampaignpageNumber() {
        return this.AllCampaignpageNumber
    }
    setAllCampaignpageSize(pageSize: any) {
        this.AllCampaignpageSize = pageSize;
    }
    getAllCampaignpageSize() {
        return this.AllCampaignpageSize
    }
    // Getting the config data 
    configData = []
    set sendConfigData(value) {
        this.configData = value;
    }
    get sendConfigData() {
        return this.configData
    }
    SearchFunction(Reqbody) {
        var body = {
            "SearchText": Reqbody,
            "PageSize": 10,
            "OdatanextLink": '',
            "RequestedPageNumber": 1
        }
        return this.apiService.post(routes.SearchFunction, body)
    }
    setCampaignNameForChange(name: string) {
        this.subject.next({ name: name });
    }
    clearCampaignNameForChange() {
        this.subject.next();
    }
    getCampaignNameForChange(): Observable<any> {
        return this.subject.asObservable();
    }
    setCampaignTabChanges(tabChange: boolean) {
        this.campaignTabChanges.next({ tabChange: tabChange });
    }
    clearCampaignTabChanges() {
        this.campaignTabChanges.next();
    }
    getCampaignTabChanges(): Observable<any> {
        return this.campaignTabChanges.asObservable();
    }
    getAll(): Observable<campaign[]> {
        return this.apiService.get(routes.campaigns);
    }
    getSingle(id: number): Observable<campaign> {
        return this.apiService.get(routes.campaign(id));
    }
    getParentHeaderData(): Observable<any[]> {
        return of(campaignheader);
    }
    getactiveCampaignHeaderData(): Observable<any[]> {
        return of(activecampaignheader);
    }
    getCompletedCampaigntHeaderData(): Observable<any[]> {
        return of(completedcampaignheader);
    }
    getmyactiveCampaigntHeaderData(): Observable<any[]> {
        return of(myactivecampaignheader);
    }
    set clickedconversationName(id) {
        this.Name = id
    }
    get clickedconversationName() {
        return this.Name
    }
    // campaignList
    getCampaignList(): Observable<any> {
        return this.apiService.post(routes.campaignsListApi)
            .pipe(
                map(campaignList => {
                    return {
                        campaigns: campaignList.ResponseObject.map(campaign => {
                            return {
                                id: campaign.Id,
                                Name: campaign.Name,
                                campaign: campaign.Code,
                                owner: campaign.Owner.FullName,
                                team: campaign.OwnerTeam,
                                status: campaign.CampaignStatus,
                                origin: campaign.Function.Name || "NA",
                                startDate: this.datepipe.transform(campaign.StartDate, 'd-MMM-y') || "NA",
                                endDate: this.datepipe.transform(campaign.EndDate, 'd-MMM-y') || "NA",
                            };
                        }),
                    };
                })
            )
    }
    //get AllCampaign 
    getALLCampaignList(ReqBody: AllCapignReq): Observable<any> {
        return this.apiService.post(routes.campaignsListApi, ReqBody)
    }
    AutoPopulateIndustryByAccount(Guid) {
        var ReqBody = {
            'Guid': Guid
        }
        return this.apiService.post(routes.AutoPopulateIndustryByAccount, ReqBody)
    }
    //get Active Campaign
    // getActiveCampaignList(ReqBody: ActiveCapignReq): Observable<any> {
    //     return this.apiService.post(routes.activeCampaign, ReqBody)
    // }
    getActiveCampaignList(ReqBody: ActiveCapignReq): Observable<any> {
        return this.apiService.post(routes.MyActiveCampaign, ReqBody)
    }
    //get completed Campaign
    getCompletedCampaignList(ReqBody: CompletedCapignReq): Observable<any> {
        return this.apiService.post(routes.CompletedCampaign, ReqBody)
    }
    // campaign search api binding
    campaignSearch(searchText, searchType, pageSize: number): Observable<any> {
        let search = {
            "SearchText": searchText,
            "SearchType": searchType,
            "PageSize": pageSize,
            "OdatanextLink": '',
            "RequestedPageNumber": 1
        }
        return this.apiService.post(routes.campaignSearch, search)
    }
    async getCachedAllCampaign() {
        const TablePageData = await this.offlineServices.getAllCampaignDetailsData()
        console.log("service ginthe quetry data")
        console.log(TablePageData)
        if (TablePageData.length > 0) {
            return TablePageData[0]
        } else {
            console.log("else condinti")
            return null
        }
    }
    async getCachedActiveCampaign() {
        const TablePageData = await this.offlineServices.getAllActiveCampaignDetailsData()
        console.log("service ginthe quetry data")
        console.log(TablePageData)
        if (TablePageData.length > 0) {
            return TablePageData[0]
        } else {
            console.log("else condinti")
            return null
        }
    }
    async getCachedCompletedCampaign() {
        const TablePageData = await this.offlineServices.getAllCompletedCampaignDetailsData()
        console.log("service ginthe quetry data")
        console.log(TablePageData)
        if (TablePageData.length > 0) {
            return TablePageData[0]
        } else {
            console.log("else condinti")
            return null
        }
    }
    getCampaignDetails(id: any): Observable<any> {
        var body = { "Id": id }
        return this.apiService.post(routes.getCampaignDetails, body);
    }
    // end getCampaign Details
    // update Campaign
    updateCampaign(value: any): Observable<any> {
        return this.apiService.post(routes.updateCampaign, value);
    }
    // update Campaign
    /** Search Industry Name*/
    getSearchIndustryByname(body): Observable<any> {
        var bodys = { "SearchText": body }
        return this.apiService.post(routes.SearchIndustryByname, bodys);
    }
    /** Search Interest*/
    getSearchInterestByname(body): Observable<any> {
        var bodys = {
            "SearchText": body
        }
        return this.apiService.post(routes.SearchInterestByname, bodys);
    }

    ProductIntrestByName(body): Observable<any> {
        var bodys = {
            "SearchText": body,
            "PageSize": 10,
            "OdatanextLink": '',
            "RequestedPageNumber": 1
        }
        return this.apiService.post(routes.ProductIntrestByName, bodys);
    }

    /** SBU Dropdown*/
    getSearchSBUByname(val): Observable<any> {
        var body = {
            "SearchText": val
        }
        return this.apiService.post(routes.SearchSBUByname, body)
    }

    SBUByAccountOrProspect(val, Guid, isProspect) {
        var body = { "SearchText": val, "Guid": Guid, "isProspect": isProspect }
        return this.apiService.post(routes.SBUByAccountOrProspect, body);
    }

    /** Verticle Dropdown*/
    getSearchVerticalByname(value: any): Observable<any> {
        var body = { SearchText: value }
        return fromPromise(this.getMasterCache(routes.SearchVerticalByname)).pipe(
            switchMap(cacheresult => {
                if (cacheresult) {
                    return of(cacheresult)
                } else {
                    return this.apiService.post(routes.SearchVerticalByname, body);
                }
            }), catchError(err => {
                return []
            })
        )
    }
    VerticalBasedOnSBU(value, Guid) {
        var body = { SearchText: value, Guid: Guid }
        return this.apiService.post(routes.VerticalBasedOnSBU, body);
    }
    GetSBUandVerticalfromAccount(val, Guid, isProspect): Observable<any> {
        var body = { "SearchText": val, "Guid": Guid, "isProspect": isProspect, "PageSize": 10, "RequestedPageNumber": 1, "OdatanextLink": '' }
        return this.apiService.post(routes.SBUByAccountOrProspect, body);
    }
    GetVerticalbySBUID(val, Guid): Observable<any> {
        var body = {
            "Guid": Guid,
            "SearchText": val,
            "PageSize": 10,
            "RequestedPageNumber": 1,
            "OdatanextLink": '',
        }
        return this.apiService.post(routes.GetVerticalbySBUID, body);
    }
    requestCampaign(value: any): Observable<any> {
        return this.apiService.post(routes.requestCampaign, value);
    }
    getsearchAccountCompany(body, Serviceparam?): Observable<any> {
        var bodys = {
            "SearchText": body,
            "PageSize": 10,
            "OdatanextLink": '',
            "RequestedPageNumber": 1
        }
        return this.apiService.post(routes.searchAccountCompany, (Serviceparam) ? Serviceparam : bodys).pipe(
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
    getSubVerticalIdByName(): Observable<any> {
        return this.apiService.post(routes.getSubVerticalIdByName, {});
    }
    searchSicIndustry(body: any): Observable<any> {
        var bodys = { "SearchText": body }
        return this.apiService.post(routes.searchSicIndustry, bodys);
    }
    async getMasterCache(key: string) {
        // return true
        const CacheRes = await this.offlineServices.getMasterDataCache(key)
        console.log("got cache respo se master")
        console.log(CacheRes)
        if (CacheRes) {
            return CacheRes.data
        } else {
            return null
        }
    }
    //------------shiva service -------
    deLinkAccount(id, guid: any) {
        var body = { "Id": id, "CustomerAccountCode": { "MapGuid": guid } }
        return this.apiService.post(routes.deLinkCampaignAccount, body)
    }

    deLinkInterest(id, interestId) {
        var body = { "Id": id, "Intrest": [{ "Id": interestId }] }
        return this.apiService.post(routes.deLinkCampaignInterest, body)
    }
    deLinkIndustry(id, industryId) {
        var body = { "Id": id, "Industry": [{ "Guid": industryId }] }
        return this.apiService.post(routes.deLinkCampaignIndustry, body)
    }
    deLinkFunction(id, functionId) {
        var body = { "Id": id, "Function": [{ "Code": functionId }] }
        return this.apiService.post(routes.deLinkCampaignFunction, body)
    }
    ValidateAccount(accountGuid: any, isProspect, Moduletype: number) {
        var body = { "AccountGuid": accountGuid, "isProspect": isProspect, "Moduletype": Moduletype }
        return this.apiService.post(routes.ValidateAccount, body)
    }
    //------------shiva-------


    getLookUpFilterData(data): Observable<any> {
        switch (data.controlName) {
            case 'AccountSearch': return this.getCampaignAccountData(data);
        }
    }
    getCampaignAccountData(data): Observable<any> {
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
                        'Id': (x.SysGuid) ? x.SysGuid : 'NA',
                        'AccId': (x.Number) ? x.Number : 'NA',
                        'Ownername': (x.Owner) ? (x.Owner.FullName) ? x.Owner.FullName : "NA" : 'NA',
                        'AccType': (x.Type) ? (x.Type.Value) ? x.Type.Value : 'NA' : 'NA',
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


    //-------------------------------Filter Table Search ----------------------------------------
    reqBody: any;



    getFilterList(body) {
        return this.apiService.post(routes.FilterList, body)
    }

    pluckParticularKey(array, key) {
        return array.map(function (item) { return (item[key]) });
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
    // GetFilterListColumnStartDate(value: any): Observable<any> {
    //     return this.apiService.post(routes.getFilterListColumnStartDate, value);
    // }
    // GetFilterListColumnEndDate(value: any): Observable<any> {
    //     return this.apiService.post(routes.getFilterListColumnEndDate, value);
    // }
    getCampaignStatus(reqbody): Observable<any> {
        return this.apiService.post(routes.GetCampaignStatus, reqbody)
    }

    GetAppliedFilterData(data) {
        return {
            "ColumnSearchText": (data.filterData) ? (data.filterData.columnSerachKey) ? data.filterData.columnSerachKey : "" : "",
            "PageSize":  data.useFulldata.pageSize,
            "RequestedPageNumber": data.useFulldata.pageNo,
            "SearchText": (data.filterData) ? (data.filterData.globalSearch) ? data.filterData.globalSearch : "" : "",
            "IsDesc": (data.filterData) ? (data.filterData.sortColumn != '') ? !data.filterData.sortOrder : false : false,
            "Name": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['Name'], 'name') : [] : [],
            "OwnerGuids":(data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['owner'], 'id') : [] : [],
            "CampaignGuids": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['campaign'], 'name') : [] : [],
            "OdatanextLink": "",
            "StatusIds": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['status'], 'id') : [] : [],
            "FromStartDate": [],
            "ToEndDate": [],
            "OrderGuids": [],
            "SortBy": (data.filterData) ? (data.filterData.sortColumn) ?  this.pluckParticularKey(completedcampaignheader.filter(x => x.name == data.filterData.sortColumn), 'SortId')[0] : [] : [],
            "CampaignType": data.useFulldata.CampaignType,
            "StartDate":(data.filterData) ? (data.filterData.filterColumn['startDate'][0].filterStartDate!=='') ? this.dateModifier(data.filterData.filterColumn['startDate'][0].filterStartDate):"":"",
            "EndDate":(data.filterData) ? (data.filterData.filterColumn['startDate'][0].filterEndDate!=='') ? this.dateModifier(data.filterData.filterColumn['startDate'][0].filterEndDate):"":"",
            "CMPStartDate":(data.filterData) ? (data.filterData.filterColumn['endDate'][0].filterStartDate!=='') ? this.dateModifier(data.filterData.filterColumn['endDate'][0].filterStartDate):"":"",
            "CMPEndDate":(data.filterData) ? (data.filterData.filterColumn['endDate'][0].filterEndDate!=='') ? this.dateModifier(data.filterData.filterColumn['endDate'][0].filterEndDate):"":"",
            "ColumnOrder": (data.objectRowData) ? Array.isArray(data.objectRowData) ? this.filterHeaderName(data.objectRowData[1]) :[]:[]
        }
    }

    
    filterHeaderName(data) {
        return data.reduce((acc, d) => {
            if(d.name=="campaign" ) {
                acc.push("Code");
            }else if(d.name=="owner" ) {
                acc.push("Owner");
            }else if(d.name=="status" ) {
                acc.push("CampaignStatus");
            }else if(d.name=="startDate" ) {
                acc.push("StartDate");
            }else if(d.name=="endDate" ) {
                acc.push("EndDate");
            }else {
                acc.push(d.name);
            }
            return acc;
        }, []);
    }
    
    dateModifier(dateConvert) {
        let dataModifier = new DateModifier();
        return dataModifier.modifier(dateConvert)
     }

    getFilterCampaignSwitchListData(data) {
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


    // GetStartDateColumnFilterSearch(data) {
    //     let reqBody = this.GetAppliedFilterData({ ...data });
    //     return this.GetFilterListColumnStartDate(reqBody).pipe(switchMap(res => {
    //         return of((!res.IsError) ? { ...res, ResponseObject: this.filterStartDateColumndata(res.ResponseObject) } : { ...res })
    //     }))
    // }

    // GetEndDateColumnFilterSearch(data) {
    //     let reqBody = this.GetAppliedFilterData({ ...data });
    //     return this.GetFilterListColumnEndDate(reqBody).pipe(switchMap(res => {
    //         return of((!res.IsError) ? { ...res, ResponseObject: this.filterEndDateColumndata(res.ResponseObject) } : { ...res })
    //     }))
    // }


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


    // getStartDateColumnFilterData(data) {
    //     if (data.Guid) {
    //         this.reqBody = {
    //             "SearchType": 4,
    //             "SearchText": data.useFulldata.searchVal,
    //             "PageSize": data.useFulldata.pageSize,
    //             "OdatanextLink": data.useFulldata.nextLink,
    //             "RequestedPageNumber": data.useFulldata.pageNo,
    //             "Guid": data.Guid
    //         }
    //     } else {
    //         this.reqBody = {
    //             "SearchType": 1,
    //             "SearchText": data.useFulldata.searchVal,
    //             "PageSize": data.useFulldata.pageSize,
    //             "OdatanextLink": data.useFulldata.nextLink,
    //             "RequestedPageNumber": data.useFulldata.pageNo,
    //         }
    //     }
    //     return this.getOtherListNames('', this.reqBody).pipe(switchMap(res => {
    //         return of((!res.IsError) ? { ...res, ResponseObject: this.filterStartDateColumndata(res.ResponseObject) } : { ...res })
    //     }))
    // }

    // getEndDateColumnFilterData(data) {
    //     if (data.Guid) {
    //         this.reqBody = {
    //             "SearchType": 4,
    //             "SearchText": data.useFulldata.searchVal,
    //             "PageSize": data.useFulldata.pageSize,
    //             "OdatanextLink": data.useFulldata.nextLink,
    //             "RequestedPageNumber": data.useFulldata.pageNo,
    //             "Guid": data.Guid
    //         }
    //     } else {
    //         this.reqBody = {
    //             "SearchType": 1,
    //             "SearchText": data.useFulldata.searchVal,
    //             "PageSize": data.useFulldata.pageSize,
    //             "OdatanextLink": data.useFulldata.nextLink,
    //             "RequestedPageNumber": data.useFulldata.pageNo
    //         }
    //     }
    //     return this.getOtherListNames('', this.reqBody).pipe(switchMap(res => {
    //         return of((!res.IsError) ? { ...res, ResponseObject: this.filterEndDateColumndata(res.ResponseObject) } : { ...res })
    //     }))
    // }

    // filterStartDateColumndata(data) {
    //     if (data) {
    //         if (data.length > 0) {
    //             return data.map(x => {
    //                 return {
    //                     id: x.Id,
    //                     name: this.datepipe.transform(x.StartDate, 'd-MMM-y'),
    //                     isDatafiltered: false,
    //                     StartDate: x.StartDate
    //                 }
    //             })
    //         } else {
    //             return []
    //         }
    //     } else {
    //         return []
    //     }
    // }

    // filterEndDateColumndata(data) {
    //     if (data) {
    //         if (data.length > 0) {
    //             return data.map(x => {
    //                 return {
    //                     id: x.Id,
    //                     name: this.datepipe.transform(x.EndDate, 'd-MMM-y'),
    //                     isDatafiltered: false,
    //                     EndDate: x.EndDate
    //                 }
    //             })
    //         } else {
    //             return []
    //         }
    //     } else {
    //         return []
    //     }
    // }

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

    //-------------------------------list filter end--------------------------------------------


    getSearchOwner(searchText, body?): Observable<any> {
        let reqbody = {
            "PageSize": 10,
            "RequestedPageNumber": 1,
            "OdatanextLink": "",
            "SearchText": searchText
        }
        return this.apiService.post(routes.SearchOwner, (body) ? body : reqbody)
    }

    getOtherListNames(searchText, body?): Observable<any> {
        debugger
        let reqbody = {
            "SearchType": 1,
            "PageSize": 10,
            "RequestedPageNumber": 1,
            "OdatanextLink": "",
            "SearchText": searchText
        }
        return this.apiService.post(routes.SearchFilterByName, (body) ? body : reqbody)
    }

    getOtherListCode(searchText, body?): Observable<any> {
        debugger
        let reqbody = {
            "SearchType": 1,
            "PageSize": 10,
            "RequestedPageNumber": 1,
            "OdatanextLink": "",
            "SearchText": searchText
        }
        return this.apiService.post(routes.SearchFilterByCode, (body) ? body : reqbody)
    }

}
interface AllCapignReq {
    PageSize?: number,
    OdatanextLink?: string,
    RequestedPageNumber?: number
}
interface ActiveCapignReq {
    PageSize?: number,
    OdatanextLink?: string,
    RequestedPageNumber?: number
}
interface CompletedCapignReq {
    PageSize?: number,
    OdatanextLink?: string,
    RequestedPageNumber?: number
}