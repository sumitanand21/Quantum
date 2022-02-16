import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataCommService {
  private behave = new BehaviorSubject<Object[]>(undefined);

  constructor() { }

  setBehaviorView(behave: Object[]) {
    this.behave.next(behave);
  }

  getBehaviorView(): Observable<any> {
    return this.behave.asObservable();
  }

}

@Injectable({
  providedIn: 'root'
})
export class NewDocStatusService {
  private behave = new BehaviorSubject<boolean>(undefined);

  constructor() { }

  setBehaviorView(behave: boolean) {
    this.behave.next(behave);
  }

  getBehaviorView(): Observable<any> {
    return this.behave.asObservable();
  }

}

@Injectable({
  providedIn: 'root'
})
export class RefrenceDocStatusService {
  private behave = new BehaviorSubject<boolean>(undefined);

  constructor() { }

  setBehaviorView(behave: boolean) {
    this.behave.next(behave);
  }

  getBehaviorView(): Observable<any> {
    return this.behave.asObservable();
  }

}



@Injectable({
  providedIn: 'root'
})
export class PreveDocPopUp {
  private behave = new BehaviorSubject<any>(undefined);

  constructor() { }

  setBehaviorView(behave: any) {
    this.behave.next(behave);
  }

  getBehaviorView(): Observable<any> {
    return this.behave.asObservable();
  }

}
