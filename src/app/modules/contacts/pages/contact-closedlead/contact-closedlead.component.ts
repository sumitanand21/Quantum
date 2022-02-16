import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { ErrorMessage, ContactService, DataCommunicationService, ContactleadService } from '@app/core';
import { MatSnackBar } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { getContactDetailsById } from '@app/core/state/selectors/contact-list.selector';
import {contactclosedleadheader } from '@app/core/services/offline/contactclosedlead.service';
import { ClearMyopenlead } from '@app/core/state/actions/leads.action';
import { environment as env } from '@env/environment';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;
@Component({
  selector: 'app-contact-closedlead',
  templateUrl: './contact-closedlead.component.html',
  styleUrls: ['./contact-closedlead.component.scss']
})
export class ContactClosedleadComponent implements OnInit {
  ContactClosedLeadRequestbody = {
    "Guid": "",
    "StatusCode": 7,
    "PageSize": 50,
    "RequestedPageNumber": 1,
    "OdatanextLink": ""
  }

  contactClosedLeadTable: any = [];
  isLoading: boolean = false;
  ContactEditID: any;
  userguid: any;
  imageSrc1: string;
  SingleContactname: any;
  tableTotalCount: number;

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

  constructor(
    private router: Router,
    private encrDecrService: EncrDecrService,
    public errorMessage: ErrorMessage,
    private contactService: ContactService,
    public matSnackBar: MatSnackBar,
    public store: Store<AppState>,
    public userdat: DataCommunicationService,
    private contactlead: ContactleadService,
    public envr : EnvService

  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.userguid = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
    this.ContactEditID = JSON.parse(localStorage.getItem("contactEditId"));
    this.ContactClosedLeadRequestbody.Guid = this.ContactEditID
    this.getAllContactClosedLeadData(this.ContactClosedLeadRequestbody, true);
    let contactId = JSON.parse(localStorage.getItem('contactEditId'));
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
  }

  performTableChildAction(childActionRecieved) {
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {
      case 'search': {
        this.ContactClosedLeadRequestbody.RequestedPageNumber = 0
        this.SearchTable(actionRequired, this.ContactClosedLeadRequestbody.RequestedPageNumber);
        break;
      }
      case 'pagination': {
        this.TablePagination(childActionRecieved);
        break;
      }
      case 'tabNavigation': {
          this.TabNavigation(childActionRecieved.objectRowData[0])
          break;
        }
      case 'Name': {
        sessionStorage.setItem('LeadId', JSON.stringify(this.encrDecrService.set('EncryptionEncryptionEncryptionEn', childActionRecieved.objectRowData[0].ID, 'DecryptionDecrip')));
        var leadName = childActionRecieved.objectRowData[0].Name
        console.log("closed lead", leadName)
        sessionStorage.setItem('leadName', JSON.stringify(leadName));
        this.router.navigate(['/leads/leadDetails'])
        sessionStorage.setItem('navigationfromlist', JSON.stringify('9'));
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
        this.ContactClosedLeadRequestbody.OdatanextLink = ''
        this.ContactClosedLeadRequestbody.RequestedPageNumber = 1
        this.CallListDataWithFilters(childActionRecieved);
        break;
      }
      case 'ClearAllFilter': {
        this.clearallFilter();
        break;
      }
      case 'DownloadCSV': {
        this.downloadList(childActionRecieved);
        break;
      }
    }
  }

  clearallFilter() {
    this.getAllContactClosedLeadData(this.ContactClosedLeadRequestbody, false)
  }

  getNewTableData(event) {
    if (event.action == 'pagination') {
      if (this.ContactClosedLeadRequestbody.PageSize == event.itemsPerPage) {
        this.ContactClosedLeadRequestbody.PageSize = event.itemsPerPage;
        this.ContactClosedLeadRequestbody.RequestedPageNumber = event.currentPage;
        this.getAllContactClosedLeadData(event, true);
      }
      else {
        this.ContactClosedLeadRequestbody.PageSize = event.itemsPerPage;
        this.ContactClosedLeadRequestbody.RequestedPageNumber = event.currentPage;
        this.getAllContactClosedLeadData(event, false);
      }
    }
  }

  downloadList(data): void {
    this.isLoading = true
      let useFulldata = {
        LeadsReqBody: this.ContactClosedLeadRequestbody,
        fieldheader: contactclosedleadheader,
        nextLink: this.ContactClosedLeadRequestbody.OdatanextLink,
        pageNo: this.ContactClosedLeadRequestbody.RequestedPageNumber,
        userGuid: this.userguid,
        ContactParentGuid: this.ContactClosedLeadRequestbody.Guid,
        pageSize: this.ContactClosedLeadRequestbody.PageSize
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

  GetColumnFilters(data) {
    if (data.filterData) {
      if (!data.filterData.isApplyFilter) {
        debugger
        let headerName = data.filterData.headerName
        this.filterConfigData[headerName].data = [];
        this.filterConfigData[headerName].PageNo = 1
        this.generateFilterConfigData(data, headerName, false, this.CheckFilterServiceFlag(data, headerName))
      } else {
        if (data.filterData.isApplyFilter && this.userdat.CheckFilterFlag(data)) {
          this.ContactClosedLeadRequestbody.OdatanextLink = ''
          this.ContactClosedLeadRequestbody.RequestedPageNumber = 1
          this.CallListDataWithFilters(data)
        } else if (data.filterData.isApplyFilter && data.filterData.globalSearch != "") {
          this.CallListDataWithFilters(data)
        } else {
          this.store.dispatch(new ClearMyopenlead())
          this.ContactClosedLeadRequestbody.OdatanextLink = ''
          this.ContactClosedLeadRequestbody.RequestedPageNumber = 1
          this.getAllContactClosedLeadData(this.ContactClosedLeadRequestbody, false)
        }
      }
    }
  }

  GetColumnSearchFilters(data) {
    let headerName = data.filterData.headerName
    this.ContactClosedLeadRequestbody.OdatanextLink = ''
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
        fieldheader: contactclosedleadheader,
        ContactParentGuid: this.ContactClosedLeadRequestbody.Guid,
        LeadsReqBody: this.ContactClosedLeadRequestbody,
        userGuid: this.userguid
      }
      this.contactlead.getActionListConfigData({ ...data, useFulldata: useFulldata, ContactParentId: this.ContactClosedLeadRequestbody.Guid, RequestedPageNumber: this.filterConfigData[headerName].PageNo, PageSize: 10, AllContactsRequestbody: this.ContactClosedLeadRequestbody, contactLeadStatusCode: 7 }).subscribe(res => {
        this.filterConfigData.isFilterLoading = false;
        if (!res.IsError) {
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
      LeadsReqBody: this.ContactClosedLeadRequestbody,
      fieldheader: contactclosedleadheader,
      nextLink: this.ContactClosedLeadRequestbody.OdatanextLink,
      pageNo: this.ContactClosedLeadRequestbody.RequestedPageNumber,
      userGuid: this.userguid,
      ContactParentGuid: this.ContactClosedLeadRequestbody.Guid,
      pageSize: this.ContactClosedLeadRequestbody.PageSize
    }
    let reqparam = this.contactlead.GetAppliedFilterData({ ...data, useFulldata: useFulldata })
    this.contactlead.getAppliedFilterLeadData(reqparam).subscribe(res => {
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
          this.contactClosedLeadTable = this.getTableFilterData(res.ResponseObject)
          this.ContactClosedLeadRequestbody.OdatanextLink = res.OdatanextLink
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.contactClosedLeadTable = [{}]
          this.tableTotalCount = 0
        }
      } else {
        this.contactClosedLeadTable = [{}]
        this.tableTotalCount = 0
        this.errorMessage.throwError(res.Message)
      }
    });
  }

  RemoveSelectedItems(array1, array2, key) {
    return array1.filter(item1 =>
      !array2.some(item2 => (item2[key] === item1[key])))
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

  SearchTable(data, reqpagenumber): void {
    console.log('contact search data-->', data)
    this.ContactClosedLeadRequestbody.RequestedPageNumber = 1
    this.ContactClosedLeadRequestbody.OdatanextLink = ""
    if (data != "") {
      if (data.objectRowData != "" && data.objectRowData != undefined) {
        let useFulldata = {
          LeadsReqBody: this.ContactClosedLeadRequestbody,
          fieldheader: contactclosedleadheader,
          nextLink: this.ContactClosedLeadRequestbody.OdatanextLink,
          pageNo: this.ContactClosedLeadRequestbody.RequestedPageNumber,
          userGuid: this.userguid,
          ContactParentGuid: this.ContactClosedLeadRequestbody.Guid,
          pageSize: this.ContactClosedLeadRequestbody.PageSize
        }
        this.isLoading = true;
        let reqparam = this.contactlead.GetAppliedFilterData({ ...data, useFulldata: useFulldata })
        this.contactlead.getAppliedFilterLeadData(reqparam).subscribe(res => {
          if (!res.IsError) {
            this.isLoading = false;
            if (res.ResponseObject.length > 0) {
              let i = 1;
              res.ResponseObject.map(res => {
                res.index = i;
                i = i + 1;
              })
              this.contactClosedLeadTable = this.getTableFilterData(res.ResponseObject)
              this.ContactClosedLeadRequestbody.OdatanextLink = res.OdatanextLink
              this.tableTotalCount = res.TotalRecordCount
            }
            else {
              this.contactClosedLeadTable = [{}]
              this.tableTotalCount = 0
            }
          } else {
            this.isLoading = false;
            this.contactClosedLeadTable = [{}]
          }
        }, error => {
          this.isLoading = false;
          this.contactClosedLeadTable = [{}]
        })
      } else {
        this.isLoading = false;
        this.getAllContactClosedLeadData(this.ContactClosedLeadRequestbody, false);
      }
    }
  }

  TablePagination(data) {
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

  getAllContactClosedLeadData(reqBody, isConcat) {
    debugger
    this.isLoading = true;
      let useFulldata = {
        LeadsReqBody: this.ContactClosedLeadRequestbody,
        fieldheader: contactclosedleadheader,
        nextLink: this.ContactClosedLeadRequestbody.OdatanextLink,
        pageNo: this.ContactClosedLeadRequestbody.RequestedPageNumber,
        userGuid: this.userguid,
        ContactParentGuid: this.ContactClosedLeadRequestbody.Guid,
        pageSize: this.ContactClosedLeadRequestbody.PageSize
      }
      let reqparam = this.contactlead.GetAppliedFilterData({ ...reqBody, useFulldata: useFulldata })
      this.contactlead.getAppliedFilterLeadData(reqparam).subscribe(resData => {
      if (!resData.IsError) {
        this.isLoading = false;
        if (resData.ResponseObject.length > 0) {
          const ImmutableObject = Object.assign({}, resData)
          const perPage = this.ContactClosedLeadRequestbody.PageSize;
          const start = ((this.ContactClosedLeadRequestbody.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;
          console.log(start + " - " + end);
          resData.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          })
          if (resData.OdatanextLink) {
            this.ContactClosedLeadRequestbody.OdatanextLink = resData.OdatanextLink
          }
          if (isConcat) {
            let spliceArray = [];
            this.contactClosedLeadTable.map((res) => {
              if (res.index >= start && res.index <= end) {
                spliceArray.push(res);
              }
            });
            spliceArray.map(res => {
              this.contactClosedLeadTable.splice(this.contactClosedLeadTable.indexOf(res), 1);
            })
            this.contactClosedLeadTable = this.contactClosedLeadTable.concat(this.getTableFilterData(resData.ResponseObject))
            console.log("contact close Lead Table", this.contactClosedLeadTable);
          } else {
            this.contactClosedLeadTable = this.getTableFilterData(resData.ResponseObject)
            console.log("contact close Lead Table", this.contactClosedLeadTable);
          }
          this.tableTotalCount = resData.TotalRecordCount
          console.log("table Total Count", this.tableTotalCount)
        } else {
          this.tableTotalCount = 0
          this.contactClosedLeadTable = [{}]
        }
      } else {
        this.isLoading = false;
        this.OnError(resData.Message);
        if (reqBody.RequestedPageNumber > 1)
          this.ContactClosedLeadRequestbody.RequestedPageNumber = this.ContactClosedLeadRequestbody.RequestedPageNumber - 1
      }
    },
      error => {
        this.isLoading = false;
      });
  }

  getTableFilterData(tabledata): Array<any> {
    return tabledata.map(leads => {
      return {
        Name: (leads.Title) ? (leads.Title).trim() : "NA",
        ID: leads.LeadGuid,
        owner: (leads.Owner) ? (leads.Owner.FullName) ? leads.Owner.FullName : "NA" : "NA",
        created: (leads.CreatedOn) ? leads.CreatedOn : "NA",
        status: (leads.Status) ? (leads.Status.status) ? leads.Status.status : "NA" : "NA",
        account: (leads.Account) ? (leads.Account.Name) ? leads.Account.Name : "NA" : "NA",
        source: (leads.Source) ? (leads.Source.Name) ? leads.Source.Name : "NA" : "NA",
        statusclass: (leads.Status) ? (leads.Status.status == "Disqualified") ? "disqualified" : "qualified" : "",
        activitygroup: leads.ActivityGroups ? leads.ActivityGroups.length > 0 ? this.activityGroupFiter(leads.ActivityGroups).length > 0 ? this.activityGroupFiter(leads.ActivityGroups) : ["NA"] : ["NA"] : ["NA"],
        index: leads.index,
        statusText: (leads.IsNurture) ? "Nurtured" : "",
        Reason: (leads.Reason) ? (leads.Reason) : {},
        accountId: (leads.AccountTypeId) ? leads.AccountTypeId : "",
        accountType: (leads.AccountType) ? leads.AccountType : ""
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

  OnError(message) {
    let action;
    this.matSnackBar.open(message, action, {
      duration: 4000
    });
  }

}
