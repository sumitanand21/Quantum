import { Component, OnInit, Output, EventEmitter, Inject, Input, HostListener, ViewChild, ElementRef, OnChanges, DoCheck } from '@angular/core';
import { Observable, of, concat, from } from 'rxjs';
import { map, filter, pluck, groupBy, mergeMap, toArray } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AccountService } from '@app/core/services/account.service';
import { OverviewHistoryPopupComponent } from '@app/shared/components/single-table/Sprint3Models/overview-history-popup/overview-history-popup.component';

// import { User,User1 } from '../../services/user';
import { Router, RouterModule } from '@angular/router';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDatepickerInputEvent,
} from '@angular/material';
import { CdkDragDrop, CdkDragEnter, moveItemInArray, transferArrayItem, copyArrayItem, } from '@angular/cdk/drag-drop';
import { PaginationInstance } from 'ngx-pagination';
import { DataCommunicationService } from '@app/core/services/global.service';
import { actionListService, CommentList, MasterApiService, conversationheader, ConversationService, OfflineService, routes } from '@app/core';
import { newConversationService } from '@app/core/services/new-conversation.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { getActivityDetailsById, getActivityListById } from '@app/core/state/selectors/activity/activity.selector';
import { MeetingService } from '@app/core/services/meeting.service';
import { Delete } from '../single-table/single-table.component';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';


/***********************  pop up contents ********************* */
const restoreLead = {

  ButtonLabel: "Restore",
  ModelTitle: "Restore lead ",
  SpecialText: "This lead will be be re-activated for further action ",
  isDatePicker: false,
  isRemarks: false,
  isSinglebutton: true,
  isDatePickerRequired: false,
  isRemarksRequired: false

}

const replicate = {

  ButtonLabel: "Replicate",
  ModelTitle: "Replicate activities ",
  labelForContent: 'Activity name',
  populatedContent: "Reimagine Singtel Procurement process",
  isInputBox: true,
  inputLabel: "New activities name *",
  inputPlaceholder: "Enter new activities name",
  inputContent: 'Ingredion Digital Transformation',
  isRemarks: false,
  isAccountName: false,
  isLeadName: false,
  SpecialText: "This will replicate the Activity which can be modified further.",
  isSinglebutton: true,
  isRemarksRequired: true,
  isDatePickerRequired: false,

}


const restoreConversation = {

  ButtonLabel: "Restore",
  ModelTitle: "Restore activity",
  SpecialText: "This activity will be be re-activated for further action.",
  isDatePicker: false,
  isRemarks: false,
  isSinglebutton: true,
  isDatePickerRequired: false,
  isRemarksRequired: false

}


const nutureLead = {

  ButtonLabel: "Nurture",
  ModelTitle: "Nurture lead",
  labelForContent: 'Lead name',
  SpecialText: "This lead will be nurtured.",
  isDatePicker: true,
  isRemarks: true,
  isAccountName: false,
  isLeadName: false,
  remarksLabel: "Nurture remarks *",
  remarksPlaceholder: 'Enter nurture remarks',
  datepickerLabel: 'Nurture deadline *',
  isSinglebutton: true,
  isRemarksRequired: true,
  isDatePickerRequired: true,
}


const archiveLead = {

  ButtonLabel: "Archive",
  ModelTitle: "Archive lead",
  labelForContent: 'Lead name',
  SpecialText: "This lead will be archived.",
  isDatePicker: true,
  isAccountName: false,
  isLeadName: false,
  isRemarks: true,
  remarksLabel: "Archive remarks *",
  remarksPlaceholder: 'Enter archive remarks',
  datepickerLabel: 'Set reminder prompt date *',
  isSinglebutton: true,
  isRemarksRequired: true,
  isDatePickerRequired: true,
}


const archiveConversation = {

  ButtonLabel: "Archive",
  ModelTitle: "Archive activity",
  SpecialText: "This activity group will be archived.",
  isDatePicker: true,
  isRemarks: true,
  isAccountName: true,
  isLeadName: true,
  remarksLabel: "Archive remarks *",
  remarksPlaceholder: 'Enter archive remarks',
  datepickerLabel: 'Set reminder to re-open this activity *',
  isSinglebutton: true,
  isRemarksRequired: true,
  isDatePickerRequired: true,


}


const disqualifyLead = {

  ButtonLabel: "Disqualify",
  ModelTitle: "Disqualify lead",
  SpecialText: "This lead will be disqualified and moved to Closed Leads.",
  isRemarks: true,
  isAccountName: false,
  isLeadName: false,
  remarksLabel: "Disqualify remarks *",
  remarksPlaceholder: 'Enter disqualify remarks',
  labelForContent: 'Lead name',
  isSinglebutton: true,
  isRemarksRequired: true,



}

const convertOpportunity = {

  ButtonLabel: "Create account",
  ModelTitle: "Opportunity - account",
  SpecialText: "Your current account linked does not exist, please create the account to continue to opportunity creation process.",
  isDatePicker: false,
  isRemarks: false,
  isAccountName: true,
  isSinglebutton: true,
  isRemarksRequired: false,
  isDatePickerRequired: false,


}
const closeAction = {

  ButtonLabel: "Close",
  ModelTitle: "Close action",
  SpecialText: "This action will be closed.",
  remarksLabel: "Remarks for closing this action *",
  isDatePicker: false,
  isRemarks: true,
  isLeadName: true,
  isSinglebutton: true,
  isAccountName: false,
  isRemarksRequired: true,
  isDatePickerRequired: false,
}

const deactivateContact = {

  ButtonLabel: "Deactivate",
  ModelTitle: "Deactivate contact ",
  SpecialText: "Are you sure, you want to deactivate this contact ?",
  isDatePicker: false,
  isRemarks: false,
  isLeadName: true,
  isSinglebutton: true,
  isRemarksRequired: false,
  isDatePickerRequired: false,
}
/***********************  pop up contents ********************* */
@Component({
  selector: 'app-single-dragable-table',
  templateUrl: './single-table-dragable.component.html',
  styleUrls: ['./single-table-dragable.component.scss']
})
export class SingleTableDragableComponent implements OnInit {

  @Input() TableName: string;
  @Input() totalTableCount: number;
  @Input() paginationPageNumber: any;
  @Input() IscheckBoxRequired: boolean;
  @Input() bgParentColor: string;
  @Input() IsShare: boolean;
  @Input() IsReplicate: boolean;
  @Input() IsFavorite: boolean;
  @Input() IsCampaign: boolean;
  @Input() IsCreateLead: boolean;
  @Input() IsArchive: boolean;
  @Input() IsDelete: boolean;
  @Input() IsRestore: boolean;
  @Input() IsNurture: boolean;
  @Input() IsDisqualify: boolean;
  @Input() IsEdit: boolean;
  @Input() IsMore: boolean;
  @Input() IsMoreAction: boolean;
  @Input() IsDebug: boolean;
  @Input() IsComments: boolean;
  @Input() IsDesp: boolean;
  @Input() IsQualify: boolean;
  @Input() IsCreateOpportunity: boolean;
  @Input() IsActionFixed: boolean;
  @Input() IsFreezedColumn: boolean;
  @Input() TableCollection: any;
  @Input() IsCustomizeTable: boolean;
  @Input() IsNewConversation: boolean;
  @Input() IsAddActivity: boolean;
  @Input() IsViewAction: boolean;
  @Input() IsDeativate: boolean;
  @Input() IsDropBoxRequired: boolean = true;
  @Input() orderByName;
  @Input() Config: any;
  @Input() IsTicked: boolean;
  @Input() IsCrossed: boolean;

  @Input() IsArchiveActivity: boolean;

  // Sprint 3
  @Input() IsView: any;
  @Input() IsApprove: any;
  @Input() IsReject: any;
  @Input() IsOverview: any;
  @Input() IsReview: any;
  @Input() IsActivate: any;
  @Input() IsHistory: any;
  @Input() IsApproveWithSwap: any;
  @Input() IsViewCSO_SBU: boolean;
  @Input() IsViewMore: any;
  @Input() IsEditDraft: any;

  // Sprint 4
  @Input() IsConvert: any;
  @Input() IsSelection: any;
  temTopArray = []
  @Input() AllBtnLable: any = [];
  // Sprint 5
  @Input() DownloadButton: boolean;
  @Input() IsDealClose: boolean;
  @Input() IsDealCheck: boolean;
  @Input() IsAcCheck: boolean;
  @Input() IsRadioRequired: boolean;
  @Input() IsSearch: boolean;
  @Input() IsFolder: boolean;
  @Input() IsFileLock: boolean;
  @Input() IsPackageClosed: boolean;
  @Input() IsSortBtn: boolean = true;
  @Input() IsCustomBtn: boolean = true;
  @Input() IsDeleteDeal: boolean;

  @Input() IsSend: boolean;
  @Input() IsCheck1: boolean;
  @Input() IsApprovar: boolean;
  @Input() IsRowDownload: boolean;
  @Input() IsRework: boolean;
  

  //Accordian selector generic selectors


  @Input() filterConfigData: any;
  @Input() expansionTable: string = '';
  isLoading: boolean = true;
  checkname: string = "";
  hoverchange = false;
  IsPageChangeEvent: boolean;
  //service search and pagination declarations start
  @Input() serviceSearch: boolean; //api service search make it true in parent
  hideSortFilter:boolean=false; 
  paginationLastIndex: number = 1;
  IsPaginagtion: boolean;
  //service search and pagination declarations end
  // custom-tab-dropdown start
  @Input() IsTabList: string;
  @Output() selectedValue = new EventEmitter<any>();
  @Input() TabValueSelected;
  @Input() TabList = [];
  @Input() SelectedTab;
  @Input() IsTabRequired: boolean = false;
  @Input() TabName;
  // emitSelected(e) {
  //   this.selectedValue.emit(e);
  // }
  emitSelected(selectedTabData) {
    //this.selectedValue.emit(e);

    this.detectActionValue.emit({ objectRowData: selectedTabData, action: 'tabNavigation', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
  }
  isColFilterLoader: boolean = false;

  // custom-tab-dropdown ends
  //LoadingFisrt Time Empty Avoid
  isIntialized: boolean = false;
  isChildActionTriggerd: boolean = false;
  expansionData: any
  @Input() childActionData: any
  childAction = []

  statusTextFlag;
  DummyOverlay: boolean = false;

  /***Mobile Pagination */
  isMobileDevice: boolean = false;
  isPagination: boolean = false;
  currentPageFilter: number;
  headerOverlay: boolean = false;
  streamCal: boolean = false;
  // search box ends
  headerFilterDetails = {
    globalSearch: '',
    filterColumn: {},
    order: [],
    headerName: '',
    columnSerachKey: '',
    sortOrder: false,
    sortColumn: '',
    isApplyFilter: false
  }
 //FilterClick Outside 
 fromShowCheckBox = false;
 clickedDataId = "0";
 addtionalData = {
   "filterData": []
 }
 disableScroll: boolean = false;
 filterDataStructure = {
  globalSearch: '',
  filterColumn: {},
  order: [],
  headerName: '',
  columnSerachKey: '',
  sortOrder: false,
  sortColumn: '',
  isApplyFilter: false
}
  //Split Headers
  fixedColumn;
  normalColumn;
 deviceHeight: Number = window.innerHeight - 215;
  /**Pagination Added Code **/


  @HostListener("window:scroll", ['$event'])
  onScroll(event): void {
    // debugger
    if (this.isMobileDevice && !this.tableMobFilter) {
      // console.log('event in single table', event)
      event.preventDefault();
      event.stopPropagation();
      // this.filterBox.length == 0 &&
      if (this.userArray.length < this.totalTableCount && this.isPagination) {
        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 200) {
          // console.log(this.config.currentPage);
          this.isPagination = false;
          this.isLoading = true;
          var pageCount = (this.userArray.length / 50) + 1;
          // console.log(pageCount);
          this.detectPageChangeData.emit({ objectRowData: this.userdat.serviceSearchItem, action: 'pagination', currentPage: pageCount, itemsPerPage: 50, filterData: this.headerFilterDetails });
          //   this.detectActionValue.emit({ objectRowData: this.userdat.serviceSearchItem, action: 'pagination',pageData:this.config });

        }
      }

    }
    else {
      if (this.fromShowCheckBox) {
        // this.headerData.forEach(element => {
        //   element.isFilter = false;
        // });
        
      }
    }

  }


  returnConfigData(actionName) {
    switch (actionName) {
      case 'restore':
        if (this.TableName == 'archivelead') {

          return restoreLead;
        }
        else {

          return restoreConversation;
        }

      case 'archive':
        return archiveLead;
      // if (this.TableName == 'unqualified') {

      //   return archiveLead;
      // }
      // else {

      //   return archiveConversation;
      // }


      case 'nurture':

        return nutureLead;

      case 'mularchive':

        return archiveConversation;


      case 'disqualify':

        return disqualifyLead;

      case 'convertOpportunity':

        return convertOpportunity;

      case 'replicate':

        return replicate;

      case 'debug':
        return closeAction;

      case 'deactivateContact':
        return deactivateContact


    }

  }
  @Output() detectActionValue = new EventEmitter<{ objectRowData: any, action: string, pageData: any, configData: any, filterData: any }>();
  @Output() detectPageChangeData = new EventEmitter<{ objectRowData: any, action: string, currentPage: number, itemsPerPage: number, filterData: any }>();




  openGenericModal(genericdata, actionName) {

    var configData = this.returnConfigData(actionName)

  }


  /** Multiple select generic Modals starts here */

  openMultipleGenericModal(actionName) {

    console.log(actionName)
    var genericdata = this.userArray.filter((element: any) =>
      element.isCheccked == true
    );
    console.log(genericdata);


    var configData = this.returnConfigData(actionName)


  }

  /**Tab SWITCH */
  tabNameSwitch: boolean;
  openTabDrop() {
    this.tabNameSwitch = !this.tabNameSwitch;
  }
  closeTabDrop() {
    this.tabNameSwitch = false;
  }
  tabGroup = [];
  selectedTab = " ";
  generateTabData() {
    switch (true) {

      case (this.TabName == 'qualified' || this.TabName == 'unqualified' || this.TabName == 'archivelead'):
        {
          this.tabGroup = [
            { name: 'MyOpen Leads', isSelected: this.TabName == 'unqualified' ? true : false, index: 0 },
            { name: 'Open leads', isSelected: this.TabName == 'qualified' ? true : false, index: 1 },
            { name: 'Archived leads', isSelected: this.TabName == 'archivelead' ? true : false, index: 2 }
          ]
          this.selectedTab = this.tabGroup.filter(x => x.isSelected)[0].name;
          return
        }

      case (this.TabName == 'conversation' || this.TabName == 'archivedConversion' || this.TabName == 'allConversation'):
        {
          this.tabGroup = [
            { name: 'My activities', isSelected: this.TabName == 'conversation' ? true : false, index: 0 },
            { name: 'All activities', isSelected: this.TabName == 'allConversation' ? true : false, index: 1 },
            { name: 'Archived activities', isSelected: this.TabName == 'archivedConversion' ? true : false, index: 2 }
          ]
          this.selectedTab = this.tabGroup.filter(x => x.isSelected)[0].name;
          return
        }
      case (this.TabName == 'allCampaigns' || this.TabName == 'completedcampaigns' || this.TabName == 'activecampaigns'):
        {
          this.tabGroup = [
            { name: 'All campaigns', isSelected: this.TabName == 'allCampaigns' ? true : false, index: 0 },
            { name: 'Active campaings', isSelected: this.TabName == 'activecampaigns' ? true : false, index: 1 },
            { name: 'Completed campaings', isSelected: this.TabName == 'completedcampaigns' ? true : false, index: 2 }
          ]
          this.selectedTab = this.tabGroup.filter(x => x.isSelected)[0].name;
          return
        }
      case (this.TabName == 'allactivities' || this.TabName == 'archiveactivities'):
        {
          this.tabGroup = [
            { name: 'All activities', isSelected: this.TabName == 'allactivities' ? true : false, index: 0 },
            { name: 'Archive activities', isSelected: this.TabName == 'archiveactivities' ? true : false, index: 1 },
          ]
          this.selectedTab = this.tabGroup.filter(x => x.isSelected)[0].name;
          return
        }
      case (this.TabName == 'ConatctLeadqualified' || this.TabName == 'ContactLeadunqualified' || this.TabName == 'Contactarchivelead'):
        {
          this.tabGroup = [
            { name: 'MyOpen Leads', isSelected: this.TabName == 'ContactLeadunqualified' ? true : false, index: 0 },
            { name: 'Open leads', isSelected: this.TabName == 'ConatctLeadqualified' ? true : false, index: 1 },
            { name: 'Archived leads', isSelected: this.TabName == 'Contactarchivelead' ? true : false, index: 2 }
          ]
          this.selectedTab = this.tabGroup.filter(x => x.isSelected)[0].name;
          return
        }
      case (this.TabName == 'ContactActiveCampaign' || this.TabName == 'ContactCompleteCampaign' || this.TabName == 'ContactAllCampaign'):
        {
          this.tabGroup = [
            { name: 'Contact Active Campaign', isSelected: this.TabName == 'ContactActiveCampaign' ? true : false, index: 0 },
            { name: 'Contact Complete Campaign', isSelected: this.TabName == 'ContactCompleteCampaign' ? true : false, index: 1 },
            { name: 'Contact All Campaign', isSelected: this.TabName == 'ContactAllCampaign' ? true : false, index: 2 },

          ]
          this.selectedTab = this.tabGroup.filter(x => x.isSelected)[0].name;
          return
        }
      //sprint5
      case (this.TabName == 'AllDeals' || this.TabName == 'ActiveDeals' || this.TabName == 'PastDeals' || this.TabName == 'DealRLS'):
        {
          this.tabGroup = [
            { name: 'All deals', isSelected: this.TabName == 'AllDeals' ? true : false, index: 0 },
            { name: 'My active deals', isSelected: this.TabName == 'ActiveDeals' ? true : false, index: 1 },
            { name: 'Past deals', isSelected: this.TabName == 'PastDeals' ? true : false, index: 2 },
            { name: 'Deal RLS', isSelected: this.TabName == 'DealRLS' ? true : false, index: 3 },

          ]
          this.selectedTab = this.tabGroup.filter(x => x.isSelected)[0].name;
          return
        }
    }


  }
  /**Tab Switch */
  /** Mulitple select generic modals ends here */

  generalSelectedAction(actionItem, actionRecieved) {
    this.detectActionValue.emit({ objectRowData: [actionItem], action: actionRecieved, pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });

  
    console.log({ objectRowData: [actionItem], action: actionRecieved });
    // this.userdat.shareConversationFormThread = actionItem;

  }

 
  generalMultiSelectedAction(actionRecieved) {
    //  this.isLoading = true;
    var actionItem = this.userArray.filter((element: any) =>
      element.isCheccked == true
    );
    this.detectActionValue.emit({ objectRowData: actionItem, action: actionRecieved, pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
    //console.log({ objectRowData: actionItem, action: actionRecieved });
  }

  off() {
    this.DummyOverlay = false;
    this.headerData.forEach(element => {
      element.isFilter = false;
    });
  }



  intitalRecordCount: number;
  RecordCountPerPage: number;
  TotalRecords: number;
  FirstPage: boolean;

  /** Filter on table Headers starts here */

  myFilter = [];
  myString;
  filterCheckBox = []
  filterBox = [];
  isFilter?: boolean;


  /**
   *  Filter table header ends
   */



  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: undefined
  };

  getPaginatorData(e) {

  }

  selectedAll: any;
  table_data: any;
  checkboxcounter: number = 0; selectedCount: any = [];
  search;
  searchItem: String;
  filterSearch: String;
  userArray: any[];
  clear;
  headerArray;
  selArry;
  showMoreOptions;
  headerData;
  fixedClass = 'fixedClass1';
  id?: number;
  name?: string;
  order?: number;
  isFixed?: boolean;
  title: string;
  isLink: boolean;
  routerLink: string;
  isModal: boolean;
  isStatus: boolean;
  className: string;
  hideFilter: boolean;
  isPopUp: boolean;
  dateFormat: string;
  myArrayData = [];
  account_dash() {
  }


  constructor(private store: Store<AppState>, private router: Router, private masterApi: MasterApiService, public service: AccountService, public userdat: DataCommunicationService, public dialog: MatDialog) {

  }

  // newconver(rowData) {

  //   localStorage.setItem('forMeetingCreation', JSON.stringify(rowData))
  //   const dialogRef = this.dialog.open(NewConversationPopup,
  //     {
  //       width: '396px',
  //       height: 'auto'
  //     }).afterClosed().subscribe((res) => {
  //       console.log(res);
  //     });
  //   debugger
  //   this.store.pipe(select(getActivityListById((rowData.id)))).subscribe(x => {
  //     debugger
  //     console.log(x)
  //     if (x !== undefined) {
  //       localStorage.setItem('forMeetingCreation', JSON.stringify(x))
  //     } else {

  //       let json = {
  //         Guid: rowData.id,
  //         Name: rowData.Name,
  //         Account: {
  //           Name: rowData.Account,
  //           SysGuid: rowData.AccountSysGuid
  //         },
  //         ActivityType: {
  //           Id: rowData.ActivityTypeId
  //         }
  //       }
  //       localStorage.setItem('forMeetingCreation', JSON.stringify(json))
  //     }

  //   })
  // }
  //mobile table filter starts here
  tableMobFilter = false;
  singleTable = true;
  activetabs;
  mobActivetabs: any;
  showTabs(filterData) {
    this.filterSearch = "";
    this.sectionData = filterData.data;
    this.activetabs = filterData.key;
  }

  showMobFilter() {

    this.singleTable = false;
    this.userdat.requestCampaign = false;
    this.headerFilterDetails.headerName = this.headerData[0].name;
    this.activetabs = this.headerData[0].name;
    this.mobActivetabs = this.headerData[0];
    this.filterConfigData.isFilterLoading = true;
    this.tableMobFilter = true;
    this.headerFilterDetails.isApplyFilter = false;
    this.detectActionValue.emit({ objectRowData: '', action: 'columnFilter', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
    // document.getElementsByClassName('responsive-btn-div')[0].classList.add('activebutton');
  }
  hideMobFilter() {
    this.tableMobFilter = false;
    this.singleTable = true;
    this.userdat.requestCampaign = true;
    this.detectActionValue.emit({ objectRowData: '', action: 'cancelMobileFilter', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
    // document.getElementsByClassName('responsive-btn-div')[0].classList.remove('activebutton');
  }
  clearFilterData() {
    this.sectionData.forEach(element => {
      element.isDatafiltered = false;
    });
  }
  /*Filter Section*/
  mobileFilter = []
  sectionData = []
  popuplatedFilter(item) {
    var items = [];
    var pluckedItem = from(this.userArray).pipe(pluck(item.name)).subscribe(x => {

      if (typeof x == 'object') {
        items.push(x[0])

      } else {
        items.push(x)
      }

    });

    var unique = {};
    var distinct = [];
    items.forEach(function (x) {
      if (!unique[x]) {
        distinct.push({ name: x, isDatafiltered: false });
        unique[x] = true;
      }
    });

    this.mobileFilter.push({ key: item.name, data: distinct })
  }
  filterData() {
    var mobileFilter = this.headerData;
    mobileFilter.forEach(element => {
      console.log(mobileFilter)
      this.popuplatedFilter(element)
    });

  }

  streamOpened() {
    this.streamCal = true;
  }
  streamClosed() {
    this.streamCal = false;
  }
  mobileFilterData() {
    var filterCriteria = []
    var dummyCol = [];
    var condLength = 0;
    this.mobileFilter.forEach(ele => {
      condLength = ele.data.filter(x => x.isDatafiltered == true).length > 0 ? condLength + 1 : condLength
      console.log(ele.data)
      ele.data.forEach(element => {
        if (element.isDatafiltered) {
          filterCriteria.push({ key: ele.key, filterItem: element.name })
        }
      });
    })



    this.TableCollection.forEach(element => {

      filterCriteria.forEach(e2 => {

        if (e2.filterItem == element[e2.key]) {
          console.log(element);
          dummyCol.push(element)
        }
      });
    });

    //emit each person
    const source = from(dummyCol);

    const example = source.pipe(
      groupBy(person => person.id),
      // return each item in group as array
      mergeMap(group => group.pipe(toArray()))
    );
    var myArray = []
    const subscribe = example.subscribe(val => {
      console.log(condLength);
      if (val.length == condLength) {
        myArray.push(val[0])
      }
    });
    if (condLength > 0) {
      this.userArray = myArray;
    }
    else {
      this.userArray = this.TableCollection;
    }

    this.tableMobFilter = false;

    //document.getElementsByClassName('responsive-btn-div')[0].classList.remove('active');
    // console.log(myOrginalData);
  }

  //mobile table filter ends here

  onClickedOutside(e: Event) {
    this.showMoreOptions = false;
  }
  openDelete(tableData) {
    const dialogRef = this.dialog.open(Delete,
      {
        width: '380px',
        data: tableData
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
       // this.detectActionValue.emit({ objectRowData: tableData, action: "delete" })
        this.detectActionValue.emit({ objectRowData: tableData, action: "delete", pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
      }
    });
  }


  //sprint 2 popups
  openDialogclose(tableData): void {
    console.log('data');
  }


  // sprint 3 popups
  OpenOverview(tabledata) {

  }
  openConfirmApproval(tableData) {

  }
  ConfirmApprovalWithSwapOpen() {
  }
  OpenConfirmRejection() {

  }
  OpenOverviewHistory() {

  }
  OpenHistory() {

  }
  OpenHistory1() {

  }


  openCustomizeTable() {

  }


  /** Dynamic table row modal starts here! */
  openDynamicRowModal(leadsLinkedData: any, name, index: number) {




  }

  /** Dynamic table row modal starts ends here! */
  // search and link opportunity pop up start 
  opensearchlink(): void {
  }

  // search and link opportunity pop up end
  openleadreject(): void {

  }
  // Sample dropdown starts
  show;
  value: string = "Sort by";
  addCBU(item) {

    this.value = item.title;
    item.isAscOrder = !item.isAscOrder;
    this.reverse = item.isAscOrder;
    this.headerFilterDetails.sortOrder = this.reverse;
    this.headerFilterDetails.sortColumn = item.name;
    this.isLoading = true;
    this.detectActionValue.emit({ objectRowData: '', action: 'sortHeaderBy', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
    this.show = false;
    this.config.currentPage = 1;
  }
  updateTopBarButtons() {

    this.temTopArray = this.AllBtnLable;
    var checCollection = this.userArray.filter(x => x.isCheccked);
    checCollection.forEach(element => {

      this.AllBtnLable.forEach(x => {
        if (element[x]) {
          this.temTopArray = this.temTopArray.filter(item => item != x)
        }
      })
    });
    // this.AllBtnLable()
  }
  // table starts
  selectAll() {
    for (var i = 0; i < this.userArray.length; i++) {
      this.userArray[i].isCheccked = this.selectedAll;
    }
    this.userdat.tableRecordsChecked = this.selectedAll;
    this.userdat.topbuttons = this.selectedAll;
    if (this.userdat.tableRecordsChecked) {
      this.updateTopBarButtons();
    }

  }

  checkIfAllSelected(index) {

    var count = 0;
    for (var i = 0; i < this.userArray.length; i++) {

      if (this.userArray[i].isCheccked == true) {
        count++;
      }
      if (this.userArray.length == count) {
        this.selectedAll = true;
      }
      else {
        this.selectedAll = false;
      }
    }

    if (count > 1) {
      this.userdat.tableRecordsChecked = true;
      this.userdat.topbuttons = true
      this.updateTopBarButtons();

    } else {
      this.userdat.tableRecordsChecked = false;
      this.userdat.topbuttons = false
    }
    if (count == 1) {
      this.userdat.topbuttons = true;
    }


  }

  showAlpha() {
   // document.getElementsByClassName('caret0')[0].classList.toggle('rotate-180d');
    this.show = !this.show;

  }
  hidedropdown() {
   // document.getElementsByClassName('caret0')[0].classList.remove('rotate-180d');
    this.show = false;
  }
  // Sample dropdown ends
  // search box
  expand = false;
  inputClick() {
    this.expand = true;
  }
  OutsideInput() {
    this.expand = false;
  }

  close() {
    this.expand = false;
    this.searchItem = "";
    this.userdat.serviceSearchItem = "";
    this.serviceSearchData();
  }
  // search box ends
  key: string;
  reverse: boolean;
  campaignType;
  ngOnInit(): void {
    // this.userdat.serviceSearchItem =""
    /**Device Checking */
    this.isLoading=true;
    this.userdat.serviceSearchItem = "";
    // this.masterApi.getConversationType().subscribe(res => {

    //   this.campaignType = res.ResponseObject;

    // })
    this.isIntialized = true
    this.childAction = this.childActionData;
    this.isMobileDevice = window.innerWidth < 800 ? true : false;
    //this.temTopArray=this.AllBtnLable;
   
    this.getHeaderData();
    /**Tab Switch */

    this.generateTabData();
    if (this.TableCollection[0][this.headerData[0].name] != null) {
      this.userArray = this.TableCollection;
      this.key = this.headerData[0].name;
      this.reverse = false;
      this.config.currentPage = 1;
      if (this.isMobileDevice) {
        this.filterData();
        this.sectionData = this.mobileFilter[0].data;
        this.activetabs = this.mobileFilter[0].key;
      }

      this.userArray.forEach((element: any, index) => {
        //element.index = index + 1;
        element.isOpen = false;
        element.hasChild = element.subData.length > 0 ? true : false;
        if (element.hasChild) {
          element.subData.forEach(item => {
            item.hasChild = element.subData.some(x => x.parent == item.id);
            item.isOpen = false;
          });
        }

        console.log(this.userArray)
        element.isCheccked = false;
        if (this.IsMoreAction) {
          element.isExpanded = false;

        }
        element[this.headerData[0].name] = element[this.headerData[0].name].toLowerCase()
      });
      // <!-- to get static data in binded code -->
      // this.config.currentPage = this.paginationPageNumber.RequestedPageNumber;
      // this.config.itemsPerPage = this.paginationPageNumber.PageSize;

      this.config.currentPage = this.paginationPageNumber ? this.paginationPageNumber.RequestedPageNumber : 1;
      this.config.itemsPerPage = this.paginationPageNumber ? this.paginationPageNumber.PageSize : 10;
      // <!-- to get static data in binded code -->

      console.log(this.userArray)
    } else {
      this.userArray = []
    }

    setTimeout(() => {
      //debugger
      this.userdat.ActionColumnFixed = true;
      this.userdat.findWidth()
    }, 200);

  }

  ngAfterViewInit() {
    this.isLoading = false;
  }

  // @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  // public scrollToXY(x?: number): void {
  //   if (this.componentRef && this.componentRef.directiveRef) {
  //     this.componentRef.directiveRef.scrollTo(x, 500);
  //   }
  //     this.userdat.findWidth()
  // }
  checkTempData(options)
  {
    let seleacted=this.tempColFilter.some(x=>x.id==options.id);
    options.isDatafiltered=seleacted
    return  seleacted;
    
  }
  checkBoxSelected(options)
  {
    return options.isDatafiltered?true:this.checkTempData(options);
  }
  expandLevel(open, tableData) {
    tableData.isOpen = !tableData.isOpen;
    if (tableData.isOpen) {
      tableData.subData.map(x => x.isOpen = (x.parent == tableData.id) ? true : false);
    }
    else {
      tableData.subData.map(x => x.isOpen = false);
    }
  }
  expandChild(open, subTableData, tableData) {
    subTableData.isOpen = !subTableData.isOpen;
    if (subTableData.isOpen) {
      tableData.subData.filter(x => x.id != subTableData.id).map(x => x.isOpen = (x.parent == subTableData.id) ? true : false);
    }
    else {
      tableData.subData.map(x => x.isOpen = false);
    }
  }
   /**
  * New date from to filter changes starts here
  */
 tempFilterDate;
 filterToDateError: boolean = true;
 minFilterDate;
  filterDateChanges(event, item, specDate) {
    let x = event.target.value;
    if (x != null && x != undefined) {
      if (specDate == '_from') {
        if(!this.headerFilterDetails.filterColumn[item.name][0].filterEndDate)
        {
          this.headerFilterDetails.filterColumn[item.name][0].filterStartDate = x;
          this.minFilterDate = this.headerFilterDetails.filterColumn[item.name][0].filterStartDate;
          this.filterToDateError = false;
        }
        else
         {
          if (new Date(x) <= this.headerFilterDetails.filterColumn[item.name][0].filterEndDate) {
            this.headerFilterDetails.filterColumn[item.name][0].filterStartDate = x;
            this.minFilterDate = this.headerFilterDetails.filterColumn[item.name][0].filterStartDate;
            
          } else {
            console.log('To date should be greater!!');
            //this.filterToDateError = false;
            this.minFilterDate = this.headerFilterDetails.filterColumn[item.name][0].filterStartDate;
            this.filterToDateError = false;
            this.headerFilterDetails.filterColumn[item.name][0].filterEndDate ='';
          }
         }
        

        
      }
      else {
        if (new Date(x) >= this.headerFilterDetails.filterColumn[item.name][0].filterStartDate) {
          this.headerFilterDetails.filterColumn[item.name][0].filterEndDate = x;
         
        } else {
          console.log('To date should be greater!!');
          //this.filterToDateError = false;
          
        }

      }
    } else {
      //console.log('Please select valid dates!! No date selected')
    }

  }
  pageChangeEvent(event) {

    if (this.config.currentPage != event) {
      this.show = false;
      this.reverse = false;
      this.value = "Alphabetically";
     // this.clearAllCheckBox();
      this.config.currentPage = event;
      const perPage = this.config.itemsPerPage;
      const start = ((event - 1) * perPage) + 1;
      const end = start + perPage - 1;
      let temp = this.userArray.filter(data => data.index >= start && data.index <= end);
      if (temp.length != perPage) {
        let callAPI = true;
        //let numberOfPages = Math.ceil(this.config.totalItems / this.config.itemsPerPage);
        //let isLastPageFlag = numberOfPages == event;
        let isLastPageFlag = (this.totalTableCount >= start && this.totalTableCount <= end);
        if (isLastPageFlag) {
          let lastIndex = this.userArray[this.userArray.length - 1].index;
          if (lastIndex == this.totalTableCount) {
            callAPI = false;
          }
        }
        if (callAPI) {
          this.isLoading = true;
          this.IsPageChangeEvent = true;
          this.detectPageChangeData.emit({ objectRowData: this.userdat.serviceSearchItem, action: 'pagination', currentPage: event, itemsPerPage: perPage, filterData: this.headerFilterDetails });
        }

      } else {
        // the pipe will take care of this
      }
    }
  }

  changeItemsPerPage(event) {
    this.filterBox = [];
    this.config.itemsPerPage = parseInt(event.target.value);
    const currentPageVal = 1;
    this.config.currentPage = 1;
    const perPage = this.config.itemsPerPage;
    const start = ((currentPageVal - 1) * perPage) + 1;
    const end = start + perPage - 1;
    let temp = this.userArray.filter(data => data.index >= start && data.index <= end);
    if (temp.length != perPage) {
      let callAPI = true;
      //let numberOfPages = Math.ceil(this.config.totalItems / this.config.itemsPerPage);
      //let isLastPageFlag = numberOfPages == event;
      let isLastPageFlag = (this.totalTableCount >= start && this.totalTableCount <= end);
      if (isLastPageFlag) {
        let lastIndex = this.userArray[this.userArray.length - 1].index;
        if (lastIndex == this.totalTableCount) {
          callAPI = false;
        }
      }
      if (callAPI) {
        this.IsPageChangeEvent = true;
        this.isLoading = true;
        this.detectPageChangeData.emit({ objectRowData: this.userdat.serviceSearchItem, action: 'pagination', currentPage: this.config.currentPage, itemsPerPage: perPage, filterData: this.headerFilterDetails });
      }

    } else {
      // the pipe will take care of this
    }
  }

  nextPaginationButton() {
    console.log("Called");

  }
    /**Tab Switch */
    splitHeaderData() {
      this.fixedColumn = this.headerData.filter(x => x.id != 1 && x.isFixed == true);
      this.normalColumn = this.headerData.filter(x => x.isFixed == false);
  
    }
  getHeaderData() {

    this.headerFilterDetails = JSON.parse(JSON.stringify(this.filterDataStructure));
    var orginalArray = this.userdat.getTableData(this.TableName);

    orginalArray.subscribe((x: any[]) => {
      this.headerData = x.map(x => {
        x.isFilter = false;
        x.isAscOrder = false;
        if (!x.hideFilter) {
          // this.headerFilterDetails.filterColumn[x.name] = [];
          if (x.dateFormat) {
            this.headerFilterDetails.filterColumn[x.name] = [{ filterStartDate: '', filterEndDate: '', isDatafiltered: false }];
          } else {
            this.headerFilterDetails.filterColumn[x.name] = [];
          }
        }
        return x
      }),
        this.userdat.cachedArray = Object.assign([], this.headerData);
      this.splitHeaderData();
      if (this.IsCustomizeTable) {
        this.IsCustomizeTable = this.headerData.length > 6 ? true : false;
      }
      this.userdat.tableRecordsChecked = false;
      this.userdat.topbuttons = false;
    });
    this.userdat.ActionColumnFixed = this.IsActionFixed;
  }
  /**Pagination Added Code **/

  ngOnChanges(simpleChanges) {

    if (simpleChanges.totalTableCount) {
      this.config.totalItems = simpleChanges.totalTableCount.currentValue;
      console.log(this.config);
    }
    if (simpleChanges.TableName) {
      this.getHeaderData();
    }
    if (this.isIntialized) {

      if (this.isChildActionTriggerd) {
        console.log(this.childActionData);
        this.expansionData = this.childActionData;
      }
      else {
        this.isLoading = false;
        if (this.TableCollection[0][this.headerData[0].name] != null) {
          this.userArray = this.TableCollection;
          this.key = this.IsPageChangeEvent ? this.headerData[0].name : this.orderByName ? this.orderByName : this.headerData[0].name;
          this.IsPageChangeEvent = false;
          this.filterBox = [];
          this.userArray.forEach((element: any, index) => {
            //element.index = index + 1;
            element.isOpen = false;
            element.hasChild = element.subData.length > 0 ? true : false;
            if (element.hasChild) {
              element.subData.forEach(item => {
                item.hasChild = element.subData.some(x => x.parent == item.id);
                item.isOpen = false;
              });
            }
    
            console.log(this.userArray)
            element.isCheccked = false;
            if (this.IsMoreAction) {
              element.isExpanded = false;
    
            }
            element[this.headerData[0].name] = element[this.headerData[0].name].toLowerCase()
          });
          if (this.isMobileDevice) {
            this.mobileFilter = []
            this.sectionData = []
            this.filterData();
            this.sectionData = this.mobileFilter[0].data;
            this.activetabs = this.mobileFilter[0].key;
            this.config.itemsPerPage = this.TableCollection.length;
            this.config.currentPage = 1
          }
          else {

            // if (this.isPagination) {
            //   let count: number;
            //   count = this.TableCollection.length / this.config.itemsPerPage;

            //   this.config.currentPage = Math.ceil(count);

            // }
            // else {
            //   this.config.currentPage = this.config.currentPage;
            // }

          }
          console.log(this.userArray)
        }
        else {
          this.userArray = []
        }
      }


    }

  }


  /** Filter header related logic */

  checkVisibility(BtnName) {

    return this.temTopArray.some(x => x == BtnName);
  }
  filteredCheckBoxSelected(item, propertName) {

    console.log(item, propertName);
    item.isDatafiltered = !item.isDatafiltered
    if (item.isDatafiltered) {
      this.myFilter.push(item.name)
      this.tempColFilter.push(item);

    } else {
      this.tempColFilter = this.tempColFilter.filter(x => x.id != item.id);
      this.myFilter = this.myFilter.filter(x => x != item.name);
    }
    console.log('Temp ' + this.tempColFilter);

    // debugger
    // item.isDatafiltered = !item.isDatafiltered;
    // this.myString = propertName.allias ? propertName.allias : propertName.name;
    // if (item.isDatafiltered) {
    //   if (this.filterBox.some(x => x[this.myString])) {
    //     let filterTemp = this.filterBox.filter(x => x[this.myString])[0];
    //     filterTemp[this.myString].push(item.name);
    //     this.myFilter.push(item.name)
    //   } else {
    //     this.filterBox.push({
    //       [this.myString]:
    //         [item.name]
    //     })
    //     this.myFilter.push(item.name)
    //   }
    // } else {
    //   this.myFilter = this.myFilter.filter(x => x != item.name);
    //   let filterTemp = this.filterBox.filter(x => x[this.myString])[0];
    //   filterTemp[this.myString] = filterTemp[this.myString].filter(x => x != item.name);
    //   if (filterTemp[this.myString].length == 0) {
    //     this.filterBox = this.filterBox.filter(x => !x[this.myString]);
    //     if (this.filterBox.length == 0) {
    //       this.filterBox = [];
    //     }
    //   }
    // }
  }

  //filter starts

  check: boolean = false;
  searchitem;
  selectall;
  headerName

  titleShow(name, index) {

    this.headerName = name;
  }


  filteredData(item) {
    this.searchitem = '';

    // this.filterBox = {};
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
      var pluckName = item.allias ? item.allias : item.name;
      const perPage = this.config.itemsPerPage;
      const start = ((this.config.currentPage - 1) * perPage);
      const end = start + perPage;
      console.log(start, end)
      var pageCol = this.userArray.slice(start, end);
      console.log(pageCol);
      var pluckedItem = from(pageCol).pipe(pluck(pluckName)).subscribe(x => {
        if (typeof x == 'object') {
          items.push(x[0])

        } else {
          items.push(x)
        }
        // if (x) {
        //   if (Array.isArray(x)) {
        //     x.forEach(element => {
        //       if (element) {
        //         items.push(element)
        //       }

        //     });

        //   } else {

        //     items.push(x)
        //   }
        // }

      });

      var unique = {};
      var distinct = [];
      items.forEach(function (x) {
        if (!unique[x]) {
          distinct.push({ name: x, isDatafiltered: false });
          unique[x] = true;
        }
      });
      this.filterCheckBox = distinct.map(x => {
        x.isDatafiltered = this.returnFilterData(pluckName, x.name)
        if (x.isDatafiltered) {
          this.myFilter.push(x.name)
        }
        return x;
      });
    }
  }
  returnFilterData(item, name): boolean {
    if (this.filterBox.length > 0) {
      if (this.filterBox.some(x => x[item])) {
        let temp = this.filterBox.filter(x => x[item])[0];

        return temp[item].some(x => x == name);
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  indicateHeaderFilterColoumn(item) {
    // var pluckName = item.allias ? item.allias : item.name;
    if (item.hideFilter) {
      return '';
    }
    else {
      return this.headerFilterDetails.order.filter(x => x == [item.name]).length == 1 ? 'dataFiltered' : '';

    }
  }

  closefiltertable(item) {
    if (item.id == this.clickedDataId) {
      if (!this.fromShowCheckBox) {
        item.isFilter = false;
      }
      else {
        this.fromShowCheckBox = false;
        // this.clickedDataId="0";
      }
    }
    // this.fromShowCheckBox=false;
  }
  closefiltertablefixed(item) {

    if (item.id == this.clickedDataId) {
      if (!this.fromShowCheckBox) {
        item.isFilter = false;
      }
      else {
        this.fromShowCheckBox = false;
        // this.clickedDataId="0";
      }
    }
  }
  // showcheckbox(item) {
  //   this.fromShowCheckBox = true;
  //   this.clickedDataId = item.id
  //   if (!item.isFilter && !item.hideFilter) {
  //     var myString = (item.allias ? item.allias : item.name)
  //     if (!this.filterBox.some(x => x == myString)) {
  //       this.myString = item.allias ? item.allias : item.name;
  //       this.filteredData(item);
  //       this.DummyOverlay = true;
  //       this.currentPageFilter = this.config.currentPage;
  //       item.isFilter = true;
  //     }
  //     else {

  //       if (this.currentPageFilter != this.config.currentPage) {
  //         this.filteredData(item);
  //       }
  //       item.isFilter = true;
  //       this.DummyOverlay = true;
  //     }

  //   }
  //   else {
  //     item.isFilter = false;
  //     this.DummyOverlay = false;
  //   }
  //   this.disableScroll = this.DummyOverlay;

  // }

  tempColFilter = [];
  manageFilterBox() {
    this.headerOverlay = false;
    this.headerData.forEach(element => {
      element.isFilter = false;
    });
  }
  applyColFilter(item) {
    if (!item.dateFormat) {
      this.headerFilterDetails.filterColumn[item.name] = JSON.parse(JSON.stringify(this.tempColFilter));
    }


    // this.headerFilterDetails.filterColumn[item.name] = JSON.parse(JSON.stringify(this.tempColFilter));
    this.headerFilterDetails.headerName = item.name;
    this.headerFilterDetails.isApplyFilter = true;
    var data = this.headerFilterDetails.order.filter(x => x == item.name);
    if (item.dateFormat) {
      if (this.headerFilterDetails.filterColumn[item.name][0].filterStartDate) {
        if (data.length == 0) {
          this.headerFilterDetails.order.push(item.name)
        }
        this.tempFilterDate = JSON.parse(JSON.stringify(this.headerFilterDetails.filterColumn[item.name]));
      } else {
        this.headerFilterDetails.order = this.headerFilterDetails.order.filter(x => x != item.name);
      }

    } else {
      if (this.tempColFilter.length > 0) {
        if (data.length == 0) {
          this.headerFilterDetails.order.push(item.name)
        }

      }
      else {
        this.headerFilterDetails.order = this.headerFilterDetails.order.filter(x => x != item.name);
      }
    }

    this.isLoading = true;
    this.detectActionValue.emit({ objectRowData: '', action: 'columnFilter', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
    // console.log(this.headerFilterDetails);
    this.config.currentPage = 1;
    item.isFilter = false;
    this.DummyOverlay = false;
    this.disableScroll = this.DummyOverlay;
    

  }
  clearFilteredDates(item) {
    this.tempFilterDate = JSON.parse(JSON.stringify(this.headerFilterDetails.filterColumn[item.name]));
    this.headerFilterDetails.filterColumn[item.name][0].filterStartDate = '';
    this.headerFilterDetails.filterColumn[item.name][0].filterEndDate = '';
    //this.headerFilterDetails.filterColumn[item.name][0].isDatafiltered  = false;
    this.filterToDateError = true;
  }
  showcheckbox(item) {
    
    this.headerOverlay = true;
    this.fromShowCheckBox = true;
    this.searchitem = '';
    // this.isColFilterLoader = false;
    this.filterConfigData.isFilterLoading = true;
    this.clickedDataId = item.id
    if (!item.isFilter && !item.hideFilter) {
      this.headerData.forEach(element => {
        if (!element.hideFilter) {
          element.isFilter = false;
        }
      });
      item.isFilter = true;
      this.DummyOverlay = true;
      this.tempColFilter = JSON.parse(JSON.stringify(this.headerFilterDetails.filterColumn[item.name]));
      this.headerFilterDetails.columnSerachKey = '';
      this.headerFilterDetails.headerName = item.name;
      // if(this.userArray.length > 0 ) {
      if (!this.isLoading) {
        this.detectActionValue.emit({ objectRowData: '', action: 'columnFilter', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });

      }

      //   }
      //  else {
      //    this.filterConfigData[item.name] = [];
      //this.isColFilterLoader = false;
      //  }

    }
    else {
      this.filterConfigData.isFilterLoading = false;
      this.tempColFilter = [];
      item.isFilter = false;
      this.DummyOverlay = false;


      if (item.dateFormat) {
        let checkOrder = this.headerFilterDetails.order.some(x => x == item.name)

        this.headerFilterDetails.filterColumn[item.name][0].filterStartDate = checkOrder ? JSON.parse(JSON.stringify(this.tempFilterDate ? this.tempFilterDate[0].filterStartDate : '')) : '';
        this.headerFilterDetails.filterColumn[item.name][0].filterEndDate = checkOrder ? JSON.parse(JSON.stringify(this.tempFilterDate ? this.tempFilterDate[0].filterEndDate : '')) : '';

        if (this.headerFilterDetails.filterColumn[item.name][0].filterStartDate) {
          this.filterToDateError = false;
        } else {
          this.filterToDateError = true;
        }

      }
    }
    this.disableScroll = this.DummyOverlay;

  }

  filterSearchedItem(searchitem, item) {

    if (searchitem != null && searchitem != undefined ) {
      this.filterConfigData.isFilterLoading = true;
      this.headerFilterDetails.columnSerachKey = searchitem;
      this.headerFilterDetails.headerName = item.name;
      this.detectActionValue.emit({ objectRowData: searchitem, action: 'columnSearchFilter', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
    }

  }

  stop(e) {
    e.stopImmediatePropagation();
  }
 /*Filter Section*/

 gerAdditionalData() {
   this.addtionalData.filterData = this.filterBox;
   return this.addtionalData;
 }
  filterSearchClose(item) {
    this.searchitem = "";
    this.filterConfigData.isFilterLoading = true;
    this.headerFilterDetails.columnSerachKey =this.searchitem;
    this.headerFilterDetails.headerName = item.name;
    this.detectActionValue.emit({ objectRowData: this.searchitem, action: 'columnSearchFilter', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
  }

  onReachEnd(event, id) {
    console.log('reachedDown');
    document.getElementById(id).click();
  }

  loadMoreEvent() {
    console.log('loadMore Emit');

    this.headerFilterDetails.columnSerachKey = this.searchitem;
    if (this.filterConfigData[this.headerFilterDetails.headerName].data.length < this.filterConfigData[this.headerFilterDetails.headerName].recordCount && this.filterConfigData[this.headerFilterDetails.headerName].recordCount > 10 && !this.filterConfigData.isFilterLoading) {
      if(!this.filterConfigData.isFilterLoading)
      {
        this.filterConfigData.isFilterLoading = true;
        this.detectActionValue.emit({ objectRowData: this.searchitem, action: 'loadMoreFilterData', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
     
      }
      }

    //this.items = this.items.concat(this.cars);

  }
  loadClass() {
    this.isColFilterLoader = false;
    this.tempColFilter = this.filterConfigData[this.activetabs].data.filter(x => x.isDatafiltered);
    return 'i';
  }


  // showcheckbox(item) {
  //   if (!item.isFilter && !item.hideFilter) {
  //     var myString = (item.allias ? item.allias : item.name)
  //     if (!this.filterBox.some(x => x == myString)) {
  //       this.myString = item.allias ? item.allias : item.name;
  //       this.filteredData(item);
  //       this.DummyOverlay = true;
  //       this.currentPageFilter = this.config.currentPage;
  //     }
  //     else {

  //       if (this.currentPageFilter != this.config.currentPage) {
  //         this.filteredData(item);
  //       }
  //       item.isFilter = true;
  //       this.DummyOverlay = true;
  //     }

  //   }
  //   else {
  //     item.isFilter = false;
  //     this.DummyOverlay = false;
  //   }


  // }

  // stop(e) {
  //   e.stopImmediatePropagation();
  // }

  // filterSearchClose() {
  //   this.searchitem = "";
  // }
  // filterSearchClose(item) {
  //   this.searchitem = "";
  //   this.filterConfigData.isFilterLoading = true;
  //   this.headerFilterDetails.columnSerachKey =this.searchitem;
  //   this.headerFilterDetails.headerName = item.name;
  //   this.detectActionValue.emit({ objectRowData: this.searchitem, action: 'columnSearchFilter', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
  // }

  
  clearAllCheckBox(headerItem) {
    if (this.tempColFilter.length > 0) {
      this.filterConfigData[headerItem.name].data.forEach(element => {
        element.isDatafiltered = false;
      });

      this.tempColFilter = [];
    }

  }
  clearAllFilterData() {
    let keys = Object.keys(this.headerFilterDetails.filterColumn);

    let dateFilter = this.headerData.filter(x => x.dateFormat && !x.hideFilter)
    keys.forEach(x => {

      if (dateFilter.some(y => y.name == x)) {
        this.headerFilterDetails.filterColumn[x] = [{ filterStartDate: '', filterEndDate: '', isDatafiltered: false }];
      } else {
        this.headerFilterDetails.filterColumn[x] = [];
      }

    })

    // this.headerFilterDetails.filterColumn[x.name] = [];




    this.headerFilterDetails.order = [];
    this.headerFilterDetails.headerName = '';
    this.tempColFilter = [];
    this.headerFilterDetails.isApplyFilter = false;

    this.detectActionValue.emit({ objectRowData: '', action: 'ClearAllFilter', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
  }

  //filter ends

  /** Filter logic ends */
  /** Accordian table row expansion logic starts here */



  isExpanded: boolean = false;
  commentAction: number = 0;

  expandtoggle: boolean = false;

  expand_section(item, optional?) {
    // console.log(this.commentAction)
    // console.log(item.id);
    for (var i = 0; i < this.userArray.length; i++) {
      let ItemId = this.userArray[i].id ? this.userArray[i].id : this.userArray[i].ID
      let compareId = item.id ? item.id : item.ID
      if (ItemId == compareId) {
        this.userArray[i].isExpanded = !this.userArray[i].isExpanded;
        if (!optional) {
          this.commentAction = 0;
        }
      }
      else {
        this.userArray[i].isExpanded = false;
      }

    }


    this.commentAction = item.isExpanded ? this.commentAction++ : 0;
  }

  childCommentSectionControl(item) {
    if (item.isExpanded == false) {
      this.commentAction = 1;
      this.expand_section(item, true)
    } else {
      this.commentAction++;
    }

  }

  /** Accordian table row expansioj logic ends here */

  /** Service search data logic starts here 15 march */
  serviceSearchData() {
    this.headerFilterDetails.globalSearch = this.userdat.serviceSearchItem;
    this.detectActionValue.emit({ objectRowData: this.userdat.serviceSearchItem, action: 'search', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
    this.config.currentPage = 1;
  }
  /** Service search data logic ends here */

  /** pagination pass data logic starts here */
  emitPagination() {
    console.log("adas");
    this.isLoading = true;
    this.isPagination = true;
    this.detectActionValue.emit({ objectRowData: this.userdat.serviceSearchItem, action: 'pagination', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
  }
  /** pagination pass data logic ends here */


  /**Comment Section */

  performCommentAction(childActionRecieved): Observable<any> {
    var actionRequired = childActionRecieved;
    // console.log(actionRequired)
    switch (actionRequired.action) {

      case 'comment': {
        this.isChildActionTriggerd = true;
        this.detectActionValue.emit(actionRequired);
        return
      }

      case 'loadComment': {
        this.isChildActionTriggerd = true;
        this.detectActionValue.emit(actionRequired);
        return
      }

      case 'reject': {
        this.detectActionValue.emit(actionRequired);
        return
      }
      case 'cancel':
        {
          this.expand_section(actionRequired.objectRowData.data)
        }
    }
  }
  showlockPop(tableData, key) {
    const dialogRef = this.dialog.open(lockPopup,
      {
        width: '380px',
        data: { rowData: tableData, action: key }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
       
        this.detectActionValue.emit({ objectRowData: tableData, action: key, pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
      }
    });
  }

  goToAction(tableData) {
    this.detectActionValue.emit({ objectRowData: tableData, action: 'goToAction', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
    
  }
}







//searchlink pop starts


//searchlink pop ends




// Generic popup starts

// Generic popup ends
// Sprint 3 pop-ups








//sprint 2 models

// @Component({
//   selector: 'newconver-popup',
//   templateUrl: 'new-conversation.html',
//   styleUrls: ['./single-table-dragable.component.scss']
// })
// export class NewConversationPopup implements OnInit {
//   campaignType;
//   data: any;
//   constructor(
//     private masterApi: MasterApiService,
//     public dialog: MatDialog,
//     private newconversationService: newConversationService,
//     private router: Router,
//     private meetingService: MeetingService,
//     private newConver: ConversationService,
//     public service: DataCommunicationService,
//     public offlineService: OfflineService) { }
//   ngOnInit() {
//     this.meetingService.createdMeetingGuid = ""
//     this.masterApi.getConversationType().subscribe(res => {
//       this.offlineService.addMasterApiCache(routes.GetConversationType, res)
//       this.campaignType = res.ResponseObject;
//       console.log("type in conversation component", this.campaignType);
//     })
//   }
//   sub(id: any, item) {
//     this.data = item.Value;
//     localStorage.setItem('conversationType', item.Value);
//     localStorage.removeItem('replicateId')
//     this.newconversationService.conversationAppointId = undefined;
//     localStorage.setItem('typeOfConversation', id);
//     this.newconversationService.conversationFiledInformation = undefined;
//     this.meetingService.meetingDetails = undefined;
//     this.meetingService.createdMeetingGuid = "";
//     this.newconversationService.attachmentList = []
//     this.router.navigate(['/conversations/newConversation'])
//   }
// }

@Component({
  selector: 'deactivate',
  templateUrl: '../single-table/deactivate-contact.html',
})
export class Dactivate {
}

@Component({
  selector: 'lock-popup',
  templateUrl: './lock-popup.html',
})
export class lockPopup {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<lockPopup>, public userdat: DataCommunicationService) {
  }
  leadsData: any;
  ngOnInit() {

  }
  onCancel(): void {
    this.dialogRef.close(false);

  }
  onSubmit(): void {
    this.dialogRef.close(true);
  }

}