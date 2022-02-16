import { Component, OnInit,Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material';
import { OpportunitiesService,DataCommunicationService, linkedLeadNames, linkedLeadsHeaders } from '@app/core';
import { OrderService } from '@app/core/services/order.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';

@Component({
  selector: 'app-assignpopup',
  templateUrl: './assignpopup.component.html',
  styleUrls: ['./assignpopup.component.scss']
})
export class AssignpopupComponent  {
  /****************** Account name code start ****************** */
AssignData=[]
multipleAssignData=[]
ownerId:string = "";
ownerName:string = "";
// isRadioButton =true;
assignLength;
saveButton= true;
isSearchLoader=false;
    header = {name:"Name", Id:"ownerId"};
      selectedOwnerObj:any = {ownerId: "", Name: ""};
  showContact: boolean = false;
  contactName: string = "";
  contactNameSwitch: boolean = true;
  selectedName:any=[];
  contactNameclose() {
    this.contactNameSwitch = false;
  }
  appendcontact(value: string, i) {
    this.contactName = value;
    this.selectedContact.push(this.wiproContact[i])
  }
  wiproContact: {}[] = [

    { index: 0, contact: 'Vertical', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ]

  selectedContact: {}[] = [];

/****************** Account name code end ****************** */
  wiproContactArray: any[];
  // contactName: any;
  // contactNameSwitch: boolean = false
  constructor(public DataCommunicationService: DataCommunicationService ,private EncrDecr: EncrDecrService ,public dialogRef: MatDialogRef<AssignpopupComponent>, 
  public dialog: MatDialog,public projectService: OpportunitiesService,private order: OrderService, @Inject(MAT_DIALOG_DATA) public data, private allopportunities: OpportunitiesService) {
    console.log("data",this.data) 
     this.assignLength = data.data.length;
       

     this.AssignData=   data.data.filter  ( (it)=> it.isCheccked= true );



     this.filterData= this.AssignData.filter( (it)=>it.isCheccked==true )
       var j=0
      for( var i=0 ; i<data.data.length; i++ ){
      
       if( data.data[i].OpportunityOwnerId  ==  this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'))
        {
         j = j+1;
       }
      }
      if(j == data.data.length){
        this.selectedRadioButton =2;
      }
  }
 selectRadioButton(){
  debugger;
  if(this.selectedRadioButton == 1){
  //  this.isRadioButton= true;
   this.ownerId='';
   this.ownerName='';
     this.selectedOwnerObj ={ownerId: "", Name: ""};
  
  }
  else if(this.selectedRadioButton == 2){
  // this.isRadioButton= false;
  
  }
 
}







  /****************** customer contact autocomplete code start ****************** */

selectedOwnerArray =[]
    selectedOwner(SelectedAssign:Object){
this.selectedOwnerObj = SelectedAssign;
this.ownerName= this.selectedOwnerObj.Name;
this.ownerId= this.selectedOwnerObj.ownerId;
this.selectedOwnerArray=[]
this.selectedOwnerArray.push(this.selectedOwnerObj)
this.selectedOwnerArray[0].Id= this.selectedOwnerObj.ownerId;
  }

 
  showCustomer: boolean = false;
  customerName: string = "";
  customerNameSwitch: boolean = true;
  panelOpenState:boolean;
 
 selectedRadioButton=2;
  assignRadio= [
    { Value: 1, Label: "Assign to me" ,Label1 : "Assign the selected order to yourself."},
    { Value: 2, Label: "Assign to another user",Label1 : "Assign the selected order to following user" },
   
]
searchOwnerData=[];


   lookupdata = {
      tabledata: [],
      recordCount: 10,
      headerdata: [],
      Isadvancesearchtabs: false,
      controlName: '',
      lookupName:'',
      isCheckboxRequired : false,
      inputValue : '',
      TotalRecordCount :0,
      selectedRecord:[],
       nextLink:'',
      pageNo:1,
      isLoader:false
    };

     selectedLookupData(controlName) {
        switch(controlName) {
          case  'assign' : {
            return  this.selectedOwnerArray.length>0?this.selectedOwnerArray:[]
          }
         
        }
    }
  openadvancetabs(controlName,initalLookupData, value): void {
debugger;

    this.lookupdata.controlName = controlName
    this.lookupdata.headerdata = linkedLeadsHeaders[controlName]
    this.lookupdata.lookupName= linkedLeadNames[controlName]['name']
    this.lookupdata.isCheckboxRequired = linkedLeadNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = linkedLeadNames[controlName]['isAccount']
    this.lookupdata.inputValue = value?value:'';
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.lookupdata.tabledata =[]
    this.allopportunities.getLookUpFilterData({ data:initalLookupData , controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
      this.lookupdata.tabledata = res
      
    })

    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.DataCommunicationService.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });

    dialogRef.componentInstance.modelEmiter.subscribe((x) => {

      debugger
      console.log(x)
      if(x.action=='loadMore'){

        let dialogData = {
          
    
   "SearchText": x.objectRowData.searchKey?x.objectRowData.searchKey:'',
     "SearchType":6,
     "PageSize":this.lookupdata.recordCount,
     "RequestedPageNumber":x.currentPage,
     "OdatanextLink":this.lookupdata.nextLink

        }


         
     


  
        this.allopportunities.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: dialogData  }).subscribe(res => {
          // this.lookupdata.tabledata = res.ResponseObject+this.lookupdata.tabledata
           this.lookupdata.isLoader=false
    this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject)
          this.lookupdata.nextLink = res.OdatanextLink
          this.lookupdata.TotalRecordCount = res.TotalRecordCount

        })

      }else if(x.action=='search'){

        this.lookupdata.nextLink =''
        let dialogData = {
    
     "SearchText": x.objectRowData.searchKey?x.objectRowData.searchKey:'',
     "SearchType":6,
     "PageSize":this.lookupdata.recordCount,
     "RequestedPageNumber":x.currentPage,
     "OdatanextLink":this.lookupdata.nextLink
        }




        this.allopportunities.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: dialogData  }).subscribe(res => {
         this.lookupdata.isLoader=false
          this.lookupdata.tabledata = res.ResponseObject
          this.lookupdata.nextLink = res.OdatanextLink
       this.lookupdata.TotalRecordCount = res.TotalRecordCount


        })

      }
    

    });

    dialogRef.afterClosed().subscribe(result => {
      debugger
      if (result) {
        console.log(result)
        this.AppendParticularInputFun(result.selectedData,result.controlName)
      }
    });
  }

   AppendParticularInputFun(selectedData,controlName) {
    debugger
    if(selectedData){
      if(selectedData.length>0){
    this.selectedOwnerObj = selectedData[0];
this.ownerName= this.selectedOwnerObj.Name;
this.ownerId= this.selectedOwnerObj.ownerId;
this.selectedOwnerArray=[]
this.selectedOwnerArray.push(this.selectedOwnerObj)
this.selectedOwnerArray[0].Id= this.selectedOwnerObj.ownerId;
   }  }}
searchOwnerContent(data){
  debugger;
this.isSearchLoader=true;
  let body=
  {
    "SearchText":data.searchValue?data.searchValue:'',
     "SearchType":6,
     "PageSize":10,
     "RequestedPageNumber":1,
     "OdatanextLink":this.lookupdata.nextLink

}




  //this.DataCommunicationService.loaderhome=true;
   this.allopportunities.getAssignSearchData(body).subscribe(response => {
      if( !response.IsError){

    if (response.ResponseObject && (Array.isArray(response.ResponseObject)?response.ResponseObject.length>0:false) ){
    this.searchOwnerData=  response.ResponseObject;
    for( let j=0; j< this.searchOwnerData.length;j++ ){
      this.searchOwnerData[j].Name = this.searchOwnerData[j].FullName?this.searchOwnerData[j].FullName:'';
    }
      this.lookupdata.TotalRecordCount = response.TotalRecordCount

     this.lookupdata.nextLink = response.OdatanextLink
    this.searchOwnerData = response.ResponseObject.filter( (it)=> it.ownerId !=
    this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip') )
  // if(data.labelName =='ownerArrayy'){
  //  this.openadvancetabs('assign',this.searchOwnerData,data.inputVal)
  // }
   this.isSearchLoader=false;
   }
   else{
    this.searchOwnerData=[];
    this.isSearchLoader=false;
   }
      }
   else{
     this.allopportunities.displayMessageerror(response.Message);   
     this.searchOwnerData=[];
     this.isSearchLoader=false;
   }  
   //this.DataCommunicationService.loaderhome=false; 
  },
       err => {
      //     this.DataCommunicationService.loaderhome=false;
    this.allopportunities.displayerror(err.status);
    this.isSearchLoader=false;
  }
  );
}

  advanceLookUpSearch(lookUpData) {

 debugger;
 console.log(lookUpData);
 let labelName=lookUpData.labelName;
 switch (labelName){
 case 'ownerArrayy':{
this.openadvancetabs('assign',this.searchOwnerData,lookUpData.inputVal)
 return;

  
 }
  }
 
 }

closeIcon(){

  this.dialogRef.close('close');
}
  customerNameclose() {
 
    // if(this.customerName.length > 0){
    this.customerNameSwitch = false;
    // }
  }
 filterData=[];
 saveAssign(){
   
   debugger;
 
 var a=((this.selectedRadioButton==2 && this.ownerId!='' && this.filterData.length>0) || ( this.filterData.length>0 && this.selectedRadioButton!=2 ));
console.log("a data",a);
var orderIds=[];
for (let i=0; i< this.filterData.length; i++ ){
  orderIds.push(  this.filterData[i].orderBookingId)
     }
   if(  this.selectedRadioButton == 1){
     var body =  {
       "UserId": this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip') ,
        "OrderId":orderIds
                  }
   }

    if(  this.selectedRadioButton == 2){
           var body =  {
       "UserId": this.ownerId,
        "OrderId":orderIds
                  } 
   }
  if(  ( this.selectedRadioButton==2 && this.ownerId && this.filterData.length>0  ) ||     (this.selectedRadioButton==1 && this.filterData.length>0  ) ){
    this.DataCommunicationService.loaderhome=true;
     this.order.assignOrderToUser(body).subscribe(response => {
      
        if( !response.IsError){
           this.allopportunities.displayMessageerror("Order assigned successfully");
          this.dialogRef.close('save');
          //  if(response.Message=="success" && this.filterData.length==1 ){
          //    this.allopportunities.displayMessageerror("Opportunity assigned successfully");
          //   this.dialogRef.close();
          //  }
          // else if(response.Message=="success" && this.filterData.length>1 ){
          //    this.allopportunities.displayMessageerror("Opportunities assigned successfully");
          //   this.dialogRef.close();
          //  }
          //  else{
          //    this.allopportunities.displayMessageerror(response.Message);
          //  }
          
        }
        else{
         this.allopportunities.displayMessageerror(response.Message);
        }
        this.DataCommunicationService.loaderhome=false;
   },
       err => {
             this.DataCommunicationService.loaderhome=false;
     this.allopportunities.displayerror(err.status);
  }
  );
 }
 
}

selectCheck(){
  this.filterData= this.AssignData.filter( (it)=>it.isCheccked==true )
}

  appendcustomer(value: string, i) {
 
    this.customerName = value;
    this.selectedCustomer.push(this.customerContact[i])
  }
 
  customerContact: {}[] = [
 
    { index: 0, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, contact: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, contact: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ]
 
  selectedCustomer: {}[] = [];
  ngOnInit() { }
}
