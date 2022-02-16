import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/services';
import { Params, ActivatedRoute } from '@angular/router';
import { environment as env } from '@env/environment';
import { NewAuthConfigService } from '@app/core/services/new-auth-config.service';
import { EnvService } from '@app/core/services/env.service';
@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
export class RedirectComponent implements OnInit {

  constructor(
    public envr : EnvService,
    private auth: AuthService,
    private activatedRoute: ActivatedRoute,
    private newAuthConfig: NewAuthConfigService
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      console.log("params.id_token", params);
      if (params.code !== undefined) this.getTokenFromHandler(params);
    });
  }

  public getTokenFromHandler(params) {
    var data = {
      "grant_type": this.envr.authConfig.grantType,
      "code": params.code,
      "client_id": this.newAuthConfig.authConfig().clientId,
      "redirect_uri": this.envr.authConfig.redirectUrl
    }
    this.auth.onGenerateToken(data);
  }
}



