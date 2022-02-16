import { Injectable } from '@angular/core';

import { JsonApiService } from './json-api.service';
import { Observable, of } from 'rxjs';

import { UnqualifiedLeads } from '../models/UnqualifiedLeads.model';
import { ApiService } from './api.service';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { OfflineService } from './offline.services'
import { LeadListOfflineService } from './offline/leads/leadList.offlineService';
import { UpdateHistoryflag } from '../state/actions/leads.action';
import { AppState } from '../state';
import { Store } from '@ngrx/store';
import { ContactleadService } from './contactlead.service';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DataCommunicationService } from './global.service';
import { environment as env } from '@env/environment'
import { LeadListService } from './lead-list-service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { EnvService } from './env.service';
export const routes = {

    GetMyOpenLeads: "v1/LeadManagement/ByStatus",
    MyOpenleadSeacrch: "v1/LeadManagement/Search",
    Qualifyleads: 'v1/LeadManagement/Qualify',
    DisQualifyleads: 'v1/LeadManagement/Disqualify',
    NurtureLeads: 'v1/LeadManagement/Nurture',
    ArchieveLeads: 'v1/LeadManagement/ArchiveQualified',
    AcceptedLeads: 'v1/LeadManagement/MarkLeadAccepted',
    Rejectreasons: 'v1/MasterManagement/RejectReasonList',
    RejectLead: 'v1/LeadManagement/MarkLeadRejected',
    SbuAccount: 'v1/CampaignManagement/AutoPopulateSBUByAccountOrProspect',
    LeadDownload: 'v1/LeadManagement/DownloadByStatus',
    getLeadFilteredList: 'v1/LeadManagement/FilterList',
    getFilterActivityList: 'v1/ActivityGroupManagement/FilterSearchList',
    // getFilterStatus: 'v1/LeadManagement/LeadStatusFilter',
    getFilterLeadNamesold: 'v1/LeadManagement/LeadSearchFilter',
    // getLeadMoreViewURL : 'v1/LeadManagement/MoreViewsList',

    getFilterLeadNames:'v1/LeadManagement/LeadSearchFilter_V1',
    getSearchFilterOwner:'v1/LeadManagement/LeadSearchFilterOwner',
    getSearchFilterSource:'v1/LeadManagement/LeadSearchFilterSource',
    getStatusFilter:'v1/LeadManagement/LeadStatusFilter_V1',
    getActivityGroupFilter:'v1/LeadManagement/LeadActivityGroupFilter',
    getdAccountOrProspect:'v1/LeadManagement/LeadAccountOrProspect'

};


export const myopenleaddheader: any[] = [
    { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Name' },
    { id: 2, isFilter: false, name: 'Id', isFixed: false, order: 2, title: 'ID' },
    { id: 3, isFilter: false, name: 'Score', isFixed: false, order: 3, title: 'Score' },
    { id: 4, isFilter: false, name: 'Owner', isFixed: false, order: 4, title: 'Owner' },
    { id: 5, isFilter: false, name: 'Createdon', isFixed: false, order: 5, title: 'Created on' },
    { id: 6, isFilter: false, name: 'Account', isFixed: false, order: 6, title: 'Account' },
    { id: 7, isFilter: false, name: 'Source', isFixed: false, order: 7, title: 'Source' },
    { id: 8, isFilter: false, name: 'Status', isFixed: false, order: 8, title: 'Status' },
    { id: 9, isFilter: false, name: 'Activitygroup', isFixed: false, order: 9, title: 'Activity group' },

]

export const LeadCustomErrorMessages = {
    ActivityDuplicateError: "Selected linked activity group already exist",
    CampaignDuplicateError: "Selected linked campaign already exist",
    OpportunityDuplicateError: "Selected linked opportunity/order already exist",
    ContactDuplicateError: "Selected customer contact already exist",
    WiproSolutionDuplicateError: "Selected wipro solution already exist",
    UnqualifiedArchive: "Unqualified Lead is archived successfully"
}


export const LeadSourceAdvnHeader: any[] = [
    { name: 'Name', title: 'Name' },
    { name: 'Id', title: 'Lead Source Id' }
]

export const AccountAdvnHeader: any[] = [
    { name: 'Name', title: 'Name' },
    { name: 'Ownername', title: 'Account Owner' },
    { name: 'AccType', title: 'Account Type' },
    { name : "Geo", title: 'Geo'},
    { name: "Region", title: "Region"},
    { name: "AccId", title: 'Account Number' },
]

export const CountryAdvnHeader: any[] = [

    { name: 'Name', title: 'Name' },
    { name: 'Id', title: 'Country Id' }
]

export const AllianceAdvnHeader: any[] = [

    { name: 'Name', title: 'Alliance Account Name' },
    { name: 'Ownername', title: 'Account Owner' },
    { name: "AccId", title: 'Account Number' }

]

export const AdvisorAdvnHeader: any[] = [

    { name: 'Name', title: 'Name' },
    { name: 'Ownername', title: 'Account Owner' },
    { name: "AccId", title: 'Account Number' }

]

export const WiproSolAdvnHeader: any[] = [

    { name: 'Name', title: 'Solution name' },
    { name: 'Ownername', title: 'solution owner' }

]

export const ActivityAdvnHeader: any[] = [

    { name: 'Name', title: 'Name' },
    // { name: 'Id', title: 'Country Id' },
    { name: 'Ownername', title: 'Activity Owner' },
    { name: 'AccName', title: 'Activity Account Name' },
    { name: 'ActivityGroupName', title: 'Activity Group Name' }

]

export const CampaignAdvnHeader: any[] = [

    { name: 'Name', title: 'Name' },
    // { name: 'Id', title: 'Id' },
    { name: 'campaignId', title:'Campaign Id'},
    { name: 'Ownername', title: 'Campaign owner' },
]

export const OpportunityAdvnHeader: any[] = [

    { name: 'Name', title: 'Name' },
    { name: 'OppId', title: 'Opportunity Id' },
    { name: 'Owner', title: 'Opportunity Owner' },

]

export const ContactAdvnHeader: any[] = [

    { name: 'Name', title: 'Name' },
    //{ name: 'Id', title: 'Contact Id' },
    { name: 'Designation', title: 'Contact Designation' },
    { name: 'Email_ID', title: 'email ID' },
    { name: 'AccountName', title: 'Account name ' },

]

export const AgpAdvnHeader: any[] = [

    { name: 'Name', title: 'Name' },
    { name: 'Id', title: 'Agp Id' }

]

export const OwnerAdvnHeader: any[] = [

    { name: 'Name', title: 'Name' },
    { name: 'Email', title: 'Email id' }

]

export const ServiceLineAdvnHeader: any[] = [

    { name: 'Name', title: 'Name' },
    { name: 'Id', title: 'Service ID' }

]

export const PractiseLineAdvnHeader: any[] = [

    { name: 'Name', title: 'Name' },
    { name: 'Id', title: 'Practise ID' }

]

export const SlbdmAdvnHeader: any[] = [

    { name: 'Name', title: 'Name' },
    { name: 'Id', title: 'slbdm ID' }

]
export const DnBAccountHeader: any[] = [

    { name: 'Name', title: 'Name' },
    { name: "Duns", title: 'Duns Id' },
    { name: 'Region', title: 'Region' },
    { name: 'Industry', title: 'Industry' }
  ]

export const leadAdvnHeaders = {

    'leadSource': LeadSourceAdvnHeader,
    'accountSearch': AccountAdvnHeader,
    'sbuSearch': [],
    'verticalSearch': [],
    'countrySearch': CountryAdvnHeader,
    'allianceSearch': AllianceAdvnHeader,
    'advisorSearch': AdvisorAdvnHeader,
    'wiproSoluSearch': WiproSolAdvnHeader,
    'activitySearch': ActivityAdvnHeader,
    'campaignSearch': CampaignAdvnHeader,
    'oppoSearch': OpportunityAdvnHeader,
    'agpSearch': AgpAdvnHeader,
    'contactSearch': ContactAdvnHeader,
    'ownerSearch': OwnerAdvnHeader,
    'serviceLines': ServiceLineAdvnHeader,
    'practice': PractiseLineAdvnHeader,
    'slbdm': SlbdmAdvnHeader

}

export const leadAdvnNames = {

    'leadSource': { name: 'Lead Source', isCheckbox: false, isAccount: false },
    'accountSearch': { name: 'Account', isCheckbox: false, isAccount: true },
    'sbuSearch': { name: 'Sbu Search', isCheckbox: false, isAccount: false },
    'verticalSearch': { name: 'Vertical', isCheckbox: false, isAccount: false },
    'countrySearch': { name: 'Country', isCheckbox: false, isAccount: false },
    'allianceSearch': { name: 'Alliance', isCheckbox: false, isAccount: false },
    'advisorSearch': { name: 'Advisor', isCheckbox: false, isAccount: false },
    'wiproSoluSearch': { name: 'Wipro Solution', isCheckbox: true, isAccount: false },
    'activitySearch': { name: 'Activity', isCheckbox: true, isAccount: false },
    'campaignSearch': { name: 'Campaign', isCheckbox: true, isAccount: false },
    'oppoSearch': { name: 'Opportunity', isCheckbox: true, isAccount: false },
    'agpSearch': { name: 'Agp', isCheckbox: false, isAccount: false },
    'contactSearch': { name: 'Contact', isCheckbox: true, isAccount: false },
    'ownerSearch': { name: 'Lead owner', isCheckbox: false, isAccount: false },
    'serviceLines': { name: 'Lead owner', isCheckbox: false, isAccount: false },
    'practice': { name: 'Lead owner', isCheckbox: false, isAccount: false },
    'slbdm': { name: 'Lead owner', isCheckbox: false, isAccount: false }

}



@Injectable({
    providedIn: 'root'
})
export class MyOpenLeadsService {
    cachedArray = [];
    constructor(
        public envr : EnvService,
        private jsonApiService: JsonApiService,
        private apiService: ApiService,
        public datepipe: DatePipe, private offlineServices: OfflineService,
        public contactLeadService: ContactleadService,
        private leadlistOfflineService: LeadListOfflineService,
        private router: Router,
        private service: DataCommunicationService,
        private leadListService: LeadListService,
        private EncrDecr: EncrDecrService,
        public store: Store<AppState>) { }
    public readonly LeadsChacheType = {
        Table: "Table",
        Details: "Details",
        MeetingTypes: "MeetingTypes"
    }

    getMyopenLeads(reqBody): Observable<any> {
        return this.apiService.post(routes.GetMyOpenLeads, reqBody)
    }
    MyOpenLeadSearch(reqBody): Observable<any> {
        return this.apiService.post(routes.MyOpenleadSeacrch, reqBody)
    }

    QyalifyLeads(obj): Observable<any> {
        return this.apiService.post(routes.Qualifyleads, obj);
    }

    DisqualifyLead(obj): Observable<any> {
        return this.apiService.post(routes.DisQualifyleads, obj);
    }

    NurtureLead(obj): Observable<any> {
        return this.apiService.post(routes.NurtureLeads, obj);
    }

    ArchiveLeads(obj): Observable<any> {
        return this.apiService.post(routes.ArchieveLeads, obj);
    }

    GetSbuAccountdata(obj): Observable<any> {
        return this.apiService.post(routes.SbuAccount, obj);
    }

    async getCachedLeadList(key) {
        const TablePageData = await this.leadlistOfflineService.getLeadListIndexCacheData(key)
        if (TablePageData.length > 0) {
            return { ...TablePageData[0], data: this.offlineServices.DecryptOfflineData(TablePageData[0].data) }
        } else {
            console.log("else condinti")
            return null
        }
    }


    AcceptLead(obj): Observable<any> {
        console.log("clicked serivces")
        return this.apiService.post(routes.AcceptedLeads, obj);
        //   return this. 
    }

    GetRejectReasons(): Observable<any> {
        return this.apiService.post(routes.Rejectreasons, {});
    }

    LeadReject(obj): Observable<any> {
        return this.apiService.post(routes.RejectLead, obj);
    }
    setSession(keyName,value){
       return (sessionStorage.setItem(keyName,this.EncrDecr.set("EncryptionEncryptionEncryptionEn",JSON.stringify(value) , "DecryptionDecrip") ));
       }
    clearLeadAddContactSessionStore() {
        sessionStorage.removeItem("leadRequestData")
        sessionStorage.removeItem("addLeadContact")
        sessionStorage.removeItem("TempCreateLeadDetails")
        sessionStorage.removeItem('RequestCampaign')
        sessionStorage.removeItem("TempLeadDetails")
        sessionStorage.removeItem('TempEditLeadDetails')
        sessionStorage.removeItem('AccountDetailsFromCreateLead')
        sessionStorage.removeItem('CreateOpportunity')
        sessionStorage.removeItem('leadRoute')
    }

    // downloadLeadList(status, pageSize, userguid) {
    // let req = {
    //     "SearchText": "",
    //     "PageSize": Number(pageSize),
    //     "RequestedPageNumber": 1,
    //     "OdatanextLink": "",
    //     "Statuscode": Number(status),
    //     "UserGuid": userguid
    // }

    downloadLeadList(req): Observable<any> {
        return this.apiService.post(routes.LeadDownload, req)
    }

    updateHistoryFlag(id, flag) {

        let changes = { isHistory: flag }

        const historyChange = {
            id: id,
            changes
        }

        this.store.dispatch(new UpdateHistoryflag({ Historyflag: historyChange }))
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

    // Getting the config data 

    configData = []

    set sendConfigData(value) {
        this.configData = value;
    }

    get sendConfigData() {
        return this.configData
    }

    genarateLinkActionType(item, excistingArr, finalLinkArr, key, key1) {

        if(item[key]){

            if (excistingArr.some(x => x[key] == 1)) {
            
                item = { ...item, LinkActionType:  1}
                finalLinkArr.push({ ...item, LinkActionType: 1 })
                
            } else  if (excistingArr.some(x => x[key] == 2)) {
                
                item = { ...item, LinkActionType: 2}
                finalLinkArr.push({ ...item, LinkActionType: 2 })
    
            }
            return {
                item: item,
                data: this.service.removeDuplicates(finalLinkArr, key1)
            }

        } else{

            item = { ...item, LinkActionType: 1 }
            finalLinkArr.push({ ...item, LinkActionType: 1 })
            return {
                item: item,
                data: this.service.removeDuplicates(finalLinkArr, key1)
            }
        }
       
    }

    GenerateLinkActionType(item, excistingArr, finalLinkArr, key) {

        if (excistingArr.some(x => x[key] == item[key])) {
            
            item = { ...item, LinkActionType: 2}
            finalLinkArr.push({ ...item, LinkActionType: 2 })
            
        } else if (!excistingArr.some(x => x[key] == x[key])) {

            item = { ...item, LinkActionType: 1 }
            finalLinkArr.push({ ...item, LinkActionType: 1 })

        } 
        return {
            item: item,
            data: this.service.removeDuplicates(finalLinkArr, key)
        }

    }

    generateDelinkLinkActionType(item, excistingArr, finalLinkArr, key) {
        if (excistingArr.some(x => x[key] == item[key])) {

            item = { ...item, MapGuid: item.MapGuid, LinkActionType: 3 }
            finalLinkArr = finalLinkArr.filter(x => x[key] != item[key])
            finalLinkArr.push(item)
        } else {
            finalLinkArr = finalLinkArr.filter(x => x[key] != item[key])
        }
        return {
            item: item,
            data: finalLinkArr
        }
    }


    //handels pagination,search,filterlookup
    getLookUpFilterData(data): Observable<any> {
        switch (data.controlName) {
            case 'leadSource':
                return this.getLeadSourcedata(data)
            case 'accountSearch':
                return this.getAccoutdata(data)
            case 'sbuSearch':
                return this.getSbudata(data)
            case 'verticalSearch':
                return this.getverticaldata(data)
            case 'countrySearch':
                return this.getCountry(data)
            case 'allianceSearch':
                return this.getAlliancedata(data)
            case 'advisorSearch':
                return this.getAdvisordata(data)
            case 'wiproSoluSearch':
                return this.getWiproSoldata(data)
            case 'activitySearch':
                return this.getActivitydata(data)
            case 'campaignSearch':
                return this.getCampaigndata(data)
            case 'oppoSearch':
                return this.getOppodata(data)
            case 'agpSearch':
                return this.getAgpdata(data)
            case 'ownerSearch':
                return this.getOwnerdata(data)
            case 'contactSearch':
                return this.getContactdata(data)
            case 'serviceLines':
                return this.getServiceLinedata(data)
            case 'practice':
                return this.getPracticedata(data)
            case 'slbdm':
                return this.getSlbdmdata(data)
            default:
                return of([])
        }

    }
    getSlbdmdata(data: any): Observable<any> {
        console.log("service line data")
        console.log(data)
        if (data.isService) {

            return this.contactLeadService.getSLBDM(data.useFullData.searchVal, data.rowLine.serviceLines.Guid, data.rowLine.practice.practiceGuid, data.useFullData.SbuId, data.useFullData.VerticalId).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnSlbdm({ ...res.ResponseObject, data: data }) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterAdvnSlbdm(data))
        }
        return of([])
    }


    getPracticedata(data: any): Observable<any> {
        console.log("service line data")
        console.log(data)

        if (data.isService) {


            return this.contactLeadService.getPractice(data.useFullData.searchVal, data.rowLine.serviceLines.Guid).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnPractice({ ...res.ResponseObject, data: data }) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterAdvnPractice(data.data))
        }
    }

    getServiceLinedata(data: any): Observable<any> {
        console.log("service line data")
        console.log(data)
        if (data.isService) {

            let ServicelineReqBody = {
                "SearchText": data.useFullData.searchVal,
                "Account": {
                    "SysGuid": data.useFullData.AccId,
                    "isProspect": data.useFullData.isProspect
                },
                "SBU": {
                    "Id": data.useFullData.SbuId
                }
            }


            return this.contactLeadService.getsearchServiceLine(ServicelineReqBody).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterServiceLine({ ...res.ResponseObject, data: data }) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterServiceLine(data.data))
        }

    }

    getOwnerdata(data: any): Observable<any> {
        if (data.isService) {

            let body = {
                "SearchText": data.useFullData.searchVal,
                "PageSize": data.useFullData.recordCount,
                "OdatanextLink": data.useFullData.OdatanextLink,
                "RequestedPageNumber": data.useFullData.pageNo
            }

            return this.contactLeadService.getsearchLeadOwner('', body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnOwner(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterAdvnOwner(data.data))
        }
    }
    getAdvisordata(data: any): Observable<any> {
        if (data.isService) {

            let body = {
                "SearchText": data.useFullData.searchVal,
                "PageSize": data.useFullData.recordCount,
                "OdatanextLink": data.useFullData.OdatanextLink,
                "RequestedPageNumber": data.useFullData.pageNo
            }

            return this.contactLeadService.GetAdvisorAccount('', body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnAdvisor(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterAdvnAdvisor(data.data))
        }
    }

    getContactdata(data: any) {
        if (data.isService) {
            let body = {
                "SearchText": data.useFullData.searchVal,
                "PageSize": data.useFullData.recordCount,
                "OdatanextLink": data.useFullData.OdatanextLink,
                "RequestedPageNumber": data.useFullData.pageNo,
                "Guid": data.useFullData.AccId,
                "isProspect": data.useFullData.isProspect
            }

            return this.contactLeadService.searchCustomerparticipants(null, null, null, body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnContact(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterAdvnContact(data.data))
        }

    }

    getAgpdata(data: any): Observable<any> {

        
        if (data.isService) {


            let body = {
                "SearchText": data.useFullData.searchVal,
                "PageSize": data.useFullData.recordCount,
                "OdatanextLink": data.useFullData.OdatanextLink,
                "RequestedPageNumber": data.useFullData.pageNo
            }

            return this.contactLeadService.getsearchLinkAGP(null, body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnAgp(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterAdvnAgp(data.data))
        }

    }
    getOppodata(data: any): Observable<any> {
        if (data.isService) {
            let body = {
                "SearchText": data.useFullData.searchVal,
                "PageSize": data.useFullData.recordCount,
                "OdatanextLink": data.useFullData.OdatanextLink,
                "RequestedPageNumber": data.useFullData.pageNo,
                "Guid": data.useFullData.AccId,
                "isProspect": data.useFullData.isProspect,
            }

            return this.contactLeadService.searchOpportunityOrder(null, null, null, body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnOppor(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterAdvnOppor(data.data))
        }
    }


    getCampaigndata(data: any): Observable<any> {
        if (data.isService) {


            let body = {
                "SearchText": data.useFullData.searchVal,
                "SearchType": 1,
                "PageSize": data.useFullData.recordCount,
                "OdatanextLink": data.useFullData.OdatanextLink,
                "RequestedPageNumber": data.useFullData.pageNo,
                "Guid": data.useFullData.AccId,
                "isProspect": data.useFullData.isProspect,
            }

            return this.contactLeadService.getsearchCampaign(null, null, null, body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnCampaign(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterAdvnCampaign(data.data))
        }
    }
    getActivitydata(data: any): Observable<any> {
        debugger
        if (data.isService) {
            let body = {
                "SearchText": data.useFullData.searchVal,
                "PageSize": data.useFullData.recordCount,
                "OdatanextLink": data.useFullData.OdatanextLink,
                "RequestedPageNumber": data.useFullData.pageNo,
                "Guid": data.useFullData.AccId,
                "isProspect": data.useFullData.isProspect,
            }

            return this.contactLeadService.getSearchActivityGroup(null, null, null, body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnActivity(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterAdvnActivity(data.data))
        }
    }
    getWiproSoldata(data: any): Observable<any> {
        if (data.isService) {

            let body = {
                "SearchText": data.useFullData.searchVal,
                "PageSize": data.useFullData.recordCount,
                "OdatanextLink": data.useFullData.OdatanextLink,
                "RequestedPageNumber": data.useFullData.pageNo
            }

            return this.contactLeadService.getWiproSolutions('', body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnWiproSol(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterAdvnWiproSol(data.data))
        }
    }
    getAlliancedata(data: any): Observable<any> {

        if (data.isService) {

            let body = {
                "SearchText": data.useFullData.searchVal,
                "PageSize": data.useFullData.recordCount,
                "OdatanextLink": data.useFullData.OdatanextLink,
                "RequestedPageNumber": data.useFullData.pageNo
            }

            return this.contactLeadService.GetAllianceAccount('', body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnAlliacne(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterAdvnAlliacne(data.data))
        }
    }


    getCountry(data: any): Observable<any> {

        if (data.isService) {

            let body = {
                "SearchText": data.useFullData.searchVal,
                "PageSize": data.useFullData.recordCount,
                "OdatanextLink": data.useFullData.OdatanextLink,
                "RequestedPageNumber": data.useFullData.pageNo
            }

            return this.contactLeadService.getCoutry('', body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnCountry(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterAdvnCountry(data.data))
        }
    }
    getverticaldata(data: any): Observable<any> {
        if (data.isService) {

            let body = {
                "SearchText": data.useFullData.searchVal,
                "PageSize": data.useFullData.recordCount,
                "OdatanextLink": data.useFullData.OdatanextLink,
                "RequestedPageNumber": data.useFullData.pageNo,
                "Guid": data.useFullData.guid,
            }

            return this.contactLeadService.getsearchVerticalBySbu(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnVertical(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterAdvnVertical(data.data))
        }

    }



    getSbudata(data: any): Observable<any> {
        if (data.isService) {

            let body = {
                "SearchText": data.useFullData.searchVal,
                "PageSize": data.useFullData.recordCount,
                "OdatanextLink": data.useFullData.OdatanextLink,
                "RequestedPageNumber": data.useFullData.pageNo,
                "Guid": data.useFullData.guid,
                "isProspect": data.useFullData.isProspect,

            }

            return this.contactLeadService.getsearchSBUbyName(null, null, null, body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnSbu(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterAdvnSbu(data.data))
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
            return this.contactLeadService.getsearchAccountCompanyNew('', body).pipe(switchMap(res => {
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

    getLeadSourcedata(data): Observable<any> {
        
        if (data.isService) {

            let requestparam = {
                "SearchText": data.useFullData.searchVal,
                "PageSize": data.useFullData.recordCount,
                "OdatanextLink": data.useFullData.OdatanextLink,
                "RequestedPageNumber": data.useFullData.pageNo
            }

            return this.contactLeadService.getsearchLeadSource('', requestparam).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnLeadSrc(res.ResponseObject) : [] } : [])
                } else {
                    return []
                }
            }))

        } else {
            return of(this.filterAdvnLeadSrc(data.data))
        }
    }

    getLeadActivityFilterList(obj): Observable<any> {
        return this.apiService.post(routes.getFilterActivityList, obj);
    }

    getLeadFilterNamesOld(obj): Observable<any> {
        return this.apiService.post(routes.getFilterLeadNamesold, obj)
    }

    filterServiceLine(data: any): any {
        
        if (data) {
            if (data.length > 0) {

                return data.map(x => {

                    return {
                        ...x,
                        'Name': (x.Name) ? x.Name : '',
                        'Id': (x.SysGuid) ? x.SysGuid : ''
                    }

                })

            } else {
                return []
            }
        } else {
            return []
        }
    }

    filterAdvnPractice(data: any): any {
        if (data) {
            if (data.length > 0) {

                return data.map(x => {

                    return {
                        ...x,
                        'Name': (x.Name) ? x.Name : '',
                        'Id': (x.SysGuid) ? x.SysGuid : ''
                    }

                })

            } else {
                return []
            }
        } else {
            return []
        }
    }

    filterAdvnSlbdm(data: any): any {
        
        if (data) {
            if (data.length > 0) {

                return data.map(x => {

                    return {
                        ...x,
                        'Name': (x.Name) ? x.Name : '',
                        'Id': (x.SysGuid) ? x.SysGuid : ''
                    }

                })

            } else {
                return []
            }
        } else {
            return []
        }
    }


    filterAdvnLeadSrc(data) {
        if (data.length > 0) {
            return []
        } else {
            return []
        }
    }

    filterAdvnAcc(data) {
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
                        'Geo': (x.Address) ? (x.Address.Geo) ? x.Address.Geo.Name : 'NA' : 'NA',
                        'Region': (x.Address) ? (x.Address.Region) ? x.Address.Region.Name : 'NA' : 'NA'
                    }
                })
            } else {
                return []
            }
        } else {
            return []
        }
    }

    filterAdvnSbu(data): Observable<any> {
        if (data.length > 0) {
            return of([])
        } else {
            return of([])
        }
    }

    filterAdvnVertical(data): Observable<any> {
        
        if (data.length > 0) {
            return of([])
        } else {
            return of([])
        }
    }

    filterAdvnCountry(data): Observable<any> {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        ...x,
                        'Name': (x.Name) ? x.Name : '',
                        'Id': (x.SysGuid) ? x.SysGuid : ''
                    }
                })
            } else {
                return of([])
            }
        } else {
            return of([])
        }
    }

    filterAdvnAlliacne(data): Observable<any> {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        ...x,
                        'Name': (x.Name) ? x.Name : '',
                        'Id': (x.Guid) ? x.Guid : '',
                        'Ownername': (x.Owner) ? (x.Owner.FullName) ? x.Owner.FullName : 'NA' : 'NA',
                        'AccId': (x.AccountNumber) ? (x.AccountNumber) : 'NA'
                    }
                })
            } else {
                return of([])
            }
        } else {
            return of([])
        }
    }

    filterAdvnAdvisor(data): Observable<any> {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        ...x,
                        'Name': (x.Name) ? x.Name : '',
                        'Id': (x.Guid) ? x.Guid : '',
                        'Ownername': (x.Owner) ? (x.Owner.FullName) ? x.Owner.FullName : 'NA' : 'NA',
                        'AccId': (x.AccountNumber) ? (x.AccountNumber) : 'NA'
                    }
                })
            } else {
                return of([])
            }
        } else {
            return of([])
        }
    }

    filterAdvnWiproSol(data): Observable<any> {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        ...x,
                        'Name': (x.Name) ? x.Name : '',
                        'Id': (x.SysGuid) ? x.SysGuid : '',
                        'Ownername': (x.OwnerName) ? (x.OwnerName) ? x.OwnerName : 'NA' : 'NA'
                    }
                })
            } else {
                return of([])
            }
        } else {
            return of([])
        }
    }
    filterAdvnActivity(data): Observable<any> {
        
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        ...x,
                        Name: (x.Name) ? x.Name : 'NA',
                        Id: (x.Guid) ? x.Guid : 'NA',
                        Ownername: (x.Owner) ? (x.Owner.FullName) ? x.Owner.FullName : 'NA' : 'NA',
                        AccName: (x.Account) ? (x.Account.Name) ? x.Account.Name : 'NA' : 'NA',
                        ActivityGroupName: (x.ActivityGroupName) ? x.ActivityGroupName : 'NA'
                    }
                })
            } else {
                return of([])
            }
        } else {
            return of([])
        }

    }
    filterAdvnCampaign(data): Observable<any> {
        
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        ...x,
                        Name: (x.Name) ? x.Name : '',
                        Id: (x.Id) ? x.Id : '',
                        Ownername: (x.Owner) ? (x.Owner.FullName) ? x.Owner.FullName : '' : '',
                        campaignId:(x.Code) ? x.Code : 'NA'
                    }
                })
            } else {
                return of([])
            }
        } else {
            return of([])
        }


    }
    filterAdvnOppor(data): Observable<any> {
        debugger
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        ...x,
                        Name: (x.Title) ? x.Title : '',
                        Owner: (x.OwnerName) ? x.OwnerName : 'NA',
                        OppId: (x.Code) ? x.Code : 'NA',
                        Id: (x.Guid) ? x.Guid : '',
                    }
                })
            } else {
                return of([])
            }
        } else {
            return of([])
        }

    }
    filterAdvnAgp(data): Observable<any> {

        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        ...x,
                        'Name': (x.Name) ? x.Name : '',
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

    filterAdvnOwner(data): Observable<any> {
        
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        ...x,
                        'Name': (x.FullName) ? x.FullName : '',
                        'Email': (x.Email) ? x.Email : '',
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

    filterAdvnContact(data): Observable<any> {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        ...x,
                        Name: (x.FullName) ? x.FullName : '',
                        Id: (x.Guid) ? x.Guid : '',
                        Designation: (x.Designation) ? x.Designation : '',
                        Email_ID: (x.Email) ? x.Email : '',
                        AccountName: (x.CustomerAccount) ? (x.CustomerAccount.Name) ? x.CustomerAccount.Name : '' : ''
                    }
                })
            } else {
                return of([])
            }
        } else {
            return of([])
        }
    }

    //////////////   Lead module Table Filter //////////////////////////////
    getActionListConfigData(data): Observable<any> {
        switch (data.filterData.headerName) {
            case 'Name':
                return this.getLeadNameColumnFilterData(data)
            case 'Owner':
                return this.getLeadOwnerColumnFilterData(data)
            case 'Account':
                return this.getLeadAccountColumnFilterData(data)
            case 'Source':
                return this.getLeadSourceColumnFilterData(data)
            case 'Status':
                return this.getLeadStatusColumnFilterData(data)
            case 'Activitygroup':
                return this.getLeadActivityColumnFilterData(data)
            default:
                return of([])
        }

    }

    getAppliedFilterLeadData(body) {
        return this.apiService.post(routes.getLeadFilteredList, body)
    }

    getLeadFilterNames(obj): Observable<any> {
        return this.apiService.post(routes.getFilterLeadNames, obj)
    }

    getFilterOwner(body): Observable<any> {
        return this.apiService.post(routes.getSearchFilterOwner, body)
    }

    getfilterAccountOrProspect(body): Observable<any>{
        return this.apiService.post(routes.getdAccountOrProspect, body).pipe(
            map(res =>{if(!res.IsError){
                return {
                    ...res,
                    ResponseObject : res.ResponseObject.map(data =>{
                        return {
                            ...data,
                            Account: {
                                SysGuid: data.Account.SysGuid,
                                Name: decodeURIComponent(data.Account.Name),
                                isProspect: data.Account.isProspect
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

    getfiltersearchLeadSource(body): Observable<any>{
        return this.apiService.post(routes.getSearchFilterSource, body) 
    }

    getLeadFilterStatus(obj): Observable<any> {
        return this.apiService.post(routes.getStatusFilter, obj)
    }

    getfilterActivityGroup(body): Observable<any>{
        return this.apiService.post(routes.getActivityGroupFilter, body) 
    }


    getLeadNameColumnFilterData(data: any): Observable<any> {
        if (data) {
            let body = this.leadListService.GetAppliedFilterData({ ...data})
            return this.getLeadFilterNames(body).pipe(switchMap(res => {
                return of((!res.IsError) ? { ...res, ResponseObject: this.filterLeadNamesColumn(res.ResponseObject) } : { ...res })
            }))
        }
    }

    // getLeadCreatedColumnFilterData(data: any): Observable<any> {
    //     if (data) {
    //         let body = {
    //             "SearchText": data.useFulldata.searchVal,
    //             "PageSize": data.useFulldata.pageSize,
    //             "OdatanextLink": data.useFulldata.nextLink,
    //             "RequestedPageNumber": data.useFulldata.pageNo,
    //             "SearchType": data.useFulldata.Searchtype
    //         }
    //         return this.getLeadFilterNamesOld(body).pipe(switchMap(res => {
    //             return of((!res.IsError) ? { ...res, ResponseObject: this.filteCreatedOnColumn(res.ResponseObject) } : { ...res })
    //         }))
    //     }
    // }
    getLeadStatusColumnFilterData(data: any): Observable<any> {
        if (data) {
            let body = this.leadListService.GetAppliedFilterData({ ...data})
            return this.getLeadFilterStatus(body).pipe(switchMap(res => {
                return of((!res.IsError) ? { ...res, ResponseObject: this.filterLeadStatusColumn(res.ResponseObject) } : { ...res })
            }))
        }
    }

    getLeadOwnerColumnFilterData(data: any): Observable<any> {
        if (data) {
            let body = this.leadListService.GetAppliedFilterData({ ...data})
            return this.getFilterOwner(body).pipe(switchMap(res => {
                return of((!res.IsError) ? { ...res, ResponseObject: this.filterLeadOwnerColumn(res.ResponseObject) } : { ...res })
            }))
        }
    }

    getLeadAccountColumnFilterData(data: any): Observable<any> {
        if (data) {
            let body = this.leadListService.GetAppliedFilterData({ ...data})
            return this.getfilterAccountOrProspect(body).pipe(switchMap(res => {
                return of((!res.IsError) ? { ...res, ResponseObject: this.filterLeadAccountColumn(res.ResponseObject) } : { ...res })
            }))
        }
    }


    getLeadSourceColumnFilterData(data: any): Observable<any> {
        if (data) {
            let requestparam = this.leadListService.GetAppliedFilterData({ ...data})
            return this.getfiltersearchLeadSource(requestparam).pipe(switchMap(res => {
                return of((!res.IsError) ? { ...res, ResponseObject: this.filterLeadSrcColumn(res.ResponseObject) } : { ...res })
            }))
        }
    }

    getLeadActivityColumnFilterData(data: any): Observable<any> {
        if (data) {
            let body = this.leadListService.GetAppliedFilterData({ ...data})
            return this.getfilterActivityGroup(body).pipe(switchMap(res => {
                return of((!res.IsError) ? { ...res, ResponseObject: this.filterLeadActivityColumn(res.ResponseObject) } : { ...res })
            }))
        }
    }

    filterLeadNamesColumn(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {

                        id: (x.LeadGuid) ? x.LeadGuid : '',
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


    // filteCreatedOnColumn(data) {

    //     if (data) {
    //         if (data.length > 0) {
    //             return data.map(x => {
    //                 return {

    //                     id: x.LeadGuid,
    //                     name: (x.CreatedOn) ? this.datepipe.transform(x.CreatedOn, 'd-MMM-yyyy') : '',
    //                     createdOn: (x.CreatedOn) ? x.CreatedOn : '',
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

    filterLeadAccountColumn(data: any) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {

                        id: (x.Account.SysGuid) ? x.Account.SysGuid : '',
                        name: (x.Account.Name) ? x.Account.Name : '',
                        isProspect: x.Account.IsProspect,
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

    filterLeadStatusColumn(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {

                        id: (x.SysGuid) ? x.SysGuid : '',
                        name: (x.Name) ? x.Name : '',
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

    filterLeadSrcColumn(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {

                        id: (x.SysGuid) ? x.SysGuid : '',
                        name: (x.Name) ? x.Name : '',
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

    filterLeadActivityColumn(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {

                        id: (x.SysGuid) ? x.SysGuid : '',
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

    filterLeadOwnerColumn(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {

                        id: (x.ownerId) ? x.ownerId : '',
                        name: (x.fullname) ? x.fullname : '',
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

    //     getLeadMoreViews():Observable<any>{
    //        return this.apiService.post(routes.getLeadMoreViewURL,{"EntityName": "lead"});
    //    }
    leadTabNavigations(item) {
        if(this.router.url.includes('accounts/accountleads')) {
            switch (item.index) {
                case 0:
                    this.router.navigate(['/accounts/accountleads/unqalified'])
                    return
                case 1:
                    this.router.navigate(['/accounts/accountleads/qualified'])
                    return
                case 2:
                    this.router.navigate(['/accounts/accountleads/archived'])
                    return
                case 3:
                    this.router.navigate(['/accounts/accountleads/diqualified'])
                    return
                case 4:
                    this.router.navigate(['/accounts/leads/leadMoreView'])
                    // window.open(`${this.envr.outlookConfig.redirectUri}/accounts/accountleads/leadMoreView`, "_blank");
                    // window.open(`${env.outlookConfig.redirectUri}/leads/leadMoreView`, "_blank","width=800,height=800");
                    return
            }
        } else {
            switch (item.index) {
                case 0:
                    this.router.navigate(['/leads/unqalified'])
                    return
                case 1:
                    this.router.navigate(['/leads/qualified'])
                    return
                case 2:
                    this.router.navigate(['/leads/archived'])
                    return
                case 3:
                    this.router.navigate(['/leads/diqualified'])
                    return
                case 4:
                    this.router.navigate(['/leads/leadMoreView'])
                    // window.open(`${this.envr.outlookConfig.redirectUri}/leads/leadMoreView`, "_blank");
                    // window.open(`${env.outlookConfig.redirectUri}/leads/leadMoreView`, "_blank","width=800,height=800");
                    return
            }
        }
        
    }

}
