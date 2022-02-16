import { Component, OnInit } from '@angular/core';
import { DataCommunicationService } from '@app/core/services/global.service';
import { ContactService, OfflineService, routes, ErrorMessage, CampaignService, ConversationService, ContactNavigationRoutes } from '@app/core/services';
import { newConversationService } from '@app/core/services/new-conversation.service';
import { MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AppState } from '@app/core/state';
import { Store, select } from '@ngrx/store';
import { getContactDetailsById } from '@app/core/state/selectors/contact-list.selector';
import { RoutingState } from '@app/core/services/navigation.service';
import { Router } from '@angular/router';
import { LoadContactDetailsById, ClearContactsDataDetails } from '@app/core/state/actions/contact.action';
import { Subscription } from 'rxjs';
import { ClearDeActivateContactList } from '@app/core/state/actions/InActivateContact.action';
import { FileUploadService } from '@app/core/services/file-upload.service';
@Component({
  selector: 'app-contact-detail-landing',
  templateUrl: './contact-detail-landing.component.html',
  styleUrls: ['./contact-detail-landing.component.scss']
})
export class ContactDetailLandingComponent implements OnInit {
  hideheaderbtn = true;
  img: boolean = true;
  urls = new Array<string>();
  inputImgVal;
  contactstab = true;
  suitetab = false;
  plantab = false;
  contactstabwhite = true;
  suitetabwhite = false;
  plantabwhite = false;
  editpart = true;
  noneditpart = false;
  newCustomerContactForm1: FormGroup;
  img1 = true;
  imageSrc1: any;
  profileUrl: string;
  isLoading: boolean;
  pictureFlag$: Subscription
  ContactDetaisl$: Subscription
  showImageEditmode: boolean;
  SingleContactname: string;
  moduleShowData: any;
  contactDetails: any;
  constructor(
    public routingState: RoutingState,
    public router: Router,
    public userdat: DataCommunicationService,
    public dialog: MatDialog,
    public contactService: ContactService,
    public conversationService: ConversationService,
    public store: Store<AppState>,
    public errorMessage: ErrorMessage,
    private fileService: FileUploadService,
    public offlineService: OfflineService) {

    this.pictureFlag$ = this.contactService.ProfileImageFlag.subscribe(res => {
      console.log("->>>>>>>>>>>>>>>>>>")
      console.log(res)
      if (res != undefined && res != null) {
        if (res.flag == true) {

          this.showImageEditmode = true
        } else if (res.callngOnint == true && res.flag == false) {
          this.ngOnInit()
        } else if (res.flag == false) {
          this.showImageEditmode = false
        }
      }
    })
  }

  ngOnInit() {
    let contactId = JSON.parse(localStorage.getItem('contactEditId'))
    this.ContactDetaisl$ = this.store.pipe(select(getContactDetailsById(JSON.parse(localStorage.getItem('contactEditId'))))).subscribe(res => {
      console.log("got response from selector details")
      console.log("get the Contact list data from state management", res)
      this.isLoading = false;
      this.contactDetails = res
      this.getprofileImage();

      if (res !== undefined) {
        this.SingleContactname = res.FName + ' ' + res.LName;
        this.moduleShowData = this.moduleShow(res);

        if (res.ProfileImage) {
          this.contactService.setProfileImage(res.ProfileImage);
        } else {
          this.contactService.setProfileImage("");
        }
      } else {
        this.getContactDetails(contactId);
      }
    }, error => {
      this.isLoading = false;
    });
  }

  getContactDetails(contactId) {
    this.contactService.getContactdetails(contactId).subscribe(res => {
      if (res.IsError == false) {
        console.log(res.ResponseObject);
        this.contactDetails = res
         console.log("contactDetails image",this.contactDetails);
        if (res.ResponseObject.ProfileImage) {
          this.getprofileImage();
        } else {
          this.contactService.setProfileImage("")
          this.getprofileImage();
        }
        const ImmutabelObj = { ...res.ResponseObject, id: res.ResponseObject.Guid }
        this.store.dispatch(new LoadContactDetailsById({ contactDetails: ImmutabelObj }))
      } else {
        this.errorMessage.throwError(res.Message)
      }
    });
  }

  moduleShow(action) {
    console.log("action",action);
    switch (Number(action.Module)) {
      case 1: { return 'Accounts / Contacts' }
      case 2: { return 'Contacts' }
      case 3: { return 'Leads / Contacts' }
      case 4: { return 'Activities / Contacts' }
      case 5: { return 'Opportunities / Contacts' }
    }
  }

  editdetails() {
    this.editpart = true;
    this.noneditpart = false;
  }

  noneditdetails() {
    this.noneditpart = true;
    this.editpart = false;
  }

  contactRounting(value) {
    value === 3 ? this.hideheaderbtn = false : this.hideheaderbtn = true
    this.contactService.contactNavTo(value)
  }
  contactDtls= true;
  marketInfo=false;
  relationLog=false;
  contactdetails(){
  this.contactDtls= true;
  this.marketInfo=false;
  this.relationLog=false;
  }
  marketingInfo(){
    this.contactDtls= false;
    this.marketInfo=true;
    this.relationLog=false;
  }
  relationshipLog(){
    this.contactDtls= false;
    this.marketInfo=false;
    this.relationLog=true;
  }
  navTo() {
    this.contactService.setProfileImageflag(false)
    sessionStorage.removeItem("contactDetailsData")
    sessionStorage.setItem('contactEditMode', JSON.stringify(false))
    if (this.routingState.getPreviousUrl() == "/home/dashboard") {
      this.router.navigate(['/home/dashboard']);
    } else if (this.routingState.getPreviousUrl() == "/home/approvaltask/task") {
      this.router.navigate(['/home/approvaltask/task']);
    }
    //  else if (this.routingState.getPreviousUrl() == "/accounts/contacts/accountcontacts") {
    //   this.router.navigate(['/accounts/contacts/accountcontacts']);
    // }
    else if (sessionStorage.getItem('selAccountObj')) {
      this.router.navigate(['/accounts/contacts/accountcontacts']);
    }
    else if (sessionStorage.getItem('TempEditLeadDetails')) {
      this.router.navigate(['/leads/leadDetails']);
    }
    else {
      let routeId = this.userdat.sessionStorageGetItem('ContactRoute')
      // let routeId = JSON.parse(sessionStorage.getItem('ContactRoute'))
      this.router.navigate([ContactNavigationRoutes[routeId[routeId.length - 1]]]);
    }
  }

  getprofileImage() {
    this.contactService.getProfileImage().subscribe(res => {
      console.log("getter",res);
      if (res.profileUrl !== "") {
         if (this.contactDetails != undefined) {
          if (this.contactDetails.MimeType && this.contactDetails.ProfileBase64string) {
            var data = "data:" + this.contactDetails.MimeType + ";base64," + this.contactDetails.ProfileBase64string;
            this.imageSrc1 = data;
            console.log("this.imageSrc1",this.imageSrc1)
          } else {
            this.imageSrc1 = null;
          }
        } else{
          this.imageSrc1 = null;
        }
        
      } else {
        this.imageSrc1 = null;
        (<HTMLInputElement>document.getElementById("profilepic")).value = "";
      }
    });
  }

  accept = ['image/jpg','image/jpeg','image/png', 'image/PJP', 'image/gif'];
  detectProfileImage(e) {
    let uploadingFileList = [];
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    const formData: FormData = new FormData();
    formData.append('file', file);
    console.log(file.type)
    uploadingFileList.push(formData);
    if (file.type !== undefined) {
      // if (!file.type.match(pattern)) {
      //   this.errorMessage.throwError('Please upload a valid image format');
      //   return false;
      // }
      if (!this.accept.includes(file.type)) {
        this.isLoading = false;
        this.errorMessage.throwError('Please upload a valid image format');
        return
      }
      if (file.size > 5242880) {
        this.isLoading = false;
        this.errorMessage.throwError("Not able to upload the file because filesize is greater than 5mb")
      } else {
        this.isLoading = true
        // this.contactService.profileImg(formData).subscribe((res) => {
          this.fileService.filesToUploadDocument64(uploadingFileList).subscribe((res) => {
          console.log("image upload done from service", res);
          if (res) {
            this.isLoading = false
            var data = "data:" + res[0].ResponseObject.MimeType + ";base64," + res[0].ResponseObject.Base64String;
            this.imageSrc1 = data;
            console.log("this.imageSrc1",this.imageSrc1)
            this.profileUrl = res[0].ResponseObject.Url;
            this.contactService.sendImage = res[0].ResponseObject.Url;
          } (error) => {
            this.errorMessage.throwError(error)
            this.isLoading = false
          }
        });
      }
    }
  }

  deleteprofile(): void {
    this.img = true;
    const dialogRef = this.dialog.open(deleteprofileComponent, {
      disableClose: true,
      width: '400px',
      data: { image: this.imageSrc1 }
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.imageSrc1 = null;
        this.contactService.sendImage = ''
      }
    });
  }

  clickActionMode: string = ''
  onClickActions(mode: string) {
    switch (mode) {
      case 'edit': {
        this.contactService.setButtonActions(true, false, false)
        break;
      }
      case 'save': {
        this.contactService.setButtonActions(false, true, false)
        break;
      }
      case 'cancel': {
        this.contactService.setButtonActions(false, false, true)
        break;
      }
    }
  }

  activatecontact(): void {
    console.log("activatecontact button")
    const dialogRef = this.dialog.open(activatecontactpopComponent, {
      disableClose: true,
      width: '400px',
    });
  }

  ngOnDestroy(): void {
    this.pictureFlag$.unsubscribe()
    this.ContactDetaisl$.unsubscribe()
  }
}


@Component({
  selector: 'app-activate-pop',
  templateUrl: './activatecontactpop.html',
  styleUrls: ['./contact-detail-landing.component.scss']
})
export class activatecontactpopComponent {

  isLoading: boolean = false;
  deactivatedcontactTable = [];
  tableTotalCount: number;
  ContactEditID: any;

  constructor(
    public matSnackBar: MatSnackBar,
    public contactservice: ContactService,
    public store: Store<AppState>,
    public errorMessage: ErrorMessage,
    public router: Router,
    public dialog: MatDialog
  ) { }

  reActivateContact() {
    this.ContactEditID = JSON.parse(localStorage.getItem("contactEditId"));
    this.isLoading = true;
    console.log("reactivate contact guid", this.ContactEditID);
    this.contactservice.getReActivateContact([{Guid:this.ContactEditID}]).subscribe(res => {
      this.isLoading = false;
      if (res.IsError === false) {
        this.store.dispatch(new ClearDeActivateContactList());
        this.store.dispatch(new ClearContactsDataDetails())
        this.errorMessage.throwError(res.Message);
        this.router.navigateByUrl('/contacts/deactivatedcontacts');
        this.dialog.closeAll();

      } else {
        this.errorMessage.throwError(res.Message);
      }
      console.log("reActivate contact", res);
    }, error => {
      this.isLoading = false;
    });
  }
}

@Component({
  selector: 'app-delete-profile',
  templateUrl: './delete-profile.html',
})
export class deleteprofileComponent {

  constructor() { }
}
