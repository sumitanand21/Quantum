import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment as env } from '@env/environment';
import { Router, RouterModule } from '@angular/router';
import { DataCommunicationService } from '@app/core/services/global.service';
import { OpportunitiesService } from '@app/core/services/opportunities.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { AccountListService } from '@app/core/services/accountList.service';
import { OrderService } from '@app/core/services';
import { OrderApprovalStage, orderApprovalType } from '@app/modules/opportunity/pages/opportunity-view/tabs/order/orderenum';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { ClearArchivedLeadState, ClearOpenLeadState, ClearMyopenlead, ClearAllLeadDetails } from '@app/core/state/actions/leads.action';
import { ClearActivity } from '@app/core/state/actions/activities.actions';
import { EnvService } from '@app/core/services/env.service';
// const accountPlanUrl = env.accountPlanUrl;
@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit, OnDestroy {
  // @Input() disableCallBack: boolean;
  accStoreData;
  constructor(public service: DataCommunicationService,
    public OrderService: OrderService,
    public envr : EnvService,
    public router: Router,
    public projectService: OpportunitiesService,
    public encrDecrService: EncrDecrService,
    public accountListService: AccountListService,
    private store: Store<AppState>,
    private EncrDecr: EncrDecrService,
  ) { }
  accountdetails: any;
  showContract: boolean = true;
  showTeams: boolean = true;
  showmgtLog: boolean = true;
  // showrelSuit: boolean = true;
  // showContracts: boolean = true;
  // showRelPlan: boolean = true;
  showOppo: boolean = true;
  showNotes: boolean = true;
  showLeads: boolean = true;
  showActivites: boolean = true;
  showOrder: boolean = true;
  showAccountPlan: boolean = true;
  hideorderdetails: boolean = false;
  OrderapprovalTypeModify;
  overviewTab = false;
  allianceTab = false;
  accountTab = false;
  CustomerTab = false;
  orderid;
  orderCreated;
  accountid;
  orderbookingId;
  ApprovalStage;
  OrderNumber;
  accountDetails;
  // isprospectCheck: boolean = false;
  isHuntingorExisting: boolean = false;
  /**
  Advisor/ Consultant = 7
  Analyst type = 10
  Alliance/Partner = 6
  *
  */
  /*****Sprint 3 accessibility starts here*** */
  acoountDetails = true;
  teamDetails = false;
  dashboardDetails = false;
  customeDetails = false;
  leadOppDetails = false;
  contractDetails = false;
  contactDetailstab = false;
  managementLog = false;
  notesDetails = false;
  accountPlans = false;
  reportDetails = false;
  activitiesDetails = false;
  activeAccount() {
    this.acoountDetails = true;
    this.teamDetails = false;
    this.dashboardDetails = false;
    this.customeDetails = false;
    this.leadOppDetails = false;
    this.contractDetails = false;
    this.contactDetailstab = false;
    this.managementLog = false;
    this.notesDetails = false;
    this.accountPlans = false;
    this.reportDetails = false;
    this.activitiesDetails = false
  }
  activeTeams() {
    this.acoountDetails = false;
    this.teamDetails = true;
    this.dashboardDetails = false;
    this.customeDetails = false;
    this.leadOppDetails = false;
    this.contractDetails = false;
    this.contactDetailstab = false;
    this.managementLog = false;
    this.notesDetails = false;
    this.accountPlans = false;
    this.reportDetails = false;
    this.activitiesDetails = false
  }
  activeDashboard() {
    this.acoountDetails = false;
    this.teamDetails = false;
    this.dashboardDetails = true;
    this.customeDetails = false;
    this.leadOppDetails = false;
    this.contractDetails = false;
    this.contactDetailstab = false;
    this.managementLog = false;
    this.notesDetails = false;
    this.accountPlans = false;
    this.reportDetails = false;
    this.activitiesDetails = false
  }
  activeCustomers() {
    this.acoountDetails = false;
    this.teamDetails = false;
    this.dashboardDetails = false;
    this.customeDetails = true;
    this.leadOppDetails = false;
    this.contractDetails = false;
    this.contactDetailstab = false;
    this.managementLog = false;
    this.notesDetails = false;
    this.accountPlans = false;
    this.reportDetails = false;
    this.activitiesDetails = false
  }
  activeLeads() {
    this.acoountDetails = false;
    this.teamDetails = false;
    this.dashboardDetails = false;
    this.customeDetails = false;
    this.leadOppDetails = true;
    this.contractDetails = false;
    this.contactDetailstab = false;
    this.managementLog = false;
    this.notesDetails = false;
    this.accountPlans = false;
    this.reportDetails = false;
    this.activitiesDetails = false;
    this.router.navigate(['/accounts/accountopportunity/allopportunity']);
  }

  activeActivities() {
    this.acoountDetails = false;
    this.teamDetails = false;
    this.dashboardDetails = false;
    this.customeDetails = false;
    this.activitiesDetails = true;
    this.contractDetails = false;
    this.contactDetailstab = false;
    this.managementLog = false;
    this.notesDetails = false;
    this.accountPlans = false;
    this.reportDetails = false;

    this.router.navigate(['/accounts/accountactivities']);

  }
  activeContracts() {
    this.acoountDetails = false;
    this.teamDetails = false;
    this.dashboardDetails = false;
    this.customeDetails = false;
    this.leadOppDetails = false;
    this.contractDetails = true;
    this.contactDetailstab = false;
    this.managementLog = false;
    this.notesDetails = false;
    this.accountPlans = false;
    this.reportDetails = false;
    this.activitiesDetails = false
  }
  activeContacts() {
    this.acoountDetails = false;
    this.teamDetails = false;
    this.dashboardDetails = false;
    this.customeDetails = false;
    this.leadOppDetails = false;
    this.contractDetails = false;
    this.contactDetailstab = true;
    this.managementLog = false;
    this.notesDetails = false;
    this.accountPlans = false;
    this.reportDetails = false;
    this.activitiesDetails = false
  }
  activeManageLog() {
    this.acoountDetails = false;
    this.teamDetails = false;
    this.dashboardDetails = false;
    this.customeDetails = false;
    this.leadOppDetails = false;
    this.contractDetails = false;
    this.contactDetailstab = false;
    this.managementLog = true;
    this.notesDetails = false;
    this.accountPlans = false;
    this.reportDetails = false;
    this.activitiesDetails = false


  }

  activeNotes() {
    this.acoountDetails = false;
    this.teamDetails = false;
    this.dashboardDetails = false;
    this.customeDetails = false;
    this.leadOppDetails = false;
    this.contractDetails = false;
    this.contactDetailstab = false;
    this.managementLog = false;
    this.notesDetails = true;
    this.accountPlans = false;
    this.reportDetails = false;
    this.activitiesDetails = false
  }
  activeAccountPlans() {
    this.acoountDetails = false;
    this.teamDetails = false;
    this.dashboardDetails = false;
    this.customeDetails = false;
    this.leadOppDetails = false;
    this.contractDetails = false;
    this.contactDetailstab = false;
    this.managementLog = false;
    this.notesDetails = false;
    this.accountPlans = true;
    this.reportDetails = false;
    this.activitiesDetails = false
  }
  activeReports() {
    this.acoountDetails = false;
    this.teamDetails = false;
    this.dashboardDetails = false;
    this.customeDetails = false;
    this.leadOppDetails = false;
    this.contractDetails = false;
    this.contactDetailstab = false;
    this.managementLog = false;
    this.notesDetails = false;
    this.accountPlans = false;
    this.reportDetails = true;
    this.activitiesDetails = false
  }
  leadsNav() {
    this.store.dispatch(new ClearArchivedLeadState())
    this.store.dispatch(new ClearOpenLeadState())
    this.store.dispatch(new ClearMyopenlead())
    this.store.dispatch(new ClearAllLeadDetails())
    this.router.navigate(['/accounts/accountleads']);
  }
  orderNav() {
    this.router.navigate(['/accounts/accountorders']);
  }
  activitiesNav() {
    this.store.dispatch(new ClearActivity())
    sessionStorage.removeItem('CreateActivityGroup');
    this.router.navigate(['/accounts/accountactivities']);
  }
  /******Sprint 3 accessibility ends******* */
  ngOnInit() {
    //&& !hideorderdetails
    // this.getoppOverviewdetailsa();
    let selAccountObjCopy = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('selAccountObj')=== null ? '': sessionStorage.getItem('selAccountObj'), 'DecryptionDecrip');
    if(selAccountObjCopy != '') this.accStoreData = JSON.parse(selAccountObjCopy);
    else this.accStoreData = {};
    // setTimeout(() => {
    // let accType = localStorage.getItem('accType') || '';
    let accTypeid;
    let paramsObj = this.accountListService.getSession('routeParams');
    console.log(paramsObj);
    if (paramsObj && paramsObj['Id']) {
      accTypeid = paramsObj['Id'];
      // localStorage.setItem('accountSysId', this.EncrDecr.set('EncryptionEncryptionEncryptionEn', this.SysGuidid, 'DecryptionDecrip'))
    } else {
      accTypeid = this.accountListService.getSession('accountid');
      // this.SysGuidid = localStorage.getItem('accountSysId');
    }

    let data: any = [];
    let userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
    // let accTypeid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('accountSysId'), 'DecryptionDecrip');
    let obj: any = { 'SysGuid': accTypeid, "LoggedInUser": { 'SysGuid': userId } };
    this.accountListService.getAccountOverviewDetails(obj).subscribe(res => {
      // let Visibilty;
      if (!res.IsError && res.ResponseObject) {
        data = res.ResponseObject;
        this.getLeftMenuEnableDisableStatus(data.Type.Id);
      }
    });
    // console.log(accType);
    // if (accType == 'Prospect') {2
    //   this.isprospectCheck = true;
    // } else {
    //   this.isprospectCheck = false;
    // }
    // if (accType == 'Hunting'12 || accType == 'Existing'3) {
    //   this.isHuntingorExisting = true;
    // }
    // else {
    //   console.log(accTypeid);
    //   // if( accTypeid == '12' || accTypeid == '3') {
    //   //   this.isHuntingorExisting = true;
    //   // }else {
    //   //   this.isHuntingorExisting = false;
    //   // }
    // }
    // debugger;

    // }, 1000);

    //this.showContract = false;
  }
  getLeftMenuEnableDisableStatus(typeId) {
    // accNumRef
    // this.accountListService.getAccountName().subscribe(res => {
    //   console.log("subject res of account name", JSON.stringify(res))
    switch (typeId) {
      case 6:
        console.log("Alliance/Partner");
        this.showContract = false;
        this.showTeams = false;
        this.showmgtLog = false;
        // this.showrelSuit = false;
        // this.showRelPlan = false;
        this.showOppo = false;
        this.showLeads = false;
        this.showOrder = false;
        this.showAccountPlan = false;
        break;
      case 7:
      case 10:
        console.log("Advisor/ Consultant");
        this.showContract = false;
        this.showTeams = false;
        this.showmgtLog = false;
        // this.showrelSuit = false;
        // this.showRelPlan = false;
        this.showOppo = false;
        this.showLeads = false;
        this.showOrder = false;
        this.showAccountPlan = false;
        break;
      // case '10':
      //   console.log("Analyst type");
      //   this.showContract = false;
      //   this.showTeams = false;
      //   this.showmgtLog = false;
      //   this.showrelSuit = false;
      //   this.showRelPlan = false;
      //   break;
      case 2:
        this.showContract = false;
        // this.showTeams = false;
        this.showmgtLog = false;
        // this.showrelSuit = false;
        // this.showRelPlan = false;
        this.showOppo = false;
        // this.showLeads = false;
        this.showOrder = false;
        this.showAccountPlan = false;

        // this.isprospectCheck = true;
        break;
      case 12:
      case 3:
      case 1:
        this.isHuntingorExisting = true;
        // case 12:
        //   this.isHuntingorExisting = true;
        break;


      default:
        console.log("All");
        break;
    }
    // })
  }
  ngOnDestroy() {
    // localStorage.removeItem("selAccountObj");
  }
  openNav() {
    this.service.chatBot = false;
  }

  sideNavtrue() {

    var that = this;
    that.service.sideNavForAcList = true;

  }
  /* Open the icertis URL in the new tab */
  openIcertis() {
    const icertisUrl = this.envr.authConfig.url;
    // let accGuid = localStorage.getItem('accountSysId');
    let accGuid = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip');
    let userGuid = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
    let url = icertisUrl + "/WebResources/icm_ContractListings.html?Data=entity%3Daccount%26accountid%3D" + accGuid + "%26userid%3D" + userGuid + "%26app%3Dsalesportal%26navurl%3Daccount"
    window.open(url, "_blank");
  }
  redirectToOppLead() {
    this.accountListService.accountDetailsData.subscribe(message => this.accountDetails = message);
    console.log("account deails res obj", this.accountDetails);
    this.accountListService.setSession('accountDetails', { 'accountDetails': this.accountDetails })
    // let accGuid = localStorage.getItem('accountSysId');
    let accGuid = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip');
    //https://quantumqa-soe.wipro.com/opportunity/newopportunity
    // this.router.navigate(['/opportunity/allopportunity']);
    this.router.navigate(['/accounts/accountopportunity/allopportunity']);
    // this.router.navigate(['/opportunity/newopportunity']);
  }
  showCustomer() {
    console.log('showCustomerdfdfdsfsdfsd sdfsdfsd');
    setTimeout(() => {
      this.accountListService.setCustomerDetail();
    }, 1000);


    // this.accountTab = false;
    // this.overviewTab = false;
    // this.allianceTab = false;
    // this.CustomerTab = true;

  }

  getoppOverviewdetailsa() {

    //console.log("oppp id", this.OpportunityServices.getSession('opportunityId'))
    const payload = {
      Id: this.projectService.getSession('opportunityId')
    };

    this.OrderService.checkOrderBookingId(payload)
      .subscribe((res: any) => {
        //console.log("res.ResponseObject order id", res.ResponseObject);
        //console.log("salesorder id", res.ResponseObject[0].SalesOrderId);
        if (!res.IsError) {

          if (res.ResponseObject.length > 0) {
            this.orderid = res.ResponseObject[0].SalesOrderId;

            const bookingIdPayload = {
              Guid: this.orderid
            }

            this.OrderService.getSalesOrderDetails(bookingIdPayload).subscribe((orderDetails: any) => {
              if (!orderDetails.IsError) {
                if (orderDetails.ResponseObject) {
                  this.orderbookingId = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderBookingId) ? orderDetails.ResponseObject.OrderBookingId : '';
                  this.accountid = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.Account.SysGuid) ? orderDetails.ResponseObject.Account.SysGuid : '';
                  this.ApprovalStage = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.ApprovalStageId) ? orderDetails.ResponseObject.ApprovalStageId : '';
                  this.OrderNumber = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderNumber) ? orderDetails.ResponseObject.OrderNumber : '';
                  this.OrderapprovalTypeModify = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.ApprovalTypeId) ? orderDetails.ResponseObject.ApprovalTypeId : '';
                  if (this.OrderapprovalTypeModify == orderApprovalType.Invoicing) {
                    this.hideorderdetails = true;
                  }

                }
                else {

                }
              }
              else {
                this.projectService.displayMessageerror(orderDetails.Message);
              }
            },
              err => {

                this.projectService.displayerror(err.status);
              });

          }
          else {

          }
        }
        else {
          this.projectService.displayMessageerror(res.Message);
        }

      },
        err => {

          this.projectService.displayerror(err.status);
        });

  }

  openAccountPlan() {
    // const url = accountPlanUrl;
    console.log('url for accountt plan for this environment is ', this.envr.accountPlanUrl);
    // tslint:disable-next-line:max-line-length
    const myWindow = window.open(this.envr.accountPlanUrl, 'AccountPlan', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,height=' + screen.height + ',width=' + screen.width + ',top=0,left=0');
  }
}
