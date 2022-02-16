import { Component, OnInit, Input, Output, } from '@angular/core';

@Component({

  selector: 'app-management-log-selector',

  templateUrl: './management-log-selector.component.html',

  styleUrls: ['./management-log-selector.component.scss']

})

export class ManagementLogSelectorComponent implements OnInit {

  @Input() tableName:any;

  @Input() expansionData:any;

  @Output() detectCommentActionValue;

  desp_cntnt:boolean=true;

  cmnts_cntnt:boolean;

  localPartentRef:boolean;

  width:number=window.innerWidth-80;

  optionArray: any[];

  overView=[]

  constructor() { }

  ngOnInit():void {

  console.log(this.expansionData);

  
  // var y = 80;

    // var x = window.innerWidth;

    this.overView=[];

   

    if(!this.expansionData.Participants)

    {

      this.expansionData.Participants=[];

    }

 

}

  showdesp_cntnt()

  {

    this.desp_cntnt = true;

    this.cmnts_cntnt = false;     

  }

  showcmnts_cntnt()

  {

    this.desp_cntnt = false;

    this.cmnts_cntnt = true;   

  }

  getInitials(string) {

    var names = string.split(' '),

    initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {

    initials += names[names.length - 1].substring(0, 1).toUpperCase();

    }

    return initials;

    }

  // selectedopportunity: {}[] = [

  //   { index: 0, contact: 'Kinshuk Bose (SE SPOC)', initials: 'KB', value: true },

  //   // { index: 1, contact: 'Jery Kannath', initials: 'JK', value: false },

  //   { index: 2, contact: 'Pradeep Kumar', initials: 'PK', value: false },

  //   { index: 3, contact: 'Raj Kumar', initials: 'RJ', value: false },

  // ]

 

  // selectepartcipant: {}[] = [

  //   { index: 0, contact: 'Somanath Ram (SE SPOC)', initials: 'SR', value: true },

  //   // { index: 1, contact: 'Jery Kannath', initials: 'JK', value: false },

  //   { index: 2, contact: 'Pradeep Kumar', initials: 'PK', value: false },

  //   { index: 3, contact: 'Sumeet Gupta', initials: 'SG', value: false },

  // ]

 

  // leftcomntsection: {}[] = [{

  //   id: 1,

  //   text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since 1990s',

  //   contact: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since 1990s',

  // },

  // {

  //   id: 2,

  //   text: 'Second column dta here Lorem Ipsum is simply dummy text of the printing and typesetting industry',

  //   contact: 'Data is second columns Lorem Ipsum has been the industry standard dummy text ever since the 1500s',

  // }];

 

}

