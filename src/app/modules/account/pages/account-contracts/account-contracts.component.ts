import { Component, OnInit,HostListener } from '@angular/core';
import { AccountService } from '@app/core/services/account.service';
import {MatDialog,MatDialogRef} from '@angular/material';
import { DataCommunicationService } from '@app/core';

@Component({
  selector: 'app-account-contracts',
  templateUrl: './account-contracts.component.html',
  styleUrls: ['./account-contracts.component.scss']
})
export class AccountContractsComponent implements OnInit {

  constructor(public service:AccountService, public dialog:MatDialog,public userdat: DataCommunicationService) { }

  ngOnInit() {
  }
  pendingrequests:boolean;
  contractrepository:boolean;
  pendingrequests1()
  {
    this.pendingrequests=true;
    this.contractrepository=false;
  }
  contractrepository1()
    {
      this.pendingrequests=false;
      this.contractrepository=true;
    }

}
@Component({
  selector: 'note-modal',
  templateUrl: './note.html',
})

export class NoteComponent {
  constructor(public dialogRef: MatDialogRef<NoteComponent>) { }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
}