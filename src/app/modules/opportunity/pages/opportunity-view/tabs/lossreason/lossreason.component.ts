import { Component, OnInit} from '@angular/core';
import { DataCommunicationService, OpportunitiesService,  ErrorMessage,OrderService } from '@app/core';
import { FileUploader } from 'ng2-file-upload';
import { Observable, Subject, of } from 'rxjs';
import { LossreasonService } from '@app/core/services/lossreason.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
@Component({
  selector: 'app-lossreason',
  templateUrl: './lossreason.component.html',
  styleUrls: ['./lossreason.component.scss']
})
export class LossreasonComponent implements OnInit {
 subscription;
  categoryOptionSets: any = [];
  lossOptionSets: any = [];
  lossSaveDetails: any = [];
  details: any = []
  initial: boolean;
    orderId: string;
  reasons = ['Reason_1', 'Reason_2', 'Reason_3'];
  Reason_1: FormGroup;
  Reason_2: FormGroup;
  Reason_3: FormGroup;
  saveValidRow: any = [];
  //narendra
  docTypeFlag : false;
  lossReasonFlag : false;
  additionaldetailsFlag : false;
  informationSourceFlag : false;
  //  wentWellFlag1 : false ;
  // wentWrongFlag1: false;
  // OFIFlag1 : false ;
isAppirioFlag:boolean = false;


wentWell1 :boolean = false;
notWell1:boolean = false;
improveWell1:boolean = false;
 

    fullAccessSessionCheck = this.projectServices.getSession('FullAccess') || false;
arr:any=[];
  // dasjknfjk = '712837';
OpportunityId = this.projectServices.getSession('opportunityId');
  resultReasonForm : any =[{
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
  textValue = ''
  editAccess: boolean;

  constructor(public service: DataCommunicationService, private lossreasonService: LossreasonService,
    public projectServices: OpportunitiesService,
    private orderService: OrderService,
    public errorMessage: ErrorMessage,
    public matSnackBar: MatSnackBar,
    private fb: FormBuilder, private EncrDecr: EncrDecrService) {
  }
 lossCategoryOptionSets: any = [];
 retrievedata: any = [];
 informationOptionSets:any=[];
    competitor_data1 = [
  ]
  ngOnInit() {
    this.isAppirio();
    if (this.fullAccessSessionCheck == true)
 {
   this.editAccess = false;
 }
 else {
 this.checkOrderBookingId();
 }
    console.log('opt',this.projectServices.getSession('opportunityId'));
    this.getLossCategoryOptionSet();
    this.getLossReasonInformationSource();
    // this.lossSaveDetailsInit();
     console.log("orderId", this.projectServices.getSession('orderId'));
    this.createReasonsForm();
    this.saveLossReasonDetails = this.saveLossReasonDetails.bind(this);
    this.eventSubscriber(this.service.subscription, this.saveLossReasonDetails);
    //  this.getLossReasonInformationSource();
    this.retriveLossDetails();
    this.retriveLossReasonDetails();
  }



  checkOrderBookingId() {
  const payload = {
    Id: this.projectServices.getSession('opportunityId')
  };
  this.orderService.checkOrderBookingId(payload).subscribe((bookingId: any) => {
    if (!bookingId.IsError) {
      this.orderId = bookingId.ResponseObject[0].SalesOrderId?bookingId.ResponseObject[0].SalesOrderId:'';
        const bookingIdPayload = {
          Guid: bookingId.ResponseObject[0].SalesOrderId
        };
      
let payload ={
      UserGuid : this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
      Guid : this.orderId
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


      
    }
  }, err => console.log(err));
}
isAppirio(){
   let obj = { "OppId": this.projectServices.getSession('opportunityId') }
  
    this.projectServices.getOppOverviewDetail(obj).subscribe(res => {
      if (!res.IsError) {
    if (res.ResponseObject) {
      if(res.ResponseObject.IsAppirioFlag == true){
        this.isAppirioFlag = true;
      }
 //this.projectServices.setSession("IsAppirioFlag", res.ResponseObject.IsAppirioFlag ? res.ResponseObject.IsAppirioFlag : "")
    }
  }
});
}
  //retrive Loss details
  retriveLossDetails(){
    this.competitor_data1 = [];
    let payloadRetriveData = {
      // Opp-ortunityId:"5B83CF48-4D68-E611-80D6-000D3A803BD6",
       OpportunityId: this.OpportunityId,
    }
    this.lossreasonService.retrieveLossDetails(payloadRetriveData).subscribe(retriveLossDetails => {
      console.log("ret",retriveLossDetails);
      let tempretriveLossDetails = (retriveLossDetails && retriveLossDetails.ResponseObject)?retriveLossDetails.ResponseObject:[];
     console.log("Hello", tempretriveLossDetails)
        for(let i=4; i>=0;i--){

                 if(i < tempretriveLossDetails.length){
            this.getLossReasonOptionSetForCategory(tempretriveLossDetails[i].WiproLossCategoryId, i,tempretriveLossDetails[i]);
                 }
                 else{

            this.getLossReasonOptionSetForCategory('', i,null);
                 }
        }

  //     if(retriveLossDetails.ResponseObject.length == 0){
  //       this.competitor_data1 = [];
  // this.competitor_data1.map((data, i) => {
  //   // this.getLossCategoryOptionSet(true);
  //    this.getLossReasonInformationSource(i, true);
  //     this. getAdditionalTestDetails();
  // });
  //     } else {
  //       const retrivelossDetailsLength = retriveLossDetails.ResponseObject.length ;
  //       this.lossSaveDetails = [];
  //       this.competitor_data1 = [];
  //     retriveLossDetails.ResponseObject.forEach((res, i) => {
  //       if (i < 5) {
  //       if (res.OpportunityLossDetailsId) {
  //       const lossDefualtValueObj = {
  //           OpportunityId: this.projectServices.getSession('opportunityId') ,
  //            //OpportunityId:"5B83CF48-4D68-E611-80D6-000D3A803BD6",
  //           WiproLossReasons: res.WiproLossReasonId,
  //           WiproLossCategories: res.WiproLossCategoryId,
  //           WiproInformationSource: res.InformationSource,
  //           WiproAdditionalDetails: res.WiproAdditionalDetails,
  //           WiproOpportunityLossDetailsId: res.OpportunityLossDetailsId,
  //           WiproLossCategoryName: res.WiproLossCategoryName,
  //           WiproLossReasonName: res.WiproLossReasonName,
  //           InformationSourceName: res.InformationSourceName

  //         }
  //         this.lossSaveDetails.push(lossDefualtValueObj);
  //         this.competitor_data1.push(lossDefualtValueObj);
  //           this.getLossReasonOptionSet(res.WiproLossCategoryId, i);
  //           // const evt = {
  //           //   target : {value: res.InformationSource}
  //           // }
  //           // this.getLossCategoryOptionSet();
  //           this.getLossReasonInformationSource(i);
  //           this.getLossReasonInformationSourceId(res.InformationSource, i);
  //         // this.competitor_data1[i]['OpportunityLossDetailsId'] = res.OpportunityLossDetailsId;
  //         // this.competitor_data1[i]['OpportunityLossDetailsId'] = res.OpportunityLossDetailsId;
  //         // this.competitor_data1[i]['OpportunityLossDetailsId'] = res.OpportunityLossDetailsId;
  //         // this.competitor_data1[i]['OpportunityLossDetailsId'] = res.OpportunityLossDetailsId;
  //         // this.competitor_data1[i]['OpportunityLossDetailsId'] = res.OpportunityLossDetailsId;
  //       }
  //     }
  //     });
  //     if(retrivelossDetailsLength < 5) {
  //       let diff = 5 - retrivelossDetailsLength;
  //       for(let i=0; i<diff; i++){
  //         this.competitor_data1[retrivelossDetailsLength + i] = {};
  //           // this.getLossCategoryOptionSet(true);
  //           this.getLossReasonInformationSource(retrivelossDetailsLength + i);
  //       }

  //       }

  //     }
    })

  }

    getLossReasonOptionSetForCategory(WiproLossCategoryId, i,retriveLossDetails) {
      let lossOptionSets = [];
      if(WiproLossCategoryId){
            let payload = {CategoryId: WiproLossCategoryId};
    this.lossreasonService.getLossReasonOptionSet(payload)
      .subscribe(optionLossSetData => {
        lossOptionSets = (optionLossSetData && optionLossSetData.ResponseObject)?optionLossSetData.ResponseObject:[]; 
           this.creeateCompetetorData(retriveLossDetails,i,lossOptionSets);
        console.log(optionLossSetData);
      });
   
      }else{
        this.creeateCompetetorData(retriveLossDetails,i,lossOptionSets);

      }

  }

  creeateCompetetorData(retriveLossDetails,i,lossOptionSets){
     let getOBj={
         lossOptionSets: lossOptionSets,
         InformationSource   : retriveLossDetails && retriveLossDetails.InformationSource ? retriveLossDetails.InformationSource:"",
         OpportunityLossDetailsId: retriveLossDetails && retriveLossDetails.OpportunityLossDetailsId ? retriveLossDetails.OpportunityLossDetailsId:"",  
         WiproAdditionalDetails: retriveLossDetails && retriveLossDetails.WiproAdditionalDetails ? retriveLossDetails.WiproAdditionalDetails:"",
         WiproLossCategoryId: retriveLossDetails && retriveLossDetails.WiproLossCategoryId ? retriveLossDetails.WiproLossCategoryId:"",
         WiproLossReasonId: retriveLossDetails && retriveLossDetails.WiproLossReasonId ? retriveLossDetails.WiproLossReasonId:"",
         isTouched:(retriveLossDetails && retriveLossDetails.OpportunityLossDetailsId)?true:false,
        }
//     retriveLossDetails.
        this.competitor_data1.unshift(Object.assign({},getOBj));
      //sort  OpportunityLossDetailsId
        console.log("wer"+i,this.competitor_data1);
  }
  //Retrive LossReason details
  retriveLossReasonDetails(){
    const _self = this;
    const resultReasonForms=[];
   const payloadRetriveReasonData={
      //OpportunityId: _self.projectServices.getSession('opportunityId'),
       OpportunityId:this.OpportunityId

    }
     _self.lossreasonService.retriveLossReasonDetails(payloadRetriveReasonData).subscribe(retriveLossReasonDetailss=>{
       console.log("lossObj",retriveLossReasonDetailss);
       _self.retrievedata=retriveLossReasonDetailss.ResponseObject;
      if(retriveLossReasonDetailss && retriveLossReasonDetailss.ResponseObject){
        let wentWellArr = retriveLossReasonDetailss.ResponseObject.map(res => {
          if (res.WiproType == 184450000) return res ? res.WiproComments : 'N/A';
        });
        let wentWrongArr = retriveLossReasonDetailss.ResponseObject.map(res => {
          if (res.WiproType == 184450001)  return res ? res.WiproComments : 'N/A';
        });
        let improvArr = retriveLossReasonDetailss.ResponseObject.map(res => {
          if (res.WiproType == 184450002) return res ? res.WiproComments : 'N/A';
        });
//          wentWellArr.filter(item => item).map((wentWell, colmnNum) => {
//           if (colmnNum < 3) {
//             this.Reason_1.controls['wentWell'].setValue(wentWell);
//             this.resultReasonForm[0]['wentWell'] = wentWell;

//             this.Reason_2.controls['wentWell'].setValue(wentWell);
//             this.resultReasonForm[1]['wentWell'] = wentWell;

//             this.Reason_3.controls['wentWell'].setValue(wentWell);
//             this.resultReasonForm[2]['wentWell'] = wentWell;
//           }
//         });
//  wentWrongArr.filter(item => item).map((wentWron, colmnNum) => {
//           if (colmnNum < 3) {
//             this.Reason_1.controls['notWell'].setValue(wentWron);
//             this.resultReasonForm[0]['notWell'] = wentWron;

//             this.Reason_2.controls['notWell'].setValue(wentWron);
//             this.resultReasonForm[1]['notWell'] = wentWron;

//             this.Reason_3.controls['notWell'].setValue(wentWron);
//             this.resultReasonForm[2]['notWell'] = wentWron;
//           }
//         });

//          improvArr.filter(item => item).map((impv, colmnNum) => {
//           if (colmnNum < 3) {
//             this.Reason_1.controls['improvement'].setValue(impv);
//             this.resultReasonForm[0]['improvement'] = impv;

//             this.Reason_2.controls['improvement'].setValue(impv);
//             this.resultReasonForm[1]['improvement'] = impv;

//             this.Reason_3.controls['improvement'].setValue(impv);
//             this.resultReasonForm[2]['improvement'] = impv;
//           }
//         });
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
        console.log("Hru",this.resultReasonForm);
     }else{
       this.resultReasonForm=[];
     }
      // this.resultReasonForm.map((res, i)=>{
      //   {
      //     if(i==0)
      //     this.Reason_1.controls['wentWell'].setValue(retriveLossReasonDetails.ResponseObject[i].WiproComments);

      //     if(retriveLossReasonDetails.ResponseObject[i].WiproTypeName === 'Went Wrong')
      //     this.Reason_1.controls['notWell'].setValue(retriveLossReasonDetails.ResponseObject[i].WiproComments);

      //     if(retriveLossReasonDetails.ResponseObject[i].WiproTypeName === 'OFI')
      //     this.Reason_1.controls['improvement'].setValue(retriveLossReasonDetails.ResponseObject[i].WiproComments);
      //   }
      //   if(i == 1) {
      //     if(retriveLossReasonDetails.ResponseObject[i].WiproTypeName === 'Went Well')
      //     this.Reason_2.controls['wentWell'].setValue(retriveLossReasonDetails.ResponseObject[i].WiproComments);

      //     if(retriveLossReasonDetails.ResponseObject[i].WiproTypeName === 'Went Wrong')
      //     this.Reason_2.controls['notWell'].setValue(retriveLossReasonDetails.ResponseObject[i].WiproComments);

      //     if(retriveLossReasonDetails.ResponseObject[i].WiproTypeName === 'OFI')
      //     this.Reason_2.controls['improvement'].setValue(retriveLossReasonDetails.ResponseObject[i].WiproComments);
      //   }
      //   if(i == 2) {
      //     if(retriveLossReasonDetails.ResponseObject[i].WiproTypeName === 'Went Well')
      //     this.Reason_3.controls['wentWell'].setValue(retriveLossReasonDetails.ResponseObject[i].WiproComments);

      //     if(retriveLossReasonDetails.ResponseObject[i].WiproTypeName === 'Went Wrong')
      //     this.Reason_3.controls['notWell'].setValue(retriveLossReasonDetails.ResponseObject[i].WiproComments);

      //     if(retriveLossReasonDetails.ResponseObject[i].WiproTypeName === 'OFI')
      //     this.Reason_3.controls['improvement'].setValue(retriveLossReasonDetails.ResponseObject[i].WiproComments);
      //   }

      // })
    })
    console.log("Reason1",this.Reason_1, this.resultReasonForm);
     this.resultReasonForm[2]=this.Reason_3.value;
        this.resultReasonForm[0]=this.Reason_1.value;
    this.resultReasonForm[1]=this.Reason_2.value;
  }
  
  //narendra code starts


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
//    getFormReasonData(event) {
//     // if (Object.values(this[reasonsForm].value).indexOf('') == -1) {
//     //   this.resultReasonForm[i] = this[reasonsForm].value;
//     //   this.resultReasonForm[i].validForm = true;
//     //   console.log(this.resultReasonForm);

//     // } else {
//     //   this.resultReasonForm[i].validForm = false;
//     // }


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

  validRow(key) {
    if (key == 'WiproLossCategories') {
      this.saveValidRow.map(rowIndex => {
      this.lossSaveDetails.map((saveDetail, i) => {
        if (rowIndex === i) {
          saveDetail['saveValidRow'] = true;
        } else {
          saveDetail['saveValidRow'] = false;
        }
      });
    });
    }
  }


  eventSubscriber(action: Subject<any>, handler: () => void, off: boolean = false) {
    if (off && this.subscription) {
      this.subscription.unsubscribe();
    } else {
      this.subscription = action.subscribe(() => handler());
    }
  }


  ngOnDestroy(): void {
    this.eventSubscriber(this.service.subscription, this.saveLossReasonDetails, true);
  }

lossSaveDetailsInit() {
    this.competitor_data1.map((res: any) => {
      const lossDefualtValueObj = {
        OpportunityId:"",
        WiproLossReasons:"",
        WiproLossCategories:"",
        WiproInformationSource:"",
        WiproAdditionalDetails:"",
        WiproOpportunityLossDetailsId: ""
      };
      this.lossSaveDetails.push(lossDefualtValueObj);
    });
  }

// This function is to get the loss reason id
  getLossReasonId(lossSelectedEvt, evnt, i) {
        this.competitor_data1[i].isTouched  = true;
        this.competitor_data1[i]['WiproLossReasonId'] = evnt.target.value;
      let flag = evnt.target.name;
      if(flag === 'lossReasonFlag'){
        this.competitor_data1[i].lossReasonFlag = false;
        }
    // const lossReasonIdobj = lossSelectedEvt.target.value;
    // console.log(lossReasonIdobj);
    // // const payloadLossReason = {
    // //  lossReasonId: lossReasonIdobj.WiproLossReasonId
    // // };
    // // console.log(payloadLossReason);
    //  this.updateLossSaveDetails('WiproLossReasons',  lossReasonIdobj, i);
  }
   //getLossCategoryOptionSet Suscribe
  getLossCategoryOptionSet() {
    this.lossreasonService.getLossCategoryOptionSet()
      .subscribe(optionSetData => {
        this.lossCategoryOptionSets = optionSetData.ResponseObject;
        console.log("optCID", optionSetData);
//narendra

        // if (this.initial) {
        //     this.lossSaveDetails.map(lossDetailData => {
        //       lossDetailData['lossReasonId'] = this.lossOptionSets[0].lossReasonId;
        //        });
        //   }
          
  //       if ( initial) {
  //         this.competitor_data1.map((res, i) => {
  //           this.lossCategoryOptionSets = optionSetData.ResponseObject;
  //           res['lossCategoryOptionSets'] = this.lossCategoryOptionSets;
  //             const payload = {
  //               CategoryId: res['categoryOptionSets'][0].WiproLossCategoryId
  //             };
  //             this.lossSaveDetails = [{}, {}, {}, {}, {}];
  //             this.lossSaveDetails.map(lossDetailData => {
  //               lossDetailData.WiproLossCategories = this.lossCategoryOptionSets[0].WiproLossCategoryId;
  //             });
  //             this.getLossReasonOptionSet(payload, i, initial);
  //         });
  //       }

      });
   }

//getLossCategoryId
  getLossCategoryId(WiproLossCategoryId, evnt, i) {

    let payload = {CategoryId: WiproLossCategoryId};
    this.lossreasonService.getLossReasonOptionSet(payload).subscribe(optionLossSetData => {
        this.competitor_data1[i].lossOptionSets = (optionLossSetData && optionLossSetData.ResponseObject)?optionLossSetData.ResponseObject:[];
this.competitor_data1[i].WiproLossReasons = "";
      this.competitor_data1[i].isTouched  = true;   
  //narendra  
   this.competitor_data1[i]['WiproLossCategoryId'] = evnt.target.value;
      let flag = evnt.target.name;
      if(flag === 'docTypeFlag'){
        this.competitor_data1[i].docTypeFlag = false;
        }
      });
      
      
  }
  //narendra
    //getLossReasonOptionSet Suscribe
  getLossReasonOptionSet(WiproLossCategoryId, i, initial?) {
    const payload = {CategoryId: WiproLossCategoryId};
    this.lossreasonService.getLossReasonOptionSet(initial ? WiproLossCategoryId : payload)
      .subscribe(optionLossSetData => {
        debugger;
        console.log(optionLossSetData);
        this.competitor_data1[i].lossOptionSets = optionLossSetData.ResponseObject;
        this.lossOptionSets = optionLossSetData.ResponseObject;
        if (initial) {
          this.lossSaveDetails.map(lossDetailData => {
            lossDetailData['WiproLossReasons'] = this.lossOptionSets[0].WiproLossReasonId;
            // console.log("wincategory", winDetailData.WinReasonId)
          });
        }
      });
  }
  //getInformationSource subscribe
  getLossReasonInformationSource(i?, initial?) {
    this.lossreasonService.getLossReasonInformationSource()
      .subscribe(optionSetData => {
        debugger;
        console.log("asd",optionSetData.ResponseObject);
        this.informationOptionSets = optionSetData.ResponseObject;
        // this.competitor_data1[i]["informationOptionSets"] =  this.informationOptionSets;
        // if (initial) {
        //   this.lossSaveDetails.map(winDetailData => {
        //     winDetailData.WiproInformationSource = this.informationOptionSets[0].Id;
        //   });
        // }
      });
  }
//getInformationSourceId
getLossReasonInformationSourceId(InformationSource, evnt, i){
      this.competitor_data1[i].isTouched  = true;
      this.competitor_data1[i]['InformationSource'] = evnt.target.value;
      //narendra
      let flag = evnt.target.name;
      if(flag === 'informationSourceFlag'){
        this.competitor_data1[i].informationSourceFlag = false;
        }
  
  // console.log(evt.target.value)
  // const lossInformationSourceIdobj = JSON.parse(evt.target.value);
  //   console.log(lossInformationSourceIdobj);
  //   const payload = {
  //     InformationSourceId: lossInformationSourceIdobj.Id
  //   };
  //   console.log(payload);
      // this.updateLossSaveDetails('WiproInformationSource',parseInt(InformationSource), i);
}
// getAdditionalDetailsText
  getAdditionalTestDetails(evt, i) {
         this.competitor_data1[i].isTouched  = true;
      //  this.competitor_data1[i]['WiproAdditionalDetails'] = evt.target.value;
       //narendra
     let flag = evt.target.name;
      if(flag === 'additionaldetailsFlag'){
      this.competitor_data1[i].additionaldetailsFlag = false;
  }
  }

  // update winDetailsArray
  updateLossSaveDetails(key: string, value: any, index: number) {
    debugger;
    this.saveValidRow.push(index); // getting index for category change console.log(payload);
   

  //   let obj ={
  //    val:value,
  //  }

  // //  let arr =[];
  // this.arr.push(obj);

  
    this.lossSaveDetails[index][key] = value;

    console.log("lossSaveDetails",this.lossSaveDetails);
      if(key === 'WiproLossCategories') {
      const payload = {
              CategoryId: this.competitor_data1[index]['categoryOptionSets'][0].WiproLossCategoryId
            };
            this.getLossReasonOptionSet(payload, index);

    }
     this.validRow(key);
  }
 saveLossReasonDetails(){
   console.log("asd",this.competitor_data1);
   
    let saveOBJ = this.competitor_data1.filter(it=> it.isTouched == true).map(mapobj => {return Object.assign({
      // let saveOBJ = this.competitor_data1.map(mapobj => {return Object.assign({
      OpportunityId: this.OpportunityId,
      WiproAdditionalDetails: mapobj.WiproAdditionalDetails,
      WiproLossReasons: mapobj.WiproLossReasonId,
      WiproLossCategories: mapobj.WiproLossCategoryId,
      WiproInformationSource:mapobj.InformationSource,
      WiproOpportunityLossDetailsId: mapobj.OpportunityLossDetailsId
   })})

        //narendra codes on save api starts
        this.competitor_data1.map((data:any,i) =>{
        if(data.WiproLossCategoryId == '' || data.WiproLossCategoryId == null){
          data.docTypeFlag = true;
        }
         if(data.WiproLossReasonId == '' || data.WiproLossReasonId == null){
          data.lossReasonFlag = true;
        }
        if(data.WiproAdditionalDetails == '' || data.WiproAdditionalDetails == null){
          data.additionaldetailsFlag = true;
        }
         if(data.InformationSource == '' || data.InformationSource == null){
          data.informationSourceFlag = true;

        
        }
        })
//          if(this.competitor_data1.some(it=> it.WiproLossCategoryId == this.competitor_data1[i].WiproLossCategoryId && it.WiproLossReasonId == this.competitor_data1[i].WiproLossReasonId)){

//  let message1 = "category and reasonId both should not be same."
//             this.matSnackBar.open(message1, undefined, {
//                       duration: 2000
//                     })
//                     return;
//  }
   
       // narendra
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
        })
//narendra codes on save api ends
   for(let i=0;i<saveOBJ.length;i++){
     

    console.log("add",saveOBJ[i].WiproAdditionalDetails.length);
// if(!saveOBJ[i].WiproAdditionalDetails || ( saveOBJ[i].WiproAdditionalDetails && saveOBJ[i].WiproAdditionalDetails.length<10)){
//           let message = "fill all the details."
//             // let message = "Additional details should not be empty and more than 10 words."
//                     this.matSnackBar.open(message, undefined, {
//                       duration: 2000
//                     })
//        return;
//       }

 //narendra   

 if((!saveOBJ[i].WiproLossCategoryId && saveOBJ[i].WiproLossCategoryId=='') ||
 (!saveOBJ[i].WiproLossReasonId && saveOBJ[i].WiproLossReasonId=='') ||
   (!saveOBJ[i].WiproAdditionalDetails  && saveOBJ[i].WiproAdditionalDetails.length<10 )||
 (!saveOBJ[i].InformationSource  && saveOBJ[i].InformationSource=='' ))
  {
            let message = "Fill all the mandatory fields"
                    this.matSnackBar.open(message, undefined, {
                      duration: 2000
                    })
      return;
     }

     else if(!saveOBJ[i].WiproAdditionalDetails || ( saveOBJ[i].WiproAdditionalDetails && saveOBJ[i].WiproAdditionalDetails.length<10)){
          
             let message = "Additional details should not be empty and more than 10 words."
                    this.matSnackBar.open(message, undefined, {
                      duration: 2000
                    })
       return;
      }


 else if(saveOBJ.filter((it:any)=> it.WiproLossCategories == saveOBJ[i].WiproLossCategories && it. WiproLossReasons == saveOBJ[i]. WiproLossReasons).length > 1){

 let message1 = "category and reason both should not be same."
            this.matSnackBar.open(message1, undefined, {
                      duration: 2000
                    })
                    return;
 }
   }
   
    // const self = this;
    // let validData = true;
    // console.log(self.lossSaveDetails);
    // self.lossSaveDetails.map(saveRow => {
    //   if (validData) {
    //     Object.keys(saveRow).forEach(function eachKey(key) {
    //       if (validData) {
    //         if(saveRow.WiproLossCategories) {
    //           if (saveRow[key] !== '' || key === 'WiproAdditionalDetails' || key === 'WiproOpportunityWinDetailsId' || key === 'OpportunityId') {
    //           if (key === 'WiproAdditionalDetails') {
    //             if (saveRow.saveValidRow) {
    //               const text = saveRow.WiproAdditionalDetails ? saveRow.WiproAdditionalDetails.split(' ') : '';
    //               if(saveRow['WiproAdditionalDetails'] == '' || saveRow['WiproAdditionalDetails'] == null) {
    //                   validData = false;
    //                let message = "Additional details should not be empty."
    //                 let action
    //                 self.matSnackBar.open(message, action, {
    //                   duration: 2000
    //                 })

    //               }
    //               else if (text.length < 10) {
    //                 // validData = false;
    //                 // alert('Additional details should be more than 10 words.' );
    //                  let message = "Additional details should be more than 10 words."
    //                 let action2
    //                 self.matSnackBar.open(message, action2, {
    //                   duration: 2000
    //                 })
    //                 validData = false;
    //               } else {
    //                 validData = true;

    //               }
    //             }
    //           }
    //         } else {
    //           // alert("feild is null");
    //           validData = false;
    //         }
    //         }
    //       }
    //     });
    //   }
    // });

    
    // if (validData) {
    //   const saveDetails = self.lossSaveDetails;
    //   console.log("savedata"+ this.arr);
    //   self.lossSaveDetails = saveDetails.fil    `ter(lossDetail => lossDetail.saveValidRow);

    //_________narendra________________
    
       for(let i=0;i< this.resultReasonForm.length ; i++){
        if(this.resultReasonForm.some(it=> it.notWell || it.wentWell || it.improvement) == false){
        let message = "One reason is mandatory"
            this.matSnackBar.open(message, undefined, {
              duration: 2000
            })
            return;
        }
          if(this.resultReasonForm.some(it=> it.notWell) == false){
           let message = "Fill all the feilds."
        this.matSnackBar.open(message, undefined, {
              duration: 2000
            })
            return;
          }

           if(this.resultReasonForm.some(it=> it.wentWell) == false){
               let message = "Fill all the mandatory feilds."
    this.matSnackBar.open(message, undefined, {
              duration: 2000
            })
          return;
          }
      }
    //  _________________narendra end _____________________
      this.callSaveAPi(saveOBJ, this.resultReasonForm);
    // }
   
}

  callSaveAPi(saveArr,reasonForm) {
    const self = this;
    const lossArr:any=[];
    // const bb = '21231c75-9e8d-e911-a834-000d3aa058cb';
    const obj = {
      OpportunityId:this.OpportunityId
      //  OpportunityId: self.projectServices.getSession('opportunityId'),
      //  WiproOpportunityLossDetailsId: "",
      //  WiproName:"Test Api spring 73",
    };

  //   saveArr.map(res => {
  //     const payloadSaveDetails = Object.assign(res, obj);
  //   console.log(payloadSaveDetails);
  //   const payloadCreate = {
  //     OpportunityId: payloadSaveDetails.OpportunityId,
  //     WiproAdditionalDetails: payloadSaveDetails.WiproAdditionalDetails,
  //     WiproLossReasons: payloadSaveDetails.WiproLossReasons,
  //     WiproLossCategories: payloadSaveDetails.WiproLossCategories,
  //     WiproInformationSource:payloadSaveDetails.WiproInformationSource,
  //     WiproOpportunityLossDetailsId: payloadSaveDetails.OpportunityLossDetailsId ? payloadSaveDetails.OpportunityLossDetailsId : ''
  //     // WiproName:payloadSaveDetails.WiproName,

  //     // formVal: formValue
  //   };
  //   delete payloadSaveDetails['saveValidRow'];
  //   console.log(payloadCreate);
  //   delete payloadSaveDetails['informationOptionSets'];
  //        delete payloadSaveDetails['lossOptionSets'];
  //        delete payloadSaveDetails['WiproLossCategoryName'];
  //          delete payloadSaveDetails['WiproLossReasonName'];
  //          delete payloadSaveDetails['InformationSourceName'];
  //   if(payloadCreate.WiproLossCategories){

  //  lossArr.push(payloadSaveDetails);
  //   }


  //   // if (obj.WiproOpportunityWinDetailsId === '') {
  //     // self.lossreasonService.saveadditionalLossReasonDetails(payloadCreate).subscribe( additional => {
  //       //if (additional.ResponseObject) {
  //       //   console.log(additional);
  //       //   payloadSaveDetails['WiproOpportunityWinDetailsId'] = additional.ResponseObject[0].WiproOpportunityWinReasonId;

  //   // }

  // console.log(lossArr);

  // });
  this.lossreasonService.saveLossDetails(saveArr).subscribe( lossReasonDetail => {
            console.log("res",lossReasonDetail);
                this.retriveLossDetails();

//             if(lossReasonDetail.length){
//                payloadSaveDetails['WiproLossReasonDetailsID'] = lossReasonDetail.ResponseObject[0].WiproLossReasonDetailsID;
//             //   console.log(payloadSaveDetails['WiproLossReasonDetailsID']);
//             self.lossreasonService.saveadditionalLossReasonDetails(payloadSaveDetails).subscribe(lossReasonupdate =>{
// console.log(lossReasonupdate);
//              });
//             console.log('save winreason');
//             console.log('save winreason', lossReasonDetail);
//              }
//           });
        // }
        });

        let reasonDetails:any=[];
   console.log(this.retrievedata);
         const reasonIdFilter = self.retrievedata.map(id => id.WiproLossReasonDetailsId);
 reasonForm.map((res, i)=>{ 
   if (res.wentWell) {
     let reasonFormPayload = {
       //OpportunityId: "5B83CF48-4D68-E611-80D6-000D3A803BD6",
       OpportunityId: this.OpportunityId,
       WiproLossReasonDetailsId: reasonIdFilter[i] ? reasonIdFilter[i] :'' ,
     };
     reasonFormPayload['WiproType'] = 184450000;
     reasonFormPayload['WiproComments'] = res.wentWell;
     reasonDetails.push(reasonFormPayload);
   }
   if (res.notWell) {
     let reasonFormPayload = {
       //OpportunityId: "5B83CF48-4D68-E611-80D6-000D3A803BD6",
      OpportunityId:this.OpportunityId,
       WiproLossReasonDetailsId: reasonIdFilter[i+1] ? reasonIdFilter[i+1] :'',
     };
     reasonFormPayload['WiproType'] = 184450001;
     reasonFormPayload['WiproComments'] = res.notWell;
     reasonDetails.push(reasonFormPayload);
   }
   if (res.improvement) {
     let reasonFormPayload = {
       //OpportunityId: "5B83CF48-4D68-E611-80D6-000D3A803BD6",
     OpportunityId: this.OpportunityId,
       WiproLossReasonDetailsId: reasonIdFilter[i+2] ? reasonIdFilter[i+2] :'',
     };
     reasonFormPayload['WiproType'] = 184450002;
     reasonFormPayload['WiproComments'] = res.improvement;
     reasonDetails.push(reasonFormPayload);
   }
 });
 console.log(reasonDetails);

    self.lossreasonService.saveLossReasonDetails(JSON.parse(JSON.stringify(reasonDetails))).subscribe(reasonDetails =>{
          this.retriveLossReasonDetails();
      console.log('save Lossreasondetails');
      let message = "Data Saved Successfully"
      let action
      this.matSnackBar.open(message, action, {
        duration: 2000
      })
    });

   }
}
