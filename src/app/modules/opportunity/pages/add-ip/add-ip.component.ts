import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DataCommunicationService, OpportunitiesService } from '@app/core';
import { NgForm } from '@angular/forms';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { addIpHeaders, addIpNames, AddIpService } from '@app/core/services/add-ip.service';
import { Router } from '@angular/router';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { deleteIP1, deleteserviceLine1 } from '../opportunity-view/tabs/business-solution/business-solution.component';

@Component({
  selector: 'app-add-ip',
  templateUrl: './add-ip.component.html',
  styleUrls: ['./add-ip.component.scss']
})

export class AddIpComponent implements OnInit {
  @ViewChild('myForm') public userFrm: NgForm;
  panelOpenState4: boolean = true;
  wiproip = [];
  ip_data = [];
  wipromodule = [];
  IpandServiceLinelDD = [];
  IpHolmesDD = [];

  opportunityId: string = '';
  opportunityName;
  IpDetails: any = [];
  isLoading: boolean = false;

  // Lookup selector change starts
  IpObj = { name: 'Name', Id: 'SysGuid' };
  ModuleObj = { name: 'Name', Id: 'SysGuid' };
  SLBDMObj = { name: 'Name', Id: 'SysGuid' };
  HolmesBDMObj = { name: 'Name', Id: 'SysGuid' };


  constructor(public dialog: MatDialog, public service: DataCommunicationService,
    public projectService: OpportunitiesService,
    public addIpService: AddIpService, public router: Router, private EncrDecr: EncrDecrService) {

  }

  ngOnInit() {
    this.opportunityId = this.projectService.getSession('opportunityId');
    this.opportunityName = this.projectService.getSession('opportunityName');
    this.getIpandserviceLineData();
    this.getIpDetails(this.opportunityId);
  }

  ngAfterViewChecked() {
    if (this.userFrm.dirty) {
      this.service.dirtyflag = true;
    }
    else {
      this.service.dirtyflag = false;
    }
  }

  // Get all IP data
  getIpDetails(oppId) {
    this.isLoading = true;
    this.projectService.getBusinessSolutions(oppId).subscribe(res => {
      this.isLoading = false;
      if (!res.IsError) {
        let UserId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
        this.IpDetails = res.ResponseObject.WiproAllIPDetails;
        console.log("this.IpDetails", this.IpDetails);
        this.IpDetails.forEach(ip => {
          ip.WiproServicelineName = ip.WiproServicelineName ? ip.WiproServicelineName : '-';
          ip.WiproPracticeName = ip.WiproPracticeName ? ip.WiproPracticeName : '-';
          ip.WiproSlbdmName = ip.WiproSlbdmName ? ip.WiproSlbdmName : '-';
          ip.WiproHolmesbdmName = ip.WiproHolmesbdmName ? ip.WiproHolmesbdmName : '-';
          if (UserId.toLowerCase() == ip.WiproSolutionOwnerId.toLowerCase() || (ip.WiproHolmesbdmID && UserId.toLowerCase() == ip.WiproHolmesbdmID.toLowerCase())) {
            ip.IsDelete = true;
            ip.WiproTaggedamcValue = ip.TaggedamcValue
            ip.WiproTaggedLicenseValue = ip.TaggedLicenseValue
          }
          else {
            ip.IsDelete = false;
            ip.WiproTaggedLicenseValue = ip.WiproLicenseValue;
            ip.WiproTaggedamcValue = ip.WiproAmcvalue;
          }
        })
      }
    },
      err => {
        this.isLoading = false;
      });
  }

  // On select of Holmesbdm 
  appendslbdm3(item, i) {
    this.ip_data[i].holmesbdmArrayForLookup = [];
    this.ip_data[i].HolmesBDMSelected = Object.keys(item).length ? item : { SysGuid: "", Name: "" };
    if (item && typeof item === 'object' && Object.keys(item).length) {
      this.ip_data[i].HolmesBDMSelected.Id = this.ip_data[i].HolmesBDMSelected.SysGuid;
      this.ip_data[i].WiproHolmesbdmName = item.Name;
      this.ip_data[i].WiproHolmesbdmID = item.SysGuid;
      this.ip_data[i].slbdm2NameSwitch = false;
      this.ip_data[i].WiproHolmesbdmNameError = false;
      this.ip_data[i].holmesbdmArrayForLookup.push(item);
    }
    else {
      this.ip_data[i].WiproHolmesbdmName = '';
      this.ip_data[i].WiproHolmesbdmID = '';
    }
  }

  // On select of Slbdm
  appendslbdm2(item, i) {
    this.ip_data[i].slbdmArrayForLookup = [];
    this.ip_data[i].SLBDMSelected = Object.keys(item).length ? item : { SysGuid: "", Name: "" };
    if (item && typeof item === 'object' && Object.keys(item).length) {
      this.ip_data[i].SLBDMSelected.Id = this.ip_data[i].SLBDMSelected.SysGuid;
      this.ip_data[i].WiproSlbdmName = item.Name;
      this.ip_data[i].WiproSlbdmValue = item.SysGuid;
      this.ip_data[i].slbdm2NameSwitch = false;
      this.ip_data[i].slbdmArrayForLookup.push(item);
    }
    else {
      this.ip_data[i].WiproSlbdmName = '';
      this.ip_data[i].WiproSlbdmValue = '';
    }
  }

  // On select of module
  appendmodule(item, i) {
    this.ip_data[i].moduleArrayForLookup = [];
    this.ip_data[i].ModuleSelected = Object.keys(item).length ? item : { SysGuid: "", Name: "" };
    if (item && typeof item === 'object' && Object.keys(item).length) {
      this.ip_data[i].ModuleSelected.Id = this.ip_data[i].ModuleSelected.SysGuid;
      this.ip_data[i].WiproModuleName = item.Name;
      this.ip_data[i].WiproModuleValue = item.SysGuid;
      this.ip_data[i].WiproModuleNameError = false
      this.ip_data[i].moduleNameSwitch = false;
      this.ip_data[i].moduleArrayForLookup.push(item);
    }
    else {
      this.ip_data[i].WiproModuleName = '';
      this.ip_data[i].WiproModuleValue = '';
    }
  }

  // On select of IP
  appendip(item, i) {
    this.ip_data[i].ipArrayForLookup = [];
    this.ip_data[i].IpSelected = Object.keys(item).length ? item : { SysGuid: "", Name: "" };
    this.ip_data[i].holmesbdmArrayForLookup = [];
    this.ip_data[i].HolmesBDMSelected = { SysGuid: "", Name: "" };
    this.ip_data[i].WiproHolmesbdmName = '';
    this.ip_data[i].WiproHolmesbdmID = '';
    this.ip_data[i].WiproHolmesbdmNameError = false;
    // clear module
    this.ip_data[i].moduleArrayForLookup = [];
    this.ip_data[i].ModuleSelected = { SysGuid: "", Name: "" };
    this.ip_data[i].WiproModuleName = '';
    this.ip_data[i].WiproModuleValue = '';
    this.ip_data[i].WiproModuleNameError = false;
    if (item && typeof item === 'object' && Object.keys(item).length) {
      this.ip_data[i].IpSelected.Id = this.ip_data[i].IpSelected.ProductId;
      this.ip_data[i].IpName = item.Name;
      this.ip_data[i].IpId = item.ProductId;
      this.ip_data[i].ipNameError = false
      this.ip_data[i].ipNameSwitch = false;
      this.ip_data[i].OwnerId = item.WiproSoultionOwnerValue;
      this.ip_data[i].ipArrayForLookup.push(item);
      if (item.ProductTypeCode == 4) {
        this.ip_data[i].holmesBDMDisable = false;
        this.getIpHolmesData("", i, 'INITIAL');

      }
      else {
        this.ip_data[i].holmesBDMDisable = true;
      }

      var body = {
        "Guid": this.ip_data[i].IpId,
        "SearchText": '',
        "pagesize": 10,
        "RequestedPageNumber": 1,
        "OdatanextLink": ""
      }
      this.addIpService.getModuleLookupData(body).subscribe(res => {
        if (!res.IsError) {
          if (res.ResponseObject.length > 0) {
            res.ResponseObject.forEach(item => {
              (item.Name) ? item.Name = this.getSymbol(item.Name) : '-';
            })
            this.ip_data[i].moduleDisabled = false;
            if (res.ResponseObject.length == 1) {
              this.appendmodule(res.ResponseObject[0], i);
            }
          }
          else {
            this.ip_data[i].moduleDisabled = true;
            this.appendmodule({}, i);
          }
        }
      });
    }
    else {
      this.ip_data[i].IpName = '';
      this.ip_data[i].IpId = '';
      this.ip_data[i].holmesBDMDisable = true;
      this.ip_data[i].ipNameError = true;
      this.ip_data[i].moduleDisabled = true;
    }
  }

  // Get IP lookup data
  getIpNameData(data) {
    let searchText = data.searchValue ? data.searchValue : '';
    var body = {
      "SearchText": searchText,
      "PageSize": 10,
      "OdatanextLink": "",
      "RequestedPageNumber": 1
    }
    this.lookupdata.TotalRecordCount = 0;
    this.addIpService.getIpProductDetails(body).subscribe(res => {
      if (!res.IsError) {
        this.wiproip = res.ResponseObject;
        this.wiproip.forEach(item => {
          (item.Name) ? item.Name = this.getSymbol(item.Name) : '-';
        })
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        this.lookupdata.nextLink = res.OdatanextLink;
      }
      else {
        this.projectService.displayMessageerror(res.Message);
      }
    },
      err => {
        this.projectService.displayerror(err.status);
      });
  }

  getSymbol(data) {
    data = this.escapeSpecialChars(data);
    return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
  }

  escapeSpecialChars(jsonString) {
    return jsonString.replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t")
      .replace(/\f/g, "\\f");

  }

  // Get module lookup data
  getIpModuleData(data, index) {
    if (this.ip_data[index].IpId) {
      let searchText = data.searchValue ? data.searchValue : '';
      var body = {
        "Guid": this.ip_data[index].IpId,
        "SearchText": searchText,
        "pagesize": 10,
        "RequestedPageNumber": 1,
        "OdatanextLink": ""
      }
      this.lookupdata.TotalRecordCount = 0;
      this.addIpService.getModuleLookupData(body).subscribe(res => {
        if (!res.IsError) {
          this.wipromodule = res.ResponseObject;
          this.wipromodule.forEach(item => {
            (item.Name) ? item.Name = this.getSymbol(item.Name) : '-';
          })
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.nextLink = res.OdatanextLink;
        }
        else {
          this.projectService.displayMessageerror(res.Message);
        }
      },
        err => {
          this.projectService.displayerror(err.status);
        });
    }
  }

  // Get Service line dropdown master data
  getIpandserviceLineData() {
    this.projectService.getServiceLine(this.projectService.getSession('sbuId')).subscribe(res => {
      this.IpandServiceLinelDD = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.IpandServiceLinelDD = this.IpandServiceLinelDD.filter(it => it.IsVisible == true);
    }, err => {
      this.IpandServiceLinelDD = [];
    });
  }

  // Get Practice dropdown data
  getIpPracticeData(data, i) {
    this.ip_data[i].practiceDisabled = false;
    data.IppracticeDD = [];
    data.WiproPractice = '';
    data.WiproSlbdmName = '';
    data.WiproSlbdmValue = '';
    if (data.WiproServiceline != '') {
      let selectedSL = [];
      selectedSL = this.IpandServiceLinelDD.filter(item => item.SysGuid == data.WiproServiceline);
      if (selectedSL.length > 0) {
        this.ip_data[i].WiproServicelineName = selectedSL[0].Name;
      }
      this.projectService.getIpPractice(data.WiproServiceline).subscribe(res => {
        data.IppracticeDD = res.ResponseObject;
      },
        err => {
          data.IppracticeDD = [];
        });
    }
    else {
      data.IppracticeDD = [];
    }

    let body = {
      "SBUGuid": this.projectService.getSession('sbuId'),
      "ServiceLineID": this.ip_data[i].WiproServiceline,
      "GEOGuid": this.projectService.getSession('GeoId'),
      "VerticalID": this.projectService.getSession('verticalId'),
      "PracticeID": null,
      "RegionidID": this.projectService.getSession('regionId'),
      "SearchText": "",
      "PageSize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": ''
    }
    this.ip_data[i].disableSlbdm = false;
    this.lookupdata.TotalRecordCount = 0;
    this.addIpService.getSLBDMData(body).subscribe(res => {
      if (!res.IsError) {
        this.ip_data[i].IpslBDMDD = res.ResponseObject;
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        if (this.ip_data[i].IpslBDMDD.length == 0) {
          var message = 'No records found for SL BDM! Could you raise a Helpline ticket?';
          this.projectService.displayMessageerror(message);
        }
        else if (this.ip_data[i].IpslBDMDD.length == 1) {
          this.appendslbdm2(this.ip_data[i].IpslBDMDD[0], i)
        }
      }
    },
      err => {
        this.projectService.displayerror(err.status);
      });
  }

  // Get SLBDM lookup data
  reloadSLBDM(data, i) {
    data.WiproSlbdmName = '';
    data.WiproSlbdmValue = '';
    this.ip_data[i].slbdmArrayForLookup = [];
    this.ip_data[i].SLBDMSelected = { SysGuid: "", Name: "" };
    if (data.WiproPractice) {

      let selectedPractice = [];
      selectedPractice = data.IppracticeDD.filter(item => item.SysGuid == data.WiproPractice);
      if (selectedPractice.length > 0) {
        this.ip_data[i].WiproPracticeName = selectedPractice[0].Name;
      }
      let body = {
        "SBUGuid": this.projectService.getSession('sbuId'),
        "ServiceLineID": this.ip_data[i].WiproServiceline,
        "GEOGuid": this.projectService.getSession('GeoId'),
        "VerticalID": this.projectService.getSession('verticalId'),
        "PracticeID": data.WiproPractice,
        "RegionidID": this.projectService.getSession('regionId'),
        "SearchText": "",
        "PageSize": 10,
        "RequestedPageNumber": 1,
        "OdatanextLink": ''
      }
      this.lookupdata.TotalRecordCount = 0;
      this.ip_data[i].disableSlbdm = false;
      this.addIpService.getSLBDMData(body).subscribe(res => {
        if (!res.IsError) {
          this.ip_data[i].IpslBDMDD = res.ResponseObject;
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.nextLink = res.OdatanextLink;
          if (this.ip_data[i].IpslBDMDD.length == 0) {
            var message = 'No records found for SL BDM! Could you raise a Helpline ticket?';
            this.projectService.displayMessageerror(message);
          }
          else if (this.ip_data[i].IpslBDMDD.length == 1) {
            this.appendslbdm2(this.ip_data[i].IpslBDMDD[0], i)
          }
        }
      },
        err => {
          this.projectService.displayerror(err.status);
        });
    }
  }

  getIpSlBDMData(data, i) {
    let searchText = data.searchValue ? data.searchValue : '';
    let body = {
      "SBUGuid": this.projectService.getSession('sbuId'),
      "ServiceLineID": this.ip_data[i].WiproServiceline,
      "GEOGuid": this.projectService.getSession('GeoId'),
      "VerticalID": this.projectService.getSession('verticalId'),
      "PracticeID": this.ip_data[i].WiproPractice,
      "RegionidID": this.projectService.getSession('regionId'),
      "SearchText": searchText,
      "PageSize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": ''
    }
    this.lookupdata.TotalRecordCount = 0;
    this.addIpService.getSLBDMData(body).subscribe(res => {
      if (!res.IsError) {
        this.ip_data[i].IpslBDMDD = res.ResponseObject;
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        this.lookupdata.nextLink = res.OdatanextLink;
      }
      else {
        this.projectService.displayMessageerror(res.Message);
      }
    },
      err => {
        this.projectService.displayerror(err.status);
      });
  }

  checkLicenceValue(data) {
    let tempLicenceValue: any = data.WiproTaggedLicenseValue.match(/^[0-9]+(\.[0-9]*){0,1}$/g);
    data.WiproTaggedLicenseValue = tempLicenceValue ? tempLicenceValue[0].toString() : "";
    data.WiproLicenseValueError = false;
    data.WiproLicenseValueZeroError = false;
    data.WiproAmcvalueError = false;
    data.WiproAmcvalueZeroError = false;
  }

  checkAMCValue(data) {
    let tempAMC: any = data.WiproTaggedamcValue.match(/^[0-9]+(\.[0-9]*){0,1}$/g);
    data.WiproTaggedamcValue = tempAMC ? tempAMC[0].toString() : "";
    data.WiproLicenseValueError = false;
    data.WiproLicenseValueZeroError = false;
    data.WiproAmcvalueError = false;
    data.WiproAmcvalueZeroError = false;
  }

  // Get holmes bdm data for lookup
  getIpHolmesData(data, i, type?) {
    let searchText = data.searchValue ? data.searchValue : '';
    let obj = {
      "Id": this.ip_data[i].IpId,
      "SearchText": searchText,
      "SearchType": "184450001",
      "PageSize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": null
    }
    this.lookupdata.TotalRecordCount = 0;
    this.addIpService.getIpandHolmesBDM(obj).subscribe(res => {
      this.IpHolmesDD = res.ResponseObject;
      this.lookupdata.TotalRecordCount = res.TotalRecordCount;
      this.lookupdata.nextLink = res.OdatanextLink;
      if (this.IpHolmesDD.length == 1 && type == 'INITIAL') {
        this.appendslbdm3(this.IpHolmesDD[0], i);
      }
    },
      err => {
        this.IpHolmesDD = [];
        this.projectService.displayerror(err.status);
      });
  }

  randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  // Add new IP
  addip() {
    this.ip_data.push(
      {
        "WipName": "WipName" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
        "WipmoduleName": "WipmoduleName" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
        "IpSLName": "IpSLName" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
        "IpPracticeName": "IpPracticeName" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
        "WSlbdmName": "WSlbdmName" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
        "IpLValueName": "IpLValueName" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
        "IpAMCValueName": "IpAMCValueName" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
        "IpCloudName": "IpCloudName" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
        "IpAcceptIpName": "IpAcceptIpName" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
        "HolmesbdmName": "HolmesbdmName" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",

        "isCheccked": false,
        "IpName": "",
        "WiproModuleName": "",
        "WiproModuleValue": "",
        "IpId": '',
        "WiproServiceline": '',
        'WiproServicelineName': '',
        "WiproPractice": "",
        "WiproPracticeName": '',
        "IppracticeDD": [],
        "IpslBDMDD": [],
        "CloudDisabled": true,
        "AcceptIpDisable": false,
        "WiproSlbdmName": "",
        "WiproSlbdmValue": "",
        "WiproLicenseValue": '',
        "WiproTaggedamcValue": '',
        "WiproTaggedLicenseValue": '',
        "WiproAmcvalue": '',
        "WiproCloud": false,
        "WiproAcceptip": false,
        "WiproHolmesbdmName": '',
        "WiproHolmesbdmID": '',
        "WiproOpportunityIdValue": this.projectService.getSession('opportunityId'),
        "WiproLicenseValueError": false,
        "WiproAmcvalueError": false,
        "WiproLicenseValueZeroError": false,
        "WiproAmcvalueZeroError": false,
        "WiproHolmesbdmNameError": false,
        "ipNameError": false,
        "WiproModuleNameError": false,
        "disableSlbdm": true,
        "moduleDisabled": true,
        "practiceDisabled": true,
        "holmesBDMDisable": true,
        "IpSelected": { SysGuid: "", Name: "" },
        "ipArrayForLookup": [],
        "ModuleSelected": { SysGuid: "", Name: "" },
        "moduleArrayForLookup": [],
        "SLBDMSelected": { SysGuid: "", Name: "" },
        "slbdmArrayForLookup": [],
        "HolmesBDMSelected": { SysGuid: "", Name: "" },
        "holmesbdmArrayForLookup": [],
        "OwnerId": ''
      }
    )
  }

  // Delete IP api calls
  deleteip(index) {
    const dialogRef = this.dialog.open(deleteserviceLine1, {
      width: "350px",
      data: {
        message: "This will delete the IP record",
        buttonText: "Confirm",
        Header: "Delete IP"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'save') {
        this.ip_data.splice(index, 1);
      }
    });
  }

  deleteDefaultIP(index) {
    const dialogRef = this.dialog.open(deleteIP1, {
      width: "350px",
      data: {
        message: "This will delete the IP record",
        buttonText: "Confirm",
        Header: "Delete IP"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.action == 'save') {
        this.isLoading = true;
        this.IpDetails[index].statecode = 1;
        this.projectService.saveIpData([this.IpDetails[index]]).subscribe(res => {
          this.isLoading = false;
          if (!res.IsError) {
            this.IpDetails.splice(index, 1);
            this.projectService.displayMessageerror('IP deleted successfully.');
          }
          else {
            this.projectService.displayMessageerror(res.Message);
          }
        },
          err => {
            this.projectService.displayerror(err.status);
          })
      }
    });
  }

  // Save IP data
  isDuplicatePresent: boolean = false;
  SaveIpData() {
    console.log("SaveIpData", this.ip_data);
    this.ip_data = this.ip_data.map(data => {
      data.WiproLicenseValue = data.WiproTaggedLicenseValue;
      data.WiproAmcvalue = data.WiproTaggedamcValue;
      return data;
    });
    debugger;
    let UserId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
    var userFlag = 0;
    var AMCLicenceFlag = 0;
    if (this.ip_data.length == 0) {
      this.projectService.displayMessageerror('Please add IP');
      return;
    }
    else {
      for (let i = 0; i < this.ip_data.length; i++) {
        if (UserId.toLowerCase() != this.ip_data[i].OwnerId.toLowerCase()) {
          if (this.ip_data[i].holmesBDMDisable == true) {
            userFlag = 1;
          }
          else if (this.ip_data[i].holmesBDMDisable == false && UserId.toLowerCase() != this.ip_data[i].WiproHolmesbdmID.toLowerCase()) {
            userFlag = 1;
          }
        }
        if (UserId.toLowerCase() != this.ip_data[i].OwnerId.toLowerCase() && (!this.ip_data[i].holmesBDMDisable && UserId.toLowerCase() != this.ip_data[i].WiproHolmesbdmID.toLowerCase())) {

          userFlag = 1;
        }
        if (this.ip_data[i].WiproTaggedLicenseValue == '' && this.ip_data[i].WiproTaggedamcValue == '') {
          this.ip_data[i].WiproLicenseValueError = true;
          this.ip_data[i].WiproAmcvalueError = true;
          AMCLicenceFlag = 1;
        }
        else if (this.ip_data[i].WiproTaggedLicenseValue == '' && Number(this.ip_data[i].WiproTaggedamcValue) >= 0) {
          if (Number(this.ip_data[i].WiproTaggedamcValue) == 0) {
            this.ip_data[i].WiproLicenseValueError = true;
            this.ip_data[i].WiproAmcvalueError = false;
            AMCLicenceFlag = 1;
          }
          else {
            this.ip_data[i].WiproLicenseValueError = false;
            this.ip_data[i].WiproAmcvalueError = false;
            this.ip_data[i].WiproTaggedLicenseValue = '';
          }
        }
        else if (Number(this.ip_data[i].WiproTaggedLicenseValue) >= 0 && this.ip_data[i].WiproTaggedamcValue == '') {
          if (Number(this.ip_data[i].WiproTaggedLicenseValue) == 0) {
            this.ip_data[i].WiproLicenseValueError = false;
            this.ip_data[i].WiproAmcvalueError = true;
            AMCLicenceFlag = 1;
          }
          else {
            this.ip_data[i].WiproLicenseValueError = false;
            this.ip_data[i].WiproAmcvalueError = false;
            this.ip_data[i].WiproTaggedamcValue = '';
          }
        }
        else if (Number(this.ip_data[i].WiproTaggedLicenseValue) >= 0 && Number(this.ip_data[i].WiproTaggedamcValue) >= 0) {
          if (Number(this.ip_data[i].WiproTaggedLicenseValue) == 0 && Number(this.ip_data[i].WiproTaggedamcValue) == 0) {
            this.ip_data[i].WiproLicenseValueError = false;
            this.ip_data[i].WiproAmcvalueError = false;
            this.ip_data[i].WiproLicenseValueZeroError = true;
            this.ip_data[i].WiproAmcvalueZeroError = true;
            AMCLicenceFlag = 1;
          }
          else {
            this.ip_data[i].WiproLicenseValueError = false;
            this.ip_data[i].WiproAmcvalueError = false;
          }
        }
      }
    }

    console.log("SaveIpData", AMCLicenceFlag)
    for (let i = 0; i < this.ip_data.length; i++) {
      if (!this.ip_data[i].holmesBDMDisable)//IpName=="Holmes for Business")
      {
        if (this.ip_data[i].WiproHolmesbdmName == '') {
          this.ip_data[i].WiproHolmesbdmNameError = true
          AMCLicenceFlag = 1;
        }
        else {
          this.ip_data[i].WiproHolmesbdmNameError = false
        }
      }
    }
    for (let k = 0; k < this.ip_data.length; k++) {
      if (this.ip_data[k].IpName == '') {
        this.ip_data[k].ipNameError = true;
        AMCLicenceFlag = 1;
      }
      if (!this.ip_data[k].moduleDisabled && this.ip_data[k].WiproModuleName == '') {
        this.ip_data[k].WiproModuleNameError = true;
        AMCLicenceFlag = 1;
      }
    }


    //check for duplicate entries
    if (AMCLicenceFlag == 0) {
      this.isDuplicatePresent = false;
      if (this.ip_data.length > 0) {
        let tempArray = [];
        tempArray = this.ip_data.concat(this.IpDetails);
        for (let ip = 0; ip < tempArray.length; ip++) {
          if (tempArray.filter(res => res.IpName == tempArray[ip].IpName && res.IpId == tempArray[ip].IpId && res.WiproModuleName == tempArray[ip].WiproModuleName && res.WiproModuleValue == tempArray[ip].WiproModuleValue).length > 1) {
            this.projectService.displayMessageerror("Duplicate combination of IP and module is present for " + this.converIndextoString(ip) + " row in IP table");
            this.isDuplicatePresent = true;
            return;
          }
        }
      }
    }

    if (AMCLicenceFlag == 1) {
      let message = "Please fill mandatory fields.";
      this.projectService.displayMessageerror(message);
    }
    else if (userFlag == 1) {
      let message = "Selected IP Owner should match Logged in user"; //message pending
      this.projectService.displayMessageerror(message);
    }
    else {
      this.isDuplicatePresent = false;
      if (this.ip_data.length > 0) {
        let tempArray = [];
        tempArray = this.ip_data.concat(this.IpDetails);
        for (let ip = 0; ip < tempArray.length; ip++) {
          if (tempArray.filter(res => res.IpName == tempArray[ip].IpName && res.IpId == tempArray[ip].IpId && res.WiproModuleName == tempArray[ip].WiproModuleName && res.WiproModuleValue == tempArray[ip].WiproModuleValue).length > 1) {
            this.projectService.displayMessageerror("Duplicate combination of IP and module is present for " + this.converIndextoString(ip) + " row in IP table");
            this.isDuplicatePresent = true;
            return;
          }
        }
      }
    }
    if (!this.isDuplicatePresent && userFlag == 0 && AMCLicenceFlag == 0) {
      this.isLoading = true;
      this.ip_data.map(sl => {
        delete sl.WiproAmcvalue;
        delete sl.WiproLicenseValue;
      })
      this.projectService.saveIpData(this.ip_data).subscribe(res => {
        this.isLoading = false;
        if (res.IsError == false) {
          let message = "IP Saved Successfully ";
          this.projectService.displayMessageerror(message);
          this.projectService.accessModifyApi(this.projectService.getSession("AdvisorOwnerId"), this.projectService.getSession("userEmail")).subscribe((res) => {
            if (res) {
              if (res.isError) {
                this.projectService.displayMessageerror(res.Message);
                this.isLoading = false;
              }
              else {
                this.isLoading = false;
                this.projectService.setSession('IsPreSaleAndRole', res.ResponseObject.UserRoles.IsPreSaleAndRole);
                this.projectService.setSession('IsGainAccess', res.ResponseObject.IsGainAccess);
                this.projectService.setSession('FullAccess', res.ResponseObject.FullAccess);
                this.projectService.setSession('roleObj', res.ResponseObject);
                this.router.navigate(['/opportunity/opportunityview/businesssolution']);
              }
            }
          },
            err => {
              this.isLoading = false;
              this.projectService.displayerror(err.status);

            });
        } else {
          this.projectService.displayMessageerror(res.Message);
        }
      },
        err => {
          this.isLoading = false;
          this.projectService.displayerror(err.status);
        })
    }
  }

  converIndextoString(index) {
    index = index + 1;
    if (index == 1) {
      return '1st';
    }
    else if (index == 2) {
      return '2nd';
    }
    else if (index == 3) {
      return '3rd';
    }
    else {
      return index + 'th';
    }
  }

  goBack() {
    this.router.navigate(['/opportunity/opportunityview/businesssolution']);
  }

  //Advance lookup code starts
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
    nextLink: '',
    selectedRecord: [],
    pageNo: 1,
    isLoader: false,
    casesensitive: false
  };

  IdentifyAppendFunc = {
    'ip': (data, item) => { this.appendip(data, item) },
    'module': (data, item) => { this.appendmodule(data, item) },
    'slbdm': (data, item) => { this.appendslbdm2(data, item) },
    'holmesbdm': (data, item) => { this.appendslbdm3(data, item) }
  }

  selectedLookupData(controlName, i) {
    switch (controlName) {
      case 'ip': {
        return (this.ip_data[i].ipArrayForLookup && this.ip_data[i].ipArrayForLookup.length > 0) ? this.ip_data[i].ipArrayForLookup : []
      }
      case 'module': {
        return (this.ip_data[i].moduleArrayForLookup && this.ip_data[i].moduleArrayForLookup.length > 0) ? this.ip_data[i].moduleArrayForLookup : []
      }
      case 'slbdm': {
        return (this.ip_data[i].slbdmArrayForLookup && this.ip_data[i].slbdmArrayForLookup.length > 0) ? this.ip_data[i].slbdmArrayForLookup : []
      }
      case 'holmesbdm': {
        return (this.ip_data[i].holmesbdmArrayForLookup && this.ip_data[i].holmesbdmArrayForLookup.length > 0) ? this.ip_data[i].holmesbdmArrayForLookup : []
      }
    }
  }

  openAdvanceLookup(controlName, initalLookupData, value, item) {
    this.lookupdata.controlName = controlName
    this.lookupdata.headerdata = addIpHeaders[controlName]
    this.lookupdata.lookupName = addIpNames[controlName]['name']
    this.lookupdata.isCheckboxRequired = addIpNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = addIpNames[controlName]['isAccount']
    this.lookupdata.inputValue = value;
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName, item);
    this.addIpService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
      this.lookupdata.tabledata = res
    })

    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.service.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });

    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
      debugger;
      console.log(x, "data");
      if (x.action == 'loadMore') {
        let dialogData = {
          searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
          recordCount: this.lookupdata.recordCount ? this.lookupdata.recordCount : 10,
          OdatanextLink: this.lookupdata.nextLink,
          pageNo: x.currentPage,
          RequestedPageNumber: x.currentPage
        }

        this.addIpService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(item), ...dialogData } }).subscribe(res => {
          this.lookupdata.isLoader = false;
          this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
          this.lookupdata.pageNo = res.CurrentPageNumber;
          this.lookupdata.nextLink = res.OdatanextLink
          // this.lookupdata.recordCount = res.PageSize ? 
        })

      } else if (x.action == 'search') {

        this.lookupdata.tabledata = []
        this.lookupdata.nextLink = ''
        this.lookupdata.pageNo = 1

        let dialogData = {
          searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
          recordCount: this.lookupdata.recordCount ? this.lookupdata.recordCount : 10,
          OdatanextLink: this.lookupdata.nextLink,
          pageNo: x.currentPage,
          RequestedPageNumber: x.currentPage
        }

        this.addIpService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(item), ...dialogData } }).subscribe(res => {
          this.lookupdata.isLoader = false;
          this.lookupdata.tabledata = res.ResponseObject;
          this.lookupdata.pageNo = res.CurrentPageNumber;
          this.lookupdata.nextLink = res.OdatanextLink
          // this.lookupdata.recordCount = res.PageSize
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        })
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        this.AppendParticularInputDataFun(result.selectedData, result.controlName, item)
      }
    });

  }

  advanceLookUpSearch(lookUpData, index) {
    let labelName = lookUpData.labelName.split('-');
    switch (labelName[0] ? labelName[0] : labelName) {
      case 'ip': {
        this.ip_data[index].IpSelected = lookUpData.selectedData;
        this.lookupdata.casesensitive = true;
        this.openAdvanceLookup('ip', this.wiproip, lookUpData.inputVal, index);
        return
      }
      case 'module': {
        this.ip_data[index].ModuleSelected = lookUpData.selectedData;
        this.lookupdata.casesensitive = false;
        this.openAdvanceLookup('module', this.wipromodule, lookUpData.inputVal, index);
        return
      }
      case 'slbdm': {
        this.ip_data[index].SLBDMSelected = lookUpData.selectedData;
        this.lookupdata.casesensitive = true;
        this.openAdvanceLookup('slbdm', this.ip_data[index].IpslBDMDD, lookUpData.inputVal, index);
        return
      }
      case 'holmesbdm': {
        this.ip_data[index].HolmesBDMSelected = lookUpData.selectedData;
        this.lookupdata.casesensitive = true;
        this.openAdvanceLookup('holmesbdm', this.IpHolmesDD, lookUpData.inputVal, index);
        return
      }
    }
  }

  AppendParticularInputDataFun(selectedData, controlName, item) {
    if (selectedData) {
      if (selectedData.length > 0) {
        selectedData.forEach(data => {
          this.IdentifyAppendFunc[controlName](data, item)
        });
      }
    }
  }

  getCommonData(i) {
    return {
      guid: this.ip_data[i].IpId,
      serviceLineId: this.ip_data[i].WiproServiceline,
      verticalId: this.projectService.getSession('verticalId'),
      regionId: this.projectService.getSession('regionId'),
      sbuGuid: this.projectService.getSession('sbuId'),
      geoGuid: this.projectService.getSession('GeoId'),
      practiceId: this.ip_data[i].WiproPractice,
    }
  }
}
