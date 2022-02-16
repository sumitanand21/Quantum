import { Component, OnInit,EventEmitter } from '@angular/core';
import { DataCommunicationService } from '@app/core/services/global.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/';
import { OpportunitiesService, campaignHeaders, campaignNames  } from '@app/core/services';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-new-age-business-partner',
  templateUrl: './new-age-business-partner.component.html',
  styleUrls: ['./new-age-business-partner.component.scss']
})
export class NewAgeBusinessPartnerComponent implements OnInit {
  selectedAll:boolean;
  panelOpenState2:boolean=true;
  constructor(public dialog: MatDialog, public service: DataCommunicationService,public router:Router, public projectService: OpportunitiesService, private EncrDecr: EncrDecrService ) { }

  isSearchLoaderForOrder=false;
  isSearchLoaderForOwner=false;
  influencingType= [];
  newAgeBusinessPartner=[];
  opportunityId;
  wiproType= [];
  tcvSolutionValue;
  type="";
  typeId= "";
  arrowkeyLocation=0;
  solutionValue;
  OverallTCV;
  userId;
  opportunityName;
  decr;
  percentageValue=0;
  // opportunityStatusCheck;
  // fullAccessFromCreatePage;
  // disableFields = false;
  solutionDiff= 0;
  percentage= 0;
  currencyId;
  businessSolutionData=[];
  businessSol = [];

  ngOnInit() {

    this.decr = localStorage.getItem('userID');
    this.userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');

    console.log("UserId: ", this.userId);

    this.opportunityId = this.projectService.getSession('opportunityId');
    console.log("this.opportunityId: ", this.opportunityId );
    this.opportunityName = this.projectService.getSession('opportunityName');
    this.currencyId = this.projectService.getSession('currencyId');

    this.solutionValue= 0;
    this.OverallTCV = 0;
    this.percentageValue=0;
    this.solutionDiff = 0;

    this.service.loaderhome = true;
      this.service.getWiproInfluencingType().subscribe(res=>{
        this.service.loaderhome = false;
        console.log("reasonOptionSet: ",res);

        debugger;
        if((res.IsError)== false){
          if(res.ResponseObject !=null && res.ResponseObject.length !=0){
           this.influencingType = res.ResponseObject;

          }
          else{
            this.projectService.displayMessageerror("Unable to get data.");
          }
        }
      },
      err => {
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
        //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});
        }
      )

      this.service.loaderhome = true;
      // this.service.getTcvAndSolutionValue(this.opportunityId).subscribe(res=>{
      //   this.service.loaderhome = false;
      //   console.log("reasonOptionSet: ",res);

      //   debugger;
      //   if((res.IsError)== false){
      //     if(res.ResponseObject !=null && res.ResponseObject.length !=0){
      //      this.tcvSolutionValue = res.ResponseObject;
      //      console.log("this.tcvSolutionValue: ", this.tcvSolutionValue);
      //       this.solutionValue = res.ResponseObject.WiproSolutionTCV;
      //       this.OverallTCV = parseFloat(res.ResponseObject.WiproOverallTCV.toString());
      //       console.log("this.solutionValue: ", this.solutionValue);
      //       console.log("this.OverallTCV: ",this.OverallTCV);
      //        this.totalValue = this.solutionValue;
      //        this.totalValueForTcv = this.solutionValue;
      //        this.solutionDiff = this.OverallTCV - this.solutionValue;

      //        if( this.solutionValue>0){
      //          this.percentage = (this.solutionValue/this.OverallTCV)*100;
      //        }
      //        else{
      //          this.percentage =0;
      //       }

      //     }
      //     else{
      //       this.projectService.displayMessageerror("Unable to get data.");
      //     }
      //   }
      // },
      // err => {
      //   this.service.loaderhome = false;
      //   this.projectService.displayerror(err.status);
      //   //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});
      //   }
      // )

      this.service.loaderhome = true;
      this.projectService.getBusinessSolutions(this.opportunityId).subscribe(res=>{
        this.service.loaderhome = false;
        if((res.IsError)== false){
          if(res.ResponseObject !=null && res.ResponseObject.length !=0){
            this.OverallTCV = parseFloat(res.ResponseObject.OppBSP.OverallTcv);            
            
           this.businessSolutionData = res.ResponseObject.WiproBusinessSolutionDtls;
           for(var i=0; i< this.businessSolutionData.length ; i++){
             if(this.businessSolutionData[i].WiproType== "184450002"){
              this.solutionValue=this.solutionValue+this.businessSolutionData[i].WiproValue;
              this.businessSol.push(this.businessSolutionData[i]);
             }
           }
            if( this.solutionValue>0){
               this.percentageTotal = (this.solutionValue/this.OverallTCV)*100;
             }
             else{
               this.percentageTotal =0;
            }
            this.solutionDiff = this.OverallTCV - this.solutionValue;
          }
          else{
            this.projectService.displayMessageerror("Unable to get data.");
          }
        }
      },
      err => {
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
        //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});
        }
      )

      this.wiproType =[
        {
           "Name": "New age business partner",
           "Id": 184450002
         },
         {
          "Name": "New Alliance",
          "Id": 184450000
        }
       ]

       for(var i =0; i< this.wiproType.length; i++) {
          if(this.wiproType[i].Name.toUpperCase() == "NEW AGE BUSINESS PARTNER"){
              this.type = this.wiproType[i].Name;
              this.typeId = this.wiproType[i].Id;
          }
       }
       this.addcompetitor();

  }


  tcvChange(data){
    data.isMandatoryTCV = false;
  }
  // nameChange(data){
  //   debugger;
  //   data.isMandatoryName = false;
  // }
  valueChange(data){
    data.isMandatoryValue = false;
  }
  // business_data=[
  //   {
  //     "id":"1",
  //     "disabled":true,
  //     "isCheccked":false
  //   },
  //   { "id":"2",
  //   "disabled":false,
  //   "isCheccked":false
  //   },
  //   {
  //     "id":"3",
  //     "disabled":false,
  //     "isCheccked":false
  //   },
  // ]



  addcompetitor()
  {
    this.newAgeBusinessPartner.push(

        {
           "OwnerIdValueName":"",
           "OwnerIdValue":"",
           "WiproAccountNameValue":"",  // influence type id
           "OppSulitonID":"",   // influence type id
           "WiproInfluenceType": "",   // influence type id
           "influencingTypeId": "",
           "WiproName":"",   //nameName
           "WiproOpportunitySolutionDetailId":"",
           "WiproPercentage": false,   // checkbox
           "WiproPercentageOfTCV": "",  //tcv
           "disableTcv": true,
           "WiproServiceType":"",   //s service type id
           "disableServiceType": true,
           "WiproSolutionBDMValue":"",
           "WiproSolutionBDMName":"",  /// solution BDM
           "WiproSolutionNameValue":"",
           "WiproType":this.typeId,   //type
           "WiproTypeName": this.type,
           "WiproValue": "",  //value
           "WiproAccountname": "",
           "WiproOpportunityId": this.opportunityId,   //opportunity Id
           "OwnerId":"",
           "isMandatoryName": false,
           "isMandatoryTCV": false,
           "isMandatoryOwner":false,
           "isMandatoryValue": false,
           "WiproCurrency": this.currencyId,
           "isMandatoryInfluenceType": false,
           "isMandatoryServiceType": false,
           "append": 0,


        }
    )
  }


  deletecompetitor(index)
  {

    this.newAgeBusinessPartner.splice(index, 1);
    this.projectService.displayMessageerror("Record deleted successfully.");
   // this.newAgeBusinessPartner =  this.newAgeBusinessPartner.filter(x=>x.id != id)
  }

  ownerIdMatchFlag = 0;
 saveFlag = 0;
 sumOfValues=0;
 percentageTotal= 0;
  saveNewAgeBusinessPartner(){
    this.sumOfValues=0;
    this.sumOfValues= this.solutionValue;
    // this.percentageTotal = this.percentage;
    console.log("new aGE BUSINESS PARTNER:  ", this.newAgeBusinessPartner);
   debugger;
    this.saveFlag = 0;
    this.ownerIdMatchFlag = 0;
    var loop=0;

    if( this.newAgeBusinessPartner.length >0){
      for(var i =0; i< this.newAgeBusinessPartner.length; i++){
          this.newAgeBusinessPartner[i].isMandatoryName= false;
          this.newAgeBusinessPartner[i].isMandatoryTCV = false;
          this.newAgeBusinessPartner[i].isMandatoryValue = false;
          this.newAgeBusinessPartner[i].isMandatoryServiceType = false;
          this.newAgeBusinessPartner[i].isMandatoryInfluenceType = false;

          debugger;
          // if(this.newAgeBusinessPartner[i].OwnerIdValue != this.userId){
          //   this.ownerIdMatchFlag = 1;
          //   this.projectService.displayMessageerror("The selected account owner is not the logged in user in row "+ loop+1 + ".");
          //   break;
          // }
          // else{
            this.sumOfValues = parseFloat(this.sumOfValues.toString()) + parseFloat(this.newAgeBusinessPartner[i].WiproValue);
            console.log("sum of values: ",typeof this.sumOfValues);
            this.percentageTotal = this.percentageTotal + parseFloat(this.newAgeBusinessPartner[i].WiproPercentageOfTCV);
            console.log("percent total type: ",typeof this.percentageTotal);
            loop= i+1;
            console.log(this.sumOfValues , this.sumOfValues );
            console.log("typeof this.newAgeBusinessPartner[i].WiproValue: ",typeof this.newAgeBusinessPartner[i].WiproValue);

              if (this.newAgeBusinessPartner[i].WiproAccountname== "" || this.newAgeBusinessPartner[i].WiproAccountname== null || this.newAgeBusinessPartner[i].WiproAccountname== undefined ){
                  //this.projectService.displayMessageerror("Enter a Name in "+ loop + " row.");
                  this.saveFlag = 1;
                  this.newAgeBusinessPartner[i].isMandatoryName= true;
              //   break;
                }
                if(this.newAgeBusinessPartner[i].OwnerIdValueName== "" || this.newAgeBusinessPartner[i].OwnerIdValueName== null || this.newAgeBusinessPartner[i].OwnerIdValueName== undefined){
                    this.saveFlag =1;
                    this.newAgeBusinessPartner[i].isMandatoryOwner=true;
                }
                if(this.newAgeBusinessPartner[i].disableTcv == true){
                      if (this.newAgeBusinessPartner[i].WiproValue== "" || this.newAgeBusinessPartner[i].WiproValue== null || this.newAgeBusinessPartner[i].WiproValue== undefined ){
                      // this.projectService.displayMessageerror("Enter a Value in "+ loop + " row.");
                        this.newAgeBusinessPartner[i].isMandatoryValue= true;
                        this.saveFlag = 1;
                        //break;
                      }

                }
                  else{
                  if(this.newAgeBusinessPartner[i].WiproPercentageOfTCV== "" || this.newAgeBusinessPartner[i].WiproPercentageOfTCV== null || this.newAgeBusinessPartner[i].WiproPercentageOfTCV== undefined){
                  // this.projectService.displayMessageerror("Enter % of TCV in "+ loop + " row.");
                    this.newAgeBusinessPartner[i].isMandatoryTCV= true;
                    this.saveFlag = 1;
                    //break;

                  }
            //  }
              console.log("Sum of values: ", this.sumOfValues);
            }

            console.log("data.WiproInfluenceType: ", this.newAgeBusinessPartner[i].WiproInfluenceType);
            console.log("data.WiproServiceType: ", this.newAgeBusinessPartner  [i].WiproServiceType);

           if( this.newAgeBusinessPartner[i].WiproInfluenceType == "" || this.newAgeBusinessPartner[i].WiproInfluenceType == null || this.newAgeBusinessPartner[i].WiproInfluenceType == undefined ){
             this.newAgeBusinessPartner[i].isMandatoryInfluenceType = true;
             this.saveFlag = 1;
           }
           else{
             if( (this.newAgeBusinessPartner[i].WiproInfluenceType == "184450000") && ( this.newAgeBusinessPartner[i].WiproServiceType=="" || this.newAgeBusinessPartner[i].WiproServiceType== null ||  this.newAgeBusinessPartner[i].WiproServiceType== undefined)){
               this.newAgeBusinessPartner[i].isMandatoryServiceType = true;
               this.saveFlag = 1;
             }
           }

            console.log("this.newAgeBusinessPartner[i].WiproValue: ",this.newAgeBusinessPartner[i].WiproValue);
            console.log("this.newAgeBusinessPartner[i].WiproValue type ",typeof this.newAgeBusinessPartner[i].WiproValue);

            debugger;
            if(this.newAgeBusinessPartner.length>0){
              console.log("type of wipro value: ", typeof parseFloat(this.newAgeBusinessPartner[i].WiproValue));
              if( this.newAgeBusinessPartner[i].WiproValue > 0 && (typeof parseFloat(this.newAgeBusinessPartner[i].WiproValue) == "number") ) {
                  if(this.newAgeBusinessPartner[i].OwnerIdValue != this.userId){
                      this.ownerIdMatchFlag = 1;
                      this.projectService.displayMessageerror("The selected account owner is not the logged in user in row "+ loop + ".");
                      //   break;
                    }
                }
                else{
                  if(this.newAgeBusinessPartner[i].WiproValue <= 0 && (typeof  parseFloat(this.newAgeBusinessPartner[i].WiproValue) == "number")){
                  this.projectService.displayMessageerror("The value should be greater than 0 in row "+ loop + ".");
                  }

               }
            }

            console.log(this.businessSol);
            if(this.businessSol.length>0){
              for(var j = 0; j< this.businessSol.length; j++){
                if(this.businessSol[j].WiproAccountNameValue == this.newAgeBusinessPartner[i].WiproAccountNameValue ){
                  this.projectService.displayMessageerror("The record in row number "+ (i+1) + " already exists.");
                  this.saveFlag = 1;
                  break;
                }
              }
            }

            }

            debugger;
            //if(this.sumOfValues<= this.OverallTCV){
            if(this.sumOfValues<= this.OverallTCV && this.sumOfValues>0){
              if(this.saveFlag==0 && this.ownerIdMatchFlag==0){

              //  if(this.s==1){
                this.service.saveNewAgeBusinessPartner(this.newAgeBusinessPartner).subscribe(res => {
                 //   this.service.loaderhome= false;
                  debugger;

                    if(res.ResponseObject== true){

                      this.projectService.accessModifyApi(this.projectService.getSession("AdvisorOwnerId"),this.projectService.getSession("userEmail")).subscribe((res)=>
                        {
                          if(res)
                          {
                            console.log("res: ", res);
                              if(res.isError)
                              {
                                this.projectService.displayMessageerror("Problem in saving data.");
                                this.service.loaderhome=false;
                              }
                              else
                              {
                                this.projectService.setSession('IsPreSaleAndRole',res.ResponseObject.UserRoles.IsPreSaleAndRole);
                                this.projectService.setSession('IsGainAccess',res.ResponseObject.IsGainAccess);
                                this.projectService.setSession('FullAccess',res.ResponseObject.FullAccess);
                                this.projectService.setSession('roleObj',res.ResponseObject);
                                this.service.loaderhome=false;

                                this.projectService.displayMessageerror("Data saved successfully.");
                                this.router.navigate(['/opportunity/opportunityview/businesssolution']);
                              }
                            }
                        });
                    }
                    else{
                      this.projectService.displayMessageerror("Problem in saving data.");
                    }

                    },
                    err => {
                      this.service.loaderhome= false;
                      this.projectService.displayerror(err.status);
                    }
                );
                //   }
              }
            }
            else {
              console.log("typeof this.newAgeBusinessPartner[0].WiproValue", typeof this.newAgeBusinessPartner[0].WiproValue)
                if( this.newAgeBusinessPartner.length >0 &&  ( this.newAgeBusinessPartner[0].WiproValue > 0 && (typeof parseFloat(this.newAgeBusinessPartner[0].WiproValue) == "number") ) && this.sumOfValues > this.OverallTCV  ){

                  this.projectService.displayMessageerror("The total of the value fields can't be greater than "+ (this.OverallTCV-this.solutionValue) );

                }
              }

        }
        else{
          this.projectService.displayMessageerror("Add a row to save data." );

        }
    }
  //  s= 0;

    // this.service.saveNewAgeBusinessPartner(this.newAgeBusinessPartner).subscribe(res => {
    //   this.service.loaderhome= false;
    //   //debugger;

    //   if(res.ResponseObject== true){
    //     this.projectService.displayMessageerror("Data saved successfully.");
    //   }
    //   else{
    //     this.projectService.displayMessageerror("Problem in saving data.");
    //   }
    //   debugger;


    // },
    //   err => {
    //     this.service.loaderhome= false;
    //     this.projectService.displayerror(err.status);
    //   }
    // );

//  }

//disableTcv= true;

  checkboxClicked(event, index, data){
    debugger;
    //data.check = event.checked;
    console.log("event:", event);
    console.log("event:", event.checked);
    console.log("index: ", index);
    console.log("data: ", data);

    if(data.WiproPercentage == true){
      data.disableTcv = false;
    }
    else{
      data.disableTcv= true;
    }
    console.log("newAgeBusinessPartner : " , this.newAgeBusinessPartner);
  }


// name autocomplete starts here
nameName: string = "";
nameNameSwitch: boolean = true;
//selectedname: {}[] = [];
selectedname = [];
isSingleOwner = false;

nameNameclose(data) {

  data.nameNameSwitch = false;
  debugger;
  if(data.append == 0){
    data.WiproAccountname = "";
    data.WiproAccountNameValue = "";
    data.OwnerIdValueName = "";
    data.OwnerIdValue = "";
  }
}
appendname(item,data) {

  data.isMandatoryName= false;
  this.selectedname= [];

  this.selectedname.push(item);

  data.WiproAccountname = item.Name;
  data.nameNameSwitch = false;
  data.WiproAccountNameValue = this.selectedname[0].SysGuid;
  data.append = 1;
  this.getOwnerArray(data,"",'INITIAL');
}

getOwnerArray(data,searchText,type?)
{
      this.isSearchLoaderForOwner=true;
      this.service.getAccountOwner(data.WiproAccountNameValue,searchText).subscribe(res => {
        this.isSearchLoaderForOwner= false;
        this.wiproOwner=[];

        if(res){
          this.ownerData = res;

          if(this.ownerData.ResponseObject.length>0){
            this.wiproOwner=res.ResponseObject;
            this.TotalRecordCount=res.ResponseObject.length;
          }

          for(let i=0;i<this.wiproOwner.length;i++)
          {
            this.wiproOwner[i]["Id"]=this.wiproOwner[i]["SysGuid"];
          }
          if(this.ownerData.ResponseObject.length == 1 && type == 'INITIAL')
          {
            this.isSingleOwner = true;
            data.OwnerIdValueName = res.ResponseObject[0].Name;
            data.OwnerIdValue =  res.ResponseObject[0].SysGuid;
          }
        }
      },
        err => {
          this.service.loaderhome= false;
          this.projectService.displayerror(err.status);
        }
      );
}


getOwner(data){
     this.isSearchLoaderForOwner=true;
      this.service.getAccountOwner(data.WiproAccountNameValue,data.OwnerIdValueName).subscribe(res => {
        this.isSearchLoaderForOwner= false;
        this.wiproOwner=[];

        if(res){
          this.ownerData = res;

          if(this.ownerData.ResponseObject.length>0){
            this.wiproOwner=res.ResponseObject;
            this.TotalRecordCount=res.ResponseObject.length;
          }

          for(let i=0;i<this.wiproOwner.length;i++)
          {
            this.wiproOwner[i]["Id"]=this.wiproOwner[i]["SysGuid"];
          }
        }
      },
        err => {
          this.service.loaderhome= false;
          this.projectService.displayerror(err.status);
        }
      );
}


wiproname: {}[] = [

]

wiproOwner:{}[] =[];
TotalRecordCount=0;

nameData;
ownerData;
getName(data){

  this.wiproname= [];
  data.OwnerIdValueName = "";
  data.OwnerIdValue= "";

  
  this.isSearchLoaderForOrder= true;
  this.service.getAccountCategoryList(data.WiproAccountname, "", this.userId).subscribe(res => {
    this.isSearchLoaderForOrder= false;
    this.wiproname = [];
    this.nameData = res;
    for(var i= 0; i< this.nameData.ResponseObject.length; i++){
      this.nameData.ResponseObject[i].Name = this.getsymbolNew(this.nameData.ResponseObject[i].Name);
      this.nameData.ResponseObject[i].Id = this.nameData.ResponseObject[i].SysGuid;
      this.wiproname.push(this.nameData.ResponseObject[i]);
    }
       if(this.wiproname.length>1){
         data.append = 0;
       }
       if(this.wiproname.length ==1){
         data.append = 1;
       }
  },
    err => {
      this.service.loaderhome= false;
      this.projectService.displayerror(err.status);
    }
  );
}

// name autocomplete ends here

// OWNER autocomplete starts here
ownerName: string = "";
ownerNameSwitch: boolean = true;

ownerNameclose(data) {

  data.ownerNameSwitch = false;
}
getsymbolNew(data) {
      data = this.escapeSpecialChars(data);
      return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
    }

escapeSpecialChars(jsonString) {
  return jsonString.replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t")
      .replace(/\f/g, "\\f");

}
appendowner(item,data) {
  data.OwnerIdValueName = item.Name;
  data.OwnerIdValue = item.SysGuid;
  this.selectedowner.push(item)
}

wiproowner: {}[] = [
  // { index: 0, maintitle: 'Owner 1', subtitle: 'Sathish R Theetha', value: true },
  // { index: 1, maintitle: 'Owner 2', subtitle: 'Sathish R Theetha', value: false },
  // { index: 2, maintitle: 'Owner 3', subtitle: 'Sathish R Theetha', value: false },
  // { index: 3, maintitle: 'Owner 4', subtitle: 'Sathish R Theetha', value: false },
]

selectedowner= [];
// OWNER autocomplete ends here

// SOLUTION BDM autocomplete starts here
solbdmName: string = "";
solbdmNameSwitch: boolean = true;

solbdmNameclose(data) {

  data.solbdmNameSwitch = false;
}
appendsolbdm(value: string, i,data) {
  debugger;
  data.solbdmName = value;
  this.selectedsolbdm.push(this.wiprosolbdm[i])
}


solBDMData;
wiprosolbdm: {}[] = [ ]


getSoultionBDM(data){
  debugger;
  console.log("get name Data: ", data);
  this.wiprosolbdm= [  ];

  console.log( " this.wiproeventtype", this.wiprosolbdm.length);
  this.service.loaderhome= true;
  this.service.getSolutionBDM(data).subscribe(res => {
    this.service.loaderhome= false;

    debugger;
    this.solBDMData = res;
    console.log("Name Data: " , this.solBDMData);

  if(this.solBDMData.IsError == false){
   // this.nameData = res;

    for(var i= 0; i< this.solBDMData.ResponseObject.length; i++){

       var obj= {};

       Object.assign(obj, {index: i});
       Object.assign(obj, {fullName: this.solBDMData.ResponseObject[i].FullName});
       Object.assign(obj, {sysGuid: this.solBDMData.ResponseObject[i].SysGuid});
       Object.assign(obj, {ownerId: this.solBDMData.ResponseObject[i].ownerId});

        this.wiprosolbdm.push(obj);
      }
      console.log("wiprosolbdm : " , this.wiprosolbdm);
    }
  else{
    this.projectService.displayMessageerror("Error in getting the list.");
  }
  },
    err => {
      this.service.loaderhome= false;
      this.projectService.displayerror(err.status);
    }
  );
}

selectedsolbdm: {}[] = [];
// SOLUTION BDM autocomplete ends here

//influencingUnitName="";
serviceType= [];

tcvInputChanged(data){

  debugger;
  console.log("tcv data: ", data);
  console.log(data.WiproPercentageOfTCV);

 // data.WiproPercentageOfTCV = data.WiproPercentageOfTCV.toFixed(2);
    //var x= ( data.WiproPercentageOfTCV/100 ) * this.OverallTCV;

    var check = this.OverallTCV-this.solutionValue;
    var totalPercentage = 0;

    data.WiproValue = parseFloat( ((data.WiproPercentageOfTCV/100)* this.OverallTCV).toString()).toFixed(2);


    for(var i= 0; i< this.newAgeBusinessPartner.length; i++){
      totalPercentage = totalPercentage+ this.newAgeBusinessPartner[i].WiproPercentageOfTCV;
      console.log(totalPercentage);
    }

  if(totalPercentage <= 100){
     // if( x <= 100 ){
       console.log(typeof data.WiproPercentageOfTCV);

      console.log("data.WiproValue: ",data.WiproValue);
  }
  else{

    this.projectService.displayMessageerror("The sum of percentage in all the percentage fields be should less than or equal to 100.");
  }
}

msg;
valueChanged(data){
  debugger;
  console.log("value data: ", data.WiproValue);

    var totalSolutionValue =0;

    data.WiproPercentageOfTCV= parseFloat(( (data.WiproValue/this.OverallTCV)*100 ).toString()).toFixed(2);

    console.log("newAgeBusinessPartner: ", this.newAgeBusinessPartner);

    for(var i= 0; i< this.newAgeBusinessPartner.length; i++){
      totalSolutionValue = totalSolutionValue+ this.newAgeBusinessPartner[i].WiproValue;
      console.log(totalSolutionValue);
    }

    if( totalSolutionValue <= this.solutionDiff){
     
     }
    else{
       this.projectService.displayMessageerror("The sum of the values in the value columns should be less than or equal to "+ this.solutionDiff);
     }
}

influencingTypeChange(data){
  console.log("data: ",data);
  debugger;
  data.disableServiceType= true;
  data.isMandatoryInfluenceType = false;

  for(var i=0; i<this.influencingType.length; i++){
    if(this.influencingType[i].Name.toUpperCase() == data.influencingTypeId.toUpperCase()){
      data.WiproInfluenceType = this.influencingType[i].Id;
    }
  }

  if(data.WiproInfluenceType == "184450000"){
    data.disableServiceType= false;

      this.service.getWiproServiceType().subscribe(res=>{
        this.service.loaderhome = false;
        debugger;
        if((res.IsError)== false){
          if(res.ResponseObject !=null && res.ResponseObject.length !=0){
            this.serviceType = res.ResponseObject;
            console.log("this.serviceType: ",this.serviceType);
          }
          else{
            this.projectService.displayMessageerror("Unable to get data.");
          }
        }
      },
      err => {
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
        //this.snackBar.open("Error. Try after sometime!!", this.action, { duration:3000});
        }
      )
    }
    else{
      data.serviceTypeId= "";
      data.WiproServiceType = "";
      //data.disableServiceType = true;
    }

  }

  serviceTypeChange(data){
    debugger;
    data.isMandatoryServiceType = false;
    for(var i=0; i< this.serviceType.length; i++){
      if(this.serviceType[i].Name.toUpperCase() == data.WiproServiceType.toUpperCase() ){
        data.serviceTypeId = this.serviceType[i].Id;
      }
    }
  }

  goBack() {
    window.history.back();
  }



    // Advance lookup ************

       selectedLookupData(controlName) {
      console.log(controlName);

      //this.sapArrayForLookUp && this.sapArrayForLookUp.length > 0 && this.sapArrayForLookUp[0].SysGuid
      switch(controlName) {
        case  'New age business partner' : {
          console.log("SelectedCheck",this.selectedname.length);
          return (this.selectedname.length > 0 && this.selectedname[0].Id) ? this.selectedname : []
        }

        case  'New age business partner owner' : {
          console.log("SelectedCheck",this.selectedowner.length);
          return (this.selectedowner.length > 0 && this.selectedowner[0].Id) ? this.selectedowner : []
        }

      }
  }

  IdentifyAppendFunc ={
    'New age business partner' : (data, rowData)=>{this.appendname(data, rowData)},
    'New age business partner owner' : (data, rowData)=>{this.appendowner(data, rowData)},
  }

  // ********advance look up

    lookupdata={
      tabledata: [],
      recordCount: 10,
      headerdata:[],
      Isadvancesearchtabs: true,
      isCheckboxRequired:false,
      controlName: "",
      lookupName: "",
      inputValue: "",
      TotalRecordCount :0,
      selectedRecord:[],
      nextLink: "",
      isLoader:false,
      pageNo: 1,
    };

    isAccount=true;
    openadvancetabs(controlName, initialLookupData, value, rowData): void {
      
      console.log("rowData.append: ",rowData.append);

      this.lookupdata.controlName = controlName;
      this.lookupdata.inputValue = value;
      this.lookupdata.headerdata = campaignHeaders[controlName];
      this.lookupdata.lookupName= campaignNames[controlName]['name'];
      this.lookupdata.isCheckboxRequired =  campaignNames[controlName]['isCheckbox'];
      this.lookupdata.Isadvancesearchtabs = campaignNames[controlName]['isAccount'];
      this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
      if(controlName== "New age business partner"){
        // this.selectedname.push({'Id':rowData.SysGuid});

            // this.lookupdata.inputValue= "";
            this.lookupdata.tabledata = this.nameData;
            this.lookupdata.TotalRecordCount =   this.nameData.TotalRecordCount;
            this.lookupdata.nextLink =  this.nameData.OdatanextLink;
            console.log('this.lookupdata.TotalRecordCount : ', this.lookupdata.TotalRecordCount);
            console.log('this.lookupdata.nextLink : ', this.lookupdata);
            this.service.getLookUpFilterData({ data:initialLookupData , controlName: controlName, isService: false, useFullData: null , userId: this.userId}).subscribe(res => {
                  this.lookupdata.tabledata = res;
                  console.log("Table Data: ",this.lookupdata.tabledata);

                })

        }
        else
        {
           this.selectedowner.push({'Id':rowData.SysGuid});
           this.lookupdata.tabledata = this.ownerData;
           this.lookupdata.TotalRecordCount =   this.ownerData.TotalRecordCount;
           this.lookupdata.nextLink =  this.ownerData.OdatanextLink;
           this.service.getLookUpFilterData({ data:initialLookupData ,controlName: controlName, isService: false, useFullData: null , userId: this.userId}).subscribe(res => {
                  this.lookupdata.tabledata = res;
                  console.log("Table Data: ",this.lookupdata.tabledata);

                })
        }
      const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
        width: this.service.setHeaderPixes(this.lookupdata.headerdata.length,this.lookupdata.Isadvancesearchtabs),
        data:this.lookupdata,
        disableClose: true
      });

   

      dialogRef.componentInstance.modelEmiter.subscribe((x) => {

        debugger;
        console.log(x)
        if(x.action=='loadMore'){

              let dialogData = {
              searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
              recordCount: this.lookupdata.recordCount,
              OdatanextLink: this.lookupdata.nextLink,// need to handel the pagination and search!
             // pageNo: this.lookupdata.pageNo//+1//need to handel from pagination
              //pageNo: this.lookupdata.pageNo
              pageNo: x.currentPage,

              }

        this.service.getLookUpFilterData({ data: rowData, controlName: controlName, isService: true, useFullData: { ...dialogData } , userId: this.userId}).subscribe(res => {
          debugger;
          this.lookupdata.isLoader=false;
              this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
              this.lookupdata.pageNo = res.CurrentPageNumber;
              this.lookupdata.nextLink = res.OdatanextLink
            //  this.lookupdata.recordCount = res.PageSize

        })

        }else if(x.action=='search'){

          debugger;
              this.lookupdata.tabledata = []
              this.lookupdata.nextLink =''
              this.lookupdata.pageNo = 1

              let dialogData = {
              searchVal: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
              recordCount: this.lookupdata.recordCount,
              OdatanextLink: this.lookupdata.nextLink,// need to handel the pagination and search!
             // pageNo: this.lookupdata.pageNo//+1//need to handel from pagination
              //pageNo: this.lookupdata.pageNo
              //pageNo: this.lookupdata.pageNo
              pageNo: x.currentPage,

            }

            this.service.getLookUpFilterData({ data: rowData, controlName: controlName, isService: true, useFullData: { ...dialogData }, userId: this.userId }).subscribe(res => {
              debugger;
              this.lookupdata.isLoader=false;
                  this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
                  this.lookupdata.pageNo = res.CurrentPageNumber;
                  this.lookupdata.nextLink = res.OdatanextLink
                  //this.lookupdata.recordCount = res.PageSize
                  this.lookupdata.TotalRecordCount = res.TotalRecordCount
                })
              }
         });


      dialogRef.afterClosed().subscribe(result => {
        debugger
        if (result) {
          console.log(result)
          this.AppendParticularInputFun(result.selectedData,result.controlName, rowData)
        }
      });

    }

    AppendParticularInputFun(selectedData,controlName, rowData) {
      debugger;
      console.log(selectedData);
      switch(controlName) {
        case  'New age business partner' : {this.wiproname = [];this.selectedname = selectedData[0]}
       case  'New age business partner owner' : {this.wiproOwner = [];this.selectedowner = selectedData[0]}   

      }

      if(selectedData){
        if(selectedData.length>0){
          console.log(selectedData);
          selectedData.forEach(data => {
            this.IdentifyAppendFunc[controlName](data,rowData)
          });
        }
      }
    }

    // LeadGuid : any;
    // getCommonData() {
    //   return {
    //     // guid: this.accountDetails.SysGuid,
    //     // isProspect: this.accountDetails.isProspect,
    //   }
    // }
//************************************** */
}

//}
