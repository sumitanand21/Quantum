import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataCommunicationService } from '@app/core/services/global.service';
import { OrderService } from '@app/core/services/order.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { OpportunitiesService } from '@app/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-audit',
  templateUrl: './order-audit.component.html',
  styleUrls: ['./order-audit.component.scss'],
  providers: [DatePipe]
})
export class OrderAuditComponent implements OnInit {
  panelOpenState: boolean;

  orders = [];
  orderId: any;
  orderBookingId: any;
  UserId: any;
  constructor(public router: Router, public service: DataCommunicationService, private EncrDecr: EncrDecrService,
    public orderService: OrderService, private opportunityService: OpportunitiesService, private datePipe: DatePipe) { }

  ngOnInit() {
    debugger;
    this.UserId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
    this.orderId = this.opportunityService.getSession("orderId") ? this.opportunityService.getSession("orderId") : '';
    this.getSalesOrderDetails();

    // this.getAuditHistory();

  }

  dealResponse;

  // goBack() {
  //   window.history.back();
  // }
  goBack() {

    this.router.navigate(['/opportunity/opportunityview/order'])

  }

  expand(num: any) { }

  auditHistory = [];

  getSalesOrderDetails() {

    console.log("orderId", this.orderId)
    // let auditResponse=
    let bookingIdPayload = {
      Guid: this.orderId
    };
    this.orderService.getSalesOrderDetails(bookingIdPayload).subscribe((orderDetails: any) => {
      console.log("respone", orderDetails)
      this.orderBookingId = orderDetails.ResponseObject.OrderBookingId;
      if (!orderDetails.IsError) {
        this.getAuditHistory();
      }
      console.log(" this.orderBookingId", this.orderBookingId)
    }, err => console.log(err));

  }
  getAuditHistory() {
    let obj = {
      "UserId": this.UserId,
      "OrderId": [this.orderBookingId],
      "CRMRefNo": " ",
      // "UserId" : "b7987904-e55c-e911-a830-000d3aa058cb",
      // "OrderId":["7DF73A2F-22B5-E911-A836-000D3AA058CB"],
      // "CRMRefNo": " ",

    }

    this.orderService.getAuditHistory(obj).subscribe(res => {
      debugger;
      console.log("audit data", res)
      console.log("payload  checking", obj)
      if (!res.IsError) {
        this.auditHistory = res && res.ResponseObject ? res.ResponseObject.filter(it => {
          if (it.Name) {
            if (it.Name.toLowerCase() == 'end date' || it.Name.toLowerCase() == 'start date' || it.Name.toLowerCase() == 'purchased order signed date' || it.Name.toLowerCase() == 'sow signed date') {
              it.OldValue = (it.OldValue) ? this.datePipe.transform(it.OldValue, 'MM/dd/y') : it.OldValue;
              it.NewValue = (it.NewValue) ? this.datePipe.transform(it.NewValue, 'MM/dd/y') : it.NewValue;
             } //else if (it.Name.toLowerCase() == 'sow signed') {
            //   it.OldValue = (it.OldValue == 'True') ? 'Yes' : 'No';
            //   it.NewValue = (it.NewValue == 'True') ? 'Yes' : 'No';
            // };
            return Object.assign({}, it);
          }
        }) : [{}];
        this.auditHistory.forEach(data => {
          data = this.datePipe.transform(data.ChangedOn, 'yyyy-MM-dd');


        })
      }
      else {
        this.opportunityService.displayMessageerror(res.Message);
      }
    },
      err => {

      })
  }
}
