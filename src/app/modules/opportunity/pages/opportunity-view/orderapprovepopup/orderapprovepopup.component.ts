import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FileUploader } from 'ng2-file-upload';
import { OrderService, OpportunitiesService, DataCommunicationService } from '@app/core/services';
import { FileUpload } from './../tabs/order/orderenum'
const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';


@Component({
  selector: 'app-orderapprovepopup',
  templateUrl: './orderapprovepopup.component.html',
  styleUrls: ['./orderapprovepopup.component.scss']
})
export class OrderapprovepopupComponent implements OnInit {
  mainPop = true;
  searchrecord: string;
  SearchRecordSwitch: boolean = true;
  ApproveMinDate = new Date(1945, 0, 1);

  constructor(public orderService: OrderService, public opportunitiesService: OpportunitiesService,
    public service: DataCommunicationService, public dialogRef: MatDialogRef<OrderapprovepopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  SearchRecordClose() {

    this.SearchRecordSwitch = false;

  }

  appendSearchRecord(value: string, i) {

    this.searchrecord = value;
    this.selectedsearchrecord.push(this.searchContact[i])
  }

  searchContact: {}[] = [

    { index: 0, contact: 'Jac Liu', initials: 'JL', value: true },
    { index: 1, contact: 'Kanika Tuteja', initials: 'KT', value: false },
    { index: 2, contact: 'Rita Ora', initials: 'RO', value: false },
    { index: 3, contact: 'Bill Smith', initials: 'BS', value: false },
  ]

  selectedsearchrecord: {}[] = [];

  ngOnInit() {
    this.mainPop = true;
    console.log("popup data", this.data)
    this.getExceptionalData();
    this.getApprovalDocData();
    this.getCountryDetails();
    // this.searchLocation();
  }



  uploadSupprotMailFlag: boolean = false;
  selectedExpansion: any;
  approvalComment = '';


  // file upload starts

  fileUploadQueue: any = [];
  public uploader: FileUploader = new FileUploader({ url: URL });
  fileUploadedArr = []

  public fileOverBase(e: any): void {
    this.service.loaderhome = true;
    var file = this.uploader.queue;
    this.fileUploadQueue = file[file.length - 1];
    this.orderService.uploadNote(this.fileUploadQueue.file.rawFile).then((res: any) => {
      this.service.loaderhome = false;
      this.fileUploadQueue['url'] = res;
      const fileObj = {
        docName: this.fileUploadQueue.file.name,
        link: this.fileUploadQueue['url'],
        uniqueKey: FileUpload.BFMApproval
      }
      this.fileUploadedArr.push(fileObj)
      console.log("url res is", this.fileUploadedArr);
      this.opportunitiesService.displayMessageerror("File uploaded successfully")
    })
      .catch((err) => {
        this.service.loaderhome = false;;
        console.log(err);
        this.opportunitiesService.displayMessageerror(err.status)
      });
  }

  // file upload ends

  // Exceptional Dropdown
  exceptionalData = [];
  approvalDocData = [];
  selectedExceptionData = 184450000;
  selectedapprovalDocData = '';

  getExceptionalData() {
    this.orderService.getExceptionaApproval().subscribe((res: any) => {
      console.log("exceptioan dropdown", res.ResponseObject);
      this.exceptionalData = res.ResponseObject;

    })
  }

  exceptionApprovalChange(evnt) {
    console.log("evt", evnt);
    this.selectedExceptionData = evnt;
    if (evnt == 184450001) {
      this.uploadSupprotMailFlag = true;
    }
    else {
      this.uploadSupprotMailFlag = false;
    }

  }

  // Approval Dropdown
  getApprovalDocData() {
    this.orderService.getApprovalDoc().subscribe((res: any) => {
      console.log("Approval doc dropdown", res.ResponseObject);
      this.approvalDocData = res.ResponseObject;
    })
  }

  changeApprovalDoc(evnt) {
    console.log("evt", evnt);
    this.selectedapprovalDocData = evnt;
  }

  // MSA start date

  MSAstartDate = '';
  MSAendDate = '';
  MSAnumber = ''
  minMSAEnd: Date;
  selecteStartDate(evnt) {
    console.log("MSA start date", evnt._d.toISOString());
    this.MSAstartDate = evnt._d.toISOString();
    this.minMSAEnd = new Date(this.MSAstartDate)
    
  }

  selecteEndDate(evnt) {
    console.log("MSA end date", evnt._d);
    this.MSAendDate = evnt._d.toISOString();
  }


  // Location API's

  countriesArr = [];
  citiesArr = [];
  plantsArr = [];
  locationArr = [];
  selectedCountry: any;
  selectedCity: any;
  selectedPlant: any;
  selectedLocation: any;
  allLocations = [];
  Location = "";

  cityDisabled = true;
  plantDisabled = true;
  locationDisabled = true

  getCountryDetails() {
    let payload = {
      OrderId: this.data.OrderId
    }
    this.orderService.getApprovalCountry(payload).subscribe((res: any) => {
      console.log(res.ResponseObject);
      this.countriesArr = res.ResponseObject;
    });
  }

  changeCountry(evnt) {
    this.selectedCountry = evnt;
    console.log("country", evnt);
    this.cityDisabled = false;
    this.selectedCity = "";
    this.selectedPlant = "";
    this.selectedLocation = "";
    this.getCityDetails(this.selectedCountry);
    this.searchLocation();
  }

  getCityDetails(selCountry) {
    let payload = {
      OrderId: this.data.OrderId,
      CountryCode: selCountry
    }
    this.orderService.getApprovalCity(payload).subscribe((res: any) => {
      console.log("city details", res.ResponseObject);
      this.citiesArr = res.ResponseObject
    });
  }

  changeCity(evnt) {
    this.selectedCity = evnt;
    this.plantDisabled = false;
    this.selectedPlant = "";
    this.selectedLocation = "";
    this.getPlantDetails(this.selectedCity);
    this.searchLocation();
  }

  getPlantDetails(cityCode) {
    let payload = {
      OrderId: this.data.OrderId,
      CityCode: cityCode
    }
    this.orderService.getApprovalPlant(payload).subscribe((res: any) => {
      console.log(res.ResponseObject);
      this.plantsArr = res.ResponseObject
    });
  }

  changePlant(evnt) {
    this.selectedPlant = evnt;
    this.locationDisabled = false;
    this.selectedLocation = "";
    this.getLocationDetails(this.selectedPlant);
    this.searchLocation();
  }

  getLocationDetails(plant) {
    let payload = {
      OrderId: this.data.OrderId,
      PlantCode: plant
    }
    this.orderService.getApprovalLocation(payload).subscribe((res: any) => {
      console.log(res.ResponseObject);
      this.locationArr = res.ResponseObject
    });
  }

  changeLocation(evnt) {
    this.selectedLocation = evnt;
    this.searchLocation();
  }

  searchLocation() {
    let payload = {
      OrderId: this.data.OrderId,
      CountryCode: this.selectedCountry ? this.selectedCountry : '',
      CityCode: this.selectedCity ? this.selectedCity : '',
      PlantCode: this.selectedPlant ? this.selectedPlant : '',
      LocationCode: this.selectedLocation ? this.selectedLocation : ''
    }

    this.orderService.getLocationsbySeach(payload).subscribe((res: any) => {
      console.log("All locations", res.ResponseObject);
      this.allLocations = res.ResponseObject;
    })
  }
  selectedIcon: any;

  selectedData(evnt, data) {
    console.log("radio", data, evnt);
    this.selectedIcon = data
  }

  selectFinalLocation() {
    console.log("sel data", this.selectedIcon)
    this.mainPop = true;
    this.Location = this.selectedIcon ? this.selectedIcon.CountryCode + '-->' + this.selectedIcon.CityCode + '-->' + this.selectedIcon.PlantCode + '-->' + this.selectedIcon.LocationCode : this.otherLocation;
    console.log("loc", this.Location);
  }

  // Other Location

  otherLocation: any;
  disableOtherLoc: boolean = true;

  disabledDropdown: boolean = false;

  selectOtherLoc(evnt) {
    console.log("other", evnt)
    if (evnt.checked == true) {
      this.disableOtherLoc = false;
      this.disabledDropdown = true
    }
    else {
      this.disableOtherLoc = true;
      this.disabledDropdown = false;
    }
  }

  onClose(flag) {
    let returnObj = {
      flag: flag,
      ExceptionApproval: this.selectedExceptionData,
      ApprovalDoc: this.selectedapprovalDocData,
      MSANumber: this.MSAnumber,
      MSAStartDate: this.MSAstartDate,
      MSAEndDate: this.MSAendDate,
      UploadDocs: this.fileUploadedArr,
      location: this.Location,
      reason: this.approvalComment
    }
    // this.dialogRef.close(returnObj);
    console.log("return obj", returnObj);
    if(new Date(this.MSAendDate) < new Date(this.MSAstartDate)){
      this.opportunitiesService.displayMessageerror("MSA start date should be an earlier date than MSA end date");
      return;
    }
    if (this.selectedExceptionData.toString() == '' || this.selectedExceptionData == null || this.selectedExceptionData == undefined) {
      this.opportunitiesService.displayMessageerror("Expansion approval is mandatory");
    }
    else if (this.selectedExceptionData && this.selectedExceptionData.toString() == '184450001' && this.fileUploadedArr.length == 0) {
      // if (this.fileUploadedArr.length == 0) {
      this.opportunitiesService.displayMessageerror("Upload supporting document is mandatory");
      // }
    }
    else if (this.selectedapprovalDocData == '' || this.selectedapprovalDocData == null || this.selectedapprovalDocData == undefined) {
      this.opportunitiesService.displayMessageerror("Approval doc is mandatory");
    }
    else if (this.MSAnumber == '' || this.MSAnumber == null || this.MSAnumber == undefined) {
      this.opportunitiesService.displayMessageerror("MSA number is mandatory");
    }
    else if (this.MSAstartDate == '' || this.MSAstartDate == null || this.MSAstartDate == undefined) {
      this.opportunitiesService.displayMessageerror("MSA start date is mandatory");
    }
    else if (this.MSAendDate == '' || this.MSAendDate == null || this.MSAendDate == undefined) {
      this.opportunitiesService.displayMessageerror("MSA end date is mandatory");
    }
    else if (this.data.BFMApprComment == true) {
      if (this.approvalComment == '' || this.approvalComment == null || this.approvalComment == undefined) {
        this.opportunitiesService.displayMessageerror("Approval comment is mandatory");
      }
      else {
        this.dialogRef.close(returnObj)
      }
    }
    else {
      this.dialogRef.close(returnObj);
    }
    // this.dialogRef.close(returnObj);
    console.log("return obj", returnObj)
  }


}
