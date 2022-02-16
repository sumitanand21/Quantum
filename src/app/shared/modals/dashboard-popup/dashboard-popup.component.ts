import { Component, OnInit ,Inject,HostListener} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDatepickerInputEvent,
} from '@angular/material';
@Component({
  selector: 'app-dashboard-popup',
  templateUrl: './dashboard-popup.component.html',
  styleUrls: ['./dashboard-popup.component.scss']
})
export class DashboardPopupComponent implements OnInit {
tablerow=[];
thead=[
    {rowspan1:'SAP customer code',rowspan2:'Account name',rowspan3:'Geo',
    colspan1:'Q1',Q1thead1:'TGT',Q1thead2:'ACH',
    colspan2:'Q2',Q2thead1:'TGT',Q2thead2:'ACH',
    colspan3:'Q3',Q3thead1:'TGT',Q3thead2:'ACH',
    colspan4:'Q4',Q4thead1:'TGT',Q4thead2:'ACH',
    colspanTotal:'Total',Totalthead1:'TGT',Totalthead2:'ACH',
    },
    ]
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DashboardPopupComponent>) { }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  generatateData(data)
  {
  
     
 this.tablerow.push({
       SAPaccount:data['GroupCustomerName'],
       Accountname:data['ACCOUNTNUMBER'],
       Geo:data['GEO'],
        Q1thead1:data['Q1'].TGT,
        Q1thead2:data['Q1'].ACH,
        Q2thead1:data['Q2'].TGT,
        Q2thead2:data['Q2'].ACH,
        Q3thead1:data['Q3'].TGT,
        Q3thead2:data['Q3'].ACH,
        Q4thead1:data['Q4'].TGT,
        Q4thead2:data['Q4'].ACH,
        Totalthead1:data['TOTAL'].TGT,
        Totalthead2:data['TOTAL'].ACH,
      })
     
     
        
    
  }
  
    
    //ConsolidatedPerfomanceDashboard
//   ACCOUNTNUMBER: "A001"
// EMPNO: "805366"
// GEO: "ZEUR"
// GroupCustomerName: "ABB"
// Q1: {TGT: 0, ACH: 0}
// Q2: {TGT: 0, ACH: 0}
// Q3: {TGT: 0, ACH: 0}
// Q4: {TGT: 0, ACH: 0}
// TOTAL: {TGT: 0, ACH: 0}
//SAPcustomercode: "CIS"
// SAPcustomername: "ABB"
// Username: "abbas ali"
  ngOnInit() {
    this.tablerow=[];
 this.generatateData(this.data.ConsolidatedPerfomanceDashboard)
  }

}
