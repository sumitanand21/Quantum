import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ActionList, CommentList, OptionList } from '@app/core/models/actionList.model';
import { actionListService } from '@app/core/services/actionList.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'accordian-selector',
  templateUrl: './accordian-selector.component.html',
  styleUrls: ['./accordian-selector.component.scss']
})
export class AccordianSelectorComponent implements OnInit {
  desp_cntnt: boolean = true;
  cmnts_cntnt: boolean;
  expand_section_cmnt: boolean;
  comntArray: CommentList[];
  optionArray: any[];
  @Input() commentSectionVisibility: number;
  @Input() expansionData: any;
  @Output() detectCommentActionValue = new EventEmitter<{ objectRowData: any, action: string }>();
  localPartentRef: boolean;
  commentArea: string;
  width:number=window.innerWidth-80;

  constructor(private userdat: actionListService, public matSnackBar: MatSnackBar) { }

  ngOnInit(): void {

    // var y = 80;
    // var x = window.innerWidth;
    // document.getElementsByClassName('expand-table-panel')[0]['style'].width = (x - y) + 'px';

    if (this.commentSectionVisibility != 0) {
      this.localPartentRef = true;
    } else {
      this.desp_cntnt = true;
      this.cmnts_cntnt = false;
      this.localPartentRef = false;
    }
  }

  ngOnChanges() {
    this.commentArea = null
    this.localPartentRef = this.commentSectionVisibility != 0 ? true : false;
    if (this.localPartentRef) {

      this.cmnts_cntnt = false;
      this.desp_cntnt = false;
    }
  }

  showdesp_cntnt() {
    this.desp_cntnt = true;
    this.cmnts_cntnt = false;
    this.localPartentRef = false;

  }
  showcmnts_cntnt() {
    this.detectCommentActionValue.emit({ objectRowData: { data: this.expansionData }, action: 'loadComment' });
    this.desp_cntnt = false;
    this.cmnts_cntnt = true;
    this.localPartentRef = false;
  }

  postComment() {
    if (this.commentArea === null || this.commentArea === "") {
      let message = "Kindly fill the comments"
      let action
      this.matSnackBar.open(message, action, {
        duration: 2000
      })
    } else {
      this.detectCommentActionValue.emit({ objectRowData: { data: this.expansionData, comment: this.commentArea }, action: 'comment' });

      this.desp_cntnt = false;
      this.cmnts_cntnt = true;
      this.localPartentRef = false;
      this.commentArea = '';
    }
  }

}
