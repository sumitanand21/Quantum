import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'app-initiatestaffing',
  templateUrl: './initiatestaffing.component.html',
  styleUrls: ['./initiatestaffing.component.scss']
})
export class InitiatestaffingComponent implements OnInit {

  constructor( public dialog: MatDialog,public dialogRef: MatDialogRef<InitiatestaffingComponent>) { }
dataInfo:any;
  ngOnInit() {
    console.log(this.dataInfo,"data")
  }

  // staffinitiated1() {
  //   this.dialog.closeAll(); 
  // }

  onNoClick(): void {
    this.dialogRef.close({name:"adc"});
  }

}

@Component({
  selector: 'staff-initiated',
  templateUrl: './staff-initiated.html',
  styleUrls: ['./initiatestaffing.component.scss']
})
export class StaffInitiatedPopup implements OnInit {
 
  constructor(public dialogRef: MatDialogRef<StaffInitiatedPopup>) { }  
  ngOnInit() {
  }
  // onNoClick(): void {
  //   this.dialogRef.close();
  // }
}
