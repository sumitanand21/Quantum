import { Injectable } from '@angular/core';
import { DataCommunicationService } from './global.service';
import { conversationheader } from './conversation.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class ActivityGroupListService {

  constructor(
    private DataCommunication: DataCommunicationService,
    private router: Router
    ) { }

    getSymbol(data) {
      // console.log(data)
      if (data) {
          return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
      } else {
          return '';
      }

  }
  activityListData(data) {
    if (data) {
      return data.map(res => {
        try {
          return {
            "id": res.Guid ? res.Guid : "NA",
            "Name": (res.Name) ? (res.Name).trim() : "NA",
            "Account": res.Account.Name ? this.getSymbol(res.Account.Name) : "NA",
            "AccountSysGuid": res.Account.SysGuid ? res.Account.SysGuid : "NA",
            "Owner": res.Owner.FullName ? res.Owner.FullName : "NA",
            "Meetings": res.MeetingCount ? res.MeetingCount : "NA",
            "Actions": res.Actioncount ? res.Actioncount : "NA",
            "Orders": res.OthersCount ? res.OthersCount : "NA",
            "Leadname": res.Leads ? res.Leads.length > 0 ? this.leadsFilterName(res.Leads).length > 0 ? this.leadsFilterName(res.Leads) : ["NA"] : ["NA"] : ["NA"],
            "Linkedopp": res.Opportunities ? res.Opportunities.length > 0 ? this.opportunityFiter(res.Opportunities).length > 0 ? this.opportunityFiter(res.Opportunities) : ["NA"] : ["NA"] : ["NA"],
            "isCheccked": false,
            "SysGuid": res.Account ? res.Account.SysGuid ? res.Account.SysGuid : "NA" : "NA",
            "index": res.index,
            "AccountType":res.AccountType,
            "isProspect": res.Account ? res.Account.isProspect : "NA"
          }
        } catch (error) {
          return [{}]
        }
      })
    } else {
      return [{}]
    }
  }

  leadsFilterName(data): Array<any> {
    let leadArray = []
    data.map(x => {
      if (x.Title) {
        leadArray.push(x.Title)
      }
    })
    return leadArray
  }

  opportunityFiter(data): Array<any> {
    let Opportunity = []
    data.map(x => {
      if (x.Title) {
        Opportunity.push(x.Title)
      }
    })
    return Opportunity
  }

  // ------------------------------------- Filter data -------------------------------------------------------------//
  
  CheckFilterServiceFlag(data, headerName, filterConfigData): boolean {
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
    if (this.router.url.includes('/accounts/accountactivities')) {
      switch (item.index) {
        case 0:
          sessionStorage.setItem('navigation', JSON.stringify(1))
          this.router.navigate(['/accounts/accountactivities/myactivities'])
          break;
        case 1:
          sessionStorage.setItem('navigation', JSON.stringify(2))
          this.router.navigate(['/accounts/accountactivities/list'])
          break;
        case 2:
          sessionStorage.setItem('navigation', JSON.stringify(3))
          this.router.navigate(['/accounts/accountactivities/Archivedlist'])
          break;
  
        case 3:
          this.router.navigate(['/accounts/accountactivities/activitymoreview'])
          break;
      }
    } else {
      switch (item.index) {
        case 0:
          sessionStorage.setItem('navigation', JSON.stringify(1))
          this.router.navigate(['/activities/myactivities'])
          break;
        case 1:
          sessionStorage.setItem('navigation', JSON.stringify(2))
          this.router.navigate(['/activities/list'])
          break;
        case 2:
          sessionStorage.setItem('navigation', JSON.stringify(3))
          this.router.navigate(['/activities/Archivedlist'])
          break;
  
        case 3:
          this.router.navigate(['/activities/activitymoreview'])
          break;
      }
    }

  }
}
