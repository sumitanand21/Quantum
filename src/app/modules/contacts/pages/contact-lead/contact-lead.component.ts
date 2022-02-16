import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ContactleadService, ContactService, ErrorMessage, contactLeadheader } from '@app/core';
import { DataCommunicationService } from '@app/core/services/global.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { select, Store } from '@ngrx/store';
import { getContactDetailsById } from '@app/core/state/selectors/contact-list.selector';
import { AppState } from '@app/core/state';
import { ClearMyopenlead } from '@app/core/state/actions/leads.action';
import { environment as env } from '@env/environment';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;
@Component({
  selector: 'app-contact-lead',
  templateUrl: './contact-lead.component.html',
  styleUrls: ['./contact-lead.component.scss']
})
export class ContactLeadComponent implements OnInit {
  contactLeadTable = [];
  AllMyOpenLeadRequestbody = {
    "Guid": "",
    "StatusCode": 0,
    "PageSize": 50,
    "RequestedPageNumber": 1,
    "OdatanextLink": ""
  }
  key: string;
  headerData;
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
    private contactlead: ContactleadService,
    private contactService: ContactService,
    private EncrDecr: EncrDecrService,
    public errorMessage: ErrorMessage,
    public matSnackBar: MatSnackBar,
    private encrDecrService: EncrDecrService,
    public store: Store<AppState>,
    public envr : EnvService
  ) {
    this.AllMyOpenLeadRequestbody.RequestedPageNumber = 0
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.userguid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
    this.ContactEditID = JSON.parse(localStorage.getItem("contactEditId"));
    this.AllMyOpenLeadRequestbody.Guid = this.ContactEditID
    this.AllMyOpenLeadRequestbody.RequestedPageNumber++
    this.getAllMyOpenLeadData(this.AllMyOpenLeadRequestbody, true);
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
      //         console.log("image",this.imageSrc1)
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

    // this.contactlead.getParentHeaderData().subscribe(x => {
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

  getAllMyOpenLeadData(reqBody, isConcat) {
   
    let useFulldata = {
      LeadsReqBody: this.AllMyOpenLeadRequestbody,
      fieldheader: contactLeadheader,
      nextLink: this.AllMyOpenLeadRequestbody.OdatanextLink,
      pageNo: this.AllMyOpenLeadRequestbody.RequestedPageNumber,
      userGuid: this.userguid,
      ContactParentGuid: this.AllMyOpenLeadRequestbody.Guid,
      pageSize: this.AllMyOpenLeadRequestbody.PageSize
    }
    let reqparam = this.contactlead.GetAppliedFilterData({ ...reqBody, useFulldata: useFulldata })
    this.contactlead.getAppliedFilterLeadData(reqparam).subscribe(resData => {
      if (!resData.IsError) {
        this.isLoading = false;
        if (resData.ResponseObject.length > 0) {
          const ImmutableObject = Object.assign({}, resData)
          const perPage = reqBody.PageSize;
          const start = ((reqBody.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;
          resData.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          })
          if (resData.OdatanextLink) {
            this.AllMyOpenLeadRequestbody.OdatanextLink = resData.OdatanextLink
          }
          if (isConcat) {
            let spliceArray = [];
            this.contactLeadTable.map((res) => {
              if (res.index >= start && res.index <= end) {
                spliceArray.push(res);
              }
            });
            spliceArray.map(res => {
              this.contactLeadTable.splice(this.contactLeadTable.indexOf(res), 1);
            })
            this.contactLeadTable = this.contactLeadTable.concat(this.getTableFilterData(resData.ResponseObject))
          } else {
            this.contactLeadTable = this.getTableFilterData(resData.ResponseObject)
          }
          this.tableTotalCount = resData.TotalRecordCount
        } else {
          this.tableTotalCount = 0
          this.contactLeadTable = [{}]
        }
      } else {
        this.isLoading = false;
        this.OnError(resData.Message);
        if (reqBody.RequestedPageNumber > 1)
          this.AllMyOpenLeadRequestbody.RequestedPageNumber = this.AllMyOpenLeadRequestbody.RequestedPageNumber - 1
      }
    },
      error => {
        this.isLoading = false;
      });
  }

  getTableFilterData(tableData): Array<any> {
    if (tableData) {
      console.log("Activities list table data", tableData);
      if (tableData.length > 0) {
        console.log("contacts table data", tableData);
        return tableData.map(myOpenLead => {
          return {
            id: "NA",
            Name: (myOpenLead.Title !== undefined) ? myOpenLead.Title : "NA",
            ida: (myOpenLead.LeadGuid !== undefined) ? myOpenLead.LeadGuid : "NA",
            owner: (myOpenLead.Owner.FullName !== undefined) ? myOpenLead.Owner.FullName : "NA",
            created: (myOpenLead.CreatedOn !== undefined) ? myOpenLead.CreatedOn : "NA",
            account: (myOpenLead.Account.Name !== undefined) ? myOpenLead.Account.Name : "NA",
            activitygroup: myOpenLead.ActivityGroups ? myOpenLead.ActivityGroups.length > 0 ? this.ActivityGroupFiter(myOpenLead.ActivityGroups).length > 0 ? this.ActivityGroupFiter(myOpenLead.ActivityGroups) : ["NA"] : ["NA"] : ["NA"],
            source: (myOpenLead.Source.Name !== undefined) ? myOpenLead.Source.Name : "NA",
            status: (myOpenLead.Status.status !== undefined) ? myOpenLead.Status.status : "NA",
            index: myOpenLead.index
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

  performTableChildAction(childActionRecieved) {
    if (childActionRecieved) {
      (childActionRecieved.parentData) ? this.tableTotalCount = childActionRecieved.parentData.totalCount : this.tableTotalCount = this.tableTotalCount
    }

    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {
      case 'search': {
        this.AllMyOpenLeadRequestbody.RequestedPageNumber = 0
        this.SearchTable(childActionRecieved, this.AllMyOpenLeadRequestbody.RequestedPageNumber);
        break;
      }

      case 'pagination': {
        this.TablePagination(childActionRecieved);
        break
      }

      case 'tabNavigation':
        {
          this.TabNavigation(childActionRecieved.objectRowData[0])
          break
        }

      case 'Name':
        {
          sessionStorage.setItem('LeadId', JSON.stringify(this.encrDecrService.set('EncryptionEncryptionEncryptionEn', childActionRecieved.objectRowData[0].ida, 'DecryptionDecrip')));
          var leadName = childActionRecieved.objectRowData[0].Name
          sessionStorage.setItem('leadName', JSON.stringify(leadName));
          this.router.navigate(['/leads/leadDetails'])
          sessionStorage.setItem('navigationfromlist', JSON.stringify('6'));
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

      case 'sortHeaderBy': {
        this.AllMyOpenLeadRequestbody.OdatanextLink = ''
        this.AllMyOpenLeadRequestbody.RequestedPageNumber = 1
        this.CallListDataWithFilters(childActionRecieved);
        break
      }

      case 'ClearAllFilter': {
        this.clearallFilter();
        break;
      }

      case 'DownloadCSV': {
        this.downloadList(childActionRecieved);
        break
      }
    }
  }

  clearallFilter() {
    this.getAllMyOpenLeadData(this.AllMyOpenLeadRequestbody, false)
  }

  downloadList(data): void {
    this.isLoading = true
    let useFulldata = {
      LeadsReqBody: this.AllMyOpenLeadRequestbody,
      fieldheader: contactLeadheader,
      nextLink: this.AllMyOpenLeadRequestbody.OdatanextLink,
      pageNo: this.AllMyOpenLeadRequestbody.RequestedPageNumber,
      userGuid: this.userguid,
      ContactParentGuid: this.AllMyOpenLeadRequestbody.Guid,
      pageSize: this.AllMyOpenLeadRequestbody.PageSize
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
    console.log('>>>>>>>>>>>>>page', event)
    if (event.action == 'pagination') {
      if (this.AllMyOpenLeadRequestbody.PageSize == event.itemsPerPage) {
        this.AllMyOpenLeadRequestbody.PageSize = event.itemsPerPage;
        this.AllMyOpenLeadRequestbody.RequestedPageNumber = event.currentPage;
        this.getAllMyOpenLeadData(event, true);
      }
      else {
        this.AllMyOpenLeadRequestbody.PageSize = event.itemsPerPage;
        this.AllMyOpenLeadRequestbody.RequestedPageNumber = event.currentPage;
        this.getAllMyOpenLeadData(event, false);
      }
    }
  }

  SearchTable(data, reqpagenumber): void {
    this.AllMyOpenLeadRequestbody.RequestedPageNumber = 1
    this.AllMyOpenLeadRequestbody.OdatanextLink = ""
    if (data != "") {
      if (data.objectRowData != "" && data.objectRowData != undefined) {
        let useFulldata = {
          LeadsReqBody: this.AllMyOpenLeadRequestbody,
          fieldheader: contactLeadheader,
          nextLink: this.AllMyOpenLeadRequestbody.OdatanextLink,
          pageNo: this.AllMyOpenLeadRequestbody.RequestedPageNumber,
          userGuid: this.userguid,
          ContactParentGuid: this.AllMyOpenLeadRequestbody.Guid,
          pageSize: this.AllMyOpenLeadRequestbody.PageSize
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
              this.contactLeadTable = this.getTableFilterData(res.ResponseObject)
              this.AllMyOpenLeadRequestbody.OdatanextLink = res.OdatanextLink
              this.tableTotalCount = res.TotalRecordCount
            }
            else {
              this.contactLeadTable = [{}]
              this.tableTotalCount = 0
            }
          } else {
            this.isLoading = false;
            this.contactLeadTable = [{}]
          }
        }, error => {
          this.isLoading = false;
          this.contactLeadTable = [{}]
        })
      } else {
        this.isLoading = false;
        this.getAllMyOpenLeadData(this.AllMyOpenLeadRequestbody, false);
      }
    }
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
          this.AllMyOpenLeadRequestbody.OdatanextLink = ''
          this.AllMyOpenLeadRequestbody.RequestedPageNumber = 1
          this.CallListDataWithFilters(data)
        } else if (data.filterData.isApplyFilter && data.filterData.globalSearch != "") {
          this.CallListDataWithFilters(data)
        } else {
          this.store.dispatch(new ClearMyopenlead())
          this.AllMyOpenLeadRequestbody.OdatanextLink = ''
          this.AllMyOpenLeadRequestbody.RequestedPageNumber = 1
          this.getAllMyOpenLeadData(this.AllMyOpenLeadRequestbody, false)
        }
      }
    }
  }

  GetColumnSearchFilters(data) {
    let headerName = data.filterData.headerName
    this.AllMyOpenLeadRequestbody.OdatanextLink = ''
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
        fieldheader: contactLeadheader,
        ContactParentGuid: this.AllMyOpenLeadRequestbody.Guid,
        LeadsReqBody: this.AllMyOpenLeadRequestbody,
        userGuid: this.userguid
      }
      this.contactlead.getActionListConfigData({ ...data, useFulldata: useFulldata }).subscribe(res => {
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
      LeadsReqBody: this.AllMyOpenLeadRequestbody,
      fieldheader: contactLeadheader,
      nextLink: this.AllMyOpenLeadRequestbody.OdatanextLink,
      pageNo: this.AllMyOpenLeadRequestbody.RequestedPageNumber,
      userGuid: this.userguid,
      ContactParentGuid: this.AllMyOpenLeadRequestbody.Guid,
      pageSize: this.AllMyOpenLeadRequestbody.PageSize
    }
    let reqparam = this.contactlead.GetAppliedFilterData({ ...data, useFulldata: useFulldata })
    this.contactlead.getAppliedFilterLeadData(reqparam).subscribe(res => {
      console.log(res)
      if (!res.IsError) {
        if (res.ResponseObject.length > 0) {
          const ImmutabelObj = Object.assign({}, res)
          const perPage = this.AllMyOpenLeadRequestbody.PageSize;
          const start = ((this.AllMyOpenLeadRequestbody.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;
          res.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          });
          this.contactLeadTable = this.getTableFilterData(res.ResponseObject)
          this.AllMyOpenLeadRequestbody.OdatanextLink = res.OdatanextLink
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.contactLeadTable = [{}]
          this.tableTotalCount = 0
        }
      } else {
        this.contactLeadTable = [{}]
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

  opendelete() {
    const dialogRef = this.dialog.open(deletepopComponentlead,
      {
        width: '396px',
      });
  }
}
@Component({
  selector: 'delete-pop',
  templateUrl: './delete-pop.html',
})
export class deletepopComponentlead {

  constructor(public service: DataCommunicationService) { }

}
