import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DataCommunicationService } from './global.service';
import { completedcampaignheader, activecampaignheader } from './campaign.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class CampaignGroupListService {
    constructor(private datepipe: DatePipe,public userdat: DataCommunicationService,private router: Router) { }
    campaignListData(tableData): Array<any> {
        if (tableData) {
            if (tableData.length > 0) {
                return tableData.map((campaign => {
                    return {
                        id: campaign.Id,
                        CreatedOn: campaign.CreatedOn,
                        Name: (campaign.Name) ? (campaign.Name).trim() : "NA" || "NA",
                        campaign: campaign.Code || "NA",
                        owner: campaign.Owner.FullName || "NA",
                        ownerId: campaign.Owner.ownerId || "NA",
                        team: campaign.OwnerTeam || "NA",
                        status: campaign.CampaignStatus || "NA",
                        statusclass: campaign.CampaignStatus,
                        origin: campaign.Function.Name || "NA",
                        startDate: campaign.StartDate || "NA",
                        endDate: campaign.EndDate || "NA",
                        index: campaign.index,
                        account: (campaign.Accounts) ? (campaign.Accounts.length > 0) ? campaign.Accounts : null : null,
                    };
                }));
            } else {
                return []
            }
        } else {
            return []
        }
    }
    dateConversion(Date1) {
        var startdate = new Date(Date1)
        var month = (startdate.getMonth() + 1) < 10 ? ("0" + (startdate.getMonth() + 1)) : (startdate.getMonth() + 1);
        var date = startdate.getDate() < 10 ? "0" + startdate.getDate() : startdate.getDate();
        var start = startdate.getFullYear() + '-' + month + '-' + date;

        var startTime = new Date(startdate)
        var hours = startTime.getHours() < 10 ? "0" + startTime.getHours() : startTime.getHours();
        var minutes = startTime.getMinutes() < 10 ? "0" + startTime.getMinutes() : startTime.getMinutes();
        var seconds = startTime.getSeconds() < 10 ? "0" + startTime.getSeconds() : startTime.getSeconds();
        var getStartTime = hours + ':' + minutes + ':' + "00";
        var finalStartDate = start + 'T' + getStartTime + '.000Z';
        return finalStartDate
    }

      downloadCsv(data) {
       return {
        "PageSize": 50,
        "RequestedPageNumber": 1,
        "SearchText": this.userdat.checkFilterListApiCall(data) ? data.filterData.globalSearch : "",
        "SearchType": data.SearchType,
        "IsDesc": (data.filterData.sortColumn != '') ? !data.filterData.sortOrder : false,
        "Name": this.userdat.checkFilterListApiCall(data) ? this.userdat.pluckParticularKey(data.filterData.filterColumn['Name'], 'id') : [],
        "OwnerGuids": this.userdat.checkFilterListApiCall(data) ? this.userdat.pluckParticularKey(data.filterData.filterColumn['owner'], 'id') : [],
        "CampaignGuids": this.userdat.checkFilterListApiCall(data) ? this.userdat.pluckParticularKey(data.filterData.filterColumn['campaign'], 'id') : [],
        "OdatanextLink": "",
        "StatusIds": this.userdat.pluckParticularKey(data.filterData.filterColumn['status'], 'id'),
        "FromStartDate": this.userdat.checkFilterListApiCall(data) ? this.userdat.pluckParticularKey(data.filterData.filterColumn['startDate'], 'StartDate') : [],
        "ToEndDate": this.userdat.checkFilterListApiCall(data) ? this.userdat.pluckParticularKey(data.filterData.filterColumn['endDate'], 'EndDate') : [],
        "OrderGuids": [],
        "SortBy": this.userdat.checkFilterListApiCall(data) ? this.userdat.pluckParticularKey(activecampaignheader.filter(x => x.name == data.filterData.sortColumn), 'SortId')[0] : [],
        "IsFilterApplied": this.userdat.checkFilterListApiCall(data) ? true : false,
        CampaignType: data.CampaignType
      }
      }

      CheckFilterServiceFlag(data, headerName,filterConfigData): boolean {
        if (data) {
          if (data.action != "columnFilter" && data.filterData.isApplyFilter) {
            return false
          } else if (data.action == "columnFilter" && data.filterData.columnSerachKey == '' && filterConfigData[headerName]["data"].length <= 0) {
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

      RemoveSelectedItems(array1, array2, key) {
        return array1.filter(item1 =>
          !array2.some(item2 => (item2[key] === item1[key])))
      }

      onTabNavigation(item) {
        switch (item.index) {
          case 0:
            sessionStorage.setItem('navigation', JSON.stringify(1))
            this.router.navigate(['/campaign/AllCampaigns'])
            return
          case 1:
            sessionStorage.setItem('navigation', JSON.stringify(2))
            this.router.navigate(['/campaign/ActiveCampaigns'])
            return
          case 2:
            sessionStorage.setItem('navigation', JSON.stringify(3))
            this.router.navigate(['/campaign/CompletedCampaigns'])
            return
          case 3:
            this.router.navigate(['/campaign/CampaignMoreView'])
            return
        }
      }
}