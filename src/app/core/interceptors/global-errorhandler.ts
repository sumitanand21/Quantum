import { ErrorHandler, Injectable } from '@angular/core';
import { ErrorComponent } from '../../error/error.component';
import { MatDialog } from '@angular/material';


@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(private matdailog: MatDialog) {

    }

    handleError(error) {
        // your custom error handling logic 
        console.log('Run time error ----->', error);
        // this.matdailog.open(ErrorComponent, {
        //     width: '400px',
        //     data: error
        // })
    }
}