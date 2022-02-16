import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { DataCommunicationService } from '@app/core/services/global.service';
import { CommentList } from '@app/core/models/actionList.model';
import { actionListService } from '@app/core/services/actionList.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { ConversationService, OfflineService, OnlineOfflineService, ErrorMessage, MasterApiService } from '@app/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RoutingState } from '@app/core/services/navigation.service';
import { DatePipe } from '@angular/common'
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { LoadActionsByParentId, ClearActionList } from '@app/core/state/actions/activities.actions';
import { getActionListByParentIdActivity } from '@app/core/state/selectors/activity/activity.selector';
import { MeetingService } from '@app/core/services/meeting.service';
@Component({
  selector: 'app-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.scss']
})

export class ActionListComponent implements OnInit, OnDestroy {
  actionConvoRequestbody = {
    "Guid": 1,
    "PageSize": 50,
    "Conversation_Guid": "",
    "RequestedPageNumber": 1,
    "OdatanextLink": ""
  }
  isLoading: boolean = false;
  id: any;
  key: string;
  reverse;
  search;
  selectedAll: any;
  headerArray;
  clear;
  fixedClass = 'fixedClass0';
  myArrayData = [];
  isFixed?: boolean;
  userArray = [];
  headerData;
  expand1: boolean;
  desp_cntnt = true;
  cmnts_cntnt: boolean;
  expand_section_cmnt: boolean;
  name: string;
  actionListLength: number;
  tabindex: number;
  actionObject: {};
  closeObject: {};
  actionId: any;
  object: {};
  comments: any;
  ColumnNames: []
  agenda: any;
  actionListForm: FormGroup;
  searchAction: any;
  getComments: Array<Object>;
  tableTotalCount
  childAction: any
  actionTable = [];
  show;
  value: string = "Alphabetically";
  toggle;
  corr;
  headerName;
  archived: any;
  statusCode = [];
  configData = {
    "dropStatus": []
  }
  actionState: Subscription
  ParentActivityId
  filterConfigData = {
    Name: { data: [], recordCount: 0, NextLink: '' },
    Owner: { data: [], recordCount: 0, NextLink: '' },
    Duedate: { data: [], recordCount: 0, NextLink: '' },
    Priority: { data: [], recordCount: 0, NextLink: '' },
    Status: { data: [], recordCount: 0, NextLink: '' },
    isFilterLoading: false
  };
  allBtnsLable = ['debugVisibility'];
  expand = false;
  searchitem;
  optionArray: any[];
  cont = 0;
  comntArray: CommentList[];
  selectedTabValue: string = "";
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private encrDecrService: EncrDecrService,
    private conversationService: ConversationService,
    public service: DataCommunicationService,
    public actionListService: actionListService,
    public matSnackBar: MatSnackBar,
    public formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private offlineServices: OfflineService,
    private onlineOfflineservice: OnlineOfflineService,
    private offlineService: OfflineService,
    private onlineOfflineService: OnlineOfflineService,
    public meetingService: MeetingService,
    public errorMessage: ErrorMessage,
    public routingState: RoutingState,
    private masterApi: MasterApiService,
    public store: Store<AppState>) { }

  async ngOnInit() {
    this.masterApi.getNewStatusCode().subscribe(res => {
      this.statusCode = res.ResponseObject;
      console.log(res.ResponseObject);
      this.configData['dropStatus'] = res.ResponseObject.filter(x => (Number(x.Id) == 5 || Number(x.Id) == 6)).map(x =>{
          return { 'id' : x.Id, 'Name': x.Value }
        });
    })
    this.conversationService.getThreadTrue = true;
    this.conversationService.conversationTrues = false;
    this.service.convActionTag = true;
    this.name = sessionStorage.getItem('ActivityGroupName')
    this.id = sessionStorage.getItem('ActivityListRowId')
    this.id = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', JSON.parse(this.id), 'DecryptionDecrip');
    this.actionConvoRequestbody.Conversation_Guid = this.id
    this.isLoading = true
    this.archived = sessionStorage.getItem('archivedStatus')
    this.ColumnNames = []
    if (sessionStorage.getItem('archivedStatus')) {
      this.archived = JSON.parse(sessionStorage.getItem('archivedStatus'))
      this.service.archiveTag = this.archived
    }
    // offline
    if (!this.onlineOfflineService.isOnline) {
      this.isLoading = false
      const CacheRes = await this.actionListService.getCacheActivityActionListById(this.actionConvoRequestbody)
      console.log("cache response - >>>")
      console.log(CacheRes)
      if (CacheRes) {
        if (CacheRes.data.length > 0) {
          this.actionTable = this.getAllActionLists(CacheRes.data)
          this.tableTotalCount = CacheRes.count
          this.actionConvoRequestbody.OdatanextLink = CacheRes.nextlink
        }
      } else {
        this.getActionConversations(this.actionConvoRequestbody, true, false)
      }
    }
    this.actionState = this.store.pipe(select(getActionListByParentIdActivity(this.actionConvoRequestbody.Conversation_Guid))).subscribe(res => {
      if (res) {
        this.isLoading = false
        if (res.list.data.length > 0) {
          this.ParentActivityId = res.parentId
          this.actionTable = this.getAllActionLists(res.list.data)
          this.actionConvoRequestbody.OdatanextLink = res.list.nextlink
          this.tableTotalCount = res.list.count
        } else {
          this.getActionConversations(this.actionConvoRequestbody, true, false)
        }
      } else {
        this.getActionConversations(this.actionConvoRequestbody, true, false)
      }
    });
  }
  //---------------------------------------------------NEW Table --------------------------------------------
  getAllActionLists(data: Array<any>) {
    if (data) {
      return data.map(child => {
        console.log('data-->', child)
        try {
          return {
            id: child.ActionId,
            Name: child.Subject,
            Owner: child.Owners ? child.Owners.length > 0 ? this.ActionOwners(child.Owners) : ["NA"] : ["NA"],
            Duedate: child.DueDate,
            Priority: child.Priority,
            Status: child.Status,
            Description: child.Description,
            Comments: [],
            Subject: child.Subject,
            parenSystemId: child.Owners ? child.Owners.length > 0 ? this.sysGuid(child.Owners) : ["NA"] : ["NA"],
            PriorityCode: child.PriorityCode,
            StateCode: child.StateCode,
            StatusCode: child.StatusCode,
            index: child.index,
            IsHidePopUp: (child.StatusCode == 5 || child.StatusCode == 6) ? true : false,
            debugVisibility: (child.StatusCode == 5 || child.StatusCode == 6) ? true : false,
            statusclass: child.Priority == 'High' ? 'high' : ''
              || child.Priority == 'Low' ? 'low' : ''
                || child.Priority == 'Normal' ? 'normal' : ''
          }
        } catch (error) {
          return [{}]
        }
      })
    } else {
      return [{}]
    }
  }

  getActionConversations(reqbody, isConcat, isSearch) {
    this.isLoading = true;
    let useFulldata ={
      Conversation_Guid: this.actionConvoRequestbody.Conversation_Guid,
      pageSize: 50,
      pageNo:this.actionConvoRequestbody.RequestedPageNumber
    }
    let reqparam = this.actionListService.GetAppliedFilterData({ ...reqbody, useFulldata: useFulldata});
    this.actionListService.getAppliedFilterActionData(reqparam).subscribe(res => {
    // this.conversationService.getConversationAction(reqbody).subscribe(async res => {
    //   console.log('Action list response-->', res)
      if (!res.IsError) {
        if (res.ResponseObject.length > 0) {
          const ImmutableData = Object.assign({}, res)
          this.isLoading = false;
          //Harin 
          const perPage = this.actionConvoRequestbody.PageSize;
          const start = ((this.actionConvoRequestbody.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;
          console.log(start + " - " + end);
          res.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          })
          if (res.OdatanextLink) {
            this.actionConvoRequestbody.OdatanextLink = res.OdatanextLink;
          }
          if (isConcat) {
            let spliceArray = [];
            this.actionTable.map((res) => {
              if (res.index >= start && res.index <= end) {
                spliceArray.push(res);
              }
            });
            spliceArray.map(res => {
              this.actionTable.splice(this.actionTable.indexOf(res), 1);
            })
            if (!isSearch) {
              ImmutableData.ResponseObject.map(x => x.id == x.ActionId);
              const ActivityAction = {
                parentId: this.actionConvoRequestbody.Conversation_Guid,
                list: {
                  data: ImmutableData.ResponseObject,
                  count: ImmutableData.TotalRecordCount,
                  nextlink: this.actionConvoRequestbody.OdatanextLink
                }
              }
              this.actionTable = this.actionTable.concat(this.getAllActionLists(res.ResponseObject));
              this.store.dispatch(new LoadActionsByParentId({ actions: ActivityAction }));
            } else {
              this.actionTable = this.actionTable.concat(this.getAllActionLists(res.ResponseObject));
            }
          } else {
            this.actionTable = this.getAllActionLists(res.ResponseObject);
          }
          this.tableTotalCount = res.TotalRecordCount;
        } else {
          this.isLoading = false;
          this.actionTable = [{}];
          this.tableTotalCount = 0;
        }
      } else {
        this.errorMessage.throwError(res.Message);
        this.isLoading = false;
        this.actionTable = [{}];
        this.tableTotalCount = 0;
      }
    }, error => {
      this.isLoading = false;
      this.actionTable = [{}]
      this.tableTotalCount = 0
    });
  }

  onPagination(event) {
    if (event.action == 'pagination') {
      console.log('event', event)
      this.actionConvoRequestbody.PageSize = event.itemsPerPage;
      this.actionConvoRequestbody.RequestedPageNumber = event.currentPage;
      this.getActionConversations(event, true, false);
      //if search with pagination!
      // if (this.service.checkFilterListApiCall(event)) {
      //   this.CallListDataWithFilters(event);
      // } else {
      //   this.getActionConversations(this.actionConvoRequestbody, true, false);
      // }
    }
  }

  onSearchListData(data) {
    this.actionConvoRequestbody.RequestedPageNumber = 1
    this.actionConvoRequestbody.OdatanextLink = ""
    if (data !== "") {
      if (data.objectRowData !== "" && data.objectRowData !== undefined) {
        let useFulldata ={
          Conversation_Guid: this.actionConvoRequestbody.Conversation_Guid,
          pageSize: 50,
          pageNo:this.actionConvoRequestbody.RequestedPageNumber
        }
        let reqparam = this.actionListService.GetAppliedFilterData({ ...data, useFulldata: useFulldata})
        this.actionListService.getAppliedFilterActionData(reqparam).subscribe(res => {
        // this.actionListService.searchAction(data.objectRowData, this.actionConvoRequestbody.Conversation_Guid).subscribe(res => {
          if (!res.IsError) {
            if (res.ResponseObject.length > 0) {
              let i = 1;
              res.ResponseObject.map(res => {
                res.index = i;
                i = i + 1;
              })
              this.actionTable = this.getAllActionLists(res.ResponseObject)
              this.actionConvoRequestbody.OdatanextLink = res.OdatanextLink
              this.tableTotalCount = res.TotalRecordCount
            } else {
              this.actionTable = [{}]
              this.tableTotalCount = 0
            }
          } else {
            this.isLoading = false;
            this.actionTable = [{}]
            this.tableTotalCount = 0
            this.errorMessage.throwError(res.Message)
          }
        },
          error => {
            this.isLoading = false;
            this.actionTable = [{}]
            this.tableTotalCount = 0;
          })
      } else {
        this.getActionConversations(event, false, false);
        //this.store.dispatch(new ClearActionList({ clearaction: this.actionConvoRequestbody.Conversation_Guid }))
      }
    }
  }

  performListActions(childActionRecieved): Observable<any> {
    debugger
    console.log(childActionRecieved)
    console.log(this.filterConfigData)
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {
      case "Name": {
        sessionStorage.setItem('ActivityId', JSON.stringify({ id: actionRequired.objectRowData[0].id }));
        this.router.navigateByUrl('/activities/actiondetails');
        return
      }
      case "comment": {
        this.postComments(childActionRecieved.objectRowData);
        return
      }
      case "loadComment": {
        this.showcmnts_cntnt(actionRequired.objectRowData)
        return
      }
      case "debug": {
        console.log(actionRequired.objectRowData)
        this.getCloseAction(actionRequired.objectRowData);
        return
      }
      case "search": {
        this.onSearchListData(actionRequired);
        return
      }
      case "columnFilter": {
        this.GetColumnFilters(childActionRecieved);
        return
      }
      case "columnSearchFilter": {
        this.GetColumnSearchFilters(childActionRecieved);
        return
      }
      case 'loadMoreFilterData': {
        this.LoadMoreColumnFilter(childActionRecieved);
        return
      }
      case 'ClearAllFilter': {
        this.clearallFilter();
        return;
      }
      case 'sortHeaderBy': {
        this.actionConvoRequestbody.OdatanextLink = ''
        this.actionConvoRequestbody.RequestedPageNumber = 1
        this.CallListDataWithFilters(childActionRecieved);
        return
      }
    }
  }

  
  clearallFilter(){
    this.getActionConversations(this.actionConvoRequestbody, false, false)
  }
  // -------------------------------------------------Tabel Filter start--------------------------------------------------------------
  GetColumnFilters(data) {
    if (data.filterData) {
      if (!data.filterData.isApplyFilter) {
        debugger
        let headerName = data.filterData.headerName;
        this.filterConfigData[headerName].data = [];
        this.filterConfigData[headerName].PageNo = 1
        this.filterConfigData[headerName].NextLink = ''
        this.generateFilterConfigData(data, headerName, false, this.CheckFilterServiceFlag(data, headerName))
      } else {
        if (data.filterData.isApplyFilter && this.service.CheckFilterFlag(data)) {
          this.actionConvoRequestbody.OdatanextLink = ''
          this.actionConvoRequestbody.RequestedPageNumber = 1
          this.CallListDataWithFilters(data)
        } else if (data.filterData.isApplyFilter && data.filterData.globalSearch != "") {
          this.CallListDataWithFilters(data)
        } else {
          this.store.dispatch(new ClearActionList({ clearaction: this.actionConvoRequestbody.Conversation_Guid }))
          this.actionConvoRequestbody.OdatanextLink = ''
          this.actionConvoRequestbody.RequestedPageNumber = 1
          this.getActionConversations(this.actionConvoRequestbody, true, false);
        }
      }
    }
  }

  GetColumnSearchFilters(data) {
    let headerName = data.filterData.headerName
    this.actionConvoRequestbody.OdatanextLink = ''
    this.filterConfigData[headerName].PageNo = 1
    this.filterConfigData[headerName].NextLink = ''
    this.generateFilterConfigData(data, headerName, false, true)
  }

  LoadMoreColumnFilter(data) {
    // this.filterConfigData
    let headerName = data.filterData.headerName
    this.filterConfigData[headerName].PageNo = this.filterConfigData[headerName].PageNo + 1
    this.generateFilterConfigData(data, headerName, true, true)
  }

  generateFilterConfigData(data, headerName, isConcat, isServiceCall?) {
    if (isServiceCall) {
      let useFulldata = {
        headerName: headerName,
        searchVal: data.filterData.columnSerachKey,
        pageNo: this.filterConfigData[headerName].PageNo,
        pageSize: 10,
        nextLink: this.filterConfigData[headerName].NextLink,
        parentId: this.ParentActivityId,
        Conversation_Guid:this.actionConvoRequestbody.Conversation_Guid
      }
      this.actionListService.getActionListConfigData({ ...data, ActivityGuid: this.ParentActivityId, useFulldata: useFulldata}).subscribe(res => {
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
      },error =>{
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

    let useFulldata ={
      Conversation_Guid: this.actionConvoRequestbody.Conversation_Guid,
      pageSize: 50,
      pageNo:this.actionConvoRequestbody.RequestedPageNumber
    }
    let reqparam = this.actionListService.GetAppliedFilterData({ ...data, useFulldata: useFulldata})
    this.actionListService.getAppliedFilterActionData(reqparam).subscribe(res => {
      debugger
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
          this.actionTable = this.getAllActionLists(res.ResponseObject)
          this.actionConvoRequestbody.OdatanextLink = res.OdatanextLink
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.actionTable = [{}]
          this.tableTotalCount = 0
        }
      } else {
        this.actionTable = [{}]
        this.tableTotalCount = 0
        this.errorMessage.throwError(res.Message)
      }
    })
  }


  navTo() {
    this.router.navigateByUrl('/activities/newaction')
    this.meetingService.meetingDetails = undefined
    this.actionListService.meetingDetailsInfo = undefined
  }

  showdesp_cntnt(item) {
    for (var i = 0; i < this.userArray.length; i++) {
      if (this.userArray[i].desp_cntnt == item.desp_cntnt) {
        this.userArray[i].cmnts_cntnt = false;
        this.userArray[i].desp_cntnt = true;
        this.userArray[i].expand_section_cmnt = false;
      }
    }
  }

  showcmnts_cntnt(item) {
    debugger
    this.isLoading = false
    let id = item.data.id
    this.actionListService.getCommentsOnAction(id).subscribe(res => {
      this.isLoading = false
      if (res.IsError === false) {
        console.log('getComments--->', res);
        this.getComments = res.ResponseObject;
        item.data.Comments = this.getComments;
        this.childAction = item.data;
      } else {
        this.isLoading = false
        this.errorMessage.throwError(res.Message)
      }
    });
    for (var i = 0; i < this.userArray.length; i++) {
      if (this.userArray[i].cmnts_cntnt == item.cmnts_cntnt) {
        this.userArray[i].cmnts_cntnt = true;
        this.userArray[i].desp_cntnt = false;
        this.userArray[i].expand_section_cmnt = false;
      }
    }
  }

  show_expand_section_cmnt(item) {
    console.log('item', item);
    for (var i = 0; i < this.userArray.length; i++) {
      if (this.userArray[i].id == item.id) {
        this.userArray[i].cmnts_cntnt = false;
        this.userArray[i].desp_cntnt = false;
        this.userArray[i].expand_section_cmnt = true;
      }
    }
    this.actionListForm.controls.comments.reset();
    this.expand_section(item);
  }

  close_expand_section(item) {
    for (var i = 0; i < this.userArray.length; i++) {
      if (this.userArray[i].id == item.id) {
        this.userArray[i].isExpanded = false;
      }
    }
  }

  expand_section(item) {
    for (var i = 0; i < this.userArray.length; i++) {
      if (this.userArray[i].id == item.id) {
        this.userArray[i].isExpanded = !this.userArray[i].isExpanded;
      }
      else {
        this.userArray[i].isExpanded = false;
      }
    }
  }

  inputClick() {
    this.expand = true;
  }

  OutsideInput() {
    this.expand = false;
  }

  close() {
    this.expand = false;
    this.search = "";
  }

  postComments(item) {
    let decrid = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
    console.log(decrid);
    let details = decrid
    this.actionObject = {
      "Owners": [
        {
          "SysGuid": details
        }],
      "ActionId": item.data.id,
      "Comments": item.comment.trim()
    }
    console.log('actionObject>>>', this.actionObject)
    if (item.comment.trim() !== "") {
      this.actionListService.getUpdateAction(this.actionObject).subscribe(async res => {
        if (res.IsError === true) {
          this.isLoading = false;
          let message = res.Message;
          let action
          this.matSnackBar.open(message, action, {
            duration: 2000
          })
        } else {
          this.isLoading = false;
          await this.offlineServices.ClearTablesdata(this.onlineOfflineservice.isOnline)
          this.errorMessage.throwError(res.Message)
          this.showcmnts_cntnt(item);
        }
      });
    } else {
      this.errorMessage.throwError("Please enter comments!");
    }
  }

  deleteContact(comment) {
    console.log('comments-->', comment, comment.Id);
    this.actionListService.delinkCommentOnAction(comment.Id).subscribe(res => {
      if (res.IsError === false) {
        console.log('res--->', res);
        let message = "selected comment is deleted"
        let action
        this.matSnackBar.open(message, action, {
          duration: 2000
        })
      } else {
        this.errorMessage.throwError(res.Message)
      }
    })
  }

  addCBU(i) {
    if (i == 1) {
      this.value = "A to Z"
      this.show = false;
    }
    else if (i == 2) {
      this.value = "Z to A"
      this.show = false;
    }
    else if (i == 3) {
      this.value = "Alphabetically"
      this.show = false;
    }
  }

  showAlpha() {
    document.getElementsByClassName('caret0')[0].classList.toggle('rotate-180d');
    this.show = !this.show;
  }

  hidedropdown() {
    document.getElementsByClassName('caret0')[0].classList.remove('rotate-180d');
    this.show = false;
  }

  titleShow(name, index) {
    this.headerName = name;
  }

  showcheckbox(item: any) {
    this.headerArray.forEach(element => {
      if (element.name == item.name) {
        element.isFilter = !element.isFilter;
      }
      else {
        element.isFilter = false;
      }
    });
  }

  stop(e) {
    e.stopImmediatePropagation();
  }

  filterSearchClose() {
    this.searchitem = "";
  }

  count(e, index) {
    if (e.checked) {
      this.cont++;
    }
    else {
      this.cont--;
    }
  }

  clearAll(cn) {
    this.optionArray.forEach(element => {
      element.isselected = false;
    });
    this.cont = 0;
  }

  selectAll() {
    for (var i = 0; i < this.userArray.length; i++) {
      this.userArray[i].isCheccked = this.selectedAll;
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
  }

 

  ActionOwners(data): Array<any> {
    try {
      let actionOwners = []
      data.map(x => actionOwners.push(x.FullName))
      return actionOwners
    } catch (error) {
      return ["NA"]
    }
  }

  sysGuid(data): Array<any> {
    try {
      let sysGuid = []
      data.map(x => sysGuid.push(x.SysGuid))
      return sysGuid
    } catch (error) {
      return ["NA"]
    }
  }

  // GetAppliedFilterData(data) {
  //   debugger
  //   return {
  //     "ActivityGroupGuids": [this.actionConvoRequestbody.Conversation_Guid],
  //     "Name": this.service.pluckParticularKey(data.filterData.filterColumn['Name'], 'id'),
  //     "ProirityCodes": this.service.pluckParticularKey(data.filterData.filterColumn['Priority'], 'id'),
  //     "StatusIds": this.service.pluckParticularKey(data.filterData.filterColumn['Status'], 'id'),
  //     "DueDateList": this.service.pluckParticularKey(data.filterData.filterColumn['Duedate'], 'dueDate'),
  //     "OwnerGuids": this.service.pluckParticularKey(data.filterData.filterColumn['Owner'], 'id'),
  //     "SearchText": data.filterData.globalSearch,
  //     "PageSize": 50,
  //     "OdatanextLink": "",
  //     "RequestedPageNumber": this.actionConvoRequestbody.RequestedPageNumber,
  //     "IsDesc": true,
  //     "SortBy": this.service.pluckParticularKey(ExpandHeader.filter(x => x.name == data.filterData.sortColumn), 'SortId')[0]
  //   }
  // }

  /**
   * 
   * @param array1 from where
   * @param array2 which al 
   * @param key key
   */
  RemoveSelectedItems(array1, array2, key) {
    return array1.filter(item1 =>
      !array2.some(item2 => (item2[key] === item1[key])))
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
  // Function for closing the action
  getCloseAction(data) {
    console.log('data--->', data.data)
    let statusCode = data.dropData ? data.dropData['id'] : data.dropData['id']
    let resId = data.data.map((x) => {
      return {
        "ActionId": (x.id),
        "Conversation": {
          "Conversation_Guid": this.actionConvoRequestbody.Conversation_Guid
        }
      }
    })
    // if (statusCode != 5) {
      let object: Array<Object> = data.data.map((x) => {
        return {
          "ActionId": (x.id),
          "ClosedRemarks": data.comment,
          "statuscode" : statusCode,
          "Conversation": {
            "Conversation_Guid": this.actionConvoRequestbody.Conversation_Guid
          }
        }
      });
      // console.log('response Id--->', resId)
      console.log('object for the close action-->', object)
      this.isLoading = true;
      this.actionListService.getCloseAction(object).subscribe(async res => {
        if (res.IsError === true) {
          this.errorMessage.throwError(res.Message)
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.actionTable = this.actionTable.map(x => {
            if (object == resId) {
              x.StatusCode = 5
              x.Status = "Closed"
              x.debugVisibility = "false"
            }
            return x;
          })
          this.errorMessage.onSuccessMessage("Action is closed!").afterDismissed().subscribe(()=>{
            this.store.dispatch(new ClearActionList({ clearaction: this.actionConvoRequestbody.Conversation_Guid }))
          })
        }
      })
    // }
  }

  // unsubscribing my state 
  ngOnDestroy() {
    this.actionState.unsubscribe()
  }
}
