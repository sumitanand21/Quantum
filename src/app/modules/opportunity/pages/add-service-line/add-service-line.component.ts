import { Component, OnInit, EventEmitter } from '@angular/core';
import { DataCommunicationService } from '@app/core/services/global.service';
import { MatDialog } from '@angular/material/';
import { OpportunitiesService, opportunityAdvnHeaders, opportunityAdvnNames } from '@app/core';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { Router } from '@angular/router';
import { deleteserviceLine1 } from '../opportunity-view/tabs/business-solution/business-solution.component';

@Component({
  selector: 'app-add-service-line',
  templateUrl: './add-service-line.component.html',
  styleUrls: ['./add-service-line.component.scss']
})
export class AddServiceLineComponent implements OnInit {
  panelOpenState2: boolean = true;
  serviceline_data = [];
  IpandServiceLinelDD = [];
  PercentTCVDisable: boolean = true;
  BSEngagementModelDD = [];
  opportunityId: string = '';
  SLDetails: any = [];
  isLoading: boolean = false;
  overallTCV = 0;
  opportunityName = '';
  SLBDMObj = { name: 'Name', Id: 'SysGuid' };

  constructor(private EncrDecr: EncrDecrService, public projectService: OpportunitiesService,
    public dialog: MatDialog, public service: DataCommunicationService, public router: Router) { }

    ngOnInit() {
    this.opportunityId = this.projectService.getSession('opportunityId');
    this.opportunityName = this.projectService.getSession('opportunityName');
    this.getIpandserviceLineData();
    this.getServiceLineDetails(this.opportunityId);
  }

  // Get all service line data
  getServiceLineDetails(oppId) {
    this.isLoading = true;
    this.projectService.getBusinessSolutions(oppId).subscribe(res => {
      this.isLoading = false;
      if (!res.IsError) {
        let UserId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
        this.overallTCV = res.ResponseObject.OppBSP.Sltcv;
        this.PercentTCVDisable = res.ResponseObject.OppBSP.CalculationMethod;
        this.SLDetails = res.ResponseObject.WiproServiceLineDtls;
        console.log("this.SLDetails", this.SLDetails)
        this.SLDetails.map(item => {
          if (UserId.toLowerCase() == item.WiproSlbdmid.toLowerCase()) {
            item.IsDelete = true;
          }
          else {
            item.IsDelete = false;
            item.TaggedTCV = item.WiproEstsltcv;
          }
          item.WiproSubpracticeName = item.WiproSubpracticeName ? item.WiproSubpracticeName : '-';
          item.WiproDualCreditName = item.WiproDualCreditName ? item.WiproDualCreditName : '-';
        })
      }
    },
      err => {
        this.isLoading = false;
      });
  }

  // Get engagement model dropdown master data
  getEngagementModelDD(data) {
    this.projectService.getEngagementModelData(data.WiproServicelineidValue).subscribe(res => {
      this.BSEngagementModelDD = (res && res.ResponseObject) ? res.ResponseObject : [];
    }, err => {
      this.BSEngagementModelDD = [];
    });
  }

  // Get serviceline dropdown master data
  getIpandserviceLineData() {
    this.projectService.getServiceLine(this.projectService.getSession('sbuId')).subscribe(res => {
      this.IpandServiceLinelDD = (res && res.ResponseObject) ? res.ResponseObject : [];
      this.IpandServiceLinelDD = this.IpandServiceLinelDD.filter(it => it.IsVisible == true);
    }, err => {
      this.IpandServiceLinelDD = [];
    });
  }

  OnBSSLTCVChange(data, i) {
    console.log("SLTCV", data.WiproEstsltcv);
    let tempSLTCVValue: any = data.WiproEstsltcv.match(/^[0-9]+(\.[0-9]*){0,1}$/g);
    data.WiproEstsltcv = tempSLTCVValue ? tempSLTCVValue[0].toString() : "";
    this.serviceline_data[i].estSlTcvFlag = false;
  }

  OnBSSLTCVBlur(i) {
    if (this.overallTCV > 0) {
      this.serviceline_data[i].WiproPercentageOftcv = ((Number(this.serviceline_data[i].WiproEstsltcv) * 100) / this.overallTCV).toFixed(2);
    }
    else {
      this.serviceline_data[i].WiproPercentageOftcv = '';
    }
  }

  OnPerTCVBlur(i) {
    if (parseFloat(this.serviceline_data[i].WiproPercentageOftcv) > 100) {
      this.serviceline_data[i].WiproPercentageOftcv = '';
      this.projectService.displayMessageerror('% of TCV cannot be greater than 100');
      return;
    }
    this.serviceline_data[i].WiproEstsltcv =
      (Number(this.serviceline_data[i].WiproPercentageOftcv) * this.overallTCV / 100).toFixed(2);

  }

  // Get practice data
  getBSSLPracticeData(data, i) {
    this.serviceline_data[i].engModelDisabled = false;
    this.serviceline_data[i].serviceLineFlag = false;
    this.serviceline_data[i].subPracticeDisabled = true;
    this.serviceline_data[i].subPracticeFlag = false;
    this.getEngagementModelDD(data);
    console.log("getBSSLPracticeData", data)
    data.WiproPracticeId = "";
    data.WiproSubpracticeid = "";
    data.WiproDualCredit = "";
    data.WiproSlbdmidValueName = "";
    data.WiproSlbdmid = "";
    this.serviceline_data[i].slbdmArrayForLookUp = [];
    data.WiproEngagementModel = "";
    if (data.WiproServicelineidValue) {
      let selectedSL = [];
      selectedSL = this.IpandServiceLinelDD.filter(item => item.SysGuid == data.WiproServicelineidValue);
      if (selectedSL.length > 0) {
        this.serviceline_data[i].WiproServicelineidValueName = selectedSL[0].Name;
      }
      this.projectService.getIpPractice(data.WiproServicelineidValue).subscribe(res => {
        data.SlpracticeDD = (res && res.ResponseObject) ? res.ResponseObject : [];
        if (data.SlpracticeDD.length > 0) {
          this.serviceline_data[i].practiceDisabled = false;
          this.serviceline_data[i].practiceFlag = true;
        }
        else {
          this.serviceline_data[i].practiceDisabled = true;
          this.serviceline_data[i].practiceFlag = false;
        }
      },
        err => {
          data.SlpracticeDD = [];
        });

      let body = {
        "SBUGuid": this.projectService.getSession('sbuId'),
        "ServiceLineID": this.serviceline_data[i].WiproServicelineidValue,
        "GEOGuid": this.projectService.getSession('GeoId'),
        "VerticalID": this.projectService.getSession('verticalId'),
        "PracticeID": null,
        "RegionidID": this.projectService.getSession('regionId'),
        "SearchText": '',
        "PageSize": 10,
        "RequestedPageNumber": 1,
        "OdatanextLink": ''
      }
      this.serviceline_data[i].slbdmDisabled = false;
      this.lookupdata.TotalRecordCount = 0;
      this.projectService.getSLBDMDataAPI(body).subscribe(res => {
        if (!res.IsError) {
          this.serviceline_data[i].SlSLBDMDD = res.ResponseObject;
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.nextLink = res.OdatanextLink;
          if (this.serviceline_data[i].SlSLBDMDD.length == 0) {
            var message = 'No records found for SL BDM! Could you raise a Helpline ticket?';
            this.projectService.displayMessageerror(message);
          }
          else if (this.serviceline_data[i].SlSLBDMDD.length == 1) {
            this.appendslbdm(this.serviceline_data[i].SlSLBDMDD[0], i)
          }
        }
        else {
          this.projectService.displayMessageerror(res.Message);
        }
      },
        err => {
          this.projectService.displayerror(err.status);
        });
    }
    else {
      data.SlpracticeDD = [];
      data.WiproServicelineidValueName = "";
    }
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

  // Get subpractice data
  getBSSLSubPracticeData(data, i) {
    data.WiproSubpracticeid = "";
    this.serviceline_data[i].practiceFlag = false;
    if (data.WiproServicelineidValue && data.WiproPracticeId) {
      let selectedPractice = [];
      selectedPractice = data.SlpracticeDD.filter(item => item.SysGuid == data.WiproPracticeId);
      if (selectedPractice.length > 0) {
        this.serviceline_data[i].WiproPracticeName = selectedPractice[0].Name;
      }
      this.projectService.getSLSubPractice(data.WiproPracticeId).subscribe(res => {
        data.SlSubpracticeDD = (res && res.ResponseObject) ? res.ResponseObject : [];
        data.SlSubpracticeDD.forEach(item => {
          (item.Name) ? item.Name = this.getSymbol(item.Name) : '-';
        })
        if (data.SlSubpracticeDD.length > 0) {
          this.serviceline_data[i].subPracticeDisabled = false;
          this.serviceline_data[i].subPracticeFlag = true;
        }
        else {
          this.serviceline_data[i].subPracticeDisabled = true;
          this.serviceline_data[i].subPracticeFlag = false;
        }
      },
        err => {
          data.SlSubpracticeDD = [];
        });

      //reload slbdm value
      let body = {
        "SBUGuid": this.projectService.getSession('sbuId'),
        "ServiceLineID": this.serviceline_data[i].WiproServicelineidValue,
        "GEOGuid": this.projectService.getSession('GeoId'),
        "VerticalID": this.projectService.getSession('verticalId'),
        "PracticeID": data.WiproPracticeId,
        "RegionidID": this.projectService.getSession('regionId'),
        "SearchText": '',
        "PageSize": 10,
        "RequestedPageNumber": 1,
        "OdatanextLink": ''
      }
      this.serviceline_data[i].slbdmDisabled = false;
      this.lookupdata.TotalRecordCount = 0;
      this.projectService.getSLBDMDataAPI(body).subscribe(res => {
        if (!res.IsError) {
          this.serviceline_data[i].SlSLBDMDD = res.ResponseObject;
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
          this.lookupdata.nextLink = res.OdatanextLink;
          if (this.serviceline_data[i].SlSLBDMDD.length == 0) {
            var message = 'No records found for SL BDM! Could you raise a Helpline ticket?';
            this.projectService.displayMessageerror(message);
          }
          else if (this.serviceline_data[i].SlSLBDMDD.length == 1) {
            this.appendslbdm(this.serviceline_data[i].SlSLBDMDD[0], i)
          }
        }
        else {
          this.projectService.displayMessageerror(res.Message);
        }
      },
        err => {
          this.projectService.displayerror(err.status);
        });
    }
    else {
      data.SlSubpracticeDD = [];
    }
  }

  // Get Slbdm data
  getBSSLSlBDMData(data, i) {
    let searchText = data.searchValue ? data.searchValue : '';
    let body = {
      "SBUGuid": this.projectService.getSession('sbuId'),
      "ServiceLineID": this.serviceline_data[i].WiproServicelineidValue,
      "GEOGuid": this.projectService.getSession('GeoId'),
      "VerticalID": this.projectService.getSession('verticalId'),
      "PracticeID": this.serviceline_data[i].WiproPracticeId,
      "RegionidID": this.projectService.getSession('regionId'),
      "SearchText": searchText,
      "PageSize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": ''
    }
    this.lookupdata.TotalRecordCount = 0;
    this.projectService.getSLBDMDataAPI(body).subscribe(res => {
      if (!res.IsError) {
        this.serviceline_data[i].SlSLBDMDD = res.ResponseObject;
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

  // Set subpractice name on change of subpractice
  subpracticeSelected(i) {
    this.serviceline_data[i].subPracticeFlag = false;
    let selectedSubPractice = [];
    selectedSubPractice = this.serviceline_data[i].SlSubpracticeDD.filter(item => item.SubPracticeId == this.serviceline_data[i].WiproSubpracticeid);
    if (selectedSubPractice.length > 0) {
      this.serviceline_data[i].WiproSubpracticeName = selectedSubPractice[0].Name;
    }
  }

  // On change of engagement model value
  setEngModelName(i) {
    this.serviceline_data[i].engModelFlag = false;
    let selectedEngModel = [];
    selectedEngModel = this.BSEngagementModelDD.filter(item => item.Id == this.serviceline_data[i].WiproEngagementModel);
    if (selectedEngModel.length > 0) {
      this.serviceline_data[i].WiproEngagementModelName = selectedEngModel[0].Name;
    }
  }

// Save Serviceline api call
  isDuplicatePresent: boolean = false;
  SaveServiceLine() {
    let UserId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
    console.log("userID from local ", UserId);
    console.log("this.serviceline_data", this.serviceline_data);
    var flag = 0;
    var mandtFieldsFlag = false;
    if (this.serviceline_data.length == 0) {
      this.projectService.displayMessageerror('Please add service line');
      return;
    }
    for (let i = 0; i < this.serviceline_data.length; i++) {
      this.serviceline_data[i].serviceLineFlag = false;
      this.serviceline_data[i].slbdmFlag = false;
      this.serviceline_data[i].estSlTcvFlag = false;
      this.serviceline_data[i].engModelFlag = false;
      if (UserId.toLowerCase() != this.serviceline_data[i].WiproSlbdmid.toLowerCase()) {
        console.log("flag made 1", UserId.toLowerCase(), ' ', this.serviceline_data[i].WiproSlbdmid.toLowerCase());
        flag = 1;
      }
      if (this.serviceline_data[i].WiproServicelineidValue == '') {
        this.serviceline_data[i].WiproServicelineidValueDisable = true;
        this.serviceline_data[i].serviceLineFlag = true;
        mandtFieldsFlag = true;
      }
      if (this.serviceline_data[i].practiceFlag) {
        mandtFieldsFlag = true;
      }
      if (this.serviceline_data[i].subPracticeFlag) {
        mandtFieldsFlag = true;
      }
      if (this.serviceline_data[i].WiproSlbdmidValueName == '') {
        this.serviceline_data[i].WiproSlbdmidValueNameDisable = true;
        this.serviceline_data[i].slbdmFlag = true;
        mandtFieldsFlag = true;
      }
      if (this.serviceline_data[i].WiproEstsltcv == '') {
        this.serviceline_data[i].WiproEstsltcvDisable = true;
        this.serviceline_data[i].estSlTcvFlag = true;
        mandtFieldsFlag = true;
      }
      if (this.serviceline_data[i].WiproEngagementModel == '') {
        this.serviceline_data[i].WiproEngagementModelDisable = true;
        this.serviceline_data[i].engModelFlag = true;
        mandtFieldsFlag = true;
      }
    }


    if (mandtFieldsFlag) {
      this.projectService.displayMessageerror("Please fill all mandatory fields.")
    }
    else if (flag == 1) {
      let message = "Selected SL BDM should match Logged in user";
      this.projectService.displayMessageerror(message);
    }
    else {
      //check for duplicate entries
      this.isDuplicatePresent = false;
      if (this.serviceline_data.length > 0) {
        let tempArray = [];
        tempArray = this.serviceline_data.concat(this.SLDetails);
        for (let sl = 0; sl < tempArray.length; sl++) {
          if (tempArray.filter(res => res.WiproOpportunityServicelineDetailId != tempArray[sl].WiproOpportunityServicelineDetailId &&
            res.WiproServicelineidValue == tempArray[sl].WiproServicelineidValue
            && res.WiproPracticeId == tempArray[sl].WiproPracticeId && res.WiproSubpracticeid == tempArray[sl].WiproSubpracticeid &&
            res.WiproSlbdmid == tempArray[sl].WiproSlbdmid).length > 0) {
            this.projectService.displayMessageerror("Duplicate combination of service line, practice, sub practice and SL BDM is present for " + this.converIndextoString(sl) + " row in service lines table");
            this.isDuplicatePresent = true;
            return;
          }
        }
      }
    }
    if (!this.isDuplicatePresent && flag == 0 && !mandtFieldsFlag) {
      console.log("SaveServiceLine", this.serviceline_data)
      this.serviceline_data.map(sl => {
        sl.TaggedTCV = sl.WiproEstsltcv;
        delete sl.WiproEstsltcv;
      })
      this.isLoading = true;
      this.projectService.saveServiceLineDetailIndividual(this.serviceline_data).subscribe(res => {
        this.isLoading = false;
        if (res.IsError == false) {
          let message = "Service Line Saved Successfully ";
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
          this.projectService.displayerror(res.Message);
        }
      },
        err => {
          this.isLoading = false;
          this.projectService.displayMessageerror(err.status);

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

  randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  // Add new serviceline
  addserviceline() {
    this.serviceline_data.push(
      {
        "OpportunityId": this.opportunityId,
        "isCheccked": false,
        "WiproServiceline": '',
        "WiproPracticeId": "",
        "WiproPracticeName": "",
        "WiproPracticeIdDisable": false,
        "WiproSubpracticeName": "",
        "WiproSubpracticeid": "",
        "WiproSubpracticeidDisable": false,
        "WiproSlbdmName": "",
        "WiproSlbdmidValueName": '',
        "WiproSlbdmidValueNameDisable": false,
        "WiproSlbdmid": '',
        "WiproSlbdmValue": "",
        "WiproServicelineidValue": '',
        "WiproServicelineidValueName": '',
        "WiproServicelineidValueDisable": false,
        "WiproDualCredit": "",
        "WiproDualCreditName": "",
        "WiproEngagementModel": '',
        "WiproEngagementModelName": '',
        "WiproEngagementModelDisable": false,
        "WiproEstsltcv": '',
        "WiproEstsltcvDisable": false,
        "WiproOpportunityServicelineDetailId": "",
        "wiproTaggedStatus": false,
        "TaggedTCV": '',
        "SLSLName": "SLSLName" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
        "SLPracticeName": "SLPracticeName" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
        "SLSubPracticeName": "SLSubPracticeName" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
        "slbdmName": "slbdmName" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
        "PercTCVName": "PercTCVName" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
        "SLTCVName": "SLTCVName" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
        "SLCloudName": "SLCloudName" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
        "SLEngagementName": "SLEngagementName" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
        "SLDualCreditName": "SLDualCreditName" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
        "slbdmDisabled": true,
        "practiceDisabled": true,
        "practiceFlag": false,
        "subPracticeDisabled": true,
        "subPracticeFlag": false,
        "engModelDisabled": true,
        "serviceLineFlag": false,
        "slbdmFlag": false,
        "estSlTcvFlag": false,
        "engModelFlag": false,
        "SLBDMSelected": { SysGuid: "", Name: "" },
        "slbdmArrayForLookup": []
      }
    )
  }

  // delete service line
  deleteserviceline(index) {
    let dialogRef = this.dialog.open(deleteserviceLine1, {
      width: "350px",
      data: {
        message: "Do you wish to delete this service line",
        buttonText: "Confirm",
        Header: "Delete service line"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'save') {
        this.serviceline_data.splice(index, 1);
      }
    });
  }


  deleteDefaultSL(index) {
    let dialogRef = this.dialog.open(deleteserviceLine1, {
      width: "350px",
      data: {
        message: "Do you wish to delete this service line",//"If you delete service line, Related Multiple BDM record will delete. Are you sure you want to delete record?All records for this service line in the Multiple BDM tagging/Credit Sharing section will be deleted from the Opportunity and Order Booking screens",
        buttonText: "Confirm",
        Header: "Delete service line"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'save') {
        this.isLoading = true;
        this.SLDetails[index].statecode = 1;
        this.projectService.saveServiceLineDetailIndividual([this.SLDetails[index]]).subscribe(res => {
          this.isLoading = false;
          if (!res.IsError) {
            this.SLDetails.splice(index, 1);
            this.projectService.displayMessageerror('Service line deleted successfully.');
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

  // On select of slbdm
  appendslbdm(item, i) {
    console.log("slbdm selected: ", item);
    this.serviceline_data[i].slbdmArrayForLookUp = [];
    this.serviceline_data[i].SLBDMSelected = Object.keys(item).length ? item : { SysGuid: "", Name: "" };
    if (item && typeof item === 'object' && Object.keys(item).length) {
      this.serviceline_data[i].SLBDMSelected.Id = this.serviceline_data[i].SLBDMSelected.SysGuid
      this.serviceline_data[i].WiproSlbdmidValueName = item.Name;
      this.serviceline_data[i].WiproSlbdmid = item.SysGuid;
      this.serviceline_data[i].slbdmArrayForLookUp.push(item);
      this.serviceline_data[i].slbdmFlag = false;
    }
    else {
      this.serviceline_data[i].WiproSlbdmidValueName = '';
      this.serviceline_data[i].WiproSlbdmid = '';
    }
  }

  goBack() {
    this.router.navigate(['/opportunity/opportunityview/businesssolution']);
  }

  // advance lookup code starts
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
    casesensitive: true
  };

  advanceLookUpSearch(lookUpData, index) {
    let labelName = lookUpData.labelName.split('-');
    switch (labelName[0] ? labelName[0] : labelName) {
      case 'slbdm': {
        this.serviceline_data[index].SLBDMSelected = lookUpData.selectedData;
        this.lookupdata.casesensitive = true;
        this.openadvancetabs('SlBdmValue', this.serviceline_data[index].SlSLBDMDD, lookUpData.inputVal, index);
        return
      }
    }
  }

  selectedLookupData(controlName, i) {
    switch (controlName) {
      case 'SlBdmValue': {
        return (this.serviceline_data[i].slbdmArrayForLookUp && this.serviceline_data[i].slbdmArrayForLookUp.length > 0) ? this.serviceline_data[i].slbdmArrayForLookUp : []
      }
    }
  }
  
  openadvancetabs(controlName, initalLookupData, value, i): void {
    this.lookupdata.controlName = controlName
    this.lookupdata.headerdata = opportunityAdvnHeaders[controlName]
    this.lookupdata.lookupName = opportunityAdvnNames[controlName]['name']
    this.lookupdata.isCheckboxRequired = opportunityAdvnNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = opportunityAdvnNames[controlName]['isAccount']
    this.lookupdata.inputValue = value;
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName, i);
    this.projectService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
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
          SearchText: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
          recordCount: this.lookupdata.recordCount,
          OdatanextLink: this.lookupdata.nextLink,
          pageNo: x.currentPage,
          RequestedPageNumber: x.currentPage
        }

        this.projectService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(i), ...dialogData } }).subscribe(res => {
          this.lookupdata.isLoader = false;
          this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
          this.lookupdata.pageNo = res.CurrentPageNumber;
          this.lookupdata.nextLink = res.OdatanextLink
          this.lookupdata.recordCount = res.PageSize
        })

      } else if (x.action == 'search') {

        this.lookupdata.tabledata = []
        this.lookupdata.nextLink = ''
        this.lookupdata.pageNo = 1

        let dialogData = {
          searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
          SearchText: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
          recordCount: this.lookupdata.recordCount,
          OdatanextLink: this.lookupdata.nextLink,
          pageNo: x.currentPage,
          RequestedPageNumber: x.currentPage
        }

        this.projectService.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(i), ...dialogData } }).subscribe(res => {
          this.lookupdata.isLoader = false;
          this.lookupdata.tabledata = res.ResponseObject;
          this.lookupdata.pageNo = res.CurrentPageNumber;
          this.lookupdata.nextLink = res.OdatanextLink
          this.lookupdata.recordCount = res.PageSize
          this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        })
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      debugger
      if (result) {
        console.log(result)
        this.AppendParticularInputDataFun(result.selectedData, result.controlName, i)
      }
    });
  }

  getCommonData(i) {
    return {
      serviceLineId: this.serviceline_data[i].WiproServicelineidValue,
      verticalId: this.projectService.getSession('verticalId'),
      regionId: this.projectService.getSession('regionId'),
      sbuGuid: this.projectService.getSession('sbuId'),
      geoGuid: this.projectService.getSession('GeoId'),
      practiceId: this.serviceline_data[i].WiproPracticeId,
    }
  }

  AppendParticularInputDataFun(selectedData, controlName, i) {
    switch (controlName) {
      case 'SlBdmValue': { this.serviceline_data[i].slbdmArrayForLookUp = [] }
    }

    if (selectedData) {
      if (selectedData.length > 0) {
        selectedData.forEach(data => {
          this.IdentifyAppendFunc[controlName](data, i)
        });
      }
    }
  }

  IdentifyAppendFunc = {
    'SlBdmValue': (data, i) => { this.appendslbdm(data, i) },
  }
}
