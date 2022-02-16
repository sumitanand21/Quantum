


import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material';
import { OpportunitiesService, DataCommunicationService, linkedLeadNames, linkedLeadsHeaders } from '@app/core';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { EncrDecrService } from '@app/core/services/encr-decr.service';

@Component({
  selector: 'app-share-popup',
  templateUrl: './share-popup.component.html',
  styleUrls: ['./share-popup.component.scss']
})
export class SharePopupComponent implements OnInit {

  /******************Link leads  autocomplete code start ****************** */
  leadslinkedContact = [];
  arrowkeyLocation: number = 0;
  templateId: any = ''
  accountTemplateId:any=''
  shareData;
  meetingValueCheck: string = '';
  selectedleadslinked: any = [];
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
    nextLink: '',
    pageNo: 1,
    isLoader: false
  };
  showlead: boolean = false;
  userName: string;
  contactleadSwitch: boolean = false;
  isOrder: any;
  contactleadclose() {
    this.contactleadSwitch = false;
  }



  selectedLookupData(controlName) {
    switch (controlName) {
      case 'shareAssign': {
        return (this.selectedleadslinked.length > 0) ? this.selectedleadslinked : []

      }

    }
  }
  openadvancetabs(controlName, initalLookupData, value): void {


    this.lookupdata.controlName = controlName
    this.lookupdata.headerdata = linkedLeadsHeaders[controlName]
    this.lookupdata.lookupName = linkedLeadNames[controlName]['name']
    this.lookupdata.isCheckboxRequired = linkedLeadNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = linkedLeadNames[controlName]['isAccount']
    this.lookupdata.inputValue = value ? value : '';
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    // this.lookupdata.tabledata = []
    this.allopportunities.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
      this.lookupdata.tabledata = res

    })

    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.service.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });

    dialogRef.componentInstance.modelEmiter.subscribe((x) => {

      debugger

      //console.log(x)
      if (x.action == 'loadMore') {

        let dialogData = {

          "Id": this.allopportunities.getSession('accountid'),
          "SearchText": x.objectRowData.searchKey ? x.objectRowData.searchKey : '',
          "pagesize": this.lookupdata.recordCount,

          "RequestedPageNumber": x.currentPage,
          "OdatanextLink": this.lookupdata.nextLink

        }



        this.allopportunities.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: dialogData }).subscribe(res => {
          // this.lookupdata.tabledata = res.ResponseObject+this.lookupdata.tabledata
          this.lookupdata.isLoader = false
          this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject)
          this.lookupdata.tabledata = this.lookupdata.tabledata.filter((it) => it.ownerId !=
            this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'))
          this.lookupdata.nextLink = res.OdatanextLink

          var filterOwner = res.ResponseObject.filter((it) => it.ownerId ==
            this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'))

          this.lookupdata.TotalRecordCount = filterOwner.length > 0 ? res.TotalRecordCount - 1 : res.TotalRecordCount
          // this.lookupdata.TotalRecordCount = res.TotalRecordCount

        })

      } else if (x.action == 'search') {
        this.lookupdata.nextLink = ''
        let dialogData = {

          "Id": this.allopportunities.getSession('accountid'),
          "SearchText": x.objectRowData.searchKey ? x.objectRowData.searchKey : '',
          "pagesize": this.lookupdata.recordCount,

          "RequestedPageNumber": x.currentPage,
          "OdatanextLink": this.lookupdata.nextLink


        }

        this.allopportunities.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: dialogData }).subscribe(res => {
          this.lookupdata.isLoader = false
          this.lookupdata.tabledata = res.ResponseObject
          this.lookupdata.tabledata = res.ResponseObject.filter((it) => it.ownerId !=
            this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'))
          this.lookupdata.nextLink = res.OdatanextLink
          var filterOwner = res.ResponseObject.filter((it) => it.ownerId ==
            this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'))

          this.lookupdata.TotalRecordCount = filterOwner.length > 0 ? res.TotalRecordCount - 1 : res.TotalRecordCount



        })

      }


    });

    dialogRef.afterClosed().subscribe(result => {
      debugger
      if (result) {
        //console.log(result)
        this.AppendParticularInputFun(result.selectedData, result.controlName)
      }
    });
  }

  AppendParticularInputFun(selectedData, controlName) {
    debugger
    if (selectedData) {
      if (selectedData.length > 0) {

        this.appendleadslinkedData(selectedData);


      }
    }
  }

  appendleadslinkedData(selectedData) {
    this.selectedleadslinked = this.selectedleadslinked.concat(selectedData);
    this.selectedleadslinked = this.selectedleadslinked.map(e => e['Id']).map((e, i, final) => final.indexOf(e) === i && i)
      .filter(e => this.selectedleadslinked[e]).map(e => this.selectedleadslinked[e]);
    //console.log(this.selectedleadslinked)

  }

  deleteUser(i) {
    this.selectedleadslinked.splice(i, 1);

  }

  appendleadslinked(item) {


    if (!(this.selectedleadslinked.some(it => it.ownerId == item.ownerId))) {

      this.userName = item.FullName;
      this.selectedleadslinked.push({
        'FullName': item.FullName,
        'ownerId': item.ownerId,
        'Email': item.Email,
        'Id': item.ownerId

      }
      )
    }
    else {
      this.allopportunities.displayMessageerror('duplicate value exists')

    };

    //console.log(this.selectedleadslinked, 'select');
    this.userName = '';
  }

  userData() {


    let body =
    {
      "SearchText": this.userName ? this.userName : '',
      "SearchType": 6,
      "PageSize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": this.lookupdata.nextLink

    }
    this.allopportunities.getAssignSearchData(body).subscribe(response => {
      if (!response.IsError) {

        if (response.ResponseObject && (Array.isArray(response.ResponseObject) ? response.ResponseObject.length > 0 : false)) {
          this.leadslinkedContact = response.ResponseObject

          this.lookupdata.nextLink = response.OdatanextLink
          this.leadslinkedContact = response.ResponseObject.filter((it) => it.ownerId !=
            this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'))

          var filterOwner = response.ResponseObject.filter((it) => it.ownerId ==
            this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'))

          this.lookupdata.TotalRecordCount = filterOwner.length > 0 ? response.TotalRecordCount - 1 : response.TotalRecordCount
        }
        else {
        }
      }
      else {
        this.allopportunities.displayMessageerror(response.Message);
      }
    },
      err => {
        this.allopportunities.displayerror(err.status);
      }
    );
  }
  leadContact: {}[] = [
    { index: 0, contact: 'Lead name 01', initials: 'SL', value: true, designation: 'Delivery manager' },
    { index: 1, contact: 'Lead name 02', initials: 'SL', value: false, designation: 'Delivery manager' },
    { index: 2, contact: 'Lead name 03', initials: 'SL', value: false, designation: 'Delivery manager' },
    { index: 3, contact: 'Lead name 04', initials: 'SL', value: false, designation: 'Delivery manager' },
  ]


  /****************** Link leads  autocomplete code end ****************** */

  constructor(private EncrDecr: EncrDecrService, public allopportunities: OpportunitiesService, public service: DataCommunicationService,
    public dialogRef: MatDialogRef<SharePopupComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, ) {
    debugger;
    this.templateId = data.templateId ? data.templateId : ''
    this.isOrder = data.isOrder ? data.isOrder : false;
    this.shareData = data;
    this.accountTemplateId = data.accountTemplateId ? data.accountTemplateId : ''
    console.log(data);
  }

  ngOnInit() {
  }

  share() {

    if (this.isOrder) {
    var shareArray = [];

    let accountTemplate;
    let orderTemplate;
    let oppTemplate;

    if (this.isOrder) {
      if (this.templateId) {
        this.templateId.map(res => {
          if (res.ResponseObject) {
            switch (res.ResponseObject.Teamtemplatename) {
              case 'Order (Read)':
                orderTemplate = res.ResponseObject.Teamtemplateid;
                console.log("sautemplate",orderTemplate);
                break;
              case 'Account (Read)':
                accountTemplate = res.ResponseObject.Teamtemplateid;
                break;
              case 'Opportunity (Read)':
                oppTemplate = res.ResponseObject.Teamtemplateid;
                break;
            }
          }
        })
      }
    }

    accountTemplate = accountTemplate ? accountTemplate : '';
    orderTemplate = orderTemplate ? orderTemplate : '';
    oppTemplate = oppTemplate ? oppTemplate : '';

    if (this.selectedleadslinked.length > 0) {
      for (var i = 0; i < this.selectedleadslinked.length; i++) {

        for (var j = 0; j < this.shareData.data.length; j++) {

          if (this.isOrder) {

            shareArray.push(
              {
                "UserId": this.selectedleadslinked[i].ownerId,
                "TeamTemplate": {
                  "EntityLogicalName": "salesorder",
                  "RecordId": this.shareData.data[j].orderBookingId,
                  "Teamtemplateid": orderTemplate
                }
              });

            shareArray.push(
              {
                "UserId": this.selectedleadslinked[i].ownerId,
                "TeamTemplate": {
                  "EntityLogicalName": "account",
                  "RecordId": this.shareData.data[j].AccountID,
                  "Teamtemplateid": accountTemplate
                }
              });

            if (this.shareData.data[j].IdOfOpportunity) {
              shareArray.push(
                {
                  "UserId": this.selectedleadslinked[i].ownerId,
                  "TeamTemplate": {
                    "EntityLogicalName": "opportunity",
                    "RecordId": this.shareData.data[j].IdOfOpportunity,
                    "Teamtemplateid": this.isOrder ? oppTemplate : this.templateId
                  }
                });
            }

            if (this.shareData.data[j].ParentOpportunityId && this.shareData.data[j].IdOfOpportunity != this.shareData.data[j].ParentOpportunityId) {
              shareArray.push(
                {
                  "UserId": this.selectedleadslinked[i].ownerId,
                  "TeamTemplate": {
                    "EntityLogicalName": "opportunity",
                    "RecordId": this.shareData.data[j].ParentOpportunityId,
                    "Teamtemplateid": this.isOrder ? oppTemplate : this.templateId
                  }
                });
            }

          }

          // if (!this.isOrder) {
          //   if (this.shareData.data[j].OpportunityId) {
          //     shareArray.push(
          //       {
          //         "UserId": this.selectedleadslinked[i].ownerId,
          //         "TeamTemplate": {
          //           "EntityLogicalName": "opportunity",
          //           "RecordId": this.shareData.data[j].OpportunityId,
          //           "Teamtemplateid": this.isOrder ? oppTemplate : this.templateId
          //         }
          //       });

          //       shareArray.push(
          //         {
          //           "UserId": this.selectedleadslinked[i].ownerId,
          //           "TeamTemplate": {
          //             "EntityLogicalName": "account",
          //             "RecordId": this.shareData.data[j].AccountId,
          //             "Teamtemplateid": this.accountTemplateId?this.accountTemplateId:''
          //           }
          //         });
          //   }
          // }

        }
      }
    }


    this.allopportunities.shareApi(shareArray).subscribe(response => {
      if (!response.IsError) {
        const Message = this.isOrder ? 'Order' : 'Opportunity'
        this.allopportunities.displayMessageerror(Message + ' shared successfully');

        this.dialogRef.close('success')

      }
      else {
        this.allopportunities.displayMessageerror('Internal server occured');
      }
    }
      ,
      err => {
        this.allopportunities.displayMessageerror('Internal server occured');
      }
    );


  }
else{

  this.shareOpp();
}


}


shareOpp(){


   var shareArray = [];
   if (this.selectedleadslinked.length > 0) {
    for (var i = 0; i < this.selectedleadslinked.length; i++) {

  for (var j = 0; j < this.shareData.data.length; j++) {

   

              shareArray.push(
                {
                  "EntityLogicalName": "opportunity",
                  "RecordId": this.shareData.data[j].OpportunityId,
                  "IsShared": true,
                  "UserID": this.selectedleadslinked[i].ownerId,
                  "AccountId":this.shareData.data[j].AccountId
              })

           
            

  }
}
}

this.allopportunities.shareApii(shareArray).subscribe(response => {
  if (!response.IsError) {
    const Message = this.isOrder ? 'Order' : 'Opportunity'
    this.allopportunities.displayMessageerror(Message + ' shared successfully');

    this.dialogRef.close('success')

  }
  else {
    this.allopportunities.displayMessageerror(response.Message);
  }
}
  ,
  err => {
    this.allopportunities.displayMessageerror('Internal server occured');
  }
);


}


}
