import { Component, OnInit, Inject } from '@angular/core';
import { RequestresourceComponent } from '../requestresource/requestresource.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { OpportunitiesService } from '@app/core';

@Component({
  selector: 'app-addingmember',
  templateUrl: './addingmember.component.html',
  styleUrls: ['./addingmember.component.scss']
})
export class AddingmemberComponent implements OnInit {
  constructor(public dialog:MatDialog,public dialogRef: MatDialogRef<AddingmemberComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any, private opportunityService : OpportunitiesService) {
     }
     roleName;
     ngOnInit() {
      console.log(this.data);
      this.roleName=this.data.row.Role.name?this.data.row.Role.name:this.roleName=this.data.verticalName.Role.filter(x=>x.id==this.data.row.Role.id)[0].name;
    }
  onNoClick()
  {
    const dialogRef = this.dialog.open(RequestresourceComponent,
      {
        width: '350px'
      });

  }

  onClose() {
    if(this.data.row.additionalComments == '' || this.data.row.additionalComments == null || this.data.row.additionalComments == undefined) {
      this.opportunityService.displayMessageerror("Comment cannot be empty.");
    }
    else {
      var comments = this.data.row.additionalComments.replace(/\s/g, "");
      if(comments.length == 0) {
        this.opportunityService.displayMessageerror("Enter valid comment");
      }
      else if(this.data.row.additionalComments.length < 20) {
        this.opportunityService.displayMessageerror("Comment should be atleast 20 characters.");
      }
      else {
        console.log("data in popup",this.data);
        this.dialogRef.close(this.data);
      }
    }
   
  
  }
}
