import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiServiceOpportunity } from './api.service';
import { switchMap} from 'rxjs/operators';
import { DatePipe } from '@angular/common';
const routes = {
    retaggingFilter:'OpportunityRetagging/GetBFMApprovedOrderColmnsFilter',
    changeOpportunity: 'OpportunityRetagging/GetBFMApprovedOrderList',
    opportunityTypeChange:'OpportunityRetagging/RetaggOpportunity',
    filterByOpportunityName:'OpportunityRetagging/GetSearchOpportunityName',
    filterByOrderNumber:'OpportunityRetagging/GetSearchOrderNumber',
    filterByOpportunityId:'OpportunityRetagging/GetSearchOpportunityId',
    filterByOrderOwner:'v1/LeadManagement/SearchOwner',
    filterBySource:'v1/MasterManagement/GetWiproSource',
    filterByPropsalType:'v1/MasterManagement/GetProposalType',
    filterBySapCode:'common/GetSapCodeDetails',
    filterByDate:'OpportunityRetagging/GetOrderSearchStartandEnddate',
    getFilteredDataApi:'OpportunityRetagging/GetBFMApprovedOrderFilterList',

};

export const changeOpportunityHeader: any[] = [
    { id: 1, isFilter: false, name: 'OrderNumber', SortId:42,isFixed: true, order: 1, title: 'Order number',className:"notlinkcol", displayType:"upperCase"  },
    { id: 2, isFilter: false, name: 'OpportunityName', SortId:"0",isFixed: false, order: 2, title: ' Opportunity name', className:'approvalstatus',displayType:"name"},
    { id: 3, isFilter: false, name: 'OpportunityNumber',SortId:23, isFixed: false, order: 3, title: 'Opportunity ID',displayType:"upperCase"},
    { id: 4, isFilter: false, name: 'OrderOwner', SortId:6,isFixed: false, order: 4, title: 'Order owner',displayType:"name"},
    { id: 5, isFilter: false, name: 'Source', SortId:5,isFixed: false, order: 5, title: 'Source'},
    { id: 6, isFilter: false, name: 'OpportunitySource', SortId:38,isFixed: false, order: 6, title: 'Proposal type'},
    { id: 7, isFilter: false, name: 'SapName', SortId:44,isFixed: false, order: 7, title: 'SAP code'},
    { isHideColumnSearch: true ,id: 8,isFilter: false, name: 'EngamentStartDate',SortId:18, isFixed: false, order: 8, title: 'Engagement start date', dateFormat: 'dd-MMM-yyyy' },
    {isHideColumnSearch: true , id: 9, isFilter: false, name: 'EngagementEndDate', SortId:19,isFixed: false, order: 9, title: 'Engagement end date', dateFormat: 'dd-MMM-yyyy' },

]
@Injectable({
  providedIn: 'root'
})
export class changeOpportunityService {

  constructor(
       public datepipe: DatePipe,
    private apiServiceOpportunity: ApiServiceOpportunity) { }

      getAll(postBody: Object){
        return this.apiServiceOpportunity.post(routes.changeOpportunity, postBody);
      }
      
      getParentHeaderData(): Observable<any[]> {
        return of(changeOpportunityHeader);
      }

      changeOpportunityType(postBody: Object)
      {
        return this.apiServiceOpportunity.post(routes.opportunityTypeChange, postBody);        
      }

      //filter


       getFilterCampaignSwitchListData(data) {
        switch (data.filterData.headerName) {
            case 'OrderNumber':
                return this.getOrderNumberColumnFilterData(data)
            case 'OpportunityName':
                return this.getOpportunityNameColumnFilterData(data)
            case 'OpportunityNumber':
                return this.getOpportunityNumberColumnFilterData(data)
            case 'OrderOwner':
                return this.getOrderOwnerColumnFilterData(data)
            case 'Source':
                return this.getOpportunitySourceColumnFilterData(data)
            case 'OpportunitySource':
                return this.getProposalTypeColumnFilterData(data)
            case 'SapName':
                return this.getSapCodeColumnFilterData(data)
            case 'EngamentStartDate':
                return this.getStartDateColumnFilterData(data)
            case 'EngagementEndDate':
                return this.getEndDateColumnFilterData(data)            
        }

    }
    getOrderNumberColumnFilterData(data:any):Observable<any>
    {
          let reqBody= {
     ...data.columnFIlterJson,
     "OrderNumber": data.useFulldata.orderno,
    "OrderStatus": data.useFulldata.OrderStatus,
    "OpportunityNumber": data.useFulldata.OpportunityNumber,
    "OpportunityName": data.useFulldata.OpportunityName,
    "AccountId": data.useFulldata.AccountId,
    "page": data.useFulldata.page,
    "count": data.useFulldata.count,
     "SearchText": "",
    "FilterSearchText": data.useFulldata.SearchText,
    "SortBy": 42
}


       return this.getOrderNumberList(reqBody).pipe(switchMap(res => {
            if (res) {
              console.log("result",res)
              
                return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterOrderNumberColumndata(res.ResponseObject,data.useFulldata.page) : [] } : [])
            }
            else {
                return of([])
            }
        }))
    }

     getOrderNumberList(body) :Observable<any>{
        return this.apiServiceOpportunity.post(routes.retaggingFilter,body)
    }
    
    filterOrderNumberColumndata(data,pageNo) {
        if (data) {
            if (data.length > 0) {
                return data.map((x,index)=> {
                    return {
                       'id': x.OrderNumber?(x.OrderNumber).replace(/\s/g,'') :'NA',

                        name: x.OrderNumber?x.OrderNumber:'NA',
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

     getOpportunityNameColumnFilterData(data:any):Observable<any>
    {
        let reqBody=  {
     ...data.columnFIlterJson,
     "OrderNumber": data.useFulldata.orderno,
    "OrderStatus": data.useFulldata.OrderStatus,
    "OpportunityNumber": data.useFulldata.OpportunityNumber,
    "OpportunityName": data.useFulldata.OpportunityName,
    "AccountId": data.useFulldata.AccountId,
    "page": data.useFulldata.page,
    "count": data.useFulldata.count,
     "SearchText": "",
    "FilterSearchText": data.useFulldata.SearchText,
    "SortBy": 0
}




       return this.getRetagOpportunityNameList(reqBody).pipe(switchMap(res => {
            if (res) {
              console.log("result",res)
              
                return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterNameColumndata(res.ResponseObject, data.useFulldata.page) : [] } : [])
            }
            else {
                return of([])
            }
        }))
    }

    getOpportunityNameList(body) :Observable<any>{
        return this.apiServiceOpportunity.post(routes.filterByOpportunityName,body)
    }
    
    getRetagOpportunityNameList(body) :Observable<any>{
        return this.apiServiceOpportunity.post(routes.retaggingFilter,body)
    }
    filterNameColumndata(data,pageNo) {
        if (data) {
            if (data.length > 0) {
                return data.map((x,index) => {
                    return {
                        'id': x.OpportunityName?(x.OpportunityName).replace(/\s/g,''):'NA',
                        name: x.OpportunityName?this.getSymbol(x.OpportunityName):'NA',
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

    getOpportunityNumberColumnFilterData(data:any):Observable<any>
    {
        let reqBody=  {
       ...data.columnFIlterJson,
     "OrderNumber": data.useFulldata.orderno,
    "OrderStatus": data.useFulldata.OrderStatus,
    "OpportunityNumber": data.useFulldata.OpportunityNumber,
    "OpportunityName": data.useFulldata.OpportunityName,
    "AccountId": data.useFulldata.AccountId,
    "page": data.useFulldata.page,
    "count": data.useFulldata.count,
     "SearchText": "",
    "FilterSearchText": data.useFulldata.SearchText,
    "SortBy": 23
}



       return this.getOpportunityNumberList(reqBody).pipe(switchMap(res => {
            if (res) {
              console.log("result",res)
              
                return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterOpportunityNumberColumndata(res.ResponseObject,data.useFulldata.page) : [] } : [])
            }
            else {
                return of([])
            }
        }))
    }

     getOpportunityNumberList(body) :Observable<any>{
        return this.apiServiceOpportunity.post(routes.retaggingFilter,body)
    }
    
    filterOpportunityNumberColumndata(data,pageNo) {
        if (data) {
            if (data.length > 0) {
                return data.map((x,index) => {
                    return {
                        'id': x.OpportunityNumber?(x.OpportunityNumber).replace(/\s/g,''):'NA',
                        name: x.OpportunityNumber?x.OpportunityNumber:'NA',
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

  getOrderOwnerColumnFilterData(data:any):Observable<any>
    {
        let reqBody=  {
       ...data.columnFIlterJson,
     "OrderNumber": data.useFulldata.orderno,
    "OrderStatus": data.useFulldata.OrderStatus,
    "OpportunityNumber": data.useFulldata.OpportunityNumber,
    "OpportunityName": data.useFulldata.OpportunityName,
    "AccountId": data.useFulldata.AccountId,
    "page": data.useFulldata.page,
    "count": data.useFulldata.count,
     "SearchText": "",
    "FilterSearchText": data.useFulldata.SearchText,
    "SortBy": 6
}



          

       return this.getRetagOrderOwnerList(reqBody).pipe(switchMap(res => {
            if (res) {
              console.log("result",res)
              
                return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterOrderOwnerColumndata(res.ResponseObject,data.useFulldata.page) : [] } : [])
            }
            else {
                return of([])
            }
        }))
    }

     getOrderOwnerList(body) :Observable<any>{
        return this.apiServiceOpportunity.post(routes.filterByOrderOwner,body)
    }
    
     getRetagOrderOwnerList(body) :Observable<any>{
        return this.apiServiceOpportunity.post(routes.retaggingFilter,body)
    }
    filterOrderOwnerColumndata(data,pageNo) {
        if (data) {
            if (data.length > 0) {
                return data.map((x,index) => {
                    return {
                        'id':x.OrderOwner?(x.OrderOwner).replace(/\s/g,''):'NA',
                        name: x.OrderOwner?x.OrderOwner:'NA',
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
  
    getOpportunitySourceColumnFilterData(data:any):Observable<any>
    {
        let reqBody= {
      ...data.columnFIlterJson,
     "OrderNumber": data.useFulldata.orderno,
    "OrderStatus": data.useFulldata.OrderStatus,
    "OpportunityNumber": data.useFulldata.OpportunityNumber,
    "OpportunityName": data.useFulldata.OpportunityName,
    "AccountId": data.useFulldata.AccountId,
    "page": data.useFulldata.page,
    "count": data.useFulldata.count,
     "SearchText": "",
    "FilterSearchText": data.useFulldata.SearchText,
    "SortBy": 5
}



       return this.getOpportunitySourceList(reqBody).pipe(switchMap(res => {
            if (res) {
              console.log("result",res)
              
                return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterOpportunitySourceColumndata(res.ResponseObject) : [] } : [])
            }
            else {
                return of([])
            }
        }))
    }

     getOpportunitySourceList(body) :Observable<any>{
        return this.apiServiceOpportunity.post(routes.retaggingFilter,body)
    }
    
    filterOpportunitySourceColumndata(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        id: x.SourceId?x.SourceId:'',
                        name: x.Source?x.Source:'NA',
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
     getProposalTypeColumnFilterData(data:any):Observable<any>
    {
        let reqBody=  {
      ...data.columnFIlterJson,
     "OrderNumber": data.useFulldata.orderno,
    "OrderStatus": data.useFulldata.OrderStatus,
    "OpportunityNumber": data.useFulldata.OpportunityNumber,
    "OpportunityName": data.useFulldata.OpportunityName,
    "AccountId": data.useFulldata.AccountId,
    "page": data.useFulldata.page,
    "count": data.useFulldata.count,
     "SearchText": "",
    "FilterSearchText": data.useFulldata.SearchText,
    "SortBy": 38
}



       return this.getProposalTypeList(reqBody).pipe(switchMap(res => {
            if (res) {
              console.log("result",res)
              
                return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterProposalTypeColumndata(res.ResponseObject) : [] } : [])
            }
            else {
                return of([])
            }
        }))
    }

     getProposalTypeList(body) :Observable<any>{
        return this.apiServiceOpportunity.post(routes.retaggingFilter,body)
    }
    
    filterProposalTypeColumndata(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        id: x.ProposalTypeId?x.ProposalTypeId:'',
                        name: x.OpportunitySource?x.OpportunitySource:'NA',
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
    getSapCodeColumnFilterData(data:any):Observable<any>
    {
        let reqBody=  {
      ...data.columnFIlterJson,
     "OrderNumber": data.useFulldata.orderno,
    "OrderStatus": data.useFulldata.OrderStatus,
    "OpportunityNumber": data.useFulldata.OpportunityNumber,
    "OpportunityName": data.useFulldata.OpportunityName,
    "AccountId": data.useFulldata.AccountId,
    "page": data.useFulldata.page,
    "count": data.useFulldata.count,
     "SearchText": "",
    "FilterSearchText": data.useFulldata.SearchText,
    "SortBy": 44
}



       return this.getSapCodeList(reqBody).pipe(switchMap(res => {
            if (res) {
              console.log("result",res)
              
                return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterSapCodeColumndata(res.ResponseObject,data.useFulldata.page) : [] } : [])
            }
            else {
                return of([])
            }
        }))
    }

     getSapCodeList(body) :Observable<any>{
        return this.apiServiceOpportunity.post(routes.retaggingFilter,body)
    }
    
    filterSapCodeColumndata(data,pageNo) {
        if (data) {
            if (data.length > 0) {
                return data.map((x,index)=> {
                    return {
                       'id':x.SapName? (x.SapName).replace(/\s/g,''):'NA',
                        name: x.SapName?x.SapName:'NA',
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

   getStartDateColumnFilterData(data:any):Observable<any>
    {
        let reqBody=  {
            OrderNumber:data.useFulldata.OrderNumber,
            OrderStatus:data.useFulldata.OrderStatus,
            OpportunityNumber:data.useFulldata.OpportunityNumber,
            OpportunityName:data.useFulldata.OpportunityName,
            AccountId:data.useFulldata.AccountId,
            page:data.useFulldata.page,
            count:data.useFulldata.count,
            SearchText:data.useFulldata.SearchText
        }
       return this.getStartDateList(reqBody).pipe(switchMap(res => {
            if (res) {
              console.log("result",res)
              
                return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterStartDateColumndata(res.ResponseObject) : [] } : [])
            }
            else {
                return of([])
            }
        }))
    }

     getStartDateList(body) :Observable<any>{
        return this.apiServiceOpportunity.post(routes.filterByDate,body)
    }
    
    filterStartDateColumndata(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                         
                        id: (x.EngamentStartDate),
                        name: (x.EngamentStartDate) ? this.datepipe.transform(x.EngamentStartDate,"dd-MMM-yyyy") : 'NA',
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
    getEndDateColumnFilterData(data:any):Observable<any>
    {
        let reqBody=  {
            OrderNumber:data.useFulldata.OrderNumber,
            OrderStatus:data.useFulldata.OrderStatus,
            OpportunityNumber:data.useFulldata.OpportunityNumber,
            OpportunityName:data.useFulldata.OpportunityName,
            AccountId:data.useFulldata.AccountId,
            page:data.useFulldata.page,
            count:data.useFulldata.count,
            SearchText:data.useFulldata.SearchText
        }
       return this.getEndDateList(reqBody).pipe(switchMap(res => {
            if (res) {
              console.log("result",res)
              
                return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterEndDateColumndata(res.ResponseObject) : [] } : [])
            }
            else {
                return of([])
            }
        }))
    }

     getEndDateList(body) :Observable<any>{
        return this.apiServiceOpportunity.post(routes.filterByDate,body)
    }
    
    filterEndDateColumndata(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        id: (x.EngagementEndDate) ,
                         name: (x.EngagementEndDate) ? this.datepipe.transform(x.EngagementEndDate,"dd-MMM-yyyy") : 'NA',
                       
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

    getFilteredData(body)
    {
      return this.apiServiceOpportunity.post(routes.getFilteredDataApi,body)
    }

      getSymbol(data) {
    return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
  }

   
}
