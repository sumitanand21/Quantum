import { Component, OnInit } from '@angular/core';
import { OpportunitiesService } from '@app/core/services/opportunities.service';
import { DataCommunicationService, OrderService } from '@app/core';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

import { Router } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-email-landing-page',
  templateUrl: './email-landing-page.component.html',
  styleUrls: ['./email-landing-page.component.scss'],
  providers: [DatePipe]

})
export class EmailLandingPageComponent implements OnInit {
  emaillandingTable = []; 
  tableTotalCount: number;
  emailHistoryTable = [{}];
  paginationPageNo = {
    "PageSize": 10,
    "RequestedPageNumber": 1,
    "OdatanextLink": ""
  }
  userId:any;
  constructor(public emailLanding: OpportunitiesService,private datePipe: DatePipe,public service : DataCommunicationService, public router: Router, public orderService : OrderService,
    private EncrDecr: EncrDecrService, ) { }

  OrderNumber:any;
  orderId:any;
  orderBookingId:any;
  ngOnInit() {
    this.userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
    this.orderId = this.emailLanding.getSession("orderId") ? this.emailLanding.getSession("orderId") : '';
     
    this.getSalesOrderDetails();
   
   // this. getEmailHistory();
  }
 
  async getSalesOrderDetails() {

    console.log("orderId", this.orderId)
    let bookingIdPayload = {
      Guid: this.orderId
    };
    console.log("bookingIdPayload", bookingIdPayload)
    this.orderService.getSalesOrderDetails(bookingIdPayload).subscribe((orderDetails: any) => {
      console.log("respone", orderDetails)
      this.orderBookingId = orderDetails.ResponseObject.OrderBookingId;
      this.OrderNumber = orderDetails.ResponseObject.OrderNumber;
      if (!orderDetails.IsError) {
        this.getEmailHistory();
        //this.getOrderhierarchyTree();
      }
      console.log(" this.orderBookingId", this.orderBookingId)
    }, err => console.log(err));

  }


  getEmailHistory() {
    debugger;

    let jsonObj = {
      "orderId": [this.orderBookingId],

      "UserId" : this.userId,
   
    }
    debugger;
    
   console.log("getEmail",jsonObj);
   
    this.orderService.getEmailHistory(jsonObj).subscribe(res => {
      console.log("getEmailHistory",res,jsonObj);
   if(!res.IsError) {
     
        this.emailHistoryTable = res && res.ResponseObject ? res.ResponseObject.map((item, index) => {
          return Object.assign({
             "index": index + 1,
             "OrderNumber": this.OrderNumber,
             "Subject": unescape(JSON.parse('"' + item.Subject + '"')).replace(/\+/g, ' '),
           //  "Emailstatus":( item.EmailStatus) ? this.datePipe.transform(item.EmailStatus, 'MM/dd/yy' ): item.EmailStatus,
             "Emailstatus": item.EmailStatus,
           // "CreatedOn": this.datePipe.transform(item.ActionDate, 'dd-MMM-yyyy' )+ ' at ' + (item.ActionDate, 'hh:mm a'),
             "CreatedOn": this.datePipe.transform(item.ActionDate, "dd-MMM-yyyy 'at' HH:mm"),
           //  "QualificationDate": this.datePipe.transform(this.dateVal, "yyyy-MM-dd'T'HH:mm:ss.SSSSSSS'Z'"),

             "ActivityId":item.ActivityId
           })
         }) : '';
         // [{}];

        this.tableTotalCount = res && res.ResponseObject ? res && res.ResponseObject.length : 0;
      } 
    },
    err => {
      console.log("getEmailHistory",err);
    })
  }
  // goBack() {
  //   window.history.back();
  // }
goBack(){
  
  this.router.navigate(['/opportunity/opportunityview/order'])

}
  performTableChildAction(childActionRecieved): Observable<any> {
     debugger;
     console.log("enter",childActionRecieved);
    var actionRequired = childActionRecieved;
    let rowData : any = childActionRecieved && childActionRecieved.objectRowData && childActionRecieved.objectRowData.length > 0 ? 
    childActionRecieved.objectRowData.map(item =>{
      return Object.assign({
        "OrderNumber": item.OrderNumber,
        "Subject": item.Subject,
             "CreatedOn":item.ActionDate, //vaishali
             "Emailstatus": item.Emailstatus,
        "ActivityId":item.ActivityId
      })
    }) :'' ;
    //[{}];
    debugger;
    switch (actionRequired.action) {
      // case 'search':{

      // }
  
      case 'desp':{
        console.log(actionRequired)
        if(rowData.length > 0){
        this.emailLanding.setSession('emaildetails',rowData[0]);
        this.router.navigate(['/opportunity/orderactions/emailhistory']);
        }else{
        
        }
        return;
        }
      }
}

}
