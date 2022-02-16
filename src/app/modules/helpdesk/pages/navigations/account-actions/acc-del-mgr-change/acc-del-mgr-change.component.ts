import { Component, OnInit } from '@angular/core';
import { DataCommunicationService } from '@app/core';
import { MatDialog } from '@angular/material/';

@Component({
  selector: 'app-acc-del-mgr-change',
  templateUrl: './acc-del-mgr-change.component.html',
  styleUrls: ['./acc-del-mgr-change.component.scss']
})
export class AccDelMgrChangeComponent implements OnInit {

  companyentity1;
  practice;
  ViewDetailsContent: Boolean =false;
  ManualContent:Boolean=true;
  tableCount=30;
  showtable:boolean = false;
  userArray = [
    {"index":1,"Accountnumber": "ACC039235345", "Accountname": "Ringo Steels", "Accountowner": "Murali RN", "Accountdeliverymanager": "Arpita" }

  ];
   headernonsticky1 = [{ name: "Accountnumber",title:"Account number" },
    { name: "Accountname",title:"Account name" },
    { name: "Accountowner",title:"Account owner" },
    { name: "Accountdeliverymanager",title:"Account delivery manager" }
    ];
  constructor(public service: DataCommunicationService,public dialog: MatDialog,) { }

  ngOnInit() {
  }
  selected = 'Orders';
  openmangrchnage(): void {
    const dialogRef = this.dialog.open(managerchangecomponent, {
      width: '400px',
    });
  }

  goback(){
    this.service.hidehelpdesknav = true;
    this.service.hidehelpdeskmain = false;
  }
}
@Component({
  selector: 'app-managerChnage-pop',
  templateUrl: './mangerchange-pop.html',
  styleUrls: ['./acc-del-mgr-change.component.scss']

})
export class managerchangecomponent  {
 
  constructor() { }
}
