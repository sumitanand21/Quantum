import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { map, filter, pluck, groupBy, mergeMap, toArray, debounceTime } from 'rxjs/operators';
import { AccountService } from '@app/core/services/account.service';
import { Observable, of, concat,from, Subject  } from 'rxjs';
import { Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DataCommunicationService } from '@app/core/services/global.service';


@Component({
  selector: 'app-more-view',
  templateUrl: './more-view.component.html',
  styleUrls: ['./more-view.component.scss']
})
export class MoreViewComponent implements OnInit {
 AccountCreationActiveRequestsTable=[];
  
  isIntialized:boolean=false;
  isLoading:boolean=false;
  hideSearchSort:boolean=true;
  selectedRowCount:number=0;
  IsDeleteAll:boolean=false;
  @Input() IsShare:boolean=false;
  @Input() IsPin:boolean=true;
  @Input() moduleName:string;
  @Input() IsEdit:boolean=false;
  @Input() IsDelete:boolean=false;
  @Input() TableData = [];
  @Input() HeaderTableData = [];
  @Input() showTopHeader:boolean=false;
  @Output() detectActionValue = new EventEmitter<{ objectRowData: any, action: string,searchKey:string }>();
  private searchText$ = new Subject<string>();
  serviceSearchItem:string;
  tableCollectionData=[];
  sidebar:boolean;
  constructor(public service: DataCommunicationService,public farmingaccount:AccountService,public router:Router,public dialog: MatDialog) { }


 more_clicked;
 show;
 value: string = "Alphabetically";
 reverse: boolean;
 expand = false;
 searchItem: String;
 data: any;
 isPin: boolean = true;
 headerData=[];
 cardHeader=[];


 tabNameSwitch: boolean;
 openTabDrop() {
   this.tabNameSwitch = !this.tabNameSwitch;
 }
 closeTabDrop() {
   this.tabNameSwitch = false;
 }

 
 
 hidedropdown() {
   document.getElementsByClassName('caret0')[0].classList.remove('rotate-180d');
   this.show = false;
 }

 showAlpha() {
   document.getElementsByClassName('caret0')[0].classList.toggle('rotate-180d');
   this.show = !this.show;

 }

 // search box

 inputClick() {
   console.log('Key press event')
   this.expand = true;
 }
 OutsideInput() {
   this.expand = false;
 }

 close() {
   this.expand = false;
  
   this.serviceSearchItem = "";
   this.serviceSearchData();
 }

 addCBU(i) {
  this.isLoading=true;
   if (i == 1) {
     this.value = "A to Z"
     this.show = false;
     this.reverse = false;
     this.detectActionValue.emit({ objectRowData: {sortOrder:"0",sortOrdername:"Ascending"}, action: "Sort" ,searchKey:''});
   }
   else if (i == 2) {
     this.value = "Z to A"
     this.show = false;
     this.reverse = true;
     this.detectActionValue.emit({ objectRowData: {sortOrder:"1",sortOrdername:"Descending"}, action: "Sort" ,searchKey:''});
   }
   else if (i == 3) {
     this.value = "Alphabetically3"
     this.show = false;
   }
 }
 generalSelectedAction(rowData, actionRecieved) {    
  console.log('eooror');
    this.detectActionValue.emit({ objectRowData: [rowData], action: actionRecieved ,searchKey:''});
     if ( actionRecieved == 'delete' && this.router.url.includes('order/moreviews'))
    {
     return;
    }
    
    if ( rowData != 'Create' && this.router.url.includes('order/moreviews'))
    {
      this.router.navigate(['/order']);
    } 
}
openMultipleGenericModal(actionRecieved)
{
  let filterData= this.tableCollectionData.filter(x=>x.isChecked);
  this.detectActionValue.emit({ objectRowData: filterData, action: actionRecieved ,searchKey:''});
}
serviceSearchSubject() {
  this.searchText$.next(this.serviceSearchItem)
}
serviceSearchData() {  
  //this.istyping = true;
  //this.userArray=[]
  this.isLoading=true;
  this.detectActionValue.emit({ objectRowData:{sortOrder:this.reverse?'1':'0',sortOrdername:this.reverse?"Descending":"Ascending"}, action: 'search',searchKey:this.serviceSearchItem });
  
}
checkIfAllSelected=(index)=>{
 // this.tableCollectionData[index].isChecked=!this.tableCollectionData[index].isChecked;
  this.selectedRowCount=this.tableCollectionData.filter(x=>x.isChecked).length;
  this.IsDeleteAll=this.selectedRowCount>1?true:false;

}

 ngOnInit(): void {

  if (this.router.url.includes('accounts/accountleads/leadMoreView')) {
    this.sidebar=true;
}
    this.headerData = this.HeaderTableData.filter(x=>x.isFirst);
    this.cardHeader = this.HeaderTableData.filter(x=>!x.isFirst);
    this.isIntialized = true
    // this.searchText$.pipe(debounceTime(1000)
    // ).subscribe(x => {
    //   this.serviceSearchData();
    // })
    this.isLoading=false;
    if (this.TableData.length>0 && this.TableData[0][this.HeaderTableData[0].name] != null && this.TableData[0][this.HeaderTableData[0].name] != undefined) {
      this.tableCollectionData=this.TableData;
      this.tableCollectionData.forEach(element=>{
        element.isChecked=false;
      });
    }else
    {
      this.tableCollectionData = []
    }
   
 }
ngOnChanges() {
  if (this.isIntialized) {
    this.isLoading=false;
    if (this.TableData.length>0 && this.TableData[0][this.HeaderTableData[0].name] != null&& this.TableData[0][this.HeaderTableData[0].name] != undefined) {
      this.tableCollectionData=this.TableData;
      this.tableCollectionData.forEach(element=>{
        element.isChecked=false;
      });
    }else
    {
      this.tableCollectionData = []
    }
  }

}

selectedRowClass(){

  if( this.selectedRowCount > 1 ){
      if(this.router.url == "/accounts/accountlist/moreview" ){

             return 'mt90'
  }
  else{
        return 'mt220'
  }
  }
  else{
    if(this.router.url == "/accounts/accountlist/moreview" ){

      return 'm-top-25 no_pad'
}
    else{
       return 'mt50'
}
  }
}
}
