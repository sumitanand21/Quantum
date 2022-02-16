import { Component, OnInit, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-order-rejection-selector',
  templateUrl: './order-rejection-selector.component.html',
  styleUrls: ['./order-rejection-selector.component.scss']
})
export class OrderRejectionSelectorComponent implements OnInit {
  @Input() expansionData;
  @Output() closeaction;
  constructor(public dialog:MatDialog) { }

  ngOnInit() {  
  }
  openclosepopup()
  {
    const dialogRef = this.dialog.open(ClosePopupOrder, {
      width: '350px'
  
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.closeaction.emit({ objectRowData: this.expansionData, action: "confirm" })
      }

    });
  }
  ngOnChanges()
  {
   // console.log(this.expansionData.performanceDetails);
   // this.performanceDetails = this.expansionData.performanceDetails;
  }

  performanceDetails=[
    {
      "quatername": "Q1",
      "quaterTGT":"0.25",
      "quaterACH":"0.11",
      "quaterFlag":false
    },
    {
      "quatername": "Q2",
      "quaterTGT":"0.25",
      "quaterACH":"0.11",
      "quaterFlag":false
    },
    {
      "quatername": "Q3",
      "quaterTGT":"0.25",
      "quaterACH":"0.11",
      "quaterFlag":false
    },
    {
      "quatername": "Q4",
      "quaterTGT":"0.25",
      "quaterACH":"0.30",
      "quaterFlag":true
    },
    {
      "quatername": "Total",
      "quaterTGT":"0.25",
      "quaterACH":"0.11",
      "quaterFlag":false
    }
  ]

}
@Component({
  selector: 'closepopup-pop',
  templateUrl: './closepopup.html',
})
export class ClosePopupOrder {
  constructor(public dialogRef: MatDialogRef<ClosePopupOrder>) {
  }
  onClose()
  {
    this.dialogRef.close('confirm');
  }
}