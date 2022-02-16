import { Component, OnInit, Input } from '@angular/core';
import { map, filter, pluck, groupBy, mergeMap, toArray } from 'rxjs/operators';
import { AccountService } from '@app/core/services/account.service';
import { Observable, of, concat, from } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DataCommunicationService } from '@app/core/services/global.service';
import { AccountListService } from '@app/core/services/accountList.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { environment as env } from '@env/environment';
import { EnvService } from '@app/core/services/env.service';
// import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-moreview',
  templateUrl: './moreview.component.html',
  styleUrls: ['./moreview.component.scss']
})
export class MoreviewComponent implements OnInit {
  selectedTabId;
  AccountCreationActiveRequestsTable = [];
  tableview: boolean;
  tabList2;
  CustomViews: any;
  isLoading;
  cardview: boolean = true;

  constructor( public envr : EnvService,public userdat:DataCommunicationService, public farmingaccount: AccountService, public router: Router, public dialog: MatDialog,
    private AccountListService: AccountListService, private EncrDecr: EncrDecrService, private snackBar: MatSnackBar, ) { }

  //   ngOnInit(): void {
  //     var orginalArray = this.farmingaccount.getAllFarming();

  //    orginalArray.subscribe((x: any[]) => {
  //   //  console.log(x);
  //    this.AccountCreationActiveRequestsTable = x;

  //    });    
  //  }

  more_clicked;
  show;
  value: string = "Alphabetically";
  reverse: boolean;
  expand = false;
  searchItem: String;
  data: any = [];
  isPin: boolean = true;
  totalviews: any;
  headerData = [
    { name: "title", subProp: "pinStatus", isFirst: true, title: "Title", type: "text", selectName: " Views " },
    { name: "created_by", title: "Created By", type: "text" },
    { name: "created_on", title: "Created On", type: "date" }
  ]

  datachange() {
    this.tableview = true;
    this.cardview = false;
  }
  redirecttodetail(item) {
    //https://quantumt.wipro.com/main.aspx?etn=account&pagetype=entitylist&viewid={70CABE16-2FCA-E911-A836-000D3AA058CB}&viewtype=4230&navbar=off&cmdbar=false#436148839
    const moreviewurl = this.envr.authConfig.url;
    let viewid = item[0].Userqueryid;
    console.log('item-->', item);
    //let accGuid = localStorage.getItem('accountSysId');
    let userGuid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
    let url = moreviewurl + "main.aspx?etn=account&pagetype=entitylist&viewid={" + viewid + "}&viewtype=4230&navbar=off&cmdbar=false";
    console.log(url);
    window.open(url, "_blank");
  }
  createnewviewcrm() {
    const createnewviewcrm = this.envr.authConfig.url;
    //https://quantumt.wipro.com/main.aspx?appid=&pagetype=advancedfind
    let url = createnewviewcrm + "/WebResources/wipro_openadvancefindfromsoe";
    window.open(url, "_blank");
  }


  async ngOnInit() {
    this.getMoreViewData();

    // this.tabList2 = await this.AccountListService.getCustomDropdown(reqBody)
    // console.log('in farming', this.tabList2);
    // if (this.tabList2.length > 0) {
    //   debugger;
    //   var local = this.tabList2[0].GroupData.filter(x => x.title == "More views")[0];
    //   this.selectedTabId = local.id;
    //   console.log('in oninit farming', this.selectedTabId);
    // }
  }

  // performTableChildAction(childActionRecieved): Observable<any> {
  //   var actionRequired = childActionRecieved;

  //   switch (actionRequired.action) {

  //     case 'tabNavigation':
  //       {
  //         console.log('in navi', childActionRecieved);
  //         //Navigation
  //         // this.CustomDropdown(childActionRecieved);

  //         return;
  //       }

  //     case 'pinChange': {
  //       // this.pinChange(childActionRecieved);

  //       // this.LoadMoreColumnFilter(childActionRecieved);
  //       return;
  //     }
  //   }
  // }
  // pinChange(childActionRecieved) {
  //   const reqbody = {
  //     'SysGuid': childActionRecieved.objectRowData.SysGuid ? childActionRecieved.objectRowData.SysGuid : '',
  //     'AccountViewType': childActionRecieved.objectRowData.PinId
  //   };
  //   this.AccountListService.commonPostObject(reqbody, 'PinView').subscribe((res: any) => {
  //     console.log('res' + res.ResponseObject);
  //     this.tabList2[0].GroupData.forEach(element => {
  //       if (childActionRecieved.objectRowData.id === element.id) {
  //         element.isPinned = true;
  //       } else {
  //         element.isPinned = false;
  //       }
  //     });
  //   });
  // }
  getMoreViewData() {
    this.isLoading = true;
    let roleguid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('roleGuid'), 'DecryptionDecrip')
    const reqBody = {
      "roleGuid": "f48b192c-cc22-e911-a94d-000d3aa053b9"
    }
    reqBody.roleGuid = roleguid;
    /** More Views fetching for tile view  */
    const inpParam = { 'SearchText': "account" }
    // this.CustomViews = this.AccountListService.getAllCustomViews(inpParam);
    this.AccountListService.getAllCustomViews(inpParam).subscribe(res => {
      this.isLoading = false;
      this.CustomViews = res.ResponseObject.values;
      this.data = [];
      for (var value of this.CustomViews) {
        this.data.push({
          title: value.ViewName ? value.ViewName : '',
          created_by: value.CreatedBy,
          created_on: value.CreatedOn,
          Userqueryid: value.Userqueryid,
          pinStatus: value.is_pinned,
          shareBtnVisibility: true,
          editBtnVisibility: true,
          deleteBtnVisibility: !value.is_delete,
          pinButtonVisibility: true

        })
      }
      this.totalviews = this.data.length > 0 ? this.data.length : '';
      console.log('costom views from api - >', this.CustomViews);

    });

  }
  performChildAction(childActionRecieved): Observable<any> {
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {

      // case 'pin':
      //   {
      //     console.log('in navi', childActionRecieved);
      //     //Navigation       

      //     return;
      //   }
      case 'title':
        {
          console.log('in navi title ----->', childActionRecieved);
          //Navigation       
          this.redirecttodetail(childActionRecieved.objectRowData);
          return;
        }
      case 'delete':
        {
          console.log('in navi', childActionRecieved);
          //Navigation       
          //this.redirecttodetail(childActionRecieved.objectRowData);
          this.deleteCustomView(childActionRecieved);
          return;
        }
      // case 'share':
      //   {
      //     console.log('in navi', childActionRecieved);
      //     //Navigation       
      //     //this.redirecttodetail(childActionRecieved.objectRowData);
      //     this.createnewviewcrm();
      //     return;
      //   }
      // case 'edit':
      //   {
      //     console.log('in navi', childActionRecieved);
      //     //Navigation       
      //     //this.redirecttodetail(childActionRecieved.objectRowData);
      //     this.createnewviewcrm();
      //     return;
      //   }
    }
  }
  deleteCustomView(data) {
    this.isLoading = true;
    let Userqueryid = [];
    // let listdata =JSON.parse(data);
    data.objectRowData.forEach(element => {
      Userqueryid.push(element.Userqueryid)
    });
    const reqbody = {
      // 'Views':["d8f7d489-c2d3-e911-a839-000d3aa058cb"]
      'Views': Userqueryid
    };
    this.AccountListService.commonPostObject(reqbody, 'MoreviewDelete').subscribe((res: any) => {
      this.isLoading = false;
      let resMessage;
      resMessage = res.Message ? res.Message : '';
      this.snackBar.open(resMessage, '', {
        duration: 5000
      });
      this.getMoreViewData();
      // this.notesAndDetail = res.ResponseObject;
    });
  }
  // CustomDropdown(data) {
  //   this.selectedTabId = data.objectRowData ? data.objectRowData.id : data.id
  //   var title = data.objectRowData ? data.objectRowData.title : data.title
  //   // console.log("----------> custom dropdown data data",data);
  //   if (title == "My active accounts") {
  //     this.router.navigateByUrl('/accounts/accountlist/farming');
  //   }
  //   else if (title == "Alliance accounts") {
  //     this.router.navigateByUrl('/accounts/accountlist/alliance');
  //   }
  //   else if (title == "Reserve accounts") {
  //     this.router.navigateByUrl('/accounts/accountlist/reserve');
  //   }
  //   else if (title == "More views") {
  //     return;
  //   }
  //   else if (this.selectedTabId == -1) {
  //     return;
  //   }
  //   else {
  //     //console.log();
  //     //let viewid = data.objectRowData.title
  //     const moreviewurl = env.authConfig.url;
  //     let url = moreviewurl + "main.aspx?etn=account&pagetype=entitylist&viewid=" + this.selectedTabId + "&viewtype=4230&navbar=off&cmdbar=false#436148839";
  //     console.log(url);
  //     window.open(url, "_blank");
  //   }
  // }

  /************Select Tabs dropdown code starts */

  selectedTabValue: string = "More views";
  appendConversation(e) {

    if (!e.showView) {
      this.selectedTabValue = e.name;
    }

    if (e.router) {
      this.router.navigate([e.router]);
    }

  }

  // tabList: {}[] = [

  //   {

  //     view: 'System views',

  //     groups: [{ name: 'Active', router: 'accounts/accountlist/farming' },
  //     { name: 'Alliance', router: 'accounts/accountlist/alliance' },
  //     { name: 'Reserve', router: 'accounts/accountlist/reserve' },
  //     { name: 'More views', router: 'accounts/accountlist/moreview' },
  //       // { name: 'Inavtive', router: 'opportunity/allopportunity' },
  //       // { name: 'Create new view', router: 'opportunity/allopportunityview',showView:true },
  //       // { name: 'Show all opportunity views', router: 'opportunity/showOpportunity',showAllView:true }
  //     ]
  //   },
  // ]

  /************Select Tabs dropdown code ends */
}


