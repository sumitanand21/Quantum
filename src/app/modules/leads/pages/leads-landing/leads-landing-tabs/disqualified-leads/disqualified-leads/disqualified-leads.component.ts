import { Component, OnInit } from '@angular/core';
import { DataCommunicationService, ErrorMessage, LeadListOfflineService, ContactleadService, UnqualifiedLeadsService, ArchivedLeadsService } from '@app/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { disqualifiedLeadsService, headerdisqualified } from '@app/core/services/disqualifiedlead.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { MyOpenLeadsService, LeadCustomErrorMessages } from '@app/core/services/myopenlead.service';
import { environment as env } from '@env/environment';
import { LeadListService } from '@app/core/services/lead-list-service';
import { ClearArchivedLeadState, ClearOpenLeadState, ClearMyopenlead, ArchivedRestore, LeadNurture, LeadQualify, LeadDisQualify, ClearAllLeadDetails } from '@app/core/state/actions/leads.action';
import { ClearContactList, ClearRelationshipCount } from '@app/core/state/actions/contact.action';
import { Update } from '@ngrx/entity';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;

enum IdentifyLeadstype {
  "unqualified" = 1,
  "qualified" = 3,
  "unqualifiedName" = "Unqualified",
  "qualifiedName" = "Qualified"
}

@Component({
  selector: 'app-disqualified-leads',
  templateUrl: './disqualified-leads.component.html',
  styleUrls: ['./disqualified-leads.component.scss']
})
export class DisqualifiedLeadsComponent implements OnInit {

  DisQualifyLeadsReqBody = {
    "StatusCode": 7,
    "PageSize":  50,
    "RequestedPageNumber": 1,
    "OdatanextLink": "",
    "FilterData":  [],
    "Guid": ""
  }
  
  constructor(public userdat: DataCommunicationService,
    public router: Router,
    private service: DataCommunicationService,
    private fb: FormBuilder, public dialog: MatDialog,
    public disqualifiedleads: disqualifiedLeadsService,
    private encrDecrService: EncrDecrService,
    private leadListService: LeadListService,
    private errorMessage: ErrorMessage,
    private myOpenLeadsService: MyOpenLeadsService,
    private leadListOfflineService: LeadListOfflineService,
    private contactleadService: ContactleadService,
    private disqualifys: UnqualifiedLeadsService,
    public archivelead: ArchivedLeadsService,
    public store: Store<AppState>,
    public envr : EnvService
  ) { }

  disqualifiedLeadList: any = [];
  isLoading: boolean;
  tableTotalCount = 0;
  detailsId: any;
  isDownloadObject: any;
  configData = {
    "disqalify": []
  }
  allBtnsLable = ['nurtureBtnVisibility', 'restoreBtnVisibility'];
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

  TablePagination(data) { }

  getNewTableData(event) {
    if (event.action == 'pagination') {
      // this.DisQualifyLeadsReqBody.PageSize = event.itemsPerPage;
      // this.DisQualifyLeadsReqBody.RequestedPageNumber = event.currentPage;
      // this.getDisQualifiedLeadsList(event, true, false, false)

      if (this.DisQualifyLeadsReqBody.PageSize == event.itemsPerPage) {
        this.DisQualifyLeadsReqBody.PageSize = event.itemsPerPage;
        this.DisQualifyLeadsReqBody.RequestedPageNumber = event.currentPage;
        this.getDisQualifiedLeadsList(event, true, true, true);
      }
      else {
        this.DisQualifyLeadsReqBody.PageSize = event.itemsPerPage;
        this.DisQualifyLeadsReqBody.RequestedPageNumber = event.currentPage;
        this.getDisQualifiedLeadsList(event, false, true, true);
      }
    }
  }

  performTableChildAction(childActionRecieved){
    var actionRequired = childActionRecieved;
    console.log(actionRequired.action)
    if (childActionRecieved) {
      (childActionRecieved.parentData) ? this.tableTotalCount = childActionRecieved.parentData.totalCount : this.tableTotalCount = this.tableTotalCount
    }
    console.log(childActionRecieved)
    switch (actionRequired.action) {
      case 'pagination': {
        this.TablePagination(childActionRecieved);
        break;
      }
      case 'search': {
        this.isLoading = false;
        this.SearchTable(childActionRecieved)
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
      case 'restore': {
        this.restore(childActionRecieved)
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
      case 'Name': {
        this.detailsId = childActionRecieved.objectRowData[0].ID
        this.myOpenLeadsService.updateHistoryFlag( this.detailsId , false)
        sessionStorage.setItem('navigationfromlist', JSON.stringify(4))
        sessionStorage.setItem('LeadId', JSON.stringify(this.encrDecrService.set('EncryptionEncryptionEncryptionEn', this.detailsId, 'DecryptionDecrip')));
        this.disqualifiedleads.sendPageNumber = childActionRecieved.pageData.currentPage
        this.disqualifiedleads.sendPageSize = childActionRecieved.pageData.itemsPerPage
        this.disqualifiedleads.sendConfigData = childActionRecieved.configData.filterData
        this.Navigate(childActionRecieved, 'Name')
        break;
      }
      case 'tabNavigation':{
          this.TabNavigation(childActionRecieved.objectRowData[0]);
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
        this.DisQualifyLeadsReqBody.OdatanextLink = ''
        this.DisQualifyLeadsReqBody.RequestedPageNumber = 1
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
    
  this.DisQualifyLeadsReqBody = {
    "StatusCode": 7,
    "PageSize":  this.DisQualifyLeadsReqBody.PageSize,
    "RequestedPageNumber": 1,
    "OdatanextLink": "",
    "FilterData":  [],
    "Guid": ""
  }
    this.getDisQualifiedLeadsList(this.DisQualifyLeadsReqBody, false, false, true)
  }

  downloadList(data): void {
    this.isLoading = true
    let useFulldata = {
      pageNo: this.DisQualifyLeadsReqBody.RequestedPageNumber,
      pageSize:  this.DisQualifyLeadsReqBody.PageSize,
      nextLink: this.DisQualifyLeadsReqBody.OdatanextLink,
      LeadsReqBody:this.DisQualifyLeadsReqBody, 
      fieldheader: headerdisqualified, 
      userGuid:this.DisQualifyLeadsReqBody.Guid,
      Searchtype: 7
    }
    let isDownloadReqBody = this.leadListService.GetAppliedFilterData({ ...data, useFulldata:useFulldata})
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

  GetColumnFilters(data) {
    if (data.filterData) {
      if (!data.filterData.isApplyFilter) {
        debugger
        let headerName = data.filterData.headerName
        this.filterConfigData[headerName].data = [];
        this.filterConfigData[headerName].PageNo = 1;
        this.generateFilterConfigData(data, headerName, false, this.leadListService.CheckFilterServiceFlag(data, headerName, this.filterConfigData))
      } else {
        if (data.filterData.isApplyFilter && this.userdat.CheckFilterFlag(data)) {
          this.DisQualifyLeadsReqBody.OdatanextLink = ''
          this.DisQualifyLeadsReqBody.RequestedPageNumber = 1
          this.CallListDataWithFilters(data)
        }else if (data.filterData.isApplyFilter && data.filterData.globalSearch != ""){
          this.CallListDataWithFilters(data)
        } else {
          this.DisQualifyLeadsReqBody.OdatanextLink = ''
          this.DisQualifyLeadsReqBody.RequestedPageNumber = 1
          this.getDisQualifiedLeadsList(this.DisQualifyLeadsReqBody, false, true, false)
        }
      }
    }
  }

  GetColumnSearchFilters(data) {
    let headerName = data.filterData.headerName
    this.DisQualifyLeadsReqBody.OdatanextLink = ''
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
    let useFulldata= {
      LeadsReqBody:this.DisQualifyLeadsReqBody, 
      fieldheader: headerdisqualified,
      userGuid:this.DisQualifyLeadsReqBody.Guid,
      nextLink: this.DisQualifyLeadsReqBody.OdatanextLink,
      pageNo: this.DisQualifyLeadsReqBody.RequestedPageNumber,
      pageSize: this.DisQualifyLeadsReqBody.PageSize
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
          this.disqualifiedLeadList = this.getTableFilterData(res.ResponseObject)
          this.DisQualifyLeadsReqBody.OdatanextLink = res.OdatanextLink
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.disqualifiedLeadList = [{}]
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
        pageNo: this.filterConfigData[headerName].PageNo,
        pageSize: 10,
        nextLink: this.filterConfigData[headerName].NextLink,
        LeadsReqBody:this.DisQualifyLeadsReqBody, 
        fieldheader: headerdisqualified, 
        userGuid:this.DisQualifyLeadsReqBody.Guid,
        searchVal: data.filterData.columnSerachKey,
        Searchtype: 7
      }
      this.myOpenLeadsService.getActionListConfigData({ ...data, useFulldata: useFulldata}).subscribe(res => {
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

  ngOnInit(): void {
    this.getDisqualifyReason();
    sessionStorage.setItem('navigationfromlist', JSON.stringify(4))
    this.isLoading = true
    this.DisQualifyLeadsReqBody.Guid = this.encrDecrService.get("EncryptionEncryptionEncryptionEn", localStorage.getItem("userID"), 'DecryptionDecrip');
    this.getDisQualifiedLeadsList(this.DisQualifyLeadsReqBody, true, false, true)
  }

  TabNavigation(item) {
    this.myOpenLeadsService.leadTabNavigations(item);
  }

  // get disqualified list
  getDisQualifiedLeadsList(reqBody, isConcat, isSearch, isLoader) {
    (reqBody.RequestedPageNumber == 1 && isLoader) ? this.isLoading = true : this.isLoading = false;
    let useFulldata = {
      LeadsReqBody:this.DisQualifyLeadsReqBody, 
      fieldheader: headerdisqualified,
      nextLink: this.DisQualifyLeadsReqBody.OdatanextLink,
      pageNo: this.DisQualifyLeadsReqBody.RequestedPageNumber,
      userGuid:this.DisQualifyLeadsReqBody.Guid,
      pageSize:  this.DisQualifyLeadsReqBody.PageSize
    }
    let reqparam = this.leadListService.GetAppliedFilterData({ ...reqBody, useFulldata: useFulldata})
    this.myOpenLeadsService.getAppliedFilterLeadData(reqparam).subscribe(res => {
    // this.disqualifiedleads.getDisqualifiedLeads(reqBody).subscribe(res => {
      if (!res.IsError) {
        this.isLoading = false;
        if (res.ResponseObject.length > 0) {
          const ImmutableObject = Object.assign({}, res)
          const perPage = this.DisQualifyLeadsReqBody.PageSize;
          const start = ((this.DisQualifyLeadsReqBody.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;
          res.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          })
          if (res.OdatanextLink) {
            this.disqualifiedLeadList.OdatanextLink = res.OdatanextLink
          }
          if (isConcat) {
            let spliceArray = [];
            this.disqualifiedLeadList.map((res) => {
              if (res.index >= start && res.index <= end) {
                spliceArray.push(res);
              }
            });
            spliceArray.map(res => {
              this.disqualifiedLeadList.splice(this.disqualifiedLeadList.indexOf(res), 1);
            })
            if (!isSearch) {
              ImmutableObject.ResponseObject.map(x => x.id = x.LeadGuid)
              this.disqualifiedLeadList = this.disqualifiedLeadList.concat(this.getTableFilterData(res.ResponseObject))
              // this.store.dispatch(new DisqualifiedLeadList({ DisqualifiedLeads: ImmutableObject.ResponseObject, count: res.TotalRecordCount, OdatanextLink: res.OdatanextLink}))
            } else {
              this.disqualifiedLeadList = this.disqualifiedLeadList.concat(this.getTableFilterData(res.ResponseObject))
            }
          } else {
            this.disqualifiedLeadList = this.getTableFilterData(res.ResponseObject)
          }
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.disqualifiedLeadList = [{}]
        }
      } else {
        this.errorMessage.throwError(res.Message)
        this.disqualifiedLeadList = [{}]
        this.isLoading = false;
      }
    }, error => {
      this.isLoading = false
      this.disqualifiedLeadList = [{}]
    })
  }

  //calling seach API
  SearchTable(data): void {
    console.log(data)
    this.DisQualifyLeadsReqBody.RequestedPageNumber = 1
    this.DisQualifyLeadsReqBody.OdatanextLink = ""
    this.isLoading = true
    if (data != "") {
      if (data.objectRowData != "" && data.objectRowData != undefined) {
        let useFulldata = {
          pageSize: this.DisQualifyLeadsReqBody.PageSize,
          userGuid: this.DisQualifyLeadsReqBody.Guid,
          pageNo: 1,
          nextLink: this.DisQualifyLeadsReqBody.OdatanextLink,
          LeadsReqBody: this.DisQualifyLeadsReqBody,
          fieldheader: headerdisqualified
        }
        //this.disqualifiedleads.DisQualifyLeadSearch()
        let disqualifySearch = this.leadListService.GetAppliedFilterData({ ...data, useFulldata: useFulldata})
        this.myOpenLeadsService.getAppliedFilterLeadData(disqualifySearch).subscribe(res => {
          if (!res.IsError) {
            this.isLoading = false
            if (res.ResponseObject.length > 0) {
              let i = 1;
              res.ResponseObject.map(res => {
                res.index = i;
                i = i + 1;
              })
              this.disqualifiedLeadList = this.getTableFilterData(res.ResponseObject)
              this.DisQualifyLeadsReqBody.OdatanextLink = res.OdatanextLink
              this.tableTotalCount = res.TotalRecordCount
            } else {
              this.disqualifiedLeadList = [{}]
              this.tableTotalCount = 0;
            }
          } else {
            this.isLoading = false
            this.disqualifiedLeadList = [{}]
          }
        }, error => {
          this.isLoading = false
          this.disqualifiedLeadList = [{}]
        })
      } else {
        this.isLoading = false
        this.getDisQualifiedLeadsList(this.DisQualifyLeadsReqBody, false, false, false)
      }
    } else {
      this.isLoading = false
    }
  }

  getTableFilterData(tabledata): Array<any> {
    console.log("conversation!!!")
    console.log(tabledata)
    return tabledata.map(leads => {
      return {
        Name: (leads.Title) ? (leads.Title).trim() : "NA",
        ID: leads.LeadGuid,
        Owner: (leads.Owner) ? (leads.Owner.FullName) ? leads.Owner.FullName : "NA" : "NA",
        Createdon: (leads.CreatedOn)? leads.CreatedOn : "NA",
        Status: (leads.Status) ? (leads.Status.status) ? leads.Status.status : "NA" : "NA",
        Account: (leads.Account) ? (leads.Account.Name) ? decodeURIComponent(leads.Account.Name) : "NA" : "NA",
        AccountGuid:(leads.Account) ? (leads.Account.SysGuid) ? leads.Account.SysGuid : "NA":"NA",
        Source: (leads.Source) ? (leads.Source.Name) ? leads.Source.Name : "NA" : "NA",
        statusclass: (leads.Status) ? (leads.Status.status == "Disqualified") ? "disqualified" : "qualified" : "",
        Activitygroup: leads.ActivityGroups ? leads.ActivityGroups.length > 0 ? this.activityGroupFiter(leads.ActivityGroups).length > 0 ? this.activityGroupFiter(leads.ActivityGroups) : ["NA"] : ["NA"] : ["NA"],
        index: leads.index,
        statusText: (leads.IsNurture) ? "Nurtured" : "",
        OldStatusReasonGuid: (leads.OldStatusReasonGuid) ? leads.OldStatusReasonGuid : "",
        OldStatusGuid: (leads.OldStatusGuid) ? leads.OldStatusGuid : "",
        Reason: (leads.Reason) ? (leads.Reason) : {},
        restoreBtnVisibility: (leads.Status) ? (leads.Status.status == "Archived" && leads.isUserCanEdit == true) ? false : true : true,
        DisQualifyReason: (leads.DisQualifyReason) ? (leads.DisQualifyReason) : "NA",
        moreBtnVisibility:  (leads.Status) ? (leads.Status.status == "Disqualified") ? false : true : true,
        disQualifyBtnVisibility: (leads.isAcceptable) ? true : (leads.Status) ? (leads.Status.Id != undefined) ? (leads.Status.Id == IdentifyLeadstype.qualified && leads.isUserCanEdit == true) ? false : true : true : true,
        // nurtureBtnVisibility: (leads.isAcceptable) ? true : (leads.IsNurture)? (leads.Status.status == "Disqualified") ?  true : false : true,
        nurtureBtnVisibility: (leads.isAcceptable) ? true : (leads.Status) ? (leads.Status.Id != undefined) ? ( leads.Status.Id == IdentifyLeadstype.qualified && leads.IsNurture == false && leads.isUserCanEdit == true) ? false : true : true : true,
        archiveBtnVisibility: (leads.isAcceptable) ? true : (leads.Status) ? (leads.Status.Id != undefined && leads.isUserCanEdit == true) ? false : true : true,
        qualifyBtnVisibility: (leads.isAcceptable) ? true : (leads.Status) ? (leads.Status.Id != undefined) ? (leads.Status.Id == IdentifyLeadstype.unqualified && leads.isUserCanEdit == true) ? false : true : true : true,
        opportunityBtnVisibility: (leads.isAcceptable) ? true : (leads.Status) ? (leads.Status.Id != undefined) ? (leads.Status.Id == IdentifyLeadstype.qualified && leads.isUserCanEdit == true && leads.isOpportunityCreated == false ) ? false : true : true : true,
        accountId: (leads.AccountTypeId) ? leads.AccountTypeId: "",
        accountType: (leads.AccountType) ? leads.AccountType: ""
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
          this.disqualifiedLeadList = this.disqualifiedLeadList.map(x => {
            if (x.ID === data.objectRowData.data[0].ID) {
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
          this.getDisQualifiedLeadsList(data, true, false, true)
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
          let leadGuidArray = []
          let leadIds = data.objectRowData.data.map(x => leadGuidArray.push(x.Id))
          await this.leadListOfflineService.ClearEntireLeadIndexTableData()
          this.getDisQualifiedLeadsList(data, true, false, true)
          this.store.dispatch(new ClearArchivedLeadState())
          this.store.dispatch(new ClearOpenLeadState())
          this.store.dispatch(new ClearMyopenlead())
          this.store.dispatch(new ClearContactList())
          this.store.dispatch(new ClearAllLeadDetails())
          this.store.dispatch(new ClearRelationshipCount());
          this.store.dispatch(new ClearAllLeadDetails())
          this.store.dispatch(new ArchivedRestore({ ids: leadGuidArray }))
          if (data.objectRowData.data[0].Status == "Qualified") {
            this.errorMessage.throwError(res.Message)
          } else {
            this.errorMessage.throwError(LeadCustomErrorMessages.UnqualifiedArchive)
          }
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
          const removeRestoreChange: [] = data.objectRowData.data.map(x => x.ID)
          this.getDisQualifiedLeadsList(data, true, false, true)
          this.store.dispatch(new ArchivedRestore({ ids: removeRestoreChange }))
          this.isLoading = false;
          this.errorMessage.throwError(res.Message)
        } else {
          this.isLoading = false;
          this.errorMessage.throwError(res.Message)
        }
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
      this.contactleadService.getLeadDetails(data.objectRowData.data[0].ID, this.DisQualifyLeadsReqBody.Guid).subscribe(res => {
        if(!res.IsError){
          sessionStorage.setItem('CreateOpportunityFromLead', JSON.stringify(res.ResponseObject));
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
      this.myOpenLeadsService.QyalifyLeads(qualifiedleadObjects).subscribe(async res => {
        if (res.IsError == false) {
          this.isLoading = false;
          await this.leadListOfflineService.ClearEntireLeadIndexTableData()
          this.errorMessage.onSuccessMessage(res.Message).afterDismissed().subscribe(() => {
            this.store.dispatch(new ClearArchivedLeadState())
            this.store.dispatch(new ClearOpenLeadState())
            this.store.dispatch(new ClearMyopenlead());
            this.store.dispatch(new ClearRelationshipCount());
            this.store.dispatch(new ClearAllLeadDetails())
            this.getDisQualifiedLeadsList(data, true, false, true)
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
          const removeDisQualifyChange: [] = data.objectRowData.data.map(x => x.ID)
          await this.leadListOfflineService.ClearEntireLeadIndexTableData()
          this.getDisQualifiedLeadsList(data, true, false, true)
          this.errorMessage.onSuccessMessage(res.Message).afterDismissed().subscribe(() => {
            this.store.dispatch(new ClearArchivedLeadState())
            this.store.dispatch(new ClearOpenLeadState())
            this.store.dispatch(new ClearMyopenlead())
            this.store.dispatch(new ClearAllLeadDetails())
            this.store.dispatch(new LeadDisQualify({ ids: removeDisQualifyChange }))
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

  Navigate(data, route): void {
    if (route == "Name") {
      this.service.leadArchive = false
      this.service.leadDetails = true
      this.service.leadNuture = false
      this.router.navigate(['/leads/leadDetails'])
    }
  }
}
