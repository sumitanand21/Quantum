import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveCampaignsComponent } from './active-campaigns.component';

describe('ActiveCampaignsComponent', () => {
  let component: ActiveCampaignsComponent;
  let fixture: ComponentFixture<ActiveCampaignsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveCampaignsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveCampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
