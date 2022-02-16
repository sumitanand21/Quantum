import { Component, OnInit } from '@angular/core';
import { DataCommunicationService } from '@app/core/services/global.service';
import { CampaignService } from '@app/core/services/campaign.service';
import { DatePipe } from '@angular/common'
import { OfflineService, OnlineOfflineService, ErrorMessage } from '@app/core/services'
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { ActiveCampaignLists } from '@app/core/state/actions/campaign-List.action';
import { ActiveCampaignState } from '@app/core/state/selectors/campaign/Campaign-ActiveList.selector';
import { environment as env } from '@env/environment';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { CampaignGroupListService } from '@app/core/services/campaign-group-list.service';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;
@Component({
  selector: 'app-active-campaigns',
  templateUrl: './active-campaigns.component.html',
  styleUrls: ['./active-campaigns.component.scss']
})
export class ActiveCampaignsComponent implements OnInit {
  campaignTable = [];
  ActiveCampaignRequestbody = {
    "PageSize": 50,
    "RequestedPageNumber":  1,
    "OdatanextLink": "",
    "FilterData":  [],
    "Guid": "",
  }
  tableTotalCount: number
  isLoading: boolean = false;
  OdatanextLink;
  searchedData: string = "";
  UserGuid: any;
  selectedTabValue: string = "All campaigns";
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
    private campaignSerivce: CampaignService,
    private router: Router,
    private errorMessage: ErrorMessage,
    private encrDecrService: EncrDecrService,
    private store: Store<AppState>,
    private onlineService: OnlineOfflineService,
    private CampaignGroupListService : CampaignGroupListService,
    public envr : EnvService
  ) { }

  async  ngOnInit() {
    sessionStorage.setItem('navigation', JSON.stringify(2))
    this.UserGuid = this.encrDecrService.get("EncryptionEncryptionEncryptionEn", localStorage.getItem("userID"), 'DecryptionDecrip')
    this.ActiveCampaignRequestbody.Guid = this.UserGuid
    this.isLoading = true;
    this.campaignSerivce.sendConfigData = [];
    this.store.pipe(select(ActiveCampaignState)).subscribe(res => {
      console.log(res);
      if (res) {
        if (res.ids) {
          if (res.ids.length > 0) {
            this.isLoading = false;
            this.campaignTable = this.CampaignGroupListService.campaignListData(Object.values(res.entities));
            this.tableTotalCount = res.count;
            this.ActiveCampaignRequestbody.OdatanextLink = res.OdatanextLink
          } else {
            this.GetActiveCampaignList(this.ActiveCampaignRequestbody, true, false)
          }
        } else {
          this.GetActiveCampaignList(this.ActiveCampaignRequestbody, true, false)
        }
      } else {
        this.GetActiveCampaignList(this.ActiveCampaignRequestbody, true, false)
      }
    })
    if (!this.onlineService.isOnline) {
      const CacheRes = await this.campaignSerivce.getCachedActiveCampaign()
      if (CacheRes) {
        if (CacheRes.data.length > 0) {
          this.isLoading = false;
          this.campaignTable = this.CampaignGroupListService.campaignListData(CacheRes.data)
          this.tableTotalCount = CacheRes.count
          this.ActiveCampaignRequestbody.OdatanextLink = CacheRes.OdatanextLink
        }
      } else {
        this.GetActiveCampaignList(this.ActiveCampaignRequestbody, true, false)
      }
    }
  }

  GetActiveCampaignList(reqBody, isConcat, isSearch): void {
    let useFulldata = {
      pageNo: this.ActiveCampaignRequestbody.RequestedPageNumber,
      CampaignType: 4,
      pageSize: this.ActiveCampaignRequestbody.PageSize
    }
    let reqparam = this.campaignSerivce.GetAppliedFilterData({ ...reqBody, useFulldata: useFulldata })
    this.campaignSerivce.getFilterList(reqparam).subscribe(campaignList => {
    // this.campaignSerivce.getActiveCampaignList(reqBody).subscribe(async (campaignList) => {
        if (!campaignList.IsError) {
          this.isLoading = false;
          if (campaignList.ResponseObject.length > 0) {
            const ImmutableObject = Object.assign({}, campaignList)
            const perPage = this.ActiveCampaignRequestbody.PageSize;
            const start = ((this.ActiveCampaignRequestbody.RequestedPageNumber - 1) * perPage) + 1;
            let i = start;
            const end = start + perPage - 1;
            console.log(start + " - " + end);
            campaignList.ResponseObject.map(res => {
              if (!res.index) {
                res.index = i;
                i = i + 1;
              }
            })
            if (campaignList.OdatanextLink) {
              this.ActiveCampaignRequestbody.OdatanextLink = campaignList.OdatanextLink
            }
            //this.ActiveCampaignRequestbody = reqBody
           // await this.offlineServices.ClearActiveCampaignIndexTableData()
           // this.ActiveCampaignRequestbody.OdatanextLink = campaignList.OdatanextLink
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
                ImmutableObject.ResponseObject.map(x => x.id = x.Id);
                this.store.dispatch(new ActiveCampaignLists({ ActiveCampaignModel: ImmutableObject.ResponseObject, count: campaignList.TotalRecordCount, OdatanextLink: this.ActiveCampaignRequestbody.OdatanextLink }))
              } else {
                this.campaignTable = this.campaignTable.concat(this.CampaignGroupListService.campaignListData(campaignList.ResponseObject))
              }
            } else {
              this.campaignTable = this.CampaignGroupListService.campaignListData(campaignList.ResponseObject)
            }
          } else {
            this.isLoading = false;
            this.campaignTable = [{}]
          }
          this.tableTotalCount = campaignList.TotalRecordCount
        } else {
          if (campaignList.IsError) {
            if (campaignList.ApiStatusCode === 404) {
              this.errorMessage.throwError(campaignList.Message)
              this.isLoading = false;
            } else {
              this.errorMessage.throwError(campaignList.Message)
              this.isLoading = false;
            }
          }
          if (reqBody.RequestedPageNumber > 1)
            this.ActiveCampaignRequestbody.RequestedPageNumber = this.ActiveCampaignRequestbody.RequestedPageNumber - 1
        }
      },
        error => {
          this.isLoading = false;
        });
  }

  onPagination(event) {
    if (event.action == 'pagination') {
      this.ActiveCampaignRequestbody.PageSize = event.itemsPerPage;
      this.ActiveCampaignRequestbody.RequestedPageNumber = event.currentPage;
      this.GetActiveCampaignList(event, false, true);
    


      if (this.ActiveCampaignRequestbody.PageSize == event.itemsPerPage) {
        this.ActiveCampaignRequestbody.PageSize = event.itemsPerPage;
        this.ActiveCampaignRequestbody.RequestedPageNumber = event.currentPage;
        this.GetActiveCampaignList(event, true, true);
      }
      else {
        this.ActiveCampaignRequestbody.PageSize = event.itemsPerPage;
        this.ActiveCampaignRequestbody.RequestedPageNumber = event.currentPage;
        this.GetActiveCampaignList(event, false, true);
      }


    }
  }

  onSearchListData(data): void {
    this.isLoading = false
    this.ActiveCampaignRequestbody.RequestedPageNumber = 1
    this.ActiveCampaignRequestbody.OdatanextLink = "",
      this.ActiveCampaignRequestbody.PageSize = 50
    if (data != "") {
      if (data.objectRowData != "" && data.objectRowData != undefined) {
        this.isLoading = true;
        // this.searchedData = data.objectRowData;
        let useFulldata = {
          pageNo : this.ActiveCampaignRequestbody.RequestedPageNumber,
          CampaignType: 4,
          pageSize: this.ActiveCampaignRequestbody.PageSize
        }
        let reqparam = this.campaignSerivce.GetAppliedFilterData({ ...data, useFulldata: useFulldata })
        this.campaignSerivce.getFilterList(reqparam).subscribe(res => {
        // this.campaignSerivce.campaignSearch(data.objectRowData, this.campaignSerivce.CampaignTableIdentify.campaigns, this.ActiveCampaignRequestbody.PageSize).subscribe(res => {
          this.isLoading = false;
          if (!res.IsError) {
            if (res.ResponseObject.length > 0) {
              let i = 1;
              res.ResponseObject.map(res => {
                res.index = i;
                i = i + 1;
              })
              this.campaignTable = this.CampaignGroupListService.campaignListData(res.ResponseObject)
              this.ActiveCampaignRequestbody.OdatanextLink = res.OdatanextLink
              this.tableTotalCount = res.TotalRecordCount
            } else {
              this.campaignTable = [{}]
              this.tableTotalCount = 0;
            }
          } else {
            this.campaignTable = [{}]
            this.tableTotalCount = 0;
            this.errorMessage.throwError(res.Message)
          }
        }, error => { this.isLoading = false; this.tableTotalCount = 0; this.campaignTable = [{}] })
      } else {
        this.isLoading = false;
        this.GetActiveCampaignList(data, false, false)
      }
    } else {
      this.isLoading = false
    }
  }

  performListActions(childActionRecieved) {
    console.log(childActionRecieved)
    if (childActionRecieved) {
      (childActionRecieved.parentData) ? this.tableTotalCount = childActionRecieved.parentData.totalCount : this.tableTotalCount = this.tableTotalCount
    }
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {
      case 'Name': {
        this.campaignSerivce.AllCampaignpageNumber = childActionRecieved.pageData.currentPage;
        this.campaignSerivce.AllCampaignpageSize = childActionRecieved.pageData.itemsPerPage;
        this.campaignSerivce.sendConfigData = childActionRecieved.configData.filterData
        this.Navigate(childActionRecieved, "link")
        break
      }
      case 'search': {
        this.isLoading = false;
        this.onSearchListData(childActionRecieved)
        break
      }
      case 'createLead': {
        this.Navigate(childActionRecieved, "createLead")
        break
      }
      case 'tabNavigation': {
        this.CampaignGroupListService.onTabNavigation(childActionRecieved.objectRowData[0])
        break
      }
      case 'DownloadCSV': {
        this.downloadCsv(childActionRecieved)
        break
      }
      case "columnFilter": {
        this.GetColumnFilters(childActionRecieved);
        break
      }
      case "columnSearchFilter": {
        this.GetColumnSearchFilters(childActionRecieved);
        break
      }
      case 'loadMoreFilterData': {
        this.LoadMoreColumnFilter(childActionRecieved);
        break
      }
      case 'ClearAllFilter': {
        this.clearallFilter();
        return;
      }
      case 'sortHeaderBy': {
        this.ActiveCampaignRequestbody.OdatanextLink = ''
        this.ActiveCampaignRequestbody.RequestedPageNumber = 1
        this.CallListDataWithFilters(childActionRecieved);
        break
      }
    }
  }

  clearallFilter(){
    this.ActiveCampaignRequestbody = {
      "PageSize":this.ActiveCampaignRequestbody.PageSize,
      "RequestedPageNumber":  1,
      "OdatanextLink": "",
      "FilterData":  [],
      "Guid": "",
    }
    this.GetActiveCampaignList(this.ActiveCampaignRequestbody, false, false)
  }

  GetColumnFilters(data) {
    if (data.filterData) {
      if (!data.filterData.isApplyFilter) {
        let headerName = data.filterData.headerName;
        this.filterConfigData[headerName].data = [];
        this.filterConfigData[headerName].PageNo = 1
        this.filterConfigData[headerName].NextLink = ''
        this.generateFilterConfigData(data, headerName, false, this.CampaignGroupListService.CheckFilterServiceFlag(data, headerName,this.filterConfigData))
      } else {
        if (data.filterData.isApplyFilter && this.userdat.CheckFilterFlag(data)) {
          this.ActiveCampaignRequestbody.OdatanextLink = ''
          this.ActiveCampaignRequestbody.RequestedPageNumber = 1
          this.CallListDataWithFilters(data)
        } else if (data.filterData.isApplyFilter && data.filterData.globalSearch != ""){
          this.CallListDataWithFilters(data)
        } else {
          this.ActiveCampaignRequestbody.OdatanextLink = ''
          this.ActiveCampaignRequestbody.RequestedPageNumber = 1
          this.GetActiveCampaignList(this.ActiveCampaignRequestbody, false, true);
        }
      }
    }
  }

  GetColumnSearchFilters(data) {
    let headerName = data.filterData.headerName
    this.ActiveCampaignRequestbody.OdatanextLink = ''
    this.filterConfigData[headerName].PageNo = 1
    this.filterConfigData[headerName].NextLink = ''
    this.generateFilterConfigData(data, headerName, false, true)
  }

  LoadMoreColumnFilter(data) {
    let headerName = data.filterData.headerName
    this.filterConfigData[headerName].PageNo = this.filterConfigData[headerName].PageNo + 1
    this.generateFilterConfigData(data, headerName, true, true)
  }

  generateFilterConfigData(data, headerName, isConcat, isServiceCall?) {
    if (isServiceCall) {
      let useFulldata = {
        headerName: headerName,
        searchVal: data.filterData.columnSerachKey,
        pageNo: this.filterConfigData[headerName].PageNo,
        pageSize: 10,
        nextLink: this.filterConfigData[headerName].NextLink,
        CampaignType:4,

      }
      this.campaignSerivce.getFilterCampaignSwitchListData({ ...data, useFulldata: useFulldata, Guid: this.UserGuid }).subscribe(res => {
        this.filterConfigData.isFilterLoading = false;
        if (res.IsError) {
          this.errorMessage.throwError(res.Message);
        }
        if (headerName === 'status') {
          this.campaignSerivce.statusFilter({ ...data, res: res, headerName: headerName, filterConfigData: this.filterConfigData })
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
            this.errorMessage.throwError(res.Message)
          }
        }
      },error =>{
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

  CallListDataWithFilters(data) {

    let useFulldata ={
      pageNo: this.ActiveCampaignRequestbody.RequestedPageNumber,
      CampaignType:4,
      pageSize: 50
    }

    let reqparam = this.campaignSerivce.GetAppliedFilterData({ ...data, useFulldata: useFulldata })
    this.campaignSerivce.getFilterList(reqparam).subscribe(res => {
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
          this.ActiveCampaignRequestbody.OdatanextLink = res.OdatanextLink
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.campaignTable = [{}];
          this.tableTotalCount = 0;
        }
      } else {
        this.campaignTable = [{}];
        this.tableTotalCount = 0;
        this.errorMessage.throwError(res.Message);
      }
    })
  }

  downloadCsv(data) {
    this.isLoading = true
    let useFulldata = {
      pageNo: this.ActiveCampaignRequestbody.RequestedPageNumber,
      CampaignType: 4,
      pageSize: this.ActiveCampaignRequestbody.PageSize
    }
    let reqBody = this.campaignSerivce.GetAppliedFilterData({...data,SearchType:4,useFulldata:useFulldata});
    this.campaignSerivce.downloadCampaignLists(reqBody).subscribe(res => {
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
        this.errorMessage.throwError(res.Message)
      }
    }, error => {
      this.isLoading = false
    });
  }

  downloadListMobile(fileInfo) {
    var fileTransfer = new FileTransfer();
    var newUrl = fileInfo.Url.substr(0, fileInfo.Url.indexOf("?"))
    var uri = encodeURI(newUrl);
    var fileURL = "///storage/emulated/0/DCIM/" + fileInfo.Name;
    this.errorMessage.throwError(`${fileInfo} downloaded`)
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
    if (route == "link") {
      console.log(data)
      if (JSON.parse(sessionStorage.getItem('RequestCampaign'))) {
        let reqCamp = JSON.parse(sessionStorage.getItem("RequestCampaign"))
        sessionStorage.setItem('RequestCampaign', JSON.stringify({ ...reqCamp, Id: data['objectRowData'][0]['id'], isAccountPopulate: false,isCompletedCampaign:false,isCampaignEdit:true }));
    } else {
        sessionStorage.setItem('RequestCampaign', JSON.stringify({ Id: data['objectRowData'][0]['id'], isAccountPopulate: false,isCompletedCampaign:false,isCampaignEdit:true }));
    }
      //sessionStorage.setItem('campaignId', JSON.stringify(data.objectRowData[0].id));
      sessionStorage.removeItem('campaignCacheData');
      this.router.navigateByUrl('/campaign/RequestCampaign');
    }
    else if (route === "createLead") {
      sessionStorage.setItem('CampaignCraetelead', JSON.stringify(data.objectRowData[0]));
      this.router.navigateByUrl('/leads/createlead');
    }
  }

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
}
