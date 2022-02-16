import { Component, OnInit, Input, EventEmitter, Output, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DataCommunicationService } from '@app/core/services/global.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable, of, forkJoin } from 'rxjs';
import { OrderService } from '@app/core/services/order.service';
import { ApprovepopupComponent } from '../../modal/approvepopup/approvepopup.component';
import { OnholdpopupComponent } from '../../modal/onholdpopup/onholdpopup.component';
import { AssignpopupComponent } from '../../modal/assignpopup/assignpopup.component';
import { RejectpopupComponent } from '../../modal/rejectpopup/rejectpopup.component';
import { OpportunitiesService } from '@app/core';
import { ApprovebfmComponent } from '../../modal/approvebfm/approvebfm.component';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { OrderApprovalStage, orderApprovalType, columnFilterNumbers, orderTypeId } from './../../../../modules/opportunity/pages/opportunity-view/tabs/order/orderenum';
import { OrderHeader, linkedLeadsHeaders, linkedLeadNames } from '@app/core/services';
import { SharePopupComponent } from '@app/modules/opportunity/pages/landing-opportunity/tabs/all-opportunities/share-popup/share-popup.component';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { environment as env } from '@env/environment';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;

export interface SBUDetail {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-order-landing',
  templateUrl: './order-landing.component.html',
  styleUrls: ['./order-landing.component.scss']
})
export class OrderLandingComponent implements OnInit {

  allBtnLabel = ['assignOrderBtnVisibility', 'shareBtnVisibility']
  showrolelist;
  tableTotalCount: number = 0;
  role: string = 'default';
  userId: any = '';
  roleID: any = [];
  selectedroleListId: any = "";
  showmore: boolean = false;
  sidebar: boolean;
  checkBoxFlag = false;

  // app-order-landing 
  dynamicExpansionView: string = "app-order-bfm-expansion-data";

  filterConfigData = {
    OrderId: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Type: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    OrderTcv: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    StartDate: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    EndDate: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Status: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    AccountName: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    ApprovalType: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    PricingType: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    OpportunityName: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    OpportunityId: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    SAPCustomerCode: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    CreatedOn: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    OrderOwner: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    isFilterLoading: false,
  };

  constructor(public router: Router, public service: DataCommunicationService, public dialog: MatDialog, private order: OrderService, private opportunityService: OpportunitiesService,
    private EncrDecr: EncrDecrService, public OpportunityServices: OpportunitiesService,public envr : EnvService) { }


  AllOrderTable: any[] = [];
  AllOrderTableadh = [];
  AllOrderTablebfm = [];
  AllOrderTabledmwt = [];
  AllOrderTabledmnonwt = [];
  searchOrder = "";
  Role = "";
  statusCode = "";
  isTick: boolean = false;
  isReject: boolean = false;
  //Start code for declaring variable of neha //
  orderApprovalStatus = {
    WT: false,
    signed: false
  };
  createAmmendmentDisabled: boolean = false;
  currentSortValue;
  //   paginationPageNo = {
  //     "PageSize": "10",
  //     "RequestedPageNumber": "1",
  //     "SearchText": "",
  //     "Statuscode": "",
  //     "UserGuid": ""
  // }

  paginationPageNo = {
    "PageSize": 50,
    "RequestedPageNumber": 1,
    "SearchText": "",
    "Statuscode": "",
    "UserGuid": this.userId,
    "RoleId": this.selectedroleListId,
    "ViewId": ''
  }
  //end code for declaring variable neha
  helpLineRoleFlag = true;
  accountLogin: boolean = false;
  tableName: string = 'allorders';
  exportFlag = false
  ngOnInit() {
    // this.userId=this.EncrDecr.get('');
    this.opportunityService.clearSession('showAssign');
    if (this.router.url.includes('/accounts/accountorders')) {
      this.accountLogin = true;
      this.tableName = 'accountOrders';
      this.sidebar = true;
    } else {
      this.tableName = 'allorders'
    }
    this.userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
    this.columnFilterDetails.UserGuid = this.userId;
    this.opportunityService.clearSession('dealID');
    this.opportunityService.clearSession('pricingID');
    this.opportunityService.clearSession('bfmRoleModifiedOrders');
    this.getRoleList();

    // this.gainRoleApi().subscribe(resData => {
    //   if (!resData.IsError) {
    //     debugger;
    //     this.exportFlag = resData.ResponseObject.IsExportExcel ? true : false
    //     if (resData.ResponseObject.IsHelpRoleFullAccess) {
    //       this.helpLineRoleFlag = false;
    //     } else {
    //       this.helpLineRoleFlag = true;
    //     }
    //   }
    //   console.log("OrderEnum", orderApprovalType);
    //   console.log(" this.userId", this.userId);
    //   this.getORderList(this.paginationPageNo);
    // }, err => {
    //   console.log("OrderEnum", orderApprovalType);
    //   console.log(" this.userId", this.userId);
    //   this.getORderList(this.paginationPageNo);
    // });

  }



  TabNavigation(item) {

    switch (item.index) {
      case 0:
        sessionStorage.setItem('navigation', JSON.stringify(1))
        this.router.navigate(['/order'])
        return
      case 1:
        sessionStorage.setItem('navigation', JSON.stringify(2))
        window.open(this.router.url + '/moreviews');
        return;
      case '184450002':
      case '184450000':
        this.paginationPageNo.RoleId = this.selectedroleListId;
        this.columnFilterDetails.RoleId = this.selectedroleListId;
        this.paginationPageNo.PageSize = 50;
        this.paginationPageNo.RequestedPageNumber = 1;

        this.selectedTabId = item.index == '184450002' ? 'bfmRoleOrders' : 'bfmRoleModifiedOrders'
        if (item.index == '184450000') {
          this.opportunityService.setSession('bfmRoleModifiedOrdersFlag', true);
        }

        this.paginationPageNo.ViewId = item.index;
        this.clearAllFilters('tabNavigation');
        return;

    }
  }

  roleSelection(id, val) {
    this.role = val;
    this.selectedroleListId = id
    console.log("val", val);

    this.paginationPageNo.RoleId = this.selectedroleListId;
    this.columnFilterDetails.RoleId = this.selectedroleListId;
    this.paginationPageNo.PageSize = 50;
    this.paginationPageNo.RequestedPageNumber = 1;

    if (id == '184450002') {
      this.selectedTabId = 'bfmRoleOrders';
    } else {
      this.selectedTabId = 'allorders';
    }


    this.paginationPageNo.ViewId = this.selectedTabId == 'bfmRoleOrders' ? '184450002' : '';
    this.getORderList(this.paginationPageNo);


  }

  gainRoleBase() {
    this.gainRoleApi().subscribe(resData => {
      if (!resData.IsError) {
        debugger;
        this.exportFlag = resData.ResponseObject.IsExportExcel ? true : false
        if (resData.ResponseObject.IsHelpRoleFullAccess) {
          this.helpLineRoleFlag = false;
        } else {
          this.helpLineRoleFlag = true;
        }

      }
       if (this.roleID) {
        const bfmRoleCheck = this.roleID.filter(role => role.RoleId == '184450002')
        if (bfmRoleCheck.length > 0) {
          this.roleSelection(bfmRoleCheck[0].RoleId, bfmRoleCheck[0].RoleName)
        }
        else{
           this.getORderList(this.paginationPageNo);
        }
      }
      else {
         this.getORderList(this.paginationPageNo);
      }
      console.log("OrderEnum", orderApprovalType);
      console.log(" this.userId", this.userId);
     
    }, err => {
      console.log("OrderEnum", orderApprovalType);
      console.log(" this.userId", this.userId);
      this.getORderList(this.paginationPageNo);
    });
  }

  getRoleList() {
    const Payload = {
      "Guid": this.userId
    }
    this.order.getRoleListForOrderListing(Payload).subscribe((respOfRoleList: any) => {
      console.log("respOfRoleList", respOfRoleList);
      console.log("saurav", respOfRoleList.ResponseObject[0].RoleName);
      const resofRoleLists = respOfRoleList;
      this.roleID = resofRoleLists.ResponseObject;
      this.gainRoleBase();
      console.log("this.roleID", this.roleID, Payload)
    })
  }


  tickedBtnVisibility: boolean;
  rejectBtnVisibility: boolean;

  assignOrderBtnVisibility: boolean;
  getSymbol(data) {
    return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
  }

  gainRoleApi(): Observable<any> {

    return this.OpportunityServices.roleApi();

  }

  getORderList(paginationPageNo) {
    if (this.opportunityService.getSession('loadBFMScreen')) {
      this.opportunityService.clearSession('loadBFMScreen');
      // if (this.opportunityService.getSession('bfmRoleModifiedOrdersFlag')) {
      //   this.opportunityService.clearSession('bfmRoleModifiedOrdersFlag')
      //   let item = {
      //     index: '184450000'
      //   }
      // }
      this.selectedroleListId = '184450002';
      this.roleSelection('184450002', 'BFM');
      return;
    }
    if (!this.accountLogin) {
      this.userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')

      paginationPageNo.UserGuid = this.userId

      let startIndex = ((paginationPageNo.RequestedPageNumber - 1) * paginationPageNo.PageSize) + 1;
      this.service.loaderhome = true;
      this.order.getOrderLandingList(paginationPageNo.PageSize, paginationPageNo.RequestedPageNumber, paginationPageNo.SearchText, paginationPageNo.RoleId, paginationPageNo.status,
        paginationPageNo.UserGuid, this.paginationPageNo.ViewId).subscribe(async orderListing => {
          this.resetValues();
          console.log("orderListing1", orderListing);
          console.log("paginationPageNo", this.paginationPageNo)
          this.tableTotalCount = orderListing.TotalRecordCount;
          console.log("tableTotalCount", this.tableTotalCount);
          this.AllOrderTable = [];
          setTimeout(() => {
            this.AllOrderTable = this.fetchAllOrdersList(orderListing);
            this.AllOrderTable = this.fetchStatusColors(this.AllOrderTable);

            let assignCount = 0;
            this.AllOrderTable.map(res => {
              if (!res.assignOrderBtnVisibility) {
                assignCount = assignCount + 1;
              }
            })
            if (assignCount == this.AllOrderTable.length) {
              this.checkBoxFlag = true;
            }

            console.log("this.AllOrderTable", JSON.stringify(this.AllOrderTable))
            this.service.loaderhome = false;
          }, 0);
        })
    } else {
      this.paginationPageNo.PageSize = 50;
      this.paginationPageNo.RequestedPageNumber = 1;
      this.clearAllFilters('accountLogin');
    }

  }

  orderList = [];

  /************Select Tabs dropdown code starts */
  selectedTabValue: string = "All orders";
  selectedTabId: string = 'allorders';
  appendConversation(e) {
    if (!e.showView) {
      this.selectedTabValue = e.name;
    }
    if (e.router) {
      this.router.navigate([e.router]);
    }
  }

  tabList: any = [
    {
      GroupLabel: 'System views',
      GroupData: [
        {
          id: 'allOrder', title: 'All orders'

        },
        {
          id: 'moreviews', title: 'More Views'

        }

      ]
    },

  ]


  // MORE ACTION STARTS **************
  showContent: boolean = false;

  closeContent() {
    this.showContent = false;
  }

  toggleContent() {
    this.showContent = !this.showContent;
  }
  // MORE ACTION ENDS *******************

  /****************************************************************************************************
   * @name : Single table actions
   * @description : A common function that takes action on the events emitted in the single table
   * @author : Harin Shah
   */
  performTableChildAction(childActionRecieved): Observable<any> {

    const actionRequired = childActionRecieved;

    console.log(childActionRecieved);
    switch (actionRequired.action) {
      case 'ClearAllFilter':
        this.clearAllFilters(childActionRecieved)
        return;
      case 'cancelTaskReminder':
        this.cancelTaskReminder(childActionRecieved);
        return;

      case 'search':
        this.paginationPageNo.RequestedPageNumber = 1;
        const body = {
          ...this.columnFilterDetails
        };
        body.SearchText = childActionRecieved.filterData.globalSearch ? childActionRecieved.filterData.globalSearch : '';
        this.fetchFilterdDataList(childActionRecieved, '', body);
        return;
      case 'DownloadCSV': {
        console.log("downloafing")
        this.downloadList(childActionRecieved);
        return
      }
      case "columnFilter":
        this.fetchColumnFilters(childActionRecieved);
        return;
      case "columnSearchFilter":
      case 'loadMoreFilterData':
        this.columnSearchAndLoadMore(childActionRecieved, childActionRecieved.action)
        return;

      case 'sortHeaderBy': {
        console.log(childActionRecieved);
        const body = {
          ...this.columnFilterDetails
        };
        body.IsDesc = !childActionRecieved.filterData.sortOrder;
        body.SortBy = +(columnFilterNumbers[childActionRecieved.filterData.sortColumn]);

        this.fetchFilterdDataList(childActionRecieved, '', body);
        return;
      }

      case 'Name': {

        this.router.navigate(['/accounts/accountdetails']);
        return;
      }
      case 'reminder': {
        this.setTaskReminder(childActionRecieved);
        return;
      }
      case 'reschedule': {
        this.fetchTaskRescheduleDetails(childActionRecieved);
        return;
      }

      case 'OpportunityName': {
        this.opportunityNameClicked(actionRequired)
        return;
      }
      case 'tabNavigation':
        {
          this.TabNavigation(childActionRecieved.objectRowData[0])
          return
        }

      case 'OpportunityNameBFM': {
        this.opportunityService.setSession('rowData', actionRequired.objectRowData[0]);
        this.router.navigate(['/order/orderlistbfmchild/userdeclarations']);
        return;
      }
      case 'OpportunityNameADH': {
        return;
      }

      case 'Ticked': {
        this.tickedButton(actionRequired)
        return;
      }

      case 'Timer': {
        const dialogRef = this.dialog.open(OnholdpopupComponent, {
          width: '350px',
        });
        return;
      }

      case 'Assign': {
        const dialogRef = this.dialog.open(AssignpopupComponent, {
          width: '450px',
          data: { data: JSON.parse(JSON.stringify(actionRequired.objectRowData)) }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result == 'close') {
          }
          else {
            this.ngOnInit();
          }
        });
        return;
      }

      case 'OrderId': {
        this.orderClicked(actionRequired)
        return;

      }

      case 'AccountName': {
        let accountcontacts = {
          "Name": actionRequired.objectRowData[0].AccountName,
          "SysGuid": actionRequired.objectRowData[0].AccountID,
          "isProspect": false
        }
        const temp = this.EncrDecr.set('EncryptionEncryptionEncryptionEn', JSON.stringify(accountcontacts), 'DecryptionDecrip');
        localStorage.setItem('selAccountObj', temp);
        sessionStorage.setItem('selAccountObj', temp);
        this.opportunityService.setSession('routeParams', { 'route_from': 'acc_req', 'Id': actionRequired.objectRowData[0].AccountID });
        this.router.navigate(['/accounts/accountdetails']);
        return;
      }

      case 'reject': {
        this.rejectClicked(actionRequired)
        return;
      }

      case 'share':
        this.getShareTemplateAPi(childActionRecieved);
        return;

      case 'taskDetails':
        this.fetchTaskDetails(childActionRecieved);
        return;
    }
  }

  opportunityNameClicked(actionRequired: any) {

    console.log('actionRequired.objectRowData[0]', actionRequired.objectRowData[0]);
    this.opportunityService.setSession('opportunityId', actionRequired.objectRowData[0].IdOfOpportunity ? actionRequired.objectRowData[0].IdOfOpportunity.toString() : '');
    this.opportunityService.setSession('opportunityName', actionRequired.objectRowData[0].OpportunityName ? actionRequired.objectRowData[0].OpportunityName.toString() : '');
    this.opportunityService.setSession('bfm_order_data', actionRequired.objectRowData[0])
    this.opportunityService.clearSession("smartsearchData");
    //this.router.navigate(['/opportunity/opportunityview/order'])
    this.opportunityService.setSession('IsAmendment', (actionRequired.objectRowData[0].IsAmendment && actionRequired.objectRowData[0].IsAmendment == true) ? actionRequired.objectRowData[0].IsAmendment : false);
    this.opportunityService.setSession('orderId', actionRequired.objectRowData[0].orderBookingId ? actionRequired.objectRowData[0].orderBookingId.toString() : '');
    this.opportunityService.setSession('orderType', actionRequired.objectRowData[0].Type ? actionRequired.objectRowData[0].Type.toString() : '');
    this.opportunityService.setSession('pricingID', actionRequired.objectRowData[0].PricingId ? actionRequired.objectRowData[0].PricingId.toString() : '');
    this.opportunityService.setSession('orderName', actionRequired.objectRowData[0].OrderName ? actionRequired.objectRowData[0].OrderName.toString() : '');
    this.order.newAmendmentDetails = "";
    this.order.parentOrderId = "";
    this.order.amendmentInProcess = false;
    this.opportunityService.restTab = false;
    this.opportunityService.summaryOppTab = true;
    this.opportunityService.initiateObButton = false;
    this.opportunityService.setSession('opportunityRedirect', 'T');
    this.opportunityService.setSession('BFMNavagationFlag', false);
    this.router.navigate(['/opportunity/opportunityview']);
  }
  rejectClicked(actionRequired: any) {
    if (actionRequired.objectRowData[0].nonWTFlag == false && actionRequired.objectRowData[0].id == orderTypeId.New && this.selectedroleListId == 184450001) {
      let requestBody = {
        "Flag": true,
        "Guid": actionRequired.objectRowData[0].orderBookingId
      }
      this.order.getStatusForRetag(requestBody).subscribe((data: any) => {
        console.log("data", data);
        if (data && data.IsError == false) {
          if (data.ResponseObject == true) {
            this.opportunityService.displayMessageerror('There is project with released status tagged to this order ' + actionRequired.objectRowData[0].OrderId + ', hence cannot be rejected.');
          } else {
            this.openRejectPopup(actionRequired);
          }
        } else {
          this.opportunityService.displayerror("Server error occured");
        }
      }, err => {
        this.opportunityService.displayerror(err.status);
      }
      );
    } else {
      this.openRejectPopup(actionRequired);
    }
  }

  orderClicked(actionRequired: any) {
    if (!actionRequired.objectRowData[0].assignOrderBtnVisibility) {
      this.opportunityService.setSession('showAssign', true);
    }
    console.log('actionRequired.objectRowData[0]', actionRequired.objectRowData[0]);
    this.opportunityService.setSession('opportunityId', actionRequired.objectRowData[0].IdOfOpportunity ? actionRequired.objectRowData[0].IdOfOpportunity.toString() : '');
    this.opportunityService.setSession('opportunityName', actionRequired.objectRowData[0].OpportunityName ? actionRequired.objectRowData[0].OpportunityName.toString() : '');
    if (this.selectedroleListId == '184450002') {
      this.order.sendBFMData(actionRequired.objectRowData[0]);
      this.opportunityService.setSession('bfm_order_data', actionRequired.objectRowData[0])
      // this.router.navigate(['/opportunity/opportunityview/userdeclarations']);
      //this.order.BFMNavagationFlag = true;
      this.opportunityService.clearSession("smartsearchData");
      this.opportunityService.setSession('IsAmendment', (actionRequired.objectRowData[0].IsAmendment && actionRequired.objectRowData[0].IsAmendment == true) ? actionRequired.objectRowData[0].IsAmendment : false);

      this.opportunityService.setSession('orderType', actionRequired.objectRowData[0].Type ? actionRequired.objectRowData[0].Type.toString() : '');
      this.opportunityService.setSession('orderName', actionRequired.objectRowData[0].OrderName ? actionRequired.objectRowData[0].OrderName.toString() : '');
      this.opportunityService.setSession('orderId', actionRequired.objectRowData[0].orderBookingId ? actionRequired.objectRowData[0].orderBookingId.toString() : '');

      this.opportunityService.setSession('pricingID', actionRequired.objectRowData[0].PricingId ? actionRequired.objectRowData[0].PricingId.toString() : '');
      this.order.newAmendmentDetails = "";
      this.order.parentOrderId = "";
      this.order.amendmentInProcess = false;
      this.opportunityService.restTab = false;
      this.opportunityService.summaryOppTab = true;
      this.opportunityService.initiateObButton = false;
      this.opportunityService.winreasonNavigate1 = false;
      this.opportunityService.winreasonNavigate2 = false;
      this.opportunityService.restTab = false;
      this.opportunityService.summaryOppTab = true;
      this.opportunityService.initiateObButton = false;
      this.opportunityService.winreasonNavigate1 = false;
      this.opportunityService.winreasonNavigate2 = false;
      if (this.selectedTabId == 'bfmRoleModifiedOrders') {
        this.opportunityService.setSession('bfmRoleModifiedOrders', true);
      }
      this.opportunityService.setSession('BFMNavagationFlag', true);

      this.router.navigate(['/opportunity/opportunityview']);
    } else {
      this.opportunityService.clearSession("smartsearchData");
      //this.router.navigate(['/opportunity/opportunityview/order'])
      this.opportunityService.setSession('IsAmendment', (actionRequired.objectRowData[0].IsAmendment && actionRequired.objectRowData[0].IsAmendment == true) ? actionRequired.objectRowData[0].IsAmendment : false);
      this.opportunityService.setSession('orderId', actionRequired.objectRowData[0].orderBookingId ? actionRequired.objectRowData[0].orderBookingId.toString() : '');
      this.opportunityService.setSession('orderType', actionRequired.objectRowData[0].Type ? actionRequired.objectRowData[0].Type.toString() : '');
      this.opportunityService.setSession('orderName', actionRequired.objectRowData[0].OrderName ? actionRequired.objectRowData[0].OrderName.toString() : '');
      this.opportunityService.setSession('pricingID', actionRequired.objectRowData[0].PricingId ? actionRequired.objectRowData[0].PricingId.toString() : '');
      this.order.newAmendmentDetails = "";
      this.order.parentOrderId = "";
      this.order.amendmentInProcess = false;
      this.opportunityService.restTab = false;
      this.opportunityService.summaryOppTab = true;
      this.opportunityService.initiateObButton = false;
      this.opportunityService.winreasonNavigate1 = false;
      this.opportunityService.winreasonNavigate2 = false;
      this.opportunityService.restTab = false;
      this.opportunityService.summaryOppTab = true;
      this.opportunityService.initiateObButton = false;
      this.opportunityService.winreasonNavigate1 = false;
      this.opportunityService.winreasonNavigate2 = false;
      //this.order.BFMNavagationFlag = false;
      this.opportunityService.setSession('BFMNavagationFlag', false);
      this.router.navigate(['/opportunity/opportunityview']);

    }
  }

  tickedButton(actionRequired: any) {
    if (this.role == 'dmnonwt' || this.role == "ADH/VDH/SDH") {
      this.openapproveDMNonWT(actionRequired.objectRowData[0]);
    } else {
      const dialogRef = this.dialog.open(ApprovepopupComponent, {
        width: '350px',
        data: {
          data: actionRequired.objectRowData[0],
          parentPage: 'order approval',
          value: actionRequired,
          role: this.role,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result.flag == 'YES') {
            let obj = {
              "ApprovalComment": result.reason,
              "TCVComparisonComment": "Some text",
              "ApprovalStage": "Approval",
              "SalesOrderId": actionRequired.objectRowData[0].OrderId
            }
            this.getORderList(this.paginationPageNo);
          }
        }
      });
    }
  }

  openRejectPopup(actionRequired) {
    const dialogRef = this.dialog.open(RejectpopupComponent, {
      width: '350px',
      data: {
        data: actionRequired.objectRowData[0],
        // pageStatus :"order landing",
        parentPage: 'order approval',

        value: actionRequired,
        role: this.role,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.flag == 'YES') {
          let obj =
            {
              "RejectionComment": result.reason,
              "ApprovalStage": "Rejection",
              "SalesOrderId": actionRequired.objectRowData[0].OrderId
            }
          this.getORderList(this.paginationPageNo)
        }
      }
    });
  }

  getShareTemplateAPi(actionRequired) {
    this.service.loaderhome = true;
    let order = this.opportunityService.getTemplate('Order (Read)');
    let account = this.opportunityService.getTemplate('Account (Read)');
    let opportunity = this.opportunityService.getTemplate('Opportunity (Read)');
    forkJoin([order, account, opportunity]).subscribe(response => {
      console.log(response);
      if (response && response[0] && response[1] && response[2] && !response[0].IsError && !response[1].IsError && !response[2].IsError) {
        this.service.loaderhome = false;
        var templateId = response
        this.sharePopup(actionRequired, templateId)
      }
      else {
        this.opportunityService.displayMessageerror('Oops!!! An error occured');
      }
    }
      ,
      err => {
        this.service.loaderhome = false;
        this.opportunityService.displayerror(err.status);
      }
    );


  }
  sharePopup(actionRequired, templateIds) {

    const dialogRef = this.dialog.open(SharePopupComponent,
      {
        width: '480px',
        data: {
          data: JSON.parse(JSON.stringify(actionRequired.objectRowData)),
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

  createBodyForDownload(data) {
    console.log(data)
    return {
      "PageSize": 50,
      "RequestedPageNumber": this.paginationPageNo.RequestedPageNumber,
      "SearchText": (data.filterData.globalSearch) ? (data.filterData.globalSearch != "") ? data.filterData.globalSearch : '' : '',
      "RoleId": this.selectedroleListId,
      "OrderStages": this.OpportunityServices.pluckParticularKey(data.filterData.filterColumn['Status'], 'id'),
      "UserGuid": this.userId,
      "OdatanextLink": "",
      "IsDesc": (data.filterData.sortColumn != '') ? !data.filterData.sortOrder : false,
      "ApprovalType": this.OpportunityServices.pluckParticularKey(data.filterData.filterColumn['ApprovalType'], 'id'),
      "OrderTypes": this.OpportunityServices.pluckParticularKey(data.filterData.filterColumn['Type'], 'id'),
      "OpportunityNames": this.OpportunityServices.pluckParticularKey(data.filterData.filterColumn['OpportunityName'], 'name'),
      "OpportunityIds": this.OpportunityServices.pluckParticularKey(data.filterData.filterColumn['OpportunityId'], 'id'),
      "OrderNumbers": this.OpportunityServices.pluckParticularKey(data.filterData.filterColumn['OrderId'], 'id'),
      "TCVValues": this.OpportunityServices.pluckParticularKey(data.filterData.filterColumn['OrderTcv'], 'OverallOrderTCV'),
      // "StartDates": this.OpportunityServices.pluckParticularKey(data.filterData.filterColumn['StartDate'], 'name'),

      // "EndDates": this.OpportunityServices.pluckParticularKey(data.filterData.filterColumn['EndDate'], 'name'),
      // "OrderStages":["7"],
      "AccountIds": this.OpportunityServices.pluckParticularKey(data.filterData.filterColumn['AccountName'], 'id'),
      "PricingTypes": this.OpportunityServices.pluckParticularKey(data.filterData.filterColumn['PricingType'], 'id'),
      "SAPIds": this.OpportunityServices.pluckParticularKey(data.filterData.filterColumn['SAPCustomerCode'], 'id'),
      // "CreatedOnDates": this.OpportunityServices.pluckParticularKey(data.filterData.filterColumn['CreatedOn'], 'name'),

      "StartFromDate": data.filterData.filterColumn.StartDate[0].filterStartDate ? this.convertDateISOtoReadable(data.filterData.filterColumn.StartDate[0].filterStartDate.toLocaleString(), '/') : '',
      "StartToDate": data.filterData.filterColumn.StartDate[0].filterEndDate ? this.convertDateISOtoReadable(data.filterData.filterColumn.StartDate[0].filterEndDate.toLocaleString(), '/') : '',
      "EndFromDate": data.filterData.filterColumn.EndDate[0].filterStartDate ? this.convertDateISOtoReadable(data.filterData.filterColumn.EndDate[0].filterStartDate.toLocaleString(), '/') : '',
      "EndToDate": data.filterData.filterColumn.EndDate[0].filterEndDate ? this.convertDateISOtoReadable(data.filterData.filterColumn.EndDate[0].filterEndDate.toLocaleString(), '/') : '',
      "StartDate": data.filterData.filterColumn.CreatedOn[0].filterStartDate ? this.convertDateISOtoReadable(data.filterData.filterColumn.CreatedOn[0].filterStartDate.toLocaleString(), '/') : '',
      "EndDate": data.filterData.filterColumn.CreatedOn[0].filterEndDate ? this.convertDateISOtoReadable(data.filterData.filterColumn.CreatedOn[0].filterEndDate.toLocaleString(), '/') : '',

      "OwnerIds": this.OpportunityServices.pluckParticularKey(data.filterData.filterColumn['OrderOwner'], 'id'),
      "SortBy": this.OpportunityServices.pluckParticularKey(OrderHeader.filter(x => x.name == data.filterData.sortColumn), 'SortId')[0],
    }
  }

  downloadListMobile(fileInfo) {
    var fileTransfer = new FileTransfer();
    var newUrl = fileInfo.Url.substr(0, fileInfo.Url.indexOf("?"))
    var uri = encodeURI(newUrl);
    var fileURL = "///storage/emulated/0/DCIM/" + fileInfo.Name;
    this.opportunityService.displayMessageerror(`${fileInfo.Name} downloaded`)
    fileTransfer.download(
      uri, fileURL, function (entry) {
        console.log("download complete: " + entry.toURL());
      },
      function (error) {
        console.log("download error source " + error.source);
        console.log("download error target " + error.target);
        console.log("download error code" + error.code);
      },
      null, {
        //     "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
        //  } headers: {
        // 
      }
    );
  }

  downloadList(data): void {
    let reqparam = this.createBodyForDownload({ ...data })

    this.order.downloadOrders(reqparam).subscribe(res => {
      console.log(reqparam)
      if (!res.IsError) {
        this.service.loaderhome = false;
        if (this.envr.envName === 'MOBILEQA') {
          this.downloadListMobile(res.ResponseObject)
        } else {
          this.service.Base64Download(res.ResponseObject);
          // window.open(res.ResponseObject.Url, "_blank");
        }
      } else {
        this.service.loaderhome = false;
        this.opportunityService.displayMessageerror(res.Message);
      }
    }, error => {
      this.service.loaderhome = false;
    })

  }

  openapproveDMNonWT(rowData): void {
    console.log("hiiiii")
    console.log("rowdata", rowData)
    const dialogRef = this.dialog.open(ApprovebfmComponent, {
      width: '350px',
      data: {
        rowData: rowData,
        //  data: this.actionRequired,
        pageStatus: "Aproval ADH order",
        // value:actionRequired
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.flag == 'YES') {
          let obj = {
            "ApprovalComment": result.reason,
            "TCVComparisonComment": "Some text",
            "ApprovalStage": "Approval",
            "SalesOrderId": rowData.OrderId
          }
          this.getORderList(this.paginationPageNo)
        }
      }
    });
  }

  /**
   * Ends : Single table actions
   */


  /****************************************************************************************************
   * @name : Filters for Order landing
   * @description : Implementation of the column filters, sorting and table search 
   * @author : Harin Shah
   */

  public columnFilterDetails = {
    "PageSize": this.paginationPageNo.PageSize,       // page size
    "RequestedPageNumber": 1,  // page number
    "SearchText": "",   // global search text
    "FilterSearchText": "",  // filter search text by column
    "RoleId": this.selectedroleListId,
    "UserGuid": "",  // logged in user id
    "OdatanextLink": "",
    "ViewId": '',
    "IsDesc": true, // Only for apply filter
    "SortBy": 42,   // column identification number
    "OrderNumbers": [],  // selected order numbers
    "OpportunityNames": [],  // selected opportunity names
    "OpportunityIds": [],  // selected opportunity numbers
    "ApprovalTypes": [],  // selected approval type Ids
    "TCVValues": [],  // selected TCV values
    "OrderTypes": [], // selected order type Ids
    "OrderStages": [], // selected order stage Ids
    "AccountIds": [],  // selected Account Ids
    "PricingTypes": [], // selected Pricing Type Ids
    "SAPIds": [],      // selected SAP Ids
    "OwnerIds": [],   // selected order owner Ids
    "StartFromDate": "",  // Selected date from start date column (From Date section)
    "StartToDate": "",    // Selected date from start date column (To Date section)
    "EndFromDate": "",    // Selected date from end date column (From Date section)
    "EndToDate": "",      // Selected date from end date column (To Date section)
    "StartDate": "",      // Selected date from Created on column (From Date section)
    "EndDate": "",        //  Selected date from Created on column (To Date section)
    "StatusValues": [] // selected satge status for the modified orders view ( BFM scenario)   
  };

  public filterColumnKeys = {
    OrderId: { id: 'OrderNumber', name: 'OrderNumber' },
    Type: { id: 'OrderTypeId', name: 'OrderType' },
    OrderTcv: { id: 'OverallOrderTCV', name: 'OverallOrderTCVDisplay' },
    Status: { id: 'ApprovalStageId', name: 'ApprovalStage' },
    AccountName: { id: 'CustomerId', name: 'CustomerIdName' },
    PricingType: { id: 'PricingTypeId', name: 'PricingType' },
    OpportunityName: { id: 'OpportunityId', name: 'OpportunityIdName' },
    OpportunityId: { name: 'OpportunityNumber', id: 'OpportunityNumber' },
    ApprovalType: { id: 'WiproApprovalType', name: 'WiproApprovalTypeDisplay' },
    OrderOwner: { id: 'OrderOwnerId', name: 'OrderOwnerDisplay' },
    SAPCustomerCode: { id: 'SAPCustomerCodeId', name: 'SAPCustomerCode' },
    ModificationRequestStatus: { id: 'ModificationRequestStatusId', name: 'ModificationRequestStatus' }
  };

  public filterApplyRequestHelper = {
    OrderId: { dataKey: 'id', key: 'OrderNumbers' },
    OpportunityName: { dataKey: 'name', key: 'OpportunityNames' },
    OpportunityId: { dataKey: 'id', key: 'OpportunityIds' },
    ApprovalType: { dataKey: 'id', key: 'ApprovalTypes' },
    OrderTcv: { dataKey: 'id', key: 'TCVValues' },
    Type: { dataKey: 'id', key: 'OrderTypes' },
    Status: { dataKey: 'id', key: 'OrderStages' },
    AccountName: { dataKey: 'id', key: 'AccountIds' },
    PricingType: { dataKey: 'id', key: 'PricingTypes' },
    OrderOwner: { dataKey: 'id', key: 'OwnerIds' },
    SAPCustomerCode: { dataKey: 'id', key: 'SAPIds' },
    ModificationRequestStatus: { dataKey: 'id', key: 'StatusValues' }
  };

  resetValues() {
    const requestBody = {
      "PageSize": this.paginationPageNo.PageSize,
      "RequestedPageNumber": 1,
      "SearchText": "",
      "FilterSearchText": "",
      "RoleId": this.selectedroleListId,
      "UserGuid": this.userId,
      "OdatanextLink": "",
      "ViewId": '',
      "IsDesc": true,
      "SortBy": 42,
      "OrderNumbers": [],
      "OpportunityNames": [],
      "OpportunityIds": [],
      "ApprovalTypes": [],
      "TCVValues": [],
      "OrderTypes": [],
      "OrderStages": [],
      "AccountIds": [],
      "PricingTypes": [],
      "SAPIds": [],
      "OwnerIds": [],
      "StartFromDate": "",
      "StartToDate": "",
      "EndFromDate": "",
      "EndToDate": "",
      "StartDate": "",
      "EndDate": "",
      "StatusValues": []
    };
    this.paginationPageNo.RequestedPageNumber = 1;
    this.paginationPageNo.SearchText = '';
    requestBody.RequestedPageNumber = 1;
    this.columnFilterDetails = {
      ...requestBody
    }
    this.filterConfigData = {
      OrderId: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
      Type: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
      OrderTcv: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
      StartDate: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
      EndDate: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
      Status: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
      AccountName: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
      ApprovalType: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
      PricingType: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
      OpportunityName: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
      OpportunityId: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
      SAPCustomerCode: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
      CreatedOn: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
      OrderOwner: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
      isFilterLoading: false,
    };
  }



  clearAllFilters(data) {
    const requestBody = {
      "PageSize": this.paginationPageNo.PageSize,
      "RequestedPageNumber": 1,
      "SearchText": "",
      "FilterSearchText": "",
      "RoleId": this.selectedroleListId,
      "UserGuid": this.userId,
      "OdatanextLink": "",
      "ViewId": '',
      "IsDesc": true,
      "SortBy": 42,
      "OrderNumbers": [],
      "OpportunityNames": [],
      "OpportunityIds": [],
      "ApprovalTypes": [],
      "TCVValues": [],
      "OrderTypes": [],
      "OrderStages": [],
      "AccountIds": [],
      "PricingTypes": [],
      "SAPIds": [],
      "OwnerIds": [],
      "StartFromDate": "",
      "StartToDate": "",
      "EndFromDate": "",
      "EndToDate": "",
      "StartDate": "",
      "EndDate": "",
      "StatusValues": []
    };
    this.resetValues();
    this.paginationPageNo.RequestedPageNumber = 1;
    this.paginationPageNo.SearchText = '';
    requestBody.RequestedPageNumber = 1;
    if (data == 'tabNavigation') {
      this.columnFilterDetails = {
        ...requestBody
      };
      this.getORderList(this.paginationPageNo);
    } else if (data == 'accountLogin' || this.accountLogin) {
      let body = {
        filterData: {
          headerName: 'OrderId',
          isApplyFilter: true,
          sortColumn: ''
        }
      };
      let accountSysId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip');
      requestBody.AccountIds = accountSysId ? [accountSysId] : [];
      this.fetchFilterdDataList(body, '', requestBody);
    } else {
      this.fetchFilterdDataList(data, '', requestBody);
    }

  }

  fetchColumnFilters(data: any) {
    const headerName = data.filterData.headerName;
    if (!data.filterData.isApplyFilter && (headerName == 'StartDate' || headerName == 'EndDate' || headerName == 'CreatedOn')) {
      let fromDateKey = '';
      let toDateKey = '';

      if (headerName == 'StartDate' || headerName == 'EndDate') {
        fromDateKey = headerName == 'StartDate' ? 'StartFromDate' : 'EndFromDate';
        toDateKey = headerName == 'StartDate' ? 'StartToDate' : 'EndToDate';
      } else {
        fromDateKey = 'StartDate';
        toDateKey = 'EndDate';
      }

      const tempObj = {
        filterStartDate: this.columnFilterDetails[fromDateKey] ? this.columnFilterDetails[fromDateKey] : '',
        filterEndDate: this.columnFilterDetails[toDateKey] ? this.columnFilterDetails[toDateKey] : '',
        isDatafiltered: true
      }

      if (tempObj.filterEndDate || tempObj.filterStartDate) {
        this.filterConfigData[headerName].data = [];
        this.filterConfigData[headerName].data.push(tempObj);
      }

      return;
    }


    if (data.filterData) {

      this.filterConfigData[headerName].PageNo = 1;

      if (!data.filterData.isApplyFilter) {
        this.filterConfigData[headerName].data = [];
        this.generateFilterConfigDataValues(data, headerName, false);
      } else {
        if (data.filterData.isApplyFilter && this.service.CheckFilterFlag(data)) {
          const requestBody = {
            ...this.columnFilterDetails
          };
          requestBody.RequestedPageNumber = 1;
          requestBody.ViewId = this.paginationPageNo.ViewId;
          this.fetchFilterdDataList(data, headerName, requestBody)
        } else {
          this.getORderList(this.paginationPageNo);
        }
      }

    }
  }

  generateFilterConfigDataValues(data, headerName, isConcat) {
    // if (isServiceCall) {
    const headerID = columnFilterNumbers[headerName];
    const requestBody = {
      ...this.columnFilterDetails
    };


    if (+headerID == 30 && this.selectedTabId == 'bfmRoleModifiedOrders') {
      requestBody.SortBy = 7;
    } else {
      requestBody.SortBy = +headerID;
    }

    requestBody.RequestedPageNumber = this.filterConfigData[headerName].PageNo;
    requestBody.FilterSearchText = data.filterData.columnSerachKey;


    this.order.fetchColumnFilterList(requestBody).subscribe(res => {
      this.filterConfigData.isFilterLoading = false;
      if (res && !res.IsError && res.ResponseObject) {
        let response = res.ResponseObject.map(filterVal => {
          let id = '';
          let name = '';
          if (this.selectedTabId == 'bfmRoleModifiedOrders') {
            id = this.filterColumnKeys['ModificationRequestStatus'].id;
            name = this.filterColumnKeys['ModificationRequestStatus'].name;
          } else {
            id = this.filterColumnKeys[headerName].id;
            name = this.filterColumnKeys[headerName].name;
            this.columnFilterDetails.StatusValues = [];
          }

          return {
            id: filterVal[id],
            name: filterVal[name],
            isDatafiltered: false
          };
        });

        response.map(responseItem => {
          const existingData: any[] = this.columnFilterDetails[this.filterApplyRequestHelper[headerName].key];
          if (existingData.includes(responseItem[this.filterApplyRequestHelper[headerName].dataKey])) {
            responseItem.isDatafiltered = true;
          }
        })

        this.filterConfigData[headerName] = {
          data: (isConcat) ? this.filterConfigData[headerName]["data"].concat(response) : response,
          recordCount: res.TotalRecordCount,
          PageNo: this.filterConfigData[headerName].PageNo
        }

      } else {
        if (isConcat) {
          this.filterConfigData[headerName].PageNo = this.filterConfigData[headerName].PageNo - 1;
        }
      }
    },
      err => {
        if (isConcat) {
          this.filterConfigData[headerName].PageNo = this.filterConfigData[headerName].PageNo - 1;
        }
      });
    // }
  }

  fetchFilterdDataList(data: any, headerName: string, requestBody: any) {

    if (data.filterData.sortColumn == '') {
      const headerID = columnFilterNumbers['OrderId'];
      requestBody.SortBy = +headerID;
      requestBody.IsDesc = true;
    }


    const body = headerName ? this.setFilterDataByHeader(data, headerName, requestBody) : requestBody;
    requestBody = {
      ...body
    };
    this.service.loaderhome = true;
    this.order.GetOrderForListingPageFilter(body).subscribe(ordersList => {
      this.service.loaderhome = false;
      if (ordersList && !ordersList.IsError && ordersList.ResponseObject) {
        this.columnFilterDetails = {
          ...requestBody
        }
        this.AllOrderTable = this.fetchAllOrdersList(ordersList);
        this.AllOrderTable = this.fetchStatusColors(this.AllOrderTable);

        let assignCount = 0;
        this.AllOrderTable.map(res => {
          if (!res.assignOrderBtnVisibility) {
            assignCount = assignCount + 1;
          }
        })
        if (assignCount == this.AllOrderTable.length) {
          this.checkBoxFlag = true;
        }

        this.tableTotalCount = ordersList.TotalRecordCount;
        this.paginationPageNo = {
          "PageSize": requestBody.PageSize,
          "RequestedPageNumber": requestBody.RequestedPageNumber,
          "SearchText": "",
          "Statuscode": "",
          "UserGuid": this.userId,
          "RoleId": this.selectedroleListId,
          "ViewId": ''
        };
      } else {

      }
    },
      err => {

      })

  }

  fetchStatusColors(ordersList) {
    return ordersList.map((addColumn: any) => {
      console.log
      let newColumn = Object.assign({}, addColumn);
      //For Green
      if (addColumn.StatusId == 1 || addColumn.StatusId == '1' || addColumn.StatusId == 3 || addColumn.StatusId == '3' || addColumn.StatusId == 2 || addColumn.StatusId == '2'
        || addColumn.StatusId == 10 || addColumn.StatusId == '10' || addColumn.StatusId == 13 || addColumn.StatusId == '13'
        || addColumn.StatusId == 184450004 || addColumn.StatusId == '184450004' || addColumn.StatusId == 184450004 || addColumn.StatusId == '184450004') {
        newColumn.statusclass = "approved";
      }
      //blue
      else if (addColumn.StatusId == 12 || addColumn.StatusId == '12' || addColumn.StatusId == 9 || addColumn.StatusId == '9' || addColumn.StatusId == 184450002 || addColumn.StatusId == '184450002'
        || addColumn.StatusId == 184450007 || addColumn.StatusId == '184450007' || addColumn.StatusId == 184450009 || addColumn.StatusId == '184450009'
        || addColumn.StatusId == 184450000 || addColumn.StatusId == '184450000') {
        newColumn.statusclass = "proposed";
      }
      //orange
      else if (addColumn.StatusId == 7 || addColumn.StatusId == '7') {
        newColumn.statusclass = "low";
      }
      //for red
      else if (addColumn.StatusId == 4 || addColumn.StatusId == '4' || addColumn.StatusId == 5 || addColumn.StatusId == '5' || addColumn.StatusId == 6 || addColumn.StatusId == '6'
        || addColumn.StatusId == 14 || addColumn.StatusId == '14' || addColumn.StatusId == 184450003 || addColumn.StatusId == '184450003') {
        newColumn.statusclass = "rejected";
      }
      else {
        newColumn.statusclass = "proposed";
      }

      return newColumn;
    });
  }

  fetchAllOrdersList(orderListing: any): any[] {
    // let startIndex = ((orderListing.CurrentPageNumber - 1) * this.paginationPageNo.PageSize) + 1;
    let startIndex = ((this.columnFilterDetails.RequestedPageNumber - 1) * this.paginationPageNo.PageSize) + 1;
    return orderListing.ResponseObject && orderListing.ResponseObject.length > 0 ? orderListing.ResponseObject.map((orderTable, i) => {
      let shareBtnVisibility = true;
      // Flags for Task reminder btns for BFM
      let remindervisibility = false;
      let blockvisibility = false;
      let reschedulevisibility = false;
      let moreBtnVisibilityTask = false;
      if (this.selectedroleListId == "184450002") {
        if (orderTable.TaskId) {
          remindervisibility = false;
          moreBtnVisibilityTask = true;
          blockvisibility = true;
          reschedulevisibility = true;
        } else {
          remindervisibility = true;
          moreBtnVisibilityTask = false;
          blockvisibility = false;
          reschedulevisibility = false;
        }
      }
      // Ends : Flags for Task reminder btns for BFM

      this.tickedBtnVisibility = true;
      this.rejectBtnVisibility = true;
      if (this.selectedroleListId == "") {
        if ((this.userId == orderTable.OrderOwnerId) || (this.userId == orderTable.AccountOwnerId) || (this.userId == orderTable.VerticalSalesOwnerId)) {
          this.assignOrderBtnVisibility = false;
          shareBtnVisibility = false;
        }
        else {
          this.assignOrderBtnVisibility = true;
          shareBtnVisibility = true;
        }
      } else {
        this.assignOrderBtnVisibility = true;
        shareBtnVisibility = true;
      }
      if (this.selectedroleListId == "184450001") {
        if (orderTable.WiproApprovalType == "184450005" && orderTable.ApprovalStageId == "12") {
          this.rejectBtnVisibility = false;
          this.tickedBtnVisibility = false;
        }
        else if (orderTable.NonWTFlag == false && (orderTable.WiproApprovalType == "184450004" || orderTable.WiproApprovalType == "184450000") && orderTable.ApprovalStageId == "184450000") {
          this.rejectBtnVisibility = false;
          // this.tickedBtnVisibility=false;
        }
        else if (orderTable.NonWTFlag == true && (orderTable.WiproApprovalType == "184450004" || orderTable.WiproApprovalType == "184450000") && orderTable.ApprovalStageId == "184450000") {
          this.rejectBtnVisibility = false;
          this.tickedBtnVisibility = false;
        }
      } else if (this.selectedroleListId == "184450000" && (orderTable.WiproApprovalType == "184450004" || orderTable.WiproApprovalType == "184450000") && orderTable.ApprovalStageId == "184450001") {

        this.rejectBtnVisibility = false;
        this.tickedBtnVisibility = false;
      }

      let statusValue = '';
      let statusIdValue = '';

      if (this.selectedTabId == 'bfmRoleModifiedOrders') {
        statusValue = orderTable.ModificationRequestStatus ? orderTable.ModificationRequestStatus : 'NA';
        statusIdValue = orderTable.ModificationRequestStatusId ? orderTable.ModificationRequestStatusId : 'NA';
      } else {
        statusValue = orderTable.ApprovalStage ? orderTable.ApprovalStage : 'NA';
        statusIdValue = orderTable.ApprovalStageId ? orderTable.ApprovalStageId : 'NA';
      }

      if (this.selectedroleListId == "184450001") {
        if (orderTable.OrderTypeId.toString() == "184450006" && orderTable.ApprovalStageId.toString() == "184450000") {
          this.rejectBtnVisibility = true;
        }
        if (orderTable.ApprovalStageId != OrderApprovalStage.ForeclosureRequestPendingwithDM) {
          if (!orderTable.NonWTFlag) {
            if (orderTable.IsAmendment) {
              this.rejectBtnVisibility = true;
            }
          }
        }

      }

      return Object.assign({
        AccountName: (orderTable.CustomerIdName) ? orderTable.CustomerIdName : 'NA',
        ApprovalType: (orderTable.WiproApprovalTypeDisplay) ? orderTable.WiproApprovalTypeDisplay : 'NA',
        ApprovalTpyeId: (orderTable.WiproApprovalType) ? orderTable.WiproApprovalType : 'NA',
        CreatedOn: (orderTable.CreatedOn) ? orderTable.CreatedOn : 'NA',
        OpportunityId: (orderTable.OpportunityNumber) ? orderTable.OpportunityNumber : 'NA',
        IdOfOpportunity: (orderTable.OpportunityId) ? orderTable.OpportunityId : '',
        EndDate: (orderTable.EndDate) ? orderTable.EndDate : 'NA',
        OpportunityName: (orderTable.OpportunityIdName) ? orderTable.OpportunityIdName : 'NA',
        OrderId: (orderTable.OrderNumber) ? orderTable.OrderNumber : 'NA',
        OrderTcv: this.getSymbol(orderTable.OverallOrderTCVDisplay ? orderTable.OverallOrderTCVDisplay : 'NA'),
        PricingType: (orderTable.PricingType) ? orderTable.PricingType : 'NA',
        PricingId: orderTable.PricingId ? orderTable.PricingId : '',
        SAPCustomerCode: (orderTable.SAPCustomerCode) ? orderTable.SAPCustomerCode : 'NA',
        StartDate: (orderTable.StartDate) ? orderTable.StartDate : 'NA',
        Status: statusValue,
        StatusId: statusIdValue,
        Type: (orderTable.OrderType) ? orderTable.OrderType : 'NA',
        id: (orderTable.OrderTypeId) ? orderTable.OrderTypeId : 'NA',
        OrderOwner: (orderTable.OrderOwnerDisplay) ? orderTable.OrderOwnerDisplay : 'NA',
        IsAmendment: (orderTable.IsAmendment) ? JSON.parse(orderTable.IsAmendment) : false,
        SalesOrderId: orderTable.SalesOrderId ? orderTable.SalesOrderId : '',
        OrderName: orderTable.OrderName ? orderTable.OrderName : '',
        index: startIndex + i,
        moreBtnVisibility: !moreBtnVisibilityTask,
        tickedBtnVisibility: this.tickedBtnVisibility,
        remindervisibility: remindervisibility,
        blockvisibility: blockvisibility,
        reschedulevisibility: reschedulevisibility,
        rejectBtnVisibility: this.rejectBtnVisibility,
        assignOrderBtnVisibility: !this.helpLineRoleFlag ? this.helpLineRoleFlag : this.assignOrderBtnVisibility,
        shareBtnVisibility: !this.helpLineRoleFlag ? this.helpLineRoleFlag : shareBtnVisibility,
        statusclass: "approvalstatus",
        isSigned: (orderTable.IsContractSigned) ? orderTable.IsContractSigned : false,
        orderBookingId: (orderTable.SalesOrderId) ? orderTable.SalesOrderId : 'NA',
        nonWTFlag: (orderTable.NonWTFlag) ? orderTable.NonWTFlag : false,
        CommundaProcessId: (orderTable.CamundaProcessId) ? orderTable.CamundaProcessId : 'NA',
        ownerId: this.userId ? this.userId : 'NA',
        BFMOnholdCount: (orderTable.BFMOnHoldCount) ? orderTable.BFMOnHoldCount : "NA",
        approvalStageId: (orderTable.ApprovalStageId) ? orderTable.ApprovalStageId : "NA",
        approvalStage: (orderTable.ApprovalStage) ? orderTable.ApprovalStage : "NA",
        TaskId: orderTable.TaskId ? orderTable.TaskId : '',
        TaskCamundaProcessId: orderTable.TaskCamundaProcessId ? orderTable.TaskCamundaProcessId : '',
        AccountID: orderTable.CustomerId,
        isTaskLoading: false,
        ParentOpportunityId: orderTable.ParentOpportunityId ? orderTable.ParentOpportunityId : ''
      })
    }) : [{}];
  }

  setFilterDataByHeader(data: any, headerName: any, requestBody: any) {
    const temp = data.filterData.filterColumn[headerName];
    if (headerName == 'StartDate' || headerName == 'EndDate' || headerName == 'CreatedOn') {
      let fromDateKey = '';
      let toDateKey = '';

      if (headerName == 'StartDate' || headerName == 'EndDate') {
        fromDateKey = headerName == 'StartDate' ? 'StartFromDate' : 'EndFromDate';
        toDateKey = headerName == 'StartDate' ? 'StartToDate' : 'EndToDate';
      } else {
        fromDateKey = 'StartDate';
        toDateKey = 'EndDate';
      }

      requestBody[fromDateKey] = temp[0].filterStartDate ? this.convertDateISOtoReadable(temp[0].filterStartDate.toLocaleString(), '/') : '';
      requestBody[toDateKey] = temp[0].filterEndDate ? this.convertDateISOtoReadable(temp[0].filterEndDate.toLocaleString(), '/') : '';

      return requestBody;
    }

    let requestKey;
    const dataKey = this.filterApplyRequestHelper[headerName].dataKey;;

    if (this.selectedTabId == 'bfmRoleModifiedOrders') {
      requestKey = this.filterApplyRequestHelper['ModificationRequestStatus'].key;
    } else {
      requestKey = this.filterApplyRequestHelper[headerName].key;
    }


    requestBody[requestKey] = [];
    requestBody[requestKey] = temp.map(res => {
      return res[dataKey];
    });


    return requestBody;
  }

  columnSearchAndLoadMore(data: any, action: string) {
    let headerName = data.filterData.headerName;
    const isConcat = action == 'loadMoreFilterData' ? true : false;
    if (action == 'loadMoreFilterData') {
      this.filterConfigData[headerName].PageNo = this.filterConfigData[headerName].PageNo + 1
    } else {
      this.filterConfigData[headerName].PageNo = 1
    }
    this.generateFilterConfigDataValues(data, headerName, isConcat)
  }

  getNewTableDataValues(event) {
    let body = {
      ...this.columnFilterDetails
    };
    this.paginationPageNo.PageSize = event.itemsPerPage;
    this.paginationPageNo.RequestedPageNumber = event.currentPage;
    body.RequestedPageNumber = this.paginationPageNo.RequestedPageNumber;
    body.PageSize = this.paginationPageNo.PageSize

    this.fetchFilterdDataList(event, '', body);

  }



  /***************************************************************************************************
   * Ends : Filters for Order landing
   */

  /****************************************************************************************************
   * @name : Task Reminder
   * @description : The BFM can create mail reminders for a particular order for himself
   * @author : Harin Shah
   */
  cancelTaskReminder(childActionRecieved: any) {
    let body = {
      processinstanceid: childActionRecieved.objectRowData[0].TaskCamundaProcessId,
      orderID: childActionRecieved.objectRowData[0].orderBookingId
    };

    this.order.cancelTaskReminder(body).subscribe(response => {
      this.opportunityService.displayMessageerror('Reminder cancelled successfully');
      this.paginationPageNo.RoleId = this.selectedroleListId;
      this.columnFilterDetails.RoleId = this.selectedroleListId;
      this.paginationPageNo.PageSize = childActionRecieved.pageData.itemsPerPage;
      this.paginationPageNo.RequestedPageNumber = childActionRecieved.pageData.currentPage;
      this.getORderList(this.paginationPageNo);
    },
      err => {
        this.opportunityService.displayMessageerror('Oops!!! An error occured. Please try again later');
      })
  }

  fetchTaskRescheduleDetails(childActionRecieved) {
    let body = {
      Id: childActionRecieved.objectRowData[0].TaskId
    };
    this.service.loaderhome = true;
    this.order.getTaskDetailsForReschedule(body).subscribe(response => {
      this.service.loaderhome = false;
      if (response && !response.IsError && response.ResponseObject) {
        const dialogRef = this.dialog.open(ReschedulePopup, {
          width: '400px',
          data: {
            taskDetails: response,
            action: childActionRecieved
          }
        });

        dialogRef.afterClosed().subscribe(rescheduledTask => {
          if (rescheduledTask) {
            this.rescheduleTaskAPI(childActionRecieved, rescheduledTask);
          }
        });

      } else {
        this.opportunityService.displayMessageerror('Oops!!! An error occured. Please try again later');
      }

    },
      err => {
        this.service.loaderhome = false;
        this.opportunityService.displayMessageerror('Oops!!! An error occured. Please try again later');
      })

  }

  rescheduleTaskAPI(childActionRecieved: any, rescheduledTask: any) {
    let requestBody = {
      orderID: rescheduledTask.orderId,
      scheduledend: rescheduledTask.scheduledend,
      processinstanceid: childActionRecieved.objectRowData[0].TaskCamundaProcessId
    };
    this.order.rescheduleTaskReminder(requestBody).subscribe(reschedule => {
      this.opportunityService.displayMessageerror('Task rescheduled successfully');
      this.paginationPageNo.RoleId = this.selectedroleListId;
      this.columnFilterDetails.RoleId = this.selectedroleListId;
      this.paginationPageNo.PageSize = childActionRecieved.pageData.itemsPerPage;
      this.paginationPageNo.RequestedPageNumber = childActionRecieved.pageData.currentPage;
      this.getORderList(this.paginationPageNo);
    },
      err => {
        this.opportunityService.displayMessageerror('Oops!!! An error occured. Please try again later');
      });
  }

  fetchTaskDetails(childActionRecieved: any) {

    const task = childActionRecieved.objectRowData[0].taskDetails;
    if (task && task.ActionableDate) {
      return;
    }
    childActionRecieved.objectRowData[0].isTaskLoading = true;
    let body = {
      Id: childActionRecieved.objectRowData[0].TaskId
    };
    const temp = this.AllOrderTable.map(res => {
      if (res) {
        if (childActionRecieved.objectRowData[0].TaskId == res.TaskId) {
          res.isTaskLoading = true;
          res.isExpanded = true;
        }
        return Object.assign(res);
      }
    });
    this.AllOrderTable = temp;
    this.order.getTaskDetails(body).subscribe(res => {
      if (res && !res.IsError && res.ResponseObject) {
        this.setTaskDetails(res, childActionRecieved);
      } else {
        const temp = this.AllOrderTable.map(res => {
          if (res) {
            if (childActionRecieved.objectRowData[0].TaskId == res.TaskId) {
              res.isTaskLoading = false;
              res.isExpanded = false;
            }
            return Object.assign(res);
          }

        });
        this.AllOrderTable = temp;
        this.opportunityService.displayMessageerror('Oops!!! An error occured. Please try again later');
      }
    },
      err => {
        const temp = this.AllOrderTable.map(res => {
          if (res) {
            if (childActionRecieved.objectRowData[0].TaskId == res.TaskId) {
              res.isTaskLoading = false;
              res.isExpanded = false;
            }
            return Object.assign(res);
          }

        });
        this.AllOrderTable = temp;
        this.opportunityService.displayMessageerror('Oops!!! An error occured. Please try again later');
      })


  }

  setTaskDetails(taskDetails: any, childActionRecieved: any) {
    const temp = this.AllOrderTable.map(res => {
      if (res) {
        if (childActionRecieved.objectRowData[0].TaskId == res.TaskId) {
          res['taskDetails'] = {
            ...taskDetails.ResponseObject
          }
          res.isTaskLoading = false;
          res.isExpanded = true;
        }
        return Object.assign(res);
      }

    });
    this.AllOrderTable = temp;
  }

  setTaskReminder(childActionRecieved: any) {
    const dialogRef = this.dialog.open(ReminderPopup, {
      width: '400px',
      data: childActionRecieved
    });

    dialogRef.afterClosed().subscribe(reminderDetails => {
      if (reminderDetails) {
        console.log(reminderDetails);
        this.order.setTaskReminder(reminderDetails).subscribe(response => {
          this.opportunityService.displayMessageerror('Task created successfully');
          this.paginationPageNo.RoleId = this.selectedroleListId;
          this.columnFilterDetails.RoleId = this.selectedroleListId;
          this.paginationPageNo.PageSize = childActionRecieved.pageData.itemsPerPage;
          this.paginationPageNo.RequestedPageNumber = childActionRecieved.pageData.currentPage;
          this.getORderList(this.paginationPageNo);
        },
          err => {
            this.opportunityService.displayMessageerror('Oops!!! An error occured while creating your task. Please try again.')
          });
      }
    })
  }

  /**
   * Ends : Task Reminder
   */
  private convertDateISOtoReadable(date: string, seperator: string) {
    const tempDate = new Date(date);
    return `${tempDate.getFullYear()}${seperator}${tempDate.getMonth() + 1}${seperator}${tempDate.getDate()}`;

  }

  retagTracepopup() {

    const dialogRef = this.dialog.open(retagTracePopup, {
      width: '620px',
    });

  }

  // approverAssignpopup() {

  //   const dialogRef = this.dialog.open(ApproverAssignmentPopup, {
  //     width: '620px',
  //   });
  // }


}

@Component({
  selector: 'retag-trace-popup',
  templateUrl: './retag-trace-popup.html',
  styleUrls: ['./order-landing.component.scss']
})
export class retagTracePopup {

  OrderNumber = '';
  previouValue = '';
  newValue = '';

  constructor(public service: DataCommunicationService, private order: OrderService, private opportunityService: OpportunitiesService) { }

  getTrackOrderOnOrderNumber(OrderNumber) {
    let data = {
      PrimaryOrderNumber: OrderNumber
    }
    this.service.loaderhome = true;
    this.order.getTrackOrderDeatils(data).subscribe((data: any) => {
      if (!data.IsError) {
        if (data && data.ResponseObject && data.ResponseObject.NewOrderNumber) {
          this.previouValue = data.ResponseObject.OldOrderNumber ? data.ResponseObject.OldOrderNumber : '';
          this.newValue = data.ResponseObject.NewOrderNumber ? data.ResponseObject.NewOrderNumber : '';
          console.log("OrderNumber", this.OrderNumber);
          console.log("previouValue", this.previouValue);
          console.log("newValue", this.newValue);

        } else {
          this.previouValue = '';
          this.newValue = '';
          this.opportunityService.displayMessageerror("There is no retag history for the searched order");
        }
      } else {
        var message = data.Message;
        this.opportunityService.displayMessageerror(message);
      }
      this.service.loaderhome = false;
    }, err => {
      this.opportunityService.displayerror(err.status);
    })
  }

}



@Component({
  selector: 'reminderpopup-pop',
  templateUrl: './reminder-popup.html',
  styleUrls: ['./order-landing.component.scss']

})
export class ReminderPopup implements OnInit {

  comment: string;
  actionowner: string;
  actionownerSwitch: boolean = true;
  today = new Date();
  constructor(
    public DataCommunicationService: DataCommunicationService,
    private EncrDecr: EncrDecrService,
    public dialog: MatDialog,
    public projectService: OpportunitiesService,
    private order: OrderService,
    private allopportunities: OpportunitiesService,
    public dialogRef: MatDialogRef<ReminderPopup>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    console.log(data);
  }

  ngOnInit(): void {

    this.today = new Date();
    // seconds * minutes * hours * milliseconds = 1 day 
    var day = 60 * 60 * 24 * 1000;

    this.today = new Date(this.today.getTime() + day);

  }

  actionOwnerClose() {
    this.actionownerSwitch = false;
  }

  appendActionOwner(value: string, i) {
    this.actionowner = value;
    this.selectedactionowner.push(this.actionContact[i])
  }

  actionContact: {}[] = [
    { index: 0, contact: 'Jac Liu', initials: 'JL', value: true, designation: 'Delivery manager' },
    { index: 1, contact: 'Kanika Tuteja', initials: 'KT', value: false, designation: 'Delivery manager' },
    { index: 2, contact: 'Rita Ora', initials: 'RO', value: false, designation: 'Delivery manager' },
    { index: 3, contact: 'Bill Smith', initials: 'BS', value: false, designation: 'Delivery manager' },
  ]

  selectedactionowner: {}[] = [];

  searchOwnerData = [];
  selectedOwnerArray = [];
  selectedOwnerObj: any = { ownerId: "", Name: "" };
  ownerId: string = "";
  ownerName: string = "";
  header = { name: "Name", Id: "ownerId" };

  isSearchLoader = false;
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

  searchOwnerContent(data) {
    debugger;
    this.isSearchLoader = true;
    let body =
      {
        "SearchText": data.searchValue ? data.searchValue : '',
        "SearchType": 6,
        "PageSize": 10,
        "RequestedPageNumber": 1,
        "OdatanextLink": this.lookupdata.nextLink

      }

    this.allopportunities.getAssignSearchData(body).subscribe(response => {
      if (!response.IsError) {

        if (response.ResponseObject && (Array.isArray(response.ResponseObject) ? response.ResponseObject.length > 0 : false)) {
          this.searchOwnerData = response.ResponseObject;
          for (let j = 0; j < this.searchOwnerData.length; j++) {
            this.searchOwnerData[j].Name = this.searchOwnerData[j].FullName ? this.searchOwnerData[j].FullName : '';
          }
          this.lookupdata.TotalRecordCount = response.TotalRecordCount

          this.lookupdata.nextLink = response.OdatanextLink
          this.searchOwnerData = response.ResponseObject.filter((it) => it.ownerId !=
            this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'))
          // if(data.labelName =='ownerArrayy'){
          //  this.openadvancetabs('assign',this.searchOwnerData,data.inputVal)
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
    console.log(lookUpData);
    let labelName = lookUpData.labelName;
    switch (labelName) {
      case 'ownerArrayy': {
        this.openadvancetabs('assign', this.searchOwnerData, lookUpData.inputVal)
        return;
      }
    }
  }

  selectedLookupData(controlName) {
    switch (controlName) {
      case 'assign': {
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
      debugger
      console.log(x)
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
      debugger
      if (result) {
        console.log(result)
        this.AppendParticularInputFun(result.selectedData, result.controlName)
      }
    });
  }

  AppendParticularInputFun(selectedData, controlName) {
    debugger
    if (selectedData) {
      if (selectedData.length > 0) {
        this.ownerName = '';
        this.ownerId = '';
        this.selectedOwnerObj = { ownerId: "", Name: "" };
        // this.selectedOwnerArray = []
        if (this.selectedOwnerArray.filter(res => selectedData[0].ownerId == res.ownerId).length == 0) {
          const initials = selectedData[0].Name.split(" ");
          selectedData[0].initials = initials.length === 1 ? initials[0].charAt(0) : initials[0].charAt(0) + initials[1].charAt(0);
          this.selectedOwnerArray.push(selectedData[0]);
        } else {
          this.allopportunities.displayMessageerror("This action owner is already selected.");
        }

        // this.selectedOwnerArray[0].Id = this.selectedOwnerObj.ownerId;
      }
    }
  }

  selectedOwner(SelectedAssign: any) {
    this.ownerName = '';
    this.ownerId = '';
    this.selectedOwnerObj = { ownerId: "", Name: "" };
    // this.selectedOwnerArray = []
    if (this.selectedOwnerArray.filter(res => SelectedAssign.ownerId == res.ownerId).length == 0) {

      const initials = SelectedAssign.Name.split(" ");
      SelectedAssign.initials = initials.length === 1 ? initials[0].charAt(0) : initials[0].charAt(0) + initials[1].charAt(0);
      this.selectedOwnerArray.push(SelectedAssign);

    } else {
      this.allopportunities.displayMessageerror("This action owner is already selected.");
    }
    // this.selectedOwnerArray[0].Id = this.selectedOwnerObj.ownerId;
  }
  deleteActionOwner(index) {
    this.selectedOwnerArray.splice(index, 1);
  }

  taskDate;
  getIsoDateFormat(date) {
    const getDate = new Date(date);
    const setDate = new Date(getDate.getTime() + Math.abs(getDate.getTimezoneOffset() * 120000));
    return setDate.toISOString();
  }

  setReminder() {
    if (!this.taskDate || this.selectedOwnerArray.length == 0) {
      this.projectService.displayMessageerror('Please enter the mandatory fields');
      return;
    }
    const dateVal = this.getIsoDateFormat(this.taskDate);
    const body = {
      "scheduledend": dateVal,
      "description": this.comment,
      "orderId": this.data.objectRowData[0].orderBookingId,
      "ownerId": this.data.objectRowData[0].ownerId,
      "bfmList": this.selectedOwnerArray.map(res => {
        return {
          bfmId: res.ownerId
        }
      })
    }
    this.dialogRef.close(body);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'reschedulepopup-pop',
  templateUrl: './reschedule-popup.html',
  styleUrls: ['./order-landing.component.scss']

})
export class ReschedulePopup implements OnInit {
  constructor(public projectService: OpportunitiesService, public dialogRef: MatDialogRef<ReschedulePopup>, @Inject(MAT_DIALOG_DATA) public data) {

  }
  today: Date = new Date();
  comment: string;
  dateVal: string;
  actionOwnersList: { initials: string, name: string, id: string, email: string }[];

  ngOnInit() {

    this.today = new Date();
    // seconds * minutes * hours * milliseconds = 1 day 
    var day = 60 * 60 * 24 * 1000;

    this.today = new Date(this.today.getTime() + day);

    const temp = this.data.taskDetails.ResponseObject;
    this.actionOwnersList = temp.map(res => {
      if (!this.dateVal) {
        this.dateVal = res.ActionableDate;
      }
      if (!this.comment) {
        this.comment = res.ReminderComments;
      }
      const initialsTemp = res.ActionOwners.split(" ");
      return {
        initials: initialsTemp.length === 1 ? initialsTemp[0].charAt(0) : initialsTemp[0].charAt(0) + initialsTemp[1].charAt(0),
        name: res.ActionOwners,
        id: res.ActionOwnerId,
        email: res.ActionOwnerEmailAddress
      }
    })
  }

  rescheduleTask() {
    if (!this.dateVal || this.actionOwnersList.length == 0) {
      this.projectService.displayMessageerror('Please enter the mandatory fields');
      return;
    }
    const body = {
      "scheduledend": new Date(this.dateVal).toISOString(),
      "description": this.comment,
      "orderId": this.data.action.objectRowData[0].orderBookingId,
      "ownerId": this.data.action.objectRowData[0].ownerId,
      "bfmList": this.actionOwnersList.map(res => {
        return {
          bfmId: res.id
        }
      })
    }
    this.dialogRef.close(body);
  }



  onNoClick(): void {
    this.dialogRef.close();
  }

}


@Component({
  selector: 'approver-assignment-popup',
  templateUrl: './approver-assignment-pop.html',
  styleUrls: ['./order-landing.component.scss']
})
export class ApproverAssignmentPopup {
  resultsAll: any;
  sbuDetails: SBUDetail[] = [
    { value: 'sbu1', viewValue: 'SBU 1' },
    { value: 'sbu2', viewValue: 'SBU 2' },
    { value: 'sbu3', viewValue: 'SBU 3' }
  ];
  constructor() {
    this.resultsAll = [{
      fullname: "Shantanu Singh",
      emailId: "shantanu.singh@wipro.com"
    }, {
      fullname: "Shantanu Singh",
      emailId: "shantanu.singh@wipro.com"
    }, {
      fullname: "Shantanu Singh",
      emailId: "shantanu.singh@wipro.com"
    }, {
      fullname: "Shantanu Singh",
      emailId: "shantanu.singh@wipro.com"
    }, {
      fullname: "Shantanu Singh",
      emailId: "shantanu.singh@wipro.com"
    }, {
      fullname: "Shantanu Singh",
      emailId: "shantanu.singh@wipro.com"
    }, {
      fullname: "Shantanu Singh",
      emailId: "shantanu.singh@wipro.com"
    }, {
      fullname: "Shantanu Singh",
      emailId: "shantanu.singh@wipro.com"
    }, {
      fullname: "Shantanu Singh",
      emailId: "shantanu.singh@wipro.com"
    }, {
      fullname: "Shantanu Singh",
      emailId: "shantanu.singh@wipro.com"
    }, {
      fullname: "Shantanu Singh",
      emailId: "shantanu.singh@wipro.com"
    }, {
      fullname: "Shantanu Singh",
      emailId: "shantanu.singh@wipro.com"
    }]
  }

}