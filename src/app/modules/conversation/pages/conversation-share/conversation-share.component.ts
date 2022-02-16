import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ElementRef, ViewChild } from '@angular/core';
import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataCommunicationService, ConversationService, threadListService, ErrorMessage } from '@app/core';
import { Router } from '@angular/router';
import { RoutingState } from '@app/core/services/navigation.service';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { removeSpaces } from '@app/shared/pipes/white-space.validator';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
@Component({
  selector: 'app-conversation-share',
  templateUrl: './conversation-share.component.html',
  styleUrls: ['./conversation-share.component.scss']
})
export class ConversationShareComponent implements OnInit, OnDestroy {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  values = ''
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filterednames: Observable<string[]>;
  names: any = [];
  namesCC: any = [];
  selectToInMail: Observable<any>;
  selectToCCInMail: Observable<any>;
  eventTitle: any = "";
  getSharedEmail: any;
  convresationName: any;
  getEmailSubject: any;
  clock: Observable<any>;
  wiproSysGuidTo: any;
  wiproSysGuidCC: any;
  toValue: string;
  maimArray: any = [];
  maimArray1: any = [];
  wiproObjct: any;
  wiproObjct1: any
  wiproObjct2: any;
  wiproObjct3: any;
  parentId: any;
  descriptionEdit: any;
  nameCtrlDisabled: boolean = false;
  nameCtrlCCDisabled: boolean = false;
  subjectDisabled: boolean = false;
  descriptionDisabled: boolean = false;
  attachments: any;
  emailForm: FormGroup;
  isDisabled: boolean = false;
  descriptions: any;
  isDescription: boolean = false;
  craetedOn: any;
  userId: any;
  isLoading: boolean = false;
  createdDatesOn: any;
  MOM: any;
  @ViewChild('nameInput') nameInput: ElementRef<HTMLInputElement>;
  @ViewChild('nameInputCC') nameInputCC: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('auto1') matAutocomplete1: MatAutocomplete;
  meetingGuid: any;
  constructor(public service: DataCommunicationService,
    private conversationService: ConversationService,
    private fb: FormBuilder,
    public matSnackBar: MatSnackBar,
    private router: Router,
    private routingState: RoutingState,
    private EncrDecr: EncrDecrService,
    public datepipe: DatePipe,
    private PopUp: ErrorMessage,
    public dialog: MatDialog,
  ) { }
  ngOnInit() {
    this.userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
    this.convresationName = (sessionStorage.getItem('ActivityGroupName'));
    this.getSharedEmail = JSON.parse(sessionStorage.getItem('shareConversation'));
    this.EmailForm();
    this.shareConversation();
  }
  descriptionNull: boolean = false;
  EmailForm() {
    this.emailForm = this.fb.group({
      nameCtrl: [{ value: '', disabled: this.nameCtrlDisabled }, [Validators.required]],
      nameCtrlCC: [{ value: '', disabled: this.nameCtrlCCDisabled }],
      subject: ['', Validators.compose([Validators.required, removeSpaces])],
      description: ['', Validators.compose([Validators.required, removeSpaces])]
    })
  }
  shareConversation() {
    this.attachments = this.getSharedEmail.Attachments;
    this.getEmailSubject = this.getSharedEmail.Agenda;
    this.craetedOn = this.getSharedEmail.DateCreated;
    this.MOM = (this.getSharedEmail.MOM) ? this.getSharedEmail.MOM : '';
    console.log("childs data from session", this.getSharedEmail);
    if (this.getSharedEmail.WiproAttendeesGuid.length > 0) {
      this.getSharedEmail.WiproAttendeesGuid.forEach(element => {
        var toBoject = { "systemuserId": element.SysGuid, "participationtypemask": "2", "contactId": "" }
        this.names.push(element.FullName);
        this.maimArray.push(toBoject);
      });
    }
    // if (this.getSharedEmail.CustomerContactsGuid.length > 0) {
    //   this.getSharedEmail.CustomerContactsGuid.forEach(element => {
    //     var toBoject1 = { "systemuserId": "", "participationtypemask": "3", "contactId": element.Guid }
    //     this.maimArray1.push(toBoject1);
    //     this.namesCC.push(element.FullName)
    //   })
    // }
    // if (this.getSharedEmail.TagUserToViewGuid.length > 0) {
    //   this.getSharedEmail.TagUserToViewGuid.forEach(element => {
    //     var toBoject1 = { "systemuserId": element.SysGuid, "participationtypemask": "3", "contactId": "" }
    //     this.maimArray.push(toBoject1)
    //     this.namesCC.push(element.FullName)
    //   })
    // }
    if (this.getSharedEmail) {
      this.emailForm.controls['subject'].patchValue("MOM for" + " " + this.getSharedEmail.Agenda)
    }
    this.createdDatesOn = this.datepipe.transform(this.craetedOn,'d-MMM-y');
    this.description(this.createdDatesOn, this.getEmailSubject, this.names, this.namesCC, this.MOM)
    if (this.getSharedEmail) {
      this.emailForm.controls['description'].patchValue(this.eventTitle)
    }
  }

  description(createdDate, subject, to, cc, mom) {
    this.eventTitle = `Dear All, &#13;&#10; &#13;&#10;Please find below the minutes of the meeting held on ${(createdDate)} &#13;&#10;Agenda: ${subject}&#13;&#10;Date: ${(createdDate)}&#13;&#10;Customer Contact : ${(cc)}&#13;&#10;Wipro Attendees: ${(to)}&#13;&#10;Meeting MOM : ${(mom)}&#13;&#10;`;
  }
  navTo2To() {
    if (JSON.parse(sessionStorage.getItem('shareConversation'))) {
      let data = JSON.parse(sessionStorage.getItem('shareConversation'))
      this.router.navigateByUrl(data.navigation)
    }
  }
  navTo() {
    const dialogRef = this.dialog.open(cancelpopComponent2, {
      width: '400px',
    });
  }
  get f() {
    return this.emailForm.controls
  }
  emailChange(value) {
    this.conversationService.getEmployeeNCustomerBothForEmail(value).subscribe(res => {
      if (res.IsError === false) {
        this.selectToInMail = res.ResponseObject
        console.log(this.selectToInMail)
      }
      if (res.IsError === true) {
        this.PopUp.throwError(res.Message)
      }
    })
  }
  check(event, val) {
    console.log(event)
    let text = val.replace(/[^a-zA-Z ]/g, "");
    this.isDescription = true;
    this.descriptions = text
    if (val.trim() === "") {
      this.descriptionNull = true;
    } else {
      this.descriptionNull = false;
    }
    console.log(text)
  }
  removeWhiteSpace(val) {
    var k = val.charCode;
    if (val.target.value.length === 0) {
      return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || (k >= 48 && k <= 57));
    } else {
      return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
    }
  }
  emailChangeCC(value) {
    this.conversationService.getEmployeeNCustomerBothForEmail(value).subscribe(res => {
      if (res.IsError === false) {
        this.selectToCCInMail = res.ResponseObject
        console.log(this.selectToInMail)
      }
      if (res.IsError === true) {
        this.PopUp.throwError(res.Message)
      }
    })
  }
  toSelect(value: any) {
    if (this.names.length === 0) {
      this.toErrorMessage = "A required field cannot be empty";
    } else {
      this.toErrorMessage = null;
    }
    if (value.IsWiproUser === true) {
      this.wiproObjct = {
        "systemuserId": value.SysGuid,
        "participationtypemask": "2",
        "contactId": ""
      }
      this.maimArray.push(this.wiproObjct);
    }
    if (value.IsWiproUser === false) {
      this.wiproObjct1 = {
        "systemuserId": "",
        "participationtypemask": "2",
        "contactId": value.SysGuid
      }
      this.maimArray.push(this.wiproObjct1);
    }
    this.description(this.createdDatesOn, this.getEmailSubject, this.names, this.namesCC, this.MOM)
  }
  ccSelect(value: any) {
    if (value.IsWiproUser === true) {
      this.wiproObjct2 = {
        "systemuserId": value.SysGuid,
        "participationtypemask": "3",
        "contactId": ""
      }
      this.maimArray1.push(this.wiproObjct2);
    }
    if (value.IsWiproUser === false) {
      this.wiproObjct3 = {
        "systemuserId": "",
        "participationtypemask": "3",
        "contactId": value.SysGuid
      }
      this.maimArray1.push(this.wiproObjct3);
    }
    this.description(this.createdDatesOn, this.getEmailSubject, this.names, this.namesCC, this.MOM)
  }
  toErrorMessage: string;
  deleteAttachment(item, i) {
    this.attachments = this.attachments.filter(x => x.Name !== item.Name)
    console.log(item);
  }
  sendMail() {
    var from = {}
    if (this.emailForm.valid === false) {
      this.service.validateAllFormFields(this.emailForm)
      this.isDisabled = false;
    }
    if (this.names.length === 0) {
      this.toErrorMessage = "A required field cannot be empty";
      this.isDisabled = false;
    } else {
      this.toErrorMessage = null;
    }
    if (this.names.length !== 0 && (this.emailForm.controls.subject.value !== '' || this.emailForm.controls.subject.value !== undefined) && (this.descriptions !== '' || this.descriptions !== undefined) && this.emailForm.controls.subject.valid && this.descriptionNull !== true) {
      this.meetingGuid = (this.getSharedEmail.SysGuid) ? this.getSharedEmail.SysGuid : ""
      if (this.maimArray.length >= 1) {
        from = { "systemuserId": this.userId, "participationtypemask": "1", "contactId": "" }
        this.maimArray.push(from)
        var mam = this.maimArray.concat(this.maimArray1)
        var sendObj = {
          "Guid": this.meetingGuid,
          "subject": this.emailForm.value.subject.trim(),
          "description": this.eventTitle.replace(/[^a-zA-Z ]/g, ""),
          "email_activity_parties": mam,
        }
        this.isLoading = true;
        this.isDisabled = true;
        this.conversationService.shareConversationToSend(sendObj).subscribe(res => {
          if (res.IsError === true) {
            this.maimArray.pop();
            this.isDisabled = false;
            this.PopUp.throwError(res.Message)
            this.isLoading = false;
          }
          if (res.IsError === false) {
            this.PopUp.throwError(res.Message)
            this.isLoading = false;
            this.isDisabled = true;
            setTimeout(() => {
              if (JSON.parse(sessionStorage.getItem('shareConversation'))) {
                let data = JSON.parse(sessionStorage.getItem('shareConversation'));
                this.router.navigateByUrl(data.navigation)
              }
            }, 1000)
          }
        }, error => {
          this.isLoading = false;
          this.isDisabled = false;
        })
      }
    }
  }
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
      this.emailForm.patchValue({ nameCtrl: null });
    }
    this.description(this.createdDatesOn, this.getEmailSubject, this.names, this.namesCC, this.MOM)
  }
  remove(name: string): void {
    const index = this.names.indexOf(name);
    if (index >= 0) {
      this.names.splice(index, 1);
      this.maimArray.splice(index, 1);
      this.description(this.createdDatesOn, this.getEmailSubject, this.names, this.namesCC, this.MOM)
    }
  }
  addCC(event: MatChipInputEvent): void {
    if (!this.matAutocomplete1.isOpen) {
      const input = event.input;
      const value = event.value;
      if ((value || '').trim()) {
        this.namesCC.push(value.trim());
      }
      if (input) {
        input.value = '';
      }
      this.emailForm.patchValue({ nameCtrlCC: null });
    }
  }
  removeCC(name: string): void {
    const index = this.namesCC.indexOf(name);
    if (index >= 0) {
      this.namesCC.splice(index, 1);
      this.maimArray1.splice(index, 1);
      this.description(this.createdDatesOn, this.getEmailSubject, this.names, this.namesCC, this.MOM);
    }
  }
  selected(event: MatAutocompleteSelectedEvent): void {
    this.names.push(event.option.viewValue);
    this.nameInput.nativeElement.value = '';
    this.emailForm.patchValue({ nameCtrl: null });
  }
  selectedCC(event: MatAutocompleteSelectedEvent): void {
    this.namesCC.push(event.option.viewValue);
    this.nameInputCC.nativeElement.value = '';
    this.emailForm.patchValue({ nameCtrlCC: null });
  }
  ngOnDestroy() {
  }
}

@Component({
  selector: 'app-cancel-pop',
  templateUrl: './cancel-pop.html',
})
export class cancelpopComponent2 {
  constructor(
    public dialogRef: MatDialogRef<cancelpopComponent2>,
    public service: DataCommunicationService,
    private router: Router) { }
  noneditdetails() {
    if (JSON.parse(sessionStorage.getItem('shareConversation'))) {
      let data = JSON.parse(sessionStorage.getItem('shareConversation'));
      this.router.navigateByUrl(data.navigation)
    }
    this.dialogRef.close();
  }

}
