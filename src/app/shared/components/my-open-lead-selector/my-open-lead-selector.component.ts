import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ErrorMessage } from '@app/core/services/error.services';

@Component({
  selector: 'app-my-open-lead-selector',
  templateUrl: './my-open-lead-selector.component.html',
  styleUrls: ['./my-open-lead-selector.component.scss']
})
export class MyOpenLeadSelectorComponent implements OnInit {
  width:number=window.innerWidth-80;

  constructor(public errorMessage: ErrorMessage,) { }

  ngOnInit() {
  }
  reasonName='-1';
  reasonWrite: any;
  rejectData:any;
  @Input() ConfigData: any;
  @Input() expansionData:any; 
  @Output() detectCommentActionValue = new EventEmitter<{ objectRowData: any, action: string }>();

  
  reject(){
    
       
        if(this.reasonName){

          this.rejectData={
            reasonType:this.ConfigData.reason.filter(x=>x.id==this.reasonName)[0],
            comment:this.reasonWrite
           }
           this.detectCommentActionValue.emit({ objectRowData: { data: this.expansionData, reject:this.rejectData }, action: 'reject' });

        }else{
          this.errorMessage.throwError("Please Fill The Reasons")
        }
    
   
  }
  Cancel()
  {
    this.detectCommentActionValue.emit({ objectRowData: { data: this.expansionData}, action: 'cancel' });
  }
}
