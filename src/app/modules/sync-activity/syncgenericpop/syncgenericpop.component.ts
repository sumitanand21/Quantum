import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { MeetingService } from '@app/core/services/meeting.service';
import { newConversationService } from '@app/core/services/new-conversation.service';
import { ErrorMessage, DataCommunicationService } from '@app/core';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-syncgenericpop',
  templateUrl: './syncgenericpop.component.html',
  styleUrls: ['./syncgenericpop.component.scss']
})
export class SyncgenericpopComponent implements OnInit {
  tabClikedIndex: number = 0
  tabLookupData = {
    tabs: [],
    isSearch: true,
    popupName: "",
    isLookupLoading: false,
    SelectedData: [],
    buttonName: "Select participants"
  }
  searchData: string = '';
  selectedAccount: any
  leadsSearch: Array<any> = [];
  OpportunitiesSearch: Array<any> = [];
  private searchText$ = new Subject<string>();
  isButtonEnable: boolean = false
  isSelectAllChecked: boolean = false
  selectAll: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<SyncgenericpopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public meetingService: MeetingService,
    public newConversationService: newConversationService,
    public errorMessage: ErrorMessage,
    public dialog: MatDialog,
    private datepipe: DatePipe,
    public service: DataCommunicationService
  ) {
    debugger;
    this.selectedAccount = this.data.account
    this.data.actionName === 'Participant' ? this.participantTabMapping() : this.leadTabMapping();
  }

  ngOnInit() {
    this.searchText$.pipe(debounceTime(1000)).subscribe(x => {
      this.serviceSearchData();
    })
  }

  participantTabMapping() {
    this.tabLookupData.tabs = [
      {
        title: "wipro participants",
        icon: "mdi-account",
        placeholder: "search Wipro participants",
        TotalRecordCount: 0,
        OdatanextLink: '',
        CurrentPageNumber: 0,
        isClicked: true,
        header: this.participantsHeaders(),
        data: [],
        selectedData: []
      },
      {
        title: "customer participants",
        icon: "mdi-account-multiple",
        placeholder: "search customer participants",
        TotalRecordCount: 0,
        OdatanextLink: '',
        CurrentPageNumber: 0,
        isClicked: false,
        header: this.participantsHeaders(),
        data: [],
        selectedData: []
      }
    ]
    this.tabLookupData.popupName = 'Links participants';
    this.tabLookupData.tabs[0].selectedData = this.data.selectedData.filter(res => res.isCustomer === false);
    this.tabLookupData.tabs[1].selectedData = this.data.selectedData.filter(res => res.isCustomer === true);
    if ([...this.tabLookupData.tabs[0].selectedData, ...this.tabLookupData.tabs[1].selectedData].length > 0) {
      this.isButtonEnable = true
    } else {
      this.isButtonEnable = false
    }
    if (this.data.isSearch) {
      this.wiproParticipants();
    } else {
      this.participantsPatch();
    }
  }

  participantsPatch() {
    this.tabLookupData.buttonName = 'Okay';
    this.tabLookupData.tabs[0].data = this.data.data.filter(res => res.isCustomer === false);
    this.tabLookupData.tabs[0].TotalRecordCount = this.tabLookupData.tabs[0].selectedData.length;
    this.tabLookupData.tabs[1].data = this.data.data.filter(res => res.isCustomer === true);
    this.tabLookupData.tabs[1].TotalRecordCount = this.tabLookupData.tabs[1].selectedData.length;
    this.tabLookupData.tabs[0].data.forEach(res => {
      res.isChecked = false;
    });
    this.tabLookupData.tabs[1].data.forEach(res => {
      res.isChecked = false;
    });
  }

  participantsHeaders() {
    return [
      {
        id: 1,
        title: "Full name",
        name: "name",
      },
      {
        id: 2,
        title: "Account name",
        name: "accountName",
      },
      {
        id: 3,
        title: "Designation",
        name: "designation"
      },
      {
        id: 4,
        title: "Email Id",
        name: "email"
      }
    ]
  }

  leadTabMapping() {
    this.tabLookupData.buttonName = 'Select leads'
    this.tabLookupData.tabs = [
      {
        title: "Leads",
        icon: "mdi-account",
        placeholder: "search leads",
        TotalRecordCount: 0,
        OdatanextLink: '',
        CurrentPageNumber: 0,
        isClicked: true,
        header: this.LeadsHeaders(),
        data: [],
        selectedData: []
      },
      {
        title: "Opportunities",
        icon: "mdi-account-multiple",
        placeholder: "search opportunities",
        TotalRecordCount: 0,
        OdatanextLink: '',
        CurrentPageNumber: 0,
        isClicked: false,
        header: [
          {
            id: 1,
            title: "Opportunity name",
            name: "name",
          },
          {
            id: 2,
            title: "Opportunity owner",
            name: "owner"
          },
          {
            id: 3,
            title: "Status",
            name: "status"
          }
        ],
        data: [],
        selectedData: []
      }
    ]
    this.tabLookupData.popupName = 'Linked leads/Opportunities';
    this.tabLookupData.tabs[0].selectedData = this.data.selectedData.filter(res => res.isLead === true);
    this.tabLookupData.tabs[1].selectedData = this.data.selectedData.filter(res => res.isLead === false);
    if ([...this.tabLookupData.tabs[0].selectedData, ...this.tabLookupData.tabs[1].selectedData].length > 0) {
      this.isButtonEnable = true
    } else {
      this.isButtonEnable = false
    }
    if (this.data.isSearch) {
      this.leads();
    } else {
      this.patchLeads()
    }
  }

  LeadsHeaders() {
    return [
      {
        id: 1,
        title: "Lead name",
        name: "name",
      },
      {
        id: 2,
        title: "Owner",
        name: "owner"
      },
      {
        id: 3,
        title: "Source",
        name: "source"
      },
      {
        id: 4,
        title: "Date created",
        name: "dateCreated"
      }
    ]
  }

  patchLeads() {
    this.tabLookupData.buttonName = 'Okay';
    this.tabLookupData.tabs[0].data = this.data.data.filter(res => res.isLead === true);
    this.tabLookupData.tabs[0].TotalRecordCount = this.tabLookupData.tabs[0].selectedData.length;
    this.tabLookupData.tabs[1].data = this.data.data.filter(res => res.isLead === false);
    this.tabLookupData.tabs[1].TotalRecordCount = this.tabLookupData.tabs[1].selectedData.length;
    this.tabLookupData.tabs[0].data.forEach(res => {
      res.isChecked = false;
    });
    this.tabLookupData.tabs[1].data.forEach(res => {
      res.isChecked = false;
    });
  }

  onClickTab(i: number) {
    this.tabClikedIndex = i
    this.isSelectAllChecked = false;
    if (i === 0) {
      this.tabLookupData.tabs[i].isClicked = true;
      this.tabLookupData.tabs[i + 1].isClicked = false;
      this.searchData = ''
    } else {
      this.tabLookupData.tabs[i].isClicked = true;
      this.tabLookupData.tabs[i - 1].isClicked = false;
      if (this.data.actionName === 'Participant') {
        if (this.data.isSearch) {
          this.customerParticipants();
        }
      } else {
        if (this.data.isSearch) {
          this.tabLookupData.buttonName = 'Select opportunities'
          this.Opportunities();
        }
      }
      this.searchData = ''
    }
  }

  onReachEnd(event, id) {
    document.getElementById(id).click();
  }

  loadMoreEvent() {
    console.log("lode more")
    if (this.data.isSearch) {
      if (this.tabLookupData.tabs[this.tabClikedIndex].data.length > 0 && this.tabLookupData.tabs[this.tabClikedIndex].data.length < this.tabLookupData.tabs[this.tabClikedIndex].TotalRecordCount) {
        this.tabLookupData.isLookupLoading = true;
        console.log("lode more")
        if (this.data.actionName === 'Participant') {
          if (this.tabClikedIndex == 0) {
            this.wiproParticipants();
          } else {
            this.customerParticipants();
          }
        } else {
          if (this.tabClikedIndex == 0) {
            this.leads();
          } else {
            this.Opportunities();
          }
        }
      }
    }
  }

  onSearch() {
    console.log(this.searchData)
    this.searchText$.next(this.searchData)
  }

  serviceSearchData() {
    console.log('serviceSearchData')
    this.tabLookupData.tabs[this.tabClikedIndex].TotalRecordCount = 0;
    this.tabLookupData.tabs[this.tabClikedIndex].CurrentPageNumber = 0;
    this.tabLookupData.tabs[this.tabClikedIndex].OdatanextLink = '';
    this.tabLookupData.tabs[this.tabClikedIndex].data = []
    if (this.data.actionName === 'Participant') {
      if (this.tabClikedIndex == 0) {
        this.wiproParticipants()
      }
      else {
        this.customerParticipants()
      }
    } else {
      if (this.tabClikedIndex == 0) {
        this.leads()
      }
      else {
        this.Opportunities()
      }
    }
  }

  wiproParticipants() {
    this.tabLookupData.isLookupLoading = true;
    let body = {
      "SearchText": this.searchData,
      "PageSize": 10,
      "OdatanextLink": this.tabLookupData.tabs[this.tabClikedIndex].OdatanextLink,
      "RequestedPageNumber": this.tabLookupData.tabs[this.tabClikedIndex].CurrentPageNumber + 1
    }
    this.newConversationService.searchUser("", body).subscribe(res => {
      this.tabLookupData.isLookupLoading = false;
      if (!res.IsError) {
        this.tabLookupData.tabs[this.tabClikedIndex].data = [...this.tabLookupData.tabs[this.tabClikedIndex].data, ...this.wiproParticipantsData(res.ResponseObject)];
        console.log(this.tabLookupData.tabs[this.tabClikedIndex].data)
        this.apiInfo(res);
        this.displaySelected();
      } else {
        this.errorMessage.throwError(res.Message);
      }
    }, error => {
      this.tabLookupData.isLookupLoading = false;
    })
  }

  customerParticipants() {
    this.tabLookupData.isLookupLoading = true;
    let body = {
      "SearchText": this.searchData,
      "Guid": this.selectedAccount.id,
      "isProspect": this.selectedAccount.isProspect,
      "PageSize": 10,
      "OdatanextLink": this.tabLookupData.tabs[this.tabClikedIndex].OdatanextLink,
      "RequestedPageNumber": this.tabLookupData.tabs[this.tabClikedIndex].CurrentPageNumber + 1
    }
    this.meetingService.searchCustomerparticipants('', this.selectedAccount.id, this.selectedAccount.isProspect, body).subscribe(res => {
      this.tabLookupData.isLookupLoading = false;
      if (!res.IsError) {
        this.tabLookupData.tabs[this.tabClikedIndex].data = [...this.tabLookupData.tabs[this.tabClikedIndex].data, ...this.customerParticipantsData(res.ResponseObject)];
        this.apiInfo(res);
        this.displaySelected();
      } else {
        this.errorMessage.throwError(res.Message);
      }
    }, error => {
      this.tabLookupData.isLookupLoading = false;
    })
  }

  leads() {
    this.tabLookupData.isLookupLoading = true;
    let body = {
      "SearchText": this.searchData,
      "Guid": this.selectedAccount.id,
      "SearchType": 3,
      "isProspect": this.selectedAccount.isProspect,
      "PageSize": 10,
      "OdatanextLink": this.tabLookupData.tabs[this.tabClikedIndex].OdatanextLink,
      "RequestedPageNumber": this.tabLookupData.tabs[this.tabClikedIndex].CurrentPageNumber + 1
    }
    this.meetingService.SearchLeadBasedOnAccount(this.selectedAccount.id, '', this.selectedAccount.isProspect, body).subscribe(res => {
      this.tabLookupData.isLookupLoading = false;
      if (!res.IsError) {
        this.tabLookupData.tabs[this.tabClikedIndex].data = [...this.tabLookupData.tabs[this.tabClikedIndex].data, ...this.leadsData(res.ResponseObject)];
        this.apiInfo(res);
        this.displaySelected();
      }
      else {
        this.errorMessage.throwError(res.Message);
      }
    }, error => {
      this.tabLookupData.isLookupLoading = false;
    })
  }

  Opportunities() {
    this.tabLookupData.isLookupLoading = true;
    let body = {
      "Guid": this.selectedAccount.id,
      "SearchText": this.searchData,
      "isProspect": this.selectedAccount.isProspect,
      "PageSize": 10,
      "OdatanextLink": this.tabLookupData.tabs[this.tabClikedIndex].OdatanextLink,
      "RequestedPageNumber": this.tabLookupData.tabs[this.tabClikedIndex].CurrentPageNumber + 1
    }
    this.tabLookupData.isLookupLoading = true;
    this.meetingService.SearchOrderAndOppBasedOnAccount(this.selectedAccount.id, "", this.selectedAccount.isProspect, body).subscribe(res => {
      this.tabLookupData.isLookupLoading = false;
      if (!res.IsError) {
        console.log(res.ResponseObject.length)
        this.tabLookupData.tabs[this.tabClikedIndex].data = [...this.tabLookupData.tabs[this.tabClikedIndex].data, ...this.opportunitiesData(res.ResponseObject)];
        // this.tabLookupData.tabs[this.tabClikedIndex].TotalRecordCount = res.ResponseObject.length;
        this.tabLookupData.tabs[this.tabClikedIndex].TotalRecordCount = res.TotalRecordCount;
        this.tabLookupData.tabs[this.tabClikedIndex].CurrentPageNumber = 1;
        this.tabLookupData.tabs[this.tabClikedIndex].OdatanextLink = '';
        this.displaySelected();
      }
      else {
        this.errorMessage.throwError(res.Message);
      }
    }, error => {
      this.tabLookupData.isLookupLoading = false;
    })
  }

  apiInfo(res) {
    this.tabLookupData.tabs[this.tabClikedIndex].TotalRecordCount = res.TotalRecordCount;
    this.tabLookupData.tabs[this.tabClikedIndex].CurrentPageNumber = res.CurrentPageNumber;
    this.tabLookupData.tabs[this.tabClikedIndex].OdatanextLink = res.OdatanextLink ? res.OdatanextLink : '';
  }

  wiproParticipantsData(data) {
    if (data) {
      return data.map(res => {
        try {
          return {
            id: res.SysGuid,
            name: res.FullName,
            accountName: 'NA',
            designation: res.Designation ? res.Designation : 'NA',
            email: res.Email ? res.Email : 'NA',
            isChecked: this.isSelectAllChecked,
            isCustomer: false
          }
        } catch (error) {
          return []
        }
      })
    } else {
      return []
    }
  }

  customerParticipantsData(data) {
    if (data) {
      return data.map(res => {
        try {
          return {
            id: res.Guid,
            name: res.FullName,
            accountName: res.CustomerAccount.Name,
            designation: res.Designation ? res.Designation : 'NA',
            email: res.Email ? res.Email : 'NA',
            isChecked: this.isSelectAllChecked,
            isCustomer: true
          }
        } catch (error) {
          return []
        }
      })
    } else {
      return []
    }
  }

  leadsData(data) {
    if (data) {
      return data.map(res => {
        try {
          return {
            id: res.LeadGuid,
            name: res.Name,
            owner: res.Owner.FullName,
            source: res.Source.Name,
            dateCreated: this.datepipe.transform(res.CreatedOn, 'dd-MM-yyyy'),
            isChecked: this.isSelectAllChecked,
            isLead: true
          }
        } catch (error) {
          return []
        }
      })
    } else {
      return []
    }
  }

  opportunitiesData(data) {
    if (data) {
      return data.map(res => {
        try {
          return {
            id: res.Guid,
            name: res.Title,
            owner: res.OwnerName ? res.OwnerName : "NA",
            status: res.Status ? res.Status : "NA",
            Type: res.Type,
            isChecked: this.isSelectAllChecked,
            isLead: false
          }
        } catch (error) {
          return []
        }
      })
    } else {
      return []
    }
  }

  onSelectAll(event) {
    if (this.data.isSearch) {
      this.tabLookupData.tabs[this.tabClikedIndex].data.forEach(res => {
        res.isChecked = event.checked;
      });
      this.isButtonEnable = event.checked;
      this.isSelectAllChecked = event.checked
      if (event.checked) {
        let selectedAllItems = [...this.tabLookupData.tabs[this.tabClikedIndex].selectedData, ...this.tabLookupData.tabs[this.tabClikedIndex].data]
        this.tabLookupData.tabs[this.tabClikedIndex].selectedData = this.service.removeDuplicates(selectedAllItems, "id");
      } else {
        this.tabLookupData.tabs[this.tabClikedIndex].selectedData = [];
      }
    } else {
      this.tabLookupData.tabs[this.tabClikedIndex].data.forEach(res => {
        res.isChecked = event.checked;
      });
      this.isButtonEnable = true;
      this.isSelectAllChecked = true;
      this.selectAll = event.checked;
    }
  }

  onDelet(id) {
    this.tabLookupData.tabs[this.tabClikedIndex].data = this.tabLookupData.tabs[this.tabClikedIndex].data.filter(res => res.id !== id)
    this.tabLookupData.tabs[this.tabClikedIndex].selectedData = this.tabLookupData.tabs[this.tabClikedIndex].selectedData.filter(res => res.id !== id)
    this.tabLookupData.tabs[this.tabClikedIndex].TotalRecordCount = this.tabLookupData.tabs[this.tabClikedIndex].TotalRecordCount - 1
  }

  onDeletAll() {
    this.tabLookupData.tabs[this.tabClikedIndex].data = [];
    this.tabLookupData.tabs[this.tabClikedIndex].selectedData = [];
    this.tabLookupData.tabs[this.tabClikedIndex].TotalRecordCount = 0
  }

  diableCondition(event, id) {
    let data = this.tabLookupData.tabs[this.tabClikedIndex].data.filter(res => res.isChecked !== false)
    if (event.checked === true) {
      if (this.tabLookupData.tabs[this.tabClikedIndex].data.length > 0) {
        if (data.length > 0) {
          let selectedItems = [...this.tabLookupData.tabs[this.tabClikedIndex].selectedData, ...data]
          this.tabLookupData.tabs[this.tabClikedIndex].selectedData = this.service.removeDuplicates(selectedItems, "id");
          this.isButtonEnable = true;
        } else {
          this.tabLookupData.tabs[this.tabClikedIndex].selectedData = data
          this.isButtonEnable = false;
        }
        if (data.length > 1) {
          this.selectAll = true;
        } else {
          this.selectAll = false
        }
        if (this.tabLookupData.tabs[this.tabClikedIndex].data.length == data.length) {
          this.isSelectAllChecked = true;
        }
        else {
          this.isSelectAllChecked = false;
        }
      }
    }
    else {
      this.tabLookupData.tabs[this.tabClikedIndex].selectedData = this.tabLookupData.tabs[this.tabClikedIndex].selectedData.filter(res => res.id !== id)
      if (this.tabLookupData.tabs[this.tabClikedIndex].selectedData.length === 0) {
        this.isSelectAllChecked = false;
        this.isButtonEnable = false
      } else {
        this.isSelectAllChecked = true;
        this.isButtonEnable = true;
      }
      if (this.tabLookupData.tabs[this.tabClikedIndex].data.length == data.length) {
        this.isSelectAllChecked = true;
      }
      else {
        this.isSelectAllChecked = false;
      }
      this.selectAll = false
    }
  }

  onSendFilterData() {
    let data = []
    if (this.data.actionName === 'Participant') {
      data = [...this.tabLookupData.tabs[0].selectedData, ...this.tabLookupData.tabs[1].selectedData]
    } else {
      data = [...this.tabLookupData.tabs[0].selectedData, ...this.tabLookupData.tabs[1].selectedData]
    }
    this.dialogRef.close({ data: data, isCreateCustomer: false })
  }

  onClose() {
    this.dialogRef.close()
  }

  displaySelected() {
    this.tabLookupData.tabs[this.tabClikedIndex].selectedData.forEach(res => {
      let index = this.tabLookupData.tabs[this.tabClikedIndex].data.findIndex(x => x.id == res.id)
      if (index !== -1) {
        this.tabLookupData.tabs[this.tabClikedIndex].data[index].isChecked = true
      }
    })
    let data = this.tabLookupData.tabs[this.tabClikedIndex].data.filter(res => res.isChecked !== false)
    let selectedDisplayItems = [...this.tabLookupData.tabs[this.tabClikedIndex].selectedData, ...data]
    this.tabLookupData.tabs[this.tabClikedIndex].selectedData = this.service.removeDuplicates(selectedDisplayItems, "id");
  }
  onclickCustomerCreate() {
    let data = []
    if (this.data.actionName === 'Participant') {
      data = [...this.tabLookupData.tabs[0].selectedData, ...this.tabLookupData.tabs[1].selectedData]
    } else {
      data = [...this.tabLookupData.tabs[0].selectedData, ...this.tabLookupData.tabs[1].selectedData]
    }
    this.dialogRef.close({ data: data, isCreateCustomer: true })
  }
}
