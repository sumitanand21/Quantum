import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar, } from '@angular/material';
import { ArchivedLeadsService, DataCommunicationService, QualifiedLeadsService, ContactleadService, OnlineOfflineService, OfflineService, UnqualifiedLeadsService, ErrorMessage, LeadListOfflineService, unqualifiedheader, headerQualified } from '@app/core/services';
import { DatePipe } from '@angular/common';
import { DatePickerFormat } from '@app/core/services/datePicker-format.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { LoaderService } from '@app/core/services/loader.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { OpenLeadsService } from '@app/core/services/openlead.service';
import { MyOpenLeadsService, LeadCustomErrorMessages } from '@app/core/services/myopenlead.service';
import { ClearArchivedLeadState, LoadOpenLeadList, ClearOpenLeadState, LeadAccepted, LeadNurture, LeadQualify, ClearMyopenlead, LeadDisQualify, ArchivedRestore, ClearAllLeadDetails } from '@app/core/state/actions/leads.action';
import { getOpenLeadsList } from '@app/core/state/selectors/lead/lead.selector';
import { Update } from '@ngrx/entity';
import { ClearRelationshipCount, ClearContactList } from '@app/core/state/actions/contact.action';
import { environment as env } from '@env/environment';
import { PaginationComponent } from 'ngx-bootstrap';
import { changeOpportunity } from '@app/core';
import { LeadListService } from '@app/core/services/lead-list-service';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;
enum IdentifyLeadstype {
  "unqualified" = 1,
  "qualified" = 3,
  "unqualifiedName" = "Unqualified",
  "qualifiedName" = "Qualified"
}
@Component({
  selector: 'app-qualified-leads',
  templateUrl: './qualified-leads.component.html',
  styleUrls: ['./qualified-leads.component.scss']
})
export class QualifiedLeadsComponent implements OnInit, OnDestroy {

  qualifiedTable = [];
  tableTotalCount: number = 0;
  isLoading: boolean = false
  StateOpenLeadList$: Subscription
  id: any

  OpenLeadList = [];
  public userGuid

  rejectReasons = {
    reason: []
  }
  configData = {
    "disqalify": []
  }

  OpenLeadsReqBody = {
    "StatusCode": 2,
    "PageSize": 50,
    "RequestedPageNumber":  1,
    "OdatanextLink": "",
    "FilterData":  []
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

  constructor(private router: Router,
    private userdat: DataCommunicationService,
    private onlineOfflineService: OnlineOfflineService,
    public archivelead: ArchivedLeadsService,
    private disqualifys: UnqualifiedLeadsService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    public disqualify: UnqualifiedLeadsService,
    private date: DatePickerFormat,
    public loaderService: LoaderService,
    private encrDecrService: EncrDecrService,
    public errorMessage: ErrorMessage,
    private store: Store<AppState>,
    public openLeadService: OpenLeadsService,
    private datePipe: DatePipe,
    private myOpenLeadsService: MyOpenLeadsService,
    private contactleadService: ContactleadService,
    private leadListOfflineService: LeadListOfflineService,
    private leadListService: LeadListService,public envr : EnvService) { }

  async ngOnInit() {
    this.myOpenLeadsService.clearLeadAddContactSessionStore()
    this.openLeadService.sendConfigData = []
    this.getDisqualifyReason();
    this.RejectReasons()
    sessionStorage.setItem('navigationfromlist', JSON.stringify(1))
    this.userGuid = this.encrDecrService.get("EncryptionEncryptionEncryptionEn", localStorage.getItem("userID"), 'DecryptionDecrip')
    this.StateOpenLeadList$ = this.store.pipe(select(getOpenLeadsList)).subscribe(res => {
      if (res) {
        if (res.ids.length > 0) {
          this.OpenLeadList = this.leadListService.leadListData(Object.keys(res.entities).map(e => res.entities[e]), IdentifyLeadstype)
          this.tableTotalCount = res.count;
          this.OpenLeadsReqBody.OdatanextLink = res.nextlink
        } else {
          this.getOpenLeadsList(this.OpenLeadsReqBody, true, false, true)
        }
      }
      else {
        this.getOpenLeadsList(this.OpenLeadsReqBody, true, false, true)
      }
    })

    if (!this.onlineOfflineService.isOnline) {
      let key = this.leadListOfflineService.LeadTableIdentity.OpenLead
      const CacheResponse = await this.myOpenLeadsService.getCachedLeadList(key)
      if (CacheResponse) {

        if (CacheResponse.data.length > 0) {
          this.isLoading = false;
          this.OpenLeadList = this.leadListService.leadListData(Object.values(CacheResponse.data), IdentifyLeadstype)
          this.tableTotalCount = CacheResponse.count
          this.OpenLeadsReqBody.OdatanextLink = CacheResponse.nextlink
        }
      }
    }
  }

  RejectReasons() {
    this.disqualify.rejectedLeadReason().subscribe(res => {
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

  performTableChildAction(childActionRecieved){
    if (childActionRecieved) {
      (childActionRecieved.parentData) ? this.tableTotalCount = childActionRecieved.parentData.totalCount : this.tableTotalCount = this.tableTotalCount
    }
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {
      case 'share': {
        this.router.navigateByUrl('/activities/childInfo');
        break;
      }
      case 'Name': {
        this.id = childActionRecieved.objectRowData[0].Id
        this.myOpenLeadsService.updateHistoryFlag(this.id, false)
        sessionStorage.setItem('navigationfromlist', JSON.stringify(1))
        sessionStorage.setItem('LeadId', JSON.stringify(this.encrDecrService.set('EncryptionEncryptionEncryptionEn', this.id, 'DecryptionDecrip')));
        var leadName = childActionRecieved.objectRowData[0].Name
        sessionStorage.setItem('leadName', JSON.stringify(leadName));
        sessionStorage.setItem('hideNurture', JSON.stringify(childActionRecieved.objectRowData[0].nurtureBtnVisibility));
        this.openLeadService.sendPageNumber = childActionRecieved.pageData.currentPage
        this.openLeadService.sendPageSize = childActionRecieved.pageData.itemsPerPage
        this.openLeadService.sendConfigData = childActionRecieved.configData.filterData
        this.Navigate(childActionRecieved, "link")
        break;
      }
      case 'search': {
        this.SearchTable(childActionRecieved);
        break;
      }
      case "Ticked": {
        this.AcceptMyOpenlead(childActionRecieved)
        break;
      }
      case 'nurture': {
        this.nurture(childActionRecieved);
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
      case 'reject': {
        this.rejectLead(childActionRecieved)
        break;
      }
      case 'archive': {
        this.archieve(childActionRecieved);
        break;
      }
      case 'restore': {
        this.restore(childActionRecieved)
        break;
      }
      case 'tabNavigation':{
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
        this.OpenLeadsReqBody.OdatanextLink = ''
        this.OpenLeadsReqBody.RequestedPageNumber = 1
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
      this.OpenLeadsReqBody = {
        "StatusCode": 2,
        "PageSize":  this.OpenLeadsReqBody.PageSize,
        "RequestedPageNumber":  1,
        "OdatanextLink": "",
        "FilterData":  []
      }
      this.getOpenLeadsList(this.OpenLeadsReqBody, false, false, true)
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
          this.OpenLeadsReqBody.OdatanextLink = ''
          this.OpenLeadsReqBody.RequestedPageNumber = 1
          this.CallListDataWithFilters(data)
        }else if (data.filterData.isApplyFilter && data.filterData.globalSearch != ""){
          this.CallListDataWithFilters(data)
        } else {
          this.store.dispatch(new ClearOpenLeadState())
          this.OpenLeadsReqBody.OdatanextLink = ''
          this.OpenLeadsReqBody.RequestedPageNumber = 1
          this.getOpenLeadsList(this.OpenLeadsReqBody, false, true, false)
        }
      }
    }
  }

  GetColumnSearchFilters(data) {
    let headerName = data.filterData.headerName
    this.OpenLeadsReqBody.OdatanextLink = ''
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
    let useFulldata ={
      LeadsReqBody:this.OpenLeadsReqBody, 
      fieldheader: headerQualified, 
      userGuid: this.userGuid,
      pageSize:this.OpenLeadsReqBody.PageSize,
      pageNo: this.OpenLeadsReqBody.RequestedPageNumber,
      nextLink: this.OpenLeadsReqBody.OdatanextLink
    }
    let reqparam = this.leadListService.GetAppliedFilterData({ ...data, useFulldata: useFulldata})
    this.myOpenLeadsService.getAppliedFilterLeadData(reqparam).subscribe(res => {
      if (!res.IsError) {
        if (res.ResponseObject.length > 0) {
          // const ImmutabelObj = Object.assign({}, res)
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
          this.OpenLeadList = this.leadListService.leadListData(res.ResponseObject, IdentifyLeadstype)
          this.OpenLeadsReqBody.OdatanextLink = res.OdatanextLink
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.OpenLeadList = [{}]
          this.tableTotalCount = 0;
        }
      } else {
        this.errorMessage.throwError(res.Message)
      }
    })
  }

  generateFilterConfigData(data, headerName, isConcat, isServiceCall?) {
    if (isServiceCall) {
      let useFulldata = {
          headerName: headerName,
          searchVal: data.filterData.columnSerachKey,
          Searchtype: 2,
          pageNo: this.filterConfigData[headerName].PageNo,
          pageSize: 10,
          nextLink: this.filterConfigData[headerName].NextLink,
          LeadsReqBody:this.OpenLeadsReqBody, 
          fieldheader: headerQualified, 
          userGuid: this.userGuid
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
            let index =this.filterConfigData[headerName].data.findIndex(x => x.id == res.id)
            if (index!==-1) {
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

  allBtnsLable = ['nurtureBtnVisibility', 'restoreBtnVisibility'];
  /*Tab Switch*/
  TabNavigation(item) {
    this.myOpenLeadsService.leadTabNavigations(item);
  }

  downloadList(data): void {
    this.isLoading = true
    let useFulldata ={
      LeadsReqBody:this.OpenLeadsReqBody, 
      fieldheader: headerQualified, 
      userGuid: this.userGuid,
      pageSize:this.OpenLeadsReqBody.PageSize,
      pageNo: this.OpenLeadsReqBody.RequestedPageNumber,
      nextLink: this.OpenLeadsReqBody.OdatanextLink
    }
    let isDownloadReqBody = this.leadListService.GetAppliedFilterData({ ...data, useFulldata:useFulldata })
    this.myOpenLeadsService.downloadLeadList(isDownloadReqBody).subscribe(res => {
      if (!res.IsError) {
        this.isLoading = false
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

  AcceptMyOpenlead(data) {
    this.isLoading = true;
    let Requestbody = {
      "LeadGuid": data.objectRowData[0].Id,
      "Owner": {
        "SysGuid": data.objectRowData[0].ownerId
      }
    }
    this.myOpenLeadsService.AcceptLead(Requestbody).subscribe(res => {
      if (!res.IsError) {
        this.isLoading = false;
        this.errorMessage.throwError(res.Message)
        const changes = { isAcceptable: false };                            //state management for edit 
        const AcceptLeadChange: Update<any> = {
          id: data.objectRowData[0].Id,
          changes
        }
        this.store.dispatch(new LeadAccepted({ updateLeadAccept: AcceptLeadChange }))
      } else {
        this.isLoading = false;
        this.errorMessage.throwError(res.Message)
      }
    })
  }

  Navigate(data, route): void {
    if (route == "link") {
      sessionStorage.setItem('qualifiedLeads', JSON.stringify(data.objectRowData[0]));
      if (data.objectRowData[0].statusText == 'Nurtured') {
        this.userdat.leadNuture = true
        this.userdat.leadDetails = false
        this.userdat.leadArchive = false
      } else {
        this.userdat.leadNuture = false
        this.userdat.leadDetails = true
        this.userdat.leadArchive = false
      }
      // this.myOpenLeadsService.updateHistoryFlag(this.id)
      let encId = this.encrDecrService.set("EncryptionEncryptionEncryptionEn", [data.objectRowData[0].Id, 1], "DecryptionDecrip");
      this.router.navigate(['/leads/leadDetails'])
    }
  }

  rejectLead(data) {
    this.isLoading = true;
    let RequestObj = {
      "LeadGuid": data.objectRowData.data.Id,
      "wipro_remarks": data.objectRowData.reject.comment,
      "Owner": { "SysGuid": this.userGuid },
      "StatusReason": {
        "StatusGuid": data.objectRowData.reject.reasonType.StatusGuid,
        "SysGuid": data.objectRowData.reject.reasonType.id
      }
    }
    this.myOpenLeadsService.LeadReject(RequestObj).subscribe(async res => {
      if (!res.IsError) {
        this.isLoading = false;
        this.getOpenLeadsList(data, false, false, true)
        this.errorMessage.onSuccessMessage(res.Message).afterDismissed().subscribe(() => {
          this.leadListOfflineService.ClearEntireLeadIndexTableData()
          this.store.dispatch(new ClearArchivedLeadState())
          this.store.dispatch(new ClearMyopenlead())
          this.router.navigateByUrl('leads/archived');
        })
      } else {
        this.isLoading = false;
        this.errorMessage.throwError(res.Message)
      }
    }, error => {
      this.isLoading = false;
    })
  }

  qualifyLeads(data): void {
    this.isLoading = true;
    if (data.action == 'qualify') {
      let qualifiedleadObjects = data.objectRowData.data.map(x => {
        return {
          "LeadGuid": x.Id,
          "CreateAccount": false,
          "CreateContact": false,
          "CreateOpportunity": false,
          "statuscode": 3
        }
      })
      this.myOpenLeadsService.QyalifyLeads(qualifiedleadObjects).subscribe(async res => {
        if (res.IsError == false) {
          this.isLoading= false;
          this.leadListOfflineService.ClearEntireLeadIndexTableData()
          this.errorMessage.throwError(res.Message)
          this.isLoading = false
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
          const removeDisQualifyChange: [] = data.objectRowData.data.map(x => x.Id)
          this.errorMessage.onSuccessMessage(res.Message).afterDismissed().subscribe(() => {
            this.store.dispatch(new LeadQualify({ updatequalify: QualifyChange }))
            this.store.dispatch(new ClearArchivedLeadState())
            this.store.dispatch(new ClearMyopenlead())
            this.store.dispatch(new ClearAllLeadDetails())
            this.store.dispatch(new LeadDisQualify({ ids: removeDisQualifyChange }))
            this.getOpenLeadsList(data, false, false, true)
          })
        } else {
          this.isLoading = false
          this.errorMessage.throwError(res.Message)
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
      this.contactleadService.getLeadDetails(data.objectRowData.data[0].Id, this.userGuid).subscribe(res => {
        if(!res.IsError){
          sessionStorage.setItem('CreateOpportunityFromLead', JSON.stringify(res.ResponseObject));
          this.myOpenLeadsService.setSession('path', '/leads/qualified');
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
          this.getOpenLeadsList(data, false, false, true)
          this.errorMessage.onSuccessMessage(res.Message).afterDismissed().subscribe(() => {
            this.store.dispatch(new ClearArchivedLeadState())
            this.store.dispatch(new ClearMyopenlead())
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

  archieve(data): void {
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
      let leadGuidArray = []
      let leadIds = data.objectRowData.data.map(x => leadGuidArray.push(x.Id))
      this.myOpenLeadsService.ArchiveLeads(arcihveReqBody).subscribe(async res => {
        if (res.IsError == false) {
          this.isLoading = false;
          this.leadListOfflineService.ClearEntireLeadIndexTableData()
          this.store.dispatch(new ClearArchivedLeadState())
          this.store.dispatch(new ClearMyopenlead())
          this.store.dispatch(new ArchivedRestore({ ids: leadGuidArray }))
          this.store.dispatch(new ClearContactList())
          this.store.dispatch(new ClearRelationshipCount());
          this.store.dispatch(new ClearAllLeadDetails())
          this.getOpenLeadsList(data, false, false, true)
          if (data.objectRowData.data[0].Status == "Qualified") {
            this.errorMessage.throwError(res.Message)
          } else {
            this.errorMessage.throwError(LeadCustomErrorMessages.UnqualifiedArchive)
          }
        } else {
          this.isLoading = false
          this.errorMessage.throwError(res.Message)
        }
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
          await this.leadListOfflineService.ClearLeadListIndexTableData(this.leadListOfflineService.LeadTableIdentity.MyOpenLead)
          await this.leadListOfflineService.ClearLeadListIndexTableData(this.leadListOfflineService.LeadTableIdentity.OpenLead)
          await this.leadListOfflineService.ClearLeadListIndexTableData(this.leadListOfflineService.LeadTableIdentity.ArchivedLead)
          this.getOpenLeadsList(data, false, false, true)
          this.errorMessage.onSuccessMessage(res.Message).afterDismissed().subscribe(() => {
            const removeRestoreChange: [] = data.objectRowData.data.map(x => x.ID)
            this.store.dispatch(new ArchivedRestore({ ids: removeRestoreChange }))
            this.store.dispatch(new ClearArchivedLeadState())
            this.store.dispatch(new ClearMyopenlead())
            this.store.dispatch(new ClearAllLeadDetails())
          })
        } else {
          this.errorMessage.throwError(res.Message)
        }
      })
    }
  }
  
  nurture(data): void {
    this.isLoading = true;
    if (data.action === 'nurture') {
      this.isLoading = false;
      let nurtureleadObject = data.objectRowData.data.map(x => {
        return {
          "LeadGuid": x.Id,
          "wipro_nurture": true,
          "wipro_nurtureremarks": encodeURIComponent(data.objectRowData.comment)
        }
      })
      this.myOpenLeadsService.NurtureLead(nurtureleadObject).subscribe(async res => {
        if (res.IsError == false) {
          this.errorMessage.throwError(res.Message)
          const changes = { IsNurture: true, wipro_nurtureremarks: data.objectRowData.comment };
          const NurtureChange: Update<any>[] = data.objectRowData.data.map(x => {
            return {
              id: x.Id,
              changes
            }
          })
          this.getOpenLeadsList(data, false, false, true)
          this.errorMessage.onSuccessMessage(res.Message).afterDismissed().subscribe(() => {
            this.store.dispatch(new ClearAllLeadDetails())
            this.store.dispatch(new LeadNurture({ updateurture: NurtureChange }))
          })
        } else {
          this.isLoading = false;
          this.errorMessage.throwError(res.Message)
        }
      }, error => {
        this.isLoading = false;
      })
    }
  }

  getNewTableData(event) {
    if (event.action == 'pagination') {
      if (this.OpenLeadsReqBody.PageSize == event.itemsPerPage) {
        this.OpenLeadsReqBody.PageSize = event.itemsPerPage;
        this.OpenLeadsReqBody.RequestedPageNumber = event.currentPage;
        this.getOpenLeadsList(event, true, true, true);
      }
      else {
        this.OpenLeadsReqBody.PageSize = event.itemsPerPage;
        this.OpenLeadsReqBody.RequestedPageNumber = event.currentPage;
        this.getOpenLeadsList(event, false, true, true);
      }
    }
  }

  SearchTable(data): void {
    console.log(data)
    this.OpenLeadsReqBody.RequestedPageNumber = 1
    this.OpenLeadsReqBody.OdatanextLink = ""
    if (data != "") {
      if (data.objectRowData != "" && data.objectRowData != undefined) {
        let useFulldata = {
          pageSize: this.OpenLeadsReqBody.PageSize,
          userGuid: this.userGuid,
          pageNo: 1,
          nextLink: this.OpenLeadsReqBody.OdatanextLink,
          LeadsReqBody:this.OpenLeadsReqBody,
          fieldheader: headerQualified
        }
        let OpenLeadSearch = this.leadListService.GetAppliedFilterData({ ...data, useFulldata: useFulldata})
        this.isLoading = true
        this.myOpenLeadsService.getAppliedFilterLeadData(OpenLeadSearch).subscribe(res => {
          if (!res.IsError) {
            this.isLoading = false
            if (res.ResponseObject.length > 0) {
              let i = 1;
              res.ResponseObject.map(res => {
                res.index = i;
                i = i + 1;
              })
              this.OpenLeadList = this.leadListService.leadListData(res.ResponseObject, IdentifyLeadstype)
              this.OpenLeadsReqBody.OdatanextLink = res.OdatanextLink
              this.tableTotalCount = res.TotalRecordCount
            } else {
              this.OpenLeadList = [{}]
              this.tableTotalCount = 0;
            }
          } else {
            this.isLoading = false
            this.OpenLeadList = [{}]
          }
        }, error => {
          this.isLoading = false
          this.OpenLeadList = [{}]
        })
      } else {
        this.isLoading = false
        this.getOpenLeadsList(this.OpenLeadsReqBody, false, false, false)
      }
    }
  }

  getOpenLeadsList(reqBody, isConcat, isSearch, isLoading) {
    (reqBody.RequestedPageNumber == 1 && isLoading) ? this.isLoading = true : this.isLoading = false;
    let useFulldata = {
      pageNo:  this.OpenLeadsReqBody.RequestedPageNumber,
      pageSize: this.OpenLeadsReqBody.PageSize,
      nextLink: this.OpenLeadsReqBody.OdatanextLink,
      LeadsReqBody:this.OpenLeadsReqBody,
      fieldheader: headerQualified,
      userGuid: this.userGuid,
    }
    let reqparam = this.leadListService.GetAppliedFilterData({ ...reqBody, useFulldata: useFulldata})
    this.myOpenLeadsService.getAppliedFilterLeadData(reqparam).subscribe(res => {
    // this.openLeadService.getOpenLeads(reqBody).subscribe(res => {
      if (!res.IsError) {
        this.isLoading = false
        if (res.ResponseObject.length > 0) {
          const ImmutabelObj = Object.assign({}, res)
          const perPage = this.OpenLeadsReqBody.PageSize;
          const start = ((this.OpenLeadsReqBody.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;
          res.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          })
          if (res.OdatanextLink) {
            this.OpenLeadsReqBody.OdatanextLink = res.OdatanextLink
          }
          if (isConcat) {
            let spliceArray = [];
            this.OpenLeadList.map((res) => {
              if (res.index >= start && res.index <= end) {
                spliceArray.push(res);
              }
            });
            spliceArray.map(res => {
              this.OpenLeadList.splice(this.OpenLeadList.indexOf(res), 1);
            })
            if (!isSearch) {
              ImmutabelObj.ResponseObject.map(x => x.id = x.LeadGuid)
              const LoadOpenLeadAction = {
                listdata: ImmutabelObj.ResponseObject,
                count: ImmutabelObj.TotalRecordCount,
                nextlink:this.OpenLeadsReqBody.OdatanextLink
              }
              this.store.dispatch(new LoadOpenLeadList({ openLeadList: LoadOpenLeadAction }))
            } else {
              this.OpenLeadList = this.OpenLeadList.concat(this.leadListService.leadListData(res.ResponseObject, IdentifyLeadstype))
            }
          } else {
            // need to handle the search when api is ready!
            this.OpenLeadList = this.leadListService.leadListData(res.ResponseObject, IdentifyLeadstype)
          }
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.isLoading = false
          this.OpenLeadList = [{}]
        }
      } else {
        this.OpenLeadList = [{}]
        this.errorMessage.throwError(res.Message)
        this.isLoading = false;
      }
    }, error => {
      this.isLoading = false
      this.OpenLeadList = [{}]
    })
  }

  ngOnDestroy() {
    this.StateOpenLeadList$.unsubscribe()
  }
}















