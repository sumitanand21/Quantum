import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { MatDialog, MatSnackBar } from "@angular/material";
import { ErrorComponent } from "@app/error/error.component";
import { ErrorMessage, AuthService, DataCommunicationService } from "../services";
import { EncrDecrService } from "../services/encr-decr.service";
import { environment as env } from '@env/environment';
import { EnvService } from "../services/env.service";
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  action: any;

  constructor( public envr : EnvService,private dialog: MatDialog, private encService: EncrDecrService, private snackBar: MatSnackBar, public errorMessage: ErrorMessage, public authService: AuthService, public GlobalService: DataCommunicationService) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // debugger
        let message = '';
        //debugger
        console.log("error", error)
        if (error.status === 401) {
          if (error.url.includes('v1/EmployeeManagement/CreateUserAudit') || error.url.includes('v1/EmployeeManagement/EditUserAudit')) {
            return throwError('');
          } else {
            if (error.message) {
              message = error.message;
            }
            else {
              message = 'Invalid access token!';
            }
            this.dialog.open(ErrorComponent, {
              data: { message: message }
            });
          }
        }
        else if (error.status === 403) {
          // console.log('error', error)
          // this.errorMessage.throwError(error.error.Message);
          if (error.url.includes('v1/EmployeeManagement/CreateUserAudit') || error.url.includes('v1/EmployeeManagement/EditUserAudit')) {
            return throwError('');
          } else {
            if (error.url.includes('v1/AccountManagement/ValidAccount') === false) {
              let token = localStorage.getItem('token').toString()
              let errorObject = JSON.parse(this.encService.get(token.substring(0, 32), error.error, this.envr.encDecConfig.key))
              debugger
              console.log(`403 error ${errorObject}`)
              if (errorObject.Message) {
                message = errorObject.Message;
              }
              else if (errorObject.message) {
                message = errorObject.message;
              }
              else {
                message = "User doesn't have sufficient permissions to complete the task";
              }
              this.snackBar.open(message, this.action, {
                duration: 5000
              });
            }
          }
        }
        else if (error.status === 500) {
          this.GlobalService.sendErrorLoading(true);

          if (req.url.includes(this.envr.camunda_BASE_URL)) {
            if (error.error.message) {
              message = error.error.message;
            }
          }
          else if (!req.url.includes(this.envr.camunda_BASE_URL)) {
            if (error.message) {
              message = error.message;
            }
          }
          else {
            message = 'Oops! There seems to be some technical snag! Could you raise a Helpline ticket?';
          }
          this.snackBar.open(message, this.action, {
            duration: 5000
          });
        }
        else if (error.status === 400) {
          message = error.error.Message;
          this.snackBar.open(message,
            this.action, {
            duration: 5000
          });
        }
        else if (error.status === 406) {
          if (error.url.includes('v1/EmployeeManagement/CreateUserAudit') || error.url.includes('v1/EmployeeManagement/EditUserAudit')) {
            return throwError('');
          } else {
            let token = localStorage.getItem('token').toString()
            let errorObject = JSON.parse(this.encService.get(token.substring(0, 32), error.error, this.envr.encDecConfig.key))
            if (errorObject.Message) {
              message = errorObject.Message;
            }
            else if (errorObject.message) {
              message = errorObject.message;
            }
            else {
              message = 'You are not Authorised to perform this Action';
            }
            this.snackBar.open(message,
              this.action, {
              duration: 5000
            });
            setTimeout(() => {
              this.authService.logoff()                 // When no token is present navigate back to login page
            }, 5000)
          }

          // this.authService.logoff()
        }
        else if (error.status === 0) {
          // network error issue
          if (this.envr.envName === 'MOBILEQA') {
            this.snackBar.open("Oops! There seems to be network connectivity issue. Please check your internet",
              this.action, {
              duration: 5000
            });
            return throwError('');
          }
        }
        else {
          if (error.message) {
            message = error.message;
          }
          else {
            message = 'something went wrong, try again later !!';
          }
          this.snackBar.open(message,
            this.action, {
            duration: 5000
          });
        }
        return throwError(error);
      })
    );
  }
}
