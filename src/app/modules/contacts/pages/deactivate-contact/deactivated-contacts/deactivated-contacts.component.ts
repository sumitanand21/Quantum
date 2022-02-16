import { Component, OnInit } from '@angular/core';
import { DataCommunicationService, ErrorMessage, ContactService, OnlineOfflineService } from '@app/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { deactivatedContactService, deactivatedcontactheader } from '@app/core/services/dectivatedcontacts.service';
import { Observable } from 'rxjs/Observable';
import { DatePipe } from '@angular/common';
import { ClearContactList, ClearContactsDataDetails } from '@app/core/state/actions/contact.action';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { Subscription } from 'rxjs';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { environment as env } from '@env/environment';
import { getDeActivateContactListData } from '@app/core/state/selectors/inActivateContact-list.selector';
import { LoadAllDeActivateContacts, ClearDeActivateContactList } from '@app/core/state/actions/InActivateContact.action';
import { EnvService } from '@app/core/services/env.service';

declare let FileTransfer: any;
@Component({
  selector: 'app-deactivated-contacts',
  templateUrl: './deactivated-contacts.component.html',
  styleUrls: ['./deactivated-contacts.component.scss']
})
export class DeactivatedContactsComponent implements OnInit {
  deactivatedcontactTable = [];
  AllInActiveContactsRequestbody = {
    "PageSize": this.contactservice.sendPageSize || 50,
    "RequestedPageNumber": this.contactservice.sendPageNumber || 1,
    "OdatanextLink": "",
    "FilterData": this.contactservice.sendConfigData || [],
    "Guid": ''
  }
  isLoading: boolean = false;
  tableTotalCount: number;
  DeActivatecontactListState: Subscription;
  btnLabel=['activateBtnVisibility']
  reactivateId: any;
  filterConfigData = {
    FirstName: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Jobtitle: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Email: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Phone: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Account: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Reportingmanager: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    keyContact: { data: [], recordCount: 2, PageNo: 1, NextLink: '' },
    // Modifiedon: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Relationship: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Category: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    isFilterLoading: false
  };

  constructor(public userdat: DataCommunicationService,
    public router: Router,
    private fb: FormBuilder, public dialog: MatDialog,
    public deactivatecontacts: deactivatedContactService,
    public errorMessage: ErrorMessage,
    public store: Store<AppState>,
    private datepipe: DatePipe,
    public matSnackBar: MatSnackBar,
    public contactservice: ContactService,
    public encrDecrService: EncrDecrService,
    public service: DataCommunicationService,
    public onlineOfflineService: OnlineOfflineService,
    public envr : EnvService
  ) {
    if (localStorage.getItem('userID') !== null) {
      this.AllInActiveContactsRequestbody.Guid = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
    }
  }

  async ngOnInit() {
    this.contactservice.sendConfigData = []
    this.DeActivatecontactListState = this.store.pipe(select(getDeActivateContactListData)).subscribe(res => {
      if (res) {
        console.log("deactivated contact state data ", res);
        if (res.ids.length > 0) {
          this.deactivatedcontactTable = this.getTableFilterData(Object.values(res.entities))
          this.tableTotalCount = res.count;
          this.AllInActiveContactsRequestbody.OdatanextLink = res.OdatanextLink
        } else {
          this.getAllDeActivateContactsList(this.AllInActiveContactsRequestbody, true, false, true);
        }
      } else {
        this.getAllDeActivateContactsList(this.AllInActiveContactsRequestbody, false, true, true);
      }
    });
    if (!this.onlineOfflineService.isOnline) {
      const CacheResponse = await this.contactservice.getCachedDeActivatedContact()
      if (CacheResponse) {
        if (CacheResponse.data.length > 0) {
          this.isLoading = false;
          this.deactivatedcontactTable = this.getTableFilterData(Object.values(CacheResponse.data))
          this.tableTotalCount = CacheResponse.count.count
          this.AllInActiveContactsRequestbody.OdatanextLink = CacheResponse.OdatanextLink
        }
      }
    }
  }

  performTableChildAction(childActionRecieved) {
    console.log("childActionRecieved", childActionRecieved)
    var actionRequired = childActionRecieved;
    console.log(actionRequired.action)
    switch (actionRequired.action) {
      case 'tabNavigation':
        {
          this.TabNavigation(childActionRecieved.objectRowData[0]);
          break;
        }
      case 'search': {
        this.SearchTable(actionRequired);
        break;
      }
      case 'FirstName': {
        console.log('PageData--->', actionRequired.pageData)
        this.service.sessionStorageSetItem('ContactRoute',([2]));
        // sessionStorage.setItem('ContactRoute', JSON.stringify([2]));
        let currentPage = actionRequired.pageData.currentPage
        let pageSize = actionRequired.pageData.itemsPerPage
        let configData = actionRequired.configData.filterData
        this.contactservice.sendPageNumber = currentPage
        this.contactservice.sendPageSize = pageSize
        this.contactservice.sendConfigData = configData
        localStorage.setItem("contactEditId", JSON.stringify(actionRequired.objectRowData[0].id));
        localStorage.setItem("singlecontactdetails", JSON.stringify(actionRequired.objectRowData[0]));
        this.router.navigate(['/contacts/Contactdetailslanding/contactDetailsChild']);
        sessionStorage.setItem('contactEditMode', JSON.stringify(false));
        sessionStorage.setItem('contactEditOrActivate', JSON.stringify(false));     //this condition is taking for hiding showing edit and activate button from deactivate contact
        sessionStorage.removeItem("contactDetailsData");
        sessionStorage.removeItem('contactEditMode');
        break;
      }
      case 'activateContact': {
        console.log("activateContactddd",actionRequired.objectRowData)
        if(actionRequired.objectRowData.data!==undefined) {
          this.reActivateContact(actionRequired);
        } else {
          this.onMultipleReActivate(childActionRecieved)
        }
        break
      }
      case "columnFilter": {
        this.GetColumnFilters(childActionRecieved)
        break
      }
      case "columnSearchFilter": {
        this.GetColumnSearchFilters(childActionRecieved)
        break
      }
      case 'loadMoreFilterData': {
        this.LoadMoreColumnFilter(childActionRecieved)
        break
      }
      case 'ClearAllFilter': {
        this.clearallFilter();
        break
      }
      case "deactivatedcontacts": {
        this.store.dispatch(new ClearDeActivateContactList());
        this.reActivateContact(actionRequired);
        break
      }
      case 'DownloadCSV': {
        this.downloadList(childActionRecieved);
        break;
      }
      case 'sortHeaderBy': {
        this.AllInActiveContactsRequestbody.OdatanextLink = ''
        this.AllInActiveContactsRequestbody.RequestedPageNumber = 1
        this.CallListDataWithFilters(childActionRecieved);
        break;
      }
    }
  }

  clearallFilter(){
    this.getAllDeActivateContactsList(this.AllInActiveContactsRequestbody, false, false, true)
  }

  reActivateContact(dataobj) {
    this.isLoading = true;
    console.log("reactivate contact guid", dataobj.objectRowData.data[0].id);
    this.reactivateId = dataobj.objectRowData.data[0].id
    this.contactservice.getReActivateContact([{Guid:this.reactivateId}]).subscribe(res => {
      this.isLoading = false;
      if (res.IsError === false) {
        // this.deactivatedcontactTable = this.deactivatedcontactTable.filter(deactivate => deactivate.id !== dataobj.objectRowData.data[0].id)
        // this.store.dispatch(new ClearDeActivateContactList());
        this.getAllDeActivateContactsList(dataobj, false, false, true);
        this.store.dispatch(new ClearContactList());
        this.store.dispatch(new ClearContactsDataDetails())
        // this.tableTotalCount = this.tableTotalCount - 1
        this.errorMessage.throwError(res.Message);
      } else {
        this.errorMessage.throwError(res.Message);
      }
      console.log("reActivate contact", res);
    }, error => {
      this.isLoading = false;
    });
  }

  onMultipleReActivate(dataobj) {
    console.log("muldata",dataobj.objectRowData)
    let Guid: Array<any> = dataobj.objectRowData.map((x) => {
      return {
        Guid: (x.id)
      }
    });
    this.contactservice.getReActivateContact(Guid).subscribe(async res => {
      if (res.IsError === false) {
        console.log("multi reactivate contacts",res);
        dataobj.objectRowData.forEach(data => {
          console.log(data.id)
          this.deactivatedcontactTable = this.deactivatedcontactTable.filter(deactivate => deactivate.id !== data.id)
          this.tableTotalCount = this.tableTotalCount - 1
        })
        // this.store.dispatch(new ClearDeActivateContactList());
        this.getAllDeActivateContactsList(dataobj, false, false, true);
        this.store.dispatch(new ClearContactList());
        this.store.dispatch(new ClearContactsDataDetails())
        this.errorMessage.throwError(res.Message)
      } else {
        this.errorMessage.throwError(res.Message)
      }
    });
  }



  TabNavigation(item) {
    switch (item.index) {
      case 0:
          this.service.sessionStorageSetItem('ContactRoute',([1]));
        // sessionStorage.setItem('ContactRoute', JSON.stringify([1]));
        this.router.navigate(['/contacts']);
        return;
      case 1:
          this.service.sessionStorageSetItem('ContactRoute',([2]));
        // sessionStorage.setItem('ContactRoute', JSON.stringify([2]));
        this.router.navigate(['/contacts/deactivatedcontacts']);
      case 2:
        this.router.navigate(['/contacts/contactmoreviewcontacts']);
        return
    }
  }

  getNewTableData(event) {
    if (event.action == 'pagination') {
      this.AllInActiveContactsRequestbody.PageSize = event.itemsPerPage;
      this.AllInActiveContactsRequestbody.RequestedPageNumber = event.currentPage;
      this.getAllDeActivateContactsList(event, true, false, true);

      // if (this.userdat.checkFilterListApiCall(event)) {
      //   this.CallListDataWithFilters(event)
      // }
      // else {
      //   if (event.objectRowData != "" && event.objectRowData != undefined) {
      //     this.getAllDeActivateContactsList(this.AllInActiveContactsRequestbody, false, true, true);
      //   } else {
      //     this.getAllDeActivateContactsList(this.AllInActiveContactsRequestbody, true, false, true);
      //   }
      // }
    }
  }

  OnClickCreateConatct() {
    sessionStorage.removeItem('selAccountObj');
    this.router.navigateByUrl('contacts/CreateContactComponent')
  }

  getAllDeActivateContactsList(reqBody, isConcat, isSearch, isLoader) {
    (reqBody.RequestedPageNumber == 1 && isLoader) ? this.isLoading = true : this.isLoading = false;

    let useFulldata = {
      RequestedPageNumber: this.AllInActiveContactsRequestbody.RequestedPageNumber,
      pageSize: this.AllInActiveContactsRequestbody.PageSize,
      OdatanextLink: this.AllInActiveContactsRequestbody.OdatanextLink,
      isActive: false
    }
    let requestParams = this.contactservice.GetAppliedFilterData({...reqBody, useFulldata : useFulldata})
    this.contactservice.getAppliedFilterActionData(requestParams).subscribe(async deActivatecontactList => {
    // this.contactservice.getDeActivateContactList(reqBody).subscribe(async deActivatecontactList => {
      console.log("deActivate contact list data", deActivatecontactList);
      this.isLoading = false;
      if (!deActivatecontactList.IsError) {
      
        if (deActivatecontactList.ResponseObject.length > 0) {
          const ImmutableObject = Object.assign({}, deActivatecontactList)
          const perPage = this.AllInActiveContactsRequestbody.PageSize;
          const start = ((this.AllInActiveContactsRequestbody.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;
          deActivatecontactList.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          });
          if (deActivatecontactList.OdatanextLink) {
            this.AllInActiveContactsRequestbody.OdatanextLink = deActivatecontactList.OdatanextLink
          }
          if (isConcat) {
            let spliceArray = [];
            this.deactivatedcontactTable.map((res) => {
              if (res.index >= start && res.index <= end) {
                spliceArray.push(res);
              }
            });
            spliceArray.map(res => {
              this.deactivatedcontactTable.splice(this.deactivatedcontactTable.indexOf(res), 1);
            });
            if (!isSearch) {
              ImmutableObject.ResponseObject.map(x => x.id = x.Guid)
              const LoadDeActivateContactAction = {
                contactlist: ImmutableObject.ResponseObject,
                count: ImmutableObject.TotalRecordCount,
                nextlink: this.AllInActiveContactsRequestbody.OdatanextLink
                // nextlink: ImmutableObject.OdatanextLink
              }
              this.store.dispatch(new LoadAllDeActivateContacts({ allInActivateContacts: LoadDeActivateContactAction }))
            } else {
              this.deactivatedcontactTable = this.deactivatedcontactTable.concat(this.getTableFilterData(deActivatecontactList.ResponseObject))
            }
          } else {
            this.deactivatedcontactTable = this.getTableFilterData(deActivatecontactList.ResponseObject)
          }
          this.tableTotalCount = deActivatecontactList.TotalRecordCount
        } else {
          this.isLoading = false;
          this.tableTotalCount = 0;
          this.deactivatedcontactTable = [{}]
        }
      } else {
        this.isLoading = false;
        this.tableTotalCount = 0;
        this.deactivatedcontactTable = [{}]
        this.errorMessage.throwError(deActivatecontactList.Message);
      }
    }, error => {
      this.isLoading = false
      this.tableTotalCount = 0;
      this.deactivatedcontactTable = [{}]
      this.errorMessage.throwError(error)
    })
  }

  SearchTable(data): void {
    console.log('contact search data-->', data)
    this.AllInActiveContactsRequestbody.RequestedPageNumber = 1
    this.AllInActiveContactsRequestbody.OdatanextLink = ""
    if (data != "") {
      if (data.objectRowData != "" && data.objectRowData != undefined) {
        let deActivateSearch = {
          // "PageSize": this.contactservice.sendPageSize || 10,
          // "RequestedPageNumber": this.contactservice.sendPageNumber || 1,
          // "OdatanextLink": "",
          // "FilterData": this.contactservice.sendConfigData || [],
          // "Guid": this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
          // "SearchText": data.objectRowData
        }

        let useFulldata = {
          RequestedPageNumber: this.AllInActiveContactsRequestbody.RequestedPageNumber,
          pageSize: this.AllInActiveContactsRequestbody.PageSize,
          OdatanextLink: this.AllInActiveContactsRequestbody.OdatanextLink,
          AllContactsRequestbody : this.AllInActiveContactsRequestbody,
          isActive: false
        }
        let contactsearchtext = this.contactservice.GetAppliedFilterData({ ...data,useFulldata: useFulldata})
        this.contactservice.getAppliedFilterActionData(contactsearchtext).subscribe(res => {
          console.log("search after calling api", res);
          if (!res.IsError) {
            if (res.ResponseObject.length > 0) {
              let i = 1;
              res.ResponseObject.map(res => {
                res.index = i;
                i = i + 1;
              })
              this.deactivatedcontactTable = this.getTableFilterData(res.ResponseObject)
              this.AllInActiveContactsRequestbody.OdatanextLink = res.OdatanextLink
              this.tableTotalCount = res.TotalRecordCount
            }
            else {
              this.deactivatedcontactTable = [{}]
              this.tableTotalCount = 0
            }
          } else {
            this.errorMessage.throwError(res.Message);
          }
        })
      } else {
        this.getAllDeActivateContactsList(data, false, false, false);
      }
    }
  }

  getTableFilterData(tableData): Array<any> {
    if (tableData) {
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

  GetColumnSearchFilters(data) {
    let headerName = data.filterData.headerName
    this.AllInActiveContactsRequestbody.OdatanextLink = ''
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
        this.filterConfigData[headerName].data = []
        this.filterConfigData[headerName].PageNo = 1
        this.generateFilterConfigData(data, headerName, false, this.CheckFilterServiceFlag(data, headerName))
      } else {
        if (data.filterData.isApplyFilter && this.service.CheckFilterFlag(data)) {
          this.AllInActiveContactsRequestbody.OdatanextLink = ''
          this.AllInActiveContactsRequestbody.RequestedPageNumber = 1
          this.CallListDataWithFilters(data);
        }else if (data.filterData.isApplyFilter && data.filterData.globalSearch != ""){
          this.CallListDataWithFilters(data)
        } else {
          this.AllInActiveContactsRequestbody.OdatanextLink = ''
          this.AllInActiveContactsRequestbody.RequestedPageNumber = 1
          this.getAllDeActivateContactsList(this.AllInActiveContactsRequestbody, false, true, false);
        }
      }
    }
  }

  generateFilterConfigData(data, headerName, isConcat, isServiceCall?) {
    if (isServiceCall) {
      let useFulldata = {
        headerName: headerName,
        searchVal: data.filterData.columnSerachKey,
        pageNo: this.filterConfigData[headerName].PageNo,
        pageSize: 10,
        RequestedPageNumber:this.filterConfigData[headerName].PageNo,
        nextLink: this.filterConfigData[headerName].NextLink,
        AllContactsRequestbody:this.AllInActiveContactsRequestbody,
        isActive: false 
 
      }
      if (headerName === 'keyContact') {
        this.filterConfigData.isFilterLoading = false;
        this.filterConfigData[headerName] = { data: [{ id: 1, name: "Yes", value: true }, { id: 2, name: "No", value: false }] }
        this.filterSelctedValueDisplay(headerName, data)
      } else {
        this.contactservice.getContactListConfigData({ ...data, useFulldata: useFulldata }).subscribe(res => {
          this.filterConfigData.isFilterLoading = false;
          if(!res.IsError) {
            this.filterConfigData[headerName] = {
              data: (isConcat) ? this.filterConfigData[headerName]["data"].concat(res.ResponseObject) : res.ResponseObject,
              recordCount: res.TotalRecordCount,
              NextLink: res.OdatanextLink,
              PageNo: res.CurrentPageNumber
            }
            this.filterSelctedValueDisplay(headerName, data)
          }else {
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
    let useFulldata = {
      RequestedPageNumber: this.AllInActiveContactsRequestbody.RequestedPageNumber,
      AllContactsRequestbody:this.AllInActiveContactsRequestbody,
      pageSize: 50,
      isActive: false
    }
    console.log(data)
    let reqparam = this.contactservice.GetAppliedFilterData({ ...data, useFulldata: useFulldata})
    this.contactservice.getAppliedFilterActionData(reqparam).subscribe(res => {
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
          this.deactivatedcontactTable = this.getTableFilterData(res.ResponseObject)
          this.AllInActiveContactsRequestbody.OdatanextLink = res.OdatanextLink
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.deactivatedcontactTable = [{}]
          this.tableTotalCount = 0
        }
      } else {
        this.deactivatedcontactTable = [{}]
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

  downloadList(data): void {
    this.isLoading = true
    // let reqBody = {
    //   "Name": this.userdat.checkFilterListApiCall(data) ? this.service.pluckParticularKey(data.filterData.filterColumn['FirstName'], 'name') : [],
    //   "Designations": this.userdat.checkFilterListApiCall(data) ? this.service.pluckParticularKey(data.filterData.filterColumn['Jobtitle'], 'name') : [],
    //   "PhoneList": this.userdat.checkFilterListApiCall(data) ? this.service.pluckParticularKey(data.filterData.filterColumn['Phone'], 'name') : [],
    //   "AccountGuids": this.userdat.checkFilterListApiCall(data) ? this.service.pluckParticularKey(data.filterData.filterColumn['Account'], 'id') : [],
    //   "ProspectGuids": this.userdat.checkFilterListApiCall(data) ? data.filterData.filterColumn['Account'].filter(x => x.isProspect) : [],
    //   "KeyContactList": [],
    //   "ModifiedDateList": [],
    //   "ReportingManagerGuids": this.userdat.checkFilterListApiCall(data) ? this.service.pluckParticularKey(data.filterData.filterColumn['Reportingmanager'], 'name') : [],
    //   "ReleationShipList": this.userdat.checkFilterListApiCall(data) ? this.service.pluckParticularKey(data.filterData.filterColumn['Relationship'], 'id') : [],
    //   "CategoryList": this.userdat.checkFilterListApiCall(data) ? this.service.pluckParticularKey(data.filterData.filterColumn['Category'], 'id') : [],
    //   "Emails": this.userdat.checkFilterListApiCall(data) ? this.service.pluckParticularKey(data.filterData.filterColumn['Email'], 'name') : [],
    //   "SearchText": this.userdat.checkFilterListApiCall(data) ? data.filterData.globalSearch : [],
    //   "PageSize": 50,
    //   "RequestedPageNumber": 1,
    //   "IsActive": false,
    //   "IsDesc": (data.filterData.sortColumn != '') ? !data.filterData.sortOrder : false,
    //   "SortBy": this.userdat.checkFilterListApiCall(data) ? this.userdat.pluckParticularKey(deactivatedcontactheader.filter(x => x.name == data.filterData.sortColumn), 'SortId')[0] : [],
    //   "IsFilterApplied": this.userdat.checkFilterListApiCall(data) ? true : false
    // }
    let useFulldata = {
      RequestedPageNumber: this.AllInActiveContactsRequestbody.RequestedPageNumber,
      AllContactsRequestbody:this.AllInActiveContactsRequestbody,
      pageSize: this.AllInActiveContactsRequestbody.PageSize,
      isActive: false
    }
    let reqBody = this.contactservice.GetAppliedFilterData({ ...data, useFulldata:useFulldata})
    this.contactservice.downloadLeadList(reqBody).subscribe(res => {
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


}
