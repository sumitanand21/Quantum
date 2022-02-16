import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-order-bfm-expansion",
  templateUrl: "./order-bfm-expansion.component.html",
  styleUrls: ["./order-bfm-expansion.component.scss"]
})
export class OrderBfmExpansionComponent implements OnInit, OnChanges {
  @Input() expansionData;
  @Input() isLoading;
  @Output() expanded = new EventEmitter<boolean>();
  constructor() { }

  dateValue: Date;
  actionOwners: string;
  comments: string;

  ngOnInit() {

  }

  ngOnChanges(simpleChanges) {
    console.log(simpleChanges);
    debugger;
    if (simpleChanges.expansionData && simpleChanges.expansionData.currentValue.ActionableDate) {
      this.dateValue = new Date(simpleChanges.expansionData.currentValue.ActionableDate);
      this.actionOwners = simpleChanges.expansionData.currentValue.ActionOwners;
      this.comments = simpleChanges.expansionData.currentValue.ReminderComments;
    }
  }

  openclosepopup() {
    this.expanded.emit(false);
  }
}
