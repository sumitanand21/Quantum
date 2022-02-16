import { Component, OnInit } from '@angular/core';
import { DataCommunicationService } from '@app/core';
import { Router } from '@angular/router';
import { AccountService } from '@app/core/services/account.service';
import { MasterApiService } from "@app/core";
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { AccountListService } from '@app/core/services/accountList.service';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import * as pbi from 'powerbi-client';
import * as models from 'powerbi-models';

@Component({
  selector: 'app-dashboard-details',
  templateUrl: './dashboard-details.component.html',
  styleUrls: ['./dashboard-details.component.scss']
})
export class DashboardDetailsComponent implements OnInit {
  accountname: any
  isLoading: boolean = false;
  postObj: any;
  ultParentAccObj: any;
  arrayForpush = [];
  dummyarray = [];
  TotalRecordCount: any;
  data1: any = {
    json: [],
    config: {
      nodeHeight: 125,
      nodeWidth: 400,
    },
    width: 410,
    height: 110,
  };

  constructor(public router: Router, public accountListService: AccountListService, private EncrDecr: EncrDecrService, public userdat: DataCommunicationService, public service: AccountService, private masterApi: MasterApiService, private adalSvc: MsAdalAngular6Service, ) { }

  ngOnInit() {
    // this.accountname = localStorage.getItem('accountName');
    this.accountname = this.getSymbol(this.accountname = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountName'), 'DecryptionDecrip'));
    let accGuid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip'); //localStorage.getItem('accountSysId');
    this.postObj = {
      "Guid": accGuid
    }
    /** Account Hirerachy implmentaation starts */
    this.getAccountHirerachy();
    this.getPowerBI();
  }
  getSymbol(data) {
    // console.log(data)
    return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
  }

  getAccountHirerachy() {
    this.isLoading = true;
    this.accountListService.getAccountHirerachy(this.postObj).subscribe((result: any) => {
      // console.log("getAccountHirerachy --- >", result);
      this.isLoading = false;   
      this.arrayForpush = result.ResponseObject;
      if (result.TotalRecordCount === -1) {
        this.TotalRecordCount = 1;
      } else {
        this.TotalRecordCount = result.TotalRecordCount + 1;
      }
      //  this.TotalRecordCount = result.TotalRecordCount ? result.TotalRecordCount : "";
      if (result.ResponseObject.length == 1) {
        console.log('only one record --- length == 0');

        if (result.ResponseObject[0].ParentAccount && result.ResponseObject[0].ParentAccount.SysGuid) {
          let dummyobj = {
            "guid": result.ResponseObject[0].SysGuid,
            "displayName": result.ResponseObject[0].Name,
            "number": result.ResponseObject[0].Number,
            "hirerchy": result.ResponseObject[0].Name,
            "owner1": result.ResponseObject[0].Owner.FullName,
            "owner2": result.ResponseObject[0].Owner.FullName,
            "sbu": result.ResponseObject[0].SBU.Name,
            "type": result.ResponseObject[0].AccountCategory.Value,
            "vertical": result.ResponseObject[0].Vertical.Name,
            "geo": result.ResponseObject[0].Address.Geo.Name,
            "parentId": (result.ResponseObject[0].ParentAccount.SysGuid) ? result.ResponseObject[0].ParentAccount.SysGuid : '',
            "children": [
              // "1",
              // "2",
              // "3"
            ],
            "tooltip": result.ResponseObject[0].Name
          }
          if(result.ResponseObject[0].UltimateParentAccount && result.ResponseObject[0].UltimateParentAccount.SysGuid){
          let ultimateparobject = {
            "guid": result.ResponseObject[0].UltimateParentAccount.SysGuid,
            "displayName": result.ResponseObject[0].UltimateParentAccount.Name + "(Ultimate Parent)",
            "number": result.ResponseObject[0].UltimateParentAccount.Number,
            "hirerchy": result.ResponseObject[0].UltimateParentAccount.Name,
            "owner1": result.ResponseObject[0].UltimateParentAccount.Owner.FullName,
            "owner2": result.ResponseObject[0].UltimateParentAccount.Owner.FullName,
            "sbu": result.ResponseObject[0].UltimateParentAccount.SBU.Name,
            "type": result.ResponseObject[0].UltimateParentAccount.AccountCategory.Value,
            "vertical": result.ResponseObject[0].UltimateParentAccount.Vertical.Name,
            "geo": result.ResponseObject[0].UltimateParentAccount.Address.Geo.Name,
            "children": [
              // "1",
              // "2",
              // "3"
            ],
            "tooltip": result.ResponseObject[0].UltimateParentAccount.Name
          }
          ultimateparobject.children.push(result.ResponseObject[0].SysGuid);
          this.data1.json.push(ultimateparobject);
        }
        else{
          let ultimateparobject = {
            "guid": result.ResponseObject[0].ParentAccount.SysGuid,
            "displayName": result.ResponseObject[0].ParentAccount.Name + "(Ultimate Parent)",
            "number": result.ResponseObject[0].ParentAccount.Number,
            "hirerchy": result.ResponseObject[0].ParentAccount.Name,
            "owner1": result.ResponseObject[0].ParentAccount.Owner.FullName,
            "owner2": result.ResponseObject[0].ParentAccount.Owner.FullName,
            "sbu": result.ResponseObject[0].ParentAccount.SBU.Name,
            "type": result.ResponseObject[0].ParentAccount.AccountCategory.Value,
            "vertical": result.ResponseObject[0].ParentAccount.Vertical.Name,
            "geo": result.ResponseObject[0].ParentAccount.Address.Geo.Name,
            "children": [
              // "1",
              // "2",
              // "3"
            ],
            "tooltip": result.ResponseObject[0].ParentAccount.Name
          }
          ultimateparobject.children.push(result.ResponseObject[0].SysGuid);
          this.data1.json.push(ultimateparobject);

        }
          this.data1.json.push(dummyobj);
        }
        else {
          let dummyobj = {
            "guid": result.ResponseObject[0].SysGuid,
            "displayName": result.ResponseObject[0].Name,
            "number": result.ResponseObject[0].Number,
            "hirerchy": result.ResponseObject[0].Name,
            "owner1": result.ResponseObject[0].Owner.FullName,
            "owner2": result.ResponseObject[0].Owner.FullName,
            "sbu": result.ResponseObject[0].SBU.Name,
            "type": result.ResponseObject[0].AccountCategory.Value,
            "vertical": result.ResponseObject[0].Vertical.Name,
            "geo": result.ResponseObject[0].Address.Geo.Name,
            "children": [
              // "1",
              // "2",
              // "3"
            ],
            "tooltip": result.ResponseObject[0].Name
          }
          this.data1.json.push(dummyobj);
        }



      }
      else if (result.ResponseObject.length > 1) {
        let i = 0;
        for (var value of result.ResponseObject) {
          console.log("value from service .....", value.Name);
          if (i == 0) {
            /*As discussed with API team, Considering the first element's parent is Ultimate Parent, 
            so creating an object for it saperatly.*/
            let ultimateparobject:any;
            if(value.UltimateParentAccount &&  value.UltimateParentAccount.SysGuid){
             ultimateparobject = {
              
              "guid": value.UltimateParentAccount.SysGuid,
              "displayName": value.UltimateParentAccount.Name + "(Ultimate Parent)",
              "number": value.UltimateParentAccount.Number,
              "hirerchy": value.UltimateParentAccount.Name,
              "owner1": value.UltimateParentAccount.Owner.FullName,
              "owner2": value.UltimateParentAccount.Owner.FullName,
              "sbu": value.UltimateParentAccount.SBU.Name,
              "type": value.UltimateParentAccount.AccountCategory.Value,
              "vertical": value.UltimateParentAccount.Vertical.Name,
              "geo": value.UltimateParentAccount.Address.Geo.Name,
              "children": [
                // "1",
                // "2",
                // "3"
              ],
              "tooltip": value.UltimateParentAccount.Name
            }
            for (var childvalue of result.ResponseObject) {
              // debugger
              // console.log('inside child for ')
              if (childvalue.ParentAccount.SysGuid == value.UltimateParentAccount.SysGuid) {
                ultimateparobject.children.push(childvalue.SysGuid);
                // console.log('inside child for if fi ')
              }
            }
            // console.log("ultimate parent from if" +JSON.stringify(ultimateparobject ))    
            } 
          else{
             ultimateparobject = {
              
              "guid": value.ParentAccount.SysGuid,
              "displayName": value.ParentAccount.Name + "(Ultimate Parent)",
              "number": value.ParentAccount.Number,
              "hirerchy": value.ParentAccount.Name,
              "owner1": value.ParentAccount.Owner.FullName,
              "owner2": value.ParentAccount.Owner.FullName,
              "sbu": value.ParentAccount.SBU.Name,
              "type": value.ParentAccount.AccountCategory.Value,
              "vertical": value.ParentAccount.Vertical.Name,
              "geo": value.ParentAccount.Address.Geo.Name,
              "children": [
                // "1",
                // "2",
                // "3"
              ],
              "tooltip": value.ParentAccount.Name
            }
            for (var childvalue of result.ResponseObject) {
              if (childvalue.ParentAccount.SysGuid == value.ParentAccount.SysGuid) {
                ultimateparobject.children.push(childvalue.SysGuid);
              }
            }
          }
           
            // Normal accounts list - second one element of the array
            let dummyobj = {
              "guid": value.SysGuid,
              "displayName": value.Name,
              "number": value.Number,
              "hirerchy": value.Name,
              "owner1": value.Owner.FullName,
              "owner2": value.Owner.FullName,
              "sbu": value.SBU.Name,
              "type": value.AccountCategory.Value,
              "vertical": value.Vertical.Name,
              "geo": value.Address.Geo.Name,
              "parentId": (value.ParentAccount.SysGuid) ? value.ParentAccount.SysGuid : '',
              "children": [
                // "1",
                // "2",
                // "3"
              ],
              "tooltip": value.Name
            }
            for (var childvalue of result.ResponseObject) {
              if (childvalue.ParentAccount.SysGuid == value.SysGuid) {
                dummyobj.children.push(childvalue.SysGuid);
              }
            }
            this.data1.json.push(ultimateparobject);
            // console.log("ultimate parent obj" +JSON.stringify(ultimateparobject ));
            this.data1.json.push(dummyobj);
            // console.log("ultimate parent obj" +JSON.stringify(ultimateparobject ));
          }
           else {
            let dummyobj = {
              "guid": value.SysGuid,
              "displayName": value.Name,
              "number": value.Number,
              "hirerchy": value.Name,
              "owner1": value.Owner.FullName,
              "owner2": value.Owner.FullName,
              "sbu": value.SBU.Name,
              "type": value.AccountCategory.Value,
              "vertical": value.Vertical.Name,
              "geo": value.Address.Geo.Name,
              "parentId": (value.ParentAccount.SysGuid) ? value.ParentAccount.SysGuid : '',
              "children": [
                // "1",
                // "2",
                // "3"
              ],
              "tooltip": value.Name
            }
            for (var childvalue of result.ResponseObject) {
              if (childvalue.ParentAccount.SysGuid == value.SysGuid) {
                dummyobj.children.push(childvalue.SysGuid);
              }
            }
            this.data1.json.push(dummyobj);
          }
          i++;
        }
      }
      //this.data1.json.push(dummyobjtest);
      console.log("final data array --- >", this.data1.json);
    }, error => {
      this.isLoading = false;
    });
  }
  report;
  showInsights = false;
  loadingPowerBi = true;

  getPowerBI() {
    this.accountListService.getPowerBIUrls().subscribe(
      (res: any) => {
        //this.Res = res.ResponseObject;
        console.log("powerbi response---->", res);
        for (let i = 0; i < res.ResponseObject.length; i++)
          this.getPowerBiReports(res.ResponseObject[i]);
      }
    )
  }

  getPowerBiReports(Res) {
    this.adalSvc.acquireToken('https://analysis.windows.net/powerbi/api').subscribe((resToken: string) => {
      if (resToken) {
        this.loadingPowerBi = false;
        this.showInsights = true;
        console.log("resToken");
        console.log(resToken);
        let data = {
          "reportId": Res.ReportID,
          "groupId": Res.GroupID
        }
        var url = "https://app.powerbi.com/reportEmbed?reportId=" + data.reportId + "&groupId=" + data.groupId;

        // var url = Res.Url;
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
          let RevenueSummaryreportContainer;
          if (Res.RowId === 1) {
            RevenueSummaryreportContainer = document.getElementById('PipelineRevenueSummaryreportContainer');
          }
          else if (Res.RowId === 2) {
            RevenueSummaryreportContainer = document.getElementById('OperatingRevenueSummaryreportContainer');
          }
          else if (Res.RowId === 3) {
            RevenueSummaryreportContainer = document.getElementById('OrderRevenueSummaryreportContainer');
          }
          else if (Res.RowId === 4) {
            RevenueSummaryreportContainer = document.getElementById('RevenueRevenueSummaryreportContainer');
          }
          else if (Res.RowId === 5) {
            RevenueSummaryreportContainer = document.getElementById('WinlossRevenueSummaryreportContainer');
          }
          else if (Res.RowId === 6) {
            RevenueSummaryreportContainer = document.getElementById('FunnelRevenueSummaryreportContainer');
          }
          let powerbi = new pbi.service.Service(pbi.factories.hpmFactory, pbi.factories.wpmpFactory, pbi.factories.routerFactory);
          this.report = powerbi.embed(RevenueSummaryreportContainer, RevenueSummaryconfig);
          console.log(this.report)
        }, 500)

      }

    });
  }
}
