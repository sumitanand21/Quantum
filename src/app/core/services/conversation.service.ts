import { Injectable } from '@angular/core';

import { JsonApiService } from './json-api.service';
import { Observable, of } from 'rxjs';
import { environment as env, environment } from "@env/environment";
import { Conversation, Customer } from '../models/conversation.model';
import { ApiService } from './api.service';
import { map, tap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import { element } from '@angular/core/src/render3/instructions';
import { OnlineOfflineService } from './online-offline.service';
import { OfflineService } from './offline.services'
import Dexie from 'dexie';
import { EncrDecrService } from './encr-decr.service';
import { Router } from '@angular/router';
import { EnvService } from './env.service';

const httpOptions = {
    headers: {
        'content-type': 'application/json',
        'Authorization': localStorage.getItem("token")
        // 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjNmQ0NGQwMDM3YmFiMzE5ODc3YzMxYyIsImlhdCI6MTU1MDY2NDkxMn0.kR6xN5qfUM3Nfvj0mhty__9E5OFTDnaGxvJokdVSUNk',
        // 'Key': 'authorization', 
    }
};



const routes = {
    conversations: '/conversations',
    conversationsListApi: 'Conversation/GetConversation',
    getArchivedConversation: 'Conversation/GetArchievedConversations',
    conversationSearch: 'Conversation/SearchConversation',
    conversationDetails: 'Conversation/GetConversationDetails',
    conversation: (id: number) => `/conversations/${id}`,
    createAppointment: 'Conversation/CreateAppointment',
    newAction: 'v1/MeetingManagement/ConversationAction',
    customer: 'v1/AccountManagement/CreateCustomerContact',
    createProspect: 'v1/AccountManagement/CreateProspect',
    pivotal: 'v1/MeetingManagement/MarkConversationAsPivotal',
    childConversation: 'Conversation/GetChildConversation',
    conversationAction: 'v1/ActionManagement/GetConversationAction',
    getEmployeeNCustomerBoth: 'v1/SearchManagement/GetEmployeeNCustomerBoth',    //share conversation (email TO)        //share conversation (email SEND)
    dashboardTask: 'v1/NotificationManagement/GetTaskList',
    // shareConversation: 'Conversation/ShareConversation',           //share conversation (email SEND)
    shareConversation: 'v1/MeetingManagement/Share',             //share conversation (email SEND)
    childinfoDetails: 'Conversation/GetChildConversationAppointmentDetails',
    SetTasksCompleted: 'v1/NotificationManagement/SetTasksCompleted',
    GetMyConversations: 'Conversation/GetMyConversations',
    MultipleMarkConversationAsPivotal: 'v1/MeetingManagement/MultipleMarkConversationAsPivotal',
    SpeechRecognitionService: 'https://speechtotextwip.azurewebsites.net/',
    FilterList: 'v1/ActivityGroupManagement/FilterList',
    SearchLeads: 'v1/MeetingManagement/SearchLeads',
    SearchOpportunity: 'v1/MeetingManagement/SearchOpportunity_V1',
    FilterSearchName: 'v1/ActivityGroupManagement/FilterSearchList',
    GetAccountGuidsapi: 'v1/LeadManagement/AccountnProspect_V1',
    SearchOwner: 'v1/LeadManagement/SearchOwner',
    MeetingCount: "v1/ActivityGroupManagement/ColumnMeetingCountFilter",
    OtherCount: "v1/ActivityGroupManagement/ColumnOtherActivityCountFilter",
    ActionCount: "v1/ActivityGroupManagement/ColumnActionCountFilter",


    //list column filter
    GetFilterSearchList: 'v1/ActivityGroupManagement/FilterSearchList_V1',
    GetFilterSearchAccountOrProspect: 'v1/ActivityGroupManagement/FilterSearchAccountOrProspect',
    GetFilterSearchOwner: 'v1/ActivityGroupManagement/FilterSearchOwner',
    GetFilterMeetingCount: 'v1/ActivityGroupManagement/FilterMeetingCount',
    GetFilterActionCount: 'v1/ActivityGroupManagement/FilterActionCount',
    GetFilterOtherActivityCount: 'v1/ActivityGroupManagement/FilterOtherActivityCount',
    GetFilterLeads: 'v1/ActivityGroupManagement/FilterLeads',
    GetFilterOpp:'v1/ActivityGroupManagement/FilterOpportunitiesOrOrders'
};

export const conversationheader: any[] = [

    { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Activity group', routerLink: '/conversations/conversationthread/Reimagineprocurementprocess1/childthreadtab', selectName: "Activity group", SortId: 0 },
    // { id: 2, isFilter:false, name: 'ActivityType', isFixed: false, order: 2, title: 'Activity type'}, 
    { id: 2, isFilter: false, name: 'Account', isFixed: false, order: 2, title: 'Account name', className: "approvalstatus", SortId: 2 },
    { id: 3, isFilter: false, name: 'Owner', isFixed: false, order: 3, title: 'Activity owner', SortId: 6 },
    { id: 4, isFilter: false, name: 'Meetings', isFixed: false, order: 4, title: 'Meetings(#)', className: "textcenter", SortId: 20, displayType: 'number' },
    { id: 5, isFilter: false, name: 'Actions', isFixed: false, order: 5, title: 'Actions(#)', className: "textcenter", SortId: 22, displayType: 'number' },
    { id: 6, isFilter: false, name: 'Orders', isFixed: false, order: 6, title: 'Other activities(#)', className: "textcenter", SortId: 21, displayType: 'number' },
    // { id: 7, isFilter: false, name: 'Leadname', isFixed: false, order: 7, title: 'Linked leads', isModal: true, className: "approvalstatus", SortId: 0, displayType: 'capsFirstCase' },
    // { id: 8, isFilter: false, name: 'Linkedopp', isFixed: false, order: 8, title: 'Linked opportunities/orders', isModal: true, className: "approvalstatus", SortId: 0, displayType: 'capsFirstCase' },

]

export const accountconversationheader: any[] = [

    { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Activity group', routerLink: '/conversations/conversationthread/Reimagineprocurementprocess1/childthreadtab', selectName: "Activity group", SortId: 0 },
    // { id: 2, isFilter:false, name: 'ActivityType', isFixed: false, order: 2, title: 'Activity type'}, 
    // { id: 2, isFilter: false, name: 'Account', isFixed: false, order: 2, title: 'Account name', className: "approvalstatus", SortId: 2 },
    { id: 2, isFilter: false, name: 'Owner', isFixed: false, order: 2, title: 'Activity owner', SortId: 6 },
    { id: 3, isFilter: false, name: 'Meetings', isFixed: false, order: 3, title: 'Meetings(#)', className: "textcenter", SortId: 20, displayType: 'number' },
    { id: 4, isFilter: false, name: 'Actions', isFixed: false, order: 4, title: 'Actions(#)', className: "textcenter", SortId: 22, displayType: 'number' },
    { id: 5, isFilter: false, name: 'Orders', isFixed: false, order: 5, title: 'Other activities(#)', className: "textcenter", SortId: 21, displayType: 'number' },
    // { id: 7, isFilter: false, name: 'Leadname', isFixed: false, order: 7, title: 'Linked leads', isModal: true, className: "approvalstatus", SortId: 0, displayType: 'capsFirstCase' },
    // { id: 8, isFilter: false, name: 'Linkedopp', isFixed: false, order: 8, title: 'Linked opportunities/orders', isModal: true, className: "approvalstatus", SortId: 0, displayType: 'capsFirstCase' },

]

// export const conversationheader: any[] = [
//     { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Conversation name', routerLink: '/conversations/conversationthread/ReimagineProcurementprocess1/childthreadtab' },
//     { id: 2, isFilter: false, name: 'Owner', isFixed: false, order: 2, title: 'Owner' },
//     { id: 3, isFilter: false, name: 'Account', isFixed: false, order: 3, title: 'Account/Company' },
//     { id: 4, isFilter: false, name: 'DateCreated', isFixed: false, order: 4, title: 'Meeting date' },
//     { id: 5, isFilter: false, name: 'Trailid', isFixed: false, order: 5, title: 'Trail ID' },
//     { id: 6, isFilter: false, name: 'Leadname', isFixed: false, order: 6, title: 'Leads linked', isModal: true },
//     { id: 7, isFilter: false, name: 'Linkedopp', isFixed: false, order: 7, title: 'Opportunities linked', isModal: true },
// ]

@Injectable({
    providedIn: 'root'
})

export class ConversationService {
    imageToTextApi = 'v1/AccountManagement/BusinessCard'
    // imageToTextApi: string = "https://ocr-dev.wipro.com/v2.0/ocr/businesscard";
    // profileImageToTextApi = "https://l2o-api.azurewebsites.net/api/Storage/UploadDocument";
    cachedArray = [];
    Id: any;
    name: any;
    empId: any;
    private db: any;
    public readonly ConversationChacheType = {
        Table: "Table",
        Details: "Details",
        MeetingTypes: "MeetingTypes"
    }
    public readonly ConvTableIdentify = {
        conversation: 1,
        archived: 2,
        childConversation: 3

    }
    constructor(
        public envr : EnvService,
        private encrDecrService: EncrDecrService,
        private router: Router,
        private jsonApiService: JsonApiService,
        private apiService: ApiService, private http: HttpClient,
        public datepipe: DatePipe, private readonly onlineOfflineService: OnlineOfflineService, private offlineServices: OfflineService) {

        //check if Internet connection is ON/OFF
        // if (this.onlineOfflineService.isOnline) {

        this.db = new Dexie('L2O');
        this.db.version(1).stores({ conversation: 'id,data' });
        // }

    }

    set conversationId(id) {
        this.Id = id
    }

    get conversationId() {
        return this.Id
    }


    set conversationName(name) {
        this.name = name
    }

    get conversationName() {
        return this.name
    }

    set employeeId(employeeId) {
        this.empId = employeeId;
    }

    get employeeId() {
        return this.empId;
    }

    sendConvToCampaign: any;

    set sendConvToCampaignData(value: any) {
        this.sendConvToCampaign = value;
    }

    get sendConvToCampaignData() {
        return this.sendConvToCampaign
    }

    conversationTrue: any;
    threadTrue: any;

    set conversationTrues(value) {
        this.conversationTrue = value;
    }

    get conversationTrues() {
        return this.conversationTrue
    }

    set getThreadTrue(value) {
        this.threadTrue = value
    }

    get getThreadTrue() {
        return this.threadTrue
    }

    accountGuid: any;

    set accountSysGuid(value) {
        this.accountGuid = value
    }

    get accountSysGuid() {
        return this.accountGuid
    }

    routeId
    set routerId(value) {
        this.routeId = value;

    }

    get routerId() {
        return this.routeId
    }

    getAll(): Observable<Conversation[]> {
        return this.apiService.get(routes.conversations);
    }

    getSingle(id: number): Observable<Conversation> {
        return this.apiService.get(routes.conversation(id));
    }
    getParentHeaderData(): Observable<any[]> {
        return of(conversationheader);
    }


    // conversation List API Modified by Shankara
    getAllConversations(): Observable<any> {
        return this.apiService.post(routes.conversationsListApi).pipe(
            map(conversationList => {
                return {
                    coversations: conversationList.ResponseObject.map(conversation => {
                        console.log(conversation)
                        var accountName = ""
                        var sysguid = ""
                        const leadContacts = [];
                        const oppContacts = [];

                        if (conversation.Leads !== undefined) {
                            if (conversation.Leads.Title !== undefined) {
                                conversation.Leads.forEach(element => {
                                    leadContacts.push(element.Title)
                                });
                            } else {
                                conversation.Leads.forEach(element => {
                                    leadContacts.push(element.Title)
                                });
                            }
                        }
                        if (conversation.Opportunities !== undefined) {
                            if (conversation.Opportunities.Title !== undefined) {
                                conversation.Opportunities.forEach(element => {
                                    oppContacts.push(element.Title)
                                });
                            } else {
                                conversation.Opportunities.forEach(element => {
                                    oppContacts.push(element.Title)
                                });
                            }
                        }

                        if (conversation.Account === undefined) {
                            accountName = "NA"
                        }
                        if (conversation.Account !== undefined) {
                            if (conversation.Account.Name !== undefined) {
                                accountName = conversation.Account.Name
                                sysguid = conversation.Account.SysGuid
                            } else {
                                accountName = conversation.Account.Name
                                sysguid = conversation.Account.SysGuid
                            }
                        }

                        return {
                            id: conversation.ParentId,
                            Name: (conversation.Name).trim() || "NA",
                            Owner: conversation.Owner.FullName || "NA",
                            Account: accountName,
                            DateCreated: this.datepipe.transform(conversation.CreatedOn, 'd-MMM-y'),
                            Trailid: conversation.TrailId || "NA",
                            Leadname: leadContacts.length > 0 ? leadContacts : ["NA"],
                            Linkedopp: oppContacts.length > 0 ? oppContacts : ["NA"],
                            accountSysGuid: sysguid,
                            OpprtunityForGuid: conversation.Opportunities,
                            LeadForGiud: conversation.Leads,
                            Campaign: conversation.Campaign
                        };
                    }),
                };
            })
        )
    }
    GetMyConversations() {
        return this.apiService.post(routes.GetMyConversations).pipe(
            map(myConversationList => {
                return {
                    myConversations: myConversationList.ResponseObject.map(
                        myConversation => {
                            var accountName = ""
                            var sysguid = ""
                            const leadContacts = [];
                            const oppContacts = [];
                            if (myConversation.Leads !== undefined) {
                                if (myConversation.Leads.Title !== undefined) {
                                    myConversation.Leads.forEach(element => {
                                        leadContacts.push(element.Title)
                                    });
                                } else {
                                    myConversation.Leads.forEach(element => {
                                        leadContacts.push(element.Title)
                                    });
                                }
                            }
                            if (myConversation.Opportunities !== undefined) {
                                if (myConversation.Opportunities.Title !== undefined) {
                                    myConversation.Opportunities.forEach(element => {
                                        oppContacts.push(element.Title)
                                    });
                                } else {
                                    myConversation.Opportunities.forEach(element => {
                                        oppContacts.push(element.Title)
                                    });
                                }
                            }
                            if (myConversation.Account === undefined) {
                                accountName = "NA"
                            }
                            if (myConversation.Account !== undefined) {
                                if (myConversation.Account.Name !== undefined) {
                                    accountName = myConversation.Account.Name
                                    sysguid = myConversation.Account.SysGuid
                                } else {
                                    accountName = myConversation.Account.Name
                                    sysguid = myConversation.Account.SysGuid
                                }
                            }
                            return {
                                id: myConversation.ParentId,
                                Name: myConversation.Name || "NA",
                                Owner: myConversation.Owner.FullName || "NA",
                                Account: accountName,
                                DateCreated: this.datepipe.transform(myConversation.CreatedOn, 'd-MMM-y'),
                                Trailid: myConversation.TrailId || "NA",
                                Leadname: leadContacts.length > 0 ? leadContacts : ["NA"],
                                Linkedopp: oppContacts.length > 0 ? oppContacts : ["NA"],
                                accountSysGuid: sysguid,
                                OpprtunityForGuid: myConversation.Opportunities,
                                LeadForGiud: myConversation.Leads,
                                Campaign: myConversation.Campaign
                            }
                        }
                    )
                }
            })
        )
    }

    // get task list
    getTaskList(requestData: GetTaskList): Observable<any> {
        return this.apiService.post(routes.dashboardTask, requestData)
    }

    // get Conversation

    getAllConversationDetails(requestData: GetAllConversation): Observable<any> {

        return this.apiService.post(routes.conversationsListApi, requestData)

    }

    getMyConversationApi(requestData) {
        return this.apiService.post(routes.GetMyConversations, requestData)
    }

    async getMyConversationCacheData() {
        console.log("get MY CachedConvesartion")
        const TablePageData = await this.offlineServices.getMyConversationTableIndexCacheData()

        if (TablePageData.length > 0) {
            return TablePageData[0]
        } else {
            console.log("else condinti")
            return null

        }
    }

    SetTasksCompleted(ActivityId: any) {
        var body = {
            "ActivityId": ActivityId
        }
        return this.apiService.post(routes.SetTasksCompleted, body)
    }


    async getCachedConvesartion() {
        console.log("getCachedConvesartion")
        const TablePageData = await this.offlineServices.getConversationTableIndexCacheData()

        if (TablePageData.length > 0) {
            return TablePageData[0]
        } else {
            console.log("else condinti")
            return null

        }

    }

    // child conversation
    getChildConversation(RequestBody: GetAllChildConversation): Observable<any> {

        return this.apiService.post(routes.childConversation, RequestBody)

    }


    async getCachedChildConvesartion(requestData: GetAllChildConversation) {

        const TablePageData = await this.offlineServices.getChildConvTableIndexCacheData(requestData)
        console.log("response fromm table cahcje child")
        console.log(TablePageData)
        if (TablePageData.length > 0) {
            return TablePageData[0]
        } else {
            console.log("else condinti")
            return null

        }

    }

    async getCachedActionConvesartion(requestData) {

        const TablePageData = await this.offlineServices.getActionConvTableIndexCacheData(requestData)
        if (TablePageData.length > 0) {
            return TablePageData[0]
        } else {
            console.log("else condinti")
            return null

        }

    }

    async getActivityDetailsById(id: any) {

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

    // get immutale object
    getimmutableObj(data): Object {
        const newPerson = {
            ...data
        }
        return newPerson
    }

    conversationSearch(searchText, searchType, pageSize: number, childId: any): Observable<any> {
        let search = {
            "Searchtext": searchText,
            "SearchType": searchType,
            "PageSize": pageSize,
            "Id": childId// by default we shd ask 5 data on search

        }

        return this.apiService.post(routes.conversationSearch, search)
    }

    myConversation(searchtext, userID) {
        let search = {
            "Guid": userID,
            "SearchText": searchtext,
            "SearchType": 4
        }
        return this.apiService.post(routes.conversationSearch, search)
    }



    //  conversation action
    getConversationAction(object: {}): Observable<any> {
        return this.apiService.post(routes.conversationAction, object)
    }

    getConversationDetails(id: any): Observable<any> {
        var body = { Conversation_Guid: id }
        return this.apiService.post(routes.conversationDetails, body)
    }

    postNewAction(objct: {}): Observable<any> {
        return this.apiService.post(routes.newAction, objct)
    }
    // modified by Murugesh
    postCustomerData(object: {}): Observable<any> {
        return this.apiService.post(routes.customer, object);
    }

    markConversationAsPivotal(object): Observable<any> {
        return this.apiService.post(routes.pivotal, object);
    }

    MultipleMarkConversationAsPivotal(body): Observable<any> {
        return this.apiService.post(routes.MultipleMarkConversationAsPivotal, body)
    }

    createAppointment(body): Observable<any> {
        return this.apiService.post(routes.createAppointment, body)
    }

    createProspectAccountPost(objct: {}): Observable<any> {
        return this.apiService.post(routes.createProspect, objct)
    }

    //upload business card in create, edit contact
    imageToText(fd: File) {
        console.log('MA->', fd)
        const formData: FormData = new FormData();
        formData.append('businesscard', fd, fd.name);
        console.log('apple= >', formData);
        return this.http.post(this.imageToTextApi, formData, httpOptions);

    }
    base64to_ocr(basefile: string) : Observable<any> {
        debugger;
        console.log("image upload service");
        let basfileobj = { 'businesscard': basefile };
        console.log("imageeeeeee", basfileobj);
        return this.http.post(this.envr.l2oBaseUrl + this.imageToTextApi, basfileobj, httpOptions);
    }
    //end


    //upload business card in create, edit contact
    // imageToText_ProfileImage(fd: File) {
    //     console.log('MA->', fd)
    //     const formData: FormData = new FormData();
    //     formData.append('form', fd, fd.name);
    //     console.log('apple= >', formData);
    //     return this.http.post(this.profileImageToTextApi, formData, httpOptions);

    // }
    // base64to_ocr_ProfileImage(basefile: string) {
    //     debugger;
    //     console.log("image upload service");
    //     let basfileobj = { 'businesscard': basefile };
    //     console.log("imageeeeeee",basfileobj);
    //     return this.http.post(this.profileImageToTextApi, basfileobj, httpOptions);
    // }
    //end


    getEmployeeNCustomerBothForEmail(objct: any): Observable<any> {
        var body = {
            "SearchText": objct,
            "PageSize": 10,
            "RequestedPageNumber": 1,
            "OdatanextLink": "",
        }
        return this.apiService.post(routes.getEmployeeNCustomerBoth, body)
    }

    shareConversationToSend(objct: any): Observable<any> {

        return this.apiService.post(routes.shareConversation, objct)
    }

    shareToMail: any;
    set shareToSend(value) {
        this.shareToMail = value
    }

    get shareToSend() {
        return this.shareToMail
    }

    emailSubject: any;
    set setEmailSubject(value) {
        this.emailSubject = value;
        debugger;;
    }

    get setEmailSubject() {
        return this.emailSubject;

    }

    clickCampaignIconToSend: any;

    set setCampaignIconToSend(value) {
        this.clickCampaignIconToSend = value;
    }

    get setCampaignIconToSend() {
        return this.clickCampaignIconToSend
    }


    getName: any;
    set sendConvToCampaignDataNameDisplay(value: any) {
        this.getName = value;
    }
    //child conversation
    getChildconversationDetails(objct: any): Observable<any> {
        var body = {
            "Appointment_Guid": objct

        }
        return this.apiService.post(routes.childinfoDetails, body)
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

    SpeechRecognitionService() {
        return this.http.get(routes.SpeechRecognitionService)
    }

    getMeetingCount(reqBody?) {
        return this.apiService.post(routes.MeetingCount, reqBody)
    }
    getOtherCount(reqBody?) {
        return this.apiService.post(routes.OtherCount, reqBody)
    }
    gerActionCount(reqBody?) {
        return this.apiService.post(routes.ActionCount, reqBody)
    }

    getFilterList(body) {

        return this.apiService.post(routes.FilterList, body)
    }


    getFilterSwitchListData(data): Observable<any> {
        switch (data.filterData.headerName) {
            case 'Name':
                return this.getNameColumnFilterData(data)
            case 'Account':
                return this.getAccountNameColumnFilterData(data)
            case 'Meetings':
                return this.getMeetingsCountColumnFilterData(data)
            case 'Actions':
                return this.getActionsCountColumnFilterData(data)
            case 'Orders':
                return this.getOrdersCountColumnFilterData(data)
            case 'Owner':
                return this.getOwnerFilterData(data)
            case 'Leadname':
                return this.getLinkedLeadsFilterData(data)
            case 'Linkedopp':
                return this.getOpportunitiesFilterData(data)
            default:
                return of([])
        }
    }

    getFilterActivityName(body) {
        return this.apiService.post(routes.GetFilterSearchList, body)
    }

    getFilterSearchAccountOrProspect(body) {
        return this.apiService.post(routes.GetFilterSearchAccountOrProspect, body).pipe(
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

    getFilterSearchOwner(body) {
        return this.apiService.post(routes.GetFilterSearchOwner, body)
    }

    getFilterMeetingCount(body) {
        return this.apiService.post(routes.GetFilterMeetingCount, body)
    }

    getFilterActionCount(body) {
        return this.apiService.post(routes.GetFilterActionCount, body)
    }

    getFilterOtherActivityCount(body) {
        return this.apiService.post(routes.GetFilterOtherActivityCount, body)
    }
    
    getFilterLeads(body) {
        return this.apiService.post(routes.GetFilterLeads, body)
    }

    getFilterOpp(body) {
        return this.apiService.post(routes.GetFilterOpp, body)
    }

    //Search for meeting/action/other count


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

    getSearchOwner(searchText, body?): Observable<any> {
        let reqbody = {
            "PageSize": 10,
            "RequestedPageNumber": 1,
            "OdatanextLink": "",
            "SearchText": searchText
        }
        return this.apiService.post(routes.SearchOwner, (body) ? body : reqbody)
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

    pluckParticularKey(array, key) {
        return array.map(function (item) { return (item[key]) });
    }
    AccountGuid:any;
    isprospect:any;
      GetAppliedFilterData(data) {
      if(this.router.url.includes('/accounts/accountactivities')){
        let accountInfo = JSON.parse(this.encrDecrService.get("EncryptionEncryptionEncryptionEn", sessionStorage.getItem('selAccountObj'), "DecryptionDecrip"))
        this.AccountGuid = [accountInfo.SysGuid];
        this.isprospect = []
        console.log("Account name from 3", this.AccountGuid)
      }else{
        this.AccountGuid= (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['Account'].filter(x => !x.isProspect), 'id'):[]:[]
        console.log("Account name from 1",this.AccountGuid);
        this.isprospect = (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['Account'].filter(x => x.isProspect), 'id'):[]:[]
    }
        return {
          "ColumnSearchText":(data.filterData) ? (data.filterData.columnSerachKey) ? data.filterData.columnSerachKey: "": "",
          "PageSize": data.useFulldata.pageSize,
          "RequestedPageNumber": data.useFulldata.pageNo,
          "SearchText": (data.filterData) ? (data.filterData.globalSearch)? data.filterData.globalSearch: "": "",
          "IsDesc":  (data.filterData) ? (data.filterData.sortColumn != '') ? !data.filterData.sortOrder : false: false,
          "ActivityGroupGuids": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['Name'], 'id'):[]:[],
          "OwnerGuids": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['Owner'], 'id'):[]:[],
        //  "AccountGuids": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['Account'].filter(x => !x.isProspect), 'id'):[]:[],
          "AccountGuids":  this.AccountGuid,
          "ProspectGuids": this.isprospect,
        // "ProspectGuids": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['Account'].filter(x => x.isProspect), 'id'):[]:[],
          "OpportunityGuids": [],
          "LeadGuids": [],
          "OrderGuids": [],
          "CampaignGuids": [],
          "MeetingCount": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['Meetings'], 'name'):[]:[],
          "ActionCount": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['Actions'], 'name'):[]:[],
          "OtherActivityCount": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['Orders'], 'name'):[]:[],
          "OdatanextLink": "",
          "ActivityGroupType": data.useFulldata.ActivityGroupType,
        //   "Track": data.useFulldata.track,
          "SortBy": (data.filterData) ? (data.filterData.sortColumn) ?this.pluckParticularKey(conversationheader.filter(x => x.name == data.filterData.sortColumn), 'SortId')[0]:[]:[]
        }
      }

    getNameColumnFilterData(data): Observable<any> {
        let body = this.GetAppliedFilterData({ ...data })
        return this.getFilterActivityName(body).pipe(switchMap(res => {
            debugger
            return of((!res.IsError) ? { ...res, ResponseObject: this.filterNameColumndata(res.ResponseObject) } : { ...res })
        }))
    }

    filterNameColumndata(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        id: x.Guid,
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

    getMeetingsCountColumnFilterData(data) {

        let body = this.GetAppliedFilterData({ ...data })
        return this.getFilterMeetingCount(body).pipe(switchMap(res => {
            debugger
            return of((!res.IsError) ? { ...res, ResponseObject: this.filterMeeetingColumndata(res.ResponseObject) } : { ...res })
        }))
    }

    getActionsCountColumnFilterData(data) {
        let body = this.GetAppliedFilterData({ ...data })
        return this.getFilterActionCount(body).pipe(switchMap(res => {
            debugger
            return of((!res.IsError) ? { ...res, ResponseObject: this.filterActionColumndata(res.ResponseObject) } : { ...res })
        }))
    }

    getOrdersCountColumnFilterData(data) {
        let body = this.GetAppliedFilterData({ ...data })
        return this.getFilterOtherActivityCount(body).pipe(switchMap(res => {
            debugger
            return of((!res.IsError) ? { ...res, ResponseObject: this.filterOtherColumndata(res.ResponseObject) } : { ...res })
        }))
    }

    filterMeeetingColumndata(data) {
        if (data) {
            debugger;
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        id: x.MeetingCount,
                        name: x.MeetingCount,
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
    filterActionColumndata(data) {
        if (data) {
            debugger;
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        id: x.Actioncount,
                        name: x.Actioncount,
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

    filterOtherColumndata(data) {
        if (data) {
            debugger;
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        id: x.OthersCount,
                        name: x.OthersCount,
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


    getLinkedLeadsFilterData(data): Observable<any> {
        // let reqbody = {
        //     "PageSize": 10,
        //     "RequestedPageNumber": data.useFulldata.pageNo,
        //     "OdatanextLink": data.useFulldata.nextLink,
        //     "SearchText": data.useFulldata.searchVal
        // }
        
        let reqbody = this.GetAppliedFilterData({ ...data })
        return this.getFilterLeads(reqbody).pipe(switchMap(res => {
            debugger
            return of((!res.IsError) ? { ...res, ResponseObject: this.filterLinkedLeadsColumndata(res.ResponseObject) } : { ...res })
        }))
    }

    filterLinkedLeadsColumndata(data) {
        if (data) {
            debugger;
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        id: x.Lead.SysGuid,
                        name: x.Lead.Name,
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

    getOpportunitiesFilterData(data): Observable<any> {
        // let reqbody = {
        //     "PageSize": 10,
        //     "RequestedPageNumber": data.useFulldata.pageNo,
        //     "OdatanextLink": data.useFulldata.nextLink,
        //     "SearchText": data.useFulldata.searchVal
        // }
        let reqbody = this.GetAppliedFilterData({ ...data })
        return this.getFilterOpp(reqbody).pipe(switchMap(res => {
            debugger
            return of((!res.IsError) ? { ...res, ResponseObject: this.filterLinkedOpportunityColumndata(res.ResponseObject) } : { ...res })
        }))
    }

    filterLinkedOpportunityColumndata(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        id: x.Lead.SysGuid,
                        name: x.Lead.Name,
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

    getAccountNameColumnFilterData(data: any): Observable<any> {
        let reqbody = this.GetAppliedFilterData({ ...data })
        return this.getFilterSearchAccountOrProspect(reqbody).pipe(switchMap(res => {
            debugger
            return of((!res.IsError) ? { ...res, ResponseObject: this.filterAccountColumndata(res.ResponseObject) } : { ...res })
        }))
    }


    filterAccountColumndata(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {

                        id: x.Account.SysGuid,
                        name: x.Account.Name,
                        isProspect: x.Account.isProspect,
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


    getOwnerFilterData(data): Observable<any> {
        let reqbody = this.GetAppliedFilterData({ ...data })
        return this.getFilterSearchOwner(reqbody).pipe(switchMap(res => {
            debugger
            return of((!res.IsError) ? { ...res, ResponseObject: this.filterOwnerColumndata(res.ResponseObject) } : { ...res })
        }))
    }

    filterOwnerColumndata(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {

                        id: x.Owner.SysGuid,
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

}

// --------------------------------------------------------Service Interfaces --------------------------------

interface GetAllConversation {
    PageSize?: number,
    RequestedPageNumber?: number,
    OdatanextLink?: string
}

interface GetTaskList {
    PageSize?: number,
    RequestedPageNumber?: number,
    OdatanextLink?: string
}

interface GetAllArchivedConversation {
    PageSize?: number,
    RequestedPageNumber?: number,
    OdatanextLink?: string
}

interface GetAllChildConversation {
    PageSize?: number,
    SysGuid?: string,
    RequestedPageNumber?: number,
    OdatanextLink?: string
}