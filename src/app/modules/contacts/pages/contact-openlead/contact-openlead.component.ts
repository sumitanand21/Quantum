import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { contactopenleadService, ContactService, ErrorMessage, ContactleadService, contactopenleadheader } from '@app/core';
import { DataCommunicationService } from '@app/core/services/global.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { getContactDetailsById } from '@app/core/state/selectors/contact-list.selector';
import { ClearOpenLeadState } from '@app/core/state/actions/leads.action';
import { environment as env } from '@env/environment';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;
@Component({
  selector: 'app-contact-openlead',
  templateUrl: './contact-openlead.component.html',
  styleUrls: ['./contact-openlead.component.scss']
})
export class ContactOpenleadComponent implements OnInit {
  AllOpenLeadRequestbody = {
    "Guid": "",
    "StatusCode": 2,
    "PageSize": 50,
    "RequestedPageNumber": 0,
    "OdatanextLink": ""
  }
  key: string;
  headerData;;
  filterCheckBox = []
  contactopenleadTable = [];
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
    private contactopenlead: contactopenleadService,
    private contactService: ContactService,
    private EncrDecr: EncrDecrService,
    public errorMessage: ErrorMessage,
    public matSnackBar: MatSnackBar,
    private contactlead: ContactleadService,
    public store: Store<AppState>,
    public envr : EnvService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.userguid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
    this.ContactEditID = JSON.parse(localStorage.getItem("contactEditId"));
    this.AllOpenLeadRequestbody.Guid = this.ContactEditID
    this.AllOpenLeadRequestbody.RequestedPageNumber++
    this.getAllOpenLeadData(this.AllOpenLeadRequestbody, true);
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
      //   });
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
    // this.contactopenlead.getParentHeaderData().subscribe(x => {
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

  getAllOpenLeadData(reqBody, isConcat) {
    this.isLoading = true;
    let useFulldata = {
      LeadsReqBody: this.AllOpenLeadRequestbody,
      fieldheader: contactopenleadheader,
      nextLink: this.AllOpenLeadRequestbody.OdatanextLink,
      pageNo: this.AllOpenLeadRequestbody.RequestedPageNumber,
      userGuid: this.userguid,
      ContactParentGuid: this.AllOpenLeadRequestbody.Guid,
      pageSize: this.AllOpenLeadRequestbody.PageSize
    }
    let reqparam = this.contactlead.GetAppliedFilterData({ ...reqBody, useFulldata: useFulldata })
    this.contactlead.getAppliedFilterLeadData(reqparam).subscribe(resData => {
      if (!resData.IsError) {
        this.isLoading = false;
        if (resData.ResponseObject.length > 0) {
          const ImmutableObject = Object.assign({}, resData)
          const perPage =this.AllOpenLeadRequestbody.PageSize;
          const start = ((this.AllOpenLeadRequestbody.RequestedPageNumber - 1) * perPage) + 1;
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
            this.AllOpenLeadRequestbody.OdatanextLink = resData.OdatanextLink
          }
          if (isConcat) {
            let spliceArray = [];
            this.contactopenleadTable.map((res) => {
              if (res.index >= start && res.index <= end) {
                spliceArray.push(res);
              }
            });
            spliceArray.map(res => {
              this.contactopenleadTable.splice(this.contactopenleadTable.indexOf(res), 1);
            })
            this.contactopenleadTable = this.contactopenleadTable.concat(this.getTableFilterData(resData.ResponseObject))
          } else {
            this.contactopenleadTable = this.getTableFilterData(resData.ResponseObject)
          }
          this.tableTotalCount = resData.TotalRecordCount
        } else {
          this.tableTotalCount = 0
          this.contactopenleadTable = [{}]
        }
      } else {
        this.OnError(resData.Message);
        this.contactopenleadTable = [{}]
        this.isLoading = false;
      }
    },
      error => {
        this.isLoading = false;
      });
  }

  getNewTableData(event) {
    debugger
    if (event.action == 'pagination') {
      if (this.AllOpenLeadRequestbody.PageSize == event.itemsPerPage) {
        this.AllOpenLeadRequestbody.PageSize = event.itemsPerPage;
        this.AllOpenLeadRequestbody.RequestedPageNumber = event.currentPage;
        this.getAllOpenLeadData(event, true);
      }
      else {
        this.AllOpenLeadRequestbody.PageSize = event.itemsPerPage;
        this.AllOpenLeadRequestbody.RequestedPageNumber = event.currentPage;
        this.getAllOpenLeadData(event, false);
      }
    }
  }

  getTableFilterData(tableData): Array<any> {
    if (tableData) {
      console.log("Activities list table data", tableData);
      if (tableData.length > 0) {
        console.log("contacts table data", tableData);
        return tableData.map(openLead => {
          return {
            id: "NA",
            Name: (openLead.Title !== undefined) ? openLead.Title : "NA",
            ida: (openLead.LeadGuid !== undefined) ? openLead.LeadGuid : "NA",
            owner: (openLead.Owner.FullName !== undefined) ? openLead.Owner.FullName : "NA",
            created: (openLead.CreatedOn !== undefined) ? openLead.CreatedOn : "NA",
            account: (openLead.Account.Name !== undefined) ? openLead.Account.Name : "NA",
            activitygroup: openLead.ActivityGroups ? openLead.ActivityGroups.length > 0 ? this.ActivityGroupFiter(openLead.ActivityGroups).length > 0 ? this.ActivityGroupFiter(openLead.ActivityGroups) : ["NA"] : ["NA"] : ["NA"],
            source: (openLead.Source.Name !== undefined) ? openLead.Source.Name : "NA",
            status: (openLead.Status.status !== undefined) ? openLead.Status.status : "NA",
            index: openLead.index
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
    console.log("childActionRecieved",childActionRecieved)
    if (childActionRecieved) {
      (childActionRecieved.parentData) ? this.tableTotalCount = childActionRecieved.parentData.totalCount : this.tableTotalCount = this.tableTotalCount
    }
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {
      case 'search': {
        this.AllOpenLeadRequestbody.RequestedPageNumber = 0
        this.SearchTable(actionRequired, this.AllOpenLeadRequestbody.RequestedPageNumber);
        break;
      }

      case 'tabNavigation': {
        this.TabNavigation(childActionRecieved.objectRowData[0])
        break;
      }

      case 'pagination': {
        this.TablePagination(childActionRecieved);
        break;
      }

      case 'Name':
        {
          sessionStorage.setItem('LeadId', JSON.stringify(this.EncrDecr.set('EncryptionEncryptionEncryptionEn', childActionRecieved.objectRowData[0].ida, 'DecryptionDecrip')));
          this.router.navigate(['/leads/leadDetails'])
          sessionStorage.setItem('navigationfromlist', JSON.stringify('7'));
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
        this.AllOpenLeadRequestbody.OdatanextLink = ''
        this.AllOpenLeadRequestbody.RequestedPageNumber = 1
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
    this.getAllOpenLeadData(this.AllOpenLeadRequestbody, false)
  }

  downloadList(data): void {
    this.isLoading = true
    let useFulldata = {
      LeadsReqBody: this.AllOpenLeadRequestbody,
      fieldheader: contactopenleadheader,
      nextLink: this.AllOpenLeadRequestbody.OdatanextLink,
      pageNo: this.AllOpenLeadRequestbody.RequestedPageNumber,
      userGuid: this.userguid,
      ContactParentGuid: this.AllOpenLeadRequestbody.Guid,
      pageSize: this.AllOpenLeadRequestbody.PageSize
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
          this.AllOpenLeadRequestbody.OdatanextLink = ''
          this.AllOpenLeadRequestbody.RequestedPageNumber = 1
          this.CallListDataWithFilters(data)
        } else if (data.filterData.isApplyFilter && data.filterData.globalSearch != "") {
          this.CallListDataWithFilters(data)
        } else {
          this.store.dispatch(new ClearOpenLeadState())
          this.AllOpenLeadRequestbody.OdatanextLink = ''
          this.AllOpenLeadRequestbody.RequestedPageNumber = 1
          this.getAllOpenLeadData(this.AllOpenLeadRequestbody, false)
        }
      }
    }
  }

  GetColumnSearchFilters(data) {
    let headerName = data.filterData.headerName
    this.AllOpenLeadRequestbody.OdatanextLink = ''
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
        fieldheader: contactopenleadheader,
        ContactParentGuid: this.AllOpenLeadRequestbody.Guid,
        LeadsReqBody: this.AllOpenLeadRequestbody,
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
      LeadsReqBody: this.AllOpenLeadRequestbody,
      fieldheader: contactopenleadheader,
      nextLink: this.AllOpenLeadRequestbody.OdatanextLink,
      pageNo: this.AllOpenLeadRequestbody.RequestedPageNumber,
      userGuid: this.userguid,
      ContactParentGuid: this.AllOpenLeadRequestbody.Guid,
      pageSize: this.AllOpenLeadRequestbody.PageSize
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
          this.contactopenleadTable = this.getTableFilterData(res.ResponseObject)
          this.AllOpenLeadRequestbody.OdatanextLink = res.OdatanextLink
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.contactopenleadTable = [{}]
          this.tableTotalCount = 0
        }
      } else {
        this.contactopenleadTable = [{}]
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

  SearchTable(data, reqpagenumber): void {
    this.isLoading = true
    console.log('contact search data-->', data)
    this.AllOpenLeadRequestbody.RequestedPageNumber = 1
    this.AllOpenLeadRequestbody.OdatanextLink = ""
    if (data != "") {
      if (data.objectRowData != "" && data.objectRowData != undefined) {
        let useFulldata = {
          LeadsReqBody: this.AllOpenLeadRequestbody,
          fieldheader: contactopenleadheader,
          nextLink: this.AllOpenLeadRequestbody.OdatanextLink,
          pageNo: this.AllOpenLeadRequestbody.RequestedPageNumber,
          userGuid: this.userguid,
          ContactParentGuid: this.AllOpenLeadRequestbody.Guid,
          pageSize: this.AllOpenLeadRequestbody.PageSize
        }
        this.isLoading = true;
        let reqparam = this.contactlead.GetAppliedFilterData({ ...data, useFulldata: useFulldata })
        this.contactlead.getAppliedFilterLeadData(reqparam).subscribe(res => {
          this.isLoading = false;
          if (!res.IsError) {
            this.isLoading = false
            if (res.ResponseObject.length > 0) {
              let i = 1;
              res.ResponseObject.map(res => {
                res.index = i;
                i = i + 1;
              })
              this.contactopenleadTable = this.getTableFilterData(res.ResponseObject)
              this.AllOpenLeadRequestbody.OdatanextLink = res.OdatanextLink
              this.tableTotalCount = res.TotalRecordCount
            }
            else {
              this.isLoading = false
              this.contactopenleadTable = [{}]
              this.tableTotalCount = 0
            }
          } else {
            this.isLoading = false
            this.contactopenleadTable = [{}]
          }
        }, error => {
          this.isLoading = false
          this.contactopenleadTable = [{}]
        });
      } else {
        this.isLoading = false;
        this.getAllOpenLeadData(this.AllOpenLeadRequestbody, false);
      }
    }
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
