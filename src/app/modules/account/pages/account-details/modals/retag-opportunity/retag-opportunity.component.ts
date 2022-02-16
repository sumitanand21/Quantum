import { Component, OnInit,HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-retag-opportunity',
  templateUrl: './retag-opportunity.component.html',
  styleUrls: ['./retag-opportunity.component.scss']
})
export class RetagOpportunityComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<RetagOpportunityComponent>) { }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  ngOnInit() {
  }

  ownerSwitch:boolean;
  Owner:string;
  bulkChecked:boolean = false

  OwnerDetails = [

    { id:0,FullName:'Kinshuk Bose'},
    { id:1,FullName:'Rahul Jain'},
    { id:2,FullName:'Ravi Kumar'},
    { id:3,FullName:'Neeraj Rao'},
    { id:4,FullName:'Krishna Bose'}
  ];
  appendOwner(item){
    this.Owner = item.FullName;
  }
  retag(){
    this.bulkChecked = ! this.bulkChecked;
  }
}
