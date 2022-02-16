import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataCommunicationService } from '@app/core/services/global.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { OrderService,OpportunitiesService } from '@app/core';


@Component({
  selector: 'app-order-booking',
  templateUrl: './order-booking.component.html',
  styleUrls: ['./order-booking.component.scss']
})
export class OrderBookingComponent implements OnInit {
  panelOpenState: boolean;

  orders = [];
  orderId:any;
  UserId:any;

 orderBookingId:any;
 orderCRM:any;
  constructor(public router: Router,private EncrDecr: EncrDecrService, public service: DataCommunicationService, public orderBooking: OrderService, public projectService: OpportunitiesService ) { }

  ngOnInit() {
    this.orderId = this.projectService.getSession("orderId") ? this.projectService.getSession("orderId") : '';

    this.UserId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
    this.getSalesOrderDetails();
    this.getOrderbooking();
  }

    
  

      getSalesOrderDetails(){
        console.log("orderId", this.orderId);
        // let auditResponse=
        let bookingIdPayload = {
          Guid: this.orderId
        };
              this.orderBooking.getSalesOrderDetails(bookingIdPayload).subscribe((orderDetails: any) => {
            console.log("respone",orderDetails)
            this.orderBookingId = orderDetails.ResponseObject.OrderBookingId
            this.orderCRM = orderDetails.ResponseObject.CRMReference
            if(!orderDetails.IsError){
              this.getOrderbooking();
            }
            console.log(" this.orderBookingId", this.orderBookingId)
          }, err => console.log(err));
      
        }
      getOrderbooking(){
       
        let body = {
          "UserId" : this.UserId,
          "OrderId":  this.orderBookingId,
          "CRMRefNo": this.orderCRM
      }
        this.orderBooking.getOrderbooking(body).subscribe(res=>{
          this.orders=res.ResponseObject;
          console.log("response checking", this.orders,res)
          console.log("payload checking",body)
console.log(res);
        }

        )

        }
// getOrderbooking(){

// }
  dealResponse;

  goBack(){
  
    this.router.navigate(['/opportunity/opportunityview/order'])
  
  }

  expand(num: any) {  }


}
