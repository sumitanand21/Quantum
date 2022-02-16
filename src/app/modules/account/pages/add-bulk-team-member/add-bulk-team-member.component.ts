import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { DataCommunicationService } from '@app/core';

@Component({
  selector: 'app-add-bulk-team-member',
  templateUrl: './add-bulk-team-member.component.html',
  styleUrls: ['./add-bulk-team-member.component.scss']
})
export class AddBulkTeamMemberComponent implements OnInit {
  submitted;
  accOwnerSwap;
  table_data: any;
  secondareatext: string;
  firstareatext: string;
  isEdit: boolean;
  tempId: number;
  constructor(public location: Location, public userdat:DataCommunicationService) { }

  ngOnInit() {
   }


  /****************** State autocomplete code start ****************** */

  showContact4: boolean = false;
  contactName4: string = "";
  contactNameSwitch4: boolean = true;

  contactNameclose4() {
    this.contactNameSwitch4 = false;
  }
  appendcontact4(value: string, i) {
    this.contactName4 = value;
    this.selectedContact4.push(this.wiproContact4[i])
  }
  wiproContact4: {}[] = [

    { index: 0, contact: 'London', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ]

  selectedContact4: {}[] = [];

  /****************** State  autocomplete code end ****************** */

   /****************** State autocomplete code start ****************** */

   showContact: boolean = false;
   contactName: string = "";
   contactNameSwitch: boolean = true;
 
   contactNameclose() {
     this.contactNameSwitch = false;
   }
   appendcontact(value: string, i) {
     this.contactName = value;
     this.selectedContact.push(this.wiproContact[i])
   }
   wiproContact: {}[] = [
 
     { index: 0, contact: 'New Delhi', designation: 'Pre Sales Head', initials: 'AJ', value: true },
     { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
     { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
     { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
   ]
 
   selectedContact: {}[] = [];
 
   /****************** State  autocomplete code end ****************** */
   goBack()
   {
     this.location.back();
   }
  
}
