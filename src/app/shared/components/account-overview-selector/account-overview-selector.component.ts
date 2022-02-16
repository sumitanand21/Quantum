import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-account-overview-selector',
  templateUrl: './account-overview-selector.component.html',
  styleUrls: ['./account-overview-selector.component.scss']
})
export class AccountOverviewSelectorComponent implements OnInit {

  desp_cntnt:boolean=true;
  cmnts_cntnt:boolean;
  expand_section_cmnt:boolean;

  optionArray: any[];
  @Input() tableName:any;
  @Input() expansionData:any;
  overView=[];
  overallCommentLength: number =0;
  width:number=window.innerWidth - 30;
  viewtab:boolean=true;
  historytab:boolean;

  constructor() { }
  
  ngOnInit():void {

    var y = 80;
    var x = window.innerWidth;
    console.log("inner width is "+ window.innerWidth)
    this.overView=[];
    console.log("Expandsion data",this.expansionData);
 
    if(this.expansionData.OverAllComments)
    {
      if(Array.isArray (this.expansionData.OverAllComments))
      {
        if(this.expansionData.OverAllComments.length>0)
        {
          this.overallCommentLength = this.expansionData.OverAllComments.length; 
          this.overView.push(this.expansionData.OverAllComments[0]);
        }
      }
     
    }
    
   console.log(this.tableName)
     this.desp_cntnt = true;
     this.cmnts_cntnt = false;   
     
    // this.width = (window.innerWidth - y);
 
    // var comment = this.userdat.getCommentsData();
    // comment.subscribe((x: CommentList[]) => {
    //   this.comntArray = x;
    // });

    // var option = this.userdat.getfilterData();
    // option.subscribe((x: OptionList[]) => {
    //   this.optionArray = x;
    // });
  }

  

  showdesp_cntnt()
  {
    this.desp_cntnt = true;
    this.cmnts_cntnt = false;    
   
    
  }
  overviewtab(){
    this.viewtab=true;
    this.historytab=false;
  }

  overhistorytab(){
    this.viewtab=false;
    this.historytab=true;
  }
  showcmnts_cntnt()
  {
     this.desp_cntnt = false;
    this.cmnts_cntnt = true;    

  }

  calWidth(){
           if( window.innerWidth > 1024) {
            return  window.innerWidth-(100)
            // +(window.innerWidth - 1024)
      }

      else{
          return  window.innerWidth-75
      }
  }
 


  

}

