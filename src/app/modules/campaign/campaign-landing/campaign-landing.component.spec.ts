import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignLandingComponent } from './campaign-landing.component';

describe('CampaignLandingComponent', () => {
  let component: CampaignLandingComponent;
  let fixture: ComponentFixture<CampaignLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
