import { Component, OnInit,EventEmitter } from '@angular/core';
import { DataCommunicationService } from '@app/core/services/global.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatSnackBar } from '@angular/material/';
import { OpportunitiesService } from '@app/core';
import { Router} from '@angular/router';
import {solutionsInterfaceAlliance,solutionDetailsAlliance} from './../../../../core/models/allopportunity.model';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { deleteserviceLine1, dealRegisteredYesPopup, dealRegisteredNoPopup } from '../opportunity-view/tabs/business-solution/business-solution.component';

@Component({
  selector: 'app-add-alliance',
  templateUrl: './add-alliance.component.html',
  styleUrls: ['./add-alliance.component.scss']
})
export class AddAllianceComponent implements OnInit {
  selectedAll:boolean;
  panelOpenState2:boolean=true;
  userId:any;
  decr:any;
  constructor(public dialog: MatDialog, public router: Router,public service: DataCommunicationService,public oppService:OpportunitiesService,public EncrDecr:EncrDecrService, public snackBar:MatSnackBar) { }
  
  ngOnInit() {
    this.isLoading=true;
   this.addAlliance();
   this.decr = localStorage.getItem('userID');
   this.userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');

    this.oppService.getInfluenceTypeForalliance().subscribe((res)=>
    {
       if(res)
        {
          if(res.isError)
          {
            this.snackBar.open("Unable to load data", this.action, {
              duration: 3000
            });
             this.isLoading=false;
          }
          else
          {
            this.InfluenceTypeDD=res.ResponseObject;
             this.isLoading=false;
          }
        }
        else
        {
          this.snackBar.open("Unable to load data", this.action, {
              duration: 3000
            });
             this.isLoading=false;
        }
   
    });

    this.oppService.getServiceTypeForalliance().subscribe((res)=>
    {
      
       if(res)
        {
          if(res.isError)
          {
            this.snackBar.open("Unable to load data", this.action, {
              duration: 3000
            });
             this.isLoading=false;
          }
          else
          {
             this.serviceTypeDD=res.ResponseObject;
              this.isLoading=false;
          }
        }
        else
        {
          this.snackBar.open("Unable to load data", this.action, {
              duration: 3000
            });
             this.isLoading=false;
        }  
     
    });

    this.oppService.getBusinessSolutions(this.OpportunityId).subscribe(res=>
    {
      if(res)
      {
        if(res.isError)
        {
          this.snackBar.open("Unable to load data", this.action, {
              duration: 3000
          });
          this.isLoading=false;
        }
        else
        {
            this.overAllTCV = parseFloat(res.ResponseObject.OppBSP.OverallTcv);    
            res.ResponseObject.WiproBusinessSolutionDtls.map(x=>{
             if(x.WiproType==184450000)
             {
               this.bspAccounts.push(x.WiproAccountNameValue);
               this.solutionValue=this.solutionValue+parseFloat(x.WiproValue);              
             }
           })
          this.solutionValueDiff=this.overAllTCV-this.solutionValue;
           console.log("accounts",this.solutionValueDiff);
           console.log("accounts",this.solutionValue);
           console.log("accounts",this.overAllTCV);
        }
      }
    })
  }

  newallDataCount: number = 0;
  business_data: solutionDetailsAlliance[] = [];
  isSearchLoaderForAccount=false;
  isSearchLoaderForOwner=false;
  InfluenceTypeDD=[];
  serviceTypeDD=[];
  totalRecord=0;
  nextLink="";
  isSingleOwner = false;

  overAllTCV=0;
  solutionValue:number=0;

  opportunityID=this.oppService.getSession('opportunityId');


  solutionValueDiff:number=0;
  OpportunityId: string = this.oppService.getSession("opportunityId"); 
  oppName:string=this.oppService.getSession("opportunityName");
  isAccount=false;

  action:any;
  isLoading=false;
  bspAccounts=[];
 
  headerdb = [
    {
      name: 'Name',
      title: 'Account name'
    },   
    {
      name: 'MapName',
      title: 'Owner'
    }
  ];

  headerDataForOwner=[
     { name: 'Name', title: 'Name' },
     { name: 'EmailID', title: 'EmailID' }
  ]

  
  lookupdata = {
    tabledata: [],
    recordCount: 2,
    headerdata:this.headerdb,
    Isadvancesearchtabs: false,
    controlName: 'Account',
    lookupName:'Account',
    isCheckboxRequired : false,
    inputValue : '',
    pageNo:1,
    nextLink:'',
    isLoader:false,
    TotalRecordCount :0,
    selectedRecord:[]
  };
   lookupdataForOwner = {
    tabledata: [],
    recordCount: 0,
    headerdata:this.headerDataForOwner,
    Isadvancesearchtabs: false,
    controlName: 'Owner',
    lookupName:'Owner',
    isCheckboxRequired : false,
    inputValue : '',
    pageNo:1,
    nextLink:'',
    isLoader:false,
    TotalRecordCount :0,
    selectedRecord:[]
  };
 getnameArrayData(index,searchText)
 {
   if(!this.business_data[index].solutions.WiproAccountname) {
    this.business_data[index].solutions.OwnerIdValue= "";
    this.business_data[index].solutions.OwnerIdValueName="";
   }
  this.business_data[index].nameDD=[];
  this.isSearchLoaderForAccount=true;
  let obj={
     "SearchText":searchText,
     "SearchType":6,
     "UserGuid":this.userId,
     "PageSize":10,
     "OdatanextLink":"",
     "RequestedPageNumber":1
  }
  this.oppService.searchAllianceNameWithText(obj).subscribe((res)=>
  {
    // console.log("business_data[index]",res);
    this.business_data[index].nameDD = [];

    if(res && res.ResponseObject)
    {
      this.isSearchLoaderForAccount=false;
      for(let j=0;j<res.ResponseObject.length;j++)
      {
        this.business_data[index].nameDD.push(res.ResponseObject[j]);
      }
      for(var i=0;i<this.business_data[index].nameDD.length;i++)
      {
        this.business_data[index].nameDD[i].Id=this.business_data[index].nameDD[i].SysGuid;
        this.business_data[index].nameDD[i].Name = this.getCurrencyData(this.business_data[index].nameDD[i].Name);
      }
     this.totalRecord=res.TotalRecordCount;
     this.nextLink=res.OdatanextLink;
    }
    else
    {
       this.business_data[index].nameDD=[];
    }
     
      },
      err => {
        this.business_data[index].nameDD = [];
      });
}

  getCurrencyData(data) {
    return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
  }
   openadvancetabsSearch(rowData,index){
     console.log("rowdat",rowData);
      console.log("rowdat",index);
    this.lookupdataForOwner.tabledata=this.business_data[index].ownerDD;
    this.lookupdataForOwner.recordCount=this.business_data[index].ownerDD.length;
    this.lookupdataForOwner.TotalRecordCount=this.totalRecord;
    this.lookupdataForOwner.nextLink=this.nextLink;
    this.lookupdataForOwner.inputValue=this.business_data[index].solutions.OwnerIdValueName;
    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.service.setHeaderPixes(this.lookupdataForOwner.headerdata.length,this.isAccount),
      data:this.lookupdataForOwner
    });

    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
      let dialogData = {
        searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
        recordCount: this.lookupdataForOwner.recordCount,
        OdatanextLink:'',// need to handel the pagination and search!
        pageNo: x.currentPage//need to handel from pagination
      }
      if(x.action=="search")
      {
        let obj={
        "Guid":rowData.WiproAccountNameValue,
        "SearchText":(x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
        "PageSize":10,
        "RequestedPageNumber":1 
     }
        this.oppService.getOwner(obj).subscribe((res)=>
        {
        this.lookupdataForOwner.isLoader=false;
        this.lookupdataForOwner.selectedRecord=[];
        let newAccountArray=[];
        if(res && res.ResponseObject)
        {
          this.lookupdataForOwner.tabledata =res.ResponseObject;     
          this.lookupdataForOwner.recordCount=this.lookupdata.tabledata.length;
          this.lookupdataForOwner.TotalRecordCount=res.TotalRecordCount;
          this.totalRecord=res.TotalRecordCount;
          this.nextLink=res.OdatanextLink;
          this.business_data[index].ownerDD=newAccountArray;
          for(var i=0;i<this.lookupdataForOwner.tabledata.length;i++)
          {
            this.lookupdataForOwner.tabledata[i].Id=this.lookupdata.tabledata[i].SysGuid;
          }
        }        
          },
          err => {
           this.lookupdataForOwner.tabledata = [];
          });
        } 
        if(x.action=="loadMore")
        {
            let obj={
          "Guid":rowData.WiproAccountNameValue,
          "SearchText":(x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
          "PageSize":10,
          "RequestedPageNumber": x.currentPage
        }
        this.oppService.getOwner(obj).subscribe((res)=>
        {
        if(res && res.ResponseObject)
        {
          let newData=[];
          this.lookupdataForOwner.isLoader=false;
          this.lookupdataForOwner.tabledata = this.lookupdataForOwner.tabledata.concat(res.ResponseObject);
          this.lookupdataForOwner.selectedRecord=[];
          this.nextLink=res.OdatanextLink;
          for(var i=0;i<this.lookupdataForOwner.tabledata.length;i++)
          {
            this.lookupdataForOwner.tabledata[i].Id=this.lookupdataForOwner.tabledata[i].SysGuid;
          }
        }        
          },
          err => {
           this.lookupdataForOwner.tabledata = [];
          });
        }


    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        this.appendOwnername(result.selectedData[0],index);
      }
    });
   }
    openadvancetabs(index): void {     
    this.lookupdata.tabledata=this.business_data[index].nameDD;
    this.lookupdata.recordCount=this.business_data[index].nameDD.length;
    this.lookupdata.TotalRecordCount=this.totalRecord;
    this.lookupdata.nextLink=this.nextLink;
    this.lookupdata.inputValue=this.business_data[index].solutions.WiproAccountname;
    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.service.setHeaderPixes(this.lookupdata.headerdata.length,this.isAccount),
      data:this.lookupdata
    });

    dialogRef.componentInstance.modelEmiter.subscribe((x) => {
      let dialogData = {
        searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
        recordCount: this.lookupdata.recordCount,
        OdatanextLink:'',// need to handel the pagination and search!
        pageNo: x.currentPage//need to handel from pagination
      }
      console.log("action",x)
      if(x.action=="search")
      {
        let obj={
          "SearchText":(x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
          "SearchType":6,
          "UserGuid":this.userId,
          "PageSize":10,
          "OdatanextLink":"",
          "RequestedPageNumber": 1
        }
        this.oppService.searchAllianceNameWithText(obj).subscribe((res)=>
        {
        this.lookupdata.isLoader=false;
        this.lookupdata.selectedRecord=[];
        let newAccountArray=[];
        if(res && res.ResponseObject)
        {
          // for(let j=0;j<res.ResponseObject.length;j++)
          // {
          //   if(this.userId==res.ResponseObject[j].OwnerId)
          //   {
          //       newAccountArray.push(res.ResponseObject[j]);
          //   }
          // }
          this.lookupdata.tabledata =res.ResponseObject;     
          this.lookupdata.recordCount=this.lookupdata.tabledata.length;
          this.lookupdata.TotalRecordCount=res.TotalRecordCount;
          this.totalRecord=res.TotalRecordCount;
          this.nextLink=res.OdatanextLink;
          this.business_data[index].nameDD=newAccountArray;
          for(var i=0;i<this.lookupdata.tabledata.length;i++)
          {
            this.lookupdata.tabledata[i].Id=this.lookupdata.tabledata[i].SysGuid;
            this.lookupdata.tabledata[i].Name = this.getCurrencyData(this.lookupdata.tabledata[i].Name);
          }
        }        
          },
          err => {
           this.lookupdata.tabledata = [];
          });
        } 
        if(x.action=="loadMore")
        {
            let obj={
          "SearchText":(x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
          "SearchType":6,
          "UserGuid":this.userId,
          "PageSize":10,
          "OdatanextLink":this.nextLink,
          "RequestedPageNumber": x.currentPage
        }
        this.oppService.searchAllianceNameWithText(obj).subscribe((res)=>
        {
        if(res && res.ResponseObject)
        {
          let newData=[];
          // for(let k=0;k<res.ResponseObject.length;k++)
          // {
          //   if(this.userId==res.ResponseObject[k].OwnerId)
          //   {
          //       newData.push(res.ResponseObject[k]);
          //   }
          // }
          this.lookupdata.isLoader=false;
          this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
          this.lookupdata.selectedRecord=[];
          this.nextLink=res.OdatanextLink;
          for(var i=0;i<this.lookupdata.tabledata.length;i++)
          {
            this.lookupdata.tabledata[i].Id=this.lookupdata.tabledata[i].SysGuid;
            this.lookupdata.tabledata[i].Name = this.getCurrencyData(this.lookupdata.tabledata[i].Name);
          }
        }        
          },
          err => {
           this.lookupdata.tabledata = [];
          });
        }


    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        this.appendallianceName(result.selectedData[0],index);
      }
    });
  }

  addAlliance()
  {   
    this.service.loaderhome = true;
    let newAllainceDetails: solutionsInterfaceAlliance = {
      OwnerIdValue: "",
      OwnerIdValueName: "",
      WiproAccountNameValue: "",
      WiproInfluenceType: "",
      WiproAccountname: "",
      WiproOpportunitySolutionDetailId: "",
      WiproPercentage: false,
      WiproPercentageOfTCV: "",
      WiproServiceType: "",
      WiproSolutionBDMValue: "",
      WiproSolutionBDMName: "",
      WiproType: "184450000",
      WiproValue: "",
      WiproOpportunityId: this.OpportunityId,
      statecode:0,
      nameCheck:false,
      tcvPerCheck:false,
      tcvValueCheck:false,
      ownerCheck:false,
      influenceCheck:false,
      serviceTypeCheck:false,
      dealRegisterCheck:false,
      DealRegistration:{
        "IsDealRegistered": ""
      }
    }
    this.lookupdata.selectedRecord=[]
    let allnamelength = this.business_data.length + 1;
    this.newallDataCount = this.newallDataCount + 1;
    this.business_data.unshift(Object.assign({}, new solutionDetailsAlliance(newAllainceDetails, [], [],[],[],[],[], false, false,false,
      "solType" + this.newallDataCount + "NewData" + allnamelength,
      "solName" + this.newallDataCount + "NewData" + allnamelength,
      "solOwner" + this.newallDataCount + "NewData" + allnamelength,
      "solPerc" + this.newallDataCount + "NewData" + allnamelength,
      "solTCV" + this.newallDataCount + "NewData" + allnamelength,
      "solValue" + this.newallDataCount + "NewData" + allnamelength,
      "solBDM" + this.newallDataCount + "NewData" + allnamelength,
      "solInf" + this.newallDataCount + "NewData" + allnamelength,
      "solST" + this.newallDataCount + "NewData" + allnamelength)));
    this.service.loaderhome = false;

   
  }
    deleteAlliance(index)
    {
      const dialogRef = this.dialog.open(deleteserviceLine1, {
        width: "350px",
        data: { 
          message: "Do you wish to delete this solution",
          buttonText: "Confirm",
          Header: "Delete solution" }
      });
      
       dialogRef.afterClosed().subscribe(result => { 
        if (result == 'save') {
          this.business_data.splice(index, 1);
        }
      });
    }

  editData(solutionData,i)
  {
    console.log("dsf",solutionData)
   if(solutionData.DealRegistration.IsDealRegistered == true || solutionData.DealRegistration.IsDealRegistered == "true")
   {
      this.dealRegistered(solutionData,i,"edit");
   }
   else
   {
     this.dealNotRegistered(solutionData,i,"edit");
   }
  }
  changeDealRegistered(solutionData,i,e)
  {
    if(e.value == "true")
    {
       this.dealRegistered(solutionData,i,"create");
    }
    else
    {
       this.dealNotRegistered(solutionData,i,"create");
    }
  }


 dealRegistered(solutionData , i,eve){
    const dialogRef = this.dialog.open(dealRegisteredYesPopup, {
      width: '920px',
      data:{solutionObj : solutionData,eve : eve}
    }); 

    dialogRef.afterClosed().subscribe(result => {
        if (result.action == "saved") {
          this.business_data[i].solutions.dealRegisterCheck = false;
          this.business_data[i].solutions.DealRegistration = result.dealDetails;
          this.business_data[i].solutions.DealRegistration.IsDealRegistered = result.dealDetails.IsDealRegistered.toString();
          console.log("hhh",result)
        }
        else
        {
          this.business_data[i].solutions.DealRegistration.IsDealRegistered = "";
        }
      });
  } 

   dealNotRegistered(solutionData , i,eve){
    const dialogRef = this.dialog.open(dealRegisteredNoPopup, {
      width: '650px',
      data:{solutionObj : solutionData,eve : eve}
    });
    dialogRef.afterClosed().subscribe(result => {

      console.log("hhjjj",result)
        if (result) {
          this.business_data[i].solutions.dealRegisterCheck = false;
          this.business_data[i].solutions.DealRegistration = result.dealDetails;
          this.business_data[i].solutions.DealRegistration.IsDealRegistered = result.dealDetails.IsDealRegistered.toString();
          console.log("hhh",result)
        }
        else
        {
          this.business_data[i].solutions.DealRegistration.IsDealRegistered = "";
        }
      });
  }


  checkSolValue(solutionData, i) {
    let tempValue: any = solutionData.WiproValue.match(/^[0-9]+(\.[0-9]*){0,1}$/g);
    this.business_data[i].solutions.WiproValue = tempValue ? tempValue[0].toString() : "";
  }

  checkSolValueBlur(solutionData, i) {  

    if(solutionData.WiproValue.length>0)
     {
        this.business_data[i].solutions.tcvPerCheck = false;
        this.business_data[i].solutions.tcvValueCheck = false;
        let tempValue: any = solutionData.WiproValue.match(/^[0-9]+(\.[0-9]*){0,1}$/g);
        this.business_data[i].solutions.WiproValue = tempValue ? parseFloat(tempValue[0]).toFixed(2).toString() : "";
        if (tempValue) {
          let tempTCV: any = (((parseFloat(tempValue[0]) * 100) / this.overAllTCV));
            if (tempTCV <= 100 && tempTCV > 0) {
                if(tempValue>this.solutionValueDiff)
                {
                this.business_data[i].solutions.WiproValue = "";
                this.business_data[i].solutions.WiproPercentageOfTCV = "";
                this.oppService.displayMessageerror("TCV value should not be greater than"+this.solutionValueDiff);
                }
                else
                {
                  this.business_data[i].solutions.WiproPercentageOfTCV = parseFloat(tempTCV).toFixed(2).toString();
                }
            } else {
              this.business_data[i].solutions.WiproValue = "";
              this.business_data[i].solutions.WiproPercentageOfTCV = "";
              this.oppService.displayMessageerror("% of TCV should be greater than 0 and less than equal to 100");
            }
        } 
        else {
            this.business_data[i].solutions.WiproPercentageOfTCV = "";
            this.business_data[i].solutions.WiproValue = "";
        }       
     }     
    }

   checkTCVPerc(solutionData, i) {
    let tempTCV: any = solutionData.WiproPercentageOfTCV.match(/^[0-9]+(\.[0-9]*){0,1}$/g);
    this.business_data[i].solutions.WiproPercentageOfTCV = tempTCV ? tempTCV[0].toString() : "";
  }
solOwnerNameclose(solutionData, i, event){
    // event.relatedTarget
    let id = 'advanceSolutionNameSearch' + i;
    if ((event.relatedTarget && event.relatedTarget.nodeName != 'UL' && event.relatedTarget.id != id) || !(event.relatedTarget)) {
      this.business_data[i].solOwnerSwitch = false;
      console.log("sadsad",this.business_data[i].selectedOwnerName);
      if (!this.business_data[i].selectedOwnerName.some(res => res.AccountId == solutionData.WiproAccountNameValue && res.AccountName == solutionData.WiproAccountname)) {
        this.business_data[i].solutions.OwnerIdValue = "";
        this.business_data[i].solutions.OwnerIdValueName = "";
        this.business_data[i].solutions.WiproSolutionBDMName = "";
        this.business_data[i].solutions.WiproSolutionBDMValue = "";
        this.business_data[i].nameDD = [];
        this.business_data[i].selectedSolName = [];
        this.business_data[i].solutionBDMDD = [];
        this.business_data[i].selectedSolBDM = [];
      }
    }
}
  getOwnerArray(solution,index,searchText,type?)
  {
    this.isSearchLoaderForOwner=true;
    this.business_data[index].ownerDD=[];
    let obj={
          "Guid":solution.WiproAccountNameValue,
          "SearchText":searchText,
          "PageSize":10,
          "RequestedPageNumber":1 
      }
  this.oppService.getOwner(obj).subscribe((res)=>
  {
    if(res && res.ResponseObject)
    {
      this.isSearchLoaderForOwner=false;
     this.business_data[index].ownerDD = (res && res.ResponseObject) ? res.ResponseObject : [];
     if(this.business_data[index].ownerDD.length == 1 && type == 'INITIAL') {
       this.isSingleOwner = true;
       this.appendOwnername(this.business_data[index].ownerDD[0],index);
     }
     this.totalRecord=res.TotalRecordCount;
     this.nextLink=res.OdatanextLink;
    }
    else
    {
      this.isSearchLoaderForOwner=false;
       this.business_data[index].ownerDD=[];
    }
     
      },
      err => {
        this.isSearchLoaderForOwner=true;
        this.business_data[index].ownerDD = [];
      });
  }
 appendOwnername(selectedData,i){
    this.business_data[i].solOwnerSwitch = false;
    this.business_data[i].solutions.OwnerIdValue = selectedData.SysGuid;
    this.business_data[i].solutions.OwnerIdValueName = selectedData.Name;
    this.business_data[i].selectedOwnerName = new Array(Object.assign({}, selectedData));
    this.business_data[i].solutions.ownerCheck = false;
  }
  checkTCVPercBlur(solutionData, i) {
    if(solutionData.WiproPercentageOfTCV.length>0)
     {
        this.business_data[i].solutions.tcvPerCheck = false;
        this.business_data[i].solutions.tcvValueCheck = false;
        let tempTCV: any = solutionData.WiproPercentageOfTCV.match(/^[0-9]+(\.[0-9]*){0,1}$/g);
        this.business_data[i].solutions.WiproPercentageOfTCV = tempTCV ? parseFloat(tempTCV[0]).toFixed(2).toString() : "";
        if (tempTCV) {
          if (tempTCV[0] <= 100 && tempTCV[0] > 0) {
            this.business_data[i].solutions.WiproValue =((this.overAllTCV * parseFloat(tempTCV[0])) / 100).toFixed(2).toString();
            if(parseFloat(this.business_data[i].solutions.WiproValue)>this.solutionValueDiff)
            {
              this.oppService.displayMessageerror("TCV value should not be greater than"+this.solutionValueDiff);
              this.business_data[i].solutions.WiproPercentageOfTCV = "";
              this.business_data[i].solutions.WiproValue = "";
            }
            else
            {
              this.business_data[i].solutions.WiproValue =((this.overAllTCV * parseFloat(tempTCV[0])) / 100).toFixed(2).toString();
            }
          }
          else {
            this.business_data[i].solutions.WiproPercentageOfTCV = "";
            this.business_data[i].solutions.WiproValue = "";
            this.oppService.displayMessageerror("% of TCV should be greater than 0 and less than equal to 100");
          }

        } else {
          this.business_data[i].solutions.WiproValue = "";
        }
     }
  }

allainceNameclose(data,index,event) {
  this.business_data[index].solNameSwitch = false
}

appendallianceName(selectedData,i) {
    console.log("sadsad",selectedData);
     console.log("sadswad",i);
     this.business_data[i].solutions.OwnerIdValue= "";
     this.business_data[i].solutions.OwnerIdValueName="";
    this.business_data[i].solNameSwitch = false;
    this.business_data[i].solutions.WiproAccountname = selectedData.Name;
    this.business_data[i].solutions.WiproAccountNameValue = selectedData.SysGuid;
    this.lookupdata.selectedRecord[0]=selectedData;
    this.business_data[i].solutions.nameCheck = false;
    this.getOwnerArray( this.business_data[i].solutions,i,'','INITIAL');
}

saveAllianceData()
{
  let fieldCheck=false;
  let duplicateCheck=false;
  let duplicateIndex=0;
  let ownerCheck=false;
  console.log("selected data",this.business_data)
  if(this.business_data.length>0)
  {
  for(var i=0;i<this.business_data.length;i++)
  {
    if(this.business_data[i].solutions.WiproAccountname.length<=0)
    {
      fieldCheck=true;
      this.business_data[i].solutions.nameCheck=true;
    } 
    if(this.business_data[i].solutions.OwnerIdValue!==this.userId)
    {
      ownerCheck=true;
    }
    if(!this.business_data[i].solutions.OwnerIdValue)
    {
      fieldCheck=true;
      this.business_data[i].solutions.ownerCheck=true;
    }
    if(this.business_data[i].solutions.WiproValue.length<=0)
    {
      fieldCheck=true;
      if(this.business_data[i].solutions.WiproPercentage)
      {
        this.business_data[i].solutions.tcvPerCheck=true;
        this.business_data[i].solutions.tcvValueCheck=false;
      }
      else
      {
        this.business_data[i].solutions.tcvPerCheck=false;
        this.business_data[i].solutions.tcvValueCheck=true;
      }
    }
    if(this.bspAccounts.indexOf(this.business_data[i].solutions.WiproAccountNameValue)!==-1)
    {
      duplicateCheck=true;
      duplicateIndex=i+1;
    }

    if(!this.business_data[i].solutions.WiproInfluenceType)
    {
      fieldCheck=true;
      this.business_data[i].solutions.influenceCheck=true;
    }

    if((this.business_data[i].solutions.WiproInfluenceType && this.business_data[i].solutions.WiproInfluenceType !="184450001") && !this.business_data[i].solutions.WiproServiceType){
       console.log("serviceTypeCheck",this.business_data)
       fieldCheck=true;
       this.business_data[i].solutions.serviceTypeCheck=true;
    }

    if(!this.business_data[i].solutions.DealRegistration.IsDealRegistered.toString())
    {
       fieldCheck=true;
       this.business_data[i].solutions.dealRegisterCheck=true;
    }
  }
  if(!fieldCheck )
  {
    let totalValue=0;
    for(var i=0;i<this.business_data.length;i++)
    {
      totalValue=totalValue+parseFloat(this.business_data[i].solutions.WiproValue);
    }
    console.log("total value",totalValue);
    if(totalValue<=this.solutionValueDiff)
    {
      if(ownerCheck)
      {
         this.oppService.displayMessageerror("Select an account for which you are the owner");
      }
      else
      {
        if(duplicateCheck)
        {
          this.oppService.displayMessageerror("Account in the "+duplicateIndex+"row is already added");
        }
        else
        {
          this.saveData();
        }        
      }
      
    }
    else
    {
      this.oppService.displayMessageerror("Sum of TCV value should not be greater than "+this.solutionValueDiff);
    }
   
  }
}
else
{
  this.oppService.displayMessageerror("Add a row to save data.");
}
  
}
changeState(type,index)
{
  if(type=='influence')
  {
      this.business_data[index].solutions.influenceCheck=false;
  }
  else
  {
     this.business_data[index].solutions.serviceTypeCheck=false;
  }
}
saveData()
{
  this.isLoading=true;
  var dataToAdd=[];
  for(var i=0;i<this.business_data.length;i++)
  {
    let obj={
        OwnerIdValueName: "",
        OwnerIdValue: "",
        WiproAccountNameValue: null,
        OppSulitonID: null,
        WiproInfluenceType: null,
        WiproName: null,
        WiproOpportunitySolutionDetailId: "",
        WiproPercentage: true,
        WiproPercentageOfTCV:"",
        WiproServiceType: null,
        WiproSolutionBDMValue: null,
        WiproSolutionBDMName: null,
        WiproSolutionNameValue: null,
        WiproType: "184450000",
        WiproValue:"",
        WiproAccountname: "",
        WiproOpportunityId: this.opportunityID,
        OwnerId: null
      }
      obj.OwnerIdValueName=this.business_data[i].solutions.OwnerIdValueName;
      obj.OwnerIdValue=this.business_data[i].solutions.OwnerIdValue;
      obj.WiproAccountNameValue=this.business_data[i].solutions.WiproAccountNameValue;
      obj.WiproAccountname=this.business_data[i].solutions.WiproAccountname;
      obj.WiproInfluenceType=this.business_data[i].solutions.WiproInfluenceType;
      obj.WiproOpportunitySolutionDetailId=this.business_data[i].solutions.WiproOpportunitySolutionDetailId;
      obj.WiproPercentage=this.business_data[i].solutions.WiproPercentage;
      obj.WiproPercentageOfTCV=this.business_data[i].solutions.WiproPercentageOfTCV;
      obj.WiproServiceType=this.business_data[i].solutions.WiproServiceType;
      obj.WiproSolutionBDMValue=this.business_data[i].solutions.WiproSolutionBDMValue;
      obj.WiproSolutionBDMName=this.business_data[i].solutions.WiproSolutionBDMName;
      obj.WiproType=this.business_data[i].solutions.WiproType;
      obj.WiproValue=this.business_data[i].solutions.WiproValue;
      dataToAdd.push(obj);
  }
  this.oppService.saveAllianceData(dataToAdd).subscribe((res)=>
  {
    if(res)
    {
      if(res.isError)
      {
        this.snackBar.open("Unable to save data", this.action, {
          duration: 3000
        });
         this.isLoading=false;
      }
      else
      {
        // this.snackBar.open("Data saved successfully",this.action, {
        //   duration: 3000
        // });
        this.oppService.accessModifyApi(this.oppService.getSession("AdvisorOwnerId"),this.oppService.getSession("userEmail")).subscribe((res)=>
        {
          if(res)
          {
            if(res.isError)
            {
                this.snackBar.open("Unable to save data", this.action, {
                  duration: 3000
                });
                this.isLoading=false;
            }
            else
            {
              this.isLoading=false;
              this.snackBar.open("Data saved successfully",this.action, {
                duration: 3000
              });
              this.oppService.setSession('IsPreSaleAndRole',res.ResponseObject.UserRoles.IsPreSaleAndRole);
              this.oppService.setSession('IsGainAccess',res.ResponseObject.IsGainAccess);
              this.oppService.setSession('FullAccess',res.ResponseObject.FullAccess);
              this.oppService.setSession('roleObj',res.ResponseObject);  
              // window.history.back();            
              this.router.navigate(['/opportunity/opportunityview/businesssolution']);
            }
          }            
        });        
       
      }
    }
    else
    {
      this.snackBar.open("Unable to save data", this.action, {
          duration: 3000
        });
         this.isLoading=false;
    }
    
  })
}

goBack() {
  window.history.back();
}
}
