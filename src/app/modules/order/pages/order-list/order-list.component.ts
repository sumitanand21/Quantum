import { Component, OnInit } from '@angular/core';
import { DataCommunicationService } from '@app/core';
import { AssignpopupComponent } from '../../modal/assignpopup/assignpopup.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  Competitortab = true;
  Teambuildingtab = false;
  Probabiltytab = false;
  dealtab = false;

  constructor(public service : DataCommunicationService,public dialog:MatDialog) { }

  ngOnInit() {
  }
  assignpopup(): void {
    const dialogRef = this.dialog.open(AssignpopupComponent, {
       width: '450px',
    });   
  }
  goBack() {
    window.history.back();
  }
  tabone() {
    this.Competitortab = true;
    this.Teambuildingtab = false;
    this.Probabiltytab = false;
    this.dealtab = false;
  }
  tabtwo() {
    this.Competitortab = false;
    this.Teambuildingtab = true;
    this.Probabiltytab = false;
    this.dealtab = false;
  }
  tabthree() {
    this.Competitortab = false;
    this.Teambuildingtab = false;
    this.Probabiltytab = true;
    this.dealtab = false;
  }
  tabfour(){
    this.Competitortab = false;
    this.Teambuildingtab = false;
    this.Probabiltytab = false;
    this.dealtab = true;

  }
  table_data = [
    {"label": "Document type", "text": "SOW" }, {"label": "Document upload date", "text": "23-Aug-20" },
    {"label": "Revenue accruable value", "text": "30,000,000" }, {"label": "Currency", "text": "USD" },
     {"label": "Initiate staffing request", "text": "Yes" }, {"label": "Reason for staffing request", "text": "Talent reservation" },
    {"label": "Opportunity ID", "text": "OP6218732" }, {"label": "Opportunity name", "text": "Reimagine Singtel Procurement Process" },
    {"label": "Account ID", "text": "AP8023917" },  {"label": "Account name", "text": "Apple.inc" },
    {"label": "Wipro contract entity", "text": "Wipro limited" },  {"label": "Account manager", "text": "Ruben Dey" },
    {"label": "Delivery manager", "text": "Sarthak Dutta" },  {"label": "Project manager", "text": "Joy Das" }, 
    {"label": "SBU name", "text": "Kinshuk Bose" },  {"label": "SBU code", "text": "SB8921" },
    {"label": "Delivery unit name", "text": "Technology" },  {"label": "Delivery unit code", "text": "DL809382" },
    {"label": "Vertical name", "text": "Technology" },  {"label": "Vertical code", "text": "VT7892732" },
    {"label": "Est. RLS ID", "text": "RLS328902" },  {"label": "Est. RLS name", "text": "Reimagine Singtel Procurement" },
    {"label": "RLS Version number", "text": "32" }, {"label": "RLS Baselined", "text": "??" },
    {"label": "Est. RLS type", "text": "??" }, {"label": "Revenue recognition types", "text": "T&M" },
    {"label": "Planned Start date", "text": "23-Aug-20" }, {"label": "Planned End date", "text": "23-Jan-21" },
    {"label": "Gross margin", "text": "$ 40,000,000 USD" }, {"label": "Opportunity TCV", "text": "$ 50,000,000 USD" }
  ]

  table_data1 = [
    {"label": "Order type", "text": "New" }, {"label": "SAP Customer code", "text": "Singtel.inc" },
    {"label": "Classification", "text": "NEW" }, {"label": "Start date", "text": "12-Dec-19" },
     {"label": "End date", "text": "12-Jul-20" }, {"label": "Contracting country", "text": "Austria" },
    {"label": "Vertical sales owner", "text": "Anubhav Jain" }, {"label": "Advisor", "text": "Ranjith Ravi" },
    {"label": "Currency", "text": "USD" },  {"label": "Opportunity name", "text": "Reimagine Singtel Procurement Process" },
    {"label": "Opportunity ID", "text": "OP6218732" }
  ]

 
}