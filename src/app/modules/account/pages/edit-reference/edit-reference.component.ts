import { Component, OnInit, Inject, OnDestroy, HostListener } from '@angular/core';
import { AccountService, AccountNameListAdvnHeaders, AccountAdvnNames } from '@app/core/services/account.service';
import { DataCommunicationService } from '@app/core';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';
import { AccountListService } from '@app/core/services/accountList.service';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
@Component({
  selector: 'app-edit-reference',
  templateUrl: './edit-reference.component.html',
  styleUrls: ['./edit-reference.component.scss']
})
export class EditReferenceComponent implements OnInit {
  SysGuidid: any;
  refDetails: any;
  isEditPermission: boolean = false;
  editFormsubmitted: boolean = false;
  contact1NameSwitch: boolean = false;
  contactNameSwitch2: boolean = false;
  OwnerName;
  arrowkeyLocation = 0;
  isLoading: boolean = false;
  lookupdata = {
    tabledata: [],
    recordCount: 10,
    headerdata: [],
    Isadvancesearchtabs: false,
    controlName: '',
    lookupName: '',
    isCheckboxRequired: false,
    inputValue: '',
    pageNo: 1,
    nextLink: '',
    TotalRecordCount: 0,
    selectedRecord: [],
    isLoader: false,
    Guid: '',
    casesensitive: true

  };
  IsModuleSwitch: boolean;
  showFirstForm: boolean;
  constructor(   private EncrDecr: EncrDecrService,public searchaccount: AccountService, public userdat: DataCommunicationService, public location: Location, private _fb: FormBuilder,
    private masterService: S3MasterApiService, public accountListServ: AccountListService, public router: Router,
    private route: ActivatedRoute, public accservive: DataCommunicationService, private snackBar: MatSnackBar, public dialog: MatDialog) {
    // if (route && route.snapshot && route.snapshot.params && route.snapshot.params.id) {
    //   this.SysGuidid = route.snapshot.params.id;
    // } else {
    //   this.SysGuidid = '';
    // }

    let paramsObj = this.accountListServ.getSession('routeParamsRef');
    // console.log(paramsObj);
    if (paramsObj && paramsObj['Id']) {
      this.SysGuidid = paramsObj['Id'];
      // localStorage.setItem('accountSysId', this.EncrDecr.set('EncryptionEncryptionEncryptionEn', this.SysGuidid, 'DecryptionDecrip'))
      // 
    }
    if (paramsObj && paramsObj['isEditPermission']) {
      console.log("casadasdasdadadasdadas", paramsObj['isEditPermission']);
      this.isEditPermission = paramsObj['isEditPermission'];
      // localStorage.setItem('accountSysId', this.EncrDecr.set('EncryptionEncryptionEncryptionEn', this.SysGuidid, 'DecryptionDecrip'))
      // 
    }
    
    // else {
    //   // this.SysGuidid = this.accountListService.getSession('accountid');
    //   // this.SysGuidid = localStorage.getItem('accountSysId');
    // }

  }

  isActivityGroupSearchLoading: boolean = false;
  editRefDropdownList: any = {
    "Vertical": [],
    "Region": [],
    "Geo": [],
  }
  editRefObj: any = {
    SysGuid: "",
    'Owner': {},
    'secondaryowner' : {},
    'SBU': {},
    'Vertical': {},
    'SubVertical': {},
    'Address': {
      'Geo': {},
      'Region': {},
    },
    IsPrimary: false,
    Status: {},
    RANumber: "NA",
    CustomerBusinessUnit: [],
    AttributeComment: [],
    MapGuid: ""
  }
  filterCheckBox: any = [];
  totalCBUs: any = [];
  valSelected = [];
  comment: any;
  comment1: any;
  comment2: any;
  comment3: any;
  comment4: any
  editable: any = [
    { GrowthPositionSubmitted: false, GrowthPositionInAccountClicked: false, attrName: "vertical_name", RequestHistoryComments: [] },
    { GrowthPositionSubmitted: false, GrowthPositionInAccountClicked: false, attrName: "subvertical_name", RequestHistoryComments: [] },
    { GrowthPositionSubmitted: false, GrowthPositionInAccountClicked: false, attrName: "trendsnanalysis_noofcbu", RequestHistoryComments: [] },
    { GrowthPositionSubmitted: false, GrowthPositionInAccountClicked: false, attrName: "geo_name", RequestHistoryComments: [] },
    { GrowthPositionSubmitted: false, GrowthPositionInAccountClicked: false, attrName: "address_region_name", RequestHistoryComments: [] }
  ]
  sub_and_vertical: any = [];
  subverticalExists: boolean;
  clickmes = false;
  subVerticals: any = [];
  location_temp: any = [];
  regions: any = [];
  printAsterisk: boolean = true;
  editRefForm: FormGroup;
  ngOnInit() {
    this.editRefForm = this._fb.group({
      Vertical: ['', Validators.required],
      SubVertical: ['', Validators.required],
      Geo: ['', Validators.required],
      Region: ['', Validators.required],
      secondaryOwner: [''],
      // Cbu: ['', Validators.required],
      comment: [''],
      comment1: [''],
      comment2: [''],
      comment3: [''],
      comment4: ['']
    });
    this.getReferenceDetails();    
  }
  /******************Geo autocomplete code start ****************** */
  contactGeo: string;
  linkedGeoSwitch: boolean;
  AccountAttribute: any = [];
  AttributeComment: any = [];

  appendCBU(values) {
    let filteredCBUs: any = [];
    this.editRefObj.CustomerBusinessUnit = [];
    values.map((data) => {
      this.totalCBUs.map((ele) => {
        if (data.name == ele.Name) {
          filteredCBUs.push(ele);
        }
      })

    });
    console.log("this is filteredCBUs", filteredCBUs);
    if (filteredCBUs.length != 0) {
      filteredCBUs.map((data) => {
        this.editRefObj.CustomerBusinessUnit.push({ 'SysGuid': data.SysGuid, 'MapGuid': data.MapGuid ? data.MapGuid : "", 'name': data.Name, 'LinkActionType': data.LinkActionType == 2 ? 2 : 1 });
      })
    }
    console.log("this is assignmentObj[cbu]", this.editRefObj.CustomerBusinessUnit);
  }

  savecomments(eve, attr, data) {
    console.log(attr, data);
    let ind1 = this.AccountAttribute.findIndex(acc => acc.AttributeName == data);
    let attr_id;
    if (ind1 != -1) {
      attr_id = this.AccountAttribute[ind1].AttributeGuid;
      let ind = this.AttributeComment.findIndex(atr => atr.Guid == attr_id);
      console.log(ind);

      if (ind != -1)
        this.AttributeComment[ind]['Comments'] = attr;
      else
        this.AttributeComment.push({ 'Guid': attr_id, 'Comments': attr });
      console.log(this.AttributeComment);

      this.editRefObj.AttributeComment = [...this.AttributeComment];
    }
  }
  getReferenceDetails() {
    if(!this.isEditPermission){
       this.editAssignRefForm['secondaryOwner'].disable();
    }
    this.accountListServ.detailsAssignmentRef(this.SysGuidid).subscribe((res) => {
      if (!res.IsError) {
        this.refDetails = res.ResponseObject;
        if (res["ResponseObject"].SecondaryOwnerList.length > 0) {
          this.selectedOwner = this.getFilterOwnerData(res["ResponseObject"].SecondaryOwnerList);
          this.valSelected = res["ResponseObject"].SecondaryOwnerList;
        }
        this.editRefObj = {
          SysGuid: res["ResponseObject"].SysGuid,
          MapGuid: res["ResponseObject"].MapGuid,
          accountName: res["ResponseObject"].Name,
          accountNumber: res["ResponseObject"].Number,
          RANumber: res["ResponseObject"].RANumber,
          'secondaryowner' : res["ResponseObject"].Owner,
          'Owner': res["ResponseObject"].Owner,//{ 'Id': (res["ResponseObject"]['Owner'] && res["ResponseObject"]['Owner'].SysGuid) ? res["ResponseObject"]['Owner'].SysGuid : '', 'Name': (res["ResponseObject"]['Owner'] && res["ResponseObject"]['Owner'].FullName) ? res["ResponseObject"]['Owner'].FullName : '' },
          'SBU': res["ResponseObject"].SBU,//{ 'Id': (res["ResponseObject"]['SBU'] && res["ResponseObject"]['SBU'].Id) ? res["ResponseObject"]['SBU'].Id : '', 'Name': (res["ResponseObject"]['SBU'] && res["ResponseObject"]['SBU'].Name) ? res["ResponseObject"]['SBU'].Name : '' },
          'Vertical': { 'Id': (res["ResponseObject"]['Vertical'] && res["ResponseObject"]['Vertical'].Id) ? res["ResponseObject"]['Vertical'].Id : '', 'Name': (res["ResponseObject"]['Vertical'] && res["ResponseObject"]['Vertical'].Name) ? res["ResponseObject"]['Vertical'].Name : '' },
          'SubVertical': { 'Id': (res["ResponseObject"]['SubVertical'] && res["ResponseObject"]['SubVertical'].Id) ? res["ResponseObject"]['SubVertical'].Id : '', 'Name': (res["ResponseObject"]['SubVertical'] && res["ResponseObject"]['SubVertical'].Name) ? res["ResponseObject"]['SubVertical'].Name : '' },
          'Status': res["ResponseObject"].Status,
          IsPrimary: res["ResponseObject"].IsPrimary,
          Address: {
            'Geo': { 'SysGuid': (res["ResponseObject"]['Geo'] && res["ResponseObject"]['Geo'].SysGuid) ? res["ResponseObject"]['Geo'].SysGuid : '', 'Name': (res["ResponseObject"]['Geo'] && res["ResponseObject"]['Geo'].Name) ? res["ResponseObject"]['Geo'].Name : '' },
            'Region': { 'SysGuid': (res["ResponseObject"]['Region'] && res["ResponseObject"]['Region']['SysGuid']) ? res["ResponseObject"]['Region'].SysGuid : '', 'Name': (res["ResponseObject"]['Region'] && res["ResponseObject"]['Region'].Name) ? res["ResponseObject"]['Region'].Name : '' },
          },
          AttributeComment: []
        }
        this.AccountAttribute = res.ResponseObject.AccountAttribute;
        if (this.AccountAttribute.length > 0) {
          this.AccountAttribute.forEach((attrData) => {
            // let ind = this.editable.findIndex(attr=> attr.attrName == attrData.AttributeName);
            this.editable.map((attr, i) => {
              if (attr.attrName == attrData.AttributeName) {
                if (attrData.RequestHistoryComments) {
                  this.editable[i].RequestHistoryComments = attrData.RequestHistoryComments;
                } else {
                  this.editable[i].RequestHistoryComments = [];
                }
              }

            });

          })
        }
        console.log(this.AccountAttribute);
        if (res["ResponseObject"]['CustomerBusinessUnit'].length != 0) {
          return res["ResponseObject"]['CustomerBusinessUnit'].map((data, i) => {
            this.filterCheckBox.push({ 'idChecked': (data.LinkActionType == 2) ? true : false, 'name': data.Name, 'LinkActionType': data.LinkActionType });
            this.totalCBUs.push(data);
            // if(data.LinkActionType==2){
            //   this.editRefObj.CustomerBusinessUnit.push({ 'SysGuid': data.SysGuid,'MapGuid': data.MapGuid ? data.MapGuid:"", 'name': data.Name, 'LinkActionType': data.LinkActionType });
            // }
            console.log("these are total cbus", this.totalCBUs);
            //console.log("these are total cbus", this.totalCBUs);   
          })
        }
        else {
          this.filterCheckBox['msg'] = 'No Record Found';
          // this.assignmentObj['CBU'] = [];
          // console.log("this is cbu when no data", this.assignmentObj['CBU'])
        }

      }
    })
  }
  // vertical  by passing sbuid
  VerticalandSBU(val) {
    this.editRefDropdownList.Vertical = [];
    this.isActivityGroupSearchLoading = true;
    this.editRefObj['SubVertical'] = {};

    // if (!this.accservive.searchFieldValidator(val)) {
    //   this.isActivityGroupSearchLoading = false;
    //   this.editRefObj['Vertical'] = {};
    // }
    // else {
    this.sub_and_vertical = [];
    let vertical;
    this.editRefDropdownList.Vertical = [];
    // if (val && val.length > 0) {
    if (this.editRefObj['SBU'].Id && this.accservive.searchFieldValidator(this.editRefObj['SBU'].Id))
      vertical = this.masterService.getVerticalbySBUID(this.editRefObj['SBU'].Id, val)
    else
      vertical = this.masterService.SearchVerticalAndSBU(val);

    vertical.subscribe((res: any) => {
      this.isActivityGroupSearchLoading = false;
      console.log("verticalby sbuid ", res.ResponseObject);
      if (!res.IsError && res.ResponseObject) {
        if (this.editRefObj['SBU'].Id && this.accservive.searchFieldValidator(this.editRefObj['SBU'].Id)) {
          this.editRefDropdownList.Vertical = res.ResponseObject;
        } else {
          this.sub_and_vertical = res.ResponseObject;
          // this.OwnDetailsForm.controls['sbu'].setValue('');
          this.editRefDropdownList.Vertical = [];
          // this.subverticaldata = res.ResponseObject.filter(res=> res.SubVertical);
          res.ResponseObject.map(data => {
            this.editRefDropdownList.Vertical.push(data.Vertical);
          });
          console.log(this.editRefDropdownList.Vertical);
        }

        if (res.ResponseObject.length == 0) {
          this.editRefObj['Vertical'] = {};
          this.editRefDropdownList.Vertical = [];
          this.editRefDropdownList.Vertical['message'] = 'No record found';
        }
      }
      else {
        this.editRefObj['Vertical'] = {};
        this.editRefDropdownList.Vertical = [];
        this.editRefDropdownList.Vertical['message'] = 'No record found';
      }
    }, error => {
      this.isActivityGroupSearchLoading = false;
      this.editRefDropdownList.Vertical = [];
    })
    // }

  }
  //SubVertical AND VERTICAL API SAME
  SubVerticalByVertical(val) {
    let subvertical;
    this.editRefDropdownList.SubVertical = [];
    this.sub_and_vertical = [];

    if (this.editRefObj.Vertical.Id) {
      // if (!this.accservive.searchFieldValidator(val)) {
      //   this.isActivityGroupSearchLoading = false;
      //   this.editRefObj['SubVertical'] = {};
      // }
      // else {
      this.isActivityGroupSearchLoading = true;
      if (this.accservive.searchFieldValidator(this.editRefObj['Vertical'].Id))
        subvertical = this.masterService.getSubVerticalByVertical(this.editRefObj['Vertical'].Id, val);
      else
        subvertical = this.masterService.SearchAllBySubVertical(val);
      subvertical.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        console.log("response for subvertical", res.ResponseObject);
        if (!res.IsError && res.ResponseObject) {
          if (this.accservive.searchFieldValidator(this.editRefObj['Vertical'].Id)) {
            this.editRefDropdownList.SubVertical = res.ResponseObject;
            this.subverticalExists = true;
          }
          else {
            this.sub_and_vertical = res.ResponseObject;
            this.editRefObj['Vertical'] = {};
            // this.accountCreationObj['vertical'] = '';
            // this.OwnDetailsForm.controls['sbu'].setValue('');
            // this.OwnDetailsForm.controls['vertical'].setValue('');
            // this.subverticaldata = [];
            // this.subverticaldata = res.ResponseObject.filter(res=> res.SubVertical);
            this.editRefDropdownList.SubVertical = [];
            res.ResponseObject.map(data => {
              this.editRefDropdownList.SubVertical.push(data.SubVertical);
              this.subverticalExists = true;
            });
            console.log(this.editRefDropdownList.SubVertical);
          }
          if (res.ResponseObject.length == 0) {
            this.editRefObj['SubVertical'] = {};
            this.editRefDropdownList.SubVertical = [];
            this.subverticalExists = false;
            this.editRefDropdownList.SubVertical['message'] = 'No record found';
          }
        }
        else {
          this.editRefObj['SubVertical'] = {};
          this.editRefDropdownList.SubVertical = [];
          this.subverticalExists = false;
          this.editRefDropdownList.SubVertical['message'] = 'No record found';
        }
      }, error => {
        this.isActivityGroupSearchLoading = false;
        this.editRefDropdownList.SubVertical = [];
        this.subverticalExists = false;
        this.editRefDropdownList.SubVertical['message'] = 'No record found';
      })
      // }
    }
    else {
      this.subVerticals = [];
      subvertical = this.masterService.getSubVerticalByVertical(this.editRefObj['Vertical'].Id, '').subscribe((res: any) => {
        console.log("response from get subverticalbyvertical ", res);
        if (res.ResponseObject.length != 0) {
          res.ResponseObject.map(data => {
            this.subVerticals.push(data);
            this.subverticalExists = true;
          });
          if (res.ResponseObject.length == 1) {
            this.subverticalExists = true;
            console.log("dshagdv", this.subVerticals);
            this.editRefObj['SubVertical']['Id'] = res.ResponseObject[0].Id;
            this.editRefObj['SubVertical']['Name'] = res.ResponseObject[0].Name
            console.log("avsgf", this.editRefObj['SubVertical']);
          }
        }
        else {
          this.subVerticals = [];
          // this.subverticalExists=false;
          // this.subVerticals['msg'] = 'No record found';         
          // console.log("this is message when response object is empty", this.subVerticals['msg'])
        }
      }, error => {
        console.log("some error occured");
      });

    }

  }
  GetGeographyByName(val) {
    this.editRefDropdownList.Geo = [];
    let orginalArray;
    let temp = ['Geo', 'Region'];
    // if (!this.accservive.searchFieldValidator(val)) {
    //   this.isActivityGroupSearchLoading = false;
    //   this.clearFormData(this.editRefObj, temp, true);
    // }
    // else {
    this.isActivityGroupSearchLoading = true;
    this.clearFormData(this.editRefObj, temp, false);

    orginalArray = this.masterService.getgeobyname(val);

    orginalArray.subscribe((res: any) => {
      this.isActivityGroupSearchLoading = false;
      if (!res.IsError && res.ResponseObject) {
        this.editRefDropdownList.Geo = res.ResponseObject;
        if (res.ResponseObject.length == 0) {
          this.editRefObj['Geo'] = {};
          this.editRefDropdownList.Geo = [];
          this.editRefDropdownList.Geo['message'] = 'No record found';
        }
      }
      else {
        this.editRefObj['Geo'] = {};
        this.editRefDropdownList.Geo = [];
        this.editRefDropdownList.Geo['message'] = 'No record found';
      }
    }, error => {
      this.isActivityGroupSearchLoading = false;
      this.editRefDropdownList.Geo = [];
      this.editRefDropdownList.Geo['message'] = 'No record found';
    })
    // }
  }

  //Region
  RegionByGeo(val) {
    let region;
    this.editRefDropdownList.Region = [];
    this.location_temp = [];
    // console.log("region by geo", event);
    // if (val && val.length > 0) {
    //   if (this.editRefObj['Geo'].Id != '' && this.editRefObj['Geo'].Id != undefined && this.editRefObj['Geo'].Id != null)
    let temp = ['Region'];
    if (this.editRefObj.Address.Geo.SysGuid) {
      // if (!this.accservive.searchFieldValidator(val)) {
      //   this.isActivityGroupSearchLoading = false;
      //   this.clearFormData(this.editRefObj, temp, true);
      // }
      // else {
      this.isActivityGroupSearchLoading = true;
      this.clearFormData(this.editRefObj, temp, false);
      if (this.accservive.searchFieldValidator(this.editRefObj['Address']['Geo'].SysGuid))
        region = this.masterService.getregionbygeo(this.editRefObj['Address']['Geo'].SysGuid, val);
      else
        region = this.masterService.GetAllByRegion(val);

      region.subscribe((res: any) => {
        this.isActivityGroupSearchLoading = false;
        console.log("geobyreagion response", res.ResponseObject);
        if (!res.IsError && res.ResponseObject) {
          if (this.accservive.searchFieldValidator(this.editRefObj['Address']['Geo'].SysGuid)) {
            this.editRefDropdownList.Region = res.ResponseObject;
          }
          else {
            let formField1 = ['Geo'];
            this.clearFormData(this.editRefObj, formField1, true);
            this.location_temp = res.ResponseObject;
            this.editRefDropdownList.Region = [];
            res.ResponseObject.map(data => {
              this.editRefDropdownList.Region.push(data.Region);
            });
          }

          if (res.ResponseObject.length == 0) {
            this.editRefObj['Region'] = {};
            this.editRefDropdownList.Region = [];
            this.editRefDropdownList.Region['message'] = 'No record found';
          }
        }
        else {
          this.editRefObj['Region'] = {};
          this.editRefDropdownList.Region = [];
          this.editRefDropdownList.Region['message'] = 'No record found';
        }
      }, error => {
        this.isActivityGroupSearchLoading = false;
        this.editRefDropdownList.Region = [];
        this.editRefDropdownList.Region['message'] = 'No record found';
      })
      // }
    }
    else {
      this.regions = [];
      region = this.masterService.getregionbygeo(this.editRefObj['Address']['Geo'].SysGuid, '').subscribe((res: any) => {
        console.log("response from get regionbygeo ", res);
        if (res.ResponseObject.length != 0) {
          res.ResponseObject.map(data => {
            this.regions.push(data);
          });
        }
        else {
          this.regions = [];
          this.regions['msg'] = 'No record found';
          console.log("this is message when response object is empty", this.regions['msg'])
        }
      }, error => {
        console.log("some error occured");
      });
    }
  }
  clearFormData(postObj: any, emptyableObj, clearAll) {
    // clear post object
    emptyableObj.forEach((element: any, index) => {
      if (index == 0 && !clearAll)
        postObj['Address'][element]['SysGuid'] = '';
      else
        postObj['Address'][element] = {};
    });
  }
  appendVertical(data: any, i) {
    console.log(data, this.sub_and_vertical[i]);
    // this.contact1Name = data["Name"];
    this.editRefObj['Vertical']['Id'] = data['Id'] || '';
    this.editRefObj['Vertical']['Name'] = data["Name"] || '';

    // if (this.accservive.validateKeyInObj(this.sub_and_vertical, [i, 'SBU', 'Id'])) this.editRefObj['SBU']['Id'] = this.sub_and_vertical[i]['SBU']['Id'];
    // if (this.accservive.validateKeyInObj(this.sub_and_vertical, [i, 'SBU', 'Name'])) this.editRefObj['SBU']['Name'] = this.sub_and_vertical[i]['SBU']['Name'];

    //   this.accountCreationObj['sbu'] = this.sub_and_vertical[ind]['SBU']['Id'] || '';
    // this.OwnDetailsForm.controls['sbu'].setValue(this.sub_and_vertical[ind]['SBU']['Name']);
  }
  appendSubvertical(data: any, i) {
    console.log("these are subverticals", this.subVerticals)
    // this.contactName2 = data["Name"];
    console.log(data, this.sub_and_vertical[i]);
    let id;
    console.log("subverticals", data);
    if (i == -1) {
      // this.contactName3 = data["Name"];
      id = this.subVerticals.filter((ele) => {
        return ele.Name == data["Name"]
      })
      this.editRefObj['SubVertical']['Id'] = id[0].SysGuid || '';
      this.editRefObj['SubVertical']['Name'] = data["Name"] || '';
    }
    else {
      this.editRefObj['SubVertical']['Id'] = data['Id'] || '';
      this.editRefObj['SubVertical']['Name'] = data["Name"] || '';
    }
    // if (this.accservive.validateKeyInObj(this.sub_and_vertical, [i, 'SBU', 'Id'])) this.editRefObj['SBU']['Id'] = this.sub_and_vertical[i]['SBU']['Id'];
    // if (this.accservive.validateKeyInObj(this.sub_and_vertical, [i, 'SBU', 'Name'])) this.editRefObj['SBU']['Name'] = this.sub_and_vertical[i]['SBU']['Name'];

    if (this.accservive.validateKeyInObj(this.sub_and_vertical, [i, 'Vertical', 'Id'])) this.editRefObj['Vertical']['Id'] = this.sub_and_vertical[i]['Vertical']['Id'];
    if (this.accservive.validateKeyInObj(this.sub_and_vertical, [i, 'Vertical', 'Name'])) this.editRefObj['Vertical']['Name'] = this.sub_and_vertical[i]['Vertical']['Name'];
  }
  //CBU
  // appendcontactSearchCBU(data: any, i) {
  //   // this.contactNamecbu = data["Name"];
  //   this.clickChangeValue = false;
  //   this.editRefObj['CBU']['Id'] = data['SysGuid'] || '';
  //   this.editRefObj['CBU']['Name'] = data["Name"] || '';

  // }
  //GEO
  appendGeo(data: any, i) {
    // this.contactName22 = data["Name"];
    // if (i == -999) {
    //   this.editRefObj['Geo']['Id'] = data['Id'] || '';
    //   this.editRefObj['Geo']['Name'] = data["Name"] || '';
    // } else {
    this.editRefObj['Address']['Geo']['SysGuid'] = data['SysGuid'] || '';
    this.editRefObj['Address']['Geo']['Name'] = data["Name"] || '';
    // }
  }
  //Region
  appendRegionByGeo(data: any, i) {
    let id;
    console.log("jdhcsjhabcjhsdbcbj", data);
    if (i == -1) {
      // this.contactName3 = data["Name"];
      id = this.regions.filter((ele) => {
        return ele.Name == data["Name"]
      })
      this.editRefObj['Address']['Region']['SysGuid'] = id[0].SysGuid || '';
      this.editRefObj['Address']['Region']['Name'] = data["Name"] || '';
    }
    else {
      // this.contactName3 = data["Name"];
      this.editRefObj['Address']['Region']['SysGuid'] = data['SysGuid'] || '';
      this.editRefObj['Address']['Region']['Name'] = data["Name"] || '';
    }
    if (this.accservive.validateKeyInObj(this.location_temp, [i, 'Geo', 'SysGuid'])) this.editRefObj['Address']['Geo']['SysGuid'] = this.location_temp[i]['Geo'].SysGuid;
    if (this.accservive.validateKeyInObj(this.location_temp, [i, 'Geo', 'Name'])) this.editRefObj['Address']['Geo']['Name'] = this.location_temp[i]['Geo'].Name;

  }
  linkedGeoClose() {
    this.linkedGeoSwitch = false;
  }
  // appendGeo(value: string, i) {

  //   this.contactGeo = value;
  //   this.selectedGeo.push(this.GeoContact[i])
  // }
  get editAssignRefForm() { return this.editRefForm.controls; }
  saveAssignRef() {
    this.accountListServ.editAssignmentRef(this.editRefObj).subscribe((res) => {
      if (!res.IsError) {
        this.snackBar.open(res.Message, '', {
          duration: 3000
        });
        // this.location.back();
      } else {
        this.snackBar.open(res.Message, '', {
          duration: 5000
        });
      }
    })
  }
  GeoContact: {}[] = [

    { index: 0, contact: 'Ringo oppurtunity name 1', designation: 'OPP000141510 | Ringo steel', initials: 'SO', value: true },
    { index: 1, contact: 'Ringo oppurtunity name 2', designation: 'OPP000141510 | Ringo steel', initials: 'SO', value: false }
  ]

  selectedGeo: {}[] = [];

  /****************** Geo autocomplete code end ****************** */
  /******************Region autocomplete code start ****************** */

  contactRegion: string;

  linkedRegionSwitch: boolean;

  linkedRegionClose() {
    this.linkedRegionSwitch = false;
  }
  appendRegion(value: string, i) {

    this.contactRegion = value;
    this.selectedRegion.push(this.RegionContact[i])
  }

  RegionContact: {}[] = [

    { index: 0, contact: 'Ringo oppurtunity name 1', designation: 'OPP000141510 | Ringo steel', initials: 'SO', value: true },
    { index: 1, contact: 'Ringo oppurtunity name 2', designation: 'OPP000141510 | Ringo steel', initials: 'SO', value: false }
  ]

  selectedRegion: {}[] = [];

  /****************** Region autocomplete code end ****************** */
  /******************Secondary account owner autocomplete code start ****************** */

  contactName2: string;
  contactNameSwitch: boolean;
  selectedOwner = [];

  wiproContact2 = [];
  // : {index:number,contact:string,designation:string,initials:string,value:boolean}[]= [

  //   { index: 0, contact: 'Sub Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },
  //   { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  //   { index: 2, contact: 'Anubhav Jain Anubhav Jain Anubhav Jain Anubhav Jain Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
  //   { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  // ];
  appendOwner(item, i?) {
    this.selectedOwner = this.selectedOwner === undefined ? [] : this.selectedOwner
    this.selectedOwner.push(item);
    item.LinkActionType = 1;
    this.valSelected.push(item);
    this.contactNameSwitch = false;
    this.addSecondOwner();
  }
  addSecondOwner() {
    this.isLoading = true;
    let payload = {
      "SysGuid": this.editRefObj.SysGuid,
      "MapGuid": this.editRefObj.MapGuid,
      "Name": this.editRefObj.accountName,
      "SecondaryOwnerList": this.valSelected
      // [ 
      //     { 
      //       "SysGuid":"07167f25-4c5f-e911-a830-000d3aa058cb",
      //       "LinkActionType":1
      //     },
      //     { 
      //       "SysGuid":"07167f25-4c5f-e911-a830-000d3aa058cb",
      //       "MapGuid":"c084c914-d415-ea11-a83c-000d3aa058cb",
      //       "LinkActionType":3
      //     }
      // ]
    }
    this.accountListServ.addsecondAccountOwnerData(payload).subscribe((resp) => {
      console.log("add for secondary", resp);
      if (!resp.IsError) {
        this.isLoading = false;
        if(resp.Message){
          this.snackBar.open(resp.Message,'', {
            duration: 3000
          })
        }
        this.valSelected = resp.ResponseObject.SecondaryOwnerList;
        this.selectedOwner = this.getFilterOwnerData(resp.ResponseObject.SecondaryOwnerList)         
      }
    })
  }


  adjustHeight() {
    //  this.selectedOwner.length <= 1 ? "return 'mb-180'": this.selectedOwner.length == 2 ? "return 'mb-150'": this.selectedOwner.length == 3 ? "return 'mb-10'":""
    if (this.contactNameSwitch && this.selectedOwner) {
      switch (this.selectedOwner.length) {
        case 0:
          return 'mb-186'

        case 1:
          return 'mb-110'

        case 2:
          return 'mb-55'

        default:
          return ''
      }
    }
  }

  contactNameclose2() {
    this.contactNameSwitch2 = false;
  }

  removeOwner(item, i) {
    this.selectedOwner = this.selectedOwner.filter((ownerId) => ownerId.SysGuid !== item.SysGuid);
    // this.selectedOwner.splice(i, 1);
    this.valSelected[i].LinkActionType = 3;
    this.addSecondOwner();
    this.valSelected.splice(i, 1);
  }

  /****************** Secondary account owner autocomplete code end ****************** */
  goBack() {
    const  url = '/accounts/accountdetails';
    this.accountListServ.goBack(url);
localStorage.setItem('navCountData', this.EncrDecr.set('EncryptionEncryptionEncryptionEn', 2, 'DecryptionDecrip'))
    // localStorage.setItem('  this.showCustomer();', this.EncrDecr.set('EncryptionEncryptionEncryptionEn', 2, 'DecryptionDecrip'))

    // this.router.navigate(['/accounts/accountdetails']);
    // this.location.back();
  }

  toggleComment() {
    this.clickmes = !this.clickmes;
    console.log(this.clickmes);
  }

  // editable = false; // commenting it due to "Duplicate identifier 'editable'" error while giving build"
  editable1 = false;
  // expand(i) { // commenting it due to "Duplicate identifier 'editable'" error while giving build"
  //   if (i == 0) {

  //     this.editable = false;
  //   }
  //   else if (i == 1) {

  //     this.editable1 = false;
  //   }
  // }
  // Save reference popup starts
  Opensavereference() {
    if (!this.editRefForm.invalid && (this.editRefObj.CustomerBusinessUnit ? this.editRefObj.CustomerBusinessUnit.length != 0 : false)) {
      this.editFormsubmitted = false;
      const dialogRef = this.dialog.open(Opensavereference, {
        disableClose: true,
        width: '380px',
        data: {
          'name': this.refDetails.RANumber
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == "save") {
          this.saveAssignRef();
        }
      })
    } else {
      this.editFormsubmitted = true;
    }
    // Save reference popup ends
  }
  remove_duplicates_Accounts(b, a) {
      for (let j = 0; j < b.length; j++) {
        for (let i = 0; i < a.length; i++) {
        if (b[j].SysGuid == a[i].SysGuid) {
          a.splice(i, 1);
          // break;
        }
      }
    }
    return a;
  }
  accountOwnerSearch(data) {
    this.isActivityGroupSearchLoading = true;
    let payload = { "SearchText": data ? data : '', "PageSize": 10, "RequestedPageNumber": 1, "OdatanextLink": "" }
    this.wiproContact2 = [];
    let res2;
    let ownerList = [];
    // this.selectedOwner = (this.selectedOwner === undefined ? [] : this.selectedOwner);
    this.accountListServ.getSsecondAccountOwnerData(payload).subscribe((res) => {
      this.lookupdata.TotalRecordCount = res.TotalRecordCount;
      this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
      this.isActivityGroupSearchLoading = false;
      if (!res.IsError && res.ResponseObject) {
          res2 = Object.assign({}, ...res);
          res.ResponseObject.filter(listitem => {
            // console.log("owner name",this.editRefObj['Owner'])
            if (listitem.FullName != this.editRefObj['Owner']['FullName']) {
              ownerList.push(listitem);
            };
          });
          res2.ResponseObject = ownerList;
          console.log(res2);
      }
        if(!res2.IsError && res2.ResponseObject){
        if (this.selectedOwner && res2.ResponseObject.length > 0) {
          const accountName = this.remove_duplicates_Accounts(this.selectedOwner, res2.ResponseObject);
          if (this.selectedOwner.length > 0){
            this.wiproContact2 = this.getFilterOwnerData(this.remove_duplicates_Accounts(this.selectedOwner, accountName));
            if(!this.wiproContact2){
              this.wiproContact2 = [];
            }
          }
          
          if (this.selectedOwner.length === 0)
            this.wiproContact2 = this.getFilterOwnerData(accountName);
        } else {
          if (this.selectedOwner) {
            this.wiproContact2 = this.getFilterOwnerData(this.remove_duplicates_Accounts(this.selectedOwner, res2.ResponseObject));
            if(!this.wiproContact2){
              this.wiproContact2 = [];
            }
          } else {
            this.wiproContact2 = this.getFilterOwnerData(res2.ResponseObject);
            if(!this.wiproContact2){
              this.wiproContact2 = [];
            }
          }
        }
      }

    })
  }
  getFilterOwnerData(res) {
    if (res.length != 0) {
      return res.map((data) => {
        let initials = data.FullName.split(" ");
        return {
          initials: initials.length == 1 ? initials[0].charAt(0) : initials[0].charAt(0) + initials[1].charAt(0),
          Name: data.FullName,
          SysGuid: data.SysGuid,
          MapGuid: data.MapGuid ? data.MapGuid : "",
          designation: data.Designation
        }
      })
    }
  }
  openadvancetabs(controlName, initalLookupData, value, index?, headerdata?, line?): void {
    // debugger
    // AccountAdvnNames,AccountNameListAdvnHeaders
    if (!value) {
      // this.emptyArray(controlName);
      // this.AppendParticularInputFun(result.selectedData, result.controlName);
    }
    this.lookupdata.controlName = controlName;
    this.lookupdata.headerdata = AccountNameListAdvnHeaders[controlName];
    this.lookupdata.lookupName = AccountAdvnNames[controlName]['name'];
    this.lookupdata.isCheckboxRequired = AccountAdvnNames[controlName]['isCheckbox'];
    this.lookupdata.Isadvancesearchtabs = AccountAdvnNames[controlName]['isAccount'];

    this.lookupdata.inputValue = value;
    const Guid = this.editRefObj[controlName] ? this.editRefObj[controlName] : '';
    // this.lookupdata.Guid = this.accountCreationObj[controlName] ?  this.accountCreationObj[controlName]  : '';
    // this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.accountListServ.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null}).subscribe(res => {
      this.lookupdata.tabledata = res;
    });
    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      disableClose: true,
      width: this.accountListServ.setHeaderPixes(this.lookupdata.headerdata.length ? this.lookupdata.headerdata.length : 0, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });
    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
      // console.log(x)
      if (x['objectRowData'].searchKey !== '' && x.currentPage === 1) {
        this.lookupdata.nextLink = '';
      }
      const dialogData = {
        searchVal: (x['objectRowData'].searchKey !== '') ? x['objectRowData'].searchKey : '',
        recordCount: this.lookupdata.recordCount,
        OdatanextLink: this.lookupdata.nextLink,// need to handel the pagination and search!
        pageNo: x.currentPage//need to handel from pagination
      };
      // debugger
      this.accountListServ.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: {  ...dialogData } }).subscribe(res => {
        // debugger
        this.lookupdata.isLoader = false;
        // console.log("resresresresresresresresresresresresresresresresresres", res)
        if (x.action === 'loadMore') {
          // debugger;
          // if (x['objectRowData'].controlName === 'currencyaccount') {
          //   this.lookupdata.TotalRecordCount = res.ResponseObject.length > 0 ? res.TotalRecordCount : 0;
          // } else {
          //   this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          // }

          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          // if (x['objectRowData'].controlName === 'subvertical') {
          //   this.subverticaldata = this.subverticaldata.concat(res.ResponseObject);
          //   this.sub_and_vertical = this.sub_and_vertical.concat(res.ResponseObject);
          // } else if (x['objectRowData'].controlName === 'vertical') {
          //   this.verticaldata = this.verticaldata.concat(res.ResponseObject);
          //   this.sub_and_vertical = this.sub_and_vertical.concat(res.ResponseObject);
          // } {
          //   this.location_temp = this.location_temp.concat(res.ResponseObject);
          // }
        } 
        else if (x.action === 'search') {
          // if (x['objectRowData'].controlName === 'currencyaccount') {
          //   this.lookupdata.TotalRecordCount = res.ResponseObject.length > 0 ? res.TotalRecordCount : 0;
          // } else {
          //   this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          // }
          this.lookupdata.tabledata = res.ResponseObject;
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
          // if (x['objectRowData'].controlName === 'subvertical') {
          //   this.subverticaldata = res.ResponseObject;
          //   this.sub_and_vertical = res.ResponseObject;
          // } else if (x['objectRowData'].controlName === 'vertical') {
          //   this.verticaldata = res.ResponseObject;
          //   this.sub_and_vertical = res.ResponseObject;
          //   // this.verticaldata
          // } else {
          //   this.location_temp = res.ResponseObject;
          // }

        } 
        // else if (x.action === 'tabSwich') {
        //   if (x.objectRowData.wiprodb) {
        //     this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        //     this.lookupdata.tabledata = res.ResponseObject;
        //     this.lookupdata.nextLink = (res.OdatanextLink) ? res.OdatanextLink : '';
        //   }
        // }
      });
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("result------------",result)
        this.AppendParticularInputFun(result.selectedData, result.controlName);
      }
    });
  }
  AppendParticularInputFun(selectedData, controlName) {
    // debugger
    if (selectedData) {
      if (selectedData.length > 0) {
        selectedData.forEach(data => {
          this.IdentifyAppendFunc[controlName](data);
        });
      }
    }
  }

  IdentifyAppendFunc = {
    'secondaryowner': (data) => { this.appendOwner(data) },
  }
}


@Component({
  selector: 'savereference',
  templateUrl: './savereference-popup.component.html',
})
export class Opensavereference {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public accservive: DataCommunicationService, public location: Location, public dialogRef: MatDialogRef<Opensavereference>) { }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  RANumber: any;
  ngOnInit() {
    this.RANumber = this.data.name;
    console.log("ran number", this.data)
  }
  goBack() {
    this.location.back();
  }
  saveRef() {
    this.dialogRef.close("save");
  }

}