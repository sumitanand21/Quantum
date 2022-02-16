import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DataCommunicationService } from '@app/core/services/global.service';
import { OnlineOfflineService, ArchivedLeadsService, ErrorMessage, LeadListOfflineService, headerArchived, UnqualifiedLeadsService } from '@app/core/services'
import { Router } from '@angular/router';
import { archivedLeads } from '@app/core/models/archivedLeads.model';
import { Project, ContactleadService } from '@app/core';
import { LoaderService } from '@app/core/services/loader.service';
import { MatSnackBar } from '@angular/material';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { archivedLeadsSelector } from '@app/core/state/selectors/archivedLeads.selector';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { LoadArchivedList, ArchivedRestore, ClearMyopenlead, ClearOpenLeadState, ClearArchivedLeadState, LeadNurture, LeadQualify, LeadDisQualify, ClearAllLeadDetails } from '@app/core/state/actions/leads.action';
import { MyOpenLeadsService, LeadCustomErrorMessages } from '@app/core/services/myopenlead.service';
import { environment as env } from '@env/environment';
import { LeadListService } from '@app/core/services/lead-list-service';
import { Update } from '@ngrx/entity';
import { ClearContactList, ClearRelationshipCount } from '@app/core/state/actions/contact.action';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;

enum IdentifyLeadstype {
  "unqualified" = 1,
  "qualified" = 3,
  "unqualifiedName" = "Unqualified",
  "qualifiedName" = "Qualified"
}

@Component({
  selector: 'app-archived-leads',
  templateUrl: './archived-leads.component.html',
  styleUrls: ['./archived-leads.component.scss']
})
export class ArchivedLeadsComponent implements OnInit, OnDestroy {
  userGuid: any;
  isLoading: boolean = false;
  projects$: Observable<Project[]>;
  contactstabdown = true;
  suitetabdown = false;
  clear;
  selectedAll: any;
  key: string;
  reverse: boolean;
  table_data: any;
  checkboxcounter: number = 0; selectedCount: any = [];
  search;
  userArray: archivedLeads[];
  headerArray;
  selArry;
  showMoreOptions;
  headerData;
  fixedClass = 'fixedClass0';
  id?: Number;
  name?: string;
  order?: number;
  isFixed?: boolean;
  myArrayData = [];
  componentTable = [];
  tableTotalCount: number = 0;
  StateArchivedLeadList$: Subscription
  download$: Subscription
  ArchivedLeadList = [];
  filename = 'Archived'
  account_dash() { }
  detailsId: any
  statusText: string = "Archived";
  expand = false;
  isDownloadObject: any;

  ArchievedLeadbody = {
    "StatusCode": 184450013,
    "PageSize":  50,
    "RequestedPageNumber":  1,
    "OdatanextLink": "",
    "FilterData":  []
  }

  configData = {
    "disqalify": []
  }

  filterConfigData = {
    Name: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Owner: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Createdon: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Account: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Source: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Status: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Activitygroup: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    isFilterLoading: false
  };

  archivedTable = [];
  constructor(private router: Router,
    private service: DataCommunicationService,
    private leadarchievedservice: ArchivedLeadsService,
    public loaderService: LoaderService,
    private disqualifys: UnqualifiedLeadsService,
    private snackBar: MatSnackBar,
    private onlineOfflineService: OnlineOfflineService,
    private leadListService: LeadListService,
    private archivelead: ArchivedLeadsService,
    public errorMessage: ErrorMessage,
    public encrDecrService: EncrDecrService,
    private store: Store<AppState>,
    private myOpenLeadsService: MyOpenLeadsService,
    private contactleadService: ContactleadService,
    private leadListOfflineService: LeadListOfflineService,public envr : EnvService) {
  }
  onClickedOutside(e: Event) {
    this.showMoreOptions = false;
  }

  async  ngOnInit() {
    this.getDisqualifyReason()
    sessionStorage.setItem('navigationfromlist', JSON.stringify(3))
    this.userGuid = this.encrDecrService.get("EncryptionEncryptionEncryptionEn", localStorage.getItem("userID"), 'DecryptionDecrip')
    this.myOpenLeadsService.clearLeadAddContactSessionStore()
    this.archivelead.sendConfigData = []
    this.StateArchivedLeadList$ = this.store.pipe(select(archivedLeadsSelector)).subscribe(res => {
      if (res) {
        if (res.ids.length > 0) {
          this.ArchivedLeadList = this.getTableFilterData(Object.keys(res.entities).map(e => res.entities[e]))
          this.tableTotalCount = res.count;
          this.ArchievedLeadbody.OdatanextLink = res.OdatanextLink
        } else {
          this.getArchivedLeadList(this.ArchievedLeadbody, true, false, true)
        }
      } else {
        this.getArchivedLeadList(this.ArchievedLeadbody, true, false, true)
      }
    })
    if (!this.onlineOfflineService.isOnline) {
      let key = this.leadListOfflineService.LeadTableIdentity.OpenLead
      const CacheResponse = await this.myOpenLeadsService.getCachedLeadList(key)
      if (CacheResponse) {
        if (CacheResponse.data.length > 0) {
          this.isLoading = false;
          this.ArchivedLeadList = this.getTableFilterData(CacheResponse.data)
          this.tableTotalCount = CacheResponse.count
          this.ArchievedLeadbody.OdatanextLink = CacheResponse.OdatanextLink
        }
      }
    }
  }

  allBtnsLable = ['nurtureBtnVisibility', 'restoreBtnVisibility'];
  inputClick() {
    this.expand = true;
  }
  OutsideInput() {
    this.expand = false;
  }
  close() {
    this.expand = false;
    this.clear = "";
  }

  getArchivedLeadList(reqBody, isConcat, isSearch, isLoader) {
    (reqBody.RequestedPageNumber == 1 && isLoader) ? this.isLoading = true : this.isLoading = false;
    let useFulldata = {
      pageNo: this.ArchievedLeadbody.RequestedPageNumber,
      pageSize: this.ArchievedLeadbody.PageSize,
      nextLink: this.ArchievedLeadbody.OdatanextLink,
      LeadsReqBody: this.ArchievedLeadbody,
      fieldheader: headerArchived,
      userGuid: this.userGuid,
    }
    let reqparam = this.leadListService.GetAppliedFilterData({ ...reqBody, useFulldata: useFulldata })
    this.myOpenLeadsService.getAppliedFilterLeadData(reqparam).subscribe(async res => {
      // this.leadarchievedservice.getAllLeadsbyStatus(reqBody).subscribe(async res => {
      if (!res.IsError) {
        this.isLoading = false;
        if (res.ResponseObject.length > 0) {
          const ImmutableObject = Object.assign({}, res)
          const perPage = this.ArchievedLeadbody.PageSize;
          const start = ((this.ArchievedLeadbody.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;
          res.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          })
          if (res.OdatanextLink) {
            this.ArchievedLeadbody.OdatanextLink = res.OdatanextLink
          }
          if (isConcat) {
            let spliceArray = [];
            this.ArchivedLeadList.map((res) => {
              if (res.index >= start && res.index <= end) {
                spliceArray.push(res);
              }
            });
            spliceArray.map(res => {
              this.ArchivedLeadList.splice(this.ArchivedLeadList.indexOf(res), 1);
            })

            if (!isSearch) {
              ImmutableObject.ResponseObject.map(x => x.id = x.LeadGuid)
              this.store.dispatch(new LoadArchivedList({
                CreateArchivedLead: ImmutableObject.ResponseObject,
                count: res.TotalRecordCount,
                OdatanextLink: res.OdatanextLink
              }))
            } else {
              this.ArchivedLeadList = this.ArchivedLeadList.concat(this.getTableFilterData(res.ResponseObject))
            }
          } else {
            // need to handle the search when api is ready!
            this.ArchivedLeadList = this.getTableFilterData(res.ResponseObject)
          }
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.isLoading = false;
          this.ArchivedLeadList = [{}]
        }
      } else {
        this.isLoading = false;
        this.ArchivedLeadList = [{}]
      }
    }, error => {
      this.isLoading = false
      this.ArchivedLeadList = [{}]
    })
  }

  SearchTable(data): void {
    this.ArchievedLeadbody.RequestedPageNumber = 1
    this.ArchievedLeadbody.OdatanextLink = ""
    this.isLoading = true
    if (data != "") {
      if (data.objectRowData != "" && data.objectRowData != undefined) {
        let useFulldata = {
          pageNo: this.ArchievedLeadbody.RequestedPageNumber,
          pageSize: this.ArchievedLeadbody.PageSize,
          nextLink: this.ArchievedLeadbody.OdatanextLink,
          LeadsReqBody: this.ArchievedLeadbody,
          fieldheader: headerArchived,
          userGuid: this.userGuid,
        }
        let reqparam = this.leadListService.GetAppliedFilterData({ ...data, useFulldata: useFulldata })
        this.myOpenLeadsService.getAppliedFilterLeadData(reqparam).subscribe(res => {
          // this.leadarchievedservice.LeadSearch(data.objectRowData, this.leadarchievedservice.leadlistTableIdentity.archieveleadsearch, this.ArchievedLeadbody.PageSize, this.userGuid).subscribe(res => {
          if (!res.IsError) {
            this.isLoading = false
            if (res.ResponseObject.length > 0) {
              let i = 1;
              res.ResponseObject.map(res => {
                res.index = i;
                i = i + 1;
              })
              this.ArchivedLeadList = this.getTableFilterData(res.ResponseObject)
              this.ArchievedLeadbody.OdatanextLink = res.OdatanextLink
              this.tableTotalCount = res.TotalRecordCount
            } else {
              this.ArchivedLeadList = [{}]
              this.tableTotalCount = 0;
            }
          } else {
            this.isLoading = false
            this.ArchivedLeadList = [{}]
          }
        }, error => {
          this.isLoading = false
          this.ArchivedLeadList = [{}]
        })
      } else {
        this.isLoading = false
        this.getArchivedLeadList(this.ArchievedLeadbody, false, false, false)
      }
    } else {
      this.isLoading = false
    }
  }

  getNewTableData(event) {
    if (event.action == 'pagination') {
      // this.ArchievedLeadbody.PageSize = event.itemsPerPage;
      // this.ArchievedLeadbody.RequestedPageNumber = event.currentPage;
      // this.getArchivedLeadList(event, true, false, false)


      if (this.ArchievedLeadbody.PageSize == event.itemsPerPage) {
        this.ArchievedLeadbody.PageSize = event.itemsPerPage;
        this.ArchievedLeadbody.RequestedPageNumber = event.currentPage;
        this.getArchivedLeadList(event, true, true, true);
      }
      else {
        this.ArchievedLeadbody.PageSize = event.itemsPerPage;
        this.ArchievedLeadbody.RequestedPageNumber = event.currentPage;
        this.getArchivedLeadList(event, false, true, true);
      }

    }
  }

  getTableFilterData(tabledata): Array<any> {
    console.log("conversation!!!")
    console.log(tabledata)
    return tabledata.map(leads => {
      return {
        Name: (leads.Title) ? (leads.Title).trim() : "NA",
        ID: leads.LeadGuid,
        restoreBtnVisibility: (leads.Status) ? (leads.Status.status == "Archived" && leads.isUserCanEdit == true) ? false : true : true,
        Score: (leads.OverallLeadScore === undefined) ? "NA" : leads.OverallLeadScore,
        Owner: (leads.Owner) ? (leads.Owner.FullName) ? leads.Owner.FullName : "NA" : "NA",
        Createdon: (leads.CreatedOn) ? leads.CreatedOn : "NA",
        Account: (leads.Account) ? (leads.Account.Name) ? decodeURIComponent(leads.Account.Name) : "NA" : "NA",
        AccountGuid: (leads.Account) ? (leads.Account.SysGuid) ? leads.Account.SysGuid : "NA" : "NA",
        statusclass: (leads.Status) ? (leads.Status.status == "Qualified") ? "qualified" : (leads.Status.status == "Disqualified" || leads.Status.status == "Archived") ? "disqualified" : "unqualified" : "",
        Source: (leads.Source) ? (leads.Source.Name) ? leads.Source.Name : "NA" : "NA",
        Status: (leads.Status) ? (leads.Status.status) ? leads.Status.status : "NA" : "NA",
        Remark: (leads.remarks) ? leads.remarks : "NA",
        Activitygroup: leads.ActivityGroups ? leads.ActivityGroups.length > 0 ? this.activityGroupFiter(leads.ActivityGroups).length > 0 ? this.activityGroupFiter(leads.ActivityGroups) : ["NA"] : ["NA"] : ["NA"],
        index: leads.index,
        statusText: (leads.IsNurture) ? "Nurtured" : "",
        accountId: (leads.AccountTypeId) ? leads.AccountTypeId : "",
        accountType: (leads.AccountType) ? leads.AccountType : "",
        OldStatusReasonGuid: (leads.OldStatusReasonGuid) ? leads.OldStatusReasonGuid : "",
        OldStatusGuid: (leads.OldStatusGuid) ? leads.OldStatusGuid : "",
        Reason: (leads.Reason) ? (leads.Reason) : {},
        DisQualifyReason: (leads.DisQualifyReason) ? (leads.DisQualifyReason) : "NA",
        moreBtnVisibility: (leads.Status) ? (leads.Status.status == "Disqualified") ? false : true : true,
        disQualifyBtnVisibility: (leads.isAcceptable) ? true : (leads.Status) ? (leads.Status.Id != undefined) ? (leads.Status.Id == IdentifyLeadstype.qualified && leads.isUserCanEdit == true) ? false : true : true : true,
        nurtureBtnVisibility: (leads.isAcceptable) ? true : (leads.Status) ? (leads.Status.Id != undefined) ? ((leads.Status.Id == IdentifyLeadstype.unqualified || leads.Status.Id == IdentifyLeadstype.qualified) && leads.IsNurture == false && leads.isUserCanEdit == true) ? false : true : true : true,
        // nurtureBtnVisibility: (leads.isAcceptable) ? true : (leads.IsNurture) ? ((leads.Status.status == "Disqualified") && (leads.Status.status == "Archived")) ?  true : false : true,
        archiveBtnVisibility: (leads.isAcceptable) ? true : (leads.Status) ? (leads.Status.Id != undefined && leads.isUserCanEdit == true) ? false : true : true,
        qualifyBtnVisibility: (leads.isAcceptable) ? true : (leads.Status) ? (leads.Status.Id != undefined) ? (leads.Status.Id == IdentifyLeadstype.unqualified && leads.isUserCanEdit == true) ? false : true : true : true,
        opportunityBtnVisibility: (leads.isAcceptable) ? true : (leads.Status) ? (leads.Status.Id != undefined) ? (leads.Status.Id == IdentifyLeadstype.qualified && leads.isUserCanEdit == true && leads.isOpportunityCreated == false) ? false : true : true : true,
        isUserCanEdit:(leads.isUserCanEdit)? (leads.isUserCanEdit) :false
      };
    })
  }

  activityGroupFiter(data): Array<any> {
    let activityGroup = []
    data.map(x => {
      if (x.Name) {
        activityGroup.push(x.Name)
      }
    })
    return activityGroup
  }

  performTableChildAction(childActionRecieved) {
    if (childActionRecieved) {
      (childActionRecieved.parentData) ? this.tableTotalCount = childActionRecieved.parentData.totalCount : this.tableTotalCount = this.tableTotalCount
    }
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {
      case 'share': {
        this.router.navigateByUrl('/activities/childInfo');
        break;
      }
      case 'pagination': {
        this.TablePagination(childActionRecieved);
        break;
      }
      case 'Name': {
        this.detailsId = childActionRecieved.objectRowData[0].ID
        this.myOpenLeadsService.updateHistoryFlag( this.detailsId , false)
        sessionStorage.setItem('navigationfromlist', JSON.stringify(3))
        sessionStorage.setItem('LeadId', JSON.stringify(this.encrDecrService.set('EncryptionEncryptionEncryptionEn', this.detailsId, 'DecryptionDecrip')));
        this.archivelead.sendPageNumber = childActionRecieved.pageData.currentPage
        this.archivelead.sendPageSize = childActionRecieved.pageData.itemsPerPage
        this.archivelead.sendConfigData = childActionRecieved.configData.filterData
        this.Navigate(childActionRecieved, 'Name')
        break;
      }
      case 'search': {
        this.SearchTable(childActionRecieved);
        break;
      }
      case 'restore': {
        this.restore(childActionRecieved)
        break;
      }

      case 'nurture': {
        this.nurture(childActionRecieved);
        break;
      }

      case 'archive': {
        this.archive(childActionRecieved)
        break;
      }

      case 'convertOpportunity': {
        this.Createopp(childActionRecieved)
        break;
      }

      case 'disqualify': {
        this.disQualify(childActionRecieved)
        break;
      }

      case 'qualify': {
        this.qualifyLeads(childActionRecieved)
        break;
      }

      case 'tabNavigation': {
        this.TabNavigation(childActionRecieved.objectRowData[0])
        break;
      }
      case 'DownloadCSV': {
        this.downloadList(childActionRecieved);
        break;
      }
      case "columnFilter": {
        this.GetColumnFilters(childActionRecieved);
        break;
      }
      case "columnSearchFilter": {
        this.GetColumnSearchFilters(childActionRecieved);
        break;
      }
      case 'loadMoreFilterData': {
        this.LoadMoreColumnFilter(childActionRecieved);
        break;
      }
      case 'sortHeaderBy': {
        this.ArchievedLeadbody.OdatanextLink = ''
        this.ArchievedLeadbody.RequestedPageNumber = 1
        this.CallListDataWithFilters(childActionRecieved);
        break;
      }
      case 'ClearAllFilter': {
        this.clearallFilter();
        break;
      }
    }
  }

  clearallFilter() {
    this.ArchievedLeadbody = {
      "StatusCode": 184450013,
      "PageSize": this.ArchievedLeadbody.PageSize,
      "RequestedPageNumber":  1,
      "OdatanextLink": "",
      "FilterData":  []
    }
    this.getArchivedLeadList(this.ArchievedLeadbody, false, false, true)
  }

  GetColumnFilters(data) {
    if (data.filterData) {
      if (!data.filterData.isApplyFilter) {
        let headerName = data.filterData.headerName
        this.filterConfigData[headerName].data = [];
        this.filterConfigData[headerName].PageNo = 1;
        this.generateFilterConfigData(data, headerName, false, this.leadListService.CheckFilterServiceFlag(data, headerName, this.filterConfigData))
      } else {
        if (data.filterData.isApplyFilter && this.service.CheckFilterFlag(data)) {
          this.ArchievedLeadbody.OdatanextLink = ''
          this.ArchievedLeadbody.RequestedPageNumber = 1
          this.CallListDataWithFilters(data)
        } else {
          this.ArchievedLeadbody.OdatanextLink = ''
          this.ArchievedLeadbody.RequestedPageNumber = 1
          this.getArchivedLeadList(this.ArchievedLeadbody, false, true, false)
        }
      }
    }
  }

  GetColumnSearchFilters(data) {
    let headerName = data.filterData.headerName
    this.ArchievedLeadbody.OdatanextLink = ''
    this.filterConfigData[headerName].PageNo = 1
    this.filterConfigData[headerName].NextLink = ''
    this.generateFilterConfigData(data, headerName, false, true)
  }

  LoadMoreColumnFilter(data) {
    let headerName = data.filterData.headerName
    this.filterConfigData[headerName].PageNo = this.filterConfigData[headerName].PageNo + 1
    this.generateFilterConfigData(data, headerName, true, true)
  }

  CallListDataWithFilters(data) {
    let useFulldata = {
      LeadsReqBody: this.ArchievedLeadbody,
      fieldheader: headerArchived,
      userGuid: this.userGuid,
      pageSize: this.ArchievedLeadbody.PageSize,
      pageNo: this.ArchievedLeadbody.RequestedPageNumber,
      nextLink: this.ArchievedLeadbody.OdatanextLink
    }
    let reqparam = this.leadListService.GetAppliedFilterData({ ...data, useFulldata: useFulldata })
    this.myOpenLeadsService.getAppliedFilterLeadData(reqparam).subscribe(res => {
      if (!res.IsError) {
        if (res.ResponseObject.length > 0) {
          const perPage = reqparam.PageSize;
          const start = ((reqparam.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;
          res.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          })
          this.ArchivedLeadList = this.getTableFilterData(res.ResponseObject)
          this.ArchievedLeadbody.OdatanextLink = res.OdatanextLink
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.ArchivedLeadList = [{}]
          this.tableTotalCount = 0;
        }
      } else {
        this.errorMessage.throwError(res.Message)
      }
    })
  }

  CheckFilterServiceFlag(data, headerName): boolean {
    if (data) {
      if (data.action != "columnFilter" && data.filterData.isApplyFilter) {
        return false
      } else if (data.action == "columnFilter" && data.filterData.columnSerachKey == '' && this.filterConfigData[headerName]["data"].length <= 0) {
        return true
      } else if (data.action == "columnFilter" && data.filterData.columnSerachKey != '' && !data.filterData.isApplyFilter) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  generateFilterConfigData(data, headerName, isConcat, isServiceCall?) {
    if (isServiceCall) {
      let useFulldata = {
        headerName: headerName,
        pageNo: this.filterConfigData[headerName].PageNo,
        pageSize: 10,
        nextLink: this.filterConfigData[headerName].NextLink,
        LeadsReqBody: this.ArchievedLeadbody,
        fieldheader: headerArchived,
        userGuid: this.userGuid,
        searchVal: data.filterData.columnSerachKey,
        Searchtype: 184450013
      }
      this.myOpenLeadsService.getActionListConfigData({ ...data, useFulldata: useFulldata }).subscribe(res => {
        this.filterConfigData.isFilterLoading = false;
        if (!res.IsError) {
          this.filterConfigData[headerName] = {
            data: (isConcat) ? this.filterConfigData[headerName]["data"].concat(res.ResponseObject) : res.ResponseObject,
            recordCount: res.TotalRecordCount,
            NextLink: res.OdatanextLink,
            PageNo: res.CurrentPageNumber
          }
          //display the selected value in filter list
          if (data.filterData.headerName != 'Createdon') {
            data.filterData.filterColumn[headerName].forEach(res => {
              let index = this.filterConfigData[headerName].data.findIndex(x => x.id == res.id)
              if (index !== -1) {
                this.filterConfigData[headerName].data[index].isDatafiltered = true
              }
            });
          }
        }
        else {
          if (this.filterConfigData[headerName].PageNo > 1) {
            this.filterConfigData[headerName].PageNo = Number(this.filterConfigData[headerName].PageNo) - 1;
          }
          this.errorMessage.throwError(res.Message)
        }
      }, error => {
        this.filterConfigData.isFilterLoading = false
        if (this.filterConfigData[headerName].PageNo > 1) {
          this.filterConfigData[headerName].PageNo = Number(this.filterConfigData[headerName].PageNo) - 1;
        }
      })
    } else {
      this.filterConfigData.isFilterLoading = false;
      if (data.filterData.filterColumn[headerName].length > 0) {
        this.filterConfigData[headerName]["data"] = this.leadListService.RemoveSelectedItems(this.filterConfigData[headerName]["data"], data.filterData.filterColumn[headerName], 'id').concat(data.filterData.filterColumn[headerName])
      }
    }
  }

  /*Tab Switch*/
  TabNavigation(item) {
    this.myOpenLeadsService.leadTabNavigations(item);
  }

  downloadList(data): void {
    this.isLoading = true
    // after the list filter, download post object
    let useFulldata = {
      LeadsReqBody: this.ArchievedLeadbody,
      fieldheader: headerArchived,
      userGuid: this.userGuid,
      pageSize: this.ArchievedLeadbody.PageSize,
      pageNo: this.ArchievedLeadbody.RequestedPageNumber,
      nextLink: this.ArchievedLeadbody.OdatanextLink
    }
    let isDownloadReqBody = this.leadListService.GetAppliedFilterData({ ...data, useFulldata: useFulldata })
    this.myOpenLeadsService.downloadLeadList(isDownloadReqBody).subscribe(res => {
      if (!res.IsError) {
        this.isLoading = false
        if (this.envr.envName === 'MOBILEQA') {
          this.downloadListMobile(res.ResponseObject)
        } 
        else {
          this.service.Base64Download(res.ResponseObject);
          // window.open(res.ResponseObject.Url, "_blank");
        }
      } else {
        this.isLoading = false
        this.errorMessage.throwError(res.Message)
      }
    }, error => {
      this.isLoading = false
    })
  }

  downloadListMobile(fileInfo) {
    var fileTransfer = new FileTransfer();
    var newUrl = fileInfo.Url.substr(0, fileInfo.Url.indexOf("?"))
    var uri = encodeURI(newUrl);
    var fileURL = "///storage/emulated/0/DCIM/" + fileInfo.Name;
    this.errorMessage.throwError(`${fileInfo.Name} downloaded`)
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


  TablePagination(data) { }

  Navigate(data, route): void {
    if (route == "Name") {
      if (data.objectRowData[0].Status == 'Archived') {
        this.service.leadArchive = true
        this.service.leadDetails = false
        this.service.leadNuture = false
      } else {
        this.service.leadArchive = false
        this.service.leadDetails = true
        this.service.leadNuture = false
      }
      // this.myOpenLeadsService.updateHistoryFlag(this.detailsId)
      var encId = this.encrDecrService.set("EncryptionEncryptionEncryptionEn", [data.objectRowData[0].ID, 3], "DecryptionDecrip");
      this.router.navigate(['/leads/leadDetails'])
    }
  }

  restore(data): void {
    this.isLoading = true;
    if (data.action === 'restore') {
      let arcleadObject = data.objectRowData.data.map(x => {
        return {
          "LeadGuid": x.ID,
          "statecode": 0,
          "statusreason": 1,
          "OldStatusReasonGuid": x.OldStatusReasonGuid,
          "OldStatusGuid": x.OldStatusGuid
        }
      })
      this.archivelead.restorelead(arcleadObject).subscribe(async res => {
        if (res.IsError == false) {
          this.isLoading = false;
          const removeRestoreChange: [] = data.objectRowData.data.map(x => x.ID)
          this.getArchivedLeadList(data, false, false, true)
          this.store.dispatch(new ArchivedRestore({ ids: removeRestoreChange }))
          await this.leadListOfflineService.ClearLeadListIndexTableData(this.leadListOfflineService.LeadTableIdentity.MyOpenLead)
          await this.leadListOfflineService.ClearLeadListIndexTableData(this.leadListOfflineService.LeadTableIdentity.OpenLead)
          await this.leadListOfflineService.ClearLeadListIndexTableData(this.leadListOfflineService.LeadTableIdentity.ArchivedLead)
          this.errorMessage.onSuccessMessage(res.Message).afterDismissed().subscribe(() => {
            this.store.dispatch(new ClearOpenLeadState())
            this.store.dispatch(new ClearMyopenlead())
            this.store.dispatch(new ClearAllLeadDetails())
          })
          // let val
          // this.snackBar.open(res.Message, val, {
          //   duration: 3000
          // }).afterDismissed().subscribe(() => {
          //   if (data.objectRowData.data[0].statusclass == "disqualified") {
          //     this.router.navigateByUrl('leads/qualified');
          //   } else {
          //     this.router.navigateByUrl('leads/unqalified');
          //   }
          // });
        } else {
          this.isLoading = false;
          this.errorMessage.throwError(res.Message)
        }
      })
    }
  }

  nurture(data): void {
    this.isLoading = true;
    if (data.action === 'nurture') {
      let nurtureleadObject = data.objectRowData.data.map(x => {
        return {
          "LeadGuid": x.ID,
          "wipro_nurture": true,
          "wipro_nurtureremarks": encodeURIComponent(data.objectRowData.comment)
        }
      })
      this.myOpenLeadsService.NurtureLead(nurtureleadObject).subscribe(async res => {
        if (res.IsError == false) {
          this.isLoading = false;
          this.errorMessage.throwError(res.Message)
          this.ArchivedLeadList = this.ArchivedLeadList.map(x => {
            if (x.ID === data.objectRowData.data[0].ID) {
              x.statusText = "Nurtured"
            }
            return x;
          })
          const changes = { IsNurture: true, wipro_nurtureremarks: data.objectRowData.comment };                            //state management for edit 
          const NurtureChange: Update<any>[] = data.objectRowData.data.map(x => {
            return {
              id: x.ID,
              changes
            }
          })
          this.getArchivedLeadList(data, false, false, true)
          this.errorMessage.onSuccessMessage(res.Message).afterDismissed().subscribe(() => {
            this.store.dispatch(new ClearAllLeadDetails())
            this.store.dispatch(new LeadNurture({ updateurture: NurtureChange }))
          })
        } else {
          this.isLoading = false;
          this.errorMessage.throwError(res.Message)
        }
      },
        error => {
          this.isLoading = false
        })
    }
  }

  archive(data): void {
    this.isLoading = true;
    if (data.action === 'archive') {
      let arcihveReqBody = data.objectRowData.data.map(x => {
        return {
          LeadGuid: x.ID,
          wipro_archivingpromptdate: new Date(data.objectRowData.date),
          remarks: encodeURIComponent(data.objectRowData.comment),
          OldStatusReasonGuid: x.OldStatusReasonGuid,
          OldStatusGuid: x.OldStatusGuid
        }
      })
      this.myOpenLeadsService.ArchiveLeads(arcihveReqBody).subscribe(async res => {
        if (res.IsError == false) {
          this.isLoading = false;
          let leadGuidArray = []
          let leadIds = data.objectRowData.data.map(x => leadGuidArray.push(x.Id))
          await this.leadListOfflineService.ClearEntireLeadIndexTableData()
          this.getArchivedLeadList(data, false, false, true)
          this.store.dispatch(new ClearOpenLeadState())
          this.store.dispatch(new ClearMyopenlead())
          this.store.dispatch(new ClearContactList())
          this.store.dispatch(new ClearRelationshipCount());
          this.store.dispatch(new ClearAllLeadDetails())
          this.store.dispatch(new ArchivedRestore({ ids: leadGuidArray }))
          if (data.objectRowData.data[0].Status == "Qualified") {
            this.errorMessage.throwError(res.Message)
          } else {
            this.errorMessage.throwError(LeadCustomErrorMessages.UnqualifiedArchive)
          }
        } else {
          this.isLoading = false;
          this.errorMessage.throwError(res.Message)
        }
      },
        error => {
          this.isLoading = false
        })
    }
  }

  Createopp(data) {
    this.isLoading = true
    if (data.objectRowData.data[0].accountType == "Prospect") {
      localStorage.setItem('prospectaccountid', data.objectRowData.data[0].AccountGuid)
      console.log('accountGuid', localStorage.getItem('prospectaccountid'))
      this.router.navigate(['/accounts/createnewaccount']);
    } else if (data.objectRowData.data[0].accountType == "Reserve") {
      this.isLoading = false
    } else {
      this.contactleadService.getLeadDetails(data.objectRowData.data[0].ID, this.userGuid).subscribe(res => {
        if (!res.IsError) {
          sessionStorage.setItem('CreateOpportunityFromLead', JSON.stringify(res.ResponseObject));
          this.myOpenLeadsService.setSession('path', '/leads/archived');
          this.router.navigate(['/opportunity/newopportunity']);
        } else {
          this.errorMessage.throwError(res.IsError)
          this.isLoading = false
        }
      }, error => {
        this.isLoading = false
      })
    }
  }

  qualifyLeads(data): void {
    this.isLoading = true;
    if (data.action == 'qualify') {
      let qualifiedleadObjects = data.objectRowData.data.map(x => {
        return {
          "LeadGuid": x.ID,//data.objectRowData.data[0].ID,
          "CreateAccount": false,
          "CreateContact": false,
          "CreateOpportunity": false,
          "statuscode": 3
        }
      })
      const changes = {
        Status: {
          Id: IdentifyLeadstype.qualified,
          status: IdentifyLeadstype.qualifiedName
        }
      };
      const QualifyChange: Update<any>[] = data.objectRowData.data.map(x => {
        return {
          id: x.ID,
          changes
        }
      })
      this.myOpenLeadsService.QyalifyLeads(qualifiedleadObjects).subscribe(async res => {
        if (res.IsError == false) {
          this.isLoading = false;
          await this.leadListOfflineService.ClearEntireLeadIndexTableData()
          this.errorMessage.onSuccessMessage(res.Message).afterDismissed().subscribe(() => {
            this.store.dispatch(new LeadQualify({ updatequalify: QualifyChange }))
            this.store.dispatch(new ClearOpenLeadState())
            this.store.dispatch(new ClearMyopenlead())
            this.store.dispatch(new ClearRelationshipCount());
            this.store.dispatch(new ClearAllLeadDetails())
            this.getArchivedLeadList(data, false, false, true)
          })
        } else {
          this.isLoading = false;
          this.errorMessage.throwError(res.Message)
          
        }
      }, error => {
        this.isLoading = false
      })
    }
  }

  disQualify(data): void {
    this.isLoading = true;
    if (data.action == 'disqualify') {
      let Req = data.objectRowData.data.map(x => {
        return {
          "LeadGuid": x.ID,
          "statecode": 2,
          "statuscode": 184450007,
          "remarks": encodeURIComponent(data.objectRowData.comment),
          "StatusReason": {
            "StatusGuid": data.objectRowData.dropData.StatusGuid,
            "SysGuid": data.objectRowData.dropData.id
          }
        }
      })
      this.myOpenLeadsService.DisqualifyLead(Req).subscribe(async res => {
        if (res.IsError == false) {
          this.isLoading = false;
          let leadGuidArray = []
          let leadIds = data.objectRowData.data.map(x => leadGuidArray.push(x.Id))
          await this.leadListOfflineService.ClearEntireLeadIndexTableData()
          const removeDisQualifyChange: [] = data.objectRowData.data.map(x => x.Id)
          this.getArchivedLeadList(data, false, false, true)
          this.errorMessage.onSuccessMessage(res.Message).afterDismissed().subscribe(() => {
            this.store.dispatch(new LeadDisQualify({ ids: removeDisQualifyChange }))
            this.store.dispatch(new ClearOpenLeadState())
            this.store.dispatch(new ClearMyopenlead())
            this.store.dispatch(new ClearAllLeadDetails())
            if(this.router.url.includes('/accounts/accountleads')){
              this.router.navigateByUrl('accounts/accountleads/diqualified');
            }else{
              this.router.navigateByUrl('leads/diqualified');
            }
          })
        } else {
          this.isLoading = false;
          this.errorMessage.throwError(res.Message)
        }
      })
    }
  }
  getDisqualifyReason() {
    this.disqualifys.disqualifyLeadReason().subscribe(res => {
      this.configData.disqalify = res.ResponseObject.map(x => {
        return {
          id: x.SysGuid,
          Name: (x.Name) ? x.Name.replace(/\?/g, '-') : "",
          StatusGuid: x.StatusGuid
        }
      })
    })
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.StateArchivedLeadList$.unsubscribe()
  }
}

