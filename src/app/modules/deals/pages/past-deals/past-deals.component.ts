import { Component, OnInit, OnDestroy } from "@angular/core";
import { DataCommunicationService } from "@app/core";
import { dealService } from "@app/core/services/deals.service";
import { DealJsonService } from "@app/core/services/deals/dealjsonservice";
import { ValidateforNullnUndefined } from "@app/core/services/validateforNULLorUndefined.service";
import { PastDataList } from "@app/core/state/selectors/deals/past-deal.selectors";
import { Store, select } from "@ngrx/store";
import { AppState } from "@app/core/state";
import { of, Observable, Subscription } from "rxjs";
import {
  PastDealAction,
  DealOverViewAction,
  DealParameterListAction,
  ModuleListAction,
  DealCoOwnerListAction,
  calculateDeals,
  PassthroughListAction
} from "@app/core/state/actions/deals.actions";
import { ErrorMessage } from "@app/core/services/error.services";
import { EncrDecrService } from "@app/core/services/encr-decr.service";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { DateModifier } from "@app/core/services/date-modifier";
import { MessageService } from "@app/core/services/deals/deals-observables.service";
import { RoutingState } from "@app/core/services/navigation.service";
@Component({
  selector: "app-past-deals",
  templateUrl: "./past-deals.component.html",
  styleUrls: ["./past-deals.component.scss"]
})
export class PastDealsComponent implements OnInit, OnDestroy {
  mainArray = [];
  pastDealTable = [];
  verticalList = [];
  verticallist = [];
  isLoading: boolean = false;
  searchText: string = "";
  verticalcode: any = "";
  SBUList = [];
  tableTotalCount: number = 0;
  sbuCode: any = "";
  monthList = [];
  monthCode: any = "";
  yearList = [];
  yearCode: any = "";
  deal: boolean = true;
  paginationPageNo = {
    PageSize: 10,
    RequestedPageNumber: 1,
    OdatanextLink: "",
    FilterData: []
  };
  filterConfigData: any = {
    clName: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    closure: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    dealName: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    oaid: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    pid: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    sbu: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    status: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    tcvCurr: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    tcvUsd: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    vertical: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    isFilterLoading: true
  };
  all: boolean;
  PastDealData: any = {};
  filterby: any = 0;
  isSearched: boolean;
  userInfo: any;
  selectedYear: string = "Select the year";
  selectedMonth: string = "Select the month";
  selectedSBU: string = "Select the SBU";
  dealList: any;
  SearchText: any = "";
  pastDealStore$: Subscription = new Subscription();
  selectedVertical: any;
  verticalName: any;
  constructor(
    public service: DataCommunicationService,
    public _error: ErrorMessage,
    public store: Store<AppState>,
    private _validate: ValidateforNullnUndefined,
    private deals: dealService,
    private dealJson: DealJsonService,
    public encrDecrService: EncrDecrService,
    public router: Router,
    private messageService: MessageService,
    private routerService: RoutingState
  ) {}
  showDeal() {
    this.deal = true;
    this.all = false;
    this.dealJson.pastdealsinput.User = {
      EmployeeId: this.userInfo.EmployeeId,
      EmployeeMail: this.userInfo.EmployeeMail,
      EmployeeName: this.userInfo.EmployeeName,
      EmployeeNumber: this.userInfo.EmployeeNumber
    };
    this.dealJson.pastdealsinput.PastDealInput.DealMyandAll = "MY";
    this.dealJson.pastdealsinput.PastDealInput.Vertical = "";
    this.dealJson.pastdealsinput.PastDealInput.DealSubMonth = "";
    this.dealJson.pastdealsinput.PastDealInput.DealSubYear = "";
    this.filterby = 0;
    this.verticalcode = "";
    this.yearCode = "";
    this.monthCode = "";
    this.sbuCode = "";
    this.searchText = "";
    this.getAPIData();
  }
  showAll() {
    this.deal = false;
    this.all = true;
    this.dealJson.pastdealsinput.User = {
      EmployeeId: this.userInfo.EmployeeId,
      EmployeeMail: this.userInfo.EmployeeMail,
      EmployeeName: this.userInfo.EmployeeName,
      EmployeeNumber: this.userInfo.EmployeeNumber
    };
    this.dealJson.pastdealsinput.PastDealInput.DealMyandAll = "ALL";
    this.dealJson.pastdealsinput.PastDealInput.Vertical = "";
    this.dealJson.pastdealsinput.PastDealInput.DealSubMonth = "";
    this.dealJson.pastdealsinput.PastDealInput.DealSubYear = "";
    this.filterby = 0;
    this.verticalcode = "";
    this.yearCode = "";
    this.monthCode = "";
    this.sbuCode = "";
    this.searchText = "";
    this.searchDeal();
  }

  ngOnInit() {
    let userInfo = this.encrDecrService.get(
      "EncryptionEncryptionEncryptionEn",
      sessionStorage.getItem("userInfo"),
      "DecryptionDecrip"
    );
    this.userInfo = JSON.parse(userInfo);
    this.pastDealStore$ = this.store
      .pipe(select(PastDataList))
      .subscribe(res => {
        console.log("Past Deal", res);
        if (res.pastDeal != undefined) {
          console.log("From state", res);
          this.getDropdownNData(res.pastDeal);
        } else {
          this.getAPIData();
        }
      });
  }
  getDropdownNData(outResponse) {
    console.log(outResponse.DealList, "outResponseoutResponse");
    if (this._validate.validate(outResponse)) {
      this.PastDealData = outResponse;
      this.verticallist = outResponse.VerticalList;
      this.SBUList = outResponse.SBUList;
      this.yearList = outResponse.YearList;
      this.monthList = outResponse.MonthList;
      this.dealJson.pastdealsinput.User = {
        EmployeeId: this.userInfo.EmployeeId,
        EmployeeMail: this.userInfo.EmployeeMail,
        EmployeeName: this.userInfo.EmployeeName,
        EmployeeNumber: this.userInfo.EmployeeNumber
      };
      this.dealJson.pastdealsinput.PastDealInput.Vertical = "";
      this.dealJson.pastdealsinput.PastDealInput.DealMyandAll = this.all
        ? "ALL"
        : "MY";
      this.dealJson.pastdealsinput.PastDealInput.DealSubYear =
        outResponse.CurrentYear;
      this.dealJson.pastdealsinput.PastDealInput.DealSubMonth =
        outResponse.CurrentMonth;
      this.yearCode = outResponse.CurrentYear;
      this.monthCode = outResponse.CurrentMonth;
      const perPage = this.paginationPageNo.PageSize;
      const start =
        (this.paginationPageNo.RequestedPageNumber - 1) * perPage + 1;
      let i = start;
      const end = start + perPage - 1;
      console.log(start + " - " + end);
      outResponse.DealList.map(res => {
        if (!res.index) {
          res.index = i;
          i = i + 1;
        }
      });
      this.mainArray = this.getMappedData(outResponse.DealList);
      this.pastDealTable = this.getMappedData(outResponse.DealList);
      this.tableTotalCount = outResponse.DealList.length;
      console.log(this.pastDealTable, "this.pastDealTable");
    } else {
      this.mainArray = [];
      this.pastDealTable = [{}];
      this.tableTotalCount = 0;
    }
  }
  selectYear(event) {
    if (event.value != "") {
      let selectedYear = this.yearList.filter(element => {
        return event.value == element.year;
      })[0];
      this.yearCode = selectedYear.year;
      this.selectedYear = `Selected ${this.yearCode}`;
    }
  }
  selectMonth(event) {
    if (event.value != "") {
      let selectedMonth = this.monthList.filter(element => {
        return event.value == element.intMonth;
      })[0];
      this.monthCode = selectedMonth.intMonth;
      this.selectedMonth = `Selected ${this.monthCode}`;
    }
  }
  selectSBU(event) {
    if (event != undefined) {
      let selectedSBU = this.SBUList.filter(element => {
        return event == element.SBUCode;
      })[0];
      this.sbuCode = selectedSBU.SBUCode;
      this.selectedSBU = `Selected ${this.sbuCode}`;
      const verlist = this.verticallist.filter(item => {
        return item.SBUCode == event;
      });
      this.verticalList = verlist;
    }
  }
  selectVertical(event) {
    if (event != undefined) {
      let selectedVertical = this.verticalList.filter(x => {
        return event == x.VerticalCode;
      })[0];
      this.verticalName = selectedVertical.VerticalName;
      this.selectedVertical = `Selected ${this.verticalName}`;
    }
  }
  resetDeal() {
    this.dealJson.pastdealsinput.User = {
      EmployeeId: this.userInfo.EmployeeId,
      EmployeeMail: this.userInfo.EmployeeMail,
      EmployeeName: this.userInfo.EmployeeName,
      EmployeeNumber: this.userInfo.EmployeeNumber
    };
    this.dealJson.pastdealsinput.PastDealInput.DealMyandAll = this.all
      ? "ALL"
      : "MY";
    this.dealJson.pastdealsinput.PastDealInput.Vertical = "";
    this.dealJson.pastdealsinput.PastDealInput.DealSubMonth = "";
    this.dealJson.pastdealsinput.PastDealInput.DealSubYear = "";
    this.filterby = 0;
    this.verticalcode = "";
    this.yearCode = "";
    this.monthCode = "";
    this.sbuCode = "";
    this.searchText = "";
    this.searchDeal();
  }
  getAPIData() {
    this.isLoading = true;
    let pastdealsinput = {
      User: {
        EmployeeId: this.userInfo.EmployeeId,
        EmployeeMail: this.userInfo.EmployeeMail,
        EmployeeName: this.userInfo.EmployeeName,
        EmployeeNumber: this.userInfo.EmployeeNumber
      },
      PastDealInput: {
        DealSubYear: this.yearCode ? this.yearCode : "",
        DealSubMonth: this.monthCode ? this.monthCode : "",
        StartRowNumber: "",
        PageName: "MyDeals.aspx",
        PageSize: "50",
        SBUCode: this.sbuCode ? this.sbuCode : "",
        Vertical: "",
        VerticalCode: this.verticalcode ? this.verticalcode : "",
        FilterBy: this.filterby ? this.filterby : "0",
        FilterLike: this.searchText ? this.searchText : "",
        DealMyandAll: this.all ? "ALL" : "MY"
      }
    };
    this.deals.getPastDeals(pastdealsinput).subscribe(
      res => {
        if (res) {
          this.isLoading = false;
          if (res.ReturnFlag == "S") {
            console.log("From api", res);
            this.store.dispatch(new PastDealAction({ pastDeal: res.Output }));
            this.getDropdownNData(res.Output);
          } else {
            this._error.throwError(res.ReturnMessage);
            this.getDropdownNData(null);
          }
        }
      },
      error => {
        this.isLoading = false;
        console.log("Error", error);
        this._error.throwError("Technical Error!");
        this.getDropdownNData(null);
      }
    );
  }

  performTableChildAction(childActionRecieved): Observable<any> {
    var actionRequired = childActionRecieved;
    console.log(actionRequired);
    switch (actionRequired.action) {
      case "pid": {
        let dealData = actionRequired.objectRowData[0];
        console.log("dealData-->", dealData);
        let obj = {
          TCV_currency: dealData.tcvCurr,
          activeTR: true,
          createDate: dealData.closure,
          curency: "",
          dealHeadernumber: "",
          dealName: dealData.dealName,
          id: dealData.id,
          index: dealData.index,
          isCheccked: dealData.isCheccked,
          om: "",
          oppID: dealData.oaid,
          OptionId: dealData.OptionID,
          pricingId: dealData.pid ? dealData.pid.toUpperCase() : "",
          status: dealData.status,
          tickedBtnVisibility: false,
          vertical: dealData.vertical
        };
        let encryptData = this.encrDecrService.set(
          "EncryptionEncryptionEncryptionEn",
          JSON.stringify(obj),
          "DecryptionDecrip"
        );
        sessionStorage.removeItem("getFillManageParameters");
        sessionStorage.removeItem("EmployeeList");
        this.store.dispatch(
          new DealOverViewAction({ dealoverview: undefined })
        );
        this.store.dispatch(
          new DealParameterListAction({ dealparameterList: undefined })
        );
        this.store.dispatch(new ModuleListAction({ ModuleList: undefined }));
        this.store.dispatch(
          new DealCoOwnerListAction({ dealCoOwnersList: undefined })
        );
        this.store.dispatch(new calculateDeals({ calculateDeal: undefined }));
        this.store.dispatch(
          new PassthroughListAction({ passthroughlist: undefined })
        );
        this.messageService.sendPastDealEnable({ originUrl: this.router.url });
        sessionStorage.setItem("Dealoverview", encryptData);
        sessionStorage.setItem("DealName", dealData.dealName);
        this.router.navigateByUrl("/deals/existingTabs/overview");
        return;
      }
      case "search": {
        if (actionRequired.objectRowData != "") {
          this.SearchText = actionRequired.objectRowData;
          let searchedData = this.Globalsearch(
            actionRequired.objectRowData,
            this.mainArray
          );
          console.log("Searched Data", searchedData);
          for (let i = 0; i < searchedData.length; i++) {
            console.log("index", i, searchedData[i]);
            searchedData[i].index = i + 1;
          }
          console.log("After Data", searchedData);
          if (searchedData.length > 0) {
            this.pastDealTable = searchedData;
          } else {
            this.pastDealTable = [{}];
          }
          this.tableTotalCount = this.pastDealTable.length;
        } else {
          this.SearchText = "";
          this.pastDealTable = this.mainArray;
          this.tableTotalCount = this.pastDealTable.length;
        }
        return;
      }
      case "columnFilter": {
        console.log(childActionRecieved);
        if (childActionRecieved.filterData.isApplyFilter == false) {
          this.filterConfigData.isFilterLoading = false;
          this.filterConfigData[
            childActionRecieved.filterData.headerName
          ].data = this.deals.getHeaderData(
            childActionRecieved.filterData.headerName,
            this.mainArray
          );

          this.filterConfigData[
            childActionRecieved.filterData.headerName
          ].recordCount = this.filterConfigData[
            childActionRecieved.filterData.headerName
          ].data.length;

          if (
            childActionRecieved.filterData.filterColumn[
              childActionRecieved.filterData.headerName
            ].length > 0
          ) {
            this.filterConfigData[
              childActionRecieved.filterData.headerName
            ].data.map(x => {
              childActionRecieved.filterData.filterColumn[
                childActionRecieved.filterData.headerName
              ].map(y => {
                x.id == y.id ? (x.isDatafiltered = y.isDatafiltered) : null;
              });
            });
          }
        } else {
          this.isLoading = false;
          this.filterConfigData.isFilterLoading = false;
          if (childActionRecieved.filterData.globalSearch == "") {
            this.applyFilter(childActionRecieved);
          } else {
            let searchedData = this.Globalsearch(
              childActionRecieved.filterData.globalSearch,
              this.mainArray
            );
            console.log("Searched Data", searchedData);
            for (let i = 0; i < searchedData.length; i++) {
              console.log("index", i, searchedData[i]);
              searchedData[i].index = i + 1;
            }
            console.log("After Data", searchedData);
            if (searchedData.length > 0) {
              this.pastDealTable = searchedData;
              let filteredarray = [];
              let currentData = JSON.parse(JSON.stringify(this.pastDealTable));
              if (childActionRecieved.filterData.order.length > 0) {
                childActionRecieved.filterData.order.map(x => {
                  childActionRecieved.filterData.filterColumn[x].map(y => {
                    currentData.map(z => {
                      let result: any = this.deals.getFilteredArrayList(
                        x,
                        z,
                        y.name
                      );
                      result != undefined && result != null && result != null
                        ? filteredarray.push(result)
                        : null;
                    });
                  });
                });
                filteredarray = this.deals.getUnique(
                  filteredarray,
                  "pricingId"
                );
                if (filteredarray.length > 0) {
                  this.pastDealTable = filteredarray;
                  this.tableTotalCount = this.pastDealTable.length;
                } else {
                  this.pastDealTable = [{}];
                  this.tableTotalCount = 0;
                }
              } else {
                this.pastDealTable = searchedData;
                this.tableTotalCount = this.pastDealTable.length;
              }
            }
          }
        }
        return;
      }
      case "columnSearchFilter": {
        this.filterConfigData.isFilterLoading = false;
        if (childActionRecieved.objectRowData != "") {
          this.filterConfigData[
            childActionRecieved.filterData.headerName
          ].data = this.deals.getSearchHeaderData(
            childActionRecieved.filterData.headerName,
            this.mainArray,
            childActionRecieved.objectRowData
          );

          this.filterConfigData[
            childActionRecieved.filterData.headerName
          ].recordCount = this.filterConfigData[
            childActionRecieved.filterData.headerName
          ].data.length;
        } else {
          this.filterConfigData[
            childActionRecieved.filterData.headerName
          ].data = this.deals.getHeaderData(
            childActionRecieved.filterData.headerName,
            this.mainArray
          );
          this.filterConfigData[
            childActionRecieved.filterData.headerName
          ].recordCount = this.filterConfigData[
            childActionRecieved.filterData.headerName
          ].data.length;
        }
        return;
      }
      case "sortHeaderBy": {
        let currentData = JSON.parse(JSON.stringify(this.pastDealTable));
        let sortedArray = this.deals.SortByHeaders(
          currentData,
          childActionRecieved.filterData.sortColumn,
          childActionRecieved.filterData.sortOrder
        );
        let i = 1;
        sortedArray.map(x => {
          x.index = i;
          i = i + 1;
        });
        this.pastDealTable = sortedArray;
        this.tableTotalCount = this.pastDealTable.length;
        return;
      }
      case "ClearAllFilter": {
        this.pastDealTable = this.mainArray.filter(x => x);
        this.tableTotalCount = this.pastDealTable.length;
        return;
      }
    }
  }
  pagination(event) {
    console.log(event);
    switch (event.action) {
      case "pagination": {
        debugger;
        let pastDealInput = {
          User: {
            EmployeeId: this.userInfo.EmployeeId,
            EmployeeMail: this.userInfo.EmployeeMail,
            EmployeeName: this.userInfo.EmployeeName,
            EmployeeNumber: this.userInfo.EmployeeNumber
          },
          PastDealInput: {
            DealSubYear: this.yearCode ? this.yearCode : "",
            DealSubMonth: this.monthCode ? this.monthCode : "",
            StartRowNumber: "",
            PageName: "MyDeals.aspx",
            PageSize: "50",
            SBUCode: this.sbuCode ? this.sbuCode : "",
            Vertical: "",
            VerticalCode: this.verticalcode ? this.verticalcode : "",
            FilterBy: this.filterby ? this.filterby : "0",
            FilterLike: this.searchText ? this.searchText : "",
            DealMyandAll: this.all ? "ALL" : "MY"
          }
        };
        this.paginationPageNo.RequestedPageNumber = event.currentPage;
        pastDealInput.PastDealInput.PageSize = event.itemsPerPage;
        pastDealInput.PastDealInput.StartRowNumber =
          this.pastDealTable[this.pastDealTable.length - 1].rowNumber +
          event.itemsPerPage;
        this.getPaginationNsearch(pastDealInput);
        return of("Search Trigger");
      }
    }
  }
  getPaginationNsearch(pastDealInput) {
    this.isLoading = true;
    this.isSearched = true;
    this.deals.getPastDeals(pastDealInput).subscribe(
      res => {
        console.log(res, "past res all response..");
        if (res) {
          this.isLoading = false;
          if (res.ReturnFlag == "S") {
            this.yearList = res.Output.YearList;
            this.yearCode = res.Output.CurrentYear;
            this.monthCode = res.Output.CurrentMonth;
            this.SBUList = res.Output.SBUList;
            const perPage = this.paginationPageNo.PageSize;
            const start =
              (this.paginationPageNo.RequestedPageNumber - 1) * perPage + 1;
            let i = start;
            const end = start + perPage - 1;
            console.log(start + " - " + end);
            res.Output.DealList.map(res => {
              if (!res.index) {
                res.index = i;
                i = i + 1;
              }
            });
            let spliceArray = [];
            this.pastDealTable.map(res => {
              if (res.index >= start && res.index <= end) {
                spliceArray.push(res);
              }
            });
            spliceArray.map(res => {
              this.pastDealTable.splice(this.pastDealTable.indexOf(res), 1);
            });
            if (res.Output.DealList.length > 0) {
              this.mainArray = this.getMappedData(res.Output.DealList);
              this.pastDealTable = this.getMappedData(res.Output.DealList);
              this.tableTotalCount = res.Output.DealList.length;
            } else {
              this.mainArray = [];
              this.pastDealTable = [{}];
              this.tableTotalCount = 0;
            }
            console.log("Table data", this.pastDealTable);
          } else {
            console.log("Failure", res.ReturnMessage);
            this._error.throwError(res.ReturnMessage);
          }
        }
      },
      error => {
        this.isLoading = false;
        this._error.throwError(error);
        this._error.throwError("Technical Error!");
      }
    );
  }
  searchDeal() {
    let input = {
      User: {
        EmployeeId: this.userInfo.EmployeeId,
        EmployeeMail: this.userInfo.EmployeeMail,
        EmployeeName: this.userInfo.EmployeeName,
        EmployeeNumber: this.userInfo.EmployeeNumber
      },
      PastDealInput: {
        DealSubYear: this.yearCode ? this.yearCode : "",
        DealSubMonth: this.monthCode ? this.monthCode : "",
        StartRowNumber: "",
        PageName: "MyDeals.aspx",
        PageSize: "50",
        SBUCode: this.sbuCode ? this.sbuCode : "",
        Vertical: "",
        VerticalCode: this.verticalcode ? this.verticalcode : "",
        FilterBy: this.filterby ? this.filterby : "0",
        FilterLike: this.searchText ? this.searchText : "",
        DealMyandAll: this.all ? "ALL" : "MY"
      }
    };
    console.log(input, "input.......");
    this.getPaginationNsearch(input);
  }
  searchBtn() {
    this.searchDeal();
  }
  //Apply filter
  applyFilter(childActionRecieved) {
    console.log("childAction-->", childActionRecieved);
    this.pastDealTable = this.mainArray;
    if (childActionRecieved.filterData.order.length > 0) {
      childActionRecieved.filterData.order.map(name => {
        let filteredarray = [];
        let myarray = this.pastDealTable;

        childActionRecieved.filterData.filterColumn[name].map(y => {
          if (name == "closure") {
            let response: any = this.deals.getFilteredDateArrayList(
              name,
              myarray,
              y
            );
            console.log("response-->", response);
            filteredarray = response;
          } else {
            myarray.map(x => {
              let result: any = this.deals.getFilteredArrayList(
                name,
                x,
                y.name
              );
              result != undefined && result != null && result != null
                ? filteredarray.push(result)
                : null;
            });
          }
        });
        filteredarray = this.deals.getUnique(filteredarray, "pid");
        if (filteredarray.length > 0) {
          let i = 1;
          filteredarray.map(x => {
            x.index = i;
            i = i + 1;
          });
          this.pastDealTable = filteredarray;
          this.tableTotalCount = this.pastDealTable.length;
        } else {
          this.pastDealTable = [{}];
          this.tableTotalCount = 0;
        }
      });
    } else {
      this.pastDealTable = this.mainArray;
      this.tableTotalCount = this.pastDealTable.length;
    }
  }
  Globalsearch(searchKey: string, collections?: Array<object>): any {
    // copy all objects of original array into new array of objects
    let filteredarray = [];
    // args are the compare oprators provided in the *ngFor directive
    collections.forEach(function(objectToFilter) {
      let rowData = [];
      for (var prop in objectToFilter) {
        rowData.push(objectToFilter[prop]);
      }
      for (let index = 0; index < rowData.length; index++) {
        const element = rowData[index];
        let str: string = element.toString();
        let text1: string = str.toLowerCase();
        let text2: string = searchKey.toLowerCase();
        if (text1.includes(text2)) {
          filteredarray.push(objectToFilter);
          break;
        }
      }
    });
    return filteredarray;
  }
  getMappedData(response) {
    if (response.length > 0) {
      let Output = [];
      response.map(x => {
        let obj = {
          id: x.DealHeaderID || "NA",
          dealName: x.DealHeaderName || "NA",
          closure: x.CreatedDate
            ? this.getLocaleDateFormat(x.CreatedDate)
            : "NA",
          oaid: x.OppIdorAmendmentNo || "NA",
          pid: x.PricingId || "NA",
          clName: x.CustomerName || "NA",
          sbu: x.SBUName || "NA",
          vertical: x.VerticalName || "NA",
          tcvCurr: x.DealCurrency || "NA",
          tcvUsd: x.TCV || "NA",
          status: x.Status || "NA",
          OptionID: x.OptionID,
          index: x.index ? x.index : null
        };
        Output.push(obj);
      });
      console.log("Mapped API output-->", Output);
      return Output;
    } else {
      return [{}];
    }
  }
  getLocaleDateFormat(dateConvert) {
    const dataModifier = new DateModifier();
    return dataModifier.modifier(dateConvert);
  }
  ngOnDestroy() {
    this.pastDealStore$.unsubscribe();
  }
}
