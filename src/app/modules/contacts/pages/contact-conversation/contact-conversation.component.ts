import { Component, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar, } from '@angular/material';
import { contactconversation, ContactconversationService, ContactService, ErrorMessage } from '@app/core';
import { DataCommunicationService } from '@app/core/services/global.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { getContactDetailsById } from '@app/core/state/selectors/contact-list.selector';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { environment as env } from '@env/environment';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;

@Component({
  selector: 'app-contact-conversation',
  templateUrl: './contact-conversation.component.html',
  styleUrls: ['./contact-conversation.component.scss']
})
export class ContactConversationComponent implements OnInit {

  //  AllActivityRequestbody = {
  //   "PageSize": this.contactService.sendPageSize || 50,
  //   "RequestedPageNumber": this.contactService.sendPageNumber || 1,
  //   "OdatanextLink": "",
  //   "FilterData": this.contactService.sendConfigData || []
  // }
  AllActivityRequestbody = {
    "PageSize": 50,
    "RequestedPageNumber": 1,
    "OdatanextLink": ""
  }

  key: string;
  contactstabdown = true;
  suitetabdown = false;
  search;
  selectedTabValue: string = "";
  userArray: contactconversation[];
  showMoreOptions;
  headerData;
  id?: Number;
  name?: string;
  order?: number;
  isFixed?: boolean;
  contactstabwhite = true;
  suitetabwhite = false;
  myArrayData = [];
  myFilter = [];
  myString;
  filterCheckBox = []
  filterBox = {};
  isFilter?: boolean;
  searchitem
  ContactEditID: any;
  RelationshipLinkSearchType: number;
  isLoading: boolean = false;
  contactConversationTable = [];
  SingleContactname: string;
  tableTotalCount: number;
  imageSrc1: string;
  ContactParentId: any;
  userguid:any;

  constructor(
    private router: Router,
    public userdat: DataCommunicationService,
    public dialog: MatDialog,
    private contactconversation: ContactconversationService,
    private encrDecrService: EncrDecrService,
    private contactService: ContactService,
    public errorMessage: ErrorMessage,
    public matSnackBar: MatSnackBar,
    public store: Store<AppState>,
    public envr : EnvService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    // this.contactService.sendConfigData = []
    this.userguid = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
    console.log("user guid", this.userguid);
    this.ContactEditID = JSON.parse(localStorage.getItem("contactEditId"));
    console.log("Contact Edit ID ", this.ContactEditID);                          // edit Id from coming contact list edit
    let contactId = JSON.parse(localStorage.getItem('contactEditId'))
    this.ContactParentId = contactId

    this.getAllActivityData(this.AllActivityRequestbody, true);

    this.store.pipe(select(getContactDetailsById(contactId))).subscribe(res => {
      console.log("got response from selector details")
      console.log(res);
      this.isLoading = false;
      if (res) {
        this.SingleContactname = res.FName + ' ' + res.LName
      }
    });
    // this.contactconversation.getParentHeaderData().subscribe(x => {
    //   this.headerData = x;
    //   this.userdat.cachedArray = x;
    // });
    //this is for profile image
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
    })
  }

  getAllActivityData(reqBody, isConcat) {
    this.isLoading = true;
    let useFulldata = {
      pageNo: this.AllActivityRequestbody.RequestedPageNumber,
      id: this.ContactParentId,
      pageSize: 50
    }
    let reqparam = this.contactconversation.GetAppliedFilterData({ ...reqBody, useFulldata: useFulldata })
    this.contactconversation.getRelationShipLogMeetingFilterList(reqparam).subscribe(resData => {
      if (!resData.IsError) {
        this.isLoading = false;
        console.log("contact activity list", resData.ResponseObject);
        if (resData.ResponseObject.length > 0) {

          const ImmutableObject = Object.assign({}, resData)
          const perPage = reqBody.PageSize;
          const start = ((reqBody.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;
          console.log(start + " - " + end);
          resData.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          });

          this.AllActivityRequestbody = reqBody;
          if (resData.OdatanextLink) {
            this.AllActivityRequestbody.OdatanextLink = resData.OdatanextLink
          }
          if (isConcat) {
            let spliceArray = [];
            this.contactConversationTable.map((res) => {
              if (res.index >= start && res.index <= end) {
                spliceArray.push(res);
              }
            });
            spliceArray.map(res => {
              this.contactConversationTable.splice(this.contactConversationTable.indexOf(res), 1);
            })

            this.contactConversationTable = this.contactConversationTable.concat(this.getTableFilterData(resData.ResponseObject))
            console.log("contact Conversation Table", this.contactConversationTable);
          } else {
            this.contactConversationTable = this.getTableFilterData(resData.ResponseObject)
            console.log("contact Conversation Table", this.contactConversationTable);
          }
          this.tableTotalCount = resData.TotalRecordCount
        } else {
          this.tableTotalCount = 0
          this.contactConversationTable = [{}]
        }
      } else {
        this.isLoading = false;
        this.OnError(resData.Message);
        if (reqBody.RequestedPageNumber > 1)
          this.AllActivityRequestbody.RequestedPageNumber = this.AllActivityRequestbody.RequestedPageNumber - 1
      }
    },
      error => {
        this.isLoading = false;
      })
  }

  getTableFilterData(tableData): Array<any> {
    if (tableData) {
      console.log("Activities list table data", tableData);
      if (tableData.length > 0) {
        console.log("contacts table data", tableData);
        return tableData.map(res => {
          return {
            "Agenda": res.Subject ? res.Subject.trim() : "NA",
            "MeetingType": res.MeetingType ? res.MeetingType.Value ? res.MeetingType.Value : "NA" : "NA",
            "AccountName": res.ActivityGroup ? res.ActivityGroup.Account ? res.ActivityGroup.Account.Name ? res.ActivityGroup.Account.Name : "NA" : "NA" : "NA",
            "CustomerContacts": res.CustomerContacts ? res.CustomerContacts.length > 0 ? this.contactsFilter(res.CustomerContacts) : ["NA"] : ["NA"],
            "WiproAttendees": res.WiproParticipant ? res.WiproParticipant.length > 0 ? this.wiproAttendesFilter(res.WiproParticipant) : ["NA"] : ["NA"],
            "TagUserToView": res.TagUserToView ? res.TagUserToView.length > 0 ? this.taggedToViewCustomerFilter(res.TagUserToView) : ["NA"] : ["NA"],
            "DateCreated": res.CreatedOn ? res.CreatedOn : "NA",
            "Leadslinked": res.Lead ? res.Lead.length > 0 ? this.leadsFilterName(res.Lead) : ["NA"] : ["NA"],
            "OppLinked": res.OrdersAndOpportunity ? res.OrdersAndOpportunity.length > 0 ? this.opportunityFiter(res.OrdersAndOpportunity) : ["NA"] : ["NA"],
            "isCheccked": res.isChecked ? res.isChecked : false,
            "SysGuid": res.Guid ? res.Guid : "NA",
            "MOM": (res.MOM) ? res.MOM : '',
            "unfavouriteBtnVisibility": res.IsPivotal,
            "favouriteBtnVisibility": !res.IsPivotal,
            "isRowFavorite": res.IsPivotal,
            "accountSysguid": res.ActivityGroup ? res.ActivityGroup.Account ? res.ActivityGroup.Account.SysGuid ? res.ActivityGroup.Account.SysGuid : "NA" : "NA" : "NA",
            "index": res.index,
            "CustomerContactsGuid": res.CustomerContacts ? res.CustomerContacts.length > 0 ? res.CustomerContacts : [] : [],
            "WiproAttendeesGuid": res.WiproParticipant ? res.WiproParticipant.length > 0 ? res.WiproParticipant : [] : [],
            "TagUserToViewGuid": res.TagUserToView ? res.TagUserToView.length > 0 ? res.TagUserToView : [] : [],
            "Attachments": res.Attachments ? res.Attachments.length > 0 ? res.Attachments : [] : [],
            "LinkedActivity": res.ActivityGroup ? res.ActivityGroup : null,
            "LinkedCampaign": res.Campaign ? res.Campaign : null,
            "LinkedCustomers": res.CustomerContacts ? res.CustomerContacts : null,
            "LinkedOpportunity": res.OrdersAndOpportunity ? res.OrdersAndOpportunity : null,
            "AccisProspect": res.ActivityGroup ? res.ActivityGroup.Account ? res.ActivityGroup.Account.isProspect != undefined ? res.ActivityGroup.Account.isProspect : false : false : false,
          };
        });
      } else {
        return []
      }
    } else {
      return []
    }
  }

  Createopp(data) {
    console.log("data recevied", data);
    this.router.navigate(['/opportunity/newopportunity']);
  }

  leadsFilterName(data): Array<any> {
    try {
      let leadArray = []
      data.map(x => leadArray.push(x.Title))
      return leadArray
    } catch (error) {
      return ["NA"]
    }
  }

  opportunityFiter(data): Array<any> {
    try {
      let Opportunity = []
      data.map(x => Opportunity.push(x.Name))
      return Opportunity
    } catch (error) {
      return ["NA"]
    }
  }

  contactsFilter(data): Array<any> {
    try {
      let contacts = []
      data.map(x => contacts.push(x.FullName))
      return contacts
    } catch (error) {
      return ["NA"]
    }
  }

  wiproAttendesFilter(data): Array<any> {
    try {
      let wiproAttribute = []
      data.map(x => wiproAttribute.push(x.FullName))
      return wiproAttribute
    } catch (error) {
      return ["NA"]
    }
  }

  taggedToViewCustomerFilter(data): Array<any> {
    try {
      let wiproAttribute = []
      data.map(x => wiproAttribute.push(x.FullName))
      return wiproAttribute
    } catch (error) {
      return ["NA"]
    }
  }

  SearchTable(data): void {
    this.isLoading = false
    console.log('contact search data-->', data)
    this.AllActivityRequestbody.RequestedPageNumber = 1
    this.AllActivityRequestbody.OdatanextLink = ""
    if (data != "") {
      if (data.objectRowData != "" && data.objectRowData != undefined) {
        let useFulldata = {
          pageNo: this.AllActivityRequestbody.RequestedPageNumber,
          id: this.ContactParentId,
          pageSize: 50
        }
        let reqparam = this.contactconversation.GetAppliedFilterData({ ...data, useFulldata: useFulldata })
        this.contactconversation.getRelationShipLogMeetingFilterList(reqparam).subscribe(res => {
        // this.contactService.getSearchContactConversation(this.ContactEditID, 1, data.objectRowData).subscribe(res => {
          debugger
          if (!res.IsError) {
            this.isLoading = false
            if (res.ResponseObject.length > 0) {
              let i = 1;
              res.ResponseObject.map(res => {
                res.index = i;
                i = i + 1;
              })
              console.log('Search Contact Conversation Table data', res.ResponseObject)
              this.contactConversationTable = this.getTableFilterData(res.ResponseObject)
              this.AllActivityRequestbody.OdatanextLink = res.OdatanextLink
              this.tableTotalCount = res.TotalRecordCount
            }
            else {
              this.contactConversationTable = [{}]
              this.tableTotalCount = 0
            }
          } else {
            this.isLoading = false
            this.contactConversationTable = [{}]
            this.errorMessage.throwError(res.Message);
          }
        }, error => {
          this.isLoading = false
          this.contactConversationTable = [{}]
        })
      } else {
        this.isLoading = false
        this.getAllActivityData(this.AllActivityRequestbody, false);
      }
    } else {
      this.isLoading = false
    }
  }

  performTableChildAction(childActionRecieved): Observable<any> {
    console.log('childActionReceived---->', childActionRecieved)
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {
      case 'search': {
        this.isLoading = false;
        this.SearchTable(actionRequired);
        return;
      }
      case 'tabNavigation':
        {
          this.TabNavigation(childActionRecieved.objectRowData[0])
          return
        }

      case 'DownloadCSV': {
        console.log("downloafing")
        this.downloadList(childActionRecieved);
        return
      }

      case "columnFilter": {
        this.GetColumnFilters(childActionRecieved);
        return
      }

      case "columnSearchFilter": {
        this.GetColumnSearchFilters(childActionRecieved)
        return
      }
      case 'loadMoreFilterData': {
        this.LoadMoreColumnFilter(childActionRecieved)
        return
      }

      case 'sortHeaderBy':{
        this.AllActivityRequestbody.OdatanextLink=''
        this.AllActivityRequestbody.RequestedPageNumber=1
        this.CallListDataWithFilters(childActionRecieved);
        return
      }

      case 'Agenda':
        {
          let encId = this.encrDecrService.set("EncryptionEncryptionEncryptionEn", childActionRecieved.objectRowData[0].SysGuid, "DecryptionDecrip");
          sessionStorage.setItem("MeetingListRowId", JSON.stringify(encId))
          sessionStorage.setItem('navigation',JSON.stringify(5));
          this.router.navigate(['/activities/meetingInfo']);
          return
        }
    }
  }

  GetColumnSearchFilters(data) {
    let headerName = data.filterData.headerName
    this.AllActivityRequestbody.OdatanextLink = ''
    this.filterConfigData[headerName].PageNo = 1
    this.filterConfigData[headerName].NextLink = ''
    this.generateFilterConfigData(data, headerName, false, true)
  }

  LoadMoreColumnFilter(data) {
    let headerName = data.filterData.headerName
    this.filterConfigData[headerName].PageNo = this.filterConfigData[headerName].PageNo + 1
    this.generateFilterConfigData(data, headerName, true, true)
  }


  // downLoad List
  downloadList(data): void {
    this.isLoading = true
    let useFulldata = {
      pageNo: this.AllActivityRequestbody.RequestedPageNumber,
      id: this.ContactParentId,
      pageSize: 50
    }
    let reqBody = this.contactconversation.GetAppliedFilterData({ ...data, useFulldata: useFulldata})
    this.contactconversation.downRelationshipMeetingList(reqBody).subscribe(res => {

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

  //Download list for mobile
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
    }
    );
  }



  //----------------------------------- Start filter table  ----------------------------------

  filterConfigData = {
    Agenda: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    MeetingType: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    AccountName: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    CustomerContacts: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    WiproAttendees: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    DateCreated: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Leadslinked: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    OppLinked: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    isFilterLoading: false
  };

  GetColumnFilters(data) {
    if (data.filterData) {

      if (!data.filterData.isApplyFilter) {

        let headerName = data.filterData.headerName;
        this.filterConfigData[headerName].data = []
        this.filterConfigData[headerName].PageNo = 1

        this.generateFilterConfigData(data, headerName, false, this.CheckFilterServiceFlag(data, headerName))
      } else {
        if (data.filterData.isApplyFilter && this.userdat.CheckFilterFlag(data)) {
          this.AllActivityRequestbody.OdatanextLink = ''
          this.AllActivityRequestbody.RequestedPageNumber = 1
          this.CallListDataWithFilters(data)
        } else if (data.filterData.isApplyFilter && data.filterData.globalSearch != "") {
          this.CallListDataWithFilters(data)
        } else {
          this.AllActivityRequestbody.OdatanextLink = ''
          this.AllActivityRequestbody.RequestedPageNumber = 1
          this.getAllActivityData(this.AllActivityRequestbody, false)
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
        nextLink: this.filterConfigData[headerName].NextLink,
        id: this.ContactParentId,
        RequestedPageNumber:this.filterConfigData[headerName].PageNo
      }
      this.contactconversation.getFilterSwitchListData({ ...data, useFulldata: useFulldata}).subscribe(res => {
        this.filterConfigData.isFilterLoading = false;
        if (!res.IsError) {
          this.filterConfigData[headerName] = {
            data: (isConcat) ? this.filterConfigData[headerName]["data"].concat(res.ResponseObject) : res.ResponseObject,
            recordCount: res.TotalRecordCount,
            NextLink: res.OdatanextLink,
            PageNo: res.CurrentPageNumber
          }
          //display the selected value in filter list
          data.filterData.filterColumn[headerName].forEach(res => {
            let index = this.filterConfigData[headerName].data.findIndex(x => x.id == res.id)
            if (index !== -1) {
              this.filterConfigData[headerName].data[index].isDatafiltered = true
            }
          });
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
      pageNo: this.AllActivityRequestbody.RequestedPageNumber,
      id: this.ContactParentId,
      pageSize: 50
    }
   
    let reqparam = this.contactconversation.GetAppliedFilterData({ ...data, useFulldata: useFulldata })
    this.contactconversation.getRelationShipLogMeetingFilterList(reqparam).subscribe(res => {
      console.log(res)
      if (!res.IsError) {
        if (res.ResponseObject.length > 0) {

          const ImmutableObject = Object.assign({}, res)
          const perPage = reqparam.PageSize;
          const start = ((reqparam.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;
          console.log(start + " - " + end);

          res.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          })

          this.contactConversationTable = this.getTableFilterData(res.ResponseObject)
          this.AllActivityRequestbody.OdatanextLink = res.OdatanextLink
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.contactConversationTable = [{}]
          this.tableTotalCount = 0
        }
      } else {
        this.contactConversationTable = [{}]
        this.tableTotalCount = 0
        this.errorMessage.throwError(res.Message)
      }
    })
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

  RemoveSelectedItems(array1, array2, key) {
    return array1.filter(item1 =>
      !array2.some(item2 => (item2[key] === item1[key])))
  }

  //---------------------------------------- end filter table ------------------------------------


  TabNavigation(item) {
    console.log("Table nevigation for Activity")
    console.log(item)
    switch (item.index) {
      case 0:
        this.router.navigate(['/contacts/contactconversation']);
        return
      case 1:
        this.router.navigate(['/contacts/contactarchive']);
        return
    }
  }

  OnError(message) {
    let action;
    this.matSnackBar.open(message, action, {
      duration: 4000
    });
  }
  //end
  filteredData(item) {
    this.searchitem = '';
    this.filterBox = {};
    this.myFilter = [];
    this.headerData.forEach(element => {
      if (element.name == item.name) {
        element.isFilter = !element.isFilter;
      }
      else {
        element.isFilter = false;
      }
    });
    if (item.isFilter) {
      var items = [];
      var pluckedItem = from(this.userArray).pipe(pluck(item.name)).subscribe(x => items.push(x));
      var unique = {};
      var distinct = [];
      items.forEach(function (x) {
        if (!unique[x]) {
          distinct.push({ name: x, isDatafiltered: false });
          unique[x] = true;
        }
      });
      this.filterCheckBox = distinct;
    }
  }

  showcheckbox(item) {
    if (!item.isFilter) {
      if (this.myString != item.name) {
        this.myString = item.name;
        this.filteredData(item);
      }
      else {
        item.isFilter = true;
      }
    }
    else {
      item.isFilter = false;
    }
  }
  check: boolean = false;
  selectall;
  headerName
  titleShow(name, index) {
    this.headerName = name;
  }
  onClickedOutside(e: Event) {
    this.showMoreOptions = false;
  }
  opendelete() {
    const dialogRef = this.dialog.open(deletepopComponentcon,
      {
        width: '396px',
      });
  }

}

@Component({
  selector: 'delete-pop',
  templateUrl: './delete-pop.html',
})
export class deletepopComponentcon {
  constructor(public service: DataCommunicationService) { }
}
