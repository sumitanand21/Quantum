import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ActionList, CommentList, OptionList } from '@app/core/models/actionList.model';
import { teamService } from '@app/core/services/team.service';
import { AnimationStyles } from '@ngu/carousel/lib/ngu-carousel/ngu-carousel';

@Component({
  selector: 'app-opportunity-expansion-team',
  templateUrl: './opportunity-expansion-team.component.html',
  styleUrls: ['./opportunity-expansion-team.component.scss']
})
export class OpportunityExpansionTeamComponent implements OnInit {
  desp_cntnt:boolean=true;
  cmnts_cntnt:boolean;
  expand_section_cmnt:boolean;
  comntArray: CommentList[];
  optionArray: any[];
  width:number=window.innerWidth-140;
  @Input() commentSectionVisibility:number;
  
  @Input() expansionData;

  localPartentRef:boolean;
  expansion_data ;
  constructor(private userdat: teamService) { 
  }
  
  ngOnInit():void {
    debugger;
    if(this.commentSectionVisibility != 0) {
      this.localPartentRef = true;
    }else{
      this.localPartentRef =  false;
    }
    
    var comment = this.userdat.getCommentsData();
    comment.subscribe((x: CommentList[]) => {
      this.comntArray = x;
    });

    var option = this.userdat.getfilterData();
    option.subscribe((x: OptionList[]) => {
      this.optionArray = x;
    });
    console.log(this.expansionData);
    this.expansion_data = this.expansionData.expansionData[0];
  }

  ngOnChanges() {
    this.localPartentRef = this.commentSectionVisibility != 0? true:false;
    if(this.localPartentRef){
      
      this.cmnts_cntnt = false;
      this.desp_cntnt = false;
    }
  }

  showdesp_cntnt()
  {
    this.desp_cntnt = true;
    this.cmnts_cntnt = false;    
    this.localPartentRef = false; 
    
  }
  showcmnts_cntnt()
  {
   
    this.desp_cntnt = false;
    this.cmnts_cntnt = true;    
    this.localPartentRef = false; 
  }

  postComment(){
    this.desp_cntnt = false;
    this.cmnts_cntnt = true;    
    this.localPartentRef = false;
  }

  navigateToCatalyst() {
    // window.location.href="https://catalyst.wipro.com/publiczone/SitePages/CatHome.aspx";
    console.log("navigateToCatalyst",this.expansion_data);
    // if(!this.expansion_data.disable)
      window.open('https://catalyst.wipro.com/publiczone/SitePages/CatHome.aspx','_blank');
  }
  

}
