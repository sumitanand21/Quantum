import { Injectable } from '@angular/core';

import { JsonApiService } from './json-api.service';
import { Observable, of, identity, Subject, from as fromPromise } from 'rxjs';

import { Conversation, Customer } from '../models/conversation.model';
import { ApiService } from './api.service';
import { map, switchMap, catchError } from 'rxjs/operators';
import { OfflineService } from './offline.services';
import { env } from 'process';
import { MeetingService } from './meeting.service';

// const BASE_URL = env.l2oBaseUrl;

const routes = {
    getCountry: 'v1/AccountManagement/CountryName',
    getValidations: 'v1/MasterManagement/ActivityTypeValildationConfig',
    getCity: 'v1/AccountManagement/CityName',
    createAppointment: 'Conversation/CreateAppointment',
    wiproSolution: 'v1/MeetingManagement/SolutionMasterIdByName',
    wiproContactSearchUser: 'v1/SearchManagement/SearchUser',
    SearchCustomerOrCompanyContact: 'v1/AccountManagement/SearchCustomerCompanyContact',
    CreateAppointmentWiproContact: 'v1/MeetingManagement/CreateAppointmentWiproContact',
    createAppointmentCustomerContact: 'v1/MeetingManagement/CreateAppointmentCustomerContact',
    createAppointmentAttachment: 'v1/MeetingManagement/CreateAppointment_Attachment',
    createAppointmentLead: 'v1/LeadManagement/CreateAppointmentLead',
    createAppointmentOpportunity: 'v1/OppertunityManagement/CreateAppointmentOpportunity',
    linkLeads: 'v1/LeadManagement/Search',
    leadOpportunity: 'v1/OppertunityManagement/Search',
    getConversationType: 'v1/MasterManagement/ConversationType',
    searchAccountCompany: 'v1/LeadManagement/AccountnProspect_V1',
    createProspect: 'v1/AccountManagement/CreateProspect',
    getRegionByName: 'v1/AccountManagement/RegionName',
    getGeographyByName: 'v1/AccountManagement/GetGeographyByName',
    getContactIdByName: 'v1/AccountManagement/GetContactIdByName',
    getDUNSID: 'v1/AccountManagement/DUNSID',
    getAccountIdByAccountName: 'v1/LeadManagement/GetAccountIdByAccountName',
    getOwnerSystemUserId: 'v1/AccountManagement/GetOwnerSystemUserId',
    SearchVerticalByname: 'v1/CampaignManagement/VerticalByName',
    getSubVerticalIdByName: 'v1/AccountManagement/SubVerticalName',
    updateConversationDetails: 'Conversation/UpdateConversation',
    delinkWiproParticipant: 'v1/MeetingManagement/DelinkAppointmentUserContact',
    delinkCustomerContact: 'v1/MeetingManagement/DelinkAppointmentCustomerContact',
    delinkOpportunity: 'v1/MeetingManagement/DelinkAppointment_n_Opportunity',
    delinkLead: 'v1/MeetingManagement/DelinkAppointment_n_Lead',
    TagWiproUserTOAppointments: 'v1/MeetingManagement/TagWiproUserTOAppointments',
    delinkTag: 'v1/MeetingManagement/DelinkTagWiproAppointments',
    createConversationCampaign: 'v1/MeetingManagement/CreateConversationCampaign',
    searhCampaign: 'v1/CampaignManagement/SearchByName',
    delinkCampaign: 'v1/MeetingManagement/DelinkConversationCampaign',
    UpdateChildConversation: 'Conversation/UpdateConversation',
    DeLinkAttachment: 'v1/MeetingManagement/DeLinkAppointment_Attachment',
    DownloadAttachments: 'v1/MeetingManagement/DownloadAttachments',
    DownloadSingleAttachment: 'v1/MeetingManagement/DownloadSingleAttachment',
    createAttachmentComment: 'Attachment/CreateAttachmentComment',
    updateAttachmentComment: 'Attachment/UpdateAttachmentComments',
    CreateActivityGroup: 'v1/ActivityGroupManagement/Create',
    EditActivityGroup: 'v1/ActivityGroupManagement/SearchList',
    updateActivityGroup: 'v1/ActivityGroupManagement/Update',

    CountryByRegion: 'v1/AccountManagement/CountryByRegion',
    StateByCountry: 'v1/AccountManagement/StateByCountry',
    CityByState: 'v1/AccountManagement/CityByState',
    RegionByGeo: 'v1/AccountManagement/RegionByGeo',
    ValidateAccount: 'v1/AccountManagement/ValidAccount',
    campaignBasedOnAccount: 'v1/CampaignManagement/SmallSearchByName'     //campaign based on account
}

export interface newConversationOverview {
    conversationName?: string,
    conversationType?: any,
    meetingDate?: Date,
    access?: boolean, home
    meetingSubject?: string,
    MoM: string,
    haveConsent: boolean,
    potentailWiproSolutions: potentialWiproSolution[],
    accountName: string,
    accountDetails: { sysGuid: string, isProspect: boolean },
    attachmetList: attachmetList[],
}

export interface attachmetList {
    Name: string,
    Url: string,
    Guid: string,
    addComments: string
}
export interface potentialWiproSolution {
    Name: string;
    sysGuid: string
}

export const CustomerContact: any[] = [
    { name: 'Name', title: 'Name' },
    { name: 'Email', title: 'Email Id' },
    { name: 'account', title: 'Account Name' }
]

export const WiproParticipant: any[] = [
    { name: 'Name', title: 'Name' },
    { name: 'Email', title: 'Email Id' },
    // {name: 'account', title: 'Account Name'}
]

//   export const TaggedUser : any[] = [
//     { name: 'Name', title: 'Name' },
//     { name: 'Email', title: 'Email Id' },
//     // {name: 'account', title: 'Account Name'}
//   ]

export const LinkedLeads: any[] = [
    { name: 'LeadName', title: 'Lead Name' },
    { name: 'Leadowner', title: 'Lead Owner' },
    { name: 'Account', title: 'Account Name' }
]

export const LinkedOpportunity: any[] = [
    { name: 'OpportunityName', title: 'Opportunity Name' },
    { name: 'Opportunityowner', title: 'Opportunity Owner' },
    { name: 'OpportunityNumber', title: 'Opportunity Number' }
]

export const PotentialWiproSolution: any[] = [
    { name: 'SolutionName', title: 'Solution Name' },
    { name: 'SolutionOwner', title: 'Owner Name' }
]

export const LinkedCampaign: any[] = [
    { name: 'Campaignname', title: 'Campaign Name' },
    { name: 'Campaignid', title: 'Campaign Id' },
    { name: 'Campaignowner', title: 'Campaign Owner' }
]


export const NewActivityHeaders = {
    'CustomerContactSearch': CustomerContact,
    'WiproParticipantSearch': WiproParticipant,
    'TaggedUserSearch': WiproParticipant,
    'PotentialWiproSolutionSearch': PotentialWiproSolution,
    'LinkedCampaignSearch': LinkedCampaign,
    'LinkedLeadsSearch': LinkedLeads,
    'LinkedOpportunityOrderSearch': LinkedOpportunity
}

export const NewActivityAdvNames = {
    'CustomerContactSearch': { name: 'Customer participants', isCheckbox: true, isAccount: false },
    'WiproParticipantSearch': { name: 'Wipro participants', isCheckbox: true, isAccount: false },
    'TaggedUserSearch': { name: 'Private access', isCheckbox: true, isAccount: false },
    'PotentialWiproSolutionSearch': { name: 'Potential wipro solutions', isCheckbox: true, isAccount: false },
    'LinkedCampaignSearch': { name: 'Linked campaigns', isCheckbox: true, isAccount: false },
    'LinkedLeadsSearch': { name: 'Linked leads', isCheckbox: true, isAccount: false },
    'LinkedOpportunityOrderSearch': { name: 'Linked opportunities', isCheckbox: true, isAccount: false }
}



@Injectable({
    providedIn: 'root'
})

export class newConversationService {
    Id: any;
    conversationValue: newConversationOverview;
    attachList: any = [];
    http: any;
    private subject = new Subject<{ name: string }>();
    customerDetails: any
    constructor(
        private jsonApiService: JsonApiService,
        private apiService: ApiService,
        public offlineServices: OfflineService,
        private meetingService: MeetingService, ) { }

    setActivityGroupName(name: string) {
        this.subject.next({ name: name });
    }

    clearActivityGroupName() {
        this.subject.next();
    }

    getActivityGroupName(): Observable<any> {
        return this.subject.asObservable();
    }

    set conversationAppointId(id) {
        this.Id = id
    }

    get conversationAppointId() {
        return this.Id
    }

    set LeadAppointId(id) {
        this.Id = id
    }

    get LeadAppointId() {
        return this.Id
    }

    set conversationFiledInformation(value) {
        this.conversationValue = value;
    }

    get conversationFiledInformation() {
        return this.conversationValue;
    }

    getPruspectAllCuntries(Guid: any, objct: any): Observable<any> {
        var body = {
            "Guid": Guid,
            "SearchText": objct
        }
        return this.apiService.post(routes.CountryByRegion, body)
    }


    getAllCuntries(objct: any): Observable<any> {
        var body = {
            "SearchText": objct
        }
        return this.apiService.post(routes.getCountry, body)
    }

    getProspectAllCities(Guid: any, objct: any): Observable<any> {
        var body = {
            "Guid": Guid,
            "SearchText": objct
        }
        return this.apiService.post(routes.CityByState, body)
    }

    getAllCities(objct: any): Observable<any> {
        var body = {
            "SearchText": objct
        }
        return this.apiService.post(routes.getCity, body)
    }

    getNewAllCity(objct: any) {
        var body = {
            "SearchText": objct
        }
        return this.apiService.post(routes.getCity, body)
    }

    GetValidations(Id: number) {
        let body = {
            Id: Id
        }
        debugger
        return this.apiService.post(routes.getValidations, body)
    }
    ValidateAccount(accountGuid: any, isProspect, Moduletype: number) {
        var body = {
            "AccountGuid": accountGuid,
            "isProspect": isProspect,
            "Moduletype": Moduletype
        }
        return this.apiService.post(routes.ValidateAccount, body)
    }

    getAllStates(Guid: any, body: any): Observable<any> {
        var searchBody = {
            "Guid": Guid,
            "SearchText": body

        }
        return this.apiService.post(routes.StateByCountry, searchBody)
    }

    getWiproSolution(value, Serviceparam?): Observable<any> {
        var body = {
            "SearchText": value,
            "PageSize": 10,
            "OdatanextLink": '',
            "RequestedPageNumber": 1
        }
        return this.apiService.post(routes.wiproSolution, (Serviceparam) ? Serviceparam : body)
    }

    createAppointment(body): Observable<any> {
        return this.apiService.post(routes.createAppointment, body)
    }

    getUpdateConversationDetails(body): Observable<any> {
        return this.apiService.post(routes.updateConversationDetails, body)

    }

    getUpdateChildConversationDetails(body): Observable<any> {
        return this.apiService.post(routes.UpdateChildConversation, body)

    }

    searchUser(value, Serviceparam?): Observable<any> {
        var body = {
            "SearchText": value,
            "PageSize": 10,
            "OdatanextLink": '',
            "RequestedPageNumber": 1
        }
        return this.apiService.post(routes.wiproContactSearchUser, (Serviceparam) ? Serviceparam : body)
    }

    SearchCustomerOrCompanyContact(value: any): Observable<any> {
        var body = {
            "searchText": value
        }
        return this.apiService.post(routes.SearchCustomerOrCompanyContact, body)
    }

    createAppointmentWiproContact(adid: any, sysGuid: any, guId: any): Observable<any> {
        var body = {
            "WiproParticipant": [
                {
                    "AdId": adid,
                    "SysGuid": sysGuid
                }
            ],
            "Appointment_Guid": guId
        }
        return this.apiService.post(routes.CreateAppointmentWiproContact, body)
    }

    TagWiproUserTOAppointments(Appointment_Guid, Guid) {
        var body = {
            "Appointment_Guid": Appointment_Guid,
            "TagCustomerToView": [
                { "SysGuid": Guid }
            ]
        }
        return this.apiService.post(routes.TagWiproUserTOAppointments, body)
    }

    createAppointmentCustomerContact(guId: any, sysGuId: any): Observable<any> {
        var body = {
            "Appointment_Guid": guId,
            "CustomerContacts": [{
                "Guid": sysGuId
            }]
        }
        return this.apiService.post(routes.createAppointmentCustomerContact, body)
    }

    createAppointmentAttachment(sysGuid: any, Attachments: any) {
        var body = {
            "Appointment_Guid": sysGuid,
            "Attachments": Attachments
        }
        return this.apiService.post(routes.createAppointmentAttachment, body)
    }

    createAppointmentLead(sysGuid: any, leads: any): Observable<any> {
        var body = {

            "Appointment_Guid": sysGuid,
            "Leads": [{
                "LeadGuid": leads
            }]
        }
        return this.apiService.post(routes.createAppointmentLead, body)
    }

    createAppointmentOpportunity(sysGuid: any, opportunity: any): Observable<any> {
        var body = {

            "Appointment_Guid": sysGuid,
            "Opportunities": [{
                "OpporGuid": opportunity
            }]
        }
        return this.apiService.post(routes.createAppointmentOpportunity, body)
    }

    createLinkLeads(value) {

        var body = {
            "SearchText": value,
            "SearchType": 3
        }
        return this.apiService.post(routes.linkLeads, body)
    }

    createLinkOpportunity(value) {
        var body = {
            "searchText": value
        }
        return this.apiService.post(routes.leadOpportunity, body)
    }

    getConversationType() {
        return this.apiService.post(routes.getConversationType)
        // return fromPromise(this.getMasterCache(routes.getConversationType)).pipe(
        //     switchMap(cacheresult => {
        //         console.log(cacheresult)
        //         if (cacheresult) {
        //             return of(cacheresult)
        //         } else {
        //             return this.apiService.post(routes.getConversationType);
        //         }
        //     }), catchError(err => {
        //         return []
        //     })

        // )
    }

    getsearchAccountCompany(val, serviceParam?): Observable<any> {
        var body = {
            "SearchText": val,
            "PageSize": 10,
            "OdatanextLink": "",
            "RequestedPageNumber": 1
        }

        return this.apiService.post(routes.searchAccountCompany, (serviceParam) ? serviceParam : body).pipe(
            map(res =>{if(!res.IsError){
                return {
                    ...res,
                    ResponseObject : res.ResponseObject.map(res1 =>{
                        return {
                            ...res1,
                            Name : res1.Name?decodeURIComponent(res1.Name) : "NA"
                        }
                    })
                }
            }else{
                return res
            }
            })
        );
    }



    //create prospect account API Calls

    createProspectAccountPost(objct: any): Observable<any> {
        return this.apiService.post(routes.createProspect, objct)
    }


    getRegionByName(Guid: any, objct: any): Observable<any> {
        var body = {
            "Guid": Guid,
            "SearchText": objct,
            "PageSize": 10,
            "OdatanextLink": "",
            "RequestedPageNumber": 1
        }
        return this.apiService.post(routes.RegionByGeo, body)
    }

    getGeographyByName(objct: any): Observable<any> {
        var body = {
            "SearchText": objct,
            "PageSize": 10,
            "OdatanextLink": "",
            "RequestedPageNumber": 1
        }
        return this.apiService.post(routes.getGeographyByName, body)
    }

    getContactIdByName(objct: any): Observable<any> {
        var body = {
            "SearchText": objct
        }
        return this.apiService.post(routes.getContactIdByName, body)
    }

    getDUNSID(objct: any): Observable<any> {
        var body = {
            "SearchText": objct
        }
        return this.apiService.post(routes.getDUNSID, body)
    }

    getAccountIdByAccountName(objct: any): Observable<any> {
        var body = {
            "SearchText": objct
        }
        return this.apiService.post(routes.getAccountIdByAccountName, body)
    }

    getOwnerSystemUserId(objct: any): Observable<any> {
        var body = {
            "SearchText": objct
        }
        return this.apiService.post(routes.getOwnerSystemUserId, body)
    }

    getSearchVerticalByname(objct: any): Observable<any> {
        var body = {
            "SearchText": objct
        }
        return this.apiService.post(routes.SearchVerticalByname, body);
    }

    getSubVerticalIdByName(objct: any): Observable<any> {
        var body = {
            "SearchText": objct
        }
        return this.apiService.post(routes.getSubVerticalIdByName, body);
    }

    delinkWiproParticipant(id) {
        var body = {
            "MapGuid": id
        }
        return this.apiService.post(routes.delinkWiproParticipant, body)
    }

    delinkCustomerContact(id) {
        var body = {
            "MapGuid": id
        }
        return this.apiService.post(routes.delinkCustomerContact, body)
    }

    delinkOpportunity(id) {
        var body = {
            "MapGuid": id
        }
        return this.apiService.post(routes.delinkOpportunity, body)
    }

    delinkLead(id) {
        var body = {
            "MapGuid": id
        }
        return this.apiService.post(routes.delinkLead, body)
    }

    delinkTag(id) {
        var body = {
            "MapGuid": id
        }
        return this.apiService.post(routes.delinkTag, body)
    }

    createConversationCampaign(parentId, campaignId) {
        var body = {
            "Conversation_Guid": parentId,  //Conversation id
            "Campaign": [
                {
                    "Id": campaignId     //campaign id
                }
            ]
        }
        return this.apiService.post(routes.createConversationCampaign, body)
    }

    searhCampaign(searchText, Serviceparam?) {
        var body =
        {
            "SearchText": searchText,
            "SearchType": 1,
            "PageSize": 10,
            "OdatanextLink": "",
            "RequestedPageNumber": 1
        }
        return this.apiService.post(routes.searhCampaign, (Serviceparam) ? Serviceparam : body)
    }

    campaignBasedOnAccount(searchText, Guid, isProspect, Serviceparam?) {
        var body = {
            "Searchtext": searchText,
            "SearchType": 1,
            "Guid": Guid,
            "isProspect": isProspect,
            "PageSize": 10,
            "OdatanextLink": "",
            "RequestedPageNumber": 1
        }
        return this.apiService.post(routes.campaignBasedOnAccount, (Serviceparam) ? Serviceparam : body)
    }

    delinkCampaign(id) {
        var body = {
            "MapGuid": id
        }
        return this.apiService.post(routes.delinkCampaign, body)
    }

    deLinkAttachment(id) {
        var body = {
            "MapGuid": id
        }
        return this.apiService.post(routes.DeLinkAttachment, body)
    }

    createAttachmentComment(object: any): Observable<any> {
        return this.apiService.post(routes.createAttachmentComment, object)
    }

    updateAttachmentComment(object: any): Observable<any> {
        return this.apiService.post(routes.updateAttachmentComment, object)
    }

    set attachmentList(attach) {
        this.attachList = attach
    }

    get attachmentList() {
        return this.attachList
    }

    downloadAll(Attachments) {
        var body = {
            "Attachments": Attachments
        }
        return this.apiService.post(routes.DownloadAttachments, body)
    }

    DownloadSingleAttachment(Attachments) {
        var body = {
            "Attachments": [
                Attachments
            ]
        }
        return this.apiService.post(routes.DownloadSingleAttachment, body)
    }

    async getMasterCache(key: string) {
        // return true
        const CacheRes = await this.offlineServices.getMasterDataCache(key)
        console.log("got cache respo se master")
        console.log(CacheRes)
        // return []
        if (CacheRes) {
            return CacheRes.data
        } else {
            return null
        }
    }
    get customerContact() {
        return this.customerDetails
    }

    set customerContact(value) {
        this.customerDetails = value
    }

    getCreateActivityGroup(body): Observable<any> {
        return this.apiService.post(routes.CreateActivityGroup, body)
    }

    AcivityGroupNameSearch(objct: any): Observable<any> {
        var body = {
            "SearchText": objct
        }

        return this.apiService.post(routes.EditActivityGroup, body)
    }
    updateActivityGroupEdit(body: any): Observable<any> {
        return this.apiService.post(routes.updateActivityGroup, body)
    }

    // Getting the current page number
    sendPageNumber: any;

    set sendPageNumberData(value: any) {
        this.sendPageNumber = value;
    }

    get sendPageNumberData() {
        return this.sendPageNumber
    }

    // Getting the current page size

    sendPageSize: any;

    set sendPageSizeData(value: any) {
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


    getLookUpFilterData(data): Observable<any> {
        switch (data.controlName) {
            case 'CustomerContactSearch':
                return this.getCustomerContactData(data);
            case 'WiproParticipantSearch':
                return this.getWiproAndTaggedData(data);
            case 'TaggedUserSearch':
                return this.getWiproAndTaggedData(data);
            case 'PotentialWiproSolutionSearch':
                return this.getPotentialWiproSolution(data);
            case 'LinkedCampaignSearch':
                return this.getLinkedCampaign(data);
            case 'LinkedLeadsSearch':
                return this.getLinkedLeadsData(data);
            case 'LinkedOpportunityOrderSearch':
                return this.getLinkedOpportunityOrder(data);
        }
    }

    getLinkedLeadsData(data): Observable<any> {
        debugger
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
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: this.filterLinkLeads(res.ResponseObject) } : { ...res })
                } else {
                    return of([])
                }
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
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject:  this.filterLinkedOpportunity(res.ResponseObject) } : { ...res })
                } else {
                    return of([])
                }
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


    getCustomerContactData(data): Observable<any> {
        if (data.isService) {
            let body = {
                "SearchText": data.useFullData.searchVal,
                "Guid": data.useFullData.guid,
                "isProspect": data.useFullData.isProspect,
                "PageSize": data.useFullData.recordCount,
                "OdatanextLink": data.useFullData.OdatanextLink,
                "RequestedPageNumber": data.useFullData.pageNo
            }
            return this.meetingService.searchCustomerparticipants(null, null, null, body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: this.filterCustomerContact(res.ResponseObject) } : { ...res })
                } else {
                    return of([])
                }
            }))
        } else {
            return of(this.filterCustomerContact(data.data))
        }
    }

    filterCustomerContact(data): Observable<any> {
        debugger
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        ...x,
                        'Name': (x.FullName) ? x.FullName : 'NA',
                        'Email': (x.Email) ? x.Email : 'NA',
                        'account': (x.CustomerAccount) ? x.CustomerAccount.Name : 'NA',
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


    getWiproAndTaggedData(data): Observable<any> {
        if (data.isService) {
            let body = {
                "SearchText": data.useFullData.searchVal,
                //   "Guid": data.useFullData.guid,
                //   "isProspect": data.useFullData.isProspect,
                "PageSize": data.useFullData.recordCount,
                "OdatanextLink": data.useFullData.OdatanextLink,
                "RequestedPageNumber": data.useFullData.pageNo
            }
            return this.searchUser('', body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: this.filterWiproAndTaggedData(res.ResponseObject) } : { ...res })
                } else {
                    return of([])
                }
            }))
        } else {
            return of(this.filterWiproAndTaggedData(data.data))
        }
    }

    filterWiproAndTaggedData(data): Observable<any> {
        debugger
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        ...x,
                        'Name': (x.FullName) ? x.FullName : 'NA',
                        'Id': (x.SysGuid) ? x.SysGuid : '',
                        'Email': (x.Email) ? x.Email : 'NA',
                        // 'account' : (x.CustomerAccount) ? x.CustomerAccount.Name : 'NA',

                    }
                })
            } else {
                return of([])
            }
        } else {
            return of([])
        }
    }

    getPotentialWiproSolution(data): Observable<any> {
        if (data.isService) {
            let body = {
                "SearchText": data.useFullData.searchVal,
                "PageSize": data.useFullData.recordCount,
                "OdatanextLink": data.useFullData.OdatanextLink,
                "RequestedPageNumber": data.useFullData.pageNo
            }
            return this.getWiproSolution('', body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: this.filterPotentialWiproSolution(res.ResponseObject)} : { ...res })
                } else {
                    return of([])
                }
            }))
        } else {
            return of(this.filterPotentialWiproSolution(data.data))
        }
    }

    filterPotentialWiproSolution(data): Observable<any> {
        debugger
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        ...x,
                        'SolutionName': (x.Name) ? x.Name : 'NA',
                        'SolutionOwner': (x.OwnerName) ? x.OwnerName : 'NA',
                        'SolutionOwnerId': (x.OwnerId) ? x.OwnerId : '',
                        // 'account' : (x.CustomerAccount) ? x.CustomerAccount.Name : 'NA',
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


    getLinkedCampaign(data): Observable<any> {
        if (data.isService) {
            let body = {
                "SearchText": data.useFullData.searchVal,
                "SearchType": 1,
                "PageSize": data.useFullData.recordCount,
                "OdatanextLink": data.useFullData.OdatanextLink,
                "RequestedPageNumber": data.useFullData.pageNo,
                "Guid": data.useFullData.guid,
                "isProspect": data.useFullData.isProspect,
            }
            return this.campaignBasedOnAccount('', null, null, body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject:this.filterLinkedCampaign(res.ResponseObject) } : { ...res })
                } else {
                    return of([])
                }
            }))
        } else {
            return of(this.filterLinkedCampaign(data.data))
        }
    }


    filterLinkedCampaign(data): Observable<any> {
        debugger
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        ...x,
                        'Campaignname': (x.Name) ? x.Name : 'NA',
                        'Campaignowner': (x.Owner) ? x.Owner.FullName : 'NA',
                        'Campaignid': (x.Code) ? x.Code : 'NA',
                        'Id': (x.Id) ? x.Id : '',
                    }
                })
            } else {
                return of([])
            }
        } else {
            return of([])
        }
    }
}

