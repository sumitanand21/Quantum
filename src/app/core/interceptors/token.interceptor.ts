import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpHeaders
} from "@angular/common/http";
import { AuthService, ErrorMessage } from "@app/core/services";
import { mergeMap } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment as env } from "@env/environment";
import { EncrDecrService } from "../services/encr-decr.service";
import { OnlineOfflineService } from '../services/online-offline.service';
import { EnvService } from "../services/env.service";
import { throwError } from "rxjs";
import { Router } from "@angular/router";
// const BASE_URL = env.l2oBaseUrl;
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    public envr : EnvService,
    private AuthService: AuthService,
    public encrDecrService: EncrDecrService,
    private errPopup: ErrorMessage,
    private OnlineOfflineService: OnlineOfflineService,
    public envService: EnvService,
    public router : Router
  ) { }
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let userId = "";
    console.log("INSIDE INTErSCEPTOR!!!");
    console.log(req);
    // if(this.envService.maintainence) {
    //   this.router.navigate(['/maintainance'])
    //   return throwError('')
    // }
    try {
      // for user id
      if (localStorage.getItem("userID") !== null) {
        userId = this.encrDecrService.get(
          "EncryptionEncryptionEncryptionEn",
          localStorage.getItem("userID"),
          "DecryptionDecrip"
        );
      }
      if (req.body) {
        if (req.body.isRefresh == true) {
          return next.handle(req);
        }
      }
      if (req.url === "https://ocr-dev.wipro.com/v2.0/ocr/businesscard") {
        const headers = req.headers;
        return next.handle(req.clone({ headers }));
      }
      else if (
        req.url.includes("/api/v1/DPSWcfRestServiceRLS/CREATEEXCELUPLOAD")
      ) {
        const authToken = localStorage.getItem("token");
        const authRequest = req.clone({
          headers: new HttpHeaders({
            // "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
            appCode: "L2O01",
            securityCode: "L2O01q364623g234746723@#$%$#@"
          }),
          withCredentials: this.envService.withCredentials 
        });
        return next.handle(authRequest);
      } else if (req.url.includes("api/v1/DPSWcfRestServiceRLS/UploadFile")) {
        const authToken = localStorage.getItem("token");
        const authRequest = req.clone({
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
            appCode: "L2O01",
            securityCode: "L2O01q364623g234746723@#$%$#@"
          }),
          withCredentials: this.envService.withCredentials  
        });
        return next.handle(authRequest);
      } else if (
        req.url.includes("api/v1/DPSWcfRestService/UploadFileMilestone_v_1")
      ) {
        const authToken = localStorage.getItem("token");
        const authRequest = req.clone({
          headers: new HttpHeaders({
            // "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
            appCode: "L2O01",
            securityCode: "L2O01q364623g234746723@#$%$#@"
          }),
          withCredentials: this.envService.withCredentials  
        });
        return next.handle(authRequest);
      } else if (
        req.url.includes("https://qawittyapi.wittyparrot.com/wittyparrot/api/")
      ) {
        const authRequest = req.clone({
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "bearer 5aecfc5b-b9ba-4cce-a5ba-78347e79e9e9"
          }),
          withCredentials: this.envService.withCredentials  
        });
        return next.handle(authRequest);
      } else if (req.url.includes("/StorageCommon/UploadDocument_V_1")) {
        const authToken = localStorage.getItem("token");
        const authRequest = req.clone({
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
            appCode: "L2O01",
            securityCode: "L2O01q364623g234746723@#$%$#@"
          }),
          withCredentials: this.envService.withCredentials  
        });
        return next.handle(authRequest);
      } else if (req.url.includes("/Storage/UploadDocument")) {
        // let authToken = localStorage.getItem('token')
        let authRequest = req.clone({
          headers: new HttpHeaders({
            "Content-Type": "multipart/form-data"
          }),
          withCredentials: this.envService.withCredentials  
        });

        const headers = req.headers;
        return next.handle(req.clone({ headers }));
      } else if (req.url.includes("/api/v5/DealFolder/UploadDocument_V1")) {
        const authToken = localStorage.getItem("token");
        const deal = JSON.parse(
          this.encrDecrService.get(
            "EncryptionEncryptionEncryptionEn",
            sessionStorage.getItem("Dealoverview"),
            "DecryptionDecrip"
          )
        );
        const user = localStorage.getItem("upn");
        const propId = localStorage.getItem("propId");
        const parentId = localStorage.getItem("parentId");
        const folderId = localStorage.getItem("folderId");
        const adid = this.encrDecrService.get(
          "EncryptionEncryptionEncryptionEn",
          localStorage.getItem("adid"),
          "DecryptionDecrip"
        );
        const authRequest = req.clone({
          headers: new HttpHeaders({
            Authorization: "Bearer " + authToken,
            appCode: "L2O01",
            securityCode: "L2O01q364623g234746723@#$%$#@",
            DealId: deal.id,
            CreatedBy: adid + "" + "|" + "" + user.split('(')[0].trim(),
            ProposalId: "0",
            FolderId: folderId,
            ParentId: parentId
          }),
          withCredentials: this.envService.withCredentials  
        });
        return next.handle(authRequest);
      } else if (
        req.url.includes("/api/v5/DealFolder/UploadProposalDocument_V1")
      ) {
        const authToken = localStorage.getItem("token");
        const deal = JSON.parse(
          this.encrDecrService.get(
            "EncryptionEncryptionEncryptionEn",
            sessionStorage.getItem("Dealoverview"),
            "DecryptionDecrip"
          )
        );
        const user = localStorage.getItem("upn");
        const propId = localStorage.getItem("propId");
        const actnId = localStorage.getItem("actnId");
        const proSubDate = localStorage.getItem("proSubDate").toString();
        const adid = this.encrDecrService.get(
          "EncryptionEncryptionEncryptionEn",
          localStorage.getItem("adid"),
          "DecryptionDecrip"
        );
        const authRequest = req.clone({
          headers: new HttpHeaders({
            //'Content-Type': 'application/json',
            Authorization: "Bearer " + authToken,
            DealId: deal.id,
            CreatedBy: adid + "" + "|" + "" + user.split('(')[0].trim(),
            ProposalId: propId + "|" + proSubDate,
            OpportunityId: deal.oppID,
            ActionId: actnId ? actnId : "",
            //ProposalSubmissionDate: proSubDate
          }),
          withCredentials: this.envService.withCredentials  
        });
        return next.handle(authRequest);
      } else if (
        req.url.includes("api/v5/DealFolder/UploadActionlDocument_V1")
      ) {
        const authToken = localStorage.getItem("token");
        const deal = JSON.parse(
          this.encrDecrService.get(
            "EncryptionEncryptionEncryptionEn",
            sessionStorage.getItem("Dealoverview"),
            "DecryptionDecrip"
          )
        );
        const user = localStorage.getItem("upn");
        const actionID = localStorage.getItem("actionID");
        const adid = this.encrDecrService.get(
          "EncryptionEncryptionEncryptionEn",
          localStorage.getItem("adid"),
          "DecryptionDecrip"
        );
        const authRequest = req.clone({
          headers: new HttpHeaders({
            //'Content-Type': 'application/json',
            Authorization: "Bearer " + authToken,
            DealId: deal.id,
            CreatedBy: adid + "" + "|" + "" + user,
            ActionId: actionID,
            ProposalId: "0",
            FolderId: "0",
            ParentId: "0",
            OpportunityId: deal.oppID
          }),
          withCredentials: this.envService.withCredentials  
        });
        return next.handle(authRequest);
      } else if (req.url.includes("/api/v5/WittyParrot/ListCategorizedId")) {
        const authRequest = req.clone({
          headers: new HttpHeaders({
            //'Content-Type': 'application/json',
            Authorization: JSON.stringify(localStorage.getItem('token'))
          }),
          withCredentials: this.envService.withCredentials  

        });
        console.log('WittyParrot/ListCategorizedId', authRequest)
        return next.handle(authRequest);
      } else if (req.url.includes("/api/v5/WittyParrot/ListwithInfoId")) {
        const authRequest = req.clone({
          headers: new HttpHeaders({
            //'Content-Type': 'application/json',
            Authorization: JSON.stringify(localStorage.getItem('token'))
            //Authorization: "Bearer 2cc1ae0c-0cd3-432e-bbd5-9b986754ef76"
          }),
          withCredentials: this.envService.withCredentials  
        });
        console.log('WittyParrot/ListwithInfoId', authRequest)
        return next.handle(authRequest);
      } else if (req.url.includes("wipro.com/L2O.Sprint5A.Api/api/v5")) {
        const authToken = localStorage.getItem("token");
        let deal: any = { oppID: "" };
        if (sessionStorage.getItem("Dealoverview")) {
          deal = JSON.parse(
            this.encrDecrService.get(
              "EncryptionEncryptionEncryptionEn",
              sessionStorage.getItem("Dealoverview"),
              "DecryptionDecrip"
            )
          );
        }
        const user = localStorage.getItem("upn");
        const adid = this.encrDecrService.get(
          "EncryptionEncryptionEncryptionEn",
          localStorage.getItem("adid"),
          "DecryptionDecrip"
        );
        const headers = req.clone({
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            appCode: "L2O01",
            Authorization: "Bearer " + authToken,
            OpportunityId: deal.oppID,
            CreatedBy: adid + "" + "|" + "" + user
          }),
          withCredentials: this.envService.withCredentials  
        });
        return next.handle(headers);
      } else if (req.url.includes("/L2O.Sprint5A.Api/api/v5/wittyParrot/")) {
        const authRequest = req.clone({
          headers: new HttpHeaders({
            //'Content-Type': 'application/json',
            Authorization: "bearer 2b5465ac-beaa-4a1f-8ee1-9101be33cd78"
            // 'Authorization': 'bearer f9a90bb7-a065-4230-b786-a4d3437c4605'
          }),
          withCredentials: this.envService.withCredentials  
        });
        return next.handle(authRequest);
      } else if (req.url.includes("/DNBController")) {
        const authToken = localStorage.getItem("token");
        const dnbtoken = localStorage.getItem("dNBToken");
        const authRequest = req.clone({
          headers: new HttpHeaders({
            Authorization: "Bearer " + authToken,
            "Content-Type": "application/json",
            appCode: "L2O01",
            dNBToken: dnbtoken
          }),
          withCredentials: this.envService.withCredentials  
        });
        return next.handle(authRequest);
      }  else {
        let authToken = null;
        if (localStorage.getItem("token")) {
          authToken = localStorage.getItem("token");
        }
        let roleGuid = "";
        if (localStorage.getItem("roleGuid")) {
          roleGuid = localStorage.getItem("roleGuid");
        }
        let sysncToken = "";
        if (sessionStorage.getItem("SysnToken")) {
          sysncToken = JSON.parse(sessionStorage.getItem("SysnToken"));
        }
        let incrpRole;
        if (roleGuid)
          incrpRole = this.encrDecrService.get(
            "EncryptionEncryptionEncryptionEn",
            roleGuid,
            "DecryptionDecrip"
          );
        // let dnbtoken = localStorage.getItem("dNBToken");
        let authRequest;
        if (req.url.includes(this.envr.camunda_BASE_URL)) {
          authRequest = req.clone({
            headers: new HttpHeaders({
              // req.headers.set('Authorization', 'Bearer ' + authToken)
              Authorization: "Bearer " + authToken,
              "Content-Type": "application/json"
            }),
            withCredentials: this.envService.withCredentials  
          });
        } else {
          authRequest = req.clone({
            headers: new HttpHeaders({
              // req.headers.set('Authorization', 'Bearer ' + authToken)
              Authorization: "Bearer " + authToken,
              "Content-Type": "application/json",
              appCode: "L2O01",
              UserGuid: userId,
              ADAuthCodeToken: sysncToken,
              roleGuid: incrpRole || ""
              
              // dNBToken: dnbtoken
            }),
            withCredentials: this.envService.withCredentials  
          });
        }

        // console.log(authToken)
        if (this.TokenExpiry(authToken) && authToken != "undefined") {
          try {
            return this.AuthService.SilientRefreshToken(req).pipe(
              mergeMap(val => {
                localStorage.setItem("token", val.ResponseObject.access_token);
                sessionStorage.setItem(
                  "reftoken",
                  val.ResponseObject.refresh_token
                    ? val.ResponseObject.refresh_token
                    : val.ResponseObject.id_token
                );
                return next.handle(authRequest);
              })
            );
          } catch (error) {
            console.log("eror occured in toke  expiry datga!!!!!");
            console.log(error);
          }
        } else {
          return next.handle(authRequest)
          // if(env.envName !== 'MOBILEQA'){
          //   return next.handle(authRequest)
          // } else {
          //   if (this.OnlineOfflineService.isOnline) {
          //     console.log('')
          //     return next.handle(authRequest)
          //   } else {
          //     this.errPopup.throwError("Oops! There seems to be network connectivity issue. Please check your internet")
          //   }
          // }
        }
      }
    } catch (error) {
      console.log("error occured in cath TOKen intersceptor!!!!");
      console.log(error);
    }
  }

  TokenExpiry(token): boolean {
    //console.log("im inside the token expiry check")
    //console.log(token)
    try {
      if (token) {
        if (token != undefined || token != null) {
          console.log("INSIDE");
          const helper = new JwtHelperService();
          console.log(helper.isTokenExpired(token));
          return helper.isTokenExpired(token);
        } else {
          console.log("else");
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      console.log("token error occured");
    }
  }
}
