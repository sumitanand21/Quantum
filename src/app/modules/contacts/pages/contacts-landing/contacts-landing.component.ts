
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DataCommunicationService } from '@app/core/services/global.service';
import { ContactService, OnlineOfflineService, ErrorMessage, OfflineService, contactheader } from '@app/core';
import { AppState } from '@app/core/state';
import { Store, select } from '@ngrx/store';
import { LoadAllContacts, ClearContactList, ClearContactsDataDetails } from '@app/core/state/actions/contact.action';
import { getContactListData } from '@app/core/state/selectors/contact-list.selector';
import { DatePipe } from '@angular/common';
import { environment as env } from '@env/environment';
import { ClearDeActivateContactList } from '@app/core/state/actions/InActivateContact.action';
import { MyOpenLeadsService } from '@app/core/services/myopenlead.service';
import { MeetingService } from '@app/core/services/meeting.service';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;
@Component({
  selector: 'app-contacts-landing',
  templateUrl: './contacts-landing.component.html',
  styleUrls: ['./contacts-landing.component.scss']
})
export class ContactsLandingComponent implements OnInit, OnDestroy {
  contactTable = [];
  AllContactsRequestbody = {
    "PageSize":  50,
    "RequestedPageNumber": 1,
    "OdatanextLink": "",
    "FilterData": []
  }
  isLoading: boolean = false;
  key: string;
  contactstabdown = true;
  IscheckBoxRequired = true;
  suitetabdown = false;
  tableTotalCount: number;
  deactivateMSG: any;
  contactListState: Subscription;

  filterConfigData = {
    FirstName: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Jobtitle: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Email: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Phone: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Account: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Reportingmanager: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    keyContact: { data: [], recordCount: 2, PageNo: 1, NextLink: '' },
    Relationship: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Category: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    isFilterLoading: false
  };

  constructor(
    private router: Router,
    public userdat: DataCommunicationService,
    public dialog: MatDialog,
    private datepipe: DatePipe,
    public contact: ContactService,
    public store: Store<AppState>,
    public onlineOfflineService: OnlineOfflineService,
    public offlineServices: OfflineService,
    public errorMessage: ErrorMessage,
    public service: DataCommunicationService,
    public myopenleadservice: MyOpenLeadsService,
    public meetingService: MeetingService,
    public envr : EnvService
  ) { }

  async ngOnInit() {
    this.contact.sendConfigData = []
    this.service.sessionStorageSetItem('ContactRoute',([1]));
    this.contactListState = this.store.pipe(select(getContactListData)).subscribe(res => {
      if (res) {
        if (res.ids.length > 0) {
          this.contactTable = this.getTableFilterData(Object.values(res.entities))
          this.tableTotalCount = res.count;
          this.AllContactsRequestbody.OdatanextLink = res.OdatanextLink
        } else {
          this.getAllContactsList(this.AllContactsRequestbody, true, false, true)
        }
      } else {
        this.getAllContactsList(this.AllContactsRequestbody, true, false, true)
      }
    });
    if (!this.onlineOfflineService.isOnline) {
      const CacheResponse = await this.contact.getCachedContact()
      if (CacheResponse) {
        if (CacheResponse.data.length > 0) {
          this.isLoading = false;
          this.contactTable = this.getTableFilterData(Object.values(CacheResponse.data))
          this.tableTotalCount = CacheResponse.count
          this.AllContactsRequestbody.OdatanextLink = CacheResponse.OdatanextLink
        }
      }
    }
    if (!this.router.url.includes('/accounts/contacts/accountcontacts')) {
      sessionStorage.removeItem('selAccountObj')
    }
  }

  getAllContactsList(reqBody, isConcat, isSearch, isLoader) {
    this.isLoading = true
    let useFulldata = {
      RequestedPageNumber: this.AllContactsRequestbody.RequestedPageNumber,
      pageSize: this.AllContactsRequestbody.PageSize,
      OdatanextLink: this.AllContactsRequestbody.OdatanextLink,
      isActive: true
    }
    let requestParams = this.contact.GetAppliedFilterData({...reqBody, useFulldata : useFulldata})
    this.contact.getAppliedFilterActionData(requestParams).subscribe(async contactList => {
      this.isLoading = false;
      if (!contactList.IsError) {
        if (contactList.ResponseObject.length > 0) {
          const ImmutableObject = Object.assign({}, contactList)
          const perPage = this.AllContactsRequestbody.PageSize;
          const start = ((this.AllContactsRequestbody.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;
          contactList.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          });
          if (contactList.OdatanextLink) {
            this.AllContactsRequestbody.OdatanextLink = contactList.OdatanextLink
          }
          if (isConcat) {
            let spliceArray = [];
            this.contactTable.map((res) => {
              if (res.index >= start && res.index <= end) {
                spliceArray.push(res);
              }
            });
            spliceArray.map(res => {
              this.contactTable.splice(this.contactTable.indexOf(res), 1);
            });
            if (!isSearch) {
              ImmutableObject.ResponseObject.map(x => x.id = x.Guid)
              this.store.dispatch(new LoadAllContacts(
                {
                  AllContacts: ImmutableObject.ResponseObject,
                  count: contactList.TotalRecordCount,
                  nextlink: contactList.OdatanextLink
                }))
            } else {
              this.contactTable = this.contactTable.concat(this.getTableFilterData(contactList.ResponseObject))
            }
          } else {
            this.contactTable = this.getTableFilterData(contactList.ResponseObject)
          }
          this.tableTotalCount = contactList.TotalRecordCount
        } else {
          this.isLoading = false;
          this.contactTable = [{}]
        }
      } else {
        this.errorMessage.throwError(contactList.Message);
        this.isLoading = false;
        this.contactTable = [{}]
      }
    }, error => {
      this.isLoading = false
      this.tableTotalCount = 0
      this.AllContactsRequestbody.RequestedPageNumber = 0;
      this.AllContactsRequestbody.OdatanextLink = '',
        this.contactTable = [{}]
    })
  }

  SearchTable(data): void {
    console.log('contact search data-->', data)
    this.AllContactsRequestbody.RequestedPageNumber = 1
    this.AllContactsRequestbody.OdatanextLink = ""
    if (data != "") {
      if (data.objectRowData != "" && data.objectRowData != undefined) {
        let useFulldata = {
          RequestedPageNumber: this.AllContactsRequestbody.RequestedPageNumber,
          pageSize: this.AllContactsRequestbody.PageSize,
          OdatanextLink: this.AllContactsRequestbody.OdatanextLink,
          isActive: true
        }
        let contactsearchtext = this.contact.GetAppliedFilterData({ ...data,useFulldata: useFulldata})
        this.contact.getAppliedFilterActionData(contactsearchtext).subscribe(res => {
          debugger
          if (!res.IsError) {
            if (res.ResponseObject.length > 0) {
              let i = 1;
              res.ResponseObject.map(res => {
                res.index = i;
                i = i + 1;
              })
              this.contactTable = this.getTableFilterData(res.ResponseObject)
              this.AllContactsRequestbody.OdatanextLink = res.OdatanextLink
              this.tableTotalCount = res.TotalRecordCount
            }
            else {
              this.contactTable = [{}]
              this.tableTotalCount = 0
            }
          } else {
            this.errorMessage.throwError(res.Message);
          }
        })
      } else {
        this.getAllContactsList(data, false, false, false);
      }
    }
  }

  getNewTableData(event) {
    if (event.action == 'pagination') {
      if (this.AllContactsRequestbody.PageSize == event.itemsPerPage) {
        this.AllContactsRequestbody.PageSize = event.itemsPerPage;
        this.AllContactsRequestbody.RequestedPageNumber = event.currentPage;
        this.getAllContactsList(event, true, true, true);
      }
      else {
        this.AllContactsRequestbody.PageSize = event.itemsPerPage;
        this.AllContactsRequestbody.RequestedPageNumber = event.currentPage;
        this.getAllContactsList(event, false, true, true);
      }
    }
  }

  getTableFilterData(tableData): Array<any> {
    if (tableData) {
      console.log("contacts table data", tableData);
      if (tableData.length > 0) {
        console.log("contacts table data", tableData);
        return tableData.map(contact => {
          let firstName = (contact.FName !== undefined) ? contact.FName : '';
          let lastName = (contact.LName !== undefined) ? contact.LName : '';
          return {
            id: contact.Guid,
            FirstName: firstName + ' ' + lastName,
            Jobtitle: contact.Designation || "NA",
            Email: (contact.Email === undefined) ? "NA" : contact.Email,
            Phone: contact.Contact ? contact.Contact.length > 0 ? this.phoneNumbers(contact.Contact) : ["NA"] : ["NA"],
            Account: (contact.CustomerAccount.Name !== undefined) ? contact.CustomerAccount.Name : "NA",
            Reportingmanager: (contact.ReportingManager.FullName !== undefined) ? contact.ReportingManager.FullName : "NA",
            keyContact: (contact.isKeyContact === false) ? "No" : "Yes",
            Modifiedon: (contact.ModifiedOn !== undefined) ? contact.ModifiedOn : "NA",
            Relationship: (contact.Relationship.Name) ? contact.Relationship.Name : "NA",
            Category: (contact.Category.Name) ? contact.Category.Name : "NA",
            index: contact.index,
            editBtnVisibility:!contact.isUserCanEdit,
            deleteBtnVisibility: !contact.isAllowToDeActivate
          };
        });
      } else {
        return [{}]
      }
    } else {
      return [{}]
    }
  }

  phoneNumbers(data): Array<any> {
    try {
      let phoneNumbers = []
      data.map(x => phoneNumbers.push(x.ContactNo))
      return phoneNumbers
    } catch (error) {
      return ["NA"]
    }
  }

  OnClickCreateConatct() {
    console.log("inside create contact")
    sessionStorage.removeItem('selAccountObj');
    sessionStorage.removeItem('CreateActivityGroup');
    this.myopenleadservice.clearLeadAddContactSessionStore();
    this.meetingService.customerContactAccountFromMeeting = undefined;
    this.router.navigateByUrl('contacts/CreateContactComponent')
  }
  performTableChildAction(childActionRecieved): Observable<any> {
    console.log('childActionReceived---->', childActionRecieved)
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {
      case 'share': {
        this.router.navigateByUrl('/activities/childInfo');
        return;
      }
      case 'edit': {
        this.service.editTheProfile()
        { }
        this.editContact(actionRequired)
        return;
      }
      case 'Linkedopp': {
        console.log(actionRequired)
        return;
      }
      case 'restore': {
        return of('share Trigger');
      }
      case 'nurture': {
        return of('nurture Trigger');
      }
      case 'convertOpportunity': {
        return of('nurture Trigger');
      }
      case 'archiveLead': {
        return of('nurture Trigger');
      }
      case 'deactivateContact': {
        this.deleteContact(actionRequired)
        return;
      }
      case 'FirstName': {
        console.log('PageData--->', actionRequired.pageData)
        this.firstNameDetailContact(actionRequired);
        return;
      }
      case 'DownloadCSV': {
        console.log("downloafing")
        this.downloadList(childActionRecieved);
        return;
      }
      case 'search': {
        this.SearchTable(actionRequired);
        return;
      }
      case 'tabNavigation':
        {
          this.TabNavigation(childActionRecieved.objectRowData[0]);
          return;
        }
      case "columnFilter": {
        this.GetColumnFilters(childActionRecieved);
        return;
      }
      case "columnSearchFilter": {
        this.GetColumnSearchFilters(childActionRecieved);
        return;
      }
      case 'loadMoreFilterData': {
        this.LoadMoreColumnFilter(childActionRecieved);
        return;
      }
      case 'ClearAllFilter': {
        this.clearallFilter();
        return;
      }
      case 'sortHeaderBy': {
        this.AllContactsRequestbody.OdatanextLink = ''
        this.AllContactsRequestbody.RequestedPageNumber = 1
        this.CallListDataWithFilters(childActionRecieved);
        return;
      }
    }
  }

  firstNameDetailContact(actionRequired){
    this.service.sessionStorageSetItem('ContactRoute',([1]));
    let currentPage = actionRequired.pageData.currentPage
    let pageSize = actionRequired.pageData.itemsPerPage
    let configData = actionRequired.configData.filterData
    this.contact.sendPageNumber = currentPage
    this.contact.sendPageSize = pageSize
    this.contact.sendConfigData = configData
    localStorage.setItem("contactEditId", JSON.stringify(actionRequired.objectRowData[0].id));
    localStorage.setItem("singlecontactdetails", JSON.stringify(actionRequired.objectRowData[0]));
    this.router.navigate(['/contacts/Contactdetailslanding/contactDetailsChild']);
    sessionStorage.setItem('contactEditMode', JSON.stringify(false));
    sessionStorage.setItem('contactEditOrActivate', JSON.stringify(true));
    sessionStorage.removeItem("contactDetailsData");
    sessionStorage.removeItem('contactEditMode');
  }

  editContact(actionRequired){
    this.contact.getIsUserCanEditContact(actionRequired.objectRowData[0].id).subscribe(res => {
      if (!res.IsError) {
        if (res.ResponseObject.isUserCanEdit) {
          this.service.sessionStorageSetItem('ContactRoute',([1]));
          sessionStorage.setItem("contactNameDetailsFlag", JSON.stringify(false))
          localStorage.setItem("singlecontactdetails", JSON.stringify(actionRequired.objectRowData[0]));
          localStorage.setItem("contactEditId", JSON.stringify(actionRequired.objectRowData[0].id));
          sessionStorage.setItem('contactEditMode', JSON.stringify(true))
          sessionStorage.setItem('contactEditOrActivate', JSON.stringify(true))
          this.router.navigate(['/contacts/Contactdetailslanding/contactDetailsChild']);
        } else {
          this.errorMessage.throwError("User don't have permission to edit this contact");
        }
      } else {
        this.errorMessage.throwError(res.Message);
      }
    })
  }

  deleteContact(data) {
    this.isLoading = true;
    console.log(data.objectRowData.data[0].id)
    let deActivateId = data.objectRowData.data[0].id
    console.log(deActivateId);
    this.contact.getDeActivateContact(deActivateId).subscribe(res => {
      this.isLoading = false;
      if (res.IsError === false) {
        // this.service.serviceSearchItem = ''
        // this.store.dispatch(new ClearContactList())
        this.getAllContactsList(data, false, false, true);
        this.store.dispatch(new ClearDeActivateContactList());
        this.store.dispatch(new ClearContactsDataDetails())
        this.errorMessage.throwError(res.Message);
      } else {
        this.errorMessage.throwError(res.Message)
      }
    }, error => {
      this.isLoading = false;
    });
  }

  clearallFilter() {
    this.AllContactsRequestbody = {
      "PageSize":  this.AllContactsRequestbody.PageSize,
      "RequestedPageNumber": 1,
      "OdatanextLink": "",
      "FilterData": []
    }
    this.getAllContactsList(this.AllContactsRequestbody, false, false, true)
  }


  GetColumnSearchFilters(data) {
    let headerName = data.filterData.headerName
    this.AllContactsRequestbody.OdatanextLink = ''
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
        let headerName = data.filterData.headerName
        this.filterConfigData[headerName].data = [];
        this.filterConfigData[headerName].PageNo = 1
        this.generateFilterConfigData(data, headerName, false, this.CheckFilterServiceFlag(data, headerName))
      } else {
        if (data.filterData.isApplyFilter && this.service.CheckFilterFlag(data)) {
          this.AllContactsRequestbody.OdatanextLink = ''
          this.AllContactsRequestbody.RequestedPageNumber = 1
          this.CallListDataWithFilters(data)
        }else if (data.filterData.isApplyFilter && data.filterData.globalSearch != ""){
          this.CallListDataWithFilters(data)
        } else {
          this.AllContactsRequestbody.OdatanextLink = ''
          this.AllContactsRequestbody.RequestedPageNumber = 1
          this.getAllContactsList(this.AllContactsRequestbody, false, true, false);
        }
      }
    }
  }

  generateFilterConfigData(data, headerName, isConcat, isServiceCall?) {
    if (isServiceCall) {
      let useFulldata = {
        headerName: headerName,
        searchVal: data.filterData.columnSerachKey,
        RequestedPageNumber:this.filterConfigData[headerName].PageNo,
        pageSize: 10,
        nextLink: this.filterConfigData[headerName].NextLink,
        isActive: true
      }
      if (headerName === 'keyContact') {
        this.filterConfigData.isFilterLoading = false;
        this.filterConfigData[headerName] = { data: [{ id: 1, name: "Yes", value: true }, { id: 2, name: "No", value: false }] }
        this.filterSelctedValueDisplay(headerName, data)
      } else {
        this.contact.getContactListConfigData({ ...data, useFulldata: useFulldata }).subscribe(res => {
          console.log("getContactListConfigDatares",res);
          this.filterConfigData.isFilterLoading = false;
          if(!res.IsError) {
            this.filterConfigData[headerName] = {
              data: (isConcat) ? this.filterConfigData[headerName]["data"].concat(res.ResponseObject) : res.ResponseObject,
              recordCount: res.TotalRecordCount,
              NextLink: res.OdatanextLink,
              PageNo: res.CurrentPageNumber
            }
            this.filterSelctedValueDisplay(headerName, data)
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
        });
      }
    } else {
      this.filterConfigData.isFilterLoading = false;
      if (data.filterData.filterColumn[headerName].length > 0) {
        this.filterConfigData[headerName]["data"] = this.RemoveSelectedItems(this.filterConfigData[headerName]["data"], data.filterData.filterColumn[headerName], 'id').concat(data.filterData.filterColumn[headerName])
      }
    }
  }

  RemoveSelectedItems(array1, array2, key) {
    return array1.filter(item1 =>
      !array2.some(item2 => (item2[key] === item1[key])))
  }

  filterSelctedValueDisplay(headerName, data) {
    data.filterData.filterColumn[headerName].forEach(res => {
      let index = this.filterConfigData[headerName].data.findIndex(x => x.id == res.id)
      if (index !== -1) {
        this.filterConfigData[headerName].data[index].isDatafiltered = true
      }
    });
  }


  CallListDataWithFilters(data) {
    console.log(data)
    let useFulldata = {
      RequestedPageNumber: this.AllContactsRequestbody.RequestedPageNumber,
      AllContactsRequestbody:this.AllContactsRequestbody,
      pageSize: 50,
      isActive: true
    }
    let reqparam = this.contact.GetAppliedFilterData({ ...data, useFulldata: useFulldata})
    this.contact.getAppliedFilterActionData(reqparam).subscribe(res => {
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
          })
          this.contactTable = this.getTableFilterData(res.ResponseObject)
          this.AllContactsRequestbody.OdatanextLink = res.OdatanextLink
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.contactTable = [{}]
          this.tableTotalCount = 0
        }
      } else {
        this.contactTable = [{}]
        this.tableTotalCount = 0
        this.errorMessage.throwError(res.Message)
      }
    });
  }

  CheckFilterServiceFlag(data, headerName): boolean {
    if (data) {
      if (data.action != "columnFilter" && data.filterData.isApplyFilter) {
        return false
      } else if (data.action == "columnFilter" && data.filterData.columnSerachKey == '' && this.filterConfigData[headerName]["data"].length <= 0) {
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

  TabNavigation(item) {
    console.log(item);
    switch (item.index) {
      case 0:
        this.service.sessionStorageSetItem('ContactRoute',([1]));
        // sessionStorage.setItem('ContactRoute', JSON.stringify([1]))
        this.router.navigate(['/contacts']);
        return;
      case 1:
        this.service.sessionStorageSetItem('ContactRoute',([2]));
        // sessionStorage.setItem('ContactRoute', JSON.stringify([2]))
        this.router.navigate(['/contacts/deactivatedcontacts']);
        return
      case 2:
        this.router.navigate(['/contacts/contactmoreviewcontacts']);
        return
    }
  }

  downloadList(data): void {
    this.isLoading = true
    // let reqBody = {
    //   "Name": this.userdat.checkFilterListApiCall(data) ? this.service.pluckParticularKey(data.filterData.filterColumn['FirstName'], 'name') : [],
    //   "Designations": this.userdat.checkFilterListApiCall(data) ? this.service.pluckParticularKey(data.filterData.filterColumn['Jobtitle'], 'name') : [],
    //   "PhoneList": this.userdat.checkFilterListApiCall(data) ? this.service.pluckParticularKey(data.filterData.filterColumn['Phone'], 'name') : [],
    //   "AccountGuids": this.userdat.checkFilterListApiCall(data) ? this.service.pluckParticularKey(data.filterData.filterColumn['Account'], 'id') : [],
    //   "ProspectGuids": this.userdat.checkFilterListApiCall(data) ? data.filterData.filterColumn['Account'].filter(x => x.isProspect) : [],
    //   "KeyContactList": [],
    //   "ModifiedDateList":  [],
    //   "ReportingManagerGuids": this.service.pluckParticularKey(data.filterData.filterColumn['Reportingmanager'], 'name'),
    //   "ReleationShipList": this.userdat.checkFilterListApiCall(data) ? this.service.pluckParticularKey(data.filterData.filterColumn['Relationship'], 'id') : [],
    //   "CategoryList": this.userdat.checkFilterListApiCall(data) ? this.service.pluckParticularKey(data.filterData.filterColumn['Category'], 'id') : [],
    //   "Emails": this.userdat.checkFilterListApiCall(data) ? this.service.pluckParticularKey(data.filterData.filterColumn['Email'], 'name') : [],
    //   "SearchText": this.userdat.checkFilterListApiCall(data) ? data.filterData.globalSearch : "",
    //   "PageSize": 50,
    //   "RequestedPageNumber": 1,
    //   "IsActive": true,
    //   "IsDesc": (data.filterData.sortColumn != '') ? !data.filterData.sortOrder : false,
    //   "SortBy": this.userdat.checkFilterListApiCall(data) ? this.userdat.pluckParticularKey(contactheader.filter(x => x.name == data.filterData.sortColumn), 'SortId')[0] : [],
    //   "IsFilterApplied": this.userdat.checkFilterListApiCall(data) ? true : false
    // }
    let useFulldata = {
      RequestedPageNumber: this.AllContactsRequestbody.RequestedPageNumber,
      AllContactsRequestbody:this.AllContactsRequestbody,
      pageSize: this.AllContactsRequestbody.PageSize,
      isActive: true
    }
    let reqBody = this.contact.GetAppliedFilterData({ ...data, useFulldata:useFulldata})
    this.contact.downloadLeadList(reqBody).subscribe(res => {
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
    })
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

  opendelete() {
    const dialogRef = this.dialog.open(deletepopComponent,
      {
        disableClose: true,
        width: '396px',
      });
  }

  ngOnDestroy() {
    this.contactListState.unsubscribe()
  }
}

@Component({
  selector: 'delete-pop',
  templateUrl: './delete-pop.html',
})
export class deletepopComponent {

  constructor(public service: DataCommunicationService) { }

}

