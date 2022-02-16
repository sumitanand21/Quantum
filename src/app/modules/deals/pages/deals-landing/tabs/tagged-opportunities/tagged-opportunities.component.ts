import { Component, OnInit } from "@angular/core";
import { dealService } from "@app/core/services/deals.service";
import { Observable, of, Subscription } from "rxjs";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material";
import { Store, select } from "@ngrx/store";
import { AppState } from "@app/core/state";
import {
  TaggedListAction,
  DealsActionTypes
} from "@app/core/state/actions/deals.actions";
import { tap } from "rxjs/operators";
import { taggedDealsList } from "@app/core/state/selectors/deals/tagged-deals.selectors";
import { EncrDecrService } from "@app/core/services/encr-decr.service";
import { ValidateforNullnUndefined } from "@app/core/services/validateforNULLorUndefined.service";
import { HttpClient } from "@angular/common/http";
import { ErrorMessage } from "@app/core/services/error.services";
import { OnlineOfflineService } from "@app/core/services/online-offline.service";
import { RoutingState } from "@app/core/services/navigation.service";
import { DataCommunicationService } from "@app/core/services/global.service";
@Component({
  selector: "app-tagged-opportunities",
  templateUrl: "./tagged-opportunities.component.html",
  styleUrls: ["./tagged-opportunities.component.scss"]
})
export class TaggedOpportunitiesComponent implements OnInit {
  dealsTable: any = [];
  configData = {
    AssignDeal: []
  };
  tableTotalCount: number = 0;
  isLoading: boolean = false;
  pageCount: number = 50;
  pageNo: number = 1;
  Searchtext: string = "";
  paginationPageNo = {
    PageSize: 50,
    RequestedPageNumber: 1,
    OdatanextLink: "",
    FilterData: this.deals.taggedConfigData || []
  };
  UserID: string;
  filterConfigData = {
    OppName: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    OppID: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    account: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    SBU: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    vertical: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    OppOwner: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    oppType: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    TCV: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    isFilterLoading: true
  };
  taggedSubcriber$: Subscription = new Subscription();
  constructor(
    private deals: dealService,
    private http: HttpClient,
    public _error: ErrorMessage,
    private onlineOfflineService: OnlineOfflineService,
    private encrDecrService: EncrDecrService,
    private _validate: ValidateforNullnUndefined,
    private router: Router,
    public dialog: MatDialog,
    public store: Store<AppState>,
    private routingState: RoutingState,
    private globalService: DataCommunicationService
  ) { }

  async ngOnInit() {
    this.deals.taggedConfigData = [];
    this.UserID = this.encrDecrService.get(
      "EncryptionEncryptionEncryptionEn",
      localStorage.getItem("userID"),
      "DecryptionDecrip"
    );
    var postData = {
      "SearchText": this.Searchtext,
      "PageSize": this.pageCount,
      "RequestedPageNumber": this.pageNo,
      "StatusCode": 1,
      "Name": [],
      "AccountGuids": [],
      "OpportunityNumbers": [],
      "OpportunityType":[],
      "SBUGuids": [],
      "VerticalGuids": [],
      "TCVS": [],
      "OwnerGuids": [this.UserID]
    }
    this.taggedSubcriber$ = this.store.pipe(select(taggedDealsList)).subscribe(
      async  res => {
        console.log("Tagged deals", res);
        if (res.taggedDeals != undefined) {
          if (
            res.taggedDeals.length > 0 &&
            this.globalService.newOpportunities == false
          ) {
            console.log("From state", res);
            if (this._validate.validate(this.deals.taggedPageno)) {
              this.paginationPageNo.RequestedPageNumber = this.deals.taggedPageno;
            }
            this.dealsTable = res.taggedDeals;
            this.tableTotalCount = res.count;
          } else {
            if (this.onlineOfflineService.isOnline) {
              this.isLoading = true;
              this.getTaggedList(postData);
            }
          }
        } else {
          this.getTaggedList(postData);
        }
      },
      error => {
        if (this.onlineOfflineService.isOnline) {
          this.isLoading = true;
          this.getTaggedList(postData);
        }
      }
    );
    if (!this.onlineOfflineService.isOnline) {
      const CacheResponse = await this.deals.getTaggedDealsCacheData();
      console.log("CacheResponse-->", CacheResponse);
      if (CacheResponse) {
        this.isLoading = true;
        if (CacheResponse.data.length > 0) {
          this.isLoading = false;
          this.dealsTable = CacheResponse.data;
          this.tableTotalCount = this.dealsTable.length;
        } else {
          this.isLoading = false
          this.getTaggedList(postData);
        }
      }
      else {
        this.getTaggedList(postData);
      }
    }
  }


  getTaggedList(postData) {
    // let postData = {
    //   SearchText: this.Searchtext,
    //   PageSize: this.pageCount,
    //   RequestedPageNumber: this.pageNo,
    //   OwnerId: this.UserID,
    //   StatusCode: 1
    // };


    this.paginationPageNo.PageSize = this.pageCount;
    this.paginationPageNo.RequestedPageNumber = this.pageNo;
    this.deals.getTaggedOpp(postData).subscribe(
      res => {
        console.log(res);
        if (res) {
          this.isLoading = false;
          this.filterConfigData.isFilterLoading = false;
          if (res.IsError == false) {
            console.log("From api", res);
            this.globalService.newOpportunities = false;
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
            let spliceArray = [];
            this.dealsTable.map(res => {
              if (res.index >= start && res.index <= end) {
                spliceArray.push(res);
              }
            });
            spliceArray.map(res => {
              this.dealsTable.splice(this.dealsTable.indexOf(res), 1);
            });
            this.dealsTable = this.dealsTable.concat(
              this.getMappedData(res.ResponseObject)
            );
            console.log("Cheeeck", this.dealsTable);
            if (this.Searchtext == "") {
              this.store.dispatch(
                new TaggedListAction({
                  taggedDealslist: this.dealsTable,
                  count: res.TotalRecordCount
                })
              );
            }
            this.tableTotalCount = res.TotalRecordCount;
            console.log('this.tableTotalCount', this.tableTotalCount)
          } else {
            this._error.throwError(
              "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
            );
          }
        }
      },
      error => {
        this.filterConfigData.isFilterLoading = false;
        this.isLoading = false;
        console.log("Error", error);
        this._error.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    );
  }

  // table selector event emitters
  pagination(pageData) {
    console.log(pageData);
    var postData = {
      "SearchText": this.Searchtext,
      "PageSize": this.pageCount,
      "RequestedPageNumber": this.pageNo,
      "StatusCode": 1,
      "Name": [],
      "AccountGuids": [],
      "OpportunityNumbers": [],
      "SBUGuids": [],
      "VerticalGuids": [],
      "TCVS": [],
      "OwnerGuids": [this.UserID]
    }
    switch (pageData.action) {
      case "pagination": {
        this.pageNo = pageData.currentPage;
        this.pageCount = pageData.itemsPerPage;
        this.deals.taggedPageno = pageData.currentPage;
        postData.SearchText = this.Searchtext;
        pageData.filterData.order.map(x => {
          switch (x) {
            case "OppName":
              pageData.filterData.filterColumn.OppName.map(x => {
                postData.Name.push(x.name)
              })
              break;
            case "OppID":
              pageData.filterData.filterColumn.OppID.map(x => {
                postData.OpportunityNumbers.push(x.name)
              })
              break;
            case "TCV":
              pageData.filterData.filterColumn.TCV.map(x => {
                postData.TCVS.push(x.name)
              })
              break;
            case "OppOwner":
              pageData.filterData.filterColumn.OppOwner.map(x => {
                postData.OwnerGuids.push(x.id)
              })
              break;
            default:
              break;
          }
        })
        this.getTaggedList(postData);
        return of("Search Trigger");
      }
    }
  }
  performTableChildAction(childActionRecieved): Observable<any> {
    var actionRequired = childActionRecieved;
    console.log(childActionRecieved);
    switch (true) {
      case actionRequired.action == "OppName": {
        let obj = actionRequired.objectRowData[0].id;
        console.log(obj, "vastundhi..");
        let encryptData = this.encrDecrService.set(
          "EncryptionEncryptionEncryptionEn",
          JSON.stringify(obj),
          "DecryptionDecrip"
        );
        localStorage.setItem("OppId", encryptData);
        this.deals.clearOppId();
        this.deals.taggedPageno = childActionRecieved.pageData.currentPage;
        this.deals.taggedConfigData = childActionRecieved.configData.filterData;
        this.router.navigate(['/deals/taggedSummary', { returnhomeUrl: this.router.routerState.snapshot.url }])
        return of("share Trigger");

      }
      case actionRequired.action == "search": {
        if(childActionRecieved.filterData.globalSearch.match(/[!@#$%^&*(),.?":{}|<>/]/g)) {

          this.dealsTable=[{}];   // optional

          return;

        }
        this.pageNo = 1;
        this.Searchtext = actionRequired.objectRowData;
        let postData = {
          "SearchText": this.Searchtext,
          "PageSize": this.pageCount,
          "RequestedPageNumber": this.pageNo,
          "StatusCode": 1,
          "Name": [],
          "AccountGuids": [],
          "OpportunityNumbers": [],
          "SBUGuids": [],
          "VerticalGuids": [],
          "TCVS": [],
          "OwnerGuids": [this.UserID]
        }
        this.getTaggedListSearch(postData);
        return of("Search Trigger");
      }
      case actionRequired.action == "AssignDealSearch": {
        this.configData.AssignDeal = [
          {
            index: 0,
            contact: "Anubhav Jain",
            domain: "Digital",
            initials: "AJ",
            value: true
          },
          {
            index: 1,
            contact: "Kanika Tuteja",
            domain: "Digital",
            initials: "KT",
            value: false
          },
          {
            index: 2,
            contact: "Anubhav Jain",
            domain: "Digital",
            initials: "AJ",
            value: false
          },
          {
            index: 3,
            contact: "Kanika Tuteja",
            domain: "Digital",
            initials: "KT",
            value: false
          }
        ];
        return;
      }
      case actionRequired.action == "ClearAllFilter": {
        this.ngOnInit();
        return
      }
      case actionRequired.action == "ACCEPT": {
        let encryptData = this.encrDecrService.set(
          "EncryptionEncryptionEncryptionEn",
          actionRequired.objectRowData[0].id,
          "DecryptionDecrip"
        );
        localStorage.setItem("OppId", encryptData);
        this.deals.clearOppId();
        this.deals.taggedPageno = childActionRecieved.pageData.currentPage;
        this.deals.taggedConfigData = childActionRecieved.configData.filterData;
        this.router.navigateByUrl("/deals/taggedSummary");
      }
      case actionRequired.action == "AssignDeal": {
        return;
      }
      case actionRequired.action == "columnFilter" || actionRequired.action == "loadMoreFilterData" || actionRequired.action == "columnSearchFilter": {
        this.pageCount = childActionRecieved.pageData.itemsPerPage;
        this.pageNo = childActionRecieved.pageData.currentPage;
        if (actionRequired.action == "loadMoreFilterData") {
          this.filterConfigData[childActionRecieved.filterData.headerName].PageNo = this.filterConfigData[childActionRecieved.filterData.headerName].PageNo + 1;
        }
        let postData = {
          "SearchText": actionRequired.objectRowData,
          "PageSize": this.pageCount,
          "RequestedPageNumber": this.pageNo,
          "StatusCode": 1,
          "Name": [],
          "AccountGuids": [],
          "OpportunityNumbers": [],
          "OpportunityType":[],
          "SBUGuids": [],
          "VerticalGuids": [],
          "TCVS": [],
          "OwnerGuids": [this.UserID]
        }
        if (childActionRecieved.filterData.isApplyFilter == false) {
          console.log("Header name: ", childActionRecieved.filterData.headerName)

          if (childActionRecieved.filterData.headerName == "OppName") {
            this.getColumnOpportunityListName(childActionRecieved);
          } else if (childActionRecieved.filterData.headerName == "OppID") {
            this.OpportunityNumbers(childActionRecieved);
          } else if (childActionRecieved.filterData.headerName == "OppOwner") {
            this.getOwner(childActionRecieved);
          } else if (childActionRecieved.filterData.headerName == "account") {
            this.getAccount(childActionRecieved);
          } else if (childActionRecieved.filterData.headerName == "SBU") {
            this.getSBU(childActionRecieved);
          } else if (childActionRecieved.filterData.headerName == "vertical") {
            this.getVertical(childActionRecieved);
          } else if (childActionRecieved.filterData.headerName == "oppType") {
            this.getOppType(childActionRecieved);
          } else if (childActionRecieved.filterData.headerName == "TCV") {
            this.getTCV(childActionRecieved);
          } else {
            this.filterConfigData.isFilterLoading = false;
          }
        } else {
          postData.SearchText = this.Searchtext;
          console.log(childActionRecieved.filterData.order)
          console.log(childActionRecieved.filterData.filterColumn)
          childActionRecieved.filterData.order.map(x => {
            switch (x) {
              case "OppName":
                childActionRecieved.filterData.filterColumn.OppName.map(x => {
                  postData.Name.push(x.name)
                })
                break;
              case "OppID":
                childActionRecieved.filterData.filterColumn.OppID.map(x => {
                  postData.OpportunityNumbers.push(x.name)
                })
                break;
              case "TCV":
                childActionRecieved.filterData.filterColumn.TCV.map(x => {
                  postData.TCVS.push(x.name)
                })
                break;
              case "OppOwner":
                childActionRecieved.filterData.filterColumn.OppOwner.map(x => {
                  postData.OwnerGuids.push(x.id)
                })
                break;
                case "account":
                childActionRecieved.filterData.filterColumn.account.map(x => {
                  postData.AccountGuids.push(x.id)
                })
                break;
                case "SBU":
                  childActionRecieved.filterData.filterColumn.SBU.map(x => {
                    postData.SBUGuids.push(x.id)
                  })
                  break;
                case "oppType":
                  childActionRecieved.filterData.filterColumn.oppType.map(x => {
                    postData.OpportunityType.push(x.id)
                  })
                break;
                case "vertical":
                  childActionRecieved.filterData.filterColumn.vertical.map(x => {
                    postData.VerticalGuids.push(x.id)
                  })
                  break;

              default:
                break;
            }
          })
          console.log(postData,"postdata...")
          this.getTaggedListSearch(postData);

        }
        break
      }
      case actionRequired.action == "sortHeaderBy": {
        this.pageCount = childActionRecieved.pageData.itemsPerPage;
        this.pageNo = childActionRecieved.pageData.currentPage;
        let postData = {
          "SearchText": this.Searchtext,
          "PageSize": this.pageCount,
          "RequestedPageNumber": this.pageNo,
          "StatusCode": 1,
          "Name": [],
          "AccountGuids": [],
          "OpportunityNumbers": [],
          "SBUGuids": [],
          "VerticalGuids": [],
          "TCVS": [],
          "OwnerGuids": [this.UserID],
          "IsDesc": !childActionRecieved.filterData.sortOrder,
          "SortBy": childActionRecieved.filterData.sortColumn == 'OppName' ? 0 : childActionRecieved.filterData.sortColumn == 'OppID' ? 23 : childActionRecieved.filterData.sortColumn == 'account' ? 2 : childActionRecieved.filterData.sortColumn == 'SBU' ? 24 : childActionRecieved.filterData.sortColumn == 'vertical' ? 25 : childActionRecieved.filterData.sortColumn == 'OppOwner' ? 6 : childActionRecieved.filterData.sortColumn == 'oppType' ? 26 : 27
        }
        this.getTaggedListSearch(postData);
        break
      }
      default:
        return;
    }
  }
  getTaggedListSearch(postData) {
    this.paginationPageNo.PageSize = this.pageCount;
    this.paginationPageNo.RequestedPageNumber = this.pageNo;
    this.deals.getTaggedOpp(postData).subscribe(
      res => {
        console.log(res);
        if (res.IsError == false) {
          this.isLoading = false;
          this.filterConfigData.isFilterLoading = false;
          if (res.ResponseObject.length > 0) {
            let i = 1;
            res.ResponseObject.map(res => {
              res.index = i;
              i = i + 1;
            });
            this.dealsTable = this.getMappedData(res.ResponseObject);
            this.tableTotalCount = res.TotalRecordCount;
          } else {
            this.dealsTable = [{}];
            this.tableTotalCount = 0;
          }
        } else {
          this.filterConfigData.isFilterLoading = false;
          this.isLoading = false;
          this.dealsTable = [{}];
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
  //Mapping API reponse
  getMappedData(response) {
    console.log('tagged opportunities response-->', response);
    if (response.length > 0) {
      let Output = [];
      response.map(x => {
        let dealobject = {};
        dealobject["AccountGUID"] = x.Account.AccountId;
        dealobject["opportunityNumber"] = x.OpportunityNumber;
        dealobject["OpportunityIpId"] = x.OpportunityId;
        dealobject["isamedmentnumber"] = x.IsAmmendment == false ? 'No' : 'Yes';
        dealobject["orderId"] = x.OrderID;
        let obj = {
          OppID: this._validate.validate(x.IsAmmendment == false ? x.OpportunityNumber : x.OrderName)
            ? (x.IsAmmendment == false ? x.OpportunityNumber : x.OrderName)
            : "NA",
          OppName: this._validate.validate(x.OpportunityName)
            ? x.OpportunityName
            : "NA",
          OppOwner: this._validate.validate(x.OpportunityOwnerName)
            ? x.OpportunityOwnerName
            : "NA",
          SBU: this._validate.validate(x.Vertical.SBU.Name)
            ? x.Vertical.SBU.Name
            : "NA",
          TCV: this._validate.validate(x.EstimatedTCVPlain) ? this.getSymbol(x.EstimatedTCVPlain) : "NA",
          account: this._validate.validate(x.Account.Name)
            ? x.Account.Name
            : "NA",
          id: this._validate.validate(dealobject) ? dealobject : "NA",
          oppType: x.OpportunityType ? this._validate.validate(x.OpportunityType.Value)
            ? x.OpportunityType.Value
            : "NA" : "NA",
          vertical: this._validate.validate(x.Vertical.Name)
            ? x.Vertical.Name
            : "NA",
          isCheccked: false,
          isExpanded: false,
          index: x.index ? x.index : null
        };
        Output.push(obj);
      });
      return Output;
    } else {
      return [{}];
    }
  }
  getColumnOpportunityList(filteredData) {
    let input = {
      "SearchText": filteredData.objectRowData,
      "PageSize": 50,
      "RequestedPageNumber": this.filterConfigData[filteredData.filterData.headerName].PageNo,
      "OwnerId": this.UserID,
      "StatusCode": 1,
      "OpportunityNumber": "",
      "TCV": ""
    }
    this.deals.getColumnOpportunityList(input).subscribe((Res) => {
      if (Res.IsError == false) {
        this.filterConfigData.isFilterLoading = false;
        let i = 1;
        let j = 1
        let k = 1;
        let responseOppData: any[] = Res.ResponseObject.map(x => {
          let obj = {
            id: i,
            name: x.OpportunityName,
            isDatafiltered: false
          }
          i = i + 1;
          return obj
        })
        let responseOppIDData: any[] = Res.ResponseObject.map(x => {
          let obj = {
            id: j,
            name: x.OpportunityNumber,
            isDatafiltered: false
          }
          j = j + 1;
          return obj
        })
        let responseTCVDData: any[] = Res.ResponseObject.map(x => {
          let obj = {
            id: k,
            name: this.getSymbol(x.EstimatedTCVPlain),
            isDatafiltered: false
          }
          k = k + 1;
          return obj
        })
        if (filteredData.filterData.filterColumn.OppName.length > 0) {
          responseOppData.map(x => {
            filteredData.filterData.filterColumn.OppName.map(y => {
              x.id == y.id ? x.isDatafiltered = y.isDatafiltered : null
            })
          })
        }
        if (filteredData.filterData.filterColumn.OppID.length > 0) {
          responseOppIDData.map(x => {
            filteredData.filterData.filterColumn.OppID.map(y => {
              x.id == y.id ? x.isDatafiltered = y.isDatafiltered : null
            })
          })
        }
        if (filteredData.filterData.filterColumn.TCV.length > 0) {
          responseTCVDData.map(x => {
            filteredData.filterData.filterColumn.TCV.map(y => {
              x.id == y.id ? x.isDatafiltered = y.isDatafiltered : null
            })
          })
        }
        if (filteredData.action == "loadMoreFilterData") {
          this.filterConfigData.OppName.data.push(responseOppData);
          this.filterConfigData.OppID.data.push(responseOppIDData);
          this.filterConfigData.TCV.data.push(responseTCVDData);
          this.filterConfigData.OppName.recordCount = Res.ResponseObject.TotalRecordCount;
          this.filterConfigData.OppID.recordCount = Res.ResponseObject.TotalRecordCount;
          this.filterConfigData.TCV.recordCount = Res.ResponseObject.TotalRecordCount;
        } else {
          this.filterConfigData.OppName.data = responseOppData;
          this.filterConfigData.OppID.data = responseOppIDData;
          this.filterConfigData.TCV.data = responseTCVDData;
          this.filterConfigData.OppName.recordCount = Res.ResponseObject.TotalRecordCount;
          this.filterConfigData.OppID.recordCount = Res.ResponseObject.TotalRecordCount;
          this.filterConfigData.TCV.recordCount = Res.ResponseObject.TotalRecordCount;
        }

      } else {
        this.isLoading = false;
        this._error.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    }, error => {
      this.isLoading = false;
      this._error.throwError(
        "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
      );
    }
    );
  }
  getSymbol(data) {
    console.log(data)
   // return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
    return JSON.parse('"' + data + '"').split("?").join("")
  }

  getColumnOpportunityListName(filteredData){
    let input = {
      "SearchText": "",
      "ColumnSearchText": filteredData.objectRowData,
      "PageSize": 50,
      "RequestedPageNumber": this.filterConfigData[filteredData.filterData.headerName].PageNo,
      "StatusCode": 1,
      "Name": [],
      "AccountGuids": [],
      "OpportunityNumbers": [],
      "SBUGuids": [],
      "VerticalGuids": [],
      "OpportunityType": [],
      "TCVS": [],
      "OwnerGuids": [this.UserID]
    }

    this.deals.OpportunityName(input).subscribe((Res) => {
      console.log(Res)
      if (Res.IsError == false) {
        this.filterConfigData.isFilterLoading = false;
        let responseOwnerData: any[] = Res.ResponseObject.map(x => {
          let obj = {
            id: x.SysGuid,
            name: x.Name,
            isDatafiltered: false
          }
          return obj;
        })
        
        if (filteredData.action == "loadMoreFilterData") {
          responseOwnerData.map(x => this.filterConfigData.OppName.data.push(x));
          this.filterConfigData.OppName.recordCount = Res.TotalRecordCount;
        } else {
          this.filterConfigData.OppName.data = responseOwnerData;
          this.filterConfigData.OppName.recordCount = Res.TotalRecordCount;
        }

      }
      else {
        this.filterConfigData.isFilterLoading = false;
        this._error.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    }, error => {
      this.filterConfigData.isFilterLoading = false;
      this._error.throwError(
        "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
      );
    })
  }

  OpportunityNumbers(filteredData) {
    // let input = { 
    //   "AdId ": this.UserID, 
    //   "SearchText": filteredData.objectRowData, 
    //   "PageSize": 50, 
    //   "RequestedPageNumber": this.filterConfigData[filteredData.filterData.headerName].PageNo, 
    //   "OdatanextLink": "" 
    // }

    let input = {
      "SearchText": "",
      "ColumnSearchText": filteredData.objectRowData,
      "PageSize": 50,
      "RequestedPageNumber": this.filterConfigData[filteredData.filterData.headerName].PageNo,
      "StatusCode": 1,
      "Name": [],
      "AccountGuids": [],
      "OpportunityNumbers": [],
      "SBUGuids": [],
      "VerticalGuids": [],
      "OpportunityType": [],
      "TCVS": [],
      "OwnerGuids": [this.UserID]
    }

    this.deals.OpportunityNumbers(input).subscribe((Res) => {
      console.log(Res)
      if (Res.IsError == false) {
        this.filterConfigData.isFilterLoading = false;
        let responseOwnerData: any[] = Res.ResponseObject.map(x => {
          let obj = {
            id: x.SysGuid,
            name: x.Name,
            isDatafiltered: false
          }
          return obj;
        })
        
        if (filteredData.action == "loadMoreFilterData") {
          responseOwnerData.map(x => this.filterConfigData.OppID.data.push(x));
          this.filterConfigData.OppID.recordCount = Res.TotalRecordCount;
        } else {
          this.filterConfigData.OppID.data = responseOwnerData;
          this.filterConfigData.OppID.recordCount = Res.TotalRecordCount;
        }

      }
      else {
        this.filterConfigData.isFilterLoading = false;
        this._error.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    }, error => {
      this.filterConfigData.isFilterLoading = false;
      this._error.throwError(
        "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
      );
    })
  }

  getOwner(filteredData) {
    // let input = { 
    //   "AdId ": this.UserID, 
    //   "SearchText": filteredData.objectRowData, 
    //   "PageSize": 50, 
    //   "RequestedPageNumber": this.filterConfigData[filteredData.filterData.headerName].PageNo, 
    //   "OdatanextLink": "" 
    // }

    let input = {
      "SearchText": "",
      "ColumnSearchText": filteredData.objectRowData,
      "PageSize": 50,
      "RequestedPageNumber": this.filterConfigData[filteredData.filterData.headerName].PageNo,
      "StatusCode": 1,
      "Name": [],
      "AccountGuids": [],
      "OpportunityNumbers": [],
      "SBUGuids": [],
      "VerticalGuids": [],
      "OpportunityType": [],
      "TCVS": [],
      "OwnerGuids": [this.UserID]
    }

    this.deals.searchUser(input).subscribe((Res) => {
      if (Res.IsError == false) {
        this.filterConfigData.isFilterLoading = false;
        let responseOwnerData: any[] = Res.ResponseObject.map(x => {
          let obj = {
            id: x.SysGuid,
            name: x.Name,
            isDatafiltered: false
          }
          return obj;
        })
        if (filteredData.filterData.filterColumn.OppOwner.length > 0) {
          responseOwnerData.map(x => {
            filteredData.filterData.filterColumn.OppOwner.map(y => {
              x.id == y.id ? x.isDatafiltered = y.isDatafiltered : null
            })
          })
        }
        if (filteredData.action == "loadMoreFilterData") {
          responseOwnerData.map(x => this.filterConfigData.OppOwner.data.push(x));
          this.filterConfigData.OppOwner.recordCount = Res.TotalRecordCount;
        } else {
          this.filterConfigData.OppOwner.data = responseOwnerData;
          this.filterConfigData.OppOwner.recordCount = Res.TotalRecordCount;
        }

      }
      else {
        this.filterConfigData.isFilterLoading = false;
        this._error.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    }, error => {
      this.filterConfigData.isFilterLoading = false;
      this._error.throwError(
        "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
      );
    })
  }
  getAccount(filteredData) {
    // let input = {
    //   "SearchText": filteredData.objectRowData,
    //   "PageSize": 50,
    //   "RequestedPageNumber": this.filterConfigData[filteredData.filterData.headerName].PageNo,
    //   "OdatanextLink": ""
    // }
    let input = {
      "SearchText": "",
      "ColumnSearchText": filteredData.objectRowData,
      "PageSize": 50,
      "RequestedPageNumber": this.filterConfigData[filteredData.filterData.headerName].PageNo,
      "StatusCode": 1,
      "Name": [],
      "AccountGuids": [],
      "OpportunityNumbers": [],
      "SBUGuids": [],
      "VerticalGuids": [],
      "OpportunityType": [],
      "TCVS": [],
      "OwnerGuids": [this.UserID]
    }
  
    this.deals.searchAccount(input).subscribe((Res) => {
      if (Res.IsError == false) {
        this.filterConfigData.isFilterLoading = false;
        let responseOwnerData: any[] = Res.ResponseObject.map(x => {
          let obj = {
            id: x.SysGuid,
            name: x.Name,
            isDatafiltered: false
          }
          return obj;
        })
        if (filteredData.filterData.filterColumn.account.length > 0) {
          responseOwnerData.map(x => {
            filteredData.filterData.filterColumn.account.map(y => {
              x.id == y.id ? x.isDatafiltered = y.isDatafiltered : null
            })
          })
        }
        if (filteredData.action == "loadMoreFilterData") {
          responseOwnerData.map(x => this.filterConfigData.account.data.push(x));
          this.filterConfigData.account.recordCount = Res.TotalRecordCount;
        } else {
          this.filterConfigData.account.data = responseOwnerData;
          this.filterConfigData.account.recordCount = Res.TotalRecordCount;
        }

      }
      else {
        this.filterConfigData.isFilterLoading = false;
        this._error.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    }, error => {
      this.filterConfigData.isFilterLoading = false;
      this._error.throwError(
        "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
      );
    })
  }
  getVertical(filteredData) {
    // let input = {
    //   "SearchText": filteredData.objectRowData,
    //   "PageSize": 50,
    //   "RequestedPageNumber": this.filterConfigData[filteredData.filterData.headerName].PageNo,
    //   "OdatanextLink": ""
    // }

    let input = {
      "SearchText": "",
      "ColumnSearchText": filteredData.objectRowData,
      "PageSize": 50,
      "RequestedPageNumber": this.filterConfigData[filteredData.filterData.headerName].PageNo,
      "StatusCode": 1,
      "Name": [],
      "AccountGuids": [],
      "OpportunityNumbers": [],
      "SBUGuids": [],
      "VerticalGuids": [],
      "OpportunityType": [],
      "TCVS": [],
      "OwnerGuids": [this.UserID]
    }
    this.deals.searchVertical(input).subscribe((Res) => {
      console.log(Res)
      if (Res.IsError == false) {
        this.filterConfigData.isFilterLoading = false;
        let responseOwnerData: any[] = Res.ResponseObject.map(x => {
          let obj = {
            id: x.SysGuid,
            name: x.Name,
            isDatafiltered: false
          }
          return obj;
        })
        if (filteredData.filterData.filterColumn.vertical.length > 0) {
          responseOwnerData.map(x => {
            filteredData.filterData.filterColumn.vertical.map(y => {
              x.id == y.id ? x.isDatafiltered = y.isDatafiltered : null
            })
          })
        }
        if (filteredData.action == "loadMoreFilterData") {
          responseOwnerData.map(x => this.filterConfigData.vertical.data.push(x));
          this.filterConfigData.vertical.recordCount = Res.TotalRecordCount;
        } else {
          this.filterConfigData.vertical.data = responseOwnerData;
          this.filterConfigData.vertical.recordCount = Res.TotalRecordCount;
        }

      }
      else {
        this.filterConfigData.isFilterLoading = false;
        this._error.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    }, error => {
      this.filterConfigData.isFilterLoading = false;
      this._error.throwError(
        "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
      );
    })
  }
  getSBU(filteredData) {
    // let input = {
    //   "SearchText": filteredData.objectRowData,
    //   "PageSize": 50,
    //   "RequestedPageNumber": this.filterConfigData[filteredData.filterData.headerName].PageNo,
    //   "OdatanextLink": ""
    // }

    let input = {
      "SearchText": "",
      "ColumnSearchText": filteredData.objectRowData,
      "PageSize": 50,
      "RequestedPageNumber": this.filterConfigData[filteredData.filterData.headerName].PageNo,
      "StatusCode": 1,
      "Name": [],
      "AccountGuids": [],
      "OpportunityNumbers": [],
      "SBUGuids": [],
      "VerticalGuids": [],
      "OpportunityType": [],
      "TCVS": [],
      "OwnerGuids": [this.UserID]
    }

    this.deals.searchSBU(input).subscribe((Res) => {
      console.log(Res)
      if (Res.IsError == false) {
        this.filterConfigData.isFilterLoading = false;
        let responseOwnerData: any[] = Res.ResponseObject.map(x => {
          let obj = {
            id: x.SysGuid,
            name: x.Name,
            isDatafiltered: false
          }
          return obj;
        })
        if (filteredData.filterData.filterColumn.SBU.length > 0) {
          responseOwnerData.map(x => {
            filteredData.filterData.filterColumn.SBU.map(y => {
              x.id == y.id ? x.isDatafiltered = y.isDatafiltered : null
            })
          })
        }
        if (filteredData.action == "loadMoreFilterData") {
          responseOwnerData.map(x => this.filterConfigData.SBU.data.push(x));
          this.filterConfigData.SBU.recordCount = Res.TotalRecordCount;
        } else {
          this.filterConfigData.SBU.data = responseOwnerData;
          this.filterConfigData.SBU.recordCount = Res.TotalRecordCount;
        }

      }
      else {
        this.filterConfigData.isFilterLoading = false;
        this._error.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    }, error => {
      this.filterConfigData.isFilterLoading = false;
      this._error.throwError(
        "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
      );
    })
  }

  getTCV(filteredData){
    let input = {
      "SearchText": "",
      "ColumnSearchText": filteredData.objectRowData,
      "PageSize": 50,
      "RequestedPageNumber": this.filterConfigData[filteredData.filterData.headerName].PageNo,
      "StatusCode": 1,
      "Name": [],
      "AccountGuids": [],
      "OpportunityNumbers": [],
      "SBUGuids": [],
      "VerticalGuids": [],
      "OpportunityType": [],
      "TCVS": [],
      "OwnerGuids": [this.UserID]
    }

    this.deals.searchOppTCV(input).subscribe((Res) => {
      console.log(Res)
      if (Res.IsError == false) {
        this.filterConfigData.isFilterLoading = false;
        let responseOwnerData: any[] = Res.ResponseObject.map(x => {
          let obj = {
            id: x.SysGuid,
            name: x.Name,
            isDatafiltered: false
          }
          return obj;
        })
       
        if (filteredData.filterData.filterColumn.TCV.length > 0) {
          responseOwnerData.map(x => {
            filteredData.filterData.filterColumn.TCV.map(y => {
              x.id == y.id ? x.isDatafiltered = y.isDatafiltered : null
            })
          })
        }
        if (filteredData.action == "loadMoreFilterData") {
          responseOwnerData.map(x => this.filterConfigData.TCV.data.push(x));
          this.filterConfigData.TCV.recordCount = Res.TotalRecordCount;
        } else {
          this.filterConfigData.TCV.data = responseOwnerData;
          this.filterConfigData.TCV.recordCount = Res.TotalRecordCount;
        }

      }
      else {
        this.filterConfigData.isFilterLoading = false;
        this._error.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    }, error => {
      this.filterConfigData.isFilterLoading = false;
      this._error.throwError(
        "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
      );
    })
  }

  getOppType(filteredData){
    let input = {
      "SearchText": "",
      "ColumnSearchText": filteredData.objectRowData,
      "PageSize": 50,
      "RequestedPageNumber": this.filterConfigData[filteredData.filterData.headerName].PageNo,
      "StatusCode": 1,
      "Name": [],
      "AccountGuids": [],
      "OpportunityNumbers": [],
      "SBUGuids": [],
      "VerticalGuids": [],
      "OpportunityType": [],
      "TCVS": [],
      "OwnerGuids": [this.UserID]
    }

    this.deals.searchOppType(input).subscribe((Res) => {
      console.log(Res)
      if (Res.IsError == false) {
        this.filterConfigData.isFilterLoading = false;
        let responseOwnerData: any[] = Res.ResponseObject.map(x => {
          let obj = {
            id: x.SysGuid,
            name: x.Name,
            isDatafiltered: false
          }
          return obj;
        })
        if (filteredData.filterData.filterColumn.oppType.length > 0) {
          responseOwnerData.map(x => {
            filteredData.filterData.filterColumn.oppType.map(y => {
              x.id == y.id ? x.isDatafiltered = y.isDatafiltered : null
            })
          })
        }
        if (filteredData.action == "loadMoreFilterData") {
          responseOwnerData.map(x => this.filterConfigData.oppType.data.push(x));
          this.filterConfigData.oppType.recordCount = Res.TotalRecordCount;
        } else {
          this.filterConfigData.oppType.data = responseOwnerData;
          this.filterConfigData.oppType.recordCount = Res.TotalRecordCount;
        }

      }
      else {
        this.filterConfigData.isFilterLoading = false;
        this._error.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    }, error => {
      this.filterConfigData.isFilterLoading = false;
      this._error.throwError(
        "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
      );
    })
  }
  
  ngOndestroy() {
    this.taggedSubcriber$.unsubscribe();
  }
}
