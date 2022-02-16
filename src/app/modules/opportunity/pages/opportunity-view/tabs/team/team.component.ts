import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { DataCommunicationService } from '@app/core/services/global.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { teamService, OpportunitiesService, headerteamopportunity } from '@app/core/services';
import { Observable, Subject, of } from 'rxjs';
import { NgForm } from '@angular/forms';
import { EditableExpansionTableComponent } from '@app/shared/components/editable-expansion-table/editable-expansion-table.component';
import { DatePipe } from '@angular/common';
import { ConfirmSaveComponent } from '../../opportunity-view.component';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {

  @ViewChild('myForm') public userFrm: NgForm;
  @ViewChild(EditableExpansionTableComponent) EditableExpansionTableComponent;
  OpportunityTeamsTable = [];
  wipro_endDateOptions = [];
  wipro_timeAllocationPerWeek = [];
  sbuId: string = '68c4eb75-7250-e911-a830-000d3aa058cb';
  verticalId: string = '3a35f187-7250-e911-a830-000d3aa058cb';
  opportunityId: string = '11750929-197d-e911-a831-000d3aa058cb';
  isLoading: boolean = false;
  accessData: any;
  isReadOnly = false;
  hideAddNewMember = false;
  hideSort = false;
  serviceSearch = true;
  isFullAccess = false;
  opportunityStatus = "";
  headerArray = [];
  orderCreatedCheck: boolean = false;
  sbuOwnerName: string = '';
  verticalOwnerName: string = '';
  salesHeadName: string = '';
  teamBuilderRoles = [];
  activeEmployees = [];
  teamBuilderList = [];
  configData = {
    name: "Accounts",
    recordsCount: 5,
    Username: [],
    Role: [],
    Geo: [],
    SAPcustomername: [],
    verticalOwnerName: '',
    isFilterLoading: false
  };
  subscription;
  subscriptionMoreOptions;
  teamSubscription;
  tableTotalCount: number;
  pageSize = 10;
  requestedPageNumber = 1;
  paginationPageNo = {
    "PageSize": 10,
    "RequestedPageNumber": 1,
    "OdatanextLink": ""
  }

  /** Global filter Config */

  filterConfigData = {
    Role: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Username: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    SAPcustomercode: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    SAPcustomername: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Geo: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    isFilterLoading: false
  };
  searchText;
  startFilterDate = ''
  endFilterDate = ''

  datePipe = new DatePipe("en-US");
  AllTeamsRequestbody: any = {
    "PageSize": this.teamsvc.sendPageSize || 50,
    "RequestedPageNumber": this.teamsvc.sendPageNumber || 1,
    "OdatanextLink": "",
    "FilterData": this.teamsvc.sendConfigData || []
  }
 //validation flags
 isDataValid = true;
 selfTagged = true;
 isEditStage = 0;
 isAddStage = 0;
 isDealOwnerTagged = false;
  constructor(
    public router: Router, public service: DataCommunicationService, public dialog: MatDialog, public teamsvc: teamService,
     public projectService: OpportunitiesService) {
    this.addUpdTeamBuilder = this.addUpdTeamBuilder.bind(this);
    this.eventSubscriber(this.service.subscription, this.addUpdTeamBuilder);

    this.ngOnInit = this.ngOnInit.bind(this);
    this.eventSubscriber1(this.projectService.subscriptionMoreOptions, this.ngOnInit);


    this.ngOnInit = this.ngOnInit.bind(this);
    this.eventSubscriber2(this.projectService.teamSubscription, this.ngOnInit);
  }


  ngOnInit() {
    debugger;
    this.opportunityId = this.projectService.getSession('opportunityId');
    this.sbuId = this.projectService.getSession('sbuId');
    this.verticalId = this.projectService.getSession('verticalId');
    this.opportunityStatus = this.projectService.getSession('opportunityStatus');
    this.orderCreatedCheck = this.projectService.getSession('ordercreated')
    let currentState = this.projectService.getSession('currentState') ? this.projectService.getSession('currentState').toString() : '';
    this.service.getTableData('OpportunityTeams').subscribe(res => {
      this.headerArray = res;
    });
    if (this.opportunityStatus.toString() == '1' && (!this.orderCreatedCheck || currentState != "184450004") && this.projectService.getSession('IsAppirioFlag') == false) {
      this.isFullAccess = this.projectService.getSession('FullAccess');
      if (this.isFullAccess == true) {
        this.isReadOnly = false;
        this.isReadOnly = false;
        this.hideAddNewMember = false;
        this.hideSort = false;
        this.serviceSearch = true;
        this.headerArray.forEach(item => {
          item.hideFilter = false;
          if (item.name == 'Request' || item.name == 'Delivery') {
            item.controltype = 'switch';
            item.toggleSwitch = true;
            item.hideFilter = true;
          }
          if (item.name == 'SAPcustomername') {
            item.hideFilter = true;
          }
        })
      }
      else {
        this.accessData = this.projectService.getSession('roleObj');
        if (this.accessData) {
          if (this.accessData.PartialAccess == true) {
            // if(this.accessData.PartialAccessObj.TeamBuilderSection == true) {
            this.isReadOnly = false;
            this.hideAddNewMember = false;
            this.hideSort = false;
            this.serviceSearch = true;
            this.headerArray.forEach(item => {
              item.hideFilter = false;
              if (item.name == 'Request' || item.name == 'Delivery') {
                item.controltype = 'switch';
                item.toggleSwitch = true;
                item.hideFilter = true;
              }
              if (item.name == 'SAPcustomername') {
                item.hideFilter = true;
              }
            })
          }
          else {
            if (this.accessData.IsTeamBuilderSection == true) {
              this.isReadOnly = false;
              this.hideAddNewMember = false;
              this.hideSort = false;
              this.serviceSearch = true;
              this.headerArray.forEach(item => {
                item.hideFilter = false;
                if (item.name == 'Request' || item.name == 'Delivery') {
                  item.controltype = 'switch';
                  item.toggleSwitch = true;
                  item.hideFilter = true;
                }
                if (item.name == 'SAPcustomername') {
                  item.hideFilter = true;
                }
              })
            }
            else {
              this.isReadOnly = true;
              this.hideAddNewMember = true;
              this.hideSort = true;
              this.serviceSearch = false;
              this.headerArray.forEach(item => {
                item.hideFilter = true;
                if (item.controltype == 'switch') {
                  item.controltype = 'text';
                  delete item.toggleSwitch
                }
              })
            }
          }
        }
      }
    }
    else {
      this.isReadOnly = true;
      this.hideAddNewMember = true;
      this.hideSort = true;
      this.serviceSearch = false;
      this.headerArray.forEach(item => {
        item.hideFilter = true;
        if (item.controltype == 'switch') {
          item.controltype = 'text';
          delete item.toggleSwitch
        }
      })
    }
    this.loadData();
    this.getSBUOwnerDetails();
    this.getVerticalOwnerDetails();
    this.getSalesHeadDetails();
  }

  ngAfterViewChecked() {
    if (this.userFrm.dirty) {
      this.service.dirtyflag = true;
    }
    else {
      this.service.dirtyflag = false;
    }
  }

  eventSubscriber(action: Subject<any>, handler: () => void, off: boolean = false) {
    if (off && this.subscription) {
      this.subscription.unsubscribe();
    } else {
      this.subscription = action.subscribe(() => handler());
    }
  }

  eventSubscriber1(action: Subject<any>, handler: () => void, off: boolean = false) {
    if (off && this.subscriptionMoreOptions) {
      this.subscriptionMoreOptions.unsubscribe();
    } else {
      this.subscriptionMoreOptions = action.subscribe(() => handler());
    }
  }

  eventSubscriber2(action: Subject<any>, handler: () => void, off: boolean = false) {
    if (off && this.teamSubscription) {
      this.teamSubscription.unsubscribe();
    } else {
      this.teamSubscription = action.subscribe(() => handler());
    }
  }

  ngOnDestroy(): void {
    this.eventSubscriber(this.service.subscription, this.addUpdTeamBuilder, true);
    this.eventSubscriber1(this.projectService.subscriptionMoreOptions, this.ngOnInit, true);
    this.eventSubscriber2(this.projectService.teamSubscription, this.ngOnInit, true);
  }

  //Function to capture child component actions
  performTableChildAction(childActionRecieved): Observable<any> {
    this.startFilterDate = ''
    this.endFilterDate = ''
    console.log(this.filterConfigData)
    if (childActionRecieved.filterData.filterColumn.SAPcustomercode && childActionRecieved.filterData.filterColumn.SAPcustomercode.length > 0) {
      this.startFilterDate = childActionRecieved.filterData.filterColumn.SAPcustomercode ? childActionRecieved.filterData.filterColumn.SAPcustomercode[0].filterStartDate.toLocaleString() : ''
      this.endFilterDate = childActionRecieved.filterData.filterColumn.SAPcustomercode ? childActionRecieved.filterData.filterColumn.SAPcustomercode[0].filterEndDate.toLocaleString() : ''
    }
    var actionRequired = childActionRecieved;
    console.log('actionReceived', actionRequired);
    this.filterConfigData.isFilterLoading = false;
    switch (actionRequired.action) {
      case 'isdeleteteammember': {
        const dialogRef = this.dialog.open(DeleteTeamMember,
          {
            width: '396px',
            data: actionRequired.objectRowData[0]
          });


        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.deleteTeamMember(actionRequired.objectRowData)
          }
        })
        return
      }
      case 'delete': {
        this.deleteMultipleData(actionRequired.objectRowData.data);
        return
      }
      case 'Username':
        {
          this.getActiveEmployees(actionRequired.objectRowData);
          return;
        }
      case 'addNewRow':
        {
          this.isAddStage--;
          if (this.teamBuilderList.length == 0) {
            this.OpportunityTeamsTable = this.teamBuilderList;
          }
          let obj = {
            "id": 'newrow-' + new Date().valueOf().toString(),
            "Username": actionRequired.objectRowData.row.Request == true ? { id: '00000000-0000-0000-0000-000000000000', name: 'Requested' } : actionRequired.objectRowData.row.Username,
            "OldEmailId": "",
            "OldTeamUserId": "",
            "Request": actionRequired.objectRowData.row.Request,
            "Role": actionRequired.objectRowData.row.Role,
            "SAPcustomercode": actionRequired.objectRowData.row.SAPcustomercode.toString(),
            "SAPcustomername": null,
            "Geo": actionRequired.objectRowData.row.Geo,
            "Delivery": actionRequired.objectRowData.row.Delivery,
            "stageObject": actionRequired.objectRowData.row.stageObject,
            "performanceDetails": [],
            "additionalComments": actionRequired.objectRowData.row.additionalComments,
            "createdOn": new Date(),
            "index": this.OpportunityTeamsTable.length + 1,
            "expansionData": [],
            "isDefault": false,
            "hideInitials": actionRequired.objectRowData.row.Request == true ? true : false,
            "deleteBtnVisibility": true,
            "editBtnVisibility": true,
            'moreBtnVisibility': true,
            "_roleDisabled":  actionRequired.objectRowData.row._roleDisabled
          }
          if (actionRequired.objectRowData.row.stageObject) {
            obj.SAPcustomername = actionRequired.objectRowData.row.SAPcustomerSelect;
          }
          else {
            obj.SAPcustomername = actionRequired.objectRowData.row.SAPcustomername.toString();
          }
          this.OpportunityTeamsTable.unshift(obj);
          this.OpportunityTeamsTable.forEach((item, i) => {
            item.index = i + 1;
          })
          this.tableTotalCount = this.tableTotalCount + 1;
          this.userFrm.form.markAsDirty();
          return;
        }
      case 'update':
        this.isEditStage--;
        {
          if (actionRequired.objectRowData.row.stageObject) {
            actionRequired.objectRowData.row.SAPcustomerSelect.name = this.wipro_endDateOptions.filter(it => it.id == actionRequired.objectRowData.row.SAPcustomerSelect.id)[0].name;
          }
          if (actionRequired.objectRowData.row.Request == true) {
            actionRequired.objectRowData.row.Username = {
              id: '00000000-0000-0000-0000-000000000000',
              name: 'Requested'
            }
            actionRequired.objectRowData.row.hideInitials = true;
          }
          else {
            actionRequired.objectRowData.row.hideInitials = false;
          }
          if (actionRequired.objectRowData.row.stageObject) {
            actionRequired.objectRowData.row.SAPcustomername = actionRequired.objectRowData.row.SAPcustomerSelect;
          }
          else {
            actionRequired.objectRowData.row.SAPcustomername = actionRequired.objectRowData.row.SAPcustomername.toString();
          }
          const index = this.OpportunityTeamsTable.findIndex(item => item.id === actionRequired.objectRowData.row.id);
          console.log(index);
          if (index !== -1) {
            this.OpportunityTeamsTable[index] = actionRequired.objectRowData.row;
          }
          return;

        }
      case 'openSummary': {
        this.getSummary(actionRequired.objectRowData);
        return;
      }

      case 'newRowAdded': {
        this.isAddStage++;
        let estClosureDate = new Date(this.projectService.getSession('estDate')).toLocaleDateString();
        if (Date.parse(estClosureDate) < Date.parse(new Date().toLocaleDateString())) {
          this.projectService.displayMessageerror('Estimated closure date is past date. Please change the Estimated closure date in summary or overview page to add new member.');
        }
        this.userFrm.form.markAsDirty();
        return;
      }

      case 'newRowDiscarded': {
        this.isAddStage--;
        this.userFrm.form.markAsPristine();
        return;
      }
      case 'rowEdited': {
        this.isEditStage++;
        this.userFrm.form.markAsDirty();
        return;
      }
      case 'editDiscarded': {
        this.isEditStage--;
        this.OpportunityTeamsTable = actionRequired.objectRowData;
        this.userFrm.form.markAsPristine();
        return;
      }

      case 'bulkRowEdited': {
        this.isEditStage = actionRequired.objectRowData;
        this.userFrm.form.markAsDirty();
        return;
      }

      case 'bulkRowCanceled': {
        this.isEditStage = 0;
        this.userFrm.form.markAsPristine();
        return;
      }

      case 'search': {
    this.searchText = actionRequired.objectRowData ? actionRequired.objectRowData : '';

        this.paginationPageNo = {
          "PageSize": actionRequired.pageData.itemsPerPage,
          "RequestedPageNumber": 1,
          "OdatanextLink": ""
        }
        this.AllTeamsRequestbody = {
          "PageSize": actionRequired.pageData.itemsPerPage,
          "RequestedPageNumber": 1,
          "OdatanextLink": "",
          "FilterData": this.teamsvc.sendConfigData || []
        }

        if (this.service.checkFilterListApiCall(childActionRecieved)) {
          // filter api call
          this.CallListDataWithFilters(childActionRecieved);
          return;

        } else {
          this.getTeamBuilderList(actionRequired.pageData.itemsPerPage.toString(), this.requestedPageNumber.toString(), actionRequired.objectRowData);
          return;
        }
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
      case 'sortHeaderBy': {
        debugger;
        this.paginationPageNo = {
          "PageSize": actionRequired.pageData.itemsPerPage,
          "RequestedPageNumber": 1,
          "OdatanextLink": ""
        }
        this.AllTeamsRequestbody = {
          "PageSize": actionRequired.pageData.itemsPerPage,
          "RequestedPageNumber": 1,
          "OdatanextLink": "",
          "FilterData": this.teamsvc.sendConfigData || []
        }
        this.CallListDataWithFilters(childActionRecieved);
        return;
      }

      case 'Role': {
        var temp = [];
        temp = this.OpportunityTeamsTable.filter(it => it.Role.id == childActionRecieved.objectRowData.Role.id && childActionRecieved.objectRowData.id != it.id);
        if (temp.length > 0) {
          let message = "Role " + '"' + temp[0].Role.name + '"' + " cannot be duplicated. Please ensure to tag only one user for this role";
          this.projectService.displayMessageerror(message);
          childActionRecieved.objectRowData.Role.id = '-1';
          childActionRecieved.objectRowData.Role.name = '';
        }
        else {
          this.checkForDuplicateRoles(childActionRecieved);
        }
        return;
      }
    }
  }

  //vaidation for duplicate roles on change of role dropdown
  checkForDuplicateRoles(childActionRecieved) {
    if (childActionRecieved.objectRowData.Role) {
      let teamBuilderIds = [];
      this.OpportunityTeamsTable.forEach(item => {
        if (item.id.indexOf('newrow') == -1) {
          teamBuilderIds.push(item.id);
        }

      })
      this.teamsvc.checkDuplicateRoles(childActionRecieved.objectRowData.Role.id, this.opportunityId, teamBuilderIds).subscribe(res => {
        console.log("checkDuplicate response", res);
        if (!res.IsError) {
          if (res.ResponseObject == true) {
            //duplicate is present update error message
            let message = "Role " + '"' + childActionRecieved.objectRowData.Role.name + '"' + " cannot be duplicated. Please ensure to tag only one user for this role";
            this.projectService.displayMessageerror(message);
            childActionRecieved.objectRowData.Role.id = '-1';
            childActionRecieved.objectRowData.Role.name = '';
          }
          else {
            if(childActionRecieved.objectRowData.Role.name && childActionRecieved.objectRowData.Role.name.toUpperCase() == 'DEAL OWNER')
            {
              childActionRecieved.objectRowData._roleDisabled = true;
              childActionRecieved.objectRowData.Request = false,
              childActionRecieved.objectRowData.SAPcustomercode = "";
              childActionRecieved.objectRowData.SAPcustomername =  "";
              childActionRecieved.objectRowData['&SAPcustomername'] = false;
              childActionRecieved.objectRowData['&SAPcustomercode'] = false;
              childActionRecieved.objectRowData.Geo = {
                 id : '-1',
                 name : ''
               },
              childActionRecieved.objectRowData['&Geo'] = false;

               childActionRecieved.objectRowData.Delivery = false;
               childActionRecieved.objectRowData.stageObject = false;
               childActionRecieved.objectRowData.IsRowError = false;
            }
            else {
              childActionRecieved.objectRowData._roleDisabled = false;
            }
          }
        }
        else
          this.projectService.displayMessageerror(res.Message);
      },
        err => {
          this.projectService.displayerror(err.status);
        });
    }
  }

  GetColumnSearchFilters(data) {
    let headerName = data.filterData.headerName
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
        this.filterConfigData[headerName].PageNo = 1
        this.filterConfigData[headerName].data = []
        this.filterConfigData[headerName].NextLink = ''
        this.generateFilterConfigData(data, headerName, false, this.CheckFilterServiceFlag(data, headerName))
      } else {
        if (data.filterData.isApplyFilter && this.service.CheckFilterFlag(data)) {
          this.AllTeamsRequestbody.OdatanextLink = ''
          this.AllTeamsRequestbody.RequestedPageNumber = 1
          this.AllTeamsRequestbody.PageSize = this.paginationPageNo.PageSize
          this.CallListDataWithFilters(data)
        } else {
          this.AllTeamsRequestbody.OdatanextLink = '';
          this.AllTeamsRequestbody.RequestedPageNumber = 1;
          this.AllTeamsRequestbody.PageSize = this.paginationPageNo.PageSize
          this.getTeamBuilderList(this.pageSize.toString(), this.requestedPageNumber.toString(), '');
        }
      }
    }
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

  generateFilterConfigData(data, headerName, isConcat, isServiceCall?) {

    if (isServiceCall) {
      let useFulldata = {
        opportunityId: this.opportunityId,
        headerName: headerName,
        searchVal: data.filterData.columnSerachKey,
        pageNo: this.filterConfigData[headerName].PageNo,
        pageSize: 10,
        nextLink: this.filterConfigData[headerName].NextLink,
        searchText: this.searchText ? this.searchText : ''
      }
      this.teamsvc.getContactListConfigData({ ...data, useFulldata: useFulldata, columnFIlterJson: this.GetTeamAppliedFilterData(data) }).subscribe(res => {
        this.filterConfigData.isFilterLoading = false;
        this.filterConfigData[headerName] = {
          data: (isConcat) ? this.filterConfigData[headerName]["data"].concat(res.ResponseObject) : res.ResponseObject,
          recordCount: res.TotalRecordCount,
          NextLink: res.OdatanextLink,
          PageNo: this.filterConfigData[headerName].PageNo
        }

        data.filterData.filterColumn[headerName].forEach(res => {

          let index;
          index = this.filterConfigData[headerName].data.findIndex(x => x.id == res.id);
          if (index !== -1) {
            this.filterConfigData[headerName].data[index].isDatafiltered = true
          }
        });


      });
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

  GetAppliedFilterData(data) {
    return {
      "Guid": this.opportunityId,
      "SearchText": data.filterData.globalSearch,
      "PageSize": this.AllTeamsRequestbody.PageSize,
      "RequestedPageNumber": this.AllTeamsRequestbody.RequestedPageNumber,
      "RoleNames": this.service.pluckParticularKey(data.filterData.filterColumn['Role'], 'name'),
      "Requests": [],
      "NameSources": this.service.pluckParticularKey(data.filterData.filterColumn['Username'], 'id'),
      "StartFromDate": this.startFilterDate ? (this.datePipe.transform(this.startFilterDate, "yyyy-MM-dd")) : undefined,
      "StartToDate": this.endFilterDate ? (this.datePipe.transform(this.endFilterDate, "yyyy-MM-dd")) : undefined,
      "EndDates": [],
      "TimeAllocations": this.service.pluckParticularKey(data.filterData.filterColumn['Geo'], 'id'),
      "Deliverys": [],
      "OdatanextLink": this.AllTeamsRequestbody.OdatanextLink,
      "IsActive": true,
      "IsDesc": (data.filterData.sortColumn != '') ? !data.filterData.sortOrder : false,
      "SortBy": this.service.pluckParticularKey(headerteamopportunity.filter(x => x.name == data.filterData.sortColumn), 'SortId')[0],
    }
  }

  GetTeamAppliedFilterData(data) {
    return {
      "RoleNames": this.service.pluckParticularKey(data.filterData.filterColumn['Role'], 'name'),
      "Requests": [],
      "NameSources": this.service.pluckParticularKey(data.filterData.filterColumn['Username'], 'id'),
      "StartFromDate": this.startFilterDate ? (this.datePipe.transform(this.startFilterDate, "yyyy-MM-dd")) : undefined,
      "StartToDate": this.endFilterDate ? (this.datePipe.transform(this.endFilterDate, "yyyy-MM-dd")) : undefined,
      "EndDates": [],
      "TimeAllocations": this.service.pluckParticularKey(data.filterData.filterColumn['Geo'], 'id'),
      "Deliverys": [],
    }
  }


  CallListDataWithFilters(data) {
    console.log(data)
    let reqparam = this.GetAppliedFilterData({ ...data })
    console.log("reqparam", reqparam);
    this.teamsvc.getAppliedFilterActionData(reqparam).subscribe(res => {
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
          this.getTableFilterData(res.ResponseObject, reqparam.RequestedPageNumber, reqparam.PageSize)

          this.AllTeamsRequestbody.OdatanextLink = res.OdatanextLink
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.OpportunityTeamsTable = [{}]
          this.tableTotalCount = 0
        }
      } else {
        this.OpportunityTeamsTable = [{}]
        this.tableTotalCount = 0
        this.projectService.displayMessageerror(res.Message);
      }
    });
  }

  getTableFilterData(tableData, pageNo, pageSize): Array<any> {
    if (tableData) {
      if (tableData.length > 0) {
        var tableCollection = tableData.map((item, index) => {
          return {
            "id": item.OppoTeamBuilderId,
            "Username": {
              "id": item.TeamMemberDetails ? item.TeamMemberDetails.split(",")[1] : '-',
              "name": item.WiproRequest ? 'Requested' : item.TeamMemberDetails ? item.TeamMemberDetails.split(",")[0] : '-',
              "designation": "",
              "initials": "",
              "value": false
            },
            "Request": item.WiproRequest,
            "Role": {
              "id": item.WiproRoleBind.RoleId,
              "name": item.WiproRoleBind.RoleName
            },
            "SAPcustomercode": item.WiproStartdate ? this.datePipe.transform(new Date(item.WiproStartdate.slice(0, 4), Number(item.WiproStartdate.slice(5, 7)) - 1, item.WiproStartdate.slice(8, 10)).setHours(0, 0, 0, 0), "yyyy-MM-dd'T'HH:mm:ss.SSSSSSS'Z'") : '-',
            "SAPcustomername": (item.Selectstage) ? {
              "id": item.StatusId.toString(),
              "name": this.wipro_endDateOptions.filter(x => x.id === item.StatusId)[0] ? this.wipro_endDateOptions.filter(x => x.id === item.StatusId)[0].name : '-',
              "designation": "",
              "initials": "",
              "value": false
            } : item.WiproEnddate ? this.datePipe.transform(new Date(item.WiproEnddate.slice(0, 4), Number(item.WiproEnddate.slice(5, 7)) - 1, item.WiproEnddate.slice(8, 10)).setHours(0, 0, 0, 0), "yyyy-MM-dd'T'HH:mm:ss.SSSSSSS'Z'") : '-',
            "Geo": { id: item.TimeAllocatedPerWeek.toString(), name: this.wipro_timeAllocationPerWeek.filter(x => x.id == item.TimeAllocatedPerWeek)[0].name },
            "Delivery": item.WiproDelivery,
            "stageObject": item.Selectstage,
            "performanceDetails": [],
            "additionalComments": item.AdditionalComments,
            "createdOn": item.Createdon,
            "index": index + 1,
            "expansionData": [],
            "isDefault": item.IsDefault ? item.IsDefault : false,
            "hideInitials": item.WiproRequest,
            "deleteBtnVisibility": this.isReadOnly ? false : item.IsDefault ? false : true,
            "editBtnVisibility": this.isReadOnly ? false : true,
            'moreBtnVisibility': false,
            "_roleDisabled": item.WiproRoleBind.RoleName && item.WiproRoleBind.RoleName.toUpperCase() == 'DEAL OWNER' ? true : false
          };
        });

        if (pageNo == 1) {
          this.OpportunityTeamsTable = []
          this.OpportunityTeamsTable = tableCollection
        }
        else {
          this.OpportunityTeamsTable = this.OpportunityTeamsTable.concat(tableCollection)
        }

      } else {
        return [{}]
      }
    } else {
      return [{}]
    }
  }

  //Get table data on page change
  getNewTableData(event) {
    if (event.action === 'pagination') {
      this.AllTeamsRequestbody = {
        "PageSize": event.itemsPerPage,
        "RequestedPageNumber": event.currentPage,
        "OdatanextLink": ""
      };
      this.paginationPageNo = {
        "PageSize": event.itemsPerPage,
        "RequestedPageNumber": event.currentPage,
        "OdatanextLink": ""
      };

      this.AllTeamsRequestbody.PageSize = event.itemsPerPage.toString()
      this.AllTeamsRequestbody.RequestedPageNumber = event.currentPage.toString()
      if (this.service.checkFilterListApiCall(event)) {
        // filter api call
        this.CallListDataWithFilters(event);
      } else {
        // list api call
        this.getTeamBuilderList(event.itemsPerPage.toString(), event.currentPage.toString(), '');

      }
    }
  }

  public getSBUOwnerDetails() {
    this.teamsvc.getSBUOwnerDetails(this.sbuId).subscribe(res => {
      if (!res.IsError)
        this.sbuOwnerName = res.ResponseObject.Name;
      else
        this.projectService.displayMessageerror(res.Message);
    },
      err => {
        this.projectService.displayerror(err.status);
      });
  }

  public getVerticalOwnerDetails() {
    this.teamsvc.getVerticalOwnerDetails(this.verticalId).subscribe(res => {
      if (!res.IsError) {
        this.verticalOwnerName = res.ResponseObject.Name;
        this.configData.verticalOwnerName = this.verticalOwnerName;
      }
      else
        this.projectService.displayMessageerror(res.Message);
    },
      err => {
        this.projectService.displayerror(err.status);
      });
  }

  public getSalesHeadDetails() {
    this.teamsvc.getSalesHeadDetails(this.sbuId, this.verticalId).subscribe(res => {
      if (!res.IsError)
        this.salesHeadName = res.ResponseObject.User.UserName;
      else
        this.projectService.displayMessageerror(res.Message);
    },
      err => {
        this.projectService.displayerror(err.status);
      });
  }

  public getEndDateOptions() {
    this.teamsvc.getEndDateOptions().subscribe(res => {
      if (!res.IsError) {
        res.ResponseObject.map(item => {
          let obj = {
            id: item.Id,
            name: item.Name
          }
          this.wipro_endDateOptions.push(obj);
        });
        this.configData.SAPcustomername = this.wipro_endDateOptions;
        this.getTimeAllocatedPerWeek();
      }
      else {
        this.isLoading = false;
        this.projectService.displayMessageerror(res.Message);
      }
    },
      err => {
        this.isLoading = false;
        this.projectService.displayerror(err.status);
      });
  }

  public getTimeAllocatedPerWeek() {
    this.teamsvc.getTimeAllocatedPerWeek().subscribe(res => {
      if (!res.IsError) {
        res.ResponseObject.map(item => {
          let obj = {
            id: item.Id.toString(),
            name: item.Name
          }
          this.wipro_timeAllocationPerWeek.push(obj);
        });
        this.configData.Geo = this.wipro_timeAllocationPerWeek;
        this.teamsvc.wipro_timeAllocationPerWeek = this.wipro_timeAllocationPerWeek
        this.getTeamBuilderList(this.pageSize.toString(), this.requestedPageNumber.toString(), '');
      }
      else {
        this.isLoading = false;
        this.projectService.displayMessageerror(res.Message);
      }
    },
      err => {
        this.isLoading = false;
        this.projectService.displayerror(err.status);
      });
  }

  loadData() {
    this.isLoading = true;
    this.getTeamBuilderRoles();
  }

  //Get Wipro employees data on change of user lookup
  public getActiveEmployees(searchText) {
    this.teamsvc.getActiveEmployees(searchText).subscribe(res => {
      this.isLoading = false;
      if (!res.IsError) {
        this.configData.isFilterLoading = false;
        this.activeEmployees = res.ResponseObject;
        this.configData.Username = this.activeEmployees.map(function (item, index) {
          let newColumn = Object.assign({
            id: item.Email,
            name: item.FullName ? item.FullName.trim() ? item.FullName : '-' : '-',
            designation: item.Designation,
            initials: (item.FName && item.LName) ? item.FName.charAt(0) + item.LName.charAt(0) : '',
            value: true,
            email: item.Email
          });
          let startIndex = item.DisplayName ? item.DisplayName.indexOf('(') : 0;
          let endIndex = item.DisplayName ? item.DisplayName.indexOf(')') : 0;
          newColumn.designation = item.DisplayName ? item.DisplayName.trim() ? item.DisplayName.substring(startIndex, endIndex + 1) : '-' : '-';
          return newColumn;
        });
        console.log('config data', this.configData);
      }
      else {
        this.configData.Username = [];
        this.projectService.displayMessageerror(res.Message);
      }
    },
      err => {
        this.isLoading = false;
        this.configData.Username = [];
        this.projectService.displayerror(err.status);
      });
  }

  public getTeamBuilderRoles() {
    this.teamsvc.getTeamBuilderRoles().subscribe(res => {
      if (!res.IsError) {
        this.teamBuilderRoles = res.ResponseObject;
        this.teamBuilderRoles.map(item => {
          let obj = {
            id: item.RoleId,
            name: item.RoleName
          }
          this.configData.Role.push(obj);
        })
        this.getEndDateOptions();
      }
      else {
        this.isLoading = false;
        this.projectService.displayMessageerror(res.Message);
      }
    },
      err => {
        this.isLoading = false;
        this.projectService.displayerror(err.status);
      });
  }

//Get table data on init
  public getTeamBuilderList(pageSize, requestedPageNumber, searchText, toastMessage?) {
    this.isLoading = true;
    this.teamsvc.getTeamBuilderList(this.opportunityId, pageSize, requestedPageNumber, searchText).subscribe(res => {
      this.isLoading = false;
      if (!res.IsError) {
        if(toastMessage == 'YES') {
          this.projectService.displayMessageerror("Data saved successfully !!");
        }

        this.userFrm.form.markAsPristine();
        this.service.dirtyflag = false;
        this.teamBuilderList = res.ResponseObject;
        this.tableTotalCount = res.TotalRecordCount ? res.TotalRecordCount : 0;
        if (this.teamBuilderList.length > 0) {
          const startIndex = ((this.paginationPageNo.RequestedPageNumber - 1) * this.paginationPageNo.PageSize) + 1;
          var tableCollection = this.teamBuilderList.map((item, index) => {
            let obj = {
              "id": item.OppoTeamBuilderId,
              "Username": {
                "id": item.TeamMemberEmailId ? item.TeamMemberEmailId : '-',
                "name": item.WiproRequest ? 'Requested' : item.TeamMemberDetails ? item.TeamMemberDetails : '-',
                "designation": "",
                "initials": "",
                "value": false
              },
              "OldEmailId": item.OldTeamMemberEmailId,
              "OldTeamUserId": item.OldTeamUserId,
              "Request": this.isReadOnly ? item.WiproRequest ? 'Yes' : 'No' : item.WiproRequest,
              "Role": {
                "id": item.WiproRoleBind.RoleId,
                "name": item.WiproRoleBind.RoleName
              },
              "SAPcustomercode": item.WiproStartdate ? this.datePipe.transform(new Date(item.WiproStartdate.slice(0, 4), Number(item.WiproStartdate.slice(5, 7)) - 1, item.WiproStartdate.slice(8, 10)).setHours(0, 0, 0, 0), "yyyy-MM-dd'T'HH:mm:ss.SSSSSSS'Z'") : '-',
              "SAPcustomername": null,
              "Geo": { id: item.TimeAllocatedPerWeek == 0 ? '-1' : item.TimeAllocatedPerWeek.toString(), name: this.wipro_timeAllocationPerWeek.filter(x => x.id == item.TimeAllocatedPerWeek)[0] ? this.wipro_timeAllocationPerWeek.filter(x => x.id == item.TimeAllocatedPerWeek)[0].name : '-' },

              "Delivery": this.isReadOnly ? item.WiproDelivery ? 'Yes' : 'No' : item.WiproDelivery,
              "stageObject": item.Selectstage,
              "performanceDetails": [],
              "additionalComments": item.AdditionalComments,
              "createdOn": item.Createdon,
              "index": startIndex + index,
              "expansionData": [],
              "isDefault": item.IsDefault ? item.IsDefault : false,
              "hideInitials": item.WiproRequest,
              "deleteBtnVisibility": this.isReadOnly ? false : item.IsDefault ? false : true,
              "editBtnVisibility": this.isReadOnly ? false : true,
              'moreBtnVisibility': false,
              "_roleDisabled": item.WiproRoleBind.RoleName && item.WiproRoleBind.RoleName.toUpperCase() == 'DEAL OWNER' ? true : false
            }
            if (item.Selectstage) {
              obj.SAPcustomername =
              {
                "id": item.StatusId.toString(),
                "name": this.wipro_endDateOptions.filter(x => x.id === item.StatusId)[0] ? this.wipro_endDateOptions.filter(x => x.id === item.StatusId)[0].name : '-',
                "designation": "",
                "initials": "",
                "value": false
              }
            }
            else {
              obj.SAPcustomername = item.WiproEnddate ? this.datePipe.transform(new Date(item.WiproEnddate.slice(0, 4), Number(item.WiproEnddate.slice(5, 7)) - 1, item.WiproEnddate.slice(8, 10)).setHours(0, 0, 0, 0), "yyyy-MM-dd'T'HH:mm:ss.SSSSSSS'Z'") : '-'
            }
            return obj;

          })
          if (this.paginationPageNo.RequestedPageNumber == 1) {
            this.OpportunityTeamsTable = []
            this.OpportunityTeamsTable = tableCollection
            var defaultArr = this.OpportunityTeamsTable.filter((it) => it.isDefault == true)
            this.OpportunityTeamsTable = this.OpportunityTeamsTable.filter((it) => it.isDefault == false)
            this.OpportunityTeamsTable = this.OpportunityTeamsTable.concat(defaultArr)
            this.OpportunityTeamsTable.map((it, index) => {
              it.index = index + 1;
            })

          }
          else {
            this.OpportunityTeamsTable = this.OpportunityTeamsTable.concat(tableCollection)
            var defaultArr = this.OpportunityTeamsTable.filter((it) => it.isDefault == true)
            this.OpportunityTeamsTable = this.OpportunityTeamsTable.filter((it) => it.isDefault == false)
            this.OpportunityTeamsTable = this.OpportunityTeamsTable.concat(defaultArr)
            this.OpportunityTeamsTable.map((it, index) => {
              it.index = index + 1;
            })

          }

          console.log("opportunity teams table", this.OpportunityTeamsTable);
        }
        else {
          this.OpportunityTeamsTable = []
          let obj = {
            "id": '',
            "Username": {
              "id": '',
              "name": '',
              "designation": "",
              "initials": "",
              "value": ''
            },
            "Request": '',
            "Role": null,
            "SAPcustomercode": '',
            "SAPcustomername": null,
            "Geo": '',
            "Delivery": '',
            "stageObject": '',
            "performanceDetails": [],
            "additionalComments": '',
            "createdOn": '',
            "index": '',
            "expansionData": [],
            "isDefault": ''
          }
          this.OpportunityTeamsTable.push(obj);
        }
      }
      else {
        //empty object for no records found
        this.isLoading = false;
        this.OpportunityTeamsTable = [];
        this.projectService.displayMessageerror(res.Message);
        let obj = {
          "id": '',
          "Username": {
            "id": '',
            "name": '',
            "designation": "",
            "initials": "",
            "value": ''
          },
          "Request": '',
          "Role": null,
          "SAPcustomercode": '',
          "SAPcustomername": null,
          "Geo": '',
          "Delivery": '',
          "stageObject": '',
          "performanceDetails": [],
          "additionalComments": '',
          "createdOn": '',
          "index": '',
          "expansionData": [],
          "isDefault": ''
        }
        this.OpportunityTeamsTable.push(obj);
      }
    },
      err => {
        this.projectService.displayerror(err.status);
        this.isLoading = false;
      });
  }

  //Date validation on save
  validateData() {
    this.isDataValid = true;
    this.isDealOwnerTagged = false;
    this.OpportunityTeamsTable.forEach(item => {
      let endDate = new Date(item.SAPcustomername).toLocaleDateString();
      let startDate = new Date(item.SAPcustomercode).toLocaleDateString();
      if (item.stageObject == false && Date.parse(endDate) < Date.parse(startDate)) {
        this.isDataValid = false;
        var message = "Start date is greater than end date in " + this.convertIndextoString(item.index) + " row of team builder table."
        this.projectService.displayMessageerror(message);
      }

      if(item.Role.name && item.Role.name.toUpperCase() == 'DEAL OWNER' ) {
        this.isDealOwnerTagged = true;
      }
    })
  }

  convertIndextoString(index) {
    if (index == 1) {
      return '1st';
    }
    else if (index == 2) {
      return '2nd';
    }
    else if (index == 3) {
      return '3rd';
    }
    else {
      return index + 'th';
    }
  }

  //self tagging validation on save
  validateSelfTagging() {
    this.selfTagged = false;
    console.log('useridIssssss', localStorage.getItem('userEmail').replace(/['"]+/g, ''));
    for (let i = 0; i < this.OpportunityTeamsTable.length; i++) {
      if (!this.OpportunityTeamsTable[i].Request && this.OpportunityTeamsTable[i].Username.id == localStorage.getItem('userEmail').replace(/['"]+/g, '')) {
        this.selfTagged = true;
      }
    }
  }

  //on save
  public addUpdTeamBuilder() {
    if (this.accessData && this.accessData.IsTeamBuilderSection && this.accessData.IsGainAccess && this.accessData.UserRoles.IsPreSaleAndRole) {
      this.validateSelfTagging();
    }
    if (!this.selfTagged) {
      this.projectService.displayMessageerror("Username should match with logged in user");
    }
    else if (this.isAddStage > 0) {
      this.projectService.displayMessageerror("Please Enter all the mandatory fields and  accept/reject the changes.");
    }
    else {
      this.validateData();
      if (this.isEditStage == 0 && this.isDataValid) {
        let jsonArray = [];
        this.OpportunityTeamsTable.map(data => {

          let obj = {
            "OpportunityId": this.opportunityId,
            "OppoTeamBuilderId": data.id.includes('newrow') ? '00000000-0000-0000-0000-000000000000' : data.id,
            "WiproRoleId": data.Role.id,
            "WiproRoleBind": {
              "RoleId": data.Role.id,
              "RoleName": data.Role.name,
              "RoleType": 0,
              "UniqueCheck": false,
              "UniqueCheckValue": null
            },
            "TeamUserId": "",
            "TeamMemberData": null,
            "TeamMemberDetails": data.Request ? '' : data.Username.name,
            "TeamMemberEmailId": data.Request ? '' : data.Username.id,
            "OldTeamMemberEmailId": data.OldEmailId,
            "OldTeamUserId": data.OldTeamUserId,
            "WiproStartdate": (data.SAPcustomercode != '-' && data.SAPcustomercode) ? this.datePipe.transform(data.SAPcustomercode, "yyyy-MM-dd'T'HH:mm:ss.SSSSSSS'Z'") : '',
            "WiproEnddate": (data.stageObject == false && data.SAPcustomername != '-' && data.SAPcustomername) ? this.datePipe.transform(data.SAPcustomername, "yyyy-MM-dd'T'HH:mm:ss.SSSSSSS'Z'") : '',
            "WiproRequest": data.Request,
            "Selectstage": data.stageObject,
            "TimeAllocatedPerWeek": data.Geo.id == '-1' ? '' : data.Geo.id,
            "WiproDelivery": data.Delivery,
            "AdditionalComments": data.additionalComments,
            "Createdon": data.id.includes('newrow') ? this.datePipe.transform(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSSSSS'Z'") : this.datePipe.transform(data.createdOn, "yyyy-MM-dd'T'HH:mm:ss.SSSSSSS'Z'"),
            "StatusId": (data.stageObject == true) ? data.SAPcustomername.id : null,
            "StatusName": (data.stageObject == true) ? data.SAPcustomername.name : null,
          }

          jsonArray.push(obj);

        })
        this.isLoading = true;
        this.teamsvc.addUpdTeamBuilder(jsonArray).subscribe(res => {
          this.isLoading = false;
          if (!res.IsError) {
            this.projectService.stageSave();
            if (this.accessData && this.accessData.IsGainAccess && this.accessData.UserRoles.IsPreSaleAndRole) {
              this.projectService.displayMessageerror("Data saved successfully !!");
              this.projectService.setpartialAccess();
            }
            else if(this.isDealOwnerTagged) {
              this.projectService.displayMessageerror("Data saved successfully !!");
              this.projectService.setpartialAccess();
            }
            else {
              this.paginationPageNo = {
                "PageSize": 10,
                "RequestedPageNumber": 1,
                "OdatanextLink": ""
              }
              this.AllTeamsRequestbody = {
                "PageSize": 10,
                "RequestedPageNumber": 1,
                "OdatanextLink": "",
                "FilterData": this.teamsvc.sendConfigData || []
              }
              this.getTeamBuilderList(this.pageSize.toString(), this.requestedPageNumber.toString(), '','YES');
            }
            // this.projectService.displayMessageerror("Data saved successfully !!");
          }
          else {
            this.projectService.displayMessageerror(res.Message);
          }
        },
          err => {
            this.isLoading = false;
            this.projectService.displayerror(err.status);
            console.log("error", err);
          })
      }
      else if (this.isEditStage > 0) {
        this.projectService.displayMessageerror("Please accept/reject the changes before saving.");
      }

    }
  }

  //Bulk delete method
  public deleteMultipleData(data) {
    let requestPayload = [];
    let deletePayload = [];
    data.forEach(item => {
      if (item.id && item.id.indexOf('newrow') == -1) {
        requestPayload.push(item.id);
      }
      deletePayload.push(item.id);
    })
    if (requestPayload.length > 0) {
      this.isLoading = true;
      this.teamsvc.deactivateMultipleTBs(requestPayload).subscribe(res => {
        this.isLoading = false;
        if (!res.IsError) {
          for (let i = 0; i < deletePayload.length; i++) {
            this.OpportunityTeamsTable = this.OpportunityTeamsTable.filter(it => it.id != deletePayload[i])
          }
          this.OpportunityTeamsTable.map((it, index) => {
            it.index = index + 1;
          })
          this.projectService.displayMessageerror("Data deleted successfully !!");
        }
        else {
          this.projectService.displayMessageerror("Error occurred while deleting");
        }
      },
        err => {
          this.isLoading = false;
          this.projectService.displayerror(err.status);
        });
    }
    else {
      for (let i = 0; i < deletePayload.length; i++) {
        const index = this.OpportunityTeamsTable.findIndex(item => item.id === deletePayload[i]);
        console.log(index);
        console.log(this.OpportunityTeamsTable);
        if (index !== -1) {
          this.OpportunityTeamsTable.splice(index, 1);
        }
      }
      this.OpportunityTeamsTable.map((it, index) => {
        it.index = index + 1;
      })
    }
  }

  //Single delete method
  public deleteTeamMember(data) {
    this.isLoading = true;
    let teamBuilderId = data[0].id;
    if (teamBuilderId && teamBuilderId.indexOf('newrow') == -1) {
      this.teamsvc.deleteTeamMember(teamBuilderId).subscribe(res => {
        this.isLoading = false;
        if (!res.IsError) {
          const index = this.OpportunityTeamsTable.findIndex(item => item.id === teamBuilderId);
          if (index !== -1) {
            this.OpportunityTeamsTable.splice(index, 1);
            this.OpportunityTeamsTable.map((it, i) => {
              it.index = i + 1;
            })
          }
          this.projectService.displayMessageerror("Data deleted successfully !!");
        }
        else {
          this.projectService.displayMessageerror(res.Message);
        }
      },
        err => {
          this.isLoading = false;
          this.projectService.displayerror(err.status);
        });
    }

    else {
      const index = this.OpportunityTeamsTable.findIndex(item => item.id === teamBuilderId);
      if (index !== -1) {
        this.OpportunityTeamsTable.splice(index, 1);
        this.OpportunityTeamsTable.map((it, index) => {
          it.index = index + 1;
        })
      }

      this.tableTotalCount = this.tableTotalCount - 1;

      this.isLoading = false;
      this.projectService.displayMessageerror("Data deleted successfully !!");
    }

  }

  //On expansion of row -- More actions
  public getSummary(data) {
    this.isLoading = true;
    let teamBuilderId = data.id;
    this.teamsvc.getSummary(teamBuilderId).subscribe(res => {
      this.isLoading = false;
      data.expansionData = [];
      console.log("summary", res);
      if (!res.IsError) {
        let obj = {
          "Description": res.ResponseObject.WiproRoleBind ? res.ResponseObject.WiproRoleBind.RoleDescription : '',
          "Status": res.ResponseObject.WiproRequest ? 'Pending' : res.ResponseObject.StatusName,
          "CreatedOn": res.ResponseObject.Createdon,
          "RoleType": res.ResponseObject.WiproRoleBind.RoleTypeDisplay,
          "disable": this.isReadOnly
        }
        data.expansionData.push(obj);
      }
      else
        this.projectService.displayMessageerror(res.Message);
    },
      err => {
        this.isLoading = false;
        this.projectService.displayerror(err.status);

      });
  }

  //data change check on click of guidelines
  private subject = new Subject<any>();
  sendNotification(status: string) {
    this.subject.next({ text: status });
  }
  getNotification(): Observable<any> {
    return this.subject.asObservable();
  }
  openConfirmPopup() {
    let dialog = this.dialog.open(ConfirmSaveComponent, {
      width: '396px'
    });

    const sub = dialog.componentInstance.onAdd.subscribe((data) => {
      this.sendNotification(data);
    });

    dialog.afterClosed().subscribe((result) => {
      sub.unsubscribe();
    });

  }
  public navigateToGuidelines() {
    // if (!this.isReadOnly) {
      if (this.service.dirtyflag) {
        this.openConfirmPopup();
        let dialogData = this.getNotification().subscribe(res => {
          if (res.text == true) {
            this.service.Teambuildingtab = true;
            this.service.Competitortab = false;
            this.service.Probabiltytab = false;
            this.isLoading = true;
            this.router.navigate(['/opportunity/oppactions/opportunityguideline']);
            dialogData.unsubscribe();
          }
          else {
            dialogData.unsubscribe();
          }
        });
      }
      else {
        this.service.Teambuildingtab = true;
        this.service.Competitortab = false;
        this.service.Probabiltytab = false;
        this.isLoading = true;
        this.router.navigate(['/opportunity/oppactions/opportunityguideline']);
      }
    // }
  }


}
@Component({
  selector: 'deleteteammember',
  templateUrl: './deleteteammember.html',
})
export class DeleteTeamMember {
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<DeleteTeamMember>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('in deletepopup', data);
  }

  onClose(flag) {
    console.log('in close ', flag)
    this.dialogRef.close(flag);
  }

}



