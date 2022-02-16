import { Component, OnInit, Inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, filter, pluck } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ProjectService, Project, Conversation, ConversationService } from '@app/core';
import { Observable, of, concat, from } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DataCommunicationService } from '@app/core/services/global.service';
import { convoActivityListService } from '@app/core/services/convoActivityList.service';
import { ActivityList } from '@app/core/models/convoActivityList.model';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss']
})
export class ActivityListComponent implements OnInit {

  constructor(private conversation: convoActivityListService,private router: Router) { }
  childConvoActivityTable = [];
  ngOnInit() {
    var orginalArray = this.conversation.getAll();
    orginalArray.subscribe((x: any[]) => {
      this.childConvoActivityTable = x;
    });
  }
  performTableChildAction(childActionRecieved): Observable<any> {
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {

      case 'share': {
        this.router.navigateByUrl('/conversations/shareconversation');
      }
      case 'restore': {
        return of('share Trigger');
      }

      case 'nurture': {
        return of('nurture Trigger');

      }

      case 'convertOpportunity': {

        return of('nurture Trigger');

      }

      case 'archiveLead': {

        return of('nurture Trigger');

      }
      case 'Agenda':{
        console.log(actionRequired)
        this.router.navigate(['/conversations/childInfo']);
        }
    }
  }
}
