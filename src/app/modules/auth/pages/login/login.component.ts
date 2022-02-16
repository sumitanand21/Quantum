import { Component, OnInit } from '@angular/core';
import { environment as env } from '@env/environment';
import { AuthService } from '@app/core';
import { NewAuthConfigService } from '@app/core/services/new-auth-config.service';
import { EnvService } from '@app/core/services/env.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor( public envr : EnvService,private auth: AuthService, private newAuthConfig: NewAuthConfigService) { }

  ngOnInit() {
    if (this.envr.envName === 'MOBILEQA') {
      localStorage.clear()
      this.onMobileLogin()
    } else {
      // localStorage.clear()
      this.auth.configureWithAuthConfigApi();
      this.auth.onLogin();
    }
  }

  onMobileLogin() {
    var data = {
      "grant_type": "authorization_code",
      "client_id": this.newAuthConfig.authConfig().clientId,
      "code": sessionStorage.getItem("adfsauthcode"),
      "redirect_uri": this.envr.authConfig.redirectUrl
    }
    this.auth.onGenerateToken(data);
  }

}
