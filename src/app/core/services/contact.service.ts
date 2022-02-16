import { Injectable } from '@angular/core';
import { JsonApiService } from './json-api.service';
import { Observable, of, Subject } from 'rxjs';
import { contact } from '../models/contact.model';
import { ApiService } from './api.service';
import { GetContactEnrichment } from '@app/core/interfaces/get-contact-edit-enrichment-save';
import { map, switchMap } from 'rxjs/operators';
import { OfflineService } from './offline.services';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment as env } from '@env/environment';
import { DatePipe } from '@angular/common';
import { EnvService } from './env.service';
// const BASE_URL = env.l2oBaseUrl;
const routes = {
    contacts: '/contact',
    contact: (id: number) => `/contact/${id}`,

    createContactAutoSavedApi: 'v1/ActionManagement/InsertCache',
    createContactGetCacheApi: 'v1/ActionManagement/GetCache',
    createContactApi: 'v1/AccountManagement/Create',
    updateContactSave: 'v1/AccountManagement/Edit',
    cbuByName: 'v1/CampaignManagement/CBUByNAme',
    getCity: 'v1/AccountManagement/CityName',
    getState: 'v1/AccountManagement/StateName',
    userManagerSearch: 'v1/EmployeeManagement/ManagerSearch',
    searchCompanyOrAccountName: 'v1/SearchManagement/SearchAccount',
    ownerSystemUserId: 'v1/AccountManagement/OwnerSystemUserId',
    searchSicIndustry: 'v1/SearchManagement/SearchSicIndustry',
    relationshiplog: 'v1/AccountManagement/RelationShipLog',
    allContactList: 'v1/AccountManagement/List',
    DeActivateContactList: 'v1/AccountManagement/MyDeActivateContactList',
    getContactdetails: 'v1/AccountManagement/ContactDetails',
    searchContact: 'v1/AccountManagement/SearchContact',
    searchDeActivateList: 'v1/AccountManagement/SearchMyDeActiveContactList',
    searchContactConversation: 'v1/ActivityGroupManagement/SearchReleationShipList',
    searchContactLead: 'v1/LeadManagement/SearchRelationshipLogOfLead',
    ContactEditEnrichmentSave: 'v1/AccountManagement/Edit_V1',
    deleteContact: 'v1/AccountManagement/DeleteContact',
    delinkCity: 'v1/AccountManagement/DeleteCity',
    delinkIndustry: 'v1/AccountManagement/DeleteIndustry',
    delinkInterest: 'v1/AccountManagement/DeleteInterest',
    delinkReportingManager: 'v1/AccountManagement/DeleteReportingManager',
    delinkCBU: 'v1/AccountManagement/DeleteCBUContact',
    deLinkPhoneNo: 'v1/AccountManagement/DeletePhoneFromContact',
    activitiesRelationship: 'v1/ActivityGroupManagement/ReleationShipList',
    leadsRelationship: 'v1/LeadManagement/RelationshipLogOfLead',
    delinkFunctionapi: 'v1/AccountManagement/DeleteContactFunction',
    profileImgApi: 'Storage/UploadDocument',
    contactCampaignList: 'v1/CampaignManagement/GetReleationshiplogCampaign',
    searchActiveCampaign: 'v1/CampaignManagement/SearchReleationshiplogCampaign',
    cbuByAccountnameapi: 'v1/CampaignManagement/SearchCBUByAccount',
    SearchReportingManagerByAccountName: 'v1/AccountManagement/SearchContactReportingManager',
    searchCitybyState: 'v1/AccountManagement/CityByState',
    searchAccountCompany: 'v1/LeadManagement/AccountnProspect_V1',
    emailValidation: 'v1/AccountManagement/CheckForEmailExists',
    phoneValidation : 'v1/AccountManagement/CheckForPhoneNumberExists',
    downloadContactList:'v1/AccountManagement/DownloadContactList',
    validAccountapi: 'v1/AccountManagement/ValidAccount',
    SearchInterestByname: 'v1/CampaignManagement/ProductIntrestByName',
    SearchReferenceTypeByID: 'v1/MasterManagement/ContactReferenceType',
    getSearchCountry: "v1/AccountManagement/CountryName",
    getSearchStateByCountry:"v1/AccountManagement/StateByCountry",
    getReActivateContactapi : 'v1/AccountManagement/ReactivateContact',
    FilteredApi:'v1/AccountManagement/FilterList',
    getFirstNameapi:'v1/AccountManagement/SearchContactName',
    getDesignationsapi:'v1/AccountManagement/SearchContactDesignation',
    getPhoneListapi:'v1/AccountManagement/SearchContactPhoneNumber',
    // getAccountGuidsapi:'v1/LeadManagement/AccountnProspect_V1',
    getAccountGuidsapi:'v1/AccountManagement/SearchContactColumnAccountOrProspect',
    getModifiedDateListapi:'v1/AccountManagement/SearchContactModifiedOn',
    getReportingManagerGuidsapi:'v1/AccountManagement/SearchContactReportingManagerForFilter',
    getEmailsapi:'v1/AccountManagement/SearchContactEmail',
    getKeyConatctapi: '',
    getCategoryapi : 'v1/AccountManagement/SearchContactCategory',
    getRelationshipapi : 'v1/AccountManagement/SearchContactReleationShip',
    getisUserCanEditContact: 'v1/AccountManagement/isUserCanEditContact',
    AutoPopulateIndustryByAccount :'v1/CampaignManagement/AutoPopulateIndustryByAccount',
    // relationshipLogDownload: 'v1/ActivityGroupManagement/DownloadFilterActivityGroupReleationShipList',
    addressBasedOnAccountapi: 'v1/AccountManagement/AddressbasedonAccount',
    contactHistoryapi: 'v1/AccountManagement/GetIMTGraphData'

};
export const contactheader: any[] = [
    { id: 1, isFilter: false, name: 'FirstName', isFixed: true, order: 1, title: 'Name', routerLink: '/contacts/Contactdetailslanding/contactDetailsChild' ,selectName: "contact",SortId:0 },
    { id: 2, isFilter: false, name: 'Jobtitle', isFixed: false, order: 2, title: 'Designation', SortId:8,  },
    { id: 3, isFilter: false, name: 'Email', isFixed: false, order: 3, title: 'Email', SortId:9 },
    { id: 4, isFilter: false, name: 'Phone', isFixed: false, order: 4, title: 'Phone', isModal: true, SortId:10 },
    { id: 5, isFilter: false, name: 'Account', isFixed: false, order: 5, title: 'Account', SortId:2 },
    { id: 6, isFilter: false, name: 'Reportingmanager', isFixed: false, order: 6, title: 'Reporting manager', SortId:11,  },
    { id: 7, isFilter: false, name: 'keyContact', isFixed: false,  order: 7, title: 'Key contact',SortId:28, displayType: 'capsFirstCase', isHideColumnSearch:true },
    //  { id: 8, isFilter: false, name: 'Modifiedon', isFixed: false, order: 8, title: 'Modified on' ,SortId:4, displayType: 'date', dateFormat:'dd-MMM-yyyy' },
    { id: 8, isFilter: false, name: 'Relationship', isFixed: false, order: 8, title: 'Relationship' ,SortId:50,  },
    { id: 9, isFilter: false, name: 'Category', isFixed: false, order: 9, title: 'Category' ,SortId:51,  },
]

export const AccountAdvnHeader: any[] = [
    { name: 'Name', title: 'Name' },
    { name: 'Ownername', title: 'Account Owner' },
    { name: 'AccType', title: 'Account Type' },
    { name : "Geo", title: 'Geo'},
    { name: "Region", title: "Region"},
    { name: "AccId", title: 'Account Number' },
]

export const ReportingAdvnHeader: any[] = [
    { name: 'Name', title: 'Reporting manager Name' },
    { name: "AccountName", title: 'Account Name' },
    { name: 'Designation', title: 'Designation' },
]


export const CBUAdvnHeader: any[] = [
    { name: 'Name', title: 'CBU' },
]


export const CountryAdvnHeader: any[] = [
    { name: 'Name', title: 'Name' },
]

export const RelationshipAdvnHeader: any[] = [
    { name: 'Name', title: 'Name' },
]

export const CategoryAdvnHeader: any[] = [
    { name: 'Name', title: 'Name' },
]

export const IndustryAdvnHeader: any[] = [
    { name: 'Name', title: 'Industry Name' },
]

export const InterestAdvnHeader: any[] = [
    { name: 'Name', title: 'Interest Name' },
]


export const contactAdvnHeaders = {
    'accountSearch': AccountAdvnHeader,
    'reportingSearch': ReportingAdvnHeader,
    'cbuSearch': CBUAdvnHeader,
    'countrySearch': CountryAdvnHeader,
    'industrySearch': IndustryAdvnHeader,
    'interestSearch': InterestAdvnHeader,
    'relationshipSearch': RelationshipAdvnHeader,
    'categorySearch' : CategoryAdvnHeader
}

export const contactAdvnNames = {
    'accountSearch': {name : 'Account', isCheckbox : false, isAccount : true},
    'reportingSearch': {name : 'Reporting manager', isCheckbox : false, isAccount : false},
    'cbuSearch': {name : 'CBU', isCheckbox : false, isAccount : false},
    'countrySearch': {name : 'Country', isCheckbox : false, isAccount : false},
    'industrySearch': {name : 'Industry', isCheckbox : false, isAccount : false},
    'interestSearch': {name : 'Interest' , isCheckbox : false, isAccount : false},
}


export const ContactNavigationRoutes= {
    1: '/contacts',
    2: '/contacts/deactivatedcontacts',
    3: '/contacts/contactmoreviewcontacts'
}


@Injectable({
    providedIn: 'root'
})
export class ContactService {
    showeditbtn:boolean;
    cachedArray = [];
    private subject = new Subject<{ name: string }>();
    private ProfileImageUrlSubject = new Subject<{ profileUrl: string }>();
    private BusinessCardUrlSubject = new Subject<{ businessCardUrl: string }>();
    public ProfileImageFlag = new Subject<{ flag: boolean,callngOnint?:any }>();
    public Navtoflag = new Subject<{ navEnum: number }>();
    public isEditButtonClicked$ = new Subject<{clicked: boolean, saveClicked: boolean, cancelClicked: boolean}>() 
    public readonly contactChacheType = {
        Table: "Table",
        Details: "Details",
        MeetingTypes: "MeetingTypes"
    }
    constructor(
        public envr : EnvService,
        private jsonApiService: JsonApiService,
        private apiService: ApiService,
        public offlineServices: OfflineService,
        private http: HttpClient,
        private datepipe: DatePipe,

        ) { }

        setButtonActions(edit: boolean, save: boolean, cancel: boolean) {
            this.isEditButtonClicked$.next({ clicked:  edit, saveClicked: save , cancelClicked: cancel});
        }
        getButtonActions(): Observable<any> {
            return this.isEditButtonClicked$.asObservable();
        }


        autoSave(autoSaveKey: string, pageId: string, modelObjectADId: any): Observable<any> {

            let cachekey = autoSaveKey + "_" + pageId
            var body = {
                "ADId": JSON.stringify(modelObjectADId),
                "CacheKey": cachekey
            }
            return this.apiService.post(routes.createContactAutoSavedApi, body);
    
        }
    
        deleteAutoSavedObject(autoSaveKey: string, pageId: string): Observable<any> {
            return of(null);
            // return this.http.delete(this.baseUrl2 + '?autoSaveKey=' + autoSaveKey + '&pageId=' + pageId, httpOptions);
        }
    
        getAutoSavedObject(autoSaveKey: string, pageId: string): Observable<any> {
            let cachekey = autoSaveKey + "_" + pageId
            var body = {
                "CacheKey": cachekey
            }
            return this.apiService.post(routes.createContactGetCacheApi, body);
        }

    getEmailValidation(isCreate:any,email: any,contactGuild:any) {
        var body = {
            "isCreate": isCreate,
            "Email": email,
            "Guid": contactGuild
        }
        return this.apiService.post(routes.emailValidation, body)
    }

     getAddressBasedOnAccountapi(accountGuid: any): Observable<any> {
        var body = { "Guid": accountGuid }
        return this.apiService.post(routes.addressBasedOnAccountapi, body)
    }
        public Module = new Subject<any>();
        setModule(module : any) {
          this.Module.next(module);
        }


    downloadLeadList(reqbody){
        return this.apiService.post(routes.downloadContactList, reqbody)
    }

    contactNavTo(num){
        this.Navtoflag.next({navEnum:num})
    }

    contactNavFrom(){
       return this.Navtoflag.asObservable()
    }

    setProfileImageflag(flag,ngonint?){
        this.ProfileImageFlag.next({flag:flag,callngOnint:ngonint})
    }
    
    setProfileImage(imageUrl: string) {
        this.ProfileImageUrlSubject.next({ profileUrl: imageUrl });
    }
    
    getProfileImage(): Observable<any> {
        return this.ProfileImageUrlSubject.asObservable();
    }
    
    //getter setter for business url
    setBusinessUrl(businessurl: string) {
        this.BusinessCardUrlSubject.next({ businessCardUrl: businessurl });
    }
    
    geBusinessUrl(): Observable<any> {
        return this.BusinessCardUrlSubject.asObservable();
    }



    AutoPopulateIndustryByAccount(Guid) {
        var ReqBody = {
            'Guid' : Guid
        }
        return this.apiService.post(routes.AutoPopulateIndustryByAccount, ReqBody)
     }


    getAll(): Observable<contact[]> {
        return this.apiService.get(routes.contacts);
    }
    getSingle(id: number): Observable<contact> {
        return this.apiService.get(routes.contact(id));
    }
    // getParentHeaderData(): Observable<any[]> {
    //     return of(contactheader);
    // }
    getupdateContactEnrichment(body): Observable<any[]> {
        return this.apiService.post(routes.updateContactSave, body);
    }
    getCreateContactEnrichment(body) {
        return this.apiService.post(routes.createContactApi, body);
    }

    getValidAccount(accountguid:any,isprospect, moduletype:number) {
          var body = {"AccountGuid": accountguid ,"isProspect":isprospect,  "Moduletype": moduletype}  
          return this.apiService.post(routes.validAccountapi, body);
    }
        
    getsearchAccountCompany(body, serviceParam?): Observable<any> {
        var bodys = { 
            "SearchText": body,
            "RequestedPageNumber":1,
            "PageSize":10,
            "OdatanextLink":""
     }
        return this.apiService.post(routes.searchAccountCompany,(serviceParam) ? serviceParam : bodys).pipe(
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

    getCbuByName(objct: any): Observable<any> {
        var body = { "SearchText": objct }
        return this.apiService.post(routes.cbuByName, body)
    }
    getUserManagerSearch(objct: any): Observable<any> {
        var body = { "SearchText": objct }
        return this.apiService.post(routes.userManagerSearch, body)
    }
    getAllCity(objct: any) {
        var body = { "SearchText": objct }
        return this.apiService.post(routes.getCity, body)
    }

    getAllCountry(val,Serviceparam?): Observable<any>{
        var body = {
            "SearchText": val,
            "PageSize": 10,
            "OdatanextLink": "",
            "RequestedPageNumber": 1
        }
        return this.apiService.post(routes.getSearchCountry, (Serviceparam) ? Serviceparam : body);
    }

    searchStateByCountry(countryGuid,searchtext){
        var body =  {
            "Guid":countryGuid,
            "SearchText":searchtext,
            "PageSize": 10,
            "OdatanextLink": "",
            "RequestedPageNumber": 1
        }
        return this.apiService.post(routes.getSearchStateByCountry, body);
    }

    getAllState(objct: any) {
        var body = { 
            "SearchText": objct,
            "RequestedPageNumber":1,
            "PageSize":10,
            "OdatanextLink":""
         }
        return this.apiService.post(routes.getState, body)
    }

    getsearchCompanyOrAccountName(objct: any): Observable<any> {
        var body = { "SearchText": objct }
        return this.apiService.post(routes.searchCompanyOrAccountName, body)
    }
    getOwnerSystemUserId(objct: any): Observable<any> {
        var body = { "SearchText": objct }
        return this.apiService.post(routes.ownerSystemUserId, body)
    }

    //searchSicIndustry
    getsearchSicIndustry(objct: any, Serviceparam?): Observable<any> {
        var body = { 
            "SearchText": objct,
            "RequestedPageNumber":1,
            "PageSize":10,
            "OdatanextLink":""
     }
        return this.apiService.post(routes.searchSicIndustry, (Serviceparam) ? Serviceparam : body)
    }

    getSearchInterestByname(body,Serviceparam?): Observable<any> {
        var bodys = {
            "SearchText": body,
            "RequestedPageNumber":1,
            "PageSize":10,
            "OdatanextLink":""
        }
        return this.apiService.post(routes.SearchInterestByname, (Serviceparam) ? Serviceparam : bodys);
    }

    getSearchReferenceTypeByID(body,Serviceparam?): Observable<any> {
        var bodys = {
            "SearchText": body,
            "RequestedPageNumber":1,
            "PageSize":10,
            "OdatanextLink":""
        }
        return this.apiService.post(routes.SearchReferenceTypeByID, (Serviceparam) ? Serviceparam : bodys);
    }

    //Get Contact List
    getAllContactList(body) {
        return this.apiService.post(routes.allContactList, body)
    }
    getIsUserCanEditContact(Id: any) {
        var body = { "Guid": Id }
        return this.apiService.post(routes.getisUserCanEditContact, body)
    }

    getContactdetails(Id: any) {
        var body = { "Guid": Id }
        return this.apiService.post(routes.getContactdetails, body)
    }
    // Search Active Contact
    getSearchContact(object: any): Observable<any> {
        var body = { "SearchText": object }
        return this.apiService.post(routes.searchContact, body)
    }

      // Search DeActivate Contact search
      getSearchDeActivateContact(body: any): Observable<any> {
        return this.apiService.post(routes.searchDeActivateList, body)
    }

    //get DeActivate contact list tabe
    getDeActivateContactList(body) {
        return this.apiService.post(routes.DeActivateContactList, body)
    }

    getReActivateContact(body){
        return this.apiService.post(routes.getReActivateContactapi, body);

    }

    // Contact Edit Enrichment form Save
    getContactEditEnrichmentSave(body) {
        return this.apiService.post(routes.ContactEditEnrichmentSave, body);
    }

    // DeActivation contact (delete contact from contact list)
    getDeActivateContact(Id: any) {
        console.log("deactivae");
        var body = { "Guid": Id }
        return this.apiService.post(routes.deleteContact, body)
    }

    async getCachedContact() {
        console.log("get cached contact---->")
        const TablePageData = await this.offlineServices.getContactListData()
        if (TablePageData.length > 0) {
            return TablePageData[0]
        } else {
            console.log("else condinti")
            return null
        }
    }

    async getCachedDeActivatedContact() {
        console.log("get cached DeActivatedContact---->")
        const TablePageData = await this.offlineServices.getDeActivatedContactListData()
        if (TablePageData.length > 0) {
            return TablePageData[0]
        } else {
            console.log("else condinti")
            return null
        }
    }

    async getCacheContactDetailsById(id: any) {
        let body = { ParentId: id }
        const ContactDetailsData = await this.offlineServices.getContactDetailsData(body)
        console.log("the cacahed con data")
        console.log(ContactDetailsData)
        if (ContactDetailsData.length > 0) {
            return ContactDetailsData[0]
        } else {
            return null
        }
    }

    async getCacheMarketDetailsById(id: any) {
        let body = { ParentId: id }
        const MarketDetailsData = await this.offlineServices.getMarketDetailsData(body)
        console.log("the cacahed con data")
        console.log(MarketDetailsData)
        if (MarketDetailsData.length > 0) {
            return MarketDetailsData[0]
        } else {
            return null
        }
    }

    delinkCity(cityGuid, contactGuid) {
        var body = { "CustomerAddress": { "City": { "SysGuid": cityGuid } }, "Guid": contactGuid }
        return this.apiService.post(routes.delinkCity, body)
    }

    delinkIndustry(industryGuid, contactGuid) {
        var body = { "MarketingDetail": { "Industry": { "Guid": industryGuid } }, "Guid": contactGuid }
        return this.apiService.post(routes.delinkIndustry, body)
    }

    delinkInterest(interesstGuid, contactGuid) {
        var body = { "MarketingDetail": { "Interest": { "Guid": interesstGuid } }, "Guid": contactGuid }
        return this.apiService.post(routes.delinkInterest, body)
    }

    delinkReportingManager(SysGuid, contactGuid) {
        var body = { "ReportingManager": { "SysGuid": SysGuid }, "Guid": contactGuid }

        return this.apiService.post(routes.delinkReportingManager, body)
    }
    delinkCBU(CBUGuid, contactGuid) {
        var body = { "CBU": { "SysGuid": CBUGuid }, "Guid": contactGuid }
        return this.apiService.post(routes.delinkCBU, body);
    }

    delinkPhoneNo(mapGuid) {
        var body = { "Contact": [{ "MapGuid": mapGuid }] }
        return this.apiService.post(routes.deLinkPhoneNo, body);
    }

    delinkFunction(contactGuid) {
        var body = { "Guid": contactGuid }
        return this.apiService.post(routes.delinkFunctionapi, body);
    }

    profileImg(file) {
        return this.http.post(`${this.envr.l2oBaseUrl}Storage/UploadDocument`, file);
    }
    searchReportingManagerByAccountName(guid, isProspect, search, Serviceparam?): Observable<any> {
        var ReqBody = {
            "Guid": guid,
            "isProspect": isProspect,
            "SearchText": search,
            "RequestedPageNumber":1,
            "PageSize":10,
            "OdatanextLink":""
        }
        return this.apiService.post(routes.SearchReportingManagerByAccountName,  (Serviceparam) ? Serviceparam : ReqBody);
    }

    //Search CBU from Advance lookup and normal lookup
    cbuByAccountName(accountGuid: any, isProspect, searchText: any, Serviceparam?): Observable<any> {
        var body = { 
        "Guid": accountGuid, 
        "isProspect": isProspect,
        "SearchText": searchText , 
        "RequestedPageNumber":1,
        "PageSize":10,
        "OdatanextLink":""
    }
        return this.apiService.post(routes.cbuByAccountnameapi,  (Serviceparam) ? Serviceparam : body)
    }

    SearchCityByState(guid, search) {
        var ReqBody = {
            "Guid": guid,
            "SearchText": search,
            "RequestedPageNumber":1,
            "PageSize":10,
            "OdatanextLink":""
        }
        return this.apiService.post(routes.searchCitybyState, ReqBody);
    }
    //this three function for updating the first name while editing the contact
    setContactEditName(name: string) {
        this.subject.next({ name: name });
    }
    clearContactEditName() {
        this.subject.next();
    }
    getContactEditName(): Observable<any> {
        return this.subject.asObservable();
    }
    //end

    //-------------------Relationshiplog section----------------------------------------------------

    //relationship log section data 
    getRelationshiplog(contactGuid: any, userGuid: any): Observable<any> {
        var body = { "Guid": contactGuid, "LoginGuid": userGuid }
        return this.apiService.post(routes.relationshiplog, body)
    }
    //Contact Activity lists
    getActivitiesRelationship(Id: any, objct: any, pagesize: any, requestPagenumber: any): Observable<any> {
        var body = { "Guid": Id, "SearchType": objct, "PageSize": pagesize, "RequestedPageNumber": requestPagenumber }
        return this.apiService.post(routes.activitiesRelationship, body);
    }
    //  Contact Activity list search
    getSearchContactConversation(guid: any, searchtype: any, searchtext: any): Observable<any> {
        var body = { "Guid": guid, "SearchType": searchtype, "SearchText": searchtext }

        return this.apiService.post(routes.searchContactConversation, body)
    }

    // downRelationshipActivityList(req): Observable<any> {
    //     return this.apiService.post(routes.relationshipLogDownload, req)
    // }

    //Contact Lead list 
    getContactLeadsRelationship1(objct: any, Contactguid: any, pagesize: any, requestPagenumber: any, userLoginGuid: any, nextlink: any): Observable<any> {
        var body1 = {
            "SearchType": objct,
            "Guid": Contactguid,
            "PageSize": pagesize,
            "RequestedPageNumber": requestPagenumber,
            "UserGuid": userLoginGuid,
            "OdatanextLink": ""
        }
        return this.apiService.post(routes.leadsRelationship, body1);
    }

    //  Contact lead search list 
    getSearchContactLead1(objct: any): Observable<any> {
        return this.apiService.post(routes.searchContactLead, objct)
    }

    //Contact campaign list
    getContactCampaign(contactGuid: any, searchtype: any, pagesize: any, requestnumbr: any, userGuid: any, odatanextlink: any) {
        var body =
        {
            "Guid": contactGuid,
            "SearchType": searchtype,
            "PageSize": pagesize,
            "RequestedPageNumber": requestnumbr,
            "UserGuid": userGuid,
            "OdatanextLink": odatanextlink
        }
        return this.apiService.post(routes.contactCampaignList, body);
    }
    //Contact campaign list search
    getSearchContactCampaign(object: any): Observable<any> {
        return this.apiService.post(routes.searchActiveCampaign, object)
    }

    //---------------------- offline service method ----------------
    async getCacheRelationshipDetailsById(id: any) {

        let body = { ParentId: id }
        const relationDetailsData = await this.offlineServices.getRelationshipDetailsData(body)
        console.log("the cacahed con data")
        console.log(relationDetailsData)
        if (relationDetailsData.length > 0) {
            return relationDetailsData[0]
        } else {
            return null
        }
    }
    // Getting and setting the send image
    sendImage: any;
    set sendImageData(value: any) {
        this.sendImage = value;
    }
    get sendImageData() {
        return this.sendImage
    }
    // Getting and setting the send business card
    sendBusinessImage:string="";
    set sendBusinessCardData(value: any) {
        this.sendBusinessImage = value;
    }
    get sendBusinessCardData() {
        return this.sendBusinessImage
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
    EnrichedInfo: any
    set sendEnrichedData(value) {
        this.EnrichedInfo = value;
    }
    get sendEnrichedData() {
        return this.EnrichedInfo
    }
    AbridgedInfo: any
    set sendAbridgedData(value) {
        this.AbridgedInfo = value;
    }
    get sendAbridgedData() {
        return this.AbridgedInfo
    }

 //handels pagination,search,filterlookup for Advanced Search lookup field
      getLookUpFilterData(data): Observable<any> {
        switch (data.controlName) {
            case 'accountSearch':
                return this.getAccoutdata(data)
            case 'reportingSearch':
                return this.getReportingdata(data)
           case 'cbuSearch':
                return this.getCBUdata(data)
            case 'countrySearch':
                return this.getCountry(data)
            case 'industrySearch':
                return this.getIndustry(data)
            case 'interestSearch':
                return this.getInterest(data)
            default:
                return of([])
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
             return this.getsearchAccountCompany('', body).pipe(switchMap(res=>{
                         if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject:(res.ResponseObject.length>0)? this.filterAdvnAcc(res.ResponseObject):[] } : [])
                } else {
                    return of([])
                }
             }))
        } else {
            return of(this.filterAdvnAcc(data.data))
        }
    }

    getSymbol(data) {
        // console.log(data)
        if (data) {
            return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
        } else {
            return '';
        }
  
    }
    filterAdvnAcc(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {...x,
                        'Name': (x.Name) ? x.Name : '',
                        'Id':(x.SysGuid) ? x.SysGuid : '',
                        'AccId': (x.Number) ? x.Number : '',
                        'Ownername': (x.Owner) ? (x.Owner.FullName) ? x.Owner.FullName : "" : '',
                        'AccType': (x.Type) ? (x.Type.Value) ? x.Type.Value : '' : '',
                        'Geo': (x.Address.Region) ? (x.Address.Region.Name) ? x.Address.Region.Name : '' : '',
                        'Region': (x.Address.Geo) ? (x.Address.Geo.Name) ?x.Address.Geo.Name : '' : '',
                    }
                })
            } else {
                return []
            }
        } else {
            return []
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
           return this.getAllCountry('', body).pipe(switchMap(res=>{
            if (res) {
                return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length>0)?this.filterAdvnCountry(res.ResponseObject):[] } : [])
            } else {
                return of([])
            }
           }))
        } else {
            return of(this.filterAdvnCountry(data.data))
        }
    }

    filterAdvnCountry(data): Observable<any> {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {...x,
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

    
    getReportingdata(data: any): Observable<any> {
        if (data.isService) {
            let body = {
                "SearchText": data.useFullData.searchVal,
                "PageSize": data.useFullData.recordCount,
                "OdatanextLink": data.useFullData.OdatanextLink,
                "RequestedPageNumber": data.useFullData.pageNo,
                "Guid": data.useFullData.accountGuid,
                "isProspect": data.useFullData.isProspect,
            }

             return this.searchReportingManagerByAccountName('',null,null, body).pipe(switchMap(res=>{
                         if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject:(res.ResponseObject.length>0)? this.filterAdvnReporting(res.ResponseObject):[] } : [])
                } else {
                    return of([])
                }
             }))
        } else {
            return of(this.filterAdvnReporting(data.data))
        }
    }


    filterAdvnReporting(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {...x,
                        'Name': (x.FullName) ? x.FullName : '',
                        'Id':(x.Guid) ? x.Guid : '',
                        'AccountName': (x.CustomerAccount.Name) ? (x.CustomerAccount.Name) ? x.CustomerAccount.Name : "" : '',
                        'Designation': (x.Designation) ? (x.Designation) ? x.Designation : '' : '',
                    }
                })
            } else {
                return []
            }
        } else {
            return []
        }
    }

    

    getCBUdata(data: any): Observable<any> {
        if (data.isService) {
            let body = {
                "SearchText": data.useFullData.searchVal,
                "PageSize": data.useFullData.recordCount,
                "OdatanextLink": data.useFullData.OdatanextLink,
                "RequestedPageNumber": data.useFullData.pageNo,
                "Guid": data.useFullData.accountGuid,
                "isProspect": data.useFullData.isProspect,
            }
             return this.cbuByAccountName('',null,null, body).pipe(switchMap(res=>{
                         if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject:(res.ResponseObject.length>0)? this.filterAdvnCBU(res.ResponseObject):[] } : [])
                } else {
                    return of([])
                }
             }))
        } else {
            return of(this.filterAdvnCBU(data.data))
        }
    }


    filterAdvnCBU(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {...x,
                        'Name': (x.Name) ? x.Name : '',
                        'Id':(x.Id) ? x.Id : '',
                    }
                })
            } else {
                return []
            }
        } else {
            return []
        }
    }

    
    getIndustry(data: any): Observable<any> {
        if (data.isService) {
            let body = {
                "SearchText": data.useFullData.searchVal,
                "PageSize": data.useFullData.recordCount,
                "OdatanextLink": data.useFullData.OdatanextLink,
                "RequestedPageNumber": data.useFullData.pageNo
            }
             return this.getsearchSicIndustry('', body).pipe(switchMap(res=>{
                         if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject:(res.ResponseObject.length>0)? this.filterAdvnIndustry(res.ResponseObject):[] } : [])
                } else {
                    return of([])
                }
             }))
        } else {
            return of(this.filterAdvnIndustry(data.data))
        }
    }


    filterAdvnIndustry(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {...x,
                        'Name': (x.Name) ? x.Name : '',
                        'Id':(x.wipro_sicindustryclassificationid) ? x.wipro_sicindustryclassificationid : '',
                    }
                })
            } else {
                return []
            }
        } else {
            return []
        }
    }


    
    getInterest(data: any): Observable<any> {
        if (data.isService) {
            let body = {
                "SearchText": data.useFullData.searchVal,
                "PageSize": data.useFullData.recordCount,
                "OdatanextLink": data.useFullData.OdatanextLink,
                "RequestedPageNumber": data.useFullData.pageNo
            }
             return this.getSearchInterestByname('', body).pipe(switchMap(res=>{
                         if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject:(res.ResponseObject.length>0)? this.filterAdvnInterest(res.ResponseObject):[] } : [])
                } else {
                    return of([])
                }
             }))
     
        } else {
            return of(this.filterAdvnInterest(data.data))
        }
    }

    filterAdvnInterest(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {...x,
                        'Name': (x.Name) ? x.Name : '',
                        'Id':(x.Id) ? x.Id : '',
                    }
                })
            } else {
                return []
            }
        } else {
            return []
        }
    }


    //---------------------- Table Filter data Services ------------------------------------------
    getFirstNames(obj):Observable<any>{
        return this.apiService.post(routes.getFirstNameapi,obj)
    }

    getDesignations(obj):Observable<any>{
        return this.apiService.post(routes.getDesignationsapi,obj)
    }

    
    getPhoneList(obj):Observable<any>{
        return this.apiService.post(routes.getPhoneListapi,obj)
    }

    getAccountGuids(obj):Observable<any>{
        return this.apiService.post(routes.getAccountGuidsapi,obj).pipe(
            map(res =>{if(!res.IsError){
                return {
                    ...res,
                    ResponseObject : res.ResponseObject.map(res1 =>{
                        return {
                            ...res1,
                            Name : decodeURIComponent(res1.Name)
                        }
                    })
                }
            }else{
                return res
            }
            })
        );
    }
    
    // getModifiedDateList(searchText,body?):Observable<any>{
    //     let reqbody = {
    //         "PageSize": 10,
    //         "RequestedPageNumber": 1,
    //         "OdatanextLink": "",
    //         "SearchText":searchText
    //     }
    //     return this.apiService.post(routes.getModifiedDateListapi,(body)?body:reqbody)
    // }
    
    getReportingManagerGuids(obj):Observable<any>{
        // let reqbody = {
        //     "PageSize": 10,
        //     "RequestedPageNumber": 1,
        //     "OdatanextLink": "",
        //     "SearchText":searchText
        // }
        return this.apiService.post(routes.getReportingManagerGuidsapi,obj)
    }

    getEmails(obj):Observable<any>{
        // let reqbody = {
        //     "PageSize": 10,
        //     "RequestedPageNumber": 1,
        //     "OdatanextLink": "",
        //     "searchText":searchText
        // }
        return this.apiService.post(routes.getEmailsapi,obj)
    }

    getKeyContact(obj):Observable<any>{
        // let reqbody = {
        //     "PageSize": 10,
        //     "RequestedPageNumber": 1,
        //     "OdatanextLink": "",
        //     "searchText":searchText
        // }
        return this.apiService.post(routes.getKeyConatctapi,obj)
    }

    getRelationship(obj):Observable<any>{
        return this.apiService.post(routes.getRelationshipapi,obj)
    }

    getCategory(obj):Observable<any>{
        return this.apiService.post(routes.getCategoryapi,obj)
    }


    getAppliedFilterActionData(body){
        return this.apiService.post(routes.FilteredApi, body)

    }

    getContactListConfigData(data): Observable<any>{
        switch (data.filterData.headerName) {
            case 'FirstName':
                return this.getFirstNameColumnFilterData(data)
            case 'Jobtitle':
                return this.getDesignationsColumnFilterData(data)
            case 'Phone':
                return this.getPhoneColumnFilterData(data)
            case 'Account':
                return this.getAccountGuidsColumnFilterData(data)
            // case 'Modifiedon':
            //     return this.getModifiedDateListColumnFilterData(data)
            case 'Reportingmanager':
                return this.getReportingManagerGuidsColumnFilterData(data)
            case 'Email':
                return this.getEmailsColumnFilterData(data)    
            // case 'keyContact':
            //     return this.getKeyContactColumnFilterData(data)   
            case 'Relationship':
                return this.getRelationshipColumnFilterData(data)      
            case 'Category':
                return this.getCategoryColumnFilterData(data)  
            
            default:
                return of([])
        }
    }


    GetAppliedFilterData(data) {
        console.log(data)
      
        return {
            "ColumnSearchText": (data.filterData) ?  (data.filterData.columnSerachKey) ? data.filterData.columnSerachKey : "" : "",
            "Name": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['FirstName'], 'name') : [] : [],
            "Designations": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['Jobtitle'], 'name') : [] : [],
            "PhoneList": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['Phone'], 'name') : [] : [],
            "AccountGuids": (data.filterData) ? (data.filterData.filterColumn) ?  this.pluckParticularKey(data.filterData.filterColumn['Account'].filter(x => !x.isProspect), 'id') : [] : [],
            "ProspectGuids":(data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['Account'].filter(x => x.isProspect), 'id') : [] : [],
            "KeyContactList": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['keyContact'], 'value') : [] : [],
            "ModifiedDateList": [],
            "ReportingManagerGuids": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['Reportingmanager'], 'name') : [] : [],
            "ReleationShipList": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['Relationship'], 'id') : [] : [],
            "CategoryList": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['Category'], 'id') : [] : [],
            "Emails": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['Email'], 'name') : [] : [],
            "SearchText": (data.filterData) ? (data.filterData.globalSearch) ? data.filterData.globalSearch : "" : "",
            "PageSize": data.useFulldata.pageSize,
            "RequestedPageNumber": data.useFulldata.RequestedPageNumber,
            "OdatanextLink": data.useFulldata.OdatanextLink,
            "IsActive": data.useFulldata.isActive,
            "IsDesc": (data.filterData) ? (data.filterData.sortColumn != '') ? !data.filterData.sortOrder : false : false,
            "SortBy": (data.filterData) ? (data.filterData.sortColumn) ? this.pluckParticularKey(contactheader.filter(x => x.name == data.filterData.sortColumn), 'SortId')[0]  : [] : [],
            "ColumnOrder": (data.objectRowData) ? Array.isArray(data.objectRowData) ? this.filterContactHeaderName(data.objectRowData[1]) :[]:[]
          }
      }

      filterContactHeaderName(data) {
        return data.reduce((acc, d) => {
            if(d.name=="FirstName" ) {
                acc.push("Name");
            }else if(d.name=="Jobtitle" ) {
                acc.push("Designation");
            }else if(d.name=="Reportingmanager" ) {
                acc.push("ReportingManager");
            }else if(d.name=="keyContact" ) {
                acc.push("keycontact");
            }else if(d.name=="Relationship" ) {
                acc.push("ReleationShip");
            }else {
                acc.push(d.name);
            }
            return acc;
        }, []);
    }

    getFirstNameColumnFilterData(data:any): Observable<any> {

        let body = this.GetAppliedFilterData({ ...data})
     
       return this.getFirstNames(body).pipe(switchMap(res=>{
            return of((!res.IsError) ? { ...res, ResponseObject:this.filterFirstNameColumndata(res.ResponseObject) } : { ...res })
        }))
       
    }

    filterFirstNameColumndata(data){
      
        if(data){
            if(data.length>0){
                return data.map(x=>{
                    return {

                        id: x.Guid,
                        name:x.FullName,
                        isDatafiltered:false 
                    }
                })
            }else{
                return []
            }
        }else{
            return []
        }
    }

    getDesignationsColumnFilterData(data:any): Observable<any> {

        let body = this.GetAppliedFilterData({ ...data})
      
       return this.getDesignations(body).pipe(switchMap(res=>{
            return of((!res.IsError) ? { ...res, ResponseObject: this.filterDesignationsColumndata(res.ResponseObject) } : { ...res })
        }))
       
    }

    filterDesignationsColumndata(data){
   
        if(data){
            if(data.length>0){
                return data.map(x=>{
                    return {

                        id: x.SysGuid,
                        name: x.Name,
                        isDatafiltered:false 
                    }
                })
            }else{
                return []
            }
        }else{
            return []
        }
    }

    
    getPhoneColumnFilterData(data:any): Observable<any> {

        let body = this.GetAppliedFilterData({ ...data})

        return this.getPhoneList(body).pipe(switchMap(res=>{
                return of((!res.IsError) ? { ...res, ResponseObject: this.filterPhoneColumndata(res.ResponseObject) } : { ...res })
            }))
        
     }
 
     filterPhoneColumndata(data){

         if(data){
             if(data.length>0){
                 return data.map(x=>{
                     return {
 
                         id: x.SysGuid,
                         name: x.ContactNo,
                         isDatafiltered:false 
                     }
                 })
             }else{
                 return []
             }
         }else{
             return []
         }
     }

    getAccountGuidsColumnFilterData(data:any): Observable<any> {

        let body = this.GetAppliedFilterData({ ...data})

       return this.getAccountGuids(body).pipe(switchMap(res=>{
            return of((!res.IsError) ? { ...res, ResponseObject: this.filterAccountGuidsColumndata(res.ResponseObject) } : { ...res })
        }))
       
    }

    filterAccountGuidsColumndata(data){
    
        if(data){
            if(data.length>0){
                return data.map(x=>{
                    return {

                        id: x.SysGuid,
                        name: x.Name,
                        isProspect:x.isProspect,
                        isDatafiltered:false 
                    }
                })
            }else{
                return []
            }
        }else{
            return []
        }
    }


     
    //  getModifiedDateListColumnFilterData(data:any): Observable<any> {
         
    //     let body = this.GetAppliedFilterData({ ...data})
       
    //     return this.getModifiedDateList('',body).pipe(switchMap(res=>{
    //             return of((!res.IsError) ? { ...res, ResponseObject: this.filterModifiedDateListColumndata(res.ResponseObject) } : { ...res })
    //         }))
        
    //  }
 
     filterModifiedDateListColumndata(data){
         if(data){
             if(data.length>0){
                 return data.map(x=>{
                     return {
 
                        id: x.Guid,
                        name: this.datepipe.transform(x.ModifiedOn,'d-MMM-y'),
                        isDatafiltered:false ,
                        modifiedOn:x.ModifiedOn
                     }
                 })
             }else{
                 return []
             }
         }else{
             return []
         }
     }

     

     getReportingManagerGuidsColumnFilterData(data:any): Observable<any> {

        let body = this.GetAppliedFilterData({ ...data})

        return this.getReportingManagerGuids(body).pipe(switchMap(res=>{
                return of((!res.IsError) ? { ...res, ResponseObject: this.filterReportingManagerGuidsColumndata(res.ResponseObject) } : { ...res })
            }))
        
     }
 
     filterReportingManagerGuidsColumndata(data){
         if(data){
             if(data.length>0){
                 return data.map(x=>{
                     return {
 
                         id: x.Guid,
                         name: x.FullName,
                         isDatafiltered:false 
                     }
                 })
             }else{
                 return []
             }
         }else{
             return []
         }
     }

     

     getEmailsColumnFilterData(data:any): Observable<any> {

        let body = this.GetAppliedFilterData({ ...data})
            
        return this.getEmails(body).pipe(switchMap(res=>{
                return of((!res.IsError) ? { ...res, ResponseObject: this.filtergetEmailsColumndata(res.ResponseObject) } : { ...res })
            }))
        
     }

     filtergetEmailsColumndata(data){
         if(data){
             if(data.length>0){
                 return data.map(x=>{
                     return {
 
                         id: x.SysGuid,
                         name: x.Name,
                         isDatafiltered:false 
                     }
                 })
             }else{
                 return []
             }
         }else{
             return []
         }
     }

     
     getKeyContactColumnFilterData(data:any): Observable<any> {
        let body = {
            "SearchText": data.useFulldata.searchVal,
            "PageSize":data.useFulldata.pageSize,
            "OdatanextLink":data.useFulldata.nextLink,
            "RequestedPageNumber": data.useFulldata.pageNo
        }
        return this.getKeyContact(body).pipe(switchMap(res=>{
                return of((!res.IsError) ? { ...res, ResponseObject: this.filtergetKeyConatctColumndata(res.ResponseObject) } : { ...res })
            }))
        
     }

     filtergetKeyConatctColumndata(data){
         if(data){
             if(data.length>0){
                 return data.map(x=>{
                     return {
                         id: x.SysGuid,
                         name: x.Name,
                         isDatafiltered:false 
                     }
                 })
             }else{
                 return []
             }
         }else{
             return []
         }
     }

     getRelationshipColumnFilterData(data:any): Observable<any> {
        let body = this.GetAppliedFilterData({ ...data})
        return this.getRelationship(body).pipe(switchMap(res=>{
                return of((!res.IsError) ? { ...res, ResponseObject: this.filtergetRelationshipColumndata(res.ResponseObject) } : { ...res })
            }))
        
     }

     filtergetRelationshipColumndata(data){
        if(data){
            if(data.length>0){
                return data.map(x=>{
                    return {
                        id: x.SysGuid,
                        name: x.Name,
                        isDatafiltered:false 
                    }
                })
            }else{
                return []
            }
        }else{
            return []
        }
    }


     getCategoryColumnFilterData(data:any): Observable<any> {

        let body = this.GetAppliedFilterData({ ...data})
     
        return this.getCategory(body).pipe(switchMap(res=>{
                return of((!res.IsError) ? { ...res, ResponseObject: this.filtergetCategoryColumndata(res.ResponseObject) } : { ...res })
            }))
        
     }

     filtergetCategoryColumndata(data){
        if(data){
            if(data.length>0){
                return data.map(x=>{
                    return {

                        id: x.SysGuid,
                        name: x.Name,
                        isDatafiltered:false 
                    }
                })
            }else{
                return []
            }
        }else{
            return []
        }
    }

    pluckParticularKey(array, key) {
        console.log("pluckParticularKey",array,key);
        return array.map(function (item) { return (item[key]) });
    }


    // ------------------- Contact history start ------------------
    getIMTGraphData(contactGuid: any,accountName:any,contactName:any){
        var body = 
        {
            "SysGUID": contactGuid ,
            "AccountName":accountName, 
             "Name": contactName
      }  
        return this.apiService.post(routes.contactHistoryapi, body);
    }

    // getIMTGraphData(){
      
    //     return this.apiService.post("https://localhost:44368/api/v1/AccountManagement/GetIMTGraphData");
    // }



}
