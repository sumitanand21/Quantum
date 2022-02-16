import { Component, OnInit, Inject, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataCommunicationService } from '@app/core/services/global.service';
import { ConversationService } from '@app/core/services/conversation.service';
import { MasterApiService } from '@app/core/services/master-api.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorMessage, ContactService } from '@app/core';
import { LoaderService } from '@app/core/services/loader.service';
import { removeSpaces, checkLimit, leadDecimalDealValue } from '@app/shared/pipes/white-space.validator';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';

@Component({
  selector: 'app-customerpopup',
  templateUrl: './customerpopup.component.html',
  styleUrls: ['./customerpopup.component.scss']
})
export class CustomerpopupComponent implements OnInit, OnDestroy {
  @ViewChild('accountlist')
  acc: ElementRef;
  busiesscardpop: boolean = false;
  img: boolean = true;
  isLoading: boolean = false;
  relationData;
  salutationData;
  relationType: any[];
  salutationType: any[];
  customerContactForm: FormGroup;
  contactObj: object = {};
  filesSelected: any;
  addDateArray: FormArray;
  urls = new Array<string>();
  inputImgVal: any;
  arrowkeyLocation = 0;
  companyName: string = '';
  contacts: {}[] = [];
  imageSrc: string = '';
  selectedAccountName = [];
  type: any;
  status: boolean = false
  leadRequestFlag: any;
  createLeadContactFlag: any;
  isProspect: boolean = false
  isAccountNameSearchLoading: boolean = false;
  disabled: boolean = false;
  savePopUpShow: any;
  enrichContactButtonDisabled: boolean = false;
  LeadCustomerAccountdata: any;
  categoryData: any;
  designationErrorMessage: any;
  ContactGuid: any;
  Module: any;
  TempCreateCustomerContactDetails: any;
  EmailChecksConatctGuild: any;
  salutationId: any;
  salutaionName: any;
  salutationTypeAria: any
  relationId: any;
  relationName: any;
  relationTypeAria: any
  categoryId: any;
  categoryName: any;
  categoryTypeAria: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public el: ElementRef,
    public dialog: MatDialog,
    public service: DataCommunicationService,
    public relationship: ConversationService,
    private masterApi: MasterApiService,
    public contactService: ContactService,
    public fb: FormBuilder,
    public router: Router,
    public matSnackBar: MatSnackBar,
    public loaderService: LoaderService,
    public errorMessage: ErrorMessage,
    public conversationService: ConversationService,
    private S3MasterApiService: S3MasterApiService,
    private dialogRef: MatDialogRef<CustomerpopupComponent>
  ) {
    this.createCustomerContactForm();
    this.getMasterAPI();
  }
  ngOnInit() {
    this.accountAutoPopulate();
    if (JSON.parse(sessionStorage.getItem("Module"))) {
      this.Module = JSON.parse(sessionStorage.getItem("Module"))
    }  
      this.S3MasterApiService.getdnbtoken('code').subscribe(res => {
        localStorage.setItem('dNBToken', res.ResponseObject.access_token)
      })
    this.imageSrc = null;
  }
  accountAutoPopulate() {
    if (this.data != '') {
      this.disabled = true;
      this.companyName = this.data['SysGuid'];
      this.isProspect = this.data['isProspect'];
      this.customerContactForm.patchValue({
        company: this.data['Name']
      })
    }
  }
  getSymbol(data) {
    return unescape(JSON.parse('"' + data + '"')).replace(/\?/g, '/');
  }
  showbusiesscard() {
    this.busiesscardpop = true;
  }
  hidebusiesscard() {
    this.dialogRef.close('');
  }
  createCustomerContactForm() {
    this.customerContactForm = this.fb.group({
      salutation: ['', Validators.required],
      fname: ['', Validators.compose([Validators.required, removeSpaces, checkLimit(101)])],
      lname: ['', Validators.compose([Validators.required, removeSpaces, checkLimit(101)])],
      email: ['', Validators.compose([Validators.required])],
      designation: ['', Validators.compose([Validators.required, removeSpaces, checkLimit(101), leadDecimalDealValue])],
      relationship: ['', Validators.required],
      company:new FormControl({ value: 'Select account name', disabled: true }),
      isKey: [false, Validators.required],
      category: ['', [Validators.required]],
      contacts: this.fb.array([this.addformArray()]),
    });
    this.customerContactForm.get('contacts').valueChanges.subscribe(res => {
      res.forEach(element => {
        if (element.ContactNo != "") {
          this.phoneValidation = false
        }
      });
    });
  }
  get f() {
    return this.customerContactForm.controls;
  }
  appendSalutationType(event) {
    console.log("appendSalutationType", event)
    if (!this.isEmpty(event)) {
      this.salutationId = event.value;
      this.salutationType.forEach(element => {
        if (element.Id == this.salutationId) {
          this.salutaionName = element.Value
          this.salutationTypeAria = this.salutaionName
        }
      })
    }
  }
  appendRelationshipType(event) {
    console.log("appendRelationshipType", event);
    if (!this.isEmpty(event)) {
      this.relationId = event.value;
      this.relationType.forEach(element => {
        if (element.Id == this.relationId) {
          this.relationName = element.Value
          this.relationTypeAria = this.relationName
        }
      });
    }
  }
  appendCategoryType(event) {
    console.log("appendCategoryType", event);
    if (!this.isEmpty(event)) {
      this.categoryId = event.value;
      this.categoryData.forEach(element => {
        if (element.Id == this.categoryId) {
          this.categoryName = element.Value
          this.categoryTypeAria = this.categoryName
        }
      });
    }
  }
  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }
  contactIndex = -1
  addContactss($event, valid, value) {
    this.contactIndex = this.contactIndex + 1
    if (this.customerContactForm.value.contacts.length >= 5) {
      this.errorMessage.throwError("Maximum 5 contact numbers can be added");
    } else {
      if (this.customerContactForm.value.contacts[this.customerContactForm.value.contacts.length - 1].ContactNo === "") {
        this.errorMessage.throwError("Enter phone number");
      } else {
        if (this.addDateArray.value.some(x => x.ContactNo.length < 8)) {
          this.errorMessage.throwError("Enter the phone number ");
        } else {
          $event.preventDefault();
          this.addDateArray.push(this.addformArray());
          this.customerContactForm;
        }
      }
    }
  }
  onkeypressMobile(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : (event.charCode == 43 || event.charCode == 45) || event.charCode >= 48 && event.charCode <= 57
  }
  addformArray() {
    return this.fb.group({
      ContactNo: [''],
      ContactType: ['']
    })
  }
  get getContacts() {
    return this.addDateArray = <FormArray>this.customerContactForm.get('contacts') as FormArray;
  }
  removeNumbers(event) {
    var k = event.charCode;
    if (k == 32 && event.target.value.length === 0) {
      if ((k > 47 && k < 58) || (k == 40 || k == 41 || (k > 64 && k < 91) || (k > 96 && k < 123) || k == 8)) {
        this.designationErrorMessage = null;
        return ((k > 47 && k < 58) || k == 40 || k == 41 || (k > 64 && k < 91) || (k > 96 && k < 123) || k == 8);
      } else {
        this.designationErrorMessage = "Special characters are not allowed";
      }
    } else if ((k > 47 && k < 58) || (k == 40 || k == 41 || (k > 64 && k < 91) || (k > 96 && k < 123) || k == 32)) {
      this.designationErrorMessage = null;
      return ((k > 47 && k < 58) || k == 40 || k == 41 || (k > 64 && k < 91) || (k > 96 && k < 123) || k == 32);
    } else {
      this.designationErrorMessage = "Special characters are not allowed";
    }
  }
  contactTypeChanges($event) {
    console.log('Value -->', $event.target.value)
    let contactType = $event.target.value
    if (contactType == '') {
      this.phoneValidation = false
      this.customerContactForm.setControl('contacts', this.fb.array([this.addformArray()] || []));
    }
  }
  deleteContact(i) {
    if (i > 0) {
      this.addDateArray.removeAt(i);
    } else {
      return null;
    }
  }
  getMasterAPI() {
    this.masterApi.getContactType().subscribe(res => {
      this.type = res.ResponseObject;
    })
    this.masterApi.getRelationship().subscribe(res => {
      this.relationType = res.ResponseObject;
    });
    this.masterApi.getSalutation().subscribe(res => {
      this.salutationType = res.ResponseObject;
    });
    this.masterApi.getCategory().subscribe(res => {
      if (res.IsError === false) {
        this.categoryData = res.ResponseObject;
        this.categoryData = res.ResponseObject.map(x => x = { ...x, Value: this.getSymbol(x.Value) });;
      }
    });
  }
  emailValidationChecksOnSave() {
    var emailValue = this.customerContactForm.value.email
    if (this.customerContactForm.valid) {
      this.contactService.getEmailValidation(true, emailValue, "").subscribe(res => {
        if (res.IsError === false) {
          if (res.ResponseObject.isExists === true) {
            this.EmailChecksConatctGuild = res.ResponseObject.Guid
            localStorage.setItem("contactEditId", JSON.stringify(this.EmailChecksConatctGuild))
            this.openduplicatepop();
          } else {
            this.isLoading = true;
            this.status = true;
            this.onSave();
          }
        } else {
          this.status = false;
          this.isLoading = false;
          this.errorMessage.throwError(res.IsError)
        }
      })
    } else {
      this.service.validateAllFormFields(this.customerContactForm)
      let invalidElements = this.el.nativeElement.querySelectorAll('#validatescroll .ng-invalid');
      if (invalidElements.length) {
        this.scrollTo(invalidElements[0]);
        this.service.validationErrorMessage();
      }
      return;
    }
  }
  phoneValidation: boolean = false;
  onSave() {
    this.customerContactForm.value.contacts.forEach(element => {
      if (element.ContactType != "" && element.ContactNo == "") {
        this.phoneValidation = true;
      } else {
        this.phoneValidation = false;
      }
    })
    if (this.customerContactForm.valid && this.phoneValidation == false) {
      this.contactObj = {
        "BusinessCardImage": this.imageSrc != undefined ? this.imageSrc : "",
        "Salutation": { "Value": this.customerContactForm.controls.salutation.value },
        "FName": this.customerContactForm.controls.fname.value,
        "LName": this.customerContactForm.controls.lname.value,
        "Email": this.customerContactForm.controls.email.value,
        "Designation": this.customerContactForm.controls.designation.value,
        "Relationship": { "Id": this.customerContactForm.controls.relationship.value },
        "Account": { "SysGuid": this.companyName, "isProspect": this.isProspect },
        "isKeyContact": this.customerContactForm.controls.isKey.value,
        "Category": (this.customerContactForm.value.category === undefined) ? { "Id": "" } : { "Id": this.customerContactForm.value.category },
        "Contact": this.customerContactForm.controls.contacts.value,
        "Module": (this.Module == undefined) ? 2 : this.Module
      }
      this.isLoading = true;
      this.status = true;
      this.conversationService.postCustomerData(this.contactObj).subscribe(res => {
        this.isLoading = false;
        if (!res.IsError) {
          this.isReplace = true;    
          this.errorMessage.throwError(res.Message)
          this.dialogRef.close(res.ResponseObject)
        } else {
          this.dialogRef.close('');
          this.errorMessage.throwError(res.Message)
        }
      }, error => {
        this.status = false;
        this.isLoading = false;
      });
    } else {
      this.service.validateAllFormFields(this.customerContactForm)
      let invalidElements = this.el.nativeElement.querySelectorAll('#validatescroll .ng-invalid');
      if (invalidElements.length) {
        this.scrollTo(invalidElements[0]);
        this.service.validationErrorMessage();
      }
      return;
    }
  }
  onError(message) {
    let action;
    this.matSnackBar.open(message, action, {
      duration: 5000
    });
  }
  openduplicatepop(): void {
    const dialogRef = this.dialog.open(errorpopcomponentCustomer, {
      disableClose: true,
      width: '400px',
      data: this.EmailChecksConatctGuild
    });
  }

  accept = ['image/jpg','image/jpeg','image/png', 'image/PJP', 'image/gif'];
  isReplace: boolean = true
  public detectFilesRead(e, eleId: string): void | boolean {
    var data = <HTMLInputElement>document.getElementById(eleId);
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    if (!this.accept.includes(file.type)) {
      this.isLoading = false;
      this.errorMessage.throwError('Please upload a valid image format');
      return
    }
    if (file.type && file.type.match(pattern)) {
      if (file.size > 5242880) {
        this.isLoading = false;
        this.errorMessage.throwError("Not able to upload the file because filesize is greater than 5mb")
        return false;
      } else {
        var reader = new FileReader();
        this.businessCardFile = file;
        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsDataURL(file);
      }
    } else {
      data.value = "";
      this.errorMessage.throwError("Upload a valid file");
      return false;
    }
  }
  businessCardUrl: string;
  private retry = 0;
  private uploadFileAPICall(file: File, response: any): void {
    const formData: FormData = new FormData();
    formData.append('file', file);
    this.isLoading = true;
    this.contactService.profileImg(formData).subscribe(fileUpload => {
      if (fileUpload) {
        this.isLoading = false;
        this.imageSrc = fileUpload.toString()
        this.businessCardUrl = this.imageSrc;
        this.retry = 0;
        this.businessCardFile = undefined;
        if (response) {
          response = response;
          if (this.isReplace){
          
          if (response.Result.Content[0].name.length > 0) {
            this.customerContactForm.patchValue({ fname: response.Result.Content[0].name[0] });
          }
          if (response.Result.Content[0].name.length > 0) {
            this.customerContactForm.patchValue({ lname: response.Result.Content[0].name[1] });
          }
          if (response.Result.Content[0].designation.length > 0) {
            this.customerContactForm.patchValue({ designation: response.Result.Content[0].designation[0] });
          }
          if (response.Result.Content[0].email.length > 0) {
            this.customerContactForm.patchValue({ email: response.Result.Content[0].email[0] });
          }
          if (response.Result.Content[0].number.length > 0) {
            const phonenumbermappingData = response.Result.Content[0].number.map(contactInfo => this.fb.group(
              {
                ContactNo: contactInfo,
                ContactType: 1,
                MapGuid: "",
              }
            ));
            const phoneNumberFormArray = this.fb.array(phonenumbermappingData);
            this.customerContactForm.setControl('contacts', phoneNumberFormArray);
          }
        }
        } else {
          this.errorMessage.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?")
        }
      } (error) => {
        if (this.retry == 3) {
          this.errorMessage.throwError(error);
        } else {
          this.uploadFileAPICall(file, response);
        }
      }
    }, err => {
      this.isLoading = false
      if (this.retry == 3) {
        this.errorMessage.throwError(err);
      } else {
        this.uploadFileAPICall(file, response);
      }
    });;
  }
  private businessCardFile: File;
  _handleReaderLoaded(e) {
    this.imageSrc = null;
    let reader = e.target;
    let imgSrc = reader.result;
    let response: any;
    this.isLoading = true;
    this.conversationService.base64to_ocr(imgSrc).subscribe(res => {
      this.isLoading = false;
      response = res;
      this.uploadFileAPICall(this.businessCardFile, JSON.parse(response));
    });
  }
  scrollTo(element: Element) {
    if (element) {
      window.scroll({
        behavior: 'smooth',
        left: 0,
        top: element.getBoundingClientRect().top + window.scrollY - 150
      });
    }
  }
  deleteFile(e) {
    this.img = true;
    const dialogRef = this.dialog.open(deleteImageComponent,
      {
        disableClose: true,
        width: '396px',
        data: { image: this.imageSrc }
      });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        document.getElementById('image').removeAttribute('src');
        document.getElementById('image').setAttribute("src", null);
        this.imageSrc = null;
        this.isReplace = true;
      }
    })
  }
  replaceImg() {
    const dialogRef = this.dialog.open(replaceImageComponent, {
      disableClose: true,
      width: '396px',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res !== undefined) {
        this.isReplace = res;
      }
    })
  }

  ngOnDestroy() {
    this.contactService.EnrichedInfo = undefined
  }
}
@Component({
  selector: 'app-error-pop',
  templateUrl: './Error-pop.html',
  styleUrls: ['./customerpopup.component.scss']
})
export class errorpopcomponentCustomer implements OnInit {

  constructor(public router: Router, @Inject(MAT_DIALOG_DATA) public data) { }
  ViewToDetail() {
    console.log("View To Detail");
    this.router.navigateByUrl('/contacts/Contactdetailslanding/contactDetailsChild');
  }
  ngOnInit() {
    this.data;
  }
}
@Component({
  selector: 'app-delete-img',
  templateUrl: './delete-img.html',
  styleUrls: ['./customerpopup.component.scss']
})
export class deleteImageComponent {
  img = true;
  constructor(@Inject(MAT_DIALOG_DATA) public data) { }
}
@Component({
  selector: 'app-replace-img',
  templateUrl: './replace-img.html',
  styleUrls: ['./customerpopup.component.scss']
})
export class replaceImageComponent implements OnInit {
  constructor(  public service: DataCommunicationService, public dialogRef: MatDialogRef<replaceImageComponent>) { }
  ngOnInit() {
  }
  replaceInformation() {
    console.log("replace Information click");
    this.service.fileUpload = true;
    document.getElementById('fileUpload').click();
    this.dialogRef.close(true);
  }

  retailInformation() {
    console.log("Retail information click")
    this.service.fileUpload = true;
    document.getElementById('fileUpload').click();
    this.dialogRef.close(false);
  }
  // makeservice() {
  //   this.service.fileUpload = true;
  //   document.getElementById('fileUpload').click();
  // }
}