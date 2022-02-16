import { Component, OnInit,ElementRef } from '@angular/core';
// import { DataCommunicationService } from '@app/core';
import { DataCommunicationService } from '@app/core/services/global.service';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '@app/shared/services/validation.service';

@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.scss']
})
export class AddContractComponent implements OnInit {
accOwnerSwapForm: FormGroup;
submitted = false;
firstareatext: string;

  constructor(public accservive:DataCommunicationService, public el: ElementRef, private _fb: FormBuilder,
  public userdat: DataCommunicationService) { }
 
  ngOnInit() {
    this.accOwnerSwapForm = this._fb.group({
      vertical: [''],
      ContractSigned: [''],
      ContractRenewed: [''],
      ContractExpires: [''],
      wiproPitch: ['',],
      Benefits: [''],
    });
  }
    get accOwnerSwap() { return this.accOwnerSwapForm.controls; }

  createrelationshipplan(){

  }
  goBack(){
    
  }
    scrollTo(el: Element) {
    if(el) { 
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  
/****************** vertical autocomplete code start ****************** */

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

    { index: 0, contact: 'Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ]

  selectedContact: {}[] = [];

/****************** vertical autocomplete code end ****************** */
/****************** vertical autocomplete code start ****************** */

  showContact1: boolean = false;
  contactName1: string = "";
  contactNameSwitch1: boolean = true;

  contactNameclose1() {
    this.contactNameSwitch1 = false;
  }
  appendcontact1(value: string, i) {
    this.contactName1 = value;
    this.selectedContact1.push(this.wiproContact1[i])
  }
  wiproContact1: {}[] = [

    { index: 0, contact: 'Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ]

  selectedContact1: {}[] = [];

/****************** vertical autocomplete code end ****************** */
}
