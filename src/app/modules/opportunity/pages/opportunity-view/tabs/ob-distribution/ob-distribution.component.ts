import { Component, OnInit, EventEmitter } from '@angular/core';
import { DataCommunicationService } from '@app/core/services/global.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/';
import { Router } from '@angular/router';
import { deleteIP1, deleteserviceLine1, Openciopopupcomponent, OpenTcvpopupcomponent } from '../business-solution/business-solution.component';

@Component({
  selector: 'app-ob-distribution',
  templateUrl: './ob-distribution.component.html',
  styleUrls: ['./ob-distribution.component.scss']
})
export class OBDistributionComponent implements OnInit {
  selectedAll: boolean;
  selectedAllip: boolean;
  selectedAllsol: boolean;
  selectedAllcredit: boolean;

  panelOpenState2: boolean = true;
  panelOpenState3: boolean = true;
  panelOpenState4: boolean = true;
  panelOpenState5: boolean = true;
  panelOpenState6: boolean = true;

  constructor(public dialog: MatDialog, public service: DataCommunicationService) { }

  ngOnInit() {
  }
// SL BDM autocomplete starts here
 slbdmName: string = "";
 slbdmNameSwitch: boolean = true;

 slbdmNameclose(data) {
   
   data.slbdmNameSwitch = false;
 }
 appendslbdm(value: string, i,data) {
   
   data.slbdmName = value;
   this.selectedslbdm.push(this.wiproslbdm[i])
 }
 wiproslbdm: {}[] = [
   { index: 0, maintitle: 'BTS#7 - Digital factory', subtitle: 'Sathish R Theetha', value: true },
   { index: 1, maintitle: 'BTS#7 - Digital factory', subtitle: 'Sathish R Theetha', value: false },
   { index: 2, maintitle: 'Sales, Marketing and digital', subtitle: 'Sathish R Theetha', value: false },
   { index: 3, maintitle: 'BTS#7 - Digital factory', subtitle: 'Sathish R Theetha', value: false },
 ]

 selectedslbdm: {}[] = [];
// SL BDM autocomplete ends here

// IP autocomplete starts here
ipName: string = "";
ipNameSwitch: boolean = true;

ipNameclose(data) {
  
  data.ipNameSwitch = false;
}
appendip(value: string, i,data) {
  
  data.ipName = value;
  this.selectedip.push(this.wiproip[i])
}
wiproip: {}[] = [
  { index: 0, maintitle: 'IP1', subtitle: 'Sathish R Theetha', value: true },
  { index: 1, maintitle: 'IP2', subtitle: 'Sathish R Theetha', value: false },
  { index: 2, maintitle: 'IP3', subtitle: 'Sathish R Theetha', value: false },
  { index: 3, maintitle: 'IP4', subtitle: 'Sathish R Theetha', value: false },
]

selectedip: {}[] = [];
// IP autocomplete ends here

// Holmes BDM autocomplete starts here
HolmesBDMName: string = "";
HolmesBDNameSwitch: boolean = true;

HolmesBDMNameclose(data) {
  
  data.HolmesBDNameSwitch = false;
}
appendHolmesBDM(value: string, i,data) {
  
  data.HolmesBDMName = value;
  this.selectedHolmesBDM.push(this.wiproHolmesBDM[i])
}
wiproHolmesBDM: {}[] = [
  { index: 0, maintitle: 'IP1', subtitle: 'Sathish R Theetha', value: true },
  { index: 1, maintitle: 'IP2', subtitle: 'Sathish R Theetha', value: false },
  { index: 2, maintitle: 'IP3', subtitle: 'Sathish R Theetha', value: false },
  { index: 3, maintitle: 'IP4', subtitle: 'Sathish R Theetha', value: false },
]

selectedHolmesBDM: {}[] = [];
//Holmes BDM autocomplete ends here

// Module autocomplete starts here
moduleName: string = "";
moduleNameSwitch: boolean = true;

moduleNameclose(data) {
  
  data.moduleNameSwitch = false;
}
appendmodule(value: string, i,data) {
  
  data.moduleName = value;
  this.selectedmodule.push(this.wipromodule[i])
}
wipromodule: {}[] = [
  { index: 0, maintitle: 'Module 1', subtitle: 'Sathish R Theetha', value: true },
  { index: 1, maintitle: 'Module 2', subtitle: 'Sathish R Theetha', value: false },
  { index: 2, maintitle: 'Module 3', subtitle: 'Sathish R Theetha', value: false },
  { index: 3, maintitle: 'Module 4', subtitle: 'Sathish R Theetha', value: false },
]

selectedmodule: {}[] = [];
// Module autocomplete ends here

// slbdm2 autocomplete starts here
slbdm2Name: string = "";
slbdm2NameSwitch: boolean = true;

slbdm2Nameclose(data) {
  
  data.slbdm2NameSwitch = false;
}
appendslbdm2(value: string, i,data) {
  
  data.slbdm2Name = value;
  this.selectedslbdm2.push(this.wiproslbdm2[i])
}
wiproslbdm2: {}[] = [
  { index: 0, maintitle: 'SL BDM 1', subtitle: 'Sathish R Theetha', value: true },
  { index: 1, maintitle: 'SL BDM 2', subtitle: 'Sathish R Theetha', value: false },
  { index: 2, maintitle: 'SL BDM 3', subtitle: 'Sathish R Theetha', value: false },
  { index: 3, maintitle: 'SL BDM 4', subtitle: 'Sathish R Theetha', value: false },
]

selectedslbdm2: {}[] = [];
// slbdm2 autocomplete ends here


// name autocomplete starts here
nameName: string = "";
nameNameSwitch: boolean = true;

nameNameclose(data) {
  
  data.nameNameSwitch = false;
}
appendname(value: string, i,data) {
  
  data.nameName = value;
  this.selectedname.push(this.wiproname[i])
}
wiproname: {}[] = [
  { index: 0, maintitle: 'Name 1', subtitle: 'Sathish R Theetha', value: true },
  { index: 1, maintitle: 'Name 2', subtitle: 'Sathish R Theetha', value: false },
  { index: 2, maintitle: 'Name 3', subtitle: 'Sathish R Theetha', value: false },
  { index: 3, maintitle: 'Name 4', subtitle: 'Sathish R Theetha', value: false },
]

selectedname: {}[] = [];
// name autocomplete ends here

// OWNER autocomplete starts here
ownerName: string = "";
ownerNameSwitch: boolean = true;

ownerNameclose(data) {
  
  data.ownerNameSwitch = false;
}
appendowner(value: string, i,data) {
  
  data.ownerName = value;
  this.selectedowner.push(this.wiproowner[i])
}
wiproowner: {}[] = [
  { index: 0, maintitle: 'Owner 1', subtitle: 'Sathish R Theetha', value: true },
  { index: 1, maintitle: 'Owner 2', subtitle: 'Sathish R Theetha', value: false },
  { index: 2, maintitle: 'Owner 3', subtitle: 'Sathish R Theetha', value: false },
  { index: 3, maintitle: 'Owner 4', subtitle: 'Sathish R Theetha', value: false },
]

selectedowner: {}[] = [];
// OWNER autocomplete ends here

// SOLUTION BDM autocomplete starts here
solbdmName: string = "";
solbdmNameSwitch: boolean = true;

solbdmNameclose(data) {
  
  data.solbdmNameSwitch = false;
}
appendsolbdm(value: string, i,data) {
  
  data.solbdmName = value;
  this.selectedsolbdm.push(this.wiprosolbdm[i])
}
wiprosolbdm: {}[] = [
  { index: 0, maintitle: 'Solution BDM 1', subtitle: 'Sathish R Theetha', value: true },
  { index: 1, maintitle: 'Solution BDM 2', subtitle: 'Sathish R Theetha', value: false },
  { index: 2, maintitle: 'Solution BDM 3', subtitle: 'Sathish R Theetha', value: false },
  { index: 3, maintitle: 'Solution BDM 4', subtitle: 'Sathish R Theetha', value: false },
]

selectedsolbdm: {}[] = [];
// SOLUTION BDM autocomplete ends here

// BDM autocomplete starts here
bdmName: string = "";
bdmNameSwitch: boolean = true;

bdmNameclose(data) {
  
  data.bdmNameSwitch = false;
}
appendbdm(value: string, i,data) {
  
  data.bdmName = value;
  this.selectedbdm.push(this.wiprobdm[i])
}
wiprobdm: {}[] = [
  { index: 0, maintitle: 'BDM 1', subtitle: 'Sathish R Theetha', value: true },
  { index: 1, maintitle: 'BDM 2', subtitle: 'Sathish R Theetha', value: false },
  { index: 2, maintitle: 'BDM 3', subtitle: 'Sathish R Theetha', value: false },
  { index: 3, maintitle: 'BDM 4', subtitle: 'Sathish R Theetha', value: false },
]

selectedbdm: {}[] = [];
// BDM autocomplete ends here




  // service line tab starts here
  serviceline_data = [
    {
      "id": "1",
      "isCheccked": false
    },
    {
      "id": "2",
      "isCheccked": false
    },
    {
      "id": "3",
      "isCheccked": false
    },
  ]
  addserviceline() {
    this.serviceline_data.push(
      {
        "id": (this.serviceline_data.length + 1).toString(),
        "isCheccked": false
      }
    )
  }
  deleteserviceline(id) {
    this.serviceline_data = this.serviceline_data.filter(x => x.id != id)
  }
  selectAll() {

    
    for (var i = 0; i < this.serviceline_data.length; i++) {
      this.serviceline_data[i].isCheccked = this.selectedAll;
    }
  }
  checkIfAllSelected(index) {
    
    var count = 0;
    for (var i = 0; i < this.serviceline_data.length; i++) {
      if (this.serviceline_data[i].isCheccked == true) {
        count++;
      }
      if (this.serviceline_data.length == count) {
        this.selectedAll = true;
      }
      else {
        this.selectedAll = false;
      }
    }
  }
  // service line tab ends here

  // IP tab starts here
  ip_data = [
    {
      "id": "1",
      "isCheccked": false
    },
    {
      "id": "2",
      "isCheccked": false
    },
    {
      "id": "3",
      "isCheccked": false
    },
  ]
  addip() {
    this.ip_data.push(
      {
        "id": (this.ip_data.length + 1).toString(),
        "isCheccked": false
      }
    )
  }
  deleteip(id) {
    this.ip_data = this.ip_data.filter(x => x.id != id)
  }
  selectAllip() {

    
    for (var i = 0; i < this.ip_data.length; i++) {
      this.ip_data[i].isCheccked = this.selectedAllip;
    }
  }
  checkIfAllSelectedip(index) {
    
    var count = 0;
    for (var i = 0; i < this.ip_data.length; i++) {
      if (this.ip_data[i].isCheccked == true) {
        count++;
      }
      if (this.ip_data.length == count) {
        this.selectedAllip = true;
      }
      else {
        this.selectedAllip = false;
      }
    }
  }
  // IP tab ends here

  // solution tab starts here
  sol_data = [
    {
      "id": "1",
      "isCheccked": false
    },
    {
      "id": "2",
      "isCheccked": false
    },
    {
      "id": "3",
      "isCheccked": false
    },
  ]
  addsol() {
    this.sol_data.push(
      {
        "id": (this.sol_data.length + 1).toString(),
        "isCheccked": false
      }
    )
  }
  deletesol(id) {
    this.sol_data = this.sol_data.filter(x => x.id != id)
  }
  selectAllsol() {

    
    for (var i = 0; i < this.sol_data.length; i++) {
      this.sol_data[i].isCheccked = this.selectedAllsol;
    }
  }
  checkIfAllSelectedsol(index) {
    
    var count = 0;
    for (var i = 0; i < this.sol_data.length; i++) {
      if (this.sol_data[i].isCheccked == true) {
        count++;
      }
      if (this.sol_data.length == count) {
        this.selectedAllsol = true;
      }
      else {
        this.selectedAllsol = false;
      }
    }
  }
  // solution tab ends here

  // credit tab starts here
  credit_data = [
    {
      "id": "1",
      "isCheccked": false
    },
    {
      "id": "2",
      "isCheccked": false
    },
    {
      "id": "3",
      "isCheccked": false
    },
  ]
  addcredit() {
    this.credit_data.push(
      {
        "id": (this.credit_data.length + 1).toString(),
        "isCheccked": false
      }
    )
  }
  deletecredit(id) {
    this.credit_data = this.credit_data.filter(x => x.id != id)
  }
  selectAllcredit() {

    
    for (var i = 0; i < this.credit_data.length; i++) {
      this.credit_data[i].isCheccked = this.selectedAllcredit;
    }
  }
  checkIfAllSelectedcredit(index) {
    
    var count = 0;
    for (var i = 0; i < this.credit_data.length; i++) {
      if (this.credit_data[i].isCheccked == true) {
        count++;
      }
      if (this.credit_data.length == count) {
        this.selectedAllcredit = true;
      }
      else {
        this.selectedAllcredit = false;
      }
    }
  }
  // credit tab ends here
  opentcvpopup()
  {
    const dialogRef = this.dialog.open(OpenTcvpopupcomponent,
      {
        width: '900px'
      });
  }

  openciopopup()
  {
    const dialogRef = this.dialog.open(Openciopopupcomponent,
      {
        width: '350px'
      });
  }

  deletserline()
  {
    const dialogRef = this.dialog.open(deleteserviceLine1,
      {
        width: '350px'
      });
  }

  deleteippopup()
  {
    debugger;
    const dialogRef = this.dialog.open(deleteIP1,
      {
        width: '350px'
      });
  }

  // openbusinesssolution()
  // {
  //   const dialogRef = this.dialog.open(OpenBusinessSolution,
  //     {
  //       width: '850px'
  //     });
  // }
}