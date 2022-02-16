import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/core/services/account.service';
import { DataCommunicationService, ErrorMessage } from '@app/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Observable, of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { AccountListService } from '@app/core/services/accountlist.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { MatSnackBar } from '@angular/material';
import { environment as env } from '@env/environment';
import { DateModifier } from '@app/core/services/date-modifier';
declare let FileTransfer: any;
import moment from 'moment';
import { FileUploadService } from '@app/core/services/file-upload.service';
import { EnvService } from '@app/core/services/env.service';


// import { DateModifier } from ;
@Component({
  selector: 'app-management-log-table',
  templateUrl: './management-log-table.component.html',
  styleUrls: ['./management-log-table.component.scss']
})
export class ManagementLogTableComponent implements OnInit {
  roleAccess:boolean;
  //--start---
  accountName;
  // userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
  userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip'); //localStorage.getItem('accountSysId');
  tableTotalCount: number;
  headerData: any;
  isLoading: boolean = false;
  ManagementLogTableRequestBody =
    {
      'PageSize': 50,
      'RequestedPageNumber': 1,
      'OdatanextLink': '',
      'Guid': this.userId
    };
  ManagementLogTable = [];
  filterConfigData = {
    Meetingtype: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Meetingstage: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Createdby: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Dateofmeeting: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    // Starttime: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Duration: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Chairpersoncoach: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    isFilterLoading: false

  };
  mobileView;
  constructor(public AccountService: AccountService, public router: Router, public dialog: MatDialog, private fileService: FileUploadService,
    public userdat: DataCommunicationService, private datepipe: DatePipe,
    private accountlistService: AccountListService, private EncrDecr: EncrDecrService, private snackBar: MatSnackBar, public errorMessage: ErrorMessage,public envr : EnvService) { }

  ngOnInit(): void {
    this.roleAccess  = this.userdat.getRoleAccess();
    // this.accountName = localStorage.getItem('accountName');
    this.accountName = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountName'), 'DecryptionDecrip');
    this.GetAllHistory(this.ManagementLogTableRequestBody, true);
    this.mobileView = this.userdat.MobileDevice;
  }
  accountManagement() {
    this.router.navigate(['/accounts/managementlog/managementlogCreate']);
  }

  TablePagination(data) {
    this.ManagementLogTableRequestBody.RequestedPageNumber = this.ManagementLogTableRequestBody.RequestedPageNumber + 1;
    this.GetAllHistory(this.ManagementLogTableRequestBody, true);
  }

  getNewTableData(event) {
    if (event.action === 'pagination') {
      this.ManagementLogTableRequestBody.PageSize = event.itemsPerPage;
      this.ManagementLogTableRequestBody.RequestedPageNumber = event.currentPage;
      this.CallListDataWithFilters(event,true);
      // if (this.userdat.checkFilterListApiCall(event)) {

      //   //filter api call
      //   this.CallListDataWithFilters(event);
      // } else {

      //   //list api call
      //   this.GetAllHistory(this.ManagementLogTableRequestBody, true);
      // }

    } else if (event.action === 'search') {
      this.ManagementLogTableRequestBody = {
        'PageSize': event.itemsPerPage,
        'RequestedPageNumber': 1,
        'OdatanextLink': '',
        'Guid': this.userId
      };
    }
  }
  getSymbol(data) {
    // console.log(data)
    return this.accountlistService.getSymbol(data);
  }
  SearchTable(data): void {
    this.ManagementLogTableRequestBody.RequestedPageNumber = 1;
    this.ManagementLogTableRequestBody.OdatanextLink = '';
    if (data !== '') {
      const searchData = data.objectRowData ? data.objectRowData : data.filterData.globalSearch;
      if (searchData !== '' && searchData !== undefined) {
        this.accountlistService.accountSearch(searchData, 3, this.ManagementLogTableRequestBody.PageSize, this.ManagementLogTableRequestBody.OdatanextLink, this.ManagementLogTableRequestBody.RequestedPageNumber).subscribe(res => {
          if (!res.IsError) {
            if (res.ResponseObject.length > 0) {
              this.ManagementLogTable = this.getTableFilterData(res.ResponseObject);
              let i = 1;
              this.ManagementLogTable.map((res: any) => {
                res.index = i;
                i = i + 1;
              });
              this.ManagementLogTableRequestBody.OdatanextLink = res.OdatanextLink;
              this.tableTotalCount = res.TotalRecordCount;
            } else {
              this.ManagementLogTable = [{}];
              this.tableTotalCount = 0;
            }
          }
        });
      } else {
        this.GetAllHistory(this.ManagementLogTableRequestBody, false);
      }
    }
  }
  downloadRowFile(data) {
    let attchData = data;
    var body = attchData.map((res) => {
        return {
          'Name': res.DownloadName,
        };
      });
    this.isLoading = true;
    this.fileService.filesToDownloadDocument64(body).subscribe((res) =>{
      this.isLoading = false;
      if(!res.IsError) {
        res.ResponseObject.forEach(res => {
          this.userdat.Base64Download(res);
        })
      } else {
         this.errorMessage.throwError(res.Message);
      }
      console.log(res);
    },() =>{this.isLoading = false;})
  }
  //--End---
  downloadAll(data) {
    const downloadUrls = [];
    if (data.length !== 0) {
      data.forEach(res => {
        downloadUrls.push(res.Url);
      });
      // For downloading multiple files
      downloadUrls.forEach(function (value, idx) {
        const response = {
          file: value,
        };
        setTimeout(() => {
          const a = document.createElement('a');
          a.href = response.file;
          a.download = response.file;
          document.body.appendChild(a);
          a.click();
        }, idx * 2500);
      });
    } else {
      this.snackBar.open('No file attachments available for this meeting.', '', {
        duration: 3000
      });
    }
  }
  performTableChildAction(childActionRecieved): Observable<any> {
    if (childActionRecieved) {
      (childActionRecieved.parentData) ? this.tableTotalCount = childActionRecieved.parentData.totalCount : this.tableTotalCount = this.tableTotalCount;
    }
    const actionRequired = childActionRecieved;
    // let incId =  actionRequired.objectRowData[0].id;//this.EncrDecr.set('EncryptionEncryptionEncryptionEn', actionRequired.objectRowData[0].Id, 'DecryptionDecrip');
    // let obj = { 'route_from': '', 'Id': actionRequired.objectRowData[0].id }
    // localStorage.setItem('routeParams', this.EncrDecr.set('EncryptionEncryptionEncryptionEn', JSON.stringify(obj), 'DecryptionDecrip'))

    switch (actionRequired.action) {

      case 'Name': {
        // this.accountlistService.setUrlParamsInStorage('modif_req', actionRequired.objectRowData[0].id);
        this.accountlistService.setSession('routeParams', { 'route_from': 'modif_req', 'Id': actionRequired.objectRowData[0].id });
        this.router.navigate(['/accounts/accountdetails']);
        return;
      }
      case 'Meetingtype': {
        this.userdat.manageLog(actionRequired);
        localStorage.setItem('manageEdit', 'view');
        this.router.navigate(['/accounts/managementlog/managementlogCreate']);
        return;
      }
      case 'Download': {
        // console.log("Action is: ", actionRequired.action);
        console.log(actionRequired.objectRowData[0]);
        // window.open = actionRequired.objectRowData[0].MomAttachment;
        this.downloadRowFile(actionRequired.objectRowData[0].Attachments);
        // this.downloadAll(actionRequired.objectRowData[0].Attachments);
        return;
      }
      case 'view modification': {
        this.accountlistService.setSession('routeParams', { 'route_from': 'modif_req', 'Id': actionRequired.objectRowData[0].id });
        this.router.navigate(['/accounts/accountmodification/viewmodificationdetails']);
        return;
      }
      case 'view':
        {
          // this.router.navigate(['/accounts/accountcreation/reviewnewaccount']);
          this.userdat.manageLog(actionRequired);
          localStorage.setItem('manageEdit', 'view');
          this.router.navigate(['/accounts/managementlog/managementlogCreate']);
          return;
        }
      case 'review':
        {
          this.router.navigate(['/accounts/accountcreation/reviewnewaccount']);
          return;
        }
      case 'editdraft':
        {
          this.router.navigate(['/accounts/accountcreation/createnewaccount']);
          return;
        }
      case 'edit':
        {
          this.userdat.manageLog(actionRequired);
          localStorage.setItem('manageEdit', 'edit');
          this.router.navigate(['/accounts/managementlog/managementlogCreate']);
          return;
        }
      case 'delete':
        {
          const deletePayload = { SysGuid: actionRequired.objectRowData.id };
          this.accountlistService.manageLogDelete(deletePayload).subscribe(res => {
            if (!res.IsError && res.ResponseObject) {
              this.snackBar.open(res['Message'], '', {
                duration: 3000
              });
              this.ManagementLogTableRequestBody.OdatanextLink = '',
                // this.router.navigate(['/accounts/managementlog']);
                this.CallListDataWithFilters(childActionRecieved);
              // this.GetAllHistory(this.ManagementLogTableRequestBody, true);
            } else {
              this.snackBar.open(res['Message'], '', {
                duration: 3000
              });
            }
          });
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
      case 'sortHeaderBy': {
        this.ManagementLogTableRequestBody.OdatanextLink = '';
        this.ManagementLogTableRequestBody.RequestedPageNumber = 1;
        this.CallListDataWithFilters(childActionRecieved);
        return;
      }

      case 'loadMoreFilterData': {
        this.LoadMoreColumnFilter(childActionRecieved);
        return;
      }
      case 'ClearAllFilter': {
        this.CallListDataWithFilters(childActionRecieved);
        // this.GetAllHistory(this.ManagementLogTableRequestBody, true);
        break;
      }
    }
  }

  downloadList(data): void {
    this.isLoading = true;
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    // console.log("reqparam" + reqparam);
    reqparam['IsFilterApplied'] = this.userdat.checkFilterListApiCall(data) ? true : false;
    this.accountlistService.getFilterList(reqparam, true, 'ManagementLogList').subscribe(res => {

      if (!res.IsError) {
        this.isLoading = false;
        if (this.envr.envName === 'MOBILEQA') {
          this.downloadListMobile(res.ResponseObject);
        } else {
          this.userdat.Base64Download(res.ResponseObject);
          // window.open(res.ResponseObject.Url, '_blank');
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
      //     "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
      //  } headers: {
      // 
    }
    );
  }
  LoadMoreColumnFilter(data) {
    const headerName = data.filterData.headerName;
    this.filterConfigData[headerName].PageNo = this.filterConfigData[headerName].PageNo + 1;
    this.generateFilterConfigData(data, headerName, true, true);
  }
  GetColumnSearchFilters(data) {
    const headerName = data.filterData.headerName;
    this.ManagementLogTableRequestBody.OdatanextLink = '';
    this.filterConfigData[headerName].PageNo = 1;
    this.filterConfigData[headerName].NextLink = '';
    this.generateFilterConfigData(data, headerName, false, true);
  }
  GetColumnFilters(data) {
    if (data.filterData) {
      if (!data.filterData.isApplyFilter) {
        // debugger
        const headerName = data.filterData.headerName;
        this.filterConfigData[headerName].data = [];
        this.ManagementLogTableRequestBody.OdatanextLink = '';
        this.filterConfigData[headerName].PageNo = 1;
        this.filterConfigData[headerName].NextLink = '';
        this.generateFilterConfigData(data, headerName, false, this.CheckFilterServiceFlag(data, headerName));
      } else {
        if (data.filterData.isApplyFilter && this.userdat.CheckFilterFlag(data)) {
          this.ManagementLogTableRequestBody.OdatanextLink = '';
          this.ManagementLogTableRequestBody.RequestedPageNumber = 1;
          this.CallListDataWithFilters(data);
        } else {
          this.ManagementLogTableRequestBody.OdatanextLink = '';
          this.ManagementLogTableRequestBody.RequestedPageNumber = 1;
          if (data.filterData.globalSearch) {
            // this.SearchTable(data);
            this.CallListDataWithFilters(data);
          } else {
            this.GetAllHistory(this.ManagementLogTableRequestBody, true);
          }

        }

      }
    }
  }

  CallListDataWithFilters(data,isConcat?) {
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    this.accountlistService.getFilterList(reqparam, false, 'FilterManagementLogList').subscribe(res => {
      if (!res.IsError) {
        // debugger
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
              this.ManagementLogTable = this.getTableFilterData(res.ResponseObject);
            }
            else {
              this.ManagementLogTable = [...this.ManagementLogTable, ...this.getTableFilterData(res.ResponseObject)];
            }
          } else {
            this.ManagementLogTable = this.getTableFilterData(res.ResponseObject);
          }
          // this.ManagementLogTable = this.getTableFilterData(res.ResponseObject);
          this.ManagementLogTableRequestBody.OdatanextLink = res.OdatanextLink;
          // debugger
          this.tableTotalCount = res.TotalRecordCount;
        } else {
          this.ManagementLogTable = [{}];
          this.tableTotalCount = 0;
        }
      } else {
        this.ManagementLogTable = [{}];
        this.tableTotalCount = 0;
        this.errorMessage.throwError(res.Message);
      }
    });
  }

  GetAppliedFilterData(data, IsFilterAPI) {
    return {
      'AccountGuid': this.ManagementLogTableRequestBody.Guid ? this.ManagementLogTableRequestBody.Guid : '',
      'SortBy': this.getNumericsOnColumn(data.filterData.sortColumn),
      'IsDesc': (data.filterData.sortColumn !== '') ? !data.filterData.sortOrder : false,
      'PageSize': IsFilterAPI ? this.ManagementLogTableRequestBody.PageSize : 10,
      'RequestedPageNumber': this.ManagementLogTableRequestBody.RequestedPageNumber,
      'SearchText': data.filterData.globalSearch,
      'Meetingtype': this.userdat.pluckParticularKey(data.filterData.filterColumn['Meetingtype'], 'id'),
      'Meetingstage': this.userdat.pluckParticularKey(data.filterData.filterColumn['Meetingstage'], 'id'),
      'CreatedBy': this.userdat.pluckParticularKey(data.filterData.filterColumn['Createdby'], 'id'),
      'StartDate': (data.filterData) ? (data.filterData.filterColumn['Dateofmeeting'][0].filterStartDate !== '') ? this.getLocaleDateFormat(data.filterData.filterColumn['Dateofmeeting'][0].filterStartDate) : '' : '',
      'EndDate': (data.filterData) ? (data.filterData.filterColumn['Dateofmeeting'][0].filterEndDate !== '') ? this.getLocaleDateFormat(data.filterData.filterColumn['Dateofmeeting'][0].filterEndDate) : '' : '',
      // 'MeetingDate': this.userdat.pluckParticularKey(data.filterData.filterColumn['Dateofmeeting'], 'Dateofmeeting'),
      // (data.filterData) ? (data.filterData.filterColumn['Createdon'][0].filterEndDate!=='') ? this.dateModifier(data.filterData.filterColumn['Createdon'][0].filterEndDate):"":""
      // 'StartDate': this.getLocaleDateFormat(data.filterData.filterColumn.Requestdate[0].filterStartDate),
      // 'EndDate': this.getLocaleDateFormat(data.filterData.filterColumn.Requestdate[0].filterEndDate),
      // 'StartTime': this.userdat.pluckParticularKey(data.filterData.filterColumn['Starttime'], 'Starttime'),
      'Duration': this.userdat.pluckParticularKey(data.filterData.filterColumn['Duration'], 'name'),
      'ChairPerson': this.userdat.pluckParticularKey(data.filterData.filterColumn['Chairpersoncoach'], 'id'),
      'ColumnOrder': (data.objectRowData) ? Array.isArray(data.objectRowData) ? this.filterHeaderName(data.objectRowData[1]) :[]:[],

    };
  }

  // Meetingtype: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
  // Meetingstage: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
  // Createdby: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
  // Dateofmeeting: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
  // // Starttime: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
  // // Duration: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
  // Chairpersoncoach: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
  filterHeaderName(data) {
    return data.reduce((acc, d) => {
      if (d.name == "Meetingtype") {
        acc.push("MeetingType");
      }
      else if (d.name == "Dateofmeeting") {
        acc.push("DateofMeeting");
      }
      else if (d.name == "Meetingstage") {
        acc.push("MeetingStage");
      }
      else if (d.name == "Chairpersoncoach") {
        acc.push("ChairPerson");
      }
      else if (d.name == "Createdby") {
        acc.push("CreatedBy");
      }
      else if (d.name == "Starttime") {
        acc.push("StartTime");
      }
      else {
        acc.push(d.name);
    }
      return acc;
    }, []);
  }


  getLocaleDateFormat(dateConvert) {
    const dataModifier = new DateModifier();
    return dataModifier.modifier(dateConvert);
  }
  getNumericsOnColumn(columName) {
    switch (columName) {
      case 'Duration':
        return 10;
      case 'Meetingtype':
        return 12;
      case 'Meetingstage':
        return 13;
      case 'Chairpersoncoach':
        return 14;
      case 'Starttime':
        return 9;
      case 'Createdby':
        return 34;
      case 'Dateofmeeting':
        return 8;

      default:
        return '';
    }
  }



  generateFilterConfigData(data, headerName, isConcat, isServiceCall?) {
    if (isServiceCall) {
      // let headerName = data.filterData.headerName
      const useFulldata = {
        headerName: headerName,
        searchVal: data.filterData.columnSerachKey,
        pageNo: this.filterConfigData[headerName].PageNo,
        pageSize: 10,
        nextLink: this.filterConfigData[headerName].NextLink,
        guid: this.ManagementLogTableRequestBody.Guid,
        statusCode: 0,
        Searchtype: ''
      };
      this.accountlistService.getFilterSwitchListData({ columnFIlterJson: this.GetAppliedFilterData(data, false), useFulldata: useFulldata }, 'managementLog').subscribe(res => {
        this.filterConfigData.isFilterLoading = false;
        this.filterConfigData[headerName] = {
          data: (isConcat) ? this.filterConfigData[headerName]['data'].concat(res.ResponseObject) : res.ResponseObject,

          // data: (isConcat) ? res.ResponseObject.concat(this.filterConfigData[headerName]['data']) : res.ResponseObject,
          recordCount: res.TotalRecordCount,
          NextLink: res.OdatanextLink,
          PageNo: res.CurrentPageNumber
        };

        data.filterData.filterColumn[headerName].forEach(res => {
          const index = this.filterConfigData[headerName].data.findIndex(x => x.id === res.id);
          if (index !== -1) {
            this.filterConfigData[headerName].data[index].isDatafiltered = true;
          }
        });
      });
    } else {
      this.filterConfigData.isFilterLoading = false;
      if (data.filterData.filterColumn[headerName].length > 0) {
        this.filterConfigData[headerName]['data'] = this.RemoveSelectedItems(this.filterConfigData[headerName]['data'], data.filterData.filterColumn[headerName], 'id').concat(data.filterData.filterColumn[headerName]);
      }
    }
  }
  CheckFilterServiceFlag(data, headerName): boolean {
    if (data) {
      if (data.action !== 'columnFilter' && data.filterData.isApplyFilter) {
        return false;
      } else if (data.action === 'columnFilter' && data.filterData.columnSerachKey === '' && this.filterConfigData[headerName]['data'].length <= 0) {
        return true;
      } else if (data.action === 'columnFilter' && data.filterData.columnSerachKey !== '' && !data.filterData.isApplyFilter) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  RemoveSelectedItems(array1, array2, key) {
    // return array1;
    // debugger;
    return array1.filter(item1 =>
      !array2.some(item2 => (item2[key] === item1[key])));
  }
  //---start ------

  GetAllHistory(reqBody, isConcat): void {
    this.isLoading = true;
    this.accountlistService.getManagementLogTableRequest(reqBody)
      .subscribe(async (modificationactive) => {

        if (!modificationactive.IsError) {
          this.isLoading = false;
          if (modificationactive.ResponseObject.length > 0) {
            this.ManagementLogTable = [];
            const ImmutableObject = Object.assign({}, modificationactive);
            const perPage = reqBody.PageSize;
            const start = ((reqBody.RequestedPageNumber - 1) * perPage) + 1;
            let i = start;
            const end = start + perPage - 1;
            // console.log(start + " - " + end);
            modificationactive.ResponseObject.map(res => {
              if (!res.index) {
                res.index = i;
                i = i + 1;
              }
            });
            if (modificationactive.OdatanextLink) {
              this.ManagementLogTableRequestBody.OdatanextLink = modificationactive.OdatanextLink;
            }
            this.ManagementLogTableRequestBody = reqBody;
            // await this.offlineServices.ClearActiveCampaignIndexTableData()
            this.ManagementLogTableRequestBody.OdatanextLink = modificationactive.OdatanextLink;
            if (isConcat) {
              const spliceArray = [];
              this.ManagementLogTable.map((res: any) => {
                if (res.index >= start && res.index <= end) {
                  spliceArray.push(res);
                }
              });
              spliceArray.map(res => {
                this.ManagementLogTable.splice(this.ManagementLogTable.indexOf(res), 1);
              });
              this.ManagementLogTable = this.ManagementLogTable.concat(this.getTableFilterData(modificationactive.ResponseObject));
            } else {
              this.ManagementLogTable = this.getTableFilterData(modificationactive.ResponseObject);

            }
            ImmutableObject.ResponseObject.map(x => x.id = x.Id);
            this.tableTotalCount = modificationactive.TotalRecordCount;
          } else {
            this.isLoading = false;
            this.ManagementLogTable = [{}];
          }

        } else {
          this.isLoading = false;
          this.ManagementLogTable = [{}];
          if (reqBody.RequestedPageNumber > 1)
            this.ManagementLogTableRequestBody.RequestedPageNumber = this.ManagementLogTableRequestBody.RequestedPageNumber - 1;
        }
      },
        error => {
          this.isLoading = false;
        });
  }
  
  // formTimeData(data){
  //   let timeString = data.replace(/^[^:]*([0-2]\d:[0-5]\d).*$/, "$1");
  //   let H = +timeString.substr(0, 2);
  //   let h = (H % 12) || 12;
  //   let ampm = H < 12 ? " AM" : " PM";
  //   timeString = h + timeString.substr(2, 3) + ampm;
  //   return timeString;
  // }
  getTableFilterData(tableData): Array<any> {
    if (tableData) {
      if (tableData.length > 0) {
        return tableData.map((managementlog => {
          // console.log(managementlog);
          // let requiredDate = new Date(managementlog.StartTime);
          // let startTime = this.formatAMPM(requiredDate);
          // let f = new Date(managementlog.StartTime);
          // let d = new Date(f + 'UTC');
          //let startTime = this.formTimeData(managementlog.StartTime);
          
          return {
            id: managementlog.SysGuid,
            Dateofmeeting: this.datepipe.transform(managementlog.MeetingDate, 'd-MMM-y') || '',
            Starttime: this.datepipe.transform(managementlog.StartTime, 'shortTime') || '',
            Duration: managementlog.Duration ? (managementlog.Duration === 1 ? managementlog.Duration + ' Min' : managementlog.Duration + ' Mins') : '0',
            Timezone: (managementlog.TimeZone && managementlog.TimeZone.Value) ? managementlog.TimeZone.Value : '',
            Meetingtype: (managementlog.Meeting.MeetingType && managementlog.Meeting.MeetingType.Value) ? managementlog.Meeting.MeetingType.Value : '',
            Meetingstage: (managementlog.Meeting && managementlog.Meeting.Stage.Value) ? managementlog.Meeting.Stage.Value : '',
            Chairpersoncoach: (managementlog.ReviewChairpersonCoach && managementlog.ReviewChairpersonCoach.FullName) ? managementlog.ReviewChairpersonCoach.FullName : '',
            Mom: (managementlog.Meeting && managementlog.Meeting.ManagementMoM) ? managementlog.Meeting.ManagementMoM : '',
            CommentandConclusion: managementlog.CommentandConclusion,
            index: managementlog.index,
            Participants: managementlog.Participants,
            NonTraceUsers: managementlog.NonTraceUsers,
            Meeting: managementlog.Meeting,
            TimeZone: managementlog.TimeZone,
            EventProfileLink: managementlog.ParticipantsLink,
            MomAttachment: managementlog.MomAttachment,
            ReviewChairpersonCoach: managementlog.ReviewChairpersonCoach,
            Attachments: managementlog.Attachments,
            editBtnVisibility: !managementlog.IsEdit,
            deleteBtnVisibility: !managementlog.IsDelete,
            Createdby: (managementlog.CreatedBy && managementlog.CreatedBy.FullName) ? managementlog.CreatedBy.FullName : ''
          };
        }));
      } else {
        return [{}];
      }
    } else {
      return [{}];
    }
  }
  // addNewEntry(){
  //    this.router.navigate(['accounts/managementlogtable/managementlogCreate']);
  // }
  showEditButton(data) {
    if (data) {
      if (data === 'Cancelled' || data === 'Completed') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}

//--End ---------------
