import { Injectable } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd, NavigationStart } from "@angular/router";
import { filter, map, mergeMap } from "rxjs/operators";
import { ErrorMessage } from "./error.services";
import { EncrDecrService } from "./encr-decr.service";
import { environment as env } from '@env/environment';
import * as CryptoJS from 'crypto-js';
import { Observable } from "rxjs";
import { of } from 'rxjs';
import { EnvService } from "./env.service";

export interface RouteHistory {
    id?: number;
    parentId?: number;
    url?: string;
    tab?: boolean;
}

export interface RouterData {
    id?: number,
    parentId?: number,
    url?: string,
    hasChild?: boolean,
    isTab?: boolean,
}

export class SomeModel {
    routeData: any;
    navEnd: any;
}



@Injectable({
    providedIn: "root"
})
export class CommonService {

    private browserRefresh: boolean = false;
    private previousUrl: string = undefined;
    private currentUrl: string = undefined;

    constructor(private router: Router,
        private activatedRoute: ActivatedRoute,
        private _error: ErrorMessage,
        private encService: EncrDecrService,public envr : EnvService) {
        this.currentUrl = this.router.url;
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.previousUrl = this.currentUrl;
                this.currentUrl = event.url;
            }
        });

        router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                this.browserRefresh = !router.navigated;
                if (this.browserRefresh) {
                    this.getCourse();
                }
            }
        });
    }

    // routing

    public getRouterSnapshot() {
        return this.previousUrl;
    }

    private history: RouteHistory[] = [];
    public loadRouting(): void {
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(({ urlAfterRedirects, id }: NavigationEnd) => {
                let foundIndex = this.history.findIndex(x => x.url === urlAfterRedirects)
                if (foundIndex === -1) {
                    let strToArr = urlAfterRedirects.split('/');
                    let omittedArr = strToArr.slice(0, -1);
                    let arrToString = omittedArr.toString().replace(/,/g, '/');
                    let concatedString = arrToString.concat('/');
                    this.history.push({ id: id, url: urlAfterRedirects, tab: false, parentId: 0 });
                    if (this.history.length > 1) {
                        this.history[this.history.length - 1].parentId = this.history[this.history.length - 2].id;
                    }
                    let tabsFound = this.history.filter(x => x.url.indexOf(concatedString) > -1);
                    if (tabsFound.length > 1) {
                        for (let i = 0; i < tabsFound.length; i++) {
                            let idx = this.history.findIndex(x => x.id === tabsFound[i].id);
                            this.history[idx].tab = true;
                        }
                        let prevIdx = this.history.findIndex(x => x.id === tabsFound[0].parentId);
                        this.history[prevIdx].tab = false;
                    }
                    this.setCourse();
                }
            });
    }


    // read router data attributes
    routeData: RouterData[] = [];
    public getDataFromRouter() {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map((x) => {
                let route = this.activatedRoute.firstChild;
                let child = route;
                while (child) {
                    if (child.firstChild) {
                        child = child.firstChild;
                        route = child;
                    } else {
                        child = null;
                    }
                }
                let obj: any = { routeData: route.data, navEnd: x }
                return obj;
            }),
            mergeMap(route => {
                return of(route);
            })
        ).subscribe(data => {
            let navEnd = data.navEnd;
            let routeData = data.routeData.value;
            this.routeData.push({
                id: navEnd.id,
                parentId: navEnd.id,
                url: navEnd.urlAfterRedirects,
                isTab: routeData.isTab ? routeData.isTab : false,
                hasChild: routeData.hasChild ? routeData.hasChild : false
            });
            let parentFound = this.routeData.findIndex(x => x.hasChild === true);
            let hasChildArr = this.routeData.filter(x => x.hasChild);
            if(hasChildArr.length > 0) {
                for (let i = 0; i < hasChildArr.length; i++) {
                    let idx = this.routeData.findIndex(x=>x.id === hasChildArr[i].id);
                    this.routeData[idx].parentId == hasChildArr[idx].id;
                }
            }
            //////
            if (parentFound > 1 && this.routeData.length > 1) {
                if (routeData.isTab && !routeData.hasChild) {
                    this.routeData[this.routeData.length - 1].parentId = this.routeData[parentFound].id;
                    return;
                } else {
                    this.routeData[this.routeData.length - 1].parentId = this.routeData[this.routeData.length - 2].id
                }
            }

        });
    }
    // read router data attributes

    public goBack() {
        let idx = this.routeData.findIndex(x => x.url === this.currentUrl);
        if (this.routeData.length > 1) {
            // checking for tabs
            if (this.routeData[this.routeData.length - 1].isTab) {
                let previousPageUrl = this.routeData[this.routeData.length - 2].url;
                let idx = this.routeData.findIndex(x => x.url === previousPageUrl);
                for (let i = this.routeData.length - 1; i >= 0; i--) {
                    if (!this.routeData[i].isTab) {
                        previousPageUrl = this.routeData[i].url;
                        break;
                    }
                }
                this.router.navigateByUrl(previousPageUrl).then(res => {
                    if (!res) {
                        this._error.throwError('Error occured, please refresh');
                    }
                })
                this.routeData.length = idx;
                this.setCourse();
                return;
            }

        }
        this.router.navigateByUrl(this.previousUrl).then(res => {
            if (!res) {
                this._error.throwError('Error occured, please refresh');
            }
        });
        this.routeData.pop();
        this.setCourse();
        return;
    }

    private getCourse() {
        if ('course' in localStorage) {
            try {
                let decryptedValue = CryptoJS.AES.decrypt(localStorage.getItem('course'), this.envr.encDecConfig.key);
                if (decryptedValue.toString()) {
                    this.routeData = JSON.parse(decryptedValue.toString(CryptoJS.enc.Utf8));
                }
            } catch (e) {
                this._error.throwError(e);
            }
        }
    }


    private setCourse() {
        localStorage.removeItem('course');
        try {
            let encryptedData = CryptoJS.AES.encrypt(JSON.stringify(this.routeData), this.envr.encDecConfig.key).toString();
            localStorage.setItem('course', encryptedData);
        } catch (e) {
            this._error.throwError(e);
        }
    }
    // .routing

}