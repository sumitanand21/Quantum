import { ClearMeetingDetails } from './../../../core/state/actions/activities.actions';


import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, HostListener, OnChanges, OnDestroy, ElementRef, Inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ISlimScrollOptions } from 'ngx-slimscroll';

import { ProjectService, Project, ConversationService, Conversation, MasterApiService, OfflineService, routes, ErrorMessage, ContactService, CampaignService } from '@app/core';
import { Observable, Subscription } from 'rxjs';

import { DataCommunicationService } from '@app/core/services/global.service';
import { NguCarousel, NguCarouselConfig } from '@ngu/carousel';
import { newConversationService } from '@app/core/services/new-conversation.service';

import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { HomeService } from '@app/core/services/home.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { LoadTaskList, LoadApprovalList, ClearTaskList } from '@app/core/state/actions/home.action';
import { selecthomeData } from '@app/core/state/selectors/home/home.selector';
import { DatePipe } from '@angular/common';
import { MatSnackBar, MatTabGroup } from '@angular/material';
import { MeetingService } from '@app/core/services/meeting.service';
import { MyOpenLeadsService } from '@app/core/services/myopenlead.service';
import { ActivityService } from '@app/core/services/activity.service';
import { LoadAllActivity, ClearActivityDetails } from '@app/core/state/actions/activities.actions';
import { getAllActivity } from '@app/core/state/selectors/activity/activity.selector';
import { LoadAllContacts, ClearContactList } from '@app/core/state/actions/contact.action';
import { getContactListData } from '@app/core/state/selectors/contact-list.selector';
import { LoadMyOpenleads } from '@app/core/state/actions/leads.action';
import { getMyOpenLeadsList } from '@app/core/state/selectors/lead/lead.selector';
import { AllCampaignLists } from '@app/core/state/actions/campaign-List.action';
import { AllCampaignState } from '@app/core/state/selectors/campaign/Campaign-AllList.selector';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { environment as env } from '@env/environment';
import html2canvas from 'html2canvas';
import { AccountListService } from '@app/core/services/accountList.service';
import { AccountService } from '@app/core/services/account.service';
import { ClearDeActivateContactList } from '@app/core/state/actions/InActivateContact.action';

import * as pbi from 'powerbi-client';
import * as models from 'powerbi-models';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';
import { EnvService } from '@app/core/services/env.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnChanges, OnDestroy {

  AllhomeRequestbody = {
    "PageSize": this.homeService.sendPageSize || 50,
    "RequestedPageNumber": this.homeService.sendPageNumber || 1,
    "OdatanextLink": "",
    "FilterData": this.homeService.sendConfigData || []
  }
  TaskLable: any = "";
  TaskLableName: any = "Tasks "

  ApprovalLabel: any = "";
  ApprovalLabelName: any = "Approvals "

  revSummary: any;
  bookings: any;
  totalPipeline: any;
  lossSummary: any;
  tasklistdetails: any;
  taskListDetails = [];
  approvalListDetails = [];
  TabName: any;
  isHelpDesk: any;
  ApprovalTableCount: any;
  visible: boolean = false;
  viewAllBtnVisibility: boolean = false;
  homeState: Subscription
  getAllActivityListState: Subscription
  getAllContactListState: Subscription
  getAllCampaignListState: Subscription
  getMyOpenLeadListState: Subscription
  isLoading: boolean = false;
  TaskTableCount: any;
  userRolesList: Array<any> = [];
  selectedIndex = 0;
  powerBIAccessKey: string;
  reworkStatus: any;
  SysGuid: any;
  Roles: any;
  roleType: any;
  userRoles = { '0': 'account_requestor', '1': 'account_requestor', '2': 'sbu', '3': 'cso' };
  userId = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
  dnbtoken: any;
  Tiles: number = 0;
  constructor(
    public envr: EnvService,
    public homeService: HomeService,
    public store: Store<AppState>,
    public service: DataCommunicationService,
    public activity: ActivityService,
    public contact: ContactService,
    public campaign: CampaignService,
    public myOpenLeadsService: MyOpenLeadsService,
    public encrDecrService: EncrDecrService,
    public popUp: ErrorMessage,
    public router: Router,
    public cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private adalSvc: MsAdalAngular6Service,
    public masterApi: MasterApiService,
    public offlineService: OfflineService,
    public datePipe: DatePipe,
    public matSnackBar: MatSnackBar,
    public myOpenLeadService: MyOpenLeadsService,
    private meetingService: MeetingService,
    private newconversationService: newConversationService,
    private accountlistService: AccountListService,
    public accservice: AccountService,
    public master3Api: S3MasterApiService,
    public route: ActivatedRoute,
    public errorMessage: ErrorMessage) {
    this.getRolesList();
  }

  @ViewChild('tabGroup') tabGroup: MatTabGroup;

  tabChanged(event) {
    this.TabName = event.tab.textLabel;
    console.log('Current Tab Name-->', this.TabName)
    this.getVisisbilityViewBtn();
  }

  ngOnChanges() {
    this.tabChanged(event)
  }

  async ngOnInit() {
    this.getInitialData();
    this.getHelplineCount();
    sessionStorage.setItem('actlist', JSON.stringify(3))
    this.getroleguid();
    this.getdnbtoken();
    sessionStorage.removeItem('archivedStatus')
  }

  public headerBannerList: any[];
  public knowledgeCenterBanners: any[];
  public upcomingTrainingBanners: any[];
  public goToWidgetList: any[] = [];
  public helpLineCounts: { "ClosedStateCount": string, "OpenStateCount": string, "UCPStateCount": string, "UTCStateCount": string };

  getBannersList(roleId) {
    this.homeService.getBannersListComplete(roleId).subscribe(res => {
      if (!res.IsError) {
        // Header Banner

        let headerBanner = [];
        let userBanner = [{
          "ImageUrl": "https://commonstorageqa.blob.core.windows.net/l2ofiles/banner9_20200326113044.png",   //"assets/images/slideImage1.png",
          "Sequence": 0,
          "Title": "Welcome",
          "name": localStorage.getItem('upn'),
          "Subtitle": "",
          "classname": "first-carousel",
          "RedirectUrl": ""
        }];
        let finalBanner = [];

        if (res.ResponseObject.Header && Array.isArray(res.ResponseObject.Header) && res.ResponseObject.Header.length > 0) {
          headerBanner = [...res.ResponseObject.Header];
        } else {
          console.log("No banner list");
        }
        finalBanner = [...userBanner, ...headerBanner];
        finalBanner.sort((a, b) => {
          if (a.Sequence < b.Sequence) {
            return -1;
          }
          if (a.Sequence > b.Sequence) {
            return 1;
          }
          return 0;
        });

        this.headerBannerList = [...finalBanner];

        // Knowledge Center
        if (res.ResponseObject.Footer1 && Array.isArray(res.ResponseObject.Footer1) && res.ResponseObject.Footer1.length > 0) {
          this.knowledgeCenterBanners = [...res.ResponseObject.Footer1];
        } else {
          console.log("No Footer1 list");
        }

        // Announcements
        if (res.ResponseObject.Footer2 && Array.isArray(res.ResponseObject.Footer2) && res.ResponseObject.Footer2.length > 0) {
          this.upcomingTrainingBanners = [...res.ResponseObject.Footer2];
        } else {
          console.log("No Footer2 list");
        }

      } else {
        console.log("Error");
      }
      this.cdr.detectChanges();
    });
  }

  getBanner(url: string) {
    debugger
    if (url) {
      window.open(url, "_blank");
    }
  }

  goToUrl(url) {
    if (url) {
      if (url.Title) {
        if (url.Title === "Deal Pricing System")
          window.open(`${this.envr.outlookConfig.redirectUri}/deals/deal/tagged`, "_blank");
        else
          window.open(url.RedirectUrl, "_blank");
      } else {
        window.open(url, "_blank");
      }

    }
  }

  takescreenshot() {
    // return html2canvas.default(document.body);
  }

  getGoToWidgetList(roleId) {
    this.homeService.getGoToWidgetLinksComplete(roleId).subscribe(res => {

      if (!res.IsError) {
        if (res.ResponseObject && Array.isArray(res.ResponseObject)) {
          this.goToWidgetList = [...res.ResponseObject];
        } else {
          // Error handling 
        }
      } else {
        console.log("Error");
      }

    });
  }

  SendFeedBackMsgList(roleId) {
    this.homeService.sendFeedbackFunc(roleId).subscribe(res => {
      if (!res.IsError) {
        console.log(res);
        this.errorMessage.throwError(res.Message)
      } else {
        this.errorMessage.throwError(res.Message)
      }
    }, error => {

    });
  }

  report;
  showInsights = false;
  loadingPowerBi = true;
  getInsitesPowerBIReport(roleId) {
    // debugger;
    // this.route.queryParams.subscribe(querypar => {
    // if (querypar && querypar.powerbi == "true") {
    // console.log("Queryparams", querypar);
    this.homeService.getInsitesReportFunc(roleId).subscribe(res => {
      if (!res.IsError) {
        console.log(res);
        console.log("Power Bi SOS API is Successfull");
        // let reportid = res.ResponseObject.ReportUrlInfo[0].ReportId;
        if (!this.service.isEmptyObject(res.ResponseObject)) {
          console.log(this.adalSvc + "in getInsitesPowerBIReport ADAL token");
          this.adalSvc.acquireToken('https://analysis.windows.net/powerbi/api').subscribe((resToken: string) => {
            if (resToken) {
              sessionStorage.setItem('PowerBIToken', JSON.stringify(resToken));
              this.loadingPowerBi = false;
              this.showInsights = true;
              console.log("resToken getInsitesPowerBIReport");
              console.log(resToken);
              this.Tiles = Number(res.ResponseObject.ReportUrlInfo[0].Tiles)
              //this.Tiles = 1;
              let data = {
                "reportId": res.ResponseObject.ReportUrlInfo[0].ReportId,
                "groupId": res.ResponseObject.ReportUrlInfo[0].GroupId,
                //"reportId": "037f16a5-b1d7-4af0-a471-ba44d24c7335",
                //"groupId": "461c329a-6d58-461f-b47f-623908f90886",
              }
              var url = "https://app.powerbi.com/reportEmbed?reportId=" + data.reportId + "&groupId=" + data.groupId;
              console.log("Report URL from API" + url);
              // Configuration
              let RevenueSummaryconfig;
              RevenueSummaryconfig = {
                type: 'report',
                accessToken: resToken,
                embedUrl: url,
                id: data.reportId,
                permissions: models.Permissions.All,
                viewMode: models.ViewMode.View,
                pageView: 'fitToWidth',
                settings: {
                  filterPaneEnabled: false,
                  navContentPaneEnabled: false//,
                  // layoutType: models.LayoutType.MobilePortrait
                }
              };
              setTimeout(() => {
                let RevenueSummaryreportContainer = document.getElementById('RevenueSummaryreportContainer');
                let powerbi = new pbi.service.Service(pbi.factories.hpmFactory, pbi.factories.wpmpFactory, pbi.factories.routerFactory);
                this.report = powerbi.embed(RevenueSummaryreportContainer, RevenueSummaryconfig);
                console.log(this.report)
              }, 500)
            }
            else {
              console.log('No Power BI Access')
            }
          });
        }

      } else {
        console.log("Error from get report API");
      }
    });
    // } else {
    //   this.loadingPowerBi = false;
    // }
    // });

  }


  getHelplineCount() {
    this.homeService.getHelplineCountFunc().subscribe(res => {

      console.log("Helpline List", res);
      if (!res.IsError) {
        console.log("Successfull");
        this.helpLineCounts = { ...res.ResponseObject };
      } else {
        console.log("Error");
      }
    });
  }


  getRolesList() {
    this.homeService.getRolesListComplete().subscribe(res => {
      console.log("Roles List", res);
      this.userRolesList = [...res.ResponseObject];
      this.GetApproval();
      console.log(this.userRolesList);
      if (Array.isArray(this.userRolesList) && this.userRolesList.length > 0) {
        this.getBannersList(this.userRolesList[0].Role.RoleId);
        this.getGoToWidgetList(this.userRolesList[0].Role.RoleId);
        if (this.envr.envName != "MOBILEQA") {
          // if (env.production) {
          // alert("PowerBi")
          this.powerBICheck();

          // } else {
          //   this.loadingPowerBi = false
          // }
        } else {
          this.loadingPowerBi = false
        }
      }
    });
  }
  getroleguid() {
    let userId = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
    console.log('role guid new changes --->', '<pre>shankar shankar</pre>');

    if (userId) this.SysGuid = userId;
    this.accountlistService.getRoles_v1(this.SysGuid).subscribe(res => {
      //console.log(res);
      if (!res.IsError && res.ResponseObject) {
        this.Roles = this.filter(res.ResponseObject);
        console.log("role guid new changes ---> roles array", this.Roles);
        let RoleInfo = this.encrDecrService.set('EncryptionEncryptionEncryptionEn', JSON.stringify(this.Roles), 'DecryptionDecrip');
        let roleGuid_enc = this.encrDecrService.set('EncryptionEncryptionEncryptionEn', this.Roles[0].RoleId, 'DecryptionDecrip');
        let roletype_enc = this.encrDecrService.set('EncryptionEncryptionEncryptionEn', this.Roles[0].RoleType, 'DecryptionDecrip');
        let Isowner = this.encrDecrService.set('EncryptionEncryptionEncryptionEn', this.Roles[0].IsOwner, 'DecryptionDecrip');
        let IsHelpDesk = this.encrDecrService.set('EncryptionEncryptionEncryptionEn', res.ResponseObject[0]['Role'] && res.ResponseObject[0]['Role']['IsHelpDesk'] ? res.ResponseObject[0]['Role']['IsHelpDesk'] : false, 'DecryptionDecrip');
        console.log(res.ResponseObject[0]['Role']['IsHelpDesk']);
        this.isHelpDesk = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', IsHelpDesk, 'DecryptionDecrip');
        console.log("helpdesk view", this.isHelpDesk);
        localStorage.setItem('roleGuid', roleGuid_enc);
        localStorage.setItem('roleType', roletype_enc);
        localStorage.setItem('Isownerexist', Isowner);
        localStorage.setItem('IsHelpDesk', IsHelpDesk);
        localStorage.setItem('RoleInfo', RoleInfo);
        this.roleType = this.Roles[0].RoleType;
        this.setUser(this.Roles[0]);
      }
    })
    // let roleGuid = this.EncrDecr.set('EncryptionEncryptionEncryptionEn', id, 'DecryptionDecrip');
    // localStorage.setItem('roleGuid', roleGuid);

  }
  changeAccntCreate() {
    if (this.isHelpDesk == 'true') {
      this.router.navigateByUrl('/accounts/helpdeskaccountcreation');
    } else {
      this.router.navigateByUrl('/accounts/accountcreation/createnewaccount');
    }
  }
  getdnbtoken() {

    this.master3Api.getdnbtoken("code").subscribe((res: any) => {
      console.log(" dnb token ", res);
      this.dnbtoken = res.ResponseObject.access_token
      localStorage.setItem('dNBToken', this.dnbtoken)
    },
      error => console.log("error ::: ", error))
  }
  setUser(user) {
    if (user.RoleType != 1 && user.RoleType != 2 && user.RoleType != 3) user.RoleType = 1;
    console.log(this.userRoles['' + user.RoleType + ''], user.RoleType);

    // this.service.loggedin_user=user;
    this.accservice.loggedin_user == this.userRoles['' + user.RoleType + ''];
    let temp = this.encrDecrService.set('EncryptionEncryptionEncryptionEn', user.RoleType, 'DecryptionDecrip');
    let log_user = this.encrDecrService.set('EncryptionEncryptionEncryptionEn', this.userRoles['' + user.RoleType + ''], 'DecryptionDecrip');
    localStorage.setItem("loggedin_user", log_user);
    // let log_user = this.encrDecrService.set('EncryptionEncryptionEncryptionEn', this.userRoles['' + user.RoleType + ''], 'DecryptionDecrip');
  }
  filter(data) {
    if (data.length > 0) {
      console.log("data roles", data);
      return data.map((role) => {
        return {
          Name: role.Role.Name,
          RoleId: role.Role.RoleId,
          RoleImage: role.Role.RoleImage,
          RoleType: role.Role.RoleType,
          IsOwner: role.Role.IsOwner,
          IsHelpDesk: role.Role.IsHelpDesk,
          IsExportExcel: role.Role.IsExportExcel
        }
      })
    }
  }

  powerBICheck() {
    this.powerBIAccessKey = sessionStorage.getItem('PowerBIToken');

    if (sessionStorage.getItem('PowerBIToken')) {
      console.log('Already Power bi token exits' + this.powerBIAccessKey);
      this.getInsitesPowerBIReport(this.userRolesList[0].Role.RoleId);
    } else {
      if (!this.adalSvc.isAuthenticated) {

        this.adalSvc.login()
      } else {
        console.log('called getInsitesPowerBIReport from PowerBIToken not avilable for second time');
        this.getInsitesPowerBIReport(this.userRolesList[0].Role.RoleId);
        // this.adalSvc.acquireToken('https://analysis.windows.net/powerbi/api').subscribe((resToken:string) => {
        //   if (resToken) { 
        //     if(!this.service.isEmptyObject(resToken)) {
        //     this.loadingPowerBi = false;
        //     this.showInsights = true;
        //     }
        //     console.log("Power bi token !!!!!!!!!!!!!!!!!!!!!!!!1")
        //     console.log(resToken);
        //     sessionStorage.setItem('PowerBIToken', JSON.stringify(resToken));
        //     this.powerBIAccessKey = sessionStorage.getItem('PowerBIToken');
        //     this.getInsitesPowerBIReport(this.userRolesList[0].Role.RoleId);
        //   }
        //   else {
        //     console.log('No Power bi token');
        //   }
        // })

      }
    }
  }

  getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  getInitialData() {
    this.myOpenLeadService.clearLeadAddContactSessionStore()
    let Userguid = (localStorage.getItem("userID"))
    const myOpenLeadGuid = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', Userguid, 'DecryptionDecrip');
    //get task list
    let TaskPostBody = {
      PageSize: 10,
      OdatanextLink: "",
      RequestedPageNumber: 1,
      Guid: myOpenLeadGuid
    }
    let ApprovalPostBody = {
      PageSize: 10,
      OdatanextLink: "",
      RequestedPageNumber: 1,
      Guid: myOpenLeadGuid
    }
    let reqBody = {
      PageSize: 50,
      OdatanextLink: "",
      RequestedPageNumber: 1
    }
    const MyOpenLeadsReqBody = {
      "StatusCode": 0,
      "PageSize": 50,
      "RequestedPageNumber": 1,
      "OdatanextLink": "",
      "Guid": myOpenLeadGuid
    }
    this.homeState = this.store.pipe(select(selecthomeData)).subscribe(res => {

      if (res.data.task != null) {
        let count = res.count.taskCount
        if (res.data.task.ResponseObject.length > 0) {
          this.taskListDetails = this.filterTableData(res.data.task.ResponseObject, false)
          console.log("kirankumar", this.taskListDetails)
          this.TaskLable = this.TaskLableName + '(' + count + ')'
        }
      } else {
        this.TaskLable = this.TaskLableName + '(' + '0' + ')'
        this.GetTask(TaskPostBody)
      }

      // if (res.data.approval != null) {
      //   if (res.data.approval.ResponseObject.length > 0) {
      //     let count = res.count.approvalCount;
      //     this.approvalListDetails = this.filterTableData(res.data.approval.ResponseObject, true)
      //     this.selectedIndex = 0;
      //     this.ApprovalLabel = this.ApprovalLabelName + '(' + count + ')'
      //   }
      // } else {
      //   this.GetApproval(ApprovalPostBody);
      // }

      this.getVisisbilityViewBtn();
    })

    // Selector for All activity list     
    // this.getAllActivityListState = this.store.pipe(select(getAllActivity)).subscribe(res => {
    //   if (res.count != 0) {
    //     console.log('Response from all activity store-->', res)
    //   } else {
    //     (this.CheckRoutePermit("home"));
    //     this.GetAllActivities(reqBody)
    //   }
    // })

    // Selector for contact list
    // this.getAllContactListState = this.store.pipe(select(getContactListData)).subscribe(res => {
    //   if (res.count != 0) {
    //     console.log('contact list response from store--->', res)
    //   } else {
    //     (this.CheckRoutePermit("contacts"));
    //     this.GetAllContactsList(reqBody)
    //   }
    // })



    // Selector for all campaign list
    // this.getAllCampaignListState = this.store.pipe(select(AllCampaignState)).subscribe(res => {
    //   if (res.count != 0) {
    //     console.log('all campaign list response from store-->', res)
    //   } else {
    //     (this.CheckRoutePermit("campaign"));
    //     this.GetAllCampaigns(reqBody)
    //   }
    // })

    // Selector for my open leads
    // this.getMyOpenLeadListState = this.store.pipe(select(getMyOpenLeadsList)).subscribe(res => {
    //   if (res) {
    //     console.log('my open leads list response from store-->', res)
    //   } else {
    //     (this.CheckRoutePermit("leads"));
    //     this.GetMyopenLeadsList(MyOpenLeadsReqBody)
    //   }
    // })
  }
  CheckRoutePermit(arg0: string): boolean {

    if (localStorage.getItem('routes')) {

      let permitedRoutes = JSON.parse(localStorage.getItem('routes'))
      return permitedRoutes.some(x => x.RoutePath == arg0)

    } else {
      return false
    }

  }

  // Function for setting the visibility of View all button based on the selected tab
  getVisisbilityViewBtn() {
    if (this.ApprovalTableCount == 0) {
      this.viewAllBtnVisibility = this.TabName != 'Approval(0)' && this.TabName != 'Task(0)' ? true : false
    } else {
      this.viewAllBtnVisibility = this.TabName != 'Approval(0)' && this.TabName != 'Task(0)' ? true : false
    }
  }

  navTo() {
    if (this.ApprovalTableCount == 0) {
      this.router.navigateByUrl('/home/approvaltask/task')
    } else {
      this.router.navigateByUrl('/home/approvaltask/approval')
    }
  }


  // Getting the Task List
  GetTask(reqBody) {
    let Userguid = (localStorage.getItem("userID"))
    let appUserGuid = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', Userguid, 'DecryptionDecrip');
    let useFulldata = {
      RequestedPageNumber: this.AllhomeRequestbody.RequestedPageNumber,
      pageSize: this.AllhomeRequestbody.PageSize,
      OdatanextLink: this.AllhomeRequestbody.OdatanextLink,
      AllhomeRequestbody: this.AllhomeRequestbody,
      Guid: [appUserGuid]

    }
    let reqBodyparams = this.homeService.GetAppliedFilterData({ ...reqBody, useFulldata: useFulldata })
    this.homeService.getAppliedFilterActionData(reqBodyparams).subscribe(res => {
      console.log("home filter", res);
      if (!res.IsError) {
        console.log("home data", res);

        if (res.ResponseObject.length > 0) {
          const ImmutableObj = {
            ...res
          }
          ImmutableObj.ResponseObject.map((x, i) => x.id = i + 1)
          // this.taskListDetails = this.filterTableData(res.ResponseObject, false)
          // this.TaskLable = this.TaskLableName + '(' + res.TotalRecordCount + ')'
          let taskActionObj = {
            data: ImmutableObj,
            count: res.TotalRecordCount
          }
          // this.TaskTableCount = res.TotalRecordCount
          this.store.dispatch(new LoadTaskList({ TaskList: taskActionObj }))

        } else {
          this.taskListDetails = []
          this.TaskLable = this.TaskLableName + '(' + '0' + ')';
          // this.TaskTableCount = 0;
          // this.selectedIndex = 0;
        }

      } else {

        this.taskListDetails = [];
        this.TaskLable = this.TaskLableName + '(' + '0' + ')';
        // this.TaskTableCount = 0;
        // this.selectedIndex = 0;
      }
    })
  }

  // Getting Approval List
  GetApproval() {
    let Userguid = (localStorage.getItem("userID"))
    let appUserGuid = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', Userguid, 'DecryptionDecrip');
    let ApprovalPostBody = {
      PageSize: 10,
      OdatanextLink: "",
      RequestedPageNumber: 1,
      Guid: appUserGuid
    }
    let roleUpdate: boolean = false;
    for (let i = 0; i < this.userRolesList.length; i++) {
      if (this.userRolesList[i].Role.RoleType == '2' || this.userRolesList[i].Role.RoleType == '3') {
        roleUpdate = true;
        break;
      }
    }

    if (roleUpdate) {
      const reqBodydata = {
        "ColumnSearchText": "",
        "SearchText": "",
        "ProirityCodes": [],
        "Descriptions": [],
        "OwnerGuids": [ApprovalPostBody.Guid],
        "PageSize": ApprovalPostBody.PageSize,
        "RequestedPageNumber": ApprovalPostBody.RequestedPageNumber,
        "IsDesc": true,
        "SortBy": 15,
        "StartDate": "",
        "EndDate": "",
      };
      this.homeService.getApprovallist(reqBodydata).subscribe(res => {
        if (!res.IsError) {
          console.log('Approval List Response--->', res)
          this.ApprovalTableCount = res.TotalRecordCount

          if (this.ApprovalTableCount == 0) {
            this.visible = false
          }
          if (res.ResponseObject.length > 0) {
            this.visible = true
            const ImmutableApprovalObj = {
              ...res
            }
            ImmutableApprovalObj.ResponseObject.map((x, i) => x.id = i + 1)
            this.approvalListDetails = this.filterTableData(res.ResponseObject, true)
            this.selectedIndex = 0;
            this.ApprovalLabel = this.ApprovalLabelName + '(' + res.TotalRecordCount + ')'
            console.log('Approval Label--->', this.ApprovalLabel)
            let approvalActionObj = {                              //state management for list
              data: ImmutableApprovalObj,
              count: res.TotalRecordCount
            }
            this.store.dispatch(new LoadApprovalList({ ApprovalList: approvalActionObj }))   //state management for list end

          } else {
            this.approvalListDetails = []
            this.selectedIndex = 1;
            this.ApprovalTableCount = 0;
            this.ApprovalLabel = this.ApprovalLabelName + '(' + "0" + ')'
          }
        } else {
          this.approvalListDetails = []
          this.selectedIndex = 1;
          this.ApprovalTableCount = 0;
          this.ApprovalLabel = this.ApprovalLabelName + '(' + "0" + ')'
        }

      });
    } else {
      this.approvalListDetails = [];
      this.selectedIndex = 1;
      this.ApprovalTableCount = 0;
      this.ApprovalLabel = this.ApprovalLabelName + '(' + "0" + ')'
    }
  }


  // Getting All activity list
  GetAllActivities(reqBody) {
    this.activity.GetAllActivities(reqBody).subscribe(res => {
      if (!res.IsError) {
        if (res.ResponseObject.length > 0) {
          const ImmutabelObj = Object.assign({}, res)
          const perPage = reqBody.PageSize;
          const start = ((reqBody.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;
          res.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          })
          ImmutabelObj.ResponseObject.map(x => x.id = x.Guid)
          let ActivityAction = {
            allactivity: ImmutabelObj.ResponseObject,
            count: ImmutabelObj.TotalRecordCount,
            nextlink: ImmutabelObj.OdatanextLink
          }
          this.store.dispatch(new LoadAllActivity({ activity: ActivityAction }))
        }
      } else {
        this.popUp.throwError(res.Message)
      }
    },
      error => {
        // this.popUp.throwError(error)
      })
  }

  // Getting All Contact List
  GetAllContactsList(reqBody) {
    this.contact.getAllContactList(reqBody).subscribe(contactList => {
      if (!contactList.IsError) {
        console.log("contact list response--->", contactList.ResponseObject)
        if (contactList.ResponseObject.length > 0) {
          const ImmutableObject = Object.assign({}, contactList)
          const perPage = reqBody.PageSize;
          const start = ((reqBody.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;
          console.log(start + " - " + end);
          contactList.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          })
          ImmutableObject.ResponseObject.map(x => x.id = x.Guid)
          this.store.dispatch(new LoadAllContacts(
            {
              AllContacts: ImmutableObject.ResponseObject,
              count: contactList.TotalRecordCount,
              nextlink: contactList.OdatanextLink
            }))
        }
      } else {
        this.popUp.throwError(contactList.Message)
      }
    },
      error => {
        // this.popUp.throwError(error)
      })
  }


  // Getting All Campaign list
  GetAllCampaigns(reqBody) {
    this.campaign.getALLCampaignList(reqBody).subscribe(campaignList => {
      if (!campaignList.IsError) {
        if (campaignList.ResponseObject.length > 0) {
          const ImmutableObject = Object.assign({}, campaignList)
          const perPage = reqBody.PageSize;
          const start = ((reqBody.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;
          console.log(start + " - " + end);
          campaignList.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          })
          ImmutableObject.ResponseObject.map(x => x.id = x.Id)
          this.store.dispatch(new AllCampaignLists({
            AllCampaignModel: ImmutableObject.ResponseObject,
            count: campaignList.TotalRecordCount,
            OdatanextLink: campaignList.OdatanextLink
          }))
        }
      } else {
        this.popUp.throwError(campaignList.Message)
      }
    },
      error => {
        // this.popUp.throwError(error)
      })
  }

  // Getting My open leads
  GetMyopenLeadsList(MyOpenLeadsReqBody) {
    this.myOpenLeadsService.getMyopenLeads(MyOpenLeadsReqBody).subscribe(res => {
      console.log('My open leads response-->', res)
      if (!res.IsError) {
        if (res.ResponseObject.length > 0) {
          const ImmutabelObj = Object.assign({}, res)
          const perPage = MyOpenLeadsReqBody.PageSize;
          const start = ((MyOpenLeadsReqBody.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;
          res.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          })
          ImmutabelObj.ResponseObject.map(x => x.id = x.LeadGuid)
          const LoadMyOpenLeadAction = {
            listdata: ImmutabelObj.ResponseObject,
            count: ImmutabelObj.TotalRecordCount,
            nextlink: ImmutabelObj.OdatanextLink
          }
          this.store.dispatch(new LoadMyOpenleads({ myOpenLeads: LoadMyOpenLeadAction }))
        }
      } else {
        this.popUp.throwError(res.Message)
      }
    }, error => {
      // this.popUp.throwError(error)
    })
  }
  // setUrlParamsInStorage(route_from, id) {
  //   let obj = { 'route_from': route_from, 'Id': id };
  //   localStorage.setItem('routeParams', this.encrDecrService.set('EncryptionEncryptionEncryptionEn', JSON.stringify(obj), 'DecryptionDecrip'))

  // }
  viewApproveDetails(task) {
    sessionStorage.setItem('accountCreateRouter', JSON.stringify(this.router.url))
    if (task.TaskType.IsProspect) {
      this.accountlistService.setSession('routeParams', { 'route_from': 'acc_req', 'Id': task.RegardingobjectId });
      this.router.navigate(['/accounts/accountmodification/viewmodificationdetails']);
    } else if (task.TaskType.IsModificationRequest) {
      this.accountlistService.setSession('routeParams', { 'route_from': 'modif_req', 'Id': task.RegardingobjectId });
      this.router.navigate(['/accounts/accountmodification/viewmodificationdetails']);
    } else if (task.TaskType.IsAssignmentReference) {
      this.accountlistService.setSession('routeParams', { 'route_from': 'assign_ref', 'Id': task.RegardingobjectId });
      this.router.navigate(['/accounts/accountmodification/viewmodificationdetails']);
    }
  }
  viewTaskDetails(task) {
    console.log('task details-->', task)
    if (task.Subject == 'Meeting Enrichment') {
      this.store.dispatch(new ClearMeetingDetails())
      let encName = this.encrDecrService.set("EncryptionEncryptionEncryptionEn", task.RegardingobjectId, "DecryptionDecrip");
      console.log('encName', encName)
      sessionStorage.setItem("MeetingListRowId", JSON.stringify(encName))
      sessionStorage.setItem('navigationfromMeeting', JSON.stringify(7))
      this.router.navigate(['/activities/meetingInfo']);
    } else if (task.Subject == 'Contact Enrichment') {
      localStorage.setItem("contactEditId", JSON.stringify(task.RegardingobjectId));
      this.store.dispatch(new ClearDeActivateContactList());
      this.store.dispatch(new ClearContactList());
      this.store.dispatch(new ClearTaskList())
      this.router.navigate(['/contacts/Contactdetailslanding/contactDetailsChild']);
    } else {
      sessionStorage.setItem("ActivityId", JSON.stringify({ id: task.activityId, navigation: this.router.url }));
      this.router.navigate(['/activities/actiondetails'])
    }
  }


  GetStatusComplete(Id: any) {
    this.homeService.getStatusComplete(Id).subscribe(async res => {
      if (res.IsError === false) {

        console.log('Task Id-->', Id)
        // this.taskListDetails = this.taskListDetails.filter(x => x.activityId != Id);
        // this.TaskTableCount = this.TaskTableCount - 1
        // this.TaskLable = this.TaskLableName + '(' + this.TaskTableCount + ')'
        let val;
        this.matSnackBar.open(res.Message, val, {
          duration: 3000
        })
        this.store.dispatch(new ClearTaskList())
        await this.offlineService.ClearTaskListIndexTableData()
        this.selectedIndex = 1
      }

      if (res.IsError === true) {
        let val;
        this.matSnackBar.open(res.Message, val, {
          duration: 2000
        })
      }
      this.isLoading = false
      console.log('task status', res)
    })
  }


  ngOnDestroy() {
    this.homeState.unsubscribe()
    // this.getAllActivityListState.unsubscribe();
    // this.getAllContactListState.unsubscribe()
    // this.getAllCampaignListState.unsubscribe()
    // this.getMyOpenLeadListState.unsubscribe()
  }

  replaceSpaceEnter(data) {
    return data.replace(/<\/?[^>]+↵>/ig, " ");
  }

  filterTableData(data, isApproval) {
    if (data.length > 0) {
      return data.map((res, i) => {
        if (isApproval) {
          return {
            activityId: res.ActivityId,
            number: i + 1,
            desc: (res.Subject) ? this.replaceSpaceEnter(res.Subject.toString()) : "NA",
            priority: (res.Priority) ? res.Priority : "NA",
            dueDate: (res.DueDate) ? this.datePipe.transform(res.DueDate, 'dd-MMM-y') : "NA",
            id: i + 1,
            Subject: (res.Subject) ? this.replaceSpaceEnter(res.Subject.toString()) : "NA",
            RegardingobjectId: res.RegardingobjectId,
            approveBtnVisibility: res.ActionButtons.IsAccept,
            rejectBtnVisibility: res.ActionButtons.IsReject,
            viewBtnVisibility: res.ActionButtons.IsView,
            TaskType: res.TaskType,
            ProcessGuid: res.ProcessGuid,
            TaskName: res.TaskName,
            CustomerAccount: res.CustomerAccount,
            Owner: res.Owner,
            RequestType: res.RequestType,
            Status: res.StatusStage ? res.StatusStage.Value : ""
          }
        } else {
          return {
            activityId: res.ActivityId,
            number: i + 1,
            desc: (res.Title) ? res.Title : "NA",
            priority: (res.Priority) ? res.Priority : "NA",
            date: (res.DueDate) ? this.datePipe.transform(res.DueDate, 'dd-MMM-y') : "NA",
            id: i + 1,
            Subject: res.Subject,
            RegardingobjectId: res.RegardingobjectId
          }
        }

      })
    } else {
      return [{}]
    }
  }
  revTable = false;
  orderTable = false;
  operatingTable = false;
  pipelineTable = false;
  winTable = false;
  nominatedTable = false;
  toggleRevSummary() {
    this.revTable = !this.revTable;
  }
  toggleOrderSummary() {
    this.orderTable = !this.orderTable;
  }
  toggleOperatingMargin() {
    this.operatingTable = !this.operatingTable;
  }
  togglePipeSummary() {
    this.pipelineTable = !this.pipelineTable;
  }
  toggleWinSummary() {
    this.winTable = !this.winTable;
  }
  toggleNomAccounts() {
    this.nominatedTable = !this.nominatedTable;
  }
  overlay: boolean = false;
  dashboardFab: boolean = false;
  Oval() {
    this.service.overlay = !this.service.overlay;
    this.dashboardFab = !this.dashboardFab;
    document.getElementsByTagName('body')[0].classList.toggle("active");
    this.service.oval = true;
  }
  removeScroll() {
    document.getElementsByTagName('body')[0].classList.remove("active");
  }
  name = 'Angular';
  slideNo = 0;
  withAnim = true;
  resetAnim = true;

  //  @ViewChild('myCarousel') myCarousel: NguCarousel;
  carouselConfig: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
    load: 3,
    interval: { timing: 5000, initialDelay: 1000 },
    loop: true,
    touch: true,
    velocity: 0.2,
    point: {
      visible: true,
      hideOnSingleSlide: true
    }
  }
  carouselItems = [{
    images: "assets/images/slideImage1.png",
    title: "Welcome",
    name: localStorage.getItem('upn'),
    desc: "",
    classname: "first-carousel"
  },
  {
    images: "assets/images/slideImage2.png",
    title: "Gain better control",
    name: "over your pursuits",
    desc: "While Intelligent Enterprise is generally understood as an approach to management that applies technology and..."
  },
  {
    images: "assets/images/slideImage3.png",
    title: "Pointers to Speed-Up Order",
    name: "Booking Approval Process",
    desc: "While Intelligent Enterprise is generally understood as an approach to management that applies technology and..."
  }, {
    images: "assets/images/slideImage4.png",
    title: "Gain better control",
    name: "over your pursuits",
    desc: "While Intelligent Enterprise is generally understood as an approach to management that applies technology and..."
  },
  {
    images: "assets/images/slideImage5.png",
    title: "Pointers to Speed-Up Order",
    name: "Booking Approval Process",
    desc: "While Intelligent Enterprise is generally understood as an approach to management that applies technology and..."
  }]

  carouselItemsSec = ["assets/images/client.png", "assets/images/elearning.png", "assets/images/voice.png", "assets/images/solutions.png"];
  carouselItemsKnowledge = ["assets/images/slideImage6.png", "assets/images/slideImage4.png", "assets/images/slideImage5.png", "assets/images/slideImage2.png"]

  ngAfterViewInit() {
    this.cdr.detectChanges();
    this.getVisisbilityViewBtn()
  }

  help = false;
  showSelfHelp() {
    this.help = !this.help;
  }

  openFeedbackPop() {
    html2canvas(document.body).then(canvas => {
      var imgData = canvas.toDataURL("image/jpeg", 0.5);
      console.log("mmm>>>>>>", imgData);
      const dialogRef = this.dialog.open(FeedbackComponent,
        {
          disableClose: true,
          width: '410px',
          data: {
            "moduleName": "DEFAULT",
            "feedbackText": "",
            "comment": "",
            "userId": this.encrDecrService.get("EncryptionEncryptionEncryptionEn", localStorage.getItem("userID"), 'DecryptionDecrip'),
            "feedbackId": "",
            "addImage": true,
            "snapshot": imgData
          }
        });

      dialogRef.afterClosed().subscribe(result => {
        if (result)
          this.SendFeedBackMsgList(result);
      });
    });;

  }
  typeOfConversationPopup() {
    this.service.overlay = false;
    this.dashboardFab = false;
    this.newconversationService.conversationAppointId = undefined;
    localStorage.removeItem('forMeetingCreation')
    this.meetingService.createdMeetingGuid = ""
    this.newconversationService.attachmentList = []
    this.meetingService.meetingDetails = undefined;
    this.newconversationService.conversationFiledInformation = undefined;
    this.service.TempEditLeadDetails();
    this.router.navigate(['/activities/newmeeting'])
  }

  approveReject(data, act) {
    console.log(data);
    if (act == 'approve') {
      const dialogRef = this.dialog.open(OpenConfirmApproval,
        {
          disableClose: true,
          width: '380px',
          data: { rowData: data, accName: data.CustomerAccount.Name, isActivation: '', TaskType: data.TaskType },
        });
      dialogRef.afterClosed().subscribe(result => {

        if (result.action == 'yes') {
          if (act == 'approve') {
            if (data.TaskType.IsAssignmentReference) {
              if (this.roleType == 2) {
                this.reworkStatus = 184450003;
                this.reference_sbuReview(this.reviewAssignPayload(data));
              } else if (this.roleType == 3) {
                this.reworkStatus = 184450003;
                this.reference_reviewCso(this.reviewAssignPayload(data));
              }
            } else if (data.TaskType.IsProspect) {
              let obj = {
                "overall_comments": {
                  "prospectid": data.RegardingobjectId,
                  "overallcomments": "",
                  "requestedby": this.userId
                },
                "processinstanceid": data.ProcessGuid,
                "ischangerequired": false,
                "prospect": {},
                "attribute_comments": []
              };
              obj['overall_comments']['status'] = 184450002;
              obj['prospect']['statuscode'] = 184450001;
              obj['prospect']['name'] = data.TaskName;
              obj['prospect']['createby'] = this.userId; //added by divya on Santosh's recomendation
              if (this.roleType == 3) {
                obj['overall_comments']['status'] = 184450003;
                obj['prospect']['statuscode'] = 184450002;
                this.reviewCso(obj);
              } else {
                this.validateSbu(obj);
              }
            } else if (data.TaskType.IsModificationRequest) {
              let obj = {
                //   "overall_comments": {
                //     "accountid": data.MapGuid,
                //     "overallcomments": "",
                //     "requestedby": this.userId
                //   },
                //   "account": { "accountid": data.MapGuid, "isownermodified": false, "requestedby": this.userId, "accounttype": data.AccounttypeId },
                //   "attribute_comments": []
                // };
                // obj['processinstanceid'] = data.ProcessGuid;
                // obj['overall_comments']['status'] = 184450001;
                // {
                "account": {
                  "requestedby": this.userId,
                  "requesttype": 1,
                  "name": data.TaskName,
                  "accountnumber": data.CustomerAccount.Number,
                  "isownermodified": false,
                  "accountid": data.CustomerAccount.SysGuid,
                  "accounttype": data.CustomerAccount.Type.Id
                },
                "ischangerequired": false,
                "processinstanceid": data.ProcessGuid,
                "attribute_comments": [],
                "overall_comments": {
                  "accountid": data.CustomerAccount.SysGuid,
                  "overallcomments": "sdfghj",
                  "requestedby": this.userId,
                  "status": 184450001
                }
              }
              if (this.roleType == 3) {
                obj['overall_comments']['status'] = 184450006;
                this.modification_reviewCso(obj);
              }
              else if (this.roleType == 2) {
                // obj['overall_comments']['status'] = 184450001;
                // this.modification_manualAccountModification(obj);
                obj['ischangerequired'] = false;
                obj['overall_comments']['status'] = 184450001;
                if (data.RequestType.Id == 4) {
                  this.modification_validateSbu(obj);
                }
                else {
                  this.modification_manualAccountModification(obj);
                }
              }

            }
          }

        }
      });
    } else if (act == 'reject') {
      const dialogRef = this.dialog.open(OpenRejectComments,
        {
          disableClose: true,
          width: '380px',
          data: { accName: data.TaskName, isActivation: '', TaskType: data.TaskType }
        });
      dialogRef.afterClosed().subscribe(result => {
        if (result.action == 'yes') {
          if (data.TaskType.IsAssignmentReference) {
            // this.reworkStatus = 184450004;
            // this.reference_sbuReview();
            if (this.roleType == 2) {
              this.reworkStatus = 184450004;
              this.reference_sbuReview(this.reviewAssignPayload(data));
            } else if (this.roleType == 3) {
              this.reworkStatus = 184450004;
              this.reference_reviewCso(this.reviewAssignPayload(data));
            }
          } else if (data.TaskType.IsProspect) {
            let obj = {
              "overall_comments": {
                "prospectid": data.RegardingobjectId,
                "overallcomments": result.comment,
                "requestedby": this.userId
              },
              "processinstanceid": data.ProcessGuid,
              "ischangerequired": false,
              "prospect": {},
              "attribute_comments": []
            };
            // obj['overall_comments']['status'] = 184450002;
            // obj['prospect']['statuscode'] = 184450001;
            obj['prospect']['name'] = data.TaskName;
            obj['overall_comments']['status'] = 184450005;
            obj['prospect']['statuscode'] = 184450004;
            obj['prospect']['createby'] = this.userId; //added by anil on Santosh's recomendation
            if (this.roleType == 3) {
              // obj['overall_comments']['status'] = 184450003;
              // obj['prospect']['statuscode'] = 184450002;
              this.reviewCso(obj);
            } else {
              this.validateSbu(obj);
            }
            // this.RejectProspectAccount("comment", data);
          } else if (data.TaskType.IsModificationRequest) {
            this.RejectModifyAccount(result.comment, data);
          }
        }
      })
    }
  }
  modification_validateSbu(obj) {
    this.isLoading = true;
    this.accountlistService.modification_validateSbu(obj).subscribe(result => {
      // this.store.dispatch(new ModificationActiveRequestsClear({ ModificationActiveModel: {} }));
      // this.store.dispatch(new modificationHistoryRequestsClear({ ModificationHistoryModel: {} }))
      // if (result.Status) {
      //   this.snackBar.open(result.Status, '', {
      //     duration: 3000
      //   })
      // }
      if (result.status.toLowerCase() == 'success') {
        this.isLoading = false;
        this.getInitialData();
        // this.GetAllHistory(this.ModificationActiveAccountRequest, false); // kkn  --> calling API, temprory fix
        this.matSnackBar.open(result.data[0].Status, '', {
          duration: 3000
        });
        this.GetApproval();
      }
      // this.router.navigate(["/accounts/accountmodification/modificationactiverequest"]);
    }, error => {
      this.isLoading = false;
    })
  }
  reviewAssignPayload(data) {
    let payload = {
      "assignmentReference": {
        "assignmentReferenceId": data.RegardingobjectId,
        // "ownerid": "",
        // "sbu": "",
        // "subvertical": "",
        // "cbu": "",
        // "vertical": "",
        // "parentaccount": "",
        // "ultimateparent": "",
        // "geography": "",
        // "region": "",
        // "country": "",
        // "state": "",
        // "city": "",
        "comments": "dsa",
        "accountid": data.CustomerAccount.SysGuid,
        "rrquesttpe": 184450000,
        "statuscode": this.reworkStatus,
        // "CBUCustomerContact": "",
        "activebuyerorganization": "Genpact",
        // "cbuownerfromwipro": "",
        "isprimary": true,
        "issecondary": false,
        "territoryflag": true,
        "territoryflagid": 1,
      },
      "processinstanceid": data.ProcessGuid,
      "attribute_comments": [],
      "status": this.reworkStatus,
      "requestedby": this.userId,
      "isSbuChanged": false
    }

    return payload;
  }
  validateSbu(obj) {
    this.isLoading = true;
    this.accountlistService.validateSbu(obj).subscribe(res => {
      if (res['status'] == "success") {
        this.isLoading = false;
        this.matSnackBar.open(res.data[0].Status, '', {
          duration: 3000
        });
        this.GetApproval();
      }
      else {
        this.matSnackBar.open(res.message, '', {
          duration: 5000
        });
      }
    }, error => {
      let err = JSON.parse(error);
      console.log("error is there", err['message']);
      // console.log("error message",error[\"message\"])
      this.isLoading = false;
      this.matSnackBar.open(err['message'], '', {
        duration: 5000
      });
    });
  }
  /* API for Approve, Reject,Rowork from CSO ** START ** */
  reviewCso(obj) {
    this.isLoading = true;
    this.accountlistService.reviewCso(obj).subscribe(res => {
      console.log(res);
      if (res.status.toLowerCase() == 'success') {
        this.isLoading = false;
        this.matSnackBar.open(res.data[0].Status, '', {
          duration: 3000
        });
        this.GetApproval();
      }
      else {
        this.matSnackBar.open(res.message, '', {
          duration: 5000
        });
      }

      // this.router.navigate(['/accounts/accountcreation/activerequest']);
    }, error => {
      let err = JSON.parse(error);
      console.log("error is there", err['message']);
      // console.log("error message",error[\"message\"])
      this.isLoading = false;
      this.matSnackBar.open(err['message'], '', {
        duration: 5000
      });
    });
  }
  /* API for Approve, Reject,Rowork from CSO ** START ** */
  /* API for Approve, Reject */
  modification_manualAccountModification(obj) {
    this.isLoading = true;
    this.accountlistService.modification_manualAccountModification(obj).subscribe(result => {
      this.isLoading = false;
      if (result.Status) {
        this.matSnackBar.open(result.Status, '', {
          duration: 3000
        })
      }
    }, error => {
      this.isLoading = false;
    })
  }
  reference_sbuReview(data) {
    this.isLoading = true;
    this.accountlistService.reference_sbuReview(data).subscribe(result => {
      this.isLoading = false;
      if (result['status'] == "success") {
        this.matSnackBar.open(result.data[0].Status, '', {
          duration: 3000
        });
      }
    }, error => {
      this.isLoading = false;
    })
  }
  /* API for Approve, Reject,Rowork from CSO  assign ** START */
  reference_reviewCso(obj) {
    this.isLoading = true;
    this.accountlistService.reference_reviewCso(obj).subscribe(result => {
      this.isLoading = false;
      if (result.status.toLowerCase() == 'success') {
        this.matSnackBar.open(result.data[0].Status, '', {
          duration: 3000
        })
      }
      else {
        this.matSnackBar.open(result['message'], '', {
          duration: 3000
        })
      }
      // this.router.navigate(["/accounts/assignmentRef/assigactiverequest"]);
    }, error => {
      this.isLoading = false;
    })
  }
  // ApproveAccount(comment, ids) {
  //   let obj = {
  //     "overall_comments": {
  //       "prospectid": ids.id,
  //       "overallcomments": comment,
  //       "requestedby": this.userId
  //     },
  //     "processinstanceid": ids.ProcessGuid,
  //     "ischangerequired": false,
  //     "prospect": {},
  //     "attribute_comments": []
  //   }
  //   if (this.loggedin_user == "cso") {
  //     obj['overall_comments']['status'] = 184450003;
  //     obj['prospect']['statuscode'] = 184450002;
  //   }
  //   else if (this.loggedin_user == "sbu") {
  //     obj['overall_comments']['status'] = 184450002;
  //     obj['prospect']['statuscode'] = 184450001;
  //   }
  //   else { console.log("something wrong1..."); }

  //   if (this.loggedin_user == "cso") {
  //     this.reviewCso(obj);
  //   }
  //   else if (this.loggedin_user == "sbu") {
  //     this.validateSbu(obj);
  //   }
  //   else { console.log("something wrong2...");}
  // }
  RejectModifyAccount(comment, data) {
    console.log(data);

    let obj = {
      // "overall_comments": {
      //   "accountid": data.MapGuid,
      //   "overallcomments": comment,
      //   "requestedby": this.userId
      // },
      // "account": { "accountid": data.MapGuid, "isownermodified": false, "requestedby": this.userId, "accounttype": data.AccounttypeId },
      // "attribute_comments": []

      "account": {
        "requestedby": this.userId,
        "requesttype": 1,
        "name": data.TaskName,
        "accountnumber": data.CustomerAccount.Number,
        "isownermodified": false,
        "accountid": data.CustomerAccount.SysGuid,
        "accounttype": data.CustomerAccount.Type.Id
      },
      "ischangerequired": false,
      "processinstanceid": data.ProcessGuid,
      "attribute_comments": [],
      "overall_comments": {
        "accountid": data.CustomerAccount.SysGuid,
        "overallcomments": comment,
        "requestedby": this.userId,
        "status": 184450001
      }
    };

    obj['processinstanceid'] = data.ProcessGuid;
    if (this.roleType == 3) {
      obj['overall_comments']['status'] = 184450002;
      this.modification_reviewCso(obj);
    }
    else if (this.roleType == 2) {
      if (data.RequestType.Id == 4) {
        obj['ischangerequired'] = false;
        obj['overall_comments']['status'] = 184450002;
        this.modification_validateSbu(obj);
      }
      else {
        obj['overall_comments']['status'] = 184450002;
        this.modification_manualAccountModification(obj);
      }
      // obj['overall_comments']['status'] = 184450002;
      // this.modification_manualAccountModification(obj);
    }
    // else { }
  }
  modification_reviewCso(obj) {
    this.isLoading = true;
    this.accountlistService.modification_reviewCso(obj).subscribe(result => {
      // this.store.dispatch(new ModificationActiveRequestsClear({ ModificationActiveModel: {} }));
      // this.store.dispatch(new modificationHistoryRequestsClear({ ModificationHistoryModel: {} }))
      if (result.status.toLowerCase() == 'success') {
        this.isLoading = false;
        this.matSnackBar.open(result.data[0].Status, '', {
          duration: 3000
        });
        this.GetApproval();
      }

      // this.router.navigate(["/accounts/accountmodification/modificationactiverequest"]);
    }, error => {
      this.isLoading = false;
    })
  }
  // ApproveModifyAccount(comment, ids) {
  //    console.log(ids);
  //   let obj = {
  //     "overall_comments": {
  //       "accountid": ids.MapGuid,
  //       "overallcomments": comment,
  //       "requestedby": this.userId
  //     },
  //     "account": { "accountid": ids.MapGuid, "isownermodified": false, "requestedby": this.userId,"accounttype": ids.AccounttypeId },
  //     "attribute_comments": []
  //   };
  //   obj['processinstanceid'] = ids.ProcessGuid;
  //   if (this.loggedin_user == "cso") {
  //     obj['overall_comments']['status'] = 184450006;
  //     this.modification_reviewCso(obj);
  //   }
  //   else if (this.loggedin_user == "sbu") {
  //     obj['overall_comments']['status'] = 184450001;
  //     this.modification_manualAccountModification(obj);
  //   }
  //   else { }
  // }
  RejectProspectAccount(comment, ids) {
    let obj = {
      "overall_comments": {
        "prospectid": ids.id,
        "overallcomments": comment,
        "requestedby": this.userId
      },
      "processinstanceid": ids.ProcessGuid,
      "ischangerequired": false,
      "prospect": {},
      "attribute_comments": []
    };

    // if (this.loggedin_user == "cso") {
    //   obj['overall_comments']['status'] = 184450005;
    //   obj['prospect']['statuscode'] = 184450004;
    // }
    // else if (this.loggedin_user == "sbu") {
    obj['overall_comments']['status'] = 184450005;
    obj['prospect']['statuscode'] = 184450004;
    // } else { }

    // if (this.loggedin_user == "cso") {
    //   this.reviewCso(obj);
    // }
    // else if (this.loggedin_user == "sbu") {
    this.validateSbu(obj);
    // }
  }

}

// Generic popup ends
// Sprint 3 pop-ups
//Kiran Code
@Component({
  selector: 'confirmapproval',
  templateUrl: '../../../shared/components/single-table/Sprint3Models/confirmapproval-popup.html',
})

export class OpenConfirmApproval {
  overallcomment: string;
  isActivation: string = '';
  route_from: string = '';
  accName: string = '';
  approvalObj = { action: '', comment: '' };
  accountData: any;
  rowData: any;
  constructor(public envr: EnvService, private snackBar: MatSnackBar, public dialogRef: MatDialogRef<OpenConfirmApproval>, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) {
    //  var accountName = JSON.stringify(data);
    //  console.log(data.Name + "  overview");
    if (data) {
      console.log("dataa for approve or reject", data)
      this.isActivation = data.isActivation;
      this.accName = data.accName;
      this.rowData = this.data.rowData;
      if (data.TaskType.IsModificationRequest) {
        this.route_from = "modif_req";
      } else if (data.TaskType.IsAssignmentReference) {
        this.route_from = "assign_ref";
      } else if (data.TaskType.IsProspect) {
        this.route_from = "acc_req";
      }
    }
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.accountData = {
      HuntingRatio: this.rowData.Owner.HuntingRatio,
      RequesttypeId: this.rowData.RequestType.Id,
      isSwappedAccount: this.rowData.RequestType.Id == 3 ? true : false,
      redirect_from: this.route_from,
      Name: this.accName,
      OverAllComments: "Hello comments",
      Requesttype: this.rowData.RequestType.Value,
      Status: this.rowData.Status,
      ExistingRatio: this.rowData.Owner.ExistingRatio,
      Owner: this.rowData.Owner.FullName
    }
  }
  ConfirmComment(act, submitComment) {
    this.approvalObj = { action: act, comment: submitComment };
    this.dialogRef.close(this.approvalObj);
  }
}

@Component({
  selector: 'Approvecomments',
  templateUrl: './../../account/pages/review-new-account/Approvecomments-popup.html',
})

export class OpenApproveComments {
  overallcomments: string = '';
  route_from: string = '';
  accName: string = '';
  loggedin_user: string = '';
  approvalObj = { action: '', comment: '' };
  isActivation: string = '';
  account1 = '';
  account2 = '';
  constructor(public envr: EnvService, private snackBar: MatSnackBar, public dialogRef: MatDialogRef<OpenApproveComments>, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      console.log("dtaa for approve or reject", data)
      this.isActivation = data.isActivation;
      this.accName = data.accName;
      if (data.TaskType.IsModificationRequest) {
        this.route_from = "modif_req";
      } else if (data.TaskType.IsAssignmentReference) {
        this.route_from = "assign_ref";
      } else if (data.TaskType.IsProspect) {
        this.route_from = "acc_req";
      }

    }
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
  submitComment(act, submitComment) {
    this.approvalObj = { action: act, comment: submitComment };
    this.dialogRef.close(this.approvalObj);
  }
}

@Component({
  selector: 'Reject',
  templateUrl: './../../account/pages/review-new-account/Rejectcomments-popup.html',
})
export class OpenRejectComments {
  overallcomments: string = '';
  route_from: string = '';
  accName: string = '';
  isActivation: string = '';
  rejSubmitted: boolean = false;
  constructor(public envr: EnvService, private snackBar: MatSnackBar, public accservive: DataCommunicationService, public dialogRef: MatDialogRef<OpenRejectComments>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      console.log("dtaa for approve or reject", data)
      this.isActivation = data.isActivation;
      this.accName = data.accName;
      // this.TaskType = data.TaskType;
      if (data.TaskType.IsModificationRequest) {
        this.route_from = "modif_req";
      } else if (data.TaskType.IsAssignmentReference) {
        this.route_from = "assign_ref";
      } else if (data.TaskType.IsProspect) {
        this.route_from = "acc_req";
      }
    }
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  submitComment(status, submitComment) {
    if (submitComment != "") {
      let rejectObj = { action: status, comment: submitComment };
      this.dialogRef.close(rejectObj);
    } else {
      this.rejSubmitted = true;
      // this.snackBar.open("Comments field is mandatory", '', {
      //   duration: 3000
      // });
    }
  }
}


@Component({
  selector: 'app-feedback',
  templateUrl: './feedback-popup.html',
  styleUrls: ['./home.component.scss']
})
export class FeedbackComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public dialogueData, public dialogRef: MatDialogRef<FeedbackComponent>) {
    console.log(dialogueData);
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
}
