import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ConfirmProspectComponent } from './confirm-prospect/confirm-prospect.component';
import { AccountAccessIssueComponent } from '@app/shared/modals/account-access-issue/account-access-issue.component';
import { DataCommunicationService } from '@app/core';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';

@Component({
  selector: 'app-prospect-account-creation',
  templateUrl: './prospect-account-creation.component.html',
  styleUrls: ['./prospect-account-creation.component.scss']
})
export class ProspectAccountCreationComponent implements OnInit {

  constructor(public userdat: DataCommunicationService,public dialog: MatDialog,public fb:FormBuilder ) { }

  Prospectform:FormGroup;
  get PhoneNumber(): FormArray {
    return this.Prospectform.get('PhoneNumber') as FormArray;
  }


  ngOnInit(): void {
      
   this.Prospectform = this.fb.group({
  
          Name:['',Validators.required],
          Vertical:['',Validators.required],
          Country:['',Validators.required],
          CountrySubDivision :['',Validators.required],
          CityRegion:['',Validators.required],
          Region:[''],
          Geo:[''],
          OwnershipType:['',Validators.required],  
          Website : ['',Validators.required],
          Email:[],
          PhoneNumber: this.fb.array([this.phoneGroup()]),
          BusinessDescription:['default value']
  
   })
  
  }

  phoneGroup():FormGroup{
    return this.fb.group({
        ContactType:[''],
        ContactNo:['']
    })
  }
  
  addPhone(){
    this.PhoneNumber.push(this.phoneGroup());
  }
  
  deletePhone(i){
    if (i > 0) {
      this.PhoneNumber.removeAt(i);
    } else {
      return null;
    }
  }
  
  verticalData = [
  
    { Id: 0, Value: 'consumer' },
    { Id: 1, Value: 'MFG' },
    { Id: 2, Value: 'BFSI' },
    { Id: 3, Value: 'GIS' },
  ]

  
  CountryDivision = [
    { Id: 0, Value: 'Bangalore ' },
    { Id: 1, Value: 'Chennai' },
    { Id: 2, Value: 'Newyork' },
    { Id: 3, Value: 'Bejing' },

  ]

  City = [
    { Id: 0, Value: 'Bangalore ' },
    { Id: 1, Value: 'Chennai' },
    { Id: 2, Value: 'Newyork' },
    { Id: 3, Value: 'Bejing' },

  ]

  RegionData=[
    { Id: 0, Value: 'East' },
    { Id: 1, Value: 'West' },
    { Id: 2, Value: 'North' },
    { Id: 3, Value: 'South' },

  ]

  GeoData = [
    { Id: 0, Value: 'Geo' },
    { Id: 1, Value: 'Geo 1' },
    { Id: 2, Value: 'Geo 2' },
    { Id: 3, Value: 'Geo 3' },

  ]

  OwnershipData = [
    { Id: 0, Value: 'Public' },
    { Id: 1, Value: 'Private' },
    { Id: 2, Value: 'Mixed' },
    { Id: 3, Value: 'Fully owned' },

  ]
  
  
  
  CountrySwitch: boolean = false;
  Countryclose() {
    this.CountrySwitch = false;
  }
  companyNameCloseDc(){
    return 
  }

  openConfirmProspectPopup()
{
 const dialogRef = this.dialog.open(ConfirmProspectComponent,
   {
    disableClose: true ,
   
    width: '400px'
   });
}
  
  // /****************************************************** nov 30 popups */
  
  // // add cbu activate pop up
  // openAddCBUActivatePopup()
  // {
  //  const dialogRef = this.dialog.open(CBUActivateComponent,
  //    {
  //     width: '450px'
  //    });
  // }
  
  // // retag-opportunity
  
  // openRetagOpportunityPopup()
  // {
  //  const dialogRef = this.dialog.open(RetagOpportunityComponent,
  //    {
  //     width: '450px'
  //    });
  // }
  
  // // multiple reference view 
  
  // openMultipleReferencePopup()
  // {
  //  const dialogRef = this.dialog.open(MultipleReferenceViewComponent,
  //    {
  //     width: '400px'
  //    });
  //  }
  
  // // add secondary owner list 
  // AddOwnerPopup()
  // {
  //  const dialogRef = this.dialog.open(AddSecondaryOwnersComponent,
  //    {
  //     width: '400px'
  //    });
  // }
  
  // // open advance lookup pop up 
  
  // AdvanceLookupPopup(){
  //  const dialogRef = this.dialog.open(AdvanceLookupComponent,
  //    {
  //     width: '800px'
  //    });
  // }
  
  // dec 3 country code popup 
  countryvalue:string;
  showCountry:boolean;
  
  countrycode =  [
    {id:0 , country:'India'},
    {id:1 , country:'Germany'},
    {id:2 , country:'UK'},
    {id:3 , country:'USA'},
    {id:4 , country:'China'}
  ];
  
  showCountryClose(){
    this.showCountry = false;
  }
  
  appendCountry(item){
   this.Prospectform.patchValue({ Country: item.country })
  }
  
  // name auto complete start 
  accountName = [
    {id:0 , Name:'Walmart',Owner:'Rahul Jain',Number:'ACC000019049',Type:'Hunting'},
    {id:1 , Name:'Apple',Owner:'Anubhav Jain',Number:'ACC000029129',Type:'Hunting'},
    {id:2 , Name:'Apple.Inc',Owner:'Kanika Tuteja',Number:'ACC000015549',Type:'Hunting'},
    {id:3 , Name:'Quantum',Owner:'Praneeth Kumar',Number:'ACC000059049',Type:'Hunting'},
    {id:4 , Name:'AMG',Owner:'Ravi Kiran',Number:'ACC000019549',Type:'Hunting'}
  ]
  NameSwitch:boolean;
  Nameclose(){
    this.NameSwitch = false;
  }
  appendName(item){
    this.Prospectform.patchValue({ Name: item.Name })
  }

  
  lookupdata = {
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
    otherDbData: {
      countryvalue: [],
      isLoader: false,
    }
  };

  openadvancetabs(){
    const dialogRef = this.dialog.open(AdvancelookuptabsComponent,{
      disableClose:true,
      width: '952px',
      data: this.lookupdata
    });


    
    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
       

      this.lookupdata.tabledata = [
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
