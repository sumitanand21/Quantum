import { Component, OnInit, ElementRef } from '@angular/core';
import { DataCommunicationService, ConversationService, CampaignService, OfflineService, routes, ErrorMessage } from '@app/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatSnackBar, MatDialogRef } from '@angular/material';
import { MatDialog } from '@angular/material/';
import { MasterApiService } from '@app/core/services/master-api.service';
import { Router } from '@angular/router';
import { RoutingState } from '@app/core/services/navigation.service';
import { removeSpaces, checkLimit } from '@app/shared/pipes/white-space.validator';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { ActivityService } from '@app/core/services/activity.service';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { CampaignAdvNames, DnBAccountHeader } from '@app/core/services/campaign.service';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';
import { activitypop1 } from '@app/modules/conversation/pages/conversation.component';
@Component({
  selector: 'generic-prospect-account',
  templateUrl: './generic.prospect.account.html',
  styleUrls: ['./generic.prospect.account.scss']
})
export class GenericProspectAccount implements OnInit {
  prospectAccountForm: FormGroup;
  VerticalByname: any;
  subVerticleByName: any;
  getGoe: any = [];
  getContactId: any;
  getDunsid: any;
  getAccountIdByAccName: any;
  getOwnerSystemId: any;
  addDateArray: FormArray;
  getProspectStatusCodes: any;
  getCountry: any;
  getCity: any;
  getState: any = [];
  wiproSolution: any;
  RegionNameSwitch: boolean = false;
  accountCompanyName: string = '';
  selectedConversation: {}[] = [];
  searchRegion: any;
  selectedCountryDetails: any;
  ConversationCityNameSwitch: boolean = false;
  ConversationCountrtyNameSwitch: boolean = false;
  ConversationStateNameSwitch: boolean = false;
  selectedCountryConversation: {}[] = [];
  getCountri: string = '';
  selectedCityDetails: any;
  getCityId: string = '';
  verticalNameSwitch: boolean = false;
  getVerticle: string = '';
  subVerticalNameSwitch = false;
  getSubverticle: any;
  geoNameSwitch: boolean = false;
  getGeo: string = '';
  dunsidNameSwitch = false
  getDunsids: any;
  ownerNameSwitch = false
  getOwnerId: any;
  parentAccountNameSwitch = false
  getParentId: any;
  prospectNumberNameSwitch = false
  getparentContactsId: any
  getOwnerShipType: any;
  getProspectTypes: any;
  getProspectRequestTypes: any;
  contactType: any = [];
  isActivity: boolean = false;
  isLoading: boolean = false;
  isVerticalSearchLoading: boolean = false;
  isSbuSearchLoading: boolean = false;
  isCountrySearchLoading: boolean = false;
  isCitySearchLoading: boolean = false;
  isStateSearchLoading: boolean = false;
  isRegionSearchLoading: boolean = false;
  isGeoSearchLoading: boolean = false;
  getStateID: string = '';
  arrowkeyLocation = 0;
  userId: any;
  saveClicked: boolean = false;
  IndustryData: any;
  lookupdata = {
    tabledata: [],
    recordCount: 10,
    headerdata: [],
    Isadvancesearchtabs: false,
    controlName: '',
    lookupName: '',
    isCheckboxRequired: false,
    IsProspectAccount: true,
    isBackbuttonrequired: false,
    inputValue: '',
    TotalRecordCount: 0,
    selectedRecord: [],
    pageNo: 1,
    nextLink: '',
    isLoader: false,
    errorMsg: {
      isError: false,
      message: ""
    },
    otherDbData: {
      countryvalue: [],
      isLoader: false,
    }
  };
  sessionstorageData: any;
  accountNameSwitch: boolean = false;
  accountNameSelect: string = "";
  accountIdSelect: string = '';
  verticleName: string = '';
  sbuNameSwitch: boolean = false;
  sbuName: string = '';
  getsbuId: string = '';
  geoName: string = '';
  regionName: string = '';
  isStateValid: boolean = false;
  isCityValid: boolean = false;
  getCountryName: string = '';
  getStateName: string = '';
  getCityName: string = '';
  isMeeting: boolean = false;
  isEditMeeting: boolean = false;
  isAccountCustomProspect: boolean = false;
  constructor(
    public el: ElementRef,
    public dialog: MatDialog,
    public service: DataCommunicationService,
    public fb: FormBuilder,
    private snackBar: MatSnackBar,
    private conversationService: ConversationService,
    public campaignService: CampaignService,
    private masterApiService: MasterApiService,
    public offlineService: OfflineService,
    private EncrDecr: EncrDecrService,
    private router: Router,
    private activityService: ActivityService,
    public errorMessage: ErrorMessage,
    private S3MasterApiService: S3MasterApiService,
    public routingState: RoutingState) { this.createProspectFormGroup(); }
  ngOnInit() {
    this.isAccountCustomProspect = true;
    this.S3MasterApiService.getdnbtoken('code').subscribe(res => {
      localStorage.setItem('dNBToken', res.ResponseObject.access_token)
    })
    this.userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
    this.getMasterApi();
    if (JSON.parse(sessionStorage.getItem('CreateActivityGroup'))) {
      this.sessionstorageData = JSON.parse(sessionStorage.getItem('CreateActivityGroup'));
      if (this.sessionstorageData.model == "Account") {
        this.isAccountCustomProspect = false;
      }
      let id = JSON.parse(sessionStorage.getItem('CreateActivityGroup'))
      if (id.account) {
        if (id.account.Id && id.account.Id != "") {
          this.wiproDnBAutopopulate(JSON.parse(sessionStorage.getItem('CreateActivityGroup')));
        } else {
          this.IndustryData = '';
        }
      }
      if (id.model) {
        if (id.model == 'Account') {
          this.removeGeoValidation();
          this.removeRegionValidation();
          this.prospectAccountForm.controls['geo'].disable();
          this.prospectAccountForm.controls['region'].disable();
        }
      }
    }
  }
  wiproDnBAutopopulate(data) {
    if (data) {
      if (data.model) {
        if (data.model != 'Account') {
          var body = { "Id": data.account.Id }
        }
        else {
          body = { "Id": data }
        }
      }
      else {
        body = { "Id": data }
      }
    }
    this.isLoading = true;
    this.activityService.DNBDetailsByDunsId(body).subscribe(res => {
      console.log("DNBDetailsByDunsId", res.ResponseObject);
      if (!res.IsError) {
        this.isLoading = false;
        this.IndustryData = res.ResponseObject;
        if (data.model) {
          if (data.model != 'Account') {
            this.prospectAccountForm.patchValue({
              name: (res.ResponseObject.Name) ? res.ResponseObject.Name : "",
            })
          }
        }
        else {
          this.prospectAccountForm.patchValue({
            accountName: (res.ResponseObject.Name) ? res.ResponseObject.Name : "",
          })
        }
        this.prospectAccountForm.patchValue({
          email: (res.ResponseObject.Email) ? res.ResponseObject.Email : "",
          website: (res.ResponseObject.WebsiteUrl) ? res.ResponseObject.WebsiteUrl : "",
          businessdescription: (res.ResponseObject.BusinessDescription) ? res.ResponseObject.BusinessDescription : ""
        })
        if (res.ResponseObject.Contact) {
          if (res.ResponseObject.Contact.ContactNo) {
            const phonenumbermappingData = [{ ...res.ResponseObject.Contact }].map(contactInfo => this.fb.group({
              ContactNo: contactInfo.ContactNo,
              ContactType: 3,
            }));
            const phoneNumberFormArray = this.fb.array(phonenumbermappingData);
            this.prospectAccountForm.setControl('contacts', phoneNumberFormArray);
          }
        }
        if (res.ResponseObject.Address) {
          if (res.ResponseObject.Address.Geo) {
            if (res.ResponseObject.Address.Geo.Name) {
              this.prospectAccountForm.patchValue({
                geo: res.ResponseObject.Address.Geo.Name
              })
              this.getGeo = res.ResponseObject.Address.Geo.SysGuid;
              this.geoName = res.ResponseObject.Address.Geo.Name;
              this.geoNameSwitch = false;
              if (res.ResponseObject.Address.Region) {
                if (res.ResponseObject.Address.Region.Name) {
                  this.prospectAccountForm.patchValue({
                    region: res.ResponseObject.Address.Region.Name
                  })
                  this.regionName = res.ResponseObject.Address.Region.Name;
                  this.accountCompanyName = res.ResponseObject.Address.Region.SysGuid;
                  this.RegionNameSwitch = false;
                }
                this.cityStateValidateFunction(res.ResponseObject.Address.Region.Name);
              }
              if (res.ResponseObject.Address.Country) {
                if (res.ResponseObject.Address.Country.Name) {
                  this.prospectAccountForm.patchValue({
                    country: res.ResponseObject.Address.Country.Name
                  })
                  this.getCountri = res.ResponseObject.Address.Country.SysGuid;
                  this.getCountryName = res.ResponseObject.Address.Country.Name;
                  this.ConversationCountrtyNameSwitch = false;
                }
              }
            }
          }
        }
      } else {
        this.isLoading = false;
        this.errorMessage.throwError(res.Message)
      }
    }, error => { this.isLoading = false; });
  }
  addContactss($event) {
    $event.preventDefault();
    if (this.prospectAccountForm.value.contacts[this.prospectAccountForm.value.contacts.length - 1].ContactType != "" && this.prospectAccountForm.value.contacts[this.prospectAccountForm.value.contacts.length - 1].ContactNo === "") {
      this.errorMessage.throwError("Enter phone number")
    }
    if (this.prospectAccountForm.value.contacts[this.prospectAccountForm.value.contacts.length - 1].ContactType === "" && this.prospectAccountForm.value.contacts[this.prospectAccountForm.value.contacts.length - 1].ContactNo === "") {
      this.errorMessage.throwError("Enter phone number")
    }
    if (this.prospectAccountForm.value.contacts[this.prospectAccountForm.value.contacts.length - 1].ContactNo.length > 7) {
      if (this.prospectAccountForm.value.contacts.length >= 5) {
        this.errorMessage.throwError("Maximum 5 contact can be added")
      } else {
        this.addDateArray.push(this.addformArray());
      }
    }
  }
  addformArray() {
    let phoneNumber: RegExp = /^([+]?\d{1,2}[.-\s]?)?(\d{3}[.-]?){2}\d{4,7}$/
    return this.fb.group({
      ContactNo: ['', Validators.pattern(phoneNumber)],
      ContactType: ['']
    })
  }
  get getContacts() {
    return this.addDateArray = <FormArray>this.prospectAccountForm.get('contacts') as FormArray;
  }
  getMasterApi() {
    this.masterApiService.getContactType().subscribe(res => {
      this.offlineService.addMasterApiCache(routes.getContactType, res)
      this.contactType = res.ResponseObject;
    })
    this.masterApiService.getProspectOwnerShipType().subscribe(res => {
      this.getOwnerShipType = res.ResponseObject;
    })
  }
  deleteContact(i) {
    if (i > 0) {
      this.addDateArray.removeAt(i);
    } else {
      return null;
    }
  }
  contactTypeChanges($event, i) {
    let contactType = $event.target.value
    if (contactType == '' || contactType == undefined) {
      const facontrol = (<FormArray>this.prospectAccountForm.controls['contacts']).at(i)
      facontrol['controls'].ContactNo.setValue("");
    }
  }
  createProspectFormGroup() {
    let websitePattern = "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
    this.prospectAccountForm = this.fb.group({
      email: [''],
      name: ['', Validators.compose([Validators.required, removeSpaces, checkLimit(101)])],
      state: [''],
      website: ['', Validators.pattern(websitePattern)],
      businessdescription: [''],
      accountName: ['', Validators.compose([Validators.required, removeSpaces, checkLimit(101)])],
      sbu: ['', Validators.required],
      vertical: ['', Validators.required],
      country: ['', Validators.required],
      city: [''],
      region: ['', Validators.required],
      geo: ['', Validators.required],
      ownershiptype: ['', Validators.required],
      contacts: this.fb.array([this.addformArray()]),
    });
    this.prospectValueChanges();
    this.prospectAccountForm.controls['vertical'].disable();
  }
  prospectValueChanges() {
    this.prospectAccountForm.get('sbu').valueChanges.subscribe(val => {
      if (this.prospectAccountForm.get('sbu').dirty && this.sbuNameSwitch) {
        this.sbuLookUpApiLoader(val, true);
      }
    })
    this.prospectAccountForm.get('vertical').valueChanges.subscribe(val => {
      if (this.prospectAccountForm.get('vertical').dirty && this.verticalNameSwitch) {
        this.verticleLookUpApiLoader(val, true);
      }
    })
    this.prospectAccountForm.get('geo').valueChanges.subscribe(val => {
      if (this.prospectAccountForm.get('geo').dirty && this.geoNameSwitch) {
        this.geoLookUpApiLoader(val, true);
      }
    })
    this.prospectAccountForm.get('region').valueChanges.subscribe(val => {
      if (this.prospectAccountForm.get('region').dirty && this.RegionNameSwitch) {
        this.regionLookUpApiLoader(val, true);
      }
    })
    this.prospectAccountForm.get('country').valueChanges.subscribe(val => {
      if (this.prospectAccountForm.get('country').dirty && this.ConversationCountrtyNameSwitch) {
        this.countryLookUpApiLoader(val, true);
      }
    })
    this.prospectAccountForm.get('state').valueChanges.subscribe(val => {
      if (this.prospectAccountForm.get('state').dirty && this.ConversationStateNameSwitch) {
        this.stateLookUpApiLoader(val, true);
      }
    })
    this.prospectAccountForm.get('city').valueChanges.subscribe(val => {
      if (this.prospectAccountForm.get('city').dirty && this.ConversationCityNameSwitch) {
        this.cityLookUpApiLoader(val, true);
      }
    })
  }
  clickSbuData() {
    this.sbuLookUpApiLoader('', false);
  }
  clickVerticleData() {
    this.verticleLookUpApiLoader('', false);
  }
  clickGeoData() {
    this.geoLookUpApiLoader('', false);
  }
  clickRegionData() {
    this.regionLookUpApiLoader('', false)
  }
  clickCountryData() {
    this.countryLookUpApiLoader('', false);
  }
  clickStateData() {
    this.stateLookUpApiLoader('', false);
  }
  clickCityData() {
    this.cityLookUpApiLoader('', false);
  }
  setGeoValidation() {
    this.prospectAccountForm.controls['geo'].setValidators(Validators.required);
    this.prospectAccountForm.controls['geo'].markAsTouched();
    this.prospectAccountForm.controls['geo'].updateValueAndValidity()
  }
  removeGeoValidation() {
    this.prospectAccountForm.controls['geo'].clearValidators();
    this.prospectAccountForm.controls['geo'].updateValueAndValidity()
  }
  setRegionValidation() {
    this.prospectAccountForm.controls['region'].setValidators(Validators.required);
    this.prospectAccountForm.controls['region'].markAsTouched();
    this.prospectAccountForm.controls['region'].updateValueAndValidity()
  }
  removeRegionValidation() {
    this.prospectAccountForm.controls['region'].clearValidators();
    this.prospectAccountForm.controls['region'].updateValueAndValidity()
  }
  stateValidate() {
    this.prospectAccountForm.controls['state'].markAsTouched();
    this.prospectAccountForm.controls['state'].setValidators(Validators.required);
    this.prospectAccountForm.controls['state'].updateValueAndValidity()
  }
  removeSateValidate() {
    this.prospectAccountForm.controls['state'].markAsUntouched();
    this.prospectAccountForm.controls['state'].clearValidators();
    this.prospectAccountForm.controls['state'].updateValueAndValidity()
  }
  cityValidate() {
    this.prospectAccountForm.controls['city'].markAsTouched();
    this.prospectAccountForm.controls['city'].setValidators(Validators.required);
    this.prospectAccountForm.controls['city'].updateValueAndValidity()
  }
  removeCityValidate() {
    this.prospectAccountForm.controls['city'].markAsUntouched();
    this.prospectAccountForm.controls['city'].clearValidators();
    this.prospectAccountForm.controls['city'].updateValueAndValidity()
  }
  verticleLookUpApiLoader(val, IsValueChanges) {
    if (IsValueChanges == false) {
      this.prospectAccountForm.patchValue({
        vertical: ''
      });
    }
    this.isVerticalSearchLoading = true;
    this.VerticalByname = [];
    this.campaignService.GetVerticalbySBUID(val, this.getsbuId).subscribe((res) => {
      this.isVerticalSearchLoading = false;
      if (!res.IsError) {
        this.VerticalByname = res.ResponseObject;
      } else {
        this.errorMessage.throwError(res.Message);
        this.VerticalByname = [];
      }
    }, error => {
      this.isVerticalSearchLoading = false;
      this.VerticalByname = [];
    })
  }
  sbuLookUpApiLoader(val, IsValueChanges) {
    if (IsValueChanges == false) {
      this.prospectAccountForm.patchValue({
        sbu: ''
      });
    }
    this.isSbuSearchLoading = true;
    this.subVerticleByName = [];
    this.campaignService.getSearchSBUByname(val).subscribe((res) => {
      this.isSbuSearchLoading = false;
      if (!res.IsError) {
        this.subVerticleByName = res.ResponseObject;
      } else {
        this.errorMessage.throwError(res.Message);
        this.subVerticleByName = [];
      }
    }, error => {
      this.isSbuSearchLoading = false;
      this.subVerticleByName = [];
    })
  }
  geoLookUpApiLoader(val, IsValueChanges) {
    if (IsValueChanges == false) {
      this.prospectAccountForm.patchValue({
        geo: ''
      });
    }
    this.isGeoSearchLoading = true;
    this.getGoe = [];
    this.S3MasterApiService.geoSearch({ "SearchText": val }).subscribe(res => {
      this.isGeoSearchLoading = false;
      if (!res.IsError) {
        this.getGoe = res.ResponseObject;
      } else {
        this.errorMessage.throwError(res.Message);
        this.getGoe = [];
      }
    }, error => {
      this.isGeoSearchLoading = false;
      this.getGoe = [];
    })
  }
  regionLookUpApiLoader(val, IsValueChanges) {
    if (IsValueChanges == false) {
      this.prospectAccountForm.patchValue({
        region: ''
      });
    }
    this.isRegionSearchLoading = true;
    this.searchRegion = [];
    if (this.getGeo !== '') {
      this.S3MasterApiService.RegionByGeo(this.getGeo, val).subscribe(res => {
        this.isRegionSearchLoading = false;
        if (!res.IsError) {
          this.searchRegion = res.ResponseObject;
        } else {
          this.errorMessage.throwError(res.Message);
          this.searchRegion = [];
        }
      }, error => {
        this.isRegionSearchLoading = false;
        this.searchRegion = [];
      })
    } else {
      this.S3MasterApiService.GetAllByRegion(val).subscribe(res => {
        this.isRegionSearchLoading = false;
        if (!res.IsError) {
          this.searchRegion = res.ResponseObject.map(x => {
            return {
              ...x,
              Name: x.Region.Name,
              SysGuid: x.Region.SysGuid
            }
          });
        } else {
          this.errorMessage.throwError(res.Message);
          this.searchRegion = [];
        }
      }, error => {
        this.isRegionSearchLoading = false;
        this.searchRegion = [];
      })
    }
  }
  countryLookUpApiLoader(val, IsValueChanges) {
    if (IsValueChanges == false) {
      this.prospectAccountForm.patchValue({
        country: ''
      });
    }
    this.isCountrySearchLoading = true;
    this.getCountry = [];
    if (this.accountCompanyName !== '') {
      this.S3MasterApiService.CountryByRegion(this.accountCompanyName, val).subscribe(res => {
        this.isCountrySearchLoading = false;
        if (!res.IsError) {
          this.getCountry = res.ResponseObject;
        } else {
          this.errorMessage.throwError(res.Message);
          this.getCountry = [];
        }
      }, error => {
        this.isCountrySearchLoading = false;
        this.getCountry = [];
      })
    } else {
      this.S3MasterApiService.GetAllByCountry(val).subscribe(res => {
        this.isCountrySearchLoading = false;
        if (!res.IsError) {
          this.getCountry = res.ResponseObject.map(x => {
            return {
              ...x,
              Name: x.Country.Name,
              SysGuid: x.Country.SysGuid,
              isExists: x.Country.isExists
            }
          });
        } else {
          this.errorMessage.throwError(res.Message);
          this.getCountry = [];
        }
      }, error => {
        this.isCountrySearchLoading = false;
        this.getCountry = [];
      })
    }
  }
  stateLookUpApiLoader(val, IsValueChanges) {
    if (IsValueChanges == false) {
      this.prospectAccountForm.patchValue({
        state: ''
      });
    }
    this.isStateSearchLoading = true;
    this.getState = [];
    if (this.getCountri !== '') {
      this.S3MasterApiService.getStateByCountry(this.getCountri, val).subscribe(res => {
        this.isStateSearchLoading = false;
        if (!res.IsError) {
          this.getState = res.ResponseObject;
        } else {
          this.errorMessage.throwError(res.Message);
          this.getState = [];
        }
      }, error => {
        this.isStateSearchLoading = false;
        this.getState = [];
      })
    } else {
      this.S3MasterApiService.GetAllByState(val).subscribe(res => {
        this.isStateSearchLoading = false;
        if (!res.IsError) {
          this.getState = res.ResponseObject.map(x => {
            return {
              ...x,
              Name: x.State.Name,
              SysGuid: x.State.SysGuid,
              isExists: x.State.isExists
            }
          });;
        } else {
          this.errorMessage.throwError(res.Message);
          this.getState = [];
        }
      }, error => {
        this.isStateSearchLoading = false;
        this.getState = [];
      })
    }
  }
  cityLookUpApiLoader(val, IsValueChanges) {
    if (IsValueChanges == false) {
      this.prospectAccountForm.patchValue({
        city: ''
      });
    }
    this.isCitySearchLoading = true;
    this.getCity = [];
    if (this.getStateID !== '') {
      this.S3MasterApiService.CityByState(this.getStateID, val).subscribe(res => {
        this.isCitySearchLoading = false;
        if (!res.IsError) {
          this.getCity = res.ResponseObject;
        } else {
          this.errorMessage.throwError(res.Message);
          this.getCity = [];
        }
      }, error => {
        this.isCitySearchLoading = false;
        this.getCity = [];
      })
    } else {
      if (this.getCountri === '') {
        this.S3MasterApiService.GetAllByCity(val).subscribe(res => {
          this.isCitySearchLoading = false;
          if (!res.IsError) {
            this.getCity = res.ResponseObject.map(x => {
              return {
                ...x,
                Name: x.City.Name,
                SysGuid: x.City.SysGuid
              }
            });
          } else {
            this.errorMessage.throwError(res.Message);
            this.getCity = [];
          }
        }, error => {
          this.isCitySearchLoading = false;
          this.getCity = [];
        })
      } else {
        this.isCitySearchLoading = false
      }
    }
  }
  clicAccountData() {
    this.lookupdata['controlName'] = 'Account/Company name';
    this.lookupdata['headerdata'] = DnBAccountHeader;
    this.lookupdata['lookupName'] = CampaignAdvNames['AccountSearch']['name'];
    this.lookupdata['isCheckboxRequired'] = CampaignAdvNames['AccountSearch']['isCheckbox'];
    this.lookupdata['Isadvancesearchtabs'] = false;
    this.lookupdata['inputValue'] = '';
    this.lookupdata['enableOtherDbOnly'] = true;
    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: '700px',
      data: this.lookupdata,
      disableClose: true
    });
    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
      this.dnBDataBase(x);
    })
    dialogRef.afterClosed().subscribe(res => {
      if (res.selectedData) {
        if (res.selectedData.length > 0) {
          this.isAccountCustomProspect = false;
          this.wiproDnBAutopopulate(res.selectedData[0].Id);
        } else {
          this.isAccountCustomProspect = true;
          // this.createProspectFormGroup();
          this.prospectAccountForm.controls['accountName'].clearValidators();
          this.prospectAccountForm.controls['accountName'].updateValueAndValidity();
        }
      }
    })
  }
  dnBDataBase(action) {
    if (action.action == "dbAutoSearch") {
      this.lookupdata['otherDbData']['isLoader'] = true;
      this.activityService.getCountryData({ isService: true, searchKey: action['objectRowData']['searchKey'] }).subscribe(res => {
        this.lookupdata['otherDbData']['isLoader'] = false;
        this.lookupdata['isLoader'] = false;
        if (res.IsError == false) {
          this.lookupdata['errorMsg']['isError'] = false;
          this.lookupdata['errorMsg']['message'] = '';
          this.lookupdata['otherDbData']['countryvalue'] = res.ResponseObject;
        }
      }, error => {
        this.lookupdata['isLoader'] = false;
        this.lookupdata['otherDbData']['isLoader'] = false;
      })
    }
    if (action.action == "dbSearch") {
      let body = {
        "CustomerAccount": {
          "Name": action['objectRowData']['dbSerachData']['accountname']['value'],
          "Address": { "CountryCode": action['objectRowData']['dbSerachData']['countryvalue']['id'] }
        }
      }
      this.activityService.getSearchAccountInDNB({ isService: true, body: body }).subscribe(res => {
        this.lookupdata['otherDbData']['isLoader'] = false;
        this.lookupdata['isLoader'] = false;
        if (res.IsError == false) {
          this.lookupdata['errorMsg']['isError'] = false;
          this.lookupdata['errorMsg']['message'] = '';
          this.lookupdata['TotalRecordCount'] = res.TotalRecordCount;
          this.lookupdata['tabledata'] = res.ResponseObject;
          this.lookupdata['nextLink'] = (res.OdatanextLink) ? res.OdatanextLink : '';
        }
        if (res.IsError == true) {
          this.lookupdata['tabledata'] = [];
          this.lookupdata['TotalRecordCount'] = 0;
          this.lookupdata['nextLink'] = '';
        }
      }, error => {
        this.lookupdata['isLoader'] = false;
        this.lookupdata['otherDbData']['isLoader'] = false;
      })
    }
  }
  get f() {
    return this.prospectAccountForm.controls
  }
  appendVertical(item: any) {
    this.verticleName = item.Name;
    this.getVerticle = item.Id;
    this.prospectAccountForm.patchValue({ vertical: item.Name })
    this.verticalNameSwitch = false;
  }
  verticalNameclose() {
    this.verticalNameSwitch = false
    if (this.verticleName === '') {
      this.prospectAccountForm.patchValue({ vertical: "" })
    }
    if (this.verticleName !== '') {
      this.prospectAccountForm.patchValue({ vertical: this.verticleName })
    }
  }
  clearVerticalName() {
    this.verticleName = '';
    this.getVerticle = '';
    this.prospectAccountForm.patchValue({ vertical: "" })
  }
  accountNameClose() {
    this.accountNameSwitch = false;
  }
  appendAccount(item: any) {
    if (item.Id != this.getsbuId) {
    }
    this.accountNameSelect = item.Name;
    this.accountIdSelect = item.Id;
    this.prospectAccountForm.patchValue({ accountName: item.Name });
    this.prospectAccountForm.controls['vertical'].enable();
    this.accountNameSwitch = false;
  }
  sbuNameClose() {
    this.sbuNameSwitch = false;
    if (this.sbuName === '') {
      this.prospectAccountForm.patchValue({ sbu: "" })
    }
    if (this.sbuName !== '') {
      this.prospectAccountForm.patchValue({ sbu: this.sbuName })
    }
  }
  appendSbu(item: any) {
    this.sbuName = item.Name;
    this.getsbuId = item.Id;
    this.prospectAccountForm.patchValue({ sbu: item.Name });
    this.prospectAccountForm.controls['vertical'].enable();
    this.sbuNameSwitch = false;
  }
  clearSbuName() {
    this.sbuName = '';
    this.getsbuId = '';
    this.prospectAccountForm.patchValue({ sbu: "" });
    this.prospectAccountForm.controls['vertical'].disable();
    this.clearVerticalName();
  }
  appendGeo(item: any) {
    if (item.SysGuid != this.getGeo) {
      this.clearGeoName();
    }
    this.getGeo = item.SysGuid;
    this.geoName = item.Name;
    this.geoNameSwitch = false;
    this.prospectAccountForm.patchValue({ geo: item.Name })
  }
  geoNameclose() {
    this.geoNameSwitch = false;
    if (this.geoName == '') {
      this.prospectAccountForm.patchValue({ geo: "" })
    }
    if (this.geoName != '') {
      this.prospectAccountForm.patchValue({ geo: this.geoName })
    }
  }
  clearGeoName() {
    this.getGeo = '';
    this.geoName = '';
    this.regionName = '';
    this.accountCompanyName = '';
    this.getCountri = '';
    this.getCountryName = '';
    this.getStateID = '';
    this.getStateName = '';
    this.getCityId = '';
    this.getCityName = '';
    this.prospectAccountForm.patchValue({
      geo: "",
      region: "",
      country: "",
      state: "",
      city: ""
    });
    this.isStateValid = false;
    this.isCityValid = false;
    this.removeSateValidate();
    this.removeCityValidate();
  }
  cityStateValidateFunction(item) {
    if ((item).trim() == 'INDIA' || (item).trim() == 'UK') {
      this.isStateValid = true;
      this.isCityValid = true;
      this.stateValidate();
      this.cityValidate();
    } else {
      this.isStateValid = false;
      this.isCityValid = false;
      this.removeSateValidate();
      this.removeCityValidate();
    }
  }
  appendRegion(item: any) {
    if (item.SysGuid != this.accountCompanyName) {
      this.clearRegionName();
    }
    this.accountCompanyName = item.SysGuid;
    this.regionName = item.Name;
    this.prospectAccountForm.patchValue({
      region: item.Name,
    });
    if (item.Region && item.Geo) {
      this.accountCompanyName = item.Region.SysGuid;
      this.regionName = item.Region.Name;
      this.getGeo = item.Geo.SysGuid;
      this.geoName = item.Geo.Name;
      this.prospectAccountForm.patchValue({
        region: item.Region.Name,
        geo: item.Geo.Name
      });
    }
    this.RegionNameSwitch = false;
  }
  RegionNameclose() {
    this.RegionNameSwitch = false;
    if (this.regionName == '') {
      this.prospectAccountForm.patchValue({ region: "" });
    }
    if (this.regionName != '') {
      this.prospectAccountForm.patchValue({ region: this.regionName })
    }
  }
  clearRegionName() {
    this.regionName = '';
    this.accountCompanyName = '';
    this.getCountri = '';
    this.getCountryName = '';
    this.getStateID = '';
    this.getStateName = '';
    this.getCityId = '';
    this.getCityName = '';
    this.prospectAccountForm.patchValue({
      region: "",
      country: "",
      state: "",
      city: ""
    });
    this.isStateValid = false;
    this.isCityValid = false;
    this.removeSateValidate();
    this.removeCityValidate()
  }
  appendCountryConversation(item) {
    if (item.SysGuid != this.getCountri) {
      this.clearCountryName();
    }
    this.getCountri = item.SysGuid;
    this.getCountryName = item.Name;
    this.prospectAccountForm.patchValue({ country: item.Name })
    if (item.isExists == true) {
      this.isStateValid = true;
      this.stateValidate();
    } else {
      this.isStateValid = false;
      this.removeSateValidate();
    }
    if (item.Region && item.Geo) {
      this.accountCompanyName = item.Region.SysGuid;
      this.regionName = item.Region.Name;
      this.getGeo = item.Geo.SysGuid;
      this.geoName = item.Geo.Name;
      this.prospectAccountForm.patchValue({
        region: item.Region.Name,
        geo: item.Geo.Name
      })
    }
    this.ConversationCountrtyNameSwitch = false;
  }
  ConversationCountryNameclose() {
    this.ConversationCountrtyNameSwitch = false;
    if (this.getCountryName == '') {
      this.prospectAccountForm.patchValue({ country: "" });
    }
    if (this.getCountryName != '') {
      this.prospectAccountForm.patchValue({ country: this.getCountryName })
    }
  }
  clearCountryName() {
    this.getCountri = '';
    this.getCountryName = '';
    this.getStateID = '';
    this.getStateName = '';
    this.getCityId = '';
    this.getCityName = '';
    this.prospectAccountForm.patchValue({
      country: "",
      state: "",
      city: ""
    });
    this.isStateValid = false;
    this.isCityValid = false;
    this.removeSateValidate();
    this.removeCityValidate();
    if (JSON.parse(sessionStorage.getItem('CreateActivityGroup'))) {
      let id = JSON.parse(sessionStorage.getItem('CreateActivityGroup'))
      if (id.model == "Account") {
        this.clearGeoName();
      }
    }
  }
  appendStateConversation(item) {
    if (item.SysGuid != this.getStateID) {
      this.clearStateName();
    }
    this.getStateID = item.SysGuid;
    this.getStateName = item.Name;
    this.prospectAccountForm.patchValue({ state: item.Name })
    if (item.isExists == true) {
      this.cityValidate();
      this.isCityValid = true;
    } else {
      this.removeCityValidate();
      this.isCityValid = false;
    }
    if (item.Country && item.Region && item.Geo) {
      this.getCountri = item.Country.SysGuid;
      this.getCountryName = item.Country.Name;
      this.accountCompanyName = item.Region.SysGuid;
      this.regionName = item.Region.Name;
      this.getGeo = item.Geo.SysGuid;
      this.geoName = item.Geo.Name;
      this.cityStateValidateFunction(item.Region.Name);
      this.prospectAccountForm.patchValue({
        country: item.Country.Name,
        region: item.Region.Name,
        geo: item.Geo.Name
      })
    }
    this.ConversationStateNameSwitch = false;
  }
  ConversationStateNameclose() {
    this.ConversationStateNameSwitch = false
    if (this.getStateName == '') {
      this.prospectAccountForm.patchValue({ state: "" })
    }
    if (this.getStateName != '') {
      this.prospectAccountForm.patchValue({ state: this.getStateName })
    }
  }
  clearStateName() {
    this.getStateID = '';
    this.getStateName = '';
    this.prospectAccountForm.patchValue({
      state: "",
    });
    this.clearCityName();
  }
  appendCityConversation(item: any) {
    this.getCityId = item.SysGuid;
    this.getCityName = item.Name;
    this.prospectAccountForm.patchValue({ city: item.Name })
    if (item.City && item.State && item.Country && item.Region) {
      this.getStateID = item.State.SysGuid;
      this.getStateName = item.State.Name;
      this.getCountri = item.Country.SysGuid;
      this.getCountryName = item.Country.Name;
      this.accountCompanyName = item.Region.SysGuid;
      this.regionName = item.Region.Name;
      this.getGeo = item.Geo.SysGuid;
      this.geoName = item.Geo.Name;
      this.cityStateValidateFunction(item.Region.Name);
      this.prospectAccountForm.patchValue({
        state: item.State.Name,
        country: item.Country.Name,
        region: item.Region.Name,
        geo: item.Geo.Name
      })
    }
    this.ConversationCityNameSwitch = false;
  }
  ConversationCityNameclose() {
    this.ConversationCityNameSwitch = false;
    if (this.getCityId == '') {
      this.prospectAccountForm.patchValue({ city: "" })
    }
    if (this.getCityName != '') {
      this.prospectAccountForm.patchValue({ city: this.getCityName })
    }
  }
  clearCityName() {
    this.getCityId = '';
    this.getCityName = '';
    this.prospectAccountForm.patchValue({ city: "" })
  }
  navTo() {
    this.routingState.backClicked();
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
  onSubmit() {
    if (this.isAccountCustomProspect == true) {
      var Name = this.prospectAccountForm.value.name;
      this.prospectAccountForm.controls['accountName'].clearValidators();
      this.prospectAccountForm.controls['accountName'].updateValueAndValidity();
    } else {
      var Name = this.prospectAccountForm.value.accountName;
      this.prospectAccountForm.controls['name'].clearValidators();
      this.prospectAccountForm.controls['name'].updateValueAndValidity();
    }
    if (this.prospectAccountForm.valid) {
      this.isLoading = true;
      this.saveClicked = true;
      const PostDataProspectAccountForm = {
        "Name": Name,
        "DUNID": (this.IndustryData != undefined) ? (this.IndustryData.DUNSID) ? this.IndustryData.DUNSID.SysGuid : "" : "",
        "Number": "",
        "UserGuid": this.userId,
        "Industry": (this.IndustryData != undefined) ? (this.IndustryData.Industry) ? this.IndustryData.Industry : '' : '',
        "CustomerAccount": { "SysGuid": "" },
        "Vertical": { "Id": this.getVerticle },
        "sbu": { "Id": this.getsbuId },
        "CityObj": { "SysGuid": this.getCityId },
        "CountryObj": { "SysGuid": this.getCountri },
        "RegionObj": { "SysGuid": this.accountCompanyName },
        "GeoObj": { "SysGuid": this.getGeo },
        "BusinessDescription": this.prospectAccountForm.value.businessdescription,
        "Website": this.prospectAccountForm.value.website,
        "OwnershipType": +this.prospectAccountForm.value.ownershiptype,
        "Owner": { "SysGuid": "" },
        "RequestDate": null,
        "Contact": this.prospectAccountForm.controls.contacts.value,
        "State": { "SysGuid": this.getStateID },
        "Email": (this.prospectAccountForm.value.email != '') ? this.prospectAccountForm.value.email : ""
      }
      console.log(JSON.stringify(PostDataProspectAccountForm));
      this.conversationService.createProspectAccountPost(PostDataProspectAccountForm).subscribe((success) => {
        console.log("success prospect", success);
        if (!success.IsError) {
          this.isLoading = false;
          this.saveClicked = true;
          if (JSON.parse(sessionStorage.getItem('CreateActivityGroup'))) {
            this.errorMessage.onSuccessMessage(success.Message).afterDismissed().subscribe(() => {
              this.prospectSwitch(success.ResponseObject);
            })
          } else {
            var object = {
              activityGroupName: null,
              account: {
                isProspect: success.ResponseObject.isProspect,
                Name: success.ResponseObject.Name,
                SysGuid: success.ResponseObject.Guid
              }
            }
            sessionStorage.setItem('CreateActivityGroup', JSON.stringify(object))
            if (sessionStorage.getItem("TempLeadDetails")) {
              let accountTemp = JSON.parse(sessionStorage.getItem("TempLeadDetails"))
              accountTemp.accountName = {
                isProspect: success.ResponseObject.isProspect,
                Name: success.ResponseObject.Name,
                SysGuid: success.ResponseObject.Guid
              },
                accountTemp.showFirstForm = true
              sessionStorage.setItem('TempLeadDetails', JSON.stringify(accountTemp))
            }
          }
        }
        if (success.IsError) {
          this.isLoading = false;
          this.saveClicked = false;
          let action;
          this.snackBar.open(success.Message, action, {
            duration: 3000,
          })
        }
      }, () => {
        this.isLoading = false;
        this.saveClicked = false;
      })
    }
    else {
      this.service.validateAllFormFields(this.prospectAccountForm);
      let invalidElements = this.el.nativeElement.querySelectorAll('#validatescroll .ng-invalid');
      if (invalidElements.length) {
        this.scrollTo(invalidElements[0]);
        this.service.validationErrorMessage();
      }
      return;
    }
  }
  prospectSwitch(data) {
    var sessionStorageObject = JSON.parse(sessionStorage.getItem('CreateActivityGroup'));
    switch (sessionStorageObject.model) {
      case 'Create activity': {
        this.activities(data, "CreateActivity");
        this.router.navigateByUrl('activities/myactivities');
        break;
      }
      case 'Campaign': {
        this.campaignData(data);
        sessionStorage.setItem('tableName', JSON.stringify("conversation"))
        this.router.navigateByUrl(sessionStorageObject.route);
        break;
      }
      case 'Add meeting': {
        this.activities(data, "AddMeeting");
        this.router.navigateByUrl('activities/newmeeting');
        break;
      }
      case 'Edit activity': {
        this.activities(data, "EditMeeting");
        this.router.navigateByUrl('activities/meetingInfo');
        break;
      }
      case 'Create contact enrich': {
        this.contact(data);
        this.router.navigateByUrl(sessionStorageObject.route);
        break;
      }
      case 'Create contact abridge': {
        this.contact(data);
        this.router.navigateByUrl(sessionStorageObject.route);
        break;
      }
      case 'Create lead': {
        this.contact(data);
        if (sessionStorage.getItem("TempLeadDetails")) {
          let accountTemp = JSON.parse(sessionStorage.getItem("TempLeadDetails"))
          accountTemp.accountName = {
            isProspect: data.isProspect,
            Name: data.Name,
            SysGuid: data.Guid
          }
          accountTemp.showFirstForm = true
          sessionStorage.setItem('TempLeadDetails', JSON.stringify(accountTemp))
        }
        this.router.navigateByUrl(sessionStorageObject.route);
        break;
      }
      case 'Account': {
        this.router.navigateByUrl(sessionStorageObject.route);
        return
      }
    }
  }
  activities(data, info) {
    if (info == "AddMeeting") {
      this.isMeeting = true;
    }
    if (info == "EditMeeting") {
      this.isEditMeeting = true
    }
    var sessionStorageObject = JSON.parse(sessionStorage.getItem('CreateActivityGroup'));
    var object = {
      activityGroupName: sessionStorageObject.activityGroupName,
      account: {
        isProspect: data.isProspect,
        Name: data.Name,
        SysGuid: data.Guid
      },
      isMeeting: this.isMeeting,
      isEditMeeting: this.isEditMeeting
    }
    sessionStorage.setItem('CreateActivityGroup', JSON.stringify(object))
    if (info === "CreateActivity") {
      setTimeout(() => {
        this.dialog.open(activitypop1, {
          disableClose: true,
          width: '500px',
        });
      }, 1000)
    }
  }
  campaignData(data) {
    // let json1 = {
    //   Name: '',
    //   Account: data.Name,
    //   AccountSysGuid: data.Guid,
    //   isProspect: data.isProspect,
    //   fromProspect: true,
    //   isAccountPopulate: true
    // }
    // sessionStorage.setItem("RequestCampaign", JSON.stringify(json1));
    var getCampaignCacheData = JSON.parse(this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('campaignCacheData'), 'DecryptionDecrip'));
    if (getCampaignCacheData.Accounts != '' || getCampaignCacheData.Accounts.length != 0) {
      getCampaignCacheData.Accounts[0].Name = data.Name;
      getCampaignCacheData.Accounts[0].isProspect = data.isProspect;
      getCampaignCacheData.Accounts[0].SysGuid = data.Guid;
    } else {
      getCampaignCacheData.Accounts[0] = {Name : data.Name, isProspect : data.isProspect, SysGuid : data.SysGuid, LinkActionType : 1};
    }
    var sessionStorageObject = JSON.parse(sessionStorage.getItem('CreateActivityGroup'));
    var object = {
      activityGroupName: sessionStorageObject.activityGroupName,
      account: {
        isProspect: data.isProspect,
        Name: data.Name,
        SysGuid: data.Guid
      }
    }
    let data12 = this.EncrDecr.set("EncryptionEncryptionEncryptionEn", JSON.stringify({...getCampaignCacheData,CreateProspect: true}), "DecryptionDecrip");
    sessionStorage.setItem('campaignCacheData', data12);
    sessionStorage.setItem('CreateActivityGroup', JSON.stringify(object))
  }
  contact(data) {
    var object = {
      activityGroupName: '',
      account: {
        isProspect: data.isProspect,
        Name: data.Name,
        SysGuid: data.Guid
      }
    }
    sessionStorage.setItem('CreateActivityGroup', JSON.stringify(object))
  }
  opencancelpop(): void {
    const dialogRef = this.dialog.open(cancelprospectComponent, {
      width: '400px',
    }).afterClosed().subscribe(res => {
      if (res == 'OK') {
        this.prospectBackSwitch();
      }
    });
  }
  prospectBackSwitch() {
    var sessionStorageObject = JSON.parse(sessionStorage.getItem('CreateActivityGroup'));
    switch (sessionStorageObject.model) {
      case 'Create activity': {
        setTimeout(() => {
          this.dialog.open(activitypop1, {
            disableClose: true,
            width: '500px',
          });
        }, 300)
        this.router.navigateByUrl('activities/myactivities');
        sessionStorage.removeItem('CreateActivityGroup');
        break;
      }
      case 'Campaign': {
        this.router.navigateByUrl(sessionStorageObject.route);
        sessionStorage.removeItem('CreateActivityGroup');
        break;
      }
      case 'Add meeting': {
        this.router.navigateByUrl(sessionStorageObject.route);
        // sessionStorage.removeItem('CreateActivityGroup');
        break;
      }
      case 'Edit activity': {
        this.router.navigateByUrl(sessionStorageObject.route);
        // sessionStorage.removeItem('CreateActivityGroup');
        break;
      }
      case 'Create contact enrich': {
        this.router.navigateByUrl(sessionStorageObject.route);
        sessionStorage.removeItem('CreateActivityGroup');
        break;
      }
      case 'Create contact abridge': {
        this.router.navigateByUrl(sessionStorageObject.route);
        sessionStorage.removeItem('CreateActivityGroup');
        break;
      }
      case 'Create lead': {
        this.router.navigateByUrl(sessionStorageObject.route);
        sessionStorage.removeItem('CreateActivityGroup');
        break;
      }
      case 'Account': {
        this.router.navigateByUrl(sessionStorageObject.route);
        sessionStorage.removeItem('CreateActivityGroup');
        return
      }
    }
  }
}
@Component({
  selector: 'app-cancel-pop',
  templateUrl: './cancel-prospect.html',
  styleUrls: ['./generic.prospect.account.scss'],
})
export class cancelprospectComponent {
  constructor(public router: Router, public service: DataCommunicationService, public dialog: MatDialogRef<cancelprospectComponent>) { }
  navTo(event) {
    this.dialog.close(event);
  }

}