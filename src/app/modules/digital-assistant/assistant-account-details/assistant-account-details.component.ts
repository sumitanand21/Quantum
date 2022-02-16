import { Component, OnInit } from '@angular/core';
import { DigitalApiService } from '../services/digital-api.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';

@Component({
  selector: 'app-assistant-account-details',
  templateUrl: './assistant-account-details.component.html',
  styleUrls: ['./assistant-account-details.component.scss']
})
export class AssistantAccountDetailsComponent implements OnInit {

  invoiceDetails = [];
  ordersList = [];
  opportunitiesList = [];
  meetings = [];
  accountId: string = ''
  isShowDA: boolean = false;

  constructor(private encrDecrService: EncrDecrService, private DigitalApiService: DigitalApiService) {
    this.accountId = this.encrDecrService.get(
      "EncryptionEncryptionEncryptionEn",
      sessionStorage.getItem("accountSysId"),
      "DecryptionDecrip"
    );
  }

  ngOnInit() {

    let roleType: any = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('roleType'), 'DecryptionDecrip')
    let IsHelpDesk = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('IsHelpDesk'), 'DecryptionDecrip')
    console.log(roleType, IsHelpDesk)
    debugger
    if (roleType == 2 || IsHelpDesk == "true") {
     
      this.isShowDA = true;
      this.fetchInvoiceDetails(this.accountId);
      this.orders(this.accountId)
      this.opportunities(this.accountId);
      this.meetingList(this.accountId);
    }
    else {
      this.isShowDA = false;
    }
  }

  fetchInvoiceDetails(accountGuid: string): void {
    let body = {
      "AccountGuid": accountGuid,
      "appID": "SAP_INVOICE_DETAILS"
    };
    this.DigitalApiService.commonApi(body).subscribe(res => {
      console.log(res);
      if (!res.IsError) {
        if (res.ResponseObject.IT_OUT !== undefined) {
          res.ResponseObject.IT_OUT.forEach(data => {
            this.invoiceDetails.push({
              invoiceNumber: data.VBELN ? data.VBELN : 'NA',
              amount: data.NETWR ? data.NETWR.trim() : 'NA',
              invoiceDate: data.FKDAT ? data.FKDAT.slice(6, 8) + "-" + this.monthConversation(data.FKDAT.slice(4, 6)) + "-" + data.ERDAT.slice(0, 4) : 'NA'
            })
          });
        }
      } else {
      }
    },
      error => {
        console.log(error)
      });
  }

  monthConversation(data): any {
    var m = ["Jan", "Feb", "Mar", "Apr", "May", "June",
      "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return m[Number(data) - 1]
  }

  orders(accountGuid) {
    let body =
    {
      "AccountGuid": "BEA82CB2-F069-E611-80D6-000D3A803BD6"
    }
    // let body =
    // {
    //   "AccountGuid": accountGuid
    // }
    this.DigitalApiService.GetLastFiveOrderLinkedToAccount(body).subscribe(res => {
      if (!res.IsError) {
        res.ResponseObject.map(val => {
          this.ordersList.push({
            OrderNumber: val['OrderNumber'],
            OrderType: val['OrderType'],
            SapCode: val['SapCode'],
            StartDate: val['StartDate'],
            EndDate: val['EndDate']
          })
        })
      }
    })
  }
  opportunities(accountGuid) {
    // let body = { "AccountGuid": accountGuid }
    let body = { "AccountGuid": "B52CC687-AEA5-E611-80DB-000D3A803BD6" }
    this.DigitalApiService.GetLastFiveOpportunitiesLinkedToAccount(body).subscribe(res => {
      if (!res.IsError) {
        res.ResponseObject.map(val => {
          this.opportunitiesList.push({
            OpportunityName: val['OpportunityName'],
            CreatedOn: val['CreatedOn'],
            OpportunityValue: val['OpportunityValue']
          })
        })
      }
    })
  }

  meetingList(accountGuid) {
    // let body = {
    //   "AccountGuid": "D62FE6AB-5350-E911-A830-000D3AA058CB"
    // }
    let body = {
      "AccountGuid": accountGuid
    }
    this.DigitalApiService.GetLastFiveActivityLinkedToAccount(body).subscribe(res => {
      if (!res.IsError) {
        res.ResponseObject.map(val => {
          this.meetings.push({
            MeetingName: val['MeetingName'],
            MeetingDate: val['MeetingDate'],
            MeetingTime: this.datetimeFilter(val['MeetingDate'])
          })
        })
      }
    })
  }

  datetimeFilter(data) {
    var time = data.slice(11, 16)
    var amorpm = time[0] + "" + time[1];
    let finalTime
    if (Number(amorpm) > 12) {
      let difference = Number(amorpm) - 12
      finalTime = `${difference}:${time.slice(3, 5)}`
    } else {
      finalTime = time.slice(0, 5)
    }
    var period = Number(amorpm) >= 12 ? 'PM' : 'AM';
    return finalTime + " " + period
  }

}
