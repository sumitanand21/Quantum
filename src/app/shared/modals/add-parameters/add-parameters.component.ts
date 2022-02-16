import { Component, OnInit, Inject,HostListener } from '@angular/core';
import { CdkDragDrop, CdkDragEnter, moveItemInArray, transferArrayItem, copyArrayItem, } from '@angular/cdk/drag-drop';
import { DataCommunicationService } from '@app/core/services/global.service';
import { actionListService, CommentList } from '@app/core';
import { Observable, of, concat, from } from 'rxjs';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material';
@Component({
  selector: 'app-add-parameters',
  templateUrl: './add-parameters.component.html',
  styleUrls: ['./add-parameters.component.scss']
})
export class AddParametersComponent implements OnInit {
  dataJson: any[] = [
    { id: 1, name: 'Acc. name', isFixed: true, order: 1, default: true, title: 'Acc. name', isFilter: false },
    { id: 2, name: 'Acc. number', isFixed: true, order: 2, default: true, title: 'Acc. number', isFilter: false },
    { id: 3, name: 'Acc. owner', isFixed: false, order: 3, default: true, title: 'Acc. owner', isFilter: false },
    { id: 4, name: 'SBU', isFixed: false, order: 4, default: true, title: 'SBU', isFilter: false },
    { id: 5, name: 'Vertical', isFixed: false, order: 5, default: true, title: 'Vertical', isFilter: false },
    { id: 6, name: 'Sub-vertical', isFixed: false, order: 6, default: true, title: 'Sub-vertical', isFilter: false },
    { id: 7, name: 'Acc. type', isFixed: false, order: 7, default: true, title: 'Acc. type', isFilter: false },
    // { id: 8, name: 'Acc. number', isFixed: false, order: 8, default: true, title: 'Acc. number', isFilter: false },
    { id: 8, name: 'Geo', isFixed: false, order: 8, default: true, title: 'Geo', isFilter: false },
    { id: 9, name: 'Classification', isFixed: false, order: 9, default: true, title: 'Classification', isFilter: false },
    { id: 10, name: 'Region', isFixed: false, order: 10, default: false, title: 'Region', isFilter: false, controltype: 'autocomplete' },
    { id: 11, name: 'Parent', isFixed: false, order: 11, default: false, title: 'Parent', isFilter: false, controltype: 'autocomplete' },
    { id: 12, name: 'Terriotory flag', isFixed: false, order: 12, default: false, title: 'Terriotory flag', isFilter: false, controltype: 'select' },
    { id: 13, name: 'Proposed type', isFixed: false, order: 13, default: false, title: 'Proposed type', isFilter: false, controltype: 'select' },
    { id: 14, name: 'Proposed classification', isFixed: false, order: 14, default: false, title: 'Proposed classification', isFilter: false, controltype: 'select' }
  ]
  hideShow: boolean;
  id?: number;
  name?: string;
  order?: number;
  isFixed?: boolean;
  title: string;
  isLink: boolean;
  routerLink: string;
  isModal: boolean;
  isStatus: boolean;
  className: string;
  hideFilter: boolean;
  isPopUp: boolean;
  dateFormat: string;
  controltype: string;
  //New
  prevArray = [];
  firstPanel;

  secondPanel;
  selArray;
  noContainer = 3
  thirdPanel;
  dialogData: any;
  constructor(public userdat: DataCommunicationService, @Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<AddParametersComponent>) {
    this.dialogData = data;
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  drop(event: CdkDragDrop<any[], any[]>) {

    if (event.container.data[event.currentIndex].isFixed == false) {
      if (event.previousContainer === event.container) {

        //replacing the order when it moved from one panel to other panel
        let item = event.container.data[event.previousIndex].order;
        let item2 = event.container.data[event.currentIndex].order;

        event.container.data[event.previousIndex].order = item2;
        event.container.data[event.currentIndex].order = item;
        //default method to swap the postions in  the array   
        var preItem = event.container.data[event.previousIndex];
        event.container.data[event.previousIndex] = event.container.data[event.currentIndex];
        event.container.data[event.currentIndex] = preItem;
      } else {


        //Checking the position of droping either above the item or below the item

        if (event.currentIndex < event.container.data.length) {
          //replacing the order when it moved from one panel to other panel
          var item = event.previousContainer.data[event.previousIndex];
          var item1 = event.container.data[event.currentIndex];
          var order = item.order;
          item.order = item1.order;
          item1.order = order;
          event.previousContainer.data[event.previousIndex] = item1;
          event.container.data[event.currentIndex] = item;


        }
        else {

          var item = event.previousContainer.data[event.previousIndex];
          var item1 = event.container.data[event.currentIndex - 1];

          var order = item.order;
          item.order = item1.order;
          item1.order = order;
          event.previousContainer.data[event.previousIndex] = item1;
          event.container.data[event.currentIndex - 1] = item;
        }
      }



    }
    else {
      alert("you can't swap the freeze columns");
    }


  }

  createPannel(data: any[]) {
    let headerData = data;

    this.firstPanel = [];
    this.secondPanel = [];
    this.thirdPanel = [];
    //calculating length defult container is set 3
    //spliting header data into 3 parts
    var totalCount = headerData.length;
    if (totalCount > 3) {
      var a1 = Math.floor(totalCount / this.noContainer);
      console.log(a1);
      var remaining = totalCount % this.noContainer;
      console.log(remaining);
      var c1 = a1;
      var c2 = 2 * a1;
      if (remaining == 2) {
        c1 = c1 + 1;
        c2 = c2 + 2;
      }
      if (remaining == 1) {
        c1 = c1 + 1;
        c2 = c2 + 1;
      }
      //looping through items and assign into respective panels

      headerData.forEach((x, i) => {
        if (i < c1) {
          //first panel
          this.firstPanel.push(x);
        }
        if (i > c1 - 1 && i < c2) {
          //second panel
          this.secondPanel.push(x);
        }
        if (i > c2 - 1) {    //third panel
          this.thirdPanel.push(x);
        }
      });

    }
  }
  ngOnInit() {
    this.selArray = [];
    if (this.dialogData.dataKey.length !== 0) {
      this.dialogData.dataKey.forEach(x => {
        this.prevArray.push({ id: x.id, name: x.name, isFixed: x.isFixed, order: x.order, default: x.default, title: x.title, isModal: x.isModal, isLink: x.isLink, isStatus: x.isStatus, className: x.className, hideFilter: x.hideFilter, isPopUp: x.isPopUp, dateFormat: x.dateFormat, controltype: x.controltype })

        if (x.isFixed == true) {
          this.selArray.push(x.id);

        }
        this.createPannel(this.dialogData.dataKey);

      })
    } else {
      this.dataJson.forEach(x => {
        this.prevArray.push({ id: x.id, name: x.name, isFixed: x.isFixed, order: x.order, default: x.default, title: x.title, isModal: x.isModal, isLink: x.isLink, isStatus: x.isStatus, className: x.className, hideFilter: x.hideFilter, isPopUp: x.isPopUp, dateFormat: x.dateFormat, controltype: x.controltype })

        if (x.isFixed == true) {
          this.selArray.push(x.id);

        }
      })
      this.createPannel(this.dataJson);

    }

    //End of new Code

  }

  columSort(event: any, event1: any) {
    if (this.selArray.length <= 4 || !event.isFixed == false) {
      if (event.isFixed == false) {
        this.selArray.push(event.id);
        event.isFixed = !event.isFixed;
      }
      else {
        event.isFixed = !event.isFixed;
        this.selArray = this.selArray.filter(item => item !== event.id);
      }
    } else {
      alert("uh-oh!! you can only freeze 3 columns.");
    }

  }
  onApply(): void {
    let updatedArray = [];
    //concating all items
    let final = concat(this.firstPanel, this.secondPanel, this.thirdPanel);
    final.subscribe(x => updatedArray.push(x));
    //updatedArray.shift();
    this.dialogRef.close(updatedArray);
  }
  onCancel(): void {
    this.dialogRef.close(this.prevArray);

  }

  resetBut(): void {
    let resetArray = [];
    //reseting the headers
    this.dataJson.forEach((x, i) => {
      debugger;
      x.isFixed = false;
      x.order = i + 1;
      resetArray.push({ id: x.id, name: x.name, isFixed: x.isFixed, order: x.order, title: x.title, isModal: x.isModal, isLink: x.isLink, isStatus: x.isStatus, className: x.className, hideFilter: x.hideFilter, isPopUp: x.isPopUp, dateFormat: x.dateFormat, controltype: x.controltype, default: x.default })

    });
    resetArray[0].isFixed = true;
    this.createPannel(resetArray)
    this.selArray = [];

  }
}
