import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataCommunicationService } from '@app/core/services/global.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ContactService, OfflineService, routes, ErrorMessage, CampaignService, ConversationService, MasterApiService, OnlineOfflineService, contactAdvnHeaders, contactAdvnNames } from '@app/core/services';
import { Router } from '@angular/router';
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { LoadContactDetailsById, UpdateContactDetails, UpdateContactList, ClearContactList, UpdateMarketDetails, ClearContactsDataDetails } from '@app/core/state/actions/contact.action';
import { removeSpaces, checkLimit, leadDecimalDealValue } from '@app/shared/pipes/white-space.validator';
import { getContactDetailsById } from '@app/core/state/selectors/contact-list.selector';
import { Subscription } from 'rxjs';
import { RoutingState } from '@app/core/services/navigation.service';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { errorpopcomponent } from '../../../create-contact/create-contact.component';
import { CacheDataService } from '@app/core/services/look-up-cache-data/cache-data.serive';
import { FileUploadService } from '@app/core/services/file-upload.service';
@Component({
  selector: 'app-contact-details-child',
  templateUrl: './contact-details-child.component.html',
  styleUrls: ['./contact-details-child.component.scss']
})
export class ContactDetailsChildComponent implements OnInit {
  ContactGuid: any;
  AccountZunkdata: any;
  ReportingZunkdata: any;
  CBUZunkdata: any;
  StateZunkdata: any;
  CityZunkdata: any;
  TwitterUrldata: string = '';
  LinkendUrldata: string = '';
  ContactDetails: any;
  img: boolean = true;
  img1: boolean = true;
  getContactdetail: any;
  ContactEditID: any;
  contactDetailEditForm: FormGroup;
  getCity: any;
  getState: any;
  getCountry: any;
  getCBU: any;
  getAccountCompany: any;
  getReportingManager: any;
  functionType: any;
  salutation: any;
  relationship: any;
  categoryData: any;
  phoneContactType: any;
  selectedAccountId: any;
  selectedCountryId: any;
  selectedCBUIdId: any;
  selectedCityGuid: string = '';
  selectedStateName: string = '';
  SelectedReportingManagerId: string = '';
  imageSrc: string = '';
  selectedCBUId: string = '';
  contactObject: any;
  contactNoMapGuid: string = ""
  newCityName: string = '';
  newStateName: string = '';
  contactdetailsGuid: string = ''
  isCitychanged: boolean = false;
  isStatechanged: boolean = false;
  newReportingManager: string = '';
  newCBU: string = '';
  isReportingManagerChanged: boolean = false;
  isCBUChanged: boolean = false;
  isLoading: boolean = false;
  phonenumberMapGuid: string = '';
  ngclass: boolean = false;
  profileImage: string;
  businessCardUrl: string = "";
  isAccountNameSearchLoading: boolean = false;
  isCountrySearchLoading: boolean = false;
  isReportingManagerSearchLoading: boolean = false;
  isCBUSearchLoading: boolean = false;
  isCitySearchLoading: boolean = false;
  isStateSearchLoading: boolean = false;
  arrowkeyLocation = 0;
  isProspect: boolean;
  selectedStateId: string = ''
  phoneNumberEditInfo: Array<any> = [];
  //showeditbtn: boolean;
  Generaldetails: any
  Customerdetails: any
  addPhoneEditArray: FormArray;
  ReportingManagerSwitch: boolean = false;
  AccountNameSwitch: boolean = false;
  ReferenceTypeSwitch: boolean = false;
  SelectedReferenceType: any;
  contactDetails: any
  CBUSwitch: boolean = false;
  StatenameSwitch: boolean = false;
  CitynameSwitch: boolean = false;
  designationErrorMessage: any;
  private businessCardFile: File;
  private retry = 0;
  selectedvariable: any;
  AccountName: any;
  SelectedCountryName: any;
  ReportingManagerName: string = '';
  CBUName: string = '';
  selectedCityName: any;
  MarketingInfoDetails: any
  TabNav$: Subscription
  ExistingContactPhoneNumbers = []
  deletedExistingContact = []
  contactIndex = -1;
  isEditable: boolean = false;
  isActivate: boolean = false;
  Activate$: Subscription
  contactEditOrActivate: boolean = false
  EmailChecksConatctGuild
  contactSubscription: Subscription
  getEditButtonSub: Subscription
  isReferenceTypeSearchLoading: boolean = false;
  getReferenceType: any;
  ContactReferenceMode: any;
  referenceModeAria: any
  referenceModeName: any;
  referenceModeId: any;
  reportingmanagerName: string = ''
  stateName: string = ''
  cityName: string = ''
  referenceTypeName: string = ''
  //------------------------------------advance lookup ts file starts--------------------------------//
  lookupdata = {
    tabledata: [],
    recordCount: 10,
    headerdata: [],
    Isadvancesearchtabs: false,
    controlName: '',
    lookupName: '',
    isCheckboxRequired: false,
    inputValue: '',
    TotalRecordCount: 0,
    selectedRecord: [],
    isLoader: false,
    nextLink: '',
    errorMsg: {
      isError: false,
      message: ""
    },
  };
  IdentifyAppendFunc = {
    'accountSearch': (data) => { this.appendAccountName(data) },
    'reportingSearch': (data) => { this.appendReportingManager(data) },
    'cbuSearch': (data) => { this.appendCBU(data) },
  }
  selectedLookupData(controlName) {
    switch (controlName) {
      case 'accountSearch': { return (this.sendAccountToAdvanceLookup.length > 0) ? this.sendAccountToAdvanceLookup : [] }
      case 'reportingSearch': { return (this.sendReportingToAdvanceLookup.length > 0) ? this.sendReportingToAdvanceLookup : [] }
      case 'cbuSearch': { return (this.sendCbuToAdvanceLookup.length > 0) ? this.sendCbuToAdvanceLookup : [] }
    }
  }
  //---------------------------------advance lookup ts file ends-------------------------------//

  constructor(
    public el: ElementRef,
    public dialog: MatDialog,
    public service: DataCommunicationService,
    private contactservice: ContactService,
    private fb: FormBuilder,
    private masterApi: MasterApiService,
    private offlineService: OfflineService,
    private Popup: ErrorMessage,
    private router: Router,
    public errorMessage: ErrorMessage,
    private snackBar: MatSnackBar,
    public conversationService: ConversationService,
    public contactService: ContactService,
    public store: Store<AppState>,
    public matSnackBar: MatSnackBar,
    private onlineOfflineservice: OnlineOfflineService,
    public routingState: RoutingState,
    private cacheDataService: CacheDataService,
    private fileService: FileUploadService,
  ) {
    this.checkEditOrReadMode()
    this.TabNav$ = this.contactService.contactNavFrom().subscribe(res => {
      if (res) {
        if (res.navEnum == 2) {
          this.navigateToMarketingInfo()
        }
        else if (res.navEnum == 3) {
          this.navigateToRelationshiplog()
        }
      }
    });
    this.contactEditOrActivate = JSON.parse(sessionStorage.getItem('contactEditOrActivate'));
    console.log('contactEditOrActivate', this.contactEditOrActivate)
  }

  async ngOnInit() {
    //this is for Edit, Activate, Save and Cancel button action from parent compnt
    this.getEditButtonSub = this.contactService.getButtonActions().subscribe(res => {
      if (res) {
        if (res.clicked === true) {
          this.editContactdetails();
        }
        if (res.saveClicked === true) {
          this.emailValidationChecksOnSave();
        }
        if (res.cancelClicked === true) {
          this.Cancel();
        }
      }
    });
    //end actions button
    this.checkEditOrReadMode()
    this.isLoading = true;
    this.ContactEditID = JSON.parse(localStorage.getItem("contactEditId"));
    this.initializeContactInfoForm();
    this.getMasterDatas();
    this.onChanges();
    this.imageSrc = null;
    this.contactSubscription = this.store.pipe(select(getContactDetailsById(this.ContactEditID))).subscribe(res => {
      this.isLoading = false;
      if (res) {
        this.contactDetails = { ...res }
        this.ExistingContactPhoneNumbers = res.Contact
        console.log("contact Details", this.contactDetails);
        this.MarketingInfoDetails = this.contactDetails.MarketingDetail
        this.patchReadOnlyDetails(this.contactDetails);
        this.getContactdetail = res
        console.log('getContactdetail', this.getContactdetail);
        this.contactdetailsGuid = res.Guid
        this.contactService.sendImage = this.contactDetails.ProfileImage
        if (res.ProfileImage) {
          this.profileImage = res.ProfileImage
        } else {
          this.profileImage = null
        }
        if (res.BusinessCardImage) {
          this.businessCardUrl = res.BusinessCardImage
        }
        if (sessionStorage.getItem('contactDetailsData') && !this.contactService.showeditbtn) {
          this.editContactdetails(JSON.parse(sessionStorage.getItem('contactDetailsData')))
        } else if (!this.contactService.showeditbtn) {
          this.editContactdetails();
        }
      } else {
        this.getContactDetails();
      }
    });
    //  offline service for contact details page
    if (!this.onlineOfflineservice.isOnline) {
      const cacheContactdetailsData = await this.contactservice.getCacheContactDetailsById(this.ContactEditID);
      this.isLoading = false;
      if (cacheContactdetailsData != null) {
        this.getContactdetail = cacheContactdetailsData.data
      } else {
        this.getContactDetails();
      }
    };
  }

  initializeContactInfoForm() {
    this.contactDetailEditForm = this.fb.group({
      salutation: ['', [Validators.required]],
      firstName: ['', Validators.compose([Validators.required, removeSpaces, checkLimit(100)])],
      lastName: ['', Validators.compose([Validators.required, removeSpaces, checkLimit(100)])],
      designation: ['', Validators.compose([Validators.required, removeSpaces, checkLimit(100), leadDecimalDealValue])],
      emailAddress: ['', Validators.compose([Validators.required])],
      contacts: this.fb.array([this.addformArray()]),
      accountName: ['', [Validators.required]],
      reportingManager: [''],
      CBU: [''],
      relationship: ['', [Validators.required]],
      keyContact: [false],
      category: ['', [Validators.required]],
      keyContactcategory: [''],
      referenceable: ['', [Validators.required]],
      referenceType: [''],
      referenceMode: ['', [Validators.required]],
      address1: [''],
      address2: [''],
      streetName: [''],
      City: [''],
      country: ['', [Validators.required]],
      stateProvince: [''],
      zipPostalCode: [''],
    });
    this.contactDetailEditForm.controls['City'].disable();
    this.contactDetailEditForm.controls['accountName'].disable();
    this.ngclass = true;
  }

  patchReadOnlyDetails(data) {
    console.log("patchReadOnlyDetails", data);
    this.Generaldetails = {
      Salutation: (data.Salutation) ? (data.Salutation.Value) ? data.Salutation.Value : "NA" : "NA",
      Firstname: (data.FName) ? (data.FName) ? data.FName : "NA" : "NA",
      Lastname: (data.LName) ? (data.LName) ? data.LName : "NA" : "NA",
      Designation: (data.Designation) ? (data.Designation) ? data.Designation : "NA" : "NA",
      Emailaddress: (data.Email) ? (data.Email) ? data.Email : "NA" : "NA",
      Phonenumber: (data.Contact) ? data.Contact : [],
      AccountName: (data.CustomerAccount) ? (decodeURIComponent(data.CustomerAccount.Name)) ? (decodeURIComponent(data.CustomerAccount.Name)) : "NA" : "NA",
      ReportingManager: (data.ReportingManager) ? (data.ReportingManager.FullName) ? data.ReportingManager.FullName : "NA" : "NA",
      CBU: (data.CBU) ? (data.CBU.Name) ? data.CBU.Name : "NA" : "NA",
      Relationship: (data.Relationship) ? (data.Relationship.Name) ? data.Relationship.Name : "NA" : "NA",
      KeyContact: (data.isKeyContact) ? "Yes" : "No",
      Referenceable: (data.Referenceable) ? "Yes" : "No",
      ReferenceType: (data.ReferenceType) ? (data.ReferenceType) ? data.ReferenceType : "NA" : "NA",
      ReferenceMode: (data.ReferenceMode) ? (data.ReferenceMode.Name) ? data.ReferenceMode.Name : "NA" : "NA",
      Category: (data.Category) ? (data.Category.Name) ? data.Category.Name : "NA" : "NA",
      isUserCanEdit: data.isUserCanEdit
    }
    console.log("account decoded value", this.Generaldetails.AccountName)
    this.Customerdetails = {
      address1: (data.CustomerAddress) ? (data.CustomerAddress.Address1) ? data.CustomerAddress.Address1 : "NA" : "NA",
      address2: (data.CustomerAddress) ? (data.CustomerAddress.Address2) ? data.CustomerAddress.Address2 : "NA" : "NA",
      streetName: (data.CustomerAddress) ? (data.CustomerAddress.Street) ? data.CustomerAddress.Street : "NA" : "NA",
      City: (data.CustomerAddress.City) ? (data.CustomerAddress.City.Name) ? data.CustomerAddress.City.Name : "NA" : "NA",
      stateProvince: (data.CustomerAddress.State) ? (data.CustomerAddress.State.Name) ? data.CustomerAddress.State.Name : "NA" : "NA",
      Country: (data.CustomerAddress.Country) ? (data.CustomerAddress.Country.Name) ? data.CustomerAddress.Country.Name : "NA" : "NA",
      zipPostalCode: (data.CustomerAddress) ? (data.CustomerAddress.ZipCode) ? data.CustomerAddress.ZipCode : "NA" : "NA"
    }
    this.selectedCountryId = data.CustomerAddress.Country.SysGuid;
    this.SelectedCountryName = data.CustomerAddress.Country.Name;
    this.businessCardUrl = data.BusinessCardImage;
    this.TwitterUrldata = (data.TwitterUrl === undefined) ? '' : data.TwitterUrl
    this.LinkendUrldata = (data.LinkedinUrl === undefined) ? '' : data.LinkedinUrl
    //this condition for tab functionality start
    this.ReportingManagerName = (data.ReportingManager) ? (data.ReportingManager.FullName) ? data.ReportingManager.FullName : "" : "",
      this.CBUName = (data.CBU) ? (data.CBU.Name) ? data.CBU.Name : "" : "",
      this.SelectedCountryName = (data.CustomerAddress.Country) ? (data.CustomerAddress.Country.Name) ? data.CustomerAddress.Country.Name : "" : "",
      this.selectedStateName = (data.CustomerAddress.State) ? (data.CustomerAddress.State.Name) ? data.CustomerAddress.State.Name : "" : "",
      this.selectedCityName = (data.CustomerAddress.City) ? (data.CustomerAddress.City.Name) ? data.CustomerAddress.City.Name : "" : "";
      if (data.BusinessCardMimeType != '' && data.BusinessCardBase64string !='') {
      this.imageSrc = "data:" + data.BusinessCardMimeType + ";base64," +data.BusinessCardBase64string;
      }
  }

  patchContactDetails(data) {
    console.log("patchContactDetails", data);
    this.contactDetailEditForm.patchValue({
      salutation: (data.Salutation.Id !== 0) ? data.Salutation.Id : '',
      firstName: (data.FName) ? data.FName : '',
      lastName: (data.LName) ? data.LName : '',
      designation: data.Designation,
      emailAddress: data.Email,
      accountName: decodeURIComponent(data.CustomerAccount.Name),
      reportingManager: data.ReportingManager.FullName,
      CBU: data.CBU.Name,
      relationship: (data.Relationship.Id !== 0) ? data.Relationship.Id : '',
      keyContact: data.isKeyContact,
      referenceable: data.Referenceable,
      referenceType: "",
      referenceMode: (data.ReferenceMode.Id !== undefined) ? data.ReferenceMode.Id : '',
      category: (data.Category.Id !== 0) ? data.Category.Id : '',
      keyContactcategory: "",
      address1: data.CustomerAddress.Address1,
      address2: data.CustomerAddress.Address2,
      streetName: data.CustomerAddress.Street,
      City: data.CustomerAddress.City.Name,
      stateProvince: data.CustomerAddress.State.Name,
      country: data.CustomerAddress.Country.Name,
      zipPostalCode: data.CustomerAddress.ZipCode,
    });
    this.selectedCountryId = data.CustomerAddress.Country.SysGuid;
    console.log("contactDetailEditForm", this.contactDetailEditForm.value)
    data.ReferenceType.forEach(res => {
      this.selectedReferenceType.push({ Id: res.Id, Name: res.Name, MapGuid: res.MapGuid, LinkActionType: res.LinkActionType })
      this.sendReferenceType.push({ Id: res.Id, Name: res.Name, MapGuid: res.MapGuid, LinkActionType: res.LinkActionType })
    });
    if (this.selectedReferenceType.length > 0) {
      this.clearReferenceValidator();
    } if (this.selectedReferenceType.length == 0) {
      this.setReferenceValidator();
    }
    if (data.referenceable === true) {
      this.setReferenceValidator();
    } else {
      this.clearReferenceValidator();
    }

    //  below condition are commnented by ganga
    // This condition is for TypeAria
    //   this.salutation = (data.Salutation.Id !== 0) ? data.Salutation.Id : ''
    //  if(this.salutation.length>0){
    //   this.salutationTypeAria = this.salutation.filter(x=>x.Id==data.Salutation.Id)[0].Name
    //  }
    //  if(this.relationship.length>0){
    //   this.relationTypeAria = this.relationship.filter(x=>x.Id==data.Relationship.Id)[0].Name
    //  }
    //    if(this.categoryData.length>0 && !this.isEmpty(data)){
    //  let data = this.categoryData.filter(x=>x.Id==data.Category.Id)
    //     if(data.length>0){
    //      this.categoryTypeAria= data[0].Name
    //     }
    // }
  }

  editContactdetails(sessiondata?) {
    console.log("editContactdetails sessiondata", sessiondata)
    sessionStorage.setItem('contactEditMode', JSON.stringify(true))
    let data
    this.contactService.showeditbtn = false
    if (sessiondata) {
      data = sessiondata
    } else {
      data = this.contactDetails
    }
    this.patchContactDetails(data)
    this.AccountNameLogic(data)
    this.CbuLogic(data)
    this.ReportingManagerlogic(data)
    this.CityLogic(data)
    this.StateNameLogic(data)
    this.CreateContactArray(data)
    this.service.windowScroll();
    this.contactService.setProfileImageflag(true, null)
  }

  Cancel() {
    this.businessCardUrl = this.getContactdetail.BusinessCardImage;
    console.log("urlll", this.businessCardUrl)
    this.selectedReferenceType = []
    this.sendReferenceType = []
    this.contactDetailEditForm.patchValue({
      referenceMode: ''
    });
    sessionStorage.removeItem("contactDetailsData")
    sessionStorage.removeItem('contactEditMode')
    this.contactService.showeditbtn = true
    this.contactService.setProfileImageflag(false, null);
    this.contactservice.setProfileImage(this.profileImage)
    this.contactDetails.ProfileImage;
    this.isReplace = true;
  }

  AccountNameLogic(data) {
    if (data.CustomerAccount.Name !== undefined && data.CustomerAccount.Name !== "") {
      this.AccountName = decodeURIComponent(data.CustomerAccount.Name)
      this.selectedAccountId = data.CustomerAccount.SysGuid;
      this.isProspect = data.CustomerAccount.isProspect;
      this.ngclass = false;
      this.contactDetailEditForm.controls['CBU'].enable();
      this.contactDetailEditForm.controls['reportingManager'].enable();
    }
    if (data.CustomerAccount.Name === undefined && data.CustomerAccount.Name === "") {
      this.contactDetailEditForm.controls['CBU'].disable();
      this.contactDetailEditForm.controls['reportingManager'].disable();
      this.contactDetailEditForm.controls['CBU'].reset();
      this.contactDetailEditForm.controls['reportingManager'].reset();
      this.ngclass = true;
    }
  }
  ReportingManagerlogic(data) {
    if (data.ReportingManager.FullName !== undefined) {
      this.SelectedReportingManagerId = data.ReportingManager.SysGuid;
      this.ReportingManagerName = data.ReportingManager.FullName
    }
  }
  CbuLogic(data: any) {
    if (data.CBU.Name !== undefined) {
      this.selectedCBUId = data.CBU.SysGuid;
      this.CBUName = data.CBU.Name
    }
  }
  StateNameLogic(data) {
    if (data.CustomerAddress.State.Name !== '') {
      this.selectedStateName = data.CustomerAddress.State.Name;
      this.selectedStateId = data.CustomerAddress.State.SysGuid
      this.contactDetailEditForm.controls['City'].enable();
      this.ngclass = false;
    }
    if (data.CustomerAddress.State.Name === '') {
      this.selectedStateId = ''
      this.contactDetailEditForm.controls['City'].disable();
      this.contactDetailEditForm.controls['City'].reset();
    }
  }
  CityLogic(data: any) {
    if (data.CustomerAddress.City.Name !== undefined) {
      this.selectedCityGuid = data.CustomerAddress.City.SysGuid;
      this.selectedCityName = data.CustomerAddress.City.Name
    }
  }
  //---- Phone number logic statrt
  CreateContactArray(data) {
    if (data.Contact.length > 0) {
      const phonenumbermappingData = data.Contact.map(contactInfo => this.fb.group(
        {
          ContactNo: contactInfo.ContactNo,
          ContactType: contactInfo.ContactType,
          MapGuid: (contactInfo.MapGuid) ? contactInfo.MapGuid : "",
          LinkActionType: contactInfo.LinkActionType,
        }
      ));
      const phoneNumberFormArray = this.fb.array(phonenumbermappingData);
      this.contactDetailEditForm.setControl('contacts', phoneNumberFormArray);
      this.phoneNumberEditInfo = data.Contact
    }
  }
  addformArray() {
    return this.fb.group({
      ContactNo: [''],
      ContactType: [''],
      MapGuid: [''],
      LinkActionType: 1
    });
  }
  PhoneNumberValidation(value) {
    if (value === "") {
      this.errorMessage.throwError("Please select phone number type")
    }
  }
  contactTypeChanges1($event, i, item) {
    $event.preventDefault();
    let contactType = $event.target.value
    console.log("selecte the phone type!!")
    console.log(contactType)
    if (contactType == '') {
      const facontrol = (<FormArray>this.contactDetailEditForm.controls['contacts']).at(i);
      facontrol['controls'].ContactNo.setValue("");
    }
  }
  addContactss($event, valid, value) {
    this.contactIndex = this.contactIndex + 1
    console.log("valid value", valid, value)
    console.log("ccc", this.contactDetailEditForm.controls.contacts[this.contactDetailEditForm.value.contacts.length - 1])
    if (this.contactDetailEditForm.value.contacts.length >= 5) {
      this.errorMessage.throwError("Maximum 5 contact numbers can be added");
    } else {
      if (this.contactDetailEditForm.value.contacts[this.contactDetailEditForm.value.contacts.length - 1].ContactNo === "") {
        this.errorMessage.throwError("Please enter phone number");
      } else {
        if (this.addPhoneEditArray.value.some(x => x.ContactNo.length < 8)) {
          this.errorMessage.throwError("Please enter the phone number ");
        }
        else {
          $event.preventDefault();
          this.addPhoneEditArray.push(this.addformArray());
          this.contactDetailEditForm;
          console.log("contactDetailEditForm", this.contactDetailEditForm);
        }
      }
    }
  }
  deleteContact(i, item) {
    console.log("deleting")
    console.log(item)
    if (this.ExistingContactPhoneNumbers.some(x => x.MapGuid == item.MapGuid)) {
      this.deletedExistingContact = this.deletedExistingContact.filter(x => x.MapGuid != item.MapGuid)
      this.deletedExistingContact.push({ ...item, LinkActionType: 3 })
    }
    if (i > 0) {
      this.addPhoneEditArray.removeAt(i);
    } else {
      return null;
    }
  }
  get getContacts() {
    return this.addPhoneEditArray = <FormArray>this.contactDetailEditForm.get('contacts') as FormArray;
  }
  get f() {
    return this.contactDetailEditForm.controls;
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

  openduplicatepop(): void {
    const dialogRef = this.dialog.open(errorpopcomponent, {
      disableClose: true,
      width: '400px',
      data: this.EmailChecksConatctGuild
    });
    dialogRef.afterClosed().subscribe(x => {
      console.log("View To Detail", x);
      this.contactService.showeditbtn = true
      sessionStorage.removeItem("contactDetailsData")
      sessionStorage.setItem('contactEditMode', JSON.stringify(false))
      this.contactservice.setProfileImageflag(false, true)
      this.ngOnInit()
    });
  }

  sendAccountToAdvanceLookup = []
  sendReportingToAdvanceLookup = []
  sendCbuToAdvanceLookup = []
  appendAccountName(item: any) {
    this.contactDetailEditForm.patchValue({ accountName: item.Name })
    this.AccountNameSwitch = false;
    this.selectedAccountId = item.SysGuid;
    this.isProspect = item.isProspect;
    this.AccountName = item.Name
    let json = { Name: item.Name, SysGuid: item.SysGuid, isProspect: item.isProspect, Id: item.SysGuid }
    this.sendAccountToAdvanceLookup = [json]
    this.contactDetailEditForm.patchValue({
      reportingManager: ""
    });
  }

  appendReportingManager(item: any) {
    this.contactDetailEditForm.patchValue({ reportingManager: item.FullName });
    this.ReportingManagerSwitch = false;
    this.isReportingManagerChanged = true
    this.newReportingManager = item.Guid
    this.reportingmanagerName = item.FullName
    this.SelectedReportingManagerId = item.Guid
    this.ReportingManagerName = item.FullName
    let json = { Name: item.FullName, SysGuid: item.Guid, isProspect: item.isProspect, Id: item.Guid }
    this.sendReportingToAdvanceLookup = [json]
  }
  appendCBU(item: any) {
    this.contactDetailEditForm.patchValue({ CBU: item.Name })
    this.CBUSwitch = false;
    this.isCBUChanged = true
    this.newCBU = item.Id;
    this.selectedCBUIdId = item.Id
    this.CBUName = item.Name
    let json = { Name: item.Name, SysGuid: item.Id, isProspect: item.isProspect, Id: item.SysGuid }
    this.sendCbuToAdvanceLookup = [json]
  }
  appendCountryname(item: any) {
    this.contactDetailEditForm.patchValue({ country: item.Name, stateProvince: "", City: "" })
    this.CountrynameSwitch = false;
    this.selectedCountryId = item.SysGuid;
    this.SelectedCountryName = item.Name;
    console.log("selectedCountryname", this.SelectedCountryName);
    this.contactDetailEditForm.controls['stateProvince'].enable();
    this.ngclass = false;
    this.contactDetailEditForm.patchValue({
      stateProvince: ""
    });
    this.selectedStateName = '';
    this.selectedStateId = '';
    this.selectedCityGuid = '';
    this.selectedCityName = ''
    this.cacheDataService.cacheDataMultiReset(['contactState', 'contactCity'])
  }

  appendStatename(item: any) {
    this.contactDetailEditForm.patchValue({ stateProvince: item.Name })
    this.stateName = item.Name
    this.StatenameSwitch = false;
    this.newStateName = item.Name
    this.selectedStateName = item.Name
    this.selectedStateId = item.SysGuid
    this.isStatechanged = true;
    this.contactDetailEditForm.patchValue({
      City: ''
    })
    this.contactDetailEditForm.controls['City'].enable();
    this.ngclass = false;
    this.selectedCityGuid = '';
    this.selectedCityName = ''
    this.cacheDataService.cacheDataReset('contactCity')
  }

  appendCityname(item: any) {
    this.contactDetailEditForm.patchValue({ City: item.Name })
    this.CitynameSwitch = false;
    this.newCityName = item.SysGuid
    this.cityName = item.Name
    this.isCitychanged = true
    this.selectedCityGuid = item.SysGuid
    this.selectedCityName = item.Name
  }

  selectedReferenceType = [];
  sendReferenceType: any = [];
  referenceTypeChange: boolean = false;
  appendReferenceType(item: any) {
    console.log("appendReferenceType", item);
    let json = { Id: item.Id, Guid: item.Id, Name: item.Name, LinkActionType: 1, MapGuid: "" }
    let json1 = { Id: item.Id, Name: item.Name, LinkActionType: 1, MapGuid: "" }
    this.selectedReferenceType.push(json);
    let beforeLength = this.selectedReferenceType.length;
    this.selectedReferenceType = this.service.removeDuplicates(this.selectedReferenceType, "Id");
    let afterLength = this.selectedReferenceType.length
    if (beforeLength === afterLength) {
      this.sendReferenceType.push(json1)
      this.contactDetailEditForm.patchValue({ referenceType: "", });
    } else {
      this.errorMessage.throwError("Selected reference type already exists")
    }
    this.ReferenceTypeSwitch = false;
    this.referenceTypeChange = true;
    this.contactDetailEditForm.patchValue({ referenceType: "" });
    if (this.selectedReferenceType.length > 0) {
      this.refernceTypeValidator(false)
    }
  }

  delinkReferenceType(item, i) {
    if (item.MapGuid !== "") {
      this.selectedReferenceType = this.selectedReferenceType.filter(res => res.MapGuid !== item.MapGuid)
      let index = this.sendReferenceType.findIndex(k => k.MapGuid === item.MapGuid)
      this.sendReferenceType[index].LinkActionType = 3
    } else {
      this.selectedReferenceType = this.selectedReferenceType.filter(res => res.Id !== item.Id)
      this.sendReferenceType = this.sendReferenceType.filter(res => res.Id !== item.Id)
    }
    if (this.selectedReferenceType.length == 0) {
      this.refernceTypeValidator(true)
    } else {
      this.refernceTypeValidator(false)
    }
  }

  refernceTypeValidator(value) {
    if (value) {
      this.contactDetailEditForm.get('referenceType').markAsTouched();
      this.contactDetailEditForm.get('referenceType').setValidators(Validators.required);
      this.contactDetailEditForm.get('referenceType').updateValueAndValidity();
    } else {
      this.contactDetailEditForm.get('referenceType').clearValidators();
      this.contactDetailEditForm.get('referenceType').markAsUntouched();
      this.contactDetailEditForm.get('referenceType').updateValueAndValidity();
    }
  }

  matReferencable(event) {
    console.log(event.value)
    if (event.value == true) {
      if (this.selectedReferenceType.length == 0) {
        this.setReferenceValidator();
      }
      return
    } else {
      this.clearReferenceValidator();
      this.contactDetailEditForm.patchValue({
        referenceMode: ''
      });
      this.sendReferenceType.forEach(res => {
        if (res.MapGuid !== '') {
          res.LinkActionType = 3
        }
      });
      this.sendReferenceType = this.sendReferenceType.filter(res => res.LinkActionType !== 1)
      return
    }
  }
  setReferenceValidator() {
    this.contactDetailEditForm.get('referenceType').markAsTouched();
    this.contactDetailEditForm.get('referenceType').setValidators(Validators.required);
    this.contactDetailEditForm.get('referenceType').updateValueAndValidity();
    this.contactDetailEditForm.get('referenceMode').markAsTouched();
    this.contactDetailEditForm.get('referenceMode').setValidators(Validators.required);
    this.contactDetailEditForm.get('referenceMode').updateValueAndValidity();
  }
  clearReferenceValidator() {
    this.contactDetailEditForm.get('referenceType').clearValidators();
    this.contactDetailEditForm.get('referenceType').markAsUntouched();
    this.contactDetailEditForm.get('referenceType').updateValueAndValidity();
    this.contactDetailEditForm.get('referenceMode').clearValidators();
    this.contactDetailEditForm.get('referenceMode').markAsUntouched();
    this.contactDetailEditForm.get('referenceMode').updateValueAndValidity();
  }

  AccountNameclose() {
    this.AccountNameSwitch = false;
    if (this.selectedAccountId === "" && this.contactDetailEditForm.get('accountName').dirty) {
      this.contactDetailEditForm.patchValue({ accountName: '' })
    }
  }

  ReportingManagerclose() {
    this.ReportingManagerSwitch = false;
    if (this.newReportingManager === "" && this.contactDetailEditForm.get('reportingManager').dirty) {
      this.contactDetailEditForm.patchValue({ reportingManager: '' })
    }
    if (this.ReportingManagerName !== "") {
      this.contactDetailEditForm.patchValue({
        reportingManager: this.ReportingManagerName
      });
    }
  }

  CBUclose() {
    this.CBUSwitch = false;
    if (this.newCBU === "" && this.contactDetailEditForm.get('CBU').dirty) {
      this.contactDetailEditForm.patchValue({ CBU: '' })
    }
    if (this.CBUName !== "") {
      this.contactDetailEditForm.patchValue({
        CBU: this.CBUName
      });
    }
  }

  ReferenceTypeclose() {
    this.ReferenceTypeSwitch = false;
    if (this.SelectedReferenceType === undefined && this.contactDetailEditForm.get('referenceType').dirty) {
      this.contactDetailEditForm.patchValue({ referenceType: '' })
    }
  }

  CountrynameSwitch: boolean = false;
  Countrynameclose() {
    this.CountrynameSwitch = false;
    if (this.selectedCountryId === undefined && this.contactDetailEditForm.get('country').dirty) {
      this.contactDetailEditForm.patchValue({ country: '' })
    }
    if (this.SelectedCountryName !== "") {
      this.contactDetailEditForm.patchValue({
        country: this.SelectedCountryName
      });
    }
  }

  Statenameclose() {
    this.StatenameSwitch = false;
    if (this.newStateName === "" && this.contactDetailEditForm.get('stateProvince').dirty) {
      this.contactDetailEditForm.patchValue({ stateProvince: '' })
    }
    if (this.selectedStateName !== "") {
      this.contactDetailEditForm.patchValue({
        stateProvince: this.selectedStateName
      });
    }
  }

  Citynameclose() {
    this.CitynameSwitch = false;
    if (this.newCityName === "" && this.contactDetailEditForm.get('City').dirty) {
      this.contactDetailEditForm.patchValue({ City: '' })
    }
    if (this.selectedCityName !== "") {
      this.contactDetailEditForm.patchValue({
        City: this.selectedCityName
      });
    }
  }

  isContactNumberTrue: boolean = false;
  emailValidationChecksOnSave() {
    let emailValue = this.contactDetailEditForm.value.emailAddress
    console.log("emailValue", emailValue);
    this.contactService.getEmailValidation(false, emailValue, this.contactdetailsGuid).subscribe(res => {
      if (res.IsError === false) {
        if (res.ResponseObject) {
          if (res.ResponseObject.isExists === true) {
            console.log("email Validation isExists", res.IsError);
            this.EmailChecksConatctGuild = res.ResponseObject.Guid
            localStorage.setItem("contactEditId", JSON.stringify(this.EmailChecksConatctGuild))
            this.openduplicatepop();
          } else {
            this.Save();
          }
        } else {
          this.Save();
        }
      } else {
        this.errorMessage.throwError(res.IsError)
      }
    });
  }

  Save() {
    console.log("contactDetail EditForm", this.contactDetailEditForm);
    if (this.contactDetailEditForm.valid) {
      if (this.contactDetailEditForm.value.contacts.length > 1) {
        this.contactDetailEditForm.value.contacts.forEach(element => {
          if (element.MapGuid === '' && element.ContactNo !== '') {
            this.phoneNumberEditInfo.push(element)
          }
          if (element.MapGuid === '' && element.ContactNo === '') {
            this.isContactNumberTrue = true;
            this.errorMessage.throwError("Please enter the phone number");
            return
          } else {
            this.isContactNumberTrue = false;
          }
        });
      } else {
        this.isContactNumberTrue = false;
      }
      let RequestBody = this.generateSaveRequestBody()
      console.log("sending this data to request", RequestBody);
      if (this.isContactNumberTrue == false) {
        this.isLoading = true;
        this.contactservice.getContactEditEnrichmentSave(RequestBody).subscribe(async data => {
          if (data.IsError === false) {
            this.ResetAllStatusChanged();
            this.isLoading = false;
            this.getContactdetail = data.ResponseObject;
            this.contactService.showeditbtn = true
            sessionStorage.removeItem("contactDetailsData")
            sessionStorage.setItem('contactEditMode', JSON.stringify(false))
            this.contactservice.setProfileImageflag(false, null)
            this.isReplace = true;                                                       //this condition is for retail and replace business card
            this.contactservice.sendImage = '';
            this.SelectedReportingManagerId = '';
            this.phoneNumberEditInfo = []
            this.selectedReferenceType = [];
            this.sendReferenceType = [];
            this.contactDetailEditForm.patchValue({
              referenceMode: ''
            });
            this.contactservice.setContactEditName(data.ResponseObject.FName + data.ResponseObject.LName);         // this is for updating the first name while edit and details
            if (!data.ResponseObject.ProfileImage) {
              data.ResponseObject.ProfileImage = RequestBody.ProfileImage;
            }
            const changes = data.ResponseObject;                            //state management for edit 
            const AllContacts: Update<any> = {
              id: data.ResponseObject.Guid,
              changes
            }
            this.store.dispatch(new UpdateMarketDetails({ marketdetailupdates: AllContacts }))         //state management for edit end
            this.store.dispatch(new UpdateContactList({ UpdateContactlist: AllContacts }))
            this.store.dispatch(new UpdateContactDetails({ contactdetailupdate: AllContacts }))
            this.store.dispatch(new ClearContactList())
            this.errorMessage.throwError(data.Message);
            if (!this.contactDetailEditForm.valid) {
              this.service.validateAllFormFields(this.contactDetailEditForm);
              let invalidElements = this.el.nativeElement.querySelectorAll('#validatescroll .ng-invalid');
              if (invalidElements.length) {
                this.scrollTo(invalidElements[0]);
                this.service.validationErrorMessage();
              }
              return;
            }
            this.service.windowScroll();
            // this.nonpatchDetailsFormsave();
          } else {
            this.isLoading = false;
            this.errorMessage.throwError(data.Message);
          }
        }, error => {
          this.isLoading = false;
        });
      }
    }
    else {
      this.service.validateAllFormFields(this.contactDetailEditForm);
      let invalidElements = this.el.nativeElement.querySelectorAll('#validatescroll .ng-invalid');
      if (invalidElements.length) {
        this.scrollTo(invalidElements[0]);
        this.service.validationErrorMessage();
      }
      return;
    }
  }

  generateSaveRequestBody() {
    return {
      "BusinessCardImage": (this.contactService.sendBusinessCardData !== "") ? this.contactService.sendBusinessCardData : this.businessCardUrl,
      "ProfileImage": (this.contactservice.sendImage !== undefined) ? this.contactservice.sendImage : this.profileImage,
      "Guid": this.ContactEditID,
      "Salutation": { Id: Number(this.contactDetailEditForm.value.salutation) },
      "FName": this.contactDetailEditForm.value.firstName,
      "LName": this.contactDetailEditForm.value.lastName,
      "Email": this.contactDetailEditForm.value.emailAddress,
      "Designation": this.contactDetailEditForm.value.designation,
      "Relationship": { Id: Number(this.contactDetailEditForm.value.relationship) },
      "Account": this.filterAccount(),
      "ReportingManager": this.filterReportingManager(),
      "Contact": this.filterPhoneContact(this.contactDetailEditForm.value.contacts),
      "isKeyContact": (this.contactDetailEditForm.value.keyContact === "") ? "" : this.contactDetailEditForm.value.keyContact,
      "Referenceable": (this.contactDetailEditForm.value.referenceable === "") ? "" : this.contactDetailEditForm.value.referenceable,
      "ReferenceMode": this.filterReferenceMode(),
      "Category": { Id: Number(this.contactDetailEditForm.value.category) },
      "isPrivate": true,
      "isLinkedinProfileAvail": true,
      "LinkedinUrl": this.LinkendUrldata,
      "TwitterUrl": this.TwitterUrldata,
      "CBU": this.filterCbu(),
      "IsBusinessContact": true,
      "CustomerAddress": {
        Address1: this.contactDetailEditForm.value.address1,
        Address2: this.contactDetailEditForm.value.address2,
        Street: this.contactDetailEditForm.value.streetName,
        City: this.filterCity(),
        Country: { "SysGuid": this.selectedCountryId },
        State: this.filterState(),
        ZipCode: this.contactDetailEditForm.value.zipPostalCode
      },
      "MeetingDetails": {
        Owner: { "SysGuid": "" },
        MeetingFrequency: 0
      },
      "MarketingDetail": this.filterMarketingDetails(),
      "ReferenceType": (this.sendReferenceType.length > 0) ? this.sendReferenceType : []
    }
  }

  filterAccount() {
    if (this.contactDetailEditForm.value.accountName != '' && this.selectedAccountId != undefined && this.selectedAccountId != null) {
      return {
        "SysGuid": this.selectedAccountId,
        "isProspect": this.isProspect
      }
    } else {
      return {
        "SysGuid": "",
        "isProspect": ""
      }
    }
  }
  filterReportingManager() {
    if (this.contactDetailEditForm.value.reportingManager != '' && this.ReportingManagerName != '' && this.ReportingManagerName != undefined) {
      return {
        "SysGuid": this.SelectedReportingManagerId,
        "LinkActionType": 4
      }
    } else {
      return {
        "SysGuid": (this.contactDetails.ReportingManager) ? (this.contactDetails.ReportingManager.SysGuid) ? this.contactDetails.ReportingManager.SysGuid : "" : "",
        "LinkActionType": (this.contactDetails.ReportingManager) ? (this.contactDetails.ReportingManager.SysGuid) ? (this.contactDetails.ReportingManager.SysGuid != null && this.contactDetails.ReportingManager.SysGuid != undefined) ? 3 : 3 : 2 : 2
      }
    }
  }
  filterCbu() {
    if (this.contactDetailEditForm.value.CBU != '' && this.selectedCBUId != undefined && this.CBUName != undefined) {
      return {
        "SysGuid": this.selectedCBUIdId,
        "LinkActionType": 4
      }
    } else {
      return {
        "SysGuid": (this.contactDetails.CBU) ? (this.contactDetails.CBU.SysGuid) ? this.contactDetails.CBU.SysGuid : "" : "",
        "LinkActionType": (this.contactDetails.CBU) ? (this.contactDetails.CBU.SysGuid) ? (this.contactDetails.CBU.SysGuid != null && this.contactDetails.CBU.SysGuid != undefined) ? 3 : 3 : 2 : 2
      }
    }
  }
  filterState() {
    if (this.contactDetailEditForm.value.stateProvince != '' && this.selectedStateName != '' && this.selectedStateName != undefined) {
      return {
        "SysGuid": this.selectedStateId,
        "LinkActionType": 4
      }
    } else {
      return {
        "SysGuid": (this.contactDetails.CustomerAddress.State) ? (this.contactDetails.CustomerAddress.State.SysGuid) ? this.contactDetails.CustomerAddress.State.SysGuid : "" : "",
        "LinkActionType": (this.contactDetails.CustomerAddress.State) ? (this.contactDetails.CustomerAddress.State.SysGuid) ? (this.contactDetails.CustomerAddress.State.SysGuid != null && this.contactDetails.CustomerAddress.State.SysGuid != undefined) ? 3 : 3 : 2 : 2
      }
    }
  }
  filterCity() {
    if (this.contactDetailEditForm.value.City != '' && this.selectedCityName != '' && this.selectedCityName != undefined) {
      return {
        "SysGuid": this.selectedCityGuid,
        "LinkActionType": 4
      }
    } else {
      return {
        "SysGuid": (this.contactDetails.CustomerAddress.City) ? (this.contactDetails.CustomerAddress.City.SysGuid) ? this.contactDetails.CustomerAddress.City.SysGuid : "" : "",
        "LinkActionType": (this.contactDetails.CustomerAddress.City) ? (this.contactDetails.CustomerAddress.City.SysGuid) ? (this.contactDetails.CustomerAddress.City.SysGuid != null && this.contactDetails.CustomerAddress.City.SysGuid != undefined) ? 3 : 3 : 2 : 2
      }
    }
  }
  filterCategory() {
    if (this.contactDetailEditForm.value.category != null && this.contactDetailEditForm.value.category != "") {
      return {
        Id: Number(this.contactDetailEditForm.value.category),
        LinkActionType: 4
      }
    }
    else {
      return {
        Id: (this.contactDetails.Category) ? this.contactDetails.Category.Id : "",
        LinkActionType: 3
      }
    }
  }
  filterReferenceMode() {
    if (this.contactDetailEditForm.value.referenceMode != null && this.contactDetailEditForm.value.referenceMode != "") {
      return {
        Id: Number(this.contactDetailEditForm.value.referenceMode),
        LinkActionType: 4
      }
    }
    else {
      return {
        Id: (this.contactDetails.referenceMode) ? this.contactDetails.referenceMode.Id : "",
        LinkActionType: 3
      }
    }
  }
  filterPhoneContact(data) {
    let DuplicatephoneIdentify = []
    console.log(this.ExistingContactPhoneNumbers)
    console.log(data)
    if (this.ExistingContactPhoneNumbers.length > 0) {
      if (data.length > 0) {
        let newContact = []
        newContact = data.filter(x => x.MapGuid == "")
        newContact = newContact.map(x => {
          return x = { ...x, LinkActionType: 1 }
        })
        data = data.filter(x => x.MapGuid != "")
        data.forEach(x => {
          if (this.ExistingContactPhoneNumbers.some(y => y.MapGuid == x.MapGuid)) {
            if (x.ContactNo == "") {
              DuplicatephoneIdentify.push({ ...x, LinkActionType: 3 })
            } else {
              DuplicatephoneIdentify.push({ ...x, LinkActionType: 2 })
            }
          } else {
            DuplicatephoneIdentify.push({ ...x, LinkActionType: 1 })
          }
        });
        return DuplicatephoneIdentify.concat(this.deletedExistingContact, newContact)
      } else {
        return this.ExistingContactPhoneNumbers.map(x => {
          return {
            ContactNo: x.ContactNo,
            ContactType: x.ContactType,
            MapGuid: (x.MapGuid) ? x.MapGuid : "",
            LinkActionType: 3,
          }
        })
      }
    } else {
      if (data.length == 1) {
        if (data.some(x => x.ContactNo == "")) {
          return []
        } else {
          return data.map(x => {
            return {
              ContactNo: x.ContactNo,
              ContactType: x.ContactType,
              MapGuid: (x.MapGuid) ? x.MapGuid : "",
              LinkActionType: 1,
            }
          })
        }
      } else if (data.length > 0) {
        return data.map(x => {
          return {
            ContactNo: x.ContactNo,
            ContactType: x.ContactType,
            MapGuid: (x.MapGuid) ? x.MapGuid : "",
            LinkActionType: 1,
          }
        })
      } else {
        return []
      }
    }
  }

  filterMarketingDetails() {
    if (!this.contactService.showeditbtn && sessionStorage.getItem('contactDetailsData')) {
      let MarketingInfoData = JSON.parse(sessionStorage.getItem('contactDetailsData'))
      console.log(MarketingInfoData);
      return {
        Function: { "Id": MarketingInfoData.MarketingDetail.Function.Id },
        GDPR: MarketingInfoData.MarketingDetail.GDPR,
        Solicit: MarketingInfoData.MarketingDetail.Solicit,
        Industry: (MarketingInfoData.MarketingDetail.Industry == null) ? { "wipro_sicindustryclassificationid": "" } : { "wipro_sicindustryclassificationid": MarketingInfoData.MarketingDetail.Industry },
        InterestList: (MarketingInfoData['MarketingDetail']['InterestList']) ? MarketingInfoData['MarketingDetail']['InterestList'] : []
      }
    } else {
      return {
        Function: { "Id": this.getContactdetail.MarketingDetail.Function.Id },
        GDPR: this.getContactdetail.MarketingDetail.GDPR,
        Solicit: this.getContactdetail.MarketingDetail.Solicit,
        Industry: (this.getContactdetail.MarketingDetail.Industry.wipro_sicindustryclassificationid == null) ? { "wipro_sicindustryclassificationid": "" } : { "wipro_sicindustryclassificationid": this.getContactdetail.MarketingDetail.Industry },
        InterestList: (this.getContactdetail.MarketingDetail['InterestList'])
      }
    }
  }

  ResetAllStatusChanged() {
    this.isReportingManagerChanged = false;
    this.isCBUChanged = false;
    this.isCitychanged = false;
    this.isStatechanged = false;
  }

  getContactDetails() {
    this.contactservice.setContactEditName("");
    this.isLoading = true;
    this.contactservice.getContactdetails(this.ContactEditID).subscribe(res => {
      if (res.IsError === false) {
        this.contactservice.setContactEditName(res.ResponseObject.FName + res.ResponseObject.LName)
        this.isLoading = false;
        this.getContactdetail = res.ResponseObject;
        console.log("getContactDetails", this.getContactdetail);
        this.contactdetailsGuid = res.ResponseObject.Guid
        if (res.ResponseObject.ProfileImage) {
          this.profileImage = res.ResponseObject.ProfileImage
        } else {
          this.profileImage = null
        }
        if (res.ResponseObject.BusinessCardMimeType != '' && res.ResponseObject.BusinessCardBase64string !='') {
          this.imageSrc = "data:" + res.ResponseObject.BusinessCardMimeType + ";base64," + res.ResponseObject.BusinessCardBase64string;
        }
        if (res.ResponseObject.BusinessCardImage) {
          this.businessCardUrl = res.ResponseObject.BusinessCardImage
        } else {
          this.businessCardUrl = null
        }
        const ImmutabelObj = { ...res.ResponseObject, id: res.ResponseObject.Guid }
        this.store.dispatch(new LoadContactDetailsById({ contactDetails: ImmutabelObj }))
      } else {
        this.isLoading = false;
        this.errorMessage.throwError(res.Message);
      }
    });
  }

  createContactTempData() {
    console.log("createContactTempData", this.businessCardUrl)
    return {
      "Guid": this.ContactEditID,
      "Salutation": {
        "Id": Number(this.contactDetailEditForm.value.salutation)
      },
      "FName": this.contactDetailEditForm.value.firstName,
      "LName": this.contactDetailEditForm.value.lastName,
      "Contact": this.contactDetailEditForm.value.contacts,
      "Email": this.contactDetailEditForm.value.emailAddress,
      "isKeyContact": this.contactDetailEditForm.value.keyContact,
      "Referenceable": this.contactDetailEditForm.value.referenceable,
      "ReferenceType": (this.sendReferenceType.length > 0) ? this.sendReferenceType : [],
      "ReferenceMode": this.filterReferenceMode(),
      "Category": {
        "Id": Number(this.contactDetailEditForm.value.category),
      },
      "BusinessCardImage": this.businessCardUrl,
      "Designation": this.contactDetailEditForm.value.designation,
      "CustomerAccount": {
        "SysGuid": this.selectedAccountId,
        "Name": this.AccountName,
        "isProspect": this.isProspect
      },
      "Relationship": {
        "Id": Number(this.contactDetailEditForm.value.relationship),
      },
      "LinkedinUrl": this.LinkendUrldata,
      "TwitterUrl": this.TwitterUrldata,
      "CBU": {
        SysGuid: this.selectedCBUId,
        Name: this.CBUName
      },
      "isNewsFlashes": this.contactDetails.isNewsFlashes,
      "isInvitationforWebinars": this.contactDetails.isInvitationforWebinars,
      "isSurveyorResearch": this.contactDetails.isSurveyorResearch,
      "isHolidaycard": this.contactDetails.isHolidaycard,
      "isEligibility": this.contactDetails.isEligibility,
      "isInfoonoffers": this.contactDetails.isInfoonoffers,
      "ReportingManager": {
        SysGuid: this.SelectedReportingManagerId,
        FullName: this.ReportingManagerName
      },
      "CustomerAddress": {
        "City": {
          SysGuid: this.selectedCityGuid,
          Name: this.selectedCityName
        },
        "Country": {
          "SysGuid": this.selectedCountryId,
          "Name": this.SelectedCountryName
        },
        "State": {
          "SysGuid": this.selectedStateId,
          "Name": this.selectedStateName
        },
        "Address1": this.contactDetailEditForm.value.address1,
        "Address2": this.contactDetailEditForm.value.address2,
        "Street": this.contactDetailEditForm.value.streetName,
        "ZipCode": this.contactDetailEditForm.value.zipPostalCode
      },
      "MarketingDetail": this.CreateMarketingInfoData(),
      "deletedExistingContact": this.deletedExistingContact
    }
  }

  CreateMarketingInfoData() {
    if (!this.contactService.showeditbtn && sessionStorage.getItem('contactDetailsData')) {
      return JSON.parse(sessionStorage.getItem('contactDetailsData')).MarketingDetail
    } else {
      return this.MarketingInfoDetails
    }
  }

  navigateToRelationshiplog() {
    //check form is valid
    if (!this.contactService.showeditbtn) {
      if (this.CheckIfFormIsValid()) {
        sessionStorage.setItem('contactDetailsData', JSON.stringify(this.createContactTempData()))
        this.router.navigate(['/contacts/Contactdetailslanding/relationLog'])
      } else {
        this.service.validateAllFormFields(this.contactDetailEditForm);
        return
      }
    }
    //navigate if readonly mode
    if (this.contactService.showeditbtn) {
      sessionStorage.removeItem("contactDetailsData")
      this.router.navigate(['/contacts/Contactdetailslanding/relationLog'])
    }
  }

  navigateToMarketingInfo() {
    if (!this.contactService.showeditbtn) {
      if (this.CheckIfFormIsValid()) {
        sessionStorage.setItem('contactDetailsData', JSON.stringify(this.createContactTempData()))
        this.router.navigate(['/contacts/Contactdetailslanding/marketInfo'])
      } else {
        this.service.validateAllFormFields(this.contactDetailEditForm);
      }
    }
    if (this.contactService.showeditbtn) {
      sessionStorage.removeItem("contactDetailsData")
      this.router.navigate(['/contacts/Contactdetailslanding/marketInfo'])
    }
  }

  onChanges() {
    this.isLoading = true;
    this.contactDetailEditForm.get('accountName').valueChanges.subscribe(val => {
      if (val == "") {
        this.getAccountCompany = []
        this.selectedAccountId = undefined
        this.ngclass = true;
      }
      if (val !== "" && this.AccountNameSwitch === true && val != undefined) {
        this.getAccountCompany = []
        this.isAccountNameSearchLoading = true;
        this.contactservice.getsearchAccountCompany(val).subscribe(data => {
          this.isAccountNameSearchLoading = false;
          if (data.IsError === false) {
            this.isLoading = false;
            this.getAccountCompany = data.ResponseObject;
            this.lookupdata.tabledata = data.ResponseObject;
          }
          else {
            this.isLoading = false;
            this.errorMessage.throwError(data.Message);
            this.getAccountCompany = []
          }
        }, error => {
          this.isAccountNameSearchLoading = false;
          this.getAccountCompany = []
        });
      }
    });
    this.contactDetailEditForm.get('reportingManager').valueChanges.subscribe(val => {
      if (this.contactDetailEditForm.get('reportingManager').dirty && this.ReportingManagerSwitch) {
        if (this.selectedAccountId !== undefined) {
          this.isReportingManagerSearchLoading = true;
          this.getReportingManager = []
          this.contactservice.searchReportingManagerByAccountName(this.selectedAccountId, this.isProspect, val).subscribe(data => {
            this.isReportingManagerSearchLoading = false;
            if (data.IsError === false) {
              this.isLoading = false;
              this.getReportingManager = data.ResponseObject;
            } else {
              this.isLoading = false;
              this.errorMessage.throwError(data.Message);
              this.getReportingManager = []
            }
          }, error => {
            this.isReportingManagerSearchLoading = false
            this.getReportingManager = []
          });
        }
      } else {
        if (this.cacheDataService.cacheDataGet('contactReportingManager').length > 0) {
          this.getReportingManager = this.cacheDataService.cacheDataGet('contactReportingManager')
        }
        this.isReportingManagerSearchLoading = false;
      }
    });
    this.contactDetailEditForm.get('CBU').valueChanges.subscribe(val => {
      if (this.contactDetailEditForm.get('CBU').dirty && this.CBUSwitch) {
        if (this.selectedAccountId !== undefined) {
          this.isCBUSearchLoading = true;
          this.getCBU = []
          this.contactservice.cbuByAccountName(this.selectedAccountId, this.isProspect, val).subscribe(data => {
            this.isCBUSearchLoading = false;
            if (data.IsError === false) {
              this.isLoading = false;
              this.getCBU = data.ResponseObject;
              this.lookupdata.TotalRecordCount = data.TotalRecordCount;
              this.lookupdata.tabledata = data.ResponseObject;
            }
            else {
              this.isLoading = false;
              this.errorMessage.throwError(data.Message);
              this.getCBU = []
            }
          }, error => {
            this.isCBUSearchLoading = false;
            this.getCBU = []
          });
        }
      } else {
        if (this.cacheDataService.cacheDataGet('contactCBU').length > 0) {
          this.getCBU = this.cacheDataService.cacheDataGet('contactCBU')
        }
        this.isCBUSearchLoading = false;
      }
    });
    this.contactDetailEditForm.get('country').valueChanges.subscribe(val => {
      if (this.contactDetailEditForm.get('country').dirty && this.CountrynameSwitch) {
        this.getCountry = []
        this.isCountrySearchLoading = true;
        this.contactservice.getAllCountry(val).subscribe(data => {
          this.isCountrySearchLoading = false;
          if (data.IsError === false) {
            this.isLoading = false;
            this.getCountry = data.ResponseObject;
          }
          else {
            this.isLoading = false;
            this.errorMessage.throwError(data.Message);
            this.getCountry = []
          }
        }, error => {
          this.isCountrySearchLoading = false;
          this.getCountry = []
        });
      } else {
        if (this.cacheDataService.cacheDataGet('contactCountry').length > 0) {
          this.getCountry = this.cacheDataService.cacheDataGet('contactCountry')
        }
      }
    });
    this.contactDetailEditForm.get('stateProvince').valueChanges.subscribe(val => {
      if (val === "") {
        this.selectedCityName = ""
        this.getState = []
        this.contactDetailEditForm.patchValue({
          City: ''
        })
        this.contactDetailEditForm.controls['City'].disable();
        this.contactDetailEditForm.controls['City'].reset();
        this.ngclass = true;
      }
      if (this.contactDetailEditForm.get('stateProvince').dirty && this.StatenameSwitch) {
        this.isStateSearchLoading = true;
        this.getState = []
        this.contactservice.searchStateByCountry(this.selectedCountryId, val).subscribe(data => {
          this.isStateSearchLoading = false;
          if (data.IsError === false) {
            this.isLoading = false;
            this.getState = data.ResponseObject;
          } else {
            this.isLoading = false;
            this.errorMessage.throwError(data.Message);
            this.getState = []
          }
        }, error => {
          this.isStateSearchLoading = false;
          this.getState = []
        });
      } else {
        if (this.cacheDataService.cacheDataGet('contactState').length > 0) {
          this.getState = this.cacheDataService.cacheDataGet('contactState');
        }
        this.isStateSearchLoading = false;
      }
    });
    this.contactDetailEditForm.get('City').valueChanges.subscribe(val => {
      if (this.contactDetailEditForm.get('City').dirty && this.CitynameSwitch) {
        if (this.selectedStateId !== undefined && this.selectedStateId !== "") {
          this.isCitySearchLoading = true;
          this.getCity = []
          this.contactservice.SearchCityByState(this.selectedStateId, val).subscribe(data => {
            this.isCitySearchLoading = false;
            if (data.IsError === false) {
              this.isLoading = false;
              this.getCity = data.ResponseObject;
            } else {
              this.isLoading = false;
              this.errorMessage.throwError(data.Message);
              this.getCity = []
            }
          }, error => {
            this.isCitySearchLoading = false;
            this.getCity = []
          });
        }
      } else {
        this.isCitySearchLoading = false;
      }
    });
    this.contactDetailEditForm.get('referenceType').valueChanges.subscribe(val => {
      if (this.contactDetailEditForm.get('referenceType').dirty && this.ReferenceTypeSwitch) {
        this.isReferenceTypeSearchLoading = true;
        this.getReferenceType = []
        this.contactService.getSearchReferenceTypeByID(val).subscribe(res => {
          this.isReferenceTypeSearchLoading = false;
          if (!res.IsError) {
            this.getReferenceType = res.ResponseObject;
            console.log("get ReferenceType", this.getReferenceType);
          } else {
            this.errorMessage.throwError(res.Message);
            this.getReferenceType = []
          }
        }, error => {
          this.isReferenceTypeSearchLoading = false;
          this.getReferenceType = []
        });
      } else {
        if (this.cacheDataService.cacheDataGet('contactReferenceType').length > 0) {
          this.isReferenceTypeSearchLoading = false;
          this.getReferenceType = this.cacheDataService.cacheDataGet('contactReferenceType')
        }
      }
    });
  }
  //------------ Selection changes for dropdown -------------------------
  salutationId: any;
  salutaionName: any;
  salutationTypeAria: any
  relationId: any;
  relationName: any;
  relationTypeAria: any
  categoryId: any;
  categoryName: any;
  categoryTypeAria: any = ''
  appendSalutationType(event) {
    console.log("appendSalutationType", event)
    if (!this.isEmpty(event)) {
      this.salutationId = event.value;
      this.salutation.forEach(element => {
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
      this.relationship.forEach(element => {
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
  appendReferenceMode(event) {
    console.log("appendReferenceMode", event);
    if (!this.isEmpty(event)) {
      this.referenceModeId = event.value;
      this.ContactReferenceMode.forEach(element => {
        if (element.Id == this.referenceModeId) {
          this.referenceModeName = element.Value
          this.referenceModeAria = this.referenceModeName
          console.log("referenceModeAria", this.referenceModeAria);
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

  checkEditOrReadMode() {
    if (sessionStorage.getItem('contactEditMode')) {
      this.contactService.showeditbtn = !JSON.parse(sessionStorage.getItem('contactEditMode'))
    } else {
      this.contactService.showeditbtn = true
    }
  }

  CheckIfFormIsValid() {
    if (!this.contactDetailEditForm.valid) {
      this.service.validateAllFormFields(this.contactDetailEditForm);
      let invalidElements = this.el.nativeElement.querySelectorAll('#validatescroll .ng-invalid');
      if (invalidElements.length) {
        this.scrollTo(invalidElements[0]);
        this.service.validationErrorMessage();
      }
      return;
    }
    this.service.windowScroll();
    return this.contactDetailEditForm.valid;
  }

  getSymbol(data) {
    return unescape(JSON.parse('"' + data + '"')).replace(/\?/g, '/');
  }

  salutationfilterId: any
  getMasterDatas() {
    this.masterApi.getFunction().subscribe(res => {
      if (res.IsError === false) {
        this.offlineService.addMasterApiCache(routes.function, res)
        this.functionType = res.ResponseObject;
      }
    });
    this.masterApi.getSalutation().subscribe(res => {
      if (res.IsError === false) {
        this.offlineService.addMasterApiCache(routes.salutation, res)
        this.salutation = res.ResponseObject;
        console.log("salutation a", this.salutation);
      }
    });
    this.masterApi.getRelationship().subscribe(res => {
      if (res.IsError === false) {
        this.offlineService.addMasterApiCache(routes.relationship, res)
        this.relationship = res.ResponseObject;
      }
    });
    this.masterApi.getCategory().subscribe(res => {
      if (res.IsError === false) {
        this.offlineService.addMasterApiCache(routes.categoryapi, res)
        this.categoryData = res.ResponseObject;
        this.categoryData = res.ResponseObject.map(x => x = { ...x, Value: this.getSymbol(x.Value) });;
        console.log("category Masterdata", this.categoryData);
      }
    });
    this.masterApi.getContactType().subscribe(data => {
      if (data.IsError === false) {
        this.offlineService.addMasterApiCache(routes.getContactType, data)
        this.phoneContactType = data.ResponseObject;
      } else {
        this.Popup.throwError(data.Message)
      }
    });
    this.masterApi.getContactReferenceMode().subscribe(res => {
      if (res.IsError === false) {
        this.offlineService.addMasterApiCache(routes.contactReferenceMode, res)
        this.ContactReferenceMode = res.ResponseObject;
        console.log("ContactReferenceMode", this.ContactReferenceMode);
      }
    });
  }

  callTempAccountname() {
    if (this.contactDetailEditForm.value.accountName == '' && this.AccountNameSwitch) {
      this.isAccountNameSearchLoading = true
      this.getAccountCompany = []
      this.contactService.getsearchAccountCompany("").subscribe(res => {
        this.isAccountNameSearchLoading = false
        this.isLoading = false;
        if (res.IsError === false) {
          this.getAccountCompany = res.ResponseObject;
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.tabledata = res.ResponseObject;
        } else {
          this.errorMessage.throwError(res.Message);
          this.getAccountCompany = []
        }
      }, error => {
        this.isAccountNameSearchLoading = false;
        this.getAccountCompany = []
      });
    } else {
      this.isAccountNameSearchLoading = false;
    }
  }
  callTempReportingManager() {
    this.contactDetailEditForm.patchValue({
      reportingManager: ''
    })
    if (!this.contactDetailEditForm.value.reportingManager && this.ReportingManagerSwitch) {
      this.isReportingManagerSearchLoading = true
      this.getReportingManager = []
      if (this.cacheDataService.cacheDataGet('contactReportingManager').length > 0) {
        this.getReportingManager = this.cacheDataService.cacheDataGet('contactReportingManager')
        this.isReportingManagerSearchLoading = false;
      } else {
        this.contactService.searchReportingManagerByAccountName(this.selectedAccountId, this.isProspect, "").subscribe(res => {
          this.isReportingManagerSearchLoading = false
          if (res.IsError === false) {
            this.getReportingManager = res.ResponseObject;
            this.cacheDataService.cacheDataSet('contactReportingManager', res.ResponseObject)
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          } else {
            this.errorMessage.throwError(res.Message);
            this.getReportingManager = []
            this.cacheDataService.cacheDataReset("contactReportingManager")
          }
        }, error => {
          this.isReportingManagerSearchLoading = false;
          this.getReportingManager = []
          this.cacheDataService.cacheDataReset("contactReportingManager")
        });
      }
    } else {
      this.isReportingManagerSearchLoading = false;
    }
  }
  callTempCBU() {
    this.contactDetailEditForm.patchValue({
      CBU: ''
    })
    if (!this.contactDetailEditForm.value.CBU && this.CBUSwitch) {
      this.isCBUSearchLoading = true
      this.getReportingManager = []
      if (this.cacheDataService.cacheDataGet('contactCBU').length > 0) {
        this.getCBU = this.cacheDataService.cacheDataGet('contactCBU');
        this.isCBUSearchLoading = false
      } else {
        this.contactService.cbuByAccountName(this.selectedAccountId, this.isProspect, "").subscribe(res => {
          this.isCBUSearchLoading = false
          this.getCBU = []
          if (res.IsError === false) {
            this.getCBU = res.ResponseObject;
            this.cacheDataService.cacheDataSet('contactCBU', res.ResponseObject);
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
            this.lookupdata.tabledata = res.ResponseObject;
          } else {
            this.errorMessage.throwError(res.Message);
            this.cacheDataService.cacheDataReset('contactCBU');
          }
        }, error => {
          this.isCBUSearchLoading = false;
          this.cacheDataService.cacheDataReset('contactCBU');
        });
      }
    } else {
      this.isCBUSearchLoading = false;
    }
  }
  callTempCountry() {
    this.contactDetailEditForm.patchValue({
      country: ''
    })
    this.contactDetailEditForm.controls['stateProvince'].enable();
    this.ngclass = false;
    if (!this.contactDetailEditForm.value.country && this.CountrynameSwitch) {
      this.isCountrySearchLoading = true
      this.getCountry = []
      if (this.cacheDataService.cacheDataGet('contactCountry').length > 0) {
        this.isCountrySearchLoading = false
        this.getCountry = this.cacheDataService.cacheDataGet('contactCountry');
      } else {
        this.contactService.getAllCountry("").subscribe(res => {
          this.isCountrySearchLoading = false
          this.isLoading = false;
          if (res.IsError === false) {
            this.getCountry = res.ResponseObject;
            this.cacheDataService.cacheDataSet('contactCountry', res.ResponseObject);
          } else {
            this.errorMessage.throwError(res.Message);
            this.cacheDataService.cacheDataReset('contactCountry');
          }
        }, error => {
          this.isCountrySearchLoading = false;
          this.cacheDataService.cacheDataReset('contactCountry');
        });
      }
    }
  }
  callTempState() {
    this.contactDetailEditForm.patchValue({
      stateProvince: ''
    });
    if (this.contactDetailEditForm.value.stateProvince == '' && this.StatenameSwitch) {
      this.isStateSearchLoading = true
      this.getState = []
      if (this.cacheDataService.cacheDataGet('contactState').length > 0) {
        this.isStateSearchLoading = false
        this.getState = this.cacheDataService.cacheDataGet('contactState');
      } else {
        this.contactService.searchStateByCountry(this.selectedCountryId, "").subscribe(res => {
          this.isStateSearchLoading = false
          if (res.IsError === false) {
            this.getState = res.ResponseObject;
            if (this.getState.length > 0) {
              this.ngclass = true;
            }
            this.cacheDataService.cacheDataSet('contactState', res.ResponseObject);
          } else {
            this.ngclass = true;
            this.errorMessage.throwError(res.Message);
            this.cacheDataService.cacheDataReset('contactState');
            this.getState = []
          }
        }, error => {
          this.isStateSearchLoading = false;
          this.ngclass = true;
          this.cacheDataService.cacheDataReset('contactState');
          this.getState = []
        });
      }
    }
  }
  callTempCity() {
    this.contactDetailEditForm.patchValue({
      City: ''
    });
    if (this.contactDetailEditForm.value.City == '' && this.CitynameSwitch) {
      this.isCitySearchLoading = true
      this.getCity = []
      if (this.cacheDataService.cacheDataGet('contactCity').length > 0) {
        this.isCitySearchLoading = false
        this.getCity = this.cacheDataService.cacheDataGet('contactCity');
      } else {
        this.contactService.SearchCityByState(this.selectedStateId, "").subscribe(res => {
          this.isCitySearchLoading = false
          this.isLoading = false;
          if (res.IsError === false) {
            this.getCity = res.ResponseObject;
            this.cacheDataService.cacheDataSet('contactCity', res.ResponseObject);
          } else {
            this.errorMessage.throwError(res.Message);
            this.cacheDataService.cacheDataReset('contactCity');
            this.getCity = []
          }
        }, error => {
          this.isCitySearchLoading = false;
          this.cacheDataService.cacheDataReset('contactCity');
          this.getCity = []
        });
      }
    }
  }
  callTempReferenceType() {
    this.contactDetailEditForm.patchValue({
      referenceType: ''
    });
    this.isReferenceTypeSearchLoading = true
    this.getReferenceType = []
    if (this.cacheDataService.cacheDataGet('contactReferenceType').length > 0) {
      this.isReferenceTypeSearchLoading = false
      this.getReferenceType = this.cacheDataService.cacheDataGet('contactReferenceType');
    } else {
      this.contactService.getSearchReferenceTypeByID("").subscribe(res => {
        this.isReferenceTypeSearchLoading = false
        this.isLoading = false;
        if (res.IsError === false) {
          this.getReferenceType = res.ResponseObject;
          this.cacheDataService.cacheDataSet('contactReferenceType', res.ResponseObject);
        } else {
          this.errorMessage.throwError(res.Message);
          this.cacheDataService.cacheDataReset('contactReferenceType');
        }
      }, error => {
        this.isReferenceTypeSearchLoading = false;
        this.cacheDataService.cacheDataReset('contactReferenceType');
      });
    }
  }
  //---- Clear search lookup data ---------
  clearReportingManagerName() {
    this.contactDetailEditForm.patchValue({
      reportingManager: ""
    });
    this.SelectedReportingManagerId = ''
    this.ReportingManagerName = ''
  }
  clearCBUName() {
    this.contactDetailEditForm.patchValue({
      CBU: ""
    });
    this.selectedCBUId = ''
    this.CBUName = ''
  }
  clearCountryName() {
    this.contactDetailEditForm.patchValue({
      country: "",
      stateProvince: "",
      City: ""
    });
    this.getCountry = []
    this.selectedCountryId = undefined
    this.ngclass = true;
    this.SelectedCountryName = ''
    this.selectedCountryId = ''
    this.selectedStateId = '';
    this.selectedStateName = ''
    this.selectedCityGuid = '';
    this.selectedCityName = ''
    this.contactDetailEditForm.controls['stateProvince'].disable();
    this.contactDetailEditForm.controls['City'].disable();
    this.cacheDataService.cacheDataMultiReset(['contactState', 'contactCity'])
    this.CountryResetCacheData();
  }
  clearStateName() {
    this.contactDetailEditForm.patchValue({
      stateProvince: "",
      City: ""
    });
    this.getState = []
    this.selectedStateId = undefined;
    this.selectedStateId = ''
    this.selectedStateName = ''
    this.selectedCityGuid = ''
    this.selectedCityName = ''
    this.contactDetailEditForm.controls['City'].disable();
    this.ngclass = true;
    this.StateResetCacheData();
  }
  clearCityName() {
    this.contactDetailEditForm.patchValue({
      City: ""
    });
    this.selectedCityGuid = ''
    this.selectedCityName = ''
  }
  CountryResetCacheData() {
    this.cacheDataService.cacheDataMultiReset(
      [
        'contactCountry',
        'contactState',
        'contactCity',
      ]
    )
  }
  StateResetCacheData() {
    this.cacheDataService.cacheDataMultiReset(
      [
        'contactState',
        'contactCity',
      ]
    )
  }
  removeNumbers(event) {
    var k = event.charCode;
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
  //----------------- File upload ----------------------------

  isReplace: boolean = true
  accept = ['image/jpg', 'image/jpeg', 'image/png', 'image/PJP', 'image/gif'];
  public detectFilesRead(e, eleId: string): void | boolean {
    var data = <HTMLInputElement>document.getElementById(eleId);
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    console.log(file)
    if (!this.accept.includes(file.type)) {
      this.isLoading = false;
      this.errorMessage.throwError('Please upload a valid image format');
      return
    }
    if (file.type && file.type.match(pattern)) {
      if (file.size > 5242880) {
        this.isLoading = false;
        this.errorMessage.throwError("Not able to upload the file because filesize is greater than 5mb")
        return false
      } else {
        var reader = new FileReader();
        this.businessCardFile = file;
        reader.onload = this._handleReaderLoaded.bind(this);
        console.log('base 64', reader.onload);
        reader.readAsDataURL(file);
      }
    } else {
      data.value = "";
      this.errorMessage.throwError("Please upload a valid file");
      return false;
    }
  }
  _handleReaderLoaded(e) {
    this.imageSrc = null;
    console.log(e)
    let reader = e.target;
    let imgSrc = reader.result;
    let response: any;
    this.isLoading = true;
    this.fileService.base64to_ocr(imgSrc).subscribe(res => {
      this.isLoading = false;
      let data = (typeof (res) == "string") ? JSON.parse(res) : ''
      this.uploadFileAPICall(this.businessCardFile, data);
    });
  }
  private uploadFileAPICall(file: File, response: any): void {
    const formData: FormData = new FormData();
    formData.append('file', file);
    this.isLoading = true;
    this.fileService.filesToUploadDocument64([formData]).subscribe((res) => { 
      this.isLoading = false;
      if (res) { 
        var data = "data:" + res[0].ResponseObject.MimeType + ";base64," + res[0].ResponseObject.Base64String;
        this.businessCardUrl = res[0].ResponseObject.Url;
        this.imageSrc = data;
        this.businessCardFile = undefined;
        if (response) {
          if (this.isReplace == true) {
            if (response.Result.Content[0].name.length > 0) {
              this.contactDetailEditForm.patchValue({ firstName: response.Result.Content[0].name[0] });
            }
            if (response.Result.Content[0].name.length > 0) {
              this.contactDetailEditForm.patchValue({ lastName: response.Result.Content[0].name[1] });
            }
            if (response.Result.Content[0].designation.length > 0) {
              this.contactDetailEditForm.patchValue({ designation: response.Result.Content[0].designation[0] });
            }
            if (response.Result.Content[0].email.length > 0) {
              this.contactDetailEditForm.patchValue({ emailAddress: response.Result.Content[0].email[0] });
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
              this.contactDetailEditForm.setControl('contacts', phoneNumberFormArray);
            }
            if (response.Result.Content[0].address.length > 0) {
              this.contactDetailEditForm.patchValue({ address1: response.Result.Content[0].address[0] });
            }
          } else {

            if (this.contactDetailEditForm.controls.firstName.value) {
              this.contactDetailEditForm.patchValue({ firstName: this.contactDetailEditForm.controls.firstName.value });
            } else {
              this.contactDetailEditForm.patchValue({ firstName: response.Result.Content[0].name[0] })
            }
            if (this.contactDetailEditForm.controls.lastName.value) {
              this.contactDetailEditForm.patchValue({ lastName: this.contactDetailEditForm.controls.lastName.value });
            } else {
              this.contactDetailEditForm.patchValue({ lastName: response.Result.Content[0].name[1] });
            }
            if (this.contactDetailEditForm.controls.designation.value) {
              this.contactDetailEditForm.patchValue({ designation: this.contactDetailEditForm.controls.designation.value });
            } else {
              this.contactDetailEditForm.patchValue({ designation: response.Result.Content[0].designation[0] });
            }
            if (this.contactDetailEditForm.controls.emailAddress.value) {
              this.contactDetailEditForm.patchValue({ emailAddress: this.contactDetailEditForm.controls.emailAddress.value });
            } else {
              this.contactDetailEditForm.patchValue({ emailAddress: response.Result.Content[0].email[0] });
            }
            if (this.contactDetailEditForm.controls.address1.value) {
              this.contactDetailEditForm.patchValue({ address1: this.contactDetailEditForm.controls.address1.value });
            } else {
              this.contactDetailEditForm.patchValue({ address1: response.Result.Content[0].address[0] });
            }

            console.log("business phone", this.contactDetailEditForm.controls.contacts.value)
            if (response.Result.Content[0].number.length > 0) {
              const phonenumbermappingData = response.Result.Content[0].number.map(contactInfo => this.fb.group(
                {
                  ContactNo: contactInfo,
                  ContactType: 1,
                  MapGuid: "",
                }
              ));
              const phoneNumberFormArray = this.fb.array(phonenumbermappingData);
              this.contactDetailEditForm.setControl('contacts', phoneNumberFormArray);
            }
          }

          this.phoneContactType.forEach(element => {
            if (element.Id === 2) {
              this.contactDetailEditForm.patchValue({
                phoneType: element.Id
              })
              return;
            }
          });
        } 
      }
    },error => {this.isLoading = false;})
    
    // this.fileService.filesToUpload([formData]).subscribe(fileUpload => {
    //   if (fileUpload) {
    //     this.isLoading = false;
    //     this.imageSrc = fileUpload.toString()
    //     this.businessCardUrl = this.imageSrc;
    //     this.retry = 0;
    //     this.businessCardFile = undefined;
    //     //this condition is for fatching the business card data
    //     if (response) {
    //       if (this.isReplace == true) {
    //         if (response.Result.Content[0].name.length > 0) {
    //           this.contactDetailEditForm.patchValue({ firstName: response.Result.Content[0].name[0] });
    //         }
    //         if (response.Result.Content[0].name.length > 0) {
    //           this.contactDetailEditForm.patchValue({ lastName: response.Result.Content[0].name[1] });
    //         }
    //         if (response.Result.Content[0].designation.length > 0) {
    //           this.contactDetailEditForm.patchValue({ designation: response.Result.Content[0].designation[0] });
    //         }
    //         if (response.Result.Content[0].email.length > 0) {
    //           this.contactDetailEditForm.patchValue({ emailAddress: response.Result.Content[0].email[0] });
    //         }
    //         if (response.Result.Content[0].number.length > 0) {
    //           const phonenumbermappingData = response.Result.Content[0].number.map(contactInfo => this.fb.group(
    //             {
    //               ContactNo: contactInfo,
    //               ContactType: 1,
    //               MapGuid: "",
    //             }
    //           ));
    //           const phoneNumberFormArray = this.fb.array(phonenumbermappingData);
    //           this.contactDetailEditForm.setControl('contacts', phoneNumberFormArray);
    //         }
    //         if (response.Result.Content[0].address.length > 0) {
    //           this.contactDetailEditForm.patchValue({ address1: response.Result.Content[0].address[0] });
    //         }
    //       } else {

    //         if (this.contactDetailEditForm.controls.firstName.value) {
    //           this.contactDetailEditForm.patchValue({ firstName: this.contactDetailEditForm.controls.firstName.value });
    //         } else {
    //           this.contactDetailEditForm.patchValue({ firstName: response.Result.Content[0].name[0] })
    //         }
    //         if (this.contactDetailEditForm.controls.lastName.value) {
    //           this.contactDetailEditForm.patchValue({ lastName: this.contactDetailEditForm.controls.lastName.value });
    //         } else {
    //           this.contactDetailEditForm.patchValue({ lastName: response.Result.Content[0].name[1] });
    //         }
    //         if (this.contactDetailEditForm.controls.designation.value) {
    //           this.contactDetailEditForm.patchValue({ designation: this.contactDetailEditForm.controls.designation.value });
    //         } else {
    //           this.contactDetailEditForm.patchValue({ designation: response.Result.Content[0].designation[0] });
    //         }
    //         if (this.contactDetailEditForm.controls.emailAddress.value) {
    //           this.contactDetailEditForm.patchValue({ emailAddress: this.contactDetailEditForm.controls.emailAddress.value });
    //         } else {
    //           this.contactDetailEditForm.patchValue({ emailAddress: response.Result.Content[0].email[0] });
    //         }
    //         if (this.contactDetailEditForm.controls.address1.value) {
    //           this.contactDetailEditForm.patchValue({ address1: this.contactDetailEditForm.controls.address1.value });
    //         } else {
    //           this.contactDetailEditForm.patchValue({ address1: response.Result.Content[0].address[0] });
    //         }

    //         console.log("business phone", this.contactDetailEditForm.controls.contacts.value)
    //         if (response.Result.Content[0].number.length > 0) {
    //           const phonenumbermappingData = response.Result.Content[0].number.map(contactInfo => this.fb.group(
    //             {
    //               ContactNo: contactInfo,
    //               ContactType: 1,
    //               MapGuid: "",
    //             }
    //           ));
    //           const phoneNumberFormArray = this.fb.array(phonenumbermappingData);
    //           this.contactDetailEditForm.setControl('contacts', phoneNumberFormArray);
    //         }
    //       }

    //       this.phoneContactType.forEach(element => {
    //         if (element.Id === 2) {
    //           this.contactDetailEditForm.patchValue({
    //             phoneType: element.Id
    //           })
    //           return;
    //         }
    //       });
    //     } 
    //     // else {
    //     //   this.errorMessage.throwError("Oops! There seems to be some technical snag! Could you raise a Helpline ticket?")
    //     // }
    //   } (error) => {
    //     this.isLoading = false;
    //     fileUpload
    //     this.errorMessage.throwError(fileUpload);
    //   }
    // }, err => {
    //   this.isLoading = false
    //   this.errorMessage.throwError(err.error.Message);
    // });;


  }
  deleteBusinessCard(e) {
    this.img = true;
    const dialogRef = this.dialog.open(deleteImg1ComponentChild,
      {
        disableClose: true,
        width: '396px',
        data: { image: this.imageSrc }
      });
    dialogRef.afterClosed().subscribe((res) => {
      console.log("res", res);
      if (res) {
        this.imageSrc = null;
        this.contactService.sendBusinessCardData = this.businessCardUrl = "";
        document.getElementById('image').setAttribute("src", null);
        this.isReplace = true;
      }
    })
  }
  replaceBusinessCard() {
    const dialogRef = this.dialog.open(replaceImg1ComponentChild,
      {
        disableClose: true,
        width: '396px',
      });
    dialogRef.afterClosed().subscribe(res => {
      if (res !== undefined) {
        this.isReplace = res;
      }
    })
  }
  //----------------------------Business card upload finish ----------

  OnError(message) {
    let action;
    this.snackBar.open(message, action, {
      duration: 5000
    });
  }

  nonpatchDetailsFormsave() {
    this.contactservice.sendImage = this.getContactdetail.ProfileImage
    if (this.getContactdetail.ProfileImage !== "") {
      this.contactService.setProfileImage(this.getContactdetail.ProfileImage)
    }
    this.contactService.showeditbtn = true
    this.contactService.ProfileImageFlag.next({ flag: true });
  };

  //Social media functionality (Twitter & Linkedin)
  opensocial(condition, sData) {
    switch (condition) {
      case 'twitter': {
        const dialogRef = this.dialog.open(socialpopupComponent,
          {
            disableClose: true,
            width: '396px',
            data: { name: "Link twitter account", isTwitter: true, socialData: sData }
          });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.TwitterUrldata = result.url;
            console.log("Twitter", this.TwitterUrldata);
          }
        });
        return;
      }
      case 'linkedin': {
        const dialogRef = this.dialog.open(socialpopupComponent,
          {
            disableClose: true,
            width: '396px',
            data: { name: "Link linkedin account", isTwitter: false, socialData: sData }
          });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.LinkendUrldata = result.url;
            console.log("Linkedin", this.LinkendUrldata);
          }
        });
        return;
      }
    }
  }

  /****************Advance search popup starts**********************/
  openadvancetabs(controlName, initalLookupData, value): void {
    this.lookupdata.controlName = controlName
    this.lookupdata.headerdata = contactAdvnHeaders[controlName]
    this.lookupdata.lookupName = contactAdvnNames[controlName]['name']
    this.lookupdata.isCheckboxRequired = contactAdvnNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = contactAdvnNames[controlName]['isAccount']
    this.lookupdata.inputValue = value;
    this.contactService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
      this.lookupdata.tabledata = res
    });
    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.service.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });
    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
      console.log(x)
      if (x['objectRowData'].searchKey != '' && x.currentPage == 1) {
        this.lookupdata.nextLink = ''
      }
      let dialogData = {
        searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
        recordCount: this.lookupdata.recordCount,
        OdatanextLink: this.lookupdata.nextLink,// need to handel the pagination and search!
        pageNo: x.currentPage//need to handel from pagination
      }
      this.contactService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(), ...dialogData } }).subscribe(res => {
        this.lookupdata.isLoader = false;
        this.lookupdata.errorMsg.isError = false;
        console.log("getLookUpFilterData", res);
        if (res.IsError == false) {
          this.lookupdata.errorMsg.message = ''
          if (x.action == "loadMore") {
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
            this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
            this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          } else if (x.action == "search") {
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
            this.lookupdata.tabledata = res.ResponseObject;
            this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          }
          else if (x.action == "tabSwich") {
            if (x.objectRowData.wiprodb) {
              this.lookupdata.TotalRecordCount = res.TotalRecordCount;
              this.lookupdata.tabledata = res.ResponseObject;
              this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
            }
          }
        } else {
          this.lookupdata.errorMsg.message = JSON.stringify(res.Message)
        }
      }, error => {
        this.lookupdata.isLoader = false;
        this.lookupdata.errorMsg.isError = false;
      })
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        this.AppendParticularInputFun(result.selectedData, result.controlName)
      }
    });
  }
  AppendParticularInputFun(selectedData, controlName) {
    if (selectedData) {
      if (selectedData.length > 0) {
        selectedData.forEach(data => {
          this.IdentifyAppendFunc[controlName](data)
        });
      }
    }
  }
  getCommonData() {
    return {
      guid: this.ContactGuid,
      accountGuid: this.selectedAccountId,
      isProspect: this.isProspect,
    }
  }
  /*****************Advance search popup ends*********************/

  ngOnDestroy(): void {
    this.TabNav$.unsubscribe();
    this.contactSubscription.unsubscribe()
    this.getEditButtonSub.unsubscribe()
  }

}
@Component({
  selector: 'app-replace-img-component',
  templateUrl: './replaceimagechild.html',
  styleUrls: ['./contact-details-child.component.scss']
})
export class replaceImg1ComponentChild implements OnInit {
  constructor(public service: DataCommunicationService, public dialogRef: MatDialogRef<replaceImg1ComponentChild>) { }
  ngOnInit() {
  }
  replaceInformation() {
    this.service.fileUpload = true;
    document.getElementById('fileUpload').click();
    this.dialogRef.close(true);
  }
  retailInformation() {
    this.service.fileUpload = true;
    document.getElementById('fileUpload').click();
    this.dialogRef.close(false);
  }
}

@Component({
  selector: 'app-delete-img',
  templateUrl: './deleteimagechild.html',
  styleUrls: ['./contact-details-child.component.scss']
})
export class deleteImg1ComponentChild implements OnInit {
  img = true;
  constructor() { }
  ngOnInit() { }
  delete() {
  }
}

@Component({
  selector: 'social-popup',
  templateUrl: './social-popup.html',
  styleUrls: ['./contact-details-child.component.scss']
})
export class socialpopupComponent implements OnInit {
  socialmediaUrlBind: string = '';
  validateEditsocialMediaForm: FormGroup;                                                               // this is two way data binding from popup
  showError: boolean = false;                                                              // this is two way data binding from popup
  constructor(public dialogRef: MatDialogRef<socialpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public contactService: ContactService,
    private fb: FormBuilder, ) { }

  ngOnInit() {
    this.CreateSocialMediaDetails();
  }

  CreateSocialMediaDetails() {
    this.validateEditsocialMediaForm = this.fb.group({
      twitterUrl: [this.data.socialData, null],
    });
  }

  saveSocial() {
    console.log('form', this.validateEditsocialMediaForm.controls);
    if (this.data.isTwitter === true) {
      if (this.validateEditsocialMediaForm.value.twitterUrl === "") {
        let json = { url: '', isTwitter: this.data.isTwitter }
        this.dialogRef.close(json);
        return;
      }
      if (this.validateEditsocialMediaForm.value.twitterUrl.length > 0) {
        let twitterValue = this.validateEditsocialMediaForm.value.twitterUrl.trim()
        if (twitterValue === "") {
          this.showError = true
          return;
        }
      }
      if (this.validateEditsocialMediaForm.value.twitterUrl.trim().length > 0) {
        var regexp = /^http(?:s)?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/i;
        if (regexp.test(this.validateEditsocialMediaForm.value.twitterUrl)) {
          let json = { url: this.validateEditsocialMediaForm.value.twitterUrl, isTwitter: this.data.isTwitter }
          this.dialogRef.close(json);
          this.showError = false
        } else {
          this.showError = true
        }
      }
      else {
        let json = { url: '', isTwitter: this.data.isTwitter }
        this.dialogRef.close(json);
      }
    }
    else {
      if (this.validateEditsocialMediaForm.value.twitterUrl === "") {
        let json = { url: '', isTwitter: this.data.isTwitter }
        this.dialogRef.close(json);
        return;
      }
      if (this.validateEditsocialMediaForm.value.twitterUrl.length > 0) {
        let twitterValue = this.validateEditsocialMediaForm.value.twitterUrl.trim()
        if (twitterValue === "") {
          this.showError = true
          return;
        }
      }
      if (this.validateEditsocialMediaForm.value.twitterUrl.trim().length > 0) {
        var regexp = /^(https?)?:?(\/\/)?(([w]{3}||\w\w)\.)?linkedin.com(\w+:{0,1}\w*@)?(\S+)(:([0-9])+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/i;;
        if (regexp.test(this.validateEditsocialMediaForm.value.twitterUrl)) {
          let json = { url: this.validateEditsocialMediaForm.value.twitterUrl, isTwitter: this.data.isTwitter }
          this.dialogRef.close(json);
          this.showError = false
        } else {
          this.showError = true
        }
      }
      else {
        let json = { url: '', isTwitter: this.data.isTwitter }
        this.dialogRef.close(json);
      }
    }
  }


}
