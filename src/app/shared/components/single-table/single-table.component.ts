import { Component, OnInit, Output, EventEmitter, Inject, Input, HostListener, ViewChild, ElementRef, OnChanges, DoCheck, OnDestroy } from '@angular/core';
import { Observable, of, concat, from, Subject, Subscription } from 'rxjs';
import { map, filter, pluck, groupBy, mergeMap, toArray, debounceTime } from 'rxjs/operators';
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
import { actionListService, CommentList, MasterApiService, conversationheader, ConversationService, OfflineService, routes, CampaignService, ErrorMessage } from '@app/core';
import { newConversationService } from '@app/core/services/new-conversation.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { getActivityDetailsById, getActivityListById } from '@app/core/state/selectors/activity/activity.selector';
import { MeetingService } from '@app/core/services/meeting.service';
import { loadTableHeader, updateTableHeader } from '@app/core/state/actions/singleTable.actions';
import { selectTableHeadById } from '@app/core/state/selectors/singleTable/singleTable.selector';
import { ControlSearchComponent } from '../control-search/control-search.component';
import { Location } from '@angular/common';
import { DashboardPopupComponent } from '@app/shared/modals/dashboard-popup/dashboard-popup.component';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';


/***********************  pop up contents ********************* */
const restoreLead = {

  ButtonLabel: "Restore",
  ModelTitle: "Restore lead ",
  labelForContent: 'Lead name',
  isAccountName: false,
  isLeadName: false,
  SpecialText: "This lead will be restored.",
  isDatePicker: false,
  isRemarks: false,
  isSinglebutton: true,
  isDatePickerRequired: false,
  isRemarksRequired: false

}

const replicate = {

  ButtonLabel: "Replicate",
  ModelTitle: "Replicate activity group",
  labelForContent: 'Activity group',
  populatedContent: "Reimagine Singtel procurement process",
  isInputBox: true,
  inputLabel: "New Activities group *",
  inputPlaceholder: "Enter new activity group",
  inputError: "Enter new activity group",
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
  labelForContent: 'Activity group',
  SpecialText: "This activity will be restored.",
  isDatePicker: false,
  isRemarks: false,
  isAccountName: false,
  isLeadName: false,
  isSinglebutton: true,
  isDatePickerRequired: false,
  isRemarksRequired: false

}


const nutureLead = {

  ButtonLabel: "Nurture",
  ModelTitle: "Nurture lead",
  labelForContent: 'Lead name',
  SpecialText: "This lead will be nurtured.",
  isRemarks: true,
  isAccountName: false,
  isLeadName: false,
  remarksLabel: "Nurture remarks * ",
  remarksPlaceholder: 'Enter nurture remarks',
  isSinglebutton: true,
  isRemarksRequired: true,
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
  remarksLabel: "Archive remarks * ",
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
  remarksLabel: "Archive remarks * ",
  remarksPlaceholder: 'Enter archive remarks',
  datepickerLabel: 'Set remainder prompt date *',
  isSinglebutton: true,
  isRemarksRequired: true,
  isDatePickerRequired: true,
  isMultiInput: false

}


const disqualifyLead = {

  ButtonLabel: "Disqualify",
  ModelTitle: "Disqualify lead",
  SpecialText: "This lead will be disqualified and moved to Closed Leads.",
  isRemarks: true,
  isAccountName: false,
  isLeadName: false,
  remarksLabel: "Disqualify remarks * ",
  remarksPlaceholder: 'Enter disqualify remarks',
  labelForContent: 'Lead name',
  isSelectdrop: true,
  isSelectdropLabel: "Disqualification reason",
  isSelectRequired: true,
  isSinglebutton: true,
  isRemarksRequired: true,
  dropData: [],
  dropProp: "disqalify",
  invalidMsg: "Select disqualification reason",
  defaultOption: "Select disqualification reason"

}

const convertOpportunity = {

  ButtonLabel: "",
  ModelTitle: "",
  SpecialText: "",
  isDatePicker: false,
  isRemarks: false,
  isAccountName: false,
  isLeadName: false,
  labelForContent: 'Name',
  isSinglebutton: true,
  isRemarksRequired: false,
  isDatePickerRequired: false,


}
const closeAction = {

  ButtonLabel: "Close",
  ModelTitle: "Close action",
  SpecialText: "This action will be closed.",
  remarksLabel: "Close remarks *",
  isDatePicker: false,
  isRemarks: true,
  isSinglebutton: true,
  isAccountName: false,
  isLeadName: false,
  labelForContent: 'Action name',
  isSelectdropLabel: "Status",
  isRemarksRequired: true,
  isDatePickerRequired: false,
  isSelectRequired: true,
  isSelectdrop: true,
  dropData: [],
  dropProp: "dropStatus",
  invalidMsg: "Select status",
  defaultOption: "Select status"

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
const activateContact = {

  ButtonLabel: "Re-activate",
  ModelTitle: "Re-activate contact ",
  SpecialText: "Are you sure, you want to re-activate this contact ?",
  isDatePicker: false,
  isRemarks: false,
  isLeadName: true,
  isSinglebutton: true,
  isRemarksRequired: false,
  isDatePickerRequired: false,
}

const qualifyLead = {

  ButtonLabel: "Qualify",
  ModelTitle: "Qualify lead",
  SpecialText: "Are you sure, you want to qualify this lead ?",
  isDatePicker: false,
  isRemarks: false,
  isLeadName: true,
  isSinglebutton: true,
  isRemarksRequired: false,
  isDatePickerRequired: false,
}
const deleteMerge = {
  ModelTitle: "Delete account",
  isDatePicker: false,
  isSinglebutton: true,
  SpecialText: "Are you sure, you want to delete?",
  ButtonLabel: "Confirm",
  isLeadName: true,
}


/***********************  pop up contents ********************* */
@Component({
  selector: 'app-single-table',
  templateUrl: './single-table.component.html',
  styleUrls: ['./single-table.component.scss']
})
export class SingleTableComponent implements OnInit {

  @Input() TableName: string;
  @Input() totalTableCount: number;
  @Input() paginationPageNumber: any;
  @Input() IscheckBoxRequired: boolean;
  @Input() bgParentColor: string;
  @Input() IsShare: boolean;
  @Input() IsReplicate: boolean;
  @Input() IsFavorite: boolean;
  @Input() IsUnFavorite: boolean;
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
  @Input() Isativate: boolean;
  @Input() IsCreateOpportunity: boolean;
  @Input() IsActionFixed: boolean;
  @Input() IsFreezedColumn: boolean;
  @Input() TableCollection: any;
  @Input() IsCustomizeTable: boolean;
  @Input() IsNewConversation: boolean;
  @Input() IsAddActivity: boolean;
  @Input() IsViewAction: boolean;
  @Input() IsDeativate: boolean;
  @Input() IsDropBoxRequired: boolean = false;
  @Input() orderByName;
  @Input() sortBy: boolean = false;
  @Input() Config: any;
  @Input() IsTicked: boolean;
  @Input() IsCrossed: boolean;
  @Input() hideSortFilter: boolean;
  @Input() IsArchiveActivity: boolean;
  @Input() SourceAccount: boolean=false;
  @Input() searchTextType: string = "noType";

  // Sprint 3
  @Input() IsRejectModif: boolean;
  @Input() IsRowDownload: boolean;
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
  @Input() ConfigData: any;
  @Input() IsAccessActivation: boolean;
  @Input() IsDeleteAccount: boolean;
  @Input() IsDownload: boolean;
  @Input() IsDashboard: boolean;
  @Input() IsApproveAcc: boolean;
  @Input() IsRejectAcc: boolean;
  @Input() IsPinEnable: boolean;
  @Input() IsAccessShare: boolean;
  @Input() IsAccountAccessActivation: boolean = false;
  @Input() IsAccountAccessShare: boolean = false;
  @Input() enableTableSearch: boolean = false;
  @Input() IsAccountsDownload:boolean;
  // sprint 4 + sprint 7 starts here
  @Input() IsRevokeAccess: boolean;
  @Input() IsOBforecast: boolean;
  @Input() IsRejectOrder: boolean;
  @Input() IsBlock: boolean;
  @Input() IsReschedule: boolean;
  @Input() IsReminder: boolean;
  @Input() IsMoreAction2: boolean;

  @Input() IsSearchPoa: boolean;
  @Input() IsLink: boolean;
  @Input() IsDeactivate: boolean;
  @Input() IsRadioRequired: boolean;
  @Input() IsConvert: boolean;
  @Input() IsSelection: boolean;
  @Input() IsSuspend: boolean;
  @Input() IsEstimateDate: boolean;
  @Input() IsAssign: boolean;
  @Input() IsReopenOpportunity: boolean;

  @Input() IsAssignOrder: boolean;
  @Input() IsDeleteTeamMember: boolean;
  @Input() IsReactivate: boolean;
  @Input() IsTimer: boolean;
  @Input() orderType: string = "String"
  @Input() IsInitialsRequired: boolean;
  @Input() IsTickedorder: boolean;
  @Input() IsAssignAcOrder: boolean;
  @Input() IsDeleteMerge: boolean;
  @Input() initialSearchText: string;
  @Input() IsClearFilter:boolean=false;
  // sprint 4 + sprint 7 ends here
  @Input() IsActionManipulate:boolean=false;
  temTopArray = []
  @Input() AllBtnLable: any = [];
  //Accordian selector generic selectors
  istableHeader: boolean
  @Input() expansionTable: string = '';
  tableCountChange={
   "ini":50,
   "mid":100,
   "end":150  }

  checkname: string = "";
  hoverchange = false;
  IsPageChangeEvent: boolean;
  //service search and pagination declarations start
  @Input() serviceSearch: boolean; //api service search make it true in parent
  isLoading: boolean = true;
  istyping: boolean = false;
  paginationLastIndex: number = 1;
  IsPaginagtion: boolean;
  selectedRowCount: number = 0;
  disableScroll: boolean = false;
  deviceHeight: Number = window.innerHeight - 215;
  yearDateValidation: any;
  maxDate: any;
  //service search and pagination declarations end
  checkDataTable: boolean = false;
  // custom-tab-dropdown start

  // Sprint 5
  @Input() DownloadButton: boolean;
  @Input() IsDealClose: boolean;
  @Input() IsDealCheck: boolean;
  @Input() IsAcCheck: boolean;


  @Input() IsCheck1: boolean;
  @Input() IsEditDeal: boolean;
  @Input() IsNotApprove: boolean;
  @Input() IsApprovar: boolean;
  @Input() IsRework: boolean;
  @Input() IsDeleteCal: boolean;
  @Input() IsDeleteCalendar: boolean;
  @Input() IsSend: boolean;


  @Input() CustomTabName;
  @Input() IsTabList: string;
  @Output() selectedValue = new EventEmitter<any>();
  @Input() TabValueSelected;
  @Input() TabName;
  /**Tab Related Tabs */
  @Input() TabList = [];
  @Input() SelectedTab;
  @Input() IsTabRequired: boolean = false;
  emitSelected(selectedTabData) {
    //this.selectedValue.emit(e);
    if (selectedTabData.action == "pin") {
      this.detectActionValue.emit({ objectRowData: selectedTabData.data, action: 'pinChange', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
    }
    else {
      this.detectActionValue.emit({ objectRowData: selectedTabData.data, action: 'tabNavigation', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
    }

  }
  /***EXPOT TO CSV */

  // custom-tab-dropdown ends
  // showtableview: boolean = true;
  // hidetableview: boolean = false;
  //LoadingFisrt Time Empty Avoid
  isIntialized: boolean = false;
  isChildActionTriggerd: boolean = false;
  expansionData: any
  @Input() childActionData: any
  childAction = []
  isColFilterLoader: boolean = false;

  statusTextFlag;
  DummyOverlay: boolean = false;
  customizableHeaderFilter : boolean = false;

  /***Mobile Pagination */
  isMobileDevice: boolean = false;
  isPagination: boolean = false;
  currentPageFilter: number;
  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 50,
    currentPage: 1,
    totalItems: undefined,

  };

  @Output() detectActionValue = new EventEmitter<{ objectRowData: any, action: string, pageData: any, configData: any, filterData: any }>();
  @Output() detectPageChangeData = new EventEmitter<{ objectRowData: any, action: string, currentPage: number, itemsPerPage: number, filterData: any }>();
  /**Pagination Added Code **/
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
  selectName: string;
  mobileHideFilterIcon:boolean;

  //Split Headers
  fixedColumn;
  normalColumn;
  headerOverlay: boolean = false;
  streamCal: boolean = false;
  //Emit Data  when stops typing search 

  /** New Filter config declarations starts here */
  @Input() filterConfigData: any;
  /** New Filter config declarations starts here */

  //FilterClick Outside 
  fromShowCheckBox = false;
  clickedDataId = "0";
  addtionalData = {
    "filterData": []
  }
  headerFilterDetails = {
    globalSearch: '',
    filterColumn: {},
    order: [],
    headerName: '',
    columnSerachKey: '',
    sortOrder: false,
    sortColumn: '',
    isApplyFilter: false
  };
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
  // search box ends

  private searchText$ = new Subject<string>();
  private colSearchText$ = new Subject<{searchText:string,item:any}>();


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
        
          document.getElementById("loadMoreTableRecords").click();
         
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



  returnConfigData(actionName, genericdata?) {
    switch (actionName) {
      case 'restore':
        if (this.TableName == 'unqualified' || this.TableName == 'qualified' || this.TableName == 'archivelead' || this.TableName == 'disqualifiedlead') {

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

        disqualifyLead.dropData = this.ConfigData["disqalify"];
        return disqualifyLead;

      case 'qualify':
        disqualifyLead.dropData = this.ConfigData["qalify"];
        return qualifyLead;

      case 'convertOpportunity':
        let leadToOpp = this.userdat.leadToOpp()
        let index = genericdata.accountType == 'Prospect' ? 1 : (genericdata.accountType == 'Reserve') ? 2 : 0
        convertOpportunity.SpecialText = leadToOpp[index].message
        convertOpportunity.ModelTitle = leadToOpp[index].header
        convertOpportunity.ButtonLabel = leadToOpp[index].bottomName
        return convertOpportunity;

      case 'replicate':

        return replicate;

      case 'debug':
        closeAction.dropData = this.ConfigData["dropStatus"];
        return closeAction;

      case 'deactivateContact':
        return deactivateContact

      case 'activateContact':
        return activateContact

      case 'deleteMerge':
        return deleteMerge

    }

  }
  updateFilterData() {
    if (this.filterBox.length == 0) {
      this.selectedRowCount = this.userArray.filter(x => x.isCheccked).length;
    }
    else {

      this.selectedRowCount = this.userdat.pseudoFilter.filter(x => x.isCheccked).length;
    }
    this.updateTopBarButtons();
    return "active";
  }

  // sprint 3 popups
  opendashboardpopup(tableData) {
    const dialogRef = this.dialog.open(DashboardPopupComponent,
      {
        disableClose: true,
        width: '850px',
        data: tableData
      });
  }

  openGenericModal(genericdata, actionName) {
    console.log(JSON.stringify(genericdata))
    var configData = this.returnConfigData(actionName, genericdata)

    const dialogRef = this.dialog.open(genericModal,
      {
        disableClose: true,
        width: '396px',
        data: { tableName: this.TableName, itemData: [genericdata], configdata: configData }
      });


    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        //  this.isLoading = true;
        this.detectActionValue.emit({ objectRowData: result, action: actionName, pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
      }

    });

  }


  /** Multiple select generic Modals starts here */

  openMultipleGenericModal(actionName) {

    console.log(actionName)
    var genericdata = this.userArray.filter((element: any) =>
      element.isCheccked == true
    );
    console.log(genericdata);

    // genericdata.sort((a, b) => a.Name.localeCompare(b.Name)); // For sorting the generic data

    var configData = this.returnConfigData(actionName)

    const dialogRef = this.dialog.open(genericModal,
      {
        disableClose: true,
        width: '380px',
        data: { tableName: this.TableName, itemData: genericdata, configdata: configData }
      });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //  this.isLoading = true;
        this.detectActionValue.emit({ objectRowData: result, action: actionName, pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
      }

    });
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

      case (this.TabName == 'qualified' || this.TabName == 'unqualified' || this.TabName == 'archivelead' || this.TabName == 'disqualifiedlead' || this.TabName == 'leadMoreView'):
        {
          this.tabGroup = [
            { name: 'My open leads', isSelected: this.TabName == 'unqualified' ? true : false, index: 0 },
            { name: 'Open leads', isSelected: this.TabName == 'qualified' ? true : false, index: 1 },
            { name: 'All leads', isSelected: this.TabName == 'archivelead' ? true : false, index: 2 },
            { name: 'Closed leads', isSelected: this.TabName == 'disqualifiedlead' ? true : false, index: 3 },
            { name: 'Show all views', isSelected: this.TabName == 'leadMoreView' ? true : false, index: 4 }
          ]
          this.selectedTab = this.tabGroup.filter(x => x.isSelected)[0].name;
          return
        }

      case (this.TabName == 'conversation' || this.TabName == 'archivedConversion' || this.TabName == 'allConversation' || this.TabName == 'activitymoreview'):
        {
          this.tabGroup = [
            { name: 'My activity groups', isSelected: this.TabName == 'conversation' ? true : false, index: 0 },
            { name: 'All activity groups', isSelected: this.TabName == 'allConversation' ? true : false, index: 1 },
            { name: 'Archived activity groups', isSelected: this.TabName == 'archivedConversion' ? true : false, index: 2 },
            { name: 'Show all views', isSelected: this.TabName == 'activitymoreview' ? true : false, index: 3 }
          ]
          this.selectedTab = this.tabGroup.filter(x => x.isSelected)[0].name;
          return
        }
      case (this.TabName == 'allCampaigns' || this.TabName == 'completedcampaigns' || this.TabName == 'activecampaigns' || this.TabName == 'campaignmoreview'):
        {
          this.campaignSerivce.AllCampaignpageNumber = 1
          this.campaignSerivce.AllCampaignpageSize = 50
          this.tabGroup = [
            { name: 'All campaigns', isSelected: this.TabName == 'allCampaigns' ? true : false, index: 0 },
            { name: 'My active campaigns', isSelected: this.TabName == 'activecampaigns' ? true : false, index: 1 },
            { name: 'Completed campaigns', isSelected: this.TabName == 'completedcampaigns' ? true : false, index: 2 },
            { name: 'Show all views', isSelected: this.TabName == 'campaignmoreview' ? true : false, index: 3 },
            // { name: 'My active campaigns', isSelected: this.TabName == 'myactivecampaigns' ? true : false, index: 3 }
          ]
          this.selectedTab = this.tabGroup.filter(x => x.isSelected)[0].name;
          return
        }
      case (this.TabName == 'allactivities' || this.TabName == 'archiveactivities'):
        {
          this.tabGroup = [
            { name: 'All activities', isSelected: this.TabName == 'allactivities' ? true : false, index: 0 },
            { name: 'Archived activities', isSelected: this.TabName == 'archiveactivities' ? true : false, index: 1 },
          ]
          this.selectedTab = this.tabGroup.filter(x => x.isSelected)[0].name;
          return
        }
      case (this.TabName == 'ConatctLeadqualified' || this.TabName == 'ContactLeadunqualified' || this.TabName == 'Contactarchivelead' || this.TabName == 'ContactClosedLead'):
        {
          this.tabGroup = [
            { name: 'MyOpen Leads', isSelected: this.TabName == 'ContactLeadunqualified' ? true : false, index: 0 },
            { name: 'Open leads', isSelected: this.TabName == 'ConatctLeadqualified' ? true : false, index: 1 },
            { name: 'All leads', isSelected: this.TabName == 'Contactarchivelead' ? true : false, index: 2 },
            { name: 'Closed leads', isSelected: this.TabName == 'ContactClosedLead' ? true : false, index: 3 }
          ]
          this.selectedTab = this.tabGroup.filter(x => x.isSelected)[0].name;
          return
        }
      case (this.TabName == 'ContactActiveCampaign' || this.TabName == 'ContactCompleteCampaign' || this.TabName == 'ContactAllCampaign'):
        {
          this.tabGroup = [
            { name: 'Contact Active Campaign', isSelected: this.TabName == 'ContactActiveCampaign' ? true : false, index: 0 },
            { name: 'Contact Completed Campaign', isSelected: this.TabName == 'ContactCompleteCampaign' ? true : false, index: 1 },
            { name: 'Contact All Campaign', isSelected: this.TabName == 'ContactAllCampaign' ? true : false, index: 2 },

          ]
          this.selectedTab = this.tabGroup.filter(x => x.isSelected)[0].name;
          return
        }

      case (this.TabName == 'activecontacts' || this.TabName == 'deactivatedcontacts' || this.TabName == 'contactmoreview'):
        {
          this.tabGroup = [
            { name: 'Active contacts', isSelected: this.TabName == 'activecontacts' ? true : false, index: 0 },
            { name: 'Inactive contacts', isSelected: this.TabName == 'deactivatedcontacts' ? true : false, index: 1 },
            { name: 'Show all views', isSelected: this.TabName == 'contactmoreview' ? true : false, index: 2 },
          ]
          this.selectedTab = this.tabGroup.filter(x => x.isSelected)[0].name;
          return
        }

      case (this.TabName == 'allorders' || this.TabName == 'ordermoreview'):
        {
          this.tabGroup = [
            { name: 'All orders', isSelected: this.TabName == 'allorders' ? true : false, index: 0 },
            { name: 'All view', isSelected: this.TabName == 'ordermoreview' ? true : false, index: 1 },
          ]
          this.selectedTab = this.tabGroup.filter(x => x.isSelected)[0].name;
          return
        }
      case (this.TabName == 'bfmRoleOrders' || this.TabName == 'bfmRoleModifiedOrders'):
        {
          this.tabGroup = [
            { name: 'My pending orders', isSelected: this.TabName == 'bfmRoleOrders' ? true : false, index: '184450002' },
            { name: 'Modified orders', isSelected: this.TabName == 'bfmRoleModifiedOrders' ? true : false, index: '184450000' },
          ]
          this.selectedTab = this.tabGroup.filter(x => x.isSelected)[0].name;
          return
        }
    }


  }
  /**Tab Switch */
  splitHeaderData() {
    this.fixedColumn = this.headerData.filter(x => x.id != 1 && x.isFixed == true);
    this.normalColumn = this.headerData.filter(x => x.isFixed == false);

  }
  /** Mulitple select generic modals ends here */

  generalSelectedAction(actionItem, actionRecieved) {
    //  this.isLoading = true;
    if (actionRecieved == 'DownloadCSV') {
      this.detectActionValue.emit({ objectRowData: [actionItem,this.headerData], action: actionRecieved, pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });

    } else {
      this.detectActionValue.emit({ objectRowData: [actionItem], action: actionRecieved, pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });

    }
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
    this.disableScroll = false;

  }

  manageFilterBox() {
    this.headerOverlay = false;
    this.headerData.forEach(element => {
      element.isFilter = false;
    });
  }

  streamOpened() {
    this.streamCal = true;
  }
  streamClosed() {
    this.streamCal = false;
  }
  /**
   *  Filter table header ends
   */





  getPaginatorData(e) {

  }

  selectedAll: any;
  table_data: any;
  checkboxcounter: number = 0; selectedCount: any = [];
  search;
  searchItem: String;
  filterSearch: String;
  userArray: any[] = [];
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
  isImage?: boolean;
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


  constructor(private store: Store<AppState>, public router: Router, private masterApi: MasterApiService, public service: AccountService, public userdat: DataCommunicationService, public dialog: MatDialog, private campaignSerivce: CampaignService) {

  }

  newconver(rowData) {

    localStorage.setItem('forMeetingCreation', JSON.stringify(rowData))
    const dialogRef = this.dialog.open(NewConversationPopup,
      {
        disableClose: true,
        width: '396px',
        height: 'auto'
      }).afterClosed().subscribe((res) => {
        console.log(res);
      });
    // debugger
    this.store.pipe(select(getActivityListById((rowData.id)))).subscribe(x => {
      // debugger;
      console.log(x)
      if (x !== undefined) {
        localStorage.setItem('forMeetingCreation', JSON.stringify(x))
      } else {

        let json = {
          Guid: rowData.id,
          Name: rowData.Name,
          Account: {
            Name: rowData.Account,
            SysGuid: rowData.AccountSysGuid,
            isProspect: rowData.isProspect
          },
          ActivityType: {
            Id: rowData.ActivityTypeId
          }
        }
        localStorage.setItem('forMeetingCreation', JSON.stringify(json))
      }

    })
  }
  //mobile table filter starts here
  tableMobFilter = false;
  singleTable = true;
  activetabs;
  mobActivetabs: any;
  key: string;
  reverse: boolean;
  campaignType;

  showTabs(filterData) {
    this.filterSearch = "";
    this.sectionData = filterData.data;
    this.activetabs = filterData.key;
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
  showMobFilter() {

    this.singleTable = false;
    this.userdat.requestCampaign = false;
    this.headerFilterDetails.headerName = this.headerData[0].name;
    this.activetabs = this.headerData[0].name;
    this.mobActivetabs = this.headerData[0];
    this.filterConfigData.isFilterLoading = true;
    this.tableMobFilter = true;
    this.detectActionValue.emit({ objectRowData: '', action: 'columnFilter', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
    // document.getElementsByClassName('responsive-btn-div')[0].classList.add('activebutton');
  }
  hideMobFilter() {
    this.tableMobFilter = false;
    this.singleTable = true;
    this.userdat.requestCampaign = true;
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
  gerAdditionalData() {
    this.addtionalData.filterData = this.filterBox;
    return this.addtionalData;
  }
  popuplatedFilter(item) {
    var items = [];
    var pluckedItem = from(this.userArray).pipe(pluck(item.name)).subscribe(x => {

      if (typeof x == 'object') {
        if (Array.isArray(x)) {
          x.forEach(element => {
            if (element) {
              items.push(element)
            }

          });
        }
        else {
          items.push(x[0])
        }


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
    var sortedData = distinct.sort(function (a, b) {
      // debugger;
      if (isNaN(parseInt(a.name))) {
        let nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
        if (nameA < nameB) //sort string ascending
          return -1
        if (nameA > nameB)
          return 1
        return 0 //default return value (no sorting)

      } else {
        let temp = a.name;
        if (temp.includes('-') || temp.includes('/')) {
          let dateA: any; dateA = new Date(a.name);
          let dateB: any; dateB = new Date(b.name);
          return dateA - dateB//sort by date ascending

        } else {
          return a.name - b.name;
        }

      }
    })
    this.mobileFilter.push({ key: item.name, data: sortedData, displayName: item.title })
  }
  filterData() {
    var mobileFilter = this.headerData;
    mobileFilter.forEach(element => {
      console.log(mobileFilter)
      this.popuplatedFilter(element)
    });

  }
  mobileFilterData() {
    // debugger;
    this.filterBox = [];

    console.log(this.mobileFilter);
    this.mobileFilter.forEach(ele => {
      if (ele.data.filter(x => x.isDatafiltered == true).length > 0) {

        var itemData = this.headerData.filter(x => x.name == ele.key)[0];
        ele.data.filter(x => x.isDatafiltered == true).forEach(element => {
          let refData = { ...element };
          refData.isDatafiltered = false;
          this.filteredCheckBoxSelected(refData, itemData);
        });


      }

    })

    this.tableMobFilter = false;
    this.userdat.requestCampaign = true;
    //document.getElementsByClassName('responsive-btn-div')[0].classList.remove('active');
    // console.log(myOrginalData);
  }

  //mobile table filter ends here

  onClickedOutside(e: Event) {
    this.showMoreOptions = false;
  }
  loadMoreTableDataEvent()
  {
    this.isPagination = false;
    this.isLoading = true;
    var pageCount = (this.userArray.length / 50) + 1;
    this.detectPageChangeData.emit({ objectRowData: this.userdat.serviceSearchItem, action: 'pagination', currentPage: pageCount, itemsPerPage: 50, filterData: this.headerFilterDetails });
    
  }


  openCustomizeTable() {

    const dialogRef = this.dialog.open(OpenCustomizeableTable, {
      disableClose: true,
      width: '660px'

    });
    // this.myArrayData = [];
    // this.headerData.forEach(x => {
    //   this.myArrayData.push({ id: x.id, name: x.name, isFixed: x.isFixed, order: x.order, title: x.title, isModal: x.isModal, isLink: x.isLink, isStatus: x.isStatus, className: x.className, hideFilter: x.hideFilter, isPopUp: x.isPopUp, dateFormat: x.dateFormat, selectName: x.selectName });

    // })
    this.myArrayData = JSON.parse(JSON.stringify(this.headerData))
    dialogRef.componentInstance.data = this.myArrayData;
    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.customizableHeaderFilter = true;
        var selItemArray = [];
        var unselItemArray = [];
        result.map((x) => {

          if (x.isFixed == true) {
            selItemArray.push(x);
          } else {
            unselItemArray.push(x);
          }

        })
        this.fixedClass = "fixedClass" + selItemArray.length;
        this.headerData = selItemArray.concat(unselItemArray);
        this.splitHeaderData();
        if (this.istableHeader) {
          let updatetableHead = {
            id: this.TableName,
            changes: { data: this.headerData }
          }
          this.store.dispatch(new updateTableHeader({ updatetableHead }))
        } else {
          this.store.dispatch(new loadTableHeader({ tableHead: { id: this.TableName, data: this.headerData } }))
        }
        setTimeout(() => {
          this.scrollToXY(1);
        }, 200);
      }
    })
  }


  /** Dynamic table row modal starts here! */
  openDynamicRowModal(leadsLinkedData: any, name, headerItem: any) {

    const dialogRef = this.dialog.open(LeadsLinked,
      {
        disableClose: true,
        width: '380px',
        data: { leads: leadsLinkedData, name: name, header: this.headerData[0].title, title: headerItem.title }

      });


  }

  /** Dynamic table row modal starts ends here! */
  // openleadextend() {
  //   const dialogRef = this.dialog.open(leadextendComponent,
  //     {
  //       width: '396px',
  //     });
  // }
  // search and link opportunity pop up start 
  opensearchlink(): void {
    const dialogRef = this.dialog.open(searchlinkComponent, {
      disableClose: true,
      width: '380px',


    });
  }

  // search and link opportunity pop up end
  openleadreject(): void {
    const dialogRef = this.dialog.open(leadrejectComponent, {
      disableClose: true,
      width: '380px',


    });
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
    // if (this.orderType == "Number") {
    //   console.log('index-->', i)
    //   if (i == 1) {
    //     //  this.key = this.headerData[0].name;
    //     this.value = "A to Z"
    //     this.show = false;
    //     this.reverse = true;
    //   }
    //   else if (i == 2) {
    //     // this.key = this.headerData[0].name;
    //     this.value = "Z to A"
    //     this.show = false;
    //     this.reverse = false;
    //   }
    //   else if (i == 3) {
    //     this.value = "Alphabetically3"
    //     this.show = true;
    //   }
    // }
    // else {
    //   console.log('index-->', i)
    //   if (i == 1) {
    //     this.key = this.headerData[0].name;
    //     this.value = "A to Z"
    //     this.show = false;
    //     this.reverse = false;
    //   }
    //   else if (i == 2) {
    //     this.key = this.headerData[0].name;
    //     this.value = "Z to A"
    //     this.show = false;
    //     this.reverse = true;
    //   }
    //   else if (i == 3) {
    //     this.value = "Alphabetically3"
    //     this.show = false;
    //   }
    // }

  }
  updateTopBarButtons() {

    this.temTopArray = this.AllBtnLable;
    if (this.filterBox.length == 0) {
      var checCollection = this.userArray.filter(x => x.isCheccked);
      checCollection.forEach(element => {

        this.AllBtnLable.forEach(x => {
          if (element[x]) {
            this.temTopArray = this.temTopArray.filter(item => item != x)
          }
        })
      });
    }
    else {
      var checCollection = this.userdat.pseudoFilter.filter(x => x.isCheccked);
      checCollection.forEach(element => {

        this.AllBtnLable.forEach(x => {
          if (element[x]) {
            this.temTopArray = this.temTopArray.filter(item => item != x)
          }
        })
      });
    }

    // this.AllBtnLable()
  }
  // table starts
  selectAll() {

    let perPage = this.config.itemsPerPage;
    let start = ((this.config.currentPage - 1) * perPage);
    let end = start + perPage;

    var pageCol = this.userArray.filter(x => x.index > start && x.index <= end);
    this.userArray.map(x => {
      if (x.index > start && x.index <= end) {
        x.isCheccked = this.selectedAll;
      }
      else {
        x.isCheccked = false;
      }
      return x;

    })
    // for (var i = 0; i < this.userArray.length; i++) {
    //   this.userArray[i].isCheccked = this.selectedAll;
    // }
    this.selectedRowCount = this.userArray.filter(x => x.isCheccked).length;
    this.userdat.tableRecordsChecked = this.selectedAll;
    this.userdat.topbuttons = this.selectedAll;
    if (this.userdat.tableRecordsChecked) {
      this.updateTopBarButtons();
    }
    this.detectActionValue.emit({ objectRowData:  this.userArray, action: 'allCheckBox', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
   
   // this.detectPageChangeData.emit({ objectRowData: this.userArray, action: 'allCheckBox', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
    

  }

  // test:boolean=false;

  checkIfAllSelected(index,tableData) {

    let perPage = this.config.itemsPerPage;
    let start = ((this.config.currentPage - 1) * perPage);
    let end = start + perPage;

    var pageCol = this.userArray.filter(x => x.index > start && x.index <= end);
    var count = 0;
    for (var i = 0; i < this.userArray.length; i++) {
      if (this.userArray[i].index > start && this.userArray[i].index <= end) {
        if (this.userArray[i].isCheccked == true) {
          count++;
        }
        if (pageCol.length == count) {
          this.selectedAll = true;
        }
        else {
          this.selectedAll = false;
        }
      }
    }

    if (count > 1) {
      // document.getElementsByClassName('responsive-btn-div-button')[0].classList.add('active');
      // this.test=true;   
      this.userdat.tableRecordsChecked = true;
      this.userdat.topbuttons = true
      this.updateTopBarButtons();

    } else {
      // document.getElementsByClassName('responsive-btn-div-button')[0].classList.remove('active');
      // this.test=false;


      this.userdat.tableRecordsChecked = false;
      this.userdat.topbuttons = false
    }
    if (count == 1) {
      // document.getElementsByClassName('responsive-btn-div-button')[0].classList.add('active');
      this.userdat.topbuttons = true;
    }
    this.selectedRowCount = this.userArray.filter(x => x.isCheccked).length;
     this.detectActionValue.emit({ objectRowData: tableData, action: 'checkBox', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
   
   // this.detectPageChangeData.emit({ objectRowData: tableData, action: 'checkBox', pageData: this.config., configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
     
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
    console.log('Key press event')
    this.expand = true;
  }
  OutsideInput() {
    this.expand = false;
  }

  close() {
    this.expand = false;
    if (this.userdat.serviceSearchItem) {
      this.searchItem = "";
      this.userdat.serviceSearchItem = "";
      if (this.serviceSearch) {
        this.serviceSearchData();
      }
    }
  }


  /** Initials and random color combinations selector methods starts here */
  getInitials(string) {
    // debugger;
    var names = string.split(' '),
      initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  }

  getRandomColor() {
    var num = Math.ceil(Math.random() * 10) % 10;
    return "class" + num;
  }

  isNumber(item) {
    let format: boolean;
    format = !isNaN(item);
    return format;
  }
  getHeaderData() {
    this.headerFilterDetails = JSON.parse(JSON.stringify(this.filterDataStructure));
    this.store.pipe(select(selectTableHeadById(this.TableName))).subscribe(res => {
      console.log("seeing the state selectior HEAD DATA")
      console.log(res)
      if (res) {
        this.istableHeader = true;
        if (!this.customizableHeaderFilter) {
          this.headerData = JSON.parse(JSON.stringify(res.data.map(x => {
            x.isFilter = false;
            if (!x.hideFilter) {
              // this.headerFilterDetails.filterColumn[x.name] = [];
              if (x.dateFormat) {
                this.headerFilterDetails.filterColumn[x.name] = [{ filterStartDate: '', filterEndDate: '', isDatafiltered: false }];
              } else {
                this.headerFilterDetails.filterColumn[x.name] = [];
              }
            }
            return x
          })));
        }
        this.splitHeaderData();
        if (this.IsCustomizeTable) {
          this.IsCustomizeTable = this.headerData.length >= 5 ? true : false;
        }

        this.userdat.cachedArray = Object.assign([], this.headerData);
        this.userdat.tableRecordsChecked = false;
        this.userdat.topbuttons = false;
        this.userdat.ActionColumnFixed = this.IsActionFixed;
      } else {
        var orginalArray = this.userdat.getTableData(this.TableName);

        orginalArray.subscribe((x: any[]) => {
          this.headerData = JSON.parse(JSON.stringify(x.map(x => {
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
          }))),
            this.userdat.cachedArray = Object.assign([], this.headerData);
          this.splitHeaderData();
          if (this.IsCustomizeTable) {
            this.IsCustomizeTable = this.headerData.length >= 5 ? true : false;
          }
          this.userdat.tableRecordsChecked = false;
          this.userdat.topbuttons = false;
        });
        this.userdat.ActionColumnFixed = this.IsActionFixed;
      }

    })
  }
  ngOnInit(): void {

    this.isLoading = true;
    // this.userdat.serviceSearchItem =""
    /**Device Checking */
    this.userdat.serviceSearchItem = "";
    // this.masterApi.getConversationType().subscribe(res => {

    //   this.campaignType = res.ResponseObject;

    // })
    

    this.colSearchText$.pipe(debounceTime(1000)
    ).subscribe(x => {
      this.filterSearchedItem(x.searchText,x.item)
      // this.serviceSearchData();
    })
    this.searchText$.pipe(debounceTime(1000)
    ).subscribe(x => {
      this.serviceSearchData();
    })
    this.isIntialized = true
    this.childAction = this.childActionData;
    this.isMobileDevice = window.innerWidth < 800 ? true : false;
    this.yearDateValidation = new Date(1980, 0, 1);
    this.minFilterDate =  new Date(1980, 0, 1);
    var date = new Date();
    var year = date.getFullYear();
    var currentDate = date.getDate();
    var month = date.getMonth();
    this.maxDate = new Date(year + 1, month, currentDate);
    this.getHeaderData();
    //this.temTopArray=this.AllBtnLable;

    /**Tab Switch */
    this.generateTabData();
    // debugger;
    if (this.TableCollection[0][this.headerData[0].name] != null) {
      // debugger;

      //18OCT New changes loadTableData starts here
      this.loadInitials();

      //18OCT New changes loadTableData ends here

      this.userArray = this.TableCollection;
    if(this.IsActionManipulate)
    {
      this.IsActionFixed=this.userArray.some(x=>x['actionButton']==true)
    }
      this.config.currentPage = 1;
      if (this.isMobileDevice) {
        this.filterData();
        this.isPagination = true;
        this.sectionData = this.mobileFilter[0].data;
        this.activetabs = this.mobileFilter[0].key;
      }

      // this.userArray.forEach((element: any, index) => {
      //   //element.index = index + 1;

      // });
      //Sort By Number or Date
      if (this.orderType == "Number") {
        this.reverse = true;
      }
      else {
        this.key = this.orderByName ? this.orderByName : this.headerData[0].name;
        this.reverse = this.sortBy;
      }

      this.config.currentPage = this.paginationPageNumber.RequestedPageNumber;
      this.config.itemsPerPage = this.paginationPageNumber.PageSize;
      this.filterBox = this.paginationPageNumber.FilterData ? this.paginationPageNumber.FilterData : [];
      // //static json
      // this.config.currentPage = this.paginationPageNumber ? this.paginationPageNumber.RequestedPageNumber : 1;
      // this.config.itemsPerPage = this.paginationPageNumber ? this.paginationPageNumber.PageSize : 10;
      this.userdat.serviceSearchItem = this.initialSearchText ? this.initialSearchText : '';
      //  this.userdat.serviceSearchItem=this.initialSearchText?this.initialSearchText:'';
      console.log(this.userArray)
    } else {
      this.config.totalItems = 0;
      this.userArray = []
      this.headerData.forEach(item => item.hideFilter = true);
      this.checkDataTable = true
    }
    this.userdat.serviceSearchItem = this.initialSearchText ? this.initialSearchText : '';

    // this.isLoading = false;
    this.fixedClass = "fixedClass" + this.headerData.filter(x => x.isFixed).length;

    setTimeout(() => {
      this.userdat.findWidth()
    }, 200);

    this.mobileHideFilterIcon = this.headerData.every(x=>x.hideFilter);
  }
  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  public scrollToXY(x?: number): void {
    if (this.componentRef && this.componentRef.directiveRef) {
      this.componentRef.directiveRef.scrollTo(x, 500);
    }
      this.userdat.findWidth()
  }


  // 18OCT new data viw data changes starts here

  loadInitials() {
    this.TableCollection.forEach((element: any, i) => {
      element.isCheccked = element.isCheccked || false;
      if (this.IsMoreAction) {
        element.isExpanded = element.isExpanded ? element.isExpanded : false;

      }
      element[this.headerData[0].name] = element[this.headerData[0].name];
      if (this.IsInitialsRequired) {
        element.bgColor = "randomColor" + (i % 10)
        element.initials = this.getInitials(element[this.headerData[0].name])
        return element;
      }
      this.loadTableData(element, i);
    });
  }

  loadTableData(item, i) {
    this.headerData.forEach((element, i) => {
      item[element.name] = item[element.name] || 'NA';
      if (!element.isModal) {
        if (item[element.name].toLowerCase() != "na") {
          switch (element.displayType) {
            case 'capsFirstCase':
              {
                item[element.name] = item[element.name];
               // item[element.name] = item[element.name].trim().charAt(0).toUpperCase() + item[element.name].slice(1).toLowerCase();
              }
              break;

            case 'upperCase':
              {
                item[element.name] = item[element.name];
               // item[element.name] = item[element.name].toUpperCase();
              }
              break;
            case 'date':
              {
                item[element.name] = item[element.name];
              }
              break;
            case 'currency':
              {
                item[element.name] = item[element.name];

              }
              break;
            case 'name':
              {
                item[element.name] = this.toTitleCase(item[element.name]);
              }
              break;

            case 'number':
              {
                item[element.name] = item[element.name];

              }
              break;
          }

        } else {
          item[element.name] = "-"
        }
      } else {

        if (item[element.name][0].toLowerCase() != "na") {
          switch (element.displayType) {
           // case 'capsFirstCase':
            //  {
               // item[element.name] = item[element.name];
                // item[element.name].forEach((localEle, index) => {
                //   item[element.name][index] = localEle.trim().charAt(0).toUpperCase() + localEle.slice(1).toLowerCase();
                // });
            //  }
            //  break;
            case 'name':
              {
                item[element.name].forEach((localEle, index) => {
                  item[element.name][index] = this.toTitleCase(localEle);
                });
              }
              break;
          }

        } else {
          item[element.name] = ['-']
        }
      }
    });

    if (this.IsInitialsRequired) {
      var initialValue = (this.headerData.filter(x => x.isInitialColumn)[0].id) - 1;
      item.bgColor = "randomColor" + (i % 10)
      var dynamicName = this.headerData[initialValue].allias ? item[this.headerData[initialValue].name].name : item[this.headerData[initialValue].name]
      item.initials = this.getInitials(dynamicName)

    }

  }
  toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    )
  };

  getDynamicFilterRenderData(item, value) {
    if (value.toLowerCase() != "na") {
      switch (item.displayType) {
        case 'capsFirstCase':
          {
          //  return value = value.trim().charAt(0).toUpperCase() + value.slice(1).toLowerCase();
          return value = value;
          }

        case 'upperCase':
          {
           // return value = value.toUpperCase();
           return value = value;
          }
        case 'date':
          {
            return value = value;
          }
        case 'currency':
          {
            return value = value;

          }
        case 'name':
          {
            return value = this.toTitleCase(value);
          }

        case 'number':
          {
            return value = value;

          }
      }

    } else {
      return value = "NA"
    }
  }
  // 18OCT new data viw data changes ends here 

  // togglemoreview(){
  //   this.hidetableview = true;
  //   this.showtableview = false;
  // }
  pageChangeEvent(event) {
    this.headerData.forEach(element => {
      element.isFilter = false;
    });
    this.removeAllSelectedRow();
    this.filterBox = [];
    if (this.config.currentPage != event) {
      // this.show = false;
      // this.reverse = false;
      this.value = this.value ? this.value : "Sort by";
      window.scrollTo({ top: 0, behavior: "smooth" })
      this.config.currentPage = event;
      const perPage = this.config.itemsPerPage;
      const start = ((event - 1) * perPage) + 1;
      const end = start + perPage - 1;
      let temp = this.userArray.filter(data => data.index >= start && data.index <= end);
      if(this.IsActionManipulate)
      {
        this.IsActionFixed=temp.some(x=>x['actionButton']==true)
      }
      if (this.IscheckBoxRequired) {
        this.userArray.forEach(x => x.isCheccked = false);
        this.selectedRowCount = 0;
      }
      
      if (temp.length != perPage) {
        let callAPI = true;

        //let numberOfPages = Math.ceil(this.config.totalItems / this.config.itemsPerPage);
        //let isLastPageFlag = numberOfPages == event;
        let isLastPageFlag = (this.totalTableCount >= start && this.totalTableCount <= end);
        if (isLastPageFlag) {
          let lastIndex = this.userArray[this.userArray.length - 1].index;
          if (lastIndex == this.totalTableCount) {
            callAPI = false;
            this.key = this.orderByName ? this.orderByName : this.headerData[0].name;
            this.reverse = this.sortBy;
          }
        }
        if (callAPI) {
          this.IsPageChangeEvent = true;
          this.isLoading = true;
          this.detectPageChangeData.emit({ objectRowData: this.userdat.serviceSearchItem, action: 'pagination', currentPage: event, itemsPerPage: perPage, filterData: this.headerFilterDetails });
        }

      } else {
        // the pipe will take care of this

      }
    }
  }

  changeItemsPerPage(event) {
    this.filterBox = [];
    this.removeAllSelectedRow();
    this.config.itemsPerPage = parseInt(event);
    const currentPageVal = 1;
    this.config.currentPage = 1;
    const perPage = this.config.itemsPerPage;
    const start = ((currentPageVal - 1) * perPage) + 1;
    const end = start + perPage - 1;
    let temp = this.userArray.filter(data => data.index >= start && data.index <= end);
    if(this.IsActionManipulate)
    {
      this.IsActionFixed=temp.some(x=>x['actionButton']==true)
    }
    if (this.IscheckBoxRequired) {
      this.userArray.forEach(x => x.isCheccked = false)
      this.selectedRowCount = 0;
    }

    if (temp.length != perPage) {
      let callAPI = true;
      //let numberOfPages = Math.ceil(this.config.totalItems / this.config.itemsPerPage);
      //let isLastPageFlag = numberOfPages == event;
      let isLastPageFlag = (this.totalTableCount >= start && this.totalTableCount <= end);
      if (isLastPageFlag) {
        let lastIndex = this.userArray[this.userArray.length - 1].index;
        if (lastIndex == this.totalTableCount) {
          callAPI = false;
          this.key = this.orderByName ? this.orderByName : this.headerData[0].name;
          this.reverse = this.sortBy;
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

  /**Pagination Added Code **/

  ngOnChanges(simpleChanges) {
    // debugger;
    // console.log("->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    // console.log(simpleChanges)
    if (simpleChanges.totalTableCount) {
      console.log('simpleChanges', simpleChanges)
      this.config.totalItems = simpleChanges.totalTableCount.currentValue;
      console.log(this.config);
    }
    if (simpleChanges.TabName) {
      this.generateTabData();
    }
    if (simpleChanges.TableName) {
      this.getHeaderData();
    }
    if (simpleChanges.paginationPageNumber) {
      this.config.currentPage = this.paginationPageNumber.RequestedPageNumber;
      this.config.itemsPerPage = this.paginationPageNumber.PageSize;
    }
    // console.log('Isloading-->',this.isLoading,'Array-->',this.userArray.length)
    // if(this.userArray.length>0 && this.isLoading==true){
    //   this.isLoading=false;
    // }else if(this.userArray.length==0 && this.searchItem!=""){
    //   this.isLoading=false;
    // }
    if (this.headerFilterDetails['isApplyFilter']) {
      this.headerFilterDetails.isApplyFilter = false;
    }

    if (this.isIntialized) {
      this.selectedRowCount = 0;
      this.disableScroll = false;
      if (this.isChildActionTriggerd) {
        console.log(this.childActionData);
        this.expansionData = this.childActionData;
      }
      else {
        this.istyping = false;
        this.isLoading = false;
        // top button hidding when page reloades
        this.userdat.tableRecordsChecked = false;
        this.selectedAll = false;
        if (this.TableCollection[0][this.headerData[0].name] != null) {
          this.loadInitials();
          this.userArray = this.TableCollection;
         // this.config.currentPage = event;
          if(this.IsActionManipulate)
          {
            const perPage = this.config.itemsPerPage;
            const start = ((this.config.currentPage  - 1) * perPage) + 1;
            const end = start + perPage - 1;
            let temp = this.userArray.filter(data => data.index >= start && data.index <= end);           
            this.IsActionFixed=temp.some(x=>x['actionButton']==true)
          }

          this.isPagination = true;
          //this.IsPageChangeEvent = false;
          this.filterBox = [];
          //after multiple leads are nutured, action shouldbe disabled 
          this.userdat.tableRecordsChecked = false;          
          // this.key = this.orderByName ? this.orderByName : this.headerData[0].name;
          // this.reverse = this.sortBy;
          if (this.orderType == "Number") {
            this.reverse = true;
          }
          else {
            this.key = this.orderByName ? this.orderByName : this.headerData[0].name;
            this.reverse = this.sortBy;
          }
          if (this.isMobileDevice) {
            this.mobileFilter = []
            this.sectionData = []
            this.filterData();
            this.userArray.forEach((element, index) => {
              element.index = index + 1;
            });
            //this.sectionData = this.mobileFilter[0].data;
            //this.activetabs = this.mobileFilter[0].key;
            this.config.currentPage = 1;
            this.config.itemsPerPage = this.userArray.length;
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
          setTimeout(() => {
            this.userdat.findWidth(this.IsActionFixed)
          }, 1000);
        }
        else {
          this.userArray = [];
          this.config.totalItems = 0;
        }

        this.headerData.forEach(element => {
          element.isFilter = false;
        });
        this.filterBox = [];
      }


    }
    else {
      this.isLoading = true;
    }

  }
  ngAfterViewInit() {
    this.isLoading = false;
  }

  removeAllSelectedRow() {
    this.selectedAll = false;
    this.userArray.map(x => { x.isCheccked = false; return x })
    this.userdat.tableRecordsChecked = this.selectedAll;
    this.userdat.topbuttons = this.selectedAll;

  }
  /** Filter header related logic */

  checkVisibility(BtnName) {

    return this.temTopArray.some(x => x == BtnName);
  }
  tempColFilter = [];
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

  onHeadSelectChange(event) {
    console.log(event);
    this.headerFilterDetails.headerName = event.target.value;
    //  this.headerFilterDetails.sortOrder = this.value;
    //  this.detectActionValue.emit({ objectRowData: this.headerFilterDetails, action: 'sortHeaderBy', pageData: this.config, configData: this.gerAdditionalData() });
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
    // console.log(this.filterBox)

  }

  //filter starts
  searchItemLC;
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
      // let tempDataReturn = this.filterBox.length > 0 ? this.userdat.pseudoFilter : this.userArray;

      const perPage = this.config.itemsPerPage;
      const start = ((this.config.currentPage - 1) * perPage);
      const end = start + perPage;
      console.log(start, end)
      var pageCol = this.filterBox.length > 0 ? this.userdat.pseudoFilter : this.userArray.filter(x => x.index > start && x.index <= end);
      console.log(pageCol);

      var pluckedItem = from(pageCol).pipe(pluck(pluckName)).subscribe(x => {
        if (typeof x == 'object') {
          if (Array.isArray(x)) {
            x.forEach(element => {
              if (element) {
                items.push(element)
              }

            });
          }
          else {
            items.push(x[0])
          }


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
      let uniqueCollection = distinct.map(x => {
        x.isDatafiltered = this.returnFilterData(pluckName, x.name);
        if (x.isDatafiltered) {
          this.myFilter.push(x.name);

        }
        return x;
      });
      this.filterCheckBox = uniqueCollection.sort(function (a, b) {
        // debugger;
        if (isNaN(parseInt(a.name))) {
          let nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
          if (nameA < nameB) //sort string ascending
            return -1
          if (nameA > nameB)
            return 1
          return 0 //default return value (no sorting)

        } else {
          let temp = a.name;
          if (temp.includes('-') || temp.includes('/')) {
            let dateA: any; dateA = new Date(a.name);
            let dateB: any; dateB = new Date(b.name);
            return dateA - dateB//sort by date ascending

          } else {
            return a.name - b.name;
          }

        }
      })
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

    if (searchitem != null && searchitem != undefined) {
      this.filterConfigData.isFilterLoading = true;
      this.headerFilterDetails.columnSerachKey = searchitem;
      this.headerFilterDetails.headerName = item.name;
      this.detectActionValue.emit({ objectRowData: searchitem, action: 'columnSearchFilter', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
    }

  }
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

  stop(e) {
    e.stopImmediatePropagation();
  }

  filterSearchClose(item) {
    this.searchitem = "";
    this.filterConfigData.isFilterLoading = true;
    this.headerFilterDetails.columnSerachKey = this.searchitem;
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
      if (!this.filterConfigData.isFilterLoading) {
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

  // clearAllCheckBox() {
  //   this.filterCheckBox.forEach(element => {
  //     element.isDatafiltered = false;
  //   });
  //   this.filterBox = this.filterBox.filter(x => !x[this.myString]);
  //   if (this.filterBox.length == 0) {
  //     this.filterBox = [];
  //     let x = this.headerData.filter(x => x.name == this.myString || x.allias == this.myString)[0];
  //     x.isFilter = false;
  //     this.filteredData(x)
  //   }
  //   this.myFilter = [];
  //   this.updateTopBarButtons();
  //   // this.filterBox = [];
  // }

  clearAllCheckBox(headerItem) {
    if (this.tempColFilter.length > 0) {
      this.filterConfigData[headerItem.name].data.forEach(element => {
        element.isDatafiltered = false;
      });

      this.tempColFilter = [];
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
          this.headerFilterDetails.filterColumn[item.name][0].filterEndDate ='';
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
          this.minFilterDate = this.headerFilterDetails.filterColumn[item.name][0].filterStartDate;
            this.filterToDateError = false;
            this.headerFilterDetails.filterColumn[item.name][0].filterEndDate ='';
          //this.filterToDateError = false;
          
        }

      }
    } else {
      //console.log('Please select valid dates!! No date selected')
    }

  }
  clearFilteredDates(item) {
    this.tempFilterDate = JSON.parse(JSON.stringify(this.headerFilterDetails.filterColumn[item.name]));
    this.headerFilterDetails.filterColumn[item.name][0].filterStartDate = '';
    this.headerFilterDetails.filterColumn[item.name][0].filterEndDate = '';
    //this.headerFilterDetails.filterColumn[item.name][0].isDatafiltered  = false;
    this.filterToDateError = true;
  }
  /**
  * New date from to filter changes ends here
  */


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
  serviceSearchSubject(event) {
    if (event.inputType == "insertFromPaste") {
       if (this.userdat.serviceSearchItem) {
        this.searchText$.next(this.userdat.serviceSearchItem)
       } 
    } else {
      this.searchText$.next(this.userdat.serviceSearchItem)
    }
  }
  colServiceSearchSubject(searchtext,data) {
    this.colSearchText$.next({searchText:searchtext,item:data})
  }
  serviceSearchData() {
    if (this.isIntialized) {
      this.isLoading = true;
    }

    console.log(this.userdat.serviceSearchItem);
    this.istyping = true;
    //this.userArray=[]
    this.headerFilterDetails.globalSearch = this.userdat.serviceSearchItem;
    this.detectActionValue.emit({ objectRowData: this.userdat.serviceSearchItem, action: 'search', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
    this.config.currentPage = 1;
  }
  /** Service search data logic ends here */
  /**Exposrt CSV  */
  async exportToCSV() {
    // debugger;
    var properties = []
    var titles = []
    await from(this.headerData).pipe(pluck('title')).subscribe(x => {
      titles.push(x)
    })
    await from(this.headerData).pipe(pluck('name')).subscribe(x => {
      properties.push(x)
    })

    let perPage = this.config.itemsPerPage;
    let start = ((this.config.currentPage - 1) * perPage);
    let end = start + perPage;
    console.log('show', this.show);
    console.log('reverse', this.reverse);
    if (this.filterBox.length) {

      // var pageCol = this.userArray.filter(x=>x.index>start && x.index<=end);
      this.userdat.downloadAsCsv(this.userdat.pseudoFilter, this.TableName, properties, titles, this.reverse, this.key, this.selectedTab, this.orderType)
    }
    else {
      var pageCol = this.userArray.filter(x => x.index > start && x.index <= end);
      this.userdat.downloadAsCsv(pageCol, this.TableName, properties, titles, this.reverse, this.key, this.selectedTab, this.orderType)
    }

  }
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
    // this.isLoading = true;
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
        this.detectActionValue.emit({ objectRowData: actionRequired.objectRowData, action: 'reject', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
        return
      }
      case 'cancel':
        {
          this.expand_section(actionRequired.objectRowData.data)
        }
    }
  }

  /***Sprint 3 Code */
  OpenConfirmRejection(tableData, actionName) {

    const dialogRef = this.dialog.open(OpenConfirmRejection,
      {
        disableClose: true,
        width: '380px',
        data: { itemData: tableData, column: actionName, configdata: this.ConfigData }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.detectActionValue.emit({ objectRowData: { "rowData": tableData, "popupData": result }, action: actionName, pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
      }
    });


  }
  //chethana aug 2nd OpenRejectConfirm starts
  OpenRejectConfirm(tableData, actionName) {

    const dialogRef = this.dialog.open(OpenRejectConfirm,
      {
        disableClose: true,
        width: '380px',
        data: { itemData: tableData, column: actionName, configdata: this.ConfigData }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.detectActionValue.emit({ objectRowData: { "rowData": tableData, "popupData": result }, action: actionName, pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
      }
    });


  }

  //chethana aug 2nd OpenRejectConfirm ends
  OpenOverviewHistory(tableData, actionName) {

    const dialogRef = this.dialog.open(OpenOverviewHistory,
      {
        disableClose: true,
        width: '380px',
        data: tableData
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.detectActionValue.emit({ objectRowData: tableData, action: actionName, pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
      }
    });
  }
  OpenOverview(tableData, actionName) {
    {
      console.log("tabke data is ", tableData);
      const dialogRef = this.dialog.open(OpenOverview,
        {
          disableClose: true,
          width: '380px',
          data: tableData
        });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.detectActionValue.emit({ objectRowData: tableData, action: actionName, pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
        }
      });
    }
  }

  /**Kiran  */
  openConfirmApproval(tableData, actionName) {
    const dialogRef = this.dialog.open(OpenConfirmApproval,
      {
        disableClose: true,
        width: '380px',

        data: { isActivation: tableData.isActivation, itemData: tableData, column: actionName, configdata: this.ConfigData }
      });
    dialogRef.componentInstance.modelEmiter.subscribe((x) => {

      this.detectActionValue.emit({ objectRowData: x, action: actionName, pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
      //this.detectActionValue.emit({ objectRowData: x, action: coloumn })
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.detectActionValue.emit({ objectRowData: { popupData: result, rowData: tableData }, action: actionName, pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
      }
    });

  }
  ConfirmApprovalWithSwapOpen(tableData, actionName) {

    const dialogRef = this.dialog.open(ConfirmApprovalWithSwap,
      {
        disableClose: true,
        width: '380px',
        data: tableData
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.detectActionValue.emit({ objectRowData: tableData, action: actionName, pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
      }
    });
  }

  openDelete(tableData, actionName) {

    const dialogRef = this.dialog.open(Delete,
      {
        disableClose: true,
        width: '380px',
        data: tableData
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.detectActionValue.emit({ objectRowData: tableData, action: actionName, pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
      }
    });
  }
  openDialogclose(tableData, actionName): void {

    const dialogRef = this.dialog.open(ClosePopup,
      {
        disableClose: true,
        width: '380px',
        data: tableData
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.detectActionValue.emit({ objectRowData: tableData, action: actionName, pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
      }
    });
  }


  //sprint5
  OpenRejectDeal(headerC, flagC, tableData) {
    const dialogRef = this.dialog.open(DealReject,
      {
        disableClose: true,
        width: '396px',
        data: { header: headerC, flag: flagC, rowData: tableData }

      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.detectActionValue.emit({ objectRowData: { popData: result, rowData: tableData }, action: flagC, pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
      }

    });

  }

  //sprint5
  // OpenRejectDeal(headerC, flagC, tableData) {
  //   const dialogRef = this.dialog.open(DealReject,
  //     {
  //       width: '396px',
  //       data: { header: headerC, flag: flagC, rowData: tableData },

  //     });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.detectActionValue.emit({ objectRowData: { popData: result, rowData: tableData }, action: flagC, pageData: this.config, configData: this.gerAdditionalData() })
  //     }

  //   });

  // }

  OpenAssignDeal(action, tableData) {
    // const dialogRef = this.dialog.open(assignDealpopComponent,
    //   {
    //     width: '396px',

    //   });


    const dialogRef = this.dialog.open(assignDealpopComponent,
      {
        disableClose: true,
        width: '396px',
        data: { itemData: tableData, action: action, configdata: this.ConfigData }
      });
    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
      // do something
      console.log(x);
      this.detectActionValue.emit({ objectRowData: x, action: action + "Search", pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.detectActionValue.emit({ objectRowData: { popUpData: result, rowData: tableData }, action: action, pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
      }
    });

  }

  findw() {
    
  }
}


@Component({
  selector: 'CustomizeableTable',
  templateUrl: './CustomizeableTable.html',
  styleUrls: ['./single-table.component.scss']
})
export class OpenCustomizeableTable {
  hideShow: boolean;
  id?: number;
  name?: string;
  order?: number;
  isFixed?: boolean;
  isImage?: boolean;
  title: string;
  isLink: boolean;
  routerLink: string;
  isModal: boolean;
  isStatus: boolean;
  className: string;
  hideFilter: boolean;
  isPopUp: boolean;
  dateFormat: string;
  //New
  prevArray = [];
  firstPanel;
  /** Inline editable table declares starts here */
  controltype: string;
  columnDisable: boolean;
  closePopUp: boolean;
  dependecy: string
  relationship: string;
  selectName: string;
  /** Inline editable declarations ends here */
  secondPanel;
  selArray;
  noContainer = 3
  thirdPanel;
  constructor(public userdat: DataCommunicationService, private PopUp: ErrorMessage, @Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<OpenCustomizeableTable>) { }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  orderChnage(moveFrom, nextTo) {
    let orderChange = [];


    orderChange = this.firstPanel.concat(this.secondPanel).concat(this.thirdPanel);


    orderChange = orderChange.filter(x => x.id != moveFrom.id);

    let index = orderChange.findIndex(x => x.id == nextTo.id);
    orderChange.splice(index, 0, moveFrom);

    orderChange.forEach((x, i) => {
      x.order = i + 1;
    });
    this.createPannel(orderChange);

  }

  drop(event: CdkDragDrop<any[], any[]>) {

    if (!event.container.data[event.currentIndex].isFixed) {
      if (event.previousContainer === event.container) {

        //replacing the order when it moved from one panel to other panel
        let item = event.container.data[event.previousIndex].order;
        let item2 = event.container.data[event.currentIndex].order;

        event.container.data[event.previousIndex].order = item2;
        event.container.data[event.currentIndex].order = item;
        //default method to swap the postions in  the array   
        var preItem = event.container.data[event.previousIndex];
        event.container.data[event.previousIndex] = event.container.data[event.currentIndex];
        event.container.data[event.currentIndex] = preItem;
      } else {


        //Checking the position of droping either above the item or below the item

        if (event.currentIndex < event.container.data.length) {
          //replacing the order when it moved from one panel to other panel
          var item = event.previousContainer.data[event.previousIndex];
          var item1 = event.container.data[event.currentIndex];
          // var order = item.order;
          // item.order = item1.order;
          // item1.order = order;
          // event.previousContainer.data[event.previousIndex] = item1;
          // event.container.data[event.currentIndex] = item;
          this.orderChnage(item, item1)


        }
        else {

          var item = event.previousContainer.data[event.previousIndex];
          var item1 = event.container.data[event.currentIndex - 1];
          this.orderChnage(item, item1)
          // var order = item.order;
          // item.order = item1.order;       
          // item1.order = order;
          // event.previousContainer.data[event.previousIndex] = item1;
          // event.container.data[event.currentIndex - 1] = item;
        }
      }



    }
    else {
      // alert("You can't swap the freezed columns");
      this.PopUp.throwError("You can't swap the freezed columns")
    }


  }

  createPannel(data: any[]) {
    let headerData = data;

    this.firstPanel = [];
    this.secondPanel = [];
    this.thirdPanel = [];
    //calculating length defult container is set 3
    //spliting header data into 3 parts
    var totalCount = headerData.length;
    if (totalCount > 3) {
      var a1 = Math.ceil(totalCount / this.noContainer);
      var remaining = totalCount % this.noContainer;

      var c1 = a1;
      var c2 = 2 * a1;
      if (remaining == 2) {
        // c1 = c1 + 1;
        // c2 = c2 + 2;
      }
      if (remaining == 1) {
        // c1 = c1 + 1;
        // c2 = c2 + 1;
      }
      //looping through items and assign into respective panels

      headerData.forEach((x, i) => {
        if (i < c1) {
          //first panel
          x.order = i + 1;
          this.firstPanel.push(x);
        }
        if (i > c1 - 1 && i < c2) {
          //second panel
          x.order = i + 1;
          this.secondPanel.push(x);
        }
        if (i > c2 - 1) {    //third panel
          x.order = i + 1;
          this.thirdPanel.push(x);
        }
      });

    }
  }
  ngOnInit() {

    this.selArray = [];
    // this.data.forEach(x => {
    //   this.prevArray.push({ id: x.id, name: x.name, isFixed: x.isFixed, order: x.order, title: x.title, isModal: x.isModal, isLink: x.isLink, isStatus: x.isStatus, className: x.className, hideFilter: x.hideFilter, isPopUp: x.isPopUp, dateFormat: x.dateFormat, controltype: x.controltype, columnDisable: x.columnDisable, closePopUp: x.closePopUp, dependecy: x.dependecy, relationship: x.relationship, selectName: x.selectName })

    //   if (x.isFixed == true) {
    //     this.selArray.push(x.id);

    //   }
    // })
    this.data.forEach(x => {
      if (x.isFixed == true) {
        this.selArray.push(x.id);

      }
    });
    this.prevArray = JSON.parse(JSON.stringify(this.data))
    var curentData = JSON.parse(JSON.stringify(this.data))
    this.createPannel(curentData)

    //End of new Code

  }

  columSort(event: any, event1: any) {


    if (this.selArray.length < 3 || !event.isFixed == false) {

      if (event.isFixed == false) {
        this.selArray.push(event.id);
        event.isFixed = !event.isFixed;
      }
      else {
        event.isFixed = !event.isFixed;
        this.selArray = this.selArray.filter(item => item !== event.id);


      }
    }

    else {
      this.PopUp.throwError("Uh-oh!! you can only freeze 3 columns.");

    }

  }
  onApply(): void {
    let updatedArray = [];
    //concating all items
    let final = concat(this.firstPanel, this.secondPanel, this.thirdPanel);

    final.subscribe(x => updatedArray.push(x));

    //updatedArray.shift();
    this.dialogRef.close(updatedArray);
  }
  onCancel(): void {


    this.dialogRef.close(this.prevArray);

  }

  resetBut(): void {
    let resetArray = [];
    //reseting the headers
    // this.userdat.cachedArray.forEach((x, i) => {
    //   x.isFixed = false;
    //   x.order = i + 1;
    //   resetArray.push({ id: x.id, name: x.name, isFixed: x.isFixed, order: x.order, title: x.title, isModal: x.isModal, isLink: x.isLink, isStatus: x.isStatus, className: x.className, hideFilter: x.hideFilter, isPopUp: x.isPopUp, dateFormat: x.dateFormat, controltype: x.controltype, columnDisable: x.columnDisable, closePopUp: x.closePopUp, dependecy: x.dependecy, relationship: x.relationship,selectName:x.selectName })

    // });
    // resetArray[0].isFixed = true;
    resetArray = JSON.parse(JSON.stringify(this.userdat.cachedArray))
    //  resetArray = Object.assign([], this.userdat.cachedArray);
    resetArray = resetArray.sort(function (a, b) {
      return a.id - b.id;
    })
    resetArray.forEach((x, i) => {
      if (i == 0) {
        x.isFixed = true;
      } else {
        x.isFixed = false;
      }

      x.order = i + 1;
    });

    this.createPannel(resetArray)

    this.selArray = [this.userdat.cachedArray[0].id];

  }
}

@Component({
  selector: 'delete',
  templateUrl: './delete-modal.html',
})
export class Delete {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<Delete>, public userdat: DataCommunicationService) {
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
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

@Component({
  selector: 'leadextend-pop',
  templateUrl: './leadextend-pop.html',
})
export class leadextendComponent { }

//searchlink pop starts
@Component({
  selector: 'searchlink-pop',
  templateUrl: './searchlink-pop.html',

})

export class searchlinkComponent {
  constructor(public dialogRef: MatDialogRef<searchlinkComponent>, ) { }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }


  companyName: string;
  showCompany: boolean;
  showCompanySwitch: boolean = true;

  companyNameClose() {

    this.showCompanySwitch = false;
  }

  companyDetails: {}[] = [

    { name: "Sin", contact: 'Anubhav Jain', location: 'Singapore', BU: 'Vertical1' },
    { name: "TCS", contact: 'Anubhav Jain', location: 'Singapore', BU: 'Vertical1' },
    { name: "Wipro", contact: 'Anubhav Jain', location: 'Singapore', BU: 'Vertical1' },
    { name: "Sin", contact: 'Anubhav Jain', location: 'Singapore', BU: 'Vertical1' },
    { name: "Sin", contact: 'Anubhav Jain', location: 'Singapore', BU: 'Vertical1' },
    { name: "Sin", contact: 'Anubhav Jain', location: 'Singapore', BU: 'Vertical1' },
    { name: "Sin", contact: 'Anubhav Jain', location: 'Singapore', BU: 'Vertical1' }

  ]

  appendName(value: string) {

    this.companyName = value;
  }

}

//searchlink pop ends
@Component({
  selector: 'leadreject-pop',
  templateUrl: './leadreject-pop.html',
})
export class leadrejectComponent { }

@Component({
  selector: 'leads-linked',
  templateUrl: './leads-linked-modal.html',
})
export class LeadsLinked implements OnInit, OnDestroy {

  subscription: Subscription
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public location: Location, public dialogRef: MatDialogRef<LeadsLinked>) {
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  leadsData: any;
  ngOnInit() {
    history.pushState(null, null, window.location.href);
    this.subscription = <Subscription>this.location.subscribe((x) => {
      console.log(x)
      history.pushState(null, null, window.location.href);
    })
    this.leadsData = this.data;
    console.log('leads linked pop up', this.leadsData)
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

// Generic popup starts
@Component({
  selector: 'generic-modal',
  templateUrl: './generic-modal.html',
  styleUrls: ['./single-table.component.scss'],
})

export class genericModal implements OnInit, OnDestroy {


  remarksContent: any;
  datePicker: any;
  today: any;
  remarksContentMulti: any;
  selectDrop: string = "-1";

  @Output() dateInput: EventEmitter<MatDatepickerInputEvent<any>>
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public location: Location, public dialogRef: MatDialogRef<genericModal>, public userdat: DataCommunicationService, public errorMessage: ErrorMessage) {
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  leadsData: any;
  invalid: boolean;
  invalidMulti: boolean;
  datePickerInvalid: boolean;
  replInvalid: boolean;
  maxTextInValid: boolean;
  subscription: Subscription
  selectInvalid: boolean
  selectDataObj: any;
  StartDate: any;
  sixMonthDate: any;
  ngOnInit() {
    history.pushState(null, null, window.location.href);
    this.subscription = <Subscription>this.location.subscribe((x) => {
      console.log(x)
      history.pushState(null, null, window.location.href);
    })
    console.log(this.data);
    this.today = new Date()
    this.StartDate = new Date()
    var month = (this.StartDate.getMonth() + 3);
    var date = this.StartDate.getDate();
    var year = this.StartDate.getFullYear();
    this.sixMonthDate = new Date(year, month, date)
    // console.log(this.data.itemData[0][this.userdat.cachedArray[0].name])
  }

  ngOnDestroy() {

    this.subscription.unsubscribe();
  }


  emitData() {
    if (this.data.configdata.isSelectdrop) {
      this.selectDataObj = this.data.configdata.dropData.filter(x => x.id == this.selectDrop)[0]
    }
    this.dialogRef.close({ data: this.data.itemData, tablename: this.data.tableName, date: this.datePicker, comment: this.remarksContent, discard: this.remarksContentMulti, dropData: this.selectDataObj });
  }
  maxLength: string;
  maxval: boolean = false;
  omit_special_char(event) {
    // debugger;
    console.log(event);
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)

    if (k == 32 && event.target.value.length === 0) {
      return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || (k >= 48 && k <= 57));
    } else if (event.target.value.length <= 100) {
      return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
    } else {
      return false
    }
  }

  omit_special_char_remarks(event) {
    // debugger;
    console.log(event);
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)

    if (k == 32 && event.target.value.length === 0) {
      return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || (k >= 48 && k <= 57));
    } else if (event.target.value.length <= 2500) {
      return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
    } else if (event.target.value.length > 2500) {
      this.maxTextInValid = true
      return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57))
    } else {
      // this.maxTextInValid = false
      return false
    }
  }
  validationCheckMob(event) {
    if (event.target.value !== "-1") {
      this.selectInvalid = false;
    } else {
      this.selectInvalid = true;
    }
  }

  maxTextenter(maxChar) {
    if (maxChar.length > 2000) {
      return false;
    } else {
      return true;
    }
  }

  validationCheck(event) {
    if (event.value !== "-1") {
      this.selectInvalid = false;
    } else {
      this.selectInvalid = true;
    }
  }
  onrestoresubmit() {
    debugger
    this.invalid = this.data.configdata.isRemarksRequired ? this.remarksContent ? (this.remarksContent.trim().length > 0 ? false : true) : true : false;
    this.invalidMulti = this.data.configdata.isMultiInput ? this.remarksContentMulti ? (this.remarksContentMulti.trim().length > 0 ? false : true) : true : false;
    if (this.data.configdata['isRemarks']) {
      this.maxTextInValid = (!this.invalid) ? this.remarksContent.trim().length > 2500 ? true : false : false;
    }
    // debugger
    this.datePickerInvalid = this.data.configdata.isDatePickerRequired ? this.datePicker ? false : true : false;
    this.selectInvalid = this.data.configdata.isSelectdrop ? this.selectDrop == "-1" ? true : false : false;
    if (!this.invalid && !this.invalidMulti && !this.datePickerInvalid && !this.maxTextInValid && !this.selectInvalid) {


      if (this.data.configdata.ButtonLabel == "Replicate") {
        if (this.remarksContent.toLowerCase() == this.data.itemData[0][this.userdat.cachedArray[0].name].toLowerCase()) {
          this.replInvalid = true;
        } else {
          this.replInvalid = false;
          this.emitData();
        }
      }
      else {
        this.emitData();
      }

    }
    if (this.replInvalid) {
      this.errorMessage.throwError('Activity group name is already exist. Enter another name')
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
  makeValid() {
    this.data.configdata.isDatePickerRequired = true
    this.datePickerInvalid = false
  }
}

// Generic popup ends
// Sprint 3 pop-ups
//Kiran Code
@Component({
  selector: 'confirmapproval',
  templateUrl: './Sprint3Models/confirmapproval-popup.html',
})
export class OpenConfirmApproval {
  redirect_from: string = '';
  overallcomment: string;
  accountData: any;
  approvalObj = { action: '', comment: '' };

  @Output() modelEmiter = new EventEmitter();
  isActivation: string = '';
  constructor(public dialogRef: MatDialogRef<OpenConfirmApproval>, public userdat: AccountService, public dialog: MatDialog, public accservive: DataCommunicationService, @Inject(MAT_DIALOG_DATA) public data: any) {
    //  var accountName = JSON.stringify(data);
    console.log(data + "  overview");
    this.accountData = data.itemData;
    this.isActivation = data.isActivation ? data.isActivation : '';
    this.redirect_from = data.itemData && data.itemData.redirect_from ? data.itemData.redirect_from : '';
    console.log(this.redirect_from);

  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }

  ConfirmComment(act, overallcomments): void {
    this.approvalObj = { action: act, comment: overallcomments };
    this.dialogRef.close(this.approvalObj);
    this.dialogRef.close(act);
  }



  close = false;
  /****************** customer contact autocomplete code start ****************** */

  showCustomer: boolean = false;
  customerName: string = "";
  customerNameSwitch: boolean = true;

  customerNameclose() {

    // if(this.customerName.length > 0){
    this.customerNameSwitch = false;
    // }
  }

  appendcustomer(item: any) {

    this.customerName = item.contact;
    this.selectedCustomer.push(item);

  }



  selectedCustomer: {}[] = [];

  /****************** customer contact autocomplete code end ****************** */

  closeDiv(item: any) {
    //this.close=true;
    console.log(this.selectedCustomer);

    // this.customerContact.push(item);

    this.selectedCustomer = this.selectedCustomer.filter((x: any) => x.index != item.index);
  }

  ngOnInit() {
    console.log(this.data)
  }
}



/**Kiran */
@Component({
  selector: 'confirmrejection',
  templateUrl: './Sprint3Models/confirmrejection-popup.html',
})
export class OpenConfirmRejection {
  selectBox: any;
  textArea: any;
  overallcomment: string;
  // redirect_from: string = '';
  accountData: any;
  rejSubmitted = false;
  //  data: { itemData: tableData, column: actionName, configdata: this.ConfigData }
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<OpenConfirmRejection>, public userdat: AccountService, public accservive: DataCommunicationService) {
    console.log(data + "  overview");
    this.accountData = data.itemData;
    // this.redirect_from = data.itemData && data.itemData.redirect_from ? data.itemData.redirect_from : '';
    // console.log(this.redirect_from);
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  ConfirmComment(act): void {
    this.dialogRef.close(act);
  }
  submitComment(act, submitComment) {
    if (submitComment && submitComment != "" && submitComment != " ") {
      // let rejectObj = { action: act, comment: submitComment };
      this.dialogRef.close(submitComment);
    } else {
      this.rejSubmitted = true;
      console.log(this.rejSubmitted);
      // this.snackBar.open("Comments field is mandatory", '', {
      //   duration: 3000
      // });
    }
  }
}

//chethana aug 2nd . starts
@Component({
  selector: 'rejectconfirm',
  templateUrl: './Sprint3Models/rejectconfirm-popup.html',
})
export class OpenRejectConfirm {
  selectBox: any;
  textArea: any;
  overallcomment: string;
  //  data: { itemData: tableData, column: actionName, configdata: this.ConfigData }
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public location: Location, public dialogRef: MatDialogRef<OpenRejectConfirm>, public userdat: AccountService, public accservive: DataCommunicationService) { }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  goBack() {
    this.location.back();
  }

  ConfirmComment(): void {
    this.dialogRef.close(this.overallcomment);
  }
}

//chethana aug 2nd OpenRejectConfirm ends

@Component({
  selector: 'openoverview',
  templateUrl: './Sprint3Models/overview-popup.html',
})
export class OpenOverview {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<OpenOverview>, public userdat: AccountService, public accservive: DataCommunicationService) {
    let accountName = JSON.stringify(data);
    console.log(JSON.stringify(data) + "  overview");
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
}
/**Kiran */
@Component({
  selector: 'confirmapprovalwithswap',
  templateUrl: './Sprint3Models/confirmapprovalwithswap-popup.html',
})
export class ConfirmApprovalWithSwap {
  constructor(public userdat: AccountService, public dialogRef: MatDialogRef<ConfirmApprovalWithSwap>, public accservive: DataCommunicationService) { }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  Confirm(): void {
    this.dialogRef.close(true);
  }
}
@Component({
  selector: 'overviewhistory',
  templateUrl: './Sprint3Models/overviewhistory-popup.html',
})
export class OpenOverviewHistory {
  constructor(public userdat: AccountService, public accservive: DataCommunicationService, public dialogRef: MatDialogRef<OpenOverviewHistory>) { }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
}
@Component({
  selector: 'history',
  templateUrl: './Sprint3Models/history-popup.html',
})
export class OpenHistory {
  constructor(public userdat: AccountService, public accservive: DataCommunicationService, public dialogRef: MatDialogRef<OpenHistory>) { }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
}

//sprint 2 models
@Component({
  selector: 'close-popup',
  templateUrl: './Sprint2Models/close-popup.html',
  styleUrls: ['./single-table.component.scss']
})

export class ClosePopup {
  constructor(public dialogRef: MatDialogRef<ClosePopup>) { }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
}
@Component({
  selector: 'newconver-popup',
  templateUrl: 'new-conversation.html',
  styleUrls: ['./single-table.component.scss']
})
export class NewConversationPopup implements OnInit {
  campaignType;
  data: any;
  constructor(
    private masterApi: MasterApiService,
    public dialog: MatDialog,
    private newconversationService: newConversationService,
    private router: Router,
    private meetingService: MeetingService,
    private newConver: ConversationService,
    public service: DataCommunicationService,
    public offlineService: OfflineService,
    public dialogRef: MatDialogRef<NewConversationPopup>) { }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.meetingService.createdMeetingGuid = ""
    this.masterApi.getConversationType().subscribe(res => {
      this.offlineService.addMasterApiCache(routes.GetConversationType, res)
      this.campaignType = res.ResponseObject;
      console.log("type in conversation component", this.campaignType);
    })
  }
  sub(id: any, item) {
    this.data = item.Value;
    localStorage.setItem('conversationType', item.Value);
    localStorage.removeItem('replicateId')
    this.newconversationService.conversationAppointId = undefined;
    localStorage.setItem('typeOfConversation', id);
    this.newconversationService.conversationFiledInformation = undefined;
    this.meetingService.meetingDetails = undefined;
    this.meetingService.createdMeetingGuid = "";
    this.newconversationService.attachmentList = []
    this.router.navigate(['/activities/newmeeting'])
  }
}


@Component({
  selector: 'dealReject',
  templateUrl: './dealReject-popup.html',
  styleUrls: ['./single-table.component.scss']

})
export class DealReject {

  constructor(public dialogRef: MatDialogRef<DealReject>, @Inject(MAT_DIALOG_DATA) public data) { }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  ngOnInit() {
    console.log("Reject pop: ", this.data)
  }

  rejectReason: any;

  confirm(type) {
    if (type == 'ACCEPT') {
      this.dialogRef.close('Confirm');
    }
    else {
      if (this.rejectReason != "") {
        this.dialogRef.close({ rejectReason: this.rejectReason });
      }

    }
  }
  cancel() {
    this.dialogRef.close();
  }
}
//sprint5
@Component({
  selector: 'assign-deal-popup',
  templateUrl: './assignDeal-popup.html',
  styleUrls: ['./single-table.component.scss']
})

export class assignDealpopComponent {

  @Output() modelEmiter = new EventEmitter();
  customerName: string = "";
  customerNameSwitch: boolean = true;
  //customerContact=[];
  selectedCustomerDeal: {}[] = [];
  constructor(public dialogRef: MatDialogRef<assignDealpopComponent>, @Inject(MAT_DIALOG_DATA) public data) { }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }

  appendcustomer(item) {

    this.customerName = " ";
    this.selectedCustomerDeal.push(item)
  }
  onButtonClick() {
    this.modelEmiter.emit(this.customerName);
  }

  onConfirm() {
    // this.modelEmiter.emit(this.customerName);
    this.dialogRef.close(this.selectedCustomerDeal)
  }
}