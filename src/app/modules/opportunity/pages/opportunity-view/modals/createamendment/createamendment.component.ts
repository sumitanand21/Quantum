import { Component, OnInit, Inject } from '@angular/core';
import { OrderService, OpportunitiesService, DataCommunicationService } from '@app/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatInput } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createamendment',
  templateUrl: './createamendment.component.html',
  styleUrls: ['./createamendment.component.scss']
})
export class CreateamendmentComponent implements OnInit {
  dropdownOpened:boolean = false;
  showlabel = false;
  selectedLabel : any = "";
  textarea = false;
  yesEnable = false;
  typeOfAmendment: string;
  typesOfAmendments: any = [];
  orderOverviewObj: any;
  amendmentId: any = "";
  amendmentRemarks : any = "";
  orderId: string = this.projectServices.getSession('orderId');
  parentOrderId : any;
  oppTypeId: string; 
  opportunityData: any;
  WTFlag:any = false;
  IsWtAmend: boolean = false;
  
  constructor(private orderService: OrderService,public dialogRef : MatDialogRef<CreateamendmentComponent>, public projectServices: OpportunitiesService,
    public service: DataCommunicationService, public router: Router, @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log("wt flag", data)
     }

  ngOnInit() {
    
    this.WTFlag = this.data.WTFlag ? this.data.WTFlag : false;
    console.log("wt check",this.WTFlag)
    console.log("amendId",this.amendmentId);
    this.getAmendmentType();
    // this.getoppOverviewdetails();
    this.checkOpportunityForAmendment();

//wt check optional
if (this.projectServices.getSession('checkwtorder')) {
      this.IsWtAmend = true;
    }

  }
  openedChange(opened: boolean) {
    console.log(opened);
    if(opened == true)
    this.dropdownOpened = true;
    else
    this.dropdownOpened = false;
}
  getAmendmentType() {

    this.orderService.getAmendmentType().subscribe((res: any) => {
      if (!res.IsError && (this.IsWtAmend == false) ) {
        this.typesOfAmendments = res.ResponseObject.filter(itt => itt.Id != '184450006' && itt.Id != '184450005' );
       console.log("amendmenttype11",res);
        console.log("sauravchecknonwt",this.IsWtAmend);
      }
      else if (!res.IsError && (this.IsWtAmend == true)){
        this.typesOfAmendments = res.ResponseObject.filter(itt => itt.Id != '184450005' );
        console.log("sauravcheckwt",this.IsWtAmend);

       //its for negative amend only
        // If BFM or order owner then only show negative amendment option else hide it
        if(this.projectServices.getSession('OrderOwnerBFM') != true)
        {
          this.typesOfAmendments = res.ResponseObject.filter(itt => itt.Id != '184450006' && itt.Id != '184450005' );
        }
      }
     
    }, err => {
      this.typesOfAmendments = [];
    });
  }


//amendment dropdown yes 
  amendmentType(selectedId) {
        console.log("amendId1",this.amendmentId);
  this.textarea = false;
  this.showlabel = false;
  this.selectedLabel = "";
    let selectedAmendment = this.typesOfAmendments.filter(it=> it.Id == selectedId);
    this.typeOfAmendment = (selectedAmendment.length > 0)? selectedAmendment[0].Name :"";
    this.yesEnable = true;
   if (selectedId == 184450006) {
      this.textarea = true;
    } else if (selectedId == 184450001 || selectedId == 184450000) {
      this.showlabel = true;
      this.selectedLabel = true;
    }
  }

  checkRemarks(remarks){
      this.amendmentRemarks = remarks ? remarks.trim() : "";
  }

  createAmendment(flag) {
    if (this.amendmentId) {
      if ((this.amendmentId == 184450001) || (this.amendmentId == 184450000)) {
        // for incremental and renewal
        if (this.selectedLabel) {
          // this.orderService.getOpportunityType().subscribe(res => {  
          this.createOrderAmendmentFlag(flag);
          // });
        } else {
          this.dialogRef.close();
          this.projectServices.setSession('path',this.router.url);        
          if (this.amendmentId == 184450001 )
          {
            this.router.navigate(['/opportunity/createopp/incremental']);
          }
          else if (this.amendmentId == 184450000 )
          {
            this.router.navigate(['/opportunity/createopp/renewal']);
          }
          
        }
      }

      else if ((this.amendmentId == 184450002) || (this.amendmentId == 184450004)) {
        // this.orderService.getOpportunityType().subscribe(res =>{
        this.createOrderAmendmentFlag(flag);
        // })
      }else if(this.amendmentId == 184450006){
        this.createOrderAmendmentFlag(flag);
      }
    } else {
      this.projectServices.displayMessageerror('Please select amendment type')
    }

  }


//parent opp id 



  createOrderAmendmentFlag(flag) {
    let returnobj={
      flag:flag
    };
    console.log(returnobj);
    this.service.loaderhome = true;
    const createOppAmendmentPayload = {
      OpportunityId: this.projectServices.getSession('opportunityId'),
      OrderId: this.orderId,
      CrmReferenceNumber: this.opportunityData.CRMReference,
      WiproAmendmentType: this.amendmentId
    };
    const amendmentPayload = {
      WiproAmendmentRemarks: (this.amendmentId == 184450006 && this.amendmentRemarks) ? this.amendmentRemarks : null,
      WiproIsAmendment: true,
      ParentOrderId: this.orderId,
      ParentOpportunityId : this.projectServices.getSession('opportunityId'),
      WiproIsAmendmentLessthan250k: (this.showlabel && this.selectedLabel == true) ? true : false,
      WiproAmendmentType: parseInt(this.amendmentId),
    };

    this.orderService.newAmendmentDetails = amendmentPayload
    this.orderService.parentOrderId = this.orderId;
    this.orderService.amendmentInProcess = false;

        this.orderService.sendAmendmentDetails(amendmentPayload);
        //this.projectServices.setordersave(true);
        
        this.dialogRef.close(returnobj);
       
    // this.orderService.createOpportunityAmendmentFlag(createOppAmendmentPayload).subscribe((res: any) => {
    //   if (!res.IsError) {
    //     console.log("createamend2", res);
    //     amendmentPayload.ParentOrderId = res.ResponseObject.ParentOrderId;  
    //     this.orderService.sendAmendmentDetails(amendmentPayload);
    //     this.projectServices.setordersave(true);
    //     this.service.loaderhome = false;
    //     this.dialogRef.close();
    //   } else {
    //     this.service.loaderhome = false;
    //   }
    // }, err => {
    //   this.service.loaderhome = false;
    //   console.log(err);
    // });
  }

  //opportunity check
  checkOpportunityForAmendment(){
    if(!this.projectServices.getSession('opportunityId')){
      this.getSalesOrderDetails();
    }
    else
    {
      this.checkOrderBookingId()
    }
   }  

   checkOrderBookingId() {
    const payload = {
      Id: this.projectServices.getSession('opportunityId')
      
    };
    this.orderService.checkOrderBookingId(payload).subscribe((bookingId: any) => {
      if (!bookingId.IsError) {
        if (bookingId.ResponseObject.length) {
          this.orderId = bookingId.ResponseObject[0].SalesOrderId
          this.getSalesOrderDetails();
        }
      }
    });
  }

  getSalesOrderDetails(){
    let bookingIdPayload = {
      Guid: this.orderId
    };
    this.orderService.getSalesOrderDetails(bookingIdPayload).subscribe((orderDetails: any) => {
      console.log(orderDetails.ResponseObject);
      this.opportunityData = orderDetails.ResponseObject;
      this.orderId = orderDetails.ResponseObject.OrderBookingId;
    });
  }

  // get order overview details
// getoppOverviewdetails() {
//   const payload = {
//     OppId: this.projectServices.getSession('opportunityId'),
//     "IsDataForOrder":true
    
//   };
//   this.orderService.getoppOverviewdetails(payload)
//     .subscribe((res: any) => {
//       this.oppTypeId = res.ResponseObject.OpportunityTypeId;
//       console.log("sauravaa",res.ResponseObject);
//     },
//     (err: Error) => {
//       console.log(err);
//     });
//   }
}
