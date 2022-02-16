import { Component, OnInit, HostListener } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ThemeService } from '@app/core';
import { Observable } from 'rxjs';
import { DataCommunicationService } from '@app/core/services/global.service';
import { Router } from '@angular/router';
import PullToRefresh from 'pulltorefreshjs';
import { DynamicScriptLoaderService } from '@app/core/services/dynamic-script-loader-service.service';
import { environment as env } from '@env/environment';
import { EnvService } from '@app/core/services/env.service';
@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss']
})
export class ContentLayoutComponent implements OnInit {
  private overlayContainer: OverlayContainer;
  theme = 'my-light-theme';
  isDarkTheme: Observable<boolean>;

  constructor(
    public themeService: ThemeService, 
    public service:DataCommunicationService,  
    public router:Router,
    private dynamicScriptLoader: DynamicScriptLoaderService,
    public envr : EnvService) {
  }
  // sprint 3 routes added
  // Fixing UI issues after integration with development branch
  // Side nav not required in opportunity module
  containsNav = ['/accounts/accountdetails','accounts/contracts','accounts/contacts','accounts/relationshipplan','/accounts/teams','/accounts/managementlogtable','/accounts/managementlog','/accounts/DashboardDetails','/accounts/bulkteammember','accounts/addcontract','/order/orderlistbfmchild','/order/orderdetails','/accounts/ownershipHistoryList','/accounts/accountleads','/accounts/accountactivities','/accounts/accountopportunity/allopportunity','accounts/accountorders'];
  
  get routerStatus():boolean{

       return this.containsNav.some( (element:string) =>{ 
         return this.router.url.includes(element)
       }
       )
     }
    //  ClearState(){
    //   this.service.clearAllState()
    //  }
    //  @HostListener("window:CallAngularService")
    //  onCallAngularService() {
    //  this.service.clearAllState()
    //  }
  ngOnInit() {
    if(this.envr.envName !== 'MOBILEQA') {
      if(env.production) {
        this.loadScripts();
      }
    }
    
    // const ptr = PullToRefresh.init({
    //   mainElement: 'body',
    //   onRefresh() {
    //     var event = new CustomEvent("CallAngularService");
    //   }
    // });
    this.isDarkTheme = this.themeService.isDarkTheme;
    if (this.overlayContainer) {
      this.overlayContainer.getContainerElement().classList.add(this.theme);
    }
  }

  private loadScripts() {
    this.dynamicScriptLoader.load('SelfHelp').then(data => {
      // Script Loaded Successfully
    }).catch(error => console.log(error));
  }

  onThemeChange(theme: boolean) {
    this.themeService.setDarkTheme(theme);
    this.theme = (theme) ? 'my-dark-theme' : 'my-light-theme';

    if (this.overlayContainer) {
      const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
      const themeClassesToRemove = Array.from(overlayContainerClasses).filter((item: string) => item.includes('-theme'));
      if (themeClassesToRemove.length) {
        overlayContainerClasses.remove(...themeClassesToRemove);
      }
      overlayContainerClasses.add(this.theme);
    }
  }

}
