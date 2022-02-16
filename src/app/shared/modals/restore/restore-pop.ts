import { Component,Inject} from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material';
@Component({
    selector: 'restore-pop',
    templateUrl: './restore-pop.html',
  })
  export class restorepopleadComponent { 

    constructor(@Inject(MAT_DIALOG_DATA) public data){}

  }