import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-assistant-collaboration',
  templateUrl: './assistant-collaboration.component.html',
  styleUrls: ['./assistant-collaboration.component.css']
})
export class AssistantCollaborationComponent implements OnInit {

  @ViewChild('wittyChatFormId') postForm: ElementRef;
  reqBody: any;
  constructor() { }

  ngOnInit() {
  }
  onLoad() {
    console.log('onLoad triggered.');
  }
  public signed_request;


}
