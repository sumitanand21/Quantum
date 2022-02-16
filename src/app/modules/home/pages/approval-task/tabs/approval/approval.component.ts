import { Component, OnInit } from '@angular/core';

import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { approvalService, approvalheader } from '@app/core/services/approval.service';
import { HomeService } from '@app/core/services/home.service';
import { AppState } from '@app/core/state';
import { Store, select } from '@ngrx/store';
import { LoadApprovalTableList } from '@app/core/state/actions/home.action';
import { selectApprovalTable } from '@app/core/state/selectors/home/approval.selector';
import { DatePipe } from '@angular/common';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { DataCommunicationService } from '@app/core/services/global.service';
import { environment as env } from '@env/environment';
import { ErrorMessage } from '@app/core';
import { AccountListService } from '@app/core/services/accountList.service';
import { DateModifier } from '@app/core/services/date-modifier';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;



@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.scss']
})
export class ApprovalComponent implements OnInit {

  approvalListRequestbody = {
    'PageSize': 50,
    'RequestedPageNumber': 1,
    'OdatanextLink': "",
    'Guid': this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
  }

  constructor(
    private approval: approvalService,
    private router: Router,
    public service: DataCommunicationService,
    public dialog: MatDialog,
    public store: Store<AppState>,
    public datePipe: DatePipe,
    public errorMessage: ErrorMessage,
    public accountListServ: AccountListService,
    public encrDecrService: EncrDecrService,
    public envr : EnvService) { }
  approvalTable = [];
  tableTotalCount: any;
  isLoading: boolean = false;
  UserId: any;

  ngOnInit() {
    this.UserId = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
    this.isLoading = true;
    this.getApprovalList(this.approvalListRequestbody, true, false);

    // this.store.pipe((select(selectApprovalTable))).subscribe(res => {
    //   this.isLoading = true
    //   console.log("approval list response>>>>>>>>>")
    //   console.log(res)

    //   if (res) {
    //     if (res.ids.length > 0) {
    //       this.isLoading = false
    //       this.approvalTable = this.filterTableData(Object.values(res.entities))
    //       // this.approvalTable.map((res, index) => {
    //       //   res.index = index + 1;
    //       // })
    //       this.tableTotalCount = res.count;
    //       this.approvalListRequestbody.OdatanextLink = res.nextlink
    //     } else {
    //       this.isLoading = true;
    //       this.getApprovalList(this.approvalListRequestbody, true, false)
    //     }
    //   }
    //   else {
    //     this.isLoading = true;
    //     this.getApprovalList(this.approvalListRequestbody, true, false)
    //   }
    //   // wirte logic here!!
    // })
  }

  // table selector event emitters

  performTableChildAction(childActionRecieved): Observable<any> {
    var actionRequired = childActionRecieved;
    console.log(actionRequired.action);
    switch (actionRequired.action) {

      case 'Name': {
        return of('Name Trigger');
      }
      case 'search': {
        this.approvalListRequestbody.OdatanextLink = '';
        this.approvalListRequestbody.RequestedPageNumber = 1;
        this.CallListDataWithFilters(childActionRecieved);
        // this.SearchTable(childActionRecieved);
        return;
      }
      case 'DownloadCSV': {
        this.downloadList(childActionRecieved);
        return;
      }
      case 'columnFilter': {
        this.GetColumnFilters(childActionRecieved);
        return;
      }
      case 'columnSearchFilter': {
        this.GetColumnSearchFilters(childActionRecieved);
        return;
      }
      case 'ClearAllFilter': {
        this.CallListDataWithFilters(childActionRecieved);
        break;
      }
      case 'sortHeaderBy': {
        this.approvalListRequestbody.OdatanextLink = '';
        this.approvalListRequestbody.RequestedPageNumber = 1;
        this.CallListDataWithFilters(childActionRecieved);
        return;
      }
    }
  }

  downloadList(data): void {
    this.isLoading = true;
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    reqparam['IsFilterApplied'] = this.service.checkFilterListApiCall(data) ? true : false;
    this.accountListServ.getFilterList(reqparam, true, 'getApprovallistDownload').subscribe(res => {
      if (!res.IsError) {
        this.isLoading = false;
        if (this.envr.envName === 'MOBILEQA') {
          this.downloadListMobile(res.ResponseObject);
        } else {
          window.open(res.ResponseObject.Url, '_blank');
        }
      } else {
        this.isLoading = false;
        this.errorMessage.throwError(res.Message);
      }
    }, error => {
      this.isLoading = false;
    });
  }

  downloadListMobile(fileInfo) {
    const fileTransfer = new FileTransfer();
    const newUrl = fileInfo.Url.substr(0, fileInfo.Url.indexOf('?'));
    const uri = encodeURI(newUrl);
    const fileURL = '///storage/emulated/0/DCIM/' + fileInfo.Name;
    this.errorMessage.throwError(`${fileInfo.Name} downloaded`);
    fileTransfer.download(
      uri, fileURL, function (entry) {
        console.log('download complete: ' + entry.toURL());
      },
      function (error) {
        console.log('download error source ' + error.source);
        console.log('download error target ' + error.target);
        console.log('download error code' + error.code);
      },
      null, {
    }
    );
  }

  GetColumnSearchFilters(data) {
    const headerName = data.filterData.headerName;
    this.approvalListRequestbody.OdatanextLink = '';
    this.filterConfigData[headerName].PageNo = 1;
    this.filterConfigData[headerName].NextLink = '';
    this.generateFilterConfigData(data, headerName, false, true);
  }

  // LoadMoreColumnFilter(data) {
  //   let headerName = data.filterData.headerName
  //   this.filterConfigData[headerName].PageNo = this.filterConfigData[headerName].PageNo + 1
  //   this.generateFilterConfigData(data, headerName, true, true)
  // }

  getNewTableData(event) {

    if (event.action == 'pagination') {
      this.approvalListRequestbody.PageSize = event.itemsPerPage;
      this.approvalListRequestbody.RequestedPageNumber = event.currentPage;
      this.CallListDataWithFilters(event, true);
      //if search with pagination!
      // if (event.objectRowData != "" && event.objectRowData != undefined) {
      //   this.getApprovalList(this.approvalListRequestbody, false, true);
      // } else {
      //   this.getApprovalList(this.approvalListRequestbody, true, false);
      // }

    }
  }

  // SearchTable(data): void {
  //   console.log("search")
  //   console.log(data)
  //   this.approvalListRequestbody.RequestedPageNumber = 1
  //   this.approvalListRequestbody.OdatanextLink = ""
  //   if (data != "") {
  //     if (data.objectRowData != "" && data.objectRowData != undefined) {
  //       let ApprovalSearch = {
  //         "SearchText": data.objectRowData,
  //         "PageSize": this.approvalListRequestbody.PageSize,
  //         "Id": "",
  //         "Guid": this.UserId
  //       }
  //       this.approval.getSearchApproval(ApprovalSearch).subscribe(res => {

  //         if (!res.IsError) {

  //           if (res.ResponseObject.length > 0) {
  //             let i = 1;
  //             res.ResponseObject.map(res => {
  //               res.index = i;
  //               i = i + 1;
  //             })

  //             this.approvalTable = this.filterTableData(res.ResponseObject)
  //             console.log('approval Table-->', this.approvalTable)
  //             this.approvalListRequestbody.OdatanextLink = res.OdatanextLink
  //             this.tableTotalCount = res.TotalRecordCount
  //           } else {
  //             this.approvalTable = [{}]
  //             this.tableTotalCount = 0;

  //           }
  //         }
  //       })
  //     } else {
  //       this.getApprovalList(this.approvalListRequestbody, true, false)
  //     }
  //   }
  // }

  getApprovalList(reqBody, isConcat, isSearch) {   
    this.isLoading = true;
    const reqBodydata = {
      "ColumnSearchText": "",
      "SearchText": "",
      "ProirityCodes": [],
      "Descriptions": [],
      "OwnerGuids": [reqBody.Guid],
      "PageSize": reqBody.PageSize,
      "RequestedPageNumber": reqBody.RequestedPageNumber,
      "IsDesc": true,
      "SortBy":15,
      "StartDate": "",
      "EndDate": "",
    };
    this.approval.getApprovalList(reqBodydata).subscribe(async (res) => {
      console.log("got the response form the get approval list!", res)
      this.isLoading = false;
      if (!res.IsError) {
        this.isLoading = false;
        if (res.ResponseObject.length > 0) {
          this.approvalTable = [];
          const ImmutableObject = Object.assign({}, res);
          const perPage = reqBody.PageSize;
          const start = ((reqBody.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;
          res.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          });
          this.approvalListRequestbody = reqBody;
          // await this.offlineServices.ClearActiveAccountIndexTableData();
          if (res.OdatanextLink) {
            this.approvalListRequestbody.OdatanextLink = res.OdatanextLink;
          }
          // await this.offlineServices.ClearActiveCampaignIndexTableData();
          this.approvalListRequestbody.OdatanextLink = res.OdatanextLink;
          if (isConcat) {
            const spliceArray = [];
            this.approvalTable.map((res) => {
              if (res.index >= start && res.index <= end) {
                spliceArray.push(res);
              }
            });
            spliceArray.map(res => {
              this.approvalTable.splice(this.approvalTable.indexOf(res), 1);
            });
            this.approvalTable = this.approvalTable
              .concat(this.filterTableData(res.ResponseObject));
          } else {
            this.approvalTable = this.filterTableData(res.ResponseObject);
          }
          ImmutableObject.ResponseObject.map(x => x.id = x.SysGuid);
          // this.store.dispatch(new farmingAccountAction({
          //   FarmingListModel: ImmutableObject.ResponseObject,
          //   count: res.TotalRecordCount,
          //   OdatanextLink: res.OdatanextLink
          // }));
          this.tableTotalCount = res.TotalRecordCount;
        } else {
          this.isLoading = false;
          this.tableTotalCount = 0;
          this.approvalTable = [{}];
        }
      } else {
        this.isLoading = false;
        if (reqBody.RequestedPageNumber > 1) {
          this.approvalListRequestbody.RequestedPageNumber = this.approvalListRequestbody.RequestedPageNumber - 1;
        }
      }
      // if (!res.IsError) {
      //   if (res.ResponseObject.length > 0) {
      //     this.approvalTable = [];
      //     const ImmutabelObj = Object.assign({}, res)
      //     const perPage = reqBody.PageSize;
      //     const start = ((reqBody.RequestedPageNumber - 1) * perPage) + 1;
      //     let i = start;
      //     const end = start + perPage - 1;
      //     res.ResponseObject.map(res => {
      //       if (!res.index) {
      //         res.number = i
      //         res.index = i;
      //         i = i + 1;
      //       }
      //     })
      //     if (res.OdatanextLink) {
      //       this.approvalListRequestbody.OdatanextLink = res.OdatanextLink
      //     }
      //     if (isConcat) {
      //       let spliceArray = [];
      //       this.approvalTable.map((res) => {
      //         if (res.index >= start && res.index <= end) {
      //           spliceArray.push(res);
      //         }
      //       });
      //       spliceArray.map(res => {
      //         this.approvalTable.splice(this.approvalTable.indexOf(res), 1);
      //       })

      //       if (!isSearch) {

      //         ImmutabelObj.ResponseObject.map(x => x.id = x.ActivityId)
      //         const approvalListAction = {
      //           approvalListData: ImmutabelObj.ResponseObject,
      //           count: ImmutabelObj.TotalRecordCount,
      //           nextlink: ImmutabelObj.OdatanextLink
      //         }
      //         console.log('approvalListAction', approvalListAction)
      //         // this.store.dispatch(new LoadApprovalTableList({ approvalList: approvalListAction }))
      //       } else {
      //         this.approvalTable = this.approvalTable.concat(this.filterTableData(res.ResponseObject))
      //       }

      //     } else {

      //       this.approvalTable = this.filterTableData(res.ResponseObject)
      //     }
      //     this.tableTotalCount = res.TotalRecordCount
      //   } else {
      //     this.approvalTable = [{}]
      //     this.tableTotalCount = 0
      //   }
      // } else {
      //   this.approvalTable = [{}]
      //   this.tableTotalCount = 0
      //   this.isLoading = false
      // }
    },
      error => {
        this.isLoading = false;
      });
  }

  // ------------------------------------------------table filter start------------------------------------------------------------------

  filterConfigData = {
    // number: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    desc: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    priority: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    dueDate: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    isFilterLoading: false
  };

  GetColumnFilters(data) {
    if (data.filterData) {
      if (!data.filterData.isApplyFilter) {
        const headerName = data.filterData.headerName;
        this.filterConfigData[headerName].data = [];
        this.approvalListRequestbody.OdatanextLink = '';
        this.filterConfigData[headerName].PageNo = 1;
        this.filterConfigData[headerName].NextLink = '';
        this.generateFilterConfigData(data, headerName, false, this.CheckFilterServiceFlag(data, headerName));
      } else {
        if (data.filterData.isApplyFilter && this.service.CheckFilterFlag(data)) {
          this.approvalListRequestbody.OdatanextLink = '';
          this.approvalListRequestbody.RequestedPageNumber = 1;
          this.CallListDataWithFilters(data);
        } else {
          this.approvalListRequestbody.OdatanextLink = '';
          this.approvalListRequestbody.RequestedPageNumber = 1;
          if (data.filterData.globalSearch) {
            // this.SearchTable(data);
            this.CallListDataWithFilters(data);

          } else {
            this.getApprovalList(this.approvalListRequestbody, true, false);
          }

        }

      }
    }
  }
  generateFilterConfigData(data, headerName, isConcat, isServiceCall?) {
    if (isServiceCall) {
      const useFulldata = {
        headerName: headerName,
        searchVal: data.filterData.columnSerachKey,
        pageNo: this.filterConfigData[headerName].PageNo,
        pageSize: 10,
        nextLink: this.filterConfigData[headerName].NextLink,
        guid: this.approvalListRequestbody.Guid,
        statusCode: 0,
        Searchtype: ''
      };
      // let dataSet = data;
      // dataSet['Guid'] = this.IcentivizeUserListRequeBody.Guid;
      this.accountListServ.getFilterSwitchListData({ columnFIlterJson: this.GetAppliedFilterData(data, false), useFulldata: useFulldata }, 'approvaList').subscribe(res => {

        this.filterConfigData.isFilterLoading = false;
        this.filterConfigData[headerName] = {
          data: (isConcat) ? this.filterConfigData[headerName]['data'].concat(res.ResponseObject) : res.ResponseObject,

          // data: (isConcat) ? res.ResponseObject.concat(this.filterConfigData[headerName]['data']) : res.ResponseObject,
          recordCount: res.TotalRecordCount,
          NextLink: res.OdatanextLink,
          PageNo: res.CurrentPageNumber
        };
        data.filterData.filterColumn[headerName].forEach(resp => {
          const index = this.filterConfigData[headerName].data.findIndex(x => x.id === resp.id);
          if (index !== -1) {
            this.filterConfigData[headerName].data[index].isDatafiltered = true;
          }
        });
      });
    } else {
      this.filterConfigData.isFilterLoading = false;
      if (data.filterData.filterColumn[headerName].length > 0) {
        this.filterConfigData[headerName]['data'] = this.RemoveSelectedItems(this.filterConfigData[headerName]["data"], data.filterData.filterColumn[headerName], 'id').concat(data.filterData.filterColumn[headerName]);
      }
    }
  }

  GetAppliedFilterData(data, IsFilterAPI) {
    return {
      "ColumnSearchText": (data.filterData) ? (data.filterData.columnSerachKey) ? data.filterData.columnSerachKey : "" : "",
      "SearchText": (data.filterData) ? (data.filterData.globalSearch) ? data.filterData.globalSearch : "" : "",
      "ProirityCodes": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['priority'], 'id') : [] : [],
      "Descriptions": (data.filterData) ? (data.filterData.filterColumn) ? this.pluckParticularKey(data.filterData.filterColumn['desc'], 'name') : [] : [],
      "OwnerGuids": [this.approvalListRequestbody.Guid],
      "PageSize": IsFilterAPI ? this.approvalListRequestbody.PageSize : 10,
      "RequestedPageNumber": this.approvalListRequestbody.RequestedPageNumber,
      "IsDesc": (data.filterData) ? (data.filterData.sortColumn != '') ? !data.filterData.sortOrder : false : false,
      "SortBy": (data.filterData) ? (data.filterData.filterColumn) ? this.checkFilterListApiCall(data) ? this.pluckParticularKey(approvalheader.filter(x => x.name == data.filterData.sortColumn), 'SortId')[0] : [] : [] : [],
      "StartDate": (data.filterData) ? (data.filterData.filterColumn['dueDate'][0].filterStartDate !== '') ? this.dateModifier(data.filterData.filterColumn['dueDate'][0].filterStartDate) : "" : "",
      "EndDate": (data.filterData) ? (data.filterData.filterColumn['dueDate'][0].filterEndDate !== '') ? this.dateModifier(data.filterData.filterColumn['dueDate'][0].filterEndDate) : "" : ""
    };
  }
  CheckFilterServiceFlag(data, headerName): boolean {

    if (data) {

      if (data.action == "columnFilter" && data.filterData.columnSerachKey == '' && this.filterConfigData[headerName]["data"].length <= 0) {
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

  /**
     * 
     * @param array1 from where
     * @param array2 which al 
     * @param key key
     */
  RemoveSelectedItems(array1, array2, key) {
    return array1.filter(item1 =>
      !array2.some(item2 => (item2[key] === item1[key])))
  }

  // CallListDataWithFilters(data) {
  //   const reqparam = this.getTableFilterData({ ...data }, true);
  //   this.approval.getAppliedFilterApprovalData(reqparam,true,'getApprovalList').subscribe(res => {
  //     if (!res.IsError) {
  //       if (res.ResponseObject.length > 0) {

  //         const ImmutabelObj = Object.assign({}, res);
  //         const perPage = reqparam.PageSize;
  //         const start = ((reqparam.RequestedPageNumber - 1) * perPage) + 1;
  //         let i = start;
  //         const end = start + perPage - 1;

  //         res.ResponseObject.map(res => {
  //           if (!res.index) {
  //             res.index = i;
  //             i = i + 1;
  //           }
  //         });

  //         this.approvalTable = this.filterTableData(res.ResponseObject);
  //         this.approvalListRequestbody.OdatanextLink = res.OdatanextLink;
  //         this.tableTotalCount = res.TotalRecordCount;
  //         // this.filterConfigData.Type['data'] = [];
  //       } else {
  //         this.approvalTable = [{}];
  //         this.tableTotalCount = 0;
  //       }
  //     } else {
  //       this.approvalTable = [{}];
  //       this.tableTotalCount = 0;
  //       this.errorMessage.throwError(res.Message);
  //     }
  //   });
  // }
  CallListDataWithFilters(data, isConcat?) {
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    this.accountListServ.getFilterList(reqparam, false, 'FilterApprovalList').subscribe(res => {
      if (!res.IsError) {
        if (res.ResponseObject.length > 0) {

          const ImmutabelObj = Object.assign({}, res);
          const perPage = reqparam.PageSize;
          const start = ((reqparam.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;

          res.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          });
          if (isConcat) {
            if (reqparam.RequestedPageNumber == 1) {
              this.approvalTable = this.filterTableData(res.ResponseObject);
            }
            else {
              this.approvalTable = [...this.approvalTable, ...this.filterTableData(res.ResponseObject)];
            }
          } else {
            this.approvalTable = this.filterTableData(res.ResponseObject);
          }

          // this.approvalTable = this.filterTableData(res.ResponseObject);
          this.approvalListRequestbody.OdatanextLink = res.OdatanextLink;
          this.tableTotalCount = res.TotalRecordCount;
          // this.filterConfigData.Type['data'] = [];
        } else {
          this.approvalTable = [{}];
          this.tableTotalCount = 0;
        }
      } else {
        this.approvalTable = [{}];
        this.tableTotalCount = 0;
        this.errorMessage.throwError(res.Message);
      }
    });
  }

  // getTableFilterData(data, IsFilterAPI){
  //   return {
  //     "ColumnSearchText": (data.filterData) ? (data.filterData.columnSerachKey) ? data.filterData.columnSerachKey : "" : "",
  //     "SearchText": (data.filterData) ? (data.filterData.globalSearch) ? data.filterData.globalSearch : "" : "",
  //     "ProirityCodes": (data.filterData)? (data.filterData.filterColumn)? this.pluckParticularKey(data.filterData.filterColumn['priority'], 'id'):[]:[],
  //     "Descriptions":(data.filterData)? (data.filterData.filterColumn)? this.pluckParticularKey(data.filterData.filterColumn['desc'], 'name'):[]:[],
  //     "OwnerGuids": [data.useFulldata.userId],
  //     "PageSize": IsFilterAPI ? 50 : 10,
  //     "RequestedPageNumber": data.useFulldata.pageNo,
  //     "IsDesc":(data.filterData)? (data.filterData.sortColumn!='')?!data.filterData.sortOrder:false:false,
  //     "SortBy":(data.filterData) ? (data.filterData.filterColumn)?this.checkFilterListApiCall(data)?this.pluckParticularKey(approvalheader.filter(x=>x.name==data.filterData.sortColumn),'SortId')[0]:[]:[]:[],
  //     "StartDate": (data.filterData) ? (data.filterData.filterColumn['date'][0].filterStartDate !== '') ? this.dateModifier(data.filterData.filterColumn['date'][0].filterStartDate) : "" : "",
  //     "EndDate": (data.filterData) ? (data.filterData.filterColumn['date'][0].filterEndDate !== '') ? this.dateModifier(data.filterData.filterColumn['date'][0].filterEndDate) : "" : ""
  //   }
  // }
  checkFilterListApiCall(data) {
    if (data.filterData.order.length > 0 || data.filterData.sortColumn != "") {
      return true;
    } else {
      return false
    }
  }
  pluckParticularKey(array, key) {
    return array.map(function (item) { return (item[key]) });
  }

  dateModifier(dateConvert) {
    let dataModifier = new DateModifier();
    return dataModifier.modifier(dateConvert)
  }
  // ------------------------------------------------table filter end------------------------------------------------------------------


  filterTableData(data) {
    if (data.length > 0) {
      try {
        return data.map((res, i) => {
          return {
            number: (i + 1).toString(),
            desc: res.Subject || "NA",
            priority: res.Priority || "NA",
            dueDate: (res.DueDate) ? res.DueDate : "NA",
            index: res.index,
            id: res.index,
            approveBtnVisibility: true,
            rejectBtnVisibility: true,
            statusclass: res.Priority == 'High' ? 'high' : ''
              || res.Priority == 'Low' ? 'low' : ''
                || res.Priority == 'Normal' ? 'normal' : ''
          }
        })
      } catch (error) {
        console.log("error occured")
        console.log(error)
        return [{}]
      }

    } else {
      return [{}]
    }
  }

  // table event emitter end
}
