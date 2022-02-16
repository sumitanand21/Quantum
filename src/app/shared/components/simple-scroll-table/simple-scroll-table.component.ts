import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DataCommunicationService } from '@app/core';
import { PaginationInstance } from 'ngx-pagination';
@Component({
  selector: 'app-simple-scroll-table',
  templateUrl: './simple-scroll-table.component.html',
  styleUrls: ['./simple-scroll-table.component.scss']
})
export class SimpleScrollTableComponent implements OnInit {
  headernonsticky1: any;
  bodynonsticky1: any;
  IsPageChangeEvent: boolean;
  @Input() TableName: string;
  @Input() totalTableCount: number;
  @Input() IscheckBoxRequired: boolean=false;
  @Input() TableCollection:any;
  @Input() TableHeader:any;
  @Input() IsPaginationRequired:boolean=false;  
  @Input() IsDelete: boolean;  
  @Input() IsActionFixed: boolean;
  
  @Input() IsFreezedColumn: boolean;

  @Output() detectPageChangeData = new EventEmitter<{ objectRowData: any, action: string }>();
 
  userArray=[];
  headerArray=[];
  filterBox=[];
  isLoading:boolean=false;
  selectAll:boolean=false;
  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: undefined,

  };
  constructor(public service: DataCommunicationService) {
    
   

  }

  ngOnInit() {
    this.config.id=this.TableName?this.TableName:'custom';
    this.headerArray = this.TableHeader;
    this.selectAll=false;
    if (this.TableCollection[0][this.headerArray[0].name] != null) {
      // debugger;

      //18OCT New changes loadTableData starts here
     

      //18OCT New changes loadTableData ends here

      this.userArray = this.TableCollection;

      this.config.currentPage = 1;
      

      console.log(this.userArray)
    } else {
      this.config.totalItems = 0;
      this.userArray = []
    }
  }
  openDelete(tableData,actionName){
    this.detectPageChangeData.emit({objectRowData:tableData,action:actionName})
  }
  
  pageChangeEvent(event) {
   
    if (this.config.currentPage != event) {
      // this.show = false;
      // this.reverse = false;
      
      this.config.currentPage = event;
      const perPage = this.config.itemsPerPage;
      const start = ((event - 1) * perPage) + 1;
      const end = start + perPage - 1;
      let temp = this.userArray.filter(data => data.index >= start && data.index <= end);
      if (this.IscheckBoxRequired) {
     //   this.userArray.forEach(x => x.isCheccked = false);
      //  this.selectedRowCount = 0;
      }

      if (temp.length != perPage) {
        let callAPI = true;

        //let numberOfPages = Math.ceil(this.config.totalItems / this.config.itemsPerPage);
        //let isLastPageFlag = numberOfPages == event;
        let isLastPageFlag = (this.totalTableCount >= start && this.totalTableCount <= end);
        if (isLastPageFlag) {
          let lastIndex = this.userArray[this.userArray.length - 1].index;
          if (lastIndex == this.totalTableCount) {
            callAPI = false;
         
          }
        }
        if (callAPI) {
          this.IsPageChangeEvent = true;
          this.isLoading = true;
     //     this.detectPageChangeData.emit({ objectRowData: this.userdat.serviceSearchItem, action: 'pagination', currentPage: event, itemsPerPage: perPage, filterData: this.headerFilterDetails });
        }

      } else {
        // the pipe will take care of this

      }
    }
  }

  changeItemsPerPage(event) {
   
    this.config.itemsPerPage = parseInt(event.target.value);
    const currentPageVal = 1;
    this.config.currentPage = 1;
    const perPage = this.config.itemsPerPage;
    const start = ((currentPageVal - 1) * perPage) + 1;
    const end = start + perPage - 1;
    let temp = this.userArray.filter(data => data.index >= start && data.index <= end);
    if (this.IscheckBoxRequired) {
     // this.userArray.forEach(x => x.isCheccked = false)
     // this.selectedRowCount = 0;
    }

    if (temp.length != perPage) {
      let callAPI = true;
      //let numberOfPages = Math.ceil(this.config.totalItems / this.config.itemsPerPage);
      //let isLastPageFlag = numberOfPages == event;
      let isLastPageFlag = (this.totalTableCount >= start && this.totalTableCount <= end);
      if (isLastPageFlag) {
        let lastIndex = this.userArray[this.userArray.length - 1].index;
        if (lastIndex == this.totalTableCount) {
          callAPI = false;
        
        }
      }
      if (callAPI) {
        this.IsPageChangeEvent = true;
        this.isLoading = true;
       // this.detectPageChangeData.emit({ objectRowData: this.userdat.serviceSearchItem, action: 'pagination', currentPage: this.config.currentPage, itemsPerPage: perPage, filterData: this.headerFilterDetails });
      }

    } else {
      // the pipe will take care of this
    }
  }


  checkIfAllSelected(event,actionName,rowData?)
  {
    if(actionName == "selectAll")
    {
      let myobject={
        tableData:{},
        checked:event.checked
      }
      this.selectAll=event.checked;
      this.userArray.forEach(x=>x.isCheccked=event.checked);
      this.detectPageChangeData.emit({objectRowData:myobject,action:actionName})
      
    }
    else
    {
      let myobject={
        tableData:rowData,
        checked:event.checked
      }
      rowData.isCheccked=event.checked;
     
      var checkedCount=this.userArray.filter(x=>x.isCheccked==true).length;
      this.selectAll=checkedCount==this.totalTableCount?true:false;
      this.detectPageChangeData.emit({objectRowData:myobject,action:actionName})
      
    }
  }
  ngOnChanges(simpleChanges) {
    this.headerArray = this.TableHeader;
    if (simpleChanges.totalTableCount) {
      console.log('simpleChanges', simpleChanges)
      this.config.totalItems = simpleChanges.totalTableCount.currentValue;
      console.log(this.config);
    }
    if (this.TableCollection[0][this.headerArray[0].name] != null) {
      // debugger;

      //18OCT New changes loadTableData starts here
     

      //18OCT New changes loadTableData ends here

      this.userArray = this.TableCollection;

      this.config.currentPage = 1;
      

      console.log(this.userArray)
    } else {
      this.config.totalItems = 0;
      this.userArray = []
    }
     this.selectAll=false;
  }
  
}
