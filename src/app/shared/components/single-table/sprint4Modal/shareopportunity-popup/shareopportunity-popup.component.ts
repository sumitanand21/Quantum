import { Component, OnInit ,Inject} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material';
import { OpportunitiesService,DataCommunicationService, linkedLeadNames, linkedLeadsHeaders } from '@app/core';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { EncrDecrService } from '@app/core/services/encr-decr.service';

@Component({
  selector: 'app-shareopportunity-popup',
  templateUrl: './shareopportunity-popup.component.html',
  styleUrls: ['./shareopportunity-popup.component.scss']
})
export class ShareopportunityPopupComponent implements OnInit {
 
   /******************Link leads  autocomplete code start ****************** */
   leadslinkedContact=[];
   arrowkeyLocation:number=0;
   templateId=''
   shareData;
   meetingValueCheck:string='';
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
          "Searchtext": x.objectRowData.searchKey ? x.objectRowData.searchKey : '',
          "pagesize": this.lookupdata.recordCount,

          "RequestedPageNumber": x.currentPage,
          "OdatanextLink": this.lookupdata.nextLink

        }



        this.allopportunities.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: dialogData }).subscribe(res => {
          // this.lookupdata.tabledata = res.ResponseObject+this.lookupdata.tabledata
          this.lookupdata.isLoader = false
          this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject)

          this.lookupdata.nextLink = res.OdatanextLink
          this.lookupdata.TotalRecordCount = res.TotalRecordCount

        })

      } else if (x.action == 'search') {
        this.lookupdata.nextLink = ''
        let dialogData = {

          "Id": this.allopportunities.getSession('accountid'),
          "Searchtext": x.objectRowData.searchKey ? x.objectRowData.searchKey : '',
          "pagesize": this.lookupdata.recordCount,

          "RequestedPageNumber": x.currentPage,
          "OdatanextLink": this.lookupdata.nextLink


        }

        this.allopportunities.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: dialogData }).subscribe(res => {
          this.lookupdata.isLoader = false
          this.lookupdata.tabledata = res.ResponseObject
          this.lookupdata.nextLink = res.OdatanextLink
          this.lookupdata.TotalRecordCount = res.TotalRecordCount


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

deleteUser(i){
this.selectedleadslinked.splice(i,1);

}

    appendleadslinked(item) {


    if (!(this.selectedleadslinked.some(it => it.ownerId == item.ownerId))) {

      this.userName = item.FullName;
      this.selectedleadslinked.push({
        'FullName': item.FullName,
        'ownerId': item.ownerId,
        'Email':item.Email

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
  let body=
  {
    "SearchText": this.userName ? this.userName : '',
     "SearchType":6,
     "PageSize":10,
     "RequestedPageNumber":1,
     "OdatanextLink":this.lookupdata.nextLink

}
   this.allopportunities.getAssignSearchData(body).subscribe(response => {
      if( !response.IsError){

    if (response.ResponseObject && (Array.isArray(response.ResponseObject)?response.ResponseObject.length>0:false) ){
      this.leadslinkedContact = response.ResponseObject
   }
   else{
   }
      }
   else{
     this.allopportunities.displayMessageerror(response.Message);   
   }  
  },
       err => {
    this.allopportunities.displayerror(err.status);
  }
  );
  }
   leadContact: {}[] = [
     { index: 0, contact: 'Lead name 01', initials: 'SL', value: true, designation:'Delivery manager' },
    { index: 1, contact: 'Lead name 02', initials: 'SL', value: false, designation:'Delivery manager' },
     { index: 2, contact: 'Lead name 03', initials: 'SL', value: false, designation:'Delivery manager' },
     { index: 3, contact: 'Lead name 04', initials: 'SL', value: false, designation:'Delivery manager' },
   ]
 
 
   /****************** Link leads  autocomplete code end ****************** */

  constructor( private EncrDecr: EncrDecrService, public allopportunities:OpportunitiesService, public service: DataCommunicationService,
   public dialogRef: MatDialogRef<ShareopportunityPopupComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,) { 
debugger;
    this.templateId = data.templateId?data.templateId:''
    this.shareData = data;
      console.log(data);
    }

  ngOnInit() {
  }

  share(){
    debugger;
   var shareArray=[]
   if(this.selectedleadslinked.length>0){
    for( var i=0; i < this.selectedleadslinked.length  ; i++ ){

      for( var j=0; j < this.shareData.data.length  ; j++ ){
          
     shareArray.push(
         {
       "UserId": this.selectedleadslinked[i].ownerId , 
        "TeamTemplate": {
            "EntityLogicalName": "opportunity",   
            "RecordId": this.shareData.data[j].OpportunityId, 
            "Teamtemplateid": this.templateId 
        }
    

        })
      }
    }
    }


     this.allopportunities.shareApi(shareArray).subscribe(response => {
      if( !response.IsError){
       }
  else{
     this.allopportunities.displayMessageerror(response.Message);
  } 
 }
    ,
       err => {
         this.allopportunities.displayerror(err.status);
  }
  );
 

  }

 

}
