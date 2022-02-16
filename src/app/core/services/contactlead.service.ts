import { Injectable } from '@angular/core';
import { JsonApiService } from './json-api.service';
import { Observable, of, Subject } from 'rxjs';
import { contactlead } from '../models/contactlead.model';
import { ApiService } from './api.service';
import { map, switchMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common'
import { OfflineService } from './offline.services';
import { OnlineOfflineService } from './online-offline.service';
import { ContactService } from './contact.service';
import { DateModifier } from './date-modifier';

const routes = {
    contactleads: '/contactlead',
    getallleads: 'v1/LeadManagement/AllLeads',
    searchLead: 'v1/LeadManagement/Search',
    getLeadsbyStatus: 'v1/LeadManagement/Status',
    contactlead: (id: number) => `/contactlead/${id}`,
    searchVertical: 'v1/LeadManagement/searchWiproVerticals',
    //searchVerticalById: 'v1/CampaignManagement/GetVerticalbySBUID',
    searchVerticalById: "v1/CampaignManagement/GetVerticalbySBUID_V1",
    searchLeadSource: 'v1/LeadManagement/Source',
    // searchLeadSource1: 'v1/LeadManagement/FilterRelationshipLogOfLeadColumnSource',
    searchLinkAGP: 'v1/LeadManagement/SearchAGPOptional',
    searchCampaign: 'v1/CampaignManagement/SmallSearchByName',
    getsearchOpportunity: 'Opportunity/SearchOpportunity',
    //getsearchSBUbyName: 'v1/CampaignManagement/SBUByName',
    getsearchSBUbyName: 'v1/CampaignManagement/SBUByAccountOrProspect',
    getsearchLeadOwner: 'v1/LeadManagement/SearchOwner',
    // getsearchLeadOwner1: 'v1/LeadManagement/FilterRelationshipLogOfLeadColumnOwner',
    getsearchServiceLine: 'v1/LeadManagement/ServiceLine',
    getsearchconversation: 'Conversation/SearchConversation',
    getUpdateLeadDetails: 'v1/LeadManagement/Create',
    createLeadCustmerContact: 'v1/LeadManagement/LeadContact',
    createLeadUser: 'v1/LeadManagement/LeadUser',
    getCurrencyRatevalue: 'v1/LeadManagement/CurrencyRate',
    getEditLeadDetails: 'v1/LeadManagement/Edit_V1',
    enquirytype: 'v1/MasterManagement/EnquiryType',
    getLeadDetails: 'v1/LeadManagement/Details',
    SearchOpportunityOrder: 'v1/MeetingManagement/SearchBothOpportunityAndOrdersBasedOnAccount',
    // SearchOpportunityOrder: 'v1/MeetingManagement/SearchBothOpportunityAndOrders',
    delinkCustomerContact: 'v1/LeadManagement/DelinkLeadCustomerContact',
    delinkWiproParticipant: 'v1/LeadManagement/DelinkUserContact',
    delinkLeadOpportunity: 'v1/LeadManagement/DelinkLeadOppertunity',
    createLeadGuidAttachment: 'v1/LeadManagement/CreateAttachment',
    delinkConversation: 'v1/LeadManagement/DelinkLeadConversation',
    delinkCampaign: 'v1/LeadManagement/DelinkLeadCampaign',
    linkLeadCampaign: 'v1/LeadManagement/LinkCampaignToLead',
    delinkServiceline: 'v1/LeadManagement/DelinkLServiceLine',
    DownloadAttachments: 'v1/LeadManagement/DownloadAttachment',
    searchServiceLine: 'v1/LeadManagement/ServiceLine',
    getsearchPractice: "v1/LeadManagement/Practice",
    getsearchSLBDM: "v1/LeadManagement/SearchSLBDM",
    createServiceLine: "v1/LeadManagement/CreateServiceLine",
    getsearchActivityGroup: "v1/ActivityGroupManagement/SearchListBasedOnAccountOrProspect",
    delinkActivityGroup: "v1/LeadManagement/DelinkAcitvityGroupLead",
    linkedLeadactivity: "v1/LeadManagement/LinkActivityGroupLead",
    createServiceLines: "v1/LeadManagement/CreateServiceLine",
    delinkagp: "v1/LeadManagement/DelinkLeadAGP",
    updateServiceLine: "v1/LeadManagement/EditServiceLine",
    getLeadHistory: 'v1/LeadManagement/History',
    getAssignLead: "v1/LeadManagement/AssignLead",
    delinkLeadCustomerContact: "v1/LeadManagement/DelinkLeadCustomerContact",
    LinkedOpportunityOrder: "v1/LeadManagement/LinkOpportunityAndOrders",
    DelinkedOpportunityAndOrder: "v1/LeadManagement/DeLinkOpportunityAndOrders",
    getAllianceAccount: "v1/LeadManagement/SearchAllianceAccount",
    getAdvisorAccount: "v1/LeadManagement/SearchAdvisoryAccount",
    CreateLead: 'v1/LeadManagement/Create_V1',
    getSearchCountry: "v1/AccountManagement/CountryName",
    getSearchWiproSolutions: "v1/LeadManagement/SearchLeadSolutions",
    searchCurrency: 'v1/MasterManagement/Currency_V2',
    searchValidAccount: "v1/AccountManagement/ValidAccount",
    searchAccountCompany: 'v1/LeadManagement/AccountnProspect_V1',
    // searchAccountCompany1: 'v1/LeadManagement/FilterRelationshipLogOfLeadColumnAccountOrProspect',
    searchAccountCompanyNew: 'v1/LeadManagement/AccountnProspect_V1',
    searchAccountCompany1: 'v1/LeadManagement/FilterRelationshipLogOfLeadColumnAccountOrProspect',
    searchCustomerparticipants: 'v1/AccountManagement/SearchAccountCustomerContact',
    // getContactLeadFilteredList: "v1/LeadManagement/FilterRelationshipLogOfLead",
    // getFilterStatus: 'v1/LeadManagement/LeadStatusFilter',
    // getFilterStatus1: 'v1/LeadManagement/FilterRelationshipLogOfLeadColumnStatus',
    // getFilterLeadNames: 'v1/LeadManagement/LeadSearchFilter',
    // getFilterActivityList: 'v1/ActivityGroupManagement/FilterSearchList',
    // getFilterActivityList1: 'v1/LeadManagement/FilterRelationshipLogOfLeadColumnActivityGroup',
    // contactRelationShiplogLeadDownload: "v1/LeadManagement/DownloadReleationFilter",
    searchContactLead: 'v1/LeadManagement/FilterRelationshipLogOfLeadColumnName',

    //relation ship log lead list filter api
    LeadDownload: 'v1/LeadManagement/DownloadByStatus',
    getLeadFilteredList: 'v1/LeadManagement/FilterList',
    getFilterLeadNames: 'v1/LeadManagement/LeadSearchFilter_V1',
    getSearchFilterOwner: 'v1/LeadManagement/LeadSearchFilterOwner',
    getSearchFilterSource: 'v1/LeadManagement/LeadSearchFilterSource',
    getStatusFilter: 'v1/LeadManagement/LeadStatusFilter_V1',
    getActivityGroupFilter: 'v1/LeadManagement/LeadActivityGroupFilter',
    getdAccountOrProspect: 'v1/LeadManagement/LeadAccountOrProspect'

};
export const contactLeadheader: any[] = [
    { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Name', className: 'noLink', SortId: 0 },
    // { id: 2, isFilter: false, name: 'ida', isFixed: false, order: 2, title: 'ID', hideFilter: true },
    // { id: 2, isFilter: false, name: 'score', isFixed: false, order: 2, title: 'Score', hideFilter: true, displayType: 'number' },
    { id: 2, isFilter: false, name: 'owner', isFixed: false, order: 2, title: 'Owner', SortId: 6, displayType: 'name' },
    { id: 3, isFilter: false, name: 'created', isFixed: false, order: 3, title: 'Created on', SortId: 3, displayType: 'date', dateFormat: 'dd-MMM-yyyy' },
    { id: 4, isFilter: false, name: 'account', isFixed: false, order: 4, title: 'Account', SortId: 2, displayType: 'capsFirstCase' },
    { id: 5, isFilter: false, name: 'activitygroup', isFixed: false, order: 5, title: 'Activitygroup', displayType: 'capsFirstCase', isModal: true, SortId: 0 },
    { id: 6, isFilter: false, name: 'source', isFixed: false, order: 6, title: 'Source ', SortId: 5, displayType: 'capsFirstCase' },
    { id: 7, isFilter: false, name: 'status', isFixed: false, order: 7, title: 'Status ', isStatus: true, SortId: 7, displayType: 'capsFirstCase' },
]
@Injectable({
    providedIn: 'root'
})
export class ContactleadService {
    // getFilterActivityList(arg0: null, arg1: null, arg2: null, body: { "SearchText": any; "PageSize": number; "OdatanextLink": any; "RequestedPageNumber": any; "Guid": any; "isProspect": boolean; }) {
    //     throw new Error("Method not implemented.");
    // }
    Id: any;
    cachedArray = [];
    attachList: any = [];
    Details: any;
    public readonly LeadsChacheType = {
        Table: "Table",
        Details: "Details",
        MeetingTypes: "MeetingTypes"
    }
    private subject = new Subject<{ name: string }>();
    constructor(
        public apiService: ApiService,
        public contactLeadService: ContactleadService,
        public contactServcie: ContactService,
        public datepipe: DatePipe) { }

    set LeadcreateId(id) {
        this.Id = id
    }
    setLeadNameForDetails(name: string) {
        this.subject.next({ name: name });
    }
    clearLeadNameForDetails() {
        this.subject.next();
    }
    getLeadNameForDetails(): Observable<any> {
        return this.subject.asObservable();
    }
    getAll(): Observable<contactlead[]> {
        return this.apiService.get(routes.contactleads);
    }

    getSingle(id: number): Observable<contactlead> {
        return this.apiService.get(routes.contactlead(id));
    }
    getParentHeaderData(): Observable<any[]> {
        return of(contactLeadheader);
    }

    CreateLead(body) {
        console.log("->>>>>>>>>>>")
        return this.apiService.post(routes.CreateLead, body)
    }

    getsearchCurrency(val): Observable<any> {
        var body = {
            "SearchText": val,
            "PageSize": 100,
            "OdatanextLink": "",
            "RequestedPageNumber": 1
        }
        return this.apiService.post(routes.searchCurrency, body);
    }

    getCoutry(val, Serviceparam?): Observable<any> {
        var body = {
            "SearchText": val,
            "PageSize": 10,
            "OdatanextLink": "",
            "RequestedPageNumber": 1
        }
        return this.apiService.post(routes.getSearchCountry, (Serviceparam) ? Serviceparam : body);
    }

    getWiproSolutions(val, Serviceparam?): Observable<any> {
        var body = {
            "SearchText": val,
            "PageSize": 10,
            "OdatanextLink": "",
            "RequestedPageNumber": 1
        }
        return this.apiService.post(routes.getSearchWiproSolutions, (Serviceparam) ? Serviceparam : body);
    }

    getAllLeadsbyStatus(ReqBody: GetLeadList): Observable<any> {
        return this.apiService.post(routes.getLeadsbyStatus, ReqBody)
    }

    LeadSearch(searchText, searchType, pageSize: number): Observable<any> {
        let search = {
            "SearchText": searchText,
            "SearchType": searchType,
            "PageSize": pageSize
        }
        return this.apiService.post(routes.searchLead, search)
    }

    leadSearch(searchText, searchType): Observable<any> {
        var search = {
            "Searchtext": searchText,
            "SearchType": searchType
        }
        return this.apiService.post(routes.getLeadsbyStatus, search).pipe(
            map(leads => {
                return {
                    allleads: leads.ResponseObject.map(leadslist => {
                        var accountName = ""
                        if (leadslist.Account === undefined) {
                            accountName = "NA"
                        }
                        if (leadslist.Account !== undefined) {
                            if (leadslist.Account.Name !== undefined) {
                                accountName = leadslist.Account.Name
                            } else {
                                accountName = leadslist.Account.Name
                            }
                        }
                        return {
                            Name: leadslist.Title || "NA",
                            ID: leadslist.LeadGuid,
                            Score: leadslist.OverallLeadScore,
                            Owner: "NA",
                            DateCreated: this.datepipe.transform(leadslist.CreatedOn, 'd-MMM-y'),
                            Account: "NA",
                            Conversation: leadslist.ConversationName,
                            Source: leadslist.leadsourcecode,
                            Status: leadslist.statuscode,
                        };
                    }),
                };
            })
        )
    }

    getsearchVerticalBySbu(reqBody): Observable<any> {
        return this.apiService.post(routes.searchVerticalById, reqBody);
    }

    getsearchVertical(val): Observable<any> {
        var body = {
            "SearchText": val
        }

        return this.apiService.post(routes.searchVertical, body);
    }
    getsearchLeadSource(searchText, requestBody?): Observable<any> {
        var body = {
            "SearchText": searchText,
            "PageSize": 100,
            "OdatanextLink": "",
            "RequestedPageNumber": 1
        }
        return this.apiService.post(routes.searchLeadSource, (requestBody) ? requestBody : body);
    }

    getsearchLinkAGP(val, Serviceparam?): Observable<any> {
        var body = {
            "SearchText": val,
            "PageSize": 10,
            "OdatanextLink": "",
            "RequestedPageNumber": 1
        }
        return this.apiService.post(routes.searchLinkAGP, (Serviceparam) ? Serviceparam : body);
    }

    getsearchCampaign(searchText, guid: any, isProspect: boolean, Serviceparam?): Observable<any> {
        var body = {
            "Searchtext": searchText,
            "SearchType": 1,
            "Guid": guid,
            "isProspect": isProspect,
            "PageSize": 10,
            "OdatanextLink": "",
            "RequestedPageNumber": 1
        }
        return this.apiService.post(routes.searchCampaign, (Serviceparam) ? Serviceparam : body);
    }

    searchOpportunityOrder(searchText, guid: any, isProspect: boolean, Serviceparam?) {
        var body = {
            "SearchText": searchText,
            "Guid": guid,
            "isProspect": isProspect,
            "PageSize": 10,
            "OdatanextLink": "",
            "RequestedPageNumber": 1
        }
        return this.apiService.post(routes.SearchOpportunityOrder, (Serviceparam) ? Serviceparam : body)
    }

    getsearchOpportunity(val): Observable<any> {
        var body = {
            "SearchText": val,
            "PageSize": 10,
            "OdatanextLink": "",
            "RequestedPageNumber": 1
        }
        return this.apiService.post(routes.getsearchOpportunity, body);
    }

    getsearchSBUbyName(body?, guid?: any, isProspect?: any, Serviceparam?): Observable<any> {
        var bodys = {
            "SearchText": body,
            "Guid": guid,
            "isProspect": isProspect,
            "PageSize": 10,
            "OdatanextLink": "",
            "RequestedPageNumber": 1
        }
        return this.apiService.post(routes.getsearchSBUbyName, (Serviceparam) ? Serviceparam : bodys);
    }

    getsearchServiceLine(body): Observable<any> {
        return this.apiService.post(routes.getsearchServiceLine, body);
    }

    getServiceLine(val): Observable<any> {
        var body = {
            "SearchText": val
        }
        return this.apiService.post(routes.searchServiceLine, body);
    }

    getPractice(body, guid: any): Observable<any> {
        var bodys = {
            "Guid": guid,
            "SearchText": body
        }
        return this.apiService.post(routes.getsearchPractice, bodys);
    }

    getSLBDM(body, guid: any, Pguid: any, sbuId: any, verticalId: any): Observable<any> {
        var bodys = {
            "Guid": guid,
            "PracticeGuid": Pguid ? Pguid : "",
            "SearchText": body,
            "SBUGuid": sbuId,
            "VerticalGuid": verticalId
        }
        return this.apiService.post(routes.getsearchSLBDM, bodys);
    }

    serviceLineCreate(body): Observable<any> {
        return this.apiService.post(routes.createServiceLines, body)
    }

    UpdateServiceLines(body): Observable<any> {
        return this.apiService.post(routes.updateServiceLine, body)
    }

    getsearchLeadOwner(val, Serviceparam?): Observable<any> {
        var body = {
            "SearchText": val,
            "PageSize": 100,
            "OdatanextLink": "",
            "RequestedPageNumber": 1
        }
        return this.apiService.post(routes.getsearchLeadOwner, (Serviceparam) ? Serviceparam : body);
    }

    getUpdateLeadDetails(body): Observable<any> {
        return this.apiService.post(routes.getUpdateLeadDetails, body)
    }

    getSearchActivityGroup(searchText, guid: any, isProspect: boolean, Serviceparam?): Observable<any> {
        var body = {
            "SearchText": searchText,
            "Guid": guid,
            "isProspect": isProspect,
            "PageSize": 10,
            "OdatanextLink": "",
            "RequestedPageNumber": 1
        }
        return this.apiService.post(routes.getsearchActivityGroup, (Serviceparam) ? Serviceparam : body);
    }

    createLeadCustmerContact(guId: any, sysGuId: any): Observable<any> {
        var body = {
            "LeadGuid": guId,
            "wipro_contactsodatabind": sysGuId
        }
        return this.apiService.post(routes.createLeadCustmerContact, body)
    }

    getCurrencyRatevalue(body): Observable<any> {
        var bodys = {
            "Id": body
        }
        return this.apiService.post(routes.getCurrencyRatevalue, bodys);
    }

    linkLeadactivity(guId: any, sysGuId: any): Observable<any> {
        var body = {
            "LeadGuid": guId,
            "LinkActivityGroupLead": [
                {
                    "SysGuid": sysGuId
                }
            ]
        }
        return this.apiService.post(routes.linkedLeadactivity, body)
    }
    createLeadUser(guId: any, sysGuId: any): Observable<any> {
        var body = {
            "LeadGuid": guId,
            "userSysGuid": sysGuId
        }
        return this.apiService.post(routes.createLeadUser, body)
    }

    searchCustomerparticipants(searchText, Guid, isProspect, serviceParam?) {
        var body = {
            "SearchText": searchText,
            "Guid": Guid,
            "isProspect": isProspect,
            "PageSize": 10,
            "OdatanextLink": "",
            "RequestedPageNumber": 1
        }
        return this.apiService.post(routes.searchCustomerparticipants, (serviceParam) ? serviceParam : body)
    }

    delinkConversation(guId: any) {
        var body = {
            "MapGuid": guId
        }
        return this.apiService.post(routes.delinkConversation, body)

    }

    DelinkAgp(guId: any, GuId: any): Observable<any> {
        var body = {
            "LeadGuid": guId,
            "Agp": { "Guid": GuId }
        }
        return this.apiService.post(routes.delinkagp, body)
    }
    LinkLeadCampaign(reqBody) {

        return this.apiService.post(routes.linkLeadCampaign, reqBody)

    }
    delinkCampaign(guId: any) {
        var body = {
            "MapGuid": guId
        }
        return this.apiService.post(routes.delinkCampaign, body)
    }

    DelinkServiceline(guId: any) {
        var body = {
            "serviceLine": [{ "MapGuid": guId }]
        }
        return this.apiService.post(routes.delinkServiceline, body)
    }

    getEditLeadDetails(body): Observable<any> {
        return this.apiService.post(routes.getEditLeadDetails, body)
    }

    getLeadDetails(guId: any, userGuid: any): Observable<any> {
        var body = {
            "LeadGuid": guId,
            "userSysGuid": userGuid
        }
        return this.apiService.post(routes.getLeadDetails, body);
    }

    getHistory(id: any): Observable<any> {
        var body = {
            "LeadGuid": id
        }
        return this.apiService.post(routes.getLeadHistory, body)
    }

    linkOpportunityAndOrder(sysGuid, mapGuid, leadGuid, type) {
        var body = { "SysGuid": sysGuid, "MapGuid": mapGuid, "LeadGuid": leadGuid, "Type": type }
        return this.apiService.post(routes.LinkedOpportunityOrder, body)
    }

    dealinkOpportunityAndOrder(sysGuid, mapGuid, leadGuid, type) {
        var body = { "SysGuid": sysGuid, "MapGuid": mapGuid, "LeadGuid": leadGuid, "Type": type }
        return this.apiService.post(routes.DelinkedOpportunityAndOrder, body)
    }

    delinkCustomerContact(id) {
        var body = {
            "MapGuid": id
        }
        return this.apiService.post(routes.delinkCustomerContact, body)
    }

    delinkWiproParticipant(id) {
        var body = {
            "MapGuid": id
        }
        return this.apiService.post(routes.delinkWiproParticipant, body)
    }

    delinklinkActivityGroup(id) {
        var body = {
            "MapGuid": id
        }
        return this.apiService.post(routes.delinkActivityGroup, body)
    }

    createLeadGuidAttachment(sysGuid: any, Attachments: any) {
        var body = {
            "Attachments": Attachments,
            "LeadGuid": sysGuid,
        }
        return this.apiService.post(routes.createLeadGuidAttachment, body)
    }

    getAssignleads(body) {
        return this.apiService.post(routes.getAssignLead, body)
    }

    DelinkLeadCustomerContact(id) {
        var body = {
            "MapGuid": id
        }
        return this.apiService.post(routes.delinkLeadCustomerContact, body)
    }

    downloadAll(Attachments) {
        var body = {
            "Attachments": Attachments
        }
        return this.apiService.post(routes.DownloadAttachments, body)
    }

    GetAllianceAccount(val, Serviceparam?): Observable<any> {
        var bodys = {
            "SearchText": val,
            "PageSize": 10,
            "OdatanextLink": "",
            "RequestedPageNumber": 1
        }
        return this.apiService.post(routes.getAllianceAccount, (Serviceparam) ? Serviceparam : bodys);
    }

    GetAdvisorAccount(val, Serviceparam?): Observable<any> {
        var body = {
            "SearchText": val,
            "PageSize": 10,
            "OdatanextLink": "",
            "RequestedPageNumber": 1
        }
        return this.apiService.post(routes.getAdvisorAccount, (Serviceparam) ? Serviceparam : body);
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

    getsearchAccountCompanyNew(val, serviceParam?): Observable<any> {
        var body = {
            "SearchText": val,
            "PageSize": 10,
            "OdatanextLink": "",
            "RequestedPageNumber": 1
        }
        return this.apiService.post(routes.searchAccountCompanyNew, (serviceParam) ? serviceParam : body).pipe(
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

    GetValidAccount(id: any, isProspect: any, Moduletype: number): Observable<any> {
        var body = {
            "AccountGuid": id,
            "isProspect": isProspect,
            "Moduletype": Moduletype
        }
        return this.apiService.post(routes.searchValidAccount, body)
    }

    set LeadguidId(id) {
        this.Id = id
    }

    get LeadguidId() {
        return this.Id
    }

    set attachmentList(attach) {
        this.attachList = attach
    }

    get attachmentList() {
        return this.attachList
    }

    //create lead save
    get LeadDetails() {
        return this.Details
    }

    set LeadDetails(value) {
        this.Details = value
    }

    //-----------------------------------------------------contact lead list start---------------------------------------------------------------//
    getAppliedFilterLeadData(body) {
        return this.apiService.post(routes.getLeadFilteredList, body)
    }

    getLeadFilterNames(obj): Observable<any> {
        return this.apiService.post(routes.getFilterLeadNames, obj)
    }

    getFilterOwner(body): Observable<any> {
        return this.apiService.post(routes.getSearchFilterOwner, body)
    }

    getfilterAccountOrProspect(body): Observable<any> {
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

    getfiltersearchLeadSource(body): Observable<any> {
        return this.apiService.post(routes.getSearchFilterSource, body)
    }

    getfilterActivityGroup(body): Observable<any> {
        return this.apiService.post(routes.getActivityGroupFilter, body)
    }

    getLeadFilterStatus(obj): Observable<any> {
        return this.apiService.post(routes.getStatusFilter, obj)
    }

    downloadLeadList(req): Observable<any> {
        return this.apiService.post(routes.LeadDownload, req)
    }

    getActionListConfigData(data): Observable<any> {
        debugger
        switch (data.filterData.headerName) {
            case 'Name':
                return this.getLeadNameColumnFilterData(data)
            case 'owner':
                return this.getLeadOwnerColumnFilterData(data)
            case 'account':
                return this.getLeadAccountColumnFilterData(data)
            case 'activitygroup':
                return this.getLeadActivityColumnFilterData(data)
            case 'source':
                return this.getLeadSourceColumnFilterData(data)
            case 'status':
                return this.getLeadStatusColumnFilterData(data)
            default:
                return of([])
        }
    }

    GetAppliedFilterData(data) {
        debugger
        return {
            "ColumnSearchText": (data.filterData) ? (data.filterData.columnSerachKey) ? data.filterData.columnSerachKey : "" : "",
            "SearchText": (data.filterData) ? (data.filterData.globalSearch) ? data.filterData.globalSearch : "" : "",
            "Guid": data.useFulldata.userGuid,
            "Name": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['Name'], 'name') : [] : [],
            "OwnerGuids": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['owner'], 'id') : [] : [],
            "CreatedOnList": [],
            "AccountGuids": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['account'].filter(x => !x.isProspect), 'id') : [] : [],
            "LeadStatusCodes": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['status'], 'id') : [] : [],
            "ProspectGuids": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['account'].filter(x => x.isProspect), 'id') : [] : [],
            "SourceGuids": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['source'], 'id') : [] : [],
            "StatusIds": [data.useFulldata.LeadsReqBody.StatusCode],
            "ActivityGroupGuids": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['activitygroup'], 'id') : [] : [],
            "CustomerContactGuids": [data.useFulldata.ContactParentGuid],
            "PageSize": data.useFulldata.pageSize,
            "OdatanextLink": data.useFulldata.nextLink,
            "RequestedPageNumber": data.useFulldata.pageNo,
            "IsDesc": (data.filterData) ? (data.filterData.sortColumn != '') ? !data.filterData.sortOrder : false : false,
            "SortBy": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.useFulldata.fieldheader.filter(x => x.name == data.filterData.sortColumn), 'SortId')[0] : [] : [],
            "StartDate": (data.filterData) ? (data.filterData.filterColumn['created'][0].filterStartDate !== '') ? this.dateModifier(data.filterData.filterColumn['created'][0].filterStartDate) : "" : "",
            "EndDate": (data.filterData) ? (data.filterData.filterColumn['created'][0].filterEndDate !== '') ? this.dateModifier(data.filterData.filterColumn['created'][0].filterEndDate) : "" : ""
        }
    }

    dateModifier(dateConvert) {
        let dataModifier = new DateModifier();
        return dataModifier.modifier(dateConvert)
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

    getLeadNameColumnFilterData(data: any): Observable<any> {
        if (data) {
            let body = this.GetAppliedFilterData({ ...data })
            return this.getLeadFilterNames(body).pipe(switchMap(res => {
                return of((!res.IsError) ? { ...res, ResponseObject: this.filterLeadNamesColumn(res.ResponseObject) } : { ...res })
            }))
        }
    }

    filterLeadNamesColumn(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        id: (x.LeadGuid) ? x.LeadGuid : '',
                        name: (x.Title) ? x.Title : '',
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

    getLeadOwnerColumnFilterData(data: any): Observable<any> {
        if (data) {
            let body = this.GetAppliedFilterData({ ...data })
            return this.getFilterOwner(body).pipe(switchMap(res => {
                return of((!res.IsError) ? { ...res, ResponseObject: this.filterLeadOwnerColumn(res.ResponseObject) } : { ...res })
            }))
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

    getLeadAccountColumnFilterData(data: any): Observable<any> {
        if (data) {
            let body = this.GetAppliedFilterData({ ...data })
            return this.getfilterAccountOrProspect(body).pipe(switchMap(res => {
                return of((!res.IsError) ? { ...res, ResponseObject: this.filterLeadAccountColumn(res.ResponseObject) } : { ...res })
            }))
        }
    }

    filterLeadAccountColumn(data: any) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        id: (x.Account.SysGuid) ? x.Account.SysGuid : '',
                        name: (x.Account.Name) ? x.Account.Name : '',
                        isProspect: x.isProspect,
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

    getLeadSourceColumnFilterData(data: any): Observable<any> {
        if (data) {
            let requestparam = this.GetAppliedFilterData({ ...data })
            return this.getfiltersearchLeadSource(requestparam).pipe(switchMap(res => {
                return of((!res.IsError) ? { ...res, ResponseObject: this.filterLeadSrcColumn(res.ResponseObject) } : { ...res })
            }))
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

    getLeadActivityColumnFilterData(data: any): Observable<any> {
        if (data) {
            let body = this.GetAppliedFilterData({ ...data })
            return this.getfilterActivityGroup(body).pipe(switchMap(res => {
                return of((!res.IsError) ? { ...res, ResponseObject: this.filterLeadActivityColumn(res.ResponseObject) } : { ...res })
            }))
        }
    }

    filterLeadActivityColumn(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        id: (x.Guid) ? x.Guid : '',
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

    getLeadStatusColumnFilterData(data: any): Observable<any> {
        if (data) {
            let body = this.GetAppliedFilterData({ ...data })
            return this.getLeadFilterStatus(body).pipe(switchMap(res => {
                return of((!res.IsError) ? { ...res, ResponseObject: this.filterLeadStatusColumn(res.ResponseObject) } : { ...res })
            }))
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

}

interface Getunqyalified {
    PageSize?: number,
    RequestedPageNumber?: number,
    OdatanextLink?: string
}
interface GetLeadList {

    PageSize?: number,
    RequestedPageNumber?: number,
    OdatanextLink?: string
}
interface AllQualified {
    PageSize?: number,
    OdatanextLink?: string,
    RequestedPageNumber?: number
}
interface AllUnqualified {
    PageSize?: number,
    OdatanextLink?: string,
    RequestedPageNumber?: number
}
interface ArchievedLead {
    PageSize?: number,
    OdatanextLink?: string,
    RequestedPageNumber?: number
}