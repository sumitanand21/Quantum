import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedCampaignsComponent } from './completed-campaigns.component';

describe('CompletedCampaignsComponent', () => {
  let component: CompletedCampaignsComponent;
  let fixture: ComponentFixture<CompletedCampaignsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletedCampaignsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedCampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
