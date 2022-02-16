import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs';


const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class AutoSaveServiceClass {
    constructor(private http: HttpClient) { }

    sampleTest;

    /*********************************/
    baseUrl2 = 'http://10.208.116.172:8080/autosaveapi/autosavedobject';
    // baseUrl2 = 'http://localhost:9090/autosavedobject';

    autoSave(autoSaveKey: string, pageId: string, modelObject: any):Observable<any> {
        return of(null);
        // return this.http.post(this.baseUrl2 + '?autoSaveKey=' + autoSaveKey + '&pageId=' + pageId, modelObject, httpOptions);
        // this.sampleTest = modelObject;
        // localStorage.setItem(autoSaveKey + '_' + pageId, this.sampleTest);
    }

    deleteAutoSavedObject(autoSaveKey: string, pageId: string):Observable<any> {
        return of(null);
        // return this.http.delete(this.baseUrl2 + '?autoSaveKey=' + autoSaveKey + '&pageId=' + pageId, httpOptions);
    }

    getAutoSavedObject(autoSaveKey: string, pageId: string):Observable<any> {
        return of(null);
        // return this.http.get(this.baseUrl2 + '?autoSaveKey=' + autoSaveKey + '&pageId=' + pageId, httpOptions);
        // this.sampleTest = localStorage.getItem(autoSaveKey + '_' + pageId);
    }
    /********************************/
}