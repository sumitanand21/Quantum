import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { DataCommunicationService, ErrorMessage } from '@app/core';
import { AccountListService } from '@app/core/services/accountList.service';
import { AvailableReportsHeader } from '@app/core/services/reports/reports.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-available-reports',
  templateUrl: './available-reports.component.html',
  styleUrls: ['./available-reports.component.scss']
})
export class AvailableReportsComponent implements OnInit {

  isLoading: boolean = false;
  tableTotalCount;
  // link = "https://app.powerbi.com/groups/1610cb7b-a5d4-45c4-bd37-a3bb13a04835/rdlreports/478e31dd-0a0a-4b9b-b17e-90fecdcc0754";
  ReportRequestbody =
  {
    'PageSize': 50,
    'RequestedPageNumber': 1,
    'OdatanextLink': '',
    'Guid': 1111
  };
  filterConfigData = {
    ReportName: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Description: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    isFilterLoading: false
  };
  accSysId: any;
  accountName: any;
  AvailableReportsTable = [];

  constructor(private snackBar: MatSnackBar,public router: Router, public errorMessage: ErrorMessage, private EncrDecr: EncrDecrService, public service: DataCommunicationService, public accountListServ: AccountListService) { }

  ngOnInit() {
   // this.accSysId = (localStorage.getItem('accountSysId')) ? this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('accountSysId'), 'DecryptionDecrip') : '';
   // this.accountName = this.accountListServ.getSymbol(this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('accountName'), 'DecryptionDecrip'));
    
    this.getListOfReports(this.ReportRequestbody, true, false);
     }

  getListOfReports(reqBody, isConcat, isSearch) {
    this.isLoading = true;
    const reqBodydata = {
      "SearchText": "",
      "IsDesc": false,
      "IsFilterApplied": true,
      "PageSize": reqBody.PageSize,
      "RequestedPageNumber": reqBody.RequestedPageNumber,
      
    };
    this.accountListServ.getReportUrls(reqBodydata).subscribe((res: any) => {
      this.isLoading = false;
      if (!res.IsError) {
        this.isLoading = false;
        if (res.ResponseObject.length > 0) {
          this.AvailableReportsTable = [];
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
          // this.ReportRequestbody = reqBody;
          // // await this.offlineServices.ClearActiveAccountIndexTableData();
          if (res.OdatanextLink) {
            this.ReportRequestbody.OdatanextLink = res.OdatanextLink;
          }
          // await this.offlineServices.ClearActiveCampaignIndexTableData();
          // this.ReportRequestbody.OdatanextLink = res.OdatanextLink;
          if (isConcat) {
            const spliceArray = [];
            this.AvailableReportsTable.map((res) => {
              if (res.index >= start && res.index <= end) {
                spliceArray.push(res);
              }
            });
            spliceArray.map(res => {
              this.AvailableReportsTable.splice(this.AvailableReportsTable.indexOf(res), 1);
            });
            this.AvailableReportsTable = this.AvailableReportsTable
              .concat(this.filterTableData(res.ResponseObject));
          } else {
            this.AvailableReportsTable = this.filterTableData(res.ResponseObject);
          }
          // ImmutableObject.ResponseObject.map(x => x.id = x.SysGuid);
          // this.store.dispatch(new farmingAccountAction({
          //   FarmingListModel: ImmutableObject.ResponseObject,
          //   count: res.TotalRecordCount,
          //   OdatanextLink: res.OdatanextLink
          // }));
          this.tableTotalCount = res.TotalRecordCount;
        } else {
          this.isLoading = false;
          this.tableTotalCount = 0;
          this.AvailableReportsTable = [{}];
        }
      } else {
        this.isLoading = false;
        if (reqBody.RequestedPageNumber > 1) {
          this.ReportRequestbody.RequestedPageNumber = this.ReportRequestbody.RequestedPageNumber - 1;
        }
      }

    },
      error => {
        this.isLoading = false;
      });
  }
  
  filterTableData(data) {
    if (data.length > 0) {
      try {
        return data.map((res, i) => {
          return {
            index: res.index,
            id: res.index,
            ReportName : res.Title || "NA",
            Description : res.Description || "NA",
            Link : res.Url || "NA",
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
  performTableChildAction(childActionRecieved): Observable<any> {
    var actionRequired = childActionRecieved;
    console.log(actionRequired.action);
    switch (actionRequired.action) {

      case 'ReportName': {
        this.navtoReport(actionRequired.objectRowData[0].Link);
        return;
      }
      case 'search': {
        this.ReportRequestbody.OdatanextLink = '';
        this.ReportRequestbody.RequestedPageNumber = 1;
        this.CallListDataWithFilters(childActionRecieved);
        // this.SearchTable(childActionRecieved);
        return;
      }
      case 'sortHeaderBy': {
        this.ReportRequestbody.OdatanextLink = '';
        this.ReportRequestbody.RequestedPageNumber = 1;
        this.CallListDataWithFilters(childActionRecieved);
        return;
      }
    }
  }

  navtoReport(link){
    //window.location.href=link;
    window.open(link, '_blank');
  }
  CallListDataWithFilters(data, isConcat?) {
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    this.accountListServ.getFilterList(reqparam, false, 'ReportsUrl').subscribe(res => {
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
              this.AvailableReportsTable = this.filterTableData(res.ResponseObject);
            }
            else {
              this.AvailableReportsTable = [...this.AvailableReportsTable, ...this.filterTableData(res.ResponseObject)];
            }
          } else {
            this.AvailableReportsTable = this.filterTableData(res.ResponseObject);
          }

          // this.approvalTable = this.filterTableData(res.ResponseObject);
          this.ReportRequestbody.OdatanextLink = res.OdatanextLink;
          this.tableTotalCount = res.TotalRecordCount;
          // this.filterConfigData.Type['data'] = [];
        } else {
          this.AvailableReportsTable = [{}];
          this.tableTotalCount = 0;
        }
      } else {
        this.AvailableReportsTable = [{}];
        this.tableTotalCount = 0;
        this.errorMessage.throwError(res.Message);
      }
    });
  }

  GetAppliedFilterData(data, IsFilterAPI) {
    return {
     
      "SearchText": (data.filterData) ? (data.filterData.globalSearch) ? data.filterData.globalSearch : "" : "",
      "PageSize": IsFilterAPI ? this.ReportRequestbody.PageSize : 10,
      "RequestedPageNumber": this.ReportRequestbody.RequestedPageNumber,
      "IsDesc": (data.filterData) ? (data.filterData.sortColumn != '') ? !data.filterData.sortOrder : false : false,
      "SortBy": (data.filterData) ? (data.filterData.filterColumn) ? this.checkFilterListApiCall(data) ? this.pluckParticularKey(AvailableReportsHeader.filter(x => x.name == data.filterData.sortColumn), 'SortId')[0] : [] : [] : [],
      "IsFilterApplied": true,
    };
  }
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

  getNewTableData(event) {
    if (event.action === 'pagination') {
      this.ReportRequestbody.PageSize = event.itemsPerPage;
      this.ReportRequestbody.RequestedPageNumber = event.currentPage;
      this.CallListDataWithFilters(event, true);
      // } else if (event.action === 'search') {
      //   this.ActiveAccountRequest = {
      //     'PageSize': event.itemsPerPage,
      //     'RequestedPageNumber': 1,
      //     'OdatanextLink': '',
      //     'Guid': this.userId
      //   };
    }
  }
}
