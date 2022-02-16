import { AccountService } from '@app/core/services/account.service';
import {
  Component, OnInit, Output,
  EventEmitter, Inject, Input, HostListener,
  ViewChild, ElementRef, OnChanges, DoCheck, SimpleChanges
} from '@angular/core';
import { Observable, of, concat, from } from 'rxjs';
import { map, filter, pluck, groupBy, mergeMap, toArray } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { OverviewHistoryPopupComponent } from '@app/shared/components/single-table/Sprint3Models/overview-history-popup/overview-history-popup.component';

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
import { FormControl, FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { OpenCustomizeableTable } from '../single-table/single-table.component';
import { SyncActivityService } from '@app/core/services/sync-activity.service';
import { newConversationService } from '@app/core/services/new-conversation.service';
import { ErrorMessage, MasterApiService } from '@app/core/services';
import { removeSpaces, specialCharacter } from '@app/shared/pipes/white-space.validator';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

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

@Component({
  selector: 'app-sync-editable-table',
  templateUrl: './sync-editable-table.component.html',
  styleUrls: ['./sync-editable-table.component.scss']
})
export class SyncEditableTableComponent implements OnInit {
  arrowkeyLocation = 0;
  /** All Declarations including parents input params starts here */
  @Input() TableName: string;
  @Input() IscheckBoxRequired: boolean;
  @Input() bgParentColor: string;
  @Input() IsActionFixed: true;
  @Input() IsFreezedColumn: boolean;
  @Input() TableCollection: any;
  @Input() IsCustomizeTable: boolean;
  @Input() ConfigData: any;
  @Input() totalTableCount: number;
  @Input() orderByName;
  @Input() paginationPageNumber: any;
  IsPageChangeEvent: boolean;
  @Input() sortBy: boolean = false;
  //service search and pagination declarations start

  //sprint5
  @Input() IsEdit: boolean;
  @Input() IsDelete: boolean;
  @Input() IsSync: boolean = false;
  @Input() IsPagination: boolean = true;
  @Input() classNameCss: string;
  @Input() IsPageRecords: boolean = true;
  @Input() IsCopy: boolean = false;
  @Input() IsGenerateData: number = 0;
  @Input() IsSerialNo: boolean = false;
  @Input() serviceSearch: boolean; //api service search make it true in parent
  serviceSearchItem: string;
  paginationLastIndex: number = 1;
  IsPaginagtion: boolean;
  //service search and pagination declarations end
  userSyncEnable:boolean=false;
  statusTextFlag;
  DummyOverlay: boolean = false;
  /***Mobile Pagination */
  isMobileDevice: boolean = false;
  isPagination: boolean = false;
  streamCal: boolean = false;
  /**Pagination Added Code **/
  headerOverlay: boolean = false;
  selectedAll: any;
  table_data: any;
  checkboxcounter: number = 0; selectedCount: any = [];
  search;
  searchItem: String;
  filterSearch: String;
  userArray: any[];
  clear;
  headerArray;
  showMoreOptions;
  headerData;
  /*Split HeaderData*/
  fixedColumn;
  normalColumn
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
  /** Filter on table Headers starts here */
  myFilter = [];
  myString;
  filterCheckBox = []
  filterBox = [];
  isFilter?: boolean;
  syncFilter=[];
  booleanFilter=[{
    "isDatafiltered": false,
"name": true,
"propName":"Private",

  },
  {
    "isDatafiltered": false,
"name": false,
"propName":"Public"
  }]
  @Input() orderType: string = "String"
  /**
   *  Filter table header ends
   */
  /** Inline editable table declares starts here */
  controltype: string;
  columnDisable: boolean;
  closePopUp: boolean;
  dependecy: string
  relationship: string;
  isCopyEnabled: boolean;
  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: undefined
  };
  /** Inline editable declarations ends here */
  @Output() detectActionValue = new EventEmitter<{ objectRowData: any, action: string,rowData:any,filterData:any }>();

  /** Editable table constructor starts here   */
  constructor(private router: Router, public service: SyncActivityService, public errorMessage: ErrorMessage,
    public userdat: DataCommunicationService, public dialog: MatDialog, private fb: FormBuilder) {


  }

  /** Editable table constructor ends here */
  loadTableData() {
    this.userArray.forEach((item: any, i) => {
      this.headerData.forEach(element => {

        if (element.allias) {
          if (!Array.isArray(item[element.name])) {

            if (item[element.name]) {
              item[element.allias] = item[element.name].name;
            } else {
              item[element.allias] = 'NA';
            }
            item.isCopyEnabled=element.relationship?item[element.relationship]:false;
           

          } else {
            var myArray = [];
            var pluckedItem = from(item[element.name]).pipe(pluck('name')).subscribe(x => {

              myArray.push(x)



            });
            item[element.allias] = myArray;
          }

          if (element.isRequired) {
            item[element.validation] = false;
            item[element.ErrorMessage]=""
          }
          if (element.controltype == 'smartautocomplete' || element.controltype == 'autocomplete' || element.controltype == 'cascadeAutocomplete') {
            item[element.popup] = false;
          }
        

        }
      });      
      
      item["isRowError"] = false;
    });


  }
  
  getClassByValue(index) {
    //'first_text stickyFirstColEdit d-flex' : 'fixed'j+1 'row_ellipses' fixedColumn[j]?.className
    var customClassName = this.fixedColumn[index].className ? this.fixedColumn[index].className : '';
    switch (index) {
      case 0: return "first_text stickyFirstColEdit flex-card";
      case 1: return "fixed2 row_ellipses" + customClassName;
      case 2: return "fixed3 row_ellipses" + customClassName;;
      case 3: return "fixed4 row_ellipses" + customClassName;;
    }
  }

  emitChecboxData(tableData,event) {
if(event.checked)
{
     tableData.isCopyEnabled=true;
     
     this.headerData.filter(x=>x.relationship).forEach(element => {
     
    if(element.allias)
    {
    if(element.controltype=="popupAutocomplete")
    {
      tableData[element.name]=["NA"]
      tableData[element.allias]=[]
    }
    else
    {
      tableData[element.name]={id: "", name: ""}
      tableData[element.allias]="";
      
    }
    if(element.isRequired)
    {
      tableData[element.validation]=false;
    }
    }
    else
    {
      if(element.controltype=="select")
    {
      tableData[element.name]="-1"
      
    }
    else
    {
     
      tableData[element.name]="";
    }
    }
   
    });
}
else
{
  tableData.isCopyEnabled=false;
  this.headerData.filter(x=>x.isRequired).forEach(element => {
     tableData[element.validation]=false;
  });
}
    // this.headerData.filter(x=>x.).forEach(element => {
      
    // });
   // this.detectActionValue.emit({ objectRowData: tableData, action: 'switch' });
  }
  commentAction: number = 0;
  expandTR = false;
  toggleExpand() {
    this.expandTR = !this.expandTR
  }
  expand_section(item) {

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
  }
  splitHeaderData() {
    this.fixedColumn = this.headerData.filter(x => x.isFixed == true)
    this.normalColumn = this.headerData.filter(x => x.isFixed == false);
  }
  ngOnInit() {
    /**Device Checking */
    debugger
    this.userdat.tableRecordsChecked = false;
    this.isMobileDevice = window.innerWidth < 800 ? true : false;

    var orginalArray = this.userdat.getTableData(this.TableName);
    this.IsinitialsLoading = true;

    orginalArray.subscribe((x: any[]) => {
      this.headerData = x,
        this.userdat.cachedArray = x;
      this.splitHeaderData();
    });


    if (this.TableCollection[0][this.headerData[0].name] != null) {
      this.config.totalItems = this.totalTableCount;
      this.userArray = this.TableCollection;

      this.config.currentPage = 1;
      this.loadTableData();
      // if (this.isMobileDevice) {
      //   this.filterData();
      //   this.sectionData = this.mobileFilter[0].data;
      //   this.activetabs = this.mobileFilter[0].key;
      //   this.config.itemsPerPage = this.TableCollection.length;
      // }
      // else{
      //   this.config.itemsPerPage = this.paginationPageNumber.PageSize;
      // }
      if(this.TableName!="syncactivity")
      {
        this.config.itemsPerPage = this.paginationPageNumber.PageSize;
      }
      else
      {
        this.config.itemsPerPage = this.userdat.MobileDevice?5:10;
      }
       

      this.key = this.orderByName ? this.orderByName : this.headerData[0].name;
      this.reverse = this.sortBy;
     
     
      this.config.currentPage = this.paginationPageNumber.RequestedPageNumber;
      // //static json
      // this.config.currentPage = this.paginationPageNumber ? this.paginationPageNumber.RequestedPageNumber : 1;
      // this.config.itemsPerPage = this.paginationPageNumber ? this.paginationPageNumber.PageSize : 10;

      console.log(this.userArray)
    } else {
      this.userArray = []
    }
    /*************************************** */
    setTimeout(() => {
      this.userdat.findWidth(true)
    }, 200);
  }
  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  public scrollToXY(x?: number): void {
    if (this.componentRef && this.componentRef.directiveRef) {
      this.componentRef.directiveRef.scrollTo(x, 500);
    }
      this.userdat.findWidth()
  }
  /** Editable table ngOnInit ends here */

  /** Editable table ngOnChanges starts here */

  pageChangeEvent(event) {
    this.userdat.tableRecordsChecked = false;
    this.removeAllSelectedRow();
    this.headerData.forEach(element => {
      element.isFilter = false;
    });
    this.filterBox = [];
    if (this.config.currentPage != event) {
      this.show = false;
      this.reverse = false;
      this.value = "Date";
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
          this.IsPageChangeEvent = true;
          this.detectActionValue.emit({ objectRowData: { currentPage: event, itemsPerPage: perPage, searchKey: this.serviceSearchItem }, action: 'pagination',rowData:null ,filterData:this.syncFilter});
        }

      } else {
        // the pipe will take care of this
      }
    }
    setTimeout(() => {
      this.scrollToXY(1);
    }, 200);
  }
  manageFilterBox() {
    this.headerOverlay = false;
    this.headerData.forEach(element => {
      element.isFilter = false;
    });
  }
  changeItemsPerPage(event) {
    this.userdat.tableRecordsChecked = false;
    this.removeAllSelectedRow();
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
        this.detectActionValue.emit({ objectRowData: { currentPage: this.config.currentPage, itemsPerPage: perPage, searchKey: this.serviceSearchItem }, action: 'pagination',rowData:null,filterData:this.syncFilter });
        // this.detectPageChangeData.emit({ objectRowData: this.userdat.serviceSearchItem, action: 'pagination', currentPage: this.config.currentPage, itemsPerPage: perPage });
      }

    } else {
      // the pipe will take care of this
    }
  }
  // Change data based on selection
  
  changeData(tableData,selectedIndex,headerData)
  {
     if(this.TableName!="syncactivity")
  {
    if(headerData.relationship)
    {

      var myData="$"+headerData.name;      
      var myValidation=[];
      //Resetting
      if (headerData.name=="curncy" && selectedIndex=="-1") {
        tableData[headerData.subProp[0]]="-1";
        tableData[headerData.subProp[1]]="";          
      }
      if(headerData.name!="empno")
      {
        myData="$curncy";  
      }
      this.headerData.filter(x=>x.relationship).forEach(element => {  
          tableData[element.validation]=false;
          if(element.controltype=='select')
          {
            let data=tableData[element.name] || "-1";
            
            if(data=="-1"){
              myValidation.push({fieldName:element.relationship,enable:false});
            }
            else
            {
              myValidation.push({fieldName:element.relationship,enable:true});
            }
          }else
          {
            let dataNumber=tableData[element.name] || "NA";
            if(dataNumber=="NA"){
              myValidation.push({fieldName:element.relationship,enable:false});
            }
            else
            {
              myValidation.push({fieldName:element.relationship,enable:true});
            }
          }
      });
     if(myValidation.every(x=>!x.enable))
     {
      tableData[headerData.relationship]=false;
      tableData[myData]=false;
     }
     else
     {       
      tableData[myData]=myValidation.some(x=>x.fieldName == headerData.relationship && x.enable);
      tableData[headerData.relationship]=!tableData[myData];
     }
     
     
    } 
    if(headerData.isRequired)
    {
      tableData[headerData.validation]=false;
    }
  }
  else if(headerData.subReqCol)
  {
    headerData.subReqCol.forEach(element => {
      tableData[element]=false;
    });
  }
    
   
  }
  nextPaginationButton() {
    console.log("Called");

  }
  generateTableData() {
    let requiredLength= this.headerData.filter(x=>x.isRequired).length;
    if(requiredLength>0){
    this.userArray.forEach(x => {
        x.isRowError = !this.validate(x);      
     });
     
    
    
    if (this.userArray.length == this.userArray.filter(x => (!x.isRowError)).length) 
    {
      this.detectActionValue.emit({ objectRowData: this.userArray, action: 'GenerateData',rowData:null,filterData:this.syncFilter })
    }
    }
    else
    {
      this.detectActionValue.emit({ objectRowData: this.userArray, action: 'GenerateData',rowData:null,filterData:this.syncFilter })
    }


  }

  ngOnChanges(changes: SimpleChanges) {
    
    if (this.IsinitialsLoading) {
      this.userdat.tableRecordsChecked = false
      switch (Object.keys(changes)[0]) {

        case 'totalTableCount':
          {
            this.config.totalItems = changes.totalTableCount.currentValue;

          }
        case 'paginationPageNumber':
          {
            this.config.currentPage = this.paginationPageNumber.RequestedPageNumber;
            this.config.itemsPerPage = this.paginationPageNumber.PageSize;
          }
        case 'TableCollection':
          {
            // this.userArray = this.TableCollection;
            // this.key="id";
            // this.reverse=true;
            if (this.TableCollection[0][this.headerData[0].name] != null) {
              this.userArray = this.TableCollection;
              if (changes.totalTableCount) {
                this.config.totalItems = changes.totalTableCount.currentValue;

              }

              // this.loadTableData();
              this.key = this.orderByName ? this.orderByName : this.headerData[0].name;
              this.reverse = this.sortBy;
              // if(this.isMobileDevice)
              // {
              //   this.filterData();
              //   this.config.itemsPerPage=this.TableCollection.length;      
              // }

              // if (this.isMobileDevice) {
              //   this.mobileFilter = []
              //   this.sectionData = []
              //   this.filterData();
              //   this.sectionData = this.mobileFilter[0].data;
              //   this.activetabs = this.mobileFilter[0].key;
              //   this.config.itemsPerPage = this.TableCollection.length;
              //   this.config.currentPage = 1
              // }
              setTimeout(() => {
                this.userdat.findWidth(true)
              }, 1000);
            }
            else {
              this.userArray = []
            }
            this.headerData.forEach(element => {
              element.isFilter = false;
            });
            this.filterBox = [];
            // else{
            //   if(this.isPagination)
            //   {
            //     let count:number;
            //     count= this.TableCollection.length/this.config.itemsPerPage;

            //     this.config.currentPage=Math.ceil(count)
            //   }
            //   else
            //   {
            //     this.config.currentPage=this.config.currentPage;
            //   }       
            // }

          }
        case 'IsGenerateData':
          {
            if(changes.IsGenerateData!==undefined) {
              console.log('IsGenerateData value-->', changes.IsGenerateData.currentValue)
              if (changes.IsGenerateData.currentValue) {
                this.generateTableData();
              }
            }
          }
      }

    }
    setTimeout(() => {
      this.scrollToXY(1);
    }, 200);
  }
  validate(rowData) {  

    var reqCol = this.headerData.filter(x => x.isRequired);
    var valid = 0;
    reqCol.forEach(element => {

      if (element.controltype == 'smartautocomplete' || element.controltype == 'autocomplete' || element.controltype == 'cascadeAutocomplete') {
       
        if (rowData[element.name]!=null && rowData[element.name].id) {
          rowData[element.validation] = false;
        }
        else {
          valid++;
          rowData[element.validation] = true;
          rowData[element.ErrorMessage]=element.ValidMsg[0]

        }
        
        if(element.relationship)
        {
          if(rowData[element.relationship])
          {
            if(rowData[element.validation])
            {
              valid--;
              rowData[element.validation] = false;
            }
            else
            {
              rowData[element.validation] = false;
            }
            
          }
        
        }
        if(element.reqStatus)
        {
          if(!rowData[element.reqStatus])
          {
            if(rowData[element.validation])
            {
              valid--;
              rowData[element.validation] = false;
            }
            else
            {
              rowData[element.validation] = false;
            }
            
          }
        }   
      

      }
      else if (element.controltype=="popupAutocomplete") {

        
        if (rowData[element.name][0]!='NA') {
          rowData[element.validation] = false;
        }
        else {
          valid++;
          rowData[element.validation] = true;
          rowData[element.ErrorMessage]=element.ValidMsg[0]

        }
        if(element.relationship)
        {
          if(rowData[element.relationship])
          {
            if(rowData[element.validation])
            {
              valid--;
              rowData[element.validation] = false;
            }
            else
            {
              rowData[element.validation] = false;
            }
            
          }
        
        }
       if(element.reqStatus)
        {
          if(!rowData[element.reqStatus])
          {
            if(rowData[element.validation])
            {
              valid--;
              rowData[element.validation] = false;
            }
            else
            {
              rowData[element.validation] = false;
            }
            
          }
        }
        

      }
      else if (element.controltype=="select") {
        if (rowData[element.name]!="-1") {
          rowData[element.validation] = false;
        }
        else {

          if(element.relationship)
          {
            if(rowData[element.relationship])
            {
              rowData[element.validation] = false;
            }
            else
            {
              valid++;
              rowData[element.validation] = true;
              rowData[element.ErrorMessage]=element.ValidMsg[0]
            }
          }          
          else
          {
            valid++;
            rowData[element.validation] = true;
            rowData[element.ErrorMessage]=element.ValidMsg[0]
          }
         

        }
      }
      else {
        if (rowData[element.name] != "" && rowData[element.name] != undefined && rowData[element.name] !=null) {
          rowData[element.validation] = false;
        }
        else {
          if(element.relationship)
          {
            if(rowData[element.relationship])
            {
              rowData[element.validation] = false;
            }
            else
            {
              valid++;
              rowData[element.validation] = true;
              rowData[element.ErrorMessage]=element.ValidMsg[0]
            }
          }          
          else
          {
            valid++;
            rowData[element.validation] = true;
            rowData[element.ErrorMessage]=element.ValidMsg[0]
          }

        }
      }

    });
    return valid == 0 ? true : false;
  }
  rowGenericData(rowData, action) {
    debugger
    if (this.validate(rowData)) {
      this.detectActionValue.emit({ objectRowData: rowData, action: action ,rowData:null,filterData:this.syncFilter});
    } else {
      this.errorMessage.throwError('Please enter mandatory fields!')
    }

  }
  advanceLookUp(headerData,tabledata)
  {
    this.detectActionValue.emit({ objectRowData: headerData.name, action: 'advanceLookUp' ,rowData:tabledata,filterData:this.syncFilter});
  }
  rowGenericCopyData(rowData, action, headerName) {
    if (rowData.isCheccked && this.isCopyEnabled) {
      var filterData = this.userArray.filter(x => x.isCheccked == true && x.id != rowData.id && !x.isCopyEnabled);
      filterData.forEach(data => {
        this.headerData.forEach(element => {
          if(element.isRequired)
          {
            data[element.validation]=false;
          }
        });
      });
      var result = filterData.map(a => a.id);
      var data = {
        from: rowData.id,
        to: result,
        colName: headerName
      }
      this.detectActionValue.emit({ objectRowData: data, action: action ,rowData:null,filterData:this.syncFilter});
    }

  }
  selectedAutocompleteInput(tableData: any, item: any, headername: any) {
    var dependecyHeader = this.headerData.filter(x => x.dependecy);
    if(dependecyHeader.length>0)
    {
      if (dependecyHeader[0].dependecy == headername) {
        dependecyHeader.forEach(element => {
          tableData[element.name] = item[element.name]
        
        });
      }
    }
    
    var myAllias="_"+headername;
    tableData[myAllias] = item.name;
    tableData[headername] = item;
  
    this.detectActionValue.emit({ objectRowData: { itemData: item, rowData: tableData }, action: headername ,rowData:null,filterData:this.syncFilter});
    console.log(tableData)
  }
  openGenericModal(object, coloumn,isEdit) {
    console.log(object, coloumn);
    this.detectActionValue.emit({ objectRowData:{isSearch:isEdit} , action: coloumn,rowData:object,filterData:this.syncFilter })

  }

  autoSearch(search: any, headername: any,tableData) {

    this.detectActionValue.emit({ objectRowData: search, action: headername ,rowData:tableData,filterData:this.syncFilter});
  }
  autoClose(tableData: any,headername: any) {
    debugger;
    this.detectActionValue.emit({ objectRowData: tableData, action: 'autoClose' ,rowData:headername,filterData:this.syncFilter});
  }

  autoSelect(tableData: any, headername: any, selectedItem) {
    debugger;
    this.detectActionValue.emit({ objectRowData: { data: tableData, selectedData: selectedItem }, action: headername ,rowData:null,filterData:this.syncFilter});
  }
  openCreateActivityGroupModal(object, coloumn) {
    console.log(object, coloumn);
    debugger;
    const dialogRef = this.dialog.open(createActivityGroupModal,
      {
        width: '350px',
        data: { itemData: [object], column: coloumn, configdata: this.ConfigData }
      });
    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
      // do something
      console.log(x);
      //this.detectActionValue.emit({ objectRowData: x, action: coloumn })
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.detectActionValue.emit({ objectRowData: result, action: 'createActivty',rowData:null,filterData:this.syncFilter })
      }
    });

  }

  /** popup constant congif method starts  here*/
  returnConfigData(actionName) {
    switch (actionName) {
      case 'disqualify':
        return disqualifyLead;
      case 'convertOpportunity':
        return convertOpportunity;
    }
  }
  /** popup constant config method ends here */

  /** Generic Table related important poups starts here */

  /** Editable table ngOnChanges ends here */
  /** On scroll page load logic only for mobile starts here*/
  // @HostListener("window:scroll", [])
  // onScroll(): void {
  //   // debugger
  //   if (this.isMobileDevice) {
  //     // console.log('event in single table', event)
  //     event.preventDefault();
  //     event.stopPropagation();
  //     if (this.userArray.length < this.totalTableCount && this.isPagination) {
  //       if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight) {
  //         // console.log(this.config.currentPage);
  //         this.isPagination = false;
  //       //  this.isLoading = true;
  //         var pageCount = (this.userArray.length / 50) + 1;
  //         // console.log(pageCount);
  //         this.detectActionValue.emit({ objectRowData: this.userdat.serviceSearchItem, action: 'pagination',rowData:null,filterData:this.syncFilter});
  //         //   this.detectActionValue.emit({ objectRowData: this.userdat.serviceSearchItem, action: 'pagination',pageData:this.config });

  //       }
  //     }

  //   }
    
  // }
  /** On scroll page load logic only for mobile ends here*/

  /** Search, Alpha sort and checkbox select all logic starts here */
  // Sample dropdown starts
  show;
  value: string = "Date";
  // search box ends
  key: string;
  reverse: boolean;
  addCBU(i) {
    // if (i == 1) {
    //   this.value = "A to Z"
    //   this.show = false;
    //   this.reverse = false;
    // }
    // else if (i == 2) {
    //   this.value = "Z to A"
    //   this.show = false;
    //   this.reverse = true;
    // }
    // else if (i == 3) {
    //   this.value = "Alphabetically3"
    //   this.show = false;
    // }
    if (this.orderType == "Number") {
      console.log('index-->', i)
      if (i == 1) {
        //  this.key = this.headerData[0].name;
        this.value = "Date"
        this.show = false;
        this.reverse = true;
      }
      else if (i == 2) {
        // this.key = this.headerData[0].name;
        this.value = "Date"
        this.show = false;
        this.reverse = false;
      }
      else if (i == 3) {
        this.value = "Alphabetically3"
        this.show = true;
      }
    }
    else {
      console.log('index-->', i)
      if (i == 1) {
        this.key = this.headerData[0].name;
        this.value = "Date"
        this.show = false;
        this.reverse = false;
      }
      else if (i == 2) {
        this.key = this.headerData[0].name;
        this.value = "Date"
        this.show = false;
        this.reverse = true;
      }
      else if (i == 3) {
        this.value = "Alphabetically3"
        this.show = false;
      }
    }
  }
  removeAllSelectedRow() {
    this.selectedAll = false;
    this.userArray.map(x => { x.isCheccked = false; return x })
    this.userdat.tableRecordsChecked = this.selectedAll;
    this.userdat.topbuttons = this.selectedAll;

  }
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
     
    this.headerData.forEach(element => {
      if(element.isRequired)
      {
        x[element.validation]=false;
      }
    });
      return x;

    })
    // for (var i = 0; i < this.userArray.length; i++) {
    //   this.userArray[i].isCheccked = this.selectedAll;
    // }
   // this.selectedRowCount = this.userArray.filter(x => x.isCheccked).length;
    this.userdat.tableRecordsChecked = this.selectedAll;
    this.userdat.topbuttons = this.selectedAll;
    if (this.userdat.tableRecordsChecked) {
    //  this.updateTopBarButtons();
    }
      var data=this.headerData.filter(x=>x.relationship);
      if(data.length>0)
      {
        var propName=data[0].relationship;
        
        this.isCopyEnabled = pageCol.filter(x=>!x[propName]&& x.isCheccked).length>=2?true:false;
      }
     
      this.userSyncEnable=pageCol.filter(x=>x.isCheccked).every(x=>x.isCopyEnabled);
  }

  // test:boolean=false;

  checkIfAllSelected(index) {

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
   
    this.headerData.forEach(element => {
      if(element.isRequired)
      {
        this.userArray[index][element.validation]=false;
      }
    });
    if (count > 1) {
      // document.getElementsByClassName('responsive-btn-div-button')[0].classList.add('active');
      // this.test=true;   
      this.userdat.tableRecordsChecked = true;
      this.userdat.topbuttons = true;
      var data=this.headerData.filter(x=>x.relationship);
      if(data.length>0)
      {
        var propName=data[0].relationship;
        
        this.isCopyEnabled = pageCol.filter(x=>!x[propName]&& x.isCheccked).length>=2?true:false;
      }
      
      //this.updateTopBarButtons();

    } else {
      // document.getElementsByClassName('responsive-btn-div-button')[0].classList.remove('active');
      // this.test=false;

      this.isCopyEnabled = false;
      this.userdat.tableRecordsChecked = false;
      this.userdat.topbuttons = false
    }
    // if (count == 1) {
    //   // document.getElementsByClassName('responsive-btn-div-button')[0].classList.add('active');
    //   this.userdat.topbuttons = true;
    // }
    // this.selectedRowCount = this.userArray.filter(x => x.isCheccked).length;
    this.userSyncEnable=pageCol.filter(x=>x.isCheccked).every(x=>x.isCopyEnabled);
  }




  showAlpha() {
    document.getElementsByClassName('caret0')[0].classList.toggle('rotate-180d');
    this.show = !this.show;
  }
  hidedropdown() {
    document.getElementsByClassName('caret0')[0].classList.remove('rotate-180d');
    this.show = false;
  }
  // Sample dropdown ends
  // search box
  expand = false;
  hidepagination = true;
  inputClick() {
    this.expand = true;
    if (this.isMobileDevice) {
    this.hidepagination = false;
    }
  }
  OutsideInput() {
    this.expand = false;
    if (this.isMobileDevice) {
    this.hidepagination = true;
    }
  }


  close() {
    this.expand = false;
    if (this.isMobileDevice) {
      this.hidepagination = true;
      }
    this.serviceSearchItem =''
    this.serviceSearchData();
   
  }
  
  /** Search, Alpha sort and checkbox select all logic ends here */

  /** Filter header related logic  starts here*/
  filteredCheckBoxSelected(item, propertName) {
    item.isDatafiltered = !item.isDatafiltered;
    if(item.isDatafiltered)
    {
      if(this.myFilter.length!=0)
      {
        if(this.myFilter.filter(x=>x.propName==item.propName).length==0)
        {
         this.myFilter.push(item)
        }
      }
      else
      {
        this.myFilter.push(item)
      }
    
     
    }
    else
    {
      this.myFilter=this.myFilter.filter(x=>x.propName!=item.propName)
    }
     
  }
  //filter starts
  check: boolean = false;
  searchitem;
  selectall;
  headerName

  titleShow(name, index) {
    this.headerName = name;
  }

  getSelectName(headerItem, id) {
    var mydata="NA";
    if(id != -1 )
    {
     var myFilter=this.ConfigData[headerItem.name].filter(x => x.id == id);
     if(myFilter.length>0)
     {
      mydata=myFilter[0].name;
     }
     
    }
    return mydata;
  }
  filteredData(item) {
    this.searchitem = '';
    //this.filterBox = [];
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
      var pageCol = this.filterBox.length > 0 ? this.userdat.pseudoFilter : this.userArray.slice(start, end);
      console.log(pageCol);

      // let tempDataReturn = this.filterBox.length > 0 ? this.userdat.pseudoFilter : this.userArray;
      var pluckedItem = from(pageCol).pipe(pluck(pluckName)).subscribe(x => {
        if (x) {
          if (Array.isArray(x)) {
            x.forEach(element => {
              if (element) {
                items.push(element)
              }

            });

          } else {

            items.push(x)
          }
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
    var pluckName =  item.name;
    if(item.name=="Meeting")
    {
      return  this.syncFilter.length > 0 ?  'dataFiltered' : '';
    }
    else
    {
      return ''
    }
  }
  showcheckbox(item) {
    if (!item.isFilter && !item.hideFilter) {
     
        item.isFilter = true;
       
        this.headerOverlay = true;
    }
    else {
      item.isFilter = false;
      this.headerOverlay = false;
    }
  }
  applyColFilter(item)
  {
    
    item.isFilter=false;
    this.syncFilter=JSON.parse(JSON.stringify(this.booleanFilter.filter(x=>x.isDatafiltered)));
    this.detectActionValue.emit({ objectRowData: this.serviceSearchItem, action: 'meetingFilter' ,rowData:null,filterData:this.syncFilter});
    this.config.currentPage = 1;
  }
  cancelColFilter(item)
  {
    item.isFilter=false;
  }
  stop(e) {
    e.stopImmediatePropagation();
  }

  openMultipleGenericModal(data) {
    
 var filterData = this.userArray.filter(x => x.isCheccked == true);
 var mystatus=[];
 filterData.forEach(element => {
  mystatus.push(this.validate(element))
 });
 if (mystatus.every(x=>x==true)) {
  this.detectActionValue.emit({ objectRowData: filterData, action: 'multiSync',rowData:null,filterData:this.syncFilter });
} else {
  this.errorMessage.throwError('Please enter mandatory fields!')
}
  }
  filterSearchClose() {
    this.searchitem = "";
  }

  clearAllCheckBox() {
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
    //this.syncFilter=JSON.parse(JSON.stringify(this.myFilter));
   this.booleanFilter.forEach(x=>x.isDatafiltered=false);   
   this.myFilter=[];
    // this.filterBox = [];
  }
  //filter ends

  /** Overlay for filter clear selection starts here */
  off() {
    this.DummyOverlay = false;
    this.headerData.forEach(element => {
      element.isFilter = false;
    });
  }
  /** Overlay for filter clear selection ends here */
  onClickedOutside(e: Event) {
    this.showMoreOptions = false;
  }
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
    // document.getElementsByClassName('responsive-btn-div')[0].classList.add('active');
  }
  hideMobFilter() {
    this.tableMobFilter = false;
    this.singleTable = true;
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
    // var pluckedItem = from(this.userArray).pipe(pluck(item.name)).subscribe(x => {
    //   console.log(typeof x);
    //   if (typeof x == 'object'&& x!=null) {
    //     items.push(x[0])

    //   } else {
    //     items.push(x)
    //   }

    // });

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
      console.log(mobileFilter)
      this.popuplatedFilter(element)
    });

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
        if (Array.isArray(element[e2.key])) {

          if (element[e2.key].includes(e2.filterItem)) {
            console.log(element);
            dummyCol.push(element)
          }
        }
        else {
          if (e2.filterItem == element[e2.key]) {
            console.log(element);
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

  /** Mobile table filter ends here */



  /***Sync Validation */
  checkValidation() {
    return false;
  }
  /**SyncValidation */
  /** Service search data logic starts here */
 
  serviceSearchData() {
    this.detectActionValue.emit({ objectRowData: this.serviceSearchItem, action: 'search' ,rowData:null,filterData:this.syncFilter});
    this.config.currentPage = 1;
  }
  /** Service search data logic ends here */

  /** pagination pass data logic starts here */

  intitalRecordCount: number;
  RecordCountPerPage: number;
  TotalRecords: number;
  FirstPage: boolean;



  getPaginatorData(e) {

  }
  emitPagination() {
    console.log("adas");
    this.IsPaginagtion = true;
    this.detectActionValue.emit({ objectRowData: this.serviceSearchItem, action: 'pagination',rowData:null,filterData:this.syncFilter });
  }

  /** pagination pass data logic ends here */


  /**  Open custamizable drag table cache starts here*/
  openCustomizeTable() {
    const dialogRef = this.dialog.open(OpenCustomizeableTable, {
      width: '660px'
    });
    this.myArrayData = [];
    this.headerData.forEach(x => {
      this.myArrayData.push({ id: x.id, name: x.name, isFixed: x.isFixed, order: x.order, title: x.title, isModal: x.isModal, isLink: x.isLink, isStatus: x.isStatus, className: x.className, hideFilter: x.hideFilter, isPopUp: x.isPopUp, dateFormat: x.dateFormat, controltype: x.controltype, columnDisable: x.columnDisable, closePopUp: x.closePopUp, dependecy: x.dependecy, relationship: x.relationship });
    })

    dialogRef.componentInstance.data = this.myArrayData;
    dialogRef.afterClosed().subscribe(result => {
      if (result !== "undefined") {
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
          this.userdat.findWidth(true);
        }, 200);
      }
    })
  }
  /**  Open custamizable drag table cache ends here */
}

@Component({
  selector: 'create-activity-autocomplete',
  templateUrl: '../sync-editable-table/create-activity-modal.html',
  styleUrls: ['./sync-editable-table.component.scss']
})

export class createActivityGroupModal {
  @Output() modelEmiter = new EventEmitter();
  contactName: string = "";
  contactNameSwitch: boolean = false;
  ActivityTypeForm: FormGroup;
  isLoading: boolean;
  companyDetails: any = [];
  ActivityType: any = [];
  AccountSysGuid: any;
  AccName: any;
  companyName: any;
  isvalidation: boolean = false;
  create: boolean = false;
  activityId: any;
  Name: any;
  isProspect: boolean = false;
  isAccountNameSearchLoading: boolean = false;
  arrowkeyLocation = 0;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<createActivityGroupModal>,
    public userdat: DataCommunicationService, public accservive: AccountService, public fb: FormBuilder,
    public newconversationService: newConversationService, public matSnackBar: MatSnackBar,
    public service: DataCommunicationService) {
    this.CreateActivityType()
  }
  ngOnInit() {

  }

  clickAccountData() {
    this.ActivityTypeForm.patchValue({
      accountName: ''
    })
      this.isAccountNameSearchLoading = true;
      this.companyDetails = []
      this.newconversationService.getsearchAccountCompany('').subscribe(res => {
        this.isAccountNameSearchLoading = false;
        this.isLoading = false;
        if (res.IsError === false) {
          this.companyDetails = res.ResponseObject;
        } else {
          this.onError(res.Message);
          this.companyDetails = []
        }
      }, error => {
        this.isAccountNameSearchLoading = false;
        this.companyDetails = []
      });
  }
  CreateActivityType() {
    this.ActivityTypeForm = this.fb.group({
      newActivityGroup: ['', Validators.compose([Validators.required, removeSpaces, specialCharacter])], //this.noWhitespaceValidator
      accountName: ['', Validators.required]
    })
    this.OnChanges()
  }
  OnChanges() {
    this.ActivityTypeForm.get('accountName').valueChanges.subscribe(val => {
      if (val.trim() !== "" && this.ActivityTypeForm.get('accountName').dirty) {
        this.companyDetails =[];
        this.isAccountNameSearchLoading= true;
        this.newconversationService.getsearchAccountCompany(val).subscribe(res => {
          this.isLoading = false;
          this.isAccountNameSearchLoading= false;
          if (res.IsError === false) {
            this.companyDetails = res.ResponseObject;
          } else {
            this.onError(res.Message);
          }
          console.log("getsearchAccName", res)
        }, error => {
          this.isAccountNameSearchLoading= false;
        });
      }
    })
  }
  get f() {
    return this.ActivityTypeForm.controls
  }
  
  onError(message) {
    let action;
    this.matSnackBar.open(message, action, {
      duration: 3000
    });
  }
  contactNameclose() {
    this.contactNameSwitch = false;
    if (this.AccountSysGuid === undefined) {
      this.ActivityTypeForm.patchValue({ accountName: '' })
    }
  }
  appendConversation(item,i) {
    // this.newconversationService.ValidateAccount(item.SysGuid, item.isProspect, 0).subscribe(res => {
    //   console.log(res.ResponseObject);
    //   if (res.IsError) {
    //     this.onError(res.Message)
    //     this.ActivityTypeForm.patchValue({
    //       accountName: ""
    //     })
    //   } else {
        this.AccountSysGuid = item.SysGuid;
        this.AccName = item.Name;
        this.isProspect = item.isProspect
        this.companyName = item.Name;
        this.ActivityTypeForm.patchValue({
          accountName: item.Name
        })
  //     }
  // }, error => {
  //   this.ActivityTypeForm.patchValue({
  //     accountName: ""
  //   })
  // })
  this.contactName = item.Name;
  // this.contactNameSwitch = false;
  this.contactNameclose();
}
  CreateActivity() {
    if (this.ActivityTypeForm.valid === false) {
      this.service.validateAllFormFields(this.ActivityTypeForm);
    }
    if (this.ActivityTypeForm.valid === true) {
      this.create = true;
      const body = {
        "Name": this.ActivityTypeForm.value.newActivityGroup.trim(),
        "ActivityType": { "Id": 0 },
        "Account": { "SysGuid": this.AccountSysGuid, "Name": this.AccName, "isProspect": this.isProspect },
      }
      console.log(body);
      this.newconversationService.getCreateActivityGroup(body).subscribe(res => {
        console.log('createactiviyugroup', res);
        this.isLoading = false;
        if (res.IsError === false) {
          this.isvalidation = false;
          console.log('create activity', res);
          let val;
          this.modelEmiter.emit(this.contactName);
          this.matSnackBar.open(res.Message, val, {
            duration: 3000
          })
          this.dialogRef.close({ data: res.ResponseObject, rowData: this.data });
        }
       
        if (res.IsError === true) {
          this.create = false;
          let val;
          this.matSnackBar.open(res.Message, val, {
            duration: 2000
          })
        }
      }, error => {
        this.isLoading = false;
        this.create = false;
      })
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
  }

}
// Generic popup ends