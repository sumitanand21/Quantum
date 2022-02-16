import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingOpportunityComponent } from './landing-opportunity.component';

describe('LandingOpportunityComponent', () => {
  let component: LandingOpportunityComponent;
  let fixture: ComponentFixture<LandingOpportunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingOpportunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingOpportunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
