import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {Location} from '@angular/common';

@Injectable({
    providedIn: 'root'
  })
export class RoutingState {
  private history = [];

  constructor(
    private router: Router,
    private _location: Location
  ) {}

  public loadRouting(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(({urlAfterRedirects}: NavigationEnd) => {
        this.history = [...this.history, urlAfterRedirects];
      });
  }

  public getHistory(): string[] {
    return this.history;
  }

  public getPreviousUrl(): string {
    return this.history[this.history.length - 2] || '/home/dashboard';
  }

  public getCancelPreviousUrl(): string {
    return this.history[this.history.length - 2] || '/activities/list';
  }

  public getTwoPreviousUrl(): string {
    return this.history[this.history.length - 3] || '/home/dashboard';
  }

  public getThreePreviousUrl(): string {
    return this.history[this.history.length - 4] || '/home/dashboard';
  }

  backClicked() {
    console.log("back clicked",this._location)
    this._location.back();
  }
}