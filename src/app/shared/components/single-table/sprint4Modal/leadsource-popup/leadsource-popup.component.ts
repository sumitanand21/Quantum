import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { DataCommunicationService, OpportunitiesService, opportunityAdvnHeaders, opportunityAdvnNames  } from '@app/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';

@Component({
  selector: 'app-leadsource-popup',
  templateUrl: './leadsource-popup.component.html',
  styleUrls: ['./leadsource-popup.component.scss']
})
export class LeadsourcePopupComponent implements OnInit {
  contactlead: string;
  contactleadSwitch: boolean = false;
  selected = 'Lead source details 1';
  leadSourceId = null;
  leadSourceName = '';
  leadSrcDetails = [];
  leadSrcDtlId = null;
  leadSrcDtlName = '';
  leadDetails = '';
  leadDtlId = '';
  leadDetailsList = [];
  linkDtlsDisabled = true;
  showText = false;
  otherComment = '';
  leadType;
  leadDtlErr = false;
  commentErr = false;
  originatingLeadErr = false;
  leadSourceErr = false;
  leadSrcDtlErr = false;
  isSearchLoader = false;
  disabledFlag=false;
  leadDtlObj = { name: 'Name', Id: 'SysGuid' };
  leadSelected: any = { SysGuid: "", Name: "" };
  leadDtlsForLookUp: any = [];
  originatingLeadList = [];
   OriginatingObj = { name: 'LeadName', Id: 'LeadId' };
  selectedOriginatingLead: any = { LeadId: "", LeadName: "" };
  originatingLeadId = '';
  originatingLeadName = '';
  OriginatingleadForLookUp: any = [];

originatingLeadDisabled = true;
otherLeadDisabled = true;


    lookupdata = {
    tabledata: [],
    recordCount: 10,
    headerdata: [],
    Isadvancesearchtabs: false,
    controlName: 'account',
    lookupName: '',
    isCheckboxRequired: false,
    inputValue: '',
    TotalRecordCount: 0,
    nextLink: '',
    selectedRecord: [],
    pageNo: 1,
    isLoader: false
  };
  accountId = '';

  leadSrcDtlDisabled = true;
  constructor(private el: ElementRef,public dialog: MatDialog, public dialogRef: MatDialogRef<LeadsourcePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public service : OpportunitiesService,public globalService:DataCommunicationService) {
      this.leadContact = data.leadSource;
      this.accountId = data.accountId;
      this.disabledFlag=data.disabledFlag;
      console.log(data,"sourceflag");

      if(data.values) {
        this.leadType = data.values.leadType;
        if (this.leadType == 1) {
          this.originatingLeadDisabled = false;
          this.otherLeadDisabled = true;
          this.originatingLeadId=data.values.originatingLeadId;
          this.originatingLeadName=data.values.originatingLeadName;
        }
        else if (this.leadType == 2) {
          this.originatingLeadDisabled = true;
          this.otherLeadDisabled = false;
        }
        this.leadSourceId = data.values.leadSourceId;
        this.leadSourceName = data.values.leadSourceName;
        switch (this.leadSourceId) {
          case 1: this.getLeadSrcDtlsAdvisor();
            break;
          case 2: this.getLeadSrcDtlsAlliance();
          break;
          case 3: this.getLeadSrcDtlsMarketing();
          break;
          case 4: this.getLeadSrcDtlsSL();
          break;
          case 5: this.getLeadSrcDtlsSL();
          break;
        }
       this.leadSrcDtlId = data.values.leadSrcDtlId;
        this.leadSrcDtlName = data.values.leadSrcDtlName;
        this.leadDtlId = data.values.leadDtlId;
        this.leadDetails = data.values.leadDetails;
         switch (this.leadSrcDtlId) {
      case 1: break; 
      case 2: this.linkDtlsDisabled = false; 
        break;
      case 3: this.linkDtlsDisabled = false; 
        break;
      case 4: this.linkDtlsDisabled = false; 
        break;
      case 5: this.showText = true; 
        break;
      case 6: break; 
      case 7: this.linkDtlsDisabled = false; 
        break;
      case 8: this.linkDtlsDisabled = false; 
        break;
    }
        this.otherComment = data.values.comments;
      }
  }
  contactleadclose() {
    this.contactleadSwitch = false;
  }
  radioChange(event)
  {
  var elmnt =  document.getElementById("scrollDiv");
  elmnt.scrollIntoView();
  }
  appendlead(value: string, i) {
    this.contactlead = value;
  }
  leadContact= []
  // leadContact: {}[] = [
  //   { index: 0, contact: 'Lead name 01', initials: 'SL', value: true, designation:'Delivery manager' },
  //   { index: 1, contact: 'Lead name 02', initials: 'SL', value: false, designation:'Delivery manager' },
  //   { index: 2, contact: 'Lead name 03', initials: 'SL', value: false, designation:'Delivery manager' },
  //   { index: 3, contact: 'Lead name 04', initials: 'SL', value: false, designation:'Delivery manager' },
  // ]
 
  ngOnInit() {
  }
  scrolltoend()
  {
    setTimeout( () => { 
      var elmnt =  document.getElementById("scrollDiv1");
      elmnt.scrollIntoView() ;
     }, 300 );
  }
  leadSourceSelected() {
    // this.leadSourceId = item.Id;
    this.leadSrcDtlId = null;
    this.leadSrcDtlName = '';
    this.linkDtlsDisabled = true;
    this.leadDetails = '';
    this.leadDtlId = '';
    this.leadDtlsForLookUp = [];
    this.leadSelected = { SysGuid: "", Name: "" };
    this.showText = false;
    this.otherComment = '';
    this.leadDtlErr = false;
      this.commentErr = false;
    this.leadSourceErr = false;
    this.leadSrcDtlErr = false;
    
    switch (this.leadSourceId.toString()) {
      case "1": this.getLeadSrcDtlsAdvisor();
        return;
      case "2": this.getLeadSrcDtlsAlliance();
        return;
      case '3': this.getLeadSrcDtlsMarketing();
        return;
      case "4": this.getLeadSrcDtlsSL();
        return;
      case "5": this.getLeadSrcDtlsSL();
        return;
    }

  }


  leadSourceDtlSelected() {
    // this.leadSrcDtlId = item.Id;
    this.leadDtlId = '';
    this.linkDtlsDisabled = true;
    this.leadDetails = '';
    this.leadDtlsForLookUp = [];
    this.leadSelected = { SysGuid: "", Name: "" };
    this.showText = false;
    this.otherComment = '';
    this.leadDtlErr = false;
    this.commentErr = false;
    this.leadSourceErr = false;
    this.leadSrcDtlErr = false;
    var elmnt =  document.getElementById("scrollDiv");
    elmnt.scrollIntoView();
   
    switch (this.leadSrcDtlId.toString()) {
      case "1": return; // account interlock
      case "2": this.linkDtlsDisabled = false; // alliance/partner
                this.getLeadSrcDetails('','INITIAL');
        return;
      case "3": this.linkDtlsDisabled = false; //campaign
      this.getCampaignData('','INITIAL');
      return;
      case "4": this.linkDtlsDisabled = false; //events
      this.getEventData('','INITIAL');
        return;
      case "5": this.showText = true; //others
        return;
      case "6": return; //web
      case "7": this.linkDtlsDisabled = false; //analyst
                this.getLeadSrcDetails('','INITIAL');
        return;
      case "8": this.linkDtlsDisabled = false; //advisor 
                this.getLeadSrcDetails('','INITIAL');
        return;
    }
  }

searchType = null;
getLeadSrcDetails(data,type?) {
   let searchText = data.searchValue ? data.searchValue : '';

    switch (this.leadSrcDtlId.toString()) {
      case "2": this.searchType = 6;
      this.getAdvAccountLookup(6,searchText,type);
        return;
      case "7": this.searchType = 10;
      this.getAdvAccountLookup(10,searchText,type);
        return;
      case "8": this.searchType = 7;
      this.getAdvAccountLookup(7,searchText,type);
        return;
    }

}

  getLeadSrcDtlsAdvisor() {
    this.service.getLeadSrcDtlsAdvisor().subscribe(res => {
      if (!res.IsError) {
        this.leadSrcDetails = res.ResponseObject;
        if(this.leadSrcDetails.length == 1) {
          this.leadSrcDtlId = this.leadSrcDetails[0].Id;
          this.leadSrcDtlName = this.leadSrcDetails[0].Name;
          this.linkDtlsDisabled = false;
          this.leadSrcDtlDisabled = true;
        }

      }
      else {
        this.leadSrcDetails = [];
        this.service.displayMessageerror(res.Message);
      }
    }, (err) => {
      this.leadSrcDetails = [];
      this.service.displayerror(err.status);
    })
  }

  getLeadSrcDtlsAlliance() {
    this.service.getLeadSrcDtlsAlliance().subscribe(res => {
      if (!res.IsError) {
        this.leadSrcDtlDisabled = false;
        this.leadSrcDetails = res.ResponseObject;
      }
      else {
        this.leadSrcDetails = [];
        this.service.displayMessageerror(res.Message);
      }
    }, (err) => {
      this.leadSrcDetails = [];
      this.service.displayerror(err.status);
    })
  }

getLeadSrcDtlsSL() {
    this.service.getLeadSrcDtlsSL().subscribe(res => {
      if (!res.IsError) {
        this.leadSrcDtlDisabled = false;
        this.leadSrcDetails = res.ResponseObject;
      }
      else {
        this.leadSrcDetails = [];
        this.service.displayMessageerror(res.Message);
      }
    }, (err) => {
      this.leadSrcDetails = [];
      this.service.displayerror(err.status);
    })
  }

  getLeadSrcDtlsMarketing() {
    this.service.getLeadSrcDtlsMarketing().subscribe(res => {
      if (!res.IsError) {
        this.leadSrcDtlDisabled = false;
        this.leadSrcDetails = res.ResponseObject;
      }
      else {
        this.leadSrcDetails = [];
        this.service.displayMessageerror(res.Message);
      }
    }, (err) => {
      this.leadSrcDetails = [];
      this.service.displayerror(err.status);
    })
  }
 getCampaignData(data,type?) {
   let searchText = data.searchValue ? data.searchValue : '';
   let obj = {
    "AccountId": this.accountId,
      "SearchText": searchText,
      "PageSize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": null
    }
        this.service.getCampaignData(obj).subscribe(res => {
      if (!res.IsError) {
        this.leadDetailsList = res.ResponseObject;
        if(this.leadDetailsList.length == 1 && type == 'INITIAL') {
          this.selectCampaign(this.leadDetailsList[0]);
        }
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        this.lookupdata.nextLink = res.OdatanextLink;
      }
      else {
        this.leadDetailsList = [];
        this.service.displayMessageerror(res.Message);
      }
    }, (err) => {
      this.leadDetailsList = [];
      this.service.displayerror(err.status);
    })
 }

 getEventData(data,type?) {
   let searchText = data.searchValue ? data.searchValue : '';
   let obj = {
      "AccountId": this.accountId,
      "SearchText": searchText,
      "PageSize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": null
    }
      this.service.getEventData(obj).subscribe(res => {
      if (!res.IsError) {
        this.leadDetailsList = res.ResponseObject;
        if(this.leadDetailsList.length == 1 && type == 'INITIAL') {
          this.selectCampaign(this.leadDetailsList[0]);
        }
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        this.lookupdata.nextLink = res.OdatanextLink;
      }
      else {
        this.leadDetailsList = [];
        this.service.displayMessageerror(res.Message);
      }
    }, (err) => {
      this.leadDetailsList = [];
      this.service.displayerror(err.status);
    })
 }

  getAdvAccountLookup(type,searchText,initialSelect?) {
    let obj = {
      "SearchType": type,
      "SearchText": searchText,
      "PageSize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": null
    }
    this.service.getAdvAccountLookup(obj).subscribe(res => {
      if (!res.IsError) {
        this.leadDetailsList = res.ResponseObject;
        this.leadDetailsList.forEach(x => {
          (x.Name) ? x.Name = this.getSymbol(x.Name) : '-';
        })
        if(initialSelect == 'INITIAL' && this.leadDetailsList.length == 1) {
          this.selectLeadDetails(this.leadDetailsList[0]);
        }
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        this.lookupdata.nextLink = res.OdatanextLink;
      }
      else {
        this.leadDetailsList = [];
        this.service.displayMessageerror(res.Message);
      }
    }, (err) => {
      this.leadDetailsList = [];
      this.service.displayerror(err.status);
    })
  }

  getOriginatingLead(data,type?) {
    let searchText = data.searchValue ? data.searchValue : '';
    let obj = {
      "AccountId": this.accountId,
      "SearchText": searchText,
      "PageSize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": null
    }

    this.service.getOriginatingLead(obj).subscribe(res => {
      if (!res.IsError) {
        this.originatingLeadList = res.ResponseObject;
        this.originatingLeadList.map(item => {
          item.Name = item.LeadName;
          item.Id = item.LeadId;
        })
        if(this.originatingLeadList.length == 1 && type == 'INITIAL') {
          this.selectOriginatingLead(this.originatingLeadList[0]);
        }
        this.lookupdata.TotalRecordCount = res.TotalRecordCount;
        this.lookupdata.nextLink = res.OdatanextLink;
      }
      else {
        this.originatingLeadList = [];
        this.service.displayMessageerror(res.Message);
      }
    }, (err) => {
      this.originatingLeadList = [];
      this.service.displayerror(err.status);
    })
  }
   advanceLookUpSearch(lookUpData) {
    debugger;
    console.log(lookUpData);
    let labelName = lookUpData.labelName;
    switch (labelName) {
      case 'Lead details': {
        this.leadSelected = lookUpData.selectedData;
        this.openadvancetabs('leaddetails', this.leadDetailsList, lookUpData.inputVal);
        return
      }
      case 'campaign': {
        this.leadSelected = lookUpData.selectedData;
        this.openadvancetabs('campaign', this.leadDetailsList, lookUpData.inputVal);
        return
      }
      case 'event': {
        this.leadSelected = lookUpData.selectedData;
        this.openadvancetabs('event', this.leadDetailsList, lookUpData.inputVal);
        return
      }
     case 'OriginatingLead' : {
        this.selectedOriginatingLead = lookUpData.selectedData;
        this.openadvancetabs('OriginatingLead', this.originatingLeadList, lookUpData.inputVal);
        return
      }

    }
  }

  selectedLookupData(controlName) {
    switch (controlName) {
      case 'leaddetails': {
        return (this.leadDtlsForLookUp && this.leadDtlsForLookUp.length > 0) ? this.leadDtlsForLookUp : []
      }
      case 'campaign': {
        return (this.leadDtlsForLookUp && this.leadDtlsForLookUp.length > 0) ? this.leadDtlsForLookUp : []
      }
      case 'event': {
        return (this.leadDtlsForLookUp && this.leadDtlsForLookUp.length > 0) ? this.leadDtlsForLookUp : []
      }
      case 'OriginatingLead' : {
        return (this.OriginatingleadForLookUp && this.OriginatingleadForLookUp.length > 0) ? this.OriginatingleadForLookUp : []
      }      
    }
  }

   openadvancetabs(controlName, initalLookupData, value): void {
    debugger
    this.lookupdata.controlName = controlName
    this.lookupdata.headerdata = opportunityAdvnHeaders[controlName]
    this.lookupdata.lookupName = opportunityAdvnNames[controlName]['name']
    this.lookupdata.isCheckboxRequired = opportunityAdvnNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = opportunityAdvnNames[controlName]['isAccount']
    this.lookupdata.inputValue = value;
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.service.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
      this.lookupdata.tabledata = res
    })

    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.globalService.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });

    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
      debugger;
      console.log(x, "data");
      if (x.action == 'loadMore') {
        let dialogData = {
          SearchText: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
          recordCount: this.lookupdata.recordCount,
          OdatanextLink: this.lookupdata.nextLink,
          pageNo: x.currentPage,
          RequestedPageNumber: x.currentPage
        }

        this.service.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(), ...dialogData } }).subscribe(res => {
          this.lookupdata.isLoader = false;
          this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
          this.lookupdata.pageNo = res.CurrentPageNumber;
          this.lookupdata.nextLink = res.OdatanextLink;
          this.lookupdata.recordCount = res.PageSize;
        })

      } else if (x.action == 'search') {

        this.lookupdata.tabledata = []
        this.lookupdata.nextLink = ''
        this.lookupdata.pageNo = 1

        let dialogData = {
          SearchText: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
          recordCount: this.lookupdata.recordCount,
          OdatanextLink: this.lookupdata.nextLink,
          pageNo: x.currentPage,
          RequestedPageNumber: x.currentPage
        }

        this.service.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: { ...this.getCommonData(), ...dialogData } }).subscribe(res => {
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
        switch(controlName) {
          case 'leaddetails' :  this.leadDtlsForLookUp = [];
                                this.selectLeadDetails(result.selectedData[0]);
                                return;
          case 'campaign' : this.leadDtlsForLookUp = [];
                                this.selectCampaign(result.selectedData[0]);
                                return;
           case 'event' : this.leadDtlsForLookUp = [];
                                this.selectCampaign(result.selectedData[0]);
                                return;
          case 'OriginatingLead' : this.OriginatingleadForLookUp = [];
                                this.selectOriginatingLead(result.selectedData[0]);
                                return;
        }
      }
    });
  }
 getCommonData() {
   return {
     searchType : this.searchType,
     accountId : this.accountId
   }
 }
  selectLeadDetails(item) {
    this.leadDtlsForLookUp = [];
    this.leadSelected = Object.keys(item).length ? item : { SysGuid: "", Name: "" };
    if (item && typeof item === 'object' && Object.keys(item).length) {
      this.leadSelected.Id = this.leadSelected.SysGuid;
      this.leadDtlId = item.SysGuid;
    this.leadDetails = item.Name;
    }
    else {
      this.leadDetails = "";
      this.leadDtlId = "";
    }
    if (Object.keys(item).length) {
      this.leadDtlsForLookUp.push(this.leadSelected);
      this.leadDtlErr = false;
    }
  }

  selectCampaign(item) {
    this.leadDtlsForLookUp = [];
    this.leadSelected = Object.keys(item).length ? item : { SysGuid: "", Name: "" };
    if (item && typeof item === 'object' && Object.keys(item).length) {
      this.leadSelected.Id = this.leadSelected.SysGuid;
      this.leadDtlId = item.CampaignId;
      this.leadDetails = item.Name;
    }
    else {
      this.leadDetails = "";
      this.leadDtlId = "";
    }
    if (Object.keys(item).length) {
      this.leadDtlsForLookUp.push(this.leadSelected);
      this.leadDtlErr = false;
    }
  }
selectOriginatingLead(item) {
    this.OriginatingleadForLookUp = [];
    this.selectedOriginatingLead = Object.keys(item).length ? item : { LeadId: "", LeadName: "" };
    if (item && typeof item === 'object' && Object.keys(item).length) {
      this.selectedOriginatingLead.Id = this.selectedOriginatingLead.SysGuid;
      this.originatingLeadId = item.LeadId;
    this.originatingLeadName = item.LeadName;
    }
    else {
      this.originatingLeadName = "";
      this.originatingLeadId = "";
    }
    if (Object.keys(item).length) {
      this.OriginatingleadForLookUp.push(this.selectedOriginatingLead);
    }
}

  onSave() {
    if(!this.leadType) {
      this.service.displayMessageerror('Select lead type');
    }
    else if(this.leadType == 1 && !this.originatingLeadId) {
      this.originatingLeadErr = true;
      this.service.displayMessageerror('Select lead details');
    }
    else if(this.leadType == 2 && !this.leadSourceId) {
      this.leadSourceErr = true;
      this.service.displayMessageerror('Select lead source');
    }
    else if(this.leadType == 2 && !this.leadSrcDtlId) {
      this.leadSrcDtlErr = true;
      this.service.displayMessageerror('Select lead source detail');
    }
    else {
      if(!this.linkDtlsDisabled && (this.leadDtlId == '' || this.leadDtlId == undefined) ) {
      this.leadDtlErr = true;
      this.service.displayMessageerror('Select lead details');
    }
    else if(this.showText && (this.otherComment == '' || this.otherComment.replace(/\s/g, "").length == 0) ) {
      this.commentErr = true;
      this.service.displayMessageerror('Enter comments');
    }
    else { 
      this.leadDtlErr = false;
      this.commentErr = false;
      this.originatingLeadErr = false;
      this.leadSourceErr = false;
      this.leadSrcDtlErr = false;
      let obj = {
        leadType : this.leadType,
        leadSourceId : this.leadSourceId,
        leadSourceName : this.leadSourceName,
        leadSrcDtlId : this.leadSrcDtlId,
        leadSrcDtlName : this.leadSrcDtlName,
        leadDtlId : this.leadDtlId,
        leadDetails : this.leadDetails,
        comments : this.otherComment,
        originatingLeadId : this.originatingLeadId,
        originatingLeadName : this.originatingLeadName
      }
  
      this.dialogRef.close(obj);
    }
    }
    
    
  }

  leadDetailsClicked() {
    this.contactleadSwitch = true;
  }

  leadTypeChanged(event) {
    console.log("leadTypeChanged",event);
    console.log("leadType",this.leadType);
    if(event.value == 1) {
      this.originatingLeadDisabled = false;
      this.otherLeadDisabled = true;
      this.getOriginatingLead('','INITIAL');
    }
    else if(event.value == 2) {
      this.originatingLeadDisabled = true;
      this.otherLeadDisabled = false;
      let invalidElements = this.el.nativeElement.querySelectorAll('div.scrollHere');
    if (invalidElements.length > 0) {
      this.scrollTo(invalidElements[0]);
    }
    }
    this.leadSourceId = null;
  this.leadSourceName = '';
  this.leadSrcDetails = [];
  this.leadSrcDtlId = null;
  this.leadSrcDtlName = '';
    this.leadDetails = '';
    this.leadDtlsForLookUp = [];
    this.leadSelected = { SysGuid: "", Name: "" };
  this.leadDtlId = '';
  this.leadSrcDtlDisabled = true;
  this.linkDtlsDisabled = true;
  this.showText = false;
  this.otherComment = '';
  this.leadDtlErr = false;
  this.commentErr = false;
  this.originatingLeadErr = false;
this.leadSourceErr = false;
this.leadSrcDtlErr = false;
  this.originatingLeadId = '';
  this.originatingLeadName = '';
  this.leadDtlsForLookUp = [];
  this.OriginatingleadForLookUp = [];
  this.leadSelected = { SysGuid: "", Name: "" };
  this.selectedOriginatingLead = { LeadId: "", LeadName: "" };
  }

  scrollTo(el: HTMLElement) {
    if (el) {
      window.scroll({
        behavior: 'smooth',
        left: 0,
        top: el.getBoundingClientRect().top + window.scrollY - 150
      })
      setTimeout(() => {
        el.focus();
      }, 1000);
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
}
