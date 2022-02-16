import { Component, OnInit } from '@angular/core';
import { ErrorMessage } from '@app/core';
import { DataCommunicationService, OnlineOfflineService } from '@app/core';
import { CampaignService } from '@app/core/services/campaign.service';
import { Router } from '@angular/router';
import { AppState } from '@app/core/state';
import { Store, select } from '@ngrx/store';
import { AllCampaignLists, ClearCampaign } from '@app/core/state/actions/campaign-List.action';
import { AllCampaignState } from '@app/core/state/selectors/campaign/Campaign-AllList.selector';
import { environment as env } from '@env/environment';
import { CampaignGroupListService } from '@app/core/services/campaign-group-list.service';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;
@Component({
  selector: 'app-all-campaigns',
  templateUrl: './all-campaigns.component.html',
  styleUrls: ['./all-campaigns.component.scss']
})
export class AllCampaignsComponent implements OnInit {
  AllCampaignRequestbody = {
    "PageSize":  50,
    "RequestedPageNumber":  1,
    "OdatanextLink": "",
    "FilterData":  []
  }
  tableTotalCount: number;
  campaignTable = [];
  headerData: any;
  isLoading: boolean = false;
  OdatanextLink;
  searchedData: string = "";
  isDownloadObject: any;
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
    private CampaignGroupListService: CampaignGroupListService,
    private PopUp: ErrorMessage,
    private campaignSerivce: CampaignService,
    private store: Store<AppState>,
    private onlineService: OnlineOfflineService,
    public envr : EnvService
  ) {
  }
  async ngOnInit() {
    sessionStorage.setItem('navigation', JSON.stringify(1))
    this.isLoading = true;
    this.campaign.sendConfigData = [];
    this.userdat.allCampaignService = true;
    this.store.pipe(select(AllCampaignState)).subscribe(res => {
      console.log(res);
      if (res) {
        if (res.ids) {
          if (res.ids.length > 0) {
            this.isLoading = false;
            this.campaignTable = this.CampaignGroupListService.campaignListData(Object.values(res.entities));
            this.tableTotalCount = res.count;
            this.AllCampaignRequestbody.OdatanextLink = res.OdatanextLink;
          } else {
            this.GetAllCampaignsList(this.AllCampaignRequestbody, true, false)
          }
        } else {
          this.GetAllCampaignsList(this.AllCampaignRequestbody, true, false)
        }
      } else {
        this.GetAllCampaignsList(this.AllCampaignRequestbody, true, false)
      }
    });
    if (!this.onlineService.isOnline) {
      const CacheResponse = await this.campaign.getCachedAllCampaign()
      if (CacheResponse) {
        if (CacheResponse.data.length > 0) {
          this.isLoading = false;
          this.campaignTable = this.CampaignGroupListService.campaignListData(CacheResponse.data);
          this.tableTotalCount = CacheResponse.count;
          this.AllCampaignRequestbody.OdatanextLink = CacheResponse.OdatanextLink;
        }
      } else {
        this.GetAllCampaignsList(this.AllCampaignRequestbody, true, false)
      }
    }
  }

  GetAllCampaignsList(reqBody, isConcat, isSearch): void {
    let useFulldata = {
      pageNo: this.AllCampaignRequestbody.RequestedPageNumber,
      CampaignType: 2,
      pageSize: this.AllCampaignRequestbody.PageSize
    }
    let reqparam = this.campaignSerivce.GetAppliedFilterData({ ...reqBody, useFulldata: useFulldata })
    this.campaign.getFilterList(reqparam).subscribe(campaignList => {
      // this.campaign.getALLCampaignList(reqBody).subscribe(async (campaignList) => {
      this.isLoading = false;
      console.log(campaignList)
      if (!campaignList.IsError) {
        if (campaignList.ResponseObject.length > 0) {
          const ImmutableObject = Object.assign({}, campaignList)
          const perPage = this.AllCampaignRequestbody.PageSize;
          const start = ((this.AllCampaignRequestbody.RequestedPageNumber - 1) * perPage) + 1;
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
            this.AllCampaignRequestbody.OdatanextLink = campaignList.OdatanextLink;
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
              ImmutableObject.ResponseObject.map(x => x.id = x.Id);
              this.store.dispatch(new AllCampaignLists({
                AllCampaignModel: ImmutableObject.ResponseObject,
                count: campaignList.TotalRecordCount,
                OdatanextLink: this.AllCampaignRequestbody.OdatanextLink
              }));
            } else {
              debugger
              this.campaignTable = [...this.campaignTable, ...this.CampaignGroupListService.campaignListData(campaignList.ResponseObject)];
            }
          } else {
            this.campaignTable = this.CampaignGroupListService.campaignListData(campaignList.ResponseObject);
          }
          this.tableTotalCount = campaignList.TotalRecordCount;
        } else {
          this.campaignTable = [{}];
        }
      } else {
        this.PopUp.throwError(campaignList.Message)
        this.isLoading = false;
        this.campaignTable = [{}];
      }
    }, error => {
      this.isLoading = false;
    })

  }

  onPagination(event) {
    if (event.action == 'pagination') {
      // this.AllCampaignRequestbody.PageSize = event.itemsPerPage;
      // this.AllCampaignRequestbody.RequestedPageNumber = event.currentPage;
      // this.GetAllCampaignsList(event, true, false);

      if (this.AllCampaignRequestbody.PageSize == event.itemsPerPage) {
        this.AllCampaignRequestbody.PageSize = event.itemsPerPage;
        this.AllCampaignRequestbody.RequestedPageNumber = event.currentPage;
        this.GetAllCampaignsList(event, true, true);
      }
      else {
        this.AllCampaignRequestbody.PageSize = event.itemsPerPage;
        this.AllCampaignRequestbody.RequestedPageNumber = event.currentPage;
        this.GetAllCampaignsList(event, false, true);
      }


    }
  }

  onSearchListData(data): void {
    this.AllCampaignRequestbody.RequestedPageNumber = 1;
    this.AllCampaignRequestbody.OdatanextLink = "";
    this.AllCampaignRequestbody.PageSize = 50;
    if (data != "") {
      if (data.objectRowData != "" && data.objectRowData != undefined) {
        // this.searchedData = data.objectRowData;
        let useFulldata = {
          pageNo: this.AllCampaignRequestbody.RequestedPageNumber,
          CampaignType: 2,
          pageSize: this.AllCampaignRequestbody.PageSize
        }
        let reqparam = this.campaignSerivce.GetAppliedFilterData({ ...data, useFulldata: useFulldata })
        this.campaign.getFilterList(reqparam).subscribe(res => {
          // this.campaign.campaignSearch(data.objectRowData, this.campaign.CampaignTableIdentify.campaigns, this.AllCampaignRequestbody.PageSize).subscribe(res => {
          if (!res.IsError) {
            if (res.ResponseObject.length > 0) {
              let i = 1;
              res.ResponseObject.map(res => {
                res.index = i;
                i = i + 1;
              })
              this.campaignTable = this.CampaignGroupListService.campaignListData(res.ResponseObject);
              this.AllCampaignRequestbody.OdatanextLink = res.OdatanextLink;
              this.tableTotalCount = res.TotalRecordCount;
            } else {
              this.campaignTable = [{}];
              this.tableTotalCount = 0;
            }
          } else {
            this.PopUp.throwError(res.Message);
            this.isLoading = false;
            this.campaignTable = [{}];
            this.tableTotalCount = 0;
          }
        }, error => {
          this.isLoading = false;
          this.campaignTable = [{}];
          this.tableTotalCount = 0;
        })
      } else {
        this.GetAllCampaignsList(data, false, false);
      }
    }
  }

  performListActions(childActionRecieved) {
    if (childActionRecieved) {
      (childActionRecieved.parentData) ? this.tableTotalCount = childActionRecieved.parentData.totalCount : this.tableTotalCount = this.tableTotalCount;
    }
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {
      case 'Name': {
        this.campaign.AllCampaignpageNumber = childActionRecieved.pageData.currentPage;
        this.campaign.AllCampaignpageSize = childActionRecieved.pageData.itemsPerPage;
        this.campaign.sendConfigData = childActionRecieved.configData.filterData;
        this.Navigate(childActionRecieved, "link");
        break
      }
      case 'search': {
        debugger;
        this.onSearchListData(childActionRecieved);
        break
      }
      case 'createLead': {
        this.Navigate(childActionRecieved, "createLead");
        break
      }
      case 'tabNavigation': {
        this.CampaignGroupListService.onTabNavigation(childActionRecieved.objectRowData[0]);
        break
      }
      case 'DownloadCSV': {
        this.downloadCsv(childActionRecieved);
        break
      }
      case "columnFilter":
        this.GetColumnFilters(childActionRecieved);
        break
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
        this.AllCampaignRequestbody.OdatanextLink = '';
        this.AllCampaignRequestbody.RequestedPageNumber = 1
        this.CallListDataWithFilters(childActionRecieved);
        break
      }
    }
  }

  clearallFilter(){
    this.AllCampaignRequestbody = {
      "PageSize":  this.AllCampaignRequestbody.PageSize,
      "RequestedPageNumber":  1,
      "OdatanextLink": "",
      "FilterData":  []
    }
    this.GetAllCampaignsList(this.AllCampaignRequestbody, false, false)
  }

  GetColumnFilters(data) {
    if (data.filterData) {
      if (!data.filterData.isApplyFilter) {
        let headerName = data.filterData.headerName;
        this.filterConfigData[headerName].data = [];
        this.filterConfigData[headerName].PageNo = 1
        this.filterConfigData[headerName].NextLink = '';
        this.generateFilterConfigData(data, headerName, false, this.CampaignGroupListService.CheckFilterServiceFlag(data, headerName, this.filterConfigData));
      } else {
        if (data.filterData.isApplyFilter && this.userdat.CheckFilterFlag(data)) {
          this.AllCampaignRequestbody.OdatanextLink = '';
          this.AllCampaignRequestbody.RequestedPageNumber = 1;
          this.CallListDataWithFilters(data);
        } else if (data.filterData.isApplyFilter && data.filterData.globalSearch != "") {
          this.CallListDataWithFilters(data);
        }
        else {
          this.store.dispatch(new ClearCampaign());
          this.AllCampaignRequestbody.OdatanextLink = ''
          this.AllCampaignRequestbody.RequestedPageNumber = 1;
          this.GetAllCampaignsList(this.AllCampaignRequestbody, false, true);
        }
      }
    }
  }

  GetColumnSearchFilters(data) {
    let headerName = data.filterData.headerName;
    this.AllCampaignRequestbody.OdatanextLink = '';
    this.filterConfigData[headerName].PageNo = 1;
    this.filterConfigData[headerName].NextLink = '';
    this.generateFilterConfigData(data, headerName, false, true);
  }

  LoadMoreColumnFilter(data) {
    let headerName = data.filterData.headerName;
    this.filterConfigData[headerName].PageNo = this.filterConfigData[headerName].PageNo + 1;
    this.generateFilterConfigData(data, headerName, true, true);
  }

  generateFilterConfigData(data, headerName, isConcat, isServiceCall?) {
    if (isServiceCall) {
      let useFulldata = {
        headerName: headerName,
        searchVal: data.filterData.columnSerachKey,
        pageNo: this.filterConfigData[headerName].PageNo,
        pageSize: 10,
        nextLink: this.filterConfigData[headerName].NextLink,
        CampaignType: 2
      }
      this.campaign.getFilterCampaignSwitchListData({ ...data, useFulldata: useFulldata }).subscribe(res => {
        this.filterConfigData.isFilterLoading = false;
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

  CallListDataWithFilters(data) {
    let useFulldata = {
      pageNo: this.AllCampaignRequestbody.RequestedPageNumber,
      CampaignType: 2,
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
          this.AllCampaignRequestbody.OdatanextLink = res.OdatanextLink
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

  downloadCsv(data) {
    this.isLoading = true
    let useFulldata = {
      pageNo: this.AllCampaignRequestbody.RequestedPageNumber,
      CampaignType: 2,
      pageSize: this.AllCampaignRequestbody.PageSize
    }
    let reqBody = this.campaignSerivce.GetAppliedFilterData({...data, useFulldata: useFulldata, SearchType: 1 });
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
        sessionStorage.setItem('RequestCampaign', JSON.stringify({ Id: data['objectRowData'][0]['id'], isAccountPopulate: false ,isCompletedCampaign:false,isCampaignEdit:true}));
      }
      sessionStorage.removeItem('campaignCacheData');
      //sessionStorage.setItem('campaignId', JSON.stringify(data.objectRowData[0].id));
      this.router.navigateByUrl('/campaign/RequestCampaign');
    } else if (route === "createLead") {
      sessionStorage.setItem('TempLeadDetails', JSON.stringify(this.createLeadTempDetails(data.objectRowData[0])));
      sessionStorage.setItem('CampaignCraetelead', JSON.stringify(data.objectRowData[0]));
      this.router.navigateByUrl('/leads/createlead');
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
  createLeadTempDetails(data) {
    return {
      leadName: null,
      leadSource: null,
      accountName: this.filterAccountdata(data),// since we have multiple account for camapign so , we are not p[opulating accoutnid
      sbu: null,
      vertical: null,
      alliance: null,
      advisor: null,
      enquirytype: null,
      country: null,
      serviceLineToggle: false,
      WiproSolutionToggle: false,
      desc: null,
      id: "",
      links: {
        wiprosolution: null,
        activitygroup: null,
        // campaign:this.filterCampaigntdata(data),
        campaign: (data.account.length == 1) ? [{ Name: data.Name, Id: data.id }] : [],
        opportunity: null,
        agp: null
      },
      leadInfo: {
        dealValue: null,
        currency: null,
        timeline: null
      },
      ownerDetails: {
        originator: null,
        oiginatorlist: null,
        owner: [{ FullName: data.owner, ownerId: data.ownerId }],
        customers: null
      },
      serviceline: null,
      attachments: null,
      finalActivityGroup: null,
      finalCampaignGroup: null,
      finalOpportunityGroup: null,
      finalCustomerGroup: null,
      moduleSwitch: true
    }
  }

  filterAccountdata(data) {
    if (data) {
      if (data.account) {
        if (data.account.length == 1) {
          return {
            Name: (data.account[0].Name) ? data.account[0].Name : null,
            SysGuid: (data.account[0].SysGuid) ? data.account[0].SysGuid : null,
            isProspect: (data.account[0].isProspect) ? data.account[0].isProspect : null
          }
        } else {
          return null
        }
      } else {
        return null
      }
    } else {
      return null
    }
  }
  createCampaignList(data) {
    console.log(data)
    if (data) {
      return [data.CampaignType]
    } else {
      null
    }
  }

  tabList: {}[] = [{
    view: 'System views',
    groups: [{ name: 'All campaigns' },
    { name: 'Active campaings' },
    { name: 'Completed campaings' }
    ]
  }]
  /************Select Tabs dropdown code ends */
}
