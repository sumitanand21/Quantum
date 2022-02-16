import { Component, OnInit, Inject } from "@angular/core";
import { dealService } from "@app/core/services/deals.service";
import { Router } from "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Observable, of, Subscription } from "rxjs";
import { Store, select } from "@ngrx/store";
import { AppState } from "@app/core/state";
import {
  ExistingListAction,
  DealOverViewAction,
  DealParameterListAction,
  calculateDeals,
  RLSListAction,
  PassthroughListAction,
  ModuleListAction,
  DealCoOwnerListAction,
  MilestoneAction
} from "@app/core/state/actions/deals.actions";
import { existingDealsList } from "@app/core/state/selectors/deals/existing-deals.selectors";
import { EncrDecrService } from "@app/core/services/encr-decr.service";
import { ValidateforNullnUndefined } from "@app/core/services/validateforNULLorUndefined.service";
import { ErrorMessage } from "@app/core/services/error.services";
import { OnlineOfflineService } from "@app/core";
import { MessageService } from "@app/core/services/deals/deals-observables.service";
import { DatePipe } from "@angular/common";
import { NewDocStatusService } from "@app/core/services/datacomm/data-comm.service";
import { DateModifier } from "@app/core/services/date-modifier";
@Component({
  selector: "app-existing-deals",
  templateUrl: "./existing-deals.component.html",
  styleUrls: ["./existing-deals.component.scss"]
})
export class ExistingDealsComponent implements OnInit {
  existingTable: any = [];
  isLoading: boolean = false;
  userInfo: any;
  roleSubcriber$: Subscription = new Subscription();
  tableTotalCount: number = 0;
  TabListExist: any = [
    {
      // GroupLabel: "System views",
      GroupData: [
        {
          id: "1",
          title: "My active deals"
        },
        {
          id: "2",
          title: "Past deals"
        },
        {
          id: "3",
          title: "RLS view"
        }
      ]
    }
  ];
  filterConfigData = {
    pricingId: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    dealName: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    oppID: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    status: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    createDate: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    curency: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    TCV_currency: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    om: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    vertical: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    account: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    dealOwner: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    isFilterLoading: true
  };
  paginationPageNo = {
    PageSize: 50,
    RequestedPageNumber: this.deals.existingdealsPageno || 1,
    OdatanextLink: "",
    FilterData: this.deals.existingdealConfigData || []
  };
  mainArray: any[];
  RoleArray: any = [];
  SearchText: any = "";
  constructor(
    private deals: dealService,
    private router: Router,
    private onlineOfflineService: OnlineOfflineService,
    public _error: ErrorMessage,
    private _validate: ValidateforNullnUndefined,
    private encrDecrService: EncrDecrService,
    public dialog: MatDialog,
    public store: Store<AppState>,
    public messageService: MessageService,
    private datePipe: DatePipe,
    public newDocStatusService: NewDocStatusService
  ) {
    this.roleSubcriber$ = this.messageService.getRole().subscribe(Res => {
      if (Res) {
        this.RoleArray = Res;
        this.RoleArray.map(x => {
          if (x.ControlName == "btnRLSViewTab") {
            if (!x.InVisible) {
              this.TabListExist[0].GroupData.splice(2, 1);
            }
          }
        });
      }
    });
  }

  async ngOnInit() {
    this.deals.existingdealConfigData = [];
    this.clearMessage();
    sessionStorage.removeItem("getFillManageParameters");
    sessionStorage.removeItem("EmployeeList");
    let userInfo = this.encrDecrService.get(
      "EncryptionEncryptionEncryptionEn",
      sessionStorage.getItem("userInfo"),
      "DecryptionDecrip"
    );
    this.userInfo = JSON.parse(userInfo);
    console.log("User info-->", this.userInfo);
    this.store.dispatch(new DealOverViewAction({ dealoverview: undefined }));
    this.store.dispatch(
      new DealParameterListAction({ dealparameterList: undefined })
    );
    this.store.dispatch(new ModuleListAction({ ModuleList: undefined }));
    this.store.dispatch(
      new DealCoOwnerListAction({ dealCoOwnersList: undefined })
    );
    this.store.dispatch(new calculateDeals({ calculateDeal: undefined }));
    this.store.dispatch(new RLSListAction({ rlslist: undefined }));
    this.store.dispatch(
      new PassthroughListAction({ passthroughlist: undefined })
    );
    this.store.dispatch(
      new MilestoneAction({
        Milestone: undefined,
        leadtime: undefined,
        dsodays: undefined
      })
    );
    this.store.pipe(select(existingDealsList)).subscribe(
      async res => {
        console.log("Existing deals", res);
        if (res.existingDeals != undefined) {
          if (res.existingDeals.length > 0) {
            console.log("From state", res);
            this.mainArray = this.getMappedData(res.existingDeals);

            this.existingTable = this.getMappedData(res.existingDeals);
            this.tableTotalCount = this.existingTable.length;
          } else {
            this.mainArray = [];
            this.existingTable = [{}];
            this.tableTotalCount = 0;
          }
        } else {
          this.getExistingdeals();
        }
      },
      error => {
        console.log("Error", error);
        if (this.onlineOfflineService.isOnline) {
          this.getExistingdeals();
        }
      }
    );
    if (!this.onlineOfflineService.isOnline) {
      const CacheResponse = await this.deals.getExistingDealsCacheData();
      console.log("CacheResponse-->", CacheResponse);
      if (CacheResponse) {
        this.isLoading = true;
        if (CacheResponse.data.length > 0) {
          this.isLoading = false;
          this.mainArray = this.getMappedData(CacheResponse.data);
          this.existingTable = this.getMappedData(CacheResponse.data);
          this.tableTotalCount = this.existingTable.length;
        } else {
          this.isLoading = false;
          this.getExistingdeals();
        }
      } else {
        this.getExistingdeals();
      }
    }
  }

  clearMessage() {
    // clear message
    this.messageService.clearMessage();
  }

  getExistingdeals() {
    this.isLoading = true;
    var inputData = {
      User: {
        EmployeeId: this.userInfo.EmployeeId
      },
      Params: {
        MaxCount: "500"
      },
      Items: [],
      spParams: {}
    };
    this.deals.getExistingDeals(inputData).subscribe(
      res => {
        if (res) {
          this.isLoading = false;
          if (res.ReturnCode == "S") {
            if (res.Output.DealList) {
              this.existingTable = this.getMappedData(res.Output.DealList);
              console.log(this.existingTable);
              this.store.dispatch(
                new ExistingListAction({
                  existingDealslist: res.Output.DealList
                })
              );
              this.tableTotalCount = res.Output.DealList.length;
            }
          } else {
            this._error.throwError(res.ReturnMessage);
            this.existingTable = [{}];
          }
        } else {
          this._error.throwError(
            "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
          );
          this.isLoading = false;
          this.existingTable = [{}];
        }
      },
      error => {
        this.isLoading = false;
        this._error.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
        console.log("Error-->", error);
      }
    );
  }
  // table selector event emitters

  performTableChildAction(childActionRecieved): Observable<any> {
    var actionRequired = childActionRecieved;
    console.log(actionRequired);
    switch (actionRequired.action) {
      case "pricingId": {
        let encryptData = this.encrDecrService.set(
          "EncryptionEncryptionEncryptionEn",
          JSON.stringify(actionRequired.objectRowData[0]),
          "DecryptionDecrip"
        );
        sessionStorage.setItem(
          "DealName",
          actionRequired.objectRowData[0].dealName
        );
        // sessionStorage.setItem('Dealoverview', JSON.stringify({ "UserInfo": { "EmpName": "Jyoti Joydeb Sen", "AdId": "JYSEN", "EmpEmail": "jyoti.sen@wipro.com", "EmpID": "340772", "EmpNo": "340772" }, "MasterData": { "PricingId": "", "TraceOppId": "", "DealId": "99284", "DealHeaderNumber": "", "DealVersionId": "", "DealHeaderName": "", "DOEmailId": "jaison.s171@wipro.com", "ModuleCount": "", "ModuleOwnerEmailId": "", "ModuleBFMEmailId": "", "ModulePSPOCEmailId": "", "ModuleId": "", "ModuleVersionId": "", "ModuleName": "", "ModuleStatusCode": "", "OptionId": "", "OptionNumber": "", "OptionName": "", "OptionVersionId": "", "OptionStatusCode": "", "RLSId": "", "RLSVersionId": "", "SourcePage": "", "MachineIp": "10.20.40.15", "GroupCode": "", "RoleId": "", "CurrencyCode": "", "MsaRequired": "0" } }))
        sessionStorage.setItem("Dealoverview", encryptData);
        this.deals.existingdealsPageno = actionRequired.pageData.currentPage;
        this.deals.existingdealConfigData =
          actionRequired.configData.filterData;
        // do not delete this need it for proposal
        this.newDocStatusService.setBehaviorView(true);
        // .do not delete this need it for proposal
        this.messageService.sendPastDealEnable({originUrl: this.router.url})
        this.router.navigateByUrl("/deals/existingTabs/overview");
        return;
      }
      case "search": {
        if(childActionRecieved.filterData.globalSearch.match(/[!@#$%^&*(),.?":{}|<>/]/g)) {

          this.existingTable=[{}];   // optional

          return;

        }

        if (actionRequired.objectRowData != "") {
          let searchedData;
          if (childActionRecieved.filterData.order.length == 0) {
            searchedData = this.Globalsearch(
              childActionRecieved.filterData.globalSearch,
              this.mainArray
            );
          } else {
            searchedData = this.Globalsearch(
              childActionRecieved.filterData.globalSearch,
              this.existingTable
            );
          }
          console.log("Searched Data", searchedData);
          for (let i = 0; i < searchedData.length; i++) {
            console.log("index", i, searchedData[i]);
            searchedData[i].index = i + 1;
          }
          console.log("After Data", searchedData);
          if (searchedData.length > 0) {
            this.existingTable = searchedData;
             this.tableTotalCount = this.existingTable.length;
          } else {
            this.existingTable = [{}];
            this.tableTotalCount=this.existingTable.length-1;
          }
          // console.log('Searched Data', this.existingTable);
        } else {
          this.SearchText = "";
          if (childActionRecieved.filterData.order.length == 0) {
            this.existingTable = this.mainArray;
            this.tableTotalCount = this.existingTable.length;
          } else {
            this.applyFilter(actionRequired);
            this.tableTotalCount = this.existingTable.length;
          }
        }

        return;
      }
      case "ACCEPT": {
        let encryptData = this.encrDecrService.set(
          "EncryptionEncryptionEncryptionEn",
          actionRequired.objectRowData.rowData.oppID,
          "DecryptionDecrip"
        );
        // sessionStorage.setItem('OppId', JSON.stringify(actionRequired.objectRowData.rowData.oppID));
        sessionStorage.setItem("OppId", encryptData);
        this.deals.existingdealsPageno = actionRequired.pageData.currentPage;
        this.deals.existingdealConfigData =
          actionRequired.configData.filterData;
        this.router.navigateByUrl("/deals/taggedSummary");
        return;
      }
      case "tabNavigation": {
        console.log("tab navigation--->", actionRequired);
        this.openCreate(actionRequired);
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
              this.existingTable = searchedData;

              if (childActionRecieved.filterData.order.length > 0) {
                childActionRecieved.filterData.order.map(x => {
                  let filteredarray = [];
                  let currentData = this.existingTable;
                  childActionRecieved.filterData.filterColumn[x].map(y => {
                    if (x == "createDate") {
                      let response: any = this.deals.getFilteredDateArrayList(
                        name,
                        currentData,
                        y
                      );
                      console.log("response-->", response);
                      filteredarray = response;
                    } else {
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
                    }
                  });

                  filteredarray = this.deals.getUnique(
                    filteredarray,
                    "pricingId"
                  );
                  if (filteredarray.length > 0) {
                    this.existingTable = filteredarray;
                    this.tableTotalCount = this.existingTable.length;
                  } else {
                    this.existingTable = [{}];
                    this.tableTotalCount = 0;
                  }
                });
              } else {
                this.existingTable = searchedData;
                this.tableTotalCount = this.existingTable.length;
              }
            }
          }
        }
        return;
      }
      case "columnSearchFilter": {
        console.log(childActionRecieved);
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
        let currentData = JSON.parse(JSON.stringify(this.existingTable));
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
        this.existingTable = sortedArray;
        this.tableTotalCount = this.existingTable.length;
        return;
      }
      case "ClearAllFilter": {
        this.existingTable = this.mainArray.filter(x => x);
        this.tableTotalCount = this.existingTable.length;
        return;
      }
    }
  }
  //Apply filter
  applyFilter(childActionRecieved) {
    console.log("childAction-->", childActionRecieved);
    this.existingTable = this.mainArray;
    if (childActionRecieved.filterData.order.length > 0) {
      childActionRecieved.filterData.order.map(name => {
        let filteredarray = [];
        let myarray = this.existingTable;

        childActionRecieved.filterData.filterColumn[name].map(y => {
          if (name == "createDate") {
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
        filteredarray = this.deals.getUnique(filteredarray, "pricingId");
        if (filteredarray.length > 0) {
          let i = 1;
          filteredarray.map(x => {
            x.index = i;
            i = i + 1;
          });
          this.existingTable = filteredarray;
          this.tableTotalCount = this.existingTable.length;
        } else {
          this.existingTable = [{}];
          this.tableTotalCount = this.existingTable.length-1;
        }
      });
    } else {
      this.existingTable = this.mainArray;
      this.tableTotalCount = this.existingTable.length;
    }
  }
  // Navigate between the page
  navigatePage(actionRequired) {
    this.deals.existingdealsPageno = actionRequired.pageData.currentPage;
    this.deals.existingdealConfigData = actionRequired.configData.filterData;
    if (actionRequired.objectRowData.id == 2) {
      this.router.navigate(["/deals/pastDeal"]);
    } else if (actionRequired.objectRowData.id == 3) {
      this.router.navigate(["/deals/rlsView"]);
    }
  }
  //Confirmation popup for navigating from one page to another
  openCreate(actionRequired) {
    console.log("data from the create popup-->", actionRequired);
    const dialogRef = this.dialog.open(cancelConfirmationComponent, {
      width: "396px",
      data: actionRequired
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.navigatePage(actionRequired);
      } else {
        return false;
      }
    });
  }

  Globalsearch(searchKey: string, collections?: Array<object>): any {
    // copy all objects of original array into new array of objects
    let filteredarray = [];
    // args are the compare oprators provided in the *ngFor directive

    // let filterkey = Object.keys(filterobj)[0];
    // let filtervalue =[searchKey];
    collections.forEach(function(objectToFilter:any) {
      let rowData = [];
      for (var prop in objectToFilter) {
        objectToFilter.DealOwnerEmailId ="";
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

      // if (!rowData.some(x => x == searchKey) && searchKey != "") {
      //   // object didn't match a filter value so remove it from array via filter
      //   returnobjects = returnobjects.filter(obj => obj !== objectToFilter);
      // }
    });
    // console.log('Array', filteredarray)
    return filteredarray;
  }
  /*Map API reponse*/
  getMappedData(response) {
    console.log(response, "response...");
    if (response) {
      if (response.length > 0) {
        let Output = [];
        let indexId = 1;
        response.map(x => {
          let obj = {
            id: this._validate.validate(x.DealHeaderID) ? x.DealHeaderID : "NA",
            dealHeadernumber: this._validate.validate(x.DealHeaderNumber)
              ? x.DealHeaderNumber
              : "NA",
            dealName: this._validate.validate(x.DealHeaderName)
              ? x.DealHeaderName
              : "NA",
            createDate: this._validate.validate(x.CreatedDate)
              ? this.getLocaleDateFormat(x.CreatedDate)
              : "NA",
            curency: this._validate.validate(x.DealCurrency)
              ? x.DealCurrency
              : "NA",
            TCV_currency: this._validate.validate(x.TCV) ? x.TCV : "NA",
            status: this._validate.validate(x.Status) ? x.Status : "NA",
            oppID: this._validate.validate(x.TraceOppID) ? x.TraceOppID : "NA",
            pricingId: this._validate.validate(x.PricingId)
              ? x.PricingId
              : "NA",
            om: this._validate.validate(x.OMPCTG) ? x.OMPCTG : "NA",
            vertical: this._validate.validate(x.VerticalName)
              ? x.VerticalName
              : "NA",
            tickedBtnVisibility: false,
            activeTR: true,
            DealOwnerEmailId: x.DealOwnerEmailId,
            account: this._validate.validate(x.CustomerName)
              ? x.CustomerName
              : "NA",
            dealOwner: this._validate.validate(x.DealOwnerName)
              ? x.DealOwnerName
              : "NA",
            OptionId: x.OptionID,
            index: indexId
          };
          Output.push(obj);
          indexId = indexId + 1;
        });
        console.log(Output, "outtttttttttttttt");
        console.log(JSON.stringify(Output), "outtttttttttttttt");
        return Output;
      } else {
        return [{}];
      }
    } else {
      return [{}];
    }
  }
  getLocaleDateFormat(dateConvert) {
    const dataModifier = new DateModifier();
    return dataModifier.modifier(dateConvert);
  }
  ngOndestroy() {
    this.roleSubcriber$.unsubscribe();
  }
}

@Component({
  selector: "app-cancel-pop",
  templateUrl: "./cancelPopUp.html",
  styleUrls: ["./existing-deals.component.scss"]
})
export class cancelConfirmationComponent implements OnInit {
  pageName: any;
  constructor(
    public dialogRef: MatDialogRef<cancelConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}
  ngOnInit() {
    console.log("data-->", this.data.objectRowData.title);
    this.pageName = this.data.objectRowData.title;
  }
}
