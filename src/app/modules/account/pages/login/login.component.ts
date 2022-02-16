import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/core/services/account.service';
import { AccountListService } from '@app/core/services/accountList.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  SysGuid = 'f2e55b46-c464-e911-a830-000d3aa058cb';
  Roles: any;
  userRoles = { '0': 'account_requestor', '1': 'account_requestor', '2': 'sbu', '3': 'cso' };
  constructor(public service: AccountService, public accountListService: AccountListService,
    private EncrDecr: EncrDecrService) { }

  ngOnInit() {
    let userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
    console.log('1234554321--->', userId);

    if (userId) this.SysGuid = userId;
    this.accountListService.getRoles(this.SysGuid).subscribe(res => {
      console.log(res);
      if (!res.IsError && res.ResponseObject) {
        this.Roles = this.filter(res.ResponseObject);
        console.log("roles array", this.Roles);
      }
    })
  }

  filter(data) {
    if (data.length > 0) {
      console.log("data roles", data);
      return data.map((role) => {
        return {
          Name: role.Role.Name,
          RoleId: role.Role.RoleId,
          RoleImage: role.Role.RoleImage,
          RoleType: role.Role.RoleType,
        }
      })
    }
  }
  checkRole(id) {
    let roleGuid = this.EncrDecr.set('EncryptionEncryptionEncryptionEn', id, 'DecryptionDecrip');
    localStorage.setItem('roleGuid', roleGuid);
  }
  setUser(user) {
    if (user.RoleType != 1 && user.RoleType != 2 && user.RoleType != 3) user.RoleType = 1;
    console.log(this.userRoles['' + user.RoleType + ''], user.RoleType);

    // this.service.loggedin_user=user;
    this.service.loggedin_user == this.userRoles['' + user.RoleType + ''];
    let temp = this.EncrDecr.set('EncryptionEncryptionEncryptionEn', user.RoleType, 'DecryptionDecrip');
    let log_user = this.EncrDecr.set('EncryptionEncryptionEncryptionEn', this.userRoles['' + user.RoleType + ''], 'DecryptionDecrip');
    localStorage.setItem("roleType", temp);
    localStorage.setItem("loggedin_user", log_user);
  }
}
