import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DataCommunicationService, UnqualifiedLeadsService, OnlineOfflineService, ArchivedLeadsService, ErrorMessage, LeadListOfflineService, unqualifiedheader, ContactleadService } from '@app/core/services';
import { UnqualifiedLeads } from '@app/core/models/UnqualifiedLeads.model';
import { LoaderService } from '@app/core/services/loader.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { MyOpenLeadsService, LeadCustomErrorMessages, myopenleaddheader } from '@app/core/services/myopenlead.service';
import { LoadMyOpenleads, LeadNurture, LeadQualify, ClearArchivedLeadState, ClearMyopenlead, LeadAccepted, ClearOpenLeadState, ArchivedRestore, LeadDisQualify, ClearAllLeadDetails } from '@app/core/state/actions/leads.action';
import { getMyOpenLeadsList } from '@app/core/state/selectors/lead/lead.selector';
import { Update } from '@ngrx/entity';
import { ClearContactList, ClearRelationshipCount } from '@app/core/state/actions/contact.action';
import { environment as env } from '@env/environment';
import { LeadListService } from '@app/core/services/lead-list-service';
import { DatePipe } from '@angular/common'
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;
//My-Open-Leads will have QL & UL , so to identify
enum IdentifyLeadstype {
  "unqualified" = 1,
  "qualified" = 3,
  "unqualifiedName" = "Unqualified",
  "qualifiedName" = "Qualified"
}
@Component({
  selector: 'app-unqualified-leads',
  templateUrl: './unqualified-leads.component.html',
  styleUrls: ['./unqualified-leads.component.scss']
})
export class UnqualifiedLeadsComponent implements OnInit, OnDestroy {
  MyOpenLeadsReqBody = {
    "StatusCode": 0,
    "PageSize":  50,
    "RequestedPageNumber":  1,
    "OdatanextLink": "",
    "FilterData":  [],
    "Guid": ""
  }
  selectedAll: any;
  StateMyOpenLeadList$: Subscription
  table_data: any;
  checkboxcounter: number = 0; selectedCount: any = [];
  search = "";
  userArray: UnqualifiedLeads[];
  componentTable: any = [];
  tableTotalCount = 0;
  isLoading: boolean = false;
  id: any;
  unqualifiedTable = [];
  myOpenLeadList = [];
  isDownloadObject: any;
  rejectReasons = {
    reason: []
  }
  configData = {
    "disqalify": []
  }
  allBtnsLable = ['nurtureBtnVisibility', 'restoreBtnVisibility'];
  isSearch: boolean;
  Searchvalue: "";
  account_dash() {
  }
  SidenavEnable() {
    this.userdat.sideNavForAcList = true;
  }

  filterConfigData = {
    Name: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Owner: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Createdon: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Account: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Source: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Status: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Activitygroup: { data: [], PageNo: 1, recordCount: 0, NextLink: '' },
    isFilterLoading: false
  };

  constructor(
    private router: Router,
    private userdat: DataCommunicationService,
    public loaderService: LoaderService, public dialog: MatDialog,
    private unqualified: UnqualifiedLeadsService,
    private disqualifys: UnqualifiedLeadsService,
    private onlineOfflineService: OnlineOfflineService,
    private encrDecrService: EncrDecrService,
    public archivelead: ArchivedLeadsService,
    public errorMessage: ErrorMessage,
    public store: Store<AppState>,
    private myOpenLeadsService: MyOpenLeadsService,
    private leadListService: LeadListService,
    private contactleadService: ContactleadService,
    private datePipe : DatePipe,
    private leadListOfflineService: LeadListOfflineService,public envr : EnvService) { }

  async ngOnInit() {
    this.myOpenLeadsService.clearLeadAddContactSessionStore()
    this.getDisqualifyReason();
    this.RejectReasons()
    sessionStorage.setItem('navigationfromlist', JSON.stringify(2))
    this.isLoading = true
    let Userguid = (localStorage.getItem("userID"))
    this.MyOpenLeadsReqBody.Guid = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', Userguid, 'DecryptionDecrip');
    this.StateMyOpenLeadList$ = this.store.pipe(select(getMyOpenLeadsList)).subscribe(res => {
      if (res) {
        if (res.ids.length > 0) {
          this.isLoading = false
          this.myOpenLeadList = this.leadListService.leadListData((Object.keys(res.entities).map(e => res.entities[e])), IdentifyLeadstype)
          this.tableTotalCount = res.count;
          this.MyOpenLeadsReqBody.OdatanextLink = res.nextlink
        } else {
          this.getMyopenLeadsList(this.MyOpenLeadsReqBody, true, false, true)
        }
      }
      else {
        this.getMyopenLeadsList(this.MyOpenLeadsReqBody, true, false, true)
      }
    })
    if (!this.onlineOfflineService.isOnline) {
      let key = this.leadListOfflineService.LeadTableIdentity.MyOpenLead
      const CacheResponse = await this.myOpenLeadsService.getCachedLeadList(key)
      if (CacheResponse) {
        if (CacheResponse.data.length > 0) {
          this.isLoading = false;
          this.myOpenLeadList = this.leadListService.leadListData((Object.values(CacheResponse.data)), IdentifyLeadstype)
          this.tableTotalCount = CacheResponse.count
          this.MyOpenLeadsReqBody.OdatanextLink = CacheResponse.OdatanextLink
        }
      }
    }
  }

  RejectReasons() {
    this.unqualified.rejectedLeadReason().subscribe(res => {
      this.rejectReasons.reason = res.ResponseObject.map(x => {
        return {
          id: x.SysGuid,
          Name: x.Name,
          StatusGuid: x.StatusGuid
        }
      }
      );
    })
  }

  TablePagination(data) {}

  performTableChildAction(childActionRecieved) {
    if (childActionRecieved) {
      (childActionRecieved.parentData) ? this.tableTotalCount = childActionRecieved.parentData.totalCount : this.tableTotalCount = this.tableTotalCount
    }
console.log(childActionRecieved)
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {
      case 'pagination': {
        this.TablePagination(childActionRecieved);
        break;
      }
      case "Ticked": {
        this.AcceptMyOpenlead(childActionRecieved)
        break;
      }
      case 'Name': {
        this.id = childActionRecieved.objectRowData[0].Id
        this.myOpenLeadsService.updateHistoryFlag(this.id, false)
        sessionStorage.setItem('navigationfromlist', JSON.stringify(2))
        sessionStorage.setItem('LeadId', JSON.stringify(this.encrDecrService.set('EncryptionEncryptionEncryptionEn', this.id, 'DecryptionDecrip')));
        var leadName = childActionRecieved.objectRowData[0].Name
        sessionStorage.setItem('leadName', JSON.stringify("leadName"));
        sessionStorage.setItem('hideNurture', JSON.stringify(childActionRecieved.objectRowData[0].nurtureBtnVisibility));
        this.myOpenLeadsService.sendPageNumber = childActionRecieved.pageData.currentPage
        this.myOpenLeadsService.sendPageSize = childActionRecieved.pageData.itemsPerPage
        this.myOpenLeadsService.sendConfigData = childActionRecieved.configData.filterData
        this.Navigate(childActionRecieved, "link")
        break;
      }
      case 'search': {
        this.isLoading = false;
        this.SearchTable(childActionRecieved)
        break;
      }
      case 'delete': {
        setTimeout(() => {
          this.componentTable = this.componentTable.filter(x => x.id != actionRequired.objectRowData.id)
        }, 2000);
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
      case 'qualify': {
        this.qualifyLeads(childActionRecieved)
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
      case 'tabNavigation':
        {
          this.TabNavigation(childActionRecieved.objectRowData[0])
          break;
        }
      case 'reject': {
        this.rejectLead(childActionRecieved)
        break;
      }
      case 'restore': {
        this.restore(childActionRecieved)
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
        this.MyOpenLeadsReqBody.OdatanextLink = ''
        this.MyOpenLeadsReqBody.RequestedPageNumber = 1
        this.CallListDataWithFilters(childActionRecieved);
        break;
      }
      case 'ClearAllFilter': {
        this.clearallFilter();
        break;
      }
    }
  }

  clearallFilter(){
    this.MyOpenLeadsReqBody = {
      "StatusCode": 0,
      "PageSize":  this.MyOpenLeadsReqBody.PageSize,
      "RequestedPageNumber":  1,
      "OdatanextLink": "",
      "FilterData":  [],
      "Guid": ""
    }
    this.getMyopenLeadsList(this.MyOpenLeadsReqBody, false, false, true)
  }

  GetColumnFilters(data) {
    if (data.filterData) {
      if (!data.filterData.isApplyFilter) {
        let headerName = data.filterData.headerName
        this.filterConfigData[headerName].data = [];
        this.filterConfigData[headerName].PageNo = 1;
        this.generateFilterConfigData(data, headerName, false, this.leadListService.CheckFilterServiceFlag(data, headerName, this.filterConfigData))
      } else {
        if (data.filterData.isApplyFilter && this.userdat.CheckFilterFlag(data)) {
          this.MyOpenLeadsReqBody.OdatanextLink = ''
          this.MyOpenLeadsReqBody.RequestedPageNumber = 1
          this.CallListDataWithFilters(data)
        } else if (data.filterData.isApplyFilter && data.filterData.globalSearch != "") {
          this.CallListDataWithFilters(data)
        } else {
          this.store.dispatch(new ClearMyopenlead())
          this.MyOpenLeadsReqBody.OdatanextLink = ''
          this.MyOpenLeadsReqBody.RequestedPageNumber = 1
          this.getMyopenLeadsList(this.MyOpenLeadsReqBody, false, true, false)
        }
      }
    }
  }

  GetColumnSearchFilters(data) {
    let headerName = data.filterData.headerName
    this.MyOpenLeadsReqBody.OdatanextLink = ''
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
      LeadsReqBody:this.MyOpenLeadsReqBody, 
      fieldheader: unqualifiedheader,
      nextLink: this.MyOpenLeadsReqBody.OdatanextLink,
      pageNo: this.MyOpenLeadsReqBody.RequestedPageNumber,
      userGuid: this.MyOpenLeadsReqBody.Guid,
      pageSize: this.MyOpenLeadsReqBody.PageSize
    }
    let reqparam = this.leadListService.GetAppliedFilterData({ ...data, useFulldata: useFulldata})
    this.myOpenLeadsService.getAppliedFilterLeadData(reqparam).subscribe(res => {
      if (!res.IsError) {
        if (res.ResponseObject.length > 0) {
          const ImmutabelObj = Object.assign({}, res)
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
          this.myOpenLeadList = this.leadListService.leadListData(res.ResponseObject, IdentifyLeadstype)
          this.MyOpenLeadsReqBody.OdatanextLink = res.OdatanextLink
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.myOpenLeadList = [{}]
          this.tableTotalCount = 0
        }
      } else {
        this.myOpenLeadList = [{}]
        this.tableTotalCount = 0
        this.errorMessage.throwError(res.Message)
      }
    })
  }

  generateFilterConfigData(data, headerName, isConcat, isServiceCall?) {
    if (isServiceCall) {
      let useFulldata = {
        headerName: headerName,
        searchVal: data.filterData.columnSerachKey,
        Searchtype: 4,
        pageNo: this.filterConfigData[headerName].PageNo,
        pageSize: 10,
        nextLink: this.filterConfigData[headerName].NextLink,
        LeadsReqBody:this.MyOpenLeadsReqBody,
        fieldheader: unqualifiedheader,
        userGuid: this.MyOpenLeadsReqBody.Guid,
      }
      this.myOpenLeadsService.getActionListConfigData({ ...data, useFulldata: useFulldata }).subscribe(res => {
        this.filterConfigData.isFilterLoading = false;
        if(!res.IsError) {
        this.filterConfigData[headerName] = {
          data: (isConcat) ? this.filterConfigData[headerName]["data"].concat(res.ResponseObject) : res.ResponseObject,
          recordCount: res.TotalRecordCount,
          NextLink: res.OdatanextLink,
          PageNo: res.CurrentPageNumber
        }
        //display the selected value in filter list
        if (data.filterData.headerName != 'Createdon')  {  
          data.filterData.filterColumn[headerName].forEach(res => {
            let index = this.filterConfigData[headerName].data.findIndex(x => x.id == res.id)
            if (index !== -1) {
              this.filterConfigData[headerName].data[index].isDatafiltered = true
            }
          });
        }
      } else {
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

  rejectLead(data) {
    let RequestObj = {
      "LeadGuid": data.objectRowData.data.Id,
      "wipro_remarks": data.objectRowData.reject.comment,
      "Owner": { "SysGuid": this.MyOpenLeadsReqBody.Guid },
      "StatusReason": {
        "StatusGuid": data.objectRowData.reject.reasonType.StatusGuid,
        "SysGuid": data.objectRowData.reject.reasonType.id
      }
    }
    this.myOpenLeadsService.LeadReject(RequestObj).subscribe(async res => {
      if (!res.IsError) {
        this.errorMessage.throwError(res.Message)
        await this.leadListOfflineService.ClearEntireLeadIndexTableData()
        this.store.dispatch(new ClearArchivedLeadState())
        this.store.dispatch(new ClearOpenLeadState())
        this.store.dispatch(new ClearMyopenlead())
        this.router.navigateByUrl('leads/archived');
      } else {
        this.errorMessage.throwError(res.Message)
      }
    })
  }

  AcceptMyOpenlead(data) {
    let Requestbody = {
      "LeadGuid": data.objectRowData[0].Id,
      "Owner": {
        "SysGuid": data.objectRowData[0].ownerId
      }
    }
    this.myOpenLeadsService.AcceptLead(Requestbody).subscribe(res => {
      if (!res.IsError) {
        this.errorMessage.throwError(res.Message)
        const changes = { isAcceptable: false };                            //state management for edit 
        const AcceptLeadChange: Update<any> = {
          id: data.objectRowData[0].Id,
          changes
        }
        this.store.dispatch(new LeadAccepted({ updateLeadAccept: AcceptLeadChange }))
      } else {
        this.errorMessage.throwError(res.Message)
      }
    })
  }

  Navigate(data, route): void {
    if (route == "link") {
      if (data.objectRowData[0].statusText == 'Nurtured') {
        this.userdat.leadNuture = true
        this.userdat.leadDetails = false
        this.userdat.leadArchive = false
      } else {
        this.userdat.leadNuture = false
        this.userdat.leadDetails = true
        this.userdat.leadArchive = false
      }
      this.router.navigate(['/leads/leadDetails'])
    }
    // this.myOpenLeadsService.updateHistoryFlag(this.id)
  }

  downloadList(data): void {
    this.isLoading = true
    let useFulldata = {
      LeadsReqBody:this.MyOpenLeadsReqBody, 
      fieldheader: unqualifiedheader,
      nextLink: this.MyOpenLeadsReqBody.OdatanextLink,
      pageNo: this.MyOpenLeadsReqBody.RequestedPageNumber,
      userGuid: this.MyOpenLeadsReqBody.Guid,
      pageSize: this.MyOpenLeadsReqBody.PageSize
    }
    let isDownloadReqBody = this.leadListService.GetAppliedFilterData({ ...data, useFulldata: useFulldata})
    this.myOpenLeadsService.downloadLeadList(isDownloadReqBody).subscribe(res => {
      if (!res.IsError) {
        this.isLoading = false;
        if (this.envr.envName === 'MOBILEQA') {
          this.downloadListMobile(res.ResponseObject)
        } else {
          this.userdat.Base64Download(res.ResponseObject);
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

  getNewTableData(event) {
    if (event.action == 'pagination') {
      if (this.MyOpenLeadsReqBody.PageSize == event.itemsPerPage) {
        this.MyOpenLeadsReqBody.PageSize = event.itemsPerPage;
        this.MyOpenLeadsReqBody.RequestedPageNumber = event.currentPage;
        this.getMyopenLeadsList(event, true, true, true);
      }
      else {
        this.MyOpenLeadsReqBody.PageSize = event.itemsPerPage;
        this.MyOpenLeadsReqBody.RequestedPageNumber = event.currentPage;
        this.getMyopenLeadsList(event, false, true, true);
      }
    }
  }

  SearchTable(data): void {
    console.log(data)
    this.isLoading = true
    this.MyOpenLeadsReqBody.RequestedPageNumber = 1
    this.MyOpenLeadsReqBody.OdatanextLink = ""
    if (data != "") {
      if (data.objectRowData != "" && data.objectRowData != undefined) {
        let useFulldata = {
          pageSize: this.MyOpenLeadsReqBody.PageSize,
          userGuid: this.MyOpenLeadsReqBody.Guid,
          pageNo: 1,
          nextLink: this.MyOpenLeadsReqBody.OdatanextLink,
          LeadsReqBody:this.MyOpenLeadsReqBody,
          fieldheader: myopenleaddheader
        }
        let MyOpenLeadSearch = this.leadListService.GetAppliedFilterData({ ...data, useFulldata: useFulldata})
        this.myOpenLeadsService.getAppliedFilterLeadData(MyOpenLeadSearch).subscribe(res => {
          if (!res.IsError) {
            this.isLoading = false
            if (res.ResponseObject.length > 0) {
              let i = 1;
              res.ResponseObject.map(res => {
                res.index = i;
                i = i + 1;
              })
              this.myOpenLeadList = this.leadListService.leadListData(res.ResponseObject, IdentifyLeadstype)
              this.MyOpenLeadsReqBody.OdatanextLink = res.OdatanextLink
              this.tableTotalCount = res.TotalRecordCount
            } else {
              this.myOpenLeadList = [{}]
              this.tableTotalCount = 0;
            }
          } else {
            this.errorMessage.throwError(res.Message)
            this.isLoading = false
            this.myOpenLeadList = [{}]
          }
        }, error => {
          this.isLoading = false
          this.myOpenLeadList = [{}]
        })
      } else {
        this.isLoading = false
        this.getMyopenLeadsList(this.MyOpenLeadsReqBody, false, false, false)
      }
    } else {
      this.isLoading = false
    }
  }

  nurture(data): void {
      this.isLoading = true;
    if (data.action === 'nurture') {
      let nurtureleadObject = data.objectRowData.data.map(x => {
        return {
          "LeadGuid": x.Id,
          "wipro_nurture": true,
          "wipro_nurtureremarks": encodeURIComponent(data.objectRowData.comment)
        }
      })
      this.myOpenLeadsService.NurtureLead(nurtureleadObject).subscribe(async res => {
        if (res.IsError == false) {
          this.isLoading = false;
          this.myOpenLeadList = this.myOpenLeadList.map(x => {
            if (x.Id === data.objectRowData.data[0].Id) {
              x.statusText = "Nurtured"
            }
            return x;
          })
          const changes = { IsNurture: true, wipro_nurtureremarks: data.objectRowData.comment };                            //state management for edit 
          const NurtureChange: Update<any>[] = data.objectRowData.data.map(x => {
            return {
              id: x.Id,
              changes
            }
          })
          this.getMyopenLeadsList(data, false, false, true)
          this.errorMessage.onSuccessMessage(res.Message).afterDismissed().subscribe(() => {
            this.store.dispatch(new ClearAllLeadDetails())
            this.store.dispatch(new LeadNurture({ updateurture: NurtureChange }))
          })
        } else {
          this.errorMessage.throwError(res.Message)
          this.isLoading = false;
        }
      },
        error => {
          this.isLoading = false
        })
    }
  }

  qualifyLeads(data): void {
    this.isLoading = true;
    if (data.action == 'qualify') {
      let qualifiedleadObjects = data.objectRowData.data.map(x => {
        return {
          "LeadGuid": x.Id,//data.objectRowData.data[0].ID,
          "CreateAccount": false,
          "CreateContact": false,
          "CreateOpportunity": false,
          "statuscode": 3
        }
      })
      this.myOpenLeadsService.QyalifyLeads(qualifiedleadObjects).subscribe(async res => {
        if (res.IsError == false) {
          this.isLoading = false;
          const changes = {
            Status: {
              Id: IdentifyLeadstype.qualified,
              status: IdentifyLeadstype.qualifiedName
            }
          };
          const QualifyChange: Update<any>[] = data.objectRowData.data.map(x => {
            return {
              id: x.Id,
              changes
            }
          })
         
          this.errorMessage.onSuccessMessage(res.Message).afterDismissed().subscribe(() => {
            this.store.dispatch(new LeadQualify({ updatequalify: QualifyChange }))
            this.store.dispatch(new ClearArchivedLeadState())
            this.store.dispatch(new ClearOpenLeadState())
            this.store.dispatch(new ClearAllLeadDetails())
            const removeDisQualifyChange: [] = data.objectRowData.data.map(x => x.Id)
            this.store.dispatch(new LeadDisQualify({ ids: removeDisQualifyChange }))
            this.getMyopenLeadsList(data, false, false, true)
          })
  
        } else {
          this.errorMessage.throwError(res.Message)
          this.isLoading = false;
        }
      }, error => {
        this.isLoading = false
      })
    }
  }

  Createopp(data) {
    console.log(JSON.stringify(data))
    this.isLoading = true
    if(data.objectRowData.data[0].accountType == "Prospect"){
      localStorage.setItem('prospectaccountid', data.objectRowData.data[0].AccountGuid)
      this.router.navigate(['/accounts/createnewaccount']);
    }else if(data.objectRowData.data[0].accountType == "Reserve"){
      this.isLoading = false
    }else{
      this.contactleadService.getLeadDetails(data.objectRowData.data[0].Id, this.MyOpenLeadsReqBody.Guid).subscribe(res => {
        if(!res.IsError){
          sessionStorage.setItem('CreateOpportunityFromLead', JSON.stringify(res.ResponseObject));
          this.myOpenLeadsService.setSession('path', '/leads/unqalified');
          this.router.navigate(['/opportunity/newopportunity']);
        }else{
          this.errorMessage.throwError(res.IsError)
          this.isLoading = false
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
          "LeadGuid": x.Id,
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
          await this.leadListOfflineService.ClearEntireLeadIndexTableData()
          this.getMyopenLeadsList(data, false, false, true)
          this.errorMessage.onSuccessMessage(res.Message).afterDismissed().subscribe(()=>{
            this.store.dispatch(new ClearArchivedLeadState())
            this.store.dispatch(new ClearOpenLeadState())
            this.store.dispatch(new ClearAllLeadDetails())
            const removeDisQualifyChange: [] = data.objectRowData.data.map(x => x.Id)
            this.store.dispatch(new LeadDisQualify({ ids: removeDisQualifyChange }))
            if(this.router.url.includes('/accounts/accountleads')){
              this.router.navigateByUrl('accounts/accountleads/diqualified');
            }else{
              this.router.navigateByUrl('leads/diqualified');
            }
          })
        } else {
          this.errorMessage.throwError(res.Message)
          this.isLoading = false;
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

  archive(data): void {
    this.isLoading = true;
    if (data.action === 'archive') {
      let arcihveReqBody = data.objectRowData.data.map(x => {
        return {
          LeadGuid: x.Id,
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
          this.getMyopenLeadsList(data, false, false, true)
          if (data.objectRowData.data[0].Status == "Qualified") {
            this.errorMessage.throwError(res.Message)
          } else {
            this.errorMessage.throwError(LeadCustomErrorMessages.UnqualifiedArchive)
          }
          await this.leadListOfflineService.ClearEntireLeadIndexTableData()
          this.store.dispatch(new ClearArchivedLeadState())
          this.store.dispatch(new ClearOpenLeadState())
          this.store.dispatch(new ClearContactList())
          this.store.dispatch(new ClearRelationshipCount());
          this.store.dispatch(new ClearAllLeadDetails())
          this.store.dispatch(new ArchivedRestore({ ids: leadGuidArray }))
          
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

  restore(data): void {
    this.isLoading = true;
    if (data.action === 'restore') {
      let arcleadObject = data.objectRowData.data.map(x => {
        return {
          "LeadGuid": x.Id,
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
          this.getMyopenLeadsList(data, false, false, true)
          await this.leadListOfflineService.ClearLeadListIndexTableData(this.leadListOfflineService.LeadTableIdentity.MyOpenLead)
          await this.leadListOfflineService.ClearLeadListIndexTableData(this.leadListOfflineService.LeadTableIdentity.OpenLead)
          await this.leadListOfflineService.ClearLeadListIndexTableData(this.leadListOfflineService.LeadTableIdentity.ArchivedLead)
          this.errorMessage.onSuccessMessage(res.Message).afterDismissed().subscribe(() => {
            this.store.dispatch(new ClearArchivedLeadState())
            this.store.dispatch(new ClearOpenLeadState())
            this.store.dispatch(new ClearAllLeadDetails())
            this.store.dispatch(new ArchivedRestore({ ids: removeRestoreChange }))
          })
        } else {
          this.isLoading = false;
          this.errorMessage.throwError(res.Message)
        }
      })
    }
  }

  getMyopenLeadsList(reqBody, isConcat, isSearch, isLoader) {
    (reqBody.RequestedPageNumber == 1 && isLoader) ? this.isLoading = true : this.isLoading = false;
    let useFulldata = {
      LeadsReqBody:this.MyOpenLeadsReqBody, 
      fieldheader: unqualifiedheader,
      nextLink: this.MyOpenLeadsReqBody.OdatanextLink,
      pageNo: this.MyOpenLeadsReqBody.RequestedPageNumber,
      userGuid: this.MyOpenLeadsReqBody.Guid,
      pageSize:  this.MyOpenLeadsReqBody.PageSize
    }
    let reqparam = this.leadListService.GetAppliedFilterData({ ...reqBody, useFulldata: useFulldata})
    this.myOpenLeadsService.getAppliedFilterLeadData(reqparam).subscribe(res => {
    // this.myOpenLeadsService.getMyopenLeads(reqBody).subscribe(res => {
      if (!res.IsError) {
        this.isLoading = false;
        if (res.ResponseObject.length > 0) {
          const ImmutabelObj = Object.assign({}, res)
          const perPage = this.MyOpenLeadsReqBody.PageSize;
          const start = (( this.MyOpenLeadsReqBody.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;
          res.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          })
          if (res.OdatanextLink) {
            this.MyOpenLeadsReqBody.OdatanextLink = res.OdatanextLink
          }
          if (isConcat) {
            let spliceArray = [];
            this.myOpenLeadList.map((res) => {
              if (res.index >= start && res.index <= end) {
                spliceArray.push(res);
              }
            });
            spliceArray.map(res => {
              this.myOpenLeadList.splice(this.myOpenLeadList.indexOf(res), 1);
            })
            if (!isSearch) {
              ImmutabelObj.ResponseObject.map(x => x.id = x.LeadGuid)
              const LoadMyOpenLeadAction = {
                listdata: ImmutabelObj.ResponseObject,
                count: ImmutabelObj.TotalRecordCount,
                nextlink: this.MyOpenLeadsReqBody.OdatanextLink
              }
              this.store.dispatch(new LoadMyOpenleads({ myOpenLeads: LoadMyOpenLeadAction }))
            } else {
              this.myOpenLeadList = [ ...this.myOpenLeadList, ...this.leadListService.leadListData(res.ResponseObject, IdentifyLeadstype)]
              //this.myOpenLeadList = this.myOpenLeadList.concat(this.leadListService.leadListData(res.ResponseObject, IdentifyLeadstype))
            }
          } else {
            this.myOpenLeadList = this.leadListService.leadListData(res.ResponseObject, IdentifyLeadstype)
          }
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.myOpenLeadList = [{}]
        }
      } else {
        this.errorMessage.throwError(res.Message)
        this.myOpenLeadList = [{}]
        this.isLoading = false;
      }
    }, error => {
      this.isLoading = false
      this.myOpenLeadList = [{}]
    })
  }

  ngOnDestroy() {
    this.StateMyOpenLeadList$.unsubscribe()
  }
}






