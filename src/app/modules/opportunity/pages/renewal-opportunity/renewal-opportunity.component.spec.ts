import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalOpportunityComponent } from './renewal-opportunity.component';

describe('RenewalOpportunityComponent', () => {
  let component: RenewalOpportunityComponent;
  let fixture: ComponentFixture<RenewalOpportunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewalOpportunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewalOpportunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
