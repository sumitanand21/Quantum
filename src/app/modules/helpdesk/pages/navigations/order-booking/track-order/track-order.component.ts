import { Component, OnInit } from '@angular/core';
import { DataCommunicationService } from '@app/core';
import { OpportunitiesService, OrderService } from '@app/core';

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrls: ['./track-order.component.scss']
})
export class TrackOrderComponent implements OnInit {
  /*OpportunityId: string = this.projectService.getSession("opportunityId"); // for others
  OrderId = this.projectService.getSession("orderId") ? this.projectService.getSession("orderId") : '';*/
  ViewDetailsContent: Boolean = false;
  ManualContent: Boolean = true;
  textBoxDisabled: boolean = true;
  tableCount = 30;
  OrderNumber = '';
  OpportunityId = '';

  helpdeskTrack: any = [{}];
  
  userArray = [
    { "index": 1, "Previousvalue": "AC123124323", "Changedvalue": "OC123124234", "Changedon": "23-dec-2019" },
    { "index": 2, "Previousvalue": "AC123124323", "Changedvalue": "OC123124234", "Changedon": "23-dec-2019" },
  ];
  headernonsticky1 = [{ name: "Previousvalue", title: "Previous value" },
  { name: "Changedvalue", title: "Changed value" },
  { name: "Changedon", title: "Changed on" },
  ];

  toggle(val) {

    this.OrderNumber = '';
    this.OpportunityId = '';
    this.helpdeskTrack = [{}];
    this.textBoxDisabled = val;
  }

  getSearchDisable() {
    if (this.OrderNumber == '' && this.OpportunityId == '') {
      return true;
    } else {
      return false;
    }
  }

  constructor(public service: DataCommunicationService, public orderService: OrderService, public projectService: OpportunitiesService) { }

  ngOnInit() {
  }

  goback() {
    this.service.hidehelpdesknav = true;
    this.service.hidehelpdeskmain = false;
  }
 
  getOrderDetails() {
    if (this.OrderNumber) {
      this.getTrackOrderOnOrderNumber(this.OrderNumber);
    }
    else if (this.OpportunityId) {
      this.getTrackOrderOnOppId(this.OpportunityId);
    } else {
      this.helpdeskTrack = [{}];
      return;
    }
 }

  getTrackOrderOnOrderNumber(OrderNumber) {
    let data = {
      PrimaryOrderNumber: OrderNumber
    }
    this.service.loaderhome = true;
    this.orderService.getTrackOrderDeatils(data).subscribe((data: any) => {
      if(!data.IsError){
      if (data && data.ResponseObject && Object.keys(data.ResponseObject).length > 0) {
        let helpdeskTrackObj = Object.assign({
          "index": 1,
          "Previousvalue": (data.ResponseObject.OldOrderNumber ? data.ResponseObject.OldOrderNumber : ''),
          "Changedvalue": (data.ResponseObject.NewOrderNumber ? data.ResponseObject.NewOrderNumber : ''),
          "Changedon": (data.ResponseObject.ModifiedOn ? data.ResponseObject.ModifiedOn : '')
        })
        this.helpdeskTrack = new Array(Object.assign({}, helpdeskTrackObj));
      } else {
        this.helpdeskTrack = [{}];
        this.projectService.displayMessageerror("No record found.");
      }
    }else {
      this.helpdeskTrack = [{}];
      var message=data.Message;
      this.projectService.displayMessageerror(message);
    }
      this.service.loaderhome = false;
    }, err => {
      this.helpdeskTrack = [{}];
      this.projectService.displayerror(err.status);
    })
  }

  getTrackOrderOnOppId(OpportunityId) {
   
    let data = {
      SearchText: OpportunityId
    }
    this.service.loaderhome = true;
    this.orderService.getTrackOpportunity(data).subscribe((Oppor: any) => {
      console.log("resopp", Oppor)
      if(!Oppor.IsError){
      if (Oppor && Oppor.ResponseObject && Object.keys(Oppor.ResponseObject).length > 0) {
        let helpdeskTrackObj = Object.assign({
          "index": 1,
          "Previousvalue": (Oppor.ResponseObject.Opp_Old_Value) ? Oppor.ResponseObject.Opp_Old_Value : '',
          "Changedvalue": (Oppor.ResponseObject.Opp_New_Value) ? Oppor.ResponseObject.Opp_New_Value : '',
          "Changedon": (Oppor.ResponseObject.Modified_Date) ? Oppor.ResponseObject.Modified_Date : ''
        })
        this.helpdeskTrack = new Array(Object.assign({}, helpdeskTrackObj));
      }
      else{
        this.helpdeskTrack=[{}];
        this.projectService.displayMessageerror("No record found.");
      }
    }
    else{
      var message=Oppor.Message;
      this.projectService.displayMessageerror(message);
    }
    this.service.loaderhome = false;
    },
  err => {
    this.service.loaderhome = false;
    this.projectService.displayerror(err.status);
    })
}

}





