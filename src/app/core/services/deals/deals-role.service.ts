import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DealRoleService {

    roles: DealRole[];
    dealOwner: DealRole = { IsRoleMappedToUser: false };
    dealTeam: DealRole = { IsRoleMappedToUser: false };
    moduleOwner: DealRole = { IsRoleMappedToUser: false };
    moduleTeam: DealRole = { IsRoleMappedToUser: false };

    setRole(data) {
        if (data.ReturnCode === 'S') {
            this.roles = data.Output;
            this.resetValue();
            for (let i in this.roles) {
                console.log('roles', i);
                switch (this.roles[i].RoleName.toLowerCase()) {
                    case 'deal owner': {
                        this.dealOwner = this.roles[i];
                        break;
                    }
                    case 'deal team': {
                        this.dealTeam = this.roles[i];
                        break;
                    }
                    case 'module owner': {
                        this.moduleOwner = this.roles[i];
                        break;
                    }
                    case 'module team': {
                        this.moduleTeam = this.roles[i];
                        break;
                    }
                }
            }
        }

    }

    private resetValue() {
        this.dealOwner = { IsRoleMappedToUser: false };
        this.dealTeam = { IsRoleMappedToUser: false };
        this.moduleOwner = { IsRoleMappedToUser: false };
        this.moduleTeam = { IsRoleMappedToUser: false };
    }




}

export interface DealRole {
    IsRoleMappedToUser?: boolean,
    RoleID?: number,
    RoleName?: string
}

export interface Roles {
    DealOwner: boolean,
    DealTeam: boolean,
    ModuleOwner: boolean,
    ModuleTeam: boolean,

}