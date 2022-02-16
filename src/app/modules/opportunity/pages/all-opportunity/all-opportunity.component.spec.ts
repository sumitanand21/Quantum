import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllOpportunityComponent } from './all-opportunity.component';

describe('AllOpportunityComponent', () => {
  let component: AllOpportunityComponent;
  let fixture: ComponentFixture<AllOpportunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllOpportunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllOpportunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
