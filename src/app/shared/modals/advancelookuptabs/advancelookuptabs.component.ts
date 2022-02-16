import { Component, OnInit,Inject,Output, EventEmitter, SimpleChanges, Input,HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatSnackBar } from '@angular/material/';
import { Subject } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged } from 'rxjs/operators';
import { DataCommunicationService } from '@app/core/services/global.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-advancelookuptabs',
  templateUrl: './advancelookuptabs.component.html',
  styleUrls: ['./advancelookuptabs.component.scss']
})
export class AdvancelookuptabsComponent implements OnInit {
  selectedIndex: any;
  constructor(public dialogRef: MatDialogRef<AdvancelookuptabsComponent>, @Inject(MAT_DIALOG_DATA) public data,
  public service : DataCommunicationService,private snackBar: MatSnackBar,public router:Router) { 

   
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  action: any;
  companyName: string;
  showCompany: boolean;
  chnage: boolean = false;
  searchValue :string='';
  searchDBvalue:string = '';
  showCompanySwitch: boolean = true;
  enableBtn:boolean=false;
  isColFilterLoader:boolean = false;
  tempString:string='';
  pageNumber:Number=1;
  selectedData=[];
  wiprodb: boolean = true;
  otherdb: boolean = false;
  Wiprotab:boolean=true;
  DBtab:boolean=false;
  itemPerPage:Number=10;
  prvSelectedData=[];
 clearData:any;
  otherDbSearchData:any={
    pincode:{ value:'',
    isRequired:true,
    iserror:false
  },
    countryvalue:{
      id:"-1",
      name:'',
      isRequired:true,
      iserror:false,
      isPopup:false
    },
    accountname:{
      value:'',
      isRequired:true,
      iserror:false
    }
  }
  arrowkeyLocation = 0;
  isScroll:boolean;

  // isSearchingRecord:boolean=false;
  private searchText$ = new Subject<string>();

  
  @Output() modelEmiter = new EventEmitter<{ objectRowData: any, action: string, currentPage: Number}>();
  companyNameClose() {
    this.otherDbSearchData.countryvalue.isPopup=false;
    this.showCompanySwitch = false;
    
  }
  searchdbClose() {
    this.dialogRef.close({data:"CloseParent"});
  }
  clearSearch() {
    this.searchValue = '';
    this.searchText$.next(this.searchValue)
    
    //this.searchValue.length == null;
  }
  clearSearchdb() {
   
    this.searchValue = '';
    this.searchText$.next(this.searchValue)
  }
  getValidationData()
  {
    if(this.data.errorMsg)
    {
      if(this.data.errorMsg.isError)
      {
      //  this.errorMessage.throwError(this.data.errorMsg.message)
      //  this.snackBar.open(this.data.errorMsg.message, this.action, { duration: 3000 });
      return this.data.errorMsg.message;
      }
      else
      {
        return this.data.Norecordfoundtext ? this.data.Norecordfoundtext:'No record found';
      }
    }else
    {
      return this.data.Norecordfoundtext ? this.data.Norecordfoundtext:'No record found';
    }
  }

  // d& B new 
  getRadioBoxSelectedData(item)
  {
   return this.selectedData.some(x=>x.Id==item.Id);
  }
  getCheckBoxSelectedData(item)
  {
    return this.selectedData.some(x=>x.Id==item.Id);
  }
  overviewClick() {
    this.companyName = '';
    this.wiprodb = true;
    this.otherdb = false;
    this.pageNumber=1;
    this.data.isLoader=true;
    this.data.tabledata=[];
    this.Wiprotab=true;
    this.DBtab=false;
    this.modelEmiter.emit({ objectRowData: {searchKey:this.searchValue,wiprodb:this.wiprodb,controlName:this.data.controlName}, action: 'tabSwich', currentPage:this.pageNumber });
  }
  
  // overviewClicktab(){
  //   this.Wiprotab=true;
  //   this.DBtab=false;
  // }
  // historyClicktab(){
  //   this.Wiprotab=false;
  //   this.DBtab=true;
  // }

  historyClick() {
    this.Wiprotab=false;
    this.DBtab=true;
    this.companyName = '';
    this.wiprodb = false;
    this.otherdb = true;
    this.pageNumber=1;
    this.data.tabledata=[];
    this.data.isLoader=false;
    this.modelEmiter.emit({ objectRowData: {searchKey:this.searchValue,wiprodb:this.wiprodb,controlName:this.data.controlName}, action: 'tabSwich', currentPage:this.pageNumber});
  }
  resetall()
  {
    this.otherDbSearchData= JSON.parse(JSON.stringify(this.clearData));
    this.data.tabledata=[];
    this.data.TotalRecordCount=0;
    this.enableBtn = false
  }
  serviceSearchSubject() {    
    console.log(this.data.tabledata);
    this.searchText$.next(this.searchValue)    
    // if(this.data.tabledata.length>0)
    // {
    
       
      
    // }else
    // {
    //   if(this.searchValue.includes(this.tempString))
    //   {
    //     this.tempString=this.searchValue
    //   }else
    //   {
    //     this.tempString=this.searchValue
    //     this.searchText$.next(this.searchValue)
    //   }
     
    // }
    
  }

  // d&B new 
  serviceSearchData() {  
    this.data.tabledata=[];
    this.data.isLoader=true;
    // this.isSearchingRecord=true;
   this.pageNumber=1;
   this.modelEmiter.emit({ objectRowData: {searchKey:this.searchValue,wiprodb:this.wiprodb,controlName:this.data.controlName}, action: 'search', currentPage:this.pageNumber });

  }

  addAccountClose()
  {
    
   // console.log(this.data.tabledata)
   
   this.dialogRef.close({selectedData:this.selectedData,controlName:this.data.controlName,wiprodb:this.wiprodb,dbSerachData:this.otherDbSearchData, selectedIndex: this.selectedIndex});

  }
  createProspect()
  {
    
   // console.log(this.data.tabledata)
    
    this.dialogRef.close({selectedData:[],controlName:this.data.controlName,wiprodb:this.wiprodb,dbSerachData:this.otherDbSearchData, selectedIndex: this.selectedIndex});

  }
  customRouting()
  {
    this.dialogRef.close({selectedData:[],controlName:this.data.controlName,action:'route',wiprodb:this.wiprodb,dbSerachData:this.otherDbSearchData, selectedIndex: this.selectedIndex});
  }
  prospectAccount()
  {
    this.dialogRef.close({selectedData:this.selectedData,controlName:this.data.controlName,IsProspectAccount:true});
  }

  radioChangeEvent(rowData,isChecked, i)
  {
    this.enableBtn=true;
    this.selectedIndex = i;
    this.data.tabledata.forEach(element => {
      element.isSelected=element.Id==rowData.Id?true:false;
      if(element.isSelected)
      {
        this.selectedData=[element];
      }
    });
    
  }
  selectEntireRow=(rowData,i)=>{
    if(this.data.isCheckboxRequired)
    {
    
      rowData.isSelected=rowData.isSelected?false:true;
      if(rowData.isSelected == true) {
        this.data.tabledata[i].isSelected = true;
        this.selectedData.push(this.data.tabledata[i]);
      }
      if (rowData.isSelected == false){
        this.data.tabledata[i].isSelected = false;
        this.selectedData=this.selectedData.filter(x=>x.Id!=rowData.Id);
   
      }
      this.enableBtn= this.selectedData.length>0?true:false;
    }
    else
    {
      if(!rowData.isSelected)
      {
        this.enableBtn=true;
        this.selectedIndex = i;
        this.data.tabledata.forEach(element => {
          element.isSelected=element.Id==rowData.Id?true:false;
          if(element.isSelected)
          {
            this.selectedData=[element];
          }
        });
      }
    
    }
  }
  getaccountInDNB()
  {
  
    let chekValidation=false;
    if(!this.otherDbSearchData.accountname['value'])
    {
      this.otherDbSearchData.accountname['iserror']=true;
      chekValidation=true;
    }
    if(this.otherDbSearchData.countryvalue.id=="-1")
    {
      this.otherDbSearchData.countryvalue['iserror']=true;
      chekValidation=true;
    }
    if(!chekValidation)
    {
      this.data.isLoader=true;
      this.modelEmiter.emit({ objectRowData: {dbSerachData:this.otherDbSearchData,wiprodb:this.wiprodb}, action: 'dbSearch', currentPage:this.pageNumber });

    }
  }
  autoSearchSubject(data)
  {
    this.otherDbSearchData.countryvalue.iserror=false;
    this.data.otherDbData.isLoader=true;
    this.modelEmiter.emit({ objectRowData: {searchKey:data,wiprodb:this.wiprodb}, action: 'dbAutoSearch', currentPage:this.pageNumber });
  
  }
  selectedAutocompleteInputRow(data)
  {
    this.otherDbSearchData.countryvalue.iserror=false;
    this.otherDbSearchData.countryvalue.id=data.id;
    this.otherDbSearchData.countryvalue.name=data.name;
  }
  
  checkBoxChangeEvent(event,i) 
  {
   
    
    if(event.checked == true) {
      this.data.tabledata[i].isSelected = true;
      this.selectedData.push(this.data.tabledata[i]);
    }
    if (event.checked == false){
      this.data.tabledata[i].isSelected = false;
      this.selectedData=this.selectedData.filter(x=>x.Id!=this.data.tabledata[i].Id);
    }
    this.enableBtn= this.prvSelectedData.length==0?this.selectedData.length>0?true:false:true;
  }
 
  ngOnInit() {
    console.log("log data");
    console.log(this.data);
    this.searchValue = (this.data.inputValue)? this.data.inputValue:"";
    this.data.isLoader=false;
    this.clearData= JSON.parse(JSON.stringify(this.otherDbSearchData));
    this.data.tabledata.forEach(element => {
      element.isSelected=false;
    });
    this.selectedData= JSON.parse(JSON.stringify(this.data.selectedRecord));
    this.prvSelectedData= JSON.parse(JSON.stringify(this.data.selectedRecord));
    this.enableBtn=this.prvSelectedData.length>0?true:false;
   this.wiprodb=this.data.enableOtherDbOnly?false:true;
   this.otherdb=this.data.enableOtherDbOnly?true:false;
    this.searchText$.pipe(debounceTime(1000)).subscribe(x => {
      this.serviceSearchData();
    })

   this.isScroll = this.data.IsHorizontalScroll?true:false; 
   console.log("is scroll values is " + this.isScroll)
  }

  ngOnChanges(changes: SimpleChanges) {
    // debugger;
    // this.enableBtn=false;
    // if(this.data.tabledata.length>0)
    // {
    //   this.data.tabledata.forEach(element => {
    //     element.isSelected=false;
    //   });
    // }
    console.log(changes)
  }

  onReachEnd(event,id) {
    document.getElementById(id).click();
  }
  
  loadMoreEvent() {
  if(this.data.tabledata.length > 0 && this.data.tabledata.length < this.data.TotalRecordCount && this.data.TotalRecordCount > this.itemPerPage && !this.data.isLoader)
    {
      this.data.isLoader=true;
      // this.isSearchingRecord=false;
      console.log('loadMore Emit');
      this.pageNumber = Number(this.pageNumber)+1;
      this.modelEmiter.emit({ objectRowData: {searchKey:this.searchValue,wiprodb:this.wiprodb,controlName:this.data.controlName,dbSerachData:this.otherDbSearchData}, action: 'loadMore', currentPage:this.pageNumber});
    }
    // else
    // {
    //  // this.isSearchingRecord=false;
    //   this.data.isLoader=false;
    // }
   
  }
  loadClass()
  {
    this.data.isLoader=false;
   // this.isSearchingRecord=false;
    return 'i';
  }

  setWidth(){
    let calcWidth=0;
      if (this.data.headerdata.length == 6) {
        calcWidth =1210
      }
      else if (this.data.headerdata.length == 5) {
        calcWidth =1180
      }
      else if (this.data.headerdata.length == 4) {
        calcWidth=952
      }
      else if (this.data.headerdata.length == 3) {
         
        calcWidth= 727
      }
      else if (this.data.headerdata.length == 2) {
         
        calcWidth= 500
      }
      else if (this.data.headerdata.length == 1) {
         
        calcWidth= 295
      } else {
        calcWidth= 500
      } 
      return Math.floor((100 - ((40/calcWidth)*100))/this.data.headerdata.length);
   
  }

}
