

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProjectService, DataCommunicationService } from '@app/core';
import { ElementFinder } from 'protractor';
import { Observable, Subject, of, from, BehaviorSubject } from 'rxjs';
import { FormControl, ControlContainer, NgForm } from '@angular/forms';

import {
  delay
} from 'rxjs/operators';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material/';
import { SapPopupComponent } from '../single-table/sprint4Modal/sap-popup/sap-popup.component';
@Component({
  selector: 'app-auto-complete-select',
  templateUrl: './auto-complete-select.component.html',
  styleUrls: ['./auto-complete-select.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class AutoCompleteSelectComponent implements OnInit {
  @Input() isSearchLoader: boolean = true;
  constructor(public projectService: ProjectService,public userFrm:NgForm,public dialog:MatDialog, public service: DataCommunicationService,) { }
  // constructor(public projectService: ProjectService) { }
  @Input() dataSource: any;

  //Variavles Used for generic auto complete for binding
  @Input() name: string;
  @Input() Id: string;
  @Input() dataHeader:any;
  @Input() parentDataOBJ:any;
  @Input() requiredField: string;
  @Input() labelName: string;
  @Input() titleName: string = '';
  @Input() selectedObj: any;
  @Input() Placeholder: string;
  @Input() source: any;
  @Input() details: string;
  @Input() detailsId:string;
  @Input() Isrequired: boolean = false;
  @Input() IsSpecialBtn: boolean= false;
  @Input() IsinitialsView: boolean= false;
  @Input() IsSearchDatabase: boolean= false;
  @Input() Isdisabled: boolean= false;
  @Input() IsSubContent:boolean= false;
  @Input() showSelected: boolean= false;
  @Input() IsApiCall:boolean = false;
  @Input() MandtErrorFlag:boolean = false;
  @Input() isLastVar: boolean = false;
  @Input() showSAPCode: boolean = false;

  @Output() content = new EventEmitter<any>();
  @Output() SelectedData = new EventEmitter<any>();
  @Output() advanceLookUp=new EventEmitter<{selectedData: any, inputVal: string,labelName:string}>();

//Request SAP code
@Output() requestSapCode = new EventEmitter<any>();

  arrowkeyLocation=0;
  selectedText:any;
  autoComplteSel:string;
  autoCompleteSource=[];
  noRecordFound:boolean=false;
  initailLoading:boolean=false;
  isLoader:boolean=true;
  // tempModelData;
  // modelInitialize = 0;
  //End of Variavles Used for generic auto complete for binding

   ngOnInit() {  
    // console.log(this.Id,this.name);
    // console.log("Isrequired",this.Isrequired);
    this.autoCompleteSource = this.source;
    this.initailLoading=true;
    //this.tempModelData = this.details;
  }
  
  // ngDoCheck() {
  //   if(this.details && this.details.length > 0 && this.modelInitialize == 0) {
  //     this.tempModelData = this.details;
  //     this.modelInitialize = this.modelInitialize+1;
  //   }
  // }

  openSAPcode()
  {
  //  const dialogRef = this.dialog.open(SapPopupComponent, {
  //    width: '900px'
  //  });
   this.requestSapCode.emit();
  }
  sourceLocalStorage: any;
  private searchTerms = new BehaviorSubject<string>("");
  SelectedValue: {}[] = [];
  showContact: boolean = false;

  customerNameSwitch: boolean = false;

  cachedData = [];
  cachedKey: string;
  key: string;
  arraySource = [];
  notFound = [];

  /****************Advance search popup starts**********************/
  isAccount=true;
  openadvancetabs(): void {
    // const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
    //   width: this.service.setHeaderPixes(this.lookupdata.headerdata.length,this.isAccount),
    //   data:this.lookupdata
    // });
  
    this.customerNameSwitch = false;
    this.noRecordFound=false;
    let typedKey=this.details;

  //  let advanceSelObj=JSON.parse(JSON.stringify({selectedData:this.selectedObj,inputVal:typedKey,labelName:this.labelName}));
  
    this.advanceLookUp.emit({selectedData:this.selectedObj,inputVal:this.selectedText,labelName:this.labelName})
  }
  
  /*****************Advance search popup ends*********************/
  detailsclose() {
    this.noRecordFound=false;
    this.customerNameSwitch = false;
    this.service.selectclick = false;
    // if (!this.showSelected) {
    //   if(this.dataHeader){
    //     if(!this.selectedObj){
    //       this.details = "";
    //       this.detailsId = "";
        
    //     }else{
    //       if(this.details != this.selectedObj[this.dataHeader.name] || this.detailsId != this.selectedObj[this.dataHeader.Id]){
    //         this.details = "";
    //         this.detailsId = "";
    //         this.selectedObj[this.dataHeader.name] = "";
    //         this.selectedObj[this.dataHeader.Id] = "";
    //         let emittingObj = Object.assign({}, this.selectedObj);
    //         emittingObj.parentDataOBJ = this.parentDataOBJ;
    //         this.source = [];
    //         this.SelectedData.emit(emittingObj);
    //       }
    //     }
    //   }
    // }
  }
clearSelectedItem()
{
   this.detailsId ='';
   this.details='';
  
      this.SelectedData.emit({});
}
  appendDetail(selectedvalue) {
    this.selectedObj = selectedvalue;
    this.noRecordFound=false;
    // this.details = '';
    this.detailsId = this.selectedObj[this.dataHeader.Id];
    let emittingObj = Object.assign({}, this.selectedObj);
    emittingObj.parentDataOBJ = this.parentDataOBJ;
   // this.tempModelData = this.details;
  
    this.SelectedData.emit(emittingObj);
  }
loadDefaultData()
{
  this.noRecordFound=false;
  this.customerNameSwitch=true;
  this.isSearchLoader=true;
  this.getdropdowndata('');
  
  // if(!this.customerNameSwitch)
  // {
  //    this.customerNameSwitch=true;
  
  //      this.getdropdowndata(this.details);
 
  // }
  // else
  // { 
  //   this.customerNameSwitch=true;
  // }
}


  getdropdowndata(value:string) {
    
    this.noRecordFound=false;
    if(this.IsApiCall == true){
    // if (value.trim().length > 0) {
      const example$ = of(value);
      const debouncedInput=example$.pipe( delay(10));
      this.isSearchLoader=true;
      const subscribe = debouncedInput.subscribe(val => {
        this.isSearchLoader=false;
        this.selectedText=val;
        this.content.emit({searchValue:val,parentDataOBJ:this.parentDataOBJ });
        console.log("val",val);
        // if (value === this.tempModelData) {
        //   console.log('Correct Data');



        // } else {
        //   console.log('InCorrect Data');
  
        //   this.content.emit({searchValue:val,parentDataOBJ:this.parentDataOBJ,searchMatch: false });

        // }
        
      });
    //}
    }
  }


  asd(){
    console.log("validity",this.userFrm.valid);
  }

  OnBlur(event){
    // if((event.relatedTarget && event.relatedTarget.nodeName != 'MAT-OPTION') || !(event.relatedTarget)){
      console.log("event",event);
      // console.log("Nodename",event.relatedTarget.nodeName);
  }



  delete(item) {
    console.log(item.index);
    // this.SelectedValue.splice(item.index,1);
    this.SelectedValue = this.SelectedValue.filter((value: any) => value.index != item.index)
  }

  // test(){
  //   if(this.cachedKey && this.source.length>0){

  //   this.cachedData.push({key:this.cachedKey,data:this.source});
  //   }


  //   this.sourceLocalStorage = localStorage.getItem('serverAutoCompleteData');
  //   console.log(' typed val---  '+this.details);
  //   console.log(this.sourceLocalStorage);
  //   this.sourceLocalStorage = [this.sourceLocalStorage].filter(y=>console.log(y.name));
  //   console.log(this.sourceLocalStorage);
  // }

  getbgColor(i){
      return "randomColor"+(i% 10)
  }

  ngOnChanges(simpleChanges) {    
     if(this.initailLoading)
    {
      // this.isSearchLoader=false;
       if (simpleChanges.source || simpleChanges.selectedObj) {
         this.autoComplteSel = this.selectedObj.Name;
         // Mandatory key format 'Name'
         this.isLoader = false;
         if (this.source.length == 0) {
           this.noRecordFound = true;
           console.log("in ng on changes ", this.noRecordFound);
         } else {
           this.noRecordFound = false;
         }
         this.autoCompleteSource = this.source;
         this.isSearchLoader = false;
       }else {
         this.isLoader = true;
       }
     
    }

// console.log("source",this.source);
// console.log("header",this.dataHeader);
// this.details = this.selectedObj ? this.selectedObj[this.name] : "";
// this.detailsId = this.selectedObj ? this.selectedObj[this.Id]: "";
    // // if(this.cachedKey){
    // if (this.source.length > 0) {
    //   debugger

    //   this.arraySource = this.source;
    //   if (!this.cachedData.some(x => x.key.toLowerCase().includes(this.cachedKey))) {

    //     this.cachedData.push({ key: this.cachedKey, data: this.source });
    //     console.log('ngonchanges_________' + JSON.stringify(this.cachedData));

    //   }


    // } else {

    //   this.arraySource = [];
    //   if (this.cachedKey) {

    //     if (!this.notFound.some(x => this.cachedKey.toLowerCase().startsWith(x.toLowerCase()))) {

    //       this.notFound.push(this.cachedKey);
    //     }
    //   }

    // }

    // console.log('ngonchanges_________' + JSON.stringify(this.cachedData) + JSON.stringify(this.source) + "not found array ____" + JSON.stringify(this.notFound));
  
  }
  // }


  getValue(val){
     return Object.values(val)[0];
  }

}







