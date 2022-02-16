import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignMoreViewComponent } from './campaign-more-view.component';

describe('CampaignMoreViewComponent', () => {
  let component: CampaignMoreViewComponent;
  let fixture: ComponentFixture<CampaignMoreViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignMoreViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignMoreViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
