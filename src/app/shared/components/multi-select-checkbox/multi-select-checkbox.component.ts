import { filter } from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-multi-select-checkbox',
  templateUrl: './multi-select-checkbox.component.html',
  styleUrls: ['./multi-select-checkbox.component.scss']
})
export class MultiSelectCheckboxComponent implements OnInit {

  constructor() {

  }

  ngOnInit() {
    this.cbuReadOnlyInput = this.cbuReadOnly;

    console.log(this.Source);
    this.showService = '';
    this.selectedValue = [];
    if (this.Source && this.Source.length > 0) {
      let filteredData = [];
      filteredData = this.Source.filter(s => s.idChecked == true);
      console.log(filteredData);

      this.selectedValue = JSON.parse(JSON.stringify(filteredData));
      console.log(this.selectedValue);
      if (this.selectedValue.length == this.Source.length)
        this.showService = 'ALL';
      else {
        let showCount = '';
        showCount = (this.selectedValue.length > 1) ? ' ( + ' + (this.selectedValue.length - 1) + ')' : '';
        this.showService = this.selectedValue[0].name + showCount;
      }
      // this.showService = (this.selectedValue.length == this.Source.length )? 'ALL' : this.selectedValue.length > 1 ? this.selectedValue[0].name + ' ( + ' + (this.selectedValue.length - 1) + ')' : this.selectedValue.length == 0 ? '' : this.selectedValue[0].name;
      // this.Source.forEach((options, index) => {
      // this.checkIfAllSelected(options, index);
      // });
    }
    // this.Source[0].idChecked=true;
    // this.selectedValue = [{'idchecked':this.Source[0].idChecked,'name':this.Source[0].name}];
    // this.showService=this.Source[0].name
    // this.showService=this.Source.filter(x=>x.idChecked==true)[0].name;
  }

  showcheck: boolean = false;
  showService: string;
  countSelected = [];
  selectedValue = [];
  countStored;
  selectedAll: any;
  myFilter = [];
  cbuReadOnlyInput : boolean = false;

  @Input() Source: any;
  @Input() label: string;
  @Input() Placeholder: String;
  @Input() printAsterisk;
  @Input() cbuReadOnly;

  @Output() selectedContent = new EventEmitter<any>();

  closecheck() {
    this.showcheck = false;
    this.selectedContent.emit(this.selectedValue);
  }

  opencheckbox() {
    this.showcheck = true;
  }
  onChangeField(event){
    if(event.target.value == ""){
      this.clearAllCheckBox();
    }
  }

  clearAllCheckBox() {
    this.showService = '';
    this.countStored = 0;
    this.selectedAll = false;
    for (var i = 0; i < this.Source.length; i++) {

      this.Source[i].idChecked = false;

    }
    this.selectedValue = [];
  }


  selectAll(event) {
    this.selectedValue = [];
    this.countStored = this.Source.length;
    this.showService = "";
    this.Source.map(s => s.idChecked = event.checked);
    console.log(this.Source);

    if (event.checked) {
      this.selectedValue = JSON.parse(JSON.stringify(this.Source));
      this.showService = "All"

      // this.Source.forEach(element => {
      //   element.idChecked = event.checked;
      //   // let exist = this.selectedValue.includes(element)

      //   // if (!exist) {
      //   this.selectedValue.push(element);

      //   // }

      // });

      console.log(this.selectedValue);

    }
    // else {
    //   this.selectedValue = [];
    //   this.showService = ""
    // }


    for (var i = 0; i < this.Source.length; i++) {

      this.Source[i].idChecked = this.selectedAll;
      this.countStored = this.Source.length;
    }
  }

  // check if all records are selected
  checkIfAllSelected(event, options, index) {

    console.log(this.selectedValue)
    console.log(event);
    console.log(this.Source);
    this.Source[index].idChecked = event.checked;
    let x = this.selectedValue.indexOf(options);

    if (event.checked && x == -1) {
      this.selectedValue.push(options);
    }
    else {
      this.selectedValue.splice(x, 1);
    }
    // let x = this.selectedValue.indexOf(options);
    // console.log(this.selectedValue.length, this.Source.length);
    // if (x == -1) {
    //   this.selectedValue.push(options);
    //   console.log(this.selectedValue)

    // } else {
    //   this.selectedValue.splice(x, 1);
    //   console.log(this.selectedValue)
    // }
    console.log(this.selectedValue)
    this.showService = this.selectedValue.length == this.Source.length ? 'ALL' : this.selectedValue.length > 1 ? this.selectedValue[0].name + ' ( + ' + (this.selectedValue.length - 1) + ')' : this.selectedValue.length == 0 ? '' : this.selectedValue[0].name;


    var count = 0;

    for (var i = 0; i < this.Source.length; i++) {

      if (this.Source[i].idChecked == true) {

        count++;
      }
      if (this.Source.length == count) {

        this.selectedAll = true;
        this.myFilter[i] = this.Source;
      }
      else {

        this.selectedAll = false;
        this.myFilter[i] = 0;
      }

      this.countStored = count;
    }

  }


}
