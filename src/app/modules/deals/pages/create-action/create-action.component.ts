import { Component, OnInit } from '@angular/core';
import { DataCommunicationService, ErrorMessage } from '@app/core';
import { dealService } from '@app/core/services/deals.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GetSetMethod } from '@app/core/services/deals/deal-setget.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { approveActionComponent } from '../existing-deal-details/tabs/deal-calendar/deal-calendar.component';
import { MatDialog } from '@angular/material';
import { newConversationService } from '@app/core/services/new-conversation.service';
import { environment as env } from '@env/environment';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;

@Component({
  selector: 'app-create-action',
  templateUrl: './create-action.component.html',
  styleUrls: ['./create-action.component.scss']
})
export class CreateActionComponent implements OnInit {
  isLoading: boolean = false;
  wittyURL: string;
  documentDetails: any[];
  rollAccess: boolean;
  actionId: any;
  collebrationURL: any;
  adid: any;
  createrId: any;
  dealOverview: any;
  description: any;
  listOfEmails = [];
  actionName: any;

  constructor(
    public service: DataCommunicationService,
    private deals: dealService,
    public router: Router,
    private _error: ErrorMessage,
    private getSetData: GetSetMethod,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private encrDecrService: EncrDecrService,
    public dialog: MatDialog,
    public newconversationService: newConversationService,
    public envr : EnvService
  ) {
    this.isLoading = true;
    this.adid = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('adid'), 'DecryptionDecrip');
    this.createrId = (this.encrDecrService.get("EncryptionEncryptionEncryptionEn", localStorage.getItem('userID'), "DecryptionDecrip"));
    this.dealOverview = JSON.parse(this.encrDecrService.get("EncryptionEncryptionEncryptionEn", sessionStorage.getItem('Dealoverview'), "DecryptionDecrip"));
  }

  routerTab() {
    console.log("Router Link:")
    if (sessionStorage.getItem('routingTab') == '1') {
      this.router.navigate(['/deals/existingTabs/techSolution']);
      sessionStorage.setItem('routingTab', '0');
    } else {
      this.router.navigate(['/deals/existingTabs/calendar']);
      sessionStorage.setItem('routingTab', '0');
    }
  }

  ngOnInit() {
    this.rollForUser();
    this.actionId = this.getSetData.getData();
    console.log("My Action ID: ", this.actionId)
    if (!this.actionId) {
      this.router.navigate(['deals/existingTabs/calendar']);
    }
  }

  rollForUser() {
    let enpData = JSON.parse(this.encrDecrService.get("EncryptionEncryptionEncryptionEn", sessionStorage.getItem('userInfo'), "DecryptionDecrip"));
    console.log(enpData.EmployeeId)
    let checkAccess: any;
    let input = {
      "AdId": enpData.EmployeeId,
    }
    //this.isLoading = true;
    this.deals.rollForUser(input).subscribe(res => {
      //this.isLoading = false;
      console.log(res);
      if (res.ReturnFlag == 'S') {
        let rollOpportunity;
        let rollDealTeamMember;
        let rollModuleTeamMember;
        let rollDealOwner;
        let rollModuleOwner;
        res.Output.map(item => {
          //console.log("Roll ID: ", item.RoleID, "Check Roll", item.IsRoleMappedToUser);
          if (item.RoleID == 16) {
            rollDealTeamMember = item.IsRoleMappedToUser;
          }
          else if (item.RoleID == 17) {
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
          console.log("Access: ", "true")
          this.rollAccess = true;
          this.emailList();
          this.documentHistory();
          this.actionDetails()
        }
        else {
          this.rollAccess = false;
          console.log("Not Access: ", "False")
        }
      }
    })
  }

  documentHistory() {
    let id = this.actionId;
    let input = { "ID": id, "UserID": this.adid }
    //this.isLoading = true;
    this.deals.documentHistory(input).subscribe(res => {
      //this.isLoading = false;
      console.log(res);
      if (!res.IsError) {
        this.documentDetails = res.ResponseObject;
        console.log(this.documentDetails)
      }
    },
      error => {
        this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
      })
  }

  downloadDocument(url: any) {
    console.log("hello Download", url);
    let fileName: any;
    let downloadUrls = [];
    this.documentDetails.map(item => {
      if (url == item.Url) {
        fileName = item.Name;
      }
    });
    console.log(url.substring(0, url.indexOf("?")));
    var link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    if (link.href.includes("?")) {
      link.href = url.substring(0, url.indexOf("?"));
    }

    if (this.envr.envName === 'MOBILEQA') {
      this.newconversationService.attachmentList.forEach(item => {
        downloadUrls.push({ Url: link.href, Name: item.Name })
      })
      //this.downloadAllInMobile(downloadUrls)
      this.downloadListMobile(link.href, fileName);
      return;
    } else {
      //link.click();
      //window.URL.revokeObjectURL(link.href);
      console.log("Desktop Documents");
      window.open(link.href, "_blank");
    }

    // let input = { "Path": url }

    // this.isLoading = true;
    // this.deals.downloadDocument(input).subscribe(res => {
    //   this.isLoading = false;
    //   let downloadUrls = [];
    //   var binary_string = window.atob(res.ResponseObject.Base64String);
    //   var len = binary_string.length;
    //   var bytes = new Uint8Array(len);
    //   for (var i = 0; i < len; i++) {
    //     bytes[i] = binary_string.charCodeAt(i);
    //   }
    //   let blob = new Blob([bytes.buffer]);
    //   let Filename = res.ResponseObject.FileName;
    //   var link = document.createElement('a');
    //   link.href = window.URL.createObjectURL(blob);
    //   link.download = Filename;
    //   console.log("Blob URL: ", link.href);

    //   if (env.envName === 'MOBILEQA') {
    //     this.newconversationService.attachmentList.forEach(item => {
    //       downloadUrls.push({ Url: link.href, Name: item.Name })
    //     })
    //     //this.downloadAllInMobile(downloadUrls)
    //     this.downloadListMobile(link.href, Filename);
    //     return;
    //   } else {
    //     link.click();
    //     window.URL.revokeObjectURL(link.href);
    //   }
    // })
  }

  downloadListMobile(URL, fileName) {
    console.log("Mobile URL: ", URL, "File Name: ", fileName);
    var newUrl = URL.substr(0, URL.indexOf("?"));
    console.log("Mobile URL: ", newUrl);
    //var uri = encodeURI(newUrl);
    var uri = encodeURI(URL);
    var fileURL = "///storage/emulated/0/Download/" + fileName;
    this._error.throwError(`${fileName} downloaded`);
    console.log("Mobile URL: ", uri, "File Name: ", fileURL);
    var fileTransfer = new FileTransfer();
    fileTransfer.download(
      uri, fileURL, function (entry) {
        console.log("download complete: " + entry.toURL());
        this._error.throwError("File downloaded successfully.")
      },
      function (error) {
        console.log("download error source " + error.source);
        console.log("download error target " + error.target);
        console.log("download error code" + error.code);
        this._error.throwError("File downloaded successfully.")
      },
      null, {
    }
    );
  }

  downloadAllInMobile(fileInfo) {
    fileInfo.forEach(function (value, idx) {
      const response = value;
      setTimeout(() => {
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
          //     "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
          //  } headers: {
          // 
        }
        );
      }, idx * 2500)
    });
  }


  sendForRework() {
    let input = {
      "Id": this.actionId,
      "Guid": this.createrId
    }
    this.isLoading = true;
    this.deals.reWorkAction(input).subscribe(res => {
      this.isLoading = false;
      console.log(res)
      this._error.throwError(res.Message);
      localStorage.setItem('checkAction', '1');
      this.router.navigate(['deals/existingTabs/calendar']);
    }, error => {
      this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
    })
  }

  approvarAction() {
    let input = { "Id": this.actionId, "UserID": this.adid }
    this.isLoading = true;
    this.deals.approvarAction(input).subscribe(res => {
      console.log(res);
      if (!res.IsError) {
        if (res.ResponseObject.IsPresentDealDependetAction) {
          this.openApprove("Action Name", res.Message);
          localStorage.setItem('checkAction', '1');
          this.router.navigate(['deals/existingTabs/calendar']);
          this.isLoading = false;
        }
        else {
          localStorage.setItem('checkAction', '1');
          this.router.navigate(['deals/existingTabs/calendar']);
          this._error.throwError(res.Message);
          this.isLoading = false;
        }
      }
    }, error => {
      this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
      this.isLoading = false;
    })
  }

  openApprove(actionName, actionMessage): void {
    const dialogRef = this.dialog.open(approveActionComponent, {
      width: '400px',
      data: { 'actionName': actionName, 'message': actionMessage }
    });

    dialogRef.afterClosed().subscribe(res => {
      localStorage.setItem('checkAction', '1');
      this.router.navigate(['deals/existingTabs/calendar']);
    })
  }


  logMethod(actionId, actionName) {
    const base64Url = localStorage.getItem('token').split('.')[1];
    const base64 = (base64Url.replace('-', '+')).replace('_', '/');
    const decodedToken = JSON.parse(window.atob(base64));
    let collebrationActionId;

    if (this.listOfEmails) {
      collebrationActionId = {
        "environment": "QA",
        "hostApplication": "L2O",
        "appSecret": "da3068e9-e480-4a0c-aae4-00e0a9d014b9",
        "viewMode": "embeded",
        "parentObjectId": actionId,
        "parentObjectName": actionName + actionId,
        //"authToken":"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Indvelg1dWRlYmFuY01sbXpiUkpOTWFTSkRqOCJ9.eyJhdWQiOiJodHRwczovL3F1YW50dW1kLndpcHJvLmNvbS9hcGkvZGF0YS92OS4wLyIsImlzcyI6Imh0dHA6Ly93aXBmc3VhdC53aXByby5jb20vYWRmcy9zZXJ2aWNlcy90cnVzdCIsImlhdCI6MTU1MDkzNjYyNCwiZXhwIjoxNTUwOTQwMjI0LCJwcmltYXJ5c2lkIjoiUy0xLTUtMjEtNTc5ODk4NDEtNjE2MjQ5Mzc2LTE4MDE2NzQ1MzEtNTkzMDk5IiwidXBuIjoiYW5udmxAd2lwcm8uY29tIiwidW5pcXVlX25hbWUiOiJXSVBST1xcQU5OVkwiLCJhcHB0eXBlIjoiQ29uZmlkZW50aWFsIiwiYXBwaWQiOiJlZjZkOTEzNS1lNGQwLTRlNGItYWNiYi1mZDgxZTVlNDVjZjkiLCJhdXRobWV0aG9kIjoidXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmFjOmNsYXNzZXM6UGFzc3dvcmRQcm90ZWN0ZWRUcmFuc3BvcnQiLCJhdXRoX3RpbWUiOiIyMDE5LTAyLTIzVDE1OjQzOjQ0LjI2NVoiLCJ2ZXIiOiIxLjAifQ.cKvmI3OGxOOr8VMCN3Qgyss6zDucXxUtcipxKMrEm3VH715y0WVlQ1VmVjlfHrnk4Oud1ZTsQHDLVUqsfgjsG9LCgGZFKF2hPdZJ0meHpsXEyCUTRGJtpXMYWOIzJzu-NV8k3wke4TrBZE7CKXgGnlfe6K1VofUp3QReQ_9qOuVqO_JFK6cuEN660nc3hXRwXF1_BxYAI8NTwfjwEPXiPMVJajJENTrTBsroPM0Oelm8d1gVP6d--ebUM74uN1HDHhO2Ubm3RuZ5PWcwNoekq_LvP2lqvdX8iSSd0db3jPWpl0hRIzXfdlVfpe4XPPV6jpW8fDH1zPQqiWPtqR8Ckw",
        "authToken": localStorage.getItem('token'),
        //"memberlist": ["annvl@wipro.com", "mehraj@wittyparrot.com", "taher@wittyparrot.com", "taheryoppy@yopmail.com", "murugesh.aravind@wipro.com", "ir36357t@wipro.com", "irfan.kha@wipro.com"]
        "memberlist": this.listOfEmails
      }
    }
    console.log(btoa(JSON.stringify(collebrationActionId)))
    return this.sanitizer.bypassSecurityTrustResourceUrl('./assets/l2o.html#' + btoa(JSON.stringify(collebrationActionId)));
  }

  defaultAction: boolean = false;
  actionDetails() {
    console.log("Action ID: ", this.actionId)
    let input = { "Id": this.actionId, "UserID": this.adid }
    this.isLoading = true;
    this.deals.detailsAction(input).subscribe(res => {
      if (res.ResponseObject.ProposalId != -1) {
        this.defaultAction = true;
      } else {
        this.defaultAction = false;
      }
      console.log(res)
      this.collebrationURL = this.logMethod(this.actionId, res.ResponseObject.Name);
      console.log("collebrationURL: ", this.collebrationURL)
      console.log(res)
      var depAction = res.ResponseObject.DependentActions;
      let status;
      this.actionName = res.ResponseObject.Name;
      var depActionArray: any = [];
      depAction.map((item) => {
        depActionArray.push(item.Name);
      })
      const dependencies = depActionArray.filter(item => item).join(' ,');
      if (res.ResponseObject.Status == 1) {
        status = 'Open'
      }
      else if (res.ResponseObject.Status == 3) {
        status = 'Closed'
      }
      else {
        // status = 'Pending with Approver'
        status = 'Open'
      }
      this.summary = [
        { label: 'Action type*', content: res.ResponseObject.ActionType.Value == '' ? '-' : res.ResponseObject.ActionType.Value },
        { label: 'Action approver', content: res.ResponseObject.Approver.FullName != '' ? res.ResponseObject.Approver.FullName : res.ResponseObject.Owner.FullName == '' ? '-' : res.ResponseObject.Owner.FullName },
        { label: 'Action creator*', content: res.ResponseObject.CreatedBy.FullName == '' ? '-' : res.ResponseObject.CreatedBy.FullName },
        { label: 'Planned start date*', content: this.datePipe.transform(res.ResponseObject.StartDate, 'dd-MMM-yy') },
        { label: 'Planned end date*', content: this.datePipe.transform(res.ResponseObject.EndDate, 'dd-MMM-yy') },
        { label: 'Actual end date', content: res.ResponseObject.ActualActionClosureDate == '0001-01-01T00:00:00' ? '-' : this.datePipe.transform(res.ResponseObject.ActualActionClosureDate, 'dd-MMM-yy') },
        { label: 'Escalation contact', content: res.ResponseObject.EscalationDetails.FullName == '' ? '-' : res.ResponseObject.EscalationDetails.FullName },
        { label: 'Status', content: status, blueclr: 'color-orange' },
        { label: 'Dependant action', content: dependencies == '' ? '-' : dependencies, blueclr: 'colorAzure' },
        // { label: 'Description', content: res.ResponseObject.Description },
        // { label: 'Approval required', content: 'Yes' },
        // { label: 'Approver*', content: 'Kinshuk Bose' }
      ]
      this.description = res.ResponseObject.Description == '' ? '-' : res.ResponseObject.Description;
      this.getSetData.setData(false);
      this.isLoading = false;
    }, err => {
      this._error.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?");
      this.isLoading = false;
    })
  }

  emailList() {
    let input = {
      "DealId": this.dealOverview.id,
      "TeamType": "DEALOWNERTEAMMODULETEAM"
    }
    //this.isLoading = true;
    this.deals.emailList(input).subscribe(res => {
      //this.isLoading = false;
      console.log(res)
      res.Output.EmployeeList.map(item => {
        this.listOfEmails.push(
          item.EmployeeMail
        )
      })
      console.log(this.listOfEmails);
    })
  }

  summary = [
    // { label: 'Action type*', content: 'Tech solution' },
  ]

  // MORE ACTION STARTS **************
  showContent: any = -1;

  closeContent() {
    this.showContent = -1;
  }

  toggleContent(id: any) {
    this.showContent = id;
  }
  // MORE ACTION ENDS *******************

}
