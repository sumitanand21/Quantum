import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assistnt-defult-message',
  templateUrl: './assistnt-defult-message.component.html',
  styleUrls: ['./assistnt-defult-message.component.scss']
})
export class AssistntDefultMessageComponent implements OnInit {
  message: string= 'Data not available. Digital recommendation will be populated on availability of data under relevant section.'
  constructor() { }

  ngOnInit() {
  }

}
