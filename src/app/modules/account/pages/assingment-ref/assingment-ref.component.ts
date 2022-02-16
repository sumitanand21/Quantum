import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/core/services/account.service';
import {MatDialog} from '@angular/material';
import { SearchAccountPopupComponent } from '@app/shared/modals/search-account-popup/search-account-popup.component';
import { DataCommunicationService } from '@app/core';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
@Component({
  selector: 'app-assig-account-creation',
  templateUrl: './assingment-ref.component.html',
  styleUrls: ['./assingment-ref.component.scss']
})
export class AssignmentRef implements OnInit {

  constructor(public service:AccountService, public dialog:MatDialog,public userdat: DataCommunicationService) { }

  ngOnInit() {
  }
  activerequest:boolean;
  creationhistory:boolean;
  activerequest1()
  {
    this.activerequest=true;
    this.creationhistory=false;
  }
  creationhistory1()
    {
      this.activerequest=false;
      this.creationhistory=true;
    }
    // openaccountsearch()
    // {
    //   const dialogRef = this.dialog.open(SearchAccountPopupComponent,
    //     {
    //       width:'380px',
    //       data: { openDnB: false }
    //     }
    //     );
    // }

    Accountlookupdata = {
      tabledata: [
        {  AccountName:'Alphabet.usa',Number:'AC8090219392',Vertical:'Technology',Type:'Existing',Owner:'Anubhav Jain',Region:'USA' },
        {  AccountName:'Alibaba.india',Number:'AC8090219392',Vertical:'Technology',Type:'Prospect',Owner:'Rahul Dudeja',Region:'India' },
        {  AccountName:'Amazon.usa',Number:'AC8090219392',Vertical:'Technology',Type:'Hunting',Owner:'Rahul  Jain',Region:'USA' },
        {  AccountName:'Apple.india',Number:'AC8090219392',Vertical:'MFG',Type:'Prospect',Owner:'Ravu Kumar',Region:'USA' },
        {  AccountName:'Alibaba.china',Number:'AC8090219392',Vertical:'Technology',Type:'Hunting',Owner:'Anubhav Jain',Region:'China' },
        {  AccountName:'Google.usa',Number:'AC8090219392',Vertical:'Technology',Type:'Existing',Owner:'Anubhav Jain',Region:'USA' },
        {  AccountName:'Tesla.usa',Number:'AC8090219392',Vertical:'Technology',Type:'Hunting',Owner:'Anubhav Jain',Region:'USA' },
        {  AccountName:'Alphabet.india',Number:'AC8090219392',Vertical:'Technology',Type:'Existing',Owner:'Anubhav Jain',Region:'India' },
        {  AccountName:'Alphabet.usa',Number:'AC8090219392',Vertical:'Technology',Type:'Hunting',Owner:'Anubhav Jain',Region:'USA' }
      ],
      recordCount: 10,
      headerdata: [ 
         { name: 'AccountName', title: 'Account name' },
         { name: 'Number', title: 'Number' },
         { name: 'Vertical', title: 'Vertical' },
         { name: 'Type', title: 'Type' },
         { name: 'Owner', title: 'Owner' },
         { name: 'Region', title: 'Region' },
        
        ],
      Isadvancesearchtabs: true,
      controlName: '',
      lookupName: 'Account name',
      isCheckboxRequired: false,
      inputValue: '',
      TotalRecordCount: 0,
      selectedRecord: [],
      isLoader: false,
      nextLink: '',
      IsCustom:true,
      DbNotRequired:true
    };
  
    openeSharedAdvanceLookupPopup(){
      const dialogRef = this.dialog.open(AdvancelookuptabsComponent,{
        disableClose:true,
        width: '952px',
        data: this.Accountlookupdata
      });
      dialogRef.componentInstance.modelEmiter.subscribe((x) => {
         
  
        this.Accountlookupdata.tabledata = [
          {  AccountName:'Alphabet.usa',Number:'AC8090219392',Vertical:'Technology',Type:'Existing',Owner:'Anubhav Jain',Region:'USA' },
          {  AccountName:'Alibaba.india',Number:'AC8090219392',Vertical:'Technology',Type:'Prospect',Owner:'Rahul Dudeja',Region:'India' },
          {  AccountName:'Amazon.usa',Number:'AC8090219392',Vertical:'Technology',Type:'Hunting',Owner:'Rahul  Jain',Region:'USA' },
          {  AccountName:'Apple.india',Number:'AC8090219392',Vertical:'MFG',Type:'Prospect',Owner:'Ravu Kumar',Region:'USA' },
          {  AccountName:'Alibaba.china',Number:'AC8090219392',Vertical:'Technology',Type:'Hunting',Owner:'Anubhav Jain',Region:'China' },
          {  AccountName:'Google.usa',Number:'AC8090219392',Vertical:'Technology',Type:'Existing',Owner:'Anubhav Jain',Region:'USA' },
          {  AccountName:'Tesla.usa',Number:'AC8090219392',Vertical:'Technology',Type:'Hunting',Owner:'Anubhav Jain',Region:'USA' },
          {  AccountName:'Alphabet.india',Number:'AC8090219392',Vertical:'Technology',Type:'Existing',Owner:'Anubhav Jain',Region:'India' },
          {  AccountName:'Alphabet.usa',Number:'AC8090219392',Vertical:'Technology',Type:'Hunting',Owner:'Anubhav Jain',Region:'USA' }
        ]
  
      })
  
   
    
    }
}
