import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestCampaignComponent } from './request-campaign.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared';
import { CoreModule } from '@app/core';
import { AppRoutingModule } from '@app/app-routing.module';
import { OAuthModule, OAuthService, UrlHelperService, OAuthLogger } from 'angular-oauth2-oidc';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { AppStateReducers, metaReducers } from '@app/core/state';
import { EffectsModule } from '@ngrx/effects';
import { environment } from '@env/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AdvancedSearchComponent } from '@app/layouts/advanced-search/advanced-search.component';
import { AuthLayoutComponent } from '@app/layouts/auth-layout/auth-layout.component';
import { ContentLayoutComponent } from '@app/layouts/content-layout/content-layout.component';
import { FooterComponent } from '@app/layouts/footer/footer.component';
import { SideNavComponent } from '@app/layouts/side-nav/side-nav.component';
import { ChatBotComponent } from '@app/layouts/chat-bot/chat-bot.component';
import { ErrorComponent } from '@app/error/error.component';
import { APP_BASE_HREF, DatePipe } from '@angular/common';

describe('RequestCampaignComponent', () => {
  let component: RequestCampaignComponent;
  let fixture: ComponentFixture<RequestCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestCampaignComponent,AdvancedSearchComponent,AuthLayoutComponent , AdvancedSearchComponent,
        ContentLayoutComponent,
        FooterComponent,
        AuthLayoutComponent,
        SideNavComponent,
        ChatBotComponent,
        ErrorComponent, ],
      imports:[FormsModule,ReactiveFormsModule,SharedModule,
        CoreModule,
        SharedModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        StoreModule.forRoot(AppStateReducers, { metaReducers }),
        EffectsModule.forRoot([]),
        !environment.production ? StoreDevtoolsModule.instrument() : []],
        providers: [{provide: APP_BASE_HREF, useValue: '/'},DatePipe,OAuthService,UrlHelperService,OAuthLogger]
    })
    .compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(RequestCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('request campoaign form should be valid',async ()=>{
     component.campaignDetailsForm.controls['Name'].setValue("demo")
     component.campaignDetailsForm.controls['SBU'].setValue("123asaewa")
     component.campaignDetailsForm.controls['Vertical'].setValue("hoizontal")
     component.campaignDetailsForm.controls['CompanyName'].setValue("compantONE")
    expect(component.campaignDetailsForm.valid).toBeTruthy()
  })
});
