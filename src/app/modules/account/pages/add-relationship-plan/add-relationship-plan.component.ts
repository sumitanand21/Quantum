import { Component, Input, ViewChild, ViewChildren, QueryList, ElementRef, OnDestroy } from '@angular/core';
import { OnInit, } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Location } from '@angular/common';
import { DataCommunicationService, ErrorMessage } from '@app/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '@app/shared/services/validation.service';
import { AccountOwnerPopupComponent } from '@app/shared/modals/account-owner-popup/account-owner-popup.component';
import { MasterApiService } from '@app/core/services/master-api.service';
import { AccountListService } from '@app/core/services/accountList.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { ActivatedRoute, Router } from '@angular/router';
import { duration } from 'moment';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { relationshiPlanclear } from '@app/core/state/actions/relationship-plan.action';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';

@Component({
  selector: 'app-add-relationship-plan',
  templateUrl: './add-relationship-plan.component.html',
  styleUrls: ['./add-relationship-plan.component.scss']
})
export class AddRelationshipPlanComponent implements OnInit, OnDestroy {
  ConversationNameSwitch;
  selectedValue = 'Select';
  formsData: any;
  prospectAccForm: FormGroup;
  accOwnerSwapForm: FormGroup;
  // addrelationshipplanForm : FormGroup
  wiproservice;
  competitor;
  keywip;
  levelValue: any;
  meetingfrequencyvalue: any;
  relationshiptheamvalue: any;
  wiprocontactname: any=[];
  keywiprocontactname: any =[];
  contactid: any;
  contactNamevalue: any = [];
  keyContactNamevalue: any;
  ContactuseswiproServices: any;
  contactNameId: any;
  ContactWorkswithCompetition: any;
  editdata: any;
  emitteddata: any;
  Title: any;
  editLevel: any;
  fullNameInitilas: any;
  isEdit: any;
  ContactUsingWiproServices: boolean = false;
  Keywiprocontact: any;
  Relationshiptheme: any;
  MeetingFrequencyId: any;
  MeetingFrequency: any;
  LevelId: any;
  StrategyToImproveRelationship: any;
  RelationshipthemeId: any;
  editid: any;
  accountSysId: any;
  table_headkey: any;
  table_datakey: any;
  keyContact: any;
  isLoading: boolean = false;
  relationGuid: any;
  addRow: number = 0;
  isActivityGroupSearchLoading: boolean;
  relationFormSubmitted: boolean = false;
  addrelationshipplanForm = this._fb.group({
    RelationShipContact: [''],
    contactName: ['', Validators.required],
    // keycontact:[''],
    Title: ['', Validators.required],
    // Level:[''],
    relationOwner: ['', Validators.required],
    ContactUsingWiproServices: ['false', Validators.required],
    ContactWorkswithCompetition: ['false', Validators.required],
    // KeyWiproContact:[''],
    // Relationshiptheme:[''],
    StrategyToImproveRelationship: ['', Validators.required],
    //  MeetingFrequency:[''],
    Guid: [''],
    CustomerAccount: [''],
  });
  filterConfigData = {
    Contactname: { data: [], recordCount: 0, NextLink: '' },
    Title: { data: [], recordCount: 0, NextLink: '' },
    Relationshiptheme: { data: [], recordCount: 0, NextLink: '' },
    isFilterLoading: false
  };
  showContact: boolean = false;
  contactName: string = "";
  contactNameSwitch: boolean = true;
  selectedContact: {}[] = [];
  showContact4: boolean = false;
  contactName4: string = "";
  contactNameSwitch4: boolean = true;
  newMem = [];
  selectedContact4: {}[] = [];
  showContact4c: boolean = false;
  contactName4c: string = "";
  contactNameSwitch4c: boolean = true;
  contactKeyNameSwitch4c: boolean = true;
  ContactNameData : string = "";
  OwnerName:string = "";
  arrowkeyLocation;
  accountName;
  contactTitle;
  constructor(public dialog: MatDialog, public location: Location,
    public service: DataCommunicationService, public userdat: DataCommunicationService,
    public accservive: DataCommunicationService, private _fb: FormBuilder,
    private el: ElementRef, public validate: ValidationService,
    private masterapi: MasterApiService,
    public master3Api: S3MasterApiService,
    private accoutservice: AccountListService,
    // private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar, private EncrDecr: EncrDecrService,
    private store: Store<AppState>, private route: ActivatedRoute, public errorMessage: ErrorMessage) {
    if (route && route.snapshot && route.snapshot.params && route.snapshot.params.id) {
      this.relationGuid = route.snapshot.params.id;
    }
    //chethana sep 5th
    this.table_headkey = [{
      'tablehead': 'Wipro key contact'
    },
    {
      'tablehead': 'Meeting frequency'
    },
    {
      'tablehead': 'Relationship theme'
    },
    ];
    this.table_datakey = [{
      'tabledata1': 'Name 1',
      'tabledata2': 'Value',
      'tabledata3': 'Relationship theme',
    },
    {
      'tabledata1': 'Name 1',
      'tabledata2': 'Value',
      'tabledata3': 'Relationship theme',
    },
    {
      'tabledata1': 'Name 1',
      'tabledata2': 'Value',
      'tabledata3': 'Relationship theme',
    },
    ];
  }
  /****************** wipro contact autocomplete code start ****************** */

  ngOnInit() {

    this.accountSysId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip');
    this.accountName = this.accoutservice.getSymbol(this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountName'), 'DecryptionDecrip'));
    // console.log('this.service.editData :::::', JSON.parse(localStorage.getItem('editData'));
    this.isEdit = localStorage.getItem('isEdit');
    if (this.isEdit === 'edit') {
      this.accoutservice.detailsRelationShipPlan(this.relationGuid).subscribe((res) => {
        this.editdata = res.ResponseObject;
        if (this.editdata) {
          this.contactName4c = this.editdata.RelationShipContact.FullName;
          this.contactNameId = this.editdata.RelationShipContact.Guid;
          this.contactTitle = this.editdata.Title;
          // this.addrelationshipplanForm.controls['Title'].patchValue(this.editdata.Title);
          this.contactName4 = this.editdata.Owner.FullName;
          this.contactid = this.editdata.Owner.SysGuid;
          this.addrelationshipplanForm.controls['ContactUsingWiproServices'].patchValue(this.editdata.ContactUsingWiproServices);
          this.addrelationshipplanForm.controls['ContactWorkswithCompetition'].patchValue(this.editdata.ContactWorkswithCompetition);
          this.addrelationshipplanForm.controls['StrategyToImproveRelationship'].setValue(this.editdata.StrategyToImproveRelationship);
          this.addrelationshipplanForm.controls['Guid'].patchValue(this.editdata.Guid);
          this.newMem = [...this.editdata.KeyWiproContactList];
          this.ContactNameData = this.editdata.RelationShipContact.FullName;
          this.OwnerName = this.editdata.Owner.FullName;


        }

      });


    }

    this.accOwnerSwapForm = this._fb.group({
      owner: ['', Validators.required]
    });
    this.formsData = {
      owner: ''
    };


    this.getlevel();
    this.getmeetingfrequency();
    this.getrelationshiptheme();
    // console.log("meeting frequency", this.MeetingFrequency)
  }

// getEncodedData(data)
// {
//   this.accoutservice.getSymbol(data);
// }
  contactNameclose() {
    this.contactNameSwitch = false;
  }

  appendcontact(value: string, i) {

    this.contactName = value;
    this.selectedContact.push(this.wiproContact[i])
  }
  openaccountowner() {
    {
      const dialogRef = this.dialog.open(AccountOwnerPopupComponent,
        {
          disableClose: true,
          width: '380px'
        }
      );
    }
  }
  wiproContact: {}[] = [

    { index: 0, contact: 'Sini Raphael', designation: 'Marketing head', initials: 'SR', value: true },
    { index: 1, contact: 'Sinjay Mitra', designation: 'Pre Sales Head', initials: 'SM', value: false },
    { index: 2, contact: 'Sinoy Roy', designation: 'Pre Sales Head', initials: 'SR', value: false },
    { index: 3, contact: 'Sini Raphael', designation: 'Pre Sales Head', initials: 'SR', value: false },
  ];



  /****************** Key wipro autocomplete code start ****************** */


  contactNameclose4() {
    this.contactNameSwitch4 = false;
  }

  wiproContact4: {}[] = [

    { index: 0, contact: 'London', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ]



  /****************** Key wipro  autocomplete code end ****************** */
  /****************** Contact name autocomplete code start ****************** */



  contactNameclose4c() {
    this.contactNameSwitch4c = false;
  }
  contactKeyNameclose4c() {
    this.contactKeyNameSwitch4c = false;
  }

  wiproContact4c: {}[] = [

    { index: 0, contact: 'London', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ]

  selectedContact4c: {}[] = [];

  /****************** Contact name  autocomplete code end ****************** */

  getlevel() {
    const Level = this.master3Api.getLevel();
    Level.subscribe((res: any) => {
      this.levelValue = res.ResponseObject;
      // console.log("level value ", this.levelValue);
    })
  }
  getmeetingfrequency() {
    const frequency = this.master3Api.getMeetingFrequencyForRelationshipPlan();
    frequency.subscribe((res: any) => {
      this.meetingfrequencyvalue = res.ResponseObject;
      // console.log("meeting frrequency  data", this.meetingfrequencyvalue);

    })

  }
  getrelationshiptheme() {
    const relationshiptheam = this.master3Api.getRelationshipTheme();
    relationshiptheam.subscribe((res: any) => {
      this.relationshiptheamvalue = res.ResponseObject;
      // console.log("relationship theam ", this.relationshiptheamvalue);

    });
  }
  getOwnersList(event) {
    this.keywiprocontactname = [];
    // if (event.target.value.length > 0) {
    this.isActivityGroupSearchLoading = true;
    const wiprocontactname = this.master3Api.SearchUser(event);
    wiprocontactname.subscribe((res => {
      this.isActivityGroupSearchLoading = false;
      const dataArray = res.ResponseObject.map(val => {
        const initials = val.FullName.split(' ');
        return {
          SysGuid: val.SysGuid,
          FullName: val.FullName,
          Initials: initials.length === 1 ? initials[0].charAt(0) : initials[0].charAt(0) + initials[1].charAt(0)
        };
      });
      this.keywiprocontactname = dataArray;
    }
    ));
    // }

  }
  getkeywiprocontactname(event, i) {
    if (i !== 0) {
      const index = i - 1;
      this.newMem[index].keyDataArray = [];
      this.isActivityGroupSearchLoading = false;
      // console.log(this.newMem[i].keyDataArray, "22222");
    } else {
      this.newMem[i].keyDataArray = [];
    }
    // if (event.target.value.length > 0) {
    // this.isActivityGroupSearchLoading = true;
    const wiprocontactname = this.master3Api.SearchUser(event.target.value);
    wiprocontactname.subscribe((res => {
      this.isActivityGroupSearchLoading = false;
      const dataArray = res.ResponseObject.map(val => {
        const initials = val.FullName.split(' ');
        return {
          SysGuid: val.SysGuid,
          FullName: val.FullName,
          Initials: initials.length === 1 ? initials[0].charAt(0) : initials[0].charAt(0) + initials[1].charAt(0)
        };
      });
      this.newMem[i].keyDataArray = dataArray;
      // console.log(" fullNameInitilas array ::::", this.newMem);
    }
      // , error => {
      //     this.isActivityGroupSearchLoading = false;
      //     this.wiproContact4c = [];
      //     this.keywiprocontactname=[];
      //     this.keyContactNamevalue = [];}
    ));
    // }

  }
  appendcontact4(item) {
    // console.log("item value ", item);
    this.contactName4 = item.FullName;
    this.contactid = item.SysGuid;

    // this.selectedContact4.push(this.wiproContact4[i])
  }

  setBussiness(e, status) {
    this.addrelationshipplanForm.controls['ContactUsingWiproServices'].setValue(status);
    this.ContactUsingWiproServices = status;
  }
  setCompetitor(e, status) {
    this.addrelationshipplanForm.controls['ContactWorkswithCompetition'].setValue(status);
    this.ContactWorkswithCompetition = status;
  }
  getcontactname(event) {
    this.wiproContact4c = [];
    this.contactNamevalue = [];
    // if (event.target.value.length > 0) {
    this.isActivityGroupSearchLoading = true;
    const accountSysId = (sessionStorage.getItem('accountSysId')) ? this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip') : '';
    const reqbody = {
      "SearchText": event ? event:'',
      "Guid": accountSysId, //Pass Account Guid
      "PageSize": 10,
      "RequestedPageNumber": 1
    }
    const contactname = this.accoutservice.commonPostObject(reqbody, 'RelationShipCustomerContact')

    contactname.subscribe((res: any) => {
      this.isActivityGroupSearchLoading = false;
      const dataArray = res.ResponseObject.map(val => {
        const initials = val.FullName.split(" ");
        return {
          Guid: val.Guid,
          FullName: val.FullName,
          Initials: initials.length === 1 ? initials[0].charAt(0) : initials[0].charAt(0) + initials[1].charAt(0),
          Designation: val.Designation
        };
      });
      this.contactNamevalue = dataArray;

    });

  }
  appendcontactname(item) {
    this.contactNameId = item.Guid;
    this.contactName4c = item.FullName;
    this.contactTitle = item.Designation;
    // this.addrelationshipplanForm.controls['Title'].setValue(item.Designation);

  }
  appendkeycontactname(item, index) {
    this.newMem[index].Guid = item.SysGuid;
    this.newMem[index].FullName = item.FullName;

  }
  removeEmptyArray(data)
  {
    let newdata = [];
    data.forEach( element => {
      if(element.Guid){
        newdata.push(element)
      }
   });
  return newdata;
  }

  createrelationshipplanData() {

    const createPayload = {
      'Guid': this.addrelationshipplanForm.value.Guid,
      'RelationShipContact': {
        'Guid': this.contactNameId
      },
      // Title = contactTitle
      'Title': this.contactTitle,
      // 'Title': this.addrelationshipplanForm.value.Title,
      'ContactUsingWiproServices': this.addrelationshipplanForm.value.ContactUsingWiproServices,
      'ContactWorkswithCompetition': this.addrelationshipplanForm.value.ContactWorkswithCompetition,
      'StrategyToImproveRelationship': this.addrelationshipplanForm.value.StrategyToImproveRelationship,
      'CustomerAccount': {
        'SysGuid': this.accountSysId
      },
      'Owner': {
        'SysGuid': this.contactid
      },
      'KeyWiproContactList': this.removeEmptyArray(this.newMem)

    };
    if (this.addrelationshipplanForm.invalid) {
      this.relationFormSubmitted = true;
    } else {
      if (this.isEdit === 'edit') {
        this.relationFormSubmitted = false;
        this.isLoading = true;
        const editrelationship = this.accoutservice.editRelationShipPlan(createPayload);
        editrelationship.subscribe((res: any) => {
          if (!res.IsError && res.ResponseObject) {
            this.isLoading = false;

            this.snackBar.open(res['Message'], '',
              {
                duration: 3000
              });
            this.store.dispatch(new relationshiPlanclear({ relationshipplanmodel: {} }))
            this.goBack();

          } else if (res.IsError) {
            this.isLoading = false;
            this.snackBar.open(res['Message'], '', {
              duration: 3000
            });
          }

        });
      } else {

        this.relationFormSubmitted = false;
        this.isLoading = true;
        const addrelationship = this.accoutservice.addRelationShipPlan(createPayload);
        addrelationship.subscribe((res: any) => {
          if (!res.IsError && res.ResponseObject) {
            this.isLoading = false;

            this.goBack();
            this.snackBar.open(res['Message'], '',
              {
                duration: 3000
              });
            this.store.dispatch(new relationshiPlanclear({ relationshipplanmodel: {} }))

          } else if (res.IsError) {

            this.isLoading = false;
            this.snackBar.open(res['Message'], '', {
              duration: 3000
            });
          }

        });
      }
    }

  }
  /****************** wipro contact autocomplete code end ****************** */

  goBack() {

    this.router.navigate(['accounts/contacts/relationshipplan']);
    localStorage.removeItem('editData');
    localStorage.removeItem('isEdit');
  }

  // convenience getter for easy access to form fields
  get prosForm() { return this.prospectAccForm.controls; }
  get accOwnerSwap() { return this.accOwnerSwapForm.controls; }
  scrollTo(el: Element) {
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }


  addRowTable() {


    let obj =
    {
      "LinkActionType": 1,
      "Guid": "",
      "FullName": "",
      "Relationshiptheme": {
        "Id": ""
      },
      "MeetingFrequency": {
        "Id": ""
      },
      "MapGuid": "",
      "keyDataArray": [],
      "showAndHide":true
    }
    this.newMem.push(obj);
    //this.table_datakey.push(newMem);
  }
  ngOnDestroy() {
    localStorage.removeItem('editData');
    localStorage.removeItem('isEdit');
  }
  restrictspace1(e, data) {
    if (e.which === 32 && !data.length)
      e.preventDefault();
    return;



  }
}