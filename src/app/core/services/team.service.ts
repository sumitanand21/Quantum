import { Injectable } from '@angular/core';

import { JsonApiService } from './json-api.service';
import { Observable, of } from 'rxjs';

import { team,CommentList, OptionList } from '../models/team.model';
import { ApiServiceUI, ApiServiceOpportunity } from './api.service';
import { switchMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
const routes = {
   'teamFilter': 'OpportunityTeamBuilder/GetOpportunityTeamBuilderColumnRoleName',
    team: '/team',
    comments: '/Comments',
    options: '/optionActions',
    user: (id: number) => `/ExpandActionList/${id}`,
    getSBUOwnerDetails : 'Common/GetSubOwnerDetails',
    getVerticalOwnerDetails : 'Common/GetVerticalOwnerDetails',
    getSalesHeadDetails : 'Common/GetPreSalesHeadDetails',
    getActiveEmployees : 'Common/GetWiproEmployees',//'Common/GetActiveEmployees',
    getTeamBuilderRoles : 'Common/GetTeamBuilderRoles',
    getTeamBuilderList : 'OpportunityTeamBuilder/GetOpportunityTeamBuilderList',
    addUpdTeamBuilder : 'OpportunityTeamBuilder/AddUpdateTeamBuilder',
    deleteTeamMember : 'OpportunityTeamBuilder/DeactiveTeamBuilder',
    getSummary : 'OpportunityTeamBuilder/GetSummaryTeamBuilder',
    getEndDateOptions : 'v1/MasterManagement/GetEndDateOptions' ,
    getTimeAlloc : 'v1/MasterManagement/GetTimeAllocatedPerWeek',

    //filter apis
    getRoleNamesApi : 'OpportunityTeamBuilder/GetOpportunityTeamBuilderColumnRoleName',
    geUserNamesApi : 'v1/LeadManagement/SearchOwner',
    getStartDateAndEndDateApi : 'OpportunityTeamBuilder/GetOpportunityTeamBuilderColumnStartAndEndDateList',
    getTimeAllocatedApi : 'OpportunityTeamBuilder/GetOpportunityTeamBuilderColumnTimeAllocate',
    getTeamBuilderFilteredList : 'OpportunityTeamBuilder/GetOpportunityTeamBuilderFilterList',

    checkDuplicateRoles : 'OpportunityTeamBuilder/CheckDuplicateRoles',
    deactivateMultipleTBs: 'OpportunityTeamBuilder/DeactiveBulkTBs'
};
 //account team

// export const headerteam:any[]= [
//     { id: 1, isFilter:false, name: 'Username', isFixed: true, order: 1, title: 'User name', controltype:'autocomplete',closePopUp:false},
//     { id: 2, isFilter:false, name: 'IMSrole', isFixed: false, order: 2, title: 'IMS role', controltype:'select' },
//     { id: 3, isFilter:false, name: 'SAPcustomercode', isFixed: false, order: 3, title: 'SAP customer code', controltype:'text' },
//     { id: 4, isFilter:false, name: 'SAPcustomername', isFixed: false, order: 4, title: 'SAP customer name', controltype:'autocomplete',closePopUp:false,data:[] },
//     { id: 5, isFilter:false, name: 'Geo', isFixed: false, order: 5, title: 'Geo', controltype:'autocomplete',closePopUp:false,data:[] },

// ]
// account TeamsComponent(2 tabs)
export const headerteamopportunity:any[]=

[
  {
    id: 1, isFilter: false, SortId: "0", name: 'Role', isFixed: true, order: 1, title: 'Role', controltype: 'select', allias: "_Role", closePopUp: false, isDuplicateValidationReq: true, isReadOnlyEdit: 'isDefault', placeholder: 'select role', validation: "&Role", IsRequired: true, ValidMsg: ["Select valid option"], ErrorMessage: '#Role',
    info: 'Select the role from the list of predefined roles.'
  },
  {
    id: 2, isFilter: false, SortId: 33, name: 'Request', isFixed: false, relationship: "_roleDisabled", order: 2, title: 'Request', controltype: 'switch', closePopUp: false, toggleSwitch: true, hideFilter: true, isSortDisable: true,
    info: 'Enable the toggle if you want to request a resource to fill a particular role and no named person has been identified yet. An email requesting the resource will be generated and sent to the Vertical Pre Sales Head.'
  },
  {
    id: 3, isFilter: false, SortId: 34, name: 'Username', isFixed: false, relationship: "Request", order: 3, title: 'Name', controltype: 'autocomplete', allias: "_Username", isInitialColumn: true, placeholder: 'search user', IsError: false, validation: "&Username", IsRequired: true, ValidMsg: ["User not found"], ErrorMessage: '#Username',
    info: 'Select the name of the person to fulfil the role. Note that this person will not automatically receive access to Trace.'
  },
  {
    isHideColumnSearch: true, id: 4, isFilter: false, SortId: 18, name: 'SAPcustomercode', isFixed: false, relationship: "_roleDisabled", order: 4, title: 'Start date', controltype: 'date', dateRange: ['current'], dateFormat: "dd-MMM-yyyy", placeholder: 'select date', IsError: false, IsRequired: true, validation: "&SAPcustomercode", ValidMsg: ["Select valid date"], ErrorMessage: '#SAPcustomercode',
    info: 'Date you want the resource to start the role. Adding the start date does not guarantee that the person can start, so make sure you agree the date.'
  },
  {
    hideFilter: true, isHideColumnSearch: true, id: 5, isFilter: false, SortId: 19, name: 'SAPcustomername', isFixed: false, relationship: "_roleDisabled", order: 5, title: 'End date/Stage', controltype: 'selectSwitchDate', dateRange: ['SAPcustomercode'], dateFormat: "dd-MMM-yyyy", allias: "_SAPcustomername", isInlineStage: true, validation: "&SAPcustomername", placeholder: 'select role', IsError: false, IsRequired: true, ValidMsg: ["Please ensure that the start date is before the end date", "Select valid option", "Select valid date"], ErrorMessage: '#SAPcustomername', switch: 'SAPcustomerSelect',
    info: 'End date for this role. You can either use one of the pre-set options or choose a date using the calendar function.'
  },
  {
    isHideColumnSearch: true, id: 6, isFilter: false, SortId: 35, name: 'Geo', isFixed: false, relationship: "_roleDisabled", order: 6, title: 'Time allocated per week', controltype: 'select', allias: "_Geo", closePopUp: false, placeholder: 'select role', IsError: false, IsRequired: true, validation: "&Geo", ValidMsg: ["Select valid option"], ErrorMessage: '#Geo',
    info: 'The average amount of time, per week, required for this role. Make sure you also discuss and agree with the person.'
  },
  {
    id: 7, isFilter: false, SortId: 36, name: 'Delivery', isFixed: false, relationship: "_roleDisabled", order: 7, title: 'Delivery', controltype: 'switch', closePopUp: false, toggleSwitch: true, hideFilter: true, isSortDisable: true,
    info: 'Enable the toggle if the resource is also expected to be part of the delivery team, in case of a win. Note that names do not automatically flow into downstream systems.'
  }
]


@Injectable({
    providedIn: 'root'
})
export class teamService {
  getAll(): any {
    throw new Error("Method not implemented.");
  }
    historyitems=[
        {
          "StatusName":"Status: Account requested",
          "StatusData":"(12 Jan 2019 at 15:20)",
          "ReasonName":"Reason code",
          "ReasonData":"-",
          "CommentsName":"Comments",
          "CommentsData":"Lorem ipsum dolor sit amet,  consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
        },
        {
          "StatusName":"Status: Account requested",
          "StatusData":"(12 Jan 2019 at 15:20)",
          "ReasonName":"Reason code",
          "ReasonData":"-",
          "CommentsName":"Comments",
          "CommentsData":"Lorem ipsum dolor sit amet,  consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
        },
        {
          "StatusName":"Status: Account requested",
          "StatusData":"(12 Jan 2019 at 15:20)",
          "ReasonName":"Reason code",
         "ReasonData":"-",
          "CommentsName":"Comments",
          "CommentsData":"Lorem ipsum dolor sit amet,  consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
        },
        {
          "StatusName":"Status: Account requested",
          "StatusData":"(12 Jan 2019 at 15:20)",
          "ReasonName":"Reason code",
          "ReasonData":"-",
          "CommentsName":"Comments",
          "CommentsData":"Lorem ipsum dolor sit amet,  consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
        },
        {
          "StatusName":"Status: Account requested",
          "StatusData":"(12 Jan 2019 at 15:20)",
          "ReasonName":"Reason code",
          "ReasonData":"-",
          "CommentsName":"Comments",
          "CommentsData":"Lorem ipsum dolor sit amet,  consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
        },
        {
          "StatusName":"Status: Account requested",
          "StatusData":"(12 Jan 2019 at 15:20)",
          "ReasonName":"Reason code",
          "ReasonData":"-",
          "CommentsName":"Comments",
          "CommentsData":"Lorem ipsum dolor sit amet,  consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
        },
        {
          "StatusName":"Status: Account requested",
          "StatusData":"(12 Jan 2019 at 15:20)",
          "ReasonName":"Reason code",
          "ReasonData":"-",
          "CommentsName":"Comments",
          "CommentsData":"Lorem ipsum dolor sit amet,  consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
        },
        {
            "StatusName":"Status: Account requested",
            "StatusData":"(12 Jan 2019 at 15:20)",
            "ReasonName":"Reason code",
           "ReasonData":"-",
            "CommentsName":"Comments",
            "CommentsData":"Lorem ipsum dolor sit amet,  consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
          },
          {
            "StatusName":"Status: Account requested",
            "StatusData":"(12 Jan 2019 at 15:20)",
            "ReasonName":"Reason code",
            "ReasonData":"-",
            "CommentsName":"Comments",
            "CommentsData":"Lorem ipsum dolor sit amet,  consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
          },
          {
            "StatusName":"Status: Account requested",
            "StatusData":"(12 Jan 2019 at 15:20)",
            "ReasonName":"Reason code",
            "ReasonData":"-",
            "CommentsName":"Comments",
            "CommentsData":"Lorem ipsum dolor sit amet,  consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
          },
          {
            "StatusName":"Status: Account requested",
            "StatusData":"(12 Jan 2019 at 15:20)",
            "ReasonName":"Reason code",
            "ReasonData":"-",
            "CommentsName":"Comments",
            "CommentsData":"Lorem ipsum dolor sit amet,  consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
          },
          {
            "StatusName":"Status: Account requested",
            "StatusData":"(12 Jan 2019 at 15:20)",
            "ReasonName":"Reason code",
            "ReasonData":"-",
            "CommentsName":"Comments",
            "CommentsData":"Lorem ipsum dolor sit amet,  consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
          },
          {
            "StatusName":"Status: Account requested",
            "StatusData":"(12 Jan 2019 at 15:20)",
            "ReasonName":"Reason code",
            "ReasonData":"-",
            "CommentsName":"Comments",
            "CommentsData":"Lorem ipsum dolor sit amet,  consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
          },
      ]
      loggedin_user="account_requestor";
      creation_modification="";
    confirmapprovalmessage;
    confirmrejectionmessage;
    swapandcreatemessage;
    cachedArray = [];
    wipro_timeAllocationPerWeek = [];
    constructor(
       public datepipe: DatePipe,
        private jsonApiService: JsonApiService,
        private apiService: ApiServiceUI,
      private apiServiceOpportunity: ApiServiceOpportunity) { }



// ***********************************************account finder************************************************************


// getAllAccountTeams(): Observable<team[]> {
//     return this.apiService.get(routes.team);
// }
getAllAccountTeams(): Observable<any[]> {
  return this.apiService.get(routes.team+'?_sort=id&_order=desc');
}
// ***********************************************account teams - incentive***********************************************************


// getAllRecords(item:any):Observable<team>  {
//     return this.apiService.post(routes.team,item);
// }
getAllRecords(item:any):Observable<any>  {
  return this.apiService.post(routes.team,item);
}

//-----expansion part-----//
getCommentsData(): Observable<CommentList[]> {
  return this.apiService.get(routes.comments);
}
getfilterData(): Observable<OptionList[]> {
  return this.apiService.get(routes.options);
}

  updateRecords(item: any): Observable<any> {
    return this.apiService.post(routes.team, item);
  }
  deleteRecords(id:any):Observable<any> {
    return this.apiService.delete(routes.team+'?id='+id)
  }
//-----expansion part-----//

public getSBUOwnerDetails(sbuId : string) : Observable<any> {
  let jsonObj = {
    "Guid" : sbuId
  }
  return this.apiServiceOpportunity.post(routes.getSBUOwnerDetails,jsonObj);
}

public getVerticalOwnerDetails(verticalId : string) : Observable<any> {
  let jsonObj = {
    "Guid" : verticalId
  }
  return this.apiServiceOpportunity.post(routes.getVerticalOwnerDetails,jsonObj);
}

public getSalesHeadDetails(sbuId : string,verticalId : string) : Observable<any> {
  let jsonObj = {
    "Guid" : sbuId,
    "Id" : verticalId
  }
  return this.apiServiceOpportunity.post(routes.getSalesHeadDetails,jsonObj);
}

public getActiveEmployees(searchText : string) : Observable<any> {

 var pageSize=0;
  if(searchText == ""){
    pageSize = 15;
  }
  else{
    pageSize = 50;
  }

  let jsonObj = {
    "SearchText": searchText ? searchText : 'a',
    "RequestedPageNumber": 1,
    "PageSize": pageSize
  }

  return this.apiServiceOpportunity.post(routes.getActiveEmployees,jsonObj);
}

public getTeamBuilderRoles() : Observable<any> {
  return this.apiServiceOpportunity.get(routes.getTeamBuilderRoles);
}

public getTeamBuilderList(opportunityId : string,pageSize : string,requestedPageNumber : string,searchtext : string) : Observable<any> {
 let jsonObj = {
    "Guid" : opportunityId,
    "SearchText" : searchtext,
    "PageSize": pageSize,
    "RequestedPageNumber": requestedPageNumber
  }
  return this.apiServiceOpportunity.post(routes.getTeamBuilderList,jsonObj);
}

public addUpdTeamBuilder(jsonObj) : Observable<any> {
  return this.apiServiceOpportunity.post(routes.addUpdTeamBuilder,jsonObj);
}

public deleteTeamMember(teamBuilderId : string) : Observable<any> {
  let jsonObj = {
    "Guid" : teamBuilderId
  }
  return this.apiServiceOpportunity.post(routes.deleteTeamMember,jsonObj);
}

public getSummary(teamBuilderId : string) : Observable<any> {
  let jsonObj = {
    "Guid" : teamBuilderId
  }
  return this.apiServiceOpportunity.post(routes.getSummary,jsonObj);
}

public getEndDateOptions() : Observable<any> {
  return this.apiServiceOpportunity.get(routes.getEndDateOptions);
}
public getTimeAllocatedPerWeek() : Observable<any> {
  return this.apiServiceOpportunity.get(routes.getTimeAlloc);
}

public checkDuplicateRoles(roleId : string, oppId : string,teamBuilderIds) : Observable<any> {
 let jsonObj = {
    "RoleId": roleId,
    "OpportunityID": oppId,
    "TeamBuilderId" : teamBuilderIds
}

  return this.apiServiceOpportunity.post(routes.checkDuplicateRoles,jsonObj);
}

public deactivateMultipleTBs(data) : Observable<any> {
 let jsonObj = {
    "Requests": data
}

  return this.apiServiceOpportunity.post(routes.deactivateMultipleTBs,jsonObj);
}

//filter and sort code starts

getRoleNames(body):Observable<any>{
  return this.apiServiceOpportunity.post(routes.teamFilter ,body)
}

getUserNames(body):Observable<any>{
  return this.apiServiceOpportunity.post(routes.teamFilter,body)
}

getStartDateAndEndDate(body):Observable<any>{
  return this.apiServiceOpportunity.post(routes.getStartDateAndEndDateApi,body)
}

getTimeAllocated(body):Observable<any>{
  return this.apiServiceOpportunity.post(routes.teamFilter,body)
}

getContactListConfigData(data): Observable<any>{
  switch (data.filterData.headerName) {
    case 'Role':
      return this.getRoleNameColumnFilterData(data)
    case 'Username':
      return this.getUserNameColumnFilterData(data) //api is pending
    case 'SAPcustomercode':
      return this.getStartDateFilterData(data)
    case 'SAPcustomername':
      return this.getEndDateFilterData(data)
    case 'Geo':
      return this.getTimeAllocatedFilterData(data)
      default:
          return of([])
  }
}


getRoleNameColumnFilterData(data:any): Observable<any> {


  let body = {
    ...data.columnFIlterJson,
    "Guid": data.useFulldata.opportunityId,
      "SearchText":data.useFulldata.searchText ,
      "PageSize":data.useFulldata.pageSize,
      "OdatanextLink":data.useFulldata.nextLink,
      "RequestedPageNumber": data.useFulldata.pageNo,
      "Sortby":0,
     "FilterSearchText":data.useFulldata.searchVal
  }

 return this.getRoleNames(body).pipe(switchMap(res=>{
  if (res) {
      return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterRoleNameColumndata(res.ResponseObject) : [] } : [])
  } else {
      return of([])
  }

 }))

}

filterRoleNameColumndata(data){

  if(data){
      if(data.length>0){
          return data.map(x=>{
              return {

                  id: x.WiproRoleBind ? x.WiproRoleBind.RoleId : '',
                  name: x.WiproRoleBind ? x.WiproRoleBind.RoleName : 'NA',
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

getUserNameColumnFilterData(data:any): Observable<any> {

  let body = {
      ...data.columnFIlterJson,
       "Guid": data.useFulldata.opportunityId,
      "SearchText":data.useFulldata.searchText ,
      "PageSize":data.useFulldata.pageSize,
      "OdatanextLink":data.useFulldata.nextLink,
      "RequestedPageNumber": data.useFulldata.pageNo,
      "Sortby":34,
     "FilterSearchText":data.useFulldata.searchVal
  }
 return this.getUserNames(body).pipe(switchMap(res=>{
  if (res) {
      return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterUserNameColumndata(res.ResponseObject) : [] } : [])
  } else {
      return of([])
  }

 }))

}

filterUserNameColumndata(data){

  if(data){
      if(data.length>0){
          return data.map(x=>{
              return {

                  id: x.TeamMemberDetails ? x.TeamMemberDetails : '',
                  name: x.TeamMemberDetails ? x.TeamMemberDetails : 'NA',
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
getStartDateFilterData(data:any): Observable<any> {

  let body = {
    "Guid": data.useFulldata.opportunityId,
      "SearchText": data.useFulldata.searchVal,
      "PageSize":data.useFulldata.pageSize,
      "OdatanextLink":data.useFulldata.nextLink,
      "RequestedPageNumber": data.useFulldata.pageNo
  }

 return this.getStartDateAndEndDate(body).pipe(switchMap(res=>{
  if (res) {
      return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterStartDateColumndata(res.ResponseObject) : [] } : [])
  } else {
      return of([])
  }

 }))

}

getEndDateFilterData(data:any): Observable<any> {

  let body = {
    "Guid": data.useFulldata.opportunityId,
      "SearchText": data.useFulldata.searchVal,
      "PageSize":data.useFulldata.pageSize,
      "OdatanextLink":data.useFulldata.nextLink,
      "RequestedPageNumber": data.useFulldata.pageNo
  }

 return this.getStartDateAndEndDate(body).pipe(switchMap(res=>{
  if (res) {
      return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterEndDateColumndata(res.ResponseObject) : [] } : [])
  } else {
      return of([])
  }

 }))

}

filterStartDateColumndata(data){

  if(data){
      if(data.length>0){
          return data.map(x=>{
              return {

                  id: (x.WiproStartdate),
                  name:  (x.WiproStartdate) ? this.datepipe.transform(x.WiproStartdate,"dd-MMM-yyyy") : 'NA',
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

filterEndDateColumndata(data){

  if(data){
      if(data.length>0){
          return data.map(x=>{
              return {

                  id: (x.WiproEnddate),
                  name:  (x.WiproEnddate) ? this.datepipe.transform(x.WiproEnddate,"dd-MMM-yyyy") : 'NA',
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

getTimeAllocatedFilterData(data:any): Observable<any> {

  let body = {
    ...data.columnFIlterJson,
   "Guid": data.useFulldata.opportunityId,
      "SearchText":data.useFulldata.searchText ,
      "PageSize":data.useFulldata.pageSize,
      "OdatanextLink":data.useFulldata.nextLink,
      "RequestedPageNumber": data.useFulldata.pageNo,
      "Sortby":35,
     "FilterSearchText":data.useFulldata.searchVal
  }

 return this.getTimeAllocated(body).pipe(switchMap(res=>{
  if (res) {
      return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterTimeAllocatedColumndata(res.ResponseObject) : [] } : [])
  } else {
      return of([])
  }

 }))

}

filterTimeAllocatedColumndata(data){
      console.log("wipro_timeAllocationPerWeek",this.wipro_timeAllocationPerWeek);
  if(data){
      if(data.length>0){
          return data.map(x=>{
              return {

                  id: x.TimeAllocatedPerWeek ? x.TimeAllocatedPerWeek : '',
                  name: this.wipro_timeAllocationPerWeek.filter(it => it.id === x.TimeAllocatedPerWeek.toString()) ? this.wipro_timeAllocationPerWeek.filter(it => it.id === x.TimeAllocatedPerWeek.toString())[0].name : 'NA',
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

getAppliedFilterActionData(body){
  return this.apiServiceOpportunity.post(routes.getTeamBuilderFilteredList, body)

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
}

