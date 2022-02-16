import { Component, OnInit } from '@angular/core';
import { DataCommunicationService, ErrorMessage } from '@app/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { GetSetMethod } from '@app/core/services/deals/deal-setget.service';
import { dealService } from '@app/core/services/deals.service';

@Component({
  selector: 'app-tracker-edit-page',
  templateUrl: './tracker-edit-page.component.html',
  styleUrls: ['./tracker-edit-page.component.scss']
})
export class TrackerEditPageComponent implements OnInit {
  createAction: FormGroup;
  dealOverview: any;
  isLoading: boolean=false;
  selecteddependent: {}[] = [];
  selectedmembers: {}[] = [];
  
  constructor(
    public service: DataCommunicationService,
    private dealService: dealService,
    private formBuilder: FormBuilder,
    private _error: ErrorMessage,
    public router: Router,
    private encrDecrService: EncrDecrService,
    private getSetData: GetSetMethod
  ) 
  { 
    this.createAction = this.formBuilder.group({
      actionType: [''],
      actionName: ['', Validators.required],
      actionModule: [''],
      actionOwner: [''],
      actionOwnerSysGuid:[''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      templateType: [1],
      attachTemplate: [''],
      documentName: [],
      templateTypeWipro: [''],
      templateTypeWiproName: [''],
      description: [''],
      member: [],
      addMember: [''],
      escalationcontact: [],
      memberarr: this.formBuilder.array([]),
      actiondependent: [],
      actiondependentarr: this.formBuilder.array([]),
      ProposalStatus: [1]
    })
    this.dealOverview = JSON.parse(this.encrDecrService.get("EncryptionEncryptionEncryptionEn", sessionStorage.getItem('Dealoverview'), "DecryptionDecrip"));
  }

  ngOnInit() {
    let editId = this.getSetData.getData();
    this.editActon(editId)
    this.getSetData.setData(false);
  }

  editActon(inputId) {
    this.isLoading = true;
    this.dealService.detailsAction({ "Id": inputId }).subscribe(res => {
      this.isLoading = false;
      console.log(res)
      console.log(res.ResponseObject.ActionType.Id)
      console.log(res.ResponseObject.DependentActions);
      res.ResponseObject.DependentActions.map(item => {
        item.Id = item.Id,
        item.contact = item.Name,
        item.Name = item.Name,
        item.LinkActionType = 2
      });

      res.ResponseObject.CustomerContact.map(item => {
        item.contact = item.FullName,
          item.initials = item.Guid,
          item.LinkActionType = 2
      })

      this.selecteddependent = res.ResponseObject.DependentActions;
      const control = <FormArray>this.createAction.controls.actiondependentarr;
      res.ResponseObject.DependentActions.map((item)=>{
        control.push(this.formBuilder.group(item))
      })

      this.selectedmembers = res.ResponseObject.CustomerContact;
      const control1 = <FormArray>this.createAction.controls.memberarr;
      res.ResponseObject.CustomerContact.map((item)=>{
        control1.push(this.formBuilder.group(item))
      })
      
      this.createAction.controls.actionOwnerSysGuid.setValue(res.ResponseObject.Owner.SysGuid);
      this.createAction.patchValue(
        {
          "actionType": res.ResponseObject.ActionType.Id,
          "actionName": res.ResponseObject.Name,
          "actionModule": res.ResponseObject.Module.Id,
          "actionOwner": res.ResponseObject.Owner.FullName,
          "startDate": res.ResponseObject.StartDate,
          "endDate": res.ResponseObject.EndDate,
          "escalationcontact": res.ResponseObject.Escalation,
          "templateType": res.ResponseObject.TemplateType,
          "attachTemplate": res.ResponseObject.Document.Name,
          "templateTypeWipro": res.ResponseObject.TemplateUrl,
          "description": res.ResponseObject.Description,
          "ProposalStatus": res.ResponseObject.Status
        });
    });
  }
}
