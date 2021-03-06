import { Component, Input, OnInit } from '@angular/core';
import { DataCommunicationService } from '@app/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

  @Input() public isLoading = false;
  @Input() public message: string;

  constructor(public service : DataCommunicationService) { }

  public ngOnInit(): void { }

}
