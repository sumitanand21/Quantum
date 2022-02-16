import { Component, OnInit ,HostListener} from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm-prospect',
  templateUrl: './confirm-prospect.component.html',
  styleUrls: ['./confirm-prospect.component.scss']
})
export class ConfirmProspectComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ConfirmProspectComponent>) { }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  ngOnInit() {
  }

}
