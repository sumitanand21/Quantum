import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataCommunicationService } from '@app/core/services/global.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ContactService, MasterApiService, OfflineService, ErrorMessage, routes, CampaignService, OnlineOfflineService, contactAdvnHeaders, contactAdvnNames } from '@app/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { newConversationService } from '@app/core/services/new-conversation.service';
import { Router } from '@angular/router';
import { Update } from '@ngrx/entity';
import { All_Contact_Collection } from '@app/core/state/state.models/contact-create.interface';
import { UpdateMarketDetails, LoadMarketInfoDetailsById, UpdateContactList, UpdateContactDetails, ClearContactList, ClearContactDetails } from '@app/core/state/actions/contact.action';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { getMarketDetailsById, MarketDetails } from '@app/core/state/selectors/contact-list.selector';
import { Subscription } from 'rxjs';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { ClearDeActivateContactList } from '@app/core/state/actions/InActivateContact.action';
import { errorpopcomponent } from '../../../create-contact/create-contact.component';
import { CacheDataService } from '@app/core/services/look-up-cache-data/cache-data.serive';
@Component({
  selector: 'app-market-info',
  templateUrl: './market-info.component.html',
  styleUrls: ['./market-info.component.scss']
})
export class MarketInfoComponent implements OnInit, OnDestroy {

  editpart = false;
  getMarketDetail: any;
  functionType: any;
  MarketEditID: any;
  marketObject: any;
  marketInfoDetailEditForm: FormGroup;
  getIndustry: any;
  getIntrest: any;
  Industrydata: any;
  Interestdata: any;
  SelectedIntrest: any;
  isLoading: boolean = false;
  SelectedIndustry: string = '';
  isIndustryChanged: boolean = false;
  newIndustry: string = '';
  marketdetailsGuid: string = ''
  SelectedInterest: string = '';
  newInterest: string = '';
  isInterestChanged: boolean = false;
  isIndustrySearchLoading: boolean = false;
  isInterestSearchLoading: boolean = false;
  arrowkeyLocation = 0;
  TabNav$: Subscription
  MarketingReadOnlyDetails
  StaticMarketingDetails
  // showeditbtn: boolean;
  selectedFunctionId: any;
  selectedFunctionName: any;
  selectedInterestId: any;
  selectedInterestName: string = '';
  selectedIndustryId: any;
  selectedIndustryName: any;
  IndustrySwitch: boolean = true;
  IntrestNameSwitch: boolean = true;
  businessCardUrl: any
  deletedExistingContact = []
  profileImage: string;
  ExistingContactPhoneNumbers
  ContactGuid: any;
  isProspect: any;
  MarketingDetailsSubscription: Subscription
  getEditButtonSub: Subscription
  EmailChecksConatctGuild
  contactEditOrActivate: boolean = false

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
    nextLink: ''
  };
  IdentifyAppendFunc = {
    'industrySearch': (data) => { this.appendIndustry(data) },
    'interestSearch': (data) => { this.appendIntrestName(data) },
  }
  selectedLookupData(controlName) {
    switch (controlName) {
      case 'interestSearch': { return (this.sendInterestToAdvanceLookup.length > 0) ? this.sendInterestToAdvanceLookup : [] }
    }
  }
  //---------------------------------advance lookup ts file ends-------------------------------//
  constructor(
    public service: DataCommunicationService,
    public dialog: MatDialog,
    public contactservice: ContactService,
    private fb: FormBuilder,
    private masterApi: MasterApiService,
    private offlineService: OfflineService,
    private newconversationservice: newConversationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private routes: Router,
    private campaignService: CampaignService,
    public store: Store<AppState>,
    private onlineOfflineservice: OnlineOfflineService,
    private errorMessage: ErrorMessage,
    private cacheDataService: CacheDataService
  ) {
    this.checkEditOrReadMode()
    this.TabNav$ = this.contactservice.contactNavFrom().subscribe(res => {
      if (res) {
        if (res.navEnum == 1) {
          this.navigateToContactInfo()
        } else if (res.navEnum == 3) {
          this.router.navigate(['/contacts/Contactdetailslanding/relationLog'])
        }
      }
    })
    console.log('contactEditOrActivate', JSON.parse(sessionStorage.getItem('contactEditOrActivate')))
    this.contactEditOrActivate = JSON.parse(sessionStorage.getItem('contactEditOrActivate'))
  }

  async ngOnInit() {
    this.getEditButtonSub = this.contactservice.getButtonActions().subscribe(res => {
      if (res) {
        if (res.clicked === true) {
          this.editMarketingDetails()
        }
        if (res.saveClicked === true) {
          this.emailValidationChecksOnSave();
        }
        if (res.cancelClicked === true) {
          this.Cancel();
        }
      }
    });
    this.isLoading = true;
    this.MarketEditID = JSON.parse(localStorage.getItem("contactEditId"));
    this.checkEditOrReadMode()
    this.getMasterDatas();
    this.InitalizeMarketingInfoForm();
    this.onChanges();
    this.MarketingDetailsSubscription = this.store.pipe(select(getMarketDetailsById(this.MarketEditID))).subscribe(res => {
      this.isLoading = false;
      if (res) {
        // this.MarketEditID
        this.MarketingReadOnlyDetails = { ...res }
        console.log("MarketingReadOnlyDetails", this.MarketingReadOnlyDetails);
        this.ExistingContactPhoneNumbers = this.MarketingReadOnlyDetails.Contact
        this.businessCardUrl = (this.MarketingReadOnlyDetails.BusinessCardImage) ? this.MarketingReadOnlyDetails.BusinessCardImage : ""
    
        this.patchReadOnlyDetails(this.MarketingReadOnlyDetails)
        this.getMarketDetail = res
        console.log("getMarketDetail", this.getMarketDetail);
        if (sessionStorage.getItem('contactDetailsData') && !this.contactservice.showeditbtn) {
          this.editMarketingDetails(JSON.parse(sessionStorage.getItem('contactDetailsData')))
        }
      } else {
        this.getMarketingInfoDetails();
      }
    });
    if (!this.onlineOfflineservice.isOnline) {
      const cacheMarketdetailsData = await this.contactservice.getCacheMarketDetailsById(this.MarketEditID);
      if (cacheMarketdetailsData != null) {
        this.getMarketDetail = cacheMarketdetailsData.data
      } else {
        this.getMarketingInfoDetails();
      }
    }
  }

  get f() {
    return this.marketInfoDetailEditForm.controls;
  }
  ngOnDestroy() {
    this.MarketingDetailsSubscription.unsubscribe();
    this.getEditButtonSub.unsubscribe();
  }
  InitalizeMarketingInfoForm() {
    this.marketInfoDetailEditForm = this.fb.group({
      industry: [''],
      // GDPR: [false],
      functions: [''],
      intrest: [''],
      solicit: [false],
      GDPR: [false],
    });
    console.log("cccccc", this.marketInfoDetailEditForm);
  }

  patchReadOnlyDetails(data: any) {
    console.log("patchReadOnlyDetails", data)
    this.StaticMarketingDetails = {
      Industry: (data.MarketingDetail.Industry) ? (data.MarketingDetail.Industry.Name) ? data.MarketingDetail.Industry.Name : "NA" : "NA",
      // GDPR: (data.MarketingDetail.GDPR) ? (data.MarketingDetail.GDPR) ? "Yes" : "No" : "No",
      Function: (data.MarketingDetail.Function) ? (data.MarketingDetail.Function.Name) ? data.MarketingDetail.Function.Name : "NA" : "NA",
      Interest: (data.MarketingDetail.InterestList) ? (data.MarketingDetail.InterestList) ? data.MarketingDetail.InterestList : "NA" : "NA",
      Solicit: (data.MarketingDetail.Solicit) ? (data.MarketingDetail.Solicit) ? "Yes" : "No" : "No",
      GDPR: (data.MarketingDetail.GDPR=='true') ? (data.MarketingDetail.GDPR) ? "Yes" : "No" : "No",
      isUserCanEdit: data.isUserCanEdit
    }
    //tab functionality condition
  }

  patchMarketingDetails(data) {
    debugger
    this.marketInfoDetailEditForm.patchValue({
      industry: (data.MarketingDetail.Industry) ? (data.MarketingDetail.Industry.Name) ? data.MarketingDetail.Industry.Name : null : null,
      functions: (data.MarketingDetail.Function.Id !== 0) ? data.MarketingDetail.Function.Id : '',
      intrest: "",
      solicit: data.MarketingDetail.Solicit,
      GDPR: ((data.MarketingDetail.GDPR=='true')? true : false)
    });
    console.log("this.marketInfoDetailEditForm",this.marketInfoDetailEditForm.value)
    data.MarketingDetail.InterestList.forEach(res => {
      this.selectedInterest.push({ Guid: res.Guid, Name: res.Name, MapGuid: res.MapGuid, LinkActionType: res.LinkActionType })
          this.sendInterest.push({ Guid: res.Guid, Name: res.Name ,  MapGuid: res.MapGuid, LinkActionType: res.LinkActionType, Id: res.Guid, })
    });
  }

  editMarketingDetails(sessiondata?) {
    sessionStorage.setItem('contactEditMode', JSON.stringify(true))
    let data
    this.contactservice.showeditbtn = false
    if (sessiondata) {
      data = sessiondata
    } else {
      data = this.MarketingReadOnlyDetails
    }
    this.patchMarketingDetails(data);
    this.IndusrtyLogic(data)
    this.FunctionLogic(data)
    // this.Interestlogic(data)
    this.service.windowScroll();
    this.contactservice.setProfileImageflag(true, null)
  }

  Cancel() {
    this.selectedInterest = []
    this.sendInterest = []
    sessionStorage.removeItem("contactDetailsData");
    sessionStorage.removeItem('contactEditMode');
    this.contactservice.showeditbtn = true;
    this.service.windowScroll();
    this.contactservice.setProfileImageflag(false, null);
    this.contactservice.setProfileImage(this.profileImage);
  }

  FunctionLogic(data) {
    if (data.MarketingDetail.Function) {
      if (data.MarketingDetail.Function.Name !== undefined) {
        this.selectedFunctionId = data.MarketingDetail.Function.Id
        this.selectedFunctionName = data.MarketingDetail.Function.Name
      }
    }
  }

  IndusrtyLogic(data) {
    if (data.MarketingDetail.Industry) {
      if (data.MarketingDetail.Industry.Name !== undefined) {
        this.selectedIndustryId = data.MarketingDetail.Industry.Guid
        this.selectedIndustryName = data.MarketingDetail.Industry.Name
      }
    }
  }

  appendIndustry(item: any) {
    this.marketInfoDetailEditForm.patchValue({ industry: item.Name })
    this.IndustrySwitch = false;
    this.isIndustryChanged = true;
    this.newIndustry = item.wipro_sicindustryclassificationid
    this.selectedIndustryId = item.wipro_sicindustryclassificationid
    this.selectedIndustryName = item.Name
  }
  
  sendInterestToAdvanceLookup = []
  selectedInterest = [];
  sendInterest = [];
  interestChange: boolean = false;
  appendIntrestName(item: any) {
    console.log("interestItem", item)
    this.IntrestNameSwitch = false;
    this.isInterestChanged = true;
    let json = { Guid: item.Id, Name: item.Name, MapGuid: "", LinkActionType: 1, }
    let json1 = { Guid: item.Id, LinkActionType: 1, MapGuid: "", Id: item.Id }
    this.selectedInterest.push(json);
    let beforeLength = this.selectedInterest.length;
    this.selectedInterest = this.service.removeDuplicates(this.selectedInterest, "Guid");
    let afterLength = this.selectedInterest.length
    if (beforeLength === afterLength) {
      this.sendInterest.push(json1)
      this.marketInfoDetailEditForm.patchValue({ intrest: "", });
    } else {
      this.errorMessage.throwError("Selected interest already exists")
    }
    this.marketInfoDetailEditForm.patchValue({ intrest: "" })

  }

  delinkIntrest(item, i) {
    if (item.MapGuid !== "") {
      this.selectedInterest = this.selectedInterest.filter(res => res.MapGuid !== item.MapGuid)
      let index = this.sendInterest.findIndex(k => k.MapGuid === item.MapGuid)
      this.sendInterest[index].LinkActionType = 3
    } else {
      this.selectedInterest = this.selectedInterest.filter(res => res.Guid !== item.Guid)
      this.sendInterest = this.sendInterest.filter(res => res.Guid !== item.Guid)
    }
  }
  Industryclose() {
    this.IndustrySwitch = false;
    if (this.newIndustry === "" && this.marketInfoDetailEditForm.get('industry').dirty) {
      this.marketInfoDetailEditForm.patchValue({ industry: '' })
    }
  }
  IntrestNameclose() {
    this.IntrestNameSwitch = false;
    this.marketInfoDetailEditForm.patchValue({ intrest: '' })
  }
  OnError(message) {
    let action;
    this.snackBar.open(message, action, {
      duration: 5000
    });
  }

  Save() {
    debugger
    this.service.noneditprofile = true;
    this.service.editprofile = false;
    console.log("contactDetailEditForm", this.marketInfoDetailEditForm);
    this.isLoading = true;
    let EditRequestSave = this.generateSaveRequestBody()
    console.log("sending this data to request")
    console.log(EditRequestSave)
    console.log("EditMarketSave tttttttttttttttttttttttttt", EditRequestSave);
    this.contactservice.getContactEditEnrichmentSave(EditRequestSave).subscribe(data => {
      debugger
      console.log("edit data after save ", data);
      if (data.IsError === false) {
        this.isLoading = false
        this.isIndustryChanged = false;
        this.isInterestChanged = false;
        this.getMarketDetail = data.ResponseObject;
        this.contactservice.showeditbtn = true
        sessionStorage.removeItem("contactDetailsData")
        sessionStorage.removeItem("contactEditMode")
        sessionStorage.setItem('contactEditMode', JSON.stringify(false))
        this.contactservice.setProfileImageflag(false, null)
        this.sendInterest = []
        this.selectedInterest = []
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
        this.service.windowScroll();
      } else {
        this.isLoading = false
        this.errorMessage.throwError(data.Message);
      }
    });
  }

  emailValidationChecksOnSave() {
    let isContactNewData: boolean = this.CheckContactEditMode()
    let ContactNewData = (isContactNewData) ? this.getContactSessionData() : null;
    let emailValue = this.getEmail(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails)
    this.contactservice.getEmailValidation(false, emailValue, this.MarketEditID).subscribe(res => {
      if (res.IsError === false) {
        if (res.ResponseObject) {
          if (res.ResponseObject.isExists === true) {
            console.log("email Validation isExists", res.IsError);
            this.EmailChecksConatctGuild = res.ResponseObject.Guid
            localStorage.setItem("contactEditId", JSON.stringify(this.EmailChecksConatctGuild))
            this.openduplicatepop();
          } else {
            this.Save();
            sessionStorage.removeItem("contactEditMode")
            sessionStorage.setItem('contactEditMode', JSON.stringify(false))
          }
        } else {
          this.Save();
          sessionStorage.removeItem("contactEditMode")
          sessionStorage.setItem('contactEditMode', JSON.stringify(false))
        }
      } else {
        this.errorMessage.throwError(res.IsError)
      }
    })
  }

  openduplicatepop(): void {
    const dialogRef = this.dialog.open(errorpopcomponent, {
      disableClose: true,
      width: '400px',
      data: this.EmailChecksConatctGuild
    });
    dialogRef.afterClosed().subscribe(x => {
      this.contactservice.showeditbtn = true
      sessionStorage.removeItem("contactDetailsData")
      sessionStorage.setItem('contactEditMode', JSON.stringify(false))
      this.contactservice.setProfileImageflag(false, true)
      this.ngOnInit();
    })
  }

  generateSaveRequestBody() {
    debugger
    let isContactNewData: boolean = this.CheckContactEditMode()
    let ContactNewData = (isContactNewData) ? this.getContactSessionData() : null
    console.log(isContactNewData)
    console.log(ContactNewData)
    this.contactservice.sendImage
    this.MarketingReadOnlyDetails.ProfileImage
    return {
      "ProfileImage": (this.contactservice.sendImage !== undefined) ? this.contactservice.sendImage : this.MarketingReadOnlyDetails.ProfileImage,
      // "BusinessCardImage": this.contactservice.sendBusinessCardData != undefined ? this.contactservice.sendBusinessCardData : this.businessCardUrl,
      "BusinessCardImage": this.getBusinessCARD(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails),
      "Guid": this.MarketEditID,
      "Salutation": { "Id": this.getSalutation(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails) },
      "FName": this.getFirstName(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails),
      "LName": this.getLastName(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails),
      "Email": this.getEmail(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails),
      "Designation": this.getDesignation(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails),
      "Relationship": { "Id": this.getRelationship(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails) },
      "Account": { "SysGuid": this.getAccountId(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails), "isProspect": this.getAccountProspect(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails) },
      "ReportingManager": { "SysGuid": this.getReportingManager(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails) },
      "Contact": this.getContact(isContactNewData ? ContactNewData.Contact : this.MarketingReadOnlyDetails.Contact),
      "isKeyContact": this.getkeyContact(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails),
      "Referenceable": this.getReferenceable(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails),
      "ReferenceType": this.getReferenceType(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails),
      "ReferenceMode": { "Id": this.getReferenceMode(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails) },
      "Category": { "Id": this.getCategory(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails) },
      "isLinkedinProfileAvail": true,
      "isPrivate": true,
      "TwitterUrl": this.gettwitterUrl(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails),
      "LinkedinUrl": this.getlinkedUrl(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails),
      "CBU": { "sysGuid": this.getCbuSysguid(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails) },
      "IsBusinessContact": true,
      "CustomerAddress": this.getCustomerAddress(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails),
      "MeetingDetails": {
        Owner: { "SysGuid": "" },
        MeetingFrequency: 0
      },
      "MarketingDetail": {
        Function: this.filterFuctions(),
        GDPR: this.marketInfoDetailEditForm.value.GDPR,
        Solicit: this.marketInfoDetailEditForm.value.solicit,
        Industry: (this.marketInfoDetailEditForm.value.industry == null) ? { "wipro_sicindustryclassificationid": "" } : { "wipro_sicindustryclassificationid": this.marketInfoDetailEditForm.value.industry },
        InterestList: (this.sendInterest.length > 0) ? this.sendInterest : []
      }
    }

  }
  getLastName(data: any) {
    return data.LName
  }
  getFirstName(data: any) {
    return data.FName
  }
  getBusinessCARD(data: any){
    return data.BusinessCardImage;
  }
  getSalutation(data: any) {
    return data.Salutation.Id
  }
  getEmail(data: any) {
    return data.Email
  }
  getDesignation(data: any) {
    return data.Designation
  }
  getRelationship(data: any) {
    return data.Relationship.Id
  }
  getReferenceMode(data: any) {
    return data.ReferenceMode.Id
  }
  getCategory(data: any) {
    return data.Category.Id
  }
  getAccountId(data: any) {
    return data.CustomerAccount.SysGuid
  }
  getAccountProspect(data) {
    return data.CustomerAccount.isProspect
  }
  getReportingManager(data: any) {
    return data.ReportingManager.SysGuid
  }
  getkeyContact(data: any) {
    return data.isKeyContact
  }
  getReferenceable(data: any) {
    return data.Referenceable
  }
  getReferenceTypeDetails(data: any) {
    return  (data['ReferenceType']) ? data['ReferenceType'] : []
  }
  getCbuSysguid(data: any) {
    return data.CBU.SysGuid
  }
  getReportingManagerDetails(data: any) {
    return {
      SysGuid: (data.ReportingManager) ? (data.ReportingManager.SysGuid) ? data.ReportingManager.SysGuid : "" : "",
      FullName: (data.ReportingManager) ? (data.ReportingManager.FullName) ? data.ReportingManager.FullName : "" : ""
    }
  }
  getCbuDetails(data: any) {
    return {
      SysGuid: (data.CBU) ? (data.CBU.SysGuid) ? data.CBU.SysGuid : "" : "",
      Name: (data.CBU) ? (data.CBU.Name) ? data.CBU.Name : "" : ""
    }
  }
  gettwitterUrl(data: any) {
    return data.TwitterUrl
  }
  getlinkedUrl(data: any) {
    return data.LinkedinUrl
  }
  getBussinessCardImage(data: any) {
    return data.sendBusinessCardData
  }
  getCustomerAcc(data: any) {
    return {
      "SysGuid": data.CustomerAccount.SysGuid,
      "Name": decodeURIComponent(data.CustomerAccount.Name),
      "isProspect": data.CustomerAccount.isProspect
    }
  }
  getReferenceType(data: any) {
    return data.ReferenceType
  }
  getContactDetails(data: any) {
    let DuplicatephoneIdentify = []
    console.log(this.ExistingContactPhoneNumbers)
    console.log(data)
    data = this.service.removeDuplicates(data, 'ContactNo')
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
        return DuplicatephoneIdentify.concat(newContact)
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
      if (data.length > 0) {
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

  getContact(data) {
    let DuplicatephoneIdentify = []
    console.log(this.ExistingContactPhoneNumbers)
    console.log(data)
    data = this.service.removeDuplicates(data, 'ContactNo')
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
            DuplicatephoneIdentify.push({ ...x, LinkActionType: 2 })
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

  getCustomerAddress(data) {
    return {
      Address1: data.CustomerAddress.Address1,
      Address2: data.CustomerAddress.Address2,
      Street: data.CustomerAddress.Street,
      City: { SysGuid: data.CustomerAddress.City.SysGuid },
      Country: { SysGuid: data.CustomerAddress.Country.SysGuid },
      State: data.CustomerAddress.State,
      ZipCode: data.CustomerAddress.ZipCode
    }
  }

  getcontactCustomerAddress(data) {
    return {
      "City": {
        SysGuid: (data.CustomerAddress.City) ? (data.CustomerAddress.City.SysGuid) ? data.CustomerAddress.City.SysGuid : "" : "",
        Name: (data.CustomerAddress.City) ? (data.CustomerAddress.City.Name) ? data.CustomerAddress.City.Name : "" : ""
      },
      "Country": {
        "SysGuid": (data.CustomerAddress.Country) ? (data.CustomerAddress.Country.SysGuid) ? data.CustomerAddress.Country.SysGuid : "" : "",
        "Name": (data.CustomerAddress.Country.Name) ? (data.CustomerAddress.Country.Name) ? data.CustomerAddress.Country.Name : "" : ""
      },
      "State": {
        "SysGuid": (data.CustomerAddress.State) ? (data.CustomerAddress.State.SysGuid) ? data.CustomerAddress.State.SysGuid : "" : "",
        "Name": (data.CustomerAddress.State.Name) ? (data.CustomerAddress.State.Name) ? data.CustomerAddress.State.Name : "" : ""
      },
      "Address1": (data.CustomerAddress) ? (data.CustomerAddress.Address1) ? data.CustomerAddress.Address1 : "" : "",
      "Address2": (data.CustomerAddress) ? (data.CustomerAddress.Address2) ? data.CustomerAddress.Address2 : "" : "",
      "Street": (data.CustomerAddress.Street) ? data.CustomerAddress.Street : "",
      "ZipCode": (data.CustomerAddress.ZipCode) ? data.CustomerAddress.ZipCode : ""
    }
  }

  filterFuctions() {
    if (this.marketInfoDetailEditForm.value.functions != null && this.marketInfoDetailEditForm.value.functions != "") {
      return {
        Id: Number(this.marketInfoDetailEditForm.value.functions),
        LinkActionType: 4
      }
    }
    else {
      return {
        Id: (this.MarketingReadOnlyDetails.MarketingDetail.Function) ? this.MarketingReadOnlyDetails.MarketingDetail.Function.Id : "",
        LinkActionType: 3
      }
    }
  }

  CheckContactEditMode() {
    if (sessionStorage.getItem('contactDetailsData') && !this.contactservice.showeditbtn) {
      return true
    } else {
      return false
    }
  }
  checkEditOrReadMode() {
    if (sessionStorage.getItem('contactEditMode')) {
      this.contactservice.showeditbtn = !JSON.parse(sessionStorage.getItem('contactEditMode'))
    } else {
      this.contactservice.showeditbtn = true
    }
  }
  CheckIfFormIsValid() {
    return this.marketInfoDetailEditForm.valid
  }
  createMarketingTempData() {
    return this.createMarketingInfoTempData()
  }

  createMarketingInfoTempData() {
    let isContactNewData: boolean = this.CheckContactEditMode()
    let ContactNewData = (isContactNewData) ? this.getContactSessionData() : null;
    (isContactNewData) ? this.deletedExistingContact = this.getContactSessionData().deletedExistingContact : []
    return {
      "Guid": this.MarketEditID,
      "Salutation": {
        "Id": this.getSalutation(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails)
      },
      "FName": this.getFirstName(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails),
      "LName": this.getLastName(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails),
      "Contact": this.getContactDetails(isContactNewData ? ContactNewData.Contact : this.MarketingReadOnlyDetails.Contact),
      "Email": this.getEmail(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails),
      "isKeyContact": this.getkeyContact(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails),
      "Referenceable": this.getReferenceable(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails),
      "ReferenceType": this.getReferenceTypeDetails(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails),
      "ReferenceMode": { 
        "Id": this.getReferenceMode(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails),
      },
      "BusinessCardImage": this.getBussinessCardImage(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails),
      "Designation": this.getDesignation(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails),
      "CustomerAccount": this.getCustomerAcc(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails),
      "Relationship": {
        "Id": this.getRelationship(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails),
      },
      "Category": {
        "Id": this.getCategory(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails),
      },
      "LinkedinUrl": this.getlinkedUrl(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails),
      "TwitterUrl": this.gettwitterUrl(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails),
      "CBU": this.getCbuDetails(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails),
      "isPrivate": this.MarketingReadOnlyDetails.isPrivate,
      "isNewsFlashes": this.MarketingReadOnlyDetails.isNewsFlashes,
      "isInvitationforWebinars": this.MarketingReadOnlyDetails.isInvitationforWebinars,
      "isSurveyorResearch": this.MarketingReadOnlyDetails.isSurveyorResearch,
      "isHolidaycard": this.MarketingReadOnlyDetails.isHolidaycard,
      "isEligibility": this.MarketingReadOnlyDetails.isEligibility,
      "isInfoonoffers": this.MarketingReadOnlyDetails.isInfoonoffers,
      "ReportingManager": this.getReportingManagerDetails(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails),
      "CustomerAddress": this.getcontactCustomerAddress(isContactNewData ? ContactNewData : this.MarketingReadOnlyDetails),
      MarketingDetail: {
        Industry: this.marketInfoDetailEditForm.value.industry,
        // GDPR: this.marketInfoDetailEditForm.value.GDPR,
        Solicit: this.marketInfoDetailEditForm.value.solicit,
        Function: {
          Id: this.marketInfoDetailEditForm.value.functions,
          Name: "",
          isExist: false
        },
        InterestList: this.sendInterest,
        GDPR: this.marketInfoDetailEditForm.value.GDPR
      },
      "deletedExistingContact": this.deletedExistingContact
    }
  }

  getContactSessionData() {
    console.log("getContactSessionData",JSON.parse(sessionStorage.getItem('contactDetailsData')))
    debugger
    return JSON.parse(sessionStorage.getItem('contactDetailsData'))
    
  }

  getMarketingInfoDetails() {
    this.isLoading = true;
    this.contactservice.getContactdetails(this.MarketEditID).subscribe(res => {
      this.isLoading = false;
      if (res.IsError === false) {
        this.getMarketDetail = res.ResponseObject;
        this.marketdetailsGuid = res.ResponseObject.Guid;
        const ImmutabelObj = { ...res.ResponseObject, id: res.ResponseObject.Guid }
        this.store.dispatch(new LoadMarketInfoDetailsById({ marketDetails: ImmutabelObj }))
      } else {
        this.errorMessage.throwError(res.Message);
      }
    });
  }
  //----------- Value changes for search lookup data ------------

  onChanges() {
    //search interest
    this.marketInfoDetailEditForm.get('intrest').valueChanges.subscribe(val => {
      if (this.marketInfoDetailEditForm.get('intrest').dirty && this.IntrestNameSwitch === true) {
        this.isInterestSearchLoading = true;
        this.getIntrest = []
        this.campaignService.getSearchInterestByname(val).subscribe(res => {
          this.isInterestSearchLoading = false;
          if (res.IsError === false) {
            this.getIntrest = res.ResponseObject;
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
            console.log("Interest search data", this.getIntrest);
          } else {
            this.errorMessage.throwError(res.Message);
            this.getIntrest = []
          }
        }, error => {
          this.isInterestSearchLoading = false;
          this.getIntrest = []
        });
      } else {
        if (this.cacheDataService.cacheDataGet('contactInterest').length > 0) {
          this.isInterestSearchLoading = false;
          this.getIntrest = this.cacheDataService.cacheDataGet('contactInterest')
        }
      }
    });

  }
  //--------- Value changes is end -----------------------

  //----- Clear interest search lookup field ---------
  clearInterestName() {
    this.marketInfoDetailEditForm.patchValue({
      intrest: ""
    });
    this.selectedInterestName = ''
    this.selectedInterestId = ''
  }
  //---------- Selection changes for dropdown -------------------
  functionId: any;
  functionName: any;
  functionTypeAria: any
  appendFunctionType(event) {
    console.log("appendFunctionType", event);
    if (!this.isEmpty(event)) {
      this.functionId = event.value;
      this.functionType.forEach(element => {
        if (element.Id == this.functionId) {
          this.functionName = element.Value
          this.functionTypeAria = this.functionName
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
  //------- selection changes end ------------

  getMasterDatas() {
    this.masterApi.getFunction().subscribe(res => {
      if (res.IsError === false) {
        this.offlineService.addMasterApiCache(routes.function, res)
        this.functionType = res.ResponseObject;
        console.log("functionType marketing component", this.functionType);
      }
    });
  }
  navigateToContactInfo() {
    if (this.CheckContactEditMode()) {
      if (this.CheckIfFormIsValid()) {
        sessionStorage.setItem('contactDetailsData', JSON.stringify(this.createMarketingTempData()))
        this.router.navigate(['/contacts/Contactdetailslanding/contactDetailsChild'])
      } else {
        this.service.validateAllFormFields(this.marketInfoDetailEditForm);
      }
    } else if (this.contactservice.showeditbtn) {
      sessionStorage.removeItem("contactDetailsData")
      this.router.navigate(['/contacts/Contactdetailslanding/contactDetailsChild'])
    }
  }

  callTempInterest() {
    this.marketInfoDetailEditForm.patchValue({
      intrest: ''
    })
    if (!this.marketInfoDetailEditForm.value.intrest && this.IntrestNameSwitch) {
      this.isInterestSearchLoading = true
      this.getIntrest = []
      if (this.cacheDataService.cacheDataGet('contactInterest').length > 0) {
        this.isInterestSearchLoading = false
        this.getIntrest = this.cacheDataService.cacheDataGet('contactInterest');
      } else {
        this.contactservice.getSearchInterestByname("").subscribe(res => {
          this.isInterestSearchLoading = false
          this.isLoading = false;
          if (res.IsError === false) {
            this.getIntrest = res.ResponseObject;
            this.cacheDataService.cacheDataSet('contactInterest', res.ResponseObject);
            this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          } else {
            this.errorMessage.throwError(res.Message);
            this.cacheDataService.cacheDataReset('contactInterest');
          }
        }, error => {
          this.isInterestSearchLoading = false;
          this.cacheDataService.cacheDataReset('contactInterest');
        });
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
    this.contactservice.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
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
      this.contactservice.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(), ...dialogData } }).subscribe(res => {
        this.lookupdata.isLoader = false;
        console.log("resresresresresresresresresresresresresresresresresres", res)
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
      });
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        this.AppendParticularInputFun(result.selectedData, result.controlName)
      }
    });
  }

  /*****************Advance search popup ends*********************/
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
      isProspect: this.isProspect,
    }
  }







}
