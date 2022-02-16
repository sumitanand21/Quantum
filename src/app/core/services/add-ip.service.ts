import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OpportunitiesService } from './opportunities.service';
import { switchMap } from 'rxjs/operators';
import { ApiServiceOpportunity } from './api.service';


export const addIpNames = {
    'ip': { name: 'IP', isCheckbox: false, isAccount: false },
    'module': { name: 'Module', isCheckbox: false, isAccount: false },
    'slbdm': { name: 'SL BDM', isCheckbox: false, isAccount: false },
    'holmesbdm': { name: 'Holmes BDM', isCheckbox: false, isAccount: false },
}
export const IpHeader: any[] = [

    { name: 'name', title: 'Name' },
    { name: 'owner', title: 'Owner' },
    { name: 'type', title: 'Type' }

]
export const ModuleHeader: any[] = [
    { name: 'name', title: 'Name' },
    { name: 'owner', title: 'Owner' }
]
export const SLBDMHeader: any[] = [

    { name: 'username', title: 'Username' },
    { name: 'email', title: 'Email id' }

]

export const HolmesBDMHeader: any[] = [
    { name: 'username', title: 'Username' },
    { name: 'email', title: 'Email id' }
]
export const addIpHeaders = {
    'ip': IpHeader,
    'module': ModuleHeader,
    'slbdm': SLBDMHeader,
    'holmesbdm' : HolmesBDMHeader
}

//Sumit Var declaration
export const BSSolutionNameHeaders: any[] = [
    //{ name: 'ProductTypeCodeName', title: 'Type' },
    { name: 'AccountName', title: 'Name' },
    { name: 'OwnerName', title: 'Owner' }
]

export const BSSolutionOwnerNameHeaders: any[] = [
    { name: 'Name', title: 'Name' },
    { name: 'EmailID', title: 'EmailID' }]

export const BSIPIPHeaders: any[] = [  
    { name: 'name', title: 'Name' },
    { name: 'OwnerName', title: 'Owner' },
    { name: 'ProductTypeCodeName', title: 'Type' },
]

export const BSIPModuleHeaders: any[] = [
    { name: 'ModuleName', title: 'Name' },
    { name: 'OwnerName', title: 'Owner' }
]

export const BSSLSLBDMHeaders: any[] = [
    { name: 'Name', title: 'Username' },
    { name: 'EmailID', title: 'Email ID' }
]
export const BSIPSLBDMHeaders: any[] = [
    { name: 'Name', title: 'Username' },
    { name: 'EmailID', title: 'Email ID' }
]

export const BSHolmesBDMHeaders: any[] = [
    { name: 'Name', title: 'Username' },
    { name: 'EmailID', title: 'Email ID' }
]

export const BSSolutionBDMHeaders: any[] = [
    { name: 'Name', title: 'Username' },
    { name: 'EmailID', title: 'Email ID' }
]

export const BSPricingTypeHeaders: any[] = [
    { name: 'Name', title: 'Pricing Type' },
    { name: 'Code', title: 'Pricing Type Code' }
]

export const BSCASLBDMHeaders: any[] = [
    { name: 'Name', title: 'Username' },
    { name: 'EmailID', title: 'Email ID' }
]

export const SapCodeHeaders: any[] = [
    { name: 'Name', title: 'SAP Customer Name' },
    { name: 'WiproSapCustomerNumber', title: 'SAP Customer Number' },
    { name: 'WiproSapCompanyCode', title: 'SAP Company Code'}
  ]

  export const VSOwnerHeaders: any[] = [
    { name: 'Name', title: 'Vertical sales owner Name' },
    { name: 'EmailID', title: 'Email ID' },
  ]

  export const AdvisorHeaders: any[] = [
    { name: 'Name', title: 'Advisor Name' },
    { name: 'accountOwner', title: 'Owner Name' },
  ]

  export const CountryHeaders: any[] = [
    { name: 'Name', title: 'Country Name' },
    { name: 'RegionName', title: 'Region Name' },
    { name: 'GeoName', title: 'Geo Name' },
  ]

  export const CurrencyHeaders: any[] = [
    { name: 'Name', title: 'Currency Name' },
    { name: 'Type', title: 'Currency Symbol' },
    { name: 'SysNumber', title: 'Exchange Rate' },
    { name: 'IsoCurrencyCode', title: 'ISO Currency Code' },
    //{ name: 'SysGuid', title: 'transactioncurrencyid' },
  ]

export const opportunityAdvnBSSolutionHeaders = {
    'BSSLSLBDM': BSSLSLBDMHeaders,
    'BSIPSLBDM': BSIPSLBDMHeaders,
    'BSCASLBDM': BSCASLBDMHeaders,
    'BSIPIP': BSIPIPHeaders,
    'BSIPModule': BSIPModuleHeaders,
    'BSIPHolmesBDM': BSHolmesBDMHeaders,
    'BSSolutionName': BSSolutionNameHeaders,
    'BSSolutionOwnerName':BSSolutionOwnerNameHeaders,
    'BSIPSolutionBDM': BSSolutionBDMHeaders,
    'BSSLPricingType': BSPricingTypeHeaders,
    'BSIPPricingType': BSPricingTypeHeaders,
    
    // 'Leads':LeadHeaders,
    // 'DecisionMakers':DecisionMakerHeaders,
    'SAPCode':SapCodeHeaders,
    'VSO':VSOwnerHeaders,
    'Advisor':AdvisorHeaders,
    'Contractingcountry':CountryHeaders,
    'Currency':CurrencyHeaders,
    'ContractCurrency':CurrencyHeaders,

}

export const opportunityAdvnBSSolutionNames = {
    'BSSLSLBDM': { name: 'SL BDM', isCheckbox: false, isAccount: false },
    'BSIPSLBDM': { name: 'SL BDM', isCheckbox: false, isAccount: false },
    'BSCASLBDM': { name: 'SL BDM', isCheckbox: false, isAccount: false },
    'BSIPIP': { name: 'IP', isCheckbox: false, isAccount: false },
    'BSIPModule': { name: 'Module', isCheckbox: false, isAccount: false },
    'BSIPHolmesBDM': { name: 'Holmes BDM', isCheckbox: false, isAccount: false },
    'BSSolutionName': { name: 'Name', isCheckbox: false, isAccount: false },
    'BSSolutionOwnerName': { name: 'Owner', isCheckbox: false, isAccount: false },
    'BSIPSolutionBDM': { name: 'Solution BDM', isCheckbox: false, isAccount: false },
    'BSSLPricingType': { name: 'Pricing Type', isCheckbox: false, isAccount: false },
    'BSIPPricingType': { name: 'Pricing Type', isCheckbox: false, isAccount: false },
    // 'Leads' : {name :'Leads' , isCheckbox :true,isAccount :false },
    // 'DecisionMakers' : {name :'DecisionMakers' , isCheckbox :true,isAccount :false },
    'SAPCode':{name :'SAP customer Code' , isCheckbox : false,isAccount : false },
    'VSO':{name :'Vertical sales owner' , isCheckbox : false,isAccount : false },
    'Advisor':{name :'Advisor' , isCheckbox : false,isAccount : false },
    'Contractingcountry':{name :'Contracting country' , isCheckbox : false,isAccount : false },
    'Currency':{name :'Currency' , isCheckbox : false,isAccount : false },
    'ContractCurrency':{name :'Currency' , isCheckbox : false,isAccount : false },

    // 'AdvisorName':{name :'Advisor' , isCheckbox :false,isAccount :false },
    // 'Currency':{name :'Currency' , isCheckbox :false,isAccount :false },
    // 'AdvisorContact':{name :'Advisor Contact' , isCheckbox :false,isAccount :false },
    // 'PrimaryContact':{name :'Primary Contact' , isCheckbox :false,isAccount :false },
}



//Sumit Var declaration Ends

const routes = {
    getIpProductDeatils: 'Common/GetIPSolutionProductLookup',
    getModuleLookup: 'Common/GetModuleLookup',
    getSLBDMList: 'Common/GetServiceLineBDMList1',
    getPricingTypeListUrl : 'Common/GetPricingTypeLookUp',
    getHolmesSLBDMList: 'Common/GetProductBDMLookUp',
    getSLBDMList1: 'Common/GetServiceLineBDMList1',
    getHolmesAndSolutionBDM :'Common/GetProductBDMLookUp',
    getSolAccount:'Common/GetAccountCategogyList',
    getSolOwnerName:'Common/GetAccountOwnerLookup',
    getCAverticalBDMList: 'OpportunityCreditAllocations/GetVBDM',
    getCountryList:'Common/GetCountryLookUp',
    getverticalSalesOwner:'Common/GetVerticalSalesOwners',
    finderAllianceLookup :'Common/GetAccountLookUp',
    getCurrency:'Common/GetTransactionCurrency',
    getSapCode:'Common/GetSapCodeDetails',
    getContactDetails:'Common/GetAdvisorcontactLookup',
    getDealRegistrationStatus :'v1/MasterManagement/GetDealRegistrationStatus',
    GetDealRegistrationStatusReason:'v1/MasterManagement/GetDealRegistrationStatusReason'
}
@Injectable({
    providedIn: 'root'
})
export class AddIpService {
    constructor(public apiServiceOpportunity: ApiServiceOpportunity) { }
    getLookUpFilterData(data): Observable<any> {
        switch (data.controlName) {
            case 'ip':
                return this.getIpdata(data)
            case 'module':
                return this.getModuleLookup(data)
            case 'slbdm':
                return this.getSLBDMList(data)
            case 'holmesbdm' :
                return this.getHolmesBDMList(data);
        }
    }
    getHolmesBDMList(data: any): Observable<any> {
        if (data.isService) {
          let body = {
            "Id": data.useFullData.guid,
            "SearchText": data.useFullData.searchVal,
            "SearchType":"184450001",
            "PageSize":data.useFullData.recordCount,
            "RequestedPageNumber": data.useFullData.pageNo,
            "OdatanextLink": data.useFullData.OdatanextLink
              }
            return this.getIpandHolmesBDM(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnHolmesbdm(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterAdvnHolmesbdm(data.data))
        }
    }
    getIpdata(data: any): Observable<any> {
        if (data.isService) {
            let body = {
                "SearchText": data.useFullData.searchVal,
                "PageSize": data.useFullData.recordCount,
                "RequestedPageNumber": data.useFullData.pageNo,
                "OdatanextLink": data.useFullData.OdatanextLink

            }
            return this.getIpProductDetails(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnIp(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterAdvnIp(data.data))
        }
    }

    getModuleLookup(data: any): Observable<any> {
        if (data.isService) {
            let body = {
                "Guid": data.useFullData.guid,
                "SearchText": data.useFullData.searchVal,
                "pagesize": data.useFullData.recordCount,
                "RequestedPageNumber": data.useFullData.pageNo,
                "OdatanextLink": ""//data.useFullData.OdatanextLink

            }
            return this.getModuleLookupData(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnModule(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterAdvnModule(data.data))
        }
    }

    getSLBDMList(data: any): Observable<any> {
        if (data.isService) {
          let body = {
            "SBUGuid": data.useFullData.sbuGuid,
            "ServiceLineID": data.useFullData.serviceLineId,
            "GEOGuid":data.useFullData.geoGuid,
            "VerticalID": data.useFullData.verticalId,
            "PracticeID":data.useFullData.practiceId,
            "RegionidID": data.useFullData.regionId,
            "SearchText": data.useFullData.searchVal,
            "PageSize": data.useFullData.recordCount,
            "RequestedPageNumber": data.useFullData.pageNo,
            "OdatanextLink": data.useFullData.OdatanextLink
          }
            return this.getSLBDMData(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnSlbdm(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterAdvnSlbdm(data.data))
        }
    }

    filterAdvnHolmesbdm(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        ...x,
                        'username': (x.Name) ? x.Name : '-',
                        'email': (x.EmailID) ? x.EmailID : '-',
                         'Id':(x.SysGuid) ? x.SysGuid : ''
                    }

                })

            } else {
                return []
            }
        } else {
            return []
        }
    }
    
    filterAdvnIp(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        ...x,
                        'name':  (x.Name) ? x.Name=this.getSymbolNew(x.Name) : '-',
                        'type': (x.ProductTypeCodeName) ? x.ProductTypeCodeName : '-',
                         'owner':(x.WiproSoultionOwner) ? x.WiproSoultionOwner : '-',
                         'Id':(x.ProductId) ? x.ProductId : ''
                    }

                })

            } else {
                return []
            }
        } else {
            return []
        }

    }
    getSymbolNew(data) {
        data = data.replace('?','-');
        data = this.escapeSpecialChars(data);
        return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
      }

      escapeSpecialChars(jsonString) {
        return jsonString.replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r")
            .replace(/\t/g, "\\t")
            .replace(/\f/g, "\\f");

    }
    filterAdvnModule(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        ...x,
                        'name':  (x.Name) ? x.Name=this.getSymbolNew(x.Name) : '-',//(x.Name) ? x.Name : '',
                        'owner': (x.OwnerName) ? x.OwnerName : '-',
                        'Id':(x.SysGuid) ? x.SysGuid : ''
                    }

                })

            } else {
                return []
            }
        } else {
            return []
        }

    }
    filterAdvnSlbdm(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        ...x,
                        'username': (x.Name) ? x.Name : '-',
                        'email': (x.EmailID) ? x.EmailID : '-',
                        'Id':(x.SysGuid) ? x.SysGuid : ''
                    }

                })

            } else {
                return []
            }
        } else {
            return []
        }
    }
    getIpProductDetails(body): Observable<any> {
        return this.apiServiceOpportunity.post(routes.getIpProductDeatils, body);
    }

    getModuleLookupData(body): Observable<any> {
        return this.apiServiceOpportunity.post(routes.getModuleLookup, body);
    }

    getSLBDMData(body): Observable<any> {
        return this.apiServiceOpportunity.post(routes.getSLBDMList,body);
    }

    getIpandHolmesBDM(body): Observable<any> {
        return this.apiServiceOpportunity.post(routes.getHolmesSLBDMList,body);
    }

    getPricingTypeList(searchVal: String, PageSize: any, RequestedPageNumber: any,OdatanextLink:any): Observable<any> {
        let body = {
            "SearchText": searchVal ? searchVal : null,
            "PageSize": PageSize,
            "RequestedPageNumber": RequestedPageNumber,
            "OdatanextLink": OdatanextLink

        }
        return this.getPricingTypeAPI(body).pipe(switchMap(res => {
            if (res) {
                return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.createPricingTypeObjArray(res.ResponseObject) : [] } : [])
            } else {
                return of([])
            }
        }))
    }

    getPricingTypeAPI(body: any): Observable<any> {
        return this.apiServiceOpportunity.post(routes.getPricingTypeListUrl, body);
    }

    createPricingTypeObjArray(data): Observable<any> {
        console.log("Pricing Type", data);
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        'SysGuid': (x.PricingTypeID) ? x.PricingTypeID : '',
                        'Name': (x.PricingTypeName) ? x.PricingTypeName : '',
                        'Code': (x.PricingTypeCode) ? x.PricingTypeCode : '',
                        'Id': (x.PricingTypeID) ? x.PricingTypeID : ''
                    }
                })
            } else {
                return of([])
            }
        } else {
            return of([])
        }
    }



    // Function created by Sumit
    getSLBDMDropDownList(serviceLineId: String,verticalId: any, regionId: any, searchVal: String, PageSize: any, RequestedPageNumber: any,OdatanextLink:any): Observable<any> {

        let body = {
            "ServiceLineID": serviceLineId,
            "VerticalID": verticalId,
            "RegionidID": regionId,
            "SearchText": searchVal,
            "PageSize": PageSize,
            "RequestedPageNumber": RequestedPageNumber,
            "OdatanextLink": OdatanextLink

        }
        return this.getSLBDMDataAPI(body).pipe(switchMap(res => {
            if (res) {
                return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.createSLDBMObjArray(res.ResponseObject) : [] } : [])
            } else {
                return of([])
            }
        }))

    }

    getSLBDMDataAPI(body: any): Observable<any> {
        return this.apiServiceOpportunity.post(routes.getSLBDMList, body);
    }

     getSLBDMDropDownList1(serviceLineId: String, practiceId: string,sbuId: any,geoId: any,verticalId: any, regionId: any, searchVal: String, PageSize: any, RequestedPageNumber: any,OdatanextLink:any): Observable<any> {

        // let body = {
        //     "ServiceLineID": serviceLineId,
        //     "PracticeID":practiceId,
        //     "SbuID":sbuId,
        //     "GeoID":geoId,
        //     "VerticalID": verticalId,
        //     "RegionidID": regionId,
        //     "SearchText": searchVal,
        //     "PageSize": PageSize,
        //     "RequestedPageNumber": RequestedPageNumber,
        //     "OdatanextLink": OdatanextLink

        // }

        let body = {
            "SBUGuid": sbuId,
            "ServiceLineID": serviceLineId,
            "GEOGuid": geoId,
            "VerticalID": verticalId,
            "PracticeID": practiceId,
            "RegionidID": regionId,
            "SearchText": searchVal,
            "PageSize": PageSize,
            "RequestedPageNumber": RequestedPageNumber,
            "OdatanextLink": OdatanextLink
          }
        return this.getSLBDMDataAPI1(body).pipe(switchMap(res => {
            if (res) {
                return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.createSLDBMObjArray(res.ResponseObject) : [] } : [])
            } else {
                return of([])
            }
        }))

    }

    getSLBDMDataAPI1(body: any): Observable<any> {
        return this.apiServiceOpportunity.post(routes.getSLBDMList1, body);
    }


    createSLDBMObjArray(data): Observable<any> {
        console.log("SLdata", data);
        // return data.map(x => {
        //     return {
        //         'SysGuid': (x.SysGuid) ? x.SysGuid : '',
        //         'Name': (x.Name) ? x.Name : '',
        //         'EmailID': (x.EmailID) ? x.EmailID : '',
        //         'Id': (x.SysGuid) ? x.SysGuid : ''
        //     }

        // })
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        'SysGuid': (x.SysGuid) ? x.SysGuid : '',
                        'Name': (x.Name) ? x.Name : '',
                        'EmailID': (x.EmailID) ? x.EmailID : '',
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

    getIPModuleDropDownList(IpId: any, searchVal: String, PageSize: any, RequestedPageNumber: any,OdatanextLink:any): Observable<any> {

                let body = {

                    "Guid": IpId,
                    "SearchText": searchVal,
                    "pagesize": PageSize,
                    "RequestedPageNumber": RequestedPageNumber,
                    "OdatanextLink": OdatanextLink

                }
                return this.getIPModuleDataAPI(body).pipe(switchMap(res => {
                    if (res) {
                        return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.createIpModuleObjArray(res.ResponseObject) : [] } : [])
                    } else {
                        return of([])
                    }
                }))

            }

            getIPModuleDataAPI(body: any): Observable<any> {
                return this.apiServiceOpportunity.post(routes.getModuleLookup, body);
            }

            createIpModuleObjArray(data): Observable<any> {
                console.log("Moduledata", data);
                if (data) {
                    if (data.length > 0) {
                        return data.map(x => {
                            return {
                                'WiproProductModuleId': (x.SysGuid) ? x.SysGuid : '',
                                'ModuleName': (x.Name) ? this.getSymbolNew(x.Name) : 'NA',
                                'OwnerId': (x.OwnerId) ? x.OwnerId : '',
                                'OwnerName': (x.OwnerName) ? x.OwnerName : '',
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

    getIPDropDownList(SearchType: any, searchVal: String, PageSize: any, RequestedPageNumber: any,OdatanextLink:any): Observable<any> {

                let body = {

                        "SearchText": searchVal,
                        "SearchType": SearchType,
                        "PageSize": PageSize,
                        "RequestedPageNumber": RequestedPageNumber,
                        "OdatanextLink": OdatanextLink



                }
                return this.getIPDataAPI(body).pipe(switchMap(res => {
                    if (res) {
                        if(SearchType == null){
                            console.log("if of getIPDataAPI")
                        return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.createIPObjArray(res.ResponseObject) : [] } : [])
                    }else if(SearchType == 5){
                         console.log("else if of getIPDataAPI")
                        return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.createSolNameObjArray(res.ResponseObject) : [] } : [])
                        }
                    } else {
                         console.log("else of getIPDataAPI")
                        return of([])
                    }
                }))

            }

            getIPDataAPI(body: any): Observable<any> {
                return this.apiServiceOpportunity.post(routes.getIpProductDeatils, body);
            }

            createIPObjArray(data: any):Observable<any> {
                console.log("Ipdata", data);

                if (data) {
                    if (data.length > 0) {
                        console.log("Ipdata if", data);
                        return data.map(x => {
                            return {
                                'name': (x.Name) ? this.getSymbolNew(x.Name) : 'NA',
                                'productid': (x.ProductId) ? x.ProductId : '',
                                'ProductTypeCodeName': (x.ProductTypeCodeName) ? x.ProductTypeCodeName : '',
                                'productcode': (x.ProductTypeCode) ? x.ProductTypeCode : '',
                                'OwnerIdValue': (x.WiproSoultionOwnerValue) ? x.WiproSoultionOwnerValue : '',
                                'OwnerName': (x.WiproSoultionOwner) ? x.WiproSoultionOwner : '',
                                'ModuleCount': (x.ModuleCount) ? x.ModuleCount : '',
                                'Id': (x.ProductId) ? x.ProductId : ''
                            }
                        })
                    } else {
                          console.log("Ipdata if1", data);
                        return of([])
                    }
                } else {
                      console.log("Ipdata if2", data);
                    return of([])
                }
            }



            createSolNameObjArray(data): Observable<any> {
                console.log("SoLdata", data);

                if (data) {
                    if (data.length > 0) {
                        return data.map(x => {
                            return {
                                'AccountName': (x.Name) ? this.getSymbolNew(x.Name) : 'NA',
                                'AccountId': (x.ProductId) ? x.ProductId : '',
                                'ProductTypeCodeName': (x.ProductTypeCodeName) ? x.ProductTypeCodeName : '',
                                'productcode': (x.ProductTypeCode) ? x.ProductTypeCode : '',
                                'SysNumber':'',
                                'OwnerIdValue': (x.WiproSoultionOwnerValue) ? x.WiproSoultionOwnerValue : '',
                                'OwnerName': (x.WiproSoultionOwner) ? x.WiproSoultionOwner : '',
                                'Id': (x.ProductId) ? x.ProductId : ''
                            }
                        })
                    } else {
                        return of([])
                    }
                } else {
                    return of([])
                }
            }


            getIPHolmesandSolutionBDMDropDownList(Id:any,SearchType: any, searchVal: String, PageSize: any, RequestedPageNumber: any,OdatanextLink:any): Observable<any> {

                        let body = {
                                "Id": Id,
                                "SearchText": searchVal,
                                "SearchType": SearchType,
                                "PageSize": PageSize,
                                "RequestedPageNumber": RequestedPageNumber,
                                "OdatanextLink": OdatanextLink



                        }
                        return this.getIPHolmesandSolutionBDMDataAPI(body).pipe(switchMap(res => {
                            if (res) {
                                return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.createIPHolmesandSolutionBDMObjArray(res.ResponseObject) : [] } : [])
                            } else {
                                return of([])
                            }
                        }))

                    }

                    getIPHolmesandSolutionBDMDataAPI(body: any): Observable<any> {
                        return this.apiServiceOpportunity.post(routes.getHolmesAndSolutionBDM, body);
                    }

                    createIPHolmesandSolutionBDMObjArray(data): Observable<any> {
                        console.log("IpHolmesdata", data);

                        if (data) {
                            if (data.length > 0) {
                                return data.map(x => {
                                    return {
                                        'Name': (x.Name) ? x.Name : '',
                                        'SysGuid': (x.SysGuid) ? x.SysGuid : '',
                                        'EmailID': (x.EmailID) ? x.EmailID : '',
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


                    getSolOwnerNameAllianceandNewAgeDropDownList(obj): Observable<any> {

                                return this.getSolOwnerNameAllianceandNewAgeDataAPI(obj).pipe(switchMap(res => {
                                    if (res) {
                                        return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.createSolOwnerNameAllianceandNewAgeObjArray(res.ResponseObject) : [] } : [])
                                    } else {
                                        return of([])
                                    }
                                }))

                            }
                             getSolOwnerNameAllianceandNewAgeDataAPI(body: any): Observable<any> {
                                return this.apiServiceOpportunity.post(routes.getSolOwnerName, body);
                            }
                              getSolNameAllianceandNewAgeDropDownList(SearchType: any, searchVal: String, PageSize: any, RequestedPageNumber: any,OdatanextLink:any): Observable<any> {

                                let body = {
                                        "SearchText": searchVal,
                                        "SearchType": SearchType,
                                        "PageSize": PageSize,
                                        "RequestedPageNumber": RequestedPageNumber,
                                        "OdatanextLink": OdatanextLink
                                }
                                return this.getSolNameAllianceandNewAgeDataAPI(body).pipe(switchMap(res => {
                                    if (res) {
                                        return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.createSolNameAllianceandNewAgeObjArray(res.ResponseObject,SearchType) : [] } : [])
                                    } else {
                                        return of([])
                                    }
                                }))

                            }

                            getSolNameAllianceandNewAgeDataAPI(body: any): Observable<any> {
                                return this.apiServiceOpportunity.post(routes.getSolAccount, body);
                            }
                           

                            createSolNameAllianceandNewAgeObjArray(data,SearchType): Observable<any> {
                                console.log("Ipdata", data);

                                if (data) {
                                    if (data.length > 0) {
                                        return data.map(x => {
                                            return {
                                                'AccountName': (x.Name) ? this.getSymbolNew(x.Name) : 'NA',
                                                'AccountId': (x.SysGuid) ? x.SysGuid : '',
                                                'ProductTypeCodeName': (SearchType == '15')?'New Age Business':'Alliance',
                                                'productcode': '',
                                                'SysNumber':(x.SysNumber) ? x.SysNumber : '',
                                                'OwnerIdValue': (x.MapGuid) ? x.MapGuid : '',
                                                'OwnerName': (x.MapName) ? x.MapName : '',
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
                            createSolOwnerNameAllianceandNewAgeObjArray(data): Observable<any> {
                                console.log("Ipdata", data);

                                if (data) {
                                    if (data.length > 0) {
                                        return data.map(x => {
                                            return {
                                                'SysGuid': (x.SysGuid) ? x.SysGuid : '',
                                                'Name': (x.Name) ? x.Name : '',  
                                                'EmailID':(x.EmailID) ? x.EmailID : '',
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


                            getCAVearticalBDMDropDownList(verticalId: any, regionId: any, searchVal: String, PageSize: any, RequestedPageNumber: any,OdatanextLink:any): Observable<any> {

                                        let body = {
                                            // "VerticalID": verticalId,
                                            // "RegionidID": regionId,
                                            "SearchText": searchVal,
                                            "PageSize": PageSize,
                                            "RequestedPageNumber": RequestedPageNumber,
                                            "OdatanextLink": OdatanextLink

                                        }
                                        return this.getCAVearticalBDMDataAPI(body).pipe(switchMap(res => {
                                            if (res) {
                                                console.log("resp",res);
                                                return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.createCAVearticalDBMObjArray(res.ResponseObject) : [] } : [])
                                            } else {
                                                return of([])
                                            }
                                        }))

                                    }

                                    getCAVearticalBDMDataAPI(body: any): Observable<any> {
                                        return this.apiServiceOpportunity.post(routes.getCAverticalBDMList, body);
                                    }

                                    createCAVearticalDBMObjArray(data): Observable<any> {
                                        debugger;
                                        console.log("Verticaldata", data);
                                        // return data.map(x => {
                                        //     return {
                                        //         'SysGuid': (x.SysGuid) ? x.SysGuid : '',
                                        //         'Name': (x.Name) ? x.Name : '',
                                        //         'EmailID': (x.EmailID) ? x.EmailID : '',
                                        //         'Id': (x.SysGuid) ? x.SysGuid : ''
                                        //     }

                                        // })
                                        if (data) {
                                            if (data.length > 0) {
                                                return data.map(x => {
                                                    return {
                                                        'SysGuid': (x.SystemuserId) ? x.SystemuserId : '',
                                                        'Name': (x.Fullname) ? x.Fullname : '',
                                                        'EmailID': (x.EmailAddress) ? x.EmailAddress : '',
                                                        'Id': (x.SystemuserId) ? x.SystemuserId : ''
                                                    }
                                                })
                                            } else {
                                                return of([])
                                            }
                                        } else {
                                            return of([])
                                        }
                                    }

    //End of function created by Sumit


    //Overview lookup functions start
    getSapCodeDataOrder(Id,SearchText,PageSize,RequestedPageNumber,OdatanextLink) : Observable<any> {

  let body = {
      "SearchText": SearchText?SearchText:'',
      "PageSize": PageSize,
      "OdatanextLink": OdatanextLink,
      "RequestedPageNumber": RequestedPageNumber,
      "Id":Id
  }
 return this.getSapCodeOrder( body).pipe(switchMap(res=>{
  if (res) {
    console.log(res)
      return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length>0)?this.filtergetSapCodeOrder(res.ResponseObject):[] } : [])
  } else {
      return of([])
  }
 }))

}

// SAP Code API Call
getSapCodeOrder(sapObj:Object){
    return this.apiServiceOpportunity.post(routes.getSapCode, sapObj);
    }

filtergetSapCodeOrder(data): Observable<any> {
debugger;
if (data) {
    if (data.length > 0) {
        return data.map(x => {
            return {
                'Name': (x.Name) ? this.getSymbolNew(x.Name) : '',
                'WiproSapCustomerNumber' : (x.WiproSapCustomerNumber) ? x.WiproSapCustomerNumber : '',
                'WiproSapCompanyCode': (x.WiproSapCompanyCode) ? x.WiproSapCompanyCode : '',
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

// Vertical Sales owner API Call
getVerticalOwnerDetailsOrder(sbuId,geoId,RegionId,AccountId,VerticalId,SearchText,PageSize,RequestedPageNumber,OdatanextLink) : Observable<any> {
      let body = {
          "SearchText": SearchText?SearchText:'',
          "PageSize": PageSize,
          "OdatanextLink": OdatanextLink,
          "RequestedPageNumber": RequestedPageNumber,
          "Guid": AccountId,
          "VerticalID": VerticalId,
          "RegionidID": RegionId ? RegionId : null,
          "GEOGuid": geoId ? geoId : null,
          "SBUGuid": sbuId ? sbuId : null,
      }
     return this.getVerticalsalesOwnerListOrder(body).pipe(switchMap(res=>{
      if (res) {
        console.log(res)
          return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length>0)?this.filterVerticalOwnerOrder(res.ResponseObject):[] } : [])
      } else {
          return of([])
      }
     }))
}

getVerticalsalesOwnerListOrder(verticalsalesOwner: Object) {
    return this.apiServiceOpportunity.post(routes.getverticalSalesOwner, verticalsalesOwner);  }

    filterVerticalOwnerOrder(data): Observable<any> {
    if (data) {
        if (data.length > 0) {
            return data.map(x => {
                return {
                    'Name': (x.UserName) ? x.UserName : 'NA',
                    'EmailID' : (x.EmailId) ? x.EmailId : 'NA',
                    'Id': (x.UserId) ? x.UserId : '',
                }
            })
        } else {
            return of([])
        }
    } else {
        return of([])
    }
}

// Advisor API call
getAllianceFinderDataOrder(SearchText,SearchType,PageSize,RequestedPageNumber,OdatanextLink): Observable<any> {


                let body = {
         "SearchText":SearchText?SearchText:'',
         "SearchType":SearchType,
         "PageSize":PageSize,
       "RequestedPageNumber":RequestedPageNumber,
         "OdatanextLink":OdatanextLink
                }


                return this.getAllianceFinderSearchDataOrder(body).pipe(switchMap(res => {

                    if (res) {

                        return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnAllianceFinderOrder(res.ResponseObject) : [] } : [])
                    } else {
                        return of([])
                    }
                }))
        }



    getAllianceFinderSearchDataOrder(body): Observable<any>{


      return this.apiServiceOpportunity.post(routes.finderAllianceLookup, body);

    }

       filterAdvnAllianceFinderOrder(data): Observable<any> {
            debugger
            if (data) {
                if (data.length > 0) {

                    return data.map(x => {

                        return {
                            'Name': (x.Name) ? this.getSymbolNew(x.Name) : '',
                            'accountOwner': (x.OwnerName) ? x.OwnerName : '',
                            'Id':(x.SysGuid) ? x.SysGuid : '',

                        }
                    })
                } else {
                    return of([])
                }
            } else {
                return of([])
            }

        }

        //Country API Call
        getCountryDetailsOrder(SearchText,PageSize,RequestedPageNumber,OdatanextLink) : Observable<any> {
              let body = {
                  "SearchText": SearchText,
                  "PageSize": PageSize,
                  "OdatanextLink": OdatanextLink,
                  "RequestedPageNumber": RequestedPageNumber,
              }
             return this.getCountryListOrder(body).pipe(switchMap(res=>{
              if (res) {
                console.log(res)
                  return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length>0)?this.filterCountryOrder(res.ResponseObject):[] } : [])
              } else {
                  return of([])
              }
             }))
        }

        getCountryListOrder(data) {
            return this.apiServiceOpportunity.post(routes.getCountryList, data);
          }

         filterCountryOrder(data): Observable<any> {
            if (data) {
                if (data.length > 0) {
                    return data.map(x => {
                        return {...x,
                            'Name': (x.CountryName) ? x.CountryName : 'NA',
                            'RegionName' : (x.RegionName) ? x.RegionName : 'NA',
                            'GeoName': (x.GeoName) ? x.GeoName : 'NA',
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


        //Currency ApI Call

        getCurrencyDetailsOrder(SearchText,PageSize,RequestedPageNumber,OdatanextLink) : Observable<any> {
            debugger;
      let body = {
          "SearchText": SearchText,
          "PageSize": PageSize,
          "RequestedPageNumber": RequestedPageNumber,
          "OdatanextLink": OdatanextLink
      }
     return this.getCurrencyDataOrder( body).pipe(switchMap(res=>{
      if (res) {
        console.log(res)
          return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length>0)?this.filterCurrencyOrder(res.ResponseObject):[] } : [])
      } else {
          return of([])
      }
    }))

}

getCurrencyDataOrder(currency:Object){
    return this.apiServiceOpportunity.post(routes.getCurrency, currency);
    }

    getSymbol(data) {
        return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
      }

 filterCurrencyOrder(data): Observable<any> {
   debugger;
    if (data) {
        if (data.length > 0) {
            return data.map(x => {
                return {...x,
                    'Name': (x.Name) ? x.Name=this.getSymbolNew(x.Name)  : 'NA',
                    'Type' : (x.Type) ? x.Type=this.getSymbolNew(x.Type) : 'NA',
                    'SysNumber': (x.SysNumber) ? x.SysNumber : 'NA',
                    'IsoCurrencyCode': (x.IsoCurrencyCode) ? x.IsoCurrencyCode : '',
                    'Id': (x.SysGuid) ? x.SysGuid : 'NA',
                }
            })
        } else {
            return of([])
        }
    } else {
        return of([])
    }
}


    // End of Overview lookup functions start    


    //Deal Registartion start

    getRegistrationStatusForAlliance()
    {
      return this.apiServiceOpportunity.get(routes.getDealRegistrationStatus);
    }

    getRegistrationStatusReasonForAlliance(isDealRegistered)
    {
      return this.apiServiceOpportunity.post(routes.GetDealRegistrationStatusReason,isDealRegistered);
    }


}
