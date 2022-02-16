import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataCommunicationService, OpportunitiesService, ErrorMessage, OrderService } from '@app/core';
import { FileUploader } from 'ng2-file-upload';
import { Observable, Subject, of } from 'rxjs';
import { CloseReasonService } from '@app/core/services/close-reason.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { EncrDecrService } from '@app/core/services/encr-decr.service';

const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

@Component({
  selector: 'app-closereason',
  templateUrl: './closereason.component.html',
  styleUrls: ['./closereason.component.scss'] 
})
export class ClosereasonComponent implements OnInit, OnDestroy {
  // projectService:any
  constructor(public service: DataCommunicationService,
    private closeReasonService: CloseReasonService,
    private orderService: OrderService,
    public projectServices: OpportunitiesService,
    public errorMessage: ErrorMessage,
    public matSnackBar: MatSnackBar,
    private fb: FormBuilder, private EncrDecr: EncrDecrService) {
    this.saveWinReasonDetails = this.saveWinReasonDetails.bind(this);
    this.eventSubscriber(this.service.subscription, this.saveWinReasonDetails);
  }
  categoryOptionSets: any = [];
  informationOptionSets: any = [];
  winOptionSets: any = [];
  winSaveDetails: any = [];
  details: any = [];
  winReasonRetriveDetails:any = [];
   contcountry5: string = "";
   orderflag:boolean = false;
   
  // competitor_data1 = [
  //   {}, {}, {}, {}, {}
  // ];
    fullAccessSessionCheck = this.projectServices.getSession('FullAccess') || false;
  OpportunityId = this.projectServices.getSession('opportunityId');
 OrderCreateSuccess = this.projectServices.getSession('orderId');
  
  competitor_data1: any = [];
  subscription;
  initial: boolean;
  reasons = ['Reason_1', 'Reason_2', 'Reason_3'];
  Reason_1: FormGroup;
  Reason_2: FormGroup;
  Reason_3: FormGroup;
  saveValidRow: any = [];
  orderId: string;
  resultReasonForm: any = [{
    wentWell: '',
    notWell: '',
    improvement: '',
    validForm: true
  }, {
    wentWell: '',
    notWell: '',
    improvement: '',
    validForm: true
  }, {
    wentWell: '',
    notWell: '',
    improvement: '',
    validForm: true
  }];
  textValue = '';
Wonflag :boolean = false;
winCategoryFlag :boolean = false;
winReasonFlag:boolean = false;
additionalDetailFlag :boolean = false;
infoSourceFlag :boolean = false;

wentWell1 :boolean = false;
// wentWell2:boolean = false;
// wentWell3:boolean = false;

notWell1:boolean = false;
// // notWell2:boolean = false;
// // notWell3:boolean = false;


improveWell1:boolean = false;
// improveWell2:boolean = false;
// improveWell3:boolean = false;


editAccess: boolean;

autoFocus: boolean = false;
  // file upload functionality starts from here

  public uploader: FileUploader = new FileUploader({ url: URL });
  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;
  arr = [];

  ngOnInit() {
 
if(this.OrderCreateSuccess){
    this.orderflag = true;
  }

   
  console.log("oppertunityId", this.projectServices.getSession('opportunityId'));

 if (this.fullAccessSessionCheck == true)
 {
   
   console.log("OrFlag",this.orderflag)
   this.editAccess = false;
 }
 else {
 this.checkOrderBookingId();
 }
    console.log('opt',this.projectServices.getSession('opportunityId'));
         this.getWinCategoryOptionSet();
    this.getWinReasonInformationSource();
          this.winSaveDetailsInit();
          this.createReasonsForm();
          this.retriveWinDetails();
          this.retriveWinReasonDetails();
     
         
       
  }

// checking order created or not
checkOrderBookingId() {

  const payload = {
    Id: this.projectServices.getSession('opportunityId')
  };
  this.orderService.checkOrderBookingId(payload).subscribe((bookingId: any) => {
    if (!bookingId.IsError) {    
      this.orderId = bookingId.ResponseObject[0].SalesOrderId;
        const bookingIdPayload = {
          Guid: bookingId.ResponseObject[0].SalesOrderId
        };
        this.orderService.getSalesOrderDetails(bookingIdPayload).subscribe((orderDetails: any) => {
          // if(orderDetails.ApprovalStageId == 1){
          //   this.Wonflag = true;
          // }
       
let payload ={
      UserGuid : this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
      Guid : this.orderId?this.orderId:''
    }
           this.orderService.addRoleBaseAccess(payload).subscribe((data:any)=>{
      let access = data.ResponseObject;
      console.log("access data is", access);
      if(access){
        this.editAccess = false;
      }
      else{
        this.editAccess = true;     
      }
  
    })


        }, err => console.log(err));
    }
  }, err => console.log(err));
}

  getWinReasonInformationSource(i?, initial?) {

    this.closeReasonService.getWinReasonInformationSource()
      .subscribe(optionSetData => {
        debugger;
        console.log("informationOptionSets",optionSetData.ResponseObject);
        this.informationOptionSets = optionSetData.ResponseObject;
      });
  }

  getWinCategoryOptionSet() {
    this.closeReasonService.getWinCategoryOptionSet()
      .subscribe(optionSetData => {
        this.categoryOptionSets = optionSetData.ResponseObject;
        console.log("categoryOptionSets", this.categoryOptionSets);

      });
  }
  //Retrive Win dETAILS
  retriveWinDetails(){
this.competitor_data1 = [];
        let payloadRetriveData = {
      // Opp-ortunityId:"5B83CF48-4D68-E611-80D6-000D3A803BD6",
       OpportunityId: this.OpportunityId,
    }
    this.closeReasonService.retrieveWinDetails(payloadRetriveData).subscribe(retriveLossDetails => {
      console.log("ret",retriveLossDetails);
      let tempretriveWinDetails = (retriveLossDetails && retriveLossDetails.ResponseObject)?retriveLossDetails.ResponseObject:[];

if(tempretriveWinDetails.length>0){
      this.projectServices.winReasonSave=true;
      }
        for(let i=4; i>=0;i--){
                 if(i < tempretriveWinDetails.length){
            this.getWinReasonOptionSetForCategory(tempretriveWinDetails[i].WinCategoryValue, i,tempretriveWinDetails[i]);
                 }
                 else{

            this.getWinReasonOptionSetForCategory('', i,null);
                 }
        }

    })
  //   const payloadRetriveData = {
  //     OpportunityId: this.projectServices.getSession('opportunityId'),
  //   };
  //   this.closeReasonService.retrieveWinDetails(payloadRetriveData).subscribe(retriveWinDetails => {
  //     console.log(retriveWinDetails);
  //     if (retriveWinDetails.ResponseObject.length === 0) {
  //       this.initial = true;
  //       this.competitor_data1 = [
  //         {}, {}, {}, {}, {}
  //       ];

  // this.competitor_data1.map(data => {
  //   this.getWinCategoryOptionSet(this.initial);
  //   this.getWinReasonInformationSource();
  // });
  //     } else {
  //       this.initial = false;
  //        const retriveWinDetailsLength = retriveWinDetails.ResponseObject.length ;
  //     retriveWinDetails.ResponseObject.forEach((res, i) => {
  //       if (i < 5) {
  //         if (res.OpportunityWinDetailsId) {
  //           const winDefualtValueObj = {
  //             OpportunityId: this.projectServices.getSession('opportunityId'),
  //             WiproInformationSource: res.InformationSource,
  //             WiproWinCategories: res.WinCategoryValue,
  //             WinReasonId: res.WinReasonId,
  //             WiproAdditionalDetails: res.WiproAdditionalDetails,
  //            WiproOpportunityWinDetailsId: res.OpportunityWinDetailsId ? res.OpportunityWinDetailsId:''
  
  //           };
  //           this.winSaveDetails.push(winDefualtValueObj);
  //           this.competitor_data1.push(winDefualtValueObj);
  //           this.getWinCategoryOptionSet();
  //           const payload = {
  //             CategoryId: winDefualtValueObj.WiproWinCategories
  //           };
  //           this.getWinReasonOptionSet(payload, i);
  //           const evt = {target : {value: winDefualtValueObj.WiproAdditionalDetails}};
  //           this.getAdditionalTestDetails(evt, i);
  //           this.getWinReasonInformationSource(i);
  //         }
  //       }
  //     });
  //     if (retriveWinDetailsLength < 5) {
  //       const diff = 5 - retriveWinDetailsLength;
  //       for (let i = 0; i < diff; i++) {
  //         this.competitor_data1[retriveWinDetailsLength + i] = {};
  //         this.getWinCategoryOptionSet(this.initial);
  //         this.getWinReasonInformationSource();

  //       }

  //       }
  //   }
  //     //  retriveWinDetails.ResponseObject.map((res, i) => {
  //     //    if (res.OpportunityWinDetailsId) {
  //     //      this.competitor_data1[i]['OpportunityWinDetailsId'] = res.OpportunityWinDetailsId;
  //     //    }
  //     //  });
  //   });
  }

      getWinReasonOptionSetForCategory(WiproWinCategoryId, i,retriveWinDetails) {
  
      let winOptionSets = [];
      if(WiproWinCategoryId){
            let payload = {CategoryId: WiproWinCategoryId};
    this.closeReasonService.getWinReasonOptionSet(payload)
      .subscribe(res => {
        winOptionSets = (res && res.ResponseObject)?res.ResponseObject:[]; 
           this.creeateCompetetorData(retriveWinDetails,i,winOptionSets);
        console.log("winOptionSets",res);
      });
      }else{
        this.creeateCompetetorData(retriveWinDetails,i,winOptionSets);

      }

  }

  creeateCompetetorData(retriveWinDetails,i,winOptionSets){
     let getOBj={
         winOptionSets: winOptionSets,
         InformationSource   : retriveWinDetails && retriveWinDetails.InformationSource ? retriveWinDetails.InformationSource:"",
         OpportunityWinDetailsId: retriveWinDetails && retriveWinDetails.OpportunityWinDetailsId ? retriveWinDetails.OpportunityWinDetailsId:"",  
         WiproAdditionalDetails: retriveWinDetails && retriveWinDetails.WiproAdditionalDetails ? retriveWinDetails.WiproAdditionalDetails:"",
         WinCategoryValue: retriveWinDetails && retriveWinDetails.WinCategoryValue ? retriveWinDetails.WinCategoryValue:"",
         WinReasonId: retriveWinDetails && retriveWinDetails.WinReasonId ? retriveWinDetails.WinReasonId:"",
         isTouched:(retriveWinDetails && retriveWinDetails.OpportunityWinDetailsId)?true:false,
        }
//     retriveLossDetails.
        this.competitor_data1.push(Object.assign({},getOBj));
        console.log("wer"+i,this.competitor_data1);
  }
  // Retrive WinReason details
  retriveWinReasonDetails() {
    const _self = this;
    const payloadRetriveReasonData={
       OpportunityId: _self.projectServices.getSession('opportunityId'),
    }
     _self.closeReasonService.retrieveWinReasonDetails(payloadRetriveReasonData).subscribe(retriveWinReasonDetails =>{
     console.log("ReasonDetails",retriveWinReasonDetails);
     this.winReasonRetriveDetails =retriveWinReasonDetails.ResponseObject;
        if(this.winReasonRetriveDetails.length>0){
       this.projectServices.winReasonSave = true;
     } 


      if(retriveWinReasonDetails && retriveWinReasonDetails.ResponseObject){
        let wentWellArr = retriveWinReasonDetails.ResponseObject.map(res => {
          if (res.WiproType == 184450000) return res ? res.WiproComments : 'N/A';
        });
        let wentWrongArr = retriveWinReasonDetails.ResponseObject.map(res => {
          if (res.WiproType == 184450001)  return res ? res.WiproComments : 'N/A';
        });
        let improvArr = retriveWinReasonDetails.ResponseObject.map(res => {
         if (res.WiproType == 184450002) return res ? res.WiproComments : 'N/A';
        });



        // wentWrongArr.filter(item => item);
        // improvArr.filter(item => item);
        const filterUndefinedWentWellArr = wentWellArr;
        wentWellArr = filterUndefinedWentWellArr.filter(nonUndefined => {
          return nonUndefined !== undefined;
        });
        wentWellArr.filter(item => item).map((wentWell, colmnNum) => {
          if (colmnNum < 3) {
            const formName = 'Reason_' + (parseInt(colmnNum, 0) + 1);
            _self[formName].patchValue({wentWell: wentWell});
            // this[formName].controls['wentWell'].setValue(wentWell);
            _self.resultReasonForm[colmnNum]['wentWell'] = wentWell;
          }
        });
        const filterUndefinedWentWentWrongArr = wentWrongArr ;
        wentWrongArr = filterUndefinedWentWentWrongArr.filter(nonUndefined => {
          return nonUndefined !== undefined;
        });
        wentWrongArr.filter(item => item).map((wentWron, colmnNum) => {
          if (colmnNum < 3) {
            const formName = 'Reason_' + (parseInt(colmnNum, 0) + 1);
            _self[formName].controls['notWell'].setValue(wentWron);
            _self.resultReasonForm[colmnNum]['notWell'] = wentWron;
          }
        });

        const filterUndefinedWentImprovArr = improvArr;
        improvArr = filterUndefinedWentImprovArr.filter(nonUndefined => {
          return nonUndefined !== undefined;
        });
         improvArr.filter(item => item).map((impv, colmnNum) => {
          if (colmnNum < 3) {
            const formName = 'Reason_' + (parseInt(colmnNum, 0) + 1);
            _self[formName].controls['improvement'].setValue(impv);
            _self.resultReasonForm[colmnNum]['improvement'] = impv;
          }
        });
        console.log(this.Reason_1.value);
           console.log(_self.Reason_2.value);
        console.log(_self.Reason_3.value);
      }else{
       _self.resultReasonForm=[];
     }
    })
    debugger;
    console.log("Reason1",this.Reason_1, this.resultReasonForm);
     this.resultReasonForm[2]=this.Reason_3.value;
        this.resultReasonForm[0]=this.Reason_1.value;
    this.resultReasonForm[1]=this.Reason_2.value;
  }


//       /***********************************SAURAV CODE  ******************************/




 getWellData(event) {
  this.resultReasonForm[0].isTouched  = true;

     this.resultReasonForm[0]['wentWell1'] = event.target.value;
      let flag = event.target.name;
       if(flag === 'wentWell1'){
         this.resultReasonForm[0].wentWell1 = false;
       }
 }

getNotWellData(event){
   this.resultReasonForm[0].isTouched  = true;
     this.resultReasonForm[0]['notWell1'] = event.target.value;
       let flag = event.target.name;
       if(flag === 'notWell1'){
         this.resultReasonForm[0].notWell1 = false;
       }
 }
getImproveData(event){
 this.resultReasonForm[0].isTouched  = true;
     this.resultReasonForm[0]['improveWell1'] = event.target.value;
       let flag = event.target.name;
       if(flag === 'improveWell1'){
         this.resultReasonForm[0].improveWell1 = false;
}

}
  getFormReasonData(event) {}
  
//   let flag2 = event.target.name;
// if(flag2 === 'improveWell1'){
//  this.resultReasonForm[0].improveWell1 = false;
//   }

// this.resultReasonForm[1]['wentWell'] = event.target.value;
//   if(flag === 'wentWell2'){
//  this.resultReasonForm[i].wentWell2 = false;
//   }
//   if(flag === 'wentWell3'){
//  this.resultReasonForm[i].wentWell3 = false;
//   }


    /***********************************SAURAV CODE ON notwell METHOD ******************************/
//  this.resultReasonForm[i][Reason_1]['notWell'] = event.target.value;
//  let flag1 = event.target.name;
// if(flag === 'notWell1'){
//  this.resultReasonForm[0].notWell1 = false;
//   }


// //   if(flag === 'notWell2'){
// //  this.resultReasonForm[i].notWell2 = false;
// //   }
// //   if(flag === 'notWell3'){
// //  this.resultReasonForm[i].notWell3 = false;
// //   }


//     /***********************************SAURAV CODE ON improvement METHOD ******************************/


// //   if(flag === 'improveWell2'){
// //  this.resultReasonForm[i].improveWell2 = false;
// //   }
// //   if(flag === 'improveWell3'){
// //  this.resultReasonForm[i].improveWell3 = false;
// //   }








/*************************saurav codes end *********************/




  
  createReasonsForm() {
    // let ab = 'unvalidForm';

    this.Reason_1 = this.fb.group({
      wentWell: ['', Validators.required],
      notWell: ['', Validators.required],
      improvement: ['', Validators.required]
    });
    this.Reason_2 = this.fb.group({
      wentWell: ['', Validators.required],
      notWell: ['', Validators.required],
      improvement: ['', Validators.required]
    });
    this.Reason_3 = this.fb.group({
      wentWell: ['', Validators.required],
      notWell: ['', Validators.required],
      improvement: ['', Validators.required]
    });
  }

  eventSubscriber(action: Subject<any>, handler: () => void, off: boolean = false) {
    if (off && this.subscription) {
      this.subscription.unsubscribe();
    } else {
      this.subscription = action.subscribe(() => handler());
    }
  }


  ngOnDestroy(): void {
    this.eventSubscriber(this.service.subscription, this.saveWinReasonDetails, true);
    this.projectServices.winReasonSave = false;
  }

  // getInformationSource subscribe
  // getWinReasonInformationSource(i?) {
  //   this.closeReasonService.getWinReasonInformationSource()
  //     .subscribe(optionSetData => {
  //       // this.competitor_data1.map((res) => {
  //         this.informationOptionSets = optionSetData.ResponseObject;
  //         if (this.initial) {
  //              this.winSaveDetails.map(winDetailData => {
  //               winDetailData.WiproInformationSource = this.informationOptionSets[0].Id;
  //             });
  //         }
  //         if(i) {
  //           this.competitor_data1[i]['informationOptionSets'] = this.informationOptionSets;
  //         }
  //       //   res['informationOptionSets'] = this.informationOptionSets;
  //       // });
  //     });
  // }

  winSaveDetailsInit() {
    // console.log("this.competitor_data1",this.competitor_data1);
    this.competitor_data1.map((res: any) => {
      const winDefualtValueObj = {
        WiproInformationSource: '',
        WiproWinCategories: '',
        WinReasonId: '',
        WiproAdditionalDetails: ''
      };
      this.winSaveDetails.push(winDefualtValueObj);
    });
    // console.log("this.winSaveDetails",this.winSaveDetails);
    // console.log(this.competitor_data1);
  }


  scrolltoMandatoryField() {
    setTimeout(() => {
      let element: any = document.getElementsByClassName('orangeborder')[0];

      if (element) {
        element.focus();
        window.scroll({
          behavior: 'smooth',
          left: 0,
          top: element.getBoundingClientRect().top + window.scrollY - 150
        });
      }
    }, 500)


  }

  // getWinCategoryOptionSet Suscribe
  // getWinCategoryOptionSet(initailCall?) {
  //   this.closeReasonService.getWinCategoryOptionSet()
  //     .subscribe(optionSetData => {
  //       this.competitor_data1.map((res, i) => {
  //         this.categoryOptionSets = optionSetData.ResponseObject;
  //         res['categoryOptionSets'] = this.categoryOptionSets;
  //         if (initailCall) {
  //           const payload = {
  //             CategoryId: res['categoryOptionSets'][0].WiproWinCategoryId
  //           };
  //           this.winSaveDetails = [{}, {}, {}, {}, {}];
  //           this.winSaveDetails.map(winDetailData => {
  //             winDetailData['WiproWinCategories'] = this.categoryOptionSets[0].WiproWinCategoryId;
  //           });
  //           this.getWinReasonOptionSet(payload, i);
  //         } 
  //         // else {
  //         //   this.winSaveDetails.map(winDetailData => {
  //         //     winDetailData.WiproWinCategories = this.categoryOptionSets[0].WiproWinCategoryId;
  //         //   });
  //         // }
  //       });
  //     });
  // }
/*************************saurav codes start *********************/
  // getWinReasonOptionSet Suscribe
  getWinReasonOptionSet(payload, i) {
    this.closeReasonService.getWinReasonOptionSet(payload)
      .subscribe(optionWinSetData => {
  // console.log("dropdown check",optionWinSetData)
        // this.competitor_data1.map((res) => {
        //   this.winOptionSets = [];
        console.log("winOptionSets",optionWinSetData);
          this.winOptionSets = optionWinSetData.ResponseObject;
          if (this.initial) {
            this.winSaveDetails.map(winDetailData => {
              winDetailData['WinReasonId'] = this.winOptionSets[0].WinReasonId;
              // console.log("wincategory", winDetailData.WinReasonId)
            });
          }
        // });
          this.competitor_data1[i]['winOptionSets'] = this.winOptionSets;
      });
  }

  // getCategoryId(evt, i) {
  //   // const categoryIdobj = JSON.parse();
  //   const payload = {
  //     CategoryId: evt.target.value
  //   };
  //   console.log(payload);
  //   this.getWinReasonOptionSet(payload, i);
  //   // getting index for category change
  //   this.updateWinSaveDetails('WiproWinCategories',evt.target.value, i);
  // }

    getCategoryId(WiproLossCategoryId,event, i) {
    let payload = {CategoryId: WiproLossCategoryId};
    this.closeReasonService.getWinReasonOptionSet(payload).subscribe(res => {
       this.competitor_data1[i].winOptionSets = (res && res.ResponseObject)?res.ResponseObject:[];
      this.competitor_data1[i].WinReasonId = "";
      this.competitor_data1[i].isTouched  = true;

       this.competitor_data1[i]['WiproWinCategoryId'] = event.target.value;
       let flag = event.target.name;
       if(flag === 'winCategoryFlag'){
         this.competitor_data1[i].winCategoryFlag = false;
         this.autoFocus = false;
       }
      }); 
      // this.getLossReasonOptionSet(WiproLossCategoryId, i);
      // this.updateLossSaveDetails('WiproLossCategories', WiproLossCategoryId, i);
    
  }

  getWinReasonId(WinReasonId,event,i) {
       
      this.competitor_data1[i].WinReasonId = "";
        this.competitor_data1[i].isTouched  = true;

 this.competitor_data1[i]['WinReasonId'] = event.target.value;
       let flag = event.target.name;
       if(flag === 'winReasonFlag'){
         this.competitor_data1[i].winReasonFlag = false;
       }
    // const winReasonIdobj = JSON.parse(winSelectedEvt.target.value);
    // console.log(winReasonIdobj);
    // const payloadWinReason = {
    //   WinReasonId: winReasonIdobj.WinReasonId
    // };
    // console.log(payloadWinReason);
    // this.updateWinSaveDetails('WinReasonId', winReasonIdobj.WinReasonId, i);
  
  }

  getInformationSourceId(InformationSource,event, i) {
        this.competitor_data1[i].isTouched  = true;

 this.competitor_data1[i]['InformationSource'] = event.target.value;
       let flag = event.target.name;
       if(flag === 'infoSourceFlag'){
         this.competitor_data1[i].infoSourceFlag = false;
       }

    // const informationSourceObj = JSON.parse(evt.target.value);
    // const payLoadInformationSource = {
    //   informationSourceId: informationSourceObj.Id
    // };
    // console.log(payLoadInformationSource);
    // this.updateWinSaveDetails('WiproInformationSource', informationSourceObj.Id, i);
 
  }

  // getAdditionalDetailsText
  getAdditionalTestDetails(event, i) {
    // const additionalText = evt.target.value;
            this.competitor_data1[i].isTouched  = true;
     this.competitor_data1[i]['WiproAdditionalDetails'] = event.target.value;
       let flag = event.target.name;
       if(flag === 'additionalDetailFlag'){
         this.competitor_data1[i].additionalDetailFlag = false;
       }
    // console.log(additionalText);
    // this.updateWinSaveDetails('WiproAdditionalDetails', additionalText, i);
  
  }
/*************************saurav codes end *********************/
  // update winDetailsArray
  updateWinSaveDetails(key: string, value: any, index: number) {
    // this.initial = false;
     this.saveValidRow.push(index);
    this.winSaveDetails[index][key] = value;
    console.log(this.winSaveDetails);
    if(key === 'WiproWinCategories') {
      const payload = {
              CategoryId: this.competitor_data1[index]['categoryOptionSets'][0].WiproWinCategoryId
            };
            this.getWinReasonOptionSet(payload, index);

    }
    this.validRow(key);
  }

  validRow(key) {
    if (key == 'WiproWinCategories') {
      this.saveValidRow.map(rowIndex => {
        this.winSaveDetails.map((saveDetail, i) => {
          if (rowIndex === i) {
            saveDetail['saveValidRow'] = true;
          } else {
            saveDetail['saveValidRow'] = false;
          }
        });
      });
    }
  }
           /***************************************SAURAV CODE start ON SAVE API ***************************************************************************/
  // save winDetails
  saveWinReasonDetails() {
    // console.log(resultReasonForm);
   let saveOBJ = this.competitor_data1.filter(it=> it.isTouched == true).map(mapobj => {return Object.assign({
      OpportunityId: this.OpportunityId,
      OrderId:this.orderId? this.orderId:'',
      WiproAdditionalDetails: mapobj.WiproAdditionalDetails,
      WinReasonId: mapobj.WinReasonId,
      WiproWinCategories: mapobj.WinCategoryValue,
      WiproInformationSource:mapobj.InformationSource,
      WiproOpportunityWinDetailsId: mapobj.OpportunityWinDetailsId
   })})

this.competitor_data1.map((data:any) =>{



  if(data.WiproWinCategoryId == ''|| data.WiproWinCategoryId ==null){
    data.winCategoryFlag = true;
    this.autoFocus = true;
  }

 if(data.WinReasonId == ''|| data.WinReasonId ==null){
    data.winReasonFlag = true;
  }


if(data.WiproAdditionalDetails == ''|| data.WiproAdditionalDetails ==null){
    data.additionalDetailFlag = true;
  }

if(data.InformationSource == ''|| data.InformationSource ==null){
    data.infoSourceFlag = true;
  }

})

this.resultReasonForm.map((resultReasonForm:any) =>{
  

if(resultReasonForm.wentWell == ''|| resultReasonForm.wentWell ==null){
    resultReasonForm.wentWell1 = true;
  }
if(resultReasonForm.notWell == ''|| resultReasonForm.notWell ==null){
    resultReasonForm.notWell1 = true;
  }
if(resultReasonForm.improvement == ''|| resultReasonForm.improvement ==null){
    resultReasonForm.improveWell1 = true;
  }



  // if(resultReasonForm.wentWell == ''|| resultReasonForm.wentWell ==null){
  //   resultReasonForm.wentWell1 = true;
  // }
//   if(resultReasonForm.wentWell == ''|| resultReasonForm.wentWell ==null){
//     resultReasonForm.wentWell3 = true;
// }



// if(resultReasonForm.notWell == ''|| resultReasonForm.notWell ==null){
//     resultReasonForm.notWell1 = true;
//   }
//   if(resultReasonForm.notWell == ''|| resultReasonForm.notWell ==null){
//     resultReasonForm.notWell2 = true;
//   }
//   if(resultReasonForm.notWell == ''|| resultReasonForm.notWell ==null){
//     resultReasonForm.notWell3 = true;
// }



//   if(resultReasonForm.improvement == ''|| resultReasonForm.improvement ==null){
//     resultReasonForm.improveWell2 = true;
//   }
//   if(resultReasonForm.improvement == ''|| resultReasonForm.improvement ==null){
//     resultReasonForm.improveWell3 = true;
// }







})
 /************************************************SAURAV CODE end ON SAVE API ***************************************************************************/
if(saveOBJ.length == ''|| saveOBJ.length==0){
       let message = "Please enter the mandatory fields."
                    this.matSnackBar.open(message, undefined, {
                      duration: 2000
                    })
                    this.scrolltoMandatoryField();
      return;
}
   for(let i=0;i<saveOBJ.length;i++){
     console.log("add",saveOBJ[i].WiproAdditionalDetails.length);
     if(!saveOBJ[i].WiproAdditionalDetails || (saveOBJ[i].WiproAdditionalDetails && saveOBJ[i].WiproAdditionalDetails.length<10)){
            let message = "Additional details should not be empty and less than 10 characters."
                    this.matSnackBar.open(message, undefined, {
                      duration: 2000
                    })
      return;
     }
      else if(saveOBJ.filter((it:any)=> it.WinReasonId == saveOBJ[i].WinReasonId && it.WiproWinCategories == saveOBJ[i].WiproWinCategories).length > 1){

 let message1 = "category and reason both should not be same."
            this.matSnackBar.open(message1, undefined, {
                      duration: 2000
                    })
                    return;
 }
   }

   console.log("asdfwin",saveOBJ);

console.log("asdf",this.resultReasonForm);

      for(let i=0;i< this.resultReasonForm.length ; i++){
        if(this.resultReasonForm.some(it=> it.notWell || it.wentWell || it.improvement) == false){
        let message = "One reason is mandatory"
            this.matSnackBar.open(message, undefined, {
              duration: 2000
            })
            this.scrolltoMandatoryField();
            return;
        }
          if(this.resultReasonForm.some(it=> it.notWell) == false){
           let message = "Fill all the fields."
        this.matSnackBar.open(message, undefined, {
              duration: 2000
            })
            this.scrolltoMandatoryField();
            return;
          }

           if(this.resultReasonForm.some(it=> it.wentWell) == false){
               let message = "Fill all the mandatory fields."
    this.matSnackBar.open(message, undefined, {
              duration: 2000
            })
            this.scrolltoMandatoryField();
          return;
          }


      }

    //   this.resultReasonForm.map((element, i) => {
    //     if (Object.values(element).indexOf('') == -1) {
    //       // alert(JSON.stringify(element));
    //     }
    //     else {
    //        element['validForm'] = element.validForm !== undefined ? element.validForm : true;
    //       if (element.validForm) {
    //         a++;
    //       } else {
    //         let message = "Fill all the feilds."
    //         let action1
    //         this.matSnackBar.open(message, action1, {
    //           duration: 2000
    //         })
    //         //  alert('Fill all the feild');
    //       }
    //     }

    //   });
    // } 
    
    // if (a == 4) {
    //   // alert("One reason is mandotory");
    //   let message = "One reason is mandotory"
    //   let action
    //   this.matSnackBar.open(message, action, {
    //     duration: 2000
    //   })
    //   return;
    // }
    
      this.callSaveAPi(saveOBJ, this.resultReasonForm);
  }

  callSaveAPi(saveArr, reasonForm) {
    const payloadArr = [];
    const self = this;
    // const bb = '21231c75-9e8d-e911-a834-000d3aa058cb';
    const obj = {
      WiproName: 'Test Api spring 7',
      OpportunityId: self.projectServices.getSession('opportunityId'),
      OrderId: this.orderId? this.orderId : '',
      // WiproOpportunityWinDetailsId: ''
    };

//     saveArr.map(res => {
//       const payloadSaveDetails = Object.assign(res, obj);
//       console.log(payloadSaveDetails);
//       const payloadCreate = {
//         WiproName: payloadSaveDetails.WiproName,
//         OpportunityId: payloadSaveDetails.OpportunityId,
//         OrderId: payloadSaveDetails.OrderId,
//         WiproAdditionalDetails: payloadSaveDetails.WiproAdditionalDetails,
//         WiproOpportunityWinDetailsId: payloadSaveDetails.WiproOpportunityWinDetailsId ? payloadSaveDetails.WiproOpportunityWinDetailsId : '',
//         // formVal: formValue
//       };
//        delete payloadSaveDetails['saveValidRow'];
//        delete payloadSaveDetails['categoryOptionSets'];
//        delete payloadSaveDetails['informationOptionSets'];
//        delete payloadSaveDetails['winOptionSets'];
//       console.log(payloadCreate);
//       if (payloadCreate.WiproAdditionalDetails) {
// payloadArr.push(payloadSaveDetails);

//       }


//       // self.payloadArr.splice(self.payloadArr.indexOf(saveValidRow), 1);
//       // if (obj.WiproOpportunityWinDetailsId === '') {
//       //   self.closeReasonService.saveadditionalWinReasonDetails(payloadCreate).subscribe(additional => {
//       //     if (additional.ResponseObject) {
//       //       console.log(additional);
//       //       payloadSaveDetails['WiproOpportunityWinDetailsId'] = additional.ResponseObject[0].WiproOpportunityWinReasonId;
//       //       self.closeReasonService.saveWinReasonDetails(payloadSaveDetails).subscribe(winReasonDetail => {
//       //         console.log('save winreason');
//       //         console.log('save winreason', winReasonDetail);
//       //       });
//       //     }
//       //   });
//       // }
//     });
    //  console.log(payloadArr);

    //  api call
 this.closeReasonService.saveWinReasonDetails(saveArr).subscribe(winReasonDetail => {
              console.log('save winreason');
              console.log('save winreason', winReasonDetail);
              if(!winReasonDetail.IsError){              
                this.retriveWinDetails();
                }                           
            });

let reasonDetails:any=[];
console.log(this.winReasonRetriveDetails);
const reasonIdFilter = this.winReasonRetriveDetails.map(OppreasonId=>OppreasonId.OpportunityWinDetailsReasonId);
 reasonForm.map((res, i)=>{
   if (res.wentWell) {
     let reasonFormPayload = {
       OpportunityId: self.projectServices.getSession('opportunityId'),
      OrderId: this.orderId? this.orderId : '',
       WiproOpportunityWinReasonDetailsId: reasonIdFilter[i] ? reasonIdFilter[i] :'',
     };
     reasonFormPayload['WiproType'] = "184450000";
     reasonFormPayload['WiproComments'] = res.wentWell;
     reasonDetails.push(reasonFormPayload);
   }
   if (res.notWell) {
     let reasonFormPayload = {
       OpportunityId: self.projectServices.getSession('opportunityId'),
       OrderId: this.orderId? this.orderId : '',
       WiproOpportunityWinReasonDetailsId:  reasonIdFilter[i+3] ? reasonIdFilter[i+3] :'',
     };
     reasonFormPayload['WiproType'] = "184450001";
     reasonFormPayload['WiproComments'] = res.notWell;
     reasonDetails.push(reasonFormPayload);
   }
   if (res.improvement) {
     let reasonFormPayload = {
       OpportunityId: self.projectServices.getSession('opportunityId'),
       OrderId: this.orderId? this.orderId : '',
       WiproOpportunityWinReasonDetailsId:  reasonIdFilter[i+6] ? reasonIdFilter[i+6] :'',
     };
     reasonFormPayload['WiproType'] = "184450002";
     reasonFormPayload['WiproComments'] = res.improvement;
     reasonDetails.push(reasonFormPayload);
   }
 });
 console.log(reasonDetails);

    this.closeReasonService.saveWinReasonData(JSON.parse(JSON.stringify(reasonDetails))).subscribe(reasonDetails =>{
                this.retriveWinReasonDetails();
      console.log('save reasondetails',reasonDetails);
       let message = "Data Saved Successfully"
      let action
      this.matSnackBar.open(message, action, {
        duration: 2000
      })
    })

  }





  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }
  addToArray(array: string) {
    this.arr.push('array' + this.arr.length);
  }
  remove(i: number) {
    this.arr.splice(i, 1);

  }
  // file upload functionality ends here
  getReason(value) {
    console.log(value);
  }
}


