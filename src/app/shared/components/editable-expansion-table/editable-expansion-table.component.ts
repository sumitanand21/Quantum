import { Component, OnInit, Output, EventEmitter, Inject, Input, HostListener, SimpleChanges, ViewChild, ElementRef, OnChanges, DoCheck } from '@angular/core';
import { Observable, of, concat, from, Subject } from 'rxjs';
import { map, filter, pluck, groupBy, mergeMap, toArray, debounceTime } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AccountService } from '@app/core/services/account.service';
import { OverviewHistoryPopupComponent } from '@app/shared/components/single-table/Sprint3Models/overview-history-popup/overview-history-popup.component';
import { OpenCustomizeableTable, ConfirmApprovalWithSwap, OpenConfirmApproval, OpenConfirmRejection, OpenHistory, OpenOverview, OpenOverviewHistory, ClosePopup, Delete, LeadsLinked, genericModal, leadextendComponent, leadrejectComponent, searchlinkComponent } from '@app/shared/components/single-table/single-table.component';
// import { User,User1 } from '../../services/user';
import { Router, RouterModule } from '@angular/router';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBar,
} from '@angular/material';
import { CdkDragDrop, CdkDragEnter, moveItemInArray, transferArrayItem, copyArrayItem, } from '@angular/cdk/drag-drop';
import { PaginationInstance } from 'ngx-pagination';
import { DataCommunicationService } from '@app/core/services/global.service';
import { actionListService, CommentList, OpportunitiesService } from '@app/core';
import { DashboardPopupComponent } from '@app/shared/modals/dashboard-popup/dashboard-popup.component';
import { FormControl, FormBuilder, FormArray, ControlContainer, NgForm } from '@angular/forms';
import { AddingmemberComponent } from '../single-table/sprint4Modal/addingmember/addingmember.component';
import { RequestresourceComponent } from '../single-table/sprint4Modal/requestresource/requestresource.component';
import { create } from 'domain';
import { isError } from 'util';

import { TestRequest } from '@angular/common/http/testing';
/*********************** Constant pop up contents starts ********************* */
const restoreLead = {
  ButtonLabel: "Restore",
  ModelTitle: "Restore lead ",
  SpecialText: "This lead will be restored.",
  isDatePicker: false,
  isRemarks: false,
  isSinglebutton: true
}

const replicate = {
  ButtonLabel: "Replicate",
  ModelTitle: "Replicate conversation ",
  SpecialText: "This will replicate the conversation which can be  modified further and split the conversation which was captured as one.",
  isDatePicker: false,
  isRemarks: false,
  isLeadName: true,
  isSinglebutton: true
}

const restoreConversation = {
  ButtonLabel: "Restore",
  ModelTitle: "Restore conversation",
  SpecialText: "This activity will be be re-activated for further action.",
  isDatePicker: false,
  isRemarks: false,
  isSinglebutton: true
}

const nutureLead = {
  ButtonLabel: "Nurture",
  ModelTitle: "Nurture lead",
  SpecialText: "This lead will be nurtured.",
  isDatePicker: true,
  isRemarks: true,
  remarksLabel: "Nurture remarks",
  remarksPlaceholder: 'Enter nurture remarks',
  datepickerLabel: 'Nurture deadline',
  isSinglebutton: true
}

const archiveLead = {
  ButtonLabel: "Archive",
  ModelTitle: "Archive lead",
  SpecialText: "This lead will be archived.",
  isDatePicker: true,
  isRemarks: true,
  remarksLabel: "Archive remarks",
  remarksPlaceholder: 'Enter archive remarks',
  datepickerLabel: 'Set reminder prompt date *',
  isSinglebutton: true
}

const archiveConversation = {
  ButtonLabel: "Archive",
  ModelTitle: "Archive Conversation ",
  SpecialText: "This conversation will be archived.",
  isDatePicker: true,
  isRemarks: true,
  remarksLabel: "Archive remarks",
  remarksPlaceholder: 'Enter archive remarks',
  isSinglebutton: true
}

const disqualifyLead = {
  ButtonLabeltwo: "Cancel",
  ButtonLabelthree: "Reject",
  ModelTitle: "Reject lead *",
  isDatePicker: false,
  isRemarks: true,
  isLeadName: true,
  remarksPlaceholder: 'Write your reason here..',
  isDoublebutton: true
}

const convertOpportunity = {
  ButtonLabel: "Create account",
  ModelTitle: "Opportunity - account",
  SpecialText: "Your current account linked does not exist, please create the account to continue to opportunity creation process.",
  isDatePicker: false,
  isRemarks: false,
  isAccountName: true,
  isSinglebutton: true
}

const multiDelete = {
  // ButtonLabel: "Create account",
  ButtonLabeltwo: "Cancel",
  ButtonLabelthree: "Yes",
  labelForContent: "You are about to delete the following roles",
  ModelTitle: "Do you want to delete multiple members?",
  // SpecialText: "your about to delete following roles",
  isDatePicker: false,
  isRemarks: false,
  isAccountName: false,
  isDoublebutton: true,
  isMultiActionDelete : true
}

/***********************  Constant pop up contents ends ********************* */

@Component({
  selector: 'app-editable-expansion-table',
  templateUrl: './editable-expansion-table.component.html',
  styleUrls: ['./editable-expansion-table.component.scss'],
  //viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class EditableExpansionTableComponent implements OnInit {
  /** All Declarations including parents input params starts here */
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
  @Input() IsDeactivate: boolean;
  @Input() IsRestore: boolean;
  @Input() IsNurture: boolean;
  @Input() IsDisqualify: boolean;
  @Input() IsEdit: boolean;
  @Input() Ismailbox: boolean;
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
  @Input() IsLink: boolean;
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
  @Input() IsAccessActivation: boolean;
  @Input() ExpansionTable: string = '';
  @Input() IsDashboard: boolean;
  @Input() IsDeleteAccount: boolean;
  @Input() IsInitialsRequired: boolean;
  @Input() IsInitialsRequiredteam: boolean;
  @Input() IsDownload: boolean;
  @Input() ConfigData: any;
  @Input() orderByName;
  @Input() sortBy: boolean = false;


  //Sprint 3
  @Input() IsApproveNoPopup: boolean = false;
  @Input() IsAddNewResource: boolean = false;
  // Sprint 4
  @Input() IsConvert: any;
  @Input() IsSelection: any;
  @Input() IsDeleteTeamMember: any;
  @Input() hideAddNewMember: boolean;
  @Input() IsSerialNo: boolean;
  @Input() hideSort: boolean;
  
  //sprint5
  @Input() IsPageRecords: boolean = true;
  @Input() IsPagination: boolean = true;
  @Input() IsButtons: boolean;
  @Input() IsAddMember: boolean = true;
  @Input() classNameCss: string;
  @Input() IsAfterEdit: boolean = true;
  @Input() IsHeaderData: boolean = false;
  @Input() HeaderData = [];
  @Input() IsEditWholeTable: boolean;
  @Input() IsUpdateRequest: boolean;
  @Input() orderType: string = "String"
  @Input() AllTopBtnLable: any = [];
  @Input() externalValue:any;


  @Input() IsMultipleAddRestrict:boolean=false;
  more: boolean;
  istyping: boolean = false;

  //14th Oct autocomplete api search changes
  isautotyping: boolean = false;

  isTableRowChecked: boolean = false;
  checkname: string = "";
  hoverchange = false;
  holdPreValue: any;
  //service search and pagination declarations start
  @Input() serviceSearch: boolean; //api service search make it true in parent
  serviceSearchItem: string;
  isLoading: boolean = false;
  paginationLastIndex: number = 1;
  IsPaginagtion: boolean;
  IsPageChangeEvent: boolean;
  //service search and pagination declarations end

  statusTextFlag;
  DummyOverlay: boolean = false;

  /***Mobile Pagination */
  isMobileDevice: boolean = false;
  isPagination: boolean = false;
  currentPageFilter: number;
  fromShowCheckBox = false;
  /**Pagination Added Code **/
  isIntialized: boolean = false;
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
  fixedColumn;
  normalColumn;
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
  createRow: boolean = false;
  IsinitialsLoading: boolean;
  editableRow = [];
  rowEdit: boolean;
  toggleSwitch: boolean;
  isInitialColumn: boolean;
  relationship: any;
  allias: any;
  controltype: any;
  isInlineStage: boolean;
  closePopUp: boolean;
  calenderView: boolean = false;
  selectdIcn: boolean;
  classContent: string = "mdi-plus";
  childContent: string = "mdi-delete";
  arrowkeyLocation = 0;
  newAddMember = [];
  tempNewAddMember = [];
  selectAllVisibility:boolean=false;
  headerOverlay: boolean = false;
  streamCal: boolean = false;
  /**
   * 
   * Global Sort filter controls starts here 
   */
  @Input() filterConfigData: any;
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

  /** 
   * 
   * Global Sort filter controls ends here 
  */
  account_dash() {
  }
  @Output() detectActionValue = new EventEmitter<{ objectRowData: any, action: string, pageData: any, configData: any, filterData: any  }>();
  @Output() detectPageChangeData = new EventEmitter<{ objectRowData: any, action: string, currentPage: number, itemsPerPage: number,filterData: any  }>();
  @Output() detectSelectDependentData = new EventEmitter<{ selected: any, action: string }>();
  private searchText$ = new Subject<string>();

  //14th Oct autocomplete api search changes
  private autoText$ = new Subject<{search : "", column : ""}>();
  /** All Declarations including parents input params ends here */


  /**
   * Editable table constructor starts here
   */
  constructor(private router: Router, public service: AccountService,
    public userdat: DataCommunicationService, public dialog: MatDialog, private fb: FormBuilder, private snackBar: MatSnackBar,
    public oppService: OpportunitiesService) {

  }
roleAccess:boolean;
  /**
  * Editable table constructor ends here
  */
  /**
 * Editable table ngOnInit starts here
 */
  headerForm = this.fb.group({
    controls: this.fb.array([])
  })

  today = new Date();
  estClosureDate = new Date(this.oppService.getSession('estDate'));
  ngOnInit() {
    this.roleAccess  = this.userdat.getRoleAccess();
    this.isLoading = true;
    this.userdat.serviceSearchItem = "";
    this.userdat.tableRecordsChecked = false;
    // this.masterApi.getConversationType().subscribe(res => {

    //   this.campaignType = res.ResponseObject;

    // })
    
    //14th Oct autocomplete api search changes
    this.autoText$.pipe(debounceTime(1000)
    ).subscribe(x => {
      this.autoSearchData(x);
    })
   //14th Oct autocomplete api search changes end

    this.searchText$.pipe(debounceTime(1000)
    ).subscribe(x => {
      this.serviceSearchData();
    })
    this.isIntialized = true
    this.isMobileDevice = window.innerWidth < 800 ? true : false;

    var orginalArray = this.userdat.getTableData(this.TableName);
    this.IsinitialsLoading = true;


    // orginalArray.subscribe((x: any[]) => {
    //   this.headerData = x,
    //     this.userdat.cachedArray = x
    //   this.splitHeaderData();
    // });
    if (!this.IsHeaderData) {
      orginalArray.subscribe((x: any[]) => {
        this.headerData = x.map(x => {
          x.isFilter = false;
          x.isAscOrder = false;
          if (!x.hideFilter) {
            if (x.dateFormat) {
              this.headerFilterDetails.filterColumn[x.name] = [{ filterStartDate: '', filterEndDate: '', isDatafiltered: false }];
            } else {
              this.headerFilterDetails.filterColumn[x.name] = [];
            }
          }
          return x
        })
        this.userdat.cachedArray = x;
        this.splitHeaderData();
        //this.generateNewDynamicRowData();
      });
    }
    else {
      this.headerData = this.HeaderData,
        this.userdat.cachedArray = this.HeaderData,
        this.splitHeaderData();
      //this.generateNewDynamicRowData();
    }

    /** Dynamic add new row load data starts here*/
    // let tempHead = this.headerForm.get('controls') as FormArray;
    // this.headerData.forEach((element, i) => {
    //   tempHead.push(this.fb.control(''))
    // });

    /** Dynamic add new row load data ends here*/

    if (this.TableCollection[0][this.headerData[0].name] != null) {
      this.loadInitials();
       this.userdat.ActionColumnFixed = this.IsActionFixed;
      this.userArray = this.TableCollection;
      if(this.headerData[0].isReadOnlyEdit)
      {
        let count=this.TableCollection.filter(x=>!x['isDefault']).length;
          this.selectAllVisibility=count>=2? true:false;
      }
      else
      {
        this.selectAllVisibility=this.TableCollection>=2? true:false;
      }
      console.log(this.userArray)
      // this.key = this.headerData[0].name;
      // this.reverse = false;
      // this.config.currentPage = 1;
      /****mobile filter*** */

      this.filterData();
      if (this.isMobileDevice) {
        this.sectionData = this.mobileFilter[0].data;
        this.activetabs = this.mobileFilter[0].key;
      }
      this.sectionData = this.mobileFilter[0].data;
      this.activetabs = this.mobileFilter[0].key;

      // this.key = this.orderByName ? this.orderByName : this.headerData[0].name;
      // this.reverse = this.sortBy;

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
      /*************************************** */

    }
    else {
      this.userArray = []
    }

    /** Custom scroll impl starts here */
      setTimeout(() => {
      this.userdat.findWidth()
    }, 200);
    
    /** Custom scroll impl ends here */

  }
  checkValidation(type, value, property,tableData?) {


    if (property.isDuplicateValidationReq) {
      if (tableData[property.name].id != -1) {
        if (tableData) {
          var message = "";
          var temp = this.tempNewAddMember.filter(it => it[property.name].id == tableData[property.name].id);

          if (temp.length > 1) {
            tableData[property.name]={id:"-1",name:''};
            //tableData[property.name].name="";
            message = "Role " + '"'+temp[0].Role.name+'"' + " cannot be duplicated. Please ensure to tag only one user for this role"
            //myData.controls[item.order - 1].setValue('');
            this.snackBar.open(message, this.action, { duration: 3000 });
          //  this.validData(property, true, tableData);
          return;
          }
        }
      }
      tableData[property.name].name = this.ConfigData[property.name].filter(x => x.id == value)[0].name;
      this.detectActionValue.emit({ objectRowData: tableData, action: property.name, pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
    
    }
    else
    {
      if (type == 'id') {
        if (value == "-1") {
          property.IsError = true
        }
        else {
          property.IsError = false
        }
      }
      else {
        if (value == "") {
          property.IsError = true
        }
        else {
          property.IsError = false
        }
      }
    }
    
  }

  clearInlineObject(item,propertName) { 
    item[propertName] = item[propertName].id?{id:'-1',name:''}:{id:'-1',name:''};
  }
  //TopButonsVisibility Sprint 5
  checkTopVisibility(BtnName) {

    return this.AllTopBtnLable.some(x => x == BtnName);
  }
  generateNewDynamicRowData() {
    let tempNewAddRow = {};
    var d=new Date();
    tempNewAddRow['id']="addRow-"+d.getMilliseconds();
    this.headerData.forEach(element => {
      // element.isFilter = false;
      switch (element.controltype) {
        case 'select':
          {
            tempNewAddRow[element.name] = { id: "-1", name: "" }
          }
          break;
        case 'input':
          {
            tempNewAddRow[element.name] = ""
          }
          break;
        case 'autocomplete':
          {
            tempNewAddRow[element.name] = { id: "-1", name: "" }
          }
          break;
        case 'date':
          {
            tempNewAddRow[element.name] = ""
          }
          break;
        case 'selectSwitchDate':
          {
            tempNewAddRow[element.name] = "NA"
            tempNewAddRow["stageObject"] = false
            tempNewAddRow[element.switch] = { id: "-1", name: "" }
          }
          break;
        case 'label':
          {
            tempNewAddRow[element.name] = ""
          }
          break;
        case 'switch':
          {
            tempNewAddRow[element.name] = false
          }
          break;

      }
      if (element.IsRequired) {
        tempNewAddRow[element.validation] = false;
        tempNewAddRow[element.ErrorMessage]=""
      }
    });

    //this.newAddMember = [tempNewAddRow];
    this.newAddMember.push(tempNewAddRow);
    this.tempNewAddMember = Object.assign([], this.newAddMember);

  }
  validData(element, invalid, tableData?) {
    if (invalid) {
      if (tableData) {
        tableData.IsRowError = true;
        tableData[element.validation] = true;
      }
      else {
        this.newAddMember[0].IsRowError = true;
        this.newAddMember[0][element.validation] = true;
      }
      // element.IsError = true;
    }
    else {
      if (tableData) {
        if (!tableData.IsRowError) {
          tableData.IsRowError = false;
          tableData[element.validation] = false;
        }

      }
      else {
        if (!this.newAddMember[0].IsRowError) {
          this.newAddMember[0].IsRowError = false;
          this.newAddMember[0][element.validation] = false;
        }

      }
      // element.IsError = false;
    }
  }

  genericDynamicRowValidation(tableData?) {

    let modifiedValidationData = tableData ? tableData : this.newAddMember[0];
    modifiedValidationData.IsRowError = false;
    let tempDirtyHolder = this.headerData.filter(x => x.IsRequired);
    tempDirtyHolder.forEach(element => {
      let chekCondition=element.relationship? modifiedValidationData[element.relationship]:false;
      switch (element.controltype) {
        
        case 'select':
          {

            if (!element.isReadOnlyEdit) {
              if (element.isDuplicateValidationReq) {
                if (modifiedValidationData[element.name].id != -1) {

                  // if (tableData) {
                  //   var message = "";
                  //   var temp = this.userArray.filter(it => it[element.name].id == modifiedValidationData[element.name].id);

                  //   if (temp.length == 2) {
                  //     message = "Role " + temp[0].Role.name + " cannot be duplicated. Please ensure to tag only one user for this role"
                  //     //myData.controls[item.order - 1].setValue('');
                  //     this.snackBar.open(message, this.action, { duration: 3000 });
                  //     this.validData(element, true, tableData);
                  //   }

                  //   else {
                  //     if (element.isReadOnlyEdit) {
                  //       if (modifiedValidationData[element.isReadOnlyEdit]) {
                  //         this.validData(element, false, tableData);
                  //       } else {
                  //         modifiedValidationData[element.name].name = this.ConfigData[element.name].filter(x => x.id == modifiedValidationData[element.name].id)[0].name;
                  //         this.validData(element, false, tableData);
                  //       }

                  //     } else {
                  //       modifiedValidationData[element.name].name = this.ConfigData[element.name].filter(x => x.id == modifiedValidationData[element.name].id)[0].name;
                  //       this.validData(element, false, tableData);
                  //     }

                  //   }
                  // }
                  // else {
                  //   var message = "";
                  //   var temp = this.userArray.filter(it => it[element.name].id == modifiedValidationData[element.name].id);

                  //   if (temp.length == 1) {
                  //     message = "Role " + temp[0].Role.name + " cannot be duplicated. Please ensure to tag only one user for this role"
                  //     //myData.controls[item.order - 1].setValue('');
                  //     this.snackBar.open(message, this.action, { duration: 3000 });
                  //     this.validData(element, true, tableData);
                  //   }

                  //   else {
                  //     modifiedValidationData[element.name].name = this.ConfigData[element.name].filter(x => x.id == modifiedValidationData[element.name].id)[0].name;
                  //     this.validData(element, false, tableData);
                  //   }
                  // }
                  modifiedValidationData[element.name].name = this.ConfigData[element.name].filter(x => x.id == modifiedValidationData[element.name].id)[0].name;
                  this.validData(element, false, tableData);
                } else {
                  this.validData(element, true, tableData);
                  modifiedValidationData[element.ErrorMessage] = element.ValidMsg[0];
                }

              }
              else {
                if (modifiedValidationData[element.name].id == "-1" && !chekCondition) {
                  if (element.dependecy) {
                    if (modifiedValidationData[element.dependecy]) {
                      modifiedValidationData[element.name].name = this.ConfigData[element.name].filter(x => x.id == modifiedValidationData[element.name].id)[0].name;
                      this.validData(element, false, tableData);
                    }
                    else {
                      this.validData(element, true, tableData);
                      modifiedValidationData[element.ErrorMessage] = element.ValidMsg[0];
                    }
                  } else {
                    this.validData(element, true, tableData);
                    modifiedValidationData[element.ErrorMessage] = element.ValidMsg[0];
                  }
                  modifiedValidationData[element.ErrorMessage] = element.ValidMsg[0];
                  this.validData(element, true, tableData);
                }
                else {
                  if(!chekCondition)
                  {                  
                   modifiedValidationData[element.name].name = this.ConfigData[element.name].filter(x => x.id == modifiedValidationData[element.name].id)[0].name;
                  
                  }
                  this.validData(element, false, tableData);
                }
              }
            } else {
              
               
              if (modifiedValidationData[element.name].id == "-1" && !chekCondition) {
                if (element.dependecy) {
                  if (modifiedValidationData[element.dependecy]) {
                    modifiedValidationData[element.name].name = this.ConfigData[element.name].filter(x => x.id == modifiedValidationData[element.name].id)[0].name;
                    this.validData(element, false, tableData);
                  }
                  else {
                    this.validData(element, true, tableData);
                    modifiedValidationData[element.ErrorMessage] = element.ValidMsg[0];
                  }
                } else {
                  this.validData(element, true, tableData);
                  modifiedValidationData[element.ErrorMessage] = element.ValidMsg[0];
                }
                modifiedValidationData[element.ErrorMessage] = element.ValidMsg[0];
                this.validData(element, true, tableData);
              }
              else {
                // modifiedValidationData[element.name].name=this.ConfigData[element.name].filter(x=>x.id== modifiedValidationData[element.name].id)[0].name;
                this.validData(element, false, tableData);
              }
              //  this.validData(element, false, tableData);
            }

          }
          break;
        case 'input':
          {
            
            if (modifiedValidationData[element.name] == "" && !chekCondition) {
              modifiedValidationData[element.ErrorMessage]=element.ValidMsg[0];
              this.validData(element, true, tableData);
            }
            else {
              this.validData(element, false, tableData);
            }
          }
          break;
        case 'autocomplete':
          {
            if (element.relationship) {
              if (!modifiedValidationData[element.relationship]) {
                if (modifiedValidationData[element.name].id == "-1") {
                  modifiedValidationData[element.ErrorMessage]=element.ValidMsg[0];
                  this.validData(element, true, tableData);
                }
                else {
                  this.validData(element, false, tableData);
                }
              }
              else {
                this.validData(element, false, tableData);
              }
            }
            else {
              if (modifiedValidationData[element.name].id == "-1" && !chekCondition) {
                modifiedValidationData[element.ErrorMessage]=element.ValidMsg[0];
                this.validData(element, true, tableData);
              }
              else {
                this.validData(element, false, tableData);
              }
            }

          }
          break;
        case 'date':
          {

            if (element.dateRange && !chekCondition) {
              if (tableData.id.startsWith("addRow-")) {
                let today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
                if (modifiedValidationData[element.name] < today) {
                  modifiedValidationData[element.ErrorMessage] = element.ValidMsg[0];
                  this.validData(element, true, tableData);
                }
                else {
                  modifiedValidationData[element.name] = new Date(modifiedValidationData[element.name]).toISOString();
                  this.validData(element, false, tableData);
                }

              }
              else {
                if (modifiedValidationData[element.name] == "-" || modifiedValidationData[element.name] == "") {
                  modifiedValidationData[element.ErrorMessage]=element.ValidMsg[0];
                  this.validData(element, true, tableData);
                }
                else {
                  modifiedValidationData[element.name] = new Date(modifiedValidationData[element.name]).toISOString();
                  this.validData(element, false, tableData);
                }                 
                }
             
            }
            else {
              if (modifiedValidationData[element.name] == "" && !chekCondition) {
                modifiedValidationData[element.ErrorMessage]=element.ValidMsg[0];
                this.validData(element, true, tableData);
              }
              else {
                this.validData(element, false, tableData);
              }
            }
          }
          break;
        case 'selectSwitchDate':
          {
            if (modifiedValidationData["stageObject"] && !chekCondition) {
              if (modifiedValidationData[element.switch].id == "-1" && !chekCondition) {
                modifiedValidationData[element.ErrorMessage]=element.ValidMsg[1];
                this.validData(element, true, tableData);
              }
              else {
                modifiedValidationData[element.switch].name=this.ConfigData[element.name].filter(x=>x.id== modifiedValidationData[element.switch].id)[0].name;
                this.validData(element, false, tableData);
              }
            } else {

              if (element.dateRange && !chekCondition) {
                let endDate = new Date(modifiedValidationData[element.name]).toLocaleDateString();
                let startDate =  new Date(modifiedValidationData[element.dateRange]).toLocaleDateString();
                if ( Date.parse(endDate) < Date.parse(startDate)) {
                  this.validData(element, true, tableData);
                  //  this.endDateValid = TestRequest;
                  modifiedValidationData[element.ErrorMessage]=element.ValidMsg[0];
                  this.endDateErrorMsg = "End Date cannot be earlier than Start Date or greater than Est. closure date.";
                }
                else {
                  if (modifiedValidationData[element.name] == null || modifiedValidationData[element.name] == 'NA' || modifiedValidationData[element.name] == '' || modifiedValidationData[element.name] == 'undefined' || modifiedValidationData[element.name] == "-") {
                    modifiedValidationData[element.ErrorMessage]=element.ValidMsg[2];
                    this.validData(element, true, tableData);
                  } else {

                    modifiedValidationData[element.name] = new Date(modifiedValidationData[element.name]).toISOString();
                    this.validData(element, false, tableData);

                  }

                }


              }



            }
          }
          break;
        case 'label':
          {
            if (modifiedValidationData[element.name] == "" && !chekCondition) {
              modifiedValidationData[element.ErrorMessage]=element.ValidMsg[0];
              this.validData(element, true, tableData);
            }
            else {
              this.validData(element, false, tableData);
            }
          }
          break;

      }
    });


    if (!modifiedValidationData.IsRowError) {
      if (!this.IsApproveNoPopup) {
        if (modifiedValidationData.Request) {

          const dialogRef = this.dialog.open(RequestresourceComponent, {
            width: '369px',
            data: { row: modifiedValidationData, verticalName: this.ConfigData }
          });

          dialogRef.afterClosed().subscribe(result => {
            console.log("result", result)
            if (result) {
              this.createRow = false;
              modifiedValidationData.isRowEditable = false;
             // this.clearRowValidation(result);
              if(result.row.id.startsWith("addRow-")) {
                this.newAddMember = this.newAddMember.filter(x=>x.id != result.row.id);
                this.detectActionValue.emit({ objectRowData: result, action: 'addNewRow', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
                this.selectedAll = false;
                /** custom scroll impl  starts here*/
                setTimeout(() => {
                  this.userdat.findWidth(true)
                }, 1000);
              /** Custom scrollimpl ends here */
              }else{
                this.detectActionValue.emit({ objectRowData: result, action: 'update', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
                /** custom scroll impl  starts here*/
                setTimeout(() => {
                  this.userdat.findWidth(true)
                }, 1000);
              /** Custom scrollimpl ends here */
              }              
              this.addNewMemFlag = true;
            }

          });
        } else {

          const dialogRef = this.dialog.open(AddingmemberComponent, {
            width: '369px',
            data: { row: modifiedValidationData, verticalName: this.ConfigData }
          });
          dialogRef.afterClosed().subscribe(result => {
            console.log("result", result)
            if (result) {
              if (this.IsInitialsRequired) {
                var initialValue = (this.headerData.filter(x => x.isInitialColumn)[0].id) - 1;
                tableData.bgColor = "randomColor" + (tableData.index % 10)
                var dynamicName = this.headerData[initialValue].allias ? tableData[this.headerData[initialValue].name].name : tableData[this.headerData[initialValue].name]
                tableData.initials = this.getInitials(dynamicName)

              }
             // this.clearRowValidation(result);
              this.createRow = false;
              modifiedValidationData.isRowEditable = false;
              if(result.row.id.startsWith("addRow-")) {
                this.newAddMember = this.newAddMember.filter(x=>x.id != result.row.id);
                this.detectActionValue.emit({ objectRowData: result, action: 'addNewRow', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
                this.selectedAll = false;
                /** custom scroll impl  starts here*/
                setTimeout(() => {
                  this.userdat.findWidth(true)
                }, 1000);
              /** Custom scrollimpl ends here */
              }else {
                this.detectActionValue.emit({ objectRowData: result, action: 'update', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
                /** custom scroll impl  starts here*/
                setTimeout(() => {
                  this.userdat.findWidth(true)
                }, 1000);
              /** Custom scrollimpl ends here */
                
              }
              this.addNewMemFlag = true;              
            }
          });
        }

      }

      else {
        //this.clearRowValidation();
        modifiedValidationData.isRowEditable = false;
        this.createRow = false;
        this.newAddMember=tableData.id.startsWith("addRow-")?[]:this.newAddMember;
        this.detectActionValue.emit({ objectRowData: modifiedValidationData, action: tableData.id.startsWith("addRow-") ? 'addNewRow': 'update', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
      }
    }
  }

  getRelationData(headerData, tableData) {
    if (headerData.relationship) {
      if (tableData[headerData.relationship]) {
        tableData[headerData.name] = { id: -1, name: "" }
        tableData[headerData.validation] = false;
        return true;
      }
      else {
        return false;
      }

    }
    else {
      return false;
    }
  }
  clearRowValidation(tableData?) {
   this.detectActionValue.emit({ objectRowData: {}, action: 'newRowDiscarded', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
    this.headerData.forEach(element => {
      if (element.IsError) {
        element.IsError = false;
      }
    });
    //this.createRow = false;
    //this.newAddMember = [];
    //  this.newAddMember.push(this.tempNewAddMember[0])
    //this.newAddMember = [];
    //this.newAddMember = [];
    this.newAddMember = this.newAddMember.filter(x=>x.id != tableData.id);
    //this.generateNewDynamicRowData();
  }


  pageChangeEvent(event) {
    this.headerData.forEach(element => {
      element.isFilter = false;
    });
    this.filterBox = [];
    if (this.config.currentPage != event) {
      this.show = false;
      this.reverse = false;
      this.value = "Sort By";
      //this.clearAllCheckBox();
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
        this.isLoading = true;
        this.IsPageChangeEvent = true;
        this.detectPageChangeData.emit({ objectRowData: this.userdat.serviceSearchItem, action: 'pagination', currentPage: this.config.currentPage, itemsPerPage: perPage, filterData: this.headerFilterDetails  });
      }

    } else {
      // the pipe will take care of this
    }
  }
  /**
   * Editable table ngOnInit ends here
   */
  // tempRowData={};
  addNewMemFlag: boolean = true;
  editRow(tableRowData: any) {
    this.addNewMemFlag = false;
    this.showPlus = false;
    this.estClosureDate = new Date(this.oppService.getSession('estDate'));
    // this.userArray = this.userArray.map(x => {
    //   if (x.isRowEditable) {
    //     x = this.userdat.editableCachedRow;
    //   }
    //   x.isRowEditable = false;
    //   return x;
    // })
    this.tempColllectionRecords= this.tempColllectionRecords.filter(x=>x.id!=tableRowData.id);
    this.tempColllectionRecords.push(JSON.parse(JSON.stringify(tableRowData)));
    // for (var prop in tableRowData) {
    //   this.userdat.editableCachedRow[prop] = tableRowData[prop];
    // }

    tableRowData.isRowEditable = true;
    this.detectActionValue.emit({ objectRowData: {}, action: 'rowEdited', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
    let editableCount = this.userArray.filter(x=>x.isRowEditable && x.isCheccked).length;
    this.multiCancel = editableCount>=2?true:false;
     /** custom scroll impl  starts here*/

     setTimeout(() => {
      this.userdat.findWidth(true)
    }, 1000);

  /** Custom scrollimpl ends here */
  }

  editDeal: boolean = true;
  editWholeDeal: boolean = true;
  editTopBtnActions() {

    this.userArray = this.userArray.map(x => {
      x.isRowEditable = x.isCheccked;
      return x;
    })
    this.editDeal = !this.editDeal;

  }
  addData(a,b)
  {
    
    let b1=b?b:0;
    return Number(a)+Number(b1);
  }
  validate(rowData) {
    var reqCol = this.headerData.filter(x => x.IsRequired);
    var valid = 0;
    var allEmpty=true;
    reqCol.forEach(element => {
     
      if (element.controltype == "select") {
        if (rowData[element.name] != "-1") {
          rowData[element.validation] = false;

        }
        else {

          if (element.relationship) {
            if (!rowData[element.relationship]) {
              rowData[element.validation] = false;
            }
            else {

              valid++;
              rowData[element.validation] = true;
            }
          }
          else {
            valid++;
            rowData[element.validation] = true;
          }


        }
      }
      else if (element.controltype == "text" || element.controltype == "number" || element.controltype == "percentage") {
        if (rowData[element.name] != "" && rowData[element.name] != null && rowData[element.name] != 'undefined') {
          if (element.controltype == "percentage") {
            let currntVal=0;
              this.userArray.forEach(item => {
                currntVal=this.addData(currntVal,item[element.name]);
              });
            if (rowData[element.name] > 0 && rowData[element.name] <= 100 && currntVal<=100) {
              rowData[element.validation] = false;
            }
            else {
              valid++;
              rowData[element.validation] = true;
              rowData[element.ErrorMessage]=element.ValidMsg[1];
             // element.ErrorMessage=
            }
          }
          else if (element.IsSequence) {
            
            // var nextData = rowData.index <= this.userArray[this.userArray.length - 1].index ? this.userArray[rowData.index][element.name] ? this.userArray[rowData.index][element.name] : 0 : 0;
            var nextRowData=this.userArray[rowData.index-2];
            if(nextRowData)
            {
            if(nextRowData[element.name] != "" && nextRowData[element.name] != null && nextRowData[element.name] != 'undefined')
              {
              if(Number(rowData[element.name]>0)){
                if(Number(rowData[element.name]) >= Number(nextRowData[element.name]))
                {
                 rowData[element.validation] = false;
                }
                else
                {
                 valid++;
                 rowData[element.validation] = true;
                 rowData[element.ErrorMessage]=element.ValidMsg[1];
                }
  
              }
              else
              {
                valid++;
                rowData[element.validation] = true;
                rowData[element.ErrorMessage]=element.ValidMsg[1];
              }
               
              }
             else
             {
              
               rowData[element.validation] = false;
             }
             // allEmpty=false;
            }
            else
            {
              
              rowData[element.validation] = false;
            }
          //   if(rowData.index<this.userArray[this.userArray.length - 1].index)
          //  {
          //    if(this.userArray[rowData.index][element.name]!=null && this.userArray[rowData.index][element.name]!=" " && this.userArray[rowData.index][element.name] != 'undefined')
          //    {
          //     rowData[element.validation] = false;
          //    }
          //    else
          //    {
          //      if(this.userArray[rowData.index][element.name] > rowData[element.name])
          //      {
          //       rowData[element.validation] = false;
          //      }
          //      else
          //      {
          //       valid++;
          //       rowData[element.validation] = true;
          //       element.ErrorMessage=element.ValidMsg[1];
          //      }
              
          //    }
          //  }
          //  else
          //  {
          //   rowData[element.validation] = false;
          //  }
            // var inSequence = this.userArray.filter(x => x.index >= rowData.index).every(x => x[element.name] >= rowData[element.name]);
           
            // if (inSequence) {
            //   rowData[element.validation] = false;
            // }
            // else {
            //   valid++;
            //   rowData[element.validation] = true;
            //   element.ErrorMessage=element.ValidMsg[1];
              
            // }


          }
          else {
           
            rowData[element.validation] = false;
          }
        }
        else {

          if (element.IsSequence) {
           var nextRowData=this.userArray[rowData.index];

           valid++;
            if(nextRowData)
            {
             if(nextRowData[element.name] != "" && nextRowData[element.name] != null && nextRowData[element.name] != 'undefined')
             {
              allEmpty=false;              
              rowData[element.validation] = true;
              rowData[element.ErrorMessage]=element.ValidMsg[0];
             }
             else
             {
            
              rowData[element.validation] = true;
              rowData[element.ErrorMessage]=element.ValidMsg[0];
             
               
             }
         
            }
            else
            {
              rowData[element.validation] = false;
              
            }
          }
          else
          {
            valid++;
            rowData[element.validation] = true;
            rowData[element.ErrorMessage]=element.ValidMsg[0];
          }
          
        }
      }
    });
    if (reqCol.length == valid && rowData.index!=1 && allEmpty) {
      this.headerData.filter(x => x.IsRequired).forEach(element => {
        rowData[element.validation] = false;
      });
      valid = 0;
      
    }
    

    return valid == 0 ? true : false;

  }
  editWholeTable() {
    this.estClosureDate = new Date(this.oppService.getSession('estDate'));
    if (this.editWholeDeal) {
      this.editWholeDeal = false;
      this.userArray = this.userArray.map(x => {
        x.isRowEditable = true;
        return x;
      })
      this.detectActionValue.emit({ objectRowData: {editStatus : true}, action: 'editAll', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
    } else {

      // this.editWholeDeal = true;



      let requiredLength = this.headerData.filter(x => x.IsRequired).length;
      if (requiredLength > 0) {

        this.userArray.forEach(x => {

          x.IsRowError = !this.validate(x);
        });


        if (this.userArray.filter(x => x.IsRowError).length == 0) {
          if(this.externalValue.value)
{
  this.editWholeDeal = true;
  this.userArray.forEach(x => {

    x.isRowEditable = false;
  });
}
         
          this.detectActionValue.emit({ objectRowData: this.userArray, action: 'saveAll', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
        }
        else
        {
          this.detectActionValue.emit({ objectRowData: '', action: 'Error', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
        
        }

      }
      else {
        this.editWholeDeal = true;
        this.userArray.forEach(x => {

          x.isRowEditable = false;
        });
        this.detectActionValue.emit({ objectRowData: this.userArray, action: 'saveAll', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
      }


      // this.userArray = this.userArray.map(x => {
      //   x.isRowEditable = false;
      //   return x;
      // });
      // this.detectActionValue.emit({ objectRowData: this.userArray, action: 'saveAll', pageData: this.config });
    }

  }
  splitHeaderData() {
    this.fixedColumn = this.headerData.filter(x => x.isFixed == true);
    this.normalColumn = this.headerData.filter(x => x.isFixed == false);

  }
  loadTableData(item, i) {

    this.headerData.forEach((element, i) => {

      switch (element.controltype) {
        case 'select':
          {
            //item[element.name].name=item[element.name].id=="-1"?'NA':item[element.name].name;
            if (item[element.name].id == "") {
              item[element.name].id = '-1';
            }
            // else
            // {
            //   item[element.name].name=this.ConfigData[element.name].filter(x=>x.id==item[element.name].id)[0].name;
            // }
            item[element.allias] = item[element.name].name ? item[element.name].name.toLowerCase() : 'NA';
          }
          break;

        case 'autocomplete':
          {
            if (element.relationship) {
              if (item[element.relationship]) {
              //  item[element.name] = { "id": "-1", name: "NA" }
                if (item[element.name].name != 'Requested') {
                  item[element.name] = item[element.name]?item[element.name]:{ "id": "-1", name: "-" }
                }
              }

              item[element.allias] = item[element.name].name ? item[element.name].name.toLowerCase() : '-';
            }
            else {
              //  item[element.name].name = item[element.name].id=="-1"?'NA':item[element.name].name;
              item[element.allias] = item[element.name].name ? item[element.name].name.toLowerCase() : '-';
            }
          }
          break;
        case 'date':
          {
            item[element.name] = item[element.name];
          }
          break;
        case 'selectSwitchDate':
          {
            if (item.stageObject) {
              item[element.switch] = item[element.name];
              // item[element.switch] = item[element.switch];
              item[element.name] = item[element.name];
              item[element.allias] = item[element.switch].name ? item[element.switch].name.toLowerCase() : 'NA';
            }
            else {
              item[element.name] = item[element.name];
              item[element.switch] = { id: "-1", name: "NA" };
              item[element.allias] = item[element.name];
            }
          }
          break;

        // default:
        // {
        // item[element.name] = item[element.name] ? item[element.name] : "NA";
        // }
        //break;
      }



      if (element.IsRequired) {
        item[element.validation] = false;
        item[element.ErrorMessage]=""
        
      }
    });

    if (this.IsInitialsRequired) {
      var initialValue = (this.headerData.filter(x => x.isInitialColumn)[0].id) - 1;
      item.bgColor = "randomColor" + (i % 10)
      var dynamicName = this.headerData[initialValue].allias ? item[this.headerData[initialValue].name].name : item[this.headerData[initialValue].name]
      item.initials = this.getInitials(dynamicName)

    }
    if(this.selectedAll){
        item.isCheccked = true;
    }else{
        item.isCheccked = item.isCheccked ? item.isCheccked : false;
    }  
    item.isRowEditable = item.isRowEditable ? item.isRowEditable : false;
    item.IsRowError = item.IsRowError? item.IsRowError : false;
    item.isNewRow = false;

  }
  getClassByValue(index) {
    //'first_text stickyFirstColEdit d-flex' : 'fixed'j+1 'row_ellipses' fixedColumn[j]?.className
    var customClassName = this.fixedColumn[index].className ? this.fixedColumn[index].className : '';
    switch (index) {
      case 0: return "first_text stickyFirstColEdit";
      case 1: return "fixed2 row_ellipses" + customClassName;
      case 2: return "fixed3 row_ellipses" + customClassName;;
      case 3: return "fixed4 row_ellipses" + customClassName;;
    }
  }

  loadInitials() {
    this.addNewMemFlag = true;
    this.TableCollection.forEach((element: any, i) => {
      this.loadTableData(element, i);
      /* for sprint 3 initials ends*/
    });
    console.log(this.userArray);
  }
  showPlus: boolean;// = true;
  showList: boolean;
  optionDynamicSwitchInline(item, data) {
    this.showPlus = !this.showPlus
    this.showList = false;
    this.calenderView = !this.calenderView
    if (item.controltype == 'selectSwitchDate') {
      if (this.createRow) {
        this.pseudoRow['stageObject'] = !this.pseudoRow['stageObject'];
        this.pseudoRow[item.name] = this.pseudoRow['stageObject'] ? { "id": null, "name": "" } : "";
      }
      else {
        this.userArray[data.index]['stageObject'] = !this.userArray[data.index]['stageObject'];
        this.userArray[data.index][item.name] = this.userArray[data.index]['stageObject'] ? { "id": null, "name": "" } : "";
      }
    }
  }

  inlineAddNewRowSwitch() {

  }
  /** Editable table ngOnChanges starts here */

  ngOnChanges(simpleChanges: SimpleChanges) {
    console.log("in on changes");
    if (simpleChanges.totalTableCount) {
      this.config.totalItems = simpleChanges.totalTableCount.currentValue;
      console.log(this.config);
     
    }

    if (this.IsinitialsLoading) {

      //  switch (Object.keys(simpleChanges)[0]) {

      // case 'TableCollection':
      //   {
        this.headerFilterDetails.isApplyFilter = false;
        
      if (this.TableCollection[0][this.headerData[0].name] != null) {
        //14th Oct autocomplete api search changes
        this.isautotyping = false;
        //this.newAddMember = [];
        this.loadInitials();
        this.isLoading = false;
        this.userArray = this.TableCollection;
        console.log(this.userArray)
        this.filterBox = [];
  if(this.headerData[0].isReadOnlyEdit)
      {
        let count=this.TableCollection.filter(x=>!x['isDefault']).length;
          this.selectAllVisibility=count>=2? true:false;
      }
      else
      {
        this.selectAllVisibility=this.TableCollection>=2? true:false;
      }
        this.userArray.forEach((element: any, index) => {
        //  element.isCheccked = false;
          if (this.IsMoreAction) {
            element.isExpanded = false;

          }
          // element[this.headerData[0].name] = element[this.headerData[0].name].toLowerCase()
        });
        this.key = this.orderByName ? this.orderByName : this.headerData[0].name;
        this.reverse = this.sortBy;
        if (this.isMobileDevice) {
          this.mobileFilter = []
          this.sectionData = []
          this.filterData();
          this.sectionData = this.mobileFilter[0].data;
          this.activetabs = this.mobileFilter[0].key;
          this.config.itemsPerPage = this.TableCollection.length;
          this.config.currentPage = 1
        }


      }
      else {
        this.isLoading = false;
        this.userArray = [];
        this.config.totalItems = 0;
      }

      this.headerData.forEach(element => {
        element.isFilter = false;
      });
      this.filterBox = [];
      // this.clearFormalue();
      return;
      //  }
      // }

    }

    /** custom scroll impl  starts here*/

    setTimeout(() => {
      this.userdat.findWidth(true)
    }, 1000);

    /** Custom scrollimpl ends here */
  }
  /** Editable table ngOnChanges ends here */

  /** April15**/
  clearRowData(rowData) {
    this.addNewMemFlag = true;    
 this.userArray=this.userArray.map(x => {
      if (x.id == rowData.id) {
      x= JSON.parse(JSON.stringify(this.tempColllectionRecords.filter(x=>x.id==rowData.id)[0]));
      x.isRowEditable=false
      }
      return x;
     
    })
  this.tempColllectionRecords= this.tempColllectionRecords.filter(x=>x.id!=rowData.id);
  let editableCount = this.userArray.filter(x=>x.isRowEditable && x.isCheccked).length;
  this.multiCancel = editableCount>=2?true:false;
    // this.tempRowData={};
    this.detectActionValue.emit({ objectRowData: this.userArray, action: 'editDiscarded', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
    setTimeout(() => {
      this.userdat.findWidth();
    }, 1000);
  }
  ngAfterViewInit() {
    this.isLoading = false;
  }
  updateRow(tableData) {
    if (!this.IsApproveNoPopup) {
      this.validFlag = true;
      var finalUpdateData = tableData;
      this.headerData.forEach((item, index) => {

        if (item.controltype == 'select' && item.isDefault != true) {
         // finalUpdateData[item.name] = this.ConfigData[item.name].filter(x => x.id == finalUpdateData[item.name].id)[0] ? this.ConfigData[item.name].filter(x => x.id == finalUpdateData[item.name].id)[0] : { id: '', name: '' };
        }

        if (item.controltype == 'select' && item.isDefault == true) {
         // finalUpdateData[item.name] = (tableData.isDefault == true) ? tableData[item.name] : this.ConfigData[item.name].filter(x => x.id == finalUpdateData[item.name].id)[0];
        }
        //  ekta changes 30th may starts
        if (item.controltype == 'date') {
          this.validateDates(tableData[item.name], item);
        }
        if (item.controltype == 'selectSwitchDate') {
          this.validateEndDate(tableData[item.name], tableData['SAPcustomercode'], item);
        }
      });
      if (this.validFlag) {
        if (this.endDateValid) {


        }
        else {
          this.snackBar.open(this.endDateErrorMsg, this.action, { duration: 3000 });
        }
      }
      else {
        this.snackBar.open(this.errorMsg, this.action, { duration: 3000 });
      }
    }
    else if (this.IsUpdateRequest) {
      if (tableData.Request) {

        this.dialog.open(RequestResourcePopup, {
          width: '369px',
          data: tableData
        });


      } else {

        this.dialog.open(AddingMembersPopup, {
          width: '369px',
          data: tableData
        });

      }
    }
    else {
      tableData.isRowEditable = false;
      this.addNewMemFlag = true;
      this.detectActionValue.emit({ objectRowData: tableData, action: 'update', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
    }


  }
  autoSearch(search: any, headername: any) {

    this.detectActionValue.emit({ objectRowData: search, action: headername, pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
  }
  /** end April15**/

  //FilterClick Outside 
  //fromShowCheckBox = false;
  clickedDataId = "0";
  addtionalData = {
    "filterData": []
  }

  /**Loadinitals starts here */
  /** On scroll page load logic only for mobile starts here*/
  @HostListener("window:scroll", [])
  onScroll(): void {
    if (this.isMobileDevice) {
      console.log('event in single table', event)
      event.preventDefault();
      event.stopPropagation();
      if (this.userArray.length < this.totalTableCount && this.filterBox.length == 0 && this.isPagination) {
        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight) {
          console.log(this.config.currentPage);
          this.isPagination = false;
          this.isLoading = true;
          this.detectPageChangeData.emit({ objectRowData: this.userdat.serviceSearchItem, action: 'pagination', currentPage: this.config.currentPage + 1, itemsPerPage: this.config.itemsPerPage, filterData: this.headerFilterDetails  });
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
  /** On scroll page load logic only for mobile ends here*/

  /** Search, Alpha sort and checkbox select all logic starts here */
  // Sample dropdown starts
  show;
  value: string = "Sort by";
  // search box ends
  key: string;
  reverse: boolean;
  addCBU(item) {
    this.value = item.title;
    item.isAscOrder = !item.isAscOrder;
    this.reverse = item.isAscOrder;
    this.headerFilterDetails.sortOrder = this.reverse;
    this.headerFilterDetails.sortColumn = item.name;
    //this.isLoading = true;
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
    //     this.value = "Alphabetically"
    //     this.show = true;
    //   }
    // }
    // else {
    //   console.log('index-->', i)
    //   if (i == 1) {
    //     this.key = this.orderByName ? this.orderByName : this.headerData[0].name;
    //     this.value = "A to Z"
    //     this.show = false;
    //     this.reverse = false;
    //   }
    //   else if (i == 2) {
    //     this.key = this.orderByName ? this.orderByName : this.headerData[0].name;
    //     this.value = "Z to A"
    //     this.show = false;
    //     this.reverse = true;
    //   }
    //   else if (i == 3) {
    //     this.value = "Alphabetically"
    //     this.show = false;
    //   }
    // }
  }
  // table starts
  selectAll() {
    for (var i = 0; i < this.userArray.length; i++) {
      this.userArray[i].isCheccked = this.selectedAll;
      if(this.userArray[i].isDefault == true) {
        this.userArray[i].isRowEditable = false;  
        this.userArray[i].isCheccked = false;
      }
    }
    this.userdat.tableRecordsChecked = this.selectedAll;
    this.isTableRowChecked = this.selectedAll;
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
    this.isTableRowChecked = count > 0 ? true : false;
    if (count > 1) {
      this.userdat.tableRecordsChecked = true;

      // this.checkname = this.TableName;
    } else {

      this.userdat.tableRecordsChecked = false;
    }
  }

  /** Filter on table Headers starts here */
  myFilter = [];
  myString;
  filterCheckBox = []
  filterBox = [];
  isFilter?: boolean;
  /**
   *  Filter table header ends
   */

  showAlpha() {
    //document.getElementsByClassName('caret0')[0].classList.toggle('rotate-180d');
    this.show = !this.show;
  }
  hidedropdown() {
    //document.getElementsByClassName('caret0')[0].classList.remove('rotate-180d');
    this.show = false;
  }
  // Sample dropdown ends
  // search box
  expand = false;
  noRecordsFound = false;
  inputClick() {
    this.expand = true;
    if (this.searchItem) {
      this.noRecordsFound = true;
      this.userArray.forEach(it => {
        this.checkValueExist(Object.values(it));
      })
    }
  }

  checkValueExist(arr) {
    arr.forEach(item => {
      if (item) {
        if (typeof (item) == 'object')
          this.checkValueExist(Object.values(item));
        else {
          if (item.toString().toLowerCase().includes(this.searchItem))
            this.noRecordsFound = false;
        }
      }

    });
  }
  OutsideInput() {
    this.expand = false;
  }

  close() {
    this.expand = false;
    this.searchItem = "";
    this.serviceSearchItem = "";
    this.noRecordsFound = false;
    this.serviceSearchData();
  }
  /** Search, Alpha sort and checkbox select all logic ends here */

  /** Filter header related logic  starts here*/
  filteredCheckBoxSelected(item, propertName) {

    console.log(item, propertName);
    item.isDatafiltered = !item.isDatafiltered
    if (item.isDatafiltered) {
      this.myFilter.push(item.name)
      this.tempColFilter.push(item);

    } else {
      this.tempColFilter.splice(item, 1);
      this.myFilter = this.myFilter.filter(x => x != item.name);
    }
    console.log('Temp ' + this.tempColFilter);
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
 // New filter impl starts here
  disableScroll: boolean = false;
  tempColFilter = [];
  applyColFilter(item) {
    
    if(!item.dateFormat) {
      this.headerFilterDetails.filterColumn[item.name] = JSON.parse(JSON.stringify(this.tempColFilter));
    }
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

    } else{
      if (this.tempColFilter.length > 0) {
        if (data.length == 0) {
          this.headerFilterDetails.order.push(item.name)
        }
  
      }
      else {
        this.headerFilterDetails.order = this.headerFilterDetails.order.filter(x => x != item.name);
      }
    }
   // this.isLoading = true;
    this.detectActionValue.emit({ objectRowData: '', action: 'columnFilter', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
    // console.log(this.headerFilterDetails);
    this.config.currentPage = 1;
    item.isFilter = false;
    this.DummyOverlay = false;
    this.disableScroll = this.DummyOverlay;
    this.selectedAll = false;
    this.userdat.tableRecordsChecked = false;
    
  }

  filterSearchedItem(searchitem, item) {
   
    this.filterConfigData.isFilterLoading=true;
    this.headerFilterDetails.columnSerachKey = searchitem;
    this.headerFilterDetails.headerName = item.name;
    this.detectActionValue.emit({ objectRowData: searchitem, action: 'columnSearchFilter', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
  }

  // New filter Impl ends here

  titleShow(name, index) {
    this.headerName = name;
  }
  generateNewRowDataRLS() {
    var timestamp = new Date().getUTCMilliseconds();

    var currentIndex = this.userArray[this.userArray.length - 1].index;
    var mydata = this.tempNewAddMember[0];
    mydata.index = currentIndex + 1;
    mydata.id = "$tNR" + timestamp.toString();
    mydata.isRowEditable = true;
    mydata.isCheccked = true;
    mydata.isNewRow = true;
    this.userArray.forEach(x => {
      x.isRowEditable = true;
      return x;
    })
    this.userArray.push(mydata);
    this.isTableRowChecked = true;
    // this.userArray=updatedData.map(x=>{x.isRowEditable=true;return x});
    //  tempNewAddMember
  }
  copyTableRows() {
    var copyData = JSON.parse(JSON.stringify(this.userArray.filter(x => x.isCheccked)));

    var currentIndex = this.userArray[this.userArray.length - 1].index;
    copyData.forEach((element, i) => {
      var timestamp = new Date().getUTCMilliseconds();
      element.id = "$tNR" + timestamp.toString();
      element.index = currentIndex + i + 1;
      element.isNewRow = true;
      return element;
    });
    this.userArray = this.userArray.concat(copyData);
    this.isTableRowChecked = true;
  }
  deleteTableRow() {
    this.userArray = this.userArray.filter(x => (!x.isCheccked && !x.isNewRow));
    var deleteRecords = this.userArray.filter(x => x.isCheccked);
    if (deleteRecords.length > 0) {
      this.detectActionValue.emit({ objectRowData: deleteRecords, action: "delete", pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
    }
    else {
      this.userArray.forEach((x, i) => {
        x.index = i + 1;
        return x;
      });
    }
  }
  // filteredData(item) {
  //   debugger;
  //   this.searchitem = '';
  //   // this.filterBox = [];
  //   this.myFilter = [];
  //   this.headerData.forEach(element => {
  //     if (element.name == item.name) {
  //       element.isFilter = !element.isFilter;
  //     }
  //     else {
  //       element.isFilter = false;
  //     }
  //   });

  //   if (item.isFilter) {
  //     var items = [];
  //     var pluckName = item.allias ? item.allias : item.name;
  //     // let tempDataReturn = this.filterBox.length > 0 ? this.userdat.pseudoFilter : this.userArray;
  //     const perPage = this.config.itemsPerPage;
  //     const start = ((this.config.currentPage - 1) * perPage);
  //     const end = start + perPage;
  //     console.log(start, end)
  //     var pageCol = this.filterBox.length > 0 ? this.userdat.pseudoFilter : this.userArray.slice(start, end);
  //     console.log(pageCol);
  //     var pluckedItem = from(pageCol).pipe(pluck(pluckName)).subscribe(x => {
  //       if (typeof x == 'object') {
  //         items.push(x[0])

  //       } else {
  //         items.push(x)
  //       }
  //       // if (x) {
  //       //   if (Array.isArray(x)) {
  //       //     x.forEach(element => {
  //       //       if (element) {
  //       //         items.push(element)
  //       //       }

  //       //     });

  //       //   } else {

  //       //     items.push(x)
  //       //   }
  //       // }

  //     });

  //     var unique = {};
  //     var distinct = [];
  //     items.forEach(function (x) {
  //       if (!unique[x]) {
  //         distinct.push({ name: x, isDatafiltered: false });
  //         unique[x] = true;
  //       }
  //     });
  //     let uniqueCollection = distinct.map(x => {
  //       x.isDatafiltered = this.returnFilterData(pluckName, x.name);
  //       if (x.isDatafiltered) {
  //         this.myFilter.push(x.name);

  //       }
  //       return x;
  //     });
  //     this.filterCheckBox = uniqueCollection.sort(function (a, b) {

  //       if (isNaN(parseInt(a.name))) {
  //         let nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
  //         if (nameA < nameB) //sort string ascending
  //           return -1
  //         if (nameA > nameB)
  //           return 1
  //         return 0 //default return value (no sorting)

  //       } else {
  //         let temp = a.name;
  //         if (temp.includes('-') || temp.includes('/')) {
  //           let dateA: any; dateA = new Date(a.name);
  //           let dateB: any; dateB = new Date(b.name);
  //           return dateA - dateB//sort by date ascending

  //         } else {
  //           return a.name - b.name;
  //         }

  //       }
  //     })
  //     console.log("filterCheckBox", this.filterCheckBox)
  //   }
  // }

  filteredData(item) {
    this.searchitem = '';

    // this.filterBox = [];
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
    //var pluckName = item.allias ? item.allias : item.name;
    //return this.filterBox.length > 0 ? this.filterBox.some(x => x[pluckName]) ? 'dataFiltered' : '' : '';
    if (item.hideFilter) {
      return '';
    }
    else {
      //return this.headerFilterDetails.filterColumn[item.name].length > 0 ? 'dataFiltered' : '';
      return this.headerFilterDetails.order.filter(x=>x==[item.name]).length == 1 ? 'dataFiltered' : '';
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

  showcheckbox(item) {
    this.headerOverlay = true;
    this.fromShowCheckBox = true;
    this.searchitem = '';
   // this.isColFilterLoader = false;
    this.filterConfigData.isFilterLoading=true;
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
      this.filterConfigData.isFilterLoading=false;
      this.tempColFilter = [];
      item.isFilter = false;
      this.DummyOverlay = false;
      if (item.dateFormat) {
        let checkOrder=this.headerFilterDetails.order.some(x=>x==item.name)
        this.headerFilterDetails.filterColumn[item.name][0].filterStartDate = checkOrder? JSON.parse(JSON.stringify(this.tempFilterDate?this.tempFilterDate[0].filterStartDate:'')):'';
        this.headerFilterDetails.filterColumn[item.name][0].filterEndDate =checkOrder? JSON.parse(JSON.stringify(this.tempFilterDate?this.tempFilterDate[0].filterEndDate:'')):'';

        if(this.headerFilterDetails.filterColumn[item.name][0].filterStartDate){
          this.filterToDateError = false;
        }else{
          this.filterToDateError = true;
        }
        
      }
    }
    this.disableScroll = this.DummyOverlay;

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

  stop(e) {
    e.stopImmediatePropagation();
  }

  filterSearchClose() {
    this.searchitem = "";
  }

  onReachEnd(event, id) {
    console.log('reachedDown');
    document.getElementById(id).click();
  }

  loadMoreEvent() {
    console.log('loadMore Emit');
   
    // this.headerFilterDetails.columnSerachKey = this.searchitem;
    // if(this.filterConfigData[this.headerFilterDetails.headerName].data.length < this.filterConfigData[this.headerFilterDetails.headerName].recordCount && this.filterConfigData[this.headerFilterDetails.headerName].recordCount >10 && !this.filterConfigData.isFilterLoading)
    // { this.filterConfigData.isFilterLoading=true;
    //   this.detectActionValue.emit({ objectRowData: this.searchitem, action: 'loadMoreFilterData', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
    // }

    this.headerFilterDetails.columnSerachKey = this.searchitem;
    if (this.filterConfigData[this.headerFilterDetails.headerName].data.length < this.filterConfigData[this.headerFilterDetails.headerName].recordCount && this.filterConfigData[this.headerFilterDetails.headerName].recordCount > 10 && !this.filterConfigData.isFilterLoading) {
      if (!this.filterConfigData.isFilterLoading) {
        this.filterConfigData.isFilterLoading = true;
        this.detectActionValue.emit({ objectRowData: this.searchitem, action: 'loadMoreFilterData', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
      }
    }
   
    //this.items = this.items.concat(this.cars);

  }
  isColFilterLoader: boolean = false;
  loadClass() {
    this.isColFilterLoader = false;
    this.tempColFilter=this.filterConfigData[this.activetabs].data.filter(x=>x.isDatafiltered);
    return 'i';
  }

  clearAllCheckBox(headerItem) {
    if (this.tempColFilter.length > 0) {
      this.filterConfigData[headerItem.name].data.forEach(element => {
        element.isDatafiltered = false;
      });

      this.tempColFilter = [];
    }
    // this.filterCheckBox.forEach(element => {
    //   element.isDatafiltered = false;
    // });
    // this.filterBox = this.filterBox.filter(x => !x[this.myString]);
    // if (this.filterBox.length == 0) {
    //   this.filterBox = [];
    //   let x = this.headerData.filter(x => x.name == this.myString || x.allias == this.myString)[0];
    //   x.isFilter = false;
    //   this.filteredData(x)
    // }
    // this.myFilter = [];
    // this.filterBox = [];
  }

   /**
   * New date from to filter changes starts here
   */
  tempFilterDate;
  filterToDateError:boolean = true;
  minFilterDate;
  filterDateChanges(event,item, specDate) {
    let x =  event.target.value;
    if (x != null && x != undefined) {
      if (specDate == '_from') {
        this.headerFilterDetails.filterColumn[item.name][0].filterStartDate = x;
        this.minFilterDate = this.headerFilterDetails.filterColumn[item.name][0].filterStartDate;
        this.filterToDateError = false;
      }
      else {
        if(x >= this.headerFilterDetails.filterColumn[item.name][0].filterStartDate) {
          this.headerFilterDetails.filterColumn[item.name][0].filterEndDate = x;
        }else {
          console.log('To date should be greater!!');
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
  /** Filter header related logic ends here */


  /** Mobile table filter starts here */
  tableMobFilter = false;
  singleTable = true;
  activetabs;

  showTabs(filterData) {
    this.filterSearch = "";
    this.sectionData = filterData.data;
    this.activetabs = filterData.key;
  }

  showMobFilter() {
    this.tableMobFilter = true;
    this.singleTable = false;
    this.userdat.hideMobileButton = false;
    // document.getElementsByClassName('responsive-btn-div')[0].classList.add('active');
  }
  hideMobFilter() {
    this.tableMobFilter = false;
    this.singleTable = true;
    this.userdat.hideMobileButton = true;    
    // document.getElementsByClassName('responsive-btn-div')[0].classList.remove('active');
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
    var pluckName = item.allias ? item.allias : item.name
    var pluckedItem = from(this.userArray).pipe(pluck(pluckName)).subscribe(x => {

      if (Array.isArray(x)) {
        x.forEach(element => {
          items.push(element)
        });

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

    this.mobileFilter.push({ key: pluckName, data: distinct })
  }
  filterData() {
    var mobileFilter = this.headerData;
    mobileFilter.forEach(element => {

      this.popuplatedFilter(element)
    });

  }
  mobileFilterData() {

    var filterCriteria = []
    var dummyCol = [];
    var condLength = 0;
    this.mobileFilter.forEach(ele => {
      condLength = ele.data.filter(x => x.isDatafiltered == true).length > 0 ? condLength + 1 : condLength

      ele.data.forEach(element => {
        if (element.isDatafiltered) {
          filterCriteria.push({ key: ele.key, filterItem: element.name })
        }
      });
    })
    this.TableCollection.forEach(element => {
      filterCriteria.forEach(e2 => {
        if (Array.isArray(element[e2.key])) {

          if (element[e2.key].includes(e2.filterItem)) {

            dummyCol.push(element)
          }
        }
        else {
          if (e2.filterItem == element[e2.key]) {

            dummyCol.push(element)
          }
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
    this.userdat.hideMobileButton = true;

    //document.getElementsByClassName('responsive-btn-div')[0].classList.remove('active');
    // console.log(myOrginalData);
  }

  /** Mobile table filter ends here */

  /**  Open custamizable drag table cache starts here*/
  openCustomizeTable() {
    // var myData=Object.assign([],this.headerData);
    var myData = JSON.parse(JSON.stringify(this.headerData));
    const dialogRef = this.dialog.open(OpenCustomizeableTable, {
      width: '660px',
      data: myData
    });
    // this.myArrayData = [];
    // this.headerData.forEach(x => {
    //   this.myArrayData.push({ id: x.id, name: x.name, isFixed: x.isFixed, order: x.order, title: x.title, isModal: x.isModal, isLink: x.isLink, isStatus: x.isStatus, className: x.className, hideFilter: x.hideFilter, isPopUp: x.isPopUp, dateFormat: x.dateFormat, controltype: x.controltype, closePopUp: x.closePopUp, toggleSwitch: x.toggleSwitch, isInitialColumn: x.isInitialColumn, allias: x.allias, isInlineStage: x.isInlineStage, relationship: x.relationship });
    // })


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
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
         setTimeout(() => {
          this.userdat.findWidth();
        }, 200);
      }
    })
  }
  /**  Open custamizable drag table cache ends here */

  /**  All pop_ups including dynamic buttons starts here */

  /** popup constant congif method starts  here*/
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
        if (this.TableName == 'unqualified') {
          return archiveLead;
        }
        else {
          return archiveConversation;
        }
      case 'nurture':
        return nutureLead;
      case 'disqualify':
        return disqualifyLead;
      case 'convertOpportunity':
        return convertOpportunity;
      case 'replicate':
        return replicate;
      case 'delete':
        return multiDelete;
    }
  }
  /** popup constant config method ends here */

  /** Generic Table related important poups starts here */

  openGenericModal(genericdata, actionName) {
    var configData = this.returnConfigData(actionName)
    const dialogRef = this.dialog.open(genericModal,
      {
        width: '380px',
        data: { tableName: this.TableName, itemData: [genericdata], configdata: configData }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.detectActionValue.emit({ objectRowData: result, action: actionName, pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
      }
    });
  }

  /** Multiple select generic Modals starts here */

  openMultipleGenericModal(actionName) {
    console.log(actionName)
    var genericdata = this.userArray.filter((element: any) =>
      element.isCheccked == true && !element.isDefault
    );
    console.log(genericdata);
    var configData = this.returnConfigData(actionName)
    const dialogRef = this.dialog.open(genericModal,
      {
        width: '380px',
        data: { tableName: this.TableName, itemData: genericdata, configdata: configData }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      //  this.selectAllVisibility = false;
        let count=this.TableCollection.filter(x=>x.isCheccked == false && !x.isDefault).length;
        this.selectAllVisibility=count>=2? true:false;
        this.userdat.tableRecordsChecked = false;
        this.detectActionValue.emit({ objectRowData: result, action: actionName, pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
        
      }
    });
  }
 multiCancel:boolean = false;
 multieditOn:boolean = false;
 tempColllectionRecords=[];
  editMulipleRecords() {
  //  this.tempColllectionRecords=[]
    this.multieditOn = true;
    this.multiCancel =  true;
    this.userArray.forEach(element => {
      if (element.isCheccked == true) {
        element.isRowEditable = true;

      } else {
        element.isRowEditable = false;
      }
    });
    this.tempColllectionRecords=JSON.parse(JSON.stringify(this.userArray.filter(x=>x.isRowEditable)));
    this.detectActionValue.emit({ objectRowData: this.tempColllectionRecords.length, action: 'bulkRowEdited', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
    
  }

  cancelMultipleEditMode() {
    this.multiCancel = false;
    this.multieditOn = false;
    
    this.userArray=this.userArray.map(element => {
      if(element.isRowEditable)
      {
           let tempRow=this.tempColllectionRecords.filter(x=>x.id==element.id);
           if(tempRow.length==1)
           {              
            element = tempRow[0];
            element.isRowEditable = false;
           }
          
     }
      else
      {
        element.isRowEditable = false;
      }
      return element;
    });
   // this.tempColllectionRecords=[];
   this.detectActionValue.emit({ objectRowData: {}, action: 'bulkRowCanceled', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
  
  }
  /** Mulitple select generic modals ends here */

  generalSelectedAction(actionItem, actionRecieved) {
    this.detectActionValue.emit({ objectRowData: [actionItem], action: actionRecieved, pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
    console.log({ objectRowData: [actionItem], action: actionRecieved });
    if(actionRecieved == 'isdeleteteammember') {
      this.selectedAll =  this.userArray.filter(x=>x.id!=actionItem.id).every(x=>x.isCheccked && x['isDefault']);
      let count=this.TableCollection.filter(x=>x.isCheccked && !x['isDefault']).length;
      this.userdat.tableRecordsChecked=count>=2? true:false;     
    }
  }

  generalMultiSelectedAction(actionRecieved) {
    var actionItem = this.userArray.filter((element: any) =>
      element.isCheccked = true
    );
    this.detectActionValue.emit({ objectRowData: [actionItem], action: actionRecieved, pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
    console.log({ objectRowData: [actionItem], action: actionRecieved });
  }
  /** Generic Table related important poups ends here */

  /** Initials and random color combinations selector methods starts here */
  getInitials(string) {
    if(string){
      string = string.replace('-',' ');
    string = string.trim();
    var names = string.split(' '),

      initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
    }else {
      return string;
    }
  }

  getRandomColor() {
    var num = Math.ceil(Math.random() * 10) % 10;
    return "class" + num;
  }
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
      this.userdat.downloadAsCsv(this.userdat.pseudoFilter, this.TableName, properties, titles, this.reverse, this.key, null, this.orderType)
    }
    else {
      var pageCol = this.userArray.filter(x => x.index > start && x.index <= end);
      this.userdat.downloadAsCsv(pageCol, this.TableName, properties, titles, this.reverse, this.key, null, this.orderType)
    }

  }

  /** Initials and random color combinations selector methods ends here*/
  /** Overlay for filter clear selection starts here */
  off() {
    this.DummyOverlay = false;
    this.headerData.forEach(element => {
      element.isFilter = false;
    });
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
  /** Overlay for filter clear selection ends here */

  onClickedOutside(e: Event) {
    this.showMoreOptions = false;
  }
  openDelete(tableData, actionName) {
    const dialogRef = this.dialog.open(Delete,
      {
        width: '380px',
        data: tableData
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.detectActionValue.emit({ objectRowData: tableData, action: actionName, pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
      }
    });
  }


  //sprint 2 popups
  openDialogclose(): void {
    const dialogRef = this.dialog.open(ClosePopup, {
      width: '396px'

    });
  }
  // sprint 3 popups
  opendashboardpopup() {
    const dialogRef = this.dialog.open(DashboardPopupComponent,
      {
        width: '850px'
      });
  }

  OpenOverview(tabledata) {
    {
      console.log(tabledata);
      const dialogRef = this.dialog.open(OpenOverview, {
        width: '380px',
        data: tabledata,

      });
    }
  }
  openConfirmApproval(tableData) {
    const dialogRef = this.dialog.open(OpenConfirmApproval, {
      width: '380px',
      data: tableData

    });
  }
  ConfirmApprovalWithSwapOpen() {
    const dialogRef = this.dialog.open(ConfirmApprovalWithSwap, {
      width: '380px'
    });
  }
  OpenConfirmRejection() {
    const dialogRef = this.dialog.open(OpenConfirmRejection, {
      width: '380px'
    });
  }
  OpenOverviewHistory() {
    const dialogRef = this.dialog.open(OpenOverviewHistory, {
      width: '380px'
    });
  }
  OpenHistory() {
    const dialogRef = this.dialog.open(OverviewHistoryPopupComponent, {
      width: '380px'
    });
  }
  OpenHistory1() {
    const dialogRef = this.dialog.open(OpenHistory, {
      width: '800px'
    });
  }

  /** Dynamic table row modal starts here! */
  openDynamicRowModal(leadsLinkedData: any) {
    const dialogRef = this.dialog.open(LeadsLinked,
      {
        width: '380px',
        data: leadsLinkedData
      });
  }

  /** Dynamic table row modal ends here! */
  openleadextend() {
    const dialogRef = this.dialog.open(leadextendComponent,
      {
        width: '396px',
      });
  }
  // search and link opportunity pop up start 
  opensearchlink(): void {
    const dialogRef = this.dialog.open(searchlinkComponent, {
      width: '380px',
    });
  }

  // search and link opportunity pop up end
  openleadreject(): void {
    const dialogRef = this.dialog.open(leadrejectComponent, {
      width: '380px',
    });
  }


  /**  All pop_ups including dynamic buttons ends here */

  /** Accordian table row expansion logic starts here */
  isExpanded: boolean = false;
  commentAction: number = 0;
  // expandtoggle: boolean = false;

  expand_section(item) {
    console.log(item.id);
    for (var i = 0; i < this.userArray.length; i++) {
      if (this.userArray[i].id == item.id) {
        this.userArray[i].isExpanded = !this.userArray[i].isExpanded;
        // this.expandtoggle = !this.expandtoggle;
      }
      else {
        this.userArray[i].isExpanded = false;
      }
    }
    this.commentAction = item.isExpanded ? this.commentAction++ : 0;
    // ekta changes starts 29th may
    this.detectActionValue.emit({ objectRowData: item, action: 'openSummary', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
    // ekta changes ends 29th may
  }

  childCommentSectionControl(item) {
    if (item.isExpanded == false) {
      this.commentAction = 1;
      this.expand_section(item)
    } else {
      this.commentAction++;
    }

  }

  /** Accordian table row expansioj logic ends here */

  /** Service search data logic starts here */
  serviceSearchSubject() {
    this.searchText$.next(this.userdat.serviceSearchItem);
  }
  serviceSearchData() {

    if (this.isIntialized) {
      this.isLoading = true;
    }

    console.log(this.userdat.serviceSearchItem);
    this.istyping = true;
    //this.userArray=[]
    //  this.detectActionValue.emit({ objectRowData: this.userdat.serviceSearchItem, action: 'search',pageData:this.config ,configData:this.gerAdditionalData()});
    this.headerFilterDetails.globalSearch = this.serviceSearchItem;
    this.config.currentPage = 1;
    this.detectActionValue.emit({ objectRowData: this.serviceSearchItem, action: 'search', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
    this.selectedAll = false;
    this.userdat.tableRecordsChecked = false;
  }

  //14th Oct autocomplete api search changes
  autoSearchSubject(search: any, headername: any) {
    this.ConfigData.isFilterLoading=true;
    this.autoText$.next({search : search, column : headername});
  }
  autoSearchData(data) {
   
    if (this.isIntialized) {
     // this.isLoading = true;
      this.ConfigData.isFilterLoading=true;
    }
    console.log("in autoSearchData", data);
    this.isautotyping = true;
    this.detectActionValue.emit({ objectRowData: data.search, action: data.column, pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
  
}
  //14th Oct autocomplete api search changes end


  /** Service search data logic ends here */

  /** pagination pass data logic starts here */

  intitalRecordCount: number;
  RecordCountPerPage: number;
  TotalRecords: number;
  FirstPage: boolean;

  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: undefined
  };

  getPaginatorData(e) {

  }
  emitPagination() {
    console.log("adas");
    this.IsPaginagtion = true;
    this.detectActionValue.emit({ objectRowData: this.serviceSearchItem, action: 'pagination', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
  }

  /** pagination pass data logic ends here */


  /** Add new row in existing table starts here  */
  @Input() addRowEditableTable: number;
  customSelected: string;
  successServiceInlineRow: boolean = true;
  validFlag = true;
  errorMsg = '';

  // isRowValid = true;
  // requiredFieldMsg = "";
  // validateRequiredFields(rowData) {
  //   debugger;
  //   this.isRowValid = true;
  //   this.headerData.forEach(item => {
  //     if(this.isRowValid)
  //     {
  //      //check if not toggle and if control type is select then id need to be checked
  //      if(item.controltype == 'autocomplete' && item.relationship) {
  //       if(rowData[item.relationship] != true) {
  //         if( rowData[item.name].id == '' || rowData[item.name].id == undefined || rowData[item.name].id == null) {
  //           this.isRowValid = false;
  //           this.requiredFieldMsg = item.title + " cannot be empty";
  //         }
  //       }
  //      }
  //      if(item.controltype != 'switch' && item.controltype != 'select')
  //      {
  //        if (rowData[item.name] == '' || rowData[item.name] == undefined || rowData[item.name] == null) {
  //         this.isRowValid = false;
  //         this.requiredFieldMsg = "error message: " + item.title + " cannot be empty";
  //       }
  //     }
  //     else if(item.controltype == 'select') {
  //       if(rowData[item.name].id == '' || rowData[item.name].id == undefined || rowData[item.name].id == null) {
  //         this.isRowValid = false;
  //         this.requiredFieldMsg ="error message: " + item.title + " cannot be empty";
  //       }
  //     }
  //   }
  //   });
  // }
  approveInlineRow() {
    if (!this.IsApproveNoPopup) {
      this.addNewMemFlag = true;
      this.validFlag = true;
      // this.validateRequiredFields(this.pseudoRow);
      // if(this.isRowValid)
      // {
      this.headerData.forEach((item, index) => {
        //  ekta changes 30th may starts
        if (item.controltype == 'date') {
          this.validateDates(this.pseudoRow[item.name], item);
        }
        if (item.controltype == 'selectSwitchDate') {
          this.validateEndDate(this.pseudoRow[item.name], this.pseudoRow['SAPcustomercode'], item);
        }
        if (item.controltype == 'select') {
          this.pseudoRow[item.name].name = this.ConfigData[item.name].filter(it => it.id == this.pseudoRow[item.name].id)[0].name;
        }

      });
      if (this.validFlag) {
        if (this.endDateValid) {
          // this.createRow = false;
          const dialogRef = this.dialog.open(AddingmemberComponent, {
            width: '369px',
            data: this.pseudoRow
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.createRow = false;
              this.pseudoRow.isRowEditable = false;
              if (this.IsInitialsRequired) {
                var initialValue = (this.headerData.filter(x => x.isInitialColumn)[0].id) - 1;
                this.pseudoRow.bgColor = "randomColor" + (0 % 10)
                var dynamicName = this.headerData[initialValue].allias ? this.pseudoRow[this.headerData[initialValue].name].name : this.pseudoRow[this.headerData[initialValue].name]
                this.pseudoRow.initials = this.getInitials(dynamicName)

              }
              console.log("result", result)
              this.detectActionValue.emit({ objectRowData: result, action: 'addNewRow', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
            }
          });
          //this.detectActionValue.emit({ objectRowData: finalRowDataArray, action: 'addNewRow',pageData:this.config });
        }
        else {
          this.snackBar.open(this.endDateErrorMsg, this.action, { duration: 3000 });
        }
      }
      else {
        this.snackBar.open(this.errorMsg, this.action, { duration: 3000 });
      }
      // }
      // else {
      //   this.snackBar.open(this.requiredFieldMsg, this.action, { duration: 3000 });
      // }
    }
    else {
      this.createRow = false;
      this.pseudoRow.isRowEditable = false;
      this.detectActionValue.emit({ objectRowData: this.pseudoRow, action: 'addNewRow', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
    }
  }

  addInlineResource() {
    let dynamic = this.headerForm.value.controls;
    this.validFlag = true;
    console.log(dynamic, 'dynamic')

    this.headerData.forEach((item, index) => {
      //  ekta changes 30th may starts
      if (item.controltype == 'date') {
        this.validateDates(this.pseudoRow[item.name], item);
      }
      if (item.controltype == 'selectSwitchDate') {
        this.validateEndDate(this.pseudoRow[item.name], this.pseudoRow['SAPcustomercode'], item);
      }
      if (item.controltype == 'select') {
        this.pseudoRow[item.name].name = this.ConfigData[item.name].filter(it => it.id == this.pseudoRow[item.name].id)[0].name;
      }
    });
    if (this.validFlag) {
      if (this.endDateValid) {
        // this.createRow = false;
        const dialogRef = this.dialog.open(RequestresourceComponent, {
          width: '369px',
          data: { row: this.pseudoRow, verticalName: this.ConfigData.verticalOwnerName }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.createRow = false;
            this.pseudoRow.isRowEditable = false;
            console.log("result", result)
            this.detectActionValue.emit({ objectRowData: result.row, action: 'addNewRow', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
          }
        });
      }
      else {
        this.snackBar.open(this.endDateErrorMsg, this.action, { duration: 3000 });
      }
    }
    else {
      this.snackBar.open(this.errorMsg, this.action, { duration: 3000 });
    }
  }
  // clearFormalue() {
  //   var clearForm = []
  //   this.headerForm.value.controls.forEach(element => {
  //     clearForm.push('');
  //   });
  //   this.headerForm.patchValue({
  //     controls: clearForm
  //   });
  // }
  rejectInlineRow() {
    // this.pseudoRow.isRowEditable = false;
    this.addNewMemFlag = true;
    this.createRow = false;
    this.detectActionValue.emit({ objectRowData: {}, action: 'newRowDiscarded', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
    // this.clearFormalue();
  }

  selectedAutocompleteInput(item: any, i) {
    console.log(item)
    var myData = this.headerForm.get('controls') as FormArray
    myData.controls[i].setValue(item);

  }

  emitValue(item, name) {
    this.detectActionValue.emit({ objectRowData: item, action: name, pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails });
  }
  selectedAutocompleteInputRow(tableData: any, item: any, headername: any) {
    //   var dependecyHeader=this.headerData.filter(x=>x.dependecy);
    //   if(dependecyHeader[0].dependecy==headername)
    //   {
    //    dependecyHeader.forEach(element => {      
    //    tableData[element.name]=item[element.name]      
    //    });
    //  }      
    // this.detectActionValue.emit({ objectRowData: item, action: name, pageData: this.config });

    tableData[headername] = item;
    this.ConfigData[headername] = [];
    console.log(tableData)
  }

  addRowTable() {
    // const dialogRef = this.dialog.open(AddingmemberComponent,
    //   {
    //      width: '350px'
    //    });
    this.estClosureDate = new Date(this.oppService.getSession('estDate'));
    this.detectActionValue.emit({ objectRowData: {}, action: 'newRowAdded', pageData: this.config, configData: this.gerAdditionalData(), filterData: this.headerFilterDetails })
    this.createRow = true;
    this.calenderView = true;
    this.showPlus = false;
    this.generateNewDynamicRowData();
    /** custom scroll impl  starts here*/

    setTimeout(() => {
      this.userdat.findWidth(true)
    }, 1000);

    /** Custom scrollimpl ends here */
    //this.addPseudoRow();
    this.headerData.forEach(element => {
      if (!element.hideFilter) {
        element.isFilter = false;
      }
    });
  }
  pseudoRow;

  addPseudoRow() {
    // console.log(this.userArray[0]);
    // this.pseudoRow = this.userArray[0];
    // console.log(this.headerData);

    // Ekta changes 29th may starts
    var finalRowDataArray = {};
    this.headerData.forEach((item, index) => {

      if (item.controltype == 'select') {
        finalRowDataArray[item.name] = {
          "id": null,
          "name": ""
        };
      }
      else if (item.controltype == 'selectSwitchDate') {
        finalRowDataArray['stageObject'] = false;
      }
      else if (item.controltype == 'switch') {
        finalRowDataArray[item.name] = false;
      }
      else {
        finalRowDataArray[item.name] = '';
      }



    });
    this.pseudoRow = finalRowDataArray;
    console.log('final pseudo row', finalRowDataArray);
    // Ekta changes 29th may ends

  }

  showContact: boolean = false;
  contactName: string = "";
  contactName1: string = "";
  contactNameSwitch: boolean = true;
  contactNameSwitch1: boolean = true;
  selectedContact: {}[] = [];


  contactNameclose() {
    this.contactNameSwitch = false;
  }
  action: any;
  // Ekta changes 28-05 for selectRole validn starts
  // onSelectChange(selectedValue, item) {
  //   console.log("pseudo", this.pseudoRow);

  // }

  onSelectChangeUpd(selectedValue, item, i) {

    // if (item.isDuplicateValidationReq) {
    //   var message = "";
    //   var temp = this.userArray.filter((it, index) => it[item.name].id === selectedValue && index != i);
    //   if (temp.length > 0) {
    //     message = "Role " + temp[0].Role.name + " cannot be duplicated. Please ensure to tag only one user for this role"
    //     this.userArray[i][item.name].id = '';
    //     this.userArray[i][item.name].name = "";
    //     this.snackBar.open(message, this.action, { duration: 3000 });
    //   }
    // }

    // if(item.isDependent){
    //   this.detectSelectDependentData.emit({selected:{selectedValue,item,i}, action:'Dependent'})
    // }
  }
  clearSelValue(rowData, tableHeader) {
    // this.holdPreValue = Object.assign({}, rowData)
    rowData[tableHeader] = { id: -1, name: "" };
    //this.holdPreValue=
  }

  validateDates(value, item) {

    console.log('cached row', this.userdat.editableCachedRow);
    let today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    if (this.createRow) {
      if (item.controltype == 'date') {
        if (value < today) {
          this.validFlag = false;
          this.errorMsg = "You have made a back dated entry. Start Date cannot be less than current date.";
        }
        else {
          this.validFlag = true;
          this.errorMsg = "";
        }
      }

    }
    else {
      if (value < new Date(this.userdat.editableCachedRow[item.name]) && value < today) {
        this.validFlag = false;
        this.errorMsg = "You have made a back dated entry. Start Date cannot be less than current date and previous start date.";

      }
      else {
        this.validFlag = true;
        this.errorMsg = "";
      }

    }
  }

  endDateValid = true;
  endDateErrorMsg = '';
  validateEndDate(value, targetValue, item) {
    this.endDateValid = true;
    // let today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    //   if(this.createRow)
    //  {
    if (item.controltype == 'selectSwitchDate') {
      if (new Date(value) < new Date(targetValue) || new Date(value) > new Date(this.oppService.getSession('estDate'))) {
        this.endDateValid = false;
        this.endDateErrorMsg = "End Date cannot be earlier than Start Date or greater than Est. closure date.";
      }
      else {
        this.endDateValid = true;
        this.endDateErrorMsg = "";
      }
    }

  }

  dateValidationDisable(renderedDate) {
    if(new Date(renderedDate) > this.today){
      return this.today;
    }else{
      return new Date(renderedDate);
    }
  }

  endDateValidationDisable(dateRange) {
    if(new Date(this.oppService.getSession('estDate')) < this.today){
      return this.today;
    }else{
      return dateRange;
    }
  }
  
  onChangeSwitch(event, item, index) {
    console.log('headerform', this.headerForm);
    this.headerData.forEach(element => {
      if (element.relationship == item.name) {
        if (this.createRow) {
          this.pseudoRow[element.name] = '';
          this.pseudoRow.initials = '';
        }
        else {
          this.userArray[index][element.name] = '';
          this.userArray[index].initials = '';
        }
        // this.headerForm.
      }
    });
  }
  // Ekta changes 28-05 for selectRole validn ends


  // wiproContact: {}[] = [
  //   { index: 0, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: true },
  //   { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  //   { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
  //   { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  // ]

  // wiproContact4: {}[] = [
  //   { index: 0, contact: 'Singapore', designation: 'Pre Sales Head', initials: 'AJ', value: true },
  //   { index: 1, contact: 'Japan', designation: 'Pre Sales Head', initials: 'KT', value: false },
  //   { index: 2, contact: 'India', designation: 'Pre Sales Head', initials: 'AJ', value: false },
  //   { index: 3, contact: 'UK', designation: 'Pre Sales Head', initials: 'KT', value: false },
  // ]

  // wiproContact5: {}[] = [
  //   { index: 0, contact: 'Kinshuk bose',value: true },
  //   { index: 1, contact: 'Kinshuk bose',value: false },
  //   { index: 2, contact: 'Kinshuk bose',value: false },
  //   { index: 3, contact: 'Kinshuk bose',value: false },
  // ]
  /** Add new row in existing tables ends here */
}



@Component({
  selector: 'app-add-member',
  templateUrl: './adding-members.html'

})
export class AddingMembersPopup {
  constructor(public dialogRef: MatDialogRef<AddingMembersPopup>, public router: Router, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data, ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onsubmit(data) {
    console.log(data);

  }
}

@Component({
  selector: 'app-request-resource',
  templateUrl: './request-resource.html'

})
export class RequestResourcePopup {
  constructor(public dialogRef: MatDialogRef<RequestResourcePopup>, public router: Router, @Inject(MAT_DIALOG_DATA) public data, ) { }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onsubmit(data) {
    console.log(data);
  }
}

//sprint5
// @Component({
//   selector: 'app-pull-rls',
//   templateUrl: './rls-popup.html',
//   styleUrls: ['./editable-expansion-table.component.scss']
// })
// export class PullRLSPopup {

//   /****************** Conversation Name autocomplete code start ****************** */
//   showConversation: boolean = false;
//   Conversation: string = "";
//   ConversationNameSwitch: boolean = true;
//   ConversationNameclose() {
//     this.ConversationNameSwitch = false;
//   }
//   appendConversation(value: string) {
//     this.Conversation = value;
//     this.ConversationNameSwitch = true;
//   }
//   Conversations: {}[] = [
//     { index: 0, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: true },
//     { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
//     { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
//     { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
//   ]
//   selectedConversation: {}[] = [];


//   /****************** Conversation Name autocomplete code end ****************** */

// }
