import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-create-activity-group-model',
  templateUrl: './create-activity-group-model.component.html',
  styleUrls: ['./create-activity-group-model.component.scss']
})
export class CreateActivityGroupModelComponent implements OnInit {

  ngOnInit() {
  }

  constructor(public dialogRef: MatDialogRef<CreateActivityGroupModelComponent>) { }

  onNoClick(): void {

    this.dialogRef.close();

  }

  companyName: string;

  showCompany: boolean;

  showCompanySwitch: boolean = true;

  companyNameClose() {

    this.showCompanySwitch = false;

  }
 
  companyDetails: {}[] = [

    { name: "Sin", contact: 'Anubhav Jain', location: 'Singapore', BU: 'Vertical1' },

    { name: "TCS", contact: 'Anubhav Jain', location: 'Singapore', BU: 'Vertical1' },

    { name: "Wipro", contact: 'Anubhav Jain', location: 'Singapore', BU: 'Vertical1' },

    { name: "Sin", contact: 'Anubhav Jain', location: 'Singapore', BU: 'Vertical1' },

    { name: "Sin", contact: 'Anubhav Jain', location: 'Singapore', BU: 'Vertical1' },

    { name: "Sin", contact: 'Anubhav Jain', location: 'Singapore', BU: 'Vertical1' },

    { name: "Sin", contact: 'Anubhav Jain', location: 'Singapore', BU: 'Vertical1' }

  ]

  appendName(value: string) {

    this.companyName = value;

  }
  conversationType = [
    {Value: 'Option 1'},
    {Value: 'Option 2'},
    {Value: 'Option 3'},
  ]
}

