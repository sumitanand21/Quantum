import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ElementRef, ViewChild } from '@angular/core';
import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete } from '@angular/material';
import { MatChipsModule } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataCommunicationService, OrderService,OpportunitiesService } from '@app/core';
import { DomSanitizer } from '@angular/platform-browser'
import { Router } from '@angular/router';
import { PipeTransform, Pipe } from "@angular/core";
import { EncrDecrService } from '@app/core/services/encr-decr.service';


@Component({
  selector: 'app-emailhistory',
  templateUrl: './emailhistory.component.html',
  styleUrls: ['./emailhistory.component.scss']
})
 // @Pipe({ name: 'safeHtml'})

export class EmailhistoryComponent implements OnInit {
  more_clicked;
  visible = true;
  selectable = true;
  removable = true;
  emailMessage;
  Regardingowner;
  RegardingDue;
  ccEmail=[];
  toEmail=[];
  emailCCTable=[];
  emailtoTable=[];
  RegardingPriority;
  emailCC;
  emailTO;
  messageemail;
  emailSubject;
  SubjectID;
  Regardingemail;
  emailTolist;
  userId:any;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  nameCtrl = new FormControl();
  nameCtrlCC = new FormControl();
  filterednames: Observable<string[]>;
  names: string[] = ['Kinshuk Bose'];
  namesCC: string[] = ['Pradeep Kumar'];
  allnames: string[] = ['Albert (Digital)', 'Sumit (Digital)', 'Rohan(AMG)', 'Raj Bose(Digital)'];

  emailDetails // : Object;
  @ViewChild('nameInput') nameInput: ElementRef<HTMLInputElement>;
  @ViewChild('nameInputCC') nameInputCC: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('auto1') matAutocomplete1: MatAutocomplete;

  constructor(public service: DataCommunicationService,public router: Router,private EncrDecr: EncrDecrService,private sanitized: DomSanitizer,public orderService : OrderService, private opportunityService : OpportunitiesService) {
    this.filterednames = this.nameCtrl.valueChanges.pipe(
      startWith(null),
      map((name: string | null) => name ? this._filter(name) : this.allnames.slice()));
  }
  // transform(value) {
  //   return this.sanitized.bypassSecurityTrustHtml(value);
  // }

  add(event: MatChipInputEvent): void {

    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;
      if ((value || '').trim()) {
        this.names.push(value.trim());
      }

      if (input) {
        input.value = '';
      }

      this.nameCtrl.setValue(null);
    }
  }

  remove(name: string): void {
    const index = this.names.indexOf(name);

    if (index >= 0) {
      this.names.splice(index, 1);
    }
  }

  addCC(event: MatChipInputEvent): void {

    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;
      if ((value || '').trim()) {
        this.namesCC.push(value.trim());
      }

      if (input) {
        input.value = '';
      }

      this.nameCtrl.setValue(null);
    }
  }
  removeCC(name: string): void {
    const index = this.namesCC.indexOf(name);

    if (index >= 0) {
      this.namesCC.splice(index, 1);
    }
  }
  selected(event: MatAutocompleteSelectedEvent): void {
    this.names.push(event.option.viewValue);
    this.nameInput.nativeElement.value = '';
    this.nameCtrl.setValue(null);
  }

  selectedCC(event: MatAutocompleteSelectedEvent): void {
    this.namesCC.push(event.option.viewValue);
    this.nameInputCC.nativeElement.value = '';
    this.nameCtrlCC.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allnames.filter(name => name.toLowerCase().indexOf(filterValue) === 0);
  }
  ngOnInit() {

    this.emailDetails = this.opportunityService.getSession('emaildetails');
    debugger;
    this.emailSubject = unescape(JSON.parse('"' + this.emailDetails.Subject + '"')).replace(/\+/g, ' ');
    //let emailsFinal = this.emailSubject;
    debugger;
    console.log(this.emailDetails,"emails");
    this.userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')

    debugger;
    console.log("this.emailDetails",this.emailDetails);
    debugger;
    this.getViewEmailhistory();



  }
  getViewEmailhistory(){
   
    let jsonObj = {
      "ActivityId": this.emailDetails.ActivityId,
     //"SubjectID": this.emailDetails.Subject

      
   
    }
     debugger;
    console.log("getEmail",jsonObj);

    this.orderService.getViewEmailhistory(jsonObj).subscribe(res => {
        this.ccEmail = [];
        this.emailCCTable =  res.ResponseObject[0].emailDetails.CcList;
        console.log(this.emailCCTable,"name1");
          this.emailCCTable.map(data=>{
          this.ccEmail.push(data.Name)
         })
      console.log(this.ccEmail,"name");
      this.emailCC=this.ccEmail.toString();

      this.toEmail = [];
      this.emailtoTable =  res.ResponseObject[0].emailDetails.ToList;
      console.log(this.emailtoTable,"name1");
        this.emailtoTable.map(data=>{
        this.toEmail.push(data.Name)
       })
    console.log(this.toEmail,"name");
    this.emailTolist=this.toEmail.toString();



  debugger;
    this.emailMessage =  (res.ResponseObject[0].emailDetails.Message.replace(/&nbsp;/g, ''));
    console.log("newone", (res.ResponseObject[0].emailDetails.Message.replace(/&nbsp;/g, '')));
   // this.messageemail = this.emailMessage;

    debugger;
   // this.emailSubject = res.ResponseObject[0].emailDetails.CcList[0].Name;
   // this.emailCC = res.ResponseObject[0].emailDetails.CcList[0].Name;
   // this.emailTolist = res.ResponseObject[0].emailDetails.ToList[0].Name;
    this.Regardingemail = res.ResponseObject[0].emailDetails.Regarding;
    this.Regardingowner = res.ResponseObject[0].emailDetails.Owner;
    this.RegardingDue = res.ResponseObject[0].emailDetails.Due;
    this.RegardingPriority = res.ResponseObject[0].emailDetails.EmailPriority;
    console.log(res.ResponseObject[0].emailDetails,"result")
    console.log(res.ResponseObject[0].emailDetails.ToList[0].Name,"result1")
   debugger;
    }
    )
  }

  goBack() {
    this.router.navigate(['/opportunity/orderactions/emaillandingpage'])
  }
  // goBack() {
  //   window.history.back();
  // }
 
}

