import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { Injectable } from '@angular/core';
import { DataCommunicationService } from './global.service';
import { DateModifier } from './date-modifier';
import { Router } from '@angular/router';
import { pluck } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class LeadListService {
    constructor(
        private userdat: DataCommunicationService,
        private EncrDecr: EncrDecrService,
        private router: Router) {

    }

    leadListData(data, IdentifyLeadstype) {
        if (data) {
            return data.map(res => {
                try {
                    return {
                        "ownerId": res.Owner.ownerId,
                        "Name": (res.Title) ? (res.Title).trim() : "NA",
                        "Id": (res.LeadGuid) ? res.LeadGuid : "NA",
                        "id": (res.LeadGuid) ? res.LeadGuid : "NA",
                        "Score": res.OverallLeadScore,
                        "Owner": (res.Owner) ? (res.Owner.FullName) ? res.Owner.FullName : "NA" : "NA",
                        "Createdon": (res.CreatedOn) ? res.CreatedOn : "NA",
                        "Account": (res.Account) ? (res.Account.Name) ? decodeURIComponent(res.Account.Name): "NA" : "NA",
                        "Source": (res.Source) ? (res.Source.Name) ? res.Source.Name : "NA" : "NA",
                        "Status": (res.Status) ? (res.Status.status) ? res.Status.status : "NA" : "NA",
                        "Activitygroup": res.ActivityGroups ? res.ActivityGroups.length > 0 ? this.activityGroupFiter(res.ActivityGroups).length > 0 ? this.activityGroupFiter(res.ActivityGroups) : ["NA"] : ["NA"] : ["NA"],
                        "statusclass": (res.Status) ? (res.Status.status == "Qualified") ? "qualified" : (res.Status.status == "Disqualified" || res.Status.status == "Archived") ? "disqualified" : "unqualified" : "",
                        "isChecked": false,
                        "nurtureBtnVisibility": (res.isAcceptable) ? true : (res.Status) ? (res.Status.Id != undefined) ? ((res.Status.Id == IdentifyLeadstype.unqualified || res.Status.Id == IdentifyLeadstype.qualified) && res.isUserCanEdit == true) ? (res.IsNurture) ? true: false : true : true : true,
                        // "nurtureBtnVisibility": (res.isAcceptable) ? true : (res.IsNurture) ? (res.Status.status == "Archived") ? true : false: true,
                        "opportunityBtnVisibility": (res.isAcceptable) ? true : (res.Status) ? (res.Status.Id != undefined) ? (res.Status.Id == IdentifyLeadstype.qualified && res.isUserCanEdit == true && res.isOpportunityCreated == false) ? false : true : true : true,
                        "qualifyBtnVisibility": (res.isAcceptable) ? true : (res.Status) ? (res.Status.Id != undefined) ? (res.Status.Id == IdentifyLeadstype.unqualified && res.isUserCanEdit == true) ? false : true : true : true,
                        "archiveBtnVisibility": (res.isAcceptable) ? true : (res.Status) ? (res.Status.Id != undefined && res.isUserCanEdit == true) ? false : true : true,
                        "tickedBtnVisibility": (res.isAcceptable) ? false : true,
                        "crossedBtnVisibility": (res.isAcceptable) ? false : true,
                        "disQualifyBtnVisibility": (res.isAcceptable) ? true : (res.Status) ? (res.Status.Id != undefined) ? (res.Status.Id == IdentifyLeadstype.qualified && res.isUserCanEdit == true) ? false : true : true : true,
                        "index": res.index,
                        "statusText": (res.IsNurture) ? "Nurtured" : "",
                        "IdentifyLeadstype": (res.Status) ? (res.Status.Id != undefined) ? (res.Status.Id == IdentifyLeadstype.unqualified) ? IdentifyLeadstype.unqualified : IdentifyLeadstype.qualified : "leadTypeNotFound" : "leadTypeNotFound",
                        "OldStatusReasonGuid": (res.OldStatusReasonGuid) ? res.OldStatusReasonGuid : "",
                        "OldStatusGuid": (res.OldStatusGuid) ? res.OldStatusGuid : "",
                        "restoreBtnVisibility": (res.Status) ? (res.Status.status == "Archived" && res.isUserCanEdit == true) ? false : true : true,
                        "accountId": (res.AccountTypeId) ? res.AccountTypeId: "",
                        "accountType": (res.AccountType) ? res.AccountType: ""
                        // "moreBtnVisibility": (res.Status) ? (res.Status.status == "Archived") ? false : true : true,
                    }
                } catch (error) {
                    return {}
                }
            })
        } else {
            return [{}]
        }
    }

    activityGroupFiter(data): Array<any> {
        let activityGroup = []
        data.map(x => {
            if (x.Name) {
                activityGroup.push(x.Name)
            }
        })
        return activityGroup
    }

    // ------------------------------------- Filter data -------------------------------------------------------------//

    GetAppliedFilterData(data) {
        var Guid = [];
        var ProspectGuids = [];
        if (this.router.url.includes('/accounts/accountleads')) {
            let accountInfo = JSON.parse(this.EncrDecr.get("EncryptionEncryptionEncryptionEn", sessionStorage.getItem('selAccountObj'), "DecryptionDecrip"));
            Guid = [accountInfo.SysGuid];
            console.log('account details from Account FSD3', accountInfo)
            ProspectGuids = [];

        } else {
            Guid = (data.filterData) ? (data.filterData.filterColumn) ? this.userdat.pluckParticularKey(data.filterData.filterColumn['Account'].filter(x => !x.isProspect), 'id') : [] : [];
            ProspectGuids = (data.filterData) ? (data.filterData.filterColumn) ? this.userdat.pluckParticularKey(data.filterData.filterColumn['Account'].filter(x => x.isProspect), 'id') : [] : [];
        }
        return {
            "ColumnSearchText": (data.filterData) ? (data.filterData.columnSerachKey) ? data.filterData.columnSerachKey : "" : "",
            "SearchText": (data.filterData) ? (data.filterData.globalSearch) ? data.filterData.globalSearch : "" : "",
            "Guid": data.useFulldata.userGuid,
            "Name": (data.filterData) ? (data.filterData.filterColumn) ? this.userdat.pluckParticularKey(data.filterData.filterColumn['Name'], 'name') : [] : [],
            "OwnerGuids": (data.filterData) ? (data.filterData.filterColumn) ? this.userdat.pluckParticularKey(data.filterData.filterColumn['Owner'], 'id') : [] : [],
            "CreatedOnList": [],
            "AccountGuids": Guid,
            "LeadStatusCodes": (data.filterData) ? (data.filterData.filterColumn) ? this.userdat.pluckParticularKey(data.filterData.filterColumn['Status'], 'id') : [] : [],
            "ProspectGuids": ProspectGuids,
            "SourceGuids": (data.filterData) ? (data.filterData.filterColumn) ? this.userdat.pluckParticularKey(data.filterData.filterColumn['Source'], 'id') : [] : [],
            "StatusIds": [data.useFulldata.LeadsReqBody.StatusCode],
            "ActivityGroupGuids": (data.filterData) ? (data.filterData.filterColumn) ? this.userdat.pluckParticularKey(data.filterData.filterColumn['Activitygroup'], 'id') : [] : [],
            "PageSize": data.useFulldata.pageSize,
            "OdatanextLink": data.useFulldata.nextLink,
            "RequestedPageNumber": data.useFulldata.pageNo,
            "IsDesc": (data.filterData) ? (data.filterData.sortColumn != '') ? !data.filterData.sortOrder : false : false,
            "SortBy": (data.filterData) ? (data.filterData.filterColumn) ? this.userdat.pluckParticularKey(data.useFulldata.fieldheader.filter(x => x.name == data.filterData.sortColumn), 'SortId')[0] : [] : [],
            "StartDate": (data.filterData) ? (data.filterData.filterColumn['Createdon'][0].filterStartDate !== '') ? this.dateModifier(data.filterData.filterColumn['Createdon'][0].filterStartDate) : "" : "",
            "EndDate": (data.filterData) ? (data.filterData.filterColumn['Createdon'][0].filterEndDate !== '') ? this.dateModifier(data.filterData.filterColumn['Createdon'][0].filterEndDate) : "" : "",
            // "ColumnOrder": (data.objectRowData) ? (data.objectRowData != '') ? (data.objectRowData.data) ? [] : [] :  this.filterHeaderName(data.objectRowData[1]) : []
            "ColumnOrder": (data.objectRowData) ? Array.isArray(data.objectRowData) ? this.filterHeaderName(data.objectRowData[1]) :[]:[]
        }
    }

    filterHeaderName(data) {
        return data.reduce((acc, d) => {
            if(d.name=="Createdon" ) {
                acc.push("CreatedOn");
            }else if(d.name=="Activitygroup" ) {
                acc.push("ActivityGroups");
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

    CheckFilterServiceFlag(data, headerName, filterConfigData): boolean {
        if (data) {
            if (data.action == "columnFilter" && data.filterData.columnSerachKey == '' && filterConfigData[headerName]["data"].length <= 0) {
                return true
            } else if (data.action == "columnFilter" && data.filterData.columnSerachKey != '' && !data.filterData.isApplyFilter) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    /**
       * @param array1 from where
       * @param array2 which al 
       * @param key key
     */
    RemoveSelectedItems(array1, array2, key) {
        return array1.filter(item1 =>
            !array2.some(item2 => (item2[key] === item1[key])))
    }

}