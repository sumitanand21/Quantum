import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment as env } from '@env/environment';
import { forkJoin, of ,Observable,throwError} from "rxjs";
import { catchError, map } from "rxjs/operators";
import { EncrDecrService } from "./encr-decr.service";
import { ApiService } from "./api.service";
import { EnvService } from "./env.service";

export const routes = {
  getUplaod : 'v1/AccountManagement/Download64Document'
}
const envADAL = new EnvService();

// Read environment variables from browser window

const browserWindow = window || {};
const browserWindowEnv = browserWindow['__env'] || {};

// Assign environment variables from browser window to env
// In the current implementation, properties from env.js overwrite defaults from the EnvService.

// If needed, a deep merge can be performed here to merge properties instead of overwriting them.

for (const key in browserWindowEnv) {
  if (browserWindowEnv.hasOwnProperty(key)) {

    envADAL[key] = window['__env'][key];
  }
}

const BASE_URL = envADAL.l2oBaseUrl;
@Injectable({
    providedIn: 'root'
})
export class FileUploadService {
  imageToTextApi = 'v1/AccountManagement/BusinessCard'
    constructor(private http: HttpClient,
        private encService: EncrDecrService,
        private apiService: ApiService,
        private httpClient: HttpClient,public envr:EnvService) { }

    fileUpload(file) {
        return this.http.post(`${BASE_URL}Storage/UploadDocument`, file);
    }

    filesToUpload(list) {
      const requestOptions = {
        headers: new HttpHeaders({
         'Authorization': "Bearer " + localStorage.getItem("token")
        }),
        withCredentials: this.envr.withCredentials
       };
        let fileListArray = []
        list.forEach(file => {
            fileListArray.push(this.http.post(`${BASE_URL}Storage/UploadDocument`, file, requestOptions).pipe(catchError(e => of(''))))
        });
        return forkJoin(fileListArray)
    }

    filesToUploadDocument64(list) {
      const requestOptions = {
        headers: new HttpHeaders({
         'Authorization': "Bearer " + localStorage.getItem("token")
        }),
        withCredentials: this.envr.withCredentials
       };
        let fileListArray = []
        list.forEach(file => {
            fileListArray.push(this.http.post(`${BASE_URL}Storage/UploadDocument64`, file, requestOptions).pipe(catchError(e => of(''))))
        });
        return forkJoin(fileListArray)
    }

    base64to_ocr(basefile: string) : Observable<any> {
      debugger;
      const requestOptions = {
        headers: new HttpHeaders({
         'Authorization': "Bearer " + localStorage.getItem("token")
        }),
        withCredentials: this.envr.withCredentials
       };
      console.log("image upload service");
      let basfileobj = { 'businesscard': basefile };
      console.log("imageeeeeee", basfileobj);
      return this.http.post(`${BASE_URL}${this.imageToTextApi}`, basfileobj, requestOptions);
  }

    public formatErrors(error: any): Observable<any> {
        return throwError(error.error);
      }

    // filesToDownloadDocument64(list) {
    //   const requestOptions = {
    //     headers: new HttpHeaders({
    //      'Authorization': "Bearer " + localStorage.getItem("token")
    //     }),
    //     withCredentials: true
    //    };
    //     console.log(`Request Payload to ${BASE_URL}v1/AccountManagement/Download64Document api`, JSON.stringify(list));
    //     let token = localStorage.getItem("token").toString();
    //     let encrPayload = this.encService.set(
    //         token.substring(0, 32),
    //         JSON.stringify(list),
    //         env.encDecConfig.key
    //       );
    //       return this.httpClient
    //         .post(`${BASE_URL}v1/AccountManagement/Download64Document`, encrPayload, requestOptions, { responseType: "text" })
    //         .pipe(
    //           map(data => {
    //             let responseObject = JSON.parse(
    //               this.encService.get(
    //                 token.substring(0, 32),
    //                 data,
    //                 env.encDecConfig.key
    //               )
    //             );
    //             console.log(
    //               `Response from ${BASE_URL}v1/AccountManagement/Download64Document api`,
    //               JSON.stringify(responseObject)
    //             );
    //             return responseObject;
    //           }),
    //           catchError(this.formatErrors)
    //         );
    // }

    filesToDownloadDocument64(obj): Observable<any> {
      return this.apiService.post(routes.getUplaod, obj);
  }
}