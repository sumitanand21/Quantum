import { Component, OnInit, OnDestroy } from "@angular/core";
import { DataCommunicationService, OnlineOfflineService } from "@app/core";
import { dealService } from "@app/core/services/deals.service";
import { ValidateforNullnUndefined } from "@app/core/services/validateforNULLorUndefined.service";
import { DealJsonService } from "@app/core/services/deals/dealjsonservice";
import { of, Observable, Subscription } from "rxjs";
import { Store, select } from "@ngrx/store";
import { AppState } from "@app/core/state";
import { RLSviewDataList } from "@app/core/state/selectors/deals/rls-view.selectors";
import {
  RLSViewAction,
  ModuleListAction,
  DealOverViewAction,
  DealParameterListAction,
  DealCoOwnerListAction,
  calculateDeals,
  PassthroughListAction
} from "@app/core/state/actions/deals.actions";
import { ErrorMessage } from "@app/core/services/error.services";
import { EncrDecrService } from "@app/core/services/encr-decr.service";
import { Router } from "@angular/router";
import { RoutingState } from "@app/core/services/navigation.service";
import { DatePipe } from "@angular/common";
import { MessageService } from "@app/core/services/deals/deals-observables.service";
@Component({
  selector: "app-rls-view",
  templateUrl: "./rls-view.component.html",
  styleUrls: ["./rls-view.component.scss"]
})
export class RlsViewComponent implements OnInit, OnDestroy {
  rlsDealTable = [];
  RLSviewData: any = {};
  isLoading: boolean = false;
  tableTotalCount: number = 0;
  filterBylist = [];
  paginationPageNo = {
    PageSize: 50,
    RequestedPageNumber: 1,
    OdatanextLink: "",
    FilterData: []
  };
  pageCount: number = 50;
  pageNo: number = 1;
  searchText: string = "";
  verticalList = [];
  varticalListDrop = [];
  SBUList = [];
  filterby: any = "";
  verticalcode: any = "";
  sbuCode: any = "";
  isSearched: boolean;
  rlsViewData$: Subscription = new Subscription();
  userInfo: any;
  filterConfigData = {
    dealName: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    creation: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    clName: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    sbu: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    dealCurr: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    type: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    status: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    vertical: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    isFilterLoading: true
  };
  selectedSBU: string;
  verticalName: any;
  selectedVertical: string;
  constructor(
    public service: DataCommunicationService,
    public _error: ErrorMessage,
    public store: Store<AppState>,
    private deals: dealService,
    private dealjson: DealJsonService,
    private _validate: ValidateforNullnUndefined,
    public encrDecrService: EncrDecrService,
    public router: Router,
    public routingState: RoutingState,
    public onlineOfflineService: OnlineOfflineService,
    private datePipe: DatePipe,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    let userInfo = this.encrDecrService.get(
      "EncryptionEncryptionEncryptionEn",
      sessionStorage.getItem("userInfo"),
      "DecryptionDecrip"
    );
    this.userInfo = JSON.parse(userInfo);
    console.log("User info-->", this.userInfo);
    this.rlsViewData$ = this.store.pipe(select(RLSviewDataList)).subscribe(
      res => {
        console.log("RLS View", res);
        if (res.rlsviewdata != undefined) {
          if (res.rlsviewdata.ReturnFlag == "S") {
            console.log("From state", res);
            this.getDropDownsnData(res.rlsviewdata);
          } else {
            if (this.onlineOfflineService.isOnline) {
              this.getAPIdata();
            }
          }
        } else {
          if (this.onlineOfflineService.isOnline) {
            this.getAPIdata();
          } else {
            this.getAPIdata();
          }
        }
      },
      () => {
        this.getAPIdata();
      }
    );
    // Offline services
    if (!this.onlineOfflineService.isOnline) {
      const CacheResponse = await this.deals.getRLSViewCacheData();
      console.log("CacheResponse-->", CacheResponse);
      if (CacheResponse) {
        if (CacheResponse.data.totalRowCount > 0) {
          this.isLoading = false;
          this.getDropDownsnData(CacheResponse.data);
        }
      }
    }
  }
  getAPIdata() {
    this.isLoading = true;
    let input = {
      User: {
        EmployeeId: this.userInfo.EmployeeId
      },
      RLSViewDealInput: {
        StartRowNumber: 1,
        PageName: "MyDeals.aspx",
        PageSize: "50",
        SBUCode: "",
        Vertical: "",
        VerticalCode: "",
        FilterBy: "0",
        FilterLike: "",
        SearchFilter: {
          SearchText: "",
          FilterByPropertyName: ""
          // "SortByPropertyName" : 'dealName ASC'
        }
      },

      spParams: {}
    };
    this.deals.getRLSDropdownsNdata(input).subscribe(
      res => {
        if (res) {
          this.isLoading = false;
          if (res.ReturnFlag == "S") {
            console.log("From api", res);
            this.store.dispatch(new RLSViewAction({ RLSviewData: res.Output }));
            this.getDropDownsnData(res.Output);
          } else {
            this._error.throwError(res.ReturnMessage);
            this.getDropDownsnData(null);
          }
        }
      },
      error => {
        this.isLoading = false;
        this._error.throwError(error);
        this.getDropDownsnData(null);
      }
    );
  }
  getDropDownsnData(outResponse) {
    if (outResponse) {
      if (outResponse.totalRowCount > 0) {
        this.RLSviewData = outResponse;
        this.varticalListDrop = outResponse.VerticalList;
        this.SBUList = outResponse.SBUList;
        const perPage = this.paginationPageNo.PageSize;
        const start =
          (this.paginationPageNo.RequestedPageNumber - 1) * perPage + 1;
        let i = start;
        const end = start + perPage - 1;
        console.log(start + " - " + end);
        outResponse.RLSViewDealList.map(res => {
          if (!res.index) {
            res.index = i;
            i = i + 1;
          }
        });

        this.rlsDealTable = this.getMappedData(outResponse.RLSViewDealList);
        this.tableTotalCount = outResponse.totalRowCount;
      } else {
        this.rlsDealTable = [{}];
      }
    } else {
      this.rlsDealTable = [{}];
    }
  }
  RlSearch() {
    let rlsData = {
      User: {
        EmployeeId: this.userInfo.EmployeeId
      },
      RLSViewDealInput: {
        StartRowNumber: 1,
        PageName: "MyDeals.aspx",
        PageSize: "50",
        SBUCode: "",
        Vertical: "",
        VerticalCode: "",
        FilterBy: "0",
        FilterLike: ""
      },
      spParams: {}
    };
    rlsData.RLSViewDealInput.FilterBy = this.filterby;
    rlsData.RLSViewDealInput.FilterLike = this.searchText;
    rlsData.RLSViewDealInput.SBUCode = this.sbuCode;
    rlsData.RLSViewDealInput.VerticalCode = this.verticalcode;
    rlsData.RLSViewDealInput.StartRowNumber = 1;
    this.getSearchnPaginationData(rlsData);
  }

  selectSBU(event) {
    console.log("event in SBU-->", event);
    if (event != undefined) {
      let selectedSBU = this.SBUList.filter(element => {
        return event == element.SBUCode;
      })[0];
      this.sbuCode = selectedSBU.SBUCode;
      this.selectedSBU = `Selected ${this.sbuCode}`;
      console.log("this.verticalList in RLS view-->", this.varticalListDrop);
      const verlist = this.varticalListDrop.filter(item => {
        return event == item.SBUCode;
      });
      console.log(verlist, "verlist");
      this.verticalList = verlist;
    }
  }
  selectVertical(event) {
    console.log("event in Vertical-->", event);
    console.log("this.verticalList in RLS view-->", this.verticalList);
    if (event != undefined) {
      let selectedVertical = this.verticalList.filter(x => {
        return event == x.VerticalCode;
      })[0];
      this.verticalName = selectedVertical.VerticalName;
      this.selectedVertical = `Selected ${this.verticalName}`;
    }
  }

  searchSelectedText: String = "";
  performTableChildAction(childActionRecieved): Observable<any> {
    var actionRequired = childActionRecieved;
    console.log(actionRequired);
    console.log(this.filterConfigData, "filter config data");
    switch (actionRequired.action) {
      case "pid": {
        let dealData = actionRequired.objectRowData[0];
        console.log("deal data-->", dealData);
        let obj = {
          TCV_currency: "",
          activeTR: true,
          createDate: new Date(dealData.creation),
          curency: dealData.dealCurr,
          dealHeadernumber: "",
          dealName: dealData.dealName,
          id: dealData.id,
          index: dealData.index,
          isCheccked: dealData.isCheccked,
          om: "",
          oppID: dealData.oaid,
          pricingId: dealData.pid ? dealData.pid.toUpperCase() : "",
          status: dealData.status,
          tickedBtnVisibility: false,
          vertical: dealData.vertical
        };
        console.log("rls view object-->", obj);
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

      case "ClearAllFilter": {
        this.ngOnInit();
        return;
      }
    }
    switch (true) {
      case actionRequired.action == "columnFilter" ||
        actionRequired.action == "loadMoreFilterData" ||
        actionRequired.action == "columnSearchFilter": {
        this.pageCount = childActionRecieved.pageData.itemsPerPage;
        this.pageNo = childActionRecieved.pageData.currentPage;
        console.log(this.pageNo, "this.pageNo");
        console.log(
          childActionRecieved,
          "this.childActionRecievedchildActionRecieved"
        );
        if (actionRequired.action == "loadMoreFilterData") {
          this.filterConfigData[
            childActionRecieved.filterData.headerName
          ].PageNo =
            this.filterConfigData[childActionRecieved.filterData.headerName]
              .PageNo + 1;
        } else {
          this.filterConfigData[
            childActionRecieved.filterData.headerName
          ].data = [];
          this.filterConfigData[
            childActionRecieved.filterData.headerName
          ].PageNo = 1;
        }
        if (childActionRecieved.filterData.isApplyFilter == false) {
          if (childActionRecieved.filterData.headerName == "dealName") {
            this.getRlsDealNameMethod(childActionRecieved);
          } else if (childActionRecieved.filterData.headerName == "creation") {
            this.getRlsDealNameMethod(childActionRecieved);
          } else if (childActionRecieved.filterData.headerName == "clName") {
            this.getRlsDealNameMethod(childActionRecieved);
          } else if (childActionRecieved.filterData.headerName == "sbu") {
            this.getRlsDealNameMethod(childActionRecieved);
          } else if (childActionRecieved.filterData.headerName == "vertical") {
            this.getRlsDealNameMethod(childActionRecieved);
          } else if (childActionRecieved.filterData.headerName == "dealCurr") {
            this.getRlsDealNameMethod(childActionRecieved);
          } else if (childActionRecieved.filterData.headerName == "type") {
            this.getRlsDealNameMethod(childActionRecieved);
          } else if (childActionRecieved.filterData.headerName == "status") {
            this.getRlsDealNameMethod(childActionRecieved);
          } else {
            this.filterConfigData.isFilterLoading = false;
          }
        } else {
          var postData = [];
          let postDataInput = {
            User: {
              EmployeeId: this.userInfo.EmployeeId
            },
            RLSViewDealInput: {
              StartRowNumber:
                childActionRecieved.filterData.isApplyFilter == true
                  ? 1
                  : this.pageNo,
              PageName: "MyDeals.aspx",
              PageSize: "50",
              SBUCode: "",
              Vertical: "",
              VerticalCode: "",
              FilterBy: "",
              FilterLike: ""
            },
            spParams: {},
            SearchFilter: {
              SearchText: "",
              FilterByPropertyName: "",
              SearchTextOnColumn: ""
            }
          };
          childActionRecieved.filterData.order.map((x, i) => {
            i != 0 ? postData.push("|||") : "";
            switch (x) {
              case "dealName":
                childActionRecieved.filterData.filterColumn.dealName.map(
                  (x, index) => {
                    index == 0
                      ? postData.push("DealHeaderName!!!" + x.name)
                      : postData.push(x.name);
                  }
                );
                break;
              case "creation":
                childActionRecieved.filterData.filterColumn.creation.map(
                  (x, index) => {
                    index == 0
                      ? postData.push("DealCreatedDate!!!" + x.name)
                      : postData.push(x.name);
                  }
                );
                break;
              case "clName":
                childActionRecieved.filterData.filterColumn.clName.map(
                  (x, index) => {
                    index == 0
                      ? postData.push("CustomerName!!!" + x.name)
                      : postData.push(x.name);
                  }
                );
                break;
              case "sbu":
                childActionRecieved.filterData.filterColumn.sbu.map(
                  (x, index) => {
                    index == 0
                      ? postData.push("SBUName!!!" + x.name)
                      : postData.push(x.name);
                  }
                );
                break;
              case "vertical":
                childActionRecieved.filterData.filterColumn.vertical.map(
                  (x, index) => {
                    index == 0
                      ? postData.push("VerticalName!!!" + x.name)
                      : postData.push(x.name);
                  }
                );
                break;
              case "dealCurr":
                childActionRecieved.filterData.filterColumn.dealCurr.map(
                  (x, index) => {
                    index == 0
                      ? postData.push("DealCurrency!!!" + x.name)
                      : postData.push(x.name);
                  }
                );
                break;
              case "type":
                childActionRecieved.filterData.filterColumn.type.map(
                  (x, index) => {
                    index == 0
                      ? postData.push("TypeofDeal!!!" + x.name)
                      : postData.push(x.name);
                  }
                );
                break;
              case "status":
                childActionRecieved.filterData.filterColumn.status.map(
                  (x, index) => {
                    index == 0
                      ? postData.push("DealStatus!!!" + x.name)
                      : postData.push(x.name);
                  }
                );
                break;
              default:
                break;
            }
          });
          var str = postData.join();
          // var res = str.replace(",|||,", "|||");
          var res = str.split(",|||,").join("|||");
          postDataInput.SearchFilter.SearchText = res;
          this.searchSelectedText = res;
          console.log(str, "strstrstrstr");
          console.log(res, "resresresresresres");
          this.getRLSListSearch(postDataInput);
        }
        break;
      }
      case actionRequired.action == "sortHeaderBy": {
        console.log(childActionRecieved, "childActionRecieved");
        this.sort = {
          order: childActionRecieved.filterData.sortOrder,
          value: childActionRecieved.filterData.sortColumn
        };
        let postData = {
          User: {
            EmployeeId: this.userInfo.EmployeeId
          },
          RLSViewDealInput: {
            StartRowNumber: 1,
            PageName: "MyDeals.aspx",
            PageSize: "50",
            SBUCode: "",
            Vertical: "",
            VerticalCode: "",
            FilterBy: "",
            FilterLike: ""
          },
          spParams: {},
          SearchFilter: {
            SearchText: "",
            FilterByPropertyName: "",
            SearchTextOnColumn: "",
            SortByPropertyName:
              childActionRecieved.filterData.sortOrder == true
                ? childActionRecieved.filterData.sortColumn == "pid"
                  ? "PricingId ASC"
                  : childActionRecieved.filterData.sortColumn == "oaid"
                  ? "TraceOppId ASC"
                  : childActionRecieved.filterData.sortColumn == "dealName"
                  ? "DealHeaderName ASC"
                  : childActionRecieved.filterData.sortColumn == "clName"
                  ? "CustomerName ASC"
                  : childActionRecieved.filterData.sortColumn == "sbu"
                  ? "SBUName ASC"
                  : childActionRecieved.filterData.sortColumn == "vertical"
                  ? "VerticalName ASC"
                  : childActionRecieved.filterData.sortColumn == "dealCurr"
                  ? "DealCurrency ASC"
                  : childActionRecieved.filterData.sortColumn == "type"
                  ? "TypeofDeal ASC"
                  : childActionRecieved.filterData.sortColumn == "status"
                  ? "DealStatus ASC"
                  : childActionRecieved.filterData.sortColumn == "creation"
                  ? "CreatedDate ASC"
                  : null
                : childActionRecieved.filterData.sortColumn == "dealName"
                ? "DealHeaderName DESC"
                : childActionRecieved.filterData.sortColumn == "clName"
                ? "CustomerName DESC"
                : childActionRecieved.filterData.sortColumn == "sbu"
                ? "SBUName DESC"
                : childActionRecieved.filterData.sortColumn == "vertical"
                ? "VerticalName DESC"
                : childActionRecieved.filterData.sortColumn == "dealCurr"
                ? "DealCurrency DESC"
                : childActionRecieved.filterData.sortColumn == "type"
                ? "TypeofDeal DESC"
                : childActionRecieved.filterData.sortColumn == "status"
                ? "DealStatus DESC"
                : childActionRecieved.filterData.sortColumn == "creation"
                ? "CreatedDate DESC"
                : childActionRecieved.filterData.sortColumn == "pid"
                ? "PricingId DESC"
                : childActionRecieved.filterData.sortColumn == "oaid"
                ? "TraceOppId DESC"
                : null
          }
        };
        this.getRLSListSearch(postData);
        break;
      }
      default:
        return;
    }
  }
  sort: any=
  {
    order:false,
    value : ""
  };
  getRLSListSearch(postData) {
    console.log(postData, "storedatastoredata");
    console.log(
      postData.RLSViewDealInput,
      "storedatastoredata RLSViewDealInput"
    );

    this.paginationPageNo.PageSize = postData.pageCount;
    this.paginationPageNo.RequestedPageNumber = postData.pageNumber;
    this.deals.getRLSDropdownsNdata(postData).subscribe(
      res => {
        console.log(res);
        if (res.ReturnFlag == "S") {
          if (res.Output.ReturnFlag == "S") {
            this.isLoading = false;
            this.filterConfigData.isFilterLoading = false;
            if (res.Output.Message != "No Deals Found") {
              if (postData.RLSViewDealInput.StartRowNumber == 1) {
                let i = 1;
                res.Output.RLSViewDealList.map(res => {
                  res.index = i;
                  i = i + 1;
                });
                console.log("it is inside first");
              } else {
                const perPage = this.pageCount;
                const start = (this.pageNo - 1) * perPage + 1;
                let i = start;
                const end = start + perPage - 1;
                res.Output.RLSViewDealList.map(res => {
                  res.index = i;
                  i = i + 1;
                });
              }
              this.rlsDealTable = this.getMappedData(
                res.Output.RLSViewDealList
              );
              this.tableTotalCount = res.Output.totalRowCount;
            } else {
              this.isLoading = false;
              this.rlsDealTable = [{}];
              this.tableTotalCount = 0;
            }
          }
        } else {
          this.filterConfigData.isFilterLoading = false;
          this.isLoading = false;
          this.rlsDealTable = [{}];
          this.tableTotalCount = 0;
          this._error.throwError(
            "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
          );
        }
      },
      error => {
        this.isLoading = false;
        this.filterConfigData.isFilterLoading = false;
        this._error.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    );
  }
  getRlsDealNameMethod(filteredData) {
    console.log(filteredData, "filteredData");
    console.log(this.filterConfigData, "this.filterConfigData");
    console.log(
      this.searchSelectedText,
      "this.searchSelectedTextthis.searchSelectedText"
    );
    //let propertyName =
    let input = {
      User: {
        EmployeeId: this.userInfo.EmployeeId
      },
      RLSViewDealInput: {
        StartRowNumber: this.filterConfigData[
          filteredData.filterData.headerName
        ].PageNo,
        PageName: "MyDeals.aspx",
        PageSize: "50",
        SBUCode: "",
        Vertical: "",
        VerticalCode: "",
        FilterBy: "",
        FilterLike: ""
      },
      spParams: {},
      SearchFilter: {
        SearchText: this.searchSelectedText,
        FilterByPropertyName:
          filteredData.filterData.headerName == "dealName"
            ? "DealHeaderName"
            : filteredData.filterData.headerName == "clName"
            ? "CustomerName"
            : filteredData.filterData.headerName == "sbu"
            ? "SBUName"
            : filteredData.filterData.headerName == "vertical"
            ? "VerticalName"
            : filteredData.filterData.headerName == "dealCurr"
            ? "DealCurrency"
            : filteredData.filterData.headerName == "type"
            ? "TypeofDeal"
            : filteredData.filterData.headerName == "status"
            ? "DealStatus"
            : filteredData.filterData.headerName == "creation"
            ? "DealCreatedDate"
            : null,
        SearchTextOnColumn: filteredData.objectRowData
      }
    };
    this.deals.getRLSDropdownsNdata(input).subscribe(
      Res => {
        console.log(Res, "Res is coming here we go....");
        if (Res.ReturnFlag == "S") {
          if (Res.Output.ReturnFlag == "S") {
            this.filterConfigData.isFilterLoading = false;
            let responseOppData: [] = Res.Output.RLSViewDealList.map(x => {
              let obj = {
                id: x.PricingId,
                name: x.DealHeaderName,
                isDatafiltered: false
              };
              return obj;
            });
            responseOppData = this.deals.getUnique(responseOppData, "name");
            // let responsecreationData: [] = Res.Output.RLSViewDealList.map(x => {
            //   let obj = {
            //     id: x.RowNo,
            //     name: this.datePipe.transform(x.CreatedDate, "dd-MMM-yy"),
            //     isDatafiltered: false
            //   }
            //   return obj
            // })
            let responseclNameData: [] = Res.Output.RLSViewDealList.map(x => {
              let obj = {
                id: x.PricingId,
                name: x.CustomerName,
                isDatafiltered: false
              };
              return obj;
            });
            responseclNameData = this.deals.getUnique(
              responseclNameData,
              "name"
            );
            let responsesbuData: [] = Res.Output.RLSViewDealList.map(x => {
              let obj = {
                id: x.PricingId,
                name: x.SBUName,
                isDatafiltered: false
              };
              return obj;
            });
            responsesbuData = this.deals.getUnique(responsesbuData, "name");
            let responseverticalData: [] = Res.Output.RLSViewDealList.map(x => {
              let obj = {
                id: x.PricingId,
                name: x.VerticalName,
                isDatafiltered: false
              };
              return obj;
            });
            responseverticalData = this.deals.getUnique(
              responseverticalData,
              "name"
            );
            let responsedealCurrData: [] = Res.Output.RLSViewDealList.map(x => {
              let obj = {
                id: x.PricingId,
                name: x.DealCurrency,
                isDatafiltered: false
              };
              return obj;
            });
            responsedealCurrData = this.deals.getUnique(
              responsedealCurrData,
              "name"
            );
            let responsetypeData: [] = Res.Output.RLSViewDealList.map(x => {
              let obj = {
                id: x.PricingId,
                name: x.TypeofDeal,
                isDatafiltered: false
              };
              return obj;
            });
            responsetypeData = this.deals.getUnique(responsetypeData, "name");
            let responsestatusData: [] = Res.Output.RLSViewDealList.map(x => {
              let obj = {
                id: x.PricingId,
                name: x.Status,
                isDatafiltered: false
              };
              return obj;
            });
            responsestatusData = this.deals.getUnique(
              responsestatusData,
              "name"
            );
            console.log(responseOppData, "responseOppData");
            console.log(filteredData, "filteredDatafilteredData");
            if (filteredData.filterData.filterColumn.dealName.length > 0) {
              responseOppData.map((x: any) => {
                filteredData.filterData.filterColumn.dealName.map(y => {
                  x.id == y.id ? (x.isDatafiltered = y.isDatafiltered) : null;
                });
              });
            }
            // if (filteredData.filterData.filterColumn.creation.length > 0) {
            //   responsecreationData.map((x:any) => {
            //     filteredData.filterData.filterColumn.creation.map(y => {
            //       x.id == y.id ? x.isDatafiltered = y.isDatafiltered : null
            //     })
            //   })
            // }
            if (filteredData.filterData.filterColumn.clName.length > 0) {
              responseclNameData.map((x: any) => {
                filteredData.filterData.filterColumn.clName.map(y => {
                  x.id == y.id ? (x.isDatafiltered = y.isDatafiltered) : null;
                });
              });
            }

            if (filteredData.filterData.filterColumn.vertical.length > 0) {
              responseverticalData.map((x: any) => {
                filteredData.filterData.filterColumn.vertical.map(y => {
                  x.id == y.id ? (x.isDatafiltered = y.isDatafiltered) : null;
                });
              });
            }

            if (filteredData.filterData.filterColumn.sbu.length > 0) {
              responsesbuData.map((x: any) => {
                filteredData.filterData.filterColumn.sbu.map(y => {
                  x.id == y.id ? (x.isDatafiltered = y.isDatafiltered) : null;
                });
              });
            }

            if (filteredData.filterData.filterColumn.dealCurr.length > 0) {
              responsedealCurrData.map((x: any) => {
                filteredData.filterData.filterColumn.dealCurr.map(y => {
                  x.id == y.id ? (x.isDatafiltered = y.isDatafiltered) : null;
                });
              });
            }

            if (filteredData.filterData.filterColumn.type.length > 0) {
              responsetypeData.map((x: any) => {
                filteredData.filterData.filterColumn.type.map(y => {
                  x.id == y.id ? (x.isDatafiltered = y.isDatafiltered) : null;
                });
              });
            }

            if (filteredData.filterData.filterColumn.status.length > 0) {
              responsestatusData.map((x: any) => {
                filteredData.filterData.filterColumn.status.map(y => {
                  x.id == y.id ? (x.isDatafiltered = y.isDatafiltered) : null;
                });
              });
            }

            if (filteredData.action == "loadMoreFilterData") {
              responseOppData.map(x =>
                this.filterConfigData.dealName.data.push(x)
              );
              this.filterConfigData.dealName.data = this.deals.getUnique(
                this.filterConfigData.dealName.data,
                "name"
              );
              this.filterConfigData.dealName.recordCount =
                Res.Output.totalRowCount;
              // responsecreationData.map(x => this.filterConfigData.creation.data.push(x));
              // this.filterConfigData.creation.recordCount = Res.Output.totalRowCount;
              responseclNameData.map(x =>
                this.filterConfigData.clName.data.push(x)
              );
              this.filterConfigData.clName.data = this.deals.getUnique(
                this.filterConfigData.clName.data,
                "name"
              );
              this.filterConfigData.clName.recordCount =
                Res.Output.totalRowCount;
              responseverticalData.map(x =>
                this.filterConfigData.vertical.data.push(x)
              );
              this.filterConfigData.vertical.data = this.deals.getUnique(
                this.filterConfigData.vertical.data,
                "name"
              );
              this.filterConfigData.vertical.recordCount =
                Res.Output.totalRowCount;
              responsesbuData.map(x => this.filterConfigData.sbu.data.push(x));
              this.filterConfigData.sbu.data = this.deals.getUnique(
                this.filterConfigData.sbu.data,
                "name"
              );
              this.filterConfigData.sbu.recordCount = Res.Output.totalRowCount;
              responsedealCurrData.map(x =>
                this.filterConfigData.dealCurr.data.push(x)
              );
              this.filterConfigData.dealCurr.data = this.deals.getUnique(
                this.filterConfigData.dealCurr.data,
                "name"
              );
              this.filterConfigData.dealCurr.recordCount =
                Res.Output.totalRowCount;
              responsetypeData.map(x =>
                this.filterConfigData.type.data.push(x)
              );
              this.filterConfigData.type.data = this.deals.getUnique(
                this.filterConfigData.type.data,
                "name"
              );
              this.filterConfigData.type.recordCount = Res.Output.totalRowCount;
              responsestatusData.map(x =>
                this.filterConfigData.status.data.push(x)
              );
              this.filterConfigData.status.data = this.deals.getUnique(
                this.filterConfigData.status.data,
                "name"
              );
              this.filterConfigData.status.recordCount =
                Res.Output.totalRowCount;
              console.log(this.filterConfigData, "this.filterConfigData123");
            } else {
              this.filterConfigData.dealName.data = responseOppData;
              this.filterConfigData.dealName.recordCount =
                Res.Output.totalRowCount;
              // this.filterConfigData.creation.data = responsecreationData;
              // this.filterConfigData.creation.recordCount = Res.Output.totalRowCount;
              this.filterConfigData.clName.data = responseclNameData;
              this.filterConfigData.clName.recordCount =
                Res.Output.totalRowCount;
              this.filterConfigData.vertical.data = responseverticalData;
              this.filterConfigData.vertical.recordCount =
                Res.Output.totalRowCount;
              this.filterConfigData.sbu.data = responsesbuData;
              this.filterConfigData.sbu.recordCount = Res.Output.totalRowCount;
              this.filterConfigData.dealCurr.data = responsedealCurrData;
              this.filterConfigData.dealCurr.recordCount =
                Res.Output.totalRowCount;
              this.filterConfigData.type.data = responsetypeData;
              this.filterConfigData.type.recordCount = Res.Output.totalRowCount;
              this.filterConfigData.status.data = responsestatusData;
              this.filterConfigData.status.recordCount =
                Res.Output.totalRowCount;
              console.log(this.filterConfigData, "this.filterConfigData");
            }
          } else {
            this.isLoading = false;
            this._error.throwError(
              "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
            );
          }
        } else {
          this.isLoading = false;
          this._error.throwError(
            "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
          );
        }
      },
      error => {
        this.isLoading = false;
        this._error.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    );
  }

  pagination(event) {
    console.log(event);
    switch (event.action) {
      case "pagination": {
         event.filterData.sortOrder = this.sort.order?this.sort.order : false;
         event.filterData.sortColumn = this.sort.value ? this.sort.value : "";
        if (event.filterData.order.length == 0) {
          this.paginationPageNo.RequestedPageNumber = event.currentPage;
          this.paginationPageNo.PageSize = event.itemsPerPage;
          let rlsData = {
            User: {
              EmployeeId: this.userInfo.EmployeeId
            },
            RLSViewDealInput: {
              StartRowNumber: 1,
              PageName: "MyDeals.aspx",
              PageSize: "50",
              SBUCode: "",
              Vertical: "",
              VerticalCode: "",
              FilterBy: "0",
              FilterLike: ""
            },
            spParams: {},
            SearchFilter: {
              SearchTextOnColumn: "",
              FilterByPropertyName: "",
              SortByPropertyName:
                event.filterData.sortOrder == true
                  ? event.filterData.sortColumn == "pid"
                    ? "PricingId ASC"
                    : event.filterData.sortColumn == "oaid"
                    ? "TraceOppID ASC"
                    : event.filterData.sortColumn == "dealName"
                    ? "DealHeaderName ASC"
                    : event.filterData.sortColumn == "clName"
                    ? "CustomerName ASC"
                    : event.filterData.sortColumn == "sbu"
                    ? "SBUName ASC"
                    : event.filterData.sortColumn == "vertical"
                    ? "VerticalName ASC"
                    : event.filterData.sortColumn == "dealCurr"
                    ? "DealCurrency ASC"
                    : event.filterData.sortColumn == "type"
                    ? "TypeofDeal ASC"
                    : event.filterData.sortColumn == "status"
                    ? "DealStatus ASC"
                    : event.filterData.sortColumn == "creation"
                    ? "CreatedDate ASC"
                    : null
                  : event.filterData.sortColumn == "dealName"
                  ? "DealHeaderName DESC"
                  : event.filterData.sortColumn == "clName"
                  ? "CustomerName DESC"
                  : event.filterData.sortColumn == "sbu"
                  ? "SBUName DESC"
                  : event.filterData.sortColumn == "vertical"
                  ? "VerticalName DESC"
                  : event.filterData.sortColumn == "dealCurr"
                  ? "DealCurrency DESC"
                  : event.filterData.sortColumn == "type"
                  ? "TypeofDeal DESC"
                  : event.filterData.sortColumn == "pid"
                  ? "PricingId DESC"
                  : event.filterData.sortColumn == "oaid"
                  ? "TraceOppID DESC"
                  : event.filterData.sortColumn == "status"
                  ? "DealStatus DESC"
                  : event.filterData.sortColumn == "creation"
                  ? "CreatedDate DESC"
                  : null
            }
          };

          rlsData.RLSViewDealInput.PageSize = event.itemsPerPage;
          // rlsData.RLSViewDealInput.StartRowNumber =
          //   Number(this.rlsDealTable[this.rlsDealTable.length - 1].rowNumber) + 1;
          rlsData.RLSViewDealInput.StartRowNumber = event.currentPage;
          console.log("Cheeck", this.dealjson.rlsviewinput);
          console.log("this.rlsDealTable", this.rlsDealTable);
          console.log("rlsData rlsData", rlsData);
          this.getSearchnPaginationData(rlsData);
          return of("Search Trigger");
        } else {
          this.pageNo = event.currentPage;
          this.pageCount = event.itemsPerPage;
          var postData = [];
          let postDataInput = {
            User: {
              EmployeeId: this.userInfo.EmployeeId
            },
            RLSViewDealInput: {
              StartRowNumber: this.pageNo,
              PageName: "MyDeals.aspx",
              PageSize: this.pageCount,
              SBUCode: "",
              Vertical: "",
              VerticalCode: "",
              FilterBy: "",
              FilterLike: ""
            },
            spParams: {},
            SearchFilter: {
              SearchText: "",
              FilterByPropertyName: "",
              SearchTextOnColumn: "",
              SortByPropertyName:
                event.filterData.sortOrder == true
                  ? event.filterData.sortColumn == "pid"
                    ? "PricingId ASC"
                    : event.filterData.sortColumn == "oaid"
                    ? "TraceOppID ASC"
                    : event.filterData.sortColumn == "dealName"
                    ? "DealHeaderName ASC"
                    : event.filterData.sortColumn == "clName"
                    ? "CustomerName ASC"
                    : event.filterData.sortColumn == "sbu"
                    ? "SBUName ASC"
                    : event.filterData.sortColumn == "vertical"
                    ? "VerticalName ASC"
                    : event.filterData.sortColumn == "dealCurr"
                    ? "DealCurrency ASC"
                    : event.filterData.sortColumn == "type"
                    ? "TypeofDeal ASC"
                    : event.filterData.sortColumn == "status"
                    ? "DealStatus ASC"
                    : event.filterData.sortColumn == "creation"
                    ? "CreatedDate ASC"
                    : null
                  : event.filterData.sortColumn == "dealName"
                  ? "DealHeaderName DESC"
                  : event.filterData.sortColumn == "clName"
                  ? "CustomerName DESC"
                  : event.filterData.sortColumn == "sbu"
                  ? "SBUName DESC"
                  : event.filterData.sortColumn == "vertical"
                  ? "VerticalName DESC"
                  : event.filterData.sortColumn == "dealCurr"
                  ? "DealCurrency DESC"
                  : event.filterData.sortColumn == "pid"
                  ? "PricingId DESC"
                  : event.filterData.sortColumn == "oaid"
                  ? "TraceOppID DESC"
                  : event.filterData.sortColumn == "type"
                  ? "TypeofDeal DESC"
                  : event.filterData.sortColumn == "status"
                  ? "DealStatus DESC"
                  : event.filterData.sortColumn == "creation"
                  ? "CreatedDate DESC"
                  : null
            }
          };
          event.filterData.order.map((x, i) => {
            i != 0 ? postData.push("|||") : "";
            switch (x) {
              case "dealName":
                event.filterData.filterColumn.dealName.map((x, index) => {
                  index == 0
                    ? postData.push("DealHeaderName!!!" + x.name)
                    : postData.push(x.name);
                });
                break;
              case "creation":
                event.filterData.filterColumn.creation.map((x, index) => {
                  index == 0
                    ? postData.push("DealCreatedDate!!!" + x.name)
                    : postData.push(x.name);
                });
                break;
              case "clName":
                event.filterData.filterColumn.clName.map((x, index) => {
                  index == 0
                    ? postData.push("CustomerName!!!" + x.name)
                    : postData.push(x.name);
                });
                break;
              case "sbu":
                event.filterData.filterColumn.sbu.map((x, index) => {
                  index == 0
                    ? postData.push("SBUName!!!" + x.name)
                    : postData.push(x.name);
                });
                break;
              case "vertical":
                event.filterData.filterColumn.vertical.map((x, index) => {
                  index == 0
                    ? postData.push("VerticalName!!!" + x.name)
                    : postData.push(x.name);
                });
                break;
              case "dealCurr":
                event.filterData.filterColumn.dealCurr.map((x, index) => {
                  index == 0
                    ? postData.push("DealCurrency!!!" + x.name)
                    : postData.push(x.name);
                });
                break;
              case "type":
                event.filterData.filterColumn.type.map((x, index) => {
                  index == 0
                    ? postData.push("TypeofDeal!!!" + x.name)
                    : postData.push(x.name);
                });
                break;
              case "status":
                event.filterData.filterColumn.status.map((x, index) => {
                  index == 0
                    ? postData.push("DealStatus!!!" + x.name)
                    : postData.push(x.name);
                });
                break;
              default:
                break;
            }
          });
          var str = postData.join();
          // var res = str.replace(",|||,", "|||");
          var res = str.split(",|||,").join("|||");
          postDataInput.SearchFilter.SearchText = res;
          this.searchSelectedText = res;
          console.log(str, "strstrstrstr");
          console.log(res, "resresresresresres");
          this.getRLSListSearch(postDataInput);
        }
      }
    }
  }
  getSearchnPaginationData(rlsData) {
    console.log(rlsData, "rlsDatarlsData");
    console.log(this.paginationPageNo, "this.paginationPageNo");
    this.isLoading = true;
    this.isSearched = true;
    this.deals.getRLSDropdownsNdata(rlsData).subscribe(
      res => {
        console.log("Response: ", res);
        if (res) {
          this.isLoading = false;
          console.log("RES", res);
          if (res.ReturnFlag == "S") {
            const perPage = this.paginationPageNo.PageSize;
            const start =
              (this.paginationPageNo.RequestedPageNumber - 1) * perPage + 1;
            let i = start;
            const end = start + perPage - 1;
            console.log(start + " - " + end);
            let spliceArray = [];
            if (res.Output.totalRowCount > 0) {
              res.Output.RLSViewDealList.map(res => {
                if (!res.index) {
                  res.index = i;
                  i = i + 1;
                }
              });
              this.rlsDealTable.map(res => {
                if (res.index >= start && res.index <= end) {
                  spliceArray.push(res);
                }
              });
              spliceArray.map(res => {
                this.rlsDealTable.splice(this.rlsDealTable.indexOf(res), 1);
              });
            }

            console.log("Hello :");
            if (res.Output.totalRowCount > 0) {
              if (res.Output.RLSViewDealList.length > 0) {
                this.rlsDealTable = this.rlsDealTable.concat(
                  this.getMappedData(res.Output.RLSViewDealList)
                );
                this.tableTotalCount = res.Output.totalRowCount;
              } else {
                this.rlsDealTable = [{}];
                this.tableTotalCount = 0;
              }
            } else {
              this.rlsDealTable = [{}];
              this.tableTotalCount = 0;
            }
            console.log("Table data: ", spliceArray);
          } else {
            this._error.throwError(res.ReturnMessage);
            console.log("Failure", res.ReturnMessage);
          }
        }
      },
      error => {
        this.isLoading = false;
        this._error.throwError(error);
        console.log("Error", error);
      }
    );
  }
  searchBtn() {
    console.log("Search button");
    if (
      this._validate.validate(this.sbuCode) ||
      this._validate.validate(this.verticalcode)
    ) {
      this.paginationPageNo.RequestedPageNumber = 1
      this.rlsDealTable = []
      this.RlSearch();
    }
  }

  resetDeal() {
    this.searchText = "";
    this.filterby = "";
    this.verticalcode = "";
    this.sbuCode = "";
    this.ngOnInit();
  }

  RlSReset() {
    console.log("clicked on reset");
    if (this.isSearched) {
      let rlsData = {
        User: {
          EmployeeId: this.userInfo.EmployeeId
        },
        RLSViewDealInput: {
          StartRowNumber: 1,
          PageName: "MyDeals.aspx",
          PageSize: "50",
          SBUCode: "",
          Vertical: "",
          VerticalCode: "",
          FilterBy: "",
          FilterLike: ""
        },
        spParams: {}
      };
      rlsData.RLSViewDealInput.FilterBy = "";
      rlsData.RLSViewDealInput.FilterLike = "";
      rlsData.RLSViewDealInput.SBUCode = "";
      rlsData.RLSViewDealInput.VerticalCode = "";
      rlsData.RLSViewDealInput.StartRowNumber = 1;
      this.filterby = "";
      this.searchText = "";
      this.sbuCode = "";
      this.verticalcode = "";
      this.getSearchnPaginationData(rlsData);
    }
  }
  getMappedData(response) {
    console.log(response, "getMappedData response...");
    if (response.length > 0) {
      let Output = [];
      response.map(x => {
        let obj = {
          id: x.DealHeaderID || "NA",
          dealName: x.DealHeaderName || "NA",
          creation: this._validate.validate(x.CreatedDate)
            ? this.datePipe.transform(x.CreatedDate, "dd-MMM-yyyy")
            : "NA",
          oaid: x.TraceOppID || "NA",
          pid: x.PricingId || "NA",
          clName: x.CustomerName || "NA",
          sbu: x.SBUName || "NA",
          vertical: x.VerticalName || "NA",
          dealCurr: x.DealCurrency || "NA",
          type: x.TypeofDeal || "NA",
          status: x.Status || "NA",
          rowNumber: x.RowNo,
          isCheccked: false,
          isExpanded: false,
          index: x.index ? x.index : null
        };
        Output.push(obj);
      });
      console.log(Output, "output...");
      return Output;
    } else {
      return [{}];
    }
  }
  ngOnDestroy() {
    this.rlsViewData$.unsubscribe();
  }
}
