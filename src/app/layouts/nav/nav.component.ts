import { Component, OnInit, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/';

import { environment } from '@env/environment';
import { MatAutocompleteSelectedEvent, MatSnackBar } from '@angular/material';

import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { OpportunitiesService } from '@app/core';
import { DataCommunicationService } from '@app/core/services/global.service';
import { AuthService, ConversationService, ArchivedConversationService, CampaignService, ContactService, ArchivedLeadsService } from '@app/core';
import { ProfileImgService } from '@app/core/services/profileImg.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { Router } from '@angular/router';
import { Location } from "@angular/common";
import { HomeService } from '@app/core/services/home.service';
import { newConversationService } from '@app/core/services/new-conversation.service';
import { OpenLeadsService } from '@app/core/services/openlead.service';
import { MyOpenLeadsService } from '@app/core/services/myopenlead.service';
import { disqualifiedLeadsService } from '@app/core/services/disqualifiedlead.service';
import { DigitalAssistantService } from '@app/core/services/digital-assistant/digital-assistant.service';
import { environment as env } from '@env/environment';
import { AccountListService } from './../../core/services/accountList.service';
import { Title } from '@angular/platform-browser';
import { EnvService } from '@app/core/services/env.service';
import { AssistantGlobalService } from '@app/modules/digital-assistant/services/assistant-global.service';
import { ellaQuestion } from '@app/core/services/ella.question';
// const accountPlanUrl = env.accountPlanUrl;

const envADAL = new EnvService();

// Read environment variables from browser window

const browserWindow = window || {};
const browserWindowEnv = browserWindow['__env'] || {};

// Assign environment variables from browser window to env
// In the current implementation, properties from env.js overwrite defaults from the EnvService.

// If needed, a deep merge can be performed here to merge properties instead of overwriting them.

for (const key in browserWindowEnv) {
  if (browserWindowEnv.hasOwnProperty(key)) {

    envADAL[key] = window['__env'][key];
  }
}
export interface State {
  subhead: string;
  name: string;
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})

export class NavComponent implements OnInit {

  DigitalAssistance = envADAL.wittyParrotIframe;
  // isMobileDevice: boolean = false;


  userName: string;
  imgSrc: string;
  defaultImg: string;
  imageObject: object = {};
  globalSearchResponse: any
  isSearched: boolean = false;
  Seacheddata: string = "";
  isGlobalSearchloader: boolean = true;
  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    document.getElementById('focus').blur();
  }
  allNotifications: any;
  notification = false;
  searchoverley = false;
  searchBtn = false;
  overley = false;
  leftmenu = false;
  dropclicked = false;
  selectedDrop = 'Home';
  noneditablesearch = true;
  DropMenuOpen: boolean = false;
  editablesearch = false;
  expand = false;
  openit = false;
  selectedOption;

  stateCtrl = new FormControl();
  filteredStates: Observable<State[]>;
  encrEmpId: any;
  decrEmpId: any;
  stringurlforactive: string;
  globalSearch: Observable<any[]>
  isLoading = false;
  isborder = false;
  Mobile_textbox = false;// chethana june 24th
  states: State[] = []
  profileTitle: string = '';
  accordianClicked: boolean = false;
  Home = false;
  Accounts = false;
  Opportunities = false;
  Orders = false;

  accountDetails:any;
  constructor(
    public envr : EnvService,
    public titleService : Title,
    public service: DataCommunicationService,
    public projectService: OpportunitiesService,
    private auth: AuthService,
    public dialog: MatDialog,
    private profile: ProfileImgService,
    private homeService: HomeService,
    private EncrDecr: EncrDecrService,
    public router: Router,
    location: Location,
    public matSnackBar: MatSnackBar,
    public conversationService: ConversationService,
    public contact: ContactService,
    public newConversationService: newConversationService,
    public archiveConversationService: ArchivedConversationService,
    public openLeadService: OpenLeadsService,
    public myOpenLeadService: MyOpenLeadsService,
    public archivelead: ArchivedLeadsService,
    public disqualified: disqualifiedLeadsService,
    public campaingService: CampaignService,
    private dalisten: DigitalAssistantService,
    public daService: DigitalAssistantService,
    public accountListServ: AccountListService,
    public assistantGlobalService: AssistantGlobalService
  ) {

    this.assistantGlobalService.clearEmail();

    this.allNotifications = [{
      name: 'Account no. ACC560165752 has been successfully nominated.',
      date: '22 Mar, 2019 | Nominations'
    }, {
      name: 'Account nomination process has been initiated by the CSO office',
      date: '22 Mar, 2019 | Nominations'
    }, {
      name: '2 Reserve account have been successfully converted into hunting',
      date: '04 Apr, 2019 | Account'
    }, {
      name: 'Ranjit Ravi has approved your leave request',
      date: '04 Apr, 2019 | Mytime'
    }, {
      name: 'Your travel request has been successfully created',
      date: '22 Apr, 2019 | Mytravel'
    }];

  }

  //select drop down accessilble chethana starts
  Homeselect() {
    this.router.navigateByUrl('/home/dashboard')


  }
  Accountsselect() {
    // alert('hi');
    this.router.navigateByUrl('/accounts/accountlist/farming')


  }
  Opportunitiesselect() {
    this.router.navigateByUrl('/opportunity/allopportunity')

  }
  Ordersselect() {
    this.router.navigateByUrl('/order')

  }
  Leadsselect() {
    this.router.navigateByUrl('/leads/unqalified')

  }
  Activitiesselect() {
    this.router.navigateByUrl('/activities/myactivities')

  }
  Campaignsselect() {
    this.router.navigateByUrl('/campaign/ActiveCampaigns')

  }
  Contactsselect() {
    this.router.navigateByUrl('/contacts')

  }
  Dealsselect() {
    this.router.navigateByUrl('/deals/deal/tagged')

  }
  //select drop down accessilble chethana ends
  // Revert back to default pagination
  clearPagination() {
    console.log('Clear pagination--->')
    this.newConversationService.sendPageNumber = 1
    this.newConversationService.sendPageSize = 50
    this.conversationService.sendPageNumber = 1
    this.conversationService.sendPageSize = 50
    this.archiveConversationService.sendPageNumber = 1
    this.archiveConversationService.sendPageSize = 50
    this.campaingService.AllCampaignpageNumber = 1
    this.campaingService.AllCampaignpageSize = 50
    this.contact.sendPageNumber = 1
    this.contact.sendPageSize = 50
    this.archivelead.sendPageNumber = 1
    this.archivelead.sendPageSize = 50
    this.openLeadService.sendPageNumber = 1
    this.openLeadService.sendPageSize = 50
    this.myOpenLeadService.sendPageNumber = 1
    this.myOpenLeadService.sendPageSize = 50
    this.myOpenLeadService.sendConfigData = []
    this.openLeadService.sendConfigData = []
    this.archivelead.sendConfigData = []
    this.newConversationService.sendConfigData = []
    this.conversationService.sendConfigData = []
    this.archiveConversationService.configData = []
    this.campaingService.sendConfigData = []
    this.contact.sendConfigData = []
    this.disqualified.sendPageNumber = 1
    this.disqualified.sendPageSize = 50
    this.disqualified.sendConfigData = []
  }
openUserManual(){
  this.service.chatBot = false;
  this.service.userManual = !this.service.userManual;
  this.service.sideTrans = false;
}
  openChat() {
    this.service.chatBot = !this.service.chatBot;
    this.service.userManual = false;
    this.service.sideTrans = false;
    console.log("this.service.ActionColumnFixed", this.service.ActionColumnFixed)
    setTimeout(() => {
      this.service.findWidth(this.service.ActionColumnFixed);
    }, 1500);
  }
  // scrollTopFocus()
  // {
  //   let elmnt = document.getElementById('scrollAlwaysTop');
  //   elmnt.scrollIntoView();
  // }
  closechatbot() {
    this.service.chatBot = false;
    this.service.chatbotDA = false;
    this.service.sideTrans = false;

  }

  private _filterStates(value: string): State[] {
    const filterValue = value.toLowerCase();
    return this.states.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
  }

  IsHelpDesk : any;
  SysGuid : any
  getroleguid() { 
    let userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
    if (userId) this.SysGuid = userId;
    this.accountListServ.getRoles_v1(this.SysGuid).subscribe(res => {
      console.log("res res res res",res.ResponseObject)
      if (!res.IsError && res.ResponseObject) { 
        this.IsHelpDesk = (res.ResponseObject[0]['Role']) ? (res.ResponseObject[0]['Role']['IsHelpDesk']) ? res.ResponseObject[0]['Role']['IsHelpDesk'] : false : false;
      }
    })
  }
  ngOnInit() {
    var adid = this.EncrDecr.get(
      "EncryptionEncryptionEncryptionEn",
      localStorage.getItem("adid"),
      "DecryptionDecrip"
    );
    adid =adid?adid.toUpperCase():'NA' 
    console.log(adid,'adid')
    
    if(this.envr.maintainence && !this.envr.enableUsers.includes(adid)  ) {
      this.router.navigate(['/maintainance'])
    }
    // this.isMobileDevice = window.innerWidth < 800 ? true : false;
    if(!localStorage.getItem('IsHelpDesk')) {
      this.getroleguid();
    } else {
      let IsHelpDesk =  localStorage.getItem('IsHelpDesk');
     this.IsHelpDesk = JSON.parse(this.EncrDecr.get('EncryptionEncryptionEncryptionEn', IsHelpDesk, 'DecryptionDecrip'));
     console.log("this.IsHelpDesk",JSON.parse(this.IsHelpDesk));
    }
    // sessionStorage.removeItem('CreateActivityGroup')
    if (window.screen.width > 360 && window.screen.width <= 1024) { // chethana june 24th
      this.Mobile_textbox = true;
    }
    this.encrEmpId = sessionStorage.getItem('empId');
    this.userName = localStorage.getItem('upn');
    if (this.encrEmpId != null) {
      this.decrEmpId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', this.encrEmpId, 'DecryptionDecrip')
    } else {
      this.decrEmpId = null
    }
    if (this.decrEmpId != null) {
      this.imageObject = {
        "EmpNo": this.decrEmpId
      }
      console.log('imageObject-->', this.imageObject)
      this.profile.getProfileImg(this.imageObject).subscribe(res => {
        console.log('getProfileImg', res.ResponseObject);
        if (res.ResponseObject != undefined) {
          this.imgSrc = "data:image/png;base64," + res.ResponseObject;
          this.profileTitle = this.userName;
        } else {
          this.imgSrc = null;
          this.profileTitle = "Profile";
        }
      });
    } else {
      this.imgSrc = null;
      this.profileTitle = "Profile";
    }
    const splitString = this.router.url.split("/");
    this.stringurlforactive = splitString[1];
    this.assistantGlobalService.questions = ellaQuestion.GenericFeatures
    switch (this.stringurlforactive) {
      case "":
        this.selectedDrop = "Home";
        this.assistantGlobalService.questions = ellaQuestion.GenericFeatures
        break;
      case "accounts":
        this.selectedDrop = "Accounts";
        this.assistantGlobalService.questions = ellaQuestion.Account
        break;
      case "opportunity":
        this.selectedDrop = "Opportunities";
        this.assistantGlobalService.questions = ellaQuestion.Opportunity
        break;
      case "order":
        this.selectedDrop = "Orders";
        this.assistantGlobalService.questions = ellaQuestion.Order
        break;
      case "activities":
        this.selectedDrop = "Activities";
        this.assistantGlobalService.questions = ellaQuestion.Activity
        break;
      case "leads":
        this.selectedDrop = "Leads";
        this.assistantGlobalService.questions = ellaQuestion.Lead
        break;
      case "campaign":
        this.selectedDrop = "Campaigns";
        this.assistantGlobalService.questions = ellaQuestion.GenericFeatures
        break;
      case "contacts":
        this.selectedDrop = "Contacts";
        this.assistantGlobalService.questions = ellaQuestion.Contacts
        break;
      case "deals":
        this.selectedDrop = "Deals";
        this.assistantGlobalService.questions = ellaQuestion.GenericFeatures
        break;
      case "helpdesk":
        this.selectedDrop = "Helpdesk";
        this.assistantGlobalService.questions = ellaQuestion.GenericFeatures
        break;
      case "reports":
        this.selectedDrop = "Reports";
        this.assistantGlobalService.questions = ellaQuestion.GenericFeatures
        break;  
    }
    this.titleService.setTitle(this.selectedDrop?('Wipro One | '+this.selectedDrop):'Wipro One');
    this.filteredStates = this.stateCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => state.length >= 1 ? this._filterStates(state) : [])
        // map(val => val.length >= 1 ? this.filter(val): [])
      );



    // let bodyDA;

    // switch (this.router.url) {
    //   case '/activities/meetingInfo':
    //     this.daService.iframePage = 'MEETING_DETAILS';
    //     break;
    //   case '/opportunity/opportunityview/overview':
    //     this.daService.iframePage = 'OPPORTUNITY_DETAILS';
    //     break;
    //   // case '/opportunity/opportunityview/businesssolution':
    //   //   this.daService.iframePage = 'OPP_DIFFERENCE';
    //   //   break;
    //   case '/opportunity/opportunityview/order':
    //     this.daService.iframePage = 'OPP_DETAILS_ORDER';
    //     break;
    //   // case '/opportunity/newopportunity':
    //   //   this.daService.iframePage = 'DEAL_INFLUENCER';
    //   //   break;
    //   case '/opportunity/allopportunity':
    //     this.daService.iframePage = 'OPPORTUNITY_LIST';
    //     break
    //     case '/accounts/accountdetails' : 
    //     this.daService.iframePage = 'ACCOUNT_DETAILS';
    //     break;
    //     case '/leads/leadDetails': 
    //     this.daService.iframePage = 'SALES_LEAD_OWNER_ID';
    //     break;
    //   default:
    //     if (this.router.url.includes('/deals')) {
    //       this.daService.iframePage = 'OPPORTUNITY_DEALS'
    //     }
    //     this.daService.iframePage = 'Home';
    // }

    
    
    // if (this.daService.iframePage == 'Home') {
    //   bodyDA = {
    //     page: 'Home'
    //   }
    //   this.daService.postMessage(bodyDA);
    //   // this.daService.postMessageData = undefined;
    // }
    if (sessionStorage.getItem('shareConversation')) {
      var data = JSON.parse(sessionStorage.getItem('shareConversation'))
      if (data.detailChild) {
        data.detailChild = false;
        sessionStorage.setItem('shareConversation', JSON.stringify({ ...data }))
      }
    }
  }

  OnError(message) {
    let action;
    this.matSnackBar.open(message, action, {
      duration: 2000
    });
  }
  closeGlobal() {
    this.searchBtn = false;
  }
  clickOnSearchedData(stateName) {
    let object = { Name: stateName, searchData: this.Seacheddata }
    this.service.GlobalSearchdata = object
    this.router.navigate(['/advancedSearch'])
  }
  globalsearchData(value) {
    this.states = [];
    this.Seacheddata = value;
    this.isSearched = false;
    this.service.seachInputText = value ? value : ''
    //  console.log('value',value);
    if (value != '' && value != undefined) {
      this.isGlobalSearchloader = true;
      this.states = []
      this.isLoading = true
      this.isborder = true
      this.homeService.getGlobalSearch(value).subscribe(res => {
        this.isLoading = false
        // this.isborder = true
        this.isGlobalSearchloader = true
        this.isSearched = true;
        if (!res.IsError) {
          // console.log('global search response-->', res)
          if (res.ResponseObject.SearchResult.length > 0) {
            this.states = res.ResponseObject.SearchResult.map(res => {
              return {
                name: res.Type,
                subhead: `${res.Type}/Tagging ${res.Count}`
              }
            })
          }
        } else {
          this.OnError(res.Message);
          this.states = []
        }

      }, error => {
        this.isLoading = false
        this.isGlobalSearchloader = false;
        this.states = []
      })
    } else {
      this.isSearched = false;
    }
  }
  closeNotification() {
    this.notification = false;
    // document.getElementsByTagName('body')[0].classList.remove("active");

  }
  clearstyle() {
    this.isborder = false;

  }
  openLogout() {
    this.openit = !this.openit;
    this.service.chatbotDA = false;
    this.service.sideTrans = false;
    this.service.chatBot = false;
    this.service.userManual = false;
  }
  closeLogout() {
    this.openit = false;
  }
  opennotification() {
    this.notification = !this.notification;
    this.service.chatbotDA = false;
    this.service.sideTrans = false;
    this.service.chatBot = false;
    this.openit = false;
    this.service.userManual = false;
    //  document.getElementsByTagName('body')[0].classList.toggle("active");

  }
  closeit() {
    this.openit = false;
  }
  resetValue() {
    this.selectedOption = '';
  }

  closedropdown() {
    this.dropclicked = false;
  }

  DropMenu() {
    this.DropMenuOpen = false;
    this.openit = false;
  }
  dropdownClicked(evt) {
    let val = evt.currentTarget.innerText;
    if(val!="Contacts"){
       localStorage.removeItem('contactEditId');
    }
    this.selectedDrop = val;
    this.dropclicked = false;
    this.openit = false;
    this.titleService.setTitle(this.selectedDrop?('Wipro One | '+this.selectedDrop):'Wipro One');
    sessionStorage.removeItem('routePage')
    sessionStorage.removeItem('CreateActivityGroup')
  }
  openeditable() {
    this.noneditablesearch = false;
    this.editablesearch = true;
  }
  openreadonly1() {
    this.noneditablesearch = true;
    this.editablesearch = false;
  }
  openreadonly() {
    this.noneditablesearch = true;
    this.editablesearch = false;
  }
  onClickedOutside(e: Event) {
    this.dropclicked = false;
  }

  DropMenu_hide() {
    this.DropMenuOpen = !this.DropMenuOpen;
    this.auth.logoff()

  }


  toggleMenu() {
    this.leftmenu = true;
    this.overley = true;
    this.service.oval = false;
    this.Mobile_textbox = true;
  }
  closeMenu() {

    this.leftmenu = false;
    this.overley = false;
    this.service.oval = true;

  }
  showsearchBtn() {
    this.searchBtn = true;
    this.searchoverley = true;
    this.Mobile_textbox = true;
  }
  hidesearchBtn() {
    this.searchBtn = false;
    this.searchoverley = false;
  }
  SidenavFalse() {

    this.service.sideNavForAcList = false;
  }
  sideNavtrue() {

    var that = this;
    that.service.sideNavForAcList = true;

  }
  /* Open the icertis URL in the new tab */
  openIcertis() {
    const icertisUrl = this.envr.authConfig.url;
    // let accGuid = localStorage.getItem('accountSysId');
    let accGuid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip');
    let userGuid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
    let url = icertisUrl + "/WebResources/icm_ContractListings.html?Data=entity%3Daccount%26accountid%3D" + accGuid + "%26userid%3D" + userGuid + "%26app%3Dsalesportal%26navurl%3Daccount"
    window.open(url, "_blank");
  }
  openNav() {
    this.service.chatBot = false;
  }
  redirectoPinnedPage() {
    const roleGuid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('roleGuid'), 'DecryptionDecrip');
    const reqbody = {
      'roleGuid': roleGuid ? roleGuid : ''
    };
    this.accountListServ.commonPostObject(reqbody, 'CustomDropdown').subscribe((res: any) => {
      console.log('AccountListByRole' + res.ResponseObject.SystemViews);
      const listView = res.ResponseObject.SystemViews;
      // const pinnedView = listView.filter(x => x.Value === 'My active accounts');
      const pinnedView = listView.filter(x => x.IsPinned);
      if (pinnedView.length > 0) {
        this.redirectPage(pinnedView[0]);
      } else {
        this.router.navigate(['/accounts/accountlist/allactiveaccounts']);

      }

    });

  }
  redirectPage(data) {
    switch (data.PinId ? data.PinId : '') {
      case 10:
        this.router.navigate(['/accounts/accountlist/allactiveaccounts']);
        break;
      case 11:
        this.router.navigate(['/accounts/accountlist/farming']);
        break;
      case 12:
        this.router.navigate(['/accounts/accountlist/alliance']);
        break;
      case 14:
        this.router.navigate(['/accounts/accountlist/reserve']);
        break;
      case 13:
        this.router.navigate(['/accounts/accountlist/AnalystAdvisor']);
        break;
      // case 'More views':
      //   this.router.navigate(['/accounts/accountlist/moreview']);
      //   break;

      default:
        this.router.navigate(['/accounts/accountlist/allactiveaccounts']);
        break;

    }
  }
  // routetohome(): void {
  //   if (this.isMobileDevice) {
  //   const dialogRef = this.dialog.open(homeroutepopComponent, {
  //     width: '400px',
  //   });
  // }
  // }

  containsNav = ['/accounts/accountdetails', 'accounts/contracts', 'accounts/contacts', 'accounts/relationshipplan', '/accounts/teams', '/accounts/managementlogtable', '/accounts/managementlog', '/accounts/DashboardDetails', '/accounts/bulkteammember', 'accounts/addcontract', '/order/orderlistbfmchild', '/order/orderdetails', '/accounts/ownershipHistoryList', '/accounts/accountleads', '/accounts/accountactivities', '/accounts/accountopportunity/allopportunity', 'accounts/accountorders'];
  get routerStatus(): boolean {

    return this.containsNav.some((element: string) => {
      return this.router.url.includes(element)
    }
    )
  }

  showCustomer() {
    console.log('showCustomerdfdfdsfsdfsd sdfsdfsd');
    setTimeout(() => {
      this.accountListServ.setCustomerDetail();
    }, 1000);

  }

  redirectToOppLead() {
    this.accountListServ.accountDetailsData.subscribe(message => this.accountDetails = message);
    console.log("account deails res obj", this.accountDetails);
    this.accountListServ.setSession('accountDetails', { 'accountDetails': this.accountDetails })
    // let accGuid = localStorage.getItem('accountSysId');
    let accGuid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip');
    //https://quantumqa-soe.wipro.com/opportunity/newopportunity
    // this.router.navigate(['/opportunity/allopportunity']);
    // this.router.navigate(['/opportunity/newopportunity']);
  }

  activeLeads(){
    this.router.navigate(['/accounts/accountopportunity/allopportunity']);
  }
  openAccountPlan() {
    const url = this.envr.accountPlanUrl;
    console.log('url for accountt plan for this environment is ', url);
    // tslint:disable-next-line:max-line-length
    const myWindow = window.open(url, 'AccountPlan', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,height=' + screen.height + ',width=' + screen.width + ',top=0,left=0');
  }


  checkForCloseReason(){
let orderId = this.projectService.getSession("orderId")
if(orderId){
return true;
}else{
  return false;
}
  }

}
// @Component({
//   selector: 'app-cancel-pop',
//   templateUrl: './homeroute-pop.html',
//   styleUrls: ['./nav.component.scss']
// })
// export class homeroutepopComponent  {

//   constructor() { }
// }

