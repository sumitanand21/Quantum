import { Component, ViewChild, OnInit, ElementRef, Inject, ɵConsole } from '@angular/core';
import { extend, Internationalization } from '@syncfusion/ej2-base';
import {
    TimelineViewsService, AgendaService, getWeekNumber, CellTemplateArgs, GroupModel,
    PopupOpenEventArgs, EventRenderedArgs, ScheduleComponent, MonthService, DayService,
    WeekService, WorkWeekService, EventSettingsModel, ResizeService, DragAndDropService,
    ActionEventArgs, ToolbarActionArgs, TimeScaleModel
} from '@syncfusion/ej2-angular-schedule';
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { Calendar, RenderDayCellEventArgs } from '@syncfusion/ej2-calendars';
import { Router } from '@angular/router';
import { EmitType, isNullOrUndefined } from '@syncfusion/ej2-base';
import { timelineResourceData, resourceData1 } from './datasource';
import { dealService } from '@app/core/services/deals.service';;
import { Observable, of } from 'rxjs';
import { ErrorMessage } from '@app/core/services/error.services';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { CreateListAction, CalenderListAction } from '@app/core/state/actions/deals.actions';
import { CreateActionList } from '@app/core/state/selectors/deals/create-action.selector';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { GetSetMethod } from '@app/core/services/deals/deal-setget.service';
import { OnlineOfflineService } from '@app/core';
import { CalenderActionList } from '@app/core/state/selectors/deals/calender-list.selector';
import { DatePipe } from '@angular/common';
import { PopoverConfig, ComponentLoaderFactory, PositioningService } from 'ngx-bootstrap';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { newConversationService } from '@app/core/services/new-conversation.service';
import { environment as env } from '@env/environment';
declare let FileTransfer: any;
import * as FileSaver from 'file-saver';
import { DealRoleService } from '@app/core/services/deals/deals-role.service';
import { NewDocStatusService } from '@app/core/services/datacomm/data-comm.service';
import { DateModifier } from '@app/core/services/date-modifier';
import { EnvService } from '@app/core/services/env.service';
declare let DronaHQ: any;


@Component({
    selector: 'app-deal-calendar',
    templateUrl: './deal-calendar.component.html',
    styleUrls: ['./deal-calendar.component.scss'],
    providers: [PopoverConfig, ComponentLoaderFactory, PositioningService]
})
export class DealCalendarComponent implements OnInit {
    isLoading: boolean;
    lastRecordId: any = 0;
    tableTotalCount: number = 0;
    // public selectedDate: Date = new Date('M');
    public selectedDate: Date = new Date();
    public currentView: string = 'TimelineMonth';
    selectedDates;
    details;
    oldPageNumber = 1;
    pageCount: number = 10;
    pageNo: number = 1;
    actionStatus: any = 0;
    myActionStatus: any = 0;
    IsGlobalSearchText: any = false;
    filterByProparyName: any = "";
    summaryArray = [];
    matchedArray = [];
    myActions = [];
    filterArray = [];
    searchMyAction = [];
    searchCloseAction = [];
    closeAction = [];
    checkingTime: any = 0;
    searchName: any;
    preSearchId: any;
    searchId: any = 1;
    rollAccess: any = false;
    actionName: any;
    actionMessage: any;
    adid: any;
    totalCalendarRecord: any;
    selectedTab: any = 1;
    resourceData1 = [];
    actionNameListArray = [];
    checkNewDoc: boolean = false;
    PrevSearcText: any = '';
    sortOrder: any;
    searchByText: any = ''
    preOrderLength: any = 0;
    theFirstTime: any = 1;
    sortByPropertyName: any = 'ID DESC';
    sortByOrderList: any = 0;
    orderByHeader: any = "ASC";
    hidecreateAction:boolean = true;
    preheadername: any;
    paginationPageNo = {
        "PageSize": 10,
        "RequestedPageNumber": 1,
        "OdatanextLink": "",
        "FilterData": []
    };

    TabListCalTbl = [
        {
            GroupLabel: 'System views',
            GroupData: [
                {
                    id: '1',
                    title: 'All Actions'
                },
                {
                    id: '2',
                    title: 'My actions'
                },
                {
                    id: '3',
                    title: 'Closed actions'
                }
            ]
        },
        {
            GroupLabel: 'Custom views',
            GroupData: [
                {
                    id: '4',
                    title: 'My view 1'
                },
                {
                    id: '5',
                    title: 'My view 2'
                }
            ]
        }
    ];

    TabListCal = [
        {
            GroupLabel: 'System views',
            GroupData: [
                {
                    id: '1',
                    title: 'All Actions'
                },
                {
                    id: '2',
                    title: 'My actions'
                },
                {
                    id: '3',
                    title: 'Closed actions'
                }
            ]
        },
        {
            GroupLabel: 'Custom views',
            GroupData: [
                {
                    id: '4',
                    title: 'My view 1'
                },
                {
                    id: '5',
                    title: 'My view 2'
                }
            ]
        }
    ];

    filterConfigData = {
        actionName: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
        actionType: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
        actionOwner: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
        startDate: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
        endDate: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
        module: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
        status: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
        approval: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
        attachment: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
        approver: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
        escalateCont: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
        dependencies: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
        isFilterLoading: true
    };
    filterSearchText: any = '';

    emitSelected(e) {
        console.log(e);
        this.selectedTab = e.data.id;
        if(e.data.id == 2){
            this.myCalendarViewList();
        } else if(e.data.id == 3) {
            this.closeCalendarViewList();
        } else {
            this.getCalenderViewList();
        }
    }

    public workWeekDays: number[] = [2, 3, 5];
    public weekInterval: number = 16;
    public timeScaleOptions: TimeScaleModel = { enable: true };
    tableview = false;
    @ViewChild('template') template: DialogComponent;
    @ViewChild('quickInfoTemplatesHeader') ejDialog: DialogComponent;
    // Create element reference for dialog target element.
    @ViewChild('container', { read: ElementRef }) container: ElementRef;
    public targetElement: HTMLElement;
    public proxy: any = this;

    public group: GroupModel = {
        enableCompactView: false,
        resources: ['Projects', 'Categories']
    };
    public views: Array<string> = ['TimelineMonth', 'currentView'];
    public projectDataSource: Object[] = [
        // { text: 'PROJECT 1', id: 1, color: '#56ca85' },
    ];

    public categoryDataSource: Object[] = [
        // { text: 'Action name 1', id: 1, groupId: 289, color: '#df5286' },
    ];
    public allowMultiple: Boolean = true;
    public eventSettings: EventSettingsModel;
    public instance: Internationalization = new Internationalization();
    dealOverview: any;
    createrId: string;
    selectAction: any = 1;
    constructor(
        private deals: dealService,
        private router: Router,
        private _error: ErrorMessage,
        public store: Store<AppState>,
        private encrDecrService: EncrDecrService,
        private getSetData: GetSetMethod,
        private onlineOfflineService: OnlineOfflineService,
        private datePipe: DatePipe,
        public dialog: MatDialog,
        public newconversationService: newConversationService,
        public dealRoleService: DealRoleService,
        public newDocStatusService: NewDocStatusService,
        public envr : EnvService
    ) {
        // this.isLoading = true;
        this.dealOverview = JSON.parse(this.encrDecrService.get("EncryptionEncryptionEncryptionEn", sessionStorage.getItem('Dealoverview'), "DecryptionDecrip"));
        this.createrId = (this.encrDecrService.get("EncryptionEncryptionEncryptionEn", localStorage.getItem('userID'), "DecryptionDecrip"));
        this.adid = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('adid'), 'DecryptionDecrip');
    }

    calTable = [];
    rollForUser() {
        let enpData = JSON.parse(this.encrDecrService.get("EncryptionEncryptionEncryptionEn", sessionStorage.getItem('userInfo'), "DecryptionDecrip"));
        console.log(enpData.EmployeeId);
        let checkAccess: any;
        let input = {
            "AdId": enpData.EmployeeId,
        }
        // this.isLoading = true;
        this.deals.rollForUser(input).subscribe(res => {
            console.log(res);
            if (res.ReturnFlag == 'S') {
                let rollOpportunity;
                let rollDealTeamMember;
                let rollModuleTeamMember;
                let rollDealOwner;
                let rollModuleOwner;
                res.Output.map(item => {
                    if (item.RoleID == 16) {
                        rollDealTeamMember = item.IsRoleMappedToUser;
                    }
                    else if (item.RoleID == 17) {
                        rollModuleTeamMember = item.IsRoleMappedToUser;
                    }
                    else if (item.RoleID == 16) {
                        rollModuleTeamMember = item.IsRoleMappedToUser;
                    }
                    else if (item.RoleID == 10119) {
                        rollOpportunity = item.IsRoleMappedToUser;
                    }
                    else if (item.RoleID == 1) {
                        rollDealOwner = item.IsRoleMappedToUser;
                    }
                    else if (item.RoleID == 4) {
                        rollModuleOwner = item.IsRoleMappedToUser;
                    }
                });
                if (rollDealTeamMember || rollModuleTeamMember || rollOpportunity || rollDealOwner || rollModuleOwner) {
                    this.rollAccess = true;
                    // this.isLoading = false;
                }
                else {
                    this.rollAccess = false;
                    // this.isLoading = false;
                }
            }
        }, err => {
            this._error.throwError('Oops! There seems to be some technical snag! Could you raise a Helpline ticket?');
            // this.isLoading = false;
        })
    }

    ngOnInit() {
        this.rollForUser();
        this.actionSummary();
        this.initilaizeTarget();

        let preposalID = sessionStorage.getItem('redirectToAction');
        console.log(localStorage.getItem("propUpdate"));
        console.log(preposalID);
        console.log("Preposal ID: ", preposalID);
        if (preposalID == null || preposalID == '1') {
            this.actionStateManagment();
        }
        else {
            this.calTable = [];
            this.getAllActionList();
            let res: any = sessionStorage.getItem('redirectToAction');
            console.log(res);
            sessionStorage.setItem('redirectToAction', '1')
        }

        if (localStorage.getItem("propUpdate") == "1" || preposalID) {
            this.calTable = [];
            this.getAllActionList();
            localStorage.setItem("propUpdate", "0");
        }

    }

    myCalendarViewList() {
        let input = {
            "Id": this.dealOverview.id,
            "Guid": this.createrId,
            "UserID": this.adid
        }
        // this.isLoading = true;
        this.deals.myCalenderList(input).subscribe(res => {
            console.log(res);
            if (res.ResponseObject.length) {
                this.calenderView(res.ResponseObject)
            }
            // this.isLoading = false;
        }, err => {
            this._error.throwError('Oops! There seems to be some technical snag! Could you raise a Helpline ticket?');
            // this.isLoading = false;
        })
    }

    closeCalendarViewList() {
        let input = {
            "Id": this.dealOverview.id,
            "UserID": this.adid
        }

        // this.isLoading = true;
        this.deals.closeCalenderList(input).subscribe(res => {
            console.log(res);
            if (!res.IsError) {
                this.calenderView(res.ResponseObject)
            }
            // this.isLoading = false;
        }, err => {
            this._error.throwError('Oops! There seems to be some technical snag! Could you raise a Helpline ticket?');
            // this.isLoading = false;
        })
    }

    checkeve(data) {
        console.log(data.startDate, new Date(data.startDate), 'data 009090');
        console.log(data.endDate, 'data 009090');
        const dt1 = new Date(data.startDate);
        const dt2 = new Date(data.endDate)

        const days = Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
        console.log(days)
        if (days <= 7) {
            this.currentView = 'TimelineWeek'
        } else {
            this.currentView = 'TimelineMonth'
        }
        console.log(this.currentView)

    }

    async actionStateManagment() {
        var orginalArray = this.deals.getCalData();
        this.store.pipe(select(CalenderActionList)).subscribe((res) => {
            if (res.calenderActionList) {
                console.log(res)
                console.log("Calender State Managements.", res.calenderActionList.ResponseObject);
                this.calenderView(res.calenderActionList.ResponseObject)
                // this.isLoading = false;
            }
            else {
                if (this.onlineOfflineService.isOnline) {
                    this.getCalenderViewList();
                    // this.isLoading = false;
                }
            }
        }, err => {
            this._error.throwError('Oops! There seems to be some technical snag! Could you raise a Helpline ticket?');
            // this.isLoading = false;
        })

        if (!this.onlineOfflineService.isOnline) {
            const CacheResponse = await this.deals.getCalenderListCacheData()
            console.log('CacheResponse-->', CacheResponse)
            if (CacheResponse) {
                if (CacheResponse.data.length > 0) {
                    this.calTable = CacheResponse.data;
                    this.tableTotalCount = CacheResponse.count;
                }
            }
        }

        if (localStorage.getItem('checkAction') != null) {
            this.getAllActionList();
            this.getCalenderViewList();
            localStorage.removeItem('checkAction');
        }
        else {
            //let oldDealID = localStorage.setItem("oldDealID",this.dealOverview.id);
            let oldDealID = localStorage.getItem("oldDealID");
            if (oldDealID == null || oldDealID != this.dealOverview.id) {
                console.log("Not Same");
                localStorage.setItem("oldDealID", this.dealOverview.id);
                this.getAllActionList();
            }
            else {
                console.log("Same");
                // this.isLoading = true;
                this.store.pipe(select(CreateActionList)).subscribe((res) => {
                    console.log(res)
                    if (res) {
                        if (res.CreateActionList) {
                            console.log('From state', res);
                            if (res.CreateActionList.length != 0) {
                                this.calTable = res.CreateActionList;
                                this.tableTotalCount = res.count;
                            }
                            else {
                                this.calTable = [{}];
                                this.tableTotalCount = res.count;
                            }
                            // this.isLoading = false;

                        } else {
                            if (this.onlineOfflineService.isOnline) {
                                this.getAllActionList();
                            }
                            // this.isLoading = false;
                        }
                    } else {
                        if (this.onlineOfflineService.isOnline) {
                            this.getAllActionList();
                        }
                        // this.isLoading = false;
                    }
                }, error => {
                    console.log('Error', error);
                    this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
                    // this.isLoading = false;
                })
                if (!this.onlineOfflineService.isOnline) {
                    const CacheResponse = await this.deals.getActionListCacheData()
                    console.log('CacheResponse-->', CacheResponse)
                    if (CacheResponse) {
                        if (CacheResponse.data.length > 0) {
                            this.calTable = CacheResponse.data;
                            this.tableTotalCount = CacheResponse.count;
                        }
                    }
                }
            }
            console.log(oldDealID)
        }
    }

    calenderView(res) {
        this.projectDataSource = [];
        this.categoryDataSource = [];
        this.resourceData1 = [];
        //console.log(res.length)
        if (res.length > 0) {
            //this.totalCalendarRecord = res.length;

            res.map(item => {
                if (item.Status == 1) {
                    this.categoryDataSource.push({
                        text: item.Name,
                        id: item.Id,
                        groupId: item.Id,
                        color: '#36abdd',
                        creator: item.CreatedBy.FullName,
                        owner: item.Owner.FullName,
                        startDate: item.StartDate,
                        endDate: item.EndDate,
                        status: "Open"
                    })

                    this.projectDataSource.push({
                        text: item.Name, id: item.Id, color: '#36abdd'
                    })
                }

                if (item.Status == 3) {
                    this.categoryDataSource.push({
                        text: item.Name,
                        id: item.Id,
                        groupId: item.Id,
                        color: '#6fbf49',
                        creator: item.CreatedBy.FullName,
                        owner: item.Owner.FullName,
                        startDate: item.StartDate,
                        endDate: item.EndDate,
                        status: "Closed"
                    })

                    this.projectDataSource.push({
                        text: item.Name, id: item.Id, color: '#6fbf49'
                    })
                }

                if (item.Status == 2 || item.Status == 4) {
                    this.categoryDataSource.push({
                        text: item.Name,
                        id: item.Id,
                        groupId: item.Id,
                        color: '#f4a624',
                        creator: item.CreatedBy.FullName,
                        owner: item.Owner.FullName,
                        startDate: item.StartDate,
                        endDate: item.EndDate,
                        status: "Pending For Approval"
                    })

                    this.projectDataSource.push({
                        text: item.Name, id: item.Id, color: '#f4a624'
                    })
                }
            })


            res.map(item => {
                if (item.Status == 1) {
                    this.resourceData1.push({
                        ProjectId: item.Id, StartTime: new Date(item.StartDate), EndTime: new Date(item.EndDate), backgdColor: '#36abdd'
                    })
                }

                if (item.Status == 3) {
                    this.resourceData1.push({
                        ProjectId: item.Id, StartTime: new Date(item.StartDate), EndTime: new Date(item.EndDate), backgdColor: '#6fbf49'
                    })
                }

                if (item.Status == 2 || item.Status == 4) {
                    this.resourceData1.push({
                        ProjectId: item.Id, StartTime: new Date(item.StartDate), EndTime: new Date(item.EndDate), backgdColor: '#f4a624'
                    })
                }


                if (item.Status == 1 && new Date() > new Date(item.EndDate)) {
                    let tomorrow = new Date(item.EndDate);
                    tomorrow.setDate(tomorrow.getDate() + 1);

                    this.resourceData1.push({
                        ProjectId: item.Id, StartTime: tomorrow, EndTime: new Date(), backgdColor: '#FF919E'
                    })
                }
            })
            this.eventSettings = {
                dataSource: <Object[]>extend([], this.resourceData1, null, true),
                //  fields: {
                //     startTime: { name: 'StartTime', validation: { required: true } },
                //     endTime: { name: 'EndTime', validation: { required: true } }
                // }
            };

            this.totalCalendarRecord = this.projectDataSource.length;

            // console.log("First Array: ", this.projectDataSource);
            // console.log("Second Array: ", this.resourceData1);
            // console.log("Third Array: ", this.categoryDataSource)
        }
        else {
            this.categoryDataSource = [{}];
            this.projectDataSource = [{}];
            this.resourceData1 = [{}];
            this.totalCalendarRecord = 0;
        }

    }

    actionSummary() {
        let input = {
            "UserID": this.adid,
            "Id": this.dealOverview.id
        }
        // this.isLoading = true;
        this.deals.actionSummary(input).subscribe(res => {
            console.log(res)
            if (!res.IsError) {
                this.summaryArray = res.ResponseObject;
            }
            // this.isLoading = false;
        }, err => {
            this._error.throwError('Oops! There seems to be some technical snag! Could you raise a Helpline ticket?');
            // this.isLoading = false;
        })
    }

    getCalenderViewList() {
        console.log(this.dealOverview.id)
        console.log(this.dealOverview.id)
        let getCalenterList = {
            "UserID": this.adid,
            "Id": this.dealOverview.id,
            "PageSize": 10000,
            "LastRecordId": 1,
        }

        console.log(getCalenterList)
        // this.isLoading = true;
        this.deals.getCalenterList(getCalenterList).subscribe(res => {
            if (res.ResponseObject.length > 0) {
                this.calenderView(res.ResponseObject)
            }
            // this.isLoading = false;
        }, err => {
            this._error.throwError('Oops! There seems to be some technical snag! Could you raise a Helpline ticket?');
            // this.isLoading = false;
        })
    }

    tableData(indexNew, res) {
        console.log(res)
        console.log("Page no. :", this.pageNo)
        console.log("Page count :", this.pageCount)
        let newarr = [];
        indexNew = (this.pageNo * this.pageCount) - (this.pageCount - 1);

        if (res.ResponseObject.length > 0) {
            res.ResponseObject.map((element, i) => {
                var depAction = element.DependentActions;
                var depActionArray: any = [];
                depAction.map((item) => {
                    depActionArray.push(item.Name);
                })
                let dependencies = depActionArray.filter(item => item).join(', ');
                if ((dependencies.match(/,/g) || []).length > 0) {
                    dependencies = depActionArray[0] + " +" + (dependencies.match(/,/g) || []).length;
                }
                newarr.push({
                    "index": indexNew++,
                    "ProposalId": element.ProposalId,
                    "ProposalData": [{ "SubmissionDate": element.EndDate, "TemplateType": element.TemplateType, "FullName": element.Approver.FullName, "AdId": element.Approver.AdId }],
                    "id": element.Id,
                    "actionName": element.Name,
                    "actionType": element.ActionType.Value,
                    "actionOwner": element.Owner.FullName == '' ? '_' : element.Owner.FullName,
                    "startDate": this.getLocaleDateFormat(element.StartDate),
                    "endDate": this.getLocaleDateFormat(element.EndDate),
                    //"endDate": this.datePipe.transform(element.EndDate, 'dd-MMM-yy'),
                    "module": element.Module.Value == '' ? '_' : element.Module.Value,
                    "status": element.Status == 1 ? "Open" : element.Status == 3 ? "Closed" : "Pending For Approval",
                    // "statusclass": status,
                    "approval": element.IsApprovalRequired == true ? "Yes" : "No",
                    "attachment": element.Document.Name.substring(20),
                    "approver": element.Approver.FullName == '' ? '_' : element.Approver.FullName,
                    "escalateCont": element.Escalation == '' ? '_' : element.Escalation,
                    "dependencies": dependencies == '' ? '_' : dependencies,
                    "attachmentUrl": element.Document.Url,
                    "editBtnVisibility": element.IsToShowEditButton,
                    "rowDownloadBtnVisibility": true,
                    "deleteBtnVisibility": element.ProposalId == -1 ? element.IsToShowDeleteButton : true,
                    "approverBtnVisibility": true,
                    "reworkBtnVisibility": true,
                    "tickedBtnVisibility": true,
                    "sendBtnVisibility": true,
                    "subData": this.childActions(element.ChildActions)
                })
            })
            this.tableTotalCount = res.TotalRecordCount;
        }
        console.log(newarr)
        return newarr;
    }

    getLocaleDateFormat(dateConvert) {
    const dataModifier = new DateModifier();
    return dataModifier.modifier(dateConvert);
    }

    childActions(data) {
        let newarr = [];
        if (data.length > 0) {
            console.log(data);
            data.map(element => {
                newarr.push({
                    "ProposalId": element.ProposalId,
                    "ProposalData": [{ "SubmissionDate": element.EndDate, "TemplateType": element.TemplateType }],
                    "id": element.Id,
                    "actionName": element.Name,
                    "actionType": element.ActionType.Value == '' ? '_' : element.ActionType.Value,
                    "actionOwner": element.Owner.FullName == '' ? '_' : element.Owner.FullName,
                    "module": element.Module.Value == '' ? '_' : element.Module.Value,
                    "startDate": this.getLocaleDateFormat(element.StartDate),
                    "endDate": this.getLocaleDateFormat(element.EndDate),
                    "status": element.Status == 1 ? "Open" : element.Status == 3 ? "Closed" : "Pending For Approval",
                    "approval": element.IsApprovalRequired == true ? "Yes" : "No",
                    "attachment": "",
                    "approver": element.Approver.FullName == '' ? '_' : element.Approver.FullName,
                    "escalateCont": element.Escalation == '' ? '_' : element.Escalation,
                    "dependencies": "_",
                    "attachmentUrl": "",
                    "editBtnVisibility": true,
                    "rowDownloadBtnVisibility": true,
                    "deleteBtnVisibility": true,
                    "approverBtnVisibility": true,
                    "reworkBtnVisibility": true,
                    "tickedBtnVisibility": true,
                    "sendBtnVisibility": true,
                });
            });
            return newarr;
        } else {
            return newarr;
        }
    }

    globalSearch(input) {
        console.log(input)
        console.log(this.searchId)
        if (input.Guid) {
            if (this.searchId == 2) {
                console.log("My Actions");
                this.isLoading = true;
                this.deals.getMyActionList(input).subscribe(res => {
                    console.log(res);
                    this.calTable = [];
                    var indexNew;
                    console.log("Search ID: ", this.searchId, "Pre Search ID:", this.preSearchId)
                    if (this.searchId != this.preSearchId) {
                        this.preSearchId = this.searchId;
                        this.myActions = [];
                    }

                    if (this.myActions.length == 0) {
                        indexNew = 1;
                    }
                    else {
                        indexNew = this.myActions.length + 1;
                    }

                    let newarr = this.tableData(indexNew, res);
                    if (this.myActions.length > 4) {
                        this.myActions = this.myActions.concat(newarr);
                        this.calTable = this.myActions;
                    }
                    else {
                        if (newarr.length > 0) {
                            this.myActions = newarr;
                            this.calTable = newarr;
                        }
                        else {
                            this.calTable = [{}];
                        }
                    }
                    console.log(this.calTable)
                    this.isLoading = false;
                })
            }
            if (this.searchId == 3) {
                console.log("Closed Actions")
                let closeActonInput = {
                    "UserID": this.adid,
                    "Id": input.Id,
                    "PageSize": input.PageSize,
                    "LastRecordId": input.LastRecordId,
                }
                console.log(closeActonInput)
                this.isLoading = true;
                this.deals.ClosedActionList(closeActonInput).subscribe(res => {
                    let indexNew;
                    console.log("Search ID: ", this.searchId, "Pre Search ID:", this.preSearchId)

                    if (this.searchId != this.preSearchId) {
                        this.preSearchId = this.searchId;
                        this.closeAction = [];
                    }
                    if (this.closeAction.length > 0) {
                        indexNew = this.closeAction.length + 1;
                    }
                    else {
                        indexNew = 1;
                    }
                    let newarr = this.tableData(indexNew, res);
                    console.log(this.closeAction.length)
                    if (this.closeAction.length > 4) {
                        this.closeAction = this.closeAction.concat(newarr);
                        this.calTable = this.closeAction;
                    }
                    else {
                        if (newarr.length > 0) {
                            this.closeAction = newarr;
                            this.calTable = newarr;
                        }
                        else {
                            this.calTable = [{}];
                        }
                    }
                    console.log(this.calTable)
                    this.isLoading = false;
                })
            }
        }
        else {
            if (this.searchId == 2) {
                console.log("Search My Actions")
                console.log(input)
                let myActonInput = {
                    "Id": input.Id,
                    "SearchText": input.SearchText,
                    "PageSize": input.PageSize,
                    "LastRecordId": input.LastRecordId,
                    "Guid": this.createrId
                }
                console.log(myActonInput);
                this.isLoading = true;
                this.deals.getSearchMyActionList(myActonInput).subscribe(res => {
                    let indexNew;
                    if (this.searchName != input.SearchText) {
                        this.searchName = input.SearchText;
                        indexNew = 1;
                    }
                    else {
                        indexNew = this.searchMyAction.length + 1;
                    }

                    let newarr = this.tableData(indexNew, res);
                    if (this.searchMyAction.length > 4) {
                        this.searchMyAction = this.searchMyAction.concat(newarr);
                        this.calTable = this.searchMyAction;
                    }
                    else {
                        if (newarr.length > 0) {
                            this.searchMyAction = newarr;
                            this.calTable = newarr;
                        }
                        else {
                            this.calTable = [{}];
                        }
                    }
                    console.log(this.calTable);
                    this.isLoading = false;
                })
            }
            else if (this.searchId == 3) {
                console.log("Search Closed Actions")
                console.log(input)
                let myCloseInput = {
                    "Id": input.Id,
                    "SearchText": input.SearchText,
                    "PageSize": input.PageSize,
                    "LastRecordId": input.LastRecordId,
                }
                console.log(myCloseInput);
                this.isLoading = true;
                this.deals.searchClosedActionList(myCloseInput).subscribe(res => {
                    let indexNew;

                    if (this.searchName != input.SearchText) {
                        this.searchName = input.SearchText;
                        indexNew = 1;
                    }
                    else {
                        indexNew = this.searchCloseAction.length + 1;
                    }

                    let newarr = this.tableData(indexNew, res);
                    if (this.searchCloseAction.length > 4) {
                        this.searchCloseAction = this.searchCloseAction.concat(newarr);
                        this.calTable = this.searchCloseAction;
                    }
                    else {
                        if (newarr.length > 0) {
                            this.searchCloseAction = newarr;
                            this.calTable = newarr;
                        }
                        else {
                            this.calTable = [{}];
                        }
                    }
                    console.log(this.calTable);
                    this.isLoading = false;
                })
            }
            else {
                this.isLoading = true;
                this.deals.globalActionSearch(input).subscribe(res => {
                    console.log(res);
                    var indexNew;

                    if (this.checkingTime == 0 || this.searchName != input.SearchText) {
                        this.searchName = input.SearchText;
                        this.calTable = [];
                        this.checkingTime = this.checkingTime + 1;
                        indexNew = 1;
                    }
                    else {
                        indexNew = this.calTable.length;
                    }

                    let newarr = this.tableData(indexNew, res);
                    if (this.calTable.length > 4) {
                        this.calTable = this.calTable.concat(newarr);
                    }
                    else {
                        if (newarr.length > 0) {
                            this.calTable = newarr;
                        }
                        else {
                            this.calTable = [{}];
                        }
                    }
                    console.log(this.calTable);
                    this.isLoading = false;
                })
            }
        }
    }

    openApprove(actionName, actionMessage): void {
        const dialogRef = this.dialog.open(approveActionComponent, {
            width: '400px',
            data: { 'actionName': actionName, 'message': actionMessage }
        });

        dialogRef.afterClosed().subscribe(res => {
            this.calTable = [];
            this.getAllActionList();
        })
    }

    approvarAction(id) {
        let input = { "Id": id, "UserID": this.adid }
        // this.isLoading = true;
        this.deals.approvarAction(input).subscribe(res => {
            console.log(res);
            if (!res.IsError) {
                if (res.ResponseObject.IsPresentDealDependetAction) {
                    this.openApprove(res.ResponseObject.Name, res.Message);
                    // this.isLoading = false;
                }
                else {
                    this._error.throwError(res.Message);
                    this.calTable = [];
                    this.getAllActionList();
                    this.getCalenderViewList();
                    // this.isLoading = false;
                }
            }
        }, error => {
            this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
            // this.isLoading = false;
        })
    }

    reWorkAction(id) {
        let input = {
            "Id": id,
            "Guid": this.createrId
        }
        // this.isLoading = true;
        this.deals.reWorkAction(input).subscribe(res => {
            console.log(res)
            this._error.throwError(res.Message);
            this.calTable = [];
            this.getAllActionList();
            // this.isLoading = false;
        }, error => {
            this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
            // this.isLoading = false;
        })
    }

    getAllActionList() {
        console.log(this.searchId)
        console.log(this.dealOverview.id);
        let searchText;
        this.IsGlobalSearchText == false ? searchText = '' : searchText = this.searchByText;
        let input = {
            "SortByPropertyName": this.sortByPropertyName,
            "Id": this.dealOverview.id,
            "PageSize": this.pageCount,
            "LastRecordId": this.pageNo,
            "Guid": this.createrId,
            "UserID": this.adid,
            "Status": this.actionStatus,
            "IsMyActions": this.myActionStatus,
            "IsGlobalSearchText": this.IsGlobalSearchText,
            "SearchTextOnColumn": searchText,
            "FilterByPropertyName": this.filterByProparyName,
        };
        console.log(input)
        this.isLoading = true;
        this.deals.actionList(input).subscribe(res => {
            this.isLoading = false;
            console.log(res)
            if (!res.IsError) {
                console.log(this.calTable);
                if (this.PrevSearcText != this.searchByText) {
                    this.calTable = [];
                }

                this.PrevSearcText = this.searchByText;
                let indexNew = this.calTable.length;
                console.log(indexNew)
                indexNew != 0 ? indexNew = this.calTable.length + 1 : indexNew = 1;
                if (res.ResponseObject.length > 0) {
                    console.log(res.ResponseObject)
                    let newarr = this.tableData(indexNew, res);
                    if (newarr.length > 0) {
                        if (this.calTable.length > 0) {
                            this.calTable = this.calTable.concat(newarr);
                        } else {
                            this.calTable = newarr;
                        }
                    }
                    else {
                        this.calTable = [{}];
                    }

                    let myArray:any = [];
                    if(this.calTable.length > 0){
                        this.calTable.map(item=>{
                            myArray.push(item.id);
                        });

                        for(let i=1; i<=myArray.length; i++){
                            if(myArray[0] == myArray[i]){
                                this.calTable = newarr;
                                break;
                            }
                        }
                    }

                    console.log("Finel List: ", this.calTable)
                    this.store.dispatch(new CreateListAction({ CreateActionList: this.calTable, count: this.tableTotalCount }));
                } else {
                    this.calTable = [{}];
                    this.tableTotalCount = 0;
                }
            } else {
                this.calTable = [{}];
                this.tableTotalCount = 0;
                this._error.throwError(res.Message);
            }
        }, error => {
            this.isLoading = false;
            this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
        });
    }

    actionRouting(id: any) {
        console.log("Action Clicked: ", id)
        this.getSetData.setData(id);
        this.router.navigate(['/deals/createAction']);
    }

    // Initialize the Dialog component target element.
    public initilaizeTarget: EmitType<object> = () => {
        this.targetElement = this.container.nativeElement.parentElement;
    }
    getWeekDetails(value: CellTemplateArgs): string {
        return 'Week ' + getWeekNumber((value as CellTemplateArgs).date);
    }

    getDateDetails(value: CellTemplateArgs): string {
        return this.instance.formatDate((value as CellTemplateArgs).date, { skeleton: 'E' });
    }
    getDayDetails(value: CellTemplateArgs): string {
        return this.instance.formatDate((value as CellTemplateArgs).date, { skeleton: 'd' });
    }

    onCellClick(): void {
        console.log('Schedule <b>Cell Click</b> event called<hr>');
    }
    getMonthDetails(value: CellTemplateArgs): string {
        return this.instance.formatDate((value as CellTemplateArgs).date, { skeleton: 'yMMMM' });
    }
    onActionComplete(event: ActionEventArgs): void {
        // console.log(event, 'eeeevvvvvvvvvveeeeeeeeeee')
    }
    onActionBegin(args: ActionEventArgs & ToolbarActionArgs): void {
        // console.log(args)
    }
    onEventRendered(args: EventRenderedArgs): void {
        // console.log(args, 'arguments----')
    }
    public onPopupOpen(args: PopupOpenEventArgs): void {
        console.log(args, 'klklklklk')
        //    alert("open");
        args.cancel = true;

        if (args.type === 'Editor') {
            let statusElement: HTMLInputElement = args.element.querySelector('#EventType') as HTMLInputElement;
            console.log(statusElement)
            if (!statusElement.classList.contains('e-dropdownlist')) {
                let dropDownListObject: DropDownList = new DropDownList({
                    placeholder: 'Choose status', value: statusElement.value,
                    dataSource: ['New', 'Requested', 'Confirmed']
                });

                dropDownListObject.appendTo(statusElement);
                statusElement.setAttribute('name', 'EventType');
            }
            let startElement: HTMLInputElement = args.element.querySelector('#StartTime') as HTMLInputElement;
            if (!startElement.classList.contains('e-datetimepicker')) {
                new DateTimePicker({ value: new Date(startElement.value) || new Date() }, startElement);
            }
            let endElement: HTMLInputElement = args.element.querySelector('#EndTime') as HTMLInputElement;
            if (!endElement.classList.contains('e-datetimepicker')) {
                new DateTimePicker({ value: new Date(endElement.value) || new Date() }, endElement);
            }
        } else if (args.type === 'QuickInfo') {
            //  console.log(args.data,'klklklk')
            //  console.log(resourceData)
        }
    }


    // Hide the Dialog when click the footer button.
    @ViewChild('scheduleObj')

    public scheduleObj: ScheduleComponent;


    onCloseClick(): void {
        this.scheduleObj.quickPopup.quickPopupHide();
    }

    getselectedDate(dates) {
        let res = false;
        const d1 = new Date(dates).getTime()
        const d2 = new Date(this.selectedDate).getTime()
        // console.log(new Date(dates).getTime()  +" ==== "+ new Date(this.selectedDate).getTime() )
        if (d1 === d2) {
            res = true;
        }
        return res;
    }

    selectdate(data) {

        //console.log(data,'color data');

        this.selectedDates = data.date
        if (data.date.getDay() === 0) {
            // To highlight the week end of every month
            // args.element.classList.add('e-highlightweekend');
            //  console.log('this is sunday');
        }
        if (data.date.getDay() === 1) {
            // To highlight the week end of every month
            // args.element.classList.add('e-highlightweekend');
            // console.log('this is monday');
        }
        if (data.date.getDay() === 2) {
            // To highlight the week end of every month
            // args.element.classList.add('e-highlightweekend');
            // console.log('this is tue');
        }
        if (data.date.getDay() === 3) {
            // To highlight the week end of every month
            // args.element.classList.add('e-highlightweekend');
            //console.log('this is wed');
        }
        if (data.date.getDay() === 4) {
            // To highlight the week end of every month
            // args.element.classList.add('e-highlightweekend');
            // console.log('this is thu');
        }
        if (data.date.getDay() === 5) {
            // To highlight the week end of every month
            // args.element.classList.add('e-highlightweekend');
            // console.log('this is fri');
        }
        if (data.date.getDay() === 6) {
            // To highlight the week end of every month
            // args.element.classList.add('e-highlightweekend');
            //console.log('this is sat');
        }
    }

    selectdatedd(data) {
        let res = false;
        if (data.date.getDay() === 0 || data.date.getDay() === 6) {
            // To highlight the week end of every month
            // args.element.classList.add('e-highlightweekend');
            // console.log('this is sunday')
            res = true;
        }
        return res;
    }

    onLoad(args: any) {
        /*Date need to be disabled*/
        if (args.date.getDay() === 0 || args.date.getDay() === 6) {
            args.isDisabled = true;
        }
    }


    show = false;
    public onOpenDialog(event: any): void {
        // Call the show method to open the Dialog
        // alert('open')
        console.log(event)
        //this.template.show();
        this.show = true;
        //    this.details = event;
    }
    closedialog() {
        alert('close');
        this.show = false;
    }


    highlightWeekend(args) {
        console.log(args, 'color ')

    }
    getcolor(date) {
        let clr = '#F48F9E'
        if (date.Stage === 'approve') {
            clr = '#e6f0fa'
        } if (date.Stage === 'complete') {
            clr = '#7E9B69';
        }
        return clr;
    }
    getCellContent(date) {
        if (date.getDay() === 0) {

            return date;
        }

    }
    onselect(event) {
        this.currentView = event.target.value;

        if (event.target.value === 'year') {
            this.tableview = true;
        } else {
            this.tableview = false;
        }
        console.log(this.currentView, 'venu checking time scale');
    }
    // search box

    expand = false;
    searchItem
    inputClick(event: any) {
        console.log(event.target.value.length);
        if (event.target.value.length > 2) {
            let getCalenterList = {
                "Id": this.dealOverview.id,
                "SearchText": event.target.value,
                "PageSize": 10000,
                "LastRecordId": 1,
                "UserID": this.adid
            }

            // this.isLoading = true;
            this.deals.getCalenderSearch(getCalenterList).subscribe(res => {
                console.log(res.ResponseObject);
                if (res.ResponseObject.length > 0) {
                    this.calenderView(res.ResponseObject)
                }
                // this.isLoading = false;
            }, error => {
                this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
                // this.isLoading = false;
            })
        }
        this.expand = true;
    }

    OutsideInput() {
        this.expand = false;
    }


    close() {
        this.expand = false;
        this.searchItem = "";
        this.ngOnInit();
    }
    // MORE ACTION STARTS **************
    showContent: boolean = false;

    contentArray = [
        { className: 'mdi mdi-close', value: 'Disqualify' },
        { className: 'mdi mdi-crop-square', value: 'Nurture' },
        // { className: 'mdi mdi-bullhorn', value: 'Request campaign' }
    ]

    additem(item) {

        this.showContent = false;
    }

    closeContent() {
        this.showContent = false;
    }

    toggleContent() {
        this.showContent = !this.showContent;
    }
    // MORE ACTION ENDS *******************
    view: boolean = false;
    tableView() {
        this.view = !this.view;
    }
    // search box ends

    pagination(pageData) {
        console.log(pageData);
        switch (pageData.action) {
            case 'pagination': {
                this.pageNo = pageData.currentPage;
                this.pageCount = pageData.itemsPerPage;
                this.paginationPageNo.RequestedPageNumber = pageData.currentPage;
                this.paginationPageNo.PageSize = pageData.itemsPerPage;
                console.log(pageData.objectRowData);
                if (this.myActionStatus == 0 && this.actionStatus == 0) {
                    this.myActionStatus = 0;
                    this.actionStatus = 0;
                } else if (this.myActionStatus == 1) {
                    this.myActionStatus = 1;
                    this.actionStatus = 0;
                } else {
                    this.myActionStatus = 0;
                    this.actionStatus = 3;
                }
                this.getAllActionList();
                return of('Search Trigger');
            }
        }
    }

    performTableChildAction(childActionRecieved): Observable<any> {
        var actionRequired = childActionRecieved;
        console.log(actionRequired);
        switch (actionRequired.action) {
            case 'attachment': {
                console.log("Action is: ", actionRequired.action)
                this.downloadDocument(actionRequired.objectRowData[0])
                return of('Action Trigger');
            }

            case 'actionName': {
                console.log("Action is: ", actionRequired.action)
                console.log(actionRequired.objectRowData[0].id)
                this.getSetData.setData(actionRequired.objectRowData[0].id);
                this.router.navigate(['/deals/createAction']);
                return of('Action Trigger');
            }

            case 'send': {
                console.log("Action is: ", actionRequired.action)
                console.log(actionRequired.objectRowData[0].id)
                this.getSetData.setData(actionRequired.objectRowData[0].id);
                localStorage.setItem("send", "1");
                this.router.navigate(['deals/createNewAction']);
                return of('Action Trigger');
            }

            case 'REWORK': {
                console.log("Action is: ", actionRequired.action)
                console.log(actionRequired.objectRowData.rowData.id)
                this.reWorkAction(actionRequired.objectRowData.rowData.id);
                return of('Action Trigger');
            }

            case 'Check1': {
                console.log("Action is: ", actionRequired.action)
                console.log(actionRequired.objectRowData[0].id)
                this.approvarAction(actionRequired.objectRowData[0].id);
                return of('Action Trigger');
            }

            case 'Approvar': {
                console.log("Action is: ", actionRequired.action)
                console.log(actionRequired.objectRowData[0].id)
                this.approvarAction(actionRequired.objectRowData[0].id);
                return of('Action Trigger');
            }

            case 'Download': {
                console.log("Action is: ", actionRequired.action);
                console.log(actionRequired.objectRowData[0].attachmentUrl)
                this.downloadDocument(actionRequired.objectRowData[0].attachmentUrl);
                return of('Action Trigger');
            }
            case 'edit': {
                console.log("Action is: ", actionRequired.action)
                console.log("Proposal details: ", actionRequired)
                console.log(actionRequired.objectRowData[0]);
                if (actionRequired.objectRowData[0].ProposalId > 0) {
                    let proPreData: any = actionRequired.objectRowData[0];
                    let proName = proPreData.actionName;
                    if (proName.includes("_")) {
                        proName = proPreData.actionName.substring(0, proPreData.actionName.indexOf("_"));
                    }

                    let proDataArr: any = {
                        "indxparent": proName,
                        "submissionDate": proPreData.ProposalData[0].SubmissionDate,
                        "id": proPreData.ProposalId,
                        "templateType": proPreData.ProposalData[0].TemplateType,
                        "template": 'UploadProposal',
                        "path": proPreData.attachmentUrl,
                        "approverData": [{"FullName":proPreData.ProposalData[0].FullName, "AdId":proPreData.ProposalData[0].AdId}]
                    };
                    sessionStorage.setItem('proposalEditData', JSON.stringify(proDataArr));
                    sessionStorage.setItem('routingTab', '1');
                    this.router.navigate(['/deals/editDocument']);
                } else {
                    console.log(actionRequired.objectRowData[0].id)
                    this.getSetData.setData(actionRequired.objectRowData[0].id);
                    this.router.navigate(['deals/createNewAction']);
                }
                return of('Action Trigger');
            }
            case 'delete': {
                console.log("Action is: ", actionRequired.action);
                console.log("Delete Action ID: ", actionRequired.objectRowData.id)
                var input = { "Id": actionRequired.objectRowData.id, "UserID": this.adid };
                this.isLoading = true;
                this.deals.deleteAction(input).subscribe(res => {
                    console.log(res)
                    if (!res.IsError) {
                        this.calTable = this.calTable.filter(res => res.id !== actionRequired.objectRowData.id)
                        this.tableTotalCount = this.tableTotalCount - 1;
                        this.store.dispatch(new CreateListAction({ CreateActionList: this.calTable, count: this.tableTotalCount }));
                        this._error.throwError(res.Message);
                        this.getCalenderViewList();
                        this.isLoading = false;
                    } else {
                        this._error.throwError(res.Message);
                        this.isLoading = false;
                    }
                }, error => {
                    this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
                    this.isLoading = false;
                })
                return of('Action Trigger');
            }

            case 'search': {
                console.log("Action is: ", actionRequired.action)
                console.log(actionRequired);
                console.log(this.searchId)
                this.paginationPageNo.RequestedPageNumber = 1;
                this.pageNo = 1;
                if ((actionRequired.objectRowData).length > 0) {
                    this.filterByProparyName = "Name";
                    this.IsGlobalSearchText = true;
                    this.searchByText = actionRequired.objectRowData;
                } else {
                    this.filterByProparyName = "";
                    this.IsGlobalSearchText = false;
                    this.searchByText = "";
                }
                if(actionRequired.objectRowData == ""){
                    this.calTable = [];
                }
                this.getAllActionList();
                return of('Action Trigger');
            }

            case 'tabNavigation': {
                console.log("Action is: ", actionRequired.action)
                console.log(actionRequired.objectRowData.data.id);
                this.paginationPageNo.RequestedPageNumber = 1;
                this.pageNo = 1;
                console.log("Current page: ", actionRequired.pageData.currentPage);
                this.IsGlobalSearchText = false;
                this.filterByProparyName = "";
                this.calTable = [];
                if (actionRequired.objectRowData.data.id == 2) {
                    this.selectAction = actionRequired.objectRowData.data.id;
                    this.searchId = actionRequired.objectRowData.data.id;
                    console.log(this.myActionStatus)
                    if (this.myActionStatus != 1) {
                        this.myActionStatus = 1;
                        this.actionStatus = 0;
                    }
                } else if (actionRequired.objectRowData.data.id == 3) {
                    this.selectAction = actionRequired.objectRowData.data.id;
                    this.searchId = actionRequired.objectRowData.data.id;
                    if (this.actionStatus != 2) {
                        this.myActionStatus = 0;
                        this.actionStatus = 3;
                    }
                } else {
                    this.selectAction = actionRequired.objectRowData.data.id;
                    this.searchId = actionRequired.objectRowData.data.id;
                    if (this.myActionStatus != 0 || this.actionStatus != 0) {
                        this.myActionStatus = 0;
                        this.actionStatus = 0;
                    }
                }
                this.getAllActionList();
                return of('Action Trigger');
            }

            case 'sortHeaderBy': {
                console.log("Action is: ", actionRequired.action)
                this.paginationPageNo.RequestedPageNumber = 1;
                this.pageNo = 1;
                let sortOrder = actionRequired.filterData.sortOrder;
                let header = actionRequired.filterData.sortColumn;
                let replaceHeader = this.getInputHeaderName(header);
                console.log("Sort By: ", sortOrder);
                console.log(this.orderByHeader)
                if (this.orderByHeader == 'DESC') {
                    this.orderByHeader = "ASC";
                } else {
                    this.orderByHeader = "DESC";
                }

                if (sortOrder) {
                    this.sortByPropertyName = replaceHeader + " " + this.orderByHeader;
                } else {
                    this.sortByPropertyName = replaceHeader + " " + this.orderByHeader;
                }

                console.log("Order: ", this.orderByHeader)
                this.calTable = [];
                this.getAllActionList();
                return of('Action Trigger');
            }

            //Filter By Header
            case 'columnFilter': {
                console.log("Action is: ", actionRequired.action);
                actionRequired.filterData.isApplyFilter == true ? this.hidecreateAction = true : this.hidecreateAction = false;
                this.headerFilteration(childActionRecieved);
                return of('Action Trigger');
            }

            case 'ClearAllFilter':{
                this.clearAllHeaderFilter();
                return of('Action Trigger');
            }

            case 'cancelMobileFilter':{
                this.hidecreateAction = true;
            }

            case 'loadMoreFilterData': {
                console.log("Action is: ", actionRequired.action);
                this.headerFilteration(childActionRecieved);
                return of('Action Trigger');
            }

            case 'columnSearchFilter': {
                console.log("Action is: ", actionRequired.action);
                this.headerFilteration(childActionRecieved);
                return of('Action Trigger');
            }
        }
    }

    clearAllHeaderFilter(){
        this.getAllActionList();
    }

    getInputHeaderName(header) {
        let name: any;
        if (header == 'actionName') {
            name = "Name";
        } else if (header == 'actionType') {
            name = "ActionType.Value";
        } else if (header == 'actionOwner') {
            name = "Owner.Fullname";
        } else if (header == 'startDate') {
            name = "StartDate";
        } else if (header == 'endDate') {
            name = "EndDate";
        } else if (header == 'module') {
            name = "Module.Value";
        } else if (header == 'status') {
            name = "Status";
        } else if (header == 'approval') {
            name = "IsApprovalRequired";
        } else if (header == 'attachment') {
            name = "Document.Name";
        } else if (header == 'approver') {
            name = "Approver.Fullname";
        } else if (header == 'escalateCont') {
            name = "Escalation";
        } else if (header == 'dependencies') {
            name = "DependentActions";
        }
        return name;
    }

    loadMoreFilterData(childActionRecieved) {
        console.log("Load More filter data:")
        console.log(childActionRecieved)
    }

    headerFilteration(childActionRecieved) {
        console.log("All Data: ", childActionRecieved);
        let HeaderName = childActionRecieved.filterData.headerName;
        console.log("OrderLength: ", childActionRecieved.filterData.order.length);
        this.allHeaderFilter(HeaderName, childActionRecieved);
    }

    selectedArrayHeader(HeaderName, childActionRecieved) {
        let intArray: any = [];
        if (HeaderName == 'actionName') {
            intArray = childActionRecieved.filterData.filterColumn.actionName;
        } else if (HeaderName == 'actionType') {
            intArray = childActionRecieved.filterData.filterColumn.actionType;
        } else if (HeaderName == 'actionOwner') {
            intArray = childActionRecieved.filterData.filterColumn.actionOwner;
        } else if (HeaderName == 'approval') {
            intArray = childActionRecieved.filterData.filterColumn.approval;
        } else if (HeaderName == 'approver') {
            intArray = childActionRecieved.filterData.filterColumn.approver;
        } else if (HeaderName == 'attachment') {
            intArray = childActionRecieved.filterData.filterColumn.attachment;
        } else if (HeaderName == 'dependencies') {
            intArray = childActionRecieved.filterData.filterColumn.dependencies;
        } else if (HeaderName == 'endDate') {
            intArray = childActionRecieved.filterData.filterColumn.endDate;
        } else if (HeaderName == 'escalateCont') {
            intArray = childActionRecieved.filterData.filterColumn.escalateCont;
        } else if (HeaderName == 'module') {
            intArray = childActionRecieved.filterData.filterColumn.module;
        } else if (HeaderName == 'startDate') {
            intArray = childActionRecieved.filterData.filterColumn.startDate;
        } else if (HeaderName == 'status') {
            intArray = childActionRecieved.filterData.filterColumn.status;
        }
        return intArray;
    }

    allHeaderList(HeaderName, childActionRecieved) {
        console.log('checking..')
        let SearchText = '';
        let intArray: any = [];
        let inputHeaderName = this.getInputHeaderName(HeaderName);
        intArray = this.selectedArrayHeader(HeaderName, childActionRecieved);
        
        if(this.PrevSearcText.includes(inputHeaderName)){
            console.log("Prev data: ", this.PrevSearcText, " Header name: ", this.PrevSearcText.includes("Owner.FullName"), " header: ", HeaderName)
            this.headerListClearAgain(HeaderName)
        }

        console.log("header name: ", inputHeaderName)
        console.log("Array Data: ", intArray)
        intArray.map(item => {
            let value = item.name;
            SearchText = SearchText + ',' + value;
        });
        console.log("Pre. date: ", this.PrevSearcText)
        if (this.PrevSearcText != '') {
            SearchText = this.PrevSearcText + '|||' + inputHeaderName + "!!!" + SearchText.slice(1);
            this.PrevSearcText = SearchText;
        } else {
            SearchText = inputHeaderName + "!!!" + SearchText.slice(1);
            this.PrevSearcText = SearchText;
        }

        SearchText = SearchText.replace("Open", "1");
        SearchText = SearchText.replace("Pending For Approval", "2");
        SearchText = SearchText.replace("Close", "3");
        if(inputHeaderName == 'StartDate' || inputHeaderName == 'EndDate'){
            console.log("Start date: ", this.getLocaleDateFormat(intArray[0].filterStartDate._d));
            SearchText = SearchText.replace("undefined", "");
            let date:any = this.getDate(intArray[0].filterStartDate._d,intArray[0].filterEndDate._d) 
            SearchText = SearchText+date.toString();
            this.PrevSearcText = SearchText;
        }
        console.log("Header Name: ", HeaderName, "Search Text: ", SearchText);
        this.filterWithData(HeaderName, SearchText);
    }

    getDate(startDate, stopDate) {
        let dateArr: any = [];
        let diffDays = this.date_diff_indays(startDate, stopDate); 
        for(let i = 1; i <= diffDays; i++){
            if(stopDate > startDate){
                dateArr.push(this.getLocaleDateFormat(startDate));
                var currentDate = new Date(startDate);
                startDate = currentDate.setDate(currentDate.getDate() + 1);
                startDate = new Date(startDate)
            }
        }
        return dateArr;
    }

    date_diff_indays(date1, date2) {
        let dt1 = new Date(date1);
        let dt2 = new Date(date2);
        return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
    }

    headerListClear(HeaderName) {
        console.log("Header List Clear:")
        let SearchText = '';
        let n1;
        let inputHeaderName = this.getInputHeaderName(HeaderName);
        console.log("Prev Text: ", this.PrevSearcText);

        console.log("Check header: ", inputHeaderName)
        let str = this.PrevSearcText;
        let res = str.indexOf(inputHeaderName);
        let n = str.indexOf("|||", res);
        if (n == -1) {
            n1 = str.substring(res);
        } else {
            n1 = str.substring(res, n + 3)
        }
        let n2 = str.replace(n1, '');
        this.PrevSearcText = n2;
        let lastString = this.PrevSearcText.substring(this.PrevSearcText.length - 3, this.PrevSearcText.length);
        if (lastString == '|||') {
            this.PrevSearcText = this.PrevSearcText.substring(0, this.PrevSearcText.length - 3);
        }
        SearchText = this.PrevSearcText;
        if (SearchText == '') {
            HeaderName = '';
            SearchText = '';
        }
        console.log("Header Name: ", HeaderName, "Search Text: ", SearchText);
        this.filterWithData(HeaderName, SearchText);
    }

    headerListClearAgain(HeaderName) {
        console.log("Header List Clear:")
        let SearchText = '';
        let n1;
        let inputHeaderName = this.getInputHeaderName(HeaderName);
        console.log("Prev Text: ", this.PrevSearcText);

        console.log("Check header: ", inputHeaderName);
        let str = this.PrevSearcText;
        let res = str.indexOf(inputHeaderName);
        let n = str.indexOf("|||", res);
        if (n == -1) {
            n1 = str.substring(res);
        } else {
            n1 = str.substring(res, n + 3)
        }
        let n2 = str.replace(n1, '');
        this.PrevSearcText = n2;
        let lastString = this.PrevSearcText.substring(this.PrevSearcText.length - 3, this.PrevSearcText.length);
        if (lastString == '|||') {
            this.PrevSearcText = this.PrevSearcText.substring(0, this.PrevSearcText.length - 3);
        }
        SearchText = this.PrevSearcText;
        if (SearchText == '') {
            HeaderName = '';
            SearchText = '';
        }
        console.log("Header Name: ", HeaderName, "Search Text: ", SearchText);
    }

    allHeaderFilter(HeaderName, childActionRecieved) {
        let SearchText = '';
        let intArray: any = [];
        this.searchByText = childActionRecieved.filterData.columnSerachKey;
        console.log("Order : ", childActionRecieved.filterData.order);
        console.log("All Data : ", childActionRecieved);
        if (childActionRecieved.filterData.order.length == this.sortByOrderList && !childActionRecieved.filterData.isApplyFilter) {
            console.log("Apply Field: If Part", childActionRecieved.filterData.isApplyFilter)
            this.headerFirstTime(HeaderName, childActionRecieved);
            this.sortByOrderList = childActionRecieved.filterData.order.length;
        }
        else {
            console.log("Apply Field: Else Part", childActionRecieved.filterData.isApplyFilter)
            if (childActionRecieved.filterData.order.length >= this.sortByOrderList) {
                this.allHeaderList(HeaderName, childActionRecieved);
            }
            else {
                this.headerListClear(HeaderName);
            }
            console.log("Order : ", this.sortByOrderList);
            childActionRecieved.filterData.isApplyFilter = false;
            this.sortByOrderList = childActionRecieved.filterData.order.length;
        }
    }

    headerFirstTime(HeaderName, childActionRecieved) {
        if (HeaderName == "actionName") {
            this.newGetActionName(childActionRecieved);
        } else if (HeaderName == "actionType") {
            this.getActionType(childActionRecieved);
        } else if (HeaderName == "actionOwner") {
            this.getActionOwner(childActionRecieved);
        } else if (HeaderName == "startDate") {
            this.getActionStartDate(childActionRecieved);
        } else if (HeaderName == "endDate") {
            this.getActionEndDate(childActionRecieved);
        } else if (HeaderName == "module") {
            this.getActionModule(childActionRecieved);
        } else if (HeaderName == "status") {
            this.getActionStatus(childActionRecieved);
        } else if (HeaderName == "approval") {
            this.getActionApproval(childActionRecieved);
        } else if (HeaderName == "attachment") {
            this.getActionAttachment(childActionRecieved);
        } else if (HeaderName == "approver") {
            this.getActionApprover(childActionRecieved);
        } else if (HeaderName == "escalateCont") {
            this.getActionEscalateCont(childActionRecieved);
        } else if (HeaderName == "dependencies") {
            this.getActionDependencies(childActionRecieved);
        }
    }

    // Header Filter
    filterWithData(header, searctext) {
        console.log("Filter Data with pre data:");
        let input = {
            "SortByPropertyName": "ID DESC",
            "SearchTextOnColumn": '',
            "FilterByPropertyName": header,
            "SearchText": searctext,
            "Id": this.dealOverview.id,
            "PageSize": 10,
            "LastRecordId": 1,
            "Guid": this.createrId,
            "UserID": this.adid,
        };
        
        this.deals.actionList(input).subscribe(res => {
            console.log(res)
            let indexNew;
            let newarr = [];
            if (this.filterArray.length == 0) {
                indexNew = 1;
            }
            else {                
                indexNew = this.filterArray.length + 1;
            }
            newarr = this.tableData(indexNew, res);
            if (newarr.length > 0) {
                this.filterArray = newarr;
                this.calTable = newarr;
            }
            else {
                this.calTable = [{}];
            }
        })
    }

    searchText(filteredData) {
        console.log("Action Name", filteredData);
        let SearchText;
        if (filteredData.filterData.order.length > 0) {
            filteredData.filterData.order.map(x => {
                if (x == 'actionName' || x == 'actionType' || x == 'actionOwner' || x == 'startDate' || x == 'endDate' || x == 'module' || x == 'status' || x == 'approval' || x == 'attachment' || x == 'approver' || x == 'escalateCont' || x == 'dependencies') {
                    SearchText = '';
                } else {
                    SearchText = this.PrevSearcText;
                }
            });
            return SearchText;
        }
    }

    getUnique(arr, comp) {
        const unique = arr.map(e => e[comp]).map((e, i, final) => final.indexOf(e) === i && i).filter(e => arr[e]).map(e => arr[e]);
        return unique;
    }
    
    headerFilterInput(filteredData,SearchText){
        let input = {
            "SortByPropertyName": "ID DESC",
            "SearchTextOnColumn": this.searchByText,
            "FilterByPropertyName": this.getInputHeaderName(filteredData.filterData.headerName),
            "SearchText": SearchText,
            "Id": this.dealOverview.id,
            "PageSize": 50,
            "LastRecordId": this.filterConfigData.actionName.PageNo,
            "Guid": this.createrId,
            "UserID": this.adid
        };
        return input;
    }

    headerFilterArray(responseOwnerData, selectedArrayList){
        if (selectedArrayList.length > 0) {
            responseOwnerData.map((x) => {
                selectedArrayList.map((y) => {
                    x.id == y.id ? x.isDatafiltered = y.isDatafiltered : null
                })
            })
        }
        return responseOwnerData
    }
    
    newGetActionName(filteredData) {
        console.log("Filter data: ", filteredData)
        let selectedArrayList: any[] = filteredData.filterData.filterColumn.actionName;
        let SearchText = this.searchText(filteredData);
        let input = this.headerFilterInput(filteredData,SearchText);
        this.deals.actionList(input).subscribe(res => {
            this.filterConfigData.isFilterLoading = false;
            console.log(res)
            if (res.IsError == false) {
                this.filterConfigData.isFilterLoading = false;
                let responseOwnerData: any[] = res.ResponseObject.map(x => {
                    let obj = {
                        id: x.Id,
                        name: x.Name,
                        isDatafiltered: false
                    }
                    return obj;
                });

                responseOwnerData = this.headerFilterArray(responseOwnerData, selectedArrayList);
                responseOwnerData = this.getUnique(responseOwnerData,'name');
                if (filteredData.action == "loadMoreFilterData") {
                    this.filterConfigData.actionName.PageNo = this.filterConfigData.actionName.PageNo + 1;
                    let arr1 = this.filterConfigData.actionName.data;
                    let arr2 = responseOwnerData;
                    let arr3 = arr1.concat(arr2);
                    this.filterConfigData.actionName.data = this.getUnique(arr3,'name');
                    this.filterConfigData.actionName.recordCount = res.TotalRecordCount;
                } else {
                    this.filterConfigData.actionName.PageNo = 1;
                    this.filterConfigData.actionName.data = responseOwnerData;
                    this.filterConfigData.actionName.recordCount = res.TotalRecordCount;
                }
                this.actionNameListArray = responseOwnerData;
            }
        }, err => {
            this.filterConfigData.isFilterLoading = false;
            this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
        });
    }

    getActionType(filteredData) {
        console.log("Action Type");
        let selectedArrayList: any[] = filteredData.filterData.filterColumn.actionType;
        let SearchText = this.searchText(filteredData);
        let input = this.headerFilterInput(filteredData,SearchText);
        this.deals.actionList(input).subscribe(res => {
            this.filterConfigData.isFilterLoading = false;
            console.log(res)
            if (res.IsError == false) {
                this.filterConfigData.isFilterLoading = false;
                let responseOwnerData: any[] = res.ResponseObject.map(x => {
                    let obj = {
                        id: x.Id,
                        name: x.ActionType.Value,
                        isDatafiltered: false
                    }
                    return obj;
                });
                responseOwnerData = this.headerFilterArray(responseOwnerData, selectedArrayList);
                responseOwnerData = this.getUnique(responseOwnerData,'name');
                if (filteredData.action == "loadMoreFilterData") {
                    this.filterConfigData.actionType.PageNo = this.filterConfigData.actionType.PageNo + 1;
                    let arr1 = this.filterConfigData.actionType.data;
                    let arr2 = responseOwnerData;
                    let arr3 = arr1.concat(arr2);
                    this.filterConfigData.actionType.data = this.getUnique(arr3,'name');
                    this.filterConfigData.actionType.recordCount = res.TotalRecordCount;
                } else {
                    this.filterConfigData.actionType.PageNo = 1;
                    this.filterConfigData.actionType.data = responseOwnerData;
                    this.filterConfigData.actionType.recordCount = res.TotalRecordCount;
                }
            }
        }, err => {
            this.filterConfigData.isFilterLoading = false;
            this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
        });
    }

    getActionOwner(filteredData) {
        console.log("Action Owner");
        let selectedArrayList: any[] = filteredData.filterData.filterColumn.actionOwner;
        let SearchText = this.searchText(filteredData);
        let input = this.headerFilterInput(filteredData,SearchText);
        this.deals.actionList(input).subscribe(res => {
            this.filterConfigData.isFilterLoading = false;
            console.log(res)
            if (res.IsError == false) {
                this.filterConfigData.isFilterLoading = false;
                let responseOwnerData: any[] = res.ResponseObject.map(x => {
                    let obj = {
                        id: x.Id,
                        name: x.Owner.FullName,
                        isDatafiltered: false
                    }
                    return obj;
                });

                responseOwnerData = this.headerFilterArray(responseOwnerData, selectedArrayList);
                responseOwnerData = this.getUnique(responseOwnerData,'name');
                if (filteredData.action == "loadMoreFilterData") {
                    this.filterConfigData.actionOwner.PageNo = this.filterConfigData.actionOwner.PageNo + 1;
                    this.filterConfigData.actionOwner.data = responseOwnerData;
                    let arr1 = this.filterConfigData.actionOwner.data;
                    let arr2 = responseOwnerData;
                    let arr3 = arr1.concat(arr2);
                    this.filterConfigData.actionOwner.data = this.getUnique(arr3,'name');
                    this.filterConfigData.actionOwner.recordCount = res.TotalRecordCount;
                } else {
                    this.filterConfigData.actionOwner.PageNo = 1;
                    this.filterConfigData.actionOwner.data = responseOwnerData;
                    this.filterConfigData.actionOwner.recordCount = res.TotalRecordCount;
                }
            }
        }, err => {
            this.filterConfigData.isFilterLoading = false;
            this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
        });
    }

    getActionStartDate(filteredData) {
        console.log("Start date: ", this.searchByText);
        let selectedArrayList: any[] = filteredData.filterData.filterColumn.startDate;
        let SearchText = this.searchText(filteredData);
        let input = this.headerFilterInput(filteredData,SearchText);
        this.deals.actionList(input).subscribe(res => {
            this.filterConfigData.isFilterLoading = false;
            console.log(res)
            if (res.IsError == false) {
                this.filterConfigData.isFilterLoading = false;
                let responseOwnerData: any[] = res.ResponseObject.map(x => {
                    let obj = {
                        id: x.Id,
                        name: x.StartDate,
                        isDatafiltered: false
                    }
                    return obj;
                })

                responseOwnerData = this.headerFilterArray(responseOwnerData, selectedArrayList);
                responseOwnerData = this.getUnique(responseOwnerData,'name');
                if (filteredData.action == "loadMoreFilterData") {
                    this.filterConfigData.startDate.PageNo = this.filterConfigData.startDate.PageNo + 1;
                    let arr1 = this.filterConfigData.startDate.data;
                    let arr2 = responseOwnerData;
                    let arr3 = arr1.concat(arr2);
                    this.filterConfigData.startDate.data = this.getUnique(arr3,'name');
                    this.filterConfigData.startDate.recordCount = res.TotalRecordCount;
                } else {
                    this.filterConfigData.startDate.PageNo = 1;
                    this.filterConfigData.startDate.data = responseOwnerData;
                    this.filterConfigData.startDate.recordCount = res.TotalRecordCount;
                }
            }
        }, err => {
            this.filterConfigData.isFilterLoading = false;
            this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
        });
    }

    getActionEndDate(filteredData) {
        let selectedArrayList: any[] = filteredData.filterData.filterColumn.endDate;
        let SearchText = this.searchText(filteredData);
        let input = this.headerFilterInput(filteredData,SearchText);
        this.deals.actionList(input).subscribe(res => {
            this.filterConfigData.isFilterLoading = false;
            console.log(res)
            if (res.IsError == false) {
                this.filterConfigData.isFilterLoading = false;
                let responseOwnerData: any[] = res.ResponseObject.map(x => {
                    let obj = {
                        id: x.Id,
                        name: x.EndDate,
                        isDatafiltered: false
                    }
                    return obj;
                });
                responseOwnerData = this.headerFilterArray(responseOwnerData, selectedArrayList);
                responseOwnerData = this.getUnique(responseOwnerData,'name');
                if (filteredData.action == "loadMoreFilterData") {
                    this.filterConfigData.endDate.PageNo = this.filterConfigData.endDate.PageNo + 1;
                    let arr1 = this.filterConfigData.startDate.data;
                    let arr2 = responseOwnerData;
                    let arr3 = arr1.concat(arr2);
                    this.filterConfigData.startDate.data = this.getUnique(arr3,'name');
                    this.filterConfigData.endDate.recordCount = res.TotalRecordCount;
                } else {
                    this.filterConfigData.endDate.PageNo = 1;
                    this.filterConfigData.endDate.data = responseOwnerData;
                    this.filterConfigData.endDate.recordCount = res.TotalRecordCount;
                }
            }
        }, err => {
            this.filterConfigData.isFilterLoading = false;
            this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
        });
    }

    getActionModule(filteredData) {
        let selectedArrayList: any[] = filteredData.filterData.filterColumn.module;
        let SearchText = this.searchText(filteredData);
        let input = this.headerFilterInput(filteredData,SearchText);
        this.deals.actionList(input).subscribe(res => {
            this.filterConfigData.isFilterLoading = false;
            console.log(res)
            if (!res.IsError) {
                this.filterConfigData.isFilterLoading = false;
                let responseOwnerData: any[] = res.ResponseObject.map(x => {
                    let obj = {
                        id: x.Id,
                        name: x.Module.Value == '' ? '-' : x.Module.Value,
                        isDatafiltered: false
                    }
                    return obj;
                });

                responseOwnerData = this.headerFilterArray(responseOwnerData, selectedArrayList);
                responseOwnerData = this.getUnique(responseOwnerData,'name');
                if (filteredData.action == "loadMoreFilterData") {
                    this.filterConfigData.module.PageNo = this.filterConfigData.module.PageNo + 1;
                    let arr1 = this.filterConfigData.module.data;
                    let arr2 = responseOwnerData;
                    let arr3 = arr1.concat(arr2);
                    this.filterConfigData.module.data = this.getUnique(arr3,'name');
                    this.filterConfigData.module.recordCount = res.TotalRecordCount;
                } else {
                    this.filterConfigData.module.PageNo = 1;
                    this.filterConfigData.module.data = responseOwnerData;
                    this.filterConfigData.module.recordCount = res.TotalRecordCount;
                }
            }
        }, err => {
            this.filterConfigData.isFilterLoading = false;
            this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
        });
    }

    getActionStatus(filteredData) {
        let selectedArrayList: any[] = filteredData.filterData.filterColumn.status;
        let SearchText = this.searchText(filteredData);
        console.log("Search value: ", SearchText)
        let searchingText = this.searchByText.toLowerCase();
        let newText = "";
        if(searchingText == 'o' || searchingText == 'op' || searchingText == 'ope' || searchingText == 'open'){
            newText = searchingText.replace(searchingText, "1");
        } else if(searchingText == 'c' || searchingText == 'cl' || searchingText == 'clo' || searchingText == 'clos' || searchingText == 'close'){
            newText = searchingText.replace(searchingText, "3");
        } else if(searchingText == 'p' || searchingText == 'pe' || searchingText == 'pen' || searchingText == 'pend' || searchingText == 'pendi' || searchingText == 'pendin' || searchingText == 'pending' || searchingText == 'pending f' || searchingText == 'pending fo' || searchingText == 'pending for' || searchingText == 'pending for a' ||searchingText == 'pending for ap' ||searchingText == 'pending for app' ||searchingText == 'pending for appr' ||searchingText == 'pending for appro'||searchingText == 'pending for approv' || searchingText == 'pending for approva' || searchingText == 'pending for approval'){
            newText = searchingText.replace(searchingText, "2");
        } else {
            newText = this.searchByText;
        }

        let input = {
            "SortByPropertyName": "ID DESC",
            "SearchTextOnColumn": newText,
            "FilterByPropertyName": this.getInputHeaderName(filteredData.filterData.headerName),
            "SearchText": SearchText,
            "Id": this.dealOverview.id,
            "PageSize": 50,
            "LastRecordId": this.filterConfigData.actionName.PageNo,
            "Guid": this.createrId,
            "UserID": this.adid
        };
        console.log("Status inputs: ", input)
        this.deals.actionList(input).subscribe(res => {
            this.filterConfigData.isFilterLoading = false;
            if (res.IsError == false) {
                console.log("Status Method")
                this.filterConfigData.isFilterLoading = false;
                let responseOwnerData: any[] = res.ResponseObject.map(x => {
                    let status: any;
                    x.Status == 1 ? status = 'Open' : x.Status == 2 ? status = 'Pending For Approval' : status = 'Close'
                    let obj = {
                        id: x.Id,
                        name: status,
                        isDatafiltered: false
                    }
                    return obj;
                });

                responseOwnerData = this.headerFilterArray(responseOwnerData, selectedArrayList);
                responseOwnerData = this.getUnique(responseOwnerData,'name');
                if (filteredData.action == "loadMoreFilterData") {
                    this.filterConfigData.status.PageNo = this.filterConfigData.status.PageNo + 1;
                    let arr1 = this.filterConfigData.status.data;
                    let arr2 = responseOwnerData;
                    let arr3 = arr1.concat(arr2);
                    this.filterConfigData.status.data = this.getUnique(arr3,'name');
                    this.filterConfigData.status.recordCount = res.TotalRecordCount;
                } else {
                    this.filterConfigData.status.PageNo = 1;
                    this.filterConfigData.status.data = responseOwnerData;
                    this.filterConfigData.status.recordCount = res.TotalRecordCount;
                }
            }
        })
    }

    getActionApproval(filteredData) {
        console.log("Status Method");
        let selectedArrayList: any[] = filteredData.filterData.filterColumn.approval;
        let SearchText = this.searchText(filteredData);
        let searchingText = this.searchByText.toLowerCase();
        let newText = "";
        if(searchingText == 'y' || searchingText == 'ye' || searchingText == 'yes'){
            newText = searchingText.replace(searchingText, "1");
        } else if(searchingText == 'n' || searchingText == 'no'){
            newText = searchingText.replace(searchingText, "0");
        } else {
            newText = this.searchByText;
        }
        // let input = this.headerFilterInput(filteredData,newText);
        let input = {
            "SortByPropertyName": "ID DESC",
            "SearchTextOnColumn": newText,
            "FilterByPropertyName": this.getInputHeaderName(filteredData.filterData.headerName),
            "SearchText": SearchText,
            "Id": this.dealOverview.id,
            "PageSize": 50,
            "LastRecordId": this.filterConfigData.actionName.PageNo,
            "Guid": this.createrId,
            "UserID": this.adid
        };
        this.deals.actionList(input).subscribe(res => {
            this.filterConfigData.isFilterLoading = false;
            if (res.IsError == false) {
                this.filterConfigData.isFilterLoading = false;
                let responseOwnerData: any[] = res.ResponseObject.map(x => {
                    let obj = {
                        id: x.Id,
                        name: x.IsApprovalRequired == false ? 'No' : 'Yes',
                        isDatafiltered: false
                    }
                    return obj;
                });
                responseOwnerData = this.headerFilterArray(responseOwnerData, selectedArrayList);
                responseOwnerData = this.getUnique(responseOwnerData,'name');
                if (filteredData.action == "loadMoreFilterData") {
                    this.filterConfigData.approval.PageNo = this.filterConfigData.approval.PageNo + 1;
                    let arr1 = this.filterConfigData.approval.data;
                    let arr2 = responseOwnerData;
                    let arr3 = arr1.concat(arr2);
                    this.filterConfigData.approval.data = this.getUnique(arr3,'name');
                    this.filterConfigData.approval.recordCount = res.TotalRecordCount;
                } else {
                    this.filterConfigData.approval.PageNo = 1;
                    this.filterConfigData.approval.data = responseOwnerData;
                    this.filterConfigData.approval.recordCount = res.TotalRecordCount;
                }
            }
        })
    }

    getActionAttachment(filteredData) {
        let selectedArrayList: any[] = filteredData.filterData.filterColumn.attachment;
        let SearchText = this.searchText(filteredData);
        let input = this.headerFilterInput(filteredData,SearchText);
        this.deals.actionList(input).subscribe(res => {
            this.filterConfigData.isFilterLoading = false;
            console.log(res)
            if (res.IsError == false) {
                this.filterConfigData.isFilterLoading = false;
                let responseOwnerData: any[] = res.ResponseObject.map(x => {
                    let obj = {
                        id: x.Id,
                        name: x.Document.Name == '' ? "-" : x.Document.Name,
                        isDatafiltered: false
                    }
                    return obj;
                });

                responseOwnerData = this.headerFilterArray(responseOwnerData, selectedArrayList);
                responseOwnerData = this.getUnique(responseOwnerData,'name');
                if (filteredData.action == "loadMoreFilterData") {
                    this.filterConfigData.attachment.PageNo = this.filterConfigData.attachment.PageNo + 1;
                    let arr1 = this.filterConfigData.attachment.data;
                    let arr2 = responseOwnerData;
                    let arr3 = arr1.concat(arr2);
                    this.filterConfigData.attachment.data = this.getUnique(arr3,'name');
                    this.filterConfigData.attachment.recordCount = res.TotalRecordCount;
                } else {
                    this.filterConfigData.attachment.PageNo = 1;
                    this.filterConfigData.attachment.data = responseOwnerData;
                    this.filterConfigData.attachment.recordCount = res.TotalRecordCount;
                }
            }
        }, err => {
            this.filterConfigData.isFilterLoading = false;
            this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
        });
    }

    getActionApprover(filteredData) {
        let selectedArrayList: any[] = filteredData.filterData.filterColumn.approver;
        let SearchText = this.searchText(filteredData);
        let input = this.headerFilterInput(filteredData,SearchText);
        this.deals.actionList(input).subscribe(res => {
            this.filterConfigData.isFilterLoading = false;
            console.log(res)
            if (res.IsError == false) {
                this.filterConfigData.isFilterLoading = false;
                let responseOwnerData: any[] = res.ResponseObject.map(x => {
                    let obj = {
                        id: x.Id,
                        name: x.Approver.FullName == '' ? '-' : x.Approver.FullName,
                        isDatafiltered: false
                    }
                    return obj;
                });

                responseOwnerData = this.headerFilterArray(responseOwnerData, selectedArrayList);
                responseOwnerData = this.getUnique(responseOwnerData,'name');
                if (filteredData.action == "loadMoreFilterData") {
                    this.filterConfigData.approver.PageNo = this.filterConfigData.approver.PageNo + 1;
                    let arr1 = this.filterConfigData.approver.data;
                    let arr2 = responseOwnerData;
                    let arr3 = arr1.concat(arr2);
                    this.filterConfigData.approver.data = this.getUnique(arr3,'name');
                    this.filterConfigData.approver.recordCount = res.TotalRecordCount;
                } else {
                    this.filterConfigData.approver.PageNo = 1;
                    this.filterConfigData.approver.data = responseOwnerData;
                    this.filterConfigData.approver.recordCount = res.TotalRecordCount;
                }
            }
        }, err => {
            this.filterConfigData.isFilterLoading = false;
            this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
        });
    }

    getActionEscalateCont(filteredData) {
        let selectedArrayList: any[] = filteredData.filterData.filterColumn.escalateCont;
        let SearchText = this.searchText(filteredData);
        let input = this.headerFilterInput(filteredData,SearchText);
        this.deals.actionList(input).subscribe(res => {
            this.filterConfigData.isFilterLoading = false;
            console.log(res)
            if (res.IsError == false) {
                this.filterConfigData.isFilterLoading = false;
                console.log(res.ResponseObject.Escalation);
                let responseOwnerData: any[] = res.ResponseObject.map(x => {
                    let obj = {
                        id: x.Id,
                        name: x.Escalation == '' ? '-' : x.Escalation,
                        isDatafiltered: false
                    }
                    return obj;
                });

                responseOwnerData = this.headerFilterArray(responseOwnerData, selectedArrayList);
                responseOwnerData = this.getUnique(responseOwnerData,'name');
                if (filteredData.action == "loadMoreFilterData") {
                    this.filterConfigData.escalateCont.PageNo = this.filterConfigData.escalateCont.PageNo + 1;
                    let arr1 = this.filterConfigData.escalateCont.data;
                    let arr2 = responseOwnerData;
                    let arr3 = arr1.concat(arr2);
                    this.filterConfigData.escalateCont.data = this.getUnique(arr3,'name');
                    this.filterConfigData.escalateCont.recordCount = res.TotalRecordCount;
                } else {
                    this.filterConfigData.escalateCont.PageNo = 1;
                    this.filterConfigData.escalateCont.data = responseOwnerData;
                    this.filterConfigData.escalateCont.recordCount = res.TotalRecordCount;
                }
            }
        }, err => {
            this.filterConfigData.isFilterLoading = false;
            this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
        });
    }

    getActionDependencies(filteredData) {
        let selectedArrayList: any[] = filteredData.filterData.filterColumn.escalateCont;
        let SearchText = this.searchText(filteredData);
        let input = this.headerFilterInput(filteredData,SearchText);
        this.deals.searchDependent(input).subscribe(res => {
            this.filterConfigData.isFilterLoading = false;
            console.log(res)
            if (res.IsError == false) {
                this.filterConfigData.isFilterLoading = false;
                let responseOwnerData: any[] = res.ResponseObject.map(x => {
                    let obj = {
                        id: x.Id,
                        name: x.CustomerContact == '' ? '_' : x.CustomerContact,
                        isDatafiltered: false
                    }
                    return obj;
                });

                responseOwnerData = this.headerFilterArray(responseOwnerData, selectedArrayList);
                responseOwnerData = this.getUnique(responseOwnerData,'name');
                if (filteredData.action == "loadMoreFilterData") {
                    this.filterConfigData.dependencies.PageNo = this.filterConfigData.dependencies.PageNo + 1;
                    let arr1 = this.filterConfigData.dependencies.data;
                    let arr2 = responseOwnerData;
                    let arr3 = arr1.concat(arr2);
                    this.filterConfigData.dependencies.data = this.getUnique(arr3,'name');
                    this.filterConfigData.dependencies.recordCount = res.TotalRecordCount;
                } else {
                    this.filterConfigData.dependencies.PageNo = 1;
                    this.filterConfigData.dependencies.data = responseOwnerData;
                    this.filterConfigData.dependencies.recordCount = res.TotalRecordCount;
                }
            }
        }, err => {
            this.filterConfigData.isFilterLoading = false;
            this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
        });
    }

    downloadDocument(response) {
        console.log(response);
        let fileName: any = response.attachment;
        let downloadUrls = [];
        var link = document.createElement('a');
        link.download = fileName;
        link.href = response.attachmentUrl;
        if (link.href.includes("?")) {
            link.href = response.attachmentUrl.substring(0, response.attachmentUrl.indexOf("?"));
        }
        console.log(link.href)

        if (this.envr.envName === 'MOBILEQA') {
            this.newconversationService.attachmentList.forEach(item => {
                downloadUrls.push({ Url: link.href, Name: item.Name })
            })
            //this.downloadAllInMobile(downloadUrls)
            this.downloadFile(link.href, fileName);
            return;
        } else {
            //link.click();
            // window.URL.revokeObjectURL(link.href);
            window.open(link.href, "_blank");
        }

        // let input = { "Path": response.attachmentUrl }
        // this.isLoading = true;
        // this.deals.downloadDocument(input).subscribe(res => {
        //     console.log(res);
        //     console.log("Check Envirment Name: ", env.envName);
        //     let downloadUrls = [];
        //     var binary_string = window.atob(res.ResponseObject.Base64String);
        //     var len = binary_string.length;
        //     var bytes = new Uint8Array(len);
        //     for (var i = 0; i < len; i++) {
        //         bytes[i] = binary_string.charCodeAt(i);
        //     }
        //     let blob = new Blob([bytes.buffer]);
        //     let Filename = res.ResponseObject.FileName.replace(/%20/g, " ");
        //     var link = document.createElement('a');
        //     link.href = window.URL.createObjectURL(blob);

        //     if (env.envName === 'MOBILEQA') {
        //         console.log('Mobile View')
        //         // this.downloadAllInMobile(downloadUrls);
        //         this.downloadFile(response, res.ResponseObject.FileName);
        //         return;
        //     } else {
        //         console.log('Desktop view', link.href);
        //         link.click();
        //         window.URL.revokeObjectURL(link.href);
        //         this.isLoading = false;
        //         this._error.throwError("File downloaded successfully.")
        //     }
        // }, error => {
        //     this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
        //     this.isLoading = false;
        // })
    }

    downloadFile(url, filename) {
        console.log("Mobile download method");
        var fileTransfer = new FileTransfer();
        var uri = encodeURI(url);
        var fileURL = "///storage/emulated/0/Download/" + filename;
        this._error.throwError("File downloaded successfully.");
        //var fileURL = "///storage/emulated/0/DCIM/" + url;
        fileTransfer.download(uri, fileURL,
            function (entry) {
                this._error.throwError("File downloaded successfully.");
                console.log("download complete: " + entry.toURL());
            },
            function (error) {
                console.log("download error source " + error.source);
                console.log("download error target " + error.target);
                console.log("download error code" + error.code);
            },
            null,
            {})
        //DronaHQ.InAppBrowser.open(url, '_blank');
    }

    downloadAllInMobile(fileInfo) {
        console.log("DownLoad Mobile");
        fileInfo.forEach(function (value, idx) {
            const response = value;
            console.log("Mobile URL Data: ", response);
            // // The base64 content
            // var myBase64 = response.Url;
            // // To define the type of the Blob, you need to get this value by yourself (maybe according to the file extension)
            // var contentType = "image/png";
            // // The path where the file will be saved
            // var folderpath = "///storage/emulated/0/";
            // // The name of your file
            // var filename = response.Name;
            // //var fileTransfer = new FileTransfer();
            // this.savebase64AsImageFile(folderpath, filename, myBase64, contentType);

            //setTimeout(() => {
            var fileTransfer = new FileTransfer();
            var uri = encodeURI(response.Url);
            var fileURL = "///storage/emulated/0/DCIM/" + response.Name;

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
            });
            //}, idx * 2500)
        });
    }

    savebase64AsImageFile(folderpath, filename, content, contentType) {
        // Convert the base64 string in a Blob
        var DataBlob = this.b64toBlob(content, contentType, null);
        console.log("Starting to write the file :3");
        (<any>window).resolveLocalFileSystemURL(folderpath, function (dir) {
            console.log("Access to the directory granted succesfully");
            dir.getFile(filename, { create: true }, function (file) {
                console.log("File created succesfully.");
                file.createWriter(function (fileWriter) {
                    console.log("Writing content to file");
                    fileWriter.write(DataBlob);
                }, function () {
                    alert('Unable to save file in path ' + folderpath);
                });
            });
        });
    }

    b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }
}

@Component({
    selector: 'app-cancel-pop',
    templateUrl: './approve-pop-up.html',
    styleUrls: ['./deal-calendar.component.scss'],
})

export class approveActionComponent {
    constructor(public dialogRef: MatDialogRef<approveActionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
}


