import { AccountListService } from '@app/core/services/accountList.service';
import { Component, OnInit, EventEmitter, Input, Output, OnChanges, AfterViewInit } from '@angular/core';
import { AccountService } from '@app/core/services/account.service';
import { Router } from '@angular/router';
import { DataCommunicationService } from '@app/core';
import { defer, fromEvent, interval } from 'rxjs';
import { EncrDecrService } from '@app/core/services/encr-decr.service';

export interface tabListInterface {
  GroupLabel: string,
  GroupData: GroupDataItem[]
}
export interface GroupDataItem {

  title: string,
  id: number

}

@Component({
  selector: 'app-account-list-landing',
  templateUrl: './account-list-landing.component.html',
  styleUrls: ['./account-list-landing.component.scss']
})
export class AccountListLandingComponent implements OnInit, AfterViewInit {
  tablist: tabListInterface[];
  IsHelpDesk ;
  constructor(public service: AccountService, public router: Router, public userdat: DataCommunicationService,
    public AccountListService: AccountListService,
    private EncrDecr: EncrDecrService,
  ) {

  }
  more_clicked;
  contentArray = [];
  ngOnInit() {
    // this.IsHelpDesk = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('IsHelpDesk'), 'DecryptionDecrip');
    // console.log(" helpdesk-->",this.IsHelpDesk);
   
      console.log("inif");
      this.contentArray = [
       { className: 'list_names border_property', mdi: 'mdi mdi-creation', action: 'creation', value: 'Account creation', router: '/accounts/accountcreation/activerequest' },
     // { className: 'list_names border_property', mdi: 'mdi mdi-creation', action: 'creation', value: 'Helpdesk Account creation', router: '/accounts/helpdeskaccountcreation' },
      { className: 'list_names border_property', mdi: 'mdi mdi-screwdriver', action: 'modification', value: 'Account modification', router: '/accounts/accountmodification/modificationactiverequest' },
      { className: 'list_names border_property', mdi: 'mdi mdi-folder-search-outline', action: 'search', value: 'Account finder', router: '/accounts/accountsearch' },
      { className: 'list_names border_property', mdi: 'mdi mdi-account', action: 'search', value: 'Ownership history', router: '/accounts/accountownershiphistory' },
      // { className: 'list_names border_property', mdi:'mdi mdi-folder-multiple', action:'search', value: 'Assignment ref.creation', router: '/accounts/assignmentRef/assigactiverequest'},
      // { className: 'list_names border_property', mdi:'mdi mdi-file-chart', action:'search', value: 'Assignment ref.modification'},
      { className: 'list_names border_property', mdi: 'mdi mdi-file-chart', action: 'search', value: 'Create prospect', router: '/accounts/prospectAccount' },
      // { className: 'list_names border_property', mdi:'mdi mdi-file-chart', action:'search', value: 'Create prospect', router: ''},
      // { className: 'list_names border_property', mdi:'mdi mdi-database', action:'search', value: 'SAP system'}
    ]
    // else{
    //   console.log("in else part");
    //   this.contentArray = [
    //     { className: 'list_names border_property', mdi: 'mdi mdi-creation', action: 'creation', value: 'Account creation', router: '/accounts/accountcreation/activerequest' },
    //    // { className: 'list_names border_property', mdi: 'mdi mdi-creation', action: 'creation', value: 'Helpdesk Account creation', router: '/accounts/helpdeskaccountcreation' },
    //     { className: 'list_names border_property', mdi: 'mdi mdi-screwdriver', action: 'modification', value: 'Account modification', router: '/accounts/accountmodification/modificationactiverequest' },
    //     { className: 'list_names border_property', mdi: 'mdi mdi-folder-search-outline', action: 'search', value: 'Account finder', router: '/accounts/accountsearch' },
    //     { className: 'list_names border_property', mdi: 'mdi mdi-account', action: 'search', value: 'Ownership history', router: '/accounts/accountownershiphistory' },
    //     // { className: 'list_names border_property', mdi:'mdi mdi-folder-multiple', action:'search', value: 'Assignment ref.creation', router: '/accounts/assignmentRef/assigactiverequest'},
    //     // { className: 'list_names border_property', mdi:'mdi mdi-file-chart', action:'search', value: 'Assignment ref.modification'},
    //     { className: 'list_names border_property', mdi: 'mdi mdi-file-chart', action: 'search', value: 'Create prospect', router: '/accounts/prospectAccount' },
    //     // { className: 'list_names border_property', mdi:'mdi mdi-file-chart', action:'search', value: 'Create prospect', router: ''},
    //     // { className: 'list_names border_property', mdi:'mdi mdi-database', action:'search', value: 'SAP system'}
    //   ]}
  }
  ngAfterViewInit() {
    //   var reqBody = {
    //     "roleGuid":"f48b192c-cc22-e911-a94d-000d3aa053b9"
    //   }
    //  this.AccountListService.getCustomDropdown(reqBody).subscribe((res) => {

    //   this.filterRes(res["ResponseObject"]["SystemViews"]);

    //   console.log("------------> this is tablist in view init", this.tablist)
    // });
  }

  getTabList() {
    return new Promise((resolve, reject) => {
      var reqBody = {
        "roleGuid": "f48b192c-cc22-e911-a94d-000d3aa053b9"
      }
      //  this.AccountListService.getCustomDropdown(reqBody).subscribe((res) => {

      //   this.filterRes(res["ResponseObject"]["SystemViews"]);

      //   console.log("------------> this is tablist in promise", this.tablist)
      //   resolve(this.tablist);
      // });
    })
  }
  // callTablist(){

  // }


  filterRes(res) {

    var dropdowndata = [];
    const dummy = [];
    res.map((item) => {
      dropdowndata.push({
        title: item.Value,
        id: item.Id,
      })
    })
    console.log("filtered dropdown data->", dropdowndata);
    dummy.push({
      GroupLabel: 'System views',
      GroupData: dropdowndata
    })
    this.tablist = dummy;
    console.log("new tab list->", this.tablist);
  }

  farming: boolean;
  reserve: boolean;
  moreview: boolean;
  alliance: boolean;
  dropdowndata = [];
  tabList: tabListInterface[];

  farming1() {
    this.farming = true;
    this.alliance = false;
    this.moreview = false;
    this.reserve = false;
  }
  moreview1() {
    this.farming = false;
    this.alliance = false;
    this.moreview = true;
    this.reserve = false;
  }
  alliance1() {
    this.farming = false;
    this.alliance = true;
    this.moreview = false;
    this.reserve = false;
  }
  reserve1() {
    this.farming = false;
    this.alliance = false;
    this.moreview = false;
    this.reserve = true;
  }
  // MORE ACTION STARTS **************
  showContent: boolean = false;
    
  oppArray = [
    { className: 'list_names border_property', value: 'Oppurtunity 1' },
    { className: 'list_names border_property', value: 'Oppurtunity 2' },
    { className: 'list_names border_property', value: 'Oppurtunity 3' }
  ]
  additem(item) {
    this.service.creation_modification = item.action;
    this.showContent = false;
    if (item.value == 'Create prospect') {
      var object = {
        model: 'Account',
        route: this.router.url
      }
      sessionStorage.setItem('CreateActivityGroup', JSON.stringify(object))
    }
    this.router.navigate([item.router]);
  }
  onKeydown(event) {
    // debugger;
    console.log(event);
  }

  closeContent() {
    this.showContent = false;
  }

  toggleContent() {
    this.showContent = !this.showContent;
  }

  // MORE ACTION ENDS *******************
  /************Select Tabs dropdown code starts */

  selectedTabValue: string = "My owned";
  appendConversation(e) {

    if (!e.showView) {
      this.selectedTabValue = e.name;
    }

    if (e.router) {
      this.router.navigate([e.router]);
    }

  }

  // tabList: {}[] = [

  // {

  // Group : 'System views',

  // groups: [{ name: 'My owned', router: 'opportunity/allopportunity' },
  // { name: 'My open', router: 'opportunity/myopenopportunity' },
  // { name: 'Won', router: 'opportunity/allopportunity' },
  // { name: 'Lost', router: 'opportunity/allopportunity' },
  // { name: 'Inavtive', router: 'opportunity/allopportunity' },
  // { name: 'Create new view', router: 'opportunity/allopportunityview',showView:true },
  // { name: 'Show all opportunity views', router: 'opportunity/showOpportunity',showAllView:true }
  // ]
  // },
  // ]

  /************Select Tabs dropdown code ends */
}