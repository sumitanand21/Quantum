import { Component, OnInit } from '@angular/core';
import { DataCommunicationService } from '@app/core/services/global.service';
@Component({
  selector: 'app-win-loss-reasons',
  templateUrl: './win-loss-reasons.component.html',
  styleUrls: ['./win-loss-reasons.component.scss']
})
export class WinLossReasonsComponent implements OnInit {

  headernonsticky1: any;
  headernonsticky2: any;
  bodynonsticky1: any;
  bodynonsticky2: any;
  bodynonsticky3: any;
  bodynonsticky4: any;
  constructor(public service: DataCommunicationService) {
    this.headernonsticky1 = [{ name: "Name" }, { name: "Kushal Shah" }, { name: "" }, { name: "Rakesh Sharma" }, { name: " " }, { name: "Harsha Patel" }, { name: "  " },];
    this.bodynonsticky1 = [
    { "Name": "Loss category*", "Kushal Shah": "Connection", "": "Connection", "Rakesh Sharma": "Connection", " ": "Connection", "Harsha Patel": "Connection", "  ": "Connection" },
    { "Name": "Loss category*", "Kushal Shah": "Alignment with Decision Process", "": "Alignment with Decision Process", "Rakesh Sharma": "Alignment with Decision Process", " ": "Alignment with Decision Process", "Harsha Patel": "Alignment with Decision Process", "  ": "Alignment with Decision Process" },
    { "Name": "Loss category*", "Kushal Shah": "Customer Feedback", "": "Customer Feedback", "Rakesh Sharma": "Customer Feedback", " ": "Customer Feedback", "Harsha Patel": "Customer Feedback", "  ": "Customer Feedback" },
    { "Name": "Loss category*", "Kushal Shah": "Customer Feedback", "": "Customer Feedback", "Rakesh Sharma": "Customer Feedback", " ": "Customer Feedback", "Harsha Patel": "Customer Feedback", "  ": "Customer Feedback" },
    { "Name": "Loss category*", "Kushal Shah": "Sarthak Das", "": "Sarthak Das", "Rakesh Sharma": "Vidyut Kumar", " ": "Vidyut Kumar", "Harsha Patel": "Arjun Kumar", "  ": "Arjun Kumar" }
    ];
    this.headernonsticky2 = [{ name: "Name" }, { name: "Kushal Shah" }, { name: "Rakesh Sharma" }, { name: "Harsha Patel" },];
    this.bodynonsticky2 = [
    { "Name": "Reason1", "Kushal Shah": "Presentation", 
    "Rakesh Sharma": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, seddo eiusmod tempor incididunt ut labore et dolore magna", "Harsha Patel": "Presentation"},
    { "Name": "Reason1", "Kushal Shah": "Presentation",
    "Rakesh Sharma": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, seddo eiusmod tempor incididunt ut labore et dolore magna", " ": "", "Harsha Patel": "Presentation", "  ": "" },
    { "Name": "Reason1", "Kushal Shah": "Presentation",
    "Rakesh Sharma": "-", "Harsha Patel": "Presentation" },
    ];

    this.bodynonsticky3 = [
    { "Name": "Reason1", "Kushal Shah": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, seddo eiusmod tempor incididunt ut labore et dolore magnaaliqua. Ut enim ad minim veniam, quis nostrud exercitationullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit",
     "Rakesh Sharma": "Presentation", "Harsha Patel": "Connection" },
    { "Name": "Reason1", "Kushal Shah": "Presentation", "Rakesh Sharma": "Presentation", "Harsha Patel": "Presentation"},
    { "Name": "Reason1", "Kushal Shah": "-", "Rakesh Sharma": "Customer Presentation", "Harsha Patel": "Presentation" },
    ];
    this.bodynonsticky4 = [
    { "Name": "Reason1", "Kushal Shah": "Presentation", "Rakesh Sharma": "Presentation", "Harsha Patel": "Presentation" },
    { "Name": "Reason1", "Kushal Shah": "Presentation", "Rakesh Sharma": "Presentation", "Harsha Patel": "Presentation" },
    { "Name": "Reason1", "Kushal Shah": "Presentation", "Rakesh Sharma": "Presentation", "Harsha Patel": "Presentation" },
    ];

  }
  goBack() {
    window.history.back();
  }

  ngOnInit() {
  }


}
