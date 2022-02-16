import { Component, OnInit, Inject, OnChanges, OnDestroy } from "@angular/core";
import {
  DataCommunicationService,
  ErrorMessage,
  OnlineOfflineService
} from "@app/core";
import { dealService } from "@app/core/services/deals.service";
import { Observable, of, Subscription } from "rxjs";
import { Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { AppState } from "@app/core/state";
import { selectDealTechSolutionList } from "@app/core/state/selectors/deals/deal-tech-soluction.selectors";
import { GetDealTechSolutionList } from "@app/core/state/actions/deals.actions";
import { EncrDecrService } from "@app/core/services/encr-decr.service";
import { ExistingDealsList } from "@app/core/state/state.models/deals/existing-deals.interface";
import {
  DataCommService,
  NewDocStatusService
} from "@app/core/services/datacomm/data-comm.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import { find } from "rxjs/operators";
import { TableFilterService } from "@app/core/services/datacomm/tableFilter.service";
import { GetSetMethod } from "@app/core/services/deals/deal-setget.service";
import { TimeScale } from "@syncfusion/ej2-schedule/src/schedule/models/time-scale";
import { RecursiveTree } from "@app/core/services/datacomm/multi-level-table";
import { environment as env } from "@env/environment";
import { FacadeService } from "@app/core/services/facade.service";
import { EnvService } from "@app/core/services/env.service";
declare let FileTransfer: any;

const config = {
  generalErrMsg:
    "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?",
  fileLock: "File has been locked",
  fileNotFound: "File not found",
  offline: "No internet. Please check your internet connectivity",
  authorizationMsg: "Your are not authorised to perform this action",
  notAllowed:
    "You are not allowed to open this document as the status is closed"
};

@Component({
  selector: "app-deal-tech-solution",
  templateUrl: "./deal-tech-solution.component.html",
  styleUrls: ["./deal-tech-solution.component.scss"]
})
export class DealTechSolutionComponent implements OnInit, OnChanges, OnDestroy {
  isLoading: boolean = false;
  tableTotalCount: number = 0;
  pageCount = 10;
  pageNo: number = 1;
  Searchtext: string = "";
  lastRecordId: number = 0;
  checkNewDoc: boolean;
  $subScription: Subscription = new Subscription();

  existingTable: any[] = [{}];
  deal: any;
  adid: any;

  paginationPageNo = {
    PageSize: 10,
    RequestedPageNumber: 1,
    OdatanextLink: "",
    FilterData: []
  };

  filterConfigData = {
    indxparent: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    module: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    author: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    appReq: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    approver: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    status: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    escalation: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    approverAdvance: { data: [], recordCount: 0, PageNo: 1, NextLink: "" },
    isFilterLoading: true
  };

  constructor(
    public service: DataCommunicationService,
    public router: Router,
    private getSetData: GetSetMethod,
    public store: Store<AppState>,
    private encrDecrService: EncrDecrService,
    public onlineOfflineService: OnlineOfflineService,
    public newDocStatusService: NewDocStatusService,
    private facadeService: FacadeService,
    public envr : EnvService
  ) { }

  loadDocuments(): void {
    //this.dealService.proposals()
  }

  async ngOnInit() {
    this.deal = JSON.parse(
      this.encrDecrService.get(
        "EncryptionEncryptionEncryptionEn",
        sessionStorage.getItem("Dealoverview"),
        this.envr.encDecConfig.key
      )
    );
    this.adid = this.encrDecrService.get(
      "EncryptionEncryptionEncryptionEn",
      localStorage.getItem("adid"),
      "DecryptionDecrip"
    );
    try {
      this.newDocStatusService.getBehaviorView().subscribe(res => {
        this.checkNewDoc = res;
      });
      if (this.checkNewDoc) {
        this.getProposalsList(1);
        this.newDocStatusService.setBehaviorView(undefined);
        this.checkNewDoc = undefined;
      } else {
        this.$subScription = this.store
          .pipe(select(selectDealTechSolutionList))
          .subscribe(
            res => {
              if (res.dealTechSolution) {
                if (res.dealTechSolution.length > 0) {
                  this.existingTable = res.dealTechSolution;
                  this.tableTotalCount = res.dealTechSolution[0].totalCount;
                } else {
                  if (this.onlineOfflineService.isOnline) {
                    this.getProposalsList(1);
                  }
                }
              } else {
                if (this.onlineOfflineService.isOnline) {
                  this.getProposalsList();
                }
              }
            },
            err => {
              console.log("Error", err);
              if (this.onlineOfflineService.isOnline) {
                this.getProposalsList();
              }
              this.existingTable = [{}];
              this.facadeService.errMsg(config.generalErrMsg);
            }
          );
      }
    } catch {
      this.existingTable = [{}];
      this.facadeService.errMsg(config.generalErrMsg);
    }

    try {
      if (!this.onlineOfflineService.isOnline) {
        const CacheResponse = await this.facadeService.getDealTechSolutionCacheData();
        console.log("CacheResponse-->", CacheResponse);
        if (CacheResponse) {
          if (CacheResponse.data.length > 0) {
            this.isLoading = false;
            this.existingTable = CacheResponse.data;
            this.tableTotalCount = CacheResponse.data[0].totalCount;
          }
        }
        // this.facadeService.errMsg(config.offline);
      }
    } catch {
      this.existingTable = [{}];
      this.facadeService.errMsg(config.generalErrMsg);
    }
  }

  ngOnChanges() { }

  // proposalsDataRequest = {
  //   "Id": 1, //this.deal.id,
  //   "LastRecordId": this.pageNo,
  //   "PageSize": this.pageCount ? this.pageCount : 10
  // }

  getProposalsList(startIdx?) {
    this.isLoading = true;
    try {
      let payload = {
        Id: this.deal.id,
        LastRecordId: this.pageNo, //this.lastRecordId,
        PageSize: this.pageCount ? this.pageCount : 10,
        UserID: this.adid
      };
      this.$subScription = this.facadeService
        .getProposalList(payload)
        .subscribe(
          (res: any) => {
            if (res) {
              if (res.IsError) {
                this.isLoading = false;
                this.existingTable = [{}];
                this.facadeService.errMsg(config.generalErrMsg);
              }
              if (res.ResponseObject.length > 0) {
                this.tableTotalCount = res.ResponseObject[0].TotalCount;
                if (this.tableTotalCount > this.existingTable.length) {
                  if (this.existingTable.length > 0 && this.pageNo > 1) {
                    this.existingTable = this.existingTable.concat(
                      this.proposalMapping(res.ResponseObject, startIdx)
                    );
                    console.log(this.existingTable);
                  } else {
                    this.existingTable = this.proposalMapping(
                      res.ResponseObject,
                      1
                    );
                  }
                  this.store.dispatch(
                    new GetDealTechSolutionList({
                      dealTechArrayList: undefined,
                      count: undefined
                    })
                  );
                  this.store.dispatch(
                    new GetDealTechSolutionList({
                      dealTechArrayList: this.existingTable,
                      count: this.tableTotalCount
                    })
                  );
                } else {
                  this.existingTable = this.proposalMapping(
                    res.ResponseObject,
                    1
                  );
                }
                this.isLoading = false;
              } else {
                this.isLoading = false;
                this.facadeService.errMsg("No records found");
                this.existingTable = [{}];
              }
            } else {
              this.isLoading = false;
              this.facadeService.errMsg(config.generalErrMsg);
              this.existingTable = [{}];
            }
          },
          error => {
            this.isLoading = false;
            this.existingTable = [{}];
            this.facadeService.errMsg(config.generalErrMsg);
          }
        );
    } catch {
      this.existingTable = [{}];
      this.facadeService.errMsg(config.generalErrMsg);
    }
  }

  responseKey = [
    "Name",
    "Module.Name",
    "CreatedBy",
    "isApprovalReq",
    "ProposalStatus",
    "Escalation"
  ];
  performTableChildAction(childActionRecieved): Observable<any> {
    var actionRequired = childActionRecieved;
    console.log(actionRequired);
    switch (actionRequired.action) {
      case "edit": {
        if (actionRequired.objectRowData[0].proposal) {
          sessionStorage.setItem(
            "proposalEditData",
            JSON.stringify(actionRequired.objectRowData[0])
          );
          this.router.navigate(["/deals/editDocument"]);
          return;
        } else {
          window.open(actionRequired.objectRowData[0].path);
          return;
        }
      }
      // case 'lock': {
      //   this.onFileLock(actionRequired.objectRowData);
      //   return;
      // }
      // case 'delete': {
      //   sessionStorage.setItem('redirectToAction', '0');
      //   this.onDeleteFile(actionRequired.objectRowData);
      //   return;
      // }
      case "search": {
        console.log(actionRequired);
        this.Searchtext = actionRequired.objectRowData;
        this.searchTableData(actionRequired);
        return;
      }
      case "indxparent": {
        if (actionRequired.objectRowData[0].path) {
          if (!actionRequired.objectRowData[0].isLock) {
            let foundAuthor = actionRequired.objectRowData[0].authorAdids.find(
              x => x === this.adid
            );
            let foundApprover = actionRequired.objectRowData[0].approverAdids.find(
              x => x === this.adid
            );
            if (
              foundAuthor !== undefined ||
              foundApprover !== undefined ||
              this.facadeService.dealOwner().IsRoleMappedToUser
            ) {
              if (
                actionRequired.objectRowData[0].status.toLowerCase() !==
                "closed"
              ) {
                window.open(actionRequired.objectRowData[0].path);
              } else {
                this.facadeService.errMsg(config.notAllowed);
              }
              return;
            } else {
              this.facadeService.errMsg(config.authorizationMsg);
              return;
            }
          } else {
            this.facadeService.errMsg(config.fileLock);
          }
        } else {
          this.facadeService.errMsg(config.fileNotFound);
        }
        return;
      }
      case "goToAction": {
        this.onGotoAction(actionRequired.objectRowData);
        return;
      }
      case "ClearAllFilter": {
        this.getProposalsList(1);
        return;
      }
      case "columnFilter":
      case "loadMoreFilterData":
      case "columnSearchFilter": {
        const uiTableAPIResponseKeyValueMap = {
          indxparent: "Name",
          module: "Module",
          author: "CreatedBy",
          appReq: "IsApprovalReq",
          approver: "Approver",
          status: "StatusName",
          escalation: "Escalation",
          approverAdvance: "Approver"
        };
        switch (childActionRecieved.filterData.headerName) {
          case childActionRecieved.filterData.headerName: {
            // if(childActionRecieved.filterData.headerName === 'approver') {
            //   childActionRecieved.filterData.headerName = 'approverAdvance'
            // }
            let input = {
              Id: this.deal.id,
              LastRecordId: 0,
              PageSize:
                10 *
                this.filterConfigData[childActionRecieved.filterData.headerName]
                  .PageNo,
              UserID: this.adid,
              SearchTextOnColumn:
                childActionRecieved.filterData.columnSerachKey || "",
              FilterByPropertyName:
                uiTableAPIResponseKeyValueMap[
                childActionRecieved.filterData.headerName
                ],
              SearchText: childActionRecieved.filterData.isApplyFilter
                ? this.mapSearchText(
                  childActionRecieved,
                  uiTableAPIResponseKeyValueMap
                )
                : "",
              SortByPropertyName: "" || ""
            };
            this.facadeService.getProposalList(input).subscribe((res: any) => {
              if (!res.IsError) {
                this.filterConfigData[
                  childActionRecieved.filterData.headerName
                ].recordCount = this.filterConfigData[
                  childActionRecieved.filterData.headerName
                ].data.length;
                //this.filterConfigData[childActionRecieved.filterData.headerName].data = this.dealService.getHeaderData(uiTableAPIResponseKeyValueMap[childActionRecieved.filterData.headerName], res.ResponseObject);
                let mappedObject = this.proposalMapping(res.ResponseObject, 1);
                this.filterConfigData[
                  childActionRecieved.filterData.headerName
                ].data = this.facadeService.filterHeaderValue(
                  childActionRecieved.filterData,
                  mappedObject
                );
                this.filterConfigData.isFilterLoading = false;
                if (childActionRecieved.filterData.isApplyFilter) {
                  this.existingTable = this.proposalMapping(
                    res.ResponseObject,
                    1
                  );
                  this.tableTotalCount = res.ResponseObject[0].TotalCount;
                }
                childActionRecieved.filterData.isApplyFilter = false;
              }
            });
            break;
          }
        }
        return;
      }
      case "send":
      case "Approvar":
      case "reject": {
        sessionStorage.setItem("redirectToAction", "0");
        this.isLoading = true;
        if (!actionRequired.objectRowData[0].proposal) {
          let reqPayload = {
            wpSectionId: actionRequired.objectRowData[0].wpSectionId
          };
          this.facadeService.wittyMoveToNext(reqPayload).subscribe(res => {
            if (res.errorInfo) {
              this.isLoading = false;
              this.facadeService.errMsg(res.errorInfo[0].message);
              return;
            }
            if (actionRequired.action == "send") {
              this.facadeService.errMsg("Section has been sent for approval");
            } else if (actionRequired.action == "Approvar") {
              this.facadeService.errMsg(
                "Section has been approved successfully"
              );
            } else {
              this.facadeService.errMsg(
                "Section has been rejected and sent for rework"
              );
            }
            this.getProposalsList(1);
            this.isLoading = false;
          });
          return;
        } else {
          let reqPayload = {
            SearchText: actionRequired.action == "reject" ? 0 : 1,
            Id: actionRequired.objectRowData[0].id,
            LastRecordId: this.pageNo,
            PageSize: this.pageCount ? this.pageCount : 10,
            UserID: this.adid,
            Parent: this.deal.id
          };
          this.facadeService.proposalChangeStatus(reqPayload).subscribe(res => {
            console.log("proposalChangeStatus", res);
            if (!res.IsError) {
              if (actionRequired.action == "send") {
                this.facadeService.errMsg(
                  "Document has been sent for approval"
                );
              } else if (actionRequired.action == "Approvar") {
                this.facadeService.errMsg(
                  "Document has been approved successfully"
                );
              } else {
                this.facadeService.errMsg(
                  "Document has been rejected and sent for rework"
                );
              }
              this.getProposalsList(1);
              this.isLoading = false;
              return;
            }
            this.isLoading = false;
            this.facadeService.errMsg(res.Message);
            return;
          });
        }
        return;
      }

      case "Download": {
        this.downloadFile(actionRequired.objectRowData);
        return;
      }
    }
  }

  postData = [];
  str = "";
  res = "";
  mapSearchText(childActionRecieved, uiTableAPIResponseKeyValueMap) {
    if (childActionRecieved.filterData.headerName === "appReq") {
      for(let i = 0; i < childActionRecieved.filterData.filterColumn.appReq.length; i++) {
        if(childActionRecieved.filterData.filterColumn.appReq[i].name === "Yes") {
          childActionRecieved.filterData.filterColumn.appReq[i].name = true;
        } else {
          childActionRecieved.filterData.filterColumn.appReq[i].name = false;
        }
      }

    }
    childActionRecieved.filterData.order.map((x, i) => {
      i != 0 ? this.postData.push("|||") : "";
      switch (x) {
        case childActionRecieved.filterData.headerName: {
          childActionRecieved.filterData.filterColumn[
            childActionRecieved.filterData.headerName
          ].map((x, index) => {
            index == 0
              ? this.postData.push(
                uiTableAPIResponseKeyValueMap[
                childActionRecieved.filterData.headerName
                ] +
                "!!!" +
                x.name
              )
              : this.postData.push(x.name);
          });
          break;
        }
      }
    });
    this.str = this.postData.join();
    this.res = this.str.split(",|||,").join("|||");
    return this.res;
  }

  // onFileLock(data): void {
  //   try {
  //     let payload = {
  //       "Id": data.id,
  //       "IsLock": true,
  //       'UserID': this.adid
  //     }
  //     this.dealService.lockDocument(payload)
  //       .subscribe(res => {
  //         if (!res.IsError) {
  //           const index = this.existingTable.findIndex(x => x.id === data.id);
  //           this.existingTable[index].isLock = true;
  //           let sub = this.existingTable[index].subData;
  //           for (let x of sub) {
  //             x.isLock = true;
  //           }
  //           this.store.dispatch(new GetDealTechSolutionList({ dealTechArrayList: this.existingTable, count: this.tableTotalCount }))
  //           this.facadeService.errMsg(res.Message);
  //         }
  //       }, err => {
  //         this.facadeService.errMsg(err.Message);
  //       });
  //   } catch {
  //     this.existingTable = [{}];
  //     this.facadeService.errMsg(config.generalErrMsg);
  //   }
  // }

  // onDeleteFile(data): void {
  //   this.isLoading = true;
  //   let payload = {
  //     "Id": data.id,
  //     'UserID': this.adid
  //   }
  //   try {
  //     this.dealService.deleteProposal(payload)
  //       .subscribe(res => {
  //         if (!res.IsError) {
  //           this.isLoading = false;
  //           this.existingTable = this.existingTable.filter(x => x.id !== data.id)
  //           this.tableTotalCount = this.tableTotalCount - 1;
  //           this.store.dispatch(new GetDealTechSolutionList({ dealTechArrayList: this.existingTable, count: this.tableTotalCount }))
  //           this.facadeService.errMsg(res.Message);
  //         } else {
  //           this.isLoading = false;
  //           this.facadeService.errMsg(res.Message);
  //         }
  //       }, err => {
  //         this.isLoading = false;
  //         this.facadeService.errMsg(err.Message);
  //       });
  //   } catch {
  //     this.isLoading = false;
  //     this.facadeService.errMsg(config.generalErrMsg);
  //   }
  //   this.isLoading = false;
  // }

  onGotoAction(data) {
    console.log(data);
    this.isLoading = true;
    try {
      let payload = {
        Id: data.id
      };
      this.facadeService.proposalActionRedirect(payload).subscribe(
        res => {
          if (!res.IsError) {
            //sessionStorage.setItem('redirectToAction', JSON.stringify(res.ResponseObject));
            this.isLoading = false;
            sessionStorage.setItem("routingTab", "1");
            this.getSetData.setData(res.ResponseObject[0].Id);
            this.router.navigate(["/deals/createAction"]);
          } else {
            this.isLoading = false;
            this.facadeService.errMsg(config.generalErrMsg);
          }
        },
        err => {
          this.isLoading = false;
          this.facadeService.errMsg(config.generalErrMsg);
        }
      );
    } catch {
      this.isLoading = false;
      this.facadeService.errMsg(config.generalErrMsg);
    }
  }

  searchTableData(data): void {
    this.isLoading = true;
    this.paginationPageNo.RequestedPageNumber = 1;
    this.paginationPageNo.OdatanextLink = "";
    try {
      if (data != "") {
        if (data.objectRowData != "" && data.objectRowData != undefined) {
          let payload = {
            Id: this.deal.id,
            LastRecordId: this.pageNo,
            PageSize: this.pageCount ? this.pageCount : 10,
            SearchTextOnColumn: data.objectRowData,
            IsGlobalSearchText: true,
            FilterByPropertyName: "Name",
            UserID: this.adid
          };
          this.facadeService.getProposalList(payload).subscribe((res: any) => {
            if (!res.IsError) {
              if (res.ResponseObject.length > 0) {
                this.existingTable = this.proposalMapping(
                  res.ResponseObject,
                  1
                );
                this.tableTotalCount = res.ResponseObject[0].TotalCount;
                this.isLoading = false;
                console.log(res.ResponseObject);
              } else {
                this.isLoading = false;
                this.facadeService.errMsg("No records found");
                this.existingTable = [{}];
              }
            } else {
              this.isLoading = false;
              this.facadeService.errMsg(res.Message);
              this.existingTable = [{}];
            }
          });
        } else {
          this.getProposalsList(1);
        }
      }
    } catch {
      this.facadeService.errMsg(config.generalErrMsg);
    }
    this.isLoading = false;
  }

  pagination(event) {
    console.log(event);
    switch (event.action) {
      case "pagination": {
        this.pageNo = event.currentPage;
        this.pageCount = event.itemsPerPage;
        this.paginationPageNo.RequestedPageNumber = event.currentPage;
        this.paginationPageNo.PageSize = event.itemsPerPage;
        let startIndex = (event.currentPage - 1) * event.itemsPerPage + 1;
        this.getProposalsList(startIndex);
      }
    }
    // proposalsDataRequest.PageSize = data.itemsPerPage
    // this.dealService.proposals(proposalsDataRequest)
    //   .subscribe((x) => { console.log(x); });
  }

  proposalMapping(res, index) {
    console.log(res);
    try {
      if (res.length > 0) {
        let mappedObject = [];
        let indexId = index;
        res.map(x => {
          let apiToUiMapping = {
            id: x.Id ? x.Id : 0,
            approverData: [
              {
                FullName: x.Approver ? x.Approver[0].Employee.FullName : "",
                AdId: x.Approver ? x.Approver[0].Employee.AdId : "",
                Id: x.Approver ? x.Approver[0].Employee.Id : ""
              }
            ],
            indxparent: x.Name ? x.Name.split("_").pop() : "-",
            module: x.Module.Name ? x.Module.Name : "-",
            author: x.CreatedBy
              ? x.CreatedBy.split("|")
                .pop()
                .split("(")[0]
              : "-", // correction needed
            appReq: x.IsApprovalReq ? "Yes" : "No",
            approver: x.Approver ? this.splitUserName(x.Approver) : "-",
            status: x.StatusName
              ? x.StatusName.replace(/([A-Z])/g, " $1").trim()
              : "-",
            statusId: x.ProposalStatus ? x.ProposalStatus : "0",
            escalation: x.Escalation ? x.Escalation.split("|").pop() : "-",
            subData: x.Sections
              ? this.sectionMapping(x)
              : this.sectionMapping({}),
            submissionDate: x.SubmissionDate,
            template: x.Template ? x.Template : "-",
            templateType: x.TemplateType ? x.TemplateType : "-",
            path: x.Path ? x.Path : "-",
            totalCount: x.TotalCount ? x.TotalCount : 0,
            actionId: x.ActionId ? x.ActionId : 0,
            sPUniqueId: x.SPUniqueId ? x.SPUniqueId : "-",
            isLock:
              (this.facadeService.dealTeam().IsRoleMappedToUser ||
                this.facadeService.dealOwner().IsRoleMappedToUser) &&
                x.IsLock
                ? true
                : false,
            //previewDoc: true,
            isDelete: x.IsActive,
            fileLockBtnVisibility:
              this.facadeService.dealTeam().IsRoleMappedToUser ||
                this.facadeService.dealOwner().IsRoleMappedToUser
                ? false
                : true,
            editBtnVisibility: x.EditButton ? false : true,
            approverBtnVisibility: x.ApprovedButton ? false : true,
            sendBtnVisibility: x.SubmitButton ? false : true,
            rejectBtnVisibility: x.SentForReworkButton ? false : true,
            rowDownloadBtnVisibility: x.DownalodButton ? false : true,
            authorAdids: x.CreatedBy ? [x.CreatedBy.split("|")[0].trim()] : [],
            approverAdids: x.Approver ? this.splitAdid(x.Approver) : [],
            approverAdvance: x.Approver ? this.joinAdidName(x.Approver) : [],
            proposal: true,
            index: indexId
          };
          mappedObject.push(apiToUiMapping);
          indexId = indexId + 1;
        });
        this.lastRecordId = mappedObject[mappedObject.length - 1].id;
        return mappedObject;
      }
      return [{}];
    } catch {
      this.facadeService.errMsg(config.generalErrMsg);
    }
  }

  sectionMapping(res?) {
    if (res.Sections == undefined) {
      return [];
    }
    try {
      if (res.Sections.length > 0) {
        let locked = res.IsLock;
        let data = [];
        let indexId = 1;
        res.Sections.map((x, i) => {
          let subObj = {
            id: x.Id ? x.Id : 0,
            indxparent: x.Name ? x.Name : "-",
            module: x.Module.Name ? x.Module.Name : "-",
            author: x.Author ? this.splitUserName(x.Author) : "-",
            appReq: x.IsApprovalReq ? "Yes" : "No",
            approver: x.Approver ? this.splitUserName(x.Approver) : "-",
            status: x.TaskStatusName
              ? x.TaskStatusName.replace(/([A-Z])/g, " $1").trim()
              : "-",
            escalation: x.Escalation ? x.Escalation.split("|").pop() : "-",
            submissionDate: x.SubmissionDate,
            template: x.Template ? x.Template : "-",
            templateType: x.TemplateType ? x.TemplateType : "-",
            path: x.Url ? x.Url : "-",
            totalCount: x.TotalCount ? x.TotalCount : 0,
            previewDoc: false,
            isLock: locked,
            wpSectionId: x.WPSectionId,

            editBtnVisibility: x.EditButton ? false : true,
            approverBtnVisibility: x.ApprovedButton ? false : true,
            sendBtnVisibility: x.SubmitButton ? false : true,
            rejectBtnVisibility: x.SentForReworkButton ? false : true,
            rowDownloadBtnVisibility: x.DownalodButton ? false : true,
            authorAdids: x.Author ? this.splitAdid(x.Author) : [],
            approverAdids: x.Approver ? this.splitAdid(x.Approver) : [],

            proposal: false,
            index: indexId
          };
          data.push(subObj);
          indexId = indexId + 1;
        });
        return data;
      } else {
        return [];
      }
    } catch {
      this.facadeService.errMsg(config.generalErrMsg);
    }
  }

  joinAdidName(res): string[] {
    let approver = [];
    for (let i of res) {
      approver.push(i.Employee.AdId + "|" + i.Employee.FullName);
    }
    return approver;
  }
  splitUserName(res): string[] {
    let users = [];
    for (let i of res) {
      users.push(
        i.Employee.FullName.split("|")
          .pop()
          .trim()
          .split("(")[0]
      );
    }
    return users;
  }
  splitAdid(res): string[] {
    let adid = [];
    for (let i of res) {
      adid.push(i.Employee.AdId.split("|")[0].trim());
    }
    return adid;
  }

  tbleBtnVisibility(res) {
    let adidList = [];
    for (let i of res) {
      adidList.push(i.Employee.AdId.split("|")[0].trim());
    }
    let found = adidList.find(x => x === this.adid);
    if (found) {
      return false;
    }
    return true;
  }

  onCreateNewDoc() {
    this.service.chatBot = true;
    this.service.chatbotDA = true;
    this.service.sideTrans = true;
    this.service.chatBot = !this.service.chatBot;

    if (
      this.facadeService.dealTeam().IsRoleMappedToUser ||
      this.facadeService.dealOwner().IsRoleMappedToUser
    ) {
      this.router.navigate(["/deals/createDocument"]);
    } else {
      this.facadeService.errMsg("Access denied");
    }
  }

  sendForApproval(data) {
    let payload = {
      wpSectionId: data[0].wpSectionId
    };
    this.facadeService.wittyMoveToNext(payload).subscribe(res => {
      console.log("sendForApproval response", res);
      if (res.errorInfo) {
        this.facadeService.errMsg(res.errorInfo[0].message);
        return;
      }
      this.getProposalsList(1);
      this.facadeService.errMsg(res.Message);
    });
    console.log("sendForApproval", data);
  }

  downloadFile(data) {
    this.isLoading = true;
    if (this.envr.envName === "MOBILEQA") {
      var fileTransfer = new FileTransfer();
      let path = data[0].path.split("?")[0];
      var uri = encodeURI(path);
      var fileURL = "///storage/emulated/0/Download/" + data[0].indxparent;
      this.facadeService.errMsg(
        `${data[0].indxparent} downloaded and available in Download directory`
      );
      this.isLoading = false;
      fileTransfer.download(
        uri,
        fileURL,
        function (entry) {
          console.log("download complete: " + entry.toURL());
        },
        function (error) {
          console.log("download error source " + error.source);
          console.log("download error target " + error.target);
          console.log("download error code" + error.code);
        },
        null,
        {
          //     "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
          //  } headers: {
          //
        }
      );
    } else {
      let path = data[0].path.split("?")[0];
      console.log("URL:", path);
      window.open(path, "_blank");
      this.isLoading = false;
    }
  }

  ngOnDestroy() {
    this.$subScription.unsubscribe();
  }
}
@Component({
  selector: "previewDoc",
  templateUrl: "./previewDoc.html",
  styleUrls: ["./deal-tech-solution.component.scss"]
})
export class previewDoc implements OnInit {
  urlData: "";
  isLocked: boolean = false;
  sPUniqueId: any;
  docPrevStaticUrl =
    "https://wipro365.sharepoint.com/sites/L20_WP_COLLAB_DEV/SitePages/preview.aspx?q=";
  previewUrl: string;

  constructor(
    public dialogRef: MatDialogRef<previewDoc>,
    @Inject(MAT_DIALOG_DATA) public data: AnalyserNode
  ) { }

  // constructor(
  //   public dialogRef: MatDialogRef<previewDoc>,
  //   @Inject(MAT_DIALOG_DATA) public data: AnalyserNode) {

  // }

  ngOnInit() {
    this.urlData = this.data[0].path;
    this.isLocked = this.data[0].isLock;
    this.sPUniqueId = this.data[0].sPUniqueId;
    this.previewUrl = this.docPrevStaticUrl + this.sPUniqueId;
    console.log(this.urlData);
    console.log("previewUrl", this.previewUrl);
  }

  onOpenTab() {
    window.open(this.urlData, "_blank");
  }
}
