import { Component, OnInit, Inject } from '@angular/core';
import { DataCommunicationService } from '@app/core/services/global.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OrderService } from '@app/core/services/order.service';
import { OpportunitiesService } from '@app/core/services/opportunities.service';
import { Router } from '@angular/router';
import { columnFilterNumbers, orderTypeId } from '../opportunity-view/tabs/order/orderenum';





@Component({
  selector: 'app-retag-order',
  templateUrl: './retag-order.component.html',
  styleUrls: ['./retag-order.component.scss']
})
export class RetagOrderComponent implements OnInit {
  diplayOrderOrAmendment: string;


  public orderId: string;
  public orderTypeForRetag: string;
  public ordersListForListingPage: any[] = [];
  public selectedOrder;
  public changeType = true;
  public verifyDetails = false;
  public twoactive: boolean;
  public parentOrderDetails = {
    OrderBookingId: '',
    StartDate: '',
    PricingTypeId: '',
    Currency: {
      SysGuid: ''
    },
    Country: {
      SysGuid: ''
    },
    Account: {
      SysGuid: ''
    },
    SapCode: {
      SysGuid: ''
    },
    OrderTypeId: ''
  };
  public columnFilterDetails = {
    SearchOrder: {
      SearchText: '',
      FilterSearchText: '',
      page: 1,
      count: 20,
      SortBy: 0,
      IsDesc: false,
      StartFromDate: '',
      StartToDate: '',
      EndFromDate: '',
      EndToDate: '',
      OpportunityNumbers: [],
      OrderNumbers: [],
      OwnerIds: [],
      PricingTypes: [],
      Sources: [],
      ProjectCodes: [],
      SAPCustomerCodes: []
    }
  };
  public primaryOrderDetailsReview = {
    primaryOppName: '',
    primaryOppNumber: '',
    primaryOppId: '',
    primaryOrder: '',
    OrderType: ''
  };

  public listingPagination = {

  };

  public filterConfigData = {
    OrderId: { data: [], recordCount: 0, PageNo: 1 },
    OpportunityId: { data: [], recordCount: 0, PageNo: 1 },
    OrderOwner: { data: [], recordCount: 0, PageNo: 1 },
    ProjectCode: { data: [], recordCount: 0, PageNo: 1 },
    StartDate: { data: [], recordCount: 0, PageNo: 1 },
    EndDate: { data: [], recordCount: 0, PageNo: 1 },
    PricingId: { data: [], recordCount: 0, PageNo: 1 },
    SAPCustomerCodes: { data: [], recordCount: 0, PageNo: 1 },
    isFilterLoading: false,
  };

  public filterColumnKeys = {
    OrderId: { id: 'OrderNumber', name: 'OrderNumber' },
    OpportunityId: { name: 'OpportunityNumber', id: 'OpportunityId' },
    OrderOwner: { id: 'OrderOwner', name: 'OrderOwner' },
    ProjectCode: { id: 'ProjectName', name: 'ProjectName' },
    SAPCustomerCodes: { id: 'SapCode', name: 'SapCode' },
    PricingId: { id: 'PricingId', name: 'PricingId' }
  };

  public filterApplyRequestHelper = {
    OrderId: { dataKey: 'name', key: 'OrderNumbers' },
    OpportunityId: { dataKey: 'name', key: 'OpportunityNumbers' },
    OrderOwner: { dataKey: 'name', key: 'OwnerIds' },
    ProjectCode: { dataKey: 'name', key: 'ProjectCodes' },
    SAPCustomerCodes: { dataKey: 'name', key: 'SAPCustomerCodes' },
    PricingId: { dataKey: 'id', key: 'Sources' }
  };

  public paginationPageNo = {
    PageSize: 20,
    RequestedPageNumber: 1,
    searchText: ''
  }
  public totalPageCount: number;
  public orderTypeId: { Incremental: number; Renewal: number; } = {
    Incremental: orderTypeId.Incremental,
    Renewal: orderTypeId.Renewal
  }

  /************** Functions start here *********************************/


  constructor(
    public service: DataCommunicationService,
    public dialog: MatDialog,
    public orderService: OrderService,
    public projectService: OpportunitiesService,
    private router: Router
  ) { }


  ngOnInit() {
    this.orderId = this.projectService.getSession("orderId") ? this.projectService.getSession("orderId") : '';
    if (this.orderId) {
      this.fetchOrderDetails();
    } else {

    }


  }

  // Initial load


  private fetchOrderDetails() {
    const body = {
      Guid: this.orderId
    }
    this.orderService.getSalesOrderDetails(body).subscribe(orderDetails => {
      if (orderDetails && !orderDetails.IsError && orderDetails.ResponseObject) {
        this.setParentOrderDetails(orderDetails);
        if (this.parentOrderDetails.OrderBookingId) {
          this.fetchOrders();
        } else {

        }

      }


    }, err => {

    });
  }



  private fetchOrders() {
    let body = {
      "SearchOrder": {
        "SearchText": this.paginationPageNo.searchText,
        "page": this.paginationPageNo.RequestedPageNumber,
        "count": this.paginationPageNo.PageSize
      },
      ...this.parentOrderDetails
      // ...dummyOrderBody
    };

    this.orderService.fetchOrdersListForRetag(body).subscribe(ordersList => {
      if (ordersList && !ordersList.IsError && ordersList.ResponseObject) {
        this.ordersListForListingPage = this.fetchAllOrdersList(ordersList);
        this.totalPageCount = ordersList.TotalRecordCount;
      }
    }, err => {

    });
  }

  private fetchAllOrdersList(orderListing: any): any[] {
     let startIndex = ((this.paginationPageNo.RequestedPageNumber - 1) * this.paginationPageNo.PageSize) + 1;
    return orderListing.ResponseObject && orderListing.ResponseObject.length > 0 ? orderListing.ResponseObject.map((orderTable, i) => {
      return Object.assign({

        OrderId: orderTable.OrderNumber ? orderTable.OrderNumber : 'NA',
        OrderGuid: orderTable.OrderId ? orderTable.OrderId : 'NA',

        OpportunityId: orderTable.OpportunityNumber ? orderTable.OpportunityNumber : 'NA',
        IdOfOpportunity: orderTable.OpportunityId ? orderTable.OpportunityId : 'NA',

        StartDate: orderTable.EngamentStartDate ? orderTable.EngamentStartDate : 'NA',
        EndDate: orderTable.EngagementEndDate ? orderTable.EngagementEndDate : 'NA',
        OrderOwner: orderTable.OrderOwner ? orderTable.OrderOwner : 'NA',

        PricingType: orderTable.PricingType ? orderTable.PricingType : 'NA',
        PricingTypeId: orderTable.PricingTypeId ? orderTable.PricingTypeId : 'NA',

        SAPCustomerCode: orderTable.SapName ? orderTable.SapName : 'NA',
        SAPCustomerCodeID: orderTable.SapId ? orderTable.SapId : 'NA',

        ProjectCode: orderTable.ProjectName ? orderTable.ProjectName : 'NA',

        PricingId: orderTable.PricingId ? orderTable.PricingId : 'NA',

        SAPCustomerCodes: orderTable.SapCode ? orderTable.SapCode : 'NA',

          index: startIndex + i,
      })
    }) : [{}];
  }


  private setParentOrderDetails(orderDetails: any) {

    this.parentOrderDetails.OrderBookingId = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderBookingId) ? orderDetails.ResponseObject.OrderBookingId : '';
    this.primaryOrderDetailsReview.primaryOrder = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderNumber) ? orderDetails.ResponseObject.OrderNumber : '';
    this.primaryOrderDetailsReview.OrderType = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderType) ? orderDetails.ResponseObject.OrderType : '';
    this.parentOrderDetails.PricingTypeId = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.PricingTypeId) ? orderDetails.ResponseObject.PricingTypeId : '';
    this.parentOrderDetails.StartDate = (orderDetails && orderDetails.ResponseObject && this.convertDateISOtoReadable(orderDetails.ResponseObject.StartDate, '-')) ? this.convertDateISOtoReadable(orderDetails.ResponseObject.StartDate, '-') : '';
    this.parentOrderDetails.Currency.SysGuid = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.Currency.SysGuid) ? orderDetails.ResponseObject.Currency.SysGuid : '';
    this.parentOrderDetails.Country.SysGuid = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.Country.SysGuid) ? orderDetails.ResponseObject.Country.SysGuid : '';
    this.parentOrderDetails.Account.SysGuid = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.Account.SysGuid) ? orderDetails.ResponseObject.Account.SysGuid : '';
    this.parentOrderDetails.SapCode.SysGuid = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.SapCode.SysGuid) ? orderDetails.ResponseObject.SapCode.SysGuid : '';
    this.parentOrderDetails.OrderTypeId = (orderDetails && orderDetails.ResponseObject && orderDetails.ResponseObject.OrderTypeId) ? orderDetails.ResponseObject.OrderTypeId : '';
    if (this.orderTypeId.Incremental.toString() == this.parentOrderDetails.OrderTypeId) {
      this.orderTypeForRetag = 'Incremental';
    } else if (this.orderTypeId.Renewal.toString() == this.parentOrderDetails.OrderTypeId) {
      this.orderTypeForRetag = 'Renewal';
    }
    let oppGuid = orderDetails.ResponseObject.OpportunityId ? orderDetails.ResponseObject.OpportunityId : '';

    this.diplayOrderOrAmendment = 'Order';
    if ((orderDetails.ResponseObject.ParentOpportunityId && !orderDetails.ResponseObject.OpportunityId) || (orderDetails.ResponseObject.OrderTypeId == '184450000' || orderDetails.ResponseObject.OrderTypeId == '184450001')) {
      this.diplayOrderOrAmendment = 'Amendment'
    }

    if (oppGuid) {
      const payload = {
        OppId: this.projectService.getSession("opportunityId"),

      };
      this.orderService.getoppOverviewdetails(payload).subscribe((oppData: any) => {
        if (!oppData.IsError) {
          this.primaryOrderDetailsReview.primaryOppName = (oppData && oppData.ResponseObject && oppData.ResponseObject.name) ? oppData.ResponseObject.name : '';;
          this.primaryOrderDetailsReview.primaryOppNumber = (oppData && oppData.ResponseObject && oppData.ResponseObject.OpportunityNumber) ? oppData.ResponseObject.OpportunityNumber : '';;
          this.primaryOrderDetailsReview.primaryOppId = (oppData && oppData.ResponseObject && oppData.ResponseObject.OpportunityId) ? oppData.ResponseObject.OpportunityId : '';
        }
      })
    } else {
      this.primaryOrderDetailsReview.primaryOppName = 'NA';
      this.primaryOrderDetailsReview.primaryOppNumber = 'NA';
      this.primaryOrderDetailsReview.primaryOppId = 'NA';
    }


  }


  // Filters

  public performTableChildAction(actionDetails) {
    switch (actionDetails.action) {
      case 'ClearAllFilter':
        this.clearAllFilters(actionDetails)
        return;
      case "OrderId":
        if (actionDetails.objectRowData && actionDetails.objectRowData.length > 0) {
          this.selectedOrder = actionDetails.objectRowData[0];
        }
        return;

      case "columnFilter":
        this.fetchColumnFilters(actionDetails);
        return;
      case 'search':
        this.paginationPageNo.searchText = actionDetails.filterData.globalSearch ? actionDetails.filterData.globalSearch : '';
        this.paginationPageNo.RequestedPageNumber = 1;
        this.fetchFilterdDataList(actionDetails, '');
        return;

      case "columnSearchFilter":
      case 'loadMoreFilterData':
        this.columnSearchAndLoadMore(actionDetails, actionDetails.action)
        return;
      case 'sortHeaderBy': {
        console.log(actionDetails);
        this.columnFilterDetails.SearchOrder.IsDesc = !actionDetails.filterData.sortOrder;
        this.columnFilterDetails.SearchOrder.SortBy = +(columnFilterNumbers[actionDetails.filterData.sortColumn]);
        this.fetchFilterdDataList(actionDetails, '');
        // this.AllContactsRequestbody.OdatanextLink = ''
        // this.AllContactsRequestbody.RequestedPageNumber = 1
        // this.CallListDataWithFilters(childActionRecieved);
        return;
      }

      default:
        break;
    }
  }

  clearAllFilters(data) {
    this.columnFilterDetails = {
    SearchOrder: {
      SearchText: '',
      FilterSearchText: '',
      page: 1,
      count: 20,
      SortBy: 0,
      IsDesc: false,
      StartFromDate: '',
      StartToDate: '',
      EndFromDate: '',
      EndToDate: '',
      OpportunityNumbers: [],
      OrderNumbers: [],
      OwnerIds: [],
      PricingTypes: [],
      Sources: [],
      ProjectCodes: [],
      SAPCustomerCodes: []
    }
  };
    this.paginationPageNo.RequestedPageNumber = 1;
    this.paginationPageNo.searchText = '';
      this.fetchFilterdDataList(data, '');

  }

  getNewTableData(event) {
    if (event.action == 'pagination') {
      this.paginationPageNo.PageSize = event.itemsPerPage;
      this.paginationPageNo.RequestedPageNumber = event.currentPage;
      this.columnFilterDetails.SearchOrder.page = this.paginationPageNo.RequestedPageNumber;
      this.columnFilterDetails.SearchOrder.count = this.paginationPageNo.PageSize
      this.fetchFilterdDataList(event, '');
    }

  }



  fetchColumnFilters(data) {
    const headerName = data.filterData.headerName;
    if (!data.filterData.isApplyFilter && (headerName == 'StartDate' || headerName == 'EndDate')) {
      const fromDateKey = headerName == 'StartDate' ? 'StartFromDate' : 'EndFromDate';
      const toDateKey = headerName == 'StartDate' ? 'StartToDate' : 'EndToDate';

      const tempObj = {
        filterStartDate: this.columnFilterDetails.SearchOrder[fromDateKey] ? this.columnFilterDetails.SearchOrder[fromDateKey] : '',
        filterEndDate: this.columnFilterDetails.SearchOrder[toDateKey] ? this.columnFilterDetails.SearchOrder[toDateKey] : '',
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
        this.generateFilterConfigData(data, headerName, false, true);
      } else {
        if (data.filterData.isApplyFilter && this.service.CheckFilterFlag(data)) {
          this.fetchFilterdDataList(data, headerName)
        } else {
          this.fetchOrderDetails();
        }
      }

    }
  }

  fetchFilterdDataList(data: any, headerName: string) {
    const requestBody = {
      ...this.columnFilterDetails,
      ...this.parentOrderDetails
    };
    
    if (data.filterData.sortColumn == '') {
      const headerID = columnFilterNumbers['OrderId'];
      requestBody.SearchOrder.SortBy = +headerID;
    }

    requestBody.SearchOrder.SearchText = this.paginationPageNo.searchText;

    const body = headerName ? this.setFilterDataByHeader(data, headerName, requestBody) : requestBody;
    console.log("retagpay",body);
    this.orderService.ApplyRetagListFilter(body).subscribe(ordersList => {
      if (ordersList && !ordersList.IsError && ordersList.ResponseObject) {
        this.ordersListForListingPage = this.fetchAllOrdersList(ordersList);
        this.totalPageCount = ordersList.TotalRecordCount;
      } else {

      }
    },
      err => {

      })

  }

  setFilterDataByHeader(data: any, headerName: any, requestBody: any) {

    const temp = data.filterData.filterColumn[headerName];
    if (headerName == 'StartDate' || headerName == 'EndDate') {
      const fromDateKey = headerName == 'StartDate' ? 'StartFromDate' : 'EndFromDate';
      const toDateKey = headerName == 'StartDate' ? 'StartToDate' : 'EndToDate';

      requestBody.SearchOrder[fromDateKey] = temp[0].filterStartDate ? this.convertDateISOtoReadable(temp[0].filterStartDate.toLocaleString(), '/') : '';
      requestBody.SearchOrder[toDateKey] = temp[0].filterEndDate ? this.convertDateISOtoReadable(temp[0].filterEndDate.toLocaleString(), '/') : '';

      return requestBody;
    }


    const requestKey = this.filterApplyRequestHelper[headerName].key;
    const dataKey = this.filterApplyRequestHelper[headerName].dataKey;
    requestBody.SearchOrder[requestKey] = [];
    requestBody.SearchOrder[requestKey] = temp.map(res => {
      return res[dataKey];
    });

    return requestBody;
  }


  generateFilterConfigData(data, headerName, isConcat, isServiceCall?) {
    // if (isServiceCall) {
    const headerID = columnFilterNumbers[headerName];
    const requestBody = {
      ...this.columnFilterDetails,
      ...this.parentOrderDetails
    };
    requestBody.SearchOrder.SortBy = +headerID;
    requestBody.SearchOrder.page = this.filterConfigData[headerName].PageNo;
    requestBody.SearchOrder.FilterSearchText = data.filterData.columnSerachKey;


    this.orderService.RetagColumnFilter(requestBody).subscribe(res => {
      console.log("searchpayloadd",requestBody );
         console.log("searchresp",res );
      this.filterConfigData.isFilterLoading = false;
      if (res && !res.IsError && res.ResponseObject) {
        let response = [];
        res.ResponseObject.map(filterVal => {
          const id = this.filterColumnKeys[headerName].id;
          const name = this.filterColumnKeys[headerName].name;
          if (filterVal[id] && filterVal[name]) {
            response.push({
              id: filterVal[id],
              name: filterVal[name],
              isDatafiltered: false
            });
          }

        });

        response.map(responseItem => {
          const existingData: any[] = this.columnFilterDetails.SearchOrder[this.filterApplyRequestHelper[headerName].key];
          if (existingData && existingData.includes(responseItem[this.filterApplyRequestHelper[headerName].dataKey])) {
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

  columnSearchAndLoadMore(data: any, action: string) {
    let headerName = data.filterData.headerName;
    const isConcat = action == 'loadMoreFilterData' ? true : false;
    if (action == 'loadMoreFilterData') {
      this.filterConfigData[headerName].PageNo = this.filterConfigData[headerName].PageNo + 1
    } else {
      this.filterConfigData[headerName].PageNo = 1
    }
    this.generateFilterConfigData(data, headerName, isConcat, true)
  }


  // Miscellaneous

  private convertDateISOtoReadable(date: string, seperator: string) {
    const tempDate = new Date(date);
    return `${tempDate.getFullYear()}${seperator}${tempDate.getMonth() + 1}${seperator}${tempDate.getDate()}`;

  }

  public goBack() {
    this.changeType = true;
    this.verifyDetails = false;
    this.twoactive = false;
  }

  public gotoNextPage() {
    if (!this.selectedOrder) {
      this.projectService.displayMessageerror("Please select an order to be retagged");
      return;
    }
    if (!this.orderTypeForRetag) {
      this.projectService.displayMessageerror("Please select an order type");
      return;
    }

    this.changeType = false;
    this.verifyDetails = true;
    this.twoactive = true;

  }

  public openConfirmPopup() {
    const dialogRef = this.dialog.open(ConfirmPopUp, {
      width: '450px',
      data: {
        currentOrderType: this.primaryOrderDetailsReview.OrderType ? this.primaryOrderDetailsReview.OrderType : 'New',
        newOrderType: this.orderTypeForRetag
      }

    });

    dialogRef.afterClosed().subscribe(res => {
      if (res && res == 'YES') {
        let body = {
          "PrimaryOrderId": this.parentOrderDetails.OrderBookingId,   // primary order id
          "OldOpportunityClass": this.orderTypeForRetag,   // radio button text
          "PrimaryOrderNumber": this.parentOrderDetails.OrderBookingId,   // primary order number
          "SelectedOrderNumber": this.selectedOrder.OrderGuid   // selected order number from table
        }
        this.orderService.RetagOrder(body).subscribe(retagedOrder => {
          if (retagedOrder && !retagedOrder.IsError && retagedOrder.ResponseObject) {
            const SuccessdialogRef = this.dialog.open(SubmitPopUp, {
              width: '800px',
              data: {
                retagedOrder: retagedOrder
              }
            });

            SuccessdialogRef.afterClosed().subscribe(res => {
              this.router.navigate(['/order']);

            })
          } else {

          }
        }, err => {

        });

      }
    });

  }

  public goBacktoMain() {
    window.history.back();
  }


}




@Component({
  selector: 'app-confirm-pop',
  templateUrl: './confirm-pop.html',
  styleUrls: ['./retag-order.component.scss'],
})
export class ConfirmPopUp {
  constructor(public dialog: MatDialogRef<ConfirmPopUp>, @Inject(MAT_DIALOG_DATA) public data: any, ) { }


}

@Component({
  selector: 'app-submit-pop',
  templateUrl: './submit-pop.html',
  styleUrls: ['./retag-order.component.scss'],
})
export class SubmitPopUp implements OnInit {

  public retagSuccessDetails;

  constructor(public dialog: MatDialogRef<SubmitPopUp>, @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit(): void {
    this.retagSuccessDetails = this.data.retagedOrder;
  }

}