import { Component, OnInit } from "@angular/core";
import { DataCommunicationService } from "@app/core";
import { dealService } from "@app/core/services/deals.service";
import { MatDialog, MatDialogRef } from "@angular/material";
import { Observable } from "rxjs";
import { Store, select } from "@ngrx/store";
import { AppState } from "@app/core/state";
import { ValidateforNullnUndefined } from "@app/core/services/validateforNULLorUndefined.service";
import { DealDropdownService } from "@app/core/services/deals/deal-dropdown.service";
import { ErrorMessage } from "@app/core/services/error.services";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
@Component({
  selector: "app-create-deal",
  templateUrl: "./create-deal.component.html",
  styleUrls: ["./create-deal.component.scss"]
})
export class CreateDealComponent implements OnInit {
  // { id: 1, isFilter: false, name: 'OppName', isFixed: true, order: 1, title: 'Opportunity name', className: 'nonHyperlink' },
  // { id: 2, isFilter: false, name: 'OppID', isFixed: false, order: 2, title: 'Opportunity ID' },
  // { id: 3, isFilter: false, name: 'prodOpp', isFixed: false, order: 3, title: 'Product Opportunity' },
  // { id: 4, isFilter: false, name: 'groupCustName', isFixed: false, order: 4, title: 'Group Customer Name' },
  // { id: 5, isFilter: false, name: 'CustName', isFixed: false, order: 5, title: 'Customer Name' },

  searchpage = true;
  addDeal = false;
  twoactive = false;
  //searchDeals1: any = [];
  oppurtunityList = [{}];
  sort : any =
  {
    sortBy : 1,
    isDesc : false  
  }  
  preStatus:any = 0;
  isLoading: boolean = false;
  tableTotalCount: number = 0;
  getSelectedRec: any;
  opportunitySearch: FormGroup;
  pageCount: number = 50;
  pageNo: number = 1;
  paginationStatus: boolean = false;
  arrowkeyLocation = 0;
  selectedAccountName: string = "";
  isAccountSearchLoading: boolean = false;
  getStatus:String;
  filterConfigData = {
    OppName: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    OppID: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    prodOpp: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    groupCustName: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    CustName: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    isFilterLoading: true
  };
  constructor(
    public service: DataCommunicationService,
    private fb: FormBuilder,
    public _error: ErrorMessage,
    private _dropdownservice: DealDropdownService,
    private _validate: ValidateforNullnUndefined,
    public store: Store<AppState>,
    private dialog: MatDialog,
    private deals: dealService,
    private location: Location,
    public router: Router,
    public activeRoute: ActivatedRoute
  ) {
    this.opportunitySearch = this.fb.group({
      accountName: [""],
      accountGuid: [""],
      orderNumber: [""],
      oppNumber: [""],
      oppoamendContext: ["1"]
    });
    // this.getAccountInfo();
  }
  listTable = [];
  paginationPageNo = {
    PageSize: 50,
    RequestedPageNumber: 1,
    OdatanextLink: "",
    FilterData: []
  };
  ngOnInit() {
    // let searchedList = JSON.parse(localStorage.getItem("oppList"));
    this.returnUrl = this.activeRoute.snapshot.params["returnUrl"];
    //  console.log(searchedList, "searchedList");
    // if (searchedList != null) {
    //   this.opportunitySearch.controls.accountName.setValue(
    //     searchedList.accountName
    //   );
    //   this.opportunitySearch.controls.orderNumber.setValue(
    //     searchedList.orderNumber
    //   );
    //   this.opportunitySearch.controls.oppNumber.setValue(
    //     searchedList.oppNumber
    //   );
    //   this.oppurtunityList = this.getMappedList(searchedList.opportunityList);
    // }
  }

  stepone() {
    this.searchpage = true;
    this.addDeal = false;
    this.twoactive = false;
    console.log(this.twoactive);
  }

  /****************** Account Name autocomplete code start ****************** */

  showResults: boolean = false;
  AccountCollection: {}[] = [];
  selectedAccount: {}[] = [];

  /****************** Account Name autocomplete code end ****************** */
  accountSearchClose() {
    this.showResults = false;
  }
  openDealConfirmpop(): void {
    const dialogRef = this.dialog.open(DealConfirm, {
      width: "390px"
    });
  }
  openAttachFilePopup(): void {
    const dialogRef = this.dialog.open(uploadPop, {
      width: "610px"
    });
  }
  toggle: boolean = false;
  appendResult(value: string, guidid: string) {
    this.opportunitySearch.controls.accountName.setValue(value);
    this.opportunitySearch.controls.accountGuid.setValue(guidid);
    this.showResults = false;
  }

  userSearchMethod(event) {
    console.log("user search method event-->", event);
    console.log("user............");
    event == "initialDataLoad"
      ? this.opportunitySearch.controls.accountName.setValue(null)
      : "";
    let searchInformation =
      this.opportunitySearch.controls.accountName.value == null ||
      this.opportunitySearch.controls.accountName.value == ""
        ? "a"
        : this.opportunitySearch.controls.accountName.value;
    this.isAccountSearchLoading = true;
    this.AccountCollection = [];
    this.deals.getOpportuntyAccInfo(searchInformation).subscribe(
      (res: any) => {
        console.log("res-->", res);
        if (!res.IsError) {
          event == "initialDataLoad"
            ? this.opportunitySearch.controls.accountName.setValue("")
            : null;
          this.isAccountSearchLoading = false;
          this.AccountCollection = res.ResponseObject;
        } else {
          this._error.throwError(
            "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
          );
        }
      },
      error => {
        console.log(error);
        this._error.throwError(error);
      }
    );
  }

  isOppItemSelected: boolean = false;
  performTableChildAction(childActionRecieved): Observable<any> {
    var actionRequired = childActionRecieved;
    // let obj = actionRequired.objectRowData[0].id;
    console.log(actionRequired, "this.actionRequired");
    console.log(typeof actionRequired.objectRowData);
    if (typeof actionRequired.objectRowData != "string" && actionRequired.objectRowData != undefined ) {
      console.log("yes i am not  string");
      this.getSelectedRec = actionRequired.objectRowData[0].id;
      this.deals.clearOppId();
      this.deals.sendOppId(this.getSelectedRec);
      console.log(this.getSelectedRec, "this.getSelectedRec");
      this.isOppItemSelected = true;
    }
    switch (true) {
      case actionRequired.action == "columnFilter" ||
        actionRequired.action == "loadMoreFilterData" ||
        actionRequired.action == "columnSearchFilter": {
        this.pageCount = childActionRecieved.pageData.itemsPerPage;
        this.pageNo = childActionRecieved.pageData.currentPage;
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
        let postData = {
          SearchOppo: "",
          opportunityName: "",
          opportunityNumber: "",
          opportunityStatus: "",
          serviceLineId: "",
          practiceId: "",
          verticalId: "",
          subVerticalId: "",
          AccountGUID: this.opportunitySearch.controls.accountGuid.value,
          OppNameOppNumber: "",
          OrderNumber: "",
          geograpyId: "",
          regionId: "",
          accountName: "",
          parrentAccountId: "",
          accountNumber: "",
          wiproAccountCompetitorId: "",
          wiproAllianceAccountId: "",
          opportunityIpId: null,
          pageNumber:
            childActionRecieved.filterData.isApplyFilter == true
              ? 1
              : this.pageNo,
          pageCount: this.pageCount,
          UserId: "",
          OpportunityNames: [],
          OpportunityIds: [],
          GroupNames: [],
          GroupCustomerNames: [],
          SortBy: 1,
          IsDesc: "true"
        };
        console.log(postData, "post data...");
        if (childActionRecieved.filterData.isApplyFilter == false) {
          console.log(childActionRecieved.filterData.headerName)
          if (childActionRecieved.filterData.headerName == "OppName") {
            this.getOppNameMethod(childActionRecieved);
          } else if (childActionRecieved.filterData.headerName == "OppID") {
            this.getOppIdMethod(childActionRecieved);
          } else if (
            childActionRecieved.filterData.headerName == "groupCustName"
          ) {
            this.getGroupCustNameMethod(childActionRecieved);
          } else if (childActionRecieved.filterData.headerName == "CustName") {
            this.getCustNameMethod(childActionRecieved);
          } else {
            this.filterConfigData.isFilterLoading = false;
          }
        } else {
          childActionRecieved.filterData.order.map(x => {
            console.log(x, "x is coming here...");
            switch (x) {
              case "OppName":
                childActionRecieved.filterData.filterColumn.OppName.map(x => {
                  postData.OpportunityNames.push(x.name);
                });
                break;
              case "OppID":
                childActionRecieved.filterData.filterColumn.OppID.map(x => {
                  postData.OpportunityIds.push(x.id);
                });
                break;
              case "groupCustName":
                childActionRecieved.filterData.filterColumn.groupCustName.map(
                  x => {
                    postData.GroupCustomerNames.push(x.id);
                  }
                );
                break;
              case "CustName":
                childActionRecieved.filterData.filterColumn.CustName.map(x => {
                  postData.GroupNames.push(x.id);
                });
                break;
              default:
                break;
            }
          });
          this.getOppListSearch(postData);
        }
        break;
      }
      case actionRequired.action == "sortHeaderBy": {
        this.sort.sortBy = childActionRecieved.filterData.sortColumn == "OppName"
              ? 1
              : childActionRecieved.filterData.sortColumn == "OppID"
              ? 23
              : childActionRecieved.filterData.sortColumn == "groupCustName"
              ? 47
              : childActionRecieved.filterData.sortColumn == "CustName"
              ? 48
              : 1;
        this.sort.isDesc = !childActionRecieved.filterData.sortOrder;

        let postData = {
          SearchOppo: "",
          opportunityName: "",
          opportunityNumber: "",
          opportunityStatus: "",
          serviceLineId: "",
          practiceId: "",
          verticalId: "",
          subVerticalId: "",
          AccountGUID: this.opportunitySearch.controls.accountGuid.value,
          OppNameOppNumber: "",
          OrderNumber: "",
          geograpyId: "",
          regionId: "",
          accountName: "",
          parrentAccountId: "",
          accountNumber: "",
          wiproAccountCompetitorId: "",
          wiproAllianceAccountId: "",
          opportunityIpId: null,
          pageNumber: 1,
          pageCount: this.pageCount,
          UserId: "",
          OpportunityNames: [],
          OpportunityIds: [],
          GroupNames: [],
          GroupCustomerNames: [],
          SortBy: this.sort.sortBy,
          IsDesc: this.sort.isDesc
        };
        this.getOppListSearch(postData);
        break;
      }
      default:
        return;
    }
  }
  getOppListSearch(postData) {
    this.paginationPageNo.PageSize = postData.pageCount;
    this.paginationPageNo.RequestedPageNumber = postData.pageNumber;
    postData.OppOrOrd = this.getStatus
    this.deals.getFilteredOppList(postData).subscribe(
      res => {
        console.log(res);
        if (res.IsError == false) {
          this.isLoading = false;
          this.filterConfigData.isFilterLoading = false;
          if (res.ResponseObject.length > 0) {
            if (postData.pageNumber == 1) {
              let i = 1;
              res.ResponseObject.map(res => {
                res.index = i;
                i = i + 1;
              });
              console.log("it is inside first");
            } else {
              const perPage = this.pageCount;
              const start = (this.pageNo - 1) * perPage + 1;
              let i = start;
              const end = start + perPage - 1;
              res.ResponseObject.map(res => {
                res.index = i;
                i = i + 1;
              });
            }
            this.oppurtunityList = this.getMappedList(res.ResponseObject);
            this.tableTotalCount = res.TotalRecordCount;
          } else {
            this.oppurtunityList = [{}];
            this.tableTotalCount = 0;
          }
        } else {
          this.filterConfigData.isFilterLoading = false;
          this.isLoading = false;
          this.oppurtunityList = [{}];
          this.tableTotalCount = 0;
          this._error.throwError(
            "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
          );
        }
        console.log("Search array: ", this.oppurtunityList)
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
  getOppNameMethod(filteredData) {
    console.log(this.filterConfigData, "filteredData");
    //  let postData = {
    //       SearchOppo: "",
    //       opportunityName: "",
    //       opportunityNumber: "",
    //       opportunityStatus: "",
    //       serviceLineId: "",
    //       practiceId: "",
    //       verticalId: "",
    //       subVerticalId: "",
    //       AccountGUID: this.opportunitySearch.controls.accountGuid.value,
    //       OppNameOppNumber: filteredData.objectRowData,
    //       OrderNumber: "",
    //       geograpyId: "",
    //       regionId: "",
    //       accountName: "",
    //       parrentAccountId: "",
    //       accountNumber: "",
    //       wiproAccountCompetitorId: "",
    //       wiproAllianceAccountId: "",
    //       opportunityIpId: null,
    //       pageNumber: this.filterConfigData[filteredData.filterData.headerName].PageNo,
    //       pageCount: this.pageCount,
    //       UserId: "",
    //       OpportunityNames: [],
    //       OpportunityIds: [],
    //       GroupNames: [],
    //       GroupCustomerNames: [],
    //       SortBy : this.sort.sortBy,
    //       IsDesc: this.sort.isDesc,
    //       OppOrOrd : this.getStatus,
    //     };

    let input = {
      OppOrOrd : this.getStatus,
      pageNumber: this.filterConfigData[filteredData.filterData.headerName].PageNo,
      pageCount: this.pageCount,
      AccountGUID: this.opportunitySearch.controls.accountGuid.value,
      OppNameOppNumber: this.getStatus == 'O' ? filteredData.objectRowData : '',
      OrderNumber: this.getStatus == 'A' ? filteredData.objectRowData : '',
    }
        
      this.deals.getOppNameMethod(input).subscribe(
      Res => {
        console.log(Res, "Res is coming here we go....");
        if (Res.IsError == false) {
          this.filterConfigData.isFilterLoading = false;
          let responseOppData: [] = Res.ResponseObject.map(x => {
            let obj = {
              id: x.Code,
              name: this.getStatus=="O" ? x.OpportunityName : x.OpportunityName,
              isDatafiltered: false
            };
            return obj;
          });

          if (filteredData.filterData.filterColumn.OppName.length > 0) {
            responseOppData.map((x: any) => {
              filteredData.filterData.filterColumn.OppName.map(y => {
                x.id == y.id ? (x.isDatafiltered = y.isDatafiltered) : null;
              });
            });
          }

          if (filteredData.action == "loadMoreFilterData") {
            // this.filterConfigData.OppName.PageNo = this.filterConfigData.OppName.PageNo + 1;
            responseOppData.map(x =>
              this.filterConfigData.OppName.data.push(x)
              
            );
          this.filterConfigData.OppName.data=this.deals.getUnique(this.filterConfigData.OppName.data,"name");
            this.filterConfigData.OppName.recordCount = Res.TotalRecordCount;
            console.log(this.filterConfigData, "this.filterConfigData123");
              this.filterConfigData.isFilterLoading = false;
          } else { 
            this.filterConfigData.OppName.data = this.deals.getUnique(responseOppData,"name");
            this.filterConfigData.OppName.recordCount = Res.TotalRecordCount;
            console.log(this.filterConfigData, "this.filterConfigData");
             this.filterConfigData.isFilterLoading = false;
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
  getOppIdMethod(filteredData) {
      //  let postData = {
      //     SearchOppo: "",
      //     opportunityName: "",
      //     opportunityNumber: "",
      //     opportunityStatus: "",
      //     serviceLineId: "",
      //     practiceId: "",
      //     verticalId: "",
      //     subVerticalId: "",
      //     AccountGUID: this.opportunitySearch.controls.accountGuid.value,
      //     OppNameOppNumber: filteredData.objectRowData,
      //     OrderNumber: "",
      //     geograpyId: "",
      //     regionId: "",
      //     accountName: "",
      //     parrentAccountId: "",
      //     accountNumber: "",
      //     wiproAccountCompetitorId: "",
      //     wiproAllianceAccountId: "",
      //     opportunityIpId: null,
      //     pageNumber: this.filterConfigData[filteredData.filterData.headerName].PageNo,
      //     pageCount: this.pageCount,
      //     UserId: "",
      //     OpportunityNames: [],
      //     OpportunityIds: [],
      //     GroupNames: [],
      //     GroupCustomerNames: [],
      //     SortBy : this.sort.sortBy,
      //     IsDesc: this.sort.isDesc,
      //     OppOrOrd : this.getStatus,
      //   };

        let input = {
          OppOrOrd : this.getStatus,
          pageNumber: this.filterConfigData[filteredData.filterData.headerName].PageNo,
          pageCount: this.pageCount,
          AccountGUID: this.opportunitySearch.controls.accountGuid.value,
          OppNameOppNumber: this.getStatus == 'O' ? filteredData.objectRowData : '',
          OrderNumber: this.getStatus == 'A' ? filteredData.objectRowData : '',
        }

      this.deals.getOppIdMethod(input).subscribe(
      Res => {
        console.log(Res, "Res is coming here we go....");
        if (Res.IsError == false) {
          this.filterConfigData.isFilterLoading = false;
          let responseOppData: [] = Res.ResponseObject.map(x => {
            let obj = {
              id: x.OpportunityNumber,
              name: x.OpportunityNumber,
              isDatafiltered: false
            };
            return obj;
          });
          if (filteredData.filterData.filterColumn.OppID.length > 0) {
            responseOppData.map((x: any) => {
              filteredData.filterData.filterColumn.OppID.map(y => {
                x.id == y.id ? (x.isDatafiltered = y.isDatafiltered) : null;
              });
            });
          }
          if (filteredData.action == "loadMoreFilterData") {
            // this.filterConfigData.OppID.PageNo = this.filterConfigData.OppID.PageNo + 1;
            responseOppData.map(x => this.filterConfigData.OppID.data.push(x));
           this.filterConfigData.OppID.data=this.deals.getUnique(this.filterConfigData.OppID.data,"name");
            this.filterConfigData.OppID.recordCount = Res.TotalRecordCount;
            this.filterConfigData.isFilterLoading=false;
          } else {
            this.filterConfigData.OppID.data = this.deals.getUnique(responseOppData,"name");
            this.filterConfigData.OppID.recordCount = Res.TotalRecordCount;
            this.filterConfigData.isFilterLoading=false;
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
  getGroupCustNameMethod(filteredData) {
      //  let postData = {
      //     SearchOppo: "",
      //     opportunityName: "",
      //     opportunityNumber: "",
      //     opportunityStatus: "",
      //     serviceLineId: "",
      //     practiceId: "",
      //     verticalId: "",
      //     subVerticalId: "",
      //     AccountGUID: this.opportunitySearch.controls.accountGuid.value,
      //     OppNameOppNumber: filteredData.objectRowData,
      //     OrderNumber: "",
      //     geograpyId: "",
      //     regionId: "",
      //     accountName: "",
      //     parrentAccountId: "",
      //     accountNumber: "",
      //     wiproAccountCompetitorId: "",
      //     wiproAllianceAccountId: "",
      //     opportunityIpId: null,
      //     pageNumber: this.filterConfigData[filteredData.filterData.headerName].PageNo,
      //     pageCount: this.pageCount,
      //     UserId: "",
      //     OpportunityNames: [],
      //     OpportunityIds: [],
      //     GroupNames: [],
      //     GroupCustomerNames: [],
      //     SortBy : this.sort.sortBy,
      //     IsDesc : this.sort.isDesc,
      //     OppOrOrd : this.getStatus,
      //   };

        let input = {
          OppOrOrd : this.getStatus,
          pageNumber: this.filterConfigData[filteredData.filterData.headerName].PageNo,
          pageCount: this.pageCount,
          AccountGUID: this.opportunitySearch.controls.accountGuid.value,
          OppNameOppNumber: this.getStatus == 'O' ? filteredData.objectRowData : '',
          OrderNumber: this.getStatus == 'A' ? filteredData.objectRowData : '',
        }

      this.deals.getGroupCustNameMethod(input).subscribe(
      Res => {
        console.log(Res, "Res is coming here we go....");
        if (Res.IsError == false) {
          this.filterConfigData.isFilterLoading = false;
          let responseOppData: [] = Res.ResponseObject.map(x => {
            let obj = {
              id: x.GroupCustomerName,
              name: x.GroupCustomerName,
              isDatafiltered: false
            };
            return obj;
          });

          if (filteredData.filterData.filterColumn.groupCustName.length > 0) {
            responseOppData.map((x: any) => {
              filteredData.filterData.filterColumn.groupCustName.map(y => {
                x.id == y.id ? (x.isDatafiltered = y.isDatafiltered) : null;
              });
            });
          }
          if (filteredData.action == "loadMoreFilterData") {
            //  this.filterConfigData.groupCustName.PageNo = this.filterConfigData.groupCustName.PageNo + 1;
            responseOppData.map(x =>
              this.filterConfigData.groupCustName.data.push(x)
            );
             this.filterConfigData.groupCustName.data=this.deals.getUnique( this.filterConfigData.groupCustName.data,"name");
            // this.filterConfigData.groupCustName.data.push(responseOppData);
            // this.filterConfigData.groupCustName.PageNo = this.filterConfigData.groupCustName.PageNo + 1;
            this.filterConfigData.groupCustName.recordCount =
              Res.TotalRecordCount;
              this.filterConfigData.isFilterLoading=false;
          } else {
            this.filterConfigData.groupCustName.data = this.deals.getUnique(responseOppData,"name");
            this.filterConfigData.groupCustName.recordCount =
              Res.TotalRecordCount;
              this.filterConfigData.isFilterLoading=false;
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
  getCustNameMethod(filteredData) {
      //  let postData = {
      //     SearchOppo: "",
      //     opportunityName: "",
      //     opportunityNumber: "",
      //     opportunityStatus: "",
      //     serviceLineId: "",
      //     practiceId: "",
      //     verticalId: "",
      //     subVerticalId: "",
      //     AccountGUID: this.opportunitySearch.controls.accountGuid.value,
      //     OppNameOppNumber: filteredData.objectRowData,
      //     OrderNumber: "",
      //     geograpyId: "",
      //     regionId: "",
      //     accountName: "",
      //     parrentAccountId: "",
      //     accountNumber: "",
      //     wiproAccountCompetitorId: "",
      //     wiproAllianceAccountId: "",
      //     opportunityIpId: null,
      //     pageNumber: this.filterConfigData[filteredData.filterData.headerName].PageNo,
      //     pageCount: this.pageCount,
      //     UserId: "",
      //     OpportunityNames: [],
      //     OpportunityIds: [],
      //     GroupNames: [],
      //     GroupCustomerNames: [],
      //     SortBy : this.sort.sortBy,
      //     IsDesc : this.sort.isDesc,
      //     OppOrOrd : this.getStatus,
      //   };

        let input = {
          OppOrOrd : this.getStatus,
          pageNumber: this.filterConfigData[filteredData.filterData.headerName].PageNo,
          pageCount: this.pageCount,
          AccountGUID: this.opportunitySearch.controls.accountGuid.value,
          OppNameOppNumber: this.getStatus == 'O' ? filteredData.objectRowData : '',
          OrderNumber: this.getStatus == 'A' ? filteredData.objectRowData : '',
        }

      this.deals.getCustNameMethod(input).subscribe(
      Res => {
        console.log(Res, "Res is coming here we go....");
        if (Res.IsError == false) {
          this.filterConfigData.isFilterLoading = false;
          let responseOppData: [] = Res.ResponseObject.map(x => {
            let obj = {
              id: x.CustomerName,
              name: x.CustomerName,
              isDatafiltered: false
            };
            return obj;
          });
          if (filteredData.filterData.filterColumn.CustName.length > 0) {
            responseOppData.map((x: any) => {
              filteredData.filterData.filterColumn.CustName.map(y => {
                x.id == y.id ? (x.isDatafiltered = y.isDatafiltered) : null;
              });
            });
          }
          if (filteredData.action == "loadMoreFilterData") {
            //this.filterConfigData.CustName.PageNo = this.filterConfigData.CustName.PageNo + 1;
            responseOppData.map(x =>
              this.filterConfigData.CustName.data.push(x)
            );
           this.filterConfigData.CustName.data=this.deals.getUnique(this.filterConfigData.CustName.data,"name");
            // this.filterConfigData.CustName.data.push(responseOppData);
            // this.filterConfigData.CustName.PageNo = this.filterConfigData.CustName.PageNo + 1;
            this.filterConfigData.CustName.recordCount = Res.TotalRecordCount;
            this.filterConfigData.isFilterLoading=false;
          } else {
            this.filterConfigData.CustName.data = this.deals.getUnique(responseOppData,"name");
            this.filterConfigData.CustName.recordCount = Res.TotalRecordCount;
            this.filterConfigData.isFilterLoading=false;
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
  steptwo() {
    console.log(this.isOppItemSelected, "this.isOppItemSelected sudharshan");
    if (this.isOppItemSelected) {
      this.searchpage = false;
      this.addDeal = true;
      localStorage.setItem("oppId", null);
      //  this.router.navigateByUrl("/deals/taggedSummary");
      this.router.navigate([
        "/deals/taggedSummary",
        { returnsummeryUrl: this.router.routerState.snapshot.url }
      ]);
    } else {
      this.searchpage = true;
      this.addDeal = false;
      this._error.throwError("Please Select One Opportunity");
    }
  }
  SearchContext() {
    console.log(this.opportunitySearch, "this.opportunitySearch");
    this.opportunitySearch.controls.oppoamendContext.value == "1"
      ? this.opportunitySearch.controls.orderNumber.setValue("")
      : this.opportunitySearch.controls.oppoamendContext.value == "2"
      ? this.opportunitySearch.controls.oppNumber.setValue("")
      : "";
  }
  onSubmit() {
    this.sort.sortBy=1;
    this.sort.isDesc=false;
    this.opportunitySearch.controls.accountName.value != null &&
    this.opportunitySearch.controls.accountName.value != "" &&
    this.opportunitySearch.controls.accountName.value != undefined
      ? this.opportunitySearch.controls.accountName.setErrors(null)
      : this.opportunitySearch.controls.accountName.setErrors({
          required: true
        });
    console.log(
      this.opportunitySearch,
      "this.opportunitySearch this.opportunitySearch"
    );
    if (this.opportunitySearch.valid) {
      console.log("Status: ", this.opportunitySearch.controls.oppoamendContext.value)
      this.preStatus != this.opportunitySearch.controls.oppoamendContext.value ? this.pageNo = 1 : this.pageNo = this.pageNo;
      let obj = {
        SearchOppo: "",
        opportunityName: this.opportunitySearch.controls.oppNumber.value,
        opportunityNumber: this.opportunitySearch.controls.oppNumber.value,
        opportunityStatus: "",
        serviceLineId: "",
        practiceId: "",
        verticalId: "",
        subVerticalId: "",
        AccountGUID: this.opportunitySearch.controls.accountGuid.value,
        OppNameOppNumber: this.opportunitySearch.controls.oppNumber.value,
        OrderNumber:
          this.opportunitySearch.controls.oppoamendContext.value == "2"
            ? this.opportunitySearch.controls.orderNumber.value == ""
              ? "%%%"
              : this.opportunitySearch.controls.orderNumber.value
            : "",
        // OrderNumber: this.opportunitySearch.controls.oppoamendContext.value == "2" ? ((this.opportunitySearch.controls.orderNumber.value !=null || this.opportunitySearch.controls.orderNumber.value !='') ?  this.opportunitySearch.controls.orderNumber.value : '%%%') : 'abc',
        OppOrOrd:
          this.opportunitySearch.controls.oppoamendContext.value == "1"
            ? "O"
            : "A",
        geograpyId: "",
        regionId: "",
        accountName: "",
        parrentAccountId: "",
        accountNumber: "",
        wiproAccountCompetitorId: "",
        wiproAllianceAccountId: "",
        opportunityIpId: null,
        pageNumber: this.pageNo,
        pageCount: this.pageCount,
        UserId: "",
        SortBy: 1,
        IsDesc: false
      };
      this.preStatus != this.opportunitySearch.controls.oppoamendContext.value ? this.oppurtunityList = [] : this.oppurtunityList = this.oppurtunityList;
      this.preStatus = this.opportunitySearch.controls.oppoamendContext.value;
      console.log(JSON.stringify(obj), "YES UTS");
      this.isLoading = true;
      //this.oppurtunityList = []
      this.deals.getSearchedOppList(obj).subscribe(
        (res: any) => {
          console.log(JSON.stringify(res), "res is coming....");
          if (!res.IsError) {
            this.getStatus = this.opportunitySearch.controls.oppoamendContext.value == "1" ? 'O' : 'A'
            if (res.ResponseObject.length > 0) {
              console.log(res, "from api...");
              // this.oppurtunityList = this.getMappedList(res.ResponseObject);
              const perPage = this.pageCount;
              const start = (this.pageNo - 1) * perPage + 1;
              let i = start;
              const end = start + perPage - 1;
              console.log(start + " - " + end);
              res.ResponseObject.map(res => {
                if (!res.index) {
                  res.index = i;
                  i = i + 1;
                }
              });
              console.log("Page no.: ", this.pageNo)
              if (this.paginationStatus) {
                console.log("yes inside pagination", this.oppurtunityList);
                this.oppurtunityList = this.oppurtunityList.concat(
                  this.getMappedList(res.ResponseObject)
                );
              } else {
                console.log("Not inside pagination");
                this.oppurtunityList = [];
                this.oppurtunityList = this.oppurtunityList.concat(
                  this.getMappedList(res.ResponseObject)
                );
              }
              //console.log(this.oppurtunityList, "this.oppurtunityList");
              this.tableTotalCount = res.TotalRecordCount;
              this.isLoading = false;
              // let obj = {};
              // obj[
              //   "accountName"
              // ] = this.opportunitySearch.controls.accountName.value;
              // obj[
              //   "orderNumber"
              // ] = this.opportunitySearch.controls.orderNumber.value;
              // obj[
              //   "oppNumber"
              // ] = this.opportunitySearch.controls.oppNumber.value;
              // obj["opportunityList"] = this.oppurtunityList;
              // localStorage.setItem("oppList", JSON.stringify(obj));
              //this._error.throwError(getSummeryList.ReturnMessage)
            } else {
              console.log("Error-->");
              this.tableTotalCount = 0;
              this.oppurtunityList = [{}];
              this.paginationStatus = false;
              this.isLoading = false;
              // this._error.throwError(getSummeryList.ReturnMessage)
            }
            
          } else {
            this.tableTotalCount = 0;
            this.oppurtunityList = [{}];
            this.paginationStatus = false;
            this.isLoading = false;
            //this._error.throwError(res.ReturnMessage)
            console.log("Error-->");
          }
          console.log(this.oppurtunityList, "Search Array List");
        },
        error => {
          this.isLoading = false;
          console.log("Error-->", error);
        }
      );
    }
  }
  pagination(pageData) {
    console.log(pageData, "pageDatattttttttttttttttttttttttt");
    switch (pageData.action) {
      case "pagination": {
        if (pageData.filterData.order.length == 0) {
          this.pageNo = pageData.currentPage;
          this.pageCount = pageData.itemsPerPage;
          this.paginationStatus = true;
          this.onSubmit();
        } else {
          this.pageNo = pageData.currentPage;
          this.pageCount = pageData.itemsPerPage;
          let postData = {
            SearchOppo: "",
            opportunityName: "",
            opportunityNumber: "",
            opportunityStatus: "",
            serviceLineId: "",
            practiceId: "",
            verticalId: "",
            subVerticalId: "",
            AccountGUID: this.opportunitySearch.controls.accountGuid.value,
            OppNameOppNumber: "",
            OrderNumber: "",
            geograpyId: "",
            regionId: "",
            accountName: "",
            parrentAccountId: "",
            accountNumber: "",
            wiproAccountCompetitorId: "",
            wiproAllianceAccountId: "",
            opportunityIpId: null,
            pageNumber: this.pageNo,
            pageCount: this.pageCount,
            UserId: "",
            OpportunityNames: [],
            OpportunityIds: [],
            GroupNames: [],
            GroupCustomerNames: [],
            SortBy: 1,
            IsDesc: "true"
          };
          pageData.filterData.order.map(x => {
            switch (x) {
              case "OppName": {
                console.log(
                  pageData.filterData.filterColumn.OppName,
                  " pageData.filterData.filterColumn.OppName"
                );
                pageData.filterData.filterColumn.OppName.map(x => {
                  console.log(x, "////////////////////");
                  postData.OpportunityNames.push(x.name);
                });
                break;
              }
              case "OppID": {
                pageData.filterData.filterColumn.OppID.map(x => {
                  postData.OpportunityIds.push(x.id);
                });
                break;
              }

              case "groupCustName": {
                pageData.filterData.filterColumn.groupCustName.map(x => {
                  postData.GroupCustomerNames.push(x.id);
                });
                break;
              }
              case "CustName":
                pageData.filterData.filterColumn.CustName.map(x => {
                  postData.GroupNames.push(x.id);
                });
                break;
              default:
                break;
            }
            this.getOppListSearch(postData);
          });
          console.log(
            pageData.filterData.filterColumn,
            "pageData.filterData.filterColumn"
          );
        }
      }
    }
  }
  getMappedList(response) {
    this.tableTotalCount = response.length;
    let Output = [];
    if (response.length > 0) {
      response.map(x => {
        let i = x.index;
        let dealobject = {};
        dealobject["AccountGUID"] = x.Account.AccountId;
        dealobject["opportunityNumber"] = x.OpportunityNumber;
        dealobject["OpportunityIpId"] = x.OpportunityId;
        dealobject["isamedmentnumber"] = x.isamendementflag;
        dealobject["orderId"] = x.OrderID;
        let obj = {
          id: this._validate.validate(dealobject) ? dealobject : "-",
          OppName: this._validate.validate(
            this.opportunitySearch.controls.oppoamendContext.value == "1"
              ? x.OpportunityName
              : x.OppOrderNumber
          )
            ? this.opportunitySearch.controls.oppoamendContext.value == "1"
              ? x.OpportunityName
              : x.OppOrderNumber
            : "-",
          OppID: this._validate.validate(x.OpportunityNumber)
            ? x.OpportunityNumber
            : "-",
          prodOpp: "-",
          groupCustName: this._validate.validate(x.GroupCustomerName)
            ? x.GroupCustomerName
            : "-",
          CustName: this._validate.validate(x.CustomerName)
            ? x.CustomerName
            : "-",
          index: x.index ? x.index : null
        };

        Output.push(obj);
      });
      console.log(Output, "output..");
      return Output;
    } else {
      this.tableTotalCount = 0;
      response = [];
      return [{}];
    }
  }
  returnUrl: any;
  gobackdeal() {
    this.router.navigateByUrl(this.returnUrl);
  }
}

@Component({
  selector: "pop-create-deal-confirm",
  templateUrl: "./deal-creation-confirm.html",
  styleUrls: ["./create-deal.component.scss"]
})
export class DealConfirm {}

/****************   upload popup start        **************/

@Component({
  selector: "upload-pop",
  templateUrl: "./uploadPop.html"
})
export class uploadPop {
  constructor(public dialogRef: MatDialogRef<uploadPop>) {}
}

/****************** upload popup END  */
