import { Component, OnInit } from '@angular/core';
import { DataCommunicationService } from '@app/core/services/global.service';
import { CampaignService } from '@app/core/services/campaign.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { CompletedCampaignLists, ClearCampaign } from '@app/core/state/actions/campaign-List.action';
import { CompletedCampaignState } from '@app/core/state/selectors/campaign/Campaign-Completed.selector';
import { OnlineOfflineService } from '@app/core/services/online-offline.service';
import { ErrorMessage } from '@app/core/services/error.services';
import { environment as env } from '@env/environment';
import { CampaignGroupListService } from '@app/core/services/campaign-group-list.service';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;
@Component({
  selector: 'app-completed-campaigns',
  templateUrl: './completed-campaigns.component.html',
  styleUrls: ['./completed-campaigns.component.scss']
})
export class CompletedCampaignsComponent implements OnInit {
  campaignTable = [];
  CompletedCampaignRequestbody = {
    "PageSize":  50,
    "RequestedPageNumber":  1,
    "OdatanextLink": "",
    "FilterData":  []
  }
  tableTotalCount: number
  isLoading: boolean = false;
  OdatanextLink;
  searchedData: string = "";
  filterConfigData = {
    Name: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    campaign: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    owner: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    startDate: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    endDate: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    status: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    isFilterLoading: false
  };
  constructor(
    public userdat: DataCommunicationService,
    private campaign: CampaignService,
    private router: Router,
    private store: Store<AppState>,
    private CampaignGroupListService: CampaignGroupListService,
    private PopUp: ErrorMessage,
    private campaignSerivce: CampaignService,
    private onlineService: OnlineOfflineService,
    public envr : EnvService

  ) { }

  async ngOnInit() {
    sessionStorage.setItem('navigation', JSON.stringify(3))
    this.isLoading = true;
    this.campaign.sendConfigData = []
    this.store.pipe(select(CompletedCampaignState)).subscribe(res => {
      if (res) {
        if (res.ids) {
          if (res.ids.length > 0) {
            this.isLoading = false;
            this.campaignTable = this.CampaignGroupListService.campaignListData(Object.values(res.entities));
            this.tableTotalCount = res.count;
            this.CompletedCampaignRequestbody.OdatanextLink = res.OdatanextLink
          } else {
            this.GetCompletedCampaignList(this.CompletedCampaignRequestbody, true, false)
          }
        } else {
          this.GetCompletedCampaignList(this.CompletedCampaignRequestbody, true, false)
        }
      } else {
        this.GetCompletedCampaignList(this.CompletedCampaignRequestbody, true, false)
      }
    });
    if (!this.onlineService.isOnline) {
      const CacheResponse = await this.campaign.getCachedCompletedCampaign()
      if (CacheResponse) {
        if (CacheResponse.data.length > 0) {
          this.isLoading = false;
          this.campaignTable = this.CampaignGroupListService.campaignListData(CacheResponse.data);
          this.tableTotalCount = CacheResponse.count;
          this.CompletedCampaignRequestbody.OdatanextLink = CacheResponse.OdatanextLink;
        }
      } else {
        this.GetCompletedCampaignList(this.CompletedCampaignRequestbody, true, false)
      }
    }
  }

  GetCompletedCampaignList(reqBody, isConcat, isSearch): void {
    let useFulldata = {
      pageNo: this.CompletedCampaignRequestbody.RequestedPageNumber,
      CampaignType: 3,
      pageSize: this.CompletedCampaignRequestbody.PageSize
    }
    let reqparam = this.campaignSerivce.GetAppliedFilterData({ ...reqBody, useFulldata: useFulldata })
    this.campaignSerivce.getFilterList(reqparam).subscribe(campaignList => {
      // this.campaign.getCompletedCampaignList(reqBody).subscribe(async (campaignList) => {
      if (!campaignList.IsError) {
        this.isLoading = false;
        if (campaignList.ResponseObject.length > 0) {
          const ImmutableObject = Object.assign({}, campaignList)
          const perPage = this.CompletedCampaignRequestbody.PageSize;
          const start = ((this.CompletedCampaignRequestbody.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;
          console.log(start + " - " + end);
          campaignList.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          })
          // this.CompletedCampaignRequestbody = reqBody
          // await this.offlineServices.ClearCompletedCampaignIndexTableData()
          if (campaignList.OdatanextLink) {
            this.CompletedCampaignRequestbody.OdatanextLink = campaignList.OdatanextLink
          }
          if (isConcat) {
            let spliceArray = [];
            this.campaignTable.map((res) => {
              if (res.index >= start && res.index <= end) {
                spliceArray.push(res);
              }
            });
            spliceArray.map(res => {
              this.campaignTable.splice(this.campaignTable.indexOf(res), 1);
            })
            if (!isSearch) {
              ImmutableObject.ResponseObject.map(x => x.id = x.Id)
              this.store.dispatch(new CompletedCampaignLists({ CompletedCampaignModel: ImmutableObject.ResponseObject, count: campaignList.TotalRecordCount, OdatanextLink: this.CompletedCampaignRequestbody.OdatanextLink }))
            } else {
              this.campaignTable = this.campaignTable.concat(this.CampaignGroupListService.campaignListData(campaignList.ResponseObject))
            }
          } else {
            this.campaignTable = this.CampaignGroupListService.campaignListData(campaignList.ResponseObject)
          }
        } else {
          this.tableTotalCount = 0
          this.campaignTable = [{}]
        }
        this.tableTotalCount = campaignList.TotalRecordCount
      } else {
        this.isLoading = false;
        if (campaignList.IsError) {
          if (campaignList.ApiStatusCode === 404) {
            this.PopUp.throwError(campaignList.Message)

          } else {
            this.PopUp.throwError(campaignList.Message)
          }
        }
        if (reqBody.RequestedPageNumber > 1)
          this.CompletedCampaignRequestbody.RequestedPageNumber = this.CompletedCampaignRequestbody.RequestedPageNumber - 1
      }
    },
      error => {
        this.isLoading = false;
      })
  }

  onPagination(event) {
    if (event.action == 'pagination') {
      // this.CompletedCampaignRequestbody.PageSize = event.itemsPerPage;
      // this.CompletedCampaignRequestbody.RequestedPageNumber = event.currentPage;
      // this.GetCompletedCampaignList(event, true, false)
      if (this.CompletedCampaignRequestbody.PageSize == event.itemsPerPage) {
        this.CompletedCampaignRequestbody.PageSize = event.itemsPerPage;
        this.CompletedCampaignRequestbody.RequestedPageNumber = event.currentPage;
        this.GetCompletedCampaignList(event, true, true);
      }
      else {
        this.CompletedCampaignRequestbody.PageSize = event.itemsPerPage;
        this.CompletedCampaignRequestbody.RequestedPageNumber = event.currentPage;
        this.GetCompletedCampaignList(event, false, true);
      }
    }
    
  }

  performListActions(childActionRecieved): Observable<any> {
    console.log(childActionRecieved);
    if (childActionRecieved) {
      (childActionRecieved.parentData) ? this.tableTotalCount = childActionRecieved.parentData.totalCount : this.tableTotalCount = this.tableTotalCount
    }
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {
      case 'pagination': {
        this.TablePagination(childActionRecieved);
        return
      }
      case 'Name': {
        this.campaign.AllCampaignpageNumber = childActionRecieved.pageData.currentPage;
        this.campaign.AllCampaignpageSize = childActionRecieved.pageData.itemsPerPage;
        this.campaign.sendConfigData = childActionRecieved.configData.filterData
        this.Navigate(childActionRecieved, "link")
        return
      }
      case 'search': {
        this.SearchTable(childActionRecieved)
        return
      }
      case 'createLead': {
        this.Navigate(childActionRecieved, "createLead")
        return
      }
      case 'tabNavigation':
        {
          this.CampaignGroupListService.onTabNavigation(childActionRecieved.objectRowData[0])
          return
        }
      case 'DownloadCSV': {
        this.downloadCsv(childActionRecieved)
        return
      }
      case "columnFilter": {
        this.GetColumnFilters(childActionRecieved);
        return
      }
      case "columnSearchFilter": {
        this.GetColumnSearchFilters(childActionRecieved);
        return
      }
      case 'loadMoreFilterData': {
        this.LoadMoreColumnFilter(childActionRecieved);
        return
      }
      case 'ClearAllFilter': {
        this.clearallFilter();
        return;
      }
      case 'sortHeaderBy': {
        this.CompletedCampaignRequestbody.OdatanextLink = ''
        this.CompletedCampaignRequestbody.RequestedPageNumber = 1
        this.CallListDataWithFilters(childActionRecieved);
        return
      }
    }
  }

  clearallFilter(){

    this.CompletedCampaignRequestbody = {
      "PageSize":  this.CompletedCampaignRequestbody.PageSize,
      "RequestedPageNumber":  1,
      "OdatanextLink": "",
      "FilterData":  []
    }
    this.GetCompletedCampaignList(this.CompletedCampaignRequestbody, false, false)
  }

  GetColumnSearchFilters(data) {
    let headerName = data.filterData.headerName
    this.CompletedCampaignRequestbody.OdatanextLink = ''
    this.filterConfigData[headerName].PageNo = 1
    this.filterConfigData[headerName].NextLink = ''
    this.generateFilterConfigData(data, headerName, false, true)
  }

  LoadMoreColumnFilter(data) {
    let headerName = data.filterData.headerName
    this.filterConfigData[headerName].PageNo = this.filterConfigData[headerName].PageNo + 1
    this.generateFilterConfigData(data, headerName, true, true)
  }

  GetColumnFilters(data) {
    if (data.filterData) {
      if (!data.filterData.isApplyFilter) {
        let headerName = data.filterData.headerName;
        this.filterConfigData[headerName].data = [];
        this.filterConfigData[headerName].PageNo = 1
        this.filterConfigData[headerName].NextLink = ''
        this.generateFilterConfigData(data, headerName, false, this.CampaignGroupListService.CheckFilterServiceFlag(data, headerName, this.filterConfigData))
      } else {
        if (data.filterData.isApplyFilter && this.userdat.CheckFilterFlag(data)) {
          this.CompletedCampaignRequestbody.OdatanextLink = ''
          this.CompletedCampaignRequestbody.RequestedPageNumber = 1
          this.CallListDataWithFilters(data)
        } else if (data.filterData.isApplyFilter && data.filterData.globalSearch != "") {
          this.CallListDataWithFilters(data)
        } else {
          this.store.dispatch(new ClearCampaign())
          this.CompletedCampaignRequestbody.OdatanextLink = ''
          this.CompletedCampaignRequestbody.RequestedPageNumber = 1
          this.GetCompletedCampaignList(this.CompletedCampaignRequestbody, false, true);
        }
      }
    }
  }

  CallListDataWithFilters(data) {

    let useFulldata = {
      pageNo: this.CompletedCampaignRequestbody.RequestedPageNumber,
      CampaignType: 3,
      pageSize: 50
    }
    let reqparam = this.campaignSerivce.GetAppliedFilterData({ ...data, useFulldata: useFulldata })
    this.campaign.getFilterList(reqparam).subscribe(res => {
      if (!res.IsError) {
        if (res.ResponseObject.length > 0) {
          const perPage = reqparam.PageSize;
          const start = ((reqparam.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          res.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          })
          this.campaignTable = this.CampaignGroupListService.campaignListData(res.ResponseObject)
          this.CompletedCampaignRequestbody.OdatanextLink = res.OdatanextLink
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.campaignTable = [{}];
          this.tableTotalCount = 0;
        }
      } else {
        this.campaignTable = [{}];
        this.tableTotalCount = 0;
        this.PopUp.throwError(res.Message);
      }
    })
  }

  generateFilterConfigData(data, headerName, isConcat, isServiceCall?) {
    if (isServiceCall) {
      let useFulldata = {
        headerName: headerName,
        searchVal: data.filterData.columnSerachKey,
        pageNo: this.filterConfigData[headerName].PageNo,
        pageSize: 10,
        nextLink: this.filterConfigData[headerName].NextLink,
        CampaignType: 3,
      }
      this.campaign.getFilterCampaignSwitchListData({ ...data, useFulldata: useFulldata }).subscribe(res => {
        this.filterConfigData.isFilterLoading = false;
        if (res.IsError) {
          this.PopUp.throwError(res.Message);
        }
        if (headerName === 'status') {
          this.campaign.statusFilter({ ...data, res: res, headerName: headerName, filterConfigData: this.filterConfigData })
        } else {
          if (!res.IsError) {
            this.filterConfigData[headerName] = {
              data: (isConcat) ? this.filterConfigData[headerName]["data"].concat(res.ResponseObject) : res.ResponseObject,
              recordCount: res.TotalRecordCount,
              NextLink: res.OdatanextLink,
              PageNo: res.CurrentPageNumber
            }
            if (data.filterData.headerName !== 'startDate' && data.filterData.headerName !== 'endDate') {
            data.filterData.filterColumn[headerName].forEach((res, i) => {
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
            this.PopUp.throwError(res.Message)
          }
        }
      }, error => {
        if (this.filterConfigData[headerName].PageNo > 1) {
          this.filterConfigData[headerName].PageNo = Number(this.filterConfigData[headerName].PageNo) - 1;
        }
      })
    } else {
      this.filterConfigData.isFilterLoading = false;
      if (data.filterData.filterColumn[headerName].length > 0) {
        this.filterConfigData[headerName]["data"] = this.CampaignGroupListService.RemoveSelectedItems(this.filterConfigData[headerName]["data"], data.filterData.filterColumn[headerName], 'id').concat(data.filterData.filterColumn[headerName])
      }
    }
  }

  downloadCsv(data) {
    this.isLoading = true
    let useFulldata = {
      pageNo: this.CompletedCampaignRequestbody.RequestedPageNumber,
      CampaignType: 3,
      pageSize: this.CompletedCampaignRequestbody.PageSize,
    }
    let reqBody = this.campaignSerivce.GetAppliedFilterData({...data,SearchType: 3,useFulldata:useFulldata});
    this.campaign.downloadCampaignLists(reqBody).subscribe(res => {
      if (!res.IsError) {
        this.isLoading = false;
        if (this.envr.envName === 'MOBILEQA') {
          this.downloadListMobile(res.ResponseObject)
        } else {
          this.userdat.Base64Download(res.ResponseObject);
          // console.log("res.ResponseObject.Url", res.ResponseObject.Url)
          // window.open(res.ResponseObject.Url, "_blank");
        }
      } else {
        this.isLoading = false;
        this.PopUp.throwError(res.Message)
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
    this.PopUp.throwError(`${fileInfo} downloaded`)
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
    }
    );
  }

  Navigate(data, route): void {
    console.log(data.objectRowData)
    let encId
    if (route == "link") {
      console.log(data)
      if (JSON.parse(sessionStorage.getItem('RequestCampaign'))) {
        let reqCamp = JSON.parse(sessionStorage.getItem("RequestCampaign"))
        sessionStorage.setItem('RequestCampaign', JSON.stringify({ ...reqCamp, Id: data['objectRowData'][0]['id'], isAccountPopulate: false,isCompletedCampaign:true,isCampaignEdit:true }));
      } else {
        sessionStorage.setItem('RequestCampaign', JSON.stringify({ Id: data['objectRowData'][0]['id'], isAccountPopulate: false,isCompletedCampaign:true,isCampaignEdit:true }));
      }
      sessionStorage.removeItem('campaignCacheData');
      //sessionStorage.setItem('campaignId', JSON.stringify(data.objectRowData[0].id));
      this.router.navigateByUrl('/campaign/RequestCampaign');
    }
    else if (route === "createLead") {
      sessionStorage.setItem('CampaignCraetelead', JSON.stringify(data.objectRowData[0]))
      this.router.navigateByUrl('/leads/createlead');
    }
  }

  TablePagination(data) {
    this.CompletedCampaignRequestbody.RequestedPageNumber = this.CompletedCampaignRequestbody.RequestedPageNumber + 1
    this.GetCompletedCampaignList(this.CompletedCampaignRequestbody, true, false);
  }



  SearchTable(data): void {
    this.CompletedCampaignRequestbody.RequestedPageNumber = 1
    this.CompletedCampaignRequestbody.OdatanextLink = "",
      this.CompletedCampaignRequestbody.PageSize = 50
    if (data != "") {
      if (data.objectRowData != "" && data.objectRowData != undefined) {
        this.isLoading = true;
        //this.searchedData = data.objectRowData;
        let useFulldata = {
          pageNo: this.CompletedCampaignRequestbody.RequestedPageNumber,
          CampaignType: 3,
          pageSize: this.CompletedCampaignRequestbody.PageSize
        }
        let reqparam = this.campaignSerivce.GetAppliedFilterData({ ...data, useFulldata: useFulldata })
        this.campaignSerivce.getFilterList(reqparam).subscribe(res => {
          // this.campaign.campaignSearch(data.objectRowData, this.campaign.CampaignTableIdentify.completedcampaigns, this.CompletedCampaignRequestbody.PageSize).subscribe(res => {
          this.isLoading = false;
          if (!res.IsError) {
            if (res.ResponseObject.length > 0) {
              let i = 1;
              res.ResponseObject.map(res => {
                res.index = i;
                i = i + 1;
              })
              this.campaignTable = this.CampaignGroupListService.campaignListData(res.ResponseObject)
              this.CompletedCampaignRequestbody.OdatanextLink = res.OdatanextLink
              this.tableTotalCount = res.TotalRecordCount
            } else {
              this.campaignTable = [{}]
              this.tableTotalCount = 0;
            }
          } else {
            this.PopUp.throwError(res.Message)
            this.isLoading = false;
            this.tableTotalCount = 0;
            this.campaignTable = [{}]
          }
        }, error => { this.isLoading = false; this.tableTotalCount = 0; this.campaignTable = [{}] })
      } else {
        this.isLoading = false;
        this.GetCompletedCampaignList(data, false, false)
      }
    }
  }

  /************Select Tabs dropdown code starts */
  selectedTabValue: string = "All campaigns";
  appendConversation(e) {
    this.selectedTabValue = e.name;
    if (e.router) {
      this.router.navigate([e.router]);
    }
  }
  tabList: {}[] = [
    {
      view: 'System views',
      groups: [{ name: 'All campaigns' },
      { name: 'Active campaings' },
      { name: 'Completed campaings' }
      ]
    },
  ]
  /************Select Tabs dropdown code ends */
}
