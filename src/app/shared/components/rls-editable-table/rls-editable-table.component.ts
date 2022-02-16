import {
  Component,
  OnInit,
  SimpleChanges,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from "@angular/core";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { DataCommunicationService } from "@app/core/services/global.service";
import { MatDialog, MatSnackBar, MatDialogRef } from "@angular/material";
import { ErrorMessage } from "@app/core";
import { ValidateforNullnUndefined } from "@app/core/services/validateforNULLorUndefined.service";
import { MessageService } from "@app/core/services/deals/deals-observables.service";
@Component({
  selector: "app-rls-editable-table",
  templateUrl: "./rls-editable-table.component.html",
  styleUrls: [
    "../editable-expansion-table/editable-expansion-table.component.scss",
    "./rls-editable-table.component.scss"
  ]
})
export class RLSEditableTableComponent implements OnInit, OnDestroy {
  @Input() TableName: string;
  @Input() totalTableCount: number;
  @Input() paginationPageNumber: any;
  @Input() IscheckBoxRequired: boolean;
  @Input() bgParentColor: string;

  @Input() IsDelete: boolean;
  @Input() IsEdit: boolean;
  @Input() IsMore: boolean;
  @Input() IsMoreAction: boolean;

  @Input() IsActionFixed: boolean;
  @Input() IsFreezedColumn: boolean;
  @Input() TableCollection: any;

  // Sprint 3
  @Input() IsEditDraft: any;
  @Input() ExpansionTable: string = "";
  @Input() IsDeleteAccount: boolean;

  @Input() IsDownload: boolean;
  @Input() ConfigData: any;
  @Input() orderByName;
  @Input() sortBy: boolean = false;

  // Sprint 4
  @Input() IsDeleteTeamMember: any;
  @Input() hideAddNewMember: boolean;
  @Input() IsSerialNo: boolean;

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
  @Input() orderType: string = "String";
  @Input() AllTopBtnLable: any = [];
  @Input() AddnewRow: boolean = false;
  @Input() isIP: boolean;
  more: boolean;
  istyping: boolean = false;
  config: number = 0;

  isTableRowChecked: boolean = false;
  checkname: string = "";
  hoverchange = false;
  holdPreValue: any;
  isLoading: boolean;
  statusTextFlag;

  fromShowCheckBox = false;
  /**Pagination Added Code **/
  isIntialized: boolean = false;
  IsinitialsLoading: boolean;
  selectedAll: any;
  table_data: any;
  checkboxcounter: number = 0;
  selectedCount: any = [];
  userArray: any[];
  clear;
  headerArray;
  selArry;
  fixedColumn;
  normalColumn;
  showMoreOptions;
  headerData;
  fixedClass = "fixedClass1";
  id?: number;
  name?: string;
  order?: number;
  isFixed?: boolean;
  title: string;
  className: string;
  dateFormat: string;
  myArrayData = [];
  createRow: boolean = false;
  editableRow = [];
  rowEdit: boolean;
  toggleSwitch: boolean;
  relationship: any;
  allias: any;
  controltype: any;
  closePopUp: boolean;
  calenderView: boolean = false;
  selectdIcn: boolean;
  classContent: string = "mdi-plus";
  childContent: string = "mdi-delete";
  arrowkeyLocation = 0;
  newAddMember;
  tempNewAddMember = [];
  isCheckBoxRequired: boolean = false;
  totalTableData = [];
  account_dash() { }
  @Input() isBillingDisable: any;
  @Output() detectActionValue = new EventEmitter<{
    objectRowData: any;
    action: string;
    pageData: any;
  }>();
  @Output() detectPageChangeData = new EventEmitter<{
    objectRowData: any;
    action: string;
    currentPage: number;
    itemsPerPage: number;
  }>();
  @Output() detectSelectDependentData = new EventEmitter<{
    selected: any;
    action: string;
  }>();
  effort: any;
  buttonVisibility: boolean = true;
  pastDeal$: Subscription = new Subscription();
  tabVisibility: boolean = true;
  /** All Declarations including parents input params ends here */

  /**
   * Editable table constructor starts here
   */
  constructor(
    public userdat: DataCommunicationService,
    public dialog: MatDialog,
    public _error: ErrorMessage,
    public message: MessageService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.isIntialized = true;
    var orginalArray = this.userdat.getTableData(this.TableName);
    this.IsinitialsLoading = true;
    console.log("RLS table", orginalArray);
    this.pastDeal$ = this.message.getPastDealEnable().subscribe(message => {
      console.log("message inside the rls editable table-->", message);
      if (message.originUrl.includes("rlsView")) {
        this.tabVisibility = false;
      }
    });
    if (!this.IsHeaderData) {
      orginalArray.subscribe((x: any[]) => {
        (this.headerData = x), (this.userdat.cachedArray = x);
        this.splitHeaderData();

        this.generateNewDynamicRowData();
      });
    } else {
      (this.headerData = this.HeaderData),
        (this.userdat.cachedArray = this.HeaderData),
        this.splitHeaderData();

      this.generateNewDynamicRowData();
    }

    if (this.TableCollection[0][this.headerData[0].name] != null) {
      this.loadInitials();
      this.selectedAll = this.TableCollection.every(x => x.isRowEditable);
      this.userArray = this.TableCollection;
      this.generateTotalTableData();
      console.log(this.userArray);
    } else {
      this.userArray = [];
    }
  }
  autoSearch(search: any, headername: any) {
    // this.detectActionValue.emit({
    //   objectRowData: search,
    //   action: headername,
    //   pageData: this.config
    // });
  }
  selectedLocalAutocompleteInputRow(
    tableData: any,
    headername: any,
    arrowIndex: number,
    inputvalue: string
  ) {
    let filterData = this.ConfigData[headername].filter(x =>
      x.name.toLowerCase().includes(inputvalue.toLowerCase())
    );
    tableData[headername] =
      filterData.length == 0 ? { id: "-1", name: "" } : filterData[arrowIndex];
  }
  calculateDataMaxLength(autoCollection, inputvalue) {
    return autoCollection.filter(x =>
      x.name.toLowerCase().includes(inputvalue.toLowerCase())
    ).length;
  }
  selectedAutocompleteInputRow(tableData: any, item: any, headername: any) {
    tableData[headername.name] = item;
    console.log(tableData);
    if (headername.controltype == "cascadingAuto") {
      this.loadCascadeData(tableData, headername);
    }
    if (headername.name == "SKILL") {
      this.detectActionValue.emit({
        objectRowData: [
          {
            data: tableData,
            key: headername.name
          }
        ],
        action: "Skill_changed",
        pageData: this.config
      });
    }
  }
  checkValidation(type, value, property) {
    if (type == "id") {
      if (value == "-1") {
        property.IsError = true;
      } else {
        property.IsError = false;
      }
    } else {
      if (value == "") {
        property.IsError = true;
      } else {
        property.IsError = false;
      }
    }
  }
  //TopButonsVisibility Sprint 5
  checkTopVisibility(BtnName) {
    return this.AllTopBtnLable.some(x => x == BtnName);
  }
  updateTotalData(tableData, headerItem) {
    var verticalAddition = 0;
    var horlAddition = 0;
    this.userArray.forEach(element => {
      verticalAddition = this.addData(
        verticalAddition,
        element[headerItem.name]
      );
    });
    this.headerData.forEach(element => {
      if (element.isVar) {
        horlAddition = this.addData(horlAddition, tableData[element.name]);
      }
    });
    this.totalTableData[0][headerItem.name] = verticalAddition;
    tableData[this.effort.name] = horlAddition;
  }
  updateCostData(tableData, items) {
    if (items.name == "PRODUCTMARGIN") {
      tableData["PRODUCTCOST"] = 100 - Number(tableData["PRODUCTMARGIN"]);
    } else if (items.name == "SERVICEMARGIN") {
      tableData["SERVICECOST"] = 100 - Number(tableData["SERVICEMARGIN"]);
    } else if (items.name == "OTHERCOSTMARGIN") {
      tableData["OTHERCOSTPERC"] = 100 - Number(tableData["SERVICEMARGIN"]);
    }
  }
  addData(a, b) {
    let a1 = a ? a : 0;
    let b1 = b ? b : 0;
    return Number(a1) + Number(b1);
  }

  generateTotalTableData() {
    let totalObject = {};

    this.userArray.forEach(item => {
      this.headerData
        .filter(x => x.isVar)
        .forEach(element => {
          totalObject[element.name] = this.addData(
            totalObject[element.name],
            item[element.name]
          );
        });
    });
    this.totalTableData.push(totalObject);
    console.log(this.totalTableData);
  }
  updateVerticalTableData() {
    this.userArray.forEach((item, i) => {
      this.headerData
        .filter(x => x.isVar)
        .forEach(element => {
          if (i == 0) {
            this.totalTableData[0][element.name] = 0;
          }
          this.totalTableData[0][element.name] = this.addData(
            this.totalTableData[0][element.name],
            item[element.name]
          );
        });
    });
  }
  generateNewDynamicRowData() {
    let tempNewAddRow = {};

    this.headerData.forEach(element => {
      // element.isFilter = false;
      switch (element.controltype) {
        case "select":
          {
            tempNewAddRow[element.name] = { id: "-1", name: "" };
          }
          break;
        case "input":
          {
            tempNewAddRow[element.name] = "";
          }
          break;
        case "autocomplete":
          {
            tempNewAddRow[element.name] = { id: "-1", name: "" };
          }
          break;
        case "date":
          {
            tempNewAddRow[element.name] = "";
          }
          break;
        case "label":
          {
            tempNewAddRow[element.name] = "";
          }
          break;
        case "switch":
          {
            tempNewAddRow[element.name] = false;
          }
          break;
        case "cascadingDrop":
          {
            tempNewAddRow[element.name] = { id: "-1", name: "" };
          }
          break;
        case "cascadingAuto":
          {
            tempNewAddRow[element.name] = { id: "-1", name: "" };
          }
          break;
        case "number":
          {
            tempNewAddRow[element.name] = 0;
          }
          break;
        case "readonly":
          {
            tempNewAddRow[element.name] = "";
          }
          break;
      }
      if (element.IsRequired) {
        tempNewAddRow[element.validation] = false;
      }
    });

    this.newAddMember = [tempNewAddRow];
    this.tempNewAddMember = Object.assign([], this.newAddMember);
  }
  getRelationData(headerData, tableData) {
    if (headerData.relationship) {
      if (tableData[headerData.relationship]) {
        tableData[headerData.name] = { id: -1, name: "" };
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  clearRowValidation() {
    this.detectActionValue.emit({
      objectRowData: {},
      action: "newRowDiscarded",
      pageData: this.config
    });
    this.headerData.forEach(element => {
      if (element.IsError) {
        element.IsError = false;
      }
    });
    this.createRow = false;
    //this.newAddMember = [];
    //  this.newAddMember.push(this.tempNewAddMember[0])
    //this.newAddMember = [];
    this.newAddMember = [];
    this.generateNewDynamicRowData();
  }
  editDeal: boolean = true;
  editWholeDeal: boolean = true;
  // editTopBtnActions() {

  //   this.userArray = this.userArray.map(x => {
  //     x.isRowEditable = x.isCheccked;
  //     return x;
  //   })
  //   this.editDeal = !this.editDeal;

  // }
  validate(rowData) {
    var reqCol = this.headerData.filter(x => x.IsRequired);
    var valid = 0;

    reqCol.forEach(element => {
      if (
        element.controltype == "select" ||
        element.controltype == "cascadingDrop" ||
        element.controltype == "autocomplete" ||
        element.controltype == "cascadingAuto"
      ) {
        if (
          rowData[element.name].id != "-1" &&
          rowData[element.name].id != ""
        ) {
          rowData[element.validation] = false;
          valid++;
        } else {
          if (element.isDisable) {
            if (rowData[element.isDisable]) {
              rowData[element.validation] = false;
              valid++;
            } else {
              if (
                rowData[element.name].id != "" &&
                rowData[element.name].id != "-1"
              ) {
                rowData[element.validation] = false;
                valid++;
              } else {
                rowData[element.validation] = true;
                rowData[element.ErrorMessage] = element.ValidMsg[0];
              }
            }

          } else {
            rowData[element.validation] = true;
            rowData[element.ErrorMessage] = element.ValidMsg[0];
          }
        }
      } else if (
        element.controltype == "text" ||
        element.controltype == "number" ||
        element.controltype == "percentage"
      ) {
        if (
          rowData[element.name] != undefined &&
          rowData[element.name] != null &&
          rowData[element.name].toString() != ""

        ) {
          if (element.controltype == "percentage") {
            if (rowData[element.name] > 0 && rowData[element.name] < 100) {
              valid++;
              rowData[element.validation] = false;
            } else {
              rowData[element.validation] = true;
              rowData[element.ErrorMessage] = element.ValidMsg[0];
            }
          } else if (element.dependecyValid) {
            if (element.isDecs) //if input is desabled, dont validate
            {
              if (rowData[element.DescTitle] == 'NA') {
                valid++;
                rowData[element.validation] = false;
              }
              else {
                if (+rowData[element.name] > 0){
                    if (+rowData[element.name] >= +rowData[element.dependecyValid]) 
                    {
                          valid++;
                          rowData[element.validation] = false;
                    }
                    else 
                    {
                       rowData[element.validation] = true;
                       rowData[element.ErrorMessage] = element.ValidMsg[1];
                    }
                  // valid++;
                  // rowData[element.validation] = false;
                }
                else{
                  rowData[element.validation] = true;
                  rowData[element.ErrorMessage] = element.ValidMsg[0];
                }
                
              }
            }
            else {
              if (+rowData[element.name] >= +rowData[element.dependecyValid]) {
                valid++;
                rowData[element.validation] = false;
              } else {
                rowData[element.validation] = true;
                rowData[element.ErrorMessage] = element.ValidMsg[1];
              }
            }
          } else {
            valid++;
            rowData[element.validation] = false;
          }
        } else {
          if (element.isDecs) //if input is desabled, dont validate 
          {
            if (rowData[element.DescTitle] == 'NA') {
              valid++;
              rowData[element.validation] = false;
            }
            else {
              rowData[element.validation] = true;
              rowData[element.ErrorMessage] = element.ValidMsg[0];
            }
          }
          else {
            rowData[element.validation] = true;
            rowData[element.ErrorMessage] = element.ValidMsg[0];
          }

        }
      }
    });

    return reqCol.length == valid ? false : true;
  }
  editWholeTable() {
    if (this.editWholeDeal) {
      this.editWholeDeal = false;
      this.userArray.forEach(x => {
        x.isCheccked = false;
      });
      // this.userArray = this.userArray.map(x => {
      //   x.isRowEditable = true;
      //   return x;
      // })
      // this.userArray.forEach(x => {

      //   x.isRowEditable = true;
      // });
      this.isCheckBoxRequired = true;
      //this.userArray[0].isRowEditable = true;
    } else {
      // this.editWholeDeal = true;

      this.isCheckBoxRequired = false;
      let requiredLength = this.headerData.filter(x => x.IsRequired).length;
      if (requiredLength > 0) {
        this.userArray.forEach(x => {
          x.IsRowError = this.validate(x);
        });
        let isChecckedArray = this.userArray.filter(x => x.isCheccked == true);
        if (this.userArray.filter(x => x.IsRowError).length == 0) {
          this.editWholeDeal = true;
          this.userArray.forEach(x => {
            x.isRowEditable = false;
          });
          if (isChecckedArray.length > 0) {
            this.detectActionValue.emit({
              objectRowData: isChecckedArray,
              action: "saveAll",
              pageData: this.config
            });
          } else {
            this.isCheckBoxRequired = true;
            this.editWholeDeal = false;
            this._error.throwError("Please choose any item");
          }
        } else {
          this.isCheckBoxRequired = true;
          this.editWholeDeal = false;
        }
      } else {
        let isChecckedArray = this.userArray.filter(x => x.isCheccked == true);
        this.editWholeDeal = true;
        this.userArray.forEach(x => {
          x.isRowEditable = false;
        });
        if (isChecckedArray.length > 0) {
          this.detectActionValue.emit({
            objectRowData: isChecckedArray,
            action: "saveAll",
            pageData: this.config
          });
        } else {
          this.isCheckBoxRequired = true;
          this.editWholeDeal = false;
          this._error.throwError("Please choose any item");
        }
      }
    }
  }
  cancelAll() {
    this.detectActionValue.emit({
      objectRowData: [true],
      action: "Canceled",
      pageData: this.config
    });
  }
  splitHeaderData() {
    this.fixedColumn = this.headerData.filter(x => x.isFixed == true);
    this.normalColumn = this.headerData.filter(x => x.isFixed == false);
    this.effort = this.headerData.filter(x => x.isSum)[0];
  }
  getClassByValue(index) {
    //'first_text stickyFirstColEdit d-flex' : 'fixed'j+1 'row_ellipses' fixedColumn[j]?.className
    var customClassName = this.fixedColumn[index].className
      ? this.fixedColumn[index].className
      : "";
    switch (index) {
      case 0:
        return "first_text stickyFirstColEdit";
      case 1:
        return "fixed2 row_ellipses" + customClassName;
      case 2:
        return "fixed3 row_ellipses" + customClassName;
      case 3:
        return "fixed4 row_ellipses" + customClassName;
    }
  }
  loadTableData(item, i) {
    this.headerData.forEach((element, i) => {
      switch (element.controltype) {
        case "select":
          {
            //item[element.name].name=item[element.name].id=="-1"?'NA':item[element.name].name;
            if (item[element.name].id == "") {
              item[element.name].id = "-1";
            }
            item[element.allias] = item[element.name].name
              ? item[element.name].name.toLowerCase()
              : "NA";
          }
          break;

        case "autocomplete":
          {
            if (element.relationship) {
              if (item[element.relationship]) {
                item[element.name] = { id: "-1", name: "NA" };
              }

              item[element.allias] = item[element.name].name
                ? item[element.name].name.toLowerCase()
                : "NA";
            } else {
              //  item[element.name].name = item[element.name].id=="-1"?'NA':item[element.name].name;
              item[element.allias] = item[element.name].name
                ? item[element.name].name.toLowerCase()
                : "NA";
            }
          }
          break;
        case "date":
          {
            item[element.name] = item[element.name];
          }
          break;
        case "cascadingDrop":
          {
            if (item[element.name].id == "") {
              item[element.name].id = "-1";
            }
            item[element.allias] = item[element.name].name
              ? item[element.name].name.toLowerCase()
              : "NA";
            // item[element.cascade]=[item[element.name]];
            if (this.ConfigData[element.name] && item[element.dependency]) {
              item[element.cascade] = this.ConfigData[element.name].filter(
                x => x[element.matchingCode] == item[element.dependency].id
              );
            } else {
              item[element.cascade] = [item[element.name]];
            }
          }
          break;
        case "cascadingAuto":
          {
            if (element.relationship) {
              if (item[element.relationship]) {
                item[element.name] = { id: "-1", name: "NA" };
              }

              item[element.allias] = item[element.name].name
                ? item[element.name].name.toLowerCase()
                : "NA";
            } else {
              //  item[element.name].name = item[element.name].id=="-1"?'NA':item[element.name].name;
              item[element.allias] = item[element.name].name
                ? item[element.name].name.toLowerCase()
                : "NA";
            }
            item[element.cascade] = [];
          }
          break;
      }

      if (element.IsRequired) {
        item[element.validation] = false;
      }
      if (element.initalDropLoad) {
        item[element.initalDropLoad] = true;
      }
    });
    if (!this.AddnewRow) {
      item.isCheccked = false;
      item.isRowEditable = false;
      item.IsRowError = false;
      item.isNewRow = false;
    } else {
      this.isCheckBoxRequired = true;
      this.editWholeDeal = false;
    }
  }

  loadInitials() {
    this.TableCollection.forEach((element: any, i) => {
      this.loadTableData(element, i);
      /* for sprint 3 initials ends*/
    });
  }

  /** Editable table ngOnChanges starts here */
  ngOnChanges(simpleChanges: SimpleChanges) {
    console.log("in on changes", this.AddnewRow);
    if (this.IsinitialsLoading) {
      // if (this.TableCollection[0][this.headerData[0].name] != null) {
      this.loadInitials();
      this.isLoading = false;
      if (this.AddnewRow) {
        this.editWholeDeal = false;
      } else {
        this.editWholeDeal = true;
      }
      this.selectedAll = this.TableCollection.every(x => x.isRowEditable);
      this.userArray = this.TableCollection;
      this.updateVerticalTableData();
      // this.userArray.forEach((element: any, index) => {
      //   element.isCheccked = false;
      //   // element[this.headerData[0].name] = element[this.headerData[0].name].toLowerCase()
      // });
      // } else {
      //   this.isLoading = false;
      //   this.userArray = [];
      //   //this.config.totalItems = 0;
      // }
      return;
    }
  }
  /** Editable table ngOnChanges ends here */

  /** April15**/
  clearRowData(rowData) {
    this.userArray = this.userArray.map(x => {
      if (x.id == rowData.id) {
        x = this.userdat.editableCachedRow;
      }
      x.isRowEditable = false;
      return x;
    });
    rowData.isRowEditable = false;
    // this.tempRowData={};
  }
  ngAfterViewInit() {
    this.isLoading = false;
  }

  // table starts
  selectAll() {
    for (var i = 0; i < this.userArray.length; i++) {
      this.userArray[i].isCheccked = this.selectedAll;
    }
    this.userdat.tableRecordsChecked = this.selectedAll;
    this.isTableRowChecked = this.selectedAll;
    this.userArray.forEach(x => {
      x.isRowEditable = this.selectedAll;
      return x;
    });
  }

  checkIfAllSelected(index, tableData) {
    var count = 0;
    for (var i = 0; i < this.userArray.length; i++) {
      if (this.userArray[i].isCheccked == true) {
        count++;
      }
      if (this.userArray.length == count) {
        this.selectedAll = true;
      } else {
        this.selectedAll = false;
      }
    }
    tableData.isRowEditable = !tableData.isRowEditable;
    this.isTableRowChecked = count > 0 ? true : false;
    if (count > 1) {
      this.userdat.tableRecordsChecked = true;

      // this.checkname = this.TableName;
    } else {
      this.userdat.tableRecordsChecked = false;
    }
  }

  // search box
  expand = false;
  noRecordsFound = false;
  /** Search, Alpha sort and checkbox select all logic ends here */

  /** Filter header related logic  starts here*/
  //filter starts
  check: boolean = false;
  searchitem;
  selectall;
  headerName;

  titleShow(name, index) {
    this.headerName = name;
  }
  checkforDisable(value, isDecs: boolean, tableData, items) {
    // console.log('check for ', tableData)
    if (isDecs == true) {
      if (value != undefined && value != null && value != "NA") {
        return null;
      } else {
        //  tableData["CountValue"] = tableData["MinNumofUnits"];
        return "disabled";
      }
    } else {
      if (!items.disable) {
        return null;
      }
      if (this.isBillingDisable) {
        //return "disabled";
        return this.isBillingDisable.isbillingYN ? "disabled" : null;
      } else {
        return null;
      }

    }

  }
  generateNewRowDataRLS() {
    if (!this.isIP) {
      var timestamp = new Date().getUTCMilliseconds();
      var currentIndex = this.userArray[this.userArray.length - 1].index;
      var mydata = JSON.parse(JSON.stringify(this.tempNewAddMember[0]));
      mydata.index = currentIndex + 1;
      mydata.id = "$tNR" + timestamp.toString();
      mydata.isRowEditable = true;
      mydata.RowEditable = true;
      mydata.isCheccked = true;
      mydata.isNewRow = true;
      mydata["!GCG_CATNAME"] = true;
      if (mydata["TYPE"] == "") {
        mydata["TYPE"] = this.userArray[this.userArray.length - 1].TYPE;
      }
      this.userArray.push(mydata);
      this.isTableRowChecked = true;
      this.editWholeDeal = false;
      this.isCheckBoxRequired = true;
      this.selectedAll = this.userArray.every(x => x.isRowEditable);
      // this.userArray=updatedData.map(x=>{x.isRowEditable=true;return x});
      //  tempNewAddMember
    } else {
      this.detectActionValue.emit({
        objectRowData: [],
        action: "AddIP",
        pageData: this.config
      });
    }
  }
  copyTableRows() {
    var copyData = JSON.parse(
      JSON.stringify(this.userArray.filter(x => x.isCheccked))
    );
    console.log("Cheeck", copyData);
    var currentIndex = this.userArray[this.userArray.length - 1].index;
    copyData.forEach((element, i) => {
      var timestamp = new Date().getUTCMilliseconds();
      element.id = "$tNR" + timestamp.toString();
      element.index = currentIndex + i + 1;
      element.isNewRow = true;
      element.lidisplayid = 0;
      return element;
    });
    this.userArray = this.userArray.concat(copyData);
    this.isTableRowChecked = true;
    this.updateVerticalTableData();
  }
  deleteTableRow() {
    // var deletedRecords = this.userArray.filter(x => x.isCheccked);
    if (!this.isIP) {
      var deleteRecords = this.userArray.filter(x => x.isCheccked);
      // this.userArray = this.userArray.filter(x => !x.isCheccked);
      var originalRecors = deleteRecords.filter(x => !x.isNewRow);
      if (originalRecors.length > 0) {
        this.detectActionValue.emit({
          objectRowData: originalRecors,
          action: "delete",
          pageData: this.config
        });
      } else {
        this.userArray = this.userArray.filter(x => !x.isCheccked);
        this.userArray.forEach((x, i) => {
          x.index = i + 1;
          return x;
        });
        this.updateVerticalTableData();
      }
    } else {
      var deleteRecords = this.userArray.filter(x => x.isCheccked);
      this.detectActionValue.emit({
        objectRowData: deleteRecords,
        action: "delete",
        pageData: this.config
      });
    }
  }
  stop(e) {
    e.stopImmediatePropagation();
  }
  checkDataApiCall(tableData, headerObj) {
    if (headerObj.initalDropLoad) {
      if (tableData[headerObj.initalDropLoad]) {
        this.detectActionValue.emit({
          objectRowData: [
            {
              data: tableData,
              key: headerObj.name
            }
          ],
          action: "InitialLoad",
          pageData: this.config
        });
      }
    }
  }
  loadCascadeData(tableData, headerObj) {
    // if(this.headerData.filter(x=>x.dependency==headerObj.name))
    console.log(tableData, "tableData");
    console.log(headerObj, "headerObj");
    var myHeaderName = headerObj.name;
    if (tableData["ModuleCode"]) {
      let filteredData = this.ConfigData["ModuleCode"].filter(
        x => x.id == tableData["ModuleCode"].id
      );
      if (filteredData.length > 0) {
        tableData["MinNumofUnits"] = filteredData[0]["MinUnits"];
        tableData["CountDesc"] = filteredData[0]["CountDesc"];
        tableData["DurationDesc"] = filteredData[0]["DurationDesc"];
        // tableData["CountValue"] = 0;
        // tableData["DurationValue"] = 0;
        if (tableData["DurationDesc"] == "NA") {
          tableData["MinNumofDuration"] = "0";
        } else {
          tableData["MinNumofDuration"] = "0.1";
        }
      }
    }
    if (headerObj.name == "ROLE") {
      this.detectActionValue.emit({
        objectRowData: [
          {
            data: tableData,
            key: headerObj.name
          }
        ],
        action: "Skill_changed",
        pageData: this.config
      });
    }
    if (headerObj.name == "SERVICELINENAME") {
      this.detectActionValue.emit({
        objectRowData: [
          {
            data: tableData,
            key: headerObj.name
          }
        ],
        action: "Skill_changed",
        pageData: this.config
      });
    }
    if (headerObj.name == "SKILL") {
      this.detectActionValue.emit({
        objectRowData: [
          {
            data: tableData,
            key: headerObj.name
          }
        ],
        action: "Skill_changed",
        pageData: this.config
      });
    }
    if (headerObj.name == "TYPE") {
      this.detectActionValue.emit({
        objectRowData: [
          {
            data: tableData,
            key: headerObj.name
          }
        ],
        action: "Skill_changed",
        pageData: this.config
      });
    }

    this.headerData.forEach(element => {
      if (element.dependency) {
        if (
          element.dependency == myHeaderName ||
          element.dependency == headerObj.name
        ) {
          tableData[element.name].id = "-1";
          tableData[element.name].name = "";
          if (
            element.controltype == "cascadingDrop" ||
            element.controltype == "cascadingAuto"
          ) {
            if (this.ConfigData[element.name]) {
              tableData[element.cascade] = this.ConfigData[element.name].filter(
                x => x[element.matchingCode] == tableData[element.dependency].id
              );
            }
          }

          myHeaderName = element.name;
        }
      }
      if (element.isDisable) {
        if (!tableData[element.isDisable]) {
          element.IsRequired = true;
        }
      }
      if (element.name == "GCG_CATNAME" && headerObj.name == "SKILL") {
        console.log(tableData, "tableData");
        console.log("2222222222");
        if (tableData["SKILL"].IsConsulting == true) {
          tableData[element.isDisable] = false;
          element.IsRequired = true;
        } else {
          if (tableData["GCG_CATNAME"]) {
            tableData["GCG_CATNAME"].id = "-1";
            tableData["GCG_CATNAME"].name = "";
            tableData[element.isDisable] = true;
            element.IsRequired = false;
          }
        }
      }
    });

    tableData[headerObj.name].id =
      tableData[headerObj.name].id == "-1" ? "" : tableData[headerObj.name].id;
    if (this.ConfigData[headerObj.name]) {
      tableData[headerObj.name].name = this.ConfigData[headerObj.name].filter(
        x => x.id == tableData[headerObj.name].id
      )[0].name;
      tableData[headerObj.allias] = tableData[headerObj.name].name;
    } else {
      tableData[headerObj.name].name = tableData[headerObj.cascade].filter(
        x => x.id == tableData[headerObj.name].id
      )[0].name;
      tableData[headerObj.allias] = tableData[headerObj.name].name;
    }
  }
  loadCascadeAutoComplete(tableData, headerObj, key) {
    // if (key.length > 2) {
    if (headerObj.name == "LANGUAGESKILL") {
      tableData[headerObj.cascade] = this.ConfigData[headerObj.name].filter(x =>
        x["name"] ? x["name"].toLowerCase().includes(key.toLowerCase()) : false
      );
    } else {
      if (headerObj.matchingCode) {
        tableData[headerObj.cascade] = this.ConfigData[headerObj.name]
          .filter(
            x => x[headerObj.matchingCode] == tableData[headerObj.dependency].id
          )
          .filter(x =>
            x["name"]
              ? x["name"].toLowerCase().includes(key.toLowerCase())
              : false
          );
      } else {
        tableData[headerObj.cascade] = this.ConfigData[
          headerObj.name
        ].filter(x =>
          x["name"]
            ? x["name"].toLowerCase().includes(key.toLowerCase())
            : false
        );
      }
    }

    console.log(tableData[headerObj.cascade]);
    // }
  }
  checkforRoweditable() {
    return this.userArray.every(x =>
      x.RowEditable ? x.RowEditable == true : false
    );
  }
  refreshUpdateEffort(tableData) {
    let horlAddition = 0;
    this.headerData.forEach(element => {
      if (element.isVar) {
        horlAddition = this.addData(horlAddition, tableData[element.name]);
      }
    });
    tableData[this.effort.name] = horlAddition;
  }
  refreshUpdateData(data) {
    //startId: "26", endId: "42", value: 20
    this.userArray
      .filter(x => x.isCheccked)
      .forEach(item => {
        this.headerData
          .filter(
            x =>
              Number(x.id) >= Number(data.startId) &&
              Number(x.id) <= Number(data.endId)
          )
          .forEach(element => {
            item[element.name] = data.value;
          });
        this.refreshUpdateEffort(item);
      });
    console.log(this.userArray);
    this.updateVerticalTableData();
  }
  generalSelectedAction(actionItem, actionRecieved) {
    this.detectActionValue.emit({
      objectRowData: [actionItem],
      action: actionRecieved,
      pageData: this.config
    });
    console.log({ objectRowData: [actionItem], action: actionRecieved });
  }
  openPeriod(): void {
    const dialogRef = this.dialog.open(SelectPeriodPopup, {
      width: "390px"
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.refreshUpdateData(res);
        console.log("update period pop up", res);
      }
    });
  }
  ngOnDestroy() {
    this.pastDeal$.unsubscribe();
  }
}
@Component({
  selector: "app-select-period",
  templateUrl: "./period-popup.html",
  styleUrls: [
    "../editable-expansion-table/editable-expansion-table.component.scss"
  ]
})
export class SelectPeriodPopup {
  startPeriodList: Array<any> = [];
  endPeriodList: Array<any> = [];
  startId: any = "";
  endId: any = "";
  periodValue: any = "";
  regexDecWithNegative = "^[-]?[0-9]{0,900}(?:.[0-9]{0,900})?$";
  regexNegativeDecimal = new RegExp(this.regexDecWithNegative);

  constructor(
    private router: Router,
    public userdat: DataCommunicationService,
    public dialogRef: MatDialogRef<SelectPeriodPopup>,
    private snackBar: MatSnackBar,
    public _error: ErrorMessage,
    public _validate: ValidateforNullnUndefined
  ) { }
  ngOnInit() {
    console.log("this.userdat.cachedArray", this.userdat.cachedArray);
    this.userdat.cachedArray.map(x => {
      if (x.isVar) {
        this.startPeriodList.push(x);
      }
    });
  }
  fillEndperiod() {
    this.endPeriodList = this.startPeriodList.filter(
      x => Number(x.id) > Number(this.startId)
    );
  }
  updatePeriod(status: boolean) {
    if (status) {
      let finalObj = {
        startId: this.startId,
        endId: this.endId,
        value: this.periodValue
      };
      if (
        this._validate.validate(this.startId) &&
        this._validate.validate(this.endId) &&
        this._validate.validate(this.periodValue)
      ) {
        this.dialogRef.close(finalObj);
      } else if (!this.regexNegativeDecimal.test(this.periodValue)) {
        this._error.throwError("Please enter valid input");
      } else {
        this._error.throwError("Please fill required fields.");
      }
    } else {
      this.dialogRef.close();
    }
  }
}
