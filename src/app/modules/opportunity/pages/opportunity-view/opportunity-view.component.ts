import { AccountListService } from '@app/core/services/accountList.service';
import { Component, OnInit, Output, EventEmitter, Input, HostListener, Inject, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { DataCommunicationService } from '@app/core/services/global.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SubmitOrderPopup } from './tabs/order/order.component';
import { DatePipe } from '@angular/common'
import { NewresidualComponent } from './modals/newresidual/newresidual.component';
import { ContractExecutionComponent } from './modals/contract-execution/contract-execution.component';
import { MatSnackBar } from '@angular/material';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { Subject, Observable, forkJoin } from 'rxjs';
import { CreateamendmentComponent } from './modals/createamendment/createamendment.component';
import { ReactivateopprtuntyComponent } from '@app/shared/components/single-table/sprint4Modal/reactivateopprtunty/reactivateopprtunty.component';
import { suspendedpopComponent } from '@app/shared/modals/suspend-popup/suspend-popup.component';
import { assignpopComponent } from '@app/shared/modals/assign-popup/assign-popup.component';
import { OrderService } from '@app/core/services';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { environment as env } from '@env/environment';
import { OpportunitiesService, linkedLeadNames, linkedLeadsHeaders } from '@app/core/services';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { OrderApprovalStage, orderApprovalType, orderTypeId, OrderModificationRequestStatus } from './tabs/order/orderenum';
import { AssignpopupComponent } from '@app/modules/order/modal/assignpopup/assignpopup.component';
import moment from 'moment'
import { InitiatestaffingComponent, StaffInitiatedPopup } from './modals/initiatestaffing/initiatestaffing.component';
import { enableBindings } from '@angular/core/src/render3';
import { RejectpopupComponent } from '@app/modules/order/modal/rejectpopup/rejectpopup.component';
import { ApprovepopupComponent } from '@app/modules/order/modal/approvepopup/approvepopup.component';
import { OrderapprovepopupComponent } from './orderapprovepopup/orderapprovepopup.component';
import { SharePopupComponent } from '../../pages/landing-opportunity/tabs/all-opportunities/share-popup/share-popup.component';

import { RollbackcomponentComponent } from '@app/shared/components/single-table/sprint4Modal/rollbackcomponent/rollbackcomponent.component';
// import { OnholdpopupComponent } from '@app/modules/order/modal/onholdpopup/onholdpopup.component';

import { SearchpoaHoldersComponent } from '../searchpoa-holders/searchpoa-holders.component';
import { SowMapPopupComponent } from './modals/sow-map-popup/sow-map-popup.component';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { EnvService } from '@app/core/services/env.service';


// const toolkitUrl = env.toolkitUrl;
@Component({
  selector: 'app-opportunity-view',
  templateUrl: './opportunity-view.component.html',
  styleUrls: ['./opportunity-view.component.scss']
})

export class OpportunityViewComponent implements OnInit {
  SuperCentralMarketingManager: boolean = false; //dummy variable used - set the value to 'true' to see the disabled button changes
  showmore;
  searchPaoText = ''
  initiateDateOn = ''
  qualifierId: any = '';
  qualifierValue = '';
  isLoading: boolean = false;
  dummyContidition = false;
  winningProbabilityData = []
  datePipe = new DatePipe("en-US");
  @Input() story1: boolean;
  IsSimpleDeal: boolean;
  isSimpleOpportunity: boolean;  // count = 0;
  oppStatus = null;
  Summary_window = false;
  more_clicked;
  more_clickedthree;
  forecast = []
  forecastValue = 3;
  opportunityTab = true;
  ProceedQualify: boolean = false;
  overview: boolean = false;
  businesssolution: boolean = false;
  team: boolean = false;
  competitor: boolean = false;
  deal: boolean = false;
  order: boolean = false;
  obdistribution: boolean = false;
  closereason: boolean = false;
  tabChanges: boolean;
  // CanCreateAmendment: boolean;
  overviewDetailData: any;
  addAlliance: boolean = false;
  orderwillshow: boolean = true;
  // assignpopupshow:boolean=false;
  addIp: boolean = false;
  addNewAge: boolean = false;
  addService: boolean = false;
  fullAccess: boolean = false;
  orderTrue: boolean = false;
  contracttrue: boolean = false;
  opportunityName = '';
  oppidAfterAmendment = "";
  accessData1: any;
  PartialAccess: any;
  fullAccess1: any;
  orderCurrencysymbol: any;
  accessRight: boolean = false;
  reasonStatus = false;
  isActivityGroupSearchLoading: boolean;
  contract: boolean = false;
  savebuton = false;
  IsAppirioFlag: boolean = false;
  modifyordervalue: boolean = false;
  ApprovedbyBFMcondition: boolean = false;
  ApprovedbyBFMcondition1: boolean = false;

  //saurav flag  
  oppSummary: boolean = false;
  moreactionreview: boolean = true;
  omperc: boolean = false;
  omperedit: boolean = true;
  directAmendment: boolean = false;
  OrderBfm: boolean = false;
  moreAction: boolean = true;
  moreact: boolean = false;
  disableHardClose: boolean = false;
  negativeFlag: boolean = false;
  retagg: boolean = true;
  retaggg: boolean = false;
  hardClose1: boolean = false;
  hardClose2: boolean = false;
  BfmHardcloseFlag: boolean = false;
  winFlag: boolean = true;
  winFlagg: boolean = true;
  assignOrder: boolean = false;
  orderhi: boolean = false;
  camend: boolean = false;
  helpLineRoleFlag: boolean = false;
  incren: boolean = true;
   incr: boolean = true;
  incren1: boolean = false;
  OrderTypeId: any;
  modify: boolean = false;
  endsales1: boolean = false;
  OrderModificationCutOffDay: '';
  CreatedOn: ''; // order create date  //modification
  ApprovedByBfmDate: ''; //aprove bfm date   //modification
  createdDate: '';  //modification
  pcslbdm: boolean = false;
  winrfi: boolean = false;
  winReasonTabFlag: boolean = false;

  shareOrder: boolean = false;
  shareOrder2: boolean = false;
  //saurav flag 


  oppTypeID;
  residualButton: boolean = false;
  orderAceess: boolean = false;
  oppID: boolean;
  cloudConfigDataE = []; //array from cloudconfig array
  checkOppDataE = []; //array with required opp details for the selected opp
  flagEndSale: boolean;// validation flag from the response
  endSaleDisable: boolean; //to enable or disable the end sale button
  errorMessage: string;
  ModificationStatus: any;
  foreclosureFlag: boolean = false;
  isIntegratedDeal: boolean = false;
  isWonHardClosed: boolean = false;
  //opportunity stepper tooltip mobile
  // isMobileDevice: boolean = false;
  // lastScrollTop: number = 0;
  // ttip: boolean = true;

  //opportunity stepper tooltip mobile
  // @HostListener("window:scroll", ['$event'])
  // onScroll(event): void {
  //   if (this.isMobileDevice) {
  //     console.log("*****************scrolled*****************");
  //     let st = window.pageYOffset;
  //     let dir = '';
  //     if (st > this.lastScrollTop && window.pageYOffset > 1) {
  //       this.ttip = false;
  //       dir = "down";
  //     } else if (st < this.lastScrollTop) {
  //       this.ttip = true;
  //       dir = "up";
  //     }
  //   }
  // }

  constructor( public envr : EnvService,public accountListService: AccountListService, private EncrDecr: EncrDecrService,
    public OpportunityServices: OpportunitiesService, public OrderService: OrderService, public router: Router, private snackBar: MatSnackBar, public datepipe: DatePipe, public dialog: MatDialog, public service: DataCommunicationService, public projectService: OpportunitiesService) {

    // this.isLoading = true;
    this.bsPageSave = this.bsPageSave.bind(this);
    this.eventSubscriber(this.OpportunityServices.subscription, this.bsPageSave);

    this.ngOnInit = this.ngOnInit.bind(this);
    this.eventSubscriber1(this.OpportunityServices.subscriptionMoreOptions, this.ngOnInit);


    this.accessrightapi = this.accessrightapi.bind(this);
    this.eventSubscriber2(this.OpportunityServices.partialConversion, this.accessrightapi);

    this.overviewPage = this.overviewPage.bind(this);
    this.eventSubscriber3(this.OpportunityServices.subscriptionAccessRights, this.overviewPage);

  }
  bsPageSave() {
    this.summaryPage(true)
  }

  searchPoaEnter(e) {
    if (e.keyCode == 13) {
      this.searchPaoAll()
    }
  }

  searchPaoAll() {
    // alert('a')
    const dialogRef = this.dialog.open(SearchpoaHoldersComponent, {
      width: '1820px',
      // JSON.parse(JSON.stringify (this.searchPaoText)) 
      data: { data: this.searchPaoText ? this.searchPaoText : '', action: 'search', searchAction: true }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {

      }
    }, err =>
        console.log(err));

  }
  viewAll() {

    const dialogRef = this.dialog.open(SearchpoaHoldersComponent, {
      width: '1820px',
      data: { data: this.searchPaoText ? this.searchPaoText : '', action: 'search', searchAction: false }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {

      }
    }, err =>
        console.log(err));
  }


  accessApi() {

    this.isLoading = true;
    this.OpportunityServices.accessModifyApi(this.advisorOwnerId, localStorage.getItem('userEmail')).subscribe(response => {
      if (!response.IsError) {


        this.OpportunityServices.setSession('FullAccess', response.ResponseObject.FullAccess ? response.ResponseObject.FullAccess : false);
        this.isLoading = false;
        if (response.ResponseObject.FullAccess == false && response.ResponseObject.PartialAccess == false) {
          this.moreact = false;
        }
        if (!response.ResponseObject.FullAccess) {
          this.OpportunityServices.setSession('FullAccess', response.ResponseObject.FullAccess ? response.ResponseObject.FullAccess : false);
          this.OpportunityServices.setSession('roleObj', response.ResponseObject);
          this.OpportunityServices.setSession('IsPreSaleAndRole', response.ResponseObject.UserRoles ? response.ResponseObject.UserRoles.IsPreSaleAndRole : false)
          this.OpportunityServices.setSession('IsDeliverySpocRole',response.ResponseObject.UserRoles?response.ResponseObject.UserRoles.IsDeliverySpocRole:false)
          this.OpportunityServices.setSession('IsGainAccess', response.ResponseObject.IsGainAccess ? response.ResponseObject.IsGainAccess : false)
          this.OpportunityServices
        }




        this.OpportunityServices.moreOptions();
        //  if (this.router.url !== '/opportunity/allopportunity'){
        //  window.location.reload();
        // }

      }
      else {
        this.OpportunityServices.displayMessageerror(response.Message);
      }
    }
      ,
      err => {
        this.isLoading = false;
        this.service.loaderhome = false;
        this.OpportunityServices.displayerror(err.status);
      }
    );
  }

  subscription;
  subscriptionMoreOptions;
  partialConversion;
  subscriptionAccessRights;
  eventSubscriber(action: Subject<any>, handler: () => void, off: boolean = false) {
    if (off && this.subscription) {
      this.subscription.unsubscribe();
    } else {
      this.subscription = action.subscribe(() => handler());
    }
  }
  eventSubscriber1(action: Subject<any>, handler: () => void, off: boolean = false) {
    if (off && this.subscriptionMoreOptions) {
      this.subscriptionMoreOptions.unsubscribe();
    } else {
      this.subscriptionMoreOptions = action.subscribe(() => handler());
    }
  }
  eventSubscriber2(action: Subject<any>, handler: () => void, off: boolean = false) {
    if (off && this.partialConversion) {
      this.partialConversion.unsubscribe();
    } else {
      this.partialConversion = action.subscribe(() => handler());
    }
  }
  eventSubscriber3(action: Subject<any>, handler: () => void, off: boolean = false) {
    if (off && this.subscriptionAccessRights) {
      this.subscriptionAccessRights.unsubscribe();
    } else {
      this.subscriptionAccessRights = action.subscribe(() => handler());
    }
  }

  ngOnDestroy(): void {
    if (this.OrderService.amendmentInProcess == false) {
      this.OrderService.newAmendmentDetails = "";
      this.OrderService.parentOrderId = "";
    }
    this.projectService.orderpagestart = false;
    this.projectService.smartsearch = false;
    // this.projectService.proceedTocloseStart=false;
    this.projectService.restTab = false;
    this.projectService.clearSession('opportunityRedirect');
    this.eventSubscriber(this.OpportunityServices.subscription, this.bsPageSave, true);
    this.eventSubscriber1(this.OpportunityServices.subscriptionMoreOptions, this.ngOnInit, true);
    this.eventSubscriber2(this.OpportunityServices.partialConversion, this.accessrightapi, true);
    this.eventSubscriber3(this.OpportunityServices.subscriptionAccessRights, this.overviewPage, true);
  }


  checkRetagFun() {
    if (this.OrderTypeId == '184450005') {
      let requestBody = {
        "Guid": this.orderid
      }
      this.OrderService.getStatusForRetag(requestBody).subscribe((data: any) => {
        console.log("data", data);
        if (!data.IsError) {
          if (data.ResponseObject) {
            this.router.navigate(['/opportunity/orderactions/retagOrder'])
          } else {
            this.projectService.displayMessageerror(`There is project tagged to this order “${this.OrderNumber}”, hence cannot be retagged`);
            this.isLoading = false;
          }
        }
      }, err => {
        this.projectService.displayerror(err.status);
      }
      );
    }
    else {
      this.router.navigate(['/opportunity/orderactions/retagOrder'])
    }

  }


  accordianContent1;
  orderAccordianContent1;
  getAccordians(key) {

    //console.log('hi');
    if (key === 'opportunityTab') {
      this.opportunityTab = true;
      this.accordianContent1 = [this.accordianContent[key]];
    } else {
      this.opportunityTab = false;
      this.orderAccordianContent1 = [this.orderAccordianContent[key]];
    }
  }

  showSummary_window() {
    window.scroll(0, 0);
    this.service.Summary_window = true;
    /** custom scroll impl  starts here*/
    setTimeout(() => {
      this.service.findWidth(true)
    }, 1000);

    /** Custom scrollimpl ends here */
  }
  closeSummary_window() {
    this.service.Summary_window = false;
    /** custom scroll impl  starts here*/
    setTimeout(() => {
      this.service.findWidth(true)
    }, 1000);

    /** Custom scrollimpl ends here */

  }



  // LinkLeadsData = [];
  // LeadActivities = []

  leadDetails(data, dialogRef) {
    var orginalArray = this.projectService.getleadActivities();
    orginalArray.subscribe((x: any[]) => {

      dialogRef.componentInstance.data.configdata = x.filter(y => y.name.includes(data));

      //.filter(y=>y.name.includes(data))
    });

    // //console.log("value from server " +this.LinkLeadsData);
  }

  residualoppurtunity() {
    const dialogRef = this.dialog.open(NewresidualComponent, {
      width: '400px'
    });
  }

  openSupersowmap() {
    const dialogRef = this.dialog.open(SowMapPopupComponent, {
      width: '650px'
    });
  }

  openSubmitOrderPopup() {
    const dialogRef = this.dialog.open(SubmitOrderPopup, {
      width: '550px'
    });

  }
  ActivityDetails(data, dialogRef) {
    var orginalArray = this.projectService.getLead();
    orginalArray.subscribe((x: any[]) => {

      dialogRef.componentInstance.data.configdata = x.filter(y => y.name.includes(data));


    });


  }

  summaryPopup(content) {

    switch (content) {
      case 'Type': {
        this.router.navigate(['/opportunity/opportunityview/changeOpportunity']);
        return;
      }
      case 'Qualification status': {
        this.dealqualify()
        return;
      }

      case 'Est. closure date': {
        this.estimateddate()
        return;
      }

      case 'Manual probability': {
        this.manualprobability()
        return;
      }

      case 'Activities': {
        this.activityPopup();
        return;

        // const dialogRef = this.dialog.open(LinkLeadspopup,
        //   {
        //     width: '396px',
        //     data: { configdata: '', title: 'Linked activities', label: 'Link activities' }
        //   });

        // dialogRef.componentInstance.Modalemittedcontent.subscribe((x) => {

        //   //console.log('value received from modal ' + x);
        //   this.leadDetails(x, dialogRef);


        // });


        // return;
      }

      case 'Leads': {

        this.leadsPopup();
        return;
        // const dialogRefmy = this.dialog.open(LinkLeadspopup,
        //   {
        //     width: '396px',
        //     data: { configdata: '', title: 'Link leads', label: 'Link leads' }
        //   });

        // dialogRefmy.componentInstance.Modalemittedcontent.subscribe((x) => {

        //   //console.log(x);
        //   this.ActivityDetails(x, dialogRefmy);

        // });


        // return;
      }
      case 'OM(%)': {

        this.ompopup();
        return;
      }


    }
  }




  assignPopUp() {
    const dialogRef = this.dialog.open(assignpopComponent,
      {
        width: '396px',
        data: {
          data: [{
            "OpportunityName": this.OpportunityServices.getSession('opportunityName'), "OpportunityId": this.OpportunityServices.getSession('opportunityId')
            , isCheccked: false, "OpportunityOwnerId": this.OpportunityServices.getSession('oppOwnerNamee')

          }]
        }
      });
    dialogRef.afterClosed().subscribe(result => {

      if (result == 'close') { }
      else if (result == 'save') {
        // this.accessApi()
        sessionStorage.setItem('pinStatusFlag', 'true');
        if (sessionStorage.getItem('routePage') ? sessionStorage.getItem('routePage') == 'account' : false) {
          this.router.navigate(['/accounts/accountopportunity/allopportunity']);

        }
        else {
          this.router.navigate(['/opportunity/allopportunity']);
        }
      }

    });
  }

  assignorderPopUp() {
    const dialogRef = this.dialog.open(AssignpopupComponent, {
      width: '350px',
      // data: { data:    JSON.parse(JSON.stringify (actionRequired.objectRowData))  }
      data: {
        data: [{
          "OpportunityName": this.OpportunityServices.getSession('opportunityName'),
          "OpportunityId": this.OpportunityServices.getSession('opportunityId'),
          isCheccked: false,
          "orderBookingId": this.orderbookingId, "OrderId": this.OrderNumber

        }],

      }
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result == 'close') {

      }
      else {
        if (this.projectService.getSession('IsAmendment') == true && this.projectService.getSession('orderId') != null) {
          this.GetSessionDetails(true);
          this.getoppOverviewdetailsa();
          this.projectService.setorderassign(true);
        }
        else {
          this.summaryPage(true);
          this.getoppOverviewdetailsa();
          this.projectService.setorderassign(true);

        }
      }
    });
  }

  sharePopup(templateId,accountTemplateId ) {
    var selectedOpportunity = [];
    selectedOpportunity.push({ 'OpportunityId': this.OpportunityServices.getSession('opportunityId'), 
    'AccountId':    this.projectService.getSession('accountid')   } )
    const dialogRef = this.dialog.open(SharePopupComponent,
      {
        width: '480px',
        data: { data: selectedOpportunity, templateId: templateId ,accountTemplateId: accountTemplateId }

      });
    dialogRef.afterClosed().subscribe(result => {

      if (result == 'success') {
        this.OpportunityServices.moreOptions();
      }
      else {


      }

    });

  }


// AccountTemplateid(templateId){
//   this.isLoading = true;
// this.projectService.getTemplate("Account (Read)").subscribe(response => {
//   if( !response.IsError){
//     this.isLoading = false;
//    var accountTmplateId =response.ResponseObject.Teamtemplateid
//    this.sharePopup(templateId,accountTmplateId)
    
//    }
// else{
//  this.projectService.displayMessageerror(response.Message);
// } 
// }
// ,
//    err => {
//         this.isLoading = false;
// this.projectService.displayerror(err.status);
// }
// );
// }

  // getShareTemplateAPi() {
  //   this.isLoading = true;
  //   this.projectService.getTemplate('Opportunity (Read - Write)').subscribe(response => {
  //     if (!response.IsError) {
  //       this.isLoading = false;
  //       var templateId = response.ResponseObject.Teamtemplateid
  //       this.AccountTemplateid(templateId)

  //     }
  //     else {
  //       this.projectService.displayMessageerror(response.Message);
  //     }
  //   }
  //     ,
  //     err => {
  //       this.isLoading = false;
  //       this.service.loaderhome = false;
  //       this.projectService.displayerror(err.status);
  //     }
  //   );


  // }

   //share for Order.

   getShareOrderTemplateAPi() {
    this.service.loaderhome = true;
    let order = this.projectService.getTemplate('Order (Read)');
    let account = this.projectService.getTemplate('Account (Read)');
    let opportunity = this.projectService.getTemplate('Opportunity (Read)');
    forkJoin([order, account, opportunity]).subscribe(response => {
      console.log(response);
      if (response && response[0] && response[1] && response[2] && !response[0].IsError && !response[1].IsError && !response[2].IsError) {
        this.service.loaderhome = false;
        var templateId = response
        this.orderSharePopup(templateId)
      }
      else {
        this.projectService.displayMessageerror('Oops!!! An error occured');
      }
    }
      ,
      err => {
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      }
    );


  } 



 orderSharePopup(templateIds) {
    const actionRequired = [{
      orderBookingId:this.orderbookingId ,
      AccountID: this.projectService.getSession('accountid'),
      IdOfOpportunity: this.OpportunityServices.getSession('opportunityId'),
      ParentOpportunityId: this.ParentOpportunityId,
      
    }];

    const dialogRef = this.dialog.open(SharePopupComponent,
      {
        width: '480px',
        data: {
          data: JSON.parse(JSON.stringify(actionRequired)),
          templateId: JSON.parse(JSON.stringify(templateIds)),
          isOrder: true
        }
      });
    dialogRef.afterClosed().subscribe(result => {

      if (result == 'success') {
        this.ngOnInit();

      }
      else {

      }
    });

  }






  helpdesk = false;
  openModalContent(value) {

    switch (value) {

      case 'Assign': {

        if (this.router.url == '/opportunity/opportunityview/order' && (this.projectService.ordercreatesuccess == true || (this.currentState).toString() == "184450004")) {
          this.assignorderPopUp();
        }
        else {

          if (this.projectService.getSession('FullAccess')) {
            this.assignPopUp();
          }
          else {


            // this.projectService.displayMessageerror("You don't have permission to assign opportunity");
            let body = {
              "UserId": this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
              "OpportunityOwnerId": this.opportunityOwnerId,
              "VerticalSalesOwner": this.verticalSalesOwnerId,
              "PrimaryAccountOwnerId": this.accountOwnerId,
              "OpportunityId": this.OpportunityServices.getSession('opportunityId')
            }
            this.OpportunityServices.checkSupervisor(body).subscribe(response => {
              if (!response.IsError) {
                if (response.ResponseObject) {
                  this.assignPopUp();
                }
                else {
                  this.OpportunityServices.displayMessageerror("You don't have permission to assign opportunity");
                }
              }
              else {
                this.OpportunityServices.displayMessageerror(response.Message);
              }
            }
              ,
              err => {
                this.isLoading = false;
                this.service.loaderhome = false;
                this.OpportunityServices.displayerror(err.status);
              }
            );

          }
        }
        return;
      }



      case 'Suspend': {
        if (!this.projectService.getSession('FullAccess')) {

          this.projectService.displayMessageerror("You don't have permission to suspend opportunity");

        }


        else if (this.projectService.getSession('IsStaffingInitiated')) {
          this.projectService.displayMessageerror("This Opportunity can't be suspended as staffing is initiated already.");
        }
        else if (!this.projectService.getSession('SuspendCount') || ((this.suspendcountview) > 1)) {
          this.projectService.displayMessageerror("It can't be done more than twice");
        }
        else if (!this.projectService.getSession('IsOAR')) {
          this.projectService.displayMessageerror("Suspend can’t happen if staffing has been initiated or if it is in OAR")
        }
        // else if (!this.projectService.getSession('SuspendedDuration')&&((this.SuspendedDuration1)>180)) {
        //   this.projectService.displayMessageerror('Opportunity can be suspended once for 180 days or twice for with summation of both duration, not more than 180 days ');
        // }


        else {
          const dialogRef = this.dialog.open(suspendedpopComponent,
            {
              width: '396px',
              data: {
                data: {
                  "OpportunityName": this.OpportunityServices.getSession('opportunityName'), "OpportunityId": this.OpportunityServices.getSession('opportunityId'), "Estclosuredate": this.OpportunityServices.getSession('estDate'), "SuspendCount": this.suspendcountview,
                  "suspenddurationvalue": this.OpportunityServices.getSession('suspendduration'), "SuspendStartDate": this.SuspendStartDate,
                  "NextReviewDate": this.NextReviewDate
                }
              }

            });
          dialogRef.afterClosed().subscribe(result => {

          });
        }
        return;

      }
      case 'Reactivate': {
        if (this.projectService.getSession('FullAccess')) {
          const dialogRef = this.dialog.open(ReactivateopprtuntyComponent,
            {
              width: '396px',
              data: {
                data: {
                  "OpportunityName": this.OpportunityServices.getSession('opportunityName'), "OpportunityId": this.OpportunityServices.getSession('opportunityId')
                }
              }

            });
          dialogRef.afterClosed().subscribe(result => {

            if (result == 'close') { }
            else if (result == 'save') {
              this.OpportunityServices.moreOptions();

            }

          });

        }
        else {
          this.projectService.displayMessageerror("You don't have permission to reactivate opportunity");
        }
        return;
      }


      case 'share': {
        if (this.projectService.getSession('FullAccess')) {
          this.sharePopup('','')

        }
        else {
          this.projectService.displayMessageerror("You don't have permission to share opportunity");
        }
        return;
      }

      case 'Ordershare': {
        if ((this.router.url === '/opportunity/opportunityview/order')) {
          this.getShareOrderTemplateAPi();
        }
        else {
          this.projectService.displayMessageerror("You don't have permission to share order");
        }
        return;
      }


      case 'Reopen': {
        if (this.helpdesk) {
          this.projectService.displayMessageerror("Your reopen request is pending with helpdesk.")
        }

        else if (this.projectService.getSession('FullAccess')) {
          const dialogRef = this.dialog.open(ReopenOpportunityPopComponentt,
            {
              width: '396px',
              data: {
                data: [{
                  "OpportunityName": this.OpportunityServices.getSession('opportunityName'), "OpportunityId": this.OpportunityServices.getSession('opportunityId')
                  , isCheccked: false
                }]
              }

            });
          dialogRef.afterClosed().subscribe(result => {
            if (result == 'close') {
              this.overviewApi()
            }

          });

        }
        else {
          this.projectService.displayMessageerror("You don't have permission to reopen opportunity");
        }
        return;
      }


    }

  }

  overviewApi() {
    let obj = { "OppId": this.projectService.getSession('opportunityId') }
    this.isLoading = true
    this.projectService.getOppOverviewDetail(obj).subscribe(response => {
      this.isLoading = false
      if (!response.IsError) {
        this.helpdesk = response.ResponseObject.RequestedReopen ? true : false;

      }
      else {
        this.projectService.displayMessageerror(response.Message);
      }
    }
      ,
      err => {
        this.isLoading = false
        this.projectService.displayerror(err.status);
      }
    );

  }
  openAmendment() {
    const dialogRef = this.dialog.open(CreateamendmentComponent,
      {
        width: '396px',
        data: {
          WTFlag: this.WTFlag
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      //(click)="createAmendment(true)"
      // console.log('result12489', result)
      if (result.flag == 'yes') {
        if (this.OrderService.parentOrderId) {
          this.projectService.ordersummarytab = false;
          this.opportunityTab = true;
          //alert(this.OrderService.parentOrderId);
          this.ApprovedbyBFMcondition1 = false;
          this.projectService.ordercreatesuccess1 = false;
          this.orderrolebaseapi(false)
        }

      }

    });



  }

  requestForCampaign() {
    console.log("campaign obj", this.CampaignObj);
    //  this.projectService.setSession("requestCampaignFromOpp",this.CampaignObj);
    sessionStorage.setItem('RequestCampaign', JSON.stringify(this.CampaignObj));
    this.router.navigate(['/campaign/RequestCampaign']);
  }

  //initiate staffing code start
  estDateCheck: boolean = false;
  sapCheck: boolean = false;
  winprobabilityCheck: boolean = false;
  forCasteCheck: boolean = false;
  allcheck: boolean = false;
  staffingInitiated: boolean = false;
  dataCheck: any = {}
  initiateStaff() {

    this.estDateCheck = true;
    this.sapCheck = true;
    this.winprobabilityCheck = true;
    this.forCasteCheck = false;
    this.allcheck = false;
    let estimatedCloseDate = this.datePipe.transform(this.profileDetails.EstimatedCloseDate, 'yyyy-MM-dd');
    //let estimatedCloseDate ='2019-10-09'
    let todaydate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    let currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 180);
    let calculatedDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
    if (estimatedCloseDate > calculatedDate || estimatedCloseDate < todaydate) {
      this.estDateCheck = false;
    }
    let sapId = this.profileDetails.StaffingDetails ? this.profileDetails.StaffingDetails.SapCode.SysGuid : "";
    if (!sapId) {
      this.sapCheck = false;
    }
    let winprobability = this.profileDetails.WiproWinPredictorProbability ? this.profileDetails.WiproWinPredictorProbability : '';
    if (winprobability < 11) {
      this.winprobabilityCheck = false;
    }
    if (this.profileDetails.OpportunityForecast == 1 || this.profileDetails.OpportunityForecast == 2) {
      this.forCasteCheck = true;
    }
    if (this.estDateCheck && this.sapCheck && this.forCasteCheck) {
      this.allcheck = true;
    }
    this.dataCheck =
      {
        estDateCheck: this.estDateCheck,
        sapCheck: this.sapCheck,
        //winprobabilityCheck: this.winprobabilityCheck,
        forCasteCheck: this.forCasteCheck,
        allcheck: this.allcheck
      }
    if (!this.staffingInitiated) {
      const dialogRef = this.dialog.open(InitiatestaffingComponent,
        {
          width: '500px',
          //data: {data:this.dataCheck}
        });

      dialogRef.componentInstance.dataInfo = this.dataCheck;
      dialogRef.afterClosed().subscribe((x: any) => {

        if (x) {
          let currentDate = new Date();
          let currentDateFormat = this.datePipe.transform(currentDate, 'MM-dd-yyyy');
          let obj = {
            "OpportunityId": this.projectService.getSession('opportunityId'),  // selected opportunity id
            "StaffingDetails": {
              "IsStaffingInitiated": true,  // always true when calling api
              "StaffingInitiatedOn": currentDateFormat  // current date time format should be like “MM/DD/YYYY”
            }
          }

          this.projectService.getStaffingDetails(obj).subscribe(result => {

            if (!result.IsError) {

              this.initiateDateOn = result.ResponseObject.StaffingDetails ? this.datePipe.transform(result.ResponseObject.StaffingDetails.StaffingInitiatedOn, "dd-MMM-yyyy") : ''

              this.staffingInitiated = false;
              this.staffingInitiated = result.ResponseObject.StaffingDetails ? result.ResponseObject.StaffingDetails.IsStaffingInitiated : "";
              if (this.staffingInitiated) {
                this.projectService.setSession('IsStaffingInitiated', true)
              }
              else {
                this.projectService.setSession('IsStaffingInitiated', false)
              }
              this.accordianContent.map((it) => {
                {
                  if (it.title == 'Staffing details') {
                    it.content.map((it1) => {
                      if (it1.label == 'Initiated date') {
                        it1.content = this.initiateDateOn
                      }
                    }
                    )
                  }
                } return it
              })
              this.insidePopup();
            }

          });
        }

      })
    }
    else {
      this.projectService.displayMessageerror("Staffing Initiated for this opportunity");
    }
  }
  insidePopup() {
    const dialogRef = this.dialog.open(StaffInitiatedPopup,
      {
        width: '400px'
      });
  }
  //initiate staffing code end
  dealqualify() {
    const dialogRef = this.dialog.open(dealQualifierpopup,
      {
        width: '350px',
        data: { data: this.qualifierData, qualifyCreatedDate: this.qualifyCreatedDate, qualifierId: this.qualifierId, qualificationStatusArr: this.qualificationStatusArr }

      });
    dialogRef.afterClosed().subscribe(result => {
      this.profilesSummary()

      if (result == 'close') {

      }
      else if (result == 'success') {
        this.profilesSummary()
      }
    });
  }

  estimateddate() {
    const dialogRef = this.dialog.open(estimtedclosuredate,
      {
        width: '350px',
        data: { data: this.accordianContent },
        position: {
          bottom: '235px'
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'save') {
        this.ngOnInit()
      }
    });
  }

  ompopup() {
    const dialogRef = this.dialog.open(omchangepopup,
      {
        width: '350px',
        data: {
          data: this.accordianContent,
          OMPercentage: this.OMPercentage
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log("OM result", result);
      if (result) {

        if (result.flag == 'Yes') {

          let payload = {
            SalesOrderId: this.orderbookingId,
            OMPercentage: result.OMPerData
          }

          this.service.loaderhome = true;


          this.OrderService.updateOMPercentage(payload).subscribe((res: any) => {
            if (!res.IsError) {
              console.log("omPer", res.ResponseObject);
              this.service.loaderhome = false;
              this.projectService.displayMessageerror("OM% updated successfully");
              this.getPricingApproval();
            }
            else {
              this.service.loaderhome = false;
              this.projectService.displayMessageerror(res.Message)
            }
          },
            err => {
              this.isLoading = false;
              this.service.loaderhome = false;
              this.projectService.displayerror(err.status);
            });
        }
      }
    })
  }

  manualprobability() {
    const dialogRef = this.dialog.open(manualprobabilitypopup,
      {
        width: '350px',
        data: { data: this.forecastValue, winningProbabilityData: this.winningProbabilityData, ManualProbabilityWiningValue: this.ManualProbabilityWiningId, isSimpleOpportunity: this.isSimpleOpportunity }
      });

    dialogRef.afterClosed().subscribe(result => {

      //console.log(result, 'result');
      if (result == 'save') {
        this.forecastData();
      }
    });

  }
  activityPopup() {

    const dialogRef = this.dialog.open(LinkLeadspopup,
      {
        width: '396px',
        data: { configdata: '', title: 'Link activities', label: 'Link activities', data: this.accordianContent }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'save') {
        this.activityData();
        //console.log(result, 'result');
      }
    });
  }


  leadsPopup() {


    const dialogRef = this.dialog.open(Leadspopup,
      {
        width: '396px',
        data: { configdata: '', title: 'Link leads', label: 'Link leads', data: this.accordianContent }
      });

    dialogRef.afterClosed().subscribe(result => {

      //console.log(result, 'result');
      if (result == 'save') {
        this.leadData();
      }
    });

  }



  openUserTargetsPopup(): void {
    const dialogRef = this.dialog.open(UserTargetsPopup, {
      width: '850px',
    });


  }
  openpursuitPopup(): void {
    const dialogRef = this.dialog.open(Pursuitpopup, {
      width: '350px',
    });
  }
  securePopup(): void {
    const dialogRef = this.dialog.open(securedealpopup, {
      width: '350px',
    });
  }
  openrollbackpopup() {
    const dialogRef = this.dialog.open(RollbackcomponentComponent, {
      width: '450px',
    });
    dialogRef.afterClosed().subscribe(result => {

      console.log(result, 'result');
      let stageValue = result;
      if (result) {
        let obj = {
          "OpportunityGuid": this.OpportunityServices.getSession('opportunityId'),
          "AttributeValue": result
        }
        this.OpportunityServices.updateStageAPI(obj).subscribe(result => {
          console.log("stageresult", result)
          if (!result.IsError) {
            this.summaryPage(true);
            //this.projectService.reloadoverviewpage();
            this.service.GetRedisCacheData('saveOpportunity').subscribe(res => {
              console.log("redis", res)
              if (!res.IsError && res.ResponseObject) {
                console.log("parsed data", JSON.parse(res.ResponseObject))
                let oppIdFromSession = this.projectService.getSession('opportunityId');
                let dataFromRedis = JSON.parse(res.ResponseObject);
                if (Array.isArray(dataFromRedis) && dataFromRedis.length > 0) {
                  let currentOpportunityData = dataFromRedis.filter(data => data.opportunityId == oppIdFromSession)
                  if (currentOpportunityData.length) {
                    dataFromRedis.map(data => {
                      if (data.opportunityId == oppIdFromSession) {
                        data.PipelineStage = parseInt(stageValue);
                      }
                    })
                    this.service.SetRedisCacheData(dataFromRedis, 'saveOpportunity').subscribe(res => {
                      if (!res.IsError) {
                        console.log("SUCESS FULL AUTO SAVE")
                        this.projectService.reloadoverviewpage();
                        this.OpportunityServices.displayMessageerror("Stage roll back successful!")
                      }
                    }, error => {
                      console.log(error)
                    })
                  }
                  else {
                    this.projectService.reloadoverviewpage();
                    this.OpportunityServices.displayMessageerror("Stage roll back successful!")
                  }
                }
              }
              else {
                this.projectService.reloadoverviewpage();
                this.OpportunityServices.displayMessageerror("Stage roll back successful!")
              }
            })
          }
          else {
            this.OpportunityServices.displayMessageerror("Stage roll back failed")
          }
        })
      }
    });
  }
  panelOpenStateSumry: boolean;

  accordianContent: any = [


    {
      'title': 'Profile', 'content': [

        {
          'label': 'Opportunity name',
          'content': ''
        },
        {
          'label': 'Opportunity ID',
          'content': ''
        },
        {
          'label': 'Opportunity owner',
          'content': ''
        },
        {
          'label': 'Account name',
          'content': ''
        },
        {
          'label': 'SBU',
          'content': ''
        },
        {
          'label': 'Vertical',
          'content': ''
        },
        {
          'label': 'Sub-Vertical',
          'content': ''
        },
        {
          'label': 'Est. closure date',
          'content': '',
          'isEditable': true
        },
        {
          'label': 'Currency',
          'content': '',

        },
        {
          'label': 'TCV',
          'content': '',
          'isEditable': false
        },
        {
          'label': 'ACV',
          'content': '',
          'isEditable': false
        },
        {
          'label': 'TCV in plan forex',
          'content': '',
          'isEditable': false
        },
        {
          'label': 'ACV in plan forex',
          'content': '',
          'isEditable': false
        },
        {
          'label': 'TCV in dynamic forex',
          'content': '',
          'isEditable': false
        },
        {
          'label': 'ACV in dynamic forex',
          'content': '',
          'isEditable': false
        },
        {
          'label': 'Type',
          'content': '',
          'isEditable': true
        },
        {
          'label': 'Base order number',
          'content': '',
          'isEditable': false
        },

        // {
        //   'label': 'Win predictor probability(%)',
        //   'content': '',
        //   'isEditable': false
        // },
        {
          'label': 'StormCast score',
          'content': '',
          'isEditable': false
        },
        {
          'label': 'Manual probability',
          'content': '',
          'isEditable': true
        },
        {
          'label': 'RS qualifier status',
          'content': '',
          'isEditable': false
        },
        {
          'label': 'Forecast',
          'content': '',
          'isEditable': false
        },
        {
          'label': 'CRM reference number',
          'content': '',
          'isEditable': false
        },
        {
          'label': 'Status',
          'content': '',
          'isEditable': false
        },
        {
          'label': 'Created date',
          'content': '',
          'isEditable': false
        },

      ]

    },
    {
      'title': 'Toolkit', 'content': [

        {
          'label': 'Stormtracker suite',
          'content': '0 Records'
        },
        {
          'label': 'Relationship Suite',
          'content': 'No'
        },
        {
          'label': 'Management log',
          'content': 'No'
        },
        {
          'label': 'Win strategy',
          'content': 'No'
        },
        {
          'label': 'Competitor strategy',
          'content': 'No'
        },
        {
          'label': 'RAID log',
          'content': 'No'
        }
        // ,
        // {
        //   'label': 'IV P/VP and slide deck',
        //   'content': 'No'
        // },
        // {
        //   'label': 'My digital coach',
        //   'content': 'Available'
        // },
        // {
        //   'label': 'Encounter Plan',
        //   'content': 'No'
        // },
        // {
        //   'label': 'Commitment register',
        //   'content': 'No'
        // },




      ]

    },

    {
      'title': 'Closure details', 'content': [

        {
          'label': 'Win/Loss reasons',
          'content': 'View'
        },
        {
          'label': 'Status reason',
          'content': ''
        },
        {
          'label': 'Order booking',
          'content': ''
        },
        {
          'label': 'Actual close date',
          'content': ''
        },
        {
          'label': 'Soft-close date',
          'content': ''
        },
        {
          'label': 'Hard-close date',
          'content': ''
        }
        ,
        {
          'label': 'Actual revenue',
          'content': ''
        },

      ]

    },
    {
      'title': 'Pricing approval status', 'content': [

        {
          'label': 'Pricing ID',
          'content': ''
        },
        {
          'label': 'Pricing approval status',
          'content': ''
        },
        {
          'label': 'BFM',
          'content': ''
        },
        {
          'label': 'Approval pending with',
          'content': ''
        },
      ]
    },
    {
      'title': 'Opportunity qualifier', 'content': [
        {
          'label': 'Qualification status',
          'content': '',
          'isEditable': true
        }
      ]

    },
    {
      'title': 'Staffing details', 'content': [

        // {
        //   'label': 'Request',
        //   'content': 'Not mentioned',

        // },
        // {
        //   'label': 'Forecast submitted date',
        //   'content': 'Not mentioned',

        // },
        {
          'label': 'Initiated date',
          'content': '',

        }

      ]

    },

    // {
    //   'title': 'Users carrying targets', 'content': [


    //     {
    //       'label': 'Forecast submitted date',
    //       'content': 'Not mentioned',

    //     },
    //     {
    //       'label': 'Initiated date',
    //       'content': 'Not mentioned',

    //     }
    //   ], 'hideContent': true

    // },
    // {
    //   'title': 'SOW details', 'content': [

    //     {
    //       'label': 'SOW ID',
    //       'content': 'Not mentioned',


    //     }


    //   ]

    // },
    {
      'title': 'Delivery team', 'content': [
        {
          'deliverycontent': '',
          'sapcontent': ''
        },

      ]

    },
    {
      'title': 'POA Holders', 'content': [

        {
          'label': '',
          'content': '',

        },

        {
          'label': '',
          'content': '',

        },

        {
          'label': '',
          'content': '',

        },

        {
          'label': '',
          'content': '',

        },

        {
          'label': '',
          'content': '',

        }
      ]

    },
    {
      'title': 'Linked activities & leads',

      'content': [
        {
          'actionTitle': 'Activities', 'icon': 'mdi-message-settings-variant',

          'subContent': [
            // {
            //   'accountName': 'Reimagine singtel procurement process',
            //   'account': 'Cust Mtg - Lead development',
            //   'name': ' Avinash Gupta'

            // },
            // {
            //   'accountName': 'Reimagine singtel procurement process',
            //   'account': 'Cust Mtg - Lead development',
            //   'name': 'Rahul Jain'

            // },
            // {
            //   'accountName': 'Reimagine singtel procurement process',
            //   'account': 'Cust Mtg - Lead development',
            //   'name': ' Avinash gupta'
            // },
            // {
            //   'accountName': 'Reimagine singtel procurement process',
            //   'account': 'Cust Mtg - Lead development',
            //   'name': ' Avinash gupta'
            // },
            // {
            //   'accountName': 'Reimagine singtel procurement process',
            //   'account': 'Cust Mtg - Lead development',
            //   'name': ' Avinash gupta'
            // },
            // {
            //   'accountName': 'Reimagine singtel procurement process',
            //   'account': 'Cust Mtg - Lead development',
            //   'name': ' Avinash gupta'
            // },
            // {
            //   'accountName': 'Reimagine singtel procurement process',
            //   'account': 'Cust Mtg - Lead development',
            //   'name': ' Avinash gupta'
            // },
            // {
            //   'accountName': 'Reimagine singtel procurement process',
            //   'account': 'Cust Mtg - Lead development',
            //   'name': ' Avinash gupta'
            // },
            // {
            //   'accountName': 'Reimagine singtel procurement process',
            //   'account': 'Cust Mtg - Lead development',
            //   'name': ' Avinash gupta'

            // }

          ]

        },

        // { 'actionTitle': 'leads','icon':'mdi-rounded-corner', }
        {
          'actionTitle': 'Leads', 'icon': 'mdi-rounded-corner',

          'subContent': [
            // {
            //   'accountName': 'Lead name 001',
            //   'name': ' Avinash Gupta'

            // },
            // {
            //   'accountName': 'Lead name 002',

            //   'name': 'Rahul Jain'

            // },
            // {
            //   'accountName': 'Lead name 003',
            //   'name': ' Avinash gupta'
            // },
            // {
            //   'accountName': 'Lead name 004',
            //   'name': ' Avinash gupta'
            // },
            // {
            //   'accountName': 'Lead name 005',
            //   'name': ' Avinash gupta'
            // },
            // {
            //   'accountName': 'Lead name 006',
            //   'name': ' Avinash gupta'
            // }, {
            //   'accountName': 'Lead name 007',
            //   'name': ' Avinash gupta'
            // }, {
            //   'accountName': 'Lead name 008',
            //   'name': ' Avinash gupta'

            // }

          ]

        }

      ]
    }

  ]



  // panelOpenStateSumry1;

  // Order tab accordians starts
  orderAccordianContent: any = [
    {
      'title': 'Order summary', 'content': [
        {
          'label': 'Number',
          'content': '',
        },
        {
          'label': 'Order owner',
          'content': ''
        },
        {
          'label': 'Primary order',
          'content': ''
        },
        {
          'label': 'CRM ref no',
          'content': ''
        },
        {
          'label': 'SAP customer code',
          'content': ''
        },
        {
          'label': 'Type',
          'content': ''
        },
        {
          'label': 'Authorization',
          'content': ''
        },
        {
          'label': '',
          'content': ''
        },
        // {
        //   'label': 'Sales booking ID',
        //   'content': ''
        // },
        // {
        //   'label': 'Commercial model',
        //   'content': ''
        // },
        {
          'label': 'Start date',
          'content': ''
        },
        {
          'label': 'End date',
          'content': ''
        },
        {
          'label': 'Approval stage',
          'content': ''
        },
        {
          'label': 'Pricing type',
          'content': ''
        },
        {
          'label': 'Pricing ID',
          'content': ''
        },
        // {
        //   'label': 'Order owner',
        //   'content': ''
        // },
        {
          'label': 'SOW ID',
          'content': ''
        },
        {
          'label': 'Pricing approval stage',
          'content': ''
        },
        {
          'label': 'Project creation at SAP-CPRO',
          'content': ''
        },
        {
          'label': 'Invoicing at SAP-CPRO',
          'content': ''
        },
        {
          'label': 'Region',
          'content': ''
        },
        {
          'label': 'Contracting country',
          'content': ''
        },
        {
          'label': 'Classification',
          'content': ''
        },
        {
          'label': 'Super SOW number',
          'content': ''
        },
        {
          'label': 'Auto created opportunity name',
          'content': ''
        },
        // {
        //   'label': 'OM %',
        //   'content': ''
        // },
      ]
    },
    {
      'title': 'Financials', 'content': [
        {
          'label': 'Exchange rate',
          'content': '',
        },
        {
          'label': `Approved amendments value($)`,
          //'label': 'Approved amendments value(`${this.orderCurrencysymbol}`)' ,
          'content': ''
        },
        {
          'label': `Approved negative amendments Value($)`,
          'content': ''
        },
        {
          'label': `Total order value($)`,
          'content': ''
        },
        {
          'label': 'Original order value',
          'content': ''
        },
        {
          'label': 'TCV in plan forex(USD)',
          'content': '',
          'tooltipmsg': 'Plan currency is the exchange rate at which Wipros current year plan numbers have been finalized at the beginning of the year.This rate will be used for OB reporting and Incentive Calculation'
        },
        {
          'label': 'ACV in plan forex(USD)',
          'content': '',
          'tooltipmsg': 'Plan currency is the exchange rate at which Wipros current year plan numbers have been finalized at the beginning of the year. This rate will be used for OB reporting and Incentive Calculation'
        },
        {
          'label': 'TCV in dynamic forex(USD)',
          'content': '',
          'tooltipmsg': 'Dynamic currency is the exchange rate that is in place in the market currently'
        },
        {
          'label': 'ACV in dynamic forex(USD)',
          'content': '',
          'tooltipmsg': 'Dynamic currency is the exchange rate that is in place in the market currently'
        },
      ]
    },
    {
      'title': 'Amendment summary', 'content': [
        {
          'label': 'No. of approved amendments',
          'content': '',
        },
        {
          'label': 'No. of un-approved amendments',
          'content': ''
        },
        {
          'label': 'Approved value',
          'content': ''
        },
        {
          'label': 'Unapproved value',
          'content': ''
        },
      ]
    },
    {
      'title': 'Pricing approval summary', 'content': [
        {
          'label': 'Pricing ID',
          'content': '',
          'isEditable': false
        },
        {
          'label': 'Pricing approval status',
          'content': '',
          'isEditable': false
        },
        {
          'label': 'BFM',
          'content': '',
          'isEditable': false
        },
        {
          'label': 'Approval pending with',
          'content': '',
          'isEditable': false
        },
        {
          'label': 'Deal owner',
          'content': '',
          'isEditable': false
        },
        {
          'label': '',
          'content': '',
          'isEditable': ''
        },

      ]
    },
    {
      'title': 'Delivery team', 'content': []
    },
    // {
    //   'title': 'Budget details', 'content': [
    //     {
    //       'label': 'Pricing ID',
    //       'content': '',
    //     },
    //     {
    //       'label': 'OM %',
    //       'content': ''
    //     },
    //     {
    //       'label': 'Discount/Premium',
    //       'content': ''
    //     },
    //     {
    //       'label': 'Discount/Premium base',
    //       'content': ''
    //     },
    //     {
    //       'label': 'Discount/Premium %',
    //       'content': ''
    //     },
    //     {
    //       'label': 'Onsite MM',
    //       'content': ''
    //     },
    //     {
    //       'label': 'Offshore MM',
    //       'content': ''
    //     },
    //     {
    //       'label': 'Onsite MM - Contingency',
    //       'content': ''
    //     },
    //     {
    //       'label': 'Offshore MM - Contingency',
    //       'content': ''
    //     },
    //     {
    //       'label': 'Onsite cost in INR',
    //       'content': ''
    //     },
    //     {
    //       'label': 'Offshore cost in INR',
    //       'content': ''
    //     },
    //     {
    //       'label': 'Onsite rate',
    //       'content': ''
    //     },
    //     {
    //       'label': 'Offshore rate',
    //       'content': ''
    //     },
    //     {
    //       'label': 'Service pass thru - Cost & revenue',
    //       'content': ''
    //     },
    //     {
    //       'label': 'Product pass thru - Cost & revenue',
    //       'content': ''
    //     },
    //     {
    //       'label': 'Other costs',
    //       'content': ''
    //     },
    //     {
    //       'label': 'Documentation type',
    //       'content': ''
    //     },
    //     {
    //       'label': 'SOW auth slip',
    //       'content': ''
    //     },
    //     {
    //       'label': 'No of documents',
    //       'content': ''
    //     },
    //     {
    //       'label': 'Approval doc',
    //       'content': ''
    //     },
    //     {
    //       'label': 'Pricing rework',
    //       'content': ''
    //     },
    //   ]
    // },
    {
      'title': 'Account details', 'content': [
        {
          'label': 'Name',
          'content': '',
        },
        {
          'label': 'Owner',
          'content': ''
        },
        {
          'label': 'Vertical',
          'content': ''
        },
        {
          'label': 'Geo',
          'content': ''
        },
      ]
    }
  ]
  // Order tab accordians ends


  showContent(index) {
    this.accordianContent[index].hideContent = false;
  }

  accordians: {}[] = [
    {
      'title': 'Overview'
    },
    {
      'title': 'Toolkit'
    },
    {
      'title': 'Deal Qualifier'
    },
    {
      'title': 'Delivery Team'
    },
    {
      'title': 'POA Holders'
    },
  ]

  accContents: {}[] = [
    {
      'label': 'Opportunity name',
      'content': 'Reimagine Singtel Process'
    },
    {
      'label': 'Opportunity ID',
      'content': 'OPP000135096'
    },
    {
      'label': 'Opportunity owner',
      'content': 'Ranjith Ravi'
    },
    {
      'label': 'Account name',
      'content': 'Singtel'
    },
    {
      'label': 'Vertical',
      'content': 'Utilities'
    },
    {
      'label': 'Sub-Vertical',
      'content': 'Customer care'
    },
    {
      'label': 'Stage',
      'content': 'Qualify'
    },
    {
      'label': 'Est.closure date',
      'content': '21-Dec-2019',

    },
    {
      'label': 'TCV($)',
      'content': '$ 22 Mn'
    },
    {
      'label': 'ACV($)',
      'content': '$ 10 Mn'
    },
    {
      'label': 'TCV in Plan Forex($)',
      'content': '$ 22 Mn'
    },
    {
      'label': 'ACV in Plan Forex($)',
      'content': '$ 10 Mn'
    },
    {
      'label': 'TCV in Dynamic Forex($)',
      'content': 'Not Mentioned'
    },
    {
      'label': 'ACV in Dynamic Forex($)',
      'content': 'Not Mentioned'
    },
    {
      'label': 'Type',
      'content': 'New'
    },
    {
      'label': 'Win predictor probability(%)',
      'content': 'N/A'
    },
    {
      'label': 'StormCast score',
      'content': 'Not Mentioned'
    },
    {
      'label': 'Manual probility',
      'content': '100',

    },
    {
      'label': 'RS qualifier status',
      'content': 'Not Mentioned'
    },
    {
      'label': 'Forecast',
      'content': 'Not Mentioned'
    },
    {
      'label': 'CRM reference number',
      'content': '7127767'
    },
    {
      'label': 'Status',
      'content': 'Active'
    },
    {
      'label': 'Created date',
      'content': '10-Jun-2019'
    },


  ]

  toolkitPopUp(type, message) {
    var opportunityId = this.OpportunityServices.getSession('opportunityId');
    var loggedInUser = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
    var Status = 0
    const dialogRef = this.dialog.open(confirmPopUp,
      {
        width: '450px',
        data: message

      });
    dialogRef.afterClosed().subscribe(result => {

      if (type == 'storm' && result == 'yes') {
        window.open(this.envr.toolkitUrl + 'RevenueStorm/Pages/OppProfilerPage.aspx?id=' + opportunityId + '&ptype=2&userid=' + loggedInUser + '&status=' + Status, 'StormTrackerSuite', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,height=' + screen.height + ',width=' + screen.width + ',top=0,left=0');
        return;
      }
      else if (type == 'relationship' && result == 'yes') {
        window.open(this.envr.toolkitUrl + 'RevenueStorm/Pages/ContactTaggingPage.aspx?id=' + opportunityId + '&ptype=1&userid=' + loggedInUser + '&status=' + Status, 'RelationshipSuite', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,height=' + screen.height + ',width=' + screen.width + ',top=0,left=0');
        return;
      }


      else {

      }

    });


  }
  accountNamee = ''
  toolkitClick(action) {


    if (action == 'Account name') {

      const accountcontacts = {
        'Name': this.accountNamee,
        'SysGuid': this.projectService.getSession('accountid'),
        'isProspect': false,
        'accType': ''
      };

      const temp = this.EncrDecr.set('EncryptionEncryptionEncryptionEn', JSON.stringify(accountcontacts), 'DecryptionDecrip');
      localStorage.setItem('accType', '');
      localStorage.setItem('selAccountObj', temp);
      sessionStorage.setItem('selAccountObj', temp);
      this.service.setSideBarData('1');
      this.accountListService.setSession('routeParams', { 'route_from': 'acc_req', 'Id': this.projectService.getSession('accountid') });
      this.isLoading = true;
      this.router.navigate(['/accounts/accountdetails']);
      return;

    }
    else if (action == 'Win/Loss reasons') {


      if (this.projectService.getSession('statusCode') == '3') {
        this.router.navigate(['/opportunity/opportunityview/closereason']);
      }
      else if (this.projectService.getSession('statusCode') == '184450000') {
        this.router.navigate(['/opportunity/opportunityview/lossreasons']);
      }
    }
    else {
      var opportunityId = this.OpportunityServices.getSession('opportunityId');
      var loggedInUser = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
      var Status = 0




      switch (action) {

        case 'Stormtracker suite':
          {
            if (Number(this.toolkitArray[0].RSISEnabled) == 0) {
              this.projectService.displayMessageerror('Revenue Storm is recommended for deals greater than or equal to $10M');
            }
            else if (Number(this.toolkitArray[0].RSISEnabled) == 2) {
              this.toolkitPopUp('storm', 'Revenue Storm tools can help you in maximizing your chances for winning the deal. Please leverage them for all key deals in your pipeline. It is mandatory to use Revenue Storm tools for deals USD 10M and above to enable quality reviews of the deal pursuit.');

            }
            else {
              window.open(this.envr.toolkitUrl + 'RevenueStorm/Pages/OppProfilerPage.aspx?id=' + opportunityId + '&ptype=2&userid=' + loggedInUser + '&status=' + Status, 'StormTrackerSuite', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,height=' + screen.height + ',width=' + screen.width + ',top=0,left=0');
            }
            return;
          }
        case 'Relationship Suite':
          {
            if (Number(this.toolkitArray[0].RSISEnabled) == 0) {
              this.projectService.displayMessageerror('Revenue Storm is recommended for deals greater than or equal to $10M');
            }

            else if (Number(this.toolkitArray[0].RSISEnabled) == 2) {
              this.toolkitPopUp('relationship', 'Revenue Storm tools can help you in maximizing your chances for winning the deal. Please leverage them for all key deals in your pipeline. It is mandatory to use Revenue Storm tools for deals USD 10M and above to enable quality reviews of the deal pursuit.');
            }
            else {
              window.open(this.envr.toolkitUrl + 'RevenueStorm/Pages/ContactTaggingPage.aspx?id=' + opportunityId + '&ptype=1&userid=' + loggedInUser + '&status=' + Status, 'RelationshipSuite', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,height=' + screen.height + ',width=' + screen.width + ',top=0,left=0');
            }
            return;
          }
        case 'Management log':
          {
            window.open(this.envr.toolkitUrl + 'OpportunityReviewLog/Pages/Index.html?id=' + opportunityId + '&ptype=4&userid=' + loggedInUser + '&status=' + Status, 'OpportunityReviewLog', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,height=' + screen.height + ',width=' + screen.width + ',top=0,left=0');
            return;
          }

        case 'Win strategy':
          {

            window.open(this.envr.toolkitUrl + 'WinStrategy/Pages/buyingCriteriaPage.aspx?id=' + opportunityId + '&ptype=4&userid=' + loggedInUser + '&status=' + Status, 'WinStrategy', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,height=' + screen.height + ',width=' + screen.width + ',top=0,left=0');
            return;
          }
        case 'Competitor strategy':
          {

            window.open(this.envr.toolkitUrl + 'CompetitorStrategyTool/OMCompetitorGrid.aspx?id=' + opportunityId + '&ptype=4&currUser=' + loggedInUser + '&status=' + Status, 'CompetitorStrategy', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,height=' + screen.height + ',width=' + screen.width + ',top=0,left=0');

            return;
          }

        case 'RAID log':
          {
            window.open(this.envr.toolkitUrl + 'RAID_Log/Pages/AddNewEntry.aspx?id=' + opportunityId + '&ptype=1&status=0&userid=' + loggedInUser + '&v=' + Math.random(), 'RAIDLog', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,height=' + screen.height + ',width=' + screen.width + ',top=0,left=0');
            return;
          }
      }
    }
  }
  orderpageenabled: boolean = false;
  // close stage confirm popup for integrated deal code
  integratedDealPopup() {
    const dialogRef = this.dialog.open(integratedDealPopup,
      {
        width: '350px',
        data: {
          message: "Please ensure the related Appirio deal is marked as WON in Appirio SFDC after which the TraCE integrated deal can be closed as WON. Please get the same updated by your Appirio counterpart or You can connect with Sales ops teams of Appirio at salesops@appirio.com for any further support required on ACS line items."
        }

      });
  }
  reviewPendingPopup(){
    const dialogRef = this.dialog.open(integratedDealPopup,
      {
        width: '350px',
        data: {
          message: "Delivery assurance review and approval of opportunity is pending. Please have the required approval to proceed with opportunity closure.”"
        }

      });
  }
  // close stage confirm popup for integrated deal code end
  openModal(data) {
    debugger;
    window.scroll(0, 0);
    console.log("dirtyflag comp", this.service.dirtyflag);
    if (this.service.dirtyflag) {

      this.openConfirmPopup();
      let dialogData = this.getNotification().subscribe(res => {

        if (res.text == true) {
          dialogData.unsubscribe();
          this.service.dirtyflag = false;
          switch (data) {
            case 'Create': {
              let dialogRef = this.dialog.open(ProceedtoQualifypopup, {
                width: '396px'
              });
              this.checkCurrentUrl();
              dialogRef.afterClosed().subscribe(result => {
                this.projectService.ProceedQualify = result;
                this.projectService.CallOverviewPageToValidateForm();
              });
              return;

            }
            case 'Qualify': {

              let dialogRef = this.dialog.open(Pursuitpopup, {
                width: '396px'

              });
              //this.router.navigate(['/opportunity/opportunityview/overview']);
              this.checkCurrentUrl();
              dialogRef.afterClosed().subscribe(result => {
                this.projectService.ProceedQualify = result;
                this.projectService.CallOverviewPageToValidateForm();
              });
              return;

            }
            case 'Pursuit': {
              if (this.IsSimpleDeal && this.isIntegratedDeal && !this.isWonHardClosed) {
                this.integratedDealPopup();
              }
              else {
                let dialogRef = this.dialog.open(securedealpopup, {
                  width: '396px'

                });
                //this.router.navigate(['/opportunity/opportunityview/overview']);
                this.checkCurrentUrl();
                dialogRef.afterClosed().subscribe(result => {
                  this.projectService.ProceedQualify = result;
                  this.projectService.CallOverviewPageToValidateForm();
                });
              }
              return;

            }

            case 'Nuture': {
              this.dialog.open(proceedwithoutnurturepopup,
                {
                  width: '450px',
                });
              return;
            }

            case 'Secure': {
            debugger;
             let proposalConditionCheck=this.projectService.getSession('proposalTypeCheck');
             let DaSpocApprovalFlag=this.projectService.getSession('IsDaApprovalFlag');
             let tcvValue=this.projectService.getSession('tcvValue');
              if (this.isIntegratedDeal && !this.isWonHardClosed) {
                this.integratedDealPopup();
              }
              else if(!this.IsNonWT && proposalConditionCheck && tcvValue >=5000000 && !DaSpocApprovalFlag ){
               this.reviewPendingPopup();
              }
              else {
                if (this.orderwillshow == false) {
                  this.projectService.ordershow = true;
                  this.closewithoutorder();

                }
                else {
                  this.projectService.ordershow = false;
                  this.getOppDetails();
                }
              }
              return;
            }
          }
        }//end of if for res true
        else {
          dialogData.unsubscribe();
        }
      });//end of dialogData
    }
    else {
      switch (data) {
        case 'Create': {

          let dialogRef = this.dialog.open(ProceedtoQualifypopup, {
            width: '396px'

          });
          //this.router.navigate(['/opportunity/opportunityview/overview']);
          this.checkCurrentUrl();
          dialogRef.afterClosed().subscribe(result => {
            this.projectService.ProceedQualify = result;

            this.projectService.CallOverviewPageToValidateForm();
          });
          return;
        }
        case 'Qualify': {

          let dialogRef = this.dialog.open(Pursuitpopup, {
            width: '396px'

          });
          //this.router.navigate(['/opportunity/opportunityview/overview']);
          this.checkCurrentUrl();
          dialogRef.afterClosed().subscribe(result => {
            this.projectService.ProceedQualify = result;
            this.projectService.CallOverviewPageToValidateForm();
          });
          return;

        }
        case 'Pursuit': {
          if (this.IsSimpleDeal && this.isIntegratedDeal && !this.isWonHardClosed) {
            this.integratedDealPopup();
          }
          else {
            let dialogRef = this.dialog.open(securedealpopup, {
              width: '396px'

            });
            //this.router.navigate(['/opportunity/opportunityview/overview']);
            this.checkCurrentUrl();
            dialogRef.afterClosed().subscribe(result => {
              this.projectService.ProceedQualify = result;
              this.projectService.CallOverviewPageToValidateForm();

            });
          }
          return;

        }

        case 'Nuture': {
          this.dialog.open(proceedwithoutnurturepopup,
            {
              width: '450px',
            });
          return;
        }

        case 'Secure': {
          debugger;
          let proposalConditionCheck=this.projectService.getSession('proposalTypeCheck');
          let tcvValue=this.projectService.getSession('tcvValue');
          let DaSpocApprovalFlag=this.projectService.getSession('IsDaApprovalFlag');
          // this.reviewPendingPopup();
          if (this.isIntegratedDeal && !this.isWonHardClosed) {
            this.integratedDealPopup();
          }
          else if(!this.IsNonWT && proposalConditionCheck && tcvValue >=5000000 && !DaSpocApprovalFlag ){
               this.reviewPendingPopup();
              }
          else {
            if (this.orderwillshow == false) {
              this.projectService.ordershow = true;
              this.closewithoutorder();
            }
            else {
              this.projectService.ordershow = false;
              this.getOppDetails();

            }
          }
          return;
        }
      }
    }   //end of else
  }

  // navigateToOrder() {
  //   ;
  //   this.projectService.getNavigateToOrder().subscribe((checkProceedToClose: any) => {
  //     if (checkProceedToClose.navigateToOrder) {
  //       this.orderTrue = true;
  //       this.router.navigate(['/opportunity/opportunityview/order']);
  //       this.getReasonStatus();
  //     } else {
  //       this.orderTrue = false;
  //     }
  //   });
  // }

  // proceedToClose() {
  //   this.getOppDetails();
  // }

  getReasonStatus() {
    const status = this.projectService.getSession('statusCode');
    this.reasonStatus = status === '1' ? true : false;
    // this.reasonStatus = false;
    //this.reasonStatus = status === '1' ? true : false;
    // this.reasonStatus = false;

  }
  // saveClose = false;
  closewithoutorder() {
    // confirm("proceed to close");

    const dialogRef = this.dialog.open(ContractExecutionComponent, {
      width: '550px',
      data: {

        closeWithoutOrder: true
      }

    });
    //this.router.navigate(['/opportunity/opportunityview/overview']);
    this.checkCurrentUrl();
    dialogRef.afterClosed().subscribe(conExec => {
      if (conExec == 'navigateToBSP') {
        this.router.navigate(['/opportunity/opportunityview/businesssolution']);
        return;
      }
      this.projectService.ProceedQualify = conExec;
      if (this.projectService.ProceedQualify == true) {
        this.projectService.CallOverviewPageToValidateForm();
        //this.router.navigate(['/opportunity/opportunityview/overview']);
        this.checkCurrentUrl();
        this.projectService.restTab = true;
        this.projectService.initiateObButton = false;

      } else {
        this.projectService.CallOverviewPageToValidateForm();
        //this.router.navigate(['/opportunity/opportunityview/overview']);
        this.checkCurrentUrl();
        this.projectService.restTab = false;
        this.projectService.initiateObButton = false;
      }
    });

  }
  getOppDetails() {
    // const payload = {
    //   OppId: this.projectService.getSession('opportunityId')
    // };
    const payload = {
      OrderOrOpportunityId: this.projectService.getSession('opportunityId'),
      IsOrderCheckNonBPO: false
    }
    this.OrderService.getWTstatus(payload).subscribe((res: any) => {
      let isWt = res.ResponseObject && res.ResponseObject.length > 0 ? res.ResponseObject[0].IsWT : false;
      const contractPayload = {
        Guid: this.projectService.getSession('opportunityId')
      };
      if (isWt) {

        this.OrderService.getOpportunityContractDetails(contractPayload).subscribe((opp: any) => {
          console.log(opp);
          if (opp && opp.ResponseObject) {
            if (opp.ResponseObject.CanProceedToClose) {
              if (opp.ResponseObject.Wipro_PricingId) {
                const dialogRef = this.dialog.open(ContractExecutionComponent, {
                  width: '550px',
                  data: {
                    closeWithoutOrder: this.projectService.ordershow
                  }
                });
                //this.router.navigate(['/opportunity/opportunityview/overview']);
                this.checkCurrentUrl();
                dialogRef.afterClosed().subscribe(conExec => {
                  if (conExec == 'navigateToBSP') {
                    this.router.navigate(['/opportunity/opportunityview/businesssolution']);
                    return;
                  }
                  this.projectService.ProceedQualify = conExec;
                  if (this.projectService.ProceedQualify == true) {
                    this.projectService.CallOverviewPageToValidateForm();
                    //this.router.navigate(['/opportunity/opportunityview/overview']);
                    this.checkCurrentUrl();
                    this.projectService.restTab = true;
                    this.projectService.initiateObButton = true;

                  } else {
                    this.projectService.CallOverviewPageToValidateForm();

                    //this.router.navigate(['/opportunity/opportunityview/overview']);
                    this.checkCurrentUrl();

                    this.projectService.restTab = false;
                    this.projectService.initiateObButton = false;
                  }
                });
              } else {
                const dialogRef = this.dialog.open(securedealpopup, {
                  width: '350px',
                  data: { pricingIdAvail: false }
                });
              }
            } else {
              this.projectService.displayMessageerror("Please ensure that the base order of this residual opportunity is Approved by BFM before creating an order here.");
            }
          } else {
            this.projectService.displayMessageerror("Oops!!! An error occured. Please try again later");
          }

        });
      } else {
        this.OrderService.getOpportunityContractDetails(contractPayload).subscribe((opp: any) => {
          if (opp && opp.ResponseObject) {
            if (opp.ResponseObject.CanProceedToClose) {
              const dialogRef = this.dialog.open(ContractExecutionComponent, {
                width: '550px',
                data: {
                  closeWithoutOrder: this.projectService.ordershow
                }
              });
              //this.router.navigate(['/opportunity/opportunityview/overview']);
              this.checkCurrentUrl();
              dialogRef.afterClosed().subscribe(conExec => {
                if (conExec == 'navigateToBSP') {
                  this.router.navigate(['/opportunity/opportunityview/businesssolution']);
                  return;
                }
                this.projectService.ProceedQualify = conExec;
                if (this.projectService.ProceedQualify == true) {
                  this.projectService.CallOverviewPageToValidateForm();
                  //this.router.navigate(['/opportunity/opportunityview/overview']);
                  this.checkCurrentUrl();
                  this.projectService.restTab = true;
                  this.projectService.initiateObButton = true;

                } else {
                  this.projectService.CallOverviewPageToValidateForm();
                  //this.router.navigate(['/opportunity/opportunityview/overview']);
                  this.checkCurrentUrl();
                  this.projectService.restTab = false;
                  this.projectService.initiateObButton = false;
                }
              });
            } else {
              this.projectService.displayMessageerror("Please ensure that the base order of this residual opportunity is Approved by BFM before creating an order here.");
            }
          } else {
            this.projectService.displayMessageerror("Oops!!! An error occured. Please try again later");
          }
        });


      }
    });
  }



  nextstepbtn() {
    // this.overview= true;

    if (this.router.url === '/opportunity/opportunityview/overview' && (this.projectService.ProceedQualify == true || this.projectService.count == 0) && this.projectService.count < 5) {
      this.projectService.currentState = this.steps[this.projectService.count].id;
      this.service.onSave();
    }
    else if (((this.router.url === '/opportunity/opportunityview/order' || this.router.url === '/order/orderdetails/order') && (this.projectService.ProceedQualify == true || this.projectService.count == 0) && this.projectService.count < 5)) {

      this.projectService.currentState = this.steps[this.projectService.count].id;
      this.service.onSave();

    }
    else {
      this.service.onSave();


    }
  }


  //modifysaurav
  modifyOrder() {
    let createdDate: any = new Date(this.CreatedOn);
    let ApprovedByBfmDate: any = new Date(this.ApprovedDate);
    let OrderModificationCutOffDay: any = this.OrderModificationCutOffDay;
    if (this.ApprovalStage == OrderApprovalStage.ApprovedbyBFM && createdDate && ApprovedByBfmDate && OrderModificationCutOffDay) {
      let month: any = createdDate.getMonth() + 1;
      let year: any = createdDate.getFullYear();
      let cutoffDate: any = "";
      let currentDate: any = new Date();
      let ValidDate: any = "";
      if ((month == 1) || (month == 2) || (month == 3)) {
        cutoffDate = new Date(year, 3, OrderModificationCutOffDay);
        ValidDate = ApprovedByBfmDate <= cutoffDate ? new Date(year, 4, 0) : new Date(year, 7, 0)
      } else if ((month == 4) || (month == 5) || (month == 6)) {
        cutoffDate = new Date(year, 6, OrderModificationCutOffDay);
        ValidDate = ApprovedByBfmDate <= cutoffDate ? new Date(year, 7, 0) : new Date(year, 10, 0)
      } else if ((month == 7) || (month == 8) || (month == 9)) {
        cutoffDate = new Date(year, 9, OrderModificationCutOffDay);
        ValidDate = ApprovedByBfmDate <= cutoffDate ? new Date(year, 10, 0) : new Date(year, 13, 0)
      } else if ((month == 10) || (month == 11) || (month == 12)) {
        cutoffDate = new Date(year, 12, OrderModificationCutOffDay);
        ValidDate = ApprovedByBfmDate <= cutoffDate ? new Date(year, 13, 0) : new Date(year, 16, 0)
      }

      if (currentDate <= ValidDate) {
        this.modify = true;
      } else {
        this.modify = false;
      }
    } else {
      this.modify = false;
    }


  }





  //saurav hard close 

  hardCloseButton() {

    const hardclosePayload = {
      OpportunityId: this.projectService.getSession('opportunityId'),// Opportunity id
      HardCloseDate: this.currentDate,// User action date
      HardCloseBy: this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),//Logged in user
      // "OpportunityId": "c3825f1b-1923-ea11-a83c-000d3aa058cb", // Opportunity id
      // "HardCloseDate": "2019-12-25T18:30:00.000Z", // User action date
      // "HardCloseBy": "8a6efd91-e45c-e911-a830-000d3aa058cb" //Logged in user
    }
    console.log("hardclosePayload", hardclosePayload);
    this.OrderService.HardCloseOpp(hardclosePayload).subscribe((res: any) => {

      this.closureDetails()
      this.projectService.displayMessageerror("Opportunity is Hard closed succesfully");
    });
    this.disableHardClose = true;
  }




  superCentralMarketingManagerRole = false;

  tabchangePage(tab?) {
debugger;
    console.log(tab, "tabname")
    let userGuid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
    if (this.IsAppirioFlag) {
      this.savebuton = false;
      this.addAlliance = false;
      this.addIp = false;
      this.addNewAge = false;
      this.addService = false;
      this.accessRight = false;
    }
    else {
      if (this.projectService.getSession('IsAmendment') == false) {

        this.superCentralMarketingManagerRole = false;
        this.opportunityStatus = this.projectService.getSession('opportunityStatus');
        this.currentstagestate = this.projectService.getSession('currentState');
        console.log("this.currentstagestate", this.currentstagestate);
        this.opportunityName = this.projectService.getSession('opportunityName');

        this.accessData1 = this.projectService.getSession('roleObj') || {};
        console.log(this.accessData1, "this.accessData1");
        this.projectService.setSession('compTeam', this.accessData1);
        this.fullAccess1 = this.projectService.getSession('FullAccess');

        if (this.roleObj && Object.keys(this.roleObj).length > 0 && !this.projectService.getSession('FullAccess')) {
          this.superCentralMarketingManagerRole = !this.roleObj.UserRoles ? false : this.roleObj.UserRoles.IsSuperCentralMarketingManagerRole ? true : false;
          console.log("this.roleObj : ", this.roleObj);
          console.log(this.superCentralMarketingManagerRole, "this.superCentralMarketingManagerRole")
        }

        //this.superCentralMarketingManagerRole = this.accessData1.UserRoles.IsSuperCentralMarketingManagerRole;
        //  console.log(this.accessData1);
        // console.log(this.accessData1.UserRoles.IsSuperCentralMarketingManagerRole);

        if (this.projectService.restTab) {
          if ((((((tab === 'order' || tab === 'overview' || tab === 'influencer' || tab === 'competitor' || tab === 'solution' || tab === 'team'))))))
          // if(this.router.url === '/opportunity/opportunityview/order' || this.router.url === '/opportunity/opportunityview/lossreasons' || this.router.url === '/opportunity/opportunityview/reasons')
          {
            this.savebuton = true;
            this.addAlliance = false;
            this.addIp = false;
            this.addNewAge = false;
            this.addService = false;
          }
          else {
            this.savebuton = false;
            this.addAlliance = false;
            this.addIp = false;
            this.addNewAge = false;
            this.addService = false;
          }

        }
        else {

          if ((this.opportunityStatus.toString() == '1' && ((this.currentstagestate).toString() !== "184450004"))) {
            if (this.fullAccess1 == true) {
              this.fullAccess = true;
              this.addAlliance = false;
              this.addIp = false;
              this.addNewAge = false;
              this.addService = false;
              this.accessRight = true;
              this.savebuton = true;
            }
            else {
              if (this.accessData1) {
                if (this.accessData1.FullAccess == true) {
                  this.fullAccess = true;
                  this.addAlliance = false;
                  this.addIp = false;
                  this.addNewAge = false;
                  this.addService = false;
                  this.accessRight = true;
                  this.savebuton = true;
                }
                else {
                  if (this.accessData1.PartialAccess == true && this.accessData1.FullAccess == false) {
                    if (this.projectService.getSession('currentState').toString() == "184450003" || this.isSimpleOpportunity == true) {
                      this.accessRight = false;
                      this.savebuton = true;
                      this.addAlliance = false;
                      this.addIp = false;
                      this.addNewAge = false;
                      this.addService = false;
                    }
                    else {
                      this.accessRight = true;
                      this.savebuton = true;
                      this.addAlliance = false;
                      this.addIp = false;
                      this.addNewAge = false;
                      this.addService = false;
                    }
                  }
                  else {
                    if (this.accessData1.AddAlliance == true) {
                      this.addAlliance = true;
                      this.savebuton = false;
                      this.accessRight = false;
                    }
                    if (this.accessData1.AddIP == true) {
                      this.addIp = true;
                      this.savebuton = false;
                      this.accessRight = false;
                    }
                    if (this.accessData1.AddNewAgeBusiness == true) {
                      this.addNewAge = true;
                      this.savebuton = false;
                      this.accessRight = false;
                    }
                    if (this.accessData1.AddServiceLine == true) {
                      this.addService = true;
                      this.savebuton = false;
                      this.accessRight = false;
                    }
                    if (((tab === 'team') && this.accessData1.IsTeamBuilderSection == true && this.accessData1.IsGainAccess == true) || ((tab === 'overview') && (this.accessData1.UserRoles.IsAdvisorFunction == true)) || ((tab === 'influencer') && (this.superCentralMarketingManagerRole == true))) {
                      this.savebuton = true;
                      this.accessRight = false;
                    }
                    else {
                      this.savebuton = false;
                      this.accessRight = false;
                    }
                    if((tab === 'overview') && (userGuid == this.projectService.getSession('DaSpocId'))){
                      this.savebuton = true;
                    }
                    else{
                      this.savebuton = false;
                    }


                  }
                }

              }
            }
          }
          //     }
          //  }
          else if (((this.opportunityStatus.toString() == '1' || this.opportunityStatus.toString() == '3') && ((this.currentstagestate).toString() == "184450004"))) {
            if ((tab === 'order' || tab === 'lossreasons' || tab === 'reasons'))
            // if(this.router.url === '/opportunity/opportunityview/order' || this.router.url === '/opportunity/opportunityview/lossreasons' || this.router.url === '/opportunity/opportunityview/reasons')
            {
              if (tab === 'reasons' && this.opportunityStatus.toString() == '3' && (this.proposaltypeCheck == "184450003" ||  this.pricingInvolved == false  || this.proposaltypeCheck == "184450001")) {
                this.addAlliance = false;
                this.addIp = false;
                this.addNewAge = false;
                this.addService = false;
                this.savebuton = true;
              }
              else {
                this.orderrolebaseapi(false, tab);
              }



              // this.orderrolebaseapi();

            }
            else {
              this.addAlliance = false;
              this.addIp = false;
              this.savebuton = false;
              this.addNewAge = false;
              this.addService = false;
              this.accessRight = false;
            }
          }

          else if (this.opportunityStatus.toString() == '5' || this.opportunityStatus.toString() == '184450000') {
            if ((tab === 'lossreasons'))
            // if(this.router.url === '/opportunity/opportunityview/order' || this.router.url === '/opportunity/opportunityview/lossreasons' || this.router.url === '/opportunity/opportunityview/reasons')
            {
              this.addAlliance = false;
              this.addIp = false;
              this.savebuton = true;
              this.addNewAge = false;
              this.addService = false;
              this.accessRight = false;

            }
            else {
              this.addAlliance = false;
              this.addIp = false;
              this.savebuton = false;
              this.addNewAge = false;
              this.addService = false;
              this.accessRight = false;
            }
          }
          else {
            this.fullAccess = false;
            this.addAlliance = false;
            this.addIp = false;
            this.savebuton = false;
            this.addNewAge = false;
            this.addService = false;
            this.accessRight = false;
          }
        }
      }
      else {

        //this.GetSessionDetails(true);
        this.tabchangePage1(tab)
      }
    }
  }


  changeTab(tab) {

    if (this.service.Summary_window && tab != 'contracts') {
      this.service.Summary_window = false;
    }
    if (tab === 'order') {
      if (this.router.url === '/opportunity/opportunityview/order') {
        this.opportunityTab = false;
        console.log("checksau", this.opportunityTab)
        this.projectService.setSession('opportunityTab', this.opportunityTab);
      }
    }
    else if (tab != 'order') {
      this.opportunityTab = true;
    }

    switch (tab) {
      case 'overview':
        if (this.service.dirtyflag) {
          this.openConfirmPopup();
          let dialogData = this.getNotification().subscribe(res => {

            if (res.text == true) {
              this.tabchangePage(tab);
              this.router.navigate(['/opportunity/opportunityview/overview']);
              dialogData.unsubscribe();
            }
            else {
              dialogData.unsubscribe();
            }
          });
        }
        else {
          this.tabchangePage(tab);
          this.router.navigate(['/opportunity/opportunityview/overview']);
        }


        return;
      case 'solution':
        // [routerLink]="['businesssolution']" '/order/orderdetails/businesssolution'
        if (this.service.dirtyflag) {
          this.openConfirmPopup();
          let dialogData = this.getNotification().subscribe(res => {

            if (res.text == true) {
              this.tabchangePage(tab);
              this.router.navigate(['/opportunity/opportunityview/businesssolution']);
              dialogData.unsubscribe();
            }
            else {
              dialogData.unsubscribe();
            }
          });
        }
        else {
          this.tabchangePage(tab);
          this.router.navigate(['/opportunity/opportunityview/businesssolution']);
        }

        return;
      case 'team':
        // [routerLink]="['team']"
        if (this.service.dirtyflag) {
          this.openConfirmPopup();
          let dialogData = this.getNotification().subscribe(res => {

            if (res.text == true) {
              this.tabchangePage(tab);
              this.router.navigate(['/opportunity/opportunityview/team']);
              dialogData.unsubscribe();
              // this.accessData1.IsTeamBuilderSection == true
              // if(this.accessData1.IsTeamBuilderSection == true){
              //   this.savebuton=true;
              // }
            }
            else {
              dialogData.unsubscribe();
            }
          });
        }
        else {
          this.tabchangePage(tab);
          this.router.navigate(['/opportunity/opportunityview/team']);
        }

        return;
      case 'competitor':
        // [routerLink]="['competitor']"
        if (this.service.dirtyflag) {
          this.openConfirmPopup();
          let dialogData = this.getNotification().subscribe(res => {

            if (res.text == true) {
              this.tabchangePage(tab);
              this.router.navigate(['/opportunity/opportunityview/competitor']);
              dialogData.unsubscribe();
            }
            else {
              dialogData.unsubscribe();
            }
          });
        }
        else {
          this.tabchangePage(tab);
          this.router.navigate(['/opportunity/opportunityview/competitor']);
        }

        return;
      case 'influencer':

        if (this.service.dirtyflag) {
          this.openConfirmPopup();
          let dialogData = this.getNotification().subscribe(res => {

            if (res.text == true) {
              this.tabchangePage(tab);
              this.router.navigate(['/opportunity/opportunityview/deal']);


              dialogData.unsubscribe();
            }
            else {
              dialogData.unsubscribe();
            }
          });
        }
        else {
          this.tabchangePage(tab);
          this.router.navigate(['/opportunity/opportunityview/deal']);

        }

        return;
      case 'contracts':
        // [routerLink]="['contracts']"
        // if (this.service.dirtyflag) {
        //   this.openConfirmPopup();
        //   let dialogData = this.getNotification().subscribe(res => {
        //
        //     if (res.text == true) {
        //       this.router.navigate(['/opportunity/opportunityview/contracts']);
        //       dialogData.unsubscribe();
        //     }
        //     else {
        //       dialogData.unsubscribe();
        //     }
        //   });
        // }
        // else {
        //   this.router.navigate(['/opportunity/opportunityview/contracts']);
        // }
        const icertisUrl = this.envr.authConfig.url;
        let oppId = this.projectService.getSession('opportunityId');
        let userGuid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
        if(this.projectService.ordercreatesuccess == true || this.projectService.ordercreatesuccess1 == true ){
            let url = icertisUrl + "/WebResources/icm_ContractListings.html?Data=entity%3Dsalesorder%26accountid%3D" + this.orderbookingId  +
          "%26OrderId%3D" + this.orderbookingId + "%26record_Name%3D" + this.OrderNumber + "%26OppId%3D" + oppId + "%26userid%3D" +
      this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip') + "%26app%3Dsalesportal%26navurl%3Dorder"
        window.open(url, "_blank");
        } 

        else
        {

        let url = icertisUrl + "/WebResources/icm_ContractListings.html?Data=entity%3Dopportunity%26accountid%3D" + oppId +
          "%26OppId%3D" + oppId + "%26userid%3D" + userGuid + "%26app%3Dsalesportal%26navurl%3Dopportunity"
        window.open(url, "_blank");

        }
        return;
      case 'order':
        // [routerLink]="['order']"
        if (this.service.dirtyflag) {
          this.openConfirmPopup();
          let dialogData = this.getNotification().subscribe(res => {

            if (res.text == true) {
              this.tabchangePage(tab);
              this.router.navigate(['/opportunity/opportunityview/order']);
              dialogData.unsubscribe();
            }
            else {
              dialogData.unsubscribe();
            }
          });
        }
        else {
          this.tabchangePage(tab);
          this.router.navigate(['/opportunity/opportunityview/order']);
        }

        return;

      case 'orderReview':
        // [routerLink]="['order']"
        if (this.service.dirtyflag) {
          this.openConfirmPopup();
          let dialogData = this.getNotification().subscribe(res => {

            if (res.text == true) {
              this.tabchangePage(tab);
              this.router.navigate(['/opportunity/opportunityview/userdeclarations']);
              dialogData.unsubscribe();
            }
            else {
              dialogData.unsubscribe();
            }
          });
        }
        else {
          this.tabchangePage(tab);
          this.router.navigate(['/opportunity/opportunityview/userdeclarations']);
        }

        return;
      case 'reasons':
        // [routerLink]="['closereason']"
        if (this.service.dirtyflag) {
          this.openConfirmPopup();
          let dialogData = this.getNotification().subscribe(res => {

            if (res.text == true) {
              this.tabchangePage(tab);
              this.router.navigate(['/opportunity/opportunityview/closereason']);
              dialogData.unsubscribe();
            }
            else {
              dialogData.unsubscribe();
            }
          });
        }
        else {
          this.tabchangePage(tab);
          this.router.navigate(['/opportunity/opportunityview/closereason']);
        }

        return;
      case 'lossreasons':
        // [routerLink]="['closereason']"
        if (this.service.dirtyflag) {
          this.openConfirmPopup();
          let dialogData = this.getNotification().subscribe(res => {

            if (res.text == true) {
              this.tabchangePage(tab);
              this.router.navigate(['/opportunity/opportunityview/lossreasons']);
              dialogData.unsubscribe();
            }
            else {
              dialogData.unsubscribe();
            }
          });
        }
        else {
          this.tabchangePage(tab);
          this.router.navigate(['/opportunity/opportunityview/lossreasons']);
        }

        return;
    }
  }

  private subject = new Subject<any>();
  sendNotification(status: string) {
    this.subject.next({ text: status });
  }
  getNotification(): Observable<any> {
    return this.subject.asObservable();
  }


  openConfirmPopup() {
    let dialog = this.dialog.open(ConfirmSaveComponent, {
      width: '396px'
    });

    const sub = dialog.componentInstance.onAdd.subscribe((data) => {
      this.sendNotification(data);
    });

    dialog.afterClosed().subscribe((result) => {
      //console.log('result from confirm popup', result);
      // this.result = result;
      sub.unsubscribe();
    });

  }

  stepperfn(id: any) {
    if (id === '184450004') return true;
    else if (this.isSimpleOpportunity == true) {
      if (id === '184450000') return true;
      else if (id === '184450001') return true;
      else if (id === '184450003') return true;
    }
    else return false;
  }


  forecastApi() {




    let body =

      {
        "OpportunityId": this.projectService.getSession('opportunityId'),
        "OpportunityForecast": this.forecastValue,
        "ManualProbabilityWining": this.ManualProbabilityWiningId || this.ManualProbabilityWiningId === 0 || this.ManualProbabilityWiningId === '0' ? this.ManualProbabilityWiningId : null

        // {
        //   "OpportunityId": this.projectService.getSession('opportunityId'),
        //   "OpportunityForecast": this.forecastValue,
        //   "ManualProbabilityWining": this.ManualProbabilityWiningId


        // }
      }

    this.isLoading = true;

    this.projectService.saveProbability(body).subscribe(response => {
      if (!response.IsError) {
        this.projectService.displayMessageerror('Forecast updated successfully');

        this.profilesSummary();


      }

      else {
        this.projectService.displayMessageerror(response.Message);
      }
      this.isLoading = false;
    },
      err => {
        this.isLoading = false;
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      }
    );


  }


  steps: any[] = [
    // { icon: 'mdi mdi-rounded-corner', name: 'Lead' },
    {
      iconmobile: 'assets/images/createstate2.svg',
      icon: 'assets/images/createstate2.svg',
      icon1: 'assets/images/createiconstate2.svg',
      iconshow: 'mdi mdi-rounded-corner',
      icondisabled: 'assets/images/Create_grey.png',
      name: 'Create',
      id: '184450000',
      content: [

        {
          date: null,
          body: 'Sales Management has given the go-ahead to engage with the customer on this potential opportunity.',
          // Isbtn: true
        }
      ]
    },
    {
      iconmobile: 'assets/images/qualifystate2.svg',
      icon: 'assets/images/qualifystate2.svg',
      icon1: 'assets/images/qualifystate1.svg',
      iconshow: 'mdi mdi-eye',
      icondisabled: 'assets/images/Qualify_grey.png',
      name: 'Qualify',
      id: '184450001',
      content: [

        {
          date: null,
          // date2:this.date1.value,
          // title: 'Qualify',
          body: 'A politically powerful customer executive sponsor requested for a solution/ proposal',
          // IsContentbtn: true,
          // Contentbtn: 'Nuture',
          // Validationtitle: 'Mandatory fields for qualify stage',
          // Fields: ['Proposal type',
          //  'Contracting country',
          //  'Project duration (months)',
          //  'Advisor name',
          //  'Primary Contact',
          //  'Decision maker Contacts']
        }
      ]
    },
    {
      iconmobile: 'assets/images/pursuiticonTrans2.svg',
      icon: 'assets/images/pursuitstate2.png',
      icon1: 'assets/images/pursuitstate1.png',
      iconshow: 'mdi mdi-lead-pencil',
      icondisabled: 'assets/images/Pursuit_grey.png',
      name: 'Pursuit',
      id: '184450002',
      content: [
        {
          date: null,
          // title: 'Pursuit',
          body: 'Customer initiated a formal procurement process & requested for commercial.',
          //  Validationtitle: 'Mandatory fields for qualify stage',
          //  Fields: ['Proposal type',
          //   'Contracting country',
          //   'Project duration (months)',
          //   'Advisor name',
          //   'Primary Contact',
          //   'Decision maker Contacts']
        }

      ]
    },

    {
      iconmobile: 'assets/images/securestage2.svg',
      icon: 'assets/images/securestage2.svg',
      icon1: 'assets/images/securestage1.svg',
      iconshow: 'mdi mdi-file',
      icondisabled: 'assets/images/Secure_grey.png',
      name: 'Secure',
      id: '184450003',
      content: [

        {
          date: null,
          // title: 'Secure',
          body: 'Customer ofﬁcially shortlisted Wipro.',
          // Isbtn: true
        }
      ]
    },
    {
      iconmobile: 'assets/images/closestate2.svg',
      icon: 'assets/images/closestate2.svg',
      icon1: 'assets/images/closestate1.svg',
      iconshow: 'mdi mdi-chart-line',
      icondisabled: 'assets/images/Close_grey.png',
      name: 'Close',
      id: '184450004',
      content: [

        {
          date: null,
          //title: 'Close',
          body: 'The customer has selected Wipro for contract execution',
          // 'A politically powerful customer executive sponsor requested for a solution/ proposal',
          // Isbtn: true
        }
      ]
    },
  ]

  emithover(e) {
    // //console.log(e);
  }


  forecastData() {

    this.isLoading = true;
    this.projectService.forecastData().subscribe(res => {
      if (!res.IsError) {
        // res =   {"ResponseObject":[{"Id":1,"Name":"Commit","DisplayOrder":0},
        //    {"Id":2,"Name":"Upside","DisplayOrder":0},
        //    {"Id":3,"Name":"Unspecified","DisplayOrder":0}],"IsError":false,"ApiStatusCode":0}

        if (res.ResponseObject && (Array.isArray(res.ResponseObject) ? res.ResponseObject.length > 0 : false)) {
          this.forecast = res.ResponseObject.map((it) => {
            return { Value: it.Id, Label: it.Name, disableField: true }
          })




          this.forecast.filter(it => {
            if ((it.Value) == 3) { it.disableField = false; }
          });
          this.profilesSummary();





        }
        else {
          this.isLoading = false;
        }
        this.isLoading = false;
      }
      else {
        this.isLoading = false;
        this.projectService.displayMessageerror(res.Message);
      }

    },
      err => {
        this.isLoading = false;
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      }
    )
  }

  deliveryteams: any = [];

  deliveryteamMethode() {

    let obj = { "Guid": this.projectService.getSession('opportunityId') }


    this.projectService.deliveryTeam(obj).subscribe(response => {
      this.deliveryteams = []
      if (!response.IsError) {
        if (response.ResponseObject != null && response.ResponseObject.length != 0) {
          const deliveryTeams = response.ResponseObject;
          deliveryTeams.map((deliveryTeam, i) => {
            const deliveryteamObj = {
              deliverycontent: deliveryTeam.MapName ? deliveryTeam.MapName : '-',
              sapcontent: deliveryTeam.Name ? deliveryTeam.Name : '-'
            }
            this.deliveryteams.push(deliveryteamObj);
          });
          //console.log(this.deliveryteams);

        }
        else {
        }
      }
      else {
        this.projectService.displayMessageerror(response.Message);
      }

    },
      err => {
        this.isLoading = false;
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      }
    )
  }
  orderid;
  orderCreated;
  accountid;
  orderbookingId;
  ApprovalStage;
  OrderNumber;
  ParentOpportunityId;
  IsDirectAmendment;
  OpportunityStatus1;
  VerticalId1;
  SBUId1;
  OpportunityStage1;
  RegionId1;
  GeoId1;
  OpportunityStage2;
  ParentOderIdValue;
  isHardClosed;


  GetSessionDetails(isorderpage?: boolean) {
    this.opportunityName = this.projectService.getSession('opportunityName');


    let obj =
      {
        "Id": this.projectService.getSession('orderId')       //this.accountid//need to pass the Account Id
      }
    this.OrderService.GetSessionDetailsForUI(obj).subscribe((response: any) => {
      if (!response.IsError) {
        if (response.ResponseObject) {
          console.log("amendment create after ", response.ResponseObject);
          this.OpportunityStatus1 = response.ResponseObject.OpportunityStatus ? response.ResponseObject.OpportunityStatus.toString() : "";
          this.VerticalId1 = response.ResponseObject.VerticalId ? response.ResponseObject.VerticalId.toString() : "";
          this.RegionId1 = response.ResponseObject.RegionId ? response.ResponseObject.RegionId.toString() : "";
          this.SBUId1 = response.ResponseObject.SBUId ? response.ResponseObject.SBUId.toString() : "";
          this.GeoId1 = response.ResponseObject.GeoId ? response.ResponseObject.GeoId.toString() : "";
          let AccountId: any = response.ResponseObject.AccountId ? response.ResponseObject.AccountId.toString() : "";

          this.OpportunityStage1 = response.ResponseObject.OpportunityStage ? response.ResponseObject.OpportunityStage.toString() : "";
          let status = response.ResponseObject.OpportunityStatus ? response.ResponseObject.OpportunityStatus : null;
          this.oppStatus = this.getStatusValue(status);
          this.currentState = this.OpportunityStage1;
          this.OpportunityStage2 = response.ResponseObject.OpportunityStage ? response.ResponseObject.OpportunityStage : null;
          this.projectService.count = this.projectService.wipro_pipelinestage.findIndex(it => it.Value === this.OpportunityStage2);
          // this.stageIconBackground();

          if (this.projectService.count == 4) {
            this.projectService.ordercreatesuccess = true;
            //this.orderpageenabled = false;
            this.projectService.setSession('ordercreated', true);
          }
          // this.projectService.setSession('currentState', res.ResponseObject.PipelineStage ? res.ResponseObject.PipelineStage.toString() : "");
          this.projectService.setSession('opportunityStatus', this.OpportunityStatus1);
          //this.projectService.setSession('estDate', res.ResponseObject.estimatedclosedate ? res.ResponseObject.estimatedclosedate.toString() : "");
          this.projectService.setSession('verticalId', this.VerticalId1);
          this.projectService.setSession('sbuId', this.SBUId1);
          this.projectService.setSession('regionId', this.RegionId1);
          this.projectService.setSession('GeoId', this.GeoId1);
          this.projectService.setSession('accountid', AccountId);
          this.projectService.setSession('currentState', this.OpportunityStage1);
          this.overviewPage(this.OpportunityStage1 == '184450004' ? 'order' : undefined);
          if (!isorderpage) {
            if (this.OpportunityStage1 == '184450004') {
              if (this.projectService.getSession('opportunityRedirect') == 'T') {
                this.router.navigate(['/opportunity/opportunityview/overview']);
                this.OrderService.BFMNavagationFlag = false;
              }
              else {
                if (this.projectService.getSession('BFMNavagationFlag') == true) {
                  if (this.projectService.getSession('bfmRoleModifiedOrders') == true) {
                    this.router.navigate(['/opportunity/opportunityview/order']);
                  } else {
                    this.router.navigate(['/opportunity/opportunityview/userdeclarations']);
                  }
                  this.OrderService.BFMNavagationFlag = true;
                }
                else {
                  this.router.navigate(['/opportunity/opportunityview/order']);
                  //role based opp check
                  this.OrderService.BFMNavagationFlag = false;
                }


              }


            }
            else {
              this.OrderService.BFMNavagationFlag = false;
              this.router.navigate(['/opportunity/opportunityview/overview']);
            }
          }
        }
        else {

        }
      }
      else {
        //  this.projectService.displayMessageerror("api having some error");
        this.projectService.displayMessageerror(response.Message);

      }
    },
      err => {
        this.isLoading = false;
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      }
    );

  }


  //order id
  getoppOverviewdetailsa() {

    if (this.projectService.getSession('IsAmendment') == true) {
      this.getoppOverviewdetailsab();
    }
    else {




      //console.log("oppp id", this.OpportunityServices.getSession('opportunityId'))
      const payload = {
        Id: this.OpportunityServices.getSession('opportunityId')
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
                    if (orderDetails.ResponseObject.IsHardClosed == true) {
                      this.disableHardClose = true;
                    }
                    if (orderDetails.ResponseObject.OrderTypeId == orderTypeId.Negative) {
                      this.negativeFlag = true;
                    }
                    if (orderDetails.ResponseObject.ApprovalTypeId != 184450005) {
                      this.foreclosureFlag = true;
                    }
                    if (orderDetails.ResponseObject.ApprovalStage == OrderApprovalStage.ApprovedbyBFM) {
                      this.BfmHardcloseFlag = true;
                    }


                    this.OrderapprovalTypeModify = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.ApprovalTypeId) ? orderDetails.ResponseObject.ApprovalTypeId : '';
                    this.orderbookingId = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderBookingId) ? orderDetails.ResponseObject.OrderBookingId : '';
                    this.accountid = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.Account.SysGuid) ? orderDetails.ResponseObject.Account.SysGuid : '';
                    this.ApprovalStage = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.ApprovalStageId) ? orderDetails.ResponseObject.ApprovalStageId : '';
                    this.oppidAfterAmendment = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OpportunityId) ? orderDetails.ResponseObject.OrderNumber : '';
                    this.ApprovedDate = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.ApprovedDate) ? orderDetails.ResponseObject.ApprovedDate : '';
                    this.ModificationStatus = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderModificationRequestStatusId) ? orderDetails.ResponseObject.OrderModificationRequestStatusId : '';
                    this.OrderNumber = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderNumber) ? orderDetails.ResponseObject.OrderNumber : '';
                    this.orderCurrencysymbol = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.Currency && orderDetails.ResponseObject.Currency.Type) ? orderDetails.ResponseObject.Currency.Type : '';
                    var curr = this.getSymbol(orderDetails.ResponseObject.Currency.Type)
                    this.OrderModificationCutOffDay = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderModificationCutOffDay) ? orderDetails.ResponseObject.OrderModificationCutOffDay : '';
                    this.createdDate = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.CreatedOn) ? orderDetails.ResponseObject.CreatedOn : '';
                    this.ApprovedByBfmDate = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.ApprovedDate) ? orderDetails.ResponseObject.ApprovedDate : '';
                    this.OrderTypeId = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderTypeId) ? orderDetails.ResponseObject.OrderTypeId : '';
                    this.ParentOderIdValue = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.ParentOderIdValue) ? orderDetails.ResponseObject.ParentOderIdValue : '';
                    this.ParentOpportunityId = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.ParentOpportunityId) ? orderDetails.ResponseObject.ParentOpportunityId : '';
                    this.IsDirectAmendment = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.IsDirectAmendment) ? orderDetails.ResponseObject.IsDirectAmendment : '';
                    this.enableOrDisableOpportunitySummary(this.IsDirectAmendment);
                    this.orderCreated = true;
                    this.orderAccordianContent = this.orderAccordianContent.map(accord => {
                      if (accord.title == 'Financials') {
                        accord.content.map(contentVal => {
                          if (contentVal.label.includes('Original order value')) {
                            contentVal.label = 'Original order value(' + curr + ')'
                          }
                        });
                      };
                      return accord;
                    });


                    if (orderTypeId.ErrorHandling == orderDetails.ResponseObject.OrderTypeId || orderTypeId.Trueup == orderDetails.ResponseObject.OrderTypeId || orderTypeId.Negative == orderDetails.ResponseObject.OrderTypeId) {
                      this.incren = false;
                      this.hardClose1 = false;

                    }

                        if ( orderTypeId.Negative == orderDetails.ResponseObject.OrderTypeId) {
                      this.incr = false;

                    }

                    if (orderTypeId.ErrorHandling == orderDetails.ResponseObject.OrderTypeId || orderTypeId.Trueup == orderDetails.ResponseObject.OrderTypeId || orderTypeId.Negative == orderDetails.ResponseObject.OrderTypeId || (this.OrderService.newAmendmentDetails)) {
                      this.winFlag = false;
                    }


                    if (this.projectService.getSession('IsAmendment') == true) {
                      this.incren1 = true;
                    }



                    //need to show and hide opp tabs based on condition
                    //   this.projectService.ordercreatesuccess1=false;
                    //  }
                    //  else{
                    //   this.projectService.ordercreatesuccess1=true;
                    //  }

                    //console.log(" this.orderbookingId ", this.orderbookingId);


                    this.orderSummary();
                    this.modifyOrder();
                    this.deliveryteamOrder();
                    this.DeliverySummary();
                    //this.approvalOrderSummary();
                    this.orderAccountDetailsMethod();
                    // this.GetBudgetDetailsMethod();
                    this.GetFinancialDetailsMethod();
                    this.GetAmendmentMethode();
                    this.getPricingApproval();


                  }
                  else {

                  }
                }
                else {
                  this.projectService.displayMessageerror(orderDetails.Message);
                }
              },
                err => {
                  this.isLoading = false;
                  this.service.loaderhome = false;
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
          this.service.loaderhome = false;
          this.projectService.displayerror(err.status);
        });

    }
  }


  //opp id not there and order id present
  getoppOverviewdetailsab() {

    //this.orderid =this.projectService.getSession('orderId');

    const bookingIdPayload = {
      Guid: this.projectService.getSession('orderId')
    }

    this.OrderService.getSalesOrderDetails(bookingIdPayload).subscribe((orderDetails: any) => {
      if (!orderDetails.IsError) {



        if (orderDetails.ResponseObject) {
          if (orderDetails.ResponseObject.IsHardClosed == true) {
            this.disableHardClose = true;
          }

          if (orderDetails.ResponseObject.IsDirectAmendment == true) {
            this.directAmendment = true;
            this.projectService.setSession('directAmendment', this.directAmendment);
          }

          if (orderDetails.ResponseObject.OrderTypeId == orderTypeId.Negative) {
            this.negativeFlag = true;
          }
          if (orderDetails.ResponseObject.ApprovalTypeId != 184450005) {
            this.foreclosureFlag = true;
          }
          if (orderDetails.ResponseObject.ApprovalStage == OrderApprovalStage.ApprovedbyBFM) {
            this.BfmHardcloseFlag = true;
          }

          this.OrderapprovalTypeModify = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.ApprovalTypeId) ? orderDetails.ResponseObject.ApprovalTypeId : '';
          this.orderbookingId = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderBookingId) ? orderDetails.ResponseObject.OrderBookingId : '';
          this.accountid = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.Account.SysGuid) ? orderDetails.ResponseObject.Account.SysGuid : '';
          this.ApprovalStage = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.ApprovalStageId) ? orderDetails.ResponseObject.ApprovalStageId : '';
          this.oppidAfterAmendment = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OpportunityId) ? orderDetails.ResponseObject.OrderNumber : '';
          this.ApprovedDate = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.ApprovedDate) ? orderDetails.ResponseObject.ApprovedDate : '';
          this.ModificationStatus = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderModificationRequestStatusId) ? orderDetails.ResponseObject.OrderModificationRequestStatusId : '';
          this.OrderNumber = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderNumber) ? orderDetails.ResponseObject.OrderNumber : '';
          this.orderCurrencysymbol = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.Currency && orderDetails.ResponseObject.Currency.Type) ? orderDetails.ResponseObject.Currency.Type : '';
          var curr = this.getSymbol(orderDetails.ResponseObject.Currency.Type)
          this.OrderModificationCutOffDay = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderModificationCutOffDay) ? orderDetails.ResponseObject.OrderModificationCutOffDay : '';
          this.createdDate = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.CreatedOn) ? orderDetails.ResponseObject.CreatedOn : '';
          this.ApprovedByBfmDate = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.ApprovedDate) ? orderDetails.ResponseObject.ApprovedDate : '';
          this.OrderTypeId = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderTypeId) ? orderDetails.ResponseObject.OrderTypeId : '';
          this.ParentOderIdValue = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.ParentOderIdValue) ? orderDetails.ResponseObject.ParentOderIdValue : '';
          this.ParentOpportunityId = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.ParentOpportunityId) ? orderDetails.ResponseObject.ParentOpportunityId : '';
          this.IsDirectAmendment = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.IsDirectAmendment) ? orderDetails.ResponseObject.IsDirectAmendment : '';
          this.enableOrDisableOpportunitySummary(this.IsDirectAmendment);
          this.orderCreated = true;

          this.orderAccordianContent = this.orderAccordianContent.map(accord => {
            if (accord.title == 'Financials') {
              accord.content.map(contentVal => {
                if (contentVal.label.includes('Original order value')) {
                  contentVal.label = 'Original order value(' + curr + ')'
                }
              });
            };
            return accord;
          });



          if (orderTypeId.ErrorHandling == orderDetails.ResponseObject.OrderTypeId || orderTypeId.Trueup == orderDetails.ResponseObject.OrderTypeId || orderTypeId.Negative == orderDetails.ResponseObject.OrderTypeId) {
            this.incren = false;
            this.hardClose1 = false;

          }
          if ( orderTypeId.Negative == orderDetails.ResponseObject.OrderTypeId) {
                      this.incr = false;

                    }



          if (orderTypeId.ErrorHandling == orderDetails.ResponseObject.OrderTypeId || orderTypeId.Trueup == orderDetails.ResponseObject.OrderTypeId || orderTypeId.Negative == orderDetails.ResponseObject.OrderTypeId || (this.OrderService.newAmendmentDetails)) {
            this.winFlag = false;
          }


          if (this.projectService.getSession('IsAmendment') == true) {
            this.incren1 = true;
          }
          this.modifyOrder();
          //need to show and hide opp tabs based on condition
          //   this.projectService.ordercreatesuccess1=false;
          //  }
          //  else{
          //   this.projectService.ordercreatesuccess1=true;
          //  }
          console.log("accountid", this.ApprovalStage);
          console.log(" orderdetails response ", orderDetails.ResponseObject)


          this.orderSummary();
          this.deliveryteamOrder();
          this.DeliverySummary();
          // this.approvalOrderSummary();
          this.orderAccountDetailsMethod();
          // this.GetBudgetDetailsMethod();
          this.GetFinancialDetailsMethod();
          this.GetAmendmentMethode();
          this.getPricingApproval()


        }
        else {

        }
      }
      else {
        this.projectService.displayMessageerror(orderDetails.Message);
      }
    },
      err => {
        this.isLoading = false;
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      });

  }
  //accessright api
  accessrightapi() {

    this.projectService.accessModifyApi(this.projectService.getSession('AdvisorOwnerId'), localStorage.getItem('userEmail')).subscribe(res => {
      if (!res.IsError) {
        this.OpportunityServices.setSession('FullAccess', res.ResponseObject.FullAccess ? res.ResponseObject.FullAccess : false);
        if (!res.ResponseObject.FullAccess) {
          this.OpportunityServices.setSession('FullAccess', res.ResponseObject.FullAccess ? res.ResponseObject.FullAccess : false);
          this.OpportunityServices.setSession('roleObj', res.ResponseObject);
          this.OpportunityServices.setSession('IsPreSaleAndRole', res.ResponseObject.UserRoles ? res.ResponseObject.UserRoles.IsPreSaleAndRole : false)
          this.OpportunityServices.setSession('IsDeliverySpocRole',res.ResponseObject.UserRoles?res.ResponseObject.UserRoles.IsDeliverySpocRole:false)
          this.OpportunityServices.setSession('IsGainAccess', res.ResponseObject.IsGainAccess ? res.ResponseObject.IsGainAccess : false)

        }
        //if (res.ResponseObject.length > 0) {
        console.log("accessrightapi response", res.ResponseObject);

        this.summaryPage(true);
        //this.projectService.setSession('roleObj', res.ResponseObject);
        if (this.router.url === '/opportunity/opportunityview/overview' && (res.ResponseObject.UserRoles.IsAdvisorFunction == true)) {
          this.projectService.reloadoverviewpage();
        }
        if (this.router.url === '/opportunity/opportunityview/team' ) {
          // && res.ResponseObject.IsTeamBuilderSection == true && res.ResponseObject.IsGainAccess == true
          this.projectService.reloadTeamPage();
        }
      }

    });
  }
  checkCurrentUrl() {

    if (this.router.url === '/opportunity/opportunityview/overview') {

    }
    else {
      this.router.navigate(['/opportunity/opportunityview/overview']);
    }
  }


  deliveryTeamsorder: any = []
  deliveryteamOrder() {

    let payload = {
      "Guid": this.ParentOpportunityId
    }
    this.OrderService.getDeliveryTeam(payload).subscribe(response => {
      this.deliveryTeamsorder = []

      if (!response.IsError) {
        if (response.ResponseObject != null && response.ResponseObject.length != 0) {
          const deliveryTeamsorder = response.ResponseObject;
          deliveryTeamsorder.map((deliveryTeam, i) => {
            const deliveryteamObj = {
              deliverycontent: deliveryTeam.MapName ? deliveryTeam.MapName : 'NA',
              sapcontent: deliveryTeam.Name ? deliveryTeam.Name : 'NA'
            }
            this.deliveryTeamsorder.push(deliveryteamObj);
          });
          console.log("sdl", this.deliveryTeamsorder);
          // 
        }
        else {
        }
      }
      else {
        this.projectService.displayMessageerror(response.Message);
      }

    },
      err => {
        this.isLoading = false;
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      }
    )
  }
  //delivery Team saurav



  DeliverySummary() {

    let payload =
      {
        "Guid": this.ParentOpportunityId       //order booking id
      }
    this.OrderService.getDeliveryTeam(payload).subscribe(response => {

      if (!response.IsError) {
        if (response.ResponseObject != null) {
          var deliversummaryArr = response.ResponseObject
          console.log("orderAccountArr", deliversummaryArr);
          this.orderAccordianContent = this.orderAccordianContent.map((it) => {
            {
              if (it.title == 'Delivery team') {
                it.content = []

                for (var i = 0; i < response.ResponseObject.length; i++) {

                  it.content.push
                    ({
                      'label': response.ResponseObject[i].MapName ? response.ResponseObject[i].MapName : '-',
                      'content': response.ResponseObject[i].Name ? response.ResponseObject[i].Name : '-'

                    })

                }
              }
            }
            return it
          })
        }
        else {
        }
      }
      else {
        //  this.projectService.displayMessageerror("api having some error");
        this.projectService.displayMessageerror(response.Message);

      }

      console.log("this.orderAccordianContenttt", this.orderAccordianContent);
    },
      err => {
        this.projectService.displayerror(err.status);
      }
    );
  }

  orderSummary() {

    let obj =
      {
        "Guid": this.orderbookingId
      }
    this.OrderService.summaryOrder(obj).subscribe(response => {
      if (!response.IsError) {
        if (response.ResponseObject != null && response.ResponseObject.length != 0) {

          //console.log("order summary2", response);
          var ordersummaryArr = [
            response.ResponseObject.OrderNumber,//NUMBER
            response.ResponseObject.OwnerIdFormattedValue,//OWNER
            response.ResponseObject.ParentOrderIdFormattedValue,//PRIMARY ORDER
            response.ResponseObject.CrmReferenceNumber,//CRM REF NO
            response.ResponseObject.SAPCustomerCode,//SAP CUS CODE
            response.ResponseObject.Type,//TYPE
            response.ResponseObject.AuthorizationFormattedValue,//AUTHORIZATION
            this.datepipe.transform(response.ResponseObject.SOWPOSignedDateFormattedValue, "dd-MMM-yyyy"),
            // response.ResponseObject.OrderNumber,//SALES BOOKING ID
            // response.ResponseObject.PricingTypeFormattedValue,//WRITTEN IN FSD COMMERCIAL MODEL
            this.datepipe.transform(response.ResponseObject.StartDateFormattedValue, "dd-MMM-yyyy"),
            this.datepipe.transform(response.ResponseObject.EnddateFormattedValue, "dd-MMM-yyyy"),
            response.ResponseObject.OrderApprovalStageFormatValue,//APPROVAL STAGE//OrderApprovalStageFormatValue said by friyank
            response.ResponseObject.PricingTypeFormattedValue,//PRICING TYPE
            response.ResponseObject.PricingId,
            // response.ResponseObject.OwnerIdFormattedValue,//OwnerIdFormattedValue//ORDER OWNER
            response.ResponseObject.SOWReferenceNumber,//SOW ID
            response.ResponseObject.PricingApprovalStageFormattedValue,//PricingApprovalStage
            response.ResponseObject.ProjectCreatedatSAPcproFormattedValue,//PROJECT created at SAP – CPRO
            response.ResponseObject.InvoicingSAPCPROFormattedValue, //•	Invoicing at SAP-CPRO
            response.ResponseObject.CityRegionFormattedValue,
            response.ResponseObject.ContractingCountryFormattedValue,
            response.ResponseObject.ClassificationFormattedValue,
            response.ResponseObject.SuperSOWNumber,
            response.ResponseObject.OpportunityIdFormatValue,//AUTO CREATED OPP NAME//need to chk keerthana
            // response.ResponseObject.OmPercentageFormattedValue

          ];
          this.orderAccordianContent = this.orderAccordianContent.map((it) => {
            {
              if (it.title == 'Order summary') {

                for (var i = 0; i < it.content.length; i++) {
                  // //console.log("content",it.content[i].content);
                  it.content[i].content = ordersummaryArr[i];
                  if (it.content[i].content == null) {
                    it.content[i].content = "-";
                  }
                }

                if (response.ResponseObject.Authorization == true && response.ResponseObject.SOWSigned == true && response.ResponseObject.SOWSigned != null && response.ResponseObject.Authorization != null) {
                  it.content[7].label = 'SOW signed date'
                }
                else if (response.ResponseObject.Authorization == true && response.ResponseObject.SOWSigned == false && response.ResponseObject.SOWSigned != null && response.ResponseObject.Authorization != null) {
                  it.content[7].label = 'Expected SOW signed date'
                }
                else if (response.ResponseObject.Authorization == false && response.ResponseObject.PurchaseOrder == true && response.ResponseObject.PurchaseOrder != null && response.ResponseObject.Authorization != null) {
                  it.content[7].label = 'PO signed date'
                }
                else if (response.ResponseObject.Authorization == false && response.ResponseObject.PurchaseOrder == false && response.ResponseObject.PurchaseOrder != null && response.ResponseObject.Authorization != null) {
                  it.content[7].label = 'Expected PO signed date'
                }
                else {
                  it.content[7].label = 'Signed date'
                }
              }
            }
            return it
          })
        }
        else {

        }
      }
      else {
        this.projectService.displayMessageerror(response.Message);
      }

    },

      err => {
        this.isLoading = false;
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      }
    );
  }

  OrderApprovalStageFormattedValue1: any;
  DecisionDateFormattedValue1: any;
  Aging1: any;
  //approval summary
  approvalOrderSummary() {

    let obj = {
      "Guid": this.orderbookingId//need to pass order id
    }
    this.OrderService.approvalSummary(obj).subscribe(response => {
      if (!response.IsError) {
        if (response.ResponseObject != null && response.ResponseObject.length != 0) {

          var approvalsummaryArr = [
            // response.ResponseObject.InitiatedOn,//initiated on //if only multiple array of object will be there
            this.datepipe.transform(response.ResponseObject.InitiatedOn, "dd-MMM-yyyy h:mma"),
            response.ResponseObject.Type,//approval type
            response.ResponseObject.InitiatedBy,//initiated by value mail
            response.ResponseObject.ADHVDHSDH, //owner id value mail
            response.ResponseObject.DM,
            response.ResponseObject.DMApprovalStatus,

            this.datepipe.transform(response.ResponseObject.DMApprovedRejectedDate, "dd-MMM-yyyy h:mma"),
            //response.ResponseObject.AgingWithDM,
            response.ResponseObject.BFM,
            response.ResponseObject.BFMApprovalStatus,
            this.datepipe.transform(response.ResponseObject.BFMApprovedRejectedDate, "dd-MMM-yyyy h:mma"),
            // response.ResponseObject.AgingWithBFM,

          ];
          //console.log('appro', approvalsummaryArr[0])
          this.orderAccordianContent = this.orderAccordianContent.map((it) => {
            {
              if (it.title == 'Approval summary') {

                for (var i = 0; i < it.content.length; i++) {
                  // //console.log("content",it.content[i].content);
                  it.content[i].content = approvalsummaryArr[i];
                  if (it.content[i].content == null) {
                    it.content[i].content = "NA";
                  }
                }
              }
            }
            return it
          })
        }
        else {

        }
      }
      else {
        // this.projectService.displayMessageerror("api having some error");
        this.projectService.displayMessageerror(response.Message);
      }

    },

      err => {
        this.isLoading = false;
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      }
    );

  }


  //orderAccountDetails
  orderAccountDetailsMethod() {

    let obj =
      {
        "Guid": this.orderbookingId       //this.accountid//need to pass the Account Id
      }
    this.OrderService.orderAccountDetails(obj).subscribe(response => {
      if (!response.IsError) {
        if (response.ResponseObject != null) {
          //console.log("order orderAccountDetails", response.ResponseObject);
          //console.log("order orderAccountDetails", response);
          var orderAccountArr = [
            response.ResponseObject.Name,//Name
            response.ResponseObject.OwnerIdFormatValue,//OWNER
            response.ResponseObject.VerticalFormatValue,//Vertical
            response.ResponseObject.GeoFormatValue,//GEo
          ];
          //console.log("orderAccountArr", orderAccountArr);
          this.orderAccordianContent = this.orderAccordianContent.map((it) => {
            {
              if (it.title == 'Account details') {
                for (var i = 0; i < it.content.length; i++) {
                  // //console.log("content",it.content[i].content);
                  it.content[i].content = orderAccountArr[i];
                  if (it.content[i].content == null) {
                    it.content[i].content = "-";
                  }
                }
              }
            }
            return it
          })
        }
        else {
        }
      }
      else {
        //  this.projectService.displayMessageerror("api having some error");
        this.projectService.displayMessageerror(response.Message);

      }
    },
      err => {
        this.isLoading = false;
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      }
    );
  }

  // Get Pricing Approval Details

  OMPercentage = '';

  getPricingApproval() {
    let obj = {
      Guid: this.negativeFlag ? this.ParentOderIdValue : this.orderbookingId
    }


    this.OrderService.getPricingApprovalSummary(obj).subscribe(response => {
      if (!response.IsError) {
        if (response.ResponseObject != null) {
          //console.log("order orderAccountDetails", response.ResponseObject);
          //console.log("order orderAccountDetails", response);
          console.log("pricing approval sum", response.ResponseObject)
          var orderPricingApprovalArr = [
            response.ResponseObject.PricingId ? response.ResponseObject.PricingId : '-',//Name
            response.ResponseObject.PricingApprovalStatusDisplay ? response.ResponseObject.PricingApprovalStatusDisplay : '-',
            response.ResponseObject.BFM ? response.ResponseObject.BFM : '-', //BFM
            response.ResponseObject.ApprovalPendignWith ? response.ResponseObject.ApprovalPendignWith : '-',
            response.ResponseObject.DealOwner ? response.ResponseObject.DealOwner : '-',
            // response.ResponseObject.OMPercentage ? response.ResponseObject.OMPercentage : 0,
          ];
          console.log("pricing approval arr", orderPricingApprovalArr)
          //console.log("orderAccountArr", orderAccountArr);
          this.orderAccordianContent = this.orderAccordianContent.map((it) => {
            {
              if (it.title == 'Pricing approval summary') {
                for (var i = 0; i < it.content.length; i++) {
                  // //console.log("content",it.content[i].content);
                  it.content[i].content = orderPricingApprovalArr[i];
                  // if (it.content[i].content == null) {
                  //   it.content[i].content = "NA";
                  // }
                }

                if (this.projectService.getSession('omperc') == true) {
                  it.content[5].label = 'OM(%)'

                  it.content[5].content = response.ResponseObject.OMPercentage ? response.ResponseObject.OMPercentage : 0

                  // if (this.projectService.getSession('omperedit') == true){
                  it.content[5]['isEditable'] = true;
                  this.OMPercentage = response.ResponseObject.OMPercentage ? response.ResponseObject.OMPercentage : 0
                  // }
                }

              }

            }
            return it
          })
        }
        else {
        }
      }
      else {
        //  this.projectService.displayMessageerror("api having some error");
        this.projectService.displayMessageerror(response.Message);

      }
    },
      err => {
        this.isLoading = false;
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      }
    );
  }



  //GetBudgetDetails
  GetBudgetDetailsMethod() {

    let obj =
      {
        "Guid": this.orderbookingId//need to pass the order Id
      }
    this.OrderService.GetBudgetDetails(obj).subscribe(response => {
      if (!response.IsError) {
        if (response.ResponseObject != null && response.ResponseObject.length != 0) {
          //console.log("order orderAccountDetails", response.ResponseObject);
          //console.log("order orderAccountDetails", response);
          var BudgetDetailsArr = [
            response.ResponseObject.PricingId,// Pricing ID-PricingId
            response.ResponseObject.OmPercentage,// OM%-OmPercentageFormattedValue
            response.ResponseObject.DiscountAmount,// Discount/Premium-DiscountAmountFormattedValue
            response.ResponseObject.DiscountAmountBase,// Discount/Premium Base--DiscountAmountBaseFormattedValue
            response.ResponseObject.DiscountPercentage,// Discount/Premium Percentage-DiscountPercentageFormattedValue
            response.ResponseObject.OnsiteMonths,// onsite MM-OnsiteMonthsFormattedValue
            response.ResponseObject.OffshoreMonths,// Offshore MM-OffshoreMonthsFormattedValue
            response.ResponseObject.OnsiteMMContingency,// onsite MM Conti -OnsiteMMContingencyFormattedValue
            response.ResponseObject.OffshoreMMContingency,// offshore MM Conti-OffshoreMMContingencyFormattedValue
            response.ResponseObject.OnsitePPC,// Onsite Cost in INR  -
            response.ResponseObject.OffshorePPC, // Offshore RatCost inr
            response.ResponseObject.OnsiteRate,// Onsite rate - pending
            response.ResponseObject.OffshoreRate,// Offshore rate - Pending
            response.ResponseObject.ServicesPassThrough,// Services pass thru – Cost & Revenue - ProductPassThruCostandRevenueFormattedValue
            response.ResponseObject.ProductPassThruCostandRevenue,// Product pass thru – Cost & Revenue -ServicesPassThroughFormattedValue
            response.ResponseObject.OtherCosts,// Other Costs-OtherCostsFormattedValue
            response.ResponseObject.DocumentationType,// Documentation Type-DocumentationTypeFormattedValue
            response.ResponseObject.SOWAuthSlipFormattedValue,// SOW Auth Slip-SOWAuthSlipFormattedValue
            response.ResponseObject.NoOfDocuments,// No of Documents-NoOfDocumentsFormattedValue
            response.ResponseObject.ApprovalDocs,// Approval Doc -ApprovalDocsFormattedValue
            response.ResponseObject.PricingRework,// Pricing Rework-PricingReworkFormattedValue
          ];
          //console.log("Budget details", BudgetDetailsArr);
          this.orderAccordianContent = this.orderAccordianContent.map((it) => {
            {
              if (it.title == 'Budget details') {
                for (var i = 0; i < it.content.length; i++) {
                  // //console.log("content",it.content[i].content);

                  it.content[i].content = BudgetDetailsArr[i];
                  if (it.content[i].content == null) {
                    it.content[i].content = "NA";
                  }
                }
              }
            }
            return it

          })
        }
        else {

        }
      }
      else {
        this.projectService.displayMessageerror(response.Message);
        //   this.projectService.displayMessageerror("api having some error");
      }

    },

      err => {
        this.isLoading = false;
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      }
    );
  }



  ApprovalType: any;
  OrderApprovalStageFormattedValue: any;
  // GetFinancialDetails(body)
  GetFinancialDetailsMethod() {

    let obj =
      {
        "Guid": this.orderbookingId//need to pass the Account Id
      }
    this.OrderService.GetFinancialDetails(obj).subscribe(response => {
      if (!response.IsError) {
        if (response.ResponseObject != null && response.ResponseObject.length != 0) {
          //console.log("order orderAccountDetails", response.ResponseObject);
          //console.log("order orderAccountDetails", response);
          var orderFinancialDetailsArr = [
            response.ResponseObject.ExchangeRate || response.ResponseObject.ExchangeRate === 0 || response.ResponseObject.ExchangeRate === '0' ? (Number(Number(response.ResponseObject.ExchangeRate).toFixed(2))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',
            response.ResponseObject.ApprovedAmendmentValue,//
            response.ResponseObject.ApprovedNegativeAmendmentValue,//
            response.ResponseObject.TotalOrderValue || response.ResponseObject.TotalOrderValue === 0 || response.ResponseObject.TotalOrderValue === '0' ? (Number(Number(response.ResponseObject.TotalOrderValue).toFixed(2))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',
            response.ResponseObject.OriginalOrderValue || response.ResponseObject.OriginalOrderValue === 0 || response.ResponseObject.OriginalOrderValue === '0' ? (Number(Number(response.ResponseObject.OriginalOrderValue).toFixed(2))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',//
            response.ResponseObject.TCVInPlanForex || response.ResponseObject.TCVInPlanForex === 0 || response.ResponseObject.TCVInPlanForex === '0' ? (Number(Number(response.ResponseObject.TCVInPlanForex).toFixed(2))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',
            response.ResponseObject.ACVInPlanForex || response.ResponseObject.ACVInPlanForex === 0 || response.ResponseObject.ACVInPlanForex === '0' ? (Number(Number(response.ResponseObject.ACVInPlanForex).toFixed(2))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',
            response.ResponseObject.TCVInDynamicForex || response.ResponseObject.TCVInDynamicForex === 0 || response.ResponseObject.TCVInDynamicForex === '0' ? (Number(Number(response.ResponseObject.TCVInDynamicForex).toFixed(2))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',
            response.ResponseObject.ACVInDynamicForex || response.ResponseObject.ACVInDynamicForex === 0 || response.ResponseObject.ACVInDynamicForex === '0' ? (Number(Number(response.ResponseObject.ACVInDynamicForex).toFixed(2))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',

          ];
          //console.log("orderAccountArr", orderAccountArr);
          this.orderAccordianContent = this.orderAccordianContent.map((it) => {
            {
              if (it.title == 'Financials') {
                for (var i = 0; i < it.content.length; i++) {
                  // //console.log("content",it.content[i].content);
                  it.content[i].content = orderFinancialDetailsArr[i];
                  if (it.content[i].content == null) {
                    it.content[i].content = "-";
                  }
                }
              }
            }
            return it
          })
        }
        else {
        }
      }
      else {
        //  this.projectService.displayMessageerror("api having some error");
        this.projectService.displayMessageerror(response.Message);

      }
    },
      err => {
        this.isLoading = false;
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      }
    );


  }
  // this.OrderService.GetAmendment(obj).subscribe(response => {
  GetAmendmentMethode() {
    let obj =
      {
        "Guid": this.orderbookingId//need to pass the orderbookingId Id
      }
    this.OrderService.GetAmendment(obj).subscribe(response => {
      if (!response.IsError) {
        if (response.ResponseObject != null && response.ResponseObject.length != 0) {
          //console.log("order orderAccountDetails", response.ResponseObject);
          //console.log("order orderAccountDetails", response);
          var orderAmendmentArr = [
            response.ResponseObject.ApprovedAmendmentCount,//Name
            response.ResponseObject.UnApprovedAmendmentCount,//OWNER
            response.ResponseObject.ApprovedValue || response.ResponseObject.ApprovedValue === 0 || response.ResponseObject.ApprovedValue === '0' ? (Number(Number(response.ResponseObject.ApprovedValue).toFixed(2))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',//Vertical
            response.ResponseObject.UnApprovedValue || response.ResponseObject.UnApprovedValue === 0 || response.ResponseObject.UnApprovedValue === '0' ? (Number(Number(response.ResponseObject.UnApprovedValue).toFixed(2))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',//GEo
            // response.ResponseObject.ApprovedValue,//Vertical
            // response.ResponseObject.UnApprovedValue,//GEo
          ];
          //console.log("orderAccountArr", orderAccountArr);
          this.orderAccordianContent = this.orderAccordianContent.map((it) => {
            {
              if (it.title == 'Amendment summary') {
                for (var i = 0; i < it.content.length; i++) {
                  // //console.log("content",it.content[i].content);
                  it.content[i].content = orderAmendmentArr[i];
                  if (it.content[i].content == null) {
                    it.content[i].content = "-";
                  }
                }
              }
            }
            return it
          })
        }
        else {
        }
      }
      else {
        //  this.projectService.displayMessageerror("api having some error");
        this.projectService.displayMessageerror(response.Message);

      }
    },
      err => {
        this.isLoading = false;
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      }
    );
  }

  getStatusValue(status) {

    switch (status) {
      case 1:
        return "Open";
      case 2:
        return "Suspended";
      case 3:
        return "Won";
      case 5:
        return "Terminated";
      case 184450000:
        return "Lost";
    }
  }

  suspendcountview: any;
  SuspendedDuration1: any;
  SuspendStartDate: any;
  NextReviewDate: any;



  CampaignObj: any = {};


  opportunityOwnerId;
  verticalSalesOwnerId;
  advisorOwnerId;
  accountOwnerId;
  proposaltypeCheck: string = "";
  pricingInvolved : boolean;
  summaryPage(isSubject?: boolean) {
    // alert('a')
    this.opportunityName = this.getSymbol(this.projectService.getSession('opportunityName'));


    let obj = { "OppId": this.projectService.getSession('opportunityId') }
    this.isLoading = true;
    this.projectService.getOppOverviewDetail(obj).subscribe(res => {
      console.log("oppoversaurav",res);
      if (!res.IsError) {
        if (res.ResponseObject) {
          this.oppTypeID = res.ResponseObject.OpportunityTypeId;
          this.projectService.setSession('IsAppirioFlag', res.ResponseObject.IsAppirioFlag);
          this.projectService.setSession('DaSpocId',res.ResponseObject.DaSpocId?res.ResponseObject.DaSpocId : " ");

          this.projectService.setSession('dealOppOwnerId', res.ResponseObject.OppOwner ? res.ResponseObject.OppOwner.SysGuid : '');

          this.projectService.setSession('statusCode', res.ResponseObject.statuscode === 0 || res.ResponseObject.statuscode === '0' || res.ResponseObject.statuscode ? res.ResponseObject.statuscode : '');

          this.projectService.setSession('opportunityName', res.ResponseObject.name ? this.getSymbol(res.ResponseObject.name) : '');
          this.projectService.setSession('WiproIsAutoClose', res.ResponseObject.WiproIsAutoClose ? res.ResponseObject.WiproIsAutoClose : '');
          this.projectService.setSession('opportunityId', res.ResponseObject.OpportunityId ? res.ResponseObject.OpportunityId : '')
          this.projectService.setSession('opportunityStatus', res.ResponseObject.statuscode === 0 || res.ResponseObject.statuscode === '0' || res.ResponseObject.statuscode ? res.ResponseObject.statuscode : '');
          this.projectService.setSession('AdvisorOwnerId', res.ResponseObject.AdvisorOwnerName ? res.ResponseObject.AdvisorOwnerName.SysGuid : '')
          this.projectService.setSession('IsStaffingInitiated', !res.ResponseObject.StaffingDetails ? false : res.ResponseObject.StaffingDetails.IsStaffingInitiated ? res.ResponseObject.StaffingDetails.IsStaffingInitiated : false)
          this.projectService.setSession("IsAppirioFlag", res.ResponseObject.IsAppirioFlag ? res.ResponseObject.IsAppirioFlag : "")
          this.projectService.setSession('SendThankYouNote', res.ResponseObject.SendThankYouNote ? res.ResponseObject.SendThankYouNote : false);
          
          this.projectService.setSession('geoGuid',  res.ResponseObject.WiproGeography ?  res.ResponseObject.WiproGeography : '');//'97463edf-449a-e811-8130-000d3a803bd6',
          this.projectService.setSession('geoName', '');
          this.projectService.setSession('accountNameOpp',  res.ResponseObject.Account.Name  ?  res.ResponseObject.Account.Name : '');
          this.projectService.setSession('verticalName', res.ResponseObject.VerticalName ? res.ResponseObject.VerticalName : '');
          this.projectService.setSession('serviceLineArray', res.ResponseObject.WiproServiceLineDtls ? res.ResponseObject.WiproServiceLineDtls : '');
          this.projectService.setSession('accountId',  res.ResponseObject.Account.SysGuid ? res.ResponseObject.Account.SysGuid: '');
          this.projectService.setSession('verticleGuid',  res.ResponseObject.Vertical ? res.ResponseObject.Vertical : '');
          let currentDatestart = new Date();
          this.projectService.setSession('startDate',this.datePipe.transform(currentDatestart, 'MM/dd/yyyy'));
          this.projectService.setSession('endDate', this.datePipe.transform((new Date(new Date().getFullYear() + 5, new Date().getMonth(), new Date().getDate())), 'MM/dd/yyyy'));
          //this.projectService.setSession('sbuName', res.ResponseObject.WiproSbu ? res.ResponseObject.WiproSbu : '');
  
          
          this.IsAppirioFlag = this.projectService.getSession("IsAppirioFlag");
          this.helpdesk = res.ResponseObject.RequestedReopen ? true : false;

          this.projectService.setSession('SuspendCount', true)
          this.projectService.setSession('IsOAR', true)
          this.projectService.setSession('SuspendedDuration', true)
          if (res.ResponseObject.SuspendCount > 1) {
            this.projectService.setSession('SuspendCount', false)
          }

          else if (res.ResponseObject.IsOAR) {
            this.projectService.setSession('IsOAR', false)
          }

          else if (res.ResponseObject.SuspendedDuration > 180) {
            this.projectService.setSession('SuspendedDuration', false)
          }

          //integrated deal opp validation checn code start
          this.IsSimpleDeal = res && res.ResponseObject && res.ResponseObject.IsSimpledeal ? res.ResponseObject.IsSimpledeal : false;
          this.currentState = res.ResponseObject.PipelineStage ? res.ResponseObject.PipelineStage.toString() : "";
          if (this.IsSimpleDeal || this.currentState.toString() === '184450003') {
            debugger;
            let obj = {
              "Guid": this.projectService.getSession('opportunityId'),
              "IsProceedToClose": true,
              "SendThankYouNote": this.projectService.getSession("SendThankYouNote")
            }
            this.projectService.checkOppMandatoryAttributeOverview(obj).subscribe(result => {
              if (!result.IsError) {
                this.isIntegratedDeal = result.ResponseObject.IsIntegratedDeal ? result.ResponseObject.IsIntegratedDeal : false;
                this.isWonHardClosed = result.ResponseObject.IsDealWonHardClosed ? result.ResponseObject.IsDealWonHardClosed : false;
              }
              else {
                this.projectService.displayMessageerror(result.Message);
                //this.isSearchLoader=false
              }
            },
              err => {
                //this.projectService.displayerror(err.status);
                //this.isSearchLoader=false
              })
          }
          //integrated deal check code end
          //auto save in overview page code
          this.service.GetRedisCacheData('saveOpportunity').subscribe(result => {
            console.log("redis", result)
            if (!result.IsError && result.ResponseObject) {
              console.log("parsed data", JSON.parse(result.ResponseObject))
              let dataFromRedis = JSON.parse(result.ResponseObject);
              let OpportunityId = this.projectService.getSession('opportunityId');
              if (Array.isArray(dataFromRedis) && dataFromRedis.length > 0) {
                let currentOpportunityData = dataFromRedis.filter(data => data.opportunityId == OpportunityId)
                if (currentOpportunityData.length) {
                  dataFromRedis.map(data => {
                    if (data.opportunityId == OpportunityId) {
                      data.IsSimpledeal = res.ResponseObject.IsSimpledeal;
                      data.wiproTCV = res.ResponseObject.OpportunityTCV;
                      data.SendThankYouNote = res.ResponseObject.SendThankYouNote;
                      data.WiproServiceLineDtls = res.ResponseObject.WiproServiceLineDtls;
                      data.NonWTFlag=res.ResponseObject.NonWTFlag?res.ResponseObject.NonWTFlag:false;
                    }
                  })
                  this.service.SetRedisCacheData(dataFromRedis, 'saveOpportunity').subscribe(res => {
                    if (!res.IsError) {
                      console.log("SUCESS FULL AUTO SAVE")
                    }
                  }, error => {
                    console.log(error)
                  })
                }
              }
            }
          })

          this.CampaignObj = {
            "AccountSysGuid": res && res.ResponseObject && res.ResponseObject.Account && res.ResponseObject.Account.SysGuid ? res.ResponseObject.Account.SysGuid : '',
            "Account": res && res.ResponseObject && res.ResponseObject.Account && res.ResponseObject.Account.Name ? res.ResponseObject.Account.Name : '',
            "verticalId": res && res.ResponseObject && res.ResponseObject.Vertical ? res.ResponseObject.Vertical : "",
            "verticalName": res && res.ResponseObject && res.ResponseObject.VerticalName ? res.ResponseObject.VerticalName : "",
            "sbuId": res && res.ResponseObject && res.ResponseObject.WiproSbu ? res.ResponseObject.WiproSbu : "",
            "sbuName": "",
            "Name": res && res.ResponseObject && res.ResponseObject.name,
            "isAccountPopulate": false,
            "isProspect": false,
            "fromOpportunity": true,
            "navigation": 'opportunity/opportunityview/overview'
          };
          console.log("viewpage stage Response", res.ResponseObject)
          this.proposaltypeCheck = res && res.ResponseObject && res.ResponseObject.ProposalType ? res.ResponseObject.ProposalType : "";
          this.pricingInvolved =  res && res.ResponseObject && res.ResponseObject.pricinginvolved        
          this.isSimpleOpportunity = res && res.ResponseObject && res.ResponseObject.IsSimpledeal ? res.ResponseObject.IsSimpledeal : false;
          let status = res && res.ResponseObject && res.ResponseObject.statuscode ? res.ResponseObject.statuscode : null;
          this.oppStatus = this.getStatusValue(status);
          this.opportunityOwnerId = res && res.ResponseObject && res && res.ResponseObject && res.ResponseObject.OppOwner ? res.ResponseObject.OppOwner.SysGuid : null
          this.verticalSalesOwnerId = res && res.ResponseObject && res.ResponseObject.VerticalSalesOwner ? res.ResponseObject.VerticalSalesOwner.SysGuid : null
          this.advisorOwnerId = res && res.ResponseObject && res.ResponseObject.AdvisorOwnerName ? res.ResponseObject.AdvisorOwnerName.SysGuid : null
          this.projectService.setSession('AdvisorOwnerId', this.advisorOwnerId);
          this.accountOwnerId = res && res.ResponseObject && res.ResponseObject.Account ? res.ResponseObject.Account.OwnerId : null
          this.projectService.setSession('GeoId', res.ResponseObject.WiproGeography ? res.ResponseObject.WiproGeography : null);
          this.projectService.setSession('isSimpleOpportunity', res.ResponseObject.IsSimpledeal ? res.ResponseObject.IsSimpledeal : false);
          this.projectService.setSession('regionId', res && res.ResponseObject && res.ResponseObject.RegionId ? res.ResponseObject.RegionId.toString() : "");
          this.projectService.setSession('currentState', res.ResponseObject.PipelineStage ? res.ResponseObject.PipelineStage.toString() : "");
          this.projectService.setSession('opportunityStatus', res.ResponseObject.statuscode ? res.ResponseObject.statuscode.toString() : "");
          this.projectService.setSession('estDate', res.ResponseObject.estimatedclosedate ? res.ResponseObject.estimatedclosedate.toString() : "");
          this.projectService.setSession('verticalId', res.ResponseObject.Vertical ? res.ResponseObject.Vertical.toString() : "");
          this.projectService.setSession('sbuId', res.ResponseObject.WiproSbu ? res.ResponseObject.WiproSbu.toString() : "");
          this.projectService.setSession('createdOn', res.ResponseObject.CreatedOn ? res.ResponseObject.CreatedOn.toString() : "");
          this.projectService.setSession('accountid', res && res.ResponseObject && res.ResponseObject.Account && res.ResponseObject.Account.SysGuid ? res.ResponseObject.Account.SysGuid : '');
          this.createstage = this.datePipe.transform(res.ResponseObject.CreateStageDate, "dd-MMM-yyyy");
          this.QualifyStage = this.datePipe.transform(res.ResponseObject.QualifyStageDate, "dd-MMM-yyyy");
          this.PursuitStage = this.datePipe.transform(res.ResponseObject.PursuitStageDate, "dd-MMM-yyyy");
          this.SecureStage = this.datePipe.transform(res.ResponseObject.SecureStageDate, "dd-MMM-yyyy");
          this.currentState = res.ResponseObject.PipelineStage ? res.ResponseObject.PipelineStage.toString() : "";
          this.SuspendStartDate = res.ResponseObject.SuspendStartDate ? res.ResponseObject.SuspendStartDate : ""
          this.NextReviewDate = res.ResponseObject.NextReviewDate ? res.ResponseObject.NextReviewDate : ""
          this.suspendcountview = res.ResponseObject.SuspendCount ? res.ResponseObject.SuspendCount : 0;
          this.SuspendedDuration1 = res.ResponseObject.SuspendedDuration ? res.ResponseObject.SuspendedDuration : 0;
          this.stageIconBackground();
          this.overviewDetailData = res.ResponseObject;
          this.projectService.count = this.projectService.wipro_pipelinestage.findIndex(it => it.Value === this.overviewDetailData.PipelineStage);
          console.log(this.projectService.count, "this.projectService.count")
          if (this.projectService.winreasonNavigate1 && this.projectService.winreasonNavigate2 && (this.projectService.getSession('statusCode') == '3')) {
            this.router.navigate(['/opportunity/opportunityview/closereason']);
          }

          if (!isSubject) {
            if (this.currentState == '184450004') {
              if (this.proposaltypeCheck == "184450003" ||  this.pricingInvolved == false  || this.proposaltypeCheck == "184450001") {
                this.router.navigate(['/opportunity/opportunityview/overview']);
                this.OrderService.BFMNavagationFlag = false;
                // this.router.navigate(['/opportunity/opportunityview/closereason']);
              }
              else {
                if (this.projectService.getSession('opportunityRedirect') == 'T') {
                  this.router.navigate(['/opportunity/opportunityview/overview']);
                  this.OrderService.BFMNavagationFlag = false;
                }
                else if (this.projectService.getSession('BFMNavagationFlag') == true) {

                  if (this.projectService.getSession('bfmRoleModifiedOrders') == true) {
                    this.router.navigate(['/opportunity/opportunityview/order']);
                  } else {
                    this.router.navigate(['/opportunity/opportunityview/userdeclarations']);
                  }

                  this.OrderService.BFMNavagationFlag = true;

                }
                else {
                  this.OrderService.BFMNavagationFlag = false;
                  this.router.navigate(['/opportunity/opportunityview/order']);
                  //role based opp check;

                }
                this.projectService.clearSession('opportunityRedirect');

              }

            }
            else if (this.projectService.getSession('SMData') && this.projectService.getSession('SMData').type == 'ORDER') {
              this.projectService.orderpagestart = true;
              this.projectService.clearSession('SMData');
              console.log(this.projectService.orderpagestart);
            }

            else {
              this.OrderService.BFMNavagationFlag = false;
              this.router.navigate(['/opportunity/opportunityview/overview']);
            }
          }
          if (this.proposaltypeCheck == "184450003" || this.pricingInvolved == false || this.proposaltypeCheck == "184450001") {
            this.orderwillshow = false;
          }
          else {
            this.orderwillshow = true;
          }


          if ((this.proposaltypeCheck == "184450003"|| this.pricingInvolved == false || this.proposaltypeCheck == "184450001") && (this.projectService.getSession('currentState').toString() == '184450003' || this.projectService.getSession('currentState').toString() == '184450004') && (this.projectService.getSession('opportunityStatus').toString() == '3')) {
            this.winrfi = true
          }

          if (this.projectService.getSession('opportunityStatus') == 184450000 || this.projectService.getSession('opportunityStatus').toString() == '5') {
            this.winReasonTabFlag = true;
            this.projectService.setSession('disableSubmit', this.winReasonTabFlag);
          }


          /* Opportunity Check : Show and hide the button for residual opportunity */
          this.residualButton = false;
          // if (this.projectService.count != 0) {
          //   let userGuidVal = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
          //   if (this.opportunityOwnerId == userGuidVal && this.overviewDetailData.OpportunityTypeId == 2 && this.overviewDetailData.PipelineStage != 184450001 && this.overviewDetailData.PipelineStage != 184450000) {
          //     // order is not yet created
          //     if (this.projectService.count != 4) {
          //       this.residualButton = true;
          //     }
          //   }
          // }
          /* Ends : Opportunity Check : Show and hide the button for residual opportunity */

          if (this.projectService.count == 0) {
            this.steps[this.projectService.count].content[0].date = this.datepipe.transform(this.overviewDetailData.CreateStageDate, "dd-MMM-yyyy");
            this.projectService.ordercreatesuccess = false;
            //this.orderpageenabled = false;
            this.projectService.setSession('ordercreated', false);

          }
          else if (this.projectService.count == 1) {
            this.steps[0].content[0].date = this.datepipe.transform(this.overviewDetailData.CreateStageDate, "dd-MMM-yyyy");
            this.steps[1].content[0].date = this.datepipe.transform(this.overviewDetailData.QualifyStageDate, "dd-MMM-yyyy");
            this.projectService.ordercreatesuccess = false;
            //this.orderpageenabled = false;
            this.projectService.setSession('ordercreated', false);

          }
          else if (this.projectService.count == 2) {
            this.steps[0].content[0].date = this.datepipe.transform(this.overviewDetailData.CreateStageDate, "dd-MMM-yyyy");
            this.steps[1].content[0].date = this.datepipe.transform(this.overviewDetailData.QualifyStageDate, "dd-MMM-yyyy");
            this.steps[2].content[0].date = this.datepipe.transform(this.overviewDetailData.PursuitStageDate, "dd-MMM-yyyy");
            this.projectService.ordercreatesuccess = false;
            //this.orderpageenabled = false;
            this.projectService.setSession('ordercreated', false);

          }
          else if (this.projectService.count == 3) {
            this.steps[0].content[0].date = this.datepipe.transform(this.overviewDetailData.CreateStageDate, "dd-MMM-yyyy");
            this.steps[1].content[0].date = this.datepipe.transform(this.overviewDetailData.QualifyStageDate, "dd-MMM-yyyy");
            this.steps[2].content[0].date = this.datepipe.transform(this.overviewDetailData.PursuitStageDate, "dd-MMM-yyyy");
            this.steps[3].content[0].date = this.datepipe.transform(this.overviewDetailData.SecureStageDate, "dd-MMM-yyyy");
            this.projectService.ordercreatesuccess = false;
            //this.orderpageenabled = false;
            this.projectService.setSession('ordercreated', false);
          }
          else if (this.projectService.count == 4) {

            this.steps[0].content[0].date = this.datepipe.transform(this.overviewDetailData.CreateStageDate, "dd-MMM-yyyy");
            this.steps[1].content[0].date = this.datepipe.transform(this.overviewDetailData.QualifyStageDate, "dd-MMM-yyyy");
            this.steps[2].content[0].date = this.datepipe.transform(this.overviewDetailData.PursuitStageDate, "dd-MMM-yyyy");
            this.steps[3].content[0].date = this.datepipe.transform(this.overviewDetailData.SecureStageDate, "dd-MMM-yyyy");
            this.steps[4].content[0].date = this.datepipe.transform(this.overviewDetailData.CloseStageDate, "dd-MMM-yyyy");

            if (this.proposaltypeCheck == "184450003" ||  this.pricingInvolved == false || this.proposaltypeCheck == "184450001") {
              this.projectService.ordercreatesuccess = false;
              this.projectService.ordersummarytab = true;

              this.projectService.ProceedQualify = false;

            } else {
              this.projectService.ordercreatesuccess = true;
              this.projectService.ordersummarytab = true;
              //this.orderpageenabled = true;
              this.projectService.ProceedQualify = false;
              this.projectService.setSession('ordercreated', true);
            }

          }

          //  console.log('this.currentState', this.currentState);

          this.overviewPage(this.currentState == '184450004' ? 'order' : undefined);
          this.manualProbability();



        }
        else {

        }

      }
      else {
        this.projectService.displayMessageerror(res.Message);
      }
      this.isLoading = false;
    }
      ,
      err => {
        this.isLoading = false;
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      }
    )
  }

  isLoadingProb = false
  manualProbability() {
    this.isLoadingProb = true;
    this.projectService.manualProbability().subscribe(res => {
      this.isLoadingProb = false;
      if (!res.IsError) {

        if (res.ResponseObject && (Array.isArray(res.ResponseObject) ? res.ResponseObject.length > 0 : false)) {

          this.winningProbabilityData = res.ResponseObject.map((it) => {
            return { Value: it.Id, Label: it.Value }
          })

          this.forecastData();

        }


        else {

        }
      }
      else {
        this.projectService.displayMessageerror(res.Message);
      }

    }
      ,
      err => {
        this.isLoadingProb = false;
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      }
    )


  }


  iconClick() {
    // alert("hi sssssssssss")
    this.service.ttip = true; //on icon click setting tootip to true
    console.log("ttip set to true on click after scroll");
    this.router.navigate(['/opportunity/opportunityview/overview']);
  }
  currentstagestate: any;
  startState: any;
  currentState: any;
  currentcount: any;
  createstage: any;
  QualifyStage: any;
  PursuitStage: any;
  SecureStage: any;
  residualoppshow: boolean = false;
  beforestartstateinactive: boolean;
  disableLead = true
  IsNonWT: boolean = false;
  qualifierData = []
  disableActivity = true
  opportunityQualifier() {

    this.projectService.opportunityQualifier().subscribe(res => {


      if (!res.IsError) {
        if (res.ResponseObject && (Array.isArray(res.ResponseObject) ? res.ResponseObject.length > 0 : false)) {
          this.qualifierData = res.ResponseObject
        }
        else {
        }
      }
      else {
        this.projectService.displayMessageerror(res.Message);
      }
    },
      err => {
        this.isLoading = false;
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      }
    )
  }

  //IsAmendment:boolean=false;

  WTFlag: boolean;

  getWTFlag() {
    const payload = {
      OrderOrOpportunityId: this.projectService.getSession('opportunityId'),
      IsOrderCheckNonBPO: false
    }
    this.OrderService.getWTstatus(payload).subscribe((res: any) => {
      this.WTFlag = res.ResponseObject && res.ResponseObject.length > 0 ? res.ResponseObject[0].IsWT : false;
      console.log("sauravwtcheck", this.WTFlag);
      this.projectService.setSession('wtcheckdeal', this.WTFlag);

    });
  }


  messageInfo: string = ""; // store sl-pn-subpn for error message.
  sl = "";    //store service line
  subpn = ""; //store sub practice name
  pn = "";    //store practice name

  assignCloudConfigData(cloudData) {  //to set the cloudConfig value returned by the api in ngOnInit() for rndsalecycle validation
    this.cloudConfigDataE = cloudData;
    console.log("cloudConfigData: ", this.cloudConfigDataE);

  }

  integratedDealPopupESC()  //popup for integrated deal esc validation
  {
    const dialogRef = this.dialog.open(integratedDealPopup,
      {
        width: '350px',
        data: {
          message: "Please ensure the related Appirio deal is removed from the integration or marked as lost in Appirio SFDC after which the TraCE integrated deal can be closed as LOST. Please get the same updated by your Appirio counterpart or You can connect with Sales ops teams of Appirio at salesops@appirio.com for any further support required on ACS line items."
        }

      });
  }


  stateID;
  check = 0;
  thankYouFlag;
  thankyouMessage;
  IsIntegratedDealFlag;
  navigateEndSale() {  //to route the page on clicking the endsalecycle based on the flag.
    this.thankYouFlag = this.projectService.getSession("SendThankYouNote");
    console.log("Send Thank You Note", this.thankYouFlag);
    if (this.projectService.getSession('opportunityStatus') == 5 || this.projectService.getSession('opportunityStatus') == 184450000) {
      this.endSaleDisable = false;
      this.validateEndSalesCycle();
    }
    else {
      this.projectService.checkOppMandatoryAttribute(this.oppID, this.thankYouFlag).subscribe(response => {  //to get api response for endsalecycle disable validation (API for fetching data if present in mandatory fields)
        if (!response.IsError) {
          console.log("CheckOpp API: ", response);
          this.checkOppDataE = response.ResponseObject.SeviceLineList;
          this.flagEndSale = response.ResponseObject.ValidationFlag;
          this.errorMessage = response.ResponseObject.ErrorMessage;
          this.stateID = response.ResponseObject.StateId;
          this.IsIntegratedDealFlag = response.ResponseObject.IsIntegratedDeal;
          //this.IsIntegratedDealFlag = true;
          if (this.IsIntegratedDealFlag == true) {
            this.endSaleDisable = true;
            this.integratedDealPopupESC();
          }
          else {
            if (response.ResponseObject.SendThankYouNote_ErrorMessage) {
              this.endSaleDisable = true;
              this.thankyouMessage = response.ResponseObject.SendThankYouNote_ErrorMessage;
            }
            else {
              if (this.flagEndSale == true) {

                console.log("State ID", this.stateID);
                if (this.stateID == null || this.stateID == "") {
                  this.endSaleDisable = false;
                  for (var x = 0; x < this.checkOppDataE.length; x++) {
                    for (var y = 0; y < this.cloudConfigDataE.length; y++) {

                      if (this.checkOppDataE[x].ServiceLineName == this.cloudConfigDataE[y].ServiceLineName && this.checkOppDataE[x].PracticeName == this.cloudConfigDataE[y].PracticeName && this.checkOppDataE[x].SubPracticeName == this.cloudConfigDataE[y].SubPracticeName) {
                        console.log("Well, you're out.");
                        this.sl = this.checkOppDataE[x].ServiceLineName;
                        this.pn = this.checkOppDataE[x].PracticeName;
                        this.subpn = this.checkOppDataE[x].SubPracticeName;
                        this.check = 1;
                        this.messageInfo = this.sl + (this.pn == "" ? (this.subpn == "" ? "" : "-" + this.subpn) : "-" + this.pn) + (this.pn != "" ? (this.subpn == "" ? "" : "-" + this.subpn) : "");    //to print data with '-' only if next data is availabe or else null----- SL-PracticeName-SubPracticeName
                        this.endSaleDisable = true;
                        console.log("endSaleDisable 4", this.endSaleDisable);
                      }
                    }
                  }
                }
                else {
                  this.projectService.checkCityCount(this.stateID).subscribe(response => {  //to get api response for endsalecycle disable validation (API for cloudconfigs)
                    console.log("Check City count", response);
                    if (response.ResponseObject.Count > 0) {
                      this.messageInfo = this.errorMessage;
                      this.endSaleDisable = true;
                      console.log("endSaleDisable 1", this.endSaleDisable);
                    }
                    else {
                      console.log("cloudConfigDatainValidate: ", this.cloudConfigDataE);
                      this.endSaleDisable = false;
                      for (var x = 0; x < this.checkOppDataE.length; x++) {
                        for (var y = 0; y < this.cloudConfigDataE.length; y++) {
                          if (this.checkOppDataE[x].ServiceLineName == this.cloudConfigDataE[y].ServiceLineName && this.checkOppDataE[x].PracticeName == this.cloudConfigDataE[y].PracticeName && this.checkOppDataE[x].SubPracticeName == this.cloudConfigDataE[y].SubPracticeName) {
                            console.log("Well, you're out.");
                            this.sl = this.checkOppDataE[x].ServiceLineName;
                            this.pn = this.checkOppDataE[x].PracticeName;
                            this.subpn = this.checkOppDataE[x].SubPracticeName;
                            this.messageInfo = this.sl + (this.pn == "" ? (this.subpn == "" ? "" : "-" + this.subpn) : "-" + this.pn) + (this.pn != "" ? (this.subpn == "" ? "" : "-" + this.subpn) : "");    //to print data with '-' only if next data is availabe or else null----- SL-PracticeName-SubPracticeName
                            this.check = 1;
                            this.endSaleDisable = true;
                            console.log("endSaleDisable 2", this.endSaleDisable);
                          }
                        }
                      }
                    }
                  },
                    err => {
                      this.isLoading = false;
                      this.service.loaderhome = false;
                      this.OpportunityServices.displayerror(err.status);
                    }
                  );

                }
              }
              else {
                this.endSaleDisable = true;
                console.log("endSaleDisable 6", this.endSaleDisable);
                if (this.errorMessage == "" || this.errorMessage == null) {
                  this.messageInfo = "Response Object is empty.";
                } else {
                  this.messageInfo = this.errorMessage;
                }
              }
            }
          }
        }
        this.validateEndSalesCycle();
      },
        err => {
          this.isLoading = false;
          this.service.loaderhome = false;
          this.OpportunityServices.displayerror(err.status);
        }
      );
    }
    console.log("checkOppData: ", this.checkOppDataE);
    console.log("checkOppDataLength: ", this.checkOppDataE.length);
    console.log("flagEnd: ", this.flagEndSale);
    console.log("cloudConfigDatainValidate: ", this.cloudConfigDataE);
  }


  validateEndSalesCycle() {  //to validate the data for given oppID returned by api in ngOnInit() to enable/disable end sale cycle
    if (this.endSaleDisable) {
      if (this.IsIntegratedDealFlag == true) {
      }
      else {
        if (this.thankYouFlag) {
          let message = this.thankyouMessage;
          let action;
          this.snackBar.open(message, action, { duration: 5000 })
        }
        else {
          console.log("OUT, CAN'T OPEN", this.endSaleDisable);
          if (this.flagEndSale == true) {
            if (this.check == 1) {
              let message = "Dear User, please enter the 'Cloud' details for " + this.messageInfo + " combination available at Business Solution Panel > SL Section.";
              let action;
              this.snackBar.open(message, action, { duration: 5000 })
            }
            else {
              let message = this.messageInfo;
              let action;
              this.snackBar.open(message, action, { duration: 5000 })
            }
          }
          else {
            let message = this.messageInfo;
            let action;
            this.snackBar.open(message, action, { duration: 5000 })
          }
        }
      }
    }
    else {
      this.router.navigate(['/opportunity/opportunityview/opportunityendsalescycle']);
      console.log("IN THE END", this.endSaleDisable);
    }
  }

  searchPaoHolders() {
    const payload = {
      "FilterSearchText": '',
      "PageSize": 50,
      "RequestedPageNumber": 1,
      "Location": "",
      "Category": "",
      "BU": "",
      "CompanyCode": ""
    };

    this.OrderService.getPOAHolders(payload).subscribe((res: any) => {
      if (!res.IsError) {
        var poaArr = [res.ResponseObject[0].POAName ? res.ResponseObject[0].POAName : '-',
        res.ResponseObject[1].POAName ? res.ResponseObject[1].POAName : '-',

        res.ResponseObject[2].POAName ? res.ResponseObject[2].POAName : '-',

        res.ResponseObject[3].POAName ? res.ResponseObject[3].POAName : '-',

        res.ResponseObject[4].POAName ? res.ResponseObject[4].POAName : '-',
        ]

        var emailArr = [res.ResponseObject[0].EmailId ? res.ResponseObject[0].EmailId : '-',
        res.ResponseObject[1].EmailId ? res.ResponseObject[1].EmailId : '-',
        res.ResponseObject[2].EmailId ? res.ResponseObject[2].EmailId : '-',
        res.ResponseObject[3].EmailId ? res.ResponseObject[3].EmailId : '-',
        res.ResponseObject[4].EmailId ? res.ResponseObject[4].EmailId : '-']
        this.accordianContent = this.accordianContent.map((it) => {
          {
            if (it.title == 'POA Holders') {

              for (var i = 0; i < it.content.length; i++) {

                it.content[i].content = emailArr[i]
                it.content[i].label = poaArr[i]
              }


            }
          }
          return it
        }
        )

      }
      else {
        this.OpportunityServices.displayMessageerror(res.Message);
      }
    },
      err => {
        this.isLoading = false;
        this.service.loaderhome = false;
        this.OpportunityServices.displayerror(err.status);
      });



  }


  closureDetails() {
    let body = { "OpportunityId": this.OpportunityServices.getSession('opportunityId') }
    // let body= {    "OpportunityId": '8ABDCA5C-2973-E911-A830-000D3AA058CB' }
    this.isLoading = true
    this.OpportunityServices.closureDetailsApi(body).subscribe(response => {
      if (!response.IsError) {

        var closureArr = ['View', response.ResponseObject.StatusCodeValue ? response.ResponseObject.StatusCodeValue : '-',
          response.ResponseObject.BaseOrderNo ? response.ResponseObject.BaseOrderNo : '-',
          response.ResponseObject.ActualCloseDate ? response.ResponseObject.ActualCloseDate : '-',
          response.ResponseObject.SoftCloseDate ? response.ResponseObject.SoftCloseDate : '-',
          response.ResponseObject.HardCloseDate ? response.ResponseObject.HardCloseDate : '-',

          response.ResponseObject.ActualValue ? this.getAcv(response.ResponseObject.ActualValue) : '-']

        this.accordianContent = this.accordianContent.map((it) => {
          {
            if (it.title == 'Closure details') {

              for (var i = 0; i < it.content.length; i++) {
                it.content[i].content = closureArr[i]
              }

            }
          }
          return it
        }
        )

      }
      else {
        this.OpportunityServices.displayMessageerror(response.Message);
      }
      this.isLoading = false
    }
      ,
      err => {
        this.isLoading = false;
        this.service.loaderhome = false;
        this.OpportunityServices.displayerror(err.status);
      }
    );

  }
  getAcv(data) {
    return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
  }

  pricingDetails() {

    let body = { "OpportunityId": this.OpportunityServices.getSession('opportunityId') }

    // let body= {    "OpportunityId": "8ABDCA5C-2973-E911-A830-000D3AA058CB" }
    this.OpportunityServices.pricingDetailsApi(body).subscribe(response => {
      if (!response.IsError) {


        var PricingArr = [!response.ResponseObject.pricingDetails || response.ResponseObject.pricingDetails.length == 0 ? '-' : response.ResponseObject.pricingDetails[0].PricingId ? response.ResponseObject.pricingDetails[0].PricingId : '-',
        response.ResponseObject.ApprovalStatusValue ? response.ResponseObject.ApprovalStatusValue : '-',

        !response.ResponseObject.pricingDetails || response.ResponseObject.pricingDetails.length == 0 ? '-' : response.ResponseObject.pricingDetails[0].Bfm ? response.ResponseObject.pricingDetails[0].Bfm : '-',
        !response.ResponseObject.pricingDetails || response.ResponseObject.pricingDetails.length == 0 ? '-' : response.ResponseObject.pricingDetails[0].PendingWith ? response.ResponseObject.pricingDetails[0].PendingWith : '-']
        this.accordianContent = this.accordianContent.map((it) => {
          {
            if (it.title == 'Pricing approval status') {

              for (var i = 0; i < it.content.length; i++) {
                it.content[i].content = PricingArr[i]
              }

            }



          }
          return it
        })
      }
      else {
        this.OpportunityServices.displayMessageerror(response.Message);
      }
    }
      ,
      err => {
        this.isLoading = false;
        this.service.loaderhome = false;
        this.OpportunityServices.displayerror(err.status);
      }
    );

  }

  roleObj;
  gainRoleApi(): Observable<any> {

    return this.OpportunityServices.roleApi();

  }
  ngOnInit() {  //sng

    if (this.projectService.getSession('directAmendment') == true) {
      this.oppSummary = true;
    }


    // if(this.projectService.getSession('ShareOrder')==true){
      //   this.shareOrder2=true;   // share order
      // }


    if (this.projectService.getSession('showAssign')) {
      this.assignOrder = true;
    }
    if (this.projectService.getSession('omperc')) {
      this.omperc = true;
    }
    this.orderrolebaseapi();
    //  this.orderrolebaseapi2();
    //   if(this.OpportunityServices.getSession('opportunityId')) {
    //   this.orderrolebaseapi();
    // }
    // else {

    //   this.orderrolebaseapi2();

    // }


    // if (this.projectService.getSession('omperedit')) {
    //   this.omperedit = true;
    // }

    if (((this.router.url == '/opportunity/opportunityview/order') && this.projectService.getSession('BFMNavagationFlag') == true)) {
      this.moreactionreview = false;
    }
    if (this.router.url == '/opportunity/opportunityview/userdeclarations') {
      this.moreactionreview = false;
    }


    this.projectService.clearSession('loadBFMScreen');
    this.IsAppirioFlag = this.projectService.getSession("IsAppirioFlag");
    this.gainRoleApi().subscribe(resData => {
      if (!resData.IsError) {
        sessionStorage.setItem('exportFlag', resData.ResponseObject.IsExportExcel ? '1' : "")
        if (resData.ResponseObject.IsHelpRoleFullAccess) {
          this.helpLineRoleFlag = true;
        } else {
          this.helpLineRoleFlag = false;
        }
      }


    }, err => {
    });




    this.superCentralMarketingManagerRole = false;
    this.oppID = this.OpportunityServices.getSession('opportunityId'); //getting opp ID from session

    this.roleObj = this.projectService.getSession('roleObj');
    this.superCentralMarketingManagerRole = false;

    if (this.roleObj && Object.keys(this.roleObj).length > 0 && !this.projectService.getSession('FullAccess')) {
      // this.superCentralMarketingManagerRole = this.roleObj.UserRoles.IsSuperCentralMarketingManagerRole ? true : false;
      this.superCentralMarketingManagerRole = !this.roleObj.UserRoles ? false : this.roleObj.UserRoles.IsSuperCentralMarketingManagerRole ? true : false;

      console.log(this.superCentralMarketingManagerRole, "this.superCentralMarketingManagerRole")
    }

    this.projectService.getOppCloudValidationConfigs().subscribe(response => {  //to get api response for endsalecycle disable validation (API for cloudconfigs)
      this.assignCloudConfigData(response.ResponseObject);
      this.OpportunityServices.setSession("mandatoryArrayForCloud", response.ResponseObject)
    },
      err => {
        this.isLoading = false;
        this.service.loaderhome = false;
        this.OpportunityServices.displayerror(err.status);
      }
    );

    this.getWTFlag();

    if (this.projectService.getSession('BFMNavagationFlag') == true) {
      this.getBFMData();
    }


    //  console.log("amendmentsave", this.projectService.getSession('opportunityId'));

    this.projectService.clearSession("orderModificationId");
    this.projectService.clearSession("disableall");
    if (this.projectService.getSession('IsAmendment') == true) {
      this.GetSessionDetails(false);
      this.getoppOverviewdetailsa();
      if (this.projectService.getSession('opportunityId')) {
        this.manualProbability()
      }
      this.projectService.amendmentcreate = true;
      // if (this.directAmendment = true) {
      //   this.projectService.summaryOppTab = false;
      // }
      // else if (this.directAmendment = false) {
      //   this.projectService.summaryOppTab = true;
      // }

      this.projectService.ordercreatesuccess = true;
      this.opportunityTab = false;
      this.projectService.setSession('opportunityStatus', '3');
      this.projectService.ordersummarytab = true;
      this.projectService.ordercreatesuccess1 = true;
    }
    else {

      this.summaryPage(this.projectService.smartsearch == false ? false : true);
      this.getoppOverviewdetailsa();
      // this.projectService.summaryOppTab = true;
      this.projectService.ordercreatesuccess1 = false;
      this.projectService.ordersummarytab = true;

      // this.projectService.ordercreatesuccess=true;
    }

    if (this.projectService.getSession('IsAmendment') == true) {
      this.incren1 = true;
    }

    this.service.Summary_window = false;
    this.projectService.ProceedQualify = false;
    if (this.projectService.getSession('currentState') == '184450003') {
      let SMData = this.projectService.getSession('SMData');
      if (!SMData || (SMData && SMData.type != 'ORDER'))
        this.goBack();
    }
    //this.projectService.ProceedQualify = false;

    this.projectService.getordersave().subscribe(res => {
      if (res.ordersave) {
        this.projectService.setSession('ordercreated', true);
        this.projectService.setSession('currentState', '184450004');
        this.projectService.restTab = false;
        this.projectService.initiateObButton = false;
        if (this.projectService.getSession('IsAmendment') == true) {
          // console.log("amendmentsave", this.projectService.getSession('opportunityId'));
          this.GetSessionDetails(true);
          this.getoppOverviewdetailsa();
          this.opportunityTab = false;
          this.projectService.ordersummarytab = true;
          // if (this.directAmendment = true) {
          //   this.projectService.summaryOppTab = false;
          // }
          // else if (this.directAmendment = false) {
          //   this.projectService.summaryOppTab = true;
          // }
          this.enableOrDisableOpportunitySummary(this.IsDirectAmendment);
          this.projectService.ordercreatesuccess = true;
          this.projectService.ordercreatesuccess1 = true;

        }
        else {
          this.projectService.ordercreatesuccess1 = false;
          this.summaryPage(true);
          this.getoppOverviewdetailsa();
          // this.projectService.summaryOppTab = true;
          this.projectService.ordersummarytab = true;
        }

      }
    });
    this.simpleOpportunity();
    //this.orderpage();
    //while submit approval

    this.projectService.getordersubmit().subscribe(res => {

      if (res.ordersubmit) {


        if (this.projectService.getSession('orderId') != null) {
          this.getoppOverviewdetailsa();
        }


      }
    });
    //     this.projectService.getmodifyorder().subscribe(res => {
    // console.log("modifyorder1",res.modifyorder1)
    //       if (res.modifyorder1) {
    //         this.modifyordervalue=true;
    //       }
    //       else{
    //         this.modifyordervalue=true;
    //       }
    //     });
  }

  enableOrDisableOpportunitySummary(IsDirectAmendment: boolean) {
    if (IsDirectAmendment) {
      this.projectService.summaryOppTab = false;
    } else {
      this.projectService.summaryOppTab = true;
      // this.forecastData();
    }

  }


  toolkitArray;
  orderAppBfm = false;


  disableFields() {




    this.forecast.filter(it => {
      if (it.Value == 2 || (it.Value) == 3 || it.Value == 1) { it.disableField = true; }
    });

    this.accordianContent.map((it) => {
      {
        if (it.title == 'Profile') {
          it.content.map((it1) => {
            if (it1.label == 'Manual probability') {
              it1.isEditable = false
            }
            if (it1.label == 'Est. closure date') {
              it1.isEditable = false
            }
            if (it1.label == 'Type') {
              it1.isEditable = false
            }
          }
          )
        }
        if (it.title == 'Opportunity qualifier') {
          it.content.map((it1) => {
            if (it1.label == 'Qualification status') {
              it1.isEditable = false
            }
          }
          )
        }



      } return it
    })

  }


  // disa



  disableCloseStage() {
    //  this.projectService.setSession('IsAppirioFlag',true);

    if (this.projectService.getSession('ordercreated') || this.projectService.getSession('IsAppirioFlag') || this.orderAppBfm


      || this.projectService.getSession('opportunityStatus').toString() == '2'
      || this.projectService.getSession('opportunityStatus').toString() == '3'
      || this.projectService.getSession('opportunityStatus').toString() == '5'
    ) {
      this.disableLead = false
      this.disableActivity = false

      this.disableFields()
    }



    else if (!this.projectService.getSession('FullAccess')) {

      if (!this.projectService.getSession('FullAccess')) {

        var roleObjTemp = this.projectService.getSession('roleObj')

        if ( roleObjTemp &&   !roleObjTemp.PartialAccess ? true : false) {
          this.disableLead = false
          this.disableActivity = false

          this.disableFields()
        }
      }


    }

    else {
      if (this.projectService.getSession('opportunityStatus').toString() == '184450000') {
        this.disableLead = false
        this.disableActivity = true

        this.disableFields()
      }
    }
    if (!this.projectService.getSession('FullAccess')) {
      this.accordianContent.map((it) => {
        {

          if (it.title == 'Opportunity qualifier') {
            it.content.map((it1) => {
              if (it1.label == 'Qualification status') {
                it1.isEditable = false
              }
            }
            )
          }



        } return it
      })

    }

    console.log(this.accordianContent, 'contentcontent');
  }

  toolkitData() {

    this.disableCloseStage();
    var Id = this.projectService.getSession('opportunityId')

    this.projectService.toolkitData(Id).subscribe(res => {
      if (!res.IsError) {
        if (res.ResponseObject && (Array.isArray(res.ResponseObject) ? res.ResponseObject.length > 0 : false)) {
          this.toolkitArray = res.ResponseObject

          this.accordianContent = this.accordianContent.map((it) => {
            {

              if (it.title == 'Toolkit') {

                it.content[0].content = this.toolkitArray[0].StormCount;
                if (Number(this.toolkitArray[0].RelationshipCount) == 1) {
                  it.content[1].content = 'Yes';
                }
                if (Number(this.toolkitArray[0].OPPReviewCount) == 1) {
                  it.content[2].content = 'Yes';
                }
                if (Number(this.toolkitArray[0].WinStartegyCount) == 1) {
                  it.content[3].content = 'Yes';
                }
                if (Number(this.toolkitArray[0].CompetitorStrategyCount) == 1) {
                  it.content[4].content = 'Yes';
                }

                if (Number(this.toolkitArray[0].RAIDCount) == 1) {
                  it.content[5].content = 'Yes';
                }
              }
            }

            return it
          })

        }
        else {

        }
      }
      else {
        this.projectService.displayMessageerror(res.Message);
      }
      // this.isLoading = false;
    }
      ,
      err => {
        this.isLoading = false;
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      }
    )
    console.log(this.accordianContent, 'content2')
  }



  //saurav function ends


  orderDetails: any;
  OrderId: any;
  opportunityStatus: "";

  orderpage() {
    this.projectService.getordertab().subscribe(res => {


      if (res.ordertabenabled) {
        this.projectService.restTab = true;
      }
    });

  }

  simpleOpportunity() {
    this.projectService.getproceedtonormals().subscribe(res => {


      if (!res.simpledeal) {
        this.isSimpleOpportunity = false;
      }
    });

  }


  approvalStageEnableAllarray = [
    OrderApprovalStage.ApprovedbyADH_VDH_SDH,
    OrderApprovalStage.RejectedbyBFM,
    OrderApprovalStage.RejectedByDM,
    OrderApprovalStage.RejectedByADH_VDH_SDH,
    OrderApprovalStage.OnHoldByBFM,
    OrderApprovalStage.ForeclosureRequestRejectedbyDM,
    OrderApprovalStage.InvoicingRequestRejectedbyBFM,
    OrderApprovalStage.YettobeSubmitted,
  ];
  ApprovedDate: any = '';
  OrderapprovalTypeModify: any = '';


  orderrolebaseapi(assignpopupshow?, tab?) {
    if (this.projectService.getSession('IsAmendment') == true || !this.OpportunityServices.getSession('opportunityId')) {
      this.orderrolebaseapi2(false, tab);
    }
    else {

      const payload = {
        Id: this.OpportunityServices.getSession('opportunityId')
      };

      this.OrderService.checkOrderBookingId(payload)
        .subscribe((res: any) => {

          if (!res.IsError) {

            if (res.ResponseObject.length > 0) {
              this.orderid = res.ResponseObject[0].SalesOrderId;

              const bookingIdPayload = {
                Guid: this.orderid
              }

              this.OrderService.getSalesOrderDetails(bookingIdPayload).subscribe((orderDetails: any) => {
                console.log("saurav getsales", orderDetails);

                if (!orderDetails.IsError) {




                  if (orderDetails.ResponseObject) {
                    if (orderDetails.ResponseObject.IsHardClosed == true) {
                      this.disableHardClose = true;
                    }
                    if (orderDetails.ResponseObject.OrderTypeId == orderTypeId.Negative) {
                      this.negativeFlag = true;
                    }
                    if (orderDetails.ResponseObject.ApprovalTypeId != 184450005) {
                      this.foreclosureFlag = true;
                    }
                    if (orderDetails.ResponseObject.ApprovalStage == OrderApprovalStage.ApprovedbyBFM) {
                      this.BfmHardcloseFlag = true;
                    }
                    if (tab === 'order') {
                      if (this.router.url === '/opportunity/opportunityview/order') {
                        this.opportunityTab = false;
                        console.log("checksau", this.opportunityTab)
                        this.projectService.setSession('opportunityTab', this.opportunityTab);
                      }
                    }
                    else if (tab != 'order') {
                      this.opportunityTab = true;
                    }
                    this.OrderapprovalTypeModify = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.ApprovalTypeId) ? orderDetails.ResponseObject.ApprovalTypeId : '';
                    this.orderbookingId = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderBookingId) ? orderDetails.ResponseObject.OrderBookingId : '';
                    this.accountid = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.Account.SysGuid) ? orderDetails.ResponseObject.Account.SysGuid : '';
                    this.ApprovalStage = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.ApprovalStageId) ? orderDetails.ResponseObject.ApprovalStageId : '';
                    this.ApprovedDate = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.ApprovedDate) ? orderDetails.ResponseObject.ApprovedDate : '';
                    this.ModificationStatus = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderModificationRequestStatusId) ? orderDetails.ResponseObject.OrderModificationRequestStatusId : '';
                    this.OrderNumber = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderNumber) ? orderDetails.ResponseObject.OrderNumber : '';
                    this.orderCurrencysymbol = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.Currency && orderDetails.ResponseObject.Currency.Type) ? orderDetails.ResponseObject.Currency.Type : '';
                    var curr = this.getSymbol(orderDetails.ResponseObject.Currency.Type)
                    this.OrderModificationCutOffDay = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderModificationCutOffDay) ? orderDetails.ResponseObject.OrderModificationCutOffDay : '';
                    this.createdDate = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.CreatedOn) ? orderDetails.ResponseObject.CreatedOn : '';
                    this.ApprovedByBfmDate = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.ApprovedDate) ? orderDetails.ResponseObject.ApprovedDate : '';
                    this.OrderTypeId = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderTypeId) ? orderDetails.ResponseObject.OrderTypeId : '';
                    this.IsDirectAmendment = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.IsDirectAmendment) ? orderDetails.ResponseObject.IsDirectAmendment : '';
                    this.enableOrDisableOpportunitySummary(this.IsDirectAmendment);
                    this.orderAccordianContent = this.orderAccordianContent.map(accord => {
                      if (accord.title == 'Financials') {
                        accord.content.map(contentVal => {
                          if (contentVal.label.includes('Original order value')) {
                            contentVal.label = 'Original order value(' + curr + ')'
                          }
                        });
                      };
                      return accord;
                    });

                    this.ParentOpportunityId = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.ParentOpportunityId) ? orderDetails.ResponseObject.ParentOpportunityId : '';



                    if (orderTypeId.Negative == orderDetails.ResponseObject.OrderTypeId || orderTypeId.ErrorHandling == orderDetails.ResponseObject.OrderTypeId || orderTypeId.Trueup == orderDetails.ResponseObject.OrderTypeId) {
                      this.retagg = false;
                      this.hardClose1 = false;

                    }

                    if (orderTypeId.ErrorHandling == orderDetails.ResponseObject.OrderTypeId || orderTypeId.Trueup == orderDetails.ResponseObject.OrderTypeId || orderTypeId.Negative == orderDetails.ResponseObject.OrderTypeId) {
                      this.incren = false;

                    }
                    if ( orderTypeId.Negative == orderDetails.ResponseObject.OrderTypeId) {
                      this.incr = false;

                    }



                    if (orderTypeId.ErrorHandling == orderDetails.ResponseObject.OrderTypeId || orderTypeId.Trueup == orderDetails.ResponseObject.OrderTypeId || orderTypeId.Negative == orderDetails.ResponseObject.OrderTypeId || (this.OrderService.newAmendmentDetails)) {
                      this.winFlag = false;
                    }


                    if (this.projectService.getSession('IsAmendment') == true) {
                      this.incren1 = true;
                    }

                    let ApprovedDateDays: any = 0;
                    if (this.ApprovedDate) {
                      let currentDate: any = new Date();
                      let approvedDatetemp: any = new Date(this.ApprovedDate)
                      let diffTime = Math.abs(approvedDatetemp - currentDate);
                      ApprovedDateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    }
                    let payload = {
                      UserGuid: this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
                      Guid: this.orderbookingId
                    }

                    if (this.OrderapprovalTypeModify == orderApprovalType.Modified_Order && this.ApprovalStage == OrderApprovalStage.PendingWithBFM) {
                      this.savebuton = true;
                      this.addAlliance = false;
                      this.addIp = false;
                      this.addNewAge = false;
                      this.addService = false;
                      this.accessRight = false;
                    } else {

                      this.camend = false;
                      this.endsales1 = false;
                      this.hardClose1 = false;


                      this.OrderService.addRoleBaseAccess(payload).subscribe(response => {
                        console.log("sauravrole", response);
                        if (!response.IsError) {
                          let userGuidVal = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
                          if ((response.ResponseObject.OrderOwnerRole == true || this.opportunityOwnerId == userGuidVal) && this.overviewDetailData.OpportunityTypeId == 2 && this.OrderTypeId == orderTypeId.New) {
                            /* Opportunity Check : Show and hide the button for residual opportunity */

                            if (this.projectService.count != 0 && this.projectService.count != 1) {
                              switch (+this.ApprovalStage) {
                                case OrderApprovalStage.ForeclosureRequestApprovedbyDM:
                                case OrderApprovalStage.ApprovedbyBFM:
                                  this.residualButton = false;
                                  break;
                                default:
                                  this.residualButton = true;
                              }
                            }
                            /* Ends : Opportunity Check : Show and hide the button for residual opportunity */
                          }

                          if (this.ApprovalStage == OrderApprovalStage.ApprovedbyBFM) {
                            this.orderAppBfm = true;

                            this.disableCloseStage()
                          }
                          if (((this.router.url == '/opportunity/opportunityview/order') && this.projectService.getSession('BFMNavagationFlag') == true)) {
                            this.moreactionreview = false;
                          }
                          if (this.router.url == '/opportunity/opportunityview/userdeclarations') {
                            this.moreactionreview = false;
                          }

                          if (orderTypeId.ErrorHandling == orderDetails.ResponseObject.OrderTypeId || orderTypeId.Trueup == orderDetails.ResponseObject.OrderTypeId || orderTypeId.Negative == orderDetails.ResponseObject.OrderTypeId) {
                            this.incren = false;
                          }
                          if ( orderTypeId.Negative == orderDetails.ResponseObject.OrderTypeId) {
                      this.incr = false;

                    }

                          if (tab === 'order') {
                            if (this.router.url === '/opportunity/opportunityview/order') {
                              this.opportunityTab = false;
                              console.log("checksau", this.opportunityTab)
                              this.projectService.setSession('opportunityTab', this.opportunityTab);
                            }
                          }
                          else if (tab != 'order') {
                            this.opportunityTab = true;
                          }

                          if (orderDetails.ResponseObject.IsDirectAmendment == true) {
                            this.directAmendment = true;
                            this.projectService.setSession('directAmendment', this.directAmendment);
                          }

                          if (this.projectService.getSession('IsAmendment') == true) {
                            this.incren1 = true;
                          }
                          if (response.ResponseObject.BFMRole == true) {
                            this.omperc = true;
                            this.projectService.setSession('omperc', this.omperc);
                          }

                          if (this.ApprovalStage == OrderApprovalStage.ApprovedbyBFM) {
                            this.omperedit = false;
                            // this.projectService.setSession('omperedit', this.omperedit);
                          }


                          //For Negative Amendment (OrderOwner And Bfm)

                          if (response.ResponseObject.OrderOwnerRole == true || response.ResponseObject.BFMRole == true) {
                            this.OrderBfm = true;
                            this.projectService.setSession('OrderOwnerBFM', this.OrderBfm);
                          }
                          if (response.ResponseObject.OrderOwnerRole == true){
                            this.shareOrder=true;
                            this.projectService.setSession('ShareOrder', this.shareOrder);
                          }


                          if (orderTypeId.ErrorHandling != orderDetails.ResponseObject.OrderTypeId && orderTypeId.Trueup != orderDetails.ResponseObject.OrderTypeId && orderTypeId.Negative != orderDetails.ResponseObject.OrderTypeId) {
                            if (response.ResponseObject.CanCreateAmendment == true) {
                              this.camend = true;
                            }
                          }

                          // if(response.ResponseObject.CanCreateAmendment == true){
                          //     if (this.OrderService.parentOrderId) {
                          //   this.savebuton = true
                          // }}



                          if (orderDetails.ResponseObject.IsDirectAmendment == false) {
                            if ((this.ApprovalStage == OrderApprovalStage.RejectedbyBFM) || (this.ApprovalStage == OrderApprovalStage.YettobeSubmitted && response.ResponseObject.OrderOwnerRole == true)) {
                              this.endsales1 = true;
                              this.projectService.setSession('endsalesfromorder', this.endsales1);
                            }
                          }

                          else if (this.ApprovalStage == OrderApprovalStage.YettobeSubmitted && this.ApprovalStage == OrderApprovalStage.RejectedByDM && this.ApprovalStage == OrderApprovalStage.RejectedByADH_VDH_SDH && this.ApprovalStage == OrderApprovalStage.OnHoldByBFM && this.ApprovalStage == OrderApprovalStage.InvoicingRequestRejectedbyBFM && this.ApprovalStage == OrderApprovalStage.ForeclosureRequestRejectedbyDM) {

                            this.endsales1 = false;
                            this.projectService.setSession('endsalesfromorder', this.endsales1);
                          }

                          if (response.ResponseObject.OrderOwnerRole == true && this.ApprovalStage == OrderApprovalStage.ApprovedbyBFM && this.ModificationStatus != OrderModificationRequestStatus.ModificationRequestPendingwithBFM && orderTypeId.Negative != orderDetails.ResponseObject.OrderTypeId) {
                            this.modify = true;
                          }



                          if (response.ResponseObject.OrderOwnerRole == true) {
                            this.orderhi = true;
                          }
                          this.assignOrder = false;
                          if (response.ResponseObject.OrderOwnerRole == true) {
                            this.assignOrder = true;
                          }

                          if (response.ErrorHandling == orderDetails.ResponseObject.OrderTypeId || response.Trueup == orderDetails.ResponseObject.OrderTypeId || response.Negative == orderDetails.ResponseObject.OrderTypeId) {
                              this.winFlag = false;
                            }
                          
                          if (this.projectService.getSession('BFMNavagationFlag') == true) {
                            this.winFlagg = false;
                          }

                          if (this.projectService.getSession('BFMNavagationFlag') == true) {
                            this.moreAction = false;
                          }

                          if (orderTypeId.ErrorHandling != orderDetails.ResponseObject.OrderTypeId && orderTypeId.Trueup != orderDetails.ResponseObject.OrderTypeId && orderTypeId.Negative != orderDetails.ResponseObject.OrderTypeId) {
                            if (this.ApprovalStage == OrderApprovalStage.ApprovedbyBFM && !this.OrderService.newAmendmentDetails && response.ResponseObject.BFMRole == false) {
                              this.hardClose1 = true;
                            }
                          }


                          if (this.projectService.getSession('BFMNavagationFlag') == false && this.ApprovalStage != OrderApprovalStage.RejectedbyBFM || response.Negative == orderDetails.ResponseObject.OrderTypeId || response.ErrorHandling == orderDetails.ResponseObject.OrderTypeId || response.Trueup == orderDetails.ResponseObject.OrderTypeId) {
                            if ((response.ResponseObject.BFMRole == true && response.ResponseObject.OrderOwnerRole == true) && this.ApprovalStage == OrderApprovalStage.ApprovedbyBFM) {
                              this.retaggg = true;
                            }
                            if (response.ResponseObject.BFMRole == true && this.ApprovalStage == OrderApprovalStage.ApprovedbyBFM) {
                              this.retaggg = true;
                            }
                            if (response.ResponseObject.OrderOwnerRole == true && this.ApprovalStage != OrderApprovalStage.ApprovedbyBFM) {
                              this.retaggg = true;
                            }
                          }

                          if (response.ResponseObject.OrderOwnerRole == true || response.ResponseObject.BFMRole == true) {
                            if (this.OrderService.parentOrderId) {
                              this.savebuton = true;
                              this.addAlliance = false;
                              this.addIp = false;
                              this.addNewAge = false;
                              this.addService = false;
                              this.accessRight = false;
                            }
                            else {
                              console.log('ordertypechk', this.projectService.getSession('orderType'))

                              if ((this.ApprovalStage == OrderApprovalStage.ApprovedbyBFM || this.ApprovalStage == OrderApprovalStage.OrderconfirmationApproved)) {
                                if (response.ResponseObject.OrderOwnerRole == true) {
                                  this.ApprovedbyBFMcondition = true;
                                }
                                else {
                                  this.ApprovedbyBFMcondition = false;
                                }


                                if (response.ResponseObject.CanCreateAmendment) {
                                  this.ApprovedbyBFMcondition1 = true;
                                }
                                else {
                                  this.ApprovedbyBFMcondition1 = false;
                                }


                              }
                              else {
                                this.ApprovedbyBFMcondition = false;
                                this.ApprovedbyBFMcondition1 = false;
                              }


                              if (this.approvalStageEnableAllarray.some(it => it == this.ApprovalStage) == true) {
                                //  save enable
                                console.log("rolebase", response.ResponseObject);
                                this.orderAceess = true;
                                this.savebuton = true;
                                this.addAlliance = false;
                                this.addIp = false;
                                this.addNewAge = false;
                                this.addService = false;
                                this.accessRight = false;
                                if (assignpopupshow) {
                                  this.assignorderPopUp();
                                }

                              }
                              else if ((OrderApprovalStage.ApprovedbyBFM == this.ApprovalStage || OrderApprovalStage.InvoicingRequestApprovedbyBFM == this.ApprovalStage) && ApprovedDateDays <= 3) {
                                //  save enable
                                console.log("rolebase", response.ResponseObject);
                                this.orderAceess = true;
                                this.savebuton = true;
                                this.addAlliance = false;
                                this.addIp = false;
                                this.addNewAge = false;
                                this.addService = false;
                                this.accessRight = false;
                                if (assignpopupshow) {
                                  this.assignorderPopUp();
                                }

                              }
                              else if (OrderApprovalStage.ApprovedbyBFM != this.ApprovalStage && OrderApprovalStage.InvoicingRequestApprovedbyBFM != this.ApprovalStage && OrderApprovalStage.ForeclosureRequestApprovedbyDM != this.ApprovalStage) {
                                //  save enable
                                // console.log("rolebase", response.ResponseObject);
                                this.orderAceess = true;
                                this.savebuton = true;
                                this.addAlliance = false;
                                this.addIp = false;
                                this.addNewAge = false;
                                this.addService = false;
                                this.accessRight = false;
                                if (assignpopupshow) {
                                  this.assignorderPopUp();
                                }

                              }
                              else {
                                this.orderAceess = true;
                                this.savebuton = false;
                                this.addAlliance = false;
                                this.addIp = false;
                                this.addNewAge = false;
                                this.addService = false;
                                this.accessRight = false;
                                if (assignpopupshow) {
                                  this.assignorderPopUp();
                                }
                              }

                              if (response.ResponseObject.BFMRole == true && OrderModificationRequestStatus.ModificationRequestPendingwithBFM) {
                                this.savebuton = true;
                              } else if (response.ResponseObject.BFMRole == true && OrderApprovalStage.PendingWithBFM) {
                                this.savebuton = true;
                              }

                            }
                            if (tab === 'order') {
                              if (this.router.url === '/opportunity/opportunityview/order') {
                                this.opportunityTab = false;
                                console.log("checksau", this.opportunityTab)
                                this.projectService.setSession('opportunityTab', this.opportunityTab);
                              }
                            }
                            else if (tab != 'order') {
                              this.opportunityTab = true;
                            }
                            if (tab === 'reasons') {
                              this.savebuton = true;
                              this.addAlliance = false;
                              this.addIp = false;
                              this.addNewAge = false;
                              this.addService = false;
                              this.accessRight = false;
                            }

                          }
                          else if (response.ResponseObject.CanCreateAmendment == true) {
                            if (this.OrderService.parentOrderId) {
                              this.savebuton = true;
                              this.addAlliance = false;
                              this.addIp = false;
                              this.addNewAge = false;
                              this.addService = false;
                              this.accessRight = false;
                            }
                          }
                          else {
                            this.ApprovedbyBFMcondition = false;
                            this.ApprovedbyBFMcondition1 = false;
                            this.orderAceess = false;
                            this.savebuton = false;
                            this.addAlliance = false;
                            this.addIp = false;
                            this.addNewAge = false;
                            this.addService = false;
                            this.accessRight = false;
                            // this.OpportunityServices.displayMessageerror("You don't have permission to assign order");
                            if (assignpopupshow) {
                              this.OpportunityServices.displayMessageerror("You don't have permission to assign order");
                            }
                          }
                        }
                        else {
                          this.projectService.displayMessageerror(response.Message);
                        }

                      }, err => {
                        this.isLoading = false;
                        this.service.loaderhome = false;
                        this.projectService.displayerror(err.status);
                      })

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
                  this.isLoading = false;
                  this.service.loaderhome = false;
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
          this.service.loaderhome = false;
          this.projectService.displayerror(err.status);
        }
        );

    }
  }
  //if opp id not there then call below api
  orderrolebaseapi2(assignpopupshow?, tab?) {

    const bookingIdPayload = {
      Guid: this.projectService.getSession('orderId')
    }

    this.OrderService.getSalesOrderDetails(bookingIdPayload).subscribe((orderDetails: any) => {
      if (!orderDetails.IsError) {


        if (orderDetails.ResponseObject) {
          if (orderDetails.ResponseObject.IsHardClosed == true) {
            this.disableHardClose = true;
          }
          if (orderDetails.ResponseObject.OrderTypeId == orderTypeId.Negative) {
            this.negativeFlag = true;
          }
          if (orderDetails.ResponseObject.ApprovalTypeId != 184450005) {
            this.foreclosureFlag = true;
          }
          if (orderDetails.ResponseObject.ApprovalStage == OrderApprovalStage.ApprovedbyBFM) {
            this.BfmHardcloseFlag = true;
          }


          if (tab === 'order') {
            if (this.router.url === '/opportunity/opportunityview/order') {
              this.opportunityTab = false;
              console.log("checksau", this.opportunityTab)
              this.projectService.setSession('opportunityTab', this.opportunityTab);
            }
          }
          else if (tab != 'order') {
            this.opportunityTab = true;
          }
          this.OrderapprovalTypeModify = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.ApprovalTypeId) ? orderDetails.ResponseObject.ApprovalTypeId : '';
          this.orderbookingId = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderBookingId) ? orderDetails.ResponseObject.OrderBookingId : '';
          this.accountid = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.Account.SysGuid) ? orderDetails.ResponseObject.Account.SysGuid : '';
          this.ApprovalStage = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.ApprovalStageId) ? orderDetails.ResponseObject.ApprovalStageId : '';
          this.ApprovedDate = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.ApprovedDate) ? orderDetails.ResponseObject.ApprovedDate : '';
          this.ModificationStatus = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderModificationRequestStatusId) ? orderDetails.ResponseObject.OrderModificationRequestStatusId : '';
          this.OrderNumber = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderNumber) ? orderDetails.ResponseObject.OrderNumber : '';
          this.orderCurrencysymbol = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.Currency && orderDetails.ResponseObject.Currency.Type) ? orderDetails.ResponseObject.Currency.Type : '';
          var curr = this.getSymbol(orderDetails.ResponseObject.Currency.Type)
          this.OrderModificationCutOffDay = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderModificationCutOffDay) ? orderDetails.ResponseObject.OrderModificationCutOffDay : '';
          this.createdDate = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.CreatedOn) ? orderDetails.ResponseObject.CreatedOn : '';
          this.ApprovedByBfmDate = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.ApprovedDate) ? orderDetails.ResponseObject.ApprovedDate : '';
          this.OrderTypeId = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderTypeId) ? orderDetails.ResponseObject.OrderTypeId : '';
          this.ParentOpportunityId = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.ParentOpportunityId) ? orderDetails.ResponseObject.ParentOpportunityId : '';
          this.IsDirectAmendment = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.IsDirectAmendment) ? orderDetails.ResponseObject.IsDirectAmendment : '';
          this.enableOrDisableOpportunitySummary(this.IsDirectAmendment);
          this.orderAccordianContent = this.orderAccordianContent.map(accord => {
            if (accord.title == 'Financials') {
              accord.content.map(contentVal => {
                if (contentVal.label.includes('Original order value')) {
                  contentVal.label = 'Original order value(' + curr + ')'
                }
              });
            };
            return accord;
          });




          if (orderTypeId.Negative == orderDetails.ResponseObject.OrderTypeId || orderTypeId.ErrorHandling == orderDetails.ResponseObject.OrderTypeId || orderTypeId.Trueup == orderDetails.ResponseObject.OrderTypeId) {
            this.retagg = false;
            this.hardClose1 = false;
          }



          if (orderTypeId.ErrorHandling == orderDetails.ResponseObject.OrderTypeId || orderTypeId.Trueup == orderDetails.ResponseObject.OrderTypeId || orderTypeId.Negative == orderDetails.ResponseObject.OrderTypeId) {
            this.incren = false;

          }
          if ( orderTypeId.Negative == orderDetails.ResponseObject.OrderTypeId) {
                      this.incr = false;

                    }

          if (orderTypeId.ErrorHandling == orderDetails.ResponseObject.OrderTypeId || orderTypeId.Trueup == orderDetails.ResponseObject.OrderTypeId || orderTypeId.Negative == orderDetails.ResponseObject.OrderTypeId || (this.OrderService.newAmendmentDetails)) {
            this.winFlag = false;
          }


          if (this.projectService.getSession('IsAmendment') == true) {
            this.incren1 = true;
          }




          console.log("ordernumberac", this.OrderNumber);
          console.log(orderDetails.ResponseObject, "responsecheck");

          let ApprovedDateDays: any = 0;
          if (this.ApprovedDate) {
            let currentDate: any = new Date();
            let approvedDatetemp: any = new Date(this.ApprovedDate)
            let diffTime = Math.abs(approvedDatetemp - currentDate);
            ApprovedDateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }
          let payload = {
            UserGuid: this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
            Guid: this.orderbookingId
          }

          if (this.OrderapprovalTypeModify == orderApprovalType.Modified_Order && this.ApprovalStage == OrderApprovalStage.PendingWithBFM) {
            this.savebuton = true;
            this.addAlliance = false;
            this.addIp = false;
            this.addNewAge = false;
            this.addService = false;
            this.accessRight = false;
          }

          else {

            this.camend = false;
            this.endsales1 = false;
            this.hardClose1 = false;



            this.OrderService.addRoleBaseAccess(payload).subscribe(response => {
              console.log("sauravrole", response);
              if (!response.IsError) {
                let userGuidVal = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
                if ((response.ResponseObject.OrderOwnerRole == true || this.opportunityOwnerId == userGuidVal) && this.overviewDetailData && this.overviewDetailData.OpportunityTypeId == 2 && this.OrderTypeId == orderTypeId.New) {
                  /* Opportunity Check : Show and hide the button for residual opportunity */

                  if (this.projectService.count != 0) {
                    switch (+this.ApprovalStage) {
                      case OrderApprovalStage.ForeclosureRequestApprovedbyDM:
                      case OrderApprovalStage.ApprovedbyBFM:
                        this.residualButton = false;
                        break;
                      default:
                        this.residualButton = true;
                    }
                  }
                  /* Ends : Opportunity Check : Show and hide the button for residual opportunity */
                }
                if (this.ApprovalStage == OrderApprovalStage.ApprovedbyBFM) {
                  this.orderAppBfm = true;

                  this.disableCloseStage()
                }

                if (orderDetails.ResponseObject.IsDirectAmendment == false) {
                  if ((this.ApprovalStage == OrderApprovalStage.RejectedbyBFM) || (this.ApprovalStage == OrderApprovalStage.YettobeSubmitted && response.ResponseObject.OrderOwnerRole == true)) {
                    this.endsales1 = true;
                    this.projectService.setSession('endsalesfromorder', this.endsales1);
                  }
                }


                if (((this.router.url == '/opportunity/opportunityview/order') && this.projectService.getSession('BFMNavagationFlag') == true)) {
                  this.moreactionreview = false;
                }
                if (this.router.url == '/opportunity/opportunityview/userdeclarations') {
                  this.moreactionreview = false;
                }

                if (orderTypeId.ErrorHandling == orderDetails.ResponseObject.OrderTypeId || orderTypeId.Trueup == orderDetails.ResponseObject.OrderTypeId || orderTypeId.Negative == orderDetails.ResponseObject.OrderTypeId) {
                  this.incren = false;
                }
                if ( orderTypeId.Negative == orderDetails.ResponseObject.OrderTypeId) {
                      this.incr = false;

                    }


                if (this.projectService.getSession('IsAmendment') == true) {
                  this.incren1 = true;
                }
                if (orderDetails.ResponseObject.IsDirectAmendment == true) {
                  this.directAmendment = true;
                  this.projectService.setSession('directAmendment', this.directAmendment);
                }

                if (response.ResponseObject.BFMRole == true) {
                  this.omperc = true;
                  this.projectService.setSession('omperc', this.omperc);
                }
                if (this.ApprovalStage == OrderApprovalStage.ApprovedbyBFM) {
                  this.omperedit = false;
                  // this.projectService.setSession('omperedit', this.omperedit);
                }

                if (response.ResponseObject.OrderOwnerRole == true || response.ResponseObject.BFMRole == true) {
                  this.OrderBfm = true;
                  this.projectService.setSession('OrderOwnerBFM', this.OrderBfm);
                }

                if (response.ResponseObject.OrderOwnerRole == true){
                  this.shareOrder=true;
                  this.projectService.setSession('ShareOrder', this.shareOrder);   
                }

                if (orderTypeId.ErrorHandling != orderDetails.ResponseObject.OrderTypeId && orderTypeId.Trueup != orderDetails.ResponseObject.OrderTypeId && orderTypeId.Negative != orderDetails.ResponseObject.OrderTypeId) {
                  if (response.ResponseObject.CanCreateAmendment == true) {
                    this.camend = true;
                  }
                }

                //  if(response.ResponseObject.CanCreateAmendment == true){
                //                   if (this.OrderService.parentOrderId) {
                //                 this.savebuton = true
                //  }}


                if (response.ResponseObject.OrderOwnerRole == true && this.ApprovalStage == OrderApprovalStage.ApprovedbyBFM && this.ModificationStatus != OrderModificationRequestStatus.ModificationRequestPendingwithBFM && orderTypeId.Negative != orderDetails.ResponseObject.OrderTypeId) {
                  this.modify = true;
                }
                if (response.ErrorHandling == orderDetails.ResponseObject.OrderTypeId || response.Trueup == orderDetails.ResponseObject.OrderTypeId || response.Negative == orderDetails.ResponseObject.OrderTypeId || (this.OrderService.newAmendmentDetails)) {
                  this.winFlag = false;
                }


                if (response.ResponseObject.OrderOwnerRole == true) {
                  this.orderhi = true;
                }
                this.assignOrder = false;
                if (response.ResponseObject.OrderOwnerRole == true) {
                  this.assignOrder = true;
                }
                if (orderTypeId.Incremental == orderDetails.ResponseObject.OrderTypeId || orderTypeId.Renewal == orderDetails.ResponseObject.OrderTypeId || orderTypeId.ErrorHandling == orderDetails.ResponseObject.OrderTypeId || orderTypeId.Trueup == orderDetails.ResponseObject.OrderTypeId || orderTypeId.Negative == response.ResponseObject.OrderTypeId) {

                  this.residualButton = false;
                }
                if (tab === 'order') {
                  if (this.router.url === '/opportunity/opportunityview/order') {
                    this.opportunityTab = false;
                    console.log("checksau", this.opportunityTab)
                    this.projectService.setSession('opportunityTab', this.opportunityTab);
                  }
                }
                else if (tab != 'order') {
                  this.opportunityTab = true;
                }


                if (orderTypeId.ErrorHandling == orderDetails.ResponseObject.OrderTypeId || orderTypeId.Trueup == orderDetails.ResponseObject.OrderTypeId || orderTypeId.Negative == orderDetails.ResponseObject.OrderTypeId) {
                    this.winFlag = false;
                  
                }
                if (this.projectService.getSession('BFMNavagationFlag') == true) {
                  this.winFlagg = false;
                }

                if (this.projectService.getSession('BFMNavagationFlag') == true) {
                  this.moreAction = false;
                }


                if (orderTypeId.ErrorHandling != orderDetails.ResponseObject.OrderTypeId && orderTypeId.Trueup != orderDetails.ResponseObject.OrderTypeId && orderTypeId.Negative != orderDetails.ResponseObject.OrderTypeId) {
                  if (this.ApprovalStage == OrderApprovalStage.ApprovedbyBFM && !this.OrderService.newAmendmentDetails && response.ResponseObject.BFMRole == false) {
                    this.hardClose1 = true;
                  }
                }



                if (this.projectService.getSession('BFMNavagationFlag') == false && this.ApprovalStage != OrderApprovalStage.RejectedbyBFM) {
                  if ((response.ResponseObject.BFMRole == true && response.ResponseObject.OrderOwnerRole == true) && this.ApprovalStage == OrderApprovalStage.ApprovedbyBFM) {
                    this.retaggg = true;
                  }
                  if (response.ResponseObject.BFMRole == true && this.ApprovalStage == OrderApprovalStage.ApprovedbyBFM) {
                    this.retaggg = true;
                  }
                  if (response.ResponseObject.OrderOwnerRole == true && this.ApprovalStage != OrderApprovalStage.ApprovedbyBFM) {
                    this.retaggg = true;
                  }
                }





                if (response.ResponseObject.OrderOwnerRole == true || response.ResponseObject.BFMRole == true) {

                  if (this.OrderService.parentOrderId) {
                    this.savebuton = true;
                    this.addAlliance = false;
                    this.addIp = false;
                    this.addNewAge = false;
                    this.addService = false;
                    this.accessRight = false;
                  }
                  else {

                    if ((this.ApprovalStage == OrderApprovalStage.ApprovedbyBFM || this.ApprovalStage == OrderApprovalStage.OrderconfirmationApproved)) {
                      if (response.ResponseObject.OrderOwnerRole == true) {
                        this.ApprovedbyBFMcondition = true;
                      }
                      else {
                        this.ApprovedbyBFMcondition = false;
                      }

                      if (response.ResponseObject.CanCreateAmendment) {
                        this.ApprovedbyBFMcondition1 = true;
                      }
                      else {
                        this.ApprovedbyBFMcondition1 = false;
                      }

                    }

                    else {
                      this.ApprovedbyBFMcondition = false;
                      this.ApprovedbyBFMcondition1 = false;
                    }
                    if (this.approvalStageEnableAllarray.some(it => it == this.ApprovalStage) == true) {
                      //  save enable
                      console.log("rolebase", response.ResponseObject);
                      this.orderAceess = true;
                      this.savebuton = true;
                      this.addAlliance = false;
                      this.addIp = false;
                      this.addNewAge = false;
                      this.addService = false;
                      this.accessRight = false;
                      if (assignpopupshow) {
                        this.assignorderPopUp();
                      }

                    }
                    else if ((OrderApprovalStage.ApprovedbyBFM == this.ApprovalStage || OrderApprovalStage.InvoicingRequestApprovedbyBFM == this.ApprovalStage) && ApprovedDateDays <= 3) {
                      //  save enable
                      console.log("rolebase", response.ResponseObject);
                      this.orderAceess = true;
                      this.savebuton = true;
                      this.addAlliance = false;
                      this.addIp = false;
                      this.addNewAge = false;
                      this.addService = false;
                      this.accessRight = false;
                      if (assignpopupshow) {
                        this.assignorderPopUp();
                      }

                    }
                    else if (OrderApprovalStage.ApprovedbyBFM != this.ApprovalStage && OrderApprovalStage.InvoicingRequestApprovedbyBFM != this.ApprovalStage && OrderApprovalStage.ForeclosureRequestApprovedbyDM != this.ApprovalStage) {
                      //  save enable
                      // console.log("rolebase", response.ResponseObject);
                      this.orderAceess = true;
                      this.savebuton = true;
                      this.addAlliance = false;
                      this.addIp = false;
                      this.addNewAge = false;
                      this.addService = false;
                      this.accessRight = false;
                      if (assignpopupshow) {
                        this.assignorderPopUp();
                      }

                    }
                    else {
                      this.orderAceess = true;
                      this.savebuton = false;
                      this.addAlliance = false;
                      this.addIp = false;
                      this.addNewAge = false;
                      this.addService = false;
                      this.accessRight = false;
                      if (assignpopupshow) {
                        this.assignorderPopUp();
                      }
                    }

                    if (response.ResponseObject.BFMRole == true && OrderModificationRequestStatus.ModificationRequestPendingwithBFM) {
                      this.savebuton = true;
                    } else if (response.ResponseObject.BFMRole == true && OrderApprovalStage.PendingWithBFM) {
                      this.savebuton = true;
                    }

                  }

                  if (tab === 'reasons') {
                    this.savebuton = true;
                    this.addAlliance = false;
                    this.addIp = false;
                    this.addNewAge = false;
                    this.addService = false;
                    this.accessRight = false;
                  }
                }
                else {
                  this.ApprovedbyBFMcondition1 = false;
                  this.orderAceess = false;
                  this.savebuton = false;
                  this.addAlliance = false;
                  this.addIp = false;
                  this.addNewAge = false;
                  this.addService = false;
                  this.accessRight = false;
                  // this.OpportunityServices.displayMessageerror("You don't have permission to assign order");
                  if (assignpopupshow) {
                    this.OpportunityServices.displayMessageerror("You don't have permission to assign order");
                  }
                }
              }
              else {
                this.projectService.displayMessageerror(response.Message);
              }

            }, err => {
              this.isLoading = false;
              this.service.loaderhome = false;
              this.projectService.displayerror(err.status);
            })

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
        this.isLoading = false;
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      });

  }
  tabchangePage1(tab?) {
    this.opportunityStatus = this.projectService.getSession('opportunityStatus');
    this.currentstagestate = this.projectService.getSession('currentState');
    console.log("currentstage", this.currentstagestate);
    console.log('opetttweyuyru', this.currentstagestate)


    // this.opportunityName = this.projectService.getSession('opportunityName');
    if (((this.opportunityStatus.toString() == '1' || this.opportunityStatus.toString() == '3') && this.currentstagestate.toString() == "184450004")) {
      if ((tab === 'order' || tab === 'lossreasons' || tab === 'reasons'))
      // if(this.router.url === '/opportunity/opportunityview/order' || this.router.url === '/opportunity/opportunityview/lossreasons' || this.router.url === '/opportunity/opportunityview/reasons')
      {

        this.orderrolebaseapi(false, tab);
      }
      else {
        this.addAlliance = false;
        this.addIp = false;
        this.savebuton = false;
        this.addNewAge = false;
        this.addService = false;
        this.accessRight = false;
      }
    }
    else if ((this.OpportunityStatus1.toString() == '5')) {
      if ((tab === 'lossreasons'))
      // if(this.router.url === '/opportunity/opportunityview/order' || this.router.url === '/opportunity/opportunityview/lossreasons' || this.router.url === '/opportunity/opportunityview/reasons')
      {
        this.addAlliance = false;
        this.addIp = false;
        this.savebuton = true;
        this.addNewAge = false;
        this.addService = false;
        this.accessRight = false;

      }
      else {
        this.addAlliance = false;
        this.addIp = false;
        this.savebuton = false;
        this.addNewAge = false;
        this.addService = false;
        this.accessRight = false;
      }
    }
    else {
      this.fullAccess = false;
      this.addAlliance = false;
      this.addIp = false;
      this.savebuton = false;
      this.addNewAge = false;
      this.addService = false;
      this.accessRight = false;
    }

  }

  overviewPage(tab?) {
    let userGuid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
    console.log("tab1", tab);
    if (this.IsAppirioFlag) {
      this.savebuton = false;
      this.addAlliance = false;
      this.addIp = false;
      this.addNewAge = false;
      this.addService = false;
      this.accessRight = false;
    }
    else {
      if (this.projectService.getSession('IsAmendment') == true) {
        if ((((this.OpportunityStatus1.toString() == '1' || this.OpportunityStatus1.toString() == '3') && ((this.OpportunityStage1).toString() == "184450004"))) || ((this.opportunityStatus.toString() == '1' || this.opportunityStatus.toString() == '3') && this.currentstagestate.toString() == "184450004")) {
          if ((tab === 'order' || tab === 'lossreasons' || tab === 'reasons'))
          // if(this.router.url === '/opportunity/opportunityview/order' || this.router.url === '/opportunity/opportunityview/lossreasons' || this.router.url === '/opportunity/opportunityview/reasons')
          {
            this.orderrolebaseapi(false, tab);
          }
          else {
            this.addAlliance = false;
            this.addIp = false;
            this.savebuton = false;
            this.addNewAge = false;
            this.addService = false;
            this.accessRight = false;
          }
        }
        else if ((this.OpportunityStatus1.toString() == '5')) {
          if ((tab === 'lossreasons'))
          // if(this.router.url === '/opportunity/opportunityview/order' || this.router.url === '/opportunity/opportunityview/lossreasons' || this.router.url === '/opportunity/opportunityview/reasons')
          {
            this.addAlliance = false;
            this.addIp = false;
            this.savebuton = true;
            this.addNewAge = false;
            this.addService = false;
            this.accessRight = false;

          }
          else {
            this.addAlliance = false;
            this.addIp = false;
            this.savebuton = false;
            this.addNewAge = false;
            this.addService = false;
            this.accessRight = false;
          }
        }
        else {
          this.fullAccess = false;
          this.addAlliance = false;
          this.addIp = false;
          this.savebuton = false;
          this.addNewAge = false;
          this.addService = false;
          this.accessRight = false;
        }

      }
      else {
        this.opportunityStatus = this.projectService.getSession('opportunityStatus');
        // this.currentstagestate = this.projectService.getSession('currentState');
        // console.log("this.currentstagestate",this.currentstagestate);
        this.opportunityName = this.projectService.getSession('opportunityName');

        this.accessData1 = this.projectService.getSession('roleObj') || {};
        console.log("access1", this.accessData1);
        this.fullAccess1 = this.projectService.getSession('FullAccess');


        if (this.projectService.restTab) {
          if ((this.router.url === '/opportunity/opportunityview/overview' || this.router.url === '/opportunity/opportunityview/order'))
          // if(this.router.url === '/opportunity/opportunityview/order' || this.router.url === '/opportunity/opportunityview/lossreasons' || this.router.url === '/opportunity/opportunityview/reasons')
          {
            this.savebuton = true;
            this.addAlliance = false;
            this.addIp = false;
            this.addNewAge = false;
            this.addService = false;
          }
          else {
            //this.savebuton = false;
            this.addAlliance = false;
            this.addIp = false;
            this.addNewAge = false;
            this.addService = false;
          }

        }
        else {
          if ((this.opportunityStatus.toString() == '1' && ((this.currentState) != "184450004"))) {
            if (this.fullAccess1 == true) {
              this.fullAccess = true;
              this.addAlliance = false;
              this.addIp = false;
              this.addNewAge = false;
              this.addService = false;
              this.accessRight = true;
              this.savebuton = true;
            }
            else {
              if (this.accessData1) {
                if (this.accessData1.FullAccess == true) {
                  this.fullAccess = true;
                  this.addAlliance = false;
                  this.addIp = false;
                  this.addNewAge = false;
                  this.addService = false;
                  this.accessRight = true;
                  this.savebuton = true;
                }
                else {
                  if (this.accessData1.PartialAccess == true && this.accessData1.FullAccess == false) {
                    if (this.projectService.getSession('currentState').toString() == "184450003" || this.isSimpleOpportunity == true) {
                      this.accessRight = false;
                      this.savebuton = true;
                      this.addAlliance = false;
                      this.addIp = false;
                      this.addNewAge = false;
                      this.addService = false;
                    }
                    else {
                      this.accessRight = true;
                      this.savebuton = true;
                      this.addAlliance = false;
                      this.addIp = false;
                      this.addNewAge = false;
                      this.addService = false;
                    }
                  }
                  else {
                    if (this.accessData1.AddAlliance == true) {
                      this.addAlliance = true;
                      this.savebuton = false;
                      this.accessRight = false;
                    }
                    if (this.accessData1.AddIP == true) {
                      this.addIp = true;
                      this.savebuton = false;
                      this.accessRight = false;
                    }
                    if (this.accessData1.AddNewAgeBusiness == true) {
                      this.addNewAge = true;
                      this.savebuton = false;
                      this.accessRight = false;
                    }
                    if (this.accessData1.AddServiceLine == true) {
                      this.addService = true;
                      this.savebuton = false;
                      this.accessRight = false;
                    }
                    console.log(this.router.url, "router");
                    console.log(((tab === 'overview' || this.router.url === '/opportunity/opportunityview/overview') && (this.accessData1.UserRoles.IsAdvisorFunction == true)), "checkaccess")
                    if (((tab === 'team' || this.router.url === '/opportunity/opportunityview/team') && this.accessData1.IsTeamBuilderSection == true && this.accessData1.IsGainAccess == true) || ((tab === 'overview' || this.router.url === '/opportunity/opportunityview/overview') && (this.accessData1.UserRoles.IsAdvisorFunction == true))) {
                      this.savebuton = true;
                      this.accessRight = false;
                    }
                    else {
                      this.savebuton = false;
                      this.accessRight = false;
                    }
                    let DAspocId=this.projectService.getSession('DaSpocId');
                    if((tab === 'overview' || this.router.url === '/opportunity/opportunityview/overview') && (userGuid == DAspocId)){
                      this.savebuton = true;
                    }
                    else{
                      this.savebuton = false;
                    }

                  }
                }

              }
            }
          }

          else if (((this.opportunityStatus.toString() == '1' || this.opportunityStatus.toString() == '3') && ((this.currentState).toString() == "184450004"))) {
            if ((tab === 'order' || tab === 'lossreasons' || tab === 'reasons') || (this.router.url === '/opportunity/opportunityview/order' || this.router.url === '/order/orderdetails/order' || this.router.url === '/opportunity/opportunityview/lossreasons' || this.router.url === '/opportunity/opportunityview/closereason'))
            // if(this.router.url === '/opportunity/opportunityview/order' || this.router.url === '/opportunity/opportunityview/lossreasons' || this.router.url === '/opportunity/opportunityview/reasons')
            {

              this.orderrolebaseapi(false, tab);

            }
            else {
              this.addAlliance = false;
              this.addIp = false;
              this.savebuton = false;
              this.addNewAge = false;
              this.addService = false;
              this.accessRight = false;
            }
          }
          else if ((this.opportunityStatus.toString() == '5')) {
            if ((tab === 'lossreasons') || this.router.url === '/opportunity/opportunityview/lossreasons')
            // if(this.router.url === '/opportunity/opportunityview/order' || this.router.url === '/opportunity/opportunityview/lossreasons' || this.router.url === '/opportunity/opportunityview/reasons')
            {
              this.addAlliance = false;
              this.addIp = false;
              this.savebuton = true;
              this.addNewAge = false;
              this.addService = false;
              this.accessRight = false;

            }
            else {
              this.addAlliance = false;
              this.addIp = false;
              this.savebuton = false;
              this.addNewAge = false;
              this.addService = false;
              this.accessRight = false;
            }
          }
          else {
            this.fullAccess = false;
            this.addAlliance = false;
            this.addIp = false;
            this.savebuton = false;
            this.addNewAge = false;
            this.addService = false;
            this.accessRight = false;
          }

        }
        if (
          this.projectService.getSession('opportunityStatus').toString() == '2'
          || this.projectService.getSession('opportunityStatus').toString() == '3'
          || this.projectService.getSession('opportunityStatus').toString() == '5'

        ) {
          this.disableLead = false
          this.disableActivity = false

          this.disableFieldsProfile()
        }
        else if (this.projectService.getSession('opportunityStatus').toString() == '184450000') {
          this.disableLead = false
          this.disableActivity = true

          this.disableFieldsProfile()
        }

        this.opportunityQualifier();
        this.getReasonStatus();
      }
    }
  }

  disableFieldsProfile() {

    this.accordianContent.map((it) => {
      {
        if (it.title == 'Profile') {
          it.content.map((it1) => {
            if (it1.label == 'Type') {
              it1.isEditable = false
            }
            if (it1.label == 'Manual probability') {
              it1.isEditable = false
            }
            if (it1.label == 'Est. closure date') {
              it1.isEditable = false
            }
          }
          )
        }
      } return it
    })

  }

  stageIconBackground() {
    const arr = [this.createstage, this.QualifyStage, this.PursuitStage, this.SecureStage];
    arr.map((a, index) => {
      if (a !== null) {
        this.steps[index]['stage'] = false;
      } else {
        this.steps[index]['stage'] = true;
      }
    })
  }








  ManualProbabilityWiningValue;
  ManualProbabilityWiningId;


  qualificationStatusArr: any = []
  profileDetails: any = {}

  getDate(date) {
    if (date) {

      var splitDate = date.toUpperCase().split('T');
      var formatedDate = new Date(splitDate[0]);
      return formatedDate.toISOString()
    }
    else {
      return null;
    }

  }
  accountNameLink = ''
  qualifyCreatedDate = ''
  isNonWTT = false
  isLoadingProfile = false
  profilesSummary() {



    var partialFlag = this.projectService.getSession('roleObj')


    this.accordianContent = [


      {
        'title': 'Profile', 'content': [

          {
            'label': 'Opportunity name',
            'content': ''
          },
          {
            'label': 'Opportunity ID',
            'content': ''
          },
          {
            'label': 'Opportunity owner',
            'content': ''
          },
          {
            'label': 'Account name',
            'content': ''
          },
          {
            'label': 'SBU',
            'content': ''
          },
          {
            'label': 'Vertical',
            'content': ''
          },
          {
            'label': 'Sub-Vertical',
            'content': ''
          },
          {
            'label': 'Est. closure date',
            'content': '',
            'isEditable': true,
            'editTool': 'Update the estimated closure date of the opportunity',
            'tooltip': 'Realistic date of when the Opportunity will be closed and the first Order will be booked. When estimating the date, consider that additional time may be required (for example, for contract negotiations) after the customer has announced the successful bidder.'

          },
          {
            'label': 'Currency',
            'content': '',

          },
          {
            'label': 'TCV',
            'content': '',
            'isEditable': false
          },
          {
            'label': 'ACV',
            'content': '',
            'isEditable': false
          },
          {
            'label': 'TCV in plan forex',
            'content': '',
            'isEditable': false,
            'tooltip': 'Plan currency is the exchange rate at which Wipro current year plan numbers have been finalized at the beginning of the year. This rate will be used for OB reporting and Incentive Calculation.'
          },
          {
            'label': 'ACV in plan forex',
            'content': '',
            'isEditable': false,
            'tooltip': 'Plan currency is the exchange rate at which Wipro current year plan numbers have been finalized at the beginning of the year. This rate will be used for OB reporting and Incentive Calculation.'
          },
          {
            'label': 'TCV in dynamic forex',
            'content': '',
            'isEditable': false,
            'tooltip': 'Dynamic currency is the exchange rate that is in place in the market currently.'
          },
          {
            'label': 'ACV in dynamic forex',
            'content': '',
            'isEditable': false,
            'tooltip': 'Dynamic currency is the exchange rate that is in place in the market currently'
          },
          {
            'label': 'Type',
            'content': '',
            'isEditable': true,
            'editTool': 'Edit'
          },
          {
            'label': 'Base order number',
            'content': '',
            'isEditable': false
          },

          {
            'label': 'StormCast score',
            'content': '',
            'isEditable': false
          },
          {
            'label': 'Manual probability',
            'content': '',
            'isEditable': true,
            'editTool': 'Update Manual probability of winning the opportunity'
          },
          {
            'label': 'RS qualifier status',
            'content': '',
            'isEditable': false
          },
          {
            'label': 'Forecast',
            'content': '',
            'isEditable': false
          },
          {
            'label': 'CRM reference number',
            'content': '',
            'isEditable': false
          },
          {
            'label': 'Status',
            'content': '',
            'isEditable': false
          },
          {
            'label': 'Created date',
            'content': '',
            'isEditable': false
          },

        ]

      },
      {
        'title': 'Toolkit', 'content': [

          {
            'label': 'Stormtracker suite',
            'content': '0 Records'
          },
          {
            'label': 'Relationship Suite',
            'content': 'No'
          },
          {
            'label': 'Management log',
            'content': 'No'
          },
          {
            'label': 'Win strategy',
            'content': 'No'
          },
          {
            'label': 'Competitor strategy',
            'content': 'No'
          },
          {
            'label': 'RAID log',
            'content': 'No'
          }
          // ,
          // {
          //   'label': 'IV P/VP and slide deck',
          //   'content': 'No'
          // },
          // {
          //   'label': 'My digital coach',
          //   'content': 'Available'
          // },
          // {
          //   'label': 'Encounter Plan',
          //   'content': 'No'
          // },
          // {
          //   'label': 'Commitment register',
          //   'content': 'No'
          // },




        ]

      },
      {
        'title': 'Closure details', 'content': [

          {
            'label': 'Win/Loss reasons',
            'content': 'View'
          },
          {
            'label': 'Status reason',
            'content': ''
          },
          {
            'label': 'Order booking',
            'content': ''
          },
          {
            'label': 'Actual close date',
            'content': ''
          },
          {
            'label': 'Soft-close date',
            'content': ''
          },
          {
            'label': 'Hard-close date',
            'content': ''
          }
          ,
          {
            'label': 'Actual revenue',
            'content': ''
          },

        ]

      },
      {
        'title': 'Pricing approval status', 'content': [

          {
            'label': 'Pricing ID',
            'content': ''
          },
          {
            'label': 'Pricing approval status',
            'content': ''
          },
          {
            'label': 'BFM',
            'content': ''
          },
          {
            'label': 'Approval pending with',
            'content': ''
          },
        ]
      },
      {
        'title': 'Opportunity qualifier', 'content': [
          {
            'label': 'Qualification status',
            'content': '',
            'isEditable': true,
            'editTool': 'Edit'
          }
        ]

      },
      {
        'title': 'Staffing details', 'content': [

          // {
          //   'label': 'Request',
          //   'content': 'Not mentioned',

          // },
          // {
          //   'label': 'Forecast submitted date',
          //   'content': 'Not mentioned',

          // },
          {
            'label': 'Initiated date',
            'content': 'Not mentioned',

          }


        ]

      },

      // {
      //   'title': 'SOW details', 'content': [

      //     {
      //       'label': 'SOW ID',
      //       'content': 'Not mentioned',
      //       'isEditable': true

      //     }


      //   ]

      // },
      {
        'title': 'Delivery team', 'content': [
          {
            'deliverycontent': '',
            'sapcontent': ''
          },

        ]

      },
      {
        'title': 'POA Holders', 'content': [

          {
            'label': '',
            'content': '',

          },

          {
            'label': '',
            'content': '',

          },

          {
            'label': '',
            'content': '',

          },

          {
            'label': '',
            'content': '',

          },

          {
            'label': '',
            'content': '',

          }
        ]

      },
      {
        'title': 'Linked activities & leads',

        'content': [
          {
            'actionTitle': 'Activities', 'icon': 'mdi-message-settings-variant',

            'subContent': [
            ]

          },

          {
            'actionTitle': 'Leads', 'icon': 'mdi-rounded-corner',

            'subContent': [

            ]

          }

        ]
      }

    ]

    this.isLoading = true;
    this.isLoadingProfile = true
    let obj = { "Guid": this.projectService.getSession('opportunityId') }
    this.projectService.profileSummary(obj).subscribe(response => {
      this.disableLead = true
      this.disableActivity = true
      this.isLoadingProfile = false

      this.IsNonWT = response.ResponseObject.IsNonWT ? response.ResponseObject.IsNonWT : false;
      console.log("IsNonWT", this.IsNonWT)

      this.forecast.filter(it => {
        if (it.Value == 3) { it.disableField = false; }
      });

      this.accordianContent.map((it) => {
        {
          if (it.title == 'Profile') {
            it.content.map((it1) => {
              if (it1.label == 'Manual probability') {
                it1.isEditable = true
              }
              if (it1.label == 'Est. closure date') {
                it1.isEditable = true
              }
              if (it1.label == 'Type') {
                it1.isEditable = true
              }
            }
            )
          }
          if (it.title == 'Opportunity qualifier') {
            it.content.map((it1) => {
              if (it1.label == 'Qualification status') {
                it1.isEditable = true
              }
            }
            )
          }



        } return it
      })


      if (!response.IsError) {

        if (response.ResponseObject) {
          this.profileDetails = response.ResponseObject;
          this.staffingInitiated = false;
          this.staffingInitiated = this.profileDetails.StaffingDetails ? this.profileDetails.StaffingDetails.IsStaffingInitiated : "";
          var symbol = this.getSymbol(response.ResponseObject.CurrencySymbol)
          symbol = symbol ? symbol : ''
          this.projectService.setSession('currencySymbol', symbol);
          var oppNumber = response.ResponseObject.OpportunityNumber || response.ResponseObject.OpportunityNumber == 0 || response.ResponseObject.OpportunityNumber == '0' ? response.ResponseObject.OpportunityNumber : ''
          this.projectService.setSession('opportunityNumberValue', oppNumber)

          var accountName = response.ResponseObject.Account.Name || response.ResponseObject.Account.Name == 0 || response.ResponseObject.Account.Name == '0' ? response.ResponseObject.Account.Name : '';
          this.projectService.setSession('accountName', accountName)

          var ownerNameValue = response.ResponseObject.OpportunityOwnerName || response.ResponseObject.OpportunityOwnerName == 0 || response.ResponseObject.OpportunityOwnerName == '0' ? response.ResponseObject.OpportunityOwnerName : ''
          this.projectService.setSession('ownerNameValue', ownerNameValue)


          var tcvStoredValue = response.ResponseObject.EstimatedTCVvalue || response.ResponseObject.EstimatedTCVvalue == 0 || response.ResponseObject.EstimatedTCVvalue == '0' ? response.ResponseObject.EstimatedTCVvalue : ''
          this.projectService.setSession('tcvStoredValue', tcvStoredValue)


          var sbuStoredValue = response.ResponseObject.Sbu.Name || response.ResponseObject.Sbu.Name == 0 || response.ResponseObject.Sbu.Name == '0' ? response.ResponseObject.Sbu.Name : ''
          this.projectService.setSession('sbuStoredValue', sbuStoredValue);
          this.CampaignObj.sbuName = sbuStoredValue;

          this.forecastValue = response.ResponseObject.OpportunityForecast ? response.ResponseObject.OpportunityForecast : null;
          // response.ResponseObject.ManualProbabilityWining
          var getCreatedDate = this.getDate(response.ResponseObject.CreatedOn ? response.ResponseObject.CreatedOn : null)
          this.qualifyCreatedDate = getCreatedDate ? getCreatedDate : ''
          console.log(getCreatedDate, 'getCreatedDate')

          this.accountNameLink = response.ResponseObject.Account.Name || response.ResponseObject.Account.Name === 0 || response.ResponseObject.Account.Name === '0' ? response.ResponseObject.Account.Name : '-'
          var valuee = (response.ResponseObject.ManualProbabilityWining ? Number(response.ResponseObject.ManualProbabilityWining) : '-');
          var ManualProbabilityWiningName = this.winningProbabilityData.filter
            ((it) => (it.Value).toString() == valuee)
          this.ManualProbabilityWiningValue = ManualProbabilityWiningName.length > 0 ? ManualProbabilityWiningName[0].Label : '-';
          this.ManualProbabilityWiningId = ManualProbabilityWiningName.length > 0 ? ManualProbabilityWiningName[0].Value : "";
          // alert(this.ManualProbabilityWiningValue);
          var summaryArr = [response.ResponseObject.OpportunityName || response.ResponseObject.OpportunityName === 0 || response.ResponseObject.OpportunityName === '0' ? this.getSymbol(response.ResponseObject.OpportunityName) : '-',
          response.ResponseObject.OpportunityNumber || response.ResponseObject.OpportunityNumber === 0 || response.ResponseObject.OpportunityNumber === '0' ? response.ResponseObject.OpportunityNumber : '-',
          response.ResponseObject.OpportunityOwnerName || response.ResponseObject.OpportunityOwnerName === 0 || response.ResponseObject.OpportunityOwnerName === '0' ? response.ResponseObject.OpportunityOwnerName : '-'
            , response.ResponseObject.Account.Name || response.ResponseObject.Account.Name === 0 || response.ResponseObject.Account.Name === '0' ? response.ResponseObject.Account.Name : '-',
          response.ResponseObject.Sbu.Name || response.ResponseObject.Sbu.Name === 0 || response.ResponseObject.Sbu.Name === '0' ? response.ResponseObject.Sbu.Name : '-',
          response.ResponseObject.Vertical.Name || response.ResponseObject.Vertical.Name === 0 || response.ResponseObject.Vertical.Name === '0' ? response.ResponseObject.Vertical.Name : '-',
          response.ResponseObject.SubVertical.Name || response.ResponseObject.SubVertical.Name === 0 || response.ResponseObject.SubVertical.Name === '0' ? response.ResponseObject.SubVertical.Name : '-',
          response.ResponseObject.EstimatedCloseDate ? this.datePipe.transform(response.ResponseObject.EstimatedCloseDate, "dd-MMM-yyyy") : '-',
          response.ResponseObject.TransactionCurrencyValue ? response.ResponseObject.TransactionCurrencyValue : '-',
          response.ResponseObject.EstimatedTCVvalue || response.ResponseObject.EstimatedTCVvalue === 0 || response.ResponseObject.EstimatedTCVvalue === '0' ? symbol + ' ' + Number(response.ResponseObject.EstimatedTCVvalue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',
          response.ResponseObject.ACVvalue || response.ResponseObject.ACVvalue === 0 || response.ResponseObject.ACVvalue === '0' ? symbol + ' ' + (Number(Number(response.ResponseObject.ACVvalue).toFixed(2))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',
          response.ResponseObject.WiproTCVPlanned || response.ResponseObject.WiproTCVPlanned === 0 || response.ResponseObject.WiproTCVPlanned === '0' ? '$' + ' ' + (Number(Number(response.ResponseObject.WiproTCVPlanned).toFixed(2))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'
            , response.ResponseObject.WiproACVPlanned || response.ResponseObject.WiproACVPlanned === 0 || response.ResponseObject.WiproACVPlanned === '0' ? '$' + ' ' + (Number(Number(response.ResponseObject.WiproACVPlanned).toFixed(2))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',
            "",
            "",
          response.ResponseObject.OpportunityType.Value || response.ResponseObject.OpportunityType.Value === 0 || response.ResponseObject.OpportunityType.Value === '0' ? response.ResponseObject.OpportunityType.Value : '-',
          response.ResponseObject.WiproBaseOrderno || response.ResponseObject.WiproBaseOrderno === 0 || response.ResponseObject.WiproBaseOrderno === '0' ? response.ResponseObject.WiproBaseOrderno : '-',
            // response.ResponseObject.WiproWinPredictorProbability ||   response.ResponseObject.WiproWinPredictorProbability===0 || response.ResponseObject.WiproWinPredictorProbability==='0'?  response.ResponseObject.WiproWinPredictorProbability:'NA',
            "",
          this.ManualProbabilityWiningValue,

          response.ResponseObject.RSQualifierStatus || response.ResponseObject.RSQualifierStatus === 0 || response.ResponseObject.RSQualifierStatus === '0' ? response.ResponseObject.RSQualifierStatus : '-',

          response.ResponseObject.OpportunityForecast ? response.ResponseObject.OpportunityForecast : '-',
          response.ResponseObject.CrmReferenceNumber || response.ResponseObject.CrmReferenceNumber === 0 || response.ResponseObject.CrmReferenceNumber === '0' ? response.ResponseObject.CrmReferenceNumber : '-',
          response.ResponseObject.StatusName || response.ResponseObject.StatusName === 0 || response.ResponseObject.StatusName === '0' ? response.ResponseObject.StatusName : '-',
          getCreatedDate ? (this.datePipe.transform(getCreatedDate, "dd-MMM-yyyy")) : '-'
          ];
          this.isNonWTT = response.ResponseObject.IsNonWT ? true : false

          this.accountNamee = response.ResponseObject.Account.Name || response.ResponseObject.Account.Name === 0 || response.ResponseObject.Account.Name === '0' ? response.ResponseObject.Account.Name : '-'
          this.projectService.setSession('oppOwnerNamee', response.ResponseObject.OpportunityOwnerId ? response.ResponseObject.OpportunityOwnerId : '-')

          if (this.forecast.filter((it) => (it.Value) == summaryArr[20]).length > 0) {
            var a = this.forecast.filter((it) => (it.Value) == summaryArr[20])
            summaryArr[20] = a[0].Label
          }
          else {
            summaryArr[20] = '-'
          }


          this.accordianContent = this.accordianContent.map((it) => {
            {
              if (it.title == 'Profile') {

                for (var i = 0; i < it.content.length; i++) {
                  // //console.log("content",it.content[i].content);
                  it.content[i].content = summaryArr[i];
                }

              }



            }
            return it
          })


          var extendedDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 180);
          var closureDate = new Date(response.ResponseObject.EstimatedCloseDate);
          var roleObjTemp = this.projectService.getSession('roleObj')


          if (!this.projectService.getSession('FullAccess')) {
            if ( roleObjTemp &&
              !roleObjTemp.PartialAccess ? true : false

                || this.projectService.getSession('opportunityStatus').toString() != '1') {


              this.accordianContent.map((it) => {
                {
                  if (it.title == 'Profile') {
                    it.content.map((it1) => {
                      if (it1.label == 'Est. closure date') {
                        it1.isEditable = false
                      }
                    }
                    )
                  }
                } return it
              }
              )

            }
          }


          if ((this.projectService.getSession('FullAccess') && (summaryArr[15] ? summaryArr[15].toString().toUpperCase() : '') == "NEW") &&
            this.projectService.getSession('opportunityStatus').toString() == '1') {

            // this.accordianContent.map((it) => {
            //             {
            //          if (it.title == 'Profile') {
            //            it.content[14].isEditable = true;
            //        }
            //    }

            //             return it
            //           })

            this.accordianContent.map((it) => {
              {
                if (it.title == 'Profile') {
                  it.content.map((it1) => {
                    if (it1.label == 'Type') {
                      it1.isEditable = true
                    }
                  }
                  )
                }
              } return it
            })

          }

          else {
            //  this.accordianContent.map((it) => {
            //           {
            //        if (it.title == 'Profile') {
            //          it.content[14].isEditable = false;
            //      }
            //  }

            //           return it
            //         })



            this.accordianContent.map((it) => {
              {
                if (it.title == 'Profile') {
                  it.content.map((it1) => {
                    if (it1.label == 'Type') {
                      it1.isEditable = false
                    }
                  }
                  )
                }
              } return it
            })


          }



          if (this.projectService.getSession('currentState').toString() == '184450000' ||
            !this.projectService.getSession('currentState') ||
            this.projectService.getSession('opportunityStatus').toString() == '184450000'
            || this.projectService.getSession('opportunityStatus').toString() == '2'
            || this.projectService.getSession('opportunityStatus').toString() == '3'
            || this.projectService.getSession('opportunityStatus').toString() == '5'


          ) {

            //  this.accordianContent.map((it) => {
            //     {

            //       if (it.title == 'Profile') {

            //         it.content[18].isEditable = false;

            //       }

            //     }

            //     return it
            //   })


            this.accordianContent.map((it) => {
              {
                if (it.title == 'Profile') {
                  it.content.map((it1) => {
                    if (it1.label == 'Manual probability') {
                      it1.isEditable = false
                    }
                  }
                  )
                }
              } return it
            })



            this.forecast.filter(it => {
              if (it.Value == 3) { it.disableField = false; }
            });
          }
          else {

            // this.accordianContent.map((it) => {
            //   {

            //     if (it.title == 'Profile') {

            //       it.content[18].isEditable = true;

            //     }

            //   }

            //   return it
            // })

            this.accordianContent.map((it) => {
              {
                if (it.title == 'Profile') {
                  it.content.map((it1) => {
                    if (it1.label == 'Manual probability') {
                      it1.isEditable = true
                    }
                  }
                  )
                }
              } return it
            })


            if (closureDate <= extendedDate && this.ManualProbabilityWiningValue >= 10) {
              this.forecast.filter(it => {
                if (it.Value == 2 || (it.Value) == 3) { it.disableField = false; }
              });
            }
            if (closureDate <= extendedDate && this.ManualProbabilityWiningValue >= 75) {
              this.forecast.filter(it => {
                if (it.Value == 1 || (it.Value) == 3) { it.disableField = false; }
              });
            }




          }

          if (this.projectService.getSession('currentState').toString() == '184450000') {

            //   this.accordianContent =   (( this.accordianContent)).filter((it) => {
            //         {
            // if (it.title == 'Profile') {
            //          it.content.splice(18,1)

            //           }

            //         }

            //         return it
            //       })


            this.accordianContent = this.accordianContent.filter((it) => {
              {
                if (it.title == 'Profile') {
                  it.content.map((it1, index) => {
                    if (it1.label == 'Manual probability') {
                      (it.content.splice(index, 1))
                    }
                  }
                  )
                }
              } return it
            })

          }


          if ((summaryArr[15] ? summaryArr[15].toString().toUpperCase() : '') == "NEW") {
            // this.accordianContent =   (( this.accordianContent)).filter((it) => {
            //           {
            //   if (it.title == 'Profile') {
            //            it.content.splice(15,1)

            //             }

            //           }

            //           return it
            //         })

            this.accordianContent = this.accordianContent.filter((it) => {
              {
                if (it.title == 'Profile') {
                  it.content.map((it1, index) => {
                    if (it1.label == 'Base order number') {
                      (it.content.splice(index, 1))
                    }
                  }
                  )
                }
              } return it
            })

          }

          this.qualificationStatusArr = response.ResponseObject.QualificationStatus
          this.qualifierId = response.ResponseObject.QualificationStatus ? Number(response.ResponseObject.QualificationStatus.QualificationStatusId) : ''
          //console.log(response.ResponseObject.QualificationStatus ? Number(response.ResponseObject.QualificationStatus.QualificationStatusId) : '', 'quallll')
          var qualifierArr = this.qualifierData.filter((it) => (it.Id) == this.qualifierId)
          this.qualifierValue = qualifierArr.length > 0 ? qualifierArr[0].Value : '-';

          this.accordianContent.map((it) => {
            {

              if (it.title == 'Opportunity qualifier') {

                it.content[0].content = this.qualifierValue;

              }

            }

            return it
          })

          var type = response.ResponseObject.OpportunityType.Id || response.ResponseObject.OpportunityType.Id === 0 || response.ResponseObject.OpportunityType.Id === '0' ? response.ResponseObject.OpportunityType.Id : 2
          if (type == 1 || type == 3) {
            this.accordianContent = this.accordianContent.filter((it) =>
              it.title != 'Staffing details'
            )
          }

          this.accordianContent.map((it) => {
            {
              if (it.title == 'Staffing details') {
                it.content.map((it1) => {
                  if (it1.label == 'Initiated date') {
                    it1.content = !response.ResponseObject.StaffingDetails ? '-' : response.ResponseObject.StaffingDetails.StaffingInitiatedOn ? this.datePipe.transform(response.ResponseObject.StaffingDetails.StaffingInitiatedOn, "dd-MMM-yyyy") : '-'

                  }
                }
                )
              }
            } return it
          })


          if (partialFlag) {
            if ((this.projectService.getSession('opportunityStatus').toString() == '1') &&
              (!this.projectService.getSession('FullAccess')) &&
              (!partialFlag.PartialAccess)) {
              this.accordianContent.map((it) => {
                {
                  if (it.title == 'Profile') {
                    it.content.map((it1) => {
                      if (it1.label == 'Manual probability') {
                        it1.isEditable = false
                      }
                    }
                    )
                  }
                } return it
              })

              this.forecast.filter(it => {
                if (it.Value == 2 || (it.Value) == 3 || it.Value == 1) { it.disableField = true; }
              });
            }
          }

          if (this.projectService.getSession('opportunityStatus').toString() == '1' ||
            this.projectService.getSession('opportunityStatus').toString() == '2' ||
            this.projectService.getSession('opportunityStatus').toString() == '5') {
            this.accordianContent = this.accordianContent.filter((it) =>
              it.title != 'Closure details'
            )

          }

          //console.log('accordian', this.accordianContent);
          if (this.isNonWTT) {
            this.accordianContent = this.accordianContent.filter((it) => it.title != 'Pricing approval status')
          }
          this.closureDetails()
          this.activityData();
          this.leadData();
          this.searchPaoHolders()
          this.deliveryteamMethode();

          this.rsqualifierApi()
          this.pricingDetails()
          this.forexValue(response.ResponseObject.DynamicCurrencyExchangeRate, symbol, response.ResponseObject.EstimatedTCVvalue, response.ResponseObject.ACVvalue, response.ResponseObject.TransactionCurrencyId);
        }
        else {

        }
        this.isLoading = false;
      }
      else {
        this.projectService.displayMessageerror(response.Message);
        this.isLoading = false;
      }
      this.isLoading = false;

    },
      err => {
        this.isLoadingProfile = false
        this.isLoading = false;
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      }
    );

    console.log(this.accordianContent, 'content1')
  }

  rsqualifierApi() {
    let body =
      { "Guid": this.OpportunityServices.getSession('opportunityId') }
    this.OpportunityServices.getRsStatus(body).subscribe(res => {


      if (!res.IsError) {
        // this.accordianContent.map((it) => {
        //   {

        //     if (it.title == 'Profile') {

        //       if (it.content[16].label == 'StormCast score') {
        //         it.content[16].content = res.ResponseObject.StormCastScore || res.ResponseObject.StormCastScore == 0 || res.ResponseObject.StormCastScore == '0' ? res.ResponseObject.StormCastScore : 'NA'

        //       }
        //       if (it.content[17].label == 'StormCast score') {
        //         it.content[17].content = res.ResponseObject.StormCastScore || res.ResponseObject.StormCastScore == 0 || res.ResponseObject.StormCastScore == '0' ? res.ResponseObject.StormCastScore : 'NA'
        //       }

        //       if (it.content[17].label == 'RS qualifier status') {
        //         it.content[17].content = res.ResponseObject.QuaifierStatus || res.ResponseObject.QuaifierStatus == 0 || res.ResponseObject.QuaifierStatus == '0' ? res.ResponseObject.QuaifierStatus : 'NA'
        //       }
        //       if (it.content[18].label == 'RS qualifier status') {
        //         it.content[18].content = res.ResponseObject.QuaifierStatus || res.ResponseObject.QuaifierStatus == 0 || res.ResponseObject.QuaifierStatus == '0' ? res.ResponseObject.QuaifierStatus : 'NA'
        //       }
        //       if (it.content[19].label == 'RS qualifier status') {
        //         it.content[19].content = res.ResponseObject.QuaifierStatus || res.ResponseObject.QuaifierStatus == 0 || res.ResponseObject.QuaifierStatus == '0' ? res.ResponseObject.QuaifierStatus : 'NA'

        //       }

        //     }

        //   }

        //   return it
        // })

        this.accordianContent.map((it) => {
          {
            if (it.title == 'Profile') {
              it.content.map((it1) => {
                if (it1.label == 'StormCast score') {
                  it1.content = res.ResponseObject.StormCastScore || res.ResponseObject.StormCastScore === 0 || res.ResponseObject.StormCastScore === '0' ? res.ResponseObject.StormCastScore : '-'

                }
                if (it1.label == 'RS qualifier status') {
                  it1.content = res.ResponseObject.QuaifierStatus || res.ResponseObject.QuaifierStatus === 0 || res.ResponseObject.QuaifierStatus === '0' ? res.ResponseObject.QuaifierStatus : '-'
                }
              }
              )
            }
          } return it
        })
      }
      else {
        this.OpportunityServices.displayMessageerror(res.Message);
      }
    },
      err => {
        this.isLoading = false;
        this.service.loaderhome = false;
        this.OpportunityServices.displayerror(err.status);
      }
    )
  }


  getSymbol(data) {
    data = this.escapeSpecialChars(data);
    return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
  }
  
  escapeSpecialChars(jsonString) {
    return jsonString.replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t")
        .replace(/\f/g, "\\f");
  
  }

  activityDetails = [];

  activityData() {

    let obj = { "Guid": this.projectService.getSession('opportunityId') }
    this.isLoading = true;
    this.projectService.activityData(obj).subscribe(response => {

      if (!response.IsError) {

        if (response.ResponseObject && (Array.isArray(response.ResponseObject) ? response.ResponseObject.length > 0 : false)) {
          this.accordianContent = this.accordianContent.map((it) => {
            {
              if (it.title == 'Linked activities & leads') {
                it.content[0].subContent = []
                for (var i = 0; i < response.ResponseObject.length; i++) {
                  this.activityDetails = it.content[0].subContent.push({
                    'accountName': 'Reimagine singtel procurement process',
                    //  'account': 'Cust Mtg - Lead development',
                    'account': '',
                    'Name': response.ResponseObject[i].SubjectName ? response.ResponseObject[i].SubjectName : '',
                    AppointmentOpportunityId: response.ResponseObject[i].AppointmentOpportunityId ? response.ResponseObject[i].AppointmentOpportunityId : '',
                    ActivityId: response.ResponseObject[i].ActivityId ? response.ResponseObject[i].ActivityId : '',
                    'ownerr': response.ResponseObject[i].OwnerId ? response.ResponseObject[i].OwnerId : '',
                    'ownerN': response.ResponseObject[i].OwnerName ? response.ResponseObject[i].OwnerName : ''


                  })
                }
              }

            }
            return it
          })
        }
        else {
          this.accordianContent = this.accordianContent.map((it) => {
            {
              if (it.title == 'Linked activities & leads') {
                it.content[0].subContent = []

              }

            }
            return it
          })
        }

      }
      else {
        this.projectService.displayMessageerror(response.Message);
      }
      this.isLoading = false;
    },
      err => {
        this.isLoading = false;
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      }
    );


  }



  leadDetail = [];
  leadData() {
    let obj = { "Guid": this.projectService.getSession('opportunityId') }
    this.isLoading = true;
    this.projectService.leadData(obj).subscribe(response => {


      if (!response.IsError) {

        if (response.ResponseObject && (Array.isArray(response.ResponseObject) ? response.ResponseObject.length > 0 : false)) {


          this.accordianContent = this.accordianContent.map((it) => {



            {
              if (it.title == 'Linked activities & leads') {

                it.content[1].subContent = []
                for (var i = 0; i < response.ResponseObject.length; i++) {
                  this.leadDetail = it.content[1].subContent.push({
                    'accountName': 'Lead name',
                    'Name': response.ResponseObject[i].Title ? response.ResponseObject[i].Title : '',
                    "LeadGuid": response.ResponseObject[i].Guid ? response.ResponseObject[i].Guid : '',
                    "mapGuid": response.ResponseObject[i].MapGuid ? response.ResponseObject[i].MapGuid : '',
                    'ownerr': response.ResponseObject[i].OwnerId ? response.ResponseObject[i].OwnerId : '',
                    'ownerN': response.ResponseObject[i].OwnerName ? response.ResponseObject[i].OwnerName : ''



                  })
                }
              }

            }
            return it
          })
        }
        else {
          this.accordianContent = this.accordianContent.map((it) => {
            {
              if (it.title == 'Linked activities & leads') {
                it.content[1].subContent = []

              }

            }
            return it
          })
        }

      }
      else {
        this.projectService.displayMessageerror(response.Message);
      }
      this.isLoading = false;
    },
      err => {
        this.isLoading = false;
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      }
    );


  }














  forexValue(currencyExhange, symbol, tcv, acv, currencyId) {
    console.log(currencyExhange, 'currencyExhange')
    this.projectService.setSession('currencyId', currencyId ? currencyId : '')
    if (this.projectService.getSession('opportunityStatus').toString() == '184450000'
      || this.projectService.getSession('opportunityStatus').toString() == '2'
      || this.projectService.getSession('opportunityStatus').toString() == '3'
      || this.projectService.getSession('opportunityStatus').toString() == '5'

    ) {
      this.accordianContent.map((it) => {
        {
          if (it.title == 'Profile') {
            it.content.map((it1) => {
              if (it1.label == 'Type') {
                it1.isEditable = false
              }
              if (it1.label == 'Manual probability') {
                it1.isEditable = false
              }
              if (it1.label == 'Est. closure date') {
                it1.isEditable = false
              }
            }
            )
          }

          if (it.title == 'Opportunity qualifier') {
            it.content.map((it1) => {
              it1.isEditable = false

            }
            )
          }

        } return it
      })

      this.forecast.filter(it => {
        if (it.Value == 2 || (it.Value) == 3 || it.Value == 1) { it.disableField = true; }
      });
    }
    // if (currencyId) {
    // let body = { "Guid": currencyId }
    // this.isLoading = true;

    // this.projectService.forexValue(body).subscribe(response => {
    //  response.ResponseObject.Name
    // if (!response.IsError) {

    // if (response.ResponseObject && (Array.isArray(response.ResponseObject) ? response.ResponseObject.length > 0 : false)) {
    if (currencyExhange == null || currencyExhange == undefined) {

      this.accordianContent = this.accordianContent.map((it) => {
        {
          if (it.title == 'Profile') {

            it.content[13].content = '-'


            it.content[14].content = '-'
          }

        }
        return it
      })
    }

    else {
      this.accordianContent = this.accordianContent.map((it) => {
        {
          if (it.title == 'Profile') {


            if ((tcv || tcv == 0) && (currencyExhange)) {
              it.content[13].content = '$' + ' ' + Number((tcv / Number(currencyExhange)).toFixed(2)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
            else {
              it.content[13].content = '-'
            }

            if ((acv || acv == 0) && (currencyExhange)) {
              it.content[14].content = '$' + ' ' + Number((acv / Number(currencyExhange)).toFixed(2)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
            else {
              it.content[14].content = '-'
            }
          }

        }
        return it
      })
    }
    // }
    // else {
    //   this.accordianContent = this.accordianContent.map((it) => {
    //     {
    //       if (it.title == 'Profile') {

    //         it.content[13].content = '-'
    //         it.content[14].content = '-'
    //       }

    //     }
    //     return it
    //   })
    // }

    // }
    // else {
    //   this.projectService.displayMessageerror(response.Message);
    // }
    this.isLoading = false;
    this.toolkitData()

    // },
    //   err => {
    //     this.isLoading = false;
    //     this.service.loaderhome = false;
    //     this.projectService.displayerror(err.status);
    //   }
    // );
    // }

    //console.log(this.accordianContent, 'this.accordianContentthis.accordianContent');
  }

  goBack() {
    this.router.navigate(['/opportunity/opportunityview/overview']);
    this.projectService.ProceedQualify = false;
    this.projectService.CallOverviewPageToValidateForm();
    this.projectService.restTab = false;
    this.projectService.initiateObButton = false;
    this.projectService.orderpagestart = false;
    if (this.projectService.restTab == false) {
      this.savebuton = true;
    }
    else {
      this.savebuton = false;
    }


  }



  backbutton2() {
    if (this.OrderService.parentOrderId || this.projectService.getSession('IsAmendment') == true || this.projectService.getSession('BFMNavagationFlag') == true) {
      this.router.navigate(['/order']);
    }
    else {


      if (this.router.url === '/opportunity/opportunityview/overview') {
        // if (this.service.dirtyflag) {
        //   this.openConfirmPopup();
        //   let dialogData = this.getNotification().subscribe(res => {

        //     if (res.text == true) {

        //       this.router.navigate(['/opportunity/allopportunity']);
        //       dialogData.unsubscribe();
        //     }
        //     else {
        //       dialogData.unsubscribe();
        //       this.router.navigate(['/opportunity/opportunityview/overview']);

        //     }
        //   });
        // }
        // else {
        sessionStorage.setItem('pinStatusFlag', 'true');
        if (sessionStorage.getItem('routePage') ? sessionStorage.getItem('routePage') == 'account' : false) {
          this.router.navigate(['/accounts/accountopportunity/allopportunity']);

        }
        else {
          this.router.navigate(['/opportunity/allopportunity']);
        }
        //}
      }
      //bsp
      if (this.router.url === '/opportunity/opportunityview/businesssolution') {
        if (this.service.dirtyflag) {
          this.openConfirmPopup();
          let dialogData = this.getNotification().subscribe(res => {

            if (res.text == true) {
              this.router.navigate(['/opportunity/opportunityview/overview']);
              // this.router.navigate(['/opportunity/allopportunity']);
              dialogData.unsubscribe();
            }
            else {
              dialogData.unsubscribe();
              this.router.navigate(['/opportunity/opportunityview/businesssolution']);

            }
          });
        }
        else {
          this.router.navigate(['/opportunity/opportunityview/overview']);
          this.tabchangePage('overview');
        }
      }
      //competitor
      if (this.router.url === '/opportunity/opportunityview/competitor') {
        if (this.service.dirtyflag) {
          this.openConfirmPopup();
          let dialogData = this.getNotification().subscribe(res => {

            if (res.text == true) {
              this.router.navigate(['/opportunity/opportunityview/overview']);

              dialogData.unsubscribe();
            }
            else {
              dialogData.unsubscribe();
              this.router.navigate(['/opportunity/opportunityview/competitor']);

            }
          });
        }
        else {
          this.router.navigate(['/opportunity/opportunityview/overview']);
          this.tabchangePage('overview');
        }
      }
      //team
      if (this.router.url === '/opportunity/opportunityview/team') {
        if (this.service.dirtyflag) {
          this.openConfirmPopup();
          let dialogData = this.getNotification().subscribe(res => {

            if (res.text == true) {
              this.router.navigate(['/opportunity/opportunityview/overview']);
              // this.router.navigate(['/opportunity/allopportunity']);
              dialogData.unsubscribe();
            }
            else {
              dialogData.unsubscribe();
              this.router.navigate(['/opportunity/opportunityview/team']);

            }
          });
        }
        else {
          this.router.navigate(['/opportunity/opportunityview/overview']);
          this.tabchangePage('overview');
        }
      }
      //deal influencer
      if (this.router.url === '/opportunity/opportunityview/deal') {

        if (this.service.dirtyflag) {
          this.openConfirmPopup();
          let dialogData = this.getNotification().subscribe(res => {

            if (res.text == true) {
              this.router.navigate(['/opportunity/opportunityview/overview']);
              // this.router.navigate(['/opportunity/allopportunity']);
              dialogData.unsubscribe();
            }
            else {
              dialogData.unsubscribe();
              this.router.navigate(['/opportunity/opportunityview/deal']);

            }
          });
        }
        else {
          this.router.navigate(['/opportunity/opportunityview/overview']);
          this.tabchangePage('overview');
        }
      }
      //contracts
      if (this.router.url === '/opportunity/opportunityview/contracts') {
        if (this.service.dirtyflag) {
          this.openConfirmPopup();
          let dialogData = this.getNotification().subscribe(res => {

            if (res.text == true) {
              this.router.navigate(['/opportunity/opportunityview/overview']);
              //this.router.navigate(['/opportunity/allopportunity']);
              dialogData.unsubscribe();
            }
            else {
              dialogData.unsubscribe();
              this.router.navigate(['/opportunity/opportunityview/contracts']);

            }
          });
        }
        else {
          this.router.navigate(['/opportunity/opportunityview/overview']);
        }
      }
      //order
      if (this.router.url === '/opportunity/opportunityview/order') {
        if (this.service.dirtyflag) {
          this.openConfirmPopup();
          let dialogData = this.getNotification().subscribe(res => {

            if (res.text == true) {
              this.router.navigate(['/opportunity/opportunityview/overview']);
              //this.router.navigate(['/opportunity/allopportunity']);
              dialogData.unsubscribe();
            }
            else {
              dialogData.unsubscribe();
              this.router.navigate(['/opportunity/opportunityview/order']);

            }
          });
        }
        else {
          this.router.navigate(['/order']);
          this.tabchangePage('overview');
        }
      }
      ///closereason
      if (this.router.url === '/opportunity/opportunityview/closereason') {
        if (this.service.dirtyflag) {
          this.openConfirmPopup();
          let dialogData = this.getNotification().subscribe(res => {

            if (res.text == true) {
              this.router.navigate(['/opportunity/opportunityview/overview']);
              //this.router.navigate(['/opportunity/allopportunity']);
              dialogData.unsubscribe();
            }
            else {
              dialogData.unsubscribe();
              this.router.navigate(['/opportunity/opportunityview/closereason']);

            }
          });
        }
        else {
          this.router.navigate(['/opportunity/opportunityview/overview']);
          this.tabchangePage('overview');
        }
      }
      //lossreason
      if (this.router.url === '/opportunity/opportunityview/lossreasons') {
        if (this.service.dirtyflag) {
          this.openConfirmPopup();
          let dialogData = this.getNotification().subscribe(res => {

            if (res.text == true) {
              this.router.navigate(['/opportunity/opportunityview/overview']);
              //this.router.navigate(['/opportunity/allopportunity']);
              dialogData.unsubscribe();
            }
            else {
              dialogData.unsubscribe();
              this.router.navigate(['/opportunity/opportunityview/lossreasons']);

            }
          });
        }
        else {
          this.router.navigate(['/opportunity/opportunityview/overview']);
          this.tabchangePage('overview');
        }
      }
    }

  }
  cancelstepbtn() {
    if (this.projectService.count > 0) {
      this.projectService.count = this.projectService.count - 1;
    }
  }



  // BFM Approval --Subbu changes start
  bfm_subscription: any;
  currentDate = new Date().toISOString();

  orderId;
  isNonWT;
  processInstanceId;
  contractSigned;
  approvalType;
  approvalTypeId;
  approvalStage;
  approvalStageId;
  oppertunityName;
  lookup_orderId;
  BFM_onHold_count;
  accountId;

  BFM_ApproveBtn: boolean;
  BFM_RejectBtn: boolean;
  BFM_OnholdBtn: boolean;
  BFM_Onhold_Disable: boolean;
  BFM_reject_Disable: boolean;
  BFM_approve_Disable: boolean = true;
  BFM_approve_comment: boolean = false;

  getBFMData() {
    let data = this.projectService.getSession('bfm_order_data')
    // this.orderService.bfm_data.subscribe(data => {
    console.log("child data is", data);
    this.orderId = data.orderBookingId;
    this.isNonWT = data.nonWTFlag,
      this.processInstanceId = data.CommundaProcessId,
      this.contractSigned = data.isSigned,
      this.approvalType = data.ApprovalType,
      this.approvalTypeId = data.ApprovalTpyeId,
      this.approvalStage = data.approvalStage,
      this.approvalStageId = data.approvalStageId,
      this.oppertunityName = data.OpportunityName,
      this.lookup_orderId = data.OrderId,
      this.BFM_onHold_count = data.BFMOnholdCount,
      this.accountId = data.AccountID
    console.log("child data is..............", this.orderId, this.isNonWT, this.processInstanceId, this.approvalTypeId);
    console.log("onhold count is", this.BFM_onHold_count);
    //  BFM on-hold count disable button validation start here
    // if (this.BFM_onHold_count > 1) {
    //   this.BFM_Onhold_Disable = true;
    // }
    // else {
    //   this.BFM_Onhold_Disable = false;
    // }
    //  BFM on-hold count disable button validation end here

    //  BFM approve, reject and on-hold btns disabled when bfm rejected the order validation start here
    if (this.approvalStageId == OrderApprovalStage.PendingWithBFM && this.isNonWT == false) {
      this.BFM_Onhold_Disable = false;
      this.BFM_reject_Disable = false;
      this.BFM_approve_Disable = false;
      this.bfm_subscription = this.OrderService.getBFMStatus().subscribe(data => {
        console.log("bfm btn status is", data);
        this.BFM_approve_comment = data;
      });
      if (this.BFM_onHold_count > 1) {
        this.BFM_Onhold_Disable = true;
      }
      else {
        this.BFM_Onhold_Disable = false;
      }
    }

    else if (this.approvalStageId == OrderApprovalStage.PendingWithBFM && this.isNonWT == true) {
      this.BFM_Onhold_Disable = false;
      this.BFM_reject_Disable = false;
      this.BFM_approve_Disable = false;
      if (this.BFM_onHold_count > 1) {
        this.BFM_Onhold_Disable = true;
      }
      else {
        this.BFM_Onhold_Disable = false;
      }
    }

    else if (this.approvalStageId == OrderApprovalStage.InvoicingRequestPendingwithBFM) {
      this.BFM_reject_Disable = false
      this.BFM_approve_Disable = false;
    }
    else {
      this.BFM_Onhold_Disable = true;
      this.BFM_reject_Disable = true;
      this.BFM_approve_Disable = true;
    }
    //  BFM approve, reject and on-hold btns disabled when bfm rejected the order validation end here

    // BFM approve, reject and on-hold button enable and disable based on ordertype validation starts here
    if (this.approvalTypeId == orderApprovalType.Order) {
      this.BFM_ApproveBtn = true;
      this.BFM_RejectBtn = true;
      this.BFM_OnholdBtn = true;
    }
    else if (this.approvalTypeId == orderApprovalType.Invoicing) {
      this.BFM_ApproveBtn = true;
      this.BFM_RejectBtn = true;
      this.BFM_OnholdBtn = false;
    }
    else if (this.approvalTypeId == orderApprovalType.ConfirmedOrderApproval) {
      this.BFM_ApproveBtn = true;
      this.BFM_RejectBtn = true;
      this.BFM_OnholdBtn = true;
    } else if (this.approvalTypeId == orderApprovalType.Amendment) {
      this.BFM_ApproveBtn = true;
      this.BFM_RejectBtn = true;
      this.BFM_OnholdBtn = true;
    } else if (this.approvalTypeId == orderApprovalType.NegativeAmendmentApproval) {
      this.BFM_ApproveBtn = true;
      this.BFM_RejectBtn = true;
      this.BFM_OnholdBtn = false;
    }
    // BFM approve, reject and on-hold button enable and disable based on ordertype validation end here
    // })
  }

  approveOrder(): void {
    if (this.approvalTypeId == orderApprovalType.Order || this.approvalTypeId == orderApprovalType.Amendment || this.approvalTypeId == orderApprovalType.NegativeAmendmentApproval || this.approvalTypeId == orderApprovalType.ConfirmedOrderApproval) {
      const dialogRef = this.dialog.open(OrderapprovepopupComponent, {
        width: '600px',
        data: {
          OrderId: this.orderbookingId,
          BFMApprComment: this.BFM_approve_comment
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // order approval
          if (result.flag == 'Yes' && (this.approvalTypeId == orderApprovalType.Order || this.approvalTypeId == orderApprovalType.Amendment || this.approvalTypeId == orderApprovalType.NegativeAmendmentApproval) && this.approvalStageId == OrderApprovalStage.PendingWithBFM) {
            console.log("bfm approval payload is", result);
            let approveOderPayload = {
              orderID: this.orderId,
              approvalreason: result.reason,
              approvaltype: this.approvalType,
              orderType: this.contractSigned ? "Clean Order" : "",
              isWT: this.isNonWT ? "No" : "Yes",
              decisiondate: this.currentDate,
              onholdreason: "",
              rejectionreason: "",
              resubmissionreason: "",
              // ownerid: "5E87EF80-4E50-E911-A830-000D3AA058CB",
              ownerid: this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
              entity: this.isNonWT ? "systemusers" : "systemusers",
              statuscode: "Approve",
              processinstanceid: this.processInstanceId,
              exceptionApproval: result.ExceptionApproval,
              approvaldoc: result.ApprovalDoc,
              locationId: result.location,
              msaNumber: result.MSANumber,
              msaStartDate: result.MSAStartDate,
              msaEndDate: result.MSAEndDate,
              attachments: result.UploadDocs,
              accountId: this.accountId,
              OBStatus: "Approved",
              DealHeaderID: !this.isNonWT ? this.projectService.getSession('dealID') : '',
              PricingId: !this.isNonWT ? this.projectService.getSession('pricingID') : '',
              OppGuid: !this.isNonWT ? this.projectService.getSession('opportunityId') : ''
            }
            // come here
            console.log("payload is......", approveOderPayload);
            this.service.loaderhome = true;
            this.OrderService.reject_onhold_approval_BFMOrder(approveOderPayload).subscribe(res => {
              if (!res.IsError) {
                console.log("BFM response is", res);
                this.service.loaderhome = false;
                this.projectService.displayMessageerror("Order approved successfully");
                this.projectService.setSession('loadBFMScreen', true);
                this.router.navigate(['/order'])
              }
              else {
                this.service.loaderhome = false;
                this.projectService.displayMessageerror(res.Message);
              }
            },
              err => {
                this.isLoading = false;
                this.service.loaderhome = false;
                this.projectService.displayerror(err.status);
              });

          }

          // Confirm order approval
          else if (result.flag == 'Yes' && this.approvalTypeId == orderApprovalType.ConfirmedOrderApproval && this.approvalStageId == OrderApprovalStage.PendingWithBFM) {
            let confirmOrderPayload =
              {
                orderID: this.orderId,
                approvalreason: result.reason,
                approvaltype: this.approvalType,
                orderType: this.contractSigned ? "Clean Order" : "",
                isWT: this.isNonWT ? "No" : "Yes",
                decisiondate: this.currentDate,
                onholdreason: "",
                rejectionreason: "",
                resubmissionreason: "",
                // ownerid: "5E87EF80-4E50-E911-A830-000D3AA058CB",
                ownerid: this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
                entity: this.isNonWT ? "systemusers" : "systemusers",
                statuscode: "Approve",
                processinstanceid: this.processInstanceId,
                exceptionApproval: result.ExceptionApproval,
                approvaldoc: result.ApprovalDoc,
                locationId: result.location,
                msaNumber: result.MSANumber,
                msaStartDate: result.MSAStartDate,
                msaEndDate: result.MSAEndDate,
                attachments: result.UploadDocs,
                accountId: this.accountId,
                OBStatus: "Approved",
                DealHeaderID: !this.isNonWT ? this.projectService.getSession('dealID') : '',
                PricingId: !this.isNonWT ? this.projectService.getSession('pricingID') : '',
                OppGuid: !this.isNonWT ? this.projectService.getSession('opportunityId') : ''
              }
            console.log("confirm order approval payload", confirmOrderPayload)
            // this.confirmOrderBFM(confirmOrderPayload);
            this.service.loaderhome = true;
            this.OrderService.confirmOrderByBFM(confirmOrderPayload).subscribe(res => {
              if (!res.IsError) {
                console.log("BFM confirm order res is", res);
                this.service.loaderhome = false;
                this.projectService.displayMessageerror("Confirm order approved successfully");
                this.projectService.setSession('loadBFMScreen', true);
                this.router.navigate(['/order'])
              }
              else {
                this.service.loaderhome = false;
                this.projectService.displayMessageerror(res.Message);
              }
            },
              err => {
                this.isLoading = false;
                this.service.loaderhome = false;
                this.projectService.displayerror(err.status);
              });
          }
        }

      });
    }
    // Invoicing Approval
    else if (this.approvalTypeId == orderApprovalType.Invoicing) {
      const dialogRef = this.dialog.open(Approveopportunitypopup,
        {
          width: '350px'
        });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result.flag == 'Yes' && this.approvalTypeId == orderApprovalType.Invoicing && this.approvalStageId == OrderApprovalStage.InvoicingRequestPendingwithBFM) {
            let approveInvoicingPayload =
              {
                orderID: this.orderId,
                approvalreason: result.reason,
                approvaltype: this.approvalType,
                orderType: this.contractSigned ? "Clean Order" : "OAR",
                isWT: this.isNonWT ? "No" : "Yes",
                decisiondate: this.currentDate,
                onholdreason: "",
                rejectionreason: "",
                resubmissionreason: "",
                // ownerid: "5E87EF80-4E50-E911-A830-000D3AA058CB",
                ownerid: this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
                entity: this.isNonWT ? "systemusers" : "systemusers",
                statuscode: "Approve",
                processinstanceid: this.processInstanceId
              }
            console.log("invoicing payload is", approveInvoicingPayload);
            // this.invoicingBFMApproval(approveInvoicingPayload);
            this.service.loaderhome = true;
            this.OrderService.invoicingOrderByBFM(approveInvoicingPayload).subscribe(res => {
              if (!res.IsError) {
                this.service.loaderhome = false;
                console.log("BFM invoicing is", res);
                this.projectService.displayMessageerror("Invocing approved succeessfully");
                this.projectService.setSession('loadBFMScreen', true);
                this.router.navigate(['/order'])
              }
              else {
                this.service.loaderhome = false;
                this.projectService.displayMessageerror(res.Message);
              }
            },
              err => {
                this.isLoading = false;
                this.service.loaderhome = false;
                this.projectService.displayerror(err.status);
              });
          }
        }
      });
    }
  }

  openonhold(): void {
    const dialogRef = this.dialog.open(OnHoldPopComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // On-hold Order
        if (result.flag == 'YES' && (this.approvalTypeId == orderApprovalType.Order || this.approvalTypeId == orderApprovalType.Amendment || this.approvalTypeId == orderApprovalType.NegativeAmendmentApproval) && this.approvalStageId == OrderApprovalStage.PendingWithBFM) {
          let onHoldOrderPayload =
            {
              orderID: this.orderId,
              approvalreason: "",
              approvaltype: this.approvalType,
              orderType: this.contractSigned ? "Clean Order" : "",
              isWT: this.isNonWT ? "No" : "Yes",
              decisiondate: this.currentDate,
              onholdreason: result.comment,
              onholdreasonoptions: result.reason,
              rejectionreason: "",
              resubmissionreason: "",
              ownerid: this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
              entity: this.isNonWT ? "systemusers" : "systemusers",
              statuscode: "On-hold",
              processinstanceid: this.processInstanceId,
            }
          console.log("bfm on-hold payload", onHoldOrderPayload)
          this.service.loaderhome = true;
          this.OrderService.reject_onhold_approval_BFMOrder(onHoldOrderPayload).subscribe(res => {
            if (!res.IsError) {
              console.log("BFM response is", res);
              this.service.loaderhome = false;
              this.projectService.displayMessageerror("Order put on on-hold successfully");
              this.projectService.setSession('loadBFMScreen', true);
              this.router.navigate(['/order'])
            }
            else {
              this.service.loaderhome = false;
              this.projectService.displayMessageerror(res.Message);
            }
          },
            err => {
              this.isLoading = false;
              this.service.loaderhome = false;
              this.projectService.displayerror(err.status);
            });
        }

        //  On-hold confirm order
        else if (result.flag == 'YES' && this.approvalTypeId == orderApprovalType.ConfirmedOrderApproval && this.approvalStageId == OrderApprovalStage.PendingWithBFM) {
          let onholdConfirmOrderPayload =
            {
              orderID: this.orderId,
              approvalreason: "",
              approvaltype: this.approvalType,
              orderType: this.contractSigned ? "Clean Order" : "",
              isWT: this.isNonWT ? "No" : "Yes",
              decisiondate: this.currentDate,
              onholdreason: result.comment,
              onholdreasonoptions: result.reason,
              rejectionreason: "",
              resubmissionreason: "",
              ownerid: this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
              entity: this.isNonWT ? "systemusers" : "systemusers",
              statuscode: "On-hold",
              processinstanceid: this.processInstanceId,
            }
          // this.confirmOrderBFM(onholdConfirmOrderPayload);
          this.service.loaderhome = true;
          this.OrderService.confirmOrderByBFM(onholdConfirmOrderPayload).subscribe(res => {
            if (!res.IsError) {
              console.log("BFM confirm order res is", res);
              this.service.loaderhome = false;
              this.projectService.displayMessageerror("Confirmed Order put on on-hold successfully");
              this.projectService.setSession('loadBFMScreen', true);
              this.router.navigate(['/order'])
            }
            else {
              this.service.loaderhome = false;
              this.projectService.displayMessageerror(res.Message);
            }
          },
            err => {
              this.isLoading = false;
              this.service.loaderhome = false;
              this.projectService.displayerror(err.status);
            });
        }
      }

    });
  }

  openReject(): void {
    const dialogRef = this.dialog.open(RejectPopComponent, {
      width: '350px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("reject", result);

        // Reject Order
        if (result.flag == 'YES' && (this.approvalTypeId == orderApprovalType.Order || this.approvalTypeId == orderApprovalType.Amendment || this.approvalTypeId == orderApprovalType.NegativeAmendmentApproval) && this.approvalStageId == OrderApprovalStage.PendingWithBFM) {
          let rejectOderPayload =
            {
              orderID: this.orderId,
              approvalreason: "",
              approvaltype: this.approvalType,
              orderType: this.contractSigned ? "Clean Order" : "",
              isWT: this.isNonWT ? "No" : "Yes",
              decisiondate: this.currentDate,
              onholdreason: "",
              rejectionreason: result.reason,
              resubmissionreason: "",
              // ownerid: "5E87EF80-4E50-E911-A830-000D3AA058CB",
              ownerid: this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
              entity: this.isNonWT ? "systemusers" : "systemusers",
              statuscode: "Reject",
              processinstanceid: this.processInstanceId
            }
          console.log("rejected payload is", rejectOderPayload)
          // this.orderApproveBFM(rejectOderPayload);
          this.service.loaderhome = true;
          this.OrderService.reject_onhold_approval_BFMOrder(rejectOderPayload).subscribe(res => {
            var resetChecksPayload = {
              SalesOrderId: this.orderId
            }
            if (!res.IsError) {
              console.log("BFM response is", res);
              this.service.loaderhome = false;
              this.OrderService.resettingBFMVerificationCkecks(resetChecksPayload).subscribe((data: any) => {
                console.log("resetting bfm checks", data)
              });
              this.projectService.displayMessageerror("Rejected the order successfully");
              this.projectService.setSession('loadBFMScreen', true);
              this.router.navigate(['/order'])
            }
            else {
              this.service.loaderhome = false;
              this.projectService.displayMessageerror(res.Message);
            }
          },
            err => {
              this.isLoading = false;
              this.service.loaderhome = false;
              this.projectService.displayerror(err.status);
            });
        }

        // Reject Invoicing
        else if (result.flag == 'YES' && this.approvalTypeId == orderApprovalType.Invoicing && this.approvalStageId == OrderApprovalStage.InvoicingRequestPendingwithBFM) {
          let rejectInvoicingPayload = {
            orderID: this.orderId,
            approvalreason: "",
            approvaltype: this.approvalType,
            orderType: this.contractSigned ? "Clean Order" : "OAR",
            isWT: this.isNonWT ? "No" : "Yes",
            decisiondate: this.currentDate,
            onholdreason: "",
            rejectionreason: result.reason,
            resubmissionreason: "",
            ownerid: this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
            entity: this.isNonWT ? "systemusers" : "systemusers",
            statuscode: "Reject",
            processinstanceid: this.processInstanceId
          }
          console.log("reject invoicing payload is", rejectInvoicingPayload);
          // this.invoicingBFMApproval(rejectInvoicingPayload);
          this.service.loaderhome = true;
          this.OrderService.invoicingOrderByBFM(rejectInvoicingPayload).subscribe(res => {
            if (!res.IsError) {
              this.service.loaderhome = false;
              console.log("BFM invoicing is", res);
              this.projectService.displayMessageerror("Invoicing rejected succeessfully");
              this.projectService.setSession('loadBFMScreen', true);
              this.router.navigate(['/order'])
            }
            else {
              this.service.loaderhome = false;
              this.projectService.displayMessageerror(res.Message);
            }
          },
            err => {
              this.isLoading = false;
              this.service.loaderhome = false;
              this.projectService.displayerror(err.status);
            });
        }

        // Reject Confirm Order
        else if (result.flag == 'YES' && this.approvalTypeId == orderApprovalType.ConfirmedOrderApproval && this.approvalStageId == OrderApprovalStage.PendingWithBFM) {
          let rejectConformOrderPayload =
            {
              orderID: this.orderId,
              approvalreason: "",
              approvaltype: this.approvalType,
              orderType: this.contractSigned ? "Clean Order" : "",
              isWT: this.isNonWT ? "No" : "Yes",
              decisiondate: this.currentDate,
              onholdreason: "",
              rejectionreason: result.reason,
              resubmissionreason: "",
              // ownerid: "5E87EF80-4E50-E911-A830-000D3AA058CB",
              ownerid: this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
              entity: this.isNonWT ? "systemusers" : "systemusers",
              statuscode: "Reject",
              processinstanceid: this.processInstanceId
            }
          this.service.loaderhome = true;
          // this.confirmOrderBFM(rejectConformOrderPayload);
          this.OrderService.confirmOrderByBFM(rejectConformOrderPayload).subscribe(res => {
            var resetChecksPayload = {
              SalesOrderId: this.orderId
            }
            if (!res.IsError) {
              console.log("BFM confirm order res is", res);
              this.service.loaderhome = false;
              this.OrderService.resettingBFMVerificationCkecks(resetChecksPayload).subscribe((data: any) => {
                console.log("resetting bfm checks", data)
              });
              this.projectService.displayMessageerror("Rejected the confirm order successfully");
              this.projectService.setSession('loadBFMScreen', true);
              this.router.navigate(['/order'])
            }
            else {
              this.service.loaderhome = false;
              this.projectService.displayMessageerror(res.Message);
            }
          },
            err => {
              this.isLoading = false;
              this.service.loaderhome = false;
              this.projectService.displayerror(err.status);
            });
        }
      }
    });
  }
  // BFM Approval --Subbu changes Ends

}



@Component({
  selector: 'deal-qualifier',
  templateUrl: './deal-qualifier.html',
  styles: [`
    .disableAssign
  {
      pointer-events: none;
      color: rgba(0,0,0,.26);
      background-color: rgba(0,0,0,.12);
  }

  ::ng-deep .cust_autoComplete .top-38 {
    top: 40px !important;
  }




  `]

})
export class dealQualifierpopup implements OnInit {
  isLoading: boolean = false;
  qualifierData = []
  qualifierValue;
  dateVal;
  datePipe = new DatePipe("en-US");
  startDate = new Date();
  header = { name: "Name", Id: "ownerId" };
  selectedOwnerObj: any = { ownerId: "", Name: "" };
  qualificationStatusArr: any = []
  qualifyCreatedDate: any = ''
  getValidate() {

    if (!this.dateVal || (/^ *$/.test(this.comment)) || !this.qualifierValue || !this.ownerId) {
      return true;
    }
    else {
      return false;
    }
  }
  constructor(private EncrDecr: EncrDecrService, public DataCommunicationService: DataCommunicationService, public allopportunities: OpportunitiesService, public router: Router, public dialogRef: MatDialogRef<dealQualifierpopup>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data) {

    this.qualifierData = data.data ? data.data : []
    this.qualifierValue = data.qualifierId ? data.qualifierId : ''
    this.qualificationStatusArr = data.qualificationStatusArr;
    // this.ownerId = data.qualificationStatusArr.QualificationDecisionBy ? data.qualificationStatusArr.QualificationDecisionBy : ''
    // this.ownerName = data.qualificationStatusArr.QualificationDecision ? data.qualificationStatusArr.QualificationDecision : ''
    this.ownerId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
      this.ownerName = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('username'), 'DecryptionDecrip'),
      this.qualifyCreatedDate = new Date(data.qualifyCreatedDate)
    this.dateVal = data.qualificationStatusArr.QualificationDate ? new Date(this.datePipe.transform(data.qualificationStatusArr.QualificationDate, "dd-MMM-yyyy")) : ''
    this.comment = data.qualificationStatusArr.QualificationComments ? data.qualificationStatusArr.QualificationComments : ''
    if (this.ownerName) {

      this.selectedOwnerObj.Name = this.ownerName
      this.selectedOwnerObj.ownerId = this.ownerId
      this.selectedOwnerArray = []
      this.selectedOwnerArray.push(this.selectedOwnerObj);
      this.selectedOwnerArray[0].Id = this.selectedOwnerObj.ownerId;

    }

  }



  searchOwnerData = [];


  lookupdata = {
    tabledata: [],
    recordCount: 10,
    headerdata: [],
    Isadvancesearchtabs: false,
    controlName: '',
    lookupName: '',
    isCheckboxRequired: false,
    inputValue: '',
    TotalRecordCount: 0,
    selectedRecord: [],
    nextLink: '',
    pageNo: 1,
    isLoader: false
  };

  selectedOwnerArray = []
  selectedLookupData(controlName) {
    switch (controlName) {
      case 'shareAssign': {
        return this.selectedOwnerArray.length > 0 ? this.selectedOwnerArray : []
      }

    }
  }


  openadvancetabs(controlName, initalLookupData, value): void {


    this.lookupdata.controlName = controlName
    this.lookupdata.headerdata = linkedLeadsHeaders[controlName]
    this.lookupdata.lookupName = linkedLeadNames[controlName]['name']
    this.lookupdata.isCheckboxRequired = linkedLeadNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = linkedLeadNames[controlName]['isAccount']
    this.lookupdata.inputValue = value ? value : '';
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.lookupdata.tabledata = []
    this.allopportunities.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
      this.lookupdata.tabledata = res

    })

    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.DataCommunicationService.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });

    dialogRef.componentInstance.modelEmiter.subscribe((x) => {


      //console.log(x)
      if (x.action == 'loadMore') {

        let dialogData = {


          "SearchText": x.objectRowData.searchKey ? x.objectRowData.searchKey : '',
          "SearchType": 6,
          "PageSize": this.lookupdata.recordCount,
          "RequestedPageNumber": x.currentPage,
          "OdatanextLink": this.lookupdata.nextLink

        }







        this.allopportunities.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: dialogData }).subscribe(res => {
          // this.lookupdata.tabledata = res.ResponseObject+this.lookupdata.tabledata
          this.lookupdata.isLoader = false
          this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject)
          this.lookupdata.nextLink = res.OdatanextLink
          this.lookupdata.TotalRecordCount = res.TotalRecordCount

        })

      } else if (x.action == 'search') {

        this.lookupdata.nextLink = ''
        let dialogData = {

          "SearchText": x.objectRowData.searchKey ? x.objectRowData.searchKey : '',
          "SearchType": 6,
          "PageSize": this.lookupdata.recordCount,
          "RequestedPageNumber": x.currentPage,
          "OdatanextLink": this.lookupdata.nextLink
        }




        this.allopportunities.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: dialogData }).subscribe(res => {
          this.lookupdata.isLoader = false
          this.lookupdata.tabledata = res.ResponseObject
          this.lookupdata.nextLink = res.OdatanextLink
          this.lookupdata.TotalRecordCount = res.TotalRecordCount


        })

      }


    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        //console.log(result)
        this.AppendParticularInputFun(result.selectedData, result.controlName)
      }
    });
  }
  ownerId: string = "";
  ownerName: string = "";
  isSearchLoader = false;


  AppendParticularInputFun(selectedData, controlName) {

    if (selectedData) {
      if (selectedData.length > 0) {
        this.selectedOwnerObj = selectedData[0];
        this.ownerName = this.selectedOwnerObj.Name;
        this.ownerId = this.selectedOwnerObj.ownerId;


        this.selectedOwnerArray = []
        this.selectedOwnerArray.push(this.selectedOwnerObj)
        this.selectedOwnerArray[0].Id = this.selectedOwnerObj.ownerId;
      }
    }
  }
  comment = '';

  closeQualifier() {
    this.dialogRef.close('close');
  }
  saveQualifier() {

    let body =
      {
        "OpportunityId": this.allopportunities.getSession('opportunityId'),
        "QualificationStatus":
        {
          "QualificationDate": this.datePipe.transform(this.dateVal, "yyyy-MM-dd'T'HH:mm:ss.SSSSSSS'Z'"),
          "QualificationStatusId": this.qualifierValue,
          "QualificationDecisionBy": this.ownerId,
          "QualificationComments": this.comment
        }
      }

    this.allopportunities.saveQualifier(body).subscribe(response => {
      if (!response.IsError) {
        //  if(response.Message=='success'){
        this.allopportunities.displayMessageerror('Deal qualifier data saved successfully')
        this.dialogRef.close('success')
        //  }
      }
      else {
        this.allopportunities.displayMessageerror(response.Message);
        this.searchOwnerData = [];
        this.isSearchLoader = false;
      }
    },
      err => {

        this.allopportunities.displayerror(err.status);
        this.isSearchLoader = false;
      }
    );

  }



  selectedOwner(SelectedAssign: any) {



    if (Object.keys(SelectedAssign).length) {
      this.selectedOwnerObj = SelectedAssign;
      this.ownerName = this.selectedOwnerObj.Name;
      this.ownerId = this.selectedOwnerObj.ownerId;
      this.selectedOwnerArray = []
      this.selectedOwnerArray.push(this.selectedOwnerObj)
      this.selectedOwnerArray[0].Id = this.selectedOwnerObj.ownerId;
    }
    else {
      this.selectedOwnerObj = { ownerId: "", Name: "" };
      this.ownerName = '';
      this.ownerId = '';
      this.selectedOwnerArray = []
    }
  }
  searchOwnerContent(data) {


    this.isSearchLoader = true;
    let body =
      {
        "SearchText": data.searchValue ? data.searchValue : '',
        "SearchType": 6,
        "PageSize": 10,
        "RequestedPageNumber": 1,
        "OdatanextLink": this.lookupdata.nextLink

      }




    //this.DataCommunicationService.loaderhome=true;
    this.allopportunities.getAssignSearchData(body).subscribe(response => {
      if (!response.IsError) {

        if (response.ResponseObject && (Array.isArray(response.ResponseObject) ? response.ResponseObject.length > 0 : false)) {
          this.searchOwnerData = response.ResponseObject;
          for (let j = 0; j < this.searchOwnerData.length; j++) {
            this.searchOwnerData[j].Name = this.searchOwnerData[j].FullName ? this.searchOwnerData[j].FullName : '';
          }
          this.lookupdata.TotalRecordCount = response.TotalRecordCount
          this.lookupdata.nextLink = response.OdatanextLink

          // this.searchOwnerData = response.ResponseObject.filter((it) => it.ownerId !=
          //   this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'))
          // if (data.labelName == 'ownerArrayy') {
          //   this.openadvancetabs('assign', this.searchOwnerData, data.inputVal)
          // }
          this.isSearchLoader = false;
        }
        else {
          this.searchOwnerData = [];
          this.isSearchLoader = false;
        }
      }
      else {
        this.allopportunities.displayMessageerror(response.Message);
        this.searchOwnerData = [];
        this.isSearchLoader = false;
      }
      //this.DataCommunicationService.loaderhome=false;
    },
      err => {
        //     this.DataCommunicationService.loaderhome=false;
        this.allopportunities.displayerror(err.status);
        this.isSearchLoader = false;
      }
    );
  }


  advanceLookUpSearch(lookUpData) {


    //console.log(lookUpData);
    let labelName = lookUpData.labelName;
    switch (labelName) {
      case 'ownerArrayy': {
        this.openadvancetabs('shareAssign', this.searchOwnerData, lookUpData.inputVal)
        return;

      }
    }
  }
  ngOnInit() {

  }

  /******************CurrencyName autocomplete starts here****************** */
  CurrencyName: string = "";
  CurrencyNameSwitch: boolean = true;

  currencyNameclose() {
    this.CurrencyNameSwitch = false;
  }
  appendcurrency(value: string, i) {
    this.CurrencyName = value;
    this.selectedCurrency.push(this.wiproCurrency[i])
  }
  wiproCurrency: {}[] = [
    { index: 0, contact: 'Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ]

  selectedCurrency: {}[] = [];
  /******************CurrencyNameautocomplete ends here****************** */
}

@Component({
  selector: 'est-closure-date',
  templateUrl: './est-closure-date.html',
  styles: [`
    .disableAssign
  {
      pointer-events: none;
      color: rgba(0,0,0,.26);
      background-color: rgba(0,0,0,.12);
  }
  `]
})
export class estimtedclosuredate implements OnInit {
  isLoading: boolean = false;
  datePipe = new DatePipe("en-US");
  dateVal;
  startDate = new Date();
  estimatedData;
  constructor(public projectService: OpportunitiesService, @Inject(MAT_DIALOG_DATA) public data: any

    , public service: DataCommunicationService, public router: Router, public dialogRef: MatDialogRef<estimtedclosuredate>, public dialog: MatDialog) {


    // data.data.map((it) => {
    //   {
    //
    //     if (it.title == 'Profile') {
    //       this.dateVal = (it.content[7].content) && it.content[7].content != "NA" ? new Date(it.content[7].content) : ''

    //     }
    //   }
    // })


    data.data.map((it) => {
      {
        if (it.title == 'Profile') {
          it.content.map((it1) => {
            if (it1.label == 'Est. closure date') {
              this.dateVal = (it1.content) && it1.content != "-" ? new Date(it1.content) : ''
            }
          }
          )
        }
      } return it
    }
    )

    //console.log(this.dateVal);

  }



  save() {
    var selectedDate = (this.datePipe.transform(this.dateVal, "dd-MMM-yyyy"))
    var finalDate = (this.datePipe.transform(new Date(new Date().getFullYear(), new Date().getMonth() + 36, new Date().getDate()), "dd-MMM-yyyy"))
    if (new Date(selectedDate) > new Date(finalDate)) {
      this.projectService.displayMessageerror('Estimated closure date cannot be more than 36 months from current date');
    }



    else {
      let obj =
        {
          "OpportunityId": this.projectService.getSession('opportunityId'),
          "EstimatedClosureDate": this.datePipe.transform(this.dateVal, "yyyy-MM-dd")
        }

      this.isLoading = true;
      this.projectService.estimateCloseDate(obj).subscribe(response => {
        if (!response.IsError) {
          if (response.Message == "success") {
            //auto save in overview page code
            this.service.GetRedisCacheData('saveOpportunity').subscribe(res => {
              console.log("redis", res)
              if (!res.IsError && res.ResponseObject) {
                console.log("parsed data", JSON.parse(res.ResponseObject))
                let dataFromRedis = JSON.parse(res.ResponseObject);
                let OpportunityId = this.projectService.getSession('opportunityId');
                if (Array.isArray(dataFromRedis) && dataFromRedis.length > 0) {
                  let currentOpportunityData = dataFromRedis.filter(data => data.opportunityId == OpportunityId)
                  if (currentOpportunityData.length) {
                    dataFromRedis.map(data => {
                      if (data.opportunityId == OpportunityId) {
                        data.estimatedclosedate = this.dateVal;
                      }
                    })
                    this.service.SetRedisCacheData(dataFromRedis, 'saveOpportunity').subscribe(res => {
                      if (!res.IsError) {
                        console.log("SUCESS FULL AUTO SAVE")
                      }
                    }, error => {
                      console.log(error)
                    })
                  }
                }
              }
            })
            this.projectService.displayMessageerror("Estimated closure date modified successfully");
            this.projectService.setEstimatedDateCheck(this.datePipe.transform(this.dateVal, "yyyy-MM-dd"));
            this.projectService.setSession('estDate', this.datePipe.transform(this.dateVal, "yyyy-MM-dd"));
            this.dialogRef.close('save');
          }
          else {
            this.projectService.displayMessageerror(response.Message);
          }
        }
        else {
          this.projectService.displayMessageerror(response.Message);
        }
        this.isLoading = false;
      },
        err => {
          this.isLoading = false;
          this.service.loaderhome = false;
          this.projectService.displayerror(err.status);
        }
      );


    }
  }



  ngOnInit() {


  }
}

@Component({
  selector: 'om-popup',
  templateUrl: './om-popup.html',
})
export class omchangepopup implements OnInit {
  constructor(public projectService: OpportunitiesService, public service: DataCommunicationService, public dialogRef: MatDialogRef<omchangepopup>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  OMPercentage: any;

  save(flag) {
    if (this.OMPercentage > 100) {
      this.projectService.displayMessageerror("OM% should be less than or equal to 100%");
    } else {

      let returnObj = {
        flag: flag,
        OMPerData: this.OMPercentage
      }

      this.dialogRef.close(returnObj);
    }
  }
  ngOnInit() {
    this.OMPercentage = this.data.OMPercentage;
    console.log("OM data", this.data)
  }
}

@Component({

  selector: 'manual-probability',
  templateUrl: './manual-probability.html',
  styles: [`

    .disableAssign
  {
      pointer-events: none;
      color: rgba(0,0,0,.26);
      background-color: rgba(0,0,0,.12);
  }
  `]
})



export class manualprobabilitypopup implements OnInit {
  isLoading: boolean = false;
  winningProbs = 184450005;
  // winningProbability = [
  //   { Value: 184450000, Label: "0" },
  //   { Value: 184450001, Label: "0-45" },
  //   { Value: 184450002, Label: "50-70" },
  //   { Value: 184450003, Label: "75-95" },
  //   { Value: 184450004, Label: "100" }

  // ]




  winningProbability = [];
  winningProbabilityData = [];
  isSimpleOpportunity: boolean

  stage = "persue"
  forecastData: any = 3;
  constructor(public service: DataCommunicationService, @Inject(MAT_DIALOG_DATA) public data, public projectService: OpportunitiesService, public router: Router, public dialogRef: MatDialogRef<manualprobabilitypopup>, public dialog: MatDialog) {

    // //console.log(this.projectService.currentState, 'currentstate');
    this.forecastData = data.data;
    this.winningProbabilityData = data.winningProbabilityData
    this.winningProbs = data.ManualProbabilityWiningValue || data.ManualProbabilityWiningValue == 0 ? data.ManualProbabilityWiningValue : ""
    this.isSimpleOpportunity = data.isSimpleOpportunity

  }
  ngOnInit() {

    if (this.isSimpleOpportunity) {
      this.winningProbability = JSON.parse(JSON.stringify(this.winningProbabilityData)).filter((it) => it.Label != 100 && it.Label != 95
        && it.Label != 0 && it.Label != 5)
    }
    else {
      if (this.projectService.getSession('currentState').toString() == '184450000') {
        this.winningProbability = [];
      }
      else if (this.projectService.getSession('currentState').toString() == '184450001') {
        this.winningProbability = JSON.parse(JSON.stringify(this.winningProbabilityData)).filter((it) => it.Label == 5 || it.Label == 10
          || it.Label == 15 || it.Label == 20 || it.Label == 25 || it.Label == 30 || it.Label == 35 ||
          it.Label == 40 || it.Label == 45)
      }
      else if (this.projectService.getSession('currentState').toString() == '184450002') {
        this.winningProbability = JSON.parse(JSON.stringify(this.winningProbabilityData)).filter((it) => it.Label == 50 || it.Label == 55 || it.Label == 60
          || it.Label == 65 || it.Label == 70)
      }
      else if (this.projectService.getSession('currentState').toString() == '184450003') {
        this.winningProbability = JSON.parse(JSON.stringify(this.winningProbabilityData)).filter((it) => it.Label == 75 || it.Label == 80 || it.Label == 85
          || it.Label == 90 || it.Label == 95)
      }
      else if (this.projectService.getSession('currentState').toString() == '184450004') {
        this.winningProbability = JSON.parse(JSON.stringify(this.winningProbabilityData)).filter((it) => it.Label == 100)
      }

    }

  }

  save() {


    var ManualProbabilityWining = this.winningProbability.filter((it) => it.Value == this.winningProbs)

    let body =

      {
        "OpportunityId": this.projectService.getSession('opportunityId'),
        "OpportunityForecast": this.forecastData,
        "ManualProbabilityWining": ManualProbabilityWining.length > 0 ? ManualProbabilityWining[0].Value : null,

        // {
        //   "OpportunityId": this.projectService.getSession('opportunityId'),
        //   "OpportunityForecast": this.forecastData,
        //   "ManualProbabilityWining": ManualProbabilityWining.length > 0 ? ManualProbabilityWining[0].Value : "",


        // }
      }

    this.isLoading = true;

    this.projectService.saveProbability(body).subscribe(response => {
      if (!response.IsError) {
        if (this.winningProbs) {
          var winProbValue = this.winningProbability.filter((it) => it.Value == this.winningProbs)
          this.projectService.displayMessageerror('Manual probability updated successfully');
          this.dialogRef.close('save');

        }
      }

      else {
        this.projectService.displayMessageerror(response.Message);
      }
      this.isLoading = false;
    },
      err => {
        this.isLoading = false;
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      }
    );

  }

}


@Component({
  selector: 'app-user-targets',
  templateUrl: './user-targets.html',
  // styleUrls: ['./popups.component.scss']
})

export class UserTargetsPopup {
  isLoading: boolean = false;
  constructor(public dialogRef: MatDialogRef<UserTargetsPopup>, public router: Router) { }
  onNoClick(): void {
    this.dialogRef.close();
  }

  /******************Account name autocomplete starts here****************** */
  contactName: string = "";
  contactNameSwitch: boolean = true;
  wiproContact: {}[] = [
    { index: 0, name: 'Ramamoorthy Venkateswara', email: 'ramamoorthy.venkateswara@wipro.com', role: 'IMS role', targets: 'Carrying target', value: true },
    { index: 1, name: 'Kanika Tuteja', email: 'ramamoorthy.venkateswara@wipro.com', role: 'IMS role', targets: 'Carrying target', value: false },
    { index: 2, name: 'Anubhav Jain', email: 'ramamoorthy.venkateswara@wipro.com', role: 'IMS role', targets: 'Carrying target', value: false },
    { index: 3, name: 'Kanika Tuteja', email: 'ramamoorthy.venkateswara@wipro.com', role: 'IMS role', targets: 'Carrying target', value: false },
    { index: 4, name: 'Vertical', email: 'ramamoorthy.venkateswara@wipro.com', role: 'IMS role', targets: 'Carrying target', value: true },
    { index: 5, name: 'Kanika Tuteja', email: 'ramamoorthy.venkateswara@wipro.com', role: 'IMS role', targets: 'Carrying target', value: false },
    { index: 6, name: 'Anubhav Jain', email: 'ramamoorthy.venkateswara@wipro.com', role: 'IMS role', targets: 'Carrying target', value: false },
    { index: 7, name: 'Kanika Tuteja', email: 'ramamoorthy.venkateswara@wipro.com', role: 'IMS role', targets: 'Carrying target', value: false },
    { index: 8, name: 'Vertical', email: 'ramamoorthy.venkateswara@wipro.com', role: 'IMS role', targets: 'Carrying target', value: true },
    { index: 9, name: 'Kanika Tuteja', email: 'ramamoorthy.venkateswara@wipro.com', role: 'IMS role', targets: 'Carrying target', value: false },
    { index: 10, name: 'Anubhav Jain', email: 'ramamoorthy.venkateswara@wipro.com', role: 'IMS role', targets: 'Carrying target', value: false },
    { index: 11, name: 'Kanika Tuteja', email: 'ramamoorthy.venkateswara@wipro.com', role: 'IMS role', targets: 'Carrying target', value: false },
    { index: 12, name: 'Vertical', email: 'ramamoorthy.venkateswara@wipro.com', role: 'IMS role', targets: 'Carrying target', value: true },
    { index: 13, name: 'Kanika Tuteja', email: 'ramamoorthy.venkateswara@wipro.com', role: 'IMS role', targets: 'Carrying target', value: false },
    { index: 14, name: 'Anubhav Jain', email: 'ramamoorthy.venkateswara@wipro.com', role: 'IMS role', targets: 'Carrying target', value: false },
    { index: 15, name: 'Kanika Tuteja', email: 'ramamoorthy.venkateswara@wipro.com', role: 'IMS role', targets: 'Carrying target', value: false },
    { index: 16, name: 'Vertical', email: 'ramamoorthy.venkateswara@wipro.com', role: 'IMS role', targets: 'Carrying target', value: true },
    { index: 17, name: 'Kanika Tuteja', email: 'ramamoorthy.venkateswara@wipro.com', role: 'IMS role', targets: 'Carrying target', value: false },
    { index: 18, name: 'Anubhav Jain', email: 'ramamoorthy.venkateswara@wipro.com', role: 'IMS role', targets: 'Carrying target', value: false },
    { index: 19, name: 'Kanika Tuteja', email: 'ramamoorthy.venkateswara@wipro.com', role: 'IMS role', targets: 'Carrying target', value: false },
    { index: 20, name: 'Vertical', email: 'ramamoorthy.venkateswara@wipro.com', role: 'IMS role', targets: 'Carrying target', value: true },
    { index: 21, name: 'Kanika Tuteja', email: 'ramamoorthy.venkateswara@wipro.com', role: 'IMS role', targets: 'Carrying target', value: false },
    { index: 22, name: 'Anubhav Jain', email: 'ramamoorthy.venkateswara@wipro.com', role: 'IMS role', targets: 'Carrying target', value: false },
    { index: 23, name: 'Kanika Tuteja', email: 'ramamoorthy.venkateswara@wipro.com', role: 'IMS role', targets: 'Carrying target', value: false }
  ];
  displaydata = false;
  selectedContact: {}[] = [];
  contactNameclose() {
    this.contactNameSwitch = false;
  }
  appendcontact(value: string, i) {
    this.contactName = value;
    this.selectedContact.push(this.wiproContact[i]);
  }

  onChangeHandler() {
    this.displaydata = false;
  }
  searchdata() {
    this.displaydata = true;
  }
  /******************Account name autocomplete ends here****************** */
}



@Component({

  templateUrl: './proceedToqualify.html'
})
export class ProceedtoQualifypopup implements OnInit {
  isLoading: boolean = false;
  constructor(public router: Router, public dialogRef: MatDialogRef<manualprobabilitypopup>, public dialog: MatDialog) { }
  ngOnInit() {

  }
  // router.url.includes('/opportunity/opportunityview/overview')
  showcancel(isProceed) {
    this.dialogRef.close(isProceed);
  }
}




@Component({

  templateUrl: './proceed-without-nurture.html'
})
export class proceedwithoutnurturepopup implements OnInit {
  isLoading: boolean = false;
  constructor(public router: Router, public dialogRef: MatDialogRef<proceedwithoutnurturepopup>, public dialog: MatDialog) { }
  ngOnInit() { }
}



@Component({

  templateUrl: './Linked-leadspopup.html',
  styles: [`
  .disableAssign
{
    pointer-events: none;
    color: rgba(0,0,0,.26);
    background-color: rgba(0,0,0,.12);
}
.loader {
  margin: 200px auto;
  border: 6px solid #f3f3f3;
  border-radius: 50%;
  border-top: 6px solid #3498db;
  width: 64px;
  height: 64px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}
.loaderContainer {
  width: 100%;
  top: 0em;
  position: absolute;
  height: 100%;
  z-index: 9999;
  background: white;
}
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

`]
})


export class LinkLeadspopup implements OnInit {
  isLoading: boolean = false;
  leadslinked;
  arrowkeyLocation = 0;
  constructor(public router: Router, public projectService: OpportunitiesService, public service: DataCommunicationService,
    public dialogRef: MatDialogRef<LinkLeadspopup>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, ) {

    JSON.parse(JSON.stringify(data.data)).filter((it) => {
      {
        if (it.title == 'Linked activities & leads') {
          this.selectedleadslinked = (it.content[0].subContent)
          if (it.content[0].subContent.length > 0) {
            for (let j = 0; j < this.selectedleadslinked.length; j++) {
              this.selectedleadslinked[j].Id = this.selectedleadslinked[j].ActivityId
            }
          }
        }
      }
      return it
    })


    //console.log(this.selectedleadslinked, data, 'dataaaa');

  }
  ngOnInit() { }

  leadslinkedModel: string;
  leadslinkedSwitch: boolean;
  linkedleadslinkedClose() {
    this.leadslinkedSwitch = false;
  }


  lookupdata = {
    tabledata: [],
    recordCount: 10,
    headerdata: [],
    Isadvancesearchtabs: false,
    controlName: '',
    lookupName: '',
    isCheckboxRequired: false,
    inputValue: '',
    TotalRecordCount: 0,
    selectedRecord: [],
    nextLink: '',
    pageNo: 1,
    isLoader: false
  };

  selectedLookupData(controlName) {
    switch (controlName) {
      case 'linkedActivity': {
        return (this.selectedleadslinked.length > 0) ? this.selectedleadslinked : []

      }

    }
  }
  openadvancetabs(controlName, initalLookupData, value): void {


    this.lookupdata.controlName = controlName
    this.lookupdata.headerdata = linkedLeadsHeaders[controlName]
    this.lookupdata.lookupName = linkedLeadNames[controlName]['name']
    this.lookupdata.isCheckboxRequired = linkedLeadNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = linkedLeadNames[controlName]['isAccount']
    this.lookupdata.inputValue = value ? value : '';
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    // this.lookupdata.tabledata = []
    this.projectService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
      this.lookupdata.tabledata = res

    })

    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.service.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });

    dialogRef.componentInstance.modelEmiter.subscribe((x) => {


      //console.log(x)
      if (x.action == 'loadMore') {

        let dialogData = {

          "Id": this.projectService.getSession('accountid'),
          "Searchtext": x.objectRowData.searchKey ? x.objectRowData.searchKey : '',
          "pagesize": this.lookupdata.recordCount,

          "RequestedPageNumber": x.currentPage,
          "OdatanextLink": this.lookupdata.nextLink

        }



        this.projectService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: dialogData }).subscribe(res => {
          // this.lookupdata.tabledata = res.ResponseObject+this.lookupdata.tabledata
          this.lookupdata.isLoader = false
          this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject)

          this.lookupdata.nextLink = res.OdatanextLink
          this.lookupdata.TotalRecordCount = res.TotalRecordCount

        })

      } else if (x.action == 'search') {
        this.lookupdata.nextLink = ''
        let dialogData = {

          "Id": this.projectService.getSession('accountid'),
          "Searchtext": x.objectRowData.searchKey ? x.objectRowData.searchKey : '',
          "pagesize": this.lookupdata.recordCount,

          "RequestedPageNumber": x.currentPage,
          "OdatanextLink": this.lookupdata.nextLink


        }

        this.projectService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: dialogData }).subscribe(res => {
          this.lookupdata.isLoader = false
          this.lookupdata.tabledata = res.ResponseObject
          this.lookupdata.nextLink = res.OdatanextLink
          this.lookupdata.TotalRecordCount = res.TotalRecordCount


        })

      }


    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        //console.log(result)
        this.AppendParticularInputFun(result.selectedData, result.controlName)
      }
    });
  }



  AppendParticularInputFun(selectedData, controlName) {

    if (selectedData) {
      if (selectedData.length > 0) {

        this.appendleadslinkedData(selectedData);


      }
    }
  }

  appendleadslinkedData(selectedData) {
    this.selectedleadslinked = this.selectedleadslinked.concat(selectedData);
    this.selectedleadslinked = this.selectedleadslinked.map(e => e['Id']).map((e, i, final) => final.indexOf(e) === i && i)
      .filter(e => this.selectedleadslinked[e]).map(e => this.selectedleadslinked[e]);
    //console.log(this.selectedleadslinked)

  }
  appendleadslinked(item) {
    var id = item.ActivityId
    var value = item.Subject
    var owner = item.OwnerId
    var ownerN = item.OwnerName


    if (!(this.selectedleadslinked.some(it => it.ActivityId == id))) {
      this.leadslinkedSwitch = false
      this.leadslinkedModel = value;
      this.selectedleadslinked.push({
        "ActivityId": id,
        "AppointmentOpportunityId": "",
        "account": "",
        "accountName": "",
        "Name": value,
        'Id': id,
        'ownerr': owner,
        'ownerN': ownerN
      }
      )
    }
    else {
      this.projectService.displayMessageerror('Duplicate value exists')

    };

    //console.log(this.selectedleadslinked, 'select');
    this.leadslinkedModel = '';
  }








  activityData() {

    let obj =
      {
        "Id": this.projectService.getSession('accountid'),
        "Searchtext": this.leadslinkedModel ? this.leadslinkedModel : '',
        "pagesize": 10,
        "RequestedPageNumber": 1,
        "OdatanextLink": null
      }
    this.isLoading = true;
    this.projectService.getActivitySearchData(obj).subscribe(response => {
      if (!response.IsError) {

        if (response.ResponseObject && (Array.isArray(response.ResponseObject) ? response.ResponseObject.length > 0 : false)) {
          this.lookupdata.nextLink = response.OdatanextLink
          this.leadslinkedContact = response.ResponseObject
          this.lookupdata.TotalRecordCount = response.TotalRecordCount
        }
        else {

        }

      }
      else {
        this.projectService.displayMessageerror(response.Message);
      }
      this.isLoading = false;
    },
      err => {
        this.isLoading = false;
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      }
    );

  }

  okButton() {
    this.isLoading = true;
    var saveFilterData = this.selectedleadslinked.filter((it) => it.AppointmentOpportunityId == "")
    if (saveFilterData.length > 0) {
      var body = []
      for (var i = 0; i < saveFilterData.length; i++) {
        body.push({
          "AppointmentOpportunityId": "",
          "ActivityId": saveFilterData[i].ActivityId,
          "OpportunityId": this.projectService.getSession('opportunityId'),
          'OwnerId': saveFilterData[i].ownerr
        })
      }


      
      this.projectService.saveActivty(body).subscribe(response => {
        if (!response.IsError) {
          if (response.ResponseObject) {
            this.projectService.displayMessageerror('Activity linked successfully');
            this.dialogRef.close('save');

          }
          else {
            this.projectService.displayMessageerror(response.Message);
          }
        }
        else {
          this.projectService.displayMessageerror(response.Message);
        }
        this.isLoading = false;
      },
        err => {
          this.isLoading = false;
          this.service.loaderhome = false;
          this.projectService.displayerror(err.status);
        }
      );

    }
    else {
      this.dialogRef.close();

    }


  }

  deleteActivityData(i) {
    if ((this.selectedleadslinked[i].AppointmentOpportunityId) == "") {
      this.selectedleadslinked.splice(i, 1);
    }
    else {
      let obj = { "Guid": this.selectedleadslinked[i].AppointmentOpportunityId }
      this.isLoading = true;
      this.projectService.deleteActivityData(obj).subscribe(response => {
        if (!response.IsError) {
          this.selectedleadslinked.splice(i, 1);
        }
        else {
          this.projectService.displayMessageerror(response.Message);
        }
        this.isLoading = false;
      },
        err => {
          this.isLoading = false;
          this.service.loaderhome = false;
          this.projectService.displayerror(err.status);
        }
      );
    }
  }


  leadslinkedContact = []

  selectedleadslinked: any = [];
  selectedleads: any = [];
}


// lead popup



@Component({

  templateUrl: './Linked-leads.html',
  styles: [`
    .disableAssign
  {
      pointer-events: none;
      color: rgba(0,0,0,.26);
      background-color: rgba(0,0,0,.12);
  }
  .loader {
    margin: 200px auto;
    border: 6px solid #f3f3f3;
    border-radius: 50%;
    border-top: 6px solid #3498db;
    width: 64px;
    height: 64px;
    -webkit-animation: spin 2s linear infinite; /* Safari */
    animation: spin 2s linear infinite;
  }
  .loaderContainer {
    width: 100%;
    top: 0em;
    position: absolute;
    height: 100%;
    z-index: 9999;
    background: white;
  }
  @-webkit-keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  `]
})
export class Leadspopup implements OnInit {
  isLoading: boolean = false;
  arrowkeyLocation = 0;
  leadslinked;
  constructor(public router: Router, public projectService: OpportunitiesService,
    public dialogRef: MatDialogRef<Leadspopup>,
    public dialog: MatDialog, public service: DataCommunicationService,
    @Inject(MAT_DIALOG_DATA) public data: any, ) {


    JSON.parse(JSON.stringify(data.data)).filter((it) => {
      {
        if (it.title == 'Linked activities & leads') {
          this.selectedleadslinked = (it.content[1].subContent)
          if (it.content[1].subContent.length > 0) {
            for (let j = 0; j < this.selectedleadslinked.length; j++) {
              this.selectedleadslinked[j].Id = this.selectedleadslinked[j].LeadGuid
            }
          }
          // this.selectedleadslinked[0].Id = it.content[1].subContent
        }
      }
      return it
    })



    //console.log(this.selectedleadslinked, 'selectedleadslinke', 'data', data);


  }
  //shinder
  /****************Advance search popup starts**********************/



  lookupdata = {
    tabledata: [],
    recordCount: 1,
    headerdata: [],
    Isadvancesearchtabs: false,
    controlName: '',
    lookupName: '',
    isCheckboxRequired: false,
    inputValue: '',
    TotalRecordCount: 0,
    selectedRecord: [],
    nextLink: '',
    pageNo: 1,
    isLoader: false
  };

  selectedLookupData(controlName) {
    switch (controlName) {
      case 'linkedLeads': {
        return (this.selectedleadslinked.length > 0) ? this.selectedleadslinked : []
      }

    }
  }
  openadvancetabs(controlName, initalLookupData, value): void {


    this.lookupdata.controlName = controlName
    this.lookupdata.headerdata = linkedLeadsHeaders[controlName]
    this.lookupdata.lookupName = linkedLeadNames[controlName]['name']
    this.lookupdata.isCheckboxRequired = linkedLeadNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = linkedLeadNames[controlName]['isAccount']
    this.lookupdata.inputValue = value ? value : '';
    // this.lookupdata.tabledata = []
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);

    this.projectService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {



      this.lookupdata.tabledata = res

    })

    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.service.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });

    dialogRef.componentInstance.modelEmiter.subscribe((x) => {


      //console.log(x)
      if (x.action == 'loadMore') {
        let dialogData = {

          "Id": this.projectService.getSession('accountid'),
          "Searchtext": x.objectRowData.searchKey ? x.objectRowData.searchKey : '',
          "pagesize": this.lookupdata.recordCount,

          "RequestedPageNumber": x.currentPage,
          "OdatanextLink": this.lookupdata.nextLink
        }

        this.projectService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: dialogData }).subscribe(res => {
          // this.lookupdata.tabledata = res.ResponseObject + this.lookupdata.tabledata
          this.lookupdata.isLoader = false
          this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject)
          this.lookupdata.nextLink = res.OdatanextLink
          this.lookupdata.TotalRecordCount = res.TotalRecordCount

        })

      } else if (x.action == 'search') {

        this.lookupdata.nextLink = ''

        let dialogData = {

          "Id": this.projectService.getSession('accountid'),
          "Searchtext": x.objectRowData.searchKey ? x.objectRowData.searchKey : '',
          "pagesize": this.lookupdata.recordCount,

          "RequestedPageNumber": x.currentPage,
          "OdatanextLink": this.lookupdata.nextLink


        }

        this.projectService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: dialogData }).subscribe(res => {
          this.lookupdata.isLoader = false
          this.lookupdata.tabledata = res.ResponseObject
          this.lookupdata.nextLink = res.OdatanextLink
          this.lookupdata.TotalRecordCount = res.TotalRecordCount


        })

      }


    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        //console.log(result)
        this.AppendParticularInputFun(result.selectedData, result.controlName)
      }
    });
  }



  AppendParticularInputFun(selectedData, controlName) {

    if (selectedData) {
      if (selectedData.length > 0) {

        this.appendleadslinkedData(selectedData);


      }
    }
  }

  appendleadslinkedData(selectedData) {
    this.selectedleadslinked = this.selectedleadslinked.concat(selectedData);
    this.selectedleadslinked = this.selectedleadslinked.map(e => e['Id']).map((e, i, final) => final.indexOf(e) === i && i)
      .filter(e => this.selectedleadslinked[e]).map(e => this.selectedleadslinked[e]);
    //console.log(this.selectedleadslinked)
  }

  /*****************Advance search popup ends*********************/



  //shinder
  accountid1;
  ngOnInit() {
    this.accountid1 = this.projectService.getSession('accountid')
  }

  leadslinkedModel: string;
  leadslinkedSwitch: boolean;
  linkedleadslinkedClose() {
    this.leadslinkedSwitch = false;
  }
  appendleadslinked(item) {
    var id = item.LeadGuid
    var value = item.Name
    var owner = item.OwnerId
    var ownerN = item.OwnerName

    if (!(this.selectedleadslinked.some(it => it.LeadGuid == id))) {
      this.leadslinkedSwitch = false
      this.leadslinkedModel = value;
      this.selectedleadslinked.push({
        'accountName': 'Lead name',
        'Name': value,
        'LeadGuid': id,
        'mapGuid': "",
        'Id': id,
        'ownerr': owner,
        'ownerN': ownerN
      }
      )


      //  'accountName': 'Lead name',
      //             'name': response.ResponseObject[i].Title,
      //             "LeadGuid": response.ResponseObject[i].Guid,
      //             "mapGuid": response.ResponseObject[i].MapGuid



    }
    else {
      this.projectService.displayMessageerror('Duplicate value exists')
    }

    //console.log(this.selectedleadslinked, 'select');
    this.leadslinkedModel = ''
  }








  leadData() {


    let obj =
      {
        "Id": this.projectService.getSession('accountid'),
        "Searchtext": this.leadslinkedModel ? this.leadslinkedModel : '',
        "pagesize": 10,
        "RequestedPageNumber": 1,
        "OdatanextLink": null
      }

    this.isLoading = true;
    this.projectService.getLinkedLeadSearchData(obj).subscribe(response => {
      if (!response.IsError) {

        if (response.ResponseObject && (Array.isArray(response.ResponseObject) ? response.ResponseObject.length > 0 : false)) {
          this.leadslinkedContact = response.ResponseObject
          this.lookupdata.TotalRecordCount = response.TotalRecordCount
          this.lookupdata.nextLink = response.OdatanextLink

        }
        else {

        }
      }
      else {
        this.projectService.displayMessageerror(response.Message);
      }
      this.isLoading = false;
    },
      err => {
        this.isLoading = false;
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      }
    );

  }

  okButton() {
    this.isLoading = true;
    var saveFilterData = this.selectedleadslinked.filter((it) => it.mapGuid == "")
    if (saveFilterData.length > 0) {

      var body = []
      for (var i = 0; i < saveFilterData.length; i++) {
        body.push({
          "LeadGuid": saveFilterData[i].LeadGuid,
          "SysGuid": this.projectService.getSession('opportunityId'),
          "Type": "Opportunity",
          'OwnerId': saveFilterData[i].ownerr
        })
      }
    
      this.projectService.saveLead(body).subscribe(response => {

        if (!response.IsError) {
          if (response.ResponseObject) {
            this.projectService.displayMessageerror('Lead saved successfully');
            this.dialogRef.close('save');

          }
          else {
            this.projectService.displayMessageerror(response.Message);
          }

        }
        else {
          this.projectService.displayMessageerror(response.Message);
        }
        this.isLoading = false;
      },
        err => {
          this.isLoading = false;
          this.service.loaderhome = false;
          this.projectService.displayerror(err.status);
        }
      );


    }
    else {
      this.dialogRef.close();
    }



  }

  deleteActivityData(i) {

    if ((this.selectedleadslinked[i].mapGuid) == "") {
      this.selectedleadslinked.splice(i, 1);
    }
    else {
      let obj = { "Guid": this.selectedleadslinked[i].mapGuid }
      this.isLoading = true;
      this.projectService.deleteLeadData(obj).subscribe(response => {
        if (!response.IsError) {

          this.selectedleadslinked.splice(i, 1);
        }
        else {
          this.projectService.displayMessageerror(response.Message);
        }
        this.isLoading = false;
      },

        err => {
          this.isLoading = false;
          this.service.loaderhome = false;
          this.projectService.displayerror(err.status);
        }
      );
    }
  }


  leadslinkedContact = []

  selectedleadslinked: any = [];
  selectedleads: any = [];
}







@Component({
  templateUrl: './pursuitpopup.html'
})

export class Pursuitpopup implements OnInit {
  isLoading: boolean = false;
  constructor(public router: Router,
    public dialogRef: MatDialogRef<Pursuitpopup>,
    public dialog: MatDialog) { }
  ngOnInit() { }
  showcancel(isProceed) {
    this.dialogRef.close(isProceed);
  }
}

@Component({
  templateUrl: './securepopup.html'
})

export class securedealpopup implements OnInit {
  constructor(public router: Router, @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<securedealpopup>,
    public dialog: MatDialog) { }
  pricingIdAvail = true;
  ngOnInit() {
    this.pricingIdAvail = this.data ? this.data.pricingIdAvail : true;
  }
  showcancel(isProceed) {
    this.dialogRef.close(isProceed);
  }
  onNoClick() { }
}



@Component({
  templateUrl: './confirm-save.html'
})
export class ConfirmSaveComponent {
  isLoading: boolean = false;
  onAdd = new EventEmitter();
  constructor(public dialogRef: MatDialogRef<ConfirmSaveComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  onButtonClick(flag) {
    this.onAdd.emit(flag);
    this.dialogRef.close(flag);
  }
}



@Component({
  selector: 'reopenopportunity-pop',
  templateUrl: './../../../../shared/components/single-table/sprint4Modal/reopenOpportunity-pop.html',
  styles: [`
    .disableAssign
  {
      pointer-events: none;
      color: rgba(0,0,0,.26);
      background-color: rgba(0,0,0,.12);
  }
  `]
})
export class ReopenOpportunityPopComponentt {
  opportunityID = '';
  opportunityName = '';
  reopenData = [];
  filterData = [];
  panelOpenState: boolean;
  isLoading: boolean = false;
  datePipe = new DatePipe("en-US");
  constructor(public dialogRef: MatDialogRef<ReopenOpportunityPopComponentt>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data, private allopportunities: OpportunitiesService, public service: DataCommunicationService) {

    //console.log(data.data.objectRowData, 'reopem');
    // this.reopenData=data.data.objectRowData;
    this.opportunityID = data.data[0].OpportunityId;
    this.reopenData = data.data.filter((it) => it.isCheccked = true);
    this.filterData = this.reopenData.filter((it) => it.isCheccked == true)
    //console.log(this.opportunityID);
  }
  selectCheck() {
    this.filterData = this.reopenData.filter((it) => it.isCheccked == true)
  }
  currDate = new Date().toLocaleDateString()
  confirm() {



    let body = {
      "OpportunityId": this.opportunityID,
      "RequestedReOpenOn": (this.datePipe.transform(this.currDate, "yyyy-MM-dd"))
    }
    this.isLoading = true
    this.allopportunities.reopenSave(body).subscribe(response => {
      if (!response.IsError) {
        if (response.Message == "success") {
          this.allopportunities.displayMessageerror("Your request for reopen opportunity has been sent to helpdesk.");
          this.dialogRef.close('close');
        }
        else {
          this.allopportunities.displayMessageerror(response.Message);
        }
      }

      else {
        this.allopportunities.displayMessageerror(response.Message);
      }
      this.isLoading = false
    },
      err => {
        this.isLoading = false;
        this.service.loaderhome = false;
        this.allopportunities.displayerror(err.status);
      }
    );

  }


}







@Component({
  selector: 'confirmPopUp',
  template: `<div class="col-12 float-left no_pad popup-container popup-container-opportunity">
        <div class="col-12 float-left container-dialog">
            <div class="col-12 float-left  no_pad popup-hd">
                <span class="col-10 float-left no_pad popup-hd-txt" mat-dialog-title>Confirm
                </span>
                <button class="col-2 float-left  no_pad btndef-none mdi mdi-window-close close-icn" aria-label="close" mat-dialog-close (click)="onButtonClick(false)"></button>
            </div>
            <div class="col-12 float-left border-bottom-grey"></div>
            <div class="col-12 float-left no_pad">
                <span class="col-12 float-left  no_pad margin-top-20 mbot-20 add-cont">{{message}}</span>
            </div>
        </div>
        <div class="col-12 float-left no_pad">
            <button aria-label="yes" class="col-6 float-left btndef-none no_pad confrm-btn mt15" (click)="onButtonClick('yes')" >OK</button>
            <button aria-label="no" class="col-6 float-left btndef-none no_pad discard-btn" (click)="onButtonClick('false')"
                >Cancel</button>

        </div>
    </div>`

})

export class confirmPopUp {
  message
  constructor(public dialogRef: MatDialogRef<confirmPopUp>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data) {

    this.message = data
  }
  onButtonClick(value) {

    this.dialogRef.close(value)
  }
}
@Component({
  selector: 'on-hold-pop',
  templateUrl: './on-hold-popup.html',
  styleUrls: ['./opportunity-view.component.scss']
})
export class OnHoldPopComponent implements OnInit {
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<OnHoldPopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public orderService: OrderService, public projectService: OpportunitiesService) {

  }

  ngOnInit() {
    this.getOnHoldReasonData();
  }

  saveDisable: boolean = true;
  onHoldReason = "";
  bgcolorblue: any;
  reasonId: any;
  wipro_holdreason = []

  onClose(flag) {
    let returnObj = {
      flag: flag,
      reason: this.selectedArr.toString(),
      comment: this.onHoldReason
    }
    this.dialogRef.close(returnObj);
  }

  getOnHoldReasonData() {
    this.orderService.getOnHoldReasons().subscribe((reasons: any) => {
      if (!reasons.IsError) {
        reasons.ResponseObject.map((data: any) => {
          let obj = {
            Id: data.Id,
            Name: data.Name,
            checked: false
          }
          this.wipro_holdreason.push(obj);
        });
        console.log("data", this.wipro_holdreason)
      }
    },
      err => {
        console.log(err)
      })
  }

  selectedArr = [];
  getCheckboxValues() {
    console.log(this.wipro_holdreason.filter(x => x.checked === true).map(x => x.Id));
    this.selectedArr = this.wipro_holdreason.filter(x => x.checked === true).map(x => x.Id)
    if (this.selectedArr.length == 0 || !this.onHoldReason) {
      this.saveDisable = true;
    }
    else {
      this.saveDisable = false;
    }

  }

  textAreaEmpty() {
    if (this.onHoldReason.trim() != "") {
      this.bgcolorblue = true;
      console.log(this.onHoldReason);
    }
    else {
      this.bgcolorblue = false;
    }
    if (this.selectedArr.length == 0 || !this.onHoldReason) {
      this.saveDisable = true;
    }
    else {
      this.saveDisable = false;
    }
  }

}
@Component({
  selector: 'reject-pop',
  templateUrl: './reject-popup.html',
  styleUrls: ['./opportunity-view.component.scss']
})
export class RejectPopComponent {
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<RejectPopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  rejectReason: any;
  bgcolorblue: any;

  onClose(flag) {
    let returnObj = {
      flag: flag,
      reason: this.rejectReason
    }
    this.dialogRef.close(returnObj);
  }

  textAreaEmpty() {
    if (this.rejectReason.trim() != "") {
      this.bgcolorblue = true;
      console.log(this.rejectReason);
    }
    else {
      this.bgcolorblue = false;
    }
  }
}


@Component({
  selector: 'approve-opportunity-popup',
  templateUrl: './approve-opportunity-popup.html',
  styleUrls: ['./opportunity-view.component.scss']
})
export class Approveopportunitypopup {
  constructor(public projectService: OpportunitiesService, public dialogRef: MatDialogRef<omchangepopup>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  ApproveReason = "";

  onClose(flag) {
    let returnObj = {
      flag: flag,
      reason: this.ApproveReason
    }
    this.dialogRef.close(returnObj);
  }

}

@Component({
  selector: 'integratedDealPopup',
  templateUrl: './integratedDealPopup.html',
})
export class integratedDealPopup implements OnInit {
  constructor(public dialogRef: MatDialogRef<integratedDealPopup>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  ngOnInit() { }
}





