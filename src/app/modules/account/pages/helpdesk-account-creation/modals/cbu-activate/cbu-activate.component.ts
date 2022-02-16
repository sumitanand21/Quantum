import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-cbu-activate',
  templateUrl: './cbu-activate.component.html',
  styleUrls: ['./cbu-activate.component.scss']
})
export class CBUActivateComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<CBUActivateComponent>) {
    
   }
  name: any;
  IsActivate:boolean = false;
  BuyerOrg : boolean
  cbudata: any;
 

  ngOnInit() {
  }
  isActivecbu(e)
  {
    this.IsActivate =e.checked
  }

  addcbu()
  {
    if(this.IsActivate)
    {
      this.BuyerOrg = true
    }
    else if(!this.IsActivate){
      this.BuyerOrg = false
    }
    this.name
    this.cbudata = {"LinkActionType":1,"Name":this.name,"IsActivate":this.IsActivate,'BuyerOrg':this.BuyerOrg}
    console.log("customerbusinessunit", this.name)
    this.dialogRef.close(this.cbudata)
    
  }


}
