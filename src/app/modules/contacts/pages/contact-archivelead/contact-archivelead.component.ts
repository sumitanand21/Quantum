import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar, } from '@angular/material';
import { ContactService, ErrorMessage, ContactleadService } from '@app/core';
import { DataCommunicationService } from '@app/core/services/global.service';
import { contactarchiveleadService, contactarchiveleadheader } from '@app/core/services/contactarchivelead.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { getContactDetailsById } from '@app/core/state/selectors/contact-list.selector';
import { ClearArchivedLeadState } from '@app/core/state/actions/leads.action';
import { environment as env } from '@env/environment';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;
@Component({
  selector: 'app-contact-archivelead',
  templateUrl: './contact-archivelead.component.html',
  styleUrls: ['./contact-archivelead.component.scss']
})
export class ContactArchiveleadComponent implements OnInit {
  AllArchievedLeadRequestbody = {
    "Guid": "",
    "StatusCode": 184450013,
    "PageSize": 50,
    "RequestedPageNumber": 1,
    "OdatanextLink": ""
  }
  key: string;
  headerData;
  contactarchiveleadTable = [];
  isLoading: boolean = false;
  ContactEditID: any;
  SingleContactname: any;
  tableTotalCount: number;
  userguid: any;
  imageSrc1: string;
  filterConfigData = {
    Name: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    owner: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    created: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    account: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    activitygroup: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    source: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    status: { data: [], PageNo: 1, recordCount: 0, NextLink: '' },
    isFilterLoading: false
  };

  constructor(private router: Router,
    public userdat: DataCommunicationService,
    public dialog: MatDialog,
    private contactarchivelead: contactarchiveleadService,
    private contactService: ContactService,
    private contactlead: ContactleadService,
    private EncrDecr: EncrDecrService,
    public errorMessage: ErrorMessage,
    public matSnackBar: MatSnackBar,
    public store: Store<AppState>,public envr : EnvService) {
    this.AllArchievedLeadRequestbody.RequestedPageNumber = 0
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.userguid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
    this.ContactEditID = JSON.parse(localStorage.getItem("contactEditId"));
    this.AllArchievedLeadRequestbody.Guid = this.ContactEditID
    this.AllArchievedLeadRequestbody.RequestedPageNumber++
    this.getAllContactArchievedLeadData(this.AllArchievedLeadRequestbody, true);
    let contactId = JSON.parse(localStorage.getItem('contactEditId'))
    this.store.pipe(select(getContactDetailsById(contactId))).subscribe(res => {
      if (res) {
        this.SingleContactname = res.FName + ' ' + res.LName
      }
      // else{
      //   this.contactService.getContactdetails(this.ContactEditID).subscribe(res => {
      //     if (res.IsError == false) {
      //       if (res.ResponseObject.ProfileImage) {
      //         this.imageSrc1 = (res.ResponseObject.ProfileImage)
      //       } else {
      //         this.imageSrc1 = null
      //       }
      //     } else {
      //       this.errorMessage.throwError(res.Message);
      //     }
      //   })
      // }
    });

    this.contactService.getContactdetails(this.ContactEditID).subscribe(res => {
      if (res.IsError == false) {
        console.log('Details-->', res)
        if (res.ResponseObject.ProfileImage) {
          this.imageSrc1 = (res.ResponseObject.ProfileImage)
        } else {
          this.imageSrc1 = null
        }
      } else {
        this.errorMessage.throwError(res.Message);
      }
    });


    // this.contactarchivelead.getParentHeaderData().subscribe(x => {
    //   this.headerData = x;
    //   this.userdat.cachedArray = x;
    // });
  }
  OnError(message) {
    let action;
    this.matSnackBar.open(message, action, {
      duration: 4000
    });
  }

  getAllContactArchievedLeadData(reqBody, isConcat) {
    this.isLoading = true;
    let useFulldata = {
      LeadsReqBody: this.AllArchievedLeadRequestbody,
      fieldheader: contactarchiveleadheader,
      nextLink: this.AllArchievedLeadRequestbody.OdatanextLink,
      pageNo: this.AllArchievedLeadRequestbody.RequestedPageNumber,
      userGuid: this.userguid,
      ContactParentGuid: this.AllArchievedLeadRequestbody.Guid,
      pageSize: this.AllArchievedLeadRequestbody.PageSize
    }
    let reqparam = this.contactlead.GetAppliedFilterData({ ...reqBody, useFulldata: useFulldata })
    this.contactlead.getAppliedFilterLeadData(reqparam).subscribe(resData => {
      if (!resData.IsError) {
        this.isLoading = false;
        if (resData.ResponseObject.length > 0) {
          const ImmutableObject = Object.assign({}, resData)
          const perPage = this.AllArchievedLeadRequestbody.PageSize;
          const start = ((this.AllArchievedLeadRequestbody.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;
          resData.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          })
          if (resData.OdatanextLink) {
            this.AllArchievedLeadRequestbody.OdatanextLink = resData.OdatanextLink
          }
          if (isConcat) {
            let spliceArray = [];
            this.contactarchiveleadTable.map((res) => {
              if (res.index >= start && res.index <= end) {
                spliceArray.push(res);
              }
            });
            spliceArray.map(res => {
              this.contactarchiveleadTable.splice(this.contactarchiveleadTable.indexOf(res), 1);
            })
            this.contactarchiveleadTable = this.contactarchiveleadTable.concat(this.getTableFilterData(resData.ResponseObject))
          } else {
            this.contactarchiveleadTable = this.getTableFilterData(resData.ResponseObject)
          }
          this.tableTotalCount = resData.TotalRecordCount
        } else {
          this.tableTotalCount = 0
          this.contactarchiveleadTable = [{}]
        }
      } else {
        this.isLoading = false;
        this.OnError(resData.Message);
        if (reqBody.RequestedPageNumber > 1)
          this.AllArchievedLeadRequestbody.RequestedPageNumber = this.AllArchievedLeadRequestbody.RequestedPageNumber - 1
      }
    },
      error => {
        this.isLoading = false;
      });
  }

  getTableFilterData(tableData): Array<any> {
    if (tableData) {
      if (tableData.length > 0) {
        return tableData.map(archievedLead => {
          return {
            id: "NA",
            Name: (archievedLead.Title !== undefined) ? archievedLead.Title : "NA",
            ida: archievedLead.LeadGuid,
            owner: (archievedLead.Owner.FullName !== undefined) ? archievedLead.Owner.FullName : "NA",
            created: (archievedLead.CreatedOn !== undefined) ? archievedLead.CreatedOn : "NA",
            account: (archievedLead.Account.Name !== undefined) ? archievedLead.Account.Name : "NA",
            activitygroup: archievedLead.ActivityGroups ? archievedLead.ActivityGroups.length > 0 ? this.ActivityGroupFiter(archievedLead.ActivityGroups).length > 0 ? this.ActivityGroupFiter(archievedLead.ActivityGroups) : ["NA"] : ["NA"] : ["NA"],
            source: (archievedLead.Source.Name !== undefined) ? archievedLead.Source.Name : "NA",
            status: (archievedLead.Status.status !== undefined) ? archievedLead.Status.status : "NA",
            index: archievedLead.index
          };
        });
      } else {
        return []
      }
    } else {
      return []
    }
  }

  ActivityGroupFiter(data): Array<any> {
    let Activitygroup = []
    data.map(x => {
      if (x.Name) {
        Activitygroup.push(x.Name)
      }
    })
    return Activitygroup
  }

  TablePagination(data) {
  }

  performTableChildAction(childActionRecieved): Observable<any> {
    console.log('childActionReceived---->', childActionRecieved)
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {
      case 'search': {
        this.AllArchievedLeadRequestbody.RequestedPageNumber = 0
        this.SearchTable(actionRequired, this.AllArchievedLeadRequestbody.RequestedPageNumber);
        return;
      }
      case 'tabNavigation':
        {
          this.TabNavigation(childActionRecieved.objectRowData[0])
          return
        }
      case 'Name':
        {
          console.log("Archieved lead name", childActionRecieved.objectRowData[0].ida)
          sessionStorage.setItem('LeadId', JSON.stringify(this.EncrDecr.set('EncryptionEncryptionEncryptionEn', childActionRecieved.objectRowData[0].ida, 'DecryptionDecrip')));
          this.router.navigate(['/leads/leadDetails/leadDetailsInfo'])
          sessionStorage.setItem('navigationfromlist', JSON.stringify('8'));
          return
        }
      case 'pagination': {
        this.TablePagination(childActionRecieved);
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
      case 'sortHeaderBy': {
        this.AllArchievedLeadRequestbody.OdatanextLink = ''
        this.AllArchievedLeadRequestbody.RequestedPageNumber = 1
        this.CallListDataWithFilters(childActionRecieved);
        return
      }
      case 'ClearAllFilter': {
        this.clearallFilter();
        return;
      }
      case 'DownloadCSV': {
        console.log("downloafing")
        this.downloadList(childActionRecieved);
        return
      }
    }
  }

  clearallFilter(){
    this.getAllContactArchievedLeadData(this.AllArchievedLeadRequestbody, false)
  }

  downloadList(data): void {
    this.isLoading = true
    let useFulldata = {
      LeadsReqBody: this.AllArchievedLeadRequestbody,
      fieldheader: contactarchiveleadheader,
      nextLink: this.AllArchievedLeadRequestbody.OdatanextLink,
      pageNo: this.AllArchievedLeadRequestbody.RequestedPageNumber,
      userGuid: this.userguid,
      ContactParentGuid: this.AllArchievedLeadRequestbody.Guid,
      pageSize: this.AllArchievedLeadRequestbody.PageSize
    }
    let reqparam = this.contactlead.GetAppliedFilterData({ ...data, useFulldata: useFulldata })
    this.contactlead.downloadLeadList(reqparam).subscribe(res => {
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
    });
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
      if (this.AllArchievedLeadRequestbody.PageSize == event.itemsPerPage) {
        this.AllArchievedLeadRequestbody.PageSize = event.itemsPerPage;
        this.AllArchievedLeadRequestbody.RequestedPageNumber = event.currentPage;
        this.getAllContactArchievedLeadData(event, true);
      }
      else {
        this.AllArchievedLeadRequestbody.PageSize = event.itemsPerPage;
        this.AllArchievedLeadRequestbody.RequestedPageNumber = event.currentPage;
        this.getAllContactArchievedLeadData(event, false);
      }
    }
  }

  SearchTable(data, reqpagenumber): void {
    console.log('contact search data-->', data)
    this.AllArchievedLeadRequestbody.RequestedPageNumber = 1
    this.AllArchievedLeadRequestbody.OdatanextLink = ""
    if (data != "") {
      if (data.objectRowData != "" && data.objectRowData != undefined) {
          let useFulldata = {
            LeadsReqBody: this.AllArchievedLeadRequestbody,
            fieldheader: contactarchiveleadheader,
            nextLink: this.AllArchievedLeadRequestbody.OdatanextLink,
            pageNo: this.AllArchievedLeadRequestbody.RequestedPageNumber,
            userGuid: this.userguid,
            ContactParentGuid: this.AllArchievedLeadRequestbody.Guid,
            pageSize: this.AllArchievedLeadRequestbody.PageSize
          }
          this.isLoading = true;
          let reqparam = this.contactlead.GetAppliedFilterData({ ...data, useFulldata: useFulldata })
          this.contactlead.getAppliedFilterLeadData(reqparam).subscribe(res => {
          this.isLoading = false;
          if (!res.IsError) {
            if (res.ResponseObject.length > 0) {
              let i = 1;
              res.ResponseObject.map(res => {
                res.index = i;
                i = i + 1;
              })
              this.contactarchiveleadTable = this.getTableFilterData(res.ResponseObject)
              this.AllArchievedLeadRequestbody.OdatanextLink = res.OdatanextLink
              this.tableTotalCount = res.TotalRecordCount
            }
            else {
              this.contactarchiveleadTable = [{}]
              this.tableTotalCount = 0
            }
          }
        })
      } else {
        this.isLoading = false;
        this.getAllContactArchievedLeadData(this.AllArchievedLeadRequestbody, false);
      }
    }
  }

  GetColumnFilters(data) {
    if (data.filterData) {
      if (!data.filterData.isApplyFilter) {
        let headerName = data.filterData.headerName
        this.filterConfigData[headerName].data = [];
        this.filterConfigData[headerName].PageNo = 1
        this.generateFilterConfigData(data, headerName, false, this.CheckFilterServiceFlag(data, headerName))
      } else {
        if (data.filterData.isApplyFilter && this.userdat.CheckFilterFlag(data)) {
          this.AllArchievedLeadRequestbody.OdatanextLink = ''
          this.AllArchievedLeadRequestbody.RequestedPageNumber = 1
          this.CallListDataWithFilters(data)
        }else if (data.filterData.isApplyFilter && data.filterData.globalSearch != ""){
          this.CallListDataWithFilters(data)
        } else {
          this.store.dispatch(new ClearArchivedLeadState())
          this.AllArchievedLeadRequestbody.OdatanextLink = ''
          this.AllArchievedLeadRequestbody.RequestedPageNumber = 1
          this.getAllContactArchievedLeadData(this.AllArchievedLeadRequestbody, false)
        }
      }
    }
  }

  GetColumnSearchFilters(data) {
    let headerName = data.filterData.headerName
    this.AllArchievedLeadRequestbody.OdatanextLink = ''
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
          pageNo: this.filterConfigData[headerName].PageNo,
          pageSize: 10,
          nextLink: this.filterConfigData[headerName].NextLink,
          fieldheader: contactarchiveleadheader,
          ContactParentGuid: this.AllArchievedLeadRequestbody.Guid,
          LeadsReqBody: this.AllArchievedLeadRequestbody,
          userGuid: this.userguid
        }
      this.contactlead.getActionListConfigData({ ...data, useFulldata: useFulldata,  ContactParentId:this.AllArchievedLeadRequestbody.Guid, RequestedPageNumber:this.filterConfigData[headerName].PageNo, PageSize:10, AllContactsRequestbody: this.AllArchievedLeadRequestbody, contactLeadStatusCode:184450013  }).subscribe(res => {
        this.filterConfigData.isFilterLoading = false;
        if(!res.IsError) {
        this.filterConfigData[headerName] = {
          data: (isConcat) ? this.filterConfigData[headerName]["data"].concat(res.ResponseObject) : res.ResponseObject,
          recordCount: res.TotalRecordCount,
          NextLink: res.OdatanextLink,
          PageNo: res.CurrentPageNumber
        }
       //display the selected value in filter list
       if (data.filterData.headerName != 'created')  {  
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
        this.filterConfigData[headerName]["data"] = this.RemoveSelectedItems(this.filterConfigData[headerName]["data"], data.filterData.filterColumn[headerName], 'id').concat(data.filterData.filterColumn[headerName])
      }
    }
  }

  CallListDataWithFilters(data) {
    let useFulldata = {
      LeadsReqBody: this.AllArchievedLeadRequestbody,
      fieldheader: contactarchiveleadheader,
      nextLink: this.AllArchievedLeadRequestbody.OdatanextLink,
      pageNo: this.AllArchievedLeadRequestbody.RequestedPageNumber,
      userGuid: this.userguid,
      ContactParentGuid: this.AllArchievedLeadRequestbody.Guid,
      pageSize: this.AllArchievedLeadRequestbody.PageSize
    }
    let reqparam = this.contactlead.GetAppliedFilterData({ ...data, useFulldata: useFulldata })
    this.contactlead.getAppliedFilterLeadData(reqparam).subscribe(res => {
      console.log(res)
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
          });
          this.contactarchiveleadTable = this.getTableFilterData(res.ResponseObject)
          this.AllArchievedLeadRequestbody.OdatanextLink = res.OdatanextLink
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.contactarchiveleadTable = [{}]
          this.tableTotalCount = 0
        }
      } else {
        this.contactarchiveleadTable = [{}]
        this.tableTotalCount = 0
        this.errorMessage.throwError(res.Message)
      }
    });
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

  TabNavigation(item) {
    console.log("Table nevigation for Activity")
    console.log(item)
    switch (item.index) {
      case 0:
        this.router.navigate(['/contacts/contactlead']);
        return
      case 1:
        this.router.navigate(['/contacts/contactopenlead']);
        return
      case 2:
        this.router.navigate(['/contacts/contactarchivelead']);
        return
      case 3:
        this.router.navigate(['/contacts/contactclosedlead']);
        return
    }
  }

}
