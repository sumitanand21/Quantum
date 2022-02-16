import { Component, OnInit, Output, EventEmitter, Inject, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { DataCommunicationService } from '@app/core/services/global.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { suspendedpopComponent } from '@app/shared/modals/suspend-popup/suspend-popup.component';
import { assignpopComponent } from '@app/shared/modals/assign-popup/assign-popup.component';
import { OpportunitiesService } from '@app/core/services';
import { DatePipe } from '@angular/common'
import { MatSnackBar } from '@angular/material';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { Subject, Observable } from 'rxjs';
import { OrderService } from '@app/core/services';
import { SubmitOrderPopup } from '@app/modules/opportunity/pages/opportunity-view/tabs/order/order.component';
import { NewresidualComponent } from '@app/modules/opportunity/pages/opportunity-view/modals/newresidual/newresidual.component';
import { ContractExecutionComponent } from '@app/modules/opportunity/pages/opportunity-view/modals/contract-execution/contract-execution.component';
import { CreateamendmentComponent } from '@app/modules/opportunity/pages/opportunity-view/modals/createamendment/createamendment.component';
import { dealQualifierpopup, estimtedclosuredate, manualprobabilitypopup, LinkLeadspopup, Leadspopup, UserTargetsPopup, Pursuitpopup, securedealpopup, ProceedtoQualifypopup, proceedwithoutnurturepopup, ConfirmSaveComponent } from '@app/modules/opportunity/pages/opportunity-view/opportunity-view.component';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent {


  winningProbabilityData = [];
  datePipe = new DatePipe("en-US");
  IsSimpleDeal: boolean;
  currentStory: boolean = true;
  // count = 0;
  Summary_window = false;
  more_clicked;
  more_clickedthree;
  forecast = []
  forecastValue = 3;
  opportunityTab = true;
  ProceedQualify: boolean = false;
  overview: boolean = false;
  businesssolution: boolean = false;
  team: boolean = false;
  competitor: boolean = false;
  deal: boolean = false;
  contracts: boolean = false;
  order: boolean = false;
  obdistribution: boolean = false;
  closereason: boolean = false;
  tabChanges: boolean;
  overviewDetailData: any;
  addAlliance:boolean=false;
  addIp:boolean=false;
  addNewAge:boolean=false;
  addService:boolean=false;

//   constructor(public OpportunityServices: OpportunitiesService, public OrderService: OrderService, public router: Router, private snackBar: MatSnackBar, public datepipe: DatePipe, public dialog: MatDialog, public service: DataCommunicationService, public projectService: OpportunitiesService) {
//     this.opportunityTab = true;

//     this.summaryPage = this.summaryPage.bind(this);
//     this.eventSubscriber(this.OpportunityServices.subscription, this.summaryPage);
//   }

//   subscription;
//   eventSubscriber(action: Subject<any>, handler: () => void, off: boolean = false) {
//     if (off && this.subscription) {
//       this.subscription.unsubscribe();
//     } else {
//       this.subscription = action.subscribe(() => handler());
//     }
//   }
//   ngOnDestroy(): void {
//     this.eventSubscriber(this.OpportunityServices.subscription, this.summaryPage, true);
//   }





//   accordianContent1;
//   orderAccordianContent1;
//   getAccordians(key) {
//     console.log('hi');
//     if (key === 'opportunityTab') {
//       this.opportunityTab = true;
//       this.accordianContent1 = [this.accordianContent[key]];
//     } else {
//       this.opportunityTab = false;
//       this.orderAccordianContent1 = [this.orderAccordianContent[key]];
//     }
//   }

//   showSummary_window() {
//     this.service.Summary_window = true;
//   }
//   closeSummary_window() {
//     this.service.Summary_window = false;
//   }



//   // LinkLeadsData = [];
//   // LeadActivities = []

//   leadDetails(data, dialogRef) {
//     var orginalArray = this.projectService.getleadActivities();
//     orginalArray.subscribe((x: any[]) => {

//       dialogRef.componentInstance.data.configdata = x.filter(y => y.name.includes(data));

//       //.filter(y=>y.name.includes(data))
//     });

//     // console.log("value from server " +this.LinkLeadsData);
//   }
//   residualoppurtunity() {
//     const dialogRef = this.dialog.open(NewresidualComponent, {
//       width: '400px'
//     });
//   }
//   openSubmitOrderPopup() {
//     const dialogRef = this.dialog.open(SubmitOrderPopup, {
//       width: '550px'
//     });

//   }
//   ActivityDetails(data, dialogRef) {
//     var orginalArray = this.projectService.getLead();
//     orginalArray.subscribe((x: any[]) => {

//       dialogRef.componentInstance.data.configdata = x.filter(y => y.name.includes(data));


//     });


//   }

//   summaryPopup(content) {

//     switch (content) {
//       case 'Type': {
//         this.router.navigate(['/opportunity/changeOpportunity']);
//         return;
//       }
//       case 'Qualification status': {
//         this.dealqualify()
//         return;
//       }

//       case 'Est. closure date': {
//         this.estimateddate()
//         return;
//       }

//       case 'Manual probability of winning': {
//         this.manualprobability()
//         return;
//       }

//       case 'Activities': {
//         this.activityPopup();
//         return;

//         // const dialogRef = this.dialog.open(LinkLeadspopup,
//         //   {
//         //     width: '396px',
//         //     data: { configdata: '', title: 'Linked activities', label: 'Link activities' }
//         //   });

//         // dialogRef.componentInstance.Modalemittedcontent.subscribe((x) => {

//         //   console.log('value received from modal ' + x);
//         //   this.leadDetails(x, dialogRef);


//         // });


//         // return;
//       }

//       case 'Leads': {

//         this.leadsPopup();
//         return;
//         // const dialogRefmy = this.dialog.open(LinkLeadspopup,
//         //   {
//         //     width: '396px',
//         //     data: { configdata: '', title: 'Link leads', label: 'Link leads' }
//         //   });

//         // dialogRefmy.componentInstance.Modalemittedcontent.subscribe((x) => {

//         //   console.log(x);
//         //   this.ActivityDetails(x, dialogRefmy);

//         // });


//         // return;
//       }


//     }
//   }

//   openModalContent(value) {

//     switch (value) {

//       case 'Assign': {

//         this.dialog.open(assignpopComponent,
//           {
//             width: '396px',
//           });

//         return;
//       }

//       case 'Suspend': {
//         this.dialog.open(suspendedpopComponent,
//           {
//             width: '396px',
//           });
//         return;
//       }



//     }

//   }
//   openAmendment() {
//     const dialogRef = this.dialog.open(CreateamendmentComponent,
//       {
//         width: '350px'
//       });
//   }
//   dealqualify() {
//     const dialogRef = this.dialog.open(dealQualifierpopup,
//       {
//         width: '350px'
//       });
//   }

//   estimateddate() {
//     const dialogRef = this.dialog.open(estimtedclosuredate,
//       {
//         width: '350px',
//         data: { data: this.accordianContent }
//       });
//     dialogRef.afterClosed().subscribe(result => {
//       this.profilesSummary()
//     });
//   }

//   manualprobability() {
//     const dialogRef = this.dialog.open(manualprobabilitypopup,
//       {
//         width: '350px',
//         data: { data: this.forecastValue, winningProbabilityData: this.winningProbabilityData, ManualProbabilityWiningValue: this.ManualProbabilityWiningId }
//       });

//     dialogRef.afterClosed().subscribe(result => {

//       console.log(result, 'result');

//     });

//   }
//   activityPopup() {

//     const dialogRef = this.dialog.open(LinkLeadspopup,
//       {
//         width: '396px',
//         data: { configdata: '', title: 'Linked activities', label: 'Link activities', data: this.accordianContent }
//       });

//     dialogRef.afterClosed().subscribe(result => {

//       this.activityData();
//       console.log(result, 'result');

//     });
//   }


//   leadsPopup() {


//     const dialogRef = this.dialog.open(Leadspopup,
//       {
//         width: '396px',
//         data: { configdata: '', title: 'Link leads', label: 'Link leads', data: this.accordianContent }
//       });

//     dialogRef.afterClosed().subscribe(result => {

//       console.log(result, 'result');
//       this.leadData();

//     });

//   }



//   openUserTargetsPopup(): void {
//     const dialogRef = this.dialog.open(UserTargetsPopup, {
//       width: '850px',
//     });


//   }
//   openpursuitPopup(): void {
//     const dialogRef = this.dialog.open(Pursuitpopup, {
//       width: '350px',
//     });
//   }
//   securePopup(): void {
//     const dialogRef = this.dialog.open(securedealpopup, {
//       width: '350px',
//     });
//   }

//   panelOpenStateSumry;

//   accordianContent: any = [


//     {
//       'title': 'Profile', 'content': [

//         {
//           'label': 'Opportunity name',
//           'content': ''
//         },
//         {
//           'label': 'Opportunity ID',
//           'content': ''
//         },
//         {
//           'label': 'Opportunity owner',
//           'content': ''
//         },
//         {
//           'label': 'Account name',
//           'content': ''
//         },
//         {
//           'label': 'SBU',
//           'content': ''
//         },
//         {
//           'label': 'Vertical',
//           'content': ''
//         },
//         {
//           'label': 'Sub-Vertical',
//           'content': ''
//         },
//         {
//           'label': 'Est. closure date',
//           'content': '',
//           'isEditable': true
//         },
//         {
//           'label': 'TCV (Deal currency)',
//           'content': ''
//         },
//         {
//           'label': 'ACV (Deal currency)',
//           'content': ''
//         },
//         {
//           'label': 'TCV in plan forex($)',
//           'content': ''
//         },
//         {
//           'label': 'ACV in plan forex($)',
//           'content': ''
//         },
//         {
//           'label': 'TCV in dynamic forex($)',
//           'content': ''
//         },
//         {
//           'label': 'ACV in dynamic forex($)',
//           'content': ''
//         },
//         {
//           'label': 'Type',
//           'content': '',
//           'isEditable': true
//         },
//         {
//           'label': 'Base order number',
//           'content': ''
//         },

//         {
//           'label': 'Win predictor probability(%)',
//           'content': ''
//         },
//         {
//           'label': 'StormCast score',
//           'content': ''
//         },
//         {
//           'label': 'Manual probability of winning',
//           'content': '',
//           'isEditable': true
//         },
//         {
//           'label': 'RS qualifier status',
//           'content': ''
//         },
//         {
//           'label': 'Forecast',
//           'content': ''
//         },
//         {
//           'label': 'CRM reference number',
//           'content': ''
//         },
//         {
//           'label': 'Status',
//           'content': ''
//         },
//         {
//           'label': 'Created date',
//           'content': ''
//         },

//       ]

//     },
//     {
//       'title': 'Toolkit', 'content': [

//         {
//           'label': 'Stormtracker suite',
//           'content': '0 Records'
//         },
//         {
//           'label': 'Relationship Suite',
//           'content': 'No'
//         },
//         {
//           'label': 'Management log',
//           'content': 'No'
//         },
//         {
//           'label': 'Management log',
//           'content': 'No'
//         },
//         {
//           'label': 'Win strategy',
//           'content': 'No'
//         },
//         {
//           'label': 'Competitor strategy',
//           'content': 'No'
//         },
//         {
//           'label': 'RAID log',
//           'content': 'No'
//         },
//         {
//           'label': 'IV P/VP and slide deck',
//           'content': 'No'
//         },
//         {
//           'label': 'My digital coach',
//           'content': 'Available'
//         },
//         {
//           'label': 'Encounter Plan',
//           'content': 'No'
//         },
//         {
//           'label': 'Commitment register',
//           'content': 'No'
//         },




//       ]

//     },
//     {
//       'title': 'Opportunity qualifier', 'content': [
//         {
//           'label': 'Qualification status',
//           'content': 'Not applicable',
//           'isEditable': true
//         }
//       ]

//     },
//     {
//       'title': 'Staffing details', 'content': [

//         {
//           'label': 'Request',
//           'content': 'Not mentioned',

//         },
//         {
//           'label': 'Forecast submitted date',
//           'content': 'Not mentioned',

//         },
//         {
//           'label': 'Initiated date',
//           'content': 'Not mentioned',

//         }


//       ]

//     },

//     {
//       'title': 'Users carrying targets', 'content': [


//         {
//           'label': 'Forecast submitted date',
//           'content': 'Not mentioned',

//         },
//         {
//           'label': 'Initiated date',
//           'content': 'Not mentioned',

//         }
//       ], 'hideContent': true

//     },
//     {
//       'title': 'SOW details', 'content': [

//         {
//           'label': 'SOW ID',
//           'content': 'Not mentioned',


//         }


//       ]

//     },
//     {
//       'title': 'Delivery team', 'content': []

//     },
//     {
//       'title': 'POA Holders', 'content': [

//         {
//           'label': 'Ramamoorthy Venkateswara',
//           'content': 'ramamoorthy.venkateswara@wipro.com',

//         },

//         {
//           'label': 'Surendra Shetty',
//           'content': 'surendra.shetty@wipro.com',

//         },

//         {
//           'label': 'Ramamoorthy Venkateswara',
//           'content': 'ramamoorthy.venkateswara@wipro.com',

//         },

//         {
//           'label': 'Surendra Shetty',
//           'content': 'surendra.shetty@wipro.com',

//         },

//         {
//           'label': 'Ramamoorthy Venkateswara',
//           'content': 'ramamoorthy.venkateswara@wipro.com',

//         },

//         {
//           'label': 'Surendra Shetty',
//           'content': 'surendra.shetty@wipro.com',

//         },

//         {
//           'label': 'Ramamoorthy Venkateswara',
//           'content': 'ramamoorthy.venkateswara@wipro.com',

//         },

//         {
//           'label': 'Surendra Shetty',
//           'content': 'surendra.shetty@wipro.com',

//         },

//         {
//           'label': 'Ramamoorthy Venkateswara',
//           'content': 'ramamoorthy.venkateswara@wipro.com',

//         },

//         {
//           'label': 'Surendra Shetty',
//           'content': 'surendra.shetty@wipro.com',

//         }
//       ]

//     },
//     {
//       'title': 'Linked activities & leads',

//       'content': [
//         {
//           'actionTitle': 'Activities', 'icon': 'mdi-message-settings-variant',

//           'subContent': [
//             // {
//             //   'accountName': 'Reimagine singtel procurement process',
//             //   'account': 'Cust Mtg - Lead development',
//             //   'name': ' Avinash Gupta'

//             // },
//             // {
//             //   'accountName': 'Reimagine singtel procurement process',
//             //   'account': 'Cust Mtg - Lead development',
//             //   'name': 'Rahul Jain'

//             // },
//             // {
//             //   'accountName': 'Reimagine singtel procurement process',
//             //   'account': 'Cust Mtg - Lead development',
//             //   'name': ' Avinash gupta'
//             // },
//             // {
//             //   'accountName': 'Reimagine singtel procurement process',
//             //   'account': 'Cust Mtg - Lead development',
//             //   'name': ' Avinash gupta'
//             // },
//             // {
//             //   'accountName': 'Reimagine singtel procurement process',
//             //   'account': 'Cust Mtg - Lead development',
//             //   'name': ' Avinash gupta'
//             // },
//             // {
//             //   'accountName': 'Reimagine singtel procurement process',
//             //   'account': 'Cust Mtg - Lead development',
//             //   'name': ' Avinash gupta'
//             // },
//             // {
//             //   'accountName': 'Reimagine singtel procurement process',
//             //   'account': 'Cust Mtg - Lead development',
//             //   'name': ' Avinash gupta'
//             // },
//             // {
//             //   'accountName': 'Reimagine singtel procurement process',
//             //   'account': 'Cust Mtg - Lead development',
//             //   'name': ' Avinash gupta'
//             // },
//             // {
//             //   'accountName': 'Reimagine singtel procurement process',
//             //   'account': 'Cust Mtg - Lead development',
//             //   'name': ' Avinash gupta'

//             // }

//           ]

//         },

//         // { 'actionTitle': 'leads','icon':'mdi-rounded-corner', }
//         {
//           'actionTitle': 'Leads', 'icon': 'mdi-rounded-corner',

//           'subContent': [
//             // {
//             //   'accountName': 'Lead name 001',
//             //   'name': ' Avinash Gupta'

//             // },
//             // {
//             //   'accountName': 'Lead name 002',

//             //   'name': 'Rahul Jain'

//             // },
//             // {
//             //   'accountName': 'Lead name 003',
//             //   'name': ' Avinash gupta'
//             // },
//             // {
//             //   'accountName': 'Lead name 004',
//             //   'name': ' Avinash gupta'
//             // },
//             // {
//             //   'accountName': 'Lead name 005',
//             //   'name': ' Avinash gupta'
//             // },
//             // {
//             //   'accountName': 'Lead name 006',
//             //   'name': ' Avinash gupta'
//             // }, {
//             //   'accountName': 'Lead name 007',
//             //   'name': ' Avinash gupta'
//             // }, {
//             //   'accountName': 'Lead name 008',
//             //   'name': ' Avinash gupta'

//             // }

//           ]

//         }

//       ]
//     }

//   ]

//   // panelOpenStateSumry1;

//   // Order tab accordians starts
//   orderAccordianContent = [
//     {
//       'title': 'Order summary', 'content': [
//         {
//           'label': 'Number',
//           'content': '',
//         },
//         {
//           'label': 'Owner',
//           'content': ''
//         },
//         {
//           'label': 'Primary order',
//           'content': ''
//         },
//         {
//           'label': 'CRM ref no',
//           'content': ''
//         },
//         {
//           'label': 'SAP customer code',
//           'content': ''
//         },
//         {
//           'label': 'Type',
//           'content': ''
//         },
//         {
//           'label': 'Authorization',
//           'content': ''
//         },
//         {
//           'label': 'SOW signed date',
//           'content': ''
//         },
//         {
//           'label': 'Sales booking ID',
//           'content': ''
//         },
//         {
//           'label': 'Commercial model',
//           'content': ''
//         },
//         {
//           'label': 'Start date',
//           'content': ''
//         },
//         {
//           'label': 'End date',
//           'content': ''
//         },
//         {
//           'label': 'Approval stage',
//           'content': ''
//         },
//         {
//           'label': 'Pricing type',
//           'content': ''
//         },
//         {
//           'label': 'Pricing ID',
//           'content': ''
//         },
//         {
//           'label': 'Order owner',
//           'content': ''
//         },
//         {
//           'label': 'SOW ID',
//           'content': ''
//         },
//         {
//           'label': 'Pricing apprival stage',
//           'content': ''
//         },
//         {
//           'label': 'Project creation at SAP-CPRO',
//           'content': ''
//         },
//         {
//           'label': 'Invoicing at SAP-CPRO',
//           'content': ''
//         },
//         {
//           'label': 'Region',
//           'content': ''
//         },
//         {
//           'label': 'Contracting country',
//           'content': ''
//         },
//         {
//           'label': 'Classification',
//           'content': ''
//         },
//         {
//           'label': 'Super SOw number',
//           'content': ''
//         },
//         {
//           'label': 'Auto created opportunity name',
//           'content': ''
//         },
//         {
//           'label': 'OM%',
//           'content': ''
//         },
//       ]
//     },
//     {
//       'title': 'Approval summary', 'content': [
//         {
//           'label': 'Initiated on (in IST)',
//           'content': '',
//         },
//         {
//           'label': 'Type',
//           'content': ''
//         },
//         {
//           'label': 'Initiated by',
//           'content': ''
//         },
//         {
//           'label': 'ADH/DM',
//           'content': ''
//         },
//         {
//           'label': 'DM approval status',
//           'content': ''
//         },
//         {
//           'label': 'DM approved/Rejected date',
//           'content': ''
//         },
//         {
//           'label': 'Aging with DM',
//           'content': ''
//         },
//         {
//           'label': 'BFM or BFM team',
//           'content': ''
//         },
//         {
//           'label': 'BFM approval status',
//           'content': ''
//         },
//         {
//           'label': 'BFM approved/Rejected date',
//           'content': ''
//         },
//         {
//           'label': 'Aging with BFM',
//           'content': ''
//         },
//       ]

//     },
//     {
//       'title': 'Finacials', 'content': [
//         {
//           'label': 'Exchange date',
//           'content': '1.00',
//         },
//         {
//           'label': 'Approved amendments value($)',
//           'content': '312.00'
//         },
//         {
//           'label': 'Approved negative amendments Value($)',
//           'content': '-160.00'
//         },
//         {
//           'label': 'Total order value($)',
//           'content': '312.00'
//         },
//         {
//           'label': 'Original order value($)',
//           'content': '160'
//         },
//         {
//           'label': 'TCV in plan forex(USD)',
//           'content': '160'
//         },
//         {
//           'label': 'ACV in plan forex(USD)',
//           'content': 'CRM GCP'
//         },
//         {
//           'label': 'TCV in dynamic forex(USD)',
//           'content': '160'
//         },
//         {
//           'label': 'ACV in dynamic forex(USD)',
//           'content': '160'
//         },
//       ]
//     },
//     {
//       'title': 'Amendment summary', 'content': [
//         {
//           'label': 'No. of approved amendments',
//           'content': '3',
//         },
//         {
//           'label': 'No. of un-approved amendments',
//           'content': '18'
//         },
//         {
//           'label': 'Approved value',
//           'content': '152.00'
//         },
//         {
//           'label': 'Unapproved value',
//           'content': '35869.00'
//         },
//       ]
//     },
//     {
//       'title': 'Budget details', 'content': [
//         {
//           'label': 'Pricing ID',
//           'content': '20068916',
//         },
//         {
//           'label': 'OM%',
//           'content': '0'
//         },
//         {
//           'label': 'Discount/Premium',
//           'content': 'NA'
//         },
//         {
//           'label': 'Discount/Premium base',
//           'content': 'NA'
//         },
//         {
//           'label': 'Discount/Premium %',
//           'content': 'NA'
//         },
//         {
//           'label': 'Onsite MM',
//           'content': '1'
//         },
//         {
//           'label': 'Offshore MM',
//           'content': '1'
//         },
//         {
//           'label': 'Onsite MM - Contingency',
//           'content': '1'
//         },
//         {
//           'label': 'Offshore MM - Contingency',
//           'content': '1'
//         },
//         {
//           'label': 'Onsite cost in INR',
//           'content': '1'
//         },
//         {
//           'label': 'Offshore cost in INR',
//           'content': '1'
//         },
//         {
//           'label': 'Onsite rate',
//           'content': '1'
//         },
//         {
//           'label': 'Offshore rate',
//           'content': '1'
//         },
//         {
//           'label': 'Service pass thru - Cost & revenue',
//           'content': '11'
//         },
//         {
//           'label': 'Product pass thru - Cost & revenue',
//           'content': '11'
//         },
//         {
//           'label': 'Other costs',
//           'content': '11'
//         },
//         {
//           'label': 'Documentation Type',
//           'content': 'Cat A'
//         },
//         {
//           'label': 'SOW auth slip',
//           'content': 'Yes'
//         },
//         {
//           'label': 'No of documents',
//           'content': 'Single document'
//         },
//         {
//           'label': 'Approval doc',
//           'content': 'Both parties signed SOW'
//         },
//         {
//           'label': 'Pricing rework',
//           'content': 'Adjustment in rates'
//         },
//       ]
//     },
//     {
//       'title': 'Account details', 'content': [
//         {
//           'label': 'Name',
//           'content': 'Ringo Steels-New',
//         },
//         {
//           'label': 'Owner',
//           'content': 'CRM GCP'
//         },
//         {
//           'label': 'Vertical',
//           'content': 'Energy'
//         },
//         {
//           'label': 'Geo',
//           'content': 'Europe'
//         },
//       ]
//     }
//   ]
//   // Order tab accordians ends


//   showContent(index) {
//     this.accordianContent[index].hideContent = false;
//   }

//   accordians: {}[] = [
//     {
//       'title': 'Overview'
//     },
//     {
//       'title': 'Toolkit'
//     },
//     {
//       'title': 'Deal Qualifier'
//     },
//     {
//       'title': 'Delivery Team'
//     },
//     {
//       'title': 'POA Holders'
//     },
//   ]

//   accContents: {}[] = [
//     {
//       'label': 'Opportunity name',
//       'content': 'Reimagine Singtel Process'
//     },
//     {
//       'label': 'Opportunity ID',
//       'content': 'OPP000135096'
//     },
//     {
//       'label': 'Opportunity owner',
//       'content': 'Ranjith Ravi'
//     },
//     {
//       'label': 'Account name',
//       'content': 'Singtel'
//     },
//     {
//       'label': 'Vertical',
//       'content': 'Utilities'
//     },
//     {
//       'label': 'Sub-Vertical',
//       'content': 'Customer care'
//     },
//     {
//       'label': 'Stage',
//       'content': 'Qualify'
//     },
//     {
//       'label': 'Est.closure date',
//       'content': '21-Dec-2019',

//     },
//     {
//       'label': 'TCV($)',
//       'content': '$ 22 Mn'
//     },
//     {
//       'label': 'ACV($)',
//       'content': '$ 10 Mn'
//     },
//     {
//       'label': 'TCV in Plan Forex($)',
//       'content': '$ 22 Mn'
//     },
//     {
//       'label': 'ACV in Plan Forex($)',
//       'content': '$ 10 Mn'
//     },
//     {
//       'label': 'TCV in Dynamic Forex($)',
//       'content': 'Not Mentioned'
//     },
//     {
//       'label': 'ACV in Dynamic Forex($)',
//       'content': 'Not Mentioned'
//     },
//     {
//       'label': 'Type',
//       'content': 'New'
//     },
//     {
//       'label': 'Win predictor probability(%)',
//       'content': 'N/A'
//     },
//     {
//       'label': 'StormCast score',
//       'content': 'Not Mentioned'
//     },
//     {
//       'label': 'Manual probility',
//       'content': '100',

//     },
//     {
//       'label': 'RS qualifier status',
//       'content': 'Not Mentioned'
//     },
//     {
//       'label': 'Forecast',
//       'content': 'Not Mentioned'
//     },
//     {
//       'label': 'CRM reference number',
//       'content': '7127767'
//     },
//     {
//       'label': 'Status',
//       'content': 'Active'
//     },
//     {
//       'label': 'Created date',
//       'content': '10-Jun-2019'
//     },


//   ]

//   openModal(data) {
//     console.log(data);


//     switch (data) {
//       case 'Create': {

//         let dialogRef = this.dialog.open(ProceedtoQualifypopup, {
//           width: '396px'

//         });
//         this.router.navigate(['/order/orderdetails/overview']);
//         dialogRef.afterClosed().subscribe(result => {
//           this.projectService.ProceedQualify = result;

//           if (this.projectService.ProceedQualify == true) {

//             // this.projectService.ProceedQualify1 = true;
//             // alert("this.projectService.ProceedQualify1");
//             this.projectService.setproceedtoQualifyChanges(true);

//           }
//           else {
//             this.projectService.setproceedtoQualifyChanges(false);
//           }





//         });
//         return;

//       }
//       case 'Qualify': {

//         let dialogRef = this.dialog.open(Pursuitpopup, {
//           width: '396px'

//         });
//         this.router.navigate(['/order/orderdetails/overview']);
//         dialogRef.afterClosed().subscribe(result => {
//           this.projectService.ProceedQualify = result;
//           // this.projectService.currentState = 'Pursuit';
//           if (this.projectService.ProceedQualify == true) {

//             // this.projectService.ProceedQualify1 = true;
//             // alert("this.projectService.ProceedQualify1");
//             this.projectService.setproceedtoQualifyChanges(true);

//           }
//           else {
//             this.projectService.setproceedtoQualifyChanges(false);
//           }


//         });
//         return;

//       }
//       case 'Pursuit': {

//         let dialogRef = this.dialog.open(securedealpopup, {
//           width: '396px'

//         });
//         this.router.navigate(['/order/orderdetails/overview']);
//         dialogRef.afterClosed().subscribe(result => {
//           this.projectService.ProceedQualify = result;
//           if (this.projectService.ProceedQualify == true) {
//             this.projectService.setproceedtoQualifyChanges(true);
//           }
//           else {
//             this.projectService.setproceedtoQualifyChanges(false);
//           }

//         });
//         return;

//       }

//       case 'Nuture': {
//         this.dialog.open(proceedwithoutnurturepopup,
//           {
//             width: '450px',
//           });
//         return;
//       }

//       case 'Secure': {
//         const dialogRef = this.dialog.open(ContractExecutionComponent, {
//           width: '550px'
//         });
//         this.router.navigate(['/order/orderdetails/overview']);
//         dialogRef.afterClosed().subscribe(result => {
//           this.projectService.ProceedQualify = result;
//           if (this.projectService.ProceedQualify == true) {
//             this.projectService.setproceedtoQualifyChanges(true);
//           }
//           else {
//             this.projectService.setproceedtoQualifyChanges(false);
//           }
//         });

//         return;
//       }
//     }
//   }



//   nextstepbtn() {
//     // this.overview= true;

//     if (this.router.url === '/order/orderdetails/overview' && (this.projectService.ProceedQualify == true || this.projectService.count == 0) && this.projectService.count < 5) {

//       // this.projectService.setproceedtoQualifyChanges(false);
//       this.projectService.currentState = this.steps[this.projectService.count].id;
//       console.log(this.projectService.currentState);

//       // this.ProceedQualify = false;
//       this.service.onSave();

//     }
//     else {
//       this.service.onSave();
//     }



//   }
//   changeTab(tab) {
//     switch (tab) {
//       case 'overview':
//         if (this.service.dirtyflag) {
//           this.openConfirmPopup();
//           let dialogData = this.getNotification().subscribe(res => {
//             console.log('res', res);
//             if (res.text == true) {
//               this.router.navigate(['/order/orderdetails/overview']);
//               dialogData.unsubscribe();
//             }
//             else {
//               dialogData.unsubscribe();
//             }
//           });
//         }
//         else {
//           this.router.navigate(['/order/orderdetails/overview']);
//         }

//         return;
//       case 'solution':
//         // [routerLink]="['businesssolution']"
//         if (this.service.dirtyflag) {
//           this.openConfirmPopup();
//           let dialogData = this.getNotification().subscribe(res => {
//             console.log('res', res);
//             if (res.text == true) {
//               this.router.navigate(['/order/orderdetails/businesssolution']);
//               dialogData.unsubscribe();
//             }
//             else {
//               dialogData.unsubscribe();
//             }
//           });
//         }
//         else {
//           this.router.navigate(['/order/orderdetails/businesssolution']);
//         }

//         return;
//       case 'team':
//         // [routerLink]="['team']"
//         if (this.service.dirtyflag) {
//           this.openConfirmPopup();
//           let dialogData = this.getNotification().subscribe(res => {
//             console.log('res', res);
//             if (res.text == true) {
//               this.router.navigate(['/order/orderdetails/team']);
//               dialogData.unsubscribe();
//             }
//             else {
//               dialogData.unsubscribe();
//             }
//           });
//         }
//         else {
//           this.router.navigate(['/order/orderdetails/team']);
//         }

//         return;
//       case 'competitor':
//         // [routerLink]="['competitor']"
//         if (this.service.dirtyflag) {
//           this.openConfirmPopup();
//           let dialogData = this.getNotification().subscribe(res => {
//             console.log('res', res);
//             if (res.text == true) {
//               this.router.navigate(['/order/orderdetails/competitor']);
//               dialogData.unsubscribe();
//             }
//             else {
//               dialogData.unsubscribe();
//             }
//           });
//         }
//         else {
//           this.router.navigate(['/order/orderdetails/competitor']);
//         }

//         return;
//       case 'influencer':
//         // [routerLink]="['deal']"
//         if (this.service.dirtyflag) {
//           this.openConfirmPopup();
//           let dialogData = this.getNotification().subscribe(res => {
//             console.log('res', res);
//             if (res.text == true) {
//               this.router.navigate(['/order/orderdetails/deal']);
//               dialogData.unsubscribe();
//             }
//             else {
//               dialogData.unsubscribe();
//             }
//           });
//         }
//         else {
//           this.router.navigate(['/order/orderdetails/deal']);
//         }

//         return;
//       case 'contracts':
//         // [routerLink]="['contracts']"
//         if (this.service.dirtyflag) {
//           this.openConfirmPopup();
//           let dialogData = this.getNotification().subscribe(res => {
//             console.log('res', res);
//             if (res.text == true) {
//               this.router.navigate(['/order/orderdetails/contracts']);
//               dialogData.unsubscribe();
//             }
//             else {
//               dialogData.unsubscribe();
//             }
//           });
//         }
//         else {
//           this.router.navigate(['/order/orderdetails/contracts']);
//         }

//         return;
//         case 'order':
//       // case 'orderpage':
//         // [routerLink]="['order']"
//         if (this.service.dirtyflag) {
//           this.openConfirmPopup();
//           let dialogData = this.getNotification().subscribe(res => {
//             console.log('res', res);
//             if (res.text == true) {
//               // this.router.navigate(['/order/orderdetails/orderpage']);
//               this.router.navigate(['/order/orderdetails/order']);
//               dialogData.unsubscribe();
//             }
//             else {
//               dialogData.unsubscribe();
//             }
//           });
//         }
//         else {
//           // this.router.navigate(['/order/orderdetails/orderpage']);
//           this.router.navigate(['/order/orderdetails/order']);
//         }

//         return;
//       case 'reasons':
//         // [routerLink]="['closereason']"
//         if (this.service.dirtyflag) {
//           this.openConfirmPopup();
//           let dialogData = this.getNotification().subscribe(res => {
//             console.log('res', res);
//             if (res.text == true) {
//               this.router.navigate(['/order/orderdetails/closereason']);
//               dialogData.unsubscribe();
//             }
//             else {
//               dialogData.unsubscribe();
//             }
//           });
//         }
//         else {
//           this.router.navigate(['/order/orderdetails/closereason']);
//         }

//         // return;
//         // case 'orderreview':
//         //     this.router.navigate(['/order/orderdetails/orderreview']);
//         //     return;

//     }
//   }
//   private subject = new Subject<any>();
//   sendNotification(status: string) {
//     this.subject.next({ text: status });
//   }
//   getNotification(): Observable<any> {
//     return this.subject.asObservable();
//   }


//   openConfirmPopup() {
//     let dialog = this.dialog.open(ConfirmSaveComponent, {
//       width: '396px'
//     });

//     const sub = dialog.componentInstance.onAdd.subscribe((data) => {
//       this.sendNotification(data);
//     });

//     dialog.afterClosed().subscribe((result) => {
//       console.log('result from confirm popup', result);
//       // this.result = result;
//       sub.unsubscribe();
//     });

//   }


//   steps: any[] = [
//     // { icon: 'mdi mdi-rounded-corner', name: 'Lead' },
//     {
//       icon: 'assets/images/createstate2.svg',
//       icon1: 'assets/images/createiconstate2.svg',
//       iconshow: 'mdi mdi-rounded-corner',
//       name: 'Create',
//       id: '184450000',
//       content: [

//         {
//           date: null,
//           body: 'Sales Management has given the go-ahead to engage with the customer on this potential opportunity.',
//           // Isbtn: true
//         }
//       ]
//     },
//     {
//       icon: 'assets/images/qualifystate2.svg',
//       icon1: 'assets/images/qualifystate1.svg',
//       iconshow: 'mdi mdi-eye',
//       name: 'Qualify',
//       id: '184450001',
//       content: [

//         {
//           date: null,
//           // date2:this.date1.value,
//           // title: 'Qualify',
//           body: 'A politically powerful customer executive sponsor requested for a solution/ proposal',
//           // IsContentbtn: true,
//           // Contentbtn: 'Nuture',
//           // Validationtitle: 'Mandatory fields for qualify stage',
//           // Fields: ['Proposal type',
//           //  'Contracting country',
//           //  'Project duration (months)',
//           //  'Advisor name',
//           //  'Primary Contact',
//           //  'Decision maker Contacts']
//         }
//       ]
//     },
//     {
//       icon: 'assets/images/pursuitstate2.png',
//       icon1: 'assets/images/pursuitstate1.png',
//       iconshow: 'mdi mdi-lead-pencil',
//       name: 'Pursuit',
//       id: '184450002',
//       content: [
//         {
//           date: null,
//           // title: 'Pursuit',
//           body: 'A politically powerful customer executive sponsor requested for a solution/ proposal',
//           //  Validationtitle: 'Mandatory fields for qualify stage',
//           //  Fields: ['Proposal type',
//           //   'Contracting country',
//           //   'Project duration (months)',
//           //   'Advisor name',
//           //   'Primary Contact',
//           //   'Decision maker Contacts']
//         }

//       ]
//     },

//     {
//       icon: 'assets/images/securestage2.svg',
//       icon1: 'assets/images/securestage1.svg',
//       iconshow: 'mdi mdi-file',
//       name: 'Secure',
//       id: '184450003',
//       content: [

//         {
//           date: null,
//           // title: 'Secure',
//           body: 'A politically powerful customer executive sponsor requested for a solution/ proposal',
//           // Isbtn: true
//         }
//       ]
//     },
//     {
//       icon: 'assets/images/closestate2.svg',
//       icon1: 'assets/images/closestate1.svg',
//       iconshow: 'mdi mdi-chart-line',
//       name: 'Close',
//       id: '184450004',
//       content: [

//         {
//           date: null,
//           //title: 'Close',
//           body: 'A politically powerful customer executive sponsor requested for a solution/ proposal',
//           // Isbtn: true
//         }
//       ]
//     },
//   ]

//   emithover(e) {
//     // console.log(e);
//   }


//   forecastData() {
//     this.service.loaderhome = true;
//     this.projectService.forecastData().subscribe(res => {
//       if (!res.IsError) {
//         if (res.ResponseObject && (Array.isArray(res.ResponseObject) ? res.ResponseObject.length > 0 : false)) {
//           this.forecast = res.ResponseObject.map((it) => {
//             return { Value: it.Id, Label: it.Name }
//           })
//           this.profilesSummary();
//           this.activityData();
//           this.leadData();
//           //sunita added
//           this.orderSummary();
//           this.approvalOrderSummary();
//         }
//         else {
//         }
//       }
//       else {
//         this.projectService.displayMessageerror(res.Message);
//       }
//       this.service.loaderhome = false;
//     },
//       err => {
//         this.service.loaderhome = false;
//         this.projectService.displayerror(err.status);
//       }
//     )
//   }


//   summaryPage() {

//     let obj = { "OppId": this.projectService.getSession('opportunityId') }
//     this.service.loaderhome = true;
//     this.projectService.getOppOverviewDetail(obj).subscribe(res => {
//       if (!res.IsError) {
//         if (res.ResponseObject) {

//           this.projectService.setSession('currentState', res.ResponseObject.PipelineStage ? res.ResponseObject.PipelineStage.toString() : "");

//           this.projectService.setSession('estDate', res.ResponseObject.estimatedclosedate ? res.ResponseObject.estimatedclosedate.toString() : "");
//           this.projectService.setSession('verticalId', res.ResponseObject.Vertical ? res.ResponseObject.Vertical.toString() : "");
//           // console.log(this.projectService.currentState, 'stagestage');
//           this.overviewDetailData = res.ResponseObject;
//           this.projectService.count = this.projectService.wipro_pipelinestage.findIndex(it => it.Value === this.overviewDetailData.PipelineStage);
//           //  this.projectService.currentState = this.steps[this.projectService.count].id;
//           if (this.projectService.count == 0) {
//             this.steps[this.projectService.count].content[0].date = this.datePipe.transform(this.overviewDetailData.CreateStageDate, "d-MMM-yy");
//           }
//           else if (this.projectService.count == 1) {
//             this.steps[0].content[0].date = this.datePipe.transform(this.overviewDetailData.CreateStageDate, "d-MMM-yy");
//             this.steps[1].content[0].date = this.datePipe.transform(this.overviewDetailData.QualifyStageDate, "d-MMM-yy");
//           }
//           else if (this.projectService.count == 2) {
//             this.steps[0].content[0].date = this.datePipe.transform(this.overviewDetailData.CreateStageDate, "d-MMM-yy");
//             this.steps[1].content[0].date = this.datePipe.transform(this.overviewDetailData.QualifyStageDate, "d-MMM-yy");
//             this.steps[2].content[0].date = this.datePipe.transform(this.overviewDetailData.PursuitStageDate, "d-MMM-yy");
//           }
//           else if (this.projectService.count == 3) {
//             this.steps[0].content[0].date = this.datePipe.transform(this.overviewDetailData.CreateStageDate, "d-MMM-yy");
//             this.steps[1].content[0].date = this.datePipe.transform(this.overviewDetailData.QualifyStageDate, "d-MMM-yy");
//             this.steps[2].content[0].date = this.datePipe.transform(this.overviewDetailData.PursuitStageDate, "d-MMM-yy");
//             this.steps[3].content[0].date = this.datePipe.transform(this.overviewDetailData.SecureStageDate, "d-MMM-yy");
//           }
//           else if (this.projectService.count == 4) {
//             this.steps[0].content[0].date = this.datePipe.transform(this.overviewDetailData.CreateStageDate, "d-MMM-yy");
//             this.steps[1].content[0].date = this.datePipe.transform(this.overviewDetailData.QualifyStageDate, "d-MMM-yy");
//             this.steps[2].content[0].date = this.datePipe.transform(this.overviewDetailData.PursuitStageDate, "d-MMM-yy");
//             this.steps[3].content[0].date = this.datePipe.transform(this.overviewDetailData.SecureStageDate, "d-MMM-yy");
//             this.steps[4].content[0].date = this.datePipe.transform(this.overviewDetailData.CloseStageDate, "d-MMM-yy");
//           }
//           this.manualProbability();
//         }
//         else {

//         }

//       }
//       else {
//         this.projectService.displayMessageerror(res.Message);
//       }
//       this.service.loaderhome = false;
//     }
//       ,
//       err => {
//         this.service.loaderhome = false;
//         this.projectService.displayerror(err.status);
//       }
//     )
//   }


//   manualProbability() {
//     this.service.loaderhome = true;
//     this.projectService.manualProbability().subscribe(res => {

//       if (!res.IsError) {

//         if (res.ResponseObject && (Array.isArray(res.ResponseObject) ? res.ResponseObject.length > 0 : false)) {

//           this.winningProbabilityData = res.ResponseObject.map((it) => {
//             return { Value: it.Id, Label: it.Value }
//           })

//           this.forecastData();

//         }


//         else {

//         }
//       }
//       else {
//         this.projectService.displayMessageerror(res.Message);
//       }
//       this.service.loaderhome = false;
//     }
//       ,
//       err => {
//         this.service.loaderhome = false;
//         this.projectService.displayerror(err.status);
//       }
//     )


//   }


//   opportunityName = '';
//   ngOnInit() {

//     this.opportunityName = this.projectService.getSession('opportunityName');
//     if(this.projectService.getSession('accessData').FullAccess ==false && this.projectService.getSession('accessData').PartialAccess ==false ){
//       this.projectService.accessRight=false;
//      }
//      else if(this.projectService.getSession('accessData').FullAccess ==true || this.projectService.getSession('accessData').PartialAccess ==true ){
//       this.projectService.accessRight=true;
//   }
//      else if(this.projectService.getSession('accessData').FullAccess ==true|| this.projectService.getSession('accessData').AddAlliance==true){
//       this.addAlliance=true;
//      }
//      else if(this.projectService.getSession('accessData').FullAccess ==true|| this.projectService.getSession('accessData').AddIP==true){
//       this.addIp=true;
//      }
//      else if(this.projectService.getSession('accessData').FullAccess ==true|| this.projectService.getSession('accessData').AddNewAgeBusiness==true){
//       this.addNewAge =true;
//      }
//      else if(this.projectService.getSession('accessData').FullAccess ==true|| this.projectService.getSession('accessData').AddServiceLine==true){
//       this.addService=true;
//      }

//      else{
//       this.addAlliance=false;
//       this.addIp=false;
//       this.addNewAge=false;
//       this.addService=false;
//      }
//     this.summaryPage();

//     this.IsSimpleDeal = false;
//     let obj = {
//       "Id": "fb00ae34-d473-e911-a830-000d3aa058cb"
//     }

//     this.OpportunityServices.getOpportunitCompetitor(obj).subscribe(res => {
//       this.IsSimpleDeal = res.ResponseObject.IsSimpleDeal;
//     })
//   }










//   ManualProbabilityWiningValue;
//   ManualProbabilityWiningId;

//   orderSummary() {
//     this.service.loaderhome = true;
//     let obj =
//       {
//         "Guid": "68a69ab5-2e6e-e911-a830-000d3aa058cb"
//       }
//     this.OrderService.summaryOrder(obj).subscribe(response => {
//       if (!response.IsError) {
//       if (response.ResponseObject) {
//         console.log("order summary", response.ResponseObject);
//         console.log("order summary2", response);
//         var ordersummaryArr = [response.ResponseObject.OrderNumber, "NA",
//         response.ResponseObject.CrmReferenceNumber, response.ResponseObject.SAPCustomerCode, "NA",
//         response.ResponseObject.Authorization, this.datePipe.transform(response.ResponseObject.SOWSignedDate, "dd-MMM-yyyy"),
//         response.ResponseObject.PricingType,
//         this.datePipe.transform(response.ResponseObject.StartDate, "dd-MMM-yyyy"), this.datePipe.transform(response.ResponseObject.Enddate, "dd-MMM-yyyy"),
//           "NA", "NA", response.ResponseObject.PricingId, "NA",
//         response.ResponseObject.PricingApprovalStage, response.ResponseObject.ProjectCreatedatSAPcpro,
//           "NA",
//         response.ResponseObject.ContractingCountry, response.ResponseObject.Classification,
//           "NA", "NA",
//         response.ResponseObject.OmPercentage
//         ];
//         this.orderAccordianContent = this.orderAccordianContent.map((it) => {
//           {
//             if (it.title == 'Order summary') {

//               for (var i = 0; i < it.content.length; i++) {
//                 // console.log("content",it.content[i].content);
//                 it.content[i].content = ordersummaryArr[i];
//               }
//             }
//           }
//           return it
//         })
//       }
//       else {

//       }}
//       else {
//         this.projectService.displayMessageerror(response.Message);
//       }
//       this.service.loaderhome = false;
//     },

//     err => {
//       this.service.loaderhome = false;
//       this.projectService.displayerror(err.status);
//     }
//   );
//   }

//   approvalOrderSummary() {
//     this.service.loaderhome = true;
//     let obj = {}
//     this.OrderService.approvalSummary(obj).subscribe(response => {
//       if (!response.IsError) {
//       if (response.ResponseObject) {
//         console.log("approval summary", response.ResponseObject);
//         console.log("approval summary2", response);
//         var approvalsummaryArr = [ "NA", "NA",
//         "NA", "NA", "NA",
//         "NA",
//         this.datePipe.transform(response.ResponseObject.DMDecisionDate, "dd-MMM-yyyy"),
//         response.ResponseObject.DMAging,
//         response.ResponseObject.BFMName, "NA",
//         this.datePipe.transform(response.ResponseObject.BFMDecisionDate, "dd-MMM-yyyy"),
//           response.ResponseObject.BFMAging
//         ];
//         this.orderAccordianContent = this.orderAccordianContent.map((it) => {
//           {
//             if (it.title == 'Approval summary') {

//               for (var i = 0; i < it.content.length; i++) {
//                 // console.log("content",it.content[i].content);
//                 it.content[i].content = approvalsummaryArr[i];
//               }
//             }
//           }
//           return it
//         })
//       }
//       else {

//       }}
//       else {
//         this.projectService.displayMessageerror(response.Message);
//       }
//       this.service.loaderhome = false;
//     },

//     err => {
//       this.service.loaderhome = false;
//       this.projectService.displayerror(err.status);
//     }
//   );

//   }
//   profilesSummary() {






//     let obj = { "Guid": this.projectService.getSession('opportunityId') }
//     this.service.loaderhome = true;
//     this.projectService.profileSummary(obj).subscribe(response => {

//       if (!response.IsError) {

//         if (response.ResponseObject) {
//           // response.ResponseObject.ManualProbabilityWining

//           var ManualProbabilityWiningName = this.winningProbabilityData.filter((it) => it.Value == 184450005)
//           this.ManualProbabilityWiningValue = ManualProbabilityWiningName.length > 0 ? ManualProbabilityWiningName[0].Label : "";
//           this.ManualProbabilityWiningId = ManualProbabilityWiningName.length > 0 ? ManualProbabilityWiningName[0].Value : "";
//           var summaryArr = [response.ResponseObject.OpportunityName, response.ResponseObject.OpportunityNumber,
//           response.ResponseObject.OpportunityOwnerName, response.ResponseObject.Account.Name,
//           response.ResponseObject.Sbu.Name, response.ResponseObject.Vertical.Name,
//           response.ResponseObject.SubVertical.Name,
//           this.datePipe.transform(response.ResponseObject.EstimatedCloseDate, "dd-MMM-yyyy"),
//           response.ResponseObject.EstimatedTCV, response.ResponseObject.ACV,
//           response.ResponseObject.WiproTCVPlanned, response.ResponseObject.WiproACVPlanned,
//             "", "",
//           response.ResponseObject.OpportunityType.Value, response.ResponseObject.WiproBaseOrderno,
//           response.ResponseObject.WiproWinPredictorProbability,
//             "", this.ManualProbabilityWiningValue,
//           response.ResponseObject.RSQualifierStatus, response.ResponseObject.OpportunityForecast,
//           response.ResponseObject.CrmReferenceNumber, response.ResponseObject.StatusName,

//           this.datePipe.transform(response.ResponseObject.CreatedOn, "dd-MMM-yyyy")
//           ];


//           this.accordianContent = this.accordianContent.map((it) => {
//             {
//               if (it.title == 'Profile') {

//                 for (var i = 0; i < it.content.length; i++) {
//                   // console.log("content",it.content[i].content);
//                   it.content[i].content = summaryArr[i];
//                 }

//               }



//             }
//             return it
//           })


//           var extendedDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 180);
//           var closureDate = new Date(response.ResponseObject.EstimatedCloseDate);
//           console.log(this.projectService.getSession('currentState').toString(), 'stageeee');
//           if (this.projectService.getSession('currentState').toString() == '184450000') {
//             this.accordianContent.map((it) => {
//               {

//                 if (it.title == 'Profile') {

//                   it.content[18].isEditable = false;

//                 }

//               }

//               return it
//             })
//             this.forecast.filter(it => {
//               if (it.Value == 1 || it.Value == 2) { it.disableField = true; }
//             });
//           }
//           else {

//             this.accordianContent.map((it) => {
//               {

//                 if (it.title == 'Profile') {

//                   it.content[18].isEditable = true;

//                 }

//               }

//               return it
//             })

//             if (closureDate <= extendedDate && this.ManualProbabilityWiningValue >= 10) {
//               this.forecast.filter(it => {
//                 if (it.Value == 1) { it.disableField = false; }
//               });
//             }
//             if (closureDate <= extendedDate && this.ManualProbabilityWiningValue >= 75) {
//               this.forecast.filter(it => {
//                 if (it.Value == 2) { it.disableField = false; }
//               });
//             }
//           }

//           console.log('accordian', this.accordianContent);


//           this.forexValue(response.ResponseObject.EstimatedTCVvalue, response.ResponseObject.ACVvalue, response.ResponseObject.TransactionCurrencyId);
//         }
//         else {

//         }
//       }
//       else {
//         this.projectService.displayMessageerror(response.Message);
//       }
//       this.service.loaderhome = false;
//     },
//       err => {
//         this.service.loaderhome = false;
//         this.projectService.displayerror(err.status);
//       }
//     );


//   }

//   activityDetails = [];

//   activityData() {

//     let obj = { "Guid": this.projectService.getSession('opportunityId') }
//     this.service.loaderhome = true;
//     this.projectService.activityData(obj).subscribe(response => {

//       if (!response.IsError) {

//         if (response.ResponseObject && (Array.isArray(response.ResponseObject) ? response.ResponseObject.length > 0 : false)) {
//           this.accordianContent = this.accordianContent.map((it) => {
//             {
//               if (it.title == 'Linked activities & leads') {
//                 it.content[0].subContent = []
//                 for (var i = 0; i < response.ResponseObject.length; i++) {
//                   this.activityDetails = it.content[0].subContent.push({
//                     'accountName': 'Reimagine singtel procurement process',
//                     //  'account': 'Cust Mtg - Lead development',
//                     'account': '',
//                     'name': response.ResponseObject[i].SubjectName,
//                     AppointmentOpportunityId: response.ResponseObject[i].AppointmentOpportunityId,
//                     ActivityId: response.ResponseObject[i].ActivityId

//                   })
//                 }
//               }

//             }
//             return it
//           })
//         }
//         else {

//         }

//       }
//       else {
//         this.projectService.displayMessageerror(response.Message);
//       }
//       this.service.loaderhome = false;
//     },
//       err => {
//         this.service.loaderhome = false;
//         this.projectService.displayerror(err.status);
//       }
//     );


//   }
//   leadDetail = [];
//   leadData() {
//     let obj = { "Guid": this.projectService.getSession('opportunityId') }
//     this.service.loaderhome = true;
//     this.projectService.leadData(obj).subscribe(response => {


//       if (!response.IsError) {

//         if (response.ResponseObject && (Array.isArray(response.ResponseObject) ? response.ResponseObject.length > 0 : false)) {

//           this.accordianContent = this.accordianContent.map((it) => {

//             {
//               if (it.title == 'Linked activities & leads') {

//                 it.content[1].subContent = []
//                 for (var i = 0; i < response.ResponseObject.length; i++) {
//                   this.leadDetail = it.content[1].subContent.push({
//                     'accountName': 'Lead name',
//                     'name': response.ResponseObject[i].Title,
//                     "LeadGuid": response.ResponseObject[i].Guid,
//                     "mapGuid": response.ResponseObject[i].MapGuid

//                   })
//                 }
//               }

//             }
//             return it
//           })
//         }
//         else {

//         }

//       }
//       else {
//         this.projectService.displayMessageerror(response.Message);
//       }
//       this.service.loaderhome = false;
//     },
//       err => {
//         this.service.loaderhome = false;
//         this.projectService.displayerror(err.status);
//       }
//     );


//   }
//   forexValue(tcv, acv, currencyId) {
//     if (currencyId) {
//       let body = { "Guid": currencyId }
//       this.service.loaderhome = true;
//       this.projectService.forexValue(body).subscribe(response => {
//         //  response.ResponseObject.Name
//         if (!response.IsError) {

//           if (response.ResponseObject && (Array.isArray(response.ResponseObject) ? response.ResponseObject.length > 0 : false) && (response.ResponseObject.Name || response.ResponseObject.Name == 0)) {
//             this.accordianContent = this.accordianContent.map((it) => {
//               {
//                 if (it.title == 'Profile') {

//                   it.content[12].content = tcv * response.ResponseObject.Name;
//                   it.content[13].content = acv * response.ResponseObject.Name;
//                 }

//               }
//               return it
//             })
//           }
//           else {

//           }

//         }
//         else {
//           this.projectService.displayMessageerror(response.Message);
//         }
//         this.service.loaderhome = false;
//       },
//         err => {
//           this.service.loaderhome = false;
//           this.projectService.displayerror(err.status);
//         }
//       );
//     }
//   }

//   goBack() {
//     this.router.navigate(['/order/orderdetails/overview']);
//     this.projectService.ProceedQualify = false;
//     this.projectService.setproceedtoQualifyChanges(false);

//   }
//  cancelstepbtn() {
//     if (this.projectService.count > 0) {
//       this.projectService.count = this.projectService.count - 1;
//     }
//   }


}
