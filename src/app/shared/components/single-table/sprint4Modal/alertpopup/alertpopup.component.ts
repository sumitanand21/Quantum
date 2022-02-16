import { Component, OnInit, Inject } from '@angular/core';
import { DataCommunicationService } from '@app/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-alertpopup',
  templateUrl: './alertpopup.component.html',
  styleUrls: ['./alertpopup.component.scss']
})
export class AlertpopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AlertpopupComponent>,public service: DataCommunicationService) { }

  ngOnInit() {
  }

}
