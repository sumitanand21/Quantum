import { Injectable } from "@angular/core";
import { of, Observable, throwError, Subject } from "rxjs";
import { EncrDecrService } from "@app/core/services/encr-decr.service";
import {
  OAuthService,
  JwksValidationHandler,
  AuthConfig
} from "../../../../node_modules/angular-oauth2-oidc";
import { authConfig } from "@app/core/services/auth.config";
import { environment as env } from "@env/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { ConversationService } from "@app/core/services/conversation.service";
import { OfflineService } from "./offline.services";
import * as fromRedirect from "../../modules/auth/pages/redirect/redirect.component";
import { ApiService } from "@app/core/services/api.service";
import { MatSnackBar } from "@angular/material";
import { MasterApiService } from "./master-api.service";
import { S3MasterApiService } from "./master-api-s3.service";
import { ErrorMessage } from "./error.services";
import { NewAuthConfigService } from "./new-auth-config.service";
import { EnvService } from "./env.service";
// import { Http, Response, RequestOptions, Headers } from '@angular/http'
export class ILoginContext {
  adId: string;
  token: string;
}
const defaultUser = {
  username: "Ranju",
  password: "123456",
  token: "123456"
};

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
  providedIn: "root"
})
export class AuthService {
  tokenValue: any;
  employeeId: any;
  private authStatusListener = new Subject<boolean>();
  dnbtoken: any;
  constructor(
    public envr : EnvService,
    private newAuthconfig: NewAuthConfigService,
    private http: HttpClient,
    private EncrDecr: EncrDecrService,
    private oauthService: OAuthService,
    private router: Router,
    private apiService: ApiService,
    private masterService: MasterApiService,
    private errPopup: ErrorMessage,
    public matSnackBar: MatSnackBar,
    public master3Api: S3MasterApiService,
    private conversationService: ConversationService,
    private offlioneServcice: OfflineService,
    private envServcice: EnvService
  ) {}
  login(loginContext: ILoginContext) {
    this.tokenValue = this.EncrDecr.set(
      "EncryptionEncryptionEncryptionEn",
      loginContext.token,
      "DecryptionDecrip"
    );
    localStorage.setItem("user", this.tokenValue);
    return of(this.tokenValue);
  }
  
  get userInfo() {
    var decr = localStorage.getItem("user");
    var value = this.EncrDecr.get(
      "EncryptionEncryptionEncryptionEn",
      localStorage.getItem("user"),
      "DecryptionDecrip"
    );
    console.log(value,"userInfo");
    return value;
  }

  logout(): Observable<boolean> {
    this.oauthService.logOut();
    return of(false);
  }

  logoff() {
    if(localStorage.getItem("AuditId")){
      this.EditUserAudit(localStorage.getItem("AuditId"));
    }
    localStorage.clear();
    sessionStorage.clear();
    this.oauthService.logOut(false);
    this.oauthService.logoutUrl = this.oauthService.logoutUrl
      ? this.oauthService.logoutUrl
      : this.envr.authConfig.logoutUrl;
    console.log("logout url.........", this.oauthService.logoutUrl);
    window.location.href = this.oauthService.logoutUrl;
  }

  getToken() {
    return this.getToken;
  }

  onLogin() {
    this.oauthService.initImplicitFlow();
  }

  public configureWithAuthConfigApi() {
    //console.log('state in');
  const authConfig: AuthConfig =this.newAuthconfig.authConfig()
    this.oauthService.configure(authConfig);
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.tryLogin({
      onTokenReceived: info => {
        console.log("state", info.state);
      }
    });
  }

  // SilientRefreshToken(nextreq): Observable<any> {
  //   console.log("inisde silient refrresh tojken ");
  //   let reqBody = {
  //     grant_type: this.envr.authConfig.grantType,
  //     code: sessionStorage.getItem("authcode"),
  //     client_id: this.newAuthconfig.authConfig().clientId,
  //     // "client_secret": environment.authConfig.clientSecret,
  //     redirect_uri: this.envr.authConfig.redirectUrl,
  //     refresh_token: sessionStorage.getItem("reftoken"),
  //     isRefresh: true
  //   };
  //   console.log("requ ets body for refresh token!!!1");
  //   console.log(reqBody);
  //   let headers = new HttpHeaders().set("Content-Type", "application/json");
  //   headers = headers.set(
  //     "Authorization",
  //     "Bearer " + localStorage.getItem("token")
  //   );

  //   return this.http.post<any>(BASE_URL + "ADFS/RefreshToken_V2", reqBody, {
  //     headers: headers
  //   });
  // }
  SilientRefreshToken(nextreq): Observable<any> {
    console.log("inisde silient refrresh tojken ");
    let reqBody = {
      grant_type: this.envr.authConfig.grantType,
      code: sessionStorage.getItem("authcode"),
      client_id: this.newAuthconfig.authConfig().clientId,
      // "client_secret": environment.authConfig.clientSecret,
      redirect_uri: this.envr.authConfig.redirectUrl,
      refresh_token: sessionStorage.getItem("reftoken"),
      isRefresh: true
    };
    console.log("requ ets body for refresh token!!!1");
    console.log(reqBody);
    // let headers = new HttpHeaders().set("Content-Type", "application/json");
    // headers = headers.set(
    //   "Authorization",
    //   "Bearer " + localStorage.getItem("token")
    // );
    const requestOptions = {
      headers: new HttpHeaders({
        "Content-Type":"application/json",
       'Authorization': "Bearer " + localStorage.getItem("token")
      }),
      withCredentials: this.envr.withCredentials
     };
    return this.http.post<any>(BASE_URL + "ADFS/RefreshToken_V2", reqBody, requestOptions);
  }
  onGenerateToken(body) {
    console.log("gettig generate token data");
    console.log(BASE_URL + "ADFS/GenerateToken_V2");
    console.log(body);
    this.http
      .post<any>(BASE_URL + "ADFS/GenerateToken_V2", body)
      .subscribe(async response => {
        console.log(response);
        if (response) {
          if (
            response.ResponseObject != undefined &&
            response.ResponseObject != null
          ) {
            const token = response.ResponseObject.access_token;
            const refreshToken = response.ResponseObject.refresh_token;
            //  await this.offlioneServcice.ClearindexDb()
            sessionStorage.setItem("authcode", body.code);
            sessionStorage.setItem("reftoken", refreshToken);
            localStorage.setItem("token", token);
            // this.router.navigate(['/home/dashboard'])
            this.authStatusListener.next(true);
            // Decoding the JWT Token
            if (localStorage.getItem("token") != "undefined") {
              const base64Url = token.split(".")[1];
              const base64 = base64Url.replace("-", "+").replace("_", "/");
              const decodedToken = JSON.parse(window.atob(base64));
              console.log("decoded token", JSON.stringify(decodedToken));
              localStorage.setItem("upn", decodedToken.unique_name[0].split('(')[0].trim());
              let adid = this.EncrDecr.set(
                "EncryptionEncryptionEncryptionEn",
                decodedToken.unique_name[1].split("\\").pop(),
                "DecryptionDecrip"
              );
              localStorage.setItem("adid", adid);
              localStorage.setItem(
                "userEmail",
                JSON.stringify(decodedToken.email)
              );
              let userInfoJson = {
                EmployeeNumber: "",
                EmployeeName: decodedToken.unique_name[0],
                EmployeeId: decodedToken.unique_name[1].split("\\").pop(),
                EmployeeMail: decodedToken.email,
                ClientIP: ""
              };
              console.log("userInfo", userInfoJson);
              let userInfo = this.EncrDecr.set(
                "EncryptionEncryptionEncryptionEn",
                JSON.stringify(userInfoJson),
                "DecryptionDecrip"
              );
              sessionStorage.setItem("userInfo", userInfo);
              this.GenerateUserGuid(decodedToken.email);
              if (decodedToken.sub === undefined) {
                return null;
              } else {
                const decodedEmpId = this.EncrDecr.set(
                  "EncryptionEncryptionEncryptionEn",
                  decodedToken.sub,
                  "DecryptionDecrip"
                );
                sessionStorage.setItem("empId", decodedEmpId);
                console.log("Encrypted EmpId------>", decodedEmpId);
                this.employeeId = this.EncrDecr.get(
                  "EncryptionEncryptionEncryptionEn",
                  sessionStorage.getItem("empId"),
                  "DecryptionDecrip"
                );
                console.log("Decrypted EmpId----->", this.employeeId);
              }
              return JSON.parse(window.atob(base64));
            } else {
              this.errPopup.throwError("Authrorization Token Not Available");
              this.router.navigate(["/"]);
              return null;
            }
          } else {
            this.errPopup.throwError(response.Message);
          }
        } else {
          this.errPopup.throwError("Authrorization Token Failed");
        }
      }, error=> {
        console.log(error)
      });
  }
  GenerateUserGuid(id) {
    var body = { Email: id };
    this.apiService
      .post("v1/EmployeeManagement/UserGuid", body)
      .subscribe(res => {
        if (!res.IsError) {
          console.log(res.ResponseObject.SysGuid);

          this.masterService
            .getRouteRoles(res.ResponseObject.SysGuid)
            .subscribe(routes => {
              console.log("->>>>>>>>>>>>>>>>>>>>>>>>");
              console.log(routes);
              if (!routes.IsError) {
                let userId = this.EncrDecr.set(
                  "EncryptionEncryptionEncryptionEn",
                  res.ResponseObject.SysGuid,
                  "DecryptionDecrip"
                );
                let username = this.EncrDecr.set(
                  "EncryptionEncryptionEncryptionEn",
                  res.ResponseObject.FullName,
                  "DecryptionDecrip"
                );
                localStorage.setItem("username", username);
                localStorage.setItem(
                  "routes",
                  JSON.stringify(routes.ResponseObject)
                );
                localStorage.setItem("userID", userId);
                if(!localStorage.getItem("AuditId")){
                  this.createUserAudit();
                }
                if(this.envServcice.maintainence) {
                  this.router.navigate(["/maintainance"])
                
                } else{
                  this.router.navigate(["/home/dashboard"]);
                }
                
              } else {
                let action;
                this.matSnackBar.open(res.Message, action, {
                  duration: 1000
                });
              }
            });
        } else {
          let action;
          this.matSnackBar.open(res.Message, action, {
            duration: 1000
          });
        }
      }, error=> {
        console.log(error)
      });
  }

  getdnbtoken() {
    this.master3Api.getdnbtoken("code").subscribe(
      (res: any) => {
        console.log(" dnb token ", res.ResponseObject);
        this.dnbtoken = res.ResponseObject.access_token;
        localStorage.setItem("dNBToken", this.dnbtoken);
      },
      error => console.log("error ::: ", error)
    );
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  createUserAudit() { 
      
      var module = {
          options: [],
          header: [navigator.platform, navigator.userAgent, navigator.appVersion, navigator.vendor],
          dataos: [
              { name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
              { name: 'Windows', value: 'Win', version: 'NT' },
              { name: 'iPhone', value: 'iPhone', version: 'OS' },
              { name: 'iPad', value: 'iPad', version: 'OS' },
              { name: 'Kindle', value: 'Silk', version: 'Silk' },
              { name: 'Android', value: 'Android', version: 'Android' },
              { name: 'PlayBook', value: 'PlayBook', version: 'OS' },
              { name: 'BlackBerry', value: 'BlackBerry', version: '/' },
              { name: 'Macintosh', value: 'Mac', version: 'OS X' },
              { name: 'Linux', value: 'Linux', version: 'rv' },
              { name: 'Palm', value: 'Palm', version: 'PalmOS' }
          ],
          databrowser: [
              { name: 'Chrome', value: 'Chrome', version: 'Chrome' },
              { name: 'Firefox', value: 'Firefox', version: 'Firefox' },
              { name: 'Safari', value: 'Safari', version: 'Version' },
              { name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
              { name: 'Opera', value: 'Opera', version: 'Opera' },
              { name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
              { name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' }
          ],
          init: function () {
              var agent = this.header.join(' '),
                  os = this.matchItem(agent, this.dataos),
                  browser = this.matchItem(agent, this.databrowser);
              
              return { os: os, browser: browser };
          },
          matchItem: function (string, data) {
              var i = 0,
                  j = 0,
                  html = '',
                  regex,
                  regexv,
                  match,
                  matches,
                  version;
              
              for (i = 0; i < data.length; i += 1) {
                  regex = new RegExp(data[i].value, 'i');
                  match = regex.test(string);
                  if (match) {
                      regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i');
                      matches = string.match(regexv);
                      version = '';
                      if (matches) { if (matches[1]) { matches = matches[1]; } }
                      if (matches) {
                          matches = matches.split(/[._]+/);
                          for (j = 0; j < matches.length; j += 1) {
                              if (j === 0) {
                                  version += matches[j] + '.';
                              } else {
                                  version += matches[j];
                              }
                          }
                      } else {
                          version = '0';
                      }
                      return {
                          name: data[i].name,
                          version: parseFloat(version)
                      };
                  }
              }
              return { name: 'unknown', version: 0 };
          }
      };
      
      var e = module.init();
     

    let userIdEncrypt = localStorage.getItem('userID');
    let userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', userIdEncrypt, 'DecryptionDecrip')
    let usernameEncrypt = localStorage.getItem('username');
    let username = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', usernameEncrypt, 'DecryptionDecrip')
    let browserName=e.browser.name+' '+e.browser.version;
    let OSName=e.os.name+' '+e.os.version;
    let DeviceType="Web";
    if(this.isMobile())
      DeviceType="Mobile";      
    let body = {
      UserName:username,
      UserGuid:userId,
      RefDate:new Date().toISOString(),
      Node:"node",
      DeviceType:DeviceType,
      IEVersion:browserName,
      LoginDate:new Date().toISOString(),
      ClientIPAddress:"",
      ClientSystemName:OSName
    };
    console.log('createUserAudit',body)
    this.apiService.post("v1/EmployeeManagement/CreateUserAudit", body)
    .subscribe(res => {
      if (!res.IsError) {
        console.log(res.ResponseObject,'createUserAuditRES');
        localStorage.setItem("AuditId", res.ResponseObject.AuditId);
       
      } else {
        // let action;
        // this.matSnackBar.open(res.Message, action, {
        //   duration: 1000
        // });
        console.log(res.Message,'createUserAuditAPIError');
      }
    }, error=> {
      console.log(error)
    });
  }
 isMobile() {
    var check = false;
    (function(a){
      if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) 
        check = true;
    })(navigator.userAgent||navigator.vendor);
    return check;
  };
  EditUserAudit(AuditId){
    let body = {
      LogOutDate:new Date().toISOString(),
      AuditId:AuditId
    };
    console.log('EditUserAudit',body)    
    this.apiService.post("v1/EmployeeManagement/EditUserAudit", body)
    .subscribe(res => {
      if (!res.IsError) {
        console.log(res.ResponseObject,'EditUserAuditRES');       
      } else {
        // let action;
        // this.matSnackBar.open(res.Message, action, {
        //   duration: 1000
        // });
        console.log(res.Message,'EditUserAuditAPIError');
      }
    }, error=> {
      console.log(error)
    });
  }
}
