import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService, OpportunitiesService } from '@app/core';
import { DataCommunicationService } from '@app/core/services/global.service';
import { IncomingHttpHeaders } from 'http';
import { DatePipe } from '@angular/common';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { NestedTreeControl } from '@angular/cdk/tree';



interface OrderHierarchy {
  OrderId: string;
  OrderNumber?:string;
  Childrens?: OrderHierarchy[];
}




export interface getServiceline {

  ServicelineOrder: string;
  PracticeOrder: string;
  SubpracticeOrder: string,
  SLBDMorder: string,
  TCVorder: string,
  EstTcvorder: string,
  cloudOrder: string,
  EngagedOrder: string,
  duelOrder: string
}
export interface getIP_line {

  IPmodule: string;
  ModuleIP: string;
  ServicelineIP: string,
  PracticeIP: string,
  SLbdmIP: string,
  LicensevalueIP: string,
  AMCvalueIP: string,
  CloudIP: string,
  HolmesbdmIP: string
}

export interface getAllocation{
  ServicelineOrder: string;
  PracticeOrder: string;
  SubpracticeOrder: string,
  SLBDMorder: string,
  TCVorder: string,
  EstTcvorder: string,
  cloudOrder: string,
  EngagedOrder: string,
  duelOrder: string
}
export interface getSolution_line{
  IPmodule: string;
  ModuleIP: string;
  ServicelineIP: string,
  PracticeIP: string,
  SLbdmIP: string,
  LicensevalueIP: string,
  AMCvalueIP: string,
  CloudIP: string,
  HolmesbdmIP: string

}
@Component({
  selector: 'app-order-hierarchy',
  templateUrl: './order-hierarchy.component.html',
  styleUrls: ['./order-hierarchy.component.scss']
})
export class OrderHierarchyComponent implements OnInit {

  treeControl = new NestedTreeControl<OrderHierarchy>(node => node.Childrens);
  dataSource = new MatTreeNestedDataSource<OrderHierarchy>();

  TREE_DATA: OrderHierarchy[] = [];
  panelOpenState: boolean;
  panelOpenState1: boolean;
  panelOpenState2: boolean;
  panelOpenState3: boolean;
  panelOpenState4: boolean;
  panelOpenState5: boolean;
  panelOpenState6: boolean;
  panelOpenState7: boolean;

  orders = [];
  CurrencySymbol ;
  ordersHierarchy = [];
  table_data = [];
  second_table = [];
  OrderOwnerRole : boolean = true;
  orderID;
  service_line = [];
  IP_line = [];
  allocation_line =  [];
  solution_line = [];
  alliance_projection = [];
  treeData = [];
  roleBase = [];
  orderId: any;
  userId: any;
  basevalue: any;
  valueTotal : any;

  //Totalvalue: any;
  // sumUpToTwoDigits: any;
  // sum: any;
  order: [];
  orderBookingId: any;
  bookingHierachy: any = {};
  constructor(public router: Router, private EncrDecr: EncrDecrService, public service: DataCommunicationService, private datePipe: DatePipe, public OrderserviceLine: OrderService, public projectService: OpportunitiesService) {
  
  
    this.table_data = [
      {
        orderhead: 'Order number',
        orderdata: ''
      },
      {
        orderhead: 'Authorization',
        orderdata: ''
      },
      {
        orderhead: 'Parent order',
        orderdata: ''
      },
      {
        orderhead: 'Opportunity',
        orderdata: ''
      },
      {
        orderhead: 'Signed / Expected signed date',
        orderdata: ''
      },
      {
        orderhead: 'Approval stage',
        orderdata: ''
      },
      {
        orderhead: 'Type',
        orderdata: ''
      },
      {
        orderhead: 'Currency',
        orderdata: ''
      },
      {
        orderhead: 'Pricing',
        orderdata: ''
      },
      {
        orderhead: 'Signed',
        orderdata: ''
      },
      {
        orderhead: 'SAP customer code',
        orderdata: ''
      },
      {
        orderhead: 'Original order value',
        orderdata: ''
      }
    ]
    this.second_table = [
      {
       
          year: '', 
          value: '' }
       
      
    ]

  }
  hasChild = (_: number, node: OrderHierarchy) => !!node.Childrens && node.Childrens.length > 0;
  ngOnInit() {
    this.orderId = this.projectService.getSession("orderId") ? this.projectService.getSession("orderId") : '';
    if (this.orderId) {
      this.getOrderhierarchyTree();
     // this.getAllocation(order);
    } else {

    }
    this.getSalesOrderDetails();
    this.Rolebasedhierarchy();
    //this.showOrderdetails(node);
 
  }


  getSalesOrderDetails() {
    const payload = {

      Id: this.projectService.getSession('opportunityId')
    };
    this.OrderserviceLine.checkOrderBookingId(payload).subscribe((bookingId: any) => {
      this.orderId = bookingId.ResponseObject[0].SalesOrderId;
      if (!bookingId.IsError) {

        const bookingIdPayload = {
          Guid: bookingId.ResponseObject[0].SalesOrderId
        };        
        this.OrderserviceLine.getSalesOrderDetails(bookingIdPayload).subscribe((orderDetails: any) => {
          console.log("respone", orderDetails)
          this.orderBookingId = orderDetails.ResponseObject.OrderBookingId;        
          this.CurrencySymbol = (orderDetails.ResponseObject.Currency.Type )? (this.getSymbol(orderDetails.ResponseObject.Currency.Type)) : '';
          if (!orderDetails.IsError) {
          
           // this.getAllocation();
          }
          console.log(" this.orderBookingId", this.orderBookingId)
        }, err => console.log(err));
      }
      
    }, err => console.log(err));
    
  }
  getSymbol(data) {
    return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
  }
  getAllocation(order) {
    let body = {
     // "OrderId": this.orderBookingId
      "OrderId": order.OrderId

      
    }

    console.log("getallocation", this.orderBookingId);
    this.OrderserviceLine.getAllocation(body).subscribe(res => {
      this.orders = res.ResponseObject;
      this.allocation_line = res.ResponseObject.CreaditAllocations.AllocationsDatas ;

      this.solution_line = res.ResponseObject.Solutions.order_Solution ? res.ResponseObject.Solutions.order_Solution : '-';
      console.log(" this.orders", this.orders, this.orderBookingId)
      console.log(" this.orders", this.orders, this.orderBookingId)
    
        this.IP_line = res.ResponseObject.OrderIPDetails.orderIPDetail;
        console.log(" this.orders", this.orders, this.orderBookingId)
      // console.log("audit data",JSON.stringify(res))
      console.log("this.allocationpayloadd", body)
      this.service_line = res.ResponseObject.ServiceLineDetails.orderServicelineDetails;

      console.log(res);
      //console.log("serviceline details",this.orders.ServiceLineDetails.orderServicelineDetails[0]);
    }

    )

  }
  
 
  
  getBookHierarchy(order) {
  
    let body = {
      "Guid": order.OrderId
    }
    console.log("body of sales", body, this.orderBookingId)
    this.OrderserviceLine.getBookHierarchy(body).subscribe(res => {
      this.ordersHierarchy = res.ResponseObject;
      this.table_data[0].orderdata = res.ResponseObject.OrderNumber ? res.ResponseObject.OrderNumber : '-';
      this.table_data[1].orderdata = res.ResponseObject.AuthorizationDisplay ? res.ResponseObject.AuthorizationDisplay : '-';
      this.table_data[2].orderdata = res.ResponseObject.ParentOrderNumber ? res.ResponseObject.ParentOrderNumber : '-';
      this.table_data[3].orderdata = res.ResponseObject.name ? res.ResponseObject.name : '-';
      let SignedDate;
      let IsSigned;
      if (res.ResponseObject.Authorization !== null && res.ResponseObject.Authorization == true) {
        if (res.ResponseObject.SOWSigned == true) {
          SignedDate = res.ResponseObject.SOWSignedDate;
          IsSigned = res.ResponseObject.SOWSignedDisplay;
        }
        else {
          SignedDate = res.ResponseObject.ExpectedSOWDate;
          IsSigned = res.ResponseObject.SOWSignedDisplay;
        }
      }
      else {
        if (res.ResponseObject.PurchaseOrderSigned == true) {
          SignedDate = res.ResponseObject.PurchaseOrderSignedDate;
          IsSigned = res.ResponseObject.PurchaseOrderSignedDisplay;
        }
        else {
          SignedDate = res.ResponseObject.PurhchaseOrderExpectedSignedDate;
          IsSigned = res.ResponseObject.PurchaseOrderSignedDisplay;
        }
      }
      this.table_data[4].orderdata = SignedDate ? this.datePipe.transform(SignedDate, "dd MMM yyyy") : '-';

      this.table_data[5].orderdata = res.ResponseObject.ApprovalStage ? res.ResponseObject.ApprovalStage : '-';
      this.table_data[6].orderdata = res.ResponseObject.OrderType ? res.ResponseObject.OrderType : '-';
      this.table_data[7].orderdata = res.ResponseObject.Currency ? res.ResponseObject.Currency.Name ? res.ResponseObject.Currency.Name : '-' : '-';
      this.table_data[8].orderdata = res.ResponseObject.PricingType ? res.ResponseObject.PricingType : '-';
      this.table_data[9].orderdata = IsSigned ? IsSigned : '-';
      this.table_data[10].orderdata = res.ResponseObject.SapCode ? res.ResponseObject.SapCode.Name ? res.ResponseObject.SapCode.Name : '-' : '-';
      this.table_data[11].orderdata = res.ResponseObject.OrderTCV ? res.ResponseObject.OrderTCV : '-';
      console.log(" this.bookingHierachy", this.table_data);

      console.log(" this.ordersHierarchy", this.ordersHierarchy);

      console.log(res);
      this.getAllocation({OrderId:order.OrderId})
    }

    )
  }

  Rolebasedhierarchy(){
    let body = {
      "UserId" : this.userId,
      "OrderId" : this.orderId
    }
    this.userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
    this.OrderserviceLine.Rolebasedhierarchy(this.orderId, this.userId).subscribe(res => {
      
   
      if(res.ResponseObject.OrderOwnerRole){
        const body = {
          OrderId:this.orderId
        }
        this.getAllocation(body);

        this.getBookHierarchy(body);
      }

      else {
        
      }


    }
     ) 
  }
  getTcvPlannedSum(arr){
    return arr.reduce((acc,crv)=>{
      if(crv.Childrens.length>0){
       acc = acc+this.getTcvPlannedSum(crv.Childrens) 
      } return acc+crv.TCVPlanned
  
    },0)
  }
    getOrderhierarchyTree(){

    let body = {
      "SalesOrderId": this.orderId

    }
   
    console.log("hier of sales", body, this.orderId);

     this.OrderserviceLine.getOrderhierarchyTree(body).subscribe(res => {
       this.treeData = res.ResponseObject;
       this.orderId = res.ResponseObject[0].OrderId;
      this.basevalue = res.ResponseObject[0].TCVPlanned ;
       let Totalvalues = res.ResponseObject;
       let sum = this.getTcvPlannedSum(Totalvalues);

       let sumUpToTwoDigits = Number(sum).toFixed(2);
       this.valueTotal = sumUpToTwoDigits;

      console.log('show some',sumUpToTwoDigits)

     console.log(" this.ordershier", res.ResponseObject, body);
      this.TREE_DATA = [...res.ResponseObject];
      this.dataSource.data = this.TREE_DATA;

    }
     )
  }
 
  // goBack() {
  //   window.history.back();
  // }
  goBack(){
  
    this.router.navigate(['/opportunity/opportunityview/order'])
  
  }

  expand(num: any) { }

}
