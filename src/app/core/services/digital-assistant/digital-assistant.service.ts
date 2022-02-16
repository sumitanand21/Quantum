import { Injectable, HostListener } from "@angular/core";
import { environment } from "@env/environment";
import { Subject, Observable, BehaviorSubject } from "rxjs";
import { ellaQuestion } from "../ella.question";
import { Router } from "@angular/router";
import { EnvService } from "../env.service";

@Injectable({ providedIn: 'root' })
export class DigitalAssistantService {


  private dalListner = new Subject<any>();
  iframePage = 'Home';
  postMessageData;
  private ChangeDaUrl = new BehaviorSubject('WittyIframe');
  WittyIframe = this.ChangeDaUrl.asObservable();

  constructor(private router: Router, public envr : EnvService) { }

  ChangeDa(deal) {
    console.log(deal)
    this.ChangeDaUrl.next(deal)

    // console.log()
  }

  listen(): Observable<any> {
    return this.dalListner.asObservable();
  }

  filter(filterBy: string) {
    this.dalListner.next(filterBy);
  }

  public postMessage(body: any): void {
    this.postMessageData = { ...body, ...this.ellaQuestionList() }
    let iframeWin = (<HTMLIFrameElement>document.getElementById("useriframe"));
    if (iframeWin) {
      console.log("this is where we post message");
      console.log('DA123', JSON.stringify({ ...body, ...this.ellaQuestionList() }))
      iframeWin.contentWindow.postMessage(this.postMessageData, this.envr.daUrl);

    }
  }


  ellaQuestionList() {
    const splitString = this.router.url.split("/");
    switch (splitString[1]) {
      case "accounts":
        return { ellaQuestions: ellaQuestion.Account };
      case "opportunity":
        return { ellaQuestions: ellaQuestion.Opportunity };
      case "order":
        return { ellaQuestions: ellaQuestion.Order};
      case "activities":
        return { ellaQuestions: ellaQuestion.Activity };
      case "leads":
        return { ellaQuestions: ellaQuestion.Lead };
      case "contacts":
        return { ellaQuestions: ellaQuestion.Contacts };
      default:  return { ellaQuestions: ellaQuestion.GenericFeatures};
    }
  }
}