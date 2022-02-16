import { Component, OnInit } from '@angular/core';
import { DataCommunicationService,OrderService } from '@app/core';
import { OpportunitiesService } from '@app/core';
import { MatDialog, MatDialogRef,MatSnackBar } from '@angular/material';
import { Router} from '@angular/router';

@Component({
  selector: 'app-business-solution-search',
  templateUrl: './business-solution-search.component.html',
  styleUrls: ['./business-solution-search.component.scss']
})
export class BusinessSolutionSearchComponent implements OnInit {

  constructor(public orderService: OrderService, public service:DataCommunicationService,public router: Router,public snackBar:MatSnackBar,public dialog:MatDialog,public oppService:OpportunitiesService) { }
  searchText:any="";

  serviceLineDetails=[];
  accountList=[];
  solutionsList=[];
  holmesList=[];
  platformList=[];

  accountFlag=false;
  solutionsFlag=false;
  platformListFlag=false;
  HolmesFlag=false;

  accountFlagg=true;
  solutionsFlagg=true;
  platformListFlagg=true;
  HolmesFlagg=true;
  isLoading= false;

  action:any;
  oppName=this.oppService.getSession('opportunityName');
  sbuId=this.oppService.getSession('sbuId');

  SMData = this.oppService.getSession('SMData');
  
  WTFlag = false;
  ngOnInit() {
    this.WTFlag = this.SMData.WTFlag;
    console.log("SMData",this.SMData)
  }

  generateServiceLineData()
  {
    this.serviceLineDetails.forEach((element,index)=>{
      element.isChecked=false;    
    });
    this.accountList.forEach((element,index)=>
    {
      element.isChecked=false;
    });
    this.solutionsList.forEach((element,index)=>
    {
      element.isChecked=false;
    });
    this.holmesList.forEach((element,index)=>
    {
      element.isChecked=false;
    });
    this.platformList.forEach((element,index)=>
    {
      element.isChecked=false;
    });
  }

  goBack() {
    // if(this.WTFlag)
    // {
    //   this.router.navigate(['/opportunity/opportunityview/order']);
    // }
    // else 
    if(this.SMData && this.SMData.type == 'ORDER') {
      this.router.navigate(['/opportunity/opportunityview/order']);
    }
    else
    {
      this.router.navigate(['/opportunity/opportunityview/businesssolution']);      
    }
    // window.history.back();
  }

  changeSearchText(event)
  {
    this.searchText=event;
  }
  
  searchWithText()
  {
    if(this.searchText.trim())
    {
    this.isLoading =true;
    let obj={
      "SearchText":this.searchText,
      "SBUGuid":this.sbuId
    };
    this.oppService.searchWithText(obj).subscribe(res=>
    {
      this.isLoading =false;
      if(res.IsError)
      {
          this.snackBar.open("Server error occured.Try after some time", this.action, {
          duration: 3000
          });
      }
      else
      {
          if(res.ResponseObject.ProductList.length>0 || res.ResponseObject.AccountList.length>0 || res.ResponseObject.ServiceLineList.length>0)
          {
            if(this.WTFlag)
            {
              this.serviceLineDetails=[]
              this.holmesList=[]
              this.platformList= []
            }
            else
            {
              this.serviceLineDetails=res.ResponseObject.ServiceLineList;
              this.holmesList= res.ResponseObject.ProductList.filter((x)=>x.producttypecode==4);
              this.platformList= res.ResponseObject.ProductList.filter((x)=>x.producttypecode==3);
            }
           
            this.accountList=res.ResponseObject.AccountList;
            this.solutionsList= res.ResponseObject.ProductList.filter((x)=> x.producttypecode==5);

              if(this.accountList.length ==0){
                this.accountFlagg=false;
              }
              else{
                this.accountFlag =true
                this.accountFlagg=true;
              }
              if(this.solutionsList.length ==0){
                this.solutionsFlagg=false;
              }
              else{
                 this.solutionsFlag =true
                this.solutionsFlagg=true;
              }
              if(this.holmesList.length ==0){
               this.HolmesFlagg=false; 
              }
              else{
                this.HolmesFlag=true; 
                this.HolmesFlagg=true; 
              }
              if(this.platformList.length ==0){
               this.platformListFlagg=false; 
              }
              else{
                this.platformListFlag=true; 
                this.platformListFlagg=true; 
              }

            this.generateServiceLineData();  
          }
          else
          {
            this.accountFlagg=false;
            this.solutionsFlagg=false;
            this.HolmesFlagg=false; 
            this.platformListFlagg=false; 
            this.snackBar.open("No records found", this.action, {
            duration: 3000
            });
          }
               
          
      }
    
    });
  }
  else
  {
    this.snackBar.open("Enter some text to search", this.action, {
    duration: 3000
    });
  }
   
    
  }

  add()
    {
      var session_Data={ServiceLineList:[],solutionList:[],IP:[]};
      var serviceline_session_Data=this.serviceLineDetails.filter((x)=>x.isChecked).map(it=> {return Object.assign({...it,WiproEngagementModelName:'',WiproDualCreditName:''})});
      var solution_session_Data=[];
      var ip_session_Data=[];
      
      //alliance data
      var solutionDataToAdd=this.accountList.filter((x)=>x.isChecked);

      //solutions data
      for (var i=0;i<this.solutionsList.length;i++)
      {
        if(this.solutionsList[i].isChecked)
        {
           solutionDataToAdd.push(this.solutionsList[i]);
        }
      }

     //adding solution data with allaince
      for(var i=0;i<solutionDataToAdd.length;i++)
      {
        let obj={};
        if(solutionDataToAdd[i].producttypecode==undefined)
        {
            obj["OwnerIdValue"]=solutionDataToAdd[i].ParentId;
            obj["OwnerIdValueName"]=solutionDataToAdd[i].ParentName;
            obj["WiproAccountNameValue"]="";
            obj["WiproInfluenceType"]="";
            obj["WiproAccountname"]=solutionDataToAdd[i].Name;
            obj["WiproOpportunitySolutionDetailId"]=solutionDataToAdd[i].SysGuid;
            obj["WiproPercentage"]=false;
            obj["WiproPercentageOfTCV"]="";
            obj["WiproServiceType"]="";
            obj["WiproSolutionBDMValue"]="";
            obj["WiproSolutionBDMName"]="";
            obj["WiproType"]=184450000;
            obj["WiproValue"]="";
            obj["WiproTypeName"]="Alliance";
            obj["WiproInfluenceTypeName"]="";
            obj["WiproServiceTypeName"]="";

        }
        else
        {
            obj["OwnerIdValue"]=solutionDataToAdd[i].WiproSoultionOwnerValue;
            obj["OwnerIdValueName"]=solutionDataToAdd[i].WiproSoultionOwnerValueName;
            obj["WiproAccountNameValue"]="";
            obj["WiproInfluenceType"]="";
            obj["WiproAccountname"]=solutionDataToAdd[i].name;
            obj["WiproOpportunitySolutionDetailId"]=solutionDataToAdd[i].productid;
            obj["WiproPercentage"]=false;
            obj["WiproPercentageOfTCV"]="";
            obj["WiproServiceType"]="";
            obj["WiproSolutionBDMValue"]="";
            obj["WiproSolutionBDMName"]="";
            obj["WiproType"]=184450001;
            obj["WiproValue"]="";
            obj["WiproTypeName"]="Solution";
            obj["WiproInfluenceTypeName"]="";
            obj["WiproServiceTypeName"]="";
        }
        solution_session_Data.push(obj);
      }
      
      //holmes data
      var ipDataToAdd=this.holmesList.filter((x)=>x.isChecked);

      //platform solutions data
      for (var i=0;i<this.platformList.length;i++)
      {
        if(this.platformList[i].isChecked)
        {
           ipDataToAdd.push(this.platformList[i]);
        }
      }

      for(var i=0;i<ipDataToAdd.length;i++)
      {
        debugger;
            let obj={};
            obj["disableHolmesBDM"]= (ipDataToAdd[i].producttypecode==4)?false:true ;
            obj["disableModule"]= (ipDataToAdd[i].ModuleCount>0)?false:true ;
            obj["IpId"]=ipDataToAdd[i].productid;
            obj["IpName"]=ipDataToAdd[i].name;
            obj["WiproModuleValue"]="";
            obj["WiproModuleName"]="";
            obj["WiproServiceline"]="";
            obj["WiproPractice"]="";
            obj["WiproServicelineName"]="";
            obj["WiproPracticeName"]="";
            obj["WiproSlbdmValue"]="";
            obj["WiproSlbdmName"]="";
            obj["WiproLicenseValue"]="";
            obj["WiproAmcvalue"]="";
            obj["WiproCloud"]=false;
            obj["TaggedamcValue"]="";
            obj["TaggedLicenseValue"]="";
            obj["WiproOpportunityIdValue"]="";
            obj["WiproOpportunityIpId"]="";
            obj["AdditionalSLDetails"]=[];
            obj["CloudDetails"]=[];
            obj["WiproAcceptip"]=false;
            obj["WiproHolmesbdmID"]="";
            obj["WiproHolmesbdmName"]="";
            ip_session_Data.push(obj);      
      }
      if(serviceline_session_Data.length || solution_session_Data.length || ip_session_Data.length)
      {
        session_Data.ServiceLineList = serviceline_session_Data;
        session_Data.solutionList = solution_session_Data;
        session_Data.IP=ip_session_Data;
        session_Data["orderId"]=this.oppService.getSession("orderId");
        session_Data["opportunityId"]=this.oppService.getSession("opportunityId");
        session_Data["type"]=this.SMData.type;
        this.oppService.setSession('smartsearchData',session_Data);
        console.log("session",this.oppService.getSession('smartsearchData'));
        this.oppService.smartsearch=true;
        // this.router.navigate(['/opportunity/opportunityview/businesssolution']);
        window.history.back();
      }
      else
      {
        this.snackBar.open("Select data to add", this.action, {
          duration: 3000
          });
      }
      
    }

    ngOnDestroy() {
    this.orderService.amendmentInProcess = false;
    }
}