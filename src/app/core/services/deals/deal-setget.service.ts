import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

const routes = {};
@Injectable({
    providedIn: 'root'
})

export class GetSetMethod {
    private _class:any=false;

    setData(name:any) {
        this._class = name;
    }

    getData() {
        return this._class;
    }
}
