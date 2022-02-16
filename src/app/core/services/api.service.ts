import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpBackend
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment as env, environment } from "@env/environment";
import { Observable, throwError } from "rxjs";
import { catchError, tap, map } from "rxjs/operators";
import { EncrDecrService } from "@app/core/services/encr-decr.service";
import { EnvService } from "./env.service";
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
const BASE_URL_UI = envADAL.serverUrl;
const BASE_URL = envADAL.l2oBaseUrl;
const BASE_URL_F3 = envADAL.l3oBaseUrl;
const camunda_BASE_URL = envADAL.camunda_BASE_URL;
const BASE_URL_Opportunity = envADAL.l2oBaseUrlOpportunity;
const BASE_URL_DECRIPT = envADAL.l2oBaseUrlOpportunityDecript
const BASE_URL_Order = envADAL.l2oBaseUrlOrder;
const BASE_URL_Deal5A = envADAL.sprint5BaseUrl.QaURL5A;
const BASE_URL_Deal5B = envADAL.sprint5BaseUrl.QaURL;
@Injectable({
  providedIn: "root"
})
export class ApiService {
  private options = {
    headers: new HttpHeaders().set("Content-Type", "application/json"),
    // withCredentials: true 
  };
  // CommonBaseUrl: "https://quapi-dev.wipro.com/L2O.Common.Services.Api/api/";
  

  constructor(
    private httpClient: HttpClient,
    private encService: EncrDecrService,
    public envr : EnvService,
  ) { }

  public get(
    path: string,
    params: HttpParams = new HttpParams()
  ): Observable<any> {
    let baseurl_sprint = "";
    if (path.includes("/v3/")) {
      baseurl_sprint = BASE_URL_F3;
    } else {
      baseurl_sprint = BASE_URL;
    }
    return this.httpClient
      .get(baseurl_sprint + path, { params })
      .pipe(catchError(this.formatErrors));
  }

  public getMethodResponseTypeText(
    path: string,
    params: HttpParams = new HttpParams()
  ): Observable<any> {
    let baseurl_sprint = "";
    if (path.includes("/v3/")) {
      baseurl_sprint = BASE_URL_F3;
    } else {
      baseurl_sprint = BASE_URL;
    }
    return this.httpClient
      .get(baseurl_sprint + path, { params, responseType: "text" })
      .pipe(catchError(this.formatErrors));
  }

  public put(path: string, body: object = {}): Observable<any> {
    return this.httpClient
      .put(BASE_URL + path, JSON.stringify(body), this.options)
      .pipe(catchError(this.formatErrors));
  }

  public post(path: string, body: object = {}): Observable<any> {
    console.log(`Request Payload to ${path} api`, JSON.stringify(body));
    let token = localStorage.getItem("token").toString();
    let baseurl_sprint =
      ""; /* check for the sprints base urls, condition to be changed if the sprint count increases*/
    if (path.includes("v3/")) {
      baseurl_sprint = BASE_URL_F3;
    } else {
      baseurl_sprint = BASE_URL;
    }
    if (!envADAL.encryptFlag) {
      return this.httpClient
        .post(baseurl_sprint + path, body)
        .pipe(
          map(data => {
            return data;
          }),
          catchError(this.formatErrors)
        );
    } else {
      let encrPayload = this.encService.set(
        token.substring(0, 32),
        JSON.stringify(body),
        envADAL.encDecConfig.key
      );
      return this.httpClient
        .post(baseurl_sprint + path, encrPayload, { responseType: "text" })
        .pipe(
          map(data => {
            let responseObject = JSON.parse(
              this.encService.get(
                token.substring(0, 32),
                data,
                envADAL.encDecConfig.key
              )
            );
            console.log(
              `Response from ${path} api`,
              JSON.stringify(responseObject)
            );
            return responseObject;
          }),
          catchError(this.formatErrors)
        );
    }
  }

  public postCommonController(
    path: string,
    body: object = {}
  ): Observable<any> {
    let token = localStorage.getItem("token").toString();
    let baseurl_sprint = this.envr.CommonBaseUrl;
    if (!envADAL.encryptFlag) {
      return this.httpClient
        .post(baseurl_sprint + path, body)
        .pipe(
          map(data => {
            return data;
          }),
          catchError(this.formatErrors)
        );
    } else {
      let encrPayload = this.encService.set(
        token.substring(0, 32),
        JSON.stringify(body),
        envADAL.encDecConfig.key
      );
      return this.httpClient
        .post(baseurl_sprint + path, encrPayload, { responseType: "text" })
        .pipe(
          map(data => {
            let responseObject = JSON.parse(
              this.encService.get(
                token.substring(0, 32),
                data,
                envADAL.encDecConfig.key
              )
            );
            return responseObject;
          }),
          catchError(this.formatErrors)
        );
    }
  }

  /* Camunda POST API  ** START** KKN */
  public camunda_post(path: string, body: object = {}): Observable<any> {
    let token = localStorage.getItem("token").toString();
    if (!envADAL.encryptFlag) {
      return this.httpClient
      .post(camunda_BASE_URL + path, JSON.stringify(body), this.options)
        .pipe(
          map(data => {
            return data;
          }),
          catchError(this.formatErrors)
        );
    } else {
      let encrPayload = this.encService.set(
        token.substring(0, 32),
        JSON.stringify(body),
        envADAL.encDecConfig.key
      );
      return this.httpClient
      .post(camunda_BASE_URL + path, encrPayload, { responseType: "text" })
        .pipe(
          map(data => {
            let responseObject = JSON.parse(
              this.encService.get(
                token.substring(0, 32),
                data,
                envADAL.encDecConfig.key
              )
            );
            return responseObject;
          }),
          catchError(this.formatErrors)
        );
    }
  }
  /* Camunda POST API  ** START** KKN */
  public camunda_patch(path: string, body: any = {}): Observable<any> {
    return this.httpClient
      .patch(camunda_BASE_URL + path, JSON.stringify(body), this.options)
      .pipe(catchError(this.formatErrors));
  }

  /* Camunda POST API  ** START** KKN */

  public delete(path: string): Observable<any> {
    return this.httpClient
      .delete(BASE_URL + path)
      .pipe(catchError(this.formatErrors));
  }

  public formatErrors(error: any): Observable<any> {
    return throwError(error.error);
  }

  public daPost(path: string, body: object = {}): Observable<any> {
    console.log(`Request Payload to ${path} api`, JSON.stringify(body));
    let token = localStorage.getItem("token").toString();
    if (!envADAL.encryptFlag) {
      return this.httpClient
        .post(this.envr.daApiBaseUrl + path, body)
        .pipe(
          map(data => {
            return data;
          }),
          catchError(this.formatErrors)
        );
    } else {
      let encrPayload = this.encService.set(
        token.substring(0, 32),
        JSON.stringify(body),
        envADAL.encDecConfig.key
      );
      return this.httpClient
        .post(this.envr.daApiBaseUrl + path, encrPayload, { responseType: "text" })
        .pipe(
          map(data => {
            let responseObject = JSON.parse(
              this.encService.get(
                token.substring(0, 32),
                data,
                envADAL.encDecConfig.key
              )
            );
            console.log(
              `Response from ${path} api`,
              JSON.stringify(responseObject)
            );
            return responseObject;
          }),
          catchError(this.formatErrors)
        );
    }
  }

  
  // public wittyPost(path: string, body: object = {}): Observable<any> {
  //   console.log(`Request Payload to ${path} api`, JSON.stringify(body))
  //   const token = localStorage.getItem('token').toString();
  //   const encrPayload = this.encService.set(token.substring(0, 32), JSON.stringify(body), envADAL.encDecConfig.key);
  //   return this.httpClient
  //     .post(BASE_URL_Deal5A + path, encrPayload, { responseType: "text" } )
  //     .pipe(
  //       map(data => {
  //         const responseObject = JSON.parse(this.encService.get(token.substring(0, 32), data, envADAL.encDecConfig.key));
  //         console.log(`Response from ${path} api`, JSON.stringify(responseObject));

  //         return responseObject;
  //       }),
  //       catchError(this.formatErrors));
  // }
  
  public wittyPost(path: string, body: object = {}): Observable<any> {
    console.log(`Request Payload to ${path} api`, JSON.stringify(body))
    let token = localStorage.getItem('token').toString();
    if (!this.envr.encryptFlag) {
      return this.httpClient
        .post(this.envr.wittyBaseUrl + path, body)
        .pipe(
          map(data => {
            return data;
          }),
          catchError(this.formatErrors)
        );
    }
    else {
      const encrPayload = this.encService.set(token.substring(0, 32), JSON.stringify(body), this.envr.encDecConfig.key);
      return this.httpClient
        .post(this.envr.wittyBaseUrl + path, encrPayload, { responseType: "text" } )
        .pipe(
          map(data => {
            const responseObject = JSON.parse(this.encService.get(token.substring(0, 32), data, this.envr.encDecConfig.key));
            console.log(`Response from ${path} api`, JSON.stringify(responseObject));
            return responseObject;
          }),
          catchError(this.formatErrors));
    }
  }
}

@Injectable({
  providedIn: "root"
})
export class ApiServiceUI {
  private options = {
    headers: new HttpHeaders().set("Content-Type", "application/json"),
    // withCredentials: true 
  };

  private httpClient: HttpClient;

  constructor(handler: HttpBackend) {
    this.httpClient = new HttpClient(handler);
  }

  public get(
    path: string,
    params: HttpParams = new HttpParams()
  ): Observable<any> {
    //  debugger

    return this.httpClient
      .get(BASE_URL_UI + path, { params })
      .pipe(catchError(this.formatErrors));
  }

  public put(path: string, body: object = {}): Observable<any> {
    return this.httpClient

      .put(BASE_URL_UI + path, JSON.stringify(body), this.options)

      .pipe(catchError(this.formatErrors));
  }

  public post(path: string, body: object = {}): Observable<any> {
    return this.httpClient

      .post(BASE_URL_UI + path, JSON.stringify(body), this.options)

      .pipe(catchError(this.formatErrors));
  }

  public delete(path: string): Observable<any> {
    return this.httpClient
      .delete(BASE_URL_UI + path)
      .pipe(catchError(this.formatErrors));
  }

  public formatErrors(error: any): Observable<any> {
    return throwError(error.error);
  }
}
@Injectable({
  providedIn: "root"
})
export class ApiServiceOpportunity {
  private options = {
    headers: new HttpHeaders().set("Content-Type", "application/json"),
    // withCredentials: true 
  };
  constructor(
    private httpClient: HttpClient,
    private encService: EncrDecrService
  ) { }
  public get(
    path: string,
    params: HttpParams = new HttpParams()
  ): Observable<any> {
    let token = localStorage.getItem("token").toString();
    if (!envADAL.encryptFlag) { 
      return this.httpClient
      .get(BASE_URL_Opportunity + path, { params })
      .pipe(
        map(data => {        
              return data;
        }),
        catchError(this.formatErrors)
      );
    } else { 
      return this.httpClient
      .get(BASE_URL_Opportunity + path, { params, responseType: "text" })
      .pipe(
        map(data => {        
              let responseObject = JSON.parse(
                this.encService.get(
                  token.substring(0, 32),
                  data,
                  envADAL.encDecConfig.key
                )
              );
              console.log(
                `Response from ${path} api`,
                JSON.stringify(responseObject)
              );
              return responseObject;
        }),
        catchError(this.formatErrors)
      );
    }
  }
  public put(path: string, body: object = {}): Observable<any> {
    return this.httpClient
      .put(BASE_URL_Opportunity + path, JSON.stringify(body), this.options)
      .pipe(catchError(this.formatErrors));
  }
  public post(path: string, body: object = {}, decript?): Observable<any> {
    console.log(`Request Payload to ${path} api`, JSON.stringify(body));
    let token = localStorage.getItem("token").toString();
    if (!envADAL.encryptFlag) {
      return this.httpClient
        .post(
          (decript ? BASE_URL_DECRIPT : BASE_URL_Opportunity) + path,
          decript ? body : body,
        )
        .pipe(
          map(data => {
            return data;
          }),
          catchError(this.formatErrors)
        );
    } else {
      let encrPayload = this.encService.set(
        token.substring(0, 32),
        JSON.stringify(body),
        envADAL.encDecConfig.key
      );
      return this.httpClient
        .post(
          (decript ? BASE_URL_DECRIPT : BASE_URL_Opportunity) + path,
          decript ? body : encrPayload,
          { responseType: "text" }
        )
        .pipe(
          map(data => {
            let responseObject = decript
              ? data
              : JSON.parse(
                this.encService.get(
                  token.substring(0, 32),
                  data,
                  envADAL.encDecConfig.key
                )
              );
            console.log(
              `Response from ${path} api`,
              JSON.stringify(responseObject)
            );
            return responseObject;
          }),
          catchError(this.formatErrors)
        );
    }
  }
  public delete(path: string): Observable<any> {
    return this.httpClient
      .delete(BASE_URL_Opportunity + path)
      .pipe(catchError(this.formatErrors));
  }
  public formatErrors(error: any): Observable<any> {
    return throwError(error.error);
  }
}

@Injectable({
  providedIn: "root"
})
export class ApiServiceOrder {
  private options = {
    headers: new HttpHeaders().set("Content-Type", "application/json"),
    // withCredentials: true 
  };
  constructor(
    private httpClient: HttpClient,
    private encService: EncrDecrService
  ) { }
  public get(
    path: string,
    params: HttpParams = new HttpParams()
  ): Observable<any> {
    const token = localStorage.getItem("token").toString();
    if (!envADAL.encryptFlag) {
      return this.httpClient
        .get(BASE_URL_Order + path, { params })
        .pipe(
          map(data => {
            return data;
          }),
          catchError(this.formatErrors)
        );
    } else {
      return this.httpClient
        .get(BASE_URL_Order + path, { params, responseType: "text" })
        .pipe(
          map(data => {
            const responseObject = JSON.parse(
              this.encService.get(
                token.substring(0, 32),
                data,
                envADAL.encDecConfig.key
              )
            );
            console.log(
              `Response from ${path} api`,
              JSON.stringify(responseObject)
            );
            return responseObject;
          }),
          catchError(this.formatErrors)
        );
    }
  }
  public put(path: string, body: object = {}): Observable<any> {
    return this.httpClient
      .put(BASE_URL_Order + path, JSON.stringify(body), {
        responseType: "text"
      })
      .pipe(catchError(this.formatErrors));
  }
  public post(path: string, body: object = {}): Observable<any> {
    const token = localStorage.getItem("token").toString();
    if (!envADAL.encryptFlag) {
      return this.httpClient
        .post(BASE_URL_Order + path, body)
        .pipe(
          map(data => {
            return data;
          }),
          catchError(this.formatErrors)
        );
    } else {
      const encrPayload = this.encService.set(
        token.substring(0, 32),
        JSON.stringify(body),
        envADAL.encDecConfig.key
      );
      return this.httpClient
        .post(BASE_URL_Order + path, encrPayload, { responseType: "text" })
        .pipe(
          map(data => {
            const resultVal = this.encService.get(
              token.substring(0, 32),
              data,
              envADAL.encDecConfig.key
            );
            console.log("Order post method");
            console.log(resultVal);
            const responseObject = JSON.parse(resultVal);
            console.log(
              `Response from ${path} api`,
              JSON.stringify(responseObject)
            );
            return responseObject;
          }),
          catchError(this.formatErrors)
        );
    }
  }
  public delete(path: string): Observable<any> {
    return this.httpClient
      .delete(BASE_URL_Order + path)
      .pipe(catchError(this.formatErrors));
  }
  public formatErrors(error: any): Observable<any> {
    return throwError(error.error);
  }
}

@Injectable({
  providedIn: "root"
})
export class ApiServiceDeal {
  private options = {
    headers: new HttpHeaders().set("Content-Type", "application/json"),
    // withCredentials: true 
  };
  constructor(
    private httpClient: HttpClient,
    private encService: EncrDecrService
  ) { }
  public get(
    path: string,
    params: HttpParams = new HttpParams()
  ): Observable<any> {
    const token = localStorage.getItem("token").toString();
    return this.httpClient.get(BASE_URL_Deal5A + path, { params }).pipe(
      map(data => {
        if (!envADAL.encryptFlag) {
          return data;
        } else {
          const responseObject = JSON.parse(
            this.encService.get(
              token.substring(0, 32),
              data,
              envADAL.encDecConfig.key
            )
          );
          console.log(
            `Response from ${path} api`,
            JSON.stringify(responseObject)
          );
          return responseObject;
        }
      }),
      catchError(this.formatErrors)
    );
  }
  public put(path: string, body: object = {}): Observable<any> {
    console.log(`Request Payload to ${path} api`, JSON.stringify(body));
    const token = localStorage.getItem("token").toString();
    console.log(`token`, token);
    if (!envADAL.encryptFlag) {
      return this.httpClient
        .put(BASE_URL_Deal5A + path, body)
        .pipe(
          map(data => {
            return data;
          }),
          catchError(this.formatErrors)
        );
    } else {
      const encrPayload = this.encService.set(
        token.substring(0, 32),
        JSON.stringify(body),
        envADAL.encDecConfig.key
      );
      console.log(`encrPayload`, encrPayload);
      return this.httpClient
        .put(BASE_URL_Deal5A + path, JSON.stringify(body), {
          responseType: "text"
        })
        .pipe(
          map(data => {
            const responseObject = JSON.parse(
              this.encService.get(
                token.substring(0, 32),
                data,
                envADAL.encDecConfig.key
              )
            );
            console.log(
              `Response from ${path} api`,
              JSON.stringify(responseObject)
            );
            return responseObject;
          }),
          catchError(this.formatErrors)
        );
    }
  }
  public post(path: string, body: object = {}): Observable<any> {
    console.log(`Request Payload to ${path} api`, JSON.stringify(body));
    const token = localStorage.getItem("token").toString();
    console.log(`token`, token);
    if (!envADAL.encryptFlag) {
      if (!envADAL.enableCipher) {
        return this.httpClient.post(BASE_URL_Deal5A + path, body, this.options);
      }
      return this.httpClient
        .post(BASE_URL_Deal5A + path, body)
        .pipe(
          map(data => {
            return data;
          }),
          catchError(this.formatErrors)
        );
    } else {
      const encrPayload = this.encService.set(
        token.substring(0, 32),
        JSON.stringify(body),
        envADAL.encDecConfig.key
      );
      console.log(`encrPayload`, encrPayload);
      if (!envADAL.enableCipher) {
        return this.httpClient.post(BASE_URL_Deal5A + path, body, this.options);
      }
      return this.httpClient
        .post(BASE_URL_Deal5A + path, encrPayload, { responseType: "text" })
        .pipe(
          map(data => {
            const responseObject = JSON.parse(
              this.encService.get(
                token.substring(0, 32),
                data,
                envADAL.encDecConfig.key
              )
            );
            console.log(
              `Response from ${path} api`,
              JSON.stringify(responseObject)
            );
            return responseObject;
          }),
          catchError(this.formatErrors)
        );
    }
  }
  public delete(path: string): Observable<any> {
    return this.httpClient
      .delete(BASE_URL_Deal5A + path)
      .pipe(catchError(this.formatErrors));
  }
  public formatErrors(error: any): Observable<any> {
    console.log(`formatErrors`, error);
    return throwError(error.error);
  }
}
@Injectable({
  providedIn: "root"
})
export class ApiServiceDeal5B {
  private options = {
    headers: new HttpHeaders().set("Content-Type", "application/json"),
    // withCredentials: true 
  };
  constructor(
    private httpClient: HttpClient,
    private encService: EncrDecrService
  ) { }
  public get(
    path: string,
    params: HttpParams = new HttpParams()
  ): Observable<any> {
    const token = localStorage.getItem("token").toString();
    return this.httpClient.get(BASE_URL_Deal5B + path, { params }).pipe(
      map(data => {
        if (!envADAL.encryptFlag) {
          return data;
        } else {
          const responseObject = JSON.parse(
            this.encService.get(
              token.substring(0, 32),
              data,
              envADAL.encDecConfig.key
            )
          );
          console.log(
            `Response from ${path} api`,
            JSON.stringify(responseObject)
          );
          return responseObject;
        }
      }),
      catchError(this.formatErrors)
    );
  }
  public put(path: string, body: object = {}): Observable<any> {
    return this.httpClient
      .put(BASE_URL_Deal5B + path, JSON.stringify(body), {
        responseType: "text"
      })
      .pipe(catchError(this.formatErrors));
  }
  public post(path: string, body: object = {}): Observable<any> {
    console.log(`Request Payload to ${path} api`, JSON.stringify(body));
    const token = localStorage.getItem("token").toString();
    console.log(`token`, token);
    if (!envADAL.encryptFlag) {
      if (!envADAL.enableCipher) {
        return this.httpClient.post(BASE_URL_Deal5B + path, body, this.options);
      }
      return this.httpClient
        .post(BASE_URL_Deal5B + path, body)
        .pipe(
          map(data => {
            return data;
          }),
          catchError(this.formatErrors)
        );
    } else {
      const encrPayload = this.encService.set(
        token.substring(0, 32),
        JSON.stringify(body),
        envADAL.encDecConfig.key
      );
      console.log(`encrPayload`, encrPayload);
      if (!envADAL.enableCipher) {
        return this.httpClient.post(BASE_URL_Deal5B + path, body, this.options);
      }
      return this.httpClient
        .post(BASE_URL_Deal5B + path, encrPayload, { responseType: "text" })
        .pipe(
          map(data => {
            const responseObject = JSON.parse(
              this.encService.get(
                token.substring(0, 32),
                data,
                envADAL.encDecConfig.key
              )
            );
            console.log(
              `Response from ${path} api`,
              JSON.stringify(responseObject)
            );
            return responseObject;
          }),
          catchError(this.formatErrors)
        );
    }
  }
  public delete(path: string): Observable<any> {
    return this.httpClient
      .delete(BASE_URL_Deal5B + path)
      .pipe(catchError(this.formatErrors));
  }
  public formatErrors(error: any): Observable<any> {
    console.log(`formatErrors`, error);
    return throwError(error.error);
  }
}
