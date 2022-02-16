import { Component, Input, OnInit } from '@angular/core';
import { DataCommunicationService } from '@app/core';

@Component({
  selector: 'app-small-spinner',
  templateUrl: './small-spinner.component.html',
  styleUrls: ['./small-spinner.component.scss']
})
export class SmallSpinnerComponent implements OnInit {

  @Input() public isLoading = false;
  @Input() public message: string;

  constructor(public service : DataCommunicationService) { }

  public ngOnInit(): void { }

}
